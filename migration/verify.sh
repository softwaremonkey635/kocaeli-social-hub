#!/bin/sh
# verify.sh - full gate for the Kocaeli Social Hub build.
#
# Steps:
#   1. npm ci                  (deps, from package-lock.json)
#   2. npx tsc --noEmit        (typecheck)
#   3. npm run test:calendar   (unit test)
#   4. npm run build:static    (Vite build, then prerender, sitemap, feeds)
#   5. serve dist/ locally and run node tests/e2e-matrix.mjs
#
# Prints PASS/FAIL per step plus a SUMMARY line, and exits non-zero if any
# step fails. POSIX sh. It cd's to the repo root itself, so run it from
# anywhere.

set -eu

SCRIPT_DIR=$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)
REPO_ROOT=$(CDPATH= cd -- "$SCRIPT_DIR/.." && pwd)
cd "$REPO_ROOT"

PORT=${PORT:-4173}
BASE_URL="http://127.0.0.1:${PORT}/"

# Scratch lives beside this script, so the gate never depends on a fixed
# absolute path that only exists in one sandbox.
WORK_DIR="$SCRIPT_DIR/.verify-run"
mkdir -p "$WORK_DIR"
SERVE_LOG="$WORK_DIR/serve.log"

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

# --- run the gate ----------------------------------------------------------
step "install dependencies (npm ci)" npm ci
step "typecheck (tsc --noEmit)" npx tsc --noEmit
step "unit test (calendar)" npm run test:calendar
step "full static build" npm run build:static

# --- e2e against a locally served build -----------------------------------
if [ "$FAILED" -eq 0 ]; then
  echo "==> serving dist/ on ${BASE_URL}"
  # --single rewrites unknown paths to index.html. The committed e2e matrix
  # asserts that an unknown path resolves to home, so the SPA fallback is
  # required; without it every unknown path 404s and the matrix can never pass.
  npx --yes serve --single dist -l "$PORT" >"$SERVE_LOG" 2>&1 &
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
    echo "    FAIL: the local server did not answer on ${BASE_URL} within 60s (see ${SERVE_LOG})"
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
