/**
 * AI API Client for CV Forge
 * Handles all AI generation requests using Groq API
 */

const API_BASE = import.meta.env.VITE_API_URL || 'https://neurovia-career.onrender.com';

/**
 * Get authorization header if user is logged in
 */
function getAuthHeaders(): HeadersInit {
  const token = localStorage.getItem('access_token');
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
}

interface SummaryRequest {
  job_title: string;
  experience_years?: number;
  skills?: string[];
  tone?: string;
}

interface ExperienceRequest {
  job_title: string;
  company?: string;
  responsibilities?: string;
  num_bullets?: number;
}

interface SkillsRequest {
  job_title: string;
  category?: string;
  num_skills?: number;
}

interface EnhanceRequest {
  text: string;
  context?: string;
}

interface EducationRequest {
  degree: string;
  field: string;
  achievements?: string;
}

export const aiApi = {
  async generateSummary(request: SummaryRequest): Promise<string> {
    const response = await fetch(`${API_BASE}/ai/generate-summary`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(request),
    });
    
    if (!response.ok) {
      throw new Error('Failed to generate summary');
    }
    
    const data = await response.json();
    return data.summary;
  },

  async generateExperienceBullets(request: ExperienceRequest): Promise<string[]> {
    const response = await fetch(`${API_BASE}/ai/generate-bullets`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(request),
    });
    
    if (!response.ok) {
      throw new Error('Failed to generate experience bullets');
    }
    
    const data = await response.json();
    return data.bullets;
  },

  async generateSkills(request: SkillsRequest): Promise<string[]> {
    const response = await fetch(`${API_BASE}/ai/generate-skills`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(request),
    });
    
    if (!response.ok) {
      throw new Error('Failed to generate skills');
    }
    
    const data = await response.json();
    return data.skills;
  },

  async enhanceText(request: EnhanceRequest): Promise<string> {
    const response = await fetch(`${API_BASE}/ai/enhance-text`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(request),
    });
    
    if (!response.ok) {
      throw new Error('Failed to enhance text');
    }
    
    const data = await response.json();
    return data.enhanced_text;
  },

  async generateEducation(request: EducationRequest): Promise<string> {
    const response = await fetch(`${API_BASE}/ai/generate-education`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(request),
    });
    
    if (!response.ok) {
      throw new Error('Failed to generate education description');
    }
    
    const data = await response.json();
    return data.description;
  },

  async getSuggestions(cvData: Record<string, unknown>): Promise<Array<{
    section: string;
    issue: string;
    fix: string;
  }>> {
    const response = await fetch(`${API_BASE}/ai/suggest-improvements`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ cv_data: cvData }),
    });
    
    if (!response.ok) {
      throw new Error('Failed to get suggestions');
    }
    
    const data = await response.json();
    return data.suggestions;
  },

  /**
   * AI Resume Tailoring - Optimizes resume to match a specific job description
   */
  async tailorResumeToJob(
    cvData: Record<string, unknown>,
    jobDescription: string,
    jobTitle?: string
  ): Promise<{
    tailored_cv: Record<string, unknown>;
    match_score: number;
    job_analysis: {
      required_skills: string[];
      ats_keywords: string[];
      key_responsibilities: string[];
    };
    optimizations_made: string[];
  }> {
    const response = await fetch(`${API_BASE}/ai/tailor-resume`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({
        cv_data: cvData,
        job_description: jobDescription,
        job_title: jobTitle,
      }),
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || 'Failed to tailor resume');
    }
    
    return response.json();
  },
};

export default aiApi;
