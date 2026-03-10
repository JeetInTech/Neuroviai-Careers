/**
 * CV Forge - Unique Template Components
 * 
 * Each template here has a genuinely unique layout/design.
 * Minor role variations have been consolidated - use the Professional
 * template (from index.tsx) as the default for any role not listed here.
 */

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
// MOBILE APP DEVELOPER TEMPLATE
// Two-column sidebar layout with app portfolio emphasis
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

// =============================================================================
// SYSTEMS ENGINEER TEMPLATE
// Terminal/monospace style with command-line aesthetic
// =============================================================================

export const SystemsEngineerTemplate: React.FC<TemplateProps> = ({ cv }) => {
  const accentColor = getAccentColor(cv, '#1f2937');
  const checkColor = cv.is_grayscale ? '#6b7280' : '#16a34a';
  
  return (
  <div className={`bg-white shadow-lg p-8 max-w-[8.5in] mx-auto font-mono text-sm text-gray-800 ${cv.is_grayscale ? 'grayscale' : ''}`}>
    <header className="border-b-2 pb-4 mb-6" style={{ borderColor: accentColor }}>
      <div>
        <h1 className="text-2xl font-bold text-gray-900 mb-1">{`> ${cv.personal_info.full_name}`}</h1>
        <p className="text-gray-600 mb-2">{`// ${cv.target_role || 'Systems Engineer'}`}</p>
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
// CREATIVE BOLD TEMPLATE
// High-contrast split layout - black sidebar with white content area
// =============================================================================

export const CreativeBoldTemplate: React.FC<TemplateProps> = ({ cv }) => {
  const accentColor = getAccentColor(cv, '#000000');
  return (
  <div className={`bg-white shadow-lg p-0 max-w-[8.5in] mx-auto font-sans flex min-h-[11in] ${cv.is_grayscale ? 'grayscale' : ''}`}>
    {/* Left Column - Black */}
    <div className="w-1/3 text-white p-8 flex flex-col justify-between" style={{ backgroundColor: accentColor }}>
      <div>
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
// EXECUTIVE TEMPLATE
// Distinguished serif layout with gold accents for senior leadership
// =============================================================================

export const ExecutiveTemplate: React.FC<TemplateProps> = ({ cv }) => {
  const accentColor = getAccentColor(cv, '#1e3a5f');
  const goldColor = cv.is_grayscale ? '#6b7280' : '#d97706';
  return (
  <div className={`bg-white shadow-lg max-w-[8.5in] mx-auto font-sans p-12 border-t-[16px] ${cv.is_grayscale ? 'grayscale' : ''}`} style={{ borderTopColor: accentColor }}>
    <header className="text-center mb-12">
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
            ))}
          </section>
        </div>
      </div>
    </div>
  </div>
  );
};

// =============================================================================
// FREELANCER TEMPLATE
// Modern portfolio-focused layout with orange accents
// =============================================================================

export const FreelancerTemplate: React.FC<TemplateProps> = ({ cv }) => {
  const accentColor = getAccentColor(cv, '#f97316');
  const bgGradient = cv.is_grayscale ? 'bg-gray-50' : 'bg-gradient-to-br from-orange-50 to-amber-50';
  return (
  <div className={`${bgGradient} shadow-lg max-w-[8.5in] mx-auto font-sans min-h-[11in] ${cv.is_grayscale ? 'grayscale' : ''}`}>
    <header className="text-white p-8" style={{ backgroundColor: accentColor }}>
      <div>
        <h1 className="text-3xl font-bold">{cv.personal_info.full_name}</h1>
        <p className="text-lg mt-1" style={{ color: 'rgba(255,255,255,0.8)' }}>{cv.target_role}</p>
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

// =============================================================================
// AI/ML ENGINEER TEMPLATE
// Tech-focused violet layout with monospace font
// =============================================================================

export const AIMLTemplate: React.FC<TemplateProps> = ({ cv }) => {
  const accentColor = getAccentColor(cv, '#8b5cf6');
  const bgGradient = cv.is_grayscale ? 'bg-gray-50' : `bg-gradient-to-r from-purple-50 to-violet-50`;
  return (
  <div className={`bg-white shadow-lg max-w-[8.5in] mx-auto font-mono min-h-[11in] border-t-8 ${cv.is_grayscale ? 'grayscale' : ''}`} style={{ borderTopColor: accentColor }}>
    <header className={`p-8 ${bgGradient}`}>
      <div>
        <h1 className="text-3xl font-bold text-gray-900">{cv.personal_info.full_name}</h1>
        <p className="font-bold uppercase tracking-wider mt-1" style={{ color: accentColor }}>{cv.target_role}</p>
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

// =============================================================================
// DATA SCIENCE TEMPLATE
// Clean academic/tech layout with sky blue header
// =============================================================================

export const DataScienceTemplate: React.FC<TemplateProps> = ({ cv }) => {
  const accentColor = getAccentColor(cv, '#0ea5e9');
  return (
  <div className={`bg-slate-50 shadow-lg max-w-[8.5in] mx-auto font-sans min-h-[11in] ${cv.is_grayscale ? 'grayscale' : ''}`}>
    <header className="text-white p-8" style={{ backgroundColor: accentColor }}>
      <div>
        <h1 className="text-3xl font-bold">{cv.personal_info.full_name}</h1>
        <p className="text-lg mt-1" style={{ color: 'rgba(255,255,255,0.8)' }}>{cv.target_role}</p>
      </div>
      <div className="flex flex-wrap gap-6 mt-4 text-sm" style={{ color: 'rgba(255,255,255,0.7)' }}>
        <span>📧 {cv.personal_info.email}</span>
        <span>📱 {cv.personal_info.phone}</span>
        <span>📊 Data Science</span>
      </div>
    </header>
    
    <div className="p-8">
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

// =============================================================================
// DESIGNER TEMPLATE
// Gradient background with rounded cards and icon sections
// =============================================================================

export const DesignerTemplate: React.FC<TemplateProps> = ({ cv }) => {
  const accentColor = getAccentColor(cv, '#d946ef');
  const bgTint = cv.is_grayscale ? 'from-gray-50 to-gray-100' : 'from-violet-50 to-fuchsia-50';
  const iconBg = cv.is_grayscale ? 'bg-gray-100' : 'bg-fuchsia-100';
  
  return (
  <div className={`bg-gradient-to-br ${bgTint} shadow-lg max-w-[8.5in] mx-auto font-sans min-h-[11in] ${cv.is_grayscale ? 'grayscale' : ''}`}>
    <header className="p-10 border-b-4" style={{ borderBottomColor: accentColor }}>
      <div className="flex items-center gap-8">
        <div className="w-24 h-24 rounded-3xl flex items-center justify-center shadow-lg" style={{ background: `linear-gradient(135deg, ${accentColor}, ${accentColor}dd)` }}>
          <span className="text-4xl text-white font-bold">{cv.personal_info.full_name.charAt(0)}</span>
        </div>
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

// =============================================================================
// VIDEO EDITOR TEMPLATE
// Dark theme cinematic layout with red accents
// =============================================================================

export const VideoEditorTemplate: React.FC<TemplateProps> = ({ cv }) => {
  const accentColor = getAccentColor(cv, '#ef4444');
  
  return (
  <div className={`bg-slate-900 text-slate-300 shadow-lg max-w-[8.5in] mx-auto font-sans min-h-[11in] ${cv.is_grayscale ? 'grayscale' : ''}`}>
    <header className="bg-black p-10 text-center border-b border-slate-800">
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

// =============================================================================
// FRESHER / ENTRY-LEVEL TEMPLATE
// Education-first layout with blue header, ideal for new graduates
// =============================================================================

export const FresherTemplate: React.FC<TemplateProps> = ({ cv }) => {
  const accentColor = getAccentColor(cv, '#3b82f6');
  
  return (
  <div className={`bg-white shadow-lg max-w-[8.5in] mx-auto font-sans min-h-[11in] ${cv.is_grayscale ? 'grayscale' : ''}`}>
    <header className="text-white p-8" style={{ backgroundColor: accentColor }}>
      <div>
        <h1 className="text-3xl font-bold">{cv.personal_info.full_name}</h1>
        <p className="text-lg mt-1" style={{ color: `${accentColor}40` }}>{cv.target_role}</p>
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

// =============================================================================
// CONTENT WRITER TEMPLATE
// Elegant serif typography with warm tones
// =============================================================================

export const ContentWriterTemplate: React.FC<TemplateProps> = ({ cv }) => {
  const accentColor = getAccentColor(cv, '#f97316');
  
  return (
  <div className={`bg-[#fdfbf7] shadow-lg p-12 max-w-[8.5in] mx-auto font-serif text-gray-900 ${cv.is_grayscale ? 'grayscale' : ''}`}>
    <header className="text-center mb-12 border-b pb-8" style={{ borderColor: accentColor }}>
      <h1 className="text-5xl italic font-medium text-gray-900 mb-4">{cv.personal_info.full_name}</h1>
      <p className="text-sm uppercase tracking-[0.2em] mb-6" style={{ color: accentColor }}>{cv.target_role || 'Writer & Editor'}</p>
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
          <h2 className="text-center text-sm font-sans font-bold uppercase tracking-widest mb-8" style={{ color: accentColor }}>Experience</h2>
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
          <h2 className="text-center text-sm font-sans font-bold uppercase tracking-widest mb-8" style={{ color: accentColor }}>Selected Works</h2>
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
