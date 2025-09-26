import React, {useEffect, useState} from 'react';
import { doc, onSnapshot, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';

export default function Report({team,user}){
  const [teamData, setTeamData] = useState(team);
  useEffect(()=>{
    const unsub = onSnapshot(doc(db,'teams',team.id),(s)=> setTeamData({id:s.id,...s.data()}));
    return ()=>unsub();
  },[team.id]);

  const restart = async ()=>{
    if(!confirm('Zerar jogo para esta equipe?')) return;
    await updateDoc(doc(db,'teams',team.id),{ state:'lobby', profiles:{}, segmentVotes:{}, ceoVotes:{}, positions:{}, hiringRequests:{}, score:0 });
  };

  return (
    <div className="card">
      <h3>Relatório do ATO 1</h3>
      <div className="small">Pontuação atual: {teamData.score || 0}</div>
      <div style={{marginTop:8}}>
        <button className="button" onClick={restart}>Zerar equipe (apenas para testes)</button>
      </div>
    </div>
  );
}