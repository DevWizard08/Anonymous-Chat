import { Server } from "socket.io";
import { registerSocketHandlers } from "./socket.handlers";

export function initSocket(server: any) {
  const io = new Server(server, {
    cors: { origin: "*" },
  });

  io.on("connection", socket => {
    registerSocketHandlers(io, socket);
  });
}
