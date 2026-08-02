import { useEffect, useState } from "react";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import { scheduleSession, getMySessions, completeSession } from "../api/sessions";
import { leaveReview } from "../api/reviews";
import Skeleton from "../components/Skeleton";

const emptyForm = { matchId: "", scheduledAt: "", durationMinutes: 60, meetingLink: "" };

export default function Sessions() {
  const { user } = useAuth();
  const [allMatches, setAllMatches] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [reviewForms, setReviewForms] = useState({});
  const [reviewedSessionIds, setReviewedSessionIds] = useState(new Set());
  const [reportOpenIds, setReportOpenIds] = useState(new Set());
  const [reportForms, setReportForms] = useState({});
  const [reportedIds, setReportedIds] = useState(new Set());

  const loadAll = async () => {
    setLoading(true);
    try {
      const [matchesRes, sessionsRes] = await Promise.all([
        api.get("/matches/me"),
        getMySessions(),
      ]);
      setAllMatches(matchesRes.data.matches || []);
      setSessions(sessionsRes.data.sessions || []);
      setError("");
    } catch (err) {
      setError(err.response?.data?.message || "Could not load sessions");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadAll(); }, []);

  const matchLookup = Object.fromEntries(allMatches.map((m) => [m._id, m]));
  const acceptedMatches = allMatches.filter((m) => m.status === "accepted");

  const otherParticipant = (matchRefOrId) => {
    const id = typeof matchRefOrId === "string" ? matchRefOrId : matchRefOrId?._id;
    const full = matchLookup[id];
    if (!full) return null;
    const isReceiver = full.receiver?._id === user.id;
    return isReceiver ? full.requester : full.receiver;
  };

  const partnerName = (matchRefOrId) => otherParticipant(matchRefOrId)?.name || "Unknown";

  const handleSchedule = async (e) => {
    e.preventDefault();
    setError("");
    if (!form.matchId || !form.scheduledAt) {
      setError("Pick a match and a date/time.");
      return;
    }
    try {
      await scheduleSession(form);
      setForm(emptyForm);
      loadAll();
    } catch (err) {
      setError(err.response?.data?.message || "Could not schedule session");
    }
  };

  const handleComplete = async (id) => {
    try {
      await completeSession(id);
      loadAll();
    } catch (err) {
      setError(err.response?.data?.message || "Could not update session");
    }
  };

  const handleRatingChange = (sessionId, rating) => {
    setReviewForms((prev) => ({ ...prev, [sessionId]: { ...(prev[sessionId] || {}), rating } }));
  };
  const handleCommentChange = (sessionId, comment) => {
    setReviewForms((prev) => ({ ...prev, [sessionId]: { ...(prev[sessionId] || {}), comment } }));
  };

  const handleSubmitReview = async (session) => {
    const formState = reviewForms[session._id];
    if (!formState?.rating) {
      setError("Pick a star rating first.");
      return;
    }
    const reviewee = otherParticipant(session.match);
    if (!reviewee?._id) {
      setError("Could not determine who to rate.");
      return;
    }
    try {
      await leaveReview({
        sessionId: session._id,
        revieweeId: reviewee._id,
        rating: formState.rating,
        comment: formState.comment || "",
      });
      setReviewedSessionIds((prev) => new Set(prev).add(session._id));
      setError("");
    } catch (err) {
      setError(err.response?.data?.message || "Could not submit review");
    }
  };

  const toggleReportForm = (sessionId) => {
    setReportOpenIds((prev) => {
      const next = new Set(prev);
      next.has(sessionId) ? next.delete(sessionId) : next.add(sessionId);
      return next;
    });
  };
  const handleReportTextChange = (sessionId, val) => {
    setReportForms((prev) => ({ ...prev, [sessionId]: val }));
  };
  const handleSubmitReport = async (session) => {
    const reason = reportForms[session._id];
    if (!reason || !reason.trim()) {
      setError("Please describe the issue before submitting a report.");
      return;
    }
    const target = otherParticipant(session.match);
    if (!target?._id) {
      setError("Could not determine who to report.");
      return;
    }
    try {
      await api.post(`/users/${target._id}/report`, { reason, sessionId: session._id });
      setReportedIds((prev) => new Set(prev).add(session._id));
      setReportOpenIds((prev) => {
        const next = new Set(prev);
        next.delete(session._id);
        return next;
      });
      setError("");
    } catch (err) {
      setError(err.response?.data?.message || "Could not submit report");
    }
  };

  if (loading) {
  return (
    <div className="container">
      <Skeleton width="140px" height="32px" style={{ marginBottom: "24px" }} />
      <Skeleton height="200px" style={{ marginBottom: "32px", maxWidth: "480px" }} />
      <Skeleton height="100px" style={{ marginBottom: "12px" }} />
      <Skeleton height="100px" />
    </div>
  );
}

  return (
    <div className="container">
      <h2>Sessions</h2>
      <p>
        Schedule a session with one of your accepted matches. Once created, both of you
        see it here automatically — no code to share.
      </p>

      {error && <p className="status-message status-error">{error}</p>}

      <div className="card" style={{ maxWidth: "480px", marginBottom: "32px" }}>
        <h3 className="profile-section-title">Schedule a new session</h3>
        {acceptedMatches.length === 0 ? (
          <p className="empty-hint">You need an accepted match before you can schedule a session.</p>
        ) : (
          <form onSubmit={handleSchedule}>
            <label htmlFor="session-match">Match</label>
            <select
              id="session-match"
              value={form.matchId}
              onChange={(e) => setForm({ ...form, matchId: e.target.value })}
              required
            >
              <option value="">Select a match...</option>
              {acceptedMatches.map((m) => (
                <option key={m._id} value={m._id}>
                  {partnerName(m)} — {m.offeredSkillName} ↔ {m.requestedSkillName}
                </option>
              ))}
            </select>

            <label htmlFor="session-time">Date & time</label>
            <input
              id="session-time"
              type="datetime-local"
              value={form.scheduledAt}
              onChange={(e) => setForm({ ...form, scheduledAt: e.target.value })}
              required
            />

            <label htmlFor="session-duration">Duration (minutes)</label>
            <input
              id="session-duration"
              type="number"
              min="15"
              step="15"
              value={form.durationMinutes}
              onChange={(e) => setForm({ ...form, durationMinutes: Number(e.target.value) })}
            />

            <label htmlFor="session-link">Meeting link (optional)</label>
            <input
              id="session-link"
              type="url"
              placeholder="https://meet.google.com/..."
              value={form.meetingLink}
              onChange={(e) => setForm({ ...form, meetingLink: e.target.value })}
            />

            <button type="submit">Schedule session</button>
          </form>
        )}
      </div>

      <h3>My sessions</h3>
      {sessions.length === 0 && <p className="empty-state">No sessions scheduled yet.</p>}
      {sessions.map((s) => (
        <div className="card" key={s._id}>
          <p><strong>{partnerName(s.match)}</strong> · status: {s.status}</p>
          <p className="skill-row-level">
            {new Date(s.scheduledAt).toLocaleString()} · {s.durationMinutes} min
          </p>
          <p className="field-hint" style={{ fontFamily: "var(--font-mono)" }}>
            Session ID: {s._id}
          </p>
          {s.meetingLink && (
            <p><a href={s.meetingLink} target="_blank" rel="noopener noreferrer">{s.meetingLink}</a></p>
          )}
          {s.status === "scheduled" && (
            <button className="btn-outline" onClick={() => handleComplete(s._id)}>Mark completed</button>
          )}

          {s.status === "completed" && !reviewedSessionIds.has(s._id) && (
            <div className="session-rate-block">
              <p className="skill-row-level">Rate {partnerName(s.match)}</p>
              <div className="session-stars">
                {[1, 2, 3, 4, 5].map((n) => (
                  <button
                    key={n}
                    type="button"
                    className="btn-outline"
                    style={{
                      padding: "4px 10px",
                      background: (reviewForms[s._id]?.rating || 0) >= n ? "var(--gold)" : "transparent",
                    }}
                    onClick={() => handleRatingChange(s._id, n)}
                  >
                    ★
                  </button>
                ))}
              </div>
              <textarea
                className="session-comment"
                placeholder="Optional comment..."
                value={reviewForms[s._id]?.comment || ""}
                onChange={(e) => handleCommentChange(s._id, e.target.value)}
              />
              <div className="session-rate-actions">
                <button type="button" onClick={() => handleSubmitReview(s)}>Submit rating</button>
                <button type="button" className="btn-outline" onClick={() => toggleReportForm(s._id)}>
                  🚩 Report
                </button>
              </div>

              {reportOpenIds.has(s._id) && (
                <div className="session-report-block">
                  <textarea
                    className="session-comment"
                    placeholder="Describe the issue..."
                    value={reportForms[s._id] || ""}
                    onChange={(e) => handleReportTextChange(s._id, e.target.value)}
                  />
                  <button type="button" className="btn-outline" onClick={() => handleSubmitReport(s)}>
                    Submit report
                  </button>
                </div>
              )}
              {reportedIds.has(s._id) && (
                <p className="status-message" style={{ marginTop: "4px" }}>Report submitted.</p>
              )}
            </div>
          )}
          {s.status === "completed" && reviewedSessionIds.has(s._id) && (
            <p className="status-message" style={{ marginTop: "12px" }}>Thanks for rating!</p>
          )}
        </div>
      ))}
    </div>
  );
}
