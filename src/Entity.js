/**
 * Warning: This module is unfinished.
 */
var Game = (function(Game) {

    var Entity_ = Game.Entity = Class({
        pos: {x: 0, y: 0},

        is_animated: false,
        is_collideable: false,

        init: function(pos) {
            this.pos = {x: ~~pos.x, y: ~~pos.y};
        },

        is_collision: function(entity) {
            return entity.pos.x == this.pos.x && entity.pos.y == this.pos.y;
        }
    });

    var distance_score = function(a, b) {
        var dx = a.x - b.x, dy = a.y - b.y;
        return dx*dx + dy*dy;
    }

    var is_collision_box_circle = function(box, circle) {
        // Contained?
        if(unstdlib.in_boundary(circle, box)) return true;

        var box_center = unstdlib.boundary_center(box);

        // Line between center of box to center of circle
        var dx = circle.x - box_center.x, dy = circle.y - box_center.y;

        var positive = -1 ? dx > 0 : 1;

        // FIXME: This part is wrong. It needs some pi.
        var m = dx/dy;
        var x = circle.radius * positive + circle.x;
        var y = m * x + circle.y;

        return unstdlib.in_boundary({x: x, y: y}, box);
    }

    var CircleEntity = Game.CircleEntity = Entity_.extend({
        circle: {x: 0, y: 0, radius: 1},

        init: function(circle) {
            this.__super__(circle);

            this.circle = circle;
        },

        is_collision: function(entity) {
            if(entity instanceof CircleEntity) return unstdlib.in_radius(entity.pos, this.circle); // FIXME: This is wrong.
            if(entity instanceof BoxEntity) return is_collision_box_circle(entity.box, this.circle);
            if(entity instanceof Entity_) return unstdlib.in_radius(entity.pos, this.circle);
        }
    });


    var BoxEntity = Game.BoxEntity = Entity_.extend({
        box: {x: 0, y: 0, width: 1, height: 1},

        init: function(box) {
            this.__super__(unstdlib.boundary_center(box));
            this.box = box;
        },

        is_collision: function(entity) {
            if(entity instanceof CircleEntity) return is_collision_box_circle(this.box, entity.circle);
            if(entity instanceof BoxEntity) return unstdlib.in_boundary(entity.pos, this.box);
            if(entity instanceof Entity_) return unstdlib.in_boundary(entity.pos, this.box); // FIXME: This is wrong.
        }
    });


    /** Entity Colliders: */

    var Collider = Game.Collider = Class({
        entities: [],

        init: function() {
            this.reset();
        },
        reset: function() {
            this.entities = [];
        },
        add: function(entity) {
            this.entities.push(entity);
        },
        is_collision: function(entity) {
            for(var i=0, istop=this.entities.length; i<istop; i++) {
                var current = this.entities[i];
                if(current.is_collision(entity)) return current;
            }
            return false;
        },
    });

    var BitmapCollider = Game.BitmapCollider = Collider.extend({
        box: {x: 0, y: 0, width: 10, height: 10},
        bitmap: null,

        init: function(box) {
            this.box = box;
            this.reset();
        },
        reset: function() {
            this.bitmap = unstdlib.make_grid_fast(this.box, 0);
        },
        add_box: function(box, value) {
            if(value===undefined) value = 1;

            var bitmap = this.bitmap;

            for(var x=x1; x<x2; x++) {
                for(var y=y1; y<y2; y++) {
                    bitmap[x][y] += value;
                }
            }
        },
        add_canvas: function(ctx, mask, value) {
            if(mask===undefined) mask = 255;
            if(value===undefined) value = 1;

            var box = this.box;
            var data = ctx.getImageData(box.x, box.y, box.width, box.height).data;
            var bitmap = this.bitmap;

            var i = 3;
            for(var y=box.y, y2=box.height; y<y2; y++) {
                for(var x=box.x, x2=box.width; x<x2; x++) {
                    bitmap[x][y] += Number(data[i] == 255);
                    i+= 4;
                }
            }
        },
        add: function(entity, value) {
            if(value===undefined) value = 1;

            // TODO: Support more types
            if(entity instanceof BoxEntity) {
                return this.add_box(entity, value);
            }
            this.bitmap[entity.pos.x][entity.pos.x] += value;
        },
        is_collision: function(entity) {
            var pos = entity.pos;
            var box = this.box;

            if(!unstdlib.in_boundary(pos, box)) return false;

            return this.bitmap[pos.x - box.x][pos.y - box.y];
        }
    });

    var ShapeCollider = Game.ShapeCollider = Collider.extend({
        /**
         * Somewhat efficient hashing into max_shape_size sized cells within
         * a hash-based grid.
         *
         * ``cell_size`` should be strictly larger than the largest entity
         * possible.
         */
        grid: {},
        cell_size: {width: 10, height: 10},

        init: function(cell_size) {
            this.cell_size = cell_size || this.cell_size;
            this.reset();
        },
        reset: function() {
            this.grid = {};
        },
        _get_cell: function(pos, create_if_missing) {
            var grid_pos = [
                pos.x - this.cell_size.width % pos.x,
                pos.y - this.cell_size.height % pos.y
            ]
            var cell = this.grid[grid_pos];
            if(cell===undefined) {
                if(!create_if_missing) return [];

                this.grid[grid_pos] = cell = [];
            }
            return cell;
        },
        add: function(entity) {
            var cell = this._get_cell(entity.pos, true);
            cell.push(entity);
        },
        is_collision: function(entity) {
            // TODO: Return multiple? Callback?
            var cell = this._get_cell(entity.pos);

            if(cell===undefined) {
                return false;
            }

            for(var i=cell.length-1; i>=0; i--) {
                var current = cell[i];
                if(current.is_collision(entity)) return current;
            }
            return false;
        }
    });

    return Game;
})(Game || {});
