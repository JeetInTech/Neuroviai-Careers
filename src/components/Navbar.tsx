import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Home, Menu, X, User, Sparkles, FileText, LogIn, LogOut, UserPlus } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
    setIsOpen(false);
  };

  const isActive = (path: string) => location.pathname === path;

  const NavLink = ({ to, icon: Icon, children }: { to: string; icon: React.ElementType; children: React.ReactNode }) => (
    <Link
      to={to}
      className={`flex items-center px-4 py-2 text-sm font-medium rounded-md transition-colors ${
        isActive(to)
          ? 'bg-indigo-100 text-indigo-700'
          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
      }`}
      onClick={() => setIsOpen(false)}
    >
      <Icon className="mr-2 h-4 w-4" />
      {children}
    </Link>
  );

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo & Desktop Navigation */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <img src="/logo.png" alt="Neurovia Career" className="h-8 w-8" />
              <span className="text-xl font-bold text-gray-900">Neurovia Career</span>
            </Link>
            <div className="hidden sm:ml-8 sm:flex sm:space-x-2">
              <NavLink to="/" icon={Home}>Home</NavLink>
              <NavLink to="/ats-resume" icon={FileText}>ATS Resume</NavLink>
              <NavLink to="/portfolio" icon={Sparkles}>AI Resumes</NavLink>
            </div>
          </div>

          {/* User Menu (Desktop) */}
          <div className="hidden sm:flex sm:items-center sm:space-x-2">
            {user ? (
              <>
                <NavLink to="/profile" icon={User}>Profile</NavLink>
                <button
                  onClick={handleSignOut}
                  className="flex items-center px-4 py-2 text-sm font-medium rounded-md text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </button>
              </>
            ) : (
              <>
                <NavLink to="/login" icon={LogIn}>Login</NavLink>
                <Link
                  to="/signup"
                  className="flex items-center px-4 py-2 text-sm font-medium rounded-md bg-indigo-600 text-white hover:bg-indigo-700 transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  <UserPlus className="mr-2 h-4 w-4" />
                  Sign Up
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center sm:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
            >
              {isOpen ? (
                <X className="block h-6 w-6" />
              ) : (
                <Menu className="block h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={`${isOpen ? 'block' : 'hidden'} sm:hidden border-t border-gray-100`}>
        <div className="pt-2 pb-3 space-y-1 px-2">
          <NavLink to="/" icon={Home}>Home</NavLink>
          <NavLink to="/ats-resume" icon={FileText}>ATS Resume</NavLink>
          <NavLink to="/portfolio" icon={Sparkles}>AI Resumes</NavLink>
          {user ? (
            <>
              <NavLink to="/profile" icon={User}>Profile</NavLink>
              <button
                onClick={handleSignOut}
                className="flex w-full items-center px-4 py-2 text-sm font-medium rounded-md text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors"
              >
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </button>
            </>
          ) : (
            <>
              <NavLink to="/login" icon={LogIn}>Login</NavLink>
              <NavLink to="/signup" icon={UserPlus}>Sign Up</NavLink>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}