module('Intelligence.js');

/** Setup helpers: */

var get_helpers = function(world, world_box) {
    return {
        estimate_cost_fn: function(a, b) {
            return Math.abs(a[0] - b[0]) + Math.abs(a[1] - b[1]);
        },

        neighbors_fn: function(pos) {
            var r = [];
            var directions = [[0, 1], [1, 0], [0, -1], [-1, 0]];

            for(var i=0, istop=directions.length, d; i<istop, d=directions[i]; i++) {
                var p = [pos[0] + d[0], pos[1] + d[1]];

                if(!unstdlib.in_boundary(p, world_box)) continue; // Must be in our boundary
                if(world[p[0]][p[1]]==1) continue;

                r.push(p);
            }

            return r;
            var r = [];
        },

        distance_fn: function(a, b) {
            return 1;
        },

        compare_fn: function(a, b) {
            // Sort by (y, x)
            var col = a[1] - b[1];
            if(col!=0) return col;
            return a[0] - b[0];
        },
    }
}

var find_path = function(world, world_box, start, goal) {
    var helpers = get_helpers(world, world_box);
    var r = Game.pathfind_astar(start, goal,
                                helpers.estimate_cost_fn,
                                helpers.neighbors_fn,
                                helpers.distance_fn,
                                helpers.compare_fn);

    if(!r) return [];

    r.push(goal);

    return r;
}


test("pathfind_astar simple", function() {
    var world_box = [0, 0, 4, 4];
    var world = unstdlib.make_grid_fast([5, 5], 0);

    var path = find_path(world, world_box, [1, 1], [3, 3]);

    deepEqual(path, [
        [1, 1],
        [2, 1],
        [3, 1],
        [3, 2],
        [3, 3]
    ]);

    var path = find_path(world, world_box, [4, 4], [0, 0]);

    deepEqual(path, [
        [4, 4],
        [3, 4],
        [2, 4],
        [1, 4],
        [0, 4],
        [0, 3],
        [0, 2],
        [0, 1],
        [0, 0]
    ]);

});
