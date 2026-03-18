export default function Strip({ hourly, waveH, T }) {
  if (!hourly?.time) return null;
  const now = new Date();
  const items = hourly.time.map((t,i) => ({t:new Date(t), w:hourly.wind_speed_10m?.[i], wave:waveH?.[i]}))
    .filter(x => x.t >= now).slice(0, 12);
  const max = Math.max(...items.map(x => x.w||0));
  return (
    <div>
      <div style={{fontSize:9,color:T.sub,letterSpacing:2.5,marginBottom:12,fontWeight:600}}>24H FORECAST</div>
      <div style={{display:"flex",gap:6,overflowX:"auto",paddingBottom:4}}>
        {items.map((x,i) => {
          const n = i===0, hi = x.w===max;
          return (
            <div key={i} style={{flexShrink:0,width:54,background:n?"linear-gradient(160deg,#6366f1,#818cf8)":hi?T.hi:T.card,borderRadius:14,padding:"10px 4px",textAlign:"center",boxShadow:n?"0 8px 20px rgba(99,102,241,0.35)":T.shadow}}>
              <div style={{fontSize:7,color:n?"rgba(255,255,255,0.7)":T.sub,fontWeight:600,letterSpacing:0.5,marginBottom:3}}>{n?"NOW":x.t.getHours()+"h"}</div>
              <div style={{fontSize:18,fontWeight:800,fontFamily:"Syne,sans-serif",color:n?"white":hi?"#6366f1":T.text}}>{Math.round(x.w||0)}</div>
              <div style={{fontSize:7,color:n?"rgba(255,255,255,0.55)":T.sub,marginBottom:x.wave!=null?2:0}}>kts</div>
              {x.wave!=null&&<div style={{fontSize:8,color:n?"rgba(255,255,255,0.85)":"#0ea5e9",fontWeight:600}}>{x.wave.toFixed(1)}m</div>}
            </div>
          );
        })}
      </div>
    </div>
  );
}
