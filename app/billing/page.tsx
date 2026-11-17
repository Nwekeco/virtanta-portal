import Shell from "@/components/Shell";
import { asUser } from "@/lib/bridge";
import { fmtDate, human, requireMe, tone } from "@/lib/page";
export const dynamic = "force-dynamic";
export default async function Billing() {
  const me = await requireMe();
  const inv = ((await asUser("invoices"))?.body?.invoices ?? []) as any[];
  return <Shell me={me} crumb="Billing">
    <div className="eyebrow">Your account</div><h1>Billing</h1><p className="lead">Every invoice, what's due and a secure link to pay online.</p>
    <section className="card tablecard"><div className="hd"><h2>Invoices</h2><span className="muted small">Questions? billing@virtanta.com</span></div>
      {inv.length === 0 ? <div className="empty" style={{ margin: 20 }}>No invoices yet.</div> :
      <table><thead><tr><th>Invoice</th><th>Issued</th><th>Due</th><th className="num">Amount</th><th className="num">Balance</th><th>Status</th><th/></tr></thead>
        <tbody>{inv.map((i) => <tr key={i.number}><td><b>{i.number}</b></td><td>{fmtDate(i.issuedAt)}</td><td>{fmtDate(i.dueAt)}</td>
          <td className="num">{i.currency} {i.amount}</td><td className="num">{i.currency} {i.balance}</td><td><span className={`chip ${tone(i.status)}`}>{human(i.status)}</span></td>
          <td className="num">{i.payUrl ? <a className="btn sm" href={i.payUrl}>Pay now</a> : ""}</td></tr>)}</tbody></table>}
    </section>
  </Shell>;
}
