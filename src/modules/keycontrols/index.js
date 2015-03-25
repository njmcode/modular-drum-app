// Library dependencies
var $ = require('jquery'),
    _ = require('underscore');

// Application dependencies
var dispatcher = require('dispatcher');


/**
 * ------------------------------------------------------
 * KeyControls
 * Binds a jQuery listener for keypress events and raises
 * certain ones to the dispatcher.
 *
 * Inbound events:
 *  - None
 *
 * Outbound events:
 *  - keycontrols:keypressed (key_id)
 *      Fires when recognized key is pressed
 * ------------------------------------------------------
 **/


// Object of recognized keys
var KEYS = {
    'PAUSE_RESUME': 32, // Space
    'CLEAR': 27, // Esc
    'TOGGLE_FILTER': 70 // f
};


/**
 * Raise a dispatcher event if the pressed key is
 * one of our KEYS.  Fired by our jQuery listener.
 *
 * @param e: Event fired by the listener
 **/
function testKeyEvent(e) {
    var key = _.invert(KEYS)[e.which];
    if (key) {
        dispatcher.trigger('keycontrols:keypressed', key);
    }
}


/**
 * Module init.
 * Binds a jQuery listener for keypresses.
 **/
function init() {
    console.log('KeyControls init');
    $(window).on('keyup', testKeyEvent);
}


/**
 * Exported module interface.
 **/
var KeyControls = {
    init: init
};

module.exports = KeyControls;