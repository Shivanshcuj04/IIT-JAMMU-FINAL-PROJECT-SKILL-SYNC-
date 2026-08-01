import { useEffect, useState } from "react";
import {
  getAdminStats,
  getAdminUsers,
  getUserReports,
  blockUser,
  unblockUser,
  verifySkill,
  getAdminSessions,
} from "../api/admin";

const TABS = [
  { id: "overview", label: "Overview" },
  { id: "users", label: "Users" },
  { id: "sessions", label: "Sessions" },
];

export default function AdminDashboard() {
  const [tab, setTab] = useState("overview");

  return (
    <div className="container">
      <h1>Admin Panel</h1>
      <p>Manage users, monitor sessions, and keep an eye on the health of SkillSync.</p>

      <div className="admin-tabs">
        {TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            className={`admin-tab ${tab === t.id ? "active" : ""}`}
            onClick={() => setTab(t.id)}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === "overview" && <OverviewTab />}
      {tab === "users" && <UsersTab />}
      {tab === "sessions" && <SessionsTab />}
    </div>
  );
}

/* ---------------------------------- Overview ---------------------------------- */

function OverviewTab() {
  const [stats, setStats] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAdminStats()
      .then((data) => setStats(data))
      .catch(() => setError("Could not load analytics."))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Loading stats…</p>;
  if (error) return <p className="chat-error">{error}</p>;
  if (!stats) return null;

  const { overview, topSkills, userGrowth } = stats;
  const maxGrowth = Math.max(1, ...userGrowth.map((g) => g.count));
  const maxSkill = Math.max(1, ...topSkills.map((s) => s.count));

  return (
    <>
      <h2 className="profile-section-title">System health</h2>
      <div className="stats-grid">
        <StatCard number={overview.totalUsers} label="Total users" />
        <StatCard number={overview.blockedUsers} label="Blocked users" />
        <StatCard number={overview.totalMatches} label="Matches made" />
        <StatCard number={overview.pendingMatches} label="Pending matches" />
        <StatCard number={overview.totalSessions} label="Total sessions" />
        <StatCard number={overview.scheduledSessions} label="Upcoming sessions" />
        <StatCard number={overview.completedSessions} label="Completed sessions" />
        <StatCard number={overview.pendingReportsCount} label="Reports filed" />
      </div>

      <h2 className="profile-section-title">User growth (last 6 months)</h2>
      <div className="card growth-chart">
        {userGrowth.map((g) => (
          <div className="growth-bar-row" key={g.label}>
            <span className="growth-bar-label">{g.label}</span>
            <div className="growth-bar-track">
              <div
                className="growth-bar-fill"
                style={{ width: `${(g.count / maxGrowth) * 100}%` }}
              />
            </div>
            <span className="growth-bar-count">{g.count}</span>
          </div>
        ))}
      </div>

      <h2 className="profile-section-title">Top skills</h2>
      <div className="card growth-chart">
        {topSkills.length === 0 && <p className="empty-hint">No skills added yet.</p>}
        {topSkills.map((s) => (
          <div className="growth-bar-row" key={`${s.name}-${s.type}`}>
            <span className="growth-bar-label">
              {s.name}{" "}
              <span className={`type-badge ${s.type === "teach" ? "type-teach" : "type-learn"}`}>
                {s.type}
              </span>
            </span>
            <div className="growth-bar-track">
              <div
                className="growth-bar-fill growth-bar-fill-teal"
                style={{ width: `${(s.count / maxSkill) * 100}%` }}
              />
            </div>
            <span className="growth-bar-count">{s.count}</span>
          </div>
        ))}
      </div>
    </>
  );
}

function StatCard({ number, label }) {
  return (
    <div className="stat-card">
      <span className="stat-number">{number}</span>
      <span className="stat-label">{label}</span>
    </div>
  );
}

/* ------------------------------------ Users ------------------------------------ */

function UsersTab() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [expandedId, setExpandedId] = useState(null);
  const [reports, setReports] = useState({});
  const [actionError, setActionError] = useState("");

  const loadUsers = () => {
    setLoading(true);
    getAdminUsers({ search: search || undefined, status: status || undefined })
      .then((data) => setUsers(data.users))
      .catch(() => setError("Could not load users."))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    const timeout = setTimeout(loadUsers, 300); // debounce search typing
    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, status]);

  const toggleExpand = async (userId) => {
    if (expandedId === userId) {
      setExpandedId(null);
      return;
    }
    setExpandedId(userId);
    if (!reports[userId]) {
      try {
        const data = await getUserReports(userId);
        setReports((prev) => ({ ...prev, [userId]: data.reports }));
      } catch {
        setReports((prev) => ({ ...prev, [userId]: [] }));
      }
    }
  };

  const handleBlockToggle = async (user) => {
    setActionError("");
    try {
      if (user.isBlocked) {
        await unblockUser(user._id);
      } else {
        await blockUser(user._id);
      }
      loadUsers();
    } catch (err) {
      setActionError(err.response?.data?.message || "Action failed.");
    }
  };

  const handleVerifySkill = async (userId, skillId) => {
    try {
      const data = await verifySkill(userId, skillId);
      setUsers((prev) =>
        prev.map((u) => (u._id === userId ? { ...u, skills: data.skills } : u))
      );
    } catch {
      setActionError("Could not update skill verification.");
    }
  };

  return (
    <>
      <div className="add-skill-row" style={{ marginBottom: 20 }}>
        <input
          type="text"
          placeholder="Search by name or email…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="">All users</option>
          <option value="active">Active only</option>
          <option value="blocked">Blocked only</option>
        </select>
      </div>

      {actionError && <p className="chat-error">{actionError}</p>}
      {loading && <p>Loading users…</p>}
      {error && <p className="chat-error">{error}</p>}
      {!loading && !error && users.length === 0 && (
        <p className="empty-state">No users match that search.</p>
      )}

      <div className="skill-group-list">
        {users.map((user) => (
          <div className="skill-group" key={user._id}>
            <button
              type="button"
              className="skill-group-header"
              onClick={() => toggleExpand(user._id)}
            >
              <span>
                {user.name} <span className="skill-row-level">({user.email})</span>
              </span>
              <span>
                {user.isBlocked && <span className="badge" style={{ background: "rgba(200,70,60,0.14)", color: "#a53a30" }}>Blocked</span>}
                {user.reportCount > 0 && (
                  <span className="badge badge-offer">{user.reportCount} report{user.reportCount === 1 ? "" : "s"}</span>
                )}
                {user.role === "admin" && <span className="badge badge-seek">Admin</span>}
              </span>
            </button>

            {expandedId === user._id && (
              <div className="skill-group-body">
                <div className="skill-row">
                  <span className="skill-row-level">
                    {user.completedSessionsCount} sessions completed · avg rating{" "}
                    {user.averageRating?.toFixed ? user.averageRating.toFixed(1) : user.averageRating}
                  </span>
                  {user.role !== "admin" && (
                    <button
                      type="button"
                      className={user.isBlocked ? "" : "btn-outline"}
                      onClick={() => handleBlockToggle(user)}
                    >
                      {user.isBlocked ? "Unblock user" : "Block user"}
                    </button>
                  )}
                </div>

                {user.skills?.length > 0 && (
                  <>
                    <p className="skill-row-level" style={{ marginTop: 8 }}>Skills</p>
                    {user.skills.map((skill) => (
                      <div className="skill-row" key={skill._id}>
                        <span className="skill-row-info">
                          <span className="skill-row-name">{skill.name}</span>
                          <span className={`type-badge ${skill.type === "teach" ? "type-teach" : "type-learn"}`}>
                            {skill.type}
                          </span>
                          {skill.verified && <span className="badge badge-seek">Verified</span>}
                        </span>
                        <button
                          type="button"
                          className="btn-outline"
                          onClick={() => handleVerifySkill(user._id, skill._id)}
                        >
                          {skill.verified ? "Unverify" : "Verify"}
                        </button>
                      </div>
                    ))}
                  </>
                )}

                <p className="skill-row-level" style={{ marginTop: 8 }}>Reports against this user</p>
                {!reports[user._id] && <p className="empty-hint">Loading…</p>}
                {reports[user._id]?.length === 0 && <p className="empty-hint">No reports filed.</p>}
                {reports[user._id]?.map((report) => (
                  <div className="card" key={report._id} style={{ marginBottom: 8 }}>
                    <p style={{ margin: 0, fontSize: "0.9rem" }}>{report.reason}</p>
                    <span className="chat-time">
                      Filed by {report.reporter?.name || "unknown"} ·{" "}
                      {new Date(report.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </>
  );
}

/* ----------------------------------- Sessions ----------------------------------- */

function SessionsTab() {
  const [sessions, setSessions] = useState([]);
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    setLoading(true);
    getAdminSessions({ status: status || undefined })
      .then((data) => setSessions(data.sessions))
      .catch(() => setError("Could not load sessions."))
      .finally(() => setLoading(false));
  }, [status]);

  return (
    <>
      <div className="add-skill-row" style={{ marginBottom: 20 }}>
        <select value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="">All sessions</option>
          <option value="scheduled">Scheduled</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      {loading && <p>Loading sessions…</p>}
      {error && <p className="chat-error">{error}</p>}
      {!loading && !error && sessions.length === 0 && (
        <p className="empty-state">No sessions found.</p>
      )}

      <div className="match-grid">
        {sessions.map((s) => (
          <div className="card" key={s._id}>
            <h3 style={{ marginBottom: 4 }}>
              {s.match?.offeredSkillName} ⇄ {s.match?.requestedSkillName}
            </h3>
            <p style={{ margin: "0 0 8px", color: "var(--muted)", fontSize: "0.88rem" }}>
              {s.participants?.map((p) => p.name).join(" & ")}
            </p>
            <span className={`type-badge ${
              s.status === "completed" ? "type-teach" : s.status === "cancelled" ? "" : "type-learn"
            }`}>
              {s.status}
            </span>
            <p className="chat-time" style={{ marginTop: 8 }}>
              {new Date(s.scheduledAt).toLocaleString()}
            </p>
          </div>
        ))}
      </div>
    </>
  );
}
