/**
 * Warning: This module is unfinished.
 */
class Entity {
    pos: Position2D;

    is_animated: boolean = false;
    is_collideable: boolean = false;

    constructor(pos: Position2D) {
        this.pos = {x: ~~pos.x, y: ~~pos.y};
    }

    is_collision(entity:Entity): boolean {
        return entity.pos.x == this.pos.x && entity.pos.y == this.pos.y;
    }
}

function distance_score(a:Position2D, b:Position2D): number {
    const dx = a.x - b.x, dy = a.y - b.y;
    return dx*dx + dy*dy;
}

function is_collision_box_circle(box:Box, circle:Circle): boolean {
    // Contained?
    if(in_boundary(circle, box)) return true;

    const box_center = boundary_center(box);

    // Line between center of box to center of circle
    const dx = circle.x - box_center.x, dy = circle.y - box_center.y;
    const positive = dx > 0 ? 1 : -1;

    // FIXME: This part is wrong. It needs some pi.
    const m = dx/dy;
    const x = circle.radius * positive + circle.x;
    const y = m * x + circle.y;

    return in_boundary({x: x, y: y}, box);
}

class CircleEntity extends Entity {
    circle: Circle = {x: 0, y: 0, radius: 1};

    constructor(circle:Circle) {
        super(circle);

        this.circle = circle;
    }

    is_collision(entity:Entity): boolean {
        if(entity instanceof CircleEntity) return in_radius(entity.pos, this.circle); // FIXME: This is wrong.
        if(entity instanceof BoxEntity) return is_collision_box_circle(entity.box, this.circle);
        if(entity instanceof Entity) return in_radius(entity.pos, this.circle);
    }
}


class BoxEntity extends Entity {
    box: Box = {x: 0, y: 0, width: 1, height: 1};

    constructor(box:Box) {
        super(boundary_center(box));
        this.box = box;
    }

    is_collision(entity:Entity): boolean {
        if(entity instanceof CircleEntity) return is_collision_box_circle(this.box, entity.circle);
        if(entity instanceof BoxEntity) return in_boundary(entity.pos, this.box);
        if(entity instanceof Entity) return in_boundary(entity.pos, this.box); // FIXME: This is wrong.
    }
}


/** Entity Colliders: */

interface Collider {
    is_collision(entity:Entity): boolean
}

class LinearCollider implements Collider {
    entities: Entity[];

    constructor() {
        this.reset();
    }

    reset(): void {
        this.entities = [];
    }

    add(entity:Entity): void {
        this.entities.push(entity);
    }

    is_collision(entity:Entity): boolean {
        for(let i=0, istop=this.entities.length; i<istop; i++) {
            const current = this.entities[i];
            if(current.is_collision(entity)) return true;
        }
        return false;
    }
}

class BitmapCollider implements Collider {
    box: Box = {x: 0, y: 0, width: 10, height: 10};
    bitmap: any;

    constructor(box:Box) {
        this.box = box;
        this.reset();
    }

    reset(): void {
        this.bitmap = make_grid_fast(this.box, 0);
    }

    add_box(box:Box, value:any): void {
        if(value===undefined) value = 1;

        let bitmap = this.bitmap;

        for(let x=box.x; x<box.width; x++) {
            for(let y=box.y; y<box.height; y++) {
                bitmap[x][y] += value;
            }
        }
    }

    add_canvas(ctx:CanvasRenderingContext2D, mask:number, value:number): void {
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
    }

    add(entity:Entity, value:number): void {
        if(value===undefined) value = 1;

        // TODO: Support more types
        if(entity instanceof BoxEntity) {
            return this.add_box(entity.box, value);
        }
        this.bitmap[entity.pos.x][entity.pos.x] += value;
    }

    is_collision(entity:Entity): boolean {
        var pos = entity.pos;
        var box = this.box;

        if(!in_boundary(pos, box)) return false;

        return this.bitmap[pos.x - box.x][pos.y - box.y];
    }
};


/**
 * Somewhat efficient hashing into max_shape_size sized cells within
 * a hash-based grid.
 *
 * ``cell_size`` should be strictly larger than the largest entity
 * possible.
 */
class ShapeCollider implements Collider {
    grid: {[index:string] : [] } = {};
    cell_size: Size2D = {width: 10, height: 10};

    constructor(cell_size?:Size2D) {
        if(cell_size) {
            this.cell_size = cell_size;
        }
    }

    reset(): void {
        this.grid = {};
    }

    _cell_key(pos:Position2D): string {
        return pos.x + "," + pos.y;
    }

    _get_cell(pos:Position2D, create_if_missing?:boolean): any {
        const key = this._cell_key({
            x: pos.x - this.cell_size.width % pos.x,
            y: pos.y - this.cell_size.height % pos.y
        } as Position2D);
        let cell = this.grid[key];
        if(cell===undefined) {
            if(!create_if_missing) return [];

            this.grid[key] = cell = [];
        }
        return cell;
    }

    add(entity:Entity): void {
        const cell = this._get_cell(entity.pos, true);
        cell.push(entity);
    }

    is_collision(entity:Entity): boolean {
        // TODO: Return multiple? Callback?
        const cell = this._get_cell(entity.pos);

        if(cell===undefined) {
            return false;
        }

        for(let i=cell.length-1; i>=0; i--) {
            var current = cell[i];
            if(current.is_collision(entity)) return true;
        }
        return false;
    }

}
