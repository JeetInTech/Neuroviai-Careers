from fastapi import APIRouter, HTTPException, status, Header
from typing import List, Optional
from ..models import CVCreateRequest, CVResponse
from ..database import get_supabase_admin
from ..routers.profile import get_current_user
import uuid
from datetime import datetime

router = APIRouter(prefix="/cv", tags=["CV"])

@router.post("/create")
async def create_cv(
    request: CVCreateRequest,
    authorization: str = Header(...)
):
    """Create a new CV"""
    user = await get_current_user(authorization)
    supabase = get_supabase_admin()  # Use admin to bypass RLS
    
    # Create CV with the same schema as frontend
    cv_data = {
        "id": str(uuid.uuid4()),
        "user_id": user.id,
        "template": request.template,
        "target_role": request.target_role,
        "personal_info": request.personal_info.model_dump(),
        "education": [e.model_dump() for e in request.education],
        "experience": [e.model_dump() for e in request.experience],
        "skills": [s.model_dump() for s in request.skills],
        "languages": [l.model_dump() for l in request.languages],
        "certifications": [c.model_dump() for c in request.certifications],
        "projects": [p.model_dump() for p in request.projects],
        "accent_color": request.accent_color,
        "is_grayscale": request.is_grayscale or False,
        "created_at": datetime.utcnow().isoformat(),
        "updated_at": datetime.utcnow().isoformat()
    }
    
    result = supabase.table("cvs").insert(cv_data).execute()
    
    return {"success": True, "cv": result.data[0] if result.data else None}

@router.get("/list")
async def list_my_cvs(authorization: str = Header(...)):
    """List all CVs for current user"""
    user = await get_current_user(authorization)
    supabase = get_supabase_admin()  # Use admin to bypass RLS
    
    cvs = supabase.table("cvs").select("*").eq("user_id", user.id).order("updated_at", desc=True).execute()
    
    return {"cvs": cvs.data}

@router.get("/{cv_id}")
async def get_cv(cv_id: str, authorization: str = Header(...)):
    """Get a specific CV"""
    user = await get_current_user(authorization)
    supabase = get_supabase_admin()  # Use admin to bypass RLS
    
    cv = supabase.table("cvs").select("*").eq("id", cv_id).maybe_single().execute()
    
    if not cv.data:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="CV not found"
        )
    
    # Check ownership
    if cv.data["user_id"] != user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access denied"
        )
    
    return cv.data

@router.put("/{cv_id}")
async def update_cv(
    cv_id: str,
    request: CVCreateRequest,
    authorization: str = Header(...)
):
    """Update a CV"""
    user = await get_current_user(authorization)
    supabase = get_supabase_admin()  # Use admin to bypass RLS
    
    # Check ownership
    existing = supabase.table("cvs").select("user_id").eq("id", cv_id).maybe_single().execute()
    
    if not existing.data:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="CV not found"
        )
    
    if existing.data["user_id"] != user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access denied"
        )
    
    # Update CV
    update_data = {
        "template": request.template,
        "target_role": request.target_role,
        "personal_info": request.personal_info.model_dump(),
        "education": [e.model_dump() for e in request.education],
        "experience": [e.model_dump() for e in request.experience],
        "skills": [s.model_dump() for s in request.skills],
        "languages": [l.model_dump() for l in request.languages],
        "certifications": [c.model_dump() for c in request.certifications],
        "projects": [p.model_dump() for p in request.projects],
        "accent_color": request.accent_color,
        "is_grayscale": request.is_grayscale or False,
        "updated_at": datetime.utcnow().isoformat()
    }
    
    result = supabase.table("cvs").update(update_data).eq("id", cv_id).execute()
    
    return {"success": True, "cv": result.data[0] if result.data else None}

@router.delete("/{cv_id}")
async def delete_cv(cv_id: str, authorization: str = Header(...)):
    """Delete a CV"""
    user = await get_current_user(authorization)
    supabase = get_supabase_admin()  # Use admin to bypass RLS
    
    # Check ownership
    existing = supabase.table("cvs").select("user_id").eq("id", cv_id).maybe_single().execute()
    
    if not existing or not existing.data:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="CV not found"
        )
    
    if existing.data["user_id"] != user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access denied"
        )
    
    supabase.table("cvs").delete().eq("id", cv_id).execute()
    
    return {"success": True, "message": "CV deleted"}

@router.post("/{cv_id}/publish")
async def publish_cv(cv_id: str, authorization: str = Header(...)):
    """Make a CV public"""
    user = await get_current_user(authorization)
    supabase = get_supabase_admin()  # Use admin to bypass RLS
    
    # Check ownership
    existing = supabase.table("cvs").select("user_id").eq("id", cv_id).maybe_single().execute()
    
    if not existing or not existing.data or existing.data["user_id"] != user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access denied"
        )
    
    supabase.table("cvs").update({"is_public": True}).eq("id", cv_id).execute()
    
    return {"success": True, "message": "CV is now public"}

@router.post("/{cv_id}/unpublish")
async def unpublish_cv(cv_id: str, authorization: str = Header(...)):
    """Make a CV private"""
    user = await get_current_user(authorization)
    supabase = get_supabase_admin()  # Use admin to bypass RLS
    
    existing = supabase.table("cvs").select("user_id").eq("id", cv_id).maybe_single().execute()
    
    if not existing or not existing.data or existing.data["user_id"] != user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access denied"
        )
    
    supabase.table("cvs").update({"is_public": False}).eq("id", cv_id).execute()
    
    return {"success": True, "message": "CV is now private"}
