/**
 * State Machine
 *
 * Why?
 * Games have multiple states, each with different behaviours. For example-
 * your intro screen, settings screen, normal levels, boss levels, death screen,
 * high scores, etc. Each of these could have different key bindings, different
 * rendering routines, different logic, and different entry/exit paths.
 *
 * The goal of a state machine is to keep track which state is active, and
 * facilitate the transition between states.
 *
 * The goal of a state is to define the behaviour for a contained subset of
 * the experience and handle transitions in to and out of it.
 */
(function() {

    var nullfn = function() {};

    var StateMachine = Game.StateMachine = Class({
        queue: [],
        states: {},
        run: nullfn,
        active_state: null,
        in_transition: false,

        init: function() {
            this.queue = [];
            this.states = {};
        },

        add: function(state) {
            this.states[state.id] = state;
        },
        enter: function(state_id) {
            // We use a state queue to make sure that state handlers are executed in a rational order.
            this.queue.push(state_id);

            if(this.in_transition) return;
            this.in_transition = true;

            for(;;) {
                var state_id = this.queue.shift();
                if(state_id===undefined) break;

                this._transition(state_id);
            }
            this.in_transition = false;
        },
        _transition: function(state_id) {
            var last_state = this.active_state;
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
                entry_handler && entry_handler(last_state && last_state.id);
            }

            this.active_state = new_state;
            this.run = new_state.handlers['run'] || nullfn;
        }
    });

    var State = Game.State = Class({
        id: null,

        handlers: {},

        // TODO: Make this event-based?

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
