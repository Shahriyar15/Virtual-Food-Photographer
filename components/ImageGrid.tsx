
import React from 'react';
import { Dish } from '../types';
import ImageCard from './ImageCard';
// FIX: Import missing icon components.
import { WandIcon, SpinnerIcon, CameraIcon } from './icons';

interface ImageGridProps {
  dishes: Dish[];
  images: Record<string, string>;
  generatingImages: Record<string, boolean>;
  editingImages: Record<string, boolean>;
  onGenerate: (dish: Dish) => void;
  onEdit: (dish: Dish, prompt: string) => void;
  onGenerateAll: () => void;
  isGeneratingAll: boolean;
}

const ImageGrid: React.FC<ImageGridProps> = ({ 
    dishes, 
    images, 
    generatingImages, 
    editingImages,
    onGenerate, 
    onEdit,
    onGenerateAll,
    isGeneratingAll
}) => {
  if (dishes.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center text-gray-500 p-8 border-2 border-dashed border-gray-700 rounded-xl">
        <WandIcon className="w-16 h-16 mb-4" />
        <h3 className="text-xl font-semibold text-gray-400">Your gallery awaits</h3>
        <p>Parse your menu to see your list of dishes here.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
        <div className="flex justify-end">
            <button
                onClick={onGenerateAll}
                disabled={isGeneratingAll}
                className="px-6 py-2 font-semibold text-white bg-green-600 rounded-lg hover:bg-green-700 disabled:bg-gray-500 disabled:cursor-not-allowed transition-colors duration-200 flex items-center"
            >
                {isGeneratingAll ? <SpinnerIcon className="mr-2" /> : <CameraIcon className="mr-2" />}
                {isGeneratingAll ? 'Generating...' : 'Generate All Photos'}
            </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {dishes.map((dish) => (
            <ImageCard
            key={dish.name}
            dish={dish}
            imageSrc={images[dish.name] || null}
            isGenerating={!!generatingImages[dish.name]}
            isEditing={!!editingImages[dish.name]}
            onGenerate={onGenerate}
            onEdit={onEdit}
            />
        ))}
        </div>
    </div>
  );
};

export default ImageGrid;