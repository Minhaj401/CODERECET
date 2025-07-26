import React from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line
} from 'recharts';
import { ChartBarIcon, HeartIcon } from '@heroicons/react/24/outline';

const emotionColors = {
  happy: '#10B981',
  calm: '#60A5FA',
  frustrated: '#F87171',
  confused: '#FBBF24',
};

function ProgressAnalytics({ learningData, emotionData }) {
  // Sample data structure if not provided
  const sampleLearningData = learningData || [
    { date: '2024-01-01', progress: 30, subject: 'Math' },
    { date: '2024-01-02', progress: 45, subject: 'English' },
    { date: '2024-01-03', progress: 60, subject: 'Science' },
    { date: '2024-01-04', progress: 75, subject: 'Math' },
    { date: '2024-01-05', progress: 85, subject: 'English' },
  ];

  const sampleEmotionData = emotionData || [
    { date: '2024-01-01', emotion: 'happy', duration: 45 },
    { date: '2024-01-02', emotion: 'frustrated', duration: 20 },
    { date: '2024-01-03', emotion: 'calm', duration: 60 },
    { date: '2024-01-04', emotion: 'confused', duration: 15 },
    { date: '2024-01-05', emotion: 'happy', duration: 55 },
  ];

  return (
    <div className="space-y-8">
      {/* Progress Over Time */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-sm">
        <div className="flex items-center gap-2 mb-6">
          <ChartBarIcon className="h-6 w-6 text-primary" />
          <h2 className="text-xl font-semibold">Learning Progress</h2>
        </div>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={sampleLearningData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis
                dataKey="date"
                stroke="#6B7280"
                fontSize={12}
                tickFormatter={(value) => new Date(value).toLocaleDateString()}
              />
              <YAxis stroke="#6B7280" fontSize={12} />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                }}
                formatter={(value, name) => [`${value}%`, 'Progress']}
                labelFormatter={(value) => new Date(value).toLocaleDateString()}
              />
              <Area
                type="monotone"
                dataKey="progress"
                stroke="#6366F1"
                fill="#6366F1"
                fillOpacity={0.1}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Emotional State Analysis */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-sm">
        <div className="flex items-center gap-2 mb-6">
          <HeartIcon className="h-6 w-6 text-primary" />
          <h2 className="text-xl font-semibold">Emotional Patterns</h2>
        </div>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={sampleEmotionData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis
                dataKey="date"
                stroke="#6B7280"
                fontSize={12}
                tickFormatter={(value) => new Date(value).toLocaleDateString()}
              />
              <YAxis stroke="#6B7280" fontSize={12} />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                }}
                formatter={(value, name) => [`${value} min`, name]}
                labelFormatter={(value) => new Date(value).toLocaleDateString()}
              />
              <Line
                type="monotone"
                dataKey="duration"
                stroke="#6366F1"
                strokeWidth={2}
                dot={{
                  fill: ({ emotion }) => emotionColors[emotion] || '#6366F1',
                  r: 6,
                }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Emotion Legend */}
        <div className="mt-6 flex flex-wrap gap-4">
          {Object.entries(emotionColors).map(([emotion, color]) => (
            <div key={emotion} className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: color }} />
              <span className="text-sm text-gray-600 capitalize">{emotion}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ProgressAnalytics;