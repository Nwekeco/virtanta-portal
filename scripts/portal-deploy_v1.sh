#!/usr/bin/env bash
# Virtanta client portal (client.virtanta.com) — Server 8 (vmi3494204). Next.js on 127.0.0.1:3420 under PM2 "virtanta-portal".
#   setup               first install: clone, write .env (bridge secret copied from ~/virtantpay/.env, new session secret), build, start
#   release <SHA>       backup the current build, check out <SHA>, build, reload (rolls back the checkout if the build fails)
#   nginx-virpay        create virpay.virtanta.com as a copy of the current client.virtanta.com site (VirtantPay portal), get its certificate
#   nginx-switch        point client.virtanta.com at the new portal (backs up the site file; nginx -t before reload)
#   nginx-rollback      restore the client.virtanta.com site file saved by nginx-switch
#   status
# Never prints secrets. Run nginx-virpay before nginx-switch, once the virpay.virtanta.com DNS record exists.
set -euo pipefail
[ "$(hostname)" = "vmi3494204" ] || { echo "ABORT: run on Server 8"; exit 90; }
APP=$HOME/virtanta-portal; PORT=3420; NAME=virtanta-portal; TS=$(date -u +%Y%m%dT%H%M%SZ)
VPENV=$HOME/virtantpay/.env
vp(){ grep "^$1=" "$VPENV" 2>/dev/null | tail -1 | cut -d= -f2- | tr -d "\"'"; }
site_for(){ sudo grep -l "server_name[^;]*\b$1\b" /etc/nginx/sites-available/* 2>/dev/null | head -1; }
build(){ cd "$APP"; npm ci --no-audit --no-fund >/dev/null; npm run build >/dev/null; }
case "${1:-}" in
setup)
  [ -d "$APP/.git" ] || git clone -q git@github.com:Nwekeco/virtanta-portal.git "$APP"
  cd "$APP"; B=$(vp VIRTANTA_PORTAL_BRIDGE_SECRET)
  [ ${#B} -ge 32 ] || { echo "ABORT: run 'r710-client-portal_v1.sh secret' in VirtantPay first and release VirtantPay"; exit 91; }
  if [ ! -f .env ]; then umask 077; { echo "VIRTANTPAY_URL=https://pay.virtanta.com"; echo "VIRTANTA_PORTAL_BRIDGE_SECRET=$B"
    echo "PORTAL_SESSION_SECRET=$(openssl rand -hex 32)"; echo "VIRTPAY_PORTAL_URL=https://virpay.virtanta.com/vpportal"; } > .env; echo ".env written (600)"
  else echo ".env exists (unchanged)"; fi
  build; pm2 describe $NAME >/dev/null 2>&1 && pm2 reload $NAME --update-env || pm2 start npm --name $NAME -- start; pm2 save >/dev/null
  sleep 3; curl -s -o /dev/null -w "local /login: %{http_code}\n" http://127.0.0.1:$PORT/login ;;
release)
  SHA=${2:?commit SHA}; [[ "$SHA" =~ ^[0-9a-f]{40}$ ]] || { echo "ABORT: full SHA"; exit 92; }
  cd "$APP"; PREV=$(git rev-parse HEAD); [ -d .next ] && cp -a .next "$HOME/virtanta-portal-backup-$TS" && echo "backup: ~/virtanta-portal-backup-$TS (build of $PREV)"
  git fetch -q origin; git checkout -q --detach "$SHA"
  if ! build; then echo "BUILD FAILED — restoring $PREV"; git checkout -q --detach "$PREV"; rm -rf .next; cp -a "$HOME/virtanta-portal-backup-$TS" .next; exit 93; fi
  pm2 reload $NAME --update-env; sleep 3; curl -s -o /dev/null -w "local /login: %{http_code}\n" http://127.0.0.1:$PORT/login ;;
nginx-virpay)
  DST=/etc/nginx/sites-available/virpay.virtanta.com
  if [ -e "$DST" ]; then echo "virpay site exists: $DST (unchanged)"; else
    sudo tee "$DST" >/dev/null <<'NGX'
# VirtantPay payments workspace (moved from client.virtanta.com). VirtantPay runs on 127.0.0.1:3000.
server {
    listen 80;
    listen [::]:80;
    server_name virpay.virtanta.com;
    client_max_body_size 25m;
    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
    }
}
NGX
    sudo ln -sfn "$DST" /etc/nginx/sites-enabled/virpay.virtanta.com; fi
  sudo nginx -t && sudo systemctl reload nginx
  sudo certbot --nginx -d virpay.virtanta.com --non-interactive --agree-tos --redirect -m admin@virtanta.com
  curl -s -o /dev/null -w "https://virpay.virtanta.com/vpportal: %{http_code}\n" https://virpay.virtanta.com/vpportal ;;
nginx-switch)
  SRC=$(site_for client.virtanta.com); [ -n "$SRC" ] || { echo "ABORT: no nginx site for client.virtanta.com"; exit 94; }
  sudo cp -p "$SRC" "$SRC.bak-portal-$TS"; echo "backup: $SRC.bak-portal-$TS"
  sudo sed -i -E "s#proxy_pass http://(127\.0\.0\.1|localhost):[0-9]+#proxy_pass http://127.0.0.1:$PORT#g" "$SRC"
  sudo grep -n "proxy_pass" "$SRC"
  if sudo nginx -t; then sudo systemctl reload nginx; else sudo cp -p "$SRC.bak-portal-$TS" "$SRC"; echo "nginx -t failed — restored"; exit 95; fi
  curl -s -o /dev/null -w "https://client.virtanta.com/login: %{http_code}\n" https://client.virtanta.com/login ;;
nginx-rollback)
  SRC=$(site_for client.virtanta.com); LAST=$(ls -1t "$SRC".bak-portal-* 2>/dev/null | head -1); [ -n "$LAST" ] || { echo "no backup"; exit 96; }
  sudo cp -p "$LAST" "$SRC"; sudo nginx -t && sudo systemctl reload nginx && echo "restored $LAST" ;;
status) pm2 describe $NAME 2>/dev/null | grep -E "status|uptime|restarts" || echo "not running"; git -C "$APP" log --oneline -1 2>/dev/null || true ;;
*) sed -n '2,10p' "$0"; exit 2 ;;
esac
