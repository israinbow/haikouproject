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
    var visiblilityApp = (function (_super) {
        __extends(visiblilityApp, _super);
        function visiblilityApp() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.mapCenter = [22.50, 114.1];
            _this.mapZoom = 10;
            return _this;
        }
        visiblilityApp.prototype.pageOnLoad = function () {
            this.initMap();
            this.backDataPort = temperature_1.getDataProxy("VIS", this.map, "OTHER");
            temperature_1.pageProxy.setBackDataPort(this.backDataPort);
            this.canvasLayer = new temperature_1.CanvasLayer.HumidityCanvas(this.map);
            this.initCanvasLayerEvent();
            this.inintBackDataPortEvent();
            temperature_1.pageProxy.changeArea("LOCAL", true);
            temperature_1.pageProxy.getLastData();
            this.pageOnEvent();
        };
        return visiblilityApp;
    }(temperature_1.temperatureApp));
    exports.visiblilityApp = visiblilityApp;
});
