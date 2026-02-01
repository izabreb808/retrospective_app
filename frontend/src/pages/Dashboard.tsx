import { Outlet, useNavigate, NavLink } from "react-router-dom";
import { Button } from "@mui/material";
import "@/dashboard.css";

export const DashboardLayout = () => {
  const navigate = useNavigate();

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
        <h2>Retro App</h2>

        <NavLink to="/app" style={linkStyle}>🏠 Dashboard</NavLink>
        <NavLink to="/app/retrospectives" style={linkStyle}>📝 Retrospektywy</NavLink>
        <NavLink to="/app/team" style={linkStyle}>👥 Zespół</NavLink>

        <div style={{ marginTop: "auto" }}>
          <Button
            variant="outlined"
            fullWidth
            onClick={logout}
          >
            Wyloguj
          </Button>
        </div>
      </aside>

      {/* MAIN */}
      <main style={{ flex: 1, padding: 40, background: "#f5f6fa" }}>
        <Outlet />
      </main>
    </div>
  );
};

const linkStyle = {
  color: "white",
  textDecoration: "none",
  marginBottom: 12,
};
