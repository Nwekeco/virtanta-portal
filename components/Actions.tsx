"use client";
import { useState } from "react";
import Link from "next/link";

async function act(op: string, body: Record<string, unknown>) {
  const r = await fetch("/api/portal", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ op, ...body }) });
  if (r.status === 401) { location.href = "/login?ended=1"; return { ok: false, j: {} as any }; }
  return { ok: r.ok, j: await r.json().catch(() => ({})) };
}

export function SupportForm() {
  const [subject, setSubject] = useState(""), [message, setMessage] = useState(""), [busy, setBusy] = useState(false), [res, setRes] = useState<{ ok: boolean; text: string } | null>(null);
  async function send(e: React.FormEvent) { e.preventDefault(); setBusy(true); const { ok, j } = await act("message", { subject, message }); setBusy(false);
    if (ok) { setRes({ ok: true, text: `Sent${j.reference ? ` — reference ${j.reference}` : ""}. A member of the team will reply by email.` }); setSubject(""); setMessage(""); }
    else setRes({ ok: false, text: j.error || "That didn't send. Please try again." }); }
  return <form className="card" onSubmit={send}><h2>Message the team</h2>
    {res && <p className={`alert ${res.ok ? "ok" : "bad"}`}>{res.text}</p>}
    <label className="field"><span>Subject</span><input value={subject} onChange={(e) => setSubject(e.target.value)} maxLength={160} placeholder="What's it about?"/></label>
    <label className="field"><span>Message</span><textarea required rows={7} value={message} onChange={(e) => setMessage(e.target.value)} maxLength={4000}/></label>
    <button className="btn" disabled={busy || !message.trim()}>{busy ? "Sending…" : "Send message"}</button></form>;
}

export function TeamInvite({ canInvite }: { canInvite: boolean }) {
  const [email, setEmail] = useState(""), [name, setName] = useState(""), [role, setRole] = useState("MEMBER"), [busy, setBusy] = useState(false), [res, setRes] = useState<{ ok: boolean; text: string } | null>(null);
  if (!canInvite) return <div className="card"><h2>Invite people</h2><p className="muted">Ask your account owner to invite colleagues.</p></div>;
  async function go(e: React.FormEvent) { e.preventDefault(); setBusy(true); const { ok, j } = await act("invite", { email, name, role }); setBusy(false);
    if (ok) { setRes({ ok: true, text: `Invitation sent to ${email}.` }); setEmail(""); setName(""); setTimeout(() => location.reload(), 900); } else setRes({ ok: false, text: j.error || "That didn't work." }); }
  return <form className="card" onSubmit={go}><h2>Invite people</h2>
    {res && <p className={`alert ${res.ok ? "ok" : "bad"}`}>{res.text}</p>}
    <label className="field"><span>Name</span><input value={name} onChange={(e) => setName(e.target.value)}/></label>
    <label className="field"><span>Email</span><input type="email" required value={email} onChange={(e) => setEmail(e.target.value)}/></label>
    <label className="field"><span>Access</span><select value={role} onChange={(e) => setRole(e.target.value)}><option value="MEMBER">Team member</option><option value="ADMIN">Admin (can invite people)</option></select></label>
    <button className="btn" disabled={busy}>{busy ? "Sending…" : "Send invitation"}</button></form>;
}

export function RemoveUser({ id, email }: { id: string; email: string }) {
  const [confirm, setConfirm] = useState(false), [busy, setBusy] = useState(false);
  if (!confirm) return <button className="btn ghost sm" onClick={() => setConfirm(true)}>Remove</button>;
  return <span style={{ display: "inline-flex", gap: 6 }}><button className="btn sm" disabled={busy} onClick={async () => { setBusy(true); const { ok } = await act("removeUser", { userId: id }); if (ok) location.reload(); else setBusy(false); }}>Remove {email.split("@")[0]}</button>
    <button className="btn ghost sm" onClick={() => setConfirm(false)}>Keep</button></span>;
}

type Step = { key: string; title: string; text: string; href: string; cta: string };
export function Walkthrough({ steps, completed }: { steps: Step[]; completed: string[] }) {
  const [done, setDone] = useState<string[]>(completed);
  const save = (next: string[], dismissed = false) => { setDone(next); void act("onboarding", { completed: next, dismissed }); };
  const all = steps.every((s) => done.includes(s.key));
  return <>
    <div className="bar" style={{ margin: "0 0 18px" }}><i style={{ width: `${Math.round((steps.filter((s) => done.includes(s.key)).length / steps.length) * 100)}%` }}/></div>
    {all && <p className="alert ok">You're all set. You can come back to this walkthrough any time from the overview.</p>}
    <ol className="steps">{steps.map((s, i) => { const d = done.includes(s.key); return <li key={s.key} className={`step${d ? " done" : ""}`}>
      <span className="dot">{d ? "✓" : i + 1}</span>
      <div className="body"><h3>{s.title}</h3><p>{s.text}</p>
        <div className="acts"><Link className="btn ghost sm" href={s.href} onClick={() => !d && save([...done, s.key])}>{s.cta}</Link>
          <button className="btn ghost sm" onClick={() => save(d ? done.filter((k) => k !== s.key) : [...done, s.key])}>{d ? "Mark as not done" : "Mark as done"}</button></div></div></li>; })}</ol>
    {!all && <p style={{ marginTop: 16 }}><button className="btn ghost sm" onClick={() => { save(done, true); location.href = "/"; }}>Skip for now</button></p>}
  </>;
}
