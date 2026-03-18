import { RC } from '../shared/theme';
export default function SpotCard({ s, onClick, T }) {
  const rc = RC[s.region] || "#6366f1";
  return (
    <div onClick={onClick} style={{background:T.card,borderRadius:20,padding:"18px 20px",marginBottom:10,cursor:"pointer",display:"flex",alignItems:"center",boxShadow:T.shadow,transition:"all .18s"}}
      onMouseEnter={e=>{e.currentTarget.style.transform="translateY(-3px)";e.currentTarget.style.boxShadow=T.shadowHover;}}
      onMouseLeave={e=>{e.currentTarget.style.transform="";e.currentTarget.style.boxShadow=T.shadow;}}>
      <div style={{width:42,height:42,borderRadius:13,background:rc+"18",display:"flex",alignItems:"center",justifyContent:"center",marginRight:14,flexShrink:0}}>
        <div style={{width:14,height:14,borderRadius:"50%",background:rc}}/>
      </div>
      <div style={{flex:1}}>
        <div style={{fontWeight:800,fontSize:16,fontFamily:"Syne,sans-serif",color:T.text,letterSpacing:-0.3}}>{s.name}</div>
        <div style={{fontSize:12,color:T.sub,marginTop:3,display:"flex",gap:8,alignItems:"center"}}>
          <span>{s.country}</span>
          <span style={{color:rc,fontWeight:700,fontSize:10,letterSpacing:0.5}}>{s.region.toUpperCase()}</span>
          {s.d&&<span style={{color:T.sub}}>{Math.round(s.d)} km</span>}
        </div>
      </div>
      <div style={{color:T.sub,fontSize:20,fontWeight:300}}>›</div>
    </div>
  );
}
