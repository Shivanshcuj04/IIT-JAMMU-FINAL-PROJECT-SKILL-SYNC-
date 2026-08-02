import { NavLink, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";

const LINKS = [
  { to: "/explore", label: "Explore" },
  { to: "/matches", label: "My Matches" },
  { to: "/sessions", label: "Sessions" },
  { to: "/dashboard", label: "Dashboard" },
  { to: "/support", label: "Support" },
];

export default function Sidebar({ open, onNavigate }) {
  const location = useLocation();
  const { user } = useAuth();

  const links =
    user?.role === "admin"
      ? [...LINKS, { to: "/admin", label: "Admin Panel" }]
      : LINKS;

  return (
    <nav className={`sidebar ${open ? "sidebar-open" : ""}`} aria-label="Main navigation">
      {links.map((link) => {
        const isActive = location.pathname === link.to;
        return (
          <NavLink
            key={link.to}
            to={link.to}
            className={`sidebar-link ${isActive ? "active" : ""}`}
            onClick={onNavigate}
          >
            {isActive && (
              <motion.span
                layoutId="sidebar-active-pill"
                className="sidebar-active-pill"
                transition={{ type: "spring", stiffness: 400, damping: 32 }}
              />
            )}
            <span className="sidebar-link-dot" aria-hidden="true" />
            <span className="sidebar-link-label">{link.label}</span>
          </NavLink>
        );
      })}
    </nav>
  );
}
