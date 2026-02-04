import express from "express";
import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 10000;

// Gemini Setup
const genAI = new GoogleGenerativeAI(process.env.GEMINI_KEY);

// Use most compatible model
const model = genAI.getGenerativeModel({
  model: "gemini-1.0-pro"
});

// Home
app.get("/", (req, res) => {
  res.send("✅ Nightbot AI Running");
});

// AI Route
app.get("/ai", async (req, res) => {
  try {
    const q = req.query.q;

    if (!q) return res.send("Question missing");

    if (!process.env.GEMINI_KEY)
      return res.send("API key missing");

    const result = await model.generateContent(q);
    const response = await result.response;
    const text = response.text();

    res.send(text);

  } catch (err) {
    console.error("Gemini Error:", err);
    res.send("❌ AI Error");
  }
});

// Start
app.listen(PORT, () => {
  console.log("🚀 Running on", PORT);
});
