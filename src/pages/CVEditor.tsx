import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import type { CV } from '../lib/database.types';
import { FileText, Download, Share2, Save, ArrowLeft, Eye } from 'lucide-react';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import ShareCVDialog from '../components/ShareCVDialog';

// Add template type definition
type TemplateType = 'Modern' | 'Classic' | 'Creative' | 'Acting & Performance' | 'Academic';

// Add template-specific rendering components
const ActingTemplate = ({ cv, isViewMode }: { cv: CV; isViewMode: boolean }) => (
  <div className="bg-white shadow rounded-lg p-8">
    {/* Acting & Performance specific layout */}
    <div className="text-center mb-8">
      <h1 className="text-3xl font-bold text-gray-900">{cv.personal_info.full_name}</h1>
      <div className="mt-2 text-gray-600">
        <p>{cv.personal_info.email} • {cv.personal_info.phone}</p>
        <p>{cv.personal_info.address}</p>
      </div>
    </div>

    {/* Performance Summary */}
    {cv.personal_info.summary && (
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-3">Performance Profile</h2>
        <p className="text-gray-700 italic">{cv.personal_info.summary}</p>
      </div>
    )}

    {/* Skills - Displayed prominently for acting skills */}
    {cv.skills.length > 0 && (
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-3">Performance Skills</h2>
        <div className="grid grid-cols-2 gap-4">
          {cv.skills.map((skill, index) => (
            <div key={index} className="bg-gray-50 p-3 rounded">
              <p className="font-medium text-gray-900">{skill.name}</p>
              <p className="text-sm text-gray-500">{skill.category}</p>
            </div>
          ))}
        </div>
      </div>
    )}

    {/* Performance Experience */}
    {cv.experience.length > 0 && (
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-3">Performance Experience</h2>
        <div className="space-y-6">
          {cv.experience.map((exp, index) => (
            <div key={index} className="border-l-4 border-indigo-500 pl-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">{exp.title}</h3>
                  <p className="text-indigo-600">{exp.company}</p>
                  <p className="text-gray-600">{exp.location}</p>
                </div>
                <p className="text-sm text-gray-500">
                  {exp.start_date} - {exp.current ? 'Present' : exp.end_date}
                </p>
              </div>
              <p className="mt-2 text-gray-700 italic">{exp.description}</p>
            </div>
          ))}
        </div>
      </div>
    )}

    {/* Training/Education */}
    {cv.education.length > 0 && (
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-3">Training & Education</h2>
        <div className="space-y-6">
          {cv.education.map((edu, index) => (
            <div key={index}>
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">{edu.degree}</h3>
                  <p className="text-gray-600">{edu.institution}</p>
                  <p className="text-gray-500">{edu.location}</p>
                </div>
                <p className="text-sm text-gray-500">
                  {edu.start_date} - {edu.end_date}
                </p>
              </div>
              <p className="mt-2 text-gray-700">{edu.description}</p>
            </div>
          ))}
        </div>
      </div>
    )}
  </div>
);

const AcademicTemplate = ({ cv, isViewMode }: { cv: CV; isViewMode: boolean }) => (
  <div className="bg-white shadow rounded-lg p-8">
    {/* Academic-specific layout */}
    <div className="mb-8">
      <h1 className="text-4xl font-serif text-gray-900">{cv.personal_info.full_name}</h1>
      <div className="mt-4 text-gray-600">
        <p>{cv.personal_info.email} • {cv.personal_info.phone}</p>
        <p>{cv.personal_info.address}</p>
      </div>
    </div>

    {/* Publications, Research, etc. */}
    {/* ... Academic-specific sections ... */}
  </div>
);

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
          const { data, error } = await supabase
            .from('cvs')
            .select('*')
            .eq('id', id)
            .single();

          if (error) throw error;
          if (!data) throw new Error('CV not found');
          
          setCV(data);
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

  const handleSave = async () => {
    if (!cv || !user) return;

    try {
      setSaving(true);
      setError('');

      // If this is a new CV from a template
      if (isTemplate) {
        const { data, error: insertError } = await supabase
          .from('cvs')
          .insert({
            ...cv,
            user_id: user.id,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          })
          .select()
          .single();

        if (insertError) throw insertError;
        if (data) {
          setCV(data);
          // Redirect to the new CV's edit page
          navigate(`/cv/${data.id}`);
        }
      } else {
        // Update existing CV
        const { error: updateError } = await supabase
          .from('cvs')
          .update({
            ...cv,
            updated_at: new Date().toISOString(),
          })
          .eq('id', cv.id);

        if (updateError) throw updateError;
      }
    } catch (error) {
      console.error('Error saving CV:', error);
      setError('Failed to save changes');
    } finally {
      setSaving(false);
    }
  };

  const handleDownloadPDF = async () => {
    if (!cvRef.current) return;

    try {
      const canvas = await html2canvas(cvRef.current);
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'px',
        format: [canvas.width, canvas.height]
      });

      pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
      pdf.save('cv.pdf');
      setShowDownloadMenu(false);
    } catch (error) {
      console.error('Error generating PDF:', error);
      setError('Failed to download PDF');
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

  // Add template selection handling
  const renderTemplate = () => {
    if (!cv) return null;

    switch (cv.template as TemplateType) {
      case 'Acting & Performance':
        return <ActingTemplate cv={cv} isViewMode={isViewMode} />;
      case 'Academic':
        return <AcademicTemplate cv={cv} isViewMode={isViewMode} />;
      // Add other template cases here
      default:
        return (
          // Default template (existing view mode template)
          <div className="bg-white shadow rounded-lg p-8">
            {/* Personal Info */}
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900">{cv.personal_info.full_name}</h1>
              <div className="mt-2 text-gray-600">
                <p>{cv.personal_info.email} • {cv.personal_info.phone}</p>
                <p>{cv.personal_info.address}</p>
              </div>
            </div>

            {/* Summary */}
            {cv.personal_info.summary && (
              <div className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-3">Professional Summary</h2>
                <p className="text-gray-700">{cv.personal_info.summary}</p>
              </div>
            )}

            {/* Experience */}
            {cv.experience.length > 0 && (
              <div className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-3">Experience</h2>
                <div className="space-y-6">
                  {cv.experience.map((exp, index) => (
                    <div key={index}>
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-lg font-medium text-gray-900">{exp.title}</h3>
                          <p className="text-gray-600">{exp.company} • {exp.location}</p>
                        </div>
                        <p className="text-sm text-gray-500">
                          {exp.start_date} - {exp.current ? 'Present' : exp.end_date}
                        </p>
                      </div>
                      <p className="mt-2 text-gray-700">{exp.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Education */}
            {cv.education.length > 0 && (
              <div className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-3">Education</h2>
                <div className="space-y-6">
                  {cv.education.map((edu, index) => (
                    <div key={index}>
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-lg font-medium text-gray-900">{edu.degree}</h3>
                          <p className="text-gray-600">{edu.institution} • {edu.location}</p>
                        </div>
                        <p className="text-sm text-gray-500">
                          {edu.start_date} - {edu.end_date}
                        </p>
                      </div>
                      <p className="mt-2 text-gray-700">{edu.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Skills */}
            {cv.skills.length > 0 && (
              <div className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-3">Skills</h2>
                <div className="grid grid-cols-2 gap-4">
                  {cv.skills.map((skill, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-900">{skill.name}</p>
                        <p className="text-sm text-gray-500">{skill.category}</p>
                      </div>
                      <span className="text-sm text-gray-600">
                        {['Beginner', 'Intermediate', 'Advanced', 'Expert', 'Master'][skill.level - 1]}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Languages */}
            {cv.languages.length > 0 && (
              <div className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-3">Languages</h2>
                <div className="grid grid-cols-2 gap-4">
                  {cv.languages.map((lang, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <p className="font-medium text-gray-900">{lang.name}</p>
                      <p className="text-sm text-gray-600">{lang.proficiency}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Certifications */}
            {cv.certifications.length > 0 && (
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-3">Certifications</h2>
                <div className="space-y-4">
                  {cv.certifications.map((cert, index) => (
                    <div key={index}>
                      <h3 className="font-medium text-gray-900">{cert.name}</h3>
                      <p className="text-sm text-gray-600">
                        {cert.issuer} • {cert.date}
                      </p>
                      {cert.url && (
                        <a
                          href={cert.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-indigo-600 hover:text-indigo-500"
                        >
                          View Certificate
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        );
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
                <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10">
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
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* CV Content */}
        <div ref={cvRef}>
          {isViewMode ? (
            renderTemplate()
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Personal Info */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Personal Information</h3>
                <div className="space-y-4">
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
                      skills: [...cv.skills, {
                        name: '',
                        level: 1,
                        category: ''
                      }]
                    })}
                    className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200"
                  >
                    Add Skill
                  </button>
                </div>
                <div className="space-y-4">
                  {cv.skills.map((skill, index) => (
                    <div key={index} className="border rounded-lg p-4">
                      <div className="flex justify-between mb-4">
                        <h4 className="text-sm font-medium text-gray-900">Skill #{index + 1}</h4>
                        <button
                          onClick={() => {
                            const newSkills = [...cv.skills];
                            newSkills.splice(index, 1);
                            setCV({ ...cv, skills: newSkills });
                          }}
                          className="text-red-600 hover:text-red-700"
                        >
                          Remove
                        </button>
                      </div>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Skill Name</label>
                          <input
                            type="text"
                            value={skill.name}
                            onChange={(e) => {
                              const newSkills = [...cv.skills];
                              newSkills[index].name = e.target.value;
                              setCV({ ...cv, skills: newSkills });
                            }}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Category</label>
                          <input
                            type="text"
                            value={skill.category}
                            onChange={(e) => {
                              const newSkills = [...cv.skills];
                              newSkills[index].category = e.target.value;
                              setCV({ ...cv, skills: newSkills });
                            }}
                            placeholder="e.g., Programming, Design, Management"
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Proficiency Level</label>
                          <select
                            value={skill.level}
                            onChange={(e) => {
                              const newSkills = [...cv.skills];
                              newSkills[index].level = parseInt(e.target.value);
                              setCV({ ...cv, skills: newSkills });
                            }}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                          >
                            <option value={1}>Beginner</option>
                            <option value={2}>Intermediate</option>
                            <option value={3}>Advanced</option>
                            <option value={4}>Expert</option>
                            <option value={5}>Master</option>
                          </select>
                        </div>
                      </div>
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
                        proficiency: 'beginner'
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
                              newLanguages[index].proficiency = e.target.value;
                              setCV({ ...cv, languages: newLanguages });
                            }}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                          >
                            <option value="beginner">Beginner</option>
                            <option value="intermediate">Intermediate</option>
                            <option value="advanced">Advanced</option>
                            <option value="native">Native</option>
                            <option value="fluent">Fluent</option>
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
      </div>
    </div>
  );
}