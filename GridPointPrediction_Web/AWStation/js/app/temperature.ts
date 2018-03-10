import { pageProxy, getDataProxy, CanvasLayer,  windApp } from "app/wind";
export { pageProxy, getDataProxy, CanvasLayer  };

export class temperatureApp extends windApp {
    protected pageOnLoad() {
        this.initMap();
        this.backDataPort = getDataProxy("TEP", this.map, "OTHER");
        this.backDataPort.creatFilter();
        pageProxy.setBackDataPort(this.backDataPort);
        this.canvasLayer = new CanvasLayer.TempCanvas(this.map);
        this.initCanvasLayerEvent();
        this.inintBackDataPortEvent();
        pageProxy.getLastData();
        this.pageOnEvent();
    }
}