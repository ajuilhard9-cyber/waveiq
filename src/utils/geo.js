import { S } from '../data/spots';

function dist(a1, o1, a2, o2) {
  const R = 6371, da = (a2-a1)*Math.PI/180, doo = (o2-o1)*Math.PI/180;
  const a = Math.sin(da/2)**2 + Math.cos(a1*Math.PI/180)*Math.cos(a2*Math.PI/180)*Math.sin(doo/2)**2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
}

export function searchSpots(q) {
  if (!q) return [];
  const l = q.toLowerCase();
  return S.map(s => ({...s, sc: (s.name.toLowerCase().includes(l)?2:0) + (s.country.toLowerCase().includes(l)?1:0)}))
    .filter(s => s.sc > 0).sort((a,b) => b.sc - a.sc).slice(0, 6);
}

export function nearest(la, lo) {
  return S.map(s => ({...s, d: dist(la, lo, s.lat, s.lng)})).sort((a,b) => a.d - b.d).slice(0, 6);
}
