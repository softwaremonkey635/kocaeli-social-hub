#!/bin/sh
# bootstrap.sh - idempotent setup, build, and unit test for Kocaeli Social Hub.
#
# POSIX sh. Run it on a normal Linux host or inside the dev container:
#   sh migration/bootstrap.sh
#
# Steps: detect Node, install deps, install Playwright, typecheck, full static
# build, unit test. Prints a PASS/FAIL summary and exits non-zero on failure.

set -eu

REPO_ROOT=$(CDPATH= cd -- "$(dirname -- "$0")/.." && pwd)
cd "$REPO_ROOT"

# Playwright browser cache lives on a host path so it survives container
# rebuilds. The value used here must match the one used to install the
# browser. See migration/NOTES-FROM-RESEARCH.md.
export PLAYWRIGHT_BROWSERS_PATH="${PLAYWRIGHT_BROWSERS_PATH:-$HOME/pw-browsers}"

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

NODE_VERSION=$(node -v)
NODE_NUM=${NODE_VERSION#v}
NODE_MAJOR=${NODE_NUM%%.*}
NODE_REST=${NODE_NUM#*.}
NODE_MINOR=${NODE_REST%%.*}
echo "==> node ${NODE_VERSION}"

# Vite 8 supports 20.19+ and 22.12+ (and any later major). Node 21 and
# 22.0 through 22.11 are outside that range, so a bare "major >= 20" check
# is too loose and would let a broken toolchain through.
NODE_OK=0
if [ "$NODE_MAJOR" -eq 20 ] && [ "$NODE_MINOR" -ge 19 ]; then NODE_OK=1; fi
if [ "$NODE_MAJOR" -eq 22 ] && [ "$NODE_MINOR" -ge 12 ]; then NODE_OK=1; fi
if [ "$NODE_MAJOR" -ge 23 ]; then NODE_OK=1; fi
if [ "$NODE_OK" -ne 1 ]; then
  echo "FAIL: Vite 8 needs Node 20.19+ or 22.12+. Found ${NODE_VERSION}."
  echo "      Use Node 20.19 or newer, or 22.12 or newer. The dev container"
  echo "      installs the Fedora nodejs24 package, which satisfies this."
  exit 1
fi

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

# --- install deps ----------------------------------------------------------
# The repo standardized on package-lock.json (bun.lock was dropped), so
# `npm ci` is the default. Fall back to `npm install` only if the lockfile
# is missing.
if [ -f package-lock.json ]; then
  step "install dependencies (npm ci)" npm ci
else
  step "install dependencies (npm install)" npm install
fi

# Playwright is not a package.json dependency, but the static build and the
# E2E matrix both need it. Install it without saving, then ensure the browser.
# `--with-deps` installs the OS libraries via the system package manager and
# may ask for the container user's sudo password.
step "install playwright (not saved to package.json)" npm install --no-save playwright
step "install chromium headless shell" \
  npx playwright install --with-deps --only-shell chromium

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
