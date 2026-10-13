import Dexie from 'dexie'
import {newChar,migrate,SCHEMA} from './rules.js'
const db=new Dexie('sm2');db.version(1).stores({chars:'id'})
export const app=$state({chars:[],cur:null,ready:false})
export const current=()=>app.chars.find(c=>c.id===app.cur)
export const persist=c=>db.chars.put($state.snapshot(c))
export async function load(){app.chars=(await db.chars.toArray()).map(c=>{if((c.schema??1)===SCHEMA)return c;const m=migrate(c);persist(m);return m});app.cur=app.chars[0]?.id??null;app.ready=true;try{navigator.storage?.persist?.()}catch{}}
export function add(){const c=newChar();app.chars.push(c);app.cur=c.id;persist(c)}
export function remove(){const c=current();if(!c||!confirm('Delete '+c.name+'?'))return;db.chars.delete(c.id);app.chars=app.chars.filter(x=>x.id!==c.id);app.cur=app.chars[0]?.id??null}
export function exportJSON(all){const list=all?app.chars:[current()];const a=document.createElement('a')
  a.href=URL.createObjectURL(new Blob([JSON.stringify({app:'sm2-sheets',schema:SCHEMA,characters:$state.snapshot(list)},null,2)],{type:'application/json'}))
  a.download=all?'spacemaster-all.json':(list[0].name||'character')+'.json';a.click()}
export async function importJSON(file){const j=JSON.parse(await file.text());for(const x of j.characters||[]){const c=migrate(x);c.id=newChar().id;app.chars.push(c);persist(c);app.cur=c.id}}
export function portrait(file,c){const r=new FileReader();r.onload=()=>{const i=new Image();i.onload=()=>{const s=Math.min(1,800/Math.max(i.width,i.height)),cv=document.createElement('canvas');cv.width=i.width*s;cv.height=i.height*s
  cv.getContext('2d').drawImage(i,0,0,cv.width,cv.height);c.portrait=cv.toDataURL('image/jpeg',.85)};i.src=r.result};r.readAsDataURL(file)}
