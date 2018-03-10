define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = {
        _setMapUrl: function (style, option) {
            this._mapStype = style;
            option = option || {};
            if (style == "m")
                this._styleOption = "&lyrs=m";
            else {
                if (style == "p")
                    this._styleOption = "&lyrs=p&apistyle=";
                else if (style == "y")
                    this._styleOption = "&lyrs=y&apistyle=";
                else if (style == "m_")
                    this._styleOption = "&lyrs=m&apistyle=";
                if (option.road != true)
                    this._styleOption += "%2Cs.t%3A3%7Cp.v%3Aoff";
                if (option.transit != true)
                    this._styleOption += "%2Cs.t%3A4%7Cp.v%3Aoff";
            }
        },
        getLayer: function (style) {
            if (style == this._mapStype && this._layer)
                return this._layer;
            else {
                this._setMapUrl(style || "p");
                this._layer = L.tileLayer(null, {
                    subdomains: ["mt0", "mt1", "mt2", "mt3"],
                    minZoom: 0, maxZoom: 20
                });
                var _styleOption = this._styleOption;
                this._layer.getTileUrl = function (coords) {
                    var url = "http://" + this.options.subdomains[coords.z % 4] + ".google.cn/vt/hl=zh-CN&gl=cn&x=" + coords.x + "&y=" + coords.y + "&z=" + coords.z + _styleOption;
                    return url;
                };
            }
            return this._layer;
        }
    };
});
