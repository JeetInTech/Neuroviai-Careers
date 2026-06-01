import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import api from '../lib/api';
import aiApi from '../lib/ai-api';
import type { CV } from '../lib/database.types';
import DocumentUpload from '../components/DocumentUpload';
import { getFullTemplatePreview } from '../components/templatePreviewHelpers';
import { 
  FileText, 
  Plus, 
  Eye, 
  Trash2, 
  AlertCircle, 
  Sparkles, 
  Target,
  Clock,
  Code,
  Briefcase,
  Upload,
  Search,
  X,
  Download,
  Loader2,
  Zap,
  CheckCircle,
  ChevronDown,
  ChevronUp,
  FileUp,
  Edit3,
  FileDown,
  Terminal,
  BarChart3,
  Palette
} from 'lucide-react';

// ============================================
// CATEGORY CONFIGURATION
// ============================================

const TEMPLATE_CATEGORIES = [
  { id: 'Engineering & Tech', icon: Terminal, color: 'from-blue-500 to-indigo-600' },
  { id: 'Data & AI', icon: BarChart3, color: 'from-emerald-500 to-teal-600' },
  { id: 'Creative', icon: Palette, color: 'from-fuchsia-500 to-pink-600' },
  { id: 'Business & Management', icon: Briefcase, color: 'from-amber-500 to-orange-600' },
  { id: 'General', icon: FileText, color: 'from-gray-500 to-slate-600' },
];

// ============================================
// CV TEMPLATES - Role-focused (25+ templates)
// ============================================

const CV_TEMPLATES = [
  // === ENGINEERING & TECH (3 templates) ===
  {
    id: 'software-engineer',
    name: 'Software Engineer',
    color: 'from-blue-500 to-indigo-600',
    description: 'Optimized for tech roles with emphasis on skills and projects',
    targetRole: 'software-engineer' as const,
    category: 'Engineering & Tech',
    premium: false,
  },
  {
    id: 'mobile-app-developer',
    name: 'Mobile App Developer',
    color: 'from-green-500 to-emerald-600',
    description: 'Showcase iOS/Android apps and store deployments',
    targetRole: 'mobile-app-developer' as const,
    category: 'Engineering & Tech',
    premium: false,
  },
  {
    id: 'systems-engineer',
    name: 'Systems Engineer',
    color: 'from-slate-500 to-gray-700',
    description: 'Infrastructure, DevOps, and cloud architecture',
    targetRole: 'systems-engineer' as const,
    category: 'Engineering & Tech',
    premium: false,
  },
  {
    id: 'devops-engineer',
    name: 'DevOps Engineer',
    color: 'from-orange-500 to-red-600',
    description: 'CI/CD, cloud infrastructure, and reliability',
    targetRole: 'devops-engineer' as const,
    category: 'Engineering & Tech',
    premium: false,
  },
  // === DATA & AI (2 templates) ===
  {
    id: 'data-scientist',
    name: 'Data Scientist',
    color: 'from-purple-500 to-pink-600',
    description: 'Highlight analytics skills, tools, and methodologies',
    targetRole: 'data-scientist' as const,
    category: 'Data & AI',
    premium: false,
  },
  {
    id: 'ai-ml-engineer',
    name: 'AI/ML Engineer',
    color: 'from-teal-500 to-cyan-600',
    description: 'Focus on ML frameworks, models, and research',
    targetRole: 'ai-ml-engineer' as const,
    category: 'Data & AI',
    premium: false,
  },
  // === BUSINESS & MANAGEMENT (3 templates) ===
  {
    id: 'project-manager',
    name: 'Project Manager',
    color: 'from-amber-500 to-orange-600',
    description: 'Delivery metrics, PMP certifications, and Agile',
    targetRole: 'project-manager' as const,
    category: 'Business & Management',
    premium: false,
  },
  {
    id: 'business-analyst',
    name: 'Business Analyst',
    color: 'from-emerald-500 to-teal-600',
    description: 'Requirements analysis and data-driven insights',
    targetRole: 'business-analyst' as const,
    category: 'Business & Management',
    premium: false,
  },
  {
    id: 'marketing',
    name: 'Marketing Professional',
    color: 'from-violet-500 to-fuchsia-600',
    description: 'Campaign ROI, growth metrics, and brand strategy',
    targetRole: 'marketing' as const,
    category: 'Business & Management',
    premium: false,
  },
  // === CREATIVE (5 templates) ===
  {
    id: 'creative',
    name: 'Creative',
    color: 'from-pink-400 to-purple-500',
    description: 'Gradient-styled layout for creative professionals',
    targetRole: 'creative' as const,
    category: 'Creative',
    premium: false,
  },

  {
    id: 'graphic-designer',
    name: 'Graphic Designer',
    color: 'from-indigo-500 to-purple-600',
    description: 'ATS-safe design portfolio showcase',
    targetRole: 'graphic-designer' as const,
    category: 'Creative',
    premium: false,
  },
  {
    id: 'video-editor',
    name: 'Video Editor',
    color: 'from-red-500 to-rose-600',
    description: 'Showcase editing reels, tools, and production work',
    targetRole: 'video-editor' as const,
    category: 'Creative',
    premium: false,
  },
  {
    id: 'content-writer',
    name: 'Content Writer',
    color: 'from-pink-500 to-rose-600',
    description: 'SEO content, blogs, and copywriting',
    targetRole: 'content-writer' as const,
    category: 'Creative',
    premium: false,
  },
  // === GENERAL (5 templates) ===
  {
    id: 'professional',
    name: 'Professional',
    color: 'from-blue-600 to-blue-800',
    description: 'Clean, classic layout suitable for any industry',
    targetRole: 'professional' as const,
    category: 'General',
    premium: false,
  },
  {
    id: 'minimal',
    name: 'Minimal',
    color: 'from-gray-400 to-gray-600',
    description: 'Simple, elegant design with focus on content',
    targetRole: 'minimal' as const,
    category: 'General',
    premium: false,
  },
  {
    id: 'fresher',
    name: 'Fresher / Student',
    color: 'from-cyan-500 to-blue-600',
    description: 'Highlight education, projects, and internships',
    targetRole: 'fresher' as const,
    category: 'General',
    premium: false,
  },
  {
    id: 'freelancer',
    name: 'Freelancer',
    color: 'from-pink-500 to-rose-600',
    description: 'Client-focused with portfolio highlights',
    targetRole: 'freelancer' as const,
    category: 'General',
    premium: false,
  },
  {
    id: 'executive',
    name: 'Executive',
    color: 'from-gray-700 to-slate-800',
    description: 'Leadership, strategic planning, and P&L',
    targetRole: 'executive' as const,
    category: 'General',
    premium: false,
  },
  {
    id: 'academic',
    name: 'Academic / Research',
    color: 'from-gray-600 to-gray-800',
    description: 'Publications, grants, and research interests',
    targetRole: 'academic' as const,
    category: 'General',
    premium: false,
  },
];

// ============================================
// COMPONENT
// ============================================

export default function CVMaker() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [cvs, setCVs] = useState<CV[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [creatingTemplateId, setCreatingTemplateId] = useState<string | null>(null);
  const [downloadingCvId, setDownloadingCvId] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [showUpload, setShowUpload] = useState(false);
  
  // Template filtering state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // AI Resume Tailoring states
  const [jobDescription, setJobDescription] = useState('');
  const [jobTitle, setJobTitle] = useState('');
  const [selectedCVForTailoring, setSelectedCVForTailoring] = useState<string>('');
  const [isTailoring, setIsTailoring] = useState(false);
  const [tailoringResult, setTailoringResult] = useState<{
    tailored_cv: Record<string, unknown>;
    match_score: number;
    job_analysis: {
      required_skills: string[];
      ats_keywords: string[];
      key_responsibilities: string[];
    };
    optimizations_made: string[];
  } | null>(null);
  const [tailoringError, setTailoringError] = useState<string | null>(null);
  const [showJobAnalysis, setShowJobAnalysis] = useState(false);
  const [uploadedParsedData, setUploadedParsedData] = useState<Record<string, unknown> | null>(null);
  const [uploadingForTailoring, setUploadingForTailoring] = useState(false);
  const [tailoredCvId, setTailoredCvId] = useState<string | null>(null);
  const [showExportOptions, setShowExportOptions] = useState(false);
  const [exportingTailored, setExportingTailored] = useState(false);

  // Handle extracted data from document upload
  const handleDocumentData = async (data: {
    personal_info: Record<string, unknown>;
    experience: Array<Record<string, unknown>>;
    education: Array<Record<string, unknown>>;
    skills: Array<Record<string, unknown>>;
    projects: Array<Record<string, unknown>>;
  }) => {
    // TODO: Re-enable auth gate for production
    // if (!user) return;
    
    try {
      setCreating(true);
      setError('');
      
      // Create a new CV with the extracted data
      const result = await api.createCV({
        template: 'tech-focused',
        target_role: 'software-engineer',
        personal_info: {
          full_name: (data.personal_info.full_name as string) || '',
          email: (data.personal_info.email as string) || user?.email || '',
          phone: (data.personal_info.phone as string) || '',
          address: (data.personal_info.address as string) || '',
          summary: (data.personal_info.summary as string) || '',
          linkedin_url: (data.personal_info.linkedin_url as string) || '',
          github_url: (data.personal_info.github_url as string) || '',
        },
        education: data.education.map(edu => ({
          degree: (edu.degree as string) || '',
          field_of_study: (edu.field_of_study as string) || '',
          institution: (edu.institution as string) || '',
          location: (edu.location as string) || '',
          start_date: (edu.start_date as string) || '',
          end_date: (edu.end_date as string) || '',
          gpa: (edu.gpa as string) || '',
          description: (edu.description as string) || '',
          achievements: (edu.achievements as string[]) || [],
        })),
        experience: data.experience.map(exp => ({
          title: (exp.title as string) || '',
          company: (exp.company as string) || '',
          location: (exp.location as string) || '',
          start_date: (exp.start_date as string) || '',
          end_date: (exp.end_date as string) || '',
          current: (exp.current as boolean) || false,
          description: (exp.description as string) || '',
          achievements: (exp.achievements as string[]) || [],
          keywords: [],
        })),
        skills: data.skills.map(skill => ({
          name: (skill.name as string) || '',
          level: (skill.level as number) || 3,
          category: (skill.category as string) || 'technical',
        })),
        projects: data.projects.map(proj => ({
          name: (proj.name as string) || '',
          description: (proj.description as string) || '',
          technologies: (proj.technologies as string[]) || [],
          url: (proj.url as string) || '',
          github_url: (proj.github_url as string) || '',
          highlights: (proj.highlights as string[]) || [],
        })),
        languages: [],
        certifications: [],
      });

      if (result.success && result.cv) {
        navigate(`/cv/edit/${result.cv.id}`);
      } else {
        throw new Error('Failed to create CV');
      }
    } catch (error) {
      console.error('Error creating CV from document:', error);
      setError('Failed to create resume from document. Please try again.');
    } finally {
      setCreating(false);
      setShowUpload(false);
    }
  };

  // Load user's CVs
  useEffect(() => {
    // TODO: Re-enable auth gate for production
    // if (!user) return;

    const loadCVs = async () => {
      try {
        const result = await api.listMyCVs();
        setCVs((result.cvs || []) as unknown as CV[]);
      } catch (error) {
        console.error('Error loading CVs:', error);
        // Don't show error if user just isn't logged in
        if (user) {
          setError('Failed to load your resumes. Please try again.');
        }
      } finally {
        setLoading(false);
      }
    };

    loadCVs();
  }, [user]);

  // Create new CV from template
  const handleCreateCV = async (templateId: string, targetRole: string) => {
    // TODO: Re-enable auth gate for production
    // if (!user) return;

    try {
      setCreating(true);
      setCreatingTemplateId(templateId);
      setError('');

      const template = CV_TEMPLATES.find(t => t.id === templateId);
      if (!template) throw new Error('Template not found');

      const result = await api.createCV({
        template: templateId,
        target_role: targetRole,
        personal_info: {
          full_name: '',
          email: user?.email || '',
          phone: '',
          address: '',
          summary: '',
        },
        education: [],
        experience: [],
        skills: [],
        languages: [],
        certifications: [],
        projects: [],
      });

      if (result.success && result.cv) {
        navigate(`/cv/edit/${result.cv.id}`);
      } else {
        throw new Error('Failed to create CV');
      }
    } catch (error) {
      console.error('Error creating CV:', error);
      setError('Failed to create resume. Please try again.');
    } finally {
      setCreating(false);
      setCreatingTemplateId(null);
    }
  };

  // Delete CV
  const handleDeleteCV = async (cvId: string) => {
    try {
      setError('');
      await api.deleteCV(cvId);
      setCVs(cvs.filter(cv => cv.id !== cvId));
      setDeleteConfirm(null);
    } catch (error) {
      console.error('Error deleting CV:', error);
      setError('Failed to delete resume. Please try again.');
    }
  };

  // Download CV as PDF using backend API (real PDF with selectable text)
  const handleDownloadPDF = async (cv: CV) => {
    try {
      setDownloadingCvId(cv.id);
      
      // Use backend API for proper PDF generation with selectable text and links
      const pdfBlob = await api.exportPDFById(cv.id);
      
      // Create download link
      const url = window.URL.createObjectURL(pdfBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${cv.personal_info.full_name || 'cv'}_resume.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
    } catch (error) {
      console.error('Error generating PDF:', error);
      setError('Failed to download PDF. Please try again.');
    } finally {
      setDownloadingCvId(null);
    }
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  // Handle PDF upload for AI tailoring
  const handleUploadForTailoring = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (!validTypes.includes(file.type)) {
      setTailoringError('Please upload a PDF or Word document');
      return;
    }

    try {
      setUploadingForTailoring(true);
      setTailoringError(null);

      const parseResult = await api.parseDocument(file);
      
      if (parseResult.success && parseResult.data) {
        setUploadedParsedData(parseResult.data as Record<string, unknown>);
        setSelectedCVForTailoring('uploaded');
      } else {
        throw new Error('Failed to parse document');
      }
    } catch (error) {
      console.error('Error uploading for tailoring:', error);
      setTailoringError(error instanceof Error ? error.message : 'Failed to parse uploaded resume');
    } finally {
      setUploadingForTailoring(false);
    }
  };

  // AI Resume Tailoring handler
  const handleTailorResume = async () => {
    if (!jobDescription.trim()) {
      setTailoringError('Please enter a job description');
      return;
    }

    if (!selectedCVForTailoring && !uploadedParsedData) {
      setTailoringError('Please select a resume or upload one');
      return;
    }

    setIsTailoring(true);
    setTailoringError(null);
    setTailoringResult(null);
    setTailoredCvId(null);

    try {
      let cvDataToTailor: Record<string, unknown>;
      
      if (selectedCVForTailoring === 'uploaded' && uploadedParsedData) {
        cvDataToTailor = uploadedParsedData;
      } else {
        cvDataToTailor = await api.getCV(selectedCVForTailoring) as unknown as Record<string, unknown>;
      }

      const result = await aiApi.tailorResumeToJob(
        cvDataToTailor,
        jobDescription,
        jobTitle || undefined
      );
      setTailoringResult(result);
    } catch (error) {
      console.error('Error tailoring resume:', error);
      setTailoringError(error instanceof Error ? error.message : 'Failed to tailor resume. Please try again.');
    } finally {
      setIsTailoring(false);
    }
  };

  // Create tailored CV and navigate to edit
  const handleGoToEdit = async () => {
    if (!tailoringResult) return;

    try {
      setCreating(true);
      const tailoredData = tailoringResult.tailored_cv as {
        personal_info?: Record<string, string>;
        education?: unknown[];
        experience?: unknown[];
        skills?: unknown[];
        languages?: unknown[];
        certifications?: unknown[];
        projects?: unknown[];
      };
      const response = await api.createCV({
        template: 'professional',
        target_role: jobTitle || 'other',
        personal_info: {
          full_name: tailoredData.personal_info?.full_name || '',
          email: tailoredData.personal_info?.email || user?.email || '',
          phone: tailoredData.personal_info?.phone || '',
          address: tailoredData.personal_info?.address || '',
          summary: tailoredData.personal_info?.summary || '',
          linkedin_url: tailoredData.personal_info?.linkedin_url,
          github_url: tailoredData.personal_info?.github_url,
        },
        education: tailoredData.education as never[],
        experience: tailoredData.experience as never[],
        skills: tailoredData.skills as never[],
        languages: tailoredData.languages as never[],
        certifications: tailoredData.certifications as never[],
        projects: tailoredData.projects as never[],
      });

      if (response.success && response.cv) {
        setCVs(prev => [response.cv as unknown as CV, ...prev]);
        setTailoredCvId(response.cv.id);
        navigate(`/cv/edit/${response.cv.id}`);
      }
    } catch (error) {
      console.error('Error creating tailored CV:', error);
      setTailoringError('Failed to save tailored resume');
    } finally {
      setCreating(false);
    }
  };

  // Export tailored CV directly
  const handleExportTailored = async (format: 'pdf' | 'docx' | 'latex') => {
    if (!tailoringResult) return;

    try {
      setExportingTailored(true);
      
      // First create the CV if not already created
      let cvToExport: CV;
      if (tailoredCvId) {
        cvToExport = await api.getCV(tailoredCvId) as unknown as CV;
      } else {
        const tailoredData = tailoringResult.tailored_cv as {
          personal_info?: Record<string, string>;
          education?: unknown[];
          experience?: unknown[];
          skills?: unknown[];
          languages?: unknown[];
          certifications?: unknown[];
          projects?: unknown[];
        };
        const response = await api.createCV({
          template: 'professional',
          target_role: jobTitle || 'other',
          personal_info: {
            full_name: tailoredData.personal_info?.full_name || '',
            email: tailoredData.personal_info?.email || user?.email || '',
            phone: tailoredData.personal_info?.phone || '',
            address: tailoredData.personal_info?.address || '',
            summary: tailoredData.personal_info?.summary || '',
            linkedin_url: tailoredData.personal_info?.linkedin_url,
            github_url: tailoredData.personal_info?.github_url,
          },
          education: tailoredData.education as never[],
          experience: tailoredData.experience as never[],
          skills: tailoredData.skills as never[],
          languages: tailoredData.languages as never[],
          certifications: tailoredData.certifications as never[],
          projects: tailoredData.projects as never[],
        });
        if (response.success && response.cv) {
          setCVs(prev => [response.cv as unknown as CV, ...prev]);
          setTailoredCvId(response.cv.id);
          cvToExport = response.cv as unknown as CV;
        } else {
          throw new Error('Failed to create CV');
        }
      }

      if (format === 'pdf') {
        await handleDownloadPDF(cvToExport);
      } else if (format === 'latex') {
        // Download LaTeX - using the existing function from CVEditorAI if available
        const { generateLaTeX } = await import('../lib/latex-generator');
        const latexCode = generateLaTeX(cvToExport);
        const blob = new Blob([latexCode], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${cvToExport.personal_info.full_name || 'resume'}_tailored.tex`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }
      
      setShowExportOptions(false);
    } catch (error) {
      console.error('Error exporting tailored CV:', error);
      setTailoringError('Failed to export. Please try again.');
    } finally {
      setExportingTailored(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-transparent flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600" />
          <p className="text-gray-500 dark:text-white/50">Loading your resumes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-transparent py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-10">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg">
              <Sparkles className="h-7 w-7 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">AI Resume Tailoring</h1>
              <p className="text-gray-500 dark:text-white/50 mt-0.5">Optimize your resume for any job description with AI</p>
            </div>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-6 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-500/30 text-red-700 dark:text-red-400 px-4 py-3 rounded-lg flex items-center">
            <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0" />
            <span>{error}</span>
            <button 
              onClick={() => setError('')}
              className="ml-auto text-red-700 dark:text-red-400 hover:opacity-85"
            >
              ×
            </button>
          </div>
        )}

        {/* AI Resume Tailoring Section */}
        <div className="mb-16 bg-gradient-to-br from-indigo-50/50 via-purple-50/50 to-pink-50/50 dark:from-white/[0.02] dark:via-white/[0.01] dark:to-transparent rounded-2xl border border-indigo-200/60 dark:border-white/10 shadow-sm overflow-hidden">
            <div className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Left Column - Inputs */}
                <div className="space-y-4">
                  {/* Upload or Select Resume */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-white/80 mb-2">Resume to Tailor</label>
                    
                    {/* Upload Option */}
                    <label className={`block mb-3 border-2 border-dashed rounded-lg p-4 text-center cursor-pointer transition-all ${
                      uploadingForTailoring 
                        ? 'border-indigo-300 bg-indigo-50 dark:border-indigo-500/50 dark:bg-indigo-500/5' 
                        : uploadedParsedData 
                          ? 'border-green-300 bg-green-50 dark:border-green-500/50 dark:bg-green-500/5' 
                          : 'border-gray-300 dark:border-white/10 hover:border-indigo-400 dark:hover:border-indigo-400 hover:bg-gray-50 dark:hover:bg-white/5'
                    }`}>
                      <input
                        type="file"
                        accept=".pdf,.docx"
                        className="hidden"
                        onChange={handleUploadForTailoring}
                        disabled={uploadingForTailoring}
                      />
                      {uploadingForTailoring ? (
                        <div className="flex items-center justify-center gap-2 text-indigo-600 dark:text-indigo-400">
                          <Loader2 className="h-5 w-5 animate-spin" />
                          <span className="text-sm font-medium">Parsing resume...</span>
                        </div>
                      ) : uploadedParsedData ? (
                        <div className="flex items-center justify-center gap-2 text-green-700 dark:text-green-400">
                          <CheckCircle className="h-5 w-5" />
                          <span className="text-sm font-medium">Resume uploaded and ready!</span>
                        </div>
                      ) : (
                        <div className="flex items-center justify-center gap-2 text-gray-600 dark:text-white/60">
                          <FileUp className="h-5 w-5" />
                          <span className="text-sm font-medium">Upload PDF or Word document</span>
                        </div>
                      )}
                    </label>

                    {/* OR divider */}
                    {cvs.length > 0 && (
                      <div className="relative my-3">
                        <div className="absolute inset-0 flex items-center">
                          <div className="w-full border-t border-gray-300 dark:border-white/10" />
                        </div>
                        <div className="relative flex justify-center text-xs">
                          <span className="px-2 bg-gradient-to-br from-indigo-50/50 via-purple-50/50 to-pink-50/50 dark:from-[#0f0f15] dark:to-[#0f0f15] text-gray-500 dark:text-white/40">or select existing</span>
                        </div>
                      </div>
                    )}

                    {/* Select from existing CVs */}
                    {cvs.length > 0 && (
                      <select
                        value={selectedCVForTailoring}
                        onChange={(e) => {
                          setSelectedCVForTailoring(e.target.value);
                          if (e.target.value !== 'uploaded') {
                            setUploadedParsedData(null);
                          }
                        }}
                        className="w-full border border-gray-300 dark:border-white/10 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-[#12121a] text-gray-900 dark:text-white"
                      >
                        <option value="" className="text-gray-900 dark:text-white bg-white dark:bg-[#12121a]">Choose from your resumes...</option>
                        {uploadedParsedData && <option value="uploaded" className="text-gray-900 dark:text-white bg-white dark:bg-[#12121a]">📄 Uploaded Resume</option>}
                        {cvs.map((cv) => (
                          <option key={cv.id} value={cv.id} className="text-gray-900 dark:text-white bg-white dark:bg-[#12121a]">
                            {cv.personal_info?.full_name || 'Untitled'} - {CV_TEMPLATES.find(t => t.id === cv.template)?.name || cv.template}
                          </option>
                        ))}
                      </select>
                    )}
                  </div>

                  {/* Job Title */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-white/80 mb-2">Target Job Title (Optional)</label>
                    <input
                      type="text"
                      value={jobTitle}
                      onChange={(e) => setJobTitle(e.target.value)}
                      placeholder="e.g., Senior Software Engineer"
                      className="w-full border border-gray-300 dark:border-white/10 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-[#12121a] text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-white/20"
                    />
                  </div>

                  {/* Job Description */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-white/80 mb-2">Job Description *</label>
                    <textarea
                      value={jobDescription}
                      onChange={(e) => setJobDescription(e.target.value)}
                      placeholder="Paste the full job description here..."
                      rows={8}
                      className="w-full border border-gray-300 dark:border-white/10 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 resize-y bg-white dark:bg-[#12121a] text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-white/20"
                    />
                  </div>

                  {/* Tailor Button */}
                  <button
                    onClick={handleTailorResume}
                    disabled={isTailoring || !jobDescription.trim() || (!selectedCVForTailoring && !uploadedParsedData)}
                    className={`w-full py-4 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-all shadow-lg ${
                      isTailoring
                        ? 'bg-indigo-400 text-white cursor-wait'
                        : 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700 hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none'
                    }`}
                  >
                    {isTailoring ? (
                      <>
                        <Loader2 className="h-5 w-5 animate-spin" />
                        AI is analyzing and tailoring your resume...
                      </>
                    ) : (
                      <>
                        <Zap className="h-5 w-5" />
                        Tailor My Resume with AI
                      </>
                    )}
                  </button>

                  {/* Error */}
                  {tailoringError && (
                    <div className="p-4 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-500/20 rounded-lg flex items-center gap-2 text-sm text-red-700 dark:text-red-400">
                      <AlertCircle className="h-5 w-5 flex-shrink-0" />
                      {tailoringError}
                    </div>
                  )}
                </div>

                {/* Right Column - Results */}
                <div className="space-y-4">
                  {!tailoringResult ? (
                    <div className="h-full flex flex-col items-center justify-center text-center p-8 bg-white/50 dark:bg-white/[0.01] rounded-xl border-2 border-dashed border-gray-200 dark:border-white/10">
                      <Target className="h-12 w-12 text-gray-300 dark:text-white/20 mb-4" />
                      <h3 className="text-lg font-medium text-gray-500 dark:text-white/60 mb-2">Results will appear here</h3>
                      <p className="text-sm text-gray-400 dark:text-white/40">Upload or select a resume, paste a job description, and click "Tailor My Resume"</p>
                    </div>
                  ) : (
                    <>
                      {/* Match Score */}
                      <div className="bg-white dark:bg-white/[0.03] rounded-xl border border-gray-200 dark:border-white/10 p-5 shadow-sm">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-2">
                            <Target className="h-6 w-6 text-indigo-600 dark:text-indigo-450" />
                            <span className="font-semibold text-gray-900 dark:text-white text-lg">Match Score</span>
                          </div>
                          <span className={`text-3xl font-bold ${
                            tailoringResult.match_score >= 80 ? 'text-green-600' :
                            tailoringResult.match_score >= 60 ? 'text-yellow-600' :
                            'text-red-600'
                          }`}>
                            {tailoringResult.match_score}%
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-white/10 rounded-full h-3">
                          <div
                            className={`h-3 rounded-full transition-all duration-700 ${
                              tailoringResult.match_score >= 80 ? 'bg-green-500' :
                              tailoringResult.match_score >= 60 ? 'bg-yellow-500' :
                              'bg-red-500'
                            }`}
                            style={{ width: `${tailoringResult.match_score}%` }}
                          />
                        </div>
                      </div>

                      {/* Optimizations */}
                      <div className="bg-white dark:bg-white/[0.03] rounded-xl border border-gray-200 dark:border-white/10 p-5 shadow-sm">
                        <h4 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                          <CheckCircle className="h-5 w-5 text-green-600" />
                          Optimizations Made
                        </h4>
                        <ul className="space-y-2">
                          {tailoringResult.optimizations_made.map((opt, idx) => (
                            <li key={idx} className="flex items-start gap-2 text-sm text-gray-700 dark:text-white/80">
                              <span className="text-green-500 mt-0.5">✓</span>
                              {opt}
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Job Analysis Accordion */}
                      <div className="bg-white dark:bg-white/[0.03] rounded-xl border border-gray-200 dark:border-white/10 overflow-hidden shadow-sm">
                        <button
                          onClick={() => setShowJobAnalysis(!showJobAnalysis)}
                          className="w-full p-4 flex items-center justify-between text-left hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
                        >
                          <span className="font-semibold text-gray-900 dark:text-white">Job Analysis Details</span>
                          {showJobAnalysis ? (
                            <ChevronUp className="h-5 w-5 text-gray-500 dark:text-white/60" />
                          ) : (
                            <ChevronDown className="h-5 w-5 text-gray-500 dark:text-white/60" />
                          )}
                        </button>
                        {showJobAnalysis && (
                          <div className="p-4 pt-0 space-y-4 border-t border-gray-100 dark:border-white/5">
                            <div>
                              <p className="text-sm font-medium text-gray-700 dark:text-white/80 mb-2">Required Skills</p>
                              <div className="flex flex-wrap gap-1.5">
                                {tailoringResult.job_analysis.required_skills.map((skill, idx) => (
                                  <span key={idx} className="px-2.5 py-1 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs rounded-full font-medium">
                                    {skill}
                                  </span>
                                ))}
                              </div>
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-700 dark:text-white/80 mb-2">ATS Keywords</p>
                              <div className="flex flex-wrap gap-1.5">
                                {tailoringResult.job_analysis.ats_keywords.map((kw, idx) => (
                                  <span key={idx} className="px-2.5 py-1 bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 text-xs rounded-full font-medium">
                                    {kw}
                                  </span>
                                ))}
                              </div>
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-700 dark:text-white/80 mb-2">Key Responsibilities</p>
                              <ul className="space-y-1">
                                {tailoringResult.job_analysis.key_responsibilities.map((resp, idx) => (
                                  <li key={idx} className="text-sm text-gray-600 dark:text-white/70 flex items-start gap-2">
                                    <span className="text-gray-400">•</span>
                                    {resp}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Action Buttons - Go to Edit or Export */}
                      <div className="space-y-3">
                        {/* Go to Edit Button */}
                        <button
                          onClick={handleGoToEdit}
                          disabled={creating}
                          className="w-full py-4 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl text-sm font-semibold hover:from-indigo-600 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center justify-center gap-2 disabled:opacity-50"
                        >
                          {creating ? (
                            <>
                              <Loader2 className="h-5 w-5 animate-spin" />
                              Creating...
                            </>
                          ) : (
                            <>
                              <Edit3 className="h-5 w-5" />
                              Go to Edit Resume
                            </>
                          )}
                        </button>

                        {/* Export Options */}
                        <div className="relative">
                          <button
                            onClick={() => setShowExportOptions(!showExportOptions)}
                            className="w-full py-4 bg-gradient-to-r from-emerald-500 to-green-600 text-white rounded-xl text-sm font-semibold hover:from-emerald-600 hover:to-green-700 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center justify-center gap-2"
                          >
                            <FileDown className="h-5 w-5" />
                            Export Tailored Resume
                            <ChevronDown className={`h-4 w-4 transition-transform ${showExportOptions ? 'rotate-180' : ''}`} />
                          </button>
                          
                          {showExportOptions && (
                            <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-[#12121a] rounded-xl border border-gray-200 dark:border-white/10 shadow-xl z-10 overflow-hidden">
                              <button
                                onClick={() => handleExportTailored('pdf')}
                                disabled={exportingTailored}
                                className="w-full px-4 py-3 text-left text-sm font-medium text-gray-700 dark:text-white/80 hover:bg-gray-50 dark:hover:bg-white/5 flex items-center gap-3 disabled:opacity-50"
                              >
                                {exportingTailored ? (
                                  <Loader2 className="h-5 w-5 animate-spin text-red-500" />
                                ) : (
                                  <FileText className="h-5 w-5 text-red-500" />
                                )}
                                <div>
                                  <p>Export as PDF</p>
                                  <p className="text-xs text-gray-400 dark:text-white/40">Best for applications</p>
                                </div>
                              </button>
                              <button
                                onClick={() => handleExportTailored('latex')}
                                disabled={exportingTailored}
                                className="w-full px-4 py-3 text-left text-sm font-medium text-gray-700 dark:text-white/80 hover:bg-gray-50 dark:hover:bg-white/5 flex items-center gap-3 border-t border-gray-100 dark:border-white/5 disabled:opacity-50"
                              >
                                <Code className="h-5 w-5 text-blue-500" />
                                <div>
                                  <p>Export as LaTeX</p>
                                  <p className="text-xs text-gray-400 dark:text-white/40">For developers & academics</p>
                                </div>
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>

      </div>
    </div>
  );
}

