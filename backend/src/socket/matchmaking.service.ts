const waitingQueue: string[] = [];

export function addToQueue(socketId: string) {
  if (!waitingQueue.includes(socketId)) {
    waitingQueue.push(socketId);
  }
}

export function removeFromQueue(socketId: string) {
  const index = waitingQueue.indexOf(socketId);
  if (index !== -1) waitingQueue.splice(index, 1);
}

export function matchUsers(): [string, string] | null {
  if (waitingQueue.length >= 2) {
    const userA = waitingQueue.shift()!;
    const userB = waitingQueue.shift()!;
    return [userA, userB];
  }
  return null;
}
