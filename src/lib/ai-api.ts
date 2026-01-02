/**
 * AI API Client for CV Forge
 * Handles all AI generation requests using Groq API
 */

const API_BASE = 'http://localhost:8000';

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
      headers: { 'Content-Type': 'application/json' },
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
      headers: { 'Content-Type': 'application/json' },
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
      headers: { 'Content-Type': 'application/json' },
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
      headers: { 'Content-Type': 'application/json' },
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
      headers: { 'Content-Type': 'application/json' },
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
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ cv_data: cvData }),
    });
    
    if (!response.ok) {
      throw new Error('Failed to get suggestions');
    }
    
    const data = await response.json();
    return data.suggestions;
  },
};

export default aiApi;
