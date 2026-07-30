import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import AvatarMenu from "./AvatarMenu";

export default function Navbar({ onToggleSidebar }) {
  const { user } = useAuth();

  return (
    <div className="topbar">
      <div className="topbar-left">
        {user && (
          <button
            type="button"
            className="sidebar-toggle"
            onClick={onToggleSidebar}
            aria-label="Toggle menu"
          >
            ☰
          </button>
        )}
        <Link to="/" className="topbar-brand">
          <span className="topbar-brand-mark">⇄</span>
          <span className="topbar-brand-text">
            <strong>SkillSync</strong>
            <span className="topbar-tagline">Teach ⇄ Learn</span>
          </span>
        </Link>
      </div>

      <div className="topbar-actions">
        {user ? (
          <AvatarMenu />
        ) : (
          <>
            <Link to="/login" className="topbar-link">Login</Link>
            <Link to="/register" className="topbar-link topbar-link-primary">Register</Link>
          </>
        )}
      </div>
    </div>
  );
}
