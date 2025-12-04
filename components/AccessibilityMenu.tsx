import React, { useState } from 'react';
import { AccessibilitySettings } from '../types';
import { COLORS } from '../constants';

interface Props {
  settings: AccessibilitySettings;
  onUpdate: (newSettings: AccessibilitySettings) => void;
}

export const AccessibilityMenu: React.FC<Props> = ({ settings, onUpdate }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSetting = (key: keyof AccessibilitySettings) => {
    onUpdate({ ...settings, [key]: !settings[key] });
  };

  return (
    <div className="fixed bottom-4 left-4 z-50">
      {isOpen && (
        <div className="mb-4 bg-white p-4 rounded-xl shadow-xl border-2 w-64 animate-fade-in" style={{ borderColor: COLORS.primaryBlue }}>
          <h3 className="font-bold text-lg mb-3">Helper Settings</h3>
          
          <div className="space-y-3">
            <button 
              onClick={() => toggleSetting('largeText')}
              className={`w-full p-2 rounded-lg flex items-center justify-between border-2 transition-colors ${settings.largeText ? 'bg-blue-100 border-blue-400' : 'bg-gray-50 border-gray-200'}`}
            >
              <span>Large Text (Aa)</span>
              {settings.largeText && <span className="text-green-600">✓</span>}
            </button>

            <button 
              onClick={() => toggleSetting('highContrast')}
              className={`w-full p-2 rounded-lg flex items-center justify-between border-2 transition-colors ${settings.highContrast ? 'bg-yellow-100 border-yellow-400' : 'bg-gray-50 border-gray-200'}`}
            >
              <span>High Contrast 🌗</span>
              {settings.highContrast && <span className="text-green-600">✓</span>}
            </button>

            <button 
              onClick={() => toggleSetting('simpleMode')}
              className={`w-full p-2 rounded-lg flex items-center justify-between border-2 transition-colors ${settings.simpleMode ? 'bg-green-100 border-green-400' : 'bg-gray-50 border-gray-200'}`}
            >
              <span>Simple Mode 🧘</span>
              {settings.simpleMode && <span className="text-green-600">✓</span>}
            </button>

            <button 
              onClick={() => toggleSetting('audioEnabled')}
              className={`w-full p-2 rounded-lg flex items-center justify-between border-2 transition-colors ${settings.audioEnabled ? 'bg-purple-100 border-purple-400' : 'bg-gray-50 border-gray-200'}`}
            >
              <span>Sound / Voice 🔊</span>
              {settings.audioEnabled && <span className="text-green-600">✓</span>}
            </button>
          </div>
        </div>
      )}

      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-6 py-3 rounded-full shadow-lg font-bold text-white transition-transform transform hover:scale-105"
        style={{ backgroundColor: COLORS.accentPurple }}
      >
        <span className="text-2xl">🛠️</span>
        <span>Helper</span>
      </button>
    </div>
  );
};
