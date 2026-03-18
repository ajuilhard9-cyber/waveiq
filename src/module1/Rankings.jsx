import { gradeScore, gradeLabel, gradeColor, gradeBg } from '../data/spots';
import { MONTHS, RC } from '../shared/theme';

export default function Rankings({ spots, sport, month, selectedId, onSelect, T }) {
  const ranked = spots
    .map(s => ({...s, score:gradeScore(s,sport,month), grade:gradeLabel(gradeScore(s,sport,month))}))
    .sort((a,b) => b.score - a.score);

  return (
    <div>
      <div style={{fontSize:9,color:T.sub,letterSpacing:2,marginBottom:8,fontWeight:600,fontFamily:"DM Sans,sans-serif"}}>
        ALL SPOTS · {MONTHS[month].toUpperCase()}
      </div>
      {ranked.map((s,i) => {
        const sel = s.id === selectedId;
        const col = gradeColor(s.grade);
        const rc  = RC[s.region]||"#6366f1";
        return (
          <div key={s.id} onClick={()=>onSelect(s)}
            style={{display:"flex",alignItems:"center",gap:8,padding:"7px 8px",borderRadius:4,marginBottom:2,cursor:"pointer",background:sel?T.hi:"transparent",borderLeft:`2px solid ${sel?rc:"transparent"}`,transition:"all .12s"}}>
            <div style={{fontSize:10,color:T.sub,width:16,textAlign:"right",fontFamily:"DM Mono,monospace",flexShrink:0}}>{i+1}</div>
            <div style={{flex:1,minWidth:0}}>
              <div style={{fontWeight:600,fontSize:12,color:T.text,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis",fontFamily:"DM Sans,sans-serif"}}>{s.name}</div>
              <div style={{fontSize:10,color:T.sub}}>{s.country}</div>
            </div>
            <div style={{fontSize:12,fontWeight:800,fontFamily:"DM Mono,monospace",color:col,background:col+"18",padding:"2px 7px",borderRadius:3,flexShrink:0}}>{s.grade}</div>
          </div>
        );
      })}
    </div>
  );
}
