# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- `npm install` — install dependencies (only Express).
- `npm start` — run the server (`node src/server.js`) at http://localhost:3000.
- There is no build, lint, or test setup.

Env vars: `PORT` (default 3000), `CACHE_TTL_MINUTES` (default 10).

## Architecture

Small ESM (`"type": "module"`, Node >=18, native `fetch`) Express app that shows current + tomorrow weather for Valparaíso and Santiago from Open-Meteo (no API key). The UI and user-facing strings are in Spanish.

- `src/server.js` — Express app. Serves `public/` statically and exposes `GET /api/weather` and `POST /api/refresh`. Both go through `toPayload`, which adds a Spanish `condition` string (via `describeCode`) to `current` and `tomorrow` for each city. Unknown `/api/*` routes return JSON 404; upstream errors return 502 via the error handler.
- `src/cache.js` — single in-memory cache entry with TTL. `getCached(fetcher, { force })`: `force: true` (used by `/api/refresh`) bypasses the TTL. If the fetch fails, the previous entry is kept and the error propagates.
- `src/weather.js` — Open-Meteo client (`fetchWeather`), the `CITIES` list (add cities here), requested field lists, and the WMO weather-code → Spanish description map.
- `public/index.html` — single-page frontend (table + Refrescar button) consuming the JSON API.

## Git conventions

Commits follow the project skill in `.claude/skills/commit/SKILL.md` (use it whenever committing): title `[Feat|Bugfix|Refactor|Test|Doc|Design] Mensaje breve`, body containing only a "Cambios" list and a "Razones" list, in Spanish. Never stage files yourself; stop if there are unstaged changes.
