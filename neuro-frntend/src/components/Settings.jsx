import React, { useState, useEffect } from 'react';
import {
  SunIcon, MoonIcon, SpeakerWaveIcon, DocumentTextIcon,
  EyeIcon, ArrowsPointingOutIcon
} from '@heroicons/react/24/outline';

const defaultSettings = {
  theme: 'light',
  fontSize: 'medium',
  readingSpeed: 'normal',
  narrationEnabled: false,
  dyslexicFont: false,
  highContrast: false,
  autoPlayVideos: true,
  showProgressBar: true,
};

export default function Settings() {
  const [settings, setSettings] = useState(defaultSettings);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const savedSettings = localStorage.getItem('userSettings');
    if (savedSettings) {
      const parsedSettings = JSON.parse(savedSettings);
      setSettings(parsedSettings);
      applySettings(parsedSettings);
    } else {
      // Apply default settings if none exist
      applySettings(defaultSettings);
      localStorage.setItem('userSettings', JSON.stringify(defaultSettings));
    }
  }, []);

  const updateSetting = (key, value) => {
    setSettings(prev => ({
      ...prev,
      [key]: value,
    }));
    setSaved(false);
  };

  const applySettings = (newSettings) => {
    // Apply theme
    document.documentElement.classList.remove('dark');
    document.body.classList.remove('dark');
    if (newSettings.theme === 'dark') {
      document.documentElement.classList.add('dark');
      document.body.classList.add('dark');
    }

    // Apply font size
    document.documentElement.style.fontSize = {
      small: '14px',
      medium: '16px',
      large: '18px',
    }[newSettings.fontSize];

    // Apply other settings
    document.documentElement.classList.toggle('font-dyslexic', newSettings.dyslexicFont);
    document.documentElement.classList.toggle('high-contrast', newSettings.highContrast);
  };

  const handleSave = () => {
    localStorage.setItem('userSettings', JSON.stringify(settings));
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
    applySettings(settings);
  };

  const backgroundStyle = {
    backgroundImage: "url('/Untitled design (6).png')",
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    minHeight: '100vh',
    width: '100%',
  };

  return (
    <div style={backgroundStyle} className="min-h-screen">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
          <p className="mt-2 text-gray-600">
            Customize your learning experience
          </p>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-sm">
          {/* Theme */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Appearance</h2>
            <div className="space-y-6">
              <div>
                <label className="text-sm font-medium text-gray-700">Theme</label>
                <div className="mt-2 flex gap-4">
                  <button
                    onClick={() => updateSetting('theme', 'light')}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg ${settings.theme === 'light' ? 'bg-primary text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                  >
                    <SunIcon className="w-5 h-5" />
                    Light
                  </button>
                  <button
                    onClick={() => updateSetting('theme', 'dark')}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg ${settings.theme === 'dark' ? 'bg-primary text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                  >
                    <MoonIcon className="w-5 h-5" />
                    Dark
                  </button>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700">Font Size</label>
                <div className="mt-2 flex gap-4">
                  {['small', 'medium', 'large'].map((size) => (
                    <button
                      key={size}
                      onClick={() => updateSetting('fontSize', size)}
                      className={`px-4 py-2 rounded-lg capitalize ${settings.fontSize === size ? 'bg-primary text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Accessibility */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Accessibility</h2>
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <DocumentTextIcon className="w-6 h-6 text-gray-400" />
                  <div>
                    <p className="font-medium">Dyslexia-friendly Font</p>
                    <p className="text-sm text-gray-500">Use OpenDyslexic font for better readability</p>
                  </div>
                </div>
                <button
                  onClick={() => updateSetting('dyslexicFont', !settings.dyslexicFont)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full ${settings.dyslexicFont ? 'bg-primary' : 'bg-gray-200'}`}
                >
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${settings.dyslexicFont ? 'translate-x-6' : 'translate-x-1'}`} />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <EyeIcon className="w-6 h-6 text-gray-400" />
                  <div>
                    <p className="font-medium">High Contrast</p>
                    <p className="text-sm text-gray-500">Increase contrast for better visibility</p>
                  </div>
                </div>
                <button
                  onClick={() => updateSetting('highContrast', !settings.highContrast)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full ${settings.highContrast ? 'bg-primary' : 'bg-gray-200'}`}
                >
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${settings.highContrast ? 'translate-x-6' : 'translate-x-1'}`} />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <ArrowsPointingOutIcon className="w-6 h-6 text-gray-400" />
                  <div>
                    <p className="font-medium">Reading Speed</p>
                    <p className="text-sm text-gray-500">Adjust text display speed</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  {['slow', 'normal', 'fast'].map((speed) => (
                    <button
                      key={speed}
                      onClick={() => updateSetting('readingSpeed', speed)}
                      className={`px-4 py-2 rounded-lg capitalize ${settings.readingSpeed === speed ? 'bg-primary text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                    >
                      {speed}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Save Button */}
          <div className="flex items-center justify-between">
            <button
              onClick={handleSave}
              className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors duration-200"
            >
              Save Changes
            </button>
            {saved && (
              <span className="text-green-600 animate-fade-in">
                Settings saved successfully!
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}