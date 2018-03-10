import "library/Highcharts-4.1.8/js/highcharts";
import "library/Highcharts-4.1.8/js/modules/no-data-to-display";
Highcharts.setOptions({
    lang: {
        months: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
        shortMonths: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
        weekdays: ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'],
        noData: '暂无数据'
    }, global: { useUTC: false }
});
export function hCharts(attr: __Highcharts.Options, style?: { [x: string]: any }) {
    var addTheme = function(src: { [x: string]: any }, _style: { [x: string]: any }) {
        for (var a in _style) {
            if (src[a] == undefined)
                src[a] = _style[a];
            else {
                if (src[a] instanceof Array) {
                    for (var i = 0; i < src[a].length; i++)
                        addTheme(src[a][i], _style[a]);
                } else if (typeof _style[a] == "object")
                    addTheme(src[a], _style[a]);
            }
        }
    }
    if (style) addTheme(attr, style);
    attr.credits = { enabled: false };
    attr.chart.zoomType = 'xy';
    if (attr.chart.options3d)
        require(["/js/library/Highcharts-4.1.8/js/highcharts-3d.js"], function() { new Highcharts.Chart(attr); });
    else
        return new Highcharts.Chart(attr);
}
export var myGridStyle = {
    chart: {
        zoomType: 'xy',
        backgroundColor: { linearGradient: { x1: 0, y1: 0, x2: 1, y2: 1 }, stops: [[0, 'rgb(255, 255, 255)'], [1, 'rgb(240, 240, 255)']] }, borderWidth: 0, plotBackgroundColor: 'rgba(255, 255, 255, .9)',
        plotShadow: true, plotBorderWidth: 1
    },
    title: { style: { color: '#000', font: 'bold 16px "Trebuchet MS", Verdana, sans-serif' } },
    subtitle: { style: { color: '#666666', font: 'bold 12px "Trebuchet MS", Verdana, sans-serif' } },
    xAxis: {
        gridLineWidth: 1, lineColor: '#000', tickColor: '#000',
        labels: { style: { color: '#000', font: '11px Trebuchet MS, Verdana, sans-serif' } },
        title: { style: { color: '#333', fontWeight: 'bold', fontSize: '12px', fontFamily: 'Trebuchet MS, Verdana, sans-serif' } }
    },
    yAxis: {
        gridLineColor: function() { return '#f00'; },
        minorTickInterval: 'auto', lineColor: '#000',
        lineWidth: 1, tickWidth: 1, tickColor: '#000',
        labels: { style: { color: '#000', font: '11px Trebuchet MS, Verdana, sans-serif' } },
        title: { style: { color: '#333', fontWeight: 'bold', fontSize: '12px', fontFamily: 'Trebuchet MS, Verdana, sans-serif' } }
    },
    legend: {
        itemStyle: { font: '9pt Trebuchet MS, Verdana, sans-serif', color: 'black' },
        itemHoverStyle: { color: '#039' },
        itemHiddenStyle: { color: 'gray' }
    },
    labels: { style: { color: '#99b' } },
    navigation: { buttonOptions: { theme: { stroke: '#CCCCCC' } } }
};

