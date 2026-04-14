import { GoogleGenerativeAI } from '@google/generative-ai';
import type { UserContext } from '../utils/contextEngine';

// Initialize the API with a key, falling back to a placeholder for safe initialization
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY || '';

// We only initialize the client if the key is present to avoid immediate errors
const genAI = API_KEY ? new GoogleGenerativeAI(API_KEY) : null;

export const generateAssistantResponse = async (prompt: string, contextData: UserContext): Promise<string> => {
  if (!genAI) {
    return "Error: Gemini API key is missing. Please add VITE_GEMINI_API_KEY to your .env file.";
  }

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    
    // System prompt behavior embedded into the prompt string
    const systemInstruction = `
You are Nova, an Intelligent Workstream Assistant. Your goal is to help the user manage tasks, provide coding advice, and synthesize information contextually.
Keep your responses concise, professional, and visually structured (use markdown).

Here is the current user context:
${JSON.stringify(contextData, null, 2)}
    `;

    const fullPrompt = `${systemInstruction}\n\nUser Request: ${prompt}`;
    
    const result = await model.generateContent(fullPrompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "I encountered an error while processing your request. Please check your API key or network connection.";
  }
};
