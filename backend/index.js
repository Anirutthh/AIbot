require("dotenv").config();
const fs = require("fs");
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const { GoogleGenerativeAI } = require("@google/generative-ai");

const app = express();
const PORT = process.env.PORT || 5000;

// ✅ Show .env debug info
console.log("✅ .env exists:", fs.existsSync("./.env"));
console.log("✅ Raw .env content:\n", fs.readFileSync("./.env", "utf-8"));
console.log("🔐 Your Gemini API Key:", process.env.GEMINI_API_KEY);

// ✅ Middleware
app.use(cors());
app.use(express.json());

// ✅ Gemini Setup
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "models/gemini-pro" });

// ✅ MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected successfully!"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// ✅ Gemini Chat Endpoint
app.post("/api/gemini", async (req, res) => {
  try {
    const userPrompt = req.body.prompt;
    if (!userPrompt) {
      return res.status(400).json({ error: "Prompt is missing" });
    }

    const result = await model.generateContent(userPrompt);
    const response = await result.response;
    const text = response.text();

    res.json({ message: text });
  } catch (error) {
    console.error("❌ Gemini API Error:", error);
    res.status(500).json({ error: "Something went wrong with Gemini API" });
  }
});

// ✅ Health check
app.get("/", (req, res) => {
  res.send("✅ Gemini server is running");
});

// ✅ Start Server
app.listen(PORT, () => {
  console.log(`✅ Gemini Server running at http://localhost:${PORT}`);
});
