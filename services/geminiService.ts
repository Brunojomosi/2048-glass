import { GoogleGenAI, Type } from "@google/genai";
import { Grid, Direction, AIResponse } from '../types';

const apiKey = process.env.API_KEY || '';
// Initialize safe AI instance (will throw if key is missing elsewhere, but handled in UI)
const ai = new GoogleGenAI({ apiKey });

export const getNextMoveHint = async (grid: Grid, score: number): Promise<AIResponse> => {
  try {
    const model = 'gemini-2.5-flash';
    
    const boardString = grid.map(row => row.join('\t')).join('\n');
    
    const prompt = `
      You are an expert 2048 game AI.
      Current Score: ${score}
      
      Current Board State (0 represents empty):
      ${boardString}
      
      Analyze the board and suggest the single best next move to maximize score and keep the board organized.
      Prioritize keeping high numbers in a corner (usually bottom-right or bottom-left).
      
      Return a JSON object with:
      1. "move": One of "UP", "DOWN", "LEFT", "RIGHT".
      2. "reason": A very short, punchy explanation (max 10 words).
    `;

    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            move: { type: Type.STRING, enum: ["UP", "DOWN", "LEFT", "RIGHT"] },
            reason: { type: Type.STRING }
          },
          required: ["move", "reason"]
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");
    
    return JSON.parse(text) as AIResponse;

  } catch (error) {
    console.error("Error fetching AI hint:", error);
    return { move: 'DOWN', reason: "AI offline, try keeping tiles down." };
  }
};