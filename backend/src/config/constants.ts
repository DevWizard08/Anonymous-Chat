export const SOCKET_EVENTS = {
  SEARCH: "search",
  MATCHED: "matched",
  MESSAGE: "message",
  SKIP: "skip",
  PARTNER_LEFT: "partner_left",
  ERROR: "error",
};

export const ERROR_MESSAGES = {
  RATE_LIMIT: "Too many messages sent",
  MESSAGE_TOO_LONG: "Message length exceeded",
  INVALID_MESSAGE: "Invalid message",
};

export const LIMITS = {
  MAX_MESSAGE_LENGTH: 500,
  MESSAGES_PER_MINUTE: 20,
};
