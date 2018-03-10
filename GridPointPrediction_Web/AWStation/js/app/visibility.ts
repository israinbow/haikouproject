import { pageProxy, getDataProxy, CanvasLayer, temperatureApp } from "app/temperature";

export class visiblilityApp extends temperatureApp {
    protected mapCenter = [19.919846, 110.373243];
    protected mapZoom = 10;
    protected pageOnLoad() {
        this.initMap();
        this.backDataPort = getDataProxy("VIS", this.map, "OTHER");
        pageProxy.setBackDataPort(this.backDataPort);
        this.canvasLayer = new CanvasLayer.HumidityCanvas(this.map);
        this.initCanvasLayerEvent();
        this.inintBackDataPortEvent();        
        pageProxy.changeArea("LOCAL", true); 
        pageProxy.getLastData();
        this.pageOnEvent();
    }
}

