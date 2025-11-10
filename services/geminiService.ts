
import { GoogleGenAI, Type, Modality } from "@google/genai";
import { Dish, ImageStyle } from '../types';

if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const getStylePrompt = (style: ImageStyle): string => {
  switch (style) {
    case ImageStyle.RUSTIC_DARK:
      return "dramatic lighting, dark and moody, rustic wooden background, cinematic food photography, highly detailed, professional";
    case ImageStyle.BRIGHT_MODERN:
      return "bright and airy, minimalist, clean white marble background, modern food photography, soft shadows, vibrant colors, professional";
    case ImageStyle.SOCIAL_MEDIA:
      return "top-down flat lay, vibrant colors, popular on instagram, shot on a colorful surface, styled with fresh ingredients, professional";
    default:
      return "professional food photography";
  }
};

export const parseMenu = async (menuText: string): Promise<Dish[]> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Parse the following restaurant menu text and extract a list of dishes with their names and descriptions. Ignore prices and categories. Here is the menu: \n\n${menuText}`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              name: {
                type: Type.STRING,
                description: 'The name of the dish.',
              },
              description: {
                type: Type.STRING,
                description: 'A brief description of the dish.',
              },
            },
            required: ["name", "description"],
          },
        },
      },
    });

    const jsonString = response.text.trim();
    const dishes = JSON.parse(jsonString);
    return dishes as Dish[];
  } catch (error) {
    console.error("Error parsing menu:", error);
    throw new Error("Failed to parse the menu. Please check the format and try again.");
  }
};

export const generateFoodImage = async (dish: Dish, style: ImageStyle): Promise<string> => {
    try {
        const stylePrompt = getStylePrompt(style);
        const fullPrompt = `A high-resolution, realistic photograph of ${dish.name}: ${dish.description}. Style: ${stylePrompt}.`;

        const response = await ai.models.generateImages({
            model: 'imagen-4.0-generate-001',
            prompt: fullPrompt,
            config: {
              numberOfImages: 1,
              outputMimeType: 'image/jpeg',
              aspectRatio: '4:3',
            },
        });
        
        if (response.generatedImages && response.generatedImages.length > 0) {
            const base64ImageBytes = response.generatedImages[0].image.imageBytes;
            return `data:image/jpeg;base64,${base64ImageBytes}`;
        } else {
            throw new Error("No image was generated.");
        }
    } catch (error) {
        console.error("Error generating image:", error);
        throw new Error(`Failed to generate an image for ${dish.name}.`);
    }
};


export const editImage = async (base64Image: string, prompt: string): Promise<string> => {
    try {
        const base64Data = base64Image.split(',')[1];
        if (!base64Data) {
            throw new Error("Invalid base64 image data");
        }
        
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash-image',
            contents: {
                parts: [
                    {
                        inlineData: {
                            data: base64Data,
                            mimeType: 'image/jpeg',
                        },
                    },
                    {
                        text: prompt,
                    },
                ],
            },
            config: {
                responseModalities: [Modality.IMAGE],
            },
        });

        const imagePart = response.candidates?.[0]?.content?.parts?.find(part => part.inlineData);

        if (imagePart && imagePart.inlineData) {
            const base64ImageBytes = imagePart.inlineData.data;
            return `data:image/jpeg;base64,${base64ImageBytes}`;
        } else {
            throw new Error("No edited image was returned.");
        }
    } catch (error) {
        console.error("Error editing image:", error);
        throw new Error("Failed to edit the image.");
    }
};
