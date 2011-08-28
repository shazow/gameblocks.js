var Game = (function(Game) {

    var Engine = Game.Engine = Class({
        loop: null,
        state_machine: null,
        is_running: false,

        init: function(state_machine) {
            this.state_machine = state_machine;
        },

        tick_factory: function() {
            var a = Game.Time.update,
                b = this.state_machine;

            return function() { a(); b.run(); };
        },

        start: function(fps) {
            if(this.is_running) return;

            var fps = fps || 30;

            Game.Time.update();
            this.is_running = true;
            this.loop = setInterval(this.tick_factory(), 1000 / fps);
        },

        stop: function() {
            clearInterval(this.loop);
            this.is_running = false;
        }
    });

    return Game;
})(Game || {});
