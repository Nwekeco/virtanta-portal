import crypto from "node:crypto";
import { cookies } from "next/headers";

export const COOKIE = "vcp_session";
const HOURS = 12;
export type Sess = { uid: string; sv: number; exp: number };

function secret() {
  const s = process.env.PORTAL_SESSION_SECRET || "";
  if (s.length < 32) throw new Error("PORTAL_SESSION_SECRET is not set");
  return s;
}
const sign = (data: string) => crypto.createHmac("sha256", secret()).update(data).digest("base64url");

export function encode(uid: string, sv: number) {
  const data = Buffer.from(JSON.stringify({ uid, sv, exp: Date.now() + HOURS * 3_600_000 })).toString("base64url");
  return `${data}.${sign(data)}`;
}
export function decode(v: string | undefined): Sess | null {
  if (!v) return null;
  const [data, mac] = v.split(".");
  if (!data || !mac) return null;
  const want = Buffer.from(sign(data)), got = Buffer.from(mac);
  if (want.length !== got.length || !crypto.timingSafeEqual(want, got)) return null;
  try { const s = JSON.parse(Buffer.from(data, "base64url").toString()); return s.exp > Date.now() && typeof s.uid === "string" ? s : null; } catch { return null; }
}
export async function readSession() { return decode((await cookies()).get(COOKIE)?.value); }
export const cookieOpts = { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax" as const, path: "/", maxAge: HOURS * 3600 };
