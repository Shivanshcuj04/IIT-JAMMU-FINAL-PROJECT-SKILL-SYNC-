import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import AvatarMenu from "./AvatarMenu";

export default function Navbar({ onToggleSidebar }) {
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className={`topbar ${scrolled ? "topbar-scrolled" : ""}`}>
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
        <Link to={user ? "/profile" : "/"} className="topbar-brand">
          <span className="topbar-brand-mark">⇄</span>
          <span className="topbar-brand-text">
            <strong>SkillSync</strong>
            <span className="topbar-tagline">Teach ⇄ Learn</span>
          </span>
        </Link>
      </div>
      <div className="topbar-actions">
        <button
          type="button"
          className="theme-toggle"
          onClick={toggleTheme}
          aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
          title={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
        >
          {theme === "dark" ? "☀️" : "🌙"}
        </button>
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