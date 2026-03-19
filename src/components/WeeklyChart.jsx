const DAYS = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
const windColor = w => w>30?"#f43f5e":w>20?"#f97316":w>12?"#f59e0b":"#0ea5e9";
const waveColor = w => w>3?"#6366f1":w>1.5?"#0ea5e9":"#22c55e";

function fmtTime(iso) {
  if (!iso) return "--";
  try { const d=new Date(iso); return d.getHours().toString().padStart(2,"0")+":"+d.getMinutes().toString().padStart(2,"0"); }
  catch { return "--"; }
}

export default function WeeklyChart({ dailyW, dailyM, T }) {
  const days = dailyW?.time?.slice(0,7) || [];
  if (!days.length) return null;

  const allWinds = (dailyW?.wind_speed_10m_max  || []).slice(0,7);
  const allWaves = (dailyM?.wave_height_max      || []).slice(0,7);
  const maxWind  = Math.max(...allWinds, 1);
  const maxWave  = Math.max(...allWaves, 0.1);

  return (
    <div>
      <div style={{fontSize:9,color:T.sub,letterSpacing:2,marginBottom:10,fontWeight:600}}>7-DAY FORECAST</div>
      <div style={{display:"flex",flexDirection:"column",gap:3}}>
        {days.map((d,i) => {
          const date  = new Date(d);
          const label = i===0?"TODAY":DAYS[date.getDay()];
          const wind  = allWinds[i]||0;
          const wave  = allWaves[i]||0;
          const tMax  = dailyW?.temperature_2m_max?.[i]??null;
          const tMin  = dailyW?.temperature_2m_min?.[i]??null;
          const precip= dailyW?.precipitation_sum?.[i]??null;
          const rise  = dailyW?.sunrise?.[i]||null;
          const set   = dailyW?.sunset?.[i]||null;
          const wc    = windColor(wind);
          const mc    = waveColor(wave);
          const isToday = i===0;

          return (
            <div key={i} style={{display:"flex",alignItems:"center",gap:10,padding:"8px 10px",borderRadius:5,background:isToday?T.hi:"transparent",borderLeft:"2px solid "+(isToday?"#0ea5e9":"transparent"),transition:"background .1s"}}>
              {/* Day */}
              <div style={{width:40,flexShrink:0,fontSize:10,fontWeight:700,color:isToday?"#0ea5e9":T.sub,fontFamily:"DM Mono,monospace"}}>{label}</div>

              {/* Wind bar */}
              <div style={{flex:1,display:"flex",flexDirection:"column",gap:3}}>
                <div style={{display:"flex",alignItems:"center",gap:5}}>
                  <div style={{flex:1,height:4,background:T.border,borderRadius:2,overflow:"hidden"}}>
                    <div style={{width:(wind/maxWind*100)+"%",height:"100%",background:wc,borderRadius:2}}/>
                  </div>
                  <span style={{width:26,fontSize:9,color:wc,fontFamily:"DM Mono,monospace",fontWeight:700,textAlign:"right",flexShrink:0}}>{Math.round(wind)}</span>
                </div>
                {/* Wave bar */}
                <div style={{display:"flex",alignItems:"center",gap:5}}>
                  <div style={{flex:1,height:4,background:T.border,borderRadius:2,overflow:"hidden"}}>
                    <div style={{width:(wave/maxWave*100)+"%",height:"100%",background:mc,borderRadius:2}}/>
                  </div>
                  <span style={{width:26,fontSize:9,color:mc,fontFamily:"DM Mono,monospace",fontWeight:700,textAlign:"right",flexShrink:0}}>{wave.toFixed(1)}</span>
                </div>
              </div>

              {/* Temp */}
              {tMax!=null&&(
                <div style={{width:44,textAlign:"right",flexShrink:0}}>
                  <span style={{fontSize:11,fontWeight:700,color:T.text,fontFamily:"DM Mono,monospace"}}>{Math.round(tMax)}°</span>
                  <span style={{fontSize:9,color:T.sub,fontFamily:"DM Mono,monospace",marginLeft:2}}>{Math.round(tMin??0)}°</span>
                </div>
              )}

              {/* Sunrise / Sunset for today only */}
              {isToday&&rise&&(
                <div style={{fontSize:8,color:T.sub,fontFamily:"DM Mono,monospace",textAlign:"right",flexShrink:0,lineHeight:1.6}}>
                  <div style={{color:"#f59e0b",fontWeight:600}}>↑ {fmtTime(rise)}</div>
                  <div style={{color:"#f97316",fontWeight:600}}>↓ {fmtTime(set)}</div>
                </div>
              )}
            </div>
          );
        })}
      </div>
      <div style={{display:"flex",gap:14,marginTop:10}}>
        <div style={{display:"flex",alignItems:"center",gap:3}}><div style={{width:8,height:3,background:"#0ea5e9",borderRadius:1}}/><span style={{fontSize:8,color:T.sub}}>wind kts</span></div>
        <div style={{display:"flex",alignItems:"center",gap:3}}><div style={{width:8,height:3,background:"#22c55e",borderRadius:1}}/><span style={{fontSize:8,color:T.sub}}>wave m</span></div>
      </div>
    </div>
  );
}
