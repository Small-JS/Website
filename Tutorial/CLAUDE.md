# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

The **Tutorial** subsite of the SmallJS website (git root is the parent `Website/` folder). It is the SmallJS language and library tutorial, built as static HTML so search engines can index it. It is mostly shown inside an `<iframe>` in the main `../Website` site, but it can also run on its own.

## Commands

All scripts are bash (run them from Git Bash on Windows). There is no linter and there are no tests.

- `./build.sh`: compile the TypeScript in `src/` with `tsc` into `web/Tutorial/Tutorial/Script/`. It does not generate the pages.
- `./clean.sh`: delete the generated `web/Tutorial/Tutorial/Pages` and `Script` folders.
- `./startWebServer.sh`: serve `web/` with no caching on port 3001 (`npx http-server`).
  Open http://localhost:3001.
- Full rebuild of the site: `../build.sh` builds TutorialBuilder, Tutorial, ReferenceBuilder, Reference and Website, in that order.

Pressing F5 in VSCode (Chrome, Edge or Firefox launch configuration) first runs the "Build Site" preLaunchTask from `.vscode/tasks.json`. It runs `node out/main.js` in `../TutorialBuilder`, which must already be built, to regenerate the pages. The web server must already be running.

A `tsc --watch` task starts automatically when the folder is opened.

## Architecture

The content is generated in two stages, spread over two projects:

1. **`../TutorialBuilder`** (Node/TypeScript): reads the sources in `Pages/`, clears `web/Tutorial/Tutorial/Pages/` and regenerates it (gitignored):
   - one HTML page per `.html` fragment in `Pages/`, made by merging it into `Pages/-Template.html` at the `{tutorialPage}` placeholder. Pages keep the same folder hierarchy. Other files, such as images, are copied as-is.
   - `Pages/-Index.html`, the navigation tree, built from the `-Index.json` files as nested `<details>` elements.

   Files and folders whose name starts with `-` are not copied.
2. **This project's `src/`** (browser TypeScript, `TutorialApp`): runs on every page. It replaces `<include src=...>` tags with fetched HTML (this is how the index gets into each page). It also opens the index tree at the current page's entry, handles the previous/next buttons, adds a copy-to-clipboard button after each `.codeBlock` element, and toggles dark/light theme stored in `localStorage`. The theme button is hidden inside an iframe.

Adding or renaming a page:

- Each folder in `Pages/` has a `-Index.json` with an array of page titles, in display order.
- A page's file name is its title with non-word characters removed, e.g. "Browser App" → `BrowserApp.html`. Its subpages go in a folder with the same base name, e.g. `Language/`, which needs its own `-Index.json`.
- A page takes both the `.html` file and the entry in `-Index.json`. A file without an entry is still generated but does not appear in the navigation, and the app throws on it because it cannot find its index entry. TutorialBuilder throws on an entry without a file.
- Page files are HTML fragments, not full documents. They use classes from `default.css` such as `tutorialTitle`, `tutorialHeading1`, `tutorialText`, `codeBlock`, `screenShot` and `screenPart`. Images next to the page can be referenced by relative path.

Points that take several files to understand:

- **Why there is a nested `web/Tutorial/Tutorial/` folder:** it matches the layout of the main Website project, which copies this folder to `Website/web/Tutorial/Tutorial`. Pages sit at different depths, so all shared resources (CSS, images, `Script/main.js`, `Pages/-Index.html`) use absolute paths that start with `/Tutorial/Tutorial/`. Keep that prefix when adding resources.
- The app finds the current page's index entry by matching `window.location.pathname` exactly against the `href` of the index links. Previous/next navigation walks the sibling elements of that `<details>` tree, so it depends on the exact markup TutorialBuilder generates.
- The element ids in `-Template.html` (`darkCssLink`, `themeButton`, `menuButton`, `previousButton`, `nextButton`, `advanceButton`, `indexDiv`, `pageDiv`) are looked up by `TutorialApp.bindElements()`, which throws if one is missing or has a different tag. Change both together.
- On small screens (`max-width: 800px` in `default.css`) the menu button toggles the `indexPopup` class on `<body>`, which swaps the index and the page. Don't set inline `display` styles on `indexDiv` or `pageDiv`, because they would override the media query.
- `Tutorial.md` says to open `Website.code-workspace`. The workspace of this project is `Tutorial.code-workspace`.

## Code style

Tabs for indentation, spaces inside parentheses (`foo( bar )`), opening braces on their own line for classes and methods, and ES modules with `.js` extensions in import paths. TypeScript runs in `strict` mode.
