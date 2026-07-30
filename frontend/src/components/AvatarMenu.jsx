import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function AvatarMenu() {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);
  const navigate = useNavigate();

  // Close the dropdown on any click outside it.
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    setOpen(false);
    navigate("/login");
  };

  const initial = user?.name ? user.name.charAt(0).toUpperCase() : "U";

  return (
    <div className="avatar-menu" ref={menuRef}>
      <button
        type="button"
        className="avatar-badge"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-label="Account menu"
      >
        {user?.avatarUrl ? <img src={user.avatarUrl} alt={user.name} /> : initial}
      </button>

      {open && (
        <div className="avatar-dropdown" role="menu">
          <Link to="/profile" className="avatar-dropdown-item" onClick={() => setOpen(false)}>
            My Profile
          </Link>
          <Link to="/dashboard" className="avatar-dropdown-item" onClick={() => setOpen(false)}>
            Dashboard
          </Link>
          <Link to="/support" className="avatar-dropdown-item" onClick={() => setOpen(false)}>
            Support
          </Link>
          <div className="avatar-dropdown-divider" />
          <button type="button" className="avatar-dropdown-item logout" onClick={handleLogout}>
            Logout
          </button>
        </div>
      )}
    </div>
  );
}
