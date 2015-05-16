var Game = (function(Game) {

    var noop = function() {};

    var AnimationFrameTicker = function(engine, state_machine, timer, fps) {
        if (state_machine.run === undefined) {
            timer.update();
            return noop;
        }
        var min_interval = 0;
        if (fps !== undefined) {
            min_interval = 1000 / fps;
        }
        var last_tick = 0;

        return function tick(timestamp) {
            if (timestamp - last_tick > min_interval) {
                last_tick = timestamp;
                timer.update();
                state_machine.run();
            }
            if (engine.is_running) {
                window.requestAnimationFrame(tick);
            }
        };
    };

    var Engine = Game.Engine = Class({
        state_machine: null,
        is_running: false,

        init: function(state_machine) {
            this.state_machine = state_machine;
        },

        start: function(fps) {
            if(this.is_running) return;
            this.is_running = true;

            var tick = AnimationFrameTicker(this, this.state_machine, Game.Time, fps)
            tick();
        },

        stop: function() {
            this.is_running = false;
        }
    });

    return Game;
})(Game || {});
