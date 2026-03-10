import React, { useState, useRef, useCallback, useEffect } from 'react';
import {
  FileText, Upload, ChevronDown, ChevronUp, Plus, Trash2, X,
  Download, Loader2, Sparkles, Briefcase, GraduationCap,
  Code, Award, Languages, User, CheckCircle, AlertCircle,
  Eye, Wand2, ClipboardPaste, ArrowUp, ArrowDown, ArrowLeft, ListOrdered
} from 'lucide-react';
import api from '../lib/api';
import aiApi from '../lib/ai-api';
import { generateLaTeX, downloadLaTeX, getRecommendedTemplate, getDefaultSectionOrder, type ResumeSection } from '../lib/latex-generator';
import type { CV, CVTargetRole, PersonalInfo, Education, Experience, Skill, Language, Certification, Project } from '../lib/database.types';

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

// ============================================
// STEP TYPE
// ============================================
type Step = 'input-method' | 'form' | 'job-role' | 'job-description' | 'preview';

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

  // Form data
  const [personalInfo, setPersonalInfo] = useState<PersonalInfo>({ ...emptyPersonalInfo });
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [educations, setEducations] = useState<Education[]>([]);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [certifications, setCertifications] = useState<Certification[]>([]);
  const [languages, setLanguages] = useState<Language[]>([]);

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
          setSkills(
            d.skills.map((s) => ({
              name: s.name || '',
              level: s.level || 3,
              category: s.category || 'technical',
            }))
          );
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
      skills: skills,
      languages: languages,
      certifications: certifications,
      projects: projects,
      accent_color: '#4F46E5',
      is_grayscale: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
  }, [personalInfo, experiences, educations, skills, projects, certifications, languages, selectedRole, customRole, isCustomRole]);

  const handleGenerate = async () => {
    setIsGenerating(true);
    setCompilationError(null);
    try {
      const cv = buildCV();
      setGeneratedCV(cv);

      // Generate LaTeX as single source of truth
      const latex = generateLaTeX(cv, { template: cv.template }, sectionOrder);
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
        skills: cv.skills.map((s) => s.name),
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

      // Apply the tailored data back
      const tailored = result.tailored_cv as Record<string, unknown>;
      if (tailored) {
        // Update summary if available
        if (tailored.summary && typeof tailored.summary === 'string') {
          setPersonalInfo((prev) => ({ ...prev, summary: tailored.summary as string }));
        }
        if (tailored.personal_info && typeof tailored.personal_info === 'object') {
          const tpi = tailored.personal_info as Record<string, string>;
          if (tpi.summary) {
            setPersonalInfo((prev) => ({ ...prev, summary: tpi.summary }));
          }
        }
        // Update experience if available
        if (Array.isArray(tailored.experience)) {
          setExperiences(
            (tailored.experience as Record<string, unknown>[]).map((e) => ({
              title: (e.title as string) || '',
              company: (e.company as string) || '',
              location: (e.location as string) || '',
              start_date: (e.start_date as string) || '',
              end_date: (e.end_date as string) || '',
              current: (e.current as boolean) || false,
              description: (e.description as string) || '',
              achievements: (e.achievements as string[]) || [],
            }))
          );
        }
        // Update skills if available
        if (Array.isArray(tailored.skills)) {
          const newSkills = (tailored.skills as (string | Record<string, unknown>)[]).map((s) => {
            if (typeof s === 'string') {
              return { name: s, level: 3, category: 'technical' };
            }
            return {
              name: (s as Record<string, unknown>).name as string || '',
              level: (s as Record<string, unknown>).level as number || 3,
              category: (s as Record<string, unknown>).category as string || 'technical',
            };
          });
          setSkills(newSkills);
        }
      }

      // Now generate the preview with tailored data
      const updatedCV = buildCV();
      setGeneratedCV(updatedCV);

      // Generate LaTeX as single source of truth
      const latex = generateLaTeX(updatedCV, { template: updatedCV.template }, sectionOrder);
      setLatexSource(latex);

      // Compile LaTeX to PDF
      try {
        setIsCompiling(true);
        const pdfBlob = await api.compileLaTeX(latex, updatedCV.personal_info.full_name || 'resume');
        if (compiledPdfUrl) URL.revokeObjectURL(compiledPdfUrl);
        setCompiledPdfUrl(URL.createObjectURL(pdfBlob));
      } catch {
        // Fallback to FPDF2
        try {
          const pdfBlob = await api.exportPDF({
            template: updatedCV.template,
            target_role: updatedCV.target_role,
            personal_info: updatedCV.personal_info,
            education: updatedCV.education,
            experience: updatedCV.experience,
            skills: updatedCV.skills,
            languages: updatedCV.languages,
            certifications: updatedCV.certifications,
            projects: updatedCV.projects,
            accent_color: updatedCV.accent_color,
            is_grayscale: updatedCV.is_grayscale,
          });
          if (compiledPdfUrl) URL.revokeObjectURL(compiledPdfUrl);
          setCompiledPdfUrl(URL.createObjectURL(pdfBlob));
        } catch {
          setCompiledPdfUrl(null);
        }
      } finally {
        setIsCompiling(false);
      }

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
        const latex = latexSource || generateLaTeX(generatedCV, { template: generatedCV.template }, sectionOrder);
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
        const byCategory = cv.skills.reduce((acc, s) => { const c = s.category || 'Other'; if (!acc[c]) acc[c] = []; acc[c].push(s.name); return acc; }, {} as Record<string, string[]>);
        return `<h2 style="text-transform:uppercase;border-bottom:1px solid #000;padding-bottom:3px;margin-bottom:6px;">TECHNICAL SKILLS</h2>` +
          Object.entries(byCategory).map(([cat, skills]) => `<p><strong>${cat}:</strong> ${skills.join(', ')}</p>`).join('');
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
    downloadLaTeX(generatedCV, generatedCV.target_role, {}, sectionOrder);
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
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <div className="p-2.5 bg-indigo-100 rounded-xl">
              <FileText className="h-7 w-7 text-indigo-600" />
            </div>
            ATS Resume Builder
          </h1>
          <p className="mt-2 text-gray-600">
            Build an ATS-optimized resume tailored to your target job role. Fill in your details or upload an existing resume.
          </p>
        </div>
      </div>

      {/* Step Indicator */}
      <div className="max-w-6xl mx-auto px-4 py-6">
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
                      ? 'bg-indigo-100 text-indigo-700 hover:bg-indigo-200 cursor-pointer'
                      : 'bg-gray-100 text-gray-400 cursor-default'
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
                      i < currentStepIndex ? 'bg-indigo-400' : 'bg-gray-200'
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
            <h2 className="text-xl font-semibold text-gray-800 text-center">
              How would you like to provide your information?
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Manual Entry */}
              <button
                onClick={() => {
                  setInputMethod('manual');
                  setCurrentStep('form');
                }}
                className={`p-8 rounded-2xl border-2 transition-all text-left hover:shadow-lg ${
                  inputMethod === 'manual'
                    ? 'border-indigo-500 bg-indigo-50'
                    : 'border-gray-200 hover:border-indigo-300'
                }`}
              >
                <div className="p-3 bg-indigo-100 rounded-xl w-fit mb-4">
                  <User className="h-8 w-8 text-indigo-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Enter Manually
                </h3>
                <p className="text-sm text-gray-600">
                  Fill out a form with your personal info, experience, education, skills, and projects.
                </p>
              </button>

              {/* Upload Existing */}
              <div
                className={`p-8 rounded-2xl border-2 transition-all text-left hover:shadow-lg ${
                  inputMethod === 'upload'
                    ? 'border-indigo-500 bg-indigo-50'
                    : 'border-gray-200 hover:border-indigo-300'
                }`}
              >
                <div className="p-3 bg-purple-100 rounded-xl w-fit mb-4">
                  <Upload className="h-8 w-8 text-purple-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Upload Existing Resume
                </h3>
                <p className="text-sm text-gray-600 mb-4">
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
                  className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center cursor-pointer hover:border-indigo-400 hover:bg-indigo-50/50 transition-all"
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
                      <Loader2 className="h-8 w-8 text-indigo-600 animate-spin mx-auto" />
                      <p className="text-sm text-gray-600">Parsing your document...</p>
                    </div>
                  ) : uploadSuccess ? (
                    <div className="space-y-2">
                      <CheckCircle className="h-8 w-8 text-green-500 mx-auto" />
                      <p className="text-sm text-green-600 font-medium">
                        Successfully extracted! Proceeding...
                      </p>
                    </div>
                  ) : (
                    <>
                      <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-600">
                        Drag & drop or <span className="text-indigo-600 font-medium">browse</span>
                      </p>
                      <div className="flex gap-2 justify-center mt-2">
                        <span className="px-2 py-0.5 text-xs bg-gray-100 rounded">PDF</span>
                        <span className="px-2 py-0.5 text-xs bg-gray-100 rounded">DOC</span>
                        <span className="px-2 py-0.5 text-xs bg-gray-100 rounded">DOCX</span>
                      </div>
                    </>
                  )}
                </div>
                {uploadError && (
                  <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
                    <AlertCircle className="h-4 w-4 text-red-500 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-red-600">{uploadError}</p>
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

            {/* Skills */}
            <CollapsibleSection
              title="Skills"
              icon={Code}
              badge={skills.length > 0 ? `${skills.length}` : undefined}
            >
              <div className="space-y-2">
                {skills.map((skill, idx) => (
                  <div key={idx} className="flex items-center gap-3 p-2 bg-gray-50 rounded-lg">
                    <input
                      type="text"
                      value={skill.name}
                      onChange={(e) => {
                        const updated = [...skills];
                        updated[idx] = { ...skill, name: e.target.value };
                        setSkills(updated);
                      }}
                      placeholder="Skill name"
                      className="flex-1 px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500"
                    />
                    <select
                      value={skill.category}
                      onChange={(e) => {
                        const updated = [...skills];
                        updated[idx] = { ...skill, category: e.target.value };
                        setSkills(updated);
                      }}
                      className="px-2 py-1.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500"
                    >
                      <option value="technical">Technical</option>
                      <option value="soft">Soft Skills</option>
                      <option value="tools">Tools</option>
                      <option value="languages">Languages</option>
                      <option value="frameworks">Frameworks</option>
                    </select>
                    <select
                      value={skill.level}
                      onChange={(e) => {
                        const updated = [...skills];
                        updated[idx] = { ...skill, level: parseInt(e.target.value) };
                        setSkills(updated);
                      }}
                      className="px-2 py-1.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500"
                    >
                      <option value={1}>Beginner</option>
                      <option value={2}>Elementary</option>
                      <option value={3}>Intermediate</option>
                      <option value={4}>Advanced</option>
                      <option value={5}>Expert</option>
                    </select>
                    <button
                      onClick={() => setSkills(skills.filter((_, i) => i !== idx))}
                      className="text-gray-400 hover:text-red-500"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
              {/* Quick add skills */}
              <div className="flex gap-2">
                <input
                  type="text"
                  id="quick-skill-input"
                  placeholder="Type a skill and press Enter"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      const input = e.currentTarget;
                      if (input.value.trim()) {
                        setSkills([...skills, { name: input.value.trim(), level: 3, category: 'technical' }]);
                        input.value = '';
                      }
                    }
                  }}
                />
                <button
                  onClick={() => {
                    const input = document.getElementById('quick-skill-input') as HTMLInputElement;
                    if (input?.value.trim()) {
                      setSkills([...skills, { name: input.value.trim(), level: 3, category: 'technical' }]);
                      input.value = '';
                    }
                  }}
                  className="px-4 py-2 text-sm font-medium text-indigo-600 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition-colors"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
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

            {/* Navigation */}
            <div className="flex justify-between items-center pt-4">
              <button
                onClick={() => setCurrentStep('input-method')}
                className="px-6 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Back
              </button>
              <div className="flex items-center gap-3">
                {generatedCV && (
                  <button
                    onClick={() => setCurrentStep('preview')}
                    className="flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-indigo-600 border border-indigo-300 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition-colors"
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
            <h2 className="text-xl font-semibold text-gray-800 text-center">
              What job role are you applying for?
            </h2>
            <p className="text-center text-gray-600 text-sm">
              Select a role to optimize your resume's keywords, section order, and formatting for ATS scanners.
            </p>

            {/* Role dropdown grouped by category */}
            <div className="space-y-4">
              {JOB_ROLE_CATEGORIES.map((category) => (
                <div key={category.label}>
                  <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
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
                            ? 'bg-indigo-600 text-white shadow-md ring-2 ring-indigo-300'
                            : 'bg-white border border-gray-200 text-gray-700 hover:border-indigo-300 hover:bg-indigo-50'
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
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
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
                        ? 'bg-purple-600 text-white shadow-md ring-2 ring-purple-300'
                        : 'bg-white border border-gray-200 text-gray-700 hover:border-purple-300 hover:bg-purple-50'
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
                      className="flex-1 px-4 py-3 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
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
                className="px-6 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
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
            <h2 className="text-xl font-semibold text-gray-800 text-center">
              Customize for a Specific Job?
            </h2>
            <p className="text-center text-gray-600 text-sm">
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
                className="px-6 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
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
          <div className="space-y-6">
            {/* Tailor Results */}
            {tailorResult && (
              <div className="max-w-4xl mx-auto bg-gradient-to-r from-purple-50 to-indigo-50 rounded-2xl border border-indigo-200 p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Sparkles className="h-5 w-5 text-purple-600" />
                  <h3 className="font-semibold text-gray-900">AI Tailoring Results</h3>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-bold ${
                      tailorResult.match_score >= 80
                        ? 'bg-green-100 text-green-700'
                        : tailorResult.match_score >= 60
                        ? 'bg-yellow-100 text-yellow-700'
                        : 'bg-red-100 text-red-700'
                    }`}
                  >
                    {tailorResult.match_score}% Match
                  </span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Required Skills Found</h4>
                    <div className="flex flex-wrap gap-1">
                      {tailorResult.job_analysis.required_skills.slice(0, 8).map((s, i) => (
                        <span key={i} className="px-2 py-0.5 text-xs bg-green-100 text-green-700 rounded-full">
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-2">ATS Keywords</h4>
                    <div className="flex flex-wrap gap-1">
                      {tailorResult.job_analysis.ats_keywords.slice(0, 8).map((k, i) => (
                        <span key={i} className="px-2 py-0.5 text-xs bg-blue-100 text-blue-700 rounded-full">
                          {k}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Optimizations Made</h4>
                    <ul className="text-xs text-gray-600 space-y-1">
                      {tailorResult.optimizations_made.slice(0, 4).map((o, i) => (
                        <li key={i} className="flex items-start gap-1">
                          <CheckCircle className="h-3 w-3 text-green-500 flex-shrink-0 mt-0.5" />
                          {o}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {/* Export Toolbar */}
            <div className="max-w-4xl mx-auto flex flex-wrap items-center justify-between gap-3 bg-white rounded-xl border border-gray-200 p-4">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setCurrentStep('job-description')}
                  className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back to Customize
                </button>
                <button
                  onClick={() => setCurrentStep('form')}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Edit Details
                </button>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleExportPDF}
                  disabled={isExporting}
                  className="flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50"
                >
                  {isExporting ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Download className="h-4 w-4" />
                  )}
                  Export PDF
                </button>
                <button
                  onClick={handleExportDOC}
                  className="flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-indigo-600 border border-indigo-300 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition-colors"
                >
                  <Download className="h-4 w-4" />
                  Export DOC
                </button>
                <button
                  onClick={handleExportLaTeX}
                  className="flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-gray-700 border border-gray-300 bg-white rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <Download className="h-4 w-4" />
                  Export LaTeX
                </button>
              </div>
            </div>

            {/* Compilation Status */}
            {compilationError && (
              <div className="max-w-4xl mx-auto p-3 bg-amber-50 border border-amber-200 rounded-lg flex items-start gap-2">
                <AlertCircle className="h-4 w-4 text-amber-500 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-amber-700">{compilationError}</p>
              </div>
            )}

            {/* PDF Preview */}
            <div className="max-w-4xl mx-auto">
              {isCompiling ? (
                <div className="bg-white shadow-xl rounded-xl border border-gray-200 flex items-center justify-center" style={{ minHeight: '842px' }}>
                  <div className="text-center space-y-3">
                    <Loader2 className="h-8 w-8 text-indigo-600 animate-spin mx-auto" />
                    <p className="text-sm text-gray-600">Compiling LaTeX to PDF...</p>
                  </div>
                </div>
              ) : compiledPdfUrl ? (
                <div
                  ref={previewRef}
                  className="bg-white shadow-xl rounded-xl border border-gray-200 overflow-hidden"
                >
                  <iframe
                    src={compiledPdfUrl}
                    className="w-full border-0"
                    style={{ height: '1100px' }}
                    title="Resume Preview - PDF"
                  />
                </div>
              ) : latexSource ? (
                <div className="bg-white shadow-xl rounded-xl border border-gray-200 overflow-hidden">
                  <div className="p-4 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">LaTeX Source (PDF compilation unavailable)</span>
                    <button
                      onClick={handleExportLaTeX}
                      className="text-sm text-indigo-600 hover:text-indigo-700 font-medium"
                    >
                      Download .tex
                    </button>
                  </div>
                  <pre className="p-6 text-xs overflow-auto font-mono text-gray-800 bg-gray-50" style={{ maxHeight: '842px' }}>
                    {latexSource}
                  </pre>
                </div>
              ) : null}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
