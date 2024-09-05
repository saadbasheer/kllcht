const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const app = express();
app.use(cors());
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log("A user connected");

  socket.on("joinRoom", ({ roomId, username }) => {
    socket.join(roomId);
    console.log(`${username} joined room ${roomId}`);
    socket.to(roomId).emit("message", {
      username: "System",
      message: `${username} has joined the room`,
    });
  });

  socket.on("chatMessage", ({ roomId, username, message }) => {
    io.to(roomId).emit("message", { username, message });
  });

  socket.on("leaveRoom", ({ roomId, username }) => {
    socket.leave(roomId);
    console.log(`${username} left room ${roomId}`);
    socket.to(roomId).emit("message", {
      username: "System",
      message: `${username} has left the room`,
    });
  });

  socket.on("disconnect", () => {
    console.log("A user disconnected");
  });
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
