import React, {useEffect, useState} from 'react';
import { collection, onSnapshot, doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { TEACHER_PASSWORD } from '../config';

export default function TeacherPanel({onLogout}){
  const [teams, setTeams] = useState([]);
  const [pwd, setPwd] = useState('');

  useEffect(()=>{
    const unsub = onSnapshot(collection(db,'teams'), snap=> setTeams(snap.docs.map(d=>({id:d.id,...d.data()}))));
    return ()=>unsub();
  },[]);

  const zeroAll = async ()=>{
    if(!confirm('Zerar todo o jogo (TODAS as equipes)?')) return;
    for(const t of teams){ await updateDoc(doc(db,'teams',t.id),{ state:'lobby', profiles:{}, segmentVotes:{}, ceoVotes:{}, positions:{}, hiringRequests:{}, score:0 }); }
    alert('Jogo zerado');
  };

  return (
    <div className="container">
      <div className="header">
        <h2>Painel do Professor</h2>
        <div><button className="button" onClick={onLogout}>Sair</button></div>
      </div>

      <div className="card">
        <h3>Equipes</h3>
        {teams.map(t=> (
          <div key={t.id} className="card">
            <strong>{t.name}</strong>
            <div className="small">Membros: {t.members?.length||0} — Estado: {t.state}</div>
          </div>
        ))}
        <div style={{marginTop:8}}>
          <button className="button" onClick={zeroAll}>Zerar tudo</button>
        </div>
      </div>
    </div>
  );
}