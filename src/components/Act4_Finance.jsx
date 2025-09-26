import React, {useEffect, useState} from 'react';
import { doc, onSnapshot, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';

export default function Act4_Finance({team,user}){
  const [teamData, setTeamData] = useState(team);
  const [allocate, setAllocate] = useState(0);

  useEffect(()=>{
    const unsub = onSnapshot(doc(db,'teams',team.id),(s)=> setTeamData({id:s.id,...s.data()}));
    return ()=>unsub();
  },[team.id]);

  const allocateBudget = async ()=>{
    if(user.id !== teamData.ceoId) return alert('Apenas o CEO pode alocar orçamento');
    const cash = (teamData.cash||10000);
    if(allocate > cash) return alert('Valor maior que caixa disponível');
    // allocate reduces cash, increases investments and affects score
    await updateDoc(doc(db,'teams',team.id),{ cash: cash-allocate, investments: (teamData.investments||0)+allocate, score: (teamData.score||0) + Math.round(allocate/1000) });
    alert('Orçamento alocado');
  };

  return (
    <div className="card">
      <h3>ATO 4 — Finanças</h3>
      <div className="small">Caixa atual: R$ {teamData.cash||10000}</div>
      <div style={{marginTop:8}}>
        <input className="input" type="number" value={allocate} onChange={e=>setAllocate(Number(e.target.value))} placeholder="Valor para alocar" />
        <div style={{marginTop:8}}><button className="button" onClick={allocateBudget}>Alocar orçamento (apenas CEO)</button></div>
      </div>

      <div style={{marginTop:12}}>
        <h4>Resumo financeiro</h4>
        <div>Investimentos: R$ {teamData.investments||0}</div>
        <div>Pontuação atual: {teamData.score||0}</div>
      </div>
    </div>
  );
}