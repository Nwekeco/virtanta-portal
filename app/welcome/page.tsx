import Shell from "@/components/Shell";
import { Walkthrough } from "@/components/Actions";
import { requireMe } from "@/lib/page";
import { walkthrough } from "@/lib/modules";
export const dynamic = "force-dynamic";
export default async function Welcome() {
  const me = await requireMe();
  const steps = walkthrough(me.modules);
  return <Shell me={me} crumb="Getting started">
    <div className="eyebrow">Getting started</div><h1>Welcome to Virtanta</h1>
    <p className="lead">A few short steps to find your way around and get the most from {me.services.some((s) => s.trial?.state === "ACTIVE") ? "your trial" : "your services"}. Each takes a minute or two.</p>
    <Walkthrough steps={steps} completed={me.user.onboarding?.completed ?? []}/>
  </Shell>;
}
