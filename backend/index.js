

const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const { CohereClient } = require("cohere-ai");

dotenv.config();

// ✅ Check env variables
console.log("✅ .env loaded:", !!process.env.COHERE_API_KEY);
console.log("🔐 Using Cohere API Key:", process.env.COHERE_API_KEY);

// ✅ Initialize Cohere client
const cohere = new CohereClient({
  token: process.env.COHERE_API_KEY,
});
module.exports.cohere = cohere;

const app = express();
const chatRoutes = require("./routes/chatRoutes");

// ✅ Middlewares
app.use(cors({
  origin: "http://localhost:3000", // 👈 your frontend origin
  credentials: true                // 👈 allow cookies/auth headers
}));
app.use(express.json());

// ✅ API Routes
app.use("/api/cohere", require("./routes/chatRoutes"));



// ✅ Root Test Route
app.get("/", (req, res) => {
  res.send("Hello from Smarti AI Chatbot Backend!");
});

// ✅ MongoDB Connect
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => console.error("❌ MongoDB Error:", err));

// ✅ Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
