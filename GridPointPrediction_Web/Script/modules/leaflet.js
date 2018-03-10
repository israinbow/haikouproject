//地图瓦片
//10.153.96.174/ArcGIS/rest/services/AsiaTiledForeMap1/MapServer
//http://10.153.96.174/ArcGIS/rest/services/ChinaMap/MapServer
define(["common/googleMap"], function (googleMap) {
    return{
        map: null,
        init: function (mapdiv, options) {
            options = options || {};
            var google_p = googleMap.getLayer("p");
            var google_m = googleMap.getLayer("m");
            var google_y = googleMap.getLayer("y");
            var cnargis = L.esri.dynamicMapLayer({ opacity: 1, url: '//10.153.96.174/ArcGIS/rest/services/ChinaMap/MapServer', format: "png8", f: "image", useCors: false, sr: 102113, layers: [0,1,2,3,4,5,6,7] });
           var defaultTileLayer;
            options.defaultTileLayer = options.defaultTileLayer || 0;
            if (options.defaultTileLayer === 0) defaultTileLayer = [cnargis];
            else if (options.defaultTileLayer === 1) defaultTileLayer = [google_m];
            else if (options.defaultTileLayer === 2) defaultTileLayer = [google_y];
            this.map = L.map(mapdiv, { zoomControl: false, attributionControl: false, layers: defaultTileLayer }).setView(options.center || [22.61667, 114.06667], options.zoom || 10);
            L.control.zoom({ position: "bottomleft" }).addTo(this.map);
            L.control.layers({ "Arcgis": cnargis, "地形": google_p, "卫星": google_y, "行政": google_m }).addTo(this.map);
            cnargis.addTo(this.map).bringToFront();
            return this;
        }
}});
//叠图基类
dojo.declare("imageOverlayBase", null, {
    imageLayer: null, extent: null, enabled: false,
    constructor: function (map,extent, opacity) {
        this.map = map;
        this.extent = extent;
        this.opacity = opacity || 1;
    },
    setOpacity: function (value) {
        this.opacity = value;
        if (this.imageLayer != null)
            this.imageLayer.setOpacity(value);
    },
    on: function (date) {
        this.enabled = true;
        var radarUrl = this.getUrl(date);
        if (this.imageLayer != null) this.imageLayer.setUrl(radarUrl);
        else this.imageLayer = L.imageOverlay(radarUrl, this.extent, { opacity: this.opacity }).addTo(this.map);
    },
    off: function () {
        this.enabled = false;
        if (this.imageLayer != null) {
            this.map.removeLayer(this.imageLayer);
            this.imageLayer = null;
        }
    },
    getUrl: function (date) { }
});