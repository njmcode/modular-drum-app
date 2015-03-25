// Hook up jQuery to Backbone globally
var Backbone = require('backbone'),
    $ = require('jquery');
Backbone.$ = $;

// Application dependencies
var app = require('./core/app');

/**
 * ------------------------------------------------------
 * Application entrypoint.
 * Browserify starts bundling from here, and this is the
 * first bit of code executed in our app.
 * ------------------------------------------------------
 **/

app.init();