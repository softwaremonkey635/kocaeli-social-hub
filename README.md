<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://ai.google.dev/static/site-assets/images/share-ais-513315318.png" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/a6ccd9d3-be77-442b-a4c7-73c211eb9ad1

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`

## Build base

`vite.config.ts` reads the base path from `APP_BASE`, defaulting to `/`. The
production host serves the site from the domain root, so a plain build is
enough:

```
npx vite build
```

The GitHub Pages test build runs under a subpath and needs the base set:

```
APP_BASE=/kocaeli-social-hub/ npx vite build
```

Routing is History-API based (`/events`, `/guide`, and so on), so the server
must answer unknown paths with `index.html`. Local checks use a static server
with that fallback.
