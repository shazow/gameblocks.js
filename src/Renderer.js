var Game = (function(Game) {

    /** Renderers: */

    var CanvasRenderer = Game.CanvasRenderer = Class({
        container: null,
        layers: [],

        /**
         * @param {Camera} camera       Camera element responsible for drawing the viewport.
         * @param {number=1} num_layers  Number of canvas layers to create.
         */
        init: function(camera, num_layers) {
            this.container = camera.element;

            var attrs = {'width': camera.size , 'height': camera.height};

            var i = num_layers || 1;

            // TODO: Make layers a named dict?
            while(i--) {
                var layer = Dom.create("canvas", camera.size);
                this.layers.push(layer.getContext('2d'));
                this.container.appendChild(layer);
            }
        }

        // TODO: Register entities with renderer?
    });

    // TODO: Add DomRenderer


    // Default renderer
    Game.Renderer = CanvasRenderer;

    return Game;
})(Game || {});
