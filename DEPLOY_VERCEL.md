# How to Deploy the website to Vercel.

1) Fork & Connect the repository
   - Fork the github repository.
   - Go to https://vercel.com/
   - Import the forked repository.

2) Build settings
   - Framework preset: `Vite` (Vercel typically detects and chooses this setting automatically.)
   - Build command: `npm run build`
   - Output directory: `dist` (Normally, should not need to change anything)

3) Environment variables
   - None at the moment.
   - Though, in the future, if the backend were to be implimented this would be crucial in order for the app to properly work. Steps to do so: Prefix environmental variables in the app, and prefix them with `VITE_` (Vite requirement) and add them in Vercel's environment variables panel.

4) Troubleshooting
   - If static assets 404: ensure assets referenced with absolute paths exist in `public/` or are imported from `src/assets/`.
   - If routes 404 on refresh: ensure the rewrite above is present or use Vercel's SPA settings.
   - If you have additional errors, please create an issue in the issues tab (or [click here](https://github.com/soberstepsofficial/sobersteps/issues))