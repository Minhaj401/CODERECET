import React from 'react';

const emotions = [
  { emoji: '😊', name: 'Happy' },
  { emoji: '😔', name: 'Sad' },
  { emoji: '😌', name: 'Calm' },
  { emoji: '😤', name: 'Frustrated' },
  { emoji: '😃', name: 'Excited' },
  { emoji: '😴', name: 'Tired' },
];

function EmotionPicker({ selectedEmotion, onSelectEmotion }) {
  return (
    <div className="flex flex-wrap gap-2">
      {emotions.map((emotion) => (
        <button
          key={emotion.name}
          onClick={() => onSelectEmotion(emotion)}
          className={`p-2 rounded-lg transition-all duration-200 ${
            selectedEmotion?.name === emotion.name
              ? 'bg-primary/10 ring-2 ring-primary'
              : 'hover:bg-gray-100'
          }`}
        >
          <span className="text-2xl">{emotion.emoji}</span>
        </button>
      ))}
    </div>
  );
}

export default EmotionPicker;