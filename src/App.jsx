import React, {useEffect, useState} from 'react';
import { ensureAnonymousLogin } from './firebase';
import Auth from './components/Auth';
import Lobby from './components/Lobby';
import TeacherPanel from './components/TeacherPanel';

export default function App(){
  const [user, setUser] = useState(null);
  const [isTeacher, setIsTeacher] = useState(false);

  useEffect(()=>{ ensureAnonymousLogin().then(u=>{ if(u) setUser({id:u.uid, anon:true}); }); },[]);

  if(!user) return <Auth onLogin={setUser} onTeacher={()=>setIsTeacher(true)} />;
  if(isTeacher) return <TeacherPanel onLogout={()=>{setIsTeacher(false); setUser(null);}} />;
  return <Lobby user={user} onLogout={()=>setUser(null)} />;
}