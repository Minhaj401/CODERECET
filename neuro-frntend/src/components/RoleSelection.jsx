import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function RoleSelection() {
  const navigate = useNavigate();

  const handleSelect = (role) => {
    if (role === 'student') {
      navigate('/login');
    } else if (role === 'parent') {
      navigate('/parent-login');
    }
  };

  const backgroundStyle = {
    backgroundImage: "url('/img1.png')",
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    minHeight: '100vh',
    width: '100%',
  };

  return (
    <div style={backgroundStyle} className="min-h-screen">
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h2 className="text-4xl font-bold mb-12 text-primary">Choose Your Role</h2>
        <div className="flex gap-12">
          <button
            className="px-12 py-6 bg-primary text-white rounded-xl text-2xl font-semibold shadow-lg hover:bg-violet-700 transition-all hover:scale-105"
            onClick={() => handleSelect('student')}
          >
            Student
          </button>
          <button
            className="px-12 py-6 bg-violet-400 text-white rounded-xl text-2xl font-semibold shadow-lg hover:bg-violet-500 transition-all hover:scale-105"
            onClick={() => handleSelect('parent')}
          >
            Parent/Mentor
          </button>
        </div>
      </div>
    </div>
  );
} 