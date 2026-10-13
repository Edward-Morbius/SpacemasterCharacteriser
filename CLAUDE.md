# CLAUDE.md
Spacemaster 2e character sheet app (Svelte 5 + Vite + Dexie + vite-plugin-pwa). Static site, no backend. Repo: https://github.com/Edward-Morbius/SpacemasterCharacteriser (public, owner Edward-Morbius), live on GitHub Pages. See README.md for the user-facing description.

## Layout
- `src/App.svelte`: whole UI (tabs Sheet/Skills/Gear/Notes, bottom log panel).
- `src/lib/rules.js`: rulesets as data (`statTable`, `statDevPP`, `rankSteps`, `zero`, `levelBonus`), `RESISTANCES`, calculations, `newChar()`, `migrate()`, `d100()`. `SCHEMA` is the character schema version (currently 3).
- `src/lib/skills.js`: preset skills `[category, name, [1-3 stat codes]]` (155, from the group's Google Sheet tab `skill_list`).
- `src/lib/log.svelte.js`: session roll log (not saved). Any action can add rows with `logAdd({title,total,detail})`; `rollCheck(title,bonus,label)` rolls d100 + bonus + situation.
- `src/lib/store.svelte.js`: Dexie storage, export/import (`{app,schema,characters}`), migrates old characters on load/import.
- Style: dense, terse code (match it). Characters store raw inputs only; totals are always calculated.

## Rules decisions
- Stat bonus: Smoothed Stat Bonus Chart (Companion), verified against the Google Sheet `DATA` tab for stats 1-105. 101 = +30, 102+ = +35. Level bonus is omitted (flag unused).
- Rank bonus: 5/rank to 10, 2 to 20, 1 to 30, 0.5 beyond (beyond 30 is unconfirmed; the sheet stops at 30). Rank 0 = -25.
- Skill bonus = average of the skill's 1-3 stat totals, rounded half away from zero (like the sheet's ROUND); a repeated stat counts twice (e.g. AG,AG). No stats = 0.
- Stat total = stat bonus + Race + Misc. Resistance total = linked stat total + its own Race + Misc.
- Open-ended d100 (toggle, default on): 96-100 rerolls and adds while 96+; 01-05 rerolls once and subtracts. This is an assumption, easy to change in `d100()`.
- Only 10 stats (CO AG SD ME RE ST QU PR EM IN). The sheet also has Eloquence/Luck; deliberately ignored. The sheet's Essence resistance formula points at Memory by mistake; the app uses Empathy (EM) as labelled.
- The unused `statDevPP` table (development points, psion power points per stat) is stored for later; helper `statDevPP()`.

## Schema changes
Bump `SCHEMA` and add a step in `migrate()` for structural changes (done for v2 skill `stats` arrays, v3 `res`). Early development: breaking old characters is acceptable, but avoid crashes on load.

## Open TODO
1. Major house-rule revision is coming (about 80 skills, Alternity-style broad skills with specializations). Do NOT build the old-to-new converter until the new skill system is fixed. Planned design: mapping table as data, merge rule for collapsed ranks (group decision), review step for unmapped skills, before/after preview, always write a new copy, batch-convert an exported JSON.
2. Import a player's character from the group's Google Sheet (the sheet's link is deliberately not stored in the repo; ask the user for it or for an xlsx export; character tabs seen: "Prof. C. A.", "toco eer", "Mad Dog", "Parity", "Zero-G"). A public sheet can be fetched as xlsx via its `/export?format=xlsx` URL and read with openpyxl via `python3 -I`. Write a one-off converter, flag unplaceable data, check totals match the sheet.
3. Level bonus switch is stored but unused. Unknown whether the rank steps above 30 are right.
4. No automated tests. Logic checks were done with throwaway node scripts; the UI has only been tried manually in a browser.

## Working here
- Build: `npm install && npm run build`. Docker uses Node 20. On Node 18 the PWA step fails with `crypto is not defined`; use `NODE_OPTIONS=--experimental-global-webcrypto npm run build`.
- Service worker/PWA only works over HTTPS or localhost; test with `npm run preview`, not the dev server.
- Deploy: push to `main`; `.github/workflows/deploy.yml` builds and publishes to Pages (BASE_PATH comes from the repo name).
- Git in this container: `git config --global --add safe.directory /workspace` may be needed. Push with the token from `GITHUB_TOKEN` via a temporary header, never storing it in the remote URL: `git -c http.extraheader="Authorization: Basic $(printf 'x-access-token:%s' "$GITHUB_TOKEN" | base64 -w0)" push`. Commit messages end with the Co-Authored-By line given in the session's attribution reminder.
- Only commit or push when the user asks; a push redeploys the live site.
- Do not commit `screenshot.png` (scan of a Companion page, copyrighted; it is in `.gitignore`).
- Headless Firefox (`firefox-esr --headless --screenshot`) works for static layout checks only.
