
import { GoogleGenAI, Type } from "@google/genai";
import { AppSettings, Question } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateEducationalContent = async (settings: AppSettings): Promise<Question> => {
  const model = "gemini-3-flash-preview"; 

  const schema = {
    type: Type.OBJECT,
    properties: {
      text: { type: Type.STRING, description: "The question text. Use simple English FAL." },
      type: { type: Type.STRING, enum: ["multiple-choice", "short-answer", "fill-blank"] },
      options: { 
        type: Type.ARRAY, 
        items: { type: Type.STRING }, 
        description: "Array of 3-4 options if multiple choice. Empty if not." 
      },
      correctAnswer: { type: Type.STRING, description: "The correct answer." },
      hint: { type: Type.STRING, description: "Step-by-step guidance without revealing the answer. Simple language." },
      culturalContext: { type: Type.STRING, description: "Short tag of the SA context used (e.g. 'Tuckshop Math')" }
    },
    required: ["text", "type", "correctAnswer", "hint"]
  };

  const prompt = `
    Generate a single educational question for a South African child in Grade ${settings.grade}.
    Subject: ${settings.subject}.
    Difficulty: ${settings.difficulty}.
    Question Type: ${settings.questionType}.

    CRITICAL CONTENT RULES:
    1. Context: Use South African examples (e.g., Rands/Cents, Provinces like KZN or Gauteng, Taxis, Tuckshop, Netball, Soccer/Bafana Bafana, The Big Five, Ubuntu, local food like biltong or chakalaka).
    2. Language: English First Additional Language (FAL) level. Simple, clear, encouraging.
    3. Age Appropriateness: Suitable for 9-12 year olds.
    4. Hints: The hint must NOT give the answer, but guide the thinking process (e.g., "Remember that 100 cents make 1 Rand").
    5. Math: If Math, ensure numbers are clean and answer is distinct.
    6. Fill-in-the-missing-words: Provide a sentence with a missing word represented by underscores.
  `;

  try {
    const result = await ai.models.generateContent({
      model,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: schema,
        temperature: 0.7,
      }
    });

    const data = JSON.parse(result.text || "{}");
    
    return {
      ...data,
      id: Date.now().toString(),
      options: data.type === 'multiple-choice' && (!data.options || data.options.length === 0) 
        ? ['Option 1', 'Option 2', 'Option 3', 'Option 4'] 
        : data.options
    };

  } catch (error) {
    console.error("Gemini API Error:", error);
    return {
      id: "fallback",
      text: "We had a little hiccup connecting to the brain center. Ready to try again?",
      type: "multiple-choice",
      options: ["Ready!", "Wait"],
      correctAnswer: "Ready!",
      hint: "Just click Ready to reload!",
      culturalContext: "System Check"
    };
  }
};
