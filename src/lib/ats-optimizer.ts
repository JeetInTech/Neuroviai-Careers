/**
 * CV Forge - ATS Optimization Engine
 * Analyzes and scores resumes for ATS compatibility
 */

import type { CV, ATSAnalysis, ATSSuggestion, ATSKeyword, CVTargetRole } from './database.types';

// ============================================
// KEYWORD DATABASE BY ROLE
// ============================================

const ROLE_KEYWORDS: Record<CVTargetRole, ATSKeyword[]> = {
  'software-engineer': [
    { keyword: 'JavaScript', category: 'skill', relevance_score: 95, found_in_resume: false },
    { keyword: 'TypeScript', category: 'skill', relevance_score: 90, found_in_resume: false },
    { keyword: 'React', category: 'tool', relevance_score: 90, found_in_resume: false },
    { keyword: 'Node.js', category: 'tool', relevance_score: 85, found_in_resume: false },
    { keyword: 'Python', category: 'skill', relevance_score: 85, found_in_resume: false },
    { keyword: 'SQL', category: 'skill', relevance_score: 80, found_in_resume: false },
    { keyword: 'Git', category: 'tool', relevance_score: 85, found_in_resume: false },
    { keyword: 'Agile', category: 'methodology', relevance_score: 75, found_in_resume: false },
    { keyword: 'REST API', category: 'skill', relevance_score: 80, found_in_resume: false },
    { keyword: 'CI/CD', category: 'methodology', relevance_score: 75, found_in_resume: false },
    { keyword: 'Docker', category: 'tool', relevance_score: 80, found_in_resume: false },
    { keyword: 'AWS', category: 'tool', relevance_score: 80, found_in_resume: false },
    { keyword: 'developed', category: 'action-verb', relevance_score: 70, found_in_resume: false },
    { keyword: 'implemented', category: 'action-verb', relevance_score: 70, found_in_resume: false },
    { keyword: 'optimized', category: 'action-verb', relevance_score: 70, found_in_resume: false },
  ],
  'mobile-app-developer': [
    { keyword: 'Kotlin', category: 'skill', relevance_score: 95, found_in_resume: false },
    { keyword: 'Swift', category: 'skill', relevance_score: 95, found_in_resume: false },
    { keyword: 'Flutter', category: 'tool', relevance_score: 90, found_in_resume: false },
    { keyword: 'React Native', category: 'tool', relevance_score: 90, found_in_resume: false },
    { keyword: 'Android', category: 'skill', relevance_score: 90, found_in_resume: false },
    { keyword: 'iOS', category: 'skill', relevance_score: 90, found_in_resume: false },
    { keyword: 'Play Store', category: 'tool', relevance_score: 80, found_in_resume: false },
    { keyword: 'App Store', category: 'tool', relevance_score: 80, found_in_resume: false },
    { keyword: 'CI/CD', category: 'methodology', relevance_score: 75, found_in_resume: false },
    { keyword: 'Firebase', category: 'tool', relevance_score: 80, found_in_resume: false },
    { keyword: 'published', category: 'action-verb', relevance_score: 70, found_in_resume: false },
    { keyword: 'deployed', category: 'action-verb', relevance_score: 70, found_in_resume: false },
  ],
  'qa-engineer': [
    { keyword: 'Selenium', category: 'tool', relevance_score: 95, found_in_resume: false },
    { keyword: 'JUnit', category: 'tool', relevance_score: 90, found_in_resume: false },
    { keyword: 'TestNG', category: 'tool', relevance_score: 90, found_in_resume: false },
    { keyword: 'Regression Testing', category: 'skill', relevance_score: 90, found_in_resume: false },
    { keyword: 'Automation Frameworks', category: 'skill', relevance_score: 85, found_in_resume: false },
    { keyword: 'Manual Testing', category: 'skill', relevance_score: 80, found_in_resume: false },
    { keyword: 'Defect Tracking', category: 'skill', relevance_score: 80, found_in_resume: false },
    { keyword: 'Test Cases', category: 'skill', relevance_score: 85, found_in_resume: false },
    { keyword: 'Cypress', category: 'tool', relevance_score: 80, found_in_resume: false },
    { keyword: 'validated', category: 'action-verb', relevance_score: 70, found_in_resume: false },
    { keyword: 'tested', category: 'action-verb', relevance_score: 70, found_in_resume: false },
  ],
  'systems-engineer': [
    { keyword: 'Linux', category: 'skill', relevance_score: 95, found_in_resume: false },
    { keyword: 'Networking', category: 'skill', relevance_score: 90, found_in_resume: false },
    { keyword: 'Monitoring', category: 'skill', relevance_score: 85, found_in_resume: false },
    { keyword: 'System Administration', category: 'skill', relevance_score: 90, found_in_resume: false },
    { keyword: 'Infrastructure', category: 'skill', relevance_score: 85, found_in_resume: false },
    { keyword: 'Shell Scripting', category: 'skill', relevance_score: 80, found_in_resume: false },
    { keyword: 'Ansible', category: 'tool', relevance_score: 80, found_in_resume: false },
    { keyword: 'Kubernetes', category: 'tool', relevance_score: 80, found_in_resume: false },
    { keyword: 'configured', category: 'action-verb', relevance_score: 70, found_in_resume: false },
    { keyword: 'maintained', category: 'action-verb', relevance_score: 70, found_in_resume: false },
  ],
  'data-scientist': [
    { keyword: 'Python', category: 'skill', relevance_score: 95, found_in_resume: false },
    { keyword: 'Machine Learning', category: 'skill', relevance_score: 95, found_in_resume: false },
    { keyword: 'SQL', category: 'skill', relevance_score: 90, found_in_resume: false },
    { keyword: 'TensorFlow', category: 'tool', relevance_score: 85, found_in_resume: false },
    { keyword: 'PyTorch', category: 'tool', relevance_score: 85, found_in_resume: false },
    { keyword: 'Pandas', category: 'tool', relevance_score: 90, found_in_resume: false },
    { keyword: 'NumPy', category: 'tool', relevance_score: 85, found_in_resume: false },
    { keyword: 'Data Visualization', category: 'skill', relevance_score: 80, found_in_resume: false },
    { keyword: 'Statistical Analysis', category: 'skill', relevance_score: 85, found_in_resume: false },
    { keyword: 'Deep Learning', category: 'skill', relevance_score: 80, found_in_resume: false },
    { keyword: 'analyzed', category: 'action-verb', relevance_score: 70, found_in_resume: false },
    { keyword: 'predicted', category: 'action-verb', relevance_score: 70, found_in_resume: false },
  ],
  'data-analyst': [
    { keyword: 'SQL', category: 'skill', relevance_score: 95, found_in_resume: false },
    { keyword: 'Power BI', category: 'tool', relevance_score: 95, found_in_resume: false },
    { keyword: 'Tableau', category: 'tool', relevance_score: 90, found_in_resume: false },
    { keyword: 'Excel', category: 'tool', relevance_score: 90, found_in_resume: false },
    { keyword: 'KPI Analysis', category: 'skill', relevance_score: 85, found_in_resume: false },
    { keyword: 'Data Visualization', category: 'skill', relevance_score: 85, found_in_resume: false },
    { keyword: 'Business Intelligence', category: 'skill', relevance_score: 80, found_in_resume: false },
    { keyword: 'Reporting', category: 'skill', relevance_score: 85, found_in_resume: false },
    { keyword: 'analyzed', category: 'action-verb', relevance_score: 70, found_in_resume: false },
    { keyword: 'visualized', category: 'action-verb', relevance_score: 70, found_in_resume: false },
  ],
  'research-analyst': [
    { keyword: 'Qualitative Analysis', category: 'skill', relevance_score: 95, found_in_resume: false },
    { keyword: 'Quantitative Research', category: 'skill', relevance_score: 95, found_in_resume: false },
    { keyword: 'Data Collection', category: 'skill', relevance_score: 90, found_in_resume: false },
    { keyword: 'Statistical Analysis', category: 'skill', relevance_score: 85, found_in_resume: false },
    { keyword: 'Research Methodology', category: 'skill', relevance_score: 90, found_in_resume: false },
    { keyword: 'SPSS', category: 'tool', relevance_score: 80, found_in_resume: false },
    { keyword: 'Publications', category: 'skill', relevance_score: 75, found_in_resume: false },
    { keyword: 'researched', category: 'action-verb', relevance_score: 70, found_in_resume: false },
    { keyword: 'published', category: 'action-verb', relevance_score: 70, found_in_resume: false },
  ],
  'ai-ml-engineer': [
    { keyword: 'Python', category: 'skill', relevance_score: 95, found_in_resume: false },
    { keyword: 'TensorFlow', category: 'tool', relevance_score: 95, found_in_resume: false },
    { keyword: 'PyTorch', category: 'tool', relevance_score: 95, found_in_resume: false },
    { keyword: 'Deep Learning', category: 'skill', relevance_score: 95, found_in_resume: false },
    { keyword: 'Neural Networks', category: 'skill', relevance_score: 90, found_in_resume: false },
    { keyword: 'NLP', category: 'skill', relevance_score: 85, found_in_resume: false },
    { keyword: 'Computer Vision', category: 'skill', relevance_score: 85, found_in_resume: false },
    { keyword: 'MLOps', category: 'methodology', relevance_score: 80, found_in_resume: false },
    { keyword: 'Kubernetes', category: 'tool', relevance_score: 75, found_in_resume: false },
    { keyword: 'LLM', category: 'skill', relevance_score: 90, found_in_resume: false },
    { keyword: 'trained', category: 'action-verb', relevance_score: 70, found_in_resume: false },
    { keyword: 'deployed', category: 'action-verb', relevance_score: 70, found_in_resume: false },
  ],
  'product-manager': [
    { keyword: 'Product Strategy', category: 'skill', relevance_score: 95, found_in_resume: false },
    { keyword: 'Roadmap', category: 'skill', relevance_score: 90, found_in_resume: false },
    { keyword: 'Agile', category: 'methodology', relevance_score: 90, found_in_resume: false },
    { keyword: 'Scrum', category: 'methodology', relevance_score: 85, found_in_resume: false },
    { keyword: 'User Research', category: 'skill', relevance_score: 85, found_in_resume: false },
    { keyword: 'A/B Testing', category: 'skill', relevance_score: 80, found_in_resume: false },
    { keyword: 'Stakeholder Management', category: 'skill', relevance_score: 85, found_in_resume: false },
    { keyword: 'Jira', category: 'tool', relevance_score: 75, found_in_resume: false },
    { keyword: 'launched', category: 'action-verb', relevance_score: 70, found_in_resume: false },
    { keyword: 'prioritized', category: 'action-verb', relevance_score: 70, found_in_resume: false },
  ],
  'project-manager': [
    { keyword: 'Agile', category: 'methodology', relevance_score: 95, found_in_resume: false },
    { keyword: 'Scrum', category: 'methodology', relevance_score: 90, found_in_resume: false },
    { keyword: 'PMP', category: 'certification', relevance_score: 90, found_in_resume: false },
    { keyword: 'Stakeholder Management', category: 'skill', relevance_score: 90, found_in_resume: false },
    { keyword: 'Risk Management', category: 'skill', relevance_score: 85, found_in_resume: false },
    { keyword: 'Budget', category: 'skill', relevance_score: 85, found_in_resume: false },
    { keyword: 'Timeline', category: 'skill', relevance_score: 80, found_in_resume: false },
    { keyword: 'Jira', category: 'tool', relevance_score: 80, found_in_resume: false },
    { keyword: 'delivered', category: 'action-verb', relevance_score: 70, found_in_resume: false },
    { keyword: 'coordinated', category: 'action-verb', relevance_score: 70, found_in_resume: false },
  ],
  'program-manager': [
    { keyword: 'Program Governance', category: 'skill', relevance_score: 95, found_in_resume: false },
    { keyword: 'Roadmaps', category: 'skill', relevance_score: 90, found_in_resume: false },
    { keyword: 'Cross-functional Leadership', category: 'skill', relevance_score: 90, found_in_resume: false },
    { keyword: 'Strategic Alignment', category: 'skill', relevance_score: 85, found_in_resume: false },
    { keyword: 'Multi-project Coordination', category: 'skill', relevance_score: 85, found_in_resume: false },
    { keyword: 'Portfolio Management', category: 'skill', relevance_score: 80, found_in_resume: false },
    { keyword: 'orchestrated', category: 'action-verb', relevance_score: 70, found_in_resume: false },
    { keyword: 'aligned', category: 'action-verb', relevance_score: 70, found_in_resume: false },
  ],
  'operations-manager': [
    { keyword: 'Process Optimization', category: 'skill', relevance_score: 95, found_in_resume: false },
    { keyword: 'SOPs', category: 'skill', relevance_score: 90, found_in_resume: false },
    { keyword: 'Operations Strategy', category: 'skill', relevance_score: 90, found_in_resume: false },
    { keyword: 'Cost Reduction', category: 'skill', relevance_score: 85, found_in_resume: false },
    { keyword: 'Team Leadership', category: 'skill', relevance_score: 85, found_in_resume: false },
    { keyword: 'Supply Chain', category: 'skill', relevance_score: 80, found_in_resume: false },
    { keyword: 'KPIs', category: 'skill', relevance_score: 80, found_in_resume: false },
    { keyword: 'streamlined', category: 'action-verb', relevance_score: 70, found_in_resume: false },
    { keyword: 'optimized', category: 'action-verb', relevance_score: 70, found_in_resume: false },
  ],
  'financial-analyst': [
    { keyword: 'Financial Modeling', category: 'skill', relevance_score: 95, found_in_resume: false },
    { keyword: 'Forecasting', category: 'skill', relevance_score: 95, found_in_resume: false },
    { keyword: 'Budgeting', category: 'skill', relevance_score: 90, found_in_resume: false },
    { keyword: 'Variance Analysis', category: 'skill', relevance_score: 85, found_in_resume: false },
    { keyword: 'Excel', category: 'tool', relevance_score: 90, found_in_resume: false },
    { keyword: 'Financial Reporting', category: 'skill', relevance_score: 85, found_in_resume: false },
    { keyword: 'P&L', category: 'skill', relevance_score: 80, found_in_resume: false },
    { keyword: 'analyzed', category: 'action-verb', relevance_score: 70, found_in_resume: false },
    { keyword: 'forecasted', category: 'action-verb', relevance_score: 70, found_in_resume: false },
  ],
  'accountant': [
    { keyword: 'GAAP', category: 'skill', relevance_score: 95, found_in_resume: false },
    { keyword: 'Auditing', category: 'skill', relevance_score: 95, found_in_resume: false },
    { keyword: 'Tax Compliance', category: 'skill', relevance_score: 90, found_in_resume: false },
    { keyword: 'Financial Statements', category: 'skill', relevance_score: 90, found_in_resume: false },
    { keyword: 'Accounts Payable', category: 'skill', relevance_score: 85, found_in_resume: false },
    { keyword: 'Accounts Receivable', category: 'skill', relevance_score: 85, found_in_resume: false },
    { keyword: 'QuickBooks', category: 'tool', relevance_score: 80, found_in_resume: false },
    { keyword: 'reconciled', category: 'action-verb', relevance_score: 70, found_in_resume: false },
    { keyword: 'audited', category: 'action-verb', relevance_score: 70, found_in_resume: false },
  ],
  'sales-executive': [
    { keyword: 'Lead Generation', category: 'skill', relevance_score: 95, found_in_resume: false },
    { keyword: 'CRM', category: 'tool', relevance_score: 90, found_in_resume: false },
    { keyword: 'Sales Targets', category: 'skill', relevance_score: 95, found_in_resume: false },
    { keyword: 'Revenue Growth', category: 'skill', relevance_score: 90, found_in_resume: false },
    { keyword: 'Client Acquisition', category: 'skill', relevance_score: 85, found_in_resume: false },
    { keyword: 'Negotiation', category: 'skill', relevance_score: 85, found_in_resume: false },
    { keyword: 'Salesforce', category: 'tool', relevance_score: 80, found_in_resume: false },
    { keyword: 'closed', category: 'action-verb', relevance_score: 70, found_in_resume: false },
    { keyword: 'exceeded', category: 'action-verb', relevance_score: 70, found_in_resume: false },
  ],
  'business-development': [
    { keyword: 'Market Expansion', category: 'skill', relevance_score: 95, found_in_resume: false },
    { keyword: 'Partnerships', category: 'skill', relevance_score: 95, found_in_resume: false },
    { keyword: 'Revenue Growth', category: 'skill', relevance_score: 90, found_in_resume: false },
    { keyword: 'Strategic Planning', category: 'skill', relevance_score: 90, found_in_resume: false },
    { keyword: 'Client Relations', category: 'skill', relevance_score: 85, found_in_resume: false },
    { keyword: 'Deal Negotiation', category: 'skill', relevance_score: 85, found_in_resume: false },
    { keyword: 'secured', category: 'action-verb', relevance_score: 70, found_in_resume: false },
    { keyword: 'expanded', category: 'action-verb', relevance_score: 70, found_in_resume: false },
  ],
  'content-writer': [
    { keyword: 'SEO Writing', category: 'skill', relevance_score: 95, found_in_resume: false },
    { keyword: 'Blogs', category: 'skill', relevance_score: 90, found_in_resume: false },
    { keyword: 'Copywriting', category: 'skill', relevance_score: 90, found_in_resume: false },
    { keyword: 'Content Strategy', category: 'skill', relevance_score: 85, found_in_resume: false },
    { keyword: 'Editing', category: 'skill', relevance_score: 85, found_in_resume: false },
    { keyword: 'WordPress', category: 'tool', relevance_score: 80, found_in_resume: false },
    { keyword: 'wrote', category: 'action-verb', relevance_score: 70, found_in_resume: false },
    { keyword: 'published', category: 'action-verb', relevance_score: 70, found_in_resume: false },
  ],
  'social-media-manager': [
    { keyword: 'Content Strategy', category: 'skill', relevance_score: 95, found_in_resume: false },
    { keyword: 'Analytics', category: 'skill', relevance_score: 90, found_in_resume: false },
    { keyword: 'Engagement Rate', category: 'skill', relevance_score: 90, found_in_resume: false },
    { keyword: 'Campaign Management', category: 'skill', relevance_score: 85, found_in_resume: false },
    { keyword: 'Social Media Platforms', category: 'skill', relevance_score: 85, found_in_resume: false },
    { keyword: 'Hootsuite', category: 'tool', relevance_score: 80, found_in_resume: false },
    { keyword: 'grew', category: 'action-verb', relevance_score: 70, found_in_resume: false },
    { keyword: 'managed', category: 'action-verb', relevance_score: 70, found_in_resume: false },
  ],
  'seo-specialist': [
    { keyword: 'Keyword Research', category: 'skill', relevance_score: 95, found_in_resume: false },
    { keyword: 'On-page SEO', category: 'skill', relevance_score: 95, found_in_resume: false },
    { keyword: 'Google Analytics', category: 'tool', relevance_score: 90, found_in_resume: false },
    { keyword: 'Technical SEO', category: 'skill', relevance_score: 85, found_in_resume: false },
    { keyword: 'Link Building', category: 'skill', relevance_score: 85, found_in_resume: false },
    { keyword: 'Search Console', category: 'tool', relevance_score: 80, found_in_resume: false },
    { keyword: 'ranked', category: 'action-verb', relevance_score: 70, found_in_resume: false },
    { keyword: 'optimized', category: 'action-verb', relevance_score: 70, found_in_resume: false },
  ],
  'graphic-designer': [
    { keyword: 'Adobe Photoshop', category: 'tool', relevance_score: 95, found_in_resume: false },
    { keyword: 'Illustrator', category: 'tool', relevance_score: 95, found_in_resume: false },
    { keyword: 'Branding', category: 'skill', relevance_score: 90, found_in_resume: false },
    { keyword: 'Visual Design', category: 'skill', relevance_score: 90, found_in_resume: false },
    { keyword: 'Typography', category: 'skill', relevance_score: 85, found_in_resume: false },
    { keyword: 'Figma', category: 'tool', relevance_score: 85, found_in_resume: false },
    { keyword: 'designed', category: 'action-verb', relevance_score: 70, found_in_resume: false },
    { keyword: 'created', category: 'action-verb', relevance_score: 70, found_in_resume: false },
  ],
  'video-editor': [
    { keyword: 'Premiere Pro', category: 'tool', relevance_score: 95, found_in_resume: false },
    { keyword: 'After Effects', category: 'tool', relevance_score: 95, found_in_resume: false },
    { keyword: 'Video Editing', category: 'skill', relevance_score: 95, found_in_resume: false },
    { keyword: 'Motion Graphics', category: 'skill', relevance_score: 85, found_in_resume: false },
    { keyword: 'Color Grading', category: 'skill', relevance_score: 80, found_in_resume: false },
    { keyword: 'Final Cut Pro', category: 'tool', relevance_score: 80, found_in_resume: false },
    { keyword: 'edited', category: 'action-verb', relevance_score: 70, found_in_resume: false },
    { keyword: 'produced', category: 'action-verb', relevance_score: 70, found_in_resume: false },
  ],
  'designer': [
    { keyword: 'Figma', category: 'tool', relevance_score: 95, found_in_resume: false },
    { keyword: 'UI/UX', category: 'skill', relevance_score: 95, found_in_resume: false },
    { keyword: 'User Research', category: 'skill', relevance_score: 90, found_in_resume: false },
    { keyword: 'Wireframing', category: 'skill', relevance_score: 85, found_in_resume: false },
    { keyword: 'Prototyping', category: 'skill', relevance_score: 85, found_in_resume: false },
    { keyword: 'Design Systems', category: 'skill', relevance_score: 80, found_in_resume: false },
    { keyword: 'Adobe Creative Suite', category: 'tool', relevance_score: 80, found_in_resume: false },
    { keyword: 'designed', category: 'action-verb', relevance_score: 70, found_in_resume: false },
    { keyword: 'created', category: 'action-verb', relevance_score: 70, found_in_resume: false },
  ],
  'healthcare-admin': [
    { keyword: 'Healthcare Operations', category: 'skill', relevance_score: 95, found_in_resume: false },
    { keyword: 'Compliance', category: 'skill', relevance_score: 95, found_in_resume: false },
    { keyword: 'Patient Management', category: 'skill', relevance_score: 90, found_in_resume: false },
    { keyword: 'HIPAA', category: 'skill', relevance_score: 90, found_in_resume: false },
    { keyword: 'EHR Systems', category: 'tool', relevance_score: 85, found_in_resume: false },
    { keyword: 'Medical Billing', category: 'skill', relevance_score: 80, found_in_resume: false },
    { keyword: 'administered', category: 'action-verb', relevance_score: 70, found_in_resume: false },
    { keyword: 'coordinated', category: 'action-verb', relevance_score: 70, found_in_resume: false },
  ],
  'clinical-research': [
    { keyword: 'Clinical Trials', category: 'skill', relevance_score: 95, found_in_resume: false },
    { keyword: 'GCP', category: 'skill', relevance_score: 95, found_in_resume: false },
    { keyword: 'Regulatory Compliance', category: 'skill', relevance_score: 90, found_in_resume: false },
    { keyword: 'Protocol Development', category: 'skill', relevance_score: 85, found_in_resume: false },
    { keyword: 'FDA', category: 'skill', relevance_score: 85, found_in_resume: false },
    { keyword: 'IRB', category: 'skill', relevance_score: 80, found_in_resume: false },
    { keyword: 'monitored', category: 'action-verb', relevance_score: 70, found_in_resume: false },
    { keyword: 'documented', category: 'action-verb', relevance_score: 70, found_in_resume: false },
  ],
  'hr-manager': [
    { keyword: 'Recruitment', category: 'skill', relevance_score: 95, found_in_resume: false },
    { keyword: 'Employee Relations', category: 'skill', relevance_score: 95, found_in_resume: false },
    { keyword: 'HR Compliance', category: 'skill', relevance_score: 90, found_in_resume: false },
    { keyword: 'Talent Management', category: 'skill', relevance_score: 90, found_in_resume: false },
    { keyword: 'Performance Management', category: 'skill', relevance_score: 85, found_in_resume: false },
    { keyword: 'HRIS', category: 'tool', relevance_score: 80, found_in_resume: false },
    { keyword: 'hired', category: 'action-verb', relevance_score: 70, found_in_resume: false },
    { keyword: 'developed', category: 'action-verb', relevance_score: 70, found_in_resume: false },
  ],
  'legal-assistant': [
    { keyword: 'Legal Research', category: 'skill', relevance_score: 95, found_in_resume: false },
    { keyword: 'Case Management', category: 'skill', relevance_score: 95, found_in_resume: false },
    { keyword: 'Document Preparation', category: 'skill', relevance_score: 90, found_in_resume: false },
    { keyword: 'Legal Documentation', category: 'skill', relevance_score: 85, found_in_resume: false },
    { keyword: 'Court Filings', category: 'skill', relevance_score: 85, found_in_resume: false },
    { keyword: 'Westlaw', category: 'tool', relevance_score: 80, found_in_resume: false },
    { keyword: 'researched', category: 'action-verb', relevance_score: 70, found_in_resume: false },
    { keyword: 'prepared', category: 'action-verb', relevance_score: 70, found_in_resume: false },
  ],
  'admin-assistant': [
    { keyword: 'Office Administration', category: 'skill', relevance_score: 95, found_in_resume: false },
    { keyword: 'Scheduling', category: 'skill', relevance_score: 90, found_in_resume: false },
    { keyword: 'Documentation', category: 'skill', relevance_score: 90, found_in_resume: false },
    { keyword: 'Microsoft Office', category: 'tool', relevance_score: 90, found_in_resume: false },
    { keyword: 'Calendar Management', category: 'skill', relevance_score: 85, found_in_resume: false },
    { keyword: 'Data Entry', category: 'skill', relevance_score: 80, found_in_resume: false },
    { keyword: 'organized', category: 'action-verb', relevance_score: 70, found_in_resume: false },
    { keyword: 'coordinated', category: 'action-verb', relevance_score: 70, found_in_resume: false },
  ],
  'ai-prompt-engineer': [
    { keyword: 'Prompt Engineering', category: 'skill', relevance_score: 95, found_in_resume: false },
    { keyword: 'LLMs', category: 'skill', relevance_score: 95, found_in_resume: false },
    { keyword: 'Optimization', category: 'skill', relevance_score: 90, found_in_resume: false },
    { keyword: 'GPT', category: 'tool', relevance_score: 90, found_in_resume: false },
    { keyword: 'AI Integration', category: 'skill', relevance_score: 85, found_in_resume: false },
    { keyword: 'NLP', category: 'skill', relevance_score: 85, found_in_resume: false },
    { keyword: 'Fine-tuning', category: 'skill', relevance_score: 80, found_in_resume: false },
    { keyword: 'engineered', category: 'action-verb', relevance_score: 70, found_in_resume: false },
    { keyword: 'optimized', category: 'action-verb', relevance_score: 70, found_in_resume: false },
  ],
  'automation-specialist': [
    { keyword: 'Zapier', category: 'tool', relevance_score: 95, found_in_resume: false },
    { keyword: 'Make', category: 'tool', relevance_score: 90, found_in_resume: false },
    { keyword: 'Automation', category: 'skill', relevance_score: 95, found_in_resume: false },
    { keyword: 'APIs', category: 'skill', relevance_score: 90, found_in_resume: false },
    { keyword: 'Workflow Automation', category: 'skill', relevance_score: 90, found_in_resume: false },
    { keyword: 'No-Code', category: 'skill', relevance_score: 85, found_in_resume: false },
    { keyword: 'Integration', category: 'skill', relevance_score: 85, found_in_resume: false },
    { keyword: 'automated', category: 'action-verb', relevance_score: 70, found_in_resume: false },
    { keyword: 'integrated', category: 'action-verb', relevance_score: 70, found_in_resume: false },
  ],
  'technical-writer': [
    { keyword: 'Technical Documentation', category: 'skill', relevance_score: 95, found_in_resume: false },
    { keyword: 'APIs', category: 'skill', relevance_score: 90, found_in_resume: false },
    { keyword: 'Manuals', category: 'skill', relevance_score: 90, found_in_resume: false },
    { keyword: 'Documentation Tools', category: 'tool', relevance_score: 85, found_in_resume: false },
    { keyword: 'Markdown', category: 'skill', relevance_score: 85, found_in_resume: false },
    { keyword: 'User Guides', category: 'skill', relevance_score: 80, found_in_resume: false },
    { keyword: 'documented', category: 'action-verb', relevance_score: 70, found_in_resume: false },
    { keyword: 'wrote', category: 'action-verb', relevance_score: 70, found_in_resume: false },
  ],
  'fresher': [
    { keyword: 'internship', category: 'skill', relevance_score: 85, found_in_resume: false },
    { keyword: 'project', category: 'skill', relevance_score: 90, found_in_resume: false },
    { keyword: 'coursework', category: 'skill', relevance_score: 80, found_in_resume: false },
    { keyword: 'GPA', category: 'skill', relevance_score: 75, found_in_resume: false },
    { keyword: 'teamwork', category: 'skill', relevance_score: 80, found_in_resume: false },
    { keyword: 'communication', category: 'skill', relevance_score: 80, found_in_resume: false },
    { keyword: 'learned', category: 'action-verb', relevance_score: 70, found_in_resume: false },
    { keyword: 'collaborated', category: 'action-verb', relevance_score: 70, found_in_resume: false },
  ],
  'freelancer': [
    { keyword: 'client', category: 'skill', relevance_score: 90, found_in_resume: false },
    { keyword: 'project management', category: 'skill', relevance_score: 85, found_in_resume: false },
    { keyword: 'deadline', category: 'skill', relevance_score: 80, found_in_resume: false },
    { keyword: 'remote', category: 'skill', relevance_score: 75, found_in_resume: false },
    { keyword: 'portfolio', category: 'skill', relevance_score: 80, found_in_resume: false },
    { keyword: 'delivered', category: 'action-verb', relevance_score: 70, found_in_resume: false },
    { keyword: 'managed', category: 'action-verb', relevance_score: 70, found_in_resume: false },
  ],
  'executive': [
    { keyword: 'leadership', category: 'skill', relevance_score: 95, found_in_resume: false },
    { keyword: 'strategic planning', category: 'skill', relevance_score: 95, found_in_resume: false },
    { keyword: 'P&L', category: 'skill', relevance_score: 90, found_in_resume: false },
    { keyword: 'revenue growth', category: 'skill', relevance_score: 90, found_in_resume: false },
    { keyword: 'stakeholder management', category: 'skill', relevance_score: 85, found_in_resume: false },
    { keyword: 'budget', category: 'skill', relevance_score: 85, found_in_resume: false },
    { keyword: 'team building', category: 'skill', relevance_score: 85, found_in_resume: false },
    { keyword: 'transformation', category: 'skill', relevance_score: 80, found_in_resume: false },
    { keyword: 'M&A', category: 'skill', relevance_score: 80, found_in_resume: false },
    { keyword: 'board', category: 'skill', relevance_score: 75, found_in_resume: false },
    { keyword: 'spearheaded', category: 'action-verb', relevance_score: 70, found_in_resume: false },
    { keyword: 'orchestrated', category: 'action-verb', relevance_score: 70, found_in_resume: false },
    { keyword: 'championed', category: 'action-verb', relevance_score: 70, found_in_resume: false },
  ],
  'other': [
    { keyword: 'communication', category: 'skill', relevance_score: 80, found_in_resume: false },
    { keyword: 'leadership', category: 'skill', relevance_score: 80, found_in_resume: false },
    { keyword: 'problem-solving', category: 'skill', relevance_score: 80, found_in_resume: false },
    { keyword: 'teamwork', category: 'skill', relevance_score: 80, found_in_resume: false },
    { keyword: 'achieved', category: 'action-verb', relevance_score: 70, found_in_resume: false },
    { keyword: 'improved', category: 'action-verb', relevance_score: 70, found_in_resume: false },
  ],
};

// ============================================
// ATS SCORING FUNCTIONS
// ============================================

/**
 * Extracts all text content from a CV for analysis
 */
function extractCVText(cv: CV): string {
  const parts: string[] = [];

  // Personal info
  parts.push(cv.personal_info.full_name || '');
  parts.push(cv.personal_info.summary || '');

  // Experience
  cv.experience.forEach(exp => {
    parts.push(exp.title);
    parts.push(exp.company);
    parts.push(exp.description);
    if (exp.achievements) parts.push(...exp.achievements);
    if (exp.keywords) parts.push(...exp.keywords);
  });

  // Education
  cv.education.forEach(edu => {
    parts.push(edu.degree);
    parts.push(edu.institution);
    parts.push(edu.field_of_study || '');
    parts.push(edu.description);
  });

  // Skills
  cv.skills.forEach(skill => {
    parts.push(skill.name);
    parts.push(skill.category);
  });

  // Certifications
  cv.certifications.forEach(cert => {
    parts.push(cert.name);
    parts.push(cert.issuer);
  });

  // Projects
  if (cv.projects) {
    cv.projects.forEach(project => {
      parts.push(project.name);
      parts.push(project.description);
      parts.push(...project.technologies);
    });
  }

  return parts.join(' ').toLowerCase();
}

/**
 * Checks if a keyword exists in the CV text
 */
function findKeyword(text: string, keyword: string): boolean {
  const normalizedKeyword = keyword.toLowerCase();
  const normalizedText = text.toLowerCase();
  
  // Check for exact word match
  const regex = new RegExp(`\\b${normalizedKeyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i');
  return regex.test(normalizedText);
}

/**
 * Calculates the keyword match score
 */
function calculateKeywordScore(cv: CV, role: CVTargetRole): { score: number; keywords: ATSKeyword[] } {
  const cvText = extractCVText(cv);
  const roleKeywords = ROLE_KEYWORDS[role] || ROLE_KEYWORDS['other'];
  
  const analyzedKeywords: ATSKeyword[] = roleKeywords.map(kw => ({
    ...kw,
    found_in_resume: findKeyword(cvText, kw.keyword),
  }));

  const foundKeywords = analyzedKeywords.filter(kw => kw.found_in_resume);
  const totalWeight = roleKeywords.reduce((sum, kw) => sum + kw.relevance_score, 0);
  const foundWeight = foundKeywords.reduce((sum, kw) => sum + kw.relevance_score, 0);
  
  const score = Math.round((foundWeight / totalWeight) * 100);

  return { score, keywords: analyzedKeywords };
}

/**
 * Calculates content completeness score
 */
function calculateContentScore(cv: CV): number {
  let score = 0;
  const maxScore = 100;

  // Personal info completeness (25 points)
  if (cv.personal_info.full_name) score += 5;
  if (cv.personal_info.email) score += 5;
  if (cv.personal_info.phone) score += 5;
  if (cv.personal_info.summary && cv.personal_info.summary.length > 50) score += 10;

  // Experience section (30 points)
  if (cv.experience.length > 0) {
    score += 10;
    const hasDetailedExp = cv.experience.some(exp => 
      exp.description.length > 100 || (exp.achievements && exp.achievements.length > 0)
    );
    if (hasDetailedExp) score += 10;
    if (cv.experience.length >= 2) score += 10;
  }

  // Education section (15 points)
  if (cv.education.length > 0) {
    score += 10;
    if (cv.education.some(edu => edu.degree && edu.institution)) score += 5;
  }

  // Skills section (20 points)
  if (cv.skills.length > 0) {
    score += 10;
    if (cv.skills.length >= 5) score += 5;
    if (cv.skills.length >= 10) score += 5;
  }

  // Certifications bonus (5 points)
  if (cv.certifications && cv.certifications.length > 0) score += 5;

  // Projects bonus (5 points)
  if (cv.projects && cv.projects.length > 0) score += 5;

  return Math.min(score, maxScore);
}

/**
 * Calculates format/structure score
 */
function calculateFormatScore(cv: CV): number {
  let score = 100;

  // Penalize if summary is too long (over 300 chars)
  if (cv.personal_info.summary && cv.personal_info.summary.length > 300) {
    score -= 10;
  }

  // Penalize if no bullet points in experience descriptions
  const hasGoodDescriptions = cv.experience.every(exp => 
    exp.achievements?.length || exp.description.includes('\n') || exp.description.length > 50
  );
  if (!hasGoodDescriptions && cv.experience.length > 0) {
    score -= 15;
  }

  // Penalize missing contact info
  if (!cv.personal_info.email) score -= 10;
  if (!cv.personal_info.phone) score -= 5;

  return Math.max(0, score);
}

/**
 * Generates actionable suggestions
 */
function generateSuggestions(cv: CV, keywords: ATSKeyword[]): ATSSuggestion[] {
  const suggestions: ATSSuggestion[] = [];

  // Missing high-relevance keywords
  const missingCritical = keywords.filter(kw => !kw.found_in_resume && kw.relevance_score >= 85);
  if (missingCritical.length > 0) {
    suggestions.push({
      type: 'critical',
      section: 'Skills/Experience',
      message: `Add missing high-impact keywords: ${missingCritical.slice(0, 5).map(k => k.keyword).join(', ')}`,
      action: 'Include these keywords naturally in your experience descriptions or skills section.',
    });
  }

  // Check summary length
  if (!cv.personal_info.summary || cv.personal_info.summary.length < 50) {
    suggestions.push({
      type: 'important',
      section: 'Summary',
      message: 'Add a compelling professional summary (2-4 sentences)',
      action: 'Write a summary that highlights your key skills and career goals.',
    });
  }

  // Check for quantifiable achievements
  const hasMetrics = cv.experience.some(exp => 
    /\d+%|\d+ years|\$\d+|increased|reduced|improved by/i.test(exp.description)
  );
  if (!hasMetrics && cv.experience.length > 0) {
    suggestions.push({
      type: 'important',
      section: 'Experience',
      message: 'Add quantifiable achievements with metrics',
      action: 'Include numbers, percentages, or dollar amounts to demonstrate impact (e.g., "Increased efficiency by 30%").',
    });
  }

  // Check skill count
  if (cv.skills.length < 5) {
    suggestions.push({
      type: 'important',
      section: 'Skills',
      message: 'Add more relevant skills (aim for 8-12)',
      action: 'List technical skills, tools, and soft skills relevant to your target role.',
    });
  }

  // Check for action verbs
  const hasActionVerbs = cv.experience.some(exp =>
    /^(developed|implemented|created|designed|managed|led|achieved|built|optimized|collaborated)/i.test(exp.description)
  );
  if (!hasActionVerbs && cv.experience.length > 0) {
    suggestions.push({
      type: 'nice-to-have',
      section: 'Experience',
      message: 'Start bullet points with strong action verbs',
      action: 'Use verbs like "Developed", "Implemented", "Led", "Achieved" at the start of descriptions.',
    });
  }

  return suggestions;
}

/**
 * Identifies strong points in the resume
 */
function identifyStrongPoints(cv: CV, keywordScore: number): string[] {
  const strengths: string[] = [];

  if (keywordScore >= 70) {
    strengths.push('Good keyword alignment with target role');
  }

  if (cv.experience.length >= 3) {
    strengths.push('Solid work experience history');
  }

  if (cv.certifications && cv.certifications.length >= 2) {
    strengths.push('Professional certifications demonstrate commitment');
  }

  if (cv.projects && cv.projects.length >= 2) {
    strengths.push('Project portfolio shows practical experience');
  }

  if (cv.personal_info.summary && cv.personal_info.summary.length >= 100) {
    strengths.push('Well-written professional summary');
  }

  if (cv.skills.length >= 10) {
    strengths.push('Comprehensive skills section');
  }

  return strengths;
}

// ============================================
// MAIN ANALYSIS FUNCTION
// ============================================

/**
 * Performs complete ATS analysis on a CV
 */
export function analyzeCV(cv: CV): ATSAnalysis {
  const targetRole = cv.target_role || 'other';
  
  const { score: keywordScore, keywords } = calculateKeywordScore(cv, targetRole);
  const contentScore = calculateContentScore(cv);
  const formatScore = calculateFormatScore(cv);

  // Calculate overall score (weighted average)
  const overallScore = Math.round(
    (keywordScore * 0.4) + (contentScore * 0.35) + (formatScore * 0.25)
  );

  const missingKeywords = keywords.filter(kw => !kw.found_in_resume && kw.relevance_score >= 70);
  const suggestions = generateSuggestions(cv, keywords);
  const strongPoints = identifyStrongPoints(cv, keywordScore);

  return {
    overall_score: overallScore,
    keyword_match_score: keywordScore,
    format_score: formatScore,
    content_score: contentScore,
    suggestions,
    missing_keywords: missingKeywords,
    strong_points: strongPoints,
  };
}

/**
 * Gets a letter grade for the ATS score
 */
export function getATSGrade(score: number): { grade: string; color: string } {
  if (score >= 90) return { grade: 'A+', color: 'text-green-600' };
  if (score >= 80) return { grade: 'A', color: 'text-green-500' };
  if (score >= 70) return { grade: 'B', color: 'text-blue-500' };
  if (score >= 60) return { grade: 'C', color: 'text-yellow-500' };
  if (score >= 50) return { grade: 'D', color: 'text-orange-500' };
  return { grade: 'F', color: 'text-red-500' };
}

/**
 * Gets quick tips based on score
 */
export function getQuickTips(score: number): string[] {
  if (score >= 90) {
    return ['Your resume is ATS-optimized!', 'Consider tailoring it for specific job postings.'];
  }
  if (score >= 70) {
    return ['Good foundation!', 'Add more industry keywords.', 'Quantify your achievements.'];
  }
  if (score >= 50) {
    return ['Room for improvement.', 'Add missing skills.', 'Expand your experience descriptions.'];
  }
  return ['Major improvements needed.', 'Add a professional summary.', 'List relevant skills.', 'Detail your experience.'];
}
