import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { CV } from '../lib/database.types';
import { Copy, Loader } from 'lucide-react';

export default function UseTemplate() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [cv, setCV] = useState<CV | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    const loadCV = async () => {
      try {
        const { data: post, error: postError } = await supabase
          .from('cv_posts')
          .select('cv:cvs(*)')
          .eq('id', id)
          .single();

        if (postError) throw postError;
        if (!post) throw new Error('CV not found');
        
        setCV(post.cv);
      } catch (error) {
        console.error('Error loading CV:', error);
        setError('Failed to load CV template');
      } finally {
        setLoading(false);
      }
    };

    loadCV();
  }, [id, user, navigate]);

  const handleUseTemplate = async () => {
    if (!cv || !user) return;

    try {
      setCreating(true);
      setError('');

      // Base CV structure
      const baseCV = {
        user_id: user.id,
        template: cv.template,
        personal_info: {
          full_name: '',
          email: '',
          phone: '',
          location: '',  // Changed from address to match templates
          linkedin: '',
          summary: '',
          photo_url: undefined,
        },
      };

      // Template-specific structures
      const newCV = {
        ...baseCV,
        ...(cv.template === 'minimal-edge' && {
          // Matches Justine's data analyst template
          personal_info: {
            ...baseCV.personal_info,
            twitter: '',  // Additional social link
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
            category: '',  // For grouping technical skills
          }],
          certifications: [],
        }),

        ...(cv.template === 'modern-tech' && {
          // Matches Rhonda's teaching template with sidebar
          personal_info: {
            ...baseCV.personal_info,
            career_objective: '',  // Added for objective statement
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
            category: 'soft_skills',  // For categorizing skills
          }],
          certifications: [],
        }),

        ...(cv.template === 'executive-pro' && {
          // Matches Alex's business development template
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
            achievements: [],  // For quantifiable results
          }],
          skills: [{
            name: '',
            category: 'business',  // For skill categorization
          }],
          certifications: [{
            name: '',
            year: '',
            issuer: '',
          }],
        }),

        ...(cv.template === 'creative-studio' && {
          // Matches Saul's acting template
          personal_info: {
            ...baseCV.personal_info,
            attributes: {  // For actor-specific details
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
            proficiency: 0,  // For percentage-based skill ratings
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
        }),
      };

      const { data, error } = await supabase
        .from('cvs')
        .insert([newCV])
        .select()
        .single();

      if (error) throw error;

      navigate(`/cv/edit/${data.id}`);
    } catch (error) {
      console.error('Error creating CV:', error);
      setError('Failed to create CV from template');
    } finally {
      setCreating(false);
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
          <h2 className="text-xl font-semibold text-gray-900">Template not found</h2>
          <button
            onClick={() => navigate('/creators')}
            className="mt-4 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
          >
            Back to Creators
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="p-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Use This CV Template</h1>
            
            {error && (
              <div className="mb-4 bg-red-50 border border-red-400 text-red-700 px-4 py-3 rounded">
                {error}
              </div>
            )}

            <div className="bg-gray-50 rounded-lg p-6 mb-6">
              <h2 className="text-lg font-medium text-gray-900 mb-2">Template Preview</h2>
              <div className="prose max-w-none">
                <h3>{cv.personal_info.full_name}</h3>
                <p>{cv.personal_info.summary}</p>
                
                <div className="mt-4">
                  <h4 className="text-sm font-medium text-gray-700">Template includes:</h4>
                  <ul className="mt-2 space-y-1 text-sm text-gray-600">
                    <li>{cv.education.length} education sections</li>
                    <li>{cv.experience.length} experience sections</li>
                    <li>{cv.skills.length} skills</li>
                    <li>{cv.languages.length} languages</li>
                    <li>{cv.certifications.length} certifications</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                onClick={handleUseTemplate}
                disabled={creating}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50"
              >
                {creating ? (
                  <>
                    <Loader className="animate-spin h-4 w-4 mr-2" />
                    Creating...
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4 mr-2" />
                    Use Template
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}