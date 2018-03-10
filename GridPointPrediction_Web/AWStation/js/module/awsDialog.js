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
define(["require", "exports", "data/awsDataProxy", "util/windbar", "module/awsHCharts"], function (require, exports, awsDataProxy_1, windbar_1, awsHCharts_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var aws = (function () {
        function aws(obtId, current) {
            this.obtId = obtId;
            this.current = current;
        }
        aws.prototype.setDefaultDataProxy = function (aws) {
            this.defaultDataProxy = awsDataProxy_1.getDataProxy(aws);
            if (this.awsCharts)
                this.awsCharts.clearSeries();
            return this.defaultDataProxy;
        };
        aws.prototype.getArrowImgUrl = function (wdf, angle) {
            var canvas = document.createElement("canvas");
            canvas.width = 60;
            canvas.height = 60;
            var ctx = canvas.getContext('2d');
            ctx.strokeStyle = wdf >= 11 ? "#f00" : "#41353E";
            var canvasPen = new windbar_1.windbar(ctx);
            canvasPen.draw(30, 30, wdf, angle, 1);
            ctx.stroke();
            return canvas.toDataURL();
        };
        aws.prototype.checkAwsItem = function (checked, index) {
            if (this.awsCharts == null)
                this.awsCharts = new awsHCharts_1.default("hChart_div", 300000);
            var checkItem = this.defaultDataProxy.dataArray[index];
            if (checked) {
                if (this.defaultDataProxy.name == "WIND")
                    this.handWindChart(checkItem);
                else if (this.defaultDataProxy.name == "TEP")
                    this.handTempChart(checkItem);
                else if (this.defaultDataProxy.name == "RAIN")
                    this.handRainChart(checkItem);
                else if (this.defaultDataProxy.name == "HUM")
                    this.handTempChart(checkItem, 1);
                else if (this.defaultDataProxy.name == "PRE")
                    this.handTempChart(checkItem, 10);
                else if (this.defaultDataProxy.name == "VIS")
                    this.handVisChart(checkItem);
            }
            else
                this.awsCharts.removeSeries(checkItem.name);
        };
        aws.prototype.handVisChart = function (checkItem) {
            var _this = this;
            var selectField = ["DDATETIME"], seriesData = [];
            for (var i = 0; i < checkItem.dbFields.length; i++)
                selectField.push(checkItem.dbFields[i]);
            switch (checkItem.name) {
                case "分钟":
                    var starTime = new Date(this.current.getTime() - 2 * 3600000);
                    this.defaultDataProxy.getDataHistory(this.obtId, selectField, checkItem.key, checkItem.timeMode, starTime, this.current, function (data) {
                        for (var i = 0, value, times, wdd, length = data.length; i < length; i++) {
                            times = data[i][0].toDate().getTime();
                            value = data[i][1] / 1000;
                            seriesData.push([times, value]);
                        }
                        _this.awsCharts.addSeries(checkItem.name, seriesData, _this.defaultDataProxy.unit);
                    });
                    break;
                case "小时最低":
                    var starTime = new Date(this.current.getTime() - 2 * 3600000);
                    this.defaultDataProxy.getDataHistory(this.obtId, selectField, checkItem.key, checkItem.timeMode, starTime, this.current, function (data) {
                        var lastTime;
                        for (var i = 0, value, times, wdd, length = data.length; i < length; i++) {
                            var ddate = data[i][0].toDate();
                            ddate.setMinutes(0, 0, 0);
                            times = ddate.getTime() + +data[i][2] * 60000;
                            value = data[i][1] / 1000;
                            if (lastTime != times) {
                                seriesData.push([times, value]);
                                lastTime = times;
                            }
                        }
                        _this.awsCharts.addSeries(checkItem.name, seriesData, _this.defaultDataProxy.unit);
                    });
                    break;
            }
        };
        aws.prototype.handRainChart = function (checkItem) {
            var _this = this;
            var selectField = ["DDATETIME"], seriesData = [];
            for (var i = 0; i < checkItem.dbFields.length; i++)
                selectField.push(checkItem.dbFields[i]);
            var starTime = new Date(this.current.getTime() - 3 * 3600000);
            this.defaultDataProxy.getDataHistory(this.obtId, selectField, checkItem.key, checkItem.timeMode, starTime, this.current, function (data) {
                for (var i = 0, rain, times, length = data.length; i < length; i++) {
                    times = data[i][0].toDate().getTime();
                    rain = data[i][1];
                    seriesData.push([times, rain]);
                }
                _this.awsCharts.addSeries(checkItem.name, seriesData, _this.defaultDataProxy.unit, "column");
            });
        };
        aws.prototype.handTempChart = function (checkItem, accuracy) {
            var _this = this;
            if (accuracy === void 0) { accuracy = 1; }
            var selectField = ["DDATETIME"], seriesData = [];
            for (var i = 0; i < checkItem.dbFields.length; i++)
                selectField.push(checkItem.dbFields[i]);
            var unit = this.defaultDataProxy.unit;
            switch (checkItem.name) {
                case "1H变温":
                case "3H变温":
                case "24H变温":
                case "1H变压":
                case "3H变压":
                case "24H变压":
                    unit += "变";
                case "分钟":
                case "海平面":
                    var starTime = new Date(this.current.getTime() - 2 * 3600000);
                    this.defaultDataProxy.getDataHistory(this.obtId, selectField, checkItem.key, checkItem.timeMode, starTime, this.current, function (data) {
                        for (var i = 0, temprature, times, length = data.length; i < length; i++) {
                            times = data[i][0].toDate().getTime();
                            temprature = data[i][1] / accuracy;
                            seriesData.push([times, temprature]);
                        }
                        _this.awsCharts.addSeries(checkItem.name, seriesData, unit);
                    });
                    break;
                case "小时最高":
                case "小时最低":
                    var starTime = new Date(this.current.getTime() - 12 * 3600000);
                    this.defaultDataProxy.getDataHistory(this.obtId, selectField, checkItem.key, checkItem.timeMode, starTime, this.current, function (data) {
                        for (var i = 0, temprature, times, length = data.length; i < length; i++) {
                            var ddate = data[i][0].toDate();
                            times = ddate.getTime() - 3600000 + +data[i][2] * 60000;
                            temprature = data[i][1] / accuracy;
                            seriesData.push([times, temprature]);
                        }
                        _this.awsCharts.addSeries(checkItem.name, seriesData, unit);
                    });
                    break;
                case "日最高":
                case "日最低":
                    selectField.splice(0, 1);
                    var starTime = new Date(this.current.getTime() - 6 * 24 * 3600000);
                    this.defaultDataProxy.getDataHistory(this.obtId, selectField, checkItem.key, checkItem.timeMode, starTime, this.current, function (data) {
                        for (var i = 0, temprature, times, length = data.length; i < length; i++) {
                            var ddate = data[i][1].toDate();
                            times = ddate.getTime();
                            temprature = data[i][0] / accuracy;
                            seriesData.push([times, temprature]);
                        }
                        _this.awsCharts.addSeries(checkItem.name, seriesData, unit);
                    });
                    break;
                case "日平均":
                    var starTime = new Date(this.current.getTime() - 6 * 24 * 3600000);
                    this.defaultDataProxy.getDataHistory(this.obtId, selectField, checkItem.key, checkItem.timeMode, starTime, this.current, function (data) {
                        for (var i = 0, temprature, times, length = data.length; i < length; i++) {
                            var ddate = data[i][0].toDate();
                            times = ddate.getTime();
                            temprature = data[i][1] / accuracy;
                            seriesData.push([times, temprature]);
                        }
                        _this.awsCharts.addSeries(checkItem.name, seriesData, unit);
                    });
                    break;
            }
        };
        aws.prototype.handWindChart = function (checkItem) {
            var _this = this;
            var selectField = ["DDATETIME"], seriesData = [];
            var tooltip = { shared: true, pointFormatter: function () { return "<br/>" + this.series.name + "风速m/s：" + this.y + "  风向∠：" + this.dd; } };
            for (var i = 0; i < checkItem.dbFields.length; i++)
                selectField.push(checkItem.dbFields[i]);
            var starTime;
            switch (checkItem.name) {
                case "2M":
                case "10M":
                case "瞬时风":
                case "小时极大风":
                    starTime = new Date(this.current.getTime() - 2 * 3600000);
                case "小时最大10M":
                    if (!starTime)
                        starTime = new Date(this.current.getTime() - 12 * 3600000);
                    this.defaultDataProxy.getDataHistory(this.obtId, selectField, checkItem.key, checkItem.timeMode, starTime, this.current, function (data) {
                        for (var i = 0, wdf, times, wdd, length = data.length; i < length; i++) {
                            times = data[i][0].toDate().getTime();
                            wdf = data[i][1];
                            wdd = data[i][2];
                            seriesData.push({ x: times, y: wdf, dd: wdd, marker: { symbol: "url(" + _this.getArrowImgUrl(wdf, wdd) + ")" } });
                        }
                        _this.awsCharts.addSeries(checkItem.name, seriesData, _this.defaultDataProxy.unit, "line", null, { tooltip: tooltip });
                    });
                    break;
                case "日最大10M":
                case "日最大瞬时风":
                    selectField.splice(0, 1);
                    starTime = new Date(this.current.getTime() - 6 * 24 * 3600000);
                    this.defaultDataProxy.getDataHistory(this.obtId, selectField, checkItem.key, checkItem.timeMode, starTime, this.current, function (data) {
                        for (var i = 0, wdf, times, wdd, length = data.length; i < length; i++) {
                            times = data[i][2].toDate().getTime();
                            wdf = data[i][0];
                            wdd = data[i][1];
                            seriesData.push({ x: times, y: wdf, dd: wdd, marker: { symbol: "url(" + _this.getArrowImgUrl(wdf, wdd) + ")" } });
                        }
                        _this.awsCharts.addSeries(checkItem.name, seriesData, _this.defaultDataProxy.unit, "line", null, { tooltip: tooltip });
                    });
                    break;
            }
        };
        return aws;
    }());
    exports.aws = aws;
    var awsHours = (function (_super) {
        __extends(awsHours, _super);
        function awsHours() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.awsCharts = new awsHCharts_1.default("hChart_compdiv");
            return _this;
        }
        awsHours.prototype.wd3smaxdf = function (checked) {
            var _this = this;
            var name = "小时极大风";
            if (checked) {
                var dataProxy = awsDataProxy_1.getDataProxy("WIND");
                var starTime = new Date(this.current.getTime() - 24 * 3600000);
                dataProxy.getDataHistory(this.obtId, ["DDATETIME", "WD3SMAXDF", "WD3SMAXDD", "WD3SMAXTIME"], "WD3SMAXDF", 1, starTime, this.current, function (data) {
                    var seriesData = [];
                    for (var i = 0, d; i < data.length; i++) {
                        d = data[i];
                        var times = d[0].toString().toDate().getTime();
                        times = times - 3600000 + d[3] * 60000;
                        seriesData.push([times, d[1]]);
                    }
                    _this.awsCharts.addSeries(name, seriesData, dataProxy.unit);
                });
            }
            else
                this.awsCharts.removeSeries(name);
        };
        awsHours.prototype.tempEdge = function (checked, dateField) {
            var _this = this;
            var name;
            if (dateField == "MINT")
                name = "小时最低温度";
            else if (dateField == "MAXT")
                name = "小时最高温度";
            if (checked) {
                var dataProxy = awsDataProxy_1.getDataProxy("TEP");
                var starTime = new Date(this.current.getTime() - 24 * 3600000);
                dataProxy.getDataHistory(this.obtId, ["DDATETIME", dateField, dateField + "TIME"], dateField, 1, starTime, this.current, function (data) {
                    var minValue, seriesData = [];
                    for (var i = 0, d; i < data.length; i++) {
                        d = data[i];
                        var times = d[0].toString().toDate().getTime();
                        times = times - 3600000 + d[2] * 60000;
                        seriesData.push([times, d[1]]);
                        if (minValue == null || minValue > d[1])
                            minValue = d[1];
                    }
                    _this.awsCharts.addSeries(name, seriesData, dataProxy.unit, "line", { min: minValue });
                });
            }
            else
                this.awsCharts.removeSeries(name);
        };
        awsHours.prototype.rainHour = function (checked) {
            var _this = this;
            var name = "小时累积雨量";
            if (checked) {
                var dataProxy = awsDataProxy_1.getDataProxy("RAIN");
                var starTime = new Date(this.current.getTime() - 24 * 3600000);
                dataProxy.getDataHistory(this.obtId, ["DDATETIME", "HOURR"], "HOURR", 1, starTime, this.current, function (data) {
                    var seriesData = [];
                    for (var i = 0, d; i < data.length; i++) {
                        d = data[i];
                        d[0] = d[0].toString().toDate();
                        seriesData.push([d[0].getTime(), d[1]]);
                    }
                    _this.awsCharts.addSeries(name, seriesData, dataProxy.unit, "column");
                });
            }
            else
                this.awsCharts.removeSeries(name);
        };
        awsHours.prototype.pressureEdge = function (checked, dateField) {
            var _this = this;
            var name;
            if (dateField == "MINP")
                name = "小时最低气压";
            else if (dateField == "MAXP")
                name = "小时最高气压";
            if (checked) {
                var dataProxy = awsDataProxy_1.getDataProxy("PRE");
                var starTime = new Date(this.current.getTime() - 24 * 3600000);
                dataProxy.getDataHistory(this.obtId, ["DDATETIME", dateField, dateField + "TIME"], dateField, 1, starTime, this.current, function (data) {
                    var seriesData = [];
                    for (var i = 0, d; i < data.length; i++) {
                        d = data[i];
                        var times = d[0].toString().toDate().getTime();
                        times = times - 3600000 + d[2] * 60000;
                        seriesData.push([times, d[1]]);
                    }
                    _this.awsCharts.addSeries(name, seriesData, dataProxy.unit);
                });
            }
            else
                this.awsCharts.removeSeries(name);
        };
        return awsHours;
    }(aws));
    exports.awsHours = awsHours;
});
