# FORK.md

This is `jasonsims/excalidraw`, a fork of [`excalidraw/excalidraw`](https://github.com/excalidraw/excalidraw). This file records how the fork is maintained and every way it differs from upstream.

## Branches

| Branch | Purpose |
| --- | --- |
| `master` | Clean mirror of `upstream/master`. Fast-forward only. Never commit here. |
| `deploy` | `master` plus this fork's changes. This is what gets deployed. |

## Remotes

| Remote     | URL                     |
| ---------- | ----------------------- |
| `origin`   | `jasonsims/excalidraw`  |
| `upstream` | `excalidraw/excalidraw` |

`git rerere` is enabled so conflict resolutions are remembered between syncs.

## Syncing with upstream

Sync regularly (weekly or monthly). Small, frequent syncs are much easier than one large one.

```bash
git fetch upstream
git checkout master && git merge --ff-only upstream/master
git push origin master

git checkout -b sync/upstream-YYYY-MM deploy
git merge master
yarn test:typecheck && yarn test:update
```

Open a PR from the `sync/*` branch into `deploy`, check the Vercel preview, then merge. After resolving conflicts, check the "Changes from upstream" list below.

## Rules for keeping the diff small

- Prefer configuration (env vars, `vercel.json`) over editing upstream source.
- Put new code in new files or folders (for example `api/`) so it can't conflict.
- Don't reformat or refactor upstream files.
- Mark unavoidable edits to upstream files with a `// FORK:` comment so `grep -rn "FORK:"` finds them all.
- Contribute generic fixes upstream so they stop being this fork's burden.

## Deployment

- Host: Vercel, project imported from this repo.
- Production branch: `deploy` (Settings → Git).
- Root directory: `./`, preset Vite, build command `yarn build`, output directory `excalidraw-app/build` (set in `vercel.json`).
- Node.js: 22.x or 24.x (Node 20 is deprecated).
- Environment variables:
  - `VITE_APP_DISABLE_SENTRY=true`
- `VITE_APP_*` values are baked in at build time, so changing them needs a new build.

## Backends

By default the app points at excalidraw.com's hosted services via `.env.production`. Only the editor itself is expected to work until backends are set up.

| Feature | Env var(s) | Status |
| --- | --- | --- |
| Share links | `VITE_APP_BACKEND_V2_GET_URL`, `VITE_APP_BACKEND_V2_POST_URL` | Not set up |
| Live collaboration | `VITE_APP_WS_SERVER_URL`, `VITE_APP_FIREBASE_CONFIG` | Not set up |
| AI (text-to-diagram, diagram-to-code) | `VITE_APP_AI_BACKEND` | Not set up |

## Changes from upstream

Add an entry here for every change on `deploy`, with the file(s) and the reason.

| Date | Files | Change | Why |
| --- | --- | --- | --- |
| 2026-10-13 | `excalidraw-app/index.html`, `excalidraw-app/index.tsx` | Install the Novus by Pendo web SDK: install snippet in `<head>`, anonymous `pendo.initialize` at app start. A `location` transform records only the URL fragment's parameter names. | Product analytics for this deployment. The fragment carries the collaboration and share-link encryption keys, which must not reach Pendo. |
| 2026-10-13 | `packages/excalidraw/analytics.ts`, `packages/excalidraw/components/TTDDialog/*` | `trackAgent` helper, and Pendo agent analytics on the text-to-diagram chat (prompt, response, retry and undo reactions). | Agent analytics for the AI chat. |
| 2026-10-13 | `packages/excalidraw/global.d.ts` | The only declaration of `Window.pendo`, with `initialize`, `track` and `trackAgent`. `excalidraw-app/global.d.ts` is identical to upstream. | Two separate declarations of `Window.pendo` conflicted and broke the typecheck and the production build. |
| 2026-10-13 | About 50 files in `excalidraw-app/` and `packages/excalidraw/` (`analytics.ts`, actions, `App.tsx`, collab, library, TTD, export) | Pendo track events through `trackPendoEvent`, 45 named events, plus optional `source` arguments on a few internal functions. `loadFileToCanvas` and `exportToExcalidrawPlus` now require a new argument. | Product analytics on editor and app usage. No URLs, keys or user content are sent. **High conflict risk on upstream sync.** |

## Known items to revisit

- `vercel.json` has headers and redirects hardcoded for excalidraw.com (CORS origin, `vscode.excalidraw.com`, `/webex`). Change them if fonts or assets fail to load on this deployment's domain.
- Links to Excalidraw+ remain in the app.
