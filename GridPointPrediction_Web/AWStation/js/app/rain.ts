import { pageProxy, getDataProxy, CanvasLayer,  temperatureApp } from "app/temperature";

export class rainApp extends temperatureApp {
    protected pageOnLoad() {
        this.initMap();
        this.backDataPort = getDataProxy("RAIN", this.map, "OTHER");       
        this.backDataPort.creatFilter();
        pageProxy.setBackDataPort(this.backDataPort);
        this.canvasLayer = new CanvasLayer.RainCanvas(this.map);
        this.initCanvasLayerEvent();
        this.inintBackDataPortEvent();
        pageProxy.getLastData();
        this.pageOnEvent();
        var button_play = <HTMLImageElement>document.getElementById("play_img");
        button_play.onclick = function (this: HTMLImageElement) {
            if (pageProxy.playWidget.playing) $("#tip_span").show();
            else $("#tip_span").hide();
        }
    }
}