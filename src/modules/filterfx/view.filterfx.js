var Backbone = require('backbone'),
  $ = require('jquery'),
  dispatcher = require('dispatcher'),

  _template = require('./filterfx.hbs');


var FilterFXView = Backbone.View.extend({
	events: {
		'input .slider-freq': 'onFreqChange',
		'change .slider-freq': 'onFreqChange',
		'input .slider-q': 'onQChange',
		'change .slider-q': 'onQChange'
	},
	render: function() {
		var rawHTML = _template();
		this.$el.html(rawHTML);
		return this;
	},
	onFreqChange: function(e) {
		console.log('onFreqChange');
		var newFreq = $(e.currentTarget).val();
		dispatcher.trigger('filterfx:setfreq', newFreq);
	},
	onQChange: function(e) {
		console.log('onFreqChange');
		var newQ = $(e.currentTarget).val();
		dispatcher.trigger('filterfx:setq', newQ);
	}
});

module.exports = FilterFXView;