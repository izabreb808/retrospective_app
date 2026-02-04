import { useState } from "react";
import { useParams } from "react-router-dom";
import { Timer } from "../components/timer/timer";
import { RetroBoard } from "../components/retro/retroBoard";
import axios from "axios";

export const RetrospectiveBoard = () => {
  const { id } = useParams();
  const [name, setName] = useState("Retrospektywa");
  const [isEditing, setIsEditing] = useState(false);

  const saveName = () => {
    if (id) {
      axios.put(
        `http://localhost:5000/retros/${id}`,
        { name },
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      ).catch(console.error);
    }
    setIsEditing(false);
  };

  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          padding: 12,
          borderBottom: "1px solid #ddd",
        }}
      >
        {isEditing ? (
          <input
            value={name}
            onChange={e => setName(e.target.value)}
            onBlur={saveName}
            onKeyDown={e => e.key === 'Enter' && saveName()}
            autoFocus
            style={{ fontSize: 24, fontWeight: 'bold', border: '1px solid #ccc', padding: 4 }}
          />
        ) : (
          <h2 
            onClick={() => setIsEditing(true)} 
            style={{ cursor: 'pointer', margin: 0, display: 'flex', alignItems: 'center', gap: 8 }}
            title="Kliknij aby edytować"
          >
            {name}
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#999" strokeWidth="2" style={{ opacity: 0.5 }}>
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
            </svg>
          </h2>
        )}
        <Timer />
      </div>

      <div style={{ flex: 1, overflow: "hidden" }}>
        <RetroBoard onNameChange={setName} />
      </div>
    </div>
  );
};
