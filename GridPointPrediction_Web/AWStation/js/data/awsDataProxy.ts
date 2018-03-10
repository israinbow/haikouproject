//后端数据代理
import DataSlider from "util/dataSlider";
import d3 = require("library/d3.min");

class WindDataProxy {
    name = "WIND"; unit = "m/s"; dataArea: string; awsAdmin = "all"; accuracy = 1;
    dataField = "WD3SMAXDF"; dataTitle = "小时极大风"; orderByDescending = true; timeMode = 0;
    minValue = 0;
    maxValue = 61.0;
    awsDataFilter: DataSlider;
    countValue = true;
    dataClassify: number[];
    protected lastRequestTime: Date;
    dataArray: dataFieldAttr[] = [
        { name: "小时极大风", timeMode: 0, dbFields: ["WD3SMAXDF", "WD3SMAXDD"], key: "WD3SMAXDF" },
        { name: "瞬时风", timeMode: 0, dbFields: ["WDIDF", "WDIDD"], key: "WDIDF" },
        { name: "2M", timeMode: 0, dbFields: ["WD2DF", "WD2DD"], key: "WD2DF" },
        { name: "10M", timeMode: 0, dbFields: ["WD10DF", "WD10DD"], key: "WD10DF" },
        { name: "小时最大10M", timeMode: 1, dbFields: ["WD10MAXDF", "WD10MAXDD", "WD10MAXTIME"], key: "WD10MAXDF" },
        { name: "日最大10M", timeMode: 2, dbFields: ["WD10MAXDF", "WD10MAXDD", "WD10MAXTIME"], key: "WD10MAXDF" },
        { name: "日最大瞬时风", timeMode: 2, dbFields: ["WD3SMAXDF", "WD3SMAXDD", "WD3SMAXTIME"], key: "WD3SMAXDF" }
    ];
    lastAwsData: DrawDataUnit[] = [
        { strokeStyle: "#41353E", items: [], minValue: 0 },
        { strokeStyle: "#FF0000", items: [], minValue: 6 },
        { strokeStyle: "#FF9900", items: [], minValue: 10 },
        { strokeStyle: "#FF00FF", items: [], minValue: 12 }
    ];
    lastOrder: { ID: string, V0: number, V1: number }[] = [];
    protected dataCitys: string[] = []; city: string; lastdate: Date = null;
    lastAwsInfo: AwsSimpleInfo;
    constructor(public map: L.Map, defaultArea: string) {
        this.dataArea = defaultArea;
    }
    onDataChange(lastAwsData: DrawDataUnit[], lastAwsInfo: AwsSimpleInfo, changeReason: changeReason) { }
    onAreaChange(time: any, area: string, catalog: string, timeMode: number) { }
    windScale = [0, 0.3, 1.6, 3.4, 5.5, 8.0, 10.8, 13.9, 17.2, 20.8, 24.5, 28.5, 32.7, 37, 41.5, 46.2, 51, 56.1, 61.0];
    public getLevel(maxWind: number) {
        for (var i = 0; i < this.windScale.length; i++) {
            if (maxWind >= this.windScale[i]) continue;
            else return i - 1;
        }
        return 18;
    }
    public creatFilter() {
        let dataSliderContainer = <HTMLDivElement>document.getElementById("dataSliderContainer");
        if (dataSliderContainer) {
            this.awsDataFilter = new DataSlider([{ text: "风力0级", value: 0, width: 85, spanColor: "gray" }, { text: "1", value: 0.3, spanColor: "gray" }, { text: "2", value: 1.6, spanColor: "gray" }, { text: "3", value: 3.4, spanColor: "gray" }, { text: "4", value: 5.5, spanColor: "gray" }, { text: "5", value: 8.0, spanColor: "gray" }, { text: "6", value: 10.8, spanColor: "#FF0000" }, { text: "7", value: 13.9, spanColor: "#FF0000" }
                , { text: "8", value: 17.2, spanColor: "#FF0000" }, { text: "9", value: 20.8, spanColor: "#FF0000" }, { text: "10", value: 24.5, spanColor: "#FF9900" }, { text: "11", value: 28.5, spanColor: "#FF9900" }, { text: "12", value: 32.7, spanColor: "#FF00FF" }, { text: "13", value: 37, spanColor: "#FF00FF" }
                , { text: "14", value: 41.5, spanColor: "#FF00FF" }, { text: "15", value: 46.2, spanColor: "#FF00FF" }, { text: "16", value: 51, spanColor: "#FF00FF" }, { text: "17", value: 56.1, spanColor: "#FF00FF" }, { text: ">17", value: 61.0, spanColor: "#FF00FF" }
            ], dataSliderContainer, {
                    min: this.minValue, max: this.maxValue, defaultValue: this.minValue, step: 0.1, formatter: (value: number) => { return value + this.unit; }
                });
            this.setAwsDataFilterOnchange();
        }
    }
    protected setAwsDataFilterOnchange() {
        this.dataClassify = Enumerable.From(this.awsDataFilter.items).Select(function (item) { return item.value; }).ToArray();
        this.awsDataFilter.onChange = (minValue, maxValue) => {
            this.minValue = minValue;
            this.maxValue = maxValue;
            for (let drawCatalog of this.lastAwsData) {
                for (let item of drawCatalog.items)
                    item.DISPLAY = (item.V0 < this.minValue || item.V0 > this.maxValue) ? false : true;
            }
            this.onDataChange(this.lastAwsData, this.lastAwsInfo, changeReason.slider);
        }
    }
    public changeOrderBy(descending: boolean) {
        this.orderByDescending = descending;
        this.getServiceData(changeReason.other, this.lastdate);
    }
    public getServiceData(reason: changeReason, ddatetime: Date, callback?: Function) {
        let bounds = this.map.getBounds(), size = this.map.getSize();
        let stats = this.countValue && reason != changeReason.playing && reason != changeReason.mapMove;
        let args = { orderbyDesc: this.orderByDescending, accuracy: this.accuracy, isPlaying: reason == changeReason.playing, type: this.name, date: ddatetime, awsAdmin: this.awsAdmin, area: this.dataArea, timeMode: this.timeMode, dataField: this.dataField, citys: this.dataCitys, minLng: bounds.getWest(), minLat: bounds.getSouth(), maxLng: bounds.getEast(), maxLat: bounds.getNorth(), canvasWidth: size.x, canvasHeight: size.y, minSpace: 8 };
        this.lastRequestTime = ddatetime;
        window.common.webService("GetAWSDataInfomation", args, (dreturn: { aws: AWSDATE[], stats: any, time: Date }) => {
            let obtname, windf: number, windLevel: number;
            for (let i = 0; i < this.lastAwsData.length; i++)
                this.lastAwsData[i].items.length = 0;
            let lastTime = dreturn.time.toString().toDate();
            for (var obt of dreturn.aws) {
                obtname = window.obtNames[obt.ID];
                if (obtname) {
                    obt.LN = obtname[1];
                    obt.LA = obtname[0];
                    obt.DISPLAY = (obt.V0 < this.minValue || obt.V0 > this.maxValue) ? false : true;
                    let index = 0;
                    if (obt.V0 < 10.8) index = 0;
                    else if (obt.V0 < 24.5) index = 1;
                    else if (obt.V0 < 32.7) index = 2;
                    else index = 3;
                    this.lastAwsData[index].items.push(obt);
                    if (!obt.TM) obt.TM = lastTime;
                    else obt.TM = obt.TM.toString().toDate();
                }
                else
                    console.log(obt.ID + " not in dictionary");
            }
            this.lastAwsInfo = { ddtime: lastTime, title: this.dataTitle, area: this.dataArea, city: this.city, minValue: dreturn.stats ? dreturn.stats.maxValue : 0, maxValue: dreturn.stats ? dreturn.stats.minValue : 0 };
            this.onDataChange(this.lastAwsData, this.lastAwsInfo, reason);
            if (callback) callback(this.lastAwsData);
            if (stats && dreturn.stats)
                this.awsDataFilter.setItemText(dreturn.stats.itemCount);
        });
    }
    getDataHistory(obtId: string, fileds: string[], keyField: string, timeMode: number, start: Date, current: Date, callback: (res: any[][]) => void) {
        window.common.webService("getDataHistory", { obtid: obtId, start: start, current: current, timeMode: timeMode, dataField: fileds, keyField: keyField }, (res: string) => {
            let data = JSON.parse(res);
            callback(data);
        });
    }
    getArea() { return this.dataArea; }

    setArea(area: string) {
        this.lastOrder = null;
        this.dataArea = area;
        this.city = null;
        this.dataCitys.length = 0;
        this.onAreaChange(this.lastdate, this.dataArea, this.dataField, this.timeMode);
    }
    setCity(citys: string[], name: string) {
        switch (name) {
            case "haikou": this.city = "海口市"; break;
        }
        this.lastOrder = null;
        this.dataCitys = citys;
        this.city = name;
        this.lastAwsInfo = null;
    }
    setDateTime(ddtime: any, reason: changeReason, callback: Function) {
        this.lastOrder = null;
        this.lastdate = ddtime;
        if (reason != changeReason.getLastData)
            this.getServiceData(reason, this.lastdate, callback);
    }
    setAwsType(type: string, checked: boolean) {
        this.lastOrder = null;
        if (checked) {
            if (this.awsAdmin == "none") this.awsAdmin = type;
            else if (this.awsAdmin != type) this.awsAdmin = "all";
        }
        else {
            if (this.awsAdmin == "all") {
                if (type == "city") this.awsAdmin = "state";
                else this.awsAdmin = "city";
            }
        }
        this.getServiceData(changeReason.other, this.lastdate);
    }
    setDataField(dataField: string, timeMode: number, dataName: string) {
        this.lastOrder = null;
        this.timeMode = timeMode;
        this.dataField = dataField;
        this.dataTitle = dataName;
        if (dataField.indexOf("MIN") > -1) this.orderByDescending = false;
        else this.orderByDescending = true;
        this.getServiceData(changeReason.other, this.lastdate);
    }
    destroy() {
        this.lastOrder = null;
        if (this.awsDataFilter) {
            this.awsDataFilter.destroy();
            this.awsDataFilter = null;
        }
    }
    getFullViewDataSort(maxCount: number, callback: (respone: { ID: string, V0: number, V1: number }[]) => void) {
        if (this.lastOrder)
            callback(this.lastOrder);
        let requestArgs = { orderbyDesc: this.orderByDescending, accuracy: this.accuracy, type: this.name, date: this.lastRequestTime, awsAdmin: this.awsAdmin, area: this.dataArea, timeMode: this.timeMode, dataField: this.dataField, citys: this.dataCitys, orderByDescending: this.orderByDescending, maxCount: maxCount };
        window.common.webService("GetFullViewSort", requestArgs, (dreturn: { ID: string, TM: Date, V0: number, V1: number }[]) => {
            this.lastOrder = dreturn;
            for (let item of dreturn) {
                if (item.TM)
                    item.TM = item.TM.toString().toDate();
                else
                    item.TM = this.lastdate;
            }
            callback(dreturn);
        });
    }
}
class TemperatureDataProxy extends WindDataProxy {
    unit = "℃"; accuracy = 1; name = "TEP"; timeMode = 0;
    dataField = "T"; dataTitle = "2分钟气温";
    minValue = -5;
    maxValue = 45;
    constructor(public map: L.Map, defaultArea: string) {
        super(map, defaultArea);
    }
    dataArray: dataFieldAttr[] = [
        { name: "分钟", timeMode: 0, dbFields: ["T"], key: "T" },
        { name: "小时最高", timeMode: 1, dbFields: ["MAXT", "MAXTTIME"], key: "MAXT" },
        { name: "小时最低", timeMode: 1, dbFields: ["MINT", "MINTTIME"], key: "MINT" },
        { name: "日最高", timeMode: 2, dbFields: ["MAXT", "MAXTTIME"], key: "MAXT" },
        { name: "日最低", timeMode: 2, dbFields: ["MINT", "MINTTIME"], key: "MINT" },
        { name: "日平均", timeMode: 2, dbFields: ["AVGT"], key: "AVGT" },
        { name: "1H变温", timeMode: 0, dbFields: ["TOFFSET01H"], key: "TOFFSET01H" },
        { name: "3H变温", timeMode: 0, dbFields: ["TOFFSET03H"], key: "TOFFSET03H" },
        { name: "24H变温", timeMode: 0, dbFields: ["TOFFSET24H"], key: "TOFFSET24H" }
    ];
    public creatFilter() {
        let dataSliderContainer = <HTMLDivElement>document.getElementById("dataSliderContainer");
        if (dataSliderContainer) {
            this.awsDataFilter = new DataSlider([{ text: "-5℃", value: -5, spanColor: "#0000FF" }, { text: ">=0", value: 0, spanColor: "#0000FF" }, { text: "10", value: 10, spanColor: "#0058FF" }, { text: "11", value: 11, spanColor: "#008BFF" }, { text: "12", value: 12, spanColor: "#00BEFF" }, { text: "14", value: 14, spanColor: "#00FFFF" }, { text: "16", value: 16, spanColor: "#00E6CC" }
                , { text: "18", value: 18, spanColor: "#00CC7E" }, { text: "20", value: 20, spanColor: "#00B300" }, { text: "22", value: 22, spanColor: "#7ECC00" }, { text: "24", value: 24, spanColor: "#CCE600" }, { text: "26", value: 26, spanColor: "#FFFF00" }, { text: "28", value: 28, spanColor: "#FFCC00" }, { text: "30", value: 30, spanColor: "#FF9900" }, { text: "32", value: 32, spanColor: "#FF6600" }, { text: "34", value: 34, spanColor: "#FF0000" }, { text: "35", value: 35, spanColor: "#CC0000" }, { text: "36", value: 36, spanColor: "#990000" }, { text: "38", value: 38, spanColor: "#780000" }, { text: "40", value: 40, spanColor: "#5A0000" }
            ], dataSliderContainer, {
                    min: this.minValue, max: this.maxValue, range: true, defaultValue: this.minValue,
                });
            this.setAwsDataFilterOnchange();
        }
    }
    public getServiceData(reason: changeReason, ddatetime: Date, callback?: Function) {
        let bounds = this.map.getBounds(), size = this.map.getSize();
        let stats = this.countValue && reason != changeReason.playing && reason != changeReason.mapMove;
        this.lastRequestTime = ddatetime;
        let args = { orderbyDesc: this.orderByDescending, accuracy: this.accuracy, isPlaying: reason == changeReason.playing, type: this.name, date: ddatetime, awsAdmin: this.awsAdmin, area: this.dataArea, timeMode: this.timeMode, dataField: this.dataField, citys: this.dataCitys, minLng: bounds.getWest(), minLat: bounds.getSouth(), maxLng: bounds.getEast(), maxLat: bounds.getNorth(), canvasWidth: size.x, canvasHeight: size.y, minSpace: 30 };
        window.common.webService("GetAWSDataInfomation", args, (dreturn: { aws: AWSDATE[], stats: any, time: Date }) => {
            let obtname;
            let lastAwsData: DrawDataUnit[] = [];
            let lastTime = dreturn.time.toString().toDate();
            for (var obt of dreturn.aws) {
                obtname = window.obtNames[obt.ID];
                if (obtname) {
                    obt.LN = obtname[1];
                    obt.LA = obtname[0];
                    obt.DISPLAY = (obt.V0 < this.minValue || obt.V0 > this.maxValue) ? false : true;
                    if (!obt.TM) obt.TM = lastTime;
                    else obt.TM = obt.TM.toString().toDate();
                }
                else
                    console.log(obt.ID + " not in dictionary");
            }
            this.lastAwsData = [{ items: dreturn.aws }];
            this.lastAwsInfo = { ddtime: lastTime, title: this.dataTitle, area: this.dataArea, minValue: dreturn.stats ? dreturn.stats.maxValue : 0, maxValue: dreturn.stats ? dreturn.stats.minValue : 0 };
            this.onDataChange(this.lastAwsData, this.lastAwsInfo, reason);
            if (callback) callback(this.lastAwsData);
            if (stats && dreturn.stats)
                this.awsDataFilter.setItemText(dreturn.stats.itemCount);
        });
    }
    destroy() {
        this.lastOrder = null;
        if (this.awsDataFilter) {
            this.awsDataFilter.destroy();
            this.awsDataFilter = null; 
        }
    }
}
class RainDataProxy extends TemperatureDataProxy {
    unit = "mm"; accuracy = 1; name = "RAIN";
    dataField = "R01H"; dataTitle = "1小时累积雨量";
    minValue = 0;
    maxValue = 600;
    dataArray: dataFieldAttr[] = [
        { name: "本小时雨量", timeMode: 0, dbFields: ["HOURR"], key: "HOURR" },
        { name: "滑动雨量6M", timeMode: 0, dbFields: ["R06M"], key: "R06M" },
        { name: "12M", timeMode: 0, dbFields: ["R12M"], key: "R12M" },
        { name: "30M", timeMode: 0, dbFields: ["R30M"], key: "R30M" },
        { name: "R01H", timeMode: 0, dbFields: ["R01H"], key: "R01H" },
        { name: "R02H", timeMode: 0, dbFields: ["R02H"], key: "R02H" },
        { name: "R03H", timeMode: 0, dbFields: ["R03H"], key: "R03H" },
        { name: "R06H", timeMode: 0, dbFields: ["R06H"], key: "R06H" },
        { name: "R12H", timeMode: 0, dbFields: ["R12H"], key: "R12H" },
        { name: "R24H", timeMode: 0, dbFields: ["R24H"], key: "R24H" },
        { name: "R48H", timeMode: 0, dbFields: ["R48H"], key: "R48H" },
        { name: "R72H", timeMode: 0, dbFields: ["R72H"], key: "R72H" }
    ];
    public creatFilter() {
        let dataSliderContainer = <HTMLDivElement>document.getElementById("dataSliderContainer");
        if (dataSliderContainer) {
            this.awsDataFilter = new DataSlider([{ text: "0mm", value: 0, spanColor: "gray" }, { text: "0.1", value: 0.1, spanColor: "#01EBEB" }, { text: "0.5", value: 0.5, spanColor: "#00A0F5" }, { text: "1", value: 1, spanColor: "#0000F6" }, { text: "2", value: 2, spanColor: "#01FF00" }, { text: "5", value: 5, spanColor: "#00C800" }, { text: "10", value: 10, spanColor: "#009000" }
                , { text: "15", value: 15, spanColor: "#FFFF00" }, { text: "20", value: 20, spanColor: "#E7C000" }, { text: "30", value: 30, spanColor: "#FF9000" }, { text: "40", value: 40, spanColor: "#FF0000" }, { text: "50", value: 50, spanColor: "#D50000" }, { text: "60", value: 60, spanColor: "#C00000" }, { text: "80", value: 80, spanColor: "#FF00FF" }, { text: "100", value: 100, spanColor: "#FF00FF" }, { text: "120", value: 120, spanColor: "#FF00FF" }, { text: "130", value: 130, spanColor: "#FF00FF" }
                , { text: "150", value: 150, spanColor: "#FF00FF" }, { text: "300", value: 300, spanColor: "#FF00FF" }, { text: "600", value: 600, spanColor: "#FF00FF" }
            ], dataSliderContainer, {
                    min: this.minValue, max: this.maxValue, step: 0.1, defaultValue: this.minValue
                });
            this.setAwsDataFilterOnchange();
        }
    }
}
class HumidityDataProxy extends TemperatureDataProxy {
    unit = "%"; accuracy = 1; name = "HUM";
    dataField = "U"; dataTitle = "分钟湿度";
    constMinValue = 0;
    constMaxValue = 101;
    minValue = this.constMinValue;
    maxValue = this.constMaxValue;
    dataArray: dataFieldAttr[] = [
        { name: "分钟", timeMode: 0, dbFields: ["U"], key: "U" },
        { name: "小时最高", timeMode: 1, dbFields: ["MAXU", "MAXUTIME"], key: "MAXU" },
        { name: "小时最低", timeMode: 1, dbFields: ["MINU", "MINUTIME"], key: "MINU" },
        { name: "日最高", timeMode: 2, dbFields: ["MAXU", "MAXUTIME"], key: "MAXU" },
        { name: "日最低", timeMode: 2, dbFields: ["MINU", "MINUTIME"], key: "MINU" },
        { name: "日平均", timeMode: 2, dbFields: ["AVGU"], key: "AVGU" }
    ];
    public creatFilter() {
        let dataSliderContainer = <HTMLDivElement>document.getElementById("dataSliderContainer");
        if (dataSliderContainer) {
            this.awsDataFilter = new DataSlider([{ text: "0-29", value: 0 }, { text: "30-49", value: 30 }, { text: "50-59", value: 50 }, { text: "60-65", value: 60 }, { text: "65-69", value: 65 }, { text: "70-74", value: 70 }
                , { text: "75-79", value: 75 }, { text: "80-84", value: 80 }, { text: "85-89", value: 85 }, { text: "90-94", value: 90 }, { text: "95-100", value: 100 }
            ], dataSliderContainer, {
                    itemWidth: 60, min: this.minValue, max: this.maxValue, range: true, slider_selection: "#A3CCFF", defaultValue: this.minValue
                });
            this.setAwsDataFilterOnchange();
        }
    }
}
class PressureDataProxy extends TemperatureDataProxy {
    unit = "hPa"; accuracy = 1; name = "PRE";
    dataField = "P"; dataTitle = "分钟气压";
    minValue = 0;
    maxValue = 1050;
    countValue = false;
    dataArray: dataFieldAttr[] = [
        { name: "分钟", timeMode: 0, dbFields: ["P"], key: "P" },
        { name: "小时最高", timeMode: 1, dbFields: ["MAXP", "MAXPTIME"], key: "MAXP" },
        { name: "小时最低", timeMode: 1, dbFields: ["MINP", "MINPTIME"], key: "MINP" },
        { name: "日最高", timeMode: 2, dbFields: ["MAXP", "MAXPTIME"], key: "MAXP" },
        { name: "日最低", timeMode: 2, dbFields: ["MINP", "MINPTIME"], key: "MINP" },
        { name: "日平均", timeMode: 2, dbFields: ["AVGP"], key: "AVGP" },
        { name: "海平面", timeMode: 0, dbFields: ["P0"], key: "P0" },
        { name: "1H变压", timeMode: 0, dbFields: ["POFFSET01H"], key: "POFFSET01H" },
        { name: "3H变压", timeMode: 0, dbFields: ["POFFSET03H"], key: "POFFSET03H" },
        { name: "24H变压", timeMode: 0, dbFields: ["POFFSET24H"], key: "POFFSET24H" }
    ];
    public creatFilter() {
        let dataSliderContainer = <HTMLDivElement>document.getElementById("dataSliderContainer");
        if (dataSliderContainer) {
            this.awsDataFilter = new DataSlider([{ text: "850", value: 850 }, { text: "900", value: 900 }, { text: "920", value: 920 }, { text: "940", value: 940 }, { text: "950", value: 950 }, { text: "960", value: 960 }
                , { text: "980", value: 980 }, { text: "990", value: 990 }, { text: "1000", value: 1000 }, { text: "1010", value: 1010 }, { text: "1020", value: 1020 }, { text: "1030", value: 1030 }
            ], dataSliderContainer, {
                    itemWidth: 60, min: this.minValue, max: this.maxValue, range: true, slider_selection: "#A3CCFF", sliderPositon: "bottom", defaultValue: this.minValue
                });
            this.setAwsDataFilterOnchange();
        }
    }
}
class VisibilityDataProxy extends TemperatureDataProxy {
    unit = "Km"; accuracy = 1000; name = "VIS"; dataArea = "LOCAL";
    dataField = "V"; dataTitle = "实时能见度";
    minValue = 0;
    maxValue = 50;
    countValue = false;
    dataArray: dataFieldAttr[] = [
        { name: "分钟", timeMode: 0, dbFields: ["V"], key: "V" },
        { name: "小时最低", timeMode: 0, dbFields: ["MINV", "MINVTIME"], key: "MINV" }
    ];
    public creatFilter() { }
}
let currentInstance: WindDataProxy;
export function getDataProxy(name: string, map?: L.Map, dataArea?: string): DataProxy {
    if (currentInstance && currentInstance.name == name)
        return currentInstance;
    else {
        if (currentInstance)
            currentInstance.destroy();
        if (name == "WIND") currentInstance = new WindDataProxy(map, dataArea);
        else if (name == "TEP") currentInstance = new TemperatureDataProxy(map, dataArea);
        else if (name == "RAIN") currentInstance = new RainDataProxy(map, dataArea);
        else if (name == "PRE") currentInstance = new PressureDataProxy(map, dataArea);
        else if (name == "VIS") currentInstance = new VisibilityDataProxy(map, dataArea);
        else if (name == "HUM") currentInstance = new HumidityDataProxy(map, dataArea);
        return currentInstance;
    }
}

declare global {
    interface dataFieldAttr { name: string, timeMode: number, dbFields: string[], key: string }
    class DataProxy extends WindDataProxy { }
    interface DrawDataUnit {
        strokeStyle?: string, items: AWSDATE[], minValue?: number
    }
    var awsLastInfo: any;
}


