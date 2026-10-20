import { describeCode } from './weather.js';

const escapeHtml = (value) =>
  String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

const withUnit = (value, unit) => `${value} ${unit}`;

const formatTime = (ms) =>
  new Date(ms).toLocaleTimeString('es-CL', {
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'America/Santiago',
  });

const STYLES = `
  body { font-family: system-ui, sans-serif; margin: 0 auto; padding: 24px 16px; max-width: 1000px; color: #1a1a1a; background: #fafafa; }
  h1 { margin-top: 0; }
  .table-wrap { overflow-x: auto; }
  table { border-collapse: collapse; width: 100%; background: #fff; }
  th, td { border: 1px solid #d8d8d8; padding: 8px 12px; text-align: left; white-space: nowrap; }
  thead th { background: #eef2f6; }
  th[scope="rowgroup"] { text-align: center; }
  .meta { display: flex; align-items: center; gap: 12px; margin-top: 16px; color: #555; }
  button { padding: 6px 14px; font: inherit; cursor: pointer; }
  .error { color: #b00020; }
`;

function layout(body) {
  return `<!doctype html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Clima en Valparaíso y Santiago</title>
  <style>${STYLES}</style>
</head>
<body>
${body}
</body>
</html>`;
}

function row(city) {
  const { name, units, current, tomorrow } = city;
  const t = units.current.temperature_2m;
  const d = units.daily;

  return `<tr>
      <th scope="row">${escapeHtml(name)}</th>
      <td>${escapeHtml(describeCode(current.weather_code))}</td>
      <td>${escapeHtml(withUnit(current.temperature_2m, t))}</td>
      <td>${escapeHtml(withUnit(current.apparent_temperature, units.current.apparent_temperature))}</td>
      <td>${escapeHtml(withUnit(current.relative_humidity_2m, units.current.relative_humidity_2m))}</td>
      <td>${escapeHtml(withUnit(current.wind_speed_10m, units.current.wind_speed_10m))}</td>
      <td>${escapeHtml(describeCode(tomorrow.weather_code))}</td>
      <td>${escapeHtml(withUnit(tomorrow.temperature_2m_min, d.temperature_2m_min))} / ${escapeHtml(withUnit(tomorrow.temperature_2m_max, d.temperature_2m_max))}</td>
      <td>${escapeHtml(withUnit(tomorrow.precipitation_probability_max, d.precipitation_probability_max))}</td>
      <td>${escapeHtml(withUnit(tomorrow.precipitation_sum, d.precipitation_sum))}</td>
    </tr>`;
}

export function renderPage({ data, fetchedAt, fromCache }) {
  const source = fromCache ? 'desde caché' : 'recién consultado';

  return layout(`<h1>Clima en Valparaíso y Santiago</h1>
<div class="table-wrap">
<table>
  <thead>
    <tr>
      <th rowspan="2">Ciudad</th>
      <th colspan="5" scope="rowgroup">Ahora</th>
      <th colspan="4" scope="rowgroup">Mañana</th>
    </tr>
    <tr>
      <th>Condición</th><th>Temperatura</th><th>Sensación</th><th>Humedad</th><th>Viento</th>
      <th>Condición</th><th>Mín / Máx</th><th>Prob. lluvia</th><th>Precipitación</th>
    </tr>
  </thead>
  <tbody>
    ${data.map(row).join('\n    ')}
  </tbody>
</table>
</div>
<div class="meta">
  <span>Actualizado a las ${formatTime(fetchedAt)} (${source})</span>
  <form method="post" action="/refresh"><button type="submit">Refrescar</button></form>
</div>`);
}

export function renderError(message) {
  return layout(`<h1>Clima en Valparaíso y Santiago</h1>
<p class="error">No se pudo obtener el clima: ${escapeHtml(message)}</p>
<form method="post" action="/refresh"><button type="submit">Reintentar</button></form>`);
}
