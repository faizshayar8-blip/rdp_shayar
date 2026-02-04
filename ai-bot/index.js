import express from "express";
import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 10000;

// Gemini Setup
const genAI = new GoogleGenerativeAI(process.env.GEMINI_KEY);
const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash"
});

// Home Route
app.get("/", (req, res) => {
  res.send("✅ Nightbot AI is Running (Gemini)");
});

// AI Route
app.get("/ai", async (req, res) => {
  try {
    const q = req.query.q;

    if (!q) {
      return res.send("❌ Question missing");
    }

    if (!process.env.GEMINI_KEY) {
      return res.send("❌ Gemini API Key Missing");
    }

    const result = await model.generateContent(q);
    const response = await result.response;
    const text = response.text();

    res.send(text);

  } catch (err) {
    console.error("Gemini Error:", err);
    res.send("❌ AI Error");
  }
});

// Start Server
app.listen(PORT, () => {
  console.log("🚀 Server running on port", PORT);
});
