import React from 'react';

// ============================================
// FULL-SIZE CV PREVIEW COMPONENTS
// Shows complete template demos for Home page & Portfolio
// 
// Only includes previews for the 15 kept template IDs.
// Removed templates have been consolidated (see ARCHITECTURE.md).
// ============================================

interface FullPreviewProps {
  className?: string;
}

// =============================================================================
// ENGINEERING & TECH
// =============================================================================

// Software Engineer Full Preview (also used for tech-focused)
export const SoftwareEngineerFull: React.FC<FullPreviewProps> = ({ className = '' }) => (
  <div className={`w-full bg-white rounded-lg shadow-xl p-6 md:p-8 text-sm ${className}`}>
    <div className="border-b-2 border-indigo-500 pb-4 mb-6">
      <h1 className="text-xl md:text-2xl font-bold text-gray-800">John Developer</h1>
      <p className="text-indigo-600 font-medium">Senior Software Engineer</p>
      <div className="flex flex-wrap gap-3 text-gray-500 text-xs md:text-sm mt-2">
        <span>📧 john.developer@email.com</span>
        <span>📱 +1 (555) 123-4567</span>
        <span>🔗 github.com/johndev</span>
        <span>📍 San Francisco, CA</span>
      </div>
    </div>
    <div className="mb-5">
      <h2 className="text-sm md:text-base font-bold text-indigo-600 mb-2 uppercase tracking-wide">Professional Summary</h2>
      <p className="text-gray-600 text-xs md:text-sm">
        Results-driven Senior Software Engineer with 6+ years of experience building scalable web applications. 
        Expert in React, TypeScript, and Node.js with a track record of leading high-performance teams and 
        delivering projects that increased user engagement by 40%.
      </p>
    </div>
    <div className="mb-5">
      <h2 className="text-sm md:text-base font-bold text-indigo-600 mb-2 uppercase tracking-wide">Technical Skills</h2>
      <div className="flex flex-wrap gap-1.5">
        {['React', 'TypeScript', 'Node.js', 'Python', 'AWS', 'Docker', 'PostgreSQL', 'GraphQL', 'Redis', 'Kubernetes'].map(skill => (
          <span key={skill} className="bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full text-xs font-medium">{skill}</span>
        ))}
      </div>
    </div>
    <div className="mb-5">
      <h2 className="text-sm md:text-base font-bold text-indigo-600 mb-2 uppercase tracking-wide">Experience</h2>
      <div className="space-y-3">
        <div>
          <div className="flex justify-between items-start flex-wrap gap-1">
            <div>
              <h3 className="font-semibold text-gray-800 text-sm">Senior Software Engineer</h3>
              <p className="text-indigo-600 text-xs">TechCorp Inc.</p>
            </div>
            <span className="text-gray-500 text-xs">2022 - Present</span>
          </div>
          <ul className="mt-1 text-gray-600 text-xs space-y-0.5 list-disc list-inside">
            <li>Led a team of 5 engineers to deliver microservices architecture serving 1M+ users</li>
            <li>Reduced API response time by 60% through optimization and caching strategies</li>
          </ul>
        </div>
        <div>
          <div className="flex justify-between items-start flex-wrap gap-1">
            <div>
              <h3 className="font-semibold text-gray-800 text-sm">Software Engineer</h3>
              <p className="text-indigo-600 text-xs">StartupXYZ</p>
            </div>
            <span className="text-gray-500 text-xs">2019 - 2022</span>
          </div>
          <ul className="mt-1 text-gray-600 text-xs space-y-0.5 list-disc list-inside">
            <li>Built real-time collaboration features using WebSockets and Redis</li>
            <li>Developed RESTful APIs handling 10K+ requests per minute</li>
          </ul>
        </div>
      </div>
    </div>
    <div className="mb-5">
      <h2 className="text-sm md:text-base font-bold text-indigo-600 mb-2 uppercase tracking-wide">Education</h2>
      <div className="flex justify-between flex-wrap gap-1">
        <div>
          <h3 className="font-semibold text-gray-800 text-sm">B.S. Computer Science</h3>
          <p className="text-gray-600 text-xs">Stanford University</p>
        </div>
        <span className="text-gray-500 text-xs">2015 - 2019</span>
      </div>
    </div>
    <div>
      <h2 className="text-sm md:text-base font-bold text-indigo-600 mb-2 uppercase tracking-wide">Achievements</h2>
      <ul className="text-gray-600 text-xs space-y-1 list-disc list-inside">
        <li>Scaled platform to handle 1M+ daily active users</li>
        <li>Reduced cloud infrastructure costs by $200K annually</li>
      </ul>
    </div>
  </div>
);

// Mobile App Developer Full Preview
export const MobileAppDeveloperFull: React.FC<FullPreviewProps> = ({ className = '' }) => (
  <div className={`w-full bg-white rounded-lg shadow-xl p-6 md:p-8 text-sm ${className}`}>
    <div className="border-b-2 border-green-500 pb-4 mb-6">
      <h1 className="text-xl md:text-2xl font-bold text-gray-800">Lisa Mobile</h1>
      <p className="text-green-600 font-medium">Senior Mobile Developer</p>
      <div className="flex flex-wrap gap-3 text-gray-500 text-xs mt-2">
        <span>📧 lisa@mobiledev.io</span>
        <span>📱 +1 (555) 456-7890</span>
        <span>🍎 App Store: 5 Apps</span>
        <span>🤖 Play Store: 8 Apps</span>
      </div>
    </div>
    <div className="grid grid-cols-3 gap-4 mb-5 bg-green-50 p-4 rounded-lg">
      <div className="text-center">
        <div className="text-2xl font-bold text-green-600">2M+</div>
        <div className="text-xs text-gray-500">Downloads</div>
      </div>
      <div className="text-center">
        <div className="text-2xl font-bold text-green-600">4.8★</div>
        <div className="text-xs text-gray-500">Avg Rating</div>
      </div>
      <div className="text-center">
        <div className="text-2xl font-bold text-green-600">13</div>
        <div className="text-xs text-gray-500">Published Apps</div>
      </div>
    </div>
    <div className="bg-green-50 rounded-lg p-4 mb-5">
      <p className="text-gray-700 text-xs md:text-sm">
        Senior Mobile Developer with 6+ years building consumer-facing iOS and Android applications.
        13 published apps with 2M+ combined downloads and 4.8★ average rating across App Store and Play Store.
      </p>
    </div>
    <div className="mb-5">
      <h2 className="text-sm md:text-base font-bold text-green-600 mb-2 uppercase tracking-wide">Mobile Stack</h2>
      <div className="flex flex-wrap gap-2">
        {['Swift', 'Kotlin', 'React Native', 'Flutter', 'SwiftUI', 'Jetpack Compose'].map(tech => (
          <span key={tech} className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">{tech}</span>
        ))}
      </div>
    </div>
    <div className="mb-5">
      <h2 className="text-sm md:text-base font-bold text-green-600 mb-2 uppercase tracking-wide">Featured Apps</h2>
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xl">📱</span>
            <h3 className="font-semibold text-gray-800 text-sm">FitTrack Pro</h3>
          </div>
          <p className="text-xs text-gray-500">500K+ downloads • 4.9★</p>
        </div>
        <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xl">💰</span>
            <h3 className="font-semibold text-gray-800 text-sm">BudgetBuddy</h3>
          </div>
          <p className="text-xs text-gray-500">300K+ downloads • 4.7★</p>
        </div>
      </div>
    </div>
    <div className="mb-5">
      <h2 className="text-sm md:text-base font-bold text-green-600 mb-2 uppercase tracking-wide">Experience</h2>
      <div className="space-y-2">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-semibold text-gray-800 text-sm">Lead Mobile Developer</h3>
            <p className="text-green-600 text-xs">AppStudio Inc.</p>
          </div>
          <span className="text-gray-500 text-xs">2021 - Present</span>
        </div>
        <ul className="text-gray-600 text-xs space-y-0.5 list-disc list-inside">
          <li>Led team building cross-platform apps with Flutter</li>
          <li>Achieved 99.9% crash-free sessions</li>
        </ul>
      </div>
    </div>
    <div>
      <h2 className="text-sm md:text-base font-bold text-green-600 mb-2 uppercase tracking-wide">Education</h2>
      <div className="flex justify-between flex-wrap gap-1">
        <div>
          <h3 className="font-semibold text-gray-800 text-sm">B.S. Computer Science</h3>
          <p className="text-green-600 text-xs">University of Washington</p>
        </div>
        <span className="text-gray-500 text-xs">2015 - 2019</span>
      </div>
    </div>
  </div>
);

// Systems Engineer Full Preview
export const SystemsEngineerFull: React.FC<FullPreviewProps> = ({ className = '' }) => (
  <div className={`w-full bg-slate-100 rounded-lg shadow-xl p-6 md:p-8 text-sm ${className}`}>
    <header className="bg-slate-800 text-white p-4 rounded-lg mb-6 -mx-2">
      <h1 className="text-xl font-bold font-mono">Steve Systems</h1>
      <p className="text-slate-400">Senior Systems Engineer</p>
      <div className="flex flex-wrap gap-3 text-slate-500 text-xs mt-2">
        <span>📧 steve@infra.io</span>
        <span>☁️ AWS Solutions Architect</span>
      </div>
    </header>
    <div className="bg-white p-4 rounded border mb-5 font-mono text-xs">
      <div className="text-slate-500 mb-2"># System Metrics</div>
      <div className="grid grid-cols-2 gap-2">
        <div className="text-slate-700">uptime: <span className="text-green-600">99.99%</span></div>
        <div className="text-slate-700">servers: <span className="text-blue-600">500+</span></div>
        <div className="text-slate-700">incidents: <span className="text-red-600">-60%</span></div>
        <div className="text-slate-700">cost: <span className="text-amber-600">-40%</span></div>
      </div>
    </div>
    <div className="mb-5">
      <h2 className="text-sm font-bold text-slate-700 mb-2">SUMMARY</h2>
      <p className="text-slate-600 text-xs md:text-sm">
        Systems Engineer with 10+ years designing and maintaining large-scale distributed infrastructure.
        Expert in cloud architecture, container orchestration, and infrastructure-as-code with proven ability to
        achieve 99.99% uptime across 500+ server fleets.
      </p>
    </div>
    <div className="mb-5">
      <h2 className="text-sm font-bold text-slate-700 mb-2">INFRASTRUCTURE</h2>
      <div className="flex flex-wrap gap-2">
        {['AWS', 'Kubernetes', 'Terraform', 'Ansible', 'Linux', 'Docker', 'Prometheus', 'Grafana'].map(tech => (
          <span key={tech} className="px-2 py-1 bg-slate-700 text-white rounded text-xs font-mono">{tech}</span>
        ))}
      </div>
    </div>
    <div className="mb-5">
      <h2 className="text-sm font-bold text-slate-700 mb-2">EXPERIENCE</h2>
      <div className="space-y-3">
        <div>
          <div className="flex justify-between items-start flex-wrap gap-1">
            <div>
              <h3 className="font-semibold text-slate-800 text-sm">Senior Systems Engineer</h3>
              <p className="text-slate-600 text-xs">Amazon Web Services</p>
            </div>
            <span className="text-slate-500 text-xs">2021 - Present</span>
          </div>
          <ul className="mt-1 text-slate-600 text-xs space-y-0.5 list-disc list-inside">
            <li>Managed fleet of 500+ EC2 instances with 99.99% uptime SLA</li>
            <li>Reduced infrastructure costs by 40% through right-sizing and spot instances</li>
            <li>Built automated disaster recovery system with 15-minute RTO</li>
          </ul>
        </div>
        <div>
          <div className="flex justify-between items-start flex-wrap gap-1">
            <div>
              <h3 className="font-semibold text-slate-800 text-sm">Systems Administrator</h3>
              <p className="text-slate-600 text-xs">Cloudflare</p>
            </div>
            <span className="text-slate-500 text-xs">2018 - 2021</span>
          </div>
          <ul className="mt-1 text-slate-600 text-xs space-y-0.5 list-disc list-inside">
            <li>Migrated legacy infrastructure to Kubernetes, reducing downtime by 60%</li>
            <li>Implemented monitoring stack handling 1M+ metrics per minute</li>
          </ul>
        </div>
      </div>
    </div>
    <div className="mb-5">
      <h2 className="text-sm font-bold text-slate-700 mb-2">EDUCATION</h2>
      <div className="flex justify-between flex-wrap gap-1">
        <div>
          <h3 className="font-semibold text-slate-800 text-sm">B.S. Computer Engineering</h3>
          <p className="text-slate-600 text-xs">Georgia Institute of Technology</p>
        </div>
        <span className="text-slate-500 text-xs">2014 - 2018</span>
      </div>
    </div>
    <div>
      <h2 className="text-sm font-bold text-slate-700 mb-2">CERTIFICATIONS</h2>
      <ul className="text-slate-600 text-xs space-y-1 list-disc list-inside">
        <li>AWS Solutions Architect Professional</li>
        <li>CKA (Certified Kubernetes Administrator)</li>
        <li>HashiCorp Certified Terraform Associate</li>
      </ul>
    </div>
  </div>
);

// =============================================================================
// DATA & AI
// =============================================================================

// Data Scientist Full Preview
export const DataScientistFull: React.FC<FullPreviewProps> = ({ className = '' }) => (
  <div className={`w-full bg-white rounded-lg shadow-xl p-6 md:p-8 text-sm ${className}`}>
    <div className="border-l-4 border-purple-500 pl-4 mb-6">
      <h1 className="text-xl md:text-2xl font-bold text-gray-800">Sarah Analytics</h1>
      <p className="text-purple-600 font-medium">Senior Data Scientist | ML Engineer</p>
      <div className="flex flex-wrap gap-3 text-gray-500 text-xs mt-2">
        <span>📧 sarah@analytics.io</span>
        <span>📱 +1 (555) 234-5678</span>
        <span>🔗 kaggle.com/sarah</span>
        <span>📍 New York, NY</span>
      </div>
    </div>
    <div className="bg-purple-50 rounded-lg p-4 mb-5">
      <p className="text-gray-700 text-xs md:text-sm">
        Data Scientist with 7+ years of experience transforming complex datasets into actionable business insights. 
        Specialized in machine learning, predictive modeling, and data visualization.
      </p>
    </div>
    <div className="mb-5">
      <h2 className="text-sm md:text-base font-bold text-purple-600 mb-3 uppercase tracking-wide">Tools & Technologies</h2>
      <div className="grid grid-cols-2 gap-2">
        {[
          { name: 'Python', level: 95 },
          { name: 'SQL', level: 90 },
          { name: 'TensorFlow', level: 85 },
          { name: 'Tableau', level: 80 },
          { name: 'Spark', level: 75 },
          { name: 'R', level: 70 },
        ].map(skill => (
          <div key={skill.name} className="flex items-center gap-2">
            <span className="text-xs text-gray-600 w-20">{skill.name}</span>
            <div className="flex-1 bg-purple-100 rounded-full h-2">
              <div className="bg-purple-500 h-2 rounded-full" style={{ width: `${skill.level}%` }}></div>
            </div>
          </div>
        ))}
      </div>
    </div>
    <div className="mb-5">
      <h2 className="text-sm md:text-base font-bold text-purple-600 mb-2 uppercase tracking-wide">Experience</h2>
      <div className="space-y-3">
        <div>
          <div className="flex justify-between items-start flex-wrap gap-1">
            <div>
              <h3 className="font-semibold text-gray-800 text-sm">Senior Data Scientist</h3>
              <p className="text-purple-600 text-xs">DataCo Analytics</p>
            </div>
            <span className="text-gray-500 text-xs">2021 - Present</span>
          </div>
          <ul className="mt-1 text-gray-600 text-xs space-y-0.5 list-disc list-inside">
            <li>Built ML model that increased revenue by 23%</li>
            <li>Developed real-time analytics pipeline processing 1M+ events/day</li>
          </ul>
        </div>
      </div>
    </div>
    <div>
      <h2 className="text-sm md:text-base font-bold text-purple-600 mb-2 uppercase tracking-wide">Achievements</h2>
      <ul className="text-gray-600 text-xs space-y-1 list-disc list-inside">
        <li>Increased customer retention by 35% with churn prediction model</li>
        <li>Published research paper in top ML conference</li>
      </ul>
    </div>
    <div>
      <h2 className="text-sm md:text-base font-bold text-purple-600 mb-2 uppercase tracking-wide">Education</h2>
      <div className="space-y-2">
        <div className="flex justify-between flex-wrap gap-1">
          <div>
            <h3 className="font-semibold text-gray-800 text-sm">M.S. Data Science</h3>
            <p className="text-gray-600 text-xs">Columbia University</p>
          </div>
          <span className="text-gray-500 text-xs">2016 - 2018</span>
        </div>
        <div className="flex justify-between flex-wrap gap-1">
          <div>
            <h3 className="font-semibold text-gray-800 text-sm">B.S. Mathematics</h3>
            <p className="text-gray-600 text-xs">UC Berkeley</p>
          </div>
          <span className="text-gray-500 text-xs">2012 - 2016</span>
        </div>
      </div>
    </div>
  </div>
);

// AI/ML Engineer Full Preview
export const AIMLFull: React.FC<FullPreviewProps> = ({ className = '' }) => (
  <div className={`w-full bg-slate-900 rounded-lg shadow-xl p-6 md:p-8 text-sm ${className}`}>
    <div className="text-center mb-6">
      <h1 className="text-2xl md:text-3xl font-bold text-white">Alex Chen</h1>
      <p className="text-teal-400 font-medium">AI/ML Research Engineer</p>
      <div className="flex justify-center flex-wrap gap-4 text-slate-400 text-xs mt-3">
        <span>📧 alex@ai-research.io</span>
        <span>📱 +1 (555) 345-6789</span>
        <span>🔗 arxiv.org/a/alexchen</span>
        <span>📍 San Francisco, CA</span>
      </div>
    </div>
    <div className="bg-slate-800 rounded-lg p-4 mb-5 border border-teal-500/30">
      <p className="text-slate-300 text-xs md:text-sm">
        AI/ML Research Engineer with expertise in large language models, computer vision, and reinforcement learning. 
        Published 15+ papers in top venues (NeurIPS, ICML, CVPR). Led development of models deployed to 100M+ users.
      </p>
    </div>
    <div className="mb-5">
      <h2 className="text-sm md:text-base font-bold text-teal-400 mb-3 uppercase tracking-wide">ML Stack</h2>
      <div className="flex flex-wrap gap-2">
        {['PyTorch', 'JAX', 'TensorFlow', 'Hugging Face', 'LangChain', 'CUDA', 'Triton', 'MLflow'].map(tech => (
          <span key={tech} className="px-3 py-1 bg-slate-800 border border-teal-500/30 text-teal-400 rounded-full text-xs font-medium">
            {tech}
          </span>
        ))}
      </div>
    </div>
    <div className="mb-5">
      <h2 className="text-sm md:text-base font-bold text-teal-400 mb-3 uppercase tracking-wide">Experience</h2>
      <div className="space-y-3">
        <div className="bg-slate-800/50 rounded-lg p-3">
          <div className="flex justify-between items-start flex-wrap gap-1">
            <div>
              <h3 className="font-semibold text-white text-sm">Senior ML Engineer</h3>
              <p className="text-teal-400 text-xs">OpenAI</p>
            </div>
            <span className="text-slate-500 text-xs">2022 - Present</span>
          </div>
          <ul className="mt-2 text-slate-300 text-xs space-y-1 list-disc list-inside">
            <li>Core contributor to GPT-4 development</li>
            <li>Led inference optimization reducing latency by 40%</li>
          </ul>
        </div>
        <div className="bg-slate-800/50 rounded-lg p-3">
          <div className="flex justify-between items-start flex-wrap gap-1">
            <div>
              <h3 className="font-semibold text-white text-sm">Research Scientist</h3>
              <p className="text-teal-400 text-xs">Google DeepMind</p>
            </div>
            <span className="text-slate-500 text-xs">2020 - 2022</span>
          </div>
          <ul className="mt-2 text-slate-300 text-xs space-y-1 list-disc list-inside">
            <li>Developed novel attention mechanisms</li>
            <li>Published 5 papers at top AI conferences</li>
          </ul>
        </div>
      </div>
    </div>
    <div className="mb-5">
      <h2 className="text-sm md:text-base font-bold text-teal-400 mb-2 uppercase tracking-wide">Education</h2>
      <div className="space-y-2">
        <div className="flex justify-between flex-wrap gap-1">
          <div>
            <h3 className="font-semibold text-white text-sm">Ph.D. Machine Learning</h3>
            <p className="text-slate-400 text-xs">Stanford AI Lab</p>
          </div>
          <span className="text-slate-500 text-xs">2018 - 2020</span>
        </div>
      </div>
    </div>
    <div>
      <h2 className="text-sm md:text-base font-bold text-teal-400 mb-2 uppercase tracking-wide">Publications</h2>
      <ul className="text-slate-300 text-xs space-y-1 list-disc list-inside">
        <li>NeurIPS 2024 - "Efficient Sparse Attention for Long Context"</li>
        <li>ICML 2023 - "Scaling Laws for Multimodal Models"</li>
      </ul>
    </div>
  </div>
);

// =============================================================================
// CREATIVE
// =============================================================================

// Graphic Designer Full Preview (also used for designer)
export const GraphicDesignerFull: React.FC<FullPreviewProps> = ({ className = '' }) => (
  <div className={`w-full bg-gradient-to-br from-indigo-50 to-purple-50 rounded-lg shadow-xl p-6 md:p-8 text-sm ${className}`}>
    <header className="mb-6">
      <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-2xl mb-3 flex items-center justify-center">
        <span className="text-white text-2xl">🎨</span>
      </div>
      <h1 className="text-xl font-bold text-gray-900">Diana Design</h1>
      <p className="text-indigo-600 font-medium">Senior Graphic Designer</p>
      <div className="flex flex-wrap gap-2 mt-2">
        <span className="text-xs text-gray-500">🎨 Dribbble</span>
        <span className="text-xs text-gray-500">📐 Behance</span>
      </div>
    </header>
    <div className="grid grid-cols-3 gap-3 mb-5">
      <div className="bg-white p-3 rounded-lg text-center shadow-sm">
        <div className="text-lg font-bold text-indigo-600">200+</div>
        <div className="text-[10px] text-gray-500">Projects</div>
      </div>
      <div className="bg-white p-3 rounded-lg text-center shadow-sm">
        <div className="text-lg font-bold text-indigo-600">15</div>
        <div className="text-[10px] text-gray-500">Awards</div>
      </div>
      <div className="bg-white p-3 rounded-lg text-center shadow-sm">
        <div className="text-lg font-bold text-indigo-600">8</div>
        <div className="text-[10px] text-gray-500">Years</div>
      </div>
    </div>
    <div className="mb-5">
      <h2 className="text-sm font-bold text-indigo-600 mb-2">SUMMARY</h2>
      <p className="text-gray-600 text-xs md:text-sm">
        Award-winning Senior Graphic Designer with 8+ years creating compelling visual identities, marketing collateral,
        and digital experiences for Fortune 500 clients. Skilled in translating brand strategy into engaging designs.
      </p>
    </div>
    <div className="mb-5">
      <h2 className="text-sm font-bold text-indigo-600 mb-2">DESIGN TOOLS</h2>
      <div className="flex flex-wrap gap-2">
        {['Figma', 'Photoshop', 'Illustrator', 'After Effects', 'Sketch', 'InDesign', 'XD'].map(tool => (
          <span key={tool} className="px-2 py-1 bg-white text-indigo-700 rounded shadow-sm text-xs">{tool}</span>
        ))}
      </div>
    </div>
    <div className="mb-5">
      <h2 className="text-sm font-bold text-indigo-600 mb-2">EXPERIENCE</h2>
      <div className="space-y-3">
        <div>
          <div className="flex justify-between items-start flex-wrap gap-1">
            <div>
              <h3 className="font-semibold text-gray-800 text-sm">Senior Graphic Designer</h3>
              <p className="text-indigo-600 text-xs">Pentagram</p>
            </div>
            <span className="text-gray-500 text-xs">2021 - Present</span>
          </div>
          <ul className="mt-1 text-gray-600 text-xs space-y-0.5 list-disc list-inside">
            <li>Led visual identity rebrand for 5 major clients, increasing engagement by 45%</li>
            <li>Managed team of 4 junior designers across multi-channel campaigns</li>
          </ul>
        </div>
        <div>
          <div className="flex justify-between items-start flex-wrap gap-1">
            <div>
              <h3 className="font-semibold text-gray-800 text-sm">Graphic Designer</h3>
              <p className="text-indigo-600 text-xs">IDEO</p>
            </div>
            <span className="text-gray-500 text-xs">2018 - 2021</span>
          </div>
          <ul className="mt-1 text-gray-600 text-xs space-y-0.5 list-disc list-inside">
            <li>Designed marketing materials for product launches reaching 2M+ users</li>
            <li>Created comprehensive brand guidelines for 12 startup clients</li>
          </ul>
        </div>
      </div>
    </div>
    <div>
      <h2 className="text-sm font-bold text-indigo-600 mb-2">EDUCATION</h2>
      <div className="flex justify-between flex-wrap gap-1">
        <div>
          <h3 className="font-semibold text-gray-800 text-sm">B.F.A. Graphic Design</h3>
          <p className="text-gray-600 text-xs">Rhode Island School of Design (RISD)</p>
        </div>
        <span className="text-gray-500 text-xs">2014 - 2018</span>
      </div>
    </div>
  </div>
);

// Video Editor Full Preview
export const VideoEditorFull: React.FC<FullPreviewProps> = ({ className = '' }) => (
  <div className={`w-full bg-slate-900 rounded-lg shadow-xl p-6 md:p-8 text-sm ${className}`}>
    <header className="text-center mb-6">
      <h1 className="text-xl font-bold text-white tracking-widest">VICTOR CUTS</h1>
      <p className="text-red-500 font-medium">Senior Video Editor</p>
      <div className="flex justify-center gap-3 text-slate-400 text-xs mt-2">
        <span>📧 victor@edits.io</span>
        <span>🎬 Vimeo Pro</span>
      </div>
    </header>
    <div className="grid grid-cols-3 gap-2 mb-5">
      <div className="bg-slate-800 p-3 rounded text-center">
        <div className="text-lg font-bold text-red-500">100M+</div>
        <div className="text-[10px] text-slate-400">Views</div>
      </div>
      <div className="bg-slate-800 p-3 rounded text-center">
        <div className="text-lg font-bold text-red-500">500+</div>
        <div className="text-[10px] text-slate-400">Videos</div>
      </div>
      <div className="bg-slate-800 p-3 rounded text-center">
        <div className="text-lg font-bold text-red-500">3</div>
        <div className="text-[10px] text-slate-400">Awards</div>
      </div>
    </div>
    <div className="mb-5">
      <h2 className="text-sm font-bold text-red-500 mb-2">SUMMARY</h2>
      <p className="text-slate-300 text-xs md:text-sm">
        Senior Video Editor with 8+ years producing high-impact content for major brands and streaming platforms.
        Specializing in commercial, documentary, and social media content with 100M+ combined views.
      </p>
    </div>
    <div className="mb-5">
      <h2 className="text-sm font-bold text-red-500 mb-2">EDITING SUITE</h2>
      <div className="flex flex-wrap gap-2">
        {['Premiere Pro', 'DaVinci Resolve', 'After Effects', 'Final Cut Pro', 'Cinema 4D', 'Audition'].map(tool => (
          <span key={tool} className="px-2 py-1 bg-slate-800 text-slate-300 rounded text-xs">{tool}</span>
        ))}
      </div>
    </div>
    <div className="mb-5">
      <h2 className="text-sm font-bold text-red-500 mb-2">EXPERIENCE</h2>
      <div className="space-y-3">
        <div>
          <div className="flex justify-between items-start flex-wrap gap-1">
            <div>
              <h3 className="font-semibold text-white text-sm">Lead Video Editor</h3>
              <p className="text-red-500 text-xs">Netflix Post-Production</p>
            </div>
            <span className="text-slate-500 text-xs">2021 - Present</span>
          </div>
          <ul className="mt-1 text-slate-300 text-xs space-y-0.5 list-disc list-inside">
            <li>Edited 3 documentary series with 50M+ combined views</li>
            <li>Led color grading workflow reducing post-production time by 30%</li>
          </ul>
        </div>
        <div>
          <div className="flex justify-between items-start flex-wrap gap-1">
            <div>
              <h3 className="font-semibold text-white text-sm">Video Editor</h3>
              <p className="text-red-500 text-xs">BuzzFeed Studios</p>
            </div>
            <span className="text-slate-500 text-xs">2018 - 2021</span>
          </div>
          <ul className="mt-1 text-slate-300 text-xs space-y-0.5 list-disc list-inside">
            <li>Produced 200+ YouTube videos averaging 500K views each</li>
            <li>Won 2 Webby Awards for Best Editing in Short-Form Content</li>
          </ul>
        </div>
      </div>
    </div>
    <div>
      <h2 className="text-sm font-bold text-red-500 mb-2">EDUCATION</h2>
      <div className="flex justify-between flex-wrap gap-1">
        <div>
          <h3 className="font-semibold text-white text-sm">B.A. Film Production</h3>
          <p className="text-slate-400 text-xs">USC School of Cinematic Arts</p>
        </div>
        <span className="text-slate-500 text-xs">2014 - 2018</span>
      </div>
    </div>
  </div>
);

// Content Writer Full Preview
export const ContentWriterFull: React.FC<FullPreviewProps> = ({ className = '' }) => (
  <div className={`w-full bg-white rounded-lg shadow-xl overflow-hidden text-sm ${className}`}>
    <div className="h-2 bg-gradient-to-r from-pink-500 to-rose-500"></div>
    <div className="p-6 md:p-8">
      <header className="mb-6">
        <h1 className="text-xl font-bold text-gray-900 font-serif">Amanda Writer</h1>
        <p className="text-pink-600 font-medium">Senior Content Strategist</p>
        <div className="flex flex-wrap gap-3 text-gray-500 text-xs mt-2">
          <span>📧 amanda@content.io</span>
          <span>✍️ Medium: 50K followers</span>
        </div>
      </header>
      <div className="grid grid-cols-3 gap-3 mb-5 text-center">
        <div className="bg-pink-50 p-3 rounded-lg">
          <div className="text-lg font-bold text-pink-600">500+</div>
          <div className="text-[10px] text-gray-500">Articles</div>
        </div>
        <div className="bg-pink-50 p-3 rounded-lg">
          <div className="text-lg font-bold text-pink-600">10M</div>
          <div className="text-[10px] text-gray-500">Total Views</div>
        </div>
        <div className="bg-pink-50 p-3 rounded-lg">
          <div className="text-lg font-bold text-pink-600">3x</div>
          <div className="text-[10px] text-gray-500">SEO Increase</div>
        </div>
      </div>
      <div className="mb-5">
        <h2 className="text-sm font-bold text-pink-600 mb-2">SUMMARY</h2>
        <p className="text-gray-600 text-xs md:text-sm">
          Content Strategist with 7+ years creating high-impact content across digital platforms.
          Published in Forbes, TechCrunch, and HBR with 10M+ total article views and a proven track record
          of growing organic traffic through SEO-driven content strategies.
        </p>
      </div>
      <div className="mb-5">
        <h2 className="text-sm font-bold text-pink-600 mb-2">EXPERTISE</h2>
        <div className="flex flex-wrap gap-2">
          {['SEO Writing', 'Long-form', 'Technical Writing', 'Copywriting', 'B2B Content', 'Email Marketing', 'Social Media'].map(skill => (
            <span key={skill} className="px-2 py-1 bg-pink-100 text-pink-700 rounded text-xs">{skill}</span>
          ))}
        </div>
      </div>
      <div className="mb-5">
        <h2 className="text-sm font-bold text-pink-600 mb-2">EXPERIENCE</h2>
        <div className="space-y-3">
          <div>
            <div className="flex justify-between items-start flex-wrap gap-1">
              <div>
                <h3 className="font-semibold text-gray-800 text-sm">Senior Content Strategist</h3>
                <p className="text-pink-600 text-xs">HubSpot</p>
              </div>
              <span className="text-gray-500 text-xs">2021 - Present</span>
            </div>
            <ul className="mt-1 text-gray-600 text-xs space-y-0.5 list-disc list-inside">
              <li>Grew blog traffic from 500K to 2M monthly sessions through content optimization</li>
              <li>Managed editorial calendar producing 40+ articles per month across 5 writers</li>
            </ul>
          </div>
          <div>
            <div className="flex justify-between items-start flex-wrap gap-1">
              <div>
                <h3 className="font-semibold text-gray-800 text-sm">Content Writer</h3>
                <p className="text-pink-600 text-xs">Contently</p>
              </div>
              <span className="text-gray-500 text-xs">2018 - 2021</span>
            </div>
            <ul className="mt-1 text-gray-600 text-xs space-y-0.5 list-disc list-inside">
              <li>Authored 200+ long-form articles with average read time of 8 minutes</li>
              <li>Increased client conversion rates by 35% through targeted copy</li>
            </ul>
          </div>
        </div>
      </div>
      <div className="mb-5">
        <h2 className="text-sm font-bold text-pink-600 mb-2">EDUCATION</h2>
        <div className="flex justify-between flex-wrap gap-1">
          <div>
            <h3 className="font-semibold text-gray-800 text-sm">B.A. English & Communications</h3>
            <p className="text-gray-600 text-xs">Columbia University</p>
          </div>
          <span className="text-gray-500 text-xs">2014 - 2018</span>
        </div>
      </div>
      <div>
        <h2 className="text-sm font-bold text-pink-600 mb-2">PUBLISHED IN</h2>
        <p className="text-gray-600 text-xs">Forbes, TechCrunch, HBR, Wired, Fast Company</p>
      </div>
    </div>
  </div>
);

// =============================================================================
// GENERAL
// =============================================================================

// Fresher / Student Full Preview
export const FresherFull: React.FC<FullPreviewProps> = ({ className = '' }) => (
  <div className={`w-full bg-white rounded-lg shadow-xl p-6 md:p-8 text-sm ${className}`}>
    <div className="text-center mb-6">
      <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Chris Graduate</h1>
      <p className="text-cyan-600 font-medium">Computer Science Student | Seeking SWE Role</p>
      <div className="flex justify-center flex-wrap gap-4 text-gray-500 text-xs mt-2">
        <span>📧 chris@stanford.edu</span>
        <span>📱 +1 (555) 567-8901</span>
        <span>🔗 github.com/chrisgrad</span>
        <span>📍 Palo Alto, CA</span>
      </div>
    </div>
    <div className="bg-cyan-50 rounded-lg p-4 mb-5 border border-cyan-200">
      <h2 className="text-sm md:text-base font-bold text-cyan-700 mb-2 uppercase tracking-wide">🎓 Education</h2>
      <div className="flex justify-between flex-wrap gap-1">
        <div>
          <h3 className="font-semibold text-gray-800 text-sm">B.S. Computer Science</h3>
          <p className="text-cyan-600 text-xs">Stanford University</p>
        </div>
        <span className="text-gray-500 text-xs">2020 - 2024</span>
      </div>
      <ul className="mt-2 text-gray-600 text-xs space-y-0.5 list-disc list-inside">
        <li>GPA: 3.9/4.0 • Dean's List (All Semesters)</li>
        <li>Coursework: Algorithms, ML, Distributed Systems</li>
      </ul>
    </div>
    <div className="mb-5">
      <h2 className="text-sm md:text-base font-bold text-cyan-600 mb-2 uppercase tracking-wide">Skills</h2>
      <div className="flex flex-wrap gap-2">
        {['Python', 'Java', 'React', 'JavaScript', 'SQL', 'MongoDB', 'Git', 'Linux'].map(skill => (
          <span key={skill} className="px-3 py-1 bg-cyan-50 text-cyan-600 rounded-full text-xs font-medium border border-cyan-200">
            {skill}
          </span>
        ))}
      </div>
    </div>
    <div className="mb-5">
      <h2 className="text-sm md:text-base font-bold text-cyan-600 mb-2 uppercase tracking-wide">Projects</h2>
      <div className="space-y-2">
        <div className="bg-cyan-50/50 p-2 rounded border-l-2 border-cyan-400">
          <h3 className="font-semibold text-gray-800 text-sm">AI Chatbot Application</h3>
          <p className="text-cyan-600 text-xs">React Native • OpenAI API • Firebase</p>
          <p className="text-gray-600 text-xs mt-0.5">Built mobile app with 5K+ downloads on App Store</p>
        </div>
        <div className="bg-cyan-50/50 p-2 rounded border-l-2 border-cyan-400">
          <h3 className="font-semibold text-gray-800 text-sm">E-Commerce Platform</h3>
          <p className="text-cyan-600 text-xs">Next.js • Stripe • PostgreSQL</p>
          <p className="text-gray-600 text-xs mt-0.5">Full-stack marketplace with real-time inventory</p>
        </div>
      </div>
    </div>
    <div>
      <h2 className="text-sm md:text-base font-bold text-cyan-600 mb-2 uppercase tracking-wide">Certifications</h2>
      <ul className="text-gray-600 text-xs space-y-1 list-disc list-inside">
        <li>AWS Cloud Practitioner Certified</li>
        <li>Meta React Developer Certificate</li>
      </ul>
    </div>
  </div>
);

// Freelancer Full Preview
export const FreelancerFull: React.FC<FullPreviewProps> = ({ className = '' }) => (
  <div className={`w-full bg-gradient-to-br from-rose-50 to-pink-50 rounded-lg shadow-xl p-6 md:p-8 text-sm ${className}`}>
    <div className="text-center mb-6">
      <div className="w-20 h-20 rounded-full bg-gradient-to-br from-pink-400 to-rose-500 mx-auto mb-3 flex items-center justify-center text-3xl shadow-lg">
        🚀
      </div>
      <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Mike Kreative</h1>
      <p className="text-rose-600 font-medium">Full-Stack Developer & Designer</p>
      <div className="flex justify-center flex-wrap gap-4 text-gray-500 text-xs mt-2">
        <span>📧 mike@kreative.dev</span>
        <span>🌐 kreative.dev</span>
        <span>🔗 github.com/mikekreative</span>
        <span>📍 Remote</span>
      </div>
    </div>
    <div className="grid grid-cols-3 gap-3 mb-5">
      <div className="bg-white rounded-lg p-3 text-center shadow-sm border border-rose-100">
        <p className="font-bold text-rose-600 text-xl">50+</p>
        <p className="text-gray-500 text-xs">Projects</p>
      </div>
      <div className="bg-white rounded-lg p-3 text-center shadow-sm border border-rose-100">
        <p className="font-bold text-rose-600 text-xl">30+</p>
        <p className="text-gray-500 text-xs">Happy Clients</p>
      </div>
      <div className="bg-white rounded-lg p-3 text-center shadow-sm border border-rose-100">
        <p className="font-bold text-rose-600 text-xl">5★</p>
        <p className="text-gray-500 text-xs">Avg Rating</p>
      </div>
    </div>
    <div className="mb-5">
      <h2 className="text-sm md:text-base font-bold text-rose-600 mb-2 uppercase tracking-wide">Services</h2>
      <div className="flex flex-wrap gap-2">
        {['Web Development', 'Mobile Apps', 'UI/UX Design', 'API Development', 'E-commerce', 'Consulting'].map(service => (
          <span key={service} className="px-3 py-1 bg-white text-rose-600 rounded-full text-xs font-medium border border-rose-200 shadow-sm">
            {service}
          </span>
        ))}
      </div>
    </div>
    <div className="mb-5">
      <h2 className="text-sm md:text-base font-bold text-rose-600 mb-2 uppercase tracking-wide">Featured Work</h2>
      <div className="space-y-2">
        <div className="bg-white p-3 rounded-lg shadow-sm border border-rose-100">
          <div className="flex justify-between items-start flex-wrap gap-1">
            <div>
              <h3 className="font-semibold text-gray-800 text-sm">E-Commerce Platform</h3>
              <p className="text-rose-600 text-xs">TechStartup Inc.</p>
            </div>
            <span className="text-gray-500 text-xs">$25K Project</span>
          </div>
          <p className="text-gray-600 text-xs mt-1">Built full e-commerce solution with 10K+ monthly transactions</p>
        </div>
      </div>
    </div>
    <div>
      <div className="bg-white p-3 rounded-lg border-l-4 border-rose-400 shadow-sm">
        <p className="text-gray-600 text-xs italic">"Mike delivered exceptional work on time and exceeded our expectations. Highly recommend!"</p>
        <p className="text-rose-600 text-xs font-medium mt-1">— CEO, TechStartup Inc.</p>
      </div>
    </div>
  </div>
);

// Executive Full Preview
export const ExecutiveFull: React.FC<FullPreviewProps> = ({ className = '' }) => (
  <div className={`w-full bg-white rounded-lg shadow-xl text-sm overflow-hidden ${className}`}>
    <div className="h-2 bg-slate-800"></div>
    <div className="p-6 md:p-8">
      <header className="text-center mb-6">
        <h1 className="text-2xl font-serif font-bold text-slate-900">Elizabeth Executive</h1>
        <p className="text-amber-600 font-medium tracking-widest uppercase text-xs">Chief Executive Officer</p>
        <div className="flex justify-center gap-4 text-gray-500 text-xs mt-3">
          <span>📧 ceo@company.com</span>
          <span>🌐 Fortune 500</span>
        </div>
      </header>
      <div className="text-center italic text-gray-600 text-sm mb-6 font-serif border-y border-gray-200 py-4">
        "Transformational leader with 20+ years driving growth at Fortune 500 companies"
      </div>
      <div className="grid grid-cols-3 gap-4 mb-5">
        <div className="text-center">
          <div className="text-xl font-bold text-slate-800">$2B+</div>
          <div className="text-xs text-gray-500">Revenue</div>
        </div>
        <div className="text-center">
          <div className="text-xl font-bold text-slate-800">10K+</div>
          <div className="text-xs text-gray-500">Employees</div>
        </div>
        <div className="text-center">
          <div className="text-xl font-bold text-slate-800">3</div>
          <div className="text-xs text-gray-500">IPOs Led</div>
        </div>
      </div>
      <div className="mb-5">
        <h2 className="text-sm font-bold text-slate-800 mb-2 uppercase tracking-wide font-serif">Leadership Experience</h2>
        <div className="space-y-3">
          <div>
            <div className="flex justify-between items-start flex-wrap gap-1">
              <div>
                <h3 className="font-semibold text-gray-800 text-sm">Chief Executive Officer</h3>
                <p className="text-amber-600 text-xs">Innovate Corp (Fortune 500)</p>
              </div>
              <span className="text-gray-500 text-xs">2020 - Present</span>
            </div>
            <ul className="mt-1 text-gray-600 text-xs space-y-0.5 list-disc list-inside">
              <li>Grew revenue from $800M to $2.1B through strategic acquisitions and market expansion</li>
              <li>Led successful IPO valued at $15B, oversubscribed by 3x</li>
              <li>Drove digital transformation increasing operational efficiency by 35%</li>
            </ul>
          </div>
          <div>
            <div className="flex justify-between items-start flex-wrap gap-1">
              <div>
                <h3 className="font-semibold text-gray-800 text-sm">Chief Operating Officer</h3>
                <p className="text-amber-600 text-xs">TechVision Industries</p>
              </div>
              <span className="text-gray-500 text-xs">2015 - 2020</span>
            </div>
            <ul className="mt-1 text-gray-600 text-xs space-y-0.5 list-disc list-inside">
              <li>Managed 5,000+ employees across 12 global offices</li>
              <li>Reduced operational costs by $150M while scaling headcount 40%</li>
            </ul>
          </div>
        </div>
      </div>
      <div className="mb-5">
        <h2 className="text-sm font-bold text-slate-800 mb-2 uppercase tracking-wide font-serif">Board Memberships</h2>
        <ul className="text-gray-600 text-xs space-y-1 list-disc list-inside">
          <li>Board Director, National Tech Alliance (2022 - Present)</li>
          <li>Advisory Board, Stanford Graduate School of Business (2021 - Present)</li>
        </ul>
      </div>
      <div>
        <h2 className="text-sm font-bold text-slate-800 mb-2 uppercase tracking-wide font-serif">Education</h2>
        <div className="space-y-2">
          <div className="flex justify-between flex-wrap gap-1">
            <div>
              <h3 className="font-semibold text-gray-800 text-sm">MBA, Business Administration</h3>
              <p className="text-gray-600 text-xs">Harvard Business School</p>
            </div>
            <span className="text-gray-500 text-xs">2010</span>
          </div>
          <div className="flex justify-between flex-wrap gap-1">
            <div>
              <h3 className="font-semibold text-gray-800 text-sm">B.S. Economics</h3>
              <p className="text-gray-600 text-xs">Wharton School, UPenn</p>
            </div>
            <span className="text-gray-500 text-xs">2005</span>
          </div>
        </div>
      </div>
    </div>
  </div>
);

// =============================================================================
// ADDITIONAL TEMPLATES
// =============================================================================

// Project Manager Full Preview
export const ProjectManagerFull: React.FC<FullPreviewProps> = ({ className = '' }) => (
  <div className={`w-full bg-white rounded-lg shadow-xl text-sm overflow-hidden ${className}`}>
    <div className="h-2 bg-gradient-to-r from-amber-500 to-orange-600"></div>
    <div className="p-6 md:p-8">
      <header className="mb-6">
        <h1 className="text-xl md:text-2xl font-bold text-gray-800">Rachel Manager</h1>
        <p className="text-amber-600 font-medium">Senior Project Manager | PMP Certified</p>
        <div className="flex flex-wrap gap-3 text-gray-500 text-xs mt-2">
          <span>📧 rachel@pm-pro.io</span>
          <span>📱 +1 (555) 890-1234</span>
          <span>📍 Austin, TX</span>
        </div>
      </header>
      <div className="bg-amber-50 rounded-lg p-4 mb-5 border-l-4 border-amber-500">
        <p className="text-gray-700 text-xs md:text-sm">
          PMP-certified Project Manager with 10+ years leading cross-functional teams. 
          Delivered $50M+ in projects across Agile and Waterfall methodologies with 98% on-time delivery rate.
        </p>
      </div>
      <div className="grid grid-cols-3 gap-3 mb-5 text-center">
        <div className="bg-amber-50 p-3 rounded-lg">
          <div className="text-lg font-bold text-amber-600">$50M+</div>
          <div className="text-[10px] text-gray-500">Projects Delivered</div>
        </div>
        <div className="bg-amber-50 p-3 rounded-lg">
          <div className="text-lg font-bold text-amber-600">98%</div>
          <div className="text-[10px] text-gray-500">On-Time Rate</div>
        </div>
        <div className="bg-amber-50 p-3 rounded-lg">
          <div className="text-lg font-bold text-amber-600">15+</div>
          <div className="text-[10px] text-gray-500">Teams Led</div>
        </div>
      </div>
      <div className="mb-5">
        <h2 className="text-sm font-bold text-amber-600 mb-2 uppercase tracking-wide">Methodologies & Tools</h2>
        <div className="flex flex-wrap gap-2">
          {['Agile/Scrum', 'Waterfall', 'Jira', 'Confluence', 'MS Project', 'SAFe', 'Kanban', 'Risk Management'].map(skill => (
            <span key={skill} className="px-2 py-1 bg-amber-100 text-amber-700 rounded-full text-xs font-medium">{skill}</span>
          ))}
        </div>
      </div>
      <div>
        <h2 className="text-sm font-bold text-amber-600 mb-2 uppercase tracking-wide">Experience</h2>
        <div className="flex justify-between items-start flex-wrap gap-1">
          <div>
            <h3 className="font-semibold text-gray-800 text-sm">Senior Project Manager</h3>
            <p className="text-amber-600 text-xs">Deloitte Digital</p>
          </div>
          <span className="text-gray-500 text-xs">2020 - Present</span>
        </div>
        <ul className="mt-1 text-gray-600 text-xs space-y-0.5 list-disc list-inside">
          <li>Managed portfolio of 8 concurrent projects valued at $12M</li>
          <li>Reduced project delivery time by 25% through process optimization</li>
        </ul>
      </div>
    </div>
  </div>
);

// Business Analyst Full Preview
export const BusinessAnalystFull: React.FC<FullPreviewProps> = ({ className = '' }) => (
  <div className={`w-full bg-white rounded-lg shadow-xl p-6 md:p-8 text-sm ${className}`}>
    <div className="border-b-2 border-emerald-500 pb-4 mb-6">
      <h1 className="text-xl md:text-2xl font-bold text-gray-800">David Analyst</h1>
      <p className="text-emerald-600 font-medium">Senior Business Analyst</p>
      <div className="flex flex-wrap gap-3 text-gray-500 text-xs mt-2">
        <span>📧 david@analytics.io</span>
        <span>📱 +1 (555) 678-9012</span>
        <span>📍 Chicago, IL</span>
      </div>
    </div>
    <div className="mb-5">
      <h2 className="text-sm font-bold text-emerald-600 mb-2 uppercase tracking-wide">Summary</h2>
      <p className="text-gray-600 text-xs md:text-sm">
        Business Analyst with 8+ years translating complex business requirements into actionable solutions. 
        Expert in data-driven decision making, process modeling, and stakeholder management.
      </p>
    </div>
    <div className="mb-5">
      <h2 className="text-sm font-bold text-emerald-600 mb-2 uppercase tracking-wide">Core Competencies</h2>
      <div className="flex flex-wrap gap-2">
        {['Requirements Analysis', 'SQL', 'Tableau', 'Power BI', 'BPMN', 'User Stories', 'A/B Testing', 'Excel/VBA'].map(skill => (
          <span key={skill} className="px-2 py-1 bg-emerald-50 text-emerald-700 rounded-full text-xs font-medium border border-emerald-200">{skill}</span>
        ))}
      </div>
    </div>
    <div className="mb-5">
      <h2 className="text-sm font-bold text-emerald-600 mb-2 uppercase tracking-wide">Experience</h2>
      <div className="space-y-3">
        <div>
          <div className="flex justify-between items-start flex-wrap gap-1">
            <div>
              <h3 className="font-semibold text-gray-800 text-sm">Senior Business Analyst</h3>
              <p className="text-emerald-600 text-xs">McKinsey & Company</p>
            </div>
            <span className="text-gray-500 text-xs">2021 - Present</span>
          </div>
          <ul className="mt-1 text-gray-600 text-xs space-y-0.5 list-disc list-inside">
            <li>Led requirements gathering for $8M digital transformation initiative</li>
            <li>Created data models reducing reporting time by 65%</li>
          </ul>
        </div>
      </div>
    </div>
    <div>
      <h2 className="text-sm font-bold text-emerald-600 mb-2 uppercase tracking-wide">Certifications</h2>
      <ul className="text-gray-600 text-xs space-y-1 list-disc list-inside">
        <li>CBAP (Certified Business Analysis Professional)</li>
        <li>Six Sigma Green Belt</li>
      </ul>
    </div>
  </div>
);

// Marketing Professional Full Preview
export const MarketingFull: React.FC<FullPreviewProps> = ({ className = '' }) => (
  <div className={`w-full bg-white rounded-lg shadow-xl overflow-hidden text-sm ${className}`}>
    <div className="h-2 bg-gradient-to-r from-violet-500 to-fuchsia-500"></div>
    <div className="p-6 md:p-8">
      <header className="mb-6">
        <h1 className="text-xl md:text-2xl font-bold text-gray-800">Sophie Marketing</h1>
        <p className="text-violet-600 font-medium">Digital Marketing Manager</p>
        <div className="flex flex-wrap gap-3 text-gray-500 text-xs mt-2">
          <span>📧 sophie@marketing.io</span>
          <span>📱 +1 (555) 345-6789</span>
          <span>📍 Los Angeles, CA</span>
        </div>
      </header>
      <div className="bg-violet-50 rounded-lg p-4 mb-5">
        <p className="text-gray-700 text-xs md:text-sm">
          Results-oriented Marketing Manager with 7+ years driving brand growth through data-driven digital campaigns. 
          Managed $5M+ annual budgets with consistent 300%+ ROI across paid, organic, and social channels.
        </p>
      </div>
      <div className="grid grid-cols-3 gap-3 mb-5 text-center">
        <div className="bg-violet-50 p-3 rounded-lg">
          <div className="text-lg font-bold text-violet-600">300%</div>
          <div className="text-[10px] text-gray-500">Avg ROI</div>
        </div>
        <div className="bg-violet-50 p-3 rounded-lg">
          <div className="text-lg font-bold text-violet-600">$5M+</div>
          <div className="text-[10px] text-gray-500">Budget Managed</div>
        </div>
        <div className="bg-violet-50 p-3 rounded-lg">
          <div className="text-lg font-bold text-violet-600">2M+</div>
          <div className="text-[10px] text-gray-500">Leads Generated</div>
        </div>
      </div>
      <div className="mb-5">
        <h2 className="text-sm font-bold text-violet-600 mb-2 uppercase tracking-wide">Marketing Stack</h2>
        <div className="flex flex-wrap gap-2">
          {['Google Ads', 'Meta Ads', 'HubSpot', 'Mailchimp', 'SEMrush', 'GA4', 'Salesforce', 'Canva'].map(skill => (
            <span key={skill} className="px-2 py-1 bg-violet-100 text-violet-700 rounded-full text-xs font-medium">{skill}</span>
          ))}
        </div>
      </div>
      <div>
        <h2 className="text-sm font-bold text-violet-600 mb-2 uppercase tracking-wide">Experience</h2>
        <div className="flex justify-between items-start flex-wrap gap-1">
          <div>
            <h3 className="font-semibold text-gray-800 text-sm">Digital Marketing Manager</h3>
            <p className="text-violet-600 text-xs">HubSpot</p>
          </div>
          <span className="text-gray-500 text-xs">2021 - Present</span>
        </div>
        <ul className="mt-1 text-gray-600 text-xs space-y-0.5 list-disc list-inside">
          <li>Grew organic traffic by 180% through SEO and content strategy</li>
          <li>Launched campaigns generating 500K+ qualified leads annually</li>
        </ul>
      </div>
    </div>
  </div>
);

// Academic / Research Full Preview
export const AcademicFull: React.FC<FullPreviewProps> = ({ className = '' }) => (
  <div className={`w-full bg-white rounded-lg shadow-xl p-6 md:p-8 text-sm ${className}`}>
    <header className="text-center mb-6 pb-4 border-b-2 border-gray-800">
      <h1 className="text-xl md:text-2xl font-bold text-gray-900 font-serif">Dr. James Scholar</h1>
      <p className="text-gray-600 font-medium">Associate Professor of Computer Science</p>
      <div className="flex justify-center flex-wrap gap-4 text-gray-500 text-xs mt-2">
        <span>📧 j.scholar@mit.edu</span>
        <span>🎓 Google Scholar: h-index 42</span>
        <span>📍 Cambridge, MA</span>
      </div>
    </header>
    <div className="mb-5">
      <h2 className="text-sm font-bold text-gray-800 mb-2 uppercase tracking-wide border-b border-gray-300 pb-1">Research Interests</h2>
      <p className="text-gray-600 text-xs md:text-sm">
        Distributed systems, cloud computing, database optimization, and large-scale data processing. 
        Focus on improving system reliability and performance in production environments.
      </p>
    </div>
    <div className="grid grid-cols-3 gap-3 mb-5 text-center">
      <div className="bg-gray-50 p-3 rounded-lg">
        <div className="text-lg font-bold text-gray-800">65+</div>
        <div className="text-[10px] text-gray-500">Publications</div>
      </div>
      <div className="bg-gray-50 p-3 rounded-lg">
        <div className="text-lg font-bold text-gray-800">3,200+</div>
        <div className="text-[10px] text-gray-500">Citations</div>
      </div>
      <div className="bg-gray-50 p-3 rounded-lg">
        <div className="text-lg font-bold text-gray-800">$4M</div>
        <div className="text-[10px] text-gray-500">Grants Won</div>
      </div>
    </div>
    <div className="mb-5">
      <h2 className="text-sm font-bold text-gray-800 mb-2 uppercase tracking-wide border-b border-gray-300 pb-1">Selected Publications</h2>
      <ul className="text-gray-600 text-xs space-y-1.5">
        <li className="pl-4 border-l-2 border-gray-300">Scholar, J. et al. (2025). "Scalable Consensus in Heterogeneous Networks." <span className="italic">ACM SIGMOD.</span></li>
        <li className="pl-4 border-l-2 border-gray-300">Scholar, J. (2024). "Adaptive Query Processing for Modern Cloud Databases." <span className="italic">VLDB Journal.</span></li>
      </ul>
    </div>
    <div>
      <h2 className="text-sm font-bold text-gray-800 mb-2 uppercase tracking-wide border-b border-gray-300 pb-1">Education</h2>
      <div className="space-y-2">
        <div className="flex justify-between flex-wrap gap-1">
          <div>
            <h3 className="font-semibold text-gray-800 text-sm">Ph.D. Computer Science</h3>
            <p className="text-gray-600 text-xs">MIT</p>
          </div>
          <span className="text-gray-500 text-xs">2015</span>
        </div>
      </div>
    </div>
  </div>
);

// DevOps Engineer Full Preview
export const DevOpsEngineerFull: React.FC<FullPreviewProps> = ({ className = '' }) => (
  <div className={`w-full bg-slate-50 rounded-lg shadow-xl p-6 md:p-8 text-sm ${className}`}>
    <header className="bg-gradient-to-r from-orange-600 to-red-600 text-white p-4 rounded-lg mb-6 -mx-2">
      <h1 className="text-xl font-bold">Kevin DevOps</h1>
      <p className="text-orange-200">Senior DevOps Engineer</p>
      <div className="flex flex-wrap gap-3 text-orange-100 text-xs mt-2">
        <span>📧 kevin@devops.io</span>
        <span>☁️ AWS Solutions Architect Pro</span>
        <span>📍 Seattle, WA</span>
      </div>
    </header>
    <div className="bg-white p-4 rounded border mb-5 font-mono text-xs">
      <div className="text-slate-500 mb-2"># Infrastructure Metrics</div>
      <div className="grid grid-cols-2 gap-2">
        <div className="text-slate-700">uptime: <span className="text-green-600">99.99%</span></div>
        <div className="text-slate-700">deployments/day: <span className="text-blue-600">50+</span></div>
        <div className="text-slate-700">MTTR: <span className="text-amber-600">&lt;15 min</span></div>
        <div className="text-slate-700">cost_saved: <span className="text-green-600">$500K/yr</span></div>
      </div>
    </div>
    <div className="mb-5">
      <h2 className="text-sm font-bold text-orange-600 mb-2 uppercase tracking-wide">Tech Stack</h2>
      <div className="flex flex-wrap gap-2">
        {['AWS', 'Kubernetes', 'Docker', 'Terraform', 'Jenkins', 'GitHub Actions', 'Prometheus', 'Grafana'].map(tech => (
          <span key={tech} className="px-2 py-1 bg-orange-100 text-orange-700 rounded text-xs font-medium">{tech}</span>
        ))}
      </div>
    </div>
    <div>
      <h2 className="text-sm font-bold text-orange-600 mb-2 uppercase tracking-wide">Experience</h2>
      <div className="flex justify-between items-start flex-wrap gap-1">
        <div>
          <h3 className="font-semibold text-gray-800 text-sm">Senior DevOps Engineer</h3>
          <p className="text-orange-600 text-xs">Netflix</p>
        </div>
        <span className="text-gray-500 text-xs">2021 - Present</span>
      </div>
      <ul className="mt-1 text-gray-600 text-xs space-y-0.5 list-disc list-inside">
        <li>Architected CI/CD pipeline reducing deployment time from 2hrs to 10min</li>
        <li>Managed 2,000+ Kubernetes pods across multi-region clusters</li>
      </ul>
    </div>
    <div className="mb-5">
      <h2 className="text-sm font-bold text-orange-600 mb-2 uppercase tracking-wide">Education</h2>
      <div className="flex justify-between flex-wrap gap-1">
        <div>
          <h3 className="font-semibold text-gray-800 text-sm">B.S. Computer Science</h3>
          <p className="text-gray-600 text-xs">University of Washington</p>
        </div>
        <span className="text-gray-500 text-xs">2013 - 2017</span>
      </div>
    </div>
    <div>
      <h2 className="text-sm font-bold text-orange-600 mb-2 uppercase tracking-wide">Certifications</h2>
      <ul className="text-gray-600 text-xs space-y-1 list-disc list-inside">
        <li>AWS Solutions Architect Professional</li>
        <li>CKA (Certified Kubernetes Administrator)</li>
      </ul>
    </div>
  </div>
);
