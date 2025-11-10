
import React, { useState } from 'react';
import { Dish } from '../types';
import { CameraIcon, SpinnerIcon, WandIcon } from './icons';

interface ImageCardProps {
  dish: Dish;
  imageSrc: string | null;
  isGenerating: boolean;
  isEditing: boolean;
  onGenerate: (dish: Dish) => void;
  onEdit: (dish: Dish, prompt: string) => void;
}

const ImageCard: React.FC<ImageCardProps> = ({ dish, imageSrc, isGenerating, isEditing, onGenerate, onEdit }) => {
  const [editPrompt, setEditPrompt] = useState('');

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editPrompt.trim()) {
      onEdit(dish, editPrompt);
    }
  };
  
  const isBusy = isGenerating || isEditing;

  return (
    <div className="bg-gray-800 border border-gray-700 rounded-xl overflow-hidden shadow-lg transition-all duration-300 hover:shadow-indigo-500/20 hover:border-gray-600">
      <div className="aspect-w-4 aspect-h-3 bg-gray-900 flex items-center justify-center">
        {isGenerating ? (
          <div className="text-center p-4">
            <SpinnerIcon className="w-12 h-12 mx-auto text-indigo-400" />
            <p className="mt-2 text-sm text-gray-400">Generating photo...</p>
          </div>
        ) : imageSrc ? (
          <div className="relative w-full h-full">
            <img src={imageSrc} alt={dish.name} className="w-full h-full object-cover" />
             {isEditing && (
                <div className="absolute inset-0 bg-black bg-opacity-70 flex flex-col items-center justify-center">
                    <SpinnerIcon className="w-12 h-12 text-indigo-400" />
                    <p className="mt-2 text-sm text-white">Applying edits...</p>
                </div>
             )}
          </div>
        ) : (
          <div className="text-center p-4">
            <CameraIcon className="w-12 h-12 mx-auto text-gray-600" />
            <p className="mt-2 text-sm text-gray-500">No photo generated</p>
          </div>
        )}
      </div>
      <div className="p-4">
        <h3 className="font-bold text-lg text-white truncate">{dish.name}</h3>
        <p className="text-sm text-gray-400 h-10 overflow-hidden">{dish.description}</p>
      </div>
      <div className="p-4 bg-gray-800/50 border-t border-gray-700">
        {!imageSrc && (
          <button
            onClick={() => onGenerate(dish)}
            disabled={isBusy}
            className="w-full flex items-center justify-center px-4 py-2 font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 disabled:bg-gray-500 transition-colors duration-200"
          >
            <CameraIcon className="w-5 h-5 mr-2" />
            Generate Photo
          </button>
        )}
        {imageSrc && (
          <form onSubmit={handleEditSubmit} className="flex flex-col sm:flex-row gap-2">
            <input
              type="text"
              value={editPrompt}
              onChange={(e) => setEditPrompt(e.target.value)}
              placeholder="e.g., Add a lemon wedge"
              className="flex-grow p-2 bg-gray-700 border border-gray-600 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-shadow duration-200"
              disabled={isBusy}
            />
            <button
              type="submit"
              disabled={isBusy || !editPrompt.trim()}
              className="flex items-center justify-center px-4 py-2 font-semibold text-white bg-green-600 rounded-lg hover:bg-green-700 disabled:bg-gray-500 transition-colors duration-200"
            >
              <WandIcon className="w-5 h-5 sm:mr-2" />
              <span className="sm:inline">Edit</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default ImageCard;
