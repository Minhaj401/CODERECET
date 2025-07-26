import React, { useState, useEffect } from 'react';
import { SunIcon, MoonIcon, SpeakerWaveIcon, AcademicCapIcon } from '@heroicons/react/24/outline';

const defaultSettings = {
  theme: 'light',
  fontSize: 'normal',
  readingSpeed: 'normal',
  audioEnabled: true,
  dyslexiaFont: false,
  highContrast: false,
};

function Settings() {
  const [settings, setSettings] = useState(defaultSettings);

  useEffect(() => {
    const savedSettings = localStorage.getItem('userSettings');
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    }
  }, []);

  const updateSetting = (key, value) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    localStorage.setItem('userSettings', JSON.stringify(newSettings));

    // Apply settings to document
    document.documentElement.classList.toggle('dark', newSettings.theme === 'dark');
    document.documentElement.classList.toggle('dyslexic-font', newSettings.dyslexiaFont);
    document.documentElement.style.fontSize = getFontSizeValue(newSettings.fontSize);
  };

  const getFontSizeValue = (size) => {
    const sizes = {
      small: '14px',
      normal: '16px',
      large: '18px',
      'extra-large': '20px',
    };
    return sizes[size] || sizes.normal;
  };

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-sm space-y-6">
      <div className="flex items-center gap-2">
        <AcademicCapIcon className="h-6 w-6 text-primary" />
        <h2 className="text-xl font-semibold">Learning Preferences</h2>
      </div>

      <div className="space-y-6">
        {/* Theme Toggle */}
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-gray-700">Theme</label>
          <button
            onClick={() => updateSetting('theme', settings.theme === 'light' ? 'dark' : 'light')}
            className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-200 hover:bg-gray-50"
          >
            {settings.theme === 'light' ? (
              <>
                <SunIcon className="h-5 w-5 text-amber-500" />
                <span>Light</span>
              </>
            ) : (
              <>
                <MoonIcon className="h-5 w-5 text-blue-500" />
                <span>Dark</span>
              </>
            )}
          </button>
        </div>

        {/* Font Size */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Font Size</label>
          <div className="grid grid-cols-4 gap-2">
            {['small', 'normal', 'large', 'extra-large'].map((size) => (
              <button
                key={size}
                onClick={() => updateSetting('fontSize', size)}
                className={`px-3 py-2 rounded-lg text-sm ${settings.fontSize === size
                  ? 'bg-primary text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
              >
                {size.charAt(0).toUpperCase() + size.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Reading Speed */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Reading Speed</label>
          <div className="grid grid-cols-3 gap-2">
            {['slow', 'normal', 'fast'].map((speed) => (
              <button
                key={speed}
                onClick={() => updateSetting('readingSpeed', speed)}
                className={`px-3 py-2 rounded-lg text-sm ${settings.readingSpeed === speed
                  ? 'bg-primary text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
              >
                {speed.charAt(0).toUpperCase() + speed.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Accessibility Options */}
        <div className="space-y-4">
          <label className="text-sm font-medium text-gray-700">Accessibility</label>
          <div className="space-y-3">
            <label className="flex items-center justify-between cursor-pointer">
              <span className="text-sm text-gray-700">Audio Narration</span>
              <div className="relative">
                <input
                  type="checkbox"
                  className="sr-only"
                  checked={settings.audioEnabled}
                  onChange={(e) => updateSetting('audioEnabled', e.target.checked)}
                />
                <div className={`w-11 h-6 rounded-full transition ${settings.audioEnabled ? 'bg-primary' : 'bg-gray-200'}`}>
                  <div className={`w-4 h-4 rounded-full bg-white shadow transform transition-transform ${settings.audioEnabled ? 'translate-x-6' : 'translate-x-1'} translate-y-1`} />
                </div>
              </div>
            </label>

            <label className="flex items-center justify-between cursor-pointer">
              <span className="text-sm text-gray-700">Dyslexia-Friendly Font</span>
              <div className="relative">
                <input
                  type="checkbox"
                  className="sr-only"
                  checked={settings.dyslexiaFont}
                  onChange={(e) => updateSetting('dyslexiaFont', e.target.checked)}
                />
                <div className={`w-11 h-6 rounded-full transition ${settings.dyslexiaFont ? 'bg-primary' : 'bg-gray-200'}`}>
                  <div className={`w-4 h-4 rounded-full bg-white shadow transform transition-transform ${settings.dyslexiaFont ? 'translate-x-6' : 'translate-x-1'} translate-y-1`} />
                </div>
              </div>
            </label>

            <label className="flex items-center justify-between cursor-pointer">
              <span className="text-sm text-gray-700">High Contrast</span>
              <div className="relative">
                <input
                  type="checkbox"
                  className="sr-only"
                  checked={settings.highContrast}
                  onChange={(e) => updateSetting('highContrast', e.target.checked)}
                />
                <div className={`w-11 h-6 rounded-full transition ${settings.highContrast ? 'bg-primary' : 'bg-gray-200'}`}>
                  <div className={`w-4 h-4 rounded-full bg-white shadow transform transition-transform ${settings.highContrast ? 'translate-x-6' : 'translate-x-1'} translate-y-1`} />
                </div>
              </div>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Settings;