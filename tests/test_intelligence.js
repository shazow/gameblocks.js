module('core');

/** Setup helpers: */

var get_helpers = function(world, world_box) {

    var neighbor_directions = [
        {x: 0, y: 1},
        {x: 1, y: 0},
        {x: 0, y: -1},
        {x: -1, y: 1}
    ];

    return {

        estimate_cost_fn: function(a, b) {
            return Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
        },

        neighbors_fn: function(pos) {
            var r = [];
            for(var i=0; i<4; i++) {
                var d = neighbor_directions[i];
                var p = {x: pos.x + d.x, y: pos.y + d.y};

                if(!unstdlib.in_boundary(p, world_box)) continue; // Must be in our boundary
                if(world[p.x][p.y]==1) continue;

                r.push(p);
            }

            return r;
        },

        distance_fn: function(a, b) {
            return 1;
        },

        compare_fn: function(a, b) {
            // Sort by (y, x)
            var col = a.y - b.y;
            if(col!=0) return col;
            return a.x - b.y;
        },

        serialize_fn: function(pos) {
            return pos.x + ',' + pos.y;
        }
    }
}

var find_path = function(world, world_box, start, goal) {
    var helpers = get_helpers(world, world_box);
    var r = Game.pathfind_astar(start, goal,
                                helpers.estimate_cost_fn,
                                helpers.neighbors_fn,
                                helpers.distance_fn,
                                helpers.compare_fn,
                                helpers.serialize_fn);

    if(!r) return [];

    r.push(goal);

    return r;
}


test("pathfind_astar simple", function() {
    var world_box = {x: 0, y: 0, width: 5, height: 5};
    var world = unstdlib.make_grid_fast(world_box, 0);

    var path = find_path(world, world_box, {x: 1, y: 1}, {x: 3, y: 3});

    deepEqual(path, [
        {x: 1, y: 1},
        {x: 2, y: 1},
        {x: 3, y: 1},
        {x: 3, y: 2},
        {x: 3, y: 3}
    ]);

    var path = find_path(world, world_box, {x: 4, y: 4}, {x: 0, y: 0});

    deepEqual(path, [
        {x: 4, y: 4},
        {x: 4, y: 3},
        {x: 4, y: 2},
        {x: 4, y: 1},
        {x: 4, y: 0},
        {x: 3, y: 0},
        {x: 2, y: 0},
        {x: 1, y: 0},
        {x: 0, y: 0}
    ]);

});
