var dispatcher = require('dispatcher'),
	_ = require('underscore'),
	scheduler = require('./scheduler'),

	PatternGridView = require('./view.patterngrid');
	

function init(options) {
	console.log('PatternGrid init', options);
	new PatternGridView(options).render();
	scheduler.setTempo(130);

	dispatcher.on('patterngrid:play', scheduler.playPattern);
}

var PatternGrid = {
	init: init
}

module.exports = PatternGrid;