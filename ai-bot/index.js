const express = require("express");
const fetch = require("node-fetch");

const app = express();
const PORT = process.env.PORT || 3000;

// Health check (Render / browser test ke liye)
app.get("/", (req, res) => {
  res.send("AI Bot is running ✅");
});

// AI endpoint (Nightbot yahi hit karega)
app.get("/ask", async (req, res) => {
  try {
    const msg = req.query.msg;
    if (!msg) return res.send("Kuch pucho bhai 🙂");

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) return res.send("API key missing ❌");

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: msg }]
      })
    });

    const data = await response.json();

    if (!data.choices) {
      return res.send("AI reply nahi mila 😕");
    }

    const reply = data.choices[0].message.content;
    res.send(reply);

  } catch (err) {
    console.error(err);
    res.send("Server error ❌");
  }
});

app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});
