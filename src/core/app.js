
var dispatcher = require('dispatcher'),

	SampleBank = require('../modules/samplebank'),
	PatternGrid = require('../modules/patterngrid');


var App = {
	init: function() {

		dispatcher.on('samplebank:ready', function() {
			console.log('All samples loaded');
			
			setInterval(function() {
				dispatcher.trigger('samplebank:playsample', 'snare');
			}, 1000);

		});

		var sampleSrcs = {
			'kick': 'assets/samples/kick.wav',
			'snare': 'assets/samples/snare.wav',
			'openHat': 'assets/samples/openHat.wav',
			'closedHat': 'assets/samples/closedHat.wav'
		};
		SampleBank.init(sampleSrcs);
	}
}

module.exports = App;