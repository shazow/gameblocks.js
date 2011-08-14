/*

There's a good amount of repetitive code in this module for the sake of execution optimization.

*/


var CircleEntity = function(pos, radius) {
    this.pos = pos;
    this.radius = radius;
}



var BoxEntity = function(box) {
    this.box = box;
}


var PositionCollider = function(size) {
    this.size = size;
}
PositionCollider.prototype = {
    init: function() {
        this.grid = make_grid_fast(this.size, 0);
    },
    set: function(pos, value) {
        this.grid[pos[0]][pos[1]] = value;
    },
    set_box: function(box, value) {
        var x1 = box[0], y1 = box[1], x2 = box[2], y2 = box[3];

        var grid = this.grid;
        for(var x=x1; x<x2; x++) {
            for(var y=y1; y<y2; y++) {
                grid[x][y] = value;
            }
        }
    },
    set_from_canvas: function(ctx, box) {
        var x1 = box[0], y1 = box[1], x2 = box[2], y2 = box[3];
        var dx = x2-x1, dy = y2-y1;

        var data = ctx.getImageData(x1, y1, dx, dy).data;
        var grid = this.grid;

        var i = 3;
        for(var y=y1; y<y2; y++) {
            for(var x=x1; x<x2; x++) {
                grid[x][y] = data[i] == 255;
                i+= 4;
            }
        }
    },
    get: function(pos) {
        return this.grid[pos[0]][pos[1]] != false;
    }
}



var EntityCollider = function(size) {
    this.size = size;
}
EntityCollider.prototype = {
    init: function() {
        this.circles = [];
        this.boxes = [];
        this.collider = new PositionCollider(this.size);
        this.collider.init();
    },
    add: function(entity) {
        // XXX: Add entity to this.collider
        if(entity.box) {
            this.boxes.push(entity);
        } else if(entity.pos && entity.radius) {
            this.circles.push(entity);
        }
    },
    remove: function(entity) {
        var boxes = this.boxes;
        for(var i=boxes.length-1; i>=0; i--) {
            if(entity==boxes[i]) {
                boxes.splice(i, 1);
                return true;
            }
        }

        var circles = this.circles;
        for(var i=circles.length-1; i>=0; i--) {
            if(entity==circles[i]) {
                circles.splice(i, 1);
                return true;
            }
        }

    },
    get: function(pos) {
        if(!this.collider.get(pos)) return false;
        // FIXME: Should this be callback-based to handle multiple collisions?

        // Check boxes
        var boxes = this.boxes;
        for(var i=boxes.length-1; i>=0; i--) {
            var entity = boxes[i];
            if(in_boundary(pos, entity.box)) return entity;
        }

        // FIXME: No circles for now.
        return true;
        /*
        // Check circles
        var circles = this.circles;
        for(var i=circles.length-1; i>=0; i--) {
            var entity = circles[i];
            if(in_radius(pos, entity.pos, entity.radius)) return entity;
        }

        return true;
        */
    }
}

