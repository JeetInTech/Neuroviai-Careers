from fastapi import APIRouter, HTTPException, status
from ..models import SignUpRequest, SignInRequest, AuthResponse, PasswordResetRequest
from ..database import get_supabase_client, get_supabase_admin
from ..config import settings
from pydantic import BaseModel
import logging

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/auth", tags=["Authentication"])

@router.post("/signup", response_model=AuthResponse)
async def signup(request: SignUpRequest):
    """Register a new user"""
    supabase = get_supabase_admin()
    
    try:
        # Check if username already exists in profiles
        existing = supabase.table("profiles").select("id").eq("username", request.username.lower()).execute()
        if existing.data and len(existing.data) > 0:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Username already taken"
            )
        
        # Check if email is already registered in auth
        try:
            existing_users = supabase.auth.admin.list_users()
            for u in existing_users:
                if hasattr(u, 'email') and u.email == request.email:
                    raise HTTPException(
                        status_code=status.HTTP_400_BAD_REQUEST,
                        detail="Email already registered. Please sign in or reset your password."
                    )
        except HTTPException:
            raise
        except Exception:
            pass  # If listing fails, continue with signup
        
        # Use admin API to create user with auto-confirm (no email verification needed)
        auth_response = supabase.auth.admin.create_user({
            "email": request.email,
            "password": request.password,
            "email_confirm": True,
            "user_metadata": {
                "username": request.username.lower(),
                "display_name": request.display_name or request.username
            }
        })
        
        logger.info(f"Auth response: {auth_response}")
        
        if not auth_response.user:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Failed to create user"
            )
        
        return AuthResponse(
            success=True,
            message="Account created successfully! You can now sign in.",
            user_id=auth_response.user.id
        )
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Signup error: {str(e)}")
        error_msg = str(e)
        if "already registered" in error_msg.lower() or "already exists" in error_msg.lower():
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email already registered"
            )
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"An error occurred: {error_msg}"
        )

@router.post("/signin", response_model=AuthResponse)
async def signin(request: SignInRequest):
    """Sign in a user with email or username"""
    supabase = get_supabase_client()
    supabase_admin = get_supabase_admin()  # Use admin for username lookup (bypasses RLS)
    
    try:
        email = request.email_or_username
        
        # If not an email, look up by username using admin client
        if "@" not in request.email_or_username:
            profile = supabase_admin.table("profiles").select("email").eq(
                "username", request.email_or_username.lower()
            ).execute()
            
            if not profile.data or len(profile.data) == 0 or not profile.data[0].get("email"):
                raise HTTPException(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    detail="Invalid username or password"
                )
            email = profile.data[0]["email"]
        
        # Sign in with email and password
        auth_response = supabase.auth.sign_in_with_password({
            "email": email,
            "password": request.password
        })
        
        if not auth_response.user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid credentials"
            )
        
        return AuthResponse(
            success=True,
            message="Signed in successfully",
            user_id=auth_response.user.id,
            access_token=auth_response.session.access_token,
            refresh_token=auth_response.session.refresh_token
        )
        
    except HTTPException:
        raise
    except Exception as e:
        error_msg = str(e).lower()
        if "invalid" in error_msg or "credentials" in error_msg:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid credentials"
            )
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"An error occurred: {str(e)}"
        )

@router.post("/signout")
async def signout():
    """Sign out the current user"""
    # Note: Client-side should clear tokens
    return {"success": True, "message": "Signed out successfully"}

@router.post("/resend-confirmation")
async def resend_confirmation(request: PasswordResetRequest):
    """Resend email confirmation link"""
    supabase = get_supabase_client()
    
    try:
        # Use resend method to send a new confirmation email
        supabase.auth.resend({"type": "signup", "email": request.email})
        return {"success": True, "message": "Confirmation email sent. Please check your inbox."}
    except Exception as e:
        logger.error(f"Resend confirmation error: {str(e)}")
        # Don't reveal if email exists or not for security
        return {"success": True, "message": "If the email exists and is unverified, a confirmation link will be sent."}

@router.post("/reset-password")
async def reset_password(request: PasswordResetRequest):
    """Send password reset email with redirect to frontend reset page"""
    supabase = get_supabase_client()
    
    try:
        redirect_url = f"{settings.FRONTEND_URL}/reset-password"
        supabase.auth.reset_password_email(request.email, {
            "redirect_to": redirect_url
        })
        return {"success": True, "message": "Password reset email sent"}
    except Exception as e:
        logger.error(f"Reset password error: {str(e)}")
        # Don't reveal if email exists or not
        return {"success": True, "message": "If the email exists, a reset link will be sent"}


class UpdatePasswordRequest(BaseModel):
    access_token: str
    new_password: str


@router.post("/update-password")
async def update_password(request: UpdatePasswordRequest):
    """Update user password using the access token from the reset link"""
    supabase = get_supabase_client()
    
    try:
        # Set the session using the access token from the reset link
        session = supabase.auth.set_session(request.access_token, "")
        
        if not session or not session.user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid or expired reset token"
            )
        
        # Update the password
        user_response = supabase.auth.update_user({
            "password": request.new_password
        })
        
        if not user_response or not user_response.user:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Failed to update password"
            )
        
        # Return session tokens so user can stay logged in if they choose
        return AuthResponse(
            success=True,
            message="Password updated successfully",
            user_id=user_response.user.id,
            access_token=session.session.access_token if session.session else None,
            refresh_token=session.session.refresh_token if session.session else None,
        )
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Update password error: {str(e)}")
        
        # Try alternative: use admin API to update by user ID from token
        try:
            supabase_admin = get_supabase_admin()
            # Verify the token to get user info
            user_resp = supabase.auth.get_user(request.access_token)
            if user_resp and user_resp.user:
                supabase_admin.auth.admin.update_user_by_id(
                    user_resp.user.id,
                    {"password": request.new_password}
                )
                return AuthResponse(
                    success=True,
                    message="Password updated successfully. Please sign in with your new password.",
                    user_id=user_resp.user.id,
                )
        except Exception as inner_e:
            logger.error(f"Admin update password fallback error: {str(inner_e)}")
        
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Failed to update password. The reset link may have expired. Please request a new one."
        )

@router.post("/refresh")
async def refresh_token(refresh_token: str):
    """Refresh access token"""
    supabase = get_supabase_client()
    
    try:
        response = supabase.auth.refresh_session(refresh_token)
        
        if not response.session:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid refresh token"
            )
        
        return AuthResponse(
            success=True,
            message="Token refreshed",
            user_id=response.user.id if response.user else None,
            access_token=response.session.access_token,
            refresh_token=response.session.refresh_token
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Failed to refresh token"
        )
