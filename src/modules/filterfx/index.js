var dispatcher = require('dispatcher'),
  AUDIO = require('../../common/audiocontext'),
  FilterFXView = require('./view.filterfx');

var filterNode,
	isActive = false;

function createFilterNode() {
	filterNode = AUDIO.createBiquadFilter();

	filterNode.type = 'lowpass'; // Low-pass filter. See BiquadFilterNode docs
	filterNode.frequency.value = 440; // Set cutoff to 440 HZ

	if(isActive) dispatcher.trigger('filterfx:nodeupdated', filterNode);
}

function setFrequency(value) {
	var minValue = 40;
	var maxValue = AUDIO.sampleRate / 2;
	var numberOfOctaves = Math.log(maxValue / minValue) / Math.LN2;
	var multiplier = Math.pow(2, numberOfOctaves * (value - 1.0));
	filterNode.frequency.value = maxValue * multiplier;
}

function setQ(value) {
	filterNode.Q.value = value * 30;
}

function toggleOrSetActive(newActiveState) {
	isActive = (newActiveState !== undefined) ? newActiveState : !isActive;
	dispatcher.trigger('filterfx:nodeupdated', isActive ? filterNode : null);
	dispatcher.trigger('filterfx:setcheckbox', isActive);
}

function init(options) {
	dispatcher.on('filterfx:setfreq', setFrequency);
	dispatcher.on('filterfx:setq', setQ);
	dispatcher.on('filterfx:changeactive', toggleOrSetActive);
	createFilterNode();
	new FilterFXView(options).render();
}

var FilterFX = {
	init: init
}

module.exports = FilterFX;