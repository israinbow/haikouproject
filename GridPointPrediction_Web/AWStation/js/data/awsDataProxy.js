var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
define(["require", "exports", "util/dataSlider"], function (require, exports, dataSlider_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var WindDataProxy = (function () {
        function WindDataProxy(map, defaultArea) {
            this.map = map;
            this.name = "WIND";
            this.unit = "m/s";
            this.awsAdmin = "all";
            this.accuracy = 1;
            this.dataField = "WD3SMAXDF";
            this.dataTitle = "小时极大风";
            this.orderByDescending = true;
            this.timeMode = 0;
            this.minValue = 0;
            this.maxValue = 61.0;
            this.countValue = true;
            this.dataArray = [
                { name: "小时极大风", timeMode: 0, dbFields: ["WD3SMAXDF", "WD3SMAXDD"], key: "WD3SMAXDF" },
                { name: "瞬时风", timeMode: 0, dbFields: ["WDIDF", "WDIDD"], key: "WDIDF" },
                { name: "2M", timeMode: 0, dbFields: ["WD2DF", "WD2DD"], key: "WD2DF" },
                { name: "10M", timeMode: 0, dbFields: ["WD10DF", "WD10DD"], key: "WD10DF" },
                { name: "小时最大10M", timeMode: 1, dbFields: ["WD10MAXDF", "WD10MAXDD", "WD10MAXTIME"], key: "WD10MAXDF" },
                { name: "日最大10M", timeMode: 2, dbFields: ["WD10MAXDF", "WD10MAXDD", "WD10MAXTIME"], key: "WD10MAXDF" },
                { name: "日最大瞬时风", timeMode: 2, dbFields: ["WD3SMAXDF", "WD3SMAXDD", "WD3SMAXTIME"], key: "WD3SMAXDF" }
            ];
            this.lastAwsData = [
                { strokeStyle: "#41353E", items: [], minValue: 0 },
                { strokeStyle: "#FF0000", items: [], minValue: 6 },
                { strokeStyle: "#FF9900", items: [], minValue: 10 },
                { strokeStyle: "#FF00FF", items: [], minValue: 12 }
            ];
            this.lastOrder = [];
            this.dataCitys = [];
            this.lastdate = null;
            this.windScale = [0, 0.3, 1.6, 3.4, 5.5, 8.0, 10.8, 13.9, 17.2, 20.8, 24.5, 28.5, 32.7, 37, 41.5, 46.2, 51, 56.1, 61.0];
            this.dataArea = defaultArea;
        }
        WindDataProxy.prototype.onDataChange = function (lastAwsData, lastAwsInfo, changeReason) { };
        WindDataProxy.prototype.onAreaChange = function (time, area, catalog, timeMode) { };
        WindDataProxy.prototype.getLevel = function (maxWind) {
            for (var i = 0; i < this.windScale.length; i++) {
                if (maxWind >= this.windScale[i])
                    continue;
                else
                    return i - 1;
            }
            return 18;
        };
        WindDataProxy.prototype.creatFilter = function () {
            var _this = this;
            var dataSliderContainer = document.getElementById("dataSliderContainer");
            if (dataSliderContainer) {
                this.awsDataFilter = new dataSlider_1.default([{ text: "风力0级", value: 0, width: 85, spanColor: "gray" }, { text: "1", value: 0.3, spanColor: "gray" }, { text: "2", value: 1.6, spanColor: "gray" }, { text: "3", value: 3.4, spanColor: "gray" }, { text: "4", value: 5.5, spanColor: "gray" }, { text: "5", value: 8.0, spanColor: "gray" }, { text: "6", value: 10.8, spanColor: "#FF0000" }, { text: "7", value: 13.9, spanColor: "#FF0000" },
                    { text: "8", value: 17.2, spanColor: "#FF0000" }, { text: "9", value: 20.8, spanColor: "#FF0000" }, { text: "10", value: 24.5, spanColor: "#FF9900" }, { text: "11", value: 28.5, spanColor: "#FF9900" }, { text: "12", value: 32.7, spanColor: "#FF00FF" }, { text: "13", value: 37, spanColor: "#FF00FF" },
                    { text: "14", value: 41.5, spanColor: "#FF00FF" }, { text: "15", value: 46.2, spanColor: "#FF00FF" }, { text: "16", value: 51, spanColor: "#FF00FF" }, { text: "17", value: 56.1, spanColor: "#FF00FF" }, { text: ">17", value: 61.0, spanColor: "#FF00FF" }
                ], dataSliderContainer, {
                    min: this.minValue, max: this.maxValue, defaultValue: this.minValue, step: 0.1, formatter: function (value) { return value + _this.unit; }
                });
                this.setAwsDataFilterOnchange();
            }
        };
        WindDataProxy.prototype.setAwsDataFilterOnchange = function () {
            var _this = this;
            this.dataClassify = Enumerable.From(this.awsDataFilter.items).Select(function (item) { return item.value; }).ToArray();
            this.awsDataFilter.onChange = function (minValue, maxValue) {
                _this.minValue = minValue;
                _this.maxValue = maxValue;
                for (var _i = 0, _a = _this.lastAwsData; _i < _a.length; _i++) {
                    var drawCatalog = _a[_i];
                    for (var _b = 0, _c = drawCatalog.items; _b < _c.length; _b++) {
                        var item = _c[_b];
                        item.DISPLAY = (item.V0 < _this.minValue || item.V0 > _this.maxValue) ? false : true;
                    }
                }
                _this.onDataChange(_this.lastAwsData, _this.lastAwsInfo, 2);
            };
        };
        WindDataProxy.prototype.changeOrderBy = function (descending) {
            this.orderByDescending = descending;
            this.getServiceData(0, this.lastdate);
        };
        WindDataProxy.prototype.getServiceData = function (reason, ddatetime, callback) {
            var _this = this;
            var bounds = this.map.getBounds(), size = this.map.getSize();
            var stats = this.countValue && reason != 1 && reason != 3;
            var args = { orderbyDesc: this.orderByDescending, accuracy: this.accuracy, isPlaying: reason == 1, type: this.name, date: ddatetime, awsAdmin: this.awsAdmin, area: this.dataArea, timeMode: this.timeMode, dataField: this.dataField, citys: this.dataCitys, minLng: bounds.getWest(), minLat: bounds.getSouth(), maxLng: bounds.getEast(), maxLat: bounds.getNorth(), canvasWidth: size.x, canvasHeight: size.y, minSpace: 8 };
            this.lastRequestTime = ddatetime;
            window.common.webService("GetAWSDataInfomation", args, function (dreturn) {
                var obtname, windf, windLevel;
                for (var i = 0; i < _this.lastAwsData.length; i++)
                    _this.lastAwsData[i].items.length = 0;
                var lastTime = dreturn.time.toString().toDate();
                for (var _i = 0, _a = dreturn.aws; _i < _a.length; _i++) {
                    var obt = _a[_i];
                    obtname = window.obtNames[obt.ID];
                    if (obtname) {
                        obt.LN = obtname[1];
                        obt.LA = obtname[0];
                        obt.DISPLAY = (obt.V0 < _this.minValue || obt.V0 > _this.maxValue) ? false : true;
                        var index = 0;
                        if (obt.V0 < 10.8)
                            index = 0;
                        else if (obt.V0 < 24.5)
                            index = 1;
                        else if (obt.V0 < 32.7)
                            index = 2;
                        else
                            index = 3;
                        _this.lastAwsData[index].items.push(obt);
                        if (!obt.TM)
                            obt.TM = lastTime;
                        else
                            obt.TM = obt.TM.toString().toDate();
                    }
                    else
                        console.log(obt.ID + " not in dictionary");
                }
                _this.lastAwsInfo = { ddtime: lastTime, title: _this.dataTitle, area: _this.dataArea, city: _this.city, minValue: dreturn.stats ? dreturn.stats.maxValue : 0, maxValue: dreturn.stats ? dreturn.stats.minValue : 0 };
                _this.onDataChange(_this.lastAwsData, _this.lastAwsInfo, reason);
                if (callback)
                    callback(_this.lastAwsData);
                if (stats && dreturn.stats)
                    _this.awsDataFilter.setItemText(dreturn.stats.itemCount);
            });
        };
        WindDataProxy.prototype.getDataHistory = function (obtId, fileds, keyField, timeMode, start, current, callback) {
            window.common.webService("getDataHistory", { obtid: obtId, start: start, current: current, timeMode: timeMode, dataField: fileds, keyField: keyField }, function (res) {
                var data = JSON.parse(res);
                callback(data);
            });
        };
        WindDataProxy.prototype.getArea = function () { return this.dataArea; };
        WindDataProxy.prototype.setArea = function (area) {
            this.lastOrder = null;
            this.dataArea = area;
            this.city = null;
            this.dataCitys.length = 0;
            this.onAreaChange(this.lastdate, this.dataArea, this.dataField, this.timeMode);
        };
        WindDataProxy.prototype.setCity = function (citys, name) {
            switch (name) {
                case "haikou":
                    this.city = "海口市";
                    break;
            }
            this.lastOrder = null;
            this.dataCitys = citys;
            this.city = name;
            this.lastAwsInfo = null;
        };
        WindDataProxy.prototype.setDateTime = function (ddtime, reason, callback) {
            this.lastOrder = null;
            this.lastdate = ddtime;
            if (reason != 5)
                this.getServiceData(reason, this.lastdate, callback);
        };
        WindDataProxy.prototype.setAwsType = function (type, checked) {
            this.lastOrder = null;
            if (checked) {
                if (this.awsAdmin == "none")
                    this.awsAdmin = type;
                else if (this.awsAdmin != type)
                    this.awsAdmin = "all";
            }
            else {
                if (this.awsAdmin == "all") {
                    if (type == "city")
                        this.awsAdmin = "state";
                    else
                        this.awsAdmin = "city";
                }
            }
            this.getServiceData(0, this.lastdate);
        };
        WindDataProxy.prototype.setDataField = function (dataField, timeMode, dataName) {
            this.lastOrder = null;
            this.timeMode = timeMode;
            this.dataField = dataField;
            this.dataTitle = dataName;
            if (dataField.indexOf("MIN") > -1)
                this.orderByDescending = false;
            else
                this.orderByDescending = true;
            this.getServiceData(0, this.lastdate);
        };
        WindDataProxy.prototype.destroy = function () {
            this.lastOrder = null;
            if (this.awsDataFilter) {
                this.awsDataFilter.destroy();
                this.awsDataFilter = null;
            }
        };
        WindDataProxy.prototype.getFullViewDataSort = function (maxCount, callback) {
            var _this = this;
            if (this.lastOrder)
                callback(this.lastOrder);
            var requestArgs = { orderbyDesc: this.orderByDescending, accuracy: this.accuracy, type: this.name, date: this.lastRequestTime, awsAdmin: this.awsAdmin, area: this.dataArea, timeMode: this.timeMode, dataField: this.dataField, citys: this.dataCitys, orderByDescending: this.orderByDescending, maxCount: maxCount };
            window.common.webService("GetFullViewSort", requestArgs, function (dreturn) {
                _this.lastOrder = dreturn;
                for (var _i = 0, dreturn_1 = dreturn; _i < dreturn_1.length; _i++) {
                    var item = dreturn_1[_i];
                    if (item.TM)
                        item.TM = item.TM.toString().toDate();
                    else
                        item.TM = _this.lastdate;
                }
                callback(dreturn);
            });
        };
        return WindDataProxy;
    }());
    var TemperatureDataProxy = (function (_super) {
        __extends(TemperatureDataProxy, _super);
        function TemperatureDataProxy(map, defaultArea) {
            var _this = _super.call(this, map, defaultArea) || this;
            _this.map = map;
            _this.unit = "℃";
            _this.accuracy = 1;
            _this.name = "TEP";
            _this.timeMode = 0;
            _this.dataField = "T";
            _this.dataTitle = "2分钟气温";
            _this.minValue = -5;
            _this.maxValue = 45;
            _this.dataArray = [
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
            return _this;
        }
        TemperatureDataProxy.prototype.creatFilter = function () {
            var dataSliderContainer = document.getElementById("dataSliderContainer");
            if (dataSliderContainer) {
                this.awsDataFilter = new dataSlider_1.default([{ text: "-5℃", value: -5, spanColor: "#0000FF" }, { text: ">=0", value: 0, spanColor: "#0000FF" }, { text: "10", value: 10, spanColor: "#0058FF" }, { text: "11", value: 11, spanColor: "#008BFF" }, { text: "12", value: 12, spanColor: "#00BEFF" }, { text: "14", value: 14, spanColor: "#00FFFF" }, { text: "16", value: 16, spanColor: "#00E6CC" },
                    { text: "18", value: 18, spanColor: "#00CC7E" }, { text: "20", value: 20, spanColor: "#00B300" }, { text: "22", value: 22, spanColor: "#7ECC00" }, { text: "24", value: 24, spanColor: "#CCE600" }, { text: "26", value: 26, spanColor: "#FFFF00" }, { text: "28", value: 28, spanColor: "#FFCC00" }, { text: "30", value: 30, spanColor: "#FF9900" }, { text: "32", value: 32, spanColor: "#FF6600" }, { text: "34", value: 34, spanColor: "#FF0000" }, { text: "35", value: 35, spanColor: "#CC0000" }, { text: "36", value: 36, spanColor: "#990000" }, { text: "38", value: 38, spanColor: "#780000" }, { text: "40", value: 40, spanColor: "#5A0000" }
                ], dataSliderContainer, {
                    min: this.minValue, max: this.maxValue, range: true, defaultValue: this.minValue,
                });
                this.setAwsDataFilterOnchange();
            }
        };
        TemperatureDataProxy.prototype.getServiceData = function (reason, ddatetime, callback) {
            var _this = this;
            var bounds = this.map.getBounds(), size = this.map.getSize();
            var stats = this.countValue && reason != 1 && reason != 3;
            this.lastRequestTime = ddatetime;
            var args = { orderbyDesc: this.orderByDescending, accuracy: this.accuracy, isPlaying: reason == 1, type: this.name, date: ddatetime, awsAdmin: this.awsAdmin, area: this.dataArea, timeMode: this.timeMode, dataField: this.dataField, citys: this.dataCitys, minLng: bounds.getWest(), minLat: bounds.getSouth(), maxLng: bounds.getEast(), maxLat: bounds.getNorth(), canvasWidth: size.x, canvasHeight: size.y, minSpace: 30 };
            window.common.webService("GetAWSDataInfomation", args, function (dreturn) {
                var obtname;
                var lastAwsData = [];
                var lastTime = dreturn.time.toString().toDate();
                for (var _i = 0, _a = dreturn.aws; _i < _a.length; _i++) {
                    var obt = _a[_i];
                    obtname = window.obtNames[obt.ID];
                    if (obtname) {
                        obt.LN = obtname[1];
                        obt.LA = obtname[0];
                        obt.DISPLAY = (obt.V0 < _this.minValue || obt.V0 > _this.maxValue) ? false : true;
                        if (!obt.TM)
                            obt.TM = lastTime;
                        else
                            obt.TM = obt.TM.toString().toDate();
                    }
                    else
                        console.log(obt.ID + " not in dictionary");
                }
                _this.lastAwsData = [{ items: dreturn.aws }];
                _this.lastAwsInfo = { ddtime: lastTime, title: _this.dataTitle, area: _this.dataArea, minValue: dreturn.stats ? dreturn.stats.maxValue : 0, maxValue: dreturn.stats ? dreturn.stats.minValue : 0 };
                _this.onDataChange(_this.lastAwsData, _this.lastAwsInfo, reason);
                if (callback)
                    callback(_this.lastAwsData);
                if (stats && dreturn.stats)
                    _this.awsDataFilter.setItemText(dreturn.stats.itemCount);
            });
        };
        TemperatureDataProxy.prototype.destroy = function () {
            this.lastOrder = null;
            if (this.awsDataFilter) {
                this.awsDataFilter.destroy();
                this.awsDataFilter = null;
            }
        };
        return TemperatureDataProxy;
    }(WindDataProxy));
    var RainDataProxy = (function (_super) {
        __extends(RainDataProxy, _super);
        function RainDataProxy() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.unit = "mm";
            _this.accuracy = 1;
            _this.name = "RAIN";
            _this.dataField = "R01H";
            _this.dataTitle = "1小时累积雨量";
            _this.minValue = 0;
            _this.maxValue = 600;
            _this.dataArray = [
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
            return _this;
        }
        RainDataProxy.prototype.creatFilter = function () {
            var dataSliderContainer = document.getElementById("dataSliderContainer");
            if (dataSliderContainer) {
                this.awsDataFilter = new dataSlider_1.default([{ text: "0mm", value: 0, spanColor: "gray" }, { text: "0.1", value: 0.1, spanColor: "#01EBEB" }, { text: "0.5", value: 0.5, spanColor: "#00A0F5" }, { text: "1", value: 1, spanColor: "#0000F6" }, { text: "2", value: 2, spanColor: "#01FF00" }, { text: "5", value: 5, spanColor: "#00C800" }, { text: "10", value: 10, spanColor: "#009000" },
                    { text: "15", value: 15, spanColor: "#FFFF00" }, { text: "20", value: 20, spanColor: "#E7C000" }, { text: "30", value: 30, spanColor: "#FF9000" }, { text: "40", value: 40, spanColor: "#FF0000" }, { text: "50", value: 50, spanColor: "#D50000" }, { text: "60", value: 60, spanColor: "#C00000" }, { text: "80", value: 80, spanColor: "#FF00FF" }, { text: "100", value: 100, spanColor: "#FF00FF" }, { text: "120", value: 120, spanColor: "#FF00FF" }, { text: "130", value: 130, spanColor: "#FF00FF" },
                    { text: "150", value: 150, spanColor: "#FF00FF" }, { text: "300", value: 300, spanColor: "#FF00FF" }, { text: "600", value: 600, spanColor: "#FF00FF" }
                ], dataSliderContainer, {
                    min: this.minValue, max: this.maxValue, step: 0.1, defaultValue: this.minValue
                });
                this.setAwsDataFilterOnchange();
            }
        };
        return RainDataProxy;
    }(TemperatureDataProxy));
    var HumidityDataProxy = (function (_super) {
        __extends(HumidityDataProxy, _super);
        function HumidityDataProxy() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.unit = "%";
            _this.accuracy = 1;
            _this.name = "HUM";
            _this.dataField = "U";
            _this.dataTitle = "分钟湿度";
            _this.constMinValue = 0;
            _this.constMaxValue = 101;
            _this.minValue = _this.constMinValue;
            _this.maxValue = _this.constMaxValue;
            _this.dataArray = [
                { name: "分钟", timeMode: 0, dbFields: ["U"], key: "U" },
                { name: "小时最高", timeMode: 1, dbFields: ["MAXU", "MAXUTIME"], key: "MAXU" },
                { name: "小时最低", timeMode: 1, dbFields: ["MINU", "MINUTIME"], key: "MINU" },
                { name: "日最高", timeMode: 2, dbFields: ["MAXU", "MAXUTIME"], key: "MAXU" },
                { name: "日最低", timeMode: 2, dbFields: ["MINU", "MINUTIME"], key: "MINU" },
                { name: "日平均", timeMode: 2, dbFields: ["AVGU"], key: "AVGU" }
            ];
            return _this;
        }
        HumidityDataProxy.prototype.creatFilter = function () {
            var dataSliderContainer = document.getElementById("dataSliderContainer");
            if (dataSliderContainer) {
                this.awsDataFilter = new dataSlider_1.default([{ text: "0-29", value: 0 }, { text: "30-49", value: 30 }, { text: "50-59", value: 50 }, { text: "60-65", value: 60 }, { text: "65-69", value: 65 }, { text: "70-74", value: 70 },
                    { text: "75-79", value: 75 }, { text: "80-84", value: 80 }, { text: "85-89", value: 85 }, { text: "90-94", value: 90 }, { text: "95-100", value: 100 }
                ], dataSliderContainer, {
                    itemWidth: 60, min: this.minValue, max: this.maxValue, range: true, slider_selection: "#A3CCFF", defaultValue: this.minValue
                });
                this.setAwsDataFilterOnchange();
            }
        };
        return HumidityDataProxy;
    }(TemperatureDataProxy));
    var PressureDataProxy = (function (_super) {
        __extends(PressureDataProxy, _super);
        function PressureDataProxy() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.unit = "hPa";
            _this.accuracy = 1;
            _this.name = "PRE";
            _this.dataField = "P";
            _this.dataTitle = "分钟气压";
            _this.minValue = 0;
            _this.maxValue = 1050;
            _this.countValue = false;
            _this.dataArray = [
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
            return _this;
        }
        PressureDataProxy.prototype.creatFilter = function () {
            var dataSliderContainer = document.getElementById("dataSliderContainer");
            if (dataSliderContainer) {
                this.awsDataFilter = new dataSlider_1.default([{ text: "850", value: 850 }, { text: "900", value: 900 }, { text: "920", value: 920 }, { text: "940", value: 940 }, { text: "950", value: 950 }, { text: "960", value: 960 },
                    { text: "980", value: 980 }, { text: "990", value: 990 }, { text: "1000", value: 1000 }, { text: "1010", value: 1010 }, { text: "1020", value: 1020 }, { text: "1030", value: 1030 }
                ], dataSliderContainer, {
                    itemWidth: 60, min: this.minValue, max: this.maxValue, range: true, slider_selection: "#A3CCFF", sliderPositon: "bottom", defaultValue: this.minValue
                });
                this.setAwsDataFilterOnchange();
            }
        };
        return PressureDataProxy;
    }(TemperatureDataProxy));
    var VisibilityDataProxy = (function (_super) {
        __extends(VisibilityDataProxy, _super);
        function VisibilityDataProxy() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.unit = "Km";
            _this.accuracy = 1000;
            _this.name = "VIS";
            _this.dataArea = "LOCAL";
            _this.dataField = "V";
            _this.dataTitle = "实时能见度";
            _this.minValue = 0;
            _this.maxValue = 50;
            _this.countValue = false;
            _this.dataArray = [
                { name: "分钟", timeMode: 0, dbFields: ["V"], key: "V" },
                { name: "小时最低", timeMode: 0, dbFields: ["MINV", "MINVTIME"], key: "MINV" }
            ];
            return _this;
        }
        VisibilityDataProxy.prototype.creatFilter = function () { };
        return VisibilityDataProxy;
    }(TemperatureDataProxy));
    var currentInstance;
    function getDataProxy(name, map, dataArea) {
        if (currentInstance && currentInstance.name == name)
            return currentInstance;
        else {
            if (currentInstance)
                currentInstance.destroy();
            if (name == "WIND")
                currentInstance = new WindDataProxy(map, dataArea);
            else if (name == "TEP")
                currentInstance = new TemperatureDataProxy(map, dataArea);
            else if (name == "RAIN")
                currentInstance = new RainDataProxy(map, dataArea);
            else if (name == "PRE")
                currentInstance = new PressureDataProxy(map, dataArea);
            else if (name == "VIS")
                currentInstance = new VisibilityDataProxy(map, dataArea);
            else if (name == "HUM")
                currentInstance = new HumidityDataProxy(map, dataArea);
            return currentInstance;
        }
    }
    exports.getDataProxy = getDataProxy;
});
