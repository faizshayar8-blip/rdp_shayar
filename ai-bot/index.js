import express from "express";
import dotenv from "dotenv";
import fetch from "node-fetch";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 10000;

// Home
app.get("/", (req, res) => {
  res.send("✅ Nightbot AI (Gemini Working)");
});

// AI Route
app.get("/ai", async (req, res) => {
  try {
    const q = req.query.q;

    if (!q) return res.send("❌ Question missing");

    const API_KEY = process.env.GEMINI_KEY;

    if (!API_KEY) return res.send("❌ Gemini API Key Missing");

    const url =
      `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${API_KEY}`;

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

    console.log("RAW:", JSON.stringify(data));

    let reply = "No reply from AI";

    if (data.candidates?.[0]?.content?.parts?.length) {
      reply = data.candidates[0].content.parts
        .map(p => p.text)
        .join(" ");
    }

    res.send(reply);

  } catch (e) {
    console.error(e);
    res.send("❌ Server Error");
  }
});

// Start
app.listen(PORT, () => {
  console.log("🚀 Running on " + PORT);
});
