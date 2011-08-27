//// Complete example for Game.Intelligence.pathfind_astar:
//
//  function example(width, height, wall_factor) {
//      var width = width || 10;
//      var height = height || 10;
//
//      if(wall_factor===undefined) {
//          wall_factor = 0.3;
//      }
//
//      var world_box = [0, 0, width, height];
//
//      var example_grid = unstdlib.make_grid([width, height], function(pos) {
//          return Math.random() < wall_factor;
//      });
//
//      /**
//       * Example cost estimating heuristic, using Manhattan Distance.
//       * More here: http://theory.stanford.edu/~amitp/GameProgramming/Heuristics.html
//       */
//      function example_estimate_cost_fn(a, b) {
//          return Math.abs(a[0] - b[0]) + Math.abs(a[1] - b[1]);
//      }
//
//      function example_neighbors_fn(pos) {
//          var r = [];
//          unstdlib.iter_box([pos[0]-1, pos[1]-1, pos[0]+1, pos[1]+1], function(p) {
//              if(p[0] == pos[0] && p[1] == pos[1]) return; // Skip center point
//              if(!unstdlib.in_boundary(p, world_box)) return; // Must be in our boundary
//              if(example_grid[p[0]][p[1]]) return; // Must not be wall (false)
//              r.push(p);
//          });
//          return r;
//      }
//
//      /**
//       * Pythagorean action.
//       */
//      function example_distance_fn(a, b) {
//          return Math.sqrt((a[0] * b[0]) + (a[1] + b[1]));
//      }
//
//      function example_compare_fn(a, b) {
//          var col = a[0] - b[0];
//          if(col!=0) return col;
//          return a[1] - b[1];
//      }
//
//      return {
//          world: example_grid,
//          path: Game.Intelligence.pathfind_astar([0,0], [width-1,height-1], example_estimate_cost_fn, example_neighbors_fn, example_distance_fn, example_compare_fn)
//      }
//  }

(function() {

    /**
     * Based on: http://en.wikipedia.org/wiki/A*
     */
    var pathfind_astar = Game.pathfind_astar = function(start, goal, estimate_cost_fn, neighbors_fn, distance_fn, compare_fn) {
        var closed_set = {};
        var queue = [start]; // aka. open set
        var came_from = {};

        var g_score = {start: 0};
        var h_score = {start: estimate_cost_fn(start, goal)};
        var f_score = {start: h_score[start]};

        while(queue.length > 0) {
            var x = queue.shift();

            if(compare_fn(x, goal) == 0) {
                return pathfinder_reconstruct(came_from, came_from[goal]);
            }
            closed_set[x] = true;

            var neighbors = neighbors_fn(x);
            for(var i=0, istop=neighbors.length, y; i<istop, y = neighbors[i]; i++) {
                if(closed_set[y]) continue;

                var new_score = g_score[x] + distance_fn(x, y);
                var new_is_better = false;

                // In queue?
                var in_queue = unstdlib.binary_search(queue, y, compare_fn);
                if(in_queue < 0) {
                    // Add y to open set.
                    queue.splice(~in_queue, 0, y);
                    new_is_better = true;
                } else if(new_score < g_score[y]) {
                    new_is_better = true;
                }

                if(new_is_better) {
                    var estimated_cost = estimate_cost_fn(y, goal);

                    came_from[y] = x;
                    g_score[y] = new_score;
                    h_score[y] = estimated_cost;
                    f_score[y] = new_score + estimated_cost;
                }
            }
        }

        return false;
    }

    // Helper
    function pathfinder_reconstruct(came_from, current_node) {
        var n = came_from[current_node];
        if(n===undefined) return [current_node];

        var p = pathfinder_reconstruct(came_from, came_from[current_node]);
        p.push(current_node);
        return p;
    }

})();
