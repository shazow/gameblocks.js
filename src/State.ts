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
 *
 * FIXME: The string-based state_id is not ideal for refactored compression.
 */

interface State {
    run?: StateHandler,
    enter?: StateHandler,
    exit?: StateHandler,
}

interface StateHandler {
    (state_id:string): void,
}

let NoopState = function(state_id:string): void {}

class StateMachine {
    queue: string[];
    states: {[key:string]: State} = {};
    run: StateHandler = NoopState;
    active_state_id: (string|null) = null;
    in_transition: boolean = false;

    /**
     * Register a State with the State Machine.
     *
     * @param {String} state_id Name of the state, used to identify which state you want to transition into.
     * @param {object} handlers Object containing any of the following keys: run, enter, and exit.
     */
    add(state_id:string, handlers:State): void {
         this.states[state_id] = handlers;
    }

    remove(state_id:string): void {
        delete this.states[state_id];
    }

    enter(state_id:string): void {
        // We use a state queue to make sure that state handlers are executed in a rational order.
        this.queue.push(state_id);

        if(this.in_transition) return;
        this.in_transition = true;

        for(;;) {
            const state_id = this.queue.shift();
            if(state_id===undefined) break;
            this._transition(state_id);
        }
        this.in_transition = false;
    }

    _transition(state_id:string): void {
        const last_state_id = this.active_state_id;
        const new_state = this.states[state_id];
        const last_state = this.states[last_state_id];

        if(new_state===undefined) {
            throw("Can't enter undefined state: " + state_id);
        }

        if(last_state) {
            const exit_handler = last_state.exit;
            exit_handler && exit_handler(state_id);
        }

        this.active_state_id = state_id;
        this.run = new_state.run;

        if(new_state) {
            const entry_handler = new_state.enter;
            entry_handler && entry_handler(last_state_id);
        }
    }
}
