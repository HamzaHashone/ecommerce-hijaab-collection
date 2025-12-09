import { Server } from "socket.io";
import cookie from "cookie";
import jwt from "jsonwebtoken";

const onlineUsers: Record<string, string> = {};
let io: Server;

// Allowed origins for Socket.IO (same as HTTP CORS)
const getAllowedSocketOrigins = (): string[] => {
  return [
    "http://localhost:3000",
    process.env.FRONTEND_URL,
    "https://ecommerce-hijaab-collection.vercel.app",
    "https://ecommerce-hijaab-collection-production.up.railway.app"
  ].filter(Boolean);
};

export const initSocket = (server: any) => {
  const allowedOrigins = getAllowedSocketOrigins();
  console.log("🔌 Socket.IO allowed origins:", allowedOrigins);
  
  io = new Server(server, {
    cors: {
      origin: function (origin, callback) {
        // Allow requests with no origin (like mobile apps, Postman)
        if (!origin) {
          console.log("✅ Socket.IO: Allowing request with no origin");
          return callback(null, true);
        }
        
        // Check if origin is in allowed list
        if (allowedOrigins.includes(origin)) {
          console.log(`✅ Socket.IO: Allowing origin: ${origin}`);
          callback(null, true);
        } else if (origin.includes(".vercel.app")) {
          // Allow any Vercel preview deployment
          console.log(`✅ Socket.IO: Allowing Vercel origin: ${origin}`);
          callback(null, true);
        } else {
          console.log(`❌ Socket.IO: Blocked origin: ${origin}`);
          callback(new Error(`Socket.IO CORS: Origin ${origin} is not allowed`));
        }
      },
      credentials: true,
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    console.log(`User connected: ${socket.id}`);

    socket.on("register", (userId: string) => {
      onlineUsers[userId] = socket.id;
      console.log("Registered users:", onlineUsers);
    });

    socket.on("disconnect", () => {
      console.log(`User disconnected: ${socket.id}`);
    });
  });

  return io;
};

export const getIO = (): Server => {
  if (!io) {
    throw new Error("Socket.io not initrailze");
  }
  return io;
};

export { onlineUsers };
