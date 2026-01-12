
import { GoogleGenAI } from "@google/genai";

export const generateProductImage = async (productName: string, category: string): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const prompt = `Professional studio product photography of ${productName} (${category}). 
    Hyper-realistic, 8k resolution, cinematic lighting, clean minimalist background, 
    commercial quality, sharp focus, vibrant colors.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      // Simplified contents to use string prompt as per guidelines
      contents: prompt,
      config: {
        imageConfig: {
          aspectRatio: "1:1"
        }
      }
    });

    // Find the image part in the response
    const candidate = response.candidates?.[0];
    if (candidate?.content?.parts) {
      for (const part of candidate.content.parts) {
        if (part.inlineData) {
          return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
        }
      }
    }
    throw new Error("No image data found in response");
  } catch (error) {
    console.error("Image Generation Error:", error);
    throw error;
  }
};
