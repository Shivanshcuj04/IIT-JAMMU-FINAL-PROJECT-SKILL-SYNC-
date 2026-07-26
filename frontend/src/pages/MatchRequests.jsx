import { useEffect, useState } from "react";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";

export default function MatchRequests() {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const load = () => api.get("/matches/me").then((res) => setMatches(res.data.matches)).finally(() => setLoading(false));

  useEffect(() => { load(); }, []);

  const respond = async (id, status) => {
    await api.put(`/matches/${id}/respond`, { status });
    load();
  };

  return (
    <div className="container matches-page">
      <p className="explore-eyebrow">Requests and swaps</p>
      <h2 className="explore-title">My matches</h2>

      {loading && <p className="explore-loading">Loading your matches…</p>}

      {!loading && matches.length === 0 && (
        <div className="explore-empty">
          <h3>No matches yet</h3>
          <p>Head over to Explore to send your first swap request.</p>
        </div>
      )}

      {matches.map((m) => {
        const isReceiver = m.receiver._id === user.id;
        const other = isReceiver ? m.requester : m.receiver;
        return (
          <div className="match-request-card" key={m._id}>
            <div className="match-request-top">
              <span className="match-request-name">{other.name}</span>
              <span className={`status-badge status-${m.status}`}>{m.status}</span>
            </div>
            <p className="match-request-swap">
              Offered <strong>{m.offeredSkillName}</strong> ⇄ Requested <strong>{m.requestedSkillName}</strong>
            </p>
            {isReceiver && m.status === "pending" && (
              <div className="match-request-actions">
                <button className="accept-btn" onClick={() => respond(m._id, "accepted")}>Accept</button>
                <button className="reject-btn" onClick={() => respond(m._id, "rejected")}>Reject</button>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}