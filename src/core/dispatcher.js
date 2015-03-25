// Library dependencies
var Backbone = require('backbone'),
    _ = require('underscore');


/**
 * ------------------------------------------------------
 * Dispatcher/event bus.  Provides pubsub capabilities
 * which our modules and app can use to communicate.
 * Because this exports an object, any file which
 * require()s it gets the same object reference back, so
 * we're passing around the same dispatcher every time.
 * ------------------------------------------------------
 **/


// Export our own clone of Backbone's internal Events object
// for simple pubsub functionality
var dispatcher = _.extend({}, Backbone.Events);

module.exports = dispatcher;