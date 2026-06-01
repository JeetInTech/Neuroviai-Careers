import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Home, Menu, X, User, Sparkles, FileText, LogIn, LogOut, UserPlus, Layout, Target, Sun, Moon } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const isHomePage = location.pathname === '/';

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0);
    setIsOpen(false);
  }, [location.pathname]);

  // Track scroll for subtle background transition
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
    setIsOpen(false);
  };

  const isActive = (path: string) => location.pathname === path;

  // Responsive dynamic navbar styling
  const navBg = isHomePage
    ? scrolled
      ? 'bg-[#0A0A0F]/95 backdrop-blur-xl shadow-lg shadow-black/10 border-b border-white/5'
      : 'bg-[#0A0A0F]/60 backdrop-blur-md'
    : theme === 'dark'
      ? scrolled
        ? 'bg-[#0A0A0F]/95 backdrop-blur-xl shadow-lg shadow-black/10 border-b border-white/5'
        : 'bg-[#0A0A0F]'
      : scrolled
        ? 'bg-white/95 backdrop-blur-xl shadow-sm border-b border-gray-200/80'
        : 'bg-white border-b border-gray-100';

  const NavLink = ({ to, icon: Icon, children }: { to: string; icon: React.ElementType; children: React.ReactNode }) => {
    const activeClass = isHomePage || theme === 'dark'
      ? 'bg-white/10 text-white'
      : 'bg-gray-100 text-gray-900';
    const inactiveClass = isHomePage || theme === 'dark'
      ? 'text-white/60 hover:text-white hover:bg-white/5'
      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50';

    return (
      <Link
        to={to}
        className={`flex items-center px-4 py-2 text-sm font-medium rounded-md transition-colors ${
          isActive(to) ? activeClass : inactiveClass
        }`}
        onClick={() => setIsOpen(false)}
      >
        <Icon className="mr-2 h-4 w-4" />
        {children}
      </Link>
    );
  };

  return (
    <nav className={`sticky top-0 z-50 transition-all duration-300 ${navBg}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo & Desktop Navigation */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <img src="/logo.png" alt="Neurovia Career" className="h-8 w-8" />
              <span className={`text-xl font-bold transition-colors duration-300 ${isHomePage || theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                Neurovia Career
              </span>
            </Link>
            <div className="hidden sm:ml-8 sm:flex sm:space-x-1">
              <NavLink to="/" icon={Home}>Home</NavLink>
              <NavLink to="/ats-resume" icon={FileText}>ATS Resume</NavLink>
              <NavLink to="/tailor-resume" icon={Target}>Tailor Resume</NavLink>
              <NavLink to="/templates" icon={Layout}>Templates</NavLink>
            </div>
          </div>

          {/* User Menu (Desktop) */}
          <div className="hidden sm:flex sm:items-center sm:space-x-2">
            {!isHomePage && (
              <button
                onClick={toggleTheme}
                className={`p-2 mr-1 rounded-lg transition-all duration-300 flex items-center justify-center border ${
                  theme === 'dark'
                    ? 'bg-white/5 border-white/10 text-yellow-400 hover:bg-white/10 hover:border-white/20'
                    : 'bg-gray-100 border-gray-200 text-indigo-600 hover:bg-gray-200 hover:border-gray-300'
                }`}
                aria-label="Toggle Theme"
              >
                {theme === 'dark' ? (
                  <Sun className="h-4 w-4 animate-pulse-subtle" />
                ) : (
                  <Moon className="h-4 w-4" />
                )}
              </button>
            )}

            {user ? (
              <>
                <NavLink to="/profile" icon={User}>Profile</NavLink>
                <button
                  onClick={handleSignOut}
                  className={`flex items-center px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                    isHomePage || theme === 'dark'
                      ? 'text-white/60 hover:text-white hover:bg-white/5'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
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
                  className="flex items-center px-4 py-2 text-sm font-medium rounded-md bg-indigo-600 text-white hover:bg-indigo-500 transition-colors"
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
            {!isHomePage && (
              <button
                onClick={toggleTheme}
                className={`p-2 mr-2 rounded-lg transition-all duration-300 flex items-center justify-center border ${
                  theme === 'dark'
                    ? 'bg-white/5 border-white/10 text-yellow-400'
                    : 'bg-gray-100 border-gray-200 text-indigo-600'
                }`}
                aria-label="Toggle Theme"
              >
                {theme === 'dark' ? <Sun className="h-4.5 w-4.5" /> : <Moon className="h-4.5 w-4.5" />}
              </button>
            )}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className={`inline-flex items-center justify-center p-2 rounded-md transition-colors ${
                isHomePage || theme === 'dark'
                  ? 'text-white/60 hover:text-white hover:bg-white/10'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
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
      <div className={`${isOpen ? 'block' : 'hidden'} sm:hidden border-t ${
        isHomePage || theme === 'dark'
          ? 'border-white/5 bg-[#0A0A0F]/95'
          : 'border-gray-200/80 bg-white/95'
      } backdrop-blur-xl`}>
        <div className="pt-2 pb-3 space-y-1 px-2">
          <NavLink to="/" icon={Home}>Home</NavLink>
          <NavLink to="/ats-resume" icon={FileText}>ATS Resume</NavLink>
          <NavLink to="/tailor-resume" icon={Target}>Tailor Resume</NavLink>
          <NavLink to="/templates" icon={Layout}>Templates</NavLink>
          {user ? (
            <>
              <NavLink to="/profile" icon={User}>Profile</NavLink>
              <button
                onClick={handleSignOut}
                className={`flex w-full items-center px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                  isHomePage || theme === 'dark'
                    ? 'text-white/60 hover:text-white hover:bg-white/5'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
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