var Game = (function(Game) {

    /** Renderers: */

    var CanvasRenderer = Game.CanvasRenderer = Class({
        container: null,
        layers: [],
        width: 640,
        height: 480,

        /**
         * @param {Camera} camera       Camera element responsible for drawing the viewport.
         * @param {number=1} num_layers  Number of canvas layers to create.
         */
        init: function(camera, num_layers) {
            this.container = camera.element;
            this.width = camera.size.width;
            this.height = camera.size.height;

            var i = num_layers || 1;

            // TODO: Make layers a named dict?
            var styles = {style: 'position: absolute;', width: camera.size.width, height: camera.size.height};
            while(i--) {
                var layer = Dom.create("canvas", styles);
                this.layers.push(layer.getContext('2d'));
                this.container.appendChild(layer);
            }
        },

        clear: function() {
            for(var i in this.layers) {
                this.layers[i].clearRect(0, 0, this.width, this.height);
            }
        }

        // TODO: Register entities with renderer?
    });

    // TODO: Add DomRenderer


    // Default renderer
    Game.Renderer = CanvasRenderer;

    return Game;
})(Game || {});
