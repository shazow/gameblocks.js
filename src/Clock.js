(function() {

    var now = +new Date();

    var Time = {
        update: function() {
            now = +new Date();
        },
        get: function() {
            return now;
        }
    }

    Static.Time = Time;

    var Clock = Game.Clock = Class({
        num_ticks: 0,
        time_ticked: null,
        time_created: null,

        init: function() {
            this.time_created = now;
            this.time_ticked = now;
        }

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

    var ClockThrottled = Game.ClockThrottled = Clock.extend({
        time_ticked: 0,
        now: 0,
        max_timestep: 20,

        init: function(max_timestep) {
            this.max_timestep = max_timestep;
            this.__super__();
        },
        tick: function() {
            var delta = Math.min(this.max_timestep, this.now - this.time_ticked);
            this.time_ticked = now;
            this.num_ticks++;
            return delta;
        }
        delta: function() {
            return this.now - this.time_ticked;
        }
    });

    var Timer = Game.Timer = Class({
        time_started: 0,
        time_elapsed: 0,

        init: function(clock) {
            this.clock = clock;
        }

        start: function() {
            this.time_started = this.clock.time_ticked;
        },
        stop: function() {
            this.time_elapsed += this.clock.time_ticked - this.time_started;
        }

    });

})();
