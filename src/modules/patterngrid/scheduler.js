var dispatcher = require('dispatcher'),
	_ = require('underscore'),
	AUDIO = require('../../common/audiocontext');


var tempo, tic, _initialized = false;
var noteTime, startTime, ti, currentStep = 0;
var isPlaying = false;
var currentPattern = null,
	_currentPatternSequenceRaw;


/* Scheduling */

function scheduleNote() {
	if (!isPlaying) return false;
	var ct = AUDIO.currentTime;
	ct -= startTime;
	while (noteTime < ct + 0.200) {
		var pt = noteTime + startTime;

		playPatternStepAtTime(pt);

		nextNote();
	}
	ti = setTimeout(scheduleNote, 0);
}

function nextNote() {
	currentStep++;
	if (currentStep == 16) currentStep = 0;
	noteTime += tic;
}

function playPatternStepAtTime(pt) {
	for (var k in currentPattern) {
		if (currentPattern[k][currentStep] == "1") {
			dispatcher.trigger('patterngrid:requestsampleplay', k, pt);
		}
		dispatcher.trigger('patterngrid:setstep', currentStep);
	}
}

/* Parsing */

function playPattern(pattern) {
	console.log('playPattern', pattern);
	if (currentPattern === null) parsePattern(pattern);
	play();
}

function parsePattern(pattern) {
	currentPattern = {};
	_currentPatternSequenceRaw = _.extend(pattern, {});
	for (var k in pattern) {
		var pat = pattern[k].split('');
		currentPattern[k] = pat;
	}
}

function getCurrentPattern() {
	return currentPattern;
}


/** Transport **/

function play() {
	console.log('play');
	isPlaying = true;
	noteTime = 0.0;
	startTime = AUDIO.currentTime + 0.005;
	scheduleNote();
}

function stop() {
	isPlaying = false;
	currentStep = 0;
	dispatcher.trigger('patterngrid:setstep', currentStep);
}

function setTempo(newTempo) {
	tempo = newTempo;
	tic = (60 / tempo) / 4; // 16th
}

/** API **/
var api = {
	playPattern: playPattern,
	parsePattern: parsePattern,
	getCurrentPattern: getCurrentPattern,
	play: play,
	stop: stop,
	setTempo: setTempo
};

module.exports = api;