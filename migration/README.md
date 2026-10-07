# Kocaeli Social Hub migration pack

This folder carries what a fresh machine needs to take over the Kocaeli
Social Hub site. It was written after the project left the opencode flatpak
sandbox, so the commands here assume a normal Linux host and a Distrobox dev
container instead of a flatpak.

## Who this is for

The operator who inherits the repo on a new Bazzite or Fedora system. You
need basic terminal comfort. You do not need the old sandbox, the flatpak,
or any of its hidden paths.

## What is in the pack

| File | Purpose |
|---|---|
| `MANIFEST.md` | Project identity, environment variables, commands, runtime services, repo layout. Read this first. |
| `distrobox/kocaeli.ini` | Distrobox assemble manifest that defines the dev container. |
| `distrobox/setup.sh` | Runs `distrobox assemble create` and checks the pinned Node inside the container. |
| `bootstrap.sh` | Detects Node, installs deps, builds, runs the unit test, prints PASS/FAIL. |
| `verify.sh` | Typechecks, runs the full static build, then the Playwright E2E matrix. |
| `HANDOVER-CHECKLIST.md` | What to check after the move, plus the list of sandbox-only details. |
| `OWNER-INPUTS.md` | The short list of facts only the owner can supply. |
| `NOTES-FROM-RESEARCH.md` | Sourced notes behind the container and Playwright choices, each line tagged VERIFIED or UNVERIFIED. |

## Run order on a fresh Distrobox system

1. Read `MANIFEST.md` and `OWNER-INPUTS.md`.
2. Clone the repo and enter it:
   `git clone https://github.com/softwaremonkey635/kocaeli-social-hub.git`
   then `cd kocaeli-social-hub`.
3. Create the dev container: `sh migration/distrobox/setup.sh`.
   It runs `distrobox assemble create --file migration/distrobox/kocaeli.ini`,
   which builds the Fedora 44 toolbox image and installs Node 24 from the
   Fedora distro package. A `distrobox create` fallback covers older versions.
4. Enter the container: `distrobox enter kocaeli`.
5. From the repo root, inside the container, run
   `sh migration/bootstrap.sh`. This installs dependencies, runs the
   typecheck, runs the full static build, and runs the unit test.
6. Run the full gate: `sh migration/verify.sh`. It typechecks, rebuilds,
   serves `dist/` locally, and runs the Playwright E2E matrix. It exits
   non-zero on any failure.
7. Work through `HANDOVER-CHECKLIST.md` before you call the move done.

## Node version

Vite 8 needs Node 20.19 or newer, or 22.12 or newer. The container installs
the Fedora `nodejs24` distro package, which matches the repo `.nvmrc` (24) and
satisfies that range. `bootstrap.sh` refuses to run on an older Node.
