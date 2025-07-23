const mongoose = require("mongoose");

const chatSchema = new mongoose.Schema(
  {
    prompt: { type: String, required: true },
    response: { type: String, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Chat", chatSchema);
