import "server-only";

/** Orders placed by the Virtanta team in CommerceOps (ops.virtanta.com), read server to server for this client only. */
export async function commerceOps(reference: string | undefined, params: Record<string, string> = {}) {
  const base = (process.env.COMMERCEOPS_URL || "https://ops.virtanta.com").replace(/\/$/, ""), secret = process.env.COMMERCEOPS_PORTAL_SECRET || "";
  if (!reference || secret.length < 32) return { ok: false as const, body: null };
  const q = new URLSearchParams({ ref: reference, ...params });
  try {
    const r = await fetch(`${base}/api/portal/orders?${q}`, { cache: "no-store", signal: AbortSignal.timeout(15000), headers: { authorization: `Bearer ${secret}` } });
    return { ok: r.ok, status: r.status, body: r.ok ? await r.json() : null };
  } catch { return { ok: false as const, body: null }; }
}
export const orderTone = (k: string) => (k === "synced" ? "ok" : ["exception", "hold"].includes(k) ? "bad" : k === "cancelled" ? "g" : "warn");
