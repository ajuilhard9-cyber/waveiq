export async function getWeather(lat, lng) {
  const r = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&current=temperature_2m,wind_speed_10m,wind_direction_10m,wind_gusts_10m,uv_index,apparent_temperature&hourly=wind_speed_10m,wind_gusts_10m&forecast_days=2&wind_speed_unit=kn&timezone=auto`);
  if (!r.ok) throw new Error('Weather unavailable');
  return r.json();
}

export async function getMarine(lat, lng) {
  try {
    const r = await fetch(`https://marine-api.open-meteo.com/v1/marine?latitude=${lat}&longitude=${lng}&current=wave_height,wave_period,swell_wave_height,sea_surface_temperature&hourly=wave_height&timezone=auto&forecast_days=2`);
    if (!r.ok) return null;
    return r.json();
  } catch { return null; }
}
