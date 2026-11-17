import Shell from "@/components/Shell";
import { asUser } from "@/lib/bridge";
import { fmtDate, requireMe } from "@/lib/page";
export const dynamic = "force-dynamic";
export default async function Documents() {
  const me = await requireMe();
  const docs = ((await asUser("documents"))?.body?.documents ?? []) as any[];
  return <Shell me={me} crumb="Documents">
    <div className="eyebrow">Your account</div><h1>Documents</h1><p className="lead">Your signed agreements and the proposals we've sent you.</p>
    <section className="card tablecard"><div className="hd"><h2>All documents</h2></div>
      {docs.length === 0 ? <div className="empty" style={{ margin: 20 }}>No documents yet.</div> :
      <table><thead><tr><th>Document</th><th>Type</th><th>Date</th><th/></tr></thead>
        <tbody>{docs.map((d, k) => <tr key={k}><td><b>{d.title}</b></td><td>{d.kind}</td><td>{fmtDate(d.date)}</td>
          <td className="num">{d.url ? <a className="btn ghost sm" href={d.url} target="_blank" rel="noreferrer">Open</a> : <span className="muted small">Ask us for a copy</span>}</td></tr>)}</tbody></table>}
    </section>
  </Shell>;
}
