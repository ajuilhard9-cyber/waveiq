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

function SwellArrow({ dir, period, T }) {
  const cardinals = ["N","NNE","NE","ENE","E","ESE","SE","SSE","S","SSW","SW","WSW","W","WNW","NW","NNW"];
  const cardinal = cardinals[Math.round(dir / 22.5) % 16];
  return (
    <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:4,padding:"8px 0"}}>
      <svg width="60" height="60" viewBox="-30 -30 60 60">
        <circle cx="0" cy="0" r="28" fill="none" stroke={T.border} strokeWidth="1"/>
        {["N","E","S","W"].map((d,i) => (
          <text key={d} x={[0,22,-22,0][i]} y={[-19,5,26,5][i]}
            textAnchor="middle" style={{fontSize:7,fill:T.sub,fontFamily:"DM Mono,monospace",fontWeight:600}}>
            {d}
          </text>
        ))}
        <g transform={`rotate(${dir})`}>
          <line x1="0" y1="-20" x2="0" y2="8" stroke="#6366f1" strokeWidth="2.5" strokeLinecap="round"/>
          <polygon points="0,-24 -4,-16 4,-16" fill="#6366f1"/>
          <circle cx="0" cy="0" r="3" fill="#6366f1"/>
        </g>
      </svg>
      <div style={{fontFamily:"DM Mono,monospace",fontSize:12,fontWeight:700,color:"#6366f1"}}>{Math.round(dir)}° {cardinal}</div>
      {period > 0 && <div style={{fontSize:9,color:T.sub,fontWeight:600}}>PERIOD {Math.round(period)}s</div>}
    </div>
  );
}

export default function Dashboard({ T, dark, isMobile, initialSpot, onClearInitial }) {
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
  const [imperial, setImperial] = useState(false);
  const [forecastTab, setForecastTab] = useState("today");
  const [gearOpen, setGearOpen] = useState(false);
  const [favs, setFavs] = useState(() => {
    try { return JSON.parse(localStorage.getItem("waveiq_favs") || "[]"); }
    catch { return []; }
  });
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

  useEffect(() => {
    localStorage.setItem("waveiq_favs", JSON.stringify(favs));
  }, [favs]);

  const toggleFav = id => setFavs(f => f.includes(id) ? f.filter(x => x !== id) : [...f, id]);

  const toF = c => Math.round(c * 9/5 + 32);
  const toFt = m => (m * 3.281).toFixed(1);
  const toMph = k => Math.round(k * 1.151);

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

  const dWind  = imperial ? toMph(wind)  : wind;
  const dGust  = imperial ? toMph(gust)  : gust;
  const dWave  = imperial ? toFt(wave)   : wave.toFixed(1);
  const dSwell = imperial ? toFt(swell)  : swell.toFixed(1);
  const dAirT  = imperial ? toF(airT)    : airT;
  const dFeelT = imperial ? toF(feelT)   : feelT;
  const dSst   = sst != null ? (imperial ? toF(Math.round(sst)) : Math.round(sst)) : null;
  const wUnit  = imperial ? "mph" : "kts";
  const hUnit  = imperial ? "ft"  : "m";
  const tUnit  = imperial ? "°F"  : "°C";

  const vis       = visibility(wave, period);
  const sf        = safety(wind, wave, sport, level);
  const windLabel = dWind<(imperial?9:8)?"Light":dWind<(imperial?18:16)?"Moderate":dWind<(imperial?29:25)?"Fresh":dWind<(imperial?40:35)?"Strong":"Gale";
  const srList    = query ? searchSpots(query) : [];
  const listSpots = geo&&geo!=="denied" ? nearby : S.slice(0,8);

  const handleShare = () => {
    if (!spot) return;
    const txt = `${spot.name} — Wind: ${wind}kts ${dirLabel(wdir)}, Waves: ${wave.toFixed(1)}m — WaveIQ`;
    navigator.clipboard?.writeText(txt).then(()=>{ setCopied(true); setTimeout(()=>setCopied(false),2000); });
  };

  // ── SPOT DETAIL VIEW ──
  if (spot) return (
    <div style={{display:"flex",flexDirection:isMobile?"column":"row",height:"calc(100vh - 48px)",overflow:isMobile?"auto":"hidden",fontFamily:"DM Sans,sans-serif"}}>

      {/* LEFT: conditions panel */}
      <div style={{width:isMobile?"100%":280,flexShrink:0,borderRight:isMobile?"none":"1px solid "+T.border,borderBottom:isMobile?"1px solid "+T.border:"none",overflowY:isMobile?"visible":"auto",background:T.card}}>
        {/* Header */}
        <div style={{padding:"12px 14px",borderBottom:"1px solid "+T.border,display:"flex",alignItems:"center",gap:8}}>
          <button onClick={()=>{setSpot(null);setData(null);}} style={{background:"none",border:"1px solid "+T.border,color:T.sub,fontSize:11,cursor:"pointer",padding:"4px 9px",borderRadius:3,fontWeight:600,fontFamily:"DM Sans,sans-serif"}}>← Back</button>
          <button onClick={() => toggleFav(spot.id)}
            style={{background:"none",border:"1px solid "+T.border,color:favs.includes(spot.id)?"#f59e0b":"#94a3b8",fontSize:16,cursor:"pointer",padding:"4px 7px",borderRadius:3,lineHeight:1}}>
            ★
          </button>
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
            <button onClick={handleShare} style={{width:"100%",padding:"7px",borderRadius:4,border:"1px solid "+(copied?"#bbf7d0":T.border),background:copied?"#f0fdf4":T.bg,color:copied?"#15803d":T.sub,fontSize:11,fontWeight:700,cursor:"pointer",letterSpacing:0.5,marginBottom:8,transition:"all .2s"}}>
              {copied?"✓ COPIED":"SHARE CONDITIONS"}
            </button>
            <button onClick={() => setImperial(i => !i)}
              style={{width:"100%",padding:"7px",borderRadius:4,border:"1px solid "+T.border,background:T.bg,color:T.sub,fontSize:11,fontWeight:700,cursor:"pointer",letterSpacing:0.5,marginBottom:12,transition:"all .2s"}}>
              {imperial ? "SWITCH TO METRIC" : "SWITCH TO IMPERIAL"}
            </button>

            {/* Compass */}
            <div style={{display:"flex",justifyContent:"center",marginBottom:2}}>
              <Compass deg={wdir} speed={dWind} unit={wUnit} T={T}/>
            </div>

            {/* WIND */}
            <SectionLabel T={T}>WIND</SectionLabel>
            <StatRow label="DIRECTION" value={dirLabel(wdir)} T={T}/>
            <StatRow label="GUSTS" value={dGust} unit={wUnit} color={gust>25?"#f43f5e":gust>15?"#f59e0b":T.text} T={T}/>
            <StatRow label="CONDITIONS" value={windLabel} T={T}/>
            {(sport==="kite"||sport==="windsurf")&&(
              <StatRow label={sport==="kite"?"KITE SIZE":"SAIL SIZE"} value={sport==="kite"?kite(wind):sail(wind)} color="#0ea5e9" T={T}/>
            )}

            {/* GEAR CALCULATOR */}
            <div style={{background:T.hi,border:"1px solid "+T.border,borderRadius:6,padding:"10px 12px",marginBottom:10,marginTop:12}}>
              <button onClick={()=>setGearOpen(o=>!o)} style={{background:"none",border:"none",cursor:"pointer",padding:0,width:"100%",textAlign:"left",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                <span style={{fontSize:9,color:T.sub,fontWeight:600,letterSpacing:2}}>GEAR CALCULATOR</span>
                <span style={{fontSize:10,color:"#0ea5e9",fontWeight:700}}>{gearOpen?"▼":"▶"}</span>
              </button>
              {gearOpen&&(
                <div style={{marginTop:10,display:"flex",flexDirection:"column",gap:8}}>
                  {/* Wetsuit — always shown */}
                  {sst!=null&&(
                    <div>
                      <div style={{fontSize:9,color:T.sub,fontWeight:600,letterSpacing:1,marginBottom:4}}>WETSUIT</div>
                      <span style={{background:"#f0f9ff",border:"1px solid #bae6fd",color:"#0369a1",borderRadius:20,padding:"3px 10px",fontSize:11,fontWeight:700,fontFamily:"DM Mono,monospace",display:"inline-block"}}>{wetsuit(sst)}</span>
                    </div>
                  )}
                  {/* Kite */}
                  {sport==="kite"&&(
                    <div>
                      <div style={{fontSize:9,color:T.sub,fontWeight:600,letterSpacing:1,marginBottom:4}}>KITE</div>
                      {wind<8
                        ?<span style={{background:"#fff7ed",border:"1px solid #fed7aa",color:"#9a3412",borderRadius:20,padding:"3px 10px",fontSize:11,fontWeight:700,fontFamily:"DM Mono,monospace",display:"inline-block"}}>Wind too light for kite</span>
                        :wind>35
                        ?<span style={{background:"#fef2f2",border:"1px solid #fecaca",color:"#991b1b",borderRadius:20,padding:"3px 10px",fontSize:11,fontWeight:700,fontFamily:"DM Mono,monospace",display:"inline-block"}}>Wind too strong for kite</span>
                        :<span style={{background:"#f0f9ff",border:"1px solid #bae6fd",color:"#0369a1",borderRadius:20,padding:"3px 10px",fontSize:11,fontWeight:700,fontFamily:"DM Mono,monospace",display:"inline-block"}}>{kite(wind)}</span>
                      }
                    </div>
                  )}
                  {/* Windsurf */}
                  {sport==="windsurf"&&(
                    <>
                      <div>
                        <div style={{fontSize:9,color:T.sub,fontWeight:600,letterSpacing:1,marginBottom:4}}>SAIL</div>
                        <span style={{background:"#f0f9ff",border:"1px solid #bae6fd",color:"#0369a1",borderRadius:20,padding:"3px 10px",fontSize:11,fontWeight:700,fontFamily:"DM Mono,monospace",display:"inline-block"}}>{sail(wind)}</span>
                      </div>
                      <div>
                        <div style={{fontSize:9,color:T.sub,fontWeight:600,letterSpacing:1,marginBottom:4}}>BOARD</div>
                        <span style={{background:"#f0f9ff",border:"1px solid #bae6fd",color:"#0369a1",borderRadius:20,padding:"3px 10px",fontSize:11,fontWeight:700,fontFamily:"DM Mono,monospace",display:"inline-block"}}>{wind<12?"Longboard / Freeride":wind<=20?"Freeride / Wave":"Wave / Slalom"}</span>
                      </div>
                    </>
                  )}
                  {/* Surf */}
                  {sport==="surf"&&(
                    <div>
                      <div style={{fontSize:9,color:T.sub,fontWeight:600,letterSpacing:1,marginBottom:4}}>BOARD</div>
                      <span style={{background:"#f0f9ff",border:"1px solid #bae6fd",color:"#0369a1",borderRadius:20,padding:"3px 10px",fontSize:11,fontWeight:700,fontFamily:"DM Mono,monospace",display:"inline-block"}}>{wave<0.5?"Flat — no surf":wave<1.0?"Longboard (9ft+)":wave<1.5?"Mid-length (7–8ft)":wave<2.5?"Shortboard (6–7ft)":"Gun / Big Wave (7ft+)"}</span>
                    </div>
                  )}
                  {/* SUP / Foil */}
                  {(sport==="sup"||sport==="foil")&&(
                    <div>
                      <div style={{fontSize:9,color:T.sub,fontWeight:600,letterSpacing:1,marginBottom:4}}>BOARD</div>
                      <span style={{background:"#f0f9ff",border:"1px solid #bae6fd",color:"#0369a1",borderRadius:20,padding:"3px 10px",fontSize:11,fontWeight:700,fontFamily:"DM Mono,monospace",display:"inline-block"}}>{wave<0.3?"Flat water / Touring SUP":wave<0.8?"All-around SUP":"Wave SUP / Foil"}</span>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* WAVES */}
            <SectionLabel T={T}>WAVES</SectionLabel>
            <StatRow label="HEIGHT" value={dWave} unit={hUnit} color="#0ea5e9" T={T}/>
            <StatRow label="WAVE DIRECTION" value={dirLabel(waveDir)} T={T}/>
            <StatRow label="SWELL HEIGHT" value={dSwell} unit={hUnit} T={T}/>
            <div style={{paddingBottom:8,borderBottom:"1px solid "+T.border}}>
              <div style={{fontSize:9,color:T.sub,fontWeight:600,letterSpacing:1,marginBottom:4}}>SWELL DIRECTION</div>
              <SwellArrow dir={swellDir} period={swellPer||period} T={T}/>
            </div>
            <StatRow label="SWELL PERIOD" value={Math.round(swellPer||period)} unit="s" T={T}/>
            <StatRow label="WAVE PERIOD" value={Math.round(period)} unit="s" T={T}/>
            <StatRow label="VISIBILITY" value={vis.label} color={vis.color} T={T}/>

            {/* Tide Chart */}
            <TideChart lat={spot.lat} lng={spot.lng} T={T}/>

            {/* CONDITIONS */}
            <SectionLabel T={T}>CONDITIONS</SectionLabel>
            <StatRow label="AIR TEMP" value={dAirT} unit={tUnit} T={T}/>
            <StatRow label="FEELS LIKE" value={dFeelT} unit={tUnit} T={T}/>
            <StatRow label="UV INDEX" value={uv.toFixed(1)} color={uv>7?"#f43f5e":uv>3?"#f59e0b":"#22c55e"} T={T}/>
            {precip!=null&&<StatRow label="PRECIP TODAY" value={precip.toFixed(1)} unit="mm" T={T}/>}
            {sst!=null&&<StatRow label="WATER TEMP" value={dSst} unit={tUnit} color={wcolor(sst)} T={T}/>}
            {sst!=null&&<StatRow label="WETSUIT" value={wetsuit(sst)} T={T}/>}

            {/* SUN */}
            <SectionLabel T={T}>SUN</SectionLabel>
            <StatRow label="SUNRISE" value={fmtTime(sunrise)} color="#f59e0b" T={T}/>
            <StatRow label="SUNSET" value={fmtTime(sunset)} color="#f97316" T={T}/>
          </>}
        </div>
      </div>

      {/* CENTER: charts */}
      <div style={{flex:1,overflowY:"auto",background:T.bg,padding:isMobile?"16px 12px":"20px 24px"}}>
        {loading&&(
          <div style={{display:"flex",alignItems:"center",justifyContent:"center",height:"60%"}}>
            <div style={{color:T.sub,fontSize:13}}>Loading forecast data…</div>
          </div>
        )}
        {data&&!data.err&&<>
          <div style={{display:"flex",gap:0,marginBottom:20,borderBottom:"1px solid "+T.border}}>
            {[["today","TODAY"],["week","7 DAYS"]].map(([tab,label]) => (
              <button key={tab} onClick={() => setForecastTab(tab)}
                style={{padding:"8px 20px",border:"none",borderBottom:"2px solid "+(forecastTab===tab?"#0ea5e9":"transparent"),
                  background:"none",color:forecastTab===tab?"#0ea5e9":T.sub,fontWeight:700,fontSize:11,cursor:"pointer",
                  fontFamily:"DM Sans,sans-serif",letterSpacing:1,transition:"all .15s"}}>
                {label}
              </button>
            ))}
          </div>
          {forecastTab === "today" && <>
            <HourlyChart hourlyW={wd?.hourly} hourlyM={wm?.hourly} T={T}/>
            <WeeklyChart dailyW={wd?.daily} dailyM={wm?.daily} T={T}/>
            <HourlyTable wd={wd} wm={wm} sport={sport} level={level} T={T}/>
          </>}
          {forecastTab === "week" && wd?.daily?.time && (
            <div>
              <div style={{fontSize:9,color:T.sub,letterSpacing:2,marginBottom:12,fontWeight:600}}>7-DAY FORECAST</div>
              <div style={{display:"flex",flexDirection:"column",gap:8}}>
                {wd.daily.time.slice(0,7).map((dateStr, i) => {
                  const date = new Date(dateStr);
                  const dayName = date.toLocaleDateString("en-US",{weekday:"short"}).toUpperCase();
                  const isToday = i === 0;
                  const wMax  = Math.round(wd.daily.wind_speed_10m_max?.[i]    || 0);
                  const gMax  = Math.round(wd.daily.wind_gusts_10m_max?.[i]    || 0);
                  const wDir  = wd.daily.wind_direction_10m_dominant?.[i]       || 0;
                  const tMax  = Math.round(wd.daily.temperature_2m_max?.[i]    || 0);
                  const tMin  = Math.round(wd.daily.temperature_2m_min?.[i]    || 0);
                  const rain  = wd.daily.precipitation_sum?.[i]                 || 0;
                  const wvMax = wm?.daily?.wave_height_max?.[i]                 || 0;
                  const swMax = wm?.daily?.swell_wave_height_max?.[i]           || 0;
                  const dirLabels = ["N","NNE","NE","ENE","E","ESE","SE","SSE","S","SSW","SW","WSW","W","WNW","NW","NNW"];
                  const wDirLabel = dirLabels[Math.round(wDir/22.5)%16];
                  const sf = safety(wMax, wvMax, sport, level);
                  const dispWMax = imperial ? toMph(wMax) : wMax;
                  const dispWvMax = imperial ? toFt(wvMax) : wvMax.toFixed(1);
                  const dispSwMax = imperial ? toFt(swMax) : swMax.toFixed(1);
                  const dispTMax = imperial ? toF(tMax) : tMax;
                  const dispTMin = imperial ? toF(tMin) : tMin;
                  return (
                    <div key={dateStr} style={{display:"flex",alignItems:"center",gap:8,padding:"10px 12px",borderRadius:6,
                      background:isToday?"#f0f9ff":T.bg,border:"1px solid "+(isToday?"#bae6fd":T.border)}}>
                      <div style={{width:36,textAlign:"center",flexShrink:0}}>
                        <div style={{fontSize:10,fontWeight:700,color:isToday?"#0ea5e9":T.text,fontFamily:"DM Mono,monospace"}}>{dayName}</div>
                        {isToday&&<div style={{fontSize:8,color:"#0ea5e9",fontWeight:600}}>TODAY</div>}
                      </div>
                      <div style={{width:36,height:36,borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",
                        background:sf.status==="GO"?"#dcfce7":sf.status==="CAUTION"?"#fef9c3":"#fee2e2",flexShrink:0}}>
                        <span style={{fontSize:9,fontWeight:800,color:sf.status==="GO"?"#15803d":sf.status==="CAUTION"?"#a16207":"#b91c1c",fontFamily:"DM Mono,monospace"}}>{sf.status==="GO"?"GO":sf.status==="CAUTION"?"CAU":"NO"}</span>
                      </div>
                      <div style={{flex:1,minWidth:0}}>
                        <div style={{display:"flex",gap:12,flexWrap:"wrap"}}>
                          <div style={{fontSize:11,fontFamily:"DM Mono,monospace"}}>
                            <span style={{color:"#0ea5e9",fontWeight:700}}>{dispWMax}</span>
                            <span style={{color:T.sub,fontSize:9}}> {wUnit} {wDirLabel}</span>
                          </div>
                          <div style={{fontSize:11,fontFamily:"DM Mono,monospace"}}>
                            <span style={{color:"#0891b2",fontWeight:700}}>{dispWvMax}</span>
                            <span style={{color:T.sub,fontSize:9}}> {hUnit}</span>
                          </div>
                          {swMax > 0.1 && (
                            <div style={{fontSize:11,fontFamily:"DM Mono,monospace"}}>
                              <span style={{color:"#6366f1",fontWeight:600}}>{dispSwMax}</span>
                              <span style={{color:T.sub,fontSize:9}}> sw</span>
                            </div>
                          )}
                          <div style={{fontSize:11,fontFamily:"DM Mono,monospace"}}>
                            <span style={{color:T.text,fontWeight:600}}>{dispTMax}°</span>
                            <span style={{color:T.sub,fontSize:9}}>/{dispTMin}°</span>
                          </div>
                          {rain > 1 && <div style={{fontSize:9,color:"#64748b",background:"#f1f5f9",padding:"1px 5px",borderRadius:3}}>{rain.toFixed(1)}mm</div>}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </>}
        {(!data||data.err)&&!loading&&(
          <div style={{display:"flex",alignItems:"center",justifyContent:"center",height:"60%",color:T.sub,fontSize:12}}>
            {data?.err?"Could not load forecast data.":"Select a spot to view forecasts."}
          </div>
        )}
      </div>

      {/* RIGHT: map ~30% (bottom on mobile) */}
      <div style={{width:isMobile?"100%":"30%",height:isMobile?300:undefined,flexShrink:0,borderLeft:isMobile?"none":"1px solid "+T.border,borderTop:isMobile?"1px solid "+T.border:"none",overflow:"hidden"}}>
        <SpotMap spot={spot} windDir={data&&!data.err?wdir:null} swellDir={data&&!data.err?swellDir:null} wind={data&&!data.err?wind:null} wave={data&&!data.err?wave:null} onSelectNearby={pick}/>
      </div>
    </div>
  );

  // ── HOME VIEW (no spot selected) ──
  return (
    <div style={{display:"flex",flexDirection:isMobile?"column":"row",height:"calc(100vh - 48px)",overflow:"hidden",fontFamily:"DM Sans,sans-serif"}}>
      {/* Left: search + spot list */}
      <div style={{width:isMobile?"100%":280,flexShrink:0,maxHeight:isMobile?"50vh":undefined,borderRight:isMobile?"none":"1px solid "+T.border,borderBottom:isMobile?"1px solid "+T.border:"none",overflowY:"auto",background:T.card}}>
        <div style={{padding:"14px 14px 0"}}>
          <div style={{fontSize:11,fontWeight:800,letterSpacing:2,color:T.text,marginBottom:12,paddingBottom:10,borderBottom:"1px solid "+T.border}}>CONDITIONS</div>
          <input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search spots…"
            style={{width:"100%",padding:"8px 10px",borderRadius:4,border:"1px solid "+T.border,background:T.bg,color:T.text,fontSize:13,boxSizing:"border-box",fontFamily:"DM Sans,sans-serif",marginBottom:14}}/>
          {favs.length > 0 && !query && (
            <div style={{marginBottom:14}}>
              <div style={{fontSize:9,color:T.sub,letterSpacing:2,marginBottom:8,fontWeight:600}}>FAVORITES</div>
              {S.filter(s => favs.includes(s.id)).map(s => {
                const rc = RC[s.region] || "#6366f1";
                return (
                  <div key={s.id} onClick={() => pick(s)}
                    style={{display:"flex",alignItems:"center",gap:8,padding:"8px 8px",borderRadius:4,marginBottom:2,cursor:"pointer",transition:"background .1s"}}
                    onMouseEnter={e => e.currentTarget.style.background=T.hi}
                    onMouseLeave={e => e.currentTarget.style.background="transparent"}>
                    <div style={{width:6,height:6,borderRadius:"50%",background:rc,flexShrink:0}}/>
                    <div style={{flex:1,minWidth:0}}>
                      <div style={{fontWeight:600,fontSize:13,color:T.text,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{s.name}</div>
                      <div style={{fontSize:10,color:T.sub}}>{s.country}</div>
                    </div>
                    <button onClick={e=>{e.stopPropagation();toggleFav(s.id);}}
                      style={{background:"none",border:"none",cursor:"pointer",fontSize:14,color:"#f59e0b",padding:"0 2px",lineHeight:1,flexShrink:0}}>★</button>
                  </div>
                );
              })}
            </div>
          )}
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
                <button onClick={e => { e.stopPropagation(); toggleFav(s.id); }}
                  style={{background:"none",border:"none",cursor:"pointer",fontSize:14,color:favs.includes(s.id)?"#f59e0b":"#cbd5e1",padding:"0 2px",lineHeight:1,flexShrink:0}}>
                  ★
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Right: world map */}
      <div style={{flex:1,overflow:"hidden",minHeight:isMobile?300:undefined}}>
        <WorldMap spots={S} sport="surf" month={new Date().getMonth()} selectedId={null} onSelect={pick} dark={dark}/>
      </div>
    </div>
  );
}
