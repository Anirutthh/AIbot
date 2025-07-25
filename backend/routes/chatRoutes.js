const express = require("express");
const router = express.Router();
const { cohere } = require("../index"); // ✅ Using the same instance

router.post("/chat", async (req, res) => {
  try {
    const { prompt } = req.body;
    console.log("📩 Received Prompt:", prompt);

    const response = await cohere.generate({
      model: "command",
      prompt,
      max_tokens: 150,
      temperature: 0.7,
    });

    const generatedText = response.generations[0]?.text?.trim();

    if (!generatedText) {
      return res.status(500).json({ message: "No text generated from Cohere." });
    }

    res.status(200).json({ message: generatedText });

  } catch (error) {
    console.error("❌ Cohere Error:", error);
    res.status(500).json({ message: "Something went wrong while generating text." });
  }
});

module.exports = router;
