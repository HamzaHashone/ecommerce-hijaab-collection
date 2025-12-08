import { Server } from "socket.io";
import cookie from "cookie";
import jwt from "jsonwebtoken";

const onlineUsers: Record<string, string> = {};
let io: Server;
export const initSocket = (server: any) => {
  io = new Server(server, {
    cors: {
      origin: "http://localhost:3000",
      credentials: true,
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
