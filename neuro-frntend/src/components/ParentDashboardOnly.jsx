import React, { useState, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { ExclamationCircleIcon } from '@heroicons/react/24/outline';
import { useNavigate } from 'react-router-dom';

// Mock data for demonstration
const mockProgressData = [
  { subject: 'Math', completed: 75, total: 100, score: 85 },
  { subject: 'Science', completed: 60, total: 100, score: 92 },
  { subject: 'English', completed: 85, total: 100, score: 88 },
];

const mockEmotionalData = [
  { date: '2024-01-01', happy: 5, frustrated: 2, calm: 4 },
  { date: '2024-01-02', happy: 4, frustrated: 3, calm: 3 },
  { date: '2024-01-03', happy: 3, frustrated: 4, calm: 2 },
  { date: '2024-01-04', happy: 6, frustrated: 1, calm: 5 },
  { date: '2024-01-05', happy: 4, frustrated: 2, calm: 4 },
];

const mockAlerts = [
  { id: 1, type: 'slowdown', message: 'Your child paused twice in Math module', date: '2024-01-05' },
  { id: 2, type: 'quiz', message: 'Multiple attempts on Science quiz', date: '2024-01-04' },
  { id: 3, type: 'emotion', message: 'Signs of frustration in English module', date: '2024-01-03' },
];

const mockJourneyMap = [
  { id: 1, title: 'Cell Basics', icon: '🔬', completed: true },
  { id: 2, title: 'DNA Structure', icon: '🧬', completed: true },
  { id: 3, title: 'Cell Division', icon: '🧫', completed: false, current: true },
  { id: 4, title: 'Genetics', icon: '🧩', completed: false },
  { id: 5, title: 'Evolution', icon: '🌱', completed: false },
];

const backgroundStyle = {
  backgroundImage: "url('/Untitled design (3).png')",
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  backgroundRepeat: 'no-repeat',
  minHeight: '100vh',
  width: '100%',
};

export default function ParentDashboardOnly() {
  const [selectedChild] = useState('Alex'); // Mock selected child
  const [theme] = useState(() => {
    const savedSettings = localStorage.getItem('userSettings');
    if (savedSettings) {
      const settings = JSON.parse(savedSettings);
      return settings.theme || 'light';
    }
    return 'light';
  });
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear all user-related data
    localStorage.removeItem('userProfile');
    localStorage.removeItem('isParentView');
    localStorage.removeItem('emotionHistory');
    localStorage.removeItem('dyslexiaMode');
    localStorage.removeItem('userSettings');
    
    // Remove any cookies
    document.cookie.split(";").forEach(function(c) { 
      document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
    });
    
    // Navigate to home
    navigate('/');
  };

  useEffect(() => {
    document.body.classList.toggle('dark', theme === 'dark');
    return () => document.body.classList.remove('dark');
  }, [theme]);


  return (
    <div style={backgroundStyle} className="min-h-screen">
      <div className={`min-h-screen p-6 dark:bg-gray-900/80 text-gray-900 dark:text-white`}>
        <div className="max-w-7xl mx-auto">
          {/* Nav Bar */}
          <nav className="flex items-center justify-between py-4 mb-8">
            <span className="text-2xl font-bold text-primary dark:text-violet-400 cursor-pointer" onClick={() => navigate('/')}>NeuroPaths</span>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-semibold transition"
            >
              Logout
            </button>
          </nav>
          <header className="mb-8">
            <h1 className="text-3xl font-bold">Parent Dashboard</h1>
            <p className="text-gray-500 dark:text-gray-400">Monitoring {selectedChild}'s Progress</p>
          </header>
          {/* Progress Overview */}
          <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {mockProgressData.map((subject) => (
              <div key={subject.subject} className={`p-6 rounded-xl ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} shadow-sm`}>
                <h3 className="text-lg font-semibold mb-2">{subject.subject}</h3>
                <div className="flex justify-between items-center mb-2">
                  <span>Progress</span>
                  <span>{subject.completed}%</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                  <div
                    className="bg-blue-600 h-2.5 rounded-full"
                    style={{ width: `${subject.completed}%` }}
                  />
                </div>
                <div className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                  Score: {subject.score}%
                </div>
              </div>
            ))}
          </section>
          {/* Emotional Patterns */}
          <section className={`p-6 rounded-xl ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} shadow-sm mb-8`}>
            <h2 className="text-xl font-semibold mb-4">Emotional Patterns</h2>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={mockEmotionalData}>
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Area type="monotone" dataKey="happy" stackId="1" stroke="#4ade80" fill="#4ade80" fillOpacity={0.6} />
                  <Area type="monotone" dataKey="frustrated" stackId="1" stroke="#f87171" fill="#f87171" fillOpacity={0.6} />
                  <Area type="monotone" dataKey="calm" stackId="1" stroke="#60a5fa" fill="#60a5fa" fillOpacity={0.6} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </section>
          {/* Journey Map */}
          <section className={`p-6 rounded-xl ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} shadow-sm mb-8`}>
            <h2 className="text-xl font-semibold mb-4">Learning Journey - Biology</h2>
            <div className="flex items-center justify-between relative py-4">
              {mockJourneyMap.map((step, index) => (
                <div key={step.id} className="flex flex-col items-center relative z-10">
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center text-xl
                      ${step.completed ? 'bg-green-500' : step.current ? 'bg-blue-500' : 'bg-gray-300 dark:bg-gray-600'}
                      ${theme === 'dark' ? 'text-gray-900' : 'text-white'}`}
                  >
                    {step.icon}
                  </div>
                  <p className="mt-2 text-sm text-center max-w-[100px]">{step.title}</p>
                  {index < mockJourneyMap.length - 1 && (
                    <div
                      className={`absolute top-6 left-[60px] h-0.5 w-[calc(100%+60px)]
                        ${step.completed ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-600'}`}
                    />
                  )}
                </div>
              ))}
            </div>
          </section>
          {/* Alerts */}
          <section className={`p-6 rounded-xl ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} shadow-sm`}>
            <h2 className="text-xl font-semibold mb-4">Recent Alerts</h2>
            <div className="space-y-4">
              {mockAlerts.map((alert) => (
                <div
                  key={alert.id}
                  className={`flex items-start gap-4 p-4 rounded-lg
                    ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'}`}
                >
                  <ExclamationCircleIcon className="w-6 h-6 text-yellow-500 flex-shrink-0" />
                  <div>
                    <p className="font-medium">{alert.message}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{alert.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
} 