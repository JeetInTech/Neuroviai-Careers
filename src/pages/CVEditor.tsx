import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import api from '../lib/api';
import type { CV, LaTeXExportOptions } from '../lib/database.types';
import { Download, Share2, Save, ArrowLeft, Eye, Palette, Camera, X, Check, FileText, Loader2 } from 'lucide-react';
import ShareCVDialog from '../components/ShareCVDialog';
import { downloadLaTeX, getRecommendedTemplate, generateLaTeX, generateATSCVLaTeX, generateATSResumeLaTeX, downloadATSCVLaTeX, downloadATSResumeLaTeX } from '../lib/latex-generator';
import { getTemplateComponent } from '../components/templates';
import { TemplateDropdown } from '../components/TemplateSelector';
import ImageCropper from '../components/ImageCropper';

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
  const [isViewMode, setIsViewMode] = useState(false);
  const [showDownloadMenu, setShowDownloadMenu] = useState(false);
  const cvRef = useRef<HTMLDivElement>(null);
  
  // Photo upload state
  const [showImageCropper, setShowImageCropper] = useState(false);
  const [tempImageUrl, setTempImageUrl] = useState<string | null>(null);
  const photoInputRef = useRef<HTMLInputElement>(null);
  
  // Color customization state
  const [showColorPicker, setShowColorPicker] = useState(false);

  // ATS preview state
  const [atsPreviewMode, setAtsPreviewMode] = useState<'off' | 'cv' | 'resume'>('off');
  const [atsPreviewUrl, setAtsPreviewUrl] = useState<string | null>(null);
  const [atsCompiling, setAtsCompiling] = useState(false);

  const { template, isTemplate, cvData } = location.state || {};

  useEffect(() => {
    if (isTemplate && cvData) {
      // Create a new CV with template data but don't save it yet
      const newCV: CV = {
        id: '', // This will be set when actually saving
        user_id: user?.id || '',
        template: template,
        personal_info: {
          full_name: '',
          email: '',
          phone: '',
          address: '',
          summary: '',
          ...cvData.personal_info
        },
        education: cvData.education || [],
        experience: cvData.experience || [],
        skills: cvData.skills || [],
        languages: cvData.languages || [],
        certifications: cvData.certifications || [],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      
      setCV(newCV);
      setLoading(false); // Stop loading since we have the template data
      return; // Don't proceed with loading existing CV
    }

    // Only load existing CV if we have an ID and not using a template
    if (!isTemplate && user && id) {
      const loadCV = async () => {
        try {
          const data = await api.getCV(id);
          if (!data) throw new Error('CV not found');
          
          setCV(data as unknown as CV);
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

  // Photo upload handlers
  const handlePhotoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setTempImageUrl(reader.result as string);
        setShowImageCropper(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePhotoCropComplete = (croppedBlob: Blob) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (cv) {
        setCV({
          ...cv,
          personal_info: { ...cv.personal_info, photo_url: reader.result as string }
        });
      }
    };
    reader.readAsDataURL(croppedBlob);
    setShowImageCropper(false);
    setTempImageUrl(null);
  };

  const handleRemovePhoto = () => {
    if (cv) {
      setCV({
        ...cv,
        personal_info: { ...cv.personal_info, photo_url: undefined }
      });
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

      // If this is a new CV from a template
      if (isTemplate || !cv.id) {
        const result = await api.createCV(cvPayload);
        if (result.success && result.cv) {
          setCV(result.cv as unknown as CV);
          // Redirect to the new CV's edit page
          navigate(`/cv/edit/${result.cv.id}`, { replace: true });
        }
      } else {
        // Update existing CV
        const result = await api.updateCV(cv.id, cvPayload);
        if (result.success && result.cv) {
          setCV(result.cv as unknown as CV);
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
    } catch (error) {
      console.error('Error generating PDF:', error);
      setError('Failed to download PDF. LaTeX compilation may be unavailable.');
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
        // Compiler not available, download as .tex
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
        const pdfBlob = await api.compileLaTeX(latexSource, `${cv.personal_info.full_name?.replace(/\s+/g, '_') || 'cv'}_ATS_Resume`, true);
        const url = window.URL.createObjectURL(pdfBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${cv.personal_info.full_name || 'cv'}_ATS_Resume.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      } catch {
        // Compiler not available, download as .tex
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

    const htmlContent = `
      <html>
        <head>
          <meta charset="utf-8">
          <title>CV - ${cv.personal_info.full_name}</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; }
            .section { margin-bottom: 20px; }
            .section-title { font-size: 18px; font-weight: bold; }
          </style>
        </head>
        <body>
          <h1>${cv.personal_info.full_name}</h1>
          <p>${cv.personal_info.email} | ${cv.personal_info.phone}</p>
          <p>${cv.personal_info.address}</p>
          
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
            ${cv.skills.map(group => `
              <p><strong>${group.category}:</strong> ${group.items.join(', ')}</p>
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

    // Get the recommended LaTeX template based on CV template or target role
    let latexTemplate: LaTeXExportOptions['template'] = 'professional';

    // Extended template mapping for all available templates
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
      'executive': 'professional',
      'creative': 'minimal',
      'freelancer': 'professional',
    };

    if (cv.template && templateMap[cv.template]) {
      latexTemplate = templateMap[cv.template];
    } else if (cv.target_role) {
      latexTemplate = getRecommendedTemplate(cv.target_role);
    }

    downloadLaTeX(cv, undefined, { template: latexTemplate });
    setShowDownloadMenu(false);
  };

  const handleAtsPreviewToggle = async (mode: 'off' | 'cv' | 'resume') => {
    if (mode === 'off') {
      setAtsPreviewMode('off');
      if (atsPreviewUrl) {
        URL.revokeObjectURL(atsPreviewUrl);
        setAtsPreviewUrl(null);
      }
      return;
    }
    if (mode === atsPreviewMode) return;
    if (!cv) return;
    setAtsPreviewMode(mode);
    setAtsCompiling(true);
    setAtsPreviewUrl(null);
    try {
      const latex = mode === 'cv'
        ? generateATSCVLaTeX(cv)
        : generateATSResumeLaTeX(cv);
      const blob = await api.compileLaTeX(latex, 'preview.pdf', mode === 'resume');
      const url = URL.createObjectURL(blob);
      setAtsPreviewUrl(url);
    } catch (err) {
      console.error('ATS preview compilation failed:', err);
      setAtsPreviewUrl(null);
    } finally {
      setAtsCompiling(false);
    }
  };

  // Add template selection handling
  const renderTemplate = () => {
    if (!cv) return null;

    // Get the appropriate template component based on template name or target role
    const templateId = cv.template || cv.target_role || 'professional';
    const TemplateComponent = getTemplateComponent(templateId);
    
    return <TemplateComponent cv={cv} isViewMode={isViewMode} />;
  };

  // Handle template change
  const handleTemplateChange = (newTemplate: string) => {
    if (cv) {
      setCV({ ...cv, template: newTemplate });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600" />
      </div>
    );
  }

  if (!cv) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900">CV not found</h2>
          <button
            onClick={() => navigate('/portfolio')}
            className="mt-4 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Portfolio
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {error && (
          <div className="mb-4 bg-red-50 border border-red-400 text-red-700 px-4 py-3 rounded relative">
            {error}
          </div>
        )}

        <div className="flex justify-between items-center mb-8">
          <button
            onClick={() => navigate('/portfolio')}
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </button>

          <div className="flex space-x-4">
            {!isViewMode && (
              <button
                onClick={handleSave}
                disabled={saving}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-custom-darkest hover:bg-custom-dark disabled:opacity-50"
              >
                <Save className="h-4 w-4 mr-2" />
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            )}

            <button
              onClick={() => setShowShareDialog(true)}
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              <Share2 className="h-4 w-4 mr-2" />
              Share
            </button>

            <button
              onClick={() => setIsViewMode(!isViewMode)}
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              <Eye className="h-4 w-4 mr-2" />
              {isViewMode ? 'Edit Mode' : 'View Mode'}
            </button>

            <div className="relative">
              <button
                onClick={() => setShowDownloadMenu(!showDownloadMenu)}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700"
              >
                <Download className="h-4 w-4 mr-2" />
                Download
              </button>

              {showDownloadMenu && (
                <div className="absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10">
                  <div className="py-1">
                    <button
                      onClick={handleDownloadPDF}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Download as PDF
                    </button>
                    <button
                      onClick={handleDownloadWord}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Download as Word
                    </button>
                    <button
                      onClick={handleDownloadLaTeX}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Download as LaTeX
                    </button>
                    <div className="border-t border-gray-100 my-1" />
                    <div className="px-4 py-1">
                      <span className="text-xs font-semibold text-indigo-600 uppercase tracking-wide">ATS Optimized</span>
                    </div>
                    <button
                      onClick={handleDownloadATSCV}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50"
                    >
                      ATS CV (Multi-page)
                    </button>
                    <button
                      onClick={handleDownloadATSResume}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50"
                    >
                      ATS Resume (1-page)
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ATS Preview Toggle - Show in view mode */}
        {isViewMode && (
          <div className="mb-4 flex items-center gap-2">
            <span className="text-sm font-medium text-gray-600 mr-1">Preview:</span>
            <button
              onClick={() => handleAtsPreviewToggle('off')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition-all ${
                atsPreviewMode === 'off'
                  ? 'bg-indigo-600 text-white border-indigo-600'
                  : 'bg-white text-gray-600 border-gray-300 hover:border-indigo-400'
              }`}
            >
              Styled
            </button>
            <button
              onClick={() => handleAtsPreviewToggle('cv')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition-all ${
                atsPreviewMode === 'cv'
                  ? 'bg-indigo-600 text-white border-indigo-600'
                  : 'bg-white text-gray-600 border-gray-300 hover:border-indigo-400'
              }`}
            >
              <FileText className="w-3 h-3 inline mr-1" />
              ATS CV
            </button>
            <button
              onClick={() => handleAtsPreviewToggle('resume')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition-all ${
                atsPreviewMode === 'resume'
                  ? 'bg-indigo-600 text-white border-indigo-600'
                  : 'bg-white text-gray-600 border-gray-300 hover:border-indigo-400'
              }`}
            >
              <FileText className="w-3 h-3 inline mr-1" />
              ATS Resume
            </button>
          </div>
        )}

        {/* Template Selector - Show in view mode */}
        {isViewMode && atsPreviewMode === 'off' && (
          <div className="mb-6 bg-white rounded-lg shadow-sm p-4">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              {/* Template Selection */}
              <div className="flex items-center gap-3">
                <Palette className="h-5 w-5 text-indigo-600" />
                <span className="text-sm font-medium text-gray-700">Template:</span>
                <div className="w-64">
                  <TemplateDropdown
                    selectedTemplate={cv.template || 'professional'}
                    onSelectTemplate={handleTemplateChange}
                    targetRole={cv.target_role}
                  />
                </div>
              </div>
              
              {/* Color Customization */}
              <div className="flex items-center gap-4">
                {/* Accent Color Picker */}
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-gray-700">Color:</span>
                  <div className="relative">
                    <button
                      onClick={() => setShowColorPicker(!showColorPicker)}
                      className="w-8 h-8 rounded-full border-2 border-gray-300 shadow-sm hover:border-indigo-400 transition-colors"
                      style={{ 
                        backgroundColor: cv.is_grayscale ? '#6B7280' : (cv.accent_color || '#4F46E5')
                      }}
                    />
                    {showColorPicker && (
                      <>
                        {/* Backdrop to close picker */}
                        <div 
                          className="fixed inset-0 z-10" 
                          onClick={() => setShowColorPicker(false)}
                        />
                        <div className="absolute top-full mt-2 right-0 z-20 bg-white rounded-lg shadow-xl border p-3 min-w-[200px]">
                          <div className="grid grid-cols-5 gap-2 mb-3">
                            {COLOR_PRESETS.map((color) => (
                              <button
                                key={color.value}
                                onClick={() => {
                                  handleAccentColorChange(color.value);
                                  setShowColorPicker(false);
                                }}
                                className={`w-8 h-8 rounded-full border-2 transition-all hover:scale-110 ${
                                  cv.accent_color === color.value && !cv.is_grayscale
                                    ? 'border-gray-900 ring-2 ring-offset-2 ring-gray-400'
                                    : 'border-gray-200'
                                }`}
                                style={{ backgroundColor: color.value }}
                                title={color.name}
                              />
                            ))}
                          </div>
                          <div className="border-t pt-3">
                            <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                              <input
                                type="color"
                                value={cv.accent_color || '#4F46E5'}
                                onChange={(e) => handleAccentColorChange(e.target.value)}
                                className="w-6 h-6 rounded cursor-pointer"
                              />
                              Custom Color
                            </label>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </div>

                {/* Black & White Toggle */}
                <button
                  onClick={handleGrayscaleToggle}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-sm font-medium transition-all ${
                    cv.is_grayscale
                      ? 'bg-gray-900 text-white border-gray-900'
                      : 'bg-white text-gray-700 border-gray-300 hover:border-gray-400'
                  }`}
                >
                  {cv.is_grayscale ? (
                    <>
                      <Check className="w-4 h-4" />
                      B&W
                    </>
                  ) : (
                    'B&W'
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* CV Content */}
        <div ref={cvRef}>
          {isViewMode ? (
            atsPreviewMode !== 'off' ? (
              atsCompiling ? (
                <div className="flex items-center justify-center min-h-[600px]">
                  <div className="text-center space-y-3">
                    <Loader2 className="h-8 w-8 text-indigo-600 animate-spin mx-auto" />
                    <p className="text-sm text-gray-600">Compiling ATS {atsPreviewMode === 'cv' ? 'CV' : 'Resume'}...</p>
                  </div>
                </div>
              ) : atsPreviewUrl ? (
                <iframe
                  src={atsPreviewUrl}
                  className="w-full border-0 rounded-lg bg-white"
                  style={{ height: '1100px' }}
                  title={`ATS ${atsPreviewMode === 'cv' ? 'CV' : 'Resume'} Preview`}
                />
              ) : (
                <div className="flex items-center justify-center min-h-[600px] text-gray-400 text-sm">
                  ATS preview unavailable — LaTeX compiler not reachable.
                </div>
              )
            ) : (
              renderTemplate()
            )
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Personal Info */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Personal Information</h3>
                <div className="space-y-4">
                  {/* Profile Photo Upload */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Profile Photo <span className="text-gray-400 text-xs">(Optional)</span>
                    </label>
                    <div className="flex items-center gap-4">
                      {cv.personal_info.photo_url ? (
                        <div className="relative group">
                          <img
                            src={cv.personal_info.photo_url}
                            alt="Profile"
                            className="w-20 h-20 rounded-full object-cover border-2 border-gray-200"
                          />
                          <button
                            onClick={handleRemovePhoto}
                            className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-md hover:bg-red-600"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <div className="w-20 h-20 rounded-full bg-gray-100 border-2 border-dashed border-gray-300 flex items-center justify-center">
                          <Camera className="w-8 h-8 text-gray-400" />
                        </div>
                      )}
                      <div className="flex flex-col gap-2">
                        <input
                          type="file"
                          ref={photoInputRef}
                          onChange={handlePhotoSelect}
                          accept="image/*"
                          className="hidden"
                        />
                        <button
                          onClick={() => photoInputRef.current?.click()}
                          className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-indigo-700 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition-colors"
                        >
                          <Camera className="w-4 h-4 mr-1.5" />
                          {cv.personal_info.photo_url ? 'Change Photo' : 'Upload Photo'}
                        </button>
                        <p className="text-xs text-gray-500">
                          JPG, PNG up to 2MB. Square works best.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="full_name" className="block text-sm font-medium text-gray-700">
                      Full Name
                    </label>
                    <input
                      type="text"
                      id="full_name"
                      value={cv.personal_info.full_name}
                      onChange={(e) => setCV({
                        ...cv,
                        personal_info: { ...cv.personal_info, full_name: e.target.value }
                      })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                      Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      value={cv.personal_info.email}
                      onChange={(e) => setCV({
                        ...cv,
                        personal_info: { ...cv.personal_info, email: e.target.value }
                      })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    />
                  </div>
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                      Phone
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      value={cv.personal_info.phone}
                      onChange={(e) => setCV({
                        ...cv,
                        personal_info: { ...cv.personal_info, phone: e.target.value }
                      })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    />
                  </div>
                  <div>
                    <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                      Address
                    </label>
                    <textarea
                      id="address"
                      value={cv.personal_info.address}
                      onChange={(e) => setCV({
                        ...cv,
                        personal_info: { ...cv.personal_info, address: e.target.value }
                      })}
                      rows={3}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    />
                  </div>
                  <div>
                    <label htmlFor="summary" className="block text-sm font-medium text-gray-700">
                      Professional Summary
                    </label>
                    <textarea
                      id="summary"
                      value={cv.personal_info.summary}
                      onChange={(e) => setCV({
                        ...cv,
                        personal_info: { ...cv.personal_info, summary: e.target.value }
                      })}
                      rows={4}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    />
                  </div>
                </div>
              </div>

              {/* Education */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium text-gray-900">Education</h3>
                  <button
                    onClick={() => setCV({
                      ...cv,
                      education: [...cv.education, {
                        degree: '',
                        institution: '',
                        location: '',
                        start_date: '',
                        end_date: '',
                        description: ''
                      }]
                    })}
                    className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200"
                  >
                    Add Education
                  </button>
                </div>
                <div className="space-y-6">
                  {cv.education.map((edu, index) => (
                    <div key={index} className="border rounded-lg p-4">
                      <div className="flex justify-between mb-4">
                        <h4 className="text-sm font-medium text-gray-900">Education #{index + 1}</h4>
                        <button
                          onClick={() => {
                            const newEducation = [...cv.education];
                            newEducation.splice(index, 1);
                            setCV({ ...cv, education: newEducation });
                          }}
                          className="text-red-600 hover:text-red-700"
                        >
                          Remove
                        </button>
                      </div>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Degree</label>
                          <input
                            type="text"
                            value={edu.degree}
                            onChange={(e) => {
                              const newEducation = [...cv.education];
                              newEducation[index].degree = e.target.value;
                              setCV({ ...cv, education: newEducation });
                            }}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Institution</label>
                          <input
                            type="text"
                            value={edu.institution}
                            onChange={(e) => {
                              const newEducation = [...cv.education];
                              newEducation[index].institution = e.target.value;
                              setCV({ ...cv, education: newEducation });
                            }}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Location</label>
                          <input
                            type="text"
                            value={edu.location}
                            onChange={(e) => {
                              const newEducation = [...cv.education];
                              newEducation[index].location = e.target.value;
                              setCV({ ...cv, education: newEducation });
                            }}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700">Start Date</label>
                            <input
                              type="date"
                              value={edu.start_date}
                              onChange={(e) => {
                                const newEducation = [...cv.education];
                                newEducation[index].start_date = e.target.value;
                                setCV({ ...cv, education: newEducation });
                              }}
                              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700">End Date</label>
                            <input
                              type="date"
                              value={edu.end_date}
                              onChange={(e) => {
                                const newEducation = [...cv.education];
                                newEducation[index].end_date = e.target.value;
                                setCV({ ...cv, education: newEducation });
                              }}
                              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Description</label>
                          <textarea
                            value={edu.description}
                            onChange={(e) => {
                              const newEducation = [...cv.education];
                              newEducation[index].description = e.target.value;
                              setCV({ ...cv, education: newEducation });
                            }}
                            rows={3}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Experience */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium text-gray-900">Experience</h3>
                  <button
                    onClick={() => setCV({
                      ...cv,
                      experience: [...cv.experience, {
                        title: '',
                        company: '',
                        location: '',
                        start_date: '',
                        end_date: '',
                        current: false,
                        description: ''
                      }]
                    })}
                    className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200"
                  >
                    Add Experience
                  </button>
                </div>
                <div className="space-y-6">
                  {cv.experience.map((exp, index) => (
                    <div key={index} className="border rounded-lg p-4">
                      <div className="flex justify-between mb-4">
                        <h4 className="text-sm font-medium text-gray-900">Experience #{index + 1}</h4>
                        <button
                          onClick={() => {
                            const newExperience = [...cv.experience];
                            newExperience.splice(index, 1);
                            setCV({ ...cv, experience: newExperience });
                          }}
                          className="text-red-600 hover:text-red-700"
                        >
                          Remove
                        </button>
                      </div>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Title</label>
                          <input
                            type="text"
                            value={exp.title}
                            onChange={(e) => {
                              const newExperience = [...cv.experience];
                              newExperience[index].title = e.target.value;
                              setCV({ ...cv, experience: newExperience });
                            }}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Company</label>
                          <input
                            type="text"
                            value={exp.company}
                            onChange={(e) => {
                              const newExperience = [...cv.experience];
                              newExperience[index].company = e.target.value;
                              setCV({ ...cv, experience: newExperience });
                            }}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Location</label>
                          <input
                            type="text"
                            value={exp.location}
                            onChange={(e) => {
                              const newExperience = [...cv.experience];
                              newExperience[index].location = e.target.value;
                              setCV({ ...cv, experience: newExperience });
                            }}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700">Start Date</label>
                            <input
                              type="date"
                              value={exp.start_date}
                              onChange={(e) => {
                                const newExperience = [...cv.experience];
                                newExperience[index].start_date = e.target.value;
                                setCV({ ...cv, experience: newExperience });
                              }}
                              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700">End Date</label>
                            <div className="space-y-2">
                              <input
                                type="date"
                                value={exp.end_date}
                                disabled={exp.current}
                                onChange={(e) => {
                                  const newExperience = [...cv.experience];
                                  newExperience[index].end_date = e.target.value;
                                  setCV({ ...cv, experience: newExperience });
                                }}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 disabled:bg-gray-100"
                              />
                              <div className="flex items-center">
                                <input
                                  type="checkbox"
                                  id={`current-${index}`}
                                  checked={exp.current}
                                  onChange={(e) => {
                                    const newExperience = [...cv.experience];
                                    newExperience[index ].current = e.target.checked;
                                    setCV({ ...cv, experience: newExperience });
                                  }}
                                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                                />
                                <label htmlFor={`current-${index}`} className="ml-2 block text-sm text-gray-700">
                                  Current Position
                                </label>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Description</label>
                          <textarea
                            value={exp.description}
                            onChange={(e) => {
                              const newExperience = [...cv.experience];
                              newExperience[index].description = e.target.value;
                              setCV({ ...cv, experience: newExperience });
                            }}
                            rows={3}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Skills */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium text-gray-900">Skills</h3>
                  <button
                    onClick={() => setCV({
                      ...cv,
                      skills: [...cv.skills, { category: '', items: [] }]
                    })}
                    className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200"
                  >
                    Add Group
                  </button>
                </div>
                <div className="space-y-4">
                  {cv.skills.map((group, gIndex) => (
                    <div key={gIndex} className="border rounded-lg p-4">
                      <div className="flex justify-between mb-3">
                        <input
                          type="text"
                          value={group.category}
                          onChange={(e) => {
                            const newSkills = [...cv.skills];
                            newSkills[gIndex] = { ...newSkills[gIndex], category: e.target.value };
                            setCV({ ...cv, skills: newSkills });
                          }}
                          placeholder="Category (e.g., Languages, Frontend, DevOps)"
                          className="text-sm font-medium text-gray-900 border-b border-gray-300 focus:border-indigo-500 focus:outline-none bg-transparent w-full"
                        />
                        <button
                          onClick={() => {
                            const newSkills = [...cv.skills];
                            newSkills.splice(gIndex, 1);
                            setCV({ ...cv, skills: newSkills });
                          }}
                          className="text-red-600 hover:text-red-700 ml-2 text-sm"
                        >
                          Remove
                        </button>
                      </div>
                      <div className="flex flex-wrap gap-2 mb-2">
                        {group.items.map((item, iIndex) => (
                          <span key={iIndex} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                            {item}
                            <button
                              onClick={() => {
                                const newSkills = [...cv.skills];
                                const newItems = [...newSkills[gIndex].items];
                                newItems.splice(iIndex, 1);
                                newSkills[gIndex] = { ...newSkills[gIndex], items: newItems };
                                setCV({ ...cv, skills: newSkills });
                              }}
                              className="ml-1 text-indigo-600 hover:text-indigo-900"
                            >
                              ×
                            </button>
                          </span>
                        ))}
                      </div>
                      <input
                        type="text"
                        placeholder="Add skill... (press Enter or comma)"
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ',') {
                            e.preventDefault();
                            const val = (e.target as HTMLInputElement).value.trim().replace(/,$/, '');
                            if (val) {
                              const newSkills = [...cv.skills];
                              newSkills[gIndex] = { ...newSkills[gIndex], items: [...newSkills[gIndex].items, val] };
                              setCV({ ...cv, skills: newSkills });
                              (e.target as HTMLInputElement).value = '';
                            }
                          }
                        }}
                        className="mt-1 block w-full text-sm rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Languages */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium text-gray-900">Languages</h3>
                  <button
                    onClick={() => setCV({
                      ...cv,
                      languages: [...cv.languages, {
                        name: '',
                        proficiency: 'basic' as const
                      }]
                    })}
                    className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200"
                  >
                    Add Language
                  </button>
                </div>
                <div className="space-y-4">
                  {cv.languages.map((lang, index) => (
                    <div key={index} className="border rounded-lg p-4">
                      <div className="flex justify-between mb-4">
                        <h4 className="text-sm font-medium text-gray-900">Language #{index + 1}</h4>
                        <button
                          onClick={() => {
                            const newLanguages = [...cv.languages];
                            newLanguages.splice(index, 1);
                            setCV({ ...cv, languages: newLanguages });
                          }}
                          className="text-red-600 hover:text-red-700"
                        >
                          Remove
                        </button>
                      </div>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Language</label>
                          <input
                            type="text"
                            value={lang.name}
                            onChange={(e) => {
                              const newLanguages = [...cv.languages];
                              newLanguages[index].name = e.target.value;
                              setCV({ ...cv, languages: newLanguages });
                            }}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Proficiency</label>
                          <select
                            value={lang.proficiency}
                            onChange={(e) => {
                              const newLanguages = [...cv.languages];
                              newLanguages[index].proficiency = e.target.value as 'basic' | 'conversational' | 'professional' | 'native';
                              setCV({ ...cv, languages: newLanguages });
                            }}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                          >
                            <option value="basic">Basic</option>
                            <option value="conversational">Conversational</option>
                            <option value="professional">Professional</option>
                            <option value="native">Native</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Certifications */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium text-gray-900">Certifications</h3>
                  <button
                    onClick={() => setCV({
                      ...cv,
                      certifications: [...cv.certifications, {
                        name: '',
                        issuer: '',
                        date: '',
                        url: ''
                      }]
                    })}
                    className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200"
                  >
                    Add Certification
                  </button>
                </div>
                <div className="space-y-4">
                  {cv.certifications.map((cert, index) => (
                    <div key={index} className="border rounded-lg p-4">
                      <div className="flex justify-between mb-4">
                        <h4 className="text-sm font-medium text-gray-900">Certification #{index + 1}</h4>
                        <button
                          onClick={() => {
                            const newCertifications = [...cv.certifications];
                            newCertifications.splice(index, 1);
                            setCV({ ...cv, certifications: newCertifications });
                          }}
                          className="text-red-600 hover:text-red-700"
                        >
                          Remove
                        </button>
                      </div>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Name</label>
                          <input
                            type="text"
                            value={cert.name}
                            onChange={(e) => {
                              const newCertifications = [...cv.certifications];
                              newCertifications[index].name = e.target.value;
                              setCV({ ...cv, certifications: newCertifications });
                            }}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Issuer</label>
                          <input
                            type="text"
                            value={cert.issuer}
                            onChange={(e) => {
                              const newCertifications = [...cv.certifications];
                              newCertifications[index].issuer = e.target.value;
                              setCV({ ...cv, certifications: newCertifications });
                            }}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Date</label>
                          <input
                            type="date"
                            value={cert.date}
                            onChange={(e) => {
                              const newCertifications = [...cv.certifications];
                              newCertifications[index].date = e.target.value;
                              setCV({ ...cv, certifications: newCertifications });
                            }}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">URL (optional)</label>
                          <input
                            type="url"
                            value={cert.url}
                            onChange={(e) => {
                              const newCertifications = [...cv.certifications];
                              newCertifications[index].url = e.target.value;
                              setCV({ ...cv, certifications: newCertifications });
                            }}
                            placeholder="https://example.com/certificate"
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

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

        {/* Image Cropper Modal */}
        {showImageCropper && tempImageUrl && (
          <ImageCropper
            imageUrl={tempImageUrl}
            onCropComplete={handlePhotoCropComplete}
            onCancel={() => {
              setShowImageCropper(false);
              setTempImageUrl(null);
            }}
          />
        )}

        {/* Click outside handler for color picker */}
        {showColorPicker && (
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setShowColorPicker(false)}
          />
        )}
      </div>
    </div>
  );
}