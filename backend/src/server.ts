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
    origin: ["http://localhost:3000","https://production-us-west2.railway-registry.com"],
    credentials: true,
  })
);

app.use(cookieParser());

// Allowed origins
const allowedOrigins = [
  "http://localhost:3000",
  "https://production-us-west2.railway-registry.com"
];

// Dynamic CORS header middleware
app.use((req, res, next) => {
  const origin = req.headers.origin;
  
  // Check if the request origin is in the allowed list
  if (origin && allowedOrigins.includes(origin)) {
    res.header("Access-Control-Allow-Origin", origin);
  }
  
  res.header("Access-Control-Allow-Credentials", "true");
  next();
});

// Start Server first (non-blocking)
const PORT = process.env.PORT || 5000;
const server = http.createServer(app);

initSocket(server);

server.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});

// MongoDB Connection (non-blocking - server will start even if MongoDB fails)
const mongoUri = process.env.MONGO_URI || "";

if (!mongoUri || mongoUri.trim() === "") {
  console.error("⚠️  WARNING: MONGO_URI environment variable is not set!");
  console.error("Please set MONGO_URI in Railway environment variables.");
  console.error("Format: mongodb+srv://username:password@cluster.mongodb.net/database");
  console.error("Server will continue running but database operations will fail.");
} else {
  mongoose
    .connect(mongoUri)
    .then(() => console.log("✅ MongoDB Connected"))
    .catch((err) => {
      console.error("❌ MongoDB connection error:", err.message);
      console.error("Server will continue running but database operations will fail.");
    });
}

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
