import { Server } from "socket.io";

export default function initializeSocket(server) {
  const io = new Server(server, {
    cors: {
      origin: "http://localhost:5173",
      methods: ["GET", "POST"],
    },
  });
  io.on("connection", (socket) => {
    console.log("Client connected:", socket.id);

    socket.on("joinRoom", (userId) => {
      socket.join(userId.toString());
      console.log(`User ${userId} joined their notification room.`);
    });

    socket.on("disconnect", () => {
      console.log("Client disconnected:", socket.id);
    });
  });

  return io;
}
