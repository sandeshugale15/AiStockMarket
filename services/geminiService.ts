import { GoogleGenAI, Tool } from "@google/genai";
import { StockData } from "../types";

// Initialize Gemini Client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// We use gemini-2.5-flash for speed and search capabilities
const MODEL_NAME = "gemini-2.5-flash";

const searchTool: Tool = {
  googleSearch: {}
};

/**
 * Clean up markdown code blocks to extract JSON
 */
const cleanJsonOutput = (text: string): string => {
  let cleaned = text.trim();
  // Remove markdown code blocks if present
  if (cleaned.startsWith("```json")) {
    cleaned = cleaned.replace(/^```json\s*/, "").replace(/\s*```$/, "");
  } else if (cleaned.startsWith("```")) {
    cleaned = cleaned.replace(/^```\s*/, "").replace(/\s*```$/, "");
  }
  return cleaned;
};

export const getMarketData = async (symbol: string): Promise<StockData> => {
  try {
    const prompt = `
      I need real-time market data for stock ticker "${symbol}". 
      Perform a Google Search to find the latest price, today's change, market cap, volume, and recent news.
      
      Then, based on the search results, generate a STRICT JSON object. 
      Do NOT return Markdown. Just the JSON string.
      
      The JSON must match this structure:
      {
        "symbol": "${symbol.toUpperCase()}",
        "companyName": "Full Company Name",
        "price": number (current price),
        "currency": "USD",
        "change": number (absolute change today),
        "changePercent": number (percentage change today),
        "marketCap": "string (e.g. 2.5T)",
        "volume": "string (e.g. 45M)",
        "high": number (day high),
        "low": number (day low),
        "open": number (day open),
        "analysis": "A concise 2-sentence AI analysis of why the stock is moving today based on the news.",
        "chartData": [
           // Generate an array of 20 data points representing today's intraday price movement curve. 
           // The last point must match the current "price". 
           // The first point must be close to "open".
           // Format: { "time": "HH:MM", "price": number }
        ],
        "news": [
          { "title": "Headline", "source": "Source Name", "timeAgo": "e.g. 2h ago" }
        ]
      }
    `;

    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: prompt,
      config: {
        tools: [searchTool],
        // Note: We cannot use responseMimeType: 'application/json' when using googleSearch tool
        // so we must parse the text manually.
      },
    });

    const text = response.text || "";
    
    // Extract JSON from potential surrounding text
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error("Failed to parse market data from AI response.");
    }

    const jsonString = cleanJsonOutput(jsonMatch[0]);
    const parsedData = JSON.parse(jsonString);

    // Add timestamp
    return {
      ...parsedData,
      lastUpdated: new Date().toLocaleTimeString(),
    };

  } catch (error) {
    console.error("Gemini API Error:", error);
    throw new Error("Unable to fetch market data. Please check the ticker symbol and try again.");
  }
};