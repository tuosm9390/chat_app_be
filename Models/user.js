// 유저 스키마
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "User must type name"],
    unique: true,
  },
  token: {
    type: String,
  },
  online: {
    type: Boolean,
    default: false,
  },
  // 유저가 참여하게 될 방 정보
  room: {
    type: mongoose.Schema.ObjectId,
    ref: "Room",
  },
});

module.exports = mongoose.model("User", userSchema);
