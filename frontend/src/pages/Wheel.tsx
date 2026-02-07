import { useState, useEffect } from "react";
import { getTeam } from "../api/team";
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

export const Wheel = () => {
  const [teams, setTeams] = useState<TeamInfo[]>([]);
  const [selectedTeamId, setSelectedTeamId] = useState<string>("");
  const [allMembers, setAllMembers] = useState<Member[]>([]);
  const [members, setMembers] = useState<Member[]>([]);
  const [displayMembers, setDisplayMembers] = useState<Member[]>([]);
  const [spinning, setSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [winner, setWinner] = useState<Member | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    axios.get("https://retrospective-app-w474.onrender.com/teams", {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
    }).then(res => {
      console.log('Zespoły:', res.data);
      setTeams(res.data);
      if (res.data.length > 0) {
        setSelectedTeamId(res.data[0]._id);
        loadTeamMembers(res.data[0]._id);
      }
    }).catch(err => console.error('Błąd ładowania zespołów:', err));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadTeamMembers = (teamId: string) => {
    axios.post(
      "https://retrospective-app-w474.onrender.com/team/switch",
      { teamId },
      { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
    ).then(() => {
      getTeam().then(res => {
        setAllMembers(res.data);
        setMembers(res.data);
        setDisplayMembers(res.data);
      }).catch(console.error);
    }).catch(console.error);
  };

  const handleTeamChange = (teamId: string) => {
    setSelectedTeamId(teamId);
    loadTeamMembers(teamId);
    setWinner(null);
  };

  const spin = () => {
    if (spinning || members.length === 0) return;
    
    setSpinning(true);
    setWinner(null);
    setShowConfetti(false);
    
    const randomIndex = Math.floor(Math.random() * members.length);
    const selectedMember = members[randomIndex];
    
    console.log('Wylosowano:', selectedMember.name, 'index:', randomIndex);
    
    const spins = 5;
    const degreesPerMember = 360 / members.length;
    const segmentStartAngle = randomIndex * degreesPerMember;
    const segmentCenterAngle = segmentStartAngle + (degreesPerMember / 2);
    const targetRotation = -segmentCenterAngle;
    const currentRotation = rotation % 360;
    let rotationDiff = targetRotation - currentRotation;
    while (rotationDiff < 0) rotationDiff += 360;
    const newRotation = rotation + (spins * 360) + rotationDiff;
    
    console.log('Segment start:', segmentStartAngle, 'center:', segmentCenterAngle, 'Target:', targetRotation, 'Diff:', rotationDiff);
    
    setRotation(newRotation);
    
    setTimeout(() => {
      setSpinning(false);
      setWinner(selectedMember);
      const newMembers = members.filter(m => m._id !== selectedMember._id);
      setMembers(newMembers);
      if (newMembers.length > 0) {
        setDisplayMembers(newMembers);
      }
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 3000);
    }, 4000);
  };

  const resetMembers = () => {
    setMembers(allMembers);
    setDisplayMembers(allMembers);
    setWinner(null);
  };

  return (
    <div style={{ padding: 20, position: 'relative' }}>
      {showConfetti && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 1000 }}>
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              style={{
                position: 'absolute',
                left: `${Math.random() * 100}%`,
                top: '-10px',
                width: '10px',
                height: '10px',
                background: ['#3498db', '#e74c3c', '#2ecc71', '#f39c12', '#9b59b6'][Math.floor(Math.random() * 5)],
                animation: `fall ${2 + Math.random() * 2}s linear`,
                opacity: 0.8
              }}
            />
          ))}
        </div>
      )}
      <style>{`
        @keyframes fall {
          to {
            transform: translateY(100vh) rotate(360deg);
            opacity: 0;
          }
        }
      `}</style>
      
      <h1 style={{ marginBottom: 30 }}>Koło fortuny</h1>
      
      <div style={{ position: 'relative' }}>
        <div style={{ position: 'absolute', left: 0, top: 0, width: 250, paddingTop: 20 }}>
          {teams.length > 0 && (
            <div style={{ marginBottom: 20 }}>
              <label style={{ display: 'block', marginBottom: 8, fontWeight: 'bold' }}>Wybierz zespół:</label>
              <select
                value={selectedTeamId}
                onChange={e => handleTeamChange(e.target.value)}
                style={{
                  padding: '10px 20px',
                  fontSize: 16,
                  borderRadius: 6,
                  border: '1px solid #ddd',
                  background: 'white',
                  color: '#333',
                  cursor: 'pointer',
                  width: '100%'
                }}
              >
                {teams.map(team => (
                  <option key={team._id} value={team._id}>{team.name || 'Bez nazwy'}</option>
                ))}
              </select>
            </div>
          )}
          {allMembers.length === 0 ? (
            <p style={{ color: '#666', fontSize: 14 }}>Brak członków zespołu. Dodaj członków w zakładce Zespół.</p>
          ) : (
            <>
              <p style={{ color: '#666', fontSize: 14, marginBottom: 10 }}>
                {members.length === 0 ? 'Wszyscy zostali wylosowani!' : 'Kliknij na koło aby wylosować osobę do wypowiedzi'}
              </p>
              {allMembers.length > members.length && (
                <button
                  onClick={resetMembers}
                  style={{
                    padding: '8px 16px',
                    fontSize: 14,
                    borderRadius: 6,
                    border: '1px solid #3498db',
                    background: 'white',
                    color: '#3498db',
                    cursor: 'pointer',
                    width: '100%'
                  }}
                >
                  Resetuj listę
                </button>
              )}
            </>
          )}
        </div>
        
        {displayMembers.length > 0 && (
          <div style={{ display: 'flex', justifyContent: 'center', paddingTop: 20 }}>
            <div style={{ position: 'relative', width: 400, height: 400, cursor: spinning ? 'default' : 'pointer' }} onClick={spin}>
              <svg
                width="400"
                height="400"
                style={{
                  transform: `rotate(${rotation}deg)`,
                  transition: spinning ? 'transform 4s cubic-bezier(0.17, 0.67, 0.12, 0.99)' : 'none'
                }}
              >
                {displayMembers.map((member, index) => {
                  const angle = (360 / displayMembers.length) * index;
                  const nextAngle = (360 / displayMembers.length) * (index + 1);
                  const colors = ['#3498db', '#e74c3c', '#2ecc71', '#f39c12', '#9b59b6', '#1abc9c'];
                  
                  if (displayMembers.length === 1) {
                    return (
                      <g key={member._id}>
                        <circle cx="200" cy="200" r="180" fill={colors[0]} stroke="white" strokeWidth="2" />
                        <text
                          x="200"
                          y="80"
                          fill="white"
                          fontSize="14"
                          fontWeight="bold"
                          textAnchor="middle"
                          dominantBaseline="middle"
                        >
                          {member.name}
                        </text>
                      </g>
                    );
                  }
                  
                  return (
                    <g key={member._id}>
                      <path
                        d={`M 200 200 L ${200 + 180 * Math.cos((angle - 90) * Math.PI / 180)} ${200 + 180 * Math.sin((angle - 90) * Math.PI / 180)} A 180 180 0 0 1 ${200 + 180 * Math.cos((nextAngle - 90) * Math.PI / 180)} ${200 + 180 * Math.sin((nextAngle - 90) * Math.PI / 180)} Z`}
                        fill={colors[index % colors.length]}
                        stroke="white"
                        strokeWidth="2"
                      />
                      <text
                        x={200 + 120 * Math.cos(((angle + nextAngle) / 2 - 90) * Math.PI / 180)}
                        y={200 + 120 * Math.sin(((angle + nextAngle) / 2 - 90) * Math.PI / 180)}
                        fill="white"
                        fontSize="14"
                        fontWeight="bold"
                        textAnchor="middle"
                        dominantBaseline="middle"
                        transform={`rotate(${(angle + nextAngle) / 2}, ${200 + 120 * Math.cos(((angle + nextAngle) / 2 - 90) * Math.PI / 180)}, ${200 + 120 * Math.sin(((angle + nextAngle) / 2 - 90) * Math.PI / 180)})`}
                      >
                        {member.name}
                      </text>
                    </g>
                  );
                })}
                <circle cx="200" cy="200" r="30" fill="white" stroke="#333" strokeWidth="3" />
              </svg>
              
              <div style={{
                position: 'absolute',
                top: -10,
                left: '50%',
                transform: 'translateX(-50%)',
                width: 0,
                height: 0,
                borderLeft: '15px solid transparent',
                borderRight: '15px solid transparent',
                borderTop: '30px solid #e74c3c'
              }} />
            </div>
          </div>
        )}
      </div>

      {winner && (
        <div style={{
          background: 'white',
          padding: 30,
          borderRadius: 10,
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          maxWidth: 400,
          margin: '40px auto 0',
          textAlign: 'center'
        }}>
          <h2 style={{ marginBottom: 20 }}>🎉 Wylosowano:</h2>
          <img
            src={winner.avatar}
            alt={winner.name}
            style={{ width: 100, height: 100, borderRadius: '50%', marginBottom: 15 }}
          />
          <h3 style={{ margin: '10px 0' }}>{winner.name}</h3>
          <p style={{ color: '#666' }}>{winner.role}</p>
        </div>
      )}
    </div>
  );
};
