/**
 * Template preview lookup helpers & featured templates array.
 * 
 * Separated from FullTemplatePreviews.tsx so that file only exports
 * React components (required by Vite fast refresh).
 */

import React from 'react';
import {
  SoftwareEngineerFull,
  MobileAppDeveloperFull,
  SystemsEngineerFull,
  DataScientistFull,
  AIMLFull,
  GraphicDesignerFull,
  VideoEditorFull,
  ContentWriterFull,
  FresherFull,
  FreelancerFull,
  ExecutiveFull,
  ProjectManagerFull,
  BusinessAnalystFull,
  MarketingFull,
  AcademicFull,
  DevOpsEngineerFull,
} from './FullTemplatePreviews';

interface FullPreviewProps {
  className?: string;
}

/**
 * Get full-size preview component by template ID.
 * Used by Portfolio.tsx for template gallery.
 */
export const getFullTemplatePreview = (templateId: string): React.FC<FullPreviewProps> => {
  const mapping: Record<string, React.FC<FullPreviewProps>> = {
    // Engineering & Tech
    'software-engineer': SoftwareEngineerFull,
    'tech-focused': SoftwareEngineerFull,
    'mobile-app-developer': MobileAppDeveloperFull,
    'systems-engineer': SystemsEngineerFull,
    // Data & AI
    'data-scientist': DataScientistFull,
    'data-science': DataScientistFull,
    'ai-ml-engineer': AIMLFull,
    'ai-ml': AIMLFull,
    // Creative
    'graphic-designer': GraphicDesignerFull,
    'designer': GraphicDesignerFull,
    'video-editor': VideoEditorFull,
    'content-writer': ContentWriterFull,
    // General
    'fresher': FresherFull,
    'entry-level': FresherFull,
    'freelancer': FreelancerFull,
    'executive': ExecutiveFull,
    // Additional
    'project-manager': ProjectManagerFull,
    'business-analyst': BusinessAnalystFull,
    'marketing': MarketingFull,
    'academic': AcademicFull,
    'devops-engineer': DevOpsEngineerFull,
  };
  return mapping[templateId] || SoftwareEngineerFull;
};

/**
 * Featured templates shown on the Home page carousel.
 * Each entry must have a matching Full preview component in FullTemplatePreviews.tsx.
 */
export const FULL_PREVIEW_TEMPLATES = [
  {
    id: 'tech-focused',
    name: 'Software Engineer',
    component: SoftwareEngineerFull,
    gradient: 'from-blue-500 to-indigo-600',
  },
  {
    id: 'data-science',
    name: 'Data Scientist',
    component: DataScientistFull,
    gradient: 'from-purple-500 to-pink-600',
  },
  {
    id: 'ai-ml',
    name: 'AI/ML Engineer',
    component: AIMLFull,
    gradient: 'from-green-500 to-teal-600',
  },
  {
    id: 'project-manager',
    name: 'Project Manager',
    component: ProjectManagerFull,
    gradient: 'from-amber-500 to-orange-600',
  },
  {
    id: 'executive',
    name: 'Executive',
    component: ExecutiveFull,
    gradient: 'from-slate-600 to-gray-800',
  },
  {
    id: 'fresher',
    name: 'Fresher / Student',
    component: FresherFull,
    gradient: 'from-cyan-500 to-blue-600',
  },
  {
    id: 'freelancer',
    name: 'Freelancer',
    component: FreelancerFull,
    gradient: 'from-pink-500 to-rose-600',
  },
  {
    id: 'marketing',
    name: 'Marketing',
    component: MarketingFull,
    gradient: 'from-violet-500 to-fuchsia-600',
  },
  {
    id: 'devops-engineer',
    name: 'DevOps Engineer',
    component: DevOpsEngineerFull,
    gradient: 'from-orange-500 to-red-600',
  },
  {
    id: 'business-analyst',
    name: 'Business Analyst',
    component: BusinessAnalystFull,
    gradient: 'from-emerald-500 to-teal-600',
  },
];

export const DEFAULT_SAMPLE_CV_DATA = {
  personal_info: {
    full_name: "Sangramjeet Ghosh",
    email: "sangramjeet47@gmail.com",
    phone: "+91 9059150937",
    address: "Hyderabad, India",
    city: "Hyderabad",
    country: "India",
    linkedin_url: "https://linkedin.com/in/sangramjeetghosh",
    github_url: "https://github.com/JeetInTech",
    portfolio_url: "https://sangramjeet.me",
    summary: "Full Stack AI Engineer who builds and ships complete, production-grade AI-powered products — from React/Next.js frontends and FastAPI backends to LLM orchestration layers and cloud deployments. Designed and launched Neuroviai, a live SaaS with AI content pipelines, subscription billing, and multi-platform publishing. Strong focus on building real products: responsive UIs, performant APIs, and AI features users can actually interact with."
  },
  education: [
    {
      degree: "B.Tech",
      field_of_study: "Computer Science & Engineering (AI & ML)",
      institution: "Malla Reddy University",
      location: "Hyderabad, India",
      start_date: "2022",
      end_date: "2026 (Expected)",
      gpa: "8.0 / 10.0",
      description: "Specialized in Artificial Intelligence and Machine Learning frameworks."
    }
  ],
  experience: [
    {
      title: "Freelance Full Stack AI Developer",
      company: "Startup Founders",
      location: "Remote",
      start_date: "Aug 2025",
      end_date: "Present",
      current: true,
      description: "Built end-to-end AI-powered web apps for 3+ startup founders: React/Next.js frontends, FastAPI backends, LLM pipelines, and cloud deployments with full handoff documentation.",
      achievements: [
        "Delivered subscription billing (Razorpay), JWT/OAuth RBAC, real-time dashboards, and multi-platform API integrations.",
        "Managed LLM costs via quota splitting and response caching."
      ]
    },
    {
      title: "Data Science Intern",
      company: "Inikola Technologies",
      location: "Hyderabad, India",
      start_date: "Mar 2025",
      end_date: "Dec 2025",
      current: false,
      description: "Developed FastAPI NLP features (sentiment scoring, topic extraction) for CraftingBrain, a live content-tech platform serving real users.",
      achievements: [
        "Containerized services with Docker, managed AWS (EC2, S3, Nginx), and shipped CI/CD pipelines via GitHub Actions."
      ]
    }
  ],
  skills: [
    {
      category: "Frontend",
      items: ["React 18", "Next.js 14", "TypeScript", "Tailwind CSS", "ShadCN/UI", "Zustand", "Framer Motion", "Vite"]
    },
    {
      category: "Backend & DB",
      items: ["FastAPI", "Node.js", "Express", "PostgreSQL", "Supabase", "pgvector", "Redis", "MongoDB", "SQLAlchemy"]
    },
    {
      category: "AI & DevOps",
      items: ["Gemini API", "OpenAI API", "LangChain", "RAG Pipelines", "Docker", "GitHub Actions CI/CD", "AWS", "Nginx"]
    }
  ],
  languages: [
    { name: "English", proficiency: "Professional" },
    { name: "Hindi", proficiency: "Native" }
  ],
  certifications: [
    { name: "Full Stack Developer", issuer: "Meta", date: "2024" }
  ],
  projects: [
    {
      name: "Neuroviai — AI Social Media Automation SaaS",
      description: "AI Social Media Automation SaaS featuring Next.js, FastAPI, PostgreSQL, Supabase, Gemini, OpenAI, Razorpay, and Docker.",
      technologies: ["Next.js", "FastAPI", "Supabase", "Gemini", "Docker"],
      url: "https://neuroviai.com",
      highlights: [
        "Built the complete product with a Next.js 14 frontend and a FastAPI microservice backend.",
        "Engineered a 4-tier LLM fallback for 99.7% generation reliability.",
        "Integrated OAuth and webhook flows with a credit-tracking economy."
      ]
    }
  ]
};
