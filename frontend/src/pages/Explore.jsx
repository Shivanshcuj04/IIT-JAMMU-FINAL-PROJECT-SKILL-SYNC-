import { useEffect, useState } from "react";
import api from "../api/axios";
import SkillCard from "../components/SkillCard";

export default function Explore() {
  const [matches, setMatches] = useState([]);
  const [status, setStatus] = useState("");

  useEffect(() => {
    api.get("/users/matches").then((res) => setMatches(res.data.matches));
  }, []);

  const handleRequestSwap = async (receiverId, offeredSkillName, requestedSkillName) => {
    try {
      await api.post("/matches", { receiverId, offeredSkillName, requestedSkillName });
      setStatus("Match request sent!");
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
        <SkillCard key={m.user.id} match={m} onRequestSwap={handleRequestSwap} />
      ))}
    </div>
  );
}
