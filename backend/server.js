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

const rooms = {}; // Store users in each room

io.on("connection", (socket) => {
  console.log("A user connected");

  socket.on("joinRoom", ({ roomId, username }) => {
    socket.join(roomId);

    // Add user to the room
    if (!rooms[roomId]) {
      rooms[roomId] = [];
    }
    rooms[roomId].push(username);
    console.log(`${username} joined room ${roomId}`);

    // Notify the room about the user joining
    socket.to(roomId).emit("systemMessage", `${username} has joined the room`);

    // Broadcast the updated user list to the room
    io.to(roomId).emit("roomData", { users: rooms[roomId] });
  });

  socket.on("chatMessage", ({ roomId, username, message }) => {
    // Broadcast the message to the room
    io.to(roomId).emit("message", { username, message });
  });

  socket.on("leaveRoom", ({ roomId, username }) => {
    socket.leave(roomId);
    console.log(`${username} left room ${roomId}`);

    // Remove user from the room
    if (rooms[roomId]) {
      rooms[roomId] = rooms[roomId].filter((user) => user !== username);
    }

    // Notify the room about the user leaving
    socket.to(roomId).emit("systemMessage", `${username} has left the room`);

    // Broadcast the updated user list to the room
    io.to(roomId).emit("roomData", { users: rooms[roomId] });
  });

  socket.on("disconnect", () => {
    console.log("A user disconnected");
    // You can implement logic here to handle user disconnects if needed
  });
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
