export async function getWeather(lat, lng) {
  const r = await fetch(
    `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}` +
    `&current=temperature_2m,apparent_temperature,wind_speed_10m,wind_direction_10m,wind_gusts_10m,uv_index` +
    `&hourly=wind_speed_10m,wind_gusts_10m,wind_direction_10m,temperature_2m` +
    `&daily=wind_speed_10m_max,wind_gusts_10m_max,temperature_2m_max,temperature_2m_min,sunrise,sunset,precipitation_sum` +
    `&wind_speed_unit=kn&timezone=auto&forecast_days=7`
  );
  if (!r.ok) throw new Error('Weather unavailable');
  return r.json();
}

export async function getMarine(lat, lng) {
  try {
    const r = await fetch(
      `https://marine-api.open-meteo.com/v1/marine?latitude=${lat}&longitude=${lng}` +
      `&current=wave_height,wave_period,wave_direction,swell_wave_height,swell_wave_direction,swell_wave_period,sea_surface_temperature` +
      `&hourly=wave_height,wave_period,wave_direction,swell_wave_height,swell_wave_direction` +
      `&daily=wave_height_max,wave_period_max,swell_wave_height_max` +
      `&timezone=auto&forecast_days=7`
    );
    if (!r.ok) return null;
    return r.json();
  } catch { return null; }
}
