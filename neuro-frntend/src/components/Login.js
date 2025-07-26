import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const learningStyles = [
  { id: 'visual', label: 'Visual Learner', description: 'Learn best through images and diagrams' },
  { id: 'auditory', label: 'Auditory Learner', description: 'Learn best through listening and discussion' },
  { id: 'Attention', label: 'Attention-deficient Learner', description: 'Learn best through smaller contents' },
];

const learningDisabilities = [
  { id: 'dyslexia', label: 'Dyslexia' },
  { id: 'adhd', label: 'ADHD' },
];

function Login({ onLogin, isParent }) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    learningStyle: '',
    disabilities: [],
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isParent) {
      // Parent login logic (no learning style/accommodations)
      localStorage.setItem('userProfile', JSON.stringify({
        email: formData.email,
        password: formData.password,
        isParent: true,
      }));
      localStorage.setItem('isParentView', 'true');
      navigate('/parent-dash');
      if (onLogin) onLogin({ email: formData.email, isParent: true });
      return;
    }
    // Student login logic
    localStorage.setItem('userProfile', JSON.stringify(formData));
    // Store only the selected learning style as a cookie
    function setCookie(name, value, days) {
      let expires = '';
      if (days) {
        const date = new Date();
        date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
        expires = '; expires=' + date.toUTCString();
      }
      document.cookie = name + '=' + encodeURIComponent(value) + expires + '; path=/';
    }
    setCookie('learningStyle', formData.learningStyle, 365);
    if (onLogin) onLogin(formData);
  };

  const handleDisabilityChange = (disabilityId) => {
    setFormData(prev => {
      if (disabilityId === 'none') {
        return { ...prev, disabilities: ['none'] };
      }
      const newDisabilities = prev.disabilities.includes(disabilityId)
        ? prev.disabilities.filter(id => id !== disabilityId)
        : [...prev.disabilities.filter(id => id !== 'none'), disabilityId];
      return { ...prev, disabilities: newDisabilities };
    });
  };

  if (isParent) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-violet-50 to-purple-100 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8 bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-sm">
          <div>
            <h1 className="text-4xl font-bold text-primary animate-glow text-center mb-2">NeuroPaths</h1>
            <h2 className="mt-6 text-center text-2xl font-medium text-gray-900">Parent Login</h2>
          </div>
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email Address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />
              </div>
            </div>
            <button
              type="submit"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors duration-200"
            >
              Login
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-violet-50 to-purple-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-sm">
        <div>
          <h1 className="text-4xl font-bold text-primary animate-glow text-center mb-2">NeuroPaths</h1>
          <h2 className="mt-6 text-center text-2xl font-medium text-gray-900">Welcome to Your Learning Journey</h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Let's personalize your learning experience
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Full Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Learning Style
              </label>
              <div className="space-y-2">
                {learningStyles.map((style) => (
                  <div key={style.id} className="flex items-center">
                    <input
                      id={style.id}
                      name="learningStyle"
                      type="radio"
                      required
                      className="h-4 w-4 text-primary focus:ring-primary border-gray-300"
                      checked={formData.learningStyle === style.id}
                      onChange={() => setFormData({ ...formData, learningStyle: style.id })}
                    />
                    <label htmlFor={style.id} className="ml-3">
                      <span className="block text-sm font-medium text-gray-700">{style.label}</span>
                      <span className="block text-sm text-gray-500">{style.description}</span>
                    </label>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Learning Accommodations
              </label>
              <div className="space-y-2">
                {learningDisabilities.map((disability) => (
                  <div key={disability.id} className="flex items-center">
                    <input
                      id={disability.id}
                      name="disabilities"
                      type="checkbox"
                      className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                      checked={formData.disabilities.includes(disability.id)}
                      onChange={() => handleDisabilityChange(disability.id)}
                    />
                    <label htmlFor={disability.id} className="ml-3 text-sm text-gray-700">
                      {disability.label}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <button
            type="submit"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors duration-200"
          >
            View Progress
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;