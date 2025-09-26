import React, {useEffect, useState} from 'react';
import { doc, onSnapshot, updateDoc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';

export default function Act3_Operations({team,user}){
  const [teamData, setTeamData] = useState(team);
  const [invest, setInvest] = useState(0);

  useEffect(()=>{
    const unsub = onSnapshot(doc(db,'teams',team.id),(s)=> setTeamData({id:s.id,...s.data()}));
    return ()=>unsub();
  },[team.id]);

  const triggerIssue = async ()=>{
    // random issue; penalize score and require CEO decision
    const issue = { time: new Date().toISOString(), severity: Math.ceil(Math.random()*3), text:'Incidente de qualidade com cliente' };
    await updateDoc(doc(db,'teams',team.id),{ operationalIssues: [...(teamData.operationalIssues||[]), issue], score: (teamData.score||0) - 5 });
    alert('Incidente registrado. CEO deve resolver para reduzir impacto.');
  };

  const investInOps = async ()=>{
    if(user.id !== teamData.ceoId) return alert('Apenas o CEO pode investir');
    // simple invest action: reduces pending issues and costs score
    const newScore = (teamData.score||0) + Math.round(invest/10) - 2;
    await updateDoc(doc(db,'teams',team.id),{ operationalIssues: [], score: newScore, operationsInvestment: (teamData.operationsInvestment||0)+invest });
    alert('Investimento realizado e incidentes mitigados.');
  };

  return (
    <div className="card">
      <h3>ATO 3 — Operações</h3>
      <p>Simule incidentes operacionais e decida investimentos para mitigá-los.</p>
      <div style={{marginTop:8}}>
        <button className="button" onClick={triggerIssue}>Simular incidente</button>
      </div>
      <div style={{marginTop:12}}>
        <h4>Incidentes</h4>
        {(teamData.operationalIssues||[]).map((it,i)=> (
          <div key={i} className="card">
            <div>{it.time} — {it.text} (gravidade {it.severity})</div>
          </div>
        ))}
      </div>

      <div style={{marginTop:12}} className="card">
        <h4>Investir em operações (apenas CEO)</h4>
        <input className="input" type="number" value={invest} onChange={e=>setInvest(Number(e.target.value))} placeholder="Valor a investir" />
        <div style={{marginTop:8}}>
          <button className="button" onClick={investInOps}>Investir</button>
        </div>
      </div>
    </div>
  );
}