import http from 'node:http';
import { fetchWeather } from './weather.js';
import { getCached } from './cache.js';
import { renderPage, renderError } from './render.js';

const PORT = process.env.PORT ?? 3000;

function send(res, status, html, headers = {}) {
  res.writeHead(status, { 'Content-Type': 'text/html; charset=utf-8', ...headers });
  res.end(html);
}

async function showWeather(res, { force = false } = {}) {
  try {
    const result = await getCached(fetchWeather, { force });
    send(res, 200, renderPage(result));
  } catch (err) {
    send(res, 502, renderError(err.message));
  }
}

const server = http.createServer(async (req, res) => {
  const { pathname } = new URL(req.url, `http://${req.headers.host}`);

  if (pathname === '/' && req.method === 'GET') {
    return showWeather(res);
  }

  if (pathname === '/refresh' && req.method === 'POST') {
    try {
      await getCached(fetchWeather, { force: true });
      res.writeHead(303, { Location: '/' });
      return res.end();
    } catch (err) {
      return send(res, 502, renderError(err.message));
    }
  }

  send(res, 404, renderError('Página no encontrada'));
});

server.listen(PORT, () => {
  console.log(`Weather viewer en http://localhost:${PORT}`);
});
