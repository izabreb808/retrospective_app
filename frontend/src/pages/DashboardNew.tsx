import { Outlet, useNavigate, NavLink } from "react-router-dom";

export const DashboardLayout = () => {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <div style={{ display: "flex", height: "100vh", width: "100vw" }}>
      <aside
        style={{
          width: 240,
          background: "linear-gradient(180deg, #2c3e50 0%, #34495e 100%)",
          color: "white",
          padding: 20,
          display: "flex",
          flexDirection: "column",
          boxShadow: "2px 0 10px rgba(0,0,0,0.1)"
        }}
      >
        <h2 style={{ marginBottom: 30, fontSize: 24 }}>Retro App</h2>

        <NavLink to="/app" style={linkStyle}>🏠 Strona główna</NavLink>
        <NavLink to="/app/retrospectives" style={linkStyle}>📝 Retrospektywy</NavLink>
        <NavLink to="/app/team" style={linkStyle}>👥 Zespoły</NavLink>
      </aside>

      <main style={{ flex: 1, background: "#f5f6fa", overflow: "hidden", display: "flex", flexDirection: "column" }}>
        <div style={{ padding: "15px 20px", display: 'flex', justifyContent: 'flex-end', background: 'white', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
          <button
            onClick={logout}
            style={{
              padding: '8px 20px',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              border: 'none',
              borderRadius: 6,
              cursor: 'pointer',
              fontSize: 14,
              fontWeight: 500,
              transition: 'transform 0.2s'
            }}
            onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-1px)'}
            onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
          >
            Wyloguj
          </button>
        </div>
        <div style={{ flex: 1, overflow: 'auto', padding: 20 }}>
          <Outlet />
        </div>
      </main>
    </div>
  );
};

const linkStyle = {
  color: "white",
  textDecoration: "none",
  marginBottom: 8,
  padding: '12px 16px',
  borderRadius: 8,
  display: 'block',
  transition: 'all 0.2s',
  background: 'transparent'
};
