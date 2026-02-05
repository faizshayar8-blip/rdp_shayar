import express from "express";
import fetch from "node-fetch";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(express.json());

// Test route
app.get("/", (req, res) => {
  res.send("✅ HuggingFace AI Server Running");
});

// Check API Key
app.get("/check", (req, res) => {
  if (process.env.HF_API_KEY) {
    res.send("✅ HF API KEY Loaded");
  } else {
    res.send("❌ HF API KEY Missing");
  }
});

// AI Route
app.post("/ai", async (req, res) => {
  try {
    const { prompt } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: "Prompt required" });
    }

    const HF_KEY = process.env.HF_API_KEY;

    if (!HF_KEY) {
      return res.status(500).json({ error: "HF API Key missing" });
    }

    const response = await fetch(
      "https://router.huggingface.co/hf-inference/models/google/flan-t5-base",
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${HF_KEY}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          inputs: prompt
        })
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.log("HF Error:", data);
      return res.status(500).json(data);
    }

    const reply =
      data[0]?.generated_text || "No reply from AI";

    res.json({ reply });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server Error" });
  }
});

// Start Server
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("🚀 Server running on " + PORT);
});
