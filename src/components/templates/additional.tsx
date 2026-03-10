/**
 * CV Forge - Additional Template Variants
 * 
 * Only the CreativeTemplate is used from this file (re-exported by index.tsx).
 * The other legacy templates (ExecutiveTemplate, FreelancerTemplate, AIMLTemplate)
 * were shadowed by unique_templates.tsx versions and have been removed.
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

// Date range formatter
const formatDateRange = (startDate: string, endDate: string, current?: boolean): string => {
  const start = formatDate(startDate);
  const end = current ? 'Present' : formatDate(endDate);
  if (!start && !end) return '';
  if (!start) return end;
  if (!end) return start;
  return `${start} - ${end}`;
};

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

export default {
  CreativeTemplate,
};
