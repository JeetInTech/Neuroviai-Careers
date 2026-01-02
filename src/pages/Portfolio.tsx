import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import api from '../lib/api';
import type { CV } from '../lib/database.types';
import DocumentUpload from '../components/DocumentUpload';
import { getTemplatePreview } from '../components/TemplatePreviews';
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
  Loader2
} from 'lucide-react';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { getTemplateComponent } from '../components/templates';

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
  { id: 'Healthcare & Science', icon: '🏥', color: 'from-cyan-500 to-blue-600' },
  { id: 'HR & Admin', icon: '👥', color: 'from-slate-500 to-gray-600' },
  { id: 'Emerging Roles', icon: '🚀', color: 'from-violet-500 to-purple-600' },
  { id: 'General', icon: '📄', color: 'from-gray-500 to-slate-600' },
];

// ============================================
// CV TEMPLATES - Role-focused (25+ templates)
// ============================================

const CV_TEMPLATES = [
  // === ENGINEERING & TECH ===
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
    id: 'qa-engineer',
    name: 'QA / Test Engineer',
    color: 'from-amber-500 to-orange-600',
    description: 'Highlight testing methodologies and automation',
    targetRole: 'qa-engineer' as const,
    category: 'Engineering & Tech',
    premium: false,
  },
  {
    id: 'systems-engineer',
    name: 'Systems Engineer',
    color: 'from-slate-600 to-gray-800',
    description: 'Infrastructure, monitoring, and reliability focus',
    targetRole: 'systems-engineer' as const,
    category: 'Engineering & Tech',
    premium: false,
  },
  // === DATA, ANALYTICS & RESEARCH ===
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
    id: 'data-analyst',
    name: 'Data Analyst',
    color: 'from-blue-400 to-cyan-600',
    description: 'Business insights, reporting, and visualization',
    targetRole: 'data-analyst' as const,
    category: 'Data & Analytics',
    premium: false,
  },
  {
    id: 'research-analyst',
    name: 'Research Analyst',
    color: 'from-violet-500 to-purple-600',
    description: 'Methodology, data sources, and findings',
    targetRole: 'research-analyst' as const,
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
  // === PRODUCT, OPERATIONS & MANAGEMENT ===
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
    id: 'program-manager',
    name: 'Program Manager',
    color: 'from-sky-500 to-blue-600',
    description: 'Multi-project coordination and strategic alignment',
    targetRole: 'program-manager' as const,
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
  // === BUSINESS, FINANCE & SALES ===
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
    id: 'accountant',
    name: 'Accountant',
    color: 'from-slate-500 to-gray-600',
    description: 'Compliance, audits, and financial accuracy',
    targetRole: 'accountant' as const,
    category: 'Business & Finance',
    premium: false,
  },
  {
    id: 'sales-executive',
    name: 'Sales Executive',
    color: 'from-red-500 to-rose-600',
    description: 'Revenue generation and client acquisition',
    targetRole: 'sales-executive' as const,
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
  // === MARKETING & CONTENT ===
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
  {
    id: 'seo-specialist',
    name: 'SEO Specialist',
    color: 'from-green-500 to-lime-600',
    description: 'Ranking improvements and traffic growth',
    targetRole: 'seo-specialist' as const,
    category: 'Marketing & Content',
    premium: false,
  },
  // === CREATIVE ===
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
    color: 'from-red-600 to-pink-600',
    description: 'Content editing and platform optimization',
    targetRole: 'video-editor' as const,
    category: 'Creative',
    premium: false,
  },
  // === HEALTHCARE & SCIENCE ===
  {
    id: 'healthcare-admin',
    name: 'Healthcare Administrator',
    color: 'from-blue-500 to-cyan-600',
    description: 'Compliance, patient operations, and systems',
    targetRole: 'healthcare-admin' as const,
    category: 'Healthcare & Science',
    premium: false,
  },
  {
    id: 'clinical-research',
    name: 'Clinical Research Associate',
    color: 'from-teal-500 to-green-600',
    description: 'Trials, protocols, and regulatory compliance',
    targetRole: 'clinical-research' as const,
    category: 'Healthcare & Science',
    premium: false,
  },
  // === LEGAL, HR & ADMIN ===
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
    id: 'legal-assistant',
    name: 'Legal Assistant',
    color: 'from-gray-500 to-slate-600',
    description: 'Documentation, case support, and research',
    targetRole: 'legal-assistant' as const,
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
  // === EMERGING & MODERN ===
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
  // === GENERAL ===
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
        setCVs(result.cvs || []);
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

  // Download CV as PDF
  const handleDownloadPDF = async (cv: CV) => {
    try {
      setDownloadingCvId(cv.id);

      // Create a temporary container for PDF generation
      const tempContainer = document.createElement('div');
      tempContainer.style.position = 'absolute';
      tempContainer.style.left = '-9999px';
      tempContainer.style.top = '0';
      tempContainer.style.width = '816px'; // A4 width at 96 DPI
      tempContainer.style.backgroundColor = 'white';
      document.body.appendChild(tempContainer);

      // Render the template into the temp container
      const templateId = cv.template || cv.target_role || 'professional';
      const TemplateComponent = getTemplateComponent(templateId);
      
      // Use React to render the template
      const { createRoot } = await import('react-dom/client');
      const root = createRoot(tempContainer);
      
      await new Promise<void>((resolve) => {
        root.render(<TemplateComponent cv={cv} isViewMode={true} />);
        setTimeout(resolve, 200);
      });

      // Extract link positions from the DOM before capturing
      const links: Array<{url: string; rect: DOMRect}> = [];
      const linkElements = tempContainer.querySelectorAll('a[href]');
      linkElements.forEach((el) => {
        const href = el.getAttribute('href');
        if (href && (href.startsWith('http') || href.startsWith('mailto:'))) {
          const rect = el.getBoundingClientRect();
          const containerRect = tempContainer.getBoundingClientRect();
          links.push({
            url: href,
            rect: new DOMRect(
              rect.left - containerRect.left,
              rect.top - containerRect.top,
              rect.width,
              rect.height
            )
          });
        }
      });

      // Capture with html2canvas
      const canvas = await html2canvas(tempContainer, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
        windowWidth: 816,
        scrollY: 0,
        scrollX: 0,
      });

      // Clean up
      root.unmount();
      document.body.removeChild(tempContainer);

      // Create PDF
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      
      const ratio = pdfWidth / (imgWidth / 2);
      const scaledHeight = (imgHeight / 2) * ratio;

      if (scaledHeight > pdfHeight) {
        let yPosition = 0;
        const pageHeight = pdfHeight / ratio * 2;
        
        while (yPosition < imgHeight) {
          if (yPosition > 0) {
            pdf.addPage();
          }
          
          const pageCanvas = document.createElement('canvas');
          pageCanvas.width = imgWidth;
          pageCanvas.height = Math.min(pageHeight, imgHeight - yPosition);
          const ctx = pageCanvas.getContext('2d');
          
          if (ctx) {
            ctx.drawImage(
              canvas,
              0, yPosition, imgWidth, pageCanvas.height,
              0, 0, imgWidth, pageCanvas.height
            );
            
            const pageImgData = pageCanvas.toDataURL('image/png');
            const pageScaledHeight = (pageCanvas.height / 2) * ratio;
            pdf.addImage(pageImgData, 'PNG', 0, 0, pdfWidth, pageScaledHeight);
          }
          
          yPosition += pageHeight;
        }
      } else {
        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, scaledHeight);
      }

      // Add clickable link annotations
      const pxToMm = pdfWidth / 816;
      
      for (const link of links) {
        const x = link.rect.left * pxToMm;
        const y = link.rect.top * pxToMm;
        const width = link.rect.width * pxToMm;
        const height = link.rect.height * pxToMm;
        
        if (y < pdfHeight && width > 0 && height > 0) {
          pdf.link(x, y, width, height, { url: link.url });
        }
      }
      
      // Add fallback links from CV data
      const headerLinkY = 12;
      let headerLinkX = pdfWidth - 80;
      
      if (cv.personal_info.email) {
        pdf.link(10, headerLinkY, 60, 5, { url: `mailto:${cv.personal_info.email}` });
      }
      if (cv.personal_info.github_url) {
        pdf.link(headerLinkX, headerLinkY, 25, 5, { url: cv.personal_info.github_url });
        headerLinkX += 28;
      }
      if (cv.personal_info.linkedin_url) {
        pdf.link(headerLinkX, headerLinkY, 25, 5, { url: cv.personal_info.linkedin_url });
        headerLinkX += 28;
      }
      if (cv.personal_info.portfolio_url) {
        pdf.link(headerLinkX, headerLinkY, 25, 5, { url: cv.personal_info.portfolio_url });
      }

      pdf.save(`${cv.personal_info.full_name || 'cv'}_resume.pdf`);
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
                        <span className="text-2xl">{template?.icon || '📄'}</span>
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