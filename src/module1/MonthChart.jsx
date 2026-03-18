import { gradeScore, gradeLabel, gradeColor } from '../data/spots';
import { MONTHS } from '../shared/theme';

export default function MonthChart({ spot, sport, currentMonth, onMonthSelect, T }) {
  const scores = MONTHS.map((_,m) => ({m, score: gradeScore(spot, sport, m), grade: gradeLabel(gradeScore(spot, sport, m))}));
  const maxScore = 5;
  return (
    <div>
      <div style={{fontSize:9,color:T.sub,letterSpacing:2.5,marginBottom:12,fontWeight:600}}>MONTHLY BREAKDOWN — {sport.toUpperCase()}</div>
      <div style={{display:"flex",alignItems:"flex-end",gap:4,height:72}}>
        {scores.map(({m, score, grade}) => {
          const h = Math.round((score/maxScore)*64);
          const sel = m === currentMonth;
          const col = gradeColor(grade);
          return (
            <div key={m} onClick={() => onMonthSelect(m)} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:4,cursor:"pointer"}}>
              <div style={{width:"100%",height:h,borderRadius:"4px 4px 0 0",background:sel?col:col+"55",transition:"all .2s",boxShadow:sel?`0 0 8px ${col}66`:""}}/>
              <div style={{fontSize:8,color:sel?col:T.sub,fontWeight:sel?700:500,letterSpacing:0.3}}>{MONTHS[m].slice(0,1)}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
