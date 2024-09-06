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

    // Notify the room that the user joined
    socket.to(roomId).emit("systemMessage", `${username} has joined the room`);
  });

  socket.on("chatMessage", ({ roomId, username, message }) => {
    // Broadcast regular chat messages to the room
    io.to(roomId).emit("message", { username, message });
  });

  socket.on("leaveRoom", ({ roomId, username }) => {
    socket.leave(roomId);
    console.log(`${username} left room ${roomId}`);

    // Notify the room that the user left
    socket.to(roomId).emit("systemMessage", `${username} has left the room`);
  });

  socket.on("disconnect", () => {
    console.log("A user disconnected");
  });
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
