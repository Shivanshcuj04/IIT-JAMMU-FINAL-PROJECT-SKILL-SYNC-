import { NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const LINKS = [
  { to: "/explore", label: "Explore" },
  { to: "/matches", label: "My Matches" },
  { to: "/sessions", label: "Sessions" },
  { to: "/dashboard", label: "Dashboard" },
  { to: "/support", label: "Support" },
];

export default function Sidebar({ open, onNavigate }) {
  const { user } = useAuth();

  const links =
    user?.role === "admin"
      ? [...LINKS, { to: "/admin", label: "Admin Panel" }]
      : LINKS;

  return (
    <nav className={`sidebar ${open ? "sidebar-open" : ""}`} aria-label="Main navigation">
      {links.map((link) => (
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
