import { Server, Socket } from "socket.io";
import { SOCKET_EVENTS, ERROR_MESSAGES, LIMITS } from "../config/constants";
import {
  addToQueue,
  matchUsers,
  removeFromQueue,
} from "./matchmaking.service";
import { startChat, endChat, getPartner } from "./chat.service";
import { canSendMessage } from "../utils/rateLimiter";
import { isValidMessage } from "../utils/validators";
import { prisma } from "../db/prisma";
import { MessagePayload } from "../types/socket.types";

export function registerSocketHandlers(io: Server, socket: Socket) {

  socket.on(SOCKET_EVENTS.SEARCH, async () => {
    await addToQueue(socket.id);

    const match = await matchUsers(io);
    if (!match) return;

    const session = await prisma.chatSession.create({
      data: {
        userA: match[0],
        userB: match[1],
      },
    });

    await startChat(match[0], match[1], session.id);

    io.to(match[0]).emit(SOCKET_EVENTS.MATCHED);
    io.to(match[1]).emit(SOCKET_EVENTS.MATCHED);
  });

  socket.on(SOCKET_EVENTS.MESSAGE, async (payload: MessagePayload) => {
    if (!isValidMessage(payload.message)) {
      socket.emit(SOCKET_EVENTS.ERROR, ERROR_MESSAGES.INVALID_MESSAGE);
      return;
    }

    const allowed = await canSendMessage(
      socket.id,
      LIMITS.MESSAGES_PER_MINUTE
    );

    if (!allowed) {
      socket.emit(SOCKET_EVENTS.ERROR, ERROR_MESSAGES.RATE_LIMIT);
      return;
    }

    const partner = await getPartner(socket.id);
    if (partner) {
      io.to(partner).emit(SOCKET_EVENTS.MESSAGE, payload);
    }
  });

  socket.on(SOCKET_EVENTS.SKIP, async () => {
    await removeFromQueue(socket.id);

    const { partner, sessionId } = await endChat(socket.id);

    if (sessionId) {
      await prisma.chatSession.update({
        where: { id: sessionId },
        data: { endedAt: new Date() },
      });
    }

    if (partner) {
      io.to(partner).emit(SOCKET_EVENTS.PARTNER_LEFT);
    }

    await addToQueue(socket.id);

    const match = await matchUsers(io);
    if (!match) return;

    const newSession = await prisma.chatSession.create({
      data: {
        userA: match[0],
        userB: match[1],
      },
    });

    await startChat(match[0], match[1], newSession.id);

    io.to(match[0]).emit(SOCKET_EVENTS.MATCHED);
    io.to(match[1]).emit(SOCKET_EVENTS.MATCHED);
  });
  socket.on(SOCKET_EVENTS.END_CHAT, async () => {
  await removeFromQueue(socket.id);

  const { partner, sessionId } = await endChat(socket.id);

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

  
  socket.on("disconnect", async () => {
    await removeFromQueue(socket.id);

    const { partner, sessionId } = await endChat(socket.id);

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
