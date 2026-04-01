import { useState, useEffect, useRef, useCallback } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { S } from '../data/spots';
import { RC } from '../shared/theme';

// ── Color ramps ─────────────────────────────────────────────────────────────
function windRampColor(kts) {
  if (kts <= 0)  return [147, 197, 253, 0.08];
  if (kts <= 8)  return [56,  189, 248, 0.18];
  if (kts <= 15) return [34,  197, 94,  0.25];
  if (kts <= 22) return [234, 179, 8,   0.30];
  if (kts <= 30) return [249, 115, 22,  0.38];
  return              [239, 68,  68,  0.45];
}

function waveRampColor(m) {
  if (m <= 0)   return [186, 230, 253, 0.08];
  if (m <= 0.5) return [125, 211, 252, 0.18];
  if (m <= 1.0) return [56,  189, 248, 0.25];
  if (m <= 1.5) return [14,  165, 233, 0.32];
  if (m <= 2.5) return [30,  58,  138, 0.38];
  return              [15,  23,  42,  0.50];
}

// ── HeatmapCanvas ──────────────────────────────────────────────────────────
function HeatmapCanvas({ windDir, wind, wave, swellDir, mode, spot }) {
  const map = useMap();
  const canvasRef = useRef(null);

  const drawHeatmap = useCallback(() => {
    if (mode === "off" || (!wind && !wave)) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const size = map.getSize();
    canvas.width = size.x;
    canvas.height = size.y;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const cellSize = 18;
    const cols = Math.ceil(size.x / cellSize) + 2;
    const rows = Math.ceil(size.y / cellSize) + 2;
    const centerPx = map.latLngToContainerPoint([spot.lat, spot.lng]);
    for (let col = -1; col < cols; col++) {
      for (let row = -1; row < rows; row++) {
        const px = col * cellSize;
        const py = row * cellSize;
        const dx = px + cellSize / 2 - centerPx.x;
        const dy = py + cellSize / 2 - centerPx.y;
        const distPx = Math.sqrt(dx * dx + dy * dy);
        const maxDist = Math.max(size.x, size.y) * 0.7;
        let intensity = Math.max(0, 1 - distPx / maxDist);
        const windRad = ((windDir || 0) * Math.PI) / 180;
        const swellRad = ((swellDir || 0) * Math.PI) / 180;
        let r, g, b, a;
        if (mode === "wind" && wind) {
          const alignedDist = dx * Math.sin(windRad) - dy * Math.cos(windRad);
          const crossDist = dx * Math.cos(windRad) + dy * Math.sin(windRad);
          const variation =
            Math.sin(alignedDist / 40) * 0.12 +
            Math.sin(crossDist / 30 + alignedDist / 80) * 0.08;
          intensity = Math.max(0, Math.min(0.85, intensity + variation));
          const localSpd = wind * (0.7 + intensity * 0.6);
          [r, g, b, a] = windRampColor(localSpd);
          ctx.fillStyle = `rgba(${r},${g},${b},${a * intensity})`;
        } else if (mode === "wave" && wave) {
          const perpDist = dx * Math.cos(swellRad) + dy * Math.sin(swellRad);
          const variation = Math.sin(perpDist / 25) * 0.18;
          intensity = Math.max(0, Math.min(0.85, intensity + variation));
          const localWave = wave * (0.7 + intensity * 0.6);
          [r, g, b, a] = waveRampColor(localWave);
          ctx.fillStyle = `rgba(${r},${g},${b},${a * intensity})`;
        } else {
          continue;
        }
        ctx.fillRect(px, py, cellSize + 1, cellSize + 1);
      }
    }
  }, [map, mode, wind, wave, windDir, swellDir, spot]);

  useEffect(() => {
    const canvas = document.createElement("canvas");
    canvasRef.current = canvas;
    canvas.style.cssText = "position:absolute;top:0;left:0;pointer-events:none;z-index:400;";
    const container = map.getContainer();
    const panes = container.querySelector(".leaflet-map-pane");
    if (panes) panes.appendChild(canvas);
    drawHeatmap();
    map.on("moveend zoomend resize", drawHeatmap);
    return () => {
      canvas.remove();
      map.off("moveend zoomend resize", drawHeatmap);
    };
  }, [map, drawHeatmap]);

  useEffect(() => { drawHeatmap(); }, [drawHeatmap]);

  return null;
}

// ── WindArrows ─────────────────────────────────────────────────────────────
function WindArrows({ windDir, wind, mode }) {
  const map = useMap();
  const containerRef = useRef(null);

  const drawArrows = useCallback(() => {
    if (mode !== "wind" || windDir == null) {
      if (containerRef.current) containerRef.current.innerHTML = "";
      return;
    }
    const container = containerRef.current;
    if (!container) return;
    const size = map.getSize();
    const spacing = 60;
    const cols = Math.floor(size.x / spacing) + 1;
    const rows = Math.floor(size.y / spacing) + 1;
    const arrows = [];
    for (let c = 0; c < cols; c++) {
      for (let r = 0; r < rows; r++) {
        const x = (c + 0.5) * spacing;
        const y = (r + 0.5) * spacing;
        const jx = ((c * 7 + r * 13) % 11 - 5) * 2;
        const jy = ((c * 11 + r * 7) % 9 - 4) * 2;
        const spd = wind || 15;
        const len = 10 + Math.min(spd, 30) * 0.4;
        arrows.push(
          `<g transform="translate(${x + jx},${y + jy}) rotate(${windDir})">` +
          `<line x1="0" y1="${-len}" x2="0" y2="${len * 0.5}" stroke="#1e3a8a" stroke-width="1.5" stroke-linecap="round" opacity="0.8"/>` +
          `<polygon points="0,${-len - 5} ${-4},${-len + 4} ${4},${-len + 4}" fill="#1e3a8a" opacity="0.85"/>` +
          `</g>`
        );
      }
    }
    container.innerHTML =
      `<svg style="position:absolute;top:0;left:0;width:100%;height:100%;pointer-events:none" width="${size.x}" height="${size.y}">` +
      arrows.join("") +
      `</svg>`;
  }, [map, windDir, wind, mode]);

  useEffect(() => {
    const div = document.createElement("div");
    div.style.cssText = "position:absolute;top:0;left:0;width:100%;height:100%;z-index:401;pointer-events:none;";
    containerRef.current = div;
    const container = map.getContainer();
    const panes = container.querySelector(".leaflet-map-pane");
    if (panes) panes.appendChild(div);
    drawArrows();
    map.on("moveend zoomend resize", drawArrows);
    return () => {
      div.remove();
      map.off("moveend zoomend resize", drawArrows);
    };
  }, [map, drawArrows]);

  useEffect(() => { drawArrows(); }, [drawArrows]);

  return null;
}

// ── ParticleCanvas ──────────────────────────────────────────────────────────
function ParticleCanvas({ windDir, wind, wave, mode }) {
  const map = useMap();
  const canvasRef = useRef(null);
  const animRef = useRef(null);
  const particlesRef = useRef([]);

  useEffect(() => {
    const size = map.getSize();
    let canvas = document.getElementById('waveiq-particles');
    if (!canvas) {
      canvas = document.createElement('canvas');
      canvas.id = 'waveiq-particles';
      canvas.style.cssText = 'position:absolute;top:0;left:0;pointer-events:none;z-index:450;';
      map.getPanes().overlayPane.appendChild(canvas);
    }
    canvas.width = size.x;
    canvas.height = size.y;
    canvasRef.current = canvas;

    const W = size.x, H = size.y;
    const COUNT = 350;
    const MAX_AGE = 80;

    const speedColor = (spd) => {
      if (spd > 30) return '#ef4444';
      if (spd > 20) return '#f97316';
      if (spd > 12) return '#f59e0b';
      if (spd > 6)  return '#22c55e';
      return '#93c5fd';
    };

    const waveColor = (h) => {
      if (h > 3)   return '#1e3a8a';
      if (h > 2)   return '#1d4ed8';
      if (h > 1)   return '#3b82f6';
      if (h > 0.5) return '#7dd3fc';
      return '#bae6fd';
    };

    const dirRad = (windDir || 0) * Math.PI / 180;
    const col = mode === 'wave' ? waveColor(wave || 0) : speedColor(wind || 0);
    const speed = mode === 'wave' ? Math.max(0.4, (wave || 0) * 0.6) : Math.max(0.4, (wind || 0) * 0.12);
    const vx = Math.sin(dirRad) * speed;
    const vy = -Math.cos(dirRad) * speed;

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
      const pts = particlesRef.current;
      for (let i = 0; i < pts.length; i++) {
        const p = pts[i];
        p.age++;
        if (p.age >= MAX_AGE || p.x < 0 || p.x > W || p.y < 0 || p.y > H) {
          p.x = Math.random() * W;
          p.y = Math.random() * H;
          p.age = 0;
        }
        p.x += vx;
        p.y += vy;
        const alpha = Math.sin(Math.PI * p.age / MAX_AGE) * 0.85;
        ctx.globalAlpha = alpha;
        ctx.fillStyle = col;
        ctx.fillRect(p.x - 1.5, p.y - 1.5, 3, 3);
      }
      ctx.globalAlpha = 1;
      animRef.current = requestAnimationFrame(animate);
    };

    animate();

    const onResize = () => {
      const s = map.getSize();
      canvas.width = s.x; canvas.height = s.y;
      particlesRef.current = [];
    };
    map.on('resize', onResize);

    return () => {
      cancelAnimationFrame(animRef.current);
      map.off('resize', onResize);
      if (canvas.parentNode) canvas.parentNode.removeChild(canvas);
      canvasRef.current = null;
      particlesRef.current = [];
    };
  }, [map, windDir, wind, wave, mode]); // eslint-disable-line

  return null;
}

// ── drawBarb helper ─────────────────────────────────────────────────────────
function drawBarb(ctx, cx, cy, dirRad, spd, col) {
  const L = 28;
  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate(dirRad);
  ctx.strokeStyle = col;
  ctx.lineWidth = 1.4;
  ctx.globalAlpha = 0.85;

  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.lineTo(0, -L);
  ctx.stroke();

  let remaining = Math.round(spd / 5) * 5;
  let y = -L;
  const featherLen = 10;
  const featherGap = 5;

  while (remaining >= 50) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(featherLen, y + 4);
    ctx.lineTo(0, y + 8);
    ctx.closePath();
    ctx.fillStyle = col;
    ctx.fill();
    y += 9;
    remaining -= 50;
  }
  while (remaining >= 10) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(featherLen, y - 4);
    ctx.stroke();
    y += featherGap;
    remaining -= 10;
  }
  if (remaining >= 5) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(featherLen * 0.5, y - 2);
    ctx.stroke();
  }

  ctx.beginPath();
  ctx.arc(0, 0, 2.5, 0, Math.PI * 2);
  ctx.fillStyle = col;
  ctx.fill();

  ctx.restore();
}

// ── WindBarbs ───────────────────────────────────────────────────────────────
function WindBarbs({ windDir, wind, mode }) {
  const map = useMap();

  const draw = useCallback(() => {
    let canvas = document.getElementById('waveiq-barbs');
    if (!canvas) {
      canvas = document.createElement('canvas');
      canvas.id = 'waveiq-barbs';
      canvas.style.cssText = 'position:absolute;top:0;left:0;pointer-events:none;z-index:449;';
      map.getPanes().overlayPane.appendChild(canvas);
    }
    const size = map.getSize();
    canvas.width = size.x; canvas.height = size.y;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, size.x, size.y);

    if (!wind || mode === 'off') return;

    const SPACING = 70;
    const cols = Math.ceil(size.x / SPACING) + 1;
    const rows = Math.ceil(size.y / SPACING) + 1;
    const dirRad = (windDir || 0) * Math.PI / 180;
    const spd = wind;
    const col = spd > 30 ? '#ef4444' : spd > 20 ? '#f97316' : spd > 12 ? '#f59e0b' : '#60a5fa';

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const cx = (c + 0.5) * SPACING;
        const cy = (r + 0.5) * SPACING;
        drawBarb(ctx, cx, cy, dirRad, spd, col);
      }
    }
  }, [map, windDir, wind, mode]);

  useEffect(() => {
    draw();
    map.on('moveend zoomend resize', draw);
    return () => {
      map.off('moveend zoomend resize', draw);
      const canvas = document.getElementById('waveiq-barbs');
      if (canvas?.parentNode) canvas.parentNode.removeChild(canvas);
    };
  }, [map, draw]);

  return null;
}

// ── NearbySpots ────────────────────────────────────────────────────────────
function NearbySpots({ nearby, onSelectNearby, RC: regionColors }) {
  return nearby.map(s => {
    const color = regionColors[s.region] || "#0ea5e9";
    const icon = L.divIcon({
      html: `<div style="width:10px;height:10px;background:${color};border:2px solid white;border-radius:50%;cursor:pointer;box-shadow:0 1px 3px rgba(0,0,0,0.3)"></div>`,
      className: "",
      iconSize: [10, 10],
      iconAnchor: [5, 5],
    });
    return (
      <Marker key={s.id} position={[s.lat, s.lng]} icon={icon}
        eventHandlers={{ click: () => onSelectNearby?.(s) }}>
        <Popup offset={[0, -5]}>
          <div style={{ fontFamily: "DM Sans,sans-serif", fontSize: 12, fontWeight: 600 }}>{s.name}</div>
        </Popup>
      </Marker>
    );
  });
}

// ── MainSpotMarker ─────────────────────────────────────────────────────────
function MainSpotMarker({ spot, windDir, mode }) {
  const windArrow = windDir != null && mode === "wind"
    ? `<svg width="40" height="50" viewBox="-20 -40 40 50" style="overflow:visible">` +
      `<g transform="rotate(${windDir})">` +
      `<line x1="0" y1="-32" x2="0" y2="-18" stroke="#0ea5e9" stroke-width="2.5" stroke-linecap="round"/>` +
      `<polygon points="0,-35 -4,-27 4,-27" fill="#0ea5e9"/>` +
      `</g>` +
      `<circle cx="0" cy="0" r="13" fill="#0ea5e9" stroke="white" stroke-width="3" style="filter:drop-shadow(0 0 6px #0ea5e988)"/>` +
      `<text x="0" y="4" text-anchor="middle" font-size="9" font-weight="800" fill="white" font-family="DM Mono,monospace" letter-spacing="0.5">${spot.name.slice(0, 3).toUpperCase()}</text>` +
      `</svg>`
    : `<svg width="30" height="30" viewBox="-15 -15 30 30" style="overflow:visible">` +
      `<circle cx="0" cy="0" r="13" fill="#0ea5e9" stroke="white" stroke-width="3" style="filter:drop-shadow(0 0 6px #0ea5e988)"/>` +
      `<text x="0" y="4" text-anchor="middle" font-size="9" font-weight="800" fill="white" font-family="DM Mono,monospace" letter-spacing="0.5">${spot.name.slice(0, 3).toUpperCase()}</text>` +
      `</svg>`;

  const icon = L.divIcon({
    html: windArrow,
    className: "",
    iconSize: [30, 30],
    iconAnchor: [15, 15],
  });

  return <Marker position={[spot.lat, spot.lng]} icon={icon} zIndexOffset={1000} />;
}

// ── ZoomReset ──────────────────────────────────────────────────────────────
function ZoomReset({ spot }) {
  const map = useMap();
  useEffect(() => {
    map.setView([spot.lat, spot.lng], 13);
  }, [spot.id]); // eslint-disable-line
  return null;
}

// ── ZoomControls ───────────────────────────────────────────────────────────
function ZoomControls({ spot }) {
  const map = useMap();
  const btnStyle = {
    width: 28, height: 28, borderRadius: 4, border: "none", background: "white",
    color: "#0ea5e9", fontSize: 16, fontWeight: 700, cursor: "pointer",
    display: "flex", alignItems: "center", justifyContent: "center",
    boxShadow: "0 1px 4px rgba(0,0,0,0.18)", lineHeight: 1,
  };
  return (
    <div style={{ position: "absolute", bottom: 50, left: 14, display: "flex", flexDirection: "column", gap: 4, zIndex: 1000 }}>
      <button style={btnStyle} onClick={() => map.zoomIn()}>+</button>
      <button style={btnStyle} onClick={() => map.zoomOut()}>−</button>
      <button style={btnStyle} onClick={() => map.setView([spot.lat, spot.lng], 13)}>↺</button>
    </div>
  );
}

// ── VizLayer — renders the active viz component inside MapContainer ─────────
function VizLayer({ vizMode, mapMode, liveWindDir, liveWind, liveWave }) {
  if (mapMode === "off") return null;
  if (vizMode === "particles") return <ParticleCanvas windDir={liveWindDir} wind={liveWind} wave={liveWave} mode={mapMode}/>;
  if (vizMode === "barbs")     return <WindBarbs windDir={liveWindDir} wind={liveWind} mode={mapMode}/>;
  return <WindArrows windDir={liveWindDir} wind={liveWind} mode={mapMode}/>;
}

// ── Main SpotMap ───────────────────────────────────────────────────────────
export default function SpotMap({ spot, windDir, swellDir, wind, wave, hourlyW, hourlyM, onSelectNearby }) {
  const [mapMode, setMapMode] = useState("wind");
  const [vizMode, setVizMode] = useState("arrows");
  const [timeIdx, setTimeIdx] = useState(0);

  // Derive hourly arrays
  const hTimes = hourlyW?.time || [];
  const hWind  = hourlyW?.wind_speed_10m || [];
  const hDir   = hourlyW?.wind_direction_10m || [];
  const hWave  = hourlyM?.wave_height || [];

  // Live values from scrubber or fallback to current props
  const liveWind    = hWind[timeIdx]  != null ? Math.round(hWind[timeIdx])  : (wind  || 0);
  const liveWindDir = hDir[timeIdx]   != null ? hDir[timeIdx]               : (windDir || 0);
  const liveWave    = hWave[timeIdx]  != null ? hWave[timeIdx]              : (wave  || 0);

  // Format scrubber label
  const timeLabel = hTimes[timeIdx]
    ? (() => { const d = new Date(hTimes[timeIdx]); return d.toLocaleDateString("en-US",{weekday:"short"})+" "+d.getHours().toString().padStart(2,"0")+":00"; })()
    : "NOW";

  const nearby = S.filter(s => s.id !== spot.id).map(s => {
    const dlat = s.lat - spot.lat, dlng = s.lng - spot.lng;
    return { ...s, dist: Math.sqrt(dlat * dlat + dlng * dlng) };
  }).filter(s => s.dist < 1.5).sort((a, b) => a.dist - b.dist).slice(0, 6);

  const bord = "#a8ccc0";

  return (
    <div style={{ width: "100%", height: "100%", position: "relative", fontFamily: "DM Sans,sans-serif" }}>
      <MapContainer
        key={spot.id}
        center={[spot.lat, spot.lng]}
        zoom={13}
        style={{ width: "100%", height: "100%" }}
        zoomControl={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <HeatmapCanvas windDir={liveWindDir} wind={liveWind} wave={liveWave} swellDir={swellDir} mode={mapMode} spot={spot} />
        <VizLayer vizMode={vizMode} mapMode={mapMode} liveWindDir={liveWindDir} liveWind={liveWind} liveWave={liveWave}/>
        <NearbySpots nearby={nearby} onSelectNearby={onSelectNearby} RC={RC} />
        <MainSpotMarker spot={spot} windDir={liveWindDir} mode={mapMode} />
        <ZoomReset spot={spot} />
        <ZoomControls spot={spot} />
      </MapContainer>

      {/* Mode toggles overlay — top right row 1 */}
      <div style={{ position: "absolute", top: 12, right: 12, display: "flex", gap: 4, zIndex: 1000 }}>
        {[["wind", "Wind"], ["wave", "Wave"], ["off", "Off"]].map(([mode, label]) => {
          const active = mapMode === mode;
          return (
            <button key={mode} onClick={() => setMapMode(mode)}
              style={{
                height: 26, padding: "0 10px", borderRadius: 4,
                border: "1px solid " + (active ? "#0ea5e9" : "#cbd5e1"),
                background: active ? "#0ea5e9" : "white",
                color: active ? "white" : "#64748b",
                fontSize: 10, fontWeight: 600, cursor: "pointer",
                fontFamily: "DM Sans,sans-serif",
                boxShadow: "0 1px 4px rgba(0,0,0,0.12)", transition: "all .15s",
              }}>
              {label}
            </button>
          );
        })}
      </div>

      {/* Viz mode toggles — top right row 2 (only when map is on) */}
      {mapMode !== "off" && (
        <div style={{position:"absolute",top:48,right:12,display:"flex",gap:3,zIndex:1000}}>
          {[["arrows","Arrows"],["particles","Particles"],["barbs","Barbs"]].map(([m,l]) => (
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

      {/* Timeline scrubber — above nearby count badge */}
      {hTimes.length > 0 && (
        <div style={{position:"absolute",bottom:44,left:0,right:0,zIndex:1000,padding:"6px 12px",
          background:"rgba(15,23,42,0.82)",backdropFilter:"blur(6px)",borderTop:"1px solid rgba(255,255,255,0.08)"}}>
          <div style={{display:"flex",alignItems:"center",gap:8}}>
            <span style={{fontSize:9,color:"#94a3b8",fontFamily:"DM Mono,monospace",whiteSpace:"nowrap",minWidth:80}}>{timeLabel}</span>
            <input type="range" min={0} max={Math.max(0,hTimes.length-1)} value={timeIdx}
              onChange={e => setTimeIdx(Number(e.target.value))}
              style={{flex:1,height:3,accentColor:"#0ea5e9",cursor:"pointer"}}/>
            <button onClick={() => setTimeIdx(0)}
              style={{background:"none",border:"1px solid #334155",color:"#94a3b8",fontSize:9,padding:"2px 6px",borderRadius:3,cursor:"pointer",fontFamily:"DM Mono,monospace",whiteSpace:"nowrap"}}>
              NOW
            </button>
          </div>
        </div>
      )}

      {/* Spot info overlay */}
      <div style={{
        position: "absolute", top: 14, left: 14, zIndex: 1000,
        background: "rgba(255,255,255,0.92)", backdropFilter: "blur(8px)",
        padding: "8px 12px", borderRadius: 5, border: `1px solid ${bord}`,
      }}>
        <div style={{ fontSize: 13, fontWeight: 800, color: "#0f172a", fontFamily: "Syne,sans-serif", letterSpacing: -0.3 }}>{spot.name}</div>
        <div style={{ fontSize: 10, color: "#94a3b8" }}>{spot.country} · {spot.region}</div>
        {liveWindDir != null && <div style={{ fontSize: 9, color: "#0ea5e9", marginTop: 3, fontWeight: 600, fontFamily: "DM Mono,monospace" }}>WIND {Math.round(liveWindDir)}°{liveWind ? ` · ${Math.round(liveWind)} kts` : ""}</div>}
        {swellDir != null && <div style={{ fontSize: 9, color: "#0891b2", marginTop: 2, fontWeight: 600, fontFamily: "DM Mono,monospace" }}>SWELL {Math.round(swellDir)}°{liveWave ? ` · ${liveWave.toFixed(1)} m` : ""}</div>}
      </div>

      {/* Nearby count */}
      {nearby.length > 0 && (
        <div style={{
          position: "absolute", bottom: 14, right: 14, zIndex: 1000,
          background: "rgba(255,255,255,0.85)", backdropFilter: "blur(6px)",
          padding: "5px 9px", borderRadius: 4, border: `1px solid ${bord}`,
        }}>
          <div style={{ fontSize: 9, color: "#94a3b8", fontWeight: 600 }}>{nearby.length} nearby spot{nearby.length > 1 ? "s" : ""}</div>
        </div>
      )}
    </div>
  );
}
