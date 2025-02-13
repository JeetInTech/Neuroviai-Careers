import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Home, Menu, X, Users, Briefcase, User } from 'lucide-react';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useAuth();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  const NavLink = ({ to, icon: Icon, children }: { to: string; icon: React.ElementType; children: React.ReactNode }) => (
    <Link
      to={to}
      className={`flex items-center px-4 py-2 text-sm font-medium rounded-md ${
        isActive(to)
          ? 'bg-indigo-100 text-indigo-700'
          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
      }`}
      onClick={() => setIsOpen(false)}
    >
      <Icon className="mr-3 h-5 w-5" />
      {children}
    </Link>
  );

  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Desktop Navigation */}
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Briefcase className="h-8 w-8 text-indigo-600" />
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-4">
              <NavLink to="/" icon={Home}>Home</NavLink>
              <NavLink to="/creators" icon={Users}>Creators</NavLink>
              {user && <NavLink to="/portfolio" icon={Briefcase}>My Portfolio</NavLink>}
            </div>
          </div>

          {/* User Menu (Desktop) */}
          <div className="hidden sm:ml-6 sm:flex sm:items-center">
            {user ? (
              <NavLink to="/profile" icon={User}>Profile</NavLink>
            ) : (
              <Link
                to="/login"
                className="flex items-center px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
              >
                Sign In
              </Link>
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
      <div className={`${isOpen ? 'block' : 'hidden'} sm:hidden`}>
        <div className="pt-2 pb-3 space-y-1">
          <NavLink to="/" icon={Home}>Home</NavLink>
          <NavLink to="/creators" icon={Users}>Creators</NavLink>
          {user && <NavLink to="/portfolio" icon={Briefcase}>My Portfolio</NavLink>}
          {user ? (
            <NavLink to="/profile" icon={User}>Profile</NavLink>
          ) : (
            <Link
              to="/login"
              className="flex items-center mx-4 px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
              onClick={() => setIsOpen(false)}
            >
              Sign In
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}