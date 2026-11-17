const hits = new Map<string, number[]>();
/** Small in-process rate limit (per IP + key). */
export function limited(req: Request, key: string, max: number, windowMs: number) {
  const ip = (req.headers.get("x-forwarded-for") || "").split(",")[0].trim() || "local";
  const k = `${key}:${ip}`, now = Date.now(), recent = (hits.get(k) || []).filter((t) => now - t < windowMs);
  hits.set(k, [...recent, now]);
  return recent.length >= max;
}
