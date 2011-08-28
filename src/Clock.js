var Game = (function(Game) {
    /*
     * Turns out that calling ``new Date()`` many times per frame is noticeably
     * slow, so having a global clock that you can refer to many times per
     * update is an effective performance optimization.
     *
     * Values are handled in milliseconds since epoch. 1ms = 1/1000 seconds.
     */

    var now = +new Date();

    // The current time that we update on-demand, for performance reasons.
    var Time = {
        update: function() {
            now = +new Date();
        },
        get: function() {
            return now;
        }
    }

    Game.Time = Time;

    var Clock = Game.Clock = Class({
        num_ticks: 0,
        time_ticked: null,
        time_created: null,

        init: function() {
            this.time_created = now;
            this.time_ticked = now;
        },
        tick: function() {
            var delta = now - this.time_ticked;
            this.time_ticked = now;
            this.num_ticks++;
            return delta;
        },
        delta: function() {
            return now - this.time_ticked;
        }
    });

    var min = Math.min;

    var ClockThrottled = Game.ClockThrottled = Clock.extend({
        time_ticked: 0,
        now: 0,
        max_timestep: 20,

        init: function(max_timestep) {
            this.max_timestep = max_timestep;
            this.__super__();
        },
        tick: function() {
            var delta = min(this.max_timestep, this.now - this.time_ticked);
            this.time_ticked = now;
            this.num_ticks++;
            return delta;
        },
        delta: function() {
            return this.now - this.time_ticked;
        }
    });

    var Timer = Game.Timer = Class({
        time_started: 0,
        time_elapsed: 0,

        init: function(clock) {
            this.clock = clock;
        },
        start: function() {
            return this.time_started = this.clock.time_ticked;
        },
        stop: function() {
            return this.time_elapsed += this.clock.time_ticked - this.time_started;
        }

    });

    return Game;
})(Game || {});
