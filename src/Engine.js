(function() {

    var Engine = Game.Engine = Class({
        loop: null,
        is_running: false,

        tick_factory: function() {
            var a = Clock.update,
                b = Global.StateMachine.run;

            return function() { a(); b(); };
        },

        start: function() {
            if(this.is_running) return;

            Clock.update();
            this.is_running = true;
            this.loop = setInterval(this.tick_factory(), 1000 / 30);
        },

        stop: function() {
            clearInterval(this.loop);
            this.is_running = false;
        }
    });

    Static.Engine = new Engine();

})();
