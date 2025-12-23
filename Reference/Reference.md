# SmallJS Class Reference

The Reference subsite documentation for all SmallJS classes.\
It is designed to be included as an `<iframe>` in the main website,\
but it can also be run stand-alone for testing.

The content source is in the `/Pages` folder.\
The [ReferenceBuilder](../ReferenceBuilder/ReferenceBuilder.md)
generates the static web pages into a `/web` subfolder.\
This facilitates referencing of reference pages indexing by search engines.

## Web folder base

Most website files are in the subfolder: `/web/Reference/Reference`.\
This folder structure is needed to keep it identical to the main website project.\
This is needed because Reference pages are at different levels in the folder hierarchy\
that require absolute paths to load shared components.

## Index

The file `./Pages/Index.json` contains the class documentation for the reference pages,\
in the same folder hierarchy as the SmallJS Smalltalk library.\
The filenames of the reference pages are generated form the class names.

## Template

The class info in the JSON wile is merged with `./Pages/Template.html` on building.

## Running

First start the standard Node.js webserver with: `startWebServer.sh`.\
Then open `Reference.code-workspace` with VSCode.\
Maybe select a browser you want to test with in the launch configuration.\
Then press `[F5]` to launch it.\
Running the project first runs the ReferenceBuilder,\
that generates the HTML for the reference pages and the navigation index.
