#!/bin/sh
# setup.sh - create the Kocaeli Social Hub dev container with a pinned Node.
#
# Uses `distrobox assemble` with kocaeli.ini when the installed version has
# it, and falls back to `distrobox create`. Flags were verified on 2026-10-07
# against the Distrobox docs:
#   https://distrobox.it/usage/distrobox-create/
#   https://distrobox.it/usage/distrobox-assemble/
# Anything not verifiable is marked UNVERIFIED in a comment.
#
# POSIX sh. Run it from anywhere; it finds kocaeli.ini next to itself.

set -eu

HERE=$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)
INI="$HERE/kocaeli.ini"
NAME=kocaeli
IMAGE=node:22-bookworm
PACKAGES="git ca-certificates"

command -v distrobox >/dev/null 2>&1 || {
  echo "FAIL: distrobox not found on PATH. Install it first (Bazzite ships it)."
  exit 1
}

if distrobox assemble --help >/dev/null 2>&1; then
  echo "==> distrobox assemble create --file $INI --replace"
  # The subcommand is `create` in current Distrobox. If your version differs,
  # run `distrobox assemble --help`.
  # UNVERIFIED: some older versions accept only `distrobox assemble --file <ini>`.
  distrobox assemble create --file "$INI" --replace
else
  echo "==> distrobox create (assemble unavailable on this version)"
  # Verified flags: --name, --image, --additional-packages, --pull, --yes.
  # UNVERIFIED: a --replace flag on `distrobox create`. The documented way to
  # replace is to remove first, which is what the next line does.
  distrobox rm -f "$NAME" >/dev/null 2>&1 || true
  distrobox create --name "$NAME" --image "$IMAGE" \
    --additional-packages "$PACKAGES" --pull --yes
fi

echo "==> checking Node inside the container"
NODE_V=$(distrobox enter "$NAME" -- node -v)
echo "    node $NODE_V"

echo
echo "Container '$NAME' is ready."
echo "Next steps:"
echo "  distrobox enter $NAME"
echo "  bash migration/bootstrap.sh"
echo "  sh migration/verify.sh"
