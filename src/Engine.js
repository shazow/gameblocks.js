var Game = (function(Game) {

    var AnimationFrameTicker = function(engine, state_machine, timer) {
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

        tick_factory: function() {
            var a = Game.Time.update,
                b = this.state_machine,
                self = this;

            return function tick(timestamp) {
                a(); b.run();
                if (self.is_running) {
                    window.requestAnimationFrame(tick);
                }
            };
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
