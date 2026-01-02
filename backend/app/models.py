from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import datetime

# Auth Models
class SignUpRequest(BaseModel):
    email: EmailStr
    password: str
    username: str
    display_name: Optional[str] = None

class SignInRequest(BaseModel):
    email_or_username: str
    password: str

class AuthResponse(BaseModel):
    success: bool
    message: str
    user_id: Optional[str] = None
    access_token: Optional[str] = None
    refresh_token: Optional[str] = None

class PasswordResetRequest(BaseModel):
    email: EmailStr

# Profile Models
class ProfileUpdate(BaseModel):
    username: Optional[str] = None
    display_name: Optional[str] = None
    bio: Optional[str] = None
    avatar_url: Optional[str] = None
    linkedin_url: Optional[str] = None
    github_url: Optional[str] = None
    portfolio_url: Optional[str] = None
    phone: Optional[str] = None
    address: Optional[str] = None
    uploaded_cv_url: Optional[str] = None
    parsed_cv_data: Optional[dict] = None

class ProfileResponse(BaseModel):
    id: str
    email: str
    username: Optional[str]
    display_name: Optional[str]
    bio: Optional[str]
    avatar_url: Optional[str]
    cv_credits: int
    subscription_status: str
    created_at: datetime

# CV Models - matches existing frontend database schema
class PersonalInfo(BaseModel):
    full_name: str = ""
    email: str = ""
    phone: str = ""
    address: str = ""
    city: Optional[str] = None
    country: Optional[str] = None
    linkedin_url: Optional[str] = None
    github_url: Optional[str] = None
    portfolio_url: Optional[str] = None
    summary: str = ""
    photo_url: Optional[str] = None

class Education(BaseModel):
    degree: str
    field_of_study: Optional[str] = None
    institution: str
    location: str = ""
    start_date: str = ""
    end_date: str = ""
    gpa: Optional[str] = None
    description: str = ""
    achievements: List[str] = []

class Experience(BaseModel):
    title: str
    company: str
    location: str = ""
    start_date: str = ""
    end_date: str = ""
    current: bool = False
    description: str = ""
    achievements: List[str] = []
    keywords: List[str] = []

class Skill(BaseModel):
    name: str
    level: int = 3  # 1-5 scale
    category: str = "technical"
    years_of_experience: Optional[int] = None

class Language(BaseModel):
    name: str
    proficiency: str = "conversational"

class Certification(BaseModel):
    name: str
    issuer: str
    date: str = ""
    expiry_date: Optional[str] = None
    credential_id: Optional[str] = None
    url: Optional[str] = None

class Project(BaseModel):
    name: str
    description: str = ""
    technologies: List[str] = []
    url: Optional[str] = None
    github_url: Optional[str] = None
    start_date: Optional[str] = None
    end_date: Optional[str] = None
    highlights: List[str] = []

class CVCreateRequest(BaseModel):
    template: str = "modern-minimal"
    target_role: Optional[str] = None
    personal_info: PersonalInfo = PersonalInfo()
    education: List[Education] = []
    experience: List[Experience] = []
    skills: List[Skill] = []
    languages: List[Language] = []
    certifications: List[Certification] = []
    projects: List[Project] = []

class CVResponse(BaseModel):
    id: str
    user_id: str
    template: str
    target_role: Optional[str]
    ats_score: Optional[int]
    personal_info: dict
    education: List[dict]
    experience: List[dict]
    skills: List[dict]
    languages: List[dict]
    certifications: List[dict]
    projects: List[dict]
    created_at: str
    updated_at: str

# Legacy CVData for ATS (backward compatibility)
class CVData(BaseModel):
    title: str = ""
    target_role: Optional[str] = None
    personal_info: dict = {}
    summary: Optional[str] = None
    experience: List[dict] = []
    education: List[dict] = []
    skills: List[str] = []
    projects: List[dict] = []
    certifications: List[dict] = []
    languages: List[dict] = []

# ATS Models
class ATSAnalysisRequest(BaseModel):
    cv_data: CVData
    target_role: str
    job_description: Optional[str] = None

class ATSAnalysisResponse(BaseModel):
    overall_score: int
    keyword_score: int
    format_score: int
    content_score: int
    suggestions: List[str]
    missing_keywords: List[str]
    matched_keywords: List[str]
