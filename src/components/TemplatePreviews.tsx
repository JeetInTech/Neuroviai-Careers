import React from 'react';

// ============================================
// MINI CV PREVIEW COMPONENTS
// Shows actual template layout with demo content
// ============================================

interface PreviewProps {
  className?: string;
  size?: 'mini' | 'full';
}

// Software Engineer Template Preview
export const SoftwareEngineerPreview: React.FC<PreviewProps> = ({ className = '', size = 'mini' }) => {
  if (size === 'full') {
    return (
      <div className={`w-full bg-white rounded-lg shadow-xl p-8 text-sm ${className}`}>
        {/* Header */}
        <div className="border-b-2 border-indigo-500 pb-4 mb-6">
          <h1 className="text-2xl font-bold text-gray-800">John Developer</h1>
          <p className="text-indigo-600 font-medium">Senior Software Engineer</p>
          <div className="flex flex-wrap gap-4 text-gray-500 text-sm mt-2">
            <span>📧 john.developer@email.com</span>
            <span>📱 +1 (555) 123-4567</span>
            <span>🔗 github.com/johndev</span>
            <span>💼 linkedin.com/in/johndev</span>
          </div>
        </div>
        
        {/* Summary */}
        <div className="mb-6">
          <h2 className="text-lg font-bold text-indigo-600 mb-2 uppercase tracking-wide">Professional Summary</h2>
          <p className="text-gray-600">
            Results-driven Senior Software Engineer with 6+ years of experience building scalable web applications. 
            Expert in React, TypeScript, and Node.js with a track record of leading high-performance teams and 
            delivering projects that increased user engagement by 40%.
          </p>
        </div>
        
        {/* Skills */}
        <div className="mb-6">
          <h2 className="text-lg font-bold text-indigo-600 mb-3 uppercase tracking-wide">Technical Skills</h2>
          <div className="flex flex-wrap gap-2">
            {['React', 'TypeScript', 'Node.js', 'Python', 'AWS', 'Docker', 'PostgreSQL', 'GraphQL', 'Redis', 'Kubernetes'].map(skill => (
              <span key={skill} className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-sm font-medium">{skill}</span>
            ))}
          </div>
        </div>
        
        {/* Experience */}
        <div className="mb-6">
          <h2 className="text-lg font-bold text-indigo-600 mb-3 uppercase tracking-wide">Experience</h2>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold text-gray-800">Senior Software Engineer</h3>
                  <p className="text-indigo-600">TechCorp Inc.</p>
                </div>
                <span className="text-gray-500 text-sm">2022 - Present</span>
              </div>
              <ul className="mt-2 text-gray-600 space-y-1 list-disc list-inside">
                <li>Led a team of 5 engineers to deliver a microservices architecture serving 1M+ users</li>
                <li>Reduced API response time by 60% through optimization and caching strategies</li>
                <li>Implemented CI/CD pipeline reducing deployment time from 2 hours to 15 minutes</li>
              </ul>
            </div>
            <div>
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold text-gray-800">Software Engineer</h3>
                  <p className="text-indigo-600">StartupXYZ</p>
                </div>
                <span className="text-gray-500 text-sm">2019 - 2022</span>
              </div>
              <ul className="mt-2 text-gray-600 space-y-1 list-disc list-inside">
                <li>Built real-time collaboration features using WebSockets and Redis</li>
                <li>Developed RESTful APIs handling 10K+ requests per minute</li>
              </ul>
            </div>
          </div>
        </div>
        
        {/* Projects */}
        <div className="mb-6">
          <h2 className="text-lg font-bold text-indigo-600 mb-3 uppercase tracking-wide">Projects</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-50 p-3 rounded-lg">
              <h3 className="font-semibold text-gray-800">E-Commerce Platform</h3>
              <p className="text-gray-500 text-sm">React, Node.js, MongoDB, Stripe</p>
              <p className="text-gray-600 text-sm mt-1">Full-stack marketplace with real-time inventory</p>
            </div>
            <div className="bg-gray-50 p-3 rounded-lg">
              <h3 className="font-semibold text-gray-800">DevOps Dashboard</h3>
              <p className="text-gray-500 text-sm">Vue.js, Python, Docker, Kubernetes</p>
              <p className="text-gray-600 text-sm mt-1">Monitoring tool for container orchestration</p>
            </div>
          </div>
        </div>
        
        {/* Education */}
        <div>
          <h2 className="text-lg font-bold text-indigo-600 mb-3 uppercase tracking-wide">Education</h2>
          <div className="flex justify-between">
            <div>
              <h3 className="font-semibold text-gray-800">B.S. Computer Science</h3>
              <p className="text-gray-600">Stanford University</p>
            </div>
            <span className="text-gray-500">2015 - 2019</span>
          </div>
        </div>
      </div>
    );
  }
  
  // Mini version (original)
  return (
    <div className={`w-full h-full bg-white rounded-sm shadow-inner p-2 text-[6px] leading-tight overflow-hidden ${className}`}>
      {/* Header */}
      <div className="border-b border-gray-200 pb-1 mb-1">
        <div className="font-bold text-[8px] text-gray-800">John Developer</div>
        <div className="text-gray-500 text-[5px]">Senior Software Engineer</div>
        <div className="flex gap-1 text-gray-400 text-[4px] mt-0.5">
          <span>📧 john@email.com</span>
          <span>📱 +1 234-567</span>
          <span>🔗 github.com/john</span>
        </div>
      </div>
      
      {/* Skills */}
      <div className="mb-1">
        <div className="font-semibold text-indigo-600 text-[5px] mb-0.5">TECHNICAL SKILLS</div>
        <div className="flex flex-wrap gap-0.5">
          {['React', 'TypeScript', 'Node.js', 'Python', 'AWS'].map(skill => (
            <span key={skill} className="bg-indigo-100 text-indigo-700 px-1 rounded text-[4px]">{skill}</span>
          ))}
        </div>
      </div>
      
      {/* Experience */}
      <div className="mb-1">
        <div className="font-semibold text-indigo-600 text-[5px] mb-0.5">EXPERIENCE</div>
        <div className="mb-0.5">
          <div className="font-medium text-gray-800">Senior Developer • TechCorp</div>
          <div className="text-gray-400 text-[4px]">2022 - Present</div>
          <div className="text-gray-600 text-[4px]">• Led team of 5 engineers</div>
          <div className="text-gray-600 text-[4px]">• Built scalable microservices</div>
        </div>
      </div>
      
      {/* Projects */}
      <div>
        <div className="font-semibold text-indigo-600 text-[5px] mb-0.5">PROJECTS</div>
        <div className="text-gray-600">
          <span className="font-medium text-gray-800">E-Commerce Platform</span>
          <span className="text-[4px]"> - React, Node.js, MongoDB</span>
        </div>
      </div>
    </div>
  );
};

// Data Scientist Template Preview
export const DataScientistPreview: React.FC<PreviewProps> = ({ className = '' }) => (
  <div className={`w-full h-full bg-white rounded-sm shadow-inner p-2 text-[6px] leading-tight overflow-hidden ${className}`}>
    {/* Header with accent */}
    <div className="border-l-2 border-purple-500 pl-1.5 mb-1.5">
      <div className="font-bold text-[8px] text-gray-800">Sarah Analytics</div>
      <div className="text-purple-600 text-[5px]">Data Scientist | ML Engineer</div>
      <div className="text-gray-400 text-[4px]">Python • R • SQL • TensorFlow</div>
    </div>
    
    {/* Summary */}
    <div className="bg-purple-50 rounded p-1 mb-1 text-[4px] text-gray-600">
      5+ years analyzing complex datasets and building predictive models...
    </div>
    
    {/* Tools & Technologies */}
    <div className="mb-1">
      <div className="font-semibold text-purple-600 text-[5px] mb-0.5">TOOLS & TECHNOLOGIES</div>
      <div className="grid grid-cols-2 gap-0.5 text-[4px]">
        <div className="flex items-center gap-0.5">
          <div className="w-6 bg-purple-200 rounded-full h-1"></div>
          <span>Python</span>
        </div>
        <div className="flex items-center gap-0.5">
          <div className="w-5 bg-purple-200 rounded-full h-1"></div>
          <span>SQL</span>
        </div>
        <div className="flex items-center gap-0.5">
          <div className="w-4 bg-purple-200 rounded-full h-1"></div>
          <span>TensorFlow</span>
        </div>
        <div className="flex items-center gap-0.5">
          <div className="w-5 bg-purple-200 rounded-full h-1"></div>
          <span>Tableau</span>
        </div>
      </div>
    </div>
    
    {/* Experience */}
    <div>
      <div className="font-semibold text-purple-600 text-[5px] mb-0.5">EXPERIENCE</div>
      <div className="text-gray-800 font-medium">Sr. Data Scientist • DataCo</div>
      <div className="text-gray-500 text-[4px]">• Increased revenue 23% with ML model</div>
      <div className="text-gray-500 text-[4px]">• Built real-time analytics pipeline</div>
    </div>
  </div>
);

// AI/ML Engineer Template Preview
export const AIMLPreview: React.FC<PreviewProps> = ({ className = '' }) => (
  <div className={`w-full h-full bg-gradient-to-br from-gray-900 to-gray-800 rounded-sm shadow-inner p-2 text-[6px] leading-tight overflow-hidden ${className}`}>
    {/* Header */}
    <div className="text-center mb-1.5">
      <div className="font-bold text-[8px] text-white">Alex Chen</div>
      <div className="text-teal-400 text-[5px]">AI/ML Engineer</div>
      <div className="flex justify-center gap-1 text-gray-400 text-[4px]">
        <span>🔬 Research</span>
        <span>🤖 Deep Learning</span>
        <span>📊 NLP</span>
      </div>
    </div>
    
    {/* ML Stack */}
    <div className="mb-1">
      <div className="font-semibold text-teal-400 text-[5px] mb-0.5">ML STACK</div>
      <div className="flex flex-wrap gap-0.5">
        {['PyTorch', 'TensorFlow', 'Hugging Face', 'LangChain'].map(tech => (
          <span key={tech} className="bg-teal-900/50 text-teal-300 px-1 rounded text-[4px] border border-teal-700">{tech}</span>
        ))}
      </div>
    </div>
    
    {/* Publications */}
    <div className="mb-1">
      <div className="font-semibold text-teal-400 text-[5px] mb-0.5">PUBLICATIONS</div>
      <div className="text-gray-300 text-[4px]">
        • "Transformer Architectures for..." - NeurIPS 2024
      </div>
      <div className="text-gray-300 text-[4px]">
        • "Efficient LLM Training..." - ICML 2023
      </div>
    </div>
    
    {/* Experience */}
    <div>
      <div className="font-semibold text-teal-400 text-[5px] mb-0.5">EXPERIENCE</div>
      <div className="text-white font-medium">ML Engineer • OpenAI</div>
      <div className="text-gray-400 text-[4px]">Building next-gen language models</div>
    </div>
  </div>
);

// Product Manager Template Preview
export const ProductManagerPreview: React.FC<PreviewProps> = ({ className = '' }) => (
  <div className={`w-full h-full bg-white rounded-sm shadow-inner p-2 text-[6px] leading-tight overflow-hidden ${className}`}>
    {/* Header */}
    <div className="flex justify-between items-start mb-1.5">
      <div>
        <div className="font-bold text-[8px] text-gray-800">Emily Product</div>
        <div className="text-orange-600 text-[5px]">Senior Product Manager</div>
      </div>
      <div className="text-right text-[4px] text-gray-400">
        <div>San Francisco, CA</div>
        <div>emily@email.com</div>
      </div>
    </div>
    
    {/* Metrics */}
    <div className="grid grid-cols-3 gap-1 mb-1.5">
      <div className="bg-orange-50 rounded p-0.5 text-center">
        <div className="font-bold text-orange-600 text-[7px]">$2M+</div>
        <div className="text-gray-500 text-[3px]">Revenue Impact</div>
      </div>
      <div className="bg-orange-50 rounded p-0.5 text-center">
        <div className="font-bold text-orange-600 text-[7px]">5</div>
        <div className="text-gray-500 text-[3px]">Products Launched</div>
      </div>
      <div className="bg-orange-50 rounded p-0.5 text-center">
        <div className="font-bold text-orange-600 text-[7px]">40%</div>
        <div className="text-gray-500 text-[3px]">Growth Rate</div>
      </div>
    </div>
    
    {/* Experience */}
    <div className="mb-1">
      <div className="font-semibold text-orange-600 text-[5px] mb-0.5">EXPERIENCE</div>
      <div className="text-gray-800 font-medium">Sr. PM • TechStartup</div>
      <div className="text-gray-500 text-[4px]">• Led product from 0 to 1M users</div>
      <div className="text-gray-500 text-[4px]">• Managed cross-functional team of 12</div>
    </div>
    
    {/* Skills */}
    <div className="flex flex-wrap gap-0.5">
      {['Roadmapping', 'Analytics', 'Agile', 'User Research'].map(skill => (
        <span key={skill} className="bg-gray-100 text-gray-600 px-1 rounded text-[4px]">{skill}</span>
      ))}
    </div>
  </div>
);

// Fresher/Student Template Preview
export const FresherPreview: React.FC<PreviewProps> = ({ className = '' }) => (
  <div className={`w-full h-full bg-white rounded-sm shadow-inner p-2 text-[6px] leading-tight overflow-hidden ${className}`}>
    {/* Header */}
    <div className="text-center border-b border-cyan-200 pb-1 mb-1">
      <div className="font-bold text-[8px] text-gray-800">Chris Graduate</div>
      <div className="text-cyan-600 text-[5px]">Computer Science Student</div>
      <div className="text-gray-400 text-[4px]">Stanford University • Class of 2024</div>
    </div>
    
    {/* Education - Highlighted */}
    <div className="bg-cyan-50 rounded p-1 mb-1">
      <div className="font-semibold text-cyan-600 text-[5px] mb-0.5">🎓 EDUCATION</div>
      <div className="text-gray-800 font-medium">B.S. Computer Science</div>
      <div className="text-gray-500 text-[4px]">GPA: 3.8/4.0 • Dean's List</div>
    </div>
    
    {/* Projects */}
    <div className="mb-1">
      <div className="font-semibold text-cyan-600 text-[5px] mb-0.5">PROJECTS</div>
      <div className="mb-0.5">
        <div className="text-gray-800 font-medium">AI Chatbot App</div>
        <div className="text-gray-500 text-[4px]">React Native, OpenAI API, Firebase</div>
      </div>
      <div>
        <div className="text-gray-800 font-medium">E-commerce Platform</div>
        <div className="text-gray-500 text-[4px]">Next.js, Stripe, PostgreSQL</div>
      </div>
    </div>
    
    {/* Internships */}
    <div>
      <div className="font-semibold text-cyan-600 text-[5px] mb-0.5">INTERNSHIP</div>
      <div className="text-gray-800 font-medium">SWE Intern • Google</div>
      <div className="text-gray-500 text-[4px]">Summer 2023</div>
    </div>
  </div>
);

// Freelancer Template Preview
export const FreelancerPreview: React.FC<PreviewProps> = ({ className = '' }) => (
  <div className={`w-full h-full bg-gradient-to-br from-rose-50 to-pink-50 rounded-sm shadow-inner p-2 text-[6px] leading-tight overflow-hidden ${className}`}>
    {/* Header */}
    <div className="flex items-center gap-1.5 mb-1.5">
      <div className="w-6 h-6 rounded-full bg-gradient-to-br from-pink-500 to-rose-500 flex items-center justify-center text-white text-[6px] font-bold">
        MK
      </div>
      <div>
        <div className="font-bold text-[8px] text-gray-800">Mike Kreative</div>
        <div className="text-rose-600 text-[5px]">Full-Stack Developer</div>
      </div>
    </div>
    
    {/* Stats */}
    <div className="flex gap-2 mb-1.5 text-center">
      <div>
        <div className="font-bold text-rose-600 text-[7px]">50+</div>
        <div className="text-gray-500 text-[3px]">Projects</div>
      </div>
      <div>
        <div className="font-bold text-rose-600 text-[7px]">30+</div>
        <div className="text-gray-500 text-[3px]">Clients</div>
      </div>
      <div>
        <div className="font-bold text-rose-600 text-[7px]">5★</div>
        <div className="text-gray-500 text-[3px]">Rating</div>
      </div>
    </div>
    
    {/* Services */}
    <div className="mb-1">
      <div className="font-semibold text-rose-600 text-[5px] mb-0.5">SERVICES</div>
      <div className="flex flex-wrap gap-0.5">
        {['Web Dev', 'Mobile Apps', 'UI/UX', 'API'].map(service => (
          <span key={service} className="bg-white text-rose-600 px-1 rounded text-[4px] border border-rose-200">{service}</span>
        ))}
      </div>
    </div>
    
    {/* Portfolio */}
    <div>
      <div className="font-semibold text-rose-600 text-[5px] mb-0.5">FEATURED WORK</div>
      <div className="grid grid-cols-3 gap-0.5">
        <div className="h-4 bg-gradient-to-br from-pink-200 to-rose-200 rounded"></div>
        <div className="h-4 bg-gradient-to-br from-purple-200 to-pink-200 rounded"></div>
        <div className="h-4 bg-gradient-to-br from-rose-200 to-orange-200 rounded"></div>
      </div>
    </div>
  </div>
);

// ============================================
// PREVIEW MAPPING
// ============================================

// Mobile App Developer Preview
export const MobileAppPreview: React.FC<PreviewProps> = ({ className = '' }) => (
  <div className={`w-full h-full bg-white rounded-sm shadow-inner p-2 text-[6px] leading-tight overflow-hidden ${className}`}>
    <div className="border-b border-green-200 pb-1 mb-1">
      <div className="font-bold text-[8px] text-gray-800">Mike Swift</div>
      <div className="text-green-600 text-[5px]">Mobile App Developer</div>
      <div className="text-gray-400 text-[4px]">iOS & Android Specialist</div>
    </div>
    <div className="mb-1">
      <div className="font-semibold text-green-600 text-[5px] mb-0.5">PLATFORMS</div>
      <div className="flex flex-wrap gap-0.5">
        {['iOS', 'Android', 'Flutter', 'React Native'].map(s => (
          <span key={s} className="bg-green-100 text-green-700 px-1 rounded text-[4px]">{s}</span>
        ))}
      </div>
    </div>
    <div>
      <div className="font-semibold text-green-600 text-[5px] mb-0.5">PUBLISHED APPS</div>
      <div className="text-gray-600 text-[4px]">• FitTracker Pro - 500K+ downloads</div>
      <div className="text-gray-600 text-[4px]">• TaskMaster - 4.8★ rating</div>
    </div>
  </div>
);

// QA Engineer Preview
export const QAEngineerPreview: React.FC<PreviewProps> = ({ className = '' }) => (
  <div className={`w-full h-full bg-white rounded-sm shadow-inner p-2 text-[6px] leading-tight overflow-hidden ${className}`}>
    <div className="border-l-2 border-amber-500 pl-1.5 mb-1.5">
      <div className="font-bold text-[8px] text-gray-800">Rachel Tester</div>
      <div className="text-amber-600 text-[5px]">QA / Test Engineer</div>
    </div>
    <div className="mb-1">
      <div className="font-semibold text-amber-600 text-[5px] mb-0.5">TESTING SKILLS</div>
      <div className="flex flex-wrap gap-0.5">
        {['Selenium', 'Cypress', 'JUnit', 'TestNG'].map(s => (
          <span key={s} className="bg-amber-100 text-amber-700 px-1 rounded text-[4px]">{s}</span>
        ))}
      </div>
    </div>
    <div>
      <div className="font-semibold text-amber-600 text-[5px] mb-0.5">EXPERIENCE</div>
      <div className="text-gray-800 font-medium">Sr. QA Engineer • TechCorp</div>
      <div className="text-gray-500 text-[4px]">• 95% automation coverage</div>
    </div>
  </div>
);

// Systems Engineer Preview
export const SystemsEngineerPreview: React.FC<PreviewProps> = ({ className = '' }) => (
  <div className={`w-full h-full bg-gray-900 rounded-sm shadow-inner p-2 text-[6px] leading-tight overflow-hidden ${className}`}>
    <div className="mb-1.5 text-center">
      <div className="font-bold text-[8px] text-white">Sam Sysadmin</div>
      <div className="text-blue-400 text-[5px]">Systems Engineer</div>
    </div>
    <div className="mb-1">
      <div className="font-semibold text-blue-400 text-[5px] mb-0.5">INFRASTRUCTURE</div>
      <div className="flex flex-wrap gap-0.5">
        {['Linux', 'AWS', 'Kubernetes', 'Ansible'].map(s => (
          <span key={s} className="bg-blue-900/50 text-blue-300 px-1 rounded text-[4px]">{s}</span>
        ))}
      </div>
    </div>
    <div>
      <div className="text-blue-400 text-[4px]">• 99.99% uptime maintained</div>
      <div className="text-blue-400 text-[4px]">• Managed 500+ servers</div>
    </div>
  </div>
);

// Data Analyst Preview
export const DataAnalystPreview: React.FC<PreviewProps> = ({ className = '' }) => (
  <div className={`w-full h-full bg-white rounded-sm shadow-inner p-2 text-[6px] leading-tight overflow-hidden ${className}`}>
    <div className="border-b border-blue-200 pb-1 mb-1">
      <div className="font-bold text-[8px] text-gray-800">Dana Analyst</div>
      <div className="text-blue-600 text-[5px]">Data Analyst</div>
    </div>
    <div className="mb-1">
      <div className="font-semibold text-blue-600 text-[5px] mb-0.5">TOOLS</div>
      <div className="flex flex-wrap gap-0.5">
        {['SQL', 'Power BI', 'Tableau', 'Excel'].map(s => (
          <span key={s} className="bg-blue-100 text-blue-700 px-1 rounded text-[4px]">{s}</span>
        ))}
      </div>
    </div>
    <div className="text-gray-600 text-[4px]">• Created dashboards for C-suite</div>
    <div className="text-gray-600 text-[4px]">• Analyzed KPIs across 5 departments</div>
  </div>
);

// Research Analyst Preview
export const ResearchAnalystPreview: React.FC<PreviewProps> = ({ className = '' }) => (
  <div className={`w-full h-full bg-white rounded-sm shadow-inner p-2 text-[6px] leading-tight overflow-hidden ${className}`}>
    <div className="mb-1.5">
      <div className="font-bold text-[8px] text-gray-800">Dr. Rita Research</div>
      <div className="text-violet-600 text-[5px]">Research Analyst</div>
    </div>
    <div className="mb-1">
      <div className="font-semibold text-violet-600 text-[5px] mb-0.5">METHODS</div>
      <div className="text-gray-600 text-[4px]">Qualitative • Quantitative • SPSS</div>
    </div>
    <div>
      <div className="font-semibold text-violet-600 text-[5px] mb-0.5">PUBLICATIONS</div>
      <div className="text-gray-600 text-[4px]">• 5 peer-reviewed papers</div>
      <div className="text-gray-600 text-[4px]">• 3 industry reports</div>
    </div>
  </div>
);

// Project Manager Preview
export const ProjectManagerPreview: React.FC<PreviewProps> = ({ className = '' }) => (
  <div className={`w-full h-full bg-white rounded-sm shadow-inner p-2 text-[6px] leading-tight overflow-hidden ${className}`}>
    <div className="flex justify-between items-start mb-1.5">
      <div>
        <div className="font-bold text-[8px] text-gray-800">Patricia PM</div>
        <div className="text-emerald-600 text-[5px]">Project Manager, PMP</div>
      </div>
    </div>
    <div className="grid grid-cols-2 gap-1 mb-1">
      <div className="bg-emerald-50 rounded p-0.5 text-center">
        <div className="font-bold text-emerald-600 text-[7px]">25+</div>
        <div className="text-gray-500 text-[3px]">Projects</div>
      </div>
      <div className="bg-emerald-50 rounded p-0.5 text-center">
        <div className="font-bold text-emerald-600 text-[7px]">100%</div>
        <div className="text-gray-500 text-[3px]">On-time</div>
      </div>
    </div>
    <div className="flex flex-wrap gap-0.5">
      {['Agile', 'Scrum', 'Jira', 'Risk Mgmt'].map(s => (
        <span key={s} className="bg-gray-100 text-gray-600 px-1 rounded text-[4px]">{s}</span>
      ))}
    </div>
  </div>
);

// Program Manager Preview
export const ProgramManagerPreview: React.FC<PreviewProps> = ({ className = '' }) => (
  <div className={`w-full h-full bg-white rounded-sm shadow-inner p-2 text-[6px] leading-tight overflow-hidden ${className}`}>
    <div className="mb-1.5">
      <div className="font-bold text-[8px] text-gray-800">Peter Programs</div>
      <div className="text-sky-600 text-[5px]">Program Manager</div>
    </div>
    <div className="bg-sky-50 rounded p-1 mb-1">
      <div className="text-sky-700 text-[4px]">$50M+ portfolio managed</div>
      <div className="text-sky-700 text-[4px]">12 cross-functional teams</div>
    </div>
    <div className="flex flex-wrap gap-0.5">
      {['Roadmaps', 'Governance', 'Strategy'].map(s => (
        <span key={s} className="bg-sky-100 text-sky-700 px-1 rounded text-[4px]">{s}</span>
      ))}
    </div>
  </div>
);

// Operations Manager Preview
export const OperationsManagerPreview: React.FC<PreviewProps> = ({ className = '' }) => (
  <div className={`w-full h-full bg-white rounded-sm shadow-inner p-2 text-[6px] leading-tight overflow-hidden ${className}`}>
    <div className="mb-1.5">
      <div className="font-bold text-[8px] text-gray-800">Omar Ops</div>
      <div className="text-teal-600 text-[5px]">Operations Manager</div>
    </div>
    <div className="grid grid-cols-2 gap-1 mb-1">
      <div className="bg-teal-50 rounded p-0.5 text-center">
        <div className="font-bold text-teal-600 text-[6px]">30%</div>
        <div className="text-gray-500 text-[3px]">Cost Saved</div>
      </div>
      <div className="bg-teal-50 rounded p-0.5 text-center">
        <div className="font-bold text-teal-600 text-[6px]">50+</div>
        <div className="text-gray-500 text-[3px]">SOPs</div>
      </div>
    </div>
    <div className="text-gray-600 text-[4px]">• Led team of 25 operators</div>
    <div className="text-gray-600 text-[4px]">• Streamlined supply chain</div>
  </div>
);

// Financial Analyst Preview
export const FinancialAnalystPreview: React.FC<PreviewProps> = ({ className = '' }) => (
  <div className={`w-full h-full bg-white rounded-sm shadow-inner p-2 text-[6px] leading-tight overflow-hidden ${className}`}>
    <div className="border-b border-green-200 pb-1 mb-1">
      <div className="font-bold text-[8px] text-gray-800">Frank Finance</div>
      <div className="text-green-700 text-[5px]">Financial Analyst</div>
    </div>
    <div className="flex flex-wrap gap-0.5 mb-1">
      {['Modeling', 'Forecasting', 'Excel', 'SAP'].map(s => (
        <span key={s} className="bg-green-100 text-green-700 px-1 rounded text-[4px]">{s}</span>
      ))}
    </div>
    <div className="text-gray-600 text-[4px]">• Built 50+ financial models</div>
    <div className="text-gray-600 text-[4px]">• $10M budget management</div>
  </div>
);

// Accountant Preview
export const AccountantPreview: React.FC<PreviewProps> = ({ className = '' }) => (
  <div className={`w-full h-full bg-white rounded-sm shadow-inner p-2 text-[6px] leading-tight overflow-hidden ${className}`}>
    <div className="mb-1.5">
      <div className="font-bold text-[8px] text-gray-800">Alice Accounts, CPA</div>
      <div className="text-slate-600 text-[5px]">Senior Accountant</div>
    </div>
    <div className="flex flex-wrap gap-0.5 mb-1">
      {['GAAP', 'Auditing', 'Tax', 'QuickBooks'].map(s => (
        <span key={s} className="bg-slate-100 text-slate-700 px-1 rounded text-[4px]">{s}</span>
      ))}
    </div>
    <div className="text-gray-600 text-[4px]">• 100% audit accuracy</div>
    <div className="text-gray-600 text-[4px]">• $5M accounts managed</div>
  </div>
);

// Sales Executive Preview
export const SalesExecutivePreview: React.FC<PreviewProps> = ({ className = '' }) => (
  <div className={`w-full h-full bg-white rounded-sm shadow-inner p-2 text-[6px] leading-tight overflow-hidden ${className}`}>
    <div className="mb-1.5">
      <div className="font-bold text-[8px] text-gray-800">Steve Sales</div>
      <div className="text-red-600 text-[5px]">Sales Executive</div>
    </div>
    <div className="grid grid-cols-3 gap-1 mb-1">
      <div className="bg-red-50 rounded p-0.5 text-center">
        <div className="font-bold text-red-600 text-[6px]">$2M</div>
        <div className="text-gray-500 text-[3px]">Revenue</div>
      </div>
      <div className="bg-red-50 rounded p-0.5 text-center">
        <div className="font-bold text-red-600 text-[6px]">150%</div>
        <div className="text-gray-500 text-[3px]">Quota</div>
      </div>
      <div className="bg-red-50 rounded p-0.5 text-center">
        <div className="font-bold text-red-600 text-[6px]">50+</div>
        <div className="text-gray-500 text-[3px]">Clients</div>
      </div>
    </div>
    <div className="flex flex-wrap gap-0.5">
      {['CRM', 'Lead Gen', 'Negotiation'].map(s => (
        <span key={s} className="bg-gray-100 text-gray-600 px-1 rounded text-[4px]">{s}</span>
      ))}
    </div>
  </div>
);

// Business Development Preview
export const BusinessDevPreview: React.FC<PreviewProps> = ({ className = '' }) => (
  <div className={`w-full h-full bg-white rounded-sm shadow-inner p-2 text-[6px] leading-tight overflow-hidden ${className}`}>
    <div className="mb-1.5">
      <div className="font-bold text-[8px] text-gray-800">Bella Bizdev</div>
      <div className="text-purple-600 text-[5px]">Business Development Manager</div>
    </div>
    <div className="bg-purple-50 rounded p-1 mb-1">
      <div className="text-purple-700 text-[4px]">• Secured 15 partnerships</div>
      <div className="text-purple-700 text-[4px]">• Expanded to 3 new markets</div>
    </div>
    <div className="flex flex-wrap gap-0.5">
      {['Strategy', 'Partnerships', 'Growth'].map(s => (
        <span key={s} className="bg-purple-100 text-purple-700 px-1 rounded text-[4px]">{s}</span>
      ))}
    </div>
  </div>
);

// Content Writer Preview
export const ContentWriterPreview: React.FC<PreviewProps> = ({ className = '' }) => (
  <div className={`w-full h-full bg-white rounded-sm shadow-inner p-2 text-[6px] leading-tight overflow-hidden ${className}`}>
    <div className="mb-1.5">
      <div className="font-bold text-[8px] text-gray-800">Cathy Content</div>
      <div className="text-pink-600 text-[5px]">Content Writer</div>
    </div>
    <div className="flex flex-wrap gap-0.5 mb-1">
      {['SEO', 'Blogs', 'Copywriting', 'WordPress'].map(s => (
        <span key={s} className="bg-pink-100 text-pink-700 px-1 rounded text-[4px]">{s}</span>
      ))}
    </div>
    <div className="text-gray-600 text-[4px]">• 500+ articles published</div>
    <div className="text-gray-600 text-[4px]">• 2M+ page views generated</div>
  </div>
);

// Social Media Manager Preview
export const SocialMediaPreview: React.FC<PreviewProps> = ({ className = '' }) => (
  <div className={`w-full h-full bg-gradient-to-br from-purple-50 to-pink-50 rounded-sm shadow-inner p-2 text-[6px] leading-tight overflow-hidden ${className}`}>
    <div className="mb-1.5">
      <div className="font-bold text-[8px] text-gray-800">Sophie Social</div>
      <div className="text-purple-600 text-[5px]">Social Media Manager</div>
    </div>
    <div className="grid grid-cols-2 gap-1 mb-1">
      <div className="bg-white rounded p-0.5 text-center">
        <div className="font-bold text-purple-600 text-[6px]">500K</div>
        <div className="text-gray-500 text-[3px]">Followers</div>
      </div>
      <div className="bg-white rounded p-0.5 text-center">
        <div className="font-bold text-pink-600 text-[6px]">8%</div>
        <div className="text-gray-500 text-[3px]">Engagement</div>
      </div>
    </div>
    <div className="flex flex-wrap gap-0.5">
      {['Strategy', 'Analytics', 'Campaigns'].map(s => (
        <span key={s} className="bg-white text-purple-600 px-1 rounded text-[4px]">{s}</span>
      ))}
    </div>
  </div>
);

// SEO Specialist Preview
export const SEOSpecialistPreview: React.FC<PreviewProps> = ({ className = '' }) => (
  <div className={`w-full h-full bg-white rounded-sm shadow-inner p-2 text-[6px] leading-tight overflow-hidden ${className}`}>
    <div className="mb-1.5">
      <div className="font-bold text-[8px] text-gray-800">Sean SEO</div>
      <div className="text-green-600 text-[5px]">SEO Specialist</div>
    </div>
    <div className="flex flex-wrap gap-0.5 mb-1">
      {['Keywords', 'On-page', 'Analytics', 'Link Building'].map(s => (
        <span key={s} className="bg-green-100 text-green-700 px-1 rounded text-[4px]">{s}</span>
      ))}
    </div>
    <div className="text-gray-600 text-[4px]">• Ranked #1 for 50+ keywords</div>
    <div className="text-gray-600 text-[4px]">• 300% traffic increase</div>
  </div>
);

// Graphic Designer Preview
export const GraphicDesignerPreview: React.FC<PreviewProps> = ({ className = '' }) => (
  <div className={`w-full h-full bg-gradient-to-br from-indigo-50 to-purple-50 rounded-sm shadow-inner p-2 text-[6px] leading-tight overflow-hidden ${className}`}>
    <div className="mb-1.5">
      <div className="font-bold text-[8px] text-gray-800">Grace Graphics</div>
      <div className="text-indigo-600 text-[5px]">Graphic Designer</div>
    </div>
    <div className="flex flex-wrap gap-0.5 mb-1">
      {['Photoshop', 'Illustrator', 'Figma', 'Branding'].map(s => (
        <span key={s} className="bg-white text-indigo-600 px-1 rounded text-[4px]">{s}</span>
      ))}
    </div>
    <div className="grid grid-cols-3 gap-0.5">
      <div className="h-4 bg-indigo-200 rounded"></div>
      <div className="h-4 bg-purple-200 rounded"></div>
      <div className="h-4 bg-pink-200 rounded"></div>
    </div>
  </div>
);

// Video Editor Preview
export const VideoEditorPreview: React.FC<PreviewProps> = ({ className = '' }) => (
  <div className={`w-full h-full bg-gray-900 rounded-sm shadow-inner p-2 text-[6px] leading-tight overflow-hidden ${className}`}>
    <div className="mb-1.5">
      <div className="font-bold text-[8px] text-white">Victor Video</div>
      <div className="text-red-500 text-[5px]">Video Editor</div>
    </div>
    <div className="flex flex-wrap gap-0.5 mb-1">
      {['Premiere', 'After Effects', 'DaVinci'].map(s => (
        <span key={s} className="bg-red-900/50 text-red-300 px-1 rounded text-[4px]">{s}</span>
      ))}
    </div>
    <div className="text-gray-400 text-[4px]">• 100+ videos edited</div>
    <div className="text-gray-400 text-[4px]">• 10M+ views generated</div>
  </div>
);

// Healthcare Admin Preview
export const HealthcareAdminPreview: React.FC<PreviewProps> = ({ className = '' }) => (
  <div className={`w-full h-full bg-white rounded-sm shadow-inner p-2 text-[6px] leading-tight overflow-hidden ${className}`}>
    <div className="border-l-2 border-blue-500 pl-1.5 mb-1.5">
      <div className="font-bold text-[8px] text-gray-800">Helen Healthcare</div>
      <div className="text-blue-600 text-[5px]">Healthcare Administrator</div>
    </div>
    <div className="flex flex-wrap gap-0.5 mb-1">
      {['HIPAA', 'EHR', 'Compliance', 'Operations'].map(s => (
        <span key={s} className="bg-blue-100 text-blue-700 px-1 rounded text-[4px]">{s}</span>
      ))}
    </div>
    <div className="text-gray-600 text-[4px]">• Managed 50-bed facility</div>
    <div className="text-gray-600 text-[4px]">• 100% compliance record</div>
  </div>
);

// Clinical Research Preview
export const ClinicalResearchPreview: React.FC<PreviewProps> = ({ className = '' }) => (
  <div className={`w-full h-full bg-white rounded-sm shadow-inner p-2 text-[6px] leading-tight overflow-hidden ${className}`}>
    <div className="mb-1.5">
      <div className="font-bold text-[8px] text-gray-800">Dr. Clara Clinical</div>
      <div className="text-teal-600 text-[5px]">Clinical Research Associate</div>
    </div>
    <div className="flex flex-wrap gap-0.5 mb-1">
      {['GCP', 'FDA', 'Clinical Trials', 'IRB'].map(s => (
        <span key={s} className="bg-teal-100 text-teal-700 px-1 rounded text-[4px]">{s}</span>
      ))}
    </div>
    <div className="text-gray-600 text-[4px]">• 15 trials monitored</div>
    <div className="text-gray-600 text-[4px]">• Phase I-III experience</div>
  </div>
);

// HR Manager Preview
export const HRManagerPreview: React.FC<PreviewProps> = ({ className = '' }) => (
  <div className={`w-full h-full bg-white rounded-sm shadow-inner p-2 text-[6px] leading-tight overflow-hidden ${className}`}>
    <div className="mb-1.5">
      <div className="font-bold text-[8px] text-gray-800">Hannah HR</div>
      <div className="text-orange-600 text-[5px]">Human Resources Manager</div>
    </div>
    <div className="grid grid-cols-2 gap-1 mb-1">
      <div className="bg-orange-50 rounded p-0.5 text-center">
        <div className="font-bold text-orange-600 text-[6px]">200+</div>
        <div className="text-gray-500 text-[3px]">Hired</div>
      </div>
      <div className="bg-orange-50 rounded p-0.5 text-center">
        <div className="font-bold text-orange-600 text-[6px]">95%</div>
        <div className="text-gray-500 text-[3px]">Retention</div>
      </div>
    </div>
    <div className="flex flex-wrap gap-0.5">
      {['Recruitment', 'HRIS', 'Policies'].map(s => (
        <span key={s} className="bg-gray-100 text-gray-600 px-1 rounded text-[4px]">{s}</span>
      ))}
    </div>
  </div>
);

// Legal Assistant Preview
export const LegalAssistantPreview: React.FC<PreviewProps> = ({ className = '' }) => (
  <div className={`w-full h-full bg-white rounded-sm shadow-inner p-2 text-[6px] leading-tight overflow-hidden ${className}`}>
    <div className="border-b border-gray-300 pb-1 mb-1">
      <div className="font-bold text-[8px] text-gray-800">Laura Legal</div>
      <div className="text-gray-600 text-[5px]">Legal Assistant</div>
    </div>
    <div className="flex flex-wrap gap-0.5 mb-1">
      {['Research', 'Case Mgmt', 'Westlaw', 'Filings'].map(s => (
        <span key={s} className="bg-gray-100 text-gray-700 px-1 rounded text-[4px]">{s}</span>
      ))}
    </div>
    <div className="text-gray-600 text-[4px]">• Supported 5 attorneys</div>
    <div className="text-gray-600 text-[4px]">• 100+ cases managed</div>
  </div>
);

// Admin Assistant Preview
export const AdminAssistantPreview: React.FC<PreviewProps> = ({ className = '' }) => (
  <div className={`w-full h-full bg-white rounded-sm shadow-inner p-2 text-[6px] leading-tight overflow-hidden ${className}`}>
    <div className="mb-1.5">
      <div className="font-bold text-[8px] text-gray-800">Amy Admin</div>
      <div className="text-blue-600 text-[5px]">Administrative Assistant</div>
    </div>
    <div className="flex flex-wrap gap-0.5 mb-1">
      {['Scheduling', 'MS Office', 'Data Entry', 'Filing'].map(s => (
        <span key={s} className="bg-blue-100 text-blue-700 px-1 rounded text-[4px]">{s}</span>
      ))}
    </div>
    <div className="text-gray-600 text-[4px]">• Executive support for CEO</div>
    <div className="text-gray-600 text-[4px]">• Calendar & travel management</div>
  </div>
);

// AI Prompt Engineer Preview
export const AIPromptEngineerPreview: React.FC<PreviewProps> = ({ className = '' }) => (
  <div className={`w-full h-full bg-gradient-to-br from-violet-900 to-purple-900 rounded-sm shadow-inner p-2 text-[6px] leading-tight overflow-hidden ${className}`}>
    <div className="mb-1.5 text-center">
      <div className="font-bold text-[8px] text-white">Aiden AI</div>
      <div className="text-violet-300 text-[5px]">AI Prompt Engineer</div>
    </div>
    <div className="flex flex-wrap gap-0.5 mb-1 justify-center">
      {['GPT-4', 'Claude', 'LangChain', 'Fine-tuning'].map(s => (
        <span key={s} className="bg-violet-800/50 text-violet-200 px-1 rounded text-[4px]">{s}</span>
      ))}
    </div>
    <div className="text-violet-300 text-[4px] text-center">• Optimized 50+ prompts</div>
    <div className="text-violet-300 text-[4px] text-center">• 40% accuracy improvement</div>
  </div>
);

// Automation Specialist Preview
export const AutomationSpecialistPreview: React.FC<PreviewProps> = ({ className = '' }) => (
  <div className={`w-full h-full bg-white rounded-sm shadow-inner p-2 text-[6px] leading-tight overflow-hidden ${className}`}>
    <div className="mb-1.5">
      <div className="font-bold text-[8px] text-gray-800">Andy Automation</div>
      <div className="text-cyan-600 text-[5px]">No-Code / Automation Specialist</div>
    </div>
    <div className="flex flex-wrap gap-0.5 mb-1">
      {['Zapier', 'Make', 'APIs', 'n8n'].map(s => (
        <span key={s} className="bg-cyan-100 text-cyan-700 px-1 rounded text-[4px]">{s}</span>
      ))}
    </div>
    <div className="text-gray-600 text-[4px]">• 100+ workflows automated</div>
    <div className="text-gray-600 text-[4px]">• Saved 500+ hours/month</div>
  </div>
);

// Technical Writer Preview
export const TechnicalWriterPreview: React.FC<PreviewProps> = ({ className = '' }) => (
  <div className={`w-full h-full bg-white rounded-sm shadow-inner p-2 text-[6px] leading-tight overflow-hidden ${className}`}>
    <div className="border-l-2 border-gray-400 pl-1.5 mb-1.5">
      <div className="font-bold text-[8px] text-gray-800">Terry Technical</div>
      <div className="text-gray-600 text-[5px]">Technical Writer</div>
    </div>
    <div className="flex flex-wrap gap-0.5 mb-1">
      {['API Docs', 'Markdown', 'Confluence', 'Git'].map(s => (
        <span key={s} className="bg-gray-100 text-gray-700 px-1 rounded text-[4px]">{s}</span>
      ))}
    </div>
    <div className="text-gray-600 text-[4px]">• 200+ docs written</div>
    <div className="text-gray-600 text-[4px]">• Developer portal design</div>
  </div>
);

export const TEMPLATE_PREVIEWS: Record<string, React.FC<PreviewProps>> = {
  // Engineering & Tech
  'tech-focused': SoftwareEngineerPreview,
  'software-engineer': SoftwareEngineerPreview,
  'mobile-app-developer': MobileAppPreview,
  'qa-engineer': QAEngineerPreview,
  'systems-engineer': SystemsEngineerPreview,
  // Data, Analytics & Research
  'data-science': DataScientistPreview,
  'data-scientist': DataScientistPreview,
  'data-analyst': DataAnalystPreview,
  'research-analyst': ResearchAnalystPreview,
  'ai-ml': AIMLPreview,
  'ai-ml-engineer': AIMLPreview,
  // Product, Operations & Management
  'modern-minimal': ProductManagerPreview,
  'product-manager': ProductManagerPreview,
  'project-manager': ProjectManagerPreview,
  'program-manager': ProgramManagerPreview,
  'operations-manager': OperationsManagerPreview,
  // Business, Finance & Sales
  'financial-analyst': FinancialAnalystPreview,
  'accountant': AccountantPreview,
  'sales-executive': SalesExecutivePreview,
  'business-development': BusinessDevPreview,
  // Marketing & Content
  'content-writer': ContentWriterPreview,
  'social-media-manager': SocialMediaPreview,
  'seo-specialist': SEOSpecialistPreview,
  // Creative
  'graphic-designer': GraphicDesignerPreview,
  'video-editor': VideoEditorPreview,
  'designer': GraphicDesignerPreview,
  // Healthcare & Science
  'healthcare-admin': HealthcareAdminPreview,
  'clinical-research': ClinicalResearchPreview,
  // Legal, HR & Admin
  'hr-manager': HRManagerPreview,
  'legal-assistant': LegalAssistantPreview,
  'admin-assistant': AdminAssistantPreview,
  // Emerging & Modern
  'ai-prompt-engineer': AIPromptEngineerPreview,
  'automation-specialist': AutomationSpecialistPreview,
  'technical-writer': TechnicalWriterPreview,
  // General
  'fresher': FresherPreview,
  'freelancer': FreelancerPreview,
};

// Get preview component by template ID
export const getTemplatePreview = (templateId: string): React.FC<PreviewProps> => {
  return TEMPLATE_PREVIEWS[templateId] || SoftwareEngineerPreview;
};
