export const WD = ["N","NNE","NE","ENE","E","ESE","SE","SSE","S","SSW","SW","WSW","W","WNW","NW","NNW"];

export const wetsuit = t => !t||t>=24?"Boardshorts":t>=21?"1-2mm Shorty":t>=18?"2mm Shorty":t>=15?"3/2mm Fullsuit":t>=12?"4/3mm Fullsuit":"5mm+ Drysuit";
export const wcolor  = t => !t||t>=24?"#f97316":t>=18?"#eab308":t>=15?"#6366f1":"#818cf8";
export const kite    = w => w<8?"Too light":w<12?"17-19m":w<16?"14-17m":w<20?"12-14m":w<25?"10-12m":w<30?"9-10m":"7-9m";
export const sail    = w => w<8?"8-10m":w<14?"6.5-8m":w<18?"5.5-6.5m":w<24?"4.5-5.5m":"3.5-4.5m";

// Estimates water visibility based on wave height and period
export function visibility(waveHeight, wavePeriod) {
  if (waveHeight == null) return { label: "N/A", color: "#94a3b8" };
  const score = (wavePeriod || 8) / Math.max(waveHeight, 0.3);
  if (score > 10) return { label: "Good", color: "#22c55e" };
  if (score > 5)  return { label: "Moderate", color: "#f59e0b" };
  return { label: "Poor", color: "#ef4444" };
}

export function safety(wind, wave, sport, level, isNight) {
  if (isNight) return { status: "NO-GO", score: 0, warnings: ["Night — no activity recommended"] };
  const ex = level==="expert"||level==="advanced", bg = level==="beginner";
  const L = {
    surf:     {minWave:0.3, maxWave:ex?6:bg?1.5:3, maxWind:25},
    kite:     {minWind:8,   maxWind:ex?45:bg?20:35},
    windsurf: {minWind:8,   maxWind:ex?50:bg?20:40},
    kayak:    {maxWind:bg?15:25},
    sup:      {maxWind:bg?12:20},
    sail:     {minWind:5,   maxWind:ex?40:30},
    fishing:  {maxWind:25},
  }[sport] || {};
  let sc = 100;
  const w = [];
  if (L.minWind && wind < L.minWind) { sc -= 30; w.push("Wind too light"); }
  if (L.maxWind && wind > L.maxWind) { sc -= 40; w.push("Too strong for "+level); }
  if (L.minWave && wave < L.minWave) { sc -= 20; w.push("Waves too small"); }
  if (L.maxWave && wave > L.maxWave) { sc -= 40; w.push("Waves too big"); }
  return { status: sc<=30?"NO-GO":sc<=65?"CAUTION":"GO", score: Math.max(0,sc), warnings: w };
}
