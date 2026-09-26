<div align="center">

# Sketchspace

### Wireframe quickly. Keep the idea moving.

A simple browser editor for rough layouts, interface ideas and early product flows.
Choose an element, place it on the canvas, and shape the screen without a heavy design tool.

[Open the editor](https://prostir-prototypiv.willkrof.chatgpt.site/) · [Meet Cadence](https://github.com/will-krof/cadence)

<br /><br />

<img src="docs/screenshots/editor.webp" alt="Sketchspace editor with a landing page wireframe on the canvas" width="100%" />

</div>

## Made for the first draft

| Build | Refine | Keep |
| --- | --- | --- |
| Search a palette of **97 elements**, grouped into basics, navigation, forms, content, devices and icons. | Edit text, list entries, dropdown options and table cells. Resize, zoom and arrange layers. | Save up to **10 private wireframes**, rename or delete them, and move designs through JSON or PNG exports. |

Sketchspace includes page variants for desktop, tablet and mobile work, plus device frames for iPhone, Samsung phones and tablets. The icon palette combines common interface symbols with familiar service marks in monochrome.

### Inside the editor

<table>
<tr>
<td width="50%"><img src="docs/screenshots/elements.webp" alt="Icon palette, selected card and editable properties in Sketchspace" /></td>
<td width="50%"><img src="docs/screenshots/wireframes.webp" alt="My wireframes dialog with saved designs and file actions" /></td>
</tr>
<tr>
<td><b>Edit in place.</b> Select an element to change its content, text size, dimensions and layer order. Search the palette to find the next piece.</td>
<td><b>Stay organized.</b> Open, rename and delete saved wireframes from one list. Export PNG or JSON, or import a JSON wireframe.</td>
</tr>
</table>

The screenshots show fictional demo wireframes.

## A quick workflow

1. Pick an element category or search the palette.
2. Click an element to add it to the canvas; drag it into place and resize it from the corner.
3. Use the properties panel to edit content and text size, or change which layer sits in front.
4. Open **My wireframes** to manage saved work and export the result.

| Gesture | Result |
| --- | --- |
| Drag across empty canvas | Select several elements |
| Shift + click | Add or remove an element from the selection |
| Shift + resize | Keep the element's proportions |
| Space + drag | Pan the canvas |
| Delete / Backspace | Remove selected elements |
| Ctrl/⌘ + Z | Undo; add Shift to redo |
| Arrow keys | Nudge selection; add Shift for a larger step |

## Build and test

Use Node.js 24 or newer. The storage tests use the built-in `node:sqlite` module.

```sh
npm install
npm run build
node --test tests/worker.test.mjs
```

The build embeds `dist/` assets into `dist/server/index.js`. The hosted editor uses a D1 database binding named `DB` and the hosting platform's authenticated user header; `.openai/hosting.json` identifies the existing Sites project. Opening the static HTML alone does not provide saved wireframes.

## Repository map

| Path | Purpose |
| --- | --- |
| `dist/` | Browser editor, styles and icon assets |
| `worker/` | Asset serving and wireframe storage API |
| `db/` and `drizzle/` | SQLite schema and migration |
| `scripts/build-site.cjs` | Bundles the Worker with editor assets |
| `tests/` | Storage API and security checks |

<div align="center"><sub>Sketchspace and <a href="https://github.com/will-krof/cadence">Cadence</a> share a visual language: navy chrome, quiet surfaces and lime accents.</sub></div>
