// src/socket/chat.service.ts

// socketId -> partnerSocketId
export const activeChats = new Map<string, string>();

// socketId -> chatSessionId (DB)
export const activeSessions = new Map<string, string>();

/**
 * Called when two users are matched
 */
export function startChat(
  userA: string,
  userB: string,
  sessionId: string
) {
  // map partners
  activeChats.set(userA, userB);
  activeChats.set(userB, userA);

  // map session
  activeSessions.set(userA, sessionId);
  activeSessions.set(userB, sessionId);
}

/**
 * Called when chat ends (skip / disconnect)
 */
export function endChat(socketId: string): {
  partner?: string;
  sessionId?: string;
} {
  const partner = activeChats.get(socketId);
  const sessionId = activeSessions.get(socketId);

  // cleanup for current socket
  activeChats.delete(socketId);
  activeSessions.delete(socketId);

  // cleanup for partner as well
  if (partner) {
    activeChats.delete(partner);
    activeSessions.delete(partner);
  }

  return { partner, sessionId };
}
