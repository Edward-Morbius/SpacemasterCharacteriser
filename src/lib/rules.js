import {SKILLS} from './skills.js'
// Rulesets are data. Add a new one here (or load from JSON) without touching the UI.
export const ST=[['CO','Constitution'],['AG','Agility'],['SD','Self Discipline'],['ME','Memory'],['RE','Reasoning'],['ST','Strength'],['QU','Quickness'],['PR','Presence'],['EM','Empathy'],['IN','Intuition']]
export const RULESETS={
  current:{name:'Current house rules',
    // [highest stat value in band, bonus]. Smoothed Stat Bonus Chart (Spacemaster Companion), 1-100.
    // Values above 100 are not in the chart; 101+ keeps the earlier placeholder extension.
    statTable:[[1,-25],[2,-23],[3,-21],[4,-19],[5,-17],[6,-15],[7,-14],[8,-13],[9,-12],[10,-11],
      [12,-10],[15,-9],[18,-8],[21,-7],[24,-6],[26,-5],[28,-4],[32,-3],[36,-2],[40,-1],[59,0],
      [63,1],[67,2],[71,3],[74,4],[77,5],[80,6],[83,7],[86,8],[89,9],[90,10],[91,11],[92,12],
      [93,13],[94,14],[95,15],[96,17],[97,19],[98,21],[99,23],[100,25],[101,30],[999,35]],
    // Same chart, other columns (not used in calculations yet): [highest stat value in band, development points, psion power points]
    statDevPP:[[1,1.0,0],[2,1.3,0],[3,1.6,0],[4,1.8,0],[5,2.0,0],[6,2.2,0],[7,2.4,0],[8,2.6,0],[9,2.7,0],[10,2.8,0],
      [12,2.9,0],[15,3.0,0],[18,3.3,0],[21,3.6,0],[24,3.8,0],[26,4.0,0],[28,4.3,0],[32,4.6,0],[36,4.8,0],[40,5.0,0],[59,5.5,0],
      [63,6.0,0.2],[67,6.3,0.4],[71,6.6,0.6],[74,6.8,0.8],[77,7.0,1.0],[80,7.4,1.1],[83,7.7,1.2],[86,8.0,1.3],[89,8.2,1.4],
      [90,8.5,1.5],[91,8.6,1.6],[92,8.7,1.7],[93,8.8,1.8],[94,8.9,1.9],[95,9.0,2.0],[96,9.2,2.2],[97,9.4,2.4],[98,9.6,2.6],[99,9.8,2.8],[100,10.0,3.0]],
    // [ranks up to, bonus per rank in that band]
    rankSteps:[[10,5],[20,2],[30,1],[Infinity,0.5]],
    zero:-25, levelBonus:false}}
export const statBonus=(rs,v)=>{v=+v||0;for(const[m,b]of rs.statTable)if(v<=m)return b;return 0}
export function rankBonus(rs,r){r=+r||0;if(r<=0)return rs.zero;let t=0,prev=0;for(const[m,b]of rs.rankSteps){const n=Math.min(r,m)-prev;if(n>0)t+=n*b;prev=m;if(r<=m)break}return Math.floor(t)}
// Development / psion power points for a stat value (null above the chart's 100).
export const statDevPP=(r,v)=>{v=+v||0;for(const[m,d,p]of r.statDevPP)if(v<=m)return{dev:d,pp:p};return null}
export const rs=c=>RULESETS[c.ruleset]||RULESETS.current
export const statTotal=(c,k)=>c.stats[k]?statBonus(rs(c),c.stats[k].t)+(+c.stats[k].r||0)+(+c.stats[k].m||0):0
// Stat bonus for a skill: the average of its 1-3 stat totals, rounded half away from zero (as the sheet's ROUND does).
export function skillStat(c,st){const l=(st||[]).filter(Boolean);if(!l.length)return 0
  const sum=l.reduce((s,k)=>s+statTotal(c,k),0),q=Math.floor(Math.abs(sum)/l.length+0.5);return sum<0?-q:q}
export const skillTotal=(c,k)=>rankBonus(rs(c),k.ranks)+skillStat(c,k.stats)+(+k.other||0)
export const SCHEMA=2
export const newChar=()=>({id:'c'+Date.now()+Math.random().toString(36).slice(2,5),schema:SCHEMA,ruleset:'current',name:'New Character',player:'',race:'',prof:'',level:1,xp:0,hp:0,hpMax:0,pp:0,ppMax:0,ob:0,db:0,at:1,
  stats:Object.fromEntries(ST.map(s=>[s[0],{t:50,p:50,r:0,m:0}])),skills:SKILLS.map(([cat,name,stats])=>({name,cat,stats:[...stats],ranks:0,other:0})),items:[],notes:'',portrait:''})
// Hook for future schema changes: upgrade old exports here.
export function migrate(c){c.schema??=1
  if(c.schema<2){for(const k of c.skills||[]){k.stats=[k.s1,k.s2].filter(Boolean);delete k.s1;delete k.s2};c.schema=2} // v2: 1-3 stats per skill
  return{...newChar(),...c}}
// d100 roll. Open-ended: 96-100 rolls again and adds (repeating while 96+); 01-05 rolls once more and subtracts.
export function d100(open=true,rnd=()=>1+Math.floor(Math.random()*100)){const rolls=[rnd()];let value=rolls[0]
  if(open){if(rolls[0]>=96){let n;do{n=rnd();rolls.push(n);value+=n}while(n>=96)}else if(rolls[0]<=5){const n=rnd();rolls.push(n);value-=n}}
  return{rolls,value}}
