import { useState, useEffect } from 'react';
import { makeTheme } from './shared/theme';
import Planner from './module1/Planner';
import Dashboard from './module2/Dashboard';

export default function App() {
  const [dark, setDark] = useState(() => window.matchMedia("(prefers-color-scheme: dark)").matches);
  const [tab,  setTab]  = useState("plan");

  useEffect(() => {
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const fn = e => setDark(e.matches);
    mq.addEventListener("change", fn);
    return () => mq.removeEventListener("change", fn);
  }, []);

  const T = makeTheme(dark);

  return (
    <div style={{height:"100vh",display:"flex",flexDirection:"column",background:T.bg,color:T.text,fontFamily:"DM Sans,sans-serif",overflow:"hidden"}}>
      {/* Nav */}
      <div style={{height:48,flexShrink:0,background:T.card,borderBottom:"1px solid "+T.border,display:"flex",alignItems:"center",padding:"0 20px",gap:24,zIndex:100}}>
        <div style={{fontSize:16,fontWeight:900,fontFamily:"Syne,sans-serif",color:T.text,letterSpacing:-0.5,marginRight:8}}>WaveIQ</div>
        <div style={{display:"flex",gap:2}}>
          {[["plan","Planner"],["conditions","Conditions"]].map(([id,label])=>(
            <button key={id} onClick={()=>setTab(id)}
              style={{padding:"6px 16px",borderRadius:4,border:"none",background:tab===id?T.hi:"transparent",color:tab===id?T.text:T.sub,fontWeight:tab===id?700:500,fontSize:13,cursor:"pointer",fontFamily:"DM Sans,sans-serif",transition:"all .15s",letterSpacing:0.2}}>
              {label}
            </button>
          ))}
        </div>
        <div style={{marginLeft:"auto",width:8,height:8,borderRadius:"50%",background:"#22c55e",boxShadow:"0 0 6px #22c55e88"}} title="APIs live"/>
      </div>

      {/* Modules — fill remaining height */}
      <div style={{flex:1,overflow:"hidden"}}>
        {tab === "plan"       && <Planner   T={T} dark={dark}/>}
        {tab === "conditions" && <Dashboard T={T} dark={dark}/>}
      </div>
    </div>
  );
}
