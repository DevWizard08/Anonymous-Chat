import { LIMITS } from "../config/constants";

export function isValidMessage(message: string): boolean {
  if (!message) return false;
  if (typeof message !== "string") return false;
  if (message.trim().length === 0) return false;
  if (message.length > LIMITS.MAX_MESSAGE_LENGTH) return false;
  return true;
}
