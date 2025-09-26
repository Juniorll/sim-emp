import React, {useEffect, useState} from 'react';
import { doc, onSnapshot, updateDoc, arrayUnion, arrayRemove, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import Act1_Test from './Act1_Test';
import ProfilesView from './ProfilesView';
import SegmentVote from './SegmentVote';
import CEOElection from './CEOElection';
import CEOActions from './CEOActions';
import HiringStage from './HiringStage';
import Report from './Report';
import Act2_Market from './Act2_Market';
import Act3_Operations from './Act3_Operations';
import Act4_Finance from './Act4_Finance';
import Act5_Final from './Act5_Final';
import { TEAM_MIN, TEAM_MAX } from '../config';

export default function TeamView({user,teamId,onLeave}){
  const [team, setTeam] = useState(null);
  const [localUser, setLocalUser] = useState(null);

  useEffect(()=>{
    const ref = doc(db,'teams',teamId);
    const unsub = onSnapshot(ref,snap=>{ setTeam({id:snap.id,...snap.data()}); });
    return ()=>unsub();
  },[teamId]);

  useEffect(()=>{
    // load user doc local copy
    (async ()=>{
      const udoc = await getDoc(doc(db,'users',user.id));
      if(udoc.exists()) setLocalUser(udoc.data());
      else setLocalUser({id:user.id,name:'Aluno'});
    })();
  },[user.id]);

  if(!team) return <div className="container">Carregando equipe...</div>;

  const isCreator = team.creatorId === user.id;
  const isMember = team.members?.includes(user.id);

  const join = async ()=>{
    if(team.members?.length >= team.maxSize) return alert('Equipe cheia');
    await updateDoc(doc(db,'teams',team.id),{ members: arrayUnion(user.id) });
  };

  const leave = async ()=>{
    await updateDoc(doc(db,'teams',team.id),{ members: arrayRemove(user.id) });
    onLeave();
  };

  return (
    <div className="container">
      <div className="header">
        <h3>{team.name}</h3>
        <div>
          <button className="button" onClick={onLeave}>Voltar</button>
        </div>
      </div>

      <div className="card">
        <div className="small">Membros: {team.members?.length||0} (min {team.minSize} - max {team.maxSize})</div>
        {!isMember && <div style={{marginTop:8}}><button className="button" onClick={join}>Entrar na equipe</button></div>}
        {isMember && <div style={{marginTop:8}}><button className="button" onClick={leave}>Sair da equipe</button></div>}
      </div>

      {/* Roteamento simples de atos via team.state */}
      {team.state === 'lobby' && isMember && <Act1_Test user={user} team={team} />}
      {team.state === 'act1' && <ProfilesView team={team} user={user} />}
      {team.state === 'segmentVote' && <SegmentVote team={team} user={user} />}
      {team.state === 'ceoElection' && <CEOElection team={team} user={user} />}
      {team.state === 'ceoActions' && <CEOActions team={team} user={user} />}
      {team.state === 'hiring' && <HiringStage team={team} user={user} />}
      {team.state === 'act2' && <Act2_Market team={team} user={user} />}
      {team.state === 'act3' && <Act3_Operations team={team} user={user} />}
      {team.state === 'act4' && <Act4_Finance team={team} user={user} />}
      {team.state === 'act5' && <Act5_Final team={team} user={user} />}
      {team.state === 'report' && <Report team={team} user={user} />}

      <div style={{marginTop:12}} className="card">
        <small className="small">(Estado atual: {team.state})</small>
      </div>
    </div>
  );
}