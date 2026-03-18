import{useState,useEffect,useCallback}from"react";
async function getWeather(a,b){const r=await fetch("https://api.open-meteo.com/v1/forecast?latitude="+a+"&longitude="+b+"&current=temperature_2m,wind_speed_10m,wind_direction_10m,wind_gusts_10m,uv_index,apparent_temperature&hourly=wind_speed_10m,wind_gusts_10m&forecast_days=2&wind_speed_unit=kn&timezone=auto");if(!r.ok)throw new Error("err "+r.status);return r.json();}
async function getMarine(a,b){try{const r=await fetch("https://marine-api.open-meteo.com/v1/marine?latitude="+a+"&longitude="+b+"&current=wave_height,wave_period,swell_wave_height,sea_surface_temperature&hourly=wave_height&timezone=auto&forecast_days=2");if(!r.ok)return null;return r.json();}catch{return null;}}
const S=[{id:43,name:"Tarifa",country:"Spain",lat:36,lng:-5.65,region:"Europe"},{id:5693,name:"Maui",country:"Hawaii USA",lat:20.906,lng:-156.422,region:"Pacific"},{id:309513,name:"Hossegor",country:"France",lat:43.658,lng:-1.447,region:"Europe"},{id:75856,name:"Nazare",country:"Portugal",lat:39.6,lng:-9.075,region:"Europe"},{id:4239,name:"Cape Town",country:"S.Africa",lat:-33.917,lng:18.404,region:"Africa"},{id:26,name:"Essaouira",country:"Morocco",lat:31.502,lng:-9.764,region:"Africa"},{id:15278,name:"Dakhla",country:"Morocco",lat:23.917,lng:-15.774,region:"Africa"},{id:782987,name:"Siargao",country:"Philippines",lat:9.792,lng:126.162,region:"Asia"},{id:231,name:"Uluwatu",country:"Bali",lat:-8.83,lng:115.09,region:"Asia"},{id:158,name:"Canggu",country:"Bali",lat:-8.65,lng:115.13,region:"Asia"},{id:211,name:"Ericeira",country:"Portugal",lat:38.963,lng:-9.416,region:"Europe"},{id:203944,name:"Sagres",country:"Portugal",lat:37.014,lng:-8.938,region:"Europe"},{id:15604,name:"Cabarete",country:"Dom.Republic",lat:19.751,lng:-70.412,region:"Caribbean"},{id:15025,name:"Aruba",country:"Aruba",lat:12.57,lng:-70.06,region:"Caribbean"},{id:50613,name:"Zanzibar",country:"Tanzania",lat:-5.95,lng:39.45,region:"Indian"},{id:49045,name:"El Gouna",country:"Egypt",lat:27.4,lng:33.68,region:"Indian"},{id:456789,name:"El Medano",country:"Tenerife",lat:28.047,lng:-16.534,region:"Atlantic"},{id:567890,name:"Corralejo",country:"Fuerteventura",lat:28.728,lng:-13.867,region:"Atlantic"},{id:15605,name:"Jericoacoara",country:"Brazil",lat:-2.9,lng:-40.51,region:"S.America"},{id:990123,name:"Rio de Janeiro",country:"Brazil",lat:-22.987,lng:-43.192,region:"S.America"}];
function dist(a1,o1,a2,o2){const R=6371,da=(a2-a1)*Math.PI/180,doo=(o2-o1)*Math.PI/180,a=Math.sin(da/2)**2+Math.cos(a1*Math.PI/180)*Math.cos(a2*Math.PI/180)*Math.sin(doo/2)**2;return R*2*Math.atan2(Math.sqrt(a),Math.sqrt(1-a));}
function search(q){if(!q)return[];const l=q.toLowerCase();return S.map(s=>({...s,sc:(s.name.toLowerCase().includes(l)?2:0)+(s.country.toLowerCase().includes(l)?1:0)})).filter(s=>s.sc>0).sort((a,b)=>b.sc-a.sc).slice(0,6);}
function nearest(la,lo){return S.map(s=>({...s,d:dist(la,lo,s.lat,s.lng)})).sort((a,b)=>a.d-b.d).slice(0,6);}
const WD=["N","NNE","NE","ENE","E","ESE","SE","SSE","S","SSW","SW","WSW","W","WNW","NW","NNW"];
const wetsuit=t=>!t||t>=24?"Boardshorts":t>=21?"1-2mm Shorty":t>=18?"2mm Shorty":t>=15?"3/2mm Fullsuit":t>=12?"4/3mm Fullsuit":"5mm+ Drysuit";
const wcolor=t=>!t||t>=24?"#f97316":t>=18?"#eab308":t>=15?"#6366f1":"#818cf8";
const kite=w=>w<8?"Too light":w<12?"17-19m":w<16?"14-17m":w<20?"12-14m":w<25?"10-12m":w<30?"9-10m":"7-9m";
const sail=w=>w<8?"8-10m":w<14?"6.5-8m":w<18?"5.5-6.5m":w<24?"4.5-5.5m":"3.5-4.5m";
function safety(wind,wave,sport,level){const ex=level==="expert"||level==="advanced",bg=level==="beginner";const L={surf:{minWave:0.3,maxWave:ex?6:bg?1.5:3,maxWind:25},kite:{minWind:8,maxWind:ex?45:bg?20:35},windsurf:{minWind:8,maxWind:ex?50:bg?20:40},kayak:{maxWind:bg?15:25},sup:{maxWind:bg?12:20},sail:{minWind:5,maxWind:ex?40:30},fishing:{maxWind:25}}[sport]||{};let sc=100;const w=[];if(L.minWind&&wind<L.minWind){sc-=30;w.push("Wind too light");}if(L.maxWind&&wind>L.maxWind){sc-=40;w.push("Too strong for "+level);}if(L.minWave&&wave<L.minWave){sc-=20;w.push("Waves too small");}if(L.maxWave&&wave>L.maxWave){sc-=40;w.push("Waves too big");}return{status:sc<=30?"NO-GO":sc<=65?"CAUTION":"GO",score:Math.max(0,sc),warnings:w};}
const RC={Europe:"#6366f1",Pacific:"#f59e0b",Africa:"#f97316",Asia:"#a855f7",Caribbean:"#10b981",Indian:"#0ea5e9",Atlantic:"#8b5cf6","S.America":"#22c55e"};
const SC={GO:{bg:"#f0fdf4",text:"#15803d",border:"#bbf7d0",dot:"#22c55e"},CAUTION:{bg:"#fefce8",text:"#a16207",border:"#fde68a",dot:"#eab308"},"NO-GO":{bg:"#fff1f2",text:"#be123c",border:"#fecdd3",dot:"#f43f5e"}};
const SPORTS=["surf","kite","windsurf","kayak","sup","sail","fishing"];
const LEVELS=["beginner","advanced","expert"];

function Compass({deg,speed,T}){const dir=WD[Math.round(deg/22.5)%16];return(<div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:10}}><svg width="88" height="88" viewBox="0 0 88 88"><defs><radialGradient id="cg"><stop offset="0%" stopColor={T.card}/><stop offset="100%" stopColor={T.bg}/></radialGradient></defs><circle cx="44" cy="44" r="40" fill="url(#cg)" stroke={T.line} strokeWidth="1"/>{[0,90,180,270].map(a=>(<line key={a} x1={44+35*Math.sin(a*Math.PI/180)} y1={44-35*Math.cos(a*Math.PI/180)} x2={44+40*Math.sin(a*Math.PI/180)} y2={44-40*Math.cos(a*Math.PI/180)} stroke={T.line} strokeWidth="1.5"/>))}{["N","E","S","W"].map((d,i)=>(<text key={d} x={44+26*Math.sin(i*Math.PI/2)} y={44-26*Math.cos(i*Math.PI/2)+3.5} textAnchor="middle" fontSize="7.5" fontWeight="700" fill={T.sub}>{d}</text>))}<g transform={"rotate("+deg+",44,44)"}><polygon points="44,7 47.5,34 44,30 40.5,34" fill="#6366f1"/><polygon points="44,81 47.5,54 44,58 40.5,54" fill="#6366f1" opacity="0.2"/></g><circle cx="44" cy="44" r="5" fill={T.card} stroke="#6366f1" strokeWidth="2.5"/></svg><div style={{textAlign:"center"}}><div style={{fontSize:34,fontWeight:800,fontFamily:"Syne,sans-serif",color:"#6366f1",lineHeight:1,letterSpacing:-1}}>{speed}</div><div style={{fontSize:9,color:T.sub,letterSpacing:2,marginTop:3}}>{dir} · KTS</div></div></div>);}

function Badge({status,score,warnings}){const c=SC[status]||{bg:"#f8fafc",text:"#64748b",border:"#e2e8f0",dot:"#94a3b8"};return(<div style={{background:c.bg,border:"1px solid "+c.border,borderRadius:20,padding:"18px 20px"}}><div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:warnings.length?10:0}}><div style={{display:"flex",alignItems:"center",gap:10}}><div style={{width:10,height:10,borderRadius:"50%",background:c.dot,boxShadow:"0 0 0 3px "+c.border}}/><div style={{fontSize:20,fontWeight:900,fontFamily:"Syne,sans-serif",color:c.text,letterSpacing:-0.5}}>{status}</div></div><div style={{fontSize:10,fontWeight:700,color:c.text,opacity:0.6}}>{score}/100</div></div>{warnings.map((w,i)=><div key={i} style={{fontSize:12,color:c.text,fontWeight:500,marginTop:4,paddingLeft:20}}>· {w}</div>)}</div>);}

function Tile({label,value,unit,sub,color,T}){return(<div style={{background:T.card,borderRadius:18,padding:"18px 20px",boxShadow:T.shadow}}><div style={{fontSize:9,color:T.sub,letterSpacing:2.5,marginBottom:8,fontWeight:600,textTransform:"uppercase"}}>{label}</div><div style={{display:"flex",alignItems:"flex-end",gap:4}}><span style={{fontSize:26,fontWeight:800,fontFamily:"Syne,sans-serif",color:color||T.text,lineHeight:1,letterSpacing:-0.5}}>{value}</span>{unit&&<span style={{fontSize:12,color:T.sub,marginBottom:3,fontWeight:600}}>{unit}</span>}</div>{sub&&<div style={{fontSize:11,color:T.sub,marginTop:5}}>{sub}</div>}</div>);}

function Strip({hourly,waveH,T}){if(!hourly?.time)return null;const now=new Date();const items=hourly.time.map((t,i)=>({t:new Date(t),w:hourly.wind_speed_10m?.[i],wave:waveH?.[i]})).filter(x=>x.t>=now).slice(0,12);const max=Math.max(...items.map(x=>x.w||0));return(<div><div style={{fontSize:9,color:T.sub,letterSpacing:2.5,marginBottom:12,fontWeight:600}}>24H FORECAST</div><div style={{display:"flex",gap:6,overflowX:"auto",paddingBottom:4}}>{items.map((x,i)=>{const n=i===0,hi=x.w===max;return(<div key={i} style={{flexShrink:0,width:54,background:n?"linear-gradient(160deg,#6366f1,#818cf8)":hi?T.hi:T.card,borderRadius:14,padding:"10px 4px",textAlign:"center",boxShadow:n?"0 8px 20px rgba(99,102,241,0.35)":T.shadow}}><div style={{fontSize:7,color:n?"rgba(255,255,255,0.7)":T.sub,fontWeight:600,letterSpacing:0.5,marginBottom:3}}>{n?"NOW":x.t.getHours()+"h"}</div><div style={{fontSize:18,fontWeight:800,fontFamily:"Syne,sans-serif",color:n?"white":hi?"#6366f1":T.text}}>{Math.round(x.w||0)}</div><div style={{fontSize:7,color:n?"rgba(255,255,255,0.55)":T.sub,marginBottom:x.wave!=null?2:0}}>kts</div>{x.wave!=null&&<div style={{fontSize:8,color:n?"rgba(255,255,255,0.85)":"#0ea5e9",fontWeight:600}}>{x.wave.toFixed(1)}m</div>}</div>);})}</div></div>);}

function SpotCard({s,onClick,T}){const rc=RC[s.region]||"#6366f1";return(<div onClick={onClick} style={{background:T.card,borderRadius:20,padding:"18px 20px",marginBottom:10,cursor:"pointer",display:"flex",alignItems:"center",boxShadow:T.shadow,transition:"all .18s"}} onMouseEnter={e=>{e.currentTarget.style.transform="translateY(-3px)";e.currentTarget.style.boxShadow=T.shadowHover;}} onMouseLeave={e=>{e.currentTarget.style.transform="";e.currentTarget.style.boxShadow=T.shadow;}}><div style={{width:42,height:42,borderRadius:13,background:rc+"18",display:"flex",alignItems:"center",justifyContent:"center",marginRight:14,flexShrink:0}}><div style={{width:14,height:14,borderRadius:"50%",background:rc}}/></div><div style={{flex:1}}><div style={{fontWeight:800,fontSize:16,fontFamily:"Syne,sans-serif",color:T.text,letterSpacing:-0.3}}>{s.name}</div><div style={{fontSize:12,color:T.sub,marginTop:3,display:"flex",gap:8,alignItems:"center"}}><span>{s.country}</span><span style={{color:rc,fontWeight:700,fontSize:10,letterSpacing:0.5}}>{s.region.toUpperCase()}</span>{s.d&&<span style={{color:T.sub}}>{Math.round(s.d)} km</span>}</div></div><div style={{color:T.sub,fontSize:20,fontWeight:300}}>›</div></div>);}

export default function App(){
  const[dark,setDark]=useState(()=>window.matchMedia("(prefers-color-scheme: dark)").matches);
  const[view,setView]=useState("home");
  const[geo,setGeo]=useState(null);
  const[nearby,setNearby]=useState([]);
  const[query,setQuery]=useState("");
  const[spot,setSpot]=useState(null);
  const[data,setData]=useState(null);
  const[loading,setLoading]=useState(false);
  const[sport,setSport]=useState("surf");
  const[level,setLevel]=useState("advanced");
  useEffect(()=>{const mq=window.matchMedia("(prefers-color-scheme: dark)");const fn=e=>setDark(e.matches);mq.addEventListener("change",fn);return()=>mq.removeEventListener("change",fn);},[]);
  useEffect(()=>{if(!navigator.geolocation){setGeo("denied");return;}navigator.geolocation.getCurrentPosition(p=>{const{latitude:la,longitude:lo}=p.coords;setGeo({la,lo});setNearby(nearest(la,lo));},()=>setGeo("denied"));},[]);
  const pick=useCallback(async s=>{setSpot(s);setView("spot");setData(null);setLoading(true);try{const[w,m]=await Promise.all([getWeather(s.lat,s.lng),getMarine(s.lat,s.lng)]);setData({w,m});}catch{setData({err:true});}setLoading(false);},[]);
  const T={
    bg:dark?"#080c14":"#f4f6fb",
    card:dark?"#0f1623":"#ffffff",
    hi:dark?"#1a1f35":"#eef0ff",
    border:dark?"#1a2235":"#eaecf4",
    line:dark?"#1e2a3d":"#e8ebf4",
    text:dark?"#eef2ff":"#0f172a",
    sub:dark?"#4a5568":"#94a3b8",
    shadow:dark?"0 2px 12px rgba(0,0,0,0.45)":"0 2px 12px rgba(99,102,241,0.07),0 1px 3px rgba(0,0,0,0.05)",
    shadowHover:dark?"0 12px 32px rgba(0,0,0,0.6)":"0 12px 32px rgba(99,102,241,0.18)",
  };
  const wd=data?.w,wm=data?.m;
  const wind=Math.round(wd?.current?.wind_speed_10m||0);
  const gust=Math.round(wd?.current?.wind_gusts_10m||0);
  const wdir=wd?.current?.wind_direction_10m||0;
  const wave=wm?.current?.wave_height||0;
  const period=wm?.current?.wave_period||0;
  const swell=wm?.current?.swell_wave_height||0;
  const sst=wm?.current?.sea_surface_temperature??null;
  const airT=Math.round(wd?.current?.temperature_2m||0);
  const feelT=Math.round(wd?.current?.apparent_temperature||0);
  const uv=wd?.current?.uv_index||0;
  const sf=safety(wind,wave,sport,level);
  const srList=query?search(query):[];
  const listSpots=geo&&geo!=="denied"?nearby:S;
  return(
    <div style={{minHeight:"100vh",background:T.bg,color:T.text,fontFamily:"DM Sans,sans-serif"}}>

      {/* HOME */}
      {view==="home"&&(<>
        {/* Hero */}
        <div style={{position:"relative",overflow:"hidden",background:"linear-gradient(135deg,#4338ca 0%,#6366f1 45%,#818cf8 75%,#38bdf8 100%)",padding:"52px 24px 80px"}}>
          {/* Decorative blobs */}
          <div style={{position:"absolute",top:-60,right:-60,width:260,height:260,borderRadius:"50%",background:"rgba(255,255,255,0.07)",pointerEvents:"none"}}/>
          <div style={{position:"absolute",bottom:-80,left:-40,width:300,height:300,borderRadius:"50%",background:"rgba(255,255,255,0.05)",pointerEvents:"none"}}/>
          <div style={{position:"absolute",top:20,left:"40%",width:150,height:150,borderRadius:"50%",background:"rgba(255,255,255,0.04)",pointerEvents:"none"}}/>
          <div style={{position:"relative",maxWidth:480,margin:"0 auto"}}>
            <div style={{display:"inline-flex",alignItems:"center",gap:6,background:"rgba(255,255,255,0.15)",backdropFilter:"blur(8px)",borderRadius:20,padding:"5px 12px",marginBottom:18}}><div style={{width:7,height:7,borderRadius:"50%",background:"#a5f3fc"}}/><span style={{fontSize:11,fontWeight:600,color:"rgba(255,255,255,0.9)",letterSpacing:1}}>REAL-TIME CONDITIONS</span></div>
            <div style={{fontSize:44,fontWeight:900,fontFamily:"Syne,sans-serif",color:"white",lineHeight:1.05,letterSpacing:-1.5,marginBottom:12}}>Know before<br/>you go.</div>
            <div style={{fontSize:15,color:"rgba(255,255,255,0.75)",fontWeight:400,marginBottom:28,lineHeight:1.5}}>Live wind, wave & surf conditions<br/>for 20 world-class spots.</div>
            <input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search any spot…" style={{width:"100%",padding:"15px 18px",borderRadius:16,border:"none",background:"rgba(255,255,255,0.18)",backdropFilter:"blur(12px)",color:"white",fontSize:15,boxSizing:"border-box",outline:"none"}} onFocus={e=>e.target.style.background="rgba(255,255,255,0.25)"} onBlur={e=>e.target.style.background="rgba(255,255,255,0.18)"}/>
          </div>
        </div>
        {/* Cards */}
        <div style={{padding:"0 16px",maxWidth:480,margin:"-28px auto 0",position:"relative",zIndex:2}}>
          {srList.length>0
            ?<><div style={{fontSize:9,color:T.sub,letterSpacing:2.5,marginBottom:12,fontWeight:600,paddingTop:8}}>RESULTS</div>{srList.map(s=><SpotCard key={s.id} s={s} onClick={()=>pick(s)} T={T}/>)}</>
            :<><div style={{fontSize:9,color:T.sub,letterSpacing:2.5,marginBottom:12,fontWeight:600,paddingTop:8}}>{geo===null?"DETECTING LOCATION…":geo==="denied"?"ALL SPOTS":"NEAREST SPOTS"}</div>{listSpots.map(s=><SpotCard key={s.id} s={s} onClick={()=>pick(s)} T={T}/>)}</>
          }
        </div>
      </>)}

      {/* SPOT DETAIL */}
      {view==="spot"&&(<>
        {/* Detail hero */}
        <div style={{position:"relative",overflow:"hidden",background:"linear-gradient(135deg,#4338ca 0%,#6366f1 50%,#818cf8 100%)",padding:"20px 24px 60px"}}>
          <div style={{position:"absolute",top:-40,right:-40,width:200,height:200,borderRadius:"50%",background:"rgba(255,255,255,0.06)",pointerEvents:"none"}}/>
          <div style={{position:"absolute",bottom:-60,left:-30,width:220,height:220,borderRadius:"50%",background:"rgba(255,255,255,0.04)",pointerEvents:"none"}}/>
          <div style={{position:"relative",maxWidth:480,margin:"0 auto"}}>
            <button onClick={()=>{setView("home");setQuery("");}} style={{background:"rgba(255,255,255,0.15)",border:"none",color:"white",fontSize:13,cursor:"pointer",padding:"7px 14px",borderRadius:20,fontWeight:600,marginBottom:20,display:"flex",alignItems:"center",gap:6}}>← Back</button>
            <div style={{fontSize:11,color:"rgba(255,255,255,0.65)",letterSpacing:1.5,fontWeight:600,marginBottom:6}}>{spot?.country?.toUpperCase()} · {spot?.region?.toUpperCase()}</div>
            <div style={{fontSize:36,fontWeight:900,fontFamily:"Syne,sans-serif",color:"white",letterSpacing:-1,lineHeight:1.1,marginBottom:20}}>{spot?.name}</div>
            {/* Sport pills in hero */}
            <div style={{display:"flex",gap:6,overflowX:"auto",paddingBottom:2}}>
              {SPORTS.map(sp=><button key={sp} onClick={()=>setSport(sp)} style={{flexShrink:0,padding:"7px 15px",borderRadius:20,border:"1.5px solid "+(sport===sp?"white":"rgba(255,255,255,0.3)"),background:sport===sp?"white":"transparent",color:sport===sp?"#6366f1":"rgba(255,255,255,0.85)",fontWeight:700,fontSize:12,cursor:"pointer",textTransform:"capitalize",transition:"all .15s"}}>{sp==="sup"?"SUP":sp}</button>)}
            </div>
          </div>
        </div>

        {/* Content */}
        <div style={{maxWidth:480,margin:"-24px auto 0",padding:"0 16px 32px",position:"relative",zIndex:2}}>
          {/* Level + safety row */}
          <div style={{background:T.card,borderRadius:20,padding:"14px 16px",boxShadow:T.shadow,marginBottom:12}}>
            <div style={{display:"flex",background:T.bg,borderRadius:12,padding:3,gap:3}}>
              {LEVELS.map(lv=><button key={lv} onClick={()=>setLevel(lv)} style={{flex:1,padding:"8px 0",borderRadius:10,border:"none",background:level===lv?"#6366f1":"transparent",color:level===lv?"white":T.sub,fontWeight:700,fontSize:11,cursor:"pointer",textTransform:"capitalize",transition:"all .15s",boxShadow:level===lv?"0 2px 8px rgba(99,102,241,0.4)":"none"}}>{lv}</button>)}
            </div>
          </div>

          {loading&&<div style={{textAlign:"center",padding:"60px 0"}}><div style={{width:32,height:32,border:"2.5px solid "+T.border,borderTop:"2.5px solid #6366f1",borderRadius:"50%",margin:"0 auto 14px",animation:"spin 0.8s linear infinite"}}/><div style={{color:T.sub,fontSize:13}}>Loading conditions…</div></div>}
          {data?.err&&<div style={{textAlign:"center",padding:"60px 0"}}><div style={{fontSize:36,marginBottom:10}}>⚠️</div><div style={{color:"#f43f5e",fontWeight:700,fontSize:15}}>Couldn't load data</div><div style={{color:T.sub,fontSize:12,marginTop:4}}>Check your connection</div></div>}

          {data&&!data.err&&<div className="fade-up">
            <div style={{marginBottom:12}}><Badge status={sf.status} score={sf.score} warnings={sf.warnings}/></div>

            {/* Compass card */}
            <div style={{background:T.card,borderRadius:20,padding:"24px 20px",boxShadow:T.shadow,marginBottom:12,display:"flex",alignItems:"center",gap:20}}>
              <Compass deg={wdir} speed={wind} T={T}/>
              <div style={{flex:1,display:"flex",flexDirection:"column",gap:12}}>
                <div><div style={{fontSize:9,color:T.sub,letterSpacing:2,fontWeight:600,marginBottom:3}}>GUSTS</div><div style={{fontSize:24,fontWeight:800,fontFamily:"Syne,sans-serif",color:T.text,letterSpacing:-0.5}}>{gust}<span style={{fontSize:12,color:T.sub,fontWeight:600,marginLeft:3}}>kts</span></div></div>
                <div><div style={{fontSize:9,color:T.sub,letterSpacing:2,fontWeight:600,marginBottom:3}}>WAVE</div><div style={{fontSize:24,fontWeight:800,fontFamily:"Syne,sans-serif",color:"#6366f1",letterSpacing:-0.5}}>{wave.toFixed(1)}<span style={{fontSize:12,color:T.sub,fontWeight:600,marginLeft:3}}>m</span></div></div>
                <div><div style={{fontSize:9,color:T.sub,letterSpacing:2,fontWeight:600,marginBottom:3}}>PERIOD</div><div style={{fontSize:24,fontWeight:800,fontFamily:"Syne,sans-serif",color:T.text,letterSpacing:-0.5}}>{Math.round(period)}<span style={{fontSize:12,color:T.sub,fontWeight:600,marginLeft:3}}>s</span></div></div>
              </div>
            </div>

            {/* Data grid */}
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:12}}>
              <Tile label="Swell" value={swell.toFixed(1)} unit="m" T={T}/>
              <Tile label="Air Temp" value={airT} unit="°C" sub={"Feels "+feelT+"°"} T={T}/>
              <Tile label="UV Index" value={uv.toFixed(1)} color={uv>7?"#f43f5e":uv>3?"#f59e0b":"#22c55e"} T={T}/>
              {sst!=null&&<Tile label="Water Temp" value={Math.round(sst)} unit="°C" sub={wetsuit(sst)} color={wcolor(sst)} T={T}/>}
            </div>

            {/* Gear card */}
            {(sport==="kite"||sport==="windsurf")&&<div style={{background:"linear-gradient(135deg,#4338ca,#6366f1)",borderRadius:20,padding:"20px 22px",marginBottom:12,boxShadow:"0 8px 24px rgba(99,102,241,0.3)"}}><div style={{fontSize:9,letterSpacing:2.5,color:"rgba(255,255,255,0.65)",marginBottom:6,fontWeight:600}}>RECOMMENDED GEAR</div><div style={{fontSize:22,fontWeight:800,fontFamily:"Syne,sans-serif",color:"white",letterSpacing:-0.5}}>{sport==="kite"?kite(wind)+" kite":sail(wind)+" sail"}</div></div>}

            {/* Forecast */}
            <div style={{background:T.card,borderRadius:20,padding:"20px",boxShadow:T.shadow}}>
              <Strip hourly={wd?.hourly} waveH={wm?.hourly?.wave_height} T={T}/>
            </div>
          </div>}
        </div>
      </>)}
    </div>
  );
}
