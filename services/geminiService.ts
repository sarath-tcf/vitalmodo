import { GoogleGenAI, Chat } from "@google/genai";

const SYSTEM_INSTRUCTION = `You are an AI-powered symptom checker. Your goal is to provide helpful information based on the symptoms described by the user. 
You are NOT a medical professional. 
Your primary and most important rule is to ALWAYS state that you are not a doctor and that the user should consult a healthcare professional for any medical advice or diagnosis. 
Do not provide diagnoses. You can provide information about conditions related to the symptoms, but you must frame it as possibilities, not certainties.
Start every conversation with a greeting and a clear disclaimer that you are an AI assistant and not a substitute for a real doctor. Be empathetic and professional.`;

let chat: Chat | null = null;

export const initializeChat = (): Chat => {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY environment variable not set");
  }
  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  chat = ai.chats.create({
    model: 'gemini-2.5-flash',
    config: {
      systemInstruction: SYSTEM_INSTRUCTION,
    },
  });
  return chat;
};

export const getChat = (): Chat => {
  if (!chat) {
    return initializeChat();
  }
  return chat;
};