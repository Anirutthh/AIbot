const express = require("express");
const router = express.Router();
const { cohere } = require("../index");
const Chat = require("../models/Chat");

// ⬇️ POST /api/chat — memory-enabled chat
router.post("/chat", async (req, res) => {
  try {
    const { prompt, user = "Anonymous" } = req.body;
    console.log("📩 Received Prompt:", prompt);

    // ✅ 1. Fetch previous messages from DB (for memory)
    const previousChats = await Chat.find({ user }).sort({ createdAt: 1 }); // Oldest first

    // ✅ 2. Build history into a single string for Cohere prompt
    let history = "";
    for (const chat of previousChats) {
      history += `User: ${chat.prompt}\nAI: ${chat.response}\n`;
    }

    // ✅ 3. Append current prompt
    const fullPrompt = `${history}User: ${prompt}\nAI:`;

    // ✅ 4. Send to Cohere
    const response = await cohere.generate({
      model: "command",
      prompt: fullPrompt,
      max_tokens: 150,
      temperature: 0.7,
    });

    const generatedText = response.generations[0]?.text?.trim();

    if (!generatedText) {
      return res.status(500).json({ message: "No text generated from Cohere." });
    }

    // ✅ 5. Save the current chat
    await Chat.create({
      user,
      prompt,
      response: generatedText,
    });

    // ✅ 6. Return response to frontend
    res.status(200).json({ message: generatedText });

  } catch (error) {
    console.error("❌ Cohere Error:", error);
    res.status(500).json({ message: "Something went wrong while generating text." });
  }
});

router.get("/history", async (req, res) => {
  try {
    const chats = await Chat.find({ user: "Anonymous" }).sort({ createdAt: 1 });
    res.json(chats);
  } catch (err) {
    console.error("❌ History Error:", err);
    res.status(500).json({ message: "Failed to load history." });
  }
});


module.exports = router;
