import { Server, Socket } from "socket.io";
import { SOCKET_EVENTS, ERROR_MESSAGES, LIMITS } from "../config/constants";
import {
  addToQueue,
  matchUsers,
  removeFromQueue,
} from "./matchmaking.service";
import { startChat, endChat, activeChats } from "./chat.service";
import { canSendMessage } from "../utils/rateLimiter";
import { isValidMessage } from "../utils/validators";
import { prisma } from "../db/prisma";
import { MessagePayload } from "../types/socket.types";

export function registerSocketHandlers(io: Server, socket: Socket) {

  /* ===================== SEARCH ===================== */
  socket.on(SOCKET_EVENTS.SEARCH, async () => {
    addToQueue(socket.id);

    const match = matchUsers();
    if (!match) return;

    // 1️⃣ create DB session
    const session = await prisma.chatSession.create({
      data: {
        userA: match[0],
        userB: match[1],
      },
    });

    // 2️⃣ start chat with sessionId
    startChat(match[0], match[1], session.id);

    io.to(match[0]).emit(SOCKET_EVENTS.MATCHED);
    io.to(match[1]).emit(SOCKET_EVENTS.MATCHED);
  });

  /* ===================== MESSAGE ===================== */
  socket.on(SOCKET_EVENTS.MESSAGE, (payload: MessagePayload) => {
    if (!isValidMessage(payload.message)) {
      socket.emit(SOCKET_EVENTS.ERROR, ERROR_MESSAGES.INVALID_MESSAGE);
      return;
    }

    if (!canSendMessage(socket.id, LIMITS.MESSAGES_PER_MINUTE)) {
      socket.emit(SOCKET_EVENTS.ERROR, ERROR_MESSAGES.RATE_LIMIT);
      return;
    }

    const partner = activeChats.get(socket.id);
    if (partner) {
      io.to(partner).emit(SOCKET_EVENTS.MESSAGE, payload);
    }
  });

  /* ===================== SKIP (AUTO RE-MATCH) ===================== */
  socket.on(SOCKET_EVENTS.SKIP, async () => {
    removeFromQueue(socket.id);

    // 1️⃣ end current chat
    const { partner, sessionId } = endChat(socket.id);

    // 2️⃣ update DB
    if (sessionId) {
      await prisma.chatSession.update({
        where: { id: sessionId },
        data: { endedAt: new Date() },
      });
    }

    // 3️⃣ notify partner
    if (partner) {
      io.to(partner).emit(SOCKET_EVENTS.PARTNER_LEFT);
    }

    // 4️⃣ auto re-match
    addToQueue(socket.id);
    const match = matchUsers();
    if (!match) return;

    const newSession = await prisma.chatSession.create({
      data: {
        userA: match[0],
        userB: match[1],
      },
    });

    startChat(match[0], match[1], newSession.id);

    io.to(match[0]).emit(SOCKET_EVENTS.MATCHED);
    io.to(match[1]).emit(SOCKET_EVENTS.MATCHED);
  });

  /* ===================== DISCONNECT ===================== */
  socket.on("disconnect", async () => {
    removeFromQueue(socket.id);

    const { partner, sessionId } = endChat(socket.id);

    if (sessionId) {
      await prisma.chatSession.update({
        where: { id: sessionId },
        data: { endedAt: new Date() },
      });
    }

    if (partner) {
      io.to(partner).emit(SOCKET_EVENTS.PARTNER_LEFT);
    }
  });
}
