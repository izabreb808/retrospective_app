import { useState, useEffect } from "react";
import { getTeam, addTeamMember, deleteTeamMember } from "../api/team";
import axios from "axios";

type Member = {
  _id: string;
  name: string;
  role: string;
  avatar: string;
};

type TeamInfo = {
  _id: string;
  name: string;
  code: string;
};

export const Team = () => {
  const [teams, setTeams] = useState<TeamInfo[]>([]);
  const [selectedTeam, setSelectedTeam] = useState<TeamInfo | null>(null);
  const [members, setMembers] = useState<Member[]>([]);
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [tab, setTab] = useState<"create" | "join">("create");
  const [teamName, setTeamName] = useState("");
  const [teamCode, setTeamCode] = useState("");

  useEffect(() => {
    loadTeams();
  }, []);

  const loadTeams = () => {
    axios.get("http://localhost:5000/teams", {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
    }).then(res => setTeams(res.data)).catch(console.error);
  };

  const createTeam = async () => {
    if (!teamName.trim()) return;
    try {
      const res = await axios.post(
        "http://localhost:5000/team/create",
        { name: teamName },
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );
      alert(`Zespół utworzony! Kod: ${res.data.code}`);
      setTeamName("");
      loadTeams();
    } catch (err: any) {
      alert(err.response?.data?.error || "Błąd");
    }
  };

  const joinTeam = async () => {
    if (!teamCode.trim()) return;
    try {
      await axios.post(
        "http://localhost:5000/team/join",
        { code: teamCode },
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );
      setTeamCode("");
      loadTeams();
    } catch (err: any) {
      alert(err.response?.data?.error || "Błąd");
    }
  };

  const openTeam = async (team: TeamInfo) => {
    await axios.post(
      "http://localhost:5000/team/switch",
      { teamId: team._id },
      { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
    );
    setSelectedTeam(team);
    getTeam().then(res => setMembers(res.data)).catch(console.error);
  };

  const handleAdd = () => {
    if (!name.trim() || !role.trim()) return;
    const avatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random`;
    addTeamMember(name, role, avatar)
      .then(res => {
        setMembers([...members, res.data]);
        setName("");
        setRole("");
      })
      .catch(console.error);
  };

  const handleDelete = (id: string) => {
    deleteTeamMember(id)
      .then(() => setMembers(members.filter(m => m._id !== id)))
      .catch(console.error);
  };

  if (selectedTeam) {
    return (
      <div>
        <button onClick={() => setSelectedTeam(null)} style={{ marginBottom: 20, padding: '8px 16px' }}>
          ← Powrót do listy zespołów
        </button>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <h1>{selectedTeam.name}</h1>
          <div style={{ background: '#e3f2fd', padding: '10px 20px', borderRadius: 8 }}>
            <strong>Kod zespołu:</strong> <span style={{ fontSize: 20, fontWeight: 'bold', color: '#1976d2' }}>{selectedTeam.code}</span>
          </div>
        </div>

        <div style={{ marginBottom: 30, display: 'flex', gap: 10 }}>
          <input
            placeholder="Imię i nazwisko"
            value={name}
            onChange={e => setName(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleAdd()}
            style={{ padding: 8, flex: 1 }}
          />
          <input
            placeholder="Rola (np. Developer)"
            value={role}
            onChange={e => setRole(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleAdd()}
            style={{ padding: 8, flex: 1 }}
          />
          <button onClick={handleAdd} style={{ padding: '8px 20px' }}>➕ Dodaj</button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 16 }}>
          {members.map(member => (
            <div
              key={member._id}
              style={{
                background: 'white',
                padding: 20,
                borderRadius: 10,
                textAlign: 'center',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                position: 'relative'
              }}
            >
              <button
                onClick={() => handleDelete(member._id)}
                style={{
                  position: 'absolute',
                  top: 8,
                  right: 8,
                  background: '#ff4444',
                  color: 'white',
                  border: 'none',
                  borderRadius: 4,
                  padding: '4px 8px',
                  cursor: 'pointer',
                  fontSize: 12
                }}
              >
                ×
              </button>
              <img
                src={member.avatar}
                alt={member.name}
                style={{ width: 80, height: 80, borderRadius: '50%', marginBottom: 10 }}
              />
              <h3 style={{ margin: '8px 0' }}>{member.name}</h3>
              <p style={{ color: '#666', fontSize: 14 }}>{member.role}</p>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div>
      <h1>Zespół</h1>

      <div style={{ display: 'flex', gap: 10, marginBottom: 20, borderBottom: '2px solid #ddd' }}>
        <button 
          onClick={() => setTab("create")} 
          style={{ 
            padding: '12px 24px', 
            background: 'transparent',
            border: 'none',
            borderBottom: tab === 'create' ? '3px solid #1976d2' : 'none',
            color: tab === 'create' ? '#1976d2' : '#666',
            fontWeight: tab === 'create' ? 'bold' : 'normal',
            cursor: 'pointer'
          }}
        >
          Utwórz zespół
        </button>
        <button 
          onClick={() => setTab("join")} 
          style={{ 
            padding: '12px 24px', 
            background: 'transparent',
            border: 'none',
            borderBottom: tab === 'join' ? '3px solid #1976d2' : 'none',
            color: tab === 'join' ? '#1976d2' : '#666',
            fontWeight: tab === 'join' ? 'bold' : 'normal',
            cursor: 'pointer'
          }}
        >
          Dołącz do zespołu
        </button>
      </div>

      <div style={{ marginBottom: 30, padding: 20, background: 'white', borderRadius: 10 }}>
        {tab === "create" && (
          <div style={{ display: 'flex', gap: 10 }}>
            <input
              placeholder="Nazwa zespołu"
              value={teamName}
              onChange={e => setTeamName(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && createTeam()}
              style={{ padding: 10, flex: 1, fontSize: 16 }}
            />
            <button onClick={createTeam} style={{ padding: '10px 24px', fontSize: 16 }}>Utwórz</button>
          </div>
        )}

        {tab === "join" && (
          <div style={{ display: 'flex', gap: 10 }}>
            <input
              placeholder="Kod zespołu (np. ABC123)"
              value={teamCode}
              onChange={e => setTeamCode(e.target.value.toUpperCase())}
              onKeyDown={e => e.key === 'Enter' && joinTeam()}
              style={{ padding: 10, flex: 1, fontSize: 16, textTransform: 'uppercase' }}
            />
            <button onClick={joinTeam} style={{ padding: '10px 24px', fontSize: 16 }}>Dołącz</button>
          </div>
        )}
      </div>

      <h2>Twoje zespoły</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: 16 }}>
        {teams.map(team => (
          <div
            key={team._id}
            onClick={() => openTeam(team)}
            style={{
              background: 'white',
              padding: 20,
              borderRadius: 10,
              cursor: 'pointer',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              transition: 'transform 0.2s',
            }}
            onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-4px)'}
            onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
          >
            <h3 style={{ margin: 0 }}>{team.name}</h3>
          </div>
        ))}
      </div>

      {teams.length === 0 && (
        <p style={{ color: '#666', textAlign: 'center', marginTop: 40 }}>Nie masz jeszcze żadnych zespołów. Utwórz nowy lub dołącz do istniejącego!</p>
      )}
    </div>
  );
};
