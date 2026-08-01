import { useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import Explore from "./pages/Explore";
import MatchRequests from "./pages/MatchRequests";
import Dashboard from "./pages/Dashboard";
import Support from "./pages/Support";
import Chat from "./pages/Chat";
import FloatingSupportButton from "./components/FloatingSupportButton";
import { useAuth } from "./context/AuthContext";
import Sessions from "./pages/Sessions";
import AdminDashboard from "./pages/AdminDashboard";

function PrivateRoute({ children }) {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" />;
}

function AdminRoute({ children }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" />;
  return user.role === "admin" ? children : <Navigate to="/dashboard" />;
}

export default function App() {
  const { user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <>
      <Navbar onToggleSidebar={() => setSidebarOpen((o) => !o)} />

      {user && <Sidebar open={sidebarOpen} onNavigate={() => setSidebarOpen(false)} />}
      {user && sidebarOpen && (
        <div className="sidebar-backdrop" onClick={() => setSidebarOpen(false)} />
      )}

      <main className={user ? "app-main-with-sidebar" : ""}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
          <Route path="/explore" element={<PrivateRoute><Explore /></PrivateRoute>} />
          <Route path="/matches" element={<PrivateRoute><MatchRequests /></PrivateRoute>} />
          <Route path="/chat/:matchId" element={<PrivateRoute><Chat /></PrivateRoute>} />
          <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
          <Route path="/support" element={<Support />} />
          <Route path="/sessions" element={<PrivateRoute><Sessions /></PrivateRoute>} />
          <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
        </Routes>
      </main>

      <FloatingSupportButton />
    </>
  );
}
