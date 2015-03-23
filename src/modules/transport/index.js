var dispatcher = require('dispatcher'),
	TransportView = require('./view.transport');

function init(options) {
	console.log('Transport init', options);
	new TransportView(options).render();
}

var Transport = {
	init: init
}

module.exports = Transport;