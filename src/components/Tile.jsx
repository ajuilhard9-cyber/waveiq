export default function Tile({ label, value, unit, sub, color, T }) {
  return (
    <div style={{background:T.card,borderRadius:18,padding:"18px 20px",boxShadow:T.shadow}}>
      <div style={{fontSize:9,color:T.sub,letterSpacing:2.5,marginBottom:8,fontWeight:600,textTransform:"uppercase"}}>{label}</div>
      <div style={{display:"flex",alignItems:"flex-end",gap:4}}>
        <span style={{fontSize:26,fontWeight:800,fontFamily:"Syne,sans-serif",color:color||T.text,lineHeight:1,letterSpacing:-0.5}}>{value}</span>
        {unit&&<span style={{fontSize:12,color:T.sub,marginBottom:3,fontWeight:600}}>{unit}</span>}
      </div>
      {sub&&<div style={{fontSize:11,color:T.sub,marginTop:5}}>{sub}</div>}
    </div>
  );
}
