import express from "express";
import mongoose from "mongoose";
import http from "http";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import { Server } from "socket.io";
import messageRoutes from "./routes/messages.js";
import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/users.js";
import verifyJWT from "./middleware/verifyJWT.js";

dotenv.config();
const port = process.env.PORT;
const allowedOrigins = ["http://localhost:5173"];

const app = express();
const server = http.createServer(app);
let onlineUsers = [];

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    credentials: true,
  },
});
const register = (username, socketId) => {
  const existeUser = onlineUsers.find((user) => user.username === username);

  if (existeUser) {
    existeUser.socketId = socketId;
  } else {
    onlineUsers.push({ username, socketId });
  }

  console.log(`${username} registered with socket id : ${socketId}`);
};

const removeUser = (socketId) => {
  onlineUsers = onlineUsers.filter((user) => user.socketId !== socketId);
};

const getUser = (username) => {
  return onlineUsers.find((user) => user.username === username);
};

io.on("connection", (socket) => {
  socket.on("register", (username) => {
    register(username, socket.id);
    console.log(onlineUsers);
    io.emit("online-users", onlineUsers);
  });

  // Handling Message

  socket.on("send message", ({ message }) => {
    const receiver = getUser(message.recepient);
    if (receiver && receiver.socketId) {
      socket.to(receiver.socketId).emit("recieved message", message);
    } else {
      console.log(`user ${message.recepient} not found`);
    }
  });

  // Handling Notification

  socket.on("sendNotification", ({ notificationMsg }) => {
    const receiver = getUser(notificationMsg.recepient);
    if (receiver && receiver.socketId) {
      socket.to(receiver.socketId).emit("getNotification", {
        notificationMsg,
      });
    }
  });

  // Handling Room

  socket.on("join-room", ({ roomId, username }) => {
    socket.join(roomId);
    console.log(`${username} joined ${roomName}`);
    socket.to(roomId).emit("user-joined", `${username} has joined`);
  });

  socket.on("room-message", ({ roomId, message }) => {
    socket.to(roomId).emit("recieve-room-message", message);
  });

  socket.on("leave-room", ({ roomId, username }) => {
    socket.leave(roomId);
    socket.to(roomId).emit("user-left", username);
  });

  socket.on("logout", (currentUser) => {
    removeUser(socket.id);
    console.log(`${currentUser} logged out with the id ${socket.id}`);
    io.emit("online-users", onlineUsers);
  });

  socket.on("disconnect", () => {
    removeUser(socket.id);
    console.log(
      `user ${socket.id} disconnected, remaining users ${JSON.stringify(
        onlineUsers
      )}`
    );

    io.emit("online-users", onlineUsers);
  });
});

app.use("/auth", authRoutes);
app.use("/messages", verifyJWT, messageRoutes);
app.use("/users", verifyJWT, userRoutes);

app.post("*", (req, res) => {
  res.status(500).json({ msg: "Server Error" });
});

mongoose
  .connect("mongodb://localhost:27017/chatApp")
  .then(() => {
    console.log("connected");
    server.listen(port, () => {
      console.log(`running on port: ${port}`);
    });
  })
  .catch(() => console.log("connection failed"));
