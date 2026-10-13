# Spacemaster Sheets
An online character sheet for **Spacemaster 2nd Edition** (with house rules). It runs in the browser, works offline once installed (PWA), and keeps all character data in the browser's own storage (IndexedDB), so there are no accounts and no server. Characters can be exported to and imported from JSON files for backup or to move them between devices.

Live: https://edward-morbius.github.io/SpacemasterCharacteriser/

Features:
- Stats (with race/misc bonuses), resistance rolls, skills (preset list of 155, 1-3 stats each), equipment, notes, portrait.
- d100 Roll buttons (open-ended optional) with a GM situation modifier and a roll log.
- Smoothed stat bonus table from the Spacemaster Companion; rules are data in `src/lib/rules.js`.

Data stays on the device and browser it was entered on. On iPad, use Share > Add to Home Screen so Safari does not evict the data. Use Export regularly.

## Development
Svelte 5 + Vite + Dexie + vite-plugin-pwa. See CLAUDE.md for the project notes.
- Develop: `npm install && npm run dev`
- Build: `npm run build` (output in `dist/`, works from any static host)
- Rules live in `src/lib/rules.js` (stat table, rank steps, zero-rank penalty).
- GitHub Pages: push to `main`, then Settings > Pages > Source: GitHub Actions.

## Docker
- Dev server: `docker compose up` then open http://localhost:5173
- Run a command inside: `docker compose exec dev npm run build`
- Production preview with PWA: `docker compose exec dev sh -c "npm run build && npm run preview"` then http://localhost:4173
- Without compose: `docker build -t sm-dev . && docker run --rm -it -p 5173:5173 -v "$PWD":/app -v sm_nm:/app/node_modules sm-dev`
