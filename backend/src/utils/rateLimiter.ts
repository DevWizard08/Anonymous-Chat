const userMessages = new Map<string, number[]>();

export function canSendMessage(socketId: string, limit = 20): boolean {
  const now = Date.now();
  const timestamps = userMessages.get(socketId) || [];

  const recent = timestamps.filter(t => now - t < 60000);
  if (recent.length >= limit) return false;

  recent.push(now);
  userMessages.set(socketId, recent);
  return true;
}
