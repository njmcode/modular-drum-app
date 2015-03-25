// Library dependencies
var Backbone = require('backbone'),
    $ = require('jquery');

// Inner dependencies
var scheduler = require('./scheduler'),
    _channelTemplate = require('./channel.hbs');


/**
 * Exported Backbone sub-View for a 'channel' -
 * one line of 16 steps for a given drum sample.
 * Turning notes on and off re-renders the view.
 **/
var ChannelView = Backbone.View.extend({
    events: {
        'click .seq-row span': 'onNoteClick'
    },
    channel: null,
    initialize: function(options) {
        this.channel = options.channel;
    },
    render: function() {
        var rawHTML = _channelTemplate({
            id: this.channel,
            notes: this.model
        });
        this.$el.html(rawHTML);
        this.$notes = this.$el.find('.seq-row span');

        var self = this;
        this.model.forEach(function(note, idx) {
            var $el = self.$notes.eq(idx);
            if (note === "1") $el.addClass('seq-note');
            if (idx % 4 === 0) $el.addClass('seq-step-measure');
        });

        return this;
    },
    clearPlayhead: function() {
        this.$notes.removeClass('seq-playhead');
    },
    setPlayhead: function(id) {
        this.clearPlayhead();
        this.$notes.filter('[data-tic="' + id + '"]').addClass('seq-playhead');
    },
    onNoteClick: function(e) {
        var tic = $(e.currentTarget).attr('data-tic');
        var currentPattern = scheduler.getCurrentPattern();
        currentPattern[this.channel][tic] = (currentPattern[this.channel][tic] === "1") ? "0" : "1";
        this.render();
    }
});

module.exports = ChannelView;