/**
 * CV Forge - Additional Template Variants
 * 
 * Extended templates for specialized use cases
 */

import React from 'react';
import type { CV } from '../../lib/database.types';

interface TemplateProps {
  cv: CV;
  isViewMode?: boolean;
}

// Date formatter
const formatDate = (date: string): string => {
  if (!date) return '';
  const [year, month] = date.split('-');
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return month ? `${months[parseInt(month) - 1]} ${year}` : year;
};

// Date range formatter - returns empty string if no dates
const formatDateRange = (startDate: string, endDate: string, current?: boolean): string => {
  const start = formatDate(startDate);
  const end = current ? 'Present' : formatDate(endDate);
  
  if (!start && !end) return '';
  if (!start) return end;
  if (!end) return start;
  return `${start} - ${end}`;
};

// =============================================================================
// EXECUTIVE TEMPLATE
// Ideal for: C-level, Directors, Senior Management
// =============================================================================

export const ExecutiveTemplate: React.FC<TemplateProps> = ({ cv }) => (
  <div className="bg-white shadow-lg rounded-lg p-10 max-w-[8.5in] mx-auto font-serif leading-relaxed">
    {/* Distinguished Header */}
    <header className="text-center mb-8 pb-6 border-b-4 border-double border-gray-800">
      <h1 className="text-4xl font-bold text-gray-900 tracking-wide">
        {cv.personal_info.full_name}
      </h1>
      <div className="mt-3 text-sm text-gray-600 tracking-wide">
        {[cv.personal_info.email, cv.personal_info.phone, cv.personal_info.address]
          .filter(Boolean)
          .join('  |  ')}
      </div>
      <div className="mt-2 flex justify-center gap-6 text-sm">
        {cv.personal_info.linkedin_url && (
          <a href={cv.personal_info.linkedin_url} className="text-gray-600 hover:text-gray-900">
            LinkedIn Profile
          </a>
        )}
      </div>
    </header>

    {/* Executive Summary */}
    {cv.personal_info.summary && (
      <section className="mb-8">
        <h2 className="text-lg font-bold text-gray-800 uppercase tracking-widest border-b border-gray-300 pb-1 mb-4">
          Executive Summary
        </h2>
        <p className="text-base text-gray-700 leading-relaxed italic">
          {cv.personal_info.summary}
        </p>
      </section>
    )}

    {/* Professional Experience */}
    {cv.experience.length > 0 && (
      <section className="mb-8">
        <h2 className="text-lg font-bold text-gray-800 uppercase tracking-widest border-b border-gray-300 pb-1 mb-4">
          Professional Experience
        </h2>
        <div className="space-y-6">
          {cv.experience.map((exp, idx) => (
            <div key={idx}>
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-bold text-gray-900">{exp.title}</h3>
                  <p className="text-base text-gray-700">{exp.company}</p>
                  <p className="text-sm text-gray-500">{exp.location}</p>
                </div>
                {formatDateRange(exp.start_date, exp.end_date, exp.current) && (
                  <p className="text-sm text-gray-600 font-medium">
                    {formatDateRange(exp.start_date, exp.end_date, exp.current)}
                  </p>
                )}
              </div>
              {exp.achievements && exp.achievements.length > 0 ? (
                <ul className="mt-3 space-y-2">
                  {exp.achievements.map((achievement, aIdx) => (
                    <li key={aIdx} className="text-base text-gray-700 flex items-start gap-2">
                      <span className="text-gray-400">▸</span>
                      {achievement}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="mt-3 text-base text-gray-700">{exp.description}</p>
              )}
            </div>
          ))}
        </div>
      </section>
    )}

    {/* Board Positions / Affiliations (using certifications) */}
    {cv.certifications.length > 0 && (
      <section className="mb-8">
        <h2 className="text-lg font-bold text-gray-800 uppercase tracking-widest border-b border-gray-300 pb-1 mb-4">
          Board Positions & Affiliations
        </h2>
        <ul className="space-y-2">
          {cv.certifications.map((cert, idx) => (
            <li key={idx} className="text-base text-gray-700">
              <span className="font-medium">{cert.name}</span>
              <span className="text-gray-500"> — {cert.issuer}, {formatDate(cert.date)}</span>
            </li>
          ))}
        </ul>
      </section>
    )}

    {/* Education */}
    {cv.education.length > 0 && (
      <section className="mb-8">
        <h2 className="text-lg font-bold text-gray-800 uppercase tracking-widest border-b border-gray-300 pb-1 mb-4">
          Education
        </h2>
        <div className="space-y-3">
          {cv.education.map((edu, idx) => (
            <div key={idx} className="flex justify-between items-baseline">
              <div>
                <span className="text-base font-medium text-gray-900">{edu.degree}</span>
                {edu.field_of_study && (
                  <span className="text-base text-gray-600">, {edu.field_of_study}</span>
                )}
                <span className="text-base text-gray-500"> — {edu.institution}</span>
              </div>
              <span className="text-sm text-gray-500">{formatDate(edu.end_date)}</span>
            </div>
          ))}
        </div>
      </section>
    )}

    {/* Core Competencies (Skills) */}
    {cv.skills.length > 0 && (
      <section>
        <h2 className="text-lg font-bold text-gray-800 uppercase tracking-widest border-b border-gray-300 pb-1 mb-4">
          Core Competencies
        </h2>
        <div className="grid grid-cols-3 gap-3">
          {cv.skills.map((skill, idx) => (
            <div key={idx} className="text-base text-gray-700">
              • {skill.name}
            </div>
          ))}
        </div>
      </section>
    )}
  </div>
);

// =============================================================================
// CREATIVE / DESIGNER TEMPLATE
// Ideal for: Designers, Artists, Creative professionals
// =============================================================================

export const CreativeTemplate: React.FC<TemplateProps> = ({ cv }) => (
  <div className="bg-gradient-to-br from-white to-gray-50 shadow-xl rounded-xl p-8 max-w-[8.5in] mx-auto font-sans">
    {/* Creative Header */}
    <header className="mb-8 relative">
      <div className="absolute top-0 left-0 w-20 h-20 bg-gradient-to-br from-pink-400 to-purple-500 rounded-full opacity-20 -translate-x-8 -translate-y-8" />
      <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-600">
        {cv.personal_info.full_name}
      </h1>
      <div className="mt-3 flex flex-wrap gap-4 text-sm text-gray-600">
        {cv.personal_info.email && <span>✉️ {cv.personal_info.email}</span>}
        {cv.personal_info.phone && <span>📱 {cv.personal_info.phone}</span>}
        {cv.personal_info.portfolio_url && (
          <a href={cv.personal_info.portfolio_url} className="text-purple-600 hover:underline">
            🎨 Portfolio
          </a>
        )}
        {cv.personal_info.linkedin_url && (
          <a href={cv.personal_info.linkedin_url} className="text-purple-600 hover:underline">
            💼 LinkedIn
          </a>
        )}
      </div>
    </header>

    {/* About Me */}
    {cv.personal_info.summary && (
      <section className="mb-8 bg-white rounded-lg p-5 shadow-sm border-l-4 border-purple-400">
        <h2 className="text-sm font-bold text-purple-600 uppercase tracking-wide mb-2">About Me</h2>
        <p className="text-gray-700 leading-relaxed">{cv.personal_info.summary}</p>
      </section>
    )}

    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Skills Column */}
      <div className="md:col-span-1 space-y-6">
        {cv.skills.length > 0 && (
          <section className="bg-white rounded-lg p-5 shadow-sm">
            <h2 className="text-sm font-bold text-purple-600 uppercase tracking-wide mb-3">Skills</h2>
            <div className="space-y-2">
              {cv.skills.map((skill, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-800">{skill.name}</p>
                  </div>
                  <div className="w-20 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-pink-400 to-purple-500 rounded-full"
                      style={{ width: `${skill.level * 20}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {cv.languages.length > 0 && (
          <section className="bg-white rounded-lg p-5 shadow-sm">
            <h2 className="text-sm font-bold text-purple-600 uppercase tracking-wide mb-3">Languages</h2>
            <div className="space-y-1">
              {cv.languages.map((lang, idx) => (
                <p key={idx} className="text-sm text-gray-700">
                  {lang.name} <span className="text-gray-400">({lang.proficiency})</span>
                </p>
              ))}
            </div>
          </section>
        )}

        {cv.certifications.length > 0 && (
          <section className="bg-white rounded-lg p-5 shadow-sm">
            <h2 className="text-sm font-bold text-purple-600 uppercase tracking-wide mb-3">Certifications</h2>
            <div className="space-y-2">
              {cv.certifications.map((cert, idx) => (
                <p key={idx} className="text-sm text-gray-700">
                  {cert.name}
                  <span className="text-xs text-gray-400 block">{cert.issuer}</span>
                </p>
              ))}
            </div>
          </section>
        )}
      </div>

      {/* Main Content */}
      <div className="md:col-span-2 space-y-6">
        {/* Experience */}
        {cv.experience.length > 0 && (
          <section className="bg-white rounded-lg p-5 shadow-sm">
            <h2 className="text-sm font-bold text-purple-600 uppercase tracking-wide mb-4">Experience</h2>
            <div className="space-y-5">
              {cv.experience.map((exp, idx) => (
                <div key={idx} className="relative pl-4 border-l-2 border-purple-200">
                  <div className="absolute w-2 h-2 bg-purple-400 rounded-full -left-[5px] top-1.5" />
                  <div className="flex justify-between items-baseline flex-wrap">
                    <h3 className="text-base font-bold text-gray-900">{exp.title}</h3>
                    {formatDateRange(exp.start_date, exp.end_date, exp.current) && (
                      <span className="text-xs text-gray-500">
                        {formatDateRange(exp.start_date, exp.end_date, exp.current)}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-purple-600">{exp.company}</p>
                  <p className="text-sm text-gray-600 mt-2">{exp.description}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Projects / Portfolio */}
        {cv.projects && cv.projects.length > 0 && (
          <section className="bg-white rounded-lg p-5 shadow-sm">
            <h2 className="text-sm font-bold text-purple-600 uppercase tracking-wide mb-4">Portfolio</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {cv.projects.map((project, idx) => (
                <div key={idx} className="border border-gray-100 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <h3 className="text-sm font-bold text-gray-900">{project.name}</h3>
                  <p className="text-xs text-gray-600 mt-1 line-clamp-2">{project.description}</p>
                  <div className="flex gap-2 mt-2">
                    {project.url && (
                      <a href={project.url} target="_blank" rel="noopener noreferrer"
                         className="text-xs text-purple-600 hover:underline">View →</a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Education */}
        {cv.education.length > 0 && (
          <section className="bg-white rounded-lg p-5 shadow-sm">
            <h2 className="text-sm font-bold text-purple-600 uppercase tracking-wide mb-3">Education</h2>
            <div className="space-y-2">
              {cv.education.map((edu, idx) => (
                <div key={idx}>
                  <p className="text-sm font-medium text-gray-900">
                    {edu.degree}{edu.field_of_study && ` in ${edu.field_of_study}`}
                  </p>
                  <p className="text-xs text-gray-500">{edu.institution} • {formatDate(edu.end_date)}</p>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  </div>
);

// =============================================================================
// FREELANCER TEMPLATE
// Ideal for: Freelancers, Consultants, Self-employed
// Style: Rose/pink gradient background with stats row (matches FreelancerFull preview)
// =============================================================================

export const FreelancerTemplate: React.FC<TemplateProps> = ({ cv }) => (
  <div className="bg-gradient-to-br from-rose-50 to-pink-50 shadow-xl rounded-lg max-w-[8.5in] mx-auto font-sans overflow-hidden p-6 md:p-8">
    {/* Header - Centered with avatar */}
    <header className="text-center mb-6">
      <div className="w-20 h-20 rounded-full bg-gradient-to-br from-pink-400 to-rose-500 mx-auto mb-3 flex items-center justify-center text-3xl shadow-lg">
        🚀
      </div>
      <h1 className="text-2xl md:text-3xl font-bold text-gray-800">{cv.personal_info.full_name}</h1>
      <p className="text-rose-600 font-medium">Independent Professional</p>
      <div className="flex justify-center flex-wrap gap-4 text-gray-500 text-xs mt-2">
        {cv.personal_info.email && <span>📧 {cv.personal_info.email}</span>}
        {cv.personal_info.portfolio_url && <span>🌐 Portfolio</span>}
        {cv.personal_info.github_url && <span>🔗 GitHub</span>}
        {cv.personal_info.address && <span>📍 {cv.personal_info.address}</span>}
      </div>
    </header>

    {/* Stats Row */}
    <div className="grid grid-cols-3 gap-3 mb-5">
      <div className="bg-white rounded-lg p-3 text-center shadow-sm border border-rose-100">
        <p className="font-bold text-rose-600 text-xl">{cv.projects?.length || 0}+</p>
        <p className="text-gray-500 text-xs">Projects</p>
      </div>
      <div className="bg-white rounded-lg p-3 text-center shadow-sm border border-rose-100">
        <p className="font-bold text-rose-600 text-xl">{cv.experience.length * 5}+</p>
        <p className="text-gray-500 text-xs">Happy Clients</p>
      </div>
      <div className="bg-white rounded-lg p-3 text-center shadow-sm border border-rose-100">
        <p className="font-bold text-rose-600 text-xl">5★</p>
        <p className="text-gray-500 text-xs">Avg Rating</p>
      </div>
    </div>

    {/* Bio */}
    {cv.personal_info.summary && (
      <section className="mb-5">
        <h2 className="text-sm md:text-base font-bold text-rose-600 uppercase tracking-wide mb-2">About Me</h2>
        <p className="text-gray-700 text-xs md:text-sm leading-relaxed">{cv.personal_info.summary}</p>
      </section>
    )}

    {/* Services / Skills */}
    {cv.skills.length > 0 && (
      <section className="mb-5">
        <h2 className="text-sm md:text-base font-bold text-rose-600 uppercase tracking-wide mb-2">Services</h2>
        <div className="flex flex-wrap gap-2 items-start">
          {cv.skills.map((skill, idx) => (
            <span key={idx} className="px-3 py-1.5 bg-white text-rose-600 rounded-full text-xs font-medium border border-rose-200 shadow-sm whitespace-nowrap">
              {skill.name}
            </span>
          ))}
        </div>
      </section>
    )}

    {/* Featured Work / Portfolio */}
    {cv.projects && cv.projects.length > 0 && (
      <section className="mb-5">
        <h2 className="text-sm md:text-base font-bold text-rose-600 uppercase tracking-wide mb-2">Featured Work</h2>
        <div className="space-y-2">
          {cv.projects.map((project, idx) => (
            <div key={idx} className="bg-white p-3 rounded-lg shadow-sm border border-rose-100">
              <div className="flex justify-between items-start flex-wrap gap-1">
                <div>
                  <h3 className="font-semibold text-gray-800 text-sm">{project.name}</h3>
                  <p className="text-rose-600 text-xs">{project.technologies.slice(0, 3).join(' • ')}</p>
                </div>
                <div className="flex gap-2">
                  {project.url && (
                    <a href={project.url} target="_blank" rel="noopener noreferrer"
                       className="text-xs bg-rose-100 text-rose-700 px-2 py-0.5 rounded">Live</a>
                  )}
                  {project.github_url && (
                    <a href={project.github_url} target="_blank" rel="noopener noreferrer"
                       className="text-xs bg-gray-200 text-gray-700 px-2 py-0.5 rounded">Code</a>
                  )}
                </div>
              </div>
              <p className="text-gray-600 text-xs mt-1">{project.description}</p>
            </div>
          ))}
        </div>
      </section>
    )}

    {/* Client Work & Experience */}
    {cv.experience.length > 0 && (
      <section className="mb-5">
        <h2 className="text-sm md:text-base font-bold text-rose-600 uppercase tracking-wide mb-2">Client Work</h2>
        <div className="space-y-2">
          {cv.experience.map((exp, idx) => (
            <div key={idx} className="bg-white p-3 rounded-lg shadow-sm border border-rose-100">
              <div className="flex justify-between items-start flex-wrap gap-1">
                <div>
                  <h3 className="font-semibold text-gray-800 text-sm">{exp.title}</h3>
                  <p className="text-rose-600 text-xs">{exp.company}</p>
                </div>
                {formatDateRange(exp.start_date, exp.end_date, exp.current) && (
                  <span className="text-gray-500 text-xs">
                    {formatDateRange(exp.start_date, exp.end_date, exp.current)}
                  </span>
                )}
              </div>
              {exp.achievements && exp.achievements.length > 0 ? (
                <ul className="mt-2 text-xs text-gray-600 list-disc list-inside">
                  {exp.achievements.slice(0, 2).map((a, aIdx) => <li key={aIdx}>{a}</li>)}
                </ul>
              ) : (
                <p className="mt-1 text-xs text-gray-600">{exp.description}</p>
              )}
            </div>
          ))}
        </div>
      </section>
    )}

    {/* Languages */}
    {cv.languages && cv.languages.length > 0 && (
      <section className="mb-5">
        <h2 className="text-sm md:text-base font-bold text-rose-600 uppercase tracking-wide mb-2">Languages</h2>
        <div className="flex gap-4 text-xs text-gray-600">
          {cv.languages.map((lang, idx) => (
            <span key={idx}>• {lang.name} ({lang.proficiency})</span>
          ))}
        </div>
      </section>
    )}

    {/* Education & Certifications */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
      {cv.education.length > 0 && (
        <section>
          <h2 className="text-sm md:text-base font-bold text-rose-600 uppercase tracking-wide mb-2">Education</h2>
          <div className="space-y-2">
            {cv.education.map((edu, idx) => (
              <div key={idx}>
                <p className="text-sm font-medium text-gray-900">{edu.degree}</p>
                <p className="text-xs text-gray-500">{edu.institution}, {formatDate(edu.end_date)}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {cv.certifications.length > 0 && (
        <section>
          <h2 className="text-sm md:text-base font-bold text-rose-600 uppercase tracking-wide mb-2">Certifications</h2>
          <div className="space-y-2">
            {cv.certifications.map((cert, idx) => (
              <div key={idx}>
                <p className="text-sm font-medium text-gray-900">{cert.name}</p>
                <p className="text-xs text-gray-500">{cert.issuer}</p>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  </div>
);

// =============================================================================
// AI/ML ENGINEER TEMPLATE
// Ideal for: AI Engineers, ML Researchers, Deep Learning specialists
// Style: Dark slate background with teal accents (matches AIMLFull preview)
// =============================================================================

export const AIMLTemplate: React.FC<TemplateProps> = ({ cv }) => (
  <div className="bg-slate-900 shadow-xl rounded-lg p-8 max-w-[8.5in] mx-auto font-sans leading-relaxed">
    {/* Header - Centered */}
    <header className="text-center mb-6">
      <h1 className="text-2xl md:text-3xl font-bold text-white">{cv.personal_info.full_name}</h1>
      <p className="text-teal-400 font-medium mt-1">AI/ML Engineer</p>
      <div className="flex justify-center flex-wrap gap-4 mt-3 text-sm text-slate-400">
        {cv.personal_info.email && <span>📧 {cv.personal_info.email}</span>}
        {cv.personal_info.phone && <span>📱 {cv.personal_info.phone}</span>}
        {cv.personal_info.github_url && <span>🔗 GitHub</span>}
        {cv.personal_info.address && <span>📍 {cv.personal_info.address}</span>}
      </div>
    </header>

    {/* Summary - Card style */}
    {cv.personal_info.summary && (
      <section className="bg-slate-800 rounded-lg p-4 mb-5 border border-teal-500/30">
        <p className="text-sm text-slate-300">{cv.personal_info.summary}</p>
      </section>
    )}

    {/* Technical Skills - ML Stack with rounded tags */}
    {cv.skills.length > 0 && (
      <section className="mb-5">
        <h2 className="text-base font-bold text-teal-400 uppercase tracking-wide mb-3">ML Stack</h2>
        <div className="flex flex-wrap gap-2 items-start">
          {cv.skills.map((skill, idx) => (
            <span key={idx} className="px-3 py-1.5 bg-slate-800 border border-teal-500/30 text-teal-400 rounded-full text-xs font-medium whitespace-nowrap">
              {skill.name}
            </span>
          ))}
        </div>
      </section>
    )}

    {/* Experience - Card style with dark bg */}
    {cv.experience.length > 0 && (
      <section className="mb-5">
        <h2 className="text-base font-bold text-teal-400 uppercase tracking-wide mb-3">Experience</h2>
        <div className="space-y-3">
          {cv.experience.map((exp, idx) => (
            <div key={idx} className="bg-slate-800/50 rounded-lg p-3">
              <div className="flex justify-between items-start flex-wrap gap-1">
                <div>
                  <h3 className="font-semibold text-white text-sm">{exp.title}</h3>
                  <p className="text-teal-400 text-xs">{exp.company}</p>
                </div>
                {formatDateRange(exp.start_date, exp.end_date, exp.current) && (
                  <span className="text-slate-500 text-xs">
                    {formatDateRange(exp.start_date, exp.end_date, exp.current)}
                  </span>
                )}
              </div>
              {exp.achievements && exp.achievements.length > 0 ? (
                <ul className="mt-2 text-slate-300 text-xs space-y-1 list-disc list-inside">
                  {exp.achievements.map((a, aIdx) => <li key={aIdx}>{a}</li>)}
                </ul>
              ) : (
                <p className="mt-2 text-slate-300 text-xs">{exp.description}</p>
              )}
            </div>
          ))}
        </div>
      </section>
    )}

    {/* Research & Projects */}
    {cv.projects && cv.projects.length > 0 && (
      <section className="mb-5">
        <h2 className="text-base font-bold text-teal-400 uppercase tracking-wide mb-3">Research & Projects</h2>
        <div className="space-y-3">
          {cv.projects.map((project, idx) => (
            <div key={idx} className="bg-slate-800/50 rounded-lg p-3">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-sm font-semibold text-white">{project.name}</h3>
                {project.github_url && (
                  <a href={project.github_url} target="_blank" rel="noopener noreferrer"
                     className="text-xs text-teal-400 hover:underline">[Code]</a>
                )}
                {project.url && (
                  <a href={project.url} target="_blank" rel="noopener noreferrer"
                     className="text-xs text-teal-400 hover:underline">[Demo]</a>
                )}
              </div>
              <p className="text-xs text-slate-300 mt-2">{project.description}</p>
              <div className="flex flex-wrap gap-1 mt-2">
                {project.technologies.map((tech, tIdx) => (
                  <span key={tIdx} className="text-xs bg-slate-700 text-teal-300 px-1.5 py-0.5 rounded">
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    )}

    {/* Education */}
    {cv.education.length > 0 && (
      <section className="mb-5">
        <h2 className="text-base font-bold text-teal-400 uppercase tracking-wide mb-2">Education</h2>
        <div className="space-y-2">
          {cv.education.map((edu, idx) => (
            <div key={idx} className="flex justify-between flex-wrap gap-1">
              <div>
                <h3 className="font-semibold text-white text-sm">{edu.degree}</h3>
                <p className="text-slate-400 text-xs">{edu.institution}</p>
              </div>
              <span className="text-slate-500 text-xs">{formatDate(edu.end_date)}</span>
            </div>
          ))}
        </div>
      </section>
    )}

    {/* Languages */}
    {cv.languages && cv.languages.length > 0 && (
      <section className="mb-5">
        <h2 className="text-base font-bold text-teal-400 uppercase tracking-wide mb-2">Languages</h2>
        <div className="flex gap-4 text-xs text-slate-300">
          {cv.languages.map((lang, idx) => (
            <span key={idx}>• {lang.name} ({lang.proficiency})</span>
          ))}
        </div>
      </section>
    )}

    {/* Certifications & Publications */}
    {cv.certifications.length > 0 && (
      <section>
        <h2 className="text-base font-bold text-teal-400 uppercase tracking-wide mb-2">Publications & Achievements</h2>
        <ul className="text-slate-300 text-xs space-y-1 list-disc list-inside">
          {cv.certifications.map((cert, idx) => (
            <li key={idx}>{cert.name} - {cert.issuer}</li>
          ))}
        </ul>
      </section>
    )}
  </div>
);

export default {
  ExecutiveTemplate,
  CreativeTemplate,
  FreelancerTemplate,
  AIMLTemplate,
};
