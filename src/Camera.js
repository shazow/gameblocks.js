var Game = (function(Game) {

    var Camera = Game.Camera = Class({
        width: 640,
        height: 480,

        container: null,
        element: null,

        offset: {x: 0, y: 0},

        /**
         * @param {Element} container   The DOM element which will contain the viewport.
         * @param {number=} width       Width of viewport.
         * @param {number=} height      Height of viewport.
         */
        init: function(container, width, height) {
            this.container = container;

            this.width = width || this.width;
            this.height = height || this.height;

            this.element = Dom.create('div', {'style': 'width: '+ this.width +'px; height: '+ this.height +'px;'});
            this.container.appendChild(this.element);
        },
        pan: function(offset) {
            throw Error('Camera.pan is not implemented.');
        }
    });

    return Game;
})(Game || {});
