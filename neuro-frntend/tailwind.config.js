/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#6366f1',
        secondary: '#8b5cf6',
        accent: '#a78bfa',
        dark: {
          primary: '#818cf8',
          secondary: '#a78bfa',
          accent: '#c4b5fd',
        },
        light: {
          primary: '#6366f1',
          secondary: '#8b5cf6',
          accent: '#a78bfa',
        },
      },
      backgroundColor: {
        dark: {
          DEFAULT: '#1a1a1a',
          lighter: '#2d2d2d',
          darker: '#141414',
        },
      },
      animation: {
        'glow': 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        glow: {
          '0%': { textShadow: '0 0 10px rgba(99, 102, 241, 0.2)' },
          '100%': { textShadow: '0 0 20px rgba(99, 102, 241, 0.6)' },
        },
      },
    },
  },
  plugins: [],
}