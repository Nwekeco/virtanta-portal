import Link from "next/link";
import { redirect } from "next/navigation";
import Shell from "@/components/Shell";
import { requireMe, fmtDate } from "@/lib/page";
import { caseTone, commerceOps, orderTone, rmaTone } from "@/lib/orders";
export const dynamic = "force-dynamic";
export default async function Orders() {
  const me = await requireMe();
  if (!me.modules.includes("orders")) redirect("/");
  const r = await commerceOps(me.client.reference, { limit: "100" });
  const d = r.body as any; const orders = (d?.orders ?? []) as any[]; const s = d?.summary;
  return <Shell me={me} crumb="Orders">
    <div className="eyebrow">Order management</div><h1>Orders</h1><p className="lead">Orders our team has placed for your customers, their returns and the cases we are working on.</p>
    {s ? <div className="grid g4" style={{ marginBottom: 18 }}>
      <div className="card kpi"><div className="h">Orders, last 30 days</div><div className="n">{s.last30}</div><div className="m">Placed by our team</div></div>
      <div className="card kpi"><div className="h">In your system</div><div className="n">{s.inSystem}</div><div className="m">Confirmed with your order number</div></div>
      <div className="card kpi"><div className="h">Needing attention</div><div className="n">{s.attention}</div><div className="m">{s.attention ? "We're working on these" : "Nothing outstanding"}</div></div>
      <div className="card kpi"><div className="h">Order value, 30 days</div><div className="n" style={{ fontSize: 20 }}>{d.client.currency} {Number(s.value).toLocaleString("en-US", { minimumFractionDigits: 2 })}</div><div className="m">Sent to your system</div></div>
    </div> : null}
    <section className="card tablecard"><div className="hd"><h2>All orders</h2></div>
      {!r.ok ? <div className="empty" style={{ margin: 20 }}>Orders are not available right now. Please try again shortly or message support.</div>
        : orders.length === 0 ? <div className="empty" style={{ margin: 20 }}>No orders yet.</div> :
      <table><thead><tr><th>Order</th><th>Your order #</th><th>Customer</th><th>Channel</th><th>Date</th><th className="num">Total</th><th>Status</th></tr></thead>
        <tbody>{orders.map((o) => <tr key={o.id}><td><Link href={`/orders/${o.id}`}><b>{o.number}</b></Link></td><td>{o.externalRef || "—"}</td><td>{o.customer}</td><td>{o.channel}</td>
          <td>{fmtDate(o.createdAt)}</td><td className="num">{o.currency} {Number(o.total).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td><td><span className={`chip ${orderTone(o.statusKey)}`}>{o.status}</span></td></tr>)}</tbody></table>}
    </section>
    {r.ok ? <div className="grid g2" style={{ marginTop: 18 }}>
      <section className="card tablecard"><div className="hd"><h2>Returns</h2></div>
        {(d?.returns ?? []).length === 0 ? <div className="empty" style={{ margin: 20 }}>No returns.</div> :
        <table><thead><tr><th>Return</th><th>Order</th><th>Items</th><th>Date</th><th>Status</th></tr></thead>
          <tbody>{(d.returns as any[]).map((x) => <tr key={x.id}><td><Link href={`/orders/returns/${x.id}`}><b>{x.number}</b></Link></td><td>{x.orderNumber || "—"}</td><td>{x.items}</td><td>{fmtDate(x.createdAt)}</td>
            <td><span className={`chip ${rmaTone(x.statusKey)}`}>{x.status}</span></td></tr>)}</tbody></table>}
      </section>
      <section className="card tablecard"><div className="hd"><h2>Cases</h2></div>
        {(d?.cases ?? []).length === 0 ? <div className="empty" style={{ margin: 20 }}>No cases.</div> :
        <table><thead><tr><th>Case</th><th>Subject</th><th>Date</th><th>Status</th></tr></thead>
          <tbody>{(d.cases as any[]).map((x) => <tr key={x.id}><td><Link href={`/orders/cases/${x.id}`}><b>{x.number}</b></Link></td><td>{x.subject}</td><td>{fmtDate(x.createdAt)}</td>
            <td><span className={`chip ${caseTone(x.statusKey)}`}>{x.status}</span></td></tr>)}</tbody></table>}
      </section>
    </div> : null}
  </Shell>;
}
