<script>
import {onMount} from 'svelte'
import {app,persist,load,add,remove,exportJSON,importJSON,portrait} from './lib/store.svelte.js'
import {log,rollCheck} from './lib/log.svelte.js'
import {SKILLS,CATEGORIES} from './lib/skills.js'
import {ST,RULESETS,statBonus,statTotal,skillTotal,rs} from './lib/rules.js'
let tab=$state('Sheet'),impEl,picEl,cat=$state(CATEGORIES[0]),pick=$state('')
let q=$state(''),hide0=$state(false)
const rows=$derived.by(()=>{if(!c)return[];const f=q.trim().toLowerCase();let prev;const out=[]
  c.skills.forEach((k,i)=>{const nm=k.name||'';if(nm&&((f&&!nm.toLowerCase().includes(f))||(hide0&&!(+k.ranks>0))))return
    const g=k.cat||'Custom';out.push({k,i,head:g!==prev?g:null});prev=g});return out})
const inCat=$derived(SKILLS.filter(s=>s[0]===cat))
const addPreset=()=>{const s=SKILLS.find(x=>x[0]===cat&&x[1]===pick);if(s)c.skills.push({name:s[1],cat:s[0],stats:[...s[2]],ranks:0,other:0});pick=''}
const fmt=n=>n>0?'+'+n:n
onMount(load)
const c=$derived(app.chars.find(x=>x.id===app.cur))
$effect(()=>{if(!c)return;JSON.stringify(c);const t=setTimeout(()=>persist(c),300);return()=>clearTimeout(t)})
const weight=$derived(c?c.items.reduce((s,i)=>s+(+i.qty||0)*(+i.wt||0),0):0)
</script>
<header>
  <select style="flex:1;min-width:130px" bind:value={app.cur}>{#each app.chars as x}<option value={x.id}>{x.name}</option>{/each}</select>
  <button class="p" onclick={add}>+ New</button>
  <button onclick={()=>c&&exportJSON(false)}>Export</button>
  <button onclick={()=>exportJSON(true)}>Export all</button>
  <button onclick={()=>impEl.click()}>Import</button>
  <button class="d" onclick={remove}>Delete</button>
  <input type="file" accept=".json" hidden bind:this={impEl} onchange={async e=>{try{await importJSON(e.target.files[0])}catch{alert('Not a valid character file.')}e.target.value=''}}>
</header>
<main>
{#if !c}<div class="card">{app.ready?'No characters yet. Tap + New.':'Loading…'}</div>{:else}
<nav>{#each ['Sheet','Skills','Gear','Notes'] as t}<button class:on={tab===t} onclick={()=>tab=t}>{t}</button>{/each}</nav>
{#if tab==='Sheet'}
<div class="card"><h3>Character</h3><div class="g">
<label>Name<input bind:value={c.name}></label><label>Player<input bind:value={c.player}></label><label>Race<input bind:value={c.race}></label><label>Profession<input bind:value={c.prof}></label>
<label>Level<input type="number" bind:value={c.level}></label><label>XP<input type="number" bind:value={c.xp}></label>
<label>Ruleset<select bind:value={c.ruleset}>{#each Object.entries(RULESETS) as [k,r]}<option value={k}>{r.name}</option>{/each}</select></label></div></div>
<div class="card"><h3>Combat</h3><div class="g">
<label>Hits<input type="number" bind:value={c.hp}></label><label>Max hits<input type="number" bind:value={c.hpMax}></label><label>Power pts<input type="number" bind:value={c.pp}></label><label>Max PP<input type="number" bind:value={c.ppMax}></label>
<label>OB<input type="number" bind:value={c.ob}></label><label>DB<input type="number" bind:value={c.db}></label><label>AT<input type="number" bind:value={c.at}></label></div></div>
<div class="card"><h3>Stats</h3><div class="w"><table><thead><tr><th></th><th>Temp</th><th>Pot</th><th>Norm</th><th>Race</th><th>Misc</th><th>Total</th><th></th></tr></thead><tbody>
{#each ST as [k,n]}<tr><td title={n}><b style="color:var(--tx)">{k}</b></td><td><input type="number" bind:value={c.stats[k].t}></td><td><input type="number" bind:value={c.stats[k].p}></td>
<td class="n">{fmt(statBonus(rs(c),c.stats[k].t))}</td><td><input type="number" bind:value={c.stats[k].r}></td><td><input type="number" bind:value={c.stats[k].m}></td><td class="n">{fmt(statTotal(c,k))}</td><td><button class="p" onclick={()=>rollCheck(n,statTotal(c,k),'stat')}>Roll</button></td></tr>{/each}</tbody></table></div></div>
{:else if tab==='Skills'}
<div class="card"><h3>Skills</h3><p><input type="search" placeholder="Filter skills…" bind:value={q}> <label style="display:inline"><input type="checkbox" bind:checked={hide0}> Hide skills with 0 ranks</label> <span class="mu" style="margin-left:12px">{rows.length} of {c.skills.length} shown</span></p><div class="w"><table><thead><tr><th>Skill</th><th>Stat 1</th><th>Stat 2</th><th>Stat 3</th><th>Ranks</th><th>Other</th><th>Total</th><th></th><th></th></tr></thead><tbody>
{#each rows as {k,i,head} (i)}{#if head}<tr class="cat"><td colspan="9">{head}</td></tr>{/if}<tr><td><input bind:value={k.name}></td>
{#each [0,1,2] as j}<td><select value={k.stats[j]??''} onchange={e=>{const v=[0,1,2].map(n=>n===j?e.target.value:k.stats[n]??'');k.stats=v.filter(Boolean)}}><option value="">–</option>{#each ST as s}<option>{s[0]}</option>{/each}</select></td>{/each}
<td><input type="number" bind:value={k.ranks}></td><td><input type="number" bind:value={k.other}></td><td class="n">{fmt(skillTotal(c,k))}</td>
<td><button class="p" onclick={()=>rollCheck(k.name,skillTotal(c,k))}>Roll</button></td>
<td><button class="d" onclick={()=>c.skills.splice(i,1)}>×</button></td></tr>{/each}</tbody></table></div>
<p><select bind:value={cat}>{#each CATEGORIES as g}<option>{g}</option>{/each}</select> <select bind:value={pick}><option value="">Preset skill…</option>{#each inCat as s}<option>{s[1]}</option>{/each}</select> <button onclick={addPreset} disabled={!pick}>Add preset</button> &nbsp; <button class="p" onclick={()=>c.skills.push({name:'',stats:[],ranks:0,other:0})}>+ Skill</button></p>
<p class="mu">Rank and stat bonuses come from the ruleset in src/lib/rules.js. A skill's 1–3 stats are averaged (rounded half away from zero); repeat a stat to weight it.</p></div>
{:else if tab==='Gear'}
<div class="card"><h3>Equipment</h3><div class="w"><table><thead><tr><th>Item</th><th>Qty</th><th>Wt</th><th>Notes</th><th></th></tr></thead><tbody>
{#each c.items as k,i}<tr><td><input bind:value={k.name}></td><td><input type="number" bind:value={k.qty}></td><td><input type="number" bind:value={k.wt}></td><td><input bind:value={k.note}></td>
<td><button class="d" onclick={()=>c.items.splice(i,1)}>×</button></td></tr>{/each}</tbody></table></div>
<p><button class="p" onclick={()=>c.items.push({name:'',qty:1,wt:0,note:''})}>+ Item</button> &nbsp; Total weight: <b>{weight}</b></p></div>
{:else}
<div class="card"><h3>Portrait</h3>{#if c.portrait}<img class="pt" src={c.portrait} alt="">{/if}
<button onclick={()=>picEl.click()}>{c.portrait?'Change':'Add'} picture</button>{#if c.portrait} <button class="d" onclick={()=>c.portrait=''}>Remove</button>{/if}
<input type="file" accept="image/*" hidden bind:this={picEl} onchange={e=>{portrait(e.target.files[0],c);e.target.value=''}}></div>
<div class="card"><h3>Notes</h3><textarea style="min-height:320px" bind:value={c.notes}></textarea></div>
{/if}{/if}
<p class="mu">Saved automatically in this browser. Use Export for backups.</p>
</main>
<aside class="log" class:big={log.big}>
  <div class="lh"><b>Log</b> <label>Situation <input type="number" class="sit" bind:value={log.sit}></label> <label><input type="checkbox" bind:checked={log.open}> Open-ended</label>
    <span style="flex:1"></span><button onclick={()=>log.rows.length=0} disabled={!log.rows.length}>Clear</button> <button onclick={()=>log.big=!log.big}>{log.big?'Show 4':'Show 20'}</button></div>
  <div class="lr">{#each log.rows as r (r.id)}<div class="row"><span class="tot">{r.total}</span><span class="tx"><b>{r.title}</b><small>{r.detail}</small></span></div>{:else}<div class="row mu">No entries yet.</div>{/each}</div>
</aside>
