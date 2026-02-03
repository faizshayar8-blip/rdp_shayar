import express from "express";
import fetch from "node-fetch";

const app = express();
const PORT = process.env.PORT || 3000;

app.get("/ai", async (req, res) => {
  try {
    const q = req.query.q;
    if (!q) return res.send("No query");

    const r = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: q }]
      })
    });

    const d = await r.json();
    res.send(d.choices?.[0]?.message?.content || "AI error");
  } catch (e) {
    res.send("AI error");
  }
});

app.listen(PORT, () => {
  console.log("Server running on", PORT);
});
