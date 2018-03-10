//自动站小时图表控件
import { getDataProxy } from "data/awsDataProxy";
import { windbar } from "util/windbar";
import AwsHCharts from "module/awsHCharts";

export class aws {
    defaultDataProxy: DataProxy;
    awsCharts: AwsHCharts;
    constructor(public obtId: string, public current: Date) { }
    setDefaultDataProxy(aws: string) {
        this.defaultDataProxy = getDataProxy(aws);
        if (this.awsCharts)
            this.awsCharts.clearSeries();
        return this.defaultDataProxy;
    }
    getArrowImgUrl(wdf: number, angle: number) {
        var canvas = document.createElement("canvas");
        canvas.width = 60; canvas.height = 60;
        var ctx = canvas.getContext('2d');
        ctx.strokeStyle = wdf >= 11 ? "#f00" : "#41353E";
        var canvasPen = new windbar(ctx);
        canvasPen.draw(30, 30, wdf, angle, 1);
        ctx.stroke();
        return canvas.toDataURL();
    }
    checkAwsItem(checked: boolean, index: number) {
        if (this.awsCharts == null)
            this.awsCharts = new AwsHCharts("hChart_div", 300000);
        let checkItem = this.defaultDataProxy.dataArray[index];
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
        } else
            this.awsCharts.removeSeries(checkItem.name);
    }
    handVisChart(checkItem: dataFieldAttr) {
        let selectField = ["DDATETIME"], seriesData: any[] = [];
        for (let i = 0; i < checkItem.dbFields.length; i++)
            selectField.push(checkItem.dbFields[i]);
        switch (checkItem.name) {
            case "分钟":
                var starTime = new Date(this.current.getTime() - 2 * 3600000);
                this.defaultDataProxy.getDataHistory(this.obtId, selectField, checkItem.key, checkItem.timeMode, starTime, this.current, (data) => {
                    for (var i = 0, value: number, times: number, wdd: number, length = data.length; i < length; i++) {
                        times = (<string>data[i][0]).toDate().getTime();
                        value = data[i][1] / 1000;
                        seriesData.push([times, value]);
                    }
                    this.awsCharts.addSeries(checkItem.name, seriesData, this.defaultDataProxy.unit);
                });
                break;
            case "小时最低":
                var starTime = new Date(this.current.getTime() - 2 * 3600000);
                this.defaultDataProxy.getDataHistory(this.obtId, selectField, checkItem.key, checkItem.timeMode, starTime, this.current, (data) => {
                    let lastTime: number;
                    for (var i = 0, value: number, times: number, wdd: number, length = data.length; i < length; i++) {
                        let ddate = (<string>data[i][0]).toDate();
                        ddate.setMinutes(0, 0, 0);
                        times = ddate.getTime() + +data[i][2] * 60000;
                        value = data[i][1] / 1000;
                        if (lastTime != times) {
                            seriesData.push([times, value]);
                            lastTime = times;
                        }
                    }
                    this.awsCharts.addSeries(checkItem.name, seriesData, this.defaultDataProxy.unit);
                });
                break;
        }
    }
    handRainChart(checkItem: dataFieldAttr) {
        let selectField = ["DDATETIME"], seriesData: any[] = [];
        for (let i = 0; i < checkItem.dbFields.length; i++)
            selectField.push(checkItem.dbFields[i]);
        var starTime = new Date(this.current.getTime() - 3 * 3600000);
        this.defaultDataProxy.getDataHistory(this.obtId, selectField, checkItem.key, checkItem.timeMode, starTime, this.current, (data) => {
            for (var i = 0, rain: number, times: number, length = data.length; i < length; i++) {
                times = (<string>data[i][0]).toDate().getTime();
                rain = data[i][1]; 
                seriesData.push([times, rain]);
            }
            this.awsCharts.addSeries(checkItem.name, seriesData, this.defaultDataProxy.unit, "column");
        });
    }
    handTempChart(checkItem: dataFieldAttr, accuracy = 1) {
        let selectField = ["DDATETIME"], seriesData: any[] = [];
        for (let i = 0; i < checkItem.dbFields.length; i++)
            selectField.push(checkItem.dbFields[i]);
        let unit = this.defaultDataProxy.unit;
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
                this.defaultDataProxy.getDataHistory(this.obtId, selectField, checkItem.key, checkItem.timeMode, starTime, this.current, (data) => {
                    for (var i = 0, temprature: number, times: number, length = data.length; i < length; i++) {
                        times = (<string>data[i][0]).toDate().getTime();
                        temprature = data[i][1] / accuracy;
                        seriesData.push([times, temprature]);
                    }
                    this.awsCharts.addSeries(checkItem.name, seriesData, unit);
                });
                break;
            case "小时最高":
            case "小时最低":
                var starTime = new Date(this.current.getTime() - 12 * 3600000);
                this.defaultDataProxy.getDataHistory(this.obtId, selectField, checkItem.key, checkItem.timeMode, starTime, this.current, (data) => {
                    for (var i = 0, temprature: number, times: number, length = data.length; i < length; i++) {
                        let ddate = (<string>data[i][0]).toDate();
                        times = ddate.getTime() - 3600000 + +data[i][2] * 60000;
                        temprature = data[i][1] / accuracy;
                        seriesData.push([times, temprature]);
                    }
                    this.awsCharts.addSeries(checkItem.name, seriesData, unit);
                });
                break;
            case "日最高":
            case "日最低":
                selectField.splice(0, 1);
                var starTime = new Date(this.current.getTime() - 6 * 24 * 3600000);
                this.defaultDataProxy.getDataHistory(this.obtId, selectField, checkItem.key, checkItem.timeMode, starTime, this.current, (data) => {
                    for (var i = 0, temprature: number, times: number, length = data.length; i < length; i++) {
                        let ddate = (<string>data[i][1]).toDate();
                        times = ddate.getTime();
                        temprature = data[i][0] / accuracy;
                        seriesData.push([times, temprature]);
                    }
                    this.awsCharts.addSeries(checkItem.name, seriesData, unit);
                });
                break;
            case "日平均":
                var starTime = new Date(this.current.getTime() - 6 * 24 * 3600000);
                this.defaultDataProxy.getDataHistory(this.obtId, selectField, checkItem.key, checkItem.timeMode, starTime, this.current, (data) => {
                    for (var i = 0, temprature: number, times: number, length = data.length; i < length; i++) {
                        let ddate = (<string>data[i][0]).toDate();
                        times = ddate.getTime();
                        temprature = data[i][1] / accuracy;
                        seriesData.push([times, temprature]);
                    }
                    this.awsCharts.addSeries(checkItem.name, seriesData, unit);
                });
                break;
        }
    }
    handWindChart(checkItem: dataFieldAttr) {
        let selectField = ["DDATETIME"], seriesData: any[] = [];
        let tooltip = { shared: true, pointFormatter: function (this: any) { return "<br/>" + this.series.name + "风速m/s：" + this.y + "  风向∠：" + this.dd; } };
        for (let i = 0; i < checkItem.dbFields.length; i++)
            selectField.push(checkItem.dbFields[i]);
        let starTime: Date;
        switch (checkItem.name) {
            case "2M":
            case "10M":
            case "瞬时风":
            case "小时极大风":
                starTime = new Date(this.current.getTime() - 2 * 3600000);
            case "小时最大10M":
                if (!starTime)
                    starTime = new Date(this.current.getTime() - 12 * 3600000);
                this.defaultDataProxy.getDataHistory(this.obtId, selectField, checkItem.key, checkItem.timeMode, starTime, this.current, (data) => {
                    for (var i = 0, wdf: number, times: number, wdd: number, length = data.length; i < length; i++) {
                        times = (<string>data[i][0]).toDate().getTime();
                        wdf = data[i][1];
                        wdd = data[i][2];
                        seriesData.push({ x: times, y: wdf, dd: wdd, marker: { symbol: "url(" + this.getArrowImgUrl(wdf, wdd) + ")" } });
                    }
                    this.awsCharts.addSeries(checkItem.name, seriesData, this.defaultDataProxy.unit, "line", null, { tooltip: tooltip });
                });
                break;
            case "日最大10M":
            case "日最大瞬时风":
                selectField.splice(0, 1);
                starTime = new Date(this.current.getTime() - 6 * 24 * 3600000);
                this.defaultDataProxy.getDataHistory(this.obtId, selectField, checkItem.key, checkItem.timeMode, starTime, this.current, (data) => {
                    for (var i = 0, wdf: number, times: number, wdd: number, length = data.length; i < length; i++) {
                        times = (<string>data[i][2]).toDate().getTime();
                        wdf = data[i][0] ;
                        wdd = data[i][1];
                        seriesData.push({ x: times, y: wdf, dd: wdd, marker: { symbol: "url(" + this.getArrowImgUrl(wdf, wdd) + ")" } });
                    }
                    this.awsCharts.addSeries(checkItem.name, seriesData, this.defaultDataProxy.unit, "line", null,  { tooltip: tooltip });
                });
                break;
        }
    }
}

export class awsHours extends aws {
    awsCharts = new AwsHCharts("hChart_compdiv");
    //小时极大风
    wd3smaxdf(checked: boolean) {
        let name = "小时极大风";
        if (checked) {
            var dataProxy = getDataProxy("WIND");
            var starTime = new Date(this.current.getTime() - 24 * 3600000);
            dataProxy.getDataHistory(this.obtId, ["DDATETIME", "WD3SMAXDF", "WD3SMAXDD", "WD3SMAXTIME"], "WD3SMAXDF", 1, starTime, this.current, (data) => {
                let seriesData = [];
                for (var i = 0, d: any[]; i < data.length; i++) {
                    d = data[i];
                    let times = d[0].toString().toDate().getTime();
                    times = times - 3600000 + d[3] * 60000;
                    seriesData.push([times, d[1]]);
                }
                this.awsCharts.addSeries(name, seriesData, dataProxy.unit);
            });
        } else
            this.awsCharts.removeSeries(name);
    }
    //本小时最高最低温
    tempEdge(checked: boolean, dateField: string) {
        let name: string;
        if (dateField == "MINT") name = "小时最低温度";
        else if (dateField == "MAXT") name = "小时最高温度";
        if (checked) {
            var dataProxy = getDataProxy("TEP");
            var starTime = new Date(this.current.getTime() - 24 * 3600000);
            dataProxy.getDataHistory(this.obtId, ["DDATETIME", dateField, dateField + "TIME"], dateField, 1, starTime, this.current, (data) => {
                let minValue: number, seriesData = [];
                for (var i = 0, d: any[]; i < data.length; i++) {
                    d = data[i];
                    let times = d[0].toString().toDate().getTime();
                    times = times - 3600000 + d[2] * 60000;
                    seriesData.push([times, d[1]]);
                    if (minValue == null || minValue > d[1])
                        minValue = d[1];
                }
                this.awsCharts.addSeries(name, seriesData, dataProxy.unit, "line", { min: minValue });
            });
        } else
            this.awsCharts.removeSeries(name);
    }
    //小时累积雨量
    rainHour(checked: boolean) {
        let name = "小时累积雨量";
        if (checked) {
            var dataProxy = getDataProxy("RAIN");
            var starTime = new Date(this.current.getTime() - 24 * 3600000);
            dataProxy.getDataHistory(this.obtId, ["DDATETIME", "HOURR"], "HOURR", 1, starTime, this.current, (data) => {
                let seriesData = [];
                for (var i = 0, d: any[]; i < data.length; i++) {
                    d = data[i];
                    d[0] = d[0].toString().toDate();
                    seriesData.push([d[0].getTime(), d[1]]);
                }
                this.awsCharts.addSeries(name, seriesData, dataProxy.unit, "column");
            });
        } else
            this.awsCharts.removeSeries(name);
    }
    //小时最高最低气压
    pressureEdge(checked: boolean, dateField: string) {
        let name: string;
        if (dateField == "MINP") name = "小时最低气压";
        else if (dateField == "MAXP") name = "小时最高气压";
        if (checked) {
            var dataProxy = getDataProxy("PRE");
            var starTime = new Date(this.current.getTime() - 24 * 3600000);
            dataProxy.getDataHistory(this.obtId, ["DDATETIME", dateField, dateField + "TIME"], dateField, 1, starTime, this.current, (data) => {
                let seriesData = [];
                for (var i = 0, d: any[]; i < data.length; i++) {
                    d = data[i];
                    let times = d[0].toString().toDate().getTime();
                    times = times - 3600000 + d[2] * 60000;
                    seriesData.push([times, d[1]]);
                }
                this.awsCharts.addSeries(name, seriesData, dataProxy.unit);
            });
        } else
            this.awsCharts.removeSeries(name);
    }
}