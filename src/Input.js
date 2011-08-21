(function() {

    var Input = Game.Input = Class({
        bindings: {},
        pressed: {},
        queued: {},

        _handler_keydown: null,
        _handler_keyup: null,

        mouse_pos: false,
        mouse_target: false,

        init: function() {
            this.bindings = {};
            this.pressed = {};
            this.queued = {};

            var self = this;
            this._handler_keydown = function(e) { self.keydown(e); };
            this._handler_keyup = function(e) { self.keyup(e); };
            this._handler_mouse_move = function(e) { self.mouse_move(e); };
        },

        keyboard_start: function() {
            window.addEventListener('keydown', this._handler_keydown, false);
            window.addEventListener('keyup', this._handler_keyup, false);
        },
        keyboard_stop: function() {
            window.removeEventListener('keydown', this._handler_keydown);
            window.removeEventListener('keyup', this._handler_keyup);
        },

        mouse_start: function(target) {
            target = this.mouse_target = target || window;

            target.addEventListener('mousedown', this._handler_keydown, false);
            target.addEventListener('mouseup', this._handler_keyup, false);
            target.addEventListener('mousemove', this._handler_mouse_move, false);

            // Mute context menu if we're listening for MOUSE2
            var self = this;
            var mute_key = KEY_CODES.MOUSE2;
            target.addEventListener('contextmenu', function(e) {
                if(self.bindings[mute_key] || self.queue[mute_key]) {
                    e.stopPropagation();
                    e.preventDefault();
                }
            }, false);

        },

        mouse_stop: function() {
            var events = ['mousedown', 'mouseup', 'mousemove', 'contextmenu'];

            for(var i=0, istop=events.length; i<istop; i++) {
                this.mouse_target.removeEventListener(events[i]);
            }

            this.mouse_target = false;
            this.mouse_pos = false;
        },

        mouse_move: function(e) {
            // TODO: Handle positioning relative to this.mouse_target
            this.mouse_pos = [e.pageX, e.pageY];
        },

        keydown: function(e) {
            var action = this.bindings[e.keyCode];
            if(action) {
                this.pressed[action] = true;
                e.stopPropagation();
                e.preventDefault();
                return;
            }

            var queue = this.queued[e.keyCode];
            if(queue && queue.length > 0) {
                queue.pop()();
            }
        },
        keyup: function(e) {
            var action = this.bindings[e.keyCode];
            if(action) {
                this.pressed[action] = false;
                e.stopPropagation();
                e.preventDefault();
            }
        },

        /*
         * @param {object} mapping    Mapping between key codes and action ids.
         */
        bind: function(mapping) {
            for(var key in mapping) {
                var key_code = _coerce_key_code(key);
                this.bindings[key_code] = mapping[key];
            }
        },
        queue: function(key, fn) {
            key_code = _coerce_key_code(key);

            var has_binding = this.bindings[key_code];
            if(has_binding) {
                // Wrap fn to restore original binding.
                var self = this;
                fn = function() {
                    self.bindings[key_code] = has_binding;
                    fn();
                };
            }

            // Queue a one-time execution of fn when key is pressed.
            var queue = this.queued[key_code] || [];
            queue.push(fn);

            this.queued[key_code] = queue;
        }
    });

    // Based on key codes from Google Closure
    var KEY_CODES = Input.KEY_CODES = {
        MOUSE1: -1,
        MOUSE2: -3,
        BACKSPACE: 8,
        TAB: 9,
        ENTER: 13,
        SHIFT: 16,
        CTRL: 17,
        ALT: 18,
        PAUSE: 19,
        CAPS_LOCK: 20,
        ESC: 27,
        SPACE: 32,
        PAGE_UP: 33,
        PAGE_DOWN: 34,
        END: 35,
        HOME: 36,
        LEFT_ARROW: 37,
        UP_ARROW: 38,
        RIGHT_ARROW: 39,
        DOWN_ARROW: 40,
        PRINT_SCREEN: 44,
        INSERT: 45,
        DELETE: 46,
        0: 48,
        1: 49,
        2: 50,
        3: 51,
        4: 52,
        5: 53,
        6: 54,
        7: 55,
        8: 56,
        9: 57,
        QUESTION_MARK: 63,
        A: 65,
        B: 66,
        C: 67,
        D: 68,
        E: 69,
        F: 70,
        G: 71,
        H: 72,
        I: 73,
        J: 74,
        K: 75,
        L: 76,
        M: 77,
        N: 78,
        O: 79,
        P: 80,
        Q: 81,
        R: 82,
        S: 83,
        T: 84,
        U: 85,
        V: 86,
        W: 87,
        X: 88,
        Y: 89,
        Z: 90,
        META: 91,
        CONTEXT_MENU: 93,
        NUM_0: 96,
        NUM_1: 97,
        NUM_2: 98,
        NUM_3: 99,
        NUM_4: 100,
        NUM_5: 101,
        NUM_6: 102,
        NUM_7: 103,
        NUM_8: 104,
        NUM_9: 105,
        NUM_MULTIPLY: 106,
        NUM_PLUS: 107,
        NUM_MINUS: 109,
        NUM_PERIOD: 110,
        NUM_DIVISION: 111,
        F1: 112,
        F2: 113,
        F3: 114,
        F4: 115,
        F5: 116,
        F6: 117,
        F7: 118,
        F8: 119,
        F9: 120,
        F10: 121,
        F11: 122,
        F12: 123,
        NUMLOCK: 144,
        COLON: 86,                 // :
        DASH: 89,                  // -
        EQUALS: 87,                // =
        COMMA: 88,                 // ,
        PERIOD: 90,                // .
        SLASH: 91,                 // /
        APOSTROPHE: 192,
        SINGLE_QUOTE: 222,         // '
        OPEN_SQUARE_BRACKET: 219,  // [
        BACKSLASH: 220,            // \
        CLOSE_SQUARE_BRACKET: 221, // ]
        WIN_KEY: 224
    }

    var KEY_CODES_LOOKUP = Input.KEY_CODES_LOOKUP = unstdlib.inverse_lookup(KEY_CODES);

    var _coerce_key_code = function(k) {
        if(typeof(k) == 'string') {
            // Lookup key code
            k = KEY_CODES[k];
        }
        if(typeof(k) != 'number') throw("BadKeyCode");
        return k;
    }

})();
