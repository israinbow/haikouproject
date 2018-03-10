define(["require", "exports", "module/googleMap"], function (require, exports, googleMap_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var default_1 = (function () {
        function default_1(mapdiv, options) {
            var _this = this;
            options = options || {};
            var autoChangeBaseMap = true, baselayerchangeEnabled = true;
            var google_p = googleMap_1.default.getLayer("p"), google_m = googleMap_1.default.getLayer("m");
            var google_r = googleMap_1.default.getLayer("m_"), google_y = googleMap_1.default.getLayer("y");
            this.gdCityborder = L.esri.dynamicMapLayer({ opacity: 1, url: '', format: "png8", f: "image", useCors: false, sr: 102113 });
            var layers = { "地形": google_p, "卫星": google_y, "行政": google_m, "地图": google_r };
            if (options.GISMap)
                layers.GIS = L.esri.dynamicMapLayer({ url: '//10.153.96.174/ArcGIS/rest/services/GDSZAWSMapBack/MapServer', format: "png8", f: "image", useCors: false, sr: 102113 });
            this.currentTileLayer = google_r;
            this.map = L.map(mapdiv, { zoomControl: false, attributionControl: false, minZoom: 3, zoom: options.zoom || 10, layers: [this.currentTileLayer, this.gdCityborder], center: options.center || [27.3, 115.5] });
            window.map = this.map;
            this.layersControl = L.control.layers(layers).addTo(this.map);
            L.control.zoom({ position: 'topright' }).addTo(this.map);
            this.map.on("zoomend ", function (evt) {
                var zoom = _this.map.getZoom();
                if (autoChangeBaseMap) {
                    if (zoom > 13) {
                        if (_this.currentTileLayer == google_r) {
                            baselayerchangeEnabled = false;
                            _this.map.removeLayer(_this.currentTileLayer);
                            _this.currentTileLayer = google_m;
                            _this.map.addLayer(_this.currentTileLayer);
                            baselayerchangeEnabled = true;
                        }
                    }
                    else if (_this.currentTileLayer == google_m) {
                        baselayerchangeEnabled = false;
                        _this.map.removeLayer(_this.currentTileLayer);
                        _this.currentTileLayer = google_r;
                        _this.map.addLayer(_this.currentTileLayer);
                        baselayerchangeEnabled = true;
                    }
                }
            }, this);
            this.map.on("baselayerchange", function (evt) {
                if (baselayerchangeEnabled)
                    autoChangeBaseMap = false;
                if (evt.name == "GIS")
                    evt.layer.bringToBack();
                else if (evt.name == "空白")
                    autoChangeBaseMap = true;
            });
            return this;
        }
        default_1.prototype.setBaseLayer = function (name) {
            for (var i = 0, item; i < this.layersControl._layers.length; i++) {
                item = this.layersControl._layers[i];
                if (item.name == name) {
                    this.map.removeLayer(this.currentTileLayer);
                    this.currentTileLayer = item.layer;
                    this.map.addLayer(this.currentTileLayer);
                    break;
                }
            }
        };
        return default_1;
    }());
    exports.default = default_1;
});
