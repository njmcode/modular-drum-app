// Application dependencies
var dispatcher = require('dispatcher'),
    AUDIO = require('../../common/audiocontext');


/**
 * ------------------------------------------------------
 * SampleBank
 * Handles the loading, triggering and output of the
 * drum samples in our app.
 *
 * Inbound events:
 *  - samplebank:playsample (sampleId, when)
 *      Plays a sample with an optional delay
 *  - samplebank:setfxnode (Node)
 *      Inlines a Node in the chain, clears it if null
 *
 * Outbound events:
 *  - samplebank:ready
 *      Fires when all samples loaded
 * ------------------------------------------------------
 **/


var bank = {},
    fxNode = null;

var loadCount = 0,
    totalCount = 0;


/**
 * Triggers a load on every item in an object of
 * sample sources.
 *
 * @param srcObj: object of id:srcpath pairs
 **/
function loadSamples(srcObj) {
    for (var k in srcObj) {
        totalCount++;
    }
    for (var k in srcObj) {
        _loadSample(k, srcObj[k]);
    }
}


/**
 * Loads a sample via XHR and triggers a 'ready' event if
 * it's the last one to load.
 *
 * @param key: string ID to store sample as
 * @param url: string path of sample source
 **/
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
 * Triggers a sample to play by creating a new source node
 * and wiring it (via an FX node, if present) to the
 * browser's audio output.  Source nodes are not reusable
 * and will be GC'd by the browser.
 *
 * @param id: string ID of sample to play
 * @param when: int time (ms) after creation to play sound
 **/
function playSample(id, when) {
    var s = AUDIO.createBufferSource();
    s.buffer = bank[id];
    if (fxNode) {
        s.connect(fxNode);
        fxNode.connect(AUDIO.destination);
    } else {
        s.connect(AUDIO.destination);
    }
    s.start(when || 0);
}


/**
 * Stores a reference to a node that we will inline, if
 * present, when playing sounds via playSample().
 *
 * @param node: Node instance, or null
 **/
function setFxNode(node) {
    fxNode = node;
}


/**
 * Module init.
 * Binds inbound events and begins sample loading.
 *
 * @param srcObj: see loadSamples()
 **/
function init(srcObj) {
    console.log('SampleBank init');
    dispatcher.on('samplebank:playsample', playSample);
    dispatcher.on('samplebank:setfxnode', setFxNode);
    loadSamples(srcObj);
}


/**
 * Exported module interface
 **/
var SampleBank = {
    init: init
};

module.exports = SampleBank;