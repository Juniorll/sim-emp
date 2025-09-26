// Simple game logic utilities for scoring, compatibility and simulations
import { SEGMENTS, PROFILES } from './config';

export function profileCompatibility(profileType, idealProfile){
  // profileType: string like 'Tecnico'
  // idealProfile: object mapping profile ids to weights
  return idealProfile[profileType] || 0;
}

export function teamProfileDistribution(teamProfiles){
  // teamProfiles: map userId -> {type, scores}
  const dist = {};
  Object.values(teamProfiles || {}).forEach(p=>{
    dist[p.type] = (dist[p.type]||0) + 1;
  });
  const total = Object.values(dist).reduce((a,b)=>a+b,0) || 1;
  Object.keys(dist).forEach(k=> dist[k] = dist[k]/total );
  return dist;
}

export function segmentFitScore(teamProfiles, segment){
  // compute similarity between team distribution and segment.idealProfile
  const dist = teamProfileDistribution(teamProfiles);
  let score = 0;
  Object.entries(segment.idealProfile).forEach(([k,w])=>{
    score += (dist[k]||0) * w;
  });
  // normalize to 0..100 * baseMultiplier
  return Math.round(score * 100 * (segment.baseMultiplier||1));
}

// simple market simulation: given team and segment, return sales and event log
export function simulateMarketTurn(teamDoc){
  // teamDoc: firestore team data snapshot (object)
  const segmentId = teamDoc.selectedSegment;
  const segment = SEGMENTS.find(s=>s.id===segmentId) || SEGMENTS[0];
  const baseDemand = 50 + (Math.floor(Math.random()*50)); // random base
  const fit = segmentFitScore(teamDoc.profiles || {}, segment) / 100; // 0..1
  const teamSize = (teamDoc.members || []).length || 1;
  const executionFactor = Math.min(1, 0.2 * teamSize + fit * 0.8); // heuristic
  const sales = Math.round(baseDemand * executionFactor);
  const revenuePerSale = 1000 * (segment.baseMultiplier || 1);
  const revenue = sales * revenuePerSale;
  const cost = Math.round(revenue * (0.5 - fit*0.2)); // better fit -> lower cost
  const profit = revenue - cost;
  const event = {
    time: new Date().toISOString(),
    sales, revenue, cost, profit, note: `Simulação de mercado para ${segment.title}`
  };
  return { event, scoreDelta: Math.round(profit/100) };
}