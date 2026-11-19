import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import Shell from "@/components/Shell";
import { requireMe, fmtDate } from "@/lib/page";
import { commerceOps, rmaTone } from "@/lib/orders";
export const dynamic = "force-dynamic";
export default async function Return({ params }: { params: Promise<{ id: string }> }) {
  const me = await requireMe();
  if (!me.modules.includes("orders")) redirect("/");
  const r = await commerceOps(me.client.reference, { rma: (await params).id });
  if (r.status === 404) notFound();
  const x = (r.body as any)?.rma;
  return <Shell me={me} crumb="Orders">
    <div className="eyebrow"><Link href="/orders">Orders</Link> · Returns</div>
    {!x ? <div className="empty">This return is not available right now.</div> : <>
      <h1>{x.number} <span className={`chip ${rmaTone(x.statusKey)}`} style={{ verticalAlign: "middle" }}>{x.status}</span></h1>
      <p className="lead">{x.orderNumber ? `Order ${x.orderNumber} · ` : ""}{x.resolution.replace("_", " ")} · requested {fmtDate(x.createdAt)}{x.externalRef ? ` · your RMA # ${x.externalRef}` : ""}{x.trackingNo ? ` · tracking ${x.trackingNo}` : ""}</p>
      <div className="grid g32">
        <section className="card tablecard"><div className="hd"><h2>Items</h2>{Number(x.refundAmount) ? <span className="muted small">Refund {x.currency} {Number(x.refundAmount).toFixed(2)}</span> : null}</div>
          <table><thead><tr><th>SKU</th><th>Item</th><th className="num">Qty</th><th>Reason</th><th className="num">Received</th></tr></thead>
            <tbody>{x.lines.map((l: any, k: number) => <tr key={k}><td>{l.sku}</td><td>{l.description}</td><td className="num">{l.qty}</td><td>{l.returnCode}</td><td className="num">{l.receivedQty || "—"}</td></tr>)}</tbody></table></section>
        <section className="card"><div className="hd"><h2>Progress</h2></div>
          <ul className="list">{x.timeline.map((t: any, k: number) => <li key={k}><span>{t.text}</span><span className="muted small">{fmtDate(t.at)}</span></li>)}</ul></section>
      </div></>}
  </Shell>;
}
