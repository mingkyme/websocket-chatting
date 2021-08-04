var exrpess = require("express");
var app = exrpess();
var server = require("http").createServer(app);
var io = require("socket.io")(server);
app.use(exrpess.static(__dirname + "/public"));

server.listen(3000, function () {
  console.log("Socket IO server listening on port 3000");
});
var chatLog = [];
var userNick = {};

const preNick = [
  "활기찬",
  "강인한",
  "날렵한",
  "고상한",
  "매혹적인",
  "요상한",
  "인기많은",
];
const lastNick = ["과자", "펭귄", "사냥꾼", "마법사", "개미"];
io.on("connection", function (socket) {
  GenerationNick(socket);
  Member(socket);
  // 채팅 로그
  chatLog.forEach((element) => {
    socket.emit("chat", element);
  });

  // 채팅 받으면
  socket.on("chat", function (data) {
    Chat(socket, data);
  });

  // 연결 끊김
  socket.on("disconnect", function () {
    Chat(socket, "disconnected");
    RemoveNick(socket);
  });
});
function Member(socket) {
  socket.emit("member", JSON.stringify(Object.values(userNick)));
  socket.broadcast.emit("member", JSON.stringify(Object.values(userNick)));
}
function Chat(socket, data) {
  var chat = userNick[socket.id] + " : " + data;
  chatLog.push(chat);
  if (chatLog.length > 10) {
    chatLog.splice(0, 1);
  }
  socket.broadcast.emit("chat", chat);
}

function GenerationNick(socket) {
  var nick =
    preNick[Math.floor(Math.random() * preNick.length)] +
    " " +
    lastNick[Math.floor(Math.random() * lastNick.length)];
  userNick[socket.id] = nick;
  socket.emit("nick", nick);
}
function RemoveNick(socket) {
  delete userNick[socket.id];
  socket.broadcast.emit("member", JSON.stringify(Object.values(userNick)));
}
