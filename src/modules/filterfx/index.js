// Application dependencies
var dispatcher = require('dispatcher'),
    AUDIO = require('../../common/audiocontext');

// Inner dependencies
var FilterFXView = require('./view.filterfx');


/**
 * ------------------------------------------------------
 * FilterFX
 * Creates a BiquadFilterNode from the Web Audio API and
 * provides controls to manipulate it.
 *
 * Inbound events:
 *  - filterfx:setfreq (val)
 *      Changes filter frequency, from 0 to 1
 *  - filterfx:setq (val)
 *      Changes filter quality, from 0 to 1
 *  - filterfx:changeactive (isActive)
 *      Enables/disables filter, or toggles it if undefined
 *  - filterfx:setcheckbox (isActive)
 *      Turns view checkbox on/off (view.filterfx)
 *
 * Outbound events:
 *  - filterfx:nodeupdated (isActive)
 *      Fires when active state changes
 * ------------------------------------------------------
 **/


var filterNode,
    isActive = false;


/**
 * Creates a lowpass filter node and stores it in this module,
 * also passing it to the dispatcher via an event.
 **/
function createFilterNode() {
    filterNode = AUDIO.createBiquadFilter();

    filterNode.type = 'lowpass'; // Low-pass filter
    filterNode.frequency.value = 440; // in HZ

    if (isActive) dispatcher.trigger('filterfx:nodeupdated', filterNode);
}


/**
 * Changes the frequency of the lowpass filter.  Applies some
 * logarithmic maths to shape the potential range of the filter.
 * (See http://www.html5rocks.com/en/tutorials/webaudio/intro/)
 *
 * @param value: float range between 0 and 1
 **/
function setFrequency(value) {
    var minValue = 40;
    var maxValue = AUDIO.sampleRate / 2;
    var numberOfOctaves = Math.log(maxValue / minValue) / Math.LN2;
    var multiplier = Math.pow(2, numberOfOctaves * (value - 1.0));
    filterNode.frequency.value = maxValue * multiplier;
}


/**
 * Changes the quality of the lowpass filter.
 *
 * @param value: float range between 0 and 1
 **/
function setQ(value) {
    filterNode.Q.value = value * 30;
}


/**
 * Turns the filter's active state on or off and fires events to
 * update its view's checkbox AND allow for modules using the node to
 * respond.
 *
 * @param newActiveState: boolean state to set, will toggle if undefined
 **/
function toggleOrSetActive(newActiveState) {
    isActive = (newActiveState !== undefined) ? newActiveState : !isActive;
    dispatcher.trigger('filterfx:nodeupdated', isActive ? filterNode : null);
    dispatcher.trigger('filterfx:setcheckbox', isActive);
}


/**
 * Module init.
 * Binds inbound events, creates the filter node, and inits the view.
 *
 * @param options: View.initialize() options
 **/
function init(options) {
    console.log('FilterFX init');
    dispatcher.on('filterfx:setfreq', setFrequency);
    dispatcher.on('filterfx:setq', setQ);
    dispatcher.on('filterfx:changeactive', toggleOrSetActive);
    createFilterNode();
    new FilterFXView(options).render();
}


/**
 * Exported module interface.
 **/
var FilterFX = {
    init: init
}

module.exports = FilterFX;