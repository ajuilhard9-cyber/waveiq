import { ComposableMap, Geographies, Geography, Marker } from 'react-simple-maps';
import { gradeScore, gradeLabel, gradeColor } from '../data/spots';

const GEO_URL = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

export default function WorldMap({ spots, sport, month, selectedId, onSelect, dark }) {
  return (
    <div style={{width:"100%",borderRadius:20,overflow:"hidden",background:dark?"#0d1525":"#e8edf8"}}>
      <ComposableMap
        projection="geoNaturalEarth1"
        projectionConfig={{scale:140}}
        style={{width:"100%",height:"auto"}}
      >
        <Geographies geography={GEO_URL}>
          {({geographies}) => geographies.map(geo => (
            <Geography key={geo.rsmKey} geography={geo}
              style={{
                default:{fill:dark?"#141e33":"#d4daf0",stroke:dark?"#1a2840":"#c0c8e8",strokeWidth:0.5,outline:"none"},
                hover:  {fill:dark?"#141e33":"#d4daf0",outline:"none"},
                pressed:{fill:dark?"#141e33":"#d4daf0",outline:"none"},
              }}
            />
          ))}
        </Geographies>
        {spots.map(s => {
          const score = gradeScore(s, sport, month);
          const g = gradeLabel(score);
          const col = gradeColor(g);
          const sel = s.id === selectedId;
          return (
            <Marker key={s.id} coordinates={[s.lng, s.lat]} onClick={() => onSelect(s)}>
              <circle
                r={sel ? 9 : 6}
                fill={col}
                stroke="white"
                strokeWidth={sel ? 2.5 : 1.5}
                style={{cursor:"pointer",filter:sel?"drop-shadow(0 0 6px "+col+")":"none",transition:"all .2s"}}
              />
              {sel && (
                <text textAnchor="middle" y={-14} style={{fontSize:9,fontWeight:700,fill:"white",fontFamily:"DM Sans,sans-serif",pointerEvents:"none"}}>
                  {s.name}
                </text>
              )}
            </Marker>
          );
        })}
      </ComposableMap>
      {/* Legend */}
      <div style={{display:"flex",gap:12,justifyContent:"center",padding:"10px 16px",background:dark?"#0f1623":"#f0f3fa",flexWrap:"wrap"}}>
        {[["A","#22c55e","Excellent"],["B","#6366f1","Good"],["C","#f59e0b","Average"],["D","#f97316","Poor"],["F","#f43f5e","Avoid"]].map(([g,c,l])=>(
          <div key={g} style={{display:"flex",alignItems:"center",gap:4}}>
            <div style={{width:9,height:9,borderRadius:"50%",background:c}}/>
            <span style={{fontSize:10,color:dark?"#64748b":"#94a3b8",fontWeight:600}}>{g} — {l}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
