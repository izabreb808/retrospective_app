import { Outlet, useNavigate, NavLink } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import "@/dashboard.css";

export const DashboardLayout = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState<string>("");

  useEffect(() => {
    axios.get("http://localhost:5000/user", {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
    }).then(res => setUsername(res.data.username))
      .catch(() => navigate("/"));
  }, [navigate]);

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <div style={{ display: "flex", height: "100vh", width: "100vw" }}>
      {/* SIDEBAR */}
      <aside
        style={{
          width: 240,
          background: "#2c3e50",
          color: "white",
          padding: 20,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <h2>Retrospektywa</h2>

        <NavLink to="/app" style={linkStyle}>🏠 Strona główna</NavLink>
        <NavLink to="/app/team" style={linkStyle}>👥 Zespoły</NavLink>
        <NavLink to="/app/retrospectives" style={linkStyle}>📝 Retrospektywy</NavLink>
        <NavLink to="/app/wheel" style={linkStyle}>🎡 Koło fortuny</NavLink>
        <NavLink to="/app/statistics" style={linkStyle}>📊 Statystyki</NavLink>

        <div style={{ marginTop: "auto" }}>
          <div style={{ color: '#bdc3c7', fontSize: 14, marginBottom: 10 }}>
            Zalogowany: {username}
          </div>
        </div>
      </aside>

      {/* MAIN */}
      <main style={{ flex: 1, background: "#f5f6fa", overflow: "hidden", display: "flex", flexDirection: "column", position: "relative" }}>
        <button
          onClick={logout}
          style={{
            position: 'absolute',
            top: 10,
            right: 20,
            background: 'transparent',
            border: 'none',
            color: '#666',
            cursor: 'pointer',
            fontSize: 14,
            textDecoration: 'underline',
            padding: '4px 8px',
            zIndex: 1000
          }}
        >
          Wyloguj
        </button>
        <div style={{ flex: 1, overflow: 'auto', padding: '10px 20px 20px 20px' }}>
          <Outlet />
        </div>
      </main>
    </div>
  );
};

const linkStyle = {
  color: "white",
  textDecoration: "none",
  marginBottom: 12,
};
