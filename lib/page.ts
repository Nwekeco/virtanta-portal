import "server-only";
import { redirect } from "next/navigation";
import { asUser, type Me } from "./bridge";

/** Loads the signed-in client's account, or sends them to sign in. */
export async function requireMe(): Promise<Me> {
  const r = await asUser("me");
  if (!r) redirect("/login?ended=1");
  if (!r.ok) throw new Error(r.body?.error || "Unable to load your account.");
  return r.body as Me;
}
export const fmtDate = (s: string | null | undefined) => (s ? new Date(s).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }) : "—");
export const tone = (s: string) => (["ACTIVE", "PAID", "COMPLETED"].includes(s) ? "ok" : ["SUSPENDED", "OVERDUE", "CANCELED"].includes(s) ? "bad" : ["OPEN", "PARTIALLY_PAID", "PROVISIONING"].includes(s) ? "warn" : "g");
export const human = (s: string) => s.replace(/_/g, " ").toLowerCase().replace(/^\w/, (c) => c.toUpperCase());
