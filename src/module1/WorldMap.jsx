import { useState, useRef, useEffect, useCallback } from 'react';
import { ComposableMap, Geographies, Geography, Marker, ZoomableGroup, useZoomPanContext } from 'react-simple-maps';
import { gradeScore, gradeLabel, gradeColor } from '../data/spots';

const GEO_URL = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

const HEATMAP_COLORS = {A:'#22c55e',B:'#84cc16',C:'#f59e0b',D:'#f97316',F:'#ef4444'};

const WIND_COLORS = {1:'#bfdbfe',2:'#bfdbfe',3:'#60a5fa',4:'#2563eb',5:'#1e3a8a'};
const WAVE_COLORS = {1:'#d1fae5',2:'#6ee7b7',3:'#10b981',4:'#047857',5:'#064e3b'};

// Simplified atmospheric circulation model (trade winds / westerlies / polar easterlies by
// latitude band) so wind/wave glyphs vary sensibly by region instead of one direction for
// the whole planet. Not live meteorological data — that would need a gridded wind API.
function prevailingDir(lat, lng) {
  const a = Math.abs(lat);
  const base = a < 30 ? (lat >= 0 ? 235 : 305) : a < 60 ? (lat >= 0 ? 65 : 115) : (lat >= 0 ? 235 : 305);
  const jitter = Math.sin(lng * Math.PI / 180) * 16;
  return (base + jitter + 360) % 360;
}

function metricAvg(spotsArr, metric, month) {
  const vals = spotsArr.map(s => s[metric]?.[month] ?? s.seasonal?.[metric]?.[month] ?? 3);
  return vals.reduce((a, b) => a + b, 0) / vals.length;
}

function vectorColor(kts) {
  return kts > 25 ? '#f97316' : kts > 15 ? '#f59e0b' : kts > 8 ? '#22c55e' : '#93c5fd';
}

function computeVector(cl, metric, month) {
  const kts = metricAvg(cl.spots, metric, month) * 6;
  const dirDeg = prevailingDir(cl.lat, cl.lng);
  return { dirDeg, dirRad: dirDeg * Math.PI / 180, kts, col: vectorColor(kts) };
}

function bboxCenterAndSpan(spotsArr) {
  let minLat = 90, maxLat = -90, minLng = 180, maxLng = -180;
  for (const s of spotsArr) {
    minLat = Math.min(minLat, s.lat); maxLat = Math.max(maxLat, s.lat);
    minLng = Math.min(minLng, s.lng); maxLng = Math.max(maxLng, s.lng);
  }
  return { lat: (minLat + maxLat) / 2, lng: (minLng + maxLng) / 2, span: Math.max(maxLat - minLat, maxLng - minLng, 0.4) };
}

function zoomForSpan(span) {
  return Math.max(1.6, Math.min(12, 26 / span));
}

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

function WindArrowGlyph({ dirDeg, kts, color }) {
  const len = 7 + Math.min(kts, 30) * 0.32;
  return (
    <g transform={`rotate(${dirDeg})`} style={{pointerEvents:"none"}} opacity={0.9}>
      <line x1={0} y1={len} x2={0} y2={-len} stroke={color} strokeWidth={1.4} strokeLinecap="round"/>
      <polygon points={`0,${-len-4} -3,${-len+3} 3,${-len+3}`} fill={color}/>
    </g>
  );
}

function WindBarbGlyph({ dirDeg, kts, color }) {
  const L = 14;
  const flags = [];
  let rem = Math.round(kts/5)*5, y = -L, i = 0;
  while (rem >= 50) { flags.push(<polygon key={i++} points={`0,${y} 6,${y+3} 0,${y+6}`} fill={color}/>); y += 7; rem -= 50; }
  while (rem >= 10) { flags.push(<line key={i++} x1={0} y1={y} x2={6} y2={y-3} stroke={color} strokeWidth={1.1}/>); y += 4; rem -= 10; }
  if (rem >= 5) flags.push(<line key={i} x1={0} y1={y} x2={3.5} y2={y-1.5} stroke={color} strokeWidth={1.1}/>);
  return (
    <g transform={`rotate(${dirDeg})`} style={{pointerEvents:"none"}} opacity={0.9}>
      <line x1={0} y1={0} x2={0} y2={-L} stroke={color} strokeWidth={1.1}/>
      {flags}
      <circle r={1.8} fill={color}/>
    </g>
  );
}

// Markers live inside a group that gets scale(zoom) applied to it, so without this their fixed-size
// circles/text/glyphs would balloon at high zoom and shrink to dust at low zoom. Counter-scale by
// 1/k (read live from context, not React state, so it stays correct mid-gesture too).
function ScaleFix({ children }) {
  const { k } = useZoomPanContext();
  return <g transform={`scale(${1 / (k || 1)})`}>{children}</g>;
}

function FlowGlyph({ id, vx, vy, color, registry }) {
  const elsRef = useRef([]);
  const N = 5;

  useEffect(() => {
    const particles = Array.from({length:N}, () => ({
      x: (Math.random()*2-1)*10, y: (Math.random()*2-1)*10, age: Math.random()
    }));
    registry.current.set(id, { els: elsRef.current, particles, vx, vy });
    return () => { registry.current.delete(id); };
  }, [id]);

  useEffect(() => {
    const entry = registry.current.get(id);
    if (entry) { entry.vx = vx; entry.vy = vy; entry.color = color; }
  }, [id, vx, vy, color, registry]);

  return (
    <g style={{pointerEvents:"none"}}>
      {Array.from({length:N}).map((_,i) => (
        <line key={i} ref={el => (elsRef.current[i] = el)} x1={0} y1={0} x2={0} y2={0} stroke={color} strokeWidth={1.2} strokeLinecap="round"/>
      ))}
    </g>
  );
}

export default function WorldMap({ spots, sport, month, selectedId, onSelect, T }) {
  const [zoom, setZoom] = useState(1);
  const [center, setCenter] = useState([10, 10]);
  const [showHeatmap, setShowHeatmap] = useState(false);
  const [mapMode, setMapMode] = useState("grade");
  const [vizMode, setVizMode] = useState("flow");
  const [popupCluster, setPopupCluster] = useState(null);
  const popupRef = useRef(null);
  const mapRef = useRef(null);
  const zoomAnimRef = useRef(null);
  const flowRegistry = useRef(new Map());

  const bg   = "#0e6fa0";
  const land = "#d4e6b0";
  const bord = "#5a8a50";
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

  // Smoothly animate zoom/center instead of snapping — used by +/- buttons, reset, region clicks.
  // Native drag/scroll gestures are already smooth (handled internally by the map library).
  const animateTo = useCallback((targetZoom, targetCenter, duration = 450) => {
    cancelAnimationFrame(zoomAnimRef.current);
    const sz = zoom, sc = center;
    const t0 = performance.now();
    const tick = (now) => {
      const t = Math.min(1, (now - t0) / duration);
      const e = t < 0.5 ? 4*t*t*t : 1 - Math.pow(-2*t+2, 3) / 2;
      setZoom(sz + (targetZoom - sz) * e);
      setCenter([sc[0] + (targetCenter[0]-sc[0])*e, sc[1] + (targetCenter[1]-sc[1])*e]);
      if (t < 1) zoomAnimRef.current = requestAnimationFrame(tick);
    };
    zoomAnimRef.current = requestAnimationFrame(tick);
  }, [zoom, center]);

  useEffect(() => () => cancelAnimationFrame(zoomAnimRef.current), []);

  const handleMoveEnd = useCallback(({ zoom: z, coordinates }) => { setZoom(z); setCenter(coordinates); }, []);

  // Single rAF loop driving every "flow" glyph on screen — mutates SVG line refs directly so
  // panning/zooming doesn't fight with React re-renders, and each glyph tracks its own map anchor.
  useEffect(() => {
    if (mapMode === "grade" || vizMode !== "flow") return;
    const R = 10;
    let raf;
    const tick = () => {
      flowRegistry.current.forEach(entry => {
        const { els, particles, vx, vy } = entry;
        particles.forEach((p, i) => {
          const ox = p.x, oy = p.y;
          p.x += vx; p.y += vy; p.age += 0.015;
          if (p.age >= 1 || Math.hypot(p.x, p.y) > R) {
            p.x = (Math.random()*2-1) * R * 0.5;
            p.y = (Math.random()*2-1) * R * 0.5;
            p.age = 0;
          }
          const el = els[i];
          if (el) {
            el.setAttribute('x1', ox); el.setAttribute('y1', oy);
            el.setAttribute('x2', p.x); el.setAttribute('y2', p.y);
            el.setAttribute('opacity', (Math.sin(Math.PI * Math.min(p.age, 1)) * 0.85).toFixed(2));
          }
        });
      });
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [mapMode, vizMode]);

  const getSpotColor = useCallback((s) => {
    if (mapMode === "wind") return WIND_COLORS[s.wind?.[month] ?? s.seasonal?.wind?.[month]] || '#bfdbfe';
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
    if (mapMode === "wind" || mapMode === "wave") return true;
    return showHeatmap;
  };

  const renderVectorGlyph = (cl) => {
    if (mapMode === "grade") return null;
    const v = computeVector(cl, mapMode === "wave" ? "swell" : "wind", month);
    if (vizMode === "arrows") return <WindArrowGlyph dirDeg={v.dirDeg} kts={v.kts} color={v.col}/>;
    if (vizMode === "barbs") return <WindBarbGlyph dirDeg={v.dirDeg} kts={v.kts} color={v.col}/>;
    if (vizMode === "flow") {
      const vx = Math.sin(v.dirRad) * v.kts * 0.03, vy = -Math.cos(v.dirRad) * v.kts * 0.03;
      return <FlowGlyph id={cl.id} vx={vx} vy={vy} color={v.col} registry={flowRegistry}/>;
    }
    return null;
  };

  const handleClusterClick = (cl, e) => {
    if (cl.isCluster && zoom >= 8) {
      // High zoom with overlapping spots: show popup
      const rect = mapRef.current?.getBoundingClientRect();
      const x = e ? e.clientX - (rect?.left || 0) : 0;
      const y = e ? e.clientY - (rect?.top || 0) : 0;
      setPopupCluster({ spots: cl.spots, lng: cl.lng, lat: cl.lat, x, y });
    } else if (cl.isCluster) {
      const { lat, lng, span } = bboxCenterAndSpan(cl.spots);
      animateTo(Math.max(zoomForSpan(span), zoom * 1.3), [lng, lat]);
      setPopupCluster(null);
    } else {
      onSelect(cl.spots[0]);
      setPopupCluster(null);
    }
  };

  const renderClusterDot = (cl) => {
    if (zoom < 2) return <circle r={8 + cl.spots.length * 1.5} fill="#94a3b8" stroke="white" strokeWidth={1.5} style={{cursor:"pointer",opacity:0.85}} />;
    if (zoom < 4) return <circle r={7 + cl.spots.length} fill="#94a3b8" stroke="white" strokeWidth={1.5} style={{cursor:"pointer",opacity:0.85}} />;
    return <circle r={6 + cl.spots.length * 0.5} fill="#94a3b8" stroke="white" strokeWidth={1.5} style={{cursor:"pointer",opacity:0.85}} />;
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

  const renderSpot = (cl, s) => {
    const g   = gradeLabel(gradeScore(s, sport, month));
    const col = getSpotColor(s);
    const sel = s.id === selectedId;
    const hc  = getHaloColor(s);
    return (
      <Marker key={cl.id} coordinates={[s.lng, s.lat]} onClick={() => { onSelect(s); setPopupCluster(null); }}>
        <ScaleFix>
          {showHalo(s) && <>
            <circle r={90} fill={hc} opacity={0.08} style={{pointerEvents:"none"}}/>
            <circle r={50} fill={hc} opacity={0.18} style={{pointerEvents:"none"}}/>
            <circle r={22} fill={hc} opacity={0.28} style={{pointerEvents:"none"}}/>
          </>}
          <circle r={sel?10:6} fill={col} stroke="white" strokeWidth={sel?2.5:1.5}
            style={{cursor:"pointer", filter:sel?`drop-shadow(0 0 8px ${col})`:"none", transition:"r .15s"}} />
          {renderVectorGlyph(cl)}
          {mapMode === "grade" && (
            <text textAnchor="middle" y={sel?-14:-10}
              style={{fontSize:sel?10:8, fontWeight:700, fill:col, fontFamily:"DM Mono,monospace", pointerEvents:"none", opacity:sel?1:0.85}}>
              {g}
            </text>
          )}
          {(sel || showLabels) && (
            <text textAnchor="middle" y={22}
              style={{fontSize:9, fontWeight:600, fill:sel?"white":"#475569", fontFamily:"DM Sans,sans-serif", pointerEvents:"none"}}>
              {s.name}
            </text>
          )}
        </ScaleFix>
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
        <ZoomableGroup zoom={zoom} center={center} minZoom={1} maxZoom={12} onMoveEnd={handleMoveEnd}>
          <Geographies geography={GEO_URL}>
            {({geographies}) => geographies.map(geo => (
              <Geography key={geo.rsmKey} geography={geo}
                style={{
                  default: {fill:land, stroke:bord, strokeWidth:0.8, outline:"none"},
                  hover:   {fill:land, stroke:bord, strokeWidth:0.8, outline:"none"},
                  pressed: {fill:land, stroke:bord, strokeWidth:0.8, outline:"none"},
                }}
              />
            ))}
          </Geographies>
          {clusters.map(cl => {
            if (cl.isCluster) {
              return (
                <Marker key={cl.id} coordinates={[cl.lng, cl.lat]}
                  onClick={(e) => handleClusterClick(cl, e)}>
                  <ScaleFix>
                    {renderClusterDot(cl)}
                    {renderVectorGlyph(cl)}
                    {renderClusterText(cl)}
                  </ScaleFix>
                </Marker>
              );
            }
            return renderSpot(cl, cl.spots[0]);
          })}
        </ZoomableGroup>
      </ComposableMap>

      {/* Map mode toggles — top right row 1 */}
      <div style={{position:"absolute",top:12,right:12,display:"flex",gap:4}}>
        {[["grade","Grade"],["wind","Wind"],["wave","Wave"]].map(([mode,label]) => {
          const active = mapMode === mode;
          return (
            <button key={mode} onClick={() => setMapMode(mode)}
              style={{height:28,padding:"0 10px",borderRadius:4,border:"1px solid "+(active?"#0ea5e9":"#334155"),
                background:active?"#0ea5e9":"rgba(15,23,42,0.8)",color:active?"white":"#94a3b8",fontSize:10,fontWeight:600,cursor:"pointer",
                fontFamily:"DM Sans,sans-serif",boxShadow:"0 1px 4px rgba(0,0,0,0.2)",transition:"all .15s"}}>
              {label}
            </button>
          );
        })}
      </div>

      {/* Viz sub-mode toggles — row 2 (wind/wave only) */}
      {mapMode !== "grade" && (
        <div style={{position:"absolute",top:48,right:12,display:"flex",gap:3}}>
          {[["arrows","Arrows"],["flow","Flow"],["barbs","Barbs"]].map(([m,l]) => (
            <button key={m} onClick={() => setVizMode(m)}
              style={{height:24,padding:"0 8px",borderRadius:3,
                border:"1px solid "+(vizMode===m?"#0ea5e9":"#334155"),
                background:vizMode===m?"#0ea5e9":"rgba(15,23,42,0.8)",
                color:vizMode===m?"white":"#94a3b8",fontSize:9,fontWeight:600,cursor:"pointer",
                fontFamily:"DM Sans,sans-serif",transition:"all .12s"}}>
              {l}
            </button>
          ))}
        </div>
      )}

      {/* Heatmap toggle — row 2 in grade mode */}
      {mapMode === "grade" && (
        <button onClick={() => setShowHeatmap(h => !h)}
          style={{position:"absolute",top:48,right:12,padding:"5px 12px",borderRadius:4,border:"1px solid "+(showHeatmap?"#0ea5e9":"#334155"),
            background:showHeatmap?"#0ea5e9":"rgba(15,23,42,0.8)",color:showHeatmap?"white":"#94a3b8",fontSize:11,fontWeight:600,cursor:"pointer",
            fontFamily:"DM Sans,sans-serif",boxShadow:"0 1px 4px rgba(0,0,0,0.2)",transition:"all .15s"}}>
          Heatmap
        </button>
      )}

      {/* Zoom controls — bottom left */}
      <div style={{position:"absolute",bottom:16,left:16,display:"flex",flexDirection:"column",gap:4}}>
        {[["+",()=>animateTo(Math.min(zoom*1.6,12), center)],
          ["−",()=>animateTo(Math.max(zoom/1.6,1), center)],
          ["↺",()=>{animateTo(1,[10,10]);setPopupCluster(null);}]].map(([label,fn],i)=>(
          <button key={i} onClick={fn}
            style={{width:28,height:28,borderRadius:4,border:"none",background:"white",color:"#0ea5e9",fontSize:16,fontWeight:700,
              cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",
              boxShadow:"0 1px 4px rgba(0,0,0,0.18)",lineHeight:1}}>
            {label}
          </button>
        ))}
      </div>

      {/* Legend — bottom right */}
      <div style={{position:"absolute",bottom:16,right:16,display:"flex",gap:8,background:"rgba(255,255,255,0.9)",backdropFilter:"blur(8px)",padding:"8px 12px",borderRadius:6,border:`1px solid ${bord}`}}>
        {mapMode === "grade" ? (
          [["A","#22c55e"],["B","#6366f1"],["C","#f59e0b"],["D","#f97316"],["F","#f43f5e"]].map(([g,c])=>(
            <div key={g} style={{display:"flex",alignItems:"center",gap:4}}>
              <div style={{width:8,height:8,borderRadius:"50%",background:c}}/>
              <span style={{fontSize:10,color:"#64748b",fontFamily:"DM Mono,monospace",fontWeight:600}}>{g}</span>
            </div>
          ))
        ) : mapMode === "wind" ? (
          [["Low","#bfdbfe"],["Med","#60a5fa"],["High","#1e3a8a"]].map(([v,c])=>(
            <div key={v} style={{display:"flex",alignItems:"center",gap:4}}>
              <div style={{width:8,height:8,borderRadius:"50%",background:c}}/>
              <span style={{fontSize:10,color:"#64748b",fontFamily:"DM Mono,monospace",fontWeight:600}}>{v}</span>
            </div>
          ))
        ) : (
          [["Low","#d1fae5"],["Med","#10b981"],["High","#064e3b"]].map(([v,c])=>(
            <div key={v} style={{display:"flex",alignItems:"center",gap:4}}>
              <div style={{width:8,height:8,borderRadius:"50%",background:c}}/>
              <span style={{fontSize:10,color:"#64748b",fontFamily:"DM Mono,monospace",fontWeight:600}}>{v}</span>
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
