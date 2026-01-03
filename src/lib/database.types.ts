// ============================================
// CV FORGE - TYPE DEFINITIONS
// ============================================

// User Profile Types
export type SubscriptionStatus = 'free' | 'premium' | 'enterprise';

export type Profile = {
  id: string;
  email: string;
  username: string;
  display_name: string;
  full_name: string | null;
  avatar_url: string | null;
  address: string | null;
  phone: string | null;
  updated_at: string;
  cv_credits: number;
  subscription_status: SubscriptionStatus;
};

// ============================================
// RESUME/CV CORE TYPES
// ============================================

export type SkillLevel = 'beginner' | 'intermediate' | 'advanced' | 'expert';
export type LanguageProficiency = 'basic' | 'conversational' | 'professional' | 'native';

export type PersonalInfo = {
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
};

export type Education = {
  degree: string;
  field_of_study?: string;
  institution: string;
  location: string;
  start_date: string;
  end_date: string;
  gpa?: string;
  description: string;
  achievements?: string[];
};

export type Experience = {
  title: string;
  company: string;
  location: string;
  start_date: string;
  end_date: string;
  current: boolean;
  description: string;
  achievements?: string[];
  keywords?: string[]; // For ATS optimization
};

export type Skill = {
  name: string;
  level: number; // 1-5 scale
  category: string; // e.g., 'technical', 'soft', 'tools'
  years_of_experience?: number;
};

export type Language = {
  name: string;
  proficiency: LanguageProficiency;
};

export type Certification = {
  name: string;
  issuer: string;
  date: string;
  expiry_date?: string;
  credential_id?: string;
  url?: string;
};

export type Project = {
  name: string;
  description: string;
  technologies: string[];
  url?: string;
  github_url?: string;
  start_date?: string;
  end_date?: string;
  highlights?: string[];
};

// ============================================
// CV/RESUME DOCUMENT TYPE
// ============================================

export type CVTemplate = 
  | 'professional'
  | 'classic-professional'
  | 'modern-minimal'
  | 'minimal'
  | 'tech-focused'
  | 'software-engineer'
  | 'fresher'
  | 'entry-level'
  | 'data-scientist'
  | 'data-science'
  | 'ai-ml-engineer'
  | 'ai-ml'
  | 'executive'
  | 'creative'
  | 'creative-bold'
  | 'designer'
  | 'freelancer'
  | 'consultant'
  | 'academic';

export type CVTargetRole = 
  // Engineering & Tech
  | 'software-engineer'
  | 'mobile-app-developer'
  | 'qa-engineer'
  | 'systems-engineer'
  // Data, Analytics & Research
  | 'data-scientist'
  | 'data-analyst'
  | 'research-analyst'
  | 'ai-ml-engineer'
  // Product, Operations & Management
  | 'product-manager'
  | 'project-manager'
  | 'program-manager'
  | 'operations-manager'
  // Business, Finance & Sales
  | 'financial-analyst'
  | 'accountant'
  | 'sales-executive'
  | 'business-development'
  // Marketing & Content
  | 'content-writer'
  | 'social-media-manager'
  | 'seo-specialist'
  // Creative
  | 'graphic-designer'
  | 'video-editor'
  | 'designer'
  // Healthcare & Science
  | 'healthcare-admin'
  | 'clinical-research'
  // Legal, HR & Admin
  | 'hr-manager'
  | 'legal-assistant'
  | 'admin-assistant'
  // Emerging & Modern
  | 'ai-prompt-engineer'
  | 'automation-specialist'
  | 'technical-writer'
  // General
  | 'fresher'
  | 'freelancer'
  | 'executive'
  | 'other';

export type CV = {
  id: string;
  user_id: string;
  template: string;
  target_role?: CVTargetRole;
  ats_score?: number; // 0-100
  personal_info: PersonalInfo;
  education: Education[];
  experience: Experience[];
  skills: Skill[];
  languages: Language[];
  certifications: Certification[];
  projects?: Project[];
  custom_sections?: CustomSection[];
  // Color customization
  accent_color?: string; // Hex color code
  is_grayscale?: boolean; // Black & white mode
  created_at: string;
  updated_at: string;
};

export type CustomSection = {
  title: string;
  items: {
    title: string;
    subtitle?: string;
    date?: string;
    description?: string;
  }[];
};

// ============================================
// ATS OPTIMIZATION TYPES
// ============================================

export type ATSKeyword = {
  keyword: string;
  category: 'skill' | 'tool' | 'methodology' | 'certification' | 'action-verb';
  relevance_score: number; // 0-100
  found_in_resume: boolean;
};

export type ATSAnalysis = {
  overall_score: number;
  keyword_match_score: number;
  format_score: number;
  content_score: number;
  suggestions: ATSSuggestion[];
  missing_keywords: ATSKeyword[];
  strong_points: string[];
};

export type ATSSuggestion = {
  type: 'critical' | 'important' | 'nice-to-have';
  section: string;
  message: string;
  action?: string;
};

// ============================================
// LATEX EXPORT TYPES
// ============================================

export type LaTeXExportOptions = {
  template: 'simple' | 'fresher' | 'software-engineer' | 'ai-ml' | 'data-scientist' | 'professional' | 'minimal';
  font_size: '10pt' | '11pt' | '12pt';
  paper_size: 'a4paper' | 'letterpaper';
  color_scheme?: string;
  include_photo: boolean;
};

// ============================================
// SOCIAL/SHARING TYPES (Legacy - kept for compatibility)
// ============================================

export type CVPost = {
  id: string;
  user_id: string;
  cv_id: string;
  caption: string;
  created_at: string;
  updated_at: string;
};

export type PostLike = {
  id: string;
  post_id: string;
  user_id: string;
  created_at: string;
};

export type PostComment = {
  id: string;
  post_id: string;
  user_id: string;
  content: string;
  created_at: string;
  updated_at: string;
};

// ============================================
// DATABASE SCHEMA TYPE
// ============================================

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: Profile;
        Insert: Omit<Profile, 'id' | 'updated_at'>;
        Update: Partial<Omit<Profile, 'id'>>;
      };
      cvs: {
        Row: CV;
        Insert: Omit<CV, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<CV, 'id' | 'user_id'>>;
      };
      cv_posts: {
        Row: CVPost;
        Insert: Omit<CVPost, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<CVPost, 'id' | 'user_id'>>;
      };
      post_likes: {
        Row: PostLike;
        Insert: Omit<PostLike, 'id' | 'created_at'>;
        Update: never;
      };
      post_comments: {
        Row: PostComment;
        Insert: Omit<PostComment, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<PostComment, 'id' | 'user_id' | 'post_id'>>;
      };
    };
  };
};