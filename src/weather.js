const API_URL = 'https://api.open-meteo.com/v1/forecast';

export const CITIES = [
  { name: 'Valparaíso', latitude: -33.0472, longitude: -71.6127 },
  { name: 'Santiago', latitude: -33.4489, longitude: -70.6693 },
];

const CURRENT_FIELDS = [
  'temperature_2m',
  'apparent_temperature',
  'relative_humidity_2m',
  'precipitation',
  'wind_speed_10m',
  'weather_code',
];

const DAILY_FIELDS = [
  'weather_code',
  'temperature_2m_max',
  'temperature_2m_min',
  'precipitation_probability_max',
  'precipitation_sum',
];

const WEATHER_CODES = {
  0: 'Despejado',
  1: 'Mayormente despejado',
  2: 'Parcialmente nublado',
  3: 'Nublado',
  45: 'Niebla',
  48: 'Niebla con escarcha',
  51: 'Llovizna ligera',
  53: 'Llovizna moderada',
  55: 'Llovizna intensa',
  56: 'Llovizna helada ligera',
  57: 'Llovizna helada intensa',
  61: 'Lluvia ligera',
  63: 'Lluvia moderada',
  65: 'Lluvia intensa',
  66: 'Lluvia helada ligera',
  67: 'Lluvia helada intensa',
  71: 'Nieve ligera',
  73: 'Nieve moderada',
  75: 'Nieve intensa',
  77: 'Granos de nieve',
  80: 'Chubascos ligeros',
  81: 'Chubascos moderados',
  82: 'Chubascos violentos',
  85: 'Chubascos de nieve ligeros',
  86: 'Chubascos de nieve intensos',
  95: 'Tormenta eléctrica',
  96: 'Tormenta con granizo ligero',
  99: 'Tormenta con granizo fuerte',
};

export function describeCode(code) {
  return WEATHER_CODES[code] ?? `Código ${code}`;
}

export async function fetchWeather() {
  const params = new URLSearchParams({
    latitude: CITIES.map((c) => c.latitude).join(','),
    longitude: CITIES.map((c) => c.longitude).join(','),
    current: CURRENT_FIELDS.join(','),
    daily: DAILY_FIELDS.join(','),
    timezone: 'America/Santiago',
    forecast_days: '2',
    temperature_unit: 'celsius',
  });

  const res = await fetch(`${API_URL}?${params}`);
  if (!res.ok) {
    throw new Error(`Open-Meteo respondió ${res.status} ${res.statusText}`);
  }

  const body = await res.json();
  // Con varias coordenadas la API devuelve un arreglo; con una sola, un objeto.
  const results = Array.isArray(body) ? body : [body];

  return results.map((r, i) => ({
    name: CITIES[i].name,
    units: { current: r.current_units, daily: r.daily_units },
    current: r.current,
    tomorrow: Object.fromEntries(DAILY_FIELDS.map((f) => [f, r.daily[f][1]])),
  }));
}
