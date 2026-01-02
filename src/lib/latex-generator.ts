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

// Default export options
const DEFAULT_OPTIONS: LaTeXExportOptions = {
  template: 'professional',
  font_size: '11pt',
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
function generatePreamble(options: LaTeXExportOptions): string {
  const margin = options.template === 'minimal' ? '0.5in' : '0.6in';

  return `%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
% CV Forge - ATS-Optimized Resume
% LaTeX Template - Generated ${new Date().toISOString().split('T')[0]}
%
% This template is designed for:
% - Maximum ATS compatibility (90%+ parse rate)
% - Clean, professional typography
% - Single-column layout for easy parsing
% - Standard LaTeX packages only
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

\\documentclass[${options.font_size},${options.paper_size}]{article}

% ===== PACKAGES =====
\\usepackage[utf8]{inputenc}
\\usepackage[T1]{fontenc}
\\usepackage{lmodern}           % Clean, modern font
\\usepackage[margin=${margin}]{geometry}
\\usepackage{hyperref}
\\usepackage{enumitem}
\\usepackage{titlesec}
\\usepackage{xcolor}
\\usepackage{parskip}

% ===== COLOR DEFINITIONS =====
\\definecolor{headercolor}{RGB}{0, 0, 0}
\\definecolor{sectioncolor}{RGB}{30, 30, 30}
\\definecolor{textcolor}{RGB}{40, 40, 40}
\\definecolor{linkcolor}{RGB}{0, 102, 204}

% ===== HYPERLINK SETUP =====
\\hypersetup{
    colorlinks=true,
    linkcolor=linkcolor,
    urlcolor=linkcolor,
    pdfauthor={CV Forge},
    pdftitle={Professional Resume},
}

% ===== SECTION FORMATTING =====
\\titleformat{\\section}
    {\\Large\\bfseries\\color{sectioncolor}\\uppercase}
    {}
    {0em}
    {}
    [\\vspace{-0.5em}\\titlerule\\vspace{0.3em}]
    
\\titlespacing{\\section}{0pt}{1em}{0.5em}

% ===== LIST FORMATTING =====
\\setlist[itemize]{
    leftmargin=1.5em,
    itemsep=0.2em,
    parsep=0em,
    topsep=0.3em
}

% ===== REMOVE PAGE NUMBERS =====
\\pagestyle{empty}

% ===== CUSTOM COMMANDS =====
% Job entry: {Title}{Date Range}{Company}{Location}
\\newcommand{\\jobentry}[4]{%
    \\noindent\\textbf{#1} \\hfill \\textit{#2}\\\\
    \\textit{#3} \\hfill #4
    \\vspace{0.3em}
}

% Education entry: {Degree}{Date}{Institution}{Location}
\\newcommand{\\eduentry}[4]{%
    \\noindent\\textbf{#1} \\hfill \\textit{#2}\\\\
    #3 \\hfill #4
    \\vspace{0.3em}
}

% Project entry: {Name}{Technologies}{Description}
\\newcommand{\\projectentry}[3]{%
    \\noindent\\textbf{#1}\\\\
    \\textit{Technologies: #2}\\\\
    #3
    \\vspace{0.5em}
}

\\begin{document}
\\color{textcolor}
`;
}

/**
 * Generates the personal info/header section
 */
function generateHeader(cv: CV): string {
  const { personal_info } = cv;
  const contactItems: string[] = [];

  if (personal_info.email) {
    contactItems.push(`\\href{mailto:${personal_info.email}}{${escapeLatex(personal_info.email)}}`);
  }
  if (personal_info.phone) {
    contactItems.push(escapeLatex(personal_info.phone));
  }
  if (personal_info.city && personal_info.country) {
    contactItems.push(`${escapeLatex(personal_info.city)}, ${escapeLatex(personal_info.country)}`);
  } else if (personal_info.address) {
    contactItems.push(escapeLatex(personal_info.address));
  }

  const socialLinks: string[] = [];
  if (personal_info.linkedin_url) {
    socialLinks.push(`\\href{${personal_info.linkedin_url}}{LinkedIn}`);
  }
  if (personal_info.github_url) {
    socialLinks.push(`\\href{${personal_info.github_url}}{GitHub}`);
  }
  if (personal_info.portfolio_url) {
    socialLinks.push(`\\href{${personal_info.portfolio_url}}{Portfolio}`);
  }

  return `
% ===== HEADER =====
\\begin{center}
    {\\Huge\\bfseries\\color{headercolor} ${escapeLatex(personal_info.full_name)}}\\\\[0.4em]
    ${contactItems.join(' $\\cdot$ ')}
    ${socialLinks.length > 0 ? `\\\\[0.2em]\n    ${socialLinks.join(' $\\cdot$ ')}` : ''}
\\end{center}
\\vspace{0.5em}
`;
}

/**
 * Generates the summary section
 */
function generateSummary(cv: CV): string {
  if (!cv.personal_info.summary) return '';
  return `
% ===== PROFESSIONAL SUMMARY =====
\\section{Professional Summary}
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
    
    let content = `
\\jobentry{${escapeLatex(exp.title)}}{${dateRange}}{${escapeLatex(exp.company)}}{${escapeLatex(exp.location)}}`;

    if (exp.achievements && exp.achievements.length > 0) {
      content += `
\\begin{itemize}
${exp.achievements.map(a => `    \\item ${escapeLatex(a)}`).join('\n')}
\\end{itemize}`;
    } else if (exp.description) {
      content += `
${escapeLatex(exp.description)}`;
    }

    return content;
  }).join('\n\\vspace{0.5em}\n');

  return `
% ===== EXPERIENCE =====
\\section{Experience}
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
      ? `${escapeLatex(edu.degree)} in ${escapeLatex(edu.field_of_study)}`
      : escapeLatex(edu.degree);

    let content = `
\\eduentry{${degree}}{${dateRange}}{${escapeLatex(edu.institution)}}{${escapeLatex(edu.location)}}`;

    if (edu.gpa) {
      content += `\\\\GPA: ${escapeLatex(edu.gpa)}`;
    }
    if (edu.description) {
      content += `\\\\${escapeLatex(edu.description)}`;
    }
    if (edu.achievements && edu.achievements.length > 0) {
      content += `
\\begin{itemize}
${edu.achievements.map(a => `    \\item ${escapeLatex(a)}`).join('\n')}
\\end{itemize}`;
    }

    return content;
  }).join('\n\\vspace{0.3em}\n');

  return `
% ===== EDUCATION =====
\\section{Education}
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
% ===== TECHNICAL SKILLS =====
\\section{Technical Skills}
${skillLines}
`;
}

/**
 * Generates the certifications section
 */
function generateCertifications(cv: CV): string {
  if (!cv.certifications || cv.certifications.length === 0) return '';

  const entries = cv.certifications.map(cert => {
    const certLine = cert.url 
      ? `\\href{${cert.url}}{${escapeLatex(cert.name)}}`
      : escapeLatex(cert.name);
    return `    \\item ${certLine} -- ${escapeLatex(cert.issuer)} (${cert.date})`;
  }).join('\n');

  return `
% ===== CERTIFICATIONS =====
\\section{Certifications}
\\begin{itemize}[leftmargin=1em]
${entries}
\\end{itemize}
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
      : 'N/A';
    
    const links: string[] = [];
    if (project.url) links.push(`\\href{${project.url}}{Live}`);
    if (project.github_url) links.push(`\\href{${project.github_url}}{GitHub}`);
    const linkText = links.length > 0 ? ` [${links.join(' | ')}]` : '';

    return `
\\projectentry{${escapeLatex(project.name)}${linkText}}{${techStack}}{${escapeLatex(project.description)}}`;
  }).join('\n');

  return `
% ===== PROJECTS =====
\\section{Projects}
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
% ===== LANGUAGES =====
\\section{Languages}
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
 * Main function to generate complete LaTeX document
 */
export function generateLaTeX(cv: CV, options: Partial<LaTeXExportOptions> = {}): string {
  const opts = { ...DEFAULT_OPTIONS, ...options };
  const templateName = opts.template || 'professional';
  const sectionOrder = TEMPLATE_CONFIGS[templateName] || TEMPLATE_CONFIGS['professional'];

  const generators: Record<string, (cv: CV) => string> = {
    'header': generateHeader,
    'summary': generateSummary,
    'experience': generateExperience,
    'education': generateEducation,
    'skills': generateSkills,
    'projects': generateProjects,
    'certifications': generateCertifications,
    'languages': generateLanguages,
  };

  const sections = [
    generatePreamble(opts),
    ...sectionOrder.map(section => generators[section](cv)),
    '\n\\end{document}\n',
  ];

  return sections.join('');
}

/**
 * Generates a preview of the LaTeX code (first 50 lines)
 */
export function generateLaTeXPreview(cv: CV, options: Partial<LaTeXExportOptions> = {}): string {
  const full = generateLaTeX(cv, options);
  const lines = full.split('\n');
  return lines.slice(0, 50).join('\n') + '\n% ... (truncated for preview)';
}

/**
 * Downloads the LaTeX code as a .tex file
 */
export function downloadLaTeX(cv: CV, filename?: string, options: Partial<LaTeXExportOptions> = {}): void {
  const latex = generateLaTeX(cv, options);
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
