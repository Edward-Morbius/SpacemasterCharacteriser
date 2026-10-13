# Spacemaster Sheets
Svelte 5 + Vite + Dexie + vite-plugin-pwa.
- Develop: `npm install && npm run dev`
- Build: `npm run build` (output in `dist/`, works from any static host)
- Rules live in `src/lib/rules.js` (stat table, rank steps, zero-rank penalty).
- GitHub Pages: push to `main`, then Settings > Pages > Source: GitHub Actions.

## Docker
- Dev server: `docker compose up` then open http://localhost:5173
- Run a command inside: `docker compose exec dev npm run build`
- Production preview with PWA: `docker compose exec dev sh -c "npm run build && npm run preview"` then http://localhost:4173
- Without compose: `docker build -t sm-dev . && docker run --rm -it -p 5173:5173 -v "$PWD":/app -v sm_nm:/app/node_modules sm-dev`
