import { useState, useEffect, useRef, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";

const MAX_FILE_SIZE = 4 * 1024 * 1024; // 4MB
const ALLOWED_TYPES = [
  "image/jpeg", "image/png", "image/gif", "image/webp",
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];

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
  const [uploading, setUploading] = useState(false);
  const bottomRef = useRef(null);
  const fileInputRef = useRef(null);

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

  const handleFileSelect = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;

    if (!ALLOWED_TYPES.includes(file.type)) {
      setError("Only images, PDFs, and Word docs are supported.");
      return;
    }
    if (file.size > MAX_FILE_SIZE) {
      setError("File is too large — 4MB max.");
      return;
    }

    setUploading(true);
    setError("");
    try {
      const dataUrl = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });

      await api.post(`/messages/${matchId}`, {
        fileUrl: dataUrl,
        fileName: file.name,
        fileType: file.type,
      });
      fetchMessages();
    } catch (err) {
      setError(err.response?.data?.message || "Could not send file");
    } finally {
      setUploading(false);
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
              {m.text && <p>{linkify(m.text)}</p>}
              {m.fileUrl && m.fileType?.startsWith("image/") && (
                <img src={m.fileUrl} alt={m.fileName || "attachment"} className="chat-image" />
              )}
              {m.fileUrl && !m.fileType?.startsWith("image/") && (
                <a href={m.fileUrl} download={m.fileName} className="chat-file-link">
                  📎 {m.fileName || "Download file"}
                </a>
              )}
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
          type="file"
          ref={fileInputRef}
          onChange={handleFileSelect}
          style={{ display: "none" }}
          accept="image/*,.pdf,.doc,.docx"
        />
        <button
          type="button"
          className="btn-outline chat-attach-btn"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          title="Attach a file"
        >
          {uploading ? "..." : "📎"}
        </button>
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
