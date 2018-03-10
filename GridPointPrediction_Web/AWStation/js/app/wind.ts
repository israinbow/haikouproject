import { getDataProxy } from "data/awsDataProxy";
import * as CanvasLayer from "module/awsCanvasLayer";
import { pageProxy } from "module/pageProxy";
import "data/obtNames";
import "util/common";

export { getDataProxy, CanvasLayer,  pageProxy };
export class windApp {
    protected canvasLayer: CanvasLayer.WindCanvas;
    protected backDataPort: DataProxy;
    protected map: L.Map;
    protected lastFocusObt: string;
    protected popMessage: L.Popup = L.popup({ autoPan: false, offset: [0, 2] });
    protected mapCenter = [19.919846, 110.373243];
    protected mapZoom = 10;
    protected GISMapEnable = true;
    private mapMoving = false;
    private lastOpenPopupPoint: [number, number];

    public constructor() {
        $(() => {
            this.pageOnLoad();         
        });
    }
    protected pageOnLoad() {
        this.initMap();
        this.backDataPort = getDataProxy("WIND", this.map, "OTHER");
        this.backDataPort.creatFilter();
    
        pageProxy.loadList = <any>pageProxy.loadList2;
        pageProxy.setBackDataPort(this.backDataPort);
        this.canvasLayer = new CanvasLayer.WindCanvas(this.map);
        this.initCanvasLayerEvent();
        this.inintBackDataPortEvent()
        pageProxy.getLastData();
        this.pageOnEvent();
    }
    protected initMap() {
        this.map = pageProxy.initMap({ center: this.mapCenter, zoom: this.mapZoom, GISMap: this.GISMapEnable });
        this.map.on("click", () => { if (this.lastFocusObt) pageProxy.getOBTHistory(this.lastFocusObt); });
        this.map.on("movestart", () => { this.mapMoving = true; this.map.closePopup(); });
        this.map.on("moveend", () => { this.mapMoving = false; });
        let url = "data/boundary_city/haikou.txt";
        $.getJSON(url, (boundary) => {
            L.polyline(boundary, { weight: 2, color: "#FF6600" }).addTo(pageProxy.leaflet.map);
        });
    }
    protected inintBackDataPortEvent() {
        this.backDataPort.onDataChange = (lastAwsData, lastAwsInfo, reason) => {
            this.canvasLayer.draw(lastAwsData, lastAwsInfo, reason);
        }
    }
    protected initCanvasLayerEvent() {
        let mapZoom = this.map.getZoom();
        this.canvasLayer.onUpdate(() => {
            let zoom = this.map.getZoom();
            this.backDataPort.getServiceData(zoom == mapZoom ? changeReason.mapMove : changeReason.mapZoom, this.backDataPort.lastdate);
            mapZoom = zoom;
        });
        this.canvasLayer.onDrawEnd((lastAwsData, lastAwsInfo, reason) => {
          pageProxy.onShowComplete(lastAwsData, lastAwsInfo, reason);
        });
        this.canvasLayer.onMouseMove((evt) => { this.handMouseStop(evt); }, (evt) => { this.handMouseMove(evt); });
    }
    protected handMouseStop(evt: L.MouseEvent) {
        if (this.mapMoving) return;
        for (let unit of this.backDataPort.lastAwsData) {
            for (let item of unit.items) {
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
    }
    protected handMouseMove(evt: L.MouseEvent) {
        if (this.lastOpenPopupPoint) {
            if (Math.sqrt(Math.pow(evt.containerPoint.x - this.lastOpenPopupPoint[0], 2) + Math.pow(evt.containerPoint.y - this.lastOpenPopupPoint[1], 2)) < 6)
                return;
        }
        window.document.body.style.cursor = "";
        this.lastFocusObt = null;
        this.lastOpenPopupPoint = null;
        if (this.popMessage.isOpen) this.map.closePopup(this.popMessage);
    }
    protected pageOnEvent() {
        pageProxy.on("changeAwsField", (catalog: string, timeMode: number, dataName: string, mapView?: number[]) => {
            this.backDataPort.setDataField(catalog, timeMode, dataName);
            if (mapView)
                this.map.setView([mapView[0], mapView[1]], mapView[2]);
        });
        pageProxy.on("updateTime", (ddtime: Date, reason: changeReason, callback: Function) => {
            if (reason != changeReason.getLastData)
                this.backDataPort.setDateTime(ddtime, reason, callback);
        });
        pageProxy.on("setStateOrArea", (awsType: string, checked: boolean) => {
            this.backDataPort.setAwsType(awsType, checked);
        });
    }
}

