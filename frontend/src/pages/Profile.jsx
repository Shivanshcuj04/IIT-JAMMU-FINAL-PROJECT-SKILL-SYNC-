import { useEffect, useState } from "react";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";

export default function Profile() {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [skillForm, setSkillForm] = useState({ name: "", category: "Tech", level: "Beginner", type: "teach" });

  useEffect(() => {
    if (user) api.get(`/users/${user.id}`).then((res) => setProfile(res.data.user));
  }, [user]);

  const handleAddSkill = async (e) => {
    e.preventDefault();
    const { data } = await api.post("/users/me/skills", skillForm);
    setProfile((p) => ({ ...p, skills: data.skills }));
    setSkillForm({ ...skillForm, name: "" });
  };

  const handleRemoveSkill = async (skillId) => {
    const { data } = await api.delete(`/users/me/skills/${skillId}`);
    setProfile((p) => ({ ...p, skills: data.skills }));
  };

  if (!profile) return <div className="container">Loading...</div>;

  return (
    <div className="container">
      <h2>{profile.name}'s Profile</h2>
      <p>{profile.city} {profile.timezone && `· ${profile.timezone}`}</p>

      <h3>Skills</h3>
      {profile.skills.length === 0 && <p>No skills added yet.</p>}
      {profile.skills.map((s) => (
        <div className="card" key={s._id}>
          <strong>{s.name}</strong> — {s.level} — {s.type === "teach" ? "Can teach" : "Wants to learn"} ({s.category})
          <button style={{ marginLeft: 10 }} onClick={() => handleRemoveSkill(s._id)}>Remove</button>
        </div>
      ))}

      <h3>Add a skill</h3>
      <form onSubmit={handleAddSkill}>
        <input placeholder="Skill name (e.g. Python)" value={skillForm.name}
          onChange={(e) => setSkillForm({ ...skillForm, name: e.target.value })} required />
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
        <button type="submit">Add Skill</button>
      </form>
    </div>
  );
}
