var Game = (function(Game) {

    /** Renderers: */

    var CanvasRenderer = Game.CanvasRenderer = Class({
        container: null,
        layers: [],

        /**
         * @param {Camera} camera       Camera element responsible for drawing the viewport.
         * @param {number=1} num_layers  Number of canvas layers to create.
         */
        init: function(camera, num_layers) {
            this.container = camera.element;

            var attrs = {'width': camera.width, 'height': camera.height};

            var i = num_layers || 1;

            // TODO: Make layers a named dict?
            while(i--) {
                var layer = Dom.create("canvas", attrs);
                this.layers.push(layer.getContext('2d'));
                this.container.appendChild(layer);
            }
        }

        // TODO: Register entities with renderer?
    });

    // TODO: Add DomRenderer


    // Default renderer
    Game.Renderer = CanvasRenderer;


    /** Sprites: */

    // Cache image objects
    var sprite_images = {};

    // Cache-aware helper
    var get_sprite_image = function(src, callback) {
        // TODO: Add some kind of is_loading attribute and a callback queue
        var img = sprite_images[src];
        if(img) {
            callback.call(img);
            return img;
        }
        var img = sprite_images[src] = Dom.create("img");
        img.onload = callback;
        img.src = src;
        return img;
    }

    var SpriteSheet = Game.SpriteSheet = Class({
        img: null,
        dims: [16, 16],
        box: [],
        sprite_boxes: [],
        num_sprites: 0,

        /**
         * @param {string} src Image src url.
         * @param {Array=[16, 16]} dims Dimension of the sprites in the form [width, height]
         * @param {Array} [box] Bounding box of sprites to load within image in the form [x1, y1, x2, y2] (default to full image size).
         */
        init: function(src, dims, box) {
            // TODO: Add support for offsets
            // TODO: Add support for scaling

            this.dims = dims || this.dims;
            this.box = box;

            var sprite_boxes = this.sprite_boxes = [];

            var self = this;
            this.img = get_sprite_image(src, function() {
                if(box===undefined) {
                    self.box = box = [0, 0, self.img.width, self.img.height];
                }

                // Populate sprite boxes
                for(var y=box[1], ystop=box[3], yincr = dims[1]; y+yincr<=ystop; y += yincr) {
                    for(var x=box[0], xstop=box[2], xincr = dims[0]; x+xincr<=xstop; x += xincr) {
                        sprite_boxes.push([x, y, x+xincr, y+yincr]);
                    }
                }

                self.num_sprites = sprite_boxes.length;
            });
        }
    });

    var Sprite = Game.Sprite = Class({
        draw: null,

        /**
         * @param {SpriteSheet} sheet SpriteSheet containing the sprite.
         * @param {number} i Index position of the sprite in the sprite sheet (0-indexed).
         */
        init: function(sheet, i) {
            var box = sheet.sprite_boxes[this.i].box;
            var dims = sheet.dims;

            this.draw = function(ctx, pos) {
                ctx.drawImage(sheet.img, box[0], box[1], dims[0], dims[1], pos[0], pos[1], dims[0], dims[1]);
            }
        }
    });

    var SpriteAnimation = Game.SpriteAnimation = Sprite.extend({
        frame_limiter: null,
        frame_sequence: [],
        frame_pos: 0,
        is_playing: true,

        /**
         * @param {SpriteSheet} sheet SpriteSheet containing the sprite.
         * @param {number|Game.FrameLimiter} frame_limiter Desired frame rate for sprite animation.
         * @param {number[]} frame_sequence Sequence of sprites to play as frames from the SpriteSheet.
         */
        init: function(sheet, frame_limiter, frame_sequence) {
            this.sheet = sheet;

            if(typeof(frame_limiter) == 'number') {
                frame_limiter = new Game.FrameLimiter(frame_limiter);
            }

            this.frame_limiter = frame_limiter;
            this.frame_sequence = frame_sequence;
        },

        draw: function(ctx, pos) {
            // TODO: This can be optimized with better closures for attribute-access and by caching the last frame

            var delta_frames = this.frame_limiter.tick();

            if(delta_frames && this.is_playing) {
                this.frame_pos = (this.frame_pos + delta_frames) % this.frame_sequence.length;
            }

            var box = this.sheet.sprite_boxes[this.frame_sequence[this.frame_pos]];
            var dims = this.sheet.dims;

            ctx.drawImage(this.sheet.img, box[0], box[1], dims[0], dims[1], pos[0], pos[1], dims[0], dims[1]);
        },

        pause: function(frame) {
            this.is_playing = false;
            if(frame!==undefined) this.frame_pos = frame;
        },

        play: function(frame) {
            this.is_playing = true;
            if(frame!==undefined) this.frame_pos = frame;
        },

        rewind: function() {
            this.frame_pos = 0;
        },

        skip: function(frame) {
            this.frame_pos = frame || 0;
        },

        skip_random: function(frame) {
            this.frame_pos = ~~(Math.random() * this.frame_sequence.length);
        }

    });

    return Game;
})(Game || {});
