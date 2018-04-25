interface Renderer {
}

class CanvasRenderer implements Renderer {
    element: HTMLElement;
    layers: CanvasRenderingContext2D[];

    constructor(public camera:Camera, num_layers?:number) {
        let i = num_layers || 1;

        // TODO: Make layers a named dict?
        while(i--) {
            let layer = document.createElement("canvas");
            layer.style.position = 'absolute';
            layer.style.width = camera.size.width + 'px';
            layer.style.height = camera.size.height + 'px';
            this.layers.push(layer.getContext('2d'));
            camera.element.appendChild(layer);
        }
    }

    clear() {
        for(let layer of this.layers) {
            layer.clearRect(0, 0, this.camera.size.width, this.camera.size.height);
        }
    }
}

// TODO: Register entities with renderer?
// TODO: Add DomRenderer
