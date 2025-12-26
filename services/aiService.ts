
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { Message, Role } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || "" });

export const AIService = {
  generateResponseStream: async (
    history: Message[],
    currentMessage: string,
    onChunk: (chunk: string) => void
  ) => {
    const model = 'gemini-3-flash-preview';
    
    // Prepare history for Gemini API format
    const contents = history.map(msg => ({
      role: msg.role === Role.USER ? 'user' : 'model',
      parts: [{ text: msg.content }]
    }));

    // Add current user message
    contents.push({
      role: 'user',
      parts: [{ text: currentMessage }]
    });

    try {
      const responseStream = await ai.models.generateContentStream({
        model,
        contents,
        config: {
          systemInstruction: "You are an expert AI assistant named Gemini Chat Pro. Provide clear, accurate, and helpful responses in markdown format. Use code blocks for code snippets, bullet points for lists, and headings for structure.",
          temperature: 0.7,
        },
      });

      let fullText = "";
      for await (const chunk of responseStream) {
        const text = chunk.text || "";
        fullText += text;
        onChunk(fullText);
      }
      return fullText;
    } catch (error) {
      console.error("AI Generation Error:", error);
      throw error;
    }
  },

  generateTitle: async (firstMessage: string): Promise<string> => {
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Create a very short, catchy title (max 5 words) for a chat that starts with: "${firstMessage}". Return only the title text.`,
      });
      return response.text.replace(/["']/g, "").trim() || "New Chat";
    } catch (e) {
      return "New Chat";
    }
  }
};
