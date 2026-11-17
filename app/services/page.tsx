import Shell from "@/components/Shell";
import TrialBanner from "@/components/TrialBanner";
import Icon from "@/components/Icon";
import { fmtDate, human, requireMe, tone } from "@/lib/page";
import { menu } from "@/lib/modules";
export const dynamic = "force-dynamic";

export default async function Services() {
  const me = await requireMe();
  const { workspaces } = menu(me.modules);
  return <Shell me={me} crumb="Services">
    <div className="eyebrow">Your account</div><h1>Services</h1><p className="lead">What's switched on, your numbers and how far setup has got.</p>
    <TrialBanner me={me}/>
    {me.services.length === 0 && <div className="empty">No services yet. They appear here as soon as your agreement is signed.</div>}
    <div className="svc">{me.services.map((s) => <section className="card" key={s.reference}>
      <div className="head"><div><div className="eyebrow">{s.reference}</div><h2 style={{ margin: "6px 0 2px" }}>{s.title}</h2>
        <span className="muted small">{s.activatedAt ? `Live since ${fmtDate(s.activatedAt)}` : "Being set up"}{s.nextInvoiceAt ? ` · next invoice ${fmtDate(s.nextInvoiceAt)}` : ""}</span></div>
        <div style={{ textAlign: "right" }}><span className={`chip ${s.trial?.state === "ACTIVE" ? "" : tone(s.status)}`}>{s.trial ? `Trial ${human(s.trial.state ?? "")}` : human(s.status)}</span><div style={{ fontWeight: 850, fontSize: 18, marginTop: 6 }}>{s.monthly}<span className="muted small"> / month</span></div></div></div>
      <table style={{ marginTop: 12 }}><thead><tr><th>Service</th><th className="num">Quantity</th><th className="num">Amount</th></tr></thead>
        <tbody>{s.items.map((i, k) => <tr key={k}><td><b>{i.label}</b>{i.kind !== "RECURRING" && <span className="muted small"> · {human(i.kind)}</span>}</td><td className="num">{i.qty} {i.unit.replace(/^\/\s*/, "per ")}</td><td className="num">{i.total}</td></tr>)}</tbody></table>
      {s.numbers.length > 0 && <p style={{ marginTop: 12 }}><b>Your numbers:</b> {s.numbers.map((n) => `${n.kind} ${n.number}`).join(" · ")}</p>}
      {s.setup.total > 0 && s.setup.done < s.setup.total && <div style={{ marginTop: 12 }}><span className="muted small">Setup {s.setup.done} of {s.setup.total} steps done</span>
        <div className="bar" style={{ marginTop: 6 }}><i style={{ width: `${Math.round((s.setup.done / s.setup.total) * 100)}%` }}/></div></div>}
    </section>)}</div>
    {workspaces.length > 0 && <section id="workspaces" className="card" style={{ marginTop: 18 }}><h2>Your workspaces</h2>
      <p className="muted small" style={{ marginTop: -6 }}>Specialist tools for the services you have. Each opens in a new tab.</p>
      <div className="grid g2">{workspaces.map((w) => <a key={w.key} className="card" href={w.href} target="_blank" rel="noreferrer" style={{ display: "flex", gap: 12, alignItems: "center", boxShadow: "none" }}>
        <Icon name={w.icon}/><b style={{ flex: 1 }}>{w.label}</b><Icon name="ext" size={15}/></a>)}</div></section>}
  </Shell>;
}
