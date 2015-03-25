// Library dependencies
var Backbone = require('backbone'),
    $ = require('jquery');

// Application dependencies
var dispatcher = require('dispatcher');

// Inner dependencies
var _template = require('./transport.hbs');


/**
 * Exported Backbone View for the transport controls.
 * Fires dispatcher events when the controls are
 * clicked or changed.
 **/
var TransportView = Backbone.View.extend({
    events: {
        'click .transport-play': 'play',
        'click .transport-stop': 'stop',
        'change .transport-tempo': 'onTempoChange'
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