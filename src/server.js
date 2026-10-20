import path from 'node:path';
import { fileURLToPath } from 'node:url';
import express from 'express';
import { fetchWeather, describeCode } from './weather.js';
import { getCached } from './cache.js';

const PORT = process.env.PORT ?? 3000;
const PUBLIC_DIR = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'public');

const app = express();

app.use(express.static(PUBLIC_DIR));

function toPayload({ data, fetchedAt, fromCache }) {
  return {
    fetchedAt,
    fromCache,
    cities: data.map((city) => ({
      ...city,
      current: { ...city.current, condition: describeCode(city.current.weather_code) },
      tomorrow: { ...city.tomorrow, condition: describeCode(city.tomorrow.weather_code) },
    })),
  };
}

app.get('/api/weather', async (req, res, next) => {
  try {
    res.json(toPayload(await getCached(fetchWeather)));
  } catch (err) {
    next(err);
  }
});

app.post('/api/refresh', async (req, res, next) => {
  try {
    res.json(toPayload(await getCached(fetchWeather, { force: true })));
  } catch (err) {
    next(err);
  }
});

app.use('/api', (req, res) => {
  res.status(404).json({ error: 'Recurso no encontrado' });
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(502).json({ error: err.message });
});

app.listen(PORT, () => {
  console.log(`Weather viewer en http://localhost:${PORT}`);
});
