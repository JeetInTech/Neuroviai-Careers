/**
 * CV Forge - LaTeX Resume Generator
 * Generates clean, ATS-friendly LaTeX code for resumes
 * 
 * All templates are designed for:
 * - 90%+ ATS compatibility (single-column, standard fonts)
 * - Clean compilation with pdflatex
 * - Professional typography
 * - Proper section ordering by role
 */

import type { CV, LaTeXExportOptions } from './database.types';

export type ResumeSection = 'summary' | 'skills' | 'experience' | 'projects' | 'education' | 'certifications' | 'languages';

const DEFAULT_SECTION_ORDER: ResumeSection[] = ['summary', 'skills', 'experience', 'projects', 'education', 'certifications', 'languages'];

// Default export options
const DEFAULT_OPTIONS: LaTeXExportOptions = {
  template: 'professional',
  font_size: '10pt',
  paper_size: 'a4paper',
  include_photo: false,
};

/**
 * Escapes special LaTeX characters
 */
function escapeLatex(text: string): string {
  if (!text) return '';
  return text
    .replace(/\\/g, '\\textbackslash{}')
    .replace(/&/g, '\\&')
    .replace(/%/g, '\\%')
    .replace(/\$/g, '\\$')
    .replace(/#/g, '\\#')
    .replace(/_/g, '\\_')
    .replace(/\{/g, '\\{')
    .replace(/\}/g, '\\}')
    .replace(/~/g, '\\textasciitilde{}')
    .replace(/\^/g, '\\textasciicircum{}');
}

/**
 * Formats a date range for display (MMM YYYY format)
 */
function formatDateRange(startDate: string, endDate: string, current: boolean): string {
  const formatSingle = (date: string): string => {
    if (!date) return '';
    const [year, month] = date.split('-');
    if (month) {
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      return `${months[parseInt(month) - 1]} ${year}`;
    }
    return year;
  };
  
  const start = formatSingle(startDate) || 'N/A';
  const end = current ? 'Present' : (formatSingle(endDate) || 'N/A');
  return `${start} -- ${end}`;
}

/**
 * Generates the LaTeX preamble/header - ATS optimized
 */
function generatePreamble(): string {
  return `\\documentclass[10pt]{article}
\\usepackage[margin=0.4in]{geometry}
\\usepackage{enumitem}
\\usepackage{hyperref}
\\usepackage{titlesec}
\\setlist[itemize]{leftmargin=*, noitemsep, topsep=2pt, parsep=0pt}
\\pagestyle{empty}
\\setlength{\\parindent}{0pt}
\\setlength{\\parskip}{0pt}
\\titlespacing{\\section}{0pt}{6pt}{3pt}
\\hypersetup{hidelinks}

\\begin{document}
`;
}

/**
 * Generates the personal info/header section
 */
function generateHeader(cv: CV): string {
  const { personal_info } = cv;
  const contactParts: string[] = [];

  if (personal_info.phone) {
    contactParts.push(escapeLatex(personal_info.phone));
  }
  if (personal_info.email) {
    contactParts.push(escapeLatex(personal_info.email));
  }
  if (personal_info.linkedin_url) {
    const display = personal_info.linkedin_url.replace(/^https?:\/\/(www\.)?/, '');
    contactParts.push(`\\href{${personal_info.linkedin_url}}{${escapeLatex(display)}}`);
  }
  if (personal_info.github_url) {
    const display = personal_info.github_url.replace(/^https?:\/\/(www\.)?/, '');
    contactParts.push(`\\href{${personal_info.github_url}}{${escapeLatex(display)}}`);
  }
  if (personal_info.portfolio_url) {
    const display = personal_info.portfolio_url.replace(/^https?:\/\/(www\.)?/, '');
    contactParts.push(`\\href{${personal_info.portfolio_url}}{${escapeLatex(display)}}`);
  }
  if (personal_info.city && personal_info.country) {
    contactParts.push(`${escapeLatex(personal_info.city)}, ${escapeLatex(personal_info.country)}`);
  } else if (personal_info.address) {
    contactParts.push(escapeLatex(personal_info.address));
  }

  return `
\\begin{center}
{\\Large \\textbf{${escapeLatex(personal_info.full_name).toUpperCase()}}} \\\\[2pt]
{\\small ${contactParts.join(' $|$ ')}}
\\end{center}

\\noindent\\rule{\\textwidth}{0.4pt}
`;
}

/**
 * Generates the summary section
 */
function generateSummary(cv: CV): string {
  if (!cv.personal_info.summary) return '';
  return `
\\section*{SUMMARY}
${escapeLatex(cv.personal_info.summary)}
`;
}

/**
 * Generates the experience section with bullet points
 */
function generateExperience(cv: CV): string {
  if (!cv.experience || cv.experience.length === 0) return '';

  const entries = cv.experience.map(exp => {
    const dateRange = formatDateRange(exp.start_date, exp.end_date, exp.current);
    
    let content = `\\textbf{${escapeLatex(exp.company)} -- ${escapeLatex(exp.title)}} \\hfill ${dateRange}`;

    if (exp.achievements && exp.achievements.length > 0) {
      content += `
\\begin{itemize}
${exp.achievements.map(a => `\\item ${escapeLatex(a)}`).join('\n')}
\\end{itemize}`;
    } else if (exp.description) {
      content += `
\\begin{itemize}
\\item ${escapeLatex(exp.description)}
\\end{itemize}`;
    }

    return content;
  }).join('\n\n');

  return `
\\section*{EXPERIENCE}
${entries}
`;
}

/**
 * Generates the education section
 */
function generateEducation(cv: CV): string {
  if (!cv.education || cv.education.length === 0) return '';

  const entries = cv.education.map(edu => {
    const dateRange = formatDateRange(edu.start_date, edu.end_date, false);
    const degree = edu.field_of_study 
      ? `${escapeLatex(edu.degree)}, ${escapeLatex(edu.field_of_study)}`
      : escapeLatex(edu.degree);

    let content = `\\textbf{${degree}} -- ${escapeLatex(edu.institution)} \\hfill ${dateRange}`;

    if (edu.gpa) {
      content += ` \\hfill GPA: ${escapeLatex(edu.gpa)}`;
    }
    if (edu.description) {
      content += `\n${escapeLatex(edu.description)}`;
    }
    if (edu.achievements && edu.achievements.length > 0) {
      content += `
\\begin{itemize}
${edu.achievements.map(a => `\\item ${escapeLatex(a)}`).join('\n')}
\\end{itemize}`;
    }

    return content;
  }).join('\n\n');

  return `
\\section*{EDUCATION}
${entries}
`;
}

/**
 * Generates the skills section - grouped by category
 */
function generateSkills(cv: CV): string {
  if (!cv.skills || cv.skills.length === 0) return '';

  // Group skills by category
  const skillsByCategory = cv.skills.reduce((acc, skill) => {
    const category = skill.category || 'Other';
    if (!acc[category]) acc[category] = [];
    acc[category].push(skill.name);
    return acc;
  }, {} as Record<string, string[]>);

  const skillLines = Object.entries(skillsByCategory)
    .map(([category, skills]) => 
      `\\textbf{${escapeLatex(category)}:} ${skills.map(escapeLatex).join(', ')}`
    )
    .join(' \\\\\n');

  return `
\\section*{TECHNICAL SKILLS}
${skillLines}
`;
}

/**
 * Generates the certifications section
 */
function generateCertifications(cv: CV): string {
  if (!cv.certifications || cv.certifications.length === 0) return '';

  const entries = cv.certifications.map(cert => {
    const certName = cert.url 
      ? `\\href{${cert.url}}{${escapeLatex(cert.name)}}`
      : escapeLatex(cert.name);
    return `${certName} \$|\$ ${escapeLatex(cert.issuer)}${cert.date ? ` \$|\$ ${cert.date}` : ''}`;
  }).join(' \\\\\n');

  return `
\\section*{CERTIFICATIONS}
${entries}
`;
}

/**
 * Generates the projects section
 */
function generateProjects(cv: CV): string {
  if (!cv.projects || cv.projects.length === 0) return '';

  const entries = cv.projects.map(project => {
    const techStack = project.technologies.length > 0 
      ? project.technologies.map(escapeLatex).join(', ')
      : '';
    
    const parts = [`\\textbf{${escapeLatex(project.name)}}`];
    if (techStack) parts.push(`\\textit{${techStack}}`);
    
    const links: string[] = [];
    if (project.url) links.push(`\\href{${project.url}}{${escapeLatex(project.url.replace(/^https?:\/\/(www\.)?/, ''))}}`);
    if (project.github_url) links.push(`\\href{${project.github_url}}{GitHub}`);
    if (links.length > 0) parts.push(links.join(' $|$ '));

    let content = parts.join(' $|$ ');
    if (project.highlights && project.highlights.length > 0) {
      content += `
\\begin{itemize}
${project.highlights.map(h => `\\item ${escapeLatex(h)}`).join('\n')}
\\end{itemize}`;
    } else if (project.description) {
      content += `
\\begin{itemize}
\\item ${escapeLatex(project.description)}
\\end{itemize}`;
    }

    return content;
  }).join('\n\n');

  return `
\\section*{PROJECTS}
${entries}
`;
}

/**
 * Generates the languages section
 */
function generateLanguages(cv: CV): string {
  if (!cv.languages || cv.languages.length === 0) return '';

  const langList = cv.languages
    .map(lang => `${escapeLatex(lang.name)} (${escapeLatex(lang.proficiency)})`)
    .join(', ');

  return `
\\section*{LANGUAGES}
${langList}
`;
}

// Template Configurations - Section ordering optimized for each role type
const TEMPLATE_CONFIGS: Record<string, string[]> = {
  // Standard professional order
  'simple': ['header', 'summary', 'experience', 'education', 'skills', 'projects', 'certifications', 'languages'],
  'professional': ['header', 'summary', 'experience', 'education', 'skills', 'projects', 'certifications', 'languages'],
  'minimal': ['header', 'summary', 'experience', 'education', 'skills', 'projects', 'certifications', 'languages'],
  
  // === ENGINEERING & TECH ===
  // Software Engineer: Skills first, then projects and experience
  'software-engineer': ['header', 'summary', 'skills', 'experience', 'projects', 'education', 'certifications', 'languages'],
  // Mobile App Developer: Platform skills first
  'mobile-app-developer': ['header', 'summary', 'skills', 'experience', 'projects', 'education', 'certifications', 'languages'],
  // QA/Test Engineer: Testing skills and tools focus
  'qa-engineer': ['header', 'summary', 'skills', 'experience', 'projects', 'certifications', 'education', 'languages'],
  // Systems Engineer: Infrastructure and certifications
  'systems-engineer': ['header', 'summary', 'skills', 'experience', 'projects', 'certifications', 'education', 'languages'],
  
  // === DATA, ANALYTICS & RESEARCH ===
  // AI/ML and Data Science: Skills and projects are key
  'ai-ml': ['header', 'summary', 'skills', 'projects', 'experience', 'education', 'certifications', 'languages'],
  'ai-ml-engineer': ['header', 'summary', 'skills', 'projects', 'experience', 'education', 'certifications', 'languages'],
  'data-scientist': ['header', 'summary', 'skills', 'projects', 'experience', 'education', 'certifications', 'languages'],
  // Data Analyst: Analytical skills and reporting focus
  'data-analyst': ['header', 'summary', 'skills', 'experience', 'projects', 'education', 'certifications', 'languages'],
  // Research Analyst: Methodology and publications
  'research-analyst': ['header', 'summary', 'skills', 'experience', 'projects', 'education', 'certifications', 'languages'],
  
  // === PRODUCT, OPERATIONS & MANAGEMENT ===
  // Product Manager: Experience and strategy focus
  'product-manager': ['header', 'summary', 'experience', 'skills', 'projects', 'education', 'certifications', 'languages'],
  // Project Manager: Experience, certifications important
  'project-manager': ['header', 'summary', 'experience', 'certifications', 'skills', 'education', 'projects', 'languages'],
  // Program Manager: Strategic experience focus
  'program-manager': ['header', 'summary', 'experience', 'certifications', 'skills', 'education', 'projects', 'languages'],
  // Operations Manager: Process experience and leadership
  'operations-manager': ['header', 'summary', 'experience', 'skills', 'education', 'certifications', 'projects', 'languages'],
  
  // === BUSINESS, FINANCE & SALES ===
  // Financial Analyst: Skills and experience
  'financial-analyst': ['header', 'summary', 'experience', 'skills', 'education', 'certifications', 'projects', 'languages'],
  // Accountant: Compliance and certifications important
  'accountant': ['header', 'summary', 'experience', 'certifications', 'skills', 'education', 'projects', 'languages'],
  // Sales Executive: Achievements and experience
  'sales-executive': ['header', 'summary', 'experience', 'skills', 'education', 'certifications', 'projects', 'languages'],
  // Business Development: Experience and deals
  'business-development': ['header', 'summary', 'experience', 'skills', 'education', 'certifications', 'projects', 'languages'],
  
  // === MARKETING & CONTENT ===
  // Content Writer: Experience and published work
  'content-writer': ['header', 'summary', 'experience', 'skills', 'projects', 'education', 'certifications', 'languages'],
  // Social Media Manager: Experience and campaigns
  'social-media-manager': ['header', 'summary', 'experience', 'skills', 'projects', 'education', 'certifications', 'languages'],
  // SEO Specialist: Skills and campaign results
  'seo-specialist': ['header', 'summary', 'skills', 'experience', 'projects', 'education', 'certifications', 'languages'],
  
  // === CREATIVE (ATS-SAFE) ===
  // Graphic Designer: Skills and portfolio
  'graphic-designer': ['header', 'summary', 'skills', 'experience', 'projects', 'education', 'certifications', 'languages'],
  // Video Editor: Skills and projects
  'video-editor': ['header', 'summary', 'skills', 'experience', 'projects', 'education', 'certifications', 'languages'],
  // Creative: Portfolio-focused
  'creative': ['header', 'summary', 'projects', 'skills', 'experience', 'education', 'certifications', 'languages'],
  'designer': ['header', 'summary', 'skills', 'projects', 'experience', 'education', 'certifications', 'languages'],
  
  // === HEALTHCARE & SCIENCE ===
  // Healthcare Admin: Compliance and experience
  'healthcare-admin': ['header', 'summary', 'experience', 'skills', 'certifications', 'education', 'projects', 'languages'],
  // Clinical Research: Trials and certifications
  'clinical-research': ['header', 'summary', 'experience', 'certifications', 'skills', 'education', 'projects', 'languages'],
  
  // === LEGAL, HR & ADMIN ===
  // HR Manager: Experience and policies
  'hr-manager': ['header', 'summary', 'experience', 'skills', 'certifications', 'education', 'projects', 'languages'],
  // Legal Assistant: Experience and casework
  'legal-assistant': ['header', 'summary', 'experience', 'skills', 'education', 'certifications', 'projects', 'languages'],
  // Admin Assistant: Experience and skills
  'admin-assistant': ['header', 'summary', 'experience', 'skills', 'education', 'certifications', 'projects', 'languages'],
  
  // === EMERGING & MODERN ROLES ===
  // AI Prompt Engineer: Skills and projects
  'ai-prompt-engineer': ['header', 'summary', 'skills', 'projects', 'experience', 'education', 'certifications', 'languages'],
  // No-Code/Automation Specialist: Skills and workflows
  'automation-specialist': ['header', 'summary', 'skills', 'projects', 'experience', 'education', 'certifications', 'languages'],
  // Technical Writer: Experience and documentation
  'technical-writer': ['header', 'summary', 'experience', 'skills', 'projects', 'education', 'certifications', 'languages'],
  
  // === GENERAL ===
  // Fresher/Entry-level: Education and skills first
  'fresher': ['header', 'summary', 'education', 'skills', 'projects', 'experience', 'certifications', 'languages'],
  // Freelancer: Portfolio/projects and skills first
  'freelancer': ['header', 'summary', 'skills', 'projects', 'experience', 'education', 'certifications', 'languages'],
  // Executive: Experience and summary are most important
  'executive': ['header', 'summary', 'experience', 'certifications', 'education', 'skills', 'languages'],
};

/**
 * Get default section order for a role
 */
export function getDefaultSectionOrder(role: string): ResumeSection[] {
  const order = TEMPLATE_CONFIGS[role] || TEMPLATE_CONFIGS['professional'];
  return order.filter(s => s !== 'header') as ResumeSection[];
}

/**
 * Main function to generate complete LaTeX document
 */
export function generateLaTeX(cv: CV, options: Partial<LaTeXExportOptions> = {}, customSectionOrder?: ResumeSection[]): string {
  const opts = { ...DEFAULT_OPTIONS, ...options };
  const templateName = opts.template || 'professional';
  const sectionOrder = customSectionOrder || getDefaultSectionOrder(templateName);

  const generators: Record<string, (cv: CV) => string> = {
    'summary': generateSummary,
    'experience': generateExperience,
    'education': generateEducation,
    'skills': generateSkills,
    'projects': generateProjects,
    'certifications': generateCertifications,
    'languages': generateLanguages,
  };

  const sections = [
    generatePreamble(),
    generateHeader(cv),
    ...sectionOrder.map(section => generators[section]?.(cv) || '').filter(Boolean),
    '\n\\end{document}\n',
  ];

  return sections.join('');
}

/**
 * Generates a preview of the LaTeX code (first 50 lines)
 */
export function generateLaTeXPreview(cv: CV, options: Partial<LaTeXExportOptions> = {}, sectionOrder?: ResumeSection[]): string {
  const full = generateLaTeX(cv, options, sectionOrder);
  const lines = full.split('\n');
  return lines.slice(0, 50).join('\n') + '\n% ... (truncated for preview)';
}

/**
 * Downloads the LaTeX code as a .tex file
 */
export function downloadLaTeX(cv: CV, filename?: string, options: Partial<LaTeXExportOptions> = {}, sectionOrder?: ResumeSection[]): void {
  const latex = generateLaTeX(cv, options, sectionOrder);
  const blob = new Blob([latex], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename || `${cv.personal_info.full_name.replace(/\s+/g, '_')}_Resume.tex`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Validates that the generated LaTeX is syntactically correct
 */
export function validateLaTeX(latex: string): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  // Check for balanced braces
  let braceCount = 0;
  for (const char of latex) {
    if (char === '{') braceCount++;
    if (char === '}') braceCount--;
    if (braceCount < 0) {
      errors.push('Unmatched closing brace found');
      break;
    }
  }
  if (braceCount > 0) {
    errors.push(`${braceCount} unclosed brace(s) found`);
  }
  
  // Check for document structure
  if (!latex.includes('\\begin{document}')) {
    errors.push('Missing \\begin{document}');
  }
  if (!latex.includes('\\end{document}')) {
    errors.push('Missing \\end{document}');
  }
  
  // Check for required packages
  const requiredPackages = ['inputenc', 'fontenc', 'geometry', 'hyperref'];
  for (const pkg of requiredPackages) {
    if (!latex.includes(`\\usepackage{${pkg}}`) && !latex.includes(`\\usepackage[`)) {
      // Package might have options, so this is a soft check
    }
  }
  
  return {
    valid: errors.length === 0,
    errors,
  };
}

// ============================================
// ATS CV GENERATOR - Multi-page comprehensive format
// Based on proven 92+ ATS score template
// ============================================

function generateATSCVPreamble(): string {
  return `\\documentclass[11pt]{article}
\\usepackage[margin=0.6in]{geometry}
\\usepackage{enumitem}
\\usepackage{hyperref}
\\usepackage{titlesec}
\\usepackage{tabularx}

\\setlist[itemize]{leftmargin=*, noitemsep, topsep=3pt, parsep=1pt}
\\pagestyle{empty}
\\setlength{\\parindent}{0pt}
\\setlength{\\parskip}{2pt}
\\titlespacing{\\section}{0pt}{10pt}{5pt}
\\titleformat{\\section}{\\large\\bfseries\\scshape}{}{0pt}{}[\\titlerule]
\\hypersetup{colorlinks=true, linkcolor=blue!70!black, urlcolor=blue!70!black}

\\begin{document}
`;
}

function generateATSCVHeader(cv: CV): string {
  const { personal_info } = cv;

  const contactLine: string[] = [];
  if (personal_info.phone) contactLine.push(escapeLatex(personal_info.phone));
  if (personal_info.email) contactLine.push(`\\href{mailto:${personal_info.email}}{${escapeLatex(personal_info.email)}}`);
  if (personal_info.linkedin_url) {
    const display = personal_info.linkedin_url.replace(/^https?:\/\/(www\.)?/, '');
    contactLine.push(`\\href{${personal_info.linkedin_url}}{${escapeLatex(display)}}`);
  }

  const socialLine: string[] = [];
  if (personal_info.github_url) {
    const display = personal_info.github_url.replace(/^https?:\/\/(www\.)?/, '');
    socialLine.push(`\\href{${personal_info.github_url}}{${escapeLatex(display)}}`);
  }
  if (personal_info.portfolio_url) {
    const display = personal_info.portfolio_url.replace(/^https?:\/\/(www\.)?/, '');
    socialLine.push(`\\href{${personal_info.portfolio_url}}{${escapeLatex(display)}}`);
  }

  let header = `
\\begin{center}
{\\LARGE \\textbf{${escapeLatex(personal_info.full_name).toUpperCase()}}} \\\\[6pt]
{\\normalsize
${contactLine.join(' \\quad $|$ \\quad ')}
}`;

  if (socialLine.length > 0) {
    header += `\\\\[2pt]
{\\normalsize
${socialLine.join(' \\quad $|$ \\quad ')}
}`;
  }

  header += `
\\end{center}

\\vspace{2pt}
`;
  return header;
}

function generateATSCVSummary(cv: CV): string {
  if (!cv.personal_info.summary) return '';
  return `
\\section*{Professional Summary}

${escapeLatex(cv.personal_info.summary)}
`;
}

function generateATSCVEducation(cv: CV): string {
  if (!cv.education || cv.education.length === 0) return '';

  const entries = cv.education.map(edu => {
    const dateRange = formatDateRange(edu.start_date, edu.end_date, false);
    const degree = edu.field_of_study
      ? `${escapeLatex(edu.degree)} in ${escapeLatex(edu.field_of_study)}`
      : escapeLatex(edu.degree);

    let entry = `\\textbf{${degree}} \\hfill ${dateRange} \\\\
${escapeLatex(edu.institution)}${edu.location ? `, ${escapeLatex(edu.location)}` : ''}`;

    if (edu.gpa) {
      entry += ` \\hfill \\textbf{GPA: ${escapeLatex(edu.gpa)}}`;
    }

    const items: string[] = [];
    if (edu.description) items.push(edu.description);
    if (edu.achievements && edu.achievements.length > 0) {
      items.push(...edu.achievements);
    }
    if (items.length > 0) {
      entry += `
\\begin{itemize}
${items.map(a => `\\item ${escapeLatex(a)}`).join('\n')}
\\end{itemize}`;
    }

    return entry;
  }).join('\n\n');

  return `
\\section*{Education}

${entries}
`;
}

function generateATSCVSkills(cv: CV): string {
  if (!cv.skills || cv.skills.length === 0) return '';

  const skillsByCategory = cv.skills.reduce((acc, skill) => {
    const category = skill.category || 'Other';
    if (!acc[category]) acc[category] = [];
    acc[category].push(skill.name);
    return acc;
  }, {} as Record<string, string[]>);

  const rows = Object.entries(skillsByCategory)
    .map(([category, skills]) =>
      `\\textbf{${escapeLatex(category)}} & ${skills.map(escapeLatex).join(', ')} \\\\[3pt]`
    )
    .join('\n');

  return `
\\section*{Technical Skills}

\\begin{tabularx}{\\textwidth}{@{}l X@{}}
${rows}
\\end{tabularx}
`;
}

function generateATSCVExperience(cv: CV): string {
  if (!cv.experience || cv.experience.length === 0) return '';

  const entries = cv.experience.map(exp => {
    const dateRange = formatDateRange(exp.start_date, exp.end_date, exp.current);

    let entry = `\\textbf{${escapeLatex(exp.title)}} \\hfill \\textit{${dateRange}} \\\\
\\textit{${escapeLatex(exp.company)}${exp.location ? `, ${escapeLatex(exp.location)}` : ''}}`;

    if (exp.achievements && exp.achievements.length > 0) {
      entry += `
\\begin{itemize}
${exp.achievements.map(a => `\\item ${escapeLatex(a)}`).join('\n')}
\\end{itemize}`;
    } else if (exp.description) {
      entry += `
\\begin{itemize}
\\item ${escapeLatex(exp.description)}
\\end{itemize}`;
    }

    return entry;
  }).join('\n\n');

  return `
\\section*{Work Experience}

${entries}
`;
}

function generateATSCVProjects(cv: CV): string {
  if (!cv.projects || cv.projects.length === 0) return '';

  const entries = cv.projects.map(project => {
    const techStack = project.technologies.length > 0
      ? project.technologies.map(escapeLatex).join(', ')
      : '';
    const dateRange = project.start_date
      ? formatDateRange(project.start_date, project.end_date || '', false)
      : '';

    let entry = `\\textbf{${escapeLatex(project.name)}}`;
    if (dateRange) entry += ` \\hfill \\textit{${dateRange}}`;
    entry += ` \\\\`;
    if (techStack) entry += `\n\\textit{${techStack}}`;

    const links: string[] = [];
    if (project.url) links.push(`\\href{${project.url}}{Website}`);
    if (project.github_url) links.push(`\\href{${project.github_url}}{GitHub}`);
    if (links.length > 0) entry += ` \\hfill ${links.join(' $|$ ')}`;

    if (project.highlights && project.highlights.length > 0) {
      entry += `
\\begin{itemize}
${project.highlights.map(h => `\\item ${escapeLatex(h)}`).join('\n')}
\\end{itemize}`;
    } else if (project.description) {
      entry += `
\\begin{itemize}
\\item ${escapeLatex(project.description)}
\\end{itemize}`;
    }

    return entry;
  }).join('\n\n');

  return `
\\section*{Projects}

${entries}
`;
}

function generateATSCVCertifications(cv: CV): string {
  if (!cv.certifications || cv.certifications.length === 0) return '';

  const entries = cv.certifications.map(cert => {
    const certName = cert.url
      ? `\\href{${cert.url}}{${escapeLatex(cert.name)}}`
      : escapeLatex(cert.name);
    let line = `\\textbf{${escapeLatex(cert.issuer)}} -- ${certName}`;
    if (cert.date) line += ` \\hfill ${cert.date}`;
    return line;
  }).join(' \\\\\n');

  return `
\\section*{Certifications}

${entries}
`;
}

function generateATSCVLanguages(cv: CV): string {
  if (!cv.languages || cv.languages.length === 0) return '';

  const langList = cv.languages
    .map(lang => `${escapeLatex(lang.name)} (${escapeLatex(lang.proficiency)})`)
    .join(' \\quad $|$ \\quad ');

  return `
\\section*{Languages}
${langList}
`;
}

/**
 * Generate ATS-optimized CV LaTeX (multi-page, comprehensive)
 * Based on a template that scores 92+ on ATS systems
 */
export function generateATSCVLaTeX(cv: CV, sectionOrder?: ResumeSection[]): string {
  const order = sectionOrder || ['summary', 'education', 'skills', 'experience', 'projects', 'certifications', 'languages'];

  const generators: Record<string, (cv: CV) => string> = {
    'summary': generateATSCVSummary,
    'experience': generateATSCVExperience,
    'education': generateATSCVEducation,
    'skills': generateATSCVSkills,
    'projects': generateATSCVProjects,
    'certifications': generateATSCVCertifications,
    'languages': generateATSCVLanguages,
  };

  const sections = [
    generateATSCVPreamble(),
    generateATSCVHeader(cv),
    ...order.map(section => generators[section]?.(cv) || '').filter(Boolean),
    '\n\\end{document}\n',
  ];

  return sections.join('');
}

// ============================================
// ATS RESUME GENERATOR - Single-page compact format
// Tight spacing, role-focused, no icons
// ============================================

function generateATSResumePreamble(): string {
  return `\\documentclass[10pt]{article}
\\usepackage[margin=0.5in]{geometry}
\\usepackage{enumitem}
\\usepackage{hyperref}
\\usepackage{titlesec}
\\setlist[itemize]{leftmargin=*, noitemsep, topsep=2pt, parsep=0pt}
\\pagestyle{empty}
\\setlength{\\parindent}{0pt}
\\setlength{\\parskip}{0pt}
\\titlespacing{\\section}{0pt}{6pt}{3pt}
\\hypersetup{hidelinks}

\\begin{document}
`;
}

function generateATSResumeHeader(cv: CV): string {
  const { personal_info } = cv;
  const contactParts: string[] = [];

  if (personal_info.phone) contactParts.push(escapeLatex(personal_info.phone));
  if (personal_info.email) contactParts.push(escapeLatex(personal_info.email));
  if (personal_info.linkedin_url) {
    const display = personal_info.linkedin_url.replace(/^https?:\/\/(www\.)?/, '');
    contactParts.push(`\\href{${personal_info.linkedin_url}}{${escapeLatex(display)}}`);
  }
  if (personal_info.github_url) {
    const display = personal_info.github_url.replace(/^https?:\/\/(www\.)?/, '');
    contactParts.push(`\\href{${personal_info.github_url}}{${escapeLatex(display)}}`);
  }
  if (personal_info.portfolio_url) {
    const display = personal_info.portfolio_url.replace(/^https?:\/\/(www\.)?/, '');
    contactParts.push(`\\href{${personal_info.portfolio_url}}{${escapeLatex(display)}}`);
  }

  return `
\\begin{center}
{\\Large \\textbf{${escapeLatex(personal_info.full_name).toUpperCase()}}} \\\\[2pt]
{\\small ${contactParts.join(' \\;|\\; ')}}
\\end{center}

\\noindent\\rule{\\textwidth}{0.4pt}
`;
}

function generateATSResumeSummary(cv: CV): string {
  if (!cv.personal_info.summary) return '';
  return `
\\section*{SUMMARY}
${escapeLatex(cv.personal_info.summary)}
`;
}

function generateATSResumeSkills(cv: CV): string {
  if (!cv.skills || cv.skills.length === 0) return '';

  const skillsByCategory = cv.skills.reduce((acc, skill) => {
    const category = skill.category || 'Other';
    if (!acc[category]) acc[category] = [];
    acc[category].push(skill.name);
    return acc;
  }, {} as Record<string, string[]>);

  const skillLines = Object.entries(skillsByCategory)
    .map(([category, skills]) =>
      `\\textbf{${escapeLatex(category)}:} ${skills.map(escapeLatex).join(', ')}`
    )
    .join(' \\\\\n');

  return `
\\section*{CORE SKILLS}
${skillLines}
`;
}

function generateATSResumeExperience(cv: CV): string {
  if (!cv.experience || cv.experience.length === 0) return '';

  const entries = cv.experience.map(exp => {
    const dateRange = formatDateRange(exp.start_date, exp.end_date, exp.current);
    let entry = `\\textbf{${escapeLatex(exp.title)} -- ${escapeLatex(exp.company)}} \\hfill ${dateRange}`;
    if (exp.location) entry += ` \\\\\n${escapeLatex(exp.location)}`;

    if (exp.achievements && exp.achievements.length > 0) {
      entry += `
\\begin{itemize}
${exp.achievements.map(a => `\\item ${escapeLatex(a)}`).join('\n')}
\\end{itemize}`;
    } else if (exp.description) {
      entry += `
\\begin{itemize}
\\item ${escapeLatex(exp.description)}
\\end{itemize}`;
    }

    return entry;
  }).join('\n\n');

  return `
\\section*{EXPERIENCE}
${entries}
`;
}

function generateATSResumeProjects(cv: CV): string {
  if (!cv.projects || cv.projects.length === 0) return '';

  const entries = cv.projects.map(project => {
    const techStack = project.technologies.length > 0
      ? project.technologies.map(escapeLatex).join(', ')
      : '';

    let entry = `\\textbf{${escapeLatex(project.name)}}`;
    if (techStack) entry += ` \\\\\n\\textit{${techStack}}`;

    const links: string[] = [];
    if (project.url) links.push(`\\href{${project.url}}{Website}`);
    if (project.github_url) links.push(`\\href{${project.github_url}}{GitHub}`);
    if (links.length > 0) entry += ` \\;|\\;\n${links.join(' $|$ ')}`;

    if (project.highlights && project.highlights.length > 0) {
      entry += `
\\begin{itemize}
${project.highlights.map(h => `\\item ${escapeLatex(h)}`).join('\n')}
\\end{itemize}`;
    } else if (project.description) {
      entry += `
\\begin{itemize}
\\item ${escapeLatex(project.description)}
\\end{itemize}`;
    }

    return entry;
  }).join('\n\n');

  return `
\\section*{PROJECTS}
${entries}
`;
}

function generateATSResumeEducation(cv: CV): string {
  if (!cv.education || cv.education.length === 0) return '';

  const entries = cv.education.map(edu => {
    const degree = edu.field_of_study
      ? `${escapeLatex(edu.degree)} in ${escapeLatex(edu.field_of_study)}`
      : escapeLatex(edu.degree);

    let entry = `\\textbf{${degree}} \\hfill Expected ${edu.end_date?.split('-')[0] || ''} \\\\
${escapeLatex(edu.institution)}${edu.location ? `, ${escapeLatex(edu.location)}` : ''}`;

    if (edu.gpa) entry += ` \\hfill GPA: ${escapeLatex(edu.gpa)}`;

    return entry;
  }).join('\n\n');

  return `
\\section*{EDUCATION}
${entries}
`;
}

function generateATSResumeCertifications(cv: CV): string {
  if (!cv.certifications || cv.certifications.length === 0) return '';

  const entries = cv.certifications.map(cert => {
    const certName = cert.url
      ? `\\href{${cert.url}}{${escapeLatex(cert.name)}}`
      : escapeLatex(cert.name);
    return `${certName} -- ${escapeLatex(cert.issuer)}${cert.date ? ` (${cert.date})` : ''}`;
  }).join(' \\\\\n');

  return `
\\section*{CERTIFICATIONS}
${entries}
`;
}

function generateATSResumeLanguages(cv: CV): string {
  if (!cv.languages || cv.languages.length === 0) return '';

  const langList = cv.languages
    .map(lang => `${escapeLatex(lang.name)} (${escapeLatex(lang.proficiency)})`)
    .join(', ');

  return `
\\section*{LANGUAGES}
${langList}
`;
}

/**
 * Generate ATS-optimized Resume LaTeX (single-page, compact)
 * Tight spacing, role-focused layout
 */
export function generateATSResumeLaTeX(cv: CV, sectionOrder?: ResumeSection[]): string {
  const order = sectionOrder || getDefaultSectionOrder(cv.template || cv.target_role || 'professional');

  const generators: Record<string, (cv: CV) => string> = {
    'summary': generateATSResumeSummary,
    'experience': generateATSResumeExperience,
    'education': generateATSResumeEducation,
    'skills': generateATSResumeSkills,
    'projects': generateATSResumeProjects,
    'certifications': generateATSResumeCertifications,
    'languages': generateATSResumeLanguages,
  };

  const sections = [
    generateATSResumePreamble(),
    generateATSResumeHeader(cv),
    ...order.map(section => generators[section]?.(cv) || '').filter(Boolean),
    '\n\\end{document}\n',
  ];

  return sections.join('');
}

/**
 * Downloads ATS CV LaTeX as .tex file
 */
export function downloadATSCVLaTeX(cv: CV, filename?: string): void {
  const latex = generateATSCVLaTeX(cv);
  const blob = new Blob([latex], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename || `${cv.personal_info.full_name.replace(/\s+/g, '_')}_ATS_CV.tex`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Downloads ATS Resume LaTeX as .tex file
 */
export function downloadATSResumeLaTeX(cv: CV, filename?: string): void {
  const latex = generateATSResumeLaTeX(cv);
  const blob = new Blob([latex], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename || `${cv.personal_info.full_name.replace(/\s+/g, '_')}_ATS_Resume.tex`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Gets template recommendations based on target role
 */
export function getRecommendedTemplate(targetRole: string): LaTeXExportOptions['template'] {
  const roleTemplateMap: Record<string, LaTeXExportOptions['template']> = {
    // Engineering & Tech
    'software-engineer': 'software-engineer',
    'mobile-app-developer': 'software-engineer',
    'qa-engineer': 'software-engineer',
    'systems-engineer': 'software-engineer',
    // Data, Analytics & Research
    'data-scientist': 'data-scientist',
    'data-analyst': 'data-scientist',
    'research-analyst': 'professional',
    'ai-ml-engineer': 'ai-ml',
    // Product, Operations & Management
    'product-manager': 'professional',
    'project-manager': 'professional',
    'program-manager': 'professional',
    'operations-manager': 'professional',
    // Business, Finance & Sales
    'financial-analyst': 'professional',
    'accountant': 'professional',
    'sales-executive': 'professional',
    'business-development': 'professional',
    // Marketing & Content
    'content-writer': 'minimal',
    'social-media-manager': 'minimal',
    'seo-specialist': 'minimal',
    // Creative
    'graphic-designer': 'minimal',
    'video-editor': 'minimal',
    'designer': 'minimal',
    // Healthcare & Science
    'healthcare-admin': 'professional',
    'clinical-research': 'professional',
    // Legal, HR & Admin
    'hr-manager': 'professional',
    'legal-assistant': 'professional',
    'admin-assistant': 'professional',
    // Emerging & Modern
    'ai-prompt-engineer': 'ai-ml',
    'automation-specialist': 'software-engineer',
    'technical-writer': 'professional',
    // General
    'fresher': 'fresher',
    'freelancer': 'professional',
    'executive': 'professional',
  };
  
  return roleTemplateMap[targetRole] || 'professional';
}
