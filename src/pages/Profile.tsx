import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { Profile } from '../lib/database.types';
import { User, Camera, LogOut, Mail, Key, Phone, MapPin } from 'lucide-react';
import ImageCropper from '../components/ImageCropper';

export default function ProfilePage() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showPasswordReset, setShowPasswordReset] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetMessage, setResetMessage] = useState('');
  const [showCropper, setShowCropper] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    const getProfile = async () => {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (error) throw error;
        
        // Set profile data
        setProfile(data);
        
        // Check if avatar_url exists and is not null before setting it
        if (data.avatar_url) {
          // Get the public URL for the avatar
          const { data: { publicUrl } } = supabase.storage
            .from('avatars')
            .getPublicUrl(data.avatar_url.split('avatars/')[1]);
          
          setAvatarUrl(publicUrl);
        }
        
        setResetEmail(data.email);
      } catch (error) {
        console.error('Error loading profile:', error);
      } finally {
        setLoading(false);
      }
    };

    getProfile();
  }, [user, navigate]);

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

      // First, delete old avatar if exists
      if (profile?.avatar_url) {
        const oldPath = profile.avatar_url.split('/').pop();
        if (oldPath) {
          await supabase.storage
            .from('avatars')
            .remove([`${user!.id}/${oldPath}`]);
        }
      }

      // Upload new avatar
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, croppedBlob, {
          contentType: 'image/jpeg',
          upsert: true
        });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      // Update profile with new avatar URL
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ avatar_url: publicUrl })
        .eq('id', user!.id);

      if (updateError) throw updateError;

      setAvatarUrl(publicUrl);
      setShowCropper(false);
      setSelectedImage(null);
    } catch (error) {
      console.error('Error updating avatar:', error);
    } finally {
      setUpdating(false);
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) return;

    try {
      setUpdating(true);

      const { error } = await supabase
        .from('profiles')
        .update({
          ...profile,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user!.id);

      if (error) throw error;
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
    } finally {
      setUpdating(false);
    }
  };

  const handlePasswordReset = async () => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(resetEmail);
      if (error) throw error;
      setResetMessage('Password reset instructions sent to your email');
      setTimeout(() => {
        setShowPasswordReset(false);
        setResetMessage('');
      }, 3000);
    } catch (error) {
      console.error('Error resetting password:', error);
      setResetMessage('Failed to send reset instructions');
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-pink-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white shadow-lg rounded-2xl overflow-hidden">
          {/* Header Section */}
          <div className="px-6 py-4 bg-white flex justify-between items-center border-b">
            <h1 className="text-xl font-semibold text-gray-900">
              Welcome, {profile?.display_name?.split(' ')[0] || 'there'}
            </h1>
            <button
              onClick={handleSignOut}
              className="text-gray-600 hover:text-gray-800 flex items-center gap-2 text-sm"
            >
              <LogOut className="h-4 w-4" />
              Sign Out
            </button>
          </div>

          <div className="p-6">
            {/* Profile Header */}
            <div className="flex flex-col items-center mb-8">
              <div className="relative mb-4">
                <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-100 border-4 border-white shadow-lg">
                  {avatarUrl ? (
                    <img
                      src={avatarUrl}
                      alt="Profile"
                      className="w-full h-full object-cover"
                      onError={(e) => e.currentTarget.src = "default-avatar.png"}
                    />
                  ) : (
                    <User className="w-full h-full p-4 text-gray-300" />
                  )}
                </div>
                {isEditing && (
                  <label
                    htmlFor="avatar-upload"
                    className="absolute bottom-0 right-0 bg-blue-500 rounded-full p-2 cursor-pointer shadow-lg hover:bg-blue-600 transition-colors"
                  >
                    <Camera className="h-4 w-4 text-white" />
                    <input
                      id="avatar-upload"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleImageSelect}
                    />
                  </label>
                )}
              </div>
              <h2 className="text-2xl font-bold text-gray-900">{profile?.display_name}</h2>
              <p className="text-gray-500">@{profile?.username}</p>
              <button
                type="button"
                onClick={() => setIsEditing(!isEditing)}
                className="mt-4 px-4 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
              >
                {isEditing ? 'Cancel editing' : 'Edit profile'}
              </button>
            </div>

            {/* Form Section */}
            <form onSubmit={handleUpdate} className="space-y-6 max-w-2xl mx-auto">
              {isEditing ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="col-span-full md:col-span-1">
                    <label htmlFor="display_name" className="block text-sm font-medium text-gray-700">
                      Display Name
                    </label>
                    <input
                      type="text"
                      id="display_name"
                      value={profile?.display_name || ''}
                      onChange={(e) => setProfile(prev => prev ? {...prev, display_name: e.target.value} : null)}
                      className="mt-1 block w-full rounded-lg border-gray-200 shadow-sm focus:border-blue-500 focus:ring-blue-500 caret-blue-500 animate-pulse-caret"
                      placeholder="Enter your display name"
                    />
                  </div>
                  <div className="col-span-full md:col-span-1">
                    <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                      Username
                    </label>
                    <input
                      type="text"
                      id="username"
                      value={profile?.username || ''}
                      onChange={(e) => setProfile(prev => prev ? {...prev, username: e.target.value} : null)}
                      className="mt-1 block w-full rounded-lg border-gray-200 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                  <div className="col-span-full md:col-span-1">
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      value={profile?.phone || ''}
                      onChange={(e) => setProfile(prev => prev ? {...prev, phone: e.target.value} : null)}
                      className="mt-1 block w-full rounded-lg border-gray-200 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                  <div className="col-span-full md:col-span-1">
                    <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                      Address
                    </label>
                    <textarea
                      id="address"
                      rows={3}
                      value={profile?.address || ''}
                      onChange={(e) => setProfile(prev => prev ? {...prev, address: e.target.value} : null)}
                      className="mt-1 block w-full rounded-lg border-gray-200 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                </div>
              ) : (
                <div className="bg-gray-50 rounded-xl p-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Contact Information</h3>
                  <dl className="space-y-6">
                    <div className="flex items-center justify-between">
                      <dt className="flex items-center text-sm font-medium text-gray-500">
                        <Mail className="h-5 w-5 mr-2 text-gray-400" />
                        Email
                      </dt>
                      <dd className="text-sm text-gray-900">{profile?.email}</dd>
                    </div>
                    <div className="flex items-center justify-between">
                      <dt className="flex items-center text-sm font-medium text-gray-500">
                        <Phone className="h-5 w-5 mr-2 text-gray-400" />
                        Phone
                      </dt>
                      <dd className="text-sm text-gray-900">{profile?.phone || 'Not set'}</dd>
                    </div>
                    <div className="flex items-start justify-between">
                      <dt className="flex items-center text-sm font-medium text-gray-500">
                        <MapPin className="h-5 w-5 mr-2 text-gray-400" />
                        Address
                      </dt>
                      <dd className="text-sm text-gray-900 text-right max-w-[60%]">{profile?.address || 'Not set'}</dd>
                    </div>
                  </dl>
                </div>
              )}

              {isEditing && (
                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={updating}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                  >
                    {updating ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              )}
            </form>
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

<style jsx>{`
  @keyframes caretBlink {
    0%, 100% { opacity: 1; }
    50% { opacity: 0; }
  }
  
  input::placeholder {
    color: #9CA3AF;
  }
  
  input:focus::placeholder {
    color: transparent;
  }
  
  .animate-pulse-caret {
    caret-color: #3B82F6;
  }
`}</style>