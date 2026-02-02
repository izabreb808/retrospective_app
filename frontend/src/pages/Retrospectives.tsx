import { useNavigate } from "react-router-dom";
import { useState } from "react";

type Retro = {
  id: string;
  name: string;
  date: string;
  status: "open" | "closed";
};

export const Retrospectives = () => {
  const navigate = useNavigate();

  // 🔹 na razie mock – backend dodamy później
  const [retros, setRetros] = useState<Retro[]>([
    { id: "1", name: "Sprint 12", date: "2025-02-01", status: "open" },
    { id: "2", name: "Sprint 11", date: "2025-01-15", status: "closed" },
  ]);

  const createRetro = () => {
    const newRetro = {
      id: crypto.randomUUID(),
      name: `Sprint ${retros.length + 1}`,
      date: new Date().toISOString().split("T")[0],
      status: "open" as const,
    };

    setRetros([newRetro, ...retros]);
  };

  return (
    <div>
      <h1>Retrospektywy</h1>

      <button onClick={createRetro} style={{ marginBottom: 20 }}>
        ➕ Nowa retrospektywa
      </button>

      <div>
        {retros.map((retro) => (
          <div
            key={retro.id}
            onClick={() => navigate(`/app/retrospectives/${retro.id}`)}
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
