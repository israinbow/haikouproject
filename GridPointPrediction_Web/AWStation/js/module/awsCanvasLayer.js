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
define(["require", "exports", "util/windbar", "util/canvasRender"], function (require, exports, windbar_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var WindCanvas = (function () {
        function WindCanvas(map, minZoom) {
            if (minZoom === void 0) { minZoom = 6; }
            var _this = this;
            this.map = map;
            this.drawAble = true;
            this.canvasRender = L.canvasRender().addTo(map);
            this.canvasRender.setMinZoom(minZoom);
            this.canvasRender.on("update", function (evt) { _this.drawAble = true; if (_this.onUpdateHandler)
                _this.onUpdateHandler(evt); });
            this.map.addEventListener("movestart", function () { _this.drawAble = false; });
        }
        WindCanvas.prototype.onUpdate = function (callback) {
            this.onUpdateHandler = callback;
        };
        WindCanvas.prototype.onMouseMove = function (stopCallback, moveCallback) {
            this.onMouseStopHandler = this.canvasRender.onMouseMove(stopCallback, moveCallback);
        };
        WindCanvas.prototype.draw = function (data, dataInfo, reason) {
            if (reason === void 0) { reason = 0; }
            if (this.drawAble) {
                var ctx = this.canvasRender.getContext2D();
                this.canvasRender.clear();
                for (var i = 0; i < data.length; i++) {
                    ctx.strokeStyle = data[i].strokeStyle || "#000";
                    this._onDrawPattern(ctx, data[i].items, dataInfo);
                }
                this.canvasRender.setPosition();
                if (this.onDrawEndHandler)
                    this.onDrawEndHandler(data, dataInfo, reason);
            }
        };
        WindCanvas.prototype.onDrawEnd = function (callback) {
            this.onDrawEndHandler = callback;
        };
        WindCanvas.prototype._onDrawPattern = function (ctx, data, dataInfo) {
            ctx.beginPath();
            ctx.font = "15px Arial";
            var mapzoom = this.map.getZoom(), obtname;
            var canvasPen = new windbar_1.windbar(ctx);
            var mapPanePosition = L.DomUtil.getPosition(this.map.getPane("mapPane"));
            for (var i = 0, d, x, y, center, len = data.length; i < len; i++) {
                d = data[i];
                if (d.DISPLAY) {
                    x = d.x - mapPanePosition.x;
                    y = d.y - mapPanePosition.y;
                    var wdf = d.V0, wdd = d.V1;
                    if (dataInfo["area"] == "LOCAL") {
                        canvasPen.draw(x, y, wdf, wdd, 1 + (mapzoom / 12 - 1));
                        if (mapzoom > 10) {
                            var xoffset = 0;
                            if (wdd > 45 && wdd < 135) {
                                ctx.textAlign = "right";
                                xoffset = -4;
                            }
                            else
                                ctx.textAlign = "left";
                            ctx.fillText(Math.roundec(wdf, 1).toString(), x + xoffset, y);
                        }
                    }
                    else {
                        canvasPen.draw(x, y, wdf, wdd, 1 + (mapzoom / 10 - 1));
                        if (mapzoom > 11) {
                            ctx.textAlign = "center";
                            obtname = window.obtNames[d.ID][3];
                            if (wdd > 270 || wdd < 90)
                                ctx.fillText(obtname, x, y + 15);
                            else
                                ctx.fillText(obtname, x, y - 5);
                        }
                    }
                }
            }
            ctx.stroke();
        };
        WindCanvas.prototype.destroy = function () {
            if (this.onMouseStopHandler)
                this.onMouseStopHandler.remove();
            this.canvasRender.remove();
        };
        return WindCanvas;
    }());
    exports.WindCanvas = WindCanvas;
    var TempCanvas = (function (_super) {
        __extends(TempCanvas, _super);
        function TempCanvas() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.name = "TEP";
            return _this;
        }
        TempCanvas.prototype._setFontStyle = function (value, ctx) { ctx.fillStyle = "#41353E"; };
        TempCanvas.prototype._onDrawPattern = function (ctx, data, dataInfo) {
            var mapzoom = this.map.getZoom();
            ctx.textAlign = "center";
            var mapPanePosition = L.DomUtil.getPosition(this.map.getPane("mapPane"));
            for (var i = 0, d, x, y, obtName, len = data.length; i < len; i++) {
                d = data[i];
                if (d.DISPLAY) {
                    x = d.x - mapPanePosition.x;
                    y = d.y - mapPanePosition.y;
                    this._setFontStyle(d.V0, ctx);
                    ctx.fillText(d.V0.toString(), x, y - 1);
                    if (mapzoom > 11) {
                        ctx.font = "13px Arial";
                        obtName = window.obtNames[d.ID][3];
                        ctx.fillText(obtName, x, y + 20);
                    }
                }
            }
        };
        return TempCanvas;
    }(WindCanvas));
    exports.TempCanvas = TempCanvas;
    var RainCanvas = (function (_super) {
        __extends(RainCanvas, _super);
        function RainCanvas() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.name = "RAIN";
            return _this;
        }
        RainCanvas.prototype._setFontStyle = function (value, ctx) {
            if (value === 0) {
                ctx.fillStyle = "#A5B1C0";
                ctx.font = "10px Arial";
            }
            else {
                if (value >= 10) {
                    ctx.fillStyle = "#000";
                    ctx.font = "normal normal bold 15px Arial";
                }
                else {
                    ctx.fillStyle = "#41353E";
                    ctx.font = "normal normal normal 14px Arial";
                }
            }
        };
        return RainCanvas;
    }(TempCanvas));
    exports.RainCanvas = RainCanvas;
    var HumidityCanvas = (function (_super) {
        __extends(HumidityCanvas, _super);
        function HumidityCanvas() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.name = "HUM";
            return _this;
        }
        return HumidityCanvas;
    }(TempCanvas));
    exports.HumidityCanvas = HumidityCanvas;
    var PressureCanvas = (function (_super) {
        __extends(PressureCanvas, _super);
        function PressureCanvas() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.name = "PRE";
            return _this;
        }
        return PressureCanvas;
    }(TempCanvas));
    exports.PressureCanvas = PressureCanvas;
    var VisibilityCanvas = (function (_super) {
        __extends(VisibilityCanvas, _super);
        function VisibilityCanvas() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.name = "VIS";
            return _this;
        }
        return VisibilityCanvas;
    }(TempCanvas));
    exports.VisibilityCanvas = VisibilityCanvas;
});
