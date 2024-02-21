// database connect
const express = require("express");
const mongoose = require("mongoose");
// env 파일의 변수에 접근
require("dotenv").config();
const cors = require("cors");
const room = require("./Models/room");
const app = express();
app.use(cors());

mongoose
  .connect(process.env.DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("connected to database"));

// app.get("/", async (req, res) => {
//   room
//     .insertMany([
//       {
//         room: "자바스크립트 단톡방",
//         members: [],
//       },
//       {
//         room: "리액트 단톡방",
//         members: [],
//       },
//       {
//         room: "NodeJS 단톡방",
//         members: [],
//       },
//     ])
//     .then(() => res.send("ok"))
//     .catch((error) => res.send(error));
// });

module.exports = app;
