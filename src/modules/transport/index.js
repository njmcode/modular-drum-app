// Application dependencies
var dispatcher = require('dispatcher');

// Inner dependencies
var TransportView = require('./view.transport');


/**
 * ------------------------------------------------------
 * Transport
 * Provides play, stop and tempo controls.
 *
 * Inbound events:
 *  - None
 *
 * Outbound events:
 *  - samplebank:ready
 *      Fires when all samples loaded
 * ------------------------------------------------------
 **/


/**
 * Module init.
 * Sets up the view for this module.
 *
 * @param options: View.initialize() options
 **/
function init(options) {
    console.log('Transport init');
    new TransportView(options).render();
}


/**
 * Exported module interface.
**/
var Transport = {
    init: init
}

module.exports = Transport;