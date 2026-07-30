import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import PasswordField from "../components/PasswordField";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailTouched, setEmailTouched] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const emailIsValid = EMAIL_PATTERN.test(email);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await login(email, password);
      navigate("/explore");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-visual" aria-hidden="true">
        <div className="swap-demo">
          <div className="card">
            <h3>Guitar</h3>
            <span className="badge badge-offer">Teach</span>
          </div>
          <span className="swap-arrow">⇄</span>
          <div className="card">
            <h3>Spanish</h3>
            <span className="badge badge-seek">Learn</span>
          </div>
        </div>
        <p className="auth-visual-caption">Every login is a step back onto the board.</p>
      </div>

      <div className="auth-form-wrap">
        <div className="auth-card">
          <h2>Welcome back</h2>
          <p className="auth-subtitle">Log in to see your matches.</p>

          <form onSubmit={handleSubmit} noValidate>
            <label htmlFor="login-email">Email</label>
            <input
              id="login-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onBlur={() => setEmailTouched(true)}
              className={emailTouched ? (emailIsValid ? "field-valid" : "field-invalid") : ""}
              required
            />
            {emailTouched && !emailIsValid && (
              <p className="field-hint field-hint-error">Enter a valid email address</p>
            )}

            <label htmlFor="login-password">Password</label>
            <PasswordField
              id="login-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            {error && <p className="status-message status-error">{error}</p>}

            <button type="submit" disabled={submitting}>
              {submitting ? <span className="btn-spinner" aria-hidden="true" /> : "Login"}
            </button>
          </form>

          <p className="auth-switch">
            No account? <Link to="/register">Register</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
