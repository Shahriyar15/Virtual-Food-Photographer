
import React from 'react';
import { SpinnerIcon, WandIcon } from './icons';

interface MenuInputProps {
  menuText: string;
  setMenuText: (text: string) => void;
  onParse: () => void;
  isLoading: boolean;
}

const MenuInput: React.FC<MenuInputProps> = ({ menuText, setMenuText, onParse, isLoading }) => {
  return (
    <div className="flex flex-col space-y-4">
      <h2 className="text-xl font-bold text-gray-200">1. Paste Your Menu</h2>
      <textarea
        value={menuText}
        onChange={(e) => setMenuText(e.target.value)}
        placeholder="e.g., Margherita Pizza - Fresh tomatoes, mozzarella, basil..."
        className="w-full h-64 p-4 bg-gray-800 border border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-shadow duration-200 resize-none"
        disabled={isLoading}
      />
      <button
        onClick={onParse}
        disabled={isLoading || !menuText.trim()}
        className="flex items-center justify-center px-6 py-3 font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 disabled:bg-gray-500 disabled:cursor-not-allowed transition-colors duration-200"
      >
        {isLoading ? (
          <>
            <SpinnerIcon className="w-5 h-5 mr-3" />
            Parsing Menu...
          </>
        ) : (
          <>
            <WandIcon className="w-5 h-5 mr-3" />
            Generate Dish List
          </>
        )}
      </button>
    </div>
  );
};

export default MenuInput;
