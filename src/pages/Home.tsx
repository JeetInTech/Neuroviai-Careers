import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  FileText, 
  Zap, 
  Download, 
  Target, 
  CheckCircle, 
  ArrowRight, 
  Sparkles,
  Code,
  Users,
  TrendingUp,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { FULL_PREVIEW_TEMPLATES } from '../components/FullTemplatePreviews';

const FEATURES = [
  {
    icon: Target,
    title: 'ATS Optimized',
    description: 'Our AI ensures your resume scores 90%+ on ATS systems, getting you past automated filters.',
  },
  {
    icon: Code,
    title: 'LaTeX Export',
    description: 'Download clean, modular LaTeX code or compiled PDF. Industry-standard formatting.',
  },
  {
    icon: Sparkles,
    title: 'AI-Powered',
    description: 'Smart keyword alignment, impact metrics, and role-specific bullet point optimization.',
  },
  {
    icon: Zap,
    title: 'Instant Generation',
    description: 'Paste your LinkedIn URL or enter data manually. Get a polished resume in minutes.',
  },
];

const STATS = [
  { value: '90%+', label: 'ATS Score Target' },
  { value: '2 min', label: 'Average Build Time' },
  { value: '100%', label: 'Free to Start' },
];

export default function Home() {
  const { user } = useAuth();
  const [activeTemplate, setActiveTemplate] = useState(0);

  const nextTemplate = () => {
    setActiveTemplate((prev) => (prev + 1) % FULL_PREVIEW_TEMPLATES.length);
  };

  const prevTemplate = () => {
    setActiveTemplate((prev) => (prev - 1 + FULL_PREVIEW_TEMPLATES.length) % FULL_PREVIEW_TEMPLATES.length);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-20">
        <div className="text-center">
          {/* Badge */}
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-indigo-50 text-indigo-700 text-sm font-medium mb-6 animate-fade-in-down">
            <Sparkles className="h-4 w-4 mr-2" />
            AI-Powered Resume Builder
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 tracking-tight animate-fade-in-down">
            Forge Resumes That
            <span className="text-indigo-600 block mt-2">Beat The Bots</span>
          </h1>

          <p className="mt-6 text-xl text-gray-600 max-w-2xl mx-auto animate-fade-in-up">
            Create ATS-optimized, professional resumes in minutes. 
            Import from LinkedIn or build from scratch. Export to LaTeX or PDF.
          </p>

          {/* CTA Buttons */}
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in">
            <Link
              to={user ? "/portfolio" : "/signup"}
              className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-white bg-indigo-600 rounded-xl hover:bg-indigo-700 transform hover:scale-105 transition-all duration-200 shadow-lg shadow-indigo-200"
            >
              <FileText className="mr-2 h-5 w-5" />
              Build Your Resume
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
            <a
              href="#how-it-works"
              className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-gray-700 bg-white rounded-xl border-2 border-gray-200 hover:border-indigo-300 hover:text-indigo-600 transition-all duration-200"
            >
              See How It Works
            </a>
          </div>

          {/* Stats */}
          <div className="mt-16 grid grid-cols-3 gap-8 max-w-2xl mx-auto">
            {STATS.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-3xl font-bold text-indigo-600">{stat.value}</div>
                <div className="text-sm text-gray-500 mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Template Showcase - Full Size Previews */}
      <section className="py-16 bg-white border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">Templates For Every Role</h2>
            <p className="mt-4 text-lg text-gray-600">See how your resume will look with our ATS-optimized templates</p>
          </div>
          
          {/* Template Carousel */}
          <div className="relative">
            {/* Navigation Buttons */}
            <button
              onClick={prevTemplate}
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center text-gray-600 hover:text-indigo-600 hover:shadow-xl transition-all"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>
            <button
              onClick={nextTemplate}
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center text-gray-600 hover:text-indigo-600 hover:shadow-xl transition-all"
            >
              <ChevronRight className="h-6 w-6" />
            </button>

            {/* Template Display */}
            <div className="flex flex-col lg:flex-row items-center gap-8">
              {/* Template Preview */}
              <div className="flex-1 w-full max-w-2xl mx-auto">
                <div className={`bg-gradient-to-r ${FULL_PREVIEW_TEMPLATES[activeTemplate].gradient} p-4 md:p-6 rounded-2xl shadow-2xl`}>
                  {React.createElement(FULL_PREVIEW_TEMPLATES[activeTemplate].component)}
                </div>
              </div>

              {/* Template Selector */}
              <div className="w-full lg:w-64 flex flex-row lg:flex-col gap-2 overflow-x-auto lg:overflow-x-visible pb-2 lg:pb-0">
                {FULL_PREVIEW_TEMPLATES.map((template, index) => (
                  <button
                    key={template.id}
                    onClick={() => setActiveTemplate(index)}
                    className={`flex-shrink-0 px-4 py-3 rounded-xl text-left transition-all ${
                      activeTemplate === index
                        ? `bg-gradient-to-r ${template.gradient} text-white shadow-lg`
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    <span className="font-medium text-sm whitespace-nowrap">{template.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Dots Indicator */}
            <div className="flex justify-center gap-2 mt-6">
              {FULL_PREVIEW_TEMPLATES.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setActiveTemplate(index)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    activeTemplate === index ? 'bg-indigo-600 w-6' : 'bg-gray-300 hover:bg-gray-400'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* CTA */}
          <div className="text-center mt-10">
            <Link
              to={user ? "/portfolio" : "/signup"}
              className="inline-flex items-center px-6 py-3 text-sm font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-all shadow-lg"
            >
              Use This Template
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="how-it-works" className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900">Why CV Forge?</h2>
            <p className="mt-4 text-lg text-gray-600">Everything you need to land your dream job</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {FEATURES.map((feature) => (
              <div
                key={feature.title}
                className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow border border-gray-100"
              >
                <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center mb-4">
                  <feature.icon className="h-6 w-6 text-indigo-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900">Build Your Resume in 3 Steps</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: '01',
                title: 'Import or Enter Data',
                description: 'Paste your LinkedIn URL for instant import, or enter your career details manually.',
                icon: Users,
              },
              {
                step: '02',
                title: 'AI Optimization',
                description: 'Our AI enhances your content with ATS keywords, impact metrics, and professional phrasing.',
                icon: TrendingUp,
              },
              {
                step: '03',
                title: 'Export & Apply',
                description: 'Download as LaTeX code or compiled PDF. Your resume is ready to send.',
                icon: Download,
              },
            ].map((item) => (
              <div key={item.step} className="relative">
                <div className="text-6xl font-bold text-indigo-100 absolute -top-4 -left-2">{item.step}</div>
                <div className="relative bg-slate-50 rounded-2xl p-6 pt-10">
                  <item.icon className="h-8 w-8 text-indigo-600 mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{item.title}</h3>
                  <p className="text-gray-600">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-indigo-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-6">
            Ready to Build a Resume That Gets Results?
          </h2>
          <p className="text-xl text-indigo-100 mb-10">
            Join thousands of professionals who've landed their dream jobs with CV Forge.
          </p>
          <Link
            to={user ? "/portfolio" : "/signup"}
            className="inline-flex items-center px-8 py-4 text-lg font-semibold text-indigo-600 bg-white rounded-xl hover:bg-indigo-50 transform hover:scale-105 transition-all duration-200 shadow-lg"
          >
            <CheckCircle className="mr-2 h-5 w-5" />
            Start Building For Free
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-gray-900 text-gray-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center mb-4 md:mb-0">
              <FileText className="h-8 w-8 text-indigo-500" />
              <span className="ml-2 text-xl font-bold text-white">CV Forge</span>
            </div>
            <div className="text-sm">
              © {new Date().getFullYear()} CV Forge. Build resumes that beat the bots.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}