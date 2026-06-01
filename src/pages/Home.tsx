import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, useInView, AnimatePresence } from 'framer-motion';
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
  ChevronLeft,
  ChevronRight,
  Star,
  Shield,
  Play,
  Check,
  Clock,
  BarChart3,
  Linkedin,
  FileDown,
  Bot,
  ChevronDown,
  Quote,
  Layers,
  Cpu,
  Wand2,
  Eye,
  Globe,
  MousePointerClick,
  X
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { FULL_PREVIEW_TEMPLATES, DEFAULT_SAMPLE_CV_DATA } from '../components/templatePreviewHelpers';
import api from '../lib/api';

/* ═══════════════════════════════════════════
   CONSTANTS & DATA
   ═══════════════════════════════════════════ */

const FEATURES_BENTO = [
  {
    icon: Target,
    title: 'ATS Optimized',
    description: 'AI ensures your resume scores 90%+ on ATS systems, getting you past automated filters every time.',
    highlight: '90%+ ATS Score',
    size: 'large', // spans 2 cols
  },
  {
    icon: Code,
    title: 'LaTeX Export',
    description: 'Download clean, modular LaTeX code or compiled PDF. Industry-standard formatting.',
    highlight: 'Professional Quality',
    size: 'small',
  },
  {
    icon: Sparkles,
    title: 'AI-Powered',
    description: 'Smart keyword alignment, impact metrics, and role-specific bullet optimization.',
    highlight: 'GPT-4 Enhanced',
    size: 'small',
  },
  {
    icon: Zap,
    title: 'Instant Generation',
    description: 'Paste your LinkedIn URL or enter data manually. Get a polished resume in under 2 minutes.',
    highlight: '2 Min Average',
    size: 'small',
  },
  {
    icon: Linkedin,
    title: 'LinkedIn Import',
    description: 'One-click profile import — pull your entire career history automatically.',
    highlight: 'Auto Import',
    size: 'small',
  },
  {
    icon: Layers,
    title: '20+ Templates',
    description: 'ATS-optimized designs for engineering, data science, creative, executive, and more.',
    highlight: 'Every Industry',
    size: 'large',
  },
];

const STATS = [
  { value: 50000, suffix: '+', label: 'Resumes Created', icon: FileText },
  { value: 94, suffix: '%', label: 'Average ATS Score', icon: Target },
  { value: 2, suffix: ' min', label: 'Build Time', icon: Clock },
  { value: 20, suffix: '+', label: 'Templates', icon: Layers },
];

const TESTIMONIALS = [
  {
    name: 'Sarah C.',
    role: 'Software Engineer',
    content: 'CV Forge helped me land interviews at top tech companies. The ATS optimization is incredible — my callback rate tripled!',
    rating: 5,
  },
  {
    name: 'Michael R.',
    role: 'Product Manager',
    content: 'The AI suggestions transformed my bullet points into achievement-focused statements. Best resume tool I\'ve used.',
    rating: 5,
  },
  {
    name: 'Emily J.',
    role: 'Data Scientist',
    content: 'I was skeptical about AI resume builders, but CV Forge exceeded expectations. The LaTeX export is chef\'s kiss!',
    rating: 5,
  },
];

const COMPANIES = ['Google', 'Microsoft', 'Amazon', 'Meta', 'Apple', 'Netflix', 'Stripe', 'Figma'];

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
    answer: 'Absolutely! Just paste your LinkedIn URL and we\'ll automatically import your experience, education, and skills.',
  },
  {
    question: 'What formats can I export to?',
    answer: 'Export to PDF for immediate use, or get clean LaTeX code for professional typesetting. Both are ATS-friendly and beautifully formatted.',
  },
];

const HOW_IT_WORKS = [
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
    icon: Wand2,
    color: 'from-purple-500 to-pink-500',
  },
  {
    step: '03',
    title: 'Export & Apply',
    description: 'Download as polished PDF or LaTeX code. Your ATS-optimized resume is ready to land interviews.',
    icon: Download,
    color: 'from-emerald-500 to-teal-500',
  },
];

/* ═══════════════════════════════════════════
   UTILITY HOOKS
   ═══════════════════════════════════════════ */

/** Animated counter that triggers on viewport entry */
function useAnimatedCounter(end: number, duration: number = 2000) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });

  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const increment = end / (duration / 16);
    let raf: number;

    const animate = () => {
      start += increment;
      if (start < end) {
        setCount(Math.floor(start));
        raf = requestAnimationFrame(animate);
      } else {
        setCount(end);
      }
    };

    const timeout = setTimeout(() => {
      raf = requestAnimationFrame(animate);
    }, 200);

    return () => {
      clearTimeout(timeout);
      cancelAnimationFrame(raf);
    };
  }, [inView, end, duration]);

  return { count, ref };
}

/** Track mouse position within an element */
function useMousePosition() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const ref = useRef<HTMLDivElement>(null);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    setPosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  }, []);

  return { position, ref, handleMouseMove };
}

/* ═══════════════════════════════════════════
   MOTION VARIANTS
   ═══════════════════════════════════════════ */

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (delay: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, delay, ease: [0.25, 0.4, 0.25, 1] },
  }),
};

const fadeIn = {
  hidden: { opacity: 0 },
  visible: (delay: number = 0) => ({
    opacity: 1,
    transition: { duration: 0.6, delay },
  }),
};

const staggerContainer = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.1 },
  },
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: (delay: number = 0) => ({
    opacity: 1,
    scale: 1,
    transition: { duration: 0.5, delay, ease: [0.25, 0.4, 0.25, 1] },
  }),
};

/* ═══════════════════════════════════════════
   SECTION COMPONENTS
   ═══════════════════════════════════════════ */

/** Section wrapper with viewport animation */
function AnimatedSection({
  children,
  className = '',
  id,
}: {
  children: React.ReactNode;
  className?: string;
  id?: string;
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <motion.section
      ref={ref}
      id={id}
      initial="hidden"
      animate={inView ? 'visible' : 'hidden'}
      variants={staggerContainer}
      className={className}
    >
      {children}
    </motion.section>
  );
}

/* ───────────────────────────────────────────
   STAGE 1: HERO
   ─────────────────────────────────────────── */

function HeroSection() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { position, ref: mouseRef, handleMouseMove } = useMousePosition();
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [limitModal, setLimitModal] = useState({ show: false, existingTemplate: '' });

  const handleUseTemplate = async (templateId: string) => {
    if (user) {
      // Logged in: take directly to the editor to fill details
      navigate('/cv/new', { 
        state: { 
          isTemplate: true, 
          template: templateId,
          cvData: DEFAULT_SAMPLE_CV_DATA
        } 
      });
    } else {
      // Guest user: check single template limit!
      try {
        const localUsed = localStorage.getItem('guest_used_template');
        if (localUsed && localUsed !== templateId) {
          setLimitModal({ show: true, existingTemplate: localUsed });
          return;
        }

        // Verify against backend IP limits to prevent browser-switching bypass
        const status = await api.checkGuestStatus();
        if (status.used && status.template_id !== templateId) {
          localStorage.setItem('guest_used_template', status.template_id);
          setLimitModal({ show: true, existingTemplate: status.template_id });
          return;
        }

        // Record template selection on backend & local
        await api.recordGuestTemplate(templateId);
        localStorage.setItem('guest_used_template', templateId);

        // Take directly to guest editor
        navigate('/cv/edit/guest', { 
          state: { 
            isTemplate: true, 
            template: templateId,
            cvData: DEFAULT_SAMPLE_CV_DATA
          } 
        });
      } catch (err: any) {
        console.error("Guest limit check failed:", err);
        // Fallback to local storage if backend is offline or errors
        const localUsed = localStorage.getItem('guest_used_template');
        if (localUsed && localUsed !== templateId) {
          setLimitModal({ show: true, existingTemplate: localUsed });
        } else {
          localStorage.setItem('guest_used_template', templateId);
          navigate('/cv/edit/guest', { 
            state: { 
              isTemplate: true, 
              template: templateId,
              cvData: DEFAULT_SAMPLE_CV_DATA
            } 
          });
        }
      }
    }
  };

  const resetTilt = useCallback(() => setTilt({ x: 0, y: 0 }), []);

  // 3D tilt for resume mockup
  const handleMockupMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setTilt({ x: y * -15, y: x * 15 });
  }, []);

  return (
    <section
      ref={mouseRef}
      onMouseMove={handleMouseMove}
      className="relative min-h-[90vh] flex items-center overflow-hidden"
      style={{ background: 'linear-gradient(135deg, #0A0A0F 0%, #0F0F1A 50%, #0A0A0F 100%)' }}
    >
      {/* Animated gradient mesh background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute w-[600px] h-[600px] rounded-full bg-indigo-600/20 blur-[120px] top-[-10%] left-[10%] animate-gradient-mesh-1" />
        <div className="absolute w-[500px] h-[500px] rounded-full bg-purple-600/15 blur-[100px] bottom-[-5%] right-[15%] animate-gradient-mesh-2" />
        <div className="absolute w-[400px] h-[400px] rounded-full bg-blue-500/10 blur-[80px] top-[40%] left-[50%] animate-gradient-mesh-3" />
        {/* Subtle grid overlay */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
            backgroundSize: '60px 60px',
          }}
        />
      </div>

      {/* Mouse-tracking glow orb */}
      <div
        className="absolute w-[500px] h-[500px] rounded-full pointer-events-none transition-all duration-700 ease-out"
        style={{
          left: position.x - 250,
          top: position.y - 250,
          background: 'radial-gradient(circle, rgba(99,102,241,0.08) 0%, transparent 70%)',
        }}
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 w-full">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left: Copy */}
          <div className="text-center lg:text-left">
            {/* Trust badge */}
            <motion.div
              variants={fadeUp}
              custom={0}
              initial="hidden"
              animate="visible"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass text-sm font-medium mb-8"
            >
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                ))}
              </div>
              <span className="text-white/70">Trusted by <span className="text-white font-semibold">50,000+</span> professionals</span>
            </motion.div>

            {/* Headline */}
            <motion.h1
              variants={fadeUp}
              custom={0.1}
              initial="hidden"
              animate="visible"
              className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tight leading-[1.1]"
            >
              <span className="text-white">Build Resumes</span>
              <br />
              <span className="text-white">That </span>
              <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-indigo-400 bg-clip-text text-transparent">
                Beat The Bots
              </span>
            </motion.h1>

            {/* Sub-headline */}
            <motion.p
              variants={fadeUp}
              custom={0.2}
              initial="hidden"
              animate="visible"
              className="mt-6 text-lg sm:text-xl text-white/60 max-w-xl mx-auto lg:mx-0 leading-relaxed"
            >
              Create <span className="text-indigo-400 font-medium">ATS-optimized</span> resumes in minutes with AI-powered optimization.
              Import from LinkedIn, choose from <span className="text-indigo-400 font-medium">20+ templates</span>, and export to LaTeX or PDF.
            </motion.p>

            {/* CTAs */}
            <motion.div
              variants={fadeUp}
              custom={0.3}
              initial="hidden"
              animate="visible"
              className="mt-8 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4"
            >
              <button
                onClick={() => handleUseTemplate('tech-focused')}
                className="group w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-white bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl hover:from-indigo-500 hover:to-purple-500 transform hover:scale-[1.03] transition-all duration-300 animate-glow-pulse active:scale-[0.98]"
              >
                <FileText className="mr-2 h-5 w-5" />
                Build Your Resume Free
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </button>
              <Link
                to="/templates"
                className="group w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-white/80 glass rounded-xl hover:bg-white/10 transition-all duration-200"
              >
                <Eye className="mr-2 h-5 w-5" />
                View Templates
              </Link>
            </motion.div>

            {/* Quick trust signals */}
            <motion.div
              variants={fadeUp}
              custom={0.4}
              initial="hidden"
              animate="visible"
              className="mt-8 flex flex-wrap justify-center lg:justify-start gap-x-6 gap-y-2 text-sm text-white/40"
            >
              {['No credit card', 'ATS-optimized', 'LinkedIn import'].map((item) => (
                <div key={item} className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-400/60" />
                  <span>{item}</span>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Right: 3D Resume Mockup */}
          <motion.div
            variants={fadeUp}
            custom={0.3}
            initial="hidden"
            animate="visible"
            className="hidden lg:flex justify-center perspective-1000"
          >
            <div
              className="relative cursor-default"
              onMouseMove={handleMockupMouseMove}
              onMouseLeave={resetTilt}
            >
              {/* Glow behind mockup */}
              <div className="absolute -inset-8 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 rounded-3xl blur-2xl" />

              {/* The mockup card */}
              <div
                className="relative bg-white rounded-2xl shadow-2xl p-6 w-[340px] preserve-3d transition-transform duration-200 ease-out"
                style={{
                  transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
                }}
              >
                {/* Mock resume content */}
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white text-sm font-bold">S</div>
                    <div>
                      <div className="h-3.5 w-32 bg-gray-800 rounded" />
                      <div className="h-2.5 w-24 bg-gray-400 rounded mt-1.5" />
                    </div>
                  </div>
                  <div className="border-t border-gray-100 pt-3">
                    <div className="h-2.5 w-16 bg-indigo-500 rounded mb-2" />
                    <div className="space-y-1.5">
                      <div className="h-2 w-full bg-gray-200 rounded" />
                      <div className="h-2 w-[90%] bg-gray-200 rounded" />
                      <div className="h-2 w-[75%] bg-gray-200 rounded" />
                    </div>
                  </div>
                  <div className="border-t border-gray-100 pt-3">
                    <div className="h-2.5 w-20 bg-indigo-500 rounded mb-2" />
                    <div className="space-y-1.5">
                      <div className="h-2 w-full bg-gray-200 rounded" />
                      <div className="h-2 w-[85%] bg-gray-200 rounded" />
                    </div>
                  </div>
                  <div className="border-t border-gray-100 pt-3">
                    <div className="h-2.5 w-14 bg-indigo-500 rounded mb-2" />
                    <div className="flex gap-2 flex-wrap">
                      {['React', 'Python', 'AWS', 'ML'].map((s) => (
                        <span key={s} className="px-2 py-0.5 text-[10px] font-medium bg-indigo-50 text-indigo-600 rounded">
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* ATS Score badge floating */}
                <div className="absolute -top-4 -right-4 bg-gradient-to-br from-emerald-400 to-emerald-600 text-white rounded-xl px-3 py-1.5 text-sm font-bold shadow-lg animate-float-subtle">
                  94% ATS
                </div>

                {/* Floating AI badge */}
                <div className="absolute -bottom-3 -left-3 bg-gradient-to-br from-purple-500 to-indigo-600 text-white rounded-xl px-3 py-1.5 text-xs font-medium shadow-lg flex items-center gap-1 animate-float-subtle" style={{ animationDelay: '1s' }}>
                  <Sparkles className="w-3 h-3" />
                  AI Enhanced
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Guest Limit Modal */}
      {limitModal.show && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
          <div className="bg-slate-950/95 border border-white/10 p-8 rounded-3xl max-w-md w-full shadow-2xl relative animate-in fade-in zoom-in-95 duration-300">
            <div className="absolute top-4 right-4">
              <button 
                onClick={() => setLimitModal({ show: false, existingTemplate: '' })}
                className="text-white/40 hover:text-white p-2 rounded-lg hover:bg-white/5 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="w-16 h-16 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 rounded-2xl flex items-center justify-center mb-6">
              <Sparkles className="w-8 h-8 text-indigo-400 animate-pulse" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-3">Single Template Trial</h3>
            <p className="text-white/60 text-sm leading-relaxed mb-6">
              You are currently using the <span className="text-indigo-300 font-semibold uppercase">{limitModal.existingTemplate?.replace('-', ' ')}</span> template. 
              Before logging in, you can only create and edit one resume template.
            </p>
            <div className="flex flex-col gap-3">
              <button
                onClick={() => {
                  setLimitModal({ show: false, existingTemplate: '' });
                  navigate('/signup');
                }}
                className="w-full py-3.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold rounded-xl shadow-lg transition-all"
              >
                Sign Up to Unlock All Templates
              </button>
              <button
                onClick={() => {
                  setLimitModal({ show: false, existingTemplate: '' });
                  navigate('/login');
                }}
                className="w-full py-3.5 bg-white/5 border border-white/10 hover:bg-white/10 text-white font-bold rounded-xl transition-all"
              >
                Log In
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

/* ───────────────────────────────────────────
   STAGE 2: SOCIAL PROOF
   ─────────────────────────────────────────── */

function SocialProofSection() {
  return (
    <AnimatedSection className="relative py-16 overflow-hidden" style={{ background: '#07070C' }}>
      {/* Stats */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {STATS.map((stat, i) => {
            const { count, ref } = useAnimatedCounter(stat.value);
            return (
              <motion.div
                key={stat.label}
                variants={fadeUp}
                custom={i * 0.1}
                ref={ref}
                className="text-center glass rounded-2xl p-6 group hover:bg-white/[0.06] transition-colors"
              >
                <div className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-indigo-500/10 mb-3 group-hover:bg-indigo-500/20 transition-colors">
                  <stat.icon className="w-5 h-5 text-indigo-400" />
                </div>
                <div className="text-3xl sm:text-4xl font-bold text-white">
                  {count}{stat.suffix}
                </div>
                <div className="text-sm text-white/40 mt-1">{stat.label}</div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Company marquee */}
      <div className="relative">
        <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-[#07070C] to-transparent z-10" />
        <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-[#07070C] to-transparent z-10" />

        <motion.div variants={fadeIn} custom={0.3}>
          <p className="text-center text-xs uppercase tracking-[0.2em] text-white/25 mb-6">
            Trusted by professionals at leading companies
          </p>
          <div className="overflow-hidden">
            <div className="flex animate-marquee whitespace-nowrap">
              {[...COMPANIES, ...COMPANIES].map((name, i) => (
                <span
                  key={`${name}-${i}`}
                  className="mx-8 sm:mx-12 text-xl sm:text-2xl font-bold text-white/15 select-none"
                >
                  {name}
                </span>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatedSection>
  );
}

/* ───────────────────────────────────────────
   STAGE 3: AI TRANSFORMATION DEMO
   ─────────────────────────────────────────── */

function TransformationSection() {
  const gaugeRef = useRef(null);
  const gaugeInView = useInView(gaugeRef, { once: true, margin: '-100px' });

  return (
    <AnimatedSection className="py-24 relative overflow-hidden" style={{ background: 'linear-gradient(180deg, #07070C 0%, #0D0D18 100%)' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <motion.div variants={fadeUp} custom={0} className="inline-flex items-center px-3 py-1.5 rounded-full glass text-sm font-medium mb-4 text-emerald-400">
            <Sparkles className="w-4 h-4 mr-2" />
            AI Transformation
          </motion.div>
          <motion.h2 variants={fadeUp} custom={0.1} className="text-3xl md:text-5xl font-bold text-white">
            See the CV Forge Difference
          </motion.h2>
          <motion.p variants={fadeUp} custom={0.2} className="mt-4 text-lg text-white/50 max-w-2xl mx-auto">
            Watch how our AI transforms ordinary resume content into powerful, ATS-optimized statements
          </motion.p>
        </div>

        <div className="grid lg:grid-cols-5 gap-8 max-w-6xl mx-auto items-start">
          {/* Before Card */}
          <motion.div variants={scaleIn} custom={0.2} className="lg:col-span-2">
            <div className="relative pt-4">
              <div className="absolute top-0 left-4 z-10 px-3 py-1 bg-red-500/20 text-red-400 text-sm font-semibold rounded-full border border-red-500/20 shadow-md">
                Before
              </div>
              <div className="rounded-2xl p-6 glass border border-red-500/10">
                <div className="space-y-4">
                  {[
                    { text: '"Responsible for managing team projects"', note: 'Vague, passive language' },
                    { text: '"Worked on improving sales numbers"', note: 'No metrics or impact' },
                    { text: '"Helped with customer service tasks"', note: 'Missing keywords' },
                  ].map((item, idx) => (
                    <div key={idx} className="flex items-start gap-3">
                      <div className="w-5 h-5 rounded-full bg-red-500/20 flex items-center justify-center flex-shrink-0 mt-1">
                        <span className="text-red-400 text-xs">✕</span>
                      </div>
                      <div>
                        <p className="text-white/70 text-sm">{item.text}</p>
                        <p className="text-xs text-red-400/60 mt-0.5">{item.note}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-6 p-3 rounded-xl bg-red-500/5 border border-red-500/10 flex items-center justify-between">
                  <span className="text-sm text-white/50">ATS Score</span>
                  <span className="text-2xl font-bold text-red-400">32%</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Center: Arrow / ATS Gauge */}
          <motion.div variants={scaleIn} custom={0.3} className="flex flex-col items-center justify-center lg:col-span-1" ref={gaugeRef}>
            <div className="relative w-28 h-28">
              <svg className="w-28 h-28 -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="45" stroke="rgba(255,255,255,0.05)" strokeWidth="6" fill="none" />
                <circle
                  cx="50" cy="50" r="45" fill="none"
                  stroke="url(#gaugeGrad)"
                  strokeWidth="6"
                  strokeLinecap="round"
                  strokeDasharray="283"
                  strokeDashoffset={gaugeInView ? 283 * (1 - 0.94) : 283}
                  style={{ transition: 'stroke-dashoffset 2s cubic-bezier(0.4, 0, 0.2, 1)' }}
                />
                <defs>
                  <linearGradient id="gaugeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#6366f1" />
                    <stop offset="100%" stopColor="#a855f7" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-2xl font-bold text-white">94%</span>
                <span className="text-[10px] text-white/40 uppercase tracking-wider">ATS</span>
              </div>
            </div>
            <div className="mt-4 hidden lg:flex flex-col items-center">
              <ArrowRight className="w-6 h-6 text-indigo-400/50 rotate-0 lg:rotate-0" />
              <span className="text-xs text-white/30 mt-1">AI Enhanced</span>
            </div>
          </motion.div>

          {/* After Card */}
          <motion.div variants={scaleIn} custom={0.4} className="lg:col-span-2">
            <div className="relative pt-4">
              <div className="absolute top-0 left-4 z-10 px-3 py-1 bg-emerald-500/20 text-emerald-400 text-sm font-semibold rounded-full border border-emerald-500/20 shadow-md">
                After CV Forge
              </div>
              <div className="rounded-2xl p-6 glass border border-emerald-500/10">
                <div className="space-y-4">
                  {[
                    { text: '"Led cross-functional team of 8 to deliver $2M project 3 weeks ahead of schedule"', note: 'Action verb + metrics + impact' },
                    { text: '"Increased quarterly sales by 47% through data-driven prospecting strategies"', note: 'Quantified achievement' },
                    { text: '"Resolved 500+ customer inquiries monthly, maintaining 98% satisfaction rating"', note: 'ATS keywords + metrics' },
                  ].map((item, idx) => (
                    <div key={idx} className="flex items-start gap-3">
                      <div className="w-5 h-5 rounded-full bg-emerald-500/20 flex items-center justify-center flex-shrink-0 mt-1">
                        <Check className="w-3 h-3 text-emerald-400" />
                      </div>
                      <div>
                        <p className="text-white/80 text-sm">{item.text}</p>
                        <p className="text-xs text-emerald-400/60 mt-0.5">{item.note}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-6 p-3 rounded-xl bg-emerald-500/5 border border-emerald-500/10 flex items-center justify-between">
                  <span className="text-sm text-white/50">ATS Score</span>
                  <span className="text-2xl font-bold text-emerald-400">94%</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </AnimatedSection>
  );
}

/* ───────────────────────────────────────────
   STAGE 4: TEMPLATE SHOWCASE
   ─────────────────────────────────────────── */

function TemplateShowcase() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTemplate, setActiveTemplate] = useState(0);
  const [limitModal, setLimitModal] = useState({ show: false, existingTemplate: '' });
  const displayTemplates = FULL_PREVIEW_TEMPLATES.slice(0, 8);

  // Auto-rotate
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveTemplate((prev) => (prev + 1) % displayTemplates.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [displayTemplates.length]);

  const nextTemplate = () => setActiveTemplate((prev) => (prev + 1) % displayTemplates.length);
  const prevTemplate = () => setActiveTemplate((prev) => (prev - 1 + displayTemplates.length) % displayTemplates.length);

  const handleUseTemplate = async (templateId: string) => {
    if (user) {
      // Logged in: take directly to the editor to fill details
      navigate('/cv/new', { 
        state: { 
          isTemplate: true, 
          template: templateId,
          cvData: DEFAULT_SAMPLE_CV_DATA
        } 
      });
    } else {
      // Guest user: check single template limit!
      try {
        const localUsed = localStorage.getItem('guest_used_template');
        if (localUsed && localUsed !== templateId) {
          setLimitModal({ show: true, existingTemplate: localUsed });
          return;
        }

        // Verify against backend IP limits to prevent browser-switching bypass
        const status = await api.checkGuestStatus();
        if (status.used && status.template_id !== templateId) {
          localStorage.setItem('guest_used_template', status.template_id);
          setLimitModal({ show: true, existingTemplate: status.template_id });
          return;
        }

        // Record template selection on backend & local
        await api.recordGuestTemplate(templateId);
        localStorage.setItem('guest_used_template', templateId);

        // Take directly to guest editor
        navigate('/cv/edit/guest', { 
          state: { 
            isTemplate: true, 
            template: templateId,
            cvData: DEFAULT_SAMPLE_CV_DATA
          } 
        });
      } catch (err: any) {
        console.error("Guest limit check failed:", err);
        // Fallback to local storage if backend is offline or errors
        const localUsed = localStorage.getItem('guest_used_template');
        if (localUsed && localUsed !== templateId) {
          setLimitModal({ show: true, existingTemplate: localUsed });
        } else {
          localStorage.setItem('guest_used_template', templateId);
          navigate('/cv/edit/guest', { 
            state: { 
              isTemplate: true, 
              template: templateId,
              cvData: DEFAULT_SAMPLE_CV_DATA
            } 
          });
        }
      }
    }
  };

  return (
    <AnimatedSection className="py-24 relative overflow-hidden" style={{ background: 'linear-gradient(180deg, #0D0D18 0%, #0A0A0F 100%)' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <motion.div variants={fadeUp} custom={0} className="inline-flex items-center px-3 py-1.5 rounded-full glass text-sm font-medium mb-4 text-purple-400">
            <Layers className="w-4 h-4 mr-2" />
            20+ Professional Templates
          </motion.div>
          <motion.h2 variants={fadeUp} custom={0.1} className="text-3xl md:text-5xl font-bold text-white">
            Templates For Every Role
          </motion.h2>
          <motion.p variants={fadeUp} custom={0.2} className="mt-4 text-lg text-white/50">
            ATS-optimized designs for engineering, data science, creative, and more
          </motion.p>
        </div>

        {/* Carousel */}
        <motion.div variants={fadeUp} custom={0.3} className="relative">
          {/* Nav buttons */}
          <button
            onClick={prevTemplate}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-2 z-10 w-12 h-12 glass rounded-full flex items-center justify-center text-white/60 hover:text-white hover:bg-white/10 transition-all"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            onClick={nextTemplate}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-2 z-10 w-12 h-12 glass rounded-full flex items-center justify-center text-white/60 hover:text-white hover:bg-white/10 transition-all"
          >
            <ChevronRight className="h-5 w-5" />
          </button>

          {/* Template Cards — 3D perspective carousel */}
          <div className="flex items-center justify-center gap-4 overflow-hidden py-8 perspective-1000">
            {displayTemplates.map((template, index) => {
              const offset = index - activeTemplate;
              const isActive = index === activeTemplate;
              const isVisible = Math.abs(offset) <= 2;

              if (!isVisible) return null;

              return (
                <div
                  key={template.id}
                  className="flex-shrink-0 transition-all duration-500 ease-out cursor-pointer"
                  style={{
                    width: isActive ? '320px' : '200px',
                    transform: `translateX(${offset * 20}px) scale(${isActive ? 1 : 0.85}) rotateY(${offset * -5}deg)`,
                    opacity: isActive ? 1 : 0.5,
                    zIndex: isActive ? 10 : 5 - Math.abs(offset),
                    filter: isActive ? 'none' : 'blur(1px)',
                  }}
                  onClick={() => setActiveTemplate(index)}
                >
                  <div className={`relative bg-[#0d0d15]/90 backdrop-blur-xl border transition-all duration-500 rounded-2xl ${
                    isActive 
                      ? 'border-white/25 shadow-[0_25px_60px_-15px_rgba(99,102,241,0.35)] ring-1 ring-white/10' 
                      : 'border-white/5 shadow-2xl hover:border-white/10 opacity-75'
                  } p-3 overflow-hidden group`}>
                    
                    {/* Card Top Accent Bar with beautiful category indicator & status info */}
                    <div className="flex items-center justify-between pb-3 text-[10px] text-white/50 tracking-wider uppercase font-bold select-none">
                      <span className="flex items-center gap-2">
                        <span className="relative flex h-2 w-2">
                          {isActive && (
                            <span className={`animate-ping absolute inline-flex h-full w-full rounded-full bg-gradient-to-r ${template.gradient} opacity-75`} />
                          )}
                          <span className={`relative inline-flex rounded-full h-2 w-2 bg-gradient-to-r ${template.gradient}`} />
                        </span>
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-white via-white to-white/70">
                          {template.name.split(' ')[0]} Layout
                        </span>
                      </span>
                      <span className="px-1.5 py-0.5 rounded bg-white/5 border border-white/10 text-[9px] text-indigo-300">
                        98% ATS
                      </span>
                    </div>

                    {/* Inner document preview container */}
                    <div className="bg-white rounded-xl overflow-hidden aspect-[8.5/11] border border-slate-200/50 shadow-inner relative">
                      <div className="transform scale-[0.28] origin-top-left w-[357%] h-[357%] select-none">
                        {React.createElement(template.component)}
                      </div>
                      
                      {/* Ambient premium overlay */}
                      <div className="absolute inset-0 bg-gradient-to-tr from-slate-900/5 via-transparent to-white/10 pointer-events-none" />
                    </div>

                    {/* Bottom sleek status accent line */}
                    <div className={`absolute bottom-0 inset-x-0 h-1 bg-gradient-to-r ${template.gradient}`} />
                  </div>
                  {isActive && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                      className="text-center mt-6 flex flex-col items-center gap-1.5"
                    >
                      <span className="text-white font-bold tracking-wide text-xl bg-clip-text text-transparent bg-gradient-to-r from-white via-white to-white/60">
                        {template.name}
                      </span>
                      <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-white/5 border border-white/10 text-indigo-300 uppercase tracking-widest">
                        ATS Vetted
                      </span>
                    </motion.div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Dots */}
          <div className="flex justify-center gap-2 mt-6">
            {displayTemplates.map((_, index) => (
              <button
                key={index}
                onClick={() => setActiveTemplate(index)}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  activeTemplate === index ? 'bg-indigo-400 w-8' : 'bg-white/20 hover:bg-white/40 w-1.5'
                }`}
              />
            ))}
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div variants={fadeUp} custom={0.4} className="text-center mt-10">
          <button
            onClick={() => handleUseTemplate(displayTemplates[activeTemplate].id)}
            className="group inline-flex items-center px-8 py-4 text-lg font-semibold text-white bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl hover:from-indigo-500 hover:to-purple-500 transition-all shadow-xl shadow-indigo-500/20 active:scale-[0.98]"
          >
            Use This Template Free
            <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </motion.div>

        {/* Guest Limit Modal */}
        {limitModal.show && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
            <div className="bg-slate-950/95 border border-white/10 p-8 rounded-3xl max-w-md w-full shadow-2xl relative animate-in fade-in zoom-in-95 duration-300">
              <div className="absolute top-4 right-4">
                <button 
                  onClick={() => setLimitModal({ show: false, existingTemplate: '' })}
                  className="text-white/40 hover:text-white p-2 rounded-lg hover:bg-white/5 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="w-16 h-16 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 rounded-2xl flex items-center justify-center mb-6">
                <Sparkles className="w-8 h-8 text-indigo-400 animate-pulse" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">Single Template Trial</h3>
              <p className="text-white/60 text-sm leading-relaxed mb-6">
                You are currently using the <span className="text-indigo-300 font-semibold uppercase">{limitModal.existingTemplate?.replace('-', ' ')}</span> template. 
                Before logging in, you can only create and edit one resume template.
              </p>
              <div className="flex flex-col gap-3">
                <button
                  onClick={() => {
                    setLimitModal({ show: false, existingTemplate: '' });
                    navigate('/signup');
                  }}
                  className="w-full py-3.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold rounded-xl shadow-lg transition-all"
                >
                  Sign Up to Unlock All Templates
                </button>
                <button
                  onClick={() => {
                    setLimitModal({ show: false, existingTemplate: '' });
                    navigate('/login');
                  }}
                  className="w-full py-3.5 bg-white/5 border border-white/10 hover:bg-white/10 text-white font-bold rounded-xl transition-all"
                >
                  Log In
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AnimatedSection>
  );
}

/* ───────────────────────────────────────────
   STAGE 5: FEATURES BENTO GRID + HOW IT WORKS
   ─────────────────────────────────────────── */

function FeaturesBentoSection() {
  const handleSpotlight = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const el = e.currentTarget;
    const rect = el.getBoundingClientRect();
    el.style.setProperty('--mouse-x', `${e.clientX - rect.left}px`);
    el.style.setProperty('--mouse-y', `${e.clientY - rect.top}px`);
  }, []);

  return (
    <AnimatedSection id="how-it-works" className="py-24 relative" style={{ background: 'linear-gradient(180deg, #0A0A0F 0%, #0D0D18 100%)' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <motion.div variants={fadeUp} custom={0} className="inline-flex items-center px-3 py-1.5 rounded-full glass text-sm font-medium mb-4 text-blue-400">
            <Zap className="w-4 h-4 mr-2" />
            Powerful Features
          </motion.div>
          <motion.h2 variants={fadeUp} custom={0.1} className="text-3xl md:text-5xl font-bold text-white">
            Everything You Need to Land<br className="hidden sm:block" /> Your Dream Job
          </motion.h2>
          <motion.p variants={fadeUp} custom={0.2} className="mt-4 text-lg text-white/50 max-w-2xl mx-auto">
            Professional tools used by career experts, now available to everyone
          </motion.p>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {FEATURES_BENTO.map((feature, index) => (
            <motion.div
              key={feature.title}
              variants={scaleIn}
              custom={index * 0.08}
              onMouseMove={handleSpotlight}
              className={`bento-spotlight rounded-2xl p-6 glass border border-white/5 hover:border-indigo-500/20 transition-all duration-300 group cursor-default ${
                feature.size === 'large' ? 'lg:col-span-2' : ''
              }`}
            >
              <div className="relative z-10">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 flex items-center justify-center mb-4 group-hover:from-indigo-500/30 group-hover:to-purple-500/30 transition-colors">
                  <feature.icon className="h-6 w-6 text-indigo-400" />
                </div>
                <span className="inline-flex px-2.5 py-0.5 bg-indigo-500/10 text-indigo-400 text-xs font-semibold rounded-full mb-3">
                  {feature.highlight}
                </span>
                <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
                <p className="text-white/50 text-sm leading-relaxed">{feature.description}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* How It Works - Integrated Timeline */}
        <div className="mt-24">
          <div className="text-center mb-12">
            <motion.div variants={fadeUp} custom={0} className="inline-flex items-center px-3 py-1.5 rounded-full glass text-sm font-medium mb-4 text-emerald-400">
              <Clock className="w-4 h-4 mr-2" />
              Quick & Easy
            </motion.div>
            <motion.h2 variants={fadeUp} custom={0.1} className="text-3xl md:text-4xl font-bold text-white">
              Build Your Resume in 3 Simple Steps
            </motion.h2>
          </div>

          <div className="relative">
            {/* Connection line */}
            <div className="hidden md:block absolute top-20 left-[16.67%] right-[16.67%] h-px bg-gradient-to-r from-indigo-500/20 via-purple-500/20 to-emerald-500/20" />

            <div className="grid md:grid-cols-3 gap-8">
              {HOW_IT_WORKS.map((item, index) => (
                <motion.div
                  key={item.step}
                  variants={fadeUp}
                  custom={index * 0.15}
                  className="relative text-center group"
                >
                  <div className={`w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-br ${item.color} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    <item.icon className="h-8 w-8 text-white" />
                  </div>
                  <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-7 h-7 bg-[#0D0D18] rounded-full flex items-center justify-center text-xs font-bold text-indigo-400 border border-indigo-500/30">
                    {index + 1}
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-3">{item.title}</h3>
                  <p className="text-white/50 text-sm leading-relaxed max-w-xs mx-auto">{item.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AnimatedSection>
  );
}

/* ───────────────────────────────────────────
   STAGE 6: TRUST & CONVERSION
   ─────────────────────────────────────────── */

function TestimonialsSection() {
  return (
    <AnimatedSection className="py-24" style={{ background: '#0A0A0F' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <motion.div variants={fadeUp} custom={0} className="inline-flex items-center px-3 py-1.5 rounded-full glass text-sm font-medium mb-4 text-amber-400">
            <Star className="w-4 h-4 mr-2 fill-amber-400" />
            Success Stories
          </motion.div>
          <motion.h2 variants={fadeUp} custom={0.1} className="text-3xl md:text-5xl font-bold text-white">
            Loved by Professionals
          </motion.h2>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {TESTIMONIALS.map((testimonial, index) => (
            <motion.div
              key={testimonial.name}
              variants={fadeUp}
              custom={index * 0.1}
              className="glass rounded-2xl p-6 border border-white/5 hover:border-indigo-500/20 transition-all duration-300 group"
            >
              <div className="flex text-amber-400 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-current" />
                ))}
              </div>
              <Quote className="w-6 h-6 text-indigo-500/20 mb-3" />
              <p className="text-white/70 text-sm leading-relaxed mb-6">"{testimonial.content}"</p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white text-sm font-bold">
                  {testimonial.name.charAt(0)}
                </div>
                <div>
                  <p className="font-semibold text-white text-sm">{testimonial.name}</p>
                  <p className="text-xs text-white/40">{testimonial.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </AnimatedSection>
  );
}

function FAQSection() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <AnimatedSection className="py-24" style={{ background: 'linear-gradient(180deg, #0A0A0F 0%, #0D0D18 100%)' }}>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <motion.h2 variants={fadeUp} custom={0} className="text-3xl md:text-4xl font-bold text-white">
            Frequently Asked Questions
          </motion.h2>
          <motion.p variants={fadeUp} custom={0.1} className="mt-4 text-lg text-white/50">
            Everything you need to know about CV Forge
          </motion.p>
        </div>

        <div className="space-y-3">
          {FAQ_ITEMS.map((item, index) => (
            <motion.div
              key={index}
              variants={fadeUp}
              custom={index * 0.08}
              className="glass rounded-xl border border-white/5 overflow-hidden"
            >
              <button
                onClick={() => setOpenFaq(openFaq === index ? null : index)}
                className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-white/[0.02] transition-colors"
              >
                <span className="font-semibold text-white text-sm sm:text-base">{item.question}</span>
                <ChevronDown
                  className={`w-5 h-5 text-white/40 transition-transform duration-300 flex-shrink-0 ml-4 ${
                    openFaq === index ? 'rotate-180' : ''
                  }`}
                />
              </button>
              <AnimatePresence>
                {openFaq === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: [0.25, 0.4, 0.25, 1] }}
                  >
                    <div className="px-6 pb-4 text-white/50 text-sm leading-relaxed">
                      {item.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </AnimatedSection>
  );
}

function FinalCTASection() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [limitModal, setLimitModal] = useState({ show: false, existingTemplate: '' });

  const handleUseTemplate = async (templateId: string) => {
    if (user) {
      // Logged in: take directly to the editor to fill details
      navigate('/cv/new', { 
        state: { 
          isTemplate: true, 
          template: templateId,
          cvData: DEFAULT_SAMPLE_CV_DATA
        } 
      });
    } else {
      // Guest user: check single template limit!
      try {
        const localUsed = localStorage.getItem('guest_used_template');
        if (localUsed && localUsed !== templateId) {
          setLimitModal({ show: true, existingTemplate: localUsed });
          return;
        }

        // Verify against backend IP limits to prevent browser-switching bypass
        const status = await api.checkGuestStatus();
        if (status.used && status.template_id !== templateId) {
          localStorage.setItem('guest_used_template', status.template_id);
          setLimitModal({ show: true, existingTemplate: status.template_id });
          return;
        }

        // Record template selection on backend & local
        await api.recordGuestTemplate(templateId);
        localStorage.setItem('guest_used_template', templateId);

        // Take directly to guest editor
        navigate('/cv/edit/guest', { 
          state: { 
            isTemplate: true, 
            template: templateId,
            cvData: DEFAULT_SAMPLE_CV_DATA
          } 
        });
      } catch (err: any) {
        console.error("Guest limit check failed:", err);
        // Fallback to local storage if backend is offline or errors
        const localUsed = localStorage.getItem('guest_used_template');
        if (localUsed && localUsed !== templateId) {
          setLimitModal({ show: true, existingTemplate: localUsed });
        } else {
          localStorage.setItem('guest_used_template', templateId);
          navigate('/cv/edit/guest', { 
            state: { 
              isTemplate: true, 
              template: templateId,
              cvData: DEFAULT_SAMPLE_CV_DATA
            } 
          });
        }
      }
    }
  };

  return (
    <section className="py-24 relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #0D0D18 0%, #12122A 50%, #0D0D18 100%)' }}>
      {/* Ambient glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-600/10 rounded-full blur-[120px]" />
      </div>

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass text-white/70 text-sm font-medium mb-8">
            <Sparkles className="w-4 h-4 text-indigo-400" />
            Join 50,000+ professionals
          </div>

          <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
            Ready to Build a Resume<br className="hidden sm:block" /> That Gets Results?
          </h2>
          <p className="text-xl text-white/50 mb-10 max-w-2xl mx-auto">
            Start free today. No credit card required. Create unlimited resumes with AI-powered optimization.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => handleUseTemplate('tech-focused')}
              className="group w-full sm:w-auto inline-flex items-center justify-center px-10 py-5 text-lg font-semibold text-white bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl hover:from-indigo-500 hover:to-purple-500 transform hover:scale-[1.03] transition-all duration-300 animate-glow-pulse active:scale-[0.98]"
            >
              <CheckCircle className="mr-2 h-5 w-5" />
              Start Building Free
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </button>
            <div className="flex items-center gap-2 text-white/40">
              <Shield className="w-5 h-5" />
              <span className="text-sm">No credit card required</span>
            </div>
          </div>

          {/* Trust indicators */}
          <div className="mt-12 flex flex-wrap justify-center gap-8 text-white/30 text-sm">
            {['Free forever plan', '20+ templates', 'ATS-optimized', 'AI-powered'].map((item) => (
              <div key={item} className="flex items-center gap-2">
                <Check className="w-4 h-4" />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Guest Limit Modal */}
      {limitModal.show && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
          <div className="bg-slate-950/95 border border-white/10 p-8 rounded-3xl max-w-md w-full shadow-2xl relative animate-in fade-in zoom-in-95 duration-300">
            <div className="absolute top-4 right-4">
              <button 
                onClick={() => setLimitModal({ show: false, existingTemplate: '' })}
                className="text-white/40 hover:text-white p-2 rounded-lg hover:bg-white/5 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="w-16 h-16 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 rounded-2xl flex items-center justify-center mb-6">
              <Sparkles className="w-8 h-8 text-indigo-400 animate-pulse" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-3">Single Template Trial</h3>
            <p className="text-white/60 text-sm leading-relaxed mb-6">
              You are currently using the <span className="text-indigo-300 font-semibold uppercase">{limitModal.existingTemplate?.replace('-', ' ')}</span> template. 
              Before logging in, you can only create and edit one resume template.
            </p>
            <div className="flex flex-col gap-3">
              <button
                onClick={() => {
                  setLimitModal({ show: false, existingTemplate: '' });
                  navigate('/signup');
                }}
                className="w-full py-3.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold rounded-xl shadow-lg transition-all"
              >
                Sign Up to Unlock All Templates
              </button>
              <button
                onClick={() => {
                  setLimitModal({ show: false, existingTemplate: '' });
                  navigate('/login');
                }}
                className="w-full py-3.5 bg-white/5 border border-white/10 hover:bg-white/10 text-white font-bold rounded-xl transition-all"
              >
                Log In
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

function Footer() {
  return (
    <footer className="py-16" style={{ background: '#050508' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-8 mb-12">
          <div className="md:col-span-2">
            <div className="flex items-center mb-4">
              <FileText className="h-7 w-7 text-indigo-400" />
              <span className="ml-2 text-xl font-bold text-white">CV Forge</span>
            </div>
            <p className="text-white/30 max-w-md leading-relaxed text-sm">
              Build professional, ATS-optimized resumes in minutes with AI-powered tools.
              Trusted by 50,000+ professionals worldwide.
            </p>
            <div className="flex gap-3 mt-6">
              <a href="#" className="w-9 h-9 glass rounded-lg flex items-center justify-center hover:bg-white/10 transition-colors text-white/40 hover:text-white">
                <Globe className="w-4 h-4" />
              </a>
              <a href="#" className="w-9 h-9 glass rounded-lg flex items-center justify-center hover:bg-white/10 transition-colors text-white/40 hover:text-white">
                <Linkedin className="w-4 h-4" />
              </a>
            </div>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4 text-sm">Product</h4>
            <ul className="space-y-2.5 text-sm">
              <li><Link to="/templates" className="text-white/30 hover:text-white/60 transition-colors">Templates</Link></li>
              <li><a href="#how-it-works" className="text-white/30 hover:text-white/60 transition-colors">Features</a></li>
              <li><Link to="/signup" className="text-white/30 hover:text-white/60 transition-colors">Get Started</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4 text-sm">Resources</h4>
            <ul className="space-y-2.5 text-sm">
              <li><a href="#" className="text-white/30 hover:text-white/60 transition-colors">Resume Guide</a></li>
              <li><a href="#" className="text-white/30 hover:text-white/60 transition-colors">ATS Tips</a></li>
              <li><a href="#" className="text-white/30 hover:text-white/60 transition-colors">Career Blog</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center">
          <div className="text-sm text-white/20">
            © {new Date().getFullYear()} CV Forge. Build resumes that beat the bots.
          </div>
          <div className="flex gap-6 mt-4 md:mt-0 text-sm text-white/20">
            <a href="#" className="hover:text-white/40 transition-colors">Privacy</a>
            <a href="#" className="hover:text-white/40 transition-colors">Terms</a>
            <a href="#" className="hover:text-white/40 transition-colors">Contact</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

/* ═══════════════════════════════════════════
   MAIN HOMEPAGE COMPONENT
   ═══════════════════════════════════════════ */

export default function Home() {
  return (
    <div className="min-h-screen" style={{ background: '#0A0A0F' }}>
      <HeroSection />
      <SocialProofSection />
      <TransformationSection />
      <TemplateShowcase />
      <FeaturesBentoSection />
      <TestimonialsSection />
      <FAQSection />
      <FinalCTASection />
      <Footer />
    </div>
  );
}