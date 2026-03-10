import { useState, useEffect, useRef, useCallback } from "react";

async function getWeather(lat, lng) {
  const r = await fetch(
    "https://api.open-meteo.com/v1/forecast?latitude=" + lat + "&longitude=" + lng +
    "&current=temperature_2m,wind_speed_10m,wind_direction_10m,wind_gusts_10m,uv_index,apparent_temperature" +
    "&hourly=wind_speed_10m,wind_gusts_10m&daily=sunrise,sunset&forecast_days=2&wind_speed_unit=kn&timezone=auto"
  );
  if (!r.ok) throw new Error("Weather API " + r.status);
  return r.json();
}

async function getMarine(lat, lng) {
  try {
    const r = await fetch(
      "https://marine-api.open-meteo.com/v1/marine?latitude=" + lat + "&longitude=" + lng +
      "&current=wave_height,wave_direction,wave_period,swell_wave_height,swell_wave_period,sea_surface_temperature" +
      "&hourly=wave_height&timezone=auto&forecast_days=2"
    );
    if (!r.ok) return null;
    return r.json();
  } catch { return null; }
}

async function callAgent(system, userContent) {
  const r = await fetch("/api/agent", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ system, messages: [{ role: "user", content: userContent }] })
  });
  if (!r.ok) throw new Error("Agent " + r.status);
  const d = await r.json();
  return d.content?.[0]?.text || "";
}

const SYS_FORECAST = "You are WaveIQ Forecast Agent. Given live conditions write a SHORT session briefing max 4 sentences 80 words. Start with one word vibe in CAPS like EPIC SOLID MARGINAL FLAT DANGEROUS. Give key insight with numbers. End with one tip. No emojis.";
const SYS_GEAR = "You are WaveIQ Gear Agent. Given conditions and sport output ONLY a valid JSON array no markdown: [{\"item\":\"Kite\",\"rec\":\"12m\",\"reason\":\"18 kts steady\"}] Max 5 items. Specific sizes. Reasons under 10 words. Raw JSON only.";
const SYS_SPOT = "You are WaveIQ Spot Agent local break expert. Given location sport and conditions write 2-3 sentences: break type crowd level best conditions any hazards. Direct and specific no fluff.";

const WG_SPOTS = [
  { id:43, name:"Tarifa", country:"Spain", lat:36.000, lng:-5.650, region:"Europe", sports:["kite","windsurf","surf"] },
  { id:5693, name:"Maui", country:"Hawaii, USA", lat:20.906, lng:-156.422, region:"Pacific", sports:["kite","surf","windsurf","sup"] },
  { id:309513, name:"Hossegor", country:"France", lat:43.658, lng:-1.447, region:"Europe", sports:["surf","sup"] },
  { id:75856, name:"Nazare", country:"Portugal", lat:39.600, lng:-9.075, region:"Europe", sports:["surf"] },
  { id:1159, name:"Jeffreys Bay", country:"South Africa", lat:-33.964, lng:24.948, region:"Africa", sports:["surf","sup"] },
  { id:15604, name:"Cabarete", country:"Dom. Republic", lat:19.751, lng:-70.412, region:"Caribbean", sports:["kite","surf","windsurf"] },
  { id:4239, name:"Cape Town", country:"South Africa", lat:-33.917, lng:18.404, region:"Africa", sports:["kite","surf","windsurf","sail"] },
  { id:26, name:"Essaouira", country:"Morocco", lat:31.502, lng:-9.764, region:"Africa", sports:["kite","windsurf"] },
  { id:15278, name:"Dakhla", country:"Morocco", lat:23.917, lng:-15.774, region:"Africa", sports:["kite","windsurf","sup"] },
  { id:782987, name:"Siargao", country:"Philippines", lat:9.792, lng:126.162, region:"Asia", sports:["surf","kayak","sup"] },
  { id:208791, name:"Teahupo'o", country:"French Polynesia", lat:-17.850, lng:-149.250, region:"Pacific", sports:["surf"] },
  { id:3, name:"Mundaka", country:"Spain", lat:43.400, lng:-2.700, region:"Europe", sports:["surf","kayak"] },
  { id:211, name:"Ericeira", country:"Portugal", lat:38.963, lng:-9.416, region:"Europe", sports:["surf","sup"] },
  { id:334454, name:"Lacanau", country:"France", lat:44.990, lng:-1.196, region:"Europe", sports:["surf","sup"] },
  { id:203944, name:"Sagres", country:"Portugal", lat:37.014, lng:-8.938, region:"Europe", sports:["surf","kite","windsurf"] },
  { id:244958, name:"Peniche", country:"Portugal", lat:39.357, lng:-9.381, region:"Europe", sports:["surf","sup"] },
  { id:50613, name:"Zanzibar", country:"Tanzania", lat:-5.950, lng:39.450, region:"Indian", sports:["kite","sail","sup","kayak"] },
  { id:15025, name:"Aruba", country:"Aruba", lat:12.570, lng:-70.060, region:"Caribbean", sports:["kite","windsurf","sail"] },
  { id:2667, name:"Barbados", country:"Barbados", lat:13.157, lng:-59.544, region:"Caribbean", sports:["kite","surf","sup"] },
  { id:60878, name:"Maldives", country:"Maldives", lat:5.050, lng:72.950, region:"Indian", sports:["surf","sail","kayak","sup"] },
  { id:15605, name:"Jericoacoara", country:"Brazil", lat:-2.900, lng:-40.510, region:"S.America", sports:["kite","windsurf","sup"] },
  { id:55432, name:"Gold Coast", country:"Australia", lat:-28.000, lng:153.400, region:"Pacific", sports:["surf","sup","kayak"] },
  { id:208797, name:"Cloudbreak", country:"Fiji", lat:-17.800, lng:177.200, region:"Pacific", sports:["surf","sail"] },
  { id:231, name:"Uluwatu", country:"Bali Indonesia", lat:-8.830, lng:115.090, region:"Asia", sports:["surf","sup"] },
  { id:158, name:"Canggu", country:"Bali Indonesia", lat:-8.650, lng:115.130, region:"Asia", sports:["surf","sup","kite"] },
  { id:333, name:"Arugam Bay", country:"Sri Lanka", lat:6.840, lng:81.830, region:"Indian", sports:["surf","sup"] },
  { id:49045, name:"El Gouna", country:"Egypt", lat:27.400, lng:33.680, region:"Indian", sports:["kite","windsurf"] },
  { id:327, name:"Hurghada", country:"Egypt", lat:27.258, lng:33.812, region:"Indian", sports:["kite","windsurf","sail"] },
  { id:48795, name:"Boracay", country:"Philippines", lat:11.967, lng:121.917, region:"Asia", sports:["kite","windsurf","sup"] },
  { id:456789, name:"El Medano", country:"Tenerife Spain", lat:28.047, lng:-16.534, region:"Atlantic", sports:["kite","windsurf"] },
  { id:567890, name:"Corralejo", country:"Fuerteventura", lat:28.728, lng:-13.867, region:"Atlantic", sports:["kite","windsurf","surf"] },
  { id:678901, name:"Famara", country:"Lanzarote", lat:29.087, lng:-13.564, region:"Atlantic", sports:["surf","kite","windsurf"] },
  { id:15605, name:"Jericoacoara", country:"Brazil", lat:-2.900, lng:-40.510, region:"S.America", sports:["kite","windsurf","sup"] },
  { id:180234, name:"Pichilemu", country:"Chile", lat:-34.390, lng:-72.010, region:"S.America", sports:["surf","kite"] },
  { id:556789, name:"Puerto Escondido", country:"Mexico", lat:15.860, lng:-97.060, region:"S.America", sports:["surf"] },
  { id:667890, name:"Cape Verde", country:"Cape Verde", lat:16.000, lng:-24.000, region:"Atlantic", sports:["kite","windsurf","surf"] },
  { id:778901, name:"Mui Ne", country:"Vietnam", lat:10.933, lng:108.283, region:"Asia", sports:["kite","windsurf","surf"] },
  { id:889012, name:"Tofino", country:"Canada", lat:49.153, lng:-125.907, region:"Pacific", sports:["surf","kayak","sup"] },
  { id:990123, name:"Rio de Janeiro", country:"Brazil", lat:-22.987, lng:-43.192, region:"S.America", sports:["kite","surf","sup"] },
  { id:334341, name:"Sylt", country:"Germany", lat:54.910, lng:8.310, region:"Europe", sports:["kite","windsurf","surf"] },
  { id:334342, name:"Leucate", country:"France", lat:42.920, lng:3.050, region:"Europe", sports:["kite","windsurf"] },
];

function distKm(a1,o1,a2,o2){const R=6371,dA=(a2-a1)*Math.PI/180,dO=(o2-o1)*Math.PI/180,a=Math.sin(dA/2)**2+Math.cos(a1*Math.PI/180)*Math.cos(a2*Math.PI/180)*Math.sin(dO/2)**2;return R*2*Math.atan2(Math.sqrt(a),Math.sqrt(1-a));}
function searchSpots(q){if(!q||q.length<1)return[];const lq=q.toLowerCase();return WG_SPOTS.filter((s,i,arr)=>arr.findIndex(x=>x.id===s.id)===i).map(s=>({...s,sc:(s.name.toLowerCase().includes(lq)?2:0)+(s.country.toLowerCase().includes(lq)?1:0)+(s.region.toLowerCase().includes(lq)?1:0)})).filter(s=>s.sc>0).sort((a,b)=>b.sc-a.sc).slice(0,6);}
function nearestSpots(lat,lng,n=8){return WG_SPOTS.filter((s,i,arr)=>arr.findIndex(x=>x.id===s.id)===i).map(s=>({...s,dist:distKm(lat,lng,s.lat,s.lng)})).sort((a,b)=>a.dist-b.dist).slice(0,n);}

const SPORTS=[{id:"surf",label:"Surfing",icon:"S",color:"#f97316"},{id:"kite",label:"Kite Surf",icon:"K",color:"#0ea5e9"},{id:"windsurf",label:"Windsurf",icon:"W",color:"#eab308"},{id:"kayak",label:"Kayaking",icon:"Y",color:"#10b981"},{id:"sup",label:"SUP",icon:"P",color:"#a855f7"},{id:"sail",label:"Sailing",icon:"V",color:"#6366f1"},{id:"fishing",label:"Fishing",icon:"F",color:"#78716c"}];
const LEVELS=[{id:"beginner",label:"Beginner"},{id:"intermediate",label:"Intermediate"},{id:"advanced",label:"Advanced"},{id:"expert",label:"Expert"}];
const WIND_DIRS=["N","NNE","NE","ENE","E","ESE","SE","SSE","S","SSW","SW","WSW","W","WNW","NW","NNW"];

const wetsuitGuide=wt=>!wt||wt>=24?{text:"Boardshorts",c:"#f97316"}:wt>=21?{text:"1-2mm Shorty",c:"#eab308"}:wt>=18?{text:"2mm Shorty",c:"#84cc16"}:wt>=15?{text:"3/2mm Fullsuit",c:"#0ea5e9"}:wt>=12?{text:"4/3mm Fullsuit",c:"#6366f1"}:{text:"5mm+ Drysuit",c:"#1e293b"};
const kiteSize=w=>w<8?"Too light":w<12?"17-19m":w<16?"14-17m":w<20?"12-14m":w<25?"10-12m":w<30?"9-10m":w<36?"7-9m":"5-7m";
const windSail=w=>w<8?"8-10m":w<14?"6.5-8m":w<18?"5.5-6.5m":w<24?"4.5-5.5m":w<30?"3.5-4.5m":"3-3.5m";
function safetyRating(wind,wave,sport,level){const exp=level==="expert"||level==="advanced",beg=level==="beginner";const L={surf:{minWave:0.3,maxWave:exp?6:beg?1.5:3,maxWind:25},kite:{minWind:8,maxWind:exp?45:beg?20:35},windsurf:{minWind:8,maxWind:exp?50:beg?20:40},kayak:{maxWind:beg?15:25,maxWave:beg?0.5:1.5},sup:{maxWind:beg?12:20,maxWave:beg?0.5:1.5},sail:{minWind:5,maxWind:exp?40:30},fishing:{maxWind:25,maxWave:1.5}}[sport]||{};let score=100;const w=[];if(L.minWind&&wind<L.minWind){score-=30;w.push("Wind too light");}if(L.maxWind&&wind>L.maxWind){score-=40;w.push("Too strong for "+level);}if(L.minWave&&wave<L.minWave){score-=20;w.push("Waves too small");}if(L.maxWave&&wave>L.maxWave){score-=40;w.push("Waves too big for "+level);}return{status:score<=30?"NO-GO":score<=65?"CAUTION":"GO",score:Math.max(0,score),warnings:w};}

function WindCompass({deg,speed}){
  const dir=WIND_DIRS[Math.round(deg/22.5)%16];
  return(
    <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:6}}>
      <svg width="70" height="70" viewBox="0 0 72 72">
        <circle cx="36" cy="36" r="33" fill="none" stroke="#e2e8f0" strokeWidth="1.5"/>
        <circle cx="36" cy="36" r="26" fill="#f8fafc" stroke="#e2e8f0" strokeWidth="1"/>
        {["N","E","S","W"].map((d,i)=>(
          <text key={d} x={36+28*Math.sin(i*Math.PI/2)} y={36-28*Math.cos(i*Math.PI/2)+3.5} textAnchor="middle" fontSize="8" fill="#94a3b8" fontFamily="monospace">{d}</text>
        ))}
        <g transform={"rotate("+deg+",36,36)"}>
          <polygon points="36,10 39,30 36,27 33,30" fill="#0ea5e9"/>
          <polygon points="36,62 39,42 36,45 33,42" fill="#0ea5e9" opacity="0.3"/>
        </g>
        <circle cx="36" cy="36" r="4" fill="white" stroke="#0ea5e9" strokeWidth="2"/>
      </svg>
      <div style={{textAlign:"center"}}>
        <div style={{fontSize:28,fontWeight:900,color:"#0ea5e9",lineHeight:1}}>{speed}</div>
        <div style={{fontSize:8,color:"#94a3b8",letterSpacing:1}}>{dir} KTS</div>
      </div>
    </div>
  );
}

function SafetyBadge({status,score,warnings}){
  const cfg={GO:{bg:"#dcfce7",c:"#16a34a",b:"#86efac",e:"GO"},CAUTION:{bg:"#fef9c3",c:"#ca8a04",b:"#fde047",e:"CAUTION"},"NO-GO":{bg:"#fee2e2",c:"#dc2626",b:"#fca5a5",e:"NO-GO"}}[status]||{bg:"#f1f5f9",c:"#64748b",b:"#e2e8f0",e:"?"};
  return(
    <div style={{background:cfg.bg,border:"2px solid "+cfg.b,borderRadius:14,padding:"13px 16px"}}>
      <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:warnings.length?6:0}}>
        <div style={{fontSize:18,fontWeight:900,color:cfg.c,lineHeight:1}}>{cfg.e}</div>
        <div style={{fontSize:9,color:cfg.c,opacity:0.7}}>SAFETY SCORE {score}/100</div>
      </div>
      {warnings.map((w,i)=><div key={i} style={{fontSize:11,color:cfg.c,marginTop:2}}>- {w}</div>)}
    </div>
  );
}

function DataTile({label,value,unit,sub,color}){
  return(
    <div style={{background:"white",border:"1.5px solid #e2e8f0",borderRadius:12,padding:"12px 14px"}}>
      <div style={{fontSize:8,color:"#94a3b8",letterSpacing:2,marginBottom:4}}>{label}</div>
      <div style={{display:"flex",alignItems:"flex-end",gap:3}}>
        <span style={{fontSize:20,fontWeight:800,color:color||"#0f172a",lineHeight:1}}>{value}</span>
        {unit&&<span style={{fontSize:10,color:"#94a3b8",marginBottom:1}}>{unit}</span>}
      </div>
      {sub&&<div style={{fontSize:10,color:"#64748b",marginTop:3}}>{sub}</div>}
    </div>
  );
}

function ForecastStrip({hourly,marineHourly}){
  if(!hourly?.time)return null;
  const now=new Date();
  const items=hourly.time.map((t,i)=>({t:new Date(t),w:hourly.wind_speed_10m?.[i],wave:marineHourly?.[i]})).filter(x=>x.t>=now).slice(0,12);
  return(
    <div>
      <div style={{fontSize:8,color:"#94a3b8",letterSpacing:3,marginBottom:8}}>24H FORECAST</div>
      <div style={{display:"flex",gap:5,overflowX:"auto",paddingBottom:4}}>
        {items.map((item,i)=>{
          const n=i===0,w=Math.round(item.w||0);
          return(
            <div key={i} style={{flexShrink:0,width:50,background:n?"#0f172a":"white",border:"1.5px solid "+(n?"#0f172a":"#e2e8f0"),borderRadius:9,padding:"6px 4px",textAlign:"center"}}>
              <div style={{fontSize:7,color:"#94a3b8"}}>{n?"NOW":item.t.getHours()+"h"}</div>
              <div style={{fontSize:16,fontWeight:800,color:n?"white":"#0f172a",marginTop:1}}>{w}</div>
              <div style={{fontSize:6,color:n?"#475569":"#94a3b8"}}>kts</div>
              {item.wave!=null&&<div style={{fontSize:7,color:n?"#38bdf8":"#0ea5e9",marginTop:1}}>{item.wave.toFixed(1)}m</div>}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function AgentCard({icon,title,subtitle,children,color,loading,error}){
  const c=color||"#0ea5e9";
  return(
    <div style={{background:"white",border:"1.5px solid #e2e8f0",borderRadius:16,overflow:"hidden"}}>
      <div style={{background:"linear-gradient(135deg,"+c+"18,"+c+"05)",borderBottom:"1px solid #f1f5f9",padding:"11px 15px",display:"flex",alignItems:"center",gap:10}}>
        <div style={{width:30,height:30,borderRadius:9,background:c+"22",display:"flex",alignItems:"center",justifyContent:"center",fontSize:14,flexShrink:0}}>{icon}</div>
        <div style={{flex:1}}>
          <div style={{fontSize:11,fontWeight:700,color:"#0f172a"}}>{title}</div>
          {subtitle&&<div style={{fontSize:8,color:"#94a3b8",letterSpacing:1}}>{subtitle}</div>}
        </div>
        {loading&&<div style={{width:14,height:14,border:"2px solid #e2e8f0",borderTopColor:c,borderRadius:"50%",animation:"spin 0.7s linear infinite"}}/>}
        {!loading&&!error&&children&&<div style={{width:7,height:7,borderRadius:"50%",background:"#22c55e"}}/>}
      </div>
      <div style={{padding:"13px 15px",minHeight:58}}>
        {loading&&<div style={{color:"#94a3b8",fontSize:12,fontStyle:"italic"}}>Agent analysing...</div>}
        {error&&!loading&&<div style={{color:"#f97316",fontSize:11}}>{error}</div>}
        {!loading&&!error&&children}
      </div>
    </div>
  );
}

function FullscreenMap({onSelect,onClose,currentLocation}){
  const mapRef=useRef(null);
  const inst=useRef(null);
  useEffect(()=>{
    if(inst.current||!mapRef.current)return;
    const lnk=document.createElement("link");lnk.rel="stylesheet";lnk.href="https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.css";document.head.appendChild(lnk);
    const scr=document.createElement("script");scr.src="https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.js";
    scr.onload=()=>{
      const L=window.L;
      const map=L.map(mapRef.current,{center:currentLocation?[currentLocation.lat,currentLocation.lng]:[20,10],zoom:currentLocation?5:2});
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",{maxZoom:19,attribution:"OpenStreetMap"}).addTo(map);
      const pin=(col,big)=>L.divIcon({className:"",html:"<div style='width:"+(big?18:12)+"px;height:"+(big?18:12)+"px;border-radius:50% 50% 50% 0;background:"+col+";border:2px solid white;box-shadow:0 2px 6px rgba(0,0,0,.3);transform:rotate(-45deg)'></div>",iconSize:[big?18:12,big?18:12],iconAnchor:[big?9:6,big?18:12]});
      WG_SPOTS.filter((s,i,arr)=>arr.findIndex(x=>x.id===s.id)===i).forEach(s=>{
        const m=L.marker([s.lat,s.lng],{icon:pin("#64748b",false)}).addTo(map);
        m.bindTooltip("<b>"+s.name+"</b><br><small>"+s.country+"</small>",{direction:"top",offset:[0,-12]});
        m.on("click",()=>{onSelect({name:s.name+", "+s.country,lat:s.lat,lng:s.lng,spotId:s.id});onClose();});
      });
      if(currentLocation)L.marker([currentLocation.lat,currentLocation.lng],{icon:pin("#0ea5e9",true)}).addTo(map);
      map.on("click",e=>{const{lat,lng}=e.latlng;onSelect({name:lat.toFixed(3)+", "+lng.toFixed(3),lat,lng});setTimeout(onClose,400);});
      inst.current=map;
    };
    document.head.appendChild(scr);
    return()=>{if(inst.current){inst.current.remove();inst.current=null;}};
  },[]);
  return(
    <div style={{position:"fixed",inset:0,zIndex:9999,display:"flex",flexDirection:"column"}}>
      <div style={{background:"#0f172a",padding:"10px 20px",display:"flex",alignItems:"center",justifyContent:"space-between",flexShrink:0}}>
        <div>
          <div style={{fontSize:13,fontWeight:800,letterSpacing:3,color:"white"}}>SELECT LOCATION</div>
          <div style={{fontSize:8,color:"#475569",letterSpacing:2}}>CLICK A SPOT OR ANYWHERE ON THE MAP</div>
        </div>
        <button onClick={onClose} style={{width:32,height:32,borderRadius:"50%",border:"1px solid #334155",background:"transparent",color:"#94a3b8",fontSize:18,cursor:"pointer"}}>x</button>
      </div>
      <div ref={mapRef} style={{flex:1}}/>
    </div>
  );
}

function SpotSearch({onSelect,currentLocation,onOpenMap}){
  const[q,setQ]=useState("");const[results,setResults]=useState([]);const[focused,setFocused]=useState(false);const ref=useRef(null);
  useEffect(()=>{setResults(q.length>=1?searchSpots(q):[]);},[q]);
  const pick=s=>{setQ(s.name+", "+s.country);setResults([]);ref.current?.blur();onSelect({name:s.name+", "+s.country,lat:s.lat,lng:s.lng,spotId:s.id});};
  return(
    <div style={{position:"relative"}}>
      <div style={{display:"flex",gap:8}}>
        <div style={{flex:1,display:"flex",alignItems:"center",gap:8,background:"white",border:"2px solid "+(focused?"#0ea5e9":"#e2e8f0"),borderRadius:12,padding:"10px 14px",transition:"border-color 0.15s"}}>
          <span style={{fontSize:14,flexShrink:0}}>Search</span>
          <input ref={ref} value={q} onChange={e=>setQ(e.target.value)} onFocus={()=>setFocused(true)} onBlur={()=>setTimeout(()=>{setFocused(false);setResults([]);},180)} placeholder="Tarifa, Maui, Bali, Hossegor..." style={{border:"none",outline:"none",flex:1,fontSize:13,color:"#0f172a",background:"transparent"}}/>
          {q&&<span onClick={()=>{setQ("");setResults([]);}} style={{color:"#cbd5e1",cursor:"pointer",fontSize:16,flexShrink:0}}>x</span>}
        </div>
        <button onClick={onOpenMap} style={{padding:"0 14px",borderRadius:12,border:"2px solid #e2e8f0",background:"white",fontSize:12,cursor:"pointer",flexShrink:0}}>Map</button>
      </div>
      {results.length>0&&(
        <div style={{position:"absolute",top:"calc(100% + 6px)",left:0,right:60,background:"white",border:"1.5px solid #e2e8f0",borderRadius:12,boxShadow:"0 12px 32px rgba(0,0,0,.12)",zIndex:9999,overflow:"hidden"}}>
          {results.map((s,i)=>{
            const dist=currentLocation?distKm(currentLocation.lat,currentLocation.lng,s.lat,s.lng):null;
            return(
              <div key={s.id} onMouseDown={()=>pick(s)} style={{padding:"10px 12px",cursor:"pointer",borderBottom:i<results.length-1?"1px solid #f8fafc":"none",display:"flex",justifyContent:"space-between",alignItems:"center"}} onMouseEnter={e=>e.currentTarget.style.background="#f8fafc"} onMouseLeave={e=>e.currentTarget.style.background="white"}>
                <div>
                  <div style={{fontWeight:700,fontSize:12,color:"#0f172a"}}>{s.name}</div>
                  <div style={{fontSize:10,color:"#94a3b8"}}>{s.country} - {s.region}</div>
                </div>
                {dist!=null&&<div style={{fontSize:10,fontWeight:700,color:"#0ea5e9"}}>{dist<10?dist.toFixed(1):Math.round(dist)} km</div>}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default function App(){return null;}
