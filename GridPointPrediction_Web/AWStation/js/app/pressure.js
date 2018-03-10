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
    var pressureApp = (function (_super) {
        __extends(pressureApp, _super);
        function pressureApp() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        pressureApp.prototype.pageOnLoad = function () {
            this.initMap();
            this.backDataPort = temperature_1.getDataProxy("PRE", this.map, "OTHER");
            this.backDataPort.creatFilter();
            temperature_1.pageProxy.setBackDataPort(this.backDataPort);
            this.canvasLayer = new temperature_1.CanvasLayer.HumidityCanvas(this.map);
            this.initCanvasLayerEvent();
            this.inintBackDataPortEvent();
            temperature_1.pageProxy.getLastData();
            this.pageOnEvent();
        };
        return pressureApp;
    }(temperature_1.temperatureApp));
    exports.pressureApp = pressureApp;
});
