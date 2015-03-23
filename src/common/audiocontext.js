var AUDIO = new (window.AudioContext || window.webkitAudioContext)();
if(!AUDIO) {
	throw 'Web Audio API not supported';
}
module.exports = AUDIO;