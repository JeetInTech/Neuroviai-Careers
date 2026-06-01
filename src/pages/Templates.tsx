import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import api from '../lib/api';
import { getFullTemplatePreview } from '../components/templatePreviewHelpers';
import {
  Layout,
  Search,
  X,
  Plus,
  Loader2,
  LogIn,
  UserPlus,
  Shield,
  Sparkles,
  AlertTriangle,
  TrendingUp,
  Eye,
  SlidersHorizontal,
  Terminal,
  BarChart3,
  Palette,
  Briefcase,
  FileText
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
// CV TEMPLATES
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
    classification: 'Recommended' as const,
    atsScore: 98,
    isUniversalSafe: false,
  },
  {
    id: 'mobile-app-developer',
    name: 'Mobile App Developer',
    color: 'from-green-500 to-emerald-600',
    description: 'Showcase iOS/Android apps and store deployments',
    targetRole: 'mobile-app-developer' as const,
    category: 'Engineering & Tech',
    premium: false,
    classification: 'Recommended' as const,
    atsScore: 95,
    isUniversalSafe: false,
  },
  {
    id: 'systems-engineer',
    name: 'Systems Engineer',
    color: 'from-slate-500 to-gray-700',
    description: 'Infrastructure, DevOps, and cloud architecture',
    targetRole: 'systems-engineer' as const,
    category: 'Engineering & Tech',
    premium: false,
    classification: 'Recommended' as const,
    atsScore: 95,
    isUniversalSafe: false,
  },
  {
    id: 'devops-engineer',
    name: 'DevOps Engineer',
    color: 'from-orange-500 to-red-600',
    description: 'CI/CD, cloud infrastructure, and reliability',
    targetRole: 'devops-engineer' as const,
    category: 'Engineering & Tech',
    premium: false,
    classification: 'Recommended' as const,
    atsScore: 96,
    isUniversalSafe: false,
  },
  // === DATA & AI ===
  {
    id: 'data-scientist',
    name: 'Data Scientist',
    color: 'from-purple-500 to-pink-600',
    description: 'Highlight analytics skills, tools, and methodologies',
    targetRole: 'data-scientist' as const,
    category: 'Data & AI',
    premium: false,
    classification: 'Recommended' as const,
    atsScore: 96,
    isUniversalSafe: false,
  },
  {
    id: 'ai-ml-engineer',
    name: 'AI/ML Engineer',
    color: 'from-teal-500 to-cyan-600',
    description: 'Focus on ML frameworks, models, and research',
    targetRole: 'ai-ml-engineer' as const,
    category: 'Data & AI',
    premium: false,
    classification: 'Recommended' as const,
    atsScore: 96,
    isUniversalSafe: false,
  },
  // === BUSINESS & MANAGEMENT ===
  {
    id: 'project-manager',
    name: 'Project Manager',
    color: 'from-amber-500 to-orange-600',
    description: 'Delivery metrics, PMP certifications, and Agile',
    targetRole: 'project-manager' as const,
    category: 'Business & Management',
    premium: false,
    classification: 'Recommended' as const,
    atsScore: 97,
    isUniversalSafe: false,
  },
  {
    id: 'business-analyst',
    name: 'Business Analyst',
    color: 'from-emerald-500 to-teal-600',
    description: 'Requirements analysis and data-driven insights',
    targetRole: 'business-analyst' as const,
    category: 'Business & Management',
    premium: false,
    classification: 'Recommended' as const,
    atsScore: 96,
    isUniversalSafe: false,
  },
  {
    id: 'marketing',
    name: 'Marketing Professional',
    color: 'from-violet-500 to-fuchsia-600',
    description: 'Campaign ROI, growth metrics, and brand strategy',
    targetRole: 'marketing' as const,
    category: 'Business & Management',
    premium: false,
    classification: 'Recommended' as const,
    atsScore: 94,
    isUniversalSafe: false,
  },
  // === CREATIVE ===
  {
    id: 'creative',
    name: 'Creative',
    color: 'from-pink-400 to-purple-500',
    description: 'Gradient-styled layout for creative professionals',
    targetRole: 'creative' as const,
    category: 'Creative',
    premium: false,
    classification: 'Acceptable' as const,
    atsScore: 80,
    isUniversalSafe: false,
  },

  {
    id: 'graphic-designer',
    name: 'Graphic Designer',
    color: 'from-indigo-500 to-purple-600',
    description: 'ATS-safe design portfolio showcase',
    targetRole: 'graphic-designer' as const,
    category: 'Creative',
    premium: false,
    classification: 'Acceptable' as const,
    atsScore: 85,
    isUniversalSafe: false,
  },
  {
    id: 'video-editor',
    name: 'Video Editor',
    color: 'from-red-500 to-rose-600',
    description: 'Showcase editing reels, tools, and production work',
    targetRole: 'video-editor' as const,
    category: 'Creative',
    premium: false,
    classification: 'Acceptable' as const,
    atsScore: 82,
    isUniversalSafe: false,
  },
  {
    id: 'content-writer',
    name: 'Content Writer',
    color: 'from-pink-500 to-rose-600',
    description: 'SEO content, blogs, and copywriting',
    targetRole: 'content-writer' as const,
    category: 'Creative',
    premium: false,
    classification: 'Recommended' as const,
    atsScore: 95,
    isUniversalSafe: false,
  },
  // === GENERAL ===
  {
    id: 'professional',
    name: 'Professional',
    color: 'from-blue-600 to-blue-800',
    description: 'Clean, classic layout suitable for any industry',
    targetRole: 'professional' as const,
    category: 'General',
    premium: false,
    classification: 'Recommended' as const,
    atsScore: 99,
    isUniversalSafe: true,
  },
  {
    id: 'minimal',
    name: 'Minimal',
    color: 'from-gray-400 to-gray-600',
    description: 'Simple, elegant design with focus on content',
    targetRole: 'minimal' as const,
    category: 'General',
    premium: false,
    classification: 'Recommended' as const,
    atsScore: 99,
    isUniversalSafe: true,
  },
  {
    id: 'fresher',
    name: 'Fresher / Student',
    color: 'from-cyan-500 to-blue-600',
    description: 'Highlight education, projects, and internships',
    targetRole: 'fresher' as const,
    category: 'General',
    premium: false,
    classification: 'Recommended' as const,
    atsScore: 95,
    isUniversalSafe: true,
  },
  {
    id: 'freelancer',
    name: 'Freelancer',
    color: 'from-pink-500 to-rose-600',
    description: 'Client-focused with portfolio highlights',
    targetRole: 'freelancer' as const,
    category: 'General',
    premium: false,
    classification: 'Acceptable' as const,
    atsScore: 88,
    isUniversalSafe: false,
  },
  {
    id: 'executive',
    name: 'Executive',
    color: 'from-gray-700 to-slate-800',
    description: 'Leadership, strategic planning, and P&L',
    targetRole: 'executive' as const,
    category: 'General',
    premium: false,
    classification: 'Recommended' as const,
    atsScore: 97,
    isUniversalSafe: false,
  },
  {
    id: 'academic',
    name: 'Academic / Research',
    color: 'from-gray-600 to-gray-800',
    description: 'Publications, grants, and research interests',
    targetRole: 'academic' as const,
    category: 'General',
    premium: false,
    classification: 'Acceptable' as const,
    atsScore: 90,
    isUniversalSafe: false,
  },
];

// ============================================
// COMPONENT
// ============================================

export default function Templates() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [creating, setCreating] = useState(false);
  const [creatingTemplateId, setCreatingTemplateId] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedClassification, setSelectedClassification] = useState<string>('All');
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [activePreviewTemplate, setActivePreviewTemplate] = useState<typeof CV_TEMPLATES[0] | null>(null);

  const filteredTemplates = CV_TEMPLATES.filter((t) => {
    // Search filter
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        t.name.toLowerCase().includes(q) ||
        t.description.toLowerCase().includes(q) ||
        t.targetRole.toLowerCase().includes(q);
      if (!matchesSearch) return false;
    }

    // Category filter
    if (selectedCategory && t.category !== selectedCategory) {
      return false;
    }

    // Classification / Compliance filter
    if (selectedClassification !== 'All') {
      if (selectedClassification === 'Universal') {
        if (!t.isUniversalSafe) return false;
      } else {
        if (t.classification !== selectedClassification) return false;
      }
    }

    return true;
  });

  const handleUseTemplate = async (templateId: string, targetRole: string) => {
    if (!user) {
      setShowLoginModal(true);
      return;
    }

    try {
      setCreating(true);
      setCreatingTemplateId(templateId);
      setError('');

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
    } catch (err) {
      console.error('Error creating CV:', err);
      setError('Failed to create resume. Please try again.');
    } finally {
      setCreating(false);
      setCreatingTemplateId(null);
    }
  };

  return (
    <div className="min-h-screen bg-transparent py-10 text-gray-900 dark:text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Premium Hero Banner */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 sm:p-12 relative overflow-hidden shadow-md dark:shadow-2xl border border-gray-200 dark:border-slate-800 mb-10 group">
          {/* Ambient Gradients */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-[120px] -mr-20 -mt-20 group-hover:bg-indigo-500/15 transition-all duration-700 pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500/10 rounded-full blur-[120px] -ml-20 -mb-20 group-hover:bg-purple-500/15 transition-all duration-700 pointer-events-none" />
          
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-650 dark:text-indigo-300 text-xs font-semibold mb-4 backdrop-blur-md">
                <Shield className="w-3.5 h-3.5 text-indigo-500" />
                <span>2026 Recruiter-Vetted Standards</span>
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight">
                Professional <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 via-purple-505 to-pink-500 dark:from-indigo-400 dark:via-purple-400 dark:to-pink-400">Resume Architectures</span>
              </h1>
              <p className="text-slate-600 dark:text-slate-400 text-base sm:text-lg mt-4 max-w-xl leading-relaxed">
                Select from our library of ATS-optimized, high-density layouts designed to bypass parsing filters and captivate hiring managers in under 6 seconds.
              </p>
              
              {error && (
                <div className="mt-6 p-4 bg-rose-500/10 border border-rose-500/20 rounded-xl text-rose-600 dark:text-rose-300 text-sm flex items-center gap-2 animate-in fade-in slide-in-from-top-2 duration-300">
                  <AlertTriangle className="h-4.5 w-4.5 flex-shrink-0 text-rose-500 dark:text-rose-400" />
                  <span>{error}</span>
                </div>
              )}
            </div>
            
            <div className="lg:col-span-5 grid grid-cols-3 gap-3">
              <div className="bg-slate-50 dark:bg-slate-800/40 backdrop-blur-md p-4 rounded-2xl border border-slate-200 dark:border-slate-700/50 hover:border-slate-300 dark:hover:border-slate-600 transition-colors">
                <div className="text-indigo-600 dark:text-indigo-400 font-extrabold text-2xl sm:text-3xl">98%</div>
                <div className="text-slate-500 dark:text-slate-400 text-xs mt-1.5 font-medium leading-normal">Avg. ATS Score</div>
              </div>
              <div className="bg-slate-50 dark:bg-slate-800/40 backdrop-blur-md p-4 rounded-2xl border border-slate-200 dark:border-slate-700/50 hover:border-slate-300 dark:hover:border-slate-600 transition-colors">
                <div className="text-purple-600 dark:text-purple-400 font-extrabold text-2xl sm:text-3xl">&lt;6s</div>
                <div className="text-slate-500 dark:text-slate-400 text-xs mt-1.5 font-medium leading-normal">Recruiter Scan</div>
              </div>
              <div className="bg-slate-50 dark:bg-slate-800/40 backdrop-blur-md p-4 rounded-2xl border border-slate-200 dark:border-slate-700/50 hover:border-slate-300 dark:hover:border-slate-600 transition-colors">
                <div className="text-emerald-600 dark:text-emerald-400 font-extrabold text-2xl sm:text-3xl">100%</div>
                <div className="text-slate-500 dark:text-slate-400 text-xs mt-1.5 font-medium leading-normal">Safe Columns</div>
              </div>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative mb-6">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
          <input
            type="text"
            placeholder="Search templates by name, category, or role..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              if (e.target.value) {
                setSelectedCategory(null);
                setSelectedClassification('All');
              }
            }}
            className="w-full pl-12 pr-10 py-3.5 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white shadow-sm text-slate-800 placeholder-slate-400 transition-all font-medium"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          )}
        </div>

        {/* Segmented Quality/Compliance Filter Bar */}
        <div className="bg-white p-2 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 rounded-xl text-slate-600 text-xs font-semibold border border-slate-100 flex-shrink-0 self-start md:self-auto">
            <SlidersHorizontal className="w-3.5 h-3.5 text-indigo-500" />
            <span>Filter by Vetting & ATS Score:</span>
          </div>
          
          <div className="flex flex-wrap gap-1.5 flex-1 justify-start md:justify-end">
            {[
              { id: 'All', label: 'All Architectures', icon: <Layout className="w-3.5 h-3.5" /> },
              { id: 'Universal', label: 'Universal Safe Choices', icon: <Shield className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" /> },
              { id: 'Recommended', label: 'Highly Recommended (95%+ ATS)', icon: <Sparkles className="w-3.5 h-3.5 text-indigo-650 dark:text-indigo-300" /> },
              { id: 'Acceptable', label: 'Creative & Portfolio', icon: <Palette className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" /> },
            ].map((pill) => {
              const isActive = selectedClassification === pill.id;
              return (
                <button
                  key={pill.id}
                  onClick={() => {
                    setSelectedClassification(pill.id);
                    setSearchQuery('');
                  }}
                  className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all duration-200 ${
                    isActive
                      ? pill.id === 'Universal'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 shadow-sm'
                        : pill.id === 'Recommended'
                        ? 'bg-indigo-50 text-indigo-700 border border-indigo-200 shadow-sm'
                        : pill.id === 'Acceptable'
                        ? 'bg-amber-50 text-amber-700 border border-amber-200 shadow-sm'
                        : 'bg-slate-900 text-white shadow-sm'
                      : 'text-slate-500 border border-transparent hover:bg-slate-50 hover:border-slate-200'
                  }`}
                >
                  {pill.icon}
                  <span>{pill.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Category Buttons */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 mb-8">
          {TEMPLATE_CATEGORIES.map((category) => {
            const count = CV_TEMPLATES.filter((t) => t.category === category.id).length;
            const isSelected = selectedCategory === category.id;

            return (
              <button
                key={category.id}
                onClick={() => {
                  setSelectedCategory(isSelected ? null : category.id);
                  setSearchQuery('');
                }}
                className={`relative p-4 rounded-2xl text-left transition-all duration-300 overflow-hidden group border ${
                  isSelected
                    ? 'ring-2 ring-indigo-500 border-transparent shadow-lg -translate-y-0.5 scale-[1.02]'
                    : 'border-slate-100 dark:border-white/5 hover:shadow-xl hover:-translate-y-1 hover:border-indigo-200 bg-white dark:bg-slate-900'
                }`}
              >
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${category.color} transition-opacity duration-300 ${
                    isSelected ? 'opacity-100' : 'opacity-0 group-hover:opacity-5'
                  }`}
                />
                <div className="relative z-10 flex flex-col justify-between h-full">
                  <div>
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 shadow-sm bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5 group-hover:scale-110 transition-transform duration-300 ${
                      isSelected ? 'bg-white/20 border-white/30 text-white' : 'text-slate-700 dark:text-slate-300'
                    }`}>
                      {React.createElement(category.icon, { className: "w-5 h-5" })}
                    </div>
                    <h3 className={`font-bold text-sm tracking-tight transition-colors ${isSelected ? 'text-white' : 'text-slate-800 dark:text-white/90 group-hover:text-indigo-600 dark:group-hover:text-indigo-400'}`}>{category.id}</h3>
                  </div>
                  <p className={`text-xs mt-1 transition-colors ${isSelected ? 'text-white/80' : 'text-slate-400 dark:text-white/40 group-hover:text-slate-500'}`}>{count} templates</p>
                </div>
              </button>
            );
          })}
        </div>

        {/* Results header */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-sm font-semibold text-slate-500 dark:text-white/50">
            {searchQuery
              ? `Found ${filteredTemplates.length} matches for "${searchQuery}"`
              : selectedCategory
              ? `${filteredTemplates.length} options in "${selectedCategory}"`
              : selectedClassification !== 'All'
              ? `${filteredTemplates.length} vetting matches`
              : `Showing all ${filteredTemplates.length} layouts`}
          </p>
          {(searchQuery || selectedCategory || selectedClassification !== 'All') && (
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory(null);
                setSelectedClassification('All');
              }}
              className="text-xs text-indigo-600 hover:text-indigo-800 font-bold bg-indigo-50 px-3 py-1.5 rounded-lg border border-indigo-100 hover:border-indigo-200 transition-colors"
            >
              Reset Filters
            </button>
          )}
        </div>

        {/* Templates Grid */}
        {filteredTemplates.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredTemplates.map((template) => {
              const FullPreviewComponent = getFullTemplatePreview(template.id);
              return (
                <div
                  key={template.id}
                  className="bg-white dark:bg-[#12121a] rounded-2xl border border-slate-100 dark:border-white/5 overflow-hidden hover:shadow-2xl transition-all duration-300 group hover:border-indigo-200 dark:hover:border-white/20 flex flex-col h-full"
                >
                  {/* Premium colored top accent line */}
                  <div className={`h-1.5 bg-gradient-to-r ${template.color}`} />

                  {/* Template Preview with perfect aspect ratio and dynamic hover controls */}
                  <div className="bg-slate-50/80 dark:bg-slate-950/40 p-3.5 border-b border-slate-100 dark:border-white/5 relative">
                    <div className="bg-white rounded-xl shadow-sm border border-slate-200/50 dark:border-white/10 overflow-hidden relative w-full aspect-[1/1.41] group-hover:shadow-md transition-shadow duration-300">
                      {/* Fully Scaled A4 rendering to avoid bounds overflow & congestion */}
                      <div className="absolute inset-0 origin-top-left scale-[0.32] sm:scale-[0.35] md:scale-[0.33] lg:scale-[0.33] xl:scale-[0.34] w-[310%] h-[310%] overflow-hidden p-6 pointer-events-none">
                        <FullPreviewComponent />
                      </div>
                      
                      {/* Smooth gradient blend fading out the bottom of the card preview */}
                      <div className="absolute bottom-0 inset-x-0 h-16 bg-gradient-to-t from-white dark:from-slate-900 to-transparent pointer-events-none" />
                      
                      {/* Glassmorphic Action Overlay */}
                      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center gap-3 p-4">
                        <button
                          onClick={() => setActivePreviewTemplate(template)}
                          className="px-4 py-2 bg-white text-slate-900 text-xs font-bold rounded-lg hover:bg-slate-50 transform translate-y-3 group-hover:translate-y-0 transition-all duration-300 flex items-center gap-1.5 shadow-lg border border-slate-100"
                        >
                          <Eye className="w-3.5 h-3.5 text-indigo-500 animate-pulse" />
                          Quick Preview
                        </button>
                        <button
                          onClick={() => handleUseTemplate(template.id, template.targetRole)}
                          className="px-4 py-2 bg-indigo-600 text-white text-xs font-bold rounded-lg hover:bg-indigo-700 transform translate-y-3 group-hover:translate-y-0 transition-all duration-300 flex items-center gap-1.5 shadow-lg"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          Use Layout
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Card Info Section */}
                  <div className="p-5 flex-1 flex flex-col justify-between bg-white dark:bg-[#12121a] border-t border-slate-50 dark:border-white/5">
                    <div>
                      {/* Multi-Badge Vetting Layer */}
                      <div className="flex flex-wrap gap-1 mb-3">
                        {template.isUniversalSafe && (
                          <span className="inline-flex items-center gap-0.5 px-2 py-0.5 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900/20 text-[10px] font-extrabold rounded-md shadow-sm">
                            <Shield className="w-2.5 h-2.5 text-emerald-500" />
                            Universal Safe
                          </span>
                        )}
                        
                        <span className={`inline-flex items-center gap-0.5 px-2 py-0.5 text-[10px] font-extrabold rounded-md border shadow-sm ${
                          template.classification === 'Recommended'
                            ? 'bg-indigo-50 dark:bg-indigo-950/30 text-indigo-700 dark:text-indigo-400 border-indigo-100 dark:border-indigo-900/20'
                            : template.classification === 'Acceptable'
                            ? 'bg-amber-50 dark:bg-amber-950/30 text-amber-700 dark:text-amber-400 border-amber-100 dark:border-amber-900/20'
                            : 'bg-rose-50 dark:bg-rose-950/30 text-rose-700 dark:text-rose-400 border-rose-100 dark:border-rose-900/20'
                        }`}>
                          {template.classification === 'Recommended' ? (
                            <Sparkles className="w-2.5 h-2.5 text-indigo-500" />
                          ) : template.classification === 'Acceptable' ? (
                            <Eye className="w-2.5 h-2.5 text-amber-500" />
                          ) : (
                            <AlertTriangle className="w-2.5 h-2.5 text-rose-500" />
                          )}
                          {template.classification === 'Recommended' ? 'Recruiter Vetted' : template.classification === 'Acceptable' ? 'Creative Layout' : 'Visual Heavy'}
                        </span>

                        <span className="inline-flex items-center gap-0.5 px-2 py-0.5 bg-slate-50 dark:bg-white/5 text-slate-600 dark:text-white/60 border border-slate-100 dark:border-white/5 text-[10px] font-extrabold rounded-md shadow-sm">
                          <TrendingUp className="w-2.5 h-2.5 text-slate-500" />
                          {template.atsScore}% ATS
                        </span>
                      </div>

                      <div className="flex items-start justify-between mb-1 gap-2">
                        <h3 className="text-base font-bold text-slate-800 dark:text-white leading-snug group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                          {template.name}
                        </h3>
                        {template.premium && (
                          <span className="px-2 py-0.5 bg-yellow-100 dark:bg-yellow-950 text-yellow-800 dark:text-yellow-400 text-[10px] font-extrabold rounded-full uppercase tracking-wider flex-shrink-0">
                            Pro
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-400 dark:text-slate-500 mb-2 font-semibold tracking-wider uppercase">{template.category}</p>
                      <p className="text-sm text-slate-500 dark:text-slate-400 mb-4 line-clamp-2 h-10 leading-relaxed font-medium">{template.description}</p>
                    </div>

                    {/* Split Grid Action Blocks */}
                    <div className="grid grid-cols-2 gap-2 mt-2">
                      <button
                        onClick={() => setActivePreviewTemplate(template)}
                        className="inline-flex items-center justify-center px-3 py-2 bg-slate-50 dark:bg-white/5 hover:bg-slate-100 dark:hover:bg-white/10 text-slate-700 dark:text-white/85 text-xs font-bold rounded-xl border border-slate-100 dark:border-white/5 hover:border-slate-200 dark:hover:border-white/10 transition-all active:scale-[0.98]"
                      >
                        <Eye className="h-3.5 w-3.5 mr-1 text-slate-500 dark:text-white/60" />
                        Quick View
                      </button>
                      
                      <button
                        onClick={() => handleUseTemplate(template.id, template.targetRole)}
                        disabled={creating}
                        className="inline-flex items-center justify-center px-3 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-sm hover:shadow-indigo-500/10 transition-all active:scale-[0.98] disabled:opacity-50"
                      >
                        {creatingTemplateId === template.id ? (
                          <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        ) : (
                          <>
                            <Plus className="h-3.5 w-3.5 mr-1" />
                            Use Layout
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-slate-200 shadow-sm">
            <Search className="h-12 w-12 text-slate-300 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-slate-800 mb-2">No architectures found</h3>
            <p className="text-slate-400 text-sm max-w-xs mx-auto leading-relaxed font-medium">Try matching a different role, resetting filters or typing another search term.</p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory(null);
                setSelectedClassification('All');
              }}
              className="mt-4 px-4 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 text-xs font-bold rounded-xl border border-indigo-100 transition-colors"
            >
              Clear All Filters
            </button>
          </div>
        )}
      </div>

      {/* Modern Zoom / Fullscreen Preview Modal */}
      {activePreviewTemplate && (
        <div
          className="fixed inset-0 bg-slate-950/80 backdrop-blur-md flex items-center justify-center z-50 p-4 transition-all duration-300 animate-in fade-in"
          onClick={() => setActivePreviewTemplate(null)}
        >
          <div
            className="bg-slate-950 rounded-3xl shadow-2xl max-w-4xl w-full max-h-[92vh] flex flex-col border border-slate-800 overflow-hidden animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/60 backdrop-blur-md">
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <span>{activePreviewTemplate.name} Layout</span>
                  {activePreviewTemplate.isUniversalSafe && (
                    <span className="inline-flex items-center gap-1 text-[10px] font-extrabold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded-md">
                      <Shield className="w-3 h-3" /> Universal Safe
                    </span>
                  )}
                </h3>
                <p className="text-xs text-slate-400 mt-0.5 font-medium">{activePreviewTemplate.category} • {activePreviewTemplate.description}</p>
              </div>
              <button
                onClick={() => setActivePreviewTemplate(null)}
                className="p-2 hover:bg-slate-800 rounded-xl text-slate-400 hover:text-white transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            {/* Modal Body (Scrollable full-size A4 visual sandbox rendering) */}
            <div className="flex-1 overflow-y-auto p-8 bg-slate-950/40 flex justify-center items-start">
              <div className="bg-white rounded-2xl shadow-2xl p-10 w-full max-w-[760px] border border-slate-800 overflow-hidden transform origin-top transition-transform select-none">
                {React.createElement(getFullTemplatePreview(activePreviewTemplate.id))}
              </div>
            </div>
            
            {/* Modal Footer */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between px-6 py-4 border-t border-slate-800 bg-slate-900/60 gap-4">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs text-slate-400 font-semibold">ATS Performance:</span>
                  <span className={`text-sm font-extrabold ${
                    activePreviewTemplate.atsScore >= 95 ? 'text-emerald-400' :
                    activePreviewTemplate.atsScore >= 80 ? 'text-amber-400' : 'text-rose-400'
                  }`}>
                    {activePreviewTemplate.atsScore}% Score
                  </span>
                </div>
                <div className="h-4 w-px bg-slate-800" />
                <div className="flex items-center gap-1.5">
                  <span className="text-xs text-slate-400 font-semibold">Audit Level:</span>
                  <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-md ${
                    activePreviewTemplate.classification === 'Recommended' ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20' :
                    activePreviewTemplate.classification === 'Acceptable' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
                    'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                  }`}>
                    {activePreviewTemplate.classification === 'Recommended' ? 'Recommended' : activePreviewTemplate.classification === 'Acceptable' ? 'Acceptable' : 'Not Recommended'}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setActivePreviewTemplate(null)}
                  className="px-4 py-2 border border-slate-700 text-slate-300 font-bold text-xs rounded-xl hover:bg-slate-800 hover:text-white transition-colors"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    const id = activePreviewTemplate.id;
                    const role = activePreviewTemplate.targetRole;
                    setActivePreviewTemplate(null);
                    handleUseTemplate(id, role);
                  }}
                  className="px-5 py-2.5 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-bold text-xs rounded-xl shadow-lg hover:shadow-indigo-500/10 transition-all flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4" />
                  Use Layout Architecture
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Login Required Modal */}
      {showLoginModal && (
        <div
          className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in"
          onClick={() => setShowLoginModal(false)}
        >
          <div
            className="bg-white rounded-3xl shadow-2xl max-w-sm w-full p-8 text-center border border-slate-100 relative animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setShowLoginModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1.5 hover:bg-slate-50 rounded-xl transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center mx-auto mb-5 shadow-lg shadow-indigo-500/20">
              <Layout className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">Sign in to use templates</h3>
            <p className="text-slate-500 text-sm mb-6 leading-relaxed">
              Create a free account or sign in to start building your resume with this template.
            </p>
            <div className="flex flex-col gap-3">
              <button
                onClick={() => navigate('/login')}
                className="w-full py-3 bg-indigo-600 text-white font-bold text-sm rounded-xl hover:bg-indigo-700 shadow-lg shadow-indigo-500/10 transition-all flex items-center justify-center gap-2 active:scale-[0.98]"
              >
                <LogIn className="h-4.5 w-4.5" />
                Log in
              </button>
              <button
                onClick={() => navigate('/signup')}
                className="w-full py-3 border border-slate-200 text-slate-700 font-bold text-sm rounded-xl hover:bg-slate-50 transition-colors flex items-center justify-center gap-2 active:scale-[0.98]"
              >
                <UserPlus className="h-4.5 w-4.5" />
                Create free account
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
