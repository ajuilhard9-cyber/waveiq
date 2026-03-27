// Tidal period: 12.42 hours (semi-diurnal)
// Each location gets a phase offset derived from its coordinates so tides differ per spot
const PERIOD_MS = 12.42 * 3600 * 1000;

export function tidalHeight(lat, lng, unixMs) {
  const seed = ((Math.abs(lat * 127.1 + lng * 311.7)) % PERIOD_MS);
  const phase = ((unixMs + seed) % PERIOD_MS) / PERIOD_MS * 2 * Math.PI;
  return Math.cos(phase); // -1 (low) to +1 (high)
}

// Returns array of {time (ISO string), height (-1 to 1)} for next 24h at 30min intervals
export function tideChart(lat, lng) {
  const now = Date.now();
  const points = [];
  for (let i = 0; i <= 48; i++) {
    const t = now + i * 30 * 60 * 1000;
    points.push({ time: new Date(t).toISOString(), height: tidalHeight(lat, lng, t) });
  }
  return points;
}

// Returns next high and low tide times as { high: Date, low: Date }
export function nextTides(lat, lng) {
  const now = Date.now();
  const seed = ((Math.abs(lat * 127.1 + lng * 311.7)) % PERIOD_MS);
  const currentPhase = ((now + seed) % PERIOD_MS) / PERIOD_MS * 2 * Math.PI;
  const toHigh = ((2 * Math.PI - currentPhase) % (2 * Math.PI)) / (2 * Math.PI) * PERIOD_MS;
  const toLow = ((Math.PI - currentPhase + 2 * Math.PI) % (2 * Math.PI)) / (2 * Math.PI) * PERIOD_MS;
  return {
    high: new Date(now + toHigh),
    low: new Date(now + toLow),
  };
}
