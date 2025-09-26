import React, {useEffect, useState} from 'react';
import { doc, updateDoc, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';

export default function CEOElection({team,user}){
  const [teamData, setTeamData] = useState(team);
  const [vote, setVote] = useState(null);

  useEffect(()=>{
    const unsub = onSnapshot(doc(db,'teams',team.id),(s)=> setTeamData({id:s.id,...s.data()}));
    return ()=>unsub();
  },[team.id]);

  const submitVote = async ()=>{
    if(!vote) return alert('Escolha alguém');
    await updateDoc(doc(db,'teams',team.id),{ [`ceoVotes.${user.id}`]: vote });
  };

  const apurar = async ()=>{
    const snap = await (await import('firebase/firestore')).getDoc(doc(db,'teams',team.id));
    const data = snap.data();
    const votes = data.ceoVotes || {};
    const counts = {};
    Object.values(votes).forEach(v=> counts[v] = (counts[v]||0)+1);
    // majority
    let winner=null,max=0; let total=Object.keys(votes).length;
    Object.entries(counts).forEach(([k,c])=>{ if(c>max){max=c; winner=k} });
    if(max <= (total/2)){
      // no majority
      const rounds = (data.ceoRounds||0)+1;
      await updateDoc(doc(db,'teams',team.id),{ ceoRounds: rounds });
      alert('Sem maioria — repitam a votação. Penalidade aplicada.');
      return;
    }
    await updateDoc(doc(db,'teams',team.id),{ ceoId: winner, state:'ceoActions' });
  };

  return (
    <div className="card">
      <h3>Eleição do CEO (votação secreta)</h3>
      <div className="small">Membros: {team.members?.join(', ')}</div>
      <div style={{marginTop:8}}>
        <label>Escolha (use id do membro)</label>
        <input className="input" value={vote||''} onChange={e=>setVote(e.target.value)} placeholder="id do membro" />
        <div style={{marginTop:8}}>
          <button className="button" onClick={submitVote}>Votar</button>
        </div>
      </div>

      <div style={{marginTop:12}}>
        <button className="button" onClick={apurar}>Apurar votação</button>
      </div>
    </div>
  );
}