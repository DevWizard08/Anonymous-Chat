
export const activeChats = new Map<string, string>();

export const activeSessions = new Map<string, string>();


export function startChat(
  userA: string,
  userB: string,
  sessionId: string
) {
  activeChats.set(userA, userB);
  activeChats.set(userB, userA);

  activeSessions.set(userA, sessionId);
  activeSessions.set(userB, sessionId);
}


export function endChat(socketId: string): {
  partner?: string;
  sessionId?: string;
} {
  const partner = activeChats.get(socketId);
  const sessionId = activeSessions.get(socketId);

  activeChats.delete(socketId);
  activeSessions.delete(socketId);

  if (partner) {
    activeChats.delete(partner);
    activeSessions.delete(partner);
  }

  return { partner, sessionId };
}
