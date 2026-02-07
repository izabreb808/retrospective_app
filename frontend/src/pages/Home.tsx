import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";

export const Home = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({ retros: 0, teams: 0 });

  useEffect(() => {
    Promise.all([
      axios.get("https://retrospective-app-w474.onrender.com/retros", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      }),
      axios.get("https://retrospective-app-w474.onrender.com/teams", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      })
    ]).then(([retrosRes, teamsRes]) => {
      setStats({ retros: retrosRes.data.length, teams: teamsRes.data.length });
    }).catch(console.error);
  }, []);

  const cards = [
    { title: "Zespoły", icon: "👥", desc: `${stats.teams} zespołów`, path: "/app/team", color: "#2ecc71" },
    { title: "Retrospektywy", icon: "📝", desc: `${stats.retros} retrospektyw`, path: "/app/retrospectives", color: "#3498db" },
    { title: "Koło fortuny", icon: "🎡", desc: "Losuj osoby do wypowiedzi", path: "/app/wheel", color: "#e74c3c" },
    { title: "Statystyki", icon: "📊", desc: "Przeglądaj i eksportuj dane", path: "/app/statistics", color: "#9b59b6" },
  ];

  return (
    <div style={{ padding: 20 }}>
      <h1 style={{ marginBottom: 10 }}>Witaj w aplikacji retrospektywnej!</h1>
      <p style={{ color: '#666', marginBottom: 40 }}>Zarządzaj retrospektywami, zespołami i losuj osoby do wypowiedzi.</p>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 20, maxWidth: 1200 }}>
        {cards.map(card => (
          <div
            key={card.path}
            onClick={() => navigate(card.path)}
            style={{
              background: 'white',
              padding: 30,
              borderRadius: 10,
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              cursor: 'pointer',
              transition: 'transform 0.2s, box-shadow 0.2s',
              borderTop: `4px solid ${card.color}`
            }}
            onMouseEnter={e => {
              e.currentTarget.style.transform = 'translateY(-5px)';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
            }}
          >
            <div style={{ fontSize: 48, marginBottom: 10 }}>{card.icon}</div>
            <h2 style={{ margin: '10px 0', color: card.color }}>{card.title}</h2>
            <p style={{ color: '#666', fontSize: 14 }}>{card.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
