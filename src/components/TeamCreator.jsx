import React, {useState} from 'react';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { TEAM_MIN, TEAM_MAX } from '../config';

export default function TeamCreator({user,onEnter}){
  const [name, setName] = useState('');
  const [min, setMin] = useState(TEAM_MIN);
  const [max, setMax] = useState(TEAM_MAX);

  const create = async ()=>{
    if(!name) return alert('Informe um nome para a equipe');
    if(min<2 || max<min) return alert('Parametros min/max inválidos');
    const docRef = await addDoc(collection(db,'teams'),{
      name, creatorId:user.id, members:[user.id], minSize:min, maxSize:max, state:'lobby', createdAt: new Date().toISOString(), score:0
    });
    onEnter(docRef.id);
  };

  return (
    <div className="card">
      <h3>Criar equipe</h3>
      <input className="input" placeholder="Nome da equipe" value={name} onChange={e=>setName(e.target.value)} />
      <div style={{display:'flex',gap:8,marginTop:8}}>
        <div>
          <label>Min</label>
          <input className="input" type="number" value={min} onChange={e=>setMin(Number(e.target.value))} />
        </div>
        <div>
          <label>Max</label>
          <input className="input" type="number" value={max} onChange={e=>setMax(Number(e.target.value))} />
        </div>
      </div>
      <div style={{marginTop:8}}>
        <button className="button" onClick={create}>Criar</button>
      </div>
    </div>
  );
}