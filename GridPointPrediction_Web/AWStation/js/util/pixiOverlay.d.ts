export class PixiOverlay {
    addTo(map: L.Map | L.LayerGroup): this;
    getWorldPoint(latlng: [number, number]): number[];
    getProjectPoint(latlng: [number, number], mapZoom?: number): number[];
    render(): void;
    add(pixiObj: PIXI.DisplayObject): void;
    destroy(): void;
    clear(): void;
    scaleMarker(zoomOffset: number): void;
    addMarker(pixiObj: PIXI.DisplayObject, center: [number, number] | number[]): void;
}