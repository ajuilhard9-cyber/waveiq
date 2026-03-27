import { useState } from 'react';
import { ComposableMap, Geographies, Geography, Marker, ZoomableGroup } from 'react-simple-maps';
import { gradeScore, gradeLabel, gradeColor } from '../data/spots';

const GEO_URL = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

export default function WorldMap({ spots, sport, month, selectedId, onSelect, dark }) {
  const [zoom, setZoom] = useState(1);
  const [center, setCenter] = useState([10, 10]);
  const bg   = dark ? "#0b1120" : "#c2dff5";
  const land = dark ? "#162035" : "#d4e8cc";
  const bord = dark ? "#1e2d45" : "#b0ccb8";
  const showLabels = zoom > 2;

  return (
    <div style={{width:"100%",height:"100%",background:bg,position:"relative"}}>
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
          {spots.map(s => {
            const g   = gradeLabel(gradeScore(s, sport, month));
            const col = gradeColor(g);
            const sel = s.id === selectedId;
            return (
              <Marker key={s.id} coordinates={[s.lng, s.lat]} onClick={() => onSelect(s)}>
                <circle r={sel?10:6} fill={col} stroke={dark?"#0b1120":"white"} strokeWidth={sel?2.5:1.5}
                  style={{cursor:"pointer", filter:sel?`drop-shadow(0 0 8px ${col})`:"none", transition:"r .15s"}}
                />
                <text textAnchor="middle" y={sel?-14:-10}
                  style={{fontSize:sel?10:8, fontWeight:700, fill:col, fontFamily:"DM Mono,monospace", pointerEvents:"none", opacity:sel?1:0.85}}>
                  {g}
                </text>
                {(sel || showLabels) && (
                  <text textAnchor="middle" y={22}
                    style={{fontSize:9, fontWeight:600, fill:sel?"white":(dark?"#94a3b8":"#475569"), fontFamily:"DM Sans,sans-serif", pointerEvents:"none",
                      textShadow:dark?"0 1px 4px #000":"none"}}>
                    {s.name}
                  </text>
                )}
              </Marker>
            );
          })}
        </ZoomableGroup>
      </ComposableMap>

      {/* Zoom controls — bottom left */}
      <div style={{position:"absolute",bottom:16,left:16,display:"flex",flexDirection:"column",gap:4}}>
        {[["+",()=>setZoom(z=>Math.min(z*1.5,16))],["\u2212",()=>setZoom(z=>Math.max(z/1.5,1))],["\u21BA",()=>{setZoom(1);setCenter([10,10]);}]].map(([label,fn],i)=>(
          <button key={i} onClick={fn}
            style={{width:28,height:28,borderRadius:4,border:"none",background:"white",color:"#0ea5e9",fontSize:16,fontWeight:700,
              cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",
              boxShadow:"0 1px 4px rgba(0,0,0,0.18)",lineHeight:1}}>
            {label}
          </button>
        ))}
      </div>

      {/* Grade legend — bottom right */}
      <div style={{position:"absolute",bottom:16,right:16,display:"flex",gap:8,background:dark?"rgba(10,15,28,0.85)":"rgba(255,255,255,0.9)",backdropFilter:"blur(8px)",padding:"8px 12px",borderRadius:6,border:`1px solid ${bord}`}}>
        {[["A","#22c55e"],["B","#6366f1"],["C","#f59e0b"],["D","#f97316"],["F","#f43f5e"]].map(([g,c])=>(
          <div key={g} style={{display:"flex",alignItems:"center",gap:4}}>
            <div style={{width:8,height:8,borderRadius:"50%",background:c}}/>
            <span style={{fontSize:10,color:dark?"#94a3b8":"#64748b",fontFamily:"DM Mono,monospace",fontWeight:600}}>{g}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
