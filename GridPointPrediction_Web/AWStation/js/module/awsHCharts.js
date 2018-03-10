define(["require", "exports", "util/hCharts"], function (require, exports, Charts) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var default_1 = (function () {
        function default_1(renderTo, tickInterval) {
            if (tickInterval === void 0) { tickInterval = 3600000; }
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
        default_1.prototype.addSeries = function (name, data, unit, chartsType, axisOptions, seriesOptions) {
            if (chartsType === void 0) { chartsType = "line"; }
            var endTime = new Date(), starTime = new Date();
            starTime.setHours(starTime.getHours() - 24);
            var yAxisIndex = -1;
            var min = axisOptions ? axisOptions.min : null;
            for (var i = 0, yAxis_1; i < this.hoursCharts.yAxis.length; i++) {
                yAxis_1 = this.hoursCharts.yAxis[i];
                if (yAxis_1.options["unit"] == unit) {
                    yAxisIndex = i;
                    if (yAxis_1.options["min"] > min)
                        yAxis_1.update({ min: min });
                    break;
                }
            }
            if (yAxisIndex == -1) {
                var yAxis = { unit: unit, title: { text: "" }, labels: { formatter: function () { if (this.value == this.axis.max)
                            return unit + "<br/>" + this.value; return this.value; } } };
                if (min)
                    yAxis["min"] = min;
                this.hoursCharts.addAxis(yAxis, false);
                yAxisIndex = this.hoursCharts.yAxis.length - 1;
            }
            var series = { name: name, type: chartsType, data: data, yAxis: yAxisIndex };
            var tooltip = seriesOptions ? seriesOptions.tooltip : null;
            if (tooltip)
                series.tooltip = tooltip;
            this.hoursCharts.addSeries(series);
        };
        default_1.prototype.removeSeries = function (name) {
            for (var i in this.hoursCharts.series) {
                if (this.hoursCharts.series[i].name == name) {
                    this.hoursCharts.series[i].remove();
                    break;
                }
            }
        };
        default_1.prototype.clearSeries = function () {
            while (this.hoursCharts.series.length > 0) {
                this.hoursCharts.series[this.hoursCharts.series.length - 1].remove();
            }
        };
        return default_1;
    }());
    exports.default = default_1;
});
