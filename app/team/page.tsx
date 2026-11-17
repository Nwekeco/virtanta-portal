import Shell from "@/components/Shell";
import { RemoveUser, TeamInvite } from "@/components/Actions";
import { fmtDate, human, requireMe } from "@/lib/page";
export const dynamic = "force-dynamic";
export default async function Team() {
  const me = await requireMe();
  const owner = me.user.role === "OWNER";
  return <Shell me={me} crumb="Team">
    <div className="eyebrow">Your account</div><h1>Team</h1><p className="lead">Everyone at {me.client.company} who can sign in to this portal.</p>
    <div className="grid g32">
      <section className="card tablecard"><div className="hd"><h2>People</h2></div>
        <table><thead><tr><th>Person</th><th>Access</th><th>Status</th><th>Last sign-in</th><th/></tr></thead>
          <tbody>{me.team.map((t) => <tr key={t.id}><td><b>{t.name || t.email.split("@")[0]}</b><br/><span className="muted small">{t.email}</span></td>
            <td>{t.role === "OWNER" ? "Owner" : t.role === "ADMIN" ? "Admin" : "Member"}</td><td><span className={`chip ${t.status === "ACTIVE" ? "ok" : t.status === "INVITED" ? "warn" : "g"}`}>{human(t.status)}</span></td>
            <td>{fmtDate(t.lastLoginAt)}</td><td className="num">{owner && t.id !== me.user.id && t.status !== "DISABLED" ? <RemoveUser id={t.id} email={t.email}/> : ""}</td></tr>)}</tbody></table></section>
      <TeamInvite canInvite={owner || me.user.role === "ADMIN"}/>
    </div>
  </Shell>;
}
