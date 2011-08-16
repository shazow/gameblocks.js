(function() {

    var Input = Game.Input = Class({
        bindings: null,
        pressed: null,
        queued: null,

        _handler_keydown: null,
        _handler_keyup: null,

        init: function() {
            this.bindings = {};
            this.pressed = {};
            this.queued = {};

            var self = this;
            this._handler_keydown = function(e) { self.keydown(e); };
            this._handler_keyup = function(e) { self.keyup(e); };

            this.start_listening();
        },

        start_listening: function() {
            window.addEventListener('keydown', this._handler_keydown, false);
            window.addEventListener('keyup', this._handler_keyup, false);
        },
        stop_listening: function() {
            window.removeEventListener('keydown', this._handler_keydown);
            window.removeEventListener('keyup', this._handler_keyup);
        },
        bind_listen: function(action) {
            this.stop_listening();

            var self = this;
            function _handle_bind(e) {
                self.bindings[e.keyCode] = action;

                e.stopPropagation();
                e.preventDefault();

                window.removeEventListener('keydown', _handle_bind);

                self.start_listening();
            }
            window.addEventListener('keyup', _handle_bind, false);
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
            if(queue) {
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
        bind: function(d) {
            for(var k in d) {
                this.bindings[k] = d[k];
            }
        },
        queue: function(key, fn) {
            var has_binding = this.bindings[key];
            if(has_binding) {
                // Wrap fn to restore original binding.
                var self = this;
                fn = function() {
                    fn();
                    self.bindings[key] = has_binding;
                };
            }

            // Queue a one-time execution of fn when key is pressed.
            var queue = this.queued[key] || [];
            queue.push(fn);

            this.queued[key] = queue;
        }
    });

    // Based on key codes from Google Closure
    Input.KEY_CODES = {
        8: "BACKSPACE",
        9: "TAB",
        13: "ENTER",
        16: "SHIFT",
        17: "CTRL",
        18: "ALT",
        19: "PAUSE",
        20: "CAPS_LOCK",
        27: "ESC",
        32: "SPACE",
        33: "PAGE_UP",
        34: "PAGE_DOWN",
        35: "END",
        36: "HOME",
        37: "LEFT_ARROW",
        38: "UP_ARROW",
        39: "RIGHT_ARROW",
        40: "DOWN_ARROW",
        44: "PRINT_SCREEN",
        45: "INSERT",
        46: "DELETE",
        48: "0",
        49: "1",
        50: "2",
        51: "3",
        52: "4",
        53: "5",
        54: "6",
        55: "7",
        56: "8",
        57: "9",
        63: "?",
        65: "A",
        66: "B",
        67: "C",
        68: "D",
        69: "E",
        70: "F",
        71: "G",
        72: "H",
        73: "I",
        74: "J",
        75: "K",
        76: "L",
        77: "M",
        78: "N",
        79: "O",
        80: "P",
        81: "Q",
        82: "R",
        83: "S",
        84: "T",
        85: "U",
        86: "V",
        87: "W",
        88: "X",
        89: "Y",
        90: "Z",
        91: "META",
        93: "CONTEXT_MENU",
        96: "NUM_0",
        97: "NUM_1",
        98: "NUM_2",
        99: "NUM_3",
        100: "NUM_4",
        101: "NUM_5",
        102: "NUM_6",
        103: "NUM_7",
        104: "NUM_8",
        105: "NUM_9",
        106: "NUM_*",
        107: "NUM_+",
        109: "NUM_-",
        110: "NUM_PERIOD",
        111: "NUM_DIVISION",
        112: "F1",
        113: "F2",
        114: "F3",
        115: "F4",
        116: "F5",
        117: "F6",
        118: "F7",
        119: "F8",
        120: "F9",
        121: "F10",
        122: "F11",
        123: "F12",
        144: "NUMLOCK",
        186: ":",
        189: "-",
        187: "=",
        188: ",",
        190: ".",
        191: "/",
        192: "APOSTROPHE",
        222: "'",
        219: "[",
        220: "\\",
        221: "]",
        224: "WIN_KEY"};

    Input.KEY_CODES_LOOKUP = unstdlib.inverse_lookup(Input.KEY_CODES);

})();
