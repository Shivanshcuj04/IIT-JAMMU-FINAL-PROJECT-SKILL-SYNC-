import { useState } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import Footer from "./components/Footer";
import ScrollProgress from "./components/ScrollProgress";
import PageTransition from "./components/PageTransition";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import Explore from "./pages/Explore";
import MatchRequests from "./pages/MatchRequests";
import Dashboard from "./pages/Dashboard";
import Support from "./pages/Support";
import Chat from "./pages/Chat";
import Sessions from "./pages/Sessions";
import FloatingSupportButton from "./components/FloatingSupportButton";
import { useAuth } from "./context/AuthContext";

function PrivateRoute({ children }) {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" />;
}

export default function App() {
  const { user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  return (
    <>
      <ScrollProgress />
      <Navbar onToggleSidebar={() => setSidebarOpen((o) => !o)} />

      {user && <Sidebar open={sidebarOpen} onNavigate={() => setSidebarOpen(false)} />}
      {user && sidebarOpen && (
        <div className="sidebar-backdrop" onClick={() => setSidebarOpen(false)} />
      )}

      <main className={user ? "app-main-with-sidebar" : ""}>
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<PageTransition><Home /></PageTransition>} />
            <Route path="/login" element={<PageTransition><Login /></PageTransition>} />
            <Route path="/register" element={<PageTransition><Register /></PageTransition>} />
            <Route path="/profile" element={<PrivateRoute><PageTransition><Profile /></PageTransition></PrivateRoute>} />
            <Route path="/explore" element={<PrivateRoute><PageTransition><Explore /></PageTransition></PrivateRoute>} />
            <Route path="/matches" element={<PrivateRoute><PageTransition><MatchRequests /></PageTransition></PrivateRoute>} />
            <Route path="/chat/:matchId" element={<PrivateRoute><PageTransition><Chat /></PageTransition></PrivateRoute>} />
            <Route path="/sessions" element={<PrivateRoute><PageTransition><Sessions /></PageTransition></PrivateRoute>} />
            <Route path="/dashboard" element={<PrivateRoute><PageTransition><Dashboard /></PageTransition></PrivateRoute>} />
            <Route path="/support" element={<PageTransition><Support /></PageTransition>} />
          </Routes>
        </AnimatePresence>
        <Footer />
      </main>

      <FloatingSupportButton />
    </>
  );
}