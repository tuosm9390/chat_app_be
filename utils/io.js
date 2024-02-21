const chatController = require("../Controllers/chat.controller");
const userController = require("../Controllers/user.controller");
const roomController = require("../Controllers/room.controller");

module.exports = function (io) {
  // io setting
  io.on("connection", async (socket) => {
    console.log("client is connected", socket.id);

    // app.js 에서 작성한 emit("login") 부분 작성
    socket.on("login", async (userName, cb) => {
      // 유저정보를 저장
      try {
        const user = await userController.saveUser(userName, socket.id);
        cb({ ok: true, data: user });
      } catch (err) {
        cb({ ok: false, error: err.message });
      }
    });

    socket.on("message", async (message, cb) => {});

    // sendMessage
    socket.on("sendMessage", async (receivedMessage, cb) => {
      try {
        // socket id로 유저 찾기
        const user = await userController.checkUser(socket.id);
        if (user) {
          // 메세지 저장
          // 유저가 접속한 방에만 메세지를 저장해야함
          const message = await chatController.saveChat(receivedMessage, user);
          io.to(user.room.toString()).emit("message", message);
          return cb({ ok: true });
        }
      } catch (err) {
        cb({ ok: false, error: err.message });
      }
    });

    // 채팅방 목록 정보 보내주기
    socket.emit("rooms", await roomController.getAllRooms());

    // 채팅방 입장
    socket.on("joinRoom", async (rid, cb) => {
      try {
        const user = await userController.checkUser(socket.id); // 유저 정보 가져오기
        // 방 입장시 room정보에 user 수 업데이트
        await roomController.joinRoom(rid, user);
        // socket은 해당 room으로 join
        // join = 소켓에서 어떠한 그룹에 접속하게 하는 함수
        socket.join(user.room.toString());
        const welcomeMessage = {
          chat: `${user.name} 님이 방에 들어왔습니다.`,
          user: { id: null, name: "system" },
        };
        // 입장메세지 전송
        // 이 룸id에들어있는 사람들 에게(to) 말한다 (emit) 이 메세지를 (welcomeMessages)
        io.to(user.room.toString()).emit("message", welcomeMessage);
        // 업데이트 된 정보를 다른 유저에게 전송
        io.emit("rooms", await roomController.getAllRooms());
        socket.emit("message", await chatController.findChat(rid, socket.id));
        cb({ ok: true });
      } catch (error) {
        cb({ ok: false, error: error.message });
      }
    });

    // 채팅방 나가기
    socket.on("leaveRoom", async (_, cb) => {
      try {
        const user = await userController.checkUser(socket.id);
        await roomController.leaveRoom(user);
        const leaveMessage = {
          chat: `${user.name} 님이 퇴장하셨습니다.`,
          user: { id: null, name: "system" },
        };
        // broadcast는 io.to()와 달리 나를 제외한 채팅방에 모든 멤버에세 메세지를 보냄
        socket.broadcast.to(user.room.toString()).emit("message", leaveMessage);
        io.emit("rooms", await roomController.getAllRooms());
        // join했던 방을 떠남(leave)
        socket.leave(user.room.toString());
        cb({ ok: true });
      } catch (error) {
        cb({ ok: false, message: error.message });
      }
    });

    // socket disconnect
    socket.on("disconnect", () => {
      console.log("user is disconnected");
    });
  });
};
