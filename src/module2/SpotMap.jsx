import { useState, useEffect, useRef, useCallback } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { S } from '../data/spots';
import { RC } from '../shared/theme';

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
        if (mode === "wind" && wind) {
          const alignedDist = dx * Math.sin(windRad) - dy * Math.cos(windRad);
          const crossDist = dx * Math.cos(windRad) + dy * Math.sin(windRad);
          const variation =
            Math.sin(alignedDist / 40) * 0.12 +
            Math.sin(crossDist / 30 + alignedDist / 80) * 0.08;
          intensity = Math.max(0, Math.min(0.85, intensity + variation));
          const spd = wind;
          let r, g, b;
          if (spd < 8)       { r=191; g=219; b=254; }
          else if (spd < 15) { r=96;  g=165; b=250; }
          else if (spd < 25) { r=14;  g=165; b=233; }
          else if (spd < 35) { r=249; g=115; b=22;  }
          else               { r=239; g=68;  b=68;  }
          ctx.fillStyle = `rgba(${r},${g},${b},${intensity * 0.55})`;
        } else if (mode === "wave" && wave) {
          const perpDist = dx * Math.cos(swellRad) + dy * Math.sin(swellRad);
          const variation = Math.sin(perpDist / 25) * 0.18;
          intensity = Math.max(0, Math.min(0.85, intensity + variation));
          const ht = wave;
          let r, g, b;
          if (ht < 0.5)     { r=209; g=250; b=229; }
          else if (ht < 1)  { r=110; g=231; b=183; }
          else if (ht < 2)  { r=16;  g=185; b=129; }
          else if (ht < 3)  { r=4;   g=120; b=87;  }
          else              { r=6;   g=78;  b=59;  }
          ctx.fillStyle = `rgba(${r},${g},${b},${intensity * 0.55})`;
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

// ── ZoomControls (needs map ref) ───────────────────────────────────────────
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

// ── Main SpotMap ───────────────────────────────────────────────────────────
export default function SpotMap({ spot, windDir, swellDir, wind, wave, onSelectNearby }) {
  const [mapMode, setMapMode] = useState("wind");

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
        <HeatmapCanvas windDir={windDir} wind={wind} wave={wave} swellDir={swellDir} mode={mapMode} spot={spot} />
        <WindArrows windDir={windDir} wind={wind} mode={mapMode} />
        <NearbySpots nearby={nearby} onSelectNearby={onSelectNearby} RC={RC} />
        <MainSpotMarker spot={spot} windDir={windDir} mode={mapMode} />
        <ZoomReset spot={spot} />
        <ZoomControls spot={spot} />
      </MapContainer>

      {/* Mode toggles overlay */}
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

      {/* Spot info overlay */}
      <div style={{
        position: "absolute", top: 14, left: 14, zIndex: 1000,
        background: "rgba(255,255,255,0.92)", backdropFilter: "blur(8px)",
        padding: "8px 12px", borderRadius: 5, border: `1px solid ${bord}`,
      }}>
        <div style={{ fontSize: 13, fontWeight: 800, color: "#0f172a", fontFamily: "Syne,sans-serif", letterSpacing: -0.3 }}>{spot.name}</div>
        <div style={{ fontSize: 10, color: "#94a3b8" }}>{spot.country} · {spot.region}</div>
        {windDir != null && <div style={{ fontSize: 9, color: "#0ea5e9", marginTop: 3, fontWeight: 600, fontFamily: "DM Mono,monospace" }}>WIND {Math.round(windDir)}°{wind ? ` · ${Math.round(wind)} kts` : ""}</div>}
        {swellDir != null && <div style={{ fontSize: 9, color: "#0891b2", marginTop: 2, fontWeight: 600, fontFamily: "DM Mono,monospace" }}>SWELL {Math.round(swellDir)}°{wave ? ` · ${wave.toFixed(1)} m` : ""}</div>}
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
