import { SC } from '../shared/theme';
export default function Badge({ status, score, warnings }) {
  const c = SC[status] || {bg:"#f8fafc",text:"#64748b",border:"#e2e8f0",dot:"#94a3b8"};
  return (
    <div style={{background:c.bg,border:"1px solid "+c.border,borderRadius:20,padding:"18px 20px"}}>
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:warnings.length?10:0}}>
        <div style={{display:"flex",alignItems:"center",gap:10}}>
          <div style={{width:10,height:10,borderRadius:"50%",background:c.dot,boxShadow:"0 0 0 3px "+c.border}}/>
          <div style={{fontSize:20,fontWeight:900,fontFamily:"Syne,sans-serif",color:c.text,letterSpacing:-0.5}}>{status}</div>
        </div>
        <div style={{fontSize:10,fontWeight:700,color:c.text,opacity:0.6}}>{score}/100</div>
      </div>
      {warnings.map((w,i)=><div key={i} style={{fontSize:12,color:c.text,fontWeight:500,marginTop:4,paddingLeft:20}}>· {w}</div>)}
    </div>
  );
}
