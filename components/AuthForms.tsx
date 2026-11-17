"use client";
import { useEffect, useState } from "react";

function Card({ title, sub, children }: { title: string; sub?: string; children: React.ReactNode }) {
  return <main className="auth"><section className="authcard">
    <div className="brand"><img src="/favicon.png" alt=""/><span><b>Virtanta</b><small>Client portal</small></span></div>
    <h1>{title}</h1>{sub && <p className="muted" style={{ margin: "0 0 18px" }}>{sub}</p>}{children}</section></main>;
}
async function post(url: string, body: unknown) {
  const r = await fetch(url, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(body) });
  return { ok: r.ok, j: await r.json().catch(() => ({})) };
}

export function Login() {
  const [email, setEmail] = useState(""), [password, setPassword] = useState(""), [err, setErr] = useState(""), [busy, setBusy] = useState(false), [ended, setEnded] = useState(false);
  useEffect(() => { setEnded(new URLSearchParams(location.search).get("ended") === "1"); }, []);
  async function go(e: React.FormEvent) { e.preventDefault(); setBusy(true); setErr(""); const { ok, j } = await post("/api/auth/login", { email, password }); setBusy(false);
    if (ok) location.href = "/"; else setErr(j.error || "Sign-in failed."); }
  return <Card title="Sign in" sub="Your services, reports, billing and documents in one place.">
    {err ? <p className="alert bad">{err}</p> : ended && <p className="alert info">Your session ended. Sign in again to continue.</p>}
    <form onSubmit={go}>
      <label className="field"><span>Email</span><input type="email" required autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)}/></label>
      <label className="field"><span>Password</span><input type="password" required autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)}/></label>
      <button className="btn" disabled={busy}>{busy ? "Signing in…" : "Sign in"}</button></form>
    <div className="links"><a href="/forgot">Forgot password?</a><a href="https://www.virtanta.com/contact">Need access?</a></div>
    <p className="muted small" style={{ marginTop: 18 }}>Using VirtantPay with an account number? <a href="https://virpay.virtanta.com/vpportal" style={{ color: "var(--blue)", fontWeight: 700 }}>Payments workspace sign-in</a></p>
  </Card>;
}

export function SetPassword({ kind }: { kind: "invite" | "reset" }) {
  const [token, setToken] = useState(""), [password, setPassword] = useState(""), [confirm, setConfirm] = useState(""), [err, setErr] = useState(""), [busy, setBusy] = useState(false);
  useEffect(() => { setToken(new URLSearchParams(location.search).get("t") || ""); }, []);
  async function go(e: React.FormEvent) { e.preventDefault(); setBusy(true); setErr(""); const { ok, j } = await post("/api/auth/password", { kind, token, password, confirm }); setBusy(false);
    if (ok) location.href = kind === "invite" ? "/welcome" : "/"; else setErr(j.error || "That didn't work."); }
  return <Card title={kind === "invite" ? "Set up your access" : "Choose a new password"} sub={kind === "invite" ? "Choose a password to finish setting up your sign-in." : undefined}>
    {err && <p className="alert bad">{err}{/expired/.test(err) && <> <a href="/forgot" style={{ fontWeight: 700 }}>Send a new link</a></>}</p>}
    {!token ? <p className="alert bad">This link is incomplete. Open it again from your email.</p> :
    <form onSubmit={go}>
      <label className="field"><span>New password</span><input type="password" required minLength={12} autoComplete="new-password" value={password} onChange={(e) => setPassword(e.target.value)}/></label>
      <label className="field"><span>Confirm password</span><input type="password" required minLength={12} autoComplete="new-password" value={confirm} onChange={(e) => setConfirm(e.target.value)}/></label>
      <p className="muted small" style={{ margin: "-4px 0 12px" }}>At least 12 characters.</p>
      <button className="btn" disabled={busy}>{busy ? "Saving…" : kind === "invite" ? "Set password and continue" : "Save password"}</button></form>}
  </Card>;
}

export function Forgot() {
  const [email, setEmail] = useState(""), [sent, setSent] = useState(false), [busy, setBusy] = useState(false);
  async function go(e: React.FormEvent) { e.preventDefault(); setBusy(true); await post("/api/auth/forgot", { email }); setBusy(false); setSent(true); }
  return <Card title="Reset your password">
    {sent ? <p className="alert ok">If that email has portal access, a link is on its way. It works for 2 hours.</p> :
    <form onSubmit={go}><label className="field"><span>Email</span><input type="email" required value={email} onChange={(e) => setEmail(e.target.value)}/></label>
      <button className="btn" disabled={busy}>{busy ? "Sending…" : "Send reset link"}</button></form>}
    <div className="links"><a href="/login">Back to sign in</a></div>
  </Card>;
}
