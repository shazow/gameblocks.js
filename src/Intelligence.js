var Game = (function(Game) {
    /** @typedef {*} */
    Game.Position; // We're format-agnostic

    /**
     * A* search algorithm for path-finding.
     * Based on: http://en.wikipedia.org/wiki/A*
     *
     * @param {Game.Position} start  Starting position.
     * @param {Game.Position} goal  Ending goal position.
     * @param {function(Game.Position, Game.Position)} estimate_cost_fn  Given
     *     two positions, return an estimated distance score.
     * @param {function(Game.Position)} neighbors_fn  Given one position, return
     *     a list of valid neighbor positions.
     * @param {function(Game.Position, Game.Position)} distance_fn  Given two
     *     positions of two neighbors, return a distance score.
     * @param {function(Game.Position, Game.Position)} compare_fn  Given two
     *     positions, return 0 if equal.
     * @param {function(Game.Position)} serialize_fn  Given one position, return
     *     a string uniquely identifying that position.
     * @return {Array} List of positions forming a contiguous path from start to
     *     goal (exclusive).
     */
    var pathfind_astar = Game.pathfind_astar = function(start, goal, estimate_cost_fn, neighbors_fn, distance_fn, compare_fn, serialize_fn) {
        var visited_set = {}; // aka. closed set
        var queue = [start]; // aka. open set
        var came_from = {};

        // Score caches
        var g_score = {}; // Accurate progress distance
        var h_score = {}; // Estimated remaining distance
        var f_score = {}; // Estimated total path distance

        // We need dict lookup friendly keys, so we serialize everything into strings.
        var start_str = serialize_fn(start);
        var goal_str = serialize_fn(goal);

        g_score[start_str] = 0;
        h_score[start_str] = f_score[start_str] = estimate_cost_fn(start, goal);

        // Compare function used to keep our candidacy queue sorted.
        var compare_f_scores = function(a, b) {
            return f_score[serialize_fn(a)] - f_score[serialize_fn(b)];
        }

        // Traverse candidate queue
        while(queue.length > 0) {
            // Next candidate with lowest f_score value
            var candidate = queue.shift();
            var candidate_str = serialize_fn(candidate);

            if(compare_fn(candidate, goal) == 0) {
                return pathfinder_reconstruct(came_from, came_from[goal_str], serialize_fn);
            }
            visited_set[candidate_str] = true;

            // Check neighbors for candidacy
            var neighbors = neighbors_fn(candidate);
            for(var i=0, istop=neighbors.length; i<istop; i++) {
                var neighbor = neighbors[i];
                var neighbor_str = serialize_fn(neighbor);

                if(visited_set[neighbor_str] === true) continue; // Already visited, skip

                var add_to_queue = f_score[neighbor_str] === undefined;
                var new_score = g_score[candidate_str] + distance_fn(candidate, neighbor);
                var new_is_better = add_to_queue || new_score < g_score[neighbor_str];

                if(!new_is_better) continue; // Better alternative already known

                var estimated_cost = estimate_cost_fn(neighbor, goal);

                came_from[neighbor_str] = candidate;
                g_score[neighbor_str] = new_score;
                h_score[neighbor_str] = estimated_cost;
                f_score[neighbor_str] = new_score + estimated_cost;

                if(add_to_queue) unstdlib.binary_insert(queue, neighbor, compare_f_scores);
            }

        }

        return false;
    }

    // Helper
    function pathfinder_reconstruct(came_from, current_node, serialize_fn) {
        var current_node_str = serialize_fn(current_node);
        var next_node = came_from[current_node_str];
        if(next_node === undefined) return [current_node];

        var p = pathfinder_reconstruct(came_from, next_node, serialize_fn);

        p.push(current_node);
        return p;
    }

    return Game;
})(Game || {});
