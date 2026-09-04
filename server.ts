import express from "express";
import path from "path";
import { GoogleGenAI, Type } from "@google/genai";
import { createServer as createViteServer } from "vite";

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Middleware for parsing large JSON body (base64 images)
  app.use(express.json({ limit: "25mb" }));

  // Health check endpoint
  app.get("/api/health", (_req, res) => {
    res.json({ status: "ok", service: "Kopitiam-to-Calorie Tracker" });
  });

  // Food analysis endpoint
  app.post("/api/analyze", async (req, res) => {
    try {
      const { imageBase64, mimeType = "image/jpeg", apiKeyOverride } = req.body;

      if (!imageBase64) {
        return res.status(400).json({ error: "No image provided. Please upload a Kopitiam meal photo." });
      }

      const apiKey = apiKeyOverride || process.env.GEMINI_API_KEY;
      if (!apiKey || apiKey === "YOUR_GEMINI_API_KEY") {
        return res.status(400).json({
          error: "API_KEY_MISSING",
          message: "Gemini API key is not configured. Please set GEMINI_API_KEY in environment or pass your key."
        });
      }

      // Initialize GoogleGenAI SDK
      const ai = new GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            "User-Agent": "aistudio-build",
          },
        },
      });

      // Clean base64 string if data URL prefix exists
      const cleanBase64 = imageBase64.replace(/^data:image\/[a-z]+;base64,/, "");

      const systemInstruction = `You are an expert Malaysian Kopitiam & Hawker Food Nutritionist with a friendly, casual, and humorous tone using light Malaysian slang (e.g., 'Wah, extra sambal lah!', 'Alamak!', 'Boleh tahan!', 'Syok giler!', 'Steady lah!', 'Boio!').

GUARDRAIL & FOOD DETECTION RULE:
First, inspect the uploaded image. Check if it contains real food, beverage, or a Kopitiam/hawker dish.
- If it is NOT food or beverage (e.g., a picture of a cat, dog, shoe, car, person's face, blurred non-food background, table without food, random household object):
  Return strictly { "isFood": false, "foodName": "", "calories": 0, "protein": 0, "carbs": 0, "fat": 0, "funnyComment": "", "workoutRecommendation": "" }.

- If it IS food or beverage:
  1. Identify the Malaysian / Kopitiam dish or meal (e.g., Nasi Lemak Special, Roti Canai Bawang, Char Kway Teow, Hainanese Chicken Rice, Curry Laksa Mee, Teh Tarik Kaw, Ais Kacang, Satay Ayam, Nasi Kandar, Kuih Lapis, etc.).
  2. Estimate the COMBINED total calories for the entire plate/portion as a single number (do NOT break down into individual peanuts or cucumber slices).
  3. Estimate macros in grams: protein, carbs, fat.
  4. Write a funny, conversational Malaysian-slang fitness comment / nudge about this meal.
  5. Recommend a fun, localized Malaysian exercise equivalent to burn off these calories (e.g., 'Climb Batu Caves stairs 4 times', 'Play Badminton for 45 mins with your kawan', 'Swim 20 laps at Bukit Jalil pool', 'Jog around KLCC Park for 30 mins', 'Cycle around Putrajaya Lake', 'Dance Dikir Barat at full energy for 40 mins').`;

      const prompt = "Analyze this Malaysian Kopitiam plate. First check if it is food. If yes, calculate total calories, macros, write a funny Malaysian slang nudge, and a localized Malaysian workout to burn it off.";

      const response = await ai.models.generateContent({
        model: "gemini-3.6-flash",
        contents: [
          {
            inlineData: {
              mimeType,
              data: cleanBase64,
            },
          },
          {
            text: prompt,
          },
        ],
        config: {
          systemInstruction,
          temperature: 0.4,
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              isFood: {
                type: Type.BOOLEAN,
                description: "True if the image contains food or drink, false otherwise.",
              },
              foodName: {
                type: Type.STRING,
                description: "Name of the Malaysian dish identified.",
              },
              calories: {
                type: Type.INTEGER,
                description: "Estimated total calories for the whole plate.",
              },
              protein: {
                type: Type.INTEGER,
                description: "Protein in grams.",
              },
              carbs: {
                type: Type.INTEGER,
                description: "Carbohydrates in grams.",
              },
              fat: {
                type: Type.INTEGER,
                description: "Fat in grams.",
              },
              funnyComment: {
                type: Type.STRING,
                description: "Funny Malaysian slang fitness commentary.",
              },
              workoutRecommendation: {
                type: Type.STRING,
                description: "Localized Malaysian exercise recommendation to burn off the meal.",
              },
            },
            required: ["isFood", "foodName", "calories", "protein", "carbs", "fat", "funnyComment", "workoutRecommendation"],
          },
        },
      });

      const jsonText = response.text || "{}";
      const result = JSON.parse(jsonText);

      return res.json(result);
    } catch (error: any) {
      console.error("Error analyzing meal image:", error);
      return res.status(500).json({
        error: "ANALYSIS_FAILED",
        message: error.message || "Ayaaa! Failed to analyze image. Please try again.",
      });
    }
  });

  // Vite development middleware or production static serving
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Kopitiam Calorie Tracker Server running at http://localhost:${PORT}`);
  });
}

startServer();
