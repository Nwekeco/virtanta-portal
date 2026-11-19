import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import Shell from "@/components/Shell";
import { requireMe, fmtDate } from "@/lib/page";
import { caseTone, commerceOps } from "@/lib/orders";
export const dynamic = "force-dynamic";
export default async function Case({ params }: { params: Promise<{ id: string }> }) {
  const me = await requireMe();
  if (!me.modules.includes("orders")) redirect("/");
  const r = await commerceOps(me.client.reference, { case: (await params).id });
  if (r.status === 404) notFound();
  const x = (r.body as any)?.case;
  return <Shell me={me} crumb="Orders">
    <div className="eyebrow"><Link href="/orders">Orders</Link> · Cases</div>
    {!x ? <div className="empty">This case is not available right now.</div> : <>
      <h1>{x.number} <span className={`chip ${caseTone(x.statusKey)}`} style={{ verticalAlign: "middle" }}>{x.status}</span></h1>
      <p className="lead">{x.subject} · {x.category}{x.orderNumber ? ` · order ${x.orderNumber}` : ""} · opened {fmtDate(x.createdAt)}{x.resolvedAt ? ` · resolved ${fmtDate(x.resolvedAt)}` : ""}</p>
      <section className="card"><div className="hd"><h2>Updates</h2></div>
        {x.updates.length === 0 ? <div className="empty" style={{ margin: 20 }}>No updates yet.</div> :
        <ul className="list">{x.updates.map((u: any, k: number) => <li key={k}><span style={{ whiteSpace: "pre-wrap" }}>{u.text}</span><span className="muted small">{fmtDate(u.at)}</span></li>)}</ul>}
      </section></>}
  </Shell>;
}
