import React, {useEffect, useState} from 'react';
import { doc, onSnapshot, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';

export default function ProfilesView({team,user}){
  const [teamData, setTeamData] = useState(team);

  useEffect(()=>{
    const ref = doc(db,'teams',team.id);
    const unsub = onSnapshot(ref,snap=> setTeamData({id:snap.id,...snap.data()}));
    return ()=>unsub();
  },[team.id]);

  const markAllHere = async ()=>{
    if(user.id !== team.creatorId) return alert('Apenas o criador pode sinalizar');
    await updateDoc(doc(db,'teams',team.id),{ state:'segmentVote' });
  };

  return (
    <div>
      <div className="card">
        <h3>Perfis dos membros</h3>
        {teamData && teamData.profiles ? Object.entries(teamData.profiles).map(([uid,p])=> (
          <div key={uid} className="card">
            <strong>{p.name}</strong>
            <div className="small">Perfil: {p.type}</div>
            <div className="small">Pontuação detalhada: {JSON.stringify(p.scores)}</div>
          </div>
        )) : <div>Perfis ainda não disponíveis.</div>}

        {user.id === team.creatorId && (
          <div style={{marginTop:8}}>
            <button className="button" onClick={markAllHere}>Sinalizar que todos chegaram (avançar)</button>
          </div>
        )}
      </div>
    </div>
  );
}