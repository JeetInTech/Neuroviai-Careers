import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import api from '../lib/api';
import { Profile } from '../lib/database.types';
import { 
  User, Camera, LogOut, Mail, Phone, MapPin, Linkedin, 
  FileText, Upload, Edit, Trash2, Plus,
  CheckCircle, AlertCircle, ExternalLink, Briefcase, GraduationCap,
  Download, Loader2, Clock, Eye, Settings, CreditCard, Lock, Shield, 
  Sparkles, Check, HelpCircle, ChevronRight, Activity, DollarSign, Bell, Database, Key
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
  const [showCropper, setShowCropper] = useState(false);
  
  // Dashboard & tabs state
  const [activeTab, setActiveTab] = useState<'overview' | 'resumes' | 'settings' | 'billing'>('overview');
  
  // CV related states
  const [myCVs, setMyCVs] = useState<CV[]>([]);
  const [loadingCVs, setLoadingCVs] = useState(true);
  const [uploadingCV, setUploadingCV] = useState(false);
  const [uploadedCVUrl, setUploadedCVUrl] = useState<string | null>(null);
  const [parsedCVData, setParsedCVData] = useState<ParsedCVData | null>(null);
  const [uploadMessage, setUploadMessage] = useState<{type: 'success' | 'error', text: string} | null>(null);
  const [downloadingCvId, setDownloadingCvId] = useState<string | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Settings custom states
  const [linkedinUrl, setLinkedinUrl] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [username, setUsername] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  
  // Security custom states
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordMessage, setPasswordMessage] = useState<{type: 'success' | 'error', text: string} | null>(null);
  const [updatingPassword, setUpdatingPassword] = useState(false);

  // Preferences toggles
  const [prefEmailAlerts, setPrefEmailAlerts] = useState(true);
  const [prefNewsletter, setPrefNewsletter] = useState(false);
  const [prefAutoBackup, setPrefAutoBackup] = useState(true);

  // Danger zone alerts
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [showDeleteAccountConfirm, setShowDeleteAccountConfirm] = useState(false);
  const [isResettingData, setIsResettingData] = useState(false);
  
  // Action notifications
  const [saveSuccessMessage, setSaveSuccessMessage] = useState<string | null>(null);

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
        setDisplayName(data.display_name || '');
        setUsername(data.username || '');
        setPhone(data.phone || '');
        setAddress(data.address || '');
        
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
      
      // Update local profile state
      if (profile) {
        setProfile({ ...profile, avatar_url: publicUrl });
      }
      
      setSaveSuccessMessage('Profile photo updated successfully!');
      setTimeout(() => setSaveSuccessMessage(null), 3000);
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
        username: username,
        display_name: displayName,
        avatar_url: avatarUrl || undefined,
        linkedin_url: linkedinUrl || undefined,
        phone: phone || undefined,
        address: address || undefined,
      } as any);
      
      // Update local profile state
      setProfile({
        ...profile,
        username,
        display_name: displayName,
        linkedin_url: linkedinUrl,
        phone,
        address
      });

      setSaveSuccessMessage('Settings updated successfully!');
      setTimeout(() => setSaveSuccessMessage(null), 3000);
    } catch (error) {
      console.error('Error updating profile:', error);
    } finally {
      setUpdating(false);
    }
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setPasswordMessage({ type: 'error', text: 'Passwords do not match.' });
      return;
    }
    if (newPassword.length < 6) {
      setPasswordMessage({ type: 'error', text: 'Password must be at least 6 characters long.' });
      return;
    }

    try {
      setUpdatingPassword(true);
      setPasswordMessage(null);
      const token = localStorage.getItem('access_token');
      if (!token) {
        throw new Error('User access token not found. Please log in again.');
      }
      
      const result = await api.updatePassword(token, newPassword);
      if (result.success) {
        setPasswordMessage({ type: 'success', text: 'Password updated successfully!' });
        setNewPassword('');
        setConfirmPassword('');
      } else {
        throw new Error(result.message || 'Failed to update password');
      }
    } catch (error) {
      console.error('Error updating password:', error);
      setPasswordMessage({ 
        type: 'error', 
        text: error instanceof Error ? error.message : 'Error updating password. Please try again.' 
      });
    } finally {
      setUpdatingPassword(false);
    }
  };

  const handleDeleteCV = async (cvId: string) => {
    try {
      await api.deleteCV(cvId);
      setMyCVs(prev => prev.filter(cv => cv.id !== cvId));
      setDeleteConfirmId(null);
      setSaveSuccessMessage('Resume deleted successfully.');
      setTimeout(() => setSaveSuccessMessage(null), 3000);
    } catch (error) {
      console.error('Error deleting CV:', error);
    }
  };

  const handleWipeData = async () => {
    try {
      setIsResettingData(true);
      // Wipe all user CVs
      for (const cv of myCVs) {
        await api.deleteCV(cv.id);
      }
      setMyCVs([]);
      
      // Update profile to clear master cv url & parsed data
      await api.updateProfile({
        uploaded_cv_url: undefined,
        parsed_cv_data: null as any
      } as any);
      
      setUploadedCVUrl(null);
      setParsedCVData(null);
      setShowResetConfirm(false);
      setSaveSuccessMessage('All resumes and profile data cleared successfully.');
      setTimeout(() => setSaveSuccessMessage(null), 3000);
    } catch (error) {
      console.error('Error resetting data:', error);
    } finally {
      setIsResettingData(false);
    }
  };

  const handleMockUpgrade = async (plan: string) => {
    try {
      setUpdating(true);
      // Simulate profile status update or let backend know
      await api.updateProfile({
        subscription_status: plan,
        cv_credits: plan === 'pro' ? 100 : 5
      } as any);
      
      // Refresh profile state
      const updatedProfile = await api.getMyProfile();
      setProfile(updatedProfile as unknown as Profile);
      setSaveSuccessMessage(`Successfully updated subscription to ${plan.toUpperCase()}!`);
      setTimeout(() => setSaveSuccessMessage(null), 3000);
    } catch (error) {
      console.error('Error upgrading:', error);
    } finally {
      setUpdating(false);
    }
  };

  const handleDownloadPDF = async (cv: CV) => {
    try {
      setDownloadingCvId(cv.id);
      const pdfBlob = await api.exportPDFById(cv.id);
      const url = URL.createObjectURL(pdfBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${cv.personal_info?.full_name || 'resume'}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading PDF:', error);
    } finally {
      setDownloadingCvId(null);
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
      <div className="min-h-screen bg-slate-50 dark:bg-[#0A0A0F] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="animate-spin h-10 w-10 text-indigo-600 dark:text-indigo-400" />
          <span className="text-sm font-medium text-slate-500 dark:text-slate-400">Loading your profile workspace...</span>
        </div>
      </div>
    );
  }

  // Calculate dynamic circular progress for AI credits
  const maxCredits = 100;
  const creditPercent = Math.min(((profile?.cv_credits || 0) / maxCredits) * 100, 100);
  const strokeRadius = 36;
  const strokeCircumference = 2 * Math.PI * strokeRadius;
  const strokeDashoffset = strokeCircumference - (creditPercent / 100) * strokeCircumference;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0A0A0F] text-slate-900 dark:text-slate-100 transition-colors duration-300">
      
      {/* Floating success banner */}
      {saveSuccessMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 bg-indigo-600 text-white rounded-xl shadow-xl transition-all animate-bounce">
          <CheckCircle className="h-5 w-5" />
          <span className="text-sm font-medium">{saveSuccessMessage}</span>
        </div>
      )}

      {/* Hero Banner Grid overlay */}
      <div className="relative overflow-hidden bg-gradient-to-r from-indigo-950 via-slate-950 to-indigo-950 text-white border-b border-indigo-900/50 dark:border-white/5 py-12 px-6 sm:px-12">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#0000000d_1px,transparent_1px),linear-gradient(to_bottom,#0000000d_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />
        
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
          <div className="flex items-center gap-5">
            {/* Avatar Holder with sleek glowing border */}
            <div className="relative group">
              <div className="w-24 h-24 rounded-full overflow-hidden bg-slate-800 border-4 border-indigo-500/20 group-hover:border-indigo-500/50 transition-all duration-300 shadow-xl flex items-center justify-center shrink-0">
                {avatarUrl ? (
                  <img src={avatarUrl} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <User className="w-12 h-12 text-slate-400" />
                )}
              </div>
              <label className="absolute -bottom-1 -right-1 bg-indigo-600 rounded-full p-2 cursor-pointer hover:bg-indigo-700 shadow-lg border border-indigo-500/30 transition-colors">
                <Camera className="h-4 w-4 text-white" />
                <input type="file" accept="image/*" className="hidden" onChange={handleImageSelect} />
              </label>
            </div>
            
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-2xl font-bold tracking-tight">{profile?.display_name || 'My Account'}</h1>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 capitalize">
                  <Sparkles className="h-3 w-3" />
                  {profile?.subscription_status || 'Free'} Member
                </span>
              </div>
              <p className="text-indigo-200/70 text-sm mt-1">@{profile?.username || 'user'}</p>
              <p className="text-indigo-200/50 text-xs mt-0.5 flex items-center gap-1.5">
                <Mail className="h-3.5 w-3.5" />
                {profile?.email}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <button
              onClick={handleSignOut}
              className="inline-flex items-center gap-1.5 px-4 py-2 border border-white/10 hover:border-white/20 bg-white/5 hover:bg-white/10 text-white rounded-xl text-sm font-medium transition-all"
            >
              <LogOut className="h-4 w-4" />
              Sign Out
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        
        {/* Core Layout Grid */}
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Left Navigation Sidebar */}
          <aside className="w-full lg:w-64 shrink-0">
            {/* Desktop Navigation Vertical List */}
            <nav className="hidden lg:flex flex-col gap-1.5 bg-white dark:bg-[#0D0D12]/60 dark:backdrop-blur-xl border border-slate-200/80 dark:border-white/5 p-3 rounded-2xl shadow-sm">
              <div className="px-3 py-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">Workspace</div>
              
              <button
                onClick={() => setActiveTab('overview')}
                className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  activeTab === 'overview' 
                    ? 'bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-semibold shadow-inner' 
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-white/5'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Activity className="h-4.5 w-4.5" />
                  <span>Overview</span>
                </div>
                {activeTab === 'overview' && <div className="h-1.5 w-1.5 rounded-full bg-indigo-600 dark:bg-indigo-400" />}
              </button>

              <button
                onClick={() => setActiveTab('resumes')}
                className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  activeTab === 'resumes' 
                    ? 'bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-semibold shadow-inner' 
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-white/5'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <FileText className="h-4.5 w-4.5" />
                  <span>My Resumes</span>
                </div>
                <span className="text-xs bg-slate-100 dark:bg-white/5 text-slate-500 dark:text-slate-400 px-2 py-0.5 rounded-md font-bold">
                  {myCVs.length}
                </span>
              </button>

              <div className="px-3 py-2 mt-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Preferences</div>

              <button
                onClick={() => setActiveTab('settings')}
                className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  activeTab === 'settings' 
                    ? 'bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-semibold shadow-inner' 
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-white/5'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Settings className="h-4.5 w-4.5" />
                  <span>Settings & Security</span>
                </div>
                {activeTab === 'settings' && <div className="h-1.5 w-1.5 rounded-full bg-indigo-600 dark:bg-indigo-400" />}
              </button>

              <button
                onClick={() => setActiveTab('billing')}
                className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  activeTab === 'billing' 
                    ? 'bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-semibold shadow-inner' 
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-white/5'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <CreditCard className="h-4.5 w-4.5" />
                  <span>Billing & Pricing</span>
                </div>
                <span className="text-[10px] bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 px-1.5 py-0.5 rounded font-bold uppercase tracking-wider">
                  {profile?.subscription_status === 'pro' ? 'Pro' : 'Free'}
                </span>
              </button>
            </nav>

            {/* Mobile Navigation Horizontal Chips Row */}
            <div className="flex lg:hidden overflow-x-auto gap-2 pb-3 no-scrollbar shrink-0">
              <button
                onClick={() => setActiveTab('overview')}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  activeTab === 'overview'
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/5 text-slate-600 dark:text-slate-400'
                }`}
              >
                <Activity className="h-4 w-4" />
                Overview
              </button>
              <button
                onClick={() => setActiveTab('resumes')}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  activeTab === 'resumes'
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/5 text-slate-600 dark:text-slate-400'
                }`}
              >
                <FileText className="h-4 w-4" />
                Resumes ({myCVs.length})
              </button>
              <button
                onClick={() => setActiveTab('settings')}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  activeTab === 'settings'
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/5 text-slate-600 dark:text-slate-400'
                }`}
              >
                <Settings className="h-4 w-4" />
                Settings
              </button>
              <button
                onClick={() => setActiveTab('billing')}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  activeTab === 'billing'
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/5 text-slate-600 dark:text-slate-400'
                }`}
              >
                <CreditCard className="h-4 w-4" />
                Billing ({profile?.subscription_status || 'Free'})
              </button>
            </div>
          </aside>

          {/* Active Canvas View Panel */}
          <main className="flex-1 min-w-0">
            
            {/* VIEW 1: OVERVIEW */}
            {activeTab === 'overview' && (
              <div className="space-y-6 animate-fade-in">
                
                {/* Statistics KPIs Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  
                  {/* Subscription card */}
                  <div className="bg-white dark:bg-[#0D0D12]/60 dark:backdrop-blur-xl border border-slate-200/80 dark:border-white/5 p-6 rounded-2xl shadow-sm flex flex-col justify-between group hover:border-indigo-500/30 transition-all duration-300">
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-500/10 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                        <Sparkles className="h-5 w-5" />
                      </div>
                      <span className="text-[10px] bg-indigo-100 dark:bg-indigo-500/20 text-indigo-700 dark:text-indigo-300 font-bold px-2 py-0.5 rounded uppercase tracking-wider">Plan Status</span>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-slate-500 dark:text-slate-400">Active Membership</h4>
                      <h3 className="text-2xl font-bold mt-1 text-slate-900 dark:text-white capitalize">{profile?.subscription_status || 'Free'} Plan</h3>
                      <p className="text-xs text-slate-400 dark:text-slate-500 mt-2">
                        {profile?.subscription_status === 'pro' ? 'Enjoying unlimited access, templates, & premium credits.' : 'Basic tailoring. Upgrade to Pro for unlimited generation.'}
                      </p>
                    </div>
                    <button
                      onClick={() => setActiveTab('billing')}
                      className="mt-4 inline-flex items-center gap-1 text-xs text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 font-semibold group-hover:translate-x-0.5 transition-transform"
                    >
                      Manage subscription <ChevronRight className="h-3 w-3" />
                    </button>
                  </div>

                  {/* AI Credits circular gauge */}
                  <div className="bg-white dark:bg-[#0D0D12]/60 dark:backdrop-blur-xl border border-slate-200/80 dark:border-white/5 p-6 rounded-2xl shadow-sm flex items-center justify-between group hover:border-indigo-500/30 transition-all duration-300">
                    <div className="space-y-2">
                      <span className="text-[10px] bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 font-bold px-2 py-0.5 rounded uppercase tracking-wider">Tailoring Power</span>
                      <h4 className="text-sm font-medium text-slate-500 dark:text-slate-400 mt-2">AI Credits Remaining</h4>
                      <h3 className="text-2xl font-bold mt-1 text-slate-900 dark:text-white">{profile?.cv_credits || 0} / 100</h3>
                      <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">Refreshes monthly</p>
                    </div>
                    
                    {/* SVG dial meter */}
                    <div className="relative w-20 h-20">
                      <svg className="w-full h-full transform -rotate-90">
                        {/* Underlay track */}
                        <circle
                          cx="40"
                          cy="40"
                          r={strokeRadius}
                          className="text-slate-100 dark:text-white/5 stroke-current"
                          strokeWidth="6"
                          fill="transparent"
                        />
                        {/* Overlay track */}
                        <circle
                          cx="40"
                          cy="40"
                          r={strokeRadius}
                          className="text-emerald-500 stroke-current transition-all duration-1000 ease-out"
                          strokeWidth="6"
                          strokeDasharray={strokeCircumference}
                          strokeDashoffset={strokeDashoffset}
                          strokeLinecap="round"
                          fill="transparent"
                        />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center text-xs font-extrabold text-slate-700 dark:text-slate-300">
                        {Math.round(creditPercent)}%
                      </div>
                    </div>
                  </div>

                  {/* Resumes created */}
                  <div className="bg-white dark:bg-[#0D0D12]/60 dark:backdrop-blur-xl border border-slate-200/80 dark:border-white/5 p-6 rounded-2xl shadow-sm flex flex-col justify-between group hover:border-indigo-500/30 transition-all duration-300">
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-500/10 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                        <FileText className="h-5 w-5" />
                      </div>
                      <span className="text-[10px] bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-slate-300 font-bold px-2 py-0.5 rounded uppercase tracking-wider">Documents</span>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-slate-500 dark:text-slate-400">Resumes Created</h4>
                      <h3 className="text-2xl font-bold mt-1 text-slate-900 dark:text-white">{myCVs.length} Document{myCVs.length !== 1 ? 's' : ''}</h3>
                      <p className="text-xs text-slate-400 dark:text-slate-500 mt-2">Create tailored, job-specific ATS profiles in seconds.</p>
                    </div>
                    <button
                      onClick={() => setActiveTab('resumes')}
                      className="mt-4 inline-flex items-center gap-1 text-xs text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 font-semibold group-hover:translate-x-0.5 transition-transform"
                    >
                      View all resumes <ChevronRight className="h-3 w-3" />
                    </button>
                  </div>
                </div>

                {/* Master Resume Upload & Info Panel */}
                <div className="bg-white dark:bg-[#0D0D12]/60 dark:backdrop-blur-xl border border-slate-200/80 dark:border-white/5 p-6 sm:p-8 rounded-2xl shadow-sm">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                    <div>
                      <h3 className="text-lg font-bold flex items-center gap-2">
                        <Database className="h-5 w-5 text-indigo-500" />
                        Master Resume Profile
                      </h3>
                      <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                        Upload your general master CV. Our advanced AI parser decodes text elements, automatically mapping them to dynamic variables during auto-fills.
                      </p>
                    </div>
                    
                    {uploadedCVUrl && (
                      <a
                        href={uploadedCVUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 transition-colors"
                      >
                        <ExternalLink className="h-3.5 w-3.5" />
                        View File
                      </a>
                    )}
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                    
                    {/* Upload Dotted Area */}
                    <div className="space-y-4">
                      <label className={`block border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all ${
                        uploadingCV 
                          ? 'border-indigo-400 bg-indigo-50/50 dark:bg-indigo-500/5' 
                          : 'border-slate-200 hover:border-indigo-400 dark:border-white/10 dark:hover:border-indigo-500/30 hover:bg-slate-50 dark:hover:bg-white/5'
                      }`}>
                        <input
                          type="file"
                          accept=".pdf,.docx"
                          className="hidden"
                          onChange={handleCVUpload}
                          disabled={uploadingCV}
                        />
                        {uploadingCV ? (
                          <div className="flex flex-col items-center py-4">
                            <Loader2 className="animate-spin h-10 w-10 text-indigo-600 dark:text-indigo-400 mb-3" />
                            <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">Analyzing & parsing variables...</span>
                            <span className="text-xs text-slate-400 mt-1">This takes only a few seconds</span>
                          </div>
                        ) : (
                          <div className="flex flex-col items-center py-4">
                            <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-white/5 flex items-center justify-center mb-3">
                              <Upload className="h-6 w-6 text-slate-500 dark:text-slate-400" />
                            </div>
                            <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">Click to upload Master Resume</span>
                            <span className="text-xs text-slate-400 dark:text-slate-500 mt-1">PDF or Word files up to 10MB</span>
                          </div>
                        )}
                      </label>

                      {uploadMessage && (
                        <div className={`p-4 rounded-xl flex items-start gap-3 border text-sm ${
                          uploadMessage.type === 'success' 
                            ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-600 dark:text-emerald-400' 
                            : 'bg-rose-500/10 border-rose-500/20 text-rose-600 dark:text-rose-400'
                        }`}>
                          {uploadMessage.type === 'success' ? <CheckCircle className="h-5 w-5 shrink-0" /> : <AlertCircle className="h-5 w-5 shrink-0" />}
                          <div>
                            <span className="font-semibold block">{uploadMessage.type === 'success' ? 'Upload successful!' : 'Error processing document'}</span>
                            <span className="text-xs opacity-90 mt-1 block">{uploadMessage.text}</span>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Parser Variable Output Grid */}
                    <div className="bg-slate-50 dark:bg-[#020205] border border-slate-200/80 dark:border-white/5 rounded-2xl p-6">
                      <h4 className="text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-4 flex items-center gap-1.5">
                        <Activity className="h-4 w-4 text-emerald-500" />
                        Extracted Variables
                      </h4>

                      {parsedCVData ? (
                        <div className="space-y-4">
                          <div className="flex items-center gap-2 px-3 py-2 bg-white dark:bg-slate-900 border border-slate-100 dark:border-white/5 rounded-xl shadow-xs">
                            <Briefcase className="h-5 w-5 text-indigo-500" />
                            <div className="min-w-0">
                              <span className="text-xs text-slate-400 block font-medium">Work History</span>
                              <span className="text-sm font-bold text-slate-800 dark:text-slate-100">{parsedCVData.experience?.length || 0} Experience items parsed</span>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 px-3 py-2 bg-white dark:bg-slate-900 border border-slate-100 dark:border-white/5 rounded-xl shadow-xs">
                            <GraduationCap className="h-5 w-5 text-indigo-500" />
                            <div className="min-w-0">
                              <span className="text-xs text-slate-400 block font-medium">Academic Credentials</span>
                              <span className="text-sm font-bold text-slate-800 dark:text-slate-100">{parsedCVData.education?.length || 0} Education items parsed</span>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 px-3 py-2 bg-white dark:bg-slate-900 border border-slate-100 dark:border-white/5 rounded-xl shadow-xs">
                            <FileText className="h-5 w-5 text-indigo-500" />
                            <div className="min-w-0">
                              <span className="text-xs text-slate-400 block font-medium">Core Skills & Competencies</span>
                              <span className="text-sm font-bold text-slate-800 dark:text-slate-100">{parsedCVData.skills?.length || 0} Professional tags identified</span>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center justify-center py-10 text-center">
                          <Database className="h-10 w-10 text-slate-300 dark:text-slate-700 mb-3" />
                          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">No master CV uploaded yet</p>
                          <p className="text-xs text-slate-400 dark:text-slate-500 mt-1 max-w-[280px]">Upload your general resume to preview structural parsing analysis.</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* VIEW 2: MY RESUMES */}
            {activeTab === 'resumes' && (
              <div className="space-y-6 animate-fade-in">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h2 className="text-xl font-extrabold tracking-tight">Document Vault</h2>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Manage and access all your generated resumes below.</p>
                  </div>
                  <Link
                    to="/portfolio"
                    className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-semibold shadow-md shadow-indigo-500/10 hover:shadow-lg transition-all"
                  >
                    <Plus className="h-4 w-4" />
                    New Resume
                  </Link>
                </div>

                {loadingCVs ? (
                  <div className="flex justify-center items-center py-20">
                    <Loader2 className="animate-spin h-8 w-8 text-indigo-600 dark:text-indigo-400" />
                  </div>
                ) : myCVs.length === 0 ? (
                  <div className="bg-white dark:bg-[#0D0D12]/60 dark:backdrop-blur-xl border border-slate-200/80 dark:border-white/5 rounded-2xl p-12 text-center">
                    <FileText className="h-16 w-16 text-slate-300 dark:text-slate-700 mx-auto mb-4" />
                    <h3 className="text-lg font-bold">No resumes generated yet</h3>
                    <p className="text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto text-sm">
                      Kickstart your job search by picking a professionally validated template tailored for ATS tracking systems.
                    </p>
                    <Link
                      to="/portfolio"
                      className="mt-6 inline-flex items-center gap-1.5 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-semibold transition-all shadow-md"
                    >
                      <Plus className="h-4.5 w-4.5" />
                      Create Your First Resume
                    </Link>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {myCVs.map((cv) => (
                      <div
                        key={cv.id}
                        className="bg-white dark:bg-[#0D0D12]/60 dark:backdrop-blur-xl border border-slate-200/80 dark:border-white/5 rounded-2xl overflow-hidden hover:-translate-y-1 hover:shadow-xl dark:hover:shadow-[0_8px_30px_rgba(255,255,255,0.02)] transition-all duration-300 flex flex-col group relative"
                      >
                        {/* Dynamic top colour accent based on ats_score */}
                        <div className={`h-1.5 bg-gradient-to-r ${
                          (cv.ats_score || 0) >= 80 ? 'from-emerald-500 to-teal-500' :
                          (cv.ats_score || 0) >= 60 ? 'from-amber-500 to-orange-500' :
                          'from-indigo-500 to-purple-600'
                        }`} />
                        
                        <div className="p-5 flex-1 flex flex-col justify-between">
                          <div>
                            <div className="flex items-start justify-between gap-2 mb-3">
                              <div className="min-w-0">
                                <h4 className="text-sm font-bold text-slate-900 dark:text-white truncate">
                                  {cv.personal_info?.full_name || 'Untitled Resume'}
                                </h4>
                                <p className="text-xs text-slate-400 dark:text-slate-500 flex items-center gap-1 mt-0.5 font-medium truncate capitalize">
                                  <Briefcase className="h-3 w-3" />
                                  {cv.target_role || cv.template || 'General profile'}
                                </p>
                              </div>

                              {cv.ats_score && (
                                <span className={`flex-shrink-0 text-xs px-2.5 py-0.5 rounded-full font-bold border ${
                                  cv.ats_score >= 80 ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20' :
                                  cv.ats_score >= 60 ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20' :
                                  'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20'
                                }`}>
                                  ATS {cv.ats_score}%
                                </span>
                              )}
                            </div>

                            <p className="text-xs text-slate-400 dark:text-slate-500 flex items-center gap-1.5 mb-5 font-semibold">
                              <Clock className="h-3.5 w-3.5" />
                              Updated {formatDate(cv.updated_at || cv.created_at)}
                            </p>
                          </div>

                          <div className="flex gap-2">
                            <button
                              onClick={() => navigate(`/cv/edit/${cv.id}`)}
                              className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors"
                            >
                              <Eye className="h-3.5 w-3.5" />
                              Edit Workspace
                            </button>
                            
                            <button
                              onClick={() => handleDownloadPDF(cv)}
                              disabled={downloadingCvId === cv.id}
                              className="px-3 py-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-300 dark:hover:text-white dark:hover:bg-white/5 rounded-xl border border-slate-200 dark:border-white/5 transition-all disabled:opacity-50 shrink-0"
                              title="Download PDF"
                            >
                              {downloadingCvId === cv.id ? (
                                <Loader2 className="h-4 w-4 animate-spin text-slate-400" />
                              ) : (
                                <Download className="h-4 w-4" />
                              )}
                            </button>

                            <button
                              onClick={() => setDeleteConfirmId(cv.id)}
                              className="px-3 py-2 text-rose-500 hover:bg-rose-500/10 rounded-xl border border-rose-500/10 transition-colors shrink-0"
                              title="Delete Resume"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* VIEW 3: SETTINGS & SECURITY */}
            {activeTab === 'settings' && (
              <div className="space-y-8 animate-fade-in">
                
                {/* Profile Details Edit Card */}
                <div className="bg-white dark:bg-[#0D0D12]/60 dark:backdrop-blur-xl border border-slate-200/80 dark:border-white/5 p-6 sm:p-8 rounded-2xl shadow-sm">
                  <h3 className="text-lg font-bold flex items-center gap-2 mb-2">
                    <User className="h-5 w-5 text-indigo-500" />
                    Personal Information
                  </h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
                    Update your public handle details, avatar metrics, and professional contact links.
                  </p>

                  <form onSubmit={handleUpdate} className="space-y-5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Display Name</label>
                        <input
                          type="text"
                          value={displayName}
                          onChange={(e) => setDisplayName(e.target.value)}
                          className="w-full bg-slate-50/50 dark:bg-[#020205] border border-slate-200 dark:border-white/5 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:bg-black focus:bg-white text-slate-900 dark:text-white"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Username Handle</label>
                        <input
                          type="text"
                          value={username}
                          onChange={(e) => setUsername(e.target.value)}
                          className="w-full bg-slate-50/50 dark:bg-[#020205] border border-slate-200 dark:border-white/5 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:bg-black focus:bg-white text-slate-900 dark:text-white"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">LinkedIn Profile</label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                            <Linkedin className="h-4 w-4" />
                          </div>
                          <input
                            type="url"
                            value={linkedinUrl}
                            onChange={(e) => setLinkedinUrl(e.target.value)}
                            placeholder="https://linkedin.com/in/username"
                            className="w-full bg-slate-50/50 dark:bg-[#020205] border border-slate-200 dark:border-white/5 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:bg-black focus:bg-white text-slate-900 dark:text-white"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Phone Number</label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                            <Phone className="h-4 w-4" />
                          </div>
                          <input
                            type="tel"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            className="w-full bg-slate-50/50 dark:bg-[#020205] border border-slate-200 dark:border-white/5 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:bg-black focus:bg-white text-slate-900 dark:text-white"
                          />
                        </div>
                      </div>

                      <div className="sm:col-span-2">
                        <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Street Address</label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                            <MapPin className="h-4 w-4" />
                          </div>
                          <input
                            type="text"
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            className="w-full bg-slate-50/50 dark:bg-[#020205] border border-slate-200 dark:border-white/5 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:bg-black focus:bg-white text-slate-900 dark:text-white"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-end pt-3">
                      <button
                        type="submit"
                        disabled={updating}
                        className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white text-sm font-semibold rounded-xl shadow-md transition-all shrink-0"
                      >
                        {updating ? (
                          <>
                            <Loader2 className="h-4 w-4 animate-spin" />
                            Updating...
                          </>
                        ) : (
                          <>
                            <Check className="h-4 w-4" />
                            Save Profile
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                </div>

                {/* Account Security Change Password Card */}
                <div className="bg-white dark:bg-[#0D0D12]/60 dark:backdrop-blur-xl border border-slate-200/80 dark:border-white/5 p-6 sm:p-8 rounded-2xl shadow-sm">
                  <h3 className="text-lg font-bold flex items-center gap-2 mb-2">
                    <Shield className="h-5 w-5 text-indigo-500" />
                    Account Security
                  </h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
                    Ensure your account stays protected by choosing a strong password.
                  </p>

                  <form onSubmit={handleUpdatePassword} className="space-y-4 max-w-xl">
                    <div>
                      <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">New Password</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                          <Lock className="h-4 w-4" />
                        </div>
                        <input
                          type="password"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          placeholder="Min. 6 characters"
                          className="w-full bg-slate-50/50 dark:bg-[#020205] border border-slate-200 dark:border-white/5 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:bg-black focus:bg-white text-slate-900 dark:text-white"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Confirm Password</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                          <Key className="h-4 w-4" />
                        </div>
                        <input
                          type="password"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          placeholder="Repeat new password"
                          className="w-full bg-slate-50/50 dark:bg-[#020205] border border-slate-200 dark:border-white/5 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:bg-black focus:bg-white text-slate-900 dark:text-white"
                          required
                        />
                      </div>
                    </div>

                    {passwordMessage && (
                      <div className={`p-3.5 rounded-xl flex items-center gap-2 text-xs font-medium border ${
                        passwordMessage.type === 'success'
                          ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-600 dark:text-emerald-400'
                          : 'bg-rose-500/10 border-rose-500/20 text-rose-600 dark:text-rose-400'
                      }`}>
                        {passwordMessage.type === 'success' ? <CheckCircle className="h-4 w-4 shrink-0" /> : <AlertCircle className="h-4 w-4 shrink-0" />}
                        <span>{passwordMessage.text}</span>
                      </div>
                    )}

                    <div className="pt-2 flex justify-start">
                      <button
                        type="submit"
                        disabled={updatingPassword}
                        className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-slate-800 hover:bg-slate-900 dark:bg-white/5 dark:hover:bg-white/10 text-white rounded-xl text-sm font-semibold transition-all shadow-xs disabled:opacity-50"
                      >
                        {updatingPassword ? (
                          <>
                            <Loader2 className="h-4 w-4 animate-spin" />
                            Updating...
                          </>
                        ) : (
                          <>
                            <Shield className="h-4 w-4" />
                            Update Password
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                </div>

                {/* Preferences Toggles */}
                <div className="bg-white dark:bg-[#0D0D12]/60 dark:backdrop-blur-xl border border-slate-200/80 dark:border-white/5 p-6 sm:p-8 rounded-2xl shadow-sm">
                  <h3 className="text-lg font-bold flex items-center gap-2 mb-2">
                    <Bell className="h-5 w-5 text-indigo-500" />
                    Preferences & Alerts
                  </h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
                    Manage your communications, defaults, and auto-backups.
                  </p>

                  <div className="space-y-5">
                    
                    {/* Toggle 1 */}
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <h4 className="text-sm font-bold">Email Alerts & Activity</h4>
                        <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">Receive newsletters, structural tips, and product insights.</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setPrefEmailAlerts(!prefEmailAlerts)}
                        className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                          prefEmailAlerts ? 'bg-indigo-600' : 'bg-slate-200 dark:bg-white/10'
                        }`}
                      >
                        <span
                          className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                            prefEmailAlerts ? 'translate-x-5' : 'translate-x-0'
                          }`}
                        />
                      </button>
                    </div>

                    <hr className="border-slate-100 dark:border-white/5" />

                    {/* Toggle 2 */}
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <h4 className="text-sm font-bold">Product Updates & Features</h4>
                        <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">Subscribe to newsletter updates and releases.</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setPrefNewsletter(!prefNewsletter)}
                        className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                          prefNewsletter ? 'bg-indigo-600' : 'bg-slate-200 dark:bg-white/10'
                        }`}
                      >
                        <span
                          className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                            prefNewsletter ? 'translate-x-5' : 'translate-x-0'
                          }`}
                        />
                      </button>
                    </div>

                    <hr className="border-slate-100 dark:border-white/5" />

                    {/* Toggle 3 */}
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <h4 className="text-sm font-bold">Auto-Backup Data</h4>
                        <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">Keep continuous copies of your tailored resumes cached locally.</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setPrefAutoBackup(!prefAutoBackup)}
                        className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                          prefAutoBackup ? 'bg-indigo-600' : 'bg-slate-200 dark:bg-white/10'
                        }`}
                      >
                        <span
                          className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                            prefAutoBackup ? 'translate-x-5' : 'translate-x-0'
                          }`}
                        />
                      </button>
                    </div>

                  </div>
                </div>

                {/* Danger Zone */}
                <div className="bg-red-500/5 dark:bg-rose-950/10 border border-rose-500/20 p-6 sm:p-8 rounded-2xl shadow-sm">
                  <h3 className="text-lg font-bold text-rose-600 dark:text-rose-400 flex items-center gap-2 mb-2">
                    <AlertCircle className="h-5 w-5" />
                    Danger Zone
                  </h3>
                  <p className="text-sm text-rose-700/80 dark:text-rose-400/70 mb-6">
                    Irreversible actions that wipe data or terminate access permanently.
                  </p>

                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 bg-white dark:bg-slate-950 border border-rose-500/20 rounded-xl">
                    <div>
                      <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200">Reset Data & Clear Resumes</h4>
                      <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">Wipe all drafted cv pages, master profiles, and files cached.</p>
                    </div>
                    <button
                      onClick={() => setShowResetConfirm(true)}
                      className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold shadow-sm transition-colors"
                    >
                      Clear Data Profile
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* VIEW 4: BILLING & PRICING */}
            {activeTab === 'billing' && (
              <div className="space-y-8 animate-fade-in">
                
                <div>
                  <h2 className="text-xl font-extrabold tracking-tight">Billing & subscription</h2>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Upgrade your features, credits, and review invoicing details below.</p>
                </div>

                {/* Pricing comparison cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl">
                  
                  {/* Free tier card */}
                  <div className="bg-white dark:bg-[#0D0D12]/60 dark:backdrop-blur-xl border border-slate-200/80 dark:border-white/5 rounded-2xl p-6 relative flex flex-col justify-between hover:border-slate-300 dark:hover:border-white/10 transition-all shadow-sm">
                    {profile?.subscription_status !== 'pro' && (
                      <div className="absolute top-4 right-4 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-[10px] font-extrabold px-2 py-0.5 rounded border border-indigo-500/20 uppercase tracking-wide">
                        Active Tier
                      </div>
                    )}
                    <div>
                      <span className="text-[10px] bg-slate-100 dark:bg-white/10 text-slate-500 dark:text-slate-400 font-extrabold px-2.5 py-1 rounded-md uppercase tracking-wider">Free Essentials</span>
                      <h3 className="text-3xl font-extrabold text-slate-900 dark:text-white mt-4">$0</h3>
                      <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">Free forever, standard support</p>
                      
                      <ul className="mt-6 space-y-3">
                        <li className="flex items-center gap-2 text-xs">
                          <Check className="h-4.5 w-4.5 text-emerald-500 shrink-0" />
                          <span>Generate up to 5 resume versions</span>
                        </li>
                        <li className="flex items-center gap-2 text-xs">
                          <Check className="h-4.5 w-4.5 text-emerald-500 shrink-0" />
                          <span>Standard LaTeX-ATS builder</span>
                        </li>
                        <li className="flex items-center gap-2 text-xs text-slate-400 line-through">
                          <X className="h-4.5 w-4.5 shrink-0" />
                          <span>Unlimited AI document tailoring</span>
                        </li>
                        <li className="flex items-center gap-2 text-xs text-slate-400 line-through">
                          <X className="h-4.5 w-4.5 shrink-0" />
                          <span>100 AI credits refreshes</span>
                        </li>
                      </ul>
                    </div>

                    <button
                      onClick={() => handleMockUpgrade('free')}
                      disabled={profile?.subscription_status !== 'pro'}
                      className="mt-8 w-full py-2.5 border border-slate-200 dark:border-white/5 rounded-xl text-xs font-bold text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-white/5 transition-colors disabled:opacity-40"
                    >
                      {profile?.subscription_status !== 'pro' ? 'Already Active' : 'Switch to Free'}
                    </button>
                  </div>

                  {/* Pro tier card */}
                  <div className="bg-gradient-to-br from-indigo-950/20 via-indigo-950/10 to-slate-900/50 dark:bg-none dark:bg-[#0D0D12]/60 dark:backdrop-blur-xl border-2 border-indigo-600 dark:border-indigo-500 rounded-2xl p-6 relative flex flex-col justify-between transition-all shadow-md shadow-indigo-600/10">
                    {profile?.subscription_status === 'pro' && (
                      <div className="absolute top-4 right-4 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px] font-extrabold px-2 py-0.5 rounded border border-emerald-500/20 uppercase tracking-wide">
                        Active Tier
                      </div>
                    )}
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] bg-indigo-600 text-white font-extrabold px-2.5 py-1 rounded-md uppercase tracking-wider flex items-center gap-1 shadow-sm">
                          <Sparkles className="h-3.5 w-3.5 fill-white" />
                          Pro Workspace
                        </span>
                        <span className="text-xs text-indigo-500 font-extrabold">Popular</span>
                      </div>
                      
                      <h3 className="text-3xl font-extrabold text-slate-900 dark:text-white mt-4">$15 <span className="text-sm font-medium text-slate-400">/ mo</span></h3>
                      <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">Full professional features</p>
                      
                      <ul className="mt-6 space-y-3">
                        <li className="flex items-center gap-2 text-xs">
                          <Check className="h-4.5 w-4.5 text-emerald-500 shrink-0" />
                          <span className="font-semibold text-slate-800 dark:text-slate-200">Unlimited resume generation</span>
                        </li>
                        <li className="flex items-center gap-2 text-xs">
                          <Check className="h-4.5 w-4.5 text-emerald-500 shrink-0" />
                          <span>LaTeX ATS engine premium compilation</span>
                        </li>
                        <li className="flex items-center gap-2 text-xs">
                          <Check className="h-4.5 w-4.5 text-emerald-500 shrink-0" />
                          <span className="font-semibold text-slate-800 dark:text-slate-200">100 monthly AI credits</span>
                        </li>
                        <li className="flex items-center gap-2 text-xs">
                          <Check className="h-4.5 w-4.5 text-emerald-500 shrink-0" />
                          <span>Priority support channels</span>
                        </li>
                      </ul>
                    </div>

                    <button
                      onClick={() => handleMockUpgrade('pro')}
                      disabled={profile?.subscription_status === 'pro' || updating}
                      className={`mt-8 w-full py-2.5 rounded-xl text-xs font-bold transition-all shadow-md ${
                        profile?.subscription_status === 'pro'
                          ? 'border border-indigo-500/20 text-indigo-400 bg-indigo-500/5 cursor-default'
                          : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-500/10 hover:shadow-lg'
                      }`}
                    >
                      {updating ? 'Processing...' : profile?.subscription_status === 'pro' ? 'Already Active' : 'Upgrade to Pro'}
                    </button>
                  </div>
                </div>

                {/* Billing invoice logs table */}
                <div className="bg-white dark:bg-[#0D0D12]/60 dark:backdrop-blur-xl border border-slate-200/80 dark:border-white/5 rounded-2xl p-6 shadow-sm">
                  <h3 className="text-base font-bold mb-4">Invoicing History</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="border-b border-slate-100 dark:border-white/5 text-slate-400 font-bold uppercase tracking-wider">
                          <th className="pb-3 font-semibold">Invoice ID</th>
                          <th className="pb-3 font-semibold">Date</th>
                          <th className="pb-3 font-semibold">Tier</th>
                          <th className="pb-3 font-semibold">Amount</th>
                          <th className="pb-3 font-semibold">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                        <tr className="text-slate-600 dark:text-slate-300">
                          <td className="py-3 font-mono">INV-92849-01</td>
                          <td className="py-3">Jun 01, 2026</td>
                          <td className="py-3 capitalize">{profile?.subscription_status || 'Free'} Plan</td>
                          <td className="py-3 font-bold">{profile?.subscription_status === 'pro' ? '$15.00' : '$0.00'}</td>
                          <td className="py-3">
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 uppercase tracking-wide">
                              Paid
                            </span>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Delete Resume Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setDeleteConfirmId(null)} />
          <div className="relative bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-2xl shadow-2xl w-full max-w-sm p-6 transform transition-all animate-scale-up text-slate-900 dark:text-white">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-rose-100 dark:bg-rose-500/10 rounded-xl flex items-center justify-center flex-shrink-0">
                <Trash2 className="h-6 w-6 text-rose-600 dark:text-rose-450" />
              </div>
              <div>
                <h3 className="text-lg font-bold">Delete Resume?</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">This action is permanent and cannot be undone.</p>
              </div>
            </div>
            <div className="flex gap-3 mt-4">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="flex-1 px-4 py-2.5 border border-slate-200 dark:border-white/5 rounded-xl text-slate-700 dark:text-slate-300 text-sm font-semibold hover:bg-slate-50 dark:hover:bg-white/5 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteCV(deleteConfirmId)}
                className="flex-1 px-4 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-sm font-semibold transition-all shadow-sm shadow-rose-600/10"
              >
                Delete File
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reset Data Confirmation Modal */}
      {showResetConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowResetConfirm(false)} />
          <div className="relative bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-2xl shadow-2xl w-full max-w-md p-6 transform transition-all animate-scale-up text-slate-900 dark:text-white">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-rose-100 dark:bg-rose-500/10 rounded-xl flex items-center justify-center flex-shrink-0">
                <AlertCircle className="h-6 w-6 text-rose-600 dark:text-rose-450" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-rose-600 dark:text-rose-400">Clear Data Profile?</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">This will hard-delete ALL of your created resumes and clear your Master Resume variables. Proceed with caution.</p>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowResetConfirm(false)}
                className="flex-1 px-4 py-2.5 border border-slate-200 dark:border-white/5 rounded-xl text-slate-700 dark:text-slate-300 text-sm font-semibold hover:bg-slate-50 dark:hover:bg-white/5 transition-all"
              >
                Keep My Data
              </button>
              <button
                onClick={handleWipeData}
                disabled={isResettingData}
                className="flex-1 px-4 py-2.5 bg-rose-600 hover:bg-rose-700 disabled:opacity-50 text-white rounded-xl text-sm font-semibold transition-all shadow-sm"
              >
                {isResettingData ? 'Wiping Profile...' : 'Wipe Data Profile'}
              </button>
            </div>
          </div>
        </div>
      )}

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