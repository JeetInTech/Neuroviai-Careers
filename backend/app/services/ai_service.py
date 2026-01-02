"""
AI Service using Groq API for CV content generation
"""
from groq import Groq
from typing import Optional, List, Dict, Any
from ..config import settings

class AIService:
    def __init__(self):
        api_key = settings.GROQ_API_KEY
        if not api_key:
            raise ValueError("GROQ_API_KEY not configured in environment")
        self.client = Groq(api_key=api_key)
        self.model = "llama-3.3-70b-versatile"  # Best available model
    
    async def generate_summary(
        self, 
        job_title: str, 
        experience_years: int = 0,
        skills: List[str] = None,
        tone: str = "professional"
    ) -> str:
        """Generate a professional summary for CV"""
        skills_text = ", ".join(skills) if skills else "various technical skills"
        
        prompt = f"""Generate a compelling professional summary for a CV. 
        
Job Title: {job_title}
Years of Experience: {experience_years}
Key Skills: {skills_text}
Tone: {tone}

Requirements:
- 2-3 sentences maximum
- Action-oriented language
- Highlight value proposition
- ATS-friendly keywords
- No first person pronouns

Return ONLY the summary text, no quotes or explanations."""

        response = self.client.chat.completions.create(
            model=self.model,
            messages=[{"role": "user", "content": prompt}],
            temperature=0.7,
            max_tokens=200
        )
        
        result = response.choices[0].message.content.strip()
        # Remove surrounding quotes if present
        if result.startswith('"') and result.endswith('"'):
            result = result[1:-1]
        return result
    
    async def generate_experience_bullets(
        self,
        job_title: str,
        company: str = "",
        responsibilities: str = "",
        num_bullets: int = 4
    ) -> List[str]:
        """Generate experience bullet points"""
        
        prompt = f"""Generate {num_bullets} impactful bullet points for a CV work experience entry.

Job Title: {job_title}
Company: {company}
Context/Responsibilities: {responsibilities if responsibilities else "General responsibilities for this role"}

Requirements for each bullet:
- Start with strong action verb
- Include quantifiable achievements where possible (use realistic percentages/numbers)
- Be specific and results-oriented
- ATS-friendly language
- Maximum 15 words per bullet

Return ONLY the bullet points, one per line, with a dash (-) prefix. No explanations."""

        response = self.client.chat.completions.create(
            model=self.model,
            messages=[{"role": "user", "content": prompt}],
            temperature=0.8,
            max_tokens=400
        )
        
        content = response.choices[0].message.content.strip()
        bullets = [line.strip().lstrip('-').strip() for line in content.split('\n') if line.strip()]
        return bullets[:num_bullets]
    
    async def generate_skills(
        self,
        job_title: str,
        category: str = "technical",
        num_skills: int = 8
    ) -> List[str]:
        """Generate relevant skills for a job title"""
        
        prompt = f"""Generate {num_skills} relevant {category} skills for a {job_title} position.

Requirements:
- Industry-standard skill names
- ATS-friendly keywords
- Mix of specific tools and general competencies
- Relevant to current job market

Return ONLY the skills, one per line, no numbering or explanations."""

        response = self.client.chat.completions.create(
            model=self.model,
            messages=[{"role": "user", "content": prompt}],
            temperature=0.7,
            max_tokens=200
        )
        
        content = response.choices[0].message.content.strip()
        skills = [line.strip().lstrip('-•').strip() for line in content.split('\n') if line.strip()]
        return skills[:num_skills]
    
    async def enhance_text(
        self,
        text: str,
        context: str = "professional CV"
    ) -> str:
        """Enhance existing text to be more impactful"""
        
        prompt = f"""Enhance this text for a {context}:

"{text}"

Requirements:
- Make it more impactful and professional
- Use action verbs
- Add quantifiable results if possible
- Keep similar length
- ATS-friendly language

Return ONLY the enhanced text, no explanations."""

        response = self.client.chat.completions.create(
            model=self.model,
            messages=[{"role": "user", "content": prompt}],
            temperature=0.7,
            max_tokens=300
        )
        
        return response.choices[0].message.content.strip()
    
    async def generate_education_description(
        self,
        degree: str,
        field: str,
        achievements: str = ""
    ) -> str:
        """Generate education section description"""
        
        prompt = f"""Generate a brief education description for a CV.

Degree: {degree}
Field of Study: {field}
Notable Achievements: {achievements if achievements else "Standard academic performance"}

Requirements:
- 1-2 lines maximum
- Highlight relevant coursework or achievements
- Professional tone
- ATS-friendly

Return ONLY the description text, no explanations."""

        response = self.client.chat.completions.create(
            model=self.model,
            messages=[{"role": "user", "content": prompt}],
            temperature=0.7,
            max_tokens=150
        )
        
        return response.choices[0].message.content.strip()
    
    async def suggest_improvements(
        self,
        cv_data: Dict[str, Any]
    ) -> List[Dict[str, str]]:
        """Analyze CV and suggest improvements"""
        
        prompt = f"""Analyze this CV data and provide 3-5 specific improvement suggestions:

{cv_data}

For each suggestion provide:
- Section (e.g., "summary", "experience", "skills")
- Issue (what's wrong or missing)
- Recommendation (specific action to take)

Format each suggestion as:
SECTION: [section name]
ISSUE: [issue description]  
FIX: [recommendation]

---"""

        response = self.client.chat.completions.create(
            model=self.model,
            messages=[{"role": "user", "content": prompt}],
            temperature=0.7,
            max_tokens=500
        )
        
        content = response.choices[0].message.content.strip()
        suggestions = []
        
        for block in content.split('---'):
            if 'SECTION:' in block:
                lines = block.strip().split('\n')
                suggestion = {}
                for line in lines:
                    if line.startswith('SECTION:'):
                        suggestion['section'] = line.replace('SECTION:', '').strip()
                    elif line.startswith('ISSUE:'):
                        suggestion['issue'] = line.replace('ISSUE:', '').strip()
                    elif line.startswith('FIX:'):
                        suggestion['fix'] = line.replace('FIX:', '').strip()
                if suggestion:
                    suggestions.append(suggestion)
        
        return suggestions


# Singleton instance
ai_service = AIService()
