import Shell from "@/components/Shell";
import { SupportForm } from "@/components/Actions";
import { requireMe } from "@/lib/page";
export const dynamic = "force-dynamic";
export default async function Support() {
  const me = await requireMe();
  return <Shell me={me} crumb="Support">
    <div className="eyebrow">Help</div><h1>Support</h1><p className="lead">Message the team, or reach the right desk directly.</p>
    <div className="grid g32"><SupportForm/>
      <section className="card"><h2>Reach us directly</h2><ul className="list">
        <li><span>Help with a service</span><a href="mailto:support@virtanta.com"><b>support@virtanta.com</b></a></li>
        <li><span>Invoices and payments</span><a href="mailto:billing@virtanta.com"><b>billing@virtanta.com</b></a></li>
        <li><span>Getting set up</span><a href="mailto:onboarding@virtanta.com"><b>onboarding@virtanta.com</b></a></li>
        <li><span>Phone (US)</span><a href="tel:+18333634450"><b>+1 (833) 363-4450</b></a></li></ul></section></div>
  </Shell>;
}
