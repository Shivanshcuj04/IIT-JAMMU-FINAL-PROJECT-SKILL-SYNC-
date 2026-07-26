import { useEffect, useState } from "react";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";

export default function Profile() {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [skillForm, setSkillForm] = useState({ name: "", category: "Tech", level: "Beginner", type: "teach" });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (user) api.get(`/users/${user.id}`).then((res) => setProfile(res.data.user));
  }, [user]);

  const handleAddSkill = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const { data } = await api.post("/users/me/skills", skillForm);
      setProfile((p) => ({ ...p, skills: data.skills }));
      setSkillForm({ ...skillForm, name: "" });
    } finally {
      setSaving(false);
    }
  };

  const handleRemoveSkill = async (skillId) => {
    const { data } = await api.delete(`/users/me/skills/${skillId}`);
    setProfile((p) => ({ ...p, skills: data.skills }));
  };

  if (!profile) return <div className="container">Loading…</div>;

  const initials = profile.name.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase();

  return (
    <>
      <div className="profile-header">
        <div className="profile-avatar">{initials}</div>
        <div>
          <h2 className="profile-name">{profile.name}</h2>
          <p className="profile-meta">
            {profile.city || "No city set"}{profile.timezone && ` · ${profile.timezone}`}
          </p>
          <div className="profile-badges">
            {profile.averageRating > 0 && (
              <span className="profile-rating">⭐ {profile.averageRating} ({profile.reviewCount})</span>
            )}
            {profile.badges?.map((b) => (
              <span key={b} className="profile-badge-pill">{b}</span>
            ))}
          </div>
        </div>
      </div>

      <h3 className="profile-section-title">Your skills</h3>
      {profile.skills.length === 0 && <p className="empty-hint">No skills added yet — add your first one below.</p>}

      {profile.skills.map((s) => (
        <div className="skill-row" key={s._id}>
          <div className="skill-row-info">
            <span className={`cat-badge cat-${s.category.toLowerCase()}`}>{s.category}</span>
            <span className="skill-row-name">{s.name}</span>
            <span className="skill-row-level">{s.level}</span>
            <span className={s.type === "teach" ? "type-badge type-teach" : "type-badge type-learn"}>
              {s.type === "teach" ? "Can teach" : "Wants to learn"}
            </span>
          </div>
          <button className="skill-remove-btn" onClick={() => handleRemoveSkill(s._id)}>Remove</button>
        </div>
      ))}

      <div className="add-skill-card">
        <h3 className="profile-section-title">Add a skill</h3>
        <form onSubmit={handleAddSkill}>
          <div className="add-skill-row">
            <input
              placeholder="Skill name (e.g. Python)"
              value={skillForm.name}
              onChange={(e) => setSkillForm({ ...skillForm, name: e.target.value })}
              required
            />
            <select value={skillForm.category} onChange={(e) => setSkillForm({ ...skillForm, category: e.target.value })}>
              <option>Tech</option><option>Music</option><option>Art</option><option>Language</option><option>General</option>
            </select>
            <select value={skillForm.level} onChange={(e) => setSkillForm({ ...skillForm, level: e.target.value })}>
              <option>Beginner</option><option>Intermediate</option><option>Advanced</option><option>Expert</option>
            </select>
            <select value={skillForm.type} onChange={(e) => setSkillForm({ ...skillForm, type: e.target.value })}>
              <option value="teach">I can teach this</option>
              <option value="learn">I want to learn this</option>
            </select>
            <button type="submit" disabled={saving}>{saving ? "Adding…" : "Add skill"}</button>
          </div>
        </form>
      </div>
    </>
  );
}