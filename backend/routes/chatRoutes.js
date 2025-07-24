const express = require("express");
const router = express.Router();
const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "your-fallback-api-key");

router.post("/", async (req, res) => {
  try {
    const prompt = req.body.prompt;
    console.log("📩 Received Prompt:", prompt);

    if (!prompt) {
      return res.status(400).json({ error: "Prompt is required" });
    }

    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    console.log("✅ Gemini Response:", text);
    res.json({ message: text });
  } catch (error) {
    console.error("❌ Gemini Error:", error);
    res.status(500).json({ error: "Something went wrong with Gemini" });
  }
});

module.exports = router;
