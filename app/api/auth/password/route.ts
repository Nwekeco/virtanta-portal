import { NextResponse } from "next/server";
import { bridge } from "@/lib/bridge";
import { COOKIE, cookieOpts, encode } from "@/lib/session";
import { limited } from "@/lib/limit";
/** Sets a password from an invitation (kind "invite") or a reset link (kind "reset"), then signs the person in. */
export async function POST(req: Request) {
  if (limited(req, "password", 10, 10 * 60_000)) return NextResponse.json({ error: "Too many attempts." }, { status: 429 });
  const b = await req.json().catch(() => ({}));
  if (String(b.password || "") !== String(b.confirm || "")) return NextResponse.json({ error: "The two passwords don't match." }, { status: 422 });
  const r = await bridge(b.kind === "reset" ? "reset" : "activate", { token: String(b.token || ""), password: String(b.password || "") });
  if (!r.ok) return NextResponse.json({ error: r.body?.error || "That didn't work." }, { status: r.status });
  const res = NextResponse.json({ ok: true });
  res.cookies.set(COOKIE, encode(r.body.user.id, r.body.user.sv), cookieOpts);
  return res;
}
