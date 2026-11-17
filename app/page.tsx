import Link from "next/link";
import Shell from "@/components/Shell";
import TrialBanner from "@/components/TrialBanner";
import Icon from "@/components/Icon";
import { asUser } from "@/lib/bridge";
import { fmtDate, human, requireMe, tone } from "@/lib/page";
import { walkthrough } from "@/lib/modules";
export const dynamic = "force-dynamic";

export default async function Overview() {
  const me = await requireMe();
  const inv = ((await asUser("invoices"))?.body?.invoices ?? []) as any[];
  const open = inv.filter((i) => i.payUrl);
  const steps = walkthrough(me.modules), done = new Set(me.user.onboarding?.completed ?? []);
  const progress = steps.filter((s) => done.has(s.key)).length;
  const live = me.services.filter((s) => s.status === "ACTIVE");
  const next = me.services.map((s) => s.nextInvoiceAt).filter(Boolean).sort()[0] ?? null;
  const first = (me.user.name || "").split(" ")[0];
  return <Shell me={me} crumb="Overview">
    <div className="eyebrow">{me.client.company}</div><h1>{first ? `Welcome back, ${first}` : "Welcome back"}</h1>
    <p className="lead">Everything about your Virtanta services in one place.</p>
    <TrialBanner me={me}/>
    <div className="grid g4" style={{ marginBottom: 18 }}>
      <div className="card kpi"><div className="h">Active services</div><div className="n">{live.length}</div><div className="m">{me.services.length} on your account</div></div>
      <div className="card kpi"><div className="h">Invoices to pay</div><div className="n">{open.length}</div><div className="m">{open.length ? open.map((i) => `${i.currency} ${i.balance}`).slice(0, 2).join(" · ") : "Nothing due"}</div></div>
      <div className="card kpi"><div className="h">Next invoice</div><div className="n" style={{ fontSize: 20 }}>{fmtDate(next)}</div><div className="m">Monthly, every line explained</div></div>
      <div className="card kpi"><div className="h">Getting started</div><div className="n">{progress}/{steps.length}</div><div className="bar" style={{ marginTop: 10 }}><i style={{ width: `${Math.round((progress / Math.max(1, steps.length)) * 100)}%` }}/></div></div>
    </div>
    <div className="grid g32">
      <section className="card"><div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}><h2>Your services</h2><Link className="btn ghost sm" href="/services">All services</Link></div>
        {me.services.length === 0 ? <div className="empty">Your services will appear here as soon as they're set up.</div> :
        <ul className="list">{me.services.slice(0, 6).map((s) => <li key={s.reference}><span><b>{s.title}</b><br/><span className="muted small">{s.items.map((i) => i.label).slice(0, 3).join(" · ")}</span></span>
          <span style={{ textAlign: "right" }}><span className={`chip ${s.trial?.state === "ACTIVE" ? "" : tone(s.status)}`}>{s.trial?.state === "ACTIVE" ? "Trial" : human(s.status)}</span><br/><span className="muted small">{s.monthly} / month</span></span></li>)}</ul>}
      </section>
      <section className="card">{progress < steps.length && !me.user.onboarding?.dismissed ? <>
          <h2>Finish setting up</h2><p className="muted small" style={{ marginTop: -6 }}>A short walkthrough of the portal and your first steps.</p>
          <ul className="list">{steps.slice(0, 4).map((s) => <li key={s.key}><span>{done.has(s.key) ? "✓ " : ""}{s.title}</span></li>)}</ul>
          <Link className="btn" href="/welcome" style={{ marginTop: 12 }}>Continue the walkthrough <Icon name="arrow" size={16}/></Link></>
        : <><h2>Need anything?</h2><p className="muted">Message the team from here — a person replies, usually within a business day.</p><Link className="btn ghost" href="/support">Message the team</Link></>}
      </section>
    </div>
  </Shell>;
}
