var dispatcher = require('dispatcher'),
	scheduler = require('./scheduler'),
	PatternGridView = require('./view.patterngrid');

function init(options) {
	new PatternGridView(options).render();
	scheduler.setTempo(130);
	dispatcher.on('patterngrid:play', scheduler.playPattern);
	dispatcher.on('patterngrid:settempo', scheduler.setTempo);
}

var PatternGrid = {
	init: init
}

module.exports = PatternGrid;