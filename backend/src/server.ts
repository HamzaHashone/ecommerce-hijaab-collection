import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import app from "./index";
import http from "http";
import cookieParser from "cookie-parser";
import { Server } from "socket.io";
import cookie from "cookie";
import jwt from "jsonwebtoken";
import { initSocket } from "./services/socket";

dotenv.config();

// Middleware
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

app.use(cookieParser());

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Credentials", "true");
  res.header("Access-Control-Allow-Origin", "http://localhost:3000");
  next();
});

// MongoDB Connection
const mongoUri = process.env.MONGO_URI || "";

if (!mongoUri || mongoUri.trim() === "") {
  console.error("❌ ERROR: MONGO_URI environment variable is not set!");
  console.error("Please set MONGO_URI in Railway environment variables.");
  console.error("Format: mongodb+srv://username:password@cluster.mongodb.net/database");
  process.exit(1);
}

mongoose
  .connect(mongoUri)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err.message);
    process.exit(1);
  });

// Start Server
const PORT = process.env.PORT || 5000;
const server = http.createServer(app);

initSocket(server);

// const io = new Server(server, {
//   cors: {
//     origin: "http://localhost:3000",
//     credentials: true,
//   },
// });

// io.use((socket, next) => {
//   try {
//     const cookies = socket.handshake.headers.cookie;
//     if (!cookies) return next(new Error("No cookies found"));

//     const parsedCookies = cookie.parse(cookies);
//     const token = parsedCookies.Ecommerce;
//     if (!token) return next(new Error("No token found"));

//     const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
//     (socket as any).user = decoded;
//     next();
//   } catch (err) {
//     next(new Error("Authentication error"));
//   }
// });

// const onlineUsers:any={}

// // Handle Socket.IO Connections
// io.on("connection", (socket) => {
//   console.log(`User connected: ${(socket as any).user.id}`);

//   socket.on("register", (userId) => {
//     onlineUsers[userId] = socket.id;
//   });

//   socket.on("disconnect", () => {
//     console.log(`User disconnected: ${(socket as any).user.id}`);
//   });
// });

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
