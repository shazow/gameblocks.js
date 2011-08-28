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
var Game = (function(Game) {

    var nullfn = function() {};

    var StateMachine = Game.StateMachine = Class({
        queue: [],
        states: {},
        run: nullfn,
        active_state_id: null,
        in_transition: false,

        init: function() {
            this.queue = [];
            this.states = {};
        },

        /**
         * Register a State with the State Machine.
         *
         * @param {String} state_id Name of the state, used to identify which state you want to transition into.
         * @param {object} handlers Object containing any of the following keys: run, enter, and exit.
         */
        add: function(state_id, handlers) {
            this.states[state_id] = handlers;
        },

        remove: function(state_id) {
            delete this.states[state_id];
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
            var last_state_id = this.active_state_id;
            var new_state = this.states[state_id];
            var last_state = this.states[last_state_id];

            if(new_state===undefined) {
                throw("Can't enter undefined state: " + state_id);
            }

            if(last_state) {
                var exit_handler = last_state.exit;
                exit_handler && exit_handler(state_id);
            }

            if(new_state) {
                var entry_handler = new_state.enter;
                entry_handler && entry_handler(last_state_id);
            }

            this.active_state_id = state_id;
            this.run = new_state['run'];
        }
    });

    return Game;
})(Game || {});
