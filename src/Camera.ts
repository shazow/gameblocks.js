interface Camera {
    element: HTMLElement;
    size: Size2D;

    pan(offset:Position2D): void;
}
