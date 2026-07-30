import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import PasswordField from "../components/PasswordField";
import { getPasswordStrength } from "../utils/passwordStrength";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function Register() {
  const [form, setForm] = useState({ name: "", email: "", password: "", city: "", timezone: "" });
  const [emailTouched, setEmailTouched] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const emailIsValid = EMAIL_PATTERN.test(form.email);
  const strength = getPasswordStrength(form.password);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await register(form);
      navigate("/profile");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-visual" aria-hidden="true">
        <div className="swap-demo">
          <div className="card">
            <h3>Photography</h3>
            <span className="badge badge-offer">Teach</span>
          </div>
          <span className="swap-arrow">⇄</span>
          <div className="card">
            <h3>Cooking</h3>
            <span className="badge badge-seek">Learn</span>
          </div>
        </div>
        <p className="auth-visual-caption">Pin what you know. Find what you want to learn.</p>
      </div>

      <div className="auth-form-wrap">
        <div className="auth-card">
          <h2>Create your SkillSync account</h2>
          <p className="auth-subtitle">Takes less than a minute.</p>

          <form onSubmit={handleSubmit} noValidate>
            <label htmlFor="reg-name">Full name</label>
            <input id="reg-name" name="name" value={form.name} onChange={handleChange} required />

            <label htmlFor="reg-email">Email</label>
            <input
              id="reg-email"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              onBlur={() => setEmailTouched(true)}
              className={emailTouched ? (emailIsValid ? "field-valid" : "field-invalid") : ""}
              required
            />
            {emailTouched && !emailIsValid && (
              <p className="field-hint field-hint-error">Enter a valid email address</p>
            )}

            <label htmlFor="reg-password">Password</label>
            <PasswordField
              id="reg-password"
              name="password"
              value={form.password}
              onChange={handleChange}
              required
            />
            {form.password && (
              <div className="strength-meter" aria-hidden="true">
                <div className={`strength-bar strength-${strength.score}`} />
                <span className="strength-label">{strength.label}</span>
              </div>
            )}

            <label htmlFor="reg-city">City</label>
            <input id="reg-city" name="city" value={form.city} onChange={handleChange} />

            <label htmlFor="reg-timezone">Timezone (e.g. IST)</label>
            <input id="reg-timezone" name="timezone" value={form.timezone} onChange={handleChange} />

            {error && <p className="status-message status-error">{error}</p>}

            <button type="submit" disabled={submitting}>
              {submitting ? <span className="btn-spinner" aria-hidden="true" /> : "Register"}
            </button>
          </form>

          <p className="auth-switch">
            Already have an account? <Link to="/login">Login</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
