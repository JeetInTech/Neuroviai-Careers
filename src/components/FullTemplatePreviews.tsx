import React from 'react';
import {
  Shield,
  Sparkles,
  TrendingUp,
  Mail,
  Phone,
  MapPin,
  Linkedin,
  Github,
  Globe,
  Briefcase,
  GraduationCap,
  Award,
  Terminal,
  Settings,
  Layers,
  CheckCircle,
  FileText
} from 'lucide-react';

// =============================================================================
// DATASET A: FULL STACK AI RESUME (Full Stack AI.tex)
// =============================================================================

const SANGRAMJEET_DATA = {
  name: "Sangramjeet Ghosh",
  title: "Full Stack AI Engineer",
  email: "sangramjeet47@gmail.com",
  phone: "+91 9059150937",
  location: "Hyderabad, India",
  linkedin: "linkedin.com/in/sangramjeetghosh",
  github: "github.com/JeetInTech",
  website: "sangramjeet.me",
  neuroviai: "neuroviai.com",
  summary: "Full Stack AI Engineer who builds and ships complete, production-grade AI-powered products — from React/Next.js frontends and FastAPI backends to LLM orchestration layers and cloud deployments. Designed and launched Neuroviai, a live SaaS with AI content pipelines, subscription billing, and multi-platform publishing. Strong focus on building real products: responsive UIs, performant APIs, and AI features users can actually interact with.",
  skills: {
    frontend: ['React 18', 'Next.js 14', 'TypeScript', 'Tailwind CSS', 'ShadCN/UI', 'Zustand', 'Framer Motion', 'Vite', 'HTML5', 'CSS3'],
    backend: ['FastAPI', 'Node.js', 'Express', 'REST APIs', 'WebSockets', 'JWT/OAuth 2.0', 'Webhook Handlers', 'Microservices', 'Async Python'],
    ai: ['Gemini API', 'OpenAI API', 'Groq', 'LangChain', 'LangGraph', 'RAG Pipelines', 'pgvector', 'Prompt Engineering', 'Multi-Agent Systems'],
    databases: ['PostgreSQL', 'Supabase', 'pgvector', 'Redis', 'MongoDB (basics)', 'SQLAlchemy'],
    devops: ['Docker', 'GitHub Actions CI/CD', 'AWS (EC2, S3, IAM)', 'Render', 'Netlify', 'Vercel', 'Nginx'],
    languages: ['Python', 'TypeScript', 'JavaScript', 'SQL', 'Bash']
  },
  experience: [
    {
      role: "Freelance Full Stack AI Developer",
      company: "Startup Founders",
      location: "Remote",
      period: "Aug 2025 - Present",
      bullets: [
        "Built end-to-end AI-powered web apps for 3+ startup founders: React/Next.js frontends, FastAPI backends, LLM pipelines, and cloud deployments with full handoff documentation.",
        "Delivered subscription billing (Razorpay), JWT/OAuth RBAC, real-time dashboards, and multi-platform API integrations; managed LLM costs via quota splitting and response caching."
      ]
    },
    {
      role: "Data Science Intern",
      company: "Inikola Technologies",
      location: "Hyderabad, India",
      period: "Mar 2025 - Dec 2025",
      bullets: [
        "Developed FastAPI NLP features (sentiment scoring, topic extraction) for CraftingBrain, a live content-tech platform serving real users.",
        "Containerized services with Docker, managed AWS (EC2, S3, IAM, Nginx), and shipped CI/CD pipelines via GitHub Actions for zero-downtime deploys."
      ]
    }
  ],
  projects: [
    {
      name: "Neuroviai — AI Social Media Automation SaaS",
      tech: "Next.js 14, FastAPI, PostgreSQL, Supabase, Gemini, OpenAI, Razorpay, Docker, GitHub Actions",
      period: "Mar 2025 - Present",
      link: "neuroviai.com",
      bullets: [
        "Built the complete product: Next.js 14 App Router frontend ('ServerWarmer' pattern, 1.46K+ organic impressions at 6.9% CTR), FastAPI microservice backend, and Supabase-backed database; 50+ daily active users, 99.5% uptime.",
        "Engineered a 4-tier LLM fallback (Gemini -> GROQ -> HuggingFace) for 99.7% generation reliability; autonomous engine posts across 5 platforms daily, cutting manual effort by 90%.",
        "Integrated 8+ APIs (LinkedIn, Twitter/X, Razorpay) with OAuth/webhook flows; token-economy billing with credit tracking; deployed across Render, Netlify, AWS S3 with GitHub Actions CI/CD."
      ]
    },
    {
      name: "Neurovia Careers — AI-Powered ATS Resume Builder",
      tech: "React 18, TypeScript, Vite, Tailwind CSS, FastAPI, Supabase, Groq LLM",
      period: "Nov 2025 - Present",
      link: "github.com/JeetInTech/CvForge-Online",
      bullets: [
        "Built a complete full-stack SaaS: React/TypeScript frontend with live CV preview and drag-and-drop section reordering; FastAPI backend with 15+ API endpoints (auth, CV CRUD, AI generation, PDF parse).",
        "Engineered a weighted ATS scoring engine (keyword 40%, completeness 35%, format 25%) targeting 90%+ compatibility across 15+ job categories; custom LaTeX export system with 4 professional templates.",
        "Groq LLM integration for AI-generated summaries, experience bullets, and skill suggestions; Supabase auth with cloud CV storage, shareable public links, and community showcase page."
      ]
    },
    {
      name: "Multi-Agent AI Data Analytics Platform",
      tech: "Python, PySide6 (Qt6), Groq, Gemini, Ollama, Scikit-learn, XGBoost, LightGBM, Matplotlib",
      period: "Oct 2025 - Present",
      bullets: [
        "Full desktop product: premium dark PySide6 UI (8 pages) backed by a 6-agent LLM pipeline (Profiler -> Cleaner -> Feature Engineer -> Model Selector -> Visualizer); 20+ chart types, 11 ML models, offline LLM failover."
      ]
    }
  ],
  education: {
    degree: "B.Tech in Computer Science & Engineering (AI & ML)",
    school: "Malla Reddy University, Hyderabad",
    period: "2022 - 2026 (Expected)",
    gpa: "GPA: 8.0 / 10.0",
    achievements: ["Winner — IDEATHON 2.0", "AWS, GCP, Coursera ML Certified"]
  }
};

// =============================================================================
// DATASET B: REAL ATS AI SOFTWARE SYSTEMS RESUME (AI Software Systems.tex)
// =============================================================================

const SANGRAMJEET_SYSTEMS_DATA = {
  name: "Sangramjeet Ghosh",
  title: "AI & Full-Stack Engineer",
  email: "sangramjeet47@gmail.com",
  phone: "+91 9059150937",
  location: "Hyderabad, India",
  linkedin: "linkedin.com/in/sangramjeetghosh",
  github: "github.com/JeetInTech",
  website: "sangramjeet.me",
  neuroviai: "neuroviai.com",
  summary: "AI & Full-Stack Engineer with production experience shipping SaaS platforms, autonomous AI systems, and automation pipelines. Launched Neuroviai — a live multi-provider LLM SaaS — and built Sebastian, an autonomous assistant with 59+ tools, real-time voice, OS control, and 110+ API integrations. Strong in FastAPI, LangGraph, PostgreSQL, React, and Docker. Seeking roles to build impactful technology at scale.",
  skills: {
    languages: ['Python', 'TypeScript', 'JavaScript', 'SQL', 'Bash'],
    ai: ['LangGraph', 'LangChain', 'Gemini API', 'OpenAI', 'Groq', 'RAG Pipelines', 'pgvector', 'Prompt Engineering', 'Multi-Agent Systems'],
    backend: ['FastAPI', 'REST APIs', 'WebSockets', 'JWT/OAuth 2.0', 'Webhooks', 'Microservices', 'Async Python'],
    frontend: ['React 18', 'Next.js 14', 'Tailwind CSS', 'Zustand', 'ShadCN/UI', 'Vite'],
    databases: ['PostgreSQL', 'Supabase', 'pgvector', 'Redis', 'SQLAlchemy'],
    devops: ['Docker', 'GitHub Actions CI/CD', 'AWS (EC2, S3, IAM)', 'Render', 'Netlify', 'Nginx', 'FFmpeg']
  },
  experience: [
    {
      role: "Freelance AI & Full-Stack Developer",
      company: "Startup Founders",
      location: "Remote",
      period: "Aug 2025 - Present",
      bullets: [
        "Delivered end-to-end SaaS MVPs for 3+ startup founders: architecture, development, deployment, and handoff docs.",
        "Built subscription billing (Razorpay), JWT/OAuth RBAC, multi-platform API integrations, and LLM cost optimization via quota splitting and response caching."
      ]
    },
    {
      role: "Data Science Intern",
      company: "Inikola Technologies",
      location: "Hyderabad, India",
      period: "Mar 2025 - Dec 2025",
      bullets: [
        "Built FastAPI NLP pipelines (sentiment scoring, topic extraction) for CraftingBrain, a live content platform.",
        "Managed AWS infrastructure (EC2, S3, IAM, Nginx), containerized services with Docker, and deployed CI/CD with GitHub Actions."
      ]
    }
  ],
  projects: [
    {
      name: "Neuroviai — AI Social Media Automation SaaS",
      tech: "Next.js 14, FastAPI, PostgreSQL, Supabase, Gemini, OpenAI, Razorpay, Docker",
      period: "Mar 2025 - Present",
      bullets: [
        "Architected a 4-tier LLM cascade (Gemini -> GROQ -> HuggingFace) achieving 99.7% generation reliability; autonomous engine posts across 5 platforms daily with 90% cost reduction.",
        "Integrated 8+ APIs (LinkedIn, Twitter/X, Razorpay, Supabase Auth) with OAuth flows, webhook listeners, and rate-limit handling; deployed as 4 microservices with GitHub Actions CI/CD and token-economy billing."
      ]
    },
    {
      name: "Sebastian — Autonomous AI Personal Assistant",
      tech: "Python, FastAPI, PostgreSQL, pgvector, Gemini Live, Groq, Playwright, Edge TTS",
      period: "Jan 2026 - Present",
      bullets: [
        "Built a 10-phase autonomous assistant with 59+ tools: OS & browser control, Gemini Live audio streaming, screen/camera vision, and 110+ external API integrations.",
        "Designed multi-layer memory (episodic, semantic, behavioral) with pgvector cosine search + time-decay; 3-tier safety gate (GREEN/YELLOW/RED) with audit logging and a Discord voice bridge via py-cord."
      ]
    },
    {
      name: "AI YouTube Shorts Automation Pipeline",
      tech: "Python, Ollama (local LLM), FFmpeg, edge-tts, Pexels API, YouTube Data API v3",
      period: "Jan 2026 - Present",
      bullets: [
        "End-to-end pipeline: trend scraping (Reddit, HN) -> LLM scripting -> voiceover -> FFmpeg video assembly -> YouTube upload; Task Scheduler enables unattended daily posting.",
        "Multi-channel mode generates 4+ videos per batch; script quality scorer filters low-confidence outputs before production."
      ]
    },
    {
      name: "Neurovia Careers — AI-Powered ATS Resume Builder",
      tech: "React 18, TypeScript, FastAPI, Supabase, Groq LLM, Vite",
      period: "Nov 2025 - Present",
      bullets: [
        "Weighted ATS scoring engine (keyword 40%, completeness 35%, format 25%) targeting 90%+ compatibility across 15+ job categories; custom LaTeX export system with 4 professional templates.",
        "Groq-powered AI bullet/summary generation; Supabase auth with cloud CV storage and shareable public links."
      ]
    }
  ],
  education: {
    degree: "B.Tech in Computer Science & Engineering (AI & ML)",
    school: "Malla Reddy University, Hyderabad",
    period: "2022 - 2026 (Expected)",
    gpa: "GPA: 8.0 / 10.0"
  }
};

interface FullPreviewProps {
  className?: string;
}

// Helper to render shared experience sections
const RenderExperience: React.FC<{ expList: typeof SANGRAMJEET_DATA.experience; themeColor: string }> = ({ expList, themeColor }) => (
  <div className="mb-5">
    <h2 className={`text-xs font-extrabold ${themeColor} mb-2.5 uppercase tracking-wider border-b border-slate-100 pb-1`}>Work Experience</h2>
    <div className="space-y-4">
      {expList.map((exp, idx) => (
        <div key={idx} className="space-y-1">
          <div className="flex justify-between items-start flex-wrap gap-1 font-semibold text-xs md:text-sm">
            <h3 className="text-slate-900 dark:text-white font-bold">{exp.role}</h3>
            <span className="text-slate-500 text-xs">{exp.period}</span>
          </div>
          <p className={`${themeColor} text-xs font-semibold`}>{exp.company} — {exp.location}</p>
          <ul className="text-slate-600 dark:text-slate-400 text-xs space-y-1 list-disc list-inside leading-relaxed pl-1">
            {exp.bullets.map((bullet, i) => (
              <li key={i}>{bullet}</li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  </div>
);

// Helper to render shared projects sections
const RenderProjects: React.FC<{ projList: typeof SANGRAMJEET_DATA.projects; themeColor: string }> = ({ projList, themeColor }) => (
  <div className="mb-5">
    <h2 className={`text-xs font-extrabold ${themeColor} mb-2.5 uppercase tracking-wider border-b border-slate-100 pb-1`}>Featured Projects</h2>
    <div className="space-y-4">
      {projList.map((proj, idx) => (
        <div key={idx} className="space-y-1">
          <div className="flex justify-between items-start flex-wrap gap-1 font-semibold text-xs md:text-sm">
            <h3 className="text-slate-900 dark:text-white font-bold">{proj.name}</h3>
            <span className="text-slate-500 text-xs">{proj.period}</span>
          </div>
          <p className="text-[10px] text-slate-500 font-mono">Tech Stack: {proj.tech || 'Python, React, Supabase'}</p>
          <ul className="text-slate-600 dark:text-slate-400 text-xs space-y-1 list-disc list-inside leading-relaxed pl-1">
            {proj.bullets.map((bullet, i) => (
              <li key={i}>{bullet}</li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  </div>
);

// Helper to render shared education sections
const RenderEducation: React.FC<{ edu: typeof SANGRAMJEET_DATA.education; themeColor: string }> = ({ edu, themeColor }) => (
  <div className="mb-4">
    <h2 className={`text-xs font-extrabold ${themeColor} mb-2 uppercase tracking-wider border-b border-slate-100 pb-1`}>Education & Credentials</h2>
    <div className="flex justify-between items-start flex-wrap gap-1 font-semibold text-xs md:text-sm">
      <div>
        <h3 className="text-slate-900 dark:text-white font-bold">{edu.degree}</h3>
        <p className="text-slate-500 text-xs font-medium">{edu.school}</p>
      </div>
      <div className="text-right">
        <span className="text-slate-500 text-xs block">{edu.period}</span>
        <span className={`${themeColor} text-xs font-bold`}>{edu.gpa}</span>
      </div>
    </div>
  </div>
);

// =============================================================================
// ENGINEERING & TECH
// =============================================================================

// 1. Software Engineer / Tech-Focused Layout
export const SoftwareEngineerFull: React.FC<FullPreviewProps> = ({ className = '' }) => (
  <div className={`w-full bg-white dark:bg-[#0D0D12]/40 rounded-lg shadow-xl p-6 md:p-8 text-slate-800 dark:text-slate-200 text-sm border border-slate-200/60 dark:border-white/5 ${className}`}>
    <div className="border-b-2 border-indigo-600 pb-4 mb-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">{SANGRAMJEET_DATA.name}</h1>
          <p className="text-indigo-600 dark:text-indigo-400 font-bold mt-0.5">{SANGRAMJEET_DATA.title}</p>
        </div>
        <div className="text-right text-xs text-slate-500 space-y-0.5 font-medium">
          <p>📧 {SANGRAMJEET_DATA.email}</p>
          <p>📱 {SANGRAMJEET_DATA.phone}</p>
          <p>📍 {SANGRAMJEET_DATA.location}</p>
        </div>
      </div>
      <div className="flex flex-wrap gap-4 text-slate-500 text-xs mt-3 font-semibold">
        <span className="flex items-center gap-1"><Github className="w-3 h-3 text-indigo-500" /> {SANGRAMJEET_DATA.github}</span>
        <span className="flex items-center gap-1"><Linkedin className="w-3 h-3 text-indigo-500" /> {SANGRAMJEET_DATA.linkedin}</span>
        <span className="flex items-center gap-1"><Globe className="w-3 h-3 text-indigo-500" /> {SANGRAMJEET_DATA.website}</span>
      </div>
    </div>

    <div className="mb-5">
      <h2 className="text-xs font-extrabold text-indigo-600 dark:text-indigo-400 mb-2 uppercase tracking-widest border-b border-indigo-50 dark:border-white/5 pb-1">Summary</h2>
      <p className="text-slate-600 dark:text-slate-300 text-xs md:text-sm leading-relaxed">{SANGRAMJEET_DATA.summary}</p>
    </div>

    <div className="mb-5">
      <h2 className="text-xs font-extrabold text-indigo-600 dark:text-indigo-400 mb-2.5 uppercase tracking-widest border-b border-indigo-50 dark:border-white/5 pb-1">Technical Stack</h2>
      <div className="flex flex-wrap gap-1.5">
        {[...SANGRAMJEET_DATA.skills.ai, ...SANGRAMJEET_DATA.skills.frontend, ...SANGRAMJEET_DATA.skills.backend].slice(0, 16).map(skill => (
          <span key={skill} className="bg-indigo-50/80 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 border border-indigo-100 dark:border-indigo-500/20 px-2 py-0.5 rounded-md text-xs font-semibold">{skill}</span>
        ))}
      </div>
    </div>

    <RenderExperience expList={SANGRAMJEET_DATA.experience} themeColor="text-indigo-600 dark:text-indigo-450" />
    <RenderProjects projList={SANGRAMJEET_DATA.projects} themeColor="text-indigo-600 dark:text-indigo-450" />
    <RenderEducation edu={SANGRAMJEET_DATA.education} themeColor="text-indigo-600 dark:text-indigo-450" />
  </div>
);

// 2. Mobile App Developer Layout
export const MobileAppDeveloperFull: React.FC<FullPreviewProps> = ({ className = '' }) => (
  <div className={`w-full bg-white dark:bg-[#0D0D12]/40 rounded-lg shadow-xl p-6 md:p-8 text-slate-800 dark:text-slate-200 text-sm border border-slate-200/60 dark:border-white/5 ${className}`}>
    <div className="border-b-2 border-emerald-500 pb-4 mb-6">
      <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">{SANGRAMJEET_DATA.name}</h1>
      <p className="text-emerald-600 dark:text-emerald-400 font-bold">Mobile & Full Stack AI Developer</p>
      <div className="flex flex-wrap gap-3 text-slate-500 text-xs mt-3 font-semibold">
        <span>📧 {SANGRAMJEET_DATA.email}</span>
        <span>📱 {SANGRAMJEET_DATA.phone}</span>
        <span>📍 {SANGRAMJEET_DATA.location}</span>
      </div>
    </div>

    <div className="grid grid-cols-3 gap-4 mb-5 bg-emerald-50/50 dark:bg-emerald-500/5 p-4 rounded-xl border border-emerald-100 dark:border-emerald-500/10 text-center shadow-xs">
      <div>
        <div className="text-xl font-extrabold text-emerald-600 dark:text-emerald-450">50+</div>
        <div className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-bold">Daily Active Users</div>
      </div>
      <div>
        <div className="text-xl font-extrabold text-emerald-600 dark:text-emerald-450">99.5%</div>
        <div className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-bold">Uptime SLA</div>
      </div>
      <div>
        <div className="text-xl font-extrabold text-emerald-600 dark:text-emerald-450">6-Agent</div>
        <div className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-bold">AI Pipelines</div>
      </div>
    </div>

    <div className="mb-5">
      <h2 className="text-xs font-bold text-emerald-600 dark:text-emerald-400 mb-2 uppercase tracking-wider">Professional Pitch</h2>
      <p className="text-slate-600 dark:text-slate-350 text-xs md:text-sm leading-relaxed">{SANGRAMJEET_DATA.summary}</p>
    </div>

    <div className="mb-5">
      <h2 className="text-xs font-bold text-emerald-600 dark:text-emerald-400 mb-2 uppercase tracking-wider">Mobile & Frontend Stack</h2>
      <div className="flex flex-wrap gap-1.5">
        {[...SANGRAMJEET_DATA.skills.frontend, ...SANGRAMJEET_DATA.skills.languages].map(tech => (
          <span key={tech} className="px-2.5 py-0.5 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-100 dark:border-emerald-500/20 rounded-md text-xs font-bold">{tech}</span>
        ))}
      </div>
    </div>

    <RenderExperience expList={SANGRAMJEET_DATA.experience} themeColor="text-emerald-600 dark:text-emerald-450" />
    <RenderProjects projList={SANGRAMJEET_DATA.projects} themeColor="text-emerald-600 dark:text-emerald-450" />
    <RenderEducation edu={SANGRAMJEET_DATA.education} themeColor="text-emerald-600 dark:text-emerald-450" />
  </div>
);

// 3. Systems Engineer Layout (Uses AI Software Systems data)
export const SystemsEngineerFull: React.FC<FullPreviewProps> = ({ className = '' }) => (
  <div className={`w-full bg-white dark:bg-[#0D0D12]/40 rounded-lg shadow-xl p-6 md:p-8 text-slate-800 dark:text-slate-200 text-sm border border-slate-200/60 dark:border-white/5 ${className}`}>
    <header className="bg-slate-850 dark:bg-slate-900 text-white p-5 rounded-xl mb-5 border border-slate-700 dark:border-white/5 shadow-md">
      <h1 className="text-2xl font-bold font-mono tracking-tight">{SANGRAMJEET_SYSTEMS_DATA.name}</h1>
      <p className="text-slate-300 font-semibold font-mono">{SANGRAMJEET_SYSTEMS_DATA.title} | Systems Architect</p>
      <div className="flex flex-wrap gap-4 text-slate-400 text-xs mt-3 font-semibold">
        <span>📧 {SANGRAMJEET_SYSTEMS_DATA.email}</span>
        <span>📱 {SANGRAMJEET_SYSTEMS_DATA.phone}</span>
        <span>📍 {SANGRAMJEET_SYSTEMS_DATA.location}</span>
      </div>
    </header>

    <div className="bg-slate-50 dark:bg-black/40 p-4 rounded-xl border border-slate-200 dark:border-white/5 mb-5 font-mono text-xs shadow-xs">
      <div className="text-slate-500 mb-2"># System Metrics & Deployment Stats</div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        <div className="text-slate-700 dark:text-slate-300">engine_fallback: <span className="text-green-600 dark:text-green-400 font-bold">99.7% cascade</span></div>
        <div className="text-slate-700 dark:text-slate-300">active_users: <span className="text-blue-600 dark:text-blue-400 font-bold">50+ daily DUA</span></div>
        <div className="text-slate-700 dark:text-slate-300">assistant_tools: <span className="text-emerald-600 dark:text-emerald-400 font-bold">59+ active tools</span></div>
        <div className="text-slate-700 dark:text-slate-300">infrastructure: <span className="text-amber-600 dark:text-amber-400 font-bold">AWS / Docker microservices</span></div>
      </div>
    </div>

    <div className="mb-5">
      <h2 className="text-xs font-extrabold text-slate-700 dark:text-slate-300 mb-2 tracking-widest font-mono"># PROFILE OVERVIEW</h2>
      <p className="text-slate-600 dark:text-slate-350 text-xs md:text-sm leading-relaxed">{SANGRAMJEET_SYSTEMS_DATA.summary}</p>
    </div>

    <div className="mb-5">
      <h2 className="text-xs font-extrabold text-slate-700 dark:text-slate-300 mb-2 tracking-widest font-mono"># INFRASTRUCTURE & BACKEND STACK</h2>
      <div className="flex flex-wrap gap-1.5">
        {[...SANGRAMJEET_SYSTEMS_DATA.skills.devops, ...SANGRAMJEET_SYSTEMS_DATA.skills.databases, ...SANGRAMJEET_SYSTEMS_DATA.skills.languages].map(tech => (
          <span key={tech} className="px-2 py-0.5 bg-slate-700 text-white rounded text-[11px] font-mono">{tech}</span>
        ))}
      </div>
    </div>

    <RenderExperience expList={SANGRAMJEET_SYSTEMS_DATA.experience} themeColor="text-slate-800 dark:text-slate-300 font-bold font-mono uppercase" />
    <RenderProjects projList={SANGRAMJEET_SYSTEMS_DATA.projects} themeColor="text-slate-800 dark:text-slate-300 font-bold font-mono uppercase" />
    <RenderEducation edu={SANGRAMJEET_SYSTEMS_DATA.education} themeColor="text-slate-800 dark:text-slate-300 font-bold font-mono uppercase" />
  </div>
);

// =============================================================================
// DATA & AI
// =============================================================================

// 4. Data Scientist Layout
export const DataScientistFull: React.FC<FullPreviewProps> = ({ className = '' }) => (
  <div className={`w-full bg-white dark:bg-[#0D0D12]/40 rounded-lg shadow-xl p-6 md:p-8 text-slate-800 dark:text-slate-200 text-sm border border-slate-200/60 dark:border-white/5 ${className}`}>
    <div className="border-l-4 border-purple-500 pl-4 mb-6">
      <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">{SANGRAMJEET_DATA.name}</h1>
      <p className="text-purple-600 dark:text-purple-400 font-bold mt-0.5">Data Scientist & AI Architect</p>
      <div className="flex flex-wrap gap-3 text-slate-500 text-xs mt-2 font-semibold">
        <span>📧 {SANGRAMJEET_DATA.email}</span>
        <span>📱 {SANGRAMJEET_DATA.phone}</span>
        <span>📍 {SANGRAMJEET_DATA.location}</span>
      </div>
    </div>

    <div className="bg-purple-50/50 dark:bg-purple-500/5 border border-purple-100 dark:border-purple-500/10 rounded-xl p-4 mb-5">
      <p className="text-slate-600 dark:text-slate-300 text-xs md:text-sm leading-relaxed">{SANGRAMJEET_DATA.summary}</p>
    </div>

    <div className="mb-5">
      <h2 className="text-xs font-extrabold text-purple-600 dark:text-purple-400 mb-3 uppercase tracking-wider">Models & Analytical Tools</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {[
          { name: 'Python', level: 95 },
          { name: 'Gemini / Groq', level: 90 },
          { name: 'SQL', level: 85 },
          { name: 'PostgreSQL / Supabase', level: 90 },
          { name: 'ML Models (XGBoost)', level: 80 },
          { name: 'RAG Pipelines', level: 85 },
        ].map(skill => (
          <div key={skill.name} className="flex items-center gap-2">
            <span className="text-xs text-slate-600 dark:text-slate-400 w-32 truncate">{skill.name}</span>
            <div className="flex-1 bg-purple-100 dark:bg-purple-500/20 rounded-full h-1.5">
              <div className="bg-purple-500 h-1.5 rounded-full" style={{ width: `${skill.level}%` }}></div>
            </div>
          </div>
        ))}
      </div>
    </div>

    <RenderExperience expList={SANGRAMJEET_DATA.experience} themeColor="text-purple-600 dark:text-purple-400" />
    <RenderProjects projList={SANGRAMJEET_DATA.projects} themeColor="text-purple-600 dark:text-purple-400" />
    <RenderEducation edu={SANGRAMJEET_DATA.education} themeColor="text-purple-600 dark:text-purple-400" />
  </div>
);

// 5. AI/ML Engineer Layout (Uses AI Software Systems data)
export const AIMLFull: React.FC<FullPreviewProps> = ({ className = '' }) => (
  <div className={`w-full bg-slate-900 rounded-lg shadow-xl p-6 md:p-8 text-slate-300 text-sm border border-slate-800 ${className}`}>
    <div className="text-center mb-6">
      <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">{SANGRAMJEET_SYSTEMS_DATA.name}</h1>
      <p className="text-teal-400 font-semibold mt-1 tracking-wide uppercase text-xs">{SANGRAMJEET_SYSTEMS_DATA.title}</p>
      <div className="flex justify-center flex-wrap gap-4 text-slate-400 text-xs mt-3 font-semibold">
        <span>📧 {SANGRAMJEET_SYSTEMS_DATA.email}</span>
        <span>📱 {SANGRAMJEET_SYSTEMS_DATA.phone}</span>
        <span>📍 {SANGRAMJEET_SYSTEMS_DATA.location}</span>
      </div>
    </div>

    <div className="bg-slate-800/80 rounded-xl p-4 mb-5 border border-teal-500/20">
      <p className="text-slate-300 text-xs md:text-sm leading-relaxed">{SANGRAMJEET_SYSTEMS_DATA.summary}</p>
    </div>

    <div className="mb-5">
      <h2 className="text-xs font-bold text-teal-400 mb-3 uppercase tracking-wider">AI/ML Orchestration Stack</h2>
      <div className="flex flex-wrap gap-1.5">
        {[...SANGRAMJEET_SYSTEMS_DATA.skills.ai, ...SANGRAMJEET_SYSTEMS_DATA.skills.languages].map(tech => (
          <span key={tech} className="px-2.5 py-0.5 bg-slate-800 border border-teal-500/20 text-teal-300 rounded-md text-xs font-semibold">
            {tech}
          </span>
        ))}
      </div>
    </div>

    <RenderExperience expList={SANGRAMJEET_SYSTEMS_DATA.experience} themeColor="text-teal-400" />
    <RenderProjects projList={SANGRAMJEET_SYSTEMS_DATA.projects} themeColor="text-teal-400" />
    <RenderEducation edu={SANGRAMJEET_SYSTEMS_DATA.education} themeColor="text-teal-400" />
  </div>
);

// =============================================================================
// CREATIVE
// =============================================================================

// 6. Graphic Designer Layout
export const GraphicDesignerFull: React.FC<FullPreviewProps> = ({ className = '' }) => (
  <div className={`w-full bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-[#0D0D12]/40 dark:to-slate-900/20 rounded-lg shadow-xl p-6 md:p-8 text-slate-700 dark:text-slate-300 text-sm border border-indigo-100 dark:border-white/5 ${className}`}>
    <header className="mb-6">
      <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-2xl mb-3 flex items-center justify-center shadow-md">
        <span className="text-white text-2xl font-bold">🚀</span>
      </div>
      <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">{SANGRAMJEET_DATA.name}</h1>
      <p className="text-indigo-600 dark:text-indigo-400 font-bold">{SANGRAMJEET_DATA.title}</p>
      <div className="flex flex-wrap gap-3 text-slate-500 text-xs mt-2 font-semibold">
        <span>📧 {SANGRAMJEET_DATA.email}</span>
        <span>📍 {SANGRAMJEET_DATA.location}</span>
      </div>
    </header>

    <div className="grid grid-cols-3 gap-3 mb-5">
      <div className="bg-white dark:bg-black/20 p-3 rounded-xl text-center shadow-sm border border-indigo-50 dark:border-white/5">
        <div className="text-lg font-bold text-indigo-600 dark:text-indigo-400">3+</div>
        <div className="text-[9px] text-slate-400 uppercase font-bold mt-0.5">Startups Launched</div>
      </div>
      <div className="bg-white dark:bg-black/20 p-3 rounded-xl text-center shadow-sm border border-indigo-50 dark:border-white/5">
        <div className="text-lg font-bold text-indigo-600 dark:text-indigo-400">50+</div>
        <div className="text-[9px] text-slate-400 uppercase font-bold mt-0.5">Daily Users</div>
      </div>
      <div className="bg-white dark:bg-black/20 p-3 rounded-xl text-center shadow-sm border border-indigo-50 dark:border-white/5">
        <div className="text-lg font-bold text-indigo-600 dark:text-indigo-400">90%+</div>
        <div className="text-[9px] text-slate-400 uppercase font-bold mt-0.5">ATS Vetting</div>
      </div>
    </div>

    <div className="mb-5">
      <h2 className="text-xs font-bold text-indigo-600 dark:text-indigo-400 mb-2 uppercase tracking-wide">Professional Pitch</h2>
      <p className="text-slate-600 dark:text-slate-350 text-xs md:text-sm leading-relaxed">{SANGRAMJEET_DATA.summary}</p>
    </div>

    <div className="mb-5">
      <h2 className="text-xs font-bold text-indigo-600 dark:text-indigo-400 mb-2 uppercase tracking-wide">Creative Stack</h2>
      <div className="flex flex-wrap gap-1.5">
        {[...SANGRAMJEET_DATA.skills.frontend, 'Framer Motion', 'FastAPI'].map(tool => (
          <span key={tool} className="px-2.5 py-0.5 bg-white dark:bg-slate-800 text-indigo-700 dark:text-indigo-300 border border-indigo-100 dark:border-indigo-500/20 rounded-md text-xs font-bold shadow-sm">{tool}</span>
        ))}
      </div>
    </div>

    <RenderExperience expList={SANGRAMJEET_DATA.experience} themeColor="text-indigo-600 dark:text-indigo-400" />
    <RenderProjects projList={SANGRAMJEET_DATA.projects} themeColor="text-indigo-600 dark:text-indigo-400" />
    <RenderEducation edu={SANGRAMJEET_DATA.education} themeColor="text-indigo-600 dark:text-indigo-400" />
  </div>
);

// 7. Video Editor Layout
export const VideoEditorFull: React.FC<FullPreviewProps> = ({ className = '' }) => (
  <div className={`w-full bg-slate-950 rounded-lg shadow-xl p-6 md:p-8 text-slate-300 text-sm border border-slate-900 ${className}`}>
    <header className="text-center mb-6">
      <h1 className="text-2xl font-extrabold text-white tracking-widest uppercase">{SANGRAMJEET_DATA.name}</h1>
      <p className="text-rose-500 font-bold tracking-wider text-xs uppercase mt-0.5">{SANGRAMJEET_DATA.title}</p>
      <div className="flex justify-center gap-3 text-slate-400 text-xs mt-3 font-semibold">
        <span>📧 {SANGRAMJEET_DATA.email}</span>
        <span>📍 {SANGRAMJEET_DATA.location}</span>
      </div>
    </header>

    <div className="bg-slate-900 rounded-xl p-4 mb-5 border border-slate-800">
      <p className="text-slate-400 text-xs leading-normal font-medium">{SANGRAMJEET_DATA.summary}</p>
    </div>

    <div className="mb-5">
      <h2 className="text-xs font-bold text-rose-500 mb-2 uppercase tracking-widest">Core Technical Suite</h2>
      <div className="flex flex-wrap gap-1.5">
        {[...SANGRAMJEET_DATA.skills.devops, ...SANGRAMJEET_DATA.skills.frontend].map(tool => (
          <span key={tool} className="px-2.5 py-0.5 bg-slate-900 border border-slate-800 text-slate-300 rounded-md text-xs font-semibold">{tool}</span>
        ))}
      </div>
    </div>

    <RenderExperience expList={SANGRAMJEET_DATA.experience} themeColor="text-rose-500" />
    <RenderProjects projList={SANGRAMJEET_DATA.projects} themeColor="text-rose-500" />
    <RenderEducation edu={SANGRAMJEET_DATA.education} themeColor="text-rose-500" />
  </div>
);

// 8. Content Writer Layout
export const ContentWriterFull: React.FC<FullPreviewProps> = ({ className = '' }) => (
  <div className={`w-full bg-white dark:bg-[#0D0D12]/40 rounded-lg shadow-xl overflow-hidden text-slate-800 dark:text-slate-200 text-sm border border-slate-200/60 dark:border-white/5 ${className}`}>
    <div className="h-2 bg-gradient-to-r from-pink-500 to-rose-500"></div>
    <div className="p-6 md:p-8">
      <header className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white font-serif tracking-tight">{SANGRAMJEET_DATA.name}</h1>
        <p className="text-pink-600 dark:text-pink-400 font-bold">{SANGRAMJEET_DATA.title}</p>
        <div className="flex flex-wrap gap-3 text-slate-500 text-xs mt-2 font-semibold">
          <span>📧 {SANGRAMJEET_DATA.email}</span>
          <span>📍 {SANGRAMJEET_DATA.location}</span>
        </div>
      </header>

      <div className="mb-5">
        <h2 className="text-xs font-bold text-pink-600 dark:text-pink-400 mb-2 uppercase tracking-widest font-serif border-b border-pink-50 dark:border-white/5 pb-1">AI Writing & Automation Summary</h2>
        <p className="text-slate-600 dark:text-slate-350 text-xs md:text-sm leading-relaxed">{SANGRAMJEET_DATA.summary}</p>
      </div>

      <div className="mb-5">
        <h2 className="text-xs font-bold text-pink-600 dark:text-pink-400 mb-2 uppercase tracking-widest font-serif border-b border-pink-50 dark:border-white/5 pb-1">LLM Orchestration</h2>
        <div className="flex flex-wrap gap-1.5">
          {[...SANGRAMJEET_DATA.skills.ai, 'FastAPI', 'Async Python'].map(skill => (
            <span key={skill} className="px-2 py-0.5 bg-pink-50 dark:bg-pink-500/10 text-pink-700 dark:text-pink-300 border border-pink-100 dark:border-pink-500/20 rounded-md text-xs font-semibold">{skill}</span>
          ))}
        </div>
      </div>

      <RenderExperience expList={SANGRAMJEET_DATA.experience} themeColor="text-pink-600 dark:text-pink-400" />
      <RenderProjects projList={SANGRAMJEET_DATA.projects} themeColor="text-pink-600 dark:text-pink-400" />
      <RenderEducation edu={SANGRAMJEET_DATA.education} themeColor="text-pink-600 dark:text-pink-400" />
    </div>
  </div>
);

// =============================================================================
// GENERAL
// =============================================================================

// 9. Fresher / Student Layout
export const FresherFull: React.FC<FullPreviewProps> = ({ className = '' }) => (
  <div className={`w-full bg-white dark:bg-[#0D0D12]/40 rounded-lg shadow-xl p-6 md:p-8 text-slate-800 dark:text-slate-200 text-sm border-t-4 border-cyan-500 border-x border-b border-slate-200 dark:border-white/5 ${className}`}>
    <div className="text-center mb-6">
      <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">{SANGRAMJEET_DATA.name}</h1>
      <p className="text-cyan-600 dark:text-cyan-400 font-bold mt-0.5">{SANGRAMJEET_DATA.education.degree}</p>
      <div className="flex justify-center flex-wrap gap-4 text-slate-500 text-xs mt-2 font-semibold">
        <span>📧 {SANGRAMJEET_DATA.email}</span>
        <span>📱 {SANGRAMJEET_DATA.phone}</span>
        <span>📍 {SANGRAMJEET_DATA.location}</span>
      </div>
    </div>

    <div className="bg-cyan-50/50 dark:bg-cyan-500/5 rounded-xl p-4 mb-5 border border-cyan-100 dark:border-cyan-500/10">
      <h2 className="text-xs font-bold text-cyan-700 dark:text-cyan-400 mb-2 uppercase tracking-wide flex items-center gap-1"><GraduationCap className="w-3.5 h-3.5" /> Education & Credentials</h2>
      <div className="flex justify-between items-start font-bold text-xs md:text-sm">
        <div>
          <h3>{SANGRAMJEET_DATA.education.degree}</h3>
          <p className="text-cyan-600 dark:text-cyan-400 text-xs font-semibold">{SANGRAMJEET_DATA.education.school}</p>
        </div>
        <span className="text-slate-500 text-xs">{SANGRAMJEET_DATA.education.period}</span>
      </div>
      <ul className="mt-2 text-slate-600 dark:text-slate-350 text-xs space-y-0.5 list-disc list-inside">
        <li>{SANGRAMJEET_DATA.education.gpa}</li>
        {SANGRAMJEET_DATA.education.achievements.map((ach, i) => (
          <li key={i}>{ach}</li>
        ))}
      </ul>
    </div>

    <div className="mb-5">
      <h2 className="text-xs font-bold text-cyan-600 dark:text-cyan-400 mb-2 uppercase tracking-wide">Developer Projects</h2>
      <div className="space-y-3">
        {SANGRAMJEET_DATA.projects.map((proj, idx) => (
          <div key={idx} className="bg-slate-50 dark:bg-slate-900/60 p-3 rounded-xl border border-slate-100 dark:border-white/5">
            <h3 className="font-bold text-slate-800 dark:text-white text-xs">{proj.name}</h3>
            <p className="text-cyan-600 dark:text-cyan-450 text-[10px] font-semibold">{proj.tech}</p>
            <ul className="text-slate-600 dark:text-slate-455 text-xs list-disc list-inside mt-1 leading-relaxed">
              {proj.bullets.map((b, idxB) => <li key={idxB}>{b}</li>)}
            </ul>
          </div>
        ))}
      </div>
    </div>

    <div>
      <h2 className="text-xs font-bold text-cyan-600 dark:text-cyan-400 mb-2 uppercase tracking-wide">Cloud & Machine Learning Skills</h2>
      <div className="flex flex-wrap gap-1.5">
        {[...SANGRAMJEET_DATA.skills.languages, ...SANGRAMJEET_DATA.skills.databases, ...SANGRAMJEET_DATA.skills.ai].map(skill => (
          <span key={skill} className="px-2.5 py-0.5 bg-cyan-50 dark:bg-cyan-500/10 text-cyan-700 dark:text-cyan-300 border border-cyan-100 dark:border-cyan-500/20 rounded-md text-xs font-bold shadow-sm">{skill}</span>
        ))}
      </div>
    </div>
  </div>
);

// 10. Freelancer Layout
export const FreelancerFull: React.FC<FullPreviewProps> = ({ className = '' }) => (
  <div className={`w-full bg-gradient-to-br from-rose-50 to-pink-50 dark:from-[#0D0D12]/40 dark:to-slate-900/20 rounded-lg shadow-xl p-6 md:p-8 text-slate-800 dark:text-slate-200 text-sm border border-rose-100 dark:border-white/5 ${className}`}>
    <div className="text-center mb-6">
      <div className="w-14 h-14 rounded-full bg-gradient-to-br from-pink-400 to-rose-500 mx-auto mb-3 flex items-center justify-center text-xl shadow-md text-white font-bold">
        🚀
      </div>
      <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">{SANGRAMJEET_DATA.name}</h1>
      <p className="text-rose-600 dark:text-rose-400 font-bold">{SANGRAMJEET_DATA.title}</p>
      <div className="flex justify-center flex-wrap gap-4 text-slate-500 text-xs mt-2 font-semibold">
        <span>📧 {SANGRAMJEET_DATA.email}</span>
        <span>🌐 {SANGRAMJEET_DATA.website}</span>
        <span>📍 {SANGRAMJEET_DATA.location}</span>
      </div>
    </div>

    <div className="grid grid-cols-3 gap-3 mb-5">
      <div className="bg-white dark:bg-black/20 rounded-xl p-3 text-center border border-rose-100/50 dark:border-white/5 shadow-sm">
        <p className="font-bold text-rose-600 dark:text-rose-400 text-lg">3+</p>
        <p className="text-slate-500 text-[10px] uppercase font-bold mt-0.5">SaaS Delivered</p>
      </div>
      <div className="bg-white dark:bg-black/20 rounded-xl p-3 text-center border border-rose-100/50 dark:border-white/5 shadow-sm">
        <p className="font-bold text-rose-600 dark:text-rose-400 text-lg">50+</p>
        <p className="text-slate-500 text-[10px] uppercase font-bold mt-0.5">Daily Clients</p>
      </div>
      <div className="bg-white dark:bg-black/20 rounded-xl p-3 text-center border border-rose-100/50 dark:border-white/5 shadow-sm">
        <p className="font-bold text-rose-600 dark:text-rose-400 text-lg">99%</p>
        <p className="text-slate-500 text-[10px] uppercase font-bold mt-0.5">Uptime SLA</p>
      </div>
    </div>

    <div className="mb-5">
      <h2 className="text-xs font-bold text-rose-600 dark:text-rose-400 mb-2 uppercase tracking-wide">Freelance Services</h2>
      <div className="flex flex-wrap gap-1.5">
        {[...SANGRAMJEET_DATA.skills.ai, ...SANGRAMJEET_DATA.skills.frontend].map(service => (
          <span key={service} className="px-2.5 py-0.5 bg-white dark:bg-slate-800 text-rose-600 dark:text-rose-300 border border-rose-100 dark:border-rose-500/20 rounded-md text-xs font-bold shadow-sm">{service}</span>
        ))}
      </div>
    </div>

    <RenderExperience expList={SANGRAMJEET_DATA.experience} themeColor="text-rose-600 dark:text-rose-400" />
    <RenderProjects projList={SANGRAMJEET_DATA.projects} themeColor="text-rose-600 dark:text-rose-400" />
    <RenderEducation edu={SANGRAMJEET_DATA.education} themeColor="text-rose-600 dark:text-rose-400" />
  </div>
);

// 11. Executive Layout
export const ExecutiveFull: React.FC<FullPreviewProps> = ({ className = '' }) => (
  <div className={`w-full bg-white dark:bg-[#0D0D12]/40 rounded-lg shadow-xl text-slate-800 dark:text-slate-200 text-sm overflow-hidden border border-slate-200/60 dark:border-white/5 ${className}`}>
    <div className="h-2 bg-slate-800 dark:bg-slate-700"></div>
    <div className="p-6 md:p-8">
      <header className="text-center mb-6">
        <h1 className="text-2xl font-serif font-extrabold text-slate-900 dark:text-white tracking-tight">{SANGRAMJEET_DATA.name}</h1>
        <p className="text-amber-600 dark:text-amber-400 font-bold tracking-widest uppercase text-xs mt-1">{SANGRAMJEET_DATA.title}</p>
        <div className="flex justify-center gap-4 text-slate-500 text-xs mt-3 font-semibold">
          <span>📧 {SANGRAMJEET_DATA.email}</span>
          <span>📍 {SANGRAMJEET_DATA.location}</span>
        </div>
      </header>

      <div className="text-center italic text-slate-650 dark:text-slate-300 text-xs md:text-sm mb-6 font-serif border-y border-slate-100 dark:border-white/5 py-4 px-4 leading-relaxed font-medium">
        "{SANGRAMJEET_DATA.summary}"
      </div>

      <div className="grid grid-cols-3 gap-4 mb-5 text-center bg-slate-50 dark:bg-slate-900/40 p-4 rounded-xl border border-slate-100 dark:border-white/5">
        <div>
          <div className="text-lg font-bold text-slate-800 dark:text-white">50+ Users</div>
          <div className="text-[10px] text-slate-455 font-bold uppercase mt-0.5">SaaS Launch</div>
        </div>
        <div>
          <div className="text-lg font-bold text-slate-800 dark:text-white">4-Tier</div>
          <div className="text-[10px] text-slate-455 font-bold uppercase mt-0.5">LLM Fallback</div>
        </div>
        <div>
          <div className="text-lg font-bold text-slate-800 dark:text-white">90% Less</div>
          <div className="text-[10px] text-slate-455 font-bold uppercase mt-0.5">Manual Effort</div>
        </div>
      </div>

      <div className="mb-5">
        <h2 className="text-xs font-bold text-amber-600 dark:text-amber-400 mb-2 uppercase tracking-wide">Key Technical Suite</h2>
        <div className="flex flex-wrap gap-1.5">
          {[...SANGRAMJEET_DATA.skills.ai, ...SANGRAMJEET_DATA.skills.frontend].map(skill => (
            <span key={skill} className="px-2.5 py-0.5 bg-amber-50 dark:bg-amber-500/10 text-amber-750 dark:text-amber-300 border border-amber-100 dark:border-amber-500/20 rounded-md text-xs font-bold">{skill}</span>
          ))}
        </div>
      </div>

      <RenderExperience expList={SANGRAMJEET_DATA.experience} themeColor="text-amber-600 dark:text-amber-400 font-serif" />
      <RenderProjects projList={SANGRAMJEET_DATA.projects} themeColor="text-amber-600 dark:text-amber-400 font-serif" />
      <RenderEducation edu={SANGRAMJEET_DATA.education} themeColor="text-amber-600 dark:text-amber-400 font-serif" />
    </div>
  </div>
);

// =============================================================================
// ADDITIONAL TEMPLATES (WIDELY ACCEPTED / RECRUITER-VETTED)
// =============================================================================

// 12. Project Manager Layout
export const ProjectManagerFull: React.FC<FullPreviewProps> = ({ className = '' }) => (
  <div className={`w-full bg-white dark:bg-[#0D0D12]/40 rounded-lg shadow-xl text-slate-800 dark:text-slate-200 text-sm overflow-hidden border border-slate-200/60 dark:border-white/5 ${className}`}>
    <div className="h-2 bg-gradient-to-r from-amber-500 to-orange-600"></div>
    <div className="p-6 md:p-8">
      <header className="mb-6">
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">{SANGRAMJEET_DATA.name}</h1>
        <p className="text-amber-600 dark:text-amber-400 font-bold">{SANGRAMJEET_DATA.title} & PM</p>
        <div className="flex flex-wrap gap-3 text-slate-500 text-xs mt-2 font-semibold">
          <span>📧 {SANGRAMJEET_DATA.email}</span>
          <span>📱 {SANGRAMJEET_DATA.phone}</span>
          <span>📍 {SANGRAMJEET_DATA.location}</span>
        </div>
      </header>

      <div className="bg-amber-50/50 dark:bg-amber-550/5 rounded-xl p-4 mb-5 border-l-4 border-amber-500">
        <p className="text-slate-700 dark:text-slate-300 text-xs md:text-sm leading-relaxed font-semibold">
          AI Engineer & Cross-Functional Project Owner. Orchestrated 3+ platform SaaS pipelines with 99.5% uptime.
        </p>
      </div>

      <div className="mb-5">
        <h2 className="text-xs font-bold text-amber-600 dark:text-amber-400 mb-2 uppercase tracking-wide">Agile & Process Tools</h2>
        <div className="flex flex-wrap gap-1.5">
          {[...SANGRAMJEET_DATA.skills.ai, 'Agile PM', 'GitHub Actions'].map(skill => (
            <span key={skill} className="px-2.5 py-0.5 bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-300 border border-amber-100 dark:border-amber-500/20 rounded-md text-xs font-bold">{skill}</span>
          ))}
        </div>
      </div>

      <RenderExperience expList={SANGRAMJEET_DATA.experience} themeColor="text-amber-600 dark:text-amber-400" />
      <RenderProjects projList={SANGRAMJEET_DATA.projects} themeColor="text-amber-600 dark:text-amber-400" />
      <RenderEducation edu={SANGRAMJEET_DATA.education} themeColor="text-amber-600 dark:text-amber-400" />
    </div>
  </div>
);

// 13. Business Analyst Layout
export const BusinessAnalystFull: React.FC<FullPreviewProps> = ({ className = '' }) => (
  <div className={`w-full bg-white dark:bg-[#0D0D12]/40 rounded-lg shadow-xl p-6 md:p-8 text-slate-800 dark:text-slate-200 text-sm border border-slate-200/60 dark:border-white/5 ${className}`}>
    <div className="border-b-2 border-emerald-500 pb-4 mb-6">
      <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">{SANGRAMJEET_DATA.name}</h1>
      <p className="text-emerald-600 dark:text-emerald-400 font-bold">{SANGRAMJEET_DATA.title}</p>
      <div className="flex flex-wrap gap-3 text-slate-500 text-xs mt-2 font-semibold">
        <span>📧 {SANGRAMJEET_DATA.email}</span>
        <span>📍 {SANGRAMJEET_DATA.location}</span>
      </div>
    </div>

    <div className="mb-5">
      <h2 className="text-xs font-bold text-emerald-600 dark:text-emerald-400 mb-2 uppercase tracking-wide font-mono"># PROFILE STATEMENT</h2>
      <p className="text-slate-650 dark:text-slate-300 text-xs leading-normal">{SANGRAMJEET_DATA.summary}</p>
    </div>

    <div className="mb-5">
      <h2 className="text-xs font-bold text-emerald-600 dark:text-emerald-400 mb-2 uppercase tracking-wide">Analytical Frameworks</h2>
      <div className="flex flex-wrap gap-1.5">
        {[...SANGRAMJEET_DATA.skills.databases, 'FastAPI NLP Algorithms', 'PostgreSQL DB Schemas', 'JWT authentication'].map(skill => (
          <span key={skill} className="px-2.5 py-0.5 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-100 dark:border-emerald-500/20 rounded-md text-xs font-bold">{skill}</span>
        ))}
      </div>
    </div>

    <RenderExperience expList={SANGRAMJEET_DATA.experience} themeColor="text-emerald-600 dark:text-emerald-400" />
    <RenderProjects projList={SANGRAMJEET_DATA.projects} themeColor="text-emerald-600 dark:text-emerald-400" />
    <RenderEducation edu={SANGRAMJEET_DATA.education} themeColor="text-emerald-600 dark:text-emerald-400" />
  </div>
);

// 14. Marketing Professional Layout
export const MarketingFull: React.FC<FullPreviewProps> = ({ className = '' }) => (
  <div className={`w-full bg-white dark:bg-[#0D0D12]/40 rounded-lg shadow-xl overflow-hidden text-slate-800 dark:text-slate-200 text-sm border border-slate-200/60 dark:border-white/5 ${className}`}>
    <div className="h-2 bg-gradient-to-r from-violet-500 to-fuchsia-500"></div>
    <div className="p-6 md:p-8">
      <header className="mb-6">
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">{SANGRAMJEET_DATA.name}</h1>
        <p className="text-violet-600 dark:text-violet-400 font-bold">Growth & Full Stack AI Developer</p>
        <div className="flex flex-wrap gap-3 text-slate-500 text-xs mt-2 font-semibold">
          <span>📧 {SANGRAMJEET_DATA.email}</span>
          <span>📍 {SANGRAMJEET_DATA.location}</span>
        </div>
      </header>

      <div className="grid grid-cols-3 gap-3 mb-5 text-center">
        <div className="bg-violet-50/50 dark:bg-violet-500/5 p-3 rounded-xl border border-violet-100 dark:border-violet-500/10 shadow-xs">
          <div className="text-lg font-extrabold text-violet-600 dark:text-violet-400">6.9%</div>
          <div className="text-[9px] text-slate-500 dark:text-slate-400 font-bold uppercase mt-0.5">CTR Performance</div>
        </div>
        <div className="bg-violet-50/50 dark:bg-violet-500/5 p-3 rounded-xl border border-violet-100 dark:border-violet-500/10 shadow-xs">
          <div className="text-lg font-extrabold text-violet-600 dark:text-violet-400">1.46K+</div>
          <div className="text-[9px] text-slate-500 dark:text-slate-400 font-bold uppercase mt-0.5">Impressions</div>
        </div>
        <div className="bg-violet-50/50 dark:bg-violet-500/5 p-3 rounded-xl border border-violet-100 dark:border-violet-500/10 shadow-xs">
          <div className="text-lg font-extrabold text-violet-600 dark:text-violet-400">50+ DAU</div>
          <div className="text-[9px] text-slate-500 dark:text-slate-400 font-bold uppercase mt-0.5">Organic Users</div>
        </div>
      </div>

      <div className="mb-5">
        <h2 className="text-xs font-bold text-violet-600 dark:text-violet-400 mb-2 uppercase tracking-wide">Automations & integrations</h2>
        <div className="flex flex-wrap gap-1.5">
          {[...SANGRAMJEET_DATA.skills.ai, ...SANGRAMJEET_DATA.skills.frontend].map(skill => (
            <span key={skill} className="px-2.5 py-0.5 bg-violet-50 dark:bg-violet-500/10 border border-violet-100 dark:border-violet-500/20 text-violet-700 dark:text-violet-300 rounded-md text-xs font-bold">{skill}</span>
          ))}
        </div>
      </div>

      <RenderExperience expList={SANGRAMJEET_DATA.experience} themeColor="text-violet-600 dark:text-violet-400" />
      <RenderProjects projList={SANGRAMJEET_DATA.projects} themeColor="text-violet-600 dark:text-violet-400" />
      <RenderEducation edu={SANGRAMJEET_DATA.education} themeColor="text-violet-600 dark:text-violet-400" />
    </div>
  </div>
);

// 15. Academic / Research Layout
export const AcademicFull: React.FC<FullPreviewProps> = ({ className = '' }) => (
  <div className={`w-full bg-white dark:bg-[#0D0D12]/40 rounded-lg shadow-xl p-6 md:p-8 text-slate-800 dark:text-slate-200 text-sm border border-slate-200/60 dark:border-white/5 ${className}`}>
    <header className="text-center mb-6 pb-4 border-b-2 border-slate-800 dark:border-white/10">
      <h1 className="text-2xl font-serif font-bold text-slate-900 dark:text-white tracking-tight">{SANGRAMJEET_DATA.name}</h1>
      <p className="text-slate-600 dark:text-slate-455 font-semibold">{SANGRAMJEET_DATA.title}</p>
      <div className="flex justify-center flex-wrap gap-4 text-slate-500 text-xs mt-2 font-semibold">
        <span>📧 {SANGRAMJEET_DATA.email}</span>
        <span>📍 {SANGRAMJEET_DATA.location}</span>
      </div>
    </header>

    <div className="mb-5">
      <h2 className="text-xs font-bold text-slate-850 dark:text-slate-300 mb-2 uppercase tracking-wide border-b border-slate-300 dark:border-white/5 pb-1 font-serif">Academic Abstract</h2>
      <p className="text-slate-600 dark:text-slate-350 text-xs leading-relaxed font-serif italic">"{SANGRAMJEET_DATA.summary}"</p>
    </div>

    <div className="mb-5">
      <h2 className="text-xs font-bold text-slate-850 dark:text-slate-300 mb-2 uppercase tracking-wide border-b border-slate-300 dark:border-white/5 pb-1 font-serif">Subject Expertise</h2>
      <div className="flex flex-wrap gap-1.5">
        {[...SANGRAMJEET_DATA.skills.ai, ...SANGRAMJEET_DATA.skills.languages].map(skill => (
          <span key={skill} className="px-2 py-0.5 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-white/5 text-slate-800 dark:text-slate-200 rounded-md text-xs font-bold">{skill}</span>
        ))}
      </div>
    </div>

    <RenderExperience expList={SANGRAMJEET_DATA.experience} themeColor="text-slate-800 dark:text-slate-300 font-serif" />
    <RenderProjects projList={SANGRAMJEET_DATA.projects} themeColor="text-slate-800 dark:text-slate-300 font-serif" />
    <RenderEducation edu={SANGRAMJEET_DATA.education} themeColor="text-slate-800 dark:text-slate-300 font-serif" />
  </div>
);

// 16. DevOps Engineer Layout (Uses AI Software Systems data)
export const DevOpsEngineerFull: React.FC<FullPreviewProps> = ({ className = '' }) => (
  <div className={`w-full bg-white dark:bg-[#0D0D12]/40 rounded-lg shadow-xl p-6 md:p-8 text-slate-800 dark:text-slate-200 text-sm border border-slate-200/60 dark:border-white/5 ${className}`}>
    <header className="bg-gradient-to-r from-orange-600 to-red-600 text-white p-5 rounded-xl mb-6 shadow-md border border-orange-500/20">
      <h1 className="text-2xl font-bold tracking-tight">{SANGRAMJEET_SYSTEMS_DATA.name}</h1>
      <p className="text-orange-100 font-semibold">{SANGRAMJEET_SYSTEMS_DATA.title} | DevOps Lead</p>
      <div className="flex flex-wrap gap-3 text-orange-50 text-xs mt-2 font-medium">
        <span>📧 {SANGRAMJEET_SYSTEMS_DATA.email}</span>
        <span>📍 {SANGRAMJEET_SYSTEMS_DATA.location}</span>
      </div>
    </header>

    <div className="bg-slate-50 dark:bg-black/40 p-4 rounded-xl border border-slate-200 dark:border-white/5 mb-5 font-mono text-xs shadow-xs">
      <div className="text-slate-500 mb-2"># Infrastructure Orchestrations</div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        <div className="text-slate-700 dark:text-slate-350">docker_containers: <span className="text-green-600 dark:text-green-400 font-bold">FastAPI, Nginx, FFmpeg</span></div>
        <div className="text-slate-700 dark:text-slate-350">ci_cd_deployment: <span className="text-blue-600 dark:text-blue-400 font-bold">GitHub Actions</span></div>
        <div className="text-slate-700 dark:text-slate-350">hosting: <span className="text-orange-600 dark:text-orange-400 font-bold">Render / Netlify / AWS</span></div>
        <div className="text-slate-700 dark:text-slate-350">uptime_reliability: <span className="text-emerald-600 dark:text-emerald-400 font-bold">99.7% fallback</span></div>
      </div>
    </div>

    <div className="mb-5">
      <h2 className="text-xs font-bold text-orange-600 dark:text-orange-400 mb-2 uppercase tracking-wide">Continuous Integration & Ops Stack</h2>
      <div className="flex flex-wrap gap-1.5">
        {[...SANGRAMJEET_SYSTEMS_DATA.skills.devops, ...SANGRAMJEET_SYSTEMS_DATA.skills.databases, ...SANGRAMJEET_SYSTEMS_DATA.skills.languages].map(tech => (
          <span key={tech} className="px-2.5 py-0.5 bg-orange-50 dark:bg-orange-500/10 text-orange-700 dark:text-orange-300 border border-orange-100 dark:border-orange-500/20 rounded-md text-xs font-bold">{tech}</span>
        ))}
      </div>
    </div>

    <RenderExperience expList={SANGRAMJEET_SYSTEMS_DATA.experience} themeColor="text-orange-600 dark:text-orange-400" />
    <RenderProjects projList={SANGRAMJEET_SYSTEMS_DATA.projects} themeColor="text-orange-600 dark:text-orange-400" />
    <RenderEducation edu={SANGRAMJEET_SYSTEMS_DATA.education} themeColor="text-orange-600 dark:text-orange-400" />
  </div>
);
