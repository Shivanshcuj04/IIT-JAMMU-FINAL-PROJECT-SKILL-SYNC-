import { useEffect, useState } from "react";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";

const GROUPS = [
  { type: "teach", title: "Want to Teach", badgeClass: "badge-offer" },
  { type: "learn", title: "Want to Learn", badgeClass: "badge-seek" },
];

const emptyForm = { name: "", category: "Tech", level: "Beginner" };

export default function Profile() {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [teachForm, setTeachForm] = useState(emptyForm);
  const [learnForm, setLearnForm] = useState(emptyForm);
  // Both groups start open — click a header to collapse/expand independently.
  const [openGroups, setOpenGroups] = useState(new Set(["teach", "learn"]));

  useEffect(() => {
    if (user) api.get(`/users/${user.id}`).then((res) => setProfile(res.data.user));
  }, [user]);

  const toggleGroup = (type) => {
    setOpenGroups((prev) => {
      const next = new Set(prev);
      next.has(type) ? next.delete(type) : next.add(type);
      return next;
    });
  };

  const addSkill = async (form, type, setForm) => {
    const { data } = await api.post("/users/me/skills", { ...form, type });
    setProfile((p) => ({ ...p, skills: data.skills }));
    setForm({ ...form, name: "" });
  };

  const handleAddTeach = (e) => {
    e.preventDefault();
    addSkill(teachForm, "teach", setTeachForm);
  };

  const handleAddLearn = (e) => {
    e.preventDefault();
    addSkill(learnForm, "learn", setLearnForm);
  };

  const handleRemoveSkill = async (skillId) => {
    const { data } = await api.delete(`/users/me/skills/${skillId}`);
    setProfile((p) => ({ ...p, skills: data.skills }));
  };

  if (!profile) return <div className="container">Loading...</div>;

  const initials = profile.name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  const teachCount = profile.skills.filter((s) => s.type === "teach").length;
  const learnCount = profile.skills.filter((s) => s.type === "learn").length;

  return (
    <div className="container">
      {/* ---- Halved banner ---- */}
      <div className="profile-header profile-header-split">
        <div className="profile-header-half profile-header-left">
          <div className="profile-avatar">{initials}</div>
          <div>
            <h2 className="profile-name">{profile.name}</h2>
            <p className="profile-meta">
              {profile.city || "No city set"}
              {profile.timezone && ` · ${profile.timezone}`}
            </p>
          </div>
        </div>

        <div className="profile-header-divider" />

        <div className="profile-header-half profile-header-right">
          <div className="profile-badges">
            <span className="profile-rating">{teachCount} teaching</span>
            <span className="profile-badge-pill">{learnCount} learning</span>
          </div>
        </div>
      </div>

      <h3>Skills</h3>
      <div className="skill-group-list">
        {GROUPS.map(({ type, title, badgeClass }) => {
          const groupSkills = profile.skills.filter((s) => s.type === type);
          const isOpen = openGroups.has(type);

          return (
            <div key={type} className="skill-group">
              <button
                type="button"
                className="skill-group-header"
                aria-expanded={isOpen}
                onClick={() => toggleGroup(type)}
              >
                <span>
                  {title} <span className={`badge ${badgeClass}`}>{groupSkills.length}</span>
                </span>
                <span className="faq-caret" aria-hidden="true">{isOpen ? "−" : "+"}</span>
              </button>

              <div className="skill-group-body" hidden={!isOpen}>
                {groupSkills.length === 0 && <p className="empty-state">No skills here yet.</p>}
                {groupSkills.map((s) => (
                  <div className="card skill-row" key={s._id}>
                    <div>
                      <strong>{s.name}</strong> — {s.level} ({s.category})
                    </div>
                    <button className="btn-outline" onClick={() => handleRemoveSkill(s._id)}>
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      <h3>Add a skill</h3>

      {/* ---- Two separate forms, side by side ---- */}
      <div className="add-skill-columns">
        <div className="add-skill-card">
          <h3 className="profile-section-title">Skills you can teach</h3>
          <form onSubmit={handleAddTeach}>
            <div className="add-skill-row">
              <input
                placeholder="Skill name (e.g. Python)"
                value={teachForm.name}
                onChange={(e) => setTeachForm({ ...teachForm, name: e.target.value })}
                required
              />
              <select value={teachForm.category} onChange={(e) => setTeachForm({ ...teachForm, category: e.target.value })}>
                <option>Tech</option><option>Music</option><option>Art</option><option>Language</option><option>General</option>
              </select>
              <select value={teachForm.level} onChange={(e) => setTeachForm({ ...teachForm, level: e.target.value })}>
                <option>Beginner</option><option>Intermediate</option><option>Advanced</option><option>Expert</option>
              </select>
              <button type="submit">Add Skill</button>
            </div>
          </form>
        </div>

        <div className="add-skill-card">
          <h3 className="profile-section-title">Skills you want to learn</h3>
          <form onSubmit={handleAddLearn}>
            <div className="add-skill-row">
              <input
                placeholder="Skill name (e.g. Python)"
                value={learnForm.name}
                onChange={(e) => setLearnForm({ ...learnForm, name: e.target.value })}
                required
              />
              <select value={learnForm.category} onChange={(e) => setLearnForm({ ...learnForm, category: e.target.value })}>
                <option>Tech</option><option>Music</option><option>Art</option><option>Language</option><option>General</option>
              </select>
              <select value={learnForm.level} onChange={(e) => setLearnForm({ ...learnForm, level: e.target.value })}>
                <option>Beginner</option><option>Intermediate</option><option>Advanced</option><option>Expert</option>
              </select>
              <button type="submit">Add Skill</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
