import React, {useEffect, useState} from 'react';
import { doc, onSnapshot, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { PROFILES } from '../config';

const ROLES = [ 'Diretor de Tecnologia', 'Diretor de Produto', 'Diretor Comercial', 'Diretor de Operações', 'Diretor Financeiro', 'Diretor de Marketing' ];

export default function CEOActions({team,user}){
  const [teamData, setTeamData] = useState(team);
  const [assignments, setAssignments] = useState({});

  useEffect(()=>{
    const unsub = onSnapshot(doc(db,'teams',team.id),(s)=> setTeamData({id:s.id,...s.data()}));
    return ()=>unsub();
  },[team.id]);

  useEffect(()=>{ if(teamData && teamData.positions) setAssignments(teamData.positions); },[teamData]);

  const assign = (role, memberId)=> setAssignments(a=>({...a,[memberId]:role}));

  const submit = async ()=>{
    if(user.id !== teamData.ceoId) return alert('Apenas o CEO pode definir cargos');
    await updateDoc(doc(db,'teams',team.id),{ positions: assignments, state:'hiring' });
  };

  return (
    <div className="card">
      <h3>Menu do CEO</h3>
      <div className="small">Você é o CEO se seu id for: {teamData.ceoId}</div>
      {user.id === teamData.ceoId ? (
        <div>
          <h4>Definir cargos</h4>
          {teamData.members?.map(m=> (
            <div key={m} className="card">
              <div><strong>{m}</strong></div>
              <select className="input" value={assignments[m]||''} onChange={e=>assign(e.target.value,m)}>
                <option value="">-- escolher --</option>
                {ROLES.map(r=> <option key={r} value={r}>{r}</option>)}
              </select>
            </div>
          ))}
          <div style={{marginTop:8}}>
            <button className="button" onClick={submit}>Confirmar cargos</button>
          </div>
        </div>
      ) : (
        <div>Somente o CEO tem acesso a este menu.</div>
      )}
    </div>
  );
}