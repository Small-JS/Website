# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

The git root of the SmallJS website, published at small-js.org. It holds five sub-projects, each with its own `CLAUDE.md`, plus bash scripts that run the same step across all of them:

- `TutorialBuilder/`: Node tool that generates the Tutorial pages.
- `Tutorial/`: the Tutorial subsite.
- `ReferenceBuilder/`: Node tool that generates the class Reference pages.
- `Reference/`: the Reference subsite.
- `Website/`: the main site, which copies in the built subsites.

`../SmallJS` is the main SmallJS repository, which sits next to this one. The build depends on it.

## Build scripts

All scripts are bash (run them from Git Bash on Windows). Each one changes to its own folder first, so it can be run from anywhere, and `set -e` stops it at the first failing step. There is no linter and there are no tests.

- `./install.sh`: checks that `code`, `node`, `npm`, `tsc` (must be installed globally) and `npx http-server` are available, then runs `install.sh` in TutorialBuilder and ReferenceBuilder. Run it once before the first build.
- `./build.sh`: runs `build.sh` in TutorialBuilder, Tutorial, ReferenceBuilder, Reference and Website, in that order. The order matters:
  - Each builder generates pages into its subsite, so it must run before that subsite.
  - Website runs last because it copies the built Tutorial and Reference into `Website/web/`.
  - ReferenceBuilder runs the SmallJS compiler (`../SmallJS/Compiler`), and Website copies the Playground and Examples from `../SmallJS`. So build SmallJS first with `../SmallJS/buildAll.sh`, including the compiler, the Playground and the examples. This script does not build them.
- `./clean.sh`: runs `clean.sh` in the same five projects, deleting compiled and generated output. It does not remove `node_modules`.
- `./update.sh -y`: updates the npm dependencies of TutorialBuilder and ReferenceBuilder to their latest versions. Without `-y` it aborts and changes nothing.
- `./zipit.sh`: zips this folder to `../Website.zip`, leaving out only big installed folders like `node_modules`. Smaller generated folders such as `out` are kept. It needs the `zip` command, which Git Bash doesn't include.

`build.sh` and `zipit.sh` pause for 2 seconds on exit, also when a step fails (`trap 'sleep 2' EXIT`), so the output stays readable when the script is started by double-clicking.

When you add a sub-project, add it to `build.sh` and `clean.sh` in the right order. If it has npm dependencies, add it to `install.sh` and `update.sh` as well.

## Running the result

Each subsite has its own `startWebServer.sh`, which serves its `web/` folder with `npx http-server` and caching turned off:

- Website: port 3000, http://localhost:3000
- Tutorial: port 3001, http://localhost:3001
- Reference: port 3002, http://localhost:3002

The published site is the static `Website/web/` folder, which can be hosted on any static web server.

## Other files

- `Build.code-workspace`: VSCode workspace for this root folder.
- `todo.txt`: the author's private notes. It is gitignored.
- `.gitignore`: also ignores `*.map`, `*.env`, `*.log`, `*.cmd`, `*.lnk` and `node_modules` in every sub-project.
