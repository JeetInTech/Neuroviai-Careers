# CV Forge - Architecture & Development Guide

> AI-Powered ATS-Optimized Resume Builder with LaTeX Export

---

## 🎯 Project Vision

CV Forge is a modern, scalable resume builder platform designed to:
- Generate **90%+ ATS score** optimized resumes
- Support **LinkedIn import** for instant data extraction
- Export to **LaTeX code** or compiled **PDF**
- Target multiple roles (Software Engineer, Data Scientist, AI/ML, PM, Fresher, Freelancer)

---

## 🏗️ Architecture Overview

```
cv-forge/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── ui/              # Base UI primitives (buttons, inputs, modals)
│   │   ├── cv/              # CV-specific components (sections, previews)
│   │   └── shared/          # Shared components (Navbar, Footer)
│   ├── pages/               # Page-level components (routes)
│   ├── contexts/            # React Context providers
│   ├── hooks/               # Custom React hooks
│   ├── lib/                 # Utilities and services
│   │   ├── database.types.ts   # TypeScript types
│   │   ├── supabase.ts         # Supabase client
│   │   ├── latex-generator.ts  # LaTeX export engine
│   │   └── ats-optimizer.ts    # ATS scoring engine
│   ├── services/            # API and business logic
│   └── styles/              # Global styles and themes
├── supabase/                # Database migrations
└── public/                  # Static assets
```

---

## 🔧 Tech Stack

| Layer | Technology | Purpose |
|-------|------------|---------|
| **Frontend** | React 18 + TypeScript | UI framework |
| **Styling** | Tailwind CSS | Utility-first styling |
| **Build** | Vite | Fast development & builds |
| **Backend** | Supabase | Auth, Database, Storage |
| **Icons** | Lucide React | Consistent iconography |
| **PDF Export** | jsPDF + html2canvas | PDF generation |
| **LaTeX** | Custom generator | Clean .tex export |

---

## 📊 Database Schema

### Core Tables

```sql
-- User profiles
profiles (
  id: uuid PRIMARY KEY,
  email: text,
  username: text UNIQUE,
  display_name: text,
  avatar_url: text,
  cv_credits: integer DEFAULT 2,
  subscription_status: enum('free', 'premium', 'enterprise')
)

-- User resumes/CVs
cvs (
  id: uuid PRIMARY KEY,
  user_id: uuid REFERENCES profiles,
  template: text,
  target_role: text,
  ats_score: integer,
  personal_info: jsonb,
  education: jsonb[],
  experience: jsonb[],
  skills: jsonb[],
  languages: jsonb[],
  certifications: jsonb[],
  projects: jsonb[],
  created_at: timestamp,
  updated_at: timestamp
)
```

---

## 🎨 Component Architecture

### UI Components (Atomic Design)

```
components/
├── ui/                    # Atoms
│   ├── Button.tsx
│   ├── Input.tsx
│   ├── Modal.tsx
│   ├── Badge.tsx
│   └── Card.tsx
├── cv/                    # Molecules/Organisms
│   ├── CVPreview.tsx      # Live preview panel
│   ├── CVSection.tsx      # Section editor wrapper
│   ├── PersonalInfoForm.tsx
│   ├── ExperienceForm.tsx
│   ├── EducationForm.tsx
│   ├── SkillsForm.tsx
│   ├── ATSScoreCard.tsx   # ATS score display
│   └── LatexPreview.tsx   # LaTeX code preview
└── shared/
    ├── Navbar.tsx
    ├── Footer.tsx
    └── LoadingSpinner.tsx
```

---

## 🤖 AI/ATS Optimization Engine

### Scoring Algorithm

```typescript
// ats-optimizer.ts

Overall Score = 
  (Keyword Match × 0.40) +    // Role-specific keywords found
  (Content Score × 0.35) +     // Completeness of sections
  (Format Score × 0.25)        // Structure and formatting

// Grade Thresholds
90-100: A+ (Excellent)
80-89:  A  (Very Good)
70-79:  B  (Good)
60-69:  C  (Needs Improvement)
<60:    D  (Major Issues)
```

### Keyword Database by Role

- **Software Engineer**: JavaScript, TypeScript, React, Node.js, Python, SQL, Git, AWS, Docker
- **Data Scientist**: Python, ML, TensorFlow, Pandas, Statistical Analysis
- **AI/ML Engineer**: PyTorch, Deep Learning, NLP, Computer Vision, MLOps
- **Product Manager**: Roadmap, Agile, User Research, A/B Testing
- **Fresher**: Projects, Internships, Coursework, GPA

---

## 📄 LaTeX Export System

### Supported Templates

1. **Simple** - Clean, ATS-friendly format
2. **ModernCV** - Professional styling
3. **Awesome-CV** - Popular tech template
4. **Deedy** - Academic focused

### Export Options

```typescript
type LaTeXExportOptions = {
  template: 'simple' | 'moderncv' | 'awesome-cv' | 'deedy';
  font_size: '10pt' | '11pt' | '12pt';
  paper_size: 'a4paper' | 'letterpaper';
  include_photo: boolean;
};
```

---

## 🔐 Authentication Flow

```
User Flow:
1. Sign Up → Email verification → Create profile
2. Login → JWT token → Session stored in Supabase
3. Protected routes check AuthContext
4. Logout → Clear session → Redirect to home
```

### Auth Context

```typescript
type AuthContextType = {
  user: User | null;
  loading: boolean;
  signIn: (email, password) => Promise<void>;
  signUp: (email, password) => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email) => Promise<void>;
};
```

---

## 🚀 Future Roadmap

### Phase 1: Core Platform (Current)
- [x] User authentication
- [x] CV creation with templates
- [x] Basic CV editor
- [x] LaTeX export engine
- [x] ATS scoring engine
- [x] Modern UI redesign

### Phase 2: AI Enhancement
- [ ] LinkedIn profile import
- [ ] AI-powered bullet point rewriting
- [ ] Job description matching
- [ ] Smart skill suggestions
- [ ] OpenAI/Claude integration

### Phase 3: Growth Features
- [ ] Premium subscriptions (Stripe)
- [ ] Team/enterprise features
- [ ] Resume analytics dashboard
- [ ] Job board integration
- [ ] Interview prep AI

### Phase 4: Scale
- [ ] Multi-language support
- [ ] Mobile app (React Native)
- [ ] API for partners
- [ ] White-label solutions

---

## 🛠️ Development Commands

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint
```

---

## 📁 File Cleanup Summary

### Removed/Deprecated
- `pages/Creators.tsx` - Social media features (not aligned with core vision)
- `pages/UseTemplate.tsx` - Simplified into Portfolio page
- Complex credit/payment system - Simplified for MVP

### Refactored
- `pages/Home.tsx` - Complete redesign for CV Forge branding
- `pages/Portfolio.tsx` - Clean template selection UI
- `components/Navbar.tsx` - Updated branding and navigation
- `lib/database.types.ts` - Expanded with ATS/LaTeX types

### Added
- `lib/latex-generator.ts` - LaTeX export engine
- `lib/ats-optimizer.ts` - ATS scoring and suggestions

---

## 📌 Code Style Guidelines

1. **TypeScript** - Strict mode, explicit types
2. **Components** - Functional with hooks
3. **Styling** - Tailwind utility classes
4. **State** - React Context for global, useState for local
5. **Naming** - PascalCase for components, camelCase for functions
6. **Files** - kebab-case for utilities, PascalCase for components

---

## 🎨 Design System

### Colors
- **Primary**: Indigo 600 (`#4F46E5`)
- **Success**: Green 500 (`#22C55E`)
- **Warning**: Yellow 500 (`#EAB308`)
- **Error**: Red 500 (`#EF4444`)
- **Neutral**: Gray 50-900

### Typography
- **Headings**: Inter, Bold
- **Body**: Inter, Regular
- **Code**: JetBrains Mono

### Spacing
- Base unit: 4px
- Consistent use of Tailwind spacing scale

---

## 🤝 Contributing

1. Create feature branch from `main`
2. Follow code style guidelines
3. Write meaningful commit messages
4. Test thoroughly before PR
5. Request review from maintainers

---

*Built with ❤️ for job seekers everywhere*
