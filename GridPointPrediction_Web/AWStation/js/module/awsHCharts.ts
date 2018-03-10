//自动站小时统计图表
import * as Charts from "util/hCharts";
export default class {
    hoursCharts: __Highcharts.ChartObject;
    constructor(renderTo: string, tickInterval = 3600000) {
        var tooltip = { shared: true };
        var legend = { layout: 'horizontal', align: 'right', verticalAlign: 'top', floating: true };
        var xAxis = [{
            type: "ddtime", tickInterval: tickInterval,
            dateTimeLabelFormats: {
                second: '%H:%M:%S', minute: '%H:%M',
                hour: '%H:%M', day: '%b%e日',
                week: '%e. %b', month: '%y.%b'
            }
        }];
        this.hoursCharts = Charts.hCharts({
            chart: { renderTo: renderTo, spacing: [15, 10, 0, 0] },
            title: { text: "" },
            tooltip: tooltip,
            legend: legend,
            xAxis: xAxis,
            yAxis: [{ title: { text: "" } }],
            noData: {
                style: {
                    fontWeight: 'bold',
                    fontSize: '15px',
                    color: '#303030'
                }
            }
        }, Charts.myGridStyle);
    }
    addSeries(name: string, data: any[], unit: string, chartsType ="line",  axisOptions?: __Highcharts.AxisOptions, seriesOptions?: __Highcharts.SeriesOptions) {
        var endTime = new Date(), starTime = new Date();
        starTime.setHours(starTime.getHours() - 24);
        var yAxisIndex = -1;
        let min = axisOptions ? axisOptions.min : null;
        for (let i = 0, yAxis: __Highcharts.AxisObject; i < this.hoursCharts.yAxis.length; i++) {
            yAxis = this.hoursCharts.yAxis[i];
            if (yAxis.options["unit"] == unit) {
                yAxisIndex = i;
                if (yAxis.options["min"] > min)
                    yAxis.update({ min: min });
                break;
            }
        }
        if (yAxisIndex == -1) {
            var yAxis: { [x: string]: any } = { unit: unit, title: { text: "" }, labels: { formatter: function (this: any) { if (this.value == this.axis.max) return unit + "<br/>" + this.value; return this.value; } } };
            if (min) yAxis["min"] = min;
            this.hoursCharts.addAxis(yAxis, false);
            yAxisIndex = this.hoursCharts.yAxis.length - 1;
        }
        var series: __Highcharts.SeriesOptions = { name: name, type: chartsType, data: data, yAxis: yAxisIndex };
        let tooltip = seriesOptions ? seriesOptions.tooltip : null;
        if (tooltip)
            series.tooltip = tooltip;
        this.hoursCharts.addSeries(series);
    }
    removeSeries(name: string) {
        for (var i in this.hoursCharts.series) {
            if (this.hoursCharts.series[i].name == name) {
                this.hoursCharts.series[i].remove();
                break;
            }
        }
    }
    clearSeries() {
        while (this.hoursCharts.series.length > 0) {
            this.hoursCharts.series[this.hoursCharts.series.length - 1].remove();
        }
    }
}