import { useState, useEffect, useCallback } from 'react';
import { S } from '../data/spots';
import { getWeather, getMarine } from '../utils/api';
import { nearest, searchSpots } from '../utils/geo';
import { safety, kite, sail, wetsuit, wcolor, WD } from '../utils/safety';
import { SPORTS, LEVELS, SC, RC } from '../shared/theme';
import Compass from '../components/Compass';
import Badge from '../components/Badge';
import HourlyChart from '../components/HourlyChart';
import WeeklyChart from '../components/WeeklyChart';
import WorldMap from '../module1/WorldMap';
import SpotMap from './SpotMap';

const dirLabel = deg => WD[Math.round(deg/22.5)%16];

function fmtTime(iso) {
  if (!iso) return "--";
  try { const d=new Date(iso); return d.getHours().toString().padStart(2,"0")+":"+d.getMinutes().toString().padStart(2,"0"); }
  catch { return "--"; }
}

function StatRow({ label, value, unit, color, T }) {
  return (
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"6px 0",borderBottom:"1px solid "+T.border}}>
      <div style={{fontSize:10,color:T.sub,fontWeight:600,letterSpacing:1}}>{label}</div>
      <div style={{fontFamily:"DM Mono,monospace",fontSize:13,fontWeight:700,color:color||T.text}}>
        {value}{unit&&<span style={{fontSize:10,color:T.sub,marginLeft:2}}>{unit}</span>}
      </div>
    </div>
  );
}

function SectionLabel({ children, T }) {
  return <div style={{fontSize:9,color:T.sub,letterSpacing:2,marginBottom:4,marginTop:12,fontWeight:600,paddingBottom:4,borderBottom:"1px solid "+T.line}}>{children}</div>;
}

export default function Dashboard({ T, dark, initialSpot, onClearInitial }) {
  const [geo,     setGeo]     = useState(null);
  const [nearby,  setNearby]  = useState([]);
  const [query,   setQuery]   = useState("");
  const [spot,    setSpot]    = useState(null);
  const [data,    setData]    = useState(null);
  const [loading, setLoading] = useState(false);
  const [sport,   setSport]   = useState("surf");
  const [level,   setLevel]   = useState("advanced");
  const [copied,  setCopied]  = useState(false);

  useEffect(() => {
    if (!navigator.geolocation) { setGeo("denied"); return; }
    navigator.geolocation.getCurrentPosition(
      p => { const {latitude:la,longitude:lo}=p.coords; setGeo({la,lo}); setNearby(nearest(la,lo)); },
      () => setGeo("denied")
    );
  }, []);

  const pick = useCallback(async s => {
    setSpot(s); setData(null); setLoading(true);
    if (onClearInitial) onClearInitial();
    try {
      const [w,m] = await Promise.all([getWeather(s.lat,s.lng), getMarine(s.lat,s.lng)]);
      setData({w,m});
    } catch { setData({err:true}); }
    setLoading(false);
  }, [onClearInitial]);

  useEffect(() => { if (initialSpot) pick(initialSpot); }, [initialSpot]);

  const wd       = data?.w, wm = data?.m;
  const wind     = Math.round(wd?.current?.wind_speed_10m      || 0);
  const gust     = Math.round(wd?.current?.wind_gusts_10m      || 0);
  const wdir     =            wd?.current?.wind_direction_10m  || 0;
  const wave     =            wm?.current?.wave_height         || 0;
  const period   =            wm?.current?.wave_period         || 0;
  const swell    =            wm?.current?.swell_wave_height   || 0;
  const waveDir  =            wm?.current?.wave_direction      || 0;
  const swellDir =            wm?.current?.swell_wave_direction|| 0;
  const swellPer =            wm?.current?.swell_wave_period   || 0;
  const sst      =            wm?.current?.sea_surface_temperature ?? null;
  const airT     = Math.round(wd?.current?.temperature_2m      || 0);
  const feelT    = Math.round(wd?.current?.apparent_temperature|| 0);
  const uv       =            wd?.current?.uv_index            || 0;
  const sunrise  =            wd?.daily?.sunrise?.[0]          || null;
  const sunset   =            wd?.daily?.sunset?.[0]           || null;
  const precip   =            wd?.daily?.precipitation_sum?.[0]?? null;

  const sf        = safety(wind, wave, sport, level);
  const windLabel = wind<8?"Light":wind<16?"Moderate":wind<25?"Fresh":wind<35?"Strong":"Gale";
  const srList    = query ? searchSpots(query) : [];
  const listSpots = geo&&geo!=="denied" ? nearby : S.slice(0,8);

  const handleShare = () => {
    if (!spot) return;
    const txt = `${spot.name} — Wind: ${wind}kts ${dirLabel(wdir)}, Waves: ${wave.toFixed(1)}m — WaveIQ`;
    navigator.clipboard?.writeText(txt).then(()=>{ setCopied(true); setTimeout(()=>setCopied(false),2000); });
  };

  // ── SPOT DETAIL VIEW ──
  if (spot) return (
    <div style={{display:"flex",height:"calc(100vh - 48px)",overflow:"hidden",fontFamily:"DM Sans,sans-serif"}}>

      {/* LEFT: conditions panel */}
      <div style={{width:280,flexShrink:0,borderRight:"1px solid "+T.border,overflowY:"auto",background:T.card}}>
        {/* Header */}
        <div style={{padding:"12px 14px",borderBottom:"1px solid "+T.border,display:"flex",alignItems:"center",gap:8}}>
          <button onClick={()=>{setSpot(null);setData(null);}} style={{background:"none",border:"1px solid "+T.border,color:T.sub,fontSize:11,cursor:"pointer",padding:"4px 9px",borderRadius:3,fontWeight:600,fontFamily:"DM Sans,sans-serif"}}>← Back</button>
          <div style={{flex:1,minWidth:0}}>
            <div style={{fontWeight:800,fontSize:14,fontFamily:"Syne,sans-serif",color:T.text,letterSpacing:-0.3,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{spot.name}</div>
            <div style={{fontSize:10,color:T.sub}}>{spot.country} · {spot.region}</div>
          </div>
          <div style={{width:8,height:8,borderRadius:"50%",background:RC[spot.region]||"#0ea5e9",flexShrink:0}}/>
        </div>

        <div style={{padding:"12px 14px"}}>
          {/* Sport selector */}
          <div style={{marginBottom:10}}>
            <div style={{fontSize:9,color:T.sub,letterSpacing:2,marginBottom:6,fontWeight:600}}>SPORT</div>
            <div style={{display:"flex",flexWrap:"wrap",gap:4}}>
              {SPORTS.map(sp=>(
                <button key={sp} onClick={()=>setSport(sp)}
                  style={{padding:"4px 10px",borderRadius:3,border:"1px solid "+(sport===sp?"#0ea5e9":T.border),background:sport===sp?"#0ea5e9":T.card,color:sport===sp?"white":T.sub,fontWeight:600,fontSize:11,cursor:"pointer",textTransform:"capitalize",transition:"all .12s"}}>
                  {sp==="sup"?"SUP":sp}
                </button>
              ))}
            </div>
          </div>

          {/* Level selector */}
          <div style={{marginBottom:10}}>
            <div style={{fontSize:9,color:T.sub,letterSpacing:2,marginBottom:6,fontWeight:600}}>SKILL LEVEL</div>
            <div style={{display:"flex",gap:4}}>
              {LEVELS.map(lv=>(
                <button key={lv} onClick={()=>setLevel(lv)}
                  style={{flex:1,padding:"5px 0",borderRadius:3,border:"1px solid "+(level===lv?"#0ea5e9":T.border),background:level===lv?"#0ea5e9":T.card,color:level===lv?"white":T.sub,fontWeight:600,fontSize:10,cursor:"pointer",textTransform:"capitalize",transition:"all .12s"}}>
                  {lv}
                </button>
              ))}
            </div>
          </div>

          {loading&&(
            <div style={{textAlign:"center",padding:"40px 0"}}>
              <div style={{width:28,height:28,border:"2px solid "+T.border,borderTop:"2px solid #0ea5e9",borderRadius:"50%",margin:"0 auto 10px",animation:"spin 0.8s linear infinite"}}/>
              <div style={{color:T.sub,fontSize:12}}>Fetching live data…</div>
            </div>
          )}

          {data?.err&&(
            <div style={{padding:"20px 0",textAlign:"center"}}>
              <div style={{color:"#f43f5e",fontWeight:700,fontSize:13}}>Failed to load</div>
              <div style={{color:T.sub,fontSize:11,marginTop:4}}>Check connection</div>
            </div>
          )}

          {data&&!data.err&&<>
            {/* Safety badge */}
            <div style={{marginBottom:10}}><Badge status={sf.status} score={sf.score} warnings={sf.warnings}/></div>

            {/* Share button */}
            <button onClick={handleShare} style={{width:"100%",padding:"7px",borderRadius:4,border:"1px solid "+(copied?"#bbf7d0":T.border),background:copied?"#f0fdf4":T.bg,color:copied?"#15803d":T.sub,fontSize:11,fontWeight:700,cursor:"pointer",letterSpacing:0.5,marginBottom:12,transition:"all .2s"}}>
              {copied?"✓ COPIED":"SHARE CONDITIONS"}
            </button>

            {/* Compass */}
            <div style={{display:"flex",justifyContent:"center",marginBottom:2}}>
              <Compass deg={wdir} speed={wind} T={T}/>
            </div>

            {/* WIND */}
            <SectionLabel T={T}>WIND</SectionLabel>
            <StatRow label="DIRECTION" value={dirLabel(wdir)} T={T}/>
            <StatRow label="GUSTS" value={gust} unit="kts" color={gust>25?"#f43f5e":gust>15?"#f59e0b":T.text} T={T}/>
            <StatRow label="CONDITIONS" value={windLabel} T={T}/>
            {(sport==="kite"||sport==="windsurf")&&(
              <StatRow label={sport==="kite"?"KITE SIZE":"SAIL SIZE"} value={sport==="kite"?kite(wind):sail(wind)} color="#0ea5e9" T={T}/>
            )}

            {/* WAVES */}
            <SectionLabel T={T}>WAVES</SectionLabel>
            <StatRow label="HEIGHT" value={wave.toFixed(1)} unit="m" color="#0ea5e9" T={T}/>
            <StatRow label="WAVE DIRECTION" value={dirLabel(waveDir)} T={T}/>
            <StatRow label="SWELL HEIGHT" value={swell.toFixed(1)} unit="m" T={T}/>
            <StatRow label="SWELL DIRECTION" value={dirLabel(swellDir)} T={T}/>
            <StatRow label="SWELL PERIOD" value={Math.round(swellPer||period)} unit="s" T={T}/>
            <StatRow label="WAVE PERIOD" value={Math.round(period)} unit="s" T={T}/>

            {/* CONDITIONS */}
            <SectionLabel T={T}>CONDITIONS</SectionLabel>
            <StatRow label="AIR TEMP" value={airT} unit="°C" T={T}/>
            <StatRow label="FEELS LIKE" value={feelT} unit="°C" T={T}/>
            <StatRow label="UV INDEX" value={uv.toFixed(1)} color={uv>7?"#f43f5e":uv>3?"#f59e0b":"#22c55e"} T={T}/>
            {precip!=null&&<StatRow label="PRECIP TODAY" value={precip.toFixed(1)} unit="mm" T={T}/>}
            {sst!=null&&<StatRow label="WATER TEMP" value={Math.round(sst)} unit="°C" color={wcolor(sst)} T={T}/>}
            {sst!=null&&<StatRow label="WETSUIT" value={wetsuit(sst)} T={T}/>}

            {/* SUN */}
            <SectionLabel T={T}>SUN</SectionLabel>
            <StatRow label="SUNRISE" value={fmtTime(sunrise)} color="#f59e0b" T={T}/>
            <StatRow label="SUNSET" value={fmtTime(sunset)} color="#f97316" T={T}/>
          </>}
        </div>
      </div>

      {/* CENTER: charts */}
      <div style={{flex:1,overflowY:"auto",background:T.bg,padding:"20px 24px"}}>
        {loading&&(
          <div style={{display:"flex",alignItems:"center",justifyContent:"center",height:"60%"}}>
            <div style={{color:T.sub,fontSize:13}}>Loading forecast data…</div>
          </div>
        )}
        {data&&!data.err&&<>
          <HourlyChart hourlyW={wd?.hourly} hourlyM={wm?.hourly} T={T}/>
          <WeeklyChart dailyW={wd?.daily} dailyM={wm?.daily} T={T}/>
        </>}
        {(!data||data.err)&&!loading&&(
          <div style={{display:"flex",alignItems:"center",justifyContent:"center",height:"60%",color:T.sub,fontSize:12}}>
            {data?.err?"Could not load forecast data.":"Select a spot to view forecasts."}
          </div>
        )}
      </div>

      {/* RIGHT: map ~30% */}
      <div style={{width:"30%",flexShrink:0,borderLeft:"1px solid "+T.border,overflow:"hidden"}}>
        <SpotMap spot={spot} windDir={data&&!data.err?wdir:null} dark={dark} onSelectNearby={pick}/>
      </div>
    </div>
  );

  // ── HOME VIEW (no spot selected) ──
  return (
    <div style={{display:"flex",height:"calc(100vh - 48px)",overflow:"hidden",fontFamily:"DM Sans,sans-serif"}}>
      {/* Left: search + spot list */}
      <div style={{width:280,flexShrink:0,borderRight:"1px solid "+T.border,overflowY:"auto",background:T.card}}>
        <div style={{padding:"14px 14px 0"}}>
          <div style={{fontSize:11,fontWeight:800,letterSpacing:2,color:T.text,marginBottom:12,paddingBottom:10,borderBottom:"1px solid "+T.border}}>CONDITIONS</div>
          <input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search spots…"
            style={{width:"100%",padding:"8px 10px",borderRadius:4,border:"1px solid "+T.border,background:T.bg,color:T.text,fontSize:13,boxSizing:"border-box",fontFamily:"DM Sans,sans-serif",marginBottom:14}}/>
          <div style={{fontSize:9,color:T.sub,letterSpacing:2,marginBottom:8,fontWeight:600}}>
            {query?"RESULTS":geo===null?"DETECTING LOCATION…":geo==="denied"?"ALL SPOTS":"NEAREST SPOTS"}
          </div>
          {(query?srList:listSpots).map(s=>{
            const rc=RC[s.region]||"#6366f1";
            return (
              <div key={s.id} onClick={()=>pick(s)}
                style={{display:"flex",alignItems:"center",gap:8,padding:"8px 8px",borderRadius:4,marginBottom:2,cursor:"pointer",transition:"background .1s"}}
                onMouseEnter={e=>e.currentTarget.style.background=T.hi}
                onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
                <div style={{width:6,height:6,borderRadius:"50%",background:rc,flexShrink:0}}/>
                <div style={{flex:1,minWidth:0}}>
                  <div style={{fontWeight:600,fontSize:13,color:T.text,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{s.name}</div>
                  <div style={{fontSize:10,color:T.sub}}>{s.country}{s.d?` · ${Math.round(s.d)} km`:""}</div>
                </div>
                <div style={{color:T.sub,fontSize:12}}>›</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Right: world map */}
      <div style={{flex:1,overflow:"hidden"}}>
        <WorldMap spots={S} sport="surf" month={new Date().getMonth()} selectedId={null} onSelect={pick} dark={dark}/>
      </div>
    </div>
  );
}
