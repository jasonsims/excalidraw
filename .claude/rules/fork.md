# Fork rules

This repo is `jasonsims/excalidraw`, a fork of `excalidraw/excalidraw`. These rules apply on top of `CLAUDE.md` and `AGENTS.md`, which belong to upstream. Read `FORK.md` for the full picture.

## Do not edit upstream-owned instruction files

- Never edit `CLAUDE.md` or `AGENTS.md`. Upstream changes them, and any edit here becomes a merge conflict on the next sync.
- Fork-specific instructions go in this directory (`.claude/rules/`). Update this file, don't add to `CLAUDE.md`.
- `.claude` is listed in upstream's `.gitignore`, so a new file under it needs `git add -f`. Files that are already tracked behave normally.

## Branches

- `master` mirrors `upstream/master`. Never commit to it, never open a PR into it. Only `git merge --ff-only upstream/master`.
- `deploy` is the fork's branch and what gets deployed. All fork work goes through PRs into `deploy`.
- Branch work off `deploy`, not `master`.

## Keep the diff against upstream as small as possible

Every line changed in an upstream file is a future merge conflict. Before editing, ask whether the change can be done with configuration, a new file, or a wrapper instead.

- Prefer new files and folders (for example `api/`, `excalidraw-app/fork/`) over edits to existing files.
- Prefer configuration (env vars, `vercel.json`) over code.
- Do not reformat, rename, reorder imports in, or refactor upstream files.
- When an edit to an upstream file is unavoidable, keep it small and mark it with a `// FORK:` comment so `grep -rn "FORK:"` lists every divergence.
- Add an entry to the "Changes from upstream" table in `FORK.md` for every change on `deploy`. Name the files and give the reason.
- If a change would be useful to everyone, say so. It may belong upstream instead.

## Pendo / Novus instrumentation

- `window.pendo` is typed in exactly one place, `packages/excalidraw/global.d.ts`. Add new Pendo methods there. Do not declare `Window.pendo` anywhere else, because two declarations conflict and break the typecheck and the build.
- The URL fragment carries collaboration and share-link encryption keys (`#room=<id>,<key>`, `#json=<id>,<key>`). Never send fragment values, scene contents, or keys to Pendo.
- The editor package (`packages/excalidraw`) must keep working when `window.pendo` is absent. Guard every call.

## Before committing

- Use Node 24 (`nvm use 24`). Local default Node may be older.
- Run `yarn test:typecheck`, then `yarn build` for anything that touches app or package code. A failing typecheck also fails the production build.
- Run `yarn test:update` and `yarn fix` as `CLAUDE.md` says.
- Commit messages and PR titles follow upstream's conventional style, for example `feat(app): ...`, `fix(editor): ...`, `docs(fork): ...`.

## Syncing with upstream

Follow "Syncing with upstream" in `FORK.md`. Sync through a `sync/upstream-YYYY-MM` branch and a PR into `deploy`, never directly.
