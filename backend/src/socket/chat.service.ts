import { redis } from "../config/redis";

const ACTIVE_CHAT_PREFIX = "active_chat:";
const ACTIVE_SESSION_PREFIX = "active_session:";

/**
 * Start a chat between two users
 */
export async function startChat(
  userA: string,
  userB: string,
  sessionId: string
) {
  // store partner mapping
  await redis.set(`${ACTIVE_CHAT_PREFIX}${userA}`, userB);
  await redis.set(`${ACTIVE_CHAT_PREFIX}${userB}`, userA);

  // store session mapping
  await redis.set(`${ACTIVE_SESSION_PREFIX}${userA}`, sessionId);
  await redis.set(`${ACTIVE_SESSION_PREFIX}${userB}`, sessionId);
}

/**
 * End chat for a socket
 */
export async function endChat(
  socketId: string
): Promise<{
  partner?: string;
  sessionId?: string;
}> {
  const partner = await redis.get(`${ACTIVE_CHAT_PREFIX}${socketId}`);
  const sessionId = await redis.get(`${ACTIVE_SESSION_PREFIX}${socketId}`);

  // cleanup current user
  await redis.del(`${ACTIVE_CHAT_PREFIX}${socketId}`);
  await redis.del(`${ACTIVE_SESSION_PREFIX}${socketId}`);

  // cleanup partner
  if (partner) {
    await redis.del(`${ACTIVE_CHAT_PREFIX}${partner}`);
    await redis.del(`${ACTIVE_SESSION_PREFIX}${partner}`);
  }

  return { partner: partner || undefined, sessionId: sessionId || undefined };
}

/**
 * Get chat partner for a socket
 */
export async function getPartner(socketId: string): Promise<string | null> {
  return redis.get(`${ACTIVE_CHAT_PREFIX}${socketId}`);
}
