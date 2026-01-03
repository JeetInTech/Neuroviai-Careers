import React, { useState, useEffect } from 'react';
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
  ChevronRight,
  Star,
  Shield,
  Award,
  Briefcase,
  GraduationCap,
  Globe,
  Play,
  Check,
  Clock,
  BarChart3,
  Linkedin,
  FileDown,
  Palette,
  Bot,
  ChevronDown,
  Quote
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { FULL_PREVIEW_TEMPLATES } from '../components/FullTemplatePreviews';

const FEATURES = [
  {
    icon: Target,
    title: 'ATS Optimized',
    description: 'Our AI ensures your resume scores 90%+ on ATS systems, getting you past automated filters.',
    highlight: '90%+ ATS Score',
  },
  {
    icon: Code,
    title: 'LaTeX Export',
    description: 'Download clean, modular LaTeX code or compiled PDF. Industry-standard formatting.',
    highlight: 'Professional Quality',
  },
  {
    icon: Sparkles,
    title: 'AI-Powered',
    description: 'Smart keyword alignment, impact metrics, and role-specific bullet point optimization.',
    highlight: 'GPT-4 Enhanced',
  },
  {
    icon: Zap,
    title: 'Instant Generation',
    description: 'Paste your LinkedIn URL or enter data manually. Get a polished resume in minutes.',
    highlight: '2 Min Average',
  },
];

const STATS = [
  { value: '50K+', label: 'Resumes Created', icon: FileText },
  { value: '94%', label: 'Average ATS Score', icon: Target },
  { value: '2 min', label: 'Build Time', icon: Clock },
  { value: '25+', label: 'Templates', icon: Palette },
];

const TESTIMONIALS = [
  {
    name: 'Sarah Chen',
    role: 'Software Engineer at Google',
    image: 'https://randomuser.me/api/portraits/women/44.jpg',
    content: 'CV Forge helped me land interviews at FAANG companies. The ATS optimization is incredible - my callback rate tripled!',
    rating: 5,
  },
  {
    name: 'Michael Rodriguez',
    role: 'Product Manager at Stripe',
    image: 'https://randomuser.me/api/portraits/men/32.jpg',
    content: 'The AI suggestions transformed my bullet points into achievement-focused statements. Best resume tool I\'ve ever used.',
    rating: 5,
  },
  {
    name: 'Emily Johnson',
    role: 'Data Scientist at Netflix',
    image: 'https://randomuser.me/api/portraits/women/68.jpg',
    content: 'I was skeptical about AI resume builders, but CV Forge exceeded expectations. The LaTeX export is chef\'s kiss!',
    rating: 5,
  },
];

const COMPANY_LOGOS = [
  { name: 'Google', color: '#4285F4' },
  { name: 'Microsoft', color: '#00A4EF' },
  { name: 'Amazon', color: '#FF9900' },
  { name: 'Meta', color: '#0668E1' },
  { name: 'Apple', color: '#555555' },
  { name: 'Netflix', color: '#E50914' },
];

const FAQ_ITEMS = [
  {
    question: 'Is CV Forge really free?',
    answer: 'Yes! You can create unlimited resumes for free. We offer premium features like AI optimization and more templates for power users.',
  },
  {
    question: 'What is ATS and why does it matter?',
    answer: 'ATS (Applicant Tracking System) is software that scans resumes before humans see them. 75% of resumes are rejected by ATS. Our tool ensures yours gets through.',
  },
  {
    question: 'Can I import my LinkedIn profile?',
    answer: 'Absolutely! Just paste your LinkedIn URL and we\'ll automatically import your experience, education, and skills. Edit as needed.',
  },
  {
    question: 'What formats can I export to?',
    answer: 'Export to PDF for immediate use, or get clean LaTeX code for professional typesetting. Both are ATS-friendly and beautifully formatted.',
  },
];

// Animated counter hook
const useAnimatedCounter = (end: number, duration: number = 2000, startOnView: boolean = true) => {
  const [count, setCount] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    if (!startOnView || hasAnimated) return;
    
    const timer = setTimeout(() => {
      let start = 0;
      const increment = end / (duration / 16);
      const animate = () => {
        start += increment;
        if (start < end) {
          setCount(Math.floor(start));
          requestAnimationFrame(animate);
        } else {
          setCount(end);
          setHasAnimated(true);
        }
      };
      animate();
    }, 500);

    return () => clearTimeout(timer);
  }, [end, duration, startOnView, hasAnimated]);

  return count;
};

export default function Home() {
  const { user } = useAuth();
  const [activeTemplate, setActiveTemplate] = useState(0);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  // Auto-rotate templates
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveTemplate((prev) => (prev + 1) % FULL_PREVIEW_TEMPLATES.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  // Auto-rotate testimonials
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % TESTIMONIALS.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const nextTemplate = () => {
    setActiveTemplate((prev) => (prev + 1) % FULL_PREVIEW_TEMPLATES.length);
  };

  const prevTemplate = () => {
    setActiveTemplate((prev) => (prev - 1 + FULL_PREVIEW_TEMPLATES.length) % FULL_PREVIEW_TEMPLATES.length);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-100 rounded-full blur-3xl opacity-50"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-100 rounded-full blur-3xl opacity-50"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-20">
          <div className="text-center">
            {/* Trust Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-100 text-sm font-medium mb-8 animate-fade-in-down">
              <div className="flex -space-x-1">
                <img src="https://randomuser.me/api/portraits/women/44.jpg" className="w-6 h-6 rounded-full border-2 border-white" alt="" />
                <img src="https://randomuser.me/api/portraits/men/32.jpg" className="w-6 h-6 rounded-full border-2 border-white" alt="" />
                <img src="https://randomuser.me/api/portraits/women/68.jpg" className="w-6 h-6 rounded-full border-2 border-white" alt="" />
              </div>
              <span className="text-gray-600">Trusted by <span className="text-indigo-600 font-semibold">50,000+</span> professionals</span>
              <div className="flex text-amber-400">
                {[...Array(5)].map((_, i) => <Star key={i} className="w-3 h-3 fill-current" />)}
              </div>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold text-gray-900 tracking-tight animate-fade-in-down">
              Build Resumes That
              <span className="relative">
                <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent block mt-2">
                  Beat The Bots
                </span>
                <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 300 12" fill="none">
                  <path d="M2 10C50 4 150 2 298 8" stroke="url(#gradient)" strokeWidth="4" strokeLinecap="round"/>
                  <defs>
                    <linearGradient id="gradient" x1="0" y1="0" x2="300" y2="0">
                      <stop offset="0%" stopColor="#4F46E5"/>
                      <stop offset="100%" stopColor="#7C3AED"/>
                    </linearGradient>
                  </defs>
                </svg>
              </span>
            </h1>

            <p className="mt-8 text-xl text-gray-600 max-w-3xl mx-auto animate-fade-in-up leading-relaxed">
              Create <span className="text-indigo-600 font-semibold">ATS-optimized</span> resumes in minutes with AI-powered optimization. 
              Import from LinkedIn, choose from <span className="text-indigo-600 font-semibold">25+ templates</span>, and export to LaTeX or PDF.
            </p>

            {/* CTA Buttons */}
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in">
              <Link
                to={user ? "/portfolio" : "/signup"}
                className="group w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-white bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl hover:from-indigo-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-300 shadow-xl shadow-indigo-200"
              >
                <FileText className="mr-2 h-5 w-5" />
                Build Your Resume Free
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                to="/portfolio"
                className="group w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-gray-700 bg-white rounded-xl border-2 border-gray-200 hover:border-indigo-300 hover:text-indigo-600 transition-all duration-200 hover:shadow-lg"
              >
                <Play className="mr-2 h-5 w-5" />
                View Templates
              </Link>
            </div>

            {/* Quick Benefits */}
            <div className="mt-10 flex flex-wrap justify-center gap-6 text-sm text-gray-500">
              <div className="flex items-center gap-2">
                <Check className="w-5 h-5 text-green-500" />
                <span>No credit card required</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-5 h-5 text-green-500" />
                <span>ATS-optimized templates</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-5 h-5 text-green-500" />
                <span>LinkedIn import</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="py-8 bg-white border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {STATS.map((stat) => (
              <div key={stat.label} className="text-center group">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-indigo-50 rounded-xl mb-3 group-hover:bg-indigo-100 transition-colors">
                  <stat.icon className="w-6 h-6 text-indigo-600" />
                </div>
                <div className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  {stat.value}
                </div>
                <div className="text-sm text-gray-500 mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Company Logos */}
      <section className="py-12 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-sm text-gray-500 mb-8">
            Trusted by professionals at leading companies
          </p>
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-60">
            {COMPANY_LOGOS.map((company) => (
              <div key={company.name} className="text-2xl font-bold" style={{ color: company.color }}>
                {company.name}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Before/After Comparison */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="inline-flex items-center px-3 py-1 rounded-full bg-green-50 text-green-700 text-sm font-medium mb-4">
              <Sparkles className="w-4 h-4 mr-2" />
              AI Transformation
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">See the CV Forge Difference</h2>
            <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
              Watch how our AI transforms ordinary resume content into powerful, ATS-optimized statements
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* Before */}
            <div className="relative">
              <div className="absolute -top-3 left-4 px-3 py-1 bg-red-100 text-red-700 text-sm font-semibold rounded-full">
                Before
              </div>
              <div className="bg-red-50 rounded-2xl p-6 border-2 border-red-100">
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-red-200 flex items-center justify-center flex-shrink-0 mt-1">
                      <span className="text-red-600 text-xs">✕</span>
                    </div>
                    <div>
                      <p className="text-gray-700">"Responsible for managing team projects"</p>
                      <p className="text-xs text-red-600 mt-1">Vague, passive language</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-red-200 flex items-center justify-center flex-shrink-0 mt-1">
                      <span className="text-red-600 text-xs">✕</span>
                    </div>
                    <div>
                      <p className="text-gray-700">"Worked on improving sales numbers"</p>
                      <p className="text-xs text-red-600 mt-1">No metrics or impact</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-red-200 flex items-center justify-center flex-shrink-0 mt-1">
                      <span className="text-red-600 text-xs">✕</span>
                    </div>
                    <div>
                      <p className="text-gray-700">"Helped with customer service tasks"</p>
                      <p className="text-xs text-red-600 mt-1">Missing keywords</p>
                    </div>
                  </div>
                </div>
                <div className="mt-6 p-3 bg-white rounded-xl flex items-center justify-between">
                  <span className="text-sm text-gray-600">ATS Score</span>
                  <span className="text-2xl font-bold text-red-600">32%</span>
                </div>
              </div>
            </div>

            {/* After */}
            <div className="relative">
              <div className="absolute -top-3 left-4 px-3 py-1 bg-green-100 text-green-700 text-sm font-semibold rounded-full">
                After CV Forge
              </div>
              <div className="bg-green-50 rounded-2xl p-6 border-2 border-green-100">
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-green-200 flex items-center justify-center flex-shrink-0 mt-1">
                      <Check className="w-4 h-4 text-green-600" />
                    </div>
                    <div>
                      <p className="text-gray-700">"Led cross-functional team of 8 to deliver $2M project 3 weeks ahead of schedule"</p>
                      <p className="text-xs text-green-600 mt-1">Action verb + metrics + impact</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-green-200 flex items-center justify-center flex-shrink-0 mt-1">
                      <Check className="w-4 h-4 text-green-600" />
                    </div>
                    <div>
                      <p className="text-gray-700">"Increased quarterly sales by 47% through data-driven prospecting strategies"</p>
                      <p className="text-xs text-green-600 mt-1">Quantified achievement</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-green-200 flex items-center justify-center flex-shrink-0 mt-1">
                      <Check className="w-4 h-4 text-green-600" />
                    </div>
                    <div>
                      <p className="text-gray-700">"Resolved 500+ customer inquiries monthly, maintaining 98% satisfaction rating"</p>
                      <p className="text-xs text-green-600 mt-1">ATS keywords + metrics</p>
                    </div>
                  </div>
                </div>
                <div className="mt-6 p-3 bg-white rounded-xl flex items-center justify-between">
                  <span className="text-sm text-gray-600">ATS Score</span>
                  <span className="text-2xl font-bold text-green-600">94%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Template Showcase */}
      <section className="py-20 bg-gradient-to-b from-slate-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="inline-flex items-center px-3 py-1 rounded-full bg-purple-50 text-purple-700 text-sm font-medium mb-4">
              <Palette className="w-4 h-4 mr-2" />
              25+ Professional Templates
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Templates For Every Role</h2>
            <p className="mt-4 text-lg text-gray-600">ATS-optimized designs for software, finance, healthcare, and more</p>
          </div>
          
          {/* Template Carousel */}
          <div className="relative">
            {/* Navigation Buttons */}
            <button
              onClick={prevTemplate}
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 w-14 h-14 bg-white rounded-full shadow-xl flex items-center justify-center text-gray-600 hover:text-indigo-600 hover:shadow-2xl transition-all border border-gray-100"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>
            <button
              onClick={nextTemplate}
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 w-14 h-14 bg-white rounded-full shadow-xl flex items-center justify-center text-gray-600 hover:text-indigo-600 hover:shadow-2xl transition-all border border-gray-100"
            >
              <ChevronRight className="h-6 w-6" />
            </button>

            {/* Template Display */}
            <div className="flex flex-col lg:flex-row items-center gap-8">
              {/* Template Preview */}
              <div className="flex-1 w-full max-w-2xl mx-auto">
                <div className={`bg-gradient-to-r ${FULL_PREVIEW_TEMPLATES[activeTemplate].gradient} p-4 md:p-6 rounded-2xl shadow-2xl transition-all duration-500`}>
                  <div className="transform transition-all duration-500">
                    {React.createElement(FULL_PREVIEW_TEMPLATES[activeTemplate].component)}
                  </div>
                </div>
                <div className="text-center mt-4">
                  <span className="text-lg font-semibold text-gray-900">{FULL_PREVIEW_TEMPLATES[activeTemplate].name}</span>
                  <p className="text-sm text-gray-500">Perfect for {FULL_PREVIEW_TEMPLATES[activeTemplate].name.toLowerCase()} roles</p>
                </div>
              </div>

              {/* Template Selector */}
              <div className="w-full lg:w-72 flex flex-row lg:flex-col gap-2 overflow-x-auto lg:overflow-y-auto lg:max-h-[500px] pb-2 lg:pb-0 scrollbar-thin">
                {FULL_PREVIEW_TEMPLATES.slice(0, 10).map((template, index) => (
                  <button
                    key={template.id}
                    onClick={() => setActiveTemplate(index)}
                    className={`flex-shrink-0 px-4 py-3 rounded-xl text-left transition-all duration-300 ${
                      activeTemplate === index
                        ? `bg-gradient-to-r ${template.gradient} text-white shadow-lg scale-105`
                        : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-100'
                    }`}
                  >
                    <span className="font-medium text-sm whitespace-nowrap">{template.name}</span>
                  </button>
                ))}
                <Link
                  to="/portfolio"
                  className="flex-shrink-0 px-4 py-3 rounded-xl text-center bg-indigo-50 text-indigo-600 hover:bg-indigo-100 transition-all font-medium text-sm"
                >
                  View All 25+ →
                </Link>
              </div>
            </div>

            {/* Dots Indicator */}
            <div className="flex justify-center gap-2 mt-8">
              {FULL_PREVIEW_TEMPLATES.slice(0, 10).map((_, index) => (
                <button
                  key={index}
                  onClick={() => setActiveTemplate(index)}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    activeTemplate === index ? 'bg-indigo-600 w-8' : 'bg-gray-300 hover:bg-gray-400 w-2'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* CTA */}
          <div className="text-center mt-12">
            <Link
              to={user ? "/portfolio" : "/signup"}
              className="group inline-flex items-center px-8 py-4 text-lg font-semibold text-white bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all shadow-xl"
            >
              Use This Template Free
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="how-it-works" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="inline-flex items-center px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-sm font-medium mb-4">
              <Zap className="w-4 h-4 mr-2" />
              Powerful Features
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Everything You Need to Land Your Dream Job</h2>
            <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
              Professional tools used by career experts, now available to everyone
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {FEATURES.map((feature, index) => (
              <div
                key={feature.title}
                className="group bg-white rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-indigo-100 hover:-translate-y-1"
              >
                <div className="w-14 h-14 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl flex items-center justify-center mb-5 group-hover:from-indigo-100 group-hover:to-purple-100 transition-colors">
                  <feature.icon className="h-7 w-7 text-indigo-600" />
                </div>
                <span className="inline-flex px-2 py-1 bg-indigo-50 text-indigo-600 text-xs font-semibold rounded-full mb-3">
                  {feature.highlight}
                </span>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>

          {/* Additional Features Row */}
          <div className="grid md:grid-cols-3 gap-6 mt-8">
            <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <Linkedin className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h4 className="font-semibold text-gray-900">LinkedIn Import</h4>
                <p className="text-sm text-gray-600">One-click profile import</p>
              </div>
            </div>
            <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <FileDown className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h4 className="font-semibold text-gray-900">Multiple Exports</h4>
                <p className="text-sm text-gray-600">PDF, LaTeX, Word formats</p>
              </div>
            </div>
            <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                <Bot className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <h4 className="font-semibold text-gray-900">AI Suggestions</h4>
                <p className="text-sm text-gray-600">Smart content improvement</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-gradient-to-b from-slate-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="inline-flex items-center px-3 py-1 rounded-full bg-green-50 text-green-700 text-sm font-medium mb-4">
              <Clock className="w-4 h-4 mr-2" />
              Quick & Easy
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Build Your Resume in 3 Simple Steps</h2>
            <p className="mt-4 text-lg text-gray-600">From start to job-ready in under 5 minutes</p>
          </div>

          <div className="relative">
            {/* Connection Line */}
            <div className="hidden md:block absolute top-24 left-1/4 right-1/4 h-0.5 bg-gradient-to-r from-indigo-200 via-purple-200 to-indigo-200"></div>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  step: '01',
                  title: 'Import or Enter Data',
                  description: 'Paste your LinkedIn URL for instant import, or enter your career details manually. Our smart forms guide you.',
                  icon: Users,
                  color: 'from-blue-500 to-indigo-500',
                },
                {
                  step: '02',
                  title: 'AI Optimization',
                  description: 'Our AI enhances your content with ATS keywords, impact metrics, and powerful action verbs automatically.',
                  icon: Sparkles,
                  color: 'from-purple-500 to-pink-500',
                },
                {
                  step: '03',
                  title: 'Export & Apply',
                  description: 'Download as polished PDF or LaTeX code. Your ATS-optimized resume is ready to land interviews.',
                  icon: Download,
                  color: 'from-green-500 to-emerald-500',
                },
              ].map((item, index) => (
                <div key={item.step} className="relative text-center group">
                  <div className={`w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br ${item.color} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    <item.icon className="h-10 w-10 text-white" />
                  </div>
                  <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-8 h-8 bg-white rounded-full shadow-md flex items-center justify-center text-sm font-bold text-indigo-600 border-2 border-indigo-100">
                    {index + 1}
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">{item.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="inline-flex items-center px-3 py-1 rounded-full bg-amber-50 text-amber-700 text-sm font-medium mb-4">
              <Star className="w-4 h-4 mr-2 fill-current" />
              Success Stories
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Loved by Professionals Worldwide</h2>
            <p className="mt-4 text-lg text-gray-600">See what our users are saying about CV Forge</p>
          </div>

          {/* Testimonial Cards */}
          <div className="grid md:grid-cols-3 gap-8">
            {TESTIMONIALS.map((testimonial, index) => (
              <div
                key={testimonial.name}
                className={`bg-white rounded-2xl p-6 shadow-lg border border-gray-100 transition-all duration-500 ${
                  activeTestimonial === index ? 'ring-2 ring-indigo-200 scale-105' : ''
                }`}
              >
                <div className="flex text-amber-400 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-current" />
                  ))}
                </div>
                <Quote className="w-8 h-8 text-indigo-100 mb-3" />
                <p className="text-gray-700 mb-6 leading-relaxed">"{testimonial.content}"</p>
                <div className="flex items-center gap-3">
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <p className="font-semibold text-gray-900">{testimonial.name}</p>
                    <p className="text-sm text-gray-500">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Frequently Asked Questions</h2>
            <p className="mt-4 text-lg text-gray-600">Everything you need to know about CV Forge</p>
          </div>

          <div className="space-y-4">
            {FAQ_ITEMS.map((item, index) => (
              <div
                key={index}
                className="bg-white rounded-xl border border-gray-200 overflow-hidden"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                  className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
                >
                  <span className="font-semibold text-gray-900">{item.question}</span>
                  <ChevronDown
                    className={`w-5 h-5 text-gray-500 transition-transform ${
                      openFaq === index ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {openFaq === index && (
                  <div className="px-6 pb-4 text-gray-600 animate-fade-in">
                    {item.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-24 bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 -z-0">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
        </div>

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 text-white/90 text-sm font-medium mb-8">
            <Sparkles className="w-4 h-4" />
            Join 50,000+ professionals
          </div>
          
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
            Ready to Build a Resume That Gets Results?
          </h2>
          <p className="text-xl text-indigo-100 mb-10 max-w-2xl mx-auto">
            Start free today. No credit card required. Create unlimited resumes with AI-powered optimization.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to={user ? "/portfolio" : "/signup"}
              className="group w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-indigo-600 bg-white rounded-xl hover:bg-indigo-50 transform hover:scale-105 transition-all duration-200 shadow-xl"
            >
              <CheckCircle className="mr-2 h-5 w-5" />
              Start Building Free
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <div className="flex items-center gap-2 text-white/80">
              <Shield className="w-5 h-5" />
              <span className="text-sm">No credit card required</span>
            </div>
          </div>

          {/* Trust indicators */}
          <div className="mt-12 flex flex-wrap justify-center gap-8 text-white/70 text-sm">
            <div className="flex items-center gap-2">
              <Check className="w-5 h-5" />
              <span>Free forever plan</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-5 h-5" />
              <span>25+ templates</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-5 h-5" />
              <span>ATS-optimized</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-5 h-5" />
              <span>AI-powered</span>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 bg-gray-900 text-gray-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 mb-12">
            <div className="md:col-span-2">
              <div className="flex items-center mb-4">
                <FileText className="h-8 w-8 text-indigo-500" />
                <span className="ml-2 text-xl font-bold text-white">CV Forge</span>
              </div>
              <p className="text-gray-400 max-w-md leading-relaxed">
                Build professional, ATS-optimized resumes in minutes with AI-powered tools. 
                Trusted by 50,000+ professionals worldwide.
              </p>
              <div className="flex gap-4 mt-6">
                <a href="#" className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-gray-700 transition-colors">
                  <Globe className="w-5 h-5" />
                </a>
                <a href="#" className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-gray-700 transition-colors">
                  <Linkedin className="w-5 h-5" />
                </a>
              </div>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Product</h4>
              <ul className="space-y-2">
                <li><Link to="/portfolio" className="hover:text-white transition-colors">Templates</Link></li>
                <li><a href="#how-it-works" className="hover:text-white transition-colors">Features</a></li>
                <li><Link to="/signup" className="hover:text-white transition-colors">Get Started</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Resources</h4>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-white transition-colors">Resume Guide</a></li>
                <li><a href="#" className="hover:text-white transition-colors">ATS Tips</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Career Blog</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center">
            <div className="text-sm">
              © {new Date().getFullYear()} CV Forge. Build resumes that beat the bots.
            </div>
            <div className="flex gap-6 mt-4 md:mt-0 text-sm">
              <a href="#" className="hover:text-white transition-colors">Privacy</a>
              <a href="#" className="hover:text-white transition-colors">Terms</a>
              <a href="#" className="hover:text-white transition-colors">Contact</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}