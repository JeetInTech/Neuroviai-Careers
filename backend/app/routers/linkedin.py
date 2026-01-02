from fastapi import APIRouter, HTTPException, status, Header
from pydantic import BaseModel
from typing import Optional, List
import httpx
import os
import re

router = APIRouter(prefix="/linkedin", tags=["LinkedIn"])

# Configuration - set your API key in environment variables
# Supports Proxycurl API (https://nubela.co/proxycurl)
PROXYCURL_API_KEY = os.getenv("PROXYCURL_API_KEY", "")


class LinkedInImportRequest(BaseModel):
    linkedin_url: str


class LinkedInExperience(BaseModel):
    title: str = ""
    company: str = ""
    location: str = ""
    start_date: str = ""
    end_date: str = ""
    current: bool = False
    description: str = ""


class LinkedInEducation(BaseModel):
    degree: str = ""
    field_of_study: str = ""
    institution: str = ""
    location: str = ""
    start_date: str = ""
    end_date: str = ""
    description: str = ""


class LinkedInProfileData(BaseModel):
    personal_info: dict
    experience: List[dict]
    education: List[dict]
    skills: List[dict]
    certifications: List[dict]
    languages: List[dict]


async def get_current_user(authorization: str = Header(...)):
    """Extract and validate user from authorization header"""
    from ..database import get_supabase_admin
    
    if not authorization.startswith("Bearer "):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authorization header"
        )
    
    token = authorization.split(" ")[1]
    supabase = get_supabase_admin()
    
    try:
        user = supabase.auth.get_user(token)
        if not user.user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid token"
            )
        return user.user
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token"
        )


def validate_linkedin_url(url: str) -> str:
    """Validate and normalize LinkedIn profile URL"""
    patterns = [
        r'(?:https?://)?(?:www\.)?linkedin\.com/in/([a-zA-Z0-9_-]+)/?',
        r'(?:https?://)?(?:[\w]+\.)?linkedin\.com/in/([a-zA-Z0-9_-]+)/?'
    ]
    
    for pattern in patterns:
        match = re.match(pattern, url.strip())
        if match:
            username = match.group(1)
            return f"https://www.linkedin.com/in/{username}/"
    
    raise HTTPException(
        status_code=status.HTTP_400_BAD_REQUEST,
        detail="Invalid LinkedIn profile URL. Please provide a URL like: https://linkedin.com/in/username"
    )


def format_date(date_obj: dict) -> str:
    """Format date object from LinkedIn API to string"""
    if not date_obj:
        return ""
    
    year = date_obj.get("year", "")
    month = date_obj.get("month", "")
    
    if year and month:
        return f"{year}-{str(month).zfill(2)}"
    elif year:
        return str(year)
    return ""


def parse_proxycurl_response(data: dict) -> LinkedInProfileData:
    """Parse Proxycurl API response into our format"""
    
    # Parse personal info
    personal_info = {
        "full_name": data.get("full_name", ""),
        "email": "",  # Not provided by LinkedIn API
        "phone": "",  # Not provided by LinkedIn API  
        "address": data.get("city", ""),
        "city": data.get("city", ""),
        "country": data.get("country_full_name", ""),
        "linkedin_url": data.get("public_identifier", ""),
        "summary": data.get("summary", "") or data.get("headline", ""),
    }
    
    # Parse experience
    experience = []
    for exp in data.get("experiences", []) or []:
        experience.append({
            "title": exp.get("title", ""),
            "company": exp.get("company", ""),
            "location": exp.get("location", ""),
            "start_date": format_date(exp.get("starts_at")),
            "end_date": format_date(exp.get("ends_at")) if exp.get("ends_at") else "",
            "current": exp.get("ends_at") is None,
            "description": exp.get("description", "") or "",
            "achievements": [],
        })
    
    # Parse education
    education = []
    for edu in data.get("education", []) or []:
        education.append({
            "degree": edu.get("degree_name", ""),
            "field_of_study": edu.get("field_of_study", ""),
            "institution": edu.get("school", ""),
            "location": "",
            "start_date": format_date(edu.get("starts_at")),
            "end_date": format_date(edu.get("ends_at")),
            "description": edu.get("description", "") or "",
            "gpa": edu.get("grade", ""),
        })
    
    # Parse skills
    skills = []
    for skill in data.get("skills", []) or []:
        skills.append({
            "name": skill if isinstance(skill, str) else skill.get("name", ""),
            "level": 3,  # Default to intermediate
            "category": "Technical",
        })
    
    # Parse certifications
    certifications = []
    for cert in data.get("certifications", []) or []:
        certifications.append({
            "name": cert.get("name", ""),
            "issuer": cert.get("authority", ""),
            "date": format_date(cert.get("starts_at")),
            "expiry_date": format_date(cert.get("ends_at")),
            "credential_id": cert.get("license_number", ""),
            "url": cert.get("url", ""),
        })
    
    # Parse languages
    languages = []
    for lang in data.get("languages", []) or []:
        lang_name = lang if isinstance(lang, str) else lang.get("name", "")
        languages.append({
            "name": lang_name,
            "proficiency": "Professional",
        })
    
    return LinkedInProfileData(
        personal_info=personal_info,
        experience=experience,
        education=education,
        skills=skills,
        certifications=certifications,
        languages=languages,
    )


@router.post("/import")
async def import_linkedin_profile(
    request: LinkedInImportRequest,
    authorization: str = Header(...)
):
    """
    Import profile data from a LinkedIn profile URL.
    
    Requires PROXYCURL_API_KEY environment variable to be set.
    Get your API key at: https://nubela.co/proxycurl
    """
    # Verify user is authenticated
    await get_current_user(authorization)
    
    # Validate LinkedIn URL
    normalized_url = validate_linkedin_url(request.linkedin_url)
    
    # Check if API key is configured
    if not PROXYCURL_API_KEY:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="LinkedIn import is not configured. Please set PROXYCURL_API_KEY environment variable."
        )
    
    try:
        async with httpx.AsyncClient(timeout=30.0) as client:
            response = await client.get(
                "https://nubela.co/proxycurl/api/v2/linkedin",
                params={"url": normalized_url},
                headers={"Authorization": f"Bearer {PROXYCURL_API_KEY}"}
            )
            
            if response.status_code == 404:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail="LinkedIn profile not found. Please check the URL."
                )
            
            if response.status_code == 401:
                raise HTTPException(
                    status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
                    detail="Invalid Proxycurl API key."
                )
            
            if response.status_code == 429:
                raise HTTPException(
                    status_code=status.HTTP_429_TOO_MANY_REQUESTS,
                    detail="Rate limit exceeded. Please try again later."
                )
            
            if response.status_code != 200:
                raise HTTPException(
                    status_code=status.HTTP_502_BAD_GATEWAY,
                    detail=f"Failed to fetch LinkedIn profile: {response.text}"
                )
            
            linkedin_data = response.json()
            
    except httpx.TimeoutException:
        raise HTTPException(
            status_code=status.HTTP_504_GATEWAY_TIMEOUT,
            detail="Request to LinkedIn timed out. Please try again."
        )
    except httpx.RequestError as e:
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail=f"Failed to connect to LinkedIn service: {str(e)}"
        )
    
    # Parse the response into our format
    parsed_data = parse_proxycurl_response(linkedin_data)
    
    return {
        "success": True,
        "data": parsed_data.model_dump(),
        "message": "LinkedIn profile imported successfully"
    }


@router.get("/status")
async def get_linkedin_status():
    """Check if LinkedIn import is configured and available"""
    return {
        "configured": bool(PROXYCURL_API_KEY),
        "provider": "proxycurl" if PROXYCURL_API_KEY else None,
        "message": "LinkedIn import is available" if PROXYCURL_API_KEY else "LinkedIn import requires PROXYCURL_API_KEY to be configured"
    }
