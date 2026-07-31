import { useEffect, useState } from "react";
import api from "../api/axios";
import SkillCard from "../components/SkillCard";
import { useAuth } from "../context/AuthContext";

export default function Explore() {
  const { user } = useAuth();
  const [matches, setMatches] = useState([]);
  const [requestedIds, setRequestedIds] = useState(new Set());
  const [status, setStatus] = useState("");

  const loadAll = async () => {
    const [candidatesRes, myMatchesRes] = await Promise.all([
      api.get("/users/matches"),
      api.get("/matches/me"),
    ]);
    setMatches(candidatesRes.data.matches);

    const active = (myMatchesRes.data.matches || []).filter((m) =>
      ["pending", "accepted"].includes(m.status)
    );
    const ids = new Set(
      active.map((m) => {
        const otherId = String(m.requester._id) === String(user.id) ? m.receiver._id : m.requester._id;
        return String(otherId);
      })
    );
    setRequestedIds(ids);
  };

  useEffect(() => { loadAll(); }, []);

  const handleRequestSwap = async (receiverId, offeredSkillName, requestedSkillName) => {
    try {
      await api.post("/matches", { receiverId, offeredSkillName, requestedSkillName });
      setStatus("Match request sent!");
      setRequestedIds((prev) => new Set(prev).add(String(receiverId)));
    } catch (err) {
      setStatus(err.response?.data?.message || "Failed to send request");
    }
  };

  return (
    <div className="container">
      <h2>Explore Swaps</h2>
      {status && <p>{status}</p>}
      {matches.length === 0 && <p>No mutual matches yet — add more skills to your profile.</p>}
      {matches.map((m) => (
        <SkillCard
          key={m.user.id}
          match={m}
          onRequestSwap={handleRequestSwap}
          alreadyRequested={requestedIds.has(String(m.user.id))}
        />
      ))}
    </div>
  );
}
