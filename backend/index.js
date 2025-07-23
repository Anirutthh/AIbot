require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const axios = require("axios");

const app = express();
app.use(cors());
app.use(express.json());

// ✅ MongoDB connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected successfully!"))
  .catch((err) => console.log("❌ MongoDB connection error:", err));

// ✅ Basic route
app.get("/", (req, res) => {
  res.send("Smarti backend is running with Gemini 🤖✨");
});

// ✅ Gemini Chat Function
async function getGeminiResponse(prompt) {
  try {
    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        contents: [
          {
            role: "user",
            parts: [{ text: prompt }],
          },
        ],
      }
    );

    const geminiReply =
      response.data.candidates?.[0]?.content?.parts?.[0]?.text || "Sorry, I couldn’t generate a reply.";
    return geminiReply;
  } catch (err) {
    console.error("❌ Gemini API Error:", err.response?.data || err.message || err);
    throw err;
  }
}

// ✅ Chat route
app.post("/api/chat", async (req, res) => {
  const { prompt } = req.body;

  if (!prompt) {
    return res.status(400).json({ reply: "Prompt is required" });
  }

  try {
    const smartiReply = await getGeminiResponse(prompt);
    res.status(200).json({ reply: smartiReply });
  } catch (err) {
    res.status(500).json({ reply: "Smarti could not respond right now." });
  }
});

// ✅ Start server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
