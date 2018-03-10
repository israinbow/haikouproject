import "util/canvasRender";
import { windbar } from "util/windbar";

export class WindCanvas {
    private mapZoom: number;
    private drawAble = true;
    protected canvasRender: iCanvasRender;
    private onMouseStopHandler: { remove: Function };
    constructor(public map: L.Map, minZoom = 6) {
        this.canvasRender = L.canvasRender().addTo(map);
        this.canvasRender.setMinZoom(minZoom);
        this.canvasRender.on("update", (evt: L.Event) => { this.drawAble = true; if (this.onUpdateHandler) this.onUpdateHandler(evt); });
        this.map.addEventListener("movestart", () => { this.drawAble = false; });
    }
    private onUpdateHandler: L.EventHandlerFn;
    public onUpdate(callback: L.EventHandlerFn) {
        this.onUpdateHandler = callback;
    }
    public onMouseMove(stopCallback: (evt: L.MouseEvent) => void, moveCallback?: (evt: L.MouseEvent) => void) {
        this.onMouseStopHandler = this.canvasRender.onMouseMove(stopCallback, moveCallback);
    }
    //作图
    public draw(data: { strokeStyle?: string, items: AWSDATE[] }[], dataInfo: AwsSimpleInfo, reason = changeReason.other) {
        if (this.drawAble) {
            let ctx = this.canvasRender.getContext2D();
            this.canvasRender.clear();
            for (var i = 0; i < data.length; i++) {
                ctx.strokeStyle = data[i].strokeStyle || "#000";
                this._onDrawPattern(ctx, data[i].items, dataInfo);
            }
            this.canvasRender.setPosition();
            if (this.onDrawEndHandler)
                this.onDrawEndHandler(data, dataInfo, reason);
        }
    }
    private onDrawEndHandler: (data: { strokeStyle?: string, items: AWSDATE[] }[], dataInfo: AwsSimpleInfo, reason: changeReason) => void;
    public onDrawEnd(callback: (data: { strokeStyle?: string, items: AWSDATE[] }[], dataInfo: AwsSimpleInfo, reason: changeReason) => void) {
        this.onDrawEndHandler = callback;
    }
    protected _onDrawPattern(ctx: CanvasRenderingContext2D, data: AWSDATE[], dataInfo: AwsSimpleInfo) {
        ctx.beginPath();
        ctx.font = "15px Arial";
        var mapzoom = this.map.getZoom(), obtname;
        var canvasPen = new windbar(ctx);
        let mapPanePosition = L.DomUtil.getPosition(this.map.getPane("mapPane"));
        for (var i = 0, d, x: number, y: number, center, len = data.length; i < len; i++) {
            d = data[i];
            if (d.DISPLAY) {
                x = d.x - mapPanePosition.x;
                y = d.y - mapPanePosition.y;
                let wdf = d.V0, wdd = d.V1;
                if (dataInfo["area"] == "LOCAL") {
                    canvasPen.draw(x, y, wdf, wdd, 1 + (mapzoom / 12 - 1));
                    if (mapzoom > 10) {
                        var xoffset = 0;
                        if (wdd > 45 && wdd < 135) {
                            ctx.textAlign = "right";
                            xoffset = -4;
                        } else
                            ctx.textAlign = "left";
                        ctx.fillText(Math.roundec(wdf, 1).toString(), x + xoffset, y);
                    }
                } else {
                    canvasPen.draw(x, y, wdf, wdd, 1 + (mapzoom / 10 - 1));
                    if (mapzoom > 11) {
                        ctx.textAlign = "center";
                        obtname = window.obtNames[d.ID][3];
                        if (wdd > 270 || wdd < 90) ctx.fillText(obtname, x, y + 15);
                        else ctx.fillText(obtname, x, y - 5);
                    }
                }
            }
        }
        ctx.stroke();
    }
    public destroy() {
        if (this.onMouseStopHandler)
            this.onMouseStopHandler.remove();
        this.canvasRender.remove();
    }
}
//温度
export class TempCanvas extends WindCanvas {
    name = "TEP";
    _setFontStyle(value: number, ctx: CanvasRenderingContext2D) { ctx.fillStyle = "#41353E"; }
    _onDrawPattern(ctx: CanvasRenderingContext2D, data: AWSDATE[], dataInfo: AwsSimpleInfo) {
        var mapzoom = this.map.getZoom();
        ctx.textAlign = "center";
        let mapPanePosition = L.DomUtil.getPosition(this.map.getPane("mapPane"));
        for (var i = 0, d, x: number, y: number, obtName: string, len = data.length; i < len; i++) {
            d = data[i];
            if (d.DISPLAY) {
                x = d.x - mapPanePosition.x;
                y = d.y - mapPanePosition.y;
                this._setFontStyle(d.V0, ctx);
                ctx.fillText(d.V0.toString(), x, y - 1);
                if (mapzoom > 11) {
                    ctx.font = "13px Arial";
                    obtName = window.obtNames[d.ID][3];
                    ctx.fillText(obtName, x, y + 20);
                }
            }
        }
    }
}
//雨量
export class RainCanvas extends TempCanvas {
    name = "RAIN";
    _setFontStyle(value: number, ctx: CanvasRenderingContext2D) {
        if (value === 0) {
            ctx.fillStyle = "#A5B1C0";
            ctx.font = "10px Arial";
        } else {
            if (value >= 10) {
                ctx.fillStyle = "#000";
                ctx.font = "normal normal bold 15px Arial";
            } else {
                ctx.fillStyle = "#41353E";
                ctx.font = "normal normal normal 14px Arial";
            }
        }
    }
}
//湿度
export class HumidityCanvas extends TempCanvas {
    name = "HUM";
}
//气压
export class PressureCanvas extends TempCanvas {
    name = "PRE";
}
//能见度
export class VisibilityCanvas extends TempCanvas {
    name = "VIS";
}
//声明
declare global {
    class AWSLayer extends WindCanvas { }
    interface AWSDATE {
        LN: number
        LA: number
        TM: Date
        ID: string
        V0: number
        V1: number
        x: number
        y: number
        [x: string]: any
    }
    interface AwsSimpleInfo {
        ddtime: Date, title: string, area: string, city?: string, minValue: number, maxValue: number
    }
    const enum changeReason {
        other = 0, playing, slider, mapMove, mapZoom, getLastData
    }
}