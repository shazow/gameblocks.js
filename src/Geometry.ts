class Size2D {
    width: number;
    height: number;
}

class Position2D {
    x: number;
    y: number;
}

class Vector2D {
    x: number;
    y: number;

    rotate(angle:number): Vector2D {
        let sin = Math.sin(angle), cos = Math.cos(angle);
        return {
            x: this.x * cos - this.y * sin,
            y: this.x * sin + this.y * cos
        } as Vector2D;
    }
}

class Box {
    x: number;
    y: number;
    width: number;
    height: number;
}

class Circle {
    x: number;
    y: number;
    radius: number;
}

/**
 * Determine if Position falls within Box.
 */
function in_boundary(pos:Position2D, box:Box): boolean {
    return pos.x >= box.x &&
           pos.y >= box.y &&
           pos.x <= box.x + box.width &&
           pos.y <= box.y + box.height;
}

/**
 * Determine if Position falls within Circle.
 */
function in_radius(pos:Position2D, circle:Circle):boolean {
    let dx = pos.x - circle.x, dy = pos.y - circle.y;
    return circle.radius*circle.radius >= dx*dx + dy*dy;
}

/**
 * Get the center Position of Box.
 */
function boundary_center(box:Box): Position2D {
    return {
        x: box.x - box.width / 2,
        y: box.y - box.height / 2
    };
}

/**
 * Rotate a two-dimensional Vector by a given angle.
 */
function rotate(vector:Vector2D, angle:number) {
    var sin = Math.sin(angle), cos = Math.cos(angle);
    return {
        x: vector.x * cos - vector.y * sin,
        y: vector.x * sin + vector.y * cos
    };
}


/**
 * Grid tools.
 */

/**
 * Make a two-dimensional grid of a given Size such that each cell's value
 * is determined by a callback for each position.
 *
 * @param {unstdlib.Size} size  Size of the 2D grid.
 * @param {function(number, number)} fn  Callback called for each x and y
 *     position in the grid, return value is used for the grid in the
 *     respective position.
 *
 * @return {Array.<Array>}
 */
function make_grid(size:Size2D, fn:(x:number, y:number) => any): any {
    let grid = [];
    for (let x=0, w=size.width; x<w; x++) {

        let row = [];
        for(let y=0, h=size.height; y<h; y++) row.push(fn(x, y));

        grid.push(row);
    }
    return grid;
}

/**
 * Make a two-dimensional grid of a given Size such that each cell has the
 * same value.
 *
 * (A faster and simpler implementation of unstdlib.make_grid)
 */
function make_grid_fast(size:Size2D, value:any): any{
    let grid = [];
    let w = size.width, h = size.height;
    for (let x=w; x>0; x--) {

        let row = [];
        for(let y=h; y>0; y--) row.push(value);

        grid.push(row);
    }
    return grid;
}
