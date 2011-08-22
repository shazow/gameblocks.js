(function() {

    var nullfn = function() {};

    var StateMachine = Game.StateMachine = Class({
        states: {},
        state: null,

        init: function() {
            this.states = {};
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
                var exit_handler = last_state.handlers['exit'];
                exit_handler && exit_handler(state_id);
            }

            if(new_state) {
                var entry_handler = new_state.handlers['enter'];
                entry_handler && entry_handler(last_state.id);
            }

            this.state = new_state;
            this.run = new_state.handlers['run'] || nullfn;
        },
        run: function() {}
    });

    var State = Game.State = Class({
        id: null,

        handlers: {},

        // TODO: Make this event-based.

        /**
         * @param {String} id       Name of the state, used by StateMachine for transitions.
         * @param {object} handlers Dictionary containing function handlers for any of 'run', 'enter', 'exit'.
         */
        init: function(id, handlers) {
            this.id = id;
            this.handlers = handlers || {};
        }
    });

})();
