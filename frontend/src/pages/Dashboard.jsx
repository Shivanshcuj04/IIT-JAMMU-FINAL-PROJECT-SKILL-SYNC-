import { useEffect, useState } from "react";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";

// Mirrors the thresholds in the backend's User.refreshBadges() so the
// progress bars shown here always match when a badge actually unlocks.
const SESSIONS_FOR_VERIFIED_TEACHER = 5;
const SESSIONS_FOR_MASTER_TEACHER = 20;
const REVIEWS_FOR_PEER_RATED = 3;
const REVIEWS_FOR_TOP_RATED = 10;

export default function Dashboard() {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    if (user) api.get(`/users/${user.id}`).then((res) => setProfile(res.data.user));
  }, [user]);

  if (!profile) return <div className="container">Loading...</div>;

  const teachSkills = profile.skills.filter((s) => s.type === "teach");
  const learnSkills = profile.skills.filter((s) => s.type === "learn");

  const memberSince = new Date(profile.createdAt).toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
  });

  const sessionsProgress = Math.min(
    100,
    Math.round((profile.completedSessionsCount / SESSIONS_FOR_VERIFIED_TEACHER) * 100)
  );
  const hasVerifiedTeacher = profile.badges?.includes("Verified Teacher");

  const masterProgress = Math.min(
    100,
    Math.round((profile.completedSessionsCount / SESSIONS_FOR_MASTER_TEACHER) * 100)
  );
  const hasMasterTeacher = profile.badges?.includes("Master Teacher");

  const reviewsProgress = Math.min(
    100,
    Math.round((profile.reviewCount / REVIEWS_FOR_PEER_RATED) * 100)
  );
  const hasPeerRated = profile.badges?.includes("Peer Rated");

  const topRatedProgress = Math.min(
    100,
    Math.round((profile.reviewCount / REVIEWS_FOR_TOP_RATED) * 100)
  );
  const hasTopRated = profile.badges?.includes("Top Rated");

  return (
    <div className="container">
      <h1>Your progress</h1>
      <p>Member since {memberSince}</p>

      <div className="stats-grid">
        <div className="stat-card">
          <span className="stat-number">{profile.completedSessionsCount}</span>
          <span className="stat-label">Sessions completed</span>
        </div>
        <div className="stat-card">
          <span className="stat-number">{teachSkills.length}</span>
          <span className="stat-label">Skills taught</span>
        </div>
        <div className="stat-card">
          <span className="stat-number">{learnSkills.length}</span>
          <span className="stat-label">Skills learning</span>
        </div>
        <div className="stat-card">
          <span className="stat-number">
            {profile.averageRating ? profile.averageRating.toFixed(1) : "—"}
          </span>
          <span className="stat-label">
            {profile.reviewCount} review{profile.reviewCount === 1 ? "" : "s"}
          </span>
        </div>
      </div>

      <h2>Badges</h2>
      <div className="badge-progress-list">
        <div className="badge-progress-card">
          <div className="badge-progress-header">
            <span className="badge badge-offer">Verified Teacher</span>
            {hasVerifiedTeacher && <span className="badge-earned">Earned ✓</span>}
          </div>
          <p className="badge-progress-desc">Complete 5 taught sessions.</p>
          <div className="progress-track">
            <div className="progress-fill" style={{ width: `${sessionsProgress}%` }} />
          </div>
          <p className="progress-count">
            {profile.completedSessionsCount} / {SESSIONS_FOR_VERIFIED_TEACHER} sessions
          </p>
        </div>

        <div className="badge-progress-card">
          <div className="badge-progress-header">
            <span className="badge badge-offer">Master Teacher</span>
            {hasMasterTeacher && <span className="badge-earned">Earned ✓</span>}
          </div>
          <p className="badge-progress-desc">Complete 20 taught sessions.</p>
          <div className="progress-track">
            <div className="progress-fill" style={{ width: `${masterProgress}%` }} />
          </div>
          <p className="progress-count">
            {profile.completedSessionsCount} / {SESSIONS_FOR_MASTER_TEACHER} sessions
          </p>
        </div>

        <div className="badge-progress-card">
          <div className="badge-progress-header">
            <span className="badge badge-seek">Peer Rated</span>
            {hasPeerRated && <span className="badge-earned">Earned ✓</span>}
          </div>
          <p className="badge-progress-desc">Get 3+ reviews averaging 4★ or higher.</p>
          <div className="progress-track">
            <div className="progress-fill progress-fill-teal" style={{ width: `${reviewsProgress}%` }} />
          </div>
          <p className="progress-count">
            {profile.reviewCount} / {REVIEWS_FOR_PEER_RATED} reviews
          </p>
        </div>

        <div className="badge-progress-card">
          <div className="badge-progress-header">
            <span className="badge badge-seek">Top Rated</span>
            {hasTopRated && <span className="badge-earned">Earned ✓</span>}
          </div>
          <p className="badge-progress-desc">Get 10+ reviews.</p>
          <div className="progress-track">
            <div className="progress-fill progress-fill-teal" style={{ width: `${topRatedProgress}%` }} />
          </div>
          <p className="progress-count">
            {profile.reviewCount} / {REVIEWS_FOR_TOP_RATED} reviews
          </p>
        </div>
      </div>

      <h2>Your skills</h2>
      <div className="skills-columns">
        <div>
          <h3>Teaching</h3>
          {teachSkills.length === 0 && <p className="empty-state">No skills added to teach yet.</p>}
          {teachSkills.map((s) => (
            <div className="card" key={s._id}>
              <strong>{s.name}</strong>
              <span className="badge badge-offer">{s.level}</span>
            </div>
          ))}
        </div>
        <div>
          <h3>Learning</h3>
          {learnSkills.length === 0 && <p className="empty-state">No skills added to learn yet.</p>}
          {learnSkills.map((s) => (
            <div className="card" key={s._id}>
              <strong>{s.name}</strong>
              <span className="badge badge-seek">{s.level}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
