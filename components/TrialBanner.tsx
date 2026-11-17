import type { Me } from "@/lib/bridge";
import { fmtDate } from "@/lib/page";
export default function TrialBanner({ me }: { me: Me }) {
  const t = me.services.find((s) => s.trial && ["ACTIVE", "PAUSED"].includes(s.trial.state ?? ""));
  if (!t?.trial) return null;
  const paused = t.trial.state === "PAUSED";
  const left = t.trial.endsAt ? Math.max(0, Math.ceil((new Date(t.trial.endsAt).getTime() - Date.now()) / 86_400_000)) : t.trial.days;
  return <div className="banner"><div><div className="t">{paused ? "Trial ended" : "Free trial"}</div>
    <b>{paused ? "Your services are paused" : `${left} day${left === 1 ? "" : "s"} left · ends ${fmtDate(t.trial.endsAt)}`}</b>
    <p>{paused ? "Continue to switch everything back on. Your setup is kept." : `Continue now and nothing changes for your team. Then ${t.monthly} a month.`}</p></div>
    {t.trial.continueUrl && <a className="btn" href={t.trial.continueUrl}>Continue my service</a>}</div>;
}
