const express = require("express");
const router = express.Router();
const OpenAI = require("openai");

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || "your-api-key-here", // fallback if not using .env
});

router.post("/chat", async (req, res) => {
  try {
    const prompt = req.body.prompt;
    console.log("🔹 Prompt received from frontend:", prompt); // ✅ Debug

    if (!prompt) {
      console.log("❌ No prompt received");
      return res.status(400).json({ error: "Prompt is required" });
    }

    const chatCompletion = await openai.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "gpt-3.5-turbo",
    });

    console.log("✅ OpenAI Response:", chatCompletion.choices[0].message.content);

    res.json({ reply: chatCompletion.choices[0].message.content });
  } catch (error) {
    console.error("❌ Error in /chat route:", error);
    res.status(500).json({ error: "Something went wrong in backend" });
  }
});

module.exports = router;
