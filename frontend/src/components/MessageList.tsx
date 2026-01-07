import type { MessagePayload } from "../types/socket.types";

interface Props {
  messages: MessagePayload[];
}

export function MessageList({ messages }: Props) {
  return (
    <div
      style={{
        border: "1px solid #ccc",
        height: 300,
        padding: 10,
        overflowY: "auto",
        marginBottom: 10,
      }}
    >
      {messages.map((msg, idx) => (
        <div
          key={idx}
          style={{
            textAlign: msg.self ? "right" : "left",
            marginBottom: 5,
          }}
        >
          {msg.message}
        </div>
      ))}
    </div>
  );
}
