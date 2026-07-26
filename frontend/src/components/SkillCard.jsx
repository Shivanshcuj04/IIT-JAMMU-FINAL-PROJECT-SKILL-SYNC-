import { useState } from "react";

export default function SkillCard({ match, onRequestSwap }) {
  const [offered, setOffered] = useState(match.iCanTeachThem[0] || "");
  const [requested, setRequested] = useState(match.theyCanTeachMe[0] || "");
  const [sending, setSending] = useState(false);

  const initials = match.user.name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  const handleClick = async () => {
    setSending(true);
    await onRequestSwap(match.user.id, offered, requested);
    setSending(false);
  };

  return (
    <div className="match-card">
      <div className="match-card-header">
        <div className="match-avatar">{initials}</div>
        <div>
          <h3 className="match-name">{match.user.name}</h3>
          <p className="match-meta">
            {match.user.city ? `${match.user.city} · ` : ""}
            ⭐ {match.user.averageRating || "No ratings yet"}
          </p>
        </div>
      </div>

      {match.user.badges?.length > 0 && (
        <div className="match-badges">
          {match.user.badges.map((b) => (
            <span key={b} className="badge">{b}</span>
          ))}
        </div>
      )}

      <div className="match-swap-row">
        <div className="match-swap-col">
          <span className="swap-ticket-label">You offer</span>
          <select value={offered} onChange={(e) => setOffered(e.target.value)}>
            {match.iCanTeachThem.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
        <span className="match-swap-arrow">⇄</span>
        <div className="match-swap-col">
          <span className="swap-ticket-label">You learn</span>
          <select value={requested} onChange={(e) => setRequested(e.target.value)}>
            {match.theyCanTeachMe.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
      </div>

      <button className="match-request-btn" onClick={handleClick} disabled={sending}>
        {sending ? "Sending…" : "Request swap"}
      </button>
    </div>
  );
}