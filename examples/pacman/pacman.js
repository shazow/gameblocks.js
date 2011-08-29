// Constants
var WIDTH=30, HEIGHT=20, MAGNIFY=24;
var world_box = [0, 0, WIDTH-1, HEIGHT-1];


// Game
var container = Dom.select("#container");
var camera = new Game.Camera(container, WIDTH*MAGNIFY, HEIGHT*MAGNIFY);
var renderer = new Game.Renderer(camera, 1);
var input = new Game.Input();
var state_machine = new Game.StateMachine();
var engine = new Game.Engine(state_machine); // This time we'll start and stop the engine inside our States
var clock = new Game.Clock(); // We'll use a clock to maintain motion speed regardless of frame rate

var ctx = renderer.layers[0];


var sheet1 = new Game.SpriteSheet("sprites.gif", [24, 24], [292, 172, 292+24*4, 172+24]);
var sheet2 = new Game.SpriteSheet("sprites.gif", [24, 24], [4, 268, 4+24*4, 268+24]);
var frame_limiter = new Game.FrameLimiter(5);

var Player = Class({
    directions: {
        'right': [1, 0],
        'left': [-1, 0],
        'down': [0, 1], // Our grid is upside-down for convenience
        'up': [0, -1]
    },
    direction: null,
    next_direction: null,
    pos: [],
    last_pos: [],
    smooth_transition: 0,
    sprites: {
        'right': new Game.SpriteAnimation(sheet1, frame_limiter, [0, 2]),
        'down':  new Game.SpriteAnimation(sheet1, frame_limiter, [1, 3]),
        'left':  new Game.SpriteAnimation(sheet2, frame_limiter, [0, 2]),
        'up':    new Game.SpriteAnimation(sheet2, frame_limiter, [1, 3])
    },
    last_sprite: 'right',

    init: function(pos) {
        this.pos = pos || [0, 0];
    },

    draw: function(ctx, steps) {
        var sprite = this.sprites[this.direction || this.last_sprite];

        var steps = steps % 1;

        var pos = [
            ~~((this.pos[0]*steps+this.last_pos[0]*(1-steps))*MAGNIFY),
            ~~((this.pos[1]*steps+this.last_pos[1]*(1-steps))*MAGNIFY)
        ];
        sprite.draw(ctx, pos);
    },

    update: function() {
        // Process player actions
        var direction = player.next_direction;

        var x = player.pos[0], y = player.pos[1];

        if(direction) {
            // Compute new position
            var delta = player.directions[direction];
            x += delta[0];
            y += delta[1];
        }

        // Check for collisions

        // Hit world boundary?
        if(!unstdlib.in_boundary([x, y], world_box)) {
            // Stop and reset direction
            this.last_sprite = direction;
            direction = null;
            x = player.pos[0];
            y = player.pos[1];
        }

        if(direction==null && player.direction) {
            this.sprites[this.last_sprite].pause(1);
        } else if(direction) {
            this.sprites[direction].play();
        }

        // Update player's position
        player.direction = direction;
        player.last_pos = player.pos;
        player.pos = [x, y];
    }
});

var player = null;
var movement_limiter = new Game.FrameLimiter(8);

state_machine.add('intro', {
    'enter': function() {
        player = new Player();

        ctx.clearRect(0, 0, WIDTH*MAGNIFY, HEIGHT*MAGNIFY);

        state_machine.enter('play');
    }
});
state_machine.add('play', {
    'enter': function() {
        player = new Player();
        engine.start(30);
    },

    'exit': function() {
        engine.stop();
    },

    'run': function() {
        // Capture input
        for(var action in player.directions) {
            if(!input.pressed[action]) continue;

            player.next_direction = action;
            break;
        }

        var ticks = movement_limiter.tick_partial();

        // Update player?
        if(ticks >= 1) player.update();

        // Reset the canvas
        ctx.clearRect(0, 0, WIDTH*MAGNIFY, HEIGHT*MAGNIFY);

        // Paint our player
        player.draw(ctx, ticks);
    }
});

state_machine.enter('intro'); // Start the state machine at the intro

// Bind input keys to actions
input.bind({
    'RIGHT_ARROW': 'right',
    'LEFT_ARROW': 'left',
    'DOWN_ARROW': 'down',
    'UP_ARROW': 'up',
});


// Everything should be setup by now, time to start accepting customers
input.keyboard_start();
