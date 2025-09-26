import React, {useState} from 'react';
import { addDoc, collection, doc, setDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { TEACHER_PASSWORD } from '../config';

export default function Auth({onLogin, onTeacher}){
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [pwd, setPwd] = useState('');

  const handleLogin = async ()=>{
    const uid = 'u_'+Math.random().toString(36).slice(2,9);
    const user = { id: uid, name: name || ('Aluno '+uid.slice(-4)), email };
    await setDoc(doc(db,'users',uid), user);
    onLogin(user);
  };

  const loginTeacher = ()=>{
    if(pwd === TEACHER_PASSWORD) onTeacher();
    else alert('Senha incorreta');
  };

  return (
    <div className="container">
      <h2>Entrar no Simulador</h2>
      <div className="card">
        <label>Nome</label>
        <input className="input" value={name} onChange={e=>setName(e.target.value)} placeholder="Seu nome" />
        <label style={{marginTop:8}}>E-mail (opcional)</label>
        <input className="input" value={email} onChange={e=>setEmail(e.target.value)} placeholder="seu@exemplo.com" />
        <div style={{marginTop:8}}>
          <button className="button" onClick={handleLogin}>Entrar como Aluno</button>
        </div>
      </div>

      <div style={{marginTop:16}} className="card">
        <h4>Painel do Professor</h4>
        <input className="input" value={pwd} onChange={e=>setPwd(e.target.value)} placeholder="senha do professor" />
        <div style={{marginTop:8}}>
          <button className="button" onClick={loginTeacher}>Entrar como Professor</button>
        </div>
      </div>
    </div>
  );
}