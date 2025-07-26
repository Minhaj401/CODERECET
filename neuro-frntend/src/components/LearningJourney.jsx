import React from 'react';
// Lucide icons (install @lucide/react if not present)
import { Flag, CheckCircle2, Circle, XCircle, CircleDot } from 'lucide-react';

// Example modules data structure
// Each module: { id, title, type: 'start'|'completed'|'current'|'challenge'|'finish', progress: 0-100 }

const iconForType = {
  start: <CircleDot className="w-14 h-14 text-red-500" />,
  completed: <CheckCircle2 className="w-14 h-14 text-blue-500" />,
  current: (
    <span className="relative w-14 h-14 flex items-center justify-center">
      <Circle className="w-14 h-14 text-blue-500 animate-pulse" />
      <span className="absolute inset-0 rounded-full border-8 border-blue-400 animate-ping" />
    </span>
  ),
  challenge: <XCircle className="w-14 h-14 text-red-500" />,
  finish: <Flag className="w-14 h-14 text-green-500" />,
};

export default function LearningJourney({ modules, onSelect }) {
  // Layout constants
  const gap = 180;
  const margin = 60;
  const height = 180;
  const width = (modules.length - 1) * gap + margin * 2;

  // SVG path generation for a wavy line
  let path = `M ${margin} ${height / 2}`;
  for (let i = 1; i < modules.length; i++) {
    const x = margin + i * gap;
    const y = i % 2 === 0 ? height / 2 + 40 : height / 2 - 40;
    path += ` Q ${x - gap / 2} ${i % 2 === 0 ? height : 0}, ${x} ${y}`;
  }

  // Waypoint positions
  const points = modules.map((_, i) => {
    const x = margin + i * gap;
    const y = i % 2 === 0 ? height / 2 + 40 : height / 2 - 40;
    return { x, y };
  });

  return (
    <div className="overflow-x-auto w-full py-20 flex justify-center items-center bg-transparent">
      <div
        className="relative"
        style={{ minWidth: width, height: 320 }}
      >
        <svg width={width} height={height} className="absolute left-0 top-24">
          <path
            d={path}
            fill="none"
            stroke="#a1a1aa"
            strokeWidth="8"
            strokeDasharray="16,12"
          />
        </svg>
        {points.map((pt, idx) => (
          <button
            key={modules[idx].id}
            className="absolute z-10 flex flex-col items-center group focus:outline-none"
            style={{ left: pt.x - 36, top: pt.y + 32, minWidth: 72 }}
            onClick={() => onSelect && onSelect(modules[idx])}
          >
            {iconForType[modules[idx].type]}
            <span className="mt-3 text-base font-semibold text-gray-700 dark:text-gray-200 group-hover:underline whitespace-nowrap">
              {modules[idx].title}
            </span>
            <span className="text-sm text-gray-400">{modules[idx].progress}%</span>
          </button>
        ))}
      </div>
    </div>
  );
} 