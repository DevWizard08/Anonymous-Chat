import { useState } from "react";

interface Props {
  onSend: (msg: string) => void;
  disabled: boolean;
}

export function ChatBox({ onSend, disabled }: Props) {
  const [text, setText] = useState("");

  function handleSend() {
    onSend(text);
    setText("");
  }
   function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" && !disabled) {
      handleSend();
    }
  }
  return (
    <div>
      <input
        value={text}
        disabled={disabled}
        onChange={e => setText(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Type message..."
        style={{ width: "80%" }}
      />
      <button onClick={handleSend} disabled={disabled}>
        Send
      </button>
    </div>
  );
}
