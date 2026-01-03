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

// Mobile App Developer Full Preview
export const MobileAppDeveloperFull: React.FC<FullPreviewProps> = ({ className = '' }) => (
  <div className={`w-full bg-white rounded-lg shadow-xl p-6 md:p-8 text-sm ${className}`}>
    {/* Header with app icons */}
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
    
    {/* App Portfolio Stats */}
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
    
    {/* Tech Stack */}
    <div className="mb-5">
      <h2 className="text-sm md:text-base font-bold text-green-600 mb-2 uppercase tracking-wide">Mobile Stack</h2>
      <div className="flex flex-wrap gap-2">
        {['Swift', 'Kotlin', 'React Native', 'Flutter', 'SwiftUI', 'Jetpack Compose'].map(tech => (
          <span key={tech} className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">{tech}</span>
        ))}
      </div>
    </div>
    
    {/* Featured Apps */}
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
    
    {/* Experience */}
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
  </div>
);

// QA Engineer Full Preview  
export const QAEngineerFull: React.FC<FullPreviewProps> = ({ className = '' }) => (
  <div className={`w-full bg-white rounded-lg shadow-xl overflow-hidden text-sm ${className}`}>
    <div className="h-2 bg-amber-500"></div>
    <div className="p-6 md:p-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-xl md:text-2xl font-bold text-gray-800 font-mono">Tom Tester</h1>
        <p className="text-amber-600 font-medium">Senior QA Automation Engineer</p>
        <div className="flex flex-wrap gap-3 text-gray-500 text-xs mt-2">
          <span>📧 tom@qaexpert.io</span>
          <span>📱 +1 (555) 789-0123</span>
          <span>🐛 ISTQB Certified</span>
        </div>
      </div>
    
    {/* Test Metrics */}
    <div className="grid grid-cols-4 gap-2 mb-5 bg-amber-50 p-3 rounded-lg">
      <div className="text-center">
        <div className="text-lg font-bold text-amber-600">99.5%</div>
        <div className="text-[10px] text-gray-500">Code Coverage</div>
      </div>
      <div className="text-center">
        <div className="text-lg font-bold text-amber-600">500+</div>
        <div className="text-[10px] text-gray-500">Test Cases</div>
      </div>
      <div className="text-center">
        <div className="text-lg font-bold text-amber-600">40%</div>
        <div className="text-[10px] text-gray-500">Bug Reduction</div>
      </div>
      <div className="text-center">
        <div className="text-lg font-bold text-amber-600">8hr→2hr</div>
        <div className="text-[10px] text-gray-500">Test Time</div>
      </div>
    </div>
    
    {/* Testing Tools */}
    <div className="mb-5">
      <h2 className="text-sm font-bold text-amber-600 mb-2 uppercase tracking-wide font-mono">Testing Stack</h2>
      <div className="flex flex-wrap gap-2">
        {['Selenium', 'Cypress', 'Jest', 'Playwright', 'Postman', 'JMeter', 'Appium'].map(tool => (
          <span key={tool} className="px-2 py-1 bg-amber-100 text-amber-700 rounded text-xs font-mono">{tool}</span>
        ))}
      </div>
    </div>
    
    {/* Experience */}
    <div className="mb-5">
      <h2 className="text-sm font-bold text-amber-600 mb-2 uppercase tracking-wide font-mono">Experience</h2>
      <div className="border-l-2 border-amber-300 pl-3 space-y-3">
        <div>
          <div className="flex justify-between">
            <h3 className="font-semibold text-gray-800 text-sm">Senior QA Engineer</h3>
            <span className="text-gray-500 text-xs font-mono">2022-Present</span>
          </div>
          <p className="text-amber-600 text-xs">TestCorp Solutions</p>
          <ul className="text-gray-600 text-xs mt-1 space-y-0.5 list-disc list-inside">
            <li>Built automation framework reducing test time by 75%</li>
            <li>Mentored team of 4 junior QA engineers</li>
          </ul>
        </div>
      </div>
    </div>
    
    {/* Certifications */}
    <div>
      <h2 className="text-sm font-bold text-amber-600 mb-2 uppercase tracking-wide font-mono">Certifications</h2>
      <div className="flex gap-2 text-xs">
        <span className="px-2 py-1 bg-gray-100 rounded">🏆 ISTQB Advanced</span>
        <span className="px-2 py-1 bg-gray-100 rounded">🏆 AWS DevOps</span>
      </div>
    </div>
    </div>
  </div>
);

// Data Analyst Full Preview
export const DataAnalystFull: React.FC<FullPreviewProps> = ({ className = '' }) => (
  <div className={`w-full bg-white rounded-lg shadow-xl p-6 md:p-8 text-sm ${className}`}>
    {/* Header with chart icon */}
    <div className="border-l-4 border-blue-500 pl-4 mb-6">
      <h1 className="text-xl md:text-2xl font-bold text-gray-800">Ryan Reports</h1>
      <p className="text-blue-600 font-medium">Senior Data Analyst</p>
      <div className="flex flex-wrap gap-3 text-gray-500 text-xs mt-2">
        <span>📧 ryan@datainsights.io</span>
        <span>📱 +1 (555) 321-6543</span>
        <span>📊 Tableau Public: 50K views</span>
      </div>
    </div>
    
    {/* Key Metrics */}
    <div className="bg-blue-50 rounded-lg p-4 mb-5">
      <div className="grid grid-cols-3 gap-4 text-center">
        <div>
          <div className="text-xl font-bold text-blue-600">$2.5M</div>
          <div className="text-xs text-gray-500">Cost Savings</div>
        </div>
        <div>
          <div className="text-xl font-bold text-blue-600">150+</div>
          <div className="text-xs text-gray-500">Reports Built</div>
        </div>
        <div>
          <div className="text-xl font-bold text-blue-600">35%</div>
          <div className="text-xs text-gray-500">Efficiency Gain</div>
        </div>
      </div>
    </div>
    
    {/* Tools */}
    <div className="mb-5">
      <h2 className="text-sm md:text-base font-bold text-blue-600 mb-3 uppercase tracking-wide">Analytics Tools</h2>
      <div className="grid grid-cols-2 gap-2">
        {[
          { name: 'SQL', level: 95 },
          { name: 'Excel/VBA', level: 90 },
          { name: 'Tableau', level: 85 },
          { name: 'Power BI', level: 80 },
        ].map(skill => (
          <div key={skill.name} className="flex items-center gap-2">
            <span className="text-xs text-gray-600 w-20">{skill.name}</span>
            <div className="flex-1 bg-blue-100 rounded-full h-2">
              <div className="bg-blue-500 h-2 rounded-full" style={{ width: `${skill.level}%` }}></div>
            </div>
          </div>
        ))}
      </div>
    </div>
    
    {/* Experience */}
    <div className="mb-5">
      <h2 className="text-sm md:text-base font-bold text-blue-600 mb-2 uppercase tracking-wide">Experience</h2>
      <div className="space-y-3">
        <div>
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-semibold text-gray-800 text-sm">Senior Data Analyst</h3>
              <p className="text-blue-600 text-xs">RetailCo Inc.</p>
            </div>
            <span className="text-gray-500 text-xs">2021 - Present</span>
          </div>
          <ul className="mt-1 text-gray-600 text-xs space-y-0.5 list-disc list-inside">
            <li>Built executive dashboards for C-suite decisions</li>
            <li>Automated weekly reporting saving 20 hours/week</li>
          </ul>
        </div>
      </div>
    </div>
  </div>
);

// Research Analyst Full Preview
export const ResearchAnalystFull: React.FC<FullPreviewProps> = ({ className = '' }) => (
  <div className={`w-full bg-white rounded-lg shadow-xl p-6 md:p-8 text-sm font-serif ${className}`}>
    {/* Academic Style Header */}
    <div className="text-center border-b border-gray-300 pb-4 mb-6">
      <h1 className="text-xl md:text-2xl font-bold text-gray-900">Dr. Emma Research</h1>
      <p className="text-violet-700 font-medium italic">Research Analyst | Market Intelligence</p>
      <div className="flex justify-center flex-wrap gap-4 text-gray-500 text-xs mt-2 font-sans">
        <span>📧 emma@research.org</span>
        <span>📱 +1 (555) 654-3210</span>
        <span>🔬 ResearchGate: 2K+ reads</span>
      </div>
    </div>
    
    {/* Research Focus */}
    <div className="bg-violet-50 border border-violet-200 rounded-lg p-4 mb-5">
      <h2 className="text-sm font-bold text-violet-700 mb-2">Research Expertise</h2>
      <p className="text-gray-700 text-xs">
        Specializing in market research, competitive intelligence, and consumer behavior analysis. 
        Published findings have influenced $50M+ in strategic decisions.
      </p>
    </div>
    
    {/* Methodology Skills */}
    <div className="mb-5">
      <h2 className="text-sm font-bold text-violet-700 mb-3 uppercase tracking-wide font-sans">Methodologies</h2>
      <div className="flex flex-wrap gap-2">
        {['Qualitative Research', 'Quantitative Analysis', 'Survey Design', 'Focus Groups', 'Data Mining'].map(method => (
          <span key={method} className="px-2 py-1 bg-violet-100 text-violet-700 rounded text-xs font-sans">{method}</span>
        ))}
      </div>
    </div>
    
    {/* Publications/Reports */}
    <div className="mb-5">
      <h2 className="text-sm font-bold text-violet-700 mb-2 uppercase tracking-wide font-sans">Key Reports</h2>
      <div className="space-y-2">
        <div className="border-l-2 border-violet-300 pl-3">
          <p className="text-gray-800 text-xs font-medium">"2024 Consumer Trends Analysis"</p>
          <p className="text-gray-500 text-[10px]">Featured in Industry Weekly • 10K+ downloads</p>
        </div>
        <div className="border-l-2 border-violet-300 pl-3">
          <p className="text-gray-800 text-xs font-medium">"Competitive Landscape: FinTech Sector"</p>
          <p className="text-gray-500 text-[10px]">Informed $25M investment strategy</p>
        </div>
      </div>
    </div>
    
    {/* Experience */}
    <div>
      <h2 className="text-sm font-bold text-violet-700 mb-2 uppercase tracking-wide font-sans">Experience</h2>
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-semibold text-gray-800 text-sm">Senior Research Analyst</h3>
          <p className="text-violet-600 text-xs font-sans">McKinsey & Company</p>
        </div>
        <span className="text-gray-500 text-xs font-sans">2020 - Present</span>
      </div>
    </div>
  </div>
);

// Project Manager Full Preview
export const ProjectManagerFull: React.FC<FullPreviewProps> = ({ className = '' }) => (
  <div className={`w-full bg-white rounded-lg shadow-xl p-6 md:p-8 text-sm ${className}`}>
    {/* Header with timeline accent */}
    <div className="border-b-2 border-emerald-500 pb-4 mb-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-gray-800">James Delivery</h1>
          <p className="text-emerald-600 font-medium">Senior Project Manager | PMP Certified</p>
        </div>
        <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-bold">PMP®</span>
      </div>
      <div className="flex flex-wrap gap-3 text-gray-500 text-xs mt-2">
        <span>📧 james@pmexpert.io</span>
        <span>📱 +1 (555) 111-2222</span>
      </div>
    </div>
    
    {/* Project Metrics */}
    <div className="grid grid-cols-4 gap-2 mb-5 bg-emerald-50 p-3 rounded-lg">
      <div className="text-center">
        <div className="text-lg font-bold text-emerald-600">50+</div>
        <div className="text-[10px] text-gray-500">Projects</div>
      </div>
      <div className="text-center">
        <div className="text-lg font-bold text-emerald-600">$15M</div>
        <div className="text-[10px] text-gray-500">Budget Managed</div>
      </div>
      <div className="text-center">
        <div className="text-lg font-bold text-emerald-600">95%</div>
        <div className="text-[10px] text-gray-500">On-Time</div>
      </div>
      <div className="text-center">
        <div className="text-lg font-bold text-emerald-600">20+</div>
        <div className="text-[10px] text-gray-500">Team Size</div>
      </div>
    </div>
    
    {/* PM Tools */}
    <div className="mb-5">
      <h2 className="text-sm font-bold text-emerald-600 mb-2 uppercase tracking-wide">PM Toolkit</h2>
      <div className="flex flex-wrap gap-2">
        {['Jira', 'Asana', 'MS Project', 'Confluence', 'Monday.com', 'Gantt Charts'].map(tool => (
          <span key={tool} className="px-2 py-1 bg-emerald-100 text-emerald-700 rounded text-xs">{tool}</span>
        ))}
      </div>
    </div>
    
    {/* Key Projects */}
    <div className="mb-5">
      <h2 className="text-sm font-bold text-emerald-600 mb-2 uppercase tracking-wide">Key Projects</h2>
      <div className="space-y-2">
        <div className="bg-gray-50 p-3 rounded-lg border-l-4 border-emerald-400">
          <h3 className="font-semibold text-gray-800 text-sm">ERP System Migration</h3>
          <p className="text-gray-500 text-xs">$5M budget • 18 months • 50+ stakeholders</p>
          <p className="text-emerald-600 text-xs mt-1">✓ Delivered 2 weeks early, 10% under budget</p>
        </div>
        <div className="bg-gray-50 p-3 rounded-lg border-l-4 border-emerald-400">
          <h3 className="font-semibold text-gray-800 text-sm">Cloud Infrastructure Overhaul</h3>
          <p className="text-gray-500 text-xs">$3M budget • 12 months • Cross-functional team of 25</p>
          <p className="text-emerald-600 text-xs mt-1">✓ Reduced operational costs by 40%</p>
        </div>
      </div>
    </div>
  </div>
);

// Program Manager Full Preview
export const ProgramManagerFull: React.FC<FullPreviewProps> = ({ className = '' }) => (
  <div className={`w-full bg-gradient-to-br from-slate-50 to-blue-50 rounded-lg shadow-xl p-6 md:p-8 text-sm ${className}`}>
    {/* Strategic Header */}
    <div className="mb-6">
      <div className="flex items-center gap-3 mb-2">
        <div className="w-12 h-12 bg-sky-600 rounded-lg flex items-center justify-center text-white font-bold text-lg">
          SP
        </div>
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-gray-900">Susan Programs</h1>
          <p className="text-sky-600 font-medium">Director of Program Management</p>
        </div>
      </div>
      <div className="flex flex-wrap gap-3 text-gray-500 text-xs mt-2 ml-15">
        <span>📧 susan@strategy.io</span>
        <span>📱 +1 (555) 333-4444</span>
        <span>🎯 PgMP® Certified</span>
      </div>
    </div>
    
    {/* Strategic Impact */}
    <div className="bg-white rounded-lg p-4 mb-5 shadow-sm">
      <h2 className="text-xs font-bold text-sky-600 uppercase tracking-wide mb-3">Strategic Impact</h2>
      <div className="grid grid-cols-2 gap-4">
        <div className="text-center p-2 bg-sky-50 rounded">
          <div className="text-xl font-bold text-sky-600">$100M+</div>
          <div className="text-xs text-gray-500">Portfolio Value</div>
        </div>
        <div className="text-center p-2 bg-sky-50 rounded">
          <div className="text-xl font-bold text-sky-600">15</div>
          <div className="text-xs text-gray-500">Concurrent Programs</div>
        </div>
        <div className="text-center p-2 bg-sky-50 rounded">
          <div className="text-xl font-bold text-sky-600">200+</div>
          <div className="text-xs text-gray-500">Team Members</div>
        </div>
        <div className="text-center p-2 bg-sky-50 rounded">
          <div className="text-xl font-bold text-sky-600">5</div>
          <div className="text-xs text-gray-500">Business Units</div>
        </div>
      </div>
    </div>
    
    {/* Core Competencies */}
    <div className="mb-5">
      <h2 className="text-sm font-bold text-sky-600 mb-2 uppercase tracking-wide">Core Competencies</h2>
      <div className="flex flex-wrap gap-2">
        {['Strategic Planning', 'Portfolio Management', 'Executive Communication', 'Risk Mitigation', 'Vendor Management'].map(skill => (
          <span key={skill} className="px-2 py-1 bg-sky-100 text-sky-700 rounded text-xs">{skill}</span>
        ))}
      </div>
    </div>
    
    {/* Program Highlights */}
    <div className="mb-5">
      <h2 className="text-sm font-bold text-sky-600 mb-2 uppercase tracking-wide">Program Highlights</h2>
      <div className="space-y-2">
        <div className="bg-white p-3 rounded-lg shadow-sm">
          <h3 className="font-semibold text-gray-800 text-sm">Digital Transformation Initiative</h3>
          <p className="text-gray-500 text-xs">8 projects • $40M • 3-year roadmap</p>
          <p className="text-sky-600 text-xs mt-1">Modernized legacy systems across 5 departments</p>
        </div>
        <div className="bg-white p-3 rounded-lg shadow-sm">
          <h3 className="font-semibold text-gray-800 text-sm">Global Expansion Program</h3>
          <p className="text-gray-500 text-xs">12 projects • $60M • Multi-region</p>
          <p className="text-sky-600 text-xs mt-1">Launched operations in 8 new markets</p>
        </div>
      </div>
    </div>
  </div>
);

// Financial Analyst Full Preview
export const FinancialAnalystFull: React.FC<FullPreviewProps> = ({ className = '' }) => (
  <div className={`w-full bg-white rounded-lg shadow-xl overflow-hidden text-sm ${className}`}>
    <div className="h-2 bg-green-700"></div>
    <div className="p-6 md:p-8">
      <header className="mb-6">
        <h1 className="text-xl md:text-2xl font-bold text-gray-900">David Finance</h1>
        <p className="text-green-700 font-medium">Senior Financial Analyst | CFA</p>
        <div className="flex flex-wrap gap-3 text-gray-500 text-xs mt-2">
          <span>📧 david@finance.io</span>
          <span>📱 +1 (555) 222-3333</span>
          <span>📊 Bloomberg Terminal</span>
      </div>
    </header>
    
    <div className="grid grid-cols-3 gap-3 mb-5 bg-green-50 p-4 rounded-lg">
      <div className="text-center">
        <div className="text-xl font-bold text-green-700">$50M</div>
        <div className="text-xs text-gray-500">Budget Analyzed</div>
      </div>
      <div className="text-center">
        <div className="text-xl font-bold text-green-700">15%</div>
        <div className="text-xs text-gray-500">Cost Reduction</div>
      </div>
      <div className="text-center">
        <div className="text-xl font-bold text-green-700">200+</div>
        <div className="text-xs text-gray-500">Reports Created</div>
      </div>
    </div>
    
    <div className="mb-5">
      <h2 className="text-sm font-bold text-green-700 mb-2 uppercase">Core Skills</h2>
      <div className="flex flex-wrap gap-2">
        {['Financial Modeling', 'DCF Analysis', 'Excel/VBA', 'SAP', 'Forecasting'].map(skill => (
          <span key={skill} className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs">{skill}</span>
        ))}
      </div>
    </div>
    
    <div className="mb-5">
      <h2 className="text-sm font-bold text-green-700 mb-2 uppercase">Experience</h2>
      <div className="border-l-2 border-green-300 pl-3">
        <h3 className="font-semibold text-gray-800 text-sm">Senior Financial Analyst</h3>
        <p className="text-green-600 text-xs">Goldman Sachs • 2020 - Present</p>
        <ul className="text-gray-600 text-xs mt-1 list-disc list-inside">
          <li>Led quarterly forecasting for $2B revenue stream</li>
          <li>Built automated reporting saving 30 hrs/month</li>
        </ul>
      </div>
    </div>
    </div>
  </div>
);

// Accountant Full Preview
export const AccountantFull: React.FC<FullPreviewProps> = ({ className = '' }) => (
  <div className={`w-full bg-gray-50 rounded-lg shadow-xl p-6 md:p-8 text-sm ${className}`}>
    <header className="bg-slate-700 text-white p-4 rounded-lg mb-6 -mx-2">
      <h1 className="text-xl font-bold">Jennifer Ledger</h1>
      <p className="text-slate-300 text-sm">Certified Public Accountant (CPA)</p>
      <div className="flex flex-wrap gap-3 text-slate-400 text-xs mt-2">
        <span>📧 jen@accounting.com</span>
        <span>📱 +1 (555) 444-5555</span>
      </div>
    </header>
    
    <div className="grid grid-cols-2 gap-4 mb-5">
      <div className="bg-white p-3 rounded border">
        <div className="text-lg font-bold text-slate-700">$10M+</div>
        <div className="text-xs text-gray-500">Audits Conducted</div>
      </div>
      <div className="bg-white p-3 rounded border">
        <div className="text-lg font-bold text-slate-700">100%</div>
        <div className="text-xs text-gray-500">Compliance Rate</div>
      </div>
    </div>
    
    <div className="mb-5">
      <h2 className="text-sm font-bold text-slate-700 mb-2">CERTIFICATIONS</h2>
      <div className="flex gap-2">
        <span className="px-2 py-1 bg-slate-200 rounded text-xs">CPA</span>
        <span className="px-2 py-1 bg-slate-200 rounded text-xs">CMA</span>
        <span className="px-2 py-1 bg-slate-200 rounded text-xs">QuickBooks Pro</span>
      </div>
    </div>
    
    <div>
      <h2 className="text-sm font-bold text-slate-700 mb-2">EXPERIENCE</h2>
      <div className="bg-white p-3 rounded border">
        <h3 className="font-semibold text-sm">Senior Accountant</h3>
        <p className="text-slate-600 text-xs">Deloitte • 2019 - Present</p>
        <ul className="text-gray-600 text-xs mt-1 list-disc list-inside">
          <li>Managed audits for Fortune 500 clients</li>
          <li>Reduced processing time by 25%</li>
        </ul>
      </div>
    </div>
  </div>
);

// Sales Executive Full Preview
export const SalesExecutiveFull: React.FC<FullPreviewProps> = ({ className = '' }) => (
  <div className={`w-full bg-gradient-to-br from-red-50 to-orange-50 rounded-lg shadow-xl p-6 md:p-8 text-sm ${className}`}>
    <header className="text-center mb-6">
      <div className="w-16 h-16 bg-red-500 rounded-full mx-auto mb-3 flex items-center justify-center text-white text-xl font-bold">RS</div>
      <h1 className="text-xl font-bold text-gray-900">Robert Sales</h1>
      <p className="text-red-600 font-medium">Enterprise Sales Executive</p>
      <div className="flex justify-center gap-3 text-gray-500 text-xs mt-2">
        <span>📧 robert@sales.io</span>
        <span>📱 +1 (555) 666-7777</span>
      </div>
    </header>
    
    <div className="grid grid-cols-3 gap-2 mb-5">
      <div className="bg-white p-3 rounded-lg text-center shadow-sm">
        <div className="text-xl font-bold text-red-600">$12M</div>
        <div className="text-[10px] text-gray-500">Annual Quota</div>
      </div>
      <div className="bg-white p-3 rounded-lg text-center shadow-sm">
        <div className="text-xl font-bold text-red-600">135%</div>
        <div className="text-[10px] text-gray-500">Quota Attainment</div>
      </div>
      <div className="bg-white p-3 rounded-lg text-center shadow-sm">
        <div className="text-xl font-bold text-red-600">50+</div>
        <div className="text-[10px] text-gray-500">Enterprise Deals</div>
      </div>
    </div>
    
    <div className="mb-5">
      <h2 className="text-sm font-bold text-red-600 mb-2">KEY WINS</h2>
      <div className="space-y-2">
        <div className="bg-white p-2 rounded border-l-4 border-red-400">
          <p className="text-xs font-medium">Closed $3M multi-year deal with Fortune 100</p>
        </div>
        <div className="bg-white p-2 rounded border-l-4 border-red-400">
          <p className="text-xs font-medium">Expanded key account by 400% YoY</p>
        </div>
      </div>
    </div>
  </div>
);

// Business Development Full Preview
export const BusinessDevelopmentFull: React.FC<FullPreviewProps> = ({ className = '' }) => (
  <div className={`w-full bg-white rounded-lg shadow-xl overflow-hidden text-sm ${className}`}>
    <div className="h-2 bg-purple-600"></div>
    <div className="p-6 md:p-8">
      <header className="mb-6">
        <h1 className="text-xl font-bold text-gray-900">Patricia Growth</h1>
        <p className="text-purple-600 font-medium">Director of Business Development</p>
        <div className="flex flex-wrap gap-3 text-gray-500 text-xs mt-2">
          <span>📧 patricia@bizdev.io</span>
          <span>📱 +1 (555) 888-9999</span>
          <span>🌐 15+ Countries</span>
        </div>
      </header>
      
      <div className="bg-purple-50 p-4 rounded-lg mb-5">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="text-2xl font-bold text-purple-600">$25M</div>
            <div className="text-xs text-gray-500">Pipeline Generated</div>
        </div>
        <div>
          <div className="text-2xl font-bold text-purple-600">40+</div>
          <div className="text-xs text-gray-500">Strategic Partnerships</div>
        </div>
      </div>
    </div>
    
    <div className="mb-5">
      <h2 className="text-sm font-bold text-purple-600 mb-2">PARTNERSHIPS</h2>
      <div className="flex flex-wrap gap-2">
        {['Microsoft', 'Salesforce', 'AWS', 'Oracle'].map(partner => (
          <span key={partner} className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs">{partner}</span>
        ))}
      </div>
    </div>
    
    <div>
      <h2 className="text-sm font-bold text-purple-600 mb-2">EXPERIENCE</h2>
      <div>
        <h3 className="font-semibold text-sm">VP Business Development</h3>
        <p className="text-purple-600 text-xs">TechGiant Corp • 2021 - Present</p>
      </div>
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
      <h2 className="text-sm font-bold text-pink-600 mb-2">EXPERTISE</h2>
      <div className="flex flex-wrap gap-2">
        {['SEO Writing', 'Long-form', 'Technical', 'Copywriting', 'B2B'].map(skill => (
          <span key={skill} className="px-2 py-1 bg-pink-100 text-pink-700 rounded text-xs">{skill}</span>
        ))}
      </div>
    </div>
    
    <div>
      <h2 className="text-sm font-bold text-pink-600 mb-2">PUBLISHED IN</h2>
      <p className="text-gray-600 text-xs">Forbes, TechCrunch, HBR, Wired, Fast Company</p>
    </div>
    </div>
  </div>
);

// Social Media Manager Full Preview
export const SocialMediaManagerFull: React.FC<FullPreviewProps> = ({ className = '' }) => (
  <div className={`w-full bg-white rounded-lg shadow-xl overflow-hidden text-sm ${className}`}>
    <div className="h-2 bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500"></div>
    <div className="p-6 md:p-8">
      <header className="mb-6">
        <h1 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-600 to-purple-600">
          Sofia Social
        </h1>
        <p className="text-gray-600 font-medium">Social Media Manager</p>
        <div className="flex gap-2 mt-2">
          <span className="px-2 py-0.5 bg-pink-100 text-pink-600 rounded text-xs">📷 @sofia</span>
          <span className="px-2 py-0.5 bg-blue-100 text-blue-600 rounded text-xs">🐦 @sofia</span>
          <span className="px-2 py-0.5 bg-red-100 text-red-600 rounded text-xs">📺 @sofia</span>
        </div>
      </header>
    
    <div className="grid grid-cols-3 gap-2 mb-5">
      <div className="bg-gradient-to-br from-pink-500 to-purple-500 p-3 rounded-lg text-white text-center">
        <div className="text-lg font-bold">2M+</div>
        <div className="text-[10px] opacity-80">Followers</div>
      </div>
      <div className="bg-gradient-to-br from-blue-500 to-cyan-500 p-3 rounded-lg text-white text-center">
        <div className="text-lg font-bold">8%</div>
        <div className="text-[10px] opacity-80">Engagement</div>
      </div>
      <div className="bg-gradient-to-br from-yellow-500 to-orange-500 p-3 rounded-lg text-white text-center">
        <div className="text-lg font-bold">50+</div>
        <div className="text-[10px] opacity-80">Campaigns</div>
      </div>
    </div>
    
    <div className="mb-5">
      <h2 className="text-sm font-bold text-gray-900 mb-2">PLATFORMS</h2>
      <div className="flex flex-wrap gap-2">
        {['Instagram', 'TikTok', 'Twitter', 'LinkedIn', 'YouTube'].map(platform => (
          <span key={platform} className="px-2 py-1 bg-gray-100 rounded-full text-xs">{platform}</span>
        ))}
      </div>
    </div>
    </div>
  </div>
);

// SEO Specialist Full Preview
export const SEOSpecialistFull: React.FC<FullPreviewProps> = ({ className = '' }) => (
  <div className={`w-full bg-white rounded-lg shadow-xl p-6 md:p-8 text-sm ${className}`}>
    <header className="border-b border-green-200 pb-4 mb-5">
      <h1 className="text-xl font-bold text-gray-900">Kevin Rankings</h1>
      <p className="text-green-600 font-medium">Senior SEO Specialist</p>
      <div className="flex flex-wrap gap-3 text-gray-500 text-xs mt-2">
        <span>📧 kevin@seo.io</span>
        <span>🔍 Google Certified</span>
      </div>
    </header>
    
    <div className="bg-green-50 p-4 rounded-lg mb-5">
      <h2 className="text-xs font-bold text-green-700 mb-3">RANKING IMPROVEMENTS</h2>
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-xs">Organic Traffic</span>
          <span className="text-green-600 font-bold text-sm">+340%</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-xs">Page 1 Keywords</span>
          <span className="text-green-600 font-bold text-sm">+150</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-xs">Domain Authority</span>
          <span className="text-green-600 font-bold text-sm">45 → 72</span>
        </div>
      </div>
    </div>
    
    <div className="mb-5">
      <h2 className="text-sm font-bold text-green-600 mb-2">TOOLS</h2>
      <div className="flex flex-wrap gap-2">
        {['Ahrefs', 'SEMrush', 'Screaming Frog', 'GSC', 'GA4'].map(tool => (
          <span key={tool} className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs">{tool}</span>
        ))}
      </div>
    </div>
  </div>
);

// Graphic Designer Full Preview
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
      <h2 className="text-sm font-bold text-indigo-600 mb-2">DESIGN TOOLS</h2>
      <div className="flex flex-wrap gap-2">
        {['Figma', 'Photoshop', 'Illustrator', 'After Effects', 'Sketch'].map(tool => (
          <span key={tool} className="px-2 py-1 bg-white text-indigo-700 rounded shadow-sm text-xs">{tool}</span>
        ))}
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
      <h2 className="text-sm font-bold text-red-500 mb-2">EDITING SUITE</h2>
      <div className="flex flex-wrap gap-2">
        {['Premiere Pro', 'DaVinci', 'After Effects', 'Final Cut'].map(tool => (
          <span key={tool} className="px-2 py-1 bg-slate-800 text-slate-300 rounded text-xs">{tool}</span>
        ))}
      </div>
    </div>
  </div>
);

// Healthcare Admin Full Preview
export const HealthcareAdminFull: React.FC<FullPreviewProps> = ({ className = '' }) => (
  <div className={`w-full bg-white rounded-lg shadow-xl overflow-hidden text-sm ${className}`}>
    <div className="h-2 bg-cyan-500"></div>
    <div className="p-6 md:p-8">
      <header className="mb-6">
        <h1 className="text-xl font-bold text-gray-900">Helen Health</h1>
        <p className="text-cyan-600 font-medium">Healthcare Administrator</p>
        <div className="flex flex-wrap gap-3 text-gray-500 text-xs mt-2">
          <span>📧 helen@healthcare.org</span>
          <span>🏥 HIPAA Certified</span>
        </div>
      </header>
    
    <div className="bg-cyan-50 p-4 rounded-lg mb-5">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <div className="text-xl font-bold text-cyan-600">500+</div>
          <div className="text-xs text-gray-500">Beds Managed</div>
        </div>
        <div>
          <div className="text-xl font-bold text-cyan-600">98%</div>
          <div className="text-xs text-gray-500">Patient Satisfaction</div>
        </div>
      </div>
    </div>
    
    <div className="mb-5">
      <h2 className="text-sm font-bold text-cyan-600 mb-2">CERTIFICATIONS</h2>
      <div className="flex flex-wrap gap-2">
        {['HIPAA', 'OSHA', 'Joint Commission', 'Epic Systems'].map(cert => (
          <span key={cert} className="px-2 py-1 bg-cyan-100 text-cyan-700 rounded text-xs">{cert}</span>
        ))}
      </div>
    </div>
    
    <div>
      <h2 className="text-sm font-bold text-cyan-600 mb-2">EXPERIENCE</h2>
      <div>
        <h3 className="font-semibold text-sm">Director of Operations</h3>
        <p className="text-cyan-600 text-xs">City General Hospital • 2019 - Present</p>
      </div>
    </div>
  </div>
  </div>
);

// Clinical Research Full Preview
export const ClinicalResearchFull: React.FC<FullPreviewProps> = ({ className = '' }) => (
  <div className={`w-full bg-white rounded-lg shadow-xl p-6 md:p-8 text-sm font-serif ${className}`}>
    <header className="text-center border-b-2 border-teal-500 pb-4 mb-5">
      <h1 className="text-xl font-bold text-gray-900">Dr. Clara Clinical</h1>
      <p className="text-teal-600 font-medium">Clinical Research Associate</p>
      <div className="flex justify-center gap-3 text-gray-500 text-xs mt-2 font-sans">
        <span>📧 clara@research.edu</span>
        <span>🔬 NIH Funded</span>
      </div>
    </header>
    
    <div className="bg-teal-50 p-4 rounded-lg mb-5 font-sans">
      <h2 className="text-xs font-bold text-teal-700 mb-2">RESEARCH IMPACT</h2>
      <div className="grid grid-cols-3 gap-2 text-center">
        <div>
          <div className="text-lg font-bold text-teal-600">25</div>
          <div className="text-[10px] text-gray-500">Clinical Trials</div>
        </div>
        <div>
          <div className="text-lg font-bold text-teal-600">12</div>
          <div className="text-[10px] text-gray-500">Publications</div>
        </div>
        <div>
          <div className="text-lg font-bold text-teal-600">$5M</div>
          <div className="text-[10px] text-gray-500">Grant Funding</div>
        </div>
      </div>
    </div>
    
    <div className="mb-5">
      <h2 className="text-sm font-bold text-teal-600 mb-2 font-sans">THERAPEUTIC AREAS</h2>
      <div className="flex flex-wrap gap-2 font-sans">
        {['Oncology', 'Neurology', 'Cardiology', 'Phase I-III'].map(area => (
          <span key={area} className="px-2 py-1 bg-teal-100 text-teal-700 rounded text-xs">{area}</span>
        ))}
      </div>
    </div>
  </div>
);

// HR Manager Full Preview
export const HRManagerFull: React.FC<FullPreviewProps> = ({ className = '' }) => (
  <div className={`w-full bg-white rounded-lg shadow-xl p-6 md:p-8 text-sm ${className}`}>
    <header className="bg-orange-500 text-white p-4 rounded-lg mb-6 -mx-2">
      <h1 className="text-xl font-bold">Hannah Human</h1>
      <p className="text-orange-100">Senior HR Manager | SHRM-CP</p>
      <div className="flex flex-wrap gap-3 text-orange-200 text-xs mt-2">
        <span>📧 hannah@hr.com</span>
        <span>📱 +1 (555) 777-8888</span>
      </div>
    </header>
    
    <div className="grid grid-cols-3 gap-3 mb-5">
      <div className="text-center p-3 bg-orange-50 rounded-lg">
        <div className="text-lg font-bold text-orange-600">500+</div>
        <div className="text-[10px] text-gray-500">Hires Made</div>
      </div>
      <div className="text-center p-3 bg-orange-50 rounded-lg">
        <div className="text-lg font-bold text-orange-600">25%</div>
        <div className="text-[10px] text-gray-500">Turnover Reduced</div>
      </div>
      <div className="text-center p-3 bg-orange-50 rounded-lg">
        <div className="text-lg font-bold text-orange-600">15</div>
        <div className="text-[10px] text-gray-500">Policies Created</div>
      </div>
    </div>
    
    <div className="mb-5">
      <h2 className="text-sm font-bold text-orange-600 mb-2">HR SYSTEMS</h2>
      <div className="flex flex-wrap gap-2">
        {['Workday', 'BambooHR', 'Greenhouse', 'ADP'].map(system => (
          <span key={system} className="px-2 py-1 bg-orange-100 text-orange-700 rounded text-xs">{system}</span>
        ))}
      </div>
    </div>
  </div>
);

// Legal Assistant Full Preview
export const LegalAssistantFull: React.FC<FullPreviewProps> = ({ className = '' }) => (
  <div className={`w-full bg-gray-50 rounded-lg shadow-xl p-6 md:p-8 text-sm font-serif ${className}`}>
    <header className="border-b-2 border-gray-800 pb-4 mb-5">
      <h1 className="text-xl font-bold text-gray-900">Lawrence Legal</h1>
      <p className="text-gray-600 font-medium">Senior Legal Assistant | Paralegal</p>
      <div className="flex flex-wrap gap-3 text-gray-500 text-xs mt-2 font-sans">
        <span>📧 lawrence@law.firm</span>
        <span>⚖️ ABA Certified</span>
      </div>
    </header>
    
    <div className="bg-white p-4 rounded border mb-5 font-sans">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <div className="text-lg font-bold text-gray-800">200+</div>
          <div className="text-xs text-gray-500">Cases Supported</div>
        </div>
        <div>
          <div className="text-lg font-bold text-gray-800">$50M</div>
          <div className="text-xs text-gray-500">Litigation Value</div>
        </div>
      </div>
    </div>
    
    <div className="mb-5 font-sans">
      <h2 className="text-sm font-bold text-gray-800 mb-2">PRACTICE AREAS</h2>
      <div className="flex flex-wrap gap-2">
        {['Corporate Law', 'Litigation', 'IP Law', 'Contract Review'].map(area => (
          <span key={area} className="px-2 py-1 bg-gray-200 text-gray-700 rounded text-xs">{area}</span>
        ))}
      </div>
    </div>
  </div>
);

// Admin Assistant Full Preview
export const AdminAssistantFull: React.FC<FullPreviewProps> = ({ className = '' }) => (
  <div className={`w-full bg-white rounded-lg shadow-xl p-6 md:p-8 text-sm ${className}`}>
    <header className="bg-slate-600 text-white p-4 rounded-lg mb-6 -mx-2">
      <h1 className="text-xl font-bold">Alice Admin</h1>
      <p className="text-slate-300">Executive Administrative Assistant</p>
      <div className="flex flex-wrap gap-3 text-slate-400 text-xs mt-2">
        <span>📧 alice@admin.com</span>
        <span>📱 +1 (555) 999-0000</span>
      </div>
    </header>
    
    <div className="grid grid-cols-3 gap-3 mb-5">
      <div className="text-center p-3 bg-slate-100 rounded-lg">
        <div className="text-lg font-bold text-slate-700">5</div>
        <div className="text-[10px] text-gray-500">Executives</div>
      </div>
      <div className="text-center p-3 bg-slate-100 rounded-lg">
        <div className="text-lg font-bold text-slate-700">200+</div>
        <div className="text-[10px] text-gray-500">Meetings/Month</div>
      </div>
      <div className="text-center p-3 bg-slate-100 rounded-lg">
        <div className="text-lg font-bold text-slate-700">10</div>
        <div className="text-[10px] text-gray-500">Years Exp</div>
      </div>
    </div>
    
    <div className="mb-5">
      <h2 className="text-sm font-bold text-slate-600 mb-2">SKILLS</h2>
      <div className="flex flex-wrap gap-2">
        {['Calendar Mgmt', 'Travel Planning', 'MS Office', 'SAP', 'Concur'].map(skill => (
          <span key={skill} className="px-2 py-1 bg-slate-100 text-slate-700 rounded text-xs">{skill}</span>
        ))}
      </div>
    </div>
  </div>
);

// AI Prompt Engineer Full Preview
export const AIPromptEngineerFull: React.FC<FullPreviewProps> = ({ className = '' }) => (
  <div className={`w-full bg-gradient-to-br from-violet-900 to-purple-900 rounded-lg shadow-xl p-6 md:p-8 text-sm ${className}`}>
    <header className="mb-6">
      <h1 className="text-xl font-bold text-white">Priya Prompts</h1>
      <p className="text-violet-300 font-medium">AI Prompt Engineer</p>
      <div className="flex flex-wrap gap-3 text-violet-400 text-xs mt-2">
        <span>📧 priya@ai.dev</span>
        <span>🤖 OpenAI Certified</span>
      </div>
    </header>
    
    <div className="bg-violet-800/50 p-4 rounded-lg mb-5">
      <h2 className="text-xs font-bold text-violet-300 mb-2">MODELS WORKED WITH</h2>
      <div className="flex flex-wrap gap-2">
        {['GPT-4', 'Claude', 'Gemini', 'Llama', 'Midjourney'].map(model => (
          <span key={model} className="px-2 py-1 bg-violet-700 text-violet-200 rounded text-xs">{model}</span>
        ))}
      </div>
    </div>
    
    <div className="grid grid-cols-2 gap-3 mb-5">
      <div className="bg-violet-800/30 p-3 rounded text-center">
        <div className="text-lg font-bold text-violet-300">1000+</div>
        <div className="text-[10px] text-violet-400">Prompts Designed</div>
      </div>
      <div className="bg-violet-800/30 p-3 rounded text-center">
        <div className="text-lg font-bold text-violet-300">40%</div>
        <div className="text-[10px] text-violet-400">Efficiency Gain</div>
      </div>
    </div>
  </div>
);

// Automation Specialist Full Preview
export const AutomationSpecialistFull: React.FC<FullPreviewProps> = ({ className = '' }) => (
  <div className={`w-full bg-white rounded-lg shadow-xl text-sm overflow-hidden ${className}`}>
    <div className="h-1 bg-cyan-500"></div>
    <div className="p-6 md:p-8">
    <header className="mb-6">
      <h1 className="text-xl font-bold text-gray-900">Zack Zapier</h1>
      <p className="text-cyan-600 font-medium">Automation Specialist</p>
      <div className="flex flex-wrap gap-3 text-gray-500 text-xs mt-2">
        <span>📧 zack@automate.io</span>
        <span>⚡ 500+ Workflows</span>
      </div>
    </header>
    
    <div className="bg-cyan-50 p-4 rounded-lg mb-5">
      <div className="grid grid-cols-3 gap-3 text-center">
        <div>
          <div className="text-lg font-bold text-cyan-600">500+</div>
          <div className="text-[10px] text-gray-500">Automations</div>
        </div>
        <div>
          <div className="text-lg font-bold text-cyan-600">2000</div>
          <div className="text-[10px] text-gray-500">Hours Saved</div>
        </div>
        <div>
          <div className="text-lg font-bold text-cyan-600">$1M</div>
          <div className="text-[10px] text-gray-500">Cost Saved</div>
        </div>
      </div>
    </div>
    
    <div className="mb-5">
      <h2 className="text-sm font-bold text-cyan-600 mb-2">PLATFORMS</h2>
      <div className="flex flex-wrap gap-2">
        {['Zapier', 'Make', 'n8n', 'Power Automate', 'Integromat'].map(tool => (
          <span key={tool} className="px-2 py-1 bg-cyan-100 text-cyan-700 rounded text-xs">{tool}</span>
        ))}
      </div>
    </div>
    </div>
  </div>
);

// Technical Writer Full Preview
export const TechnicalWriterFull: React.FC<FullPreviewProps> = ({ className = '' }) => (
  <div className={`w-full bg-white rounded-lg shadow-xl p-6 md:p-8 text-sm ${className}`}>
    <header className="border-b border-gray-300 pb-4 mb-5">
      <h1 className="text-xl font-bold text-gray-900 font-mono">Terry Technical</h1>
      <p className="text-gray-600 font-medium">Senior Technical Writer</p>
      <div className="flex flex-wrap gap-3 text-gray-500 text-xs mt-2">
        <span>📧 terry@docs.io</span>
        <span>📚 500+ Articles</span>
      </div>
    </header>
    
    <div className="bg-gray-50 p-4 rounded-lg mb-5 font-mono text-xs">
      <div className="text-gray-500 mb-1">// Documentation Stats</div>
      <div className="text-gray-800">pages_written: <span className="text-green-600">2,500+</span></div>
      <div className="text-gray-800">api_docs: <span className="text-blue-600">150+</span></div>
      <div className="text-gray-800">user_guides: <span className="text-purple-600">75+</span></div>
    </div>
    
    <div className="mb-5">
      <h2 className="text-sm font-bold text-gray-700 mb-2">DOCUMENTATION TOOLS</h2>
      <div className="flex flex-wrap gap-2">
        {['Confluence', 'GitBook', 'Readme', 'Swagger', 'Markdown'].map(tool => (
          <span key={tool} className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs font-mono">{tool}</span>
        ))}
      </div>
    </div>
  </div>
);

// Operations Manager Full Preview
export const OperationsManagerFull: React.FC<FullPreviewProps> = ({ className = '' }) => (
  <div className={`w-full bg-white rounded-lg shadow-xl p-6 md:p-8 text-sm ${className}`}>
    <header className="bg-teal-600 text-white p-4 rounded-lg mb-6 -mx-2">
      <h1 className="text-xl font-bold">Oliver Operations</h1>
      <p className="text-teal-100">Director of Operations</p>
      <div className="flex flex-wrap gap-3 text-teal-200 text-xs mt-2">
        <span>📧 oliver@ops.io</span>
        <span>📱 +1 (555) 111-2222</span>
      </div>
    </header>
    
    <div className="grid grid-cols-4 gap-2 mb-5">
      <div className="text-center p-2 bg-teal-50 rounded">
        <div className="text-lg font-bold text-teal-600">30%</div>
        <div className="text-[10px] text-gray-500">Cost Cut</div>
      </div>
      <div className="text-center p-2 bg-teal-50 rounded">
        <div className="text-lg font-bold text-teal-600">$50M</div>
        <div className="text-[10px] text-gray-500">P&L</div>
      </div>
      <div className="text-center p-2 bg-teal-50 rounded">
        <div className="text-lg font-bold text-teal-600">200+</div>
        <div className="text-[10px] text-gray-500">Team</div>
      </div>
      <div className="text-center p-2 bg-teal-50 rounded">
        <div className="text-lg font-bold text-teal-600">5</div>
        <div className="text-[10px] text-gray-500">Sites</div>
      </div>
    </div>
    
    <div className="mb-5">
      <h2 className="text-sm font-bold text-teal-600 mb-2">EXPERTISE</h2>
      <div className="flex flex-wrap gap-2">
        {['Lean Six Sigma', 'Supply Chain', 'Process Optimization', 'Vendor Mgmt'].map(skill => (
          <span key={skill} className="px-2 py-1 bg-teal-100 text-teal-700 rounded text-xs">{skill}</span>
        ))}
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
      <h2 className="text-sm font-bold text-slate-700 mb-2">INFRASTRUCTURE</h2>
      <div className="flex flex-wrap gap-2">
        {['AWS', 'Kubernetes', 'Terraform', 'Ansible', 'Linux'].map(tech => (
          <span key={tech} className="px-2 py-1 bg-slate-700 text-white rounded text-xs font-mono">{tech}</span>
        ))}
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
    // Engineering & Technology
    'software-engineer': SoftwareEngineerFull,
    'tech-focused': SoftwareEngineerFull,
    'mobile-app-developer': MobileAppDeveloperFull,
    'qa-engineer': QAEngineerFull,
    'systems-engineer': SystemsEngineerFull,
    // Data & Analytics
    'data-scientist': DataScientistFull,
    'data-analyst': DataAnalystFull,
    'research-analyst': ResearchAnalystFull,
    'ai-ml-engineer': AIMLFull,
    // Management
    'product-manager': ProductManagerFull,
    'project-manager': ProjectManagerFull,
    'program-manager': ProgramManagerFull,
    'operations-manager': OperationsManagerFull,
    // Business & Finance
    'financial-analyst': FinancialAnalystFull,
    'accountant': AccountantFull,
    'sales-executive': SalesExecutiveFull,
    'business-development': BusinessDevelopmentFull,
    // Marketing & Content
    'content-writer': ContentWriterFull,
    'social-media-manager': SocialMediaManagerFull,
    'seo-specialist': SEOSpecialistFull,
    // Creative
    'graphic-designer': GraphicDesignerFull,
    'video-editor': VideoEditorFull,
    // Healthcare
    'healthcare-admin': HealthcareAdminFull,
    'clinical-research': ClinicalResearchFull,
    // HR & Admin
    'hr-manager': HRManagerFull,
    'legal-assistant': LegalAssistantFull,
    'admin-assistant': AdminAssistantFull,
    // Emerging Roles
    'ai-prompt-engineer': AIPromptEngineerFull,
    'automation-specialist': AutomationSpecialistFull,
    'technical-writer': TechnicalWriterFull,
    // General
    'fresher': FresherFull,
    'executive': ExecutiveFull,
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
