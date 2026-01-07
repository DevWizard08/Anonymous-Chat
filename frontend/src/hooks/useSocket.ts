import { useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";
import { SOCKET_EVENTS } from "../config/constants";
import type { MessagePayload } from "../types/socket.types";

type Status = "IDLE" | "SEARCHING" | "CONNECTED";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export function useSocket() {
  const socketRef = useRef<Socket | null>(null);

  const [status, setStatus] = useState<Status>("IDLE");
  const [messages, setMessages] = useState<MessagePayload[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const socket = io(BACKEND_URL);
    socketRef.current = socket;

    socket.on(SOCKET_EVENTS.MATCHED, () => {
      setError(null);
      setMessages([]);
      setStatus("CONNECTED");
    });

    socket.on(SOCKET_EVENTS.MESSAGE, (payload: MessagePayload) => {
      setMessages(prev => [...prev, { ...payload, self: false }]);
    });

    socket.on(SOCKET_EVENTS.PARTNER_LEFT, () => {
      setStatus("IDLE");
      setMessages([]);
      setError("Partner disconnected");
    });

    socket.on(SOCKET_EVENTS.ERROR, (msg: string) => {
      setError(msg);
      setTimeout(() => setError(null), 3000);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  /** 🔍 Start searching for a partner */
  function search() {
    setError(null);
    setMessages([]);
    socketRef.current?.emit(SOCKET_EVENTS.SEARCH);
    setStatus("SEARCHING");
  }

  /** 💬 Send message */
  function sendMessage(message: string) {
    if (!message.trim()) return;

    socketRef.current?.emit(SOCKET_EVENTS.MESSAGE, { message });
    setMessages(prev => [...prev, { message, self: true }]);
  }

  /** ⏭ Skip current partner and re-match */
  function skip() {
    setError(null);
    setMessages([]);
    socketRef.current?.emit(SOCKET_EVENTS.SKIP);
    setStatus("SEARCHING");
  }

  /** ❌ End chat and go idle */
  function endChat() {
    setError(null);
    setMessages([]);
    socketRef.current?.emit(SOCKET_EVENTS.SKIP);
    setStatus("IDLE");
  }

  return {
    status,
    messages,
    error,
    search,
    sendMessage,
    skip,
    endChat,
  };
}
