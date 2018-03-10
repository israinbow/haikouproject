//load map
define(function () {
    //var locationInfo = [22.618579, 114.175362];  //中心点
    var locationInfo = [20.045751, 110.321662];
    return function(divId,zoomsize,zindex) {
        //var GoogleLayer1 = L.tileLayer('http://{s}.google.cn/vt/lyrs=m&hl=zh-CN&gl=cn&x={x}&y={y}&z={z}&apistyle=s.t%3A18%7Cs.e%3Ag.s%7Cp.c%3Affffff%2Cs.t%3A0%7Cp.v%3Aoff%2Cs.t%3A5%7Cp.v%3Aon%2Cs.t%3A18%7Cp.v%3Aon%2Cs.t%3A0%7Cs.e%3Ag.f%7Cp.c%3Affffffff%2Cs.t%3A6%7Cs.e%3Ag.f%7Cp.c%3AffB2D1FF%7Cp.v%3Aon', {
        //    subdomains: ["mt0", "mt1", "mt2", "mt3"]
        //});
        var GoogleLayer1 = L.tileLayer('http://{s}.google.cn/vt/lyrs=p&hl=zh-CN&gl=cn&x={x}&y={y}&z={z}&apistyle=s.t:1%7Cp.v:off,s.t:3%7Cp.v:off,s.t:4%7Cp.v:off,s.t:6%7Cs.e:l%7Cp.v:off,s.t:40%7Cs.e:l%7Cp.v:off,s.t:18%7Cp.v:off,s.t:18%7Cs.e:g.s%7Cp.c:ff000000', {
            subdomains: ["mt0", "mt1", "mt2", "mt3"]
        });
        var GoogleLayer2 = L.tileLayer('http://{s}.google.cn/vt/lyrs=y&hl=zh-CN&gl=cn&x={x}&y={y}&z={z}&apistyle=s.t%3A3%7Cp.v%3Aoff', {
            subdomains: ["mt0", "mt1", "mt2", "mt3"]
        });
        var GoogleLayer3 = L.tileLayer('http://{s}.google.cn/vt/lyrs=m&hl=zh-CN&gl=cn&x={x}&y={y}&z={z}&apistyle=s.t%3A3%7Cp.v%3Aoff', {
            subdomains: ["mt0", "mt1", "mt2", "mt3"]
        });
        this.map = L.map(divId, {
            zoomControl: false,
            attributionControl: false,
            center: locationInfo,
          //  dragging:false,
            zoom: zoomsize,
            minZoom: 4,
            zoomSnap: 0.1,
            zoomDelta:0.1,
            layers: null//[GoogleLayer3]

        });
        var thisurl = "//10.155.95.203:6080/arcgis/rest/services/HaiKouMap/MapServer";
        if (divId.indexOf("makeMap") > -1) {
            thisurl = "//10.155.95.203:6080/arcgis/rest/services/HaiKouMap/MapServer";
        }
        //GIS背景地图
        this.BackMap = L.esri.dynamicMapLayer({ url: thisurl, format: "png8", f: "image", useCors: false, sr: 102113 });
        this.BackMap.on("load", function () { this._currentImage._image.style.zIndex = zindex; });
        this.BackMap.addTo(this.map);
        //BackMap.bringToFront();
        //dzzhMap=L.esri.dynamicMapLayer({ url: '//10.153.96.174/ArcGIS/rest/services/LFS_DZZH/MapServer', format: "png8", f: "image", useCors: false, sr: 102113 }).addTo(this.map);
        var baseLayers = {
            "地形图": GoogleLayer1,
            "卫星图": GoogleLayer2,
            "路线图": GoogleLayer3
        };
        this.map.off("dblclick");
        this.map.off("mousedown");
        this.map.off("mouseup");
        this.map.off("movestart");
        this.map.off("mousemove");
        this.map.off("drag");
        this.map.off("zoomend");
        if (divId == "warning_map") {
            GoogleLayer1.addTo(this.map);
        }
        this.map.on("zoomend", function () {
            //BackMap.addTo(map);
            //if (this.getZoom() > 8) {
            //    BackMap.addTo(map);
            //    map.removeLayer(GoogleLayer3);
            //}
            //if (this.getZoom() > 14) {
            //    map.removeLayer(BackMap);
            //    map.removeLayer(bianjie);
            //    GoogleLayer3.addTo(map);
            //}
            //else {
            //    bianjie.addTo(map);
            //}
            //if (this.getZoom() <= 8) {
            //    map.removeLayer(BackMap);              
            //    GoogleLayer3.addTo(map);
            //}
        })
        var zoomControl = L.control.zoom({
            position: 'topleft'
        });
        //map.addControl(zoomControl);
        //var ForeMap = L.esri.dynamicMapLayer({ url: '//10.153.96.174/ArcGIS/rest/services/LFS_MeticulousFore/MapServer', format: "png8", f: "image", useCors: false, sr: 102113 }).addTo(map).bringToFront();//GIS街道边界地图
        //var bianjie = L.esri.dynamicMapLayer({ url: '//10.153.96.174/ArcGIS/rest/services/LFS_MeticulousEdge/MapServer', format: "png8", f: "image", useCors: false, sr: 102113 }).addTo(map).bringToFront();//GIS深圳边界地图
  
    }
});