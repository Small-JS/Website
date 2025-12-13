# SmallJS Tutorial

The tutorial subsite shows the page index and page content of the tutorial.\
It is designed to be included as an `<iframe>` in the main website,\
but it can also be run stand-alone for testing.

The content source files are in the `/Pages` folder.\
The [TutorialBuilder](../TutorialBuilder/TutorialBuilder.md)
generates the static web pages into a `/web` subfolder.\
This facilitates referencing of tutorial pages indexing by search engines.

## Web folder base

Most website files are in the subfolder: `/web/Tutorial/Tutorial/`.\
This folder structure is needed to keep it identical to the main website project.\
This is needed because Tutorial pages are at different levels in the folder hierarchy\
that require absolute paths to load shared components.

## Index

The file `./Pages/-Index.json` contains the hierarchy titles of the tutorial pages.\
The filenames of the tutorial pages are generated form their titles\
by removing non-alphabetial characters and appending `*.html`.

## Pages & template

Tutorial page files must be placed in the subfolder hiearchy indicated in the index,\
e.g.: `./Pages/Language/Arrays.html`.\
They are HTML fragments that are merged with `./Pages/-Template.html` on building.

## Running

First start the standard Node.js webserver with: `startWebServer.sh`.\
Then open `Website.code-workspace` with VSCode.\
Maybe select a browser you want to test with in the launch configuration.\
Then press `[F5]` to launch it.\
Running the project first generates the HTML for the tutorial index and templated pages.
