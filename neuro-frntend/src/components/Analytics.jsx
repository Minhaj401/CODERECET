import React, { useState } from 'react';
import {
  LineChart, Line, AreaChart, Area, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer, Legend,
  Bar, BarChart
} from 'recharts';

const mockEmotionData = [
  { date: '2024-01-01', happy: 4, calm: 3, frustrated: 1 },
  { date: '2024-01-02', happy: 5, calm: 2, frustrated: 0 },
  { date: '2024-01-03', happy: 3, calm: 4, frustrated: 2 },
  { date: '2024-01-04', happy: 2, calm: 3, frustrated: 3 },
  { date: '2024-01-05', happy: 4, calm: 4, frustrated: 1 },
  { date: '2024-01-06', happy: 5, calm: 3, frustrated: 0 },
  { date: '2024-01-07', happy: 4, calm: 4, frustrated: 1 },
];

const mockProgressData = [
  { date: '2024-01-01', progress: 20 },
  { date: '2024-01-02', progress: 35 },
  { date: '2024-01-03', progress: 45 },
  { date: '2024-01-04', progress: 50 },
  { date: '2024-01-05', progress: 65 },
  { date: '2024-01-06', progress: 80 },
  { date: '2024-01-07', progress: 85 },
];

const mockSubjectProgress = [
  { subject: 'English', completed: 75, total: 100 },
  { subject: 'Mathematics', completed: 45, total: 100 },
  { subject: 'Science', completed: 60, total: 100 },
];

const emotionColors = {
  happy: '#10B981',
  calm: '#60A5FA',
  frustrated: '#EF4444',
};

export default function Analytics() {
  const [timeRange, setTimeRange] = useState('week');

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
  };

  const backgroundStyle = {
    backgroundImage: "url('/Untitled design (1).png')",
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    minHeight: '100vh',
    width: '100%',
  };

  return (
    <div style={backgroundStyle} className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Learning Analytics</h1>
          <p className="mt-2 text-gray-600">
            Track your progress and emotional patterns while learning
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Emotional Pattern Chart */}
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg">
            <div className="mb-6">
              <h2 className="text-xl font-semibold">Emotional Patterns</h2>
              <p className="text-sm text-gray-500 mt-1">
                Track how you feel during learning sessions
              </p>
            </div>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={mockEmotionData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="date"
                    tickFormatter={formatDate}
                    fontSize={12}
                  />
                  <YAxis fontSize={12} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'rgba(255, 255, 255, 0.9)',
                      borderRadius: '8px',
                      border: 'none',
                      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                    }}
                    formatter={(value, name) => [value, name.charAt(0).toUpperCase() + name.slice(1)]}
                    labelFormatter={(label) => formatDate(label)}
                  />
                  <Area
                    type="monotone"
                    dataKey="happy"
                    stackId="1"
                    stroke={emotionColors.happy}
                    fill={emotionColors.happy}
                    fillOpacity={0.6}
                  />
                  <Area
                    type="monotone"
                    dataKey="calm"
                    stackId="1"
                    stroke={emotionColors.calm}
                    fill={emotionColors.calm}
                    fillOpacity={0.6}
                  />
                  <Area
                    type="monotone"
                    dataKey="frustrated"
                    stackId="1"
                    stroke={emotionColors.frustrated}
                    fill={emotionColors.frustrated}
                    fillOpacity={0.6}
                  />
                  <Legend />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Learning Progress Chart */}
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg">
            <div className="mb-6">
              <h2 className="text-xl font-semibold">Learning Progress</h2>
              <p className="text-sm text-gray-500 mt-1">
                Your overall learning journey progress
              </p>
            </div>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={mockProgressData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="date"
                    tickFormatter={formatDate}
                    fontSize={12}
                  />
                  <YAxis fontSize={12} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'rgba(255, 255, 255, 0.9)',
                      borderRadius: '8px',
                      border: 'none',
                      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                    }}
                    formatter={(value) => [`${value}%`, 'Progress']}
                    labelFormatter={(label) => formatDate(label)}
                  />
                  <Line
                    type="monotone"
                    dataKey="progress"
                    stroke="#8B5CF6"
                    strokeWidth={2}
                    dot={{ fill: '#8B5CF6', strokeWidth: 2 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Subject Progress */}
          <div className="lg:col-span-2 bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg">
            <div className="mb-6">
              <h2 className="text-xl font-semibold">Subject Progress</h2>
              <p className="text-sm text-gray-500 mt-1">
                Progress breakdown by subject
              </p>
            </div>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={mockSubjectProgress}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="subject" fontSize={12} />
                  <YAxis fontSize={12} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'rgba(255, 255, 255, 0.9)',
                      borderRadius: '8px',
                      border: 'none',
                      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                    }}
                    formatter={(value) => [`${value}%`, 'Completed']}
                  />
                  <Bar
                    dataKey="completed"
                    fill="#8B5CF6"
                    radius={[4, 4, 0, 0]}
                  >
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}