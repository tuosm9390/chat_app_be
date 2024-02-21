const Room = require("../Models/room");
const roomController = {};

roomController.getAllRooms = async () => {
  const roomList = await Room.find({});
  return roomList;
};

roomController.joinRoom = async (roomId, user) => {
  const room = await Room.findById(roomId);
  // 방정보가 없을 경우
  if (!room) {
    throw new Error("해당 방이 없습니다.");
  }
  // 방에 들어간 유저가 있을 경우 해당 방에 유저 정보 업데이트
  if (!room.members.includes(user._id)) {
    room.members.push(user._id);
    await room.save();
  }
  // 유저 정보에 입장한 방 정보 업데이트
  user.room = roomId;
  await user.save();
};

roomController.leaveRoom = async (user) => {
  const room = await Room.findById(user.room);
  if (!room) {
    throw new Error("Room not found");
  }
  // 유저스키마에서 방 정보 삭제
  room.members.remove(user._id);
  await room.save();
};

module.exports = roomController;
