import { useState } from 'react';
import { S, gradeScore, gradeLabel, gradeColor, gradeBg, topPicks } from '../data/spots';
import { SPORTS, MONTHS, RC } from '../shared/theme';
import WorldMap from './WorldMap';
import Rankings from './Rankings';
import MonthChart from './MonthChart';

function Select({ label, value, onChange, options, T }) {
  return (
    <div style={{marginBottom:12}}>
      <div style={{fontSize:9,color:T.sub,letterSpacing:2,marginBottom:5,fontWeight:600}}>{label}</div>
      <div style={{position:"relative"}}>
        <select value={value} onChange={e=>onChange(e.target.value)}
          style={{width:"100%",padding:"8px 28px 8px 10px",background:T.card,border:"1px solid "+T.border,color:T.text,borderRadius:5,fontSize:13,fontWeight:600,cursor:"pointer",fontFamily:"DM Sans,sans-serif",appearance:"none",WebkitAppearance:"none",outline:"none"}}>
          {options.map(([v,l])=><option key={v} value={v}>{l}</option>)}
        </select>
        <div style={{position:"absolute",right:9,top:"50%",transform:"translateY(-50%)",pointerEvents:"none",color:T.sub,fontSize:10}}>▾</div>
      </div>
    </div>
  );
}

export default function Planner({ T, onGoToConditions }) {
  const now = new Date();
  const [sport,    setSport]    = useState("surf");
  const [month,    setMonth]    = useState(now.getMonth());
  const [selected, setSelected] = useState(null);

  const picks = topPicks(sport, month, 5);
  const sportOptions = SPORTS.map(s => [s, s==="sup"?"SUP":s.charAt(0).toUpperCase()+s.slice(1)]);

  return (
    <div style={{display:"flex",height:"calc(100vh - 48px)",fontFamily:"DM Sans,sans-serif",overflow:"hidden"}}>

      {/* Left sidebar */}
      <div style={{width:280,flexShrink:0,borderRight:"1px solid "+T.border,overflowY:"auto",background:T.card,display:"flex",flexDirection:"column"}}>
        <div style={{padding:"16px 16px 0",flexShrink:0}}>
          <div style={{fontSize:11,fontWeight:800,letterSpacing:2,color:T.text,marginBottom:16,paddingBottom:12,borderBottom:"1px solid "+T.border}}>VACATION PLANNER</div>
          <Select label="SPORT" value={sport} onChange={setSport} options={sportOptions} T={T}/>
        </div>

        {/* Top 5 */}
        <div style={{padding:"0 16px",flexShrink:0}}>
          <div style={{fontSize:9,color:T.sub,letterSpacing:2,marginBottom:8,fontWeight:600,paddingTop:12,borderTop:"1px solid "+T.border}}>TOP 5 PICKS · {MONTHS[month].toUpperCase()}</div>
          {picks.map((s,i)=>{
            const col = gradeColor(s.grade);
            const rc  = RC[s.region]||"#6366f1";
            const sel = selected?.id===s.id;
            return (
              <div key={s.id} onClick={()=>setSelected(sel?null:s)}
                style={{display:"flex",alignItems:"center",gap:8,padding:"8px 8px",borderRadius:4,marginBottom:2,cursor:"pointer",background:sel?T.hi:"transparent",border:`1px solid ${sel?T.border:"transparent"}`,transition:"all .12s"}}>
                <div style={{fontSize:11,fontWeight:700,color:T.sub,width:14,fontFamily:"DM Mono,monospace",flexShrink:0}}>{i+1}</div>
                <div style={{width:6,height:6,borderRadius:"50%",background:rc,flexShrink:0}}/>
                <div style={{flex:1,minWidth:0}}>
                  <div style={{fontWeight:700,fontSize:13,color:T.text,letterSpacing:-0.2,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{s.name}</div>
                  <div style={{fontSize:10,color:T.sub}}>{s.country}</div>
                </div>
                <div style={{fontSize:14,fontWeight:900,fontFamily:"DM Mono,monospace",color:col,background:col+"18",padding:"2px 8px",borderRadius:3}}>{s.grade}</div>
              </div>
            );
          })}
        </div>

        {/* Selected spot detail */}
        {selected && (
          <div style={{padding:"16px",borderTop:"1px solid "+T.border,flexShrink:0,marginTop:8}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
              <div>
                <div style={{fontSize:13,fontWeight:800,color:T.text}}>{selected.name}</div>
                <div style={{fontSize:10,color:T.sub}}>{selected.country} · {selected.region}</div>
              </div>
              <div style={{display:"flex",gap:6}}>
                {onGoToConditions&&<button onClick={()=>onGoToConditions(selected)} style={{padding:"4px 10px",borderRadius:3,border:"1px solid #0ea5e9",background:"#0ea5e9",color:"white",fontSize:10,fontWeight:700,cursor:"pointer",letterSpacing:0.5}}>CONDITIONS →</button>}
                <button onClick={()=>setSelected(null)} style={{background:"none",border:"none",color:T.sub,cursor:"pointer",fontSize:14,padding:2}}>✕</button>
              </div>
            </div>
            <MonthChart spot={selected} sport={sport} currentMonth={month} onMonthSelect={setMonth} T={T}/>
          </div>
        )}

        {/* Rankings */}
        <div style={{padding:"16px",borderTop:"1px solid "+T.border,flex:1}}>
          <Rankings spots={S} sport={sport} month={month} selectedId={selected?.id} onSelect={s=>setSelected(selected?.id===s.id?null:s)} T={T}/>
        </div>
      </div>

      {/* Map + month strip */}
      <div style={{flex:1,overflow:"hidden",position:"relative",display:"flex",flexDirection:"column"}}>
        {/* Horizontal month pills */}
        <div style={{flexShrink:0,background:"#ffffff",borderBottom:"1px solid #e2e8f0",display:"flex",alignItems:"center",gap:6,padding:"8px 16px",flexWrap:"wrap"}}>
          {MONTHS.map((m,i)=>(
            <button key={i} onClick={()=>setMonth(i)}
              style={{padding:"4px 10px",borderRadius:20,border:"1px solid "+(i===month?"#0ea5e9":"#e2e8f0"),background:i===month?"#0ea5e9":"#ffffff",color:i===month?"#fff":"#64748b",fontSize:11,fontWeight:i===month?700:500,cursor:"pointer",fontFamily:"DM Sans,sans-serif",transition:"all .1s"}}>
              {m}
            </button>
          ))}
        </div>
        {/* Map */}
        <div style={{flex:1,overflow:"hidden"}}>
          <WorldMap spots={S} sport={sport} month={month} selectedId={selected?.id} onSelect={s=>setSelected(selected?.id===s.id?null:s)} dark={false}/>
        </div>
      </div>
    </div>
  );
}
