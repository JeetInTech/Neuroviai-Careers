import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import api from '../lib/api';
import aiApi from '../lib/ai-api';
import type { CV, LaTeXExportOptions } from '../lib/database.types';
import { 
  Download, Share2, Save, ArrowLeft, Eye, 
  Sparkles, Wand2, Plus, ChevronDown, ChevronRight,
  Loader2, Lightbulb, X, User, Briefcase, 
  GraduationCap, Code, Languages, Award, Trash2, Upload,
  PanelRightClose, PanelRight, GripVertical, ChevronUp, Settings2,
  Check
} from 'lucide-react';
import ShareCVDialog from '../components/ShareCVDialog';
import DocumentUpload from '../components/DocumentUpload';
import { downloadLaTeX, getRecommendedTemplate, generateLaTeX, generateATSCVLaTeX, generateATSResumeLaTeX, downloadATSCVLaTeX, downloadATSResumeLaTeX } from '../lib/latex-generator';
import { getTemplateComponent, OrderedTemplate } from '../components/templates';
import { TemplateDropdown } from '../components/TemplateSelector';

// AI Button Component with loading state
interface AIButtonProps {
  onClick: () => void;
  loading?: boolean;
  variant?: 'generate' | 'enhance' | 'add';
  children: React.ReactNode;
  className?: string;
  disabled?: boolean;
}

const AIButton: React.FC<AIButtonProps> = ({ 
  onClick, loading, variant = 'generate', children, className = '', disabled 
}) => {
  const variants = {
    generate: 'bg-gradient-to-r from-violet-500 to-purple-500 hover:from-violet-600 hover:to-purple-600 text-white',
    enhance: 'bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white',
    add: 'bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white',
  };

  return (
    <button
      onClick={onClick}
      disabled={loading || disabled}
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg 
        transition-all duration-200 shadow-sm hover:shadow-md disabled:opacity-50 
        disabled:cursor-not-allowed ${variants[variant]} ${className}`}
    >
      {loading ? (
        <Loader2 className="h-3.5 w-3.5 animate-spin" />
      ) : variant === 'generate' ? (
        <Sparkles className="h-3.5 w-3.5" />
      ) : variant === 'enhance' ? (
        <Wand2 className="h-3.5 w-3.5" />
      ) : (
        <Plus className="h-3.5 w-3.5" />
      )}
      {children}
    </button>
  );
};

// Modern Input with AI integration
interface AIInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  onGenerate?: () => void;
  onEnhance?: () => void;
  generating?: boolean;
  enhancing?: boolean;
  placeholder?: string;
  multiline?: boolean;
  rows?: number;
  showAI?: boolean;
}

const AIInput: React.FC<AIInputProps> = ({
  label, value, onChange, onGenerate, onEnhance, 
  generating, enhancing, placeholder, multiline, rows = 3, showAI = true
}) => {
  const InputComponent = multiline ? 'textarea' : 'input';
  
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-gray-700">{label}</label>
        {showAI && (onGenerate || onEnhance) && (
          <div className="flex gap-2">
            {onGenerate && (
              <AIButton onClick={onGenerate} loading={generating} variant="generate">
                Generate
              </AIButton>
            )}
            {onEnhance && value && (
              <AIButton onClick={onEnhance} loading={enhancing} variant="enhance">
                Enhance
              </AIButton>
            )}
          </div>
        )}
      </div>
      <InputComponent
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={multiline ? rows : undefined}
        className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white/80 backdrop-blur-sm
          focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 transition-all duration-200
          text-gray-900 placeholder-gray-400 shadow-sm"
      />
    </div>
  );
};

// Collapsible Section Component
interface SectionProps {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  defaultOpen?: boolean;
  onAdd?: () => void;
  addLabel?: string;
  badge?: number;
}

const Section: React.FC<SectionProps> = ({ 
  title, icon, children, defaultOpen = true, onAdd, addLabel, badge 
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  
  return (
    <div className="bg-white/80 backdrop-blur-xl rounded-2xl border border-gray-200/50 shadow-lg overflow-hidden">
      <div 
        className="flex items-center justify-between px-6 py-4 cursor-pointer hover:bg-gray-50/50 transition-colors"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-gradient-to-br from-violet-100 to-purple-100 text-violet-600">
            {icon}
          </div>
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          {badge !== undefined && badge > 0 && (
            <span className="px-2 py-0.5 text-xs font-medium bg-violet-100 text-violet-700 rounded-full">
              {badge}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {onAdd && (
            <button
              onClick={(e) => { e.stopPropagation(); onAdd(); }}
              className="px-3 py-1.5 text-sm font-medium text-violet-600 hover:bg-violet-50 
                rounded-lg transition-colors flex items-center gap-1.5"
            >
              <Plus className="h-4 w-4" />
              {addLabel || 'Add'}
            </button>
          )}
          {isOpen ? (
            <ChevronDown className="h-5 w-5 text-gray-400" />
          ) : (
            <ChevronRight className="h-5 w-5 text-gray-400" />
          )}
        </div>
      </div>
      {isOpen && (
        <div className="px-6 pb-6 space-y-4 border-t border-gray-100">
          <div className="pt-4">
            {children}
          </div>
        </div>
      )}
    </div>
  );
};

// Entry Card Component for repeatable items
interface EntryCardProps {
  title: string;
  subtitle?: string;
  onRemove: () => void;
  children: React.ReactNode;
}

const EntryCard: React.FC<EntryCardProps> = ({ title, subtitle, onRemove, children }) => {
  return (
    <div className="bg-gray-50/50 rounded-xl border border-gray-200/50 p-5 space-y-4 group">
      <div className="flex items-start justify-between">
        <div>
          <h4 className="font-medium text-gray-900">{title}</h4>
          {subtitle && <p className="text-sm text-gray-500">{subtitle}</p>}
        </div>
        <button
          onClick={onRemove}
          className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 
            rounded-lg transition-colors opacity-0 group-hover:opacity-100"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
      {children}
    </div>
  );
};

export default function CVEditor() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [cv, setCV] = useState<CV | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [showShareDialog, setShowShareDialog] = useState(false);
  const [showPreview, setShowPreview] = useState(true);
  const [showDownloadMenu, setShowDownloadMenu] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showSectionOrderPanel, setShowSectionOrderPanel] = useState(false);
  const cvRef = useRef<HTMLDivElement>(null);

  // Section order for preview rearrangement
  const [sectionOrder, setSectionOrder] = useState<string[]>([
    'summary', 'skills', 'experience', 'education', 'projects', 'certifications', 'languages'
  ]);

  // AI Loading States
  const [generatingSummary, setGeneratingSummary] = useState(false);
  const [enhancingSummary, setEnhancingSummary] = useState(false);
  const [generatingSkills, setGeneratingSkills] = useState(false);
  const [generatingBullets, setGeneratingBullets] = useState<number | null>(null);
  const [generatingEducation, setGeneratingEducation] = useState<number | null>(null);

  // AI Suggestions
  const [suggestions, setSuggestions] = useState<Array<{section: string; issue: string; fix: string}>>([]);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);
  
  // Color customization state
  const [showColorPicker, setShowColorPicker] = useState(false);
  
  // Auto-save state
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [autoSaveStatus, setAutoSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const autoSaveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const previousCvRef = useRef<string | null>(null);
  
  // Predefined color palette for accent colors
  const COLOR_PRESETS = [
    { name: 'Indigo', value: '#4F46E5' },
    { name: 'Blue', value: '#2563EB' },
    { name: 'Teal', value: '#0D9488' },
    { name: 'Green', value: '#16A34A' },
    { name: 'Purple', value: '#7C3AED' },
    { name: 'Pink', value: '#DB2777' },
    { name: 'Red', value: '#DC2626' },
    { name: 'Orange', value: '#EA580C' },
    { name: 'Amber', value: '#D97706' },
    { name: 'Slate', value: '#475569' },
  ];

  const { template, isTemplate, cvData } = location.state || {};

  useEffect(() => {
    if (isTemplate && cvData) {
      const newCV: CV = {
        id: '',
        user_id: user?.id || '',
        template: template,
        personal_info: {
          full_name: '',
          email: '',
          phone: '',
          address: '',
          city: '',
          country: '',
          linkedin_url: '',
          github_url: '',
          portfolio_url: '',
          summary: '',
          ...cvData.personal_info
        },
        education: cvData.education || [],
        experience: cvData.experience || [],
        skills: cvData.skills || [],
        languages: cvData.languages || [],
        certifications: cvData.certifications || [],
        projects: cvData.projects || [],
        accent_color: cvData.accent_color || '#4F46E5',
        is_grayscale: cvData.is_grayscale || false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      
      setCV(newCV);
      setLoading(false);
      return;
    }

    if (!isTemplate && user && id) {
      const loadCV = async () => {
        try {
          const data = await api.getCV(id);
          if (!data) throw new Error('CV not found');
          // Ensure all fields have proper defaults by spreading defaults first, then data
          const loadedCV = {
            ...data,
            personal_info: {
              // Defaults first
              full_name: data.personal_info?.full_name || '',
              email: data.personal_info?.email || '',
              phone: data.personal_info?.phone || '',
              address: data.personal_info?.address || '',
              city: data.personal_info?.city || '',
              country: data.personal_info?.country || '',
              linkedin_url: data.personal_info?.linkedin_url || '',
              github_url: data.personal_info?.github_url || '',
              portfolio_url: data.personal_info?.portfolio_url || '',
              summary: data.personal_info?.summary || '',
              photo_url: data.personal_info?.photo_url || '',
            },
            education: data.education || [],
            experience: data.experience || [],
            skills: data.skills || [],
            languages: data.languages || [],
            certifications: data.certifications || [],
            projects: data.projects || [],
            accent_color: data.accent_color || '#4F46E5',
            is_grayscale: data.is_grayscale || false,
          };
          setCV(loadedCV as unknown as CV);
        } catch (error) {
          console.error('Error loading CV:', error);
          setError('Failed to load CV');
        } finally {
          setLoading(false);
        }
      };
      loadCV();
    }
  }, [id, user, isTemplate, cvData, template]);

  // Auto-save function
  const performAutoSave = useCallback(async () => {
    if (!cv || !user || !cv.id) return;
    
    try {
      setAutoSaveStatus('saving');
      
      const cvPayload = {
        template: cv.template,
        target_role: cv.target_role,
        personal_info: cv.personal_info,
        education: cv.education,
        experience: cv.experience,
        skills: cv.skills,
        languages: cv.languages,
        certifications: cv.certifications,
        projects: cv.projects || [],
        accent_color: cv.accent_color,
        is_grayscale: cv.is_grayscale,
      };

      await api.updateCV(cv.id, cvPayload);
      setLastSaved(new Date());
      setAutoSaveStatus('saved');
      
      // Reset status after 2 seconds
      setTimeout(() => setAutoSaveStatus('idle'), 2000);
    } catch (error) {
      console.error('Auto-save failed:', error);
      setAutoSaveStatus('error');
    }
  }, [cv, user]);

  // Auto-save effect - triggers 1.5 seconds after last change
  useEffect(() => {
    // Always clear previous timeout on every render to prevent memory leaks
    const currentTimeout = autoSaveTimeoutRef.current;
    
    if (!cv || !cv.id || loading) {
      return () => {
        if (currentTimeout) {
          clearTimeout(currentTimeout);
        }
      };
    }
    
    // Serialize CV to compare changes
    const cvString = JSON.stringify({
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
    
    // Skip if no previous state or no change
    if (previousCvRef.current === null) {
      previousCvRef.current = cvString;
      return () => {
        if (autoSaveTimeoutRef.current) {
          clearTimeout(autoSaveTimeoutRef.current);
        }
      };
    }
    
    if (previousCvRef.current === cvString) {
      return () => {
        if (autoSaveTimeoutRef.current) {
          clearTimeout(autoSaveTimeoutRef.current);
        }
      };
    }
    
    // Update previous state
    previousCvRef.current = cvString;
    
    // Clear existing timeout
    if (autoSaveTimeoutRef.current) {
      clearTimeout(autoSaveTimeoutRef.current);
    }
    
    // Set new timeout for auto-save (1.5 seconds after last change)
    autoSaveTimeoutRef.current = setTimeout(() => {
      performAutoSave();
    }, 1500);
    
    // Cleanup on unmount or re-render
    return () => {
      if (autoSaveTimeoutRef.current) {
        clearTimeout(autoSaveTimeoutRef.current);
      }
    };
  }, [cv, loading, performAutoSave]);

  // AI Generation Functions
  const handleGenerateSummary = async () => {
    if (!cv) return;
    setGeneratingSummary(true);
    try {
      const jobTitle = cv.experience?.[0]?.title || cv.target_role || 'Professional';
      const experienceYears = cv.experience?.length || 0;
      const skills = cv.skills?.map(s => s.name) || [];
      
      const summary = await aiApi.generateSummary({
        job_title: jobTitle,
        experience_years: experienceYears,
        skills: skills,
      });
      
      setCV({
        ...cv,
        personal_info: { ...cv.personal_info, summary }
      });
    } catch (err) {
      console.error('Error generating summary:', err);
      setError('Failed to generate summary');
    } finally {
      setGeneratingSummary(false);
    }
  };

  const handleEnhanceSummary = async () => {
    if (!cv || !cv.personal_info.summary) return;
    setEnhancingSummary(true);
    try {
      const enhanced = await aiApi.enhanceText({
        text: cv.personal_info.summary,
        context: 'professional CV summary'
      });
      
      setCV({
        ...cv,
        personal_info: { ...cv.personal_info, summary: enhanced }
      });
    } catch (err) {
      console.error('Error enhancing summary:', err);
      setError('Failed to enhance summary');
    } finally {
      setEnhancingSummary(false);
    }
  };

  const handleGenerateSkills = async () => {
    if (!cv) return;
    setGeneratingSkills(true);
    try {
      const jobTitle = cv.experience?.[0]?.title || cv.target_role || 'Software Developer';
      
      const skills = await aiApi.generateSkills({
        job_title: jobTitle,
        category: 'technical',
        num_skills: 8
      });
      
      const newSkills = skills.map(name => ({
        name,
        level: 3,
        category: 'Technical'
      }));
      
      setCV({
        ...cv,
        skills: [...cv.skills, ...newSkills]
      });
    } catch (err) {
      console.error('Error generating skills:', err);
      setError('Failed to generate skills');
    } finally {
      setGeneratingSkills(false);
    }
  };

  const handleGenerateBullets = async (index: number) => {
    if (!cv) return;
    setGeneratingBullets(index);
    try {
      const exp = cv.experience[index];
      
      const bullets = await aiApi.generateExperienceBullets({
        job_title: exp.title,
        company: exp.company,
        responsibilities: exp.description,
        num_bullets: 4
      });
      
      const newExperience = [...cv.experience];
      newExperience[index].description = bullets.map(b => `• ${b}`).join('\n');
      setCV({ ...cv, experience: newExperience });
    } catch (err) {
      console.error('Error generating bullets:', err);
      setError('Failed to generate bullets');
    } finally {
      setGeneratingBullets(null);
    }
  };

  const handleGenerateEducationDesc = async (index: number) => {
    if (!cv) return;
    setGeneratingEducation(index);
    try {
      const edu = cv.education[index];
      
      const description = await aiApi.generateEducation({
        degree: edu.degree,
        field: edu.institution,
        achievements: edu.description
      });
      
      const newEducation = [...cv.education];
      newEducation[index].description = description;
      setCV({ ...cv, education: newEducation });
    } catch (err) {
      console.error('Error generating education:', err);
      setError('Failed to generate description');
    } finally {
      setGeneratingEducation(null);
    }
  };

  const handleGetSuggestions = async () => {
    if (!cv) return;
    setLoadingSuggestions(true);
    try {
      const suggs = await aiApi.getSuggestions(cv as unknown as Record<string, unknown>);
      setSuggestions(suggs);
    } catch (err) {
      console.error('Error getting suggestions:', err);
    } finally {
      setLoadingSuggestions(false);
    }
  };

  // Handle uploaded PDF data - merge with existing CV and auto-save
  const handleUploadedData = async (data: {
    personal_info: Record<string, unknown>;
    experience: Array<Record<string, unknown>>;
    education: Array<Record<string, unknown>>;
    skills: Array<Record<string, unknown>>;
    projects: Array<Record<string, unknown>>;
  }) => {
    if (!cv || !user) return;

    const updatedCV = {
      ...cv,
      personal_info: {
        ...cv.personal_info,
        full_name: (data.personal_info.full_name as string) || cv.personal_info.full_name,
        email: (data.personal_info.email as string) || cv.personal_info.email,
        phone: (data.personal_info.phone as string) || cv.personal_info.phone,
        address: (data.personal_info.address as string) || cv.personal_info.address,
        summary: (data.personal_info.summary as string) || cv.personal_info.summary,
        linkedin_url: (data.personal_info.linkedin_url as string) || cv.personal_info.linkedin_url,
        github_url: (data.personal_info.github_url as string) || cv.personal_info.github_url,
        portfolio_url: (data.personal_info.portfolio_url as string) || cv.personal_info.portfolio_url,
      },
      education: data.education.length > 0 ? data.education.map(edu => ({
        degree: (edu.degree as string) || '',
        field_of_study: (edu.field_of_study as string) || '',
        institution: (edu.institution as string) || '',
        location: (edu.location as string) || '',
        start_date: (edu.start_date as string) || '',
        end_date: (edu.end_date as string) || '',
        gpa: (edu.gpa as string) || '',
        description: (edu.description as string) || '',
        achievements: (edu.achievements as string[]) || [],
      })) : cv.education,
      experience: data.experience.length > 0 ? data.experience.map(exp => ({
        title: (exp.title as string) || '',
        company: (exp.company as string) || '',
        location: (exp.location as string) || '',
        start_date: (exp.start_date as string) || '',
        end_date: (exp.end_date as string) || '',
        current: (exp.current as boolean) || false,
        description: (exp.description as string) || '',
        achievements: (exp.achievements as string[]) || [],
        keywords: [],
      })) : cv.experience,
      skills: data.skills.length > 0 ? data.skills.map(skill => ({
        name: (skill.name as string) || '',
        level: (skill.level as number) || 3,
        category: (skill.category as string) || 'Technical',
      })) : cv.skills,
      projects: data.projects.length > 0 ? data.projects.map(proj => ({
        name: (proj.name as string) || '',
        description: (proj.description as string) || '',
        technologies: (proj.technologies as string[]) || [],
        url: (proj.url as string) || '',
        github_url: (proj.github_url as string) || '',
        highlights: (proj.highlights as string[]) || [],
      })) : cv.projects || [],
    };
    
    setCV(updatedCV);
    setShowUploadModal(false);
    
    // Auto-save the uploaded data
    try {
      setSaving(true);
      const cvPayload = {
        template: updatedCV.template,
        target_role: updatedCV.target_role,
        personal_info: updatedCV.personal_info,
        education: updatedCV.education,
        experience: updatedCV.experience,
        skills: updatedCV.skills,
        languages: updatedCV.languages,
        certifications: updatedCV.certifications,
        projects: updatedCV.projects || [],
        accent_color: updatedCV.accent_color,
        is_grayscale: updatedCV.is_grayscale,
      };

      if (isTemplate || !updatedCV.id) {
        const result = await api.createCV(cvPayload);
        if (result.success && result.cv) {
          // Merge returned data with local state to preserve all fields
          setCV({
            ...updatedCV,
            ...result.cv,
            personal_info: { ...updatedCV.personal_info, ...result.cv.personal_info },
          } as unknown as CV);
          navigate(`/cv/edit/${result.cv.id}`, { replace: true });
        }
      } else {
        const result = await api.updateCV(updatedCV.id, cvPayload);
        if (result.success && result.cv) {
          // Merge returned data with local state to preserve all fields
          setCV({
            ...updatedCV,
            ...result.cv,
            personal_info: { ...updatedCV.personal_info, ...result.cv.personal_info },
          } as unknown as CV);
        }
      }
    } catch (error) {
      console.error('Error auto-saving uploaded data:', error);
      setError('Data imported but failed to save. Please save manually.');
    } finally {
      setSaving(false);
    }
  };

  // Section order manipulation functions
  const moveSectionUp = (sectionName: string) => {
    setSectionOrder(prev => {
      const index = prev.indexOf(sectionName);
      if (index <= 0) return prev;
      const newOrder = [...prev];
      [newOrder[index - 1], newOrder[index]] = [newOrder[index], newOrder[index - 1]];
      return newOrder;
    });
  };

  const moveSectionDown = (sectionName: string) => {
    setSectionOrder(prev => {
      const index = prev.indexOf(sectionName);
      if (index < 0 || index >= prev.length - 1) return prev;
      const newOrder = [...prev];
      [newOrder[index], newOrder[index + 1]] = [newOrder[index + 1], newOrder[index]];
      return newOrder;
    });
  };

  const getSectionLabel = (section: string): string => {
    const labels: Record<string, string> = {
      summary: 'Professional Summary',
      skills: 'Skills',
      experience: 'Work Experience',
      education: 'Education',
      projects: 'Projects',
      certifications: 'Certifications',
      languages: 'Languages'
    };
    return labels[section] || section;
  };

  const handleSave = async () => {
    if (!cv || !user) return;

    try {
      setSaving(true);
      setError('');

      const cvPayload = {
        template: cv.template,
        target_role: cv.target_role,
        personal_info: cv.personal_info,
        education: cv.education,
        experience: cv.experience,
        skills: cv.skills,
        languages: cv.languages,
        certifications: cv.certifications,
        projects: cv.projects || [],
        accent_color: cv.accent_color,
        is_grayscale: cv.is_grayscale,
      };

      if (isTemplate || !cv.id) {
        const result = await api.createCV(cvPayload);
        if (result.success && result.cv) {
          // Merge returned data with local state to preserve all fields
          setCV({
            ...cv,
            ...result.cv,
            personal_info: { ...cv.personal_info, ...result.cv.personal_info },
          } as unknown as CV);
          navigate(`/cv/edit/${result.cv.id}`, { replace: true });
          setLastSaved(new Date());
          // Update previous ref to prevent immediate auto-save
          previousCvRef.current = JSON.stringify({
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
        }
      } else {
        const result = await api.updateCV(cv.id, cvPayload);
        if (result.success && result.cv) {
          // Merge returned data with local state to preserve all fields
          setCV({
            ...cv,
            ...result.cv,
            personal_info: { ...cv.personal_info, ...result.cv.personal_info },
          } as unknown as CV);
          setLastSaved(new Date());
          // Update previous ref to prevent immediate auto-save
          previousCvRef.current = JSON.stringify({
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
        }
      }
    } catch (error) {
      console.error('Error saving CV:', error);
      setError('Failed to save changes');
    } finally {
      setSaving(false);
    }
  };

  const handleDownloadPDF = async () => {
    if (!cv) return;

    try {
      setError('');

      // Generate LaTeX with template-specific section ordering
      let latexTemplate: LaTeXExportOptions['template'] = 'professional';
      const templateMap: Record<string, LaTeXExportOptions['template']> = {
        'modern-minimal': 'minimal', 'minimal': 'minimal',
        'tech-focused': 'software-engineer', 'software-engineer': 'software-engineer',
        'classic-professional': 'professional', 'professional': 'professional',
        'fresher': 'fresher', 'entry-level': 'fresher',
        'data-scientist': 'data-scientist', 'data-science': 'data-scientist',
        'ai-ml-engineer': 'ai-ml', 'ai-ml': 'ai-ml',
      };
      if (cv.template && templateMap[cv.template]) {
        latexTemplate = templateMap[cv.template];
      } else if (cv.target_role) {
        latexTemplate = getRecommendedTemplate(cv.target_role);
      }

      const latexSource = generateLaTeX(cv, { template: latexTemplate });

      // Try LaTeX compilation first for proper template-specific PDF
      try {
        const pdfBlob = await api.compileLaTeX(latexSource, cv.personal_info.full_name?.replace(/\s+/g, '_') || 'resume');
        const url = window.URL.createObjectURL(pdfBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${cv.personal_info.full_name || 'cv'}_resume.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
        setShowDownloadMenu(false);
        return;
      } catch {
        // LaTeX compiler not available, fall back to FPDF
      }

      // Fallback: use FPDF-based PDF generation
      const pdfBlob = await api.exportPDFById(cv.id);
      const url = window.URL.createObjectURL(pdfBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${cv.personal_info.full_name || 'cv'}_resume.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      setShowDownloadMenu(false);
    } catch (error) {
      console.error('Error generating PDF:', error);
      setError('Failed to download PDF. Please try again.');
    }
  };

  const handleDownloadATSCV = async () => {
    if (!cv) return;
    try {
      setError('');
      const latexSource = generateATSCVLaTeX(cv);
      try {
        const pdfBlob = await api.compileLaTeX(latexSource, `${cv.personal_info.full_name?.replace(/\s+/g, '_') || 'cv'}_ATS_CV`);
        const url = window.URL.createObjectURL(pdfBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${cv.personal_info.full_name || 'cv'}_ATS_CV.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      } catch {
        downloadATSCVLaTeX(cv);
      }
      setShowDownloadMenu(false);
    } catch (error) {
      console.error('Error generating ATS CV:', error);
      setError('Failed to generate ATS CV. Downloaded as LaTeX instead.');
    }
  };

  const handleDownloadATSResume = async () => {
    if (!cv) return;
    try {
      setError('');
      const latexSource = generateATSResumeLaTeX(cv);
      try {
        const pdfBlob = await api.compileLaTeX(latexSource, `${cv.personal_info.full_name?.replace(/\s+/g, '_') || 'cv'}_ATS_Resume`);
        const url = window.URL.createObjectURL(pdfBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${cv.personal_info.full_name || 'cv'}_ATS_Resume.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      } catch {
        downloadATSResumeLaTeX(cv);
      }
      setShowDownloadMenu(false);
    } catch (error) {
      console.error('Error generating ATS Resume:', error);
      setError('Failed to generate ATS Resume. Downloaded as LaTeX instead.');
    }
  };

  const handleDownloadWord = async () => {
    if (!cv) return;

    // Build links section
    const linksHtml = [
      cv.personal_info.linkedin_url ? `<a href="${cv.personal_info.linkedin_url}">LinkedIn</a>` : '',
      cv.personal_info.github_url ? `<a href="${cv.personal_info.github_url}">GitHub</a>` : '',
      cv.personal_info.portfolio_url ? `<a href="${cv.personal_info.portfolio_url}">Portfolio</a>` : '',
    ].filter(Boolean).join(' | ');

    const htmlContent = `
      <html>
        <head>
          <meta charset="utf-8">
          <title>CV - ${cv.personal_info.full_name}</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; }
            .section { margin-bottom: 20px; }
            .section-title { font-size: 18px; font-weight: bold; }
            a { color: #0066cc; text-decoration: none; }
            a:hover { text-decoration: underline; }
          </style>
        </head>
        <body>
          <h1>${cv.personal_info.full_name}</h1>
          <p><a href="mailto:${cv.personal_info.email}">${cv.personal_info.email}</a> | ${cv.personal_info.phone}</p>
          <p>${cv.personal_info.address}</p>
          ${linksHtml ? `<p>${linksHtml}</p>` : ''}
          
          <div class="section">
            <div class="section-title">Professional Summary</div>
            <p>${cv.personal_info.summary}</p>
          </div>

          ${cv.experience.map(exp => `
            <div class="section">
              <div class="section-title">${exp.title}</div>
              <p>${exp.company} | ${exp.location}</p>
              <p>${exp.start_date} - ${exp.current ? 'Present' : exp.end_date}</p>
              <p>${exp.description}</p>
            </div>
          `).join('')}

          ${cv.education.map(edu => `
            <div class="section">
              <div class="section-title">${edu.degree}</div>
              <p>${edu.institution} | ${edu.location}</p>
              <p>${edu.start_date} - ${edu.end_date}</p>
              <p>${edu.description}</p>
            </div>
          `).join('')}

          <div class="section">
            <div class="section-title">Skills</div>
            ${cv.skills.map(skill => `
              <p>${skill.name} - ${skill.category} (${skill.level})</p>
            `).join('')}
          </div>
        </body>
      </html>
    `;

    const blob = new Blob([htmlContent], { type: 'application/msword' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${cv.personal_info.full_name || 'cv'}.doc`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    setShowDownloadMenu(false);
  };

  const handleDownloadLaTeX = () => {
    if (!cv) return;

    let latexTemplate: LaTeXExportOptions['template'] = 'professional';

    const templateMap: Record<string, LaTeXExportOptions['template']> = {
      'modern-minimal': 'minimal',
      'minimal': 'minimal',
      'tech-focused': 'software-engineer',
      'software-engineer': 'software-engineer',
      'classic-professional': 'professional',
      'professional': 'professional',
      'fresher': 'fresher',
      'entry-level': 'fresher',
      'data-scientist': 'data-scientist',
      'data-science': 'data-scientist',
      'ai-ml-engineer': 'ai-ml',
      'ai-ml': 'ai-ml',
    };

    if (cv.template && templateMap[cv.template]) {
      latexTemplate = templateMap[cv.template];
    } else if (cv.target_role) {
      latexTemplate = getRecommendedTemplate(cv.target_role);
    }

    downloadLaTeX(cv, undefined, { template: latexTemplate });
    setShowDownloadMenu(false);
  };

  const handleTemplateChange = (newTemplate: string) => {
    if (cv) {
      setCV({ ...cv, template: newTemplate });
    }
  };

  // Color customization handlers
  const handleAccentColorChange = (color: string) => {
    if (cv) {
      setCV({ ...cv, accent_color: color, is_grayscale: false });
    }
  };

  const handleGrayscaleToggle = () => {
    if (cv) {
      setCV({ ...cv, is_grayscale: !cv.is_grayscale });
    }
  };

  const renderTemplate = () => {
    if (!cv) return null;
    
    // Check if section order has been customized from default
    const isDefaultOrder = JSON.stringify(sectionOrder) === JSON.stringify([
      'summary', 'skills', 'experience', 'education', 'projects', 'certifications', 'languages'
    ]);
    
    // If using default order, use the selected template for proper styling
    // If sections are reordered, use OrderedTemplate with custom order
    if (isDefaultOrder) {
      const templateId = cv.template || cv.target_role || 'professional';
      const TemplateComponent = getTemplateComponent(templateId);
      return <TemplateComponent cv={cv} isViewMode={true} />;
    } else {
      // Use OrderedTemplate when sections are reordered
      return <OrderedTemplate cv={cv} isViewMode={true} sectionOrder={sectionOrder} templateName={cv.template || cv.target_role || 'professional'} />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-violet-50/30 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <div className="h-16 w-16 rounded-full border-4 border-violet-200 border-t-violet-500 animate-spin" />
            <Sparkles className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-6 w-6 text-violet-500" />
          </div>
          <p className="text-gray-500 font-medium">Loading your CV...</p>
        </div>
      </div>
    );
  }

  if (!cv) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-violet-50/30 flex items-center justify-center">
        <div className="text-center bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl p-8 max-w-md">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-100 flex items-center justify-center">
            <X className="h-8 w-8 text-red-500" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">CV not found</h2>
          <p className="text-gray-500 mb-6">The CV you're looking for doesn't exist or has been deleted.</p>
          <button
            onClick={() => navigate('/portfolio')}
            className="inline-flex items-center px-6 py-3 bg-violet-600 hover:bg-violet-700 text-white font-medium rounded-xl transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Portfolio
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-gradient-to-br from-gray-50 via-white to-violet-50/30 overflow-hidden">
      {/* Upload PDF Modal */}
      {showUploadModal && (
        <DocumentUpload 
          onDataExtracted={handleUploadedData}
          onClose={() => setShowUploadModal(false)}
        />
      )}

      {/* Modern Header */}
      <div className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-200/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Left: Back + Title */}
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/portfolio')}
                className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-xl transition-colors"
              >
                <ArrowLeft className="h-5 w-5" />
              </button>
              <div>
                <h1 className="font-semibold text-gray-900">
                  {cv.personal_info.full_name || 'Untitled CV'}
                </h1>
                <p className="text-sm text-gray-500">
                  Editing CV {showPreview ? '(Preview On)' : '(Preview Off)'}
                </p>
              </div>
            </div>

            {/* Right: Actions */}
            <div className="flex items-center gap-3">
              {/* AI Suggestions Button */}
              <button
                onClick={handleGetSuggestions}
                disabled={loadingSuggestions}
                className="hidden sm:inline-flex items-center gap-2 px-4 py-2 text-sm font-medium 
                  bg-gradient-to-r from-amber-400 to-orange-400 text-white rounded-xl
                  hover:from-amber-500 hover:to-orange-500 transition-all shadow-sm hover:shadow-md"
              >
                {loadingSuggestions ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Lightbulb className="h-4 w-4" />
                )}
                AI Tips
              </button>

              <button
                onClick={handleSave}
                disabled={saving}
                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium 
                  bg-gradient-to-r from-violet-600 to-purple-600 text-white rounded-xl
                  hover:from-violet-700 hover:to-purple-700 transition-all shadow-sm hover:shadow-md
                  disabled:opacity-50"
              >
                {saving ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Save className="h-4 w-4" />
                )}
                Save
              </button>

              {/* Auto-save Status Indicator */}
              <div className="hidden sm:flex items-center text-xs text-gray-500">
                {autoSaveStatus === 'saving' && (
                  <span className="flex items-center gap-1 text-violet-600">
                    <Loader2 className="h-3 w-3 animate-spin" />
                    Saving...
                  </span>
                )}
                {autoSaveStatus === 'saved' && (
                  <span className="flex items-center gap-1 text-green-600">
                    <Check className="h-3 w-3" />
                    Saved
                  </span>
                )}
                {autoSaveStatus === 'error' && (
                  <span className="text-red-500">Save failed</span>
                )}
                {autoSaveStatus === 'idle' && lastSaved && (
                  <span className="text-gray-400">
                    Last saved {lastSaved.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                )}
              </div>

              <button
                onClick={() => setShowShareDialog(true)}
                className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-xl transition-colors"
              >
                <Share2 className="h-5 w-5" />
              </button>

              <button
                onClick={() => setShowPreview(!showPreview)}
                className={`p-2 rounded-xl transition-colors ${
                  showPreview 
                    ? 'text-violet-600 bg-violet-100 hover:bg-violet-200' 
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                }`}
                title={showPreview ? 'Hide Preview' : 'Show Preview'}
              >
                {showPreview ? <PanelRightClose className="h-5 w-5" /> : <PanelRight className="h-5 w-5" />}
              </button>

              {/* Upload PDF Button */}
              <button
                onClick={() => setShowUploadModal(true)}
                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium 
                  bg-violet-500 hover:bg-violet-600 text-white rounded-xl transition-colors"
              >
                <Upload className="h-4 w-4" />
                Upload
              </button>

              <div className="relative">
                <button
                  onClick={() => setShowDownloadMenu(!showDownloadMenu)}
                  className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium 
                    bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl transition-colors"
                >
                  <Download className="h-4 w-4" />
                  Export
                </button>

                {showDownloadMenu && (
                  <div className="absolute right-0 mt-2 w-56 rounded-xl shadow-lg bg-white ring-1 ring-black/5 overflow-hidden z-50">
                    <div className="py-1">
                      {[
                        { label: 'Download PDF', onClick: handleDownloadPDF, icon: '📄' },
                        { label: 'Download Word', onClick: handleDownloadWord, icon: '📝' },
                        { label: 'Download LaTeX', onClick: handleDownloadLaTeX, icon: '📐' },
                      ].map((item) => (
                        <button
                          key={item.label}
                          onClick={item.onClick}
                          className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                          <span>{item.icon}</span>
                          {item.label}
                        </button>
                      ))}
                      <div className="border-t border-gray-100 my-1" />
                      <div className="px-4 py-1">
                        <span className="text-xs font-semibold text-indigo-600 uppercase tracking-wide">ATS Optimized</span>
                      </div>
                      {[
                        { label: 'ATS CV (Multi-page)', onClick: handleDownloadATSCV, icon: '📋' },
                        { label: 'ATS Resume (1-page)', onClick: handleDownloadATSResume, icon: '📑' },
                      ].map((item) => (
                        <button
                          key={item.label}
                          onClick={item.onClick}
                          className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-gray-700 hover:bg-indigo-50 transition-colors"
                        >
                          <span>{item.icon}</span>
                          {item.label}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Error Toast */}
      {error && (
        <div className="fixed top-20 right-4 z-50 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl shadow-lg flex items-center gap-3">
          <X className="h-5 w-5" />
          <span className="text-sm">{error}</span>
          <button onClick={() => setError('')} className="text-red-500 hover:text-red-700">
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* AI Suggestions Panel */}
      {suggestions.length > 0 && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200/50 rounded-2xl p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Lightbulb className="h-5 w-5 text-amber-500" />
                <h3 className="font-semibold text-amber-900">AI Suggestions</h3>
              </div>
              <button onClick={() => setSuggestions([])} className="text-amber-600 hover:text-amber-800">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="space-y-2">
              {suggestions.map((s, i) => (
                <div key={i} className="bg-white/60 rounded-lg p-3 text-sm">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="px-2 py-0.5 bg-amber-100 text-amber-700 rounded-full text-xs font-medium capitalize">
                      {s.section}
                    </span>
                  </div>
                  <p className="text-gray-600">{s.issue}</p>
                  <p className="text-amber-700 font-medium mt-1">💡 {s.fix}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Main Content - Side by Side Layout */}
      <div className="flex-1 flex gap-6 px-4 sm:px-6 lg:px-8 py-8 overflow-hidden">
        {/* Left Panel - Editor */}
        <div className={`${showPreview ? 'w-1/2' : 'w-full max-w-4xl mx-auto'} overflow-y-auto pr-2 transition-all duration-300`}>
          <div className="space-y-6">
            {/* Personal Information */}
            <Section 
              title="Personal Information" 
              icon={<User className="h-5 w-5" />}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <AIInput
                  label="Full Name"
                  value={cv.personal_info.full_name}
                  onChange={(value) => setCV({
                    ...cv,
                    personal_info: { ...cv.personal_info, full_name: value }
                  })}
                  placeholder="John Doe"
                  showAI={false}
                />
                <AIInput
                  label="Email"
                  value={cv.personal_info.email}
                  onChange={(value) => setCV({
                    ...cv,
                    personal_info: { ...cv.personal_info, email: value }
                  })}
                  placeholder="john@example.com"
                  showAI={false}
                />
                <AIInput
                  label="Phone"
                  value={cv.personal_info.phone}
                  onChange={(value) => setCV({
                    ...cv,
                    personal_info: { ...cv.personal_info, phone: value }
                  })}
                  placeholder="+1 234 567 890"
                  showAI={false}
                />
                <AIInput
                  label="Address"
                  value={cv.personal_info.address}
                  onChange={(value) => setCV({
                    ...cv,
                    personal_info: { ...cv.personal_info, address: value }
                  })}
                  placeholder="123 Main Street"
                  showAI={false}
                />
                <AIInput
                  label="City"
                  value={cv.personal_info.city || ''}
                  onChange={(value) => setCV({
                    ...cv,
                    personal_info: { ...cv.personal_info, city: value }
                  })}
                  placeholder="New York"
                  showAI={false}
                />
                <AIInput
                  label="Country"
                  value={cv.personal_info.country || ''}
                  onChange={(value) => setCV({
                    ...cv,
                    personal_info: { ...cv.personal_info, country: value }
                  })}
                  placeholder="United States"
                  showAI={false}
                />
              </div>

              {/* Social Links Section */}
              <div className="mt-4 pt-4 border-t border-gray-100">
                <p className="text-sm font-medium text-gray-600 mb-3">Social & Portfolio Links</p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <AIInput
                    label="LinkedIn URL"
                    value={cv.personal_info.linkedin_url || ''}
                    onChange={(value) => setCV({
                      ...cv,
                      personal_info: { ...cv.personal_info, linkedin_url: value }
                    })}
                    placeholder="https://linkedin.com/in/username"
                    showAI={false}
                  />
                  <AIInput
                    label="GitHub URL"
                    value={cv.personal_info.github_url || ''}
                    onChange={(value) => setCV({
                      ...cv,
                      personal_info: { ...cv.personal_info, github_url: value }
                    })}
                    placeholder="https://github.com/username"
                    showAI={false}
                  />
                  <AIInput
                    label="Portfolio URL"
                    value={cv.personal_info.portfolio_url || ''}
                    onChange={(value) => setCV({
                      ...cv,
                      personal_info: { ...cv.personal_info, portfolio_url: value }
                    })}
                    placeholder="https://yourportfolio.com"
                    showAI={false}
                  />
                </div>
              </div>
              
              <div className="mt-4">
                <AIInput
                  label="Professional Summary"
                  value={cv.personal_info.summary}
                  onChange={(value) => setCV({
                    ...cv,
                    personal_info: { ...cv.personal_info, summary: value }
                  })}
                  onGenerate={handleGenerateSummary}
                  onEnhance={handleEnhanceSummary}
                  generating={generatingSummary}
                  enhancing={enhancingSummary}
                  placeholder="A brief summary of your professional background..."
                  multiline
                  rows={4}
                />
              </div>
            </Section>

            {/* Experience */}
            <Section 
              title="Work Experience" 
              icon={<Briefcase className="h-5 w-5" />}
              badge={cv.experience.length}
              onAdd={() => setCV({
                ...cv,
                experience: [...cv.experience, {
                  title: '',
                  company: '',
                  location: '',
                  start_date: '',
                  end_date: '',
                  current: false,
                  description: '',
                  achievements: [],
                  keywords: []
                }]
              })}
              addLabel="Add Position"
            >
              {cv.experience.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Briefcase className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                  <p>No experience added yet</p>
                  <p className="text-sm">Click "Add Position" to get started</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {cv.experience.map((exp, index) => (
                    <EntryCard
                      key={index}
                      title={exp.title || `Position #${index + 1}`}
                      subtitle={exp.company}
                      onRemove={() => {
                        const newExp = [...cv.experience];
                        newExp.splice(index, 1);
                        setCV({ ...cv, experience: newExp });
                      }}
                    >
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <AIInput
                          label="Job Title"
                          value={exp.title}
                          onChange={(value) => {
                            const newExp = [...cv.experience];
                            newExp[index].title = value;
                            setCV({ ...cv, experience: newExp });
                          }}
                          placeholder="Software Engineer"
                          showAI={false}
                        />
                        <AIInput
                          label="Company"
                          value={exp.company}
                          onChange={(value) => {
                            const newExp = [...cv.experience];
                            newExp[index].company = value;
                            setCV({ ...cv, experience: newExp });
                          }}
                          placeholder="Google"
                          showAI={false}
                        />
                        <AIInput
                          label="Location"
                          value={exp.location}
                          onChange={(value) => {
                            const newExp = [...cv.experience];
                            newExp[index].location = value;
                            setCV({ ...cv, experience: newExp });
                          }}
                          placeholder="San Francisco, CA"
                          showAI={false}
                        />
                        <div className="flex gap-4">
                          <div className="flex-1">
                            <label className="text-sm font-medium text-gray-700">Start Date</label>
                            <input
                              type="date"
                              value={exp.start_date}
                              onChange={(e) => {
                                const newExp = [...cv.experience];
                                newExp[index].start_date = e.target.value;
                                setCV({ ...cv, experience: newExp });
                              }}
                              className="mt-2 w-full px-4 py-3 rounded-xl border border-gray-200 bg-white/80 
                                focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 transition-all"
                            />
                          </div>
                          <div className="flex-1">
                            <label className="text-sm font-medium text-gray-700">End Date</label>
                            <input
                              type="date"
                              value={exp.end_date}
                              disabled={exp.current}
                              onChange={(e) => {
                                const newExp = [...cv.experience];
                                newExp[index].end_date = e.target.value;
                                setCV({ ...cv, experience: newExp });
                              }}
                              className="mt-2 w-full px-4 py-3 rounded-xl border border-gray-200 bg-white/80 
                                focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 transition-all
                                disabled:bg-gray-100"
                            />
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2 mt-2">
                        <input
                          type="checkbox"
                          id={`current-${index}`}
                          checked={exp.current}
                          onChange={(e) => {
                            const newExp = [...cv.experience];
                            newExp[index].current = e.target.checked;
                            setCV({ ...cv, experience: newExp });
                          }}
                          className="h-4 w-4 text-violet-600 focus:ring-violet-500 border-gray-300 rounded"
                        />
                        <label htmlFor={`current-${index}`} className="text-sm text-gray-600">
                          I currently work here
                        </label>
                      </div>

                      <div className="mt-4">
                        <div className="flex items-center justify-between mb-2">
                          <label className="text-sm font-medium text-gray-700">Description</label>
                          <AIButton
                            onClick={() => handleGenerateBullets(index)}
                            loading={generatingBullets === index}
                            variant="generate"
                            disabled={!exp.title}
                          >
                            Generate Bullets
                          </AIButton>
                        </div>
                        <textarea
                          value={exp.description}
                          onChange={(e) => {
                            const newExp = [...cv.experience];
                            newExp[index].description = e.target.value;
                            setCV({ ...cv, experience: newExp });
                          }}
                          rows={4}
                          placeholder="• Led development of key features...
• Improved system performance by..."
                          className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white/80
                            focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 transition-all
                            text-gray-900 placeholder-gray-400"
                        />
                      </div>
                    </EntryCard>
                  ))}
                </div>
              )}
            </Section>

            {/* Education */}
            <Section 
                title="Education" 
                icon={<GraduationCap className="h-5 w-5" />}
                badge={cv.education.length}
                onAdd={() => setCV({
                  ...cv,
                  education: [...cv.education, {
                    degree: '',
                    field_of_study: '',
                    institution: '',
                    location: '',
                    start_date: '',
                    end_date: '',
                    gpa: '',
                    description: '',
                    achievements: []
                  }]
                })}
                addLabel="Add Education"
              >
                {cv.education.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <GraduationCap className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                    <p>No education added yet</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {cv.education.map((edu, index) => (
                      <EntryCard
                        key={index}
                        title={edu.degree || `Education #${index + 1}`}
                        subtitle={edu.institution}
                        onRemove={() => {
                          const newEdu = [...cv.education];
                          newEdu.splice(index, 1);
                          setCV({ ...cv, education: newEdu });
                        }}
                      >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <AIInput
                            label="Degree"
                            value={edu.degree}
                            onChange={(value) => {
                              const newEdu = [...cv.education];
                              newEdu[index].degree = value;
                              setCV({ ...cv, education: newEdu });
                            }}
                            placeholder="Bachelor of Science"
                            showAI={false}
                          />
                          <AIInput
                            label="Field of Study"
                            value={edu.field_of_study || ''}
                            onChange={(value) => {
                              const newEdu = [...cv.education];
                              newEdu[index].field_of_study = value;
                              setCV({ ...cv, education: newEdu });
                            }}
                            placeholder="Computer Science"
                            showAI={false}
                          />
                          <AIInput
                            label="Institution"
                            value={edu.institution}
                            onChange={(value) => {
                              const newEdu = [...cv.education];
                              newEdu[index].institution = value;
                              setCV({ ...cv, education: newEdu });
                            }}
                            placeholder="Stanford University"
                            showAI={false}
                          />
                          <AIInput
                            label="GPA (optional)"
                            value={edu.gpa || ''}
                            onChange={(value) => {
                              const newEdu = [...cv.education];
                              newEdu[index].gpa = value;
                              setCV({ ...cv, education: newEdu });
                            }}
                            placeholder="3.8/4.0"
                            showAI={false}
                          />
                          <AIInput
                            label="Location"
                            value={edu.location}
                            onChange={(value) => {
                              const newEdu = [...cv.education];
                              newEdu[index].location = value;
                              setCV({ ...cv, education: newEdu });
                            }}
                            placeholder="Stanford, CA"
                            showAI={false}
                          />
                          <div className="flex gap-4">
                            <div className="flex-1">
                              <label className="text-sm font-medium text-gray-700">Start</label>
                              <input
                                type="date"
                                value={edu.start_date}
                                onChange={(e) => {
                                  const newEdu = [...cv.education];
                                  newEdu[index].start_date = e.target.value;
                                  setCV({ ...cv, education: newEdu });
                                }}
                                className="mt-2 w-full px-4 py-3 rounded-xl border border-gray-200 bg-white/80 
                                  focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500"
                              />
                            </div>
                            <div className="flex-1">
                              <label className="text-sm font-medium text-gray-700">End</label>
                              <input
                                type="date"
                                value={edu.end_date}
                                onChange={(e) => {
                                  const newEdu = [...cv.education];
                                  newEdu[index].end_date = e.target.value;
                                  setCV({ ...cv, education: newEdu });
                                }}
                                className="mt-2 w-full px-4 py-3 rounded-xl border border-gray-200 bg-white/80 
                                  focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500"
                              />
                            </div>
                          </div>
                        </div>

                        <div className="mt-4">
                          <div className="flex items-center justify-between mb-2">
                            <label className="text-sm font-medium text-gray-700">Description</label>
                            <AIButton
                              onClick={() => handleGenerateEducationDesc(index)}
                              loading={generatingEducation === index}
                              variant="generate"
                              disabled={!edu.degree}
                            >
                              Generate
                            </AIButton>
                          </div>
                          <textarea
                            value={edu.description}
                            onChange={(e) => {
                              const newEdu = [...cv.education];
                              newEdu[index].description = e.target.value;
                              setCV({ ...cv, education: newEdu });
                            }}
                            rows={2}
                            placeholder="Relevant coursework, achievements..."
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white/80
                              focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500"
                          />
                        </div>
                      </EntryCard>
                    ))}
                  </div>
                )}
            </Section>

            {/* Skills */}
            <Section 
                title="Skills" 
                icon={<Code className="h-5 w-5" />}
                badge={cv.skills.length}
                onAdd={() => setCV({
                  ...cv,
                  skills: [...cv.skills, { name: '', level: 3, category: 'Technical' }]
                })}
                addLabel="Add Skill"
              >
                <div className="flex items-center justify-between mb-4">
                  <p className="text-sm text-gray-500">Add your technical and soft skills</p>
                  <AIButton
                    onClick={handleGenerateSkills}
                    loading={generatingSkills}
                    variant="add"
                  >
                    Auto-Generate Skills
                  </AIButton>
                </div>
                
                {cv.skills.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <Code className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                    <p>No skills added yet</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {cv.skills.map((skill, index) => (
                      <div key={index} className="bg-gray-50/50 rounded-xl border border-gray-200/50 p-4 group">
                        <div className="flex items-start justify-between gap-2 mb-3">
                          <input
                            type="text"
                            value={skill.name}
                            onChange={(e) => {
                              const newSkills = [...cv.skills];
                              newSkills[index].name = e.target.value;
                              setCV({ ...cv, skills: newSkills });
                            }}
                            placeholder="Skill name"
                            className="flex-1 px-3 py-2 rounded-lg border border-gray-200 bg-white/80 
                              focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 text-sm"
                          />
                          <button
                            onClick={() => {
                              const newSkills = [...cv.skills];
                              newSkills.splice(index, 1);
                              setCV({ ...cv, skills: newSkills });
                            }}
                            className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 
                              rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                        <div className="flex items-center gap-2">
                          <select
                            value={skill.level}
                            onChange={(e) => {
                              const newSkills = [...cv.skills];
                              newSkills[index].level = parseInt(e.target.value);
                              setCV({ ...cv, skills: newSkills });
                            }}
                            className="flex-1 px-3 py-2 rounded-lg border border-gray-200 bg-white/80 
                              focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 text-sm"
                          >
                            <option value={1}>Beginner</option>
                            <option value={2}>Intermediate</option>
                            <option value={3}>Advanced</option>
                            <option value={4}>Expert</option>
                            <option value={5}>Master</option>
                          </select>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
            </Section>

            {/* Projects */}
            <Section 
                title="Projects" 
                icon={<Code className="h-5 w-5" />}
                badge={cv.projects?.length || 0}
                onAdd={() => setCV({
                  ...cv,
                  projects: [...(cv.projects || []), { 
                    name: '', 
                    description: '', 
                    technologies: [], 
                    url: '', 
                    github_url: '',
                    highlights: []
                  }]
                })}
                addLabel="Add Project"
              >
                {(!cv.projects || cv.projects.length === 0) ? (
                  <div className="text-center py-8 text-gray-500">
                    <Code className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                    <p>No projects added yet</p>
                    <p className="text-sm">Showcase your work by adding projects</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {(cv.projects || []).map((project, index) => (
                      <EntryCard
                        key={index}
                        title={project.name || `Project #${index + 1}`}
                        subtitle={project.technologies?.join(', ') || ''}
                        onRemove={() => {
                          const newProjects = [...(cv.projects || [])];
                          newProjects.splice(index, 1);
                          setCV({ ...cv, projects: newProjects });
                        }}
                      >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <AIInput
                            label="Project Name"
                            value={project.name}
                            onChange={(value) => {
                              const newProjects = [...(cv.projects || [])];
                              newProjects[index].name = value;
                              setCV({ ...cv, projects: newProjects });
                            }}
                            placeholder="E-Commerce Platform"
                            showAI={false}
                          />
                          <AIInput
                            label="Technologies (comma separated)"
                            value={project.technologies?.join(', ') || ''}
                            onChange={(value) => {
                              const newProjects = [...(cv.projects || [])];
                              newProjects[index].technologies = value.split(',').map(t => t.trim()).filter(Boolean);
                              setCV({ ...cv, projects: newProjects });
                            }}
                            placeholder="React, Node.js, MongoDB"
                            showAI={false}
                          />
                          <AIInput
                            label="Live Demo URL (optional)"
                            value={project.url || ''}
                            onChange={(value) => {
                              const newProjects = [...(cv.projects || [])];
                              newProjects[index].url = value;
                              setCV({ ...cv, projects: newProjects });
                            }}
                            placeholder="https://myproject.com"
                            showAI={false}
                          />
                          <AIInput
                            label="GitHub URL (optional)"
                            value={project.github_url || ''}
                            onChange={(value) => {
                              const newProjects = [...(cv.projects || [])];
                              newProjects[index].github_url = value;
                              setCV({ ...cv, projects: newProjects });
                            }}
                            placeholder="https://github.com/user/project"
                            showAI={false}
                          />
                        </div>
                        <div className="mt-4">
                          <AIInput
                            label="Description"
                            value={project.description}
                            onChange={(value) => {
                              const newProjects = [...(cv.projects || [])];
                              newProjects[index].description = value;
                              setCV({ ...cv, projects: newProjects });
                            }}
                            placeholder="Describe what the project does, your role, and key achievements..."
                            multiline
                            rows={3}
                            showAI={false}
                          />
                        </div>
                        <div className="mt-4">
                          <label className="text-sm font-medium text-gray-700">Key Highlights (one per line)</label>
                          <textarea
                            value={project.highlights?.join('\n') || ''}
                            onChange={(e) => {
                              const newProjects = [...(cv.projects || [])];
                              newProjects[index].highlights = e.target.value.split('\n').filter(h => h.trim());
                              setCV({ ...cv, projects: newProjects });
                            }}
                            rows={3}
                            placeholder="• Increased user engagement by 40%\n• Implemented real-time notifications\n• Deployed to 10,000+ users"
                            className="mt-2 w-full px-4 py-3 rounded-xl border border-gray-200 bg-white/80
                              focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500
                              text-gray-900 placeholder-gray-400"
                          />
                        </div>
                      </EntryCard>
                    ))}
                  </div>
                )}
            </Section>

            {/* Languages */}
            <Section 
                title="Languages" 
                icon={<Languages className="h-5 w-5" />}
                badge={cv.languages.length}
                onAdd={() => setCV({
                  ...cv,
                  languages: [...cv.languages, { name: '', proficiency: 'basic' as const }]
                })}
                addLabel="Add Language"
              >
                {cv.languages.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <Languages className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                    <p>No languages added yet</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {cv.languages.map((lang, index) => (
                      <div key={index} className="bg-gray-50/50 rounded-xl border border-gray-200/50 p-4 group">
                        <div className="flex items-start justify-between gap-2 mb-3">
                          <input
                            type="text"
                            value={lang.name}
                            onChange={(e) => {
                              const newLangs = [...cv.languages];
                              newLangs[index].name = e.target.value;
                              setCV({ ...cv, languages: newLangs });
                            }}
                            placeholder="Language"
                            className="flex-1 px-3 py-2 rounded-lg border border-gray-200 bg-white/80 
                              focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 text-sm"
                          />
                          <button
                            onClick={() => {
                              const newLangs = [...cv.languages];
                              newLangs.splice(index, 1);
                              setCV({ ...cv, languages: newLangs });
                            }}
                            className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 
                              rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                        <select
                          value={lang.proficiency}
                          onChange={(e) => {
                            const newLangs = [...cv.languages];
                            newLangs[index].proficiency = e.target.value as 'basic' | 'conversational' | 'professional' | 'native';
                            setCV({ ...cv, languages: newLangs });
                          }}
                          className="w-full px-3 py-2 rounded-lg border border-gray-200 bg-white/80 
                            focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 text-sm"
                        >
                          <option value="basic">Basic</option>
                          <option value="conversational">Conversational</option>
                          <option value="professional">Professional</option>
                          <option value="native">Native</option>
                        </select>
                      </div>
                    ))}
                  </div>
                )}
            </Section>

            {/* Certifications */}
            <Section 
                title="Certifications" 
                icon={<Award className="h-5 w-5" />}
                badge={cv.certifications.length}
                onAdd={() => setCV({
                  ...cv,
                  certifications: [...cv.certifications, { name: '', issuer: '', date: '', url: '' }]
                })}
                addLabel="Add Certification"
              >
                {cv.certifications.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <Award className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                    <p>No certifications added yet</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {cv.certifications.map((cert, index) => (
                      <EntryCard
                        key={index}
                        title={cert.name || `Certification #${index + 1}`}
                        subtitle={cert.issuer}
                        onRemove={() => {
                          const newCerts = [...cv.certifications];
                          newCerts.splice(index, 1);
                          setCV({ ...cv, certifications: newCerts });
                        }}
                      >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <AIInput
                            label="Certification Name"
                            value={cert.name}
                            onChange={(value) => {
                              const newCerts = [...cv.certifications];
                              newCerts[index].name = value;
                              setCV({ ...cv, certifications: newCerts });
                            }}
                            placeholder="AWS Solutions Architect"
                            showAI={false}
                          />
                          <AIInput
                            label="Issuer"
                            value={cert.issuer}
                            onChange={(value) => {
                              const newCerts = [...cv.certifications];
                              newCerts[index].issuer = value;
                              setCV({ ...cv, certifications: newCerts });
                            }}
                            placeholder="Amazon Web Services"
                            showAI={false}
                          />
                          <div>
                            <label className="text-sm font-medium text-gray-700">Date Earned</label>
                            <input
                              type="date"
                              value={cert.date}
                              onChange={(e) => {
                                const newCerts = [...cv.certifications];
                                newCerts[index].date = e.target.value;
                                setCV({ ...cv, certifications: newCerts });
                              }}
                              className="mt-2 w-full px-4 py-3 rounded-xl border border-gray-200 bg-white/80 
                                focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500"
                            />
                          </div>
                          <AIInput
                            label="Credential URL (optional)"
                            value={cert.url || ''}
                            onChange={(value) => {
                              const newCerts = [...cv.certifications];
                              newCerts[index].url = value;
                              setCV({ ...cv, certifications: newCerts });
                            }}
                            placeholder="https://..."
                            showAI={false}
                          />
                        </div>
                      </EntryCard>
                    ))}
                  </div>
                )}
            </Section>
          </div>
        </div>

        {/* Right Panel - Live Preview */}
        {showPreview && (
          <div className="w-1/2 flex flex-col overflow-hidden">
            {/* Preview Header with Controls */}
            <div className="bg-white/80 backdrop-blur-xl rounded-t-2xl border border-gray-200/50 border-b-0 px-4 py-3 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-gradient-to-br from-violet-100 to-purple-100 text-violet-600">
                  <Eye className="h-4 w-4" />
                </div>
                <h3 className="font-semibold text-gray-900">Live Preview</h3>
              </div>
              <div className="flex items-center gap-2">
                {/* Template Selector */}
                <div className="w-48">
                  <TemplateDropdown
                    selectedTemplate={cv.template || 'professional'}
                    onSelectTemplate={handleTemplateChange}
                    targetRole={cv.target_role}
                  />
                </div>
                
                {/* Accent Color Picker */}
                <div className="relative">
                  <button
                    onClick={() => setShowColorPicker(!showColorPicker)}
                    className="w-8 h-8 rounded-full border-2 border-gray-300 shadow-sm hover:border-violet-400 transition-colors"
                    style={{ 
                      backgroundColor: cv.is_grayscale ? '#6B7280' : (cv.accent_color || '#4F46E5')
                    }}
                    title="Change accent color"
                  />
                </div>

                {/* Black & White Toggle */}
                <button
                  onClick={handleGrayscaleToggle}
                  className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-xs font-medium transition-all ${
                    cv.is_grayscale
                      ? 'bg-gray-900 text-white border-gray-900'
                      : 'bg-white text-gray-600 border-gray-300 hover:border-gray-400'
                  }`}
                  title="Toggle black & white mode"
                >
                  {cv.is_grayscale && <Check className="w-3 h-3" />}
                  B&W
                </button>
                
                {/* Section Order Button */}
                <button
                  onClick={() => setShowSectionOrderPanel(!showSectionOrderPanel)}
                  className={`p-2 rounded-xl transition-colors ${
                    showSectionOrderPanel 
                      ? 'text-violet-600 bg-violet-100 hover:bg-violet-200' 
                      : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                  }`}
                  title="Rearrange Sections"
                >
                  <Settings2 className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Section Order Panel */}
            {showSectionOrderPanel && (
              <div className="bg-white border-x border-gray-200/50 px-4 py-3">
                <p className="text-xs text-gray-500 mb-2">Drag sections to reorder:</p>
                <div className="space-y-1">
                  {sectionOrder.map((section, index) => (
                    <div key={section} className="flex items-center gap-2 bg-gray-50 rounded-lg px-3 py-2">
                      <GripVertical className="h-4 w-4 text-gray-400 cursor-move" />
                      <span className="flex-1 text-sm text-gray-700">{getSectionLabel(section)}</span>
                      <button
                        onClick={() => moveSectionUp(section)}
                        disabled={index === 0}
                        className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-30 disabled:cursor-not-allowed"
                      >
                        <ChevronUp className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => moveSectionDown(section)}
                        disabled={index === sectionOrder.length - 1}
                        className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-30 disabled:cursor-not-allowed rotate-180"
                      >
                        <ChevronUp className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Preview Content */}
            <div className="flex-1 bg-white/80 backdrop-blur-xl rounded-b-2xl border border-gray-200/50 border-t-0 overflow-y-auto p-4">
              <div ref={cvRef} className="transform scale-[0.85] origin-top">
                {renderTemplate()}
              </div>
            </div>
          </div>
        )}

        {/* Share Dialog */}
        {showShareDialog && (
          <ShareCVDialog
            cvId={cv.id}
            onClose={() => setShowShareDialog(false)}
            onSuccess={() => {
              setShowShareDialog(false);
              navigate('/creators');
            }}
          />
        )}
      </div>

      {/* Color Picker Panel - Fixed position portal */}
      {showColorPicker && (
        <>
          <div 
            className="fixed inset-0 bg-black/10 z-[9998]" 
            onClick={() => setShowColorPicker(false)}
          />
          <div className="fixed top-24 right-6 z-[9999] bg-white rounded-2xl shadow-2xl border border-gray-200 p-4 w-16">
            <p className="text-[10px] font-medium text-gray-500 mb-3 text-center">Colors</p>
            <div className="flex flex-col gap-2 items-center">
              {COLOR_PRESETS.map((color) => (
                <button
                  key={color.value}
                  onClick={() => {
                    handleAccentColorChange(color.value);
                    setShowColorPicker(false);
                  }}
                  className={`w-9 h-9 rounded-full border-2 transition-all hover:scale-110 ${
                    cv.accent_color === color.value && !cv.is_grayscale
                      ? 'border-gray-900 ring-2 ring-offset-1 ring-violet-400'
                      : 'border-gray-200 hover:border-gray-400'
                  }`}
                  style={{ backgroundColor: color.value }}
                  title={color.name}
                />
              ))}
              <div className="border-t border-gray-200 pt-3 mt-2 w-full">
                <input
                  type="color"
                  value={cv.accent_color || '#4F46E5'}
                  onChange={(e) => handleAccentColorChange(e.target.value)}
                  className="w-9 h-9 rounded-full cursor-pointer mx-auto block border-0"
                  title="Custom color"
                />
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
