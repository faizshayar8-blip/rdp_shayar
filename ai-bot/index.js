import express from "express";
import dotenv from "dotenv";
import fetch from "node-fetch";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Home
app.get("/", (req, res) => {
  res.send("✅ Nightbot AI (Gemini) Running!");
});

// AI Route
app.get("/ai", async (req, res) => {
  try {
    const q = req.query.q;

    if (!q) {
      return res.send("❌ Question missing");
    }

    const API_KEY = process.env.GEMINI_KEY;

    if (!API_KEY) {
      return res.send("❌ Gemini API Key Missing");
    }

    const url =
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${API_KEY}`;

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [{ text: q }]
          }
        ]
      })
    });

    const data = await response.json();

    const reply =
      data.candidates?.[0]?.content?.parts?.[0]?.text ||
      "No reply from AI";

    res.send(reply);

  } catch (err) {
    console.error(err);
    res.send("❌ Server Error");
  }
});

// Start
app.listen(PORT, () => {
  console.log("🚀 Server running on " + PORT);
});
