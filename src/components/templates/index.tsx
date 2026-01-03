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
import { CreativeTemplate } from './additional';
import {
  FinancialAnalystTemplate,
  AccountantTemplate,
  MobileAppDeveloperTemplate,
  SystemsEngineerTemplate,
  SalesExecutiveTemplate,
  HRManagerTemplate,
  ProjectManagerTemplate,
  ProductManagerTemplate,
  ContentWriterTemplate,
  SocialMediaManagerTemplate,
  DataAnalystTemplate,
  ResearchAnalystTemplate,
  QAEngineerTemplate,
  AutomationSpecialistTemplate,
  AIPromptEngineerTemplate,
  DesignerTemplate,
  VideoEditorTemplate,
  AdminAssistantTemplate,
  LegalAssistantTemplate,
  HealthcareAdminTemplate,
  ClinicalResearchTemplate,
  BusinessDevelopmentTemplate,
  ConsultantTemplate,
  ProgramManagerTemplate,
  OperationsManagerTemplate,
  SEOSpecialistTemplate,
  TechnicalWriterTemplate,
  FresherTemplate,
  ExecutiveTemplate,
  FreelancerTemplate,
  AIMLTemplate,
  DataScienceTemplate,
  CreativeBoldTemplate
} from './unique_templates';

// =============================================================================
// SHARED COMPONENTS & UTILITIES
// =============================================================================

export interface TemplateProps {
  cv: CV;
  isViewMode?: boolean;
  sectionOrder?: string[];
}

// Color utility to get CSS classes or inline styles based on CV settings
export const getAccentColor = (cv: CV, defaultColor: string = '#4F46E5'): string => {
  if (cv.is_grayscale) return '#374151'; // gray-700
  return cv.accent_color || defaultColor;
};

// Get grayscale-aware text color classes
export const getColorClasses = (cv: CV, colorClass: string, grayscaleClass: string = 'text-gray-700'): string => {
  return cv.is_grayscale ? grayscaleClass : colorClass;
};

// Get grayscale-aware background color classes
export const getBgColorClasses = (cv: CV, colorClass: string, grayscaleClass: string = 'bg-gray-100'): string => {
  return cv.is_grayscale ? grayscaleClass : colorClass;
};

// Default section order
const DEFAULT_SECTION_ORDER = ['summary', 'skills', 'experience', 'education', 'projects', 'certifications', 'languages'];

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

export const ProfessionalTemplate: React.FC<TemplateProps> = ({ cv }) => {
  const accentColor = getAccentColor(cv);
  
  return (
    <div className="bg-white shadow-lg rounded-lg p-8 max-w-[8.5in] mx-auto font-sans leading-relaxed">
      {/* Header */}
      <header className="text-center mb-6 pb-4 border-b-2" style={{ borderColor: accentColor }}>
        {/* Profile Photo */}
        {cv.personal_info.photo_url && (
          <div className="flex justify-center mb-4">
            <img
              src={cv.personal_info.photo_url}
              alt={cv.personal_info.full_name}
              className={`w-24 h-24 rounded-full object-cover border-4 ${cv.is_grayscale ? 'grayscale' : ''}`}
              style={{ borderColor: accentColor }}
            />
          </div>
        )}
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
          {cv.personal_info.full_name}
        </h1>
        <ContactBar personal={cv.personal_info} />
        <SocialLinks personal={cv.personal_info} />
      </header>

      {/* Professional Summary */}
      {cv.personal_info.summary && (
        <section className="mb-6">
          <h2 className="text-lg font-bold text-gray-900 border-b-2 pb-1 mb-4 uppercase tracking-wide" style={{ borderColor: accentColor }}>
            Professional Summary
          </h2>
          <p className="text-gray-700 text-sm leading-relaxed">{cv.personal_info.summary}</p>
        </section>
      )}

      {/* Experience */}
      {cv.experience.length > 0 && (
        <section className="mb-6">
          <h2 className="text-lg font-bold text-gray-900 border-b-2 pb-1 mb-4 uppercase tracking-wide" style={{ borderColor: accentColor }}>
            Experience
          </h2>
          <div className="space-y-4">
            {cv.experience.map((exp, idx) => (
              <div key={idx} className="pb-3">
                <div className="flex justify-between items-baseline flex-wrap gap-2">
                  <h3 className="text-base font-semibold text-gray-900">{exp.title}</h3>
                  {formatDateRange(exp.start_date, exp.end_date, exp.current) && (
                    <span className="text-sm" style={{ color: accentColor }}>
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
          <h2 className="text-lg font-bold text-gray-900 border-b-2 pb-1 mb-4 uppercase tracking-wide" style={{ borderColor: accentColor }}>
            Education
          </h2>
          <div className="space-y-3">
            {cv.education.map((edu, idx) => (
              <div key={idx}>
                <div className="flex justify-between items-baseline flex-wrap gap-2">
                  <h3 className="text-base font-semibold text-gray-900">
                    {edu.degree}{edu.field_of_study ? ` in ${edu.field_of_study}` : ''}
                  </h3>
                  {formatDateRange(edu.start_date, edu.end_date) && (
                    <span className="text-sm" style={{ color: accentColor }}>
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
          <h2 className="text-lg font-bold text-gray-900 border-b-2 pb-1 mb-4 uppercase tracking-wide" style={{ borderColor: accentColor }}>
            Skills
          </h2>
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
                <span className="font-semibold" style={{ color: accentColor }}>{category}:</span> {skills.join(', ')}
              </p>
            ))}
          </div>
        </section>
      )}

      {/* Projects */}
      {cv.projects && cv.projects.length > 0 && (
        <section className="mb-6">
          <h2 className="text-lg font-bold text-gray-900 border-b-2 pb-1 mb-4 uppercase tracking-wide" style={{ borderColor: accentColor }}>
            Projects
          </h2>
          <div className="space-y-3">
            {cv.projects.map((project, idx) => (
              <div key={idx}>
                <div className="flex items-baseline gap-2 flex-wrap">
                  <h3 className="text-base font-semibold text-gray-900">{project.name}</h3>
                  {project.url && (
                    <a href={project.url} target="_blank" rel="noopener noreferrer" 
                       className="text-xs hover:underline" style={{ color: accentColor }}>[Live]</a>
                  )}
                  {project.github_url && (
                    <a href={project.github_url} target="_blank" rel="noopener noreferrer"
                       className="text-xs hover:underline" style={{ color: accentColor }}>[GitHub]</a>
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
          <h2 className="text-lg font-bold text-gray-900 border-b-2 pb-1 mb-4 uppercase tracking-wide" style={{ borderColor: accentColor }}>
            Certifications
          </h2>
          <ul className="space-y-1">
            {cv.certifications.map((cert, idx) => (
              <li key={idx} className="text-sm text-gray-700">
                <span className="font-medium">{cert.name}</span> – {cert.issuer} ({formatDate(cert.date)})
                {cert.url && (
                  <a href={cert.url} target="_blank" rel="noopener noreferrer"
                     className="ml-2 hover:underline text-xs" style={{ color: accentColor }}>[View]</a>
                )}
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Languages */}
      {cv.languages.length > 0 && (
        <section>
          <h2 className="text-lg font-bold text-gray-900 border-b-2 pb-1 mb-4 uppercase tracking-wide" style={{ borderColor: accentColor }}>
            Languages
          </h2>
          <p className="text-sm text-gray-700">
            {cv.languages.map(lang => `${lang.name} (${lang.proficiency})`).join(', ')}
          </p>
        </section>
      )}
    </div>
  );
};

// =============================================================================
// TECH-FOCUSED TEMPLATE
// Ideal for: Software Engineers, DevOps, Backend/Frontend developers
// Matches: SoftwareEngineerFull preview style
// =============================================================================

export const TechFocusedTemplate: React.FC<TemplateProps> = ({ cv }) => {
  const accentColor = getAccentColor(cv);
  const bgTint = cv.is_grayscale ? 'bg-gray-50' : 'bg-indigo-50';
  const borderTint = cv.is_grayscale ? 'border-gray-200' : 'border-indigo-200';
  
  return (
    <div className={`bg-white shadow-lg rounded-lg p-6 md:p-8 max-w-[8.5in] mx-auto font-sans leading-relaxed ${cv.is_grayscale ? 'grayscale' : ''}`}>
      {/* Header with border-bottom accent */}
      <header className="border-b-2 pb-4 mb-5" style={{ borderColor: accentColor }}>
        <div className="flex items-start gap-4">
          {cv.personal_info.photo_url && (
            <img
              src={cv.personal_info.photo_url}
              alt={cv.personal_info.full_name}
              className="w-16 h-16 rounded-lg object-cover border-2"
              style={{ borderColor: accentColor }}
            />
          )}
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800">{cv.personal_info.full_name}</h1>
            <p className="font-medium" style={{ color: accentColor }}>
              {cv.target_role || cv.experience[0]?.title || 'Software Engineer'}
            </p>
          </div>
        </div>
        <div className="flex flex-wrap gap-3 text-gray-500 text-sm mt-2">
          {cv.personal_info.email && <span>📧 {cv.personal_info.email}</span>}
          {cv.personal_info.phone && <span>📱 {cv.personal_info.phone}</span>}
          {cv.personal_info.github_url && (
            <a href={cv.personal_info.github_url} className="hover:underline" style={{ color: accentColor }}>🔗 GitHub</a>
          )}
          {cv.personal_info.linkedin_url && (
            <a href={cv.personal_info.linkedin_url} className="hover:underline" style={{ color: accentColor }}>💼 LinkedIn</a>
          )}
          {(cv.personal_info.city || cv.personal_info.address) && (
            <span>📍 {cv.personal_info.city || cv.personal_info.address}</span>
          )}
        </div>
      </header>

      {/* Summary */}
      {cv.personal_info.summary && (
        <section className="mb-5">
          <h2 className="text-sm md:text-base font-bold mb-2 uppercase tracking-wide" style={{ color: accentColor }}>Summary</h2>
          <p className="text-gray-700 text-sm leading-relaxed">{cv.personal_info.summary}</p>
        </section>
      )}

      {/* Technical Skills */}
      {cv.skills.length > 0 && (
        <section className="mb-5">
          <h2 className="text-sm md:text-base font-bold mb-2 uppercase tracking-wide" style={{ color: accentColor }}>Technical Skills</h2>
          <div className="flex flex-wrap gap-2 items-start">
            {cv.skills.map((skill, idx) => (
              <span 
                key={idx} 
                className={`px-3 py-1.5 rounded-full text-xs font-medium border whitespace-nowrap ${bgTint} ${borderTint}`}
                style={{ color: accentColor }}
              >
                {skill.name}
              </span>
            ))}
          </div>
        </section>
      )}

      {/* Experience */}
      {cv.experience.length > 0 && (
        <section className="mb-5">
          <h2 className="text-sm md:text-base font-bold mb-2 uppercase tracking-wide" style={{ color: accentColor }}>Experience</h2>
          <div className="space-y-4">
            {cv.experience.map((exp, idx) => (
              <div key={idx} className={`border-l-2 pl-4 ${borderTint}`}>
                <div className="flex justify-between items-start flex-wrap gap-1">
                  <div>
                    <h3 className="font-semibold text-gray-800 text-sm">{exp.title}</h3>
                    <p className="text-xs" style={{ color: accentColor }}>{exp.company}</p>
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
          <h2 className="text-sm md:text-base font-bold mb-2 uppercase tracking-wide" style={{ color: accentColor }}>Education</h2>
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
          <h2 className="text-sm md:text-base font-bold mb-2 uppercase tracking-wide" style={{ color: accentColor }}>Projects</h2>
          <div className="space-y-2">
            {cv.projects.map((project, idx) => (
              <div key={idx} className={`${bgTint}/50 p-2 rounded border-l-2`} style={{ borderColor: accentColor }}>
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="font-semibold text-gray-800 text-sm">{project.name}</h3>
                  {project.github_url && (
                    <a href={project.github_url} target="_blank" rel="noopener noreferrer"
                       className="text-xs hover:underline" style={{ color: accentColor }}>[GitHub]</a>
                  )}
                  {project.url && (
                    <a href={project.url} target="_blank" rel="noopener noreferrer"
                       className="text-xs hover:underline" style={{ color: accentColor }}>[Live]</a>
                  )}
                </div>
                <p className="text-gray-600 text-xs mt-0.5">{project.description}</p>
                {project.technologies.length > 0 && (
                  <p className="text-xs mt-0.5" style={{ color: accentColor }}>{project.technologies.join(' • ')}</p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Languages */}
      {cv.languages.length > 0 && (
        <section className="mb-5">
          <h2 className="text-sm md:text-base font-bold mb-2 uppercase tracking-wide" style={{ color: accentColor }}>Languages</h2>
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
          <h2 className="text-sm md:text-base font-bold mb-2 uppercase tracking-wide" style={{ color: accentColor }}>Certifications</h2>
          <ul className="text-gray-600 text-xs space-y-1 list-disc list-inside">
            {cv.certifications.map((cert, idx) => (
              <li key={idx}>{cert.name} - {cert.issuer}</li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
};

// =============================================================================
// MINIMAL MODERN TEMPLATE (Product Manager style)
// Ideal for: Product Managers, Business professionals
// Matches: ProductManagerFull preview style (centered header, metrics boxes)
// =============================================================================

export const MinimalTemplate: React.FC<TemplateProps> = ({ cv }) => {
  const accentColor = getAccentColor(cv, '#EA580C'); // Default orange
  const bgTint = cv.is_grayscale ? 'bg-gray-50' : 'bg-orange-50';
  const borderTint = cv.is_grayscale ? 'border-gray-200' : 'border-orange-200';
  
  return (
    <div className={`bg-white shadow rounded p-6 md:p-8 max-w-[8.5in] mx-auto font-sans text-gray-800 leading-relaxed ${cv.is_grayscale ? 'grayscale' : ''}`}>
      {/* Header */}
      <header className="text-center border-b-2 pb-4 mb-5" style={{ borderColor: cv.is_grayscale ? '#E5E7EB' : accentColor + '40' }}>
        {cv.personal_info.photo_url && (
          <div className="flex justify-center mb-3">
            <img
              src={cv.personal_info.photo_url}
              alt={cv.personal_info.full_name}
              className="w-20 h-20 rounded-full object-cover border-4"
              style={{ borderColor: accentColor }}
            />
          </div>
        )}
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800">{cv.personal_info.full_name}</h1>
        <p className="font-medium" style={{ color: accentColor }}>
          {cv.target_role || cv.experience[0]?.title || 'Professional'}
        </p>
        <div className="flex justify-center flex-wrap gap-4 text-gray-500 text-xs mt-2">
          {cv.personal_info.email && <span>📧 {cv.personal_info.email}</span>}
          {cv.personal_info.phone && <span>📱 {cv.personal_info.phone}</span>}
          {cv.personal_info.linkedin_url && (
            <a href={cv.personal_info.linkedin_url} className="hover:underline" style={{ color: accentColor }}>🔗 LinkedIn</a>
          )}
          {(cv.personal_info.city || cv.personal_info.address) && (
            <span>📍 {cv.personal_info.city || cv.personal_info.address}</span>
          )}
        </div>
      </header>

      {/* Summary */}
      {cv.personal_info.summary && (
        <section className="mb-5">
          <h2 className="text-sm md:text-base font-bold mb-2 uppercase tracking-wide" style={{ color: accentColor }}>Summary</h2>
          <p className="text-gray-700 text-xs md:text-sm">{cv.personal_info.summary}</p>
        </section>
      )}

      {/* Skills */}
      {cv.skills.length > 0 && (
        <section className="mb-5">
          <h2 className="text-sm md:text-base font-bold mb-2 uppercase tracking-wide" style={{ color: accentColor }}>Skills</h2>
          <div className="flex flex-wrap gap-2 items-start">
            {cv.skills.map((skill, idx) => (
              <span 
                key={idx} 
                className={`px-3 py-1.5 rounded-full text-xs font-medium border whitespace-nowrap ${bgTint} ${borderTint}`}
                style={{ color: accentColor }}
              >
                {skill.name}
              </span>
            ))}
          </div>
        </section>
      )}

      {/* Experience */}
      {cv.experience.length > 0 && (
        <section className="mb-5">
          <h2 className="text-sm md:text-base font-bold mb-2 uppercase tracking-wide" style={{ color: accentColor }}>Experience</h2>
          <div className="space-y-3">
            {cv.experience.map((exp, idx) => (
              <div key={idx}>
                <div className="flex justify-between items-start flex-wrap gap-1">
                  <div>
                    <h3 className="font-semibold text-gray-800 text-sm">{exp.title}</h3>
                    <p className="text-xs" style={{ color: accentColor }}>{exp.company}</p>
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
          <h2 className="text-sm md:text-base font-bold mb-2 uppercase tracking-wide" style={{ color: accentColor }}>Education</h2>
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
          <h2 className="text-sm md:text-base font-bold mb-2 uppercase tracking-wide" style={{ color: accentColor }}>Projects</h2>
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
          <h2 className="text-sm md:text-base font-bold mb-2 uppercase tracking-wide" style={{ color: accentColor }}>Languages</h2>
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
          <h2 className="text-sm md:text-base font-bold mb-2 uppercase tracking-wide" style={{ color: accentColor }}>Certifications</h2>
          <ul className="text-gray-600 text-xs space-y-1 list-disc list-inside">
            {cv.certifications.map((cert, idx) => (
              <li key={idx}>{cert.name} - {cert.issuer}</li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
};

// =============================================================================
// TEMPLATE REGISTRY
// =============================================================================

export const TEMPLATE_COMPONENTS: Record<string, React.FC<TemplateProps>> = {
  // Professional / Classic
  'professional': ProfessionalTemplate,
  'classic-professional': ProfessionalTemplate,
  
  // Tech / Engineering
  'tech-focused': TechFocusedTemplate,
  'software-engineer': TechFocusedTemplate,
  'mobile-app-developer': MobileAppDeveloperTemplate,
  'qa-engineer': QAEngineerTemplate,
  'systems-engineer': SystemsEngineerTemplate,
  
  // Entry Level / Fresher
  'fresher': FresherTemplate,
  'entry-level': FresherTemplate,
  
  // Data Science / Analytics
  'data-scientist': DataScienceTemplate,
  'data-science': DataScienceTemplate,
  'data-analyst': DataAnalystTemplate,
  'research-analyst': ResearchAnalystTemplate,
  
  // AI/ML
  'ai-ml-engineer': AIMLTemplate,
  'ai-ml': AIMLTemplate,
  
  // Minimal
  'minimal': MinimalTemplate,
  'modern-minimal': MinimalTemplate,
  
  // Executive / Management
  'executive': ExecutiveTemplate,
  'product-manager': ProductManagerTemplate,
  'project-manager': ProjectManagerTemplate,
  'program-manager': ProgramManagerTemplate,
  'operations-manager': OperationsManagerTemplate,
  
  // Creative
  'creative': CreativeTemplate,
  'creative-bold': CreativeBoldTemplate,
  'designer': DesignerTemplate,
  'graphic-designer': DesignerTemplate,
  'video-editor': VideoEditorTemplate,
  'content-writer': ContentWriterTemplate,
  'social-media-manager': SocialMediaManagerTemplate,
  'seo-specialist': SEOSpecialistTemplate,
  
  // Freelancer / Consultant
  'freelancer': FreelancerTemplate,
  'consultant': ConsultantTemplate,
  
  // Business & Finance
  'financial-analyst': FinancialAnalystTemplate,
  'accountant': AccountantTemplate,
  'sales-executive': SalesExecutiveTemplate,
  'business-development': BusinessDevelopmentTemplate,
  
  // Healthcare & Science
  'healthcare-admin': HealthcareAdminTemplate,
  'clinical-research': ClinicalResearchTemplate,
  
  // HR & Admin
  'hr-manager': HRManagerTemplate,
  'legal-assistant': LegalAssistantTemplate,
  'admin-assistant': AdminAssistantTemplate,
  
  // Emerging Roles
  'ai-prompt-engineer': AIPromptEngineerTemplate,
  'automation-specialist': AutomationSpecialistTemplate,
  'technical-writer': TechnicalWriterTemplate,
};

// Default template selector
export const getTemplateComponent = (templateName: string): React.FC<TemplateProps> => {
  return TEMPLATE_COMPONENTS[templateName] || ProfessionalTemplate;
};

// Ordered Template Wrapper - renders sections in specified order
export const OrderedTemplate: React.FC<TemplateProps & { templateName?: string }> = ({ 
  cv, 
  isViewMode, 
  sectionOrder = DEFAULT_SECTION_ORDER,
  templateName = 'professional'
}) => {
  const renderSection = (sectionName: string) => {
    switch (sectionName) {
      case 'summary':
        return cv.personal_info.summary ? (
          <section key="summary" className="mb-6">
            <SectionHeader title="Professional Summary" />
            <p className="text-gray-700 text-sm leading-relaxed">{cv.personal_info.summary}</p>
          </section>
        ) : null;
      
      case 'experience':
        return cv.experience.length > 0 ? (
          <section key="experience" className="mb-6">
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
                    <p className="mt-2 text-sm text-gray-700 whitespace-pre-line">{exp.description}</p>
                  )}
                </div>
              ))}
            </div>
          </section>
        ) : null;
      
      case 'education':
        return cv.education.length > 0 ? (
          <section key="education" className="mb-6">
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
        ) : null;
      
      case 'skills':
        return cv.skills.length > 0 ? (
          <section key="skills" className="mb-6">
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
        ) : null;
      
      case 'projects':
        return cv.projects && cv.projects.length > 0 ? (
          <section key="projects" className="mb-6">
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
        ) : null;
      
      case 'certifications':
        return cv.certifications.length > 0 ? (
          <section key="certifications" className="mb-6">
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
        ) : null;
      
      case 'languages':
        return cv.languages.length > 0 ? (
          <section key="languages" className="mb-6">
            <SectionHeader title="Languages" />
            <p className="text-sm text-gray-700">
              {cv.languages.map(lang => `${lang.name} (${lang.proficiency})`).join(', ')}
            </p>
          </section>
        ) : null;
      
      default:
        return null;
    }
  };

  return (
    <div className="bg-white shadow-lg rounded-lg p-8 max-w-[8.5in] mx-auto font-sans leading-relaxed">
      {/* Header */}
      <header className="text-center mb-6 pb-4 border-b-2 border-gray-800">
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
          {cv.personal_info.full_name}
        </h1>
        <ContactBar personal={cv.personal_info} />
        <SocialLinks personal={cv.personal_info} />
      </header>

      {/* Render sections in specified order */}
      {sectionOrder.map(section => renderSection(section))}
    </div>
  );
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

// Re-export CreativeTemplate from additional file (others are from unique_templates)
export { CreativeTemplate } from './additional';

export default {
  getTemplateComponent,
  TEMPLATE_INFO,
  TEMPLATE_COMPONENTS,
};
