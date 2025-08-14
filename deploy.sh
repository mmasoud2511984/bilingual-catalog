#!/usr/bin/env bash
set -eu
set -x

APP_DIR="/root/bilingual-catalog/bilingual-catalog"
APP_NAME="bilingual-catalog"
BRANCH="main"
START_CMD="npm run start"  # تأكد أن package.json فيه "start": "next start -p 3000"

# منع توقف git لسؤال التأكيد
export GIT_SSH_COMMAND="ssh -o StrictHostKeyChecking=no"

cd "$APP_DIR"
git fetch --all --prune
git checkout "$BRANCH"
git pull --ff-only origin "$BRANCH"

npm ci --legacy-peer-deps --no-audit --no-fund --progress=false || npm install --legacy-peer-deps --no-audit --no-fund --progress=false


npm run build

if pm2 describe "$APP_NAME" > /dev/null; then
  pm2 restart "$APP_NAME" --update-env
else
  pm2 start "$START_CMD" --name "$APP_NAME" --cwd "$APP_DIR"
fi

pm2 save
echo "Deploy done ✅ ($APP_NAME)"
