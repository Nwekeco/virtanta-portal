# Virtanta client portal

`client.virtanta.com` — one sign-in for Virtanta clients: services and trials, billing and payment links, documents,
team access, support messages and a getting-started walkthrough. Specialist workspaces (VCX calls and knowledge base,
assistant tasks, the VirtantPay payments workspace) appear in the menu for clients who have them.

- Next.js 15 on Server 8, `127.0.0.1:3420`, PM2 `virtanta-portal`.
- No database of its own: everything comes from VirtantPay's client-portal bridge (`/api/internal/client-portal`,
  `VIRTANTA_PORTAL_BRIDGE_SECRET`). Client accounts (`VirtantaClientUser`) live in VirtantPay and are invited when a
  service goes live.
- Session: signed, HTTP-only cookie (12 hours); a password change signs out other sessions.
- Workspace links show only when their URL is configured: `VCX_CLIENT_URL`, `VIRTPAY_PORTAL_URL`.

Deploy: `scripts/portal-deploy_v1.sh` (setup · release · nginx-virpay · nginx-switch · nginx-rollback · status).
