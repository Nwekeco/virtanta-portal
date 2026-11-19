import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import Shell from "@/components/Shell";
import { requireMe, fmtDate } from "@/lib/page";
import { commerceOps, orderTone } from "@/lib/orders";
export const dynamic = "force-dynamic";
export default async function Order({ params }: { params: Promise<{ id: string }> }) {
  const me = await requireMe();
  if (!me.modules.includes("orders")) redirect("/");
  const { id } = await params;
  const r = await commerceOps(me.client.reference, { order: id });
  if (r.status === 404) notFound();
  const o = (r.body as any)?.order;
  return <Shell me={me} crumb="Orders">
    <div className="eyebrow"><Link href="/orders">Orders</Link></div>
    {!o ? <div className="empty">This order is not available right now.</div> : <>
      <h1>{o.number} <span className={`chip ${orderTone(o.statusKey)}`} style={{ verticalAlign: "middle" }}>{o.status}</span></h1>
      <p className="lead">{o.customer}{o.poNumber ? ` · PO ${o.poNumber}` : ""} · {o.channel} · placed {fmtDate(o.createdAt)}{o.externalRef ? ` · your order # ${o.externalRef}` : ""}</p>
      <div className="grid g32">
        <section className="card tablecard"><div className="hd"><h2>Items</h2><span className="muted small">Total {o.currency} {Number(o.total).toFixed(2)}</span></div>
          <table><thead><tr><th>SKU</th><th>Item</th><th className="num">Qty</th><th className="num">Price</th><th className="num">Total</th></tr></thead>
            <tbody>{o.lines.map((l: any, k: number) => <tr key={k}><td>{l.sku}</td><td>{l.description}</td><td className="num">{l.qty}</td><td className="num">{Number(l.unitPrice).toFixed(2)}</td><td className="num">{Number(l.lineTotal).toFixed(2)}</td></tr>)}</tbody></table></section>
        <section className="card"><div className="hd"><h2>Progress</h2></div>
          <ul className="list">{o.timeline.map((t: any, k: number) => <li key={k}><span>{t.text}</span><span className="muted small">{fmtDate(t.at)}</span></li>)}</ul></section>
      </div></>}
  </Shell>;
}
