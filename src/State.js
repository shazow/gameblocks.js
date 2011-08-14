(function() {

    var StateMachine = Game.StateMachine = Class({
        states: {},
        state: null,

        transition: function(state_name) {
            var last_state = this.state;
            var new_state = this.states[state_name];

            last_state.exit(new_state);
            new_state.entry(last_state);

            this.state = new_state;
        },
        run: function() {
            return this.state.run();
        }
    });
    Static.StateMachine = new StateMachine();

    var State = Game.State = Class({
        name: null,

        entry: function(from_state) {},
        exit: function(to_state) {},
        run: function() {}
    });

})();
