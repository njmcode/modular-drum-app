var $ = require('jquery'),
    _ = require('underscore'),
    dispatcher = require('dispatcher');

var KEYS = {
    'PAUSE_RESUME': 32, // Space
    'CLEAR': 27, // Esc
    'TOGGLE_FILTER': 70 // f
};

function testKeyEvent(e) {
    var key = _.invert(KEYS)[e.which];

    console.log(e.which, key);

    if (key) {
        dispatcher.trigger('keycontrols:keypressed', key);
    }
}

function init() {
    $(window).on('keyup', testKeyEvent);
}

var KeyControls = {
    init: init
};

module.exports = KeyControls;