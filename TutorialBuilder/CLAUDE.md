# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

**TutorialBuilder** is a Node/TypeScript command-line tool in the SmallJS website (git root is the parent `Website/` folder). It generates the static HTML tutorial pages and the navigation index of the sibling **`../Tutorial`** subsite, so search engines can index them. It has no runtime dependencies, only Node's `fs` and `path`.

## Commands

All scripts are bash (run them from Git Bash on Windows). There is no linter and there are no tests.

- `./build.sh`: compile `src/` with `tsc` into `out/`, then run `node out/main.js` to generate the pages.
- `./clean.sh`: delete `out/`.
- `./install.sh`: `npm install`.
- `./update.sh -y`: update npm dependencies with `npm-check-updates`, then reinstall.
- Full rebuild of the site: `../build.sh` builds TutorialBuilder, Tutorial, ReferenceBuilder, Reference and Website, in that order. TutorialBuilder must run before Tutorial.

A `tsc --watch` task starts automatically when the folder is opened. F5 runs `out/main.js` (via source maps on `src/main.ts`); it has no preLaunchTask, so it relies on the watch task having compiled the code.

## Architecture

All paths are relative to this project folder, so the tool must be run with this folder as the working directory.

Input, all in `../Tutorial/Pages/`:
- `-Index.json` in each folder: an array of page titles, in display order.
- `<Title>.html`: HTML fragments for each page. The file name is the title with non-word characters removed (`TutorialEntry.baseName()`), e.g. "Browser App" → `BrowserApp.html`. A page's subpages go in a folder with the same base name, e.g. `Language/`, which has its own `-Index.json`.
- `-Template.html`, the page template with the `{tutorialPage}` placeholder.

Output, all in `../Tutorial/web/Tutorial/Tutorial/Pages/` (gitignored):
- `-Index.html`, the navigation index, which the template pulls in with `<include src="/Tutorial/Tutorial/Pages/-Index.html">`.
- One page per source `.html` file, in the same folder hierarchy. Other files (e.g. images) are copied as-is.

Flow (`main.ts` → `TutorialBuilderApp.start()`):

1. `TutorialIndex.load()` reads `-Index.json` files recursively with `TutorialEntry.fromDir()`, descending into a subfolder when one exists with the entry's base name. That subfolder must have its own `-Index.json`. It throws if two titles in one folder map to the same file name.
2. `TutorialPages.convert()` deletes and recreates the output `Pages/` folder, so pages of removed or renamed titles disappear. It then walks `../Tutorial/Pages/` recursively, merges each `.html` file into the template with `TutorialTemplate.merge()` and copies the other files. Files and folders whose name starts with `-` are skipped at any depth. The template load throws if `{tutorialPage}` is missing.
3. `TutorialIndex.save()` writes `-Index.html` as nested `<details>` elements. It must run after step 2, which would delete it. Entries with subentries become `<details>` with a `tutorialIndexEntryBranch` link in the `<summary>`; leaf entries get the class `tutorialIndexEntry`. Titles are HTML-escaped. It throws if a page listed in `-Index.json` has no `.html` file.

Points that take several files to understand:

- Generated links use absolute URLs that start with `/Tutorial/Tutorial/Pages/`. That prefix matches the nested `web/Tutorial/Tutorial/` layout of the Tutorial and main Website projects. Keep it when generating links.
- Adding a page takes both a `.html` file and an entry in the `-Index.json` of its folder. A file without an index entry is still converted but does not appear in the navigation.
- The `{tutorialPage}` placeholder in `TutorialTemplate.ts` must match `../Tutorial/Pages/-Template.html`. Change both together.

## Code style

Tabs for indentation, spaces inside parentheses (`foo( bar )`), opening braces on their own line for classes and methods, and ES modules with `.js` extensions in import paths. TypeScript runs in `strict` mode with `module: NodeNext`.
