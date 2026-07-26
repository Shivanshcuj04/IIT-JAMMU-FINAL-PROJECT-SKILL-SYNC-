import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Register() {
  const [form, setForm] = useState({ name: "", email: "", password: "", city: "", timezone: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { register, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) navigate("/profile");
  }, [user, navigate]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await register(form);
      navigate("/profile");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <p className="auth-eyebrow">Join the swap</p>
        <h2 className="auth-title">Create your account</h2>

        <form onSubmit={handleSubmit}>
          <label className="auth-label" htmlFor="name">Full name</label>
          <input id="name" name="name" placeholder="Your name" value={form.name} onChange={handleChange} required />

          <label className="auth-label" htmlFor="email">Email</label>
          <input id="email" name="email" type="email" placeholder="you@example.com" value={form.email} onChange={handleChange} required />

          <label className="auth-label" htmlFor="password">Password</label>
          <div className="auth-password-row">
            <input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              placeholder="At least 6 characters"
              value={form.password}
              onChange={handleChange}
              required
              minLength={6}
            />
            <button
              type="button"
              className="auth-toggle-btn"
              onClick={() => setShowPassword((s) => !s)}
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>

          <label className="auth-label" htmlFor="city">City</label>
          <input id="city" name="city" placeholder="e.g. Jammu" value={form.city} onChange={handleChange} />

          <label className="auth-label" htmlFor="timezone">Timezone</label>
          <input id="timezone" name="timezone" placeholder="e.g. IST" value={form.timezone} onChange={handleChange} />

          {error && <p className="auth-error">{error}</p>}

          <button type="submit" className="auth-submit" disabled={loading}>
            {loading ? "Creating account…" : "Create account"}
          </button>
        </form>

        <p className="auth-switch">
          Already have an account? <Link to="/login">Log in</Link>
        </p>
      </div>
    </div>
  );
}