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
define(["require", "exports", "app/wind"], function (require, exports, wind_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.pageProxy = wind_1.pageProxy;
    exports.getDataProxy = wind_1.getDataProxy;
    exports.CanvasLayer = wind_1.CanvasLayer;
    var temperatureApp = (function (_super) {
        __extends(temperatureApp, _super);
        function temperatureApp() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        temperatureApp.prototype.pageOnLoad = function () {
            this.initMap();
            this.backDataPort = wind_1.getDataProxy("TEP", this.map, "OTHER");
            this.backDataPort.creatFilter();
            wind_1.pageProxy.setBackDataPort(this.backDataPort);
            this.canvasLayer = new wind_1.CanvasLayer.TempCanvas(this.map);
            this.initCanvasLayerEvent();
            this.inintBackDataPortEvent();
            wind_1.pageProxy.getLastData();
            this.pageOnEvent();
        };
        return temperatureApp;
    }(wind_1.windApp));
    exports.temperatureApp = temperatureApp;
});
