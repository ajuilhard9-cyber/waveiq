import { gradeScore, gradeLabel, gradeColor } from '../data/spots';
import { MONTHS } from '../shared/theme';

export default function MonthChart({ spot, sport, currentMonth, onMonthSelect, T }) {
  const scores = MONTHS.map((_,m) => ({m, score:gradeScore(spot,sport,m), grade:gradeLabel(gradeScore(spot,sport,m))}));
  const max = 5;
  return (
    <div>
      <div style={{fontSize:9,color:T.sub,letterSpacing:2,marginBottom:10,fontWeight:600,fontFamily:"DM Sans,sans-serif"}}>MONTHLY — {sport.toUpperCase()}</div>
      <div style={{display:"flex",alignItems:"flex-end",gap:3,height:60,marginBottom:6}}>
        {scores.map(({m,score,grade}) => {
          const h   = Math.round((score/max)*52);
          const sel = m === currentMonth;
          const col = gradeColor(grade);
          return (
            <div key={m} onClick={()=>onMonthSelect(m)} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:2,cursor:"pointer"}}>
              <div style={{width:"100%",height:h,borderRadius:2,background:sel?col:col+"44",transition:"all .15s",minHeight:3}}/>
              <div style={{fontSize:7,color:sel?col:T.sub,fontWeight:sel?700:400,fontFamily:"DM Mono,monospace"}}>{MONTHS[m][0]}</div>
            </div>
          );
        })}
      </div>
      <div style={{display:"flex",flexWrap:"wrap",gap:3}}>
        {scores.map(({m,grade})=>{
          const sel = m===currentMonth;
          const col = gradeColor(grade);
          return (
            <div key={m} onClick={()=>onMonthSelect(m)} style={{fontSize:9,fontWeight:700,fontFamily:"DM Mono,monospace",color:sel?"white":col,background:sel?col:col+"22",padding:"2px 5px",borderRadius:3,cursor:"pointer",border:`1px solid ${col}44`}}>
              {MONTHS[m].slice(0,3)} {grade}
            </div>
          );
        })}
      </div>
    </div>
  );
}
