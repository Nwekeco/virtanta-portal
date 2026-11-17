import Link from "next/link";
import Icon from "./Icon";
import NavLinks from "./NavLinks";
import { menu } from "@/lib/modules";
import type { Me } from "@/lib/bridge";

export default function Shell({ me, crumb, children }: { me: Me; crumb: string; children: React.ReactNode }) {
  const { main, workspaces } = menu(me.modules);
  const name = me.user.name || me.user.email.split("@")[0];
  const initials = name.split(/[\s._-]+/).filter(Boolean).slice(0, 2).map((w) => w[0]!.toUpperCase()).join("") || "V";
  return (<div className="shell">
    <aside className="side">
      <Link href="/" className="brand"><img src="/favicon.png" alt=""/><span><b>Virtanta</b><small>Client portal</small></span></Link>
      <div className="co"><b>{me.client.company}</b><small>{me.user.role === "OWNER" ? "Account owner" : me.user.role === "ADMIN" ? "Admin" : "Team member"}</small></div>
      <div className="sec">Your account</div>
      <NavLinks items={main.map((m) => ({ href: m.href, label: m.label, icon: m.icon }))}/>
      {workspaces.length > 0 && <><div className="sec">Workspaces</div>
        <nav className="nav">{workspaces.map((w) => <a key={w.key} href={w.href} target="_blank" rel="noreferrer"><Icon name={w.icon}/><span>{w.label}</span><span className="x"><Icon name="ext" size={14}/></span></a>)}</nav></>}
      <div className="foot"><div className="user"><span className="av">{initials}</span><span className="who"><b>{name}</b><small>{me.user.email}</small></span>
        <form action="/api/auth/logout" method="post"><button className="iconbtn" title="Sign out" aria-label="Sign out"><Icon name="out"/></button></form></div></div>
    </aside>
    <div className="main">
      <header className="top"><div className="crumb">Client portal › <b>{crumb}</b></div><Link className="btn ghost sm" href="/support">Message the team</Link></header>
      <main className="wrap">{children}</main>
    </div>
  </div>);
}
