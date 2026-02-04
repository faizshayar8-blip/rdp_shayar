import express from "express";
import fetch from "node-fetch";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(express.json());

// Home route (check server)
app.get("/", (req, res) => {
  res.send("Nightbot AI (HuggingFace) Running ✅");
});

// Chat route
app.post("/chat", async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

    const HF_KEY = process.env.HF_API_KEY;

    if (!HF_KEY) {
      return res.status(500).json({ error: "HF API Key missing" });
    }

    const response = await fetch(
      "https://api-inference.huggingface.co/models/google/flan-t5-large",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${HF_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          inputs: message,
        }),
      }
    );

    const data = await response.json();

    // Handle model loading
    if (data.error && data.error.includes("loading")) {
      return res.json({
        reply: "AI is loading, try again in 10 seconds ⏳",
      });
    }

    if (data.error) {
      console.log("HF Error:", data);
      return res.status(500).json({ error: data.error });
    }

    const reply =
      data[0]?.generated_text || "No reply from AI 😕";

    res.json({ reply });
  } catch (err) {
    console.error("Server Error:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Port
const PORT = process.env.PORT || 10000;

app.listen(PORT, () => {
  console.log("🚀 Server running on port", PORT);
});
