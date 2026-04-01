import { WD } from '../utils/safety';
export default function Compass({ deg, speed, unit, T }) {
  const dir = WD[Math.round(deg/22.5)%16];
  return (
    <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:10}}>
      <svg width="60" height="60" viewBox="0 0 60 60">
        <defs><radialGradient id="cg"><stop offset="0%" stopColor={T.card}/><stop offset="100%" stopColor={T.bg}/></radialGradient></defs>
        <circle cx="30" cy="30" r="26" fill="url(#cg)" stroke={T.line} strokeWidth="1"/>
        {[0,90,180,270].map(a=><line key={a} x1={30+22*Math.sin(a*Math.PI/180)} y1={30-22*Math.cos(a*Math.PI/180)} x2={30+26*Math.sin(a*Math.PI/180)} y2={30-26*Math.cos(a*Math.PI/180)} stroke={T.line} strokeWidth="1.5"/>)}
        {["N","E","S","W"].map((d,i)=><text key={d} x={30+18*Math.sin(i*Math.PI/2)} y={30-18*Math.cos(i*Math.PI/2)+3.5} textAnchor="middle" fontSize="7.5" fontWeight="700" fill={T.sub}>{d}</text>)}
        <g transform={`rotate(${deg},30,30)`}>
          <polygon points="30,4 33,20 30,17 27,20" fill="#0ea5e9"/>
          <polygon points="30,56 33,40 30,43 27,40" fill="#0ea5e9" opacity="0.2"/>
        </g>
        <circle cx="30" cy="30" r="4" fill={T.card} stroke="#0ea5e9" strokeWidth="2"/>
      </svg>
      <div style={{textAlign:"center"}}>
        <div style={{fontSize:22,fontWeight:800,fontFamily:"Syne,sans-serif",color:"#0ea5e9",lineHeight:1,letterSpacing:-1}}>{speed}</div>
        <div style={{fontSize:9,color:T.sub,letterSpacing:2,marginTop:3}}>{dir} · {(unit||"KTS").toUpperCase()}</div>
      </div>
    </div>
  );
}
