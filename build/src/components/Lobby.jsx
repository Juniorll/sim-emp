import React, {useEffect, useState} from 'react';
import { collection, addDoc, onSnapshot, doc, updateDoc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import TeamCreator from './TeamCreator';
import TeamView from './TeamView';

export default function Lobby({user,onLogout}){
  const [teams, setTeams] = useState([]);
  const [viewTeam, setViewTeam] = useState(null);

  useEffect(()=>{
    const unsub = onSnapshot(collection(db,'teams'), (snap)=>{
      const arr = snap.docs.map(d=>({id:d.id,...d.data()}));
      setTeams(arr);
    });
    return ()=>unsub();
  },[]);

  return (
    <div className="container">
      <div className="header">
        <h2>Lobby — Bem vindo</h2>
        <div>
          <button className="button" onClick={onLogout}>Sair</button>
        </div>
      </div>

      {!viewTeam && (
        <div>
          <TeamCreator user={user} onEnter={setViewTeam} />

          <h3>Equipes existentes</h3>
          <div className="list">
            {teams.map(t=> (
              <div key={t.id} className="card">
                <strong>{t.name}</strong>
                <div className="small">Membros: {t.members?.length||0} — Estado: {t.state||'lobby'}</div>
                <div style={{marginTop:8}}>
                  <button className="button" onClick={()=>setViewTeam(t.id)}>Entrar</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {viewTeam && <TeamView user={user} teamId={viewTeam} onLeave={()=>setViewTeam(null)} />}
    </div>
  );
}