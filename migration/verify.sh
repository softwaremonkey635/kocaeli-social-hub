#!/bin/sh
# verify.sh - full gate for the Kocaeli Social Hub build.
#
# Steps:
#   1. npm ci                  (deps, from package-lock.json)
#   2. npx tsc --noEmit        (typecheck)
#   3. npm run build:static    (Vite build, then prerender, sitemap, feeds)
#   4. serve dist/ locally and run node tests/e2e-matrix.mjs
#
# Prints PASS/FAIL per step plus a SUMMARY line, and exits non-zero if any
# step fails. POSIX sh. It cd's to the repo root itself, so run it from
# anywhere.

set -eu

REPO_ROOT=$(CDPATH= cd -- "$(dirname -- "$0")/.." && pwd)
cd "$REPO_ROOT"

PORT=${PORT:-4173}
BASE_URL="http://127.0.0.1:${PORT}/"

# Same host path as bootstrap.sh; must match the install path.
export PLAYWRIGHT_BROWSERS_PATH="${PLAYWRIGHT_BROWSERS_PATH:-$HOME/pw-browsers}"

FAILED=0
step() {
  label="$1"
  shift
  echo "==> ${label}"
  if "$@"; then
    echo "    PASS: ${label}"
  else
    echo "    FAIL: ${label}"
    FAILED=1
  fi
}

# --- preconditions ---------------------------------------------------------
command -v node >/dev/null 2>&1 || {
  echo "FAIL: node not found. Enter the dev container first (see migration/distrobox/setup.sh)."
  exit 1
}
command -v npm >/dev/null 2>&1 || {
  echo "FAIL: npm not found. Enter the dev container first."
  exit 1
}

# The static build and the E2E matrix both need Playwright. It is not a
# package.json dependency, so install it without touching package.json.
if ! node -e "require.resolve('playwright')" >/dev/null 2>&1; then
  echo "==> installing playwright (not saved to package.json)"
  step "install playwright" npm install --no-save playwright
  step "install chromium headless shell" npx playwright install --with-deps --only-shell chromium
fi

# The E2E matrix writes its JSON summary here.
mkdir -p /tmp/opencode

# --- run the gate ----------------------------------------------------------
step "install dependencies (npm ci)" npm ci
step "typecheck (tsc --noEmit)" npx tsc --noEmit
step "full static build" npm run build:static

# --- e2e against a locally served build -----------------------------------
if [ "$FAILED" -eq 0 ]; then
  echo "==> serving dist/ on ${BASE_URL}"
  npx --yes serve dist -l "$PORT" >/tmp/opencode/serve.log 2>&1 &
  SERVER_PID=$!
  trap 'kill "$SERVER_PID" 2>/dev/null || true' EXIT INT TERM

  i=0
  while [ "$i" -lt 60 ]; do
    if node -e "fetch('${BASE_URL}').then(function(){process.exit(0)}).catch(function(){process.exit(1)})" >/dev/null 2>&1; then
      break
    fi
    i=$((i + 1))
    sleep 1
  done
  if [ "$i" -ge 60 ]; then
    echo "    FAIL: the local server did not answer on ${BASE_URL} within 60s (see /tmp/opencode/serve.log)"
    FAILED=1
  else
    step "e2e matrix (node tests/e2e-matrix.mjs)" node tests/e2e-matrix.mjs "$BASE_URL"
  fi
else
  echo "==> skipping e2e: an earlier step failed"
fi

# --- summary ---------------------------------------------------------------
echo
if [ "$FAILED" -eq 0 ]; then
  echo "SUMMARY: PASS"
else
  echo "SUMMARY: FAIL"
  exit 1
fi
