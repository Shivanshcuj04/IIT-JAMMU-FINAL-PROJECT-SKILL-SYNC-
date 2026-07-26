import { useEffect, useState } from "react";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";

export default function Sessions() {
  const { user } = useAuth();
  const [sessions, setSessions] = useState([]);
  const [acceptedMatches, setAcceptedMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ matchId: "", scheduledAt: "", durationMinutes: 60, meetingLink: "" });
  const [scheduling, setScheduling] = useState(false);
  const [reviewDrafts, setReviewDrafts] = useState({});
  const [reviewedSessionIds, setReviewedSessionIds] = useState([]);
  const [status, setStatus] = useState(null);

  const load = async () => {
    const [sessionsRes, matchesRes] = await Promise.all([
      api.get("/sessions/me"),
      api.get("/matches/me"),
    ]);
    setSessions(sessionsRes.data.sessions);
    setAcceptedMatches(matchesRes.data.matches.filter((m) => m.status === "accepted"));
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const otherParticipant = (session) => {
    const match = acceptedMatches.find((m) => m._id === session.match?._id || m._id === session.match);
    if (!match) return { name: "Swap partner", id: null };
    const isReceiver = match.receiver._id === user.id;
    const other = isReceiver ? match.requester : match.receiver;
    return { name: other.name, id: other._id };
  };

  const handleSchedule = async (e) => {
    e.preventDefault();
    setScheduling(true);
    setStatus(null);
    try {
      await api.post("/sessions", form);
      setStatus({ type: "success", text: "Session scheduled." });
      setForm({ matchId: "", scheduledAt: "", durationMinutes: 60, meetingLink: "" });
      load();
    } catch (err) {
      setStatus({ type: "error", text: err.response?.data?.message || "Couldn't schedule session." });
    } finally {
      setScheduling(false);
    }
  };

  const saveNotes = async (sessionId, notes) => {
    await api.put(`/sessions/${sessionId}/notes`, { notes });
  };

  const markComplete = async (sessionId) => {
    await api.put(`/sessions/${sessionId}/complete`);
    load();
  };

  const submitReview = async (sessionId, revieweeId) => {
    const draft = reviewDrafts[sessionId] || { rating: 5, comment: "" };
    await api.post("/reviews", {
      sessionId,
      revieweeId,
      rating: draft.rating,
      comment: draft.comment,
    });
    setReviewedSessionIds((ids) => [...ids, sessionId]);
  };

  if (loading) return <div className="container">Loading sessions…</div>;

  return (
    <div className="container sessions-page">
      <p className="explore-eyebrow">Scheduled swaps</p>
      <h2 className="explore-title">Sessions</h2>

      {status && (
        <p className={status.type === "success" ? "explore-status success" : "explore-status error"}>
          {status.text}
        </p>
      )}

      <div className="add-skill-card">
        <h3 className="profile-section-title">Schedule a session</h3>
        {acceptedMatches.length === 0 ? (
          <p className="empty-hint">You need an accepted match before scheduling a session.</p>
        ) : (
          <form onSubmit={handleSchedule}>
            <div className="add-skill-row">
              <select value={form.matchId} onChange={(e) => setForm({ ...form, matchId: e.target.value })} required>
                <option value="">Choose a match</option>
                {acceptedMatches.map((m) => {
                  const isReceiver = m.receiver._id === user.id;
                  const other = isReceiver ? m.requester : m.receiver;
                  return <option key={m._id} value={m._id}>{other.name} — {m.offeredSkillName} ⇄ {m.requestedSkillName}</option>;
                })}
              </select>
              <input
                type="datetime-local"
                value={form.scheduledAt}
                onChange={(e) => setForm({ ...form, scheduledAt: e.target.value })}
                required
              />
              <input
                type="number"
                min="15"
                step="15"
                value={form.durationMinutes}
                onChange={(e) => setForm({ ...form, durationMinutes: Number(e.target.value) })}
                style={{ maxWidth: 100 }}
              />
              <input
                placeholder="Meeting link (optional)"
                value={form.meetingLink}
                onChange={(e) => setForm({ ...form, meetingLink: e.target.value })}
              />
              <button type="submit" disabled={scheduling}>{scheduling ? "Scheduling…" : "Schedule"}</button>
            </div>
          </form>
        )}
      </div>

      <h3 className="profile-section-title" style={{ marginTop: 28 }}>Your sessions</h3>
      {sessions.length === 0 && <p className="empty-hint">No sessions scheduled yet.</p>}

      {sessions.map((s) => {
        const other = otherParticipant(s);
        const isCompleted = s.status === "completed";
        const alreadyReviewed = reviewedSessionIds.includes(s._id);
        return (
          <div className="session-card" key={s._id}>
            <div className="session-card-top">
              <span className="match-request-name">{other.name}</span>
              <span className={isCompleted ? "status-badge status-accepted" : "status-badge status-pending"}>
                {s.status}
              </span>
            </div>
            <p className="session-meta">
              {new Date(s.scheduledAt).toLocaleString()} · {s.durationMinutes} min
            </p>
            <a href={s.meetingLink} target="_blank" rel="noreferrer" className="session-link">Join meeting link</a>

            <label className="auth-label">Notes</label>
            <textarea
              defaultValue={s.notes || ""}
              onBlur={(e) => saveNotes(s._id, e.target.value)}
              placeholder="Add session notes, resources, milestones…"
              rows={3}
            />

            {!isCompleted && (
              <button className="match-request-btn" style={{ marginTop: 10 }} onClick={() => markComplete(s._id)}>
                Mark as completed
              </button>
            )}

            {isCompleted && !alreadyReviewed && other.id && (
              <div className="review-form">
                <label className="auth-label">Rate this swap</label>
                <select
                  value={reviewDrafts[s._id]?.rating || 5}
                  onChange={(e) => setReviewDrafts({ ...reviewDrafts, [s._id]: { ...reviewDrafts[s._id], rating: Number(e.target.value) } })}
                >
                  {[5, 4, 3, 2, 1].map((n) => <option key={n} value={n}>{"⭐".repeat(n)}</option>)}
                </select>
                <textarea
                  placeholder="Leave a comment (optional)"
                  rows={2}
                  onChange={(e) => setReviewDrafts({ ...reviewDrafts, [s._id]: { ...reviewDrafts[s._id], comment: e.target.value } })}
                />
                <button className="accept-btn" onClick={() => submitReview(s._id, other.id)}>Submit review</button>
              </div>
            )}

            {isCompleted && alreadyReviewed && <p className="empty-hint">Review submitted. Thanks!</p>}
          </div>
        );
      })}
    </div>
  );
}