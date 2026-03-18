import{useState,useEffect,useCallback}from"react";
async function getWeather(a,b){const r=await fetch("https://api.open-meteo.com/v1/forecast?latitude="+a+"&longitude="+b+"&current=temperature_2m,wind_speed_10m,wind_direction_10m,wind_gusts_10m,uv_index,apparent_temperature&hourly=wind_speed_10m,wind_gusts_10m&forecast_days=2&wind_speed_unit=kn&timezone=auto");if(!r.ok)throw new Error("err "+r.status);return r.json();}
async function getMarine(a,b){try{const r=await fetch("https://marine-api.open-meteo.com/v1/marine?latitude="+a+"&longitude="+b+"&current=wave_height,wave_period,swell_wave_height,sea_surface_temperature&hourly=wave_height&timezone=auto&forecast_days=2");if(!r.ok)return null;return r.json();}catch{return null;}}
const S=[{id:43,name:"Tarifa",country:"Spain",lat:36,lng:-5.65,region:"Europe"},{id:5693,name:"Maui",country:"Hawaii USA",lat:20.906,lng:-156.422,region:"Pacific"},{id:309513,name:"Hossegor",country:"France",lat:43.658,lng:-1.447,region:"Europe"},{id:75856,name:"Nazare",country:"Portugal",lat:39.6,lng:-9.075,region:"Europe"},{id:4239,name:"Cape Town",country:"S.Africa",lat:-33.917,lng:18.404,region:"Africa"},{id:26,name:"Essaouira",country:"Morocco",lat:31.502,lng:-9.764,region:"Africa"},{id:15278,name:"Dakhla",country:"Morocco",lat:23.917,lng:-15.774,region:"Africa"},{id:782987,name:"Siargao",country:"Philippines",lat:9.792,lng:126.162,region:"Asia"},{id:231,name:"Uluwatu",country:"Bali",lat:-8.83,lng:115.09,region:"Asia"},{id:158,name:"Canggu",country:"Bali",lat:-8.65,lng:115.13,region:"Asia"},{id:211,name:"Ericeira",country:"Portugal",lat:38.963,lng:-9.416,region:"Europe"},{id:203944,name:"Sagres",country:"Portugal",lat:37.014,lng:-8.938,region:"Europe"},{id:15604,name:"Cabarete",country:"Dom.Republic",lat:19.751,lng:-70.412,region:"Caribbean"},{id:15025,name:"Aruba",country:"Aruba",lat:12.57,lng:-70.06,region:"Caribbean"},{id:50613,name:"Zanzibar",country:"Tanzania",lat:-5.95,lng:39.45,region:"Indian"},{id:49045,name:"El Gouna",country:"Egypt",lat:27.4,lng:33.68,region:"Indian"},{id:456789,name:"El Medano",country:"Tenerife",lat:28.047,lng:-16.534,region:"Atlantic"},{id:567890,name:"Corralejo",country:"Fuerteventura",lat:28.728,lng:-13.867,region:"Atlantic"},{id:15605,name:"Jericoacoara",country:"Brazil",lat:-2.9,lng:-40.51,region:"S.America"},{id:990123,name:"Rio de Janeiro",country:"Brazil",lat:-22.987,lng:-43.192,region:"S.America"}];
function dist(a1,o1,a2,o2){const R=6371,da=(a2-a1)*Math.PI/180,doo=(o2-o1)*Math.PI/180,a=Math.sin(da/2)**2+Math.cos(a1*Math.PI/180)*Math.cos(a2*Math.PI/180)*Math.sin(doo/2)**2;return R*2*Math.atan2(Math.sqrt(a),Math.sqrt(1-a));}
function search(q){if(!q)return[];const l=q.toLowerCase();return S.map(s=>({...s,sc:(s.name.toLowerCase().includes(l)?2:0)+(s.country.toLowerCase().includes(l)?1:0)})).filter(s=>s.sc>0).sort((a,b)=>b.sc-a.sc).slice(0,6);}
function nearest(la,lo){return S.map(s=>({...s,d:dist(la,lo,s.lat,s.lng)})).sort((a,b)=>a.d-b.d).slice(0,6);}
const WD=["N","NNE","NE","ENE","E","ESE","SE","SSE","S","SSW","SW","WSW","W","WNW","NW","NNW"];
const wetsuit=t=>!t||t>=24?"Boardshorts":t>=21?"1-2mm Shorty":t>=18?"2mm Shorty":t>=15?"3/2mm Fullsuit":t>=12?"4/3mm Fullsuit":"5mm+ Drysuit";
const wcolor=t=>!t||t>=24?"#f97316":t>=18?"#eab308":t>=15?"#0ea5e9":"#6366f1";
const kite=w=>w<8?"Too light":w<12?"17-19m":w<16?"14-17m":w<20?"12-14m":w<25?"10-12m":w<30?"9-10m":"7-9m";
const sail=w=>w<8?"8-10m":w<14?"6.5-8m":w<18?"5.5-6.5m":w<24?"4.5-5.5m":"3.5-4.5m";
function safety(wind,wave,sport,level){const ex=level==="expert"||level==="advanced",bg=level==="beginner";const L={surf:{minWave:0.3,maxWave:ex?6:bg?1.5:3,maxWind:25},kite:{minWind:8,maxWind:ex?45:bg?20:35},windsurf:{minWind:8,maxWind:ex?50:bg?20:40},kayak:{maxWind:bg?15:25},sup:{maxWind:bg?12:20},sail:{minWind:5,maxWind:ex?40:30},fishing:{maxWind:25}}[sport]||{};let sc=100;const w=[];if(L.minWind&&wind<L.minWind){sc-=30;w.push("Wind too light");}if(L.maxWind&&wind>L.maxWind){sc-=40;w.push("Too strong for "+level);}if(L.minWave&&wave<L.minWave){sc-=20;w.push("Waves too small");}if(L.maxWave&&wave>L.maxWave){sc-=40;w.push("Waves too big");}return{status:sc<=30?"NO-GO":sc<=65?"CAUTION":"GO",score:Math.max(0,sc),warnings:w};}
const RC={Europe:"#0ea5e9",Pacific:"#f59e0b",Africa:"#f97316",Asia:"#a855f7",Caribbean:"#10b981",Indian:"#3b82f6",Atlantic:"#6366f1","S.America":"#22c55e"};
const SC={GO:{bg:"#dcfce7",text:"#15803d",border:"#bbf7d0",glow:"rgba(34,197,94,0.15)"},CAUTION:{bg:"#fefce8",text:"#a16207",border:"#fde68a",glow:"rgba(234,179,8,0.15)"},"NO-GO":{bg:"#fef2f2",text:"#b91c1c",border:"#fecaca",glow:"rgba(239,68,68,0.15)"}};
function Compass({deg,speed,T}){const dir=WD[Math.round(deg/22.5)%16];return(<div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:8}}><svg width="80" height="80" viewBox="0 0 80 80"><defs><radialGradient id="cg" cx="50%" cy="50%" r="50%"><stop offset="0%" stopColor={T.card2}/><stop offset="100%" stopColor={T.bg}/></radialGradient></defs><circle cx="40" cy="40" r="37" fill="url(#cg)" stroke={T.border} strokeWidth="1.5"/>{[0,90,180,270].map(a=>(<line key={a} x1={40+32*Math.sin(a*Math.PI/180)} y1={40-32*Math.cos(a*Math.PI/180)} x2={40+37*Math.sin(a*Math.PI/180)} y2={40-37*Math.cos(a*Math.PI/180)} stroke={T.border} strokeWidth="1.5"/>))}{["N","E","S","W"].map((d,i)=>(<text key={d} x={40+24*Math.sin(i*Math.PI/2)} y={40-24*Math.cos(i*Math.PI/2)+3.5} textAnchor="middle" fontSize="7" fontWeight="700" fontFamily="DM Sans" fill={T.sub} letterSpacing="0.5">{d}</text>))}<g transform={"rotate("+deg+",40,40)"}><polygon points="40,8 43.5,32 40,28 36.5,32" fill="#0ea5e9"/><polygon points="40,72 43.5,48 40,52 36.5,48" fill="#0ea5e9" opacity="0.25"/></g><circle cx="40" cy="40" r="5" fill={T.card} stroke="#0ea5e9" strokeWidth="2"/></svg><div style={{textAlign:"center"}}><div style={{fontSize:32,fontWeight:800,fontFamily:"Syne,sans-serif",color:"#0ea5e9",lineHeight:1,letterSpacing:-1}}>{speed}</div><div style={{fontSize:9,color:T.sub,letterSpacing:2,marginTop:2}}>{dir} · KTS</div></div></div>);}
function Tile({label,value,unit,sub,color,T,wide}){return(<div style={{background:T.card,border:"1.5px solid "+T.border,borderRadius:14,padding:"14px 16px",boxShadow:T.shadow,gridColumn:wide?"span 2":"auto"}}><div style={{fontSize:9,color:T.sub,letterSpacing:2.5,marginBottom:6,fontWeight:600}}>{label}</div><div style={{display:"flex",alignItems:"flex-end",gap:4}}><span style={{fontSize:22,fontWeight:800,fontFamily:"Syne,sans-serif",color:color||T.text,lineHeight:1,letterSpacing:-0.5}}>{value}</span>{unit&&<span style={{fontSize:11,color:T.sub,marginBottom:2,fontWeight:600}}>{unit}</span>}</div>{sub&&<div style={{fontSize:11,color:T.sub,marginTop:4,fontWeight:500}}>{sub}</div>}</div>);}
function Badge({status,score,warnings}){const c=SC[status]||{bg:"#f8fafc",text:"#64748b",border:"#e2e8f0",glow:"transparent"};return(<div style={{background:c.bg,border:"1.5px solid "+c.border,borderRadius:16,padding:"16px 18px",boxShadow:"0 0 0 4px "+c.glow}}><div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:warnings.length?8:0}}><div style={{fontSize:22,fontWeight:900,fontFamily:"Syne,sans-serif",color:c.text,letterSpacing:-0.5}}>{status}</div><div style={{background:c.border,borderRadius:20,padding:"3px 10px",fontSize:10,fontWeight:700,color:c.text}}>SCORE {score}/100</div></div>{warnings.map((w,i)=><div key={i} style={{fontSize:12,color:c.text,fontWeight:500,display:"flex",alignItems:"center",gap:6}}><span style={{fontSize:8}}>●</span>{w}</div>)}</div>);}
function Strip({hourly,waveH,T}){if(!hourly?.time)return null;const now=new Date();const items=hourly.time.map((t,i)=>({t:new Date(t),w:hourly.wind_speed_10m?.[i],wave:waveH?.[i]})).filter(x=>x.t>=now).slice(0,12);return(<div><div style={{fontSize:9,color:T.sub,letterSpacing:2.5,marginBottom:10,fontWeight:600}}>24H FORECAST</div><div style={{display:"flex",gap:6,overflowX:"auto",paddingBottom:4}}>{items.map((x,i)=>{const n=i===0,hi=x.w===Math.max(...items.map(y=>y.w||0));return(<div key={i} style={{flexShrink:0,width:52,background:n?"linear-gradient(135deg,#0ea5e9,#6366f1)":hi?T.card2:T.card,border:"1.5px solid "+(n?"transparent":T.border),borderRadius:12,padding:"8px 4px",textAlign:"center",boxShadow:n?("0 4px 12px rgba(14,165,233,0.35)"):T.shadow}}><div style={{fontSize:7,color:n?"rgba(255,255,255,0.75)":T.sub,fontWeight:600,letterSpacing:0.5}}>{n?"NOW":x.t.getHours()+"h"}</div><div style={{fontSize:17,fontWeight:800,fontFamily:"Syne,sans-serif",color:n?"white":T.text,marginTop:2}}>{Math.round(x.w||0)}</div><div style={{fontSize:7,color:n?"rgba(255,255,255,0.6)":T.sub}}>kts</div>{x.wave!=null&&<div style={{fontSize:8,color:n?"rgba(255,255,255,0.85)":"#0ea5e9",marginTop:2,fontWeight:600}}>{x.wave.toFixed(1)}m</div>}</div>);})}</div></div>);}
function SpotCard({s,onClick,T}){const rc=RC[s.region]||"#64748b";return(<div onClick={onClick} className="fade-up" style={{background:T.card,border:"1.5px solid "+T.border,borderRadius:16,padding:"0",marginBottom:10,cursor:"pointer",display:"flex",alignItems:"stretch",overflow:"hidden",boxShadow:T.shadow,transition:"transform .15s,box-shadow .15s"}} onMouseEnter={e=>{e.currentTarget.style.transform="translateY(-2px)";e.currentTarget.style.boxShadow=T.shadowHover;}} onMouseLeave={e=>{e.currentTarget.style.transform="";e.currentTarget.style.boxShadow=T.shadow;}}><div style={{width:4,background:rc,flexShrink:0}}/><div style={{flex:1,padding:"14px 16px",display:"flex",justifyContent:"space-between",alignItems:"center"}}><div><div style={{fontWeight:800,fontSize:16,fontFamily:"Syne,sans-serif",color:T.text,letterSpacing:-0.3}}>{s.name}</div><div style={{display:"flex",alignItems:"center",gap:6,marginTop:3}}><span style={{fontSize:11,color:T.sub,fontWeight:500}}>{s.country}</span><span style={{width:3,height:3,borderRadius:"50%",background:T.border,display:"inline-block"}}/><span style={{fontSize:10,color:rc,fontWeight:700,letterSpacing:0.5}}>{s.region.toUpperCase()}</span></div>{s.d&&<div style={{fontSize:10,color:T.sub,marginTop:2}}>{Math.round(s.d)} km away</div>}</div><div style={{color:rc,fontSize:18,fontWeight:800,opacity:0.7}}>→</div></div></div>);}
const SPORTS=["surf","kite","windsurf","kayak","sup","sail","fishing"];
const LEVELS=["beginner","advanced","expert"];
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
    bg:dark?"#0b0f19":"#f0f4f8",
    card:dark?"#141926":"#ffffff",
    card2:dark?"#1a2035":"#f8fafc",
    border:dark?"#1e2a3d":"#e2e8f0",
    text:dark?"#f0f4ff":"#0f172a",
    sub:dark?"#64748b":"#94a3b8",
    shadow:dark?"0 1px 3px rgba(0,0,0,0.4)":"0 1px 3px rgba(0,0,0,0.07),0 1px 2px rgba(0,0,0,0.04)",
    shadowHover:dark?"0 8px 24px rgba(0,0,0,0.5)":"0 8px 24px rgba(0,0,0,0.12)",
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
  const sc=SC[sf.status]||{};
  const srList=query?search(query):[];
  const listSpots=geo&&geo!=="denied"?nearby:S;
  return(
    <div style={{minHeight:"100vh",background:T.bg,color:T.text,fontFamily:"DM Sans,sans-serif"}}>
      {/* Header */}
      <div style={{padding:"14px 20px",borderBottom:"1px solid "+T.border,display:"flex",alignItems:"center",gap:12,position:"sticky",top:0,background:T.bg+"ee",zIndex:10,backdropFilter:"blur(12px)"}}>
        {view==="spot"
          ?<><button onClick={()=>{setView("home");setQuery("");}} style={{background:"none",border:"none",color:"#0ea5e9",fontSize:20,cursor:"pointer",padding:0,lineHeight:1,fontWeight:700,marginRight:2}}>←</button><div style={{flex:1}}><div style={{fontSize:16,fontWeight:800,fontFamily:"Syne,sans-serif",color:T.text,letterSpacing:-0.3}}>{spot?.name}</div><div style={{fontSize:11,color:T.sub,marginTop:1}}>{spot?.country} · {spot?.region}</div></div></>
          :<><div style={{fontSize:22,fontWeight:900,fontFamily:"Syne,sans-serif",background:"linear-gradient(135deg,#0ea5e9,#6366f1)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",letterSpacing:-0.5}}>WaveIQ</div><div style={{fontSize:12,color:T.sub,fontWeight:500}}>Real-time conditions</div></>
        }
      </div>
      {/* Home */}
      {view==="home"&&(
        <div style={{padding:"20px 16px",maxWidth:480,margin:"0 auto"}}>
          <input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search spots by name or country…" style={{width:"100%",padding:"13px 16px",borderRadius:14,border:"1.5px solid "+T.border,background:T.card,color:T.text,fontSize:14,marginBottom:20,boxShadow:T.shadow,transition:"all .2s"}}/>
          {srList.length>0
            ?<><div style={{fontSize:9,color:T.sub,letterSpacing:2.5,marginBottom:12,fontWeight:600}}>RESULTS</div>{srList.map(s=><SpotCard key={s.id} s={s} onClick={()=>pick(s)} T={T}/>)}</>
            :<><div style={{fontSize:9,color:T.sub,letterSpacing:2.5,marginBottom:12,fontWeight:600}}>{geo===null?"DETECTING YOUR LOCATION…":geo==="denied"?"ALL SPOTS":"NEAREST SPOTS"}</div>{listSpots.map(s=><SpotCard key={s.id} s={s} onClick={()=>pick(s)} T={T}/>)}</>
          }
        </div>
      )}
      {/* Spot detail */}
      {view==="spot"&&(
        <div style={{maxWidth:480,margin:"0 auto"}}>
          {/* Safety color banner */}
          {data&&!data.err&&<div style={{height:4,background:"linear-gradient(90deg,"+sc.border+","+sc.border+"88)"}}/>}
          <div style={{padding:"16px"}}>
            {/* Sport pills */}
            <div style={{display:"flex",gap:6,overflowX:"auto",marginBottom:12,paddingBottom:2}}>
              {SPORTS.map(sp=><button key={sp} onClick={()=>setSport(sp)} style={{flexShrink:0,padding:"8px 16px",borderRadius:20,border:"1.5px solid "+(sport===sp?"#0ea5e9":T.border),background:sport===sp?"#0ea5e9":T.card,color:sport===sp?"white":T.sub,fontWeight:700,fontSize:12,cursor:"pointer",textTransform:"capitalize",boxShadow:sport===sp?"0 4px 12px rgba(14,165,233,0.3)":T.shadow,transition:"all .15s"}}>{sp==="sup"?"SUP":sp}</button>)}
            </div>
            {/* Level segmented */}
            <div style={{display:"flex",background:T.card2,borderRadius:12,padding:3,marginBottom:18,border:"1px solid "+T.border}}>
              {LEVELS.map(lv=><button key={lv} onClick={()=>setLevel(lv)} style={{flex:1,padding:"7px 0",borderRadius:10,border:"none",background:level===lv?"#0ea5e9":"transparent",color:level===lv?"white":T.sub,fontWeight:700,fontSize:11,cursor:"pointer",textTransform:"capitalize",transition:"all .15s",boxShadow:level===lv?"0 2px 8px rgba(14,165,233,0.3)":"none"}}>{lv}</button>)}
            </div>
            {loading&&<div style={{textAlign:"center",padding:60,color:T.sub}}><div style={{fontSize:13,fontWeight:600,marginBottom:8}}>Loading conditions…</div><div style={{width:28,height:28,border:"2px solid "+T.border,borderTop:"2px solid #0ea5e9",borderRadius:"50%",margin:"0 auto",animation:"spin 0.8s linear infinite"}}/></div>}
            {data?.err&&<div style={{textAlign:"center",padding:60}}><div style={{fontSize:32,marginBottom:8}}>⚠️</div><div style={{color:"#ef4444",fontSize:14,fontWeight:600}}>Failed to load data</div><div style={{color:T.sub,fontSize:12,marginTop:4}}>Check your connection and try again</div></div>}
            {data&&!data.err&&<div className="fade-up">
              {/* Safety badge */}
              <div style={{marginBottom:14}}><Badge status={sf.status} score={sf.score} warnings={sf.warnings}/></div>
              {/* Compass + right tiles */}
              <div style={{display:"flex",gap:10,marginBottom:10}}>
                <div style={{flex:"0 0 auto",width:140,background:T.card,border:"1.5px solid "+T.border,borderRadius:16,padding:"16px 12px",display:"flex",justifyContent:"center",alignItems:"center",boxShadow:T.shadow}}><Compass deg={wdir} speed={wind} T={T}/></div>
                <div style={{flex:1,display:"flex",flexDirection:"column",gap:8}}>
                  <Tile label="GUSTS" value={gust} unit="kts" T={T}/>
                  <Tile label="WAVE HEIGHT" value={wave.toFixed(1)} unit="m" color="#0ea5e9" T={T}/>
                  <Tile label="PERIOD" value={Math.round(period)} unit="s" T={T}/>
                </div>
              </div>
              {/* Data grid */}
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:10}}>
                <Tile label="SWELL" value={swell.toFixed(1)} unit="m" T={T}/>
                <Tile label="AIR TEMP" value={airT} unit="°C" sub={"Feels "+feelT+"°"} T={T}/>
                <Tile label="UV INDEX" value={uv.toFixed(1)} color={uv>7?"#ef4444":uv>3?"#f59e0b":"#22c55e"} T={T}/>
                {sst!=null&&<Tile label="WATER TEMP" value={Math.round(sst)} unit="°C" sub={wetsuit(sst)} color={wcolor(sst)} T={T}/>}
              </div>
              {/* Gear */}
              {(sport==="kite"||sport==="windsurf")&&<div style={{background:dark?"linear-gradient(135deg,#0c1b33,#0f2a4a)":"linear-gradient(135deg,#eff6ff,#e0f2fe)",border:"1.5px solid "+(dark?"#1e3a5f":"#bae6fd"),borderRadius:14,padding:"14px 16px",marginBottom:10}}><div style={{fontSize:9,letterSpacing:2.5,color:dark?"#7dd3fc":"#0369a1",marginBottom:6,fontWeight:600}}>RECOMMENDED GEAR</div><div style={{fontSize:18,fontWeight:800,fontFamily:"Syne,sans-serif",color:dark?"#7dd3fc":"#0ea5e9"}}>{sport==="kite"?kite(wind)+" kite":sail(wind)+" sail"}</div></div>}
              {/* Forecast */}
              <Strip hourly={wd?.hourly} waveH={wm?.hourly?.wave_height} T={T}/>
            </div>}
          </div>
        </div>
      )}
    </div>
  );
}
