var AreaName = "FTArea";
var ForecastType = "Rain";
var TypeName = "降雨(mm)";
var ForecastId = "Forecast6";
var butList = "FTArea;";
var Sm_AreaInfoList;
var DtPage;
var StrTable = "";
var AreaList = "";

$(function () {
    require.config({
        paths: {
            echarts: '../../Script/Charts/build/dist'
        }
    });
    GetAreaAll();//取得所有区域id
    $("#ForecastTime").val((new Date()).format("yyyy-MM-dd"));

    DtPage = $("#ForecastTime").val();
    GetAllForInfo();
    //图标
    GetchartsData(AreaName, ForecastId, ForecastType, DtPage);
    //数据
    DayFData(AreaName, ForecastId, DtPage);

    $("#" + ForecastId).attr("style", "background-color: red; border: 1px solid red;color:white")
    $("#" + ForecastType).attr("style", "background-color: red; border: 1px solid red;color:white")
    $("#" + AreaName).attr("style", "background-color: red; border: 1px solid red;color:white")

    $("#ForecastPeriod ul li button").click(function () {
        ForecastId = this.id;
        DtPage = $("#ForecastTime").val();
        $(".txtdate ul li button").attr("style", "color: #fff;background-color: #428bca;border-color: #357ebd;")
        $("#" + ForecastId).attr("style", "background-color: red; border: 1px solid red;")

        // GetChartAndData(AreaName, ForecastId, ForecastType, DtPage);
        //图表和数据
        GetchartsData(AreaName, ForecastId, ForecastType, DtPage);
        DayFData(AreaName, ForecastId, DtPage);
    });

    $("#ForecastType ul li button").click(function () {
        ForecastType = this.id;
        DtPage = $("#ForecastTime").val();
        TypeName = document.getElementById(this.id).innerText;
        $("#ForecastType ul li button").attr("style", "color: #fff;background-color: #E6F0F9;border-color: #357ebd;color:#306DA8")
        $("#" + ForecastType).attr("style", "background-color: red; border: 1px solid red;color:white")

        GetChartAndData(AreaName, ForecastId, ForecastType, DtPage);
    });

    $("#ForecastZone ul li button").click(function () {
        var obj = document.getElementById("LisQY");
        if (this.id != "FTArea" && obj.length == 0) {
            obj.options.add(new Option("福田区", AreaName));
            $("#LisQY").removeAttr("disabled");
            $("#copyQY").removeAttr("disabled");
        }
        AreaName = this.id;
        DtPage = $("#ForecastTime").val();
        $("#ForecastZone ul li button").attr("style", "color: #fff;background-color: #E6F0F9;border-color: #357ebd;color:#306DA8")

        SetBackColor(this.id, this.innerText);
        GetChartAndData(AreaName, ForecastId, ForecastType, DtPage);
    });

    //复制区域数据
    $("#copyQY").click(function () {
        var tagArea = GetAreaIndex(AreaName);
        var area = GetAreaIndex($("#LisQY").val());

        for (var i = 0; i < Sm_AreaInfoList[area].length; i++) {

            Sm_AreaInfoList[tagArea][i].YBSX = Sm_AreaInfoList[area][i].YBSX;
            Sm_AreaInfoList[tagArea][i].Rain = Sm_AreaInfoList[area][i].Rain;
            Sm_AreaInfoList[tagArea][i].Rain2 = Sm_AreaInfoList[area][i].Rain2;
            Sm_AreaInfoList[tagArea][i].T2m = Sm_AreaInfoList[area][i].T2m;
            Sm_AreaInfoList[tagArea][i].T2m2 = Sm_AreaInfoList[area][i].T2m2;
            Sm_AreaInfoList[tagArea][i].Rhsfc = Sm_AreaInfoList[area][i].Rhsfc;
            Sm_AreaInfoList[tagArea][i].Wspd10m = Sm_AreaInfoList[area][i].Wspd10m;
            Sm_AreaInfoList[tagArea][i].Forecasttime = Sm_AreaInfoList[area][i].Forecasttime;
        }
        var dt = new Date((Sm_AreaInfoList[tagArea][0].Forecasttime)).format("yyyy-MM-dd HH:mm");
        //图标刷新 
        DataBindRainEch(AreaName, ForecastType, dt, GetData(Sm_AreaInfoList[tagArea]));
        //数据刷新
        DayForecastData(AreaName, ForecastId, Sm_AreaInfoList[tagArea]);
    });
    $("#ZoneShow").click(function () {
        $(".realsePage").css("display", "block");
        $("#Max").css("display", "none");
    });
});

function DateSelect() {
    DtPage = $("#ForecastTime").val();
    //图表和数据
    GetchartsData(AreaName, ForecastId, ForecastType, DtPage);
    DayFData(AreaName, ForecastId, DtPage);
}

function SetBackColor(id, name) {
    if (butList.indexOf(id) < 0) {
        butList += id + ";";
        var obj = document.getElementById("LisQY");
        obj.options.add(new Option(name, id)); //添加复制区域数据下拉项
    }

    var count = butList.split(';').length;
    for (var i = 0; i < count; i++) {
        var tmp = butList.split(';')[i];
        if (tmp != "")
            $("#" + tmp).attr("style", "background-color: green;color:white");
    }
    if (count > 11)
        $("#ZoneShow").removeAttr("disabled");//预览功能开启

    $("#" + id).attr("style", "background-color: red; border: 1px solid red;color:white")
}

function GetAllForInfo() {
    common.prototype.webService("GetAllForInfo", { AreaList: AreaList, ForecastId: ForecastId, DtPage: DtPage }, function (res) {
        if (res != null && res.length > 0)
            Sm_AreaInfoList = JSON.parse(JSON.stringify(res));
        else
            Sm_AreaInfoList = null;
    });
}

function GetChartAndData(AreaName, ForecastId, ForecastType, DtPage) {
    //预报起始时间
    var dt = new Date((Sm_AreaInfoList[GetAreaIndex(AreaName)][0].Forecasttime)).format("yyyy-MM-dd HH:mm");

    DataBindRainEch(AreaName, ForecastType, dt, GetData(Sm_AreaInfoList[GetAreaIndex(AreaName)]));
    DayForecastData(AreaName, ForecastId, Sm_AreaInfoList[GetAreaIndex(AreaName)]);

}

function GetchartsData(AreaName, ForecastId, ForecastType, DtPage) {
    common.prototype.webService("GetAllForInfo", { AreaList: AreaList, ForecastId: ForecastId, DtPage: DtPage }, function (res) {
        if (res != null && res.length > 0) {
            Sm_AreaInfoList = JSON.parse(JSON.stringify(res));
            var dt = new Date((Sm_AreaInfoList[GetAreaIndex(AreaName)][0].Forecasttime)).format("yyyy-MM-dd HH:mm");

            DataBindRainEch(AreaName, ForecastType, dt, GetData(res[GetAreaIndex(AreaName)]));

            $("#ChartT").show();
        } else {
            $("#ChartT").hide();
        }
    });
}

function GetData(res) {
    var DataTmp = [];
    var RainData = [];
    var TemptureData = [];
    var HumidityData = [];
    var WindData = [];
    // var str = "";
    for (var i = 0; i < res.length ; i++) {
        RainData.push(res[i].Rain);
        TemptureData.push(res[i].T2m);
        HumidityData.push(res[i].Rhsfc);
        WindData.push(res[i].Wspd10m);
        //  str += TemptureData[i] + "--";
    }
    switch (ForecastType) {
        case "Rain":
            DataTmp = RainData;
            break;
        case "Tempture":
            DataTmp = TemptureData;
            break;
        case "Humidity":
            DataTmp = HumidityData;
            break;
        case "Wind":
            DataTmp = WindData;
            break;
    }
    return DataTmp;
}
//用Echarts控件加信息
function DataBindRainEch(AreaName, ForecastType, dt, dataTmp) {
    require(
   [
        'echarts',
           'echarts/chart/line' // 使用线状图就加载line模块，按需加载
           , 'echarts/chart/bar' // 使用柱状图就加载bar模块，按需加载
   ],
   function (ec) {
       // 基于准备好的dom，初始化echarts图表
       var myChart = ec.init(document.getElementById('ChartT'));
       var option = {
           title: {
               text: '中央指导预报  起报时间：' + dt,
               x: 'center'
           },
           grid: {
               x: '5%',
               y: '23%',
               width: '1350px'
           },
           tooltip: {
               trigger: 'axis'
           },
           legend: {
               x: 'center',
               y: 'bottom',
               data: [TypeName + "  -  24小时  "]
           },
           calculable: true,
           xAxis: [
                       {
                           type: 'category',
                           boundaryGap: true,
                           data: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11',
                            '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24']
                       }
           ],
           yAxis: [
                   {
                       type: 'value',
                       name: TypeName,
                       splitNumber: 4,
                       axisLabel: {
                           formatter: '{value}'
                       }
                   }
           ],
           series: [
               {
                   name: TypeName,
                   type: 'line',
                   color: 'blue',
                   smooth: true,
                   itemStyle: {
                       normal: {
                           label: {
                               show: true, textStyle: {
                                   fontWeight: "bolder",
                                   color: "blue"
                               }
                           }
                       }
                   },
                   data: dataTmp
               }
           ]
       };
       myChart.setOption(option);
   }
);
}

function DayFData(AreaName, ForecastId, DtPage) {
    common.prototype.webService("GetAllForInfo", { AreaList: AreaList, ForecastId: ForecastId, DtPage: DtPage }, function (res) {
        if (res != null && res.length > 0) {
            Sm_AreaInfoList = JSON.parse(JSON.stringify(res));
            DayForecastData(AreaName, ForecastId, res[GetAreaIndex(AreaName)]);
        } else
            $("#DataShow").hide();
    });
}
//TODO
function DayForecastData(AreaName, ForecastId, res) {
    if (res != null && res.length > 0) {
        var StrTable = "<table id=\"DayTableInfo\"><tr><th style='width:100px;'>时间</th><th>(系统订正)降水量mm</th><th>(预报员制作)降水量mm</th><th>(订正)温度℃</th><th>(预报员制作)温度℃</th><th>相对湿度(%)</th><th>风速(m/s)</th></tr>";

        for (var i = 0; i < res.length; i++) {
            var date = new Date((res[i].Forecasttime)).format("yyyy年MM月dd日 HH:mm");
            if ((i + 1) % 2 != 0)
                StrTable += "<tr style='background-color:#E9F1F4'><td style='width:160px;'>" + date + "</td><td><input id=Rain0-" + (i) + " onblur=\"input_blur('Rain0-" + (i) + "')\" onfocus=\"input_click('Rain0-" + (i) + "')\" value= " + res[i].Rain + " style='background:#E9F1F4;width: 100%;height: 100%;float: left;text-align: center;border: 1px solid #fff;'></td><td><lable id=Rain1-" + (i) + "style='background:#E9F1F4;width: 100%;height: 100%;float: left;text-align: center;border: 1px solid #fff;'>" + res[i].Rain2 + "</lable></td><td><input id=Tempture0-" + i + " onblur=\"input_blur('Tempture0-" + (i) + "')\" onfocus=\"input_click('Tempture0-" + (i) + "')\" value= " + res[i].T2m + " style='background:#E9F1F4;width: 100%;height: 100%;float: left;text-align: center;border: 1px solid #fff;'></td><td><lable id=Tempture1-" + (i) + "style='background:#E9F1F4;width: 100%;height: 100%;float: left;text-align: center;border: 1px solid #fff;'>" + res[i].T2m2 + "</lable></td><td><input id=Humidity0-" + (i) + " onblur=\"input_blur('Humidity0-" + (i) + "')\" onfocus=\"input_click('Humidity0-" + (i) + "')\" value= " + res[i].Rhsfc + " style='background:#E9F1F4;width: 100%;height: 100%;float: left;text-align: center;border: 1px solid #fff;'></td><td><input id=Wind0-" + (i) + " onblur=\"input_blur('Wind0-" + (i) + "')\" onfocus=\"input_click('Wind0-" + (i) + "')\" value= " + res[i].Wspd10m + " style='background:#E9F1F4;width: 100%;height: 100%;float: left;text-align: center;border: 1px solid #fff;'></td></tr>";
            else
                StrTable += "<tr style='background-color:#FFFFFF'><td style='width:160px;'>" + date + "</td><td><input id=Rain0-" + (i) + " onblur=\"input_blur('Rain0-" + (i) + "')\" onfocus=\"input_click('Rain0-" + (i) + "')\" value= " + res[i].Rain + " style='background:#FFFFFF;width: 100%;height: 100%;float: left;text-align: center;border: 1px solid #fff;'></td><td><lable id=Rain1-" + (i) + "style='background:#E9F1F4;width: 100%;height: 100%;float: left;text-align: center;border: 1px solid #fff;'>" + res[i].Rain2 + "</lable></td><td><input id=Tempture0-" + i + " onblur=\"input_blur('Tempture0-" + (i) + "')\" onfocus=\"input_click('Tempture0-" + (i) + "')\" value= " + res[i].T2m + " style='background:#FFFFFF;width: 100%;height: 100%;float: left;text-align: center;border: 1px solid #fff;'></td><td><lable id=Tempture1-" + (i) + "style='background:#E9F1F4;width: 100%;height: 100%;float: left;text-align: center;border: 1px solid #fff;'>" + res[i].T2m2 + "</lable></td><td><input id=Humidity0-" + (i) + " onblur=\"input_blur('Humidity0-" + (i) + "')\" onfocus=\"input_click('Humidity0-" + (i) + "')\" value= " + res[i].Rhsfc + " style='background:#FFFFFF;width: 100%;height: 100%;float: left;text-align: center;border: 1px solid #fff;'></td><td><input id=Wind0-" + (i) + " onblur=\"input_blur('Wind0-" + (i) + "')\" onfocus=\"input_click('Wind0-" + (i) + "')\" value= " + res[i].Wspd10m + " style='background:#FFFFFF;width: 100%;height: 100%;float: left;text-align: center;border: 1px solid #fff;'></td></tr>";
        }
        StrTable += "</table>";
        $("#DataShow").html(StrTable);
        $("#DataShow").show();
    } else {
        $("#DataShow").hide();
    }
}

//input改为可编辑状态
function input_click(value) {
    $("#" + value).css("border", "1px solid green");
    var type = value.split('0-')[0];
    if (type != ForecastType) {
        ForecastType = type;
        $("#ForecastType ul li button").attr("style", "background-color: #E6F0F9;border-color: #357ebd;color:#306DA8")
        $("#" + ForecastType).attr("style", "background-color: red; border: 1px solid red;color:white")

        switch (ForecastType) {
            case "Rain":
                TypeName = "降雨(mm)";
                break;
            case "Tempture":
                TypeName = "温度(℃)";
                break;
            case "Humidity":
                TypeName = "湿度(%)";
                break;
            case "Wind":
                TypeName = "风速(m/s)";
                break;
        }
        //TODO
        DataBindRainEch(AreaName, ForecastType, DtPage, GetData(Sm_AreaInfoList[AreaIndex]));
    }
}

function input_blur(value) {
    $("#" + value).css("background", "#63b363");
    $("#" + value).css("border", "1px solid #fff");
    var indexName = value.split('-')[0];
    var index = value.split('-')[1];
    var AreaIndex = GetAreaIndex(AreaName);

    switch (indexName) {
        case "Rain0":
            Sm_AreaInfoList[AreaIndex][index].Rain = $("#" + value).val();
            break;
        case "Tempture0":
            Sm_AreaInfoList[AreaIndex][index].T2m = $("#" + value).val();
            break;
        case "Humidity0":
            Sm_AreaInfoList[AreaIndex][index].Rhsfc = $("#" + value).val();
            break;
        case "Wind0":
            Sm_AreaInfoList[AreaIndex][index].Wspd10m = $("#" + value).val();
            break;
    }
    var dt = new Date((Sm_AreaInfoList[GetAreaIndex(AreaName)][0].Forecasttime)).format("yyyy-MM-dd HH:mm");
    DataBindRainEch(AreaName, ForecastType, dt, GetData(Sm_AreaInfoList[AreaIndex]));
}

function GetAreaAll() {
    $("#ForecastZone ul li button").attr("name", "ForTypeName");
    var ForTypeName = document.getElementsByName("ForTypeName");
    if (ForTypeName.length > 0)
        for (var i = 0; i < ForTypeName.length ; i++) {
            AreaList += ForTypeName[i].id + "-" + i + ";";
        }
}

function GetAreaIndex(area) {
    var Ret = 0;
    if (AreaList.length > 0)
        for (var i = 0; i < AreaList.split(';').length ; i++) {
            var areaN = (AreaList.split(';')[i]).split('-')[0];
            if (area == areaN)
                Ret = i;
        }
    return Ret;
}

canlle_buuton = function () {
    $(".realsePage").css("display", "none");
    $("#Max").css("display", "block");
}

realse_button = function () {
    if (confirm("确认发布")) {
        //$.post("/WebService.asmx/insertSaveDate", { realseTime: weathertime, realseUser: $("#cbUser").val() }, function (result) {
        //    if (result != undefined && result != "") {
        //        if (result) {
        //            layer.msg("发布成功");
        //        }
        //        else {
        //            layer.msg("发布失败");
        //        }
        //    }
        //});
    }
}