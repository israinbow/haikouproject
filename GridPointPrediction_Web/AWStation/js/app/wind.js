define(["require", "exports", "data/awsDataProxy", "module/awsCanvasLayer", "module/pageProxy", "data/obtNames", "util/common"], function (require, exports, awsDataProxy_1, CanvasLayer, pageProxy_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.getDataProxy = awsDataProxy_1.getDataProxy;
    exports.CanvasLayer = CanvasLayer;
    exports.pageProxy = pageProxy_1.pageProxy;
    var windApp = (function () {
        function windApp() {
            var _this = this;
            this.popMessage = L.popup({ autoPan: false, offset: [0, 2] });
            this.mapCenter = [19.519846, 110.373243];
            this.mapZoom = 8;
            this.GISMapEnable = true;
            this.mapMoving = false;
            $(function () {
                _this.pageOnLoad();
            });
        }
        windApp.prototype.pageOnLoad = function () {
            this.initMap();
            this.backDataPort = awsDataProxy_1.getDataProxy("WIND", this.map, "OTHER");
            this.backDataPort.creatFilter();
            pageProxy_1.pageProxy.loadList = pageProxy_1.pageProxy.loadList2;
            pageProxy_1.pageProxy.setBackDataPort(this.backDataPort);
            this.canvasLayer = new CanvasLayer.WindCanvas(this.map);
            this.initCanvasLayerEvent();
            this.inintBackDataPortEvent();
            pageProxy_1.pageProxy.getLastData();
            this.pageOnEvent();
        };
        windApp.prototype.initMap = function () {
            var _this = this;
            this.map = pageProxy_1.pageProxy.initMap({ center: this.mapCenter, zoom: this.mapZoom, GISMap: this.GISMapEnable });
            this.map.on("click", function () { if (_this.lastFocusObt)
                pageProxy_1.pageProxy.getOBTHistory(_this.lastFocusObt); });
            this.map.on("movestart", function () { _this.mapMoving = true; _this.map.closePopup(); });
            this.map.on("moveend", function () { _this.mapMoving = false; });
        };
        windApp.prototype.inintBackDataPortEvent = function () {
            var _this = this;
            this.backDataPort.onDataChange = function (lastAwsData, lastAwsInfo, reason) {
                _this.canvasLayer.draw(lastAwsData, lastAwsInfo, reason);
            };
        };
        windApp.prototype.initCanvasLayerEvent = function () {
            var _this = this;
            var mapZoom = this.map.getZoom();
            this.canvasLayer.onUpdate(function () {
                var zoom = _this.map.getZoom();
                _this.backDataPort.getServiceData(zoom == mapZoom ? 3 : 4, _this.backDataPort.lastdate);
                mapZoom = zoom;
            });
            this.canvasLayer.onDrawEnd(function (lastAwsData, lastAwsInfo, reason) {
                pageProxy_1.pageProxy.onShowComplete(lastAwsData, lastAwsInfo, reason);
            });
            this.canvasLayer.onMouseMove(function (evt) { _this.handMouseStop(evt); }, function (evt) { _this.handMouseMove(evt); });
        };
        windApp.prototype.handMouseStop = function (evt) {
            if (this.mapMoving)
                return;
            for (var _i = 0, _a = this.backDataPort.lastAwsData; _i < _a.length; _i++) {
                var unit = _a[_i];
                for (var _b = 0, _c = unit.items; _b < _c.length; _b++) {
                    var item = _c[_b];
                    if (Math.abs(item.x - evt.containerPoint.x) < 10 && Math.abs(item.y - evt.containerPoint.y) < 10 && item.V0 >= this.backDataPort.minValue) {
                        this.lastFocusObt = item.ID;
                        var _obt = window.obtNames[this.lastFocusObt];
                        this.lastOpenPopupPoint = [evt.containerPoint.x, evt.containerPoint.y];
                        window.document.body.style.cursor = "pointer";
                        this.popMessage.setContent("<h4>" + item.TM.format("yyyy/MM/dd HH:mm") + "</h4>编号：" + this.lastFocusObt + "<br/>" + _obt[3] + "<br/>东经：" + _obt[1] + "，北纬：" + _obt[0]).setLatLng([_obt[0], _obt[1]]);
                        this.map.openPopup(this.popMessage);
                        break;
                    }
                }
            }
        };
        windApp.prototype.handMouseMove = function (evt) {
            if (this.lastOpenPopupPoint) {
                if (Math.sqrt(Math.pow(evt.containerPoint.x - this.lastOpenPopupPoint[0], 2) + Math.pow(evt.containerPoint.y - this.lastOpenPopupPoint[1], 2)) < 6)
                    return;
            }
            window.document.body.style.cursor = "";
            this.lastFocusObt = null;
            this.lastOpenPopupPoint = null;
            if (this.popMessage.isOpen)
                this.map.closePopup(this.popMessage);
        };
        windApp.prototype.pageOnEvent = function () {
            var _this = this;
            pageProxy_1.pageProxy.on("changeAwsField", function (catalog, timeMode, dataName, mapView) {
                _this.backDataPort.setDataField(catalog, timeMode, dataName);
                if (mapView)
                    _this.map.setView([mapView[0], mapView[1]], mapView[2]);
            });
            pageProxy_1.pageProxy.on("updateTime", function (ddtime, reason, callback) {
                if (reason != 5)
                    _this.backDataPort.setDateTime(ddtime, reason, callback);
            });
            pageProxy_1.pageProxy.on("setStateOrArea", function (awsType, checked) {
                _this.backDataPort.setAwsType(awsType, checked);
            });
        };
        return windApp;
    }());
    exports.windApp = windApp;
});
