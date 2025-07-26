import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Login({ onLogin, isParent }) {
  // Dedicated background div style
  const bgStyle = {
    backgroundImage: isParent ? "url('/2.png')" : "url('/2wal.png')",
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    zIndex: 0,
    opacity: 1, // Changed from 0.5 to 1 for full visibility
  };

  const contentStyle = {
    position: 'relative',
    zIndex: 1,
    width: '100vw',
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: isParent ? 'flex-end' : 'flex-start',
    alignItems: 'center',
  };

  if (isParent) {
    return (
      <>
        <div style={bgStyle} />
        <div style={contentStyle}>
          <div className="w-full max-w-md mr-12">
            <h2 className="text-3xl font-bold mb-8 text-primary dark:text-violet-400 text-right w-full">Parent Login</h2>
            <form className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg w-96 ml-auto">
              <div className="mb-4 text-right">
                <label className="block text-gray-700 dark:text-gray-200 mb-2 text-right">Email</label>
                <input type="email" className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-right" />
              </div>
              <div className="mb-6 text-right">
                <label className="block text-gray-700 dark:text-gray-200 mb-2 text-right">Password</label>
                <input type="password" className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-right" />
              </div>
              <button type="submit" className="w-full bg-primary text-white py-2 rounded-lg font-semibold hover:bg-violet-700 transition">Login</button>
            </form>
          </div>
        </div>
      </>
    );
  }

  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    localStorage.setItem('userProfile', JSON.stringify({
      email: formData.email,
      id: Date.now().toString(),
      joinedAt: new Date().toISOString(),
    }));
    navigate('/dashboard');
  };

  return (
    <>
      <div style={bgStyle} />
      <div style={contentStyle}>
        <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-md ml-12">
          <h2 className="text-3xl font-bold text-primary dark:text-violet-400 mb-6">
            Welcome Back
          </h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Email
              </label>
              <input
                type="email"
                id="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 
                           focus:ring-2 focus:ring-primary dark:focus:ring-violet-400 
                           dark:bg-gray-700 dark:text-white"
                required
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Password
              </label>
              <input
                type="password"
                id="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 
                           focus:ring-2 focus:ring-primary dark:focus:ring-violet-400 
                           dark:bg-gray-700 dark:text-white"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full py-3 bg-primary hover:bg-primary-dark text-white font-semibold rounded-lg 
                         transition-colors duration-200 transform hover:scale-105"
            >
              Sign In
            </button>
          </form>
        </div>
      </div>
    </>
  );
}