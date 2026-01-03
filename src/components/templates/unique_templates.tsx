import React from 'react';
import type { CV } from '../../lib/database.types';
import { getAccentColor } from './index';

// =============================================================================
// SHARED HELPERS
// =============================================================================

interface TemplateProps {
  cv: CV;
  isViewMode?: boolean;
}

// Photo component for templates
const TemplatePhoto: React.FC<{
  photoUrl?: string;
  size?: 'sm' | 'md' | 'lg';
  shape?: 'circle' | 'rounded' | 'square';
  borderColor?: string;
  className?: string;
}> = ({ photoUrl, size = 'md', shape = 'circle', borderColor, className = '' }) => {
  if (!photoUrl) return null;
  
  const sizeClasses = {
    sm: 'w-16 h-16',
    md: 'w-20 h-20',
    lg: 'w-24 h-24'
  };
  
  const shapeClasses = {
    circle: 'rounded-full',
    rounded: 'rounded-lg',
    square: 'rounded-none'
  };
  
  return (
    <img
      src={photoUrl}
      alt="Profile"
      className={`${sizeClasses[size]} ${shapeClasses[shape]} object-cover border-2 ${className}`}
      style={{ borderColor: borderColor || '#e5e7eb' }}
    />
  );
};

const formatDate = (date: string): string => {
  if (!date) return '';
  const [year, month] = date.split('-');
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return month ? `${months[parseInt(month) - 1]} ${year}` : year;
};

const formatDateRange = (startDate: string, endDate: string, current?: boolean): string => {
  const start = formatDate(startDate);
  const end = current ? 'Present' : formatDate(endDate);
  if (!start && !end) return '';
  if (!start) return end;
  if (!end) return start;
  return `${start} - ${end}`;
};

// =============================================================================
// BUSINESS & FINANCE TEMPLATES
// =============================================================================

export const FinancialAnalystTemplate: React.FC<TemplateProps> = ({ cv }) => {
  const accentColor = getAccentColor(cv, '#1e293b');
  const bgTint = cv.is_grayscale ? 'bg-gray-50' : 'bg-slate-50';
  
  return (
  <div className={`bg-white shadow-lg p-8 max-w-[8.5in] mx-auto font-serif text-slate-800 ${cv.is_grayscale ? 'grayscale' : ''}`}>
    <header className="border-b-4 pb-6 mb-6 flex justify-between items-end" style={{ borderColor: accentColor }}>
      <div className="flex items-center gap-4">
        <TemplatePhoto photoUrl={cv.personal_info.photo_url} size="lg" shape="rounded" borderColor={accentColor} />
        <div>
          <h1 className="text-4xl font-bold text-slate-900 uppercase tracking-tight">{cv.personal_info.full_name}</h1>
          <p className="text-xl mt-1 italic" style={{ color: accentColor }}>{cv.target_role || 'Financial Analyst'}</p>
        </div>
      </div>
      <div className="text-right text-sm text-slate-600 space-y-1">
        <p>{cv.personal_info.email}</p>
        <p>{cv.personal_info.phone}</p>
        <p>{cv.personal_info.city || cv.personal_info.address}</p>
      </div>
    </header>

    <div className="grid grid-cols-12 gap-8">
      <div className="col-span-8">
        {cv.personal_info.summary && (
          <section className="mb-6">
            <h2 className="text-sm font-bold uppercase border-b border-slate-300 mb-3 pb-1" style={{ color: accentColor }}>Executive Profile</h2>
            <p className="text-sm leading-relaxed text-justify">{cv.personal_info.summary}</p>
          </section>
        )}

        {cv.experience.length > 0 && (
          <section className="mb-6">
            <h2 className="text-sm font-bold uppercase border-b border-slate-300 mb-4 pb-1" style={{ color: accentColor }}>Professional Experience</h2>
            <div className="space-y-5">
              {cv.experience.map((exp, idx) => (
                <div key={idx}>
                  <div className="flex justify-between items-baseline">
                    <h3 className="font-bold text-slate-900">{exp.title}</h3>
                    <span className="text-sm text-slate-500 italic">{formatDateRange(exp.start_date, exp.end_date, exp.current)}</span>
                  </div>
                  <p className="text-sm font-semibold text-slate-700 mb-2">{exp.company} | {exp.location}</p>
                  <ul className="list-disc list-outside ml-4 text-sm space-y-1 text-slate-700">
                    {exp.achievements?.map((ach, i) => <li key={i}>{ach}</li>)}
                  </ul>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>

      <div className={`col-span-4 ${bgTint} p-4 rounded-sm h-fit`}>
        {cv.education.length > 0 && (
          <section className="mb-6">
            <h2 className="text-sm font-bold uppercase border-b border-slate-300 mb-3 pb-1" style={{ color: accentColor }}>Education</h2>
            {cv.education.map((edu, idx) => (
              <div key={idx} className="mb-3 last:mb-0">
                <p className="font-bold text-sm">{edu.institution}</p>
                <p className="text-sm">{edu.degree}</p>
                <p className="text-xs text-slate-500">{formatDate(edu.end_date)}</p>
              </div>
            ))}
          </section>
        )}

        {cv.skills.length > 0 && (
          <section className="mb-6">
            <h2 className="text-sm font-bold uppercase border-b border-slate-300 mb-3 pb-1" style={{ color: accentColor }}>Core Competencies</h2>
            <div className="flex flex-wrap gap-2">
              {cv.skills.map((skill, idx) => (
                <span key={idx} className="text-xs bg-white border border-slate-200 px-2 py-1 rounded-sm block w-full text-center">
                  {skill.name}
                </span>
              ))}
            </div>
          </section>
        )}
        
        {cv.certifications.length > 0 && (
          <section>
            <h2 className="text-sm font-bold uppercase border-b border-slate-300 mb-3 pb-1" style={{ color: accentColor }}>Certifications</h2>
            <ul className="text-sm space-y-2">
              {cv.certifications.map((cert, idx) => (
                <li key={idx}>
                  <span className="font-semibold block">{cert.name}</span>
                  <span className="text-xs text-slate-500">{cert.issuer}</span>
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>
    </div>
  </div>
  );
};

export const AccountantTemplate: React.FC<TemplateProps> = ({ cv }) => {
  const accentColor = getAccentColor(cv, '#047857');
  
  return (
  <div className={`bg-white shadow-lg p-10 max-w-[8.5in] mx-auto font-sans text-gray-800 border-t-8 ${cv.is_grayscale ? 'grayscale' : ''}`} style={{ borderTopColor: accentColor }}>
    <header className="text-center mb-8">
      <TemplatePhoto photoUrl={cv.personal_info.photo_url} size="lg" shape="circle" borderColor={accentColor} className="mx-auto mb-3" />
      <h1 className="text-3xl font-bold text-gray-900 tracking-wide uppercase">{cv.personal_info.full_name}</h1>
      <div className="flex justify-center gap-4 text-sm mt-3 text-gray-600 font-medium">
        <span>{cv.personal_info.email}</span>
        <span>|</span>
        <span>{cv.personal_info.phone}</span>
        <span>|</span>
        <span>{cv.personal_info.city}</span>
      </div>
    </header>

    <div className="space-y-6">
      {cv.personal_info.summary && (
        <section>
          <h2 className="text-sm font-bold uppercase tracking-wider border-b border-gray-200 mb-3" style={{ color: accentColor }}>Professional Summary</h2>
          <p className="text-sm text-gray-700 leading-relaxed">{cv.personal_info.summary}</p>
        </section>
      )}

      {cv.skills.length > 0 && (
        <section>
          <h2 className="text-sm font-bold uppercase tracking-wider border-b border-gray-200 mb-3" style={{ color: accentColor }}>Technical Skills</h2>
          <div className="grid grid-cols-3 gap-y-2 gap-x-4 text-sm text-gray-700">
            {cv.skills.map((skill, idx) => (
              <div key={idx} className="flex items-center">
                <span className="w-1.5 h-1.5 rounded-full mr-2" style={{ backgroundColor: accentColor }}></span>
                {skill.name}
              </div>
            ))}
          </div>
        </section>
      )}

      {cv.experience.length > 0 && (
        <section>
          <h2 className="text-sm font-bold uppercase tracking-wider border-b border-gray-200 mb-4" style={{ color: accentColor }}>Work History</h2>
          <div className="space-y-5">
            {cv.experience.map((exp, idx) => (
              <div key={idx}>
                <div className="flex justify-between font-bold text-gray-900 text-sm">
                  <span>{exp.title}</span>
                  <span>{formatDateRange(exp.start_date, exp.end_date, exp.current)}</span>
                </div>
                <div className="text-sm font-medium mb-2" style={{ color: accentColor }}>{exp.company}, {exp.location}</div>
                <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
                  {exp.achievements?.map((ach, i) => <li key={i}>{ach}</li>)}
                </ul>
              </div>
            ))}
          </div>
        </section>
      )}

      {cv.education.length > 0 && (
        <section>
          <h2 className="text-sm font-bold uppercase tracking-wider border-b border-gray-200 mb-3" style={{ color: accentColor }}>Education & Credentials</h2>
          <div className="grid grid-cols-2 gap-4">
            {cv.education.map((edu, idx) => (
              <div key={idx} className="text-sm">
                <p className="font-bold text-gray-900">{edu.institution}</p>
                <p className="text-gray-700">{edu.degree}</p>
                <p className="text-gray-500 text-xs">{formatDate(edu.end_date)}</p>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  </div>
  );
};

// =============================================================================
// TECH & ENGINEERING TEMPLATES
// =============================================================================

export const MobileAppDeveloperTemplate: React.FC<TemplateProps> = ({ cv }) => {
  const accentColor = getAccentColor(cv, '#2563eb');
  const tagBg = cv.is_grayscale ? 'bg-gray-200 text-gray-700' : 'bg-blue-50 text-blue-700';
  
  return (
  <div className={`bg-white shadow-lg p-8 max-w-[8.5in] mx-auto font-sans text-slate-800 ${cv.is_grayscale ? 'grayscale' : ''}`}>
    <div className="flex gap-8">
      {/* Sidebar */}
      <div className="w-1/3 space-y-6">
        <div className="text-white p-6 rounded-2xl text-center" style={{ backgroundColor: accentColor }}>
          <TemplatePhoto photoUrl={cv.personal_info.photo_url} size="lg" shape="circle" borderColor="#ffffff" className="mx-auto mb-3" />
          <h1 className="text-2xl font-bold leading-tight mb-2">{cv.personal_info.full_name}</h1>
          <p className="text-white/80 text-sm font-medium">{cv.target_role || 'Mobile Developer'}</p>
        </div>

        <div className="space-y-2 text-sm">
          {cv.personal_info.email && <div className="flex items-center gap-2"><span style={{ color: accentColor }}>✉</span> {cv.personal_info.email}</div>}
          {cv.personal_info.phone && <div className="flex items-center gap-2"><span style={{ color: accentColor }}>📱</span> {cv.personal_info.phone}</div>}
          {cv.personal_info.github_url && <div className="flex items-center gap-2"><span style={{ color: accentColor }}>⌨</span> GitHub</div>}
          {cv.personal_info.linkedin_url && <div className="flex items-center gap-2"><span style={{ color: accentColor }}>in</span> LinkedIn</div>}
        </div>

        {cv.skills.length > 0 && (
          <section>
            <h3 className="font-bold text-slate-900 mb-3 uppercase text-sm tracking-wider">Tech Stack</h3>
            <div className="flex flex-wrap gap-2">
              {cv.skills.map((skill, idx) => (
                <span key={idx} className={`${tagBg} px-3 py-1 rounded-full text-xs font-semibold`}>
                  {skill.name}
                </span>
              ))}
            </div>
          </section>
        )}

        {cv.education.length > 0 && (
          <section>
            <h3 className="font-bold text-slate-900 mb-3 uppercase text-sm tracking-wider">Education</h3>
            {cv.education.map((edu, idx) => (
              <div key={idx} className="mb-3 text-sm">
                <p className="font-bold">{edu.degree}</p>
                <p className="text-slate-600">{edu.institution}</p>
                <p className="text-slate-400 text-xs">{formatDate(edu.end_date)}</p>
              </div>
            ))}
          </section>
        )}
      </div>

      {/* Main Content */}
      <div className="w-2/3 space-y-6">
        {cv.personal_info.summary && (
          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3 flex items-center gap-2">
              <span className="w-2 h-8 rounded-full" style={{ backgroundColor: accentColor }}></span> About
            </h2>
            <p className="text-slate-600 text-sm leading-relaxed">{cv.personal_info.summary}</p>
          </section>
        )}

        {cv.projects && cv.projects.length > 0 && (
          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
              <span className="w-2 h-8 rounded-full" style={{ backgroundColor: accentColor }}></span> App Portfolio
            </h2>
            <div className="grid grid-cols-1 gap-4">
              {cv.projects.map((proj, idx) => (
                <div key={idx} className="border border-slate-200 rounded-xl p-4 hover:border-blue-300 transition-colors">
                  <div className="flex justify-between items-start">
                    <h3 className="font-bold text-slate-900">{proj.name}</h3>
                    <div className="flex gap-2">
                      {proj.url && <a href={proj.url} className="text-xs font-bold" style={{ color: accentColor }}>LIVE</a>}
                      {proj.github_url && <a href={proj.github_url} className="text-xs text-slate-500">CODE</a>}
                    </div>
                  </div>
                  <p className="text-xs text-slate-500 mt-1 mb-2">{proj.technologies.join(' • ')}</p>
                  <p className="text-sm text-slate-600">{proj.description}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {cv.experience.length > 0 && (
          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
              <span className="w-2 h-8 rounded-full" style={{ backgroundColor: accentColor }}></span> Experience
            </h2>
            <div className="space-y-6 border-l-2 border-slate-100 pl-6 ml-1">
              {cv.experience.map((exp, idx) => (
                <div key={idx} className="relative">
                  <span className="absolute -left-[31px] top-1 w-4 h-4 rounded-full border-4 border-white" style={{ backgroundColor: accentColor }}></span>
                  <h3 className="font-bold text-slate-900">{exp.title}</h3>
                  <p className="text-sm font-medium mb-1" style={{ color: accentColor }}>{exp.company} • {formatDateRange(exp.start_date, exp.end_date, exp.current)}</p>
                  <ul className="list-disc list-inside text-sm text-slate-600 space-y-1">
                    {exp.achievements?.slice(0, 3).map((ach, i) => <li key={i}>{ach}</li>)}
                  </ul>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  </div>
  );
};

export const SystemsEngineerTemplate: React.FC<TemplateProps> = ({ cv }) => {
  const accentColor = getAccentColor(cv, '#1f2937');
  const checkColor = cv.is_grayscale ? '#6b7280' : '#16a34a';
  
  return (
  <div className={`bg-white shadow-lg p-8 max-w-[8.5in] mx-auto font-mono text-sm text-gray-800 ${cv.is_grayscale ? 'grayscale' : ''}`}>
    <header className="border-b-2 pb-4 mb-6" style={{ borderColor: accentColor }}>
      <div className="flex items-center gap-4">
        <TemplatePhoto photoUrl={cv.personal_info.photo_url} size="md" shape="rounded" borderColor={accentColor} />
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-1">{`> ${cv.personal_info.full_name}`}</h1>
          <p className="text-gray-600 mb-2">{`// ${cv.target_role || 'Systems Engineer'}`}</p>
        </div>
      </div>
      <div className="flex flex-wrap gap-4 text-xs text-gray-500 mt-2">
        <span>{`[email] ${cv.personal_info.email}`}</span>
        <span>{`[tel] ${cv.personal_info.phone}`}</span>
        <span>{`[loc] ${cv.personal_info.city}`}</span>
      </div>
    </header>

    <div className="grid grid-cols-1 gap-6">
      {cv.skills.length > 0 && (
        <section>
          <h2 className="text-base font-bold bg-gray-100 p-1 mb-2 border-l-4" style={{ borderLeftColor: accentColor }}>:: SYSTEM_CAPABILITIES</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {cv.skills.map((skill, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <span style={{ color: checkColor }}>✔</span> {skill.name}
              </div>
            ))}
          </div>
        </section>
      )}

      {cv.experience.length > 0 && (
        <section>
          <h2 className="text-base font-bold bg-gray-100 p-1 mb-4 border-l-4" style={{ borderLeftColor: accentColor }}>:: EXECUTION_LOG</h2>
          <div className="space-y-5">
            {cv.experience.map((exp, idx) => (
              <div key={idx}>
                <div className="flex justify-between items-baseline mb-1">
                  <h3 className="font-bold">{exp.title} @ {exp.company}</h3>
                  <span className="text-xs text-gray-500">[{formatDateRange(exp.start_date, exp.end_date, exp.current)}]</span>
                </div>
                <ul className="list-none pl-4 space-y-1 border-l border-gray-300 ml-1">
                  {exp.achievements?.map((ach, i) => (
                    <li key={i} className="relative">
                      <span className="absolute -left-5 text-gray-400">➜</span> {ach}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>
      )}

      {cv.certifications.length > 0 && (
        <section>
          <h2 className="text-base font-bold bg-gray-100 p-1 mb-2 border-l-4" style={{ borderLeftColor: accentColor }}>:: CERTIFICATES</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {cv.certifications.map((cert, idx) => (
              <div key={idx} className="border border-gray-200 p-2">
                <span className="font-bold block">{cert.name}</span>
                <span className="text-xs text-gray-500">{cert.issuer} | {formatDate(cert.date)}</span>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  </div>
  );
};

// =============================================================================
// CREATIVE & DESIGN TEMPLATES
// =============================================================================

export const CreativeBoldTemplate: React.FC<TemplateProps> = ({ cv }) => {
  const accentColor = getAccentColor(cv, '#000000');
  return (
  <div className={`bg-white shadow-lg p-0 max-w-[8.5in] mx-auto font-sans flex min-h-[11in] ${cv.is_grayscale ? 'grayscale' : ''}`}>
    {/* Left Column - Black */}
    <div className="w-1/3 text-white p-8 flex flex-col justify-between" style={{ backgroundColor: accentColor }}>
      <div>
        <TemplatePhoto photoUrl={cv.personal_info.photo_url} size="lg" shape="rounded" borderColor="#ffffff" className="mb-4" />
        <h1 className="text-5xl font-black leading-none mb-8 tracking-tighter">
          {cv.personal_info.full_name.split(' ').map((n, i) => <span key={i} className="block">{n}</span>)}
        </h1>
        
        <div className="space-y-8">
          <section>
            <h2 className="text-xs font-bold tracking-[0.2em] text-gray-400 mb-4 uppercase">Contact</h2>
            <div className="space-y-2 text-sm font-light text-gray-300">
              <p>{cv.personal_info.email}</p>
              <p>{cv.personal_info.phone}</p>
              <p>{cv.personal_info.city}</p>
              {cv.personal_info.portfolio_url && <a href={cv.personal_info.portfolio_url} className="underline decoration-1 underline-offset-4">Portfolio</a>}
            </div>
          </section>

          {cv.education.length > 0 && (
            <section>
              <h2 className="text-xs font-bold tracking-[0.2em] text-gray-400 mb-4 uppercase">Education</h2>
              {cv.education.map((edu, idx) => (
                <div key={idx} className="mb-4">
                  <p className="font-bold text-sm">{edu.degree}</p>
                  <p className="text-xs text-gray-400">{edu.institution}</p>
                  <p className="text-xs text-gray-500">{formatDate(edu.end_date)}</p>
                </div>
              ))}
            </section>
          )}

          {cv.skills.length > 0 && (
            <section>
              <h2 className="text-xs font-bold tracking-[0.2em] text-gray-400 mb-4 uppercase">Skills</h2>
              <div className="flex flex-wrap gap-2">
                {cv.skills.map((skill, idx) => (
                  <span key={idx} className="text-xs border border-gray-700 px-2 py-1 rounded-sm text-gray-300">
                    {skill.name}
                  </span>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
      
      <div className="text-xs text-gray-600 font-mono mt-8">
        DESIGNED BY {cv.personal_info.full_name.toUpperCase()}
      </div>
    </div>

    {/* Right Column - White */}
    <div className="w-2/3 p-10">
      {cv.personal_info.summary && (
        <section className="mb-10">
          <p className="text-xl font-light leading-relaxed text-gray-800">{cv.personal_info.summary}</p>
        </section>
      )}

      {cv.experience.length > 0 && (
        <section>
          <h2 className="text-xs font-bold tracking-[0.2em] text-black mb-8 uppercase border-b border-black pb-2">Experience</h2>
          <div className="space-y-8">
            {cv.experience.map((exp, idx) => (
              <div key={idx} className="group">
                <div className="flex justify-between items-baseline mb-2">
                  <h3 className="text-xl font-bold text-black group-hover:text-gray-600 transition-colors">{exp.title}</h3>
                  <span className="text-sm font-mono text-gray-400">{formatDateRange(exp.start_date, exp.end_date, exp.current)}</span>
                </div>
                <p className="text-sm font-medium text-gray-500 mb-3 uppercase tracking-wide">{exp.company}</p>
                <p className="text-sm text-gray-600 leading-relaxed">{exp.description}</p>
                {exp.achievements && (
                  <ul className="mt-2 space-y-1">
                    {exp.achievements.map((ach, i) => (
                      <li key={i} className="text-sm text-gray-600 flex gap-2">
                        <span className="text-black font-bold">·</span> {ach}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {cv.projects && cv.projects.length > 0 && (
        <section className="mt-10">
          <h2 className="text-xs font-bold tracking-[0.2em] text-black mb-6 uppercase border-b border-black pb-2">Selected Works</h2>
          <div className="grid grid-cols-2 gap-6">
            {cv.projects.map((proj, idx) => (
              <div key={idx}>
                <h3 className="font-bold text-black">{proj.name}</h3>
                <p className="text-xs text-gray-500 mt-1">{proj.description}</p>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  </div>
  );
};

// =============================================================================
// HEALTHCARE & SCIENCE TEMPLATES
// =============================================================================

export const HealthcareAdminTemplate: React.FC<TemplateProps> = ({ cv }) => {
  const accentColor = getAccentColor(cv, '#0d9488');
  return (
  <div className={`bg-white shadow-lg p-8 max-w-[8.5in] mx-auto font-sans text-slate-800 ${cv.is_grayscale ? 'grayscale' : ''}`}>
    <header className="flex items-center justify-between border-b-2 pb-6 mb-6" style={{ borderColor: accentColor }}>
      <div className="flex items-center gap-4">
        <TemplatePhoto photoUrl={cv.personal_info.photo_url} size="lg" shape="circle" borderColor={accentColor} />
        <div>
          <h1 className="text-3xl font-bold" style={{ color: accentColor }}>{cv.personal_info.full_name}</h1>
          <p className="text-lg mt-1" style={{ color: accentColor }}>{cv.target_role || 'Healthcare Professional'}</p>
        </div>
      </div>
      <div className="text-right text-sm text-slate-600">
        <p>{cv.personal_info.email}</p>
        <p>{cv.personal_info.phone}</p>
        <p>{cv.personal_info.city}</p>
      </div>
    </header>

    <div className="space-y-6">
      {cv.personal_info.summary && (
        <section className="p-4 rounded-lg border" style={{ backgroundColor: cv.is_grayscale ? '#f9fafb' : `${accentColor}10`, borderColor: cv.is_grayscale ? '#e5e7eb' : `${accentColor}30` }}>
          <h2 className="text-sm font-bold uppercase mb-2" style={{ color: accentColor }}>Professional Profile</h2>
          <p className="text-sm text-slate-700">{cv.personal_info.summary}</p>
        </section>
      )}

      {cv.certifications.length > 0 && (
        <section>
          <h2 className="text-lg font-bold mb-3 flex items-center" style={{ color: accentColor }}>
            <span className="w-1.5 h-6 mr-2" style={{ backgroundColor: accentColor }}></span> Licensure & Certifications
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {cv.certifications.map((cert, idx) => (
              <div key={idx} className="flex items-start gap-2">
                <span style={{ color: accentColor }} className="mt-1">✓</span>
                <div>
                  <p className="font-semibold text-sm text-slate-900">{cert.name}</p>
                  <p className="text-xs text-slate-500">{cert.issuer} | {formatDate(cert.date)}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {cv.experience.length > 0 && (
        <section>
          <h2 className="text-lg font-bold mb-4 flex items-center" style={{ color: accentColor }}>
            <span className="w-1.5 h-6 mr-2" style={{ backgroundColor: accentColor }}></span> Clinical & Administrative Experience
          </h2>
          <div className="space-y-5">
            {cv.experience.map((exp, idx) => (
              <div key={idx} className="pl-4 border-l border-slate-200">
                <div className="flex justify-between items-baseline">
                  <h3 className="font-bold text-slate-900">{exp.title}</h3>
                  <span className="text-sm text-slate-500">{formatDateRange(exp.start_date, exp.end_date, exp.current)}</span>
                </div>
                <p className="text-sm font-medium mb-2" style={{ color: accentColor }}>{exp.company}, {exp.location}</p>
                <ul className="list-disc list-inside text-sm text-slate-700 space-y-1">
                  {exp.achievements?.map((ach, i) => <li key={i}>{ach}</li>)}
                </ul>
              </div>
            ))}
          </div>
        </section>
      )}

      {cv.education.length > 0 && (
        <section>
          <h2 className="text-lg font-bold mb-3 flex items-center" style={{ color: accentColor }}>
            <span className="w-1.5 h-6 mr-2" style={{ backgroundColor: accentColor }}></span> Education
          </h2>
          <div className="space-y-2">
            {cv.education.map((edu, idx) => (
              <div key={idx}>
                <p className="font-bold text-sm text-slate-900">{edu.degree}</p>
                <p className="text-sm text-slate-600">{edu.institution}</p>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  </div>
  );
};

// =============================================================================
// NEW STRUCTURAL VARIANTS (SIDEBARS, GRIDS, SPLITS)
// =============================================================================

// 1. CLASSIC SPLIT (Left Sidebar 30%, Right Content 70%)
// Ideal for: Legal, Admin, Academic
export const ClassicSplitTemplate: React.FC<TemplateProps> = ({ cv }) => {
  const accentColor = getAccentColor(cv, '#4338ca');
  return (
  <div className={`bg-white shadow-lg max-w-[8.5in] mx-auto font-serif flex min-h-[11in] ${cv.is_grayscale ? 'grayscale' : ''}`}>
    {/* Sidebar */}
    <div className="w-[32%] bg-slate-100 p-6 border-r border-slate-200">
      <div className="mb-8 text-center">
        {cv.personal_info.photo_url ? (
          <TemplatePhoto photoUrl={cv.personal_info.photo_url} size="lg" shape="circle" borderColor={accentColor} className="mx-auto mb-4" />
        ) : (
          <div className="w-24 h-24 rounded-full mx-auto mb-4 flex items-center justify-center text-3xl text-white font-bold" style={{ backgroundColor: accentColor }}>
            {cv.personal_info.full_name.charAt(0)}
          </div>
        )}
        <h2 className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-4">Contact</h2>
        <div className="text-sm text-slate-700 space-y-2 break-words">
          <p>{cv.personal_info.email}</p>
          <p>{cv.personal_info.phone}</p>
          <p>{cv.personal_info.city}</p>
          {cv.personal_info.linkedin_url && <a href={cv.personal_info.linkedin_url} className="text-blue-800 underline block">LinkedIn</a>}
        </div>
      </div>

      {cv.education.length > 0 && (
        <section className="mb-8">
          <h2 className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-4 border-b border-slate-300 pb-1">Education</h2>
          <div className="space-y-4">
            {cv.education.map((edu, idx) => (
              <div key={idx}>
                <p className="font-bold text-sm text-slate-900">{edu.degree}</p>
                <p className="text-sm text-slate-700 italic">{edu.institution}</p>
                <p className="text-xs text-slate-500">{formatDate(edu.end_date)}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {cv.skills.length > 0 && (
        <section className="mb-8">
          <h2 className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-4 border-b border-slate-300 pb-1">Skills</h2>
          <ul className="space-y-2 text-sm text-slate-700">
            {cv.skills.map((skill, idx) => (
              <li key={idx} className="flex items-center gap-2">
                <span className="w-1 h-1 bg-slate-400 rounded-full"></span>
                {skill.name}
              </li>
            ))}
          </ul>
        </section>
      )}

      {cv.languages.length > 0 && (
        <section>
          <h2 className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-4 border-b border-slate-300 pb-1">Languages</h2>
          <ul className="space-y-1 text-sm text-slate-700">
            {cv.languages.map((lang, idx) => (
              <li key={idx}>{lang.name} <span className="text-slate-500 text-xs">({lang.proficiency})</span></li>
            ))}
          </ul>
        </section>
      )}
    </div>

    {/* Main Content */}
    <div className="w-[68%] p-8">
      <header className="mb-8 border-b-2 pb-4" style={{ borderColor: accentColor }}>
        <h1 className="text-4xl font-bold text-slate-900 mb-2">{cv.personal_info.full_name}</h1>
        <p className="text-lg uppercase tracking-wide" style={{ color: accentColor }}>{cv.target_role}</p>
      </header>

      {cv.personal_info.summary && (
        <section className="mb-8">
          <h2 className="text-lg font-bold text-slate-900 uppercase mb-3">Profile</h2>
          <p className="text-slate-700 leading-relaxed">{cv.personal_info.summary}</p>
        </section>
      )}

      {cv.experience.length > 0 && (
        <section className="mb-8">
          <h2 className="text-lg font-bold text-slate-900 uppercase mb-4">Experience</h2>
          <div className="space-y-6">
            {cv.experience.map((exp, idx) => (
              <div key={idx}>
                <div className="flex justify-between items-baseline mb-1">
                  <h3 className="font-bold text-xl text-slate-800">{exp.title}</h3>
                  <span className="text-sm text-slate-500">{formatDateRange(exp.start_date, exp.end_date, exp.current)}</span>
                </div>
                <p className="text-slate-600 font-bold mb-2">{exp.company} | {exp.location}</p>
                <p className="text-slate-700 mb-2">{exp.description}</p>
                {exp.achievements && (
                  <ul className="list-disc list-outside ml-5 text-slate-700 space-y-1">
                    {exp.achievements.map((ach, i) => <li key={i}>{ach}</li>)}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {cv.certifications.length > 0 && (
        <section>
          <h2 className="text-lg font-bold text-slate-900 uppercase mb-3">Certifications</h2>
          <ul className="space-y-2">
            {cv.certifications.map((cert, idx) => (
              <li key={idx} className="text-slate-700">
                <span className="font-bold">{cert.name}</span> — {cert.issuer}
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  </div>
  );
};

// 2. MODERN RIGHT SIDEBAR (Content Left 65%, Sidebar Right 35%)
// Ideal for: Consultants, Marketing, Business
export const ModernSidebarRightTemplate: React.FC<TemplateProps> = ({ cv }) => {
  const accentColor = getAccentColor(cv, '#7c3aed');
  return (
  <div className={`bg-white shadow-lg max-w-[8.5in] mx-auto font-sans flex min-h-[11in] ${cv.is_grayscale ? 'grayscale' : ''}`}>
    {/* Main Content (Left) */}
    <div className="w-[65%] p-8 pr-6">
      <header className="mb-8 flex items-center gap-4">
        <TemplatePhoto photoUrl={cv.personal_info.photo_url} size="lg" shape="circle" borderColor={accentColor} />
        <div>
          <h1 className="text-4xl font-extrabold text-gray-900 leading-tight mb-2">{cv.personal_info.full_name}</h1>
          <p className="text-xl font-medium" style={{ color: accentColor }}>{cv.target_role}</p>
        </div>
      </header>

      {cv.personal_info.summary && (
        <section className="mb-8">
          <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-3">About Me</h3>
          <p className="text-gray-700 leading-relaxed">{cv.personal_info.summary}</p>
        </section>
      )}

      {cv.experience.length > 0 && (
        <section className="mb-8">
          <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-6">Work Experience</h3>
          <div className="space-y-8 border-l-2 border-gray-100 pl-6 ml-2">
            {cv.experience.map((exp, idx) => (
              <div key={idx} className="relative">
                <span className="absolute -left-[31px] top-1.5 w-3 h-3 rounded-full border-2 border-white" style={{ backgroundColor: accentColor }}></span>
                <h4 className="font-bold text-lg text-gray-900">{exp.title}</h4>
                <p className="font-medium text-sm mb-2" style={{ color: accentColor }}>{exp.company}</p>
                <p className="text-xs text-gray-400 mb-3 uppercase">{formatDateRange(exp.start_date, exp.end_date, exp.current)}</p>
                <ul className="space-y-2">
                  {exp.achievements?.map((ach, i) => (
                    <li key={i} className="text-sm text-gray-700 flex gap-2">
                      <span style={{ color: accentColor }}>›</span> {ach}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>
      )}

      {cv.projects && cv.projects.length > 0 && (
        <section>
          <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">Key Projects</h3>
          <div className="space-y-4">
            {cv.projects.map((proj, idx) => (
              <div key={idx} className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-bold text-gray-900">{proj.name}</h4>
                <p className="text-sm text-gray-600 mt-1">{proj.description}</p>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>

    {/* Sidebar (Right) - Darker Background */}
    <div className="w-[35%] bg-slate-900 text-white p-8">
      <div className="mb-10 space-y-4 text-sm text-slate-300">
        <div className="flex items-center gap-3">
          <span className="w-8 h-8 bg-slate-800 rounded flex items-center justify-center">✉</span>
          <span className="break-all">{cv.personal_info.email}</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="w-8 h-8 bg-slate-800 rounded flex items-center justify-center">📱</span>
          <span>{cv.personal_info.phone}</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="w-8 h-8 bg-slate-800 rounded flex items-center justify-center">📍</span>
          <span>{cv.personal_info.city}</span>
        </div>
        {cv.personal_info.linkedin_url && (
          <div className="flex items-center gap-3">
            <span className="w-8 h-8 bg-slate-800 rounded flex items-center justify-center">in</span>
            <a href={cv.personal_info.linkedin_url} className="underline">LinkedIn</a>
          </div>
        )}
      </div>

      {cv.skills.length > 0 && (
        <section className="mb-10">
          <h3 className="font-bold uppercase tracking-widest text-sm mb-5" style={{ color: accentColor }}>Expertise</h3>
          <div className="flex flex-wrap gap-2">
            {cv.skills.map((skill, idx) => (
              <span key={idx} className="px-3 py-1 bg-slate-800 text-slate-200 text-xs rounded-full border border-slate-700">
                {skill.name}
              </span>
            ))}
          </div>
        </section>
      )}

      {cv.education.length > 0 && (
        <section className="mb-10">
          <h3 className="font-bold uppercase tracking-widest text-sm mb-5" style={{ color: accentColor }}>Education</h3>
          <div className="space-y-6">
            {cv.education.map((edu, idx) => (
              <div key={idx}>
                <p className="font-bold text-white">{edu.degree}</p>
                <p className="text-sm text-slate-400">{edu.institution}</p>
                <p className="text-xs text-slate-500 mt-1">{formatDate(edu.end_date)}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {cv.certifications.length > 0 && (
        <section>
          <h3 className="font-bold uppercase tracking-widest text-sm mb-5" style={{ color: accentColor }}>Certifications</h3>
          <ul className="space-y-3 text-sm text-slate-300">
            {cv.certifications.map((cert, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span style={{ color: accentColor }} className="mt-1">♦</span>
                <span>{cert.name}</span>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  </div>
  );
};

// 3. SWISS STYLE (Grid based, clean lines, Helvetica)
// Ideal for: Architects, Designers, Automation Specialists
export const SwissStyleTemplate: React.FC<TemplateProps> = ({ cv }) => {
  const accentColor = getAccentColor(cv, '#dc2626');
  return (
  <div className={`bg-white shadow-lg p-10 max-w-[8.5in] mx-auto font-sans text-black ${cv.is_grayscale ? 'grayscale' : ''}`}>
    <header className="mb-12 border-b-4 pb-6 flex items-end gap-6" style={{ borderColor: accentColor }}>
      <TemplatePhoto photoUrl={cv.personal_info.photo_url} size="lg" shape="square" borderColor={accentColor} />
      <div className="flex-1">
        <h1 className="text-6xl font-black tracking-tighter mb-4">{cv.personal_info.full_name.toUpperCase()}</h1>
        <div className="flex justify-between items-end">
          <p className="text-xl font-bold uppercase tracking-wide" style={{ color: accentColor }}>{cv.target_role}</p>
          <div className="text-right text-sm font-medium">
            <p>{cv.personal_info.email} / {cv.personal_info.phone}</p>
            <p>{cv.personal_info.city}</p>
          </div>
        </div>
      </div>
    </header>

    <div className="grid grid-cols-4 gap-8">
      {/* Left Column - Labels */}
      <div className="col-span-1 border-r-2 pr-4 text-right space-y-24 pt-2" style={{ borderColor: accentColor }}>
        <h3 className="font-black uppercase tracking-widest text-sm">Profile</h3>
        <h3 className="font-black uppercase tracking-widest text-sm">Experience</h3>
        <h3 className="font-black uppercase tracking-widest text-sm">Education</h3>
        <h3 className="font-black uppercase tracking-widest text-sm">Skills</h3>
      </div>

      {/* Right Column - Content */}
      <div className="col-span-3 space-y-16">
        {/* Profile */}
        <section>
          <p className="text-lg font-medium leading-relaxed">{cv.personal_info.summary}</p>
        </section>

        {/* Experience */}
        <section className="space-y-8">
          {cv.experience.map((exp, idx) => (
            <div key={idx} className="grid grid-cols-1 gap-2">
              <div className="flex justify-between items-baseline border-b border-gray-300 pb-1">
                <h4 className="text-xl font-bold">{exp.title}</h4>
                <span className="font-mono text-sm">{formatDateRange(exp.start_date, exp.end_date, exp.current)}</span>
              </div>
              <p className="font-bold text-sm uppercase">{exp.company}</p>
              <p className="text-gray-700">{exp.description}</p>
            </div>
          ))}
        </section>

        {/* Education */}
        <section className="grid grid-cols-2 gap-6">
          {cv.education.map((edu, idx) => (
            <div key={idx} className="border-l-4 pl-4" style={{ borderLeftColor: accentColor }}>
              <p className="font-bold text-lg">{edu.degree}</p>
              <p className="text-sm uppercase">{edu.institution}</p>
              <p className="text-xs font-mono mt-1">{formatDate(edu.end_date)}</p>
            </div>
          ))}
        </section>

        {/* Skills */}
        <section>
          <div className="flex flex-wrap gap-x-6 gap-y-2">
            {cv.skills.map((skill, idx) => (
              <span key={idx} className="text-sm font-bold border-b border-gray-400 pb-0.5">
                {skill.name}
              </span>
            ))}
          </div>
        </section>
      </div>
    </div>
  </div>
  );
};

// 4. BANNER HEADER (Full width colored header)
// Ideal for: Admin, Customer Service, General
export const BannerHeaderTemplate: React.FC<TemplateProps> = ({ cv }) => {
  const accentColor = getAccentColor(cv, '#0369a1');
  return (
  <div className={`bg-white shadow-lg max-w-[8.5in] mx-auto font-sans text-gray-800 ${cv.is_grayscale ? 'grayscale' : ''}`}>
    <header className="text-white p-10 text-center" style={{ backgroundColor: accentColor }}>
      <TemplatePhoto photoUrl={cv.personal_info.photo_url} size="lg" shape="circle" borderColor="#ffffff" className="mx-auto mb-4" />
      <h1 className="text-4xl font-bold mb-2 tracking-wide">{cv.personal_info.full_name}</h1>
      <p className="text-lg font-medium uppercase tracking-widest mb-6" style={{ color: 'rgba(255,255,255,0.8)' }}>{cv.target_role}</p>
      <div className="flex justify-center gap-6 text-sm font-light">
        <span>{cv.personal_info.email}</span>
        <span>|</span>
        <span>{cv.personal_info.phone}</span>
        <span>|</span>
        <span>{cv.personal_info.city}</span>
      </div>
    </header>

    <div className="p-10">
      {cv.personal_info.summary && (
        <section className="mb-8 text-center max-w-2xl mx-auto">
          <p className="text-gray-600 leading-relaxed italic">{cv.personal_info.summary}</p>
        </section>
      )}

      <div className="grid grid-cols-2 gap-10">
        <div className="space-y-8">
          {cv.experience.length > 0 && (
            <section>
              <h2 className="font-bold uppercase border-b-2 mb-4 pb-1" style={{ color: accentColor, borderColor: `${accentColor}30` }}>Experience</h2>
              <div className="space-y-6">
                {cv.experience.map((exp, idx) => (
                  <div key={idx}>
                    <h3 className="font-bold text-gray-900">{exp.title}</h3>
                    <div className="flex justify-between text-sm mb-2" style={{ color: accentColor }}>
                      <span>{exp.company}</span>
                      <span>{formatDateRange(exp.start_date, exp.end_date, exp.current)}</span>
                    </div>
                    <p className="text-sm text-gray-600">{exp.description}</p>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        <div className="space-y-8">
          {cv.education.length > 0 && (
            <section>
              <h2 className="font-bold uppercase border-b-2 mb-4 pb-1" style={{ color: accentColor, borderColor: `${accentColor}30` }}>Education</h2>
              {cv.education.map((edu, idx) => (
                <div key={idx} className="mb-4">
                  <p className="font-bold text-gray-900">{edu.degree}</p>
                  <p className="text-sm text-gray-600">{edu.institution}</p>
                  <p className="text-xs text-gray-400">{formatDate(edu.end_date)}</p>
                </div>
              ))}
            </section>
          )}

          {cv.skills.length > 0 && (
            <section>
              <h2 className="font-bold uppercase border-b-2 mb-4 pb-1" style={{ color: accentColor, borderColor: `${accentColor}30` }}>Skills</h2>
              <div className="grid grid-cols-2 gap-2">
                {cv.skills.map((skill, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-sm text-gray-700">
                    <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: accentColor }}></span>
                    {skill.name}
                  </div>
                ))}
              </div>
            </section>
          )}
          
          {cv.certifications.length > 0 && (
            <section>
              <h2 className="font-bold uppercase border-b-2 mb-4 pb-1" style={{ color: accentColor, borderColor: `${accentColor}30` }}>Certifications</h2>
              <ul className="space-y-2 text-sm text-gray-600">
                {cv.certifications.map((cert, idx) => (
                  <li key={idx}>{cert.name}</li>
                ))}n              </ul>
            </section>
          )}
        </div>
      </div>
    </div>
  </div>
  );
};

// =============================================================================
// EXPORTS
// =============================================================================

// EXECUTIVE (High-end, Gold/Navy, Serif headers)
export const ExecutiveTemplate: React.FC<TemplateProps> = ({ cv }) => {
  const accentColor = getAccentColor(cv, '#1e3a5f');
  const goldColor = cv.is_grayscale ? '#6b7280' : '#d97706';
  return (
  <div className={`bg-white shadow-lg max-w-[8.5in] mx-auto font-sans p-12 border-t-[16px] ${cv.is_grayscale ? 'grayscale' : ''}`} style={{ borderTopColor: accentColor }}>
    <header className="text-center mb-12">
      <TemplatePhoto photoUrl={cv.personal_info.photo_url} size="lg" shape="circle" borderColor={goldColor} className="mx-auto mb-4" />
      <h1 className="text-5xl font-serif font-bold mb-3" style={{ color: accentColor }}>{cv.personal_info.full_name}</h1>
      <p className="text-xl font-medium tracking-widest uppercase" style={{ color: goldColor }}>{cv.target_role}</p>
      <div className="flex justify-center gap-6 mt-6 text-slate-500 text-sm font-medium">
        <span>{cv.personal_info.email}</span>
        <span>•</span>
        <span>{cv.personal_info.phone}</span>
        <span>•</span>
        <span>{cv.personal_info.city}</span>
        {cv.personal_info.linkedin_url && (
          <>
            <span>•</span>
            <a href={cv.personal_info.linkedin_url} className="text-slate-700 hover:text-amber-600">LinkedIn</a>
          </>
        )}
      </div>
    </header>

    <div className="space-y-10">
      {cv.personal_info.summary && (
        <section className="text-center max-w-3xl mx-auto">
          <p className="text-lg text-slate-700 leading-relaxed font-serif italic">"{cv.personal_info.summary}"</p>
        </section>
      )}

      <div className="grid grid-cols-1 gap-10">
        <section>
          <h3 className="text-center text-xs font-bold uppercase tracking-[0.3em] text-slate-400 mb-8 flex items-center justify-center">
            <span className="w-12 h-px bg-slate-300 mr-4"></span> Professional Experience <span className="w-12 h-px bg-slate-300 ml-4"></span>
          </h3>
          <div className="space-y-8">
            {cv.experience.map((exp, idx) => (
              <div key={idx} className="grid grid-cols-12 gap-4">
                <div className="col-span-3 text-right pt-1">
                  <p className="font-bold text-slate-900">{formatDateRange(exp.start_date, exp.end_date, exp.current)}</p>
                  <p className="text-slate-500 text-sm">{exp.location}</p>
                </div>
                <div className="col-span-9 border-l-2 pl-6 pb-2" style={{ borderColor: goldColor }}>
                  <h4 className="text-2xl font-serif font-bold" style={{ color: accentColor }}>{exp.title}</h4>
                  <p className="font-medium mb-3 text-lg" style={{ color: goldColor }}>{exp.company}</p>
                  <p className="text-slate-700 mb-3 leading-relaxed">{exp.description}</p>
                  {exp.achievements && (
                    <ul className="space-y-1">
                      {exp.achievements.map((ach, i) => (
                        <li key={i} className="text-slate-700 flex items-start gap-2">
                          <span style={{ color: goldColor }} className="mt-1.5 text-[10px]">■</span>
                          <span>{ach}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>

        <div className="grid grid-cols-2 gap-12 border-t border-slate-200 pt-10">
          <section>
            <h3 className="text-xs font-bold uppercase tracking-[0.3em] text-slate-400 mb-6">Core Competencies</h3>
            <div className="flex flex-wrap gap-3">
              {cv.skills.map((skill, idx) => (
                <span key={idx} className="px-3 py-1 bg-slate-100 text-slate-700 text-sm font-medium border border-slate-200">
                  {skill.name}
                </span>
              ))}
            </div>
          </section>

          <section>
            <h3 className="text-xs font-bold uppercase tracking-[0.3em] text-slate-400 mb-6">Education</h3>
            {cv.education.map((edu, idx) => (
              <div key={idx} className="mb-4">
                <p className="font-bold text-slate-900 text-lg">{edu.degree}</p>
                <p className="text-slate-600">{edu.institution}</p>
              </div>
            ))}n          </section>
        </div>
      </div>
    </div>
  </div>
  );
};

// FREELANCER (Unique modern portfolio-focused layout)
export const FreelancerTemplate: React.FC<TemplateProps> = ({ cv }) => {
  const accentColor = getAccentColor(cv, '#f97316');
  const bgGradient = cv.is_grayscale ? 'bg-gray-50' : 'bg-gradient-to-br from-orange-50 to-amber-50';
  return (
  <div className={`${bgGradient} shadow-lg max-w-[8.5in] mx-auto font-sans min-h-[11in] ${cv.is_grayscale ? 'grayscale' : ''}`}>
    <header className="text-white p-8" style={{ backgroundColor: accentColor }}>
      <div className="flex items-center gap-4">
        <TemplatePhoto photoUrl={cv.personal_info.photo_url} size="lg" shape="circle" borderColor="#ffffff" />
        <div>
          <h1 className="text-3xl font-bold">{cv.personal_info.full_name}</h1>
          <p className="text-lg mt-1" style={{ color: 'rgba(255,255,255,0.8)' }}>{cv.target_role}</p>
        </div>
      </div>
      <div className="flex flex-wrap gap-6 mt-4 text-sm" style={{ color: 'rgba(255,255,255,0.7)' }}>
        <span>📧 {cv.personal_info.email}</span>
        <span>📱 {cv.personal_info.phone}</span>
        {cv.personal_info.portfolio_url && <span>🌐 Portfolio</span>}
      </div>
    </header>
    
    <div className="p-8">
      {cv.personal_info.summary && (
        <section className="mb-8 bg-white p-6 rounded-xl shadow-sm border-l-4" style={{ borderLeftColor: accentColor }}>
          <p className="text-gray-700 italic leading-relaxed">{cv.personal_info.summary}</p>
        </section>
      )}
      
      <section className="mb-8">
        <h3 className="text-lg font-bold mb-4 flex items-center gap-2" style={{ color: accentColor }}>
          <span className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: `${accentColor}20` }}>💼</span>
          Work History
        </h3>
        <div className="space-y-4">
          {cv.experience.map((exp, idx) => (
            <div key={idx} className="bg-white p-5 rounded-xl shadow-sm">
              <div className="flex justify-between items-baseline">
                <h4 className="font-bold text-gray-800">{exp.title}</h4>
                <span className="text-sm" style={{ color: accentColor }}>{formatDateRange(exp.start_date, exp.end_date, exp.current)}</span>
              </div>
              <p className="font-medium" style={{ color: accentColor }}>{exp.company}</p>
              <p className="text-gray-600 text-sm mt-2">{exp.description}</p>
            </div>
          ))}
        </div>
      </section>
      
      <div className="grid grid-cols-2 gap-6">
        <section className="bg-white p-5 rounded-xl shadow-sm">
          <h3 className="text-lg font-bold mb-3" style={{ color: accentColor }}>Skills</h3>
          <div className="flex flex-wrap gap-2">
            {cv.skills.map((skill, idx) => (
              <span key={idx} className="px-3 py-1 rounded-full text-sm" style={{ backgroundColor: `${accentColor}20`, color: accentColor }}>{skill.name}</span>
            ))}
          </div>
        </section>
        
        <section className="bg-white p-5 rounded-xl shadow-sm">
          <h3 className="text-lg font-bold mb-3" style={{ color: accentColor }}>Education</h3>
          {cv.education.map((edu, idx) => (
            <div key={idx} className="mb-2">
              <h4 className="font-semibold text-gray-800 text-sm">{edu.degree}</h4>
              <p className="text-gray-600 text-sm">{edu.institution}</p>
            </div>
          ))}
        </section>
      </div>
    </div>
  </div>
  );
};

// AI/ML ENGINEER (Unique tech-focused violet layout)
export const AIMLTemplate: React.FC<TemplateProps> = ({ cv }) => {
  const accentColor = getAccentColor(cv, '#8b5cf6');
  const bgGradient = cv.is_grayscale ? 'bg-gray-50' : `bg-gradient-to-r from-purple-50 to-violet-50`;
  return (
  <div className={`bg-white shadow-lg max-w-[8.5in] mx-auto font-mono min-h-[11in] border-t-8 ${cv.is_grayscale ? 'grayscale' : ''}`} style={{ borderTopColor: accentColor }}>
    <header className={`p-8 ${bgGradient}`}>
      <div className="flex items-center gap-4">
        <TemplatePhoto photoUrl={cv.personal_info.photo_url} size="md" shape="rounded" borderColor={accentColor} />
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{cv.personal_info.full_name}</h1>
          <p className="font-bold uppercase tracking-wider mt-1" style={{ color: accentColor }}>{cv.target_role}</p>
        </div>
      </div>
      <div className="mt-3 text-sm text-gray-500 flex flex-wrap gap-4">
        <span>📧 {cv.personal_info.email}</span>
        <span>📱 {cv.personal_info.phone}</span>
        <span>🤖 ML Engineer</span>
      </div>
    </header>
    
    <div className="p-8">
      <div className="p-4 rounded-lg mb-8" style={{ backgroundColor: `${accentColor}10` }}>
        <h3 className="text-xs font-bold uppercase mb-2" style={{ color: accentColor }}>AI/ML Frameworks</h3>
        <div className="flex flex-wrap gap-2">
          {cv.skills.slice(0, 6).map((skill, idx) => (
            <span key={idx} className="px-3 py-1 bg-white rounded border text-sm" style={{ borderColor: `${accentColor}40`, color: accentColor }}>{skill.name}</span>
          ))}
        </div>
      </div>
      
      {cv.personal_info.summary && (
        <section className="mb-8 border-l-4 pl-4" style={{ borderLeftColor: accentColor }}>
          <p className="text-gray-700">{cv.personal_info.summary}</p>
        </section>
      )}
      
      <section className="mb-8">
        <h3 className="text-sm font-bold uppercase mb-4 border-b pb-2" style={{ color: accentColor, borderColor: `${accentColor}40` }}>Experience</h3>
        <div className="space-y-6">
          {cv.experience.map((exp, idx) => (
            <div key={idx} className="border-l-2 pl-4" style={{ borderLeftColor: `${accentColor}60` }}>
              <div className="flex justify-between">
                <h4 className="font-bold text-gray-800">{exp.title}</h4>
                <span className="text-sm" style={{ color: accentColor }}>{formatDateRange(exp.start_date, exp.end_date, exp.current)}</span>
              </div>
              <p className="text-sm" style={{ color: accentColor }}>{exp.company}</p>
              <p className="text-gray-600 text-sm mt-2">{exp.description}</p>
            </div>
          ))}
        </div>
      </section>
      
      <section>
        <h3 className="text-sm font-bold uppercase mb-4 border-b pb-2" style={{ color: accentColor, borderColor: `${accentColor}40` }}>Education</h3>
        {cv.education.map((edu, idx) => (
          <div key={idx} className="mb-3">
            <h4 className="font-bold text-gray-800">{edu.degree}</h4>
            <p className="text-gray-600">{edu.institution}</p>
          </div>
        ))}
      </section>
    </div>
  </div>
  );
};

// DATA SCIENTIST (Unique clean academic/tech layout)
export const DataScienceTemplate: React.FC<TemplateProps> = ({ cv }) => {
  const accentColor = getAccentColor(cv, '#0ea5e9');
  return (
  <div className={`bg-slate-50 shadow-lg max-w-[8.5in] mx-auto font-sans min-h-[11in] ${cv.is_grayscale ? 'grayscale' : ''}`}>
    <header className="text-white p-8" style={{ backgroundColor: accentColor }}>
      <div className="flex items-center gap-4">
        <TemplatePhoto photoUrl={cv.personal_info.photo_url} size="lg" shape="circle" borderColor="#ffffff" />
        <div>
          <h1 className="text-3xl font-bold">{cv.personal_info.full_name}</h1>
          <p className="text-lg mt-1" style={{ color: 'rgba(255,255,255,0.8)' }}>{cv.target_role}</p>
        </div>
      </div>
      <div className="flex flex-wrap gap-6 mt-4 text-sm" style={{ color: 'rgba(255,255,255,0.7)' }}>
        <span>📧 {cv.personal_info.email}</span>
        <span>📱 {cv.personal_info.phone}</span>
        <span>📊 Data Science</span>
      </div>
    </header>
    
    <div className="p-8">
      <div className="grid grid-cols-4 gap-4 mb-8 text-center">
        <div className="bg-white p-4 rounded shadow-sm">
          <div className="text-xl font-bold text-slate-700">Python</div>
          <div className="text-xs text-gray-500">Primary Language</div>
        </div>
        <div className="bg-white p-4 rounded shadow-sm">
          <div className="text-xl font-bold text-slate-700">TensorFlow</div>
          <div className="text-xs text-gray-500">ML Framework</div>
        </div>
        <div className="bg-white p-4 rounded shadow-sm">
          <div className="text-xl font-bold text-slate-700">SQL</div>
          <div className="text-xs text-gray-500">Data Queries</div>
        </div>
        <div className="bg-white p-4 rounded shadow-sm">
          <div className="text-xl font-bold text-slate-700">Spark</div>
          <div className="text-xs text-gray-500">Big Data</div>
        </div>
      </div>
      
      {cv.personal_info.summary && (
        <section className="mb-8 bg-white p-5 rounded shadow-sm border-l-4" style={{ borderLeftColor: accentColor }}>
          <p className="text-gray-700 leading-relaxed">{cv.personal_info.summary}</p>
        </section>
      )}
      
      <section className="mb-8">
        <h3 className="text-lg font-bold mb-4 border-b-2 pb-2" style={{ color: accentColor, borderColor: `${accentColor}40` }}>Professional Experience</h3>
        <div className="space-y-6">
          {cv.experience.map((exp, idx) => (
            <div key={idx} className="bg-white p-5 rounded shadow-sm">
              <div className="flex justify-between items-baseline">
                <h4 className="font-bold text-gray-800 text-lg">{exp.title}</h4>
                <span className="text-sm text-slate-500">{formatDateRange(exp.start_date, exp.end_date, exp.current)}</span>
              </div>
              <p className="text-slate-600 font-medium">{exp.company}</p>
              <p className="text-gray-600 mt-2">{exp.description}</p>
            </div>
          ))}
        </div>
      </section>
      
      <div className="grid grid-cols-2 gap-8">
        <section>
          <h3 className="text-lg font-bold mb-4 border-b-2 pb-2" style={{ color: accentColor, borderColor: `${accentColor}40` }}>Technical Skills</h3>
          <div className="flex flex-wrap gap-2">
            {cv.skills.map((skill, idx) => (
              <span key={idx} className="px-3 py-1 rounded text-sm" style={{ backgroundColor: `${accentColor}20`, color: accentColor }}>{skill.name}</span>
            ))}
          </div>
        </section>
        
        <section>
          <h3 className="text-lg font-bold mb-4 border-b-2 pb-2" style={{ color: accentColor, borderColor: `${accentColor}40` }}>Education</h3>
          {cv.education.map((edu, idx) => (
            <div key={idx} className="mb-3">
              <h4 className="font-bold text-gray-800">{edu.degree}</h4>
              <p className="text-gray-600">{edu.institution}</p>
            </div>
          ))}
        </section>
      </div>
    </div>
  </div>
  );
};

// DATA ANALYST (Unique blue-accented analytics layout)
export const DataAnalystTemplate: React.FC<TemplateProps> = ({ cv }) => {
  const accentColor = getAccentColor(cv, '#0d9488');
  return (
  <div className={`bg-white shadow-lg max-w-[8.5in] mx-auto font-sans min-h-[11in] border-l-4 ${cv.is_grayscale ? 'grayscale' : ''}`} style={{ borderLeftColor: accentColor }}>
    <header className="p-8" style={{ backgroundColor: `${accentColor}10` }}>
      <div className="flex items-center gap-4">
        <TemplatePhoto photoUrl={cv.personal_info.photo_url} size="md" shape="circle" borderColor={accentColor} />
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{cv.personal_info.full_name}</h1>
          <p className="text-lg font-medium mt-1" style={{ color: accentColor }}>{cv.target_role}</p>
        </div>
      </div>
      <div className="flex flex-wrap gap-6 mt-4 text-sm text-gray-500">
        <span>📧 {cv.personal_info.email}</span>
        <span>📱 {cv.personal_info.phone}</span>
        <span>📈 Analytics Pro</span>
      </div>
    </header>
    
    <div className="p-8">
      <div className="bg-sky-50 p-4 rounded-lg mb-8">
        <h3 className="text-sm font-bold text-sky-700 uppercase mb-3">Analytics Toolkit</h3>
        <div className="flex flex-wrap gap-2">
          {cv.skills.map((skill, idx) => (
            <span key={idx} className="px-3 py-1 bg-white text-sky-700 rounded border border-sky-200 text-sm">{skill.name}</span>
          ))}
        </div>
      </div>
      
      {cv.personal_info.summary && (
        <section className="mb-8 border-l-4 border-sky-400 pl-4 bg-gray-50 p-4">
          <p className="text-gray-700 leading-relaxed">{cv.personal_info.summary}</p>
        </section>
      )}
      
      <section className="mb-8">
        <h3 className="text-lg font-bold text-sky-700 mb-4 border-b-2 border-sky-200 pb-2">Work Experience</h3>
        <div className="space-y-6">
          {cv.experience.map((exp, idx) => (
            <div key={idx} className="border-l-2 border-sky-300 pl-4">
              <div className="flex justify-between items-baseline">
                <h4 className="font-bold text-gray-800 text-lg">{exp.title}</h4>
                <span className="text-sm text-sky-600">{formatDateRange(exp.start_date, exp.end_date, exp.current)}</span>
              </div>
              <p className="text-sky-600 font-medium">{exp.company}</p>
              <p className="text-gray-600 mt-2">{exp.description}</p>
            </div>
          ))}
        </div>
      </section>
      
      <section>
        <h3 className="text-lg font-bold text-sky-700 mb-4 border-b-2 border-sky-200 pb-2">Education</h3>
        {cv.education.map((edu, idx) => (
          <div key={idx} className="mb-3">
            <h4 className="font-bold text-gray-800">{edu.degree}</h4>
            <p className="text-gray-600">{edu.institution}</p>
          </div>
        ))}
      </section>
    </div>
  </div>
  );
};

// RESEARCH ANALYST (Unique academic serif layout)
export const ResearchAnalystTemplate: React.FC<TemplateProps> = ({ cv }) => {
  const accentColor = getAccentColor(cv, '#d97706');
  const bgTint = cv.is_grayscale ? 'bg-gray-50' : 'bg-amber-50';
  const tagBg = cv.is_grayscale ? 'bg-gray-100 text-gray-700' : 'bg-amber-100 text-amber-700';
  
  return (
  <div className={`bg-white shadow-lg max-w-[8.5in] mx-auto font-serif min-h-[11in] ${cv.is_grayscale ? 'grayscale' : ''}`}>
    <header className="text-center border-b-2 p-8" style={{ borderColor: accentColor }}>
      <TemplatePhoto photoUrl={cv.personal_info.photo_url} size="lg" shape="circle" borderColor={accentColor} className="mx-auto mb-3" />
      <h1 className="text-3xl font-bold text-gray-900">{cv.personal_info.full_name}</h1>
      <p className="text-lg font-medium mt-1" style={{ color: accentColor }}>{cv.target_role}</p>
      <div className="flex justify-center flex-wrap gap-6 mt-4 text-sm text-gray-500 font-sans">
        <span>📧 {cv.personal_info.email}</span>
        <span>📱 {cv.personal_info.phone}</span>
        <span>📚 Research Focus</span>
      </div>
    </header>
    
    <div className="p-8">
      {cv.personal_info.summary && (
        <section className={`mb-8 ${bgTint} p-5 rounded border-l-4`} style={{ borderLeftColor: accentColor }}>
          <h3 className="text-sm font-bold uppercase mb-2 font-sans" style={{ color: accentColor }}>Research Summary</h3>
          <p className="text-gray-700 leading-relaxed">{cv.personal_info.summary}</p>
        </section>
      )}
      
      <section className="mb-8">
        <h3 className="text-lg font-bold border-b pb-2 mb-4 uppercase tracking-wider font-sans" style={{ color: accentColor, borderBottomColor: accentColor }}>Professional Experience</h3>
        <div className="space-y-6">
          {cv.experience.map((exp, idx) => (
            <div key={idx} className="border-l-2 pl-4" style={{ borderLeftColor: accentColor }}>
              <div className="flex justify-between items-baseline">
                <h4 className="font-bold text-gray-800 text-lg">{exp.title}</h4>
                <span className="text-sm font-sans" style={{ color: accentColor }}>{formatDateRange(exp.start_date, exp.end_date, exp.current)}</span>
              </div>
              <p className="font-medium" style={{ color: accentColor }}>{exp.company}</p>
              <p className="text-gray-600 mt-2 leading-relaxed">{exp.description}</p>
            </div>
          ))}
        </div>
      </section>
      
      <div className="grid grid-cols-2 gap-8">
        <section>
          <h3 className="text-lg font-bold border-b pb-2 mb-4 uppercase tracking-wider font-sans" style={{ color: accentColor, borderBottomColor: accentColor }}>Research Areas</h3>
          <div className="flex flex-wrap gap-2 font-sans">
            {cv.skills.map((skill, idx) => (
              <span key={idx} className={`px-3 py-1 ${tagBg} rounded text-sm`}>{skill.name}</span>
            ))}
          </div>
        </section>
        
        <section>
          <h3 className="text-lg font-bold border-b pb-2 mb-4 uppercase tracking-wider font-sans" style={{ color: accentColor, borderBottomColor: accentColor }}>Education</h3>
          {cv.education.map((edu, idx) => (
            <div key={idx} className="mb-3">
              <h4 className="font-bold text-gray-800">{edu.degree}</h4>
              <p className="text-gray-600">{edu.institution}</p>
            </div>
          ))}
        </section>
      </div>
    </div>
  </div>
  );
};

// QA ENGINEER (Clean, tabular, precise)
export const QAEngineerTemplate: React.FC<TemplateProps> = ({ cv }) => {
  const accentColor = getAccentColor(cv, '#16a34a');
  
  return (
  <div className={`bg-white shadow-lg max-w-[8.5in] mx-auto font-mono text-sm p-8 border-t-8 ${cv.is_grayscale ? 'grayscale' : ''}`} style={{ borderTopColor: accentColor }}>
    <header className="mb-8 border-b border-gray-300 pb-4">
      <div className="flex items-center gap-4">
        <TemplatePhoto photoUrl={cv.personal_info.photo_url} size="md" shape="rounded" borderColor={accentColor} />
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-1">{cv.personal_info.full_name}</h1>
          <p className="font-bold uppercase tracking-wider" style={{ color: accentColor }}>{cv.target_role}</p>
        </div>
      </div>
      <div className="mt-2 text-xs text-gray-500 flex gap-4">
        <span>{cv.personal_info.email}</span>
        <span>{cv.personal_info.phone}</span>
        <span>{cv.personal_info.city}</span>
      </div>
    </header>

    <div className="grid grid-cols-1 gap-6">
      <section>
        <h3 className="font-bold uppercase border-b mb-3" style={{ color: accentColor, borderBottomColor: accentColor }}>Technical Skills</h3>
        <div className="grid grid-cols-3 gap-2">
          {cv.skills.map((skill, idx) => (
            <div key={idx} className="bg-gray-50 p-2 border border-gray-200 rounded">
              {skill.name}
            </div>
          ))}
        </div>
      </section>

      <section>
        <h3 className="font-bold uppercase border-b mb-3" style={{ color: accentColor, borderBottomColor: accentColor }}>Experience</h3>
        <div className="space-y-4">
          {cv.experience.map((exp, idx) => (
            <div key={idx}>
              <div className="flex justify-between font-bold">
                <span>{exp.title}</span>
                <span>{formatDateRange(exp.start_date, exp.end_date, exp.current)}</span>
              </div>
              <div className="text-gray-600 italic mb-1">{exp.company}</div>
              <ul className="list-square ml-4 space-y-1 text-gray-700">
                {exp.achievements?.map((ach, i) => <li key={i}>{ach}</li>)}
              </ul>
            </div>
          ))}
        </div>
      </section>
      
      <section>
        <h3 className="font-bold uppercase border-b mb-3" style={{ color: accentColor, borderBottomColor: accentColor }}>Education</h3>
        {cv.education.map((edu, idx) => (
          <div key={idx}>
            <span className="font-bold">{edu.degree}</span> - {edu.institution}
          </div>
        ))}
      </section>
    </div>
  </div>
  );
};

// AUTOMATION SPECIALIST (Modern, dark mode header)
export const AutomationSpecialistTemplate: React.FC<TemplateProps> = ({ cv }) => {
  const accentColor = getAccentColor(cv, '#06b6d4');
  
  return (
  <div className={`bg-white shadow-lg max-w-[8.5in] mx-auto font-sans ${cv.is_grayscale ? 'grayscale' : ''}`}>
    <header className="bg-slate-900 text-white p-8 flex justify-between items-center">
      <div className="flex items-center gap-4">
        <TemplatePhoto photoUrl={cv.personal_info.photo_url} size="md" shape="rounded" borderColor={accentColor} />
        <div>
          <h1 className="text-3xl font-bold" style={{ color: accentColor }}>{cv.personal_info.full_name}</h1>
          <p className="text-lg tracking-widest uppercase mt-1">{cv.target_role}</p>
        </div>
      </div>
      <div className="text-right text-sm text-slate-400">
        <p>{cv.personal_info.email}</p>
        <p>{cv.personal_info.phone}</p>
        <p>{cv.personal_info.city}</p>
      </div>
    </header>

    <div className="p-8 grid grid-cols-3 gap-8">
      <div className="col-span-2 space-y-6">
        <section>
          <h3 className="text-slate-900 font-bold text-xl mb-4 flex items-center gap-2">
            <span className="w-2 h-8" style={{ backgroundColor: accentColor }}></span> Experience
          </h3>
          {cv.experience.map((exp, idx) => (
            <div key={idx} className="mb-6 pl-4 border-l border-slate-200">
              <h4 className="font-bold text-lg">{exp.title}</h4>
              <p className="font-medium mb-2" style={{ color: accentColor }}>{exp.company} | {formatDateRange(exp.start_date, exp.end_date, exp.current)}</p>
              <p className="text-slate-600">{exp.description}</p>
            </div>
          ))}
        </section>
      </div>

      <div className="col-span-1 bg-slate-50 p-4 rounded-lg h-fit">
        <section className="mb-6">
          <h3 className="font-bold text-slate-900 mb-3 border-b border-slate-300 pb-1">Skills</h3>
          <div className="flex flex-wrap gap-2">
            {cv.skills.map((skill, idx) => (
              <span key={idx} className="bg-white border border-slate-200 px-2 py-1 text-xs rounded shadow-sm text-slate-700">
                {skill.name}
              </span>
            ))}
          </div>
        </section>
        
        <section>
          <h3 className="font-bold text-slate-900 mb-3 border-b border-slate-300 pb-1">Education</h3>
          {cv.education.map((edu, idx) => (
            <div key={idx} className="mb-3">
              <p className="font-bold text-sm">{edu.degree}</p>
              <p className="text-xs text-slate-500">{edu.institution}</p>
            </div>
          ))}
        </section>
      </div>
    </div>
  </div>
  );
};

// AI PROMPT ENGINEER (Futuristic, minimal)
export const AIPromptEngineerTemplate: React.FC<TemplateProps> = ({ cv }) => {
  const accentColor = getAccentColor(cv, '#9333ea');
  
  return (
  <div className={`bg-white shadow-lg max-w-[8.5in] mx-auto font-sans p-10 border-l-[12px] ${cv.is_grayscale ? 'grayscale' : ''}`} style={{ borderLeftColor: accentColor }}>
    <header className="mb-10 flex items-center gap-6">
      <TemplatePhoto photoUrl={cv.personal_info.photo_url} size="lg" shape="rounded" borderColor={accentColor} />
      <div>
        <h1 className="text-5xl font-thin text-gray-900 mb-2">{cv.personal_info.full_name}</h1>
        <p className="text-xl font-medium" style={{ color: accentColor }}>{cv.target_role}</p>
      </div>
    </header>

    <div className="grid grid-cols-1 gap-8">
      <section>
        <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-gray-400 mb-4">Expertise</h3>
        <div className="flex flex-wrap gap-3">
          {cv.skills.map((skill, idx) => (
            <span key={idx} className="text-sm border-b-2 pb-1" style={{ borderBottomColor: accentColor }}>
              {skill.name}
            </span>
          ))}
        </div>
      </section>

      <section>
        <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-gray-400 mb-6">History</h3>
        <div className="space-y-8">
          {cv.experience.map((exp, idx) => (
            <div key={idx} className="group">
              <div className="flex justify-between items-end mb-2">
                <h4 className="text-xl font-bold text-gray-800">{exp.title}</h4>
                <span className="text-sm text-gray-400">{formatDateRange(exp.start_date, exp.end_date, exp.current)}</span>
              </div>
              <p className="text-sm mb-2" style={{ color: accentColor }}>{exp.company}</p>
              <p className="text-gray-600 leading-relaxed">{exp.description}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  </div>
  );
};

// DESIGNER TEMPLATE (Unique creative portfolio-style layout)
export const DesignerTemplate: React.FC<TemplateProps> = ({ cv }) => {
  const accentColor = getAccentColor(cv, '#d946ef');
  const bgTint = cv.is_grayscale ? 'from-gray-50 to-gray-100' : 'from-violet-50 to-fuchsia-50';
  const iconBg = cv.is_grayscale ? 'bg-gray-100' : 'bg-fuchsia-100';
  
  return (
  <div className={`bg-gradient-to-br ${bgTint} shadow-lg max-w-[8.5in] mx-auto font-sans min-h-[11in] ${cv.is_grayscale ? 'grayscale' : ''}`}>
    <header className="p-10 border-b-4" style={{ borderBottomColor: accentColor }}>
      <div className="flex items-center gap-8">
        {cv.personal_info.photo_url ? (
          <TemplatePhoto photoUrl={cv.personal_info.photo_url} size="lg" shape="rounded" borderColor={accentColor} />
        ) : (
          <div className="w-24 h-24 rounded-3xl flex items-center justify-center shadow-lg" style={{ background: `linear-gradient(135deg, ${accentColor}, ${accentColor}dd)` }}>
            <span className="text-4xl text-white font-bold">{cv.personal_info.full_name.charAt(0)}</span>
          </div>
        )}
        <div>
          <h1 className="text-4xl font-bold text-gray-900">{cv.personal_info.full_name}</h1>
          <p className="text-xl font-medium mt-1" style={{ color: accentColor }}>{cv.target_role}</p>
          <div className="flex flex-wrap gap-4 text-sm text-gray-500 mt-2">
            <span>📧 {cv.personal_info.email}</span>
            <span>📱 {cv.personal_info.phone}</span>
            {cv.personal_info.portfolio_url && <span>🎨 Portfolio</span>}
          </div>
        </div>
      </div>
    </header>
    
    <div className="p-10">
      {cv.personal_info.summary && (
        <section className="mb-8 bg-white p-6 rounded-2xl shadow-sm border-l-4" style={{ borderLeftColor: accentColor }}>
          <p className="text-gray-700 italic leading-relaxed">{cv.personal_info.summary}</p>
        </section>
      )}
      
      <section className="mb-8">
        <h3 className="text-lg font-bold mb-4 flex items-center gap-2" style={{ color: accentColor }}>
          <span className={`w-10 h-10 ${iconBg} rounded-full flex items-center justify-center`}>🎯</span>
          Core Skills
        </h3>
        <div className="flex flex-wrap gap-3">
          {cv.skills.map((skill, idx) => (
            <span key={idx} className="px-4 py-2 bg-white text-gray-700 rounded-full shadow-sm border text-sm font-medium" style={{ borderColor: accentColor }}>
              {skill.name}
            </span>
          ))}
        </div>
      </section>
      
      <section className="mb-8">
        <h3 className="text-lg font-bold mb-4 flex items-center gap-2" style={{ color: accentColor }}>
          <span className={`w-10 h-10 ${iconBg} rounded-full flex items-center justify-center`}>💼</span>
          Experience
        </h3>
        <div className="space-y-6">
          {cv.experience.map((exp, idx) => (
            <div key={idx} className="bg-white p-6 rounded-2xl shadow-sm">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="text-lg font-bold text-gray-800">{exp.title}</h4>
                  <p style={{ color: accentColor }}>{exp.company}</p>
                </div>
                <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                  {formatDateRange(exp.start_date, exp.end_date, exp.current)}
                </span>
              </div>
              <p className="text-gray-600 mt-3 leading-relaxed">{exp.description}</p>
            </div>
          ))}
        </div>
      </section>
      
      {cv.projects && cv.projects.length > 0 && (
        <section className="mb-8">
          <h3 className="text-lg font-bold mb-4 flex items-center gap-2" style={{ color: accentColor }}>
            <span className={`w-10 h-10 ${iconBg} rounded-full flex items-center justify-center`}>🚀</span>
            Featured Projects
          </h3>
          <div className="grid grid-cols-2 gap-4">
            {cv.projects.map((proj, idx) => (
              <div key={idx} className="bg-white p-5 rounded-2xl shadow-sm border" style={{ borderColor: accentColor }}>
                <h5 className="font-bold text-gray-800 mb-2">{proj.name}</h5>
                <p className="text-gray-600 text-sm">{proj.description}</p>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  </div>
  );
};

// VIDEO EDITOR (Dark theme variant of Banner Header)
export const VideoEditorTemplate: React.FC<TemplateProps> = ({ cv }) => {
  const accentColor = getAccentColor(cv, '#ef4444');
  
  return (
  <div className={`bg-slate-900 text-slate-300 shadow-lg max-w-[8.5in] mx-auto font-sans min-h-[11in] ${cv.is_grayscale ? 'grayscale' : ''}`}>
    <header className="bg-black p-10 text-center border-b border-slate-800">
      <TemplatePhoto photoUrl={cv.personal_info.photo_url} size="lg" shape="rounded" borderColor={accentColor} className="mx-auto mb-4" />
      <h1 className="text-4xl font-bold text-white mb-2 tracking-widest">{cv.personal_info.full_name.toUpperCase()}</h1>
      <p className="text-lg font-bold uppercase tracking-widest" style={{ color: accentColor }}>{cv.target_role}</p>
    </header>

    <div className="p-10 grid grid-cols-12 gap-8">
      <div className="col-span-4 border-r border-slate-800 pr-6">
        <section className="mb-8">
          <h3 className="text-white font-bold uppercase mb-4 text-sm tracking-wider">Contact</h3>
          <div className="space-y-2 text-sm">
            <p>{cv.personal_info.email}</p>
            <p>{cv.personal_info.phone}</p>
            <p>{cv.personal_info.city}</p>
            {cv.personal_info.portfolio_url && <a href={cv.personal_info.portfolio_url} style={{ color: accentColor }}>Portfolio</a>}
          </div>
        </section>

        <section>
          <h3 className="text-white font-bold uppercase mb-4 text-sm tracking-wider">Skills</h3>
          <ul className="space-y-2 text-sm">
            {cv.skills.map((skill, idx) => (
              <li key={idx} className="flex justify-between">
                <span>{skill.name}</span>
                <span className="text-slate-600">•••••</span>
              </li>
            ))}
          </ul>
        </section>
      </div>

      <div className="col-span-8">
        <section className="mb-10">
          <h3 className="text-white font-bold uppercase mb-6 text-xl tracking-wider border-b border-slate-800 pb-2">Experience</h3>
          <div className="space-y-8">
            {cv.experience.map((exp, idx) => (
              <div key={idx}>
                <h4 className="text-lg font-bold text-white">{exp.title}</h4>
                <p className="text-sm mb-2" style={{ color: accentColor }}>{exp.company} | {formatDateRange(exp.start_date, exp.end_date, exp.current)}</p>
                <p className="text-slate-400 text-sm leading-relaxed">{exp.description}</p>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h3 className="text-white font-bold uppercase mb-6 text-xl tracking-wider border-b border-slate-800 pb-2">Projects</h3>
          <div className="grid grid-cols-2 gap-4">
            {cv.projects?.map((proj, idx) => (
              <div key={idx} className="bg-slate-800 p-4 rounded">
                <h5 className="font-bold text-white text-sm">{proj.name}</h5>
                <p className="text-xs text-slate-400 mt-1">{proj.description}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  </div>
  );
};

// ADMIN ASSISTANT (Unique clean organized layout)
export const AdminAssistantTemplate: React.FC<TemplateProps> = ({ cv }) => {
  const accentColor = getAccentColor(cv, '#475569');
  const bgTint = cv.is_grayscale ? 'bg-gray-50' : 'bg-slate-50';
  
  return (
  <div className={`bg-white shadow-lg max-w-[8.5in] mx-auto font-sans min-h-[11in] ${cv.is_grayscale ? 'grayscale' : ''}`}>
    <header className="text-white p-8" style={{ backgroundColor: accentColor }}>
      <div className="flex items-center gap-4">
        <TemplatePhoto photoUrl={cv.personal_info.photo_url} size="lg" shape="circle" borderColor="#ffffff" />
        <div>
          <h1 className="text-3xl font-bold">{cv.personal_info.full_name}</h1>
          <p className="text-slate-300 text-lg mt-1">{cv.target_role}</p>
        </div>
      </div>
      <div className="flex flex-wrap gap-6 mt-4 text-sm text-slate-300">
        <span>📧 {cv.personal_info.email}</span>
        <span>📱 {cv.personal_info.phone}</span>
        <span>📍 {cv.personal_info.city}</span>
      </div>
    </header>
    
    <div className="p-8">
      {cv.personal_info.summary && (
        <section className={`mb-8 ${bgTint} p-5 rounded-lg border-l-4`} style={{ borderLeftColor: accentColor }}>
          <h3 className="text-sm font-bold uppercase mb-2" style={{ color: accentColor }}>Professional Summary</h3>
          <p className="text-gray-700 leading-relaxed">{cv.personal_info.summary}</p>
        </section>
      )}
      
      <div className="grid grid-cols-3 gap-8">
        <div className="col-span-2">
          <section className="mb-8">
            <h3 className="text-lg font-bold border-b-2 pb-2 mb-4" style={{ color: accentColor, borderBottomColor: accentColor }}>Professional Experience</h3>
            <div className="space-y-6">
              {cv.experience.map((exp, idx) => (
                <div key={idx} className="border-l-2 pl-4" style={{ borderLeftColor: accentColor }}>
                  <div className="flex justify-between items-baseline">
                    <h4 className="font-bold text-gray-800">{exp.title}</h4>
                    <span className="text-sm text-slate-500">{formatDateRange(exp.start_date, exp.end_date, exp.current)}</span>
                  </div>
                  <p className="font-medium" style={{ color: accentColor }}>{exp.company}</p>
                  <p className="text-gray-600 text-sm mt-2">{exp.description}</p>
                </div>
              ))}
            </div>
          </section>
          
          <section>
            <h3 className="text-lg font-bold border-b-2 pb-2 mb-4" style={{ color: accentColor, borderBottomColor: accentColor }}>Education</h3>
            {cv.education.map((edu, idx) => (
              <div key={idx} className="mb-4">
                <h4 className="font-bold text-gray-800">{edu.degree}</h4>
                <p className="text-slate-600">{edu.institution}</p>
                <p className="text-sm text-gray-500">{edu.end_date}</p>
              </div>
            ))}
          </section>
        </div>
        
        <div>
          <section className="mb-8">
            <h3 className="text-lg font-bold border-b-2 pb-2 mb-4" style={{ color: accentColor, borderBottomColor: accentColor }}>Core Skills</h3>
            <div className="space-y-2">
              {cv.skills.map((skill, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: accentColor }}></span>
                  <span className="text-gray-700 text-sm">{skill.name}</span>
                </div>
              ))}
            </div>
          </section>
          
          <section>
            <h3 className="text-lg font-bold border-b-2 pb-2 mb-4" style={{ color: accentColor, borderBottomColor: accentColor }}>Office Tools</h3>
            <div className="flex flex-wrap gap-2">
              {['MS Office', 'Google Suite', 'Slack', 'Zoom'].map((tool, idx) => (
                <span key={idx} className="px-3 py-1 bg-slate-100 text-slate-700 rounded text-xs">{tool}</span>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  </div>
  );
};

// LEGAL ASSISTANT (Unique formal serif layout)
export const LegalAssistantTemplate: React.FC<TemplateProps> = ({ cv }) => {
  const accentColor = getAccentColor(cv, '#d97706');
  
  return (
  <div className={`bg-gray-50 shadow-lg max-w-[8.5in] mx-auto font-serif min-h-[11in] ${cv.is_grayscale ? 'grayscale' : ''}`}>
    <header className="bg-gray-800 text-white p-8 border-b-4" style={{ borderBottomColor: accentColor }}>
      <div className="flex items-center gap-4">
        <TemplatePhoto photoUrl={cv.personal_info.photo_url} size="md" shape="rounded" borderColor={accentColor} />
        <div>
          <h1 className="text-3xl font-bold">{cv.personal_info.full_name}</h1>
          <p className="text-gray-300 text-lg mt-1">{cv.target_role}</p>
        </div>
      </div>
      <div className="flex flex-wrap gap-6 mt-4 text-sm text-gray-400 font-sans">
        <span>📧 {cv.personal_info.email}</span>
        <span>📱 {cv.personal_info.phone}</span>
        <span>📍 {cv.personal_info.city}</span>
      </div>
    </header>
    
    <div className="p-8">
      {cv.personal_info.summary && (
        <section className="mb-8 border-l-4 pl-4" style={{ borderLeftColor: accentColor }}>
          <p className="text-gray-700 italic leading-relaxed">{cv.personal_info.summary}</p>
        </section>
      )}
      
      <div className="grid grid-cols-12 gap-8">
        <div className="col-span-8">
          <section className="mb-8">
            <h3 className="text-lg font-bold text-gray-800 border-b-2 border-gray-300 pb-2 mb-4 uppercase tracking-wider">Legal Experience</h3>
            <div className="space-y-6">
              {cv.experience.map((exp, idx) => (
                <div key={idx} className="bg-white p-5 shadow-sm">
                  <div className="flex justify-between items-baseline">
                    <h4 className="font-bold text-gray-800 text-lg">{exp.title}</h4>
                    <span className="text-sm text-gray-500 font-sans">{formatDateRange(exp.start_date, exp.end_date, exp.current)}</span>
                  </div>
                  <p className="font-medium" style={{ color: accentColor }}>{exp.company}</p>
                  <p className="text-gray-600 mt-3 leading-relaxed">{exp.description}</p>
                </div>
              ))}
            </div>
          </section>
        </div>
        
        <div className="col-span-4">
          <section className="mb-8 bg-white p-5 shadow-sm">
            <h3 className="text-lg font-bold text-gray-800 border-b-2 border-gray-300 pb-2 mb-4 uppercase tracking-wider">Practice Areas</h3>
            <ul className="space-y-2 font-sans">
              {cv.skills.map((skill, idx) => (
                <li key={idx} className="flex items-center gap-2 text-gray-700">
                  <span style={{ color: accentColor }}>⚖️</span> {skill.name}
                </li>
              ))}
            </ul>
          </section>
          
          <section className="bg-white p-5 shadow-sm">
            <h3 className="text-lg font-bold text-gray-800 border-b-2 border-gray-300 pb-2 mb-4 uppercase tracking-wider">Education</h3>
            {cv.education.map((edu, idx) => (
              <div key={idx} className="mb-4">
                <h4 className="font-bold text-gray-800">{edu.degree}</h4>
                <p className="text-gray-600">{edu.institution}</p>
                <p className="text-sm text-gray-500 font-sans">{edu.end_date}</p>
              </div>
            ))}
          </section>
        </div>
      </div>
    </div>
  </div>
  );
};

// CLINICAL RESEARCH (Unique academic research layout)
export const ClinicalResearchTemplate: React.FC<TemplateProps> = ({ cv }) => {
  const accentColor = getAccentColor(cv, '#0d9488');
  
  return (
  <div className={`bg-white shadow-lg max-w-[8.5in] mx-auto font-serif min-h-[11in] ${cv.is_grayscale ? 'grayscale' : ''}`}>
    <header className="text-center border-b-2 p-8" style={{ borderBottomColor: accentColor }}>
      <div className="flex justify-center mb-4">
        <TemplatePhoto photoUrl={cv.personal_info.photo_url} size="lg" shape="circle" borderColor={accentColor} />
      </div>
      <h1 className="text-3xl font-bold text-gray-900">{cv.personal_info.full_name}</h1>
      <p className="text-lg mt-1" style={{ color: accentColor }}>{cv.target_role}</p>
      <div className="flex justify-center flex-wrap gap-6 mt-4 text-sm text-gray-500 font-sans">
        <span>📧 {cv.personal_info.email}</span>
        <span>📱 {cv.personal_info.phone}</span>
        <span>🔬 Research Focus</span>
      </div>
    </header>
    
    <div className="p-8">
      {cv.personal_info.summary && (
        <section className="mb-8 p-5 rounded border-l-4" style={{ borderLeftColor: accentColor, backgroundColor: `${accentColor}10` }}>
          <h3 className="text-sm font-bold uppercase mb-2 font-sans" style={{ color: accentColor }}>Research Overview</h3>
          <p className="text-gray-700 leading-relaxed">{cv.personal_info.summary}</p>
        </section>
      )}
      
      <section className="mb-8">
        <h3 className="text-lg font-bold border-b pb-2 mb-4 uppercase tracking-wider font-sans" style={{ color: accentColor, borderBottomColor: `${accentColor}40` }}>Research Experience</h3>
        <div className="space-y-6">
          {cv.experience.map((exp, idx) => (
            <div key={idx} className="border-l-2 pl-4" style={{ borderLeftColor: `${accentColor}60` }}>
              <div className="flex justify-between items-baseline">
                <h4 className="font-bold text-gray-800 text-lg">{exp.title}</h4>
                <span className="text-sm text-gray-500 font-sans">{formatDateRange(exp.start_date, exp.end_date, exp.current)}</span>
              </div>
              <p className="font-medium" style={{ color: accentColor }}>{exp.company}</p>
              <p className="text-gray-600 mt-2 leading-relaxed">{exp.description}</p>
            </div>
          ))}
        </div>
      </section>
      
      <div className="grid grid-cols-2 gap-8">
        <section>
          <h3 className="text-lg font-bold border-b pb-2 mb-4 uppercase tracking-wider font-sans" style={{ color: accentColor, borderBottomColor: `${accentColor}40` }}>Therapeutic Areas</h3>
          <div className="flex flex-wrap gap-2 font-sans">
            {cv.skills.map((skill, idx) => (
              <span key={idx} className="px-3 py-1 rounded text-sm" style={{ backgroundColor: `${accentColor}20`, color: accentColor }}>{skill.name}</span>
            ))}
          </div>
        </section>
        
        <section>
          <h3 className="text-lg font-bold border-b pb-2 mb-4 uppercase tracking-wider font-sans" style={{ color: accentColor, borderBottomColor: `${accentColor}40` }}>Education</h3>
          {cv.education.map((edu, idx) => (
            <div key={idx} className="mb-3">
              <h4 className="font-bold text-gray-800">{edu.degree}</h4>
              <p className="text-gray-600">{edu.institution}</p>
            </div>
          ))}
        </section>
      </div>
    </div>
  </div>
  );
};

// BUSINESS DEVELOPMENT (Unique sales-focused layout)
export const BusinessDevelopmentTemplate: React.FC<TemplateProps> = ({ cv }) => {
  const accentColor = getAccentColor(cv, '#0369a1');
  
  return (
  <div className={`bg-white shadow-lg max-w-[8.5in] mx-auto font-sans min-h-[11in] border-t-4 ${cv.is_grayscale ? 'grayscale' : ''}`} style={{ borderTopColor: accentColor }}>
    <header className="p-8">
      <div className="flex items-center gap-4">
        <TemplatePhoto photoUrl={cv.personal_info.photo_url} size="md" shape="circle" borderColor={accentColor} />
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{cv.personal_info.full_name}</h1>
          <p className="text-xl font-medium mt-1" style={{ color: accentColor }}>{cv.target_role}</p>
        </div>
      </div>
      <div className="flex flex-wrap gap-6 mt-4 text-sm text-gray-500">
        <span>📧 {cv.personal_info.email}</span>
        <span>📱 {cv.personal_info.phone}</span>
        <span>🌐 {cv.personal_info.city}</span>
      </div>
    </header>
    
    <div className="px-8 pb-8">
      <div className="p-6 rounded-lg mb-8" style={{ backgroundColor: `${accentColor}10` }}>
        <h3 className="text-sm font-bold uppercase mb-2" style={{ color: accentColor }}>Key Achievements</h3>
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold" style={{ color: accentColor }}>$25M</div>
            <div className="text-xs text-gray-500">Pipeline Generated</div>
          </div>
          <div>
            <div className="text-2xl font-bold" style={{ color: accentColor }}>40+</div>
            <div className="text-xs text-gray-500">Partnerships</div>
          </div>
          <div>
            <div className="text-2xl font-bold" style={{ color: accentColor }}>150%</div>
            <div className="text-xs text-gray-500">Target Achievement</div>
          </div>
        </div>
      </div>
      
      {cv.personal_info.summary && (
        <section className="mb-8">
          <p className="text-gray-700 leading-relaxed italic border-l-4 pl-4" style={{ borderLeftColor: `${accentColor}80` }}>{cv.personal_info.summary}</p>
        </section>
      )}
      
      <section className="mb-8">
        <h3 className="text-lg font-bold mb-4 border-b pb-2" style={{ color: accentColor, borderBottomColor: `${accentColor}40` }}>Professional Experience</h3>
        <div className="space-y-6">
          {cv.experience.map((exp, idx) => (
            <div key={idx} className="bg-gray-50 p-5 rounded-lg">
              <div className="flex justify-between items-baseline">
                <h4 className="font-bold text-gray-800 text-lg">{exp.title}</h4>
                <span className="text-sm" style={{ color: accentColor }}>{formatDateRange(exp.start_date, exp.end_date, exp.current)}</span>
              </div>
              <p className="font-medium" style={{ color: accentColor }}>{exp.company}</p>
              <p className="text-gray-600 mt-2">{exp.description}</p>
            </div>
          ))}
        </div>
      </section>
      
      <div className="grid grid-cols-2 gap-8">
        <section>
          <h3 className="text-lg font-bold mb-4 border-b pb-2" style={{ color: accentColor, borderBottomColor: `${accentColor}40` }}>Core Competencies</h3>
          <div className="flex flex-wrap gap-2">
            {cv.skills.map((skill, idx) => (
              <span key={idx} className="px-3 py-1 rounded-full text-sm" style={{ backgroundColor: `${accentColor}20`, color: accentColor }}>{skill.name}</span>
            ))}
          </div>
        </section>
        
        <section>
          <h3 className="text-lg font-bold mb-4 border-b pb-2" style={{ color: accentColor, borderBottomColor: `${accentColor}40` }}>Education</h3>
          {cv.education.map((edu, idx) => (
            <div key={idx} className="mb-3">
              <h4 className="font-bold text-gray-800">{edu.degree}</h4>
              <p className="text-gray-600">{edu.institution}</p>
            </div>
          ))}
        </section>
      </div>
    </div>
  </div>
  );
};

// CONSULTANT (Unique high-end professional layout)
export const ConsultantTemplate: React.FC<TemplateProps> = ({ cv }) => {
  const accentColor = getAccentColor(cv, '#1e3a5f');
  
  return (
  <div className={`bg-stone-900 text-stone-300 shadow-lg max-w-[8.5in] mx-auto font-sans min-h-[11in] ${cv.is_grayscale ? 'grayscale' : ''}`}>
    <header className="p-10 border-b" style={{ borderBottomColor: `${accentColor}50` }}>
      <div className="flex items-center gap-5">
        <TemplatePhoto photoUrl={cv.personal_info.photo_url} size="lg" shape="rounded" borderColor={accentColor} />
        <div>
          <h1 className="text-4xl font-bold text-white tracking-wide">{cv.personal_info.full_name}</h1>
          <p className="text-xl font-medium mt-2" style={{ color: accentColor }}>{cv.target_role}</p>
        </div>
      </div>
      <div className="flex flex-wrap gap-6 mt-4 text-sm text-stone-400">
        <span>📧 {cv.personal_info.email}</span>
        <span>📱 {cv.personal_info.phone}</span>
        <span>📍 {cv.personal_info.city}</span>
      </div>
    </header>
    
    <div className="p-10">
      {cv.personal_info.summary && (
        <section className="mb-10 text-center">
          <p className="text-stone-300 italic text-lg leading-relaxed max-w-3xl mx-auto">{cv.personal_info.summary}</p>
        </section>
      )}
      
      <section className="mb-10">
        <h3 className="text-white font-bold uppercase tracking-widest mb-6 text-sm flex items-center">
          <span className="flex-1 h-px" style={{ backgroundColor: `${accentColor}50` }}></span>
          <span className="px-4">Experience</span>
          <span className="flex-1 h-px" style={{ backgroundColor: `${accentColor}50` }}></span>
        </h3>
        <div className="space-y-8">
          {cv.experience.map((exp, idx) => (
            <div key={idx} className="border-l-2 pl-6" style={{ borderLeftColor: accentColor }}>
              <div className="flex justify-between items-baseline">
                <h4 className="text-xl font-bold text-white">{exp.title}</h4>
                <span className="text-sm" style={{ color: accentColor }}>{formatDateRange(exp.start_date, exp.end_date, exp.current)}</span>
              </div>
              <p className="font-medium" style={{ color: `${accentColor}cc` }}>{exp.company}</p>
              <p className="text-stone-400 mt-2 leading-relaxed">{exp.description}</p>
            </div>
          ))}
        </div>
      </section>
      
      <div className="grid grid-cols-2 gap-10">
        <section>
          <h3 className="text-white font-bold uppercase tracking-widest mb-4 text-sm">Expertise</h3>
          <div className="flex flex-wrap gap-2">
            {cv.skills.map((skill, idx) => (
              <span key={idx} className="px-3 py-1 bg-stone-800 rounded text-sm border" style={{ color: accentColor, borderColor: `${accentColor}50` }}>{skill.name}</span>
            ))}
          </div>
        </section>
        
        <section>
          <h3 className="text-white font-bold uppercase tracking-widest mb-4 text-sm">Education</h3>
          {cv.education.map((edu, idx) => (
            <div key={idx} className="mb-3">
              <h4 className="font-bold text-white">{edu.degree}</h4>
              <p className="text-stone-400">{edu.institution}</p>
            </div>
          ))}
        </section>
      </div>
    </div>
  </div>
  );
};

// PROGRAM MANAGER (Structured, Timeline-focused)
export const ProgramManagerTemplate: React.FC<TemplateProps> = ({ cv }) => {
  const accentColor = getAccentColor(cv, '#4f46e5');
  
  return (
  <div className={`bg-white shadow-lg max-w-[8.5in] mx-auto font-sans p-8 border-t-8 ${cv.is_grayscale ? 'grayscale' : ''}`} style={{ borderTopColor: accentColor }}>
    <header className="flex justify-between items-end border-b-2 pb-6 mb-8" style={{ borderBottomColor: `${accentColor}20` }}>
      <div className="flex items-center gap-4">
        <TemplatePhoto photoUrl={cv.personal_info.photo_url} size="lg" shape="circle" borderColor={accentColor} />
        <div>
          <h1 className="text-4xl font-bold" style={{ color: accentColor }}>{cv.personal_info.full_name}</h1>
          <p className="text-xl mt-1" style={{ color: accentColor }}>{cv.target_role}</p>
        </div>
      </div>
      <div className="text-right text-sm text-gray-600">
        <p>{cv.personal_info.email}</p>
        <p>{cv.personal_info.phone}</p>
      </div>
    </header>

    <div className="grid grid-cols-1 gap-8">
      <section>
        <h3 className="font-bold uppercase tracking-wider mb-6 flex items-center" style={{ color: accentColor }}>
          <span className="w-8 h-1 mr-3" style={{ backgroundColor: `${accentColor}40` }}></span> Professional Experience
        </h3>
        <div className="space-y-8 border-l-2 ml-4 pl-6" style={{ borderLeftColor: `${accentColor}20` }}>
          {cv.experience.map((exp, idx) => (
            <div key={idx} className="relative">
              <div className="absolute -left-[33px] top-1 w-4 h-4 rounded-full border-4 border-white" style={{ backgroundColor: accentColor }}></div>
              <div className="flex justify-between items-baseline mb-2">
                <h4 className="text-xl font-bold text-gray-800">{exp.title}</h4>
                <span className="text-sm font-bold" style={{ color: accentColor }}>{formatDateRange(exp.start_date, exp.end_date, exp.current)}</span>
              </div>
              <p className="text-gray-600 font-medium mb-3">{exp.company}</p>
              <p className="text-gray-700 leading-relaxed">{exp.description}</p>
            </div>
          ))}
        </div>
      </section>

      <div className="grid grid-cols-2 gap-8">
        <section>
          <h3 className="font-bold uppercase tracking-wider mb-4 flex items-center" style={{ color: accentColor }}>
            <span className="w-8 h-1 mr-3" style={{ backgroundColor: `${accentColor}40` }}></span> Key Competencies
          </h3>
          <div className="flex flex-wrap gap-2">
            {cv.skills.map((skill, idx) => (
              <span key={idx} className="px-3 py-1 rounded-full text-sm font-medium" style={{ backgroundColor: `${accentColor}10`, color: accentColor }}>
                {skill.name}
              </span>
            ))}
          </div>
        </section>

        <section>
          <h3 className="font-bold uppercase tracking-wider mb-4 flex items-center" style={{ color: accentColor }}>
            <span className="w-8 h-1 mr-3" style={{ backgroundColor: `${accentColor}40` }}></span> Education
          </h3>
          {cv.education.map((edu, idx) => (
            <div key={idx} className="mb-3">
              <p className="font-bold text-gray-800">{edu.degree}</p>
              <p className="text-sm text-gray-600">{edu.institution}</p>
            </div>
          ))}
        </section>
      </div>
    </div>
  </div>
  );
};

// OPERATIONS MANAGER (Unique process-oriented layout)
export const OperationsManagerTemplate: React.FC<TemplateProps> = ({ cv }) => {
  const accentColor = getAccentColor(cv, '#059669');
  
  return (
  <div className={`bg-white shadow-lg max-w-[8.5in] mx-auto font-sans min-h-[11in] ${cv.is_grayscale ? 'grayscale' : ''}`}>
    <header className="text-white p-8" style={{ backgroundColor: accentColor }}>
      <div className="flex items-center gap-4">
        <TemplatePhoto photoUrl={cv.personal_info.photo_url} size="md" shape="circle" borderColor="#ffffff" />
        <div>
          <h1 className="text-3xl font-bold">{cv.personal_info.full_name}</h1>
          <p className="text-lg mt-1" style={{ color: `${accentColor}40` }}>{cv.target_role}</p>
        </div>
      </div>
      <div className="flex flex-wrap gap-6 mt-4 text-sm" style={{ color: `${accentColor}40` }}>
        <span>📧 {cv.personal_info.email}</span>
        <span>📱 {cv.personal_info.phone}</span>
        <span>📍 {cv.personal_info.city}</span>
      </div>
    </header>
    
    <div className="p-8">
      <div className="grid grid-cols-4 gap-4 mb-8 text-center">
        <div className="p-4 rounded-lg" style={{ backgroundColor: `${accentColor}10` }}>
          <div className="text-2xl font-bold" style={{ color: accentColor }}>30%</div>
          <div className="text-xs text-gray-500">Cost Reduction</div>
        </div>
        <div className="p-4 rounded-lg" style={{ backgroundColor: `${accentColor}10` }}>
          <div className="text-2xl font-bold" style={{ color: accentColor }}>$50M</div>
          <div className="text-xs text-gray-500">P&L Managed</div>
        </div>
        <div className="p-4 rounded-lg" style={{ backgroundColor: `${accentColor}10` }}>
          <div className="text-2xl font-bold" style={{ color: accentColor }}>200+</div>
          <div className="text-xs text-gray-500">Team Size</div>
        </div>
        <div className="p-4 rounded-lg" style={{ backgroundColor: `${accentColor}10` }}>
          <div className="text-2xl font-bold" style={{ color: accentColor }}>5</div>
          <div className="text-xs text-gray-500">Sites</div>
        </div>
      </div>
      
      {cv.personal_info.summary && (
        <section className="mb-8 border-l-4 pl-4 bg-gray-50 p-4" style={{ borderLeftColor: accentColor }}>
          <p className="text-gray-700 leading-relaxed">{cv.personal_info.summary}</p>
        </section>
      )}
      
      <section className="mb-8">
        <h3 className="text-lg font-bold mb-4 border-b-2 pb-2" style={{ color: accentColor, borderBottomColor: `${accentColor}40` }}>Professional Experience</h3>
        <div className="space-y-6">
          {cv.experience.map((exp, idx) => (
            <div key={idx} className="border-l-2 pl-4" style={{ borderLeftColor: `${accentColor}60` }}>
              <div className="flex justify-between items-baseline">
                <h4 className="font-bold text-gray-800 text-lg">{exp.title}</h4>
                <span className="text-sm" style={{ color: accentColor }}>{formatDateRange(exp.start_date, exp.end_date, exp.current)}</span>
              </div>
              <p className="font-medium" style={{ color: accentColor }}>{exp.company}</p>
              <p className="text-gray-600 mt-2">{exp.description}</p>
            </div>
          ))}
        </div>
      </section>
      
      <div className="grid grid-cols-2 gap-8">
        <section>
          <h3 className="text-lg font-bold mb-4 border-b-2 pb-2" style={{ color: accentColor, borderBottomColor: `${accentColor}40` }}>Expertise</h3>
          <div className="flex flex-wrap gap-2">
            {cv.skills.map((skill, idx) => (
              <span key={idx} className="px-3 py-1 rounded text-sm" style={{ backgroundColor: `${accentColor}20`, color: accentColor }}>{skill.name}</span>
            ))}
          </div>
        </section>
        
        <section>
          <h3 className="text-lg font-bold mb-4 border-b-2 pb-2" style={{ color: accentColor, borderBottomColor: `${accentColor}40` }}>Education</h3>
          {cv.education.map((edu, idx) => (
            <div key={idx} className="mb-3">
              <h4 className="font-bold text-gray-800">{edu.degree}</h4>
              <p className="text-gray-600">{edu.institution}</p>
            </div>
          ))}
        </section>
      </div>
    </div>
  </div>
  );
};

// SEO SPECIALIST (Unique data-driven layout)
export const SEOSpecialistTemplate: React.FC<TemplateProps> = ({ cv }) => {
  const accentColor = getAccentColor(cv, '#f59e0b');
  
  return (
  <div className={`bg-white shadow-lg max-w-[8.5in] mx-auto font-sans min-h-[11in] ${cv.is_grayscale ? 'grayscale' : ''}`}>
    <header className="border-b-4 p-8" style={{ borderBottomColor: accentColor }}>
      <div className="flex items-center gap-4">
        <TemplatePhoto photoUrl={cv.personal_info.photo_url} size="md" shape="circle" borderColor={accentColor} />
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{cv.personal_info.full_name}</h1>
          <p className="text-lg font-medium mt-1" style={{ color: accentColor }}>{cv.target_role}</p>
        </div>
      </div>
      <div className="flex flex-wrap gap-6 mt-4 text-sm text-gray-500">
        <span>📧 {cv.personal_info.email}</span>
        <span>📱 {cv.personal_info.phone}</span>
        <span>🔍 Google Certified</span>
      </div>
    </header>
    
    <div className="p-8">
      <div className="p-6 rounded-lg mb-8" style={{ backgroundColor: `${accentColor}15` }}>
        <h3 className="text-sm font-bold uppercase mb-4" style={{ color: accentColor }}>SEO Performance Highlights</h3>
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-xl font-bold" style={{ color: accentColor }}>+340%</div>
            <div className="text-xs text-gray-500">Organic Traffic</div>
          </div>
          <div className="text-center">
            <div className="text-xl font-bold" style={{ color: accentColor }}>+150</div>
            <div className="text-xs text-gray-500">Page 1 Keywords</div>
          </div>
          <div className="text-center">
            <div className="text-xl font-bold" style={{ color: accentColor }}>45→72</div>
            <div className="text-xs text-gray-500">Domain Authority</div>
          </div>
        </div>
      </div>
      
      {cv.personal_info.summary && (
        <section className="mb-8 border-l-4 pl-4" style={{ borderLeftColor: `${accentColor}80` }}>
          <p className="text-gray-700 leading-relaxed">{cv.personal_info.summary}</p>
        </section>
      )}
      
      <section className="mb-8">
        <h3 className="text-lg font-bold mb-4 border-b pb-2" style={{ color: accentColor, borderBottomColor: `${accentColor}40` }}>Professional Experience</h3>
        <div className="space-y-6">
          {cv.experience.map((exp, idx) => (
            <div key={idx}>
              <div className="flex justify-between items-baseline">
                <h4 className="font-bold text-gray-800 text-lg">{exp.title}</h4>
                <span className="text-sm" style={{ color: accentColor }}>{formatDateRange(exp.start_date, exp.end_date, exp.current)}</span>
              </div>
              <p className="font-medium" style={{ color: accentColor }}>{exp.company}</p>
              <p className="text-gray-600 mt-2">{exp.description}</p>
            </div>
          ))}
        </div>
      </section>
      
      <div className="grid grid-cols-2 gap-8">
        <section>
          <h3 className="text-lg font-bold mb-4 border-b pb-2" style={{ color: accentColor, borderBottomColor: `${accentColor}40` }}>SEO Tools</h3>
          <div className="flex flex-wrap gap-2">
            {cv.skills.map((skill, idx) => (
              <span key={idx} className="px-3 py-1 rounded text-sm" style={{ backgroundColor: `${accentColor}20`, color: accentColor }}>{skill.name}</span>
            ))}
          </div>
        </section>
        
        <section>
          <h3 className="text-lg font-bold mb-4 border-b pb-2" style={{ color: accentColor, borderBottomColor: `${accentColor}40` }}>Education</h3>
          {cv.education.map((edu, idx) => (
            <div key={idx} className="mb-3">
              <h4 className="font-bold text-gray-800">{edu.degree}</h4>
              <p className="text-gray-600">{edu.institution}</p>
            </div>
          ))}
        </section>
      </div>
    </div>
  </div>
  );
};

// TECHNICAL WRITER (Documentation style, very clean typography)
export const TechnicalWriterTemplate: React.FC<TemplateProps> = ({ cv }) => {
  const accentColor = getAccentColor(cv, '#6366f1');
  
  return (
  <div className={`bg-white shadow-lg max-w-[8.5in] mx-auto font-serif text-gray-800 p-12 ${cv.is_grayscale ? 'grayscale' : ''}`}>
    <header className="border-b-4 pb-6 mb-8" style={{ borderBottomColor: accentColor }}>
      <div className="flex items-center gap-4 mb-2">
        <TemplatePhoto photoUrl={cv.personal_info.photo_url} size="md" shape="square" borderColor={accentColor} />
        <h1 className="text-4xl font-bold text-gray-900">{cv.personal_info.full_name}</h1>
      </div>
      <div className="flex justify-between text-sm font-sans text-gray-600 uppercase tracking-wider">
        <span>{cv.target_role}</span>
        <span>{cv.personal_info.city}</span>
      </div>
    </header>

    <div className="grid grid-cols-12 gap-8">
      <div className="col-span-8">
        <section className="mb-8">
          <h3 className="font-sans font-bold text-gray-400 uppercase text-xs tracking-widest mb-4">Professional Experience</h3>
          {cv.experience.map((exp, idx) => (
            <div key={idx} className="mb-6">
              <h4 className="font-bold text-lg">{exp.title}</h4>
              <p className="font-sans text-sm text-gray-500 mb-2">{exp.company} — {formatDateRange(exp.start_date, exp.end_date, exp.current)}</p>
              <p className="leading-relaxed">{exp.description}</p>
            </div>
          ))}
        </section>
      </div>

      <div className="col-span-4 font-sans">
        <section className="mb-8">
          <h3 className="font-bold text-gray-400 uppercase text-xs tracking-widest mb-4">Contact</h3>
          <div className="text-sm space-y-1">
            <p>{cv.personal_info.email}</p>
            <p>{cv.personal_info.phone}</p>
            {cv.personal_info.linkedin_url && <a href={cv.personal_info.linkedin_url} className="underline" style={{ color: accentColor }}>LinkedIn</a>}
          </div>
        </section>

        <section className="mb-8">
          <h3 className="font-bold text-gray-400 uppercase text-xs tracking-widest mb-4">Tools</h3>
          <ul className="text-sm space-y-1">
            {cv.skills.map((skill, idx) => (
              <li key={idx}>• {skill.name}</li>
            ))}
          </ul>
        </section>
        
        <section>
          <h3 className="font-bold text-gray-400 uppercase text-xs tracking-widest mb-4">Education</h3>
          {cv.education.map((edu, idx) => (
            <div key={idx} className="mb-2">
              <p className="font-bold text-sm">{edu.degree}</p>
              <p className="text-xs text-gray-500">{edu.institution}</p>
            </div>
          ))}
        </section>
      </div>
    </div>
  </div>
  );
};

// FRESHER / ENTRY LEVEL (Unique education-focused layout)
export const FresherTemplate: React.FC<TemplateProps> = ({ cv }) => {
  const accentColor = getAccentColor(cv, '#3b82f6');
  
  return (
  <div className={`bg-white shadow-lg max-w-[8.5in] mx-auto font-sans min-h-[11in] ${cv.is_grayscale ? 'grayscale' : ''}`}>
    <header className="text-white p-8" style={{ backgroundColor: accentColor }}>
      <div className="flex items-center gap-4">
        <TemplatePhoto photoUrl={cv.personal_info.photo_url} size="lg" shape="circle" borderColor="#ffffff" />
        <div>
          <h1 className="text-3xl font-bold">{cv.personal_info.full_name}</h1>
          <p className="text-lg mt-1" style={{ color: `${accentColor}40` }}>{cv.target_role}</p>
        </div>
      </div>
      <div className="flex flex-wrap gap-6 mt-4 text-sm" style={{ color: `${accentColor}40` }}>
        <span>📧 {cv.personal_info.email}</span>
        <span>📱 {cv.personal_info.phone}</span>
        <span>📍 {cv.personal_info.city}</span>
      </div>
    </header>
    
    <div className="p-8">
      {cv.personal_info.summary && (
        <section className="mb-8 p-5 rounded-lg border-l-4" style={{ backgroundColor: `${accentColor}10`, borderLeftColor: accentColor }}>
          <h3 className="text-sm font-bold uppercase mb-2" style={{ color: accentColor }}>Objective</h3>
          <p className="text-gray-700 leading-relaxed">{cv.personal_info.summary}</p>
        </section>
      )}
      
      <section className="mb-8">
        <h3 className="text-lg font-bold mb-4 border-b-2 pb-2 flex items-center gap-2" style={{ color: accentColor, borderBottomColor: `${accentColor}40` }}>
          🎓 Education
        </h3>
        <div className="space-y-4">
          {cv.education.map((edu, idx) => (
            <div key={idx} className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-bold text-gray-800 text-lg">{edu.degree}</h4>
              <p className="font-medium" style={{ color: accentColor }}>{edu.institution}</p>
              <p className="text-sm text-gray-500">{edu.end_date}</p>
            </div>
          ))}
        </div>
      </section>
      
      <section className="mb-8">
        <h3 className="text-lg font-bold mb-4 border-b-2 pb-2 flex items-center gap-2" style={{ color: accentColor, borderBottomColor: `${accentColor}40` }}>
          💡 Skills
        </h3>
        <div className="flex flex-wrap gap-3">
          {cv.skills.map((skill, idx) => (
            <span key={idx} className="px-4 py-2 rounded-full text-sm font-medium" style={{ backgroundColor: `${accentColor}20`, color: accentColor }}>{skill.name}</span>
          ))}
        </div>
      </section>
      
      {cv.experience.length > 0 && (
        <section className="mb-8">
          <h3 className="text-lg font-bold mb-4 border-b-2 pb-2 flex items-center gap-2" style={{ color: accentColor, borderBottomColor: `${accentColor}40` }}>
            💼 Experience
          </h3>
          <div className="space-y-4">
            {cv.experience.map((exp, idx) => (
              <div key={idx} className="border-l-2 pl-4" style={{ borderLeftColor: `${accentColor}60` }}>
                <div className="flex justify-between items-baseline">
                  <h4 className="font-bold text-gray-800">{exp.title}</h4>
                  <span className="text-sm" style={{ color: accentColor }}>{formatDateRange(exp.start_date, exp.end_date, exp.current)}</span>
                </div>
                <p style={{ color: accentColor }}>{exp.company}</p>
                <p className="text-gray-600 text-sm mt-1">{exp.description}</p>
              </div>
            ))}
          </div>
        </section>
      )}
      
      {cv.projects && cv.projects.length > 0 && (
        <section>
          <h3 className="text-lg font-bold mb-4 border-b-2 pb-2 flex items-center gap-2" style={{ color: accentColor, borderBottomColor: `${accentColor}40` }}>
            🚀 Projects
          </h3>
          <div className="grid grid-cols-2 gap-4">
            {cv.projects.map((proj, idx) => (
              <div key={idx} className="p-4 rounded-lg" style={{ backgroundColor: `${accentColor}10` }}>
                <h5 className="font-bold text-gray-800">{proj.name}</h5>
                <p className="text-gray-600 text-sm mt-1">{proj.description}</p>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  </div>
  );
};


export const SalesExecutiveTemplate: React.FC<TemplateProps> = ({ cv }) => {
  const accentColor = getAccentColor(cv, '#dc2626');
  
  return (
  <div className={`bg-white shadow-lg p-8 max-w-[8.5in] mx-auto font-sans text-slate-900 ${cv.is_grayscale ? 'grayscale' : ''}`}>
    <header className="bg-slate-900 text-white p-6 -mx-8 -mt-8 mb-8">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <TemplatePhoto photoUrl={cv.personal_info.photo_url} size="md" shape="circle" borderColor={accentColor} />
          <div>
            <h1 className="text-3xl font-bold uppercase tracking-wider">{cv.personal_info.full_name}</h1>
            <p className="font-medium mt-1" style={{ color: accentColor }}>{cv.target_role || 'Sales Executive'}</p>
          </div>
        </div>
        <div className="text-right text-sm text-slate-300">
          <p>{cv.personal_info.email}</p>
          <p>{cv.personal_info.phone}</p>
          <p>{cv.personal_info.city}</p>
        </div>
      </div>
    </header>

    {/* Key Achievements / Metrics Highlight */}
    <div className="grid grid-cols-3 gap-4 mb-8">
      <div className="bg-slate-50 p-4 border-t-4 text-center" style={{ borderTopColor: accentColor }}>
        <span className="block text-2xl font-bold text-slate-900">150%</span>
        <span className="text-xs text-slate-500 uppercase tracking-wide">Quota Attainment</span>
      </div>
      <div className="bg-slate-50 p-4 border-t-4 text-center" style={{ borderTopColor: accentColor }}>
        <span className="block text-2xl font-bold text-slate-900">$2M+</span>
        <span className="text-xs text-slate-500 uppercase tracking-wide">Revenue Generated</span>
      </div>
      <div className="bg-slate-50 p-4 border-t-4 text-center" style={{ borderTopColor: accentColor }}>
        <span className="block text-2xl font-bold text-slate-900">Top 5%</span>
        <span className="text-xs text-slate-500 uppercase tracking-wide">Regional Ranking</span>
      </div>
    </div>

    <div className="flex gap-8">
      <div className="w-2/3">
        {cv.personal_info.summary && (
          <section className="mb-6">
            <h2 className="text-lg font-bold text-slate-900 border-b-2 border-slate-200 mb-3 pb-1">Executive Summary</h2>
            <p className="text-sm text-slate-700 leading-relaxed">{cv.personal_info.summary}</p>
          </section>
        )}

        {cv.experience.length > 0 && (
          <section>
            <h2 className="text-lg font-bold text-slate-900 border-b-2 border-slate-200 mb-4 pb-1">Professional Experience</h2>
            <div className="space-y-6">
              {cv.experience.map((exp, idx) => (
                <div key={idx}>
                  <div className="flex justify-between items-baseline mb-1">
                    <h3 className="font-bold text-lg text-slate-800">{exp.title}</h3>
                    <span className="text-sm text-slate-500 font-medium">{formatDateRange(exp.start_date, exp.end_date, exp.current)}</span>
                  </div>
                  <p className="font-semibold text-sm mb-2" style={{ color: accentColor }}>{exp.company}</p>
                  <ul className="list-disc list-outside ml-4 text-sm text-slate-700 space-y-1">
                    {exp.achievements?.map((ach, i) => <li key={i}>{ach}</li>)}
                  </ul>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>

      <div className="w-1/3 space-y-6">
        {cv.skills.length > 0 && (
          <section>
            <h2 className="text-lg font-bold text-slate-900 border-b-2 border-slate-200 mb-3 pb-1">Core Skills</h2>
            <div className="space-y-2">
              {cv.skills.map((skill, idx) => (
                <div key={idx} className="bg-slate-50 p-2 rounded border-l-4" style={{ borderLeftColor: accentColor }}>
                  <span className="text-sm font-medium text-slate-800">{skill.name}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {cv.education.length > 0 && (
          <section>
            <h2 className="text-lg font-bold text-slate-900 border-b-2 border-slate-200 mb-3 pb-1">Education</h2>
            {cv.education.map((edu, idx) => (
              <div key={idx} className="mb-3">
                <p className="font-bold text-sm">{edu.degree}</p>
                <p className="text-sm text-slate-600">{edu.institution}</p>
                <p className="text-xs text-slate-400">{formatDate(edu.end_date)}</p>
              </div>
            ))}
          </section>
        )}
      </div>
    </div>
  </div>
  );
};

export const HRManagerTemplate: React.FC<TemplateProps> = ({ cv }) => {
  const accentColor = getAccentColor(cv, '#8b5cf6');
  
  return (
  <div className={`bg-white shadow-lg p-8 max-w-[8.5in] mx-auto font-sans text-gray-800 ${cv.is_grayscale ? 'grayscale' : ''}`}>
    <header className="flex items-center gap-6 mb-8 border-b border-gray-200 pb-6">
      {cv.personal_info.photo_url ? (
        <TemplatePhoto photoUrl={cv.personal_info.photo_url} size="lg" shape="circle" borderColor={accentColor} />
      ) : (
        <div className="w-24 h-24 rounded-full flex items-center justify-center text-3xl font-bold" style={{ backgroundColor: `${accentColor}20`, color: accentColor }}>
          {cv.personal_info.full_name.charAt(0)}
        </div>
      )}
      <div className="flex-1">
        <h1 className="text-3xl font-bold text-gray-900">{cv.personal_info.full_name}</h1>
        <p className="font-medium text-lg" style={{ color: accentColor }}>{cv.target_role || 'Human Resources Manager'}</p>
        <div className="flex gap-4 text-sm text-gray-500 mt-2">
          <span>{cv.personal_info.email}</span>
          <span>•</span>
          <span>{cv.personal_info.phone}</span>
          <span>•</span>
          <span>{cv.personal_info.city}</span>
        </div>
      </div>
    </header>

    <div className="grid grid-cols-3 gap-8">
      <div className="col-span-2 space-y-6">
        {cv.personal_info.summary && (
          <section>
            <h2 className="text-sm font-bold uppercase tracking-wider mb-3" style={{ color: accentColor }}>Profile</h2>
            <p className="text-sm text-gray-700 leading-relaxed">{cv.personal_info.summary}</p>
          </section>
        )}

        {cv.experience.length > 0 && (
          <section>
            <h2 className="text-sm font-bold uppercase tracking-wider mb-4" style={{ color: accentColor }}>Experience</h2>
            <div className="space-y-6">
              {cv.experience.map((exp, idx) => (
                <div key={idx} className="relative pl-6 border-l-2" style={{ borderLeftColor: `${accentColor}30` }}>
                  <div className="absolute -left-[5px] top-1.5 w-2.5 h-2.5 rounded-full" style={{ backgroundColor: accentColor }}></div>
                  <h3 className="font-bold text-gray-900">{exp.title}</h3>
                  <p className="text-sm mb-2" style={{ color: accentColor }}>{exp.company} | {formatDateRange(exp.start_date, exp.end_date, exp.current)}</p>
                  <p className="text-sm text-gray-700 mb-2">{exp.description}</p>
                  {exp.achievements && (
                    <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                      {exp.achievements.map((ach, i) => <li key={i}>{ach}</li>)}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}
      </div>

      <div className="col-span-1 space-y-6">
        {cv.skills.length > 0 && (
          <section className="p-5 rounded-xl" style={{ backgroundColor: `${accentColor}10` }}>
            <h2 className="text-sm font-bold uppercase tracking-wider mb-3" style={{ color: accentColor }}>Expertise</h2>
            <div className="space-y-2">
              {cv.skills.map((skill, idx) => (
                <div key={idx} className="text-sm text-gray-700 border-b pb-1 last:border-0" style={{ borderBottomColor: `${accentColor}30` }}>
                  {skill.name}
                </div>
              ))}
            </div>
          </section>
        )}

        {cv.education.length > 0 && (
          <section>
            <h2 className="text-sm font-bold uppercase tracking-wider mb-3" style={{ color: accentColor }}>Education</h2>
            {cv.education.map((edu, idx) => (
              <div key={idx} className="mb-3">
                <p className="font-bold text-sm text-gray-900">{edu.degree}</p>
                <p className="text-sm text-gray-600">{edu.institution}</p>
                <p className="text-xs text-gray-400">{formatDate(edu.end_date)}</p>
              </div>
            ))}
          </section>
        )}
      </div>
    </div>
  </div>
  );
};

export const ProjectManagerTemplate: React.FC<TemplateProps> = ({ cv }) => {
  const accentColor = getAccentColor(cv, '#0369a1');
  
  return (
  <div className={`bg-white shadow-lg p-8 max-w-[8.5in] mx-auto font-sans text-slate-800 ${cv.is_grayscale ? 'grayscale' : ''}`}>
    <header className="border-b-2 pb-4 mb-6" style={{ borderBottomColor: accentColor }}>
      <div className="flex justify-between items-end">
        <div className="flex items-center gap-4">
          <TemplatePhoto photoUrl={cv.personal_info.photo_url} size="md" shape="rounded" borderColor={accentColor} />
          <div>
            <h1 className="text-3xl font-bold text-slate-900">{cv.personal_info.full_name}</h1>
            <p className="font-medium text-lg mt-1" style={{ color: accentColor }}>{cv.target_role || 'Project Manager'}</p>
          </div>
        </div>
        <div className="text-right text-sm text-slate-500">
          <p>{cv.personal_info.email}</p>
          <p>{cv.personal_info.phone}</p>
          <p>{cv.personal_info.linkedin_url}</p>
        </div>
      </div>
    </header>

    {/* Skills Matrix / Highlights */}
    {cv.skills.length > 0 && (
      <section className="mb-8 bg-slate-50 p-4 rounded border border-slate-200">
        <h2 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">Competency Matrix</h2>
        <div className="grid grid-cols-3 gap-4">
          {cv.skills.slice(0, 9).map((skill, idx) => (
            <div key={idx} className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-sm" style={{ backgroundColor: accentColor }}></div>
              <span className="text-sm font-medium text-slate-700">{skill.name}</span>
            </div>
          ))}
        </div>
      </section>
    )}

    <div className="space-y-8">
      {cv.experience.length > 0 && (
        <section>
          <h2 className="text-lg font-bold text-slate-900 border-l-4 pl-3 mb-4" style={{ borderLeftColor: accentColor }}>Project Experience</h2>
          <div className="space-y-6">
            {cv.experience.map((exp, idx) => (
              <div key={idx}>
                <div className="flex justify-between items-baseline mb-1">
                  <h3 className="font-bold text-lg text-slate-800">{exp.title}</h3>
                  <span className="text-sm font-mono text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                    {formatDateRange(exp.start_date, exp.end_date, exp.current)}
                  </span>
                </div>
                <p className="font-medium text-sm mb-2" style={{ color: accentColor }}>{exp.company}</p>
                <p className="text-sm text-slate-600 mb-2 italic">{exp.description}</p>
                {exp.achievements && (
                  <div className="grid grid-cols-1 gap-1">
                    {exp.achievements.map((ach, i) => (
                      <div key={i} className="flex items-start gap-2 text-sm text-slate-700">
                        <span className="mt-1" style={{ color: `${accentColor}80` }}>▸</span>
                        <span>{ach}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      <div className="grid grid-cols-2 gap-8">
        {cv.education.length > 0 && (
          <section>
            <h2 className="text-lg font-bold text-slate-900 border-l-4 pl-3 mb-4" style={{ borderLeftColor: accentColor }}>Education</h2>
            {cv.education.map((edu, idx) => (
              <div key={idx} className="mb-2">
                <p className="font-bold text-sm">{edu.degree}</p>
                <p className="text-sm text-slate-600">{edu.institution}</p>
              </div>
            ))}
          </section>
        )}

        {cv.certifications.length > 0 && (
          <section>
            <h2 className="text-lg font-bold text-slate-900 border-l-4 pl-3 mb-4" style={{ borderLeftColor: accentColor }}>Certifications</h2>
            {cv.certifications.map((cert, idx) => (
              <div key={idx} className="mb-2">
                <p className="font-bold text-sm">{cert.name}</p>
                <p className="text-xs text-slate-500">{cert.issuer}</p>
              </div>
            ))}
          </section>
        )}
      </div>
    </div>
  </div>
  );
};

export const ProductManagerTemplate: React.FC<TemplateProps> = ({ cv }) => {
  const accentColor = getAccentColor(cv, '#4f46e5');
  
  return (
  <div className={`bg-white shadow-lg p-8 max-w-[8.5in] mx-auto font-sans text-gray-900 ${cv.is_grayscale ? 'grayscale' : ''}`}>
    <header className="mb-8">
      <div className="flex items-center gap-4 mb-2">
        <TemplatePhoto photoUrl={cv.personal_info.photo_url} size="lg" shape="rounded" borderColor={accentColor} />
        <h1 className="text-4xl font-extrabold tracking-tight" style={{ color: accentColor }}>{cv.personal_info.full_name}</h1>
      </div>
      <div className="flex items-center gap-3 text-sm font-medium" style={{ color: accentColor }}>
        <span>PRODUCT LEADER</span>
        <span className="w-1 h-1 rounded-full" style={{ backgroundColor: `${accentColor}60` }}></span>
        <span>STRATEGY</span>
        <span className="w-1 h-1 rounded-full" style={{ backgroundColor: `${accentColor}60` }}></span>
        <span>EXECUTION</span>
      </div>
      <div className="mt-4 flex gap-6 text-sm text-gray-500 border-t border-gray-100 pt-4">
        <span>{cv.personal_info.email}</span>
        <span>{cv.personal_info.phone}</span>
        <span>{cv.personal_info.linkedin_url}</span>
      </div>
    </header>

    <div className="grid grid-cols-12 gap-8">
      <div className="col-span-8 space-y-8">
        {cv.personal_info.summary && (
          <section>
            <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">About</h2>
            <p className="text-sm leading-relaxed text-gray-700">{cv.personal_info.summary}</p>
          </section>
        )}

        {cv.experience.length > 0 && (
          <section>
            <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Experience</h2>
            <div className="space-y-8">
              {cv.experience.map((exp, idx) => (
                <div key={idx}>
                  <div className="flex justify-between items-baseline mb-1">
                    <h3 className="font-bold text-lg text-gray-900">{exp.title}</h3>
                    <span className="text-xs font-bold text-gray-400 uppercase">{formatDateRange(exp.start_date, exp.end_date, exp.current)}</span>
                  </div>
                  <p className="font-medium text-sm mb-3" style={{ color: accentColor }}>{exp.company}</p>
                  <ul className="space-y-2">
                    {exp.achievements?.map((ach, i) => (
                      <li key={i} className="text-sm text-gray-700 flex gap-3">
                        <span className="font-bold" style={{ color: `${accentColor}60` }}>→</span>
                        {ach}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>

      <div className="col-span-4 space-y-8">
        {cv.skills.length > 0 && (
          <section>
            <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Toolkit</h2>
            <div className="flex flex-wrap gap-2">
              {cv.skills.map((skill, idx) => (
                <span key={idx} className="px-3 py-1 text-xs font-bold rounded-full" style={{ backgroundColor: `${accentColor}10`, color: accentColor }}>
                  {skill.name}
                </span>
              ))}
            </div>
          </section>
        )}

        {cv.projects && cv.projects.length > 0 && (
          <section>
            <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Launches</h2>
            <div className="space-y-4">
              {cv.projects.map((proj, idx) => (
                <div key={idx}>
                  <h3 className="font-bold text-sm text-gray-900">{proj.name}</h3>
                  <p className="text-xs text-gray-500 mt-1">{proj.description}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {cv.education.length > 0 && (
          <section>
            <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Education</h2>
            {cv.education.map((edu, idx) => (
              <div key={idx} className="mb-3">
                <p className="font-bold text-sm text-gray-900">{edu.degree}</p>
                <p className="text-xs text-gray-500">{edu.institution}</p>
              </div>
            ))}
          </section>
        )}
      </div>
    </div>
  </div>
  );
};

export const ContentWriterTemplate: React.FC<TemplateProps> = ({ cv }) => {
  const accentColor = getAccentColor(cv, '#f97316');
  
  return (
  <div className={`bg-[#fdfbf7] shadow-lg p-12 max-w-[8.5in] mx-auto font-serif text-gray-900 ${cv.is_grayscale ? 'grayscale' : ''}`}>
    <header className="text-center mb-12 border-b border-gray-300 pb-8">
      <div className="flex justify-center mb-4">
        <TemplatePhoto photoUrl={cv.personal_info.photo_url} size="lg" shape="circle" borderColor={accentColor} />
      </div>
      <h1 className="text-5xl italic font-medium text-gray-900 mb-4">{cv.personal_info.full_name}</h1>
      <p className="text-sm uppercase tracking-[0.2em] text-gray-500 mb-6">{cv.target_role || 'Writer & Editor'}</p>
      <div className="flex justify-center gap-6 text-sm font-sans text-gray-500">
        <a href={`mailto:${cv.personal_info.email}`} className="hover:text-black transition-colors">{cv.personal_info.email}</a>
        {cv.personal_info.portfolio_url && <a href={cv.personal_info.portfolio_url} className="hover:text-black transition-colors">Portfolio</a>}
        {cv.personal_info.linkedin_url && <a href={cv.personal_info.linkedin_url} className="hover:text-black transition-colors">LinkedIn</a>}
      </div>
    </header>

    <div className="max-w-2xl mx-auto space-y-10">
      {cv.personal_info.summary && (
        <section className="text-center">
          <p className="text-lg leading-relaxed text-gray-800 italic">"{cv.personal_info.summary}"</p>
        </section>
      )}

      {cv.experience.length > 0 && (
        <section>
          <h2 className="text-center text-sm font-sans font-bold uppercase tracking-widest mb-8 text-gray-400">Experience</h2>
          <div className="space-y-8">
            {cv.experience.map((exp, idx) => (
              <div key={idx} className="relative">
                <div className="flex justify-between items-baseline mb-2 font-sans">
                  <h3 className="font-bold text-base">{exp.title}</h3>
                  <span className="text-xs text-gray-400">{formatDateRange(exp.start_date, exp.end_date, exp.current)}</span>
                </div>
                <p className="text-sm font-sans text-gray-500 mb-3 uppercase tracking-wide">{exp.company}</p>
                <p className="text-base leading-relaxed text-gray-700">{exp.description}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {cv.projects && cv.projects.length > 0 && (
        <section>
          <h2 className="text-center text-sm font-sans font-bold uppercase tracking-widest mb-8 text-gray-400">Selected Works</h2>
          <ul className="space-y-4">
            {cv.projects.map((proj, idx) => (
              <li key={idx} className="flex justify-between items-baseline border-b border-gray-200 pb-2 last:border-0">
                <span className="font-medium text-gray-900">{proj.name}</span>
                <span className="text-sm text-gray-500 italic">{proj.description}</span>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  </div>
  );
};

export const SocialMediaManagerTemplate: React.FC<TemplateProps> = ({ cv }) => {
  const accentColor = getAccentColor(cv, '#ec4899');
  
  return (
  <div className={`bg-white shadow-lg p-8 max-w-[8.5in] mx-auto font-sans text-gray-900 ${cv.is_grayscale ? 'grayscale' : ''}`}>
    <div className="h-2 w-full mb-8" style={{ background: `linear-gradient(to right, ${accentColor}, #ef4444, #f59e0b)` }}></div>
    
    <header className="flex justify-between items-start mb-10">
      <div className="flex items-center gap-4">
        <TemplatePhoto photoUrl={cv.personal_info.photo_url} size="lg" shape="circle" borderColor={accentColor} />
        <div>
          <h1 className="text-4xl font-black text-transparent bg-clip-text mb-2" style={{ backgroundImage: `linear-gradient(to right, ${accentColor}, #9333ea)` }}>
            {cv.personal_info.full_name}
          </h1>
          <p className="text-xl font-bold text-gray-800">{cv.target_role || 'Social Media Manager'}</p>
        </div>
      </div>
      <div className="text-right space-y-1 text-sm font-medium text-gray-600">
        <p>@{cv.personal_info.linkedin_url?.split('/').pop() || 'username'}</p>
        <p>{cv.personal_info.email}</p>
        <p>{cv.personal_info.phone}</p>
      </div>
    </header>

    <div className="grid grid-cols-2 gap-10">
      <div className="space-y-8">
        {cv.personal_info.summary && (
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Bio</h2>
            <p className="text-gray-700 leading-relaxed">{cv.personal_info.summary}</p>
          </section>
        )}

        {cv.experience.length > 0 && (
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Experience</h2>
            <div className="space-y-8">
              {cv.experience.map((exp, idx) => (
                <div key={idx}>
                  <h3 className="font-bold text-lg">{exp.title}</h3>
                  <p className="font-bold text-sm mb-2" style={{ color: accentColor }}>{exp.company}</p>
                  <p className="text-xs text-gray-400 mb-3 uppercase tracking-wide">{formatDateRange(exp.start_date, exp.end_date, exp.current)}</p>
                  <ul className="space-y-2">
                    {exp.achievements?.map((ach, i) => (
                      <li key={i} className="text-sm text-gray-700 flex gap-2">
                        <span style={{ color: accentColor }}>#</span> {ach}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>

      <div className="space-y-8">
        {cv.skills.length > 0 && (
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Skills & Tools</h2>
            <div className="flex flex-wrap gap-3">
              {cv.skills.map((skill, idx) => (
                <span key={idx} className="px-4 py-2 bg-gray-100 rounded-lg text-sm font-bold text-gray-700 hover:bg-pink-50 transition-colors">
                  {skill.name}
                </span>
              ))}
            </div>
          </section>
        )}

        {cv.projects && cv.projects.length > 0 && (
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Campaigns</h2>
            <div className="space-y-4">
              {cv.projects.map((proj, idx) => (
                <div key={idx} className="bg-gray-50 p-4 rounded-xl">
                  <h3 className="font-bold text-gray-900">{proj.name}</h3>
                  <p className="text-sm text-gray-600 mt-1">{proj.description}</p>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  </div>
  );
};



