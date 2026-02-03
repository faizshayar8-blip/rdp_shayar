import express from "express";
import fetch from "node-fetch";

const app = express();
app.use(express.json());

// Root check
app.get("/", (req, res) => {
  res.send("AI Running");
});

// AI endpoint
app.get("/ai", async (req, res) => {
  try {
    const q = req.query.q;
    if (!q) return res.send("No question");

    const response = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${process.env.API_KEY}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: "openai/gpt-3.5-turbo",
          messages: [{ role: "user", content: q }]
        })
      }
    );

    const data = await response.json();
    res.send(data.choices[0].message.content);
  } catch (err) {
    res.send("AI error");
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Server running");
});
