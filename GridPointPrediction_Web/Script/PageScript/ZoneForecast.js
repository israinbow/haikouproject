var AreaName = "FTArea";
var ForecastType = "Rain";
var TypeName = "降雨(mm)";
var ForecastId = "Forecast6";
var butList = "FTArea;";
var Sm_AreaInfoList;
var DtPage;
var StrTable = "";
var AreaList = "";
var indexShow = 0;
var dataTime;

$(function () {
    require.config({
        paths: {
            echarts: '../../Script/Charts/build/dist'
        }
    });
    GetAreaAll();//取得所有区域id
    SetPeriod();

    var obj = document.getElementById("LisQY");
    obj.options.add(new Option($("#ForecastZone li button.active").text(), $("#ForecastZone li button.active").attr("id")));

    $("#ForecastTime").val((new Date()).format("yyyy-MM-dd"));

    //$("#LisQY").append("<option selected='selected'>"+  +"</option>");

    DtPage = $("#ForecastTime").val();
    GetAllForInfo();
    //图标
    GetchartsData(AreaName, ForecastId, ForecastType, DtPage);
    //数据
    DayFData(AreaName, ForecastId, DtPage);

    $("#" + ForecastId).addClass("active");
    $("#" + ForecastType).addClass("active");
    $("#" + AreaName).addClass("active");

    $("#ForecastPeriod ul li button").click(function () {
        ForecastId = this.id;
        DtPage = $("#ForecastTime").val();
        $(".txtdate ul li button").removeClass("active");
        $("#" + ForecastId).addClass("active");
        //图表和数据
        GetchartsData(AreaName, ForecastId, ForecastType, DtPage);
        DayFData(AreaName, ForecastId, DtPage);
    });

    $("#ForecastType ul li button").click(function () {
        ForecastType = this.id;
        DtPage = $("#ForecastTime").val();
        TypeName = document.getElementById(this.id).innerText;
        $("#ForecastType ul li button").removeClass("active");
        $("#" + ForecastType).addClass("active");
        GetChartAndData(AreaName, ForecastId, ForecastType, DtPage);
    });

    $("#ForecastZone ul li button").click(function () {
        var obj = document.getElementById("LisQY");
        if (this.id != "FTArea" && obj.length == 0) {
            obj.options.add(new Option("琼山区", AreaName));
            $("#LisQY").removeAttr("disabled");
            $("#copyQYli").removeAttr("class");//移除不可用标签
        } else if (obj.length>0) {
            $("#LisQY").removeAttr("disabled");
            $("#copyQYli").removeAttr("class");//移除不可用标签
        }
        AreaName = this.id;
        DtPage = $("#ForecastTime").val();
        $("#ForecastZone ul li button").removeClass("active");
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
            Sm_AreaInfoList[tagArea][i].Wdir10m = Sm_AreaInfoList[area][i].Wdir10m;
            Sm_AreaInfoList[tagArea][i].Forecasttime = Sm_AreaInfoList[area][i].Forecasttime;
        }
        //图标刷新 
        DataBindRainEch(AreaName, ForecastType, Sm_AreaInfoList[tagArea][0].Forecasttime, GetData(Sm_AreaInfoList[tagArea]));
        //数据刷新
        DayForecastData(AreaName, ForecastId, Sm_AreaInfoList[tagArea]);
    });

    //预览数据-分区
    $("#AreaN ul li button").click(function () {
        $("#AreaN ul li button").removeClass("active");
        $("#" + this.id).addClass("active");
        var index = GetAreaIndex(this.id.substring(0, this.id.length - 1));
        indexShow = index;
        ShowText(this.id);
        ShowTab(index);
    });
});

function ShowTab(index) {
    var data = Sm_AreaInfoList[index];
    $("#biaoge1").html("");
    $("#biaoge2").html("");
    if (data.length > 0) {
        var Rain = "", T2m = "", Rhsfc = "", Wspd10m = "", Wdir10m = "", ForecastTime = "";
        for (var i = 0; i < data.length; i++) {
            Rain += data[i].Rain + "-";
            Rhsfc += data[i].Rhsfc + "-";
            Wspd10m += data[i].Wspd10m + "-";
            Wdir10m += data[i].Wdir10m + "-";
            T2m += data[i].T2m + "-";
            ForecastTime += new Date(data[i].Forecasttime).getHours() + "时-";
        }

        var table1 = "<table style=\"border-collapse: collapse; width:100%\">"
        table1 += "<tr><th style='border: 1px solid #4F4E4E;text-align: center; width:20%;'>时间</th>";

        for (var s = 0; s < 6; s++) {
            table1 += "<th style='border: 1px solid #4F4E4E;text-align: center; width:13%;'>" + ForecastTime.split('-')[s] + "</th>";
        }

        table1 += "</tr><tr><th style='border: 1px solid #4F4E4E;text-align: center;'>温度</th>";
        for (var s = 0; s < 6; s++) {
            table1 += "<th style='border: 1px solid #4F4E4E;text-align: center;'>" + T2m.split('-')[s] + "</th>";
        }

        table1 += "</tr><tr><th style='border: 1px solid #4F4E4E;text-align: center;'>湿度(%)";
        for (var s = 0; s < 6; s++) {
            table1 += "<th style='border: 1px solid #4F4E4E;text-align: center;'>" + Rhsfc.split('-')[s] + "</th>";
        }

        table1 += "</tr><tr><th style='border: 1px solid #4F4E4E;text-align: center;'>风向</th>";
        for (var s = 0; s < 6; s++) {
            table1 += "<th style='border: 1px solid #4F4E4E;text-align: center;'>" + Wdir10m.split('-')[s] + "</th>";
        }

        table1 += "</tr><tr><th style='border: 1px solid #4F4E4E;text-align: center;'>风速</th>";
        for (var s = 0; s < 6; s++) {
            table1 += "<th style='border: 1px solid #4F4E4E;text-align: center;'>" + Wspd10m.split('-')[s] + "</th>";
        }
        table1 += "</tr><tr><th style='border: 1px solid #4F4E4E;text-align: center;'>降雨(mm)</th>";
        for (var s = 0; s < 6; s++) {
            table1 += "<th style='border: 1px solid #4F4E4E;text-align: center;'>" + Rain.split('-')[s] + "</th>";
        }
        table1 += "</tr></table>";
        $("#biaoge1").append(table1);



        var table2 = "<table style=\"border-collapse: collapse; width:100%\">"
        table2 += "<tr><th style='border: 1px solid #4F4E4E;text-align: center; width:20%;'>时间</th>";
        for (var s = 6; s < 12; s++) {
            table2 += "<th style='border: 1px solid #4F4E4E;text-align: center; width:13%;'>" + ForecastTime.split('-')[s] + "</th>";
        }

        table2 += "</tr><tr><th style='border: 1px solid #4F4E4E;text-align: center;'>温度</th>";
        for (var s = 6; s < 12; s++) {
            table2 += "<th style='border: 1px solid #4F4E4E;text-align: center;'>" + T2m.split('-')[s] + "</th>";
        }

        table2 += "</tr><tr><th style='border: 1px solid #4F4E4E;text-align: center;'>湿度(%)";
        for (var s = 6; s < 12; s++) {
            table2 += "<th style='border: 1px solid #4F4E4E;text-align: center;'>" + Rhsfc.split('-')[s] + "</th>";
        }

        table2 += "</tr><tr><th style='border: 1px solid #4F4E4E;text-align: center;'>风向</th>";
        for (var s = 6; s < 12; s++) {
            table2 += "<th style='border: 1px solid #4F4E4E;text-align: center;'>" + Wdir10m.split('-')[s] + "</th>";
        }

        table2 += "</tr><tr><th style='border: 1px solid #4F4E4E;text-align: center;'>风速</th>";
        for (var s = 6; s < 12; s++) {
            table2 += "<th style='border: 1px solid #4F4E4E;text-align: center;'>" + Wspd10m.split('-')[s] + "</th>";
        }
        table2 += "</tr><tr><th style='border: 1px solid #4F4E4E;text-align: center;'>降雨(mm)</th>";
        for (var s = 6; s < 12; s++) {
            table2 += "<th style='border: 1px solid #4F4E4E;text-align: center;'>" + Rain.split('-')[s] + "</th>";
        }
        table2 += "</tr></table>";
        $("#biaoge2").append(table2);
    }
}

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
            $("#" + tmp).attr("style", "background: url(../../Images/NewPageImage/bg_colourspot_clicked.png) no-repeat;color:white");
    }
    if (count > 4)
        $("#ZoneShowli").removeAttr("class")
    $("#" + id).removeAttr("style");
    $("#" + id).addClass("active");
}

function GetAllForInfo() {
    common.prototype.webService("GetAllForInfo", {
        AreaList: AreaList,
        ForecastId: ForecastId,
        DtPage: DtPage
    }, function (res) {
        if (res != null && res.length > 0)
            Sm_AreaInfoList = JSON.parse(JSON.stringify(res));
        else
            Sm_AreaInfoList = null;
    });
}

function GetChartAndData(AreaName, ForecastId, ForecastType, DtPage) {
    //预报起始时间

    DataBindRainEch(AreaName, ForecastType, Sm_AreaInfoList[GetAreaIndex(AreaName)][0].Forecasttime, GetData(Sm_AreaInfoList[GetAreaIndex(AreaName)]));
    DayForecastData(AreaName, ForecastId, Sm_AreaInfoList[GetAreaIndex(AreaName)]);

}

function GetchartsData(AreaName, ForecastId, ForecastType, DtPage) {
    common.prototype.webService("GetAllForInfo", {
        AreaList: AreaList,
        ForecastId: ForecastId,
        DtPage: DtPage
    }, function (res) {
        if (res != null && res.length > 0) {
            Sm_AreaInfoList = JSON.parse(JSON.stringify(res));
            dataTime = [];
            for (var i = 0; i < Sm_AreaInfoList[GetAreaIndex(AreaName)].length; i++) {
                var testtime = Sm_AreaInfoList[GetAreaIndex(AreaName)][i].Forecasttime;
                var testdate = new Date(Sm_AreaInfoList[GetAreaIndex(AreaName)][i].Forecasttime).getHours() + ":00";
                dataTime.push(new Date(Sm_AreaInfoList[GetAreaIndex(AreaName)][i].Forecasttime).getHours() + ":00");
            }
            var test1 = Sm_AreaInfoList[GetAreaIndex(AreaName)][0].Forecasttime;
            var test2 = GetData(res[GetAreaIndex(AreaName)]);
            DataBindRainEch(AreaName, ForecastType, Sm_AreaInfoList[GetAreaIndex(AreaName)][0].Forecasttime, GetData(res[GetAreaIndex(AreaName)]));

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
    var MaxTemperature = [];
    var MinTemperature = [];
    for (var i = 0; i < res.length ; i++) {
        RainData.push(res[i].Rain);
        TemptureData.push(res[i].T2m);
        HumidityData.push(res[i].Rhsfc);
        WindData.push(res[i].Wspd10m);
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
               text: '中央指导预报  起报时间：' + new Date(dt).format("yyyy-MM-dd HH:mm"),
               x: 'center'
           },
           grid: {
               x: '5%',
               y: '23%',
               width: '90%'
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
                           data: [dataTime[0], dataTime[1], dataTime[2], dataTime[3], dataTime[4], dataTime[5], dataTime[6], dataTime[7], dataTime[8], dataTime[9], dataTime[10], dataTime[11], dataTime[12], dataTime[13], dataTime[14], dataTime[15], dataTime[16],
                            dataTime[17], dataTime[18], dataTime[19], dataTime[20], dataTime[21], dataTime[22], dataTime[23]]
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
    common.prototype.webService("GetAllForInfo", {
        AreaList: AreaList,
        ForecastId: ForecastId,
        DtPage: DtPage
    }, function (res) {
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
        var StrTable = "<table id=\"DayTableInfo\" style='background-color:#bde2f9;color:#13598f;'><tr><th style='width:100px;'>时间</th><th>(系统订正)降水量mm</th><th>(预报员制作)降水量mm</th><th>(系统订正)温度℃</th><th>(预报员制作)温度℃</th><th>相对湿度(%)</th><th>风速(m/s)</th></tr>";

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
        $("#ForecastType ul li button").removeClass("active");
        $("#" + ForecastType).addClass("active");
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
    DataBindRainEch(AreaName, ForecastType, Sm_AreaInfoList[GetAreaIndex(AreaName)][0].Forecasttime, GetData(Sm_AreaInfoList[AreaIndex]));
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

function SetPeriod() {
    var date = new Date();
    if (date.getHours() > 8 && date.getHours() < 18)
        ForecastId = "Forecast10";
    else if (date.getHours() > 17)
        ForecastId = "Forecast16";
}

canlle_buuton = function () {
    $(".realsePage").css("display", "none");
    $("#Max").css("display", "block");
}

realse_button = function () {
    var user = $("#cbUser").val();
    if ($("#passwad").val() == "") {
        layer.msg("请输入预报员密码!");
    }
    else {
        $.post("/WebService.asmx/GetUserInfoname", {}, function (result) {
            result = JSON.parse(result);
            for (var i = 0; i < result.length; i++) {
                if (result[i].UserName == user) {
                    if (result[i].UPassword == $("#passwad").val()) {
                        layer.confirm('确认发布?', {
                            btnAlign: 'c',
                            btn: ['确定', '取消'] //按钮
                        }, function () {
                            loadpage();
                            var InfoList = Sm_AreaInfoList[indexShow];

                            common.prototype.webService("SaveForInfo", {
                                InfoList: InfoList,
                                Name: $("#cbUser").val(),
                                ForecastId: ForecastId,
                                DtPage: DtPage
                            }, function (result) {
                                layer.close(load);
                                if (result != undefined && result != "") {
                                    if (result)
                                        layer.msg("发布成功！");
                                    else
                                        layer.msg("发布失败！");
                                } else
                                    layer.msg("发布失败！请稍后重试，或联系管理员！");
                            });
                        }, function () {
                        });
                        break;
                    }
                    else {
                        layer.msg("请输入正确密码!");
                        break;
                    }
                }
            }
        });
    }
}

ZoneShow_btn = function () {
    $(".realsePage").css("display", "block");
    $("#Max").css("display", "none");
    $("#yearEdit").text(new Date(DtPage).format("yyyyMMdd"));
    $("#AreaN ul li button").removeClass("active");
    $("#" + AreaName + "D").addClass("active");
    $("#passwad").val("");
    indexShow = GetAreaIndex(AreaName);
    ShowText(AreaName);
    ShowTab(GetAreaIndex(AreaName));
}

function ShowText(areaName) {
    var text = ["白天至傍晚（7-20时）天气预测", "今天中午到傍晚（12-20时）天气预测", "今晚到明天（今日20时-明日20时）天气预测"];
    var text2 = ["早晨天气预报", "午间天气预报", "下午天气预报"];
    var num = 0;
    if (ForecastId == "Forecast10") num = 1;
    else if (ForecastId == "Forecast16") num = 2;
    $("#Area").html(document.getElementById(areaName).innerText);
    $("#Area2").html(text[num]);
    $("#text2").html(text2[num]);
    $("#data").html("");

    var name = document.getElementById(areaName).innerText;
    document.getElementById("img").src = "";
    common.prototype.webService("GetAllWearthInfo", {
        ForecastId: ForecastId,
        DtPage: DtPage
    }, function (res) {
        if (res != null && res.length > 0) {
            var data = "";
            for (var i = 0; i < res.length; i++) {
                if (res[i].AreaName == name.trim() && res[i].MinTemp != "0.0") {
                    document.getElementById("img").src = "../../Images/tq/" + res[i].WeatherPic;
                    if (res[i].WeatherStatus != "")
                        data = "<br/><br/><br/>&nbsp;" + res[i].WeatherStatus;
                    if (res[i].WindSpeed != "" && res[i].WindDirectName != "")
                        data += "；风" + res[i].WindSpeed + "级(" + res[i].WindDirectName + ")";
                    if (res[i].MinRain != "" && res[i].Rain != "") {
                        data += "；降雨量" + res[i].MinRain + "mm";
                        if (res[i].MinRain != res[i].Rain)
                            data += " - " + res[i].Rain + "mm";
                    }
                    if (res[i].MinTemp != "" && res[i].MaxTemp != "")
                        data += "；<br/><br/><br/>&nbsp;气温" + res[i].MinTemp + "℃ - " + res[i].MaxTemp + "℃";
                    if (res[i].Humidity != "" && res[i].MaxHumidity != "")
                        data += "；相对湿度" + res[i].Humidity + "% - " + res[i].MaxHumidity + "%";
                }
            }
            $("#data").html(data);
        }
    });

    //回顾
    common.prototype.webService("GetAllWelfareForeInfo", {
        ForecastId: ForecastId,
        DtPage: DtPage
    }, function (res) {
        if (res != null && res.length > 0) {
            $("#huigu").html(res[0]);
            $("#qushi").html(res[1]);
        } else {
            $("#huigu").html("");
            $("#qushi").html("");
        }
    });

    //趋势预测
    common.prototype.webService("GetWeatherHis", {
        ForecastId: ForecastId,
        DtPage: DtPage
    }, function (res) {
        if (res != null && res.length > 0) {
            var ForecastDate = "", Week = "", WeatherPic = "", WeatherStatus = "", MinTemp = "", MaxTemp = "";
            for (var i = 0; i < res.length; i++) {
                ForecastDate += new Date(res[i].ForecastDate).format("MM/dd") + "|";
                Week += res[i].Week + "|";
                WeatherPic += "../../Images/tq/" + res[i].WeatherPic + "|";
                WeatherStatus += res[i].WeatherStatus + "|";
                MinTemp += res[i].MinTemp + "|";
                MaxTemp += res[i].MaxTemp + "|";
            }
            var table = "<table style=\"border-collapse: collapse; width:100%\">"
            table += "<tr style='border: 1px solid #4F4E4E;text-align: center; '>";
            for (var s = 0; s < res.length; s++) {
                table += "<th style='border: 1px solid #4F4E4E;text-align: center; width:13%;'>" + ForecastDate.split('|')[s] + "<br/>" + Week.split('|')[s] + "</th>";
            }

            table += "</tr><tr style='border: 1px solid #4F4E4E;text-align: center;'>";
            for (var s = 0; s < res.length; s++) {
                table += "<th style='border: 1px solid #4F4E4E;text-align: center;'><img src='" + WeatherPic.split('|')[s] + "'/></th>";
            }
            table += "</tr><tr style='border: 1px solid #4F4E4E;text-align: center;'>";
            for (var s = 0; s < res.length; s++) {
                table += "<th style='border: 1px solid #4F4E4E;text-align: center;'>" + WeatherStatus.split('|')[s] + "</th>";
            }

            table += "</tr><tr style='border: 1px solid #4F4E4E;text-align: center;'>";
            for (var s = 0; s < res.length; s++) {
                table += "<th style='border: 1px solid #4F4E4E;text-align: center;'>" + MinTemp.split('|')[s] + "~" + MaxTemp.split('|')[s] + "℃" + "</th>";
            }
            table += "</tr></table>";
            $("#yuceTab").html(table);
        } else
            $("#yuceTab").html("");
    });

    $.post("/WebService.asmx/GetUserInfoname", {}, function (result) {
        if (result != "" && result != undefined) {
            result = JSON.parse(result);
            for (var i = 0; i < result.length; i++) {
                var userHtml;
                userHtml += "<option>" + result[i].UserName + "</option>";
            }
            $("#cbUser").empty();//移除select的所有option
            $("#cbUser").append(userHtml);
            $("#foreaceUser").text(result[0].UserName);
        }
        else {
            layer.msg("用户数据缺失");
        }
    });
}
function selectChange() {
    $("#foreaceUser").text($("#cbUser").val());
}
//load方法
function loadpage() {
    load = layer.msg('加载中', {
        icon: 16
        , shade: 0.01
        , time: 0
    });
}
