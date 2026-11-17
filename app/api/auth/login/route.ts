import { NextResponse } from "next/server";
import { bridge } from "@/lib/bridge";
import { COOKIE, cookieOpts, encode } from "@/lib/session";
import { limited } from "@/lib/limit";
export async function POST(req: Request) {
  if (limited(req, "login", 10, 10 * 60_000)) return NextResponse.json({ error: "Too many attempts. Try again in a few minutes." }, { status: 429 });
  const b = await req.json().catch(() => ({}));
  const r = await bridge("login", { email: String(b.email || ""), password: String(b.password || "") });
  if (!r.ok) return NextResponse.json({ error: r.body?.error || "Sign-in failed." }, { status: r.status === 429 ? 429 : 401 });
  const res = NextResponse.json({ ok: true });
  res.cookies.set(COOKIE, encode(r.body.user.id, r.body.user.sv), cookieOpts);
  return res;
}
