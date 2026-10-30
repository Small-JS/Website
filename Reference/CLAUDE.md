# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

The **Reference** subsite of the SmallJS website (git root is the parent `Website/` folder). It is the class reference for the SmallJS Smalltalk library, built as static HTML so search engines can index it. It is mostly shown inside an `<iframe>` in the main `../Website` site, but it can also run on its own.

The opened VSCode workspace (`Reference.code-workspace`) also contains `../../SmallJS/Smalltalk`, the Smalltalk class library the documentation is generated from.

## Commands

All scripts are bash (run them from Git Bash on Windows). There is no linter and there are no tests.

- `./build.sh`: compile the TypeScript in `src/` with `tsc` into `web/Reference/Reference/Script/`.
- `./clean.sh`: delete the generated `web/Reference/Reference/Pages` and `Script` folders.
- `./startWebServer.sh`: serve `web/` with no caching on port 3002 (`npx http-server`).
  Open http://localhost:3002/Reference/Reference.
- Full rebuild of the site: `../build.sh` builds TutorialBuilder, Tutorial, ReferenceBuilder, Reference and Website, in that order. SmallJS itself (`../../SmallJS/buildAll.sh`) must be built first.

Pressing F5 in VSCode starts the "Build Site" preLaunchTask from `.vscode/tasks.json`,
which runs the whole pipeline below. Its manual equivalent:

```sh
# 1. Extract class docs with the SmallJS compiler (-d) → Pages/DocumentedClasses.json
cd ../../SmallJS/Smalltalk && node ../Compiler/out/main.js -d -t . ../../Website/Reference/Pages
# 2. Generate the static HTML pages and index (ReferenceBuilder must already be built)
cd ../../Website/ReferenceBuilder && node out/main.js
```

A `tsc --watch` task starts automatically when the folder is opened.

## Architecture

The content is generated in three stages, spread over three projects:

1. **SmallJS compiler** (`-d` flag): reads the `.st` sources in `SmallJS/Smalltalk` and writes `Pages/DocumentedClasses.json`. This file is gitignored. It holds each class's name, path, module, superclass, vars, comment and its class and instance methods, with the first comment of each method.
2. **`../ReferenceBuilder`** (Node/TypeScript): reads that JSON, clears `web/Reference/Reference/Pages/` and regenerates it (gitignored):
   - one HTML page per class, made by merging `Pages/Template.html` (placeholders like `{class}` and `{methods}`). Pages go in the same folder hierarchy as the class's `.st` file path, e.g. `Pages/Core/Base/Object.html`.
   - `Pages/Index.html`, the navigation tree, built by scanning the generated pages into nested `<details>` elements. Class links get the id `<ClassName>Entry` and folders get `<Folder-Path>DirEntry`, e.g. `Core-BaseDirEntry`. The app looks up the current page's entry by that id, so class names must be unique.
   - a copy of `Pages/Home.html`.

   It also copies `Pages/DocumentedClasses.json` to `web/Reference/Reference/DocumentedClasses.json` (gitignored), which the search uses.
3. **This project's `src/`** (browser TypeScript, `ReferenceApp`): runs on every page. It replaces `<include src=...>` tags with fetched HTML (this is how the index gets into each page). It also opens the index tree at the current page's entry, filters the index by class name, or by method name when "Search methods" is checked, and toggles dark/light theme stored in `localStorage`. The theme button is hidden inside an iframe.

Points that take several files to understand:

- **Why there is a nested `web/Reference/Reference/` folder:** it matches the layout of the main Website project, which copies this folder to `Website/web/Reference/Reference`. Pages sit at different depths, so all shared resources (CSS, `Script/main.js`, `DocumentedClasses.json`, `Pages/Index.html`) use absolute paths that start with `/Reference/Reference/`. Keep that prefix when adding resources.
- On small screens (`max-width: 800px` in `default.css`) the menu button toggles the `indexPopup` class on `<body>`, which swaps the index and the page. Don't set inline `display` styles on `indexDiv` or `pageDiv`, because they would override the media query.
- `src/DocumentedClass.ts` and `src/DocumentedMethod.ts` are lightweight mirrors of classes with the same names in `ReferenceBuilder/src` and of the compiler's `CompiledClass`. If the JSON format changes, update them in every place.
- `Reference.md` still mentions `Pages/Index.json`. The actual source file is `Pages/DocumentedClasses.json`.

## Code style

Tabs for indentation, spaces inside parentheses (`foo( bar )`), opening braces on their own line for classes and methods, and ES modules with `.js` extensions in import paths. TypeScript runs in `strict` mode.
