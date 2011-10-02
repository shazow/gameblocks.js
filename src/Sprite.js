var Game = (function(Game) {

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
        dim: {width: 16, height: 16},
        box: {},
        sprite_boxes: [],
        num_sprites: 0,

        /**
         * @param {string} src Image src url.
         * @param {Game.Size} dim Dimensions of the sprites in the sheet.
         * @param {Game.Box} [box] Bounding box of sprites to load within image
         *     (default to full image size).
         */
        init: function(src, dim, box, callback) {
            // TODO: Add support for offsets
            // TODO: Add support for scaling

            this.dim = dim || this.dim;
            this.box = box;

            var sprite_boxes = this.sprite_boxes = [];

            var self = this;
            this.img = get_sprite_image(src, function() {
                if(box===undefined) {
                    self.box = box = {x: 0, y: 0, width: self.img.width, height: self.img.height};
                }

                // Populate sprite boxes
                for(var y=box.y, ystop=box.height, yincr = dim.height; y+yincr<=ystop; y += yincr) {
                    for(var x=box.x, xstop=box.width, xincr = dim.width; x+xincr<=xstop; x += xincr) {
                        // FIXME: Should we only push the x, y because we can get
                        //        the height and width from self.dim?
                        sprite_boxes.push({x: x, y: y, width: xincr, height: yincr});
                    }
                }

                self.num_sprites = sprite_boxes.length;

                callback && callback.call(self);
            });
        }
    });

    var Sprite = Game.Sprite = Class({
        box: {},
        dim: {},
        sheet: null,

        /**
         * @param {SpriteSheet} sheet SpriteSheet containing the sprite.
         * @param {number} i Index position of the sprite in the sprite sheet (0-indexed).
         */
        init: function(sheet, i) {
            this.sheet = sheet;
            this.box = sheet.sprite_boxes[i];
            this.dim = sheet.dim;
        },
        draw: function(ctx, pos) {
            var width = this.dim.width, height = this.dim.height;
            ctx.drawImage(this.sheet.img, this.box.x, this.box.y, width, height, pos.x, pos.y, width, height);
        }
    });

    var SpriteBlank = Game.SpriteBlank = Sprite.extend({
        style: '',
        dim: [],

        init: function(style, dim) {
            this.style = style;
            this.dim = dim;
        },

        draw: function(ctx, pos) {
            ctx.fillStyle = this.style;
            ctx.fillRect(pos.x, pos.y, this.dim.width, this.dim.height);
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
            var dim = this.sheet.dim;

            ctx.drawImage(this.sheet.img, box.x, box.y, dim.width, dim.height, pos.x, pos.y, dim.width, dim.height);
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
