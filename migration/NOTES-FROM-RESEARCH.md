# Notes from research: distrobox Node pack

Source: `data/opencode/search-results/2026-10-07/distrobox-node-packaging.md`
(SearXNG dig plus official docs, 2026-10-07). Each line is tagged [VERIFIED] with
its URL, or [UNVERIFIED] where the research could not source it.

## distrobox assemble

- `distrobox assemble create --file distrobox.ini` is the verified entry point. `--replace` forces replacement of same-named containers; `--dry-run` prints the generated command without running it. [VERIFIED] https://distrobox.it/usage/distrobox-assemble/
- Manifest keys used in `kocaeli.ini`: `image`, `additional_packages` (a string_list; declare it several times to compound), `home`, `pull`, `replace`, `start_now`, `init`. [VERIFIED] https://distrobox.it/usage/distrobox-assemble/
- `home` is a string ("Which home directory should the container use"); the docs show literal values such as `/tmp/home` and `/home/luca-linux/dbox`. Shell-variable expansion in the manifest is not documented. [VERIFIED] https://distrobox.it/usage/distrobox-assemble/ (expansion itself [UNVERIFIED])
- `start_now` and `init` are booleans, both default false. [VERIFIED] https://distrobox.it/usage/distrobox-assemble/

## Node pinning

- Chosen: Fedora's `nodejs24` distro package plus `nodejs24-npm-bin` for npm. This matches the repo's `.nvmrc` (24) and satisfies `engines.node` (`>=22`). [VERIFIED] https://github.com/abulka/dev-images
- Rejected alternative: fnm, nvm, or corepack. They add shell hooks and a per-user install step; the distro package is baked into the image and survives container rebuilds. [VERIFIED] https://github.com/abulka/dev-images
- The repo sets no `packageManager` field, so there is no corepack pin to honour. [VERIFIED] repo `package.json`, read 2026-10-07
- `nodejs24` on `fedora-toolbox:44` specifically: the research example uses that pair. [VERIFIED] https://github.com/abulka/dev-images

## node_modules

- Install `node_modules` inside the container, not on the host. Native modules such as sharp and esbuild compile against the container's glibc, so a host-built binary may fail to load. [UNVERIFIED] general knowledge, no direct source in the research run
- A dedicated container `home` keeps `node_modules` on a container-native path and survives rebuilds. [VERIFIED] https://github.com/abulka/dev-images

## Playwright

- Set `PLAYWRIGHT_BROWSERS_PATH` to a host path (for example `$HOME/pw-browsers`) so the browser cache survives container rebuilds. The value used at `install` must match the value used at launch. [VERIFIED] https://playwright.dev/docs/browsers and https://qaskills.sh/blog/playwright-browsers-path-environment-variable-guide
- Headless-only install: `npx playwright install --with-deps --only-shell chromium`. `--with-deps` installs the OS libraries (libnss3, libatk, libgbm, and others) via the system package manager, which needs root inside the container. [VERIFIED] https://playwright.dev/docs/browsers
- Distrobox runs as a normal user, so the Chromium sandbox should work. Add `--no-sandbox` only if a sandbox crash appears. [VERIFIED] https://playwright.dev/docs/docker

## Risks leaving the flatpak sandbox

- Path and `/tmp` isolation: flatpak keeps `/tmp` inside the sandbox, while distrobox gives the container its own `/tmp` or a host bind mount. Code that assumed the host `/tmp` must be re-checked. [VERIFIED] https://docs.flatpak.org/en/latest/sandboxing.html
- Missing host tools: flatpak SDKs ship a minimal toolset. `git`, `curl`, `vim`, and `htop` come from `dnf` inside the container; `flatpak` itself is not needed there. [VERIFIED] https://github.com/89luca89/distrobox
- Fonts for headless Chromium: flatpak cannot install font packages easily. In distrobox install `fontconfig liberation-fonts noto-sans-fonts` and run `fc-cache -f`. Missing fonts cause blank or invisible text in screenshots and PDFs. [VERIFIED] https://github.com/Killthebug/headless-browser-setup/blob/main/references/font-setup.md
- The CJK font package name for Fedora (`noto-sans-cjk-fonts`) is general knowledge. [UNVERIFIED] Not needed for Turkish text.
