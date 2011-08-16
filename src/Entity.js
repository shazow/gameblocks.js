(function() {

    var Entity = Game.Entity = Class({
        pos: [0, 0],

        is_animated: false,
        is_collideable: false,

        init: function(pos) {
            this.pos = pos;
        }
    });


    var CircleEntity = Game.CircleEntity = Entity.extend({
        radius: null,

        init: function(pos, radius) {
            this.__super__(pos);

            this.radius = radius;
        }
    });


    var BoxEntity = Game.BoxEntity = Entity.extend({
        box: null,
        dim: null,

        init: function(pos, dim) {
            this.__super__(pos);

            this.dim = dim;
            this.box = [pos[0], pos[1], pos[0] + dim[0], pos[1] + dim[1]];
        }
    });

})();
