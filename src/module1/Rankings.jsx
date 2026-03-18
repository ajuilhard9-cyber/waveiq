import { gradeScore, gradeLabel, gradeColor, gradeBg } from '../data/spots';
import { MONTHS, RC } from '../shared/theme';

export default function Rankings({ spots, sport, month, selectedId, onSelect, T }) {
  const ranked = spots
    .map(s => ({...s, score: gradeScore(s, sport, month), grade: gradeLabel(gradeScore(s, sport, month))}))
    .sort((a,b) => b.score - a.score);

  return (
    <div>
      <div style={{fontSize:9,color:T.sub,letterSpacing:2.5,marginBottom:12,fontWeight:600}}>
        RANKINGS · {MONTHS[month].toUpperCase()} · {sport.toUpperCase()}
      </div>
      {ranked.map((s, i) => {
        const sel = s.id === selectedId;
        const col = gradeColor(s.grade);
        const bg  = gradeBg(s.grade);
        const rc  = RC[s.region] || "#6366f1";
        return (
          <div key={s.id} onClick={() => onSelect(s)}
            style={{display:"flex",alignItems:"center",gap:12,padding:"11px 14px",borderRadius:14,marginBottom:6,cursor:"pointer",background:sel?T.hi:T.card,border:"1.5px solid "+(sel?"#6366f1":T.border),boxShadow:sel?T.shadowHover:T.shadow,transition:"all .15s"}}>
            <div style={{fontSize:12,fontWeight:700,color:T.sub,width:18,textAlign:"center"}}>#{i+1}</div>
            <div style={{width:8,height:8,borderRadius:"50%",background:rc,flexShrink:0}}/>
            <div style={{flex:1,minWidth:0}}>
              <div style={{fontWeight:700,fontSize:13,fontFamily:"Syne,sans-serif",color:T.text,letterSpacing:-0.2,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{s.name}</div>
              <div style={{fontSize:10,color:T.sub}}>{s.country}</div>
            </div>
            <div style={{background:bg,borderRadius:8,padding:"3px 10px",fontSize:13,fontWeight:900,fontFamily:"Syne,sans-serif",color:col}}>{s.grade}</div>
          </div>
        );
      })}
    </div>
  );
}
