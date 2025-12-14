import { GoogleGenAI, ChatSession, GenerativeModel } from "@google/genai";
import { EXPERT_SYSTEM_PROMPT } from "../constants";

let chatSession: ChatSession | null = null;
let genAI: GoogleGenAI | null = null;

const getGenAI = (): GoogleGenAI => {
  if (!genAI) {
    if (!process.env.API_KEY) {
        console.error("API_KEY is missing from environment variables");
    }
    genAI = new GoogleGenAI({ apiKey: process.env.API_KEY });
  }
  return genAI;
};

export const initializeChat = async (): Promise<void> => {
  const ai = getGenAI();
  try {
    chatSession = await ai.chats.create({
      model: 'gemini-2.5-flash',
      config: {
        systemInstruction: EXPERT_SYSTEM_PROMPT,
        temperature: 0.7, 
      }
    });
  } catch (error) {
    console.error("Failed to initialize chat session", error);
    throw error;
  }
};

export const sendMessageToGemini = async (message: string): Promise<string> => {
  if (!chatSession) {
    await initializeChat();
  }

  if (!chatSession) {
    throw new Error("Chat session could not be initialized.");
  }

  try {
    const result = await chatSession.sendMessage({
      message: message,
    });
    
    return result.text || "";
  } catch (error) {
    console.error("Error sending message to Gemini:", error);
    throw error;
  }
};

export const resetSession = () => {
  chatSession = null;
};
