
import React from 'react';
import { ImageStyle } from '../types';

interface StyleSelectorProps {
  selectedStyle: ImageStyle;
  setSelectedStyle: (style: ImageStyle) => void;
  disabled: boolean;
}

const styles = [
  { id: ImageStyle.BRIGHT_MODERN, label: 'Bright & Modern' },
  { id: ImageStyle.RUSTIC_DARK, label: 'Rustic & Dark' },
  { id: ImageStyle.SOCIAL_MEDIA, label: 'Social Media' },
];

const StyleSelector: React.FC<StyleSelectorProps> = ({ selectedStyle, setSelectedStyle, disabled }) => {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-gray-200">2. Choose a Style</h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {styles.map(({ id, label }) => (
          <button
            key={id}
            onClick={() => setSelectedStyle(id)}
            disabled={disabled}
            className={`px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed ${
              selectedStyle === id
                ? 'bg-indigo-600 text-white shadow-lg'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default StyleSelector;
