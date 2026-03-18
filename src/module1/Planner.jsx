import { useState } from 'react';
import { S, gradeScore, gradeLabel, gradeColor, gradeBg } from '../data/spots';
import { SPORTS, MONTHS } from '../shared/theme';
import WorldMap from './WorldMap';
import Rankings from './Rankings';
import MonthChart from './MonthChart';

export default function Planner({ T, dark }) {
  const now = new Date();
  const [sport,  setSport]  = useState("surf");
  const [month,  setMonth]  = useState(now.getMonth());
  const [selected, setSelected] = useState(null);

  const top = [...S].map(s=>({...s,score:gradeScore(s,sport,month)})).sort((a,b)=>b.score-a.score)[0];
  const topGrade = gradeLabel(top.score);
  const topColor = gradeColor(topGrade);
  const topBg    = gradeBg(topGrade);

  return (
    <div style={{fontFamily:"DM Sans,sans-serif"}}>
      {/* Hero */}
      <div style={{position:"relative",overflow:"hidden",background:"linear-gradient(135deg,#4338ca 0%,#6366f1 50%,#818cf8 100%)",padding:"48px 24px 72px"}}>
        <div style={{position:"absolute",top:-60,right:-60,width:260,height:260,borderRadius:"50%",background:"rgba(255,255,255,0.06)",pointerEvents:"none"}}/>
        <div style={{position:"absolute",bottom:-80,left:-40,width:300,height:300,borderRadius:"50%",background:"rgba(255,255,255,0.04)",pointerEvents:"none"}}/>
        <div style={{position:"relative",maxWidth:480,margin:"0 auto"}}>
          <div style={{display:"inline-flex",alignItems:"center",gap:6,background:"rgba(255,255,255,0.15)",backdropFilter:"blur(8px)",borderRadius:20,padding:"5px 12px",marginBottom:18}}>
            <div style={{width:7,height:7,borderRadius:"50%",background:"#a5f3fc"}}/>
            <span style={{fontSize:11,fontWeight:600,color:"rgba(255,255,255,0.9)",letterSpacing:1}}>VACATION PLANNER</span>
          </div>
          <div style={{fontSize:40,fontWeight:900,fontFamily:"Syne,sans-serif",color:"white",lineHeight:1.05,letterSpacing:-1.5,marginBottom:10}}>Find your<br/>perfect trip.</div>
          <div style={{fontSize:14,color:"rgba(255,255,255,0.7)",marginBottom:28}}>Grade every spot by sport, month & season.</div>
          {/* Sport pills */}
          <div style={{display:"flex",gap:6,overflowX:"auto",paddingBottom:2}}>
            {SPORTS.map(sp=>(
              <button key={sp} onClick={()=>setSport(sp)} style={{flexShrink:0,padding:"7px 15px",borderRadius:20,border:"1.5px solid "+(sport===sp?"white":"rgba(255,255,255,0.3)"),background:sport===sp?"white":"transparent",color:sport===sp?"#6366f1":"rgba(255,255,255,0.85)",fontWeight:700,fontSize:12,cursor:"pointer",textTransform:"capitalize",transition:"all .15s"}}>
                {sp==="sup"?"SUP":sp}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content floats over hero */}
      <div style={{maxWidth:520,margin:"-28px auto 0",padding:"0 16px 40px",position:"relative",zIndex:2}}>
        {/* Month selector */}
        <div style={{background:T.card,borderRadius:20,padding:"14px 16px",boxShadow:T.shadow,marginBottom:12}}>
          <div style={{fontSize:9,color:T.sub,letterSpacing:2.5,marginBottom:10,fontWeight:600}}>SELECT MONTH</div>
          <div style={{display:"flex",gap:4,overflowX:"auto"}}>
            {MONTHS.map((m,i)=>(
              <button key={i} onClick={()=>setMonth(i)} style={{flexShrink:0,padding:"6px 10px",borderRadius:10,border:"none",background:month===i?"#6366f1":"transparent",color:month===i?"white":T.sub,fontWeight:700,fontSize:11,cursor:"pointer",transition:"all .15s",boxShadow:month===i?"0 2px 8px rgba(99,102,241,0.4)":"none"}}>
                {m}
              </button>
            ))}
          </div>
        </div>

        {/* Top pick banner */}
        <div style={{background:`linear-gradient(135deg,${topColor}22,${topColor}11)`,border:`1.5px solid ${topColor}44`,borderRadius:20,padding:"16px 18px",marginBottom:12,display:"flex",alignItems:"center",gap:14}}>
          <div style={{background:topBg,borderRadius:14,padding:"8px 14px",flexShrink:0}}>
            <div style={{fontSize:26,fontWeight:900,fontFamily:"Syne,sans-serif",color:topColor,letterSpacing:-1}}>{topGrade}</div>
          </div>
          <div>
            <div style={{fontSize:9,color:T.sub,letterSpacing:2,fontWeight:600,marginBottom:3}}>TOP PICK · {MONTHS[month].toUpperCase()}</div>
            <div style={{fontSize:17,fontWeight:800,fontFamily:"Syne,sans-serif",color:T.text,letterSpacing:-0.3}}>{top.name}, {top.country}</div>
            <div style={{fontSize:11,color:T.sub,marginTop:2}}>Best spot for {sport} this month</div>
          </div>
        </div>

        {/* World map */}
        <div style={{marginBottom:12}}>
          <WorldMap spots={S} sport={sport} month={month} selectedId={selected?.id} onSelect={setSelected} dark={dark}/>
        </div>

        {/* Selected spot detail */}
        {selected && (
          <div className="fade-up" style={{background:T.card,borderRadius:20,padding:"20px",boxShadow:T.shadow,marginBottom:12}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:16}}>
              <div>
                <div style={{fontSize:9,color:T.sub,letterSpacing:2,fontWeight:600,marginBottom:4}}>{selected.country.toUpperCase()} · {selected.region.toUpperCase()}</div>
                <div style={{fontSize:22,fontWeight:900,fontFamily:"Syne,sans-serif",color:T.text,letterSpacing:-0.5}}>{selected.name}</div>
              </div>
              <button onClick={()=>setSelected(null)} style={{background:"none",border:"none",color:T.sub,fontSize:18,cursor:"pointer",padding:4}}>✕</button>
            </div>
            <MonthChart spot={selected} sport={sport} currentMonth={month} onMonthSelect={setMonth} T={T}/>
          </div>
        )}

        {/* Rankings */}
        <div style={{background:T.card,borderRadius:20,padding:"20px",boxShadow:T.shadow}}>
          <Rankings spots={S} sport={sport} month={month} selectedId={selected?.id} onSelect={setSelected} T={T}/>
        </div>
      </div>
    </div>
  );
}
