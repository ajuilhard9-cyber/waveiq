const windColor = w => w>30?"#f43f5e":w>20?"#f97316":w>12?"#f59e0b":"#0ea5e9";

export default function HourlyChart({ hourlyW, hourlyM, T }) {
  const now = new Date();
  const times = hourlyW?.time || [];
  let si = times.findIndex(t => new Date(t) >= now);
  if (si < 0) si = 0;
  const N = 24;

  const winds = (hourlyW?.wind_speed_10m || []).slice(si, si+N);
  const gusts = (hourlyW?.wind_gusts_10m || []).slice(si, si+N);
  const waves = (hourlyM?.wave_height    || []).slice(si, si+N);
  const timeSlice = times.slice(si, si+N);

  if (!winds.length) return null;

  const maxWind = Math.max(...winds, ...gusts, 1);
  const maxWave = Math.max(...waves, 0.1);
  const H = 72;

  return (
    <div style={{marginBottom:28}}>
      <div style={{fontSize:9,color:T.sub,letterSpacing:2,marginBottom:10,fontWeight:600}}>NEXT 24H — WIND & WAVES</div>
      <div style={{position:"relative"}}>
        {/* Wind bars */}
        <div style={{display:"flex",alignItems:"flex-end",height:H,gap:2}}>
          {winds.map((w,i) => {
            const barH = Math.max(2, (w/maxWind)*H);
            const gustH = Math.max(2, (gusts[i]||0)/maxWind*H);
            const col = windColor(w);
            const isNow = i===0;
            return (
              <div key={i} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"flex-end",height:H,position:"relative"}}>
                {/* Gust indicator */}
                {gusts[i]>w&&<div style={{position:"absolute",bottom:barH,width:"100%",height:Math.max(1,gustH-barH),background:col+"44",borderRadius:"2px 2px 0 0"}}/>}
                {/* Wind bar */}
                <div style={{width:"100%",height:barH,background:isNow?col:col+"88",borderRadius:"2px 2px 0 0"}}/>
                {/* Wave dot */}
                {waves[i]!=null&&waves[i]>0&&(
                  <div style={{position:"absolute",bottom:Math.max(4,(waves[i]/maxWave)*H)-3,left:"50%",transform:"translateX(-50%)",width:4,height:4,borderRadius:"50%",background:"#22c55e",border:"1px solid "+T.card}}/>
                )}
              </div>
            );
          })}
        </div>
        {/* X labels */}
        <div style={{display:"flex",marginTop:5,gap:2}}>
          {timeSlice.map((t,i) => {
            const hr = new Date(t).getHours();
            const show = i===0||hr%6===0;
            return (
              <div key={i} style={{flex:1,textAlign:"center",fontSize:7,color:i===0?"#0ea5e9":T.sub,fontFamily:"DM Mono,monospace",fontWeight:i===0?700:400,visibility:show?"visible":"hidden"}}>
                {i===0?"NOW":hr+"h"}
              </div>
            );
          })}
        </div>
      </div>
      {/* Legend */}
      <div style={{display:"flex",gap:14,marginTop:8}}>
        <div style={{display:"flex",alignItems:"center",gap:4}}>
          <div style={{width:10,height:4,background:"#0ea5e9",borderRadius:2}}/>
          <span style={{fontSize:8,color:T.sub,fontFamily:"DM Mono,monospace"}}>WIND kts</span>
        </div>
        <div style={{display:"flex",alignItems:"center",gap:4}}>
          <div style={{width:10,height:4,background:"#0ea5e9",borderRadius:2,opacity:0.3}}/>
          <span style={{fontSize:8,color:T.sub,fontFamily:"DM Mono,monospace"}}>GUSTS</span>
        </div>
        <div style={{display:"flex",alignItems:"center",gap:4}}>
          <div style={{width:6,height:6,borderRadius:"50%",background:"#22c55e"}}/>
          <span style={{fontSize:8,color:T.sub,fontFamily:"DM Mono,monospace"}}>WAVE m</span>
        </div>
        <div style={{display:"flex",alignItems:"center",gap:4}}>
          <div style={{width:6,height:6,background:"#f43f5e",borderRadius:1}}/>
          <span style={{fontSize:8,color:T.sub,fontFamily:"DM Mono,monospace"}}>&gt;30 GALE</span>
        </div>
      </div>
    </div>
  );
}
