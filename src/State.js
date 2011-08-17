(function() {

    var StateMachine = Game.StateMachine = Class({
        states: {},
        state: null,

        init: function() {
        },

        add: function(state) {
            this.states[state.id] = state;
        },
        enter: function(state_id) {
            var last_state = this.state;
            var new_state = this.states[state_id];

            if(new_state===undefined) {
                throw("Can't enter undefined state: " + state_id);
            }

            if(last_state) {
                var exit = last_state.handlers['exit'];
                exit && exit(new_state && new_state.id);
            }

            var entry = new_state.handlers['entry'];
            entry && entry(last_state && last_state.id);

            this.state = new_state;
            this.run = new_state.run;
        },
        run: function() {}
    });

    var State = Game.State = Class({
        id: null,
        run: null,

        // TODO: Make this event-based.
        handlers: null,

        init: function(id, run) {
            this.id = id;
            this.run = run;
            this.handlers = {};
        }
    });

})();
