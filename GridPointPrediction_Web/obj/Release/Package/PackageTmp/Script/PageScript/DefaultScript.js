/// <reference path="../jquery-1.11.3/jquery.min.js" />

$(function () {
   
    //var map = L.map('mapid').setView([22.541, 114.003], 10);
    //L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
    //}).addTo(map);

    var map = L.map("mapid", { center: [20, 114], zoom: 6 });
    L.tileLayer("http://{s}.google.cn/vt/hl=zh-CN&lyrs=p&apistyle=%2Cs.t%3A3%7Cp.v%3Aoff%2Cs.t%3A4%7Cp.v%3Aoff&gl=cn&x={x}&y={y}&z={z}", {
        subdomains: ["mt0", "mt1", "mt2", "mt3"]
    }).addTo(map);
    var gdCityborder = L.esri.dynamicMapLayer({ opacity: 0.5, url: '//10.153.96.174/ArcGIS/rest/services/LFSSZArea/MapServer', format: "png8", f: "image", useCors: false, sr: 102113, layers: [0] });
    gdCityborder.addTo(map);



    //画矩形
    Draw_Grid();
    
    var lonStart = 22.3;
    var latStart = 113.7;

    var lonEnd = 22.85;
    var latEnd = 114.65;
    function Draw_Grid() {

        var bounds = [[22.3000, 113.7000], [22.8500, 114.6500]];
        // create an orange rectangle  #ff7800
        L.rectangle(bounds, { color: "#BDBDBD", weight: 1, fill: false }).addTo(map);
        // zoom the map to the rectangle bounds
        map.fitBounds(bounds);
        //横向11个格子，纵向19个格子，每个格子5公里
        // for (var i =1; i <= 11; i++) {
        //     var polygon = L.polygon([
        //[lonStart, latStart + i * 0.05],
        //[lonEnd, latEnd + i * 0.05]
        //     ]).addTo(map);
        // }
       
    }
    //横向11个格子，纵向19个格子，每个格子5公里
    for (var i =1; i < 11; i++) {
        var polygon = L.polygon([
         [lonStart + i*0.05, latStart],
         [lonStart + i * 0.05, latEnd]
        ], { color: "#BDBDBD", weight:1 }).addTo(map);
    }

    for (var i = 1; i < 19; i++) {
        var polygon = L.polygon([
         [lonStart, latStart + i * 0.05],
         [lonEnd, latStart + i * 0.05]
        ], { color: "#BDBDBD", weight: 1 }).addTo(map);
    }

    var geojsonFeature = {
        "type": "Feature",
        "properties": {
            "name": "Coors Field",
            "amenity": "Baseball Stadium",
            "popupContent": "This is where the Rockies play!"
        },
        "geometry": {
            "type": "Point",
            "coordinates": [-104.99404, 39.75621]
        }
    };

    L.geoJSON(geojsonFeature).addTo(map);
})

