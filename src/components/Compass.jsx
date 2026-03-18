import { WD } from '../utils/safety';
export default function Compass({ deg, speed, T }) {
  const dir = WD[Math.round(deg/22.5)%16];
  return (
    <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:10}}>
      <svg width="88" height="88" viewBox="0 0 88 88">
        <defs><radialGradient id="cg"><stop offset="0%" stopColor={T.card}/><stop offset="100%" stopColor={T.bg}/></radialGradient></defs>
        <circle cx="44" cy="44" r="40" fill="url(#cg)" stroke={T.line} strokeWidth="1"/>
        {[0,90,180,270].map(a=><line key={a} x1={44+35*Math.sin(a*Math.PI/180)} y1={44-35*Math.cos(a*Math.PI/180)} x2={44+40*Math.sin(a*Math.PI/180)} y2={44-40*Math.cos(a*Math.PI/180)} stroke={T.line} strokeWidth="1.5"/>)}
        {["N","E","S","W"].map((d,i)=><text key={d} x={44+26*Math.sin(i*Math.PI/2)} y={44-26*Math.cos(i*Math.PI/2)+3.5} textAnchor="middle" fontSize="7.5" fontWeight="700" fill={T.sub}>{d}</text>)}
        <g transform={`rotate(${deg},44,44)`}>
          <polygon points="44,7 47.5,34 44,30 40.5,34" fill="#6366f1"/>
          <polygon points="44,81 47.5,54 44,58 40.5,54" fill="#6366f1" opacity="0.2"/>
        </g>
        <circle cx="44" cy="44" r="5" fill={T.card} stroke="#6366f1" strokeWidth="2.5"/>
      </svg>
      <div style={{textAlign:"center"}}>
        <div style={{fontSize:34,fontWeight:800,fontFamily:"Syne,sans-serif",color:"#6366f1",lineHeight:1,letterSpacing:-1}}>{speed}</div>
        <div style={{fontSize:9,color:T.sub,letterSpacing:2,marginTop:3}}>{dir} · KTS</div>
      </div>
    </div>
  );
}
