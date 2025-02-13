import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Profile from './pages/Profile';
import CVMaker from './pages/Portfolio';
import CVEditor from './pages/CVEditor';
import UseTemplate from './pages/UseTemplate';
import Home from './pages/Home';
import ForgotPassword from './pages/ForgotPassword';
import Creators from './pages/Creators';
import { useAuth } from './contexts/AuthContext';

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600" />
      </div>
    );
  }

  return user ? <>{children}</> : <Navigate to="/login" />;
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="min-h-screen bg-gray-50">
          <Navbar />
          <main>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route
                path="/profile"
                element={
                  <PrivateRoute>
                    <Profile />
                  </PrivateRoute>
                }
              />
              <Route path="/creators" element={<Creators />} />
              <Route
                path="/portfolio"
                element={
                  <PrivateRoute>
                    <CVMaker />
                  </PrivateRoute>
                }
              />
              <Route
                path="/cv/edit/:id"
                element={
                  <PrivateRoute>
                    <CVEditor />
                  </PrivateRoute>
                }
              />
              <Route
                path="/cv/use/:id"
                element={
                  <PrivateRoute>
                    <UseTemplate />
                  </PrivateRoute>
                }
              />
            </Routes>
          </main>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;