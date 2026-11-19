import Link from "next/link";
import { redirect } from "next/navigation";
import Shell from "@/components/Shell";
import { requireMe, fmtDate } from "@/lib/page";
import { commerceOps, orderTone } from "@/lib/orders";
export const dynamic = "force-dynamic";
export default async function Orders() {
  const me = await requireMe();
  if (!me.modules.includes("orders")) redirect("/");
  const r = await commerceOps(me.client.reference, { limit: "100" });
  const d = r.body as any; const orders = (d?.orders ?? []) as any[]; const s = d?.summary;
  return <Shell me={me} crumb="Orders">
    <div className="eyebrow">Order management</div><h1>Orders</h1><p className="lead">Orders our team has placed for your customers, and where each one is.</p>
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
  </Shell>;
}
