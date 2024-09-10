const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const app = express();
app.use(cors());


// dont you sleep now
app.get("/health", (req, res) => {
  console.log(`Health check pinged at ${new Date().toISOString()}`);
  res.status(200).send("OK");
});

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
    socket.to(roomId).emit("systemMessage", `${username} has joined the room`);
    io.to(roomId).emit("roomData", { users: rooms[roomId] });
  });

  // Listen for chat messages
  socket.on("chatMessage", ({ roomId, username, message }) => {
    // Broadcast the message to the room
    io.to(roomId).emit("message", { username, message });
  });

  // Listen for leaveRoom event
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

  // Listen for killChat event
  socket.on("killChat", ({ roomId, username }) => {
    console.log(`${username} initiated killchat for room ${roomId}`);

    // Send system message to the room
    io.to(roomId).emit(
      "systemMessage",
      `${username} has initiated /kllcht. This chat will now be disposed.`
    );

    // Notify all clients in the room to redirect or handle chat termination
    io.to(roomId).emit("chatKilled");

    // Remove all users from the room
    if (rooms[roomId]) {
      rooms[roomId].forEach((user) => {
        const userSocket = getUserSocket(user);
        if (userSocket) {
          userSocket.leave(roomId);
        }
      });
      delete rooms[roomId]; // Clear the room
    }
  });

  // Helper function to get a user's socket by username
  function getUserSocket(username) {
    return Array.from(io.sockets.sockets.values()).find(
      (socket) => socket.username === username
    );
  }

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
