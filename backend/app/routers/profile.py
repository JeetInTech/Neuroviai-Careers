from fastapi import APIRouter, HTTPException, status, Header, Depends
from typing import Optional
from ..models import ProfileUpdate, ProfileResponse
from ..database import get_supabase_client, get_supabase_admin

router = APIRouter(prefix="/profile", tags=["Profile"])


def get_current_user(authorization: str = Header(...)):
    """Extract and validate user from authorization header"""
    if not authorization.startswith("Bearer "):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authorization header"
        )
    
    token = authorization.split(" ")[1]
    # Use admin client to verify user tokens - this bypasses RLS and works with any valid JWT
    supabase = get_supabase_admin()
    
    try:
        user = supabase.auth.get_user(token)
        if not user.user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid token"
            )
        
        # Enforce email verification for all protected routes
        if not user.user.email_confirmed_at:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Email not verified. Please check your inbox and confirm your email."
            )
        
        return user.user
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token"
        )

@router.get("/me")
async def get_my_profile(authorization: str = Header(...)):
    """Get current user's profile"""
    user = get_current_user(authorization)
    supabase = get_supabase_admin()  # Use admin to bypass RLS
    
    # Use maybe_single() to handle 0 rows gracefully
    result = supabase.table("profiles").select("*").eq("id", user.id).maybe_single().execute()
    
    if not result.data:
        # Profile doesn't exist, create it from user metadata
        profile_data = {
            "id": user.id,
            "email": user.email,
            "username": user.user_metadata.get("username", user.email.split("@")[0]),
            "display_name": user.user_metadata.get("display_name", user.email.split("@")[0])
        }
        supabase.table("profiles").upsert(profile_data).execute()
        return profile_data
    
    return result.data

@router.put("/me")
async def update_my_profile(
    update: ProfileUpdate,
    authorization: str = Header(...)
):
    """Update current user's profile"""
    user = get_current_user(authorization)
    supabase = get_supabase_admin()  # Use admin to bypass RLS
    
    # Build update data, excluding None values
    update_data = {k: v for k, v in update.model_dump().items() if v is not None}
    
    if not update_data:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="No fields to update"
        )
    
    # If updating username, check if it's taken
    if "username" in update_data:
        existing = supabase.table("profiles").select("id").eq(
            "username", update_data["username"].lower()
        ).neq("id", user.id).execute()
        
        if existing.data and len(existing.data) > 0:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Username already taken"
            )
        update_data["username"] = update_data["username"].lower()
    
    result = supabase.table("profiles").update(update_data).eq("id", user.id).execute()
    
    return {"success": True, "profile": result.data[0] if result.data else None}

@router.get("/{username}")
async def get_profile_by_username(username: str):
    """Get a public profile by username"""
    supabase = get_supabase_client()
    
    profile = supabase.table("profiles").select(
        "id, username, display_name, bio, avatar_url, linkedin_url, github_url, portfolio_url, created_at"
    ).eq("username", username.lower()).single().execute()
    
    if not profile.data:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Profile not found"
        )
    
    return profile.data
