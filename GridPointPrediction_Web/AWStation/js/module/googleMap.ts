//谷歌地图，参数参考http://stackoverflow.com/questions/29692737/customizing-google-map-tile-server-url
export default {
    _setMapUrl: function (this:any, style: string, option?: any) {
        this._mapStype = style;
        option = option || {};
        if (style == "m") this._styleOption = "&lyrs=m";
        else {
            if (style == "p") this._styleOption = "&lyrs=p&apistyle=";
            else if (style == "y") this._styleOption = "&lyrs=y&apistyle=";
            else if (style == "m_") this._styleOption = "&lyrs=m&apistyle=";
            if (option.road != true) this._styleOption += "%2Cs.t%3A3%7Cp.v%3Aoff";
            if (option.transit != true) this._styleOption += "%2Cs.t%3A4%7Cp.v%3Aoff";
        }
    },
    getLayer: function (this: any, style: string): L.TileLayer {
        if (style == this._mapStype && this._layer)
            return this._layer;
        else {
            this._setMapUrl(style || "p");
            this._layer = L.tileLayer(null, {
                subdomains: ["mt0", "mt1", "mt2", "mt3"],
                minZoom: 0, maxZoom: 20
            });
            var _styleOption = this._styleOption;
            this._layer.getTileUrl = function (this:any, coords: any){
                var url = "http://" + this.options.subdomains[coords.z % 4] + ".google.cn/vt/hl=zh-CN&gl=cn&x=" + coords.x + "&y=" + coords.y + "&z=" + coords.z + _styleOption;
                return url;
            }
        }
        return this._layer;
    }
};