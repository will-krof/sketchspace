# Sketchspace

A simple browser-based wireframe editor. Add elements to a canvas, edit their content, arrange layers, and save up to ten wireframes.

## Features

- Categorized elements, device frames, and search
- Editable text, lists, dropdown options, and table cells
- Multi-selection, proportional resizing, layer order, zoom, undo, and redo
- Private saved wireframes, JSON import/export, and PNG export

## Project structure

- `dist/` — browser editor and assets
- `worker/` — Cloudflare Worker serving the editor and storage API
- `db/` and `drizzle/` — SQLite schema and migration
- `scripts/build-site.cjs` — builds the Worker with embedded assets
- `tests/` — storage API and security checks

## Build and test

Use Node.js with the built-in `node:sqlite` module.

```sh
node scripts/build-site.cjs
node --test tests/worker.test.mjs
```

The deployed site uses a D1 database binding named `DB` and the hosting platform's authenticated user header. `.openai/hosting.json` identifies the existing Sites project.

