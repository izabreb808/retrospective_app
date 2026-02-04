import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export const TeamSetup = () => {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"choice" | "create" | "join">("choice");
  const [teamName, setTeamName] = useState("");
  const [teamCode, setTeamCode] = useState("");
  const [error, setError] = useState("");

  const createTeam = async () => {
    try {
      const res = await axios.post(
        "http://localhost:5000/team/create",
        { name: teamName },
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );
      alert(`Zespół utworzony! Kod: ${res.data.code}`);
      navigate("/app");
    } catch (err: any) {
      setError(err.response?.data?.error || "Błąd");
    }
  };

  const joinTeam = async () => {
    try {
      await axios.post(
        "http://localhost:5000/team/join",
        { code: teamCode },
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );
      navigate("/app");
    } catch (err: any) {
      setError(err.response?.data?.error || "Błąd");
    }
  };

  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh", background: "#f5f6fa" }}>
      <div style={{ background: "white", padding: 40, borderRadius: 10, boxShadow: "0 4px 12px rgba(0,0,0,0.1)", minWidth: 400 }}>
        {mode === "choice" && (
          <>
            <h2>Konfiguracja zespołu</h2>
            <p style={{ color: "#666", marginBottom: 30 }}>Utwórz nowy zespół lub dołącz do istniejącego</p>
            <button onClick={() => setMode("create")} style={{ width: "100%", padding: 12, marginBottom: 10, fontSize: 16 }}>
              🆕 Utwórz nowy zespół
            </button>
            <button onClick={() => setMode("join")} style={{ width: "100%", padding: 12, fontSize: 16 }}>
              🔗 Dołącz do zespołu
            </button>
          </>
        )}

        {mode === "create" && (
          <>
            <h2>Utwórz zespół</h2>
            <input
              placeholder="Nazwa zespołu"
              value={teamName}
              onChange={e => setTeamName(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && createTeam()}
              style={{ width: "100%", padding: 10, marginBottom: 10 }}
            />
            <button onClick={createTeam} style={{ width: "100%", padding: 12, marginBottom: 10 }}>
              Utwórz
            </button>
            <button onClick={() => setMode("choice")} style={{ width: "100%", padding: 12, background: "#ddd" }}>
              Wróć
            </button>
          </>
        )}

        {mode === "join" && (
          <>
            <h2>Dołącz do zespołu</h2>
            <input
              placeholder="Kod zespołu (np. ABC123)"
              value={teamCode}
              onChange={e => setTeamCode(e.target.value.toUpperCase())}
              onKeyDown={e => e.key === 'Enter' && joinTeam()}
              style={{ width: "100%", padding: 10, marginBottom: 10, textTransform: "uppercase" }}
            />
            <button onClick={joinTeam} style={{ width: "100%", padding: 12, marginBottom: 10 }}>
              Dołącz
            </button>
            <button onClick={() => setMode("choice")} style={{ width: "100%", padding: 12, background: "#ddd" }}>
              Wróć
            </button>
          </>
        )}

        {error && <p style={{ color: "red", marginTop: 10 }}>{error}</p>}
      </div>
    </div>
  );
};
