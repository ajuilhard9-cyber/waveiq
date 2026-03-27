import { useState, useEffect } from 'react';
import { ComposableMap, Geographies, Geography, Marker, ZoomableGroup } from 'react-simple-maps';
import { S } from '../data/spots';
import { RC } from '../shared/theme';

const GEO_URL = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-50m.json";
const BASE_SCALE = 18000;
const INIT_ZOOM  = 5;

function arrowOffsets(zoom) {
  const d = 0.2 / zoom;
  const pts = [[-d,-d],[0,-d],[d,-d],[-d,0],[d,0],[-d,d],[0,d],[d,d]];
  if (zoom > 4) {
    const d2 = 0.4 / zoom;
    [[-d2,-d2],[0,-d2],[d2,-d2],[-d2,0],[d2,0],[-d2,d2],[0,d2],[d2,d2]].forEach(p => pts.push(p));
  }
  return pts;
}

export default function SpotMap({ spot, windDir, swellDir, wind, wave, onSelectNearby }) {
  const [zoom,    setZoom]    = useState(INIT_ZOOM);
  const [center,  setCenter]  = useState([spot.lng, spot.lat]);
  const [mapMode, setMapMode] = useState("wind");

  useEffect(() => { setZoom(INIT_ZOOM); setCenter([spot.lng, spot.lat]); }, [spot.id]);

  const sea  = "#bfe8f8";
  const land = "#d4e8cc";
  const bord = "#a8ccc0";

  const windSpd = wind  || 0;
  const waveHt  = wave  || 0;
  const windHue = windSpd>25?"#ef4444":windSpd>15?"#f97316":windSpd>8?"#0ea5e9":"#7dd3fc";
  const waveHue = waveHt >3 ?"#064e3b":waveHt >2 ?"#047857":waveHt >1 ?"#10b981":"#6ee7b7";

  const seaBg = mapMode==="wind" && windDir!=null
    ? `radial-gradient(ellipse at center, ${windHue}c0 0%, ${windHue}50 35%, ${sea} 70%)`
    : mapMode==="wave" && swellDir!=null
    ? `radial-gradient(ellipse at center, ${waveHue}c0 0%, ${waveHue}50 35%, ${sea} 70%)`
    : sea;

  const nearby = S.filter(s=>s.id!==spot.id).map(s=>{
    const dlat=s.lat-spot.lat, dlng=s.lng-spot.lng;
    return {...s, dist:Math.sqrt(dlat*dlat+dlng*dlng)};
  }).filter(s=>s.dist<1.5).sort((a,b)=>a.dist-b.dist).slice(0,6);

  const iz = 1/zoom;
  const aL = 14*iz, aW = 2*iz, aH = 4*iz;

  return (
    <div style={{width:"100%",height:"100%",background:seaBg,position:"relative"}}>
      <ComposableMap
        projection="geoMercator"
        projectionConfig={{scale:BASE_SCALE, center:[spot.lng, spot.lat]}}
        style={{width:"100%",height:"100%"}}
      >
        <ZoomableGroup zoom={zoom} center={center}
          onMoveEnd={({zoom:z,coordinates})=>{setZoom(z);setCenter(coordinates);}}>
          <Geographies geography={GEO_URL}>
            {({geographies})=>geographies.map(geo=>(
              <Geography key={geo.rsmKey} geography={geo}
                style={{
                  default:{fill:land,stroke:bord,strokeWidth:0.5*iz,outline:"none"},
                  hover:{fill:land,outline:"none"},
                  pressed:{fill:land,outline:"none"},
                }}
              />
            ))}
          </Geographies>

          {/* Wind arrow field */}
          {windDir!=null && mapMode==="wind" && arrowOffsets(zoom).map((off,i)=>(
            <Marker key={`wa-${i}`} coordinates={[spot.lng+off[0], spot.lat+off[1]]}>
              <g transform={`rotate(${windDir})`} style={{pointerEvents:"none"}}>
                <line x1="0" y1={-aL} x2="0" y2={aL*0.5}
                  stroke="#1e40af" strokeWidth={aW} strokeLinecap="round" opacity="0.7"/>
                <polygon points={`0,${-(aL+aH)} ${-aH},${-aL+aH} ${aH},${-aL+aH}`}
                  fill="#1e40af" opacity="0.75"/>
              </g>
            </Marker>
          ))}

          {/* Swell direction arrow */}
          {swellDir!=null && mapMode==="wave" && (
            <Marker coordinates={[spot.lng, spot.lat-0.35*iz]}>
              <g transform={`rotate(${swellDir})`} style={{pointerEvents:"none"}}>
                <line x1="0" y1={-aL*1.3} x2="0" y2={aL*0.6}
                  stroke="#0e7490" strokeWidth={aW*1.3} strokeDasharray={`${aL},${aL*0.5}`} opacity="0.8"/>
                <polygon points={`0,${-(aL*1.3+aH)} ${-aH},${-aL*1.3+aH} ${aH},${-aL*1.3+aH}`}
                  fill="#0e7490" opacity="0.85"/>
              </g>
            </Marker>
          )}

          {/* Nearby spots */}
          {nearby.map(s=>(
            <Marker key={s.id} coordinates={[s.lng, s.lat]} onClick={()=>onSelectNearby?.(s)}>
              <circle r={5*iz} fill={RC[s.region]||"#0ea5e9"} stroke="white" strokeWidth={1.5*iz}
                style={{cursor:onSelectNearby?"pointer":"default",opacity:0.85}}/>
              <text textAnchor="middle" y={-9*iz}
                style={{fontSize:9*iz,fill:"#475569",fontFamily:"DM Sans,sans-serif",pointerEvents:"none"}}>
                {s.name}
              </text>
            </Marker>
          ))}

          {/* Main spot marker */}
          <Marker coordinates={[spot.lng, spot.lat]}>
            {windDir!=null && mapMode==="wind" && (
              <g transform={`rotate(${windDir})`}>
                <line x1="0" y1={-28*iz} x2="0" y2={-17*iz}
                  stroke="#0ea5e9" strokeWidth={2.5*iz} strokeLinecap="round"/>
                <polygon points={`0,${-31*iz} ${-4*iz},${-24*iz} ${4*iz},${-24*iz}`} fill="#0ea5e9"/>
              </g>
            )}
            <circle r={13*iz} fill="#0ea5e9" stroke="white" strokeWidth={3*iz}
              style={{filter:"drop-shadow(0 0 10px #0ea5e988)"}}/>
            <text textAnchor="middle" y={4.5*iz}
              style={{fontSize:9*iz,fontWeight:800,fill:"white",fontFamily:"DM Mono,monospace",pointerEvents:"none",letterSpacing:0.5}}>
              {spot.name.slice(0,3).toUpperCase()}
            </text>
          </Marker>
        </ZoomableGroup>
      </ComposableMap>

      {/* Mode toggles */}
      <div style={{position:"absolute",top:12,right:12,display:"flex",gap:4}}>
        {[["wind","Wind"],["wave","Wave"],["off","Off"]].map(([mode,label])=>{
          const active=mapMode===mode;
          return (
            <button key={mode} onClick={()=>setMapMode(mode)}
              style={{height:26,padding:"0 10px",borderRadius:4,border:"1px solid "+(active?"#0ea5e9":"#cbd5e1"),
                background:active?"#0ea5e9":"white",color:active?"white":"#64748b",fontSize:10,fontWeight:600,cursor:"pointer",
                fontFamily:"DM Sans,sans-serif",boxShadow:"0 1px 4px rgba(0,0,0,0.12)",transition:"all .15s"}}>
              {label}
            </button>
          );
        })}
      </div>

      {/* Zoom controls */}
      <div style={{position:"absolute",bottom:50,left:14,display:"flex",flexDirection:"column",gap:4}}>
        {[["+",()=>setZoom(z=>Math.min(z*1.5,32))],["−",()=>setZoom(z=>Math.max(z/1.5,1))],["↺",()=>{setZoom(INIT_ZOOM);setCenter([spot.lng,spot.lat]);}]].map(([label,fn],i)=>(
          <button key={i} onClick={fn}
            style={{width:28,height:28,borderRadius:4,border:"none",background:"white",color:"#0ea5e9",fontSize:16,fontWeight:700,
              cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",
              boxShadow:"0 1px 4px rgba(0,0,0,0.18)",lineHeight:1}}>
            {label}
          </button>
        ))}
      </div>

      {/* Spot info overlay */}
      <div style={{position:"absolute",top:14,left:14,background:"rgba(255,255,255,0.92)",backdropFilter:"blur(8px)",padding:"8px 12px",borderRadius:5,border:`1px solid ${bord}`}}>
        <div style={{fontSize:13,fontWeight:800,color:"#0f172a",fontFamily:"Syne,sans-serif",letterSpacing:-0.3}}>{spot.name}</div>
        <div style={{fontSize:10,color:"#94a3b8"}}>{spot.country} · {spot.region}</div>
        {windDir!=null&&<div style={{fontSize:9,color:"#0ea5e9",marginTop:3,fontWeight:600,fontFamily:"DM Mono,monospace"}}>WIND {Math.round(windDir)}°{wind?` · ${Math.round(wind)} kts`:""}</div>}
        {swellDir!=null&&<div style={{fontSize:9,color:"#0891b2",marginTop:2,fontWeight:600,fontFamily:"DM Mono,monospace"}}>SWELL {Math.round(swellDir)}°{wave?` · ${wave.toFixed(1)} m`:""}</div>}
      </div>

      {nearby.length>0&&(
        <div style={{position:"absolute",bottom:14,right:14,background:"rgba(255,255,255,0.85)",backdropFilter:"blur(6px)",padding:"5px 9px",borderRadius:4,border:`1px solid ${bord}`}}>
          <div style={{fontSize:9,color:"#94a3b8",fontWeight:600}}>{nearby.length} nearby spot{nearby.length>1?"s":""}</div>
        </div>
      )}
    </div>
  );
}
