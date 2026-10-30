# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

The main **Website** project of the SmallJS website, published at small-js.org (git root is the parent `Website/` folder). It is a static site of hand-written HTML pages. The Tutorial, Reference, Playground and Examples are separate projects whose built output is copied into this site and shown inside `<iframe>` elements.

## Commands

All scripts are bash (run them from Git Bash on Windows). There is no linter and there are no tests.

- `./build.sh`: compile the TypeScript in `src/` with `tsc` into `web/Script/`, then copy the built subsites into `web/`. The subsites must be built beforehand:
  - `../Tutorial/web/Tutorial/Tutorial` → `web/Tutorial/Tutorial`
  - `../Reference/web/Reference/Reference` → `web/Reference/Reference`
  - `../../SmallJS/Playground/web` → `web/Playground/Playground`
  - `../../SmallJS/Examples/<Name>/web` → `web/Examples/<Name>` for Counter, Todo, Balls, Benchmark, WebWorkers and PWA.

  `../../SmallJS` is the main SmallJS repository, which sits next to this git repository.
- `./clean.sh`: delete `web/Script` and all copied subsite folders. Keep it in step with the copy steps in `build.sh`.
- `./startWebServer.sh`: serve `web/` with no caching on port 3000 (`npx http-server`).
  Open http://localhost:3000.
- Full rebuild of the site: `../build.sh` builds TutorialBuilder, Tutorial, ReferenceBuilder, Reference and Website, in that order. It does not build the Playground or Examples in the SmallJS repository.

Pressing F5 in VSCode (Chrome, Edge or Firefox launch configuration) opens http://localhost:3000. There is no preLaunchTask, so the web server must already be running. A `tsc --watch` task starts automatically when the folder is opened.

All copied folders, and `web/Script`, are gitignored.

## Architecture

`web/` is the site root. Each section has its own folder with the same layout:

- `<Section>/<Section>.html`: the page, e.g. `Home/Home.html`.
- `<Section>/<Section>.css` and `<Section>/<Section>Dark.css`: its light and dark styles.
- `<Section>/index.html`: a meta-refresh redirect to the page, so `/Home/` works. The redirect path must be absolute for the web host (PorkBun). `web/index.html` redirects to `/Home/Home.html`.

The sections are Home, News, Installing, Examples, Playground, Tutorial and Reference. Tutorial, Reference and Playground pages contain little more than the navigation bar and an iframe that loads `<Section>/index.html` from the copied subsite. The Examples page has one iframe per example app.

`src/` (browser TypeScript, `Website` class) runs on every page through `/Script/main.js`. It replaces `<include src=...>` tags with fetched HTML, which is how `NavBar/NavBar.html` gets into each page. Then it binds elements and applies the dark/light theme stored in `localStorage` under `darkTheme`.

Points that take several files to understand:

- Every page needs the element ids that `Website.bindElements()` looks up, and it throws if one is missing or has a different tag: `darkCssLink` (`<link>` in the page's `<head>`), and `navBarDarkCssLink` and `themeButton`, which come from `NavBar.html`. A new page must have a `darkCssLink` and include the navigation bar.
- Toggling the theme reloads the whole page so the subsites in iframes pick up the new theme. The Tutorial and Reference read the same `localStorage` key, which works because they are served from the same origin. They hide their own theme button when they run inside an iframe.
- `NavBar.html` uses absolute paths starting with `/`, because it is included in pages at different depths. Pages refer to their own CSS by relative path and to `/Script/main.js` by absolute path.
- Adding a section takes a new folder with the files above and a link in `NavBar.html`. Adding an example app takes a copy step in `build.sh`, a delete step in `clean.sh`, an entry in `.gitignore` and an iframe section in `Examples/Examples.html`.

## Code style

Tabs for indentation, spaces inside parentheses (`foo( bar )`), opening braces on their own line for classes and methods, and ES modules with `.js` extensions in import paths. TypeScript runs in `strict` mode.
