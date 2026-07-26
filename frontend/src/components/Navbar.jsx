import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="navbar">
      <div>
        <Link to="/"><strong>SkillSync</strong></Link>
        {user && (
          <>
            <Link to="/explore">Explore</Link>
            <Link to="/matches">My Matches</Link>
            <Link to="/profile">Profile</Link>
          </>
        )}
      </div>
      <div>
        {user ? (
          <button onClick={handleLogout}>Logout</button>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}
      </div>
    </div>
  );
}
