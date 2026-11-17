import { NextResponse } from "next/server";
import { asUser } from "@/lib/bridge";
import { limited } from "@/lib/limit";
const OPS = new Set(["onboarding", "message", "invite", "removeUser"]);
/** Actions from portal pages, made as the signed-in user. */
export async function POST(req: Request) {
  const b = await req.json().catch(() => ({}));
  const op = String(b.op || "");
  if (!OPS.has(op)) return NextResponse.json({ error: "Unknown action." }, { status: 400 });
  if (op === "message" && limited(req, "message", 10, 60 * 60_000)) return NextResponse.json({ error: "Too many messages in a short time. Please try again later." }, { status: 429 });
  const { op: _o, uid: _u, sv: _s, ...payload } = b;
  const r = await asUser(op, payload);
  if (!r) return NextResponse.json({ error: "Session ended." }, { status: 401 });
  return NextResponse.json(r.body, { status: r.status });
}
