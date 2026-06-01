import React, { useState, useRef, useCallback, useEffect } from 'react';
import {
  FileText, Upload, ChevronDown, ChevronUp, Plus, Trash2, X,
  Download, Loader2, Sparkles, Briefcase, GraduationCap,
  Code, Award, Languages, User, CheckCircle, AlertCircle,
  Eye, Wand2, ClipboardPaste, ArrowUp, ArrowDown, ArrowLeft, ListOrdered,
  Star, Globe, BookOpen, Link, AlertTriangle
} from 'lucide-react';
import api from '../lib/api';
import aiApi from '../lib/ai-api';
import { generateATSResumeLaTeX, generateATSCVLaTeX, downloadATSResumeLaTeX, downloadATSCVLaTeX, getRecommendedTemplate, getDefaultSectionOrder, type ResumeSection } from '../lib/latex-generator';
import type { ResumeSectionKey } from '../lib/resume-engine';
import type { CV, CVTargetRole, PersonalInfo, Education, Experience, Skill, Language, Certification, Project, CustomSection } from '../lib/database.types';

// ============================================
// JOB ROLE OPTIONS  
// ============================================
const JOB_ROLE_CATEGORIES = [
  {
    label: 'Engineering & Tech',
    roles: [
      { value: 'software-engineer', label: 'Software Engineer' },
      { value: 'mobile-app-developer', label: 'Mobile App Developer' },
      { value: 'qa-engineer', label: 'QA Engineer' },
      { value: 'systems-engineer', label: 'Systems Engineer' },
    ],
  },
  {
    label: 'Data, AI & Research',
    roles: [
      { value: 'data-scientist', label: 'Data Scientist' },
      { value: 'data-analyst', label: 'Data Analyst' },
      { value: 'ai-ml-engineer', label: 'AI/ML Engineer' },
      { value: 'research-analyst', label: 'Research Analyst' },
    ],
  },
  {
    label: 'Product & Management',
    roles: [
      { value: 'product-manager', label: 'Product Manager' },
      { value: 'project-manager', label: 'Project Manager' },
      { value: 'program-manager', label: 'Program Manager' },
      { value: 'operations-manager', label: 'Operations Manager' },
    ],
  },
  {
    label: 'Business & Finance',
    roles: [
      { value: 'financial-analyst', label: 'Financial Analyst' },
      { value: 'accountant', label: 'Accountant' },
      { value: 'sales-executive', label: 'Sales Executive' },
      { value: 'business-development', label: 'Business Development' },
    ],
  },
  {
    label: 'Marketing & Content',
    roles: [
      { value: 'content-writer', label: 'Content Writer' },
      { value: 'social-media-manager', label: 'Social Media Manager' },
      { value: 'seo-specialist', label: 'SEO Specialist' },
    ],
  },
  {
    label: 'Creative',
    roles: [
      { value: 'graphic-designer', label: 'Graphic Designer' },
      { value: 'video-editor', label: 'Video Editor' },
      { value: 'designer', label: 'Designer' },
    ],
  },
  {
    label: 'Healthcare & Science',
    roles: [
      { value: 'healthcare-admin', label: 'Healthcare Admin' },
      { value: 'clinical-research', label: 'Clinical Research' },
    ],
  },
  {
    label: 'Legal, HR & Admin',
    roles: [
      { value: 'hr-manager', label: 'HR Manager' },
      { value: 'legal-assistant', label: 'Legal Assistant' },
      { value: 'admin-assistant', label: 'Admin Assistant' },
    ],
  },
  {
    label: 'Emerging & Modern',
    roles: [
      { value: 'ai-prompt-engineer', label: 'AI Prompt Engineer' },
      { value: 'automation-specialist', label: 'Automation Specialist' },
      { value: 'technical-writer', label: 'Technical Writer' },
    ],
  },
  {
    label: 'General',
    roles: [
      { value: 'fresher', label: 'Fresher / Recent Graduate' },
      { value: 'freelancer', label: 'Freelancer' },
      { value: 'executive', label: 'Executive' },
    ],
  },
];

// ============================================
// EMPTY DATA HELPERS
// ============================================
const emptyPersonalInfo: PersonalInfo = {
  full_name: '',
  email: '',
  phone: '',
  address: '',
  summary: '',
  linkedin_url: '',
  github_url: '',
  portfolio_url: '',
};

const emptyExperience: Experience = {
  title: '',
  company: '',
  location: '',
  start_date: '',
  end_date: '',
  current: false,
  description: '',
  achievements: [],
};

const emptyEducation: Education = {
  degree: '',
  field_of_study: '',
  institution: '',
  location: '',
  start_date: '',
  end_date: '',
  gpa: '',
  description: '',
};



const emptyProject: Project = {
  name: '',
  description: '',
  technologies: [],
  url: '',
  highlights: [],
};

const emptyCertification: Certification = {
  name: '',
  issuer: '',
  date: '',
  url: '',
};

const emptyLanguage: Language = {
  name: '',
  proficiency: 'professional',
};

const emptyCustomSection: CustomSection = {
  title: '',
  section_type: 'bullets',
  items: [],
};

// ============================================
// STEP TYPE
// ============================================
type Step = 'input-method' | 'form' | 'job-role' | 'job-description' | 'preview';
type DocumentType = 'resume' | 'cv';

// ============================================
// COLLAPSIBLE SECTION COMPONENT
// ============================================
function CollapsibleSection({
  title,
  icon: Icon,
  children,
  defaultOpen = false,
  badge,
}: {
  title: string;
  icon: React.ElementType;
  children: React.ReactNode;
  defaultOpen?: boolean;
  badge?: string;
}) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden bg-white">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-5 py-4 hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-indigo-50">
            <Icon className="h-4 w-4 text-indigo-600" />
          </div>
          <span className="font-semibold text-gray-800">{title}</span>
          {badge && (
            <span className="px-2 py-0.5 text-xs font-medium bg-indigo-100 text-indigo-700 rounded-full">
              {badge}
            </span>
          )}
        </div>
        {isOpen ? (
          <ChevronUp className="h-5 w-5 text-gray-400" />
        ) : (
          <ChevronDown className="h-5 w-5 text-gray-400" />
        )}
      </button>
      {isOpen && <div className="px-5 pb-5 space-y-4">{children}</div>}
    </div>
  );
}

// ============================================
// INPUT FIELD COMPONENT
// ============================================
function FormInput({
  label,
  value,
  onChange,
  placeholder,
  type = 'text',
  required = false,
  multiline = false,
  rows = 3,
}: {
  label: string;
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  type?: string;
  required?: boolean;
  multiline?: boolean;
  rows?: number;
}) {
  const inputClasses =
    'w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors';
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      {multiline ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          rows={rows}
          className={inputClasses}
        />
      ) : (
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={inputClasses}
        />
      )}
    </div>
  );
}

// ============================================
// MAIN COMPONENT
// ============================================
export default function ATSResumeBuilder() {
  // Steps
  const [currentStep, setCurrentStep] = useState<Step>('input-method');
  const [inputMethod, setInputMethod] = useState<'manual' | 'upload' | null>(null);
  const [documentType, setDocumentType] = useState<DocumentType>('resume');

  // Form data
  const [personalInfo, setPersonalInfo] = useState<PersonalInfo>({ ...emptyPersonalInfo });
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [educations, setEducations] = useState<Education[]>([]);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [certifications, setCertifications] = useState<Certification[]>([]);
  const [certPortfolioUrl, setCertPortfolioUrl] = useState('');
  const [languages, setLanguages] = useState<Language[]>([]);
  const [customSections, setCustomSections] = useState<CustomSection[]>([]);
  const [includeReferences, setIncludeReferences] = useState(true);

  // Job role
  const [selectedRole, setSelectedRole] = useState<string>('');
  const [customRole, setCustomRole] = useState('');
  const [isCustomRole, setIsCustomRole] = useState(false);

  // Job description customization
  const [useJobDescription, setUseJobDescription] = useState(false);
  const [jobDescription, setJobDescription] = useState('');

  // Preview & export
  const [generatedCV, setGeneratedCV] = useState<CV | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isTailoring, setIsTailoring] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [tailorResult, setTailorResult] = useState<{
    match_score: number;
    job_analysis: {
      required_skills: string[];
      ats_keywords: string[];
      key_responsibilities: string[];
    };
    optimizations_made: string[];
  } | null>(null);

  // Upload
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Section ordering
  const [sectionOrder, setSectionOrder] = useState<ResumeSection[]>(['summary', 'skills', 'experience', 'projects', 'education', 'certifications', 'languages']);

  // ============================================
  // ============================================
  // DOCUMENT TYPE SWITCH (Non-Destructive)
  // ============================================
  const handleDocumentTypeChange = (newType: DocumentType) => {
    setDocumentType(newType);
  };

  // ============================================
  // AUTOSAVE & SANDBOX STATE ENGINES
  // ============================================
  const [activePreviewTab, setActivePreviewTab] = useState<string>('personal');
  const [saveStatus, setSaveStatus] = useState<'saved' | 'saving' | 'idle'>('idle');
  const [hasDraft, setHasDraft] = useState(false);
  const [previewOutdated, setPreviewOutdated] = useState(false);

  // Check if draft exists and restore automatically on mount
  useEffect(() => {
    const savedDraft = localStorage.getItem('ats_resume_draft');
    if (savedDraft) {
      setHasDraft(true);
      try {
        const d = JSON.parse(savedDraft);
        if (d.personalInfo) setPersonalInfo(d.personalInfo);
        if (d.experiences) setExperiences(d.experiences);
        if (d.educations) setEducations(d.educations);
        if (d.skills) setSkills(d.skills);
        if (d.projects) setProjects(d.projects);
        if (d.certifications) setCertifications(d.certifications);
        if (d.languages) setLanguages(d.languages);
        if (d.customSections) setCustomSections(d.customSections);
        if (d.selectedRole) setSelectedRole(d.selectedRole);
        if (d.customRole) setCustomRole(d.customRole);
        setIsCustomRole(!!d.isCustomRole);
        if (d.documentType) setDocumentType(d.documentType);
        
        setSaveStatus('saved');

        // Restore active step if saved
        const savedStep = localStorage.getItem('ats_resume_step');
        if (savedStep && savedStep !== 'input-method') {
          setCurrentStep(savedStep as Step);
        } else {
          setCurrentStep('form');
        }
      } catch (err) {
        console.error('Error loading draft on mount:', err);
      }
    }
  }, []);

  // Save active step when it changes
  useEffect(() => {
    if (currentStep) {
      localStorage.setItem('ats_resume_step', currentStep);
    }
  }, [currentStep]);

  // Set preview outdated when fields are modified in Preview step
  useEffect(() => {
    if (currentStep === 'preview') {
      setPreviewOutdated(true);
    }
  }, [personalInfo, experiences, educations, skills, projects, certifications, languages, customSections, sectionOrder, documentType]);

  // Autosave trigger
  useEffect(() => {
    if (currentStep === 'input-method') return; // Don't autosave when choosing input
    setSaveStatus('saving');
    
    const timer = setTimeout(() => {
      const draftData = {
        personalInfo,
        experiences,
        educations,
        skills,
        projects,
        certifications,
        languages,
        customSections,
        selectedRole,
        customRole,
        isCustomRole,
        documentType,
      };
      localStorage.setItem('ats_resume_draft', JSON.stringify(draftData));
      setSaveStatus('saved');
    }, 1000); // 1-second debounce

    return () => clearTimeout(timer);
  }, [personalInfo, experiences, educations, skills, projects, certifications, languages, customSections, selectedRole, customRole, isCustomRole, documentType]);

  const handleRestoreDraft = () => {
    setCurrentStep('form');
  };

  const handleClearDraft = () => {
    localStorage.removeItem('ats_resume_draft');
    localStorage.removeItem('ats_resume_step');
    setPersonalInfo({ ...emptyPersonalInfo });
    setExperiences([]);
    setEducations([]);
    setSkills([]);
    setProjects([]);
    setCertifications([]);
    setLanguages([]);
    setCustomSections([]);
    setSelectedRole('');
    setCustomRole('');
    setIsCustomRole(false);
    setHasDraft(false);
    setCurrentStep('input-method');
  };

  // LaTeX & PDF preview
  const [latexSource, setLatexSource] = useState<string>('');
  const [compiledPdfUrl, setCompiledPdfUrl] = useState<string | null>(null);
  const [isCompiling, setIsCompiling] = useState(false);
  const [compilationError, setCompilationError] = useState<string | null>(null);
  const [latexAvailable, setLatexAvailable] = useState<boolean | null>(null);

  // Preview ref
  const previewRef = useRef<HTMLDivElement>(null);

  // Check LaTeX availability on mount
  useEffect(() => {
    api.checkLatexStatus().then(status => {
      setLatexAvailable(status.available);
    }).catch(() => {
      setLatexAvailable(false);
    });
  }, []);

  // ============================================
  // UPLOAD HANDLING
  // ============================================
  const handleFileUpload = async (file: File) => {
    setUploadError(null);
    setUploadSuccess(false);

    const validExtensions = ['.pdf', '.doc', '.docx'];
    const hasValidExtension = validExtensions.some((ext) =>
      file.name.toLowerCase().endsWith(ext)
    );
    if (!hasValidExtension) {
      setUploadError('Please upload a PDF, DOC, or DOCX file');
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setUploadError('File size exceeds 10MB limit');
      return;
    }

    try {
      setIsUploading(true);
      const result = await api.parseDocument(file);

      if (result.success && result.data) {
        // Populate form with extracted data
        const d = result.data;
        setPersonalInfo({
          full_name: d.personal_info.full_name || '',
          email: d.personal_info.email || '',
          phone: d.personal_info.phone || '',
          address: d.personal_info.address || '',
          summary: d.personal_info.summary || '',
          linkedin_url: d.personal_info.linkedin_url || '',
          github_url: d.personal_info.github_url || '',
          portfolio_url: d.personal_info.portfolio_url || '',
        });

        if (d.experience?.length) {
          setExperiences(
            d.experience.map((e) => ({
              title: e.title || '',
              company: e.company || '',
              location: e.location || '',
              start_date: e.start_date || '',
              end_date: e.end_date || '',
              current: e.current || false,
              description: e.description || '',
              achievements: e.achievements || [],
            }))
          );
        }

        if (d.education?.length) {
          setEducations(
            d.education.map((e) => ({
              degree: e.degree || '',
              field_of_study: e.field_of_study || '',
              institution: e.institution || '',
              location: e.location || '',
              start_date: e.start_date || '',
              end_date: e.end_date || '',
              gpa: e.gpa || '',
              description: e.description || '',
            }))
          );
        }

        if (d.skills?.length) {
          // Backend returns grouped {category, items} — assign directly
          const parsedSkills = (d.skills as { category?: string; items?: string[]; name?: string }[]);
          const grouped: Skill[] = parsedSkills
            .filter(s => s.category && s.items?.length)
            .map(s => ({ category: s.category!, items: s.items! }));
          // Fallback: if flat {name} format slipped through, group under 'Technical'
          const flatFallback = parsedSkills
            .filter(s => s.name && !s.items)
            .map(s => s.name as string);
          if (flatFallback.length > 0) {
            grouped.push({ category: 'Technical', items: flatFallback });
          }
          if (grouped.length > 0) setSkills(grouped);
        }

        if (d.projects?.length) {
          setProjects(
            d.projects.map((p) => ({
              name: p.name || '',
              description: p.description || '',
              technologies: p.technologies || [],
              url: p.url || '',
              github_url: p.github_url || '',
              highlights: p.highlights || [],
            }))
          );
        }

        if (d.certifications?.length) {
          setCertifications(
            d.certifications.map((c) => ({
              name: c.name || '',
              issuer: c.issuer || '',
              date: c.date || '',
              url: c.url || '',
            }))
          );
        }

        if (d.languages?.length) {
          setLanguages(
            d.languages.map((l) => ({
              name: l.name || '',
              proficiency: (['basic', 'conversational', 'professional', 'native', 'intermediate', 'fluent'].includes(l.proficiency)
                ? (l.proficiency === 'intermediate' || l.proficiency === 'fluent' ? 'conversational' : l.proficiency)
                : 'professional') as Language['proficiency'],
            }))
          );
        }

        setUploadSuccess(true);
        // Move to form step so user can review
        setTimeout(() => {
          setCurrentStep('form');
        }, 1000);
      } else {
        throw new Error('Failed to parse document');
      }
    } catch (err) {
      console.error('Error parsing document:', err);
      setUploadError(
        err instanceof Error ? err.message : 'Failed to parse document'
      );
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    if (files.length > 0) handleFileUpload(files[0]);
  };

  // ============================================
  // GENERATE ATS RESUME
  // ============================================
  const buildCV = useCallback((): CV => {
    const role = isCustomRole ? (customRole || 'other') : selectedRole;
    const templateId = getRecommendedTemplate(role as CVTargetRole) || 'professional';

    return {
      id: 'ats-local-' + Date.now(),
      user_id: 'local',
      template: templateId,
      target_role: (role || 'other') as CVTargetRole,
      personal_info: personalInfo,
      education: educations,
      experience: experiences,
      skills: skills.filter(g => g.category && g.items?.length > 0),
      languages: languages,
      certifications: certifications,
      projects: projects,
      custom_sections: customSections,
      accent_color: '#4F46E5',
      is_grayscale: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
  }, [personalInfo, experiences, educations, skills, projects, certifications, languages, customSections, selectedRole, customRole, isCustomRole]);

  const handleGenerate = async () => {
    setIsGenerating(true);
    setCompilationError(null);
    try {
      const cv = buildCV();
      setGeneratedCV(cv);

      // Generate ATS-optimized LaTeX (resume = 1-page engine, cv = full multi-page)
      const resumeSections = sectionOrder.filter(s =>
        ['summary', 'skills', 'experience', 'projects', 'education'].includes(s)
      ) as ResumeSectionKey[];
      const latex = documentType === 'cv'
        ? generateATSCVLaTeX(cv, { certPortfolioUrl, includeReferences })
        : generateATSResumeLaTeX(cv, resumeSections);
      setLatexSource(latex);

      // Compile LaTeX to PDF via backend
      try {
        setIsCompiling(true);
        const pdfBlob = await api.compileLaTeX(latex, cv.personal_info.full_name || 'resume');
        if (compiledPdfUrl) URL.revokeObjectURL(compiledPdfUrl);
        const url = URL.createObjectURL(pdfBlob);
        setCompiledPdfUrl(url);
        setCompilationError(null);
      } catch (compileErr) {
        console.warn('LaTeX compilation unavailable, falling back to FPDF2:', compileErr);
        // Fallback: use backend FPDF2 PDF generation
        try {
          const pdfBlob = await api.exportPDF({
            template: cv.template,
            target_role: cv.target_role,
            personal_info: cv.personal_info,
            education: cv.education,
            experience: cv.experience,
            skills: cv.skills,
            languages: cv.languages,
            certifications: cv.certifications,
            projects: cv.projects,
            accent_color: cv.accent_color,
            is_grayscale: cv.is_grayscale,
          });
          if (compiledPdfUrl) URL.revokeObjectURL(compiledPdfUrl);
          const url = URL.createObjectURL(pdfBlob);
          setCompiledPdfUrl(url);
          setCompilationError('LaTeX compiler not available. Using fallback PDF rendering. Install TeX Live for exact LaTeX output.');
        } catch {
          setCompilationError('PDF generation failed. LaTeX source is available for download.');
          setCompiledPdfUrl(null);
        }
      } finally {
        setIsCompiling(false);
      }

      setPreviewOutdated(false);
      setCurrentStep('preview');
    } catch (err) {
      console.error('Error generating resume:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleTailorToJob = async () => {
    if (!jobDescription.trim()) return;
    setIsTailoring(true);
    try {
      const cv = buildCV();
      const cvData = {
        personal_info: cv.personal_info,
        experience: cv.experience,
        education: cv.education,
        skills: cv.skills.flatMap((g) => g.items),
        projects: cv.projects || [],
        certifications: cv.certifications,
        languages: cv.languages,
        summary: cv.personal_info.summary,
        title: cv.personal_info.full_name + ' - Resume',
        target_role: cv.target_role,
      };

      const result = await aiApi.tailorResumeToJob(
        cvData as Record<string, unknown>,
        jobDescription,
        isCustomRole ? customRole : selectedRole
      );

      setTailorResult({
        match_score: result.match_score,
        job_analysis: result.job_analysis,
        optimizations_made: result.optimizations_made,
      });

      // Build tailored values directly — React setState is async, so buildCV() after setState gives stale data
      const tailored = result.tailored_cv as Record<string, unknown>;
      let newPersonalInfo = { ...personalInfo };
      let newExperiences = [...experiences];
      let newGroupedSkills: Skill[] = [...skills];

      if (tailored) {
        if (typeof tailored.summary === 'string') {
          newPersonalInfo = { ...newPersonalInfo, summary: tailored.summary };
        } else if (tailored.personal_info && typeof tailored.personal_info === 'object') {
          const tpi = tailored.personal_info as Record<string, string>;
          if (tpi.summary) newPersonalInfo = { ...newPersonalInfo, summary: tpi.summary };
        }

        if (Array.isArray(tailored.experience)) {
          newExperiences = (tailored.experience as Record<string, unknown>[]).map((e) => ({
            title: (e.title as string) || '',
            company: (e.company as string) || '',
            location: (e.location as string) || '',
            start_date: (e.start_date as string) || '',
            end_date: (e.end_date as string) || '',
            current: (e.current as boolean) || false,
            description: (e.description as string) || '',
            achievements: (e.achievements as string[]) || [],
          }));
        }

        if (Array.isArray(tailored.skills)) {
          // AI may return flat strings or grouped {category, items} — handle both
          const rawSkills = tailored.skills as (string | Record<string, unknown>)[];
          const allFlat = rawSkills.every(s => typeof s === 'string');
          if (allFlat) {
            // Merge flat string skills into existing first category or a new 'Technical' group
            const names = rawSkills.filter(s => typeof s === 'string' && (s as string).trim()) as string[];
            if (newGroupedSkills.length > 0) {
              newGroupedSkills = newGroupedSkills.map((g, i) => i === 0 ? { ...g, items: names } : g);
            } else {
              newGroupedSkills = [{ category: 'Technical', items: names }];
            }
          } else {
            // Grouped format
            const grouped = (rawSkills as Record<string, unknown>[]).filter(s => s.category && s.items).map(s => ({
              category: s.category as string,
              items: s.items as string[],
            }));
            if (grouped.length > 0) newGroupedSkills = grouped;
          }
        }

        // Sync state for future form edits
        setPersonalInfo(newPersonalInfo);
        setExperiences(newExperiences);
        setSkills(newGroupedSkills);
      }

      // Build CV directly from fresh tailored values (bypasses stale React state)
      const tRole = isCustomRole ? (customRole || 'other') : selectedRole;
      const tTemplate = getRecommendedTemplate(tRole as CVTargetRole) || 'professional';
      const tailoredCV: CV = {
        id: 'ats-local-' + Date.now(),
        user_id: 'local',
        template: tTemplate,
        target_role: (tRole || 'other') as CVTargetRole,
        personal_info: newPersonalInfo,
        education: educations,
        experience: newExperiences,
        skills: newGroupedSkills.filter(g => g.category && g.items?.length > 0),
        languages,
        certifications,
        projects,
        accent_color: '#4F46E5',
        is_grayscale: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      setGeneratedCV(tailoredCV);

      // Generate ATS-optimized LaTeX from freshly-built tailored CV
      const resumeSections = sectionOrder.filter(s =>
        ['summary', 'skills', 'experience', 'projects', 'education'].includes(s)
      ) as ResumeSectionKey[];
      const latex = documentType === 'cv'
        ? generateATSCVLaTeX(tailoredCV, { certPortfolioUrl, includeReferences })
        : generateATSResumeLaTeX(tailoredCV, resumeSections);
      setLatexSource(latex);

      // Compile LaTeX to PDF
      try {
        setIsCompiling(true);
        const pdfBlob = await api.compileLaTeX(latex, tailoredCV.personal_info.full_name || 'resume');
        if (compiledPdfUrl) URL.revokeObjectURL(compiledPdfUrl);
        setCompiledPdfUrl(URL.createObjectURL(pdfBlob));
      } catch {
        // Fallback to FPDF2
        try {
          const pdfBlob = await api.exportPDF({
            template: tailoredCV.template,
            target_role: tailoredCV.target_role,
            personal_info: tailoredCV.personal_info,
            education: tailoredCV.education,
            experience: tailoredCV.experience,
            skills: tailoredCV.skills,
            languages: tailoredCV.languages,
            certifications: tailoredCV.certifications,
            projects: tailoredCV.projects,
            accent_color: tailoredCV.accent_color,
            is_grayscale: tailoredCV.is_grayscale,
          });
          if (compiledPdfUrl) URL.revokeObjectURL(compiledPdfUrl);
          setCompiledPdfUrl(URL.createObjectURL(pdfBlob));
        } catch {
          setCompiledPdfUrl(null);
        }
      } finally {
        setIsCompiling(false);
      }

      setPreviewOutdated(false);
      setCurrentStep('preview');
    } catch (err) {
      console.error('Error tailoring resume:', err);
    } finally {
      setIsTailoring(false);
    }
  };

  // ============================================
  // EXPORT HANDLERS
  // ============================================
  const handleExportPDF = async () => {
    if (!generatedCV) return;
    setIsExporting(true);
    try {
      let blob: Blob;
      if (compiledPdfUrl) {
        // Use the already-compiled PDF (same as preview)
        const response = await fetch(compiledPdfUrl);
        blob = await response.blob();
      } else {
        // Recompile from LaTeX or fallback
        const resumeSectionsFallback = sectionOrder.filter(s =>
          ['summary', 'skills', 'experience', 'projects', 'education'].includes(s)
        ) as ResumeSectionKey[];
        const latex = latexSource || (documentType === 'cv'
          ? generateATSCVLaTeX(generatedCV, { certPortfolioUrl, includeReferences })
          : generateATSResumeLaTeX(generatedCV, resumeSectionsFallback));
        try {
          blob = await api.compileLaTeX(latex, generatedCV.personal_info.full_name || 'resume');
        } catch {
          blob = await api.exportPDF({
            template: generatedCV.template,
            target_role: generatedCV.target_role,
            personal_info: generatedCV.personal_info,
            education: generatedCV.education,
            experience: generatedCV.experience,
            skills: generatedCV.skills,
            languages: generatedCV.languages,
            certifications: generatedCV.certifications,
            projects: generatedCV.projects,
            accent_color: generatedCV.accent_color,
            is_grayscale: generatedCV.is_grayscale,
          });
        }
      }
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${generatedCV.personal_info.full_name || 'resume'}_ATS_Resume.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('PDF export failed:', err);
    } finally {
      setIsExporting(false);
    }
  };

  const handleExportDOC = () => {
    if (!generatedCV) return;
    // Generate DOC from the same section-ordered data structure as LaTeX
    const cv = generatedCV;
    const order = sectionOrder;

    const sectionRenderers: Record<string, () => string> = {
      summary: () => cv.personal_info.summary ? `<h2 style="text-transform:uppercase;border-bottom:1px solid #000;padding-bottom:3px;margin-bottom:6px;">SUMMARY</h2><p>${cv.personal_info.summary}</p>` : '',
      experience: () => {
        if (!cv.experience?.length) return '';
        return `<h2 style="text-transform:uppercase;border-bottom:1px solid #000;padding-bottom:3px;margin-bottom:6px;">EXPERIENCE</h2>` +
          cv.experience.map(e => {
            const dateRange = e.current ? `${e.start_date} - Present` : `${e.start_date} - ${e.end_date}`;
            const bullets = (e.achievements?.length ? e.achievements : (e.description ? [e.description] : [])).map(a => `<li>${a}</li>`).join('');
            return `<p style="margin-bottom:2px;"><strong>${e.company} - ${e.title}</strong> <span style="float:right;">${dateRange}</span></p>${bullets ? `<ul style="margin-top:2px;">${bullets}</ul>` : ''}`;
          }).join('');
      },
      education: () => {
        if (!cv.education?.length) return '';
        return `<h2 style="text-transform:uppercase;border-bottom:1px solid #000;padding-bottom:3px;margin-bottom:6px;">EDUCATION</h2>` +
          cv.education.map(e => {
            const degree = e.field_of_study ? `${e.degree}, ${e.field_of_study}` : e.degree;
            const dateRange = `${e.start_date} - ${e.end_date}`;
            return `<p><strong>${degree}</strong> - ${e.institution} <span style="float:right;">${dateRange}</span>${e.gpa ? ` | GPA: ${e.gpa}` : ''}</p>`;
          }).join('');
      },
      skills: () => {
        if (!cv.skills?.length) return '';
        return `<h2 style="text-transform:uppercase;border-bottom:1px solid #000;padding-bottom:3px;margin-bottom:6px;">TECHNICAL SKILLS</h2>` +
          cv.skills
            .filter(g => g.category && g.items?.length)
            .map(g => `<p><strong>${g.category}:</strong> ${g.items.join(', ')}</p>`)
            .join('');
      },
      projects: () => {
        if (!cv.projects?.length) return '';
        return `<h2 style="text-transform:uppercase;border-bottom:1px solid #000;padding-bottom:3px;margin-bottom:6px;">PROJECTS</h2>` +
          cv.projects.map(p => {
            const tech = p.technologies?.length ? ` | <em>${p.technologies.join(', ')}</em>` : '';
            const bullets = (p.highlights?.length ? p.highlights : (p.description ? [p.description] : [])).map(h => `<li>${h}</li>`).join('');
            return `<p style="margin-bottom:2px;"><strong>${p.name}</strong>${tech}</p>${bullets ? `<ul style="margin-top:2px;">${bullets}</ul>` : ''}`;
          }).join('');
      },
      certifications: () => {
        if (!cv.certifications?.length) return '';
        return `<h2 style="text-transform:uppercase;border-bottom:1px solid #000;padding-bottom:3px;margin-bottom:6px;">CERTIFICATIONS</h2>` +
          cv.certifications.map(c => `<p>${c.name} | ${c.issuer}${c.date ? ` | ${c.date}` : ''}</p>`).join('');
      },
      languages: () => {
        if (!cv.languages?.length) return '';
        return `<h2 style="text-transform:uppercase;border-bottom:1px solid #000;padding-bottom:3px;margin-bottom:6px;">LANGUAGES</h2><p>` +
          cv.languages.map(l => `${l.name} (${l.proficiency})`).join(', ') + '</p>';
      },
    };

    // Build header
    const contactParts = [cv.personal_info.phone, cv.personal_info.email, cv.personal_info.linkedin_url, cv.personal_info.github_url, cv.personal_info.portfolio_url, cv.personal_info.address].filter(Boolean);
    const header = `<div style="text-align:center;"><h1 style="margin-bottom:4px;">${cv.personal_info.full_name?.toUpperCase()}</h1><p style="font-size:10pt;">${contactParts.join(' | ')}</p></div><hr style="border:none;border-top:1px solid #000;"/>`;

    // Build sections in section order
    const sectionsHtml = order.map(s => sectionRenderers[s]?.() || '').filter(Boolean).join('');

    const html = `<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word" xmlns="http://www.w3.org/TR/REC-html40">
    <head><meta charset="utf-8"><title>ATS Resume</title>
    <style>body{font-family:Calibri,Arial,sans-serif;font-size:11pt;line-height:1.4;margin:0.4in;}h1{font-size:16pt;}h2{font-size:12pt;margin-top:12px;margin-bottom:4px;}ul{margin-left:18px;padding-left:0;}li{margin-bottom:2px;}p{margin:2px 0;}</style>
    </head><body>${header}${sectionsHtml}</body></html>`;

    const blob = new Blob([html], { type: 'application/msword' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${cv.personal_info.full_name || 'resume'}_ATS_Resume.doc`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleExportLaTeX = () => {
    if (!generatedCV) return;
    if (documentType === 'cv') {
      downloadATSCVLaTeX(generatedCV, undefined, { certPortfolioUrl, includeReferences });
    } else {
      downloadATSResumeLaTeX(generatedCV);
    }
  };

  // ============================================
  // STEPS INDICATOR
  // ============================================
  const steps: { key: Step; label: string; icon: React.ElementType }[] = [
    { key: 'input-method', label: 'Choose Input', icon: Upload },
    { key: 'form', label: 'Your Details', icon: User },
    { key: 'job-role', label: 'Job Role', icon: Briefcase },
    { key: 'job-description', label: 'Customize', icon: ClipboardPaste },
    { key: 'preview', label: 'Preview & Export', icon: Eye },
  ];

  const currentStepIndex = steps.findIndex((s) => s.key === currentStep);

  const canProceedToRole = personalInfo.full_name.trim() !== '' && personalInfo.email.trim() !== '';
  const canProceedToCustomize = selectedRole !== '' || (isCustomRole && customRole.trim() !== '');

  // ============================================
  // RENDER
  // ============================================
  return (
    <div className="min-h-screen bg-transparent text-gray-900 dark:text-white">


      {/* Header */}
      <div className="bg-white/[0.03] dark:bg-white/[0.03] border-b border-gray-200 dark:border-white/5">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
            <div className="p-2.5 bg-indigo-500/15 rounded-xl">
              <FileText className="h-7 w-7 text-indigo-500 dark:text-indigo-400" />
            </div>
            {documentType === 'cv' ? 'ATS CV Builder' : 'ATS Resume Builder'}
          </h1>
          <p className="mt-2 text-gray-500 dark:text-white/50">
            {documentType === 'cv'
              ? 'Build a comprehensive multi-page CV with all your details — education, experience, research, achievements, and more.'
              : 'Build a focused 1-page ATS resume for your target role. Only include what matters for the application.'}
          </p>
        </div>
      </div>

      {/* Step Indicator */}
      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* Document Type Selector */}
        <div className="flex justify-center mb-6">
          <div className="inline-flex rounded-xl border border-gray-200 dark:border-white/10 bg-gray-100 dark:bg-white/5 p-1 gap-1">
            <button
              onClick={() => handleDocumentTypeChange('resume')}
              className={`px-6 py-2 rounded-lg text-sm font-semibold transition-all ${
                documentType === 'resume'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'text-gray-500 dark:text-white/50 hover:text-gray-900 dark:hover:text-white hover:bg-gray-200 dark:hover:bg-white/10'
              }`}
            >
              ATS Resume <span className="ml-1 text-xs font-normal opacity-75">(1 page)</span>
            </button>
            <button
              onClick={() => handleDocumentTypeChange('cv')}
              className={`px-6 py-2 rounded-lg text-sm font-semibold transition-all ${
                documentType === 'cv'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'text-white/50 hover:text-white hover:bg-white/10'
              }`}
            >
              ATS CV <span className="ml-1 text-xs font-normal opacity-75">(multi-page)</span>
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between mb-8">
          {steps.map((step, i) => {
            const StepIcon = step.icon;
            const isActive = i === currentStepIndex;
            const isCompleted = i < currentStepIndex;
            return (
              <React.Fragment key={step.key}>
                <button
                  onClick={() => {
                    if (i <= currentStepIndex) setCurrentStep(step.key);
                  }}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-indigo-600 text-white shadow-md'
                      : isCompleted
                      ? 'bg-indigo-500/15 text-indigo-400 hover:bg-indigo-500/25 cursor-pointer'
                      : 'bg-white/5 text-white/30 cursor-default'
                  }`}
                  disabled={i > currentStepIndex}
                >
                  {isCompleted ? (
                    <CheckCircle className="h-4 w-4" />
                  ) : (
                    <StepIcon className="h-4 w-4" />
                  )}
                  <span className="hidden sm:inline">{step.label}</span>
                </button>
                {i < steps.length - 1 && (
                  <div
                    className={`flex-1 h-0.5 mx-2 ${
                      i < currentStepIndex ? 'bg-indigo-400' : 'bg-white/10'
                    }`}
                  />
                )}
              </React.Fragment>
            );
          })}
        </div>

        {/* ============================================ */}
        {/* STEP 1: CHOOSE INPUT METHOD */}
        {/* ============================================ */}
        {currentStep === 'input-method' && (
          <div className="max-w-3xl mx-auto space-y-6">
            <h2 className="text-xl font-semibold text-white text-center">
              How would you like to provide your information?
            </h2>

            {hasDraft && (
              <div className="bg-indigo-950/30 rounded-2xl border border-indigo-500/30 p-5 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-indigo-500/15 flex items-center justify-center text-indigo-400 flex-shrink-0">
                    <Sparkles className="h-5 w-5" />
                  </div>
                  <div className="text-left">
                    <h4 className="font-bold text-white text-sm">Active Local Draft Detected</h4>
                    <p className="text-xs text-white/50 mt-0.5">Restore your last unsaved edits (personal info, experiences, skills, etc.) instantly.</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <button
                    onClick={handleRestoreDraft}
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-lg transition-all shadow-sm"
                  >
                    Restore Draft
                  </button>
                  <button
                    onClick={handleClearDraft}
                    className="px-3 py-2 bg-white/5 hover:bg-white/10 text-white/80 text-xs font-semibold rounded-lg transition-all border border-white/10"
                  >
                    Discard
                  </button>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Manual Entry */}
              <button
                onClick={() => {
                  setInputMethod('manual');
                  setCurrentStep('form');
                }}
                className={`p-8 rounded-2xl border-2 transition-all text-left hover:shadow-lg ${
                  inputMethod === 'manual'
                    ? 'border-indigo-500 bg-indigo-500/10 text-white'
                    : 'border-white/10 bg-white/5 text-white hover:border-indigo-500/30 hover:bg-white/10'
                }`}
              >
                <div className="p-3 bg-indigo-500/15 rounded-xl w-fit mb-4">
                  <User className="h-8 w-8 text-indigo-400" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">
                  Enter Manually
                </h3>
                <p className="text-sm text-white/60">
                  Fill out a form with your personal info, experience, education, skills, and projects.
                </p>
              </button>

              {/* Upload Existing */}
              <div
                className={`p-8 rounded-2xl border-2 transition-all text-left hover:shadow-lg ${
                  inputMethod === 'upload'
                    ? 'border-indigo-500 bg-indigo-500/10 text-white'
                    : 'border-white/10 bg-white/5 text-white hover:border-indigo-500/30'
                }`}
              >
                <div className="p-3 bg-purple-500/15 rounded-xl w-fit mb-4">
                  <Upload className="h-8 w-8 text-purple-400" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">
                  Upload Existing Resume
                </h3>
                <p className="text-sm text-white/60 mb-4">
                  Upload a PDF, DOC, or DOCX file. We'll extract all the information automatically.
                </p>

                {/* Drop zone */}
                <div
                  onDragOver={(e) => {
                    e.preventDefault();
                    setInputMethod('upload');
                  }}
                  onDrop={handleFileDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-white/20 rounded-xl p-6 text-center cursor-pointer hover:border-indigo-400/50 hover:bg-white/5 transition-all"
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={(e) => {
                      if (e.target.files?.[0]) {
                        setInputMethod('upload');
                        handleFileUpload(e.target.files[0]);
                      }
                    }}
                    className="hidden"
                  />
                  {isUploading ? (
                    <div className="space-y-2">
                      <Loader2 className="h-8 w-8 text-indigo-400 animate-spin mx-auto" />
                      <p className="text-sm text-white/60">Parsing your document...</p>
                    </div>
                  ) : uploadSuccess ? (
                    <div className="space-y-2">
                      <CheckCircle className="h-8 w-8 text-green-400 mx-auto" />
                      <p className="text-sm text-green-400 font-medium">
                        Successfully extracted! Proceeding...
                      </p>
                    </div>
                  ) : (
                    <>
                      <Upload className="h-8 w-8 text-white/40 mx-auto mb-2" />
                      <p className="text-sm text-white/60">
                        Drag & drop or <span className="text-indigo-400 font-medium">browse</span>
                      </p>
                      <div className="flex gap-2 justify-center mt-2">
                        <span className="px-2 py-0.5 text-xs bg-white/5 text-white/60 rounded">PDF</span>
                        <span className="px-2 py-0.5 text-xs bg-white/5 text-white/60 rounded">DOC</span>
                        <span className="px-2 py-0.5 text-xs bg-white/5 text-white/60 rounded">DOCX</span>
                      </div>
                    </>
                  )}
                </div>
                {uploadError && (
                  <div className="mt-3 p-3 bg-red-950/30 border border-red-500/30 rounded-lg flex items-start gap-2">
                    <AlertCircle className="h-4 w-4 text-red-400 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-red-400">{uploadError}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ============================================ */}
        {/* STEP 2: FORM - YOUR DETAILS */}
        {/* ============================================ */}
        {currentStep === 'form' && (
          <div className="max-w-4xl mx-auto space-y-4">
            {/* Personal Info */}
            <CollapsibleSection title="Personal Information" icon={User} defaultOpen={true}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormInput
                  label="Full Name"
                  value={personalInfo.full_name}
                  onChange={(v) => setPersonalInfo({ ...personalInfo, full_name: v })}
                  placeholder="John Doe"
                  required
                />
                <FormInput
                  label="Email"
                  value={personalInfo.email}
                  onChange={(v) => setPersonalInfo({ ...personalInfo, email: v })}
                  placeholder="john@example.com"
                  type="email"
                  required
                />
                <FormInput
                  label="Phone"
                  value={personalInfo.phone}
                  onChange={(v) => setPersonalInfo({ ...personalInfo, phone: v })}
                  placeholder="+1 (555) 123-4567"
                />
                <FormInput
                  label="Address / City"
                  value={personalInfo.address}
                  onChange={(v) => setPersonalInfo({ ...personalInfo, address: v })}
                  placeholder="New York, NY"
                />
                <FormInput
                  label="LinkedIn URL"
                  value={personalInfo.linkedin_url || ''}
                  onChange={(v) => setPersonalInfo({ ...personalInfo, linkedin_url: v })}
                  placeholder="https://linkedin.com/in/johndoe"
                />
                <FormInput
                  label="GitHub URL"
                  value={personalInfo.github_url || ''}
                  onChange={(v) => setPersonalInfo({ ...personalInfo, github_url: v })}
                  placeholder="https://github.com/johndoe"
                />
                <FormInput
                  label="Portfolio URL"
                  value={personalInfo.portfolio_url || ''}
                  onChange={(v) => setPersonalInfo({ ...personalInfo, portfolio_url: v })}
                  placeholder="https://johndoe.dev"
                />
              </div>
              <FormInput
                label="Professional Summary"
                value={personalInfo.summary}
                onChange={(v) => setPersonalInfo({ ...personalInfo, summary: v })}
                placeholder="Experienced software engineer with 5+ years in full-stack development..."
                multiline
                rows={4}
              />
            </CollapsibleSection>

            {/* Experience */}
            <CollapsibleSection
              title="Work Experience"
              icon={Briefcase}
              badge={experiences.length > 0 ? `${experiences.length}` : undefined}
            >
              {experiences.map((exp, idx) => (
                <div key={idx} className="p-4 bg-gray-50 rounded-lg space-y-3 relative">
                  <button
                    onClick={() => setExperiences(experiences.filter((_, i) => i !== idx))}
                    className="absolute top-3 right-3 text-gray-400 hover:text-red-500 transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <FormInput
                      label="Job Title"
                      value={exp.title}
                      onChange={(v) => {
                        const updated = [...experiences];
                        updated[idx] = { ...exp, title: v };
                        setExperiences(updated);
                      }}
                      placeholder="Software Engineer"
                    />
                    <FormInput
                      label="Company"
                      value={exp.company}
                      onChange={(v) => {
                        const updated = [...experiences];
                        updated[idx] = { ...exp, company: v };
                        setExperiences(updated);
                      }}
                      placeholder="Google"
                    />
                    <FormInput
                      label="Location"
                      value={exp.location}
                      onChange={(v) => {
                        const updated = [...experiences];
                        updated[idx] = { ...exp, location: v };
                        setExperiences(updated);
                      }}
                      placeholder="Mountain View, CA"
                    />
                    <div className="grid grid-cols-2 gap-2">
                      <FormInput
                        label="Start Date"
                        value={exp.start_date}
                        onChange={(v) => {
                          const updated = [...experiences];
                          updated[idx] = { ...exp, start_date: v };
                          setExperiences(updated);
                        }}
                        type="month"
                      />
                      <FormInput
                        label="End Date"
                        value={exp.current ? '' : exp.end_date}
                        onChange={(v) => {
                          const updated = [...experiences];
                          updated[idx] = { ...exp, end_date: v };
                          setExperiences(updated);
                        }}
                        type="month"
                      />
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={exp.current}
                      onChange={(e) => {
                        const updated = [...experiences];
                        updated[idx] = { ...exp, current: e.target.checked, end_date: e.target.checked ? '' : exp.end_date };
                        setExperiences(updated);
                      }}
                      className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                    />
                    <label className="text-sm text-gray-600">Currently working here</label>
                  </div>
                  <FormInput
                    label="Description / Responsibilities"
                    value={exp.description}
                    onChange={(v) => {
                      const updated = [...experiences];
                      updated[idx] = { ...exp, description: v };
                      setExperiences(updated);
                    }}
                    placeholder="Describe your key responsibilities and achievements..."
                    multiline
                    rows={3}
                  />
                  {/* Achievements */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Key Achievements (one per line)</label>
                    <textarea
                      value={(exp.achievements || []).join('\n')}
                      onChange={(e) => {
                        const updated = [...experiences];
                        updated[idx] = {
                          ...exp,
                          achievements: e.target.value.split('\n').filter((a) => a.trim() !== ''),
                        };
                        setExperiences(updated);
                      }}
                      placeholder="Led migration to microservices, reducing latency by 40%&#10;Mentored 3 junior developers&#10;Implemented CI/CD pipeline"
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                </div>
              ))}
              <button
                onClick={() => setExperiences([...experiences, { ...emptyExperience }])}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-indigo-600 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition-colors"
              >
                <Plus className="h-4 w-4" />
                Add Experience
              </button>
            </CollapsibleSection>

            {/* Education */}
            <CollapsibleSection
              title="Education"
              icon={GraduationCap}
              badge={educations.length > 0 ? `${educations.length}` : undefined}
            >
              {educations.map((edu, idx) => (
                <div key={idx} className="p-4 bg-gray-50 rounded-lg space-y-3 relative">
                  <button
                    onClick={() => setEducations(educations.filter((_, i) => i !== idx))}
                    className="absolute top-3 right-3 text-gray-400 hover:text-red-500 transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <FormInput
                      label="Degree"
                      value={edu.degree}
                      onChange={(v) => {
                        const updated = [...educations];
                        updated[idx] = { ...edu, degree: v };
                        setEducations(updated);
                      }}
                      placeholder="Bachelor of Science"
                    />
                    <FormInput
                      label="Field of Study"
                      value={edu.field_of_study || ''}
                      onChange={(v) => {
                        const updated = [...educations];
                        updated[idx] = { ...edu, field_of_study: v };
                        setEducations(updated);
                      }}
                      placeholder="Computer Science"
                    />
                    <FormInput
                      label="Institution"
                      value={edu.institution}
                      onChange={(v) => {
                        const updated = [...educations];
                        updated[idx] = { ...edu, institution: v };
                        setEducations(updated);
                      }}
                      placeholder="MIT"
                    />
                    <FormInput
                      label="Location"
                      value={edu.location}
                      onChange={(v) => {
                        const updated = [...educations];
                        updated[idx] = { ...edu, location: v };
                        setEducations(updated);
                      }}
                      placeholder="Cambridge, MA"
                    />
                    <FormInput
                      label="Start Date"
                      value={edu.start_date}
                      onChange={(v) => {
                        const updated = [...educations];
                        updated[idx] = { ...edu, start_date: v };
                        setEducations(updated);
                      }}
                      type="month"
                    />
                    <FormInput
                      label="End Date"
                      value={edu.end_date}
                      onChange={(v) => {
                        const updated = [...educations];
                        updated[idx] = { ...edu, end_date: v };
                        setEducations(updated);
                      }}
                      type="month"
                    />
                    <FormInput
                      label="GPA"
                      value={edu.gpa || ''}
                      onChange={(v) => {
                        const updated = [...educations];
                        updated[idx] = { ...edu, gpa: v };
                        setEducations(updated);
                      }}
                      placeholder="3.8/4.0"
                    />
                  </div>
                  <FormInput
                    label="Description / Relevant Coursework"
                    value={edu.description}
                    onChange={(v) => {
                      const updated = [...educations];
                      updated[idx] = { ...edu, description: v };
                      setEducations(updated);
                    }}
                    placeholder="Relevant coursework: Data Structures, Algorithms, Machine Learning..."
                    multiline
                    rows={2}
                  />
                </div>
              ))}
              <button
                onClick={() => setEducations([...educations, { ...emptyEducation }])}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-indigo-600 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition-colors"
              >
                <Plus className="h-4 w-4" />
                Add Education
              </button>
            </CollapsibleSection>

            {/* Skills - Grouped by Category */}
            <CollapsibleSection
              title="Skills"
              icon={Code}
              badge={skills.length > 0 ? `${skills.reduce((n, g) => n + g.items.length, 0)} skills` : undefined}
            >
              <p className="text-xs text-gray-500 mb-3">
                Add a category (e.g. <span className="font-medium text-gray-700">Frontend</span>, <span className="font-medium text-gray-700">Backend</span>, <span className="font-medium text-gray-700">AI / ML</span>), then list the skills under it — comma-separated. This is exactly how they appear on your resume.
              </p>
              <div className="space-y-3">
                {skills.map((group, idx) => (
                  <div key={idx} className="p-3 bg-gray-50 rounded-lg space-y-2 border border-gray-100">
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={group.category}
                        onChange={(e) => {
                          const updated = [...skills];
                          updated[idx] = { ...group, category: e.target.value };
                          setSkills(updated);
                        }}
                        placeholder="Category (e.g. Frontend, Backend, AI / ML, Tools)"
                        className="flex-1 px-3 py-1.5 border border-indigo-200 bg-white rounded-lg text-sm font-semibold text-indigo-800 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      />
                      <button
                        onClick={() => setSkills(skills.filter((_, i) => i !== idx))}
                        className="text-gray-400 hover:text-red-500 transition-colors flex-shrink-0"
                        title="Remove category"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                    <input
                      type="text"
                      value={group.items.join(', ')}
                      onChange={(e) => {
                        const updated = [...skills];
                        updated[idx] = {
                          ...group,
                          items: e.target.value.split(',').map((s) => s.trim()).filter(Boolean),
                        };
                        setSkills(updated);
                      }}
                      placeholder="Python, JavaScript, TypeScript, ... (comma-separated)"
                      className="w-full px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white"
                    />
                  </div>
                ))}
              </div>
              <button
                onClick={() => setSkills([...skills, { category: '', items: [] }])}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-indigo-600 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition-colors mt-2"
              >
                <Plus className="h-4 w-4" />
                Add Skill Category
              </button>
            </CollapsibleSection>

            {/* Projects */}
            <CollapsibleSection
              title="Projects"
              icon={Code}
              badge={projects.length > 0 ? `${projects.length}` : undefined}
            >
              {projects.map((proj, idx) => (
                <div key={idx} className="p-4 bg-gray-50 rounded-lg space-y-3 relative">
                  <button
                    onClick={() => setProjects(projects.filter((_, i) => i !== idx))}
                    className="absolute top-3 right-3 text-gray-400 hover:text-red-500 transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <FormInput
                      label="Project Name"
                      value={proj.name}
                      onChange={(v) => {
                        const updated = [...projects];
                        updated[idx] = { ...proj, name: v };
                        setProjects(updated);
                      }}
                      placeholder="E-commerce Platform"
                    />
                    <FormInput
                      label="URL"
                      value={proj.url || ''}
                      onChange={(v) => {
                        const updated = [...projects];
                        updated[idx] = { ...proj, url: v };
                        setProjects(updated);
                      }}
                      placeholder="https://myproject.com"
                    />
                  </div>
                  <FormInput
                    label="Description"
                    value={proj.description}
                    onChange={(v) => {
                      const updated = [...projects];
                      updated[idx] = { ...proj, description: v };
                      setProjects(updated);
                    }}
                    placeholder="Built a scalable e-commerce platform with React, Node.js, and PostgreSQL..."
                    multiline
                    rows={2}
                  />
                  <FormInput
                    label="Technologies (comma-separated)"
                    value={(proj.technologies || []).join(', ')}
                    onChange={(v) => {
                      const updated = [...projects];
                      updated[idx] = {
                        ...proj,
                        technologies: v.split(',').map((t) => t.trim()).filter(Boolean),
                      };
                      setProjects(updated);
                    }}
                    placeholder="React, Node.js, PostgreSQL, Docker"
                  />
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Highlights (one per line)</label>
                    <textarea
                      value={(proj.highlights || []).join('\n')}
                      onChange={(e) => {
                        const updated = [...projects];
                        updated[idx] = {
                          ...proj,
                          highlights: e.target.value.split('\n').filter((h) => h.trim() !== ''),
                        };
                        setProjects(updated);
                      }}
                      placeholder="Handles 10K+ daily active users&#10;Integrated Stripe payments&#10;99.9% uptime SLA"
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                </div>
              ))}
              <button
                onClick={() => setProjects([...projects, { ...emptyProject }])}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-indigo-600 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition-colors"
              >
                <Plus className="h-4 w-4" />
                Add Project
              </button>
            </CollapsibleSection>

            {/* Certifications */}
            <CollapsibleSection
              title="Certifications"
              icon={Award}
              badge={certifications.length > 0 ? `${certifications.length}` : undefined}
            >
              {/* Certificate Portfolio Link */}
              <div className="mb-4 p-3 bg-blue-50 rounded-lg border border-blue-100">
                <label className="block text-sm font-medium text-blue-800 mb-1">
                  Certificate Portfolio Link <span className="text-blue-500 font-normal">(optional)</span>
                </label>
                <p className="text-xs text-blue-600 mb-2">
                  Google Drive or portfolio URL — shown at the top of the Certifications section as a clickable link.
                </p>
                <input
                  type="url"
                  value={certPortfolioUrl}
                  onChange={(e) => setCertPortfolioUrl(e.target.value)}
                  placeholder="https://drive.google.com/drive/folders/..."
                  className="w-full px-3 py-1.5 border border-blue-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                />
              </div>
              {certifications.map((cert, idx) => (
                <div key={idx} className="p-4 bg-gray-50 rounded-lg space-y-3 relative">
                  <button
                    onClick={() => setCertifications(certifications.filter((_, i) => i !== idx))}
                    className="absolute top-3 right-3 text-gray-400 hover:text-red-500 transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <FormInput
                      label="Certification Name"
                      value={cert.name}
                      onChange={(v) => {
                        const updated = [...certifications];
                        updated[idx] = { ...cert, name: v };
                        setCertifications(updated);
                      }}
                      placeholder="AWS Solutions Architect"
                    />
                    <FormInput
                      label="Issuer"
                      value={cert.issuer}
                      onChange={(v) => {
                        const updated = [...certifications];
                        updated[idx] = { ...cert, issuer: v };
                        setCertifications(updated);
                      }}
                      placeholder="Amazon Web Services"
                    />
                    <FormInput
                      label="Date"
                      value={cert.date}
                      onChange={(v) => {
                        const updated = [...certifications];
                        updated[idx] = { ...cert, date: v };
                        setCertifications(updated);
                      }}
                      type="month"
                    />
                    <FormInput
                      label="URL"
                      value={cert.url || ''}
                      onChange={(v) => {
                        const updated = [...certifications];
                        updated[idx] = { ...cert, url: v };
                        setCertifications(updated);
                      }}
                      placeholder="https://credential.net/..."
                    />
                  </div>
                </div>
              ))}
              <button
                onClick={() => setCertifications([...certifications, { ...emptyCertification }])}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-indigo-600 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition-colors"
              >
                <Plus className="h-4 w-4" />
                Add Certification
              </button>
            </CollapsibleSection>

            {/* Languages */}
            <CollapsibleSection
              title="Languages"
              icon={Languages}
              badge={languages.length > 0 ? `${languages.length}` : undefined}
            >
              <div className="space-y-2">
                {languages.map((lang, idx) => (
                  <div key={idx} className="flex items-center gap-3 p-2 bg-gray-50 rounded-lg">
                    <input
                      type="text"
                      value={lang.name}
                      onChange={(e) => {
                        const updated = [...languages];
                        updated[idx] = { ...lang, name: e.target.value };
                        setLanguages(updated);
                      }}
                      placeholder="Language"
                      className="flex-1 px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500"
                    />
                    <select
                      value={lang.proficiency}
                      onChange={(e) => {
                        const updated = [...languages];
                        updated[idx] = { ...lang, proficiency: e.target.value as Language['proficiency'] };
                        setLanguages(updated);
                      }}
                      className="px-2 py-1.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500"
                    >
                      <option value="basic">Basic</option>
                      <option value="conversational">Conversational</option>
                      <option value="professional">Professional</option>
                      <option value="native">Native</option>
                    </select>
                    <button
                      onClick={() => setLanguages(languages.filter((_, i) => i !== idx))}
                      className="text-gray-400 hover:text-red-500"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
              <button
                onClick={() => setLanguages([...languages, { ...emptyLanguage }])}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-indigo-600 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition-colors"
              >
                <Plus className="h-4 w-4" />
                Add Language
              </button>
            </CollapsibleSection>

            {/* Additional Sections (Achievements, Extracurricular, Online Profiles, etc.) */}
            <CollapsibleSection
              title="Additional Sections"
              icon={BookOpen}
              badge={customSections.length > 0 ? `${customSections.length} ${customSections.length === 1 ? 'section' : 'sections'}` : undefined}
            >
              <p className="text-xs text-gray-500 mb-3">
                Add any extra sections from your CV — Achievements &amp; Competitions, Extracurricular &amp; Leadership, Online Profiles, Publications, etc.
              </p>
              <div className="space-y-4">
                {customSections.map((section, sIdx) => (
                  <div key={sIdx} className="p-4 bg-gray-50 rounded-lg border border-gray-100 space-y-3 relative">
                    <button
                      onClick={() => setCustomSections(customSections.filter((_, i) => i !== sIdx))}
                      className="absolute top-3 right-3 text-gray-400 hover:text-red-500 transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pr-8">
                      <FormInput
                        label="Section Title"
                        value={section.title}
                        onChange={(v) => {
                          const u = [...customSections];
                          u[sIdx] = { ...section, title: v };
                          setCustomSections(u);
                        }}
                        placeholder="Achievements & Competitions, Extracurricular..."
                      />
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Display Style</label>
                        <select
                          value={section.section_type || 'bullets'}
                          onChange={(e) => {
                            const u = [...customSections];
                            u[sIdx] = { ...section, section_type: e.target.value as CustomSection['section_type'] };
                            setCustomSections(u);
                          }}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500"
                        >
                          <option value="bullets">Bullet list (Bold title: description)</option>
                          <option value="entries">Entries (Title — Subtitle, date)</option>
                          <option value="profiles">Profiles table (Label | URL)</option>
                        </select>
                      </div>
                    </div>
                    <div className="space-y-2">
                      {section.items.map((item, iIdx) => (
                        <div key={iIdx} className="p-2 bg-white rounded border border-gray-200 space-y-2 relative">
                          <button
                            onClick={() => {
                              const u = [...customSections];
                              u[sIdx] = { ...section, items: section.items.filter((_, i) => i !== iIdx) };
                              setCustomSections(u);
                            }}
                            className="absolute top-2 right-2 text-gray-300 hover:text-red-500 transition-colors"
                          >
                            <X className="h-3 w-3" />
                          </button>
                          <div className="grid grid-cols-2 gap-2 pr-6">
                            <input
                              type="text"
                              value={item.title}
                              placeholder="Title / Label"
                              onChange={(e) => {
                                const u = [...customSections];
                                u[sIdx] = { ...section, items: section.items.map((it, i) => i === iIdx ? { ...it, title: e.target.value } : it) };
                                setCustomSections(u);
                              }}
                              className="px-2 py-1.5 border border-gray-300 rounded-lg text-sm focus:ring-1 focus:ring-indigo-500"
                            />
                            <input
                              type="text"
                              value={item.subtitle || ''}
                              placeholder={section.section_type === 'profiles' ? 'URL or handle' : 'Subtitle / Organization'}
                              onChange={(e) => {
                                const u = [...customSections];
                                u[sIdx] = { ...section, items: section.items.map((it, i) => i === iIdx ? { ...it, subtitle: e.target.value } : it) };
                                setCustomSections(u);
                              }}
                              className="px-2 py-1.5 border border-gray-300 rounded-lg text-sm focus:ring-1 focus:ring-indigo-500"
                            />
                          </div>
                          {section.section_type !== 'profiles' && (
                            <textarea
                              value={item.description || ''}
                              placeholder="Description..."
                              rows={2}
                              onChange={(e) => {
                                const u = [...customSections];
                                u[sIdx] = { ...section, items: section.items.map((it, i) => i === iIdx ? { ...it, description: e.target.value } : it) };
                                setCustomSections(u);
                              }}
                              className="w-full px-2 py-1.5 border border-gray-300 rounded-lg text-sm focus:ring-1 focus:ring-indigo-500"
                            />
                          )}
                        </div>
                      ))}
                      <button
                        onClick={() => {
                          const u = [...customSections];
                          u[sIdx] = { ...section, items: [...section.items, { title: '', subtitle: '', description: '' }] };
                          setCustomSections(u);
                        }}
                        className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-indigo-600 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition-colors"
                      >
                        <Plus className="h-3 w-3" />
                        Add Item
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              <button
                onClick={() => setCustomSections([...customSections, { ...emptyCustomSection }])}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-indigo-600 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition-colors mt-2"
              >
                <Plus className="h-4 w-4" />
                Add Section
              </button>
            </CollapsibleSection>

            {/* References toggle */}
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-200">
              <div>
                <p className="text-sm font-medium text-gray-800">Include "References available upon request"</p>
                <p className="text-xs text-gray-500 mt-0.5">Adds a centred italic line at the very end of your ATS CV</p>
              </div>
              <button
                onClick={() => setIncludeReferences(!includeReferences)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors flex-shrink-0 ${includeReferences ? 'bg-indigo-600' : 'bg-gray-300'}`}
              >
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${includeReferences ? 'translate-x-6' : 'translate-x-1'}`} />
              </button>
            </div>

            {/* Navigation */}
            <div className="flex justify-between items-center pt-4">
              <button
                onClick={() => setCurrentStep('input-method')}
                className="px-6 py-2.5 text-sm font-medium text-white/80 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 hover:text-white transition-colors"
              >
                Back
              </button>
              <div className="flex items-center gap-3">
                {generatedCV && (
                  <button
                    onClick={() => setCurrentStep('preview')}
                    className="flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-indigo-400 border border-indigo-500/30 bg-indigo-500/10 rounded-lg hover:bg-indigo-500/20 transition-colors"
                  >
                    <Eye className="h-4 w-4" />
                    Back to Preview
                  </button>
                )}
                <button
                  onClick={() => setCurrentStep('job-role')}
                  disabled={!canProceedToRole}
                  className="px-6 py-2.5 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next: Choose Job Role
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ============================================ */}
        {/* STEP 3: JOB ROLE SELECTION */}
        {/* ============================================ */}
        {currentStep === 'job-role' && (
          <div className="max-w-3xl mx-auto space-y-6">
            <h2 className="text-xl font-semibold text-white text-center">
              What job role are you applying for?
            </h2>
            <p className="text-center text-white/50 text-sm">
              Select a role to optimize your resume's keywords, section order, and formatting for ATS scanners.
            </p>

            {/* Role dropdown grouped by category */}
            <div className="space-y-4">
              {JOB_ROLE_CATEGORIES.map((category) => (
                <div key={category.label}>
                  <h3 className="text-xs font-semibold text-indigo-400 uppercase tracking-wider mb-2">
                    {category.label}
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {category.roles.map((role) => (
                      <button
                        key={role.value}
                        onClick={() => {
                          setSelectedRole(role.value);
                          setIsCustomRole(false);
                          setSectionOrder(getDefaultSectionOrder(role.value));
                        }}
                        className={`px-4 py-3 rounded-lg text-sm font-medium text-left transition-all ${
                          selectedRole === role.value && !isCustomRole
                            ? 'bg-indigo-600 text-white shadow-md ring-2 ring-indigo-500/50'
                            : 'bg-white/5 border border-white/10 text-white/80 hover:border-indigo-500/50 hover:bg-white/10'
                        }`}
                      >
                        {role.label}
                      </button>
                    ))}
                  </div>
                </div>
              ))}

              {/* Custom Role */}
              <div>
                <h3 className="text-xs font-semibold text-indigo-400 uppercase tracking-wider mb-2">
                  Custom Role
                </h3>
                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      setIsCustomRole(true);
                      setSelectedRole('');
                    }}
                    className={`px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                      isCustomRole
                        ? 'bg-purple-600 text-white shadow-md ring-2 ring-purple-500/50'
                        : 'bg-white/5 border border-white/10 text-white/80 hover:border-purple-500/50 hover:bg-purple-50/10'
                    }`}
                  >
                    Custom Role
                  </button>
                  {isCustomRole && (
                    <input
                      type="text"
                      value={customRole}
                      onChange={(e) => setCustomRole(e.target.value)}
                      placeholder="e.g., Backend Developer, DevOps Engineer"
                      className="flex-1 px-4 py-3 border border-white/10 bg-white/5 text-white placeholder-white/30 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                      autoFocus
                    />
                  )}
                </div>
              </div>
            </div>

            {/* Navigation */}
            <div className="flex justify-between pt-4">
              <button
                onClick={() => setCurrentStep('form')}
                className="px-6 py-2.5 text-sm font-medium text-white/80 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 hover:text-white transition-colors"
              >
                Back
              </button>
              <button
                onClick={() => setCurrentStep('job-description')}
                disabled={!canProceedToCustomize}
                className="px-6 py-2.5 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next: Customize
              </button>
            </div>
          </div>
        )}

        {/* ============================================ */}
        {/* STEP 4: JOB DESCRIPTION CUSTOMIZATION */}
        {/* ============================================ */}
        {currentStep === 'job-description' && (
          <div className="max-w-3xl mx-auto space-y-6">
            <h2 className="text-xl font-semibold text-white text-center">
              Customize for a Specific Job?
            </h2>
            <p className="text-center text-white/50 text-sm">
              Optionally paste a job description, and our AI will tailor your resume — emphasizing matching
              skills, using keywords from the description, and optimizing for that specific ATS.
            </p>

            {/* Toggle */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-4">

              {/* Section Reorder */}
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-indigo-100 rounded-lg">
                  <ListOrdered className="h-5 w-5 text-indigo-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Section Order</h3>
                  <p className="text-sm text-gray-500">
                    Drag sections up or down to reorder your resume
                  </p>
                </div>
              </div>
              <div className="space-y-1">
                {sectionOrder.map((section, idx) => {
                  const sectionLabels: Record<string, string> = {
                    summary: 'Summary',
                    skills: 'Technical Skills',
                    experience: 'Experience',
                    projects: 'Projects',
                    education: 'Education',
                    certifications: 'Certifications',
                    languages: 'Languages',
                  };
                  return (
                    <div key={section} className="flex items-center gap-2 p-2.5 bg-gray-50 rounded-lg">
                      <span className="text-xs font-medium text-gray-400 w-5 text-center">{idx + 1}</span>
                      <span className="flex-1 text-sm font-medium text-gray-700">{sectionLabels[section] || section}</span>
                      <button
                        onClick={() => {
                          if (idx === 0) return;
                          const newOrder = [...sectionOrder];
                          [newOrder[idx - 1], newOrder[idx]] = [newOrder[idx], newOrder[idx - 1]];
                          setSectionOrder(newOrder);
                        }}
                        disabled={idx === 0}
                        className="p-1 rounded hover:bg-gray-200 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                        title="Move up"
                      >
                        <ArrowUp className="h-3.5 w-3.5 text-gray-600" />
                      </button>
                      <button
                        onClick={() => {
                          if (idx === sectionOrder.length - 1) return;
                          const newOrder = [...sectionOrder];
                          [newOrder[idx], newOrder[idx + 1]] = [newOrder[idx + 1], newOrder[idx]];
                          setSectionOrder(newOrder);
                        }}
                        disabled={idx === sectionOrder.length - 1}
                        className="p-1 rounded hover:bg-gray-200 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                        title="Move down"
                      >
                        <ArrowDown className="h-3.5 w-3.5 text-gray-600" />
                      </button>
                    </div>
                  );
                })}
              </div>

              <div className="border-t border-gray-100 my-4" />

              {/* AI Job Description Matching */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <Wand2 className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">AI Job Description Matching</h3>
                    <p className="text-sm text-gray-500">
                      Paste a job description to auto-optimize your resume
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setUseJobDescription(!useJobDescription)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    useJobDescription ? 'bg-indigo-600' : 'bg-gray-300'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      useJobDescription ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              {useJobDescription && (
                <div className="space-y-3">
                  <textarea
                    value={jobDescription}
                    onChange={(e) => setJobDescription(e.target.value)}
                    placeholder="Paste the full job description here...&#10;&#10;Example:&#10;We are looking for a Software Engineer with experience in React, Node.js, and cloud services. The ideal candidate should have 3+ years of experience..."
                    rows={10}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                  <div className="p-4 bg-blue-50 rounded-xl">
                    <h4 className="font-medium text-blue-900 text-sm mb-2">How it works:</h4>
                    <ul className="text-sm text-blue-700 space-y-1">
                      <li>• AI extracts required skills and ATS keywords from the job description</li>
                      <li>• Your summary is rewritten to match the role's requirements</li>
                      <li>• Experience bullets are optimized with relevant action verbs and metrics</li>
                      <li>• Skills are reordered to prioritize what the employer wants</li>
                      <li>• You get a match score showing alignment with the job</li>
                    </ul>
                  </div>
                </div>
              )}
            </div>

            {/* Navigation */}
            <div className="flex justify-between pt-4">
              <button
                onClick={() => setCurrentStep('job-role')}
                className="px-6 py-2.5 text-sm font-medium text-white/80 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 hover:text-white transition-colors"
              >
                Back
              </button>
              <div className="flex gap-3">
                {/* Generate without tailoring */}
                <button
                  onClick={handleGenerate}
                  disabled={isGenerating}
                  className="px-6 py-2.5 text-sm font-medium text-indigo-600 border border-indigo-300 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition-colors disabled:opacity-50"
                >
                  {isGenerating ? (
                    <span className="flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Generating...
                    </span>
                  ) : (
                    'Generate Resume'
                  )}
                </button>
                {/* Generate with tailoring */}
                {useJobDescription && jobDescription.trim() && (
                  <button
                    onClick={handleTailorToJob}
                    disabled={isTailoring}
                    className="px-6 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-purple-600 to-indigo-600 rounded-lg hover:from-purple-700 hover:to-indigo-700 transition-colors disabled:opacity-50 shadow-md"
                  >
                    {isTailoring ? (
                      <span className="flex items-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        AI Tailoring...
                      </span>
                    ) : (
                      <span className="flex items-center gap-2">
                        <Sparkles className="h-4 w-4" />
                        Tailor & Generate
                      </span>
                    )}
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ============================================ */}
        {/* STEP 5: PREVIEW & EXPORT */}
        {/* ============================================ */}
        {currentStep === 'preview' && generatedCV && (
          <div className="max-w-[1600px] mx-auto space-y-6">
            {/* Tailor Results (Optional Alert Banner) */}
            {tailorResult && (
              <div className="bg-gradient-to-r from-purple-500/10 to-indigo-500/10 backdrop-blur-md rounded-2xl border border-purple-500/20 p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-sm animate-fade-in">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-purple-600/10 rounded-xl text-purple-600">
                    <Sparkles className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                      AI Resume Tailored
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-purple-100 text-purple-700 animate-pulse">
                        {tailorResult.match_score}% ATS Match Score
                      </span>
                    </h4>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Successfully optimized professional summary, skills, and experiences with target keywords.
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  {tailorResult.job_analysis.ats_keywords.slice(0, 4).map((kw, idx) => (
                    <span key={idx} className="px-2.5 py-1 text-[10px] font-bold bg-slate-100 text-slate-600 rounded-lg">
                      #{kw}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Split Visual Sandbox Workspace */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Left Column: Tabbed Visual Form Editor */}
              <div className="lg:col-span-5 flex flex-col bg-white border border-slate-100 rounded-3xl p-5 shadow-lg max-h-[85vh] overflow-y-auto">
                <div className="flex justify-between items-center pb-4 mb-4 border-b border-slate-100">
                  <div>
                    <h3 className="font-extrabold text-slate-900 text-lg flex items-center gap-2">
                      Visual Editor Workspace
                    </h3>
                    <p className="text-xs text-slate-400">Modify details on the fly. Real-time autosave enabled.</p>
                  </div>
                  <button
                    onClick={() => setCurrentStep('job-description')}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-bold rounded-xl border border-slate-200 transition-colors"
                  >
                    <ArrowLeft className="h-3.5 w-3.5" />
                    Back
                  </button>
                </div>

                {/* Horizontal Segmented Top Tabs */}
                <div className="grid grid-cols-4 gap-1.5 mb-6 bg-slate-50 p-1 rounded-2xl border border-slate-100 shrink-0">
                  {[
                    { id: 'personal', label: 'Info', icon: User },
                    { id: 'experience', label: 'Work', icon: Briefcase },
                    { id: 'education', label: 'Education', icon: GraduationCap },
                    { id: 'skills', label: 'Skills', icon: Code },
                    { id: 'projects', label: 'Projects', icon: BookOpen },
                    { id: 'certifications', label: 'Certs', icon: Award },
                    { id: 'custom', label: 'Custom', icon: Sparkles },
                    { id: 'settings', label: 'Optimize', icon: Wand2 },
                  ].map(tab => {
                    const Icon = tab.icon;
                    const isActive = activePreviewTab === tab.id;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setActivePreviewTab(tab.id)}
                        className={`flex items-center justify-center gap-1 px-2 py-2 rounded-xl text-[11px] font-extrabold transition-all border ${
                          isActive
                            ? 'bg-indigo-600 border-indigo-600 text-white shadow-sm shadow-indigo-100 scale-[1.02]'
                            : 'bg-white border-slate-200 text-slate-600 hover:text-indigo-600 hover:border-indigo-100 hover:bg-indigo-50/20'
                        }`}
                      >
                        <Icon className={`h-3.5 w-3.5 shrink-0 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                        <span className="truncate">{tab.label}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Tab Content Panel (Stretches to 100% of editor width) */}
                <div className="flex-grow space-y-5">
                    {/* PERSONAL TAB */}
                    {activePreviewTab === 'personal' && (
                      <div className="space-y-4">
                        <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                          <h4 className="font-bold text-slate-800 flex items-center gap-2 text-sm">
                            <User className="h-4.5 w-4.5 text-indigo-600" />
                            Personal Details
                          </h4>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <FormInput
                            label="Full Name"
                            value={personalInfo.full_name}
                            onChange={(v) => setPersonalInfo({ ...personalInfo, full_name: v })}
                            placeholder="John Doe"
                            required
                          />
                          <FormInput
                            label="Email"
                            value={personalInfo.email}
                            onChange={(v) => setPersonalInfo({ ...personalInfo, email: v })}
                            placeholder="john@example.com"
                            type="email"
                            required
                          />
                          <FormInput
                            label="Phone"
                            value={personalInfo.phone}
                            onChange={(v) => setPersonalInfo({ ...personalInfo, phone: v })}
                            placeholder="+1 (555) 123-4567"
                          />
                          <FormInput
                            label="Address / City"
                            value={personalInfo.address}
                            onChange={(v) => setPersonalInfo({ ...personalInfo, address: v })}
                            placeholder="New York, NY"
                          />
                          <FormInput
                            label="LinkedIn"
                            value={personalInfo.linkedin_url || ''}
                            onChange={(v) => setPersonalInfo({ ...personalInfo, linkedin_url: v })}
                            placeholder="https://linkedin.com/in/johndoe"
                          />
                          <FormInput
                            label="GitHub"
                            value={personalInfo.github_url || ''}
                            onChange={(v) => setPersonalInfo({ ...personalInfo, github_url: v })}
                            placeholder="https://github.com/johndoe"
                          />
                          <FormInput
                            label="Portfolio"
                            value={personalInfo.portfolio_url || ''}
                            onChange={(v) => setPersonalInfo({ ...personalInfo, portfolio_url: v })}
                            placeholder="https://johndoe.dev"
                          />
                        </div>
                        <FormInput
                          label="Professional Summary"
                          value={personalInfo.summary}
                          onChange={(v) => setPersonalInfo({ ...personalInfo, summary: v })}
                          placeholder="Experienced engineer specializing in backend scalability..."
                          multiline
                          rows={6}
                        />
                      </div>
                    )}

                    {/* EXPERIENCE TAB */}
                    {activePreviewTab === 'experience' && (
                      <div className="space-y-4">
                        <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                          <h4 className="font-bold text-slate-800 flex items-center gap-2 text-sm">
                            <Briefcase className="h-4.5 w-4.5 text-indigo-600" />
                            Work History
                          </h4>
                          <span className="px-2 py-0.5 text-[10px] font-bold bg-slate-100 text-slate-600 rounded-full">
                            {experiences.length} Entries
                          </span>
                        </div>
                        <div className="space-y-4 max-h-[45vh] overflow-y-auto pr-1">
                          {experiences.map((exp, idx) => (
                            <div key={idx} className="p-3.5 bg-slate-50 border border-slate-100 rounded-2xl relative space-y-3">
                              <button
                                onClick={() => setExperiences(experiences.filter((_, i) => i !== idx))}
                                className="absolute top-2.5 right-2.5 text-slate-400 hover:text-rose-500 hover:bg-rose-50 p-1.5 rounded-lg transition-all"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pr-6">
                                <FormInput
                                  label="Title"
                                  value={exp.title}
                                  onChange={(v) => {
                                    const updated = [...experiences];
                                    updated[idx] = { ...exp, title: v };
                                    setExperiences(updated);
                                  }}
                                  placeholder="Software Engineer"
                                />
                                <FormInput
                                  label="Company"
                                  value={exp.company}
                                  onChange={(v) => {
                                    const updated = [...experiences];
                                    updated[idx] = { ...exp, company: v };
                                    setExperiences(updated);
                                  }}
                                  placeholder="Google"
                                />
                                <FormInput
                                  label="Location"
                                  value={exp.location}
                                  onChange={(v) => {
                                    const updated = [...experiences];
                                    updated[idx] = { ...exp, location: v };
                                    setExperiences(updated);
                                  }}
                                  placeholder="Mountain View, CA"
                                />
                                <div className="grid grid-cols-2 gap-1.5">
                                  <FormInput
                                    label="Start Date"
                                    value={exp.start_date}
                                    onChange={(v) => {
                                      const updated = [...experiences];
                                      updated[idx] = { ...exp, start_date: v };
                                      setExperiences(updated);
                                    }}
                                    type="month"
                                  />
                                  <FormInput
                                    label="End Date"
                                    value={exp.current ? '' : exp.end_date}
                                    onChange={(v) => {
                                      const updated = [...experiences];
                                      updated[idx] = { ...exp, end_date: v };
                                      setExperiences(updated);
                                    }}
                                    type="month"
                                    required={!exp.current}
                                  />
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                <input
                                  type="checkbox"
                                  checked={exp.current}
                                  onChange={(e) => {
                                    const updated = [...experiences];
                                    updated[idx] = { ...exp, current: e.target.checked, end_date: e.target.checked ? '' : exp.end_date };
                                    setExperiences(updated);
                                  }}
                                  className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 h-4 w-4"
                                />
                                <span className="text-xs text-slate-500">Currently working here</span>
                              </div>
                              <FormInput
                                label="Job Description Summary"
                                value={exp.description}
                                onChange={(v) => {
                                  const updated = [...experiences];
                                  updated[idx] = { ...exp, description: v };
                                  setExperiences(updated);
                                }}
                                placeholder="Summary of responsibilities..."
                                multiline
                                rows={2}
                              />
                              <div>
                                <label className="block text-[11px] font-bold text-slate-600 mb-1">
                                  Key Achievements (One per line)
                                </label>
                                <textarea
                                  value={(exp.achievements || []).join('\n')}
                                  onChange={(e) => {
                                    const updated = [...experiences];
                                    updated[idx] = {
                                      ...exp,
                                      achievements: e.target.value.split('\n').filter(a => a.trim() !== ''),
                                    };
                                    setExperiences(updated);
                                  }}
                                  placeholder="• Improved response latency by 45%&#10;• Mentored 3 junior hires"
                                  rows={3}
                                  className="w-full px-2.5 py-1.5 border border-slate-200 bg-white rounded-xl text-xs focus:ring-2 focus:ring-indigo-500"
                                />
                              </div>
                            </div>
                          ))}
                        </div>
                        <button
                          onClick={() => setExperiences([...experiences, { ...emptyExperience }])}
                          className="flex items-center justify-center gap-1.5 w-full py-2 bg-indigo-50 hover:bg-indigo-100/80 text-indigo-700 text-xs font-bold rounded-xl border border-dashed border-indigo-200 transition-colors"
                        >
                          <Plus className="h-4 w-4" />
                          Add Work Entry
                        </button>
                      </div>
                    )}

                    {/* EDUCATION TAB */}
                    {activePreviewTab === 'education' && (
                      <div className="space-y-4">
                        <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                          <h4 className="font-bold text-slate-800 flex items-center gap-2 text-sm">
                            <GraduationCap className="h-4.5 w-4.5 text-indigo-600" />
                            Education History
                          </h4>
                          <span className="px-2 py-0.5 text-[10px] font-bold bg-slate-100 text-slate-600 rounded-full">
                            {educations.length} Entries
                          </span>
                        </div>
                        <div className="space-y-4 max-h-[45vh] overflow-y-auto pr-1">
                          {educations.map((edu, idx) => (
                            <div key={idx} className="p-3.5 bg-slate-50 border border-slate-100 rounded-2xl relative space-y-3">
                              <button
                                onClick={() => setEducations(educations.filter((_, i) => i !== idx))}
                                className="absolute top-2.5 right-2.5 text-slate-400 hover:text-rose-500 hover:bg-rose-50 p-1.5 rounded-lg transition-all"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pr-6">
                                <FormInput
                                  label="Degree"
                                  value={edu.degree}
                                  onChange={(v) => {
                                    const updated = [...educations];
                                    updated[idx] = { ...edu, degree: v };
                                    setEducations(updated);
                                  }}
                                  placeholder="Bachelor of Science"
                                />
                                <FormInput
                                  label="Field of Study"
                                  value={edu.field_of_study || ''}
                                  onChange={(v) => {
                                    const updated = [...educations];
                                    updated[idx] = { ...edu, field_of_study: v };
                                    setEducations(updated);
                                  }}
                                  placeholder="Computer Science"
                                />
                                <FormInput
                                  label="Institution"
                                  value={edu.institution}
                                  onChange={(v) => {
                                    const updated = [...educations];
                                    updated[idx] = { ...edu, institution: v };
                                    setEducations(updated);
                                  }}
                                  placeholder="MIT"
                                />
                                <FormInput
                                  label="Location"
                                  value={edu.location}
                                  onChange={(v) => {
                                    const updated = [...educations];
                                    updated[idx] = { ...edu, location: v };
                                    setEducations(updated);
                                  }}
                                  placeholder="Cambridge, MA"
                                />
                                <FormInput
                                  label="Start Date"
                                  value={edu.start_date}
                                  onChange={(v) => {
                                    const updated = [...educations];
                                    updated[idx] = { ...edu, start_date: v };
                                    setEducations(updated);
                                  }}
                                  type="month"
                                />
                                <FormInput
                                  label="End Date"
                                  value={edu.end_date}
                                  onChange={(v) => {
                                    const updated = [...educations];
                                    updated[idx] = { ...edu, end_date: v };
                                    setEducations(updated);
                                  }}
                                  type="month"
                                />
                                <FormInput
                                  label="GPA"
                                  value={edu.gpa || ''}
                                  onChange={(v) => {
                                    const updated = [...educations];
                                    updated[idx] = { ...edu, gpa: v };
                                    setEducations(updated);
                                  }}
                                  placeholder="3.8/4.0"
                                />
                              </div>
                              <FormInput
                                label="Coursework / Details"
                                value={edu.description}
                                onChange={(v) => {
                                  const updated = [...educations];
                                  updated[idx] = { ...edu, description: v };
                                  setEducations(updated);
                                }}
                                placeholder="Algorithms, Database Architecture..."
                                multiline
                                rows={2}
                              />
                            </div>
                          ))}
                        </div>
                        <button
                          onClick={() => setEducations([...educations, { ...emptyEducation }])}
                          className="flex items-center justify-center gap-1.5 w-full py-2 bg-indigo-50 hover:bg-indigo-100/80 text-indigo-700 text-xs font-bold rounded-xl border border-dashed border-indigo-200 transition-colors"
                        >
                          <Plus className="h-4 w-4" />
                          Add Education Entry
                        </button>
                      </div>
                    )}

                    {/* SKILLS TAB */}
                    {activePreviewTab === 'skills' && (
                      <div className="space-y-4">
                        <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                          <h4 className="font-bold text-slate-800 flex items-center gap-2 text-sm">
                            <Code className="h-4.5 w-4.5 text-indigo-600" />
                            Technical Skills
                          </h4>
                        </div>
                        <div className="space-y-3.5 max-h-[45vh] overflow-y-auto pr-1">
                          {skills.map((group, idx) => (
                            <div key={idx} className="p-3 bg-slate-50 border border-slate-100 rounded-xl space-y-2 relative">
                              <button
                                onClick={() => setSkills(skills.filter((_, i) => i !== idx))}
                                className="absolute top-2 right-2 text-slate-400 hover:text-rose-500 transition-colors"
                              >
                                <X className="h-4 w-4" />
                              </button>
                              <input
                                type="text"
                                value={group.category}
                                onChange={(e) => {
                                  const updated = [...skills];
                                  updated[idx] = { ...group, category: e.target.value };
                                  setSkills(updated);
                                }}
                                placeholder="Category (e.g. Backend, Frontend, Cloud)"
                                className="w-[85%] px-2.5 py-1.5 border border-slate-200 bg-white rounded-lg text-xs font-bold text-indigo-800 focus:ring-1 focus:ring-indigo-500"
                              />
                              <input
                                type="text"
                                value={group.items.join(', ')}
                                onChange={(e) => {
                                  const updated = [...skills];
                                  updated[idx] = {
                                    ...group,
                                    items: e.target.value.split(',').map(s => s.trim()).filter(Boolean),
                                  };
                                  setSkills(updated);
                                }}
                                placeholder="Python, JavaScript, Go (comma-separated)"
                                className="w-full px-2.5 py-1.5 border border-slate-200 bg-white rounded-lg text-xs focus:ring-1 focus:ring-indigo-500"
                              />
                            </div>
                          ))}
                        </div>
                        <button
                          onClick={() => setSkills([...skills, { category: '', items: [] }])}
                          className="flex items-center justify-center gap-1.5 w-full py-2 bg-indigo-50 hover:bg-indigo-100/80 text-indigo-700 text-xs font-bold rounded-xl border border-dashed border-indigo-200 transition-colors"
                        >
                          <Plus className="h-4 w-4" />
                          Add Category
                        </button>
                      </div>
                    )}

                    {/* PROJECTS TAB */}
                    {activePreviewTab === 'projects' && (
                      <div className="space-y-4">
                        <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                          <h4 className="font-bold text-slate-800 flex items-center gap-2 text-sm">
                            <BookOpen className="h-4.5 w-4.5 text-indigo-600" />
                            Key Projects
                          </h4>
                          <span className="px-2 py-0.5 text-[10px] font-bold bg-slate-100 text-slate-600 rounded-full">
                            {projects.length} Entries
                          </span>
                        </div>
                        <div className="space-y-4 max-h-[45vh] overflow-y-auto pr-1">
                          {projects.map((proj, idx) => (
                            <div key={idx} className="p-3.5 bg-slate-50 border border-slate-100 rounded-2xl relative space-y-3">
                              <button
                                onClick={() => setProjects(projects.filter((_, i) => i !== idx))}
                                className="absolute top-2.5 right-2.5 text-slate-400 hover:text-rose-500 transition-colors"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pr-6">
                                <FormInput
                                  label="Project Name"
                                  value={proj.name}
                                  onChange={(v) => {
                                    const updated = [...projects];
                                    updated[idx] = { ...proj, name: v };
                                    setProjects(updated);
                                  }}
                                  placeholder="E-commerce Engine"
                                />
                                <FormInput
                                  label="URL"
                                  value={proj.url || ''}
                                  onChange={(v) => {
                                    const updated = [...projects];
                                    updated[idx] = { ...proj, url: v };
                                    setProjects(updated);
                                  }}
                                  placeholder="https://github.com/..."
                                />
                              </div>
                              <FormInput
                                label="Summary"
                                value={proj.description}
                                onChange={(v) => {
                                  const updated = [...projects];
                                  updated[idx] = { ...proj, description: v };
                                  setProjects(updated);
                                }}
                                placeholder="Short core value explanation..."
                                multiline
                                rows={2}
                              />
                              <FormInput
                                label="Technologies (comma-separated)"
                                value={(proj.technologies || []).join(', ')}
                                onChange={(v) => {
                                  const updated = [...projects];
                                  updated[idx] = {
                                    ...proj,
                                    technologies: v.split(',').map(s => s.trim()).filter(Boolean),
                                  };
                                  setProjects(updated);
                                }}
                                placeholder="React, Node.js, Postgres"
                              />
                              <div>
                                <label className="block text-[11px] font-bold text-slate-600 mb-1">
                                  Project Highlights
                                </label>
                                <textarea
                                  value={(proj.highlights || []).join('\n')}
                                  onChange={(e) => {
                                    const updated = [...projects];
                                    updated[idx] = {
                                      ...proj,
                                      highlights: e.target.value.split('\n').filter(h => h.trim() !== ''),
                                    };
                                    setProjects(updated);
                                  }}
                                  placeholder="• Built clean responsive interface serving 5K+ MAU&#10;• Integrated Stripe payment SDK"
                                  rows={3}
                                  className="w-full px-2.5 py-1.5 border border-slate-200 bg-white rounded-xl text-xs focus:ring-2 focus:ring-indigo-500"
                                />
                              </div>
                            </div>
                          ))}
                        </div>
                        <button
                          onClick={() => setProjects([...projects, { ...emptyProject }])}
                          className="flex items-center justify-center gap-1.5 w-full py-2 bg-indigo-50 hover:bg-indigo-100/80 text-indigo-700 text-xs font-bold rounded-xl border border-dashed border-indigo-200 transition-colors"
                        >
                          <Plus className="h-4 w-4" />
                          Add Project Entry
                        </button>
                      </div>
                    )}

                    {/* CERTIFICATIONS TAB */}
                    {activePreviewTab === 'certifications' && (
                      <div className="space-y-4">
                        <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                          <h4 className="font-bold text-slate-800 flex items-center gap-2 text-sm">
                            <Award className="h-4.5 w-4.5 text-indigo-600" />
                            Certs & Languages
                          </h4>
                        </div>
                        <div className="p-3 bg-blue-50/50 rounded-xl border border-blue-100 space-y-1 text-xs">
                          <span className="font-bold text-blue-900 block">Certificate Folder Link (Optional)</span>
                          <input
                            type="url"
                            value={certPortfolioUrl}
                            onChange={(e) => setCertPortfolioUrl(e.target.value)}
                            placeholder="https://drive.google.com/drive/folders/..."
                            className="w-full px-2.5 py-1.5 border border-blue-200 rounded-lg text-xs focus:ring-1 focus:ring-blue-500 bg-white"
                          />
                        </div>
                        <div className="grid grid-cols-1 gap-4 max-h-[40vh] overflow-y-auto pr-1">
                          <div className="space-y-2">
                            <h5 className="font-bold text-slate-700 text-xs">Certifications</h5>
                            {certifications.map((cert, idx) => (
                              <div key={idx} className="p-3 bg-slate-50 border border-slate-100 rounded-xl relative space-y-2">
                                <button
                                  onClick={() => setCertifications(certifications.filter((_, i) => i !== idx))}
                                  className="absolute top-2 right-2 text-slate-400 hover:text-rose-500"
                                >
                                  <X className="h-4 w-4" />
                                </button>
                                <input
                                  type="text"
                                  value={cert.name}
                                  onChange={(e) => {
                                    const updated = [...certifications];
                                    updated[idx] = { ...cert, name: e.target.value };
                                    setCertifications(updated);
                                  }}
                                  placeholder="Certification Name"
                                  className="w-[85%] px-2 py-1.5 border border-slate-200 bg-white rounded-lg text-xs"
                                />
                                <input
                                  type="text"
                                  value={cert.issuer}
                                  onChange={(e) => {
                                    const updated = [...certifications];
                                    updated[idx] = { ...cert, issuer: e.target.value };
                                    setCertifications(updated);
                                  }}
                                  placeholder="Issuer (e.g. AWS)"
                                  className="w-full px-2 py-1.5 border border-slate-200 bg-white rounded-lg text-xs"
                                />
                              </div>
                            ))}
                            <button
                              onClick={() => setCertifications([...certifications, { ...emptyCertification }])}
                              className="flex items-center gap-1 bg-slate-50 px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-600"
                            >
                              <Plus className="h-3.5 w-3.5" /> Add Cert
                            </button>
                          </div>

                          <div className="space-y-2 pt-2 border-t border-slate-100">
                            <h5 className="font-bold text-slate-700 text-xs">Languages</h5>
                            {languages.map((lang, idx) => (
                              <div key={idx} className="flex items-center gap-2 p-2 bg-slate-50 border border-slate-100 rounded-xl">
                                <input
                                  type="text"
                                  value={lang.name}
                                  onChange={(e) => {
                                    const updated = [...languages];
                                    updated[idx] = { ...lang, name: e.target.value };
                                    setLanguages(updated);
                                  }}
                                  placeholder="Language Name"
                                  className="flex-1 px-2 py-1 border border-slate-200 rounded-lg text-xs"
                                />
                                <select
                                  value={lang.proficiency}
                                  onChange={(e) => {
                                    const updated = [...languages];
                                    updated[idx] = { ...lang, proficiency: e.target.value as Language['proficiency'] };
                                    setLanguages(updated);
                                  }}
                                  className="px-1 py-1 border border-slate-200 rounded-lg text-xs bg-white"
                                >
                                  <option value="basic">Basic</option>
                                  <option value="conversational">Conversational</option>
                                  <option value="professional">Professional</option>
                                  <option value="native">Native</option>
                                </select>
                                <button
                                  onClick={() => setLanguages(languages.filter((_, i) => i !== idx))}
                                  className="text-slate-400 hover:text-rose-500"
                                >
                                  <X className="h-4 w-4" />
                                </button>
                              </div>
                            ))}
                            <button
                              onClick={() => setLanguages([...languages, { ...emptyLanguage }])}
                              className="flex items-center gap-1 bg-slate-50 px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-600"
                            >
                              <Plus className="h-3.5 w-3.5" /> Add Language
                            </button>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* CUSTOM ADDITIONAL TAB */}
                    {activePreviewTab === 'custom' && (
                      <div className="space-y-4">
                        <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                          <h4 className="font-bold text-slate-800 flex items-center gap-2 text-sm">
                            <Sparkles className="h-4.5 w-4.5 text-indigo-600" />
                            Additional Listings
                          </h4>
                        </div>
                        <div className="space-y-4 max-h-[45vh] overflow-y-auto pr-1">
                          {customSections.map((section, sIdx) => (
                            <div key={sIdx} className="p-3.5 bg-slate-50 border border-slate-100 rounded-2xl relative space-y-3">
                              <button
                                onClick={() => setCustomSections(customSections.filter((_, i) => i !== sIdx))}
                                className="absolute top-2.5 right-2.5 text-slate-400 hover:text-rose-500"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pr-6">
                                <FormInput
                                  label="Section Title"
                                  value={section.title}
                                  onChange={(v) => {
                                    const u = [...customSections];
                                    u[sIdx] = { ...section, title: v };
                                    setCustomSections(u);
                                  }}
                                  placeholder="Online Profiles, Publications..."
                                />
                                <div>
                                  <label className="block text-[11px] font-bold text-slate-600 mb-1">Display Style</label>
                                  <select
                                    value={section.section_type || 'bullets'}
                                    onChange={(e) => {
                                      const u = [...customSections];
                                      u[sIdx] = { ...section, section_type: e.target.value as CustomSection['section_type'] };
                                      setCustomSections(u);
                                    }}
                                    className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg text-xs bg-white focus:ring-1"
                                  >
                                    <option value="bullets">Bullet List (Title: Detail)</option>
                                    <option value="entries">Entries (Title, Subtitle, Date)</option>
                                    <option value="profiles">Table (Label | URL)</option>
                                  </select>
                                </div>
                              </div>

                              <div className="space-y-2">
                                {section.items.map((item, iIdx) => (
                                  <div key={iIdx} className="p-2.5 bg-white border border-slate-150 rounded-xl relative space-y-1.5">
                                    <button
                                      onClick={() => {
                                        const u = [...customSections];
                                        u[sIdx] = { ...section, items: section.items.filter((_, i) => i !== iIdx) };
                                        setCustomSections(u);
                                      }}
                                      className="absolute top-1.5 right-1.5 text-slate-400 hover:text-rose-500"
                                    >
                                      <X className="h-3 w-3" />
                                    </button>
                                    <div className="grid grid-cols-2 gap-2 pr-4">
                                      <input
                                        type="text"
                                        value={item.title}
                                        placeholder="Title / Label"
                                        onChange={(e) => {
                                          const u = [...customSections];
                                          u[sIdx] = { ...section, items: section.items.map((it, i) => i === iIdx ? { ...it, title: e.target.value } : it) };
                                          setCustomSections(u);
                                        }}
                                        className="px-2 py-1 border border-slate-200 rounded-lg text-xs"
                                      />
                                      <input
                                        type="text"
                                        value={item.subtitle || ''}
                                        placeholder={section.section_type === 'profiles' ? 'URL Link' : 'Date / Subtitle'}
                                        onChange={(e) => {
                                          const u = [...customSections];
                                          u[sIdx] = { ...section, items: section.items.map((it, i) => i === iIdx ? { ...it, subtitle: e.target.value } : it) };
                                          setCustomSections(u);
                                        }}
                                        className="px-2 py-1 border border-slate-200 rounded-lg text-xs"
                                      />
                                    </div>
                                    {section.section_type !== 'profiles' && (
                                      <textarea
                                        value={item.description || ''}
                                        placeholder="Description..."
                                        rows={2}
                                        onChange={(e) => {
                                          const u = [...customSections];
                                          u[sIdx] = { ...section, items: section.items.map((it, i) => i === iIdx ? { ...it, description: e.target.value } : it) };
                                          setCustomSections(u);
                                        }}
                                        className="w-full px-2 py-1 border border-slate-200 rounded-lg text-xs"
                                      />
                                    )}
                                  </div>
                                ))}
                                <button
                                  onClick={() => {
                                    const u = [...customSections];
                                    u[sIdx] = { ...section, items: [...section.items, { title: '', subtitle: '', description: '' }] };
                                    setCustomSections(u);
                                  }}
                                  className="flex items-center gap-1 text-[11px] font-semibold text-indigo-600 bg-indigo-50/50 px-2 py-1 rounded-lg border border-dashed border-indigo-150"
                                >
                                  <Plus className="h-3 w-3" /> Add Item
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                        <button
                          onClick={() => setCustomSections([...customSections, { ...emptyCustomSection }])}
                          className="flex items-center justify-center gap-1.5 w-full py-2 bg-indigo-50 hover:bg-indigo-100/80 text-indigo-700 text-xs font-bold rounded-xl border border-dashed border-indigo-200 transition-colors"
                        >
                          <Plus className="h-4 w-4" />
                          Add Custom Section
                        </button>
                      </div>
                    )}

                    {/* OPTIMIZE / LAYOUT TAB */}
                    {activePreviewTab === 'settings' && (
                      <div className="space-y-4">
                        <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                          <h4 className="font-bold text-slate-800 flex items-center gap-2 text-sm">
                            <Wand2 className="h-4.5 w-4.5 text-indigo-600" />
                            Section Order & AI Matcher
                          </h4>
                        </div>
                        <div className="space-y-3.5 max-h-[48vh] overflow-y-auto pr-1">
                          {/* Layout Order List */}
                          <div className="p-3.5 bg-slate-50 border border-slate-100 rounded-2xl space-y-2.5">
                            <h5 className="font-bold text-slate-700 text-xs flex items-center gap-1.5">
                              <ListOrdered className="h-4 w-4 text-indigo-600" />
                              Section Sorting Order
                            </h5>
                            <div className="space-y-1">
                              {sectionOrder.map((section, idx) => {
                                const sectionLabels: Record<string, string> = {
                                  summary: 'Summary / Profile',
                                  skills: 'Technical Skills Group',
                                  experience: 'Work Experiences',
                                  projects: 'Key Projects',
                                  education: 'Education Details',
                                  certifications: 'Credentials & Certs',
                                  languages: 'Languages Spoken',
                                };
                                return (
                                  <div key={section} className="flex items-center gap-2 p-2 bg-white rounded-xl border border-slate-100 shadow-sm">
                                    <span className="text-[11px] font-bold text-slate-400 w-5 text-center">{idx + 1}</span>
                                    <span className="flex-1 text-[11px] font-bold text-slate-700">{sectionLabels[section] || section}</span>
                                    <div className="flex gap-0.5">
                                      <button
                                        onClick={() => {
                                          if (idx === 0) return;
                                          const newOrder = [...sectionOrder];
                                          [newOrder[idx - 1], newOrder[idx]] = [newOrder[idx], newOrder[idx - 1]];
                                          setSectionOrder(newOrder);
                                        }}
                                        disabled={idx === 0}
                                        className="p-1 rounded hover:bg-slate-50 disabled:opacity-30"
                                      >
                                        <ArrowUp className="h-3 w-3 text-slate-600" />
                                      </button>
                                      <button
                                        onClick={() => {
                                          if (idx === sectionOrder.length - 1) return;
                                          const newOrder = [...sectionOrder];
                                          [newOrder[idx], newOrder[idx + 1]] = [newOrder[idx + 1], newOrder[idx]];
                                          setSectionOrder(newOrder);
                                        }}
                                        disabled={idx === sectionOrder.length - 1}
                                        className="p-1 rounded hover:bg-slate-50 disabled:opacity-30"
                                      >
                                        <ArrowDown className="h-3 w-3 text-slate-600" />
                                      </button>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </div>

                          {/* References toggle */}
                          <div className="flex items-center justify-between p-3 bg-slate-50 border border-slate-100 rounded-2xl text-xs">
                            <div>
                              <p className="font-bold text-slate-700">Include "References available..."</p>
                              <p className="text-[10px] text-slate-400">Adds italics line at bottom.</p>
                            </div>
                            <button
                              onClick={() => setIncludeReferences(!includeReferences)}
                              className={`relative inline-flex h-5 w-10 items-center rounded-full transition-colors flex-shrink-0 ${includeReferences ? 'bg-indigo-600' : 'bg-slate-200'}`}
                            >
                              <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${includeReferences ? 'translate-x-5' : 'translate-x-1'}`} />
                            </button>
                          </div>

                          {/* Instant AI Tailoring Panel */}
                          <div className="p-3.5 bg-purple-50/50 rounded-2xl border border-purple-100/50 space-y-3">
                            <h5 className="font-bold text-purple-900 text-xs flex items-center gap-1.5">
                              <Sparkles className="h-4 w-4 text-purple-600" />
                              Interactive AI Tailoring
                            </h5>
                            <textarea
                              value={jobDescription}
                              onChange={(e) => setJobDescription(e.target.value)}
                              placeholder="Paste the target job description here..."
                              rows={4}
                              className="w-full p-2.5 border border-purple-200 rounded-xl text-xs focus:ring-2 focus:ring-purple-500 bg-white"
                            />
                            <button
                              onClick={handleTailorToJob}
                              disabled={isTailoring || !jobDescription.trim()}
                              className="w-full py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold rounded-xl text-xs shadow-sm transition-all disabled:opacity-50 flex items-center justify-center gap-1.5"
                            >
                              {isTailoring ? (
                                <>
                                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                                  AI Tailoring...
                                </>
                              ) : (
                                <>
                                  <Sparkles className="h-3.5 w-3.5" />
                                  Match & Optimize
                                </>
                              )}
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
              </div>

              {/* Right Column: Sticky Vector PDF Preview Panel */}
              <div className="lg:col-span-7 lg:sticky lg:top-6 space-y-4">
                {/* Visual Sandbox Export Toolbar */}
                <div className="flex flex-wrap items-center justify-between gap-3 bg-white border border-slate-100 rounded-3xl p-3 shadow-lg">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleGenerate}
                      disabled={isCompiling || isGenerating}
                      className={`relative flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-xl border transition-all ${
                        previewOutdated
                          ? 'bg-rose-50 border-rose-200 text-rose-600 hover:bg-rose-100 hover:border-rose-300 ring-2 ring-rose-300 ring-offset-2'
                          : 'bg-indigo-50 border-indigo-100 text-indigo-600 hover:bg-indigo-100'
                      }`}
                    >
                      {isCompiling || isGenerating ? (
                        <Loader2 className="h-3.5 w-3.5 animate-spin text-indigo-600" />
                      ) : (
                        <Sparkles className="h-3.5 w-3.5" />
                      )}
                      Refresh Preview
                      {previewOutdated && (
                        <span className="absolute -top-1 -right-1 flex h-3 w-3">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-3 w-3 bg-rose-500"></span>
                        </span>
                      )}
                    </button>
                    
                    {saveStatus === 'saving' && (
                      <span className="flex items-center gap-1 text-[10px] text-slate-400 animate-pulse bg-slate-50 px-2 py-1 rounded-lg">
                        <Loader2 className="h-3 w-3 animate-spin text-slate-400" />
                        Saving...
                      </span>
                    )}
                    {saveStatus === 'saved' && (
                      <span className="flex items-center gap-1 text-[10px] text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg">
                        <CheckCircle className="h-3 w-3 text-emerald-500" />
                        Autosaved
                      </span>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={handleExportPDF}
                      disabled={isExporting}
                      className="flex items-center gap-1 px-3 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl transition-all shadow-sm"
                    >
                      {isExporting ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Download className="h-3.5 w-3.5" />}
                      Export PDF
                    </button>
                    <button
                      onClick={handleExportDOC}
                      className="flex items-center gap-1 px-3 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold border border-indigo-100 rounded-xl transition-all"
                    >
                      <Download className="h-3.5 w-3.5" />
                      DOC
                    </button>
                    <button
                      onClick={handleExportLaTeX}
                      className="flex items-center gap-1 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-all"
                    >
                      <Download className="h-3.5 w-3.5" />
                      LaTeX
                    </button>
                  </div>
                </div>

                {/* Compilation Status Alert */}
                {compilationError && (
                  <div className="p-3 bg-amber-50 border border-amber-200 rounded-2xl flex items-start gap-2 shadow-sm">
                    <AlertCircle className="h-4.5 w-4.5 text-amber-500 flex-shrink-0 mt-0.5" />
                    <p className="text-[11px] text-amber-800 font-medium leading-relaxed">{compilationError}</p>
                  </div>
                )}

                {/* Main Visual PDF Canvas / Fallback Latex View */}
                <div className="relative bg-white shadow-2xl rounded-3xl border border-slate-100 overflow-hidden min-h-[68vh] flex flex-col animate-fade-in">
                  {isCompiling ? (
                    <div className="flex-1 flex flex-col items-center justify-center py-24 space-y-3 bg-slate-50/50">
                      <Loader2 className="h-8 w-8 text-indigo-600 animate-spin" />
                      <div className="text-center">
                        <p className="text-sm font-semibold text-slate-800">Compiling with pdflatex...</p>
                        <p className="text-xs text-slate-400 mt-1">Applying ATS optimizations & margins</p>
                      </div>
                    </div>
                  ) : compiledPdfUrl ? (
                    <iframe
                      src={compiledPdfUrl}
                      className="w-full flex-1 border-0"
                      style={{ height: '68vh' }}
                      title="Resume Preview Canvas"
                    />
                  ) : latexSource ? (
                    <div className="flex-1 flex flex-col">
                      <div className="p-3 bg-amber-50 border-b border-amber-100 flex items-center justify-between text-xs text-amber-800">
                        <span className="flex items-center gap-1.5 font-semibold">
                          <AlertTriangle className="h-4 w-4 text-amber-500" />
                          LaTeX compiler offline. Displaying text source.
                        </span>
                        <button
                          onClick={handleExportLaTeX}
                          className="font-bold underline hover:text-amber-900"
                        >
                          Download .tex File
                        </button>
                      </div>
                      <pre className="flex-1 p-5 text-[10px] font-mono text-slate-800 bg-slate-50 overflow-auto whitespace-pre-wrap">
                        {latexSource}
                      </pre>
                    </div>
                  ) : (
                    <div className="flex-1 flex flex-col items-center justify-center py-20 text-slate-400 bg-slate-50/50">
                      <FileText className="h-12 w-12 text-slate-300 mb-2" />
                      <p className="text-sm font-medium">No preview canvas generated</p>
                      <button
                        onClick={handleGenerate}
                        className="mt-4 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm"
                      >
                        Generate Preview
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
