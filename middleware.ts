import { NextResponse, type NextRequest } from "next/server";

/** Signed-out visitors only see the sign-in pages. (The session itself is verified server-side on every page.) */
const OPEN = ["/login", "/activate", "/reset", "/forgot", "/api/auth/", "/favicon.png", "/_next/"];
export function middleware(req: NextRequest) {
  const p = req.nextUrl.pathname;
  if (OPEN.some((o) => p === o || p.startsWith(o))) return NextResponse.next();
  if (!req.cookies.get("vcp_session")?.value) {
    if (p.startsWith("/api/")) return NextResponse.json({ error: "Session ended." }, { status: 401 });
    const u = req.nextUrl.clone(); u.pathname = "/login"; u.search = ""; return NextResponse.redirect(u);
  }
  return NextResponse.next();
}
export const config = { matcher: ["/((?!_next/static|_next/image).*)"] };
