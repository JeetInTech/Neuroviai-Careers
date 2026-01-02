import React from 'react';

// ============================================
// FULL-SIZE CV PREVIEW COMPONENTS
// Shows complete template demos for Home page
// ============================================

interface FullPreviewProps {
  className?: string;
}

// Software Engineer Full Preview
export const SoftwareEngineerFull: React.FC<FullPreviewProps> = ({ className = '' }) => (
  <div className={`w-full bg-white rounded-lg shadow-xl p-6 md:p-8 text-sm ${className}`}>
    {/* Header */}
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
    
    {/* Summary */}
    <div className="mb-5">
      <h2 className="text-sm md:text-base font-bold text-indigo-600 mb-2 uppercase tracking-wide">Professional Summary</h2>
      <p className="text-gray-600 text-xs md:text-sm">
        Results-driven Senior Software Engineer with 6+ years of experience building scalable web applications. 
        Expert in React, TypeScript, and Node.js with a track record of leading high-performance teams and 
        delivering projects that increased user engagement by 40%.
      </p>
    </div>
    
    {/* Skills */}
    <div className="mb-5">
      <h2 className="text-sm md:text-base font-bold text-indigo-600 mb-2 uppercase tracking-wide">Technical Skills</h2>
      <div className="flex flex-wrap gap-1.5">
        {['React', 'TypeScript', 'Node.js', 'Python', 'AWS', 'Docker', 'PostgreSQL', 'GraphQL', 'Redis', 'Kubernetes'].map(skill => (
          <span key={skill} className="bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full text-xs font-medium">{skill}</span>
        ))}
      </div>
    </div>
    
    {/* Experience */}
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

    {/* Education */}
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

    {/* Languages */}
    <div className="mb-5">
      <h2 className="text-sm md:text-base font-bold text-indigo-600 mb-2 uppercase tracking-wide">Languages</h2>
      <div className="flex gap-4 text-xs text-gray-600">
        <span>• English (Native)</span>
        <span>• Spanish (Intermediate)</span>
      </div>
    </div>

    {/* Achievements */}
    <div>
      <h2 className="text-sm md:text-base font-bold text-indigo-600 mb-2 uppercase tracking-wide">Achievements</h2>
      <ul className="text-gray-600 text-xs space-y-1 list-disc list-inside">
        <li>Scaled platform to handle 1M+ daily active users</li>
        <li>Reduced cloud infrastructure costs by $200K annually</li>
      </ul>
    </div>
  </div>
);

// Data Scientist Full Preview
export const DataScientistFull: React.FC<FullPreviewProps> = ({ className = '' }) => (
  <div className={`w-full bg-white rounded-lg shadow-xl p-6 md:p-8 text-sm ${className}`}>
    {/* Header with accent */}
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
    
    {/* Summary */}
    <div className="bg-purple-50 rounded-lg p-4 mb-5">
      <p className="text-gray-700 text-xs md:text-sm">
        Data Scientist with 7+ years of experience transforming complex datasets into actionable business insights. 
        Specialized in machine learning, predictive modeling, and data visualization. Proven track record of driving $10M+ in revenue through data-driven decisions.
      </p>
    </div>
    
    {/* Tools & Proficiency */}
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
    
    {/* Experience */}
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
        <div>
          <div className="flex justify-between items-start flex-wrap gap-1">
            <div>
              <h3 className="font-semibold text-gray-800 text-sm">Data Scientist</h3>
              <p className="text-purple-600 text-xs">TechStartup Inc</p>
            </div>
            <span className="text-gray-500 text-xs">2018 - 2021</span>
          </div>
          <ul className="mt-1 text-gray-600 text-xs space-y-0.5 list-disc list-inside">
            <li>Created customer segmentation models improving targeting by 35%</li>
            <li>Automated reporting saving 20 hours/week</li>
          </ul>
        </div>
      </div>
    </div>
    
    {/* Education */}
    <div className="mb-5">
      <h2 className="text-sm md:text-base font-bold text-purple-600 mb-2 uppercase tracking-wide">Education</h2>
      <div className="space-y-2">
        <div className="flex justify-between flex-wrap gap-1">
          <div>
            <h3 className="font-semibold text-gray-800 text-sm">M.S. Data Science</h3>
            <p className="text-gray-600 text-xs">MIT</p>
          </div>
          <span className="text-gray-500 text-xs">2016 - 2018</span>
        </div>
        <div className="flex justify-between flex-wrap gap-1">
          <div>
            <h3 className="font-semibold text-gray-800 text-sm">B.S. Statistics</h3>
            <p className="text-gray-600 text-xs">UC Berkeley</p>
          </div>
          <span className="text-gray-500 text-xs">2012 - 2016</span>
        </div>
      </div>
    </div>

    {/* Languages */}
    <div className="mb-5">
      <h2 className="text-sm md:text-base font-bold text-purple-600 mb-2 uppercase tracking-wide">Languages</h2>
      <div className="flex gap-4 text-xs text-gray-600">
        <span>• English (Native)</span>
        <span>• Mandarin (Fluent)</span>
      </div>
    </div>

    {/* Achievements */}
    <div>
      <h2 className="text-sm md:text-base font-bold text-purple-600 mb-2 uppercase tracking-wide">Achievements</h2>
      <ul className="text-gray-600 text-xs space-y-1 list-disc list-inside">
        <li>Increased customer retention by 35% with churn prediction model</li>
        <li>Published research paper in top ML conference</li>
      </ul>
    </div>
  </div>
);

// AI/ML Engineer Full Preview
export const AIMLFull: React.FC<FullPreviewProps> = ({ className = '' }) => (
  <div className={`w-full bg-slate-900 rounded-lg shadow-xl p-6 md:p-8 text-sm ${className}`}>
    {/* Header */}
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
    
    {/* Summary */}
    <div className="bg-slate-800 rounded-lg p-4 mb-5 border border-teal-500/30">
      <p className="text-slate-300 text-xs md:text-sm">
        AI/ML Research Engineer with expertise in large language models, computer vision, and reinforcement learning. 
        Published 15+ papers in top venues (NeurIPS, ICML, CVPR). Led development of models deployed to 100M+ users.
      </p>
    </div>
    
    {/* Tech Stack */}
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
    
    {/* Experience */}
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
    
    {/* Education */}
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
        <div className="flex justify-between flex-wrap gap-1">
          <div>
            <h3 className="font-semibold text-white text-sm">B.S. Computer Science</h3>
            <p className="text-slate-400 text-xs">Carnegie Mellon</p>
          </div>
          <span className="text-slate-500 text-xs">2014 - 2018</span>
        </div>
      </div>
    </div>

    {/* Languages */}
    <div className="mb-5">
      <h2 className="text-sm md:text-base font-bold text-teal-400 mb-2 uppercase tracking-wide">Languages</h2>
      <div className="flex gap-4 text-xs text-slate-300">
        <span>• English (Native)</span>
        <span>• Mandarin (Native)</span>
      </div>
    </div>

    {/* Publications */}
    <div>
      <h2 className="text-sm md:text-base font-bold text-teal-400 mb-2 uppercase tracking-wide">Publications & Achievements</h2>
      <ul className="text-slate-300 text-xs space-y-1 list-disc list-inside">
        <li>NeurIPS 2024 - "Efficient Sparse Attention for Long Context"</li>
        <li>ICML 2023 - "Scaling Laws for Multimodal Models"</li>
        <li>15+ papers at top AI/ML conferences</li>
      </ul>
    </div>
  </div>
);

// Product Manager Full Preview
export const ProductManagerFull: React.FC<FullPreviewProps> = ({ className = '' }) => (
  <div className={`w-full bg-white rounded-lg shadow-xl p-6 md:p-8 text-sm ${className}`}>
    {/* Header */}
    <div className="text-center border-b-2 border-orange-200 pb-4 mb-5">
      <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Emily Product</h1>
      <p className="text-orange-600 font-medium">Senior Product Manager</p>
      <div className="flex justify-center flex-wrap gap-4 text-gray-500 text-xs mt-2">
        <span>📧 emily@product.io</span>
        <span>📱 +1 (555) 456-7890</span>
        <span>🔗 linkedin.com/in/emily</span>
        <span>📍 San Francisco, CA</span>
      </div>
    </div>
    
    {/* Key Metrics */}
    <div className="grid grid-cols-3 gap-3 mb-5">
      <div className="bg-orange-50 rounded-lg p-3 text-center">
        <p className="font-bold text-orange-600 text-xl">$5M+</p>
        <p className="text-gray-500 text-xs">Revenue Impact</p>
      </div>
      <div className="bg-orange-50 rounded-lg p-3 text-center">
        <p className="font-bold text-orange-600 text-xl">8</p>
        <p className="text-gray-500 text-xs">Products Launched</p>
      </div>
      <div className="bg-orange-50 rounded-lg p-3 text-center">
        <p className="font-bold text-orange-600 text-xl">2M+</p>
        <p className="text-gray-500 text-xs">Users Impacted</p>
      </div>
    </div>
    
    {/* Summary */}
    <div className="mb-5">
      <h2 className="text-sm md:text-base font-bold text-orange-600 mb-2 uppercase tracking-wide">Summary</h2>
      <p className="text-gray-700 text-xs md:text-sm">
        Product leader with 9+ years of experience driving product strategy at high-growth startups and Fortune 500 companies. 
        Expert at translating customer needs into product features that drive measurable business outcomes.
      </p>
    </div>
    
    {/* Skills */}
    <div className="mb-5">
      <h2 className="text-sm md:text-base font-bold text-orange-600 mb-2 uppercase tracking-wide">Skills</h2>
      <div className="flex flex-wrap gap-2">
        {['Product Strategy', 'Roadmapping', 'User Research', 'A/B Testing', 'Agile/Scrum', 'Data Analytics'].map(skill => (
          <span key={skill} className="px-3 py-1 bg-orange-50 text-orange-600 rounded-full text-xs font-medium border border-orange-200">
            {skill}
          </span>
        ))}
      </div>
    </div>
    
    {/* Experience */}
    <div className="mb-5">
      <h2 className="text-sm md:text-base font-bold text-orange-600 mb-2 uppercase tracking-wide">Experience</h2>
      <div className="space-y-3">
        <div>
          <div className="flex justify-between items-start flex-wrap gap-1">
            <div>
              <h3 className="font-semibold text-gray-800 text-sm">Senior Product Manager</h3>
              <p className="text-orange-600 text-xs">Stripe</p>
            </div>
            <span className="text-gray-500 text-xs">2021 - Present</span>
          </div>
          <ul className="mt-1 text-gray-600 text-xs space-y-0.5 list-disc list-inside">
            <li>Led payments product from 0 to $3M ARR</li>
            <li>Managed team of 15 engineers and designers</li>
          </ul>
        </div>
        <div>
          <div className="flex justify-between items-start flex-wrap gap-1">
            <div>
              <h3 className="font-semibold text-gray-800 text-sm">Product Manager</h3>
              <p className="text-orange-600 text-xs">Airbnb</p>
            </div>
            <span className="text-gray-500 text-xs">2018 - 2021</span>
          </div>
          <ul className="mt-1 text-gray-600 text-xs space-y-0.5 list-disc list-inside">
            <li>Increased booking conversion by 25% through checkout optimization</li>
            <li>Launched 3 new features reaching 1M+ users</li>
          </ul>
        </div>
      </div>
    </div>
    
    {/* Education */}
    <div className="mb-5">
      <h2 className="text-sm md:text-base font-bold text-orange-600 mb-2 uppercase tracking-wide">Education</h2>
      <div className="space-y-2">
        <div className="flex justify-between flex-wrap gap-1">
          <div>
            <h3 className="font-semibold text-gray-800 text-sm">MBA</h3>
            <p className="text-gray-600 text-xs">Harvard Business School</p>
          </div>
          <span className="text-gray-500 text-xs">2014 - 2016</span>
        </div>
        <div className="flex justify-between flex-wrap gap-1">
          <div>
            <h3 className="font-semibold text-gray-800 text-sm">B.A. Economics</h3>
            <p className="text-gray-600 text-xs">Yale University</p>
          </div>
          <span className="text-gray-500 text-xs">2010 - 2014</span>
        </div>
      </div>
    </div>

    {/* Languages */}
    <div className="mb-5">
      <h2 className="text-sm md:text-base font-bold text-orange-600 mb-2 uppercase tracking-wide">Languages</h2>
      <div className="flex gap-4 text-xs text-gray-600">
        <span>• English (Native)</span>
        <span>• French (Fluent)</span>
      </div>
    </div>

    {/* Achievements */}
    <div>
      <h2 className="text-sm md:text-base font-bold text-orange-600 mb-2 uppercase tracking-wide">Achievements</h2>
      <ul className="text-gray-600 text-xs space-y-1 list-disc list-inside">
        <li>Product of the Year award at company summit (2024)</li>
        <li>Grew user base from 100K to 2M in 18 months</li>
      </ul>
    </div>
  </div>
);

// Fresher/Student Full Preview
export const FresherFull: React.FC<FullPreviewProps> = ({ className = '' }) => (
  <div className={`w-full bg-white rounded-lg shadow-xl p-6 md:p-8 text-sm ${className}`}>
    {/* Header */}
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
    
    {/* Education - Highlighted for Fresher */}
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
        <li>Tau Beta Pi Engineering Honor Society</li>
        <li>Coursework: Algorithms, ML, Distributed Systems</li>
      </ul>
    </div>
    
    {/* Summary */}
    <div className="mb-5">
      <h2 className="text-sm md:text-base font-bold text-cyan-600 mb-2 uppercase tracking-wide">Summary</h2>
      <p className="text-gray-700 text-xs md:text-sm">
        Motivated Computer Science student with strong foundation in software development and data structures. 
        Seeking full-time SWE position to apply academic knowledge and internship experience to real-world challenges.
      </p>
    </div>
    
    {/* Skills */}
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
    
    {/* Internship */}
    <div className="mb-5">
      <h2 className="text-sm md:text-base font-bold text-cyan-600 mb-2 uppercase tracking-wide">Internship Experience</h2>
      <div>
        <div className="flex justify-between items-start flex-wrap gap-1">
          <div>
            <h3 className="font-semibold text-gray-800 text-sm">Software Engineering Intern</h3>
            <p className="text-cyan-600 text-xs">Google</p>
          </div>
          <span className="text-gray-500 text-xs">Summer 2023</span>
        </div>
        <ul className="mt-1 text-gray-600 text-xs space-y-0.5 list-disc list-inside">
          <li>Built internal tool used by 500+ engineers</li>
          <li>Improved CI/CD pipeline efficiency by 30%</li>
        </ul>
      </div>
    </div>
    
    {/* Projects */}
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

    {/* Languages */}
    <div className="mb-5">
      <h2 className="text-sm md:text-base font-bold text-cyan-600 mb-2 uppercase tracking-wide">Languages</h2>
      <div className="flex gap-4 text-xs text-gray-600">
        <span>• English (Native)</span>
        <span>• Hindi (Native)</span>
      </div>
    </div>

    {/* Certifications */}
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
    {/* Header */}
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
    
    {/* Stats Row */}
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
    
    {/* Summary */}
    <div className="mb-5">
      <h2 className="text-sm md:text-base font-bold text-rose-600 mb-2 uppercase tracking-wide">About Me</h2>
      <p className="text-gray-700 text-xs md:text-sm">
        Independent full-stack developer with 8+ years of experience building web and mobile applications for startups and enterprises. 
        Specialized in React, Node.js, and cloud architecture. 100% client satisfaction rate on 50+ completed projects.
      </p>
    </div>
    
    {/* Services */}
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
    
    {/* Tech Stack */}
    <div className="mb-5">
      <h2 className="text-sm md:text-base font-bold text-rose-600 mb-2 uppercase tracking-wide">Tech Stack</h2>
      <div className="flex flex-wrap gap-2">
        {['React', 'Next.js', 'Node.js', 'Python', 'AWS', 'Vercel', 'Figma', 'PostgreSQL'].map(tech => (
          <span key={tech} className="px-2 py-0.5 bg-rose-100 text-rose-700 rounded text-xs">
            {tech}
          </span>
        ))}
      </div>
    </div>
    
    {/* Featured Work */}
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
        <div className="bg-white p-3 rounded-lg shadow-sm border border-rose-100">
          <div className="flex justify-between items-start flex-wrap gap-1">
            <div>
              <h3 className="font-semibold text-gray-800 text-sm">Mobile App</h3>
              <p className="text-rose-600 text-xs">HealthTech Co.</p>
            </div>
            <span className="text-gray-500 text-xs">$40K Project</span>
          </div>
          <p className="text-gray-600 text-xs mt-1">React Native app with 50K+ downloads on App Store</p>
        </div>
      </div>
    </div>

    {/* Languages */}
    <div className="mb-5">
      <h2 className="text-sm md:text-base font-bold text-rose-600 mb-2 uppercase tracking-wide">Languages</h2>
      <div className="flex gap-4 text-xs text-gray-600">
        <span>• English (Native)</span>
        <span>• Spanish (Conversational)</span>
      </div>
    </div>

    {/* Testimonial */}
    <div>
      <h2 className="text-sm md:text-base font-bold text-rose-600 mb-2 uppercase tracking-wide">Testimonial</h2>
      <div className="bg-white p-3 rounded-lg border-l-4 border-rose-400 shadow-sm">
        <p className="text-gray-600 text-xs italic">"Mike delivered exceptional work on time and exceeded our expectations. Highly recommend!"</p>
        <p className="text-rose-600 text-xs font-medium mt-1">— CEO, TechStartup Inc.</p>
      </div>
    </div>
  </div>
);

// ============================================
// FULL PREVIEW TEMPLATES ARRAY
// ============================================

// Helper function to get full preview by template ID
export const getFullTemplatePreview = (templateId: string): React.FC<FullPreviewProps> => {
  const mapping: Record<string, React.FC<FullPreviewProps>> = {
    'software-engineer': SoftwareEngineerFull,
    'tech-focused': SoftwareEngineerFull,
    'mobile-app-developer': SoftwareEngineerFull,
    'qa-engineer': SoftwareEngineerFull,
    'systems-engineer': SoftwareEngineerFull,
    'data-scientist': DataScientistFull,
    'data-analyst': DataScientistFull,
    'research-analyst': DataScientistFull,
    'ai-ml-engineer': AIMLFull,
    'product-manager': ProductManagerFull,
    'project-manager': ProductManagerFull,
    'program-manager': ProductManagerFull,
    'operations-manager': ProductManagerFull,
    'financial-analyst': DataScientistFull,
    'accountant': ProductManagerFull,
    'sales-executive': FreelancerFull,
    'business-development': FreelancerFull,
    'content-writer': FreelancerFull,
    'social-media-manager': FreelancerFull,
    'seo-specialist': DataScientistFull,
    'graphic-designer': FreelancerFull,
    'video-editor': FreelancerFull,
    'healthcare-admin': ProductManagerFull,
    'clinical-research': DataScientistFull,
    'hr-manager': ProductManagerFull,
    'legal-assistant': ProductManagerFull,
    'admin-assistant': FresherFull,
    'ai-prompt-engineer': AIMLFull,
    'automation-specialist': SoftwareEngineerFull,
    'technical-writer': DataScientistFull,
    'fresher': FresherFull,
    'executive': ProductManagerFull,
    'freelancer': FreelancerFull,
  };
  return mapping[templateId] || SoftwareEngineerFull;
};

export const FULL_PREVIEW_TEMPLATES = [
  {
    id: 'tech-focused',
    name: 'Software Engineer',
    component: SoftwareEngineerFull,
    gradient: 'from-blue-500 to-indigo-600',
  },
  {
    id: 'data-science',
    name: 'Data Scientist',
    component: DataScientistFull,
    gradient: 'from-purple-500 to-pink-600',
  },
  {
    id: 'ai-ml',
    name: 'AI/ML Engineer',
    component: AIMLFull,
    gradient: 'from-green-500 to-teal-600',
  },
  {
    id: 'modern-minimal',
    name: 'Product Manager',
    component: ProductManagerFull,
    gradient: 'from-orange-500 to-red-600',
  },
  {
    id: 'fresher',
    name: 'Fresher / Student',
    component: FresherFull,
    gradient: 'from-cyan-500 to-blue-600',
  },
  {
    id: 'freelancer',
    name: 'Freelancer',
    component: FreelancerFull,
    gradient: 'from-pink-500 to-rose-600',
  },
];
