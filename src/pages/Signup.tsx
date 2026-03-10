import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { UserPlus, Mail, Lock, ArrowLeft, User, UserCircle, Eye, EyeOff, Copy, Check, X, CheckCircle } from 'lucide-react';
import api from '../lib/api';

export default function Signup() {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [usernameAvailable, setUsernameAvailable] = useState(true);
  const [passwordStrength, setPasswordStrength] = useState<'weak' | 'medium' | 'strong' | ''>('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const copyPassword = () => {
    navigator.clipboard.writeText(password);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  const { signUp } = useAuth();
  const navigate = useNavigate();

  const checkPasswordStrength = (pass: string) => {
    const hasUpperCase = /[A-Z]/.test(pass);
    const hasLowerCase = /[a-z]/.test(pass);
    const hasNumbers = /\d/.test(pass);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(pass);
    const isLongEnough = pass.length >= 5;

    if (!isLongEnough) return '';
    
    const strength = [hasUpperCase, hasLowerCase, hasNumbers, hasSpecialChar].filter(Boolean).length;
    
    if (strength === 4) return 'strong';
    if (strength >= 2) return 'medium';
    return 'weak';
  };

  const checkUsername = async (username: string) => {
    if (username.length < 3) return;
    
    try {
      const response = await api.get(`/auth/check-username/${encodeURIComponent(username)}`);
      setUsernameAvailable(response.data.available);
    } catch {
      // If endpoint doesn't exist, assume available
      setUsernameAvailable(true);
    }
  };

  useEffect(() => {
    const strength = checkPasswordStrength(password);
    setPasswordStrength(strength);
  }, [password]);

  useEffect(() => {
    const debounce = setTimeout(() => {
      if (username) checkUsername(username);
    }, 500);

    return () => clearTimeout(debounce);
  }, [username]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      return setError('Passwords do not match');
    }

    if (passwordStrength !== 'strong') {
      return setError('Password must meet strength requirements');
    }

    if (!usernameAvailable) {
      return setError('Username is already taken');
    }

    try {
      setError('');
      setLoading(true);

      // Create account via FastAPI backend (auto-confirms email)
      await signUp(email, password, username, displayName);

      // Show success modal
      setShowSuccessModal(true);
    } catch (error: any) {
      setError(error.message || 'Failed to create account');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-screen items-center justify-center p-4">
            {/* Backdrop */}
            <div 
              className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
              onClick={() => {}}
            />
            
            {/* Modal */}
            <div className="relative bg-white rounded-2xl shadow-xl max-w-md w-full p-8 transform transition-all">
              {/* Email Icon */}
              <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-indigo-100 mb-6">
                <Mail className="h-10 w-10 text-indigo-600" />
              </div>
              
              {/* Content */}
              <div className="text-center">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  Check Your Email!
                </h3>
                <p className="text-gray-600 mb-4">
                  We've sent a confirmation link to:
                </p>
                
                {/* Email Address */}
                <div className="bg-indigo-50 rounded-lg p-3 mb-4">
                  <span className="text-indigo-700 font-semibold">{email}</span>
                </div>
                
                <p className="text-gray-500 text-sm mb-6">
                  Please click the link in the email to verify your account before signing in.
                  Don't forget to check your spam folder!
                </p>
                
                {/* Account Details */}
                <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left">
                  <p className="text-xs text-gray-500 uppercase font-semibold mb-2">Your Account Details</p>
                  <div className="flex items-center mb-2">
                    <User className="h-4 w-4 text-gray-400 mr-2" />
                    <span className="text-sm text-gray-600">Username:</span>
                    <span className="text-sm font-medium text-gray-900 ml-2">@{username}</span>
                  </div>
                  <div className="flex items-center">
                    <UserCircle className="h-4 w-4 text-gray-400 mr-2" />
                    <span className="text-sm text-gray-600">Display Name:</span>
                    <span className="text-sm font-medium text-gray-900 ml-2">{displayName || username}</span>
                  </div>
                </div>
                
                {/* Action Button */}
                <button
                  onClick={() => navigate('/login')}
                  className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
                >
                  <CheckCircle className="h-5 w-5 mr-2" />
                  I've Confirmed My Email - Sign In
                </button>
                
                <p className="text-xs text-gray-400 mt-4">
                  Didn't receive the email? Check your spam folder or try signing up again.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="flex justify-center">
            <UserPlus className="w-12 h-12 text-indigo-600" />
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Create your account
          </h2>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
            <form className="space-y-6" onSubmit={handleSubmit}>
              {error && (
                <div className="bg-red-50 border border-red-400 text-red-700 px-4 py-3 rounded">
                  {error}
                </div>
              )}

              <div>
                <label htmlFor="display-name" className="block text-sm font-medium text-gray-700">
                  Display Name
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <UserCircle className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                  id="display-name"
                  type="text"
                  required
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="John Doe"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                Username
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="username"
                  type="text"
                  required
                  className={`block w-full pl-10 pr-3 py-2 border rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 ${
                    username && (usernameAvailable ? 'border-green-300' : 'border-red-300')
                  }`}
                  placeholder="johndoe"
                  value={username}
                  onChange={(e) => setUsername(e.target.value.toLowerCase())}
                />
              </div>
              {username && !usernameAvailable && (
                <p className="mt-1 text-sm text-red-600">Username is already taken</p>
              )}
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email address
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  type="email"
                  required
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  required
                  className="block w-full pl-10 pr-20 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center space-x-1">
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-gray-400 hover:text-gray-600 focus:outline-none"
                    title={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                  {password && (
                    <button
                      type="button"
                      onClick={copyPassword}
                      className="text-gray-400 hover:text-gray-600 focus:outline-none"
                      title="Copy password"
                    >
                      {copied ? <Check className="h-5 w-5 text-green-500" /> : <Copy className="h-5 w-5" />}
                    </button>
                  )}
                </div>
              </div>
              {passwordStrength && (
                <div className="mt-1 flex items-center">
                  <div className={`h-2 w-16 rounded ${
                    passwordStrength === 'strong' ? 'bg-green-500' :
                    passwordStrength === 'medium' ? 'bg-yellow-500' :
                    'bg-red-500'
                  }`} />
                  <span className="ml-2 text-sm text-gray-500 capitalize">{passwordStrength}</span>
                </div>
              )}
            </div>

            <div>
              <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700">
                Confirm Password
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="confirm-password"
                  type={showConfirmPassword ? "text" : "password"}
                  required
                  className="block w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="text-gray-400 hover:text-gray-600 focus:outline-none"
                    title={showConfirmPassword ? "Hide password" : "Show password"}
                  >
                    {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading || !usernameAvailable}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
              >
                {loading ? 'Creating account...' : 'Create account'}
              </button>
            </div>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Already have an account?</span>
              </div>
            </div>

            <div className="mt-6">
              <Link
                to="/login"
                className="w-full flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-indigo-600 bg-indigo-50 hover:bg-indigo-100"
              >
                <ArrowLeft className="mr-2 h-4 w-4" /> Sign in instead
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
    </>
  );
}