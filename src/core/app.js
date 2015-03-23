
var dispatcher = require('dispatcher'),

	SampleBank = require('../modules/samplebank'),
	Transport = require('../modules/transport'),
	PatternGrid = require('../modules/patterngrid');


function launchApp() {

	// Pattern note trigger -> soundbank
	dispatcher.on('patterngrid:requestsampleplay', function(sampleID, time) {
		dispatcher.trigger('samplebank:playsample', sampleID, time);
	});

	// Transport controls -> sequencer
    dispatcher.on('transport:requestplay', function() {
      dispatcher.trigger('patterngrid:play');
    });
    dispatcher.on('transport:requeststop', function() {
      dispatcher.trigger('patterngrid:stop');
    });
    dispatcher.on('transport:tempochanged', function(newTempo) {
      dispatcher.trigger('patterngrid:settempo', newTempo);
    });

    // Init the rest of our modules
	Transport.init({ el: document.getElementById('top') });
	PatternGrid.init({ el: document.getElementById('middle') });
	

	// Set up a basic pattern and play it
	var pattern = {
	    'openHat':		'0000000000000000',
	    'closedHat':	'0000000000000000',
	    'snare':		'0000100000001000',
	    'kick':			'1000000010000000'
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