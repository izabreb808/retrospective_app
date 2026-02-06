import { useState, useEffect } from "react";
import axios from "axios";

type Retro = {
  _id: string;
  name: string;
  date: string;
  status: string;
  columns: Array<{
    id: string;
    title: string;
    cards: Array<{ id: string; text: string; votes: number }>;
  }>;
};

export const Statistics = () => {
  const [retros, setRetros] = useState<Retro[]>([]);
  const [teams, setTeams] = useState<any[]>([]);

  useEffect(() => {
    Promise.all([
      axios.get("http://localhost:5000/retros", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      }),
      axios.get("http://localhost:5000/teams", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      })
    ]).then(([retrosRes, teamsRes]) => {
      setRetros(retrosRes.data);
      setTeams(teamsRes.data);
    }).catch(console.error);
  }, []);

  const exportToCSV = () => {
    const rows = [["Data", "Nazwa", "Status", "Kolumna", "Karta", "Głosy"]];
    
    retros.forEach(retro => {
      retro.columns.forEach(column => {
        column.cards.forEach(card => {
          rows.push([
            retro.date,
            retro.name,
            retro.status === "open" ? "Otwarta" : "Zamknięta",
            column.title,
            card.text,
            card.votes.toString()
          ]);
        });
      });
    });

    const csv = rows.map(row => row.map(cell => `"${cell}"`).join(",")).join("\n");
    const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `retrospektywy_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  const totalCards = retros.reduce((sum, r) => 
    sum + r.columns.reduce((s, c) => s + c.cards.length, 0), 0
  );
  const totalVotes = retros.reduce((sum, r) => 
    sum + r.columns.reduce((s, c) => s + c.cards.reduce((v, card) => v + card.votes, 0), 0), 0
  );
  const openRetros = retros.filter(r => r.status === "open").length;
  const closedRetros = retros.filter(r => r.status === "closed").length;

  return (
    <div style={{ padding: 20 }}>
      <h1 style={{ marginBottom: 30 }}>Statystyki 📊</h1>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 20, marginBottom: 40 }}>
        <div style={{ background: 'white', padding: 20, borderRadius: 10, boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
          <div style={{ fontSize: 32, fontWeight: 'bold', color: '#3498db' }}>{retros.length}</div>
          <div style={{ color: '#666', fontSize: 14 }}>Retrospektyw</div>
        </div>
        <div style={{ background: 'white', padding: 20, borderRadius: 10, boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
          <div style={{ fontSize: 32, fontWeight: 'bold', color: '#2ecc71' }}>{openRetros}</div>
          <div style={{ color: '#666', fontSize: 14 }}>Otwartych</div>
        </div>
        <div style={{ background: 'white', padding: 20, borderRadius: 10, boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
          <div style={{ fontSize: 32, fontWeight: 'bold', color: '#e74c3c' }}>{closedRetros}</div>
          <div style={{ color: '#666', fontSize: 14 }}>Zamkniętych</div>
        </div>
        <div style={{ background: 'white', padding: 20, borderRadius: 10, boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
          <div style={{ fontSize: 32, fontWeight: 'bold', color: '#f39c12' }}>{totalCards}</div>
          <div style={{ color: '#666', fontSize: 14 }}>Kart</div>
        </div>
        <div style={{ background: 'white', padding: 20, borderRadius: 10, boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
          <div style={{ fontSize: 32, fontWeight: 'bold', color: '#9b59b6' }}>{totalVotes}</div>
          <div style={{ color: '#666', fontSize: 14 }}>Głosów</div>
        </div>
        <div style={{ background: 'white', padding: 20, borderRadius: 10, boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
          <div style={{ fontSize: 32, fontWeight: 'bold', color: '#1abc9c' }}>{teams.length}</div>
          <div style={{ color: '#666', fontSize: 14 }}>Zespołów</div>
        </div>
      </div>

      <div style={{ background: 'white', padding: 30, borderRadius: 10, boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
        <h2 style={{ marginBottom: 20 }}>Eksport danych</h2>
        <p style={{ color: '#666', marginBottom: 20 }}>
          Eksportuj wszystkie retrospektywy do pliku CSV. Plik będzie zawierał wszystkie karty z głosami.
        </p>
        <button
          onClick={exportToCSV}
          disabled={retros.length === 0}
          style={{
            padding: '12px 24px',
            fontSize: 16,
            borderRadius: 6,
            border: 'none',
            background: retros.length === 0 ? '#ccc' : '#3498db',
            color: 'white',
            cursor: retros.length === 0 ? 'not-allowed' : 'pointer',
            fontWeight: 'bold'
          }}
        >
          📥 Eksportuj do CSV
        </button>
      </div>
    </div>
  );
};
