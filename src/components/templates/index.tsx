/**
 * CV Forge - ATS-Optimized Template System
 * 
 * Modern, professional resume templates designed for 90%+ ATS compatibility
 * All templates use:
 * - Single-column layouts (better ATS parsing)
 * - Standard section headings (Summary, Experience, Education, Skills, Projects)
 * - Clean typography with proper hierarchy
 * - Consistent date formatting
 * - Action verbs and quantifiable achievements
 */

import React from 'react';
import type { CV } from '../../lib/database.types';

// =============================================================================
// SHARED COMPONENTS
// =============================================================================

interface TemplateProps {
  cv: CV;
  isViewMode?: boolean;
}

// Contact Info Bar
const ContactBar: React.FC<{ personal: CV['personal_info'] }> = ({ personal }) => {
  const items: string[] = [];
  
  if (personal.email) items.push(personal.email);
  if (personal.phone) items.push(personal.phone);
  if (personal.city && personal.country) {
    items.push(`${personal.city}, ${personal.country}`);
  } else if (personal.address) {
    items.push(personal.address);
  }

  return (
    <div className="flex flex-wrap justify-center gap-2 text-sm text-gray-600">
      {items.map((item, idx) => (
        <React.Fragment key={idx}>
          <span>{item}</span>
          {idx < items.length - 1 && <span>•</span>}
        </React.Fragment>
      ))}
    </div>
  );
};

// Social Links Row
const SocialLinks: React.FC<{ personal: CV['personal_info'] }> = ({ personal }) => {
  const links: { label: string; url: string }[] = [];
  
  if (personal.linkedin_url) links.push({ label: 'LinkedIn', url: personal.linkedin_url });
  if (personal.github_url) links.push({ label: 'GitHub', url: personal.github_url });
  if (personal.portfolio_url) links.push({ label: 'Portfolio', url: personal.portfolio_url });

  if (links.length === 0) return null;

  return (
    <div className="flex justify-center gap-4 text-sm mt-2">
      {links.map((link, idx) => (
        <a
          key={idx}
          href={link.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-indigo-600 hover:text-indigo-800 underline"
        >
          {link.label}
        </a>
      ))}
    </div>
  );
};

// Section Header
const SectionHeader: React.FC<{ title: string; variant?: 'default' | 'minimal' | 'tech' }> = ({ 
  title, 
  variant = 'default' 
}) => {
  const variants = {
    default: 'text-lg font-bold text-gray-900 border-b-2 border-gray-300 pb-1 mb-4 uppercase tracking-wide',
    minimal: 'text-base font-semibold text-gray-800 border-b border-gray-200 pb-1 mb-3',
    tech: 'text-lg font-bold text-gray-900 border-b-2 border-indigo-500 pb-1 mb-4 uppercase',
  };

  return <h2 className={variants[variant]}>{title}</h2>;
};

// Date Range formatter
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
// PROFESSIONAL TEMPLATE
// Ideal for: Experienced professionals, corporate roles
// =============================================================================

export const ProfessionalTemplate: React.FC<TemplateProps> = ({ cv }) => (
  <div className="bg-white shadow-lg rounded-lg p-8 max-w-[8.5in] mx-auto font-sans leading-relaxed">
    {/* Header */}
    <header className="text-center mb-6 pb-4 border-b-2 border-gray-800">
      <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
        {cv.personal_info.full_name}
      </h1>
      <ContactBar personal={cv.personal_info} />
      <SocialLinks personal={cv.personal_info} />
    </header>

    {/* Professional Summary */}
    {cv.personal_info.summary && (
      <section className="mb-6">
        <SectionHeader title="Professional Summary" />
        <p className="text-gray-700 text-sm leading-relaxed">{cv.personal_info.summary}</p>
      </section>
    )}

    {/* Experience */}
    {cv.experience.length > 0 && (
      <section className="mb-6">
        <SectionHeader title="Experience" />
        <div className="space-y-4">
          {cv.experience.map((exp, idx) => (
            <div key={idx} className="pb-3">
              <div className="flex justify-between items-baseline flex-wrap gap-2">
                <h3 className="text-base font-semibold text-gray-900">{exp.title}</h3>
                {formatDateRange(exp.start_date, exp.end_date, exp.current) && (
                  <span className="text-sm text-gray-600">
                    {formatDateRange(exp.start_date, exp.end_date, exp.current)}
                  </span>
                )}
              </div>
              <p className="text-sm text-gray-700 font-medium">{exp.company}{exp.location ? ` | ${exp.location}` : ''}</p>
              {exp.achievements && exp.achievements.length > 0 ? (
                <ul className="list-disc list-inside mt-2 text-sm text-gray-700 space-y-1">
                  {exp.achievements.map((achievement, aIdx) => (
                    <li key={aIdx}>{achievement}</li>
                  ))}
                </ul>
              ) : (
                <p className="mt-2 text-sm text-gray-700">{exp.description}</p>
              )}
            </div>
          ))}
        </div>
      </section>
    )}

    {/* Education */}
    {cv.education.length > 0 && (
      <section className="mb-6">
        <SectionHeader title="Education" />
        <div className="space-y-3">
          {cv.education.map((edu, idx) => (
            <div key={idx}>
              <div className="flex justify-between items-baseline flex-wrap gap-2">
                <h3 className="text-base font-semibold text-gray-900">
                  {edu.degree}{edu.field_of_study ? ` in ${edu.field_of_study}` : ''}
                </h3>
                {formatDateRange(edu.start_date, edu.end_date) && (
                  <span className="text-sm text-gray-600">
                    {formatDateRange(edu.start_date, edu.end_date)}
                  </span>
                )}
              </div>
              <p className="text-sm text-gray-700">{edu.institution}{edu.location ? ` | ${edu.location}` : ''}</p>
              {edu.gpa && <p className="text-sm text-gray-600 mt-1">GPA: {edu.gpa}</p>}
              {edu.description && <p className="text-sm text-gray-600 mt-1">{edu.description}</p>}
            </div>
          ))}
        </div>
      </section>
    )}

    {/* Skills */}
    {cv.skills.length > 0 && (
      <section className="mb-6">
        <SectionHeader title="Skills" />
        <div className="space-y-2">
          {Object.entries(
            cv.skills.reduce((acc, skill) => {
              const cat = skill.category || 'Other';
              if (!acc[cat]) acc[cat] = [];
              acc[cat].push(skill.name);
              return acc;
            }, {} as Record<string, string[]>)
          ).map(([category, skills], idx) => (
            <p key={idx} className="text-sm text-gray-700">
              <span className="font-semibold">{category}:</span> {skills.join(', ')}
            </p>
          ))}
        </div>
      </section>
    )}

    {/* Projects */}
    {cv.projects && cv.projects.length > 0 && (
      <section className="mb-6">
        <SectionHeader title="Projects" />
        <div className="space-y-3">
          {cv.projects.map((project, idx) => (
            <div key={idx}>
              <div className="flex items-baseline gap-2 flex-wrap">
                <h3 className="text-base font-semibold text-gray-900">{project.name}</h3>
                {project.url && (
                  <a href={project.url} target="_blank" rel="noopener noreferrer" 
                     className="text-xs text-indigo-600 hover:underline">[Live]</a>
                )}
                {project.github_url && (
                  <a href={project.github_url} target="_blank" rel="noopener noreferrer"
                     className="text-xs text-indigo-600 hover:underline">[GitHub]</a>
                )}
              </div>
              <p className="text-sm text-gray-700 mt-1">{project.description}</p>
              {project.technologies.length > 0 && (
                <p className="text-sm text-gray-600 mt-1">
                  <span className="font-medium">Tech:</span> {project.technologies.join(', ')}
                </p>
              )}
            </div>
          ))}
        </div>
      </section>
    )}

    {/* Certifications */}
    {cv.certifications.length > 0 && (
      <section className="mb-6">
        <SectionHeader title="Certifications" />
        <ul className="space-y-1">
          {cv.certifications.map((cert, idx) => (
            <li key={idx} className="text-sm text-gray-700">
              <span className="font-medium">{cert.name}</span> – {cert.issuer} ({formatDate(cert.date)})
              {cert.url && (
                <a href={cert.url} target="_blank" rel="noopener noreferrer"
                   className="ml-2 text-indigo-600 hover:underline text-xs">[View]</a>
              )}
            </li>
          ))}
        </ul>
      </section>
    )}

    {/* Languages */}
    {cv.languages.length > 0 && (
      <section>
        <SectionHeader title="Languages" />
        <p className="text-sm text-gray-700">
          {cv.languages.map(lang => `${lang.name} (${lang.proficiency})`).join(', ')}
        </p>
      </section>
    )}
  </div>
);

// =============================================================================
// TECH-FOCUSED TEMPLATE
// Ideal for: Software Engineers, DevOps, Backend/Frontend developers
// Matches: SoftwareEngineerFull preview style
// =============================================================================

export const TechFocusedTemplate: React.FC<TemplateProps> = ({ cv }) => (
  <div className="bg-white shadow-lg rounded-lg p-6 md:p-8 max-w-[8.5in] mx-auto font-sans leading-relaxed">
    {/* Header with border-bottom accent */}
    <header className="border-b-2 border-indigo-500 pb-4 mb-5">
      <h1 className="text-2xl md:text-3xl font-bold text-gray-800">{cv.personal_info.full_name}</h1>
      <p className="text-indigo-600 font-medium">
        {cv.target_role || cv.experience[0]?.title || 'Software Engineer'}
      </p>
      <div className="flex flex-wrap gap-3 text-gray-500 text-sm mt-2">
        {cv.personal_info.email && <span>📧 {cv.personal_info.email}</span>}
        {cv.personal_info.phone && <span>📱 {cv.personal_info.phone}</span>}
        {cv.personal_info.github_url && (
          <a href={cv.personal_info.github_url} className="text-indigo-600 hover:underline">🔗 GitHub</a>
        )}
        {cv.personal_info.linkedin_url && (
          <a href={cv.personal_info.linkedin_url} className="text-indigo-600 hover:underline">💼 LinkedIn</a>
        )}
        {(cv.personal_info.city || cv.personal_info.address) && (
          <span>📍 {cv.personal_info.city || cv.personal_info.address}</span>
        )}
      </div>
    </header>

    {/* Summary */}
    {cv.personal_info.summary && (
      <section className="mb-5">
        <h2 className="text-sm md:text-base font-bold text-indigo-600 mb-2 uppercase tracking-wide">Summary</h2>
        <p className="text-gray-700 text-sm leading-relaxed">{cv.personal_info.summary}</p>
      </section>
    )}

    {/* Technical Skills */}
    {cv.skills.length > 0 && (
      <section className="mb-5">
        <h2 className="text-sm md:text-base font-bold text-indigo-600 mb-2 uppercase tracking-wide">Technical Skills</h2>
        <div className="flex flex-wrap gap-2 items-start">
          {cv.skills.map((skill, idx) => (
            <span key={idx} className="px-3 py-1.5 bg-indigo-50 text-indigo-700 rounded-full text-xs font-medium border border-indigo-200 whitespace-nowrap">
              {skill.name}
            </span>
          ))}
        </div>
      </section>
    )}

    {/* Experience */}
    {cv.experience.length > 0 && (
      <section className="mb-5">
        <h2 className="text-sm md:text-base font-bold text-indigo-600 mb-2 uppercase tracking-wide">Experience</h2>
        <div className="space-y-4">
          {cv.experience.map((exp, idx) => (
            <div key={idx} className="border-l-2 border-indigo-200 pl-4">
              <div className="flex justify-between items-start flex-wrap gap-1">
                <div>
                  <h3 className="font-semibold text-gray-800 text-sm">{exp.title}</h3>
                  <p className="text-indigo-600 text-xs">{exp.company}</p>
                </div>
                {formatDateRange(exp.start_date, exp.end_date, exp.current) && (
                  <span className="text-gray-500 text-xs">
                    {formatDateRange(exp.start_date, exp.end_date, exp.current)}
                  </span>
                )}
              </div>
              {exp.achievements && exp.achievements.length > 0 ? (
                <ul className="mt-1 text-gray-600 text-xs space-y-0.5 list-disc list-inside">
                  {exp.achievements.map((achievement, aIdx) => (
                    <li key={aIdx}>{achievement}</li>
                  ))}
                </ul>
              ) : exp.description && (
                <p className="mt-1 text-gray-600 text-xs">{exp.description}</p>
              )}
            </div>
          ))}
        </div>
      </section>
    )}

    {/* Education */}
    {cv.education.length > 0 && (
      <section className="mb-5">
        <h2 className="text-sm md:text-base font-bold text-indigo-600 mb-2 uppercase tracking-wide">Education</h2>
        <div className="space-y-2">
          {cv.education.map((edu, idx) => (
            <div key={idx} className="flex justify-between flex-wrap gap-1">
              <div>
                <h3 className="font-semibold text-gray-800 text-sm">
                  {edu.degree}{edu.field_of_study ? ` in ${edu.field_of_study}` : ''}
                </h3>
                <p className="text-gray-600 text-xs">{edu.institution}</p>
              </div>
              {formatDateRange(edu.start_date, edu.end_date) && (
                <span className="text-gray-500 text-xs">
                  {formatDateRange(edu.start_date, edu.end_date)}
                </span>
              )}
            </div>
          ))}
        </div>
      </section>
    )}

    {/* Projects */}
    {cv.projects && cv.projects.length > 0 && (
      <section className="mb-5">
        <h2 className="text-sm md:text-base font-bold text-indigo-600 mb-2 uppercase tracking-wide">Projects</h2>
        <div className="space-y-2">
          {cv.projects.map((project, idx) => (
            <div key={idx} className="bg-indigo-50/50 p-2 rounded border-l-2 border-indigo-400">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="font-semibold text-gray-800 text-sm">{project.name}</h3>
                {project.github_url && (
                  <a href={project.github_url} target="_blank" rel="noopener noreferrer"
                     className="text-xs text-indigo-600 hover:underline">[GitHub]</a>
                )}
                {project.url && (
                  <a href={project.url} target="_blank" rel="noopener noreferrer"
                     className="text-xs text-indigo-600 hover:underline">[Live]</a>
                )}
              </div>
              <p className="text-gray-600 text-xs mt-0.5">{project.description}</p>
              {project.technologies.length > 0 && (
                <p className="text-indigo-600 text-xs mt-0.5">{project.technologies.join(' • ')}</p>
              )}
            </div>
          ))}
        </div>
      </section>
    )}

    {/* Languages */}
    {cv.languages.length > 0 && (
      <section className="mb-5">
        <h2 className="text-sm md:text-base font-bold text-indigo-600 mb-2 uppercase tracking-wide">Languages</h2>
        <div className="flex gap-4 text-xs text-gray-600">
          {cv.languages.map((lang, idx) => (
            <span key={idx}>• {lang.name} ({lang.proficiency})</span>
          ))}
        </div>
      </section>
    )}

    {/* Certifications */}
    {cv.certifications.length > 0 && (
      <section>
        <h2 className="text-sm md:text-base font-bold text-indigo-600 mb-2 uppercase tracking-wide">Certifications</h2>
        <ul className="text-gray-600 text-xs space-y-1 list-disc list-inside">
          {cv.certifications.map((cert, idx) => (
            <li key={idx}>{cert.name} - {cert.issuer}</li>
          ))}
        </ul>
      </section>
    )}
  </div>
);

// =============================================================================
// FRESHER / ENTRY-LEVEL TEMPLATE  
// Ideal for: Students, Recent graduates, Career changers
// Matches: FresherFull preview style (centered header, highlighted education box)
// =============================================================================

export const FresherTemplate: React.FC<TemplateProps> = ({ cv }) => (
  <div className="bg-white shadow-lg rounded-lg p-6 md:p-8 max-w-[8.5in] mx-auto font-sans leading-relaxed">
    {/* Header */}
    <header className="text-center mb-6">
      <h1 className="text-2xl md:text-3xl font-bold text-gray-800">{cv.personal_info.full_name}</h1>
      <p className="text-cyan-600 font-medium">
        {cv.target_role || 'Seeking Entry-Level Position'}
      </p>
      <div className="flex justify-center flex-wrap gap-4 text-gray-500 text-xs mt-2">
        {cv.personal_info.email && <span>📧 {cv.personal_info.email}</span>}
        {cv.personal_info.phone && <span>📱 {cv.personal_info.phone}</span>}
        {cv.personal_info.github_url && (
          <a href={cv.personal_info.github_url} className="text-cyan-600 hover:underline">🔗 GitHub</a>
        )}
        {cv.personal_info.linkedin_url && (
          <a href={cv.personal_info.linkedin_url} className="text-cyan-600 hover:underline">💼 LinkedIn</a>
        )}
        {(cv.personal_info.city || cv.personal_info.address) && (
          <span>📍 {cv.personal_info.city || cv.personal_info.address}</span>
        )}
      </div>
    </header>

    {/* Education - Highlighted for Fresher */}
    {cv.education.length > 0 && (
      <section className="bg-cyan-50 rounded-lg p-4 mb-5 border border-cyan-200">
        <h2 className="text-sm md:text-base font-bold text-cyan-700 mb-2 uppercase tracking-wide">🎓 Education</h2>
        {cv.education.map((edu, idx) => (
          <div key={idx} className="mb-2 last:mb-0">
            <div className="flex justify-between flex-wrap gap-1">
              <div>
                <h3 className="font-semibold text-gray-800 text-sm">
                  {edu.degree}{edu.field_of_study ? ` in ${edu.field_of_study}` : ''}
                </h3>
                <p className="text-cyan-600 text-xs">{edu.institution}</p>
              </div>
              {formatDateRange(edu.start_date, edu.end_date) && (
                <span className="text-gray-500 text-xs">
                  {formatDateRange(edu.start_date, edu.end_date)}
                </span>
              )}
            </div>
            <ul className="mt-1 text-gray-600 text-xs space-y-0.5 list-disc list-inside">
              {edu.gpa && <li>GPA: {edu.gpa}</li>}
              {edu.achievements?.map((a, aIdx) => <li key={aIdx}>{a}</li>)}
            </ul>
          </div>
        ))}
      </section>
    )}

    {/* Summary */}
    {cv.personal_info.summary && (
      <section className="mb-5">
        <h2 className="text-sm md:text-base font-bold text-cyan-600 mb-2 uppercase tracking-wide">Summary</h2>
        <p className="text-gray-700 text-xs md:text-sm">{cv.personal_info.summary}</p>
      </section>
    )}

    {/* Skills */}
    {cv.skills.length > 0 && (
      <section className="mb-5">
        <h2 className="text-sm md:text-base font-bold text-cyan-600 mb-2 uppercase tracking-wide">Skills</h2>
        <div className="flex flex-wrap gap-2 items-start">
          {cv.skills.map((skill, idx) => (
            <span key={idx} className="px-3 py-1.5 bg-cyan-50 text-cyan-600 rounded-full text-xs font-medium border border-cyan-200 whitespace-nowrap">
              {skill.name}
            </span>
          ))}
        </div>
      </section>
    )}

    {/* Internship/Experience */}
    {cv.experience.length > 0 && (
      <section className="mb-5">
        <h2 className="text-sm md:text-base font-bold text-cyan-600 mb-2 uppercase tracking-wide">Experience</h2>
        <div className="space-y-3">
          {cv.experience.map((exp, idx) => (
            <div key={idx}>
              <div className="flex justify-between items-start flex-wrap gap-1">
                <div>
                  <h3 className="font-semibold text-gray-800 text-sm">{exp.title}</h3>
                  <p className="text-cyan-600 text-xs">{exp.company}</p>
                </div>
                {formatDateRange(exp.start_date, exp.end_date, exp.current) && (
                  <span className="text-gray-500 text-xs">
                    {formatDateRange(exp.start_date, exp.end_date, exp.current)}
                  </span>
                )}
              </div>
              {exp.achievements && exp.achievements.length > 0 ? (
                <ul className="mt-1 text-gray-600 text-xs space-y-0.5 list-disc list-inside">
                  {exp.achievements.map((achievement, aIdx) => (
                    <li key={aIdx}>{achievement}</li>
                  ))}
                </ul>
              ) : exp.description && (
                <p className="mt-1 text-gray-600 text-xs">{exp.description}</p>
              )}
            </div>
          ))}
        </div>
      </section>
    )}

    {/* Projects */}
    {cv.projects && cv.projects.length > 0 && (
      <section className="mb-5">
        <h2 className="text-sm md:text-base font-bold text-cyan-600 mb-2 uppercase tracking-wide">Projects</h2>
        <div className="space-y-2">
          {cv.projects.map((project, idx) => (
            <div key={idx} className="bg-cyan-50/50 p-2 rounded border-l-2 border-cyan-400">
              <h3 className="font-semibold text-gray-800 text-sm">{project.name}</h3>
              {project.technologies.length > 0 && (
                <p className="text-cyan-600 text-xs">{project.technologies.join(' • ')}</p>
              )}
              <p className="text-gray-600 text-xs mt-0.5">{project.description}</p>
            </div>
          ))}
        </div>
      </section>
    )}

    {/* Languages */}
    {cv.languages.length > 0 && (
      <section className="mb-5">
        <h2 className="text-sm md:text-base font-bold text-cyan-600 mb-2 uppercase tracking-wide">Languages</h2>
        <div className="flex gap-4 text-xs text-gray-600">
          {cv.languages.map((lang, idx) => (
            <span key={idx}>• {lang.name} ({lang.proficiency})</span>
          ))}
        </div>
      </section>
    )}

    {/* Certifications */}
    {cv.certifications.length > 0 && (
      <section>
        <h2 className="text-sm md:text-base font-bold text-cyan-600 mb-2 uppercase tracking-wide">Certifications</h2>
        <ul className="text-gray-600 text-xs space-y-1 list-disc list-inside">
          {cv.certifications.map((cert, idx) => (
            <li key={idx}>{cert.name} - {cert.issuer}</li>
          ))}
        </ul>
      </section>
    )}
  </div>
);

// =============================================================================
// DATA SCIENCE / ML TEMPLATE
// Ideal for: Data Scientists, ML Engineers, Data Analysts
// Matches: DataScientistFull preview style (purple border-left accent, skill bars)
// =============================================================================

export const DataScienceTemplate: React.FC<TemplateProps> = ({ cv }) => (
  <div className="bg-white shadow-lg rounded-lg p-6 md:p-8 max-w-[8.5in] mx-auto font-sans leading-relaxed">
    {/* Header with accent */}
    <header className="border-l-4 border-purple-500 pl-4 mb-6">
      <h1 className="text-xl md:text-2xl font-bold text-gray-800">{cv.personal_info.full_name}</h1>
      <p className="text-purple-600 font-medium">
        {cv.target_role || cv.experience[0]?.title || 'Data Scientist'}
      </p>
      <div className="flex flex-wrap gap-3 text-gray-500 text-xs mt-2">
        {cv.personal_info.email && <span>📧 {cv.personal_info.email}</span>}
        {cv.personal_info.phone && <span>📱 {cv.personal_info.phone}</span>}
        {cv.personal_info.github_url && (
          <a href={cv.personal_info.github_url} className="text-purple-600 hover:underline">🔗 GitHub</a>
        )}
        {cv.personal_info.linkedin_url && (
          <a href={cv.personal_info.linkedin_url} className="text-purple-600 hover:underline">💼 LinkedIn</a>
        )}
        {(cv.personal_info.city || cv.personal_info.address) && (
          <span>📍 {cv.personal_info.city || cv.personal_info.address}</span>
        )}
      </div>
    </header>

    {/* Summary */}
    {cv.personal_info.summary && (
      <section className="bg-purple-50 rounded-lg p-4 mb-5">
        <p className="text-gray-700 text-xs md:text-sm">{cv.personal_info.summary}</p>
      </section>
    )}

    {/* Tools & Proficiency */}
    {cv.skills.length > 0 && (
      <section className="mb-5">
        <h2 className="text-sm md:text-base font-bold text-purple-600 mb-3 uppercase tracking-wide">Tools & Technologies</h2>
        <div className="grid grid-cols-2 gap-2">
          {cv.skills.slice(0, 8).map((skill, idx) => (
            <div key={idx} className="flex items-center gap-2">
              <span className="text-xs text-gray-600 w-24 truncate">{skill.name}</span>
              <div className="flex-1 bg-purple-100 rounded-full h-2">
                <div className="bg-purple-500 h-2 rounded-full" style={{ width: `${Math.min((skill.level || 4) * 20, 100)}%` }}></div>
              </div>
            </div>
          ))}
        </div>
      </section>
    )}

    {/* Experience */}
    {cv.experience.length > 0 && (
      <section className="mb-5">
        <h2 className="text-sm md:text-base font-bold text-purple-600 mb-2 uppercase tracking-wide">Experience</h2>
        <div className="space-y-3">
          {cv.experience.map((exp, idx) => (
            <div key={idx}>
              <div className="flex justify-between items-start flex-wrap gap-1">
                <div>
                  <h3 className="font-semibold text-gray-800 text-sm">{exp.title}</h3>
                  <p className="text-purple-600 text-xs">{exp.company}</p>
                </div>
                {formatDateRange(exp.start_date, exp.end_date, exp.current) && (
                  <span className="text-gray-500 text-xs">
                    {formatDateRange(exp.start_date, exp.end_date, exp.current)}
                  </span>
                )}
              </div>
              {exp.achievements && exp.achievements.length > 0 ? (
                <ul className="mt-1 text-gray-600 text-xs space-y-0.5 list-disc list-inside">
                  {exp.achievements.map((achievement, aIdx) => (
                    <li key={aIdx}>{achievement}</li>
                  ))}
                </ul>
              ) : exp.description && (
                <p className="mt-1 text-gray-600 text-xs">{exp.description}</p>
              )}
            </div>
          ))}
        </div>
      </section>
    )}

    {/* Projects */}
    {cv.projects && cv.projects.length > 0 && (
      <section className="mb-5">
        <h2 className="text-sm md:text-base font-bold text-purple-600 mb-2 uppercase tracking-wide">Projects</h2>
        <div className="space-y-2">
          {cv.projects.map((project, idx) => (
            <div key={idx} className="border-l-2 border-purple-300 pl-3">
              <h3 className="font-semibold text-gray-800 text-sm">{project.name}</h3>
              <p className="text-gray-600 text-xs mt-0.5">{project.description}</p>
              {project.technologies.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-1">
                  {project.technologies.map((tech, tIdx) => (
                    <span key={tIdx} className="text-xs bg-purple-50 text-purple-700 px-1.5 py-0.5 rounded">
                      {tech}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>
    )}

    {/* Education */}
    {cv.education.length > 0 && (
      <section className="mb-5">
        <h2 className="text-sm md:text-base font-bold text-purple-600 mb-2 uppercase tracking-wide">Education</h2>
        <div className="space-y-2">
          {cv.education.map((edu, idx) => (
            <div key={idx} className="flex justify-between flex-wrap gap-1">
              <div>
                <h3 className="font-semibold text-gray-800 text-sm">
                  {edu.degree}{edu.field_of_study ? `, ${edu.field_of_study}` : ''}
                </h3>
                <p className="text-gray-600 text-xs">{edu.institution}</p>
              </div>
              {formatDateRange(edu.start_date, edu.end_date) && (
                <span className="text-gray-500 text-xs">{formatDateRange(edu.start_date, edu.end_date)}</span>
              )}
            </div>
          ))}
        </div>
      </section>
    )}

    {/* Languages */}
    {cv.languages.length > 0 && (
      <section className="mb-5">
        <h2 className="text-sm md:text-base font-bold text-purple-600 mb-2 uppercase tracking-wide">Languages</h2>
        <div className="flex gap-4 text-xs text-gray-600">
          {cv.languages.map((lang, idx) => (
            <span key={idx}>• {lang.name} ({lang.proficiency})</span>
          ))}
        </div>
      </section>
    )}

    {/* Certifications */}
    {cv.certifications.length > 0 && (
      <section>
        <h2 className="text-sm md:text-base font-bold text-purple-600 mb-2 uppercase tracking-wide">Certifications</h2>
        <ul className="text-gray-600 text-xs space-y-1 list-disc list-inside">
          {cv.certifications.map((cert, idx) => (
            <li key={idx}>{cert.name} - {cert.issuer}</li>
          ))}
        </ul>
      </section>
    )}
  </div>
);

// =============================================================================
// MINIMAL MODERN TEMPLATE (Product Manager style)
// Ideal for: Product Managers, Business professionals
// Matches: ProductManagerFull preview style (centered header, metrics boxes)
// =============================================================================

export const MinimalTemplate: React.FC<TemplateProps> = ({ cv }) => (
  <div className="bg-white shadow rounded p-6 md:p-8 max-w-[8.5in] mx-auto font-sans text-gray-800 leading-relaxed">
    {/* Header */}
    <header className="text-center border-b-2 border-orange-200 pb-4 mb-5">
      <h1 className="text-2xl md:text-3xl font-bold text-gray-800">{cv.personal_info.full_name}</h1>
      <p className="text-orange-600 font-medium">
        {cv.target_role || cv.experience[0]?.title || 'Professional'}
      </p>
      <div className="flex justify-center flex-wrap gap-4 text-gray-500 text-xs mt-2">
        {cv.personal_info.email && <span>📧 {cv.personal_info.email}</span>}
        {cv.personal_info.phone && <span>📱 {cv.personal_info.phone}</span>}
        {cv.personal_info.linkedin_url && (
          <a href={cv.personal_info.linkedin_url} className="text-orange-600 hover:underline">🔗 LinkedIn</a>
        )}
        {(cv.personal_info.city || cv.personal_info.address) && (
          <span>📍 {cv.personal_info.city || cv.personal_info.address}</span>
        )}
      </div>
    </header>

    {/* Summary */}
    {cv.personal_info.summary && (
      <section className="mb-5">
        <h2 className="text-sm md:text-base font-bold text-orange-600 mb-2 uppercase tracking-wide">Summary</h2>
        <p className="text-gray-700 text-xs md:text-sm">{cv.personal_info.summary}</p>
      </section>
    )}

    {/* Skills */}
    {cv.skills.length > 0 && (
      <section className="mb-5">
        <h2 className="text-sm md:text-base font-bold text-orange-600 mb-2 uppercase tracking-wide">Skills</h2>
        <div className="flex flex-wrap gap-2 items-start">
          {cv.skills.map((skill, idx) => (
            <span key={idx} className="px-3 py-1.5 bg-orange-50 text-orange-600 rounded-full text-xs font-medium border border-orange-200 whitespace-nowrap">
              {skill.name}
            </span>
          ))}
        </div>
      </section>
    )}

    {/* Experience */}
    {cv.experience.length > 0 && (
      <section className="mb-5">
        <h2 className="text-sm md:text-base font-bold text-orange-600 mb-2 uppercase tracking-wide">Experience</h2>
        <div className="space-y-3">
          {cv.experience.map((exp, idx) => (
            <div key={idx}>
              <div className="flex justify-between items-start flex-wrap gap-1">
                <div>
                  <h3 className="font-semibold text-gray-800 text-sm">{exp.title}</h3>
                  <p className="text-orange-600 text-xs">{exp.company}</p>
                </div>
                {formatDateRange(exp.start_date, exp.end_date, exp.current) && (
                  <span className="text-gray-500 text-xs">
                    {formatDateRange(exp.start_date, exp.end_date, exp.current)}
                  </span>
                )}
              </div>
              {exp.achievements && exp.achievements.length > 0 ? (
                <ul className="mt-1 text-gray-600 text-xs space-y-0.5 list-disc list-inside">
                  {exp.achievements.map((achievement, aIdx) => (
                    <li key={aIdx}>{achievement}</li>
                  ))}
                </ul>
              ) : exp.description && (
                <p className="mt-1 text-gray-600 text-xs">{exp.description}</p>
              )}
            </div>
          ))}
        </div>
      </section>
    )}

    {/* Education */}
    {cv.education.length > 0 && (
      <section className="mb-5">
        <h2 className="text-sm md:text-base font-bold text-orange-600 mb-2 uppercase tracking-wide">Education</h2>
        <div className="space-y-2">
          {cv.education.map((edu, idx) => (
            <div key={idx} className="flex justify-between flex-wrap gap-1">
              <div>
                <h3 className="font-semibold text-gray-800 text-sm">
                  {edu.degree}{edu.field_of_study ? ` in ${edu.field_of_study}` : ''}
                </h3>
                <p className="text-gray-600 text-xs">{edu.institution}</p>
              </div>
              {formatDateRange(edu.start_date, edu.end_date) && (
                <span className="text-gray-500 text-xs">
                  {formatDateRange(edu.start_date, edu.end_date)}
                </span>
              )}
            </div>
          ))}
        </div>
      </section>
    )}

    {/* Projects */}
    {cv.projects && cv.projects.length > 0 && (
      <section className="mb-5">
        <h2 className="text-sm md:text-base font-bold text-orange-600 mb-2 uppercase tracking-wide">Projects</h2>
        <div className="space-y-2">
          {cv.projects.map((project, idx) => (
            <div key={idx}>
              <span className="text-sm font-medium text-gray-900">{project.name}</span>
              <span className="text-sm text-gray-500"> – {project.description}</span>
            </div>
          ))}
        </div>
      </section>
    )}

    {/* Languages */}
    {cv.languages.length > 0 && (
      <section className="mb-5">
        <h2 className="text-sm md:text-base font-bold text-orange-600 mb-2 uppercase tracking-wide">Languages</h2>
        <div className="flex gap-4 text-xs text-gray-600">
          {cv.languages.map((lang, idx) => (
            <span key={idx}>• {lang.name} ({lang.proficiency})</span>
          ))}
        </div>
      </section>
    )}

    {/* Certifications */}
    {cv.certifications.length > 0 && (
      <section>
        <h2 className="text-sm md:text-base font-bold text-orange-600 mb-2 uppercase tracking-wide">Certifications</h2>
        <ul className="text-gray-600 text-xs space-y-1 list-disc list-inside">
          {cv.certifications.map((cert, idx) => (
            <li key={idx}>{cert.name} - {cert.issuer}</li>
          ))}
        </ul>
      </section>
    )}
  </div>
);

// =============================================================================
// IMPORT ADDITIONAL TEMPLATES
// =============================================================================

import { ExecutiveTemplate, CreativeTemplate, FreelancerTemplate, AIMLTemplate } from './additional';

// =============================================================================
// TEMPLATE REGISTRY
// =============================================================================

export const TEMPLATE_COMPONENTS: Record<string, React.FC<TemplateProps>> = {
  'professional': ProfessionalTemplate,
  'classic-professional': ProfessionalTemplate,
  'tech-focused': TechFocusedTemplate,
  'software-engineer': TechFocusedTemplate,
  'fresher': FresherTemplate,
  'entry-level': FresherTemplate,
  'data-scientist': DataScienceTemplate,
  'data-science': DataScienceTemplate,
  'ai-ml-engineer': AIMLTemplate,
  'ai-ml': AIMLTemplate,
  'minimal': MinimalTemplate,
  'modern-minimal': MinimalTemplate,
  'executive': ExecutiveTemplate,
  'creative': CreativeTemplate,
  'creative-bold': CreativeTemplate,
  'designer': CreativeTemplate,
  'freelancer': FreelancerTemplate,
  'consultant': FreelancerTemplate,
};

// Default template selector
export const getTemplateComponent = (templateName: string): React.FC<TemplateProps> => {
  return TEMPLATE_COMPONENTS[templateName] || ProfessionalTemplate;
};

// Template metadata for UI
export const TEMPLATE_INFO = [
  // === Engineering & Tech ===
  {
    id: 'software-engineer',
    name: 'Software Engineer',
    description: 'Skills-first layout optimized for software engineering roles',
    roles: ['software-engineer', 'devops', 'backend', 'frontend', 'full-stack'],
    atsScore: 94,
    preview: '💻',
    category: 'Engineering & Tech',
  },
  {
    id: 'mobile-app-developer',
    name: 'Mobile App Developer',
    description: 'Showcases app projects and mobile development expertise',
    roles: ['mobile-app-developer', 'ios-developer', 'android-developer'],
    atsScore: 93,
    preview: '📱',
    category: 'Engineering & Tech',
  },
  {
    id: 'qa-engineer',
    name: 'QA Engineer',
    description: 'Highlights testing methodologies and quality assurance skills',
    roles: ['qa-engineer', 'test-engineer', 'sdet'],
    atsScore: 92,
    preview: '🔍',
    category: 'Engineering & Tech',
  },
  {
    id: 'systems-engineer',
    name: 'Systems Engineer',
    description: 'Infrastructure and DevOps focused with certifications emphasis',
    roles: ['systems-engineer', 'devops', 'infrastructure', 'cloud-engineer'],
    atsScore: 93,
    preview: '🖥️',
    category: 'Engineering & Tech',
  },
  
  // === Data & Analytics ===
  {
    id: 'data-scientist',
    name: 'Data Scientist',
    description: 'ML/AI projects first with technical skills emphasis',
    roles: ['data-scientist', 'ml-engineer'],
    atsScore: 94,
    preview: '📊',
    category: 'Data & Analytics',
  },
  {
    id: 'data-analyst',
    name: 'Data Analyst',
    description: 'Analytics tools and business insights focused',
    roles: ['data-analyst', 'business-analyst', 'bi-analyst'],
    atsScore: 93,
    preview: '📈',
    category: 'Data & Analytics',
  },
  {
    id: 'research-analyst',
    name: 'Research Analyst',
    description: 'Publications and research methodology emphasis',
    roles: ['research-analyst', 'market-researcher', 'ux-researcher'],
    atsScore: 92,
    preview: '🔬',
    category: 'Data & Analytics',
  },
  {
    id: 'ai-ml-engineer',
    name: 'AI/ML Engineer',
    description: 'Research and project-focused for AI and ML specialists',
    roles: ['ai-ml-engineer', 'ml-researcher', 'deep-learning'],
    atsScore: 94,
    preview: '🤖',
    category: 'Data & Analytics',
  },
  
  // === Management ===
  {
    id: 'product-manager',
    name: 'Product Manager',
    description: 'Strategy and impact metrics focused for product leaders',
    roles: ['product-manager', 'product-owner', 'pm'],
    atsScore: 94,
    preview: '🎯',
    category: 'Management',
  },
  {
    id: 'project-manager',
    name: 'Project Manager',
    description: 'Delivery track record and certifications emphasis',
    roles: ['project-manager', 'scrum-master', 'agile-coach'],
    atsScore: 93,
    preview: '📋',
    category: 'Management',
  },
  {
    id: 'program-manager',
    name: 'Program Manager',
    description: 'Large-scale initiative and cross-functional leadership',
    roles: ['program-manager', 'portfolio-manager'],
    atsScore: 94,
    preview: '🗂️',
    category: 'Management',
  },
  {
    id: 'operations-manager',
    name: 'Operations Manager',
    description: 'Process optimization and efficiency metrics focused',
    roles: ['operations-manager', 'ops-manager', 'supply-chain'],
    atsScore: 92,
    preview: '⚙️',
    category: 'Management',
  },
  
  // === Business & Finance ===
  {
    id: 'financial-analyst',
    name: 'Financial Analyst',
    description: 'Financial modeling and analysis skills emphasis',
    roles: ['financial-analyst', 'investment-analyst', 'equity-analyst'],
    atsScore: 93,
    preview: '💹',
    category: 'Business & Finance',
  },
  {
    id: 'accountant',
    name: 'Accountant',
    description: 'Certifications and compliance experience focused',
    roles: ['accountant', 'cpa', 'auditor', 'tax-accountant'],
    atsScore: 94,
    preview: '🧮',
    category: 'Business & Finance',
  },
  {
    id: 'sales-executive',
    name: 'Sales Executive',
    description: 'Revenue achievements and client relationships first',
    roles: ['sales-executive', 'account-executive', 'sales-manager'],
    atsScore: 92,
    preview: '💰',
    category: 'Business & Finance',
  },
  {
    id: 'business-development',
    name: 'Business Development',
    description: 'Growth metrics and partnership achievements emphasis',
    roles: ['business-development', 'bd-manager', 'partnerships'],
    atsScore: 93,
    preview: '🚀',
    category: 'Business & Finance',
  },
  
  // === Marketing & Content ===
  {
    id: 'content-writer',
    name: 'Content Writer',
    description: 'Portfolio and writing samples emphasis',
    roles: ['content-writer', 'copywriter', 'editor', 'journalist'],
    atsScore: 91,
    preview: '✍️',
    category: 'Marketing & Content',
  },
  {
    id: 'social-media-manager',
    name: 'Social Media Manager',
    description: 'Campaign metrics and growth achievements focused',
    roles: ['social-media-manager', 'community-manager', 'digital-marketing'],
    atsScore: 90,
    preview: '📣',
    category: 'Marketing & Content',
  },
  {
    id: 'seo-specialist',
    name: 'SEO Specialist',
    description: 'Technical SEO and ranking achievements emphasis',
    roles: ['seo-specialist', 'seo-manager', 'sem-specialist'],
    atsScore: 91,
    preview: '🔎',
    category: 'Marketing & Content',
  },
  
  // === Creative ===
  {
    id: 'graphic-designer',
    name: 'Graphic Designer',
    description: 'Visual portfolio and tool proficiency focused',
    roles: ['graphic-designer', 'visual-designer', 'brand-designer'],
    atsScore: 89,
    preview: '🎨',
    category: 'Creative',
  },
  {
    id: 'video-editor',
    name: 'Video Editor',
    description: 'Video portfolio and production skills emphasis',
    roles: ['video-editor', 'motion-designer', 'videographer'],
    atsScore: 88,
    preview: '🎬',
    category: 'Creative',
  },
  
  // === Healthcare & Science ===
  {
    id: 'healthcare-admin',
    name: 'Healthcare Admin',
    description: 'Compliance and healthcare systems experience',
    roles: ['healthcare-admin', 'medical-office', 'health-informatics'],
    atsScore: 92,
    preview: '🏥',
    category: 'Healthcare & Science',
  },
  {
    id: 'clinical-research',
    name: 'Clinical Research',
    description: 'Research protocols and regulatory experience focus',
    roles: ['clinical-research', 'cra', 'clinical-coordinator'],
    atsScore: 93,
    preview: '🧬',
    category: 'Healthcare & Science',
  },
  
  // === HR & Admin ===
  {
    id: 'hr-manager',
    name: 'HR Manager',
    description: 'People programs and organizational development focus',
    roles: ['hr-manager', 'recruiter', 'talent-acquisition', 'hr-business-partner'],
    atsScore: 92,
    preview: '👥',
    category: 'HR & Admin',
  },
  {
    id: 'legal-assistant',
    name: 'Legal Assistant',
    description: 'Legal research and case management emphasis',
    roles: ['legal-assistant', 'paralegal', 'legal-secretary'],
    atsScore: 91,
    preview: '⚖️',
    category: 'HR & Admin',
  },
  {
    id: 'admin-assistant',
    name: 'Admin Assistant',
    description: 'Organizational and coordination skills focused',
    roles: ['admin-assistant', 'executive-assistant', 'office-manager'],
    atsScore: 90,
    preview: '📁',
    category: 'HR & Admin',
  },
  
  // === Emerging Roles ===
  {
    id: 'ai-prompt-engineer',
    name: 'AI Prompt Engineer',
    description: 'LLM expertise and prompt optimization focused',
    roles: ['ai-prompt-engineer', 'llm-engineer', 'ai-specialist'],
    atsScore: 93,
    preview: '🧠',
    category: 'Emerging Roles',
  },
  {
    id: 'automation-specialist',
    name: 'Automation Specialist',
    description: 'RPA and workflow automation achievements',
    roles: ['automation-specialist', 'rpa-developer', 'process-automation'],
    atsScore: 92,
    preview: '🔧',
    category: 'Emerging Roles',
  },
  {
    id: 'technical-writer',
    name: 'Technical Writer',
    description: 'Documentation portfolio and tools expertise',
    roles: ['technical-writer', 'documentation-specialist', 'api-writer'],
    atsScore: 91,
    preview: '📝',
    category: 'Emerging Roles',
  },
  
  // === General ===
  {
    id: 'fresher',
    name: 'Entry-Level',
    description: 'Education and projects first, perfect for students and new graduates',
    roles: ['fresher', 'intern', 'graduate', 'entry-level'],
    atsScore: 90,
    preview: '🎓',
    category: 'General',
  },
  {
    id: 'executive',
    name: 'Executive',
    description: 'Distinguished format for C-level and senior leadership roles',
    roles: ['executive', 'director', 'vp', 'ceo', 'cto', 'cfo'],
    atsScore: 95,
    preview: '👔',
    category: 'General',
  },
  {
    id: 'freelancer',
    name: 'Freelancer',
    description: 'Client-focused layout for independent consultants',
    roles: ['freelancer', 'consultant', 'self-employed', 'contractor'],
    atsScore: 90,
    preview: '💼',
    category: 'General',
  },
];

// Re-export templates from additional file
export { ExecutiveTemplate, CreativeTemplate, FreelancerTemplate, AIMLTemplate } from './additional';

export default {
  getTemplateComponent,
  TEMPLATE_INFO,
  TEMPLATE_COMPONENTS,
};
