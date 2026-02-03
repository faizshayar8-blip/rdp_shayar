import express from "express";
import fetch from "node-fetch";

const app = express();
app.use(express.json());

// ✅ ROOT FIX (404 nahi aayega)
app.get("/", (req, res) => {
  res.send("AI Bot is alive ✅");
});

// ✅ HEALTH CHECK (Render ke liye)
app.get("/health", (req, res) => {
  res.send("OK");
});

// 🤖 AI ROUTE (Nightbot yahin hit karega)
app.get("/ask", async (req, res) => {
  try {
    const userMsg = req.query.msg;
    if (!userMsg) {
      return res.send("Kuch likho bhai 😅");
    }

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [
          { role: "system", content: "You are a helpful Hindi-English YouTube live chat assistant." },
          { role: "user", content: userMsg }
        ],
        max_tokens: 80
      })
    });

    const data = await response.json();

    if (!data.choices) {
      return res.send("AI error aa gaya 🤕");
    }

    const reply = data.choices[0].message.content;
    res.send(reply);

  } catch (err) {
    console.error(err);
    res.send("Server error 😓");
  }
});

// 🚀 SERVER START
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});
