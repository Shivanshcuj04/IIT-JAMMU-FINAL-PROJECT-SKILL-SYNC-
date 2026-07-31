import { useState, useEffect, useRef, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";

function linkify(text) {
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  return text.split(urlRegex).map((part, i) =>
    urlRegex.test(part)
      ? <a key={i} href={part} target="_blank" rel="noopener noreferrer" className="chat-link">{part}</a>
      : part
  );
}

export default function Chat() {
  const { matchId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const myId = user?.id;

  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const bottomRef = useRef(null);

  const fetchMessages = useCallback(async () => {
    try {
      const res = await api.get(`/messages/${matchId}`);
      setMessages(res.data);
      setError("");
    } catch (err) {
      setError(err.response?.data?.message || "Could not load messages");
    } finally {
      setLoading(false);
    }
  }, [matchId]);

  useEffect(() => {
    fetchMessages();
    const interval = setInterval(fetchMessages, 4000);
    return () => clearInterval(interval);
  }, [fetchMessages]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    try {
      await api.post(`/messages/${matchId}`, { text });
      setText("");
      fetchMessages();
    } catch (err) {
      setError(err.response?.data?.message || "Could not send message");
    }
  };

  return (
    <div className="container chat-page">
      <button className="chat-back" onClick={() => navigate("/matches")}>← Back to Matches</button>
      <h2>Chat</h2>
      {error && <p className="chat-error">{error}</p>}
      <div className="chat-window">
        {loading ? (
          <p>Loading messages...</p>
        ) : messages.length === 0 ? (
          <p className="chat-empty">No messages yet — say hi, and drop a YouTube/Drive link or your contact info to get started.</p>
        ) : (
          messages.map((m) => (
            <div key={m._id} className={`chat-bubble ${m.sender === myId ? "mine" : "theirs"}`}>
              <p>{linkify(m.text)}</p>
              <span className="chat-time">
                {new Date(m.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
              </span>
            </div>
          ))
        )}
        <div ref={bottomRef} />
      </div>
      <form className="chat-input-row" onSubmit={sendMessage}>
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type a message, paste a YouTube/Drive link, or share your contact..."
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
}
  
