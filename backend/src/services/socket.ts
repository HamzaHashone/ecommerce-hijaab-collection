import { Server } from "socket.io";
import cookie from "cookie";
import jwt from "jsonwebtoken";

const onlineUsers: Record<string, string> = {};
let io: Server;

export const initSocket = (server: any) => {
  io = new Server(server, {
    cors: {
      origin: function (origin, callback) {
        // Allow requests with no origin (like mobile apps, Postman)
        if (!origin) return callback(null, true);
        
        // Always allow localhost for development
        if (origin === "http://localhost:3000" || origin === "http://localhost:3001"|| origin === "https://ecommerce-hijaab-collection.vercel.app"|| origin === "https://ecommerce-hijaab-collection-production.up.railway.app") {
          return callback(null, true);
        }
        
        // Allow if FRONTEND_URL is set and matches
        if (process.env.FRONTEND_URL && origin === process.env.FRONTEND_URL) {
          return callback(null, true);
        }
        
        // Allow Railway domains (for production)
        if (origin.includes("railway.app") || origin.includes("railway-registry.com")) {
          console.log(`Socket.IO: Allowing Railway origin: ${origin}`);
          return callback(null, true);
        }
        
        console.log(`Socket.IO: Blocked origin: ${origin}`);
        callback(null, false);
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
