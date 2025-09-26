import React, {useEffect, useState} from 'react';
import { doc, onSnapshot, updateDoc, collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import { SEGMENTS } from '../config';
import { segmentFitScore } from '../gameLogic';

export default function Act5_Final({team,user}){
  const [teamData, setTeamData] = useState(team);
  const [summary, setSummary] = useState(null);

  useEffect(()=>{
    const unsub = onSnapshot(doc(db,'teams',team.id),(s)=> setTeamData({id:s.id,...s.data()}));
    return ()=>unsub();
  },[team.id]);

  const finalize = async ()=>{
    const segment = SEGMENTS.find(s=>s.id===teamData.selectedSegment) || SEGMENTS[0];
    const fit = segmentFitScore(teamData.profiles||{}, segment);
    const finalScore = (teamData.score||0) + fit;
    await updateDoc(doc(db,'teams',team.id),{ finalScore, state:'finished' });
    setSummary({fit,finalScore});
  };

  return (
    <div className="card">
      <h3>ATO 5 — Simulação Final</h3>
      <p>Quando a Equipe finalizar, o sistema calculará o ajuste final baseado no fit com o segmento e exibirá o resultado.</p>
      <div style={{marginTop:8}}>
        <button className="button" onClick={finalize}>Finalizar ATO 5 (Calcular resultado)</button>
      </div>
      {summary && (
        <div style={{marginTop:12}} className="card">
          <div>Fit do segmento: {summary.fit}</div>
          <div>Score final: {summary.finalScore}</div>
        </div>
      )}
      <div style={{marginTop:12}} className="small">Estado atual: {teamData.state}</div>
    </div>
  );
}