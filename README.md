# SoberSteps

SoberSteps — the website frontend. This repository is a Vite + React single-page app styled with Tailwind CSS.

## At a glance

- Framework: React (v19)
- Dev server & build: Vite
- Styling: Tailwind CSS + PostCSS
- Router: react-router-dom
- Icons: lucide-react

This README includes quick local dev, build, and deployment instructions and points to the key files to edit.

## Quick start

1. Install dependencies

```bash
npm install
```

2. Start development server (HMR):

```bash
npm run dev
```

Open the address printed by Vite (usually http://localhost:5173).

## Build & preview

Make a production build:

```bash
npm run build
```

Preview the production build locally:

```bash
npm run preview
```

## Scripts (from package.json)

- `dev` — vite dev server
- `build` — vite build
- `preview` — vite preview
- `lint` — eslint .

## Key files and where to make changes

- `src/main.jsx` — app boot/renderer; where providers and router are mounted
- `src/App.jsx` — main application component and routing (add pages/routes here)
- `src/index.css` — global styles; imports Tailwind directives
- `tailwind.config.js` — configure colors/utilities and safelist classes
- `vite.config.js` — Vite plugins and build tweaks
- `public/` — static assets served as-is
- `src/assets/` — images and assets that go through bundling

Editing notes:
- Add new pages under `src/pages/` (or `src/`) and register routes in `src/App.jsx`.
- Use Tailwind utility classes for UI; extend tokens in `tailwind.config.js` if needed.

## Linting

Run ESLint across the project with:

```bash
npm run lint
```

## Deployment

The site builds to `dist/`. Deploy to any static host (Vercel, Netlify, GitHub Pages, S3). For client-side routing, ensure 404s are rewritten to `index.html`.

## Conventions and repo-specific patterns

- Utility-first styling: Tailwind classes in JSX are the primary styling approach.
- Icons used as React components from `lucide-react`.
- Keep publicly served static files in `public/`. Use `src/assets/` when assets are referenced/imported in code.

## Deployment notes & license

See the repository `LICENSE` file (MIT) for licensing details: `./LICENSE`.

For a platform-specific Vercel guide, see `DEPLOY_VERCEL.md` in the repo root.

---

If anything here should be different (preferred commands, hosting provider, or extra notes), tell me and I will update the README.