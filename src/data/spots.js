// Each spot has seasonal scoring arrays [Jan..Dec] scored 1-5
// wind=wind reliability, swell=wave quality, temp=water/air warmth, crowd=inverse crowding
export const S = [
  // ===== ORIGINAL 20 SPOTS (unchanged) =====
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

  // ===== EUROPE — Portugal =====
  {id:1001,name:"Peniche",         country:"Portugal",     lat:39.356, lng:-9.381,  region:"Europe",    seasonal:{wind:[3,3,3,4,4,4,4,4,3,3,3,3],swell:[5,5,4,4,3,2,2,3,4,4,5,5],temp:[3,3,3,3,4,5,5,5,4,4,3,3],crowd:[3,3,3,3,3,2,2,2,3,3,3,3]}},
  {id:1002,name:"Costa da Caparica",country:"Portugal",    lat:38.629, lng:-9.237,  region:"Europe",    seasonal:{wind:[3,3,3,4,4,4,4,4,3,3,3,3],swell:[4,4,4,3,3,2,2,3,4,4,5,4],temp:[3,3,3,4,4,5,5,5,4,4,3,3],crowd:[3,3,3,3,3,2,1,1,3,3,3,3]}},
  {id:1003,name:"Lagos",           country:"Portugal",     lat:37.102, lng:-8.673,  region:"Europe",    seasonal:{wind:[3,3,3,4,4,5,5,5,4,3,3,3],swell:[4,4,3,3,2,2,2,2,3,4,4,4],temp:[3,3,3,4,4,5,5,5,5,4,3,3],crowd:[4,4,4,4,3,2,2,2,3,4,4,4]}},

  // ===== EUROPE — Spain =====
  {id:1004,name:"Mundaka",         country:"Spain",        lat:43.407, lng:-2.698,  region:"Europe",    seasonal:{wind:[2,2,3,3,3,3,3,3,3,3,2,2],swell:[4,4,4,3,3,2,2,3,4,5,5,4],temp:[2,2,3,3,4,4,5,5,4,3,3,2],crowd:[4,4,4,4,4,4,4,3,3,3,4,4]}},
  {id:1005,name:"Zarautz",         country:"Spain",        lat:43.284, lng:-2.170,  region:"Europe",    seasonal:{wind:[2,2,3,3,3,3,3,3,3,2,2,2],swell:[4,4,3,3,3,2,2,3,4,4,4,4],temp:[2,2,3,3,4,5,5,5,4,3,3,2],crowd:[4,4,4,4,3,2,1,1,2,3,4,4]}},
  {id:1006,name:"El Palmar",       country:"Spain",        lat:36.225, lng:-6.068,  region:"Europe",    seasonal:{wind:[3,3,3,3,4,5,5,5,4,3,3,3],swell:[4,4,3,3,2,2,2,2,3,4,4,4],temp:[3,3,3,4,4,5,5,5,5,4,3,3],crowd:[4,4,4,4,3,2,1,1,3,4,4,4]}},

  // ===== EUROPE — France =====
  {id:1007,name:"Lacanau",         country:"France",       lat:44.978, lng:-1.196,  region:"Europe",    seasonal:{wind:[2,2,3,3,3,3,3,3,3,3,2,2],swell:[4,4,3,3,3,2,3,4,5,5,4,4],temp:[2,2,3,3,4,5,5,5,4,3,3,2],crowd:[4,4,4,4,3,2,1,1,2,4,4,4]}},
  {id:1008,name:"Biarritz",        country:"France",       lat:43.481, lng:-1.558,  region:"Europe",    seasonal:{wind:[2,2,3,3,3,3,3,3,3,3,2,2],swell:[4,4,3,3,3,2,2,3,4,5,4,4],temp:[2,2,3,3,4,5,5,5,4,3,3,2],crowd:[4,4,4,3,3,2,1,1,2,3,4,4]}},
  {id:1009,name:"La Torche",       country:"France",       lat:47.837, lng:-4.350,  region:"Europe",    seasonal:{wind:[3,3,3,3,3,3,3,3,3,3,3,3],swell:[5,5,4,3,3,2,2,3,4,5,5,5],temp:[2,2,2,3,3,4,4,4,4,3,2,2],crowd:[4,4,4,4,4,3,3,3,4,4,4,4]}},

  // ===== EUROPE — UK & Ireland =====
  {id:1010,name:"Newquay",         country:"UK",           lat:50.417, lng:-5.076,  region:"Europe",    seasonal:{wind:[3,3,3,3,3,3,3,3,3,3,3,3],swell:[5,5,4,3,3,2,2,3,4,5,5,5],temp:[2,2,2,3,3,4,4,4,3,3,2,2],crowd:[4,4,4,4,3,2,1,1,2,4,4,4]}},
  {id:1011,name:"Thurso",          country:"UK",           lat:58.597, lng:-3.523,  region:"Europe",    seasonal:{wind:[4,4,3,3,3,3,3,3,3,4,4,4],swell:[5,5,4,4,3,2,2,3,4,5,5,5],temp:[1,1,1,2,2,3,3,3,3,2,1,1],crowd:[5,5,5,5,4,4,4,4,4,5,5,5]}},
  {id:1012,name:"Bundoran",        country:"Ireland",      lat:54.476, lng:-8.281,  region:"Europe",    seasonal:{wind:[4,4,3,3,3,3,3,3,3,4,4,4],swell:[5,5,4,4,3,2,2,3,4,5,5,5],temp:[2,2,2,2,3,3,4,4,3,3,2,2],crowd:[5,5,5,5,4,4,4,4,4,5,5,5]}},
  {id:1013,name:"Lahinch",         country:"Ireland",      lat:52.935, lng:-9.346,  region:"Europe",    seasonal:{wind:[4,4,3,3,3,3,3,3,3,4,4,4],swell:[5,5,4,3,3,2,2,3,4,5,5,5],temp:[2,2,2,2,3,3,4,4,3,3,2,2],crowd:[5,5,5,5,4,3,3,3,4,5,5,5]}},
  {id:1014,name:"Mullaghmore",     country:"Ireland",      lat:54.467, lng:-8.449,  region:"Europe",    seasonal:{wind:[4,4,3,3,3,3,3,3,3,4,4,4],swell:[5,5,4,4,3,2,2,3,5,5,5,5],temp:[2,2,2,2,3,3,4,4,3,3,2,2],crowd:[5,5,5,5,5,4,4,4,5,5,5,5]}},

  // ===== EUROPE — Scandinavia & Others =====
  {id:1015,name:"Klitmoller",      country:"Denmark",      lat:57.034, lng:8.494,   region:"Europe",    seasonal:{wind:[4,4,4,4,4,4,4,4,4,4,4,4],swell:[4,4,3,3,2,2,2,2,3,4,4,4],temp:[1,1,1,2,3,4,4,4,3,2,1,1],crowd:[5,5,5,5,4,3,3,3,4,5,5,5]}},
  {id:1016,name:"Unstad",          country:"Norway",       lat:68.279, lng:13.577,  region:"Europe",    seasonal:{wind:[4,4,3,3,3,3,3,3,3,4,4,4],swell:[5,5,4,4,3,2,2,3,4,5,5,5],temp:[1,1,1,1,2,3,3,3,2,2,1,1],crowd:[5,5,5,5,5,4,4,4,5,5,5,5]}},

  // ===== EUROPE — Mediterranean =====
  {id:1017,name:"Varazze",         country:"Italy",        lat:44.359, lng:8.577,   region:"Mediterranean",seasonal:{wind:[2,2,2,3,3,3,3,3,3,3,2,2],swell:[3,3,3,2,2,1,1,1,2,3,4,3],temp:[2,2,3,3,4,5,5,5,4,4,3,2],crowd:[4,4,4,4,3,2,1,1,3,4,4,4]}},
  {id:1018,name:"Ericeira de Mar", country:"Italy",        lat:38.729, lng:16.526,  region:"Mediterranean",seasonal:{wind:[3,3,3,3,3,3,3,3,3,3,3,3],swell:[3,3,2,2,1,1,1,1,2,3,3,3],temp:[2,2,3,4,4,5,5,5,5,4,3,2],crowd:[4,4,4,4,4,3,2,2,3,4,4,4]}},
  {id:1019,name:"Lefkada",         country:"Greece",       lat:38.703, lng:20.641,  region:"Mediterranean",seasonal:{wind:[3,3,3,3,4,5,5,5,4,3,3,3],swell:[2,2,2,2,1,1,1,1,2,2,2,2],temp:[3,3,3,4,5,5,5,5,5,4,3,3],crowd:[4,4,4,4,3,2,1,1,3,4,4,4]}},
  {id:1020,name:"Naxos",           country:"Greece",       lat:37.103, lng:25.376,  region:"Mediterranean",seasonal:{wind:[3,3,3,4,4,5,5,5,4,3,3,3],swell:[2,2,2,2,1,1,1,1,2,2,2,2],temp:[3,3,3,4,5,5,5,5,5,4,3,3],crowd:[4,4,4,3,3,2,1,1,3,4,4,4]}},

  // ===== ATLANTIC — Canary Islands =====
  {id:1021,name:"Lanzarote Famara",country:"Lanzarote",    lat:29.111, lng:-13.558, region:"Atlantic",  seasonal:{wind:[3,3,4,4,4,5,5,5,4,3,3,3],swell:[4,4,3,3,2,2,2,2,3,3,4,4],temp:[4,4,4,4,5,5,5,5,5,4,4,4],crowd:[4,4,3,3,3,2,2,2,3,4,4,4]}},
  {id:1022,name:"Gran Canaria",    country:"Gran Canaria", lat:27.998, lng:-15.377, region:"Atlantic",  seasonal:{wind:[3,3,3,4,4,5,5,5,4,3,3,3],swell:[4,4,3,3,2,2,2,2,3,3,4,4],temp:[4,4,4,4,5,5,5,5,5,4,4,4],crowd:[3,3,3,3,3,2,2,2,3,3,3,3]}},

  // ===== ATLANTIC — Azores, Madeira, Cape Verde =====
  {id:1023,name:"Azores",          country:"Portugal",     lat:37.741, lng:-25.677, region:"Atlantic",  seasonal:{wind:[4,4,3,3,3,3,3,3,3,3,4,4],swell:[5,5,4,4,3,2,2,3,4,4,5,5],temp:[3,3,3,3,4,4,5,5,4,4,3,3],crowd:[5,5,5,5,5,4,4,4,5,5,5,5]}},
  {id:1024,name:"Madeira",         country:"Portugal",     lat:32.651, lng:-16.908, region:"Atlantic",  seasonal:{wind:[3,3,3,3,3,3,3,3,3,3,3,3],swell:[4,4,4,3,3,2,2,2,3,4,4,4],temp:[3,3,3,4,4,5,5,5,5,4,3,3],crowd:[4,4,4,4,4,3,3,3,4,4,4,4]}},
  {id:1025,name:"Sal",             country:"Cape Verde",   lat:16.733, lng:-22.932, region:"Atlantic",  seasonal:{wind:[4,4,4,4,4,4,4,4,3,3,3,4],swell:[4,4,3,3,2,2,2,2,3,3,4,4],temp:[4,4,4,5,5,5,5,5,5,5,4,4],crowd:[4,4,4,4,4,4,4,4,4,4,4,4]}},
  {id:1026,name:"Boa Vista",       country:"Cape Verde",   lat:16.087, lng:-22.807, region:"Atlantic",  seasonal:{wind:[4,4,4,4,4,4,4,4,3,3,3,4],swell:[4,4,3,3,2,2,2,2,3,3,4,4],temp:[4,4,4,5,5,5,5,5,5,5,4,4],crowd:[5,5,5,5,5,4,4,4,5,5,5,5]}},

  // ===== AFRICA — Morocco =====
  {id:1027,name:"Taghazout",       country:"Morocco",      lat:30.544, lng:-9.715,  region:"Africa",    seasonal:{wind:[3,3,3,3,4,4,4,4,3,3,3,3],swell:[5,5,4,3,3,2,2,2,3,4,5,5],temp:[3,3,3,4,4,5,5,5,5,4,3,3],crowd:[3,3,3,3,4,4,4,4,4,3,3,3]}},
  {id:1028,name:"Imsouane",        country:"Morocco",      lat:30.841, lng:-9.827,  region:"Africa",    seasonal:{wind:[3,3,3,3,4,4,4,4,3,3,3,3],swell:[5,5,4,3,3,2,2,2,3,4,5,5],temp:[3,3,3,4,4,5,5,5,5,4,3,3],crowd:[4,4,4,4,4,3,3,3,4,4,4,4]}},
  {id:1029,name:"Sidi Kaouki",     country:"Morocco",      lat:31.374, lng:-9.785,  region:"Africa",    seasonal:{wind:[3,3,4,4,5,5,5,5,4,3,3,3],swell:[4,4,3,3,2,2,2,2,3,3,4,4],temp:[3,3,4,4,5,5,5,5,5,4,3,3],crowd:[4,4,4,4,4,3,3,3,4,4,4,4]}},

  // ===== AFRICA — South Africa & others =====
  {id:1030,name:"Jeffreys Bay",    country:"S.Africa",     lat:-33.960,lng:25.014,  region:"Africa",    seasonal:{wind:[3,3,3,3,3,4,5,5,4,3,3,3],swell:[3,3,3,4,5,5,5,5,4,3,3,3],temp:[5,5,4,4,3,2,2,2,3,4,5,5],crowd:[4,4,4,4,3,2,2,2,3,4,4,4]}},
  {id:1031,name:"Durban",          country:"S.Africa",     lat:-29.858,lng:31.029,  region:"Africa",    seasonal:{wind:[3,3,3,3,3,3,3,3,3,3,3,3],swell:[3,3,3,4,4,4,4,4,3,3,3,3],temp:[5,5,5,4,4,3,3,3,4,4,5,5],crowd:[3,3,3,3,3,3,3,3,3,3,3,3]}},
  {id:1032,name:"Skeleton Bay",    country:"Namibia",      lat:-23.647,lng:14.524,  region:"Africa",    seasonal:{wind:[3,3,3,3,3,4,5,5,4,3,3,3],swell:[3,3,3,4,5,5,5,5,4,3,3,3],temp:[4,4,4,3,3,2,2,2,3,3,4,4],crowd:[5,5,5,5,5,4,4,4,5,5,5,5]}},
  {id:1033,name:"Dakar",           country:"Senegal",      lat:14.694, lng:-17.467, region:"Africa",    seasonal:{wind:[3,3,3,3,3,3,3,3,3,3,3,3],swell:[4,4,3,3,3,3,3,3,3,3,4,4],temp:[4,4,4,5,5,5,5,5,5,5,4,4],crowd:[4,4,4,4,4,4,4,4,4,4,4,4]}},

  // ===== INDIAN OCEAN — Maldives =====
  {id:1034,name:"Male Atolls",     country:"Maldives",     lat:4.175,  lng:73.509,  region:"Indian",    seasonal:{wind:[3,3,3,3,3,4,4,4,3,3,3,3],swell:[3,3,3,4,4,4,4,4,3,3,3,3],temp:[5,5,5,5,5,5,5,5,5,5,5,5],crowd:[3,3,3,3,3,3,3,3,4,4,4,3]}},
  {id:1035,name:"Thulusdhoo",      country:"Maldives",     lat:4.374,  lng:73.647,  region:"Indian",    seasonal:{wind:[3,3,3,3,3,4,4,4,3,3,3,3],swell:[3,3,3,4,5,5,5,4,3,3,3,3],temp:[5,5,5,5,5,5,5,5,5,5,5,5],crowd:[3,3,3,3,3,3,3,3,4,4,3,3]}},

  // ===== INDIAN OCEAN — Sri Lanka =====
  {id:1036,name:"Arugam Bay",      country:"Sri Lanka",    lat:6.839,  lng:81.838,  region:"Indian",    seasonal:{wind:[3,3,3,3,3,4,5,5,4,3,3,3],swell:[3,3,3,3,4,5,5,5,4,3,3,3],temp:[5,5,5,5,5,5,5,5,5,5,5,5],crowd:[4,4,4,4,3,2,2,2,3,4,4,4]}},
  {id:1037,name:"Hikkaduwa",       country:"Sri Lanka",    lat:6.140,  lng:80.098,  region:"Indian",    seasonal:{wind:[3,3,3,3,4,4,4,4,3,3,3,3],swell:[4,4,3,3,3,3,3,3,3,3,4,4],temp:[5,5,5,5,5,5,5,5,5,5,5,5],crowd:[3,3,3,3,3,3,3,3,4,4,3,3]}},

  // ===== INDIAN OCEAN — Reunion, Mauritius, Madagascar =====
  {id:1038,name:"St-Leu",          country:"Reunion",      lat:-21.192,lng:55.290,  region:"Indian",    seasonal:{wind:[3,3,3,3,4,5,5,5,4,3,3,3],swell:[3,3,3,4,5,5,5,5,4,3,3,3],temp:[5,5,5,4,4,3,3,3,4,4,5,5],crowd:[4,4,4,4,3,3,3,3,4,4,4,4]}},
  {id:1039,name:"Tamarin Bay",     country:"Mauritius",    lat:-20.325,lng:57.375,  region:"Indian",    seasonal:{wind:[3,3,3,3,4,5,5,5,4,3,3,3],swell:[3,3,3,4,5,5,5,4,4,3,3,3],temp:[5,5,5,4,4,3,3,3,4,4,5,5],crowd:[4,4,4,4,3,3,3,3,4,4,4,4]}},
  {id:1040,name:"Anakao",          country:"Madagascar",   lat:-23.689,lng:43.649,  region:"Indian",    seasonal:{wind:[3,3,3,3,4,5,5,5,4,3,3,3],swell:[3,3,3,4,5,5,5,5,4,3,3,3],temp:[5,5,5,4,3,3,3,3,4,4,5,5],crowd:[5,5,5,5,5,4,4,4,5,5,5,5]}},

  // ===== CARIBBEAN =====
  {id:1041,name:"Barbados",        country:"Barbados",     lat:13.193, lng:-59.543, region:"Caribbean", seasonal:{wind:[4,4,4,4,4,4,4,3,3,3,3,4],swell:[3,3,3,3,3,3,3,3,3,3,3,3],temp:[5,5,5,5,5,5,5,5,5,5,5,5],crowd:[3,3,3,3,3,3,3,3,4,4,4,3]}},
  {id:1042,name:"Rincon PR",       country:"Puerto Rico",  lat:18.340, lng:-67.250, region:"Caribbean", seasonal:{wind:[4,4,4,3,3,3,3,3,3,3,3,4],swell:[5,5,4,3,2,2,2,2,3,4,5,5],temp:[4,4,4,5,5,5,5,5,5,5,4,4],crowd:[3,3,3,4,4,4,4,4,4,4,3,3]}},
  {id:1043,name:"Bonaire",         country:"Bonaire",      lat:12.201, lng:-68.262, region:"Caribbean", seasonal:{wind:[5,5,5,5,5,5,4,4,3,3,3,4],swell:[2,2,2,2,2,2,2,2,2,2,2,2],temp:[5,5,5,5,5,5,5,5,5,5,5,5],crowd:[3,3,4,4,4,4,4,4,4,4,3,3]}},
  {id:1044,name:"Martinique",      country:"Martinique",   lat:14.641, lng:-61.024, region:"Caribbean", seasonal:{wind:[4,4,4,4,4,4,4,3,3,3,3,4],swell:[3,3,3,3,2,2,2,2,3,3,3,3],temp:[5,5,5,5,5,5,5,5,5,5,5,5],crowd:[3,3,3,3,4,4,4,4,4,4,3,3]}},
  {id:1045,name:"Union Island",    country:"St Vincent",   lat:12.594, lng:-61.432, region:"Caribbean", seasonal:{wind:[5,5,5,5,5,4,4,3,3,3,4,5],swell:[2,2,2,2,2,2,2,2,2,2,2,2],temp:[5,5,5,5,5,5,5,5,5,5,5,5],crowd:[4,4,4,4,4,4,4,4,4,4,4,4]}},
  {id:1046,name:"Tobago",          country:"Trinidad",     lat:11.245, lng:-60.684, region:"Caribbean", seasonal:{wind:[4,4,4,3,3,3,3,3,3,3,3,4],swell:[3,3,3,2,2,2,2,2,3,3,3,3],temp:[5,5,5,5,5,5,5,5,5,5,5,5],crowd:[4,4,4,4,4,4,4,4,4,4,4,4]}},

  // ===== S.AMERICA — Brazil =====
  {id:1047,name:"Florianopolis",   country:"Brazil",       lat:-27.594,lng:-48.548, region:"S.America", seasonal:{wind:[3,3,3,3,3,3,3,3,3,3,3,3],swell:[3,3,3,4,4,4,4,4,3,3,3,3],temp:[5,5,5,4,3,3,3,3,3,4,5,5],crowd:[3,3,3,3,4,4,4,4,4,3,3,3]}},
  {id:1048,name:"Itacare",         country:"Brazil",       lat:-14.278,lng:-38.996, region:"S.America", seasonal:{wind:[3,3,3,3,3,3,3,3,3,3,3,3],swell:[3,3,3,4,4,4,4,4,3,3,3,3],temp:[5,5,5,5,4,4,4,4,5,5,5,5],crowd:[4,4,4,4,4,4,3,3,4,4,4,4]}},
  {id:1049,name:"Sao Conrado",     country:"Brazil",       lat:-22.997,lng:-43.259, region:"S.America", seasonal:{wind:[3,3,3,3,3,4,4,4,3,3,3,3],swell:[3,3,3,4,4,4,4,4,3,3,3,3],temp:[5,5,5,4,4,3,3,3,4,4,5,5],crowd:[3,3,3,3,3,3,3,3,3,3,3,3]}},

  // ===== S.AMERICA — Peru, Chile, Ecuador =====
  {id:1050,name:"Chicama",         country:"Peru",         lat:-7.842, lng:-79.447, region:"S.America", seasonal:{wind:[3,3,3,3,3,4,4,4,3,3,3,3],swell:[3,3,3,3,4,4,5,5,4,3,3,3],temp:[4,4,4,4,3,3,3,3,3,3,4,4],crowd:[5,5,5,5,4,3,3,3,4,5,5,5]}},
  {id:1051,name:"Mancora",         country:"Peru",         lat:-4.107, lng:-81.051, region:"S.America", seasonal:{wind:[3,3,3,3,3,3,3,3,3,3,3,3],swell:[3,3,3,3,3,3,3,3,3,3,3,3],temp:[5,5,5,5,4,4,4,4,4,4,5,5],crowd:[3,3,3,4,4,4,4,4,4,3,3,3]}},
  {id:1052,name:"Punta de Lobos",  country:"Chile",        lat:-34.413,lng:-72.041, region:"S.America", seasonal:{wind:[3,3,3,3,3,3,3,3,3,3,3,3],swell:[3,3,4,4,5,5,5,5,4,4,3,3],temp:[5,4,4,3,3,2,2,2,3,3,4,5],crowd:[4,4,4,4,4,3,3,3,4,4,4,4]}},
  {id:1053,name:"Arica",           country:"Chile",        lat:-18.478,lng:-70.318, region:"S.America", seasonal:{wind:[3,3,3,3,3,3,3,3,3,3,3,3],swell:[3,3,3,3,4,5,5,5,4,3,3,3],temp:[4,4,4,4,3,3,3,3,3,3,4,4],crowd:[5,5,5,5,4,4,4,4,5,5,5,5]}},
  {id:1054,name:"Montanita",       country:"Ecuador",      lat:-1.824, lng:-80.753, region:"S.America", seasonal:{wind:[3,3,3,3,3,3,3,3,3,3,3,3],swell:[4,4,3,3,3,3,3,3,3,3,4,4],temp:[5,5,5,5,5,4,4,4,4,4,5,5],crowd:[3,3,3,4,4,4,4,4,4,3,3,3]}},

  // ===== S.AMERICA — Colombia, Venezuela, Uruguay =====
  {id:1055,name:"Santa Marta",     country:"Colombia",     lat:11.248, lng:-74.199, region:"S.America", seasonal:{wind:[5,5,4,3,3,3,4,4,3,3,3,4],swell:[3,3,3,3,2,2,2,2,3,3,3,3],temp:[5,5,5,5,5,5,5,5,5,5,5,5],crowd:[3,3,3,4,4,4,4,4,4,4,3,3]}},
  {id:1056,name:"Punta del Este",  country:"Uruguay",      lat:-34.963,lng:-54.949, region:"S.America", seasonal:{wind:[3,3,3,3,3,3,3,3,3,3,3,3],swell:[3,3,3,4,4,4,4,4,3,3,3,3],temp:[5,5,4,4,3,2,2,2,3,3,4,5],crowd:[3,3,3,4,4,4,4,4,4,4,3,3]}},

  // ===== N.AMERICA — California =====
  {id:1057,name:"Mavericks",       country:"USA",          lat:37.493, lng:-122.496,region:"Pacific",   seasonal:{wind:[3,3,3,3,3,3,3,3,3,3,3,3],swell:[5,5,4,4,3,2,2,2,3,4,5,5],temp:[2,2,3,3,3,4,4,4,4,3,3,2],crowd:[4,4,4,4,4,4,4,4,4,4,4,4]}},
  {id:1058,name:"Trestles",        country:"USA",          lat:33.382, lng:-117.589,region:"Pacific",   seasonal:{wind:[2,2,3,3,3,3,3,3,3,3,2,2],swell:[4,4,3,3,3,4,4,4,4,3,4,4],temp:[3,3,3,3,4,4,5,5,5,4,3,3],crowd:[3,3,3,3,2,1,1,1,2,3,3,3]}},
  {id:1059,name:"Steamer Lane",    country:"USA",          lat:36.951, lng:-122.026,region:"Pacific",   seasonal:{wind:[2,2,3,3,3,4,4,4,3,3,2,2],swell:[5,5,4,4,3,2,2,3,4,4,5,5],temp:[2,2,3,3,3,4,4,4,4,3,2,2],crowd:[3,3,3,3,3,2,2,2,3,3,3,3]}},
  {id:1060,name:"Huntington Beach",country:"USA",          lat:33.655, lng:-118.005,region:"Pacific",   seasonal:{wind:[2,2,3,3,3,3,3,3,3,3,2,2],swell:[4,4,3,3,3,4,4,4,4,3,4,4],temp:[3,3,3,4,4,5,5,5,5,4,3,3],crowd:[3,3,3,2,2,1,1,1,1,2,3,3]}},
  {id:1061,name:"Rincon CA",       country:"USA",          lat:34.374, lng:-119.476,region:"Pacific",   seasonal:{wind:[2,2,2,3,3,3,3,3,3,3,2,2],swell:[5,5,4,3,2,2,2,2,3,4,5,5],temp:[3,3,3,3,4,4,5,5,4,4,3,3],crowd:[3,3,3,4,4,4,4,4,4,3,3,3]}},

  // ===== N.AMERICA — Hawaii =====
  {id:1062,name:"Pipeline",        country:"Hawaii USA",   lat:21.665, lng:-158.053,region:"Pacific",   seasonal:{wind:[3,3,4,4,5,5,5,5,4,4,3,3],swell:[5,5,4,3,2,2,2,2,3,4,5,5],temp:[4,4,4,5,5,5,5,5,5,5,4,4],crowd:[2,2,3,3,4,4,4,4,3,3,2,2]}},
  {id:1063,name:"Jaws (Peahi)",    country:"Hawaii USA",   lat:20.943, lng:-156.256,region:"Pacific",   seasonal:{wind:[3,3,4,4,5,5,5,5,5,4,3,3],swell:[5,5,4,3,2,2,2,2,3,4,5,5],temp:[4,4,4,4,5,5,5,5,5,5,4,4],crowd:[4,4,4,5,5,5,5,5,5,4,4,4]}},
  {id:1064,name:"Waikiki",         country:"Hawaii USA",   lat:21.276, lng:-157.827,region:"Pacific",   seasonal:{wind:[3,3,3,4,4,5,5,5,4,3,3,3],swell:[4,4,3,3,3,4,4,4,3,3,4,4],temp:[4,4,4,5,5,5,5,5,5,5,4,4],crowd:[1,1,1,1,1,1,1,1,1,1,1,1]}},

  // ===== N.AMERICA — Mexico =====
  {id:1065,name:"Puerto Escondido",country:"Mexico",       lat:15.861, lng:-97.072, region:"Pacific",   seasonal:{wind:[3,3,3,3,3,3,3,3,3,3,3,3],swell:[3,3,3,3,4,5,5,5,4,3,3,3],temp:[5,5,5,5,5,5,5,5,5,5,5,5],crowd:[3,3,3,4,4,3,2,2,3,4,3,3]}},
  {id:1066,name:"Sayulita",        country:"Mexico",       lat:20.869, lng:-105.441,region:"Pacific",   seasonal:{wind:[3,3,3,3,3,3,3,3,3,3,3,3],swell:[4,4,3,3,3,4,4,4,4,3,4,4],temp:[4,4,5,5,5,5,5,5,5,5,4,4],crowd:[2,2,3,3,4,4,4,4,4,3,2,2]}},
  {id:1067,name:"Todos Santos",    country:"Mexico",       lat:23.445, lng:-110.223,region:"Pacific",   seasonal:{wind:[3,3,3,3,3,3,3,3,3,3,3,3],swell:[4,4,3,3,3,4,4,4,4,3,4,4],temp:[4,4,4,4,5,5,5,5,5,5,4,4],crowd:[4,4,4,4,4,3,3,3,4,4,4,4]}},
  {id:1068,name:"La Ventana",      country:"Mexico",       lat:24.048, lng:-109.992,region:"Pacific",   seasonal:{wind:[5,5,4,3,3,3,3,3,3,3,4,5],swell:[2,2,2,2,2,2,2,2,2,2,2,2],temp:[4,4,4,4,5,5,5,5,5,5,4,4],crowd:[3,3,3,4,4,5,5,5,4,4,3,3]}},

  // ===== N.AMERICA — Costa Rica, Panama =====
  {id:1069,name:"Tamarindo",       country:"Costa Rica",   lat:10.299, lng:-85.838, region:"Pacific",   seasonal:{wind:[3,3,3,3,3,3,3,3,3,3,3,3],swell:[3,3,3,3,4,4,4,4,3,3,3,3],temp:[5,5,5,5,5,5,5,5,5,5,5,5],crowd:[2,2,3,3,3,3,3,3,3,3,2,2]}},
  {id:1070,name:"Playa Hermosa CR",country:"Costa Rica",   lat:9.560,  lng:-84.580, region:"Pacific",   seasonal:{wind:[3,3,3,3,3,3,3,3,3,3,3,3],swell:[3,3,3,4,5,5,5,5,4,3,3,3],temp:[5,5,5,5,5,5,5,5,5,5,5,5],crowd:[4,4,4,4,3,3,3,3,4,4,4,4]}},
  {id:1071,name:"Santa Catalina",  country:"Panama",       lat:7.635,  lng:-81.245, region:"Pacific",   seasonal:{wind:[3,3,3,3,3,3,3,3,3,3,3,3],swell:[3,3,3,3,4,5,5,5,4,3,3,3],temp:[5,5,5,5,5,5,5,5,5,5,5,5],crowd:[5,5,5,5,4,3,3,3,4,5,5,5]}},
  {id:1072,name:"Bocas del Toro",  country:"Panama",       lat:9.340,  lng:-82.241, region:"Caribbean", seasonal:{wind:[3,3,3,3,3,3,3,3,3,3,3,3],swell:[3,3,3,3,3,3,3,3,3,3,3,3],temp:[5,5,5,5,5,5,5,5,5,5,5,5],crowd:[4,4,4,4,4,3,3,3,4,4,4,4]}},

  // ===== N.AMERICA — East Coast =====
  {id:1073,name:"Outer Banks",     country:"USA",          lat:35.559, lng:-75.466, region:"Atlantic",  seasonal:{wind:[3,3,3,3,3,3,3,3,4,4,3,3],swell:[4,4,3,3,3,3,3,4,5,4,4,4],temp:[2,2,2,3,4,5,5,5,4,3,2,2],crowd:[4,4,4,4,3,2,1,1,3,4,4,4]}},
  {id:1074,name:"Montauk",         country:"USA",          lat:41.071, lng:-71.954, region:"Atlantic",  seasonal:{wind:[3,3,3,3,3,3,3,3,4,3,3,3],swell:[4,4,3,3,2,2,2,3,5,4,4,4],temp:[1,1,2,3,3,4,5,5,4,3,2,1],crowd:[4,4,4,4,4,3,2,2,3,4,4,4]}},

  // ===== PACIFIC — Indonesia =====
  {id:1075,name:"G-Land",          country:"Indonesia",    lat:-8.740, lng:114.370, region:"Asia",      seasonal:{wind:[2,2,2,3,4,4,5,5,4,3,2,2],swell:[3,3,3,4,5,5,5,5,4,3,3,3],temp:[4,4,4,4,4,4,4,4,4,4,4,4],crowd:[5,5,5,4,3,3,3,3,4,5,5,5]}},
  {id:1076,name:"Desert Point",    country:"Indonesia",    lat:-8.757, lng:115.857, region:"Asia",      seasonal:{wind:[2,2,2,3,3,4,5,5,4,3,2,2],swell:[3,3,3,4,5,5,5,5,4,3,3,3],temp:[4,4,4,4,4,4,4,4,4,4,4,4],crowd:[5,5,5,4,3,3,3,3,4,5,5,5]}},
  {id:1077,name:"Mentawai Islands",country:"Indonesia",    lat:-2.176, lng:99.557,  region:"Asia",      seasonal:{wind:[2,2,2,3,3,4,4,4,3,3,2,2],swell:[3,3,3,4,5,5,5,5,4,3,3,3],temp:[5,5,5,5,5,5,5,5,5,5,5,5],crowd:[4,4,4,4,3,3,3,3,4,4,4,4]}},
  {id:1078,name:"Nias",            country:"Indonesia",    lat:1.109,  lng:97.556,  region:"Asia",      seasonal:{wind:[2,2,2,3,3,4,4,4,3,3,2,2],swell:[3,3,3,4,5,5,5,5,4,3,3,3],temp:[5,5,5,5,5,5,5,5,5,5,5,5],crowd:[5,5,5,5,4,3,3,3,4,5,5,5]}},
  {id:1079,name:"Sumbawa",         country:"Indonesia",    lat:-8.492, lng:118.045, region:"Asia",      seasonal:{wind:[2,2,2,3,3,4,4,4,3,3,2,2],swell:[3,3,3,4,5,5,5,5,4,3,3,3],temp:[4,4,4,4,4,4,4,4,4,4,4,4],crowd:[5,5,5,5,4,3,3,3,4,5,5,5]}},
  {id:1080,name:"Krui",            country:"Indonesia",    lat:-5.198, lng:103.925, region:"Asia",      seasonal:{wind:[2,2,2,3,3,4,4,4,3,3,2,2],swell:[3,3,3,4,5,5,5,5,4,3,3,3],temp:[5,5,5,5,5,5,5,5,5,5,5,5],crowd:[5,5,5,5,4,3,3,3,4,5,5,5]}},

  // ===== PACIFIC — Australia =====
  {id:1081,name:"Gold Coast",      country:"Australia",    lat:-28.003,lng:153.431, region:"Pacific",   seasonal:{wind:[3,3,3,3,3,3,3,3,3,3,3,3],swell:[3,3,4,4,4,3,3,3,3,3,3,3],temp:[5,5,5,4,4,3,3,3,4,4,5,5],crowd:[2,2,2,3,3,3,3,3,3,2,2,2]}},
  {id:1082,name:"Bells Beach",     country:"Australia",    lat:-38.368,lng:144.281, region:"Pacific",   seasonal:{wind:[3,3,3,3,3,3,3,3,3,3,3,3],swell:[3,3,4,5,5,4,4,4,4,4,3,3],temp:[5,5,4,3,2,2,2,2,3,3,4,5],crowd:[4,4,3,3,3,4,4,4,3,3,4,4]}},
  {id:1083,name:"Margaret River",  country:"Australia",    lat:-33.951,lng:114.997, region:"Pacific",   seasonal:{wind:[3,3,3,3,3,4,4,4,3,3,3,3],swell:[3,3,4,5,5,5,5,5,4,4,3,3],temp:[5,5,4,4,3,2,2,2,3,3,4,5],crowd:[4,4,4,3,3,3,3,3,4,4,4,4]}},
  {id:1084,name:"Noosa Heads",     country:"Australia",    lat:-26.382,lng:153.094, region:"Pacific",   seasonal:{wind:[3,3,3,3,3,3,3,3,3,3,3,3],swell:[3,3,4,4,3,3,3,3,3,3,3,3],temp:[5,5,5,4,4,3,3,3,4,4,5,5],crowd:[3,3,3,3,3,3,3,3,3,3,3,3]}},
  {id:1085,name:"Byron Bay",       country:"Australia",    lat:-28.639,lng:153.612, region:"Pacific",   seasonal:{wind:[3,3,3,3,3,3,3,3,3,3,3,3],swell:[3,3,4,4,4,3,3,3,3,3,3,3],temp:[5,5,5,4,4,3,3,3,4,4,5,5],crowd:[2,2,2,3,3,3,3,3,3,2,2,2]}},
  {id:1086,name:"Snapper Rocks",   country:"Australia",    lat:-28.165,lng:153.548, region:"Pacific",   seasonal:{wind:[3,3,3,3,3,3,3,3,3,3,3,3],swell:[3,3,4,4,4,3,3,3,3,3,3,3],temp:[5,5,5,4,4,3,3,3,4,4,5,5],crowd:[2,2,2,2,2,2,2,2,2,2,2,2]}},
  {id:1087,name:"Exmouth",         country:"Australia",    lat:-21.934,lng:114.126, region:"Pacific",   seasonal:{wind:[3,3,3,3,4,4,5,5,4,3,3,3],swell:[2,2,2,3,3,4,4,4,3,2,2,2],temp:[5,5,5,5,4,3,3,3,4,5,5,5],crowd:[5,5,5,5,4,4,4,4,5,5,5,5]}},

  // ===== PACIFIC — New Zealand =====
  {id:1088,name:"Raglan",          country:"New Zealand",  lat:-37.801,lng:174.882, region:"Pacific",   seasonal:{wind:[3,3,3,3,3,3,3,3,3,3,3,3],swell:[3,3,4,4,5,5,5,5,4,4,3,3],temp:[5,4,4,3,2,2,2,2,3,3,4,5],crowd:[3,3,3,4,4,4,4,4,4,3,3,3]}},
  {id:1089,name:"Mount Maunganui", country:"New Zealand",  lat:-37.631,lng:176.178, region:"Pacific",   seasonal:{wind:[3,3,3,3,3,3,3,3,3,3,3,3],swell:[3,3,4,4,4,4,4,4,4,3,3,3],temp:[5,4,4,3,2,2,2,2,3,3,4,5],crowd:[3,3,3,4,4,4,4,4,4,3,3,3]}},
  {id:1090,name:"Piha",            country:"New Zealand",  lat:-36.951,lng:174.471, region:"Pacific",   seasonal:{wind:[3,3,3,3,3,3,3,3,3,3,3,3],swell:[3,3,4,4,5,5,5,5,4,4,3,3],temp:[5,4,4,3,2,2,2,2,3,3,4,5],crowd:[3,3,3,4,4,4,4,4,4,3,3,3]}},

  // ===== PACIFIC — Fiji, Tahiti, Samoa =====
  {id:1091,name:"Cloudbreak",      country:"Fiji",         lat:-17.880,lng:177.190, region:"Pacific",   seasonal:{wind:[2,2,2,3,3,4,4,4,3,3,2,2],swell:[3,3,3,4,5,5,5,5,4,3,3,3],temp:[5,5,5,5,4,4,4,4,4,5,5,5],crowd:[4,4,4,4,3,3,3,3,4,4,4,4]}},
  {id:1092,name:"Restaurants Fiji", country:"Fiji",         lat:-17.886,lng:177.194, region:"Pacific",   seasonal:{wind:[2,2,2,3,3,4,4,4,3,3,2,2],swell:[3,3,3,4,5,5,5,5,4,3,3,3],temp:[5,5,5,5,4,4,4,4,4,5,5,5],crowd:[4,4,4,4,3,3,3,3,4,4,4,4]}},
  {id:1093,name:"Teahupoo",        country:"Tahiti",       lat:-17.856,lng:-149.256,region:"Pacific",   seasonal:{wind:[2,2,2,3,3,4,4,4,3,3,2,2],swell:[3,3,3,4,5,5,5,5,4,3,3,3],temp:[5,5,5,5,4,4,4,4,4,5,5,5],crowd:[5,5,5,4,3,3,3,3,4,5,5,5]}},
  {id:1094,name:"Papara",          country:"Tahiti",       lat:-17.730,lng:-149.392,region:"Pacific",   seasonal:{wind:[2,2,2,3,3,4,4,4,3,3,2,2],swell:[3,3,3,4,4,5,5,4,4,3,3,3],temp:[5,5,5,5,4,4,4,4,4,5,5,5],crowd:[5,5,5,5,4,4,4,4,5,5,5,5]}},
  {id:1095,name:"Apia",            country:"Samoa",        lat:-13.833,lng:-171.750,region:"Pacific",   seasonal:{wind:[2,2,2,3,3,3,3,3,3,2,2,2],swell:[3,3,3,4,4,4,4,4,3,3,3,3],temp:[5,5,5,5,5,5,5,5,5,5,5,5],crowd:[5,5,5,5,5,4,4,4,5,5,5,5]}},

  // ===== PACIFIC — Tonga, PNG =====
  {id:1096,name:"Tongatapu",       country:"Tonga",        lat:-21.178,lng:-175.198,region:"Pacific",   seasonal:{wind:[2,2,2,3,3,4,4,4,3,3,2,2],swell:[3,3,3,4,4,5,5,5,4,3,3,3],temp:[5,5,5,5,4,4,4,4,4,5,5,5],crowd:[5,5,5,5,5,5,5,5,5,5,5,5]}},
  {id:1097,name:"Kavieng",         country:"PNG",          lat:-2.574, lng:150.794, region:"Pacific",   seasonal:{wind:[2,2,2,2,3,3,3,3,3,2,2,2],swell:[3,3,3,3,3,3,3,3,3,3,3,3],temp:[5,5,5,5,5,5,5,5,5,5,5,5],crowd:[5,5,5,5,5,5,5,5,5,5,5,5]}},

  // ===== ASIA — Philippines =====
  {id:1098,name:"La Union",        country:"Philippines",  lat:16.622, lng:120.318, region:"Asia",      seasonal:{wind:[4,4,3,3,3,3,3,4,4,4,4,4],swell:[4,4,3,3,2,2,2,3,4,4,4,4],temp:[4,4,5,5,5,5,5,5,5,5,4,4],crowd:[3,3,3,4,4,4,4,4,3,3,3,3]}},
  {id:1099,name:"Baler",           country:"Philippines",  lat:15.761, lng:121.564, region:"Asia",      seasonal:{wind:[4,4,3,3,3,3,3,4,4,4,4,4],swell:[4,4,3,3,2,2,2,3,4,4,4,4],temp:[4,4,5,5,5,5,5,5,5,5,4,4],crowd:[4,4,4,4,4,4,4,4,3,3,4,4]}},

  // ===== ASIA — Japan =====
  {id:1100,name:"Shonan",          country:"Japan",        lat:35.310, lng:139.482, region:"Asia",      seasonal:{wind:[3,3,3,3,3,3,3,3,3,3,3,3],swell:[3,3,3,3,3,3,3,4,5,4,3,3],temp:[2,2,2,3,4,5,5,5,4,4,3,2],crowd:[3,3,3,3,3,2,1,1,2,3,3,3]}},
  {id:1101,name:"Chiba",           country:"Japan",        lat:35.131, lng:140.101, region:"Asia",      seasonal:{wind:[3,3,3,3,3,3,3,3,3,3,3,3],swell:[3,3,3,3,3,3,3,4,5,4,3,3],temp:[2,2,2,3,4,5,5,5,4,4,3,2],crowd:[3,3,3,3,3,2,1,1,2,3,3,3]}},
  {id:1102,name:"Miyazaki",        country:"Japan",        lat:31.911, lng:131.423, region:"Asia",      seasonal:{wind:[3,3,3,3,3,3,3,3,3,3,3,3],swell:[3,3,3,3,3,3,3,4,5,4,3,3],temp:[3,3,3,3,4,5,5,5,5,4,3,3],crowd:[4,4,4,4,4,3,3,3,3,4,4,4]}},

  // ===== ASIA — Taiwan, Vietnam, Thailand =====
  {id:1103,name:"Taitung",         country:"Taiwan",       lat:22.756, lng:121.144, region:"Asia",      seasonal:{wind:[4,4,3,3,3,3,3,3,3,4,4,4],swell:[4,4,3,3,3,3,3,3,4,4,4,4],temp:[3,3,4,4,5,5,5,5,5,4,4,3],crowd:[4,4,4,4,4,4,4,4,3,3,4,4]}},
  {id:1104,name:"Da Nang",         country:"Vietnam",      lat:16.047, lng:108.221, region:"Asia",      seasonal:{wind:[3,3,3,3,3,3,3,3,3,3,3,3],swell:[3,3,3,2,2,2,2,2,3,4,4,3],temp:[3,4,4,5,5,5,5,5,5,4,4,3],crowd:[4,4,4,4,4,4,4,4,3,3,4,4]}},
  {id:1105,name:"Mui Ne",          country:"Vietnam",      lat:10.942, lng:108.287, region:"Asia",      seasonal:{wind:[5,5,4,3,3,3,3,3,4,5,5,5],swell:[2,2,2,2,2,2,2,2,2,2,2,2],temp:[5,5,5,5,5,5,5,5,5,5,5,5],crowd:[3,3,3,4,4,4,4,4,3,3,3,3]}},
  {id:1106,name:"Phuket",          country:"Thailand",     lat:7.880,  lng:98.381,  region:"Asia",      seasonal:{wind:[3,3,3,3,3,4,4,4,3,3,3,3],swell:[2,2,2,2,3,4,4,4,3,2,2,2],temp:[5,5,5,5,5,5,5,5,5,5,5,5],crowd:[2,2,2,3,3,3,3,3,3,3,2,2]}},
  {id:1107,name:"Koh Phangan",     country:"Thailand",     lat:9.742,  lng:100.045, region:"Asia",      seasonal:{wind:[3,3,3,3,3,3,3,3,3,3,3,3],swell:[2,2,2,2,2,2,2,2,2,3,3,2],temp:[5,5,5,5,5,5,5,5,5,5,5,5],crowd:[2,2,2,3,3,3,3,3,3,3,2,2]}},

  // ===== ASIA — China, South Korea =====
  {id:1108,name:"Wanning",         country:"China",        lat:18.682, lng:109.971, region:"Asia",      seasonal:{wind:[3,3,3,3,3,3,3,3,3,3,3,3],swell:[3,3,3,3,3,3,3,4,4,4,3,3],temp:[4,4,4,5,5,5,5,5,5,5,4,4],crowd:[3,3,3,3,3,3,3,3,3,3,3,3]}},
  {id:1109,name:"Jeju Island",     country:"South Korea",  lat:33.253, lng:126.570, region:"Asia",      seasonal:{wind:[4,4,3,3,3,3,3,3,3,3,4,4],swell:[4,4,3,3,2,2,2,2,3,4,4,4],temp:[1,1,2,3,4,5,5,5,4,3,2,1],crowd:[4,4,4,4,4,3,2,2,3,4,4,4]}},

  // ===== ASIA — India =====
  {id:1110,name:"Kovalam",         country:"India",        lat:8.365,  lng:76.978,  region:"Indian",    seasonal:{wind:[3,3,3,3,4,5,5,5,4,3,3,3],swell:[3,3,3,3,4,5,5,4,3,3,3,3],temp:[5,5,5,5,5,5,5,5,5,5,5,5],crowd:[3,3,3,4,4,3,3,3,3,4,3,3]}},
  {id:1111,name:"Mulki",           country:"India",        lat:13.094, lng:74.793,  region:"Indian",    seasonal:{wind:[3,3,3,3,4,5,5,5,4,3,3,3],swell:[3,3,3,3,4,5,5,4,3,3,3,3],temp:[5,5,5,5,5,5,5,5,5,5,5,5],crowd:[4,4,4,4,3,3,3,3,4,4,4,4]}},

  // ===== AFRICA — East Africa =====
  {id:1112,name:"Tofo Beach",      country:"Mozambique",   lat:-23.749,lng:35.544,  region:"Indian",    seasonal:{wind:[3,3,3,3,4,5,5,5,4,3,3,3],swell:[3,3,3,4,5,5,5,5,4,3,3,3],temp:[5,5,5,4,4,3,3,3,4,4,5,5],crowd:[5,5,5,5,4,4,4,4,5,5,5,5]}},
  {id:1113,name:"Watamu",          country:"Kenya",        lat:-3.354, lng:40.024,  region:"Indian",    seasonal:{wind:[4,4,3,3,3,4,5,5,4,3,3,4],swell:[3,3,3,3,3,3,3,3,3,3,3,3],temp:[5,5,5,5,5,4,4,4,5,5,5,5],crowd:[4,4,4,4,4,4,4,4,4,4,4,4]}},

  // ===== AFRICA — West Africa =====
  {id:1114,name:"Takoradi",        country:"Ghana",        lat:4.897,  lng:-1.761,  region:"Africa",    seasonal:{wind:[3,3,3,3,3,3,3,3,3,3,3,3],swell:[3,3,3,3,3,3,3,3,3,3,3,3],temp:[5,5,5,5,5,5,5,5,5,5,5,5],crowd:[5,5,5,5,5,5,5,5,5,5,5,5]}},
  {id:1115,name:"Robertsport",     country:"Liberia",      lat:6.747,  lng:-11.367, region:"Africa",    seasonal:{wind:[3,3,3,3,3,3,3,3,3,3,3,3],swell:[3,3,3,3,3,3,3,3,3,3,3,3],temp:[5,5,5,5,5,5,5,5,5,5,5,5],crowd:[5,5,5,5,5,5,5,5,5,5,5,5]}},

  // ===== INDIAN OCEAN — Oman, Seychelles =====
  {id:1116,name:"Masirah Island",  country:"Oman",         lat:20.666, lng:58.807,  region:"Indian",    seasonal:{wind:[3,3,3,3,4,5,5,5,4,3,3,3],swell:[2,2,2,2,3,4,4,4,3,2,2,2],temp:[4,4,5,5,5,5,5,5,5,5,5,4],crowd:[5,5,5,5,5,4,4,4,5,5,5,5]}},
  {id:1117,name:"Mahe",            country:"Seychelles",   lat:-4.680, lng:55.492,  region:"Indian",    seasonal:{wind:[3,3,3,3,3,4,5,5,4,3,3,3],swell:[3,3,3,3,3,3,3,3,3,3,3,3],temp:[5,5,5,5,5,5,5,5,5,5,5,5],crowd:[4,4,4,4,4,4,4,4,4,4,4,4]}},

  // ===== EUROPE — Additional =====
  {id:1118,name:"Peniche Supertub",country:"Portugal",     lat:39.365, lng:-9.395,  region:"Europe",    seasonal:{wind:[3,3,3,4,4,4,4,4,3,3,3,3],swell:[5,5,4,4,3,2,2,3,4,5,5,5],temp:[3,3,3,3,4,5,5,5,4,4,3,3],crowd:[3,3,3,3,3,2,2,2,3,2,3,3]}},
  {id:1119,name:"Praia do Norte",  country:"Portugal",     lat:39.608, lng:-9.074,  region:"Europe",    seasonal:{wind:[3,3,3,4,4,4,4,4,4,3,3,3],swell:[5,5,4,4,3,2,2,2,3,4,5,5],temp:[3,3,3,3,4,4,4,4,4,3,3,3],crowd:[5,5,5,5,5,4,4,4,5,5,5,5]}},

  // ===== PACIFIC — Micronesia =====
  {id:1120,name:"Pohnpei",         country:"Micronesia",   lat:6.881,  lng:158.225, region:"Pacific",   seasonal:{wind:[2,2,2,2,3,3,3,3,3,2,2,2],swell:[3,3,3,4,4,4,4,4,3,3,3,3],temp:[5,5,5,5,5,5,5,5,5,5,5,5],crowd:[5,5,5,5,5,5,5,5,5,5,5,5]}},

  // ===== ATLANTIC — Additional =====
  {id:1121,name:"Praia do Forte",  country:"Brazil",       lat:-12.563,lng:-37.997, region:"Atlantic",  seasonal:{wind:[3,3,3,3,3,3,3,3,3,3,3,3],swell:[3,3,3,4,4,4,4,4,3,3,3,3],temp:[5,5,5,5,4,4,4,4,5,5,5,5],crowd:[3,3,3,4,4,4,4,4,4,3,3,3]}},
  {id:1122,name:"Fernando de Noronha",country:"Brazil",    lat:-3.854, lng:-32.424, region:"Atlantic",  seasonal:{wind:[4,4,3,3,3,3,3,3,3,3,3,4],swell:[4,4,3,3,3,3,3,3,3,3,4,4],temp:[5,5,5,5,5,5,5,5,5,5,5,5],crowd:[4,4,4,4,4,4,4,4,4,4,4,4]}},

  // ===== ASIA — Maldives Atolls =====
  {id:1123,name:"Huvadhoo Atoll",  country:"Maldives",     lat:0.500,  lng:73.283,  region:"Indian",    seasonal:{wind:[3,3,3,3,3,4,4,4,3,3,3,3],swell:[3,3,3,4,5,5,5,4,3,3,3,3],temp:[5,5,5,5,5,5,5,5,5,5,5,5],crowd:[4,4,4,4,3,3,3,3,4,4,4,4]}},

  // ===== PACIFIC — Hawaii additional =====
  {id:1124,name:"Sunset Beach",    country:"Hawaii USA",   lat:21.674, lng:-158.044,region:"Pacific",   seasonal:{wind:[3,3,4,4,5,5,5,5,4,4,3,3],swell:[5,5,4,3,2,2,2,2,3,4,5,5],temp:[4,4,4,5,5,5,5,5,5,5,4,4],crowd:[2,2,3,3,4,4,4,4,3,3,2,2]}},
  {id:1125,name:"Honolua Bay",     country:"Hawaii USA",   lat:21.014, lng:-156.638,region:"Pacific",   seasonal:{wind:[3,3,4,4,5,5,5,5,5,4,3,3],swell:[5,5,4,3,2,2,2,2,3,4,5,5],temp:[4,4,4,4,5,5,5,5,5,5,4,4],crowd:[3,3,3,4,4,5,5,5,4,3,3,3]}},

  // ===== N.AMERICA — Pacific Northwest =====
  {id:1126,name:"Tofino",          country:"Canada",       lat:49.153, lng:-125.907,region:"Pacific",   seasonal:{wind:[3,3,3,3,3,3,3,3,3,3,3,3],swell:[5,5,4,4,3,2,2,3,4,5,5,5],temp:[2,2,2,2,3,3,4,4,3,3,2,2],crowd:[4,4,4,4,4,3,3,3,4,4,4,4]}},
  {id:1127,name:"Seaside OR",      country:"USA",          lat:45.993, lng:-123.922,region:"Pacific",   seasonal:{wind:[3,3,3,3,3,3,3,3,3,3,3,3],swell:[5,5,4,4,3,2,2,3,4,5,5,5],temp:[2,2,2,2,3,3,4,4,3,3,2,2],crowd:[4,4,4,4,4,3,3,3,4,4,4,4]}},

  // ===== S.AMERICA — Additional =====
  {id:1128,name:"Mar del Plata",   country:"Argentina",    lat:-38.005,lng:-57.542, region:"S.America", seasonal:{wind:[3,3,3,3,3,3,3,3,3,3,3,3],swell:[3,3,3,4,4,4,4,4,3,3,3,3],temp:[5,5,4,3,2,1,1,2,2,3,4,5],crowd:[3,3,3,4,4,4,4,4,4,3,3,3]}},
  {id:1129,name:"Galapagos",       country:"Ecuador",      lat:-0.953, lng:-89.617, region:"Pacific",   seasonal:{wind:[3,3,3,3,3,3,3,3,3,3,3,3],swell:[3,3,3,3,3,3,3,3,3,3,3,3],temp:[5,5,5,5,4,3,3,3,3,4,5,5],crowd:[5,5,5,5,5,5,5,5,5,5,5,5]}},

  // ===== EUROPE — Additional Mediterranean =====
  {id:1130,name:"Cagliari",        country:"Italy",        lat:39.224, lng:9.122,   region:"Mediterranean",seasonal:{wind:[3,3,3,3,3,4,4,4,3,3,3,3],swell:[3,3,2,2,1,1,1,1,2,3,3,3],temp:[3,3,3,4,5,5,5,5,5,4,3,3],crowd:[4,4,4,4,4,3,2,2,3,4,4,4]}},
  {id:1131,name:"Tarragona",       country:"Spain",        lat:41.119, lng:1.245,   region:"Mediterranean",seasonal:{wind:[3,3,3,3,3,3,3,3,3,3,3,3],swell:[3,3,2,2,1,1,1,1,2,3,3,3],temp:[2,2,3,4,5,5,5,5,5,4,3,2],crowd:[4,4,4,4,3,2,1,1,3,4,4,4]}},
  {id:1132,name:"Essaouira Sidi",  country:"Morocco",      lat:31.490, lng:-9.780,  region:"Africa",    seasonal:{wind:[3,3,4,4,5,5,5,5,4,3,3,3],swell:[4,4,3,3,2,2,2,2,3,3,4,4],temp:[3,3,4,4,5,5,5,5,5,4,3,3],crowd:[4,4,4,4,3,3,3,3,4,4,4,4]}},

  // ===== ASIA — Myanmar, Cambodia =====
  {id:1133,name:"Ngapali Beach",   country:"Myanmar",      lat:18.389, lng:94.323,  region:"Asia",      seasonal:{wind:[2,2,2,3,3,4,4,4,3,2,2,2],swell:[2,2,2,2,3,4,4,4,3,2,2,2],temp:[5,5,5,5,5,5,5,5,5,5,5,5],crowd:[5,5,5,5,5,5,5,5,5,5,5,5]}},
  {id:1134,name:"Sihanoukville",   country:"Cambodia",     lat:10.627, lng:103.523, region:"Asia",      seasonal:{wind:[3,3,3,3,3,4,4,4,3,3,3,3],swell:[2,2,2,2,2,3,3,3,2,2,2,2],temp:[5,5,5,5,5,5,5,5,5,5,5,5],crowd:[4,4,4,4,4,4,4,4,4,4,4,4]}},

  // ===== AFRICA — Tunisia, Canary additional =====
  {id:1135,name:"Djerba",          country:"Tunisia",      lat:33.800, lng:10.864,  region:"Mediterranean",seasonal:{wind:[3,3,3,3,4,5,5,5,4,3,3,3],swell:[2,2,2,2,1,1,1,1,2,2,2,2],temp:[3,3,3,4,5,5,5,5,5,4,3,3],crowd:[4,4,4,4,4,3,2,2,3,4,4,4]}},

  // ===== PACIFIC — Additional =====
  {id:1136,name:"Sigatoka",        country:"Fiji",         lat:-18.140,lng:177.506, region:"Pacific",   seasonal:{wind:[2,2,2,3,3,4,4,4,3,3,2,2],swell:[3,3,3,4,5,5,5,5,4,3,3,3],temp:[5,5,5,5,4,4,4,4,4,5,5,5],crowd:[5,5,5,5,4,4,4,4,5,5,5,5]}},
  {id:1137,name:"Rarotonga",       country:"Cook Islands", lat:-21.236,lng:-159.777,region:"Pacific",   seasonal:{wind:[2,2,2,3,3,4,4,4,3,3,2,2],swell:[3,3,3,4,4,5,5,5,4,3,3,3],temp:[5,5,5,5,4,4,4,4,4,5,5,5],crowd:[5,5,5,5,5,5,5,5,5,5,5,5]}},
  {id:1138,name:"Vanuatu",         country:"Vanuatu",      lat:-17.734,lng:168.322, region:"Pacific",   seasonal:{wind:[2,2,2,3,3,4,4,4,3,3,2,2],swell:[3,3,3,3,4,4,4,4,3,3,3,3],temp:[5,5,5,5,4,4,4,4,4,5,5,5],crowd:[5,5,5,5,5,5,5,5,5,5,5,5]}},

  // ===== N.AMERICA — Great Lakes & additional =====
  {id:1139,name:"Sheboygan",       country:"USA",          lat:43.751, lng:-87.714, region:"Atlantic",  seasonal:{wind:[3,3,3,3,3,3,3,3,3,4,4,3],swell:[3,3,2,2,2,2,2,2,3,4,4,3],temp:[1,1,1,2,3,4,5,5,4,3,2,1],crowd:[5,5,5,5,4,4,3,3,4,4,5,5]}},

  // ===== INDIAN OCEAN — Additional =====
  {id:1140,name:"Soma Bay",        country:"Egypt",        lat:26.852, lng:33.970,  region:"Indian",    seasonal:{wind:[4,4,4,4,5,5,5,5,4,4,4,4],swell:[2,2,2,2,2,2,2,2,2,2,2,2],temp:[4,4,5,5,5,5,5,5,5,5,4,4],crowd:[3,3,3,3,3,3,3,3,4,3,3,3]}},
  {id:1141,name:"Dahab",           country:"Egypt",        lat:28.501, lng:34.515,  region:"Indian",    seasonal:{wind:[3,3,3,4,4,5,5,5,4,3,3,3],swell:[2,2,2,2,2,2,2,2,2,2,2,2],temp:[3,3,4,5,5,5,5,5,5,5,4,3],crowd:[3,3,3,3,3,3,3,3,4,3,3,3]}},

  // ===== EUROPE — Additional =====
  {id:1142,name:"Guincho",         country:"Portugal",     lat:38.729, lng:-9.474,  region:"Europe",    seasonal:{wind:[4,4,4,4,5,5,5,5,4,4,4,4],swell:[4,4,3,3,2,2,2,2,3,4,4,4],temp:[3,3,3,4,4,5,5,5,4,4,3,3],crowd:[3,3,3,3,2,2,1,1,2,3,3,3]}},
  {id:1143,name:"Anglet",          country:"France",       lat:43.504, lng:-1.535,  region:"Europe",    seasonal:{wind:[2,2,3,3,3,3,3,3,3,3,2,2],swell:[4,4,3,3,3,2,2,3,4,5,4,4],temp:[2,2,3,3,4,5,5,5,4,3,3,2],crowd:[4,4,4,4,3,2,1,1,2,3,4,4]}},
  {id:1144,name:"Croyde",          country:"UK",           lat:51.133, lng:-4.232,  region:"Europe",    seasonal:{wind:[3,3,3,3,3,3,3,3,3,3,3,3],swell:[5,5,4,3,3,2,2,3,4,5,5,5],temp:[2,2,2,3,3,4,4,4,3,3,2,2],crowd:[4,4,4,4,3,2,1,1,2,4,4,4]}},
  {id:1145,name:"Porthleven",      country:"UK",           lat:50.083, lng:-5.316,  region:"Europe",    seasonal:{wind:[3,3,3,3,3,3,3,3,3,3,3,3],swell:[5,5,4,3,3,2,2,3,4,5,5,5],temp:[2,2,2,3,3,4,4,4,3,3,2,2],crowd:[4,4,4,5,5,4,4,4,5,4,4,4]}},

  // ===== CARIBBEAN — Additional =====
  {id:1146,name:"Soup Bowl",       country:"Barbados",     lat:13.216, lng:-59.536, region:"Caribbean", seasonal:{wind:[4,4,4,4,4,4,4,3,3,3,3,4],swell:[4,4,3,3,2,2,2,2,3,3,4,4],temp:[5,5,5,5,5,5,5,5,5,5,5,5],crowd:[3,3,3,3,4,4,4,4,4,4,3,3]}},
  {id:1147,name:"Guadeloupe",      country:"Guadeloupe",   lat:16.265, lng:-61.551, region:"Caribbean", seasonal:{wind:[4,4,4,4,4,4,4,3,3,3,3,4],swell:[3,3,3,3,2,2,2,2,3,3,3,3],temp:[5,5,5,5,5,5,5,5,5,5,5,5],crowd:[4,4,4,4,4,3,3,3,4,4,4,4]}},

  // ===== PACIFIC — Additional Australia =====
  {id:1148,name:"Torquay",         country:"Australia",    lat:-38.330,lng:144.327, region:"Pacific",   seasonal:{wind:[3,3,3,3,3,3,3,3,3,3,3,3],swell:[3,3,4,5,5,4,4,4,4,4,3,3],temp:[5,5,4,3,2,2,2,2,3,3,4,5],crowd:[3,3,3,3,3,3,3,3,3,3,3,3]}},
  {id:1149,name:"Lennox Head",     country:"Australia",    lat:-28.790,lng:153.590, region:"Pacific",   seasonal:{wind:[3,3,3,3,3,3,3,3,3,3,3,3],swell:[3,3,4,4,4,3,3,3,3,3,3,3],temp:[5,5,5,4,4,3,3,3,4,4,5,5],crowd:[3,3,3,3,3,3,3,3,3,3,3,3]}},
  {id:1150,name:"Manly Beach",     country:"Australia",    lat:-33.797,lng:151.288, region:"Pacific",   seasonal:{wind:[3,3,3,3,3,3,3,3,3,3,3,3],swell:[3,3,4,4,4,3,3,3,3,3,3,3],temp:[5,5,4,4,3,2,2,2,3,4,4,5],crowd:[2,2,2,2,2,2,2,2,2,2,2,2]}},
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
