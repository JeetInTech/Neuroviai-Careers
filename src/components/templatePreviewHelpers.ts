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
