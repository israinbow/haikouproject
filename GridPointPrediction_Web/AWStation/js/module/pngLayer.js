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
define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var satellite = (function () {
        function satellite() {
            this._basePath = "";
            this.intervalMinu = 30;
        }
        satellite.prototype.getBasePath = function (date) {
            var _date = new Date();
            _date.setDate(_date.getDate() - 7);
            if (date < _date)
                return this._basePath + "history/" + date.getFullYear() + "/" + date.format("yyyyMMdd") + "/";
            else
                return this._basePath;
        };
        satellite.prototype.getLastDateTime = function (callback) {
            $.getScript(this._basePath + "settle/time.js", function () {
                callback(new Date(rainEvalDate));
            });
        };
        satellite.prototype.getPngUrl = function (time, type) {
            if (type === void 0) { type = 1; }
            var dtime = new Date(time);
            dtime.setMinutes(dtime.getMinutes() - dtime.getMinutes() % 30, 0, 0);
            var path = this.getBasePath(dtime);
            if (type === 1)
                return path + "settle/NewTopTrans_Settle_Image" + dtime.format("yyyyMMddHHmm") + "00.png";
            else
                return path + "settle" + type + "/NewTopTrans_Settle_Image" + dtime.format("yyyyMMddHHmm00_") + type + ".png";
        };
        satellite.prototype.getLastPngList = function (callback) {
            var _this = this;
            this.getLastDateTime(function (date) {
                var res = _this.getSpecificPngList(date);
                callback(res);
            });
        };
        satellite.prototype.getSpecificPngList = function (date) {
            var res = [];
            var lastTime = date.getTime();
            for (var i = 9; i >= 0; i--)
                res.push(new Date(lastTime - i * this.intervalMinu * 60000));
            return res;
        };
        return satellite;
    }());
    satellite.instance = new satellite();
    exports.satellite = satellite;
    var radar = (function (_super) {
        __extends(radar, _super);
        function radar() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.intervalMinu = 6;
            return _this;
        }
        radar.prototype.getLastDateTime = function (callback) {
            $.getScript(this._basePath + "radar/time.js", function () {
                callback(new Date(radarTimestamp));
            });
        };
        radar.prototype.getPngUrl = function (time, after) {
            if (after === void 0) { after = 0; }
            var date = new Date(time);
            date.setMinutes(date.getMinutes() - date.getMinutes() % 6, 0, 0);
            var path = this.getBasePath(date);
            if (after > 0)
                return path + "radarFore/Meta_TREC_GD_2500_" + date.format("yyyyMMddHHmm") + "_" + after + "_7_m.png";
            else
                return path + "radar/top_cappi_" + date.format("yyyyMMddHHmm") + "00.png";
        };
        return radar;
    }(satellite));
    radar.instance = new radar();
    exports.radar = radar;
    var rain = (function (_super) {
        __extends(rain, _super);
        function rain() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.intervalMinu = 60;
            return _this;
        }
        rain.prototype.getLastDateTime = function (callback) {
            $.getScript(this._basePath + "awschina/time.js", function () {
                callback(new Date(rainTimestamp));
            });
        };
        rain.prototype.getPngUrl = function (time, hoursMode) {
            if (hoursMode === void 0) { hoursMode = 3; }
            var path = this.getBasePath(time);
            var date = new Date(time);
            return path + "/awschina/Meta_China_Rain" + (hoursMode < 10 ? ("0" + hoursMode) : hoursMode) + "H_Mercator_" + date.format("yyyyMMddHH") + "0000.png";
        };
        return rain;
    }(satellite));
    rain.instance = new rain();
    exports.rain = rain;
});
