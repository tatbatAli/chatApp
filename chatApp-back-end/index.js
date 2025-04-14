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
const userSocketId = {};

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by Cors"));
      }
    },
    credentials: true,
  })
);

const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
  },
});

io.on("connection", (socket) => {
  socket.on("register", (username) => {
    if (!userSocketId[username]) {
      userSocketId[username] = socket.id;
    } else {
      console.log(
        `user ${username} is already registered with socket id ${userSocketId[username]}`
      );
    }
  });

  socket.on("send message", ({ from, to, message }) => {
    if (userSocketId[to]) {
      socket.to(userSocketId[to]).emit("recieved message", message);
    } else {
      console.log(`user ${to} not found`);
    }
  });

  socket.on("disconnect", () => {
    for (let [username, socketId] of Object.entries(userSocketId)) {
      {
        if (socketId === socket.id) {
          delete userSocketId[username];
          console.log(`${username} disconnet`);
          break;
        }
      }
    }
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
