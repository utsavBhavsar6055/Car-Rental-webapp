#!/usr/bin/env bash

set -u

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

if [[ -x "$ROOT_DIR/.venv/bin/python" ]]; then
  PYTHON="$ROOT_DIR/.venv/bin/python"
else
  PYTHON="${PYTHON:-python3}"
fi

cleanup() {
  kill "$FRONTEND_PID" "$BACKEND_PID" 2>/dev/null || true
  wait "$FRONTEND_PID" "$BACKEND_PID" 2>/dev/null || true
}

trap cleanup INT TERM EXIT

(cd "$ROOT_DIR/frontend" && npm run dev) &
FRONTEND_PID=$!

(cd "$ROOT_DIR" && "$PYTHON" -m uvicorn backend.main:app --reload) &
BACKEND_PID=$!

wait -n "$FRONTEND_PID" "$BACKEND_PID"