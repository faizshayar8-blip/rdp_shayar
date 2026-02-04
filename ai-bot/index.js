import express from "express";
import fetch from "node-fetch";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(express.json());

const API_KEY = process.env.GEMINI_API_KEY;

// ✅ Safe working model
const MODEL = "models/gemini-1.5-flash";

app.post("/chat", async (req, res) => {
  try {
    const msg = req.body.message;

    if (!msg) {
      return res.status(400).json({ error: "Message missing" });
    }

    const url = `https://generativelanguage.googleapis.com/v1/${MODEL}:generateContent?key=${API_KEY}`;

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [{ text: msg }],
          },
        ],
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.log("Gemini Error:", data);
      return res.status(500).json(data);
    }

    const reply =
      data?.candidates?.[0]?.content?.parts?.[0]?.text ||
      "No reply from AI";

    res.json({ reply });

  } catch (e) {
    console.log(e);
    res.status(500).json({ error: "Server crashed" });
  }
});

app.listen(10000, () => {
  console.log("🚀 Bot running on 10000");
});
