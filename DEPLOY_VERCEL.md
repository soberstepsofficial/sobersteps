# Deploy to Vercel — SoberSteps

This file contains a short, copy-paste friendly guide to deploy the SoberSteps site to Vercel.

1) Connect repository
   - Go to https://vercel.com and import the GitHub repository `soberstepsofficial/sobersteps`.

2) Build settings
   - Framework preset: `Vite` (Vercel usually detects this automatically).
   - Build command: `npm run build`
   - Output directory: `dist`

3) Environment variables
   - If you use runtime environment variables in the app, prefix them with `VITE_` (Vite requirement) and add them in Vercel's environment variables panel.

4) Client-side routing (single-page app)
   - Vercel will serve the `dist` folder and handle SPA routing by default. If you need an explicit rewrite, add a `vercel.json` at the repo root with:

```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

5) Optional: automatic deploys
   - Push to `main` (or your configured production branch) and Vercel will run the build and publish the site.

6) Troubleshooting
   - If static assets 404: ensure assets referenced with absolute paths exist in `public/` or are imported from `src/assets/`.
   - If routes 404 on refresh: ensure the rewrite above is present or use Vercel's SPA settings.

7) Screenshot / demo GIF explanation
   - What this means: include a small PNG or GIF demonstrating the app UI or a short interaction. Put the file in `public/` (e.g., `public/screenshot.png` or `public/demo.gif`). Files in `public/` are served at the site root (for example `https://your-site.vercel.app/screenshot.png`) and are not processed by the bundler.
   - Use cases: marketing pages, README images, or preview images for social sharing.

If you want, I can create a `public/demo.gif` placeholder and add a short banner to the homepage that references it. Tell me which image (screenshot vs GIF) you prefer.
