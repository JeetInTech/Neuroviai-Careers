from fastapi import APIRouter, HTTPException, status, Header
from typing import List, Dict
from ..models import ATSAnalysisRequest, ATSAnalysisResponse, CVData
from ..routers.profile import get_current_user

router = APIRouter(prefix="/ats", tags=["ATS Analysis"])

# Role-specific keywords database
ROLE_KEYWORDS: Dict[str, List[str]] = {
    "software_engineer": [
        "python", "javascript", "typescript", "java", "c++", "react", "node.js",
        "aws", "docker", "kubernetes", "git", "agile", "scrum", "ci/cd",
        "rest api", "microservices", "sql", "nosql", "mongodb", "postgresql",
        "testing", "unit tests", "integration", "debugging", "code review",
        "software development", "full stack", "backend", "frontend", "devops"
    ],
    "data_scientist": [
        "python", "r", "sql", "machine learning", "deep learning", "tensorflow",
        "pytorch", "pandas", "numpy", "scikit-learn", "statistics", "data analysis",
        "visualization", "tableau", "power bi", "jupyter", "big data", "spark",
        "hadoop", "nlp", "computer vision", "a/b testing", "regression",
        "classification", "clustering", "neural networks", "feature engineering"
    ],
    "ai_ml_engineer": [
        "python", "tensorflow", "pytorch", "keras", "machine learning", "deep learning",
        "neural networks", "nlp", "computer vision", "transformers", "bert", "gpt",
        "mlops", "model deployment", "aws sagemaker", "azure ml", "kubeflow",
        "data pipeline", "feature store", "model monitoring", "a/b testing",
        "reinforcement learning", "generative ai", "llm", "rag", "fine-tuning"
    ],
    "frontend_developer": [
        "javascript", "typescript", "react", "vue", "angular", "html", "css",
        "sass", "tailwind", "responsive design", "accessibility", "webpack",
        "vite", "next.js", "nuxt", "redux", "state management", "rest api",
        "graphql", "testing", "jest", "cypress", "ui/ux", "figma", "performance"
    ],
    "backend_developer": [
        "python", "java", "node.js", "go", "rust", "c#", "sql", "postgresql",
        "mongodb", "redis", "rest api", "graphql", "microservices", "docker",
        "kubernetes", "aws", "azure", "gcp", "ci/cd", "security", "authentication",
        "oauth", "jwt", "message queues", "rabbitmq", "kafka", "caching"
    ],
    "fresher": [
        "programming", "python", "java", "javascript", "data structures",
        "algorithms", "problem solving", "git", "sql", "html", "css",
        "communication", "teamwork", "learning", "internship", "project",
        "academic", "degree", "certification", "coursework", "enthusiasm"
    ]
}

def calculate_keyword_score(cv_data: CVData, target_role: str, job_description: str = None) -> dict:
    """Calculate keyword match score"""
    # Get role keywords
    role_key = target_role.lower().replace(" ", "_").replace("-", "_")
    keywords = ROLE_KEYWORDS.get(role_key, ROLE_KEYWORDS["software_engineer"])
    
    # Build CV text content
    cv_text = " ".join([
        cv_data.summary or "",
        " ".join(cv_data.skills),
        " ".join([exp.get("description", "") for exp in cv_data.experience]),
        " ".join([proj.get("description", "") for proj in cv_data.projects]),
    ]).lower()
    
    # Add job description keywords if provided
    if job_description:
        jd_words = set(job_description.lower().split())
        keywords = list(set(keywords) | jd_words)
    
    # Find matches
    matched = [kw for kw in keywords if kw.lower() in cv_text]
    missing = [kw for kw in keywords if kw.lower() not in cv_text]
    
    score = int((len(matched) / len(keywords)) * 100) if keywords else 0
    
    return {
        "score": min(score, 100),
        "matched": matched[:20],  # Top 20
        "missing": missing[:15]   # Top 15 missing
    }

def calculate_format_score(cv_data: CVData) -> dict:
    """Calculate formatting score"""
    issues = []
    score = 100
    
    # Check summary length
    if not cv_data.summary:
        issues.append("Add a professional summary")
        score -= 15
    elif len(cv_data.summary) < 100:
        issues.append("Summary is too short. Aim for 100-200 words")
        score -= 10
    elif len(cv_data.summary) > 500:
        issues.append("Summary is too long. Keep it under 300 words")
        score -= 5
    
    # Check experience
    if len(cv_data.experience) == 0:
        issues.append("Add work experience")
        score -= 20
    else:
        for i, exp in enumerate(cv_data.experience):
            if not exp.get("description"):
                issues.append(f"Add description for experience #{i+1}")
                score -= 5
            elif len(exp.get("description", "")) < 50:
                issues.append(f"Expand description for experience #{i+1}")
                score -= 3
    
    # Check skills
    if len(cv_data.skills) < 5:
        issues.append("Add more skills (aim for 8-15 relevant skills)")
        score -= 15
    elif len(cv_data.skills) > 20:
        issues.append("Too many skills. Focus on 10-15 most relevant")
        score -= 5
    
    # Check education
    if len(cv_data.education) == 0:
        issues.append("Add education details")
        score -= 10
    
    return {"score": max(score, 0), "issues": issues}

def calculate_content_score(cv_data: CVData) -> dict:
    """Calculate content quality score"""
    suggestions = []
    score = 100
    
    # Check for action verbs in experience
    action_verbs = ["developed", "implemented", "designed", "led", "managed", 
                   "created", "improved", "achieved", "delivered", "built",
                   "optimized", "increased", "reduced", "launched", "automated"]
    
    exp_text = " ".join([exp.get("description", "") for exp in cv_data.experience]).lower()
    
    found_verbs = [v for v in action_verbs if v in exp_text]
    if len(found_verbs) < 3:
        suggestions.append("Use more action verbs (developed, implemented, led, achieved)")
        score -= 15
    
    # Check for quantifiable achievements
    import re
    numbers = re.findall(r'\d+%|\$\d+|\d+\+', exp_text)
    if len(numbers) < 2:
        suggestions.append("Add quantifiable achievements (e.g., 'increased sales by 25%')")
        score -= 15
    
    # Check for projects
    if len(cv_data.projects) == 0:
        suggestions.append("Add personal or professional projects")
        score -= 10
    
    # Check contact info
    personal = cv_data.personal_info
    if not personal.get("email"):
        suggestions.append("Add email address")
        score -= 10
    if not personal.get("phone") and not personal.get("linkedin"):
        suggestions.append("Add phone number or LinkedIn profile")
        score -= 5
    
    return {"score": max(score, 0), "suggestions": suggestions}

@router.post("/analyze", response_model=ATSAnalysisResponse)
async def analyze_cv(request: ATSAnalysisRequest):
    """Analyze CV for ATS optimization"""
    
    keyword_result = calculate_keyword_score(
        request.cv_data, 
        request.target_role,
        request.job_description
    )
    format_result = calculate_format_score(request.cv_data)
    content_result = calculate_content_score(request.cv_data)
    
    # Calculate overall score (weighted average)
    overall_score = int(
        keyword_result["score"] * 0.4 +
        format_result["score"] * 0.3 +
        content_result["score"] * 0.3
    )
    
    # Combine suggestions
    all_suggestions = format_result["issues"] + content_result["suggestions"]
    
    return ATSAnalysisResponse(
        overall_score=overall_score,
        keyword_score=keyword_result["score"],
        format_score=format_result["score"],
        content_score=content_result["score"],
        suggestions=all_suggestions[:10],  # Top 10 suggestions
        missing_keywords=keyword_result["missing"],
        matched_keywords=keyword_result["matched"]
    )

@router.post("/{cv_id}/analyze")
async def analyze_saved_cv(
    cv_id: str, 
    target_role: str,
    job_description: str = None,
    authorization: str = Header(...)
):
    """Analyze a saved CV"""
    from ..database import get_supabase_client
    
    user = await get_current_user(authorization)
    supabase = get_supabase_client()
    
    # Get CV
    cv = supabase.table("cvs").select("*").eq("id", cv_id).single().execute()
    
    if not cv.data:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="CV not found"
        )
    
    if cv.data["user_id"] != user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access denied"
        )
    
    # Convert to CVData model
    cv_data = CVData(**cv.data["cv_data"])
    
    request = ATSAnalysisRequest(
        cv_data=cv_data,
        target_role=target_role,
        job_description=job_description
    )
    
    result = await analyze_cv(request)
    
    # Update CV with ATS score
    supabase.table("cvs").update({
        "ats_score": result.overall_score
    }).eq("id", cv_id).execute()
    
    return result
