import "server-only";
import { readSession } from "./session";

/** Calls VirtantPay's client-portal bridge. All client data comes from VirtantPay (and the CPQ through it). */
export async function bridge(op: string, payload: Record<string, unknown> = {}) {
  const base = (process.env.VIRTANTPAY_URL || "https://pay.virtanta.com").replace(/\/$/, "");
  const res = await fetch(`${base}/api/internal/client-portal`, { method: "POST", cache: "no-store", signal: AbortSignal.timeout(20000),
    headers: { authorization: `Bearer ${process.env.VIRTANTA_PORTAL_BRIDGE_SECRET || ""}`, "content-type": "application/json" },
    body: JSON.stringify({ op, ...payload }) });
  let body: any = {}; try { body = await res.json(); } catch { body = { error: "Unexpected response." }; }
  return { status: res.status, ok: res.ok, body };
}

/** Same, as the signed-in user. Returns null when the session has ended. */
export async function asUser(op: string, payload: Record<string, unknown> = {}) {
  const s = await readSession();
  if (!s) return null;
  const r = await bridge(op, { ...payload, uid: s.uid, sv: s.sv });
  return r.status === 401 ? null : r;
}

export type Me = {
  user: { id: string; email: string; name: string | null; role: string; onboarding: { completed: string[]; dismissed: boolean } | null };
  client: { reference?: string; company: string; market: string; currency: string; hasVirtantPay: boolean };
  modules: string[];
  services: { reference: string; title: string; status: string; currency: string; monthly: string; nextInvoiceAt: string | null; activatedAt: string | null;
    trial: { state: string | null; endsAt: string | null; days: number; continueUrl: string | null } | null;
    items: { sku: string; label: string; qty: string; unit: string; kind: string; total: string }[];
    numbers: { kind: string; number: string }[]; setup: { done: number; total: number } }[];
  team: { id: string; email: string; name: string | null; role: string; status: string; lastLoginAt: string | null }[];
};
