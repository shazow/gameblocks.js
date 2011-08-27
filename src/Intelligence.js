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
//          return Math.sqrt(Math.pow(a[0] - b[0], 2) + Math.pow(a[1] - b[1], 2));
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
     * A* search algorithm for path-finding.
     * Based on: http://en.wikipedia.org/wiki/A*
     *
     * @param {Array.<number>} start   Starting position in the form [x, y]
     * @param {Array.<number>} goal    Ending goal position in the form [x', y']
     * @param {Function} estimate_cost_fn  Given two positions, return an estimated distance score
     * @param {Function} neighbors_fn  Given one position, return a list of valid neighbor positions
     * @param {Function} distance_fn   Given two positions of two neighbors, return a distance score
     * @param {Function} compare_fn    Given two positions, return 0 if equal
     *
     * @return {Array} List of positions forming a contiguous path from start to goal (exclusive).
     */
    var pathfind_astar = Game.pathfind_astar = function(start, goal, estimate_cost_fn, neighbors_fn, distance_fn, compare_fn) {
        var visited_set = {}; // aka. closed set
        var queue = [start]; // aka. open set
        var came_from = {};

        // Score caches
        var g_score = {}, // Accurate progress distance
            h_score = {}, // Estimated remaining distance
            f_score = {}; // Estimated total path distance

        g_score[start] = 0;
        h_score[start] = f_score[start] = estimate_cost_fn(start, goal);

        // Compare function used to keep our candidacy queue sorted.
        var compare_f_scores = function(a, b) {
            return f_score[a] - f_score[b];
        }

        // Traverse candidate queue
        while(queue.length > 0) {
            // Next candidate with lowest f_score value
            var x = queue.shift();

            if(compare_fn(x, goal) == 0) {
                return pathfinder_reconstruct(came_from, came_from[goal]);
            }
            visited_set[x] = true;

            // Check neighbors for candidacy
            var neighbors = neighbors_fn(x);
            for(var i=0, istop=neighbors.length, y; i<istop, y = neighbors[i]; i++) {
                if(visited_set[y] === true) continue; // Already visited, skip

                var add_to_queue = f_score[y] === undefined;
                var new_score = g_score[x] + distance_fn(x, y);
                var new_is_better = add_to_queue || new_score < g_score[y];

                if(!new_is_better) continue; // Better alternative already known

                var estimated_cost = estimate_cost_fn(y, goal);

                came_from[y] = x;
                g_score[y] = new_score;
                h_score[y] = estimated_cost;
                f_score[y] = new_score + estimated_cost;

                if(add_to_queue) unstdlib.binary_insert(queue, y, compare_f_scores);
            }

        }

        return false;
    }

    // Helper
    function pathfinder_reconstruct(came_from, current_node) {
        var n = came_from[current_node];
        if(n === undefined) return [current_node];

        var p = pathfinder_reconstruct(came_from, came_from[current_node]);
        p.push(current_node);
        return p;
    }

})();
