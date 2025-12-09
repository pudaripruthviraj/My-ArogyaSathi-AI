import { GoogleGenAI, Type } from "@google/genai";
import { MOCK_POLICIES } from "../constants";
import { InsurancePolicy, RecommendationAnalysis } from "../types";

// Initialize Gemini Client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * Uses Gemini to generate the next relevant question for the user based on chat history.
 */
export const getNextQuestion = async (
  chatHistory: { role: string; text: string }[]
): Promise<{ text: string; options?: string[]; isComplete: boolean }> => {
  const model = "gemini-2.5-flash";

  const prompt = `
    You are an intelligent insurance assistant for the Indian market.
    Your goal is to gather enough information to recommend a health insurance policy.
    
    Required Information to collect:
    1. Who is being insured (Self, Spouse, Children, Parents).
    2. Age of the eldest member.
    3. Pincode or City (to determine zone).
    4. Any pre-existing diseases (Diabetes, BP, Thyroid, etc.).
    5. Approximate budget or coverage needed.

    Current Conversation History:
    ${JSON.stringify(chatHistory)}

    Task:
    Analyze the history. 
    If you have enough information to make a recommendation, set 'isComplete' to true.
    If not, ask the NEXT most important question. 
    Keep questions short, friendly, and relevant to Indians.
    Provide 2-4 quick reply options if applicable.
  `;

  try {
    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            text: { type: Type.STRING, description: "The next question to ask" },
            options: { 
              type: Type.ARRAY, 
              items: { type: Type.STRING }, 
              description: "Suggested quick answers" 
            },
            isComplete: { type: Type.BOOLEAN, description: "True if we have enough info to recommend" }
          },
          required: ["text", "isComplete"]
        }
      }
    });

    if (response.text) {
      return JSON.parse(response.text);
    }
    throw new Error("Empty response");
  } catch (error) {
    console.error("Error generating question:", error);
    return {
      text: "Could you tell me your age and location?",
      options: ["20-30, Metro", "30-40, Non-Metro"],
      isComplete: false
    };
  }
};

/**
 * Uses Gemini to analyze the gathered user data against the mock policy database
 * and return structured recommendations.
 */
export const getPolicyRecommendations = async (
  conversationText: string
): Promise<RecommendationAnalysis[]> => {
  const model = "gemini-2.5-flash";

  const policyData = JSON.stringify(MOCK_POLICIES.map(p => ({
    id: p.id,
    name: p.policyName,
    insurer: p.insurerName,
    features: p.features,
    copay: p.copay,
    waitingPeriod: p.pedWaitingPeriod,
    roomRent: p.roomRentLimit
  })));

  const prompt = `
    You are an expert Indian Health Insurance Underwriter.
    
    User Profile extracted from conversation:
    ${conversationText}

    Available Policies (Aggregator Data):
    ${policyData}

    Task:
    1. Analyze the user's risk profile (age, location, diseases).
    2. Compare against the available policies.
    3. Select the Top 3 best matching policies.
    4. Provide a match score (0-100) and specific reasoning for this user.
    5. List simplified pros and cons relevant to the user's specific answers (e.g., if they have parents, mention waiting periods).

    Return JSON format.
  `;

  try {
    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              policyId: { type: Type.STRING },
              matchScore: { type: Type.INTEGER },
              reasoning: { type: Type.STRING },
              pros: { type: Type.ARRAY, items: { type: Type.STRING } },
              cons: { type: Type.ARRAY, items: { type: Type.STRING } }
            },
            required: ["policyId", "matchScore", "reasoning", "pros", "cons"]
          }
        }
      }
    });

    if (response.text) {
      return JSON.parse(response.text);
    }
    return [];
  } catch (error) {
    console.error("Error analyzing policies:", error);
    return [];
  }
};
