import { NextResponse } from "next/server";
import { bridge } from "@/lib/bridge";
import { limited } from "@/lib/limit";
export async function POST(req: Request) {
  if (limited(req, "forgot", 5, 30 * 60_000)) return NextResponse.json({ error: "Too many requests. Try again later." }, { status: 429 });
  const b = await req.json().catch(() => ({}));
  await bridge("requestReset", { email: String(b.email || "") }).catch(() => null);
  return NextResponse.json({ ok: true });
}
