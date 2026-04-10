import { useState, useRef, useEffect, useCallback } from 'react';
import { ComposableMap, Geographies, Geography, Marker, ZoomableGroup } from 'react-simple-maps';
import { gradeScore, gradeLabel, gradeColor } from '../data/spots';

const GEO_URL = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

const HEATMAP_COLORS = {A:'#22c55e',B:'#84cc16',C:'#f59e0b',D:'#f97316',F:'#ef4444'};

const WIND_COLORS = {1:'#bfdbfe',2:'#bfdbfe',3:'#60a5fa',4:'#2563eb',5:'#1e3a8a'};
const WAVE_COLORS = {1:'#d1fae5',2:'#6ee7b7',3:'#10b981',4:'#047857',5:'#064e3b'};

function getClusterRadius(zoom) {
  if (zoom < 2) return 12;
  if (zoom < 4) return 4;
  if (zoom < 8) return 1.2;
  return 0.3;
}

function clusterSpots(spots, zoom) {
  const radius = getClusterRadius(zoom);
  const used = new Set();
  const clusters = [];
  for (const s of spots) {
    if (used.has(s.id)) continue;
    const group = spots.filter(o => !used.has(o.id) && Math.sqrt((o.lat-s.lat)**2 + (o.lng-s.lng)**2) < radius);
    group.forEach(o => used.add(o.id));
    const lat = group.reduce((a,b) => a + b.lat, 0) / group.length;
    const lng = group.reduce((a,b) => a + b.lng, 0) / group.length;
    clusters.push({ id: `c-${s.id}`, lat, lng, spots: group, isCluster: group.length > 1 });
  }
  return clusters;
}

export default function WorldMap({ spots, sport, month, selectedId, onSelect, dark, T }) {
  const [zoom, setZoom] = useState(1);
  const [center, setCenter] = useState([10, 10]);
  const [showHeatmap, setShowHeatmap] = useState(false);
  const [mapMode, setMapMode] = useState("grade");
  const [popupCluster, setPopupCluster] = useState(null);
  const popupRef = useRef(null);
  const mapRef = useRef(null);
  const canvasRef = useRef(null);
  const animRef = useRef(null);
  const particlesRef = useRef([]);

  const bg   = dark ? "#0b1120" : "#c2dff5";
  const land = dark ? "#162035" : "#d4e8cc";
  const bord = dark ? "#1e2d45" : "#b0ccb8";
  const showLabels = zoom > 2;
  const clusters = clusterSpots(spots, zoom);

  // Close popup on outside click
  useEffect(() => {
    if (!popupCluster) return;
    const handler = (e) => {
      if (popupRef.current && !popupRef.current.contains(e.target)) setPopupCluster(null);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [popupCluster]);

  useEffect(() => {
    if (mapMode !== "particles") {
      cancelAnimationFrame(animRef.current);
      if (canvasRef.current?.parentNode) canvasRef.current.parentNode.removeChild(canvasRef.current);
      canvasRef.current = null;
      particlesRef.current = [];
      return;
    }

    const container = mapRef.current;
    if (!container) return;

    let canvas = container.querySelector('#waveiq-wm-particles');
    if (!canvas) {
      canvas = document.createElement('canvas');
      canvas.id = 'waveiq-wm-particles';
      canvas.style.cssText = 'position:absolute;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:10;';
      container.appendChild(canvas);
    }
    canvasRef.current = canvas;

    const W = container.offsetWidth || 800;
    const H = container.offsetHeight || 500;
    canvas.width = W;
    canvas.height = H;

    const COUNT = 500;
    const MAX_AGE = 100;

    const avgScore = spots.reduce((s,sp) => s + (sp.wind?.[month] ?? sp.seasonal?.wind?.[month] ?? 3), 0) / spots.length;
    const windKts = avgScore * 6;
    const dirDeg = 260;
    const dirRad = dirDeg * Math.PI / 180;

    const vx = Math.sin(dirRad) * windKts * 0.018;
    const vy = -Math.cos(dirRad) * windKts * 0.018;

    const col = windKts > 25 ? '#f97316' : windKts > 15 ? '#f59e0b' : windKts > 8 ? '#22c55e' : '#93c5fd';

    if (!particlesRef.current.length) {
      particlesRef.current = Array.from({length: COUNT}, () => ({
        x: Math.random() * W,
        y: Math.random() * H,
        age: Math.floor(Math.random() * MAX_AGE),
      }));
    }

    const ctx = canvas.getContext('2d');

    const animate = () => {
      ctx.clearRect(0, 0, W, H);
      ctx.lineCap = 'round';
      const pts = particlesRef.current;
      for (let i = 0; i < pts.length; i++) {
        const p = pts[i];
        const ox = p.x, oy = p.y;
        p.age++;
        if (p.age >= MAX_AGE || p.x < -10 || p.x > W + 10 || p.y < -10 || p.y > H + 10) {
          p.x = Math.random() * W; p.y = Math.random() * H; p.age = 0; continue;
        }
        p.x += vx; p.y += vy;
        const alpha = Math.sin(Math.PI * p.age / MAX_AGE) * 0.85;
        ctx.globalAlpha = alpha;
        ctx.strokeStyle = col;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(ox, oy);
        ctx.lineTo(p.x, p.y);
        ctx.stroke();
      }
      ctx.globalAlpha = 1;
      animRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animRef.current);
      if (canvas.parentNode) canvas.parentNode.removeChild(canvas);
      canvasRef.current = null;
      particlesRef.current = [];
    };
  }, [mapMode, month, spots]); // eslint-disable-line

  const getSpotColor = useCallback((s) => {
    if (mapMode === "wind" || mapMode === "particles") return WIND_COLORS[s.wind?.[month] ?? s.seasonal?.wind?.[month]] || '#bfdbfe';
    if (mapMode === "wave") return WAVE_COLORS[s.swell?.[month] ?? s.seasonal?.swell?.[month]] || '#d1fae5';
    return gradeColor(gradeLabel(gradeScore(s, sport, month)));
  }, [mapMode, month, sport]);

  const getHaloColor = useCallback((s) => {
    if (mapMode === "wind") return WIND_COLORS[s.wind?.[month] ?? s.seasonal?.wind?.[month]] || '#bfdbfe';
    if (mapMode === "wave") return WAVE_COLORS[s.swell?.[month] ?? s.seasonal?.swell?.[month]] || '#d1fae5';
    const g = gradeLabel(gradeScore(s, sport, month));
    return HEATMAP_COLORS[g] || '#94a3b8';
  }, [mapMode, month, sport]);

  const showHalo = (s) => {
    if (mapMode === "particles") return false;
    if (mapMode === "wind" || mapMode === "wave") return true;
    return showHeatmap;
  };

  const handleClusterClick = (cl, e) => {
    if (cl.isCluster && zoom >= 8) {
      // High zoom with overlapping spots: show popup
      const rect = mapRef.current?.getBoundingClientRect();
      const x = e ? e.clientX - (rect?.left || 0) : 0;
      const y = e ? e.clientY - (rect?.top || 0) : 0;
      setPopupCluster({ spots: cl.spots, lng: cl.lng, lat: cl.lat, x, y });
    } else if (cl.isCluster) {
      setZoom(z => Math.min(z * 2, 16));
      setCenter([cl.lng, cl.lat]);
      setPopupCluster(null);
    } else {
      onSelect(cl.spots[0]);
      setPopupCluster(null);
    }
  };

  const renderClusterDot = (cl) => {
    if (zoom < 2) return <circle r={8 + cl.spots.length * 1.5} fill="#94a3b8" stroke={dark?"#0b1120":"white"} strokeWidth={1.5} style={{cursor:"pointer",opacity:0.85}} />;
    if (zoom < 4) return <circle r={7 + cl.spots.length} fill="#94a3b8" stroke={dark?"#0b1120":"white"} strokeWidth={1.5} style={{cursor:"pointer",opacity:0.85}} />;
    return <circle r={6 + cl.spots.length * 0.5} fill="#94a3b8" stroke={dark?"#0b1120":"white"} strokeWidth={1.5} style={{cursor:"pointer",opacity:0.85}} />;
  };

  const renderClusterText = (cl) => {
    const fs = zoom < 2 ? 9 : zoom < 4 ? 8 : 8;
    return (
      <text textAnchor="middle" dominantBaseline="central"
        style={{fontSize:fs,fontWeight:700,fill:"white",fontFamily:"DM Mono,monospace",pointerEvents:"none"}}>
        {cl.spots.length}
      </text>
    );
  };

  const renderSpot = (s, key) => {
    const g   = gradeLabel(gradeScore(s, sport, month));
    const col = getSpotColor(s);
    const sel = s.id === selectedId;
    const hc  = getHaloColor(s);
    return (
      <Marker key={key || s.id} coordinates={[s.lng, s.lat]} onClick={() => { onSelect(s); setPopupCluster(null); }}>
        {showHalo(s) && <>
          <circle r={90} fill={hc} opacity={0.08} style={{pointerEvents:"none"}}/>
          <circle r={50} fill={hc} opacity={0.18} style={{pointerEvents:"none"}}/>
          <circle r={22} fill={hc} opacity={0.28} style={{pointerEvents:"none"}}/>
        </>}
        <circle r={sel?10:6} fill={col} stroke={dark?"#0b1120":"white"} strokeWidth={sel?2.5:1.5}
          style={{cursor:"pointer", filter:sel?`drop-shadow(0 0 8px ${col})`:"none", transition:"r .15s"}} />
        {mapMode === "grade" && (
          <text textAnchor="middle" y={sel?-14:-10}
            style={{fontSize:sel?10:8, fontWeight:700, fill:col, fontFamily:"DM Mono,monospace", pointerEvents:"none", opacity:sel?1:0.85}}>
            {g}
          </text>
        )}
        {(sel || showLabels) && (
          <text textAnchor="middle" y={22}
            style={{fontSize:9, fontWeight:600, fill:sel?"white":(dark?"#94a3b8":"#475569"), fontFamily:"DM Sans,sans-serif", pointerEvents:"none",
              textShadow:dark?"0 1px 4px #000":"none"}}>
            {s.name}
          </text>
        )}
      </Marker>
    );
  };

  return (
    <div ref={mapRef} style={{width:"100%",height:"100%",background:bg,position:"relative"}}>
      <ComposableMap
        projection="geoNaturalEarth1"
        projectionConfig={{scale:155, center:[10, 10]}}
        style={{width:"100%",height:"100%"}}
      >
        <ZoomableGroup zoom={zoom} center={center} onMoveEnd={({zoom:z, coordinates})=>{setZoom(z);setCenter(coordinates);}}>
          <Geographies geography={GEO_URL}>
            {({geographies}) => geographies.map(geo => (
              <Geography key={geo.rsmKey} geography={geo}
                style={{
                  default: {fill:land, stroke:bord, strokeWidth:0.4, outline:"none"},
                  hover:   {fill:land, outline:"none"},
                  pressed: {fill:land, outline:"none"},
                }}
              />
            ))}
          </Geographies>
          {clusters.map(cl => {
            if (cl.isCluster) {
              return (
                <Marker key={cl.id} coordinates={[cl.lng, cl.lat]}
                  onClick={(e) => handleClusterClick(cl, e)}>
                  {renderClusterDot(cl)}
                  {renderClusterText(cl)}
                </Marker>
              );
            }
            return renderSpot(cl.spots[0], cl.id);
          })}
        </ZoomableGroup>
      </ComposableMap>

      {/* Map mode toggles — top right row 1 */}
      <div style={{position:"absolute",top:12,right:12,display:"flex",gap:4}}>
        {["grade","wind","wave","particles"].map(mode => {
          const labels = {grade:"Grade",wind:"Wind",wave:"Wave",particles:"Flow"};
          const active = mapMode === mode;
          return (
            <button key={mode} onClick={() => setMapMode(mode)}
              style={{height:28,padding:"0 10px",borderRadius:4,border:"1px solid "+(active?"#0ea5e9":"#cbd5e1"),
                background:active?"#0ea5e9":"white",color:active?"white":"#64748b",fontSize:10,fontWeight:600,cursor:"pointer",
                fontFamily:"DM Sans,sans-serif",boxShadow:"0 1px 4px rgba(0,0,0,0.12)",transition:"all .15s",textTransform:"capitalize"}}>
              {labels[mode]}
            </button>
          );
        })}
      </div>

      {/* Heatmap toggle — top right row 2, only in grade mode */}
      {mapMode === "grade" && (
        <button onClick={() => setShowHeatmap(h => !h)}
          style={{position:"absolute",top:48,right:12,padding:"5px 12px",borderRadius:4,border:"1px solid "+(showHeatmap?"#0ea5e9":"#cbd5e1"),
            background:showHeatmap?"#0ea5e9":"white",color:showHeatmap?"white":"#64748b",fontSize:11,fontWeight:600,cursor:"pointer",
            fontFamily:"DM Sans,sans-serif",boxShadow:"0 1px 4px rgba(0,0,0,0.12)",transition:"all .15s"}}>
          Heatmap
        </button>
      )}

      {/* Zoom controls — bottom left */}
      <div style={{position:"absolute",bottom:16,left:16,display:"flex",flexDirection:"column",gap:4}}>
        {[["+",()=>setZoom(z=>Math.min(z*1.5,16))],["\u2212",()=>setZoom(z=>Math.max(z/1.5,1))],["\u21BA",()=>{setZoom(1);setCenter([10,10]);setPopupCluster(null);}]].map(([label,fn],i)=>(
          <button key={i} onClick={fn}
            style={{width:28,height:28,borderRadius:4,border:"none",background:"white",color:"#0ea5e9",fontSize:16,fontWeight:700,
              cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",
              boxShadow:"0 1px 4px rgba(0,0,0,0.18)",lineHeight:1}}>
            {label}
          </button>
        ))}
      </div>

      {/* Legend — bottom right */}
      <div style={{position:"absolute",bottom:16,right:16,display:"flex",gap:8,background:dark?"rgba(10,15,28,0.85)":"rgba(255,255,255,0.9)",backdropFilter:"blur(8px)",padding:"8px 12px",borderRadius:6,border:`1px solid ${bord}`}}>
        {mapMode === "particles" ? (
          <div style={{display:"flex",alignItems:"center",gap:6}}>
            <div style={{width:8,height:8,borderRadius:"50%",background:"#93c5fd"}}/>
            <span style={{fontSize:10,color:dark?"#94a3b8":"#64748b",fontFamily:"DM Mono,monospace",fontWeight:600}}>Wind Flow</span>
          </div>
        ) : mapMode === "grade" ? (
          [["A","#22c55e"],["B","#6366f1"],["C","#f59e0b"],["D","#f97316"],["F","#f43f5e"]].map(([g,c])=>(
            <div key={g} style={{display:"flex",alignItems:"center",gap:4}}>
              <div style={{width:8,height:8,borderRadius:"50%",background:c}}/>
              <span style={{fontSize:10,color:dark?"#94a3b8":"#64748b",fontFamily:"DM Mono,monospace",fontWeight:600}}>{g}</span>
            </div>
          ))
        ) : mapMode === "wind" ? (
          [["Low","#bfdbfe"],["Med","#60a5fa"],["High","#1e3a8a"]].map(([v,c])=>(
            <div key={v} style={{display:"flex",alignItems:"center",gap:4}}>
              <div style={{width:8,height:8,borderRadius:"50%",background:c}}/>
              <span style={{fontSize:10,color:dark?"#94a3b8":"#64748b",fontFamily:"DM Mono,monospace",fontWeight:600}}>{v}</span>
            </div>
          ))
        ) : (
          [["Low","#d1fae5"],["Med","#10b981"],["High","#064e3b"]].map(([v,c])=>(
            <div key={v} style={{display:"flex",alignItems:"center",gap:4}}>
              <div style={{width:8,height:8,borderRadius:"50%",background:c}}/>
              <span style={{fontSize:10,color:dark?"#94a3b8":"#64748b",fontFamily:"DM Mono,monospace",fontWeight:600}}>{v}</span>
            </div>
          ))
        )}
      </div>

      {/* Overlap popup */}
      {popupCluster && (
        <div ref={popupRef} style={{
          position:"absolute", left:popupCluster.x, top:popupCluster.y,
          background:"white", border:"1px solid #e2e8f0", borderRadius:6,
          boxShadow:"0 4px 12px rgba(0,0,0,0.15)", padding:8, minWidth:140, zIndex:10,
          transform:"translate(-50%,-100%)", marginTop:-8
        }}>
          <button onClick={() => setPopupCluster(null)}
            style={{position:"absolute",top:2,right:6,background:"none",border:"none",fontSize:14,cursor:"pointer",color:"#94a3b8",lineHeight:1}}>&times;</button>
          <div style={{display:"flex",flexDirection:"column",gap:4,marginTop:4}}>
            {popupCluster.spots.map(s => {
              const g = gradeLabel(gradeScore(s, sport, month));
              const col = gradeColor(g);
              return (
                <div key={s.id} onClick={() => { onSelect(s); setPopupCluster(null); }}
                  style={{display:"flex",alignItems:"center",gap:6,padding:"4px 6px",borderRadius:4,cursor:"pointer",
                    fontSize:11,fontFamily:"DM Sans,sans-serif",fontWeight:600,color:"#334155"}}
                  onMouseEnter={e => e.currentTarget.style.background="#f1f5f9"}
                  onMouseLeave={e => e.currentTarget.style.background="transparent"}>
                  <span>{s.name}</span>
                  <span style={{marginLeft:"auto",background:col,color:"white",borderRadius:3,padding:"1px 5px",fontSize:9,fontWeight:700}}>{g}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
