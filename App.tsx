
import React, { useState, useCallback } from 'react';
import { Dish, ImageStyle } from './types';
import { parseMenu, generateFoodImage, editImage } from './services/geminiService';
import MenuInput from './components/MenuInput';
import StyleSelector from './components/StyleSelector';
import ImageGrid from './components/ImageGrid';

const App: React.FC = () => {
  const [menuText, setMenuText] = useState<string>('');
  const [dishes, setDishes] = useState<Dish[]>([]);
  const [selectedStyle, setSelectedStyle] = useState<ImageStyle>(ImageStyle.BRIGHT_MODERN);
  
  const [images, setImages] = useState<Record<string, string>>({});
  
  const [isLoadingMenu, setIsLoadingMenu] = useState<boolean>(false);
  const [generatingImages, setGeneratingImages] = useState<Record<string, boolean>>({});
  const [editingImages, setEditingImages] = useState<Record<string, boolean>>({});
  const [isGeneratingAll, setIsGeneratingAll] = useState<boolean>(false);

  const [error, setError] = useState<string | null>(null);

  const handleParseMenu = useCallback(async () => {
    setIsLoadingMenu(true);
    setError(null);
    setDishes([]);
    setImages({});
    try {
      const parsedDishes = await parseMenu(menuText);
      setDishes(parsedDishes);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'An unknown error occurred.');
    } finally {
      setIsLoadingMenu(false);
    }
  }, [menuText]);

  const handleGenerateImage = useCallback(async (dish: Dish) => {
    setGeneratingImages(prev => ({ ...prev, [dish.name]: true }));
    setError(null);
    try {
      const imageUrl = await generateFoodImage(dish, selectedStyle);
      setImages(prev => ({ ...prev, [dish.name]: imageUrl }));
    } catch (e) {
      setError(e instanceof Error ? e.message : 'An unknown error occurred.');
    } finally {
      setGeneratingImages(prev => ({ ...prev, [dish.name]: false }));
    }
  }, [selectedStyle]);

  const handleEditImage = useCallback(async (dish: Dish, prompt: string) => {
    const currentImage = images[dish.name];
    if (!currentImage) {
      setError("Cannot edit an image that hasn't been generated yet.");
      return;
    }
    setEditingImages(prev => ({ ...prev, [dish.name]: true }));
    setError(null);
    try {
      const newImageUrl = await editImage(currentImage, prompt);
      setImages(prev => ({ ...prev, [dish.name]: newImageUrl }));
    } catch (e) {
      setError(e instanceof Error ? e.message : 'An unknown error occurred.');
    } finally {
      setEditingImages(prev => ({ ...prev, [dish.name]: false }));
    }
  }, [images]);

  const handleGenerateAll = useCallback(async () => {
    setIsGeneratingAll(true);
    for (const dish of dishes) {
        if (!images[dish.name]) { // Only generate if image doesn't exist
            await handleGenerateImage(dish);
        }
    }
    setIsGeneratingAll(false);
  }, [dishes, images, handleGenerateImage]);

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 font-sans">
      <header className="bg-gray-800/50 backdrop-blur-sm border-b border-gray-700 sticky top-0 z-10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <h1 className="text-3xl font-bold text-white text-center tracking-tight">
            Virtual Food Photographer
          </h1>
          <p className="text-center text-indigo-300 mt-1">AI-Powered Imagery for Your Menu</p>
        </div>
      </header>

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="bg-red-900/50 border border-red-700 text-red-200 px-4 py-3 rounded-lg relative mb-6" role="alert">
            <strong className="font-bold">Error: </strong>
            <span className="block sm:inline">{error}</span>
            <span className="absolute top-0 bottom-0 right-0 px-4 py-3" onClick={() => setError(null)}>
              <svg className="fill-current h-6 w-6 text-red-300" role="button" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><title>Close</title><path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z"/></svg>
            </span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <aside className="lg:col-span-1 space-y-8 sticky top-24 self-start">
            <MenuInput 
              menuText={menuText}
              setMenuText={setMenuText}
              onParse={handleParseMenu}
              isLoading={isLoadingMenu}
            />
            <StyleSelector 
              selectedStyle={selectedStyle}
              setSelectedStyle={setSelectedStyle}
              disabled={isLoadingMenu || dishes.length === 0}
            />
          </aside>
          <section className="lg:col-span-2">
             <ImageGrid 
                dishes={dishes}
                images={images}
                generatingImages={generatingImages}
                editingImages={editingImages}
                onGenerate={handleGenerateImage}
                onEdit={handleEditImage}
                onGenerateAll={handleGenerateAll}
                isGeneratingAll={isGeneratingAll}
             />
          </section>
        </div>
      </main>
    </div>
  );
};

export default App;
