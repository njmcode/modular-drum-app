// Application dependencies
var dispatcher = require('dispatcher');

// Inner dependencies
var scheduler = require('./scheduler'),
    PatternGridView = require('./view.patterngrid');


/**
 * ------------------------------------------------------
 * PatternGrid
 * Handles all pattern creation and sequencing, and
 * provides a grid view for manipulating pattern data.
 *
 * Inbound events:
 *  - patterngrid:setpattern (pattern)
 *      Loads pattern data into the grid
 *  - patterngrid:play
 *      Triggers playback of current pattern
 *  - patterngrid:stop
        Stops playback
 *  - patterngrid:toggleplay
 *      Starts/stops playback
 *  - patterngrid:settempo (newTempo)
 *      Changes the playback tempo
 *
 * Outbound events:
 *  - patterngrid:stepchanged (stepID)
 *      Fired when scheduler advances to next 16th
 *  - patterngrid:notehit (channelID, delay)
 *      Fired when scheduler hits an 'on' note
 * ------------------------------------------------------
 **/


/**
 * Module init.
 * Sets up the view for this module and binds inbound events
 * to the schedule system.  Also sets the scheduler tempo.
 *
 * @param options: View.initialize() options
 **/
function init(options) {
    console.log('PatternGrid init');
    new PatternGridView(options).render();
    scheduler.setTempo(130);
    dispatcher.on('patterngrid:play', scheduler.playPattern);
    dispatcher.on('patterngrid:toggleplay', scheduler.togglePlay);
    dispatcher.on('patterngrid:settempo', scheduler.setTempo);
}


/**
 * Exported module interface.
 **/
var PatternGrid = {
    init: init
}

module.exports = PatternGrid;