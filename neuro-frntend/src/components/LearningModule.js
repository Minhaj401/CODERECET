import React, { useState } from 'react';
import { BookOpenIcon, CheckCircleIcon, ArrowPathIcon } from '@heroicons/react/24/outline';

const subjects = {
  english: {
    name: 'English',
    modules: [
      {
        title: 'Reading Comprehension',
        content: 'Practice understanding text passages with visual aids and audio support.',
        activities: ['Read story with audio', 'Answer questions', 'Vocabulary practice'],
      },
      {
        title: 'Grammar Quest',
        content: 'Learn grammar rules through interactive exercises and visual examples.',
        activities: ['Watch animation', 'Practice exercises', 'Take quiz'],
      },
    ],
  },
  math: {
    name: 'Mathematics',
    modules: [
      {
        title: 'Visual Math Concepts',
        content: 'Understanding mathematical concepts through visual representations.',
        activities: ['Watch demonstration', 'Try examples', 'Solve problems'],
      },
      {
        title: 'Step-by-Step Problem Solving',
        content: 'Learn to break down and solve math problems systematically.',
        activities: ['Follow guided solution', 'Practice method', 'Independent solving'],
      },
    ],
  },
  science: {
    name: 'Science',
    modules: [
      {
        title: 'Interactive Biology',
        content: 'Explore biological concepts through interactive visualizations.',
        activities: ['Watch simulation', 'Label diagrams', 'Complete quiz'],
      },
      {
        title: 'Chemistry Basics',
        content: 'Learn fundamental chemistry concepts with visual aids.',
        activities: ['View molecular models', 'Balance equations', 'Test knowledge'],
      },
    ],
  },
};

function LearningModule({ subject = 'english', onEmotionDetected }) {
  const [currentModule, setCurrentModule] = useState(0);
  const [isSlowMode, setIsSlowMode] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleEmotionFeedback = (emotion) => {
    if (emotion === 'frustrated') {
      setIsSlowMode(true);
    }
    onEmotionDetected?.(emotion);
  };

  const subjectData = subjects[subject];
  const currentModuleData = subjectData.modules[currentModule];

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-sm space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-gray-900">{subjectData.name}</h2>
        {isSlowMode && (
          <div className="flex items-center gap-2 text-amber-600 bg-amber-50 px-3 py-1 rounded-full text-sm">
            <ArrowPathIcon className="h-4 w-4" />
            Slow Mode Active
          </div>
        )}
      </div>

      <div className="space-y-6">
        <div className="bg-gray-50 rounded-xl p-6">
          <h3 className="text-xl font-medium mb-4">{currentModuleData.title}</h3>
          <p className="text-gray-600 mb-4">{currentModuleData.content}</p>
          
          <div className="space-y-4">
            {currentModuleData.activities.map((activity, index) => (
              <div
                key={index}
                className="flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-100"
              >
                {index <= progress ? (
                  <CheckCircleIcon className="h-5 w-5 text-green-500" />
                ) : (
                  <div className="h-5 w-5 rounded-full border-2 border-gray-200" />
                )}
                <span className="text-gray-700">{activity}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between">
          <button
            onClick={() => handleEmotionFeedback('frustrated')}
            className="text-sm px-4 py-2 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors duration-200"
          >
            I need more time
          </button>
          
          <button
            onClick={() => {
              if (progress < currentModuleData.activities.length - 1) {
                setProgress(p => p + 1);
              } else if (currentModule < subjectData.modules.length - 1) {
                setCurrentModule(m => m + 1);
                setProgress(0);
              }
            }}
            className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary/90 transition-colors duration-200"
          >
            {progress < currentModuleData.activities.length - 1 ? 'Next Step' : 'Next Module'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default LearningModule;