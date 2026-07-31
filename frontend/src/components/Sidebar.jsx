import { NavLink } from "react-router-dom";

const LINKS = [
  { to: "/explore", label: "Explore" },
  { to: "/matches", label: "My Matches" },
  { to: "/sessions", label: "Sessions" },
  { to: "/dashboard", label: "Dashboard" },
  { to: "/support", label: "Support" },
];

export default function Sidebar({ open, onNavigate }) {
  return (
    <nav className={`sidebar ${open ? "sidebar-open" : ""}`} aria-label="Main navigation">
      {LINKS.map((link) => (
        <NavLink
          key={link.to}
          to={link.to}
          className={({ isActive }) => `sidebar-link ${isActive ? "active" : ""}`}
          onClick={onNavigate}
        >
          <span className="sidebar-link-dot" aria-hidden="true" />
          {link.label}
        </NavLink>
      ))}
    </nav>
  );
}
