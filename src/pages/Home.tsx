import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Briefcase, Users, ArrowRight, LogOut, Star, Rocket } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export default function Home() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const featuredPortfolios = [
    {
      id: 1,
      name: "Sangramjeet Ghosh",
      role: "Full Stack Developer",
      image: "/jeet.jpg",
      website: "https://sangramjeet.netlify.app/",
      description: "Passionate Full Stack Developer specializing in modern web technologies and innovative solutions",
    },
    {
      id: 2,
      name: "Sarah Johnson",
      role: "UX/UI Designer",
      image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb",
      website: "https://www.behance.net/sarahjohnson",
      description: "Award-winning designer with focus on user-centered experiences",
    },
    {
      id: 3,
      name: "David Chen",
      role: "Full Stack Developer",
      image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d",
      website: "https://github.com/davidchen",
      description: "Building scalable solutions with modern technologies",
    },
    {
      id: 4,
      name: "Emma Wilson",
      role: "Creative Director",
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330",
      website: "https://dribbble.com/emmawilson",
      description: "15+ years of creative direction and brand strategy",
    },
    {
      id: 5,
      name: "Alex Rivera",
      role: "Frontend Developer",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d",
      website: "https://github.com/alexrivera",
      description: "Crafting beautiful and performant user interfaces with React and Vue",
    },
    {
      id: 6,
      name: "Maya Patel",
      role: "Product Designer",
      image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2",
      website: "https://www.behance.net/mayapatel",
      description: "Creating intuitive digital products that solve real user problems",
    }
  ];

  const handleLogout = async () => {
    try {
      await signOut();
      navigate('/login');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <h1 className="mt-4 text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight lg:text-6xl animate-fade-in-down">
            Showcase Your Portfolio
          </h1>
          <p className="max-w-xl mt-5 mx-auto text-xl text-gray-500 animate-fade-in-up">
            Create your professional portfolio and share it with the world. Connect with other creators and showcase your work.
          </p>
          
          {/* Enhanced CTA Section */}
          <div className="mt-12 space-y-8 animate-fade-in">
            {!user ? (
              <div className="flex flex-col items-center space-y-4 sm:flex-row sm:justify-center sm:space-y-0 sm:space-x-4">
                <Link
                  to="/signup"
                  className="inline-flex items-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 transform hover:scale-105 transition-all duration-200 shadow-lg"
                >
                  Get Started
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
                <Link
                  to="/explore"
                  className="inline-flex items-center px-8 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transform hover:scale-105 transition-all duration-200 shadow-lg"
                >
                  Explore Portfolios
                  <Users className="ml-2 h-5 w-5" />
                </Link>
              </div>
            ) : null}

            {/* Feature Cards */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 mt-12 max-w-5xl mx-auto">
              <div className="p-6 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200">
                <div className="flex items-center justify-center w-12 h-12 mx-auto bg-indigo-100 rounded-full">
                  <Briefcase className="h-6 w-6 text-indigo-600" />
                </div>
                <h3 className="mt-3 text-lg font-medium text-gray-900">Professional Templates</h3>
                <p className="mt-2 text-sm text-gray-500">Choose from our collection of professionally designed templates</p>
              </div>

              <div className="p-6 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200">
                <div className="flex items-center justify-center w-12 h-12 mx-auto bg-indigo-100 rounded-full">
                  <Star className="h-6 w-6 text-indigo-600" />
                </div>
                <h3 className="mt-3 text-lg font-medium text-gray-900">Stand Out</h3>
                <p className="mt-2 text-sm text-gray-500">Make your work shine with our powerful showcase features</p>
              </div>

              <div className="p-6 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200">
                <div className="flex items-center justify-center w-12 h-12 mx-auto bg-indigo-100 rounded-full">
                  <Rocket className="h-6 w-6 text-indigo-600" />
                </div>
                <h3 className="mt-3 text-lg font-medium text-gray-900">Grow Your Network</h3>
                <p className="mt-2 text-sm text-gray-500">Connect with other professionals and grow your audience</p>
              </div>
            </div>
          </div>
        </div>

        {/* Featured Section */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">Featured Portfolios</h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featuredPortfolios.map((portfolio) => (
              <div key={portfolio.id} className="bg-white rounded-lg shadow-sm overflow-hidden">
                <img
                  src={portfolio.image}
                  alt={portfolio.name}
                  className="w-full h-48 object-cover"
                />
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900">{portfolio.name}</h3>
                  <p className="text-indigo-600 mb-2">{portfolio.role}</p>
                  <p className="text-gray-500 text-sm mb-4">{portfolio.description}</p>
                  <a
                    href={portfolio.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-sm text-indigo-600 hover:text-indigo-500"
                  >
                    View Portfolio
                    <ArrowRight className="ml-1 h-4 w-4" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}