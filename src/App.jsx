import { useState, useEffect } from 'react';
import { makeTheme } from './shared/theme';
import Planner from './module1/Planner';
import Dashboard from './module2/Dashboard';

export default function App() {
  const [dark, setDark] = useState(() => window.matchMedia("(prefers-color-scheme: dark)").matches);
  const [tab,  setTab]  = useState("conditions"); // "plan" | "conditions"

  useEffect(() => {
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const fn = e => setDark(e.matches);
    mq.addEventListener("change", fn);
    return () => mq.removeEventListener("change", fn);
  }, []);

  const T = makeTheme(dark);

  return (
    <div style={{minHeight:"100vh",background:T.bg,color:T.text,fontFamily:"DM Sans,sans-serif"}}>
      {/* Global nav */}
      <div style={{position:"sticky",top:0,zIndex:100,background:T.bg+"f0",backdropFilter:"blur(16px)",borderBottom:"1px solid "+T.border}}>
        <div style={{maxWidth:520,margin:"0 auto",padding:"0 16px",display:"flex",alignItems:"center",gap:8,height:54}}>
          <div style={{fontSize:18,fontWeight:900,fontFamily:"Syne,sans-serif",background:"linear-gradient(135deg,#6366f1,#818cf8)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",marginRight:8,letterSpacing:-0.5}}>WaveIQ</div>
          <div style={{display:"flex",background:T.card,borderRadius:12,padding:3,gap:2,border:"1px solid "+T.border}}>
            {[["plan","🗺 Plan"],["conditions","📍 Now"]].map(([id,label])=>(
              <button key={id} onClick={()=>setTab(id)} style={{padding:"6px 14px",borderRadius:9,border:"none",background:tab===id?"#6366f1":"transparent",color:tab===id?"white":T.sub,fontWeight:700,fontSize:12,cursor:"pointer",transition:"all .15s",boxShadow:tab===id?"0 2px 8px rgba(99,102,241,0.35)":"none",whiteSpace:"nowrap"}}>
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Modules */}
      {tab === "plan"       && <Planner   T={T} dark={dark}/>}
      {tab === "conditions" && <Dashboard T={T} dark={dark}/>}
    </div>
  );
}
