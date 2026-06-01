
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider, useTheme } from './contexts/ThemeContext';
import Navbar from './components/Navbar';
import Profile from './pages/Profile';
import CVMaker from './pages/Portfolio';
import CVEditor from './pages/CVEditorAI';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import ATSResumeBuilder from './pages/ATSResumeBuilder';
import Templates from './pages/Templates';
import AITailorWizard from './pages/AITailorWizard';
import ErrorBoundary from './components/ErrorBoundary';
import { useAuth } from './contexts/AuthContext';
import { useParams } from 'react-router-dom';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0A0A0F]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/signup" state={{ from: location }} replace />;
  }

  return <>{children}</>;
}

function CVEditorGuard() {
  const { user, loading } = useAuth();
  const { id } = useParams();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0A0A0F]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600" />
      </div>
    );
  }

  // Allow guest access to editing their one free template
  if (id === 'guest') {
    return <CVEditor />;
  }

  if (!user) {
    return <Navigate to="/signup" state={{ from: location }} replace />;
  }

  return <CVEditor />;
}

/**
 * App content that requires AuthProvider context and ThemeProvider
 */
function AppContent() {
  const location = useLocation();
  const { theme } = useTheme();

  const isHomePage = location.pathname === '/';

  // Home page is forced to remain dark mode-first.
  // Other pages toggle background from slate dark-first (#0A0A0F) to crisp neutral gray-50 (#F9FAFB).
  const bgClass = isHomePage
    ? 'bg-[#0A0A0F]'
    : theme === 'dark'
      ? 'bg-[#0A0A0F]'
      : 'bg-gray-50';

  return (
    <div className={`min-h-screen ${bgClass} transition-colors duration-300`}>
      <Navbar />
      <main>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          
          {/* Protected Routes */}
          <Route path="/ats-resume" element={<ProtectedRoute><ATSResumeBuilder /></ProtectedRoute>} />
          <Route path="/tailor-resume" element={<ProtectedRoute><AITailorWizard /></ProtectedRoute>} />
          <Route path="/templates" element={<ProtectedRoute><Templates /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="/portfolio" element={<ProtectedRoute><CVMaker /></ProtectedRoute>} />
          <Route path="/cv/edit/:id" element={<CVEditorGuard />} />
          <Route path="/cv/new" element={<ProtectedRoute><CVEditor /></ProtectedRoute>} />
          
          {/* Catch-all redirect */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  );
}

/**
 * Main App Component - CV Forge
 */
function App() {
  return (
    <ErrorBoundary>
      <Router>
        <ThemeProvider>
          <AuthProvider>
            <AppContent />
          </AuthProvider>
        </ThemeProvider>
      </Router>
    </ErrorBoundary>
  );
}

export default App;