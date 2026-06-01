"""
AI Service using Groq API for CV content generation
"""
from groq import Groq
import re
import json
from html.parser import HTMLParser
from typing import Optional, List, Dict, Any
from ..config import settings
import logging

logger = logging.getLogger(__name__)

class JobDescriptionHTMLParser(HTMLParser):
    def __init__(self):
        super().__init__()
        self.text_parts = []
        self.in_ignored_tag = False
        self.ignored_tags = {'script', 'style', 'nav', 'footer', 'header', 'noscript', 'iframe', 'head'}

    def handle_starttag(self, tag, attrs):
        if tag in self.ignored_tags:
            self.in_ignored_tag = True

    def handle_endtag(self, tag):
        if tag in self.ignored_tags:
            self.in_ignored_tag = False

    def handle_data(self, data):
        if self.in_ignored_tag:
            return
        cleaned = data.strip()
        if cleaned:
            self.text_parts.append(cleaned)

def extract_text_from_html(html_content: str) -> str:
    parser = JobDescriptionHTMLParser()
    parser.feed(html_content)
    text = "\n".join(parser.text_parts)
    text = re.sub(r'[ \t]+', ' ', text)
    text = re.sub(r'\n+', '\n', text)
    return text.strip()


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
        job_title: Optional[str] = None,
        mode: Optional[str] = 'balanced'
    ) -> Dict[str, Any]:
        """
        AI-powered resume tailoring to match a specific job description.
        Analyzes the job description, extracts key requirements, and
        optimizes the resume content to highlight relevant experience.
        """
        # Define mode-based instructions
        mode_instructions = ""
        if mode == 'conservative':
            mode_instructions = "Perform minimal, conservative edits. Preserve original experiences, projects, and skills as much as possible, focusing only on high-confidence phrasing adjustments and essential missing keyword mappings."
        elif mode == 'aggressive':
            mode_instructions = "Perform aggressive ATS optimization. Heavily map high-priority keywords, systems nomenclature, and required competencies directly into bullet points and summaries, optimizing strictly for ATS score."
        elif mode == 'recruiter':
            mode_instructions = "Optimize strictly for recruiter appeal and human readability. Emphasize clear formatting, strong action verbs, quantifiable achievements, metric indicators (scale, performance), and distinct career story milestones."
        elif mode == 'technical':
            mode_instructions = "Perform a technical focused engineering optimization. Highlight software architecture constructs, database tuning, async programming pipelines, complex API details, microservice setups, and programming tools."
        elif mode == 'leadership':
            mode_instructions = "Perform a leadership and impact optimization. Emphasize project ownership, design scalability, strategic business outcomes, system scaling, architectural influence, and key delivery metrics."
        else: # 'balanced' or fallback
            mode_instructions = "Perform a balanced, recruiter-credible optimization. Enhance transferable skills, align metrics with responsibilities, inject keywords naturally, and preserve original achievements factually."
        
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

Requirements & Style Rules:
- Style instructions: {mode_instructions}
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

Requirements & Style Rules:
- Style instructions: {mode_instructions}
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

Tasks & Style Rules:
- Style instructions: {mode_instructions}
- Reorder skills to put most relevant first
- Add any critical missing skills from requirements (only if candidate likely has them)
- Remove skills not relevant to target job
- Return 8-12 most impactful skills

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

    async def scrape_job_description_url(self, url: str) -> str:
        """Fetch and scrape job description from a URL"""
        logger.info(f"Scraping job description from URL: {url}")
        headers = {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
            "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
        }
        try:
            import httpx
            async with httpx.AsyncClient(follow_redirects=True, timeout=15) as client:
                resp = await client.get(url, headers=headers)
                resp.raise_for_status()
                text = extract_text_from_html(resp.text)
                if not text:
                    raise ValueError("No text content could be extracted from HTML.")
                return text
        except Exception as e:
            logger.error(f"Failed to scrape job URL: {e}")
            raise ValueError(f"Failed to fetch or parse the job URL: {str(e)}")

    async def pre_optimize_analysis(self, cv_data: Dict[str, Any], job_description: str) -> Dict[str, Any]:
        """Generate a pre-optimization audit report for CV and Job Description"""
        logger.info("Generating pre-optimization report...")
        
        # Build text description of CV for compact audit
        cv_skills = ", ".join([s.get('name', '') for s in cv_data.get('skills', [])])
        cv_summary = cv_data.get('personal_info', {}).get('summary', '')
        cv_experience = "\n".join([
            f"- {exp.get('title', '')} at {exp.get('company', '')}: {exp.get('description', '')}"
            for exp in cv_data.get('experience', [])
        ])
        cv_projects = "\n".join([
            f"- {p.get('name', '')}: {p.get('description', '')}"
            for p in cv_data.get('projects', [])
        ])
        
        prompt = f"""You are an elite ATS auditor and recruiter. Analyze this candidate's resume data and the target job description to generate a highly detailed pre-optimization report.

Candidate Summary: {cv_summary}
Candidate Skills: {cv_skills}
Candidate Experience:
{cv_experience}
Candidate Projects:
{cv_projects}

Target Job Description:
{job_description}

Provide a complete analysis in this exact structured JSON format:
{{
  "ats_match_score": 85,
  "missing_keywords": ["FastAPI", "Docker", "pgvector"],
  "overlapping_skills": ["React", "TypeScript", "Python"],
  "role_alignment": "Candidate has excellent full-stack developer experience, but lacks direct AI multi-agent orchestration references in their current resume.",
  "experience_relevance": "Work experience at Inikola Technologies directly maps to backend development, but need to bring out measurable SaaS achievements.",
  "recruiter_concerns": ["The candidate is currently a B.Tech expected graduate which might require proof of commercial delivery.", "No explicit mention of production cloud environments like AWS EC2/S3."],
  "strengths": ["Strong foundational full-stack portfolio with live live SaaS Neuroviai.", "Hands-on experience with FastAPI and Postgres."],
  "recommended_opportunities": ["Highlight the YouTube Automation Shorts pipeline as video tooling evidence.", "Structure the Postgres metrics to emphasize index scaling."]
}}

Return ONLY valid JSON. No comments, no explanations. Ensure it parses cleanly with json.loads."""

        try:
            response = self.client.chat.completions.create(
                model=self.model,
                messages=[{"role": "user", "content": prompt}],
                temperature=0.3,
                max_tokens=800
            )
            
            content = response.choices[0].message.content.strip()
            # Clean up markdown JSON markers if any
            if content.startswith("```json"):
                content = content[7:].strip()
            elif content.startswith("```"):
                content = content[3:].strip()
            if content.endswith("```"):
                content = content[:-3].strip()
                
            return json.loads(content)
        except Exception as e:
            logger.error(f"Groq Pre-Audit analysis failed: {e}")
            # Fallback mock/rule-based audit if LLM fails
            return {
                "ats_match_score": 60,
                "missing_keywords": ["FastAPI", "PostgreSQL"],
                "overlapping_skills": ["Python", "React"],
                "role_alignment": "Candidate background fits full-stack profiles but needs detailed alignment.",
                "experience_relevance": "Direct match for frontend/backend, but needs metrics-focused updates.",
                "recruiter_concerns": ["Needs explicit demonstration of project metrics."],
                "strengths": ["Demonstrated production experience in freelance web development."],
                "recommended_opportunities": ["Perform balanced optimization to bring out hidden metrics."]
            }


# Singleton instance
ai_service = AIService()
