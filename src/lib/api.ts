const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

// Type definitions
interface Profile {
  id: string;
  email: string;
  username?: string;
  display_name?: string;
  bio?: string;
  avatar_url?: string;
  linkedin_url?: string;
  github_url?: string;
  portfolio_url?: string;
  cv_credits: number;
  subscription_status: string;
  created_at: string;
}

// CV Types matching frontend database schema
interface PersonalInfo {
  full_name: string;
  email: string;
  phone: string;
  address: string;
  city?: string;
  country?: string;
  linkedin_url?: string;
  github_url?: string;
  portfolio_url?: string;
  summary: string;
  photo_url?: string;
}

interface Education {
  degree: string;
  field_of_study?: string;
  institution: string;
  location: string;
  start_date: string;
  end_date: string;
  gpa?: string;
  description: string;
  achievements?: string[];
}

interface Experience {
  title: string;
  company: string;
  location: string;
  start_date: string;
  end_date: string;
  current: boolean;
  description: string;
  achievements?: string[];
  keywords?: string[];
}

interface Skill {
  name: string;
  level: number;
  category: string;
  years_of_experience?: number;
}

interface Language {
  name: string;
  proficiency: string;
}

interface Certification {
  name: string;
  issuer: string;
  date: string;
  expiry_date?: string;
  credential_id?: string;
  url?: string;
}

interface Project {
  name: string;
  description: string;
  technologies: string[];
  url?: string;
  github_url?: string;
  start_date?: string;
  end_date?: string;
  highlights?: string[];
}

interface CV {
  id: string;
  user_id: string;
  template: string;
  target_role?: string;
  ats_score?: number;
  personal_info: PersonalInfo;
  education: Education[];
  experience: Experience[];
  skills: Skill[];
  languages: Language[];
  certifications: Certification[];
  projects: Project[];
  accent_color?: string;
  is_grayscale?: boolean;
  created_at: string;
  updated_at: string;
}

interface CVCreateData {
  template: string;
  target_role?: string;
  personal_info: Partial<PersonalInfo>;
  education?: Education[];
  experience?: Experience[];
  skills?: Skill[];
  languages?: Language[];
  certifications?: Certification[];
  projects?: Project[];
  accent_color?: string;
  is_grayscale?: boolean;
}

// Legacy CVData for ATS analysis
interface CVData {
  title: string;
  target_role?: string;
  personal_info: Record<string, string>;
  summary?: string;
  experience: Array<Record<string, unknown>>;
  education: Array<Record<string, unknown>>;
  skills: string[];
  projects: Array<Record<string, unknown>>;
  certifications: Array<Record<string, unknown>>;
  languages: Array<Record<string, unknown>>;
}

class ApiClient {
  private baseUrl: string;
  private accessToken: string | null = null;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
    this.loadToken();
  }

  private loadToken() {
    this.accessToken = localStorage.getItem('access_token');
  }

  setToken(token: string) {
    this.accessToken = token;
    localStorage.setItem('access_token', token);
  }

  clearToken() {
    this.accessToken = null;
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (this.accessToken) {
      (headers as Record<string, string>)['Authorization'] = `Bearer ${this.accessToken}`;
    }

    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      ...options,
      headers,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.detail || 'Request failed');
    }

    return data;
  }

  // Auth endpoints
  async signUp(email: string, password: string, username: string, displayName?: string) {
    const result = await this.request<{
      success: boolean;
      message: string;
      user_id?: string;
    }>('/auth/signup', {
      method: 'POST',
      body: JSON.stringify({
        email,
        password,
        username,
        display_name: displayName || username,
      }),
    });
    return result;
  }

  async signIn(emailOrUsername: string, password: string) {
    const result = await this.request<{
      success: boolean;
      message: string;
      user_id?: string;
      access_token?: string;
      refresh_token?: string;
    }>('/auth/signin', {
      method: 'POST',
      body: JSON.stringify({
        email_or_username: emailOrUsername,
        password,
      }),
    });

    if (result.access_token) {
      this.setToken(result.access_token);
      if (result.refresh_token) {
        localStorage.setItem('refresh_token', result.refresh_token);
      }
    }

    return result;
  }

  async signOut() {
    await this.request('/auth/signout', { method: 'POST' });
    this.clearToken();
  }

  async resetPassword(email: string) {
    return this.request('/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  }

  // Profile endpoints
  async getMyProfile() {
    return this.request<Profile>('/profile/me');
  }

  async updateProfile(data: {
    username?: string;
    display_name?: string;
    bio?: string;
    avatar_url?: string;
    linkedin_url?: string;
    github_url?: string;
    portfolio_url?: string;
  }) {
    return this.request('/profile/me', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async getProfileByUsername(username: string) {
    return this.request<Profile>(`/profile/${username}`);
  }

  // CV endpoints
  async createCV(data: CVCreateData) {
    return this.request<{ success: boolean; cv: CV }>('/cv/create', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async listMyCVs() {
    return this.request<{ cvs: CV[] }>('/cv/list');
  }

  async getCV(cvId: string) {
    return this.request<CV>(`/cv/${cvId}`);
  }

  async updateCV(cvId: string, data: CVCreateData) {
    return this.request<{ success: boolean; cv: CV }>(`/cv/${cvId}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteCV(cvId: string) {
    return this.request(`/cv/${cvId}`, { method: 'DELETE' });
  }

  async publishCV(cvId: string) {
    return this.request(`/cv/${cvId}/publish`, { method: 'POST' });
  }

  async unpublishCV(cvId: string) {
    return this.request(`/cv/${cvId}/unpublish`, { method: 'POST' });
  }

  // ATS endpoints
  async analyzeCV(cvData: CVData, targetRole: string, jobDescription?: string) {
    return this.request<{
      overall_score: number;
      keyword_score: number;
      format_score: number;
      content_score: number;
      suggestions: string[];
      missing_keywords: string[];
      matched_keywords: string[];
    }>('/ats/analyze', {
      method: 'POST',
      body: JSON.stringify({
        cv_data: cvData,
        target_role: targetRole,
        job_description: jobDescription,
      }),
    });
  }

  async analyzeSavedCV(cvId: string, targetRole: string, jobDescription?: string) {
    const params = new URLSearchParams({ target_role: targetRole });
    if (jobDescription) {
      params.append('job_description', jobDescription);
    }
    return this.request(`/ats/${cvId}/analyze?${params}`, {
      method: 'POST',
    });
  }

  // Document parsing endpoint
  async parseDocument(file: File) {
    const formData = new FormData();
    formData.append('file', file);

    const headers: HeadersInit = {};
    if (this.accessToken) {
      headers['Authorization'] = `Bearer ${this.accessToken}`;
    }

    const response = await fetch(`${this.baseUrl}/document/parse`, {
      method: 'POST',
      headers,
      body: formData,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.detail || 'Failed to parse document');
    }

    return data as {
      success: boolean;
      message: string;
      data: {
        personal_info: Partial<PersonalInfo>;
        experience: Partial<Experience>[];
        education: Partial<Education>[];
        skills: Partial<Skill>[];
        projects: Partial<Project>[];
        certifications: Partial<Certification>[];
        languages: Partial<Language>[];
        raw_text: string;
      };
    };
  }

  // LinkedIn import endpoints
  async getLinkedInStatus() {
    return this.request<{
      configured: boolean;
      provider: string | null;
      message: string;
    }>('/linkedin/status');
  }

  async importLinkedInProfile(linkedinUrl: string) {
    return this.request<{
      success: boolean;
      message: string;
      data: {
        personal_info: Partial<PersonalInfo>;
        experience: Partial<Experience>[];
        education: Partial<Education>[];
        skills: Partial<Skill>[];
        certifications: Partial<Certification>[];
        languages: Partial<Language>[];
      };
    }>('/linkedin/import', {
      method: 'POST',
      body: JSON.stringify({ linkedin_url: linkedinUrl }),
    });
  }
}

export const api = new ApiClient(API_URL);
export default api;
