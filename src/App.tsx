import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import ProtectedRoute from './components/ProtectedRoute';
import Header from './components/Header';
import Home from './pages/Home';
import About from './pages/About';
import Verify from './pages/Verify';
import Dashboard from './pages/Dashboard';
import Alerts from './pages/Alerts';
import VerificationResult from './pages/VerificationResult';
import Settings from './pages/Settings';
import Auth from './pages/Auth';
import AuthCallback from './pages/AuthCallback';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <div className="min-h-screen transition-colors duration-300">
            <Header />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/dashboard" element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } />
              <Route path="/verify" element={
                <ProtectedRoute>
                  <Verify />
                </ProtectedRoute>
              } />
              <Route path="/result" element={
                <ProtectedRoute>
                  <VerificationResult />
                </ProtectedRoute>
              } />
              <Route path="/settings" element={
                <ProtectedRoute>
                  <Settings />
                </ProtectedRoute>
              } />
              <Route path="/alerts" element={<Alerts />} />
              <Route path="/about" element={<About />} />
              <Route path="/auth/callback" element={<AuthCallback />} />
            </Routes>
          </div>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;