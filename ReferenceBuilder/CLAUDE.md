# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

**ReferenceBuilder** is a Node/TypeScript command-line tool in the SmallJS website (git root is the parent `Website/` folder). It generates the static HTML class reference pages and the navigation index of the sibling **`../Reference`** subsite, so search engines can index them. It has no runtime dependencies, only Node's `fs` and `path`.

The opened VSCode workspace (`ReferenceBuilder.code-workspace`) also contains `../../SmallJS/Smalltalk`, the Smalltalk class library the documentation is generated from.

## Commands

All scripts are bash (run them from Git Bash on Windows). There is no linter and there are no tests.

- `./build.sh`: compile `src/` with `tsc` into `out/`, run the SmallJS compiler with `-d` to write `../Reference/Pages/DocumentedClasses.json`, then run `node out/main.js` to generate the pages. SmallJS itself (`../../SmallJS/buildAll.sh`) must be built first.
- `./clean.sh`: delete `out/`.
- `./install.sh`: `npm install`.
- `./update.sh -y`: update npm dependencies with `npm-check-updates`, then reinstall.
- Full rebuild of the site: `../build.sh` builds TutorialBuilder, Tutorial, ReferenceBuilder, Reference and Website, in that order. ReferenceBuilder must run before Reference.

A `tsc --watch` task starts automatically when the folder is opened. F5 runs `out/main.js` (via source maps on `src/main.ts`) after the "Compile class info" preLaunchTask in `.vscode/tasks.json`, which regenerates `../Reference/Pages/DocumentedClasses.json` just like `build.sh` does.

## Architecture

All paths are relative to this project folder, so the tool must be run with this folder as the working directory.

Input, all in `../Reference/Pages/`:
- `DocumentedClasses.json`, written by the SmallJS compiler (`-d`, gitignored). It holds each class's name, path, module, superclass, vars, comment and its class and instance methods, with the first comment of each method.
- `Template.html`, the page template with placeholders like `{class}`, `{superclass}` and `{methods}`.
- `Home.html`, copied as-is.

Output, all in `../Reference/web/Reference/Reference/` (gitignored):
- `Pages/`, which is deleted and regenerated on every run so pages of moved or removed classes disappear.
- `DocumentedClasses.json`, a copy of the input, used by the Reference site's search.

Flow (`main.ts` → `ReferenceBuilderApp.start()`):

1. `DocumentedClass.load()` parses the JSON into `DocumentedClass` and `DocumentedMethod` instances.
2. `ReferencePages.generate()` clears `Pages/`, copies `Home.html` and the JSON, and writes one page per class using `ReferenceTemplate.merge()`. Pages go in the same folder hierarchy as the class's `.st` file path, e.g. `Pages/Core/Base/Object.html`. The template merge throws if a placeholder is missing from the template or if a superclass can't be found. Methods are grouped by consecutive category, and comment newlines become `<br>`.
3. `ReferenceIndex.generate()` scans the generated `Pages/` folder (not the JSON) with `ReferenceEntry.fromDir()` and writes `Pages/Index.html` as nested `<details>` elements. Within each folder it lists files before subfolders, both sorted by name. Class links get the id `<ClassName>Entry` and folders get `<Folder-Path>DirEntry`, e.g. `Core-BaseDirEntry`. The Reference app looks up the current page's entry by that id, so class names must be unique.

Points that take several files to understand:

- Generated links use absolute URLs that start with `/Reference/Reference/Pages/`. That prefix matches the nested `web/Reference/Reference/` layout of the Reference and main Website projects. Keep it when generating links.
- `DocumentedClass.ts` and `DocumentedMethod.ts` mirror the compiler's `CompiledClass` and the classes with the same names in `../Reference/src`. If the JSON format changes, update them in every place.
- The placeholders in `ReferenceTemplate.merge()` must match `../Reference/Pages/Template.html`. Change both together.

## Code style

Tabs for indentation, spaces inside parentheses (`foo( bar )`), opening braces on their own line for classes and methods, and ES modules with `.js` extensions in import paths. TypeScript runs in `strict` mode with `module: NodeNext`.
