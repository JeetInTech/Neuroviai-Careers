"""
PDF Generation Service for CV Forge
Uses FPDF2 to generate professional PDF resumes with selectable text
Pure Python - no external dependencies required
Supports multiple template styles
"""

from fpdf import FPDF
from typing import Dict, Any, List
import re


def sanitize_text(text: str) -> str:
    """Replace Unicode characters not supported by Helvetica with ASCII equivalents"""
    if not text:
        return ""
    # Replace bullet points and other special characters
    replacements = {
        '•': '-',
        '●': '-',
        '○': '-',
        '►': '-',
        '▪': '-',
        '→': '-',
        '—': '-',
        '–': '-',
        '"': '"',
        '"': '"',
        ''': "'",
        ''': "'",
        '…': '...',
        '™': '(TM)',
        '®': '(R)',
        '©': '(c)',
        '°': ' deg',
        '±': '+/-',
        '×': 'x',
        '÷': '/',
    }
    for old, new in replacements.items():
        text = text.replace(old, new)
    # Remove any remaining non-ASCII characters that might cause issues
    text = text.encode('ascii', 'replace').decode('ascii')
    return text


# Template style mapping - maps template IDs to style categories
# Each template maps to a unique style for maximum visual differentiation
TEMPLATE_STYLES = {
    # Professional / Classic style
    'professional': 'professional',
    'classic-professional': 'classic-professional',
    'executive': 'executive',
    
    # Tech / Engineering style
    'tech-focused': 'tech',
    'software-engineer': 'software-engineer',
    'mobile-app-developer': 'mobile-dev',
    'systems-engineer': 'systems-engineer',
    'ai-ml-engineer': 'ai-ml',
    'ai-ml': 'ai-ml',
    'data-scientist': 'data-science',
    'data-science': 'data-science',
    'devops-engineer': 'devops',
    
    # Minimal style
    'minimal': 'minimal',
    'modern-minimal': 'modern-minimal',
    'fresher': 'fresher',
    'entry-level': 'fresher',
    
    # Creative style
    'creative': 'creative',
    'creative-bold': 'creative-bold',
    'designer': 'designer',
    'graphic-designer': 'designer',
    'video-editor': 'video-editor',
    'content-writer': 'content-writer',
    
    # Business & Management
    'project-manager': 'business',
    'business-analyst': 'business',
    'marketing': 'marketing',
    
    # Freelancer style
    'freelancer': 'freelancer',
    
    # Academic/Research
    'academic': 'research',
}


def get_template_style(template_name: str) -> str:
    """Get the style category for a template"""
    return TEMPLATE_STYLES.get(template_name, 'professional')


# Style configurations - unique visual identity per template
STYLE_CONFIGS = {
    'professional': {
        'header_align': 'C',
        'name_size': 22,
        'section_style': 'underline',
        'section_caps': True,
        'bullet_indent': 20,
        'default_accent': '#4F46E5',  # Indigo
        'skills_display': 'line',
    },
    'classic-professional': {
        'header_align': 'C',
        'name_size': 22,
        'section_style': 'underline',
        'section_caps': True,
        'bullet_indent': 20,
        'default_accent': '#1E3A5F',  # Navy
        'skills_display': 'line',
    },
    'executive': {
        'header_align': 'C',
        'name_size': 24,
        'section_style': 'underline',
        'section_caps': True,
        'bullet_indent': 22,
        'default_accent': '#92400E',  # Gold-brown
        'skills_display': 'line',
    },
    'tech': {
        'header_align': 'L',
        'name_size': 20,
        'section_style': 'box',
        'section_caps': True,
        'bullet_indent': 18,
        'default_accent': '#059669',  # Green
        'skills_display': 'grid',
    },
    'software-engineer': {
        'header_align': 'L',
        'name_size': 20,
        'section_style': 'box',
        'section_caps': True,
        'bullet_indent': 18,
        'default_accent': '#0E7490',  # Cyan
        'skills_display': 'grid',
    },
    'mobile-dev': {
        'header_align': 'L',
        'name_size': 20,
        'section_style': 'box',
        'section_caps': True,
        'bullet_indent': 18,
        'default_accent': '#7C3AED',  # Purple
        'skills_display': 'grid',
    },
    'systems-engineer': {
        'header_align': 'L',
        'name_size': 18,
        'section_style': 'simple',
        'section_caps': True,
        'bullet_indent': 18,
        'default_accent': '#374151',  # Dark gray (monochrome)
        'skills_display': 'grid',
    },
    'ai-ml': {
        'header_align': 'L',
        'name_size': 20,
        'section_style': 'box',
        'section_caps': True,
        'bullet_indent': 18,
        'default_accent': '#7C3AED',  # Violet
        'skills_display': 'grid',
    },
    'data-science': {
        'header_align': 'L',
        'name_size': 20,
        'section_style': 'box',
        'section_caps': True,
        'bullet_indent': 18,
        'default_accent': '#0369A1',  # Blue
        'skills_display': 'grid',
    },
    'devops': {
        'header_align': 'L',
        'name_size': 20,
        'section_style': 'box',
        'section_caps': True,
        'bullet_indent': 18,
        'default_accent': '#EA580C',  # Orange
        'skills_display': 'grid',
    },
    'minimal': {
        'header_align': 'L',
        'name_size': 18,
        'section_style': 'simple',
        'section_caps': False,
        'bullet_indent': 18,
        'default_accent': '#374151',  # Gray
        'skills_display': 'line',
    },
    'modern-minimal': {
        'header_align': 'C',
        'name_size': 18,
        'section_style': 'simple',
        'section_caps': False,
        'bullet_indent': 18,
        'default_accent': '#6B7280',  # Muted gray
        'skills_display': 'line',
    },
    'fresher': {
        'header_align': 'C',
        'name_size': 20,
        'section_style': 'underline',
        'section_caps': False,
        'bullet_indent': 18,
        'default_accent': '#2563EB',  # Bright blue
        'skills_display': 'grid',
    },
    'creative': {
        'header_align': 'C',
        'name_size': 24,
        'section_style': 'underline',
        'section_caps': True,
        'bullet_indent': 20,
        'default_accent': '#DC2626',  # Red
        'skills_display': 'grid',
    },
    'creative-bold': {
        'header_align': 'L',
        'name_size': 26,
        'section_style': 'box',
        'section_caps': True,
        'bullet_indent': 20,
        'default_accent': '#111827',  # Near black
        'skills_display': 'grid',
    },
    'designer': {
        'header_align': 'C',
        'name_size': 22,
        'section_style': 'simple',
        'section_caps': True,
        'bullet_indent': 20,
        'default_accent': '#DB2777',  # Pink
        'skills_display': 'grid',
    },
    'video-editor': {
        'header_align': 'L',
        'name_size': 22,
        'section_style': 'box',
        'section_caps': True,
        'bullet_indent': 20,
        'default_accent': '#9333EA',  # Purple
        'skills_display': 'grid',
    },
    'content-writer': {
        'header_align': 'C',
        'name_size': 20,
        'section_style': 'underline',
        'section_caps': False,
        'bullet_indent': 20,
        'default_accent': '#0D9488',  # Teal
        'skills_display': 'line',
    },
    'business': {
        'header_align': 'C',
        'name_size': 22,
        'section_style': 'underline',
        'section_caps': True,
        'bullet_indent': 20,
        'default_accent': '#1E40AF',  # Blue
        'skills_display': 'line',
    },
    'marketing': {
        'header_align': 'C',
        'name_size': 22,
        'section_style': 'underline',
        'section_caps': True,
        'bullet_indent': 20,
        'default_accent': '#C2410C',  # Orange-red
        'skills_display': 'line',
    },
    'research': {
        'header_align': 'L',
        'name_size': 20,
        'section_style': 'simple',
        'section_caps': False,
        'bullet_indent': 18,
        'default_accent': '#6B21A8',  # Purple
        'skills_display': 'line',
    },
    'admin': {
        'header_align': 'C',
        'name_size': 20,
        'section_style': 'underline',
        'section_caps': True,
        'bullet_indent': 20,
        'default_accent': '#0369A1',  # Sky blue
        'skills_display': 'line',
    },
    'freelancer': {
        'header_align': 'L',
        'name_size': 22,
        'section_style': 'box',
        'section_caps': True,
        'bullet_indent': 18,
        'default_accent': '#EA580C',  # Orange
        'skills_display': 'grid',
    },
}


class ResumePDF(FPDF):
    """Custom PDF class for resume generation with template support"""
    
    def __init__(self, accent_color: str = '#4F46E5', is_grayscale: bool = False, style: str = 'professional'):
        super().__init__()
        self.style = style
        self.config = STYLE_CONFIGS.get(style, STYLE_CONFIGS['professional'])
        
        # Use template's default accent if none provided
        if not accent_color:
            accent_color = self.config['default_accent']
        
        self.accent_color = accent_color if not is_grayscale else '#374151'
        self.accent_rgb = self.hex_to_rgb(self.accent_color)
        
        # Set up fonts and page
        self.add_page()
        self.set_auto_page_break(auto=True, margin=15)
        self.set_margins(15, 15, 15)
        
    def hex_to_rgb(self, hex_color: str) -> tuple:
        """Convert hex color to RGB tuple"""
        hex_color = hex_color.lstrip('#')
        return tuple(int(hex_color[i:i+2], 16) for i in (0, 2, 4))
    
    def header(self):
        pass  # No default header
    
    def footer(self):
        pass  # No default footer
    
    def add_section_title(self, title: str):
        """Add a section title based on template style"""
        section_style = self.config['section_style']
        section_caps = self.config['section_caps']
        
        display_title = title.upper() if section_caps else title
        
        if section_style == 'underline':
            self.set_font('Helvetica', 'B', 11)
            self.set_text_color(*self.accent_rgb)
            self.cell(0, 8, sanitize_text(display_title), new_x="LMARGIN", new_y="NEXT")
            
            # Add underline
            self.set_draw_color(*self.accent_rgb)
            self.set_line_width(0.3)
            y = self.get_y()
            self.line(15, y, 195, y)
            self.ln(3)
            
        elif section_style == 'box':
            # Filled box style
            self.set_fill_color(*self.accent_rgb)
            self.set_text_color(255, 255, 255)  # White text
            self.set_font('Helvetica', 'B', 10)
            self.cell(0, 7, f"  {sanitize_text(display_title)}", new_x="LMARGIN", new_y="NEXT", fill=True)
            self.ln(2)
            
        else:  # simple
            self.set_font('Helvetica', 'B', 11)
            self.set_text_color(*self.accent_rgb)
            self.cell(0, 8, sanitize_text(display_title), new_x="LMARGIN", new_y="NEXT")
            self.ln(1)
        
        # Reset text color
        self.set_text_color(31, 41, 55)  # Dark gray
    
    def add_entry_header(self, title: str, date: str = ''):
        """Add entry header with title and date"""
        self.set_font('Helvetica', 'B', 10)
        self.set_text_color(17, 24, 39)  # Nearly black
        
        if date:
            title_width = 140
            date_width = 40
            
            self.cell(title_width, 5, sanitize_text(title), new_x="RIGHT", new_y="TOP")
            
            self.set_font('Helvetica', '', 9)
            self.set_text_color(107, 114, 128)  # Gray
            self.cell(date_width, 5, sanitize_text(date), new_x="LMARGIN", new_y="NEXT", align='R')
        else:
            self.cell(0, 5, sanitize_text(title), new_x="LMARGIN", new_y="NEXT")
        
        self.set_text_color(31, 41, 55)
    
    def add_entry_subtitle(self, subtitle: str):
        """Add italic subtitle"""
        self.set_font('Helvetica', 'I', 9)
        self.set_text_color(75, 85, 99)
        self.cell(0, 5, sanitize_text(subtitle), new_x="LMARGIN", new_y="NEXT")
        self.set_text_color(31, 41, 55)
    
    def add_description(self, text: str):
        """Add description text"""
        if not text:
            return
        self.set_font('Helvetica', '', 9)
        self.set_text_color(55, 65, 81)
        self.multi_cell(0, 4.5, sanitize_text(text))
        self.set_text_color(31, 41, 55)
    
    def add_bullet_point(self, text: str):
        """Add a bullet point"""
        if not text:
            return
        self.set_font('Helvetica', '', 9)
        self.set_text_color(55, 65, 81)
        
        bullet_indent = self.config['bullet_indent']
        self.set_x(bullet_indent)
        self.set_text_color(*self.accent_rgb)
        self.cell(5, 4.5, "-", new_x="RIGHT", new_y="TOP")
        
        self.set_text_color(55, 65, 81)
        self.multi_cell(0, 4.5, sanitize_text(text))
        self.set_text_color(31, 41, 55)
    
    def add_skills_line(self, skills: List[str]):
        """Add skills as a single line with separators"""
        self.set_font('Helvetica', '', 9)
        self.set_text_color(55, 65, 81)
        skills_text = '  |  '.join([sanitize_text(s) for s in skills])
        self.multi_cell(0, 5, skills_text)
        self.set_text_color(31, 41, 55)
    
    def add_skills_grid(self, skills: List[str]):
        """Add skills in a grid/tag style"""
        self.set_font('Helvetica', '', 9)
        x_start = 15
        x = x_start
        y = self.get_y()
        max_width = 180
        
        for skill in skills:
            skill_text = sanitize_text(skill)
            text_width = self.get_string_width(skill_text) + 8
            
            if x + text_width > x_start + max_width:
                x = x_start
                y += 7
            
            self.set_xy(x, y)
            self.set_fill_color(243, 244, 246)  # Light gray
            self.set_text_color(55, 65, 81)
            self.cell(text_width, 6, skill_text, fill=True, new_x="RIGHT", new_y="TOP")
            x += text_width + 3
        
        self.set_y(y + 8)
        self.set_text_color(31, 41, 55)


def generate_pdf(cv_data: Dict[str, Any]) -> bytes:
    """Generate PDF from CV data with template support"""
    
    personal_info = cv_data.get('personal_info', {})
    experience = cv_data.get('experience', [])
    education = cv_data.get('education', [])
    skills = cv_data.get('skills', [])
    projects = cv_data.get('projects', [])
    certifications = cv_data.get('certifications', [])
    languages = cv_data.get('languages', [])
    
    # Get template and style
    template_name = cv_data.get('template', 'professional')
    style = get_template_style(template_name)
    config = STYLE_CONFIGS.get(style, STYLE_CONFIGS['professional'])
    
    accent_color = cv_data.get('accent_color') or config['default_accent']
    is_grayscale = cv_data.get('is_grayscale', False)
    
    # Create PDF with template style
    pdf = ResumePDF(accent_color=accent_color, is_grayscale=is_grayscale, style=style)
    
    # === HEADER ===
    header_align = config['header_align']
    name_size = config['name_size']
    
    # Name
    pdf.set_font('Helvetica', 'B', name_size)
    pdf.set_text_color(17, 24, 39)
    name = personal_info.get('full_name', 'Your Name')
    pdf.cell(0, 10, sanitize_text(name), new_x="LMARGIN", new_y="NEXT", align=header_align)
    
    # Contact info line
    contact_parts = []
    if personal_info.get('email'):
        contact_parts.append(personal_info['email'])
    if personal_info.get('phone'):
        contact_parts.append(personal_info['phone'])
    if personal_info.get('city') and personal_info.get('country'):
        contact_parts.append(f"{personal_info['city']}, {personal_info['country']}")
    elif personal_info.get('address'):
        contact_parts.append(personal_info['address'])
    
    if contact_parts:
        pdf.set_font('Helvetica', '', 9)
        pdf.set_text_color(75, 85, 99)
        pdf.cell(0, 5, sanitize_text('  |  '.join(contact_parts)), new_x="LMARGIN", new_y="NEXT", align=header_align)
    
    # Social links
    social_parts = []
    if personal_info.get('linkedin_url'):
        social_parts.append(('LinkedIn', personal_info['linkedin_url']))
    if personal_info.get('github_url'):
        social_parts.append(('GitHub', personal_info['github_url']))
    if personal_info.get('portfolio_url'):
        social_parts.append(('Portfolio', personal_info['portfolio_url']))
    
    if social_parts:
        pdf.set_font('Helvetica', '', 9)
        
        if header_align == 'C':
            # Center the links
            total_width = sum(pdf.get_string_width(text) + 15 for text, _ in social_parts)
            start_x = (210 - total_width) / 2
            pdf.set_x(start_x)
        
        for i, (text, url) in enumerate(social_parts):
            pdf.set_text_color(*pdf.accent_rgb)
            link_width = pdf.get_string_width(text) + 5
            pdf.cell(link_width, 5, text, new_x="RIGHT", new_y="TOP", link=url)
            if i < len(social_parts) - 1:
                pdf.set_text_color(75, 85, 99)
                pdf.cell(10, 5, '  |  ', new_x="RIGHT", new_y="TOP")
        pdf.ln(5)
    
    # Header divider (varies by style)
    if config['section_style'] != 'box':
        pdf.set_draw_color(*pdf.accent_rgb)
        pdf.set_line_width(0.5)
        y = pdf.get_y() + 2
        pdf.line(15, y, 195, y)
    pdf.ln(6)
    
    # === SUMMARY ===
    if personal_info.get('summary'):
        pdf.add_section_title('Professional Summary')
        pdf.add_description(personal_info['summary'])
        pdf.ln(4)
    
    # === SKILLS ===
    if skills:
        pdf.add_section_title('Skills')
        skill_names = [s.get('name', '') for s in skills if s.get('name')]
        if skill_names:
            # Use skills_display from config, default to 'line'
            skills_display = config.get('skills_display', 'line')
            if skills_display == 'grid':
                pdf.add_skills_grid(skill_names)
            else:
                pdf.add_skills_line(skill_names)
        pdf.ln(4)
    
    # === EXPERIENCE ===
    if experience:
        pdf.add_section_title('Professional Experience')
        for i, exp in enumerate(experience):
            title = exp.get('title', '')
            company = exp.get('company', '')
            location = exp.get('location', '')
            start_date = exp.get('start_date', '')
            end_date = 'Present' if exp.get('current') else exp.get('end_date', '')
            date_range = f"{start_date} - {end_date}" if start_date else ''
            
            pdf.add_entry_header(title, date_range)
            
            subtitle_parts = [company]
            if location:
                subtitle_parts.append(location)
            pdf.add_entry_subtitle(', '.join(subtitle_parts))
            
            if exp.get('description'):
                pdf.add_description(exp['description'])
            
            achievements = exp.get('achievements', [])
            for achievement in achievements:
                if achievement:
                    pdf.add_bullet_point(achievement)
            
            if i < len(experience) - 1:
                pdf.ln(3)
        pdf.ln(4)
    
    # === EDUCATION ===
    if education:
        pdf.add_section_title('Education')
        for i, edu in enumerate(education):
            degree = edu.get('degree', '')
            field = edu.get('field_of_study', '')
            title = f"{degree} in {field}" if field else degree
            
            start_date = edu.get('start_date', '')
            end_date = edu.get('end_date', '')
            date_range = f"{start_date} - {end_date}" if start_date else ''
            
            pdf.add_entry_header(title, date_range)
            
            institution = edu.get('institution', '')
            location = edu.get('location', '')
            gpa = edu.get('gpa', '')
            
            subtitle_parts = [institution]
            if location:
                subtitle_parts.append(location)
            if gpa:
                subtitle_parts.append(f"GPA: {gpa}")
            pdf.add_entry_subtitle(', '.join(subtitle_parts) if subtitle_parts else '')
            
            if edu.get('description'):
                pdf.add_description(edu['description'])
            
            if i < len(education) - 1:
                pdf.ln(2)
        pdf.ln(4)
    
    # === PROJECTS ===
    if projects:
        pdf.add_section_title('Projects')
        for i, proj in enumerate(projects):
            name = proj.get('name', '')
            pdf.add_entry_header(name)
            
            # Technologies
            techs = proj.get('technologies', [])
            if techs:
                pdf.set_font('Helvetica', 'I', 8)
                pdf.set_text_color(*pdf.accent_rgb)
                pdf.cell(0, 4, sanitize_text(', '.join(techs)), new_x="LMARGIN", new_y="NEXT")
                pdf.set_text_color(31, 41, 55)
            
            # Links
            links = []
            if proj.get('url'):
                links.append(('Live', proj['url']))
            if proj.get('github_url'):
                links.append(('Code', proj['github_url']))
            
            if links:
                pdf.set_font('Helvetica', '', 8)
                for text, url in links:
                    pdf.set_text_color(*pdf.accent_rgb)
                    pdf.cell(pdf.get_string_width(f"[{text}]") + 3, 4, f"[{text}]", new_x="RIGHT", new_y="TOP", link=url)
                pdf.ln()
            
            if proj.get('description'):
                pdf.add_description(proj['description'])
            
            highlights = proj.get('highlights', [])
            for highlight in highlights:
                if highlight:
                    pdf.add_bullet_point(highlight)
            
            if i < len(projects) - 1:
                pdf.ln(2)
        pdf.ln(4)
    
    # === CERTIFICATIONS ===
    if certifications:
        pdf.add_section_title('Certifications')
        for cert in certifications:
            name = cert.get('name', '')
            date = cert.get('date', '')
            pdf.add_entry_header(name, date)
            
            issuer = cert.get('issuer', '')
            if issuer:
                pdf.add_entry_subtitle(issuer)
            
            if cert.get('url'):
                pdf.set_font('Helvetica', '', 8)
                pdf.set_text_color(*pdf.accent_rgb)
                pdf.cell(20, 4, '[Verify]', new_x="LMARGIN", new_y="NEXT", link=cert['url'])
                pdf.set_text_color(31, 41, 55)
        pdf.ln(4)
    
    # === LANGUAGES ===
    if languages:
        pdf.add_section_title('Languages')
        lang_parts = [f"{lang.get('name', '')} ({lang.get('proficiency', '')})" 
                      for lang in languages if lang.get('name')]
        if lang_parts:
            pdf.add_skills_line(lang_parts)
    
    # Output PDF
    return bytes(pdf.output())
