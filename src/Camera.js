var Game = (function(Game) {

    var Camera = Game.Camera = Class({
        container: null,
        element: null,

        size: {width: 640, height: 480},
        offset: {x: 0, y: 0},

        /**
         * @param {Element} container   The DOM element which will contain the viewport.
         * @param {{width: number, height: number}} size  Size of the viewport.
         */
        init: function(container, size) {
            this.container = container;

            if(size) this.size = {width: size.width, height: size.height};

            this.element = Dom.create('div', {'style': 'width: '+ this.size.width +'px; height: '+ this.size.height +'px;'});
            this.container.appendChild(this.element);
        },
        pan: function(offset) {
            throw Error('Camera.pan is not implemented.');
        }
    });

    return Game;
})(Game || {});
