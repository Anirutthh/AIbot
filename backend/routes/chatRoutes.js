const express = require("express");
const router = express.Router();
const { cohere } = require("../index"); // ✅ Cohere client
const Chat = require("../models/Chat"); // ✅ Mongoose Chat model

router.post("/chat", async (req, res) => {
  try {
    const { prompt } = req.body;
    console.log("📩 Received Prompt:", prompt);

    // ✅ Generate response from Cohere
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

    // ✅ Save the chat to MongoDB
    await Chat.create({
      user: "Anonymous",       // Later we can use real user after login
      prompt: prompt,          // what user typed
      response: generatedText, // what cohere replied
    });

    // ✅ Return the response
    res.status(200).json({ message: generatedText });

  } catch (error) {
    console.error("❌ Cohere Error:", error);
    res.status(500).json({ message: "Something went wrong while generating text." });
  }
});

module.exports = router;
