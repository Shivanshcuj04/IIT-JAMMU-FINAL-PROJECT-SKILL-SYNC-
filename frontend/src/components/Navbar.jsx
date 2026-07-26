import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <Link to="/" className="navbar-brand">SkillSync</Link>
        {user && (
          <div className="navbar-links">
            <Link to="/explore" className={isActive("/explore") ? "navbar-link active" : "navbar-link"}>Explore</Link>
            <Link to="/matches" className={isActive("/matches") ? "navbar-link active" : "navbar-link"}>My matches</Link>
            <Link to="/sessions" className={isActive("/sessions") ? "navbar-link active" : "navbar-link"}>Sessions</Link>
            <Link to="/profile" className={isActive("/profile") ? "navbar-link active" : "navbar-link"}>Profile</Link>
          </div>
        )}
      </div>
      <div className="navbar-right">
        {user ? (
          <button className="navbar-logout" onClick={handleLogout}>Log out</button>
        ) : (
          <>
            <Link to="/login" className="navbar-link">Log in</Link>
            <Link to="/register"><button className="navbar-cta">Get started</button></Link>
          </>
        )}
      </div>
    </nav>
  );
}