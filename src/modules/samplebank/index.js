var dispatcher = require('dispatcher');

var AUDIO,  
  bank = {};

/**
 * Resource loading
 **/

var loadCount = 0,
  totalCount = 0;

function loadSamples(srcObj) {
  for (var k in srcObj) {
    totalCount++;
  }
  for (var k in srcObj) {
    _loadSample(k, srcObj[k]);
  }
}

function _loadSample(key, url) {
  var req = new XMLHttpRequest();
  req.responseType = "arraybuffer";
  req.onload = function() {
    AUDIO.decodeAudioData(req.response, function(buffer) {
      bank[key] = buffer;
      if (++loadCount === totalCount) {
        dispatcher.trigger('samplebank:ready');
      }
    });
  }
  req.open('GET', url, true);
  req.send();
}


/**
 * Resource playing
 **/

function playSample(id, when) {
  var s = AUDIO.createBufferSource();
  s.buffer = bank[id];
  s.connect(AUDIO.destination);
  s.start(when || 0);
}

function init(srcObj) {
  AUDIO = new (window.AudioContext || window.webkitAudioContext)();
  if(!AUDIO) {
    throw 'Web Audio API not supported';
  }
  dispatcher.on('samplebank:playsample', playSample);
  loadSamples(srcObj);
}


var SampleBank = {
  init: init
};

module.exports = SampleBank;