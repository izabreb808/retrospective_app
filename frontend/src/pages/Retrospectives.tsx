import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { getRetros, createRetro } from "../api/retro";

type Retro = {
  _id: string;
  name: string;
  date: string;
  status: "open" | "closed";
};

export const Retrospectives = () => {
  const navigate = useNavigate();
  const [retros, setRetros] = useState<Retro[]>([]);

  useEffect(() => {
    getRetros().then(res => setRetros(res.data)).catch(console.error);
  }, []);

  const handleCreateRetro = () => {
    const name = `Sprint ${retros.length + 1}`;
    const date = new Date().toISOString().split("T")[0];
    createRetro(name, date)
      .then(res => {
        console.log('Utworzono:', res.data);
        setRetros([res.data, ...retros]);
      })
      .catch(err => {
        console.error('Błąd tworzenia:', err.response?.data || err.message);
        alert('Błąd: ' + (err.response?.data?.error || err.message));
      });
  };

  return (
    <div>
      <h1>Retrospektywy</h1>

      <button onClick={handleCreateRetro} style={{ marginBottom: 20 }}>
        ➕ Nowa retrospektywa
      </button>

      <div>
        {retros.map((retro) => (
          <div
            key={retro._id}
            onClick={() => navigate(`/app/retrospectives/${retro._id}`)}
            style={{
              padding: 16,
              border: "1px solid #ddd",
              borderRadius: 10,
              marginBottom: 10,
              cursor: "pointer",
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <div>
              <strong>{retro.name}</strong>
              <div style={{ fontSize: 12, color: "#666" }}>{retro.date}</div>
            </div>

            <span>
              {retro.status === "open" ? "🟢 otwarta" : "🔴 zamknięta"}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
