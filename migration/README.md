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
| `distrobox/kocaeli.ini` | Distrobox manifest that defines the dev container. |
| `distrobox/setup.sh` | Creates the container and checks the pinned Node inside it. |
| `bootstrap.sh` | Detects Node, installs deps, builds, runs the unit test, prints PASS/FAIL. |
| `verify.sh` | Typechecks, runs the full static build, then the Playwright E2E matrix. |
| `HANDOVER-CHECKLIST.md` | What to check after the move, plus the list of sandbox-only details. |
| `OWNER-INPUTS.md` | The short list of facts only the owner can supply. |

## Run order on a fresh Distrobox system

1. Read `MANIFEST.md` and `OWNER-INPUTS.md`.
2. Clone the repo and enter it:
   `git clone https://github.com/softwaremonkey635/kocaeli-social-hub.git`
   then `cd kocaeli-social-hub`.
3. Create the dev container: `sh migration/distrobox/setup.sh`.
   The script uses `distrobox assemble` when your version has it and falls
   back to `distrobox create`. Both use only flags verified against the
   current Distrobox docs.
4. Enter the container: `distrobox enter kocaeli`.
5. From the repo root, inside the container, run
   `bash migration/bootstrap.sh`. This installs dependencies, runs the
   typecheck, runs the full static build, and runs the unit test.
6. Run the full gate: `sh migration/verify.sh`. It typechecks, rebuilds,
   serves `dist/` locally, and runs the Playwright E2E matrix. It exits
   non-zero on any failure.
7. Work through `HANDOVER-CHECKLIST.md` before you call the move done.

## Node version

Vite 8 needs Node 20.19 or newer, or 22.12 or newer. The container pins the
Node 22 LTS image, which satisfies that range. `bootstrap.sh` refuses to run
on an older Node.
