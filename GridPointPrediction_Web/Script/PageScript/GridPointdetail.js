
$(function () {
    require.config({
        paths: {
            echarts: '../../Script/Charts/build/dist'
        }
    });
    $("#Point").click(function () {
        doloaData();
        DrawPicture();
        WebMethod.callBack("getTideHigh", { dateTime: "" }, function (msg) {
            var html = "";
            $(".weather").html(html);
            html+="<div id='meanpic' style='width:800px;height:80px;margin:auto;'>"
            if (msg != "") {
                for (var i = 0; i < msg.length; i++) {
                    var cl = msg[i].time + "|Ton" + (i + 1);
                    html += "<div onclick=\"doGetdata('" + cl + "')\" id=Ton" + (i + 1) + " style='cursor: pointer;float:left;width:100px;height:80px;background: #8bbfea;'><label style=\"text-align: center;width: 100px;height: 35px;line-height: 35px;\">" + msg[i].forecast + "</label><label style='text-align: center;width: 100px;height: 35px;line-height: 35px;'>" + msg[i].mintemp + "-" + msg[i].maxtemp + "</label><input type='hidden' value='" + msg[i].time + "'/></div><span style='width:10px;height:80px;float:left;'></span>";
                }
                html += "</div>";
                $(".weather").append(html);
                $("#meanpic div").bind("click", function () { });
                //默认
                $("#Ton1").css("background", "#1abc9c");
                $("#Ton1").css("color", "#fff");
            }
            else {
            }

        });
    });


    //  $("#meanpic div").click(function () {
    doGetdata = function (value) {
        var divId = value.split('|')[1];
        for (var i = 1; i <= 7; i++) {
            $("#Ton" + i).css("background", "#8bbfea");
            $("#Ton" + i).css("color", "");
        }
        $("#" + divId).css("background", "#1abc9c");
        $("#" + divId).css("color", "#fff");
        WebMethod.callBack("GetforecastData", { day: divId.substring(3, 4), forTime: $("#" + divId + " input").val() }, function (msg) {
            datatemp = new Array;
            dataHumit = new Array;
            dataWind = new Array;
            ybsx = new Array;
           for (var i = 0; i < msg.length; i++) {
                 dataHumit[i] = msg[i].maxtemp;
                 dataWind[i] = msg[i].wether;
                datatemp[i] = msg[i].mintemp;
                ybsx[i] = msg[i].forecast;
           }
            Hybsx = new Array;
            wybsx = new Array;
            dataHumitof = new Array;
            dataWindof = new Array;
            if (value.split('|')[1].substring(3, 4) == 2 || value.split('|')[1].substring(3, 4) == 3) {
                var flag=0;
                for (var d = 0; d < dataHumit.length; d = d + 3) {
 
                        Hybsx[flag] = wybsx[flag] = ybsx[d];
                        dataHumitof[flag] = dataHumit[d];
                        dataWindof[flag] = dataWind[d];
                        flag = flag + 1;
                }
           }
           else
            {
                Hybsx = wybsx = ybsx;
                dataHumitof = dataHumit;
                dataWindof = dataWind;
           }
            DrawPicture();
        })
        // var time = $("." + divId + " label").eq(0).text() + " " + $("." + divId + " label").eq(1).text();
        // });
    }

});

doGetdata = function () {
    var id = this.id;
}

var Hybsx = new Array;
var wybsx = new Array;
var dataHumitof = new Array;
var dataWindof = new Array;

var datatemp = new Array;
var dataHumit = new Array;
var dataWind = new Array;
var ybsx = new Array;
doloaData=function(){
    WebMethod.callBack("getdata", { dateTime: "" }, function (msg) {
        if (msg != "") {
            for (var i = 0; i < msg.length; i++) {
                datatemp[i] = msg[i].mintemp;
               dataHumitof[i]= dataHumit[i] = msg[i].maxtemp;
               dataWindof[i]= dataWind[i] = msg[i].wether;
               Hybsx[i]=wybsx[i]= ybsx[i] = msg[i].forecast;
            }
        }
    });
}

DrawPicture = function () {
    require(
[
     'echarts',
        'echarts/chart/line' // 使用线状图就加载line模块，按需加载
        , 'echarts/chart/bar' // 使用柱状图就加载bar模块，按需加载
],
    function (ec) {
        var myChart = ec.init(document.getElementById('tempPicture'));
        var myChartH = ec.init(document.getElementById('humitPicture'));
        var myChartW = ec.init(document.getElementById('windPicture'));

        var Hoption = {
            tooltip: {
                trigger: 'axis'
            },
            //legend: {
            //    data: ['相对湿度']
            //},
            toolbox: {
                show: true,
            },
            calculable: true,
            xAxis: [
                {
                    type: 'category',
                    boundaryGap: false,
                    data: Hybsx
                }
            ],
            yAxis: [
                {
                    name: '相对湿度',

                    type: '{value}%'
                }
            ],
            series: [
                {
                    name: '相对湿度',
                    type: 'line',
                    //stack: '总量',
                    itemStyle: {
                        normal: {
                            color: '#00FF00',
                            lineStyle: {
                                color: 'blue'
                            }
                        }
                    },
                    data: dataHumitof
                }
            ]
        }
        myChartH.setOption(Hoption);

        var Woption = {
            tooltip: {
                trigger: 'axis'
            },
            //legend: {
            //    data: ['风']
            //},
            toolbox: {
                show: true,
            },
            calculable: true,
            xAxis: [
                {
                    type: 'category',
                    boundaryGap: false,
                    data: wybsx
                }
            ],
            yAxis: [
                {
                    name: '风速',

                    type: 'value'
                }
            ],
            series: [
                {
                    name: '风',
                    type: 'line',
                    //stack: '总量',
                    itemStyle: {
                        normal: {
                            color: '#00FF00',
                            lineStyle: {
                                color: 'green'
                            }
                        }
                    },
                    data: dataWindof
                }
            ]

        }
        myChartW.setOption(Woption);

        var option = {
            tooltip: {
                trigger: 'axis',
            },
            //legend: {
            //    data: ['气温']
            //},
            toolbox: {
                show: true,
                //feature: {
                //    mark: { show: true },
                //    dataView: { show: true, readOnly: false },
                //    magicType: { show: true, type: ['line', 'bar', 'stack', 'tiled'] },
                //    restore: { show: true },
                //    saveAsImage: { show: true }
                //}
            },
            calculable: true,
            xAxis: [
                {
                    type: 'category',
                    boundaryGap: false,
                    data: ybsx
                }
            ],
            yAxis: [
                {
                    name: '气温',
                    min: 10,
                    max: 45,
                    type: '{value}°C'
                }
            ],
            series: [
                {
                    name: '气温',
                    type: 'line',
                    //stack: '总量',
                    itemStyle: {
                        normal: {
                            color: '#00FF00',
                            lineStyle: {
                                color: 'red'
                            }
                        }
                    },
                    data: datatemp
                }
            ]
        }
        myChart.setOption(option);
    }
    );
}


$(function () {

    $("#Point").click(function () {
        ShowMes_Max();
    });
});

//显示弹窗曾
function ShowMes_Max() {
    $('#SinglePoint').removeAttr('class')
    openpage = layer.open({
        type: 1,
        title: '格点天气趋势图',
        skin: 'layui-layer-rim', //加上边框
        area: ['900px', '100%'], //宽高
        offset: [0, 0],
        fixed: false,
        content: $("#SinglePoint")
    });
    $(".layui-layer-content").css("overflow-x", "hidden");
}