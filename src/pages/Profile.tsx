import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import api from '../lib/api';
import { Profile } from '../lib/database.types';
import { 
  User, Camera, LogOut, Mail, Phone, MapPin, Linkedin, 
  FileText, Upload, Edit, Trash2, Plus,
  CheckCircle, AlertCircle, ExternalLink, Briefcase, GraduationCap
} from 'lucide-react';
import ImageCropper from '../components/ImageCropper';

interface CV {
  id: string;
  template: string;
  target_role?: string;
  ats_score?: number;
  personal_info: {
    full_name: string;
    email: string;
  };
  created_at: string;
  updated_at: string;
  is_public?: boolean;
}

interface ParsedCVData {
  personal_info: Record<string, string>;
  experience: Array<Record<string, unknown>>;
  education: Array<Record<string, unknown>>;
  skills: Array<Record<string, unknown>>;
  projects: Array<Record<string, unknown>>;
  certifications: Array<Record<string, unknown>>;
  languages: Array<Record<string, unknown>>;
}

export default function ProfilePage() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showCropper, setShowCropper] = useState(false);
  
  // CV related states
  const [myCVs, setMyCVs] = useState<CV[]>([]);
  const [loadingCVs, setLoadingCVs] = useState(true);
  const [uploadingCV, setUploadingCV] = useState(false);
  const [uploadedCVUrl, setUploadedCVUrl] = useState<string | null>(null);
  const [parsedCVData, setParsedCVData] = useState<ParsedCVData | null>(null);
  const [uploadMessage, setUploadMessage] = useState<{type: 'success' | 'error', text: string} | null>(null);

  // LinkedIn field
  const [linkedinUrl, setLinkedinUrl] = useState('');

  const fetchMyCVs = useCallback(async () => {
    try {
      setLoadingCVs(true);
      const response = await api.listMyCVs();
      setMyCVs(response.cvs || []);
    } catch (error) {
      console.error('Error fetching CVs:', error);
    } finally {
      setLoadingCVs(false);
    }
  }, []);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    const getProfile = async () => {
      try {
        const data = await api.getMyProfile();
        setProfile(data as unknown as Profile);
        if (data.avatar_url) {
          setAvatarUrl(data.avatar_url);
        }
        setLinkedinUrl(data.linkedin_url || '');
        
        if ((data as any).uploaded_cv_url) {
          setUploadedCVUrl((data as any).uploaded_cv_url);
        }
        if ((data as any).parsed_cv_data) {
          setParsedCVData((data as any).parsed_cv_data);
        }
      } catch (error) {
        console.error('Error loading profile:', error);
      } finally {
        setLoading(false);
      }
    };

    getProfile();
    fetchMyCVs();
  }, [user, navigate, fetchMyCVs]);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
        setShowCropper(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCropComplete = async (croppedBlob: Blob) => {
    try {
      setUpdating(true);
      const fileExt = 'jpg';
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${user!.id}/${fileName}`;

      if (profile?.avatar_url) {
        const oldPath = profile.avatar_url.split('/').pop();
        if (oldPath) {
          await supabase.storage.from('avatars').remove([`${user!.id}/${oldPath}`]);
        }
      }

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, croppedBlob, { contentType: 'image/jpeg', upsert: true });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage.from('avatars').getPublicUrl(filePath);

      await supabase.from('profiles').update({ avatar_url: publicUrl }).eq('id', user!.id);

      setAvatarUrl(publicUrl);
      setShowCropper(false);
      setSelectedImage(null);
    } catch (error) {
      console.error('Error updating avatar:', error);
    } finally {
      setUpdating(false);
    }
  };

  const handleCVUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (!validTypes.includes(file.type)) {
      setUploadMessage({ type: 'error', text: 'Please upload a PDF or Word document' });
      return;
    }

    try {
      setUploadingCV(true);
      setUploadMessage(null);

      // First, parse the document through backend
      const parseResult = await api.parseDocument(file);
      
      if (parseResult.success && parseResult.data) {
        // Try to upload to storage (optional - may not have bucket set up)
        let publicUrl = '';
        try {
          const fileName = `${user!.id}/cv_${Date.now()}.${file.name.split('.').pop()}`;
          const { error: uploadError } = await supabase.storage
            .from('user-cvs')
            .upload(fileName, file, { upsert: true });

          if (!uploadError) {
            const { data } = supabase.storage.from('user-cvs').getPublicUrl(fileName);
            publicUrl = data.publicUrl;
          }
        } catch (storageError) {
          console.warn('Storage upload skipped:', storageError);
        }

        // Update profile with parsed data
        try {
          await api.updateProfile({
            uploaded_cv_url: publicUrl || undefined,
            parsed_cv_data: parseResult.data,
          } as any);
        } catch (profileError) {
          console.warn('Profile update skipped:', profileError);
        }

        setUploadedCVUrl(publicUrl || null);
        setParsedCVData(parseResult.data as any);
        setUploadMessage({ type: 'success', text: 'Resume parsed successfully! You can now use it for AI tailoring.' });
      } else {
        throw new Error('Failed to parse document');
      }
    } catch (error) {
      console.error('Error uploading CV:', error);
      setUploadMessage({ type: 'error', text: error instanceof Error ? error.message : 'Failed to upload resume. Please try again.' });
    } finally {
      setUploadingCV(false);
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) return;

    try {
      setUpdating(true);
      await api.updateProfile({
        username: profile.username,
        display_name: profile.display_name,
        avatar_url: profile.avatar_url || undefined,
        linkedin_url: linkedinUrl || undefined,
        phone: profile.phone || undefined,
        address: profile.address || undefined,
      } as any);
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
    } finally {
      setUpdating(false);
    }
  };

  const handleDeleteCV = async (cvId: string) => {
    if (!confirm('Are you sure you want to delete this resume?')) return;
    
    try {
      await api.deleteCV(cvId);
      setMyCVs(prev => prev.filter(cv => cv.id !== cvId));
    } catch (error) {
      console.error('Error deleting CV:', error);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/login');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-2 border-indigo-600 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Header */}
      <div className="bg-white border-b">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4 flex justify-between items-center">
          <h1 className="text-lg font-semibold text-gray-900">My Account</h1>
          <button
            onClick={handleSignOut}
            className="text-gray-500 hover:text-gray-700 flex items-center gap-2 text-sm"
          >
            <LogOut className="h-4 w-4" />
            Sign Out
          </button>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-6">
        
        {/* Profile Card */}
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
          <div className="p-6 border-b border-gray-100">
            <div className="flex flex-col sm:flex-row items-start gap-6">
              {/* Avatar */}
              <div className="relative">
                <div className="w-20 h-20 rounded-full overflow-hidden bg-gray-100 border-2 border-gray-200">
                  {avatarUrl ? (
                    <img src={avatarUrl} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <User className="w-full h-full p-4 text-gray-400" />
                  )}
                </div>
                {isEditing && (
                  <label className="absolute -bottom-1 -right-1 bg-indigo-600 rounded-full p-1.5 cursor-pointer hover:bg-indigo-700 transition-colors">
                    <Camera className="h-3.5 w-3.5 text-white" />
                    <input type="file" accept="image/*" className="hidden" onChange={handleImageSelect} />
                  </label>
                )}
              </div>

              {/* Info */}
              <div className="flex-1">
                <h2 className="text-xl font-semibold text-gray-900">{profile?.display_name}</h2>
                <p className="text-gray-500 text-sm">@{profile?.username}</p>
                
                <div className="flex flex-wrap gap-3 mt-3">
                  <span className="inline-flex items-center px-2.5 py-1 rounded-md bg-gray-100 text-gray-700 text-xs font-medium">
                    {myCVs.length} Resume{myCVs.length !== 1 ? 's' : ''}
                  </span>
                  <span className="inline-flex items-center px-2.5 py-1 rounded-md bg-gray-100 text-gray-700 text-xs font-medium">
                    {profile?.cv_credits || 0} Credits
                  </span>
                  <span className="inline-flex items-center px-2.5 py-1 rounded-md bg-indigo-50 text-indigo-700 text-xs font-medium capitalize">
                    {profile?.subscription_status || 'Free'} Plan
                  </span>
                </div>
              </div>

              {/* Edit Button */}
              <button
                onClick={() => setIsEditing(!isEditing)}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  isEditing 
                    ? 'bg-gray-100 text-gray-700 hover:bg-gray-200' 
                    : 'bg-indigo-600 text-white hover:bg-indigo-700'
                }`}
              >
                {isEditing ? 'Cancel' : 'Edit Profile'}
              </button>
            </div>
          </div>

          {/* Profile Details */}
          <div className="p-6">
            <form onSubmit={handleUpdate}>
              {isEditing ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Display Name</label>
                    <input
                      type="text"
                      value={profile?.display_name || ''}
                      onChange={(e) => setProfile(prev => prev ? {...prev, display_name: e.target.value} : null)}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                    <input
                      type="text"
                      value={profile?.username || ''}
                      onChange={(e) => setProfile(prev => prev ? {...prev, username: e.target.value} : null)}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">LinkedIn URL</label>
                    <input
                      type="url"
                      value={linkedinUrl}
                      onChange={(e) => setLinkedinUrl(e.target.value)}
                      placeholder="https://linkedin.com/in/yourprofile"
                      className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                    <input
                      type="tel"
                      value={profile?.phone || ''}
                      onChange={(e) => setProfile(prev => prev ? {...prev, phone: e.target.value} : null)}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                    <input
                      type="text"
                      value={profile?.address || ''}
                      onChange={(e) => setProfile(prev => prev ? {...prev, address: e.target.value} : null)}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                  <div className="sm:col-span-2 flex justify-end pt-2">
                    <button
                      type="submit"
                      disabled={updating}
                      className="px-4 py-2 bg-indigo-600 text-white rounded-md text-sm font-medium hover:bg-indigo-700 disabled:opacity-50"
                    >
                      {updating ? 'Saving...' : 'Save Changes'}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-md">
                    <Mail className="h-4 w-4 text-gray-400" />
                    <div>
                      <p className="text-xs text-gray-500">Email</p>
                      <p className="text-sm text-gray-900">{profile?.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-md">
                    <Phone className="h-4 w-4 text-gray-400" />
                    <div>
                      <p className="text-xs text-gray-500">Phone</p>
                      <p className="text-sm text-gray-900">{profile?.phone || 'Not set'}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-md">
                    <Linkedin className="h-4 w-4 text-gray-400" />
                    <div className="min-w-0">
                      <p className="text-xs text-gray-500">LinkedIn</p>
                      {linkedinUrl ? (
                        <a href={linkedinUrl} target="_blank" rel="noopener noreferrer" className="text-sm text-indigo-600 hover:underline truncate block">
                          {linkedinUrl.replace('https://linkedin.com/in/', '')}
                        </a>
                      ) : (
                        <p className="text-sm text-gray-400">Not set</p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-md">
                    <MapPin className="h-4 w-4 text-gray-400" />
                    <div>
                      <p className="text-xs text-gray-500">Address</p>
                      <p className="text-sm text-gray-900">{profile?.address || 'Not set'}</p>
                    </div>
                  </div>
                </div>
              )}
            </form>
          </div>
        </div>

        {/* Upload Resume Section */}
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-semibold text-gray-900">Master Resume</h3>
              <p className="text-sm text-gray-500 mt-0.5">Upload your resume to auto-fill new applications</p>
            </div>
            {uploadedCVUrl && (
              <a
                href={uploadedCVUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
              >
                <ExternalLink className="h-4 w-4" /> View File
              </a>
            )}
          </div>
          
          <label className={`block border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
            uploadingCV ? 'border-indigo-300 bg-indigo-50' : 'border-gray-200 hover:border-indigo-300 hover:bg-gray-50'
          }`}>
            <input
              type="file"
              accept=".pdf,.docx"
              className="hidden"
              onChange={handleCVUpload}
              disabled={uploadingCV}
            />
            {uploadingCV ? (
              <div className="flex flex-col items-center">
                <div className="animate-spin rounded-full h-6 w-6 border-2 border-indigo-600 border-t-transparent mb-2" />
                <span className="text-sm text-indigo-600">Processing...</span>
              </div>
            ) : (
              <div className="flex flex-col items-center">
                <Upload className="h-8 w-8 text-gray-400 mb-2" />
                <span className="text-sm font-medium text-gray-700">Click to upload resume</span>
                <span className="text-xs text-gray-500 mt-1">PDF or Word document</span>
              </div>
            )}
          </label>

          {uploadMessage && (
            <div className={`mt-3 p-3 rounded-md flex items-center gap-2 text-sm ${
              uploadMessage.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
            }`}>
              {uploadMessage.type === 'success' ? <CheckCircle className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
              {uploadMessage.text}
            </div>
          )}

          {parsedCVData && (
            <div className="mt-4 flex flex-wrap gap-3">
              <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 rounded-md text-sm">
                <Briefcase className="h-4 w-4 text-gray-500" />
                <span className="text-gray-700">{parsedCVData.experience?.length || 0} Experience</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 rounded-md text-sm">
                <GraduationCap className="h-4 w-4 text-gray-500" />
                <span className="text-gray-700">{parsedCVData.education?.length || 0} Education</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 rounded-md text-sm">
                <FileText className="h-4 w-4 text-gray-500" />
                <span className="text-gray-700">{parsedCVData.skills?.length || 0} Skills</span>
              </div>
            </div>
          )}
        </div>

        {/* My Resumes Section */}
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
          <div className="p-6 border-b border-gray-100 flex items-center justify-between">
            <h3 className="text-base font-semibold text-gray-900">My Resumes</h3>
            <Link
              to="/portfolio"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 text-white rounded-md text-sm font-medium hover:bg-indigo-700"
            >
              <Plus className="h-4 w-4" />
              New Resume
            </Link>
          </div>

          <div className="p-6">
            {loadingCVs ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-6 w-6 border-2 border-indigo-600 border-t-transparent" />
              </div>
            ) : myCVs.length === 0 ? (
              <div className="text-center py-10">
                <FileText className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500 mb-4">No resumes created yet</p>
                <Link
                  to="/portfolio"
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-600 text-white rounded-md text-sm font-medium hover:bg-indigo-700"
                >
                  <Plus className="h-4 w-4" />
                  Create Your First Resume
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {myCVs.map((cv) => (
                  <div
                    key={cv.id}
                    className="flex items-center justify-between p-4 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-md bg-indigo-50 flex items-center justify-center">
                        <FileText className="h-5 w-5 text-indigo-600" />
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-gray-900">
                          {cv.personal_info?.full_name || 'Untitled Resume'}
                        </h4>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-xs text-gray-500">{cv.target_role || 'General'}</span>
                          <span className="text-gray-300">·</span>
                          <span className="text-xs text-gray-500">{formatDate(cv.updated_at || cv.created_at)}</span>
                          <span className="text-xs px-1.5 py-0.5 bg-gray-100 rounded capitalize">{cv.template}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      {cv.ats_score && (
                        <span className={`text-xs px-2 py-1 rounded font-medium ${
                          cv.ats_score >= 80 ? 'bg-green-50 text-green-700' :
                          cv.ats_score >= 60 ? 'bg-yellow-50 text-yellow-700' :
                          'bg-red-50 text-red-700'
                        }`}>
                          ATS: {cv.ats_score}%
                        </span>
                      )}
                      <Link
                        to={`/cv/edit/${cv.id}`}
                        className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-md transition-colors"
                      >
                        <Edit className="h-4 w-4" />
                      </Link>
                      <button
                        onClick={() => handleDeleteCV(cv.id)}
                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {showCropper && selectedImage && (
        <ImageCropper
          imageUrl={selectedImage}
          onCropComplete={handleCropComplete}
          onCancel={() => {
            setShowCropper(false);
            setSelectedImage(null);
          }}
        />
      )}
    </div>
  );
}