
var dispatcher = require('dispatcher'),

	SampleBank = require('../modules/samplebank'),
	Transport = require('../modules/transport'),
	PatternGrid = require('../modules/patterngrid'),
	FilterFX = require('../modules/filterfx'),
	KeyControls = require('../modules/keycontrols');

var patterns = {
	basic: {
	    'openHat':		'0000000000000000',
	    'closedHat':	'0000000000000000',
	    'snare':		'0000100000001000',
	    'kick':			'1000000010000000'
    },
    empty: {
		'openHat':		'0000000000000000',
	    'closedHat':	'0000000000000000',
	    'snare':		'0000000000000000',
	    'kick':			'0000000000000000'
    }
}

function proxyEvents(eventsHash) {

	for (var triggerEvent in eventsHash) {

		var _proxy = (function(proxyEvent) {
			return function() {
				var args = Array.prototype.slice.apply(arguments);
				args.unshift(proxyEvent);
				dispatcher.trigger.apply(dispatcher, args);
			}
		})(eventsHash[triggerEvent]);

		dispatcher.on(triggerEvent, _proxy);
		
	}
}

function launchApp() {

	proxyEvents({
		'patterngrid:requestsampleplay': 'samplebank:playsample',
		'transport:requestplay': 'patterngrid:play',
		'transport:requeststop': 'patterngrid:stop',
		'transport:tempochanged': 'patterngrid:settempo',
		'filterfx:nodeupdated': 'samplebank:setfxnode'
	});

    // Keycontrols -> patterngrid
    dispatcher.on('keycontrols:keypressed', function(key) {
    	switch(key) {
    		case 'PAUSE_RESUME':
    			dispatcher.trigger('patterngrid:toggleplay');
    			break;
    		case 'TOGGLE_FILTER':
    			dispatcher.trigger('filterfx:changeactive');
    			break;
    		case 'CLEAR':
    			dispatcher.trigger('patterngrid:setpattern', patterns.empty);
    			break;
    		default:
    			break;
    	}
    });


    // Init the rest of our modules
	Transport.init({ el: document.getElementById('top') });
	PatternGrid.init({ el: document.getElementById('middle') });
	FilterFX.init({ el: document.getElementById('bottom') });
	KeyControls.init();
	

	// Set up a basic pattern and play it
	
    dispatcher.trigger('patterngrid:setpattern', pattern);
    //dispatcher.trigger('patterngrid:play');
}

var App = {

	init: function() {

		document.addEventListener('visibilitychange', function(e) {
	      if(document.hidden) dispatcher.trigger('patterngrid:stop');
	    }, false);

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