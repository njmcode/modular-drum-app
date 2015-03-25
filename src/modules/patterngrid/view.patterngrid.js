// Library dependencies
var Backbone = require('backbone'),
    $ = require('jquery');

// Application dependencies  
var dispatcher = require('dispatcher');

// Inner dependencies
var scheduler = require('./scheduler'),
    ChannelView = require('./view.channel'),
    _template = require('./patterngrid.hbs');


/**
 * Exported Backbone View for the pattern editor.
 * Creates sub-views for each 'channel' (drum sample)
 * and updates them when the scheduler advances,
 * pattern data is loaded, or notes are changed.
 **/
var PatternGridView = Backbone.View.extend({

    channelViews: {},
    initialize: function(options) {
        this.listenTo(dispatcher, 'patterngrid:stop', this.stop);
        this.listenTo(dispatcher, 'patterngrid:setpattern', this.setPattern);
        this.listenTo(dispatcher, 'patterngrid:stepchanged', this.setPlayhead);
    },
    setPattern: function(pattern) {
        scheduler.parsePattern(pattern);

        this.render();

        for (var k in this.channelViews) {
            this.channelViews[k].remove();
        }

        var currentPattern = scheduler.getCurrentPattern();

        for (var k in currentPattern) {
            var $cel = this.$el.find('.channel[data-inst="' + k + '"]');
            this.channelViews[k] = new ChannelView({
                channel: k,
                model: currentPattern[k],
                el: $cel
            });
        }

        this.renderChannels();
    },
    render: function() {
        var currentPattern = scheduler.getCurrentPattern();

        var data = (currentPattern) ? Object.keys(currentPattern) : [];
        var rawHTML = _template({
            channels: data
        });
        this.$el.html(rawHTML);
        return this;
    },
    renderChannels: function() {
        this.$channelContainer = this.$el.find('.patterngrid-channels');
        for (var k in this.channelViews) {
            this.channelViews[k].render();
        }
        this.$steps = $('.channel span');
    },
    setPlayhead: function(stepId) {
        for (var k in this.channelViews) {
            this.channelViews[k].setPlayhead(stepId);
        }
    },
    stop: function() {
        scheduler.stop();
        for (var k in this.channelViews) {
            this.channelViews[k].clearPlayhead();
        }
    }
});

module.exports = PatternGridView;