var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
define(["require", "exports", "app/temperature"], function (require, exports, temperature_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var rainApp = (function (_super) {
        __extends(rainApp, _super);
        function rainApp() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        rainApp.prototype.pageOnLoad = function () {
            this.initMap();
            this.backDataPort = temperature_1.getDataProxy("RAIN", this.map, "OTHER");
            this.backDataPort.creatFilter();
            temperature_1.pageProxy.setBackDataPort(this.backDataPort);
            this.canvasLayer = new temperature_1.CanvasLayer.RainCanvas(this.map);
            this.initCanvasLayerEvent();
            this.inintBackDataPortEvent();
            temperature_1.pageProxy.getLastData();
            this.pageOnEvent();
            var button_play = document.getElementById("play_img");
            button_play.onclick = function () {
                if (temperature_1.pageProxy.playWidget.playing)
                    $("#tip_span").show();
                else
                    $("#tip_span").hide();
            };
        };
        return rainApp;
    }(temperature_1.temperatureApp));
    exports.rainApp = rainApp;
});
