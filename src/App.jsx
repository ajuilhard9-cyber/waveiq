import { useState } from 'react';
import { makeTheme } from './shared/theme';
import Planner from './module1/Planner';
import Dashboard from './module2/Dashboard';

export default function App() {
  const [tab,       setTab]       = useState("plan");
  const [crossSpot, setCrossSpot] = useState(null); // spot passed from Planner → Dashboard

  const T = makeTheme(false);

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
        </div>
      </div>

      {/* Modules */}
      <div style={{flex:1,overflow:"hidden"}}>
        {tab==="plan"       && <Planner   T={T} onGoToConditions={goToConditions}/>}
        {tab==="conditions" && <Dashboard T={T} initialSpot={crossSpot} onClearInitial={clearCrossSpot}/>}
      </div>
    </div>
  );
}
