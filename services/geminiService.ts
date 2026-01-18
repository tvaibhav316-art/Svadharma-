
import { GoogleGenAI } from "@google/genai";
import { AICounselorResponse } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const getCareerRoadmap = async (userPrompt: string): Promise<AICounselorResponse | null> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `User is a student planning for the future, asking: ${userPrompt}. 
      Provide a highly detailed, step-by-step career roadmap for the 2026-2027 academic cycle. 
      Use Google Search to include TENTATIVE or CONFIRMED entrance exam dates, application deadlines, and expected trends for 2026-2027.
      Structure your response using Markdown with clear headers for:
      1. Career Path Overview
      2. Step-by-Step Timeline (Leading up to 2026-27 Admissions)
      3. Critical Entrance Exams & Expected Deadlines (2026-2027)
      4. Recommended Courses & Top Institutions
      5. Pro-Tips for Success.`,
      config: {
        systemInstruction: "You are a world-class senior career counselor specializing in the Indian and Global education landscape. Use Google Search to provide accurate, real-time information for the upcoming 2026-2027 session. Format everything in clear, beautiful Markdown.",
        tools: [{ googleSearch: {} }]
      }
    });

    return {
      text: response.text || "No response generated.",
      links: response.candidates?.[0]?.groundingMetadata?.groundingChunks?.map(chunk => chunk.web).filter(Boolean) || []
    };
  } catch (error) {
    console.error("Error generating roadmap:", error);
    return null;
  }
};

export const searchLatestExams = async (query: string) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Find the most recent real-time information about: ${query}. Focus on tentative or confirmed exam dates, notification status, and expected deadlines for the 2026-2027 academic session.`,
      config: {
        tools: [{ googleSearch: {} }]
      }
    });

    return {
      text: response.text || "No search results found.",
      links: response.candidates?.[0]?.groundingMetadata?.groundingChunks?.map(chunk => chunk.web).filter(Boolean) || []
    };
  } catch (error) {
    console.error("Error in search grounding:", error);
    return null;
  }
}
