class Size2D {
    width: number;
    height: number;
}

class Position2D {
    x: number;
    y: number;
}

interface Camera {
    element: HTMLElement;
    size: Size2D;

    pan(offset:Position2D): void;
}
