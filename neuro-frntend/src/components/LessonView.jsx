import React, { useState, useEffect } from 'react';
import { ClockIcon, LightBulbIcon, ArrowPathIcon } from '@heroicons/react/24/outline';

const mockLesson = {
  id: 'lesson1',
  title: 'Introduction to Algebra',
  content: [
    {
      type: 'text',
      content: 'Algebra is a branch of mathematics dealing with symbols and the rules for manipulating those symbols.',
    },
    {
      type: 'example',
      content: 'For instance, in the equation x + 5 = 10, we can find x by subtracting 5 from both sides.',
    },
    {
      type: 'practice',
      question: 'If y + 3 = 8, what is the value of y?',
      options: ['2', '5', '7', '11'],
      correct: 1,
      hint: 'Try subtracting 3 from both sides of the equation.',
    },
  ],
  hints: [
    'Take your time to understand each concept before moving forward.',
    'Try to relate these concepts to real-world situations.',
    'Practice with different numbers to reinforce understanding.',
  ],
};

export default function LessonView({ onEmotionDetected }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [isSlowMode, setIsSlowMode] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [attempts, setAttempts] = useState(0);

  useEffect(() => {
    // Reset state when moving to a new step
    setShowHint(false);
    setSelectedAnswer(null);
    setShowFeedback(false);
    setAttempts(0);
  }, [currentStep]);

  const handleNeedTime = () => {
    setIsSlowMode(true);
    onEmotionDetected({ emoji: '😕', name: 'Frustrated' });
  };

  const handleAnswer = (index) => {
    setSelectedAnswer(index);
    setShowFeedback(true);
    setAttempts(prev => prev + 1);

    if (index !== mockLesson.content[currentStep].correct) {
      onEmotionDetected({ emoji: '😕', name: 'Frustrated' });
    } else {
      onEmotionDetected({ emoji: '😊', name: 'Happy' });
    }
  };

  const handleNext = () => {
    if (currentStep < mockLesson.content.length - 1) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const renderContent = () => {
    const current = mockLesson.content[currentStep];

    switch (current.type) {
      case 'text':
      case 'example':
        return (
          <div className="prose max-w-none">
            <p className={`${isSlowMode ? 'text-lg leading-relaxed' : ''}`}>
              {current.content}
            </p>
          </div>
        );
      case 'practice':
        return (
          <div className="space-y-6">
            <p className="text-lg font-medium">{current.question}</p>
            <div className="grid gap-4">
              {current.options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleAnswer(index)}
                  disabled={showFeedback}
                  className={`p-4 rounded-lg border text-left transition-all duration-200 ${selectedAnswer === index ? (index === current.correct ? 'border-green-500 bg-green-50' : 'border-red-500 bg-red-50') : 'border-gray-200 hover:border-primary'}`}
                >
                  {option}
                </button>
              ))}
            </div>
            {showFeedback && selectedAnswer !== current.correct && (
              <div className="text-red-600 mt-4">
                Try again! {attempts >= 2 && 'Consider using the hint below.'}
              </div>
            )}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">{mockLesson.title}</h1>
        <div className="mt-4 flex gap-4">
          <button
            onClick={handleNeedTime}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg ${isSlowMode ? 'bg-primary text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'} transition-colors duration-200`}
          >
            <ClockIcon className="w-5 h-5" />
            I need more time
          </button>
          <button
            onClick={() => setShowHint(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors duration-200"
          >
            <LightBulbIcon className="w-5 h-5" />
            Show hint
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-sm">
        {renderContent()}

        {/* Hints */}
        {showHint && (
          <div className="mt-6 p-4 bg-yellow-50 rounded-lg border border-yellow-100">
            <div className="flex items-start gap-3">
              <LightBulbIcon className="w-5 h-5 text-yellow-600 mt-0.5" />
              <div>
                <p className="font-medium text-yellow-800">Hint</p>
                <p className="mt-1 text-yellow-700">
                  {mockLesson.content[currentStep].type === 'practice'
                    ? mockLesson.content[currentStep].hint
                    : mockLesson.hints[currentStep % mockLesson.hints.length]}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className="mt-8 flex justify-between">
          <button
            onClick={() => setCurrentStep(prev => Math.max(0, prev - 1))}
            disabled={currentStep === 0}
            className="px-4 py-2 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          <button
            onClick={handleNext}
            disabled={currentStep === mockLesson.content.length - 1 || (mockLesson.content[currentStep].type === 'practice' && selectedAnswer !== mockLesson.content[currentStep].correct)}
            className="px-4 py-2 rounded-lg bg-primary text-white hover:bg-primary/90 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      </div>

      {/* Slow Mode Indicator */}
      {isSlowMode && (
        <div className="mt-4 flex items-center gap-2 text-primary">
          <ArrowPathIcon className="w-5 h-5" />
          <span>Slow mode is active - Take your time!</span>
        </div>
      )}
    </div>
  );
}