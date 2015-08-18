# modular-drum-app

Demo files for building a simple drum machine using modular architecture principles.

As seen in Net Magazine #268, 'Building A Drum Machine With Backbone.js'.

Screencast about the modular approach behind the project: ![netm.ag/backbonevid-268](http://netm.ag/backbonevid-268)

![App screenshot](https://dl.dropboxusercontent.com/u/42386473/modular-drum-app.png)

## Setup

The repo includes a pre-built JavaScript bundle for testing.

If you have Python installed, open a terminal in the repo root and run `python -m SimpleHTTPServer` to serve the files on a localhost port (:8000 by default).

Alternatively you can run the repo from within a regular *AMP setup.

## Editing

Install [Node](https://nodejs.org/) and [Gulp](https://github.com/gulpjs/gulp/blob/master/docs/getting-started.md).

Run `npm install` from the root.  This will install Browserify, Backbone and all other dependencies.

Run `gulp` from the root to build the JavaScript and start a watcher that will re-build if the files change.  JavaScript is bundled and output to the `dist` directory.


