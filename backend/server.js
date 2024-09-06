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

  // Listen for joining room
  socket.on("joinRoom", ({ roomId, username }) => {
    socket.join(roomId);

    socket.roomId = roomId;
    socket.username = username;
    // Add user to the room
    if (!rooms[roomId]) {
      rooms[roomId] = [];
    }
    if (!rooms[roomId].includes(username)) {
      rooms[roomId].push(username);
    }

    console.log(`${username} joined room ${roomId}`);

    socket.to(roomId).emit("systemMessage", `${username} has left the room`);
    io.to(roomId).emit("roomData", { users: rooms[roomId] });
  });

  // Listen for chat messages
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

    socket.to(roomId).emit("systemMessage", `${username} has left the room`);
    io.to(roomId).emit("roomData", { users: rooms[roomId] });
  });

  // Handle disconnection
  socket.on("disconnect", () => {
    const { roomId, username } = socket;
    if (roomId && username && rooms[roomId]) {
      rooms[roomId] = rooms[roomId].filter((user) => user !== username);

      socket.to(roomId).emit("systemMessage", `${username} has disconnected`);
      io.to(roomId).emit("roomData", { users: rooms[roomId] });
    }

    console.log("A user disconnected");
  });
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
