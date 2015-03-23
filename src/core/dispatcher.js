var Backbone = require('backbone'),
	_ = require('underscore');

var dispatcher = _.extend({}, Backbone.Events);

module.exports = dispatcher;