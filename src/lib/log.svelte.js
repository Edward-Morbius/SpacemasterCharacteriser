import {d100} from './rules.js'
// Session log shown in the bottom panel (not saved with characters). Any action can add a row with logAdd({title,total,detail}).
export const log=$state({rows:[],big:false,sit:0,open:true})
let n=0
export function logAdd({title,total,detail=''}){log.rows.unshift({id:++n,title,total,detail});if(log.rows.length>100)log.rows.length=100}
const sg=v=>(v<0?'\u2212':'+')+Math.abs(v)
export function rollCheck(title,bonus){const r=d100(log.open),sit=+log.sit||0
  const die=r.rolls.length<2?''+r.rolls[0]:r.rolls[0]<=5?r.rolls[0]+'\u2212'+r.rolls[1]:r.rolls.join('+')
  logAdd({title:title||'(unnamed)',total:r.value+bonus+sit,detail:'d100 '+die+' \u00b7 skill '+sg(bonus)+(sit?' \u00b7 situation '+sg(sit):'')})}
