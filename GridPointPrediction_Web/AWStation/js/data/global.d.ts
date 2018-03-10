declare namespace L {
    var esri: any;
    function setOptions(target: any, options: { [x: string]: any }): void;
    var Renderer: { extend: (options: { [x: string]: any }) => any, prototype: any }
    function canvasRender(): iCanvasRender;
}
interface Window {
    obtNames: OBTNames
    map: L.Map
}
interface iCanvasRender extends L.Layer {
    West: number, East: number, South: number, North: number;
    options: any;
    _bounds: any;
    _minZoom: number;
    _translateX: number;
    _drawnLayers: any;
    _translateY: number;
    _container: HTMLCanvasElement;
    _ctx: CanvasRenderingContext2D;
    _map: L.Map;
    _setCanvasBounds: Function;
    clear(): void;
    setZindex(zIndex: number): void;
    setMinZoom(value: number): void;
    getPane(): HTMLElement;
    getContext2D(): CanvasRenderingContext2D;
    getContainer(): HTMLCanvasElement;
    drawLine(line: number[][], offsetX: number): void;
    setPosition(): void;
    hide(): void;
    show(): void;
    onMouseMove(stopCallback: (evt: L.MouseEvent) => void, moveCallback?: (evt: L.MouseEvent) => void): { remove: Function };
    new (): this;
}
