# Weather viewer

Muestra en una tabla HTML el clima actual y el de mañana para Valparaíso y Santiago, usando la API gratuita de [Open-Meteo](https://open-meteo.com/) (no requiere API key). Las temperaturas se muestran en °C.

## Requisitos

- Node.js 18 o superior (usa `fetch` nativo).
- Dependencias: [Express](https://expressjs.com/) (`npm install`).

## Uso

```bash
npm install
npm start
```

Luego abre <http://localhost:3000>.

El botón **Refrescar** descarta la caché y vuelve a consultar la API.

## Configuración

| Variable             | Por defecto | Descripción                            |
| -------------------- | ----------- | -------------------------------------- |
| `PORT`               | `3000`      | Puerto del servidor                    |
| `CACHE_TTL_MINUTES`  | `10`        | Minutos que se conservan los datos     |

## Estructura

- `src/server.js`: servidor Express (sirve `public/` y expone `GET /api/weather`, `POST /api/refresh`).
- `src/weather.js`: cliente de Open-Meteo y descripción de códigos WMO.
- `src/cache.js`: caché en memoria con TTL.
- `public/index.html`: página con la tabla y estilo sencillo; consume la API JSON.
