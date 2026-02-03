import express from "express";
import OpenAI from "openai";

const app = express();
app.use(express.json());

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

app.get("/", (req, res) => {
  res.send("Nightbot AI is running ✅");
});

app.get("/ai", async (req, res) => {
  try {
    const userMsg = req.query.q;
    if (!userMsg) return res.send("No message");

    const reply = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "You are a friendly YouTube Nightbot AI." },
        { role: "user", content: userMsg }
      ]
    });

    res.send(reply.choices[0].message.content);
  } catch (err) {
    res.send("AI error");
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("AI server running on port", PORT);
});
