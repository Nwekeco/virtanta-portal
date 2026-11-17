"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Icon from "./Icon";
export default function NavLinks({ items }: { items: { href: string; label: string; icon: string }[] }) {
  const p = usePathname();
  return <nav className="nav">{items.map((i) => <Link key={i.href} href={i.href} className={(i.href === "/" ? p === "/" : p.startsWith(i.href)) ? "on" : ""}><Icon name={i.icon}/><span>{i.label}</span></Link>)}</nav>;
}
