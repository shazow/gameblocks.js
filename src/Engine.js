var Game = (function(Game) {

    var noop = function() {};

    var AnimationFrameTicker = function(engine, state_machine, timer) {
        if (state_machine.run === undefined) {
            timer.update();
            return noop;
        }

        return function tick(timestamp) {
            timer.update();
            state_machine.run();
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

            var tick = AnimationFrameTicker(this, this.state_machine, Game.Time)
            tick();
        },

        stop: function() {
            this.is_running = false;
        }
    });

    return Game;
})(Game || {});
