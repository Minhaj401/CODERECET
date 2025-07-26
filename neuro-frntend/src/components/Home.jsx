import React from 'react';
import { useNavigate } from 'react-router-dom';

function Home() {
  const navigate = useNavigate();

  return (
    <div 
      className="min-h-screen flex items-center justify-center bg-gradient-to-br from-violet-50 to-purple-100 dark:bg-gray-900"
      style={{
        backgroundImage: "url('/1.png')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      <div className="text-center p-8 max-w-2xl">
        <h1 className="text-6xl font-bold text-primary dark:text-violet-400 mb-6 animate-glow">
          NeuroPaths
        </h1>
        <p className="text-xl text-gray-700 dark:text-gray-300 mb-8">
          Embark on a personalized learning journey tailored to your unique cognitive style. 
          Discover, adapt, and grow with our innovative educational platform.
        </p>
        <button
          onClick={() => navigate('/role-selection')}
          className="px-8 py-3 bg-primary hover:bg-primary-dark text-white font-semibold rounded-lg 
                     transition-colors duration-200 transform hover:scale-105"
        >
          Get Started
        </button>
      </div>
    </div>
  );
}

export default Home;