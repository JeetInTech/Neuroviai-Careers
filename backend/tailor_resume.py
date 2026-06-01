#!/usr/bin/env python3
"""
CV Forge - AI LaTeX Resume Tailoring Engine & Compiler CLI
"""
import os
import sys
import glob
import subprocess
import tempfile
import shutil
import re
import argparse
from html.parser import HTMLParser
from typing import Dict, List, Optional

class JobDescriptionHTMLParser(HTMLParser):
    def __init__(self):
        super().__init__()
        self.text_parts = []
        self.in_ignored_tag = False
        self.ignored_tags = {'script', 'style', 'nav', 'footer', 'header', 'noscript', 'iframe', 'head'}

    def handle_starttag(self, tag, attrs):
        if tag in self.ignored_tags:
            self.in_ignored_tag = True

    def handle_endtag(self, tag):
        if tag in self.ignored_tags:
            self.in_ignored_tag = False

    def handle_data(self, data):
        if self.in_ignored_tag:
            return
        cleaned = data.strip()
        if cleaned:
            self.text_parts.append(cleaned)

def extract_text_from_html(html_content: str) -> str:
    parser = JobDescriptionHTMLParser()
    parser.feed(html_content)
    text = "\n".join(parser.text_parts)
    text = re.sub(r'[ \t]+', ' ', text)
    text = re.sub(r'\n+', '\n', text)
    return text.strip()

def scrape_job_description_url(url: str) -> str:
    print(f"\n[*] Fetching and scraping job description from URL: {url}...")
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.5",
    }
    
    try:
        import httpx
        with httpx.Client(follow_redirects=True, timeout=15) as client:
            resp = client.get(url, headers=headers)
            resp.raise_for_status()
            raw_html = resp.text
            
            text_content = extract_text_from_html(raw_html)
            if not text_content:
                raise ValueError("No text content could be extracted from the HTML.")
                
            print(f"[+] Successfully scraped job description from web page ({len(text_content)} characters).")
            return text_content
            
    except ImportError:
        print("[!] Warning: 'httpx' package is not installed.")
        print("    Attempting fallback with standard urllib...")
        try:
            import urllib.request
            req = urllib.request.Request(url, headers=headers)
            with urllib.request.urlopen(req, timeout=15) as response:
                raw_html = response.read().decode('utf-8', errors='ignore')
                text_content = extract_text_from_html(raw_html)
                if not text_content:
                    raise ValueError("No text content could be extracted from the HTML.")
                print(f"[+] Successfully scraped job description via urllib fallback ({len(text_content)} characters).")
                return text_content
        except Exception as e:
            print(f"[!] Fallback failed: {e}")
            raise
    except Exception as e:
        print(f"[!] Failed to fetch job description URL: {e}")
        raise

# Load groq package
try:
    from groq import Groq
except ImportError:
    print("Error: The 'groq' package is not installed.")
    print("Please install it by running: pip install groq")
    sys.exit(1)


def load_env(env_path: str) -> Dict[str, str]:
    """Helper to parse a standard .env file safely without third-party libraries"""
    if not os.path.exists(env_path):
        return {}
    
    env_vars = {}
    try:
        with open(env_path, "r", encoding="utf-8") as f:
            for line in f:
                line = line.strip()
                if not line or line.startswith("#"):
                    continue
                if "=" in line:
                    k, v = line.split("=", 1)
                    env_vars[k.strip()] = v.strip().strip('"').strip("'")
    except Exception as e:
        print(f"Warning: Failed to read .env file at {env_path}: {e}")
    
    return env_vars


def find_pdflatex() -> Optional[str]:
    """Identify the local LaTeX compiler on the system"""
    # Prefer the verified path we found on this Windows system
    username = os.getenv("USERNAME", "Jeet")
    verified_miktex = rf"C:\Users\{username}\AppData\Local\Programs\MiKTeX\miktex\bin\x64\pdflatex.exe"
    
    if os.path.exists(verified_miktex):
        return verified_miktex
        
    # Check other default paths as fallback
    paths_to_check = ["pdflatex"]
    if os.name == "nt":
        paths_to_check.extend([
            r"C:\Program Files\MiKTeX\miktex\bin\x64\pdflatex.exe",
            r"C:\texlive\2024\bin\windows\pdflatex.exe",
            r"C:\texlive\2023\bin\windows\pdflatex.exe"
        ])
    else:
        paths_to_check.extend([
            "/usr/bin/pdflatex",
            "/usr/local/bin/pdflatex"
        ])
        
    for path in paths_to_check:
        try:
            # Check version to verify it is runnable
            res = subprocess.run([path, "--version"], capture_output=True, text=True, timeout=5)
            if res.returncode == 0:
                return path
        except Exception:
            continue
            
    return None


def get_job_description() -> str:
    """Load the job description from file or prompt terminal input"""
    root_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    jd_file = os.path.join(root_dir, "job_description.txt")
    
    # Check if job_description.txt exists and has content
    if os.path.exists(jd_file):
        with open(jd_file, "r", encoding="utf-8") as f:
            content = f.read().strip()
            if content:
                print(f"\n[+] Automatically loaded job description from: {jd_file}")
                if content.startswith(("http://", "https://")):
                    try:
                        return scrape_job_description_url(content)
                    except Exception as e:
                        print(f"[!] URL scraping failed: {e}. Using raw URL text.")
                else:
                    print(f"    (First 100 characters: \"{content[:100]}...\")")
                return content

    print("\n[!] 'job_description.txt' was not found in the root directory or was empty.")
    print("    Tip: You can save the description or a URL in 'job_description.txt' in the project root to skip this step.")
    print("-" * 70)
    print("Paste target Job Description or Job Description URL below (Type 'EOF' on a new line and press Enter to finish):")
    print("-" * 70)
    
    lines = []
    while True:
        try:
            line = input()
            if line.strip() == "EOF":
                break
            lines.append(line)
            
            # Fast detection if they just pasted a single URL
            if len(lines) == 1 and line.strip().startswith(("http://", "https://")):
                url = line.strip()
                try:
                    return scrape_job_description_url(url)
                except Exception as e:
                    print(f"[!] Scraper failed: {e}. Please paste the raw text below (Type 'EOF' on a new line when done):")
                    lines = []
                    continue
        except EOFError:
            break
            
    return "\n".join(lines).strip()


def list_resumes(resumes_dir: str) -> List[str]:
    """Find and return all .tex resumes"""
    return glob.glob(os.path.join(resumes_dir, "*.tex"))


def clean_latex_response(text: str) -> str:
    """Clean up conversational text and markdown code blocks to extract pure LaTeX source code"""
    text = text.strip()
    
    # Try to find the start of LaTeX content
    doc_class_idx = text.find("\\documentclass")
    if doc_class_idx != -1:
        # Found \documentclass, search for the end of the document
        end_doc_idx = text.find("\\end{document}", doc_class_idx)
        if end_doc_idx != -1:
            return text[doc_class_idx : end_doc_idx + len("\\end{document}")].strip()
            
    # Fallback to standard stripping if \documentclass is missing
    if text.startswith("```latex"):
        text = text[len("```latex"):].strip()
    elif text.startswith("```"):
        text = text[3:].strip()
        
    if text.endswith("```"):
        text = text[:-3].strip()
        
    return text


def run_compilation(pdflatex_path: str, tex_path: str, output_dir: str) -> bool:
    """Compile LaTeX document twice to ensure hyperrefs and offsets are correctly built"""
    tex_filename = os.path.basename(tex_path)
    base_name = os.path.splitext(tex_filename)[0]
    pdf_filename = f"{base_name}.pdf"
    pdf_path = os.path.join(output_dir, pdf_filename)
    
    print(f"\n[*] Compiling LaTeX resume using: {pdflatex_path}...")
    
    try:
        # Run twice to resolve references
        for run_idx in range(1, 3):
            print(f"    - Pass {run_idx}/2...")
            res = subprocess.run([
                pdflatex_path, 
                "-interaction=nonstopmode", 
                "-halt-on-error", 
                tex_filename
            ], cwd=output_dir, capture_output=True, text=True, timeout=30)
            
            if res.returncode != 0:
                print(f"\n[!] Compilation Error on pass {run_idx}:")
                # Attempt to extract errors from log
                log_path = os.path.join(output_dir, f"{base_name}.log")
                if os.path.exists(log_path):
                    with open(log_path, "r", encoding="utf-8", errors="ignore") as log_f:
                        errors = [line for line in log_f if line.startswith("!")]
                        for err in errors[:5]:
                            print(f"    {err.strip()}")
                else:
                    print(res.stderr or res.stdout)
                return False
                
        # Clean up temporary aux files to keep workspace immaculate
        extensions_to_clean = [".aux", ".log", ".out", ".toc", ".synctex.gz"]
        for ext in extensions_to_clean:
            file_to_remove = os.path.join(output_dir, f"{base_name}{ext}")
            if os.path.exists(file_to_remove):
                os.remove(file_to_remove)
                
        if os.path.exists(pdf_path):
            print(f"[+] PDF compiled successfully: {pdf_path}")
            return True
            
    except subprocess.TimeoutExpired:
        print("\n[!] Error: LaTeX compilation timed out (exceeded 30s limit)")
    except Exception as e:
        print(f"\n[!] Compilation exception: {e}")
        
    return False


def main():
    print("=" * 70)
    print("          CV FORGE - AI LATEX RESUME TAILORING ENGINE & CLI")
    print("=" * 70)

    # Parse command line arguments
    parser = argparse.ArgumentParser(description="CV Forge - AI LaTeX Resume Tailoring Engine")
    parser.add_argument("--resume", help="Name or path of the resume .tex file to tailor")
    parser.add_argument("--job-desc", help="Job description raw text, file path, or URL")
    parser.add_argument("--headless", action="store_true", help="Run in headless mode without interactive prompting")
    args = parser.parse_args()

    # 1. Determine environment variables and find Groq API key
    backend_dir = os.path.dirname(os.path.abspath(__file__))
    root_dir = os.path.dirname(backend_dir)
    
    # Load env from root and backend
    env_data = {}
    env_data.update(load_env(os.path.join(root_dir, ".env")))
    env_data.update(load_env(os.path.join(backend_dir, ".env")))
    
    # Extract API key
    api_key = env_data.get("GROQ_API_KEY")
    if not api_key:
        print("Error: GROQ_API_KEY was not found in either the root or backend .env configurations.")
        sys.exit(1)
        
    # 2. Find LaTeX compiler
    pdflatex_path = find_pdflatex()
    if not pdflatex_path:
        print("\n[!] Warning: LaTeX compiler (pdflatex) not found.")
        print("    You can still tailor your LaTeX files, but the auto-compilation to PDF will be skipped.")
        print("    Ensure MiKTeX or TeX Live is installed and pdflatex is on the PATH.")
        
    # 3. Locate resumes directory
    resumes_dir = os.path.join(root_dir, "resumes")
    if not os.path.exists(resumes_dir):
        print(f"Error: Resumes directory not found at: {resumes_dir}")
        sys.exit(1)
        
    resumes = list_resumes(resumes_dir)
    if not resumes:
        print(f"Error: No LaTeX (.tex) resume files found inside the resumes folder: {resumes_dir}")
        sys.exit(1)
        
    # 4. Resolve Resume selection
    selected_resume_path = None
    if args.resume:
        # Try exact path, then check inside resumes/
        if os.path.exists(args.resume):
            selected_resume_path = args.resume
        else:
            # Try to match by filename or substring in resumes folder
            matches = []
            for r in resumes:
                if args.resume.lower() in os.path.basename(r).lower():
                    matches.append(r)
            if len(matches) == 1:
                selected_resume_path = matches[0]
            elif len(matches) > 1:
                print(f"\n[!] Ambiguous resume query '{args.resume}'. Matches:")
                for m_idx, match in enumerate(matches, 1):
                    print(f"  [{m_idx}] {os.path.basename(match)}")
                if args.headless:
                    print("Error: Headless mode cannot resolve ambiguous resume matches.")
                    sys.exit(1)
            else:
                print(f"\n[!] Could not find any resume matching '{args.resume}' in {resumes_dir}.")
                if args.headless:
                    sys.exit(1)

    if not selected_resume_path:
        if args.headless:
            # Default to the first resume if headless
            selected_resume_path = resumes[0]
            print(f"\n[+] Headless mode defaulting to resume: {os.path.basename(selected_resume_path)}")
        else:
            # Display selections interactively
            print("\nAvailable Resumes:")
            for idx, path in enumerate(resumes, 1):
                filename = os.path.basename(path)
                print(f" [{idx}] {filename} ({os.path.getsize(path)} bytes)")
                
            while True:
                try:
                    choice = input(f"\nSelect a resume to tailor [1-{len(resumes)}]: ").strip()
                    if not choice:
                        continue
                    choice_idx = int(choice) - 1
                    if 0 <= choice_idx < len(resumes):
                        selected_resume_path = resumes[choice_idx]
                        break
                except (ValueError, IndexError):
                    pass
                print(f"Invalid option. Please enter a number between 1 and {len(resumes)}.")

    print(f"\n[+] Selected: {os.path.basename(selected_resume_path)}")
    
    # 5. Retrieve Job Description
    job_description = None
    if args.job_desc:
        # Check if job_desc is a URL
        if args.job_desc.startswith(("http://", "https://")):
            try:
                job_description = scrape_job_description_url(args.job_desc)
            except Exception as e:
                print(f"[!] Error scraping URL: {e}")
                sys.exit(1)
        # Check if it's a file
        elif os.path.exists(args.job_desc):
            with open(args.job_desc, "r", encoding="utf-8") as f:
                job_description = f.read().strip()
            print(f"[+] Loaded job description from file: {args.job_desc}")
        else:
            # Treat it as raw text
            job_description = args.job_desc.strip()
            print("[+] Loaded job description from command-line raw text.")
    
    if not job_description:
        if args.headless:
            # Fall back to root job_description.txt
            jd_file = os.path.join(root_dir, "job_description.txt")
            if os.path.exists(jd_file):
                with open(jd_file, "r", encoding="utf-8") as f:
                    content = f.read().strip()
                if content:
                    if content.startswith(("http://", "https://")):
                        try:
                            job_description = scrape_job_description_url(content)
                        except Exception as e:
                            print(f"[!] Headless URL scraping failed: {e}")
                            sys.exit(1)
                    else:
                        job_description = content
                    print(f"[+] Headless mode loaded job description from {jd_file}")
            
            if not job_description:
                print("Error: Headless mode requires a valid job description via --job-desc or job_description.txt.")
                sys.exit(1)
        else:
            job_description = get_job_description()

    if not job_description:
        print("Error: Job description cannot be empty.")
        sys.exit(1)
        
    # Write scraped description to resumes/scraped_job_desc.txt
    try:
        scraped_file_path = os.path.join(resumes_dir, "scraped_job_desc.txt")
        with open(scraped_file_path, "w", encoding="utf-8") as f:
            f.write(job_description)
        print(f"[+] Copied final job description text to: {scraped_file_path}")
    except Exception as e:
        print(f"Warning: Failed to save scraped_job_desc.txt: {e}")

    # 6. Read LaTeX Source
    with open(selected_resume_path, "r", encoding="utf-8") as f:
        latex_source = f.read()
        
    # 7. Tailor resume content using Groq Llama 3.3 70B
    print(f"\n[*] Connecting to Groq using llama-3.3-70b-versatile...")
    print("[*] Rewriting resume blocks and injecting critical ATS keywords...")
    
    system_prompt = r"""You are an elite, highly professional ATS Optimization Engineer and veteran LaTeX typesetter who specializes in creating highly credible, interview-defensible, and high-scoring resumes.
Your task is to take a complete LaTeX resume and a target Job Description (JD), and dynamically optimize the resume content (Summary, Skills, Experience, Projects, Certifications, etc.) to align perfectly with the target role while ensuring the resume remains 100% authentic, realistic, and compiles perfectly.

CRITICAL INSTRUCTIONS FOR DYNAMIC, CREDIBLE RESUME TAILORING:
1. DYNAMIC PROFILE-TO-JD ANALYSIS:
   - Apply resume tailoring dynamically based on the relationship between the candidate profile and the target job description. Never assume specific projects, technologies, roles, industries, or resume sections.
   - Analyze all available projects, experience entries, skills, achievements, publications, certifications, and other resume content, then determine which items provide the strongest combination of relevance, impact, credibility, uniqueness, and keyword alignment for the target role.
   - Reorder, emphasize, compress, expand, or de-emphasize content based on objective relevance scoring rather than predefined rules.
   - A project should never be removed solely because it lacks direct keyword overlap if it represents a significant achievement, demonstrates advanced engineering ability, provides strong differentiation, or strengthens the overall candidate narrative. Conversely, a project should not be elevated solely because it contains matching keywords.
   - Continuously evaluate which experiences best support the target position and adapt the resume structure accordingly.

2. ATS OPTIMIZATION AS SIGNALS (NOT COMMANDS):
   - When optimizing for ATS, treat job description keywords as signals rather than commands. Extract required technologies, responsibilities, domains, and competencies, then identify equivalent, adjacent, transferable, or supporting evidence from the candidate's background.
   - Surface relevant keywords where appropriate while preserving factual accuracy and interview defensibility. Prefer emphasizing existing evidence over manufacturing new narratives.
   - If multiple projects demonstrate similar skills, prioritize the one with stronger impact, scale, complexity, ownership, measurable outcomes, or uniqueness.
   - Maintain a coherent professional story where all sections reinforce each other, ensuring the final resume simultaneously maximizes ATS visibility, recruiter relevance, technical credibility, and differentiation regardless of industry, company, or role type.

3. TRUTHFULNESS & SENIORITY CONSTRAINTS:
   - Keep the candidate's authentic professional voice. Do NOT exaggerate seniority. Do NOT claim the candidate has "mentored junior developers", "led cross-functional team collaborations", "led department-wide architectural planning", or "managed team budgets" unless there is clear, explicit evidence of such roles in the original resume. Focus strictly on direct engineering achievements, coding capabilities, and technical delivery as supported by the candidate's history.
   - Do NOT copy full phrases, templates, or sentences verbatim from the job description (keyword stuffing is easily flagged by recruiters). Express these values naturally in the candidate's own metrics-focused professional tone.
   - Do NOT inject entirely new complex technologies or platforms into the historical project descriptions if they were not part of the original project stack. If a technology requested in the JD is reasonably adjacent to the candidate's existing skillset, you may list it in the "Skills" section (e.g., under a "Familiar / Prior Exposure" classification or alongside databases/frontend lists) to ensure ATS discoverability, but do NOT fake project bullet points claims about them.

4. LATEX SYNTAX & PRESERVATION RULES:
   - DO NOT modify the LaTeX document preamble, document class, packages, margins, or personal header details (name, phone, email, links).
   - Properly escape all special characters to ensure perfect compilation (e.g., use \%, \&, \_, \$, \#, \{, \}).
   - Return ONLY the clean, raw LaTeX source code between \documentclass and \end{document} without wrapping in markdown backticks."""

    try:
        client = Groq(api_key=api_key)
        response = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": f"LaTeX Resume:\n{latex_source}\n\nTarget Job Description:\n{job_description}"}
            ],
            temperature=0.4, # Low temperature for factual, deterministic replacements
            max_tokens=6000
        )
        
        tailored_latex = clean_latex_response(response.choices[0].message.content)
        
        if not tailored_latex or "\\begin{document}" not in tailored_latex:
            print("\nError: Groq generated an invalid or empty LaTeX response. Please try again.")
            sys.exit(1)
            
        # 8. Save Tailored LaTeX File
        orig_filename = os.path.basename(selected_resume_path)
        base_name, _ = os.path.splitext(orig_filename)
        output_tex_filename = f"{base_name}_Tailored.tex"
        output_tex_path = os.path.join(resumes_dir, output_tex_filename)
        
        with open(output_tex_path, "w", encoding="utf-8") as f:
            f.write(tailored_latex)
            
        print(f"\n[+] Tailored LaTeX source file successfully saved: {output_tex_path}")
        
        # 9. Run Auto-compiler if available
        if pdflatex_path:
            success = run_compilation(pdflatex_path, output_tex_path, resumes_dir)
            if success:
                output_pdf_path = os.path.join(resumes_dir, f"{base_name}_Tailored.pdf")
                print("-" * 70)
                print("SUCCESS! ATS-OPTIMIZED TAILORED RESUME GENERATED!")
                print("-" * 70)
                print(f" [LaTeX Source] : {output_tex_path}")
                print(f" [Vector PDF]   : {output_pdf_path}")
                print("-" * 70)
            else:
                print("\n[!] Warning: LaTeX file generated but compilation failed.")
                print("    Please check the errors listed above or open the tailored .tex file manually to compile.")
        else:
            print("\n[!] PDF auto-compilation skipped (pdflatex not found).")
            print(f"    You can manually compile your tailored LaTeX file at: {output_tex_path}")

    except Exception as e:
        print(f"\n[!] Error during tailoring sequence: {e}")
        sys.exit(1)


if __name__ == "__main__":
    main()
