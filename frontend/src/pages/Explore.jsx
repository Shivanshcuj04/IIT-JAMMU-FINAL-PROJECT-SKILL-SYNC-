import { useEffect, useState } from "react";
import api from "../api/axios";
import SkillCard from "../components/SkillCard";

export default function Explore() {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState(null);

  useEffect(() => {
    api.get("/users/matches")
      .then((res) => setMatches(res.data.matches))
      .finally(() => setLoading(false));
  }, []);

  const handleRequestSwap = async (receiverId, offeredSkillName, requestedSkillName) => {
    setStatus(null);
    try {
      await api.post("/matches", { receiverId, offeredSkillName, requestedSkillName });
      setStatus({ type: "success", text: "Match request sent." });
    } catch (err) {
      setStatus({ type: "error", text: err.response?.data?.message || "Couldn't send request. Try again." });
    }
  };

  return (
    <div className="container explore-page">
      <p className="explore-eyebrow">Available swaps</p>
      <h2 className="explore-title">Explore</h2>

      {status && (
        <p className={status.type === "success" ? "explore-status success" : "explore-status error"}>
          {status.text}
        </p>
      )}

      {loading && <p className="explore-loading">Finding your matches…</p>}

      {!loading && matches.length === 0 && (
        <div className="explore-empty">
          <h3>No mutual matches yet</h3>
          <p>Add more skills to your profile to widen your matches.</p>
        </div>
      )}

      <div className="explore-grid">
        {matches.map((m) => (
          <SkillCard key={m.user.id} match={m} onRequestSwap={handleRequestSwap} />
        ))}
      </div>
    </div>
  );
}