#!/usr/bin/env bash
set -euo pipefail

echo "[studious-fortnight] Checking environment setup..."

if [ ! -f ".env" ] && [ -f ".env.example" ]; then
  cp .env.example .env
  echo "[studious-fortnight] Created .env from .env.example"
fi

if command -v python3 >/dev/null 2>&1 && [ -f "scripts/sync_stats.py" ]; then
  echo "[studious-fortnight] Fetching latest GitHub repository metrics..."
  python3 scripts/sync_stats.py || true
fi

echo "[studious-fortnight] Starting frontend and backend servers..."
npm run dev
