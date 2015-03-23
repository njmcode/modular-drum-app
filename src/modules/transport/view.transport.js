var Backbone = require('backbone'),
  $ = require('jquery'),
  dispatcher = require('dispatcher'),

  _template = require('./transport.hbs');


var TransportView = Backbone.View.extend({
	events: {
		'click .transport-play': 'play',
		'click .transport-stop': 'stop',
		'change .transport-tempo': 'onTempoChange'
	},
	initialize: function(options) {
		this.listenTo(dispatcher, 'transport:play', this.play);
		this.listenTo(dispatcher, 'transport:play', this.stop);
	},
	render: function() {
		var rawHTML = _template();
		this.$el.html(rawHTML);
		this.$tempo = this.$el.find('.transport-tempo');
		return this;
	},
	play: function() {
		dispatcher.trigger('transport:requestplay');
	},
	stop: function() {
		dispatcher.trigger('transport:requeststop');
	},
	onTempoChange: function(e) {
		var newTempo = $(e.currentTarget).val();
		dispatcher.trigger('transport:tempochanged', newTempo);
	}
});

module.exports = TransportView;