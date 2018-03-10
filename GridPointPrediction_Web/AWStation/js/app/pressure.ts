import { pageProxy, getDataProxy, CanvasLayer, temperatureApp } from "app/temperature";

export class pressureApp extends temperatureApp {
    protected pageOnLoad() {
        this.initMap();
        this.backDataPort = getDataProxy("PRE", this.map, "OTHER");
       this.backDataPort.creatFilter();
        pageProxy.setBackDataPort(this.backDataPort);
        this.canvasLayer = new CanvasLayer.HumidityCanvas(this.map);
        this.initCanvasLayerEvent();
        this.inintBackDataPortEvent();
        pageProxy.getLastData();
        this.pageOnEvent();
    }
}
