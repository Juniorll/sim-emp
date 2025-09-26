import React, {useEffect, useState} from 'react';
import { SEGMENTS } from '../config';
import { doc, updateDoc, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';

export default function SegmentVote({team,user}){
  const [teamData, setTeamData] = useState(team);
  useEffect(()=>{
    const unsub = onSnapshot(doc(db,'teams',team.id),(s)=> setTeamData({id:s.id,...s.data()}));
    return ()=>unsub();
  },[team.id]);

  const vote = async (sid)=>{
    // store vote under team.segmentVotes.userId
    const field = `segmentVotes.${user.id}`;
    await updateDoc(doc(db,'teams',team.id),{ [field]: sid });
  };

  const tallyAndAdvance = async ()=>{
    // compute counts locally then set winner and advance state
    const snap = (await (await import('firebase/firestore')).getDoc(doc(db,'teams',team.id)));
    const data = snap.data();
    const votes = data.segmentVotes || {};
    const counts = {};
    Object.values(votes).forEach(v=> counts[v] = (counts[v]||0)+1);
    let winner = null; let max=0; let tie=false;
    Object.entries(counts).forEach(([k,c])=>{ if(c>max){max=c; winner=k; tie=false} else if(c===max){ tie=true } });
    if(tie) {
      // penalty: increase repeats
      const repeats = (data.segmentRepeats||0)+1;
      await updateDoc(doc(db,'teams',team.id),{ segmentRepeats: repeats });
      alert('Houve empate. Refaçam a votação. Penalidade aplicada.');
      return;
    }
    await updateDoc(doc(db,'teams',team.id),{ selectedSegment: winner, state:'ceoElection' });
  };

  return (
    <div className="card">
      <h3>Escolha do segmento</h3>
      {SEGMENTS.map(s=> (
        <div key={s.id} className="card">
          <strong>{s.title}</strong>
          <div className="small">{s.description}</div>
          <div className="small">Necessidades: {s.needs.join(', ')}</div>
          <div style={{marginTop:8}}>
            <button className="button" onClick={()=>vote(s.id)}>Votar neste segmento</button>
          </div>
        </div>
      ))}
      <div style={{marginTop:8}}>
        <button className="button" onClick={tallyAndAdvance}>Apurar votação</button>
      </div>
    </div>
  );
}