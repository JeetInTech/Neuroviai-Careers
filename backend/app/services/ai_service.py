"""
AI Service using Groq API for CV content generation
"""
from groq import Groq
from typing import Optional, List, Dict, Any
from ..config import settings
import logging

logger = logging.getLogger(__name__)


class AIService:
    def __init__(self):
        self._client: Optional[Groq] = None
        self.model = "llama-3.3-70b-versatile"  # Best available model
    
    @property
    def client(self) -> Groq:
        """Lazy initialization of Groq client"""
        if self._client is None:
            api_key = settings.GROQ_API_KEY
            if not api_key:
                logger.error("GROQ_API_KEY not configured - AI features will not work")
                raise ValueError("GROQ_API_KEY not configured. Please set it in your .env file.")
            self._client = Groq(api_key=api_key)
        return self._client
    
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

    async def tailor_resume_to_job(
        self,
        cv_data: Dict[str, Any],
        job_description: str,
        job_title: Optional[str] = None
    ) -> Dict[str, Any]:
        """
        AI-powered resume tailoring to match a specific job description.
        Analyzes the job description, extracts key requirements, and
        optimizes the resume content to highlight relevant experience.
        """
        
        # Step 1: Extract key requirements from job description
        extraction_prompt = f"""Analyze this job description and extract:
1. Required skills (technical and soft)
2. Key responsibilities mentioned
3. Required qualifications/experience
4. Important keywords for ATS
5. Company culture/values hints

Job Description:
{job_description}

Return in this exact format:
REQUIRED_SKILLS: skill1, skill2, skill3...
KEY_RESPONSIBILITIES: resp1, resp2, resp3...
QUALIFICATIONS: qual1, qual2...
ATS_KEYWORDS: keyword1, keyword2, keyword3...
CULTURE: brief culture description"""

        extraction_response = self.client.chat.completions.create(
            model=self.model,
            messages=[{"role": "user", "content": extraction_prompt}],
            temperature=0.5,
            max_tokens=600
        )
        
        job_analysis = extraction_response.choices[0].message.content.strip()
        
        # Parse the job analysis
        required_skills = []
        ats_keywords = []
        key_responsibilities = []
        
        for line in job_analysis.split('\n'):
            if line.startswith('REQUIRED_SKILLS:'):
                required_skills = [s.strip() for s in line.replace('REQUIRED_SKILLS:', '').split(',')]
            elif line.startswith('ATS_KEYWORDS:'):
                ats_keywords = [k.strip() for k in line.replace('ATS_KEYWORDS:', '').split(',')]
            elif line.startswith('KEY_RESPONSIBILITIES:'):
                key_responsibilities = [r.strip() for r in line.replace('KEY_RESPONSIBILITIES:', '').split(',')]
        
        # Step 2: Generate tailored professional summary
        current_summary = cv_data.get('personal_info', {}).get('summary', '')
        current_skills = [s.get('name', '') for s in cv_data.get('skills', [])]
        current_experience = cv_data.get('experience', [])
        
        summary_prompt = f"""Rewrite this professional summary to perfectly match the target job.

Current Summary: {current_summary if current_summary else 'No current summary'}

Target Job Requirements:
- Required Skills: {', '.join(required_skills[:10])}
- Key Responsibilities: {', '.join(key_responsibilities[:5])}
- ATS Keywords to include: {', '.join(ats_keywords[:10])}

Candidate's Current Skills: {', '.join(current_skills[:15])}
Candidate's Experience: {len(current_experience)} positions

Requirements:
- 2-3 powerful sentences
- Include relevant ATS keywords naturally
- Highlight matching skills and experience
- Professional, confident tone
- No first-person pronouns

Return ONLY the tailored summary text."""

        summary_response = self.client.chat.completions.create(
            model=self.model,
            messages=[{"role": "user", "content": summary_prompt}],
            temperature=0.7,
            max_tokens=250
        )
        
        tailored_summary = summary_response.choices[0].message.content.strip()
        if tailored_summary.startswith('"') and tailored_summary.endswith('"'):
            tailored_summary = tailored_summary[1:-1]
        
        # Step 3: Tailor experience bullet points
        tailored_experience = []
        for exp in current_experience[:4]:  # Limit to most recent 4
            exp_prompt = f"""Rewrite these experience bullet points to match the target job.

Job Title: {exp.get('title', 'Unknown')}
Company: {exp.get('company', 'Unknown')}
Current Description:
{exp.get('description', 'No description')}

Target Job Requirements:
- Required Skills: {', '.join(required_skills[:8])}
- Key Responsibilities: {', '.join(key_responsibilities[:5])}
- ATS Keywords: {', '.join(ats_keywords[:8])}

Requirements:
- Generate 3-4 bullet points
- Start each with strong action verb
- Include quantifiable achievements (use realistic numbers)
- Incorporate relevant ATS keywords naturally
- Highlight transferable skills that match the target job
- Each bullet max 20 words

Return ONLY the bullet points, one per line with "• " prefix."""

            exp_response = self.client.chat.completions.create(
                model=self.model,
                messages=[{"role": "user", "content": exp_prompt}],
                temperature=0.8,
                max_tokens=350
            )
            
            bullets = exp_response.choices[0].message.content.strip()
            bullets_list = [b.strip().lstrip('•-').strip() for b in bullets.split('\n') if b.strip()]
            
            tailored_exp = {
                **exp,
                'description': '\n'.join([f'• {b}' for b in bullets_list[:4]]),
                'achievements': bullets_list[:4]
            }
            tailored_experience.append(tailored_exp)
        
        # Keep remaining experience entries unchanged
        if len(current_experience) > 4:
            tailored_experience.extend(current_experience[4:])
        
        # Step 4: Optimize skills list
        skills_prompt = f"""Optimize this skills list for the target job.

Current Skills: {', '.join(current_skills)}

Target Job Requirements:
- Required Skills: {', '.join(required_skills)}
- ATS Keywords: {', '.join(ats_keywords)}

Tasks:
1. Reorder skills to put most relevant first
2. Add any critical missing skills from requirements (only if candidate likely has them)
3. Remove skills not relevant to target job
4. Return 8-12 most impactful skills

Return ONLY skill names, one per line, most important first."""

        skills_response = self.client.chat.completions.create(
            model=self.model,
            messages=[{"role": "user", "content": skills_prompt}],
            temperature=0.6,
            max_tokens=200
        )
        
        optimized_skills_raw = skills_response.choices[0].message.content.strip()
        optimized_skills = [s.strip().lstrip('•-').strip() for s in optimized_skills_raw.split('\n') if s.strip()][:12]
        
        # Build tailored CV data
        tailored_cv = {
            **cv_data,
            'personal_info': {
                **cv_data.get('personal_info', {}),
                'summary': tailored_summary
            },
            'experience': tailored_experience,
            'skills': [
                {'name': skill, 'level': 4, 'category': 'Technical'}
                for skill in optimized_skills
            ],
            'target_role': job_title or cv_data.get('target_role', ''),
        }
        
        # Step 5: Calculate match score
        match_score_prompt = f"""Rate how well this tailored resume matches the job description.

Job Requirements: {', '.join(required_skills[:10])}
Resume Skills: {', '.join(optimized_skills[:10])}
Resume has {len(tailored_experience)} relevant experience entries.

Rate from 0-100 based on:
- Skill match (40%)
- Experience relevance (30%)  
- Keyword optimization (30%)

Return ONLY a number between 0-100."""

        score_response = self.client.chat.completions.create(
            model=self.model,
            messages=[{"role": "user", "content": match_score_prompt}],
            temperature=0.3,
            max_tokens=10
        )
        
        try:
            match_score = int(''.join(filter(str.isdigit, score_response.choices[0].message.content.strip())))
            match_score = min(100, max(0, match_score))
        except:
            match_score = 75
        
        return {
            'tailored_cv': tailored_cv,
            'match_score': match_score,
            'job_analysis': {
                'required_skills': required_skills,
                'ats_keywords': ats_keywords,
                'key_responsibilities': key_responsibilities
            },
            'optimizations_made': [
                'Professional summary tailored to job requirements',
                'Experience bullets optimized with relevant keywords',
                'Skills reordered by relevance to position',
                'ATS keywords incorporated throughout'
            ]
        }


# Singleton instance
ai_service = AIService()
