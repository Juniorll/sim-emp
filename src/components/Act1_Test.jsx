import React, {useState} from 'react';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { NUM_TEST_QUESTIONS, PROFILES } from '../config';

const QUESTIONS = [
  {id:1, text:'Gosto de liderar iniciativas', profile:'Lider'},
  {id:2, text:'Prefiro resolver problemas técnicos complexos', profile:'Tecnico'},
  {id:3, text:'Gosto de negociar e vender ideias', profile:'Comercial'},
  {id:4, text:'Sou atento a processos e rotinas', profile:'Organizador'},
  {id:5, text:'Tenho ideias criativas constantemente', profile:'Criativo'},
  {id:6, text:'Prefiro executar e apoiar operações', profile:'Operacional'},
  {id:7, text:'Gosto de coordenar pessoas', profile:'Lider'},
  {id:8, text:'Tenho facilidade com ferramentas e código', profile:'Tecnico'},
  {id:9, text:'Sou comunicativo e persuasivo', profile:'Comercial'},
  {id:10,text:'Gosto de estruturar processos e compliance', profile:'Organizador'}
];

export default function Act1_Test({user,team}){
  const [answers, setAnswers] = useState({});
  const [done, setDone] = useState(false);

  const setAnswer = (q,v)=> setAnswers(a=>({...a,[q]:v}));

  const submit = async ()=>{
    const counts = {};
    QUESTIONS.forEach(q=>{ const v = answers[q.id]||3; counts[q.profile] = (counts[q.profile]||0) + Number(v); });
    // normalize -> choose top profile
    const profileScores = Object.keys(counts).map(k=>({id:k,score:counts[k]}));
    profileScores.sort((a,b)=>b.score-a.score);
    const primary = profileScores[0].id;
    // save to user doc and to team.profiles
    await updateDoc(doc(db,'users',user.id),{ profile:{type:primary, scores:counts, createdAt:new Date().toISOString()} });

    // add to team.profiles map
    const teamRef = doc(db,'teams',team.id);
    await updateDoc(teamRef, { [`profiles.${user.id}`]: { type:primary, scores:counts, name: user.name || user.id } , state:'act1' });
    setDone(true);
  };

  if(done) return (
    <div className="card">
      <h4>Teste enviado</h4>
      <p>Aguarde os demais membros — quando o criador sinalizar que todos estão, avançaremos.</p>
    </div>
  );

  return (
    <div className="card">
      <h3>ATO 1 — Teste de perfil</h3>
      <p>Responda em uma escala de 1 (discordo) a 5 (concordo)</p>
