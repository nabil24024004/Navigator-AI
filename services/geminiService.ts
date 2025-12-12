import { GoogleGenAI, Type, Schema } from "@google/genai";
import { IncidentResponse, UrgencyLevel } from '../types';
import { MOCK_RESPONSE, SYSTEM_INSTRUCTION } from '../constants';

const API_KEY = process.env.API_KEY;

// Define the response schema for strict JSON output
const responseSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    analysis: {
      type: Type.OBJECT,
      properties: {
        objects: {
          type: Type.ARRAY,
          items: { 
            type: Type.OBJECT,
            properties: {
              label: { type: Type.STRING },
              confidence: { type: Type.NUMBER }
            },
            required: ["label", "confidence"]
          }
        },
        visual_assertions: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.STRING },
              claim: { type: Type.STRING },
              confidence: { type: Type.NUMBER }
            },
            required: ["id", "claim", "confidence"]
          }
        }
      },
      required: ["objects", "visual_assertions"]
    },
    urgency: {
      type: Type.STRING,
      enum: [UrgencyLevel.LOW, UrgencyLevel.MEDIUM, UrgencyLevel.CRITICAL]
    },
    plan: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          id: { type: Type.STRING },
          title: { type: Type.STRING },
          detail: { type: Type.STRING },
          estimated_time_min: { type: Type.NUMBER },
          priority: { type: Type.NUMBER }
        },
        required: ["id", "title", "detail", "estimated_time_min", "priority"]
      }
    },
    reasoning_trace: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          evidence: { type: Type.STRING },
          inference: { type: Type.STRING },
          action: { type: Type.STRING },
          confidence: { type: Type.NUMBER }
        },
        required: ["evidence", "inference", "action", "confidence"]
      }
    }
  },
  required: ["analysis", "urgency", "plan", "reasoning_trace"]
};

export const analyzeIncident = async (
  imageBase64: string,
  contextText: string
): Promise<IncidentResponse> => {
  
  // Simulation delay for realistic feel if mocking
  if (!API_KEY) {
    console.warn("No API_KEY found in env. Using Mock Data.");
    await new Promise(resolve => setTimeout(resolve, 2500));
    return MOCK_RESPONSE;
  }

  try {
    const ai = new GoogleGenAI({ apiKey: API_KEY });

    // Remove header from base64 string if present (data:image/jpeg;base64,...)
    const cleanBase64 = imageBase64.split(',')[1] || imageBase64;

    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview', // Using the pro preview for reasoning capabilities
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: 'image/jpeg', // Assuming JPEG for simplicity, can be dynamic
              data: cleanBase64
            }
          },
          {
            text: `Context provided by user: "${contextText}". Analyze this situation.`
          }
        ]
      },
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
        responseSchema: responseSchema,
        thinkingConfig: { thinkingBudget: 1024 } // Enable thinking for better reasoning traces
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response text generated");

    const data = JSON.parse(text) as IncidentResponse;
    return data;

  } catch (error) {
    console.error("Gemini API Error:", error);
    // Fallback to mock on error to prevent app crash in demo
    return MOCK_RESPONSE;
  }
};