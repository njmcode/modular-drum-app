
var dispatcher = require('dispatcher'),

	SampleBank = require('../modules/samplebank'),
	PatternGrid = require('../modules/patterngrid');


function launchApp() {

	dispatcher.on('patterngrid:requestsampleplay', function(sampleID, time) {
		dispatcher.trigger('samplebank:playsample', sampleID, time);
	});

	PatternGrid.init({ el: document.getElementById('wrap') });

	var pattern = {
      sequence: {
        'openHat':		'0000000000000000',
        'closedHat':	'0000000000000000',
        'snare':		'0000100000001000',
        'kick':			'1000000010000000'
      }
    };
    
    dispatcher.trigger('patterngrid:setpattern', pattern);
    dispatcher.trigger('patterngrid:play');
}

var App = {

	init: function() {

		dispatcher.on('samplebank:ready', launchApp);

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