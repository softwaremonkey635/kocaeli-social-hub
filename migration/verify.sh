#!/bin/sh
# verify.sh - full gate for the Kocaeli Social Hub build.
#
# Steps:
#   1. npx tsc --noEmit        (typecheck)
#   2. npm run build:static    (Vite build, then prerender, sitemap, feeds)
#   3. serve dist/ locally and run node tests/e2e-matrix.mjs
#
# Prints PASS/FAIL per step and exits non-zero if any step fails.
# POSIX sh. It cd's to the repo root itself, so run it from anywhere.

set -eu

REPO_ROOT=$(CDPATH= cd -- "$(dirname -- "$0")/.." && pwd)
cd "$REPO_ROOT"

PORT=${PORT:-4173}
BASE_URL="http://127.0.0.1:${PORT}/"

fail() {
  echo "FAIL: $1"
  exit 1
}

# --- preconditions ---------------------------------------------------------
command -v node >/dev/null 2>&1 || fail "node not found. Enter the dev container first (see migration/distrobox/setup.sh)."
command -v npm >/dev/null 2>&1 || fail "npm not found. Enter the dev container first."

# The static build and the E2E matrix both need Playwright. It is not a
# package.json dependency, so install it without touching package.json.
if ! node -e "require.resolve('playwright')" >/dev/null 2>&1; then
  echo "==> installing playwright (not saved to package.json)"
  npm install --no-save playwright || fail "could not install playwright"
  npx playwright install chromium || fail "could not install the chromium browser"
fi

# The E2E matrix writes its JSON summary here.
mkdir -p /tmp/opencode

# --- 1. typecheck ----------------------------------------------------------
echo "==> npx tsc --noEmit"
npx tsc --noEmit || fail "typecheck failed"

# --- 2. full static build --------------------------------------------------
echo "==> npm run build:static"
npm run build:static || fail "static build failed"

# --- 3. e2e against a locally served build ---------------------------------
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
[ "$i" -lt 60 ] || fail "the local server did not answer on ${BASE_URL} within 60s (see /tmp/opencode/serve.log)"

echo "==> node tests/e2e-matrix.mjs ${BASE_URL}"
node tests/e2e-matrix.mjs "$BASE_URL" || fail "e2e matrix failed"

echo "SUMMARY: PASS"
