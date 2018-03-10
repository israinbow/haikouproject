import googleMap from "module/googleMap";
export default class {
    map: L.Map;
    gdCityborder: any;
    currentTileLayer: L.TileLayer;
    layersControl: L.Control.Layers;
    constructor(mapdiv: string, options: any) {
        options = options || {};
        var autoChangeBaseMap = true, baselayerchangeEnabled = true;
        var google_p = googleMap.getLayer("p"), google_m = googleMap.getLayer("m");
        var google_r = googleMap.getLayer("m_"), google_y = googleMap.getLayer("y");
        this.gdCityborder = L.esri.dynamicMapLayer({ opacity: 1, url: '', format: "png8", f: "image", useCors: false, sr: 102113 });
        let layers: { [x: string]: any } = { "地形": google_p, "卫星": google_y, "行政": google_m, "地图": google_r };
         this.currentTileLayer = google_r;
        this.map = L.map(mapdiv, { zoomControl: false, attributionControl: false, minZoom: 3, zoom: options.zoom || 10, layers: [this.currentTileLayer, this.gdCityborder], center: options.center || [27.3, 115.5] });
        window.map = this.map;
        this.layersControl = L.control.layers(layers).addTo(this.map);
        L.control.zoom({ position:'topright' }).addTo(this.map);
        this.map.on("zoomend ", (evt) => {
            var zoom = this.map.getZoom();
            if (autoChangeBaseMap) {
                if (zoom > 13) {
                    if (this.currentTileLayer == google_r) {
                        baselayerchangeEnabled = false;
                        this.map.removeLayer(this.currentTileLayer);
                        this.currentTileLayer = google_m;
                        this.map.addLayer(this.currentTileLayer);
                        baselayerchangeEnabled = true;
                    }
                } else if (this.currentTileLayer == google_m) {
                    baselayerchangeEnabled = false;
                    this.map.removeLayer(this.currentTileLayer);
                    this.currentTileLayer = google_r;
                    this.map.addLayer(this.currentTileLayer);
                    baselayerchangeEnabled = true;
                }
            }
        }, this);
        this.map.on("baselayerchange", function (evt: any) {
            if (baselayerchangeEnabled) autoChangeBaseMap = false;
            if (evt.name == "空白") autoChangeBaseMap = true;
        });
        return this;
    }
    setBaseLayer(name: string) {
        for (var i = 0, item: any; i < this.layersControl._layers.length; i++) {
            item = this.layersControl._layers[i];
            if (item.name == name) {
                this.map.removeLayer(this.currentTileLayer);
                this.currentTileLayer = item.layer;
                this.map.addLayer(this.currentTileLayer);
                break;
            }
        }
    }
}