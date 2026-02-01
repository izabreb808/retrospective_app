import { useNavigate } from "react-router-dom";
import { Button } from "@mui/material";

export const Dashboard = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <div style={{ padding: 40 }}>
      <h1>Dashboard</h1>

      <Button
        variant="contained"
        color="error"
        onClick={handleLogout}
        sx={{ mt: 2 }}
      >
        Wyloguj
      </Button>
    </div>
  );
};
