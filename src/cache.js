const TTL_MS = Number(process.env.CACHE_TTL_MINUTES ?? 10) * 60 * 1000;

let entry = null;

export async function getCached(fetcher, { force = false } = {}) {
  const fresh = entry && Date.now() - entry.fetchedAt < TTL_MS;
  if (fresh && !force) {
    return { ...entry, fromCache: true };
  }

  // Si la consulta falla, `entry` queda intacto y el error se propaga.
  const data = await fetcher();
  entry = { data, fetchedAt: Date.now() };
  return { ...entry, fromCache: false };
}
