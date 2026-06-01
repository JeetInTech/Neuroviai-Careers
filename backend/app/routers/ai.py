"""
AI Router - Endpoints for AI-powered CV content generation
"""
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Optional, Dict, Any

from ..services.ai_service import ai_service

router = APIRouter(prefix="/ai", tags=["AI"])


class SummaryRequest(BaseModel):
    job_title: str
    experience_years: int = 0
    skills: List[str] = []
    tone: str = "professional"


class ExperienceRequest(BaseModel):
    job_title: str
    company: str = ""
    responsibilities: str = ""
    num_bullets: int = 4


class SkillsRequest(BaseModel):
    job_title: str
    category: str = "technical"
    num_skills: int = 8


class EnhanceRequest(BaseModel):
    text: str
    context: str = "professional CV"


class EducationRequest(BaseModel):
    degree: str
    field: str
    achievements: str = ""


class SuggestionsRequest(BaseModel):
    cv_data: Dict[str, Any]


class SummaryResponse(BaseModel):
    summary: str


class BulletsResponse(BaseModel):
    bullets: List[str]


class SkillsResponse(BaseModel):
    skills: List[str]


class EnhanceResponse(BaseModel):
    enhanced_text: str


class EducationResponse(BaseModel):
    description: str


class SuggestionItem(BaseModel):
    section: str
    issue: str
    fix: str


class SuggestionsResponse(BaseModel):
    suggestions: List[SuggestionItem]


@router.post("/generate-summary", response_model=SummaryResponse)
async def generate_summary(request: SummaryRequest):
    """Generate a professional summary for CV"""
    try:
        summary = await ai_service.generate_summary(
            job_title=request.job_title,
            experience_years=request.experience_years,
            skills=request.skills,
            tone=request.tone
        )
        return SummaryResponse(summary=summary)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"AI generation failed: {str(e)}")


@router.post("/generate-bullets", response_model=BulletsResponse)
async def generate_experience_bullets(request: ExperienceRequest):
    """Generate experience bullet points"""
    try:
        bullets = await ai_service.generate_experience_bullets(
            job_title=request.job_title,
            company=request.company,
            responsibilities=request.responsibilities,
            num_bullets=request.num_bullets
        )
        return BulletsResponse(bullets=bullets)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"AI generation failed: {str(e)}")


@router.post("/generate-skills", response_model=SkillsResponse)
async def generate_skills(request: SkillsRequest):
    """Generate relevant skills for a job title"""
    try:
        skills = await ai_service.generate_skills(
            job_title=request.job_title,
            category=request.category,
            num_skills=request.num_skills
        )
        return SkillsResponse(skills=skills)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"AI generation failed: {str(e)}")


@router.post("/enhance-text", response_model=EnhanceResponse)
async def enhance_text(request: EnhanceRequest):
    """Enhance existing text to be more impactful"""
    try:
        enhanced = await ai_service.enhance_text(
            text=request.text,
            context=request.context
        )
        return EnhanceResponse(enhanced_text=enhanced)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"AI generation failed: {str(e)}")


@router.post("/generate-education", response_model=EducationResponse)
async def generate_education(request: EducationRequest):
    """Generate education section description"""
    try:
        description = await ai_service.generate_education_description(
            degree=request.degree,
            field=request.field,
            achievements=request.achievements
        )
        return EducationResponse(description=description)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"AI generation failed: {str(e)}")


@router.post("/suggest-improvements", response_model=SuggestionsResponse)
async def suggest_improvements(request: SuggestionsRequest):
    """Analyze CV and suggest improvements"""
    try:
        suggestions = await ai_service.suggest_improvements(request.cv_data)
        return SuggestionsResponse(
            suggestions=[SuggestionItem(**s) for s in suggestions if all(k in s for k in ['section', 'issue', 'fix'])]
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"AI generation failed: {str(e)}")


# ============================================
# AI RESUME TAILORING ENDPOINT
# ============================================

class ScrapeJobUrlRequest(BaseModel):
    url: str

class ScrapeJobUrlResponse(BaseModel):
    scraped_text: str

class PreOptimizeRequest(BaseModel):
    cv_data: Dict[str, Any]
    job_description: str

class PreOptimizeResponse(BaseModel):
    ats_match_score: int
    missing_keywords: List[str]
    overlapping_skills: List[str]
    role_alignment: str
    experience_relevance: str
    recruiter_concerns: List[str]
    strengths: List[str]
    recommended_opportunities: List[str]

class TailorResumeRequest(BaseModel):
    cv_data: Dict[str, Any]
    job_description: str
    job_title: Optional[str] = None
    mode: Optional[str] = 'balanced'


class JobAnalysis(BaseModel):
    required_skills: List[str]
    ats_keywords: List[str]
    key_responsibilities: List[str]


class TailorResumeResponse(BaseModel):
    tailored_cv: Dict[str, Any]
    match_score: int
    job_analysis: JobAnalysis
    optimizations_made: List[str]


@router.post("/scrape-job-url", response_model=ScrapeJobUrlResponse)
async def scrape_job_url(request: ScrapeJobUrlRequest):
    """Scrape job description from a job board URL"""
    try:
        scraped_text = await ai_service.scrape_job_description_url(request.url)
        return ScrapeJobUrlResponse(scraped_text=scraped_text)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Job URL scraping failed: {str(e)}")


@router.post("/pre-optimize-analysis", response_model=PreOptimizeResponse)
async def pre_optimize_analysis(request: PreOptimizeRequest):
    """Generate pre-optimization audit report for CV and Job Description"""
    try:
        report = await ai_service.pre_optimize_analysis(
            cv_data=request.cv_data,
            job_description=request.job_description
        )
        return PreOptimizeResponse(**report)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Pre-optimization analysis failed: {str(e)}")


@router.post("/tailor-resume", response_model=TailorResumeResponse)
async def tailor_resume_to_job(request: TailorResumeRequest):
    """
    AI-powered resume tailoring to match a specific job description.
    
    This endpoint:
    1. Analyzes the job description to extract requirements
    2. Rewrites the professional summary to match the job
    3. Optimizes experience bullet points with relevant keywords
    4. Reorders and enhances skills list
    5. Calculates a match score
    """
    try:
        result = await ai_service.tailor_resume_to_job(
            cv_data=request.cv_data,
            job_description=request.job_description,
            job_title=request.job_title,
            mode=request.mode
        )
        return TailorResumeResponse(
            tailored_cv=result['tailored_cv'],
            match_score=result['match_score'],
            job_analysis=JobAnalysis(**result['job_analysis']),
            optimizations_made=result['optimizations_made']
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"AI tailoring failed: {str(e)}")
