<div align="center">

# Sketchspace

### A simple space for your next interface idea.

Sketchspace is a **Windows and macOS desktop wireframe editor** for quick layouts and early product flows. Place elements, edit their content, and keep up to ten wireframes with up to five pages each on your computer. The editor works offline.

[Download the latest release](https://github.com/will-krof/sketchspace/releases/latest) · [See Cadence](https://github.com/will-krof/cadence)

<br /><br />

<img src="docs/screenshots/editor.webp" alt="Sketchspace wireframe editor" width="100%" />

</div>

## Install on Windows

Download and run `Sketchspace-Setup-*.exe` from the [latest release](https://github.com/will-krof/sketchspace/releases/latest), or install with one PowerShell line:

```powershell
irm https://raw.githubusercontent.com/will-krof/sketchspace/main/scripts/install.ps1 | iex
```

The script downloads the latest GitHub Release, verifies its published SHA-512 checksum, and runs the installer. Installation and the launch-time update check need internet access; editing and local saving do not.

## Install on macOS

The macOS release contains a **universal** app for Apple Silicon and Intel Macs. Download `Sketchspace-mac-universal.dmg` from the [latest release](https://github.com/will-krof/sketchspace/releases/latest), open it, and drag **Sketchspace** to **Applications**. Launch it from Applications so updates can replace the installed app. You can also install it in `~/Applications` with one Terminal command:

```sh
curl -fsSL https://raw.githubusercontent.com/will-krof/sketchspace/main/scripts/install-mac.sh | sh
```

The script verifies the published SHA-512 checksum and macOS code signature, installs the app for the current user, and opens it. Quit Sketchspace before running the script again. Installation and update checks need internet access; editing and local saving do not.

**The macOS download will appear after Apple signing is configured.** See [macOS release setup](#macos-release-setup). The release workflow skips the macOS artifact until then; it does not publish an unsigned app that cannot reliably update.

### Windows SmartScreen

The current GitHub installer is **unsigned**, so Windows may show “Windows protected your PC.” A SHA-512 checksum verifies the downloaded file against the published release, but it does not establish a trusted publisher identity. Code signing requires a verified publisher and a trusted signing certificate or Microsoft Artifact Signing account. Once available, add `WIN_CSC_LINK` and `WIN_CSC_KEY_PASSWORD` as GitHub Actions secrets; the release workflow will sign the installer and fail if the resulting signature is invalid. Even signed new releases can show a SmartScreen prompt until publisher or file reputation builds. [Microsoft explains how SmartScreen reputation works](https://learn.microsoft.com/en-us/windows/apps/package-and-deploy/smartscreen-reputation).

## What you can make

| Build | Refine | Keep |
| --- | --- | --- |
| Search **99 elements** across basics, navigation, forms, content, devices and icons. Add arrows to show connections between elements. | Edit breadcrumbs, list entries, dropdown options and table cells. Choose progress levels and a font for each element. Resize, zoom and arrange layers. | Save up to **10 wireframes locally**, with **5 pages per wireframe**. Rename, delete, reveal the storage file, import JSON, or export JSON and PNG. |

Each page has its own desktop, tablet and mobile canvases. The device elements include iPhone, Samsung, tablet and VR tablet frames. The monochrome icon palette contains common interface symbols and familiar service marks.

<table>
<tr>
<td width="50%"><img src="docs/screenshots/elements.webp" alt="Icon palette, selected card and editable properties" /></td>
<td width="50%"><img src="docs/screenshots/wireframes.webp" alt="My wireframes dialog with saved designs" /></td>
</tr>
<tr>
<td><b>Edit in place.</b> Select an element to change its content, size and layer order.</td>
<td><b>Keep your work close.</b> Your wireframes live in the app's per-user data directory on this computer.</td>
</tr>
</table>

The screenshots use fictional demo wireframes.

## Updates

Sketchspace checks GitHub Releases **once each time the app starts**, shortly after the editor opens. If a newer version is available, an **Update** button appears in the top bar. Click it to download the update, then choose **Restart to update**. Sketchspace saves pending edits before restarting. On macOS, the updater uses the signed ZIP in the same release as the DMG.

There is no periodic update check while Sketchspace remains open or sits in the tray/menu bar. If a new release is published during that time, choose **Quit Sketchspace** from the tray/menu bar menu and start the app again to see the update. An offline or failed check does not interrupt editing; the next launch tries again.

Each push to `main` runs the desktop release workflow. It builds and tests the app, gives it a new version, and publishes a GitHub Release with Windows installer/update metadata and, when Apple signing is configured, macOS DMG/ZIP/update metadata. A failed required build does not publish an update. The workflow can also be run manually from GitHub Actions.

## Your wireframes and the tray

Closing the window hides Sketchspace in the Windows notification area or macOS menu bar. Choose **Open Sketchspace** from its icon to return. Choose **Quit Sketchspace** from that menu, or use the standard macOS Quit command, to exit completely; the app waits for pending edits to save first. If saving fails, the editor stays open so you can retry. Starting Sketchspace while it is already running brings the existing window forward and does not start another update check.

Wireframes are saved to a local `wireframes.json` file in Electron's per-user data directory. They are not uploaded to GitHub or synchronized between computers. Existing single-page wireframes open as Page 1. To move work from the earlier web editor, export each wireframe as JSON there and import it through **My wireframes** in the desktop app.

The folder icon in **My wireframes** opens Explorer or Finder with `wireframes.json` selected. All wireframes on that computer are stored in this one file.

## Performance and security

The editor has an animated loading overlay and uses software compositing on Windows to reduce intermittent whole-window flashes seen with some GPU and driver combinations. Electron may show several Sketchspace processes because the window, app and utility work run separately. There is no continuous background rendering loop or update polling.

The Electron renderer is sandboxed and isolated from Node.js. A restricted custom protocol serves bundled assets, navigation and browser permissions are denied, and the main process accepts storage requests only from the editor's main frame. Saved documents have structure and size limits. Packaged builds disable unused Electron features and validate the ASAR archive.

Local writes are queued, atomic and asynchronous; a cache avoids reparsing the whole library on each edit. Run `pnpm bench:storage` to measure storage performance on your computer. The release workflow runs tests and audits production dependencies before packaging. The Windows installer remains unsigned until a verified publisher certificate or Artifact Signing account is configured.

## A quick workflow

1. Pick an element category or search the palette.
2. Use **+ Page** to add pages, then switch between them in the page bar. Use the pencil button or double-click a selected tab to rename it, then click **Save**. Delete the selected page there too.
3. Click an element to add it to the current canvas; drag and resize it.
4. Use the properties panel to edit content, text size and layer order.
5. To show a connection, Shift-click two elements and add **Arrow** from Basic. You can also add a free arrow and choose its **From** and **To** elements in the properties panel. Connected arrows follow their endpoints.
6. Open **My wireframes** to organize saved work or export the current page as PNG.

| Gesture | Result |
| --- | --- |
| Drag across empty canvas | Select several elements |
| Shift + click | Add or remove an element from selection |
| Shift + resize | Keep the element's proportions |
| Space + drag | Pan the canvas |
| Delete / Backspace | Remove selected elements |
| Ctrl + Z (Windows) / Cmd + Z (macOS) | Undo; add Shift to redo |
| Arrow keys | Nudge selection; add Shift for a larger step |

## Build from source

Use Node.js 24 or newer and pnpm 11. On Windows or macOS:

```sh
pnpm install
pnpm build
pnpm test
pnpm desktop:dev
```

On Windows, build a local installer with `pnpm desktop:dist`. On macOS, build a local ad hoc signed app for development with `pnpm desktop:mac:pack` (output: `$TMPDIR/sketchspace-local-release/`); a Developer ID signed and notarized release DMG/ZIP uses `pnpm desktop:mac:dist` with the Apple credentials below (output: `release/`). The updater is active in packaged builds, but a local development build is only for testing and cannot install public updates. The existing `pnpm build` command also builds the legacy hosted Worker; the desktop app uses the same editor assets and its own local storage bridge.

### macOS release setup

Add these GitHub Actions repository secrets before publishing macOS builds:

| Secret | Value |
| --- | --- |
| `MAC_CSC_LINK` | Base64-encoded Developer ID Application `.p12` certificate |
| `MAC_CSC_KEY_PASSWORD` | Password for that certificate |
| `APPLE_ID` | Apple Developer account email |
| `APPLE_APP_SPECIFIC_PASSWORD` | App-specific password for notarization |
| `APPLE_TEAM_ID` | Apple Developer team ID |

When all five are present, the next push to `main` (or a manual **Desktop release** run in GitHub Actions) builds one universal macOS app, signs and notarizes it, verifies its signature and ticket, and uploads its DMG, ZIP, SHA-512 checksum and `latest-mac.yml` beside the Windows files. The same version number is used on both platforms. Until then, Windows releases continue and the macOS build is skipped.

| Path | Purpose |
| --- | --- |
| `dist/` | Shared editor UI, styles and icons |
| `desktop/` | Secure Electron shell, local storage and update bridge |
| `assets/` | App icons for Windows and macOS |
| `scripts/install.ps1`, `scripts/install-mac.sh` | One-line installer helpers |
| `.github/workflows/desktop-release.yml` | Build and publish desktop releases |
| `worker/`, `db/`, `drizzle/` | Earlier hosted storage backend |

<div align="center"><sub>Sketchspace and <a href="https://github.com/will-krof/cadence">Cadence</a> share a visual language: navy chrome, quiet surfaces and lime accents.</sub></div>
