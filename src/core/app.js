// Application dependencies
var dispatcher = require('dispatcher');

// Modules
var SampleBank = require('../modules/samplebank'),
    Transport = require('../modules/transport'),
    PatternGrid = require('../modules/patterngrid'),
    FilterFX = require('../modules/filterfx'),
    KeyControls = require('../modules/keycontrols');


/**
 * ------------------------------------------------------
 * Application core.  Initializes the various modules
 * and wires up events between them to create the overall
 * functionality of the app.  Note the lack of actual
 * feature-based code in this file - it's all just 'glue'
 * between the modules themselves.
 * ------------------------------------------------------
 **/


/**
 * Definitions for a basic 4-beat and an empty pattern.
 * Passed to the PatternGrid on load and clear respectively.
 **/
var patterns = {
    basic: {
        'openHat': '0000000000000000',
        'closedHat': '0000000000000000',
        'snare': '0000100000001000',
        'kick': '1000000010000000'
    },
    empty: {
        'openHat': '0000000000000000',
        'closedHat': '0000000000000000',
        'snare': '0000000000000000',
        'kick': '0000000000000000'
    }
}


/**
 * Utility function to proxy the parameters from a triggered
 * event directly into another.  Allows us to easily 'wire up'
 * modules by creating connections from an outgoing module event
 * and an incoming event on another module, like a switchboard.
 *
 * @param eventsHash: object of event pairs to connect
 **/
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


/**
 * Application startup code
 **/
function launchApp() {

    // Bind some connecting events to 'wire up' our modules
    proxyEvents({
        // PatternGrid note trigger -> SampleBank play sound
        'patterngrid:requestsampleplay': 'samplebank:playsample',

        // Transport control changes -> PatternGrid state changes
        'transport:requestplay': 'patterngrid:play',
        'transport:requeststop': 'patterngrid:stop',
        'transport:tempochanged': 'patterngrid:settempo',

        // FilterFX node creation -> SampleBank node hookup
        'filterfx:nodeupdated': 'samplebank:setfxnode'
    });

    // Handle keypress events from KeyControls and trigger
    // the appropriate module events
    dispatcher.on('keycontrols:keypressed', function(key) {
        switch (key) {
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

    // Init the rest of our modules, telling them
    // where in the DOM we want them to render.
    // Try commenting these out one-by-one and note
    // that the app will still run.
    Transport.init({
        el: document.getElementById('top')
    });
    PatternGrid.init({
        el: document.getElementById('middle')
    });
    FilterFX.init({
        el: document.getElementById('bottom')
    });
    KeyControls.init();

    // Start with the basic drum pattern on the grid
    dispatcher.trigger('patterngrid:setpattern', pattern);
}


/**
 * Exported application object with initialization code
 * to do setup on the SampleBank, kicking everything off
 **/
var App = {

    init: function() {

        // Stop playback if the tab loses focus.
        // Our scheduling code desyncs when we're not focused, so the
        // drums sound ridiculous if they're left to play
        document.addEventListener('visibilitychange', function(e) {
            if (document.hidden) dispatcher.trigger('patterngrid:stop');
        }, false);

        // When the SampleBank has loaded all its samples, fire our
        // main application startup code
        dispatcher.on('samplebank:ready', launchApp);

        // Init the SampleBank, passing in the paths to our samples
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