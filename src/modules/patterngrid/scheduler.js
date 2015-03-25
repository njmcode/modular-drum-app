// Library dependencies
var dispatcher = require('dispatcher'),
    _ = require('underscore');

// Application dependencies
var AUDIO = require('../../common/audiocontext');


/**
 * ------------------------------------------------------
 * Main pattern sequencing and scheduling code used by
 * the PatternGrid module.  Handles timing, beat
 * triggering, and pattern parsing.
 * ------------------------------------------------------
 **/


var tempo, tic, _initialized = false;
var noteTime, startTime, ti, currentStep = 0;
var isPlaying = false;
var currentPattern = null;


/**
 * Convert a pattern object to an array of '0' and '1' 
 * values and store it in the scheduler for later use.
 *
 * @paran pattern: object of drum ID and pattern values
 **/
function parsePattern(pattern) {
    currentPattern = {};
    for (var k in pattern) {
        var pat = pattern[k].split('');
        currentPattern[k] = pat;
    }
}


/**
 * Returns the current (parsed) pattern.
 **/
function getCurrentPattern() {
    return currentPattern;
}


/**
 * Proxies parsePattern if no pattern is currently
 * loaded, and triggers play().
 *
 * @param pattern: see parsePattern()
 **/
function playPattern(pattern) {
    if (currentPattern === null) parsePattern(pattern);
    play();
}


/**
 * Fires events to the dispatcher if the current step in
 * the grid has any notes to be played.
 *
 * @param pt: calculated time offset to delay the note by
 **/
function playPatternStepAtTime(pt) {
    for (var k in currentPattern) {
        if (currentPattern[k][currentStep] == '1') {
            dispatcher.trigger('patterngrid:requestsampleplay', k, pt);
        }
        dispatcher.trigger('patterngrid:stepchanged', currentStep);
    }
}


/**
 * Change the tempo of the scheduler, re-calculating the
 * 'tic' (16th note) duration for future use.
 *
 * @param newTempo: int new tempo
 **/
function setTempo(newTempo) {
    tempo = newTempo;
    tic = (60 / tempo) / 4; // 16th
}


/**
 * Plays the current pattern from the beginning.
 **/
function play() {
    isPlaying = true;
    noteTime = 0.0;
    startTime = AUDIO.currentTime + 0.005;
    scheduleNote();
}


/**
 * Stops playing.
 **/
function stop() {
    isPlaying = false;
    currentStep = 0;
    dispatcher.trigger('patterngrid:stepchanged', currentStep);
}


/**
 * Toggles playing on or off depending on current state.
 **/
function togglePlay() {
    var fn = (isPlaying) ? stop : play;
    fn();
}


/**
 * Calculates the precise time of the next
 * note in the sequence and triggers it. This
 * method loops constantly once triggered - think 
 * of it as like a requestAnimationFrame() for 
 * note scheduling.
 **/
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


/**
 * Advances the scheduler to the next step in the pattern,
 * looping back to the start if needed.
**/
function nextNote() {
    currentStep++;
    if (currentStep == 16) currentStep = 0;
    noteTime += tic;
}


/**
 * Exported interface for the scheduler.  Since we only
 * use it within the PatternGrid module, it's fine to
 * expose a more comprehensive interface for the rest of
 * the module to work with directly.
 **/
var api = {
    playPattern: playPattern,
    parsePattern: parsePattern,
    getCurrentPattern: getCurrentPattern,
    play: play,
    togglePlay: togglePlay,
    stop: stop,
    setTempo: setTempo
};

module.exports = api;