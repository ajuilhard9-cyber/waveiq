import { SC } from '../shared/theme';
export default function Badge({ status, score, warnings }) {
  const c = SC[status] || {bg:"#f8fafc",text:"#64748b",border:"#e2e8f0",dot:"#94a3b8"};
  return (
    <div style={{background:c.bg,border:"1px solid "+c.border,borderRadius:20,padding:"8px 12px"}}>
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:warnings.length?10:0}}>
        <div style={{display:"flex",alignItems:"center",gap:8}}>
          <div style={{width:8,height:8,borderRadius:"50%",background:c.dot,boxShadow:"0 0 0 2px "+c.border}}/>
          <div style={{fontSize:15,fontWeight:900,fontFamily:"Syne,sans-serif",color:c.text,letterSpacing:-0.5}}>{status}</div>
        </div>
        <div style={{fontSize:9,fontWeight:700,color:c.text,opacity:0.6}}>{score}/100</div>
      </div>
      {warnings.map((w,i)=><div key={i} style={{fontSize:12,color:c.text,fontWeight:500,marginTop:4,paddingLeft:20}}>· {w}</div>)}
    </div>
  );
}
