
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Navbar from './components/Navbar';
import Profile from './pages/Profile';
import CVMaker from './pages/Portfolio';
import CVEditor from './pages/CVEditorAI';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import ForgotPassword from './pages/ForgotPassword';
import ATSResumeBuilder from './pages/ATSResumeBuilder';
import ErrorBoundary from './components/ErrorBoundary';



/**
 * App content that requires AuthProvider context
 */
function AppContent() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/ats-resume" element={<ATSResumeBuilder />} />
          
          {/* Protected Routes */}
          <Route path="/profile" element={<Profile />} />
          <Route path="/portfolio" element={<CVMaker />} />
          <Route path="/cv/edit/:id" element={<CVEditor />} />
          <Route path="/cv/new" element={<CVEditor />} />
          
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
        <AuthProvider>
          <AppContent />
        </AuthProvider>
      </Router>
    </ErrorBoundary>
  );
}

export default App;