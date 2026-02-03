import express from "express";
import dotenv from "dotenv";
import fetch from "node-fetch";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Home route (Render health check)
app.get("/", (req, res) => {
  res.send("✅ Nightbot AI is Running!");
});

// AI Command Route (for Nightbot)
app.get("/ai", async (req, res) => {
  try {
    const question = req.query.q;

    if (!question) {
      return res.send("❌ Please provide a question.");
    }

    // Example AI API (Replace with your real API)
    const apiKey = process.env.OPENAI_KEY;

    if (!apiKey) {
      return res.send("❌ API Key Missing!");
    }

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [
          { role: "user", content: question }
        ]
      })
    });

    const data = await response.json();

    const reply = data.choices?.[0]?.message?.content || "No response";

    res.send(reply);

  } catch (err) {
    console.error(err);
    res.send("❌ Server Error");
  }
});

// Start Server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
