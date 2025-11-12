import { GoogleGenAI } from "@google/genai";
import type { GroundingChunk } from '../types';

const getAiClient = () => new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getSearchGroundedResponse = async (prompt: string): Promise<{ text: string; sources: GroundingChunk[] }> => {
  try {
    const ai = getAiClient();
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
      },
    });

    const text = response.text;
    const groundingMetadata = response.candidates?.[0]?.groundingMetadata;
    const sources = groundingMetadata?.groundingChunks || [];
    
    return { text, sources };
  } catch (error) {
    console.error("Error fetching search-grounded response:", error);
    return { text: "Sorry, I encountered an error while searching the web. Please try again.", sources: [] };
  }
};

export const getMapGroundedResponse = async (prompt: string, location: { latitude: number; longitude: number }): Promise<{ text: string; sources: GroundingChunk[] }> => {
  try {
    const ai = getAiClient();
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        tools: [{ googleMaps: {} }],
        toolConfig: {
          retrievalConfig: {
            latLng: {
              latitude: location.latitude,
              longitude: location.longitude,
            },
          },
        },
      },
    });

    const text = response.text;
    const groundingMetadata = response.candidates?.[0]?.groundingMetadata;
    const sources = groundingMetadata?.groundingChunks || [];
    
    return { text, sources };
  } catch (error) {
    console.error("Error fetching map-grounded response:", error);
    return { text: "Sorry, I encountered an error while searching maps. Please check your location permissions and try again.", sources: [] };
  }
};
