from fastapi import APIRouter, HTTPException, status
from ..models import SignUpRequest, SignInRequest, AuthResponse, PasswordResetRequest
from ..database import get_supabase_client, get_supabase_admin
import logging

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/auth", tags=["Authentication"])

@router.post("/signup", response_model=AuthResponse)
async def signup(request: SignUpRequest):
    """Register a new user"""
    supabase = get_supabase_admin()
    
    try:
        # Check if username already exists
        existing = supabase.table("profiles").select("id").eq("username", request.username.lower()).execute()
        if existing.data and len(existing.data) > 0:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Username already taken"
            )
        
        # Use regular signup flow (sends confirmation email automatically)
        # Note: Using the regular client, not admin, to trigger email
        regular_client = get_supabase_client()
        auth_response = regular_client.auth.sign_up({
            "email": request.email,
            "password": request.password,
            "options": {
                "data": {
                    "username": request.username,
                    "display_name": request.display_name or request.username
                }
            }
        })
        
        logger.info(f"Auth response: {auth_response}")
        
        if not auth_response.user:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Failed to create user"
            )
        
        # Upsert profile with username and display name (using admin to bypass RLS)
        # Use upsert to handle both insert and update cases
        supabase.table("profiles").upsert({
            "id": auth_response.user.id,
            "username": request.username.lower(),
            "display_name": request.display_name or request.username,
            "email": request.email
        }).execute()
        
        return AuthResponse(
            success=True,
            message="Account created successfully. Please check your email to confirm.",
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
            ).single().execute()
            
            if not profile.data or not profile.data.get("email"):
                raise HTTPException(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    detail="Invalid username or password"
                )
            email = profile.data["email"]
        
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

@router.post("/reset-password")
async def reset_password(request: PasswordResetRequest):
    """Send password reset email"""
    supabase = get_supabase_client()
    
    try:
        supabase.auth.reset_password_email(request.email)
        return {"success": True, "message": "Password reset email sent"}
    except Exception as e:
        # Don't reveal if email exists or not
        return {"success": True, "message": "If the email exists, a reset link will be sent"}

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
