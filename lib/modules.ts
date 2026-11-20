/** Portal menu. Core sections are native; specialist workspaces open where they live until they're folded in natively. */
export type Mod = { key: string; label: string; href: string; icon: string; external?: boolean };
const env = (k: string) => (process.env[k] || "").replace(/\/$/, "");

export function menu(modules: string[]): { main: Mod[]; workspaces: Mod[] } {
  const has = (k: string) => modules.includes(k);
  const main: Mod[] = [
    { key: "overview", label: "Overview", href: "/", icon: "home" },
    { key: "services", label: "Services", href: "/services", icon: "layers" },
    { key: "billing", label: "Billing", href: "/billing", icon: "receipt" },
    { key: "documents", label: "Documents", href: "/documents", icon: "file" },
    ...(has("orders") ? [{ key: "orders", label: "Orders", href: "/orders", icon: "cart" }] : []),
    { key: "support", label: "Support", href: "/support", icon: "chat" },
    { key: "team", label: "Team", href: "/team", icon: "users" },
  ];
  const ws: Mod[] = [];
  const vcx = env("VCX_CLIENT_URL"), vp = env("VIRTPAY_PORTAL_URL") || "https://virpay.virtanta.com/vpportal";
  if (has("calls") && vcx) ws.push({ key: "calls", label: "Calls & reporting", href: `${vcx}/client-dashboard`, icon: "phone", external: true });
  if (has("knowledge") && vcx) ws.push({ key: "knowledge", label: "Knowledge base", href: `${vcx}/knowledge-base`, icon: "book", external: true });
  if (has("tasks") && vcx) ws.push({ key: "tasks", label: "Assistant tasks", href: `${vcx}/tasks`, icon: "check", external: true });
  if (has("payments")) ws.push({ key: "payments", label: "Payments workspace", href: vp, icon: "card", external: true });
  return { main, workspaces: ws };
}

/** Walkthrough steps for this client, in order. */
export function walkthrough(modules: string[]) {
  const has = (k: string) => modules.includes(k);
  const steps: { key: string; title: string; text: string; href: string; cta: string }[] = [
    { key: "services", title: "Check your services", text: "See what's switched on, your phone numbers and how far setup has got.", href: "/services", cta: "Open services" },
    { key: "team", title: "Invite your team", text: "Give colleagues their own sign-in so nobody shares a password.", href: "/team", cta: "Invite people" },
    { key: "billing", title: "Know how billing works", text: "Invoices arrive monthly and every line is explained. Pay online any time.", href: "/billing", cta: "Open billing" },
  ];
  if (has("calls")) steps.push({ key: "calls", title: "See your calls and reports", text: "Calls handled, response times, satisfaction and every case, updated through the day.", href: "/services#workspaces", cta: "Where to find reports" });
  if (has("knowledge")) steps.push({ key: "knowledge", title: "Write your knowledge base", text: "Draft the answers our agents use for your customers. Your version always takes priority.", href: "/services#workspaces", cta: "How the KB works" });
  if (has("tasks")) steps.push({ key: "tasks", title: "Send your assistant a first task", text: "Describe it, attach documents and follow progress until it's done.", href: "/services#workspaces", cta: "How tasks work" });
  if (has("orders")) steps.push({ key: "orders", title: "Follow your orders", text: "Every order our team places for your customers, where it is, and its number in your system.", href: "/orders", cta: "Open orders" });
  if (has("payments")) steps.push({ key: "payments", title: "Set up payments", text: "Connect your accounting system and turn on the payment channels you want.", href: "/services#workspaces", cta: "Open payments" });
  steps.push({ key: "support", title: "Know where to get help", text: "Message the team from the portal; a person replies, never a bot.", href: "/support", cta: "Open support" });
  return steps;
}
