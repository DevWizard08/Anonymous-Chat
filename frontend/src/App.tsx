import { useSocket } from "./hooks/useSocket";
import { StatusBar } from "./components/StatusBar";
import { MessageList } from "./components/MessageList";
import { ChatBox } from "./components/ChatBox";

function App() {
  const {
    status,
    messages,
    error,
    search,
    sendMessage,
    skip,
    endChat, // ✅ NEW
  } = useSocket();

  return (
    <div style={{ maxWidth: 500, margin: "50px auto" }}>
      <h2>Anonymous Chat</h2>

      <StatusBar status={status} />

      {error && <div style={{ color: "red" }}>{error}</div>}

      {status === "IDLE" && (
        <button onClick={search}>Start Chat</button>
      )}

      {status === "SEARCHING" && (
        <p>Searching for a partner...</p>
      )}

      {status === "CONNECTED" && (
        <>
          <MessageList messages={messages} />
          <ChatBox onSend={sendMessage} disabled={false} />

          <div style={{ marginTop: 10, display: "flex", gap: 10 }}>
            <button onClick={skip}>Skip</button>
            <button onClick={endChat}>End Chat</button>
          </div>
        </>
      )}
    </div>
  );
}

export default App;
