import React, {useState,useEffect} from 'react';
import { doc, onSnapshot, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';

const POSITIONS = [ 'Engenheiro(a) Back-end','Engenheiro(a) Front-end','Designer','Analista de Dados','Vendedor(a)','Suporte','Jurídico','RH' ];

export default function HiringStage({team,user}){
  const [reqs, setReqs] = useState([]);
  const [sel, setSel] = useState('');

  useEffect(()=>{
    const unsub = onSnapshot(doc(db,'teams',team.id),(s)=>{
      const data = s.data();
      setReqs(Object.entries(data.hiringRequests||{}));
    });
    return ()=>unsub();
  },[team.id]);

  const request = async ()=>{
    const field = `hiringRequests.${user.id}`;
    await updateDoc(doc(db,'teams',team.id),{ [field]: ( (team.hiringRequests && team.hiringRequests[user.id]) ? [...team.hiringRequests[user.id], sel] : [sel]) });
    alert('Solicitação enviada ao CEO');
  };

  return (
    <div className="card">
      <h3>Contratações iniciais</h3>
      <div className="small">Seu cargo: {team.positions?.[user.id] || 'Não definido'}</div>
      <div style={{marginTop:8}}>
        <select className="input" value={sel} onChange={e=>setSel(e.target.value)}>
          <option value="">-- escolher vaga --</option>
          {POSITIONS.map(p=> <option key={p} value={p}>{p}</option>)}
        </select>
        <div style={{marginTop:8}}>
          <button className="button" onClick={request}>Solicitar contratação</button>
        </div>
      </div>

      <div style={{marginTop:12}}>
        <h4>Solicitações enviadas</h4>
        {reqs.length ? reqs.map(([uid,list])=> (
          <div key={uid} className="card">
            <strong>{uid}</strong>
            <div className="small">{list.join(', ')}</div>
          </div>
        )) : <div>Nenhuma solicitação ainda.</div>}
      </div>
    </div>
  );
}