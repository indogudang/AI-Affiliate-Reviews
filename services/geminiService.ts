
import { GoogleGenAI } from "@google/genai";
import { Product } from '../types';

if (!process.env.API_KEY) {
  // In a real app, this would be a fatal error.
  // For this environment, we'll proceed but calls will fail if not polyfilled.
  console.warn("API_KEY environment variable not set. Gemini API calls will fail.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });

export const generateReview = async (productName: string): Promise<string> => {
  try {
    const model = 'gemini-2.5-flash';
    const prompt = `
      You are an expert product reviewer. Write a balanced, insightful, and helpful review 
      for the following product: "${productName}".

      Your review should be concise, around 80-120 words.
      
      - Start with an engaging opening sentence.
      - Mention one or two key positive aspects.
      - Mention one potential drawback or something a consumer should consider.
      - Conclude with a clear summary of who the product is best for.

      Do not use markdown formatting. The output should be a single paragraph of text.
    `;
    
    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
    });
    
    return response.text;
  } catch (error) {
    console.error("Error generating review with Gemini API:", error);
    throw new Error("Failed to generate AI review. The API may be unavailable or the key may be invalid.");
  }
};
