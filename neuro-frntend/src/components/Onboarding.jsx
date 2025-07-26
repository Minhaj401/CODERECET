import React, { useState, useEffect } from 'react';

export default function Onboarding({ onComplete }) {
  const [formData, setFormData] = useState({
    fullName: '',
    emailAddress: '',
    learningStyle: '',
    accommodations: [],
  });

  const updateFormData = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onComplete(formData);
  };

  const toggleAccommodation = (accommodation) => {
    setFormData(prev => ({
      ...prev,
      accommodations: prev.accommodations.includes(accommodation)
        ? prev.accommodations.filter(a => a !== accommodation)
        : [...prev.accommodations, accommodation],
    }));
  };

  // Apply dyslexia-friendly font when Auditory Learner is selected
  useEffect(() => {
    if (formData.learningStyle === 'auditory') {
      document.body.classList.add('dyslexia-mode');
    } else {
      document.body.classList.remove('dyslexia-mode');
    }

    // Cleanup on component unmount
    return () => {
      document.body.classList.remove('dyslexia-mode');
    };
  }, [formData.learningStyle]);

  const bgStyle = {
    backgroundImage: "url('/2.png')",
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    zIndex: 0,
    opacity: 0.5,
  };

  const contentStyle = {
    position: 'relative',
    zIndex: 1,
    width: '100vw',
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  };

  return (
    <>
      <div style={bgStyle} />
      <div style={contentStyle}>
        <div className="bg-white rounded-2xl p-8 shadow-lg">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome to Your Learning Journey</h1>
            <p className="text-gray-600">Let's personalize your learning experience.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Full Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
              <input
                type="text"
                value={formData.fullName}
                onChange={(e) => updateFormData('fullName', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                required
              />
            </div>

            {/* Email Address */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
              <input
                type="email"
                value={formData.emailAddress}
                onChange={(e) => updateFormData('emailAddress', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                required
              />
            </div>

            {/* Learning Style */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Learning Style</h3>
              <div className="space-y-3">
                <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="radio"
                    name="learningStyle"
                    value="visual"
                    checked={formData.learningStyle === 'visual'}
                    onChange={(e) => updateFormData('learningStyle', e.target.value)}
                    className="w-4 h-4 text-primary focus:ring-primary"
                  />
                  <span className="text-gray-700">Visual Learner: Learn best through images and diagrams</span>
                </label>
                <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="radio"
                    name="learningStyle"
                    value="auditory"
                    checked={formData.learningStyle === 'auditory'}
                    onChange={(e) => updateFormData('learningStyle', e.target.value)}
                    className="w-4 h-4 text-primary focus:ring-primary"
                  />
                  <span className="text-gray-700">Auditory Learner: Learn best through listening and discussion</span>
                </label>
                <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="radio"
                    name="learningStyle"
                    value="attention-deficient"
                    checked={formData.learningStyle === 'attention-deficient'}
                    onChange={(e) => updateFormData('learningStyle', e.target.value)}
                    className="w-4 h-4 text-primary focus:ring-primary"
                  />
                  <span className="text-gray-700">Attention-deficient Learner: Learn best through smaller contents</span>
                </label>
              </div>
            </div>

            {/* Learning Accommodations */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Learning Accommodations</h3>
              <div className="space-y-3">
                <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.accommodations.includes('dyslexia')}
                    onChange={() => toggleAccommodation('dyslexia')}
                    className="w-4 h-4 text-primary focus:ring-primary"
                  />
                  <span className="text-gray-700">Dyslexia</span>
                </label>
                <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.accommodations.includes('adhd')}
                    onChange={() => toggleAccommodation('adhd')}
                    className="w-4 h-4 text-primary focus:ring-primary"
                  />
                  <span className="text-gray-700">ADHD</span>
                </label>
                <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.accommodations.includes('dyscalculia')}
                    onChange={() => toggleAccommodation('dyscalculia')}
                    className="w-4 h-4 text-primary focus:ring-primary"
                  />
                  <span className="text-gray-700">Dyscalculia</span>
                </label>
                <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.accommodations.includes('none')}
                    onChange={() => toggleAccommodation('none')}
                    className="w-4 h-4 text-primary focus:ring-primary"
                  />
                  <span className="text-gray-700">None of the above</span>
                </label>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <button
                type="submit"
                className="w-full bg-primary text-white py-3 px-6 rounded-lg font-semibold hover:bg-primary-dark transition-colors duration-200"
              >
                View Progress
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}