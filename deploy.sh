#!/usr/bin/env bash
# Deploy arayucofe.com.cn personal site + workplace reply PWA.
set -euo pipefail

SERVER="root@43.156.9.167"
APP_ROOT="/opt/personal-portfolio"
SITE_DIR="$APP_ROOT/site"
PWA_DIR="$APP_ROOT/workplace-reply-pwa"
KEY_SOURCE="${MINIMAX_API_KEY_FILE:-/Users/yuzhu/local-projects/minimax key.md}"
REMOTE_KEY_DIR="/etc/workplace-reply-pwa"
REMOTE_KEY_FILE="$REMOTE_KEY_DIR/minimax.key"
SERVICE_NAME="workplace-reply-pwa"
NGINX_CONF="/etc/nginx/conf.d/openclaw.conf"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

cd "$SCRIPT_DIR"

if [[ ! -f "index.html" || ! -d "workplace-reply-pwa" ]]; then
  echo "Run this script from the Personal-portfolio project root."
  exit 1
fi

if [[ ! -f "$KEY_SOURCE" ]]; then
  echo "MiniMax key file not found: $KEY_SOURCE"
  echo "Set MINIMAX_API_KEY_FILE=/path/to/key before running deploy."
  exit 1
fi

echo "Preparing remote directories..."
ssh "$SERVER" "mkdir -p '$SITE_DIR' '$PWA_DIR' '$REMOTE_KEY_DIR'"

echo "Uploading personal site..."
rsync -az --delete \
  --exclude ".git" \
  --exclude "workplace-reply-pwa" \
  --exclude "deploy.sh" \
  ./ "$SERVER:$SITE_DIR/"

echo "Uploading workplace reply PWA..."
rsync -az --delete \
  --exclude ".git" \
  ./workplace-reply-pwa/ "$SERVER:$PWA_DIR/"

echo "Uploading MiniMax key to server-only path..."
scp "$KEY_SOURCE" "$SERVER:$REMOTE_KEY_FILE"
ssh "$SERVER" "chmod 700 '$REMOTE_KEY_DIR' && chmod 600 '$REMOTE_KEY_FILE'"

echo "Installing systemd service..."
ssh "$SERVER" "cat > /etc/systemd/system/$SERVICE_NAME.service" <<SERVICE
[Unit]
Description=Workplace Reply PWA backend
After=network.target

[Service]
Type=simple
WorkingDirectory=$PWA_DIR
Environment=NODE_ENV=production
Environment=HOST=127.0.0.1
Environment=PORT=5173
Environment=MINIMAX_API_KEY_FILE=$REMOTE_KEY_FILE
ExecStart=/usr/local/bin/node $PWA_DIR/server.js
Restart=always
RestartSec=3

[Install]
WantedBy=multi-user.target
SERVICE

echo "Installing nginx config..."
ssh "$SERVER" "cat > '$NGINX_CONF'" <<NGINX
server {
    listen 80;
    server_name arayucofe.com.cn www.arayucofe.com.cn;
    return 301 https://\$host\$request_uri;
}

server {
    listen 443 ssl;
    server_name arayucofe.com.cn www.arayucofe.com.cn;

    ssl_certificate /etc/letsencrypt/live/arayucofe.com.cn/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/arayucofe.com.cn/privkey.pem;
    include /etc/letsencrypt/options-ssl-nginx.conf;
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem;

    root $SITE_DIR;
    index index.html;

    location /workplace-reply-pwa/ {
        proxy_pass http://127.0.0.1:5173/workplace-reply-pwa/;
        proxy_http_version 1.1;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_read_timeout 90s;
        proxy_send_timeout 90s;
        proxy_connect_timeout 15s;
    }

    location / {
        try_files \$uri \$uri/ /index.html;
    }
}
NGINX

echo "Restarting services..."
ssh "$SERVER" "systemctl daemon-reload && systemctl enable --now '$SERVICE_NAME' && systemctl restart '$SERVICE_NAME' && nginx -t && systemctl reload nginx"

echo "Deployment complete:"
echo "  https://arayucofe.com.cn/"
echo "  https://arayucofe.com.cn/workplace-reply-pwa/"
