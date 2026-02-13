import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Timer } from "../components/timer/timer";
import { RetroBoard } from "../components/retro/retroBoard";
import { deleteRetro } from "../api/retro";
import axios from "axios";

export const RetrospectiveBoard = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [name, setName] = useState("Retrospektywa");
  const [status, setStatus] = useState<"open" | "closed">("open");
  const [isEditing, setIsEditing] = useState(false);

  const saveName = () => {
    if (id) {
      axios.put(
        `https://retrospective-app-w474.onrender.com/retros/${id}`,
        { name },
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      ).catch(console.error);
    }
    setIsEditing(false);
  };

  const closeRetro = () => {
    if (id && window.confirm('Czy na pewno chcesz zamknąć tę retrospektywę?')) {
      axios.put(
        `https://retrospective-app-w474.onrender.com/retros/${id}`,
        { status: 'closed' },
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      ).then(() => {
        setStatus('closed');
        alert('Retrospektywa została zamknięta');
      }).catch(console.error);
    }
  };

  const handleDelete = () => {
    if (id && window.confirm('Czy na pewno chcesz usunąć tę retrospektywę?')) {
      deleteRetro(id)
        .then(() => {
          alert('Retrospektywa została usunięta');
          navigate('/app/retrospectives');
        })
        .catch(err => alert('Błąd: ' + (err.response?.data?.error || err.message)));
    }
  };

  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: 12,
          borderBottom: "1px solid #ddd",
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flex: 1 }}>
          <button onClick={() => navigate('/app/retrospectives')} style={{ padding: '8px 16px' }}>
            ←
          </button>
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
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flex: 1, justifyContent: 'center', marginLeft: '10px' }}>
          <Timer />
          {status === 'open' && (
            <button 
              onClick={closeRetro} 
              style={{ padding: '8px 16px', background: '#ff9800', color: 'white', border: 'none', borderRadius: 4, cursor: 'pointer', whiteSpace: 'nowrap' }}
            >
              Zamknij retrospektywę
            </button>
          )}
          {status === 'closed' && (
            <span style={{ padding: '8px 16px', background: '#f44336', color: 'white', borderRadius: 4, whiteSpace: 'nowrap' }}>
              Zamknięta
            </span>
          )}
          <button 
            onClick={handleDelete} 
            style={{ padding: '8px 16px', background: '#dc3545', color: 'white', border: 'none', borderRadius: 4, cursor: 'pointer', whiteSpace: 'nowrap' }}
          >
            🗑️ Usuń
          </button>
        </div>
        <div style={{ flex: 1 }} />
      </div>

      <div style={{ flex: 1, overflow: "hidden", opacity: status === 'closed' ? 0.6 : 1, pointerEvents: status === 'closed' ? 'none' : 'auto' }}>
        <RetroBoard onNameChange={setName} onStatusChange={setStatus} />
      </div>
    </div>
  );
};
