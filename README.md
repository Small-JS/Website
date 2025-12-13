# SmallJS website

<img src="Website/web/SmallJS.png" alt="SmallJS logo" width="300"/>\

This folder contains the source of the official SmallJS website, hosted on:\
<a href="https://small-js.org" style="font-weight:bold; font-size:x-large">small-js.org</a>

If you want to improve the site, please create a pull-request on GitHub:\
<a href="https://github.com/Small-JS/SmallJS" style="font-weight:bold; font-size:x-large">github.com/Small-JS/SmallJS</a>
<br>

The site uses static HTML that can be hosted on any static webserver.
There are 3 subprojects. Click on the titles for details.

## [Website](Website/Website.md)

This is the main static website that has a copy of subsites:\
Examples, Playground and Tutorial.

## [Tutorial](Tutorial/Tutorial.md)

The tutorial subsite shows the page index and page content of the tutorial.\
It is designed to be included as an `<iframe>` in the main website,\
but it can also be run stand-alone for testing.

## [Tutorial Builder](TutorialBuilder/TutorialBuilder.md)

This project generates the tutorial index and pages,\
in the `./web` folder of the Tutorial subsite.

## Running

First build SmallJS swith `../SmallJS/buildAll.sh` to create the example apps and the Playground.\
Then run `build.sh` to build the TutorialBuilder, Tutorial and finally the Website.\
Go to the [Website](Website/Website.md) project to run the result.
