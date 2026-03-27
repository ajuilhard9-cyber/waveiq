import { useMemo } from 'react';
import { tideChart, nextTides } from '../utils/tides';

function fmtHM(d) {
  return d.getHours().toString().padStart(2,"0")+":"+d.getMinutes().toString().padStart(2,"0");
}

export default function TideChart({ lat, lng, T }) {
  const { points, high, low, nowIdx } = useMemo(() => {
    const pts = tideChart(lat, lng);
    const nt = nextTides(lat, lng);
    const now = Date.now();
    let closest = 0, minD = Infinity;
    pts.forEach((p, i) => { const d = Math.abs(new Date(p.time).getTime() - now); if (d < minD) { minD = d; closest = i; } });
    return { points: pts, high: nt.high, low: nt.low, nowIdx: closest };
  }, [lat, lng]);

  const W = 260, H = 50;
  const xs = points.map((_, i) => (i / (points.length - 1)) * W);
  const ys = points.map(p => ((1 - p.height) / 2) * H); // invert: high=top
  const nowX = (nowIdx / (points.length - 1)) * W;

  // Build smooth path
  let d = `M${xs[0]},${ys[0]}`;
  for (let i = 1; i < xs.length; i++) {
    const cpx1 = xs[i - 1] + (xs[i] - xs[i - 1]) / 3;
    const cpx2 = xs[i] - (xs[i] - xs[i - 1]) / 3;
    d += ` C${cpx1},${ys[i - 1]} ${cpx2},${ys[i]} ${xs[i]},${ys[i]}`;
  }
  const fillD = d + ` L${W},${H} L0,${H} Z`;

  return (
    <div style={{marginTop:4}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:4}}>
        <div style={{fontSize:9,color:T.sub,fontWeight:600,letterSpacing:2}}>TIDE</div>
        <div style={{fontFamily:"DM Mono,monospace",fontSize:10}}>
          <span style={{color:"#0ea5e9"}}>High ~{fmtHM(high)}</span>
          <span style={{color:T.sub,marginLeft:8}}>Low ~{fmtHM(low)}</span>
        </div>
      </div>
      <svg width="100%" height={H} viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" style={{display:"block"}}>
        <path d={fillD} fill="#e0f2fe" opacity="0.5"/>
        <path d={d} fill="none" stroke="#0ea5e9" strokeWidth="1.5"/>
        <line x1={nowX} y1="0" x2={nowX} y2={H} stroke="#0ea5e9" strokeWidth="1" strokeDasharray="3,2"/>
      </svg>
    </div>
  );
}
