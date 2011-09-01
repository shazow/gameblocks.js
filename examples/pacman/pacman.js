// Constants
var WIDTH=30, HEIGHT=20, MAGNIFY=12;
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

var world = (function(s, width, height) {
    // Parse world string
    return unstdlib.make_grid([width, height], function(pos) {
        return s[pos[1] * width + pos[0]];
    });
})(
"111111111111111111111111111111" +
"163333333333333333333333333371" +
"120000000000000000000000000041" +
"120000000000000000000000000041" +
"120000000000000000000000000041" +
"120000000000000000000000000041" +
"120000000a555b000a555b00000041" +
"1200000004633c000d337200000041" +
"120000000420000000004200000041" +
"120000000420000000004200000041" +
"120000000420000000004200000041" +
"120000000420000000004200000041" +
"1200000004855b000a559200000041" +
"120000000d333c000d333c00000041" +
"120000000000000000000000000041" +
"120000000000000000000000000041" +
"120000000000000000000000000041" +
"120000000000000000000000000041" +
"185555555555555555555555555591" +
"111111111111111111111111111111", WIDTH, HEIGHT);

var tile_lookup = {};
new Game.SpriteSheet("sprites.gif", [12, 12], [196, 77, 192+12*14, 77+12], function() {
    tile_lookup[2] = new Game.Sprite(this, 3);
    tile_lookup[3] = new Game.Sprite(this, 11);
    tile_lookup[4] = new Game.Sprite(this, 2);
    tile_lookup[5] = new Game.Sprite(this, 12);
    tile_lookup[6] = new Game.Sprite(this, 1);
    tile_lookup[7] = new Game.Sprite(this, 0);
    tile_lookup[8] = new Game.Sprite(this, 5);
    tile_lookup[9] = new Game.Sprite(this, 4);
});
new Game.SpriteSheet("sprites.gif", [12, 12], [148, 89, 148+12*4, 89+12], function() {
    tile_lookup['a'] = new Game.Sprite(this, 1);
    tile_lookup['b'] = new Game.Sprite(this, 0);
    tile_lookup['c'] = new Game.Sprite(this, 2);
    tile_lookup['d'] = new Game.Sprite(this, 3);
});

var draw_world = function(ctx) {
    // Reset the canvas
    ctx.clearRect(0, 0, WIDTH*MAGNIFY, HEIGHT*MAGNIFY);

    // TODO: Cache this part, since the world doesn't change
    ctx.fillStyle = '#aaa';
    unstdlib.iter_box(world_box, function(pos) {
        var val = world[pos[0]][pos[1]];
        var tile = tile_lookup[val];

        if(tile===undefined) return;

        tile.draw(ctx, [pos[0] * MAGNIFY, pos[1] * MAGNIFY]);
    });
}

var is_collision = function(pos) {
    return world[pos[0]][pos[1]] != 0;
}

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
        var offset = 6;

        var pos = [
            ~~((this.pos[0]*steps+this.last_pos[0]*(1-steps))*MAGNIFY-offset),
            ~~((this.pos[1]*steps+this.last_pos[1]*(1-steps))*MAGNIFY-offset)
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
        if(!unstdlib.in_boundary([x, y], world_box) || is_collision([x, y])) {
            // Stop and reset direction
            this.last_sprite = direction;
            direction = null;
            x = player.pos[0];
            y = player.pos[1];
        }

        if(world[x][y] != 0) 

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
        ctx.clearRect(0, 0, WIDTH*MAGNIFY, HEIGHT*MAGNIFY);

        state_machine.enter('play');
    }
});
state_machine.add('play', {
    'enter': function() {
        player = new Player([3, 3]);
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

        draw_world(ctx);

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
