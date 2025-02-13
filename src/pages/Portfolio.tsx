import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import type { CV } from '../lib/database.types';
import { FileText, Download, CreditCard, Plus, Eye, Trash2, AlertCircle } from 'lucide-react';
import { useReactToPrint } from 'react-to-print';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

const CV_TEMPLATES = [
  {
    id: 'minimal-edge',
    name: 'Data Analyst Template',
    preview: 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?auto=format&fit=crop&q=80&w=400&h=300',
    description: 'Clean and data-focused design perfect for analysts',
    premium: false,
    structure: {
      personal_info: {
        full_name: '',
        email: '',
        phone: '',
        location: '',
        linkedin: '',
        twitter: '',
        summary: '',
        photo_url: undefined,
      },
      education: [{
        institution: '',
        degree: '',
        field: '',
        location: '',
        start_date: '',
        end_date: '',
      }],
      experience: [{
        title: '',
        company: '',
        location: '',
        start_date: '',
        end_date: '',
        current: false,
        description: '',
        highlights: [],
      }],
      skills: [{
        name: '',
        category: '',
      }],
      certifications: [],
    }
  },
  {
    id: 'modern-tech',
    name: 'Teaching Professional',
    preview: 'https://images.unsplash.com/photo-1586281380117-5a60ae2050cc?auto=format&fit=crop&q=80&w=400&h=300',
    description: 'Modern layout for education professionals',
    premium: false,
    structure: {
      personal_info: {
        full_name: '',
        email: '',
        phone: '',
        location: '',
        linkedin: '',
        career_objective: '',
        summary: '',
        photo_url: undefined,
      },
      education: [{
        institution: '',
        degree: '',
        graduation_year: '',
        location: '',
      }],
      experience: [{
        title: '',
        company: '',
        location: '',
        date_range: '',
        bullets: [],
      }],
      skills: [{
        name: '',
        category: 'soft_skills',
      }],
      certifications: [],
    }
  },
  {
    id: 'executive-pro',
    name: 'Business Development',
    preview: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&q=80&w=400&h=300',
    description: 'Executive style for business professionals',
    premium: true,
    structure: {
      personal_info: {
        full_name: '',
        email: '',
        phone: '',
        location: '',
        linkedin: '',
        summary: '',
        photo_url: undefined,
      },
      education: [{
        degree: '',
        field: '',
        institution: '',
        location: '',
        start_date: '',
        end_date: '',
      }],
      experience: [{
        title: '',
        company: '',
        location: '',
        start_date: '',
        end_date: '',
        achievements: [],
      }],
      skills: [{
        name: '',
        category: 'business',
      }],
      certifications: [{
        name: '',
        year: '',
        issuer: '',
      }],
    }
  },
  {
    id: 'creative-studio',
    name: 'Acting & Performance',
    preview: 'https://images.unsplash.com/photo-1460723237483-7a6dc9d0b212?auto=format&fit=crop&q=80&w=400&h=300',
    description: 'Creative layout for performing artists',
    premium: true,
    structure: {
      personal_info: {
        full_name: '',
        email: '',
        phone: '',
        location: '',
        linkedin: '',
        summary: '',
        photo_url: undefined,
        attributes: {
          height: '',
          weight: '',
          hair: '',
          eyes: '',
        },
        accents: [],
      },
      experience: [{
        production: '',
        role: '',
        venue: '',
        director: '',
        date: '',
      }],
      skills: [{
        name: '',
        proficiency: 0,
      }],
      training: [{
        program: '',
        institution: '',
        date: '',
      }],
      awards: [{
        title: '',
        organization: '',
        date: '',
        description: '',
      }],
    }
  },
];

export default function CVMaker() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [cvs, setCVs] = useState<CV[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState('');
  const [credits, setCredits] = useState(2);
  const [showPayment, setShowPayment] = useState(false);
  const cvRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!user) return;

    const loadCVs = async () => {
      try {
        const { data: userCVs, error: cvsError } = await supabase
          .from('cvs')
          .select('*')
          .eq('user_id', user.id);

        if (cvsError) throw cvsError;
        setCVs(userCVs || []);

        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('cv_credits')
          .eq('id', user.id)
          .single();

        if (profileError) throw profileError;
        setCredits(profile.cv_credits);
      } catch (error) {
        console.error('Error loading CVs:', error);
        setError('Failed to load your CVs. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    loadCVs();
  }, [user]);

  const handleCreateCV = async (templateId: string) => {
    if (!user) return;

    try {
      setCreating(true);
      setError('');

      const template = CV_TEMPLATES.find(t => t.id === templateId);
      if (!template) throw new Error('Template not found');

      if (template.premium && credits < 1) {
        setShowPayment(true);
        return;
      }

      const newCV = {
        user_id: user.id,
        template: templateId,
        ...template.structure
      };

      const { data, error } = await supabase
        .from('cvs')
        .insert([newCV])
        .select()
        .single();

      if (error) throw error;

      // Deduct credits if premium template
      if (template.premium) {
        await supabase
          .from('profiles')
          .update({ cv_credits: credits - 1 })
          .eq('id', user.id);
      }

      setCVs([...cvs, data]);
      navigate(`/cv/edit/${data.id}`);
    } catch (error) {
      console.error('Error creating CV:', error);
      setError('Failed to create CV. Please try again.');
    } finally {
      setCreating(false);
    }
  };

  const handleDeleteCV = async (cvId: string) => {
    try {
      setError('');
      const { error } = await supabase
        .from('cvs')
        .delete()
        .eq('id', cvId);

      if (error) throw error;
      setCVs(cvs.filter(cv => cv.id !== cvId));
    } catch (error) {
      console.error('Error deleting CV:', error);
      setError('Failed to delete CV. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">CV Maker</h1>
            <p className="mt-2 text-sm text-gray-600">
              Create professional CVs with our beautiful templates
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-sm text-gray-600">
              Credits remaining: <span className="font-semibold">{credits}</span>
            </div>
            <button
              onClick={() => setShowPayment(true)}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
            >
              <CreditCard className="h-4 w-4 mr-2" />
              Buy Credits
            </button>
          </div>
        </div>

        {error && (
          <div className="mb-6 bg-red-50 border border-red-400 text-red-700 px-4 py-3 rounded relative">
            <div className="flex items-center">
              <AlertCircle className="h-5 w-5 mr-2" />
              <span>{error}</span>
            </div>
          </div>
        )}

        {/* My CVs Section */}
        {cvs.length > 0 && (
          <div className="mb-12">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">My CVs</h2>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {cvs.map((cv) => (
                <div key={cv.id} className="bg-white rounded-lg shadow-sm p-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    {cv.personal_info.full_name || 'Untitled CV'}
                  </h3>
                  <p className="text-sm text-gray-500 mb-4">
                    Template: {cv.template}
                  </p>
                  <div className="flex justify-between">
                    <button
                      onClick={() => navigate(`/cv/edit/${cv.id}`)}
                      className="inline-flex items-center text-sm text-indigo-600 hover:text-indigo-500"
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteCV(cv.id)}
                      className="inline-flex items-center text-sm text-red-600 hover:text-red-500"
                    >
                      <Trash2 className="h-4 w-4 mr-1" />
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Templates Section */}
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Choose a Template</h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {CV_TEMPLATES.map((template) => (
              <div key={template.id} className="bg-white rounded-lg shadow-sm overflow-hidden">
                <img
                  src={template.preview}
                  alt={template.name}
                  className="w-full h-48 object-cover"
                />
                <div className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-medium text-gray-900">{template.name}</h3>
                    {template.premium && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                        Premium
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-500 mb-4">{template.description}</p>
                  <button
                    onClick={() => handleCreateCV(template.id)}
                    disabled={creating || (template.premium && credits <= 0)}
                    className="w-full inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {creating ? (
                      <div className="flex items-center">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                        Creating...
                      </div>
                    ) : (
                      <>
                        <Plus className="h-4 w-4 mr-2" />
                        Use Template
                      </>
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Payment Modal */}
        {showPayment && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Buy CV Credits</h3>
              <div className="space-y-4">
                <div className="bg-indigo-50 p-4 rounded-md">
                  <h4 className="font-medium text-indigo-900">Premium Package</h4>
                  <p className="text-indigo-700">5 CV Credits</p>
                  <p className="text-2xl font-bold text-indigo-900 mt-2">₹499</p>
                </div>
                <div className="flex justify-between items-center p-4 border rounded-md">
                  <div>
                    <h4 className="font-medium">UPI Payment</h4>
                    <p className="text-sm text-gray-500">Pay using any UPI app</p>
                  </div>
                  <img
                    src="https://images.unsplash.com/photo-1622637625617-6abb3da53c7a?auto=format&fit=crop&q=80&w=100&h=100"
                    alt="QR Code"
                    className="w-16 h-16"
                  />
                </div>
                <button
                  onClick={() => setShowPayment(false)}
                  className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}