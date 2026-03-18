import { useState, useEffect, useCallback } from 'react';
import { S } from '../data/spots';
import { getWeather, getMarine } from '../utils/api';
import { nearest, searchSpots } from '../utils/geo';
import { safety, kite, sail, wetsuit, wcolor } from '../utils/safety';
import { SPORTS, LEVELS, SC } from '../shared/theme';
import Compass from '../components/Compass';
import Badge from '../components/Badge';
import Tile from '../components/Tile';
import Strip from '../components/Strip';
import SpotCard from '../components/SpotCard';

export default function Dashboard({ T, dark }) {
  const [geo,     setGeo]     = useState(null);
  const [nearby,  setNearby]  = useState([]);
  const [query,   setQuery]   = useState("");
  const [spot,    setSpot]    = useState(null);
  const [data,    setData]    = useState(null);
  const [loading, setLoading] = useState(false);
  const [sport,   setSport]   = useState("surf");
  const [level,   setLevel]   = useState("advanced");

  useEffect(() => {
    if (!navigator.geolocation) { setGeo("denied"); return; }
    navigator.geolocation.getCurrentPosition(
      p => { const {latitude:la,longitude:lo} = p.coords; setGeo({la,lo}); setNearby(nearest(la,lo)); },
      () => setGeo("denied")
    );
  }, []);

  const pick = useCallback(async s => {
    setSpot(s); setData(null); setLoading(true);
    try {
      const [w, m] = await Promise.all([getWeather(s.lat, s.lng), getMarine(s.lat, s.lng)]);
      setData({w, m});
    } catch { setData({err:true}); }
    setLoading(false);
  }, []);

  const wd = data?.w, wm = data?.m;
  const wind   = Math.round(wd?.current?.wind_speed_10m    || 0);
  const gust   = Math.round(wd?.current?.wind_gusts_10m    || 0);
  const wdir   =            wd?.current?.wind_direction_10m || 0;
  const wave   =            wm?.current?.wave_height        || 0;
  const period =            wm?.current?.wave_period        || 0;
  const swell  =            wm?.current?.swell_wave_height  || 0;
  const sst    =            wm?.current?.sea_surface_temperature ?? null;
  const airT   = Math.round(wd?.current?.temperature_2m     || 0);
  const feelT  = Math.round(wd?.current?.apparent_temperature|| 0);
  const uv     =            wd?.current?.uv_index           || 0;
  const sf = safety(wind, wave, sport, level);
  const sc = SC[sf.status] || {};

  const srList = query ? searchSpots(query) : [];
  const listSpots = geo && geo !== "denied" ? nearby : S;

  if (spot) return (
    <div style={{fontFamily:"DM Sans,sans-serif"}}>
      {/* Detail hero */}
      <div style={{position:"relative",overflow:"hidden",background:"linear-gradient(135deg,#4338ca 0%,#6366f1 50%,#818cf8 100%)",padding:"20px 24px 60px"}}>
        <div style={{position:"absolute",top:-40,right:-40,width:200,height:200,borderRadius:"50%",background:"rgba(255,255,255,0.06)",pointerEvents:"none"}}/>
        <div style={{maxWidth:480,margin:"0 auto"}}>
          <button onClick={()=>{setSpot(null);setData(null);}} style={{background:"rgba(255,255,255,0.15)",border:"none",color:"white",fontSize:13,cursor:"pointer",padding:"7px 14px",borderRadius:20,fontWeight:600,marginBottom:20,display:"flex",alignItems:"center",gap:6}}>← Back</button>
          <div style={{fontSize:11,color:"rgba(255,255,255,0.65)",letterSpacing:1.5,fontWeight:600,marginBottom:6}}>{spot.country?.toUpperCase()} · {spot.region?.toUpperCase()}</div>
          <div style={{fontSize:36,fontWeight:900,fontFamily:"Syne,sans-serif",color:"white",letterSpacing:-1,lineHeight:1.1,marginBottom:20}}>{spot.name}</div>
          <div style={{display:"flex",gap:6,overflowX:"auto"}}>
            {SPORTS.map(sp=><button key={sp} onClick={()=>setSport(sp)} style={{flexShrink:0,padding:"7px 15px",borderRadius:20,border:"1.5px solid "+(sport===sp?"white":"rgba(255,255,255,0.3)"),background:sport===sp?"white":"transparent",color:sport===sp?"#6366f1":"rgba(255,255,255,0.85)",fontWeight:700,fontSize:12,cursor:"pointer",textTransform:"capitalize"}}>{sp==="sup"?"SUP":sp}</button>)}
          </div>
        </div>
      </div>
      {/* Content */}
      <div style={{maxWidth:480,margin:"-24px auto 0",padding:"0 16px 40px",position:"relative",zIndex:2}}>
        {data&&!data.err&&<div style={{height:4,background:`linear-gradient(90deg,${sc.border},${sc.border}88)`,borderRadius:4,marginBottom:12}}/>}
        {/* Level */}
        <div style={{background:T.card,borderRadius:20,padding:"14px 16px",boxShadow:T.shadow,marginBottom:12}}>
          <div style={{display:"flex",background:T.bg,borderRadius:12,padding:3,gap:3}}>
            {LEVELS.map(lv=><button key={lv} onClick={()=>setLevel(lv)} style={{flex:1,padding:"8px 0",borderRadius:10,border:"none",background:level===lv?"#6366f1":"transparent",color:level===lv?"white":T.sub,fontWeight:700,fontSize:11,cursor:"pointer",textTransform:"capitalize",transition:"all .15s",boxShadow:level===lv?"0 2px 8px rgba(99,102,241,0.4)":"none"}}>{lv}</button>)}
          </div>
        </div>
        {loading&&<div style={{textAlign:"center",padding:"60px 0"}}><div style={{width:32,height:32,border:"2.5px solid "+T.border,borderTop:"2.5px solid #6366f1",borderRadius:"50%",margin:"0 auto 14px",animation:"spin 0.8s linear infinite"}}/><div style={{color:T.sub,fontSize:13}}>Loading conditions…</div></div>}
        {data?.err&&<div style={{textAlign:"center",padding:"60px 0"}}><div style={{fontSize:36,marginBottom:10}}>⚠️</div><div style={{color:"#f43f5e",fontWeight:700,fontSize:15}}>Couldn't load data</div></div>}
        {data&&!data.err&&<div className="fade-up">
          <div style={{marginBottom:12}}><Badge status={sf.status} score={sf.score} warnings={sf.warnings}/></div>
          <div style={{background:T.card,borderRadius:20,padding:"24px 20px",boxShadow:T.shadow,marginBottom:10,display:"flex",alignItems:"center",gap:20}}>
            <Compass deg={wdir} speed={wind} T={T}/>
            <div style={{flex:1,display:"flex",flexDirection:"column",gap:12}}>
              <div><div style={{fontSize:9,color:T.sub,letterSpacing:2,fontWeight:600,marginBottom:3}}>GUSTS</div><div style={{fontSize:24,fontWeight:800,fontFamily:"Syne,sans-serif",color:T.text,letterSpacing:-0.5}}>{gust}<span style={{fontSize:12,color:T.sub,fontWeight:600,marginLeft:3}}>kts</span></div></div>
              <div><div style={{fontSize:9,color:T.sub,letterSpacing:2,fontWeight:600,marginBottom:3}}>WAVE</div><div style={{fontSize:24,fontWeight:800,fontFamily:"Syne,sans-serif",color:"#6366f1",letterSpacing:-0.5}}>{wave.toFixed(1)}<span style={{fontSize:12,color:T.sub,fontWeight:600,marginLeft:3}}>m</span></div></div>
              <div><div style={{fontSize:9,color:T.sub,letterSpacing:2,fontWeight:600,marginBottom:3}}>PERIOD</div><div style={{fontSize:24,fontWeight:800,fontFamily:"Syne,sans-serif",color:T.text,letterSpacing:-0.5}}>{Math.round(period)}<span style={{fontSize:12,color:T.sub,fontWeight:600,marginLeft:3}}>s</span></div></div>
            </div>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:10}}>
            <Tile label="Swell" value={swell.toFixed(1)} unit="m" T={T}/>
            <Tile label="Air Temp" value={airT} unit="°C" sub={"Feels "+feelT+"°"} T={T}/>
            <Tile label="UV Index" value={uv.toFixed(1)} color={uv>7?"#f43f5e":uv>3?"#f59e0b":"#22c55e"} T={T}/>
            {sst!=null&&<Tile label="Water Temp" value={Math.round(sst)} unit="°C" sub={wetsuit(sst)} color={wcolor(sst)} T={T}/>}
          </div>
          {(sport==="kite"||sport==="windsurf")&&<div style={{background:"linear-gradient(135deg,#4338ca,#6366f1)",borderRadius:20,padding:"20px 22px",marginBottom:10,boxShadow:"0 8px 24px rgba(99,102,241,0.3)"}}><div style={{fontSize:9,letterSpacing:2.5,color:"rgba(255,255,255,0.65)",marginBottom:6,fontWeight:600}}>RECOMMENDED GEAR</div><div style={{fontSize:22,fontWeight:800,fontFamily:"Syne,sans-serif",color:"white",letterSpacing:-0.5}}>{sport==="kite"?kite(wind)+" kite":sail(wind)+" sail"}</div></div>}
          <div style={{background:T.card,borderRadius:20,padding:"20px",boxShadow:T.shadow}}>
            <Strip hourly={wd?.hourly} waveH={wm?.hourly?.wave_height} T={T}/>
          </div>
        </div>}
      </div>
    </div>
  );

  return (
    <div style={{fontFamily:"DM Sans,sans-serif"}}>
      {/* Home hero */}
      <div style={{position:"relative",overflow:"hidden",background:"linear-gradient(135deg,#4338ca 0%,#6366f1 45%,#818cf8 75%,#38bdf8 100%)",padding:"52px 24px 80px"}}>
        <div style={{position:"absolute",top:-60,right:-60,width:260,height:260,borderRadius:"50%",background:"rgba(255,255,255,0.07)",pointerEvents:"none"}}/>
        <div style={{position:"absolute",bottom:-80,left:-40,width:300,height:300,borderRadius:"50%",background:"rgba(255,255,255,0.05)",pointerEvents:"none"}}/>
        <div style={{position:"relative",maxWidth:480,margin:"0 auto"}}>
          <div style={{display:"inline-flex",alignItems:"center",gap:6,background:"rgba(255,255,255,0.15)",backdropFilter:"blur(8px)",borderRadius:20,padding:"5px 12px",marginBottom:18}}>
            <div style={{width:7,height:7,borderRadius:"50%",background:"#a5f3fc"}}/>
            <span style={{fontSize:11,fontWeight:600,color:"rgba(255,255,255,0.9)",letterSpacing:1}}>ON-LOCATION</span>
          </div>
          <div style={{fontSize:44,fontWeight:900,fontFamily:"Syne,sans-serif",color:"white",lineHeight:1.05,letterSpacing:-1.5,marginBottom:12}}>Know before<br/>you go.</div>
          <div style={{fontSize:15,color:"rgba(255,255,255,0.75)",marginBottom:28}}>Live wind, wave & surf conditions<br/>for 20 world-class spots.</div>
          <input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search any spot…" style={{width:"100%",padding:"15px 18px",borderRadius:16,border:"none",background:"rgba(255,255,255,0.18)",backdropFilter:"blur(12px)",color:"white",fontSize:15,boxSizing:"border-box",outline:"none"}} onFocus={e=>e.target.style.background="rgba(255,255,255,0.25)"} onBlur={e=>e.target.style.background="rgba(255,255,255,0.18)"}/>
        </div>
      </div>
      <div style={{padding:"0 16px",maxWidth:480,margin:"-28px auto 0",position:"relative",zIndex:2}}>
        {srList.length>0
          ?<><div style={{fontSize:9,color:T.sub,letterSpacing:2.5,marginBottom:12,fontWeight:600,paddingTop:8}}>RESULTS</div>{srList.map(s=><SpotCard key={s.id} s={s} onClick={()=>pick(s)} T={T}/>)}</>
          :<><div style={{fontSize:9,color:T.sub,letterSpacing:2.5,marginBottom:12,fontWeight:600,paddingTop:8}}>{geo===null?"DETECTING LOCATION…":geo==="denied"?"ALL SPOTS":"NEAREST SPOTS"}</div>{listSpots.map(s=><SpotCard key={s.id} s={s} onClick={()=>pick(s)} T={T}/>)}</>
        }
      </div>
    </div>
  );
}
