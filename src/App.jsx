import { useState, useEffect } from 'react';
import { makeTheme } from './shared/theme';
import Planner from './module1/Planner';
import Dashboard from './module2/Dashboard';

export default function App() {
  const [tab,       setTab]       = useState("plan");
  const [crossSpot, setCrossSpot] = useState(null);

  const [dark, setDark] = useState(() => window.matchMedia?.('(prefers-color-scheme: dark)').matches ?? false);
  useEffect(() => {
    const mq = window.matchMedia?.('(prefers-color-scheme: dark)');
    if (!mq) return;
    const h = e => setDark(e.matches);
    mq.addEventListener('change', h);
    return () => mq.removeEventListener('change', h);
  }, []);

  const [isMobile, setIsMobile] = useState(() => window.innerWidth < 768);
  useEffect(() => {
    const h = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', h);
    return () => window.removeEventListener('resize', h);
  }, []);

  const T = makeTheme(dark);

  useEffect(() => {
    document.body.style.background = T.bg;
    document.body.style.color = T.text;
  }, [T.bg, T.text]);

  function goToConditions(spot) {
    setCrossSpot(spot);
    setTab("conditions");
  }

  function clearCrossSpot() {
    setCrossSpot(null);
  }

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
        <div style={{marginLeft:"auto",display:"flex",alignItems:"center",gap:6}}>
          <div style={{width:7,height:7,borderRadius:"50%",background:"#22c55e",boxShadow:"0 0 6px #22c55e88"}}/>
          <span style={{fontSize:10,color:T.sub,fontWeight:600}}>LIVE</span>
          <button onClick={() => setDark(d => !d)}
            style={{
              marginLeft:8, padding:"4px 10px", borderRadius:6,
              border:"1px solid "+T.border, background:T.card,
              color:T.text, cursor:"pointer", fontSize:13, lineHeight:1,
              transition:"all .15s"
            }}>
            {dark ? "☀" : "☾"}
          </button>
        </div>
      </div>

      {/* Modules */}
      <div style={{flex:1,overflow:"hidden"}}>
        {tab==="plan"       && <Planner   T={T} isMobile={isMobile} onGoToConditions={goToConditions}/>}
        {tab==="conditions" && <Dashboard T={T} dark={dark} isMobile={isMobile} initialSpot={crossSpot} onClearInitial={clearCrossSpot}/>}
      </div>
    </div>
  );
}
