import React, { useState, useEffect, useCallback, useRef } from 'react';
import { S } from '../data/spots';
import { getWeather, getMarine } from '../utils/api';
import { nearest, searchSpots } from '../utils/geo';
import { safety, kite, sail, wetsuit, wcolor, WD, visibility } from '../utils/safety';
import { SPORTS, LEVELS, SC, RC } from '../shared/theme';
import Compass from '../components/Compass';
import Badge from '../components/Badge';
import HourlyChart from '../components/HourlyChart';
import WeeklyChart from '../components/WeeklyChart';
import TideChart from '../components/TideChart';
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

function degToCompass(d) { const dirs=["N","NE","E","SE","S","SW","W","NW"]; return dirs[Math.round(d/45)%8]; }
function windColor(v) { return v>25?"#ef4444":v>15?"#f59e0b":"#22c55e"; }
function statusDot(st) { return st==="GO"?"#22c55e":st==="CAUTION"?"#f59e0b":"#ef4444"; }

function getDaylightSections(sunriseISO, sunsetISO) {
  const sr = new Date(sunriseISO);
  const ss = new Date(sunsetISO);
  const daylight = (ss - sr) / 3600000;
  const edgeDur = daylight < 8 ? Math.max(0.75, daylight * 0.15) : 2;
  const midStart = sr.getTime() + edgeDur * 3600000;
  const midEnd = ss.getTime() - edgeDur * 3600000;
  const midMid = (midStart + midEnd) / 2;
  if (daylight < 6) {
    return [
      { id:"dawn", label:"Dawn", start:sr, end:new Date(midStart) },
      { id:"midday", label:"Midday", start:new Date(midStart), end:new Date(midEnd) },
      { id:"dusk", label:"Dusk", start:new Date(midEnd), end:ss },
    ];
  }
  return [
    { id:"dawn", label:"Dawn", start:sr, end:new Date(midStart) },
    { id:"morning", label:"Morning", start:new Date(midStart), end:new Date(midMid) },
    { id:"afternoon", label:"Afternoon", start:new Date(midMid), end:new Date(midEnd) },
    { id:"dusk", label:"Dusk", start:new Date(midEnd), end:ss },
  ];
}

const SECTION_ICONS = {
  dawn: <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><line x1="2" y1="17" x2="22" y2="17" stroke="#f97316" strokeWidth="1.5" strokeLinecap="round"/><path d="M 6 17 A 6 6 0 0 1 18 17" fill="#fb923c" opacity="0.9"/><line x1="12" y1="9" x2="12" y2="6" stroke="#f97316" strokeWidth="1.5" strokeLinecap="round"/><line x1="16.2" y1="11" x2="18.4" y2="8.8" stroke="#f97316" strokeWidth="1.5" strokeLinecap="round"/><line x1="7.8" y1="11" x2="5.6" y2="8.8" stroke="#f97316" strokeWidth="1.5" strokeLinecap="round"/></svg>,
  morning: <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="10" r="4" fill="#f59e0b"/><line x1="12" y1="4" x2="12" y2="2.5" stroke="#f59e0b" strokeWidth="1.5" strokeLinecap="round"/><line x1="17.2" y1="5.8" x2="18.4" y2="4.6" stroke="#f59e0b" strokeWidth="1.5" strokeLinecap="round"/><line x1="6.8" y1="5.8" x2="5.6" y2="4.6" stroke="#f59e0b" strokeWidth="1.5" strokeLinecap="round"/><line x1="19" y1="10" x2="20.5" y2="10" stroke="#f59e0b" strokeWidth="1.5" strokeLinecap="round"/><line x1="5" y1="10" x2="3.5" y2="10" stroke="#f59e0b" strokeWidth="1.5" strokeLinecap="round"/><line x1="2" y1="19" x2="22" y2="19" stroke="#94a3b8" strokeWidth="1" strokeLinecap="round" opacity="0.3"/></svg>,
  afternoon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="8" r="4.5" fill="#eab308"/><line x1="12" y1="1.5" x2="12" y2="3" stroke="#eab308" strokeWidth="1.5" strokeLinecap="round"/><line x1="17.5" y1="3.5" x2="16.5" y2="4.5" stroke="#eab308" strokeWidth="1.5" strokeLinecap="round"/><line x1="6.5" y1="3.5" x2="7.5" y2="4.5" stroke="#eab308" strokeWidth="1.5" strokeLinecap="round"/><line x1="20" y1="8" x2="21.5" y2="8" stroke="#eab308" strokeWidth="1.5" strokeLinecap="round"/><line x1="4" y1="8" x2="2.5" y2="8" stroke="#eab308" strokeWidth="1.5" strokeLinecap="round"/><line x1="17.5" y1="12.5" x2="16.5" y2="11.5" stroke="#eab308" strokeWidth="1.5" strokeLinecap="round"/><line x1="6.5" y1="12.5" x2="7.5" y2="11.5" stroke="#eab308" strokeWidth="1.5" strokeLinecap="round"/><line x1="2" y1="19" x2="22" y2="19" stroke="#94a3b8" strokeWidth="1" strokeLinecap="round" opacity="0.3"/></svg>,
  dusk: <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><line x1="2" y1="17" x2="22" y2="17" stroke="#ea580c" strokeWidth="1.5" strokeLinecap="round"/><path d="M 6 17 A 6 6 0 0 1 18 17" fill="#f97316" opacity="0.8"/><line x1="12" y1="9" x2="12" y2="6" stroke="#ea580c" strokeWidth="1.5" strokeLinecap="round"/><line x1="16.2" y1="11" x2="18.4" y2="8.8" stroke="#ea580c" strokeWidth="1.5" strokeLinecap="round"/><line x1="7.8" y1="11" x2="5.6" y2="8.8" stroke="#ea580c" strokeWidth="1.5" strokeLinecap="round"/></svg>,
  midday: <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="8" r="4.5" fill="#eab308"/><line x1="12" y1="1.5" x2="12" y2="3" stroke="#eab308" strokeWidth="1.5" strokeLinecap="round"/><line x1="17.5" y1="3.5" x2="16.5" y2="4.5" stroke="#eab308" strokeWidth="1.5" strokeLinecap="round"/><line x1="6.5" y1="3.5" x2="7.5" y2="4.5" stroke="#eab308" strokeWidth="1.5" strokeLinecap="round"/><line x1="20" y1="8" x2="21.5" y2="8" stroke="#eab308" strokeWidth="1.5" strokeLinecap="round"/><line x1="4" y1="8" x2="2.5" y2="8" stroke="#eab308" strokeWidth="1.5" strokeLinecap="round"/><line x1="17.5" y1="12.5" x2="16.5" y2="11.5" stroke="#eab308" strokeWidth="1.5" strokeLinecap="round"/><line x1="6.5" y1="12.5" x2="7.5" y2="11.5" stroke="#eab308" strokeWidth="1.5" strokeLinecap="round"/><line x1="2" y1="19" x2="22" y2="19" stroke="#94a3b8" strokeWidth="1" strokeLinecap="round" opacity="0.3"/></svg>,
};

const SECTION_STYLES = {
  dawn:      { background:"rgba(251,146,60,0.08)", borderLeft:"3px solid #f97316", color:"#f97316" },
  morning:   { background:"rgba(245,158,11,0.08)", borderLeft:"3px solid #f59e0b", color:"#f59e0b" },
  afternoon: { background:"rgba(234,179,8,0.10)",  borderLeft:"3px solid #eab308", color:"#eab308" },
  dusk:      { background:"rgba(234,88,12,0.08)",  borderLeft:"3px solid #ea580c", color:"#ea580c" },
  midday:    { background:"rgba(234,179,8,0.10)",  borderLeft:"3px solid #eab308", color:"#eab308" },
};

function fmtHM(d) { return d.getHours().toString().padStart(2,"0")+":"+d.getMinutes().toString().padStart(2,"0"); }

function NightRow({ expanded, onToggle, sunriseISO, label }) {
  return (
    <div onClick={onToggle} style={{display:"flex",alignItems:"center",gap:8,padding:"8px 12px",background:"#0f172a",color:"#64748b",fontSize:11,cursor:"pointer",borderBottom:"1px solid #1e293b"}}>
      <svg width="14" height="14" viewBox="0 0 24 24"><path d="M21 12.79A9 9 0 1 1 11.21 3a7 7 0 0 0 9.79 9.79z" fill="#64748b"/></svg>
      <span style={{fontFamily:"DM Mono,monospace"}}>NIGHT</span>
      <span style={{marginLeft:"auto",color:"#0ea5e9"}}>{expanded?"▼":"▶"} {label} {sunriseISO ? fmtHM(new Date(sunriseISO)) : ""}</span>
    </div>
  );
}

function HourlyTable({ wd, wm, sport, level, T }) {
  const [nightExp, setNightExp] = useState({ pre:false, post:false });
  if (!wd?.hourly?.time) return null;
  const sunriseISO = wd.daily?.sunrise?.[0], sunsetISO = wd.daily?.sunset?.[0];
  if (!sunriseISO || !sunsetISO) return null;

  const sr = new Date(sunriseISO), ss = new Date(sunsetISO);
  const sections = getDaylightSections(sunriseISO, sunsetISO);

  const hTimes = wd.hourly.time;
  const hWind = wd.hourly.wind_speed_10m || [];
  const hGust = wd.hourly.wind_gusts_10m || [];
  const hDir = wd.hourly.wind_direction_10m || [];
  const mTimes = wm?.hourly?.time || [];
  const mWave = wm?.hourly?.wave_height || [];
  const mPer = wm?.hourly?.wave_period || [];

  function buildRows(startT, endT, isNight) {
    const rows = [];
    for (let i = 0; i < hTimes.length; i++) {
      const t = new Date(hTimes[i]);
      if (t < startT || t >= endT) continue;
      const mi = mTimes.indexOf(hTimes[i]);
      const wv = mi >= 0 ? (mWave[mi] || 0) : 0;
      const per = mi >= 0 ? (mPer[mi] || 0) : 0;
      const w = Math.round(hWind[i] || 0);
      const g = Math.round(hGust[i] || 0);
      const dir = hDir[i] || 0;
      const sf = safety(w, wv, sport, level, isNight);
      rows.push({ time:t.getHours().toString().padStart(2,"0")+":00", w, g, dir, wv, per:Math.round(per), status:sf.status });
    }
    return rows;
  }

  // Night rows: pre-sunrise (midnight to sunrise) and post-sunset (sunset to midnight)
  const dayStart = new Date(sr); dayStart.setHours(0,0,0,0);
  const dayEnd = new Date(ss); dayEnd.setHours(23,59,59,999);
  const preNightRows = buildRows(dayStart, sr, true);
  const postNightRows = buildRows(ss, dayEnd, true);

  const thStyle = {fontSize:9,color:T.sub,fontWeight:600,letterSpacing:1,padding:"4px 6px",textAlign:"left",borderBottom:"2px solid "+T.border};
  const tdStyle = (i, isNight) => ({fontSize:11,fontFamily:"DM Mono,monospace",padding:"4px 6px",borderBottom:"1px solid "+(isNight?"#1e293b":"#e2e8f0"),height:28,background:isNight?"#0f172a":i%2===0?"#f8fafc":"white",color:isNight?"#475569":undefined});

  const renderRows = (rows, isNight) => rows.map((r,i) => (
    <tr key={r.time+"-"+(isNight?"n":"d")}>
      <td style={{...tdStyle(i,isNight),fontWeight:600,color:isNight?"#475569":T.text}}>{r.time}</td>
      <td style={{...tdStyle(i,isNight),color:isNight?"#475569":windColor(r.w),fontWeight:700}}>{r.w}<span style={{fontSize:9,color:isNight?"#334155":T.sub}}> kts</span></td>
      <td style={{...tdStyle(i,isNight),color:isNight?"#475569":T.sub}}>{degToCompass(r.dir)}</td>
      <td style={{...tdStyle(i,isNight),color:isNight?"#475569":windColor(r.g),fontWeight:700}}>{r.g}<span style={{fontSize:9,color:isNight?"#334155":T.sub}}> kts</span></td>
      <td style={tdStyle(i,isNight)}>{r.wv.toFixed(1)}<span style={{fontSize:9,color:isNight?"#334155":T.sub}}> m</span></td>
      <td style={tdStyle(i,isNight)}>{r.per}<span style={{fontSize:9,color:isNight?"#334155":T.sub}}> s</span></td>
      <td style={tdStyle(i,isNight)}><span style={{display:"inline-block",width:8,height:8,borderRadius:"50%",background:isNight?"#ef4444":statusDot(r.status)}}></span></td>
    </tr>
  ));

  return (
    <div style={{marginTop:20}}>
      <div style={{fontSize:9,color:T.sub,letterSpacing:2,marginBottom:8,fontWeight:600}}>HOURLY FORECAST</div>
      <table style={{width:"100%",borderCollapse:"collapse",fontSize:11}}>
        <thead>
          <tr>
            <th style={thStyle}>Time</th><th style={thStyle}>Wind</th><th style={thStyle}>Dir</th><th style={thStyle}>Gusts</th><th style={thStyle}>Waves</th><th style={thStyle}>Period</th><th style={thStyle}>Status</th>
          </tr>
        </thead>
        <tbody>
          {/* Pre-sunrise night */}
          {preNightRows.length > 0 && (
            <>
              <tr><td colSpan={7} style={{padding:0}}>
                <NightRow expanded={nightExp.pre} onToggle={()=>setNightExp(p=>({...p,pre:!p.pre}))} sunriseISO={sunriseISO} label="Next sunrise"/>
              </td></tr>
              {nightExp.pre && renderRows(preNightRows, true)}
            </>
          )}

          {/* Daylight sections */}
          {sections.map(sec => {
            const sRows = buildRows(sec.start, sec.end, false);
            if (!sRows.length) return null;
            const st = SECTION_STYLES[sec.id];
            return (
              <React.Fragment key={sec.id}>
                <tr><td colSpan={7} style={{padding:0}}>
                  <div style={{display:"flex",alignItems:"center",gap:8,padding:"6px 12px",fontSize:12,fontWeight:700,color:st.color,background:st.background,borderLeft:st.borderLeft}}>
                    {SECTION_ICONS[sec.id]}
                    <span>{sec.label}</span>
                    <span style={{marginLeft:"auto",fontSize:10,fontFamily:"DM Mono,monospace",color:"#94a3b8"}}>{fmtHM(sec.start)} – {fmtHM(sec.end)}</span>
                  </div>
                </td></tr>
                {renderRows(sRows, false)}
              </React.Fragment>
            );
          })}

          {/* Post-sunset night */}
          {postNightRows.length > 0 && (
            <>
              <tr><td colSpan={7} style={{padding:0}}>
                <NightRow expanded={nightExp.post} onToggle={()=>setNightExp(p=>({...p,post:!p.post}))} sunriseISO={sunriseISO} label="Next sunrise"/>
              </td></tr>
              {nightExp.post && renderRows(postNightRows, true)}
            </>
          )}
        </tbody>
      </table>
    </div>
  );
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
  const [lastUpd, setLastUpd] = useState(null);
  const spotRef = useRef(null);

  useEffect(() => {
    if (!navigator.geolocation) { setGeo("denied"); return; }
    navigator.geolocation.getCurrentPosition(
      p => { const {latitude:la,longitude:lo}=p.coords; setGeo({la,lo}); setNearby(nearest(la,lo)); },
      () => setGeo("denied")
    );
  }, []);

  const pick = useCallback(async s => {
    setSpot(s); spotRef.current = s; setData(null); setLoading(true);
    if (onClearInitial) onClearInitial();
    try {
      const [w,m] = await Promise.all([getWeather(s.lat,s.lng), getMarine(s.lat,s.lng)]);
      setData({w,m}); setLastUpd(new Date());
    } catch { setData({err:true}); }
    setLoading(false);
  }, [onClearInitial]);

  useEffect(() => { if (initialSpot) pick(initialSpot); }, [initialSpot]);

  // Auto-refresh every 10 minutes
  useEffect(() => {
    const iv = setInterval(() => {
      const s = spotRef.current;
      if (s) {
        Promise.all([getWeather(s.lat,s.lng), getMarine(s.lat,s.lng)])
          .then(([w,m]) => { setData({w,m}); setLastUpd(new Date()); })
          .catch(() => {});
      }
    }, 600000);
    return () => clearInterval(iv);
  }, []);

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

  const vis       = visibility(wave, period);
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
        {lastUpd&&<div style={{padding:"2px 14px 4px",fontSize:9,color:T.sub,fontFamily:"DM Mono,monospace",borderBottom:"1px solid "+T.border}}>Updated {fmtTime(lastUpd.toISOString())}</div>}

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
            <StatRow label="VISIBILITY" value={vis.label} color={vis.color} T={T}/>

            {/* Tide Chart */}
            <TideChart lat={spot.lat} lng={spot.lng} T={T}/>

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
          <HourlyTable wd={wd} wm={wm} sport={sport} level={level} T={T}/>
        </>}
        {(!data||data.err)&&!loading&&(
          <div style={{display:"flex",alignItems:"center",justifyContent:"center",height:"60%",color:T.sub,fontSize:12}}>
            {data?.err?"Could not load forecast data.":"Select a spot to view forecasts."}
          </div>
        )}
      </div>

      {/* RIGHT: map ~30% */}
      <div style={{width:"30%",flexShrink:0,borderLeft:"1px solid "+T.border,overflow:"hidden"}}>
        <SpotMap spot={spot} windDir={data&&!data.err?wdir:null} swellDir={data&&!data.err?swellDir:null} dark={dark} onSelectNearby={pick}/>
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
