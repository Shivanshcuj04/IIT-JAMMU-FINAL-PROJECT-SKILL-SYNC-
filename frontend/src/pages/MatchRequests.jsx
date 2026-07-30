import { useEffect, useState } from "react";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";

import { Link } from "react-router-dom";
// ...
{match.status === "accepted" && (
  <Link to={`/chat/${match._id}`} className="chat-btn">💬 Message</Link>
)}

export default function MatchRequests() {
  const [matches, setMatches] = useState([]);
  const { user } = useAuth();

  const load = () => api.get("/matches/me").then((res) => setMatches(res.data.matches));

  useEffect(() => { load(); }, []);

  const respond = async (id, status) => {
    await api.put(`/matches/${id}/respond`, { status });
    load();
  };

  return (
    <div className="container">
      <h2>My Matches</h2>
      {matches.length === 0 && <p>No matches yet.</p>}
      {matches.map((m) => {
        const isReceiver = m.receiver._id === user.id;
        const other = isReceiver ? m.requester : m.receiver;
        return (
          <div className="card" key={m._id}>
            <p><strong>{other.name}</strong> · status: {m.status}</p>
            <p>Offered: {m.offeredSkillName} ↔ Requested: {m.requestedSkillName}</p>
            {isReceiver && m.status === "pending" && (
              <>
                <button onClick={() => respond(m._id, "accepted")}>Accept</button>{" "}
                <button onClick={() => respond(m._id, "rejected")}>Reject</button>
              </>
            )}
          </div>
        );
      })}
    </div>
  );
}
