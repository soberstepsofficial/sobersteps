# TO-DO — SoberSteps website (short roadmap)

This is the working TO-DO list for the frontend. Items below reflect the current priorities and known blockers.

1. Waiting on backend (BLOCKER)
   - Description: Backend endpoints (articles, user state, wellness tracker persistence) are not yet available. Frontend integrations that require live data should be stubbed or mocked until backend is provided.
   - Action: Add a simple mock adapter in `src/mocks/` or use static JSON in `src/assets/` for local dev.

2. Update article section & add articles with read time (HIGH)
   - Description: The articles/knowledge section currently contains placeholders. Replace placeholders with actual article items and include a `readTime` (minutes) property so the UI can show estimated reading duration.
   - Files to change: `src/App.jsx` (routes), component(s) under `src/components/` or `src/pages/articles/` (create if missing).
   - Notes: Store article metadata (title, slug, summary, readTime, contentPath) in JSON or fetch from API when backend is ready.

3. Fix miscellaneous buttons (MEDIUM)
   - Description: Several buttons have incorrect handlers or missing aria labels. Audit the app for non-working buttons (signup, navigation, CTA) and add tests or manual checks.
   - Files to change: likely in `src/components/*` and `src/App.jsx`.

4. Make wellness tracker slider smoother (LOW)
   - Description: The slider feels choppy. Consider using CSS transitions, reducing step increments, or using a slider component with inertial/momentum behavior.
   - Files to change: component where the slider lives (search for `input type="range"` or `slider` in `src/`).

5. Remove the notes the previous help added (DONE)
   - Description: The README previously included a "Want more?" notes block. That section has been removed and replaced with a direct link to `DEPLOY_VERCEL.md` and the `LICENSE`.

6. Deploy guide (Vercel) (DOCUMENTATION)
   - Description: Add `DEPLOY_VERCEL.md` with step-by-step instructions for deploying the site to Vercel. See `DEPLOY_VERCEL.md`.

7. Misc
   - Add a screenshot or demo GIF to `public/` for marketing / PR pages (see `DEPLOY_VERCEL.md` explanation for where to place and reference these).

Estimated timebox suggestions (very rough):
- Waiting on backend: depends on backend
- Articles: 4–12 hours - if manual write, if not, then 1 hour at max. (gather content + wire components)
- Buttons audit/fixes: 10-30 minutes
- Slider improvements: 10-30 minutes
