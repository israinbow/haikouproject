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
    var WindImage = (function () {
        function WindImage(map) {
            this.map = map;
            this._colorBasePath = "//10.117.6.227/JiangXiProducts/AWSCIMISS/";
            this.colorSpotEnable = true;
            this._colorspotNC = { extent: [[27.87, 116.94], [29.45, 115.13]], subPath: "Mate_SERVICE_AWS_NC" };
            this._colorspotJX = { extent: [[23.80, 119.96], [30.68, 112.09]], subPath: "Mate_SERVICE_AWS_JX" };
            this._colorCatalog = { WD2DF: ["_NEW2WIND_", ".png", 0], WD10DF: ["_NEW10WIND_", ".png", 0], WD10MAXDF: ["_NEWWD10MAXDF_", ".png", 0], WD3SMAXDF: ["_NEWWIND_", ".png", 0], WDIDF: ["_NEWWDIDF_", ".png", 0] };
        }
        WindImage.prototype._getColorPictType = function (dataField, timeMode) {
            var colorPictType = this._colorCatalog[dataField];
            if (colorPictType == null || (timeMode != undefined && colorPictType[2] != timeMode))
                return null;
            return colorPictType;
        };
        WindImage.prototype._colorspot = function (date, city, dataField, timeMode) {
            if (!date) {
                date = new Date();
                var minutes_1 = date.getMinutes() - 5;
                minutes_1 -= minutes_1 % 5;
                date.setMinutes(minutes_1, 0, 0);
            }
            var colorPictType = this._getColorPictType(dataField, timeMode);
            if (colorPictType == null) {
                this.clearColorspot();
                return;
            }
            var minutes = date.getMinutes();
            minutes -= minutes % 5;
            var csArea = city == "haikou" ? this._colorspotNC : this._colorspotJX;
            var imageUrl = this._colorBasePath + date.format("yyyyMMdd") + '/'
                + csArea.subPath + colorPictType[0] + date.format("yyyyMMddHH") + (minutes < 10 ? ('0' + minutes) : minutes) + "00" + colorPictType[1];
            if (this.colorSpotLayer && this._city != city)
                this.clearColorspot();
            this._city = city;
            if (this.colorSpotLayer) {
                this.colorSpotLayer._image.style.display = "";
                this.colorSpotLayer.setUrl(imageUrl);
            }
            else
                this.colorSpotLayer = L.imageOverlay(imageUrl, csArea.extent).addTo(this.map).bringToBack();
            this.colorSpotLayer._image.onerror = function (evt) { evt.target.style.display = "none"; };
        };
        WindImage.prototype.clearColorspot = function () {
            if (this.colorSpotLayer) {
                this.map.removeLayer(this.colorSpotLayer);
                this.colorSpotLayer = null;
            }
        };
        WindImage.prototype.showColorspot = function (date, city, dataField, timeMode) {
            if (this.colorSpotEnable)
                this._colorspot(date, city, dataField, timeMode);
            else
                this.clearColorspot();
        };
        WindImage.prototype.setColorspot = function (checked) {
            this.colorSpotEnable = checked;
            if (checked == false)
                this.clearColorspot();
        };
        return WindImage;
    }());
    exports.WindImage = WindImage;
    var TempLayer = (function (_super) {
        __extends(TempLayer, _super);
        function TempLayer() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this._colorBasePath = "//10.117.6.227/JiangXiProducts/AWSCIMISS/AWS_NEW/";
            _this._colorspotNC = { extent: [[27.87, 116.94], [29.45, 115.13]], subPath: "Mate_AWS_NC" };
            _this._colorspotJX = { extent: [[23.80, 119.96], [30.68, 112.09]], subPath: "Mate_AWS_JX" };
            _this._colorCatalog = { MAXT: ["_DayTemptureMax_", "_Temp.png", 2], MINT: ["_DayTemptureMin_", "_Temp.png", 2], T: ["_Tempture_", "_60M.png", 0] };
            return _this;
        }
        TempLayer.prototype._setFontStyle = function (value, ctx) { ctx.fillStyle = "#41353E"; };
        return TempLayer;
    }(WindImage));
    exports.TempLayer = TempLayer;
    var RainLayer = (function (_super) {
        __extends(RainLayer, _super);
        function RainLayer() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this._colorCatalog = {
                HOURR: ["_RAINFALL_", "_60M.png", 0], R06M: ["_RAINFALL_", "_6M.png", 0], R12M: ["_RAINFALL_", "_12M.png", 0], R30M: ["_RAINFALL_", "_30M.png", 0], R60M: ["_RAINFALL_", "_60M.png", 0],
                R01H: ["_RAINFALL_", "_60M.png", 0], R02H: ["_RAINFALL_", "_120M.png", 0], R03H: ["_RAINFALL_", "_180M.png", 0], R06H: ["_RAINFALL_", "_360M.png", 0], R12H: ["_RAINFALL_", "_720M.png", 0], R24H: ["_RAINFALL_", "_1440M.png", 0],
                R48H: ["_RAINFALL_", "_2880M.png", 0], R72H: ["_RAINFALL_", "_4320M.png", 0]
            };
            return _this;
        }
        RainLayer.prototype._getColorPictType = function (dataField) {
            var colorPictType = this._colorCatalog[dataField];
            if (colorPictType == null)
                return null;
            return colorPictType;
        };
        return RainLayer;
    }(TempLayer));
    exports.RainLayer = RainLayer;
});
