import { ComposableMap, Geographies, Geography, Marker } from 'react-simple-maps';
import { S } from '../data/spots';
import { RC } from '../shared/theme';

const GEO_URL = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";
const REGION_SCALE = 1100;

export default function SpotMap({ spot, windDir, dark, onSelectNearby }) {
  const sea  = dark ? "#0b1120" : "#bfe8f8";
  const land = dark ? "#162035" : "#d4e8cc";
  const bord = dark ? "#1e2d45" : "#a8ccc0";

  const nearby = S.filter(s => s.id !== spot.id).map(s => {
    const dlat = s.lat - spot.lat, dlng = s.lng - spot.lng;
    return {...s, dist: Math.sqrt(dlat*dlat + dlng*dlng)};
  }).filter(s => s.dist < 15).sort((a,b) => a.dist - b.dist).slice(0, 6);

  return (
    <div style={{width:"100%",height:"100%",background:sea,position:"relative"}}>
      <ComposableMap
        projection="geoMercator"
        projectionConfig={{scale: REGION_SCALE, center: [spot.lng, spot.lat]}}
        style={{width:"100%",height:"100%"}}
      >
        <Geographies geography={GEO_URL}>
          {({geographies}) => geographies.map(geo => (
            <Geography key={geo.rsmKey} geography={geo}
              style={{
                default: {fill:land, stroke:bord, strokeWidth:0.5, outline:"none"},
                hover:   {fill:land, outline:"none"},
                pressed: {fill:land, outline:"none"},
              }}
            />
          ))}
        </Geographies>

        {nearby.map(s => (
          <Marker key={s.id} coordinates={[s.lng, s.lat]} onClick={() => onSelectNearby?.(s)}>
            <circle r={5} fill={RC[s.region]||"#0ea5e9"} stroke={dark?"#0b1120":"white"} strokeWidth={1.5}
              style={{cursor:onSelectNearby?"pointer":"default",opacity:0.8}}/>
            <text textAnchor="middle" y={-9}
              style={{fontSize:8,fill:dark?"#94a3b8":"#475569",fontFamily:"DM Sans,sans-serif",pointerEvents:"none"}}>
              {s.name}
            </text>
          </Marker>
        ))}

        <Marker coordinates={[spot.lng, spot.lat]}>
          {windDir != null && (
            <g transform={`rotate(${windDir})`}>
              <line x1="0" y1="-28" x2="0" y2="-16" stroke="#0ea5e9" strokeWidth="2" strokeLinecap="round"/>
              <polygon points="0,-28 -3,-20 3,-20" fill="#0ea5e9"/>
            </g>
          )}
          <circle r={13} fill="#0ea5e9" stroke="white" strokeWidth={3}
            style={{filter:"drop-shadow(0 0 10px #0ea5e988)"}}/>
          <text textAnchor="middle" y={4.5}
            style={{fontSize:9,fontWeight:800,fill:"white",fontFamily:"DM Mono,monospace",pointerEvents:"none",letterSpacing:0.5}}>
            {spot.name.slice(0,3).toUpperCase()}
          </text>
        </Marker>
      </ComposableMap>

      {/* Spot label overlay */}
      <div style={{position:"absolute",top:14,left:14,background:dark?"rgba(10,15,28,0.88)":"rgba(255,255,255,0.92)",backdropFilter:"blur(8px)",padding:"8px 12px",borderRadius:5,border:`1px solid ${bord}`}}>
        <div style={{fontSize:13,fontWeight:800,color:dark?"#eef2ff":"#0f172a",fontFamily:"Syne,sans-serif",letterSpacing:-0.3}}>{spot.name}</div>
        <div style={{fontSize:10,color:dark?"#64748b":"#94a3b8"}}>{spot.country} · {spot.region}</div>
        {windDir!=null&&<div style={{fontSize:9,color:"#0ea5e9",marginTop:3,fontWeight:600,fontFamily:"DM Mono,monospace"}}>WIND {Math.round(windDir)}°</div>}
      </div>

      {nearby.length>0&&(
        <div style={{position:"absolute",bottom:12,right:12,background:dark?"rgba(10,15,28,0.75)":"rgba(255,255,255,0.85)",backdropFilter:"blur(6px)",padding:"5px 9px",borderRadius:4,border:`1px solid ${bord}`}}>
          <div style={{fontSize:9,color:dark?"#64748b":"#94a3b8",fontWeight:600}}>{nearby.length} nearby spot{nearby.length>1?"s":""}</div>
        </div>
      )}
    </div>
  );
}
