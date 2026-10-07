#!/usr/bin/env bash
# bootstrap.sh - idempotent setup, build, and unit test for Kocaeli Social Hub.
#
# This is the one script in the pack that needs bash, for `set -o pipefail`.
# Every other script is POSIX sh.
#
# Run it on a normal Linux host or inside the dev container:
#   bash migration/bootstrap.sh
#
# Steps: detect Node, install deps, install Playwright, typecheck, full static
# build, unit test. Prints a PASS/FAIL summary and exits non-zero on failure.

set -euo pipefail

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$REPO_ROOT"

# --- detect Node -----------------------------------------------------------
if ! command -v node >/dev/null 2>&1; then
  echo "FAIL: node not found on PATH."
  echo "      Create and enter the dev container first:"
  echo "        sh migration/distrobox/setup.sh"
  echo "        distrobox enter kocaeli"
  exit 1
fi
if ! command -v npm >/dev/null 2>&1; then
  echo "FAIL: npm not found on PATH."
  exit 1
fi

NODE_VERSION="$(node -v)"
NODE_MAJOR="${NODE_VERSION#v}"
NODE_MAJOR="${NODE_MAJOR%%.*}"
echo "==> node ${NODE_VERSION}"
if [ "$NODE_MAJOR" -lt 20 ]; then
  echo "FAIL: Vite 8 needs Node 20.19+ or 22.12+. Found ${NODE_VERSION}."
  exit 1
fi

FAILED=0
step() {
  local label="$1"
  shift
  echo "==> ${label}"
  if "$@"; then
    echo "    PASS: ${label}"
  else
    echo "    FAIL: ${label}"
    FAILED=1
  fi
}

# --- install deps ----------------------------------------------------------
if [ -f package-lock.json ]; then
  step "install dependencies (npm ci)" npm ci
else
  step "install dependencies (npm install)" npm install
fi

# Playwright is not a package.json dependency, but the static build and the
# E2E matrix both need it. Install it without saving, then ensure the browser.
step "install playwright (not saved to package.json)" npm install --no-save playwright
step "install chromium browser" npx playwright install chromium

# --- build and test --------------------------------------------------------
step "typecheck (tsc --noEmit)" npm run lint
step "full static build" npm run build:static
step "unit test (calendar)" npm run test:calendar

# --- summary ---------------------------------------------------------------
echo
if [ "$FAILED" -eq 0 ]; then
  echo "SUMMARY: PASS"
else
  echo "SUMMARY: FAIL"
  exit 1
fi
