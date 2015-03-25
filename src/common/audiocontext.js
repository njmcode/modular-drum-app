/**
 * ------------------------------------------------------
 * Exports an instance of AudioContext, which is the
 * gateway to Web Audio API functionality.  Handles the
 * correct prefixing and throws an error if the API isn't
 * supported.  By require()ing this file in different
 * parts of the app, we can pass the same instance of
 * AudioContext around and re-use it.
 * ------------------------------------------------------
 **/


var AUDIO = new(window.AudioContext || window.webkitAudioContext)();
if (!AUDIO) {
    throw 'Web Audio API not supported';
}

module.exports = AUDIO;