import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import api from '../lib/api';
import aiApi from '../lib/ai-api';
import type { CV } from '../lib/database.types';
import DocumentUpload from '../components/DocumentUpload';
import { getFullTemplatePreview } from '../components/FullTemplatePreviews';
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
  FileDown
} from 'lucide-react';

// ============================================
// CATEGORY CONFIGURATION
// ============================================

const TEMPLATE_CATEGORIES = [
  { id: 'Engineering & Tech', icon: '⚡', color: 'from-blue-500 to-indigo-600' },
  { id: 'Data & Analytics', icon: '📊', color: 'from-emerald-500 to-teal-600' },
  { id: 'Management', icon: '📋', color: 'from-purple-500 to-violet-600' },
  { id: 'Business & Finance', icon: '💼', color: 'from-amber-500 to-orange-600' },
  { id: 'Marketing & Content', icon: '📣', color: 'from-pink-500 to-rose-600' },
  { id: 'Creative', icon: '🎨', color: 'from-fuchsia-500 to-pink-600' },
  { id: 'HR & Admin', icon: '👥', color: 'from-slate-500 to-gray-600' },
  { id: 'Emerging Roles', icon: '🚀', color: 'from-violet-500 to-purple-600' },
  { id: 'General', icon: '📄', color: 'from-gray-500 to-slate-600' },
];

// ============================================
// CV TEMPLATES - Role-focused (25+ templates)
// ============================================

const CV_TEMPLATES = [
  // === ENGINEERING & TECH (2 templates) ===
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
  // === DATA & AI (2 templates) ===
  {
    id: 'data-scientist',
    name: 'Data Scientist',
    color: 'from-purple-500 to-pink-600',
    description: 'Highlight analytics skills, tools, and methodologies',
    targetRole: 'data-scientist' as const,
    category: 'Data & Analytics',
    premium: false,
  },
  {
    id: 'ai-ml-engineer',
    name: 'AI/ML Engineer',
    color: 'from-teal-500 to-cyan-600',
    description: 'Focus on ML frameworks, models, and research',
    targetRole: 'ai-ml-engineer' as const,
    category: 'Data & Analytics',
    premium: false,
  },
  // === MANAGEMENT (3 templates) ===
  {
    id: 'product-manager',
    name: 'Product Manager',
    color: 'from-orange-500 to-red-600',
    description: 'Showcase product launches and impact metrics',
    targetRole: 'product-manager' as const,
    category: 'Management',
    premium: false,
  },
  {
    id: 'project-manager',
    name: 'Project Manager',
    color: 'from-emerald-500 to-green-600',
    description: 'Delivery timelines, budget, and risk management',
    targetRole: 'project-manager' as const,
    category: 'Management',
    premium: false,
  },
  {
    id: 'operations-manager',
    name: 'Operations Manager',
    color: 'from-teal-500 to-emerald-600',
    description: 'Process optimization and team leadership',
    targetRole: 'operations-manager' as const,
    category: 'Management',
    premium: false,
  },
  // === BUSINESS & FINANCE (2 templates) ===
  {
    id: 'financial-analyst',
    name: 'Financial Analyst',
    color: 'from-green-600 to-emerald-700',
    description: 'Financial modeling, forecasting, and budgeting',
    targetRole: 'financial-analyst' as const,
    category: 'Business & Finance',
    premium: false,
  },
  {
    id: 'business-development',
    name: 'Business Development',
    color: 'from-purple-600 to-indigo-600',
    description: 'Partnerships, growth strategies, and market expansion',
    targetRole: 'business-development' as const,
    category: 'Business & Finance',
    premium: false,
  },
  // === MARKETING & CONTENT (2 templates) ===
  {
    id: 'content-writer',
    name: 'Content Writer',
    color: 'from-pink-500 to-rose-600',
    description: 'SEO content, blogs, and copywriting',
    targetRole: 'content-writer' as const,
    category: 'Marketing & Content',
    premium: false,
  },
  {
    id: 'social-media-manager',
    name: 'Social Media Manager',
    color: 'from-purple-500 to-pink-500',
    description: 'Platform growth and campaign performance',
    targetRole: 'social-media-manager' as const,
    category: 'Marketing & Content',
    premium: false,
  },
  // === CREATIVE (1 template) ===
  {
    id: 'graphic-designer',
    name: 'Graphic Designer',
    color: 'from-indigo-500 to-purple-600',
    description: 'ATS-safe design portfolio showcase',
    targetRole: 'graphic-designer' as const,
    category: 'Creative',
    premium: false,
  },
  // === HR & ADMIN (2 templates) ===
  {
    id: 'hr-manager',
    name: 'HR Manager',
    color: 'from-orange-500 to-amber-600',
    description: 'Talent management, compliance, and policies',
    targetRole: 'hr-manager' as const,
    category: 'HR & Admin',
    premium: false,
  },
  {
    id: 'admin-assistant',
    name: 'Administrative Assistant',
    color: 'from-blue-400 to-indigo-500',
    description: 'Organization, support, and coordination',
    targetRole: 'admin-assistant' as const,
    category: 'HR & Admin',
    premium: false,
  },
  // === EMERGING & MODERN (3 templates) ===
  {
    id: 'ai-prompt-engineer',
    name: 'AI Prompt Engineer',
    color: 'from-violet-600 to-purple-700',
    description: 'Prompt design, LLM optimization, and AI systems',
    targetRole: 'ai-prompt-engineer' as const,
    category: 'Emerging Roles',
    premium: false,
  },
  {
    id: 'automation-specialist',
    name: 'Automation Specialist',
    color: 'from-cyan-500 to-blue-600',
    description: 'No-code workflows and API integrations',
    targetRole: 'automation-specialist' as const,
    category: 'Emerging Roles',
    premium: false,
  },
  {
    id: 'technical-writer',
    name: 'Technical Writer',
    color: 'from-gray-400 to-slate-500',
    description: 'Documentation quality and API references',
    targetRole: 'technical-writer' as const,
    category: 'Emerging Roles',
    premium: false,
  },
  // === GENERAL (3 templates) ===
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
    if (!user) return;
    
    try {
      setCreating(true);
      setError('');
      
      // Create a new CV with the extracted data
      const result = await api.createCV({
        template: 'tech-focused',
        target_role: 'software-engineer',
        personal_info: {
          full_name: (data.personal_info.full_name as string) || '',
          email: (data.personal_info.email as string) || user.email || '',
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
    if (!user) return;

    const loadCVs = async () => {
      try {
        const result = await api.listMyCVs();
        setCVs((result.cvs || []) as unknown as CV[]);
      } catch (error) {
        console.error('Error loading CVs:', error);
        setError('Failed to load your resumes. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    loadCVs();
  }, [user]);

  // Create new CV from template
  const handleCreateCV = async (templateId: string, targetRole: string) => {
    if (!user) return;

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
          email: user.email || '',
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
        template: 'modern',
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
          template: 'modern',
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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600" />
          <p className="text-gray-500">Loading your resumes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Document Upload Modal */}
        {showUpload && (
          <DocumentUpload 
            onDataExtracted={handleDocumentData}
            onClose={() => setShowUpload(false)}
          />
        )}

        {/* Header */}
        <div className="mb-12">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center space-x-3 mb-2">
                <Sparkles className="h-8 w-8 text-indigo-600" />
                <h1 className="text-3xl font-bold text-gray-900">My Resumes</h1>
              </div>
              <p className="text-gray-600">Create ATS-optimized resumes that get you interviews</p>
            </div>
            
            {/* Upload Button */}
            <button
              onClick={() => setShowUpload(true)}
              disabled={creating}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50"
            >
              <Upload className="h-5 w-5" />
              Upload Existing CV
            </button>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center">
            <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0" />
            <span>{error}</span>
            <button 
              onClick={() => setError('')}
              className="ml-auto text-red-500 hover:text-red-700"
            >
              ×
            </button>
          </div>
        )}

        {/* Existing CVs */}
        {cvs.length > 0 && (
          <div className="mb-16">
            <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
              <FileText className="h-5 w-5 mr-2 text-indigo-600" />
              Your Resumes ({cvs.length})
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {cvs.map((cv) => {
                const template = CV_TEMPLATES.find(t => t.id === cv.template);
                return (
                  <div 
                    key={cv.id} 
                    className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow"
                  >
                    {/* Template Header */}
                    <div className={`h-2 bg-gradient-to-r ${template?.color || 'from-gray-400 to-gray-500'}`} />
                    
                    <div className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">
                            {cv.personal_info.full_name || 'Untitled Resume'}
                          </h3>
                          <p className="text-sm text-gray-500 flex items-center mt-1">
                            <Briefcase className="h-3 w-3 mr-1" />
                            {template?.name || cv.template}
                          </p>
                        </div>
                        <span className="text-2xl">{TEMPLATE_CATEGORIES.find(c => c.id === template?.category)?.icon || '📄'}</span>
                      </div>

                      {/* Stats */}
                      <div className="grid grid-cols-3 gap-2 mb-4 text-center">
                        <div className="bg-gray-50 rounded-lg p-2">
                          <p className="text-lg font-semibold text-gray-900">{cv.experience?.length || 0}</p>
                          <p className="text-xs text-gray-500">Experience</p>
                        </div>
                        <div className="bg-gray-50 rounded-lg p-2">
                          <p className="text-lg font-semibold text-gray-900">{cv.skills?.length || 0}</p>
                          <p className="text-xs text-gray-500">Skills</p>
                        </div>
                        <div className="bg-gray-50 rounded-lg p-2">
                          <p className="text-lg font-semibold text-gray-900">{cv.projects?.length || 0}</p>
                          <p className="text-xs text-gray-500">Projects</p>
                        </div>
                      </div>

                      {/* Last Updated */}
                      <p className="text-xs text-gray-400 flex items-center mb-4">
                        <Clock className="h-3 w-3 mr-1" />
                        Updated {formatDate(cv.updated_at)}
                      </p>

                      {/* Actions */}
                      <div className="flex space-x-2">
                        <button
                          onClick={() => navigate(`/cv/edit/${cv.id}`)}
                          className="flex-1 inline-flex items-center justify-center px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors"
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          Edit
                        </button>
                        <button
                          onClick={() => handleDownloadPDF(cv)}
                          disabled={downloadingCvId === cv.id}
                          className="px-3 py-2 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors disabled:opacity-50"
                          title="Download PDF"
                        >
                          {downloadingCvId === cv.id ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Download className="h-4 w-4" />
                          )}
                        </button>
                        <button
                          onClick={() => setDeleteConfirm(cv.id)}
                          className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* AI Resume Tailoring Section */}
        <div className="mb-16 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 rounded-2xl border border-indigo-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-indigo-100">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg">
                  <Sparkles className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">AI Resume Tailoring</h2>
                  <p className="text-sm text-gray-600">Optimize your resume for a specific job description with AI</p>
                </div>
              </div>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Left Column - Inputs */}
                <div className="space-y-4">
                  {/* Upload or Select Resume */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Resume to Tailor</label>
                    
                    {/* Upload Option */}
                    <label className={`block mb-3 border-2 border-dashed rounded-lg p-4 text-center cursor-pointer transition-all ${
                      uploadingForTailoring 
                        ? 'border-indigo-300 bg-indigo-50' 
                        : uploadedParsedData 
                          ? 'border-green-300 bg-green-50' 
                          : 'border-gray-300 hover:border-indigo-400 hover:bg-gray-50'
                    }`}>
                      <input
                        type="file"
                        accept=".pdf,.docx"
                        className="hidden"
                        onChange={handleUploadForTailoring}
                        disabled={uploadingForTailoring}
                      />
                      {uploadingForTailoring ? (
                        <div className="flex items-center justify-center gap-2 text-indigo-600">
                          <Loader2 className="h-5 w-5 animate-spin" />
                          <span className="text-sm font-medium">Parsing resume...</span>
                        </div>
                      ) : uploadedParsedData ? (
                        <div className="flex items-center justify-center gap-2 text-green-700">
                          <CheckCircle className="h-5 w-5" />
                          <span className="text-sm font-medium">Resume uploaded and ready!</span>
                        </div>
                      ) : (
                        <div className="flex items-center justify-center gap-2 text-gray-600">
                          <FileUp className="h-5 w-5" />
                          <span className="text-sm font-medium">Upload PDF or Word document</span>
                        </div>
                      )}
                    </label>

                    {/* OR divider */}
                    {cvs.length > 0 && (
                      <div className="relative my-3">
                        <div className="absolute inset-0 flex items-center">
                          <div className="w-full border-t border-gray-300" />
                        </div>
                        <div className="relative flex justify-center text-xs">
                          <span className="px-2 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 text-gray-500">or select existing</span>
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
                        className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white"
                      >
                        <option value="">Choose from your resumes...</option>
                        {uploadedParsedData && <option value="uploaded">📄 Uploaded Resume</option>}
                        {cvs.map((cv) => (
                          <option key={cv.id} value={cv.id}>
                            {cv.personal_info?.full_name || 'Untitled'} - {CV_TEMPLATES.find(t => t.id === cv.template)?.name || cv.template}
                          </option>
                        ))}
                      </select>
                    )}
                  </div>

                  {/* Job Title */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Target Job Title (Optional)</label>
                    <input
                      type="text"
                      value={jobTitle}
                      onChange={(e) => setJobTitle(e.target.value)}
                      placeholder="e.g., Senior Software Engineer"
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>

                  {/* Job Description */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Job Description *</label>
                    <textarea
                      value={jobDescription}
                      onChange={(e) => setJobDescription(e.target.value)}
                      placeholder="Paste the full job description here..."
                      rows={8}
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 resize-y"
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
                    <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-sm text-red-700">
                      <AlertCircle className="h-5 w-5 flex-shrink-0" />
                      {tailoringError}
                    </div>
                  )}
                </div>

                {/* Right Column - Results */}
                <div className="space-y-4">
                  {!tailoringResult ? (
                    <div className="h-full flex flex-col items-center justify-center text-center p-8 bg-white/50 rounded-xl border-2 border-dashed border-gray-200">
                      <Target className="h-12 w-12 text-gray-300 mb-4" />
                      <h3 className="text-lg font-medium text-gray-500 mb-2">Results will appear here</h3>
                      <p className="text-sm text-gray-400">Upload or select a resume, paste a job description, and click "Tailor My Resume"</p>
                    </div>
                  ) : (
                    <>
                      {/* Match Score */}
                      <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-2">
                            <Target className="h-6 w-6 text-indigo-600" />
                            <span className="font-semibold text-gray-900 text-lg">Match Score</span>
                          </div>
                          <span className={`text-3xl font-bold ${
                            tailoringResult.match_score >= 80 ? 'text-green-600' :
                            tailoringResult.match_score >= 60 ? 'text-yellow-600' :
                            'text-red-600'
                          }`}>
                            {tailoringResult.match_score}%
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-3">
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
                      <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
                        <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                          <CheckCircle className="h-5 w-5 text-green-600" />
                          Optimizations Made
                        </h4>
                        <ul className="space-y-2">
                          {tailoringResult.optimizations_made.map((opt, idx) => (
                            <li key={idx} className="flex items-start gap-2 text-sm text-gray-700">
                              <span className="text-green-500 mt-0.5">✓</span>
                              {opt}
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Job Analysis Accordion */}
                      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
                        <button
                          onClick={() => setShowJobAnalysis(!showJobAnalysis)}
                          className="w-full p-4 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
                        >
                          <span className="font-semibold text-gray-900">Job Analysis Details</span>
                          {showJobAnalysis ? (
                            <ChevronUp className="h-5 w-5 text-gray-500" />
                          ) : (
                            <ChevronDown className="h-5 w-5 text-gray-500" />
                          )}
                        </button>
                        {showJobAnalysis && (
                          <div className="p-4 pt-0 space-y-4 border-t border-gray-100">
                            <div>
                              <p className="text-sm font-medium text-gray-700 mb-2">Required Skills</p>
                              <div className="flex flex-wrap gap-1.5">
                                {tailoringResult.job_analysis.required_skills.map((skill, idx) => (
                                  <span key={idx} className="px-2.5 py-1 bg-blue-50 text-blue-700 text-xs rounded-full font-medium">
                                    {skill}
                                  </span>
                                ))}
                              </div>
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-700 mb-2">ATS Keywords</p>
                              <div className="flex flex-wrap gap-1.5">
                                {tailoringResult.job_analysis.ats_keywords.map((kw, idx) => (
                                  <span key={idx} className="px-2.5 py-1 bg-purple-50 text-purple-700 text-xs rounded-full font-medium">
                                    {kw}
                                  </span>
                                ))}
                              </div>
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-700 mb-2">Key Responsibilities</p>
                              <ul className="space-y-1">
                                {tailoringResult.job_analysis.key_responsibilities.map((resp, idx) => (
                                  <li key={idx} className="text-sm text-gray-600 flex items-start gap-2">
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
                            <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl border border-gray-200 shadow-xl z-10 overflow-hidden">
                              <button
                                onClick={() => handleExportTailored('pdf')}
                                disabled={exportingTailored}
                                className="w-full px-4 py-3 text-left text-sm font-medium text-gray-700 hover:bg-gray-50 flex items-center gap-3 disabled:opacity-50"
                              >
                                {exportingTailored ? (
                                  <Loader2 className="h-5 w-5 animate-spin text-red-500" />
                                ) : (
                                  <FileText className="h-5 w-5 text-red-500" />
                                )}
                                <div>
                                  <p>Export as PDF</p>
                                  <p className="text-xs text-gray-400">Best for applications</p>
                                </div>
                              </button>
                              <button
                                onClick={() => handleExportTailored('latex')}
                                disabled={exportingTailored}
                                className="w-full px-4 py-3 text-left text-sm font-medium text-gray-700 hover:bg-gray-50 flex items-center gap-3 border-t border-gray-100 disabled:opacity-50"
                              >
                                <Code className="h-5 w-5 text-blue-500" />
                                <div>
                                  <p>Export as LaTeX</p>
                                  <p className="text-xs text-gray-400">For developers & academics</p>
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

        {/* Create New CV - Templates by Category */}
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2 flex items-center">
            <Target className="h-5 w-5 mr-2 text-indigo-600" />
            Create New Resume
          </h2>
          <p className="text-gray-600 mb-6">Choose a template optimized for your target role</p>
          
          {/* Search Bar */}
          <div className="relative mb-6">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search templates by name or role..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                if (e.target.value) setSelectedCategory(null);
              }}
              className="w-full pl-12 pr-10 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white shadow-sm"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            )}
          </div>

          {/* Category Buttons */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 mb-8">
            {TEMPLATE_CATEGORIES.map((category) => {
              const count = CV_TEMPLATES.filter(t => t.category === category.id).length;
              if (count === 0) return null;
              const isSelected = selectedCategory === category.id;
              
              return (
                <button
                  key={category.id}
                  onClick={() => {
                    setSelectedCategory(isSelected ? null : category.id);
                    setSearchQuery('');
                  }}
                  className={`relative p-4 rounded-xl text-left transition-all overflow-hidden group ${
                    isSelected
                      ? 'ring-2 ring-offset-2 ring-indigo-500'
                      : 'hover:shadow-lg hover:-translate-y-0.5'
                  }`}
                >
                  {/* Gradient Background */}
                  <div className={`absolute inset-0 bg-gradient-to-r ${category.color} ${isSelected ? 'opacity-100' : 'opacity-90 group-hover:opacity-100'}`} />
                  
                  {/* Content */}
                  <div className="relative z-10">
                    <span className="text-2xl mb-2 block">{category.icon}</span>
                    <h3 className="font-semibold text-white text-sm">{category.id}</h3>
                    <p className="text-white/70 text-xs mt-1">{count} templates</p>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Templates Display */}
          {(selectedCategory || searchQuery) && (
            <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  {selectedCategory && (
                    <>
                      <span className="text-2xl">
                        {TEMPLATE_CATEGORIES.find(c => c.id === selectedCategory)?.icon}
                      </span>
                      <h3 className="text-xl font-bold text-gray-900">{selectedCategory}</h3>
                    </>
                  )}
                  {searchQuery && (
                    <h3 className="text-xl font-bold text-gray-900">
                      Search results for "{searchQuery}"
                    </h3>
                  )}
                </div>
                <button
                  onClick={() => {
                    setSelectedCategory(null);
                    setSearchQuery('');
                  }}
                  className="text-gray-400 hover:text-gray-600 p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Templates Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {CV_TEMPLATES
                  .filter(t => {
                    if (searchQuery) {
                      const query = searchQuery.toLowerCase();
                      return t.name.toLowerCase().includes(query) ||
                        t.description.toLowerCase().includes(query) ||
                        t.targetRole.toLowerCase().includes(query);
                    }
                    return t.category === selectedCategory;
                  })
                  .map((template) => {
                    const FullPreviewComponent = getFullTemplatePreview(template.id);
                    return (
                      <div 
                        key={template.id} 
                        className="bg-white rounded-xl border border-gray-100 overflow-hidden hover:shadow-xl transition-all group hover:border-indigo-300"
                      >
                        {/* Full CV Preview */}
                        <div className={`bg-gradient-to-r ${template.color} p-4`}>
                          <div className="bg-white rounded-lg shadow-xl overflow-hidden transform group-hover:scale-[1.01] transition-transform duration-300">
                            <div className="max-h-[400px] overflow-hidden">
                              <FullPreviewComponent className="scale-[0.85] origin-top" />
                            </div>
                          </div>
                        </div>
                        
                        <div className="p-5 bg-white">
                          <div className="flex items-center justify-between mb-2">
                            <h3 className="text-lg font-semibold text-gray-900">{template.name}</h3>
                            {template.premium && (
                              <span className="px-2 py-0.5 bg-yellow-100 text-yellow-700 text-xs font-medium rounded-full">
                                Pro
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-gray-500 mb-4">{template.description}</p>
                          
                          <button
                            onClick={() => handleCreateCV(template.id, template.targetRole)}
                            disabled={creating}
                            className="w-full inline-flex items-center justify-center px-4 py-3 bg-gray-900 text-white font-medium rounded-lg hover:bg-indigo-600 transition-colors disabled:opacity-50"
                          >
                            {creatingTemplateId === template.id ? (
                              <Loader2 className="h-5 w-5 animate-spin" />
                            ) : (
                              <>
                                <Plus className="h-5 w-5 mr-2" />
                                Use This Template
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    );
                  })}
              </div>

              {/* No Results */}
              {searchQuery && CV_TEMPLATES.filter(t => {
                const query = searchQuery.toLowerCase();
                return t.name.toLowerCase().includes(query) ||
                  t.description.toLowerCase().includes(query) ||
                  t.targetRole.toLowerCase().includes(query);
              }).length === 0 && (
                <div className="text-center py-12">
                  <Search className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No templates found</h3>
                  <p className="text-gray-500">Try a different search term</p>
                </div>
              )}
            </div>
          )}

          {/* Prompt to select category when nothing selected */}
          {!selectedCategory && !searchQuery && (
            <div className="text-center py-12 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
              <Target className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Select a category above</h3>
              <p className="text-gray-500">Choose a category to browse templates or search by name</p>
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="mt-16 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl p-8 text-white">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="mb-6 md:mb-0">
              <h3 className="text-2xl font-bold mb-2">Export to LaTeX</h3>
              <p className="text-indigo-100">
                Get clean, modular LaTeX code for your resume. Perfect for developers!
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 bg-white/20 rounded-lg px-4 py-2">
                <Code className="h-5 w-5" />
                <span className="font-medium">.tex</span>
              </div>
              <div className="flex items-center space-x-2 bg-white/20 rounded-lg px-4 py-2">
                <FileText className="h-5 w-5" />
                <span className="font-medium">.pdf</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                <Trash2 className="h-6 w-6 text-red-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Delete Resume?</h3>
                <p className="text-sm text-gray-500">This action cannot be undone.</p>
              </div>
            </div>
            
            <div className="flex space-x-3 mt-6">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteCV(deleteConfirm)}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}