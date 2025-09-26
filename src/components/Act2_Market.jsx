import React, {useEffect, useState} from 'react';
import { doc, onSnapshot, updateDoc, getDoc, arrayRemove } from 'firebase/firestore';
import { db } from '../firebase';
import { simulateMarketTurn } from '../gameLogic';

export default function Act2_Market({team,user}){
  const [teamData, setTeamData] = useState(team);
  const [log, setLog] = useState([]);

  useEffect(()=>{
    const unsub = onSnapshot(doc(db,'teams',team.id),(s)=> setTeamData({id:s.id,...s.data()}));
    return ()=>unsub();
  },[team.id]);

  const runMarket = async ()=>{
    const snap = await getDoc(doc(db,'teams',team.id));
    const data = snap.data();
    const { event, scoreDelta } = simulateMarketTurn(data);
    const updates = {
      marketEvents: [...(data.marketEvents||[]), event],
      score: (data.score||0) + scoreDelta
    };
    await updateDoc(doc(db,'teams',team.id), updates);
    setLog(l=>[event,...l]);
  };

  const requestCEOChange = async ()=>{
    await updateDoc(doc(db,'teams',team.id),{ ceoChangeRequest: (teamData.ceoChangeRequest||0)+1 });
    alert('Pedido de troca de CEO registrado. O professor/CEO pode iniciar votação.');
  };

  const resign = async ()=>{
    // member quits
    if(!confirm('Deseja pedir demissão desta equipe?')) return;
    await updateDoc(doc(db,'teams',team.id),{ members: arrayRemove(user.id) });
    alert('Você saiu da equipe.');
  };

  return (
    <div className="card">
      <h3>ATO 2 — Mercado & Simulação</h3>
      <p>Rodar uma simulação de mercado para ver vendas, receita e lucro. O CEO pode executar a simulação.</p>
      <div className="small">CEO: {teamData.ceoId || 'não definido'}</div>
      <div style={{marginTop:8}}>
        <button className="button" onClick={runMarket}>Executar turno de mercado</button>
        <button className="button" style={{marginLeft:8}} onClick={requestCEOChange}>Pedir troca de CEO</button>
        <button className="button" style={{marginLeft:8}} onClick={resign}>Pedir demissão</button>
      </div>
      <div style={{marginTop:12}}>
        <h4>Eventos recentes</h4>
        { (teamData.marketEvents||[]).slice().reverse().map((e,i)=> (
          <div key={i} className="card">
            <div className="small">{e.time}</div>
            <div>Vendas: {e.sales} — Receita: R$ {e.revenue} — Lucro: R$ {e.profit}</div>
            <div className="small">{e.note}</div>
          </div>
        ))}
      </div>
    </div>
  );
}