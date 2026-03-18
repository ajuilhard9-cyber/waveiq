// Each spot has seasonal scoring arrays [Jan..Dec] scored 1-5
// wind=wind reliability, swell=wave quality, temp=water/air warmth, crowd=inverse crowding
export const S = [
  {id:43,  name:"Tarifa",      country:"Spain",          lat:36,     lng:-5.65,   region:"Europe",    seasonal:{wind:[3,3,3,3,4,5,5,5,4,3,3,3],swell:[3,3,3,3,2,2,2,2,2,3,3,3],temp:[3,3,3,4,4,5,5,5,4,4,3,3],crowd:[4,4,4,3,3,2,1,1,2,3,4,4]}},
  {id:5693,name:"Maui",        country:"Hawaii USA",     lat:20.906, lng:-156.422,region:"Pacific",   seasonal:{wind:[3,3,4,4,5,5,5,5,5,4,3,3],swell:[4,4,3,3,3,3,3,3,4,4,4,5],temp:[4,4,4,4,5,5,5,5,5,5,4,4],crowd:[3,3,3,4,4,4,3,3,3,3,3,3]}},
  {id:309513,name:"Hossegor",  country:"France",         lat:43.658, lng:-1.447,  region:"Europe",    seasonal:{wind:[2,2,3,3,3,3,3,3,3,3,2,2],swell:[3,3,3,3,3,3,3,4,5,5,4,3],temp:[3,3,3,4,4,5,5,5,4,4,3,3],crowd:[4,4,4,4,4,3,2,2,3,4,4,4]}},
  {id:75856,name:"Nazare",     country:"Portugal",       lat:39.6,   lng:-9.075,  region:"Europe",    seasonal:{wind:[3,3,3,4,4,4,4,4,4,3,3,3],swell:[5,5,4,4,3,2,2,2,3,4,5,5],temp:[3,3,3,3,4,4,4,4,4,3,3,3],crowd:[4,4,4,4,4,3,3,3,4,4,4,4]}},
  {id:4239,name:"Cape Town",   country:"S.Africa",       lat:-33.917,lng:18.404,  region:"Africa",    seasonal:{wind:[5,5,4,3,3,3,3,3,4,4,5,5],swell:[3,3,3,3,4,5,5,5,4,3,3,3],temp:[5,5,5,4,3,2,2,2,3,4,5,5],crowd:[3,3,3,4,4,4,4,4,4,3,3,3]}},
  {id:26,  name:"Essaouira",   country:"Morocco",        lat:31.502, lng:-9.764,  region:"Africa",    seasonal:{wind:[3,3,4,4,5,5,5,5,4,3,3,3],swell:[4,4,4,3,3,2,2,2,3,3,4,4],temp:[3,3,4,4,5,5,5,5,5,4,3,3],crowd:[4,4,4,4,3,3,3,3,4,4,4,4]}},
  {id:15278,name:"Dakhla",     country:"Morocco",        lat:23.917, lng:-15.774, region:"Africa",    seasonal:{wind:[5,5,4,4,4,4,4,4,4,4,5,5],swell:[3,3,3,3,2,2,2,2,2,3,3,3],temp:[4,4,4,4,5,5,5,5,5,4,4,4],crowd:[4,4,4,4,4,3,3,3,4,4,4,4]}},
  {id:782987,name:"Siargao",   country:"Philippines",    lat:9.792,  lng:126.162, region:"Asia",      seasonal:{wind:[3,3,3,3,3,3,4,4,4,3,3,3],swell:[3,3,3,3,3,4,4,5,5,4,3,3],temp:[4,4,5,5,5,5,5,5,4,4,4,4],crowd:[4,4,4,4,4,3,3,3,3,3,3,3]}},
  {id:231, name:"Uluwatu",     country:"Bali",           lat:-8.83,  lng:115.09,  region:"Asia",      seasonal:{wind:[2,2,2,3,3,4,4,4,3,3,2,2],swell:[3,3,3,4,5,5,5,4,4,3,3,3],temp:[4,4,4,4,4,4,4,4,4,4,4,4],crowd:[4,4,4,3,3,2,2,2,3,3,4,4]}},
  {id:158, name:"Canggu",      country:"Bali",           lat:-8.65,  lng:115.13,  region:"Asia",      seasonal:{wind:[2,2,2,3,3,4,4,4,3,3,2,2],swell:[3,3,3,4,5,5,5,4,4,3,3,3],temp:[4,4,4,4,4,4,4,4,4,4,4,4],crowd:[3,3,3,3,3,2,2,2,3,3,3,3]}},
  {id:211, name:"Ericeira",    country:"Portugal",       lat:38.963, lng:-9.416,  region:"Europe",    seasonal:{wind:[3,3,3,3,4,4,4,4,4,3,3,3],swell:[4,4,4,4,3,2,2,3,4,4,5,5],temp:[3,3,3,4,4,5,5,5,4,4,3,3],crowd:[4,4,4,4,3,3,3,3,3,4,4,4]}},
  {id:203944,name:"Sagres",    country:"Portugal",       lat:37.014, lng:-8.938,  region:"Europe",    seasonal:{wind:[4,4,4,5,5,5,5,5,4,3,3,3],swell:[4,4,4,3,3,2,2,3,4,4,5,5],temp:[3,3,3,4,4,5,5,5,4,4,3,3],crowd:[4,4,4,4,4,3,3,3,4,4,4,4]}},
  {id:15604,name:"Cabarete",   country:"Dom.Republic",   lat:19.751, lng:-70.412, region:"Caribbean", seasonal:{wind:[5,5,4,4,4,5,4,4,3,3,3,4],swell:[3,3,3,3,3,3,3,3,3,3,3,3],temp:[4,4,4,5,5,5,5,5,5,4,4,4],crowd:[3,3,3,3,3,3,3,3,4,4,4,3]}},
  {id:15025,name:"Aruba",      country:"Aruba",          lat:12.57,  lng:-70.06,  region:"Caribbean", seasonal:{wind:[5,5,5,5,5,5,4,4,3,3,3,4],swell:[2,2,2,2,2,2,2,2,2,2,2,2],temp:[5,5,5,5,5,5,5,5,5,5,5,5],crowd:[3,3,4,4,4,4,4,4,4,4,3,3]}},
  {id:50613,name:"Zanzibar",   country:"Tanzania",       lat:-5.95,  lng:39.45,   region:"Indian",    seasonal:{wind:[4,4,3,3,3,5,5,5,4,3,3,4],swell:[3,3,3,3,3,3,3,3,3,3,3,3],temp:[5,5,5,5,4,4,4,4,4,5,5,5],crowd:[3,3,3,4,4,4,4,4,4,4,3,3]}},
  {id:49045,name:"El Gouna",   country:"Egypt",          lat:27.4,   lng:33.68,   region:"Indian",    seasonal:{wind:[4,4,4,4,4,5,5,5,4,4,4,4],swell:[2,2,2,2,2,2,2,2,2,2,2,2],temp:[4,4,5,5,5,5,5,5,5,5,4,4],crowd:[3,3,3,3,4,4,4,4,4,3,3,3]}},
  {id:456789,name:"El Medano", country:"Tenerife",       lat:28.047, lng:-16.534, region:"Atlantic",  seasonal:{wind:[3,3,3,3,4,5,5,5,4,3,3,3],swell:[3,3,3,3,2,2,2,2,3,3,3,3],temp:[4,4,4,4,5,5,5,5,5,4,4,4],crowd:[4,4,4,4,3,2,2,2,3,4,4,4]}},
  {id:567890,name:"Corralejo", country:"Fuerteventura",  lat:28.728, lng:-13.867, region:"Atlantic",  seasonal:{wind:[3,3,4,4,4,5,5,5,4,3,3,3],swell:[3,3,3,3,2,2,2,2,2,3,3,3],temp:[4,4,4,4,5,5,5,5,5,4,4,4],crowd:[4,4,3,3,3,2,2,2,3,3,4,4]}},
  {id:15605,name:"Jericoacoara",country:"Brazil",        lat:-2.9,   lng:-40.51,  region:"S.America", seasonal:{wind:[3,3,3,3,3,3,4,5,5,5,5,4],swell:[2,2,2,2,3,3,3,3,3,3,2,2],temp:[5,5,5,5,5,5,5,5,5,5,5,5],crowd:[3,3,4,4,4,4,3,3,3,3,3,3]}},
  {id:990123,name:"Rio de Janeiro",country:"Brazil",     lat:-22.987,lng:-43.192, region:"S.America", seasonal:{wind:[3,3,3,3,4,4,4,4,4,3,3,3],swell:[3,3,3,4,4,4,4,4,3,3,3,3],temp:[5,5,5,4,4,3,3,3,4,4,5,5],crowd:[3,3,3,3,3,3,3,3,3,3,3,3]}},
];

const SPORT_WEIGHTS = {
  surf:     {wind:0.10,swell:0.55,temp:0.20,crowd:0.15},
  kite:     {wind:0.60,swell:0.05,temp:0.20,crowd:0.15},
  windsurf: {wind:0.60,swell:0.05,temp:0.20,crowd:0.15},
  kayak:    {wind:0.15,swell:0.10,temp:0.40,crowd:0.35},
  sup:      {wind:0.15,swell:0.10,temp:0.40,crowd:0.35},
  sail:     {wind:0.45,swell:0.10,temp:0.25,crowd:0.20},
  fishing:  {wind:0.10,swell:0.10,temp:0.40,crowd:0.40},
};

export function gradeScore(spot, sport, month) {
  const d = spot.seasonal;
  const w = SPORT_WEIGHTS[sport] || SPORT_WEIGHTS.surf;
  return d.wind[month]*w.wind + d.swell[month]*w.swell + d.temp[month]*w.temp + d.crowd[month]*w.crowd;
}

export function gradeLabel(score) {
  return score >= 4.2 ? 'A' : score >= 3.5 ? 'B' : score >= 2.8 ? 'C' : score >= 2.0 ? 'D' : 'F';
}

export function gradeColor(g) {
  return {A:'#22c55e',B:'#6366f1',C:'#f59e0b',D:'#f97316',F:'#f43f5e'}[g] || '#94a3b8';
}

export function gradeBg(g) {
  return {A:'#f0fdf4',B:'#eef2ff',C:'#fefce8',D:'#fff7ed',F:'#fff1f2'}[g] || '#f8fafc';
}

export function topPicks(sport, month, n=5) {
  return S.map(s => ({...s, score: gradeScore(s, sport, month)}))
    .sort((a,b) => b.score - a.score)
    .slice(0, n)
    .map(s => ({...s, grade: gradeLabel(s.score)}));
}
