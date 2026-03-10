# How We Built the ATS Resume Suite — Full Process Documentation

## Author: Sangramjeet Ghosh
## Date: February 12, 2026
## Tools Used: VS Code, GitHub Copilot (Claude), MiKTeX (XeLaTeX), Pandoc, Python

---

## 1. OVERVIEW

We created a complete job-application toolkit consisting of:
- **12 ATS-optimized, single-page LaTeX resumes** (each tailored for a different job role)
- **1 detailed CV** (2-3 pages with full information)
- **1 universal cover letter**
- **1 cold email template** (with follow-up and tips)

All files were authored in **LaTeX (.tex)**, compiled to **PDF**, and the letter/email were also converted to **Word (.docx)** for easy editing.

---

## 2. SOURCE DATA EXTRACTION

### Problem
The original resume content existed across multiple **PDF files** in the workspace. PDFs cannot be directly read/parsed by text tools.

### Solution
1. Merged all resume PDFs into a single file using **iLovePDF** (online tool) → `ilovepdf_merged.docx`
2. Used **Python** with the `python-docx` library to extract text from the merged .docx file:

```python
# Setup
python -m venv .venv
.venv\Scripts\Activate.ps1
pip install python-docx

# Extraction script
from docx import Document
doc = Document("ilovepdf_merged.docx")
for para in doc.paragraphs:
    print(para.text)
```

This gave us the full text content (name, contact info, experience, projects, skills, achievements, education) needed to build all resumes.

---

## 3. LaTeX TEMPLATE DESIGN

### Reference Template
We used an existing template file (`unit.tex`) in the workspace as a formatting reference for the ATS-friendly layout.

### ATS-Friendly Design Principles
- **Simple structure**: No tables for layout, no columns, no graphics — just sections and bullet points
- **Standard section headers**: SUMMARY, SKILLS, EXPERIENCE, PROJECTS, EDUCATION (ATS parsers expect these)
- **Clean fonts**: Default LaTeX Computer Modern (universally readable)
- **No colors or fancy formatting** in resumes (colors used only in CV and letter)

### LaTeX Preamble (used across all 12 resumes)
```latex
\documentclass[10pt]{article}
\usepackage[margin=0.4in]{geometry}      % Tight margins for single-page fit
\usepackage{enumitem}                     % Control bullet point spacing
\usepackage{hyperref}                     % Clickable links
\usepackage{titlesec}                     % Section title spacing control

% Compact bullet points
\setlist[itemize]{leftmargin=*, noitemsep, topsep=2pt, parsep=0pt}

% No page numbers
\pagestyle{empty}

% Remove paragraph indentation and spacing
\setlength{\parindent}{0pt}
\setlength{\parskip}{0pt}

% Tight section spacing (key for single-page fit)
\titlespacing{\section}{0pt}{6pt}{3pt}

% Hide link borders (ATS-safe)
\hypersetup{hidelinks}
```

### Key Formatting Decisions
| Decision | Why |
|----------|-----|
| **10pt font** | Smaller than default 12pt; fits more content on one page while staying readable |
| **0.4in margins** | Tighter than standard 1in; maximizes usable space |
| **noitemsep** | Removes vertical space between bullet points |
| **titlesec spacing** | Reduces gap above/below section headers from default ~20pt to 6pt/3pt |
| **hidelinks** | Removes colored/boxed link formatting that can confuse ATS parsers |

---

## 4. MAKING EACH RESUME UNIQUE

### The Problem (First Attempt)
The first batch of 12 resumes all had:
- Same section headers (all used "SUMMARY", "SKILLS", etc.)
- Same section order
- Same skill lists
- Same bullet point phrasing
- Same project descriptions

This made them look like copies with minor word changes.

### The Solution (Rewrite Strategy)
Each resume was rewritten with **5 axes of differentiation**:

#### A. Different Section Header Names
| Resume | Summary Header | Skills Header |
|--------|---------------|---------------|
| Backend Developer | SUMMARY | SKILLS |
| Full-Stack Developer | SUMMARY | TECHNICAL SKILLS |
| API Developer | PROFILE | API & INTEGRATION SKILLS |
| Junior AI/ML Engineer | OBJECTIVE | AI & ML SKILLS |
| Frontend Developer | ABOUT | FRONTEND TOOLKIT |
| Junior DevOps Engineer | PROFILE | DEVOPS & CLOUD SKILLS |
| Junior Software Engineer | SUMMARY | TECHNICAL SKILLS |
| AI Application Developer | SUMMARY | AI APPLICATION SKILLS |
| Platform Engineer | PROFILE | PLATFORM SKILLS |
| SaaS Product Engineer | SUMMARY | PRODUCT & TECHNICAL SKILLS |
| Solutions Engineer | PROFILE | SKILLS |
| MarTech Developer | SUMMARY | MARTECH SKILLS |

#### B. Different Section Ordering
- Some resumes put **Projects before Experience** (e.g., Full-Stack, API Developer, Frontend)
- Some use **custom section names** like "SHIPPED AI PRODUCTS" or "WHAT I BUILT" instead of "PROJECTS"
- Some lead with skills, others with experience

#### C. Different Skill Groupings
Each resume groups skills into role-relevant categories:
- Backend: Core / Auth & Security / Data / DevOps
- Frontend: Frameworks / Styling / State & Data / Mobile & Perf
- DevOps: Cloud / Containers / CI-CD / Infra / Scripting
- MarTech: Social APIs / Marketing / AI Content / Stack

#### D. Different Bullet Point Phrasing
The same project (e.g., Neuroviai) is described differently in each resume:
- Backend resume → emphasizes FastAPI, microservices, PostgreSQL
- Frontend resume → emphasizes Next.js 14, Tailwind, responsive UI
- AI/ML resume → emphasizes LLM orchestration, prompt engineering, RAG
- MarTech resume → emphasizes social media APIs, content scheduling, analytics

#### E. Different Projects Highlighted
Not every resume includes every project. Each resume picks 2-3 projects most relevant to that role.

---

## 5. CV CREATION (2-3 Pages)

The CV uses a richer format compared to the ATS resumes:

```latex
\documentclass[11pt]{article}
\usepackage[margin=0.6in]{geometry}       % Slightly wider margins than resumes
\usepackage{fontawesome5}                  % Icons (phone, email, GitHub, etc.)
\usepackage{tabularx}                      % Aligned skill tables
\usepackage{xcolor}                        % Colored hyperlinks

% Styled section headers with underline rule
\titleformat{\section}{\large\bfseries\scshape}{}{0pt}{}[\titlerule]

% Colored links (acceptable in CVs, not in ATS resumes)
\hypersetup{colorlinks=true, linkcolor=blue!70!black, urlcolor=blue!70!black}
```

### CV Sections (comprehensive)
1. Professional Summary
2. Education (with relevant coursework)
3. Technical Skills (tabular format — 7 categories)
4. Work Experience (detailed bullets for each role)
5. Projects (all 5 projects with full descriptions)
6. Publications & Research
7. Achievements & Competitions
8. Certifications (with Google Drive link)
9. Extracurricular & Leadership
10. Languages
11. Online Profiles & Portfolio

---

## 6. COVER LETTER

- Uses `fontawesome5` for icons in the signature
- Uses `\today` command so the date auto-updates on every compile
- Single-page format with standard business letter structure
- Highlights Neuroviai, internship, freelance work, IEEE paper, and hackathon wins
- Includes Drive link to certificate portfolio

---

## 7. COLD EMAIL TEMPLATE

- Uses `\newcommand{\blank}[1]{\underline{\hspace{#1}}}` to create fill-in-the-blank underlines
- Includes three sections:
  1. **Main cold email** with blanks for: recipient, company, specific area, company-specific bullet, role type
  2. **Follow-up email** template (for 4-5 days later)
  3. **Cold email tips** (8 actionable guidelines)

---

## 8. COMPILING LaTeX TO PDF

### Tool: XeLaTeX (via MiKTeX)
We used **XeLaTeX** instead of pdfLaTeX because:
- It supports the `fontawesome5` package (used in CV, letter, and email)
- It handles Unicode characters natively
- It's included with MiKTeX on Windows

### Installation
MiKTeX was already installed at:
```
C:\Users\Jeet\AppData\Local\Programs\MiKTeX\miktex\bin\x64\
```

### Compilation Command
```powershell
# Single file
xelatex -interaction=nonstopmode -output-directory="OUTPUT_DIR" "INPUT_FILE.tex"

# Batch compile all .tex files in ATS folder
$texFiles = Get-ChildItem "C:\Users\Jeet\OneDrive\Desktop\resumes\ATS\*.tex"
$tempDir = "C:\Users\Jeet\OneDrive\Desktop\resumes\ATS\temp_build"
New-Item -ItemType Directory -Path $tempDir -Force | Out-Null

foreach ($f in $texFiles) {
    Write-Host "Compiling $($f.Name)..."
    xelatex -interaction=nonstopmode -output-directory="$tempDir" $f.FullName | Out-Null
    $pdfName = $f.BaseName + ".pdf"
    $src = Join-Path $tempDir $pdfName
    $dst = Join-Path "C:\Users\Jeet\OneDrive\Desktop\resumes\ATS-PDF" $pdfName
    if (Test-Path $src) {
        Copy-Item $src $dst -Force
        Write-Host "  OK -> $pdfName"
    } else {
        Write-Host "  FAILED: $pdfName not found"
    }
}

Remove-Item $tempDir -Recurse -Force
```

### Key Flags
| Flag | Purpose |
|------|---------|
| `-interaction=nonstopmode` | Don't pause on errors; continue compiling |
| `-output-directory` | Write .pdf, .aux, .log files to a temp folder (keeps ATS folder clean) |

### Temp Build Directory Pattern
We compile into a `temp_build/` folder and then copy only the `.pdf` files to `ATS-PDF/`. This avoids cluttering the source folder with `.aux`, `.log`, `.out`, and other LaTeX build artifacts.

---

## 9. CONVERTING TO WORD (.docx)

### Tool: Pandoc
Pandoc converts between document formats. It was already installed at:
```
C:\Users\Jeet\AppData\Local\Pandoc\pandoc.exe
```

### Conversion Command
```powershell
# Cover letter
pandoc "ATS\sangramjeet_cover_letter.tex" -o "ATS-PDF\sangramjeet_cover_letter.docx" --from latex --to docx

# Cold email
pandoc "ATS\sangramjeet_cold_email.tex" -o "ATS-PDF\sangramjeet_cold_email.docx" --from latex --to docx
```

### Why Only Letter & Email?
- **Resumes and CV** → Stay as PDF (preserves exact formatting, ATS systems read PDFs)
- **Letter and email** → Also in .docx so you can easily fill in the blanks in Word/Google Docs before sending

---

## 10. FINAL FILE STRUCTURE

```
resumes/
├── ATS/                              # LaTeX source files
│   ├── sangramjeet_backend_developer_python.tex
│   ├── sangramjeet_fullstack_developer.tex
│   ├── sangramjeet_api_developer.tex
│   ├── sangramjeet_junior_ai_ml_engineer.tex
│   ├── sangramjeet_frontend_developer.tex
│   ├── sangramjeet_junior_devops_engineer.tex
│   ├── sangramjeet_junior_software_engineer.tex
│   ├── sangramjeet_ai_application_developer.tex
│   ├── sangramjeet_platform_engineer.tex
│   ├── sangramjeet_saas_product_engineer.tex
│   ├── sangramjeet_solutions_engineer.tex
│   ├── sangramjeet_martech_developer.tex
│   ├── sangramjeet_cv.tex
│   ├── sangramjeet_cover_letter.tex
│   └── sangramjeet_cold_email.tex
│
├── ATS-PDF/                          # Compiled output
│   ├── sangramjeet_backend_developer_python.pdf
│   ├── sangramjeet_fullstack_developer.pdf
│   ├── sangramjeet_api_developer.pdf
│   ├── sangramjeet_junior_ai_ml_engineer.pdf
│   ├── sangramjeet_frontend_developer.pdf
│   ├── sangramjeet_junior_devops_engineer.pdf
│   ├── sangramjeet_junior_software_engineer.pdf
│   ├── sangramjeet_ai_application_developer.pdf
│   ├── sangramjeet_platform_engineer.pdf
│   ├── sangramjeet_saas_product_engineer.pdf
│   ├── sangramjeet_solutions_engineer.pdf
│   ├── sangramjeet_martech_developer.pdf
│   ├── sangramjeet_cv.pdf
│   ├── sangramjeet_cover_letter.pdf
│   ├── sangramjeet_cold_email.pdf
│   ├── sangramjeet_cover_letter.docx
│   └── sangramjeet_cold_email.docx
│
├── ilovepdf_merged.docx              # Source content (merged from original PDFs)
├── unit.tex                          # Original LaTeX template reference
└── .venv/                            # Python virtual environment (python-docx)
```

---

## 11. TOOLS SUMMARY

| Tool | Version/Source | Purpose |
|------|---------------|---------|
| **VS Code** | Editor | Writing and editing LaTeX files |
| **GitHub Copilot (Claude)** | AI Assistant | Generated all LaTeX code, managed workflow |
| **MiKTeX** | `C:\...\MiKTeX\` | LaTeX distribution providing xelatex compiler |
| **XeLaTeX** | Via MiKTeX | Compiled .tex → .pdf (supports fontawesome5, Unicode) |
| **Pandoc** | `C:\...\Pandoc\` | Converted .tex → .docx for letter and email |
| **Python 3 + python-docx** | `.venv/` | Extracted text from merged .docx source file |
| **iLovePDF** | Online | Merged original PDF resumes into single .docx |

---

## 12. HOW TO MODIFY AND RECOMPILE

### Edit a resume
1. Open the `.tex` file in VS Code (from the `ATS/` folder)
2. Make your changes
3. Recompile:
```powershell
xelatex -interaction=nonstopmode -output-directory="ATS-PDF" "ATS\sangramjeet_backend_developer_python.tex"
```

### Recompile all at once
```powershell
Get-ChildItem "ATS\*.tex" | ForEach-Object {
    xelatex -interaction=nonstopmode -output-directory="ATS-PDF" $_.FullName
}
```

### Re-export letter/email to Word
```powershell
pandoc "ATS\sangramjeet_cover_letter.tex" -o "ATS-PDF\sangramjeet_cover_letter.docx" --from latex --to docx
pandoc "ATS\sangramjeet_cold_email.tex" -o "ATS-PDF\sangramjeet_cold_email.docx" --from latex --to docx
```

---

## 13. KEY LATEX PACKAGES REFERENCE

| Package | What It Does |
|---------|-------------|
| `geometry` | Sets page margins |
| `enumitem` | Controls bullet point spacing (noitemsep, topsep, parsep) |
| `hyperref` | Makes URLs and emails clickable |
| `titlesec` | Controls section header formatting and spacing |
| `fontawesome5` | Provides icons (phone, email, GitHub, globe, folder) |
| `tabularx` | Creates flexible-width tables (used in CV skills section) |
| `xcolor` | Colored text and links (used in CV and letter) |
| `ulem` | Underline formatting (used in cold email for blanks) |

---

*This document was generated as part of the resume-building session using GitHub Copilot in VS Code.*
