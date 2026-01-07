import { redis } from "../config/redis";
import { Server } from "socket.io";

const WAITING_QUEUE_KEY = "waiting_queue";

/**
 * Add user to matchmaking queue
 */
export async function addToQueue(socketId: string) {
  // avoid duplicates
  await redis.lrem(WAITING_QUEUE_KEY, 0, socketId);
  await redis.lpush(WAITING_QUEUE_KEY, socketId);
}

/**
 * Remove user from queue
 */
export async function removeFromQueue(socketId: string) {
  await redis.lrem(WAITING_QUEUE_KEY, 0, socketId);
}

/**
 * Remove disconnected sockets from Redis queue
 */
async function cleanQueue(io: Server) {
  const users = await redis.lrange(WAITING_QUEUE_KEY, 0, -1);

  for (const socketId of users) {
    if (!io.sockets.sockets.has(socketId)) {
      await redis.lrem(WAITING_QUEUE_KEY, 0, socketId);
    }
  }
}

/**
 * Match two active users
 */
export async function matchUsers(
  io: Server
): Promise<[string, string] | null> {
  // 🔥 critical: clean stale socketIds first
  await cleanQueue(io);

  const userA = await redis.rpop(WAITING_QUEUE_KEY);
  const userB = await redis.rpop(WAITING_QUEUE_KEY);

  // no match possible
  if (!userA || !userB) {
    if (userA) {
      await redis.lpush(WAITING_QUEUE_KEY, userA);
    }
    return null;
  }

  // extra safety: prevent self-match
  if (userA === userB) {
    await redis.lpush(WAITING_QUEUE_KEY, userA);
    return null;
  }

  // ensure both sockets are still connected
  const socketAExists = io.sockets.sockets.has(userA);
  const socketBExists = io.sockets.sockets.has(userB);

  if (!socketAExists || !socketBExists) {
    if (socketAExists) {
      await redis.lpush(WAITING_QUEUE_KEY, userA);
    }
    if (socketBExists) {
      await redis.lpush(WAITING_QUEUE_KEY, userB);
    }
    return null;
  }

  return [userA, userB];
}
