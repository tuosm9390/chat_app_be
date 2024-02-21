// chat schema
const mongoose = require("mongoose");

const chatSchema = new mongoose.Schema(
  {
    chat: String,
    user: {
      id: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
      },
      name: String,
    },
    // 채팅방 정보
    room: {
      type: mongoose.Schema.ObjectId,
      ref: "Room",
    },
  },
  { timestamp: true }
);

module.exports = mongoose.model("Chat", chatSchema);
