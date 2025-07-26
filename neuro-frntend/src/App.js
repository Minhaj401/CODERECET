import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import Home from './components/Home';
import Login from './components/Login';
import Onboarding from './components/Onboarding';
import Dashboard from './components/Dashboard';
import LessonView from './components/LessonView';
import Analytics from './components/Analytics';
import Settings from './components/Settings';
import ParentDashboard from './components/ParentDashboard';
import RoleSelection from './components/RoleSelection';
import ParentDashboardOnly from './components/ParentDashboardOnly';

function AppWrapper() {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(null);
  const [currentModule, setCurrentModule] = useState(null);
  const [settings, setSettings] = useState(null);
  const [isParentView, setIsParentView] = useState(false);
  const [dyslexiaMode, setDyslexiaMode] = useState(false);

  useEffect(() => {
    const savedUser = localStorage.getItem('userProfile');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }

    const savedSettings = localStorage.getItem('userSettings');
    if (savedSettings) {
      const parsedSettings = JSON.parse(savedSettings);
      setSettings(parsedSettings);
      applySettings(parsedSettings);
    } else {
      const defaultSettings = {
        theme: 'light',
        fontSize: 'medium',
        readingSpeed: 'normal',
        narrationEnabled: false,
        dyslexicFont: false,
        highContrast: false,
        autoPlayVideos: true,
        showProgressBar: true,
      };
      setSettings(defaultSettings);
      applySettings(defaultSettings);
      localStorage.setItem('userSettings', JSON.stringify(defaultSettings));
    }

    const parentView = localStorage.getItem('isParentView') === 'true';
    setIsParentView(parentView);

    // Check for dyslexia mode preference
    const savedDyslexiaMode = localStorage.getItem('dyslexiaMode') === 'true';
    setDyslexiaMode(savedDyslexiaMode);
  }, []);

  // Apply dyslexia mode to body
  useEffect(() => {
    if (dyslexiaMode) {
      document.body.classList.add('dyslexia-mode');
    } else {
      document.body.classList.remove('dyslexia-mode');
    }
  }, [dyslexiaMode]);

  // Restrict parent users to only the parent dashboard
  useEffect(() => {
    if (isParentView && location.pathname !== '/parent-dash') {
      navigate('/parent-dash', { replace: true });
    }
  }, [isParentView, location.pathname, navigate]);

  const handleOnboarding = (userData) => {
    const userProfile = {
      ...userData,
      id: Date.now().toString(),
      joinedAt: new Date().toISOString(),
    };
    localStorage.setItem('userProfile', JSON.stringify(userProfile));
    setUser(userProfile);
    
    // Set dyslexia mode based on learning style
    if (userData.learningStyle === 'auditory') {
      setDyslexiaMode(true);
      localStorage.setItem('dyslexiaMode', 'true');
    } else {
      setDyslexiaMode(false);
      localStorage.setItem('dyslexiaMode', 'false');
    }
    
    navigate('/dashboard');
  };

  const handleModuleSelect = (subjectId, moduleId) => {
    setCurrentModule({ subjectId, moduleId });
    navigate('/lesson');
  };

  const handleLogout = () => {
    localStorage.removeItem('userProfile');
    localStorage.removeItem('emotionHistory');
    localStorage.removeItem('dyslexiaMode');
    setUser(null);
    setCurrentModule(null);
    setIsParentView(false);
    setDyslexiaMode(false);
    navigate('/');
  };

  const applySettings = (newSettings) => {
    document.documentElement.classList.toggle('dark', newSettings.theme === 'dark');
    document.body.classList.toggle('dark', newSettings.theme === 'dark');

    document.documentElement.style.fontSize = {
      small: '14px',
      medium: '16px',
      large: '18px',
    }[newSettings.fontSize];

    document.documentElement.classList.toggle('font-dyslexic', newSettings.dyslexicFont);
    document.documentElement.classList.toggle('high-contrast', newSettings.highContrast);
    localStorage.setItem('theme', newSettings.theme);
  };

  const handleEmotionUpdate = (emotion) => {
    const emotionHistory = JSON.parse(localStorage.getItem('emotionHistory') || '[]');
    emotionHistory.push({
      emotion: emotion.name,
      timestamp: new Date().toISOString(),
      moduleId: currentModule?.moduleId,
    });
    localStorage.setItem('emotionHistory', JSON.stringify(emotionHistory));
  };

  const Header = () => {
    const location = useLocation();
    const currentPath = location.pathname;

    return (
      <header className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 
              onClick={() => navigate('/')} 
              className="text-4xl font-bold text-primary dark:text-violet-400 animate-glow cursor-pointer"
            >
              NeuroPaths
            </h1>
            <nav className="flex items-center gap-6">
              <button
                onClick={() => {
                  setIsParentView(false);
                  navigate('/dashboard');
                }}
                className={`px-4 py-2 rounded-lg transition-colors duration-200 
                  ${currentPath === '/dashboard' ? 'bg-primary text-white' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'}`}
              >
                Dashboard
              </button>
              <button
                onClick={() => navigate('/analytics')}
                className={`px-4 py-2 rounded-lg transition-colors duration-200 
                  ${currentPath === '/analytics' ? 'bg-primary text-white' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'}`}
              >
                Analytics
              </button>
              <button
                onClick={() => navigate('/settings')}
                className={`px-4 py-2 rounded-lg transition-colors duration-200 
                  ${currentPath === '/settings' ? 'bg-primary text-white' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'}`}
              >
                Settings
              </button>
              <button
                onClick={handleLogout}
                className="px-4 py-2 rounded-lg transition-colors duration-200 bg-red-500 hover:bg-red-600 text-white"
              >
                Logout
              </button>
            </nav>
          </div>
        </div>
      </header>
    );
  };

  // Only apply global background for non-login routes
  const isLoginRoute = location.pathname === '/login' || location.pathname === '/parent-login' || location.pathname === '/onboarding';

  return (
    <div className={isLoginRoute ? '' : `min-h-screen ${settings?.theme === 'dark' ? 'dark bg-gray-900' : 'bg-gradient-to-br from-violet-50 to-purple-100'}`}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/role-selection" element={<RoleSelection />} />
        <Route path="/login" element={<Login isParent={false} onLogin={handleOnboarding} />} />
        <Route path="/parent-login" element={<Login isParent={true} />} />
        <Route path="/parent-dash" element={<ParentDashboardOnly />} />
        <Route
          path="/onboarding"
          element={user ? <Navigate to="/dashboard" /> : <Onboarding onComplete={handleOnboarding} />}
        />
        <Route
          path="/dashboard"
          element={
            isParentView ? (
              <ParentDashboardOnly />
            ) : (
              <>
                <Header />
                <Dashboard user={user} onModuleSelect={handleModuleSelect} />
              </>
            )
          }
        />
        <Route
          path="/lesson"
          element={
            <>
              <Header />
              <LessonView moduleId={currentModule?.moduleId} onEmotionDetected={handleEmotionUpdate} />
            </>
          }
        />
        <Route
          path="/analytics"
          element={
            <>
              <Header />
              <Analytics />
            </>
          }
        />
        <Route
          path="/settings"
          element={
            <>
              <Header />
              <Settings
                onSettingsChange={(newSettings) => {
                  setSettings(newSettings);
                  applySettings(newSettings);
                }}
              />
            </>
          }
        />
      </Routes>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <AppWrapper />
    </Router>
  );
}
