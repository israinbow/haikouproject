var AreaName = "琼山区";
var ForecastId = "Forecast10";
var isCorrect = 0;//判断正常预报或者更正报
var openpage = null;
var isCompany = 0;//判断是否上网
var isUser = 0;//判断是否个人比武
var DtPage;
var StrMes = "";
var m_WeatherInfoList;
var StrTable = "";
var FlipMax = 10;
var FlipMin = 1;
var FlipSum = 0;
var nums = 10; //每页出现的数据量

$(function () {
    GetMaxTime();
    DtPage = $("#ForecastTime").val();
    GetUserInfo();
    GetCurrentForecast(ForecastId, DtPage);
    Day6HourForecastData(ForecastId, DtPage);
    GetHour6OBTRealInfo(ForecastId, DtPage);
    $("#AWSInfo").hide();
    $("#Mes_Max").hide();
    GetHistoryDataCount($("#HisStartTime").val(), $("#HisEndTime").val());
    $("#btnIssue").click(function () {
        InsertCityWeatherInfoList(ForecastId, DtPage, m_WeatherInfoList, $("#member").val(), isCorrect);
    });
    $("#btnSelect").click(function () {
        GetHistoryDataCount($("#HisStartTime").val(), $("#HisEndTime").val());
    });

    $("#NewData").click(function () {
        $("#AWSInfo").hide();
        $("#NewData").addClass("active");
        GetMaxTime();
        DtPage = $("#ForecastTime").val();
        Day6HourForecastData(ForecastId, DtPage);
        GetHour6OBTRealInfo(ForecastId, DtPage);
    });

    $("#preview ul li button").click(function () {

        var UserName = $("#member").val();
        var UserPwd = $("#pwd").val();
        JudgeUserOrPwd6Hour(UserName, UserPwd, ForecastId, DtPage, isCorrect, this.id);
    });

    $("#btnCancel").click(function () {
        $(".viewpro").css("display", "none");
        $("#Mes_Max").css("display", "none");
        $("#Mes_Max").hide();
        layer.close(openpage);

        //layer.closeAll(); //疯狂模式，关闭所有层
        //$("#Mes_Max").hide();
        //$("#Mes_Max").attr("class", "hide");
        //$("#Mes_Max").html("");
    });

    $('#rdSW').click(function () {
        var c = this.value;
        if (c == "上网") {
            $('#rdSW').removeAttr('checked')
            $('#rdSW').attr("value", "不上网")

        } else if (c == "不上网") {
            $("#rdSW").toggleClass("checked");
            $('#rdSW').attr("value", "上网")
        }
    });

    $("#ForecastPeriod ul li button").click(function () {
        ForecastId = this.id;
        DtPage = $("#ForecastTime").val();
        $(".txtdate ul li button").removeClass("active");
        $("#" + ForecastId).addClass("active");
        GetCurrentForecast(ForecastId, DtPage);
        Day6HourForecastData(ForecastId, DtPage);
        GetHour6OBTRealInfo(ForecastId, DtPage);
    });
});

//翻页功能
function laypage() {
    layui.use(['laypage', 'layer'], function () {
        var laypage = layui.laypage
        , layer = layui.layer;
        var pp = Math.ceil(FlipSum / nums); //得到总页数
        //调用分页
        laypage({
            cont: 'Flip_div'
          , pages: pp
          , skin: '#1E9FFF'
          , jump: function (obj) {
              //得到了当前页，用于向服务端请求对应数据              
              var curr = obj.curr;
              FlipMax = curr * nums;
              FlipMin = curr * nums - nums + 1;
              GatHistoryData($("#HisStartTime").val(), $("#HisEndTime").val());
          }
        });
        ////模拟渲染
        //var render = function (curr) {
        //    FlipMax = curr * nums;
        //    FlipMin = curr * nums - nums;
        //    return str;
        //};
        if (pp < 2)
            $("#Flip_div").hide();
        else
            $("#Flip_div").show();
    });

}


//获取最新时间
function GetMaxTime() {
    var date = new Date();
    $("#ForecastTime").val(date.format("yyyy-MM-dd"));
    $("#HisEndTime").val(date.format("yyyy-MM-dd"));
    var date1 = new Date(date.valueOf() - 60 * 60 * 1000 * 24 * 7);
    $("#HisStartTime").val(date1.format("yyyy-MM-dd"));
    intHours = date.getHours();
    if (intHours > 18) {
        ForecastId = "Forecast16";
    } else {
        ForecastId = "Forecast10";
    }
    $(".txtdate ul li button").removeClass("active");
    $("#" + ForecastId).addClass("active");
}

//获取当前预报员
function GetCurrentForecast(ForecastId, DtPage) {
    common.webService("Get6HourForecaster", {
        ForecastId: ForecastId,
        DtPage: DtPage
    }, function (res) {
        document.getElementById("member").value = res;
    })
}

//获取所有预报员
function GetUserInfo() {
    common.webService("GetAll6HourUserName", {}, function (res) {
        var option = "";
        for (var i = 0; i < res.length; i++) {
            option += "<option value=\"" + res[i] + "\">" + res[i] + "</option>";
        }
        $("#member").html(option);
    })
}


//判断用户名和密码是否匹配
function JudgeUserOrPwd6Hour(UserName, UserPwd, ForecastId, DtPage, ClickID) {
    common.webService("JudgeUserOrPwd6Hour", {
        UserName: UserName,
        UserPwd: UserPwd
    }, function (res) {
        IsUser_Pwd(res, ForecastId, DtPage, ClickID);
    })
}


function IsUser_Pwd(User_Pwd, ForecastId, DtPage, ClickID) {
    if (User_Pwd) {
        MesShow(ForecastId, DtPage);
        if (StrMes != "") {
            QueryBox(StrMes, ForecastId, DtPage, ClickID);
        } else {
            MesData(ForecastId, DtPage, ClickID);
        }
    } else {
        //提示层
        layer.msg('请输入正确的预报员密码！');
    }
}

//预览页面
function ShowPreviewWeb(ForecastId, DtPage) {
    //zhou       
    var ddtime = $("#ForecastTime").val();
    common.webService("ShowPreview2", {
        m_WeatherInfoList: JSON.stringify(m_WeatherInfoList),
        DDateTime: ddtime,
        isCorrect: isCorrect
    }, function (res) {
        $("#Mes_text").val(res);
    });
    //zhou
}

//显示弹窗曾
function ShowMes_Max() {
    //$('#Mes_Max').removeAttr('class')
    //$("#Mes_Max").css("display", "block");
    $(".viewpro").css("display", "block");
    $("#Mes_Max").show();
    openpage = layer.open({
        type: 1,
        title: ['文件浏览', 'font-size:15px;font-weight:bold;font-family:微软雅黑;color:white'],
        skin: 'layui-layer-rim', //加上边框
        area: ['650px', '530px'], //宽高
        content: $("#Mes_Max")
    });

    $(".viewpro span").click(function () {
        $(".viewpro").css("display", "none");//让预览弹出框隐藏
        layer.close(openpage);
    })
}

function QueryBox(Str, ForecastId, DtPage, ClickID) {
    //询问框
    layer.confirm(Str, {
        btn: ['继续浏览', '取消'] //按钮
    }, function () {
        MesData(ForecastId, DtPage, ClickID);
    }, function () {
    });

}
function MesData(ForecastId, DtPage, ClickID) {
    if (ClickID == "btnSave") {
        isCorrect = 0;
        if ($('#rdSW').attr("value") == "上网") {
            ShowPreviewWeb(ForecastId, DtPage);
        } else {
            $("#Mes_text").val("");
        }
        ShowMes_Max();
    } else {
        isCorrect = 1;
        if ($('#rdSW').attr("value") == "不上网") {
            //alert("没有选择上网文件,请确认！");
            //提示层
            layer.msg('没有选择上网文件,请确认！');
        } else {
            ShowPreviewWeb(ForecastId, DtPage);
            ShowMes_Max();
        }
    }
}
//逐6小时预报数据
function Day6HourForecastData(ForecastId, DtPage) {
    var tdstyle = "background:#E9F1F4;width: 100%;height: 100%;float: left;text-align: center;border: 1px solid #fff;";//表格行的背景样式
    var tdstyle2 = "width: 100%;height: 100%;float: left;text-align: center;border: 1px solid #fff;";//表格行的背景样式

    common.webService("GetCityForecastInfoList6", {
        ForecastId: ForecastId,
        DtPage: DtPage
    }, function (res) {
        if (res.length > 0) {
            m_WeatherInfoList = res;
            var StrTable = "<table id=\"Day7TableInfo\"><tr><th style='width:100px;'>时间</th><th>天气状况</th><th>降雨量mm</th><th>最低温度℃</th><th>最高温度℃</th><th>风向</th><th>风速</th></tr>";
            //console.table(res);
            for (var i = 0; i < res.length ; i++) {
                var dt1 = res[i].ForecastDate.toDate();
                var Hours1 = dt1.getHours();
                //小时改变最后面一个数字就可以了
                var dt3 = new Date(dt1.valueOf() + 60 * 60 * 1000 * 6);
                var Hours3 = dt3.getHours();

                var StrDt1 = GetNum(Hours1) + ":01"
                var StrDt3 = GetNum(Hours3) + ":00"
                if (i % 2 == 0) {
                    StrTable += "<tr style='background-color:#E9F1F4'>" +
                                    "<td style='width:160px;'>" + StrDt1 + "-" + StrDt3 + "</td>" +
                                    "<td><input id=wea0-" + (i + 1) + " onblur=\"input_blur('wea0-" + (i + 1) + "')\" onfocus=\"input_click('wea0-" + (i + 1) + "')\" value= " + res[i].ID + " style='" + tdstyle + "'></td>" +
                                    "<td><input id=rain0-" + (i + 1) + " onblur=\"input_blur('rain0-" + (i + 1) + "')\" onfocus=\"input_click('rain0-" + (i + 1) + "')\" value= " + res[i].Rain + " style='" + tdstyle + "'>" +
                                    "</td><td><input id=mintemp0-" + (i + 1) + " onblur=\"input_blur('mintemp0-" + (i + 1) + "')\" onfocus=\"input_click('mintemp0-" + (i + 1) + "')\" value= " + res[i].MinTemp + " style='" + tdstyle + "'></td>" +
                                    "<td><input id=maxtemp0-" + (i + 1) + " onblur=\"input_blur('maxtemp0-" + (i + 1) + "')\" onfocus=\"input_click('maxtemp0-" + (i + 1) + "')\" value= " + res[i].MaxTemp + " style='" + tdstyle + "'></td>" +
                                    "<td><input id=wind0-" + (i + 1) + " onblur=\"input_blur('wind0-" + (i + 1) + "')\" onfocus=\"input_click('wind0-" + (i + 1) + "')\" value= " + res[i].WindDirectName + " style='" + tdstyle + "'></td>" +
                                    "<td><input id=windspeed0-" + (i + 1) + " onblur=\"input_blur('windspeed0-" + (i + 1) + "')\" onfocus=\"input_click('windspeed0-" + (i + 1) + "')\" value= " + res[i].WindName + " style='" + tdstyle + "'></td>" +
                                "</tr>";
                } else {
                    StrTable += "<tr style='background-color:#FFFFFF'>" +
                                    "<td style='width:160px;'>" + StrDt1 + "-" + StrDt3 + "</td>" +
                                    "<td><input id=wea0-" + (i + 1) + " onblur=\"input_blur('wea0-" + (i + 1) + "')\" onfocus=\"input_click('wea0-" + (i + 1) + "')\" value= " + res[i].ID + " style='" + tdstyle2 + "'></td>" +
                                    "<td><input id=rain0-" + (i + 1) + " onblur=\"input_blur('rain0-" + (i + 1) + "')\" onfocus=\"input_click('rain0-" + (i + 1) + "')\" value= " + res[i].Rain + " style='" + tdstyle2 + "'></td>" +
                                    "<td><input id=mintemp0-" + (i + 1) + " onblur=\"input_blur('mintemp0-" + (i + 1) + "')\" onfocus=\"input_click('mintemp0-" + (i + 1) + "')\" value= " + res[i].MinTemp + " style='" + tdstyle2 + "'></td>" +
                                    "<td><input id=maxtemp0-" + (i + 1) + " onblur=\"input_blur('maxtemp0-" + (i + 1) + "')\" onfocus=\"input_click('maxtemp0-" + (i + 1) + "')\" value= " + res[i].MaxTemp + " style='" + tdstyle2 + "'></td>" +
                                    "<td><input id=wind0-" + (i + 1) + " onblur=\"input_blur('wind0-" + (i + 1) + "')\" onfocus=\"input_click('wind0-" + (i + 1) + "')\" value= " + res[i].WindDirectName + " style='" + tdstyle2 + "'></td>" +
                                    "<td><input id=windspeed0-" + (i + 1) + " onblur=\"input_blur('windspeed0-" + (i + 1) + "')\" onfocus=\"input_click('windspeed0-" + (i + 1) + "')\" value= " + res[i].WindName + " style='" + tdstyle2 + "'></td>" +
                                "</tr>";
                }
            }
            StrTable += "</table>";
            $("#Day7Forecast").html(StrTable);
            $("#Day7Forecast").show();
        } else {
            $("#Day7Forecast").hide();
        }
    })
}
//input事件可编辑
function input_click(value) {
    $("#" + value).css("border", "1px solid green");
}
//更新页面修改之后的数据
function input_blur(value) {
    $("#" + value).css("background", "#63b363");
    $("#" + value).css("border", "1px solid #fff");
    var indexName = value.split('-')[0];
    var index = value.split('-')[1];
    switch (indexName) {
        case "wea0":
            m_WeatherInfoList[(index - 1)].ID = $("#" + value).val();
            break;
        case "rain0":
            m_WeatherInfoList[(index - 1)].Rain = $("#" + value).val();
            break;
        case "mintemp0":
            m_WeatherInfoList[(index - 1)].MinTemp = $("#" + value).val();
            break;
        case "maxtemp0":
            m_WeatherInfoList[(index - 1)].MaxTemp = $("#" + value).val();
            break;
        case "wind0":
            m_WeatherInfoList[(index - 1)].WindDirectName = $("#" + value).val();
            break;
        case "windspeed0":
            m_WeatherInfoList[(index - 1)].WindName = $("#" + value).val();
            break;
    }
}

//获取实况信息
function GetHour6OBTRealInfo(ForecastId, DtPage) {
    common.webService("GetHour6OBTRealInfo", {
        ForecastId: ForecastId,
        DtPage: DtPage
    }, function (res) {
        if (res != null) {
            var StrTable = "<p class=\"txt\" style=\"margin-left: 20px;margin-bottom: 20px;\"><span style=\"font-weight: bold; color: #F2A444; font-size: 18px; margin-right: 10px;\">|</span>实况信息</p>" +
                "<table id=\"AWSTableInfo\"><tr><th style='width:100px;'>时间</th><th>降雨量mm</th><th>最低温度℃</th><th>最高温度℃</th><th>风速</th></tr>";
            for (var i = 0; i < res.length; i++) {
                var dt1 = res[i].ForecastDate.toDate();
                var Hours1 = dt1.getHours();
                var StrDt1 = GetNum(Hours1) + ":01"
                //小时改变最后面一个数字就可以了
                var dt3 = new Date(dt1.valueOf() + 60 * 60 * 1000 * 6);
                var Hours3 = dt3.getHours();
                var StrDt3 = GetNum(Hours3) + ":00"
                if (i % 2 == 0) {
                    StrTable += "<tr style='background-color:#E9F1F4'>" +
                                    "<td style='width:160px;'>" + StrDt1 + "-" + StrDt3 + "</td>" +
                                    "<td>" + res[i].Rain + "</td>" +
                                    "<td>" + res[i].MinTemp + "</td>" +
                                    "<td>" + res[i].MaxTemp + "</td>" +
                                    "<td>" + res[i].WindName + "</td>" +
                                "</tr>";
                } else {
                    StrTable += "<tr style='background-color:#FFFFFF'>" +
                                    "<td style='width:160px;'>" + StrDt1 + "-" + StrDt3 + "</td>" +
                                    "<td>" + res[i].Rain + "</td>" +
                                    "<td>" + res[i].MinTemp + "</td>" +
                                    "<td>" + res[i].MaxTemp + "</td>" +
                                    "<td>" + res[i].WindName + "</td>" +
                                "</tr>";
                }
            }
            StrTable += "</table>";
            $("#AWSInfo").html(StrTable);
            $("#AWSInfo").show();
        } else {
            $("#AWSInfo").hide();
        }
    });
}



function GetNum(d) {
    if (d > 10) {
        return d;
    } else {
        return "0" + d;
    }
}

//上网文件历史查询
function GatHistoryData(StartDt, EndDt) {
    common.webService("GetCityUploadInfoList", {
        StartDt: StartDt,
        EndDt: EndDt,
        Max: FlipMax,
        Min: FlipMin
    }, function (res) {
        if (res == null)
            return;
        StrTable = "<table id=\"HisTableInfo\"><tr><th style='width:100px;'>预报时次</th><th>类别</th><th>预报员</th><th>保存时间</th><th>上网文件上传时间</th><th>上网文件下载</th></tr>";
        var index = 0;
        for (var i = 0; i < res.length; i++) {
            var StrUrl = "<a href=\"http://10.153.96.140:8012/LFSProducts/" + res[i].Score5 + "\">下载</a>";
            if (res[i].Score4 == null) {
                StrUrl = "-";
                res[i].Score4 = "-";
            }
            if (i % 2 == 0) {
                StrTable += "<tr style='background-color:#E9F1F4'>" +
                                "<td style='width:160px;'>" + res[i].ScoreName + "</td>" +
                                "<td>" + res[i].Score1 + "</td>" +
                                "<td>" + res[i].Score7 + "</td>" +
                                "<td>" + res[i].Score3 + "</td>" +
                                "<td>" + res[i].Score4 + "</td>" +
                                "<td>" + StrUrl + "</td>" +
                            "</tr>";
            } else {
                StrTable += "<tr style='background-color:#FFFFFF'>" +
                                "<td style='width:160px;'>" + res[i].ScoreName + "</td>" +
                                "<td>" + res[i].Score1 + "</td>" +
                                "<td>" + res[i].Score7 + "</td>" +
                                "<td>" + res[i].Score3 + "</td>" +
                                "<td>" + res[i].Score4 + "</td>" +
                                "<td>" + StrUrl + "</td>" +
                            "</tr>";
            }
        }
        StrTable += "</table>";
        $("#HistoryData").html(StrTable);
    })
}



//获取逐六小时历史上网文件总条数
function GetHistoryDataCount(StartDt, EndDt) {
    common.webService("GetCityUploadInfoListCount", {
        StartDt: StartDt,
        EndDt: EndDt
    }, function (res) {
        if (res > 0) {
            FlipSum = res;
        }
        laypage();
    });
}

function DateSelect() {
    //$("#NewData").attr("style", "background-color: #428bca; border-color: #357ebd;height: 26px;line-height: 14px;margin-right: 10px;")
    $("#NewData").removeClass("active");
    DtPage = $("#ForecastTime").val();
    Day6HourForecastData(ForecastId, DtPage);
    GetHour6OBTRealInfo(ForecastId, DtPage);
}

function MesShow(ForecastId, DtPage) {
    common.webService("ShowMes", {
        ForecastId: ForecastId,
        DtPage: DtPage
    }, function (res) {
        StrMes = res;
    });
}

//更新数据入库
function InsertCityWeatherInfoList(ForecastId, DtPage, hourInfoS, strForecaster, ISCORRECT) {
    loadpage();//加载进度条
    common.webService("InsertCityWeatherInfoList", {
        ForecastId: ForecastId,
        DtPage: DtPage,
        hourInfoS: JSON.stringify(m_WeatherInfoList),
        strForecaster: strForecaster,
        ISCORRECT: ISCORRECT
    }, function (res) {
        layer.close(load);//关闭进度条
        if (res) {
            //提示层
            layer.msg('入库成功！');
        } else {
            //提示层
            layer.msg('保存失败！请稍后重试，或联系管理员！！');
        }
    });
}
//load方法
function loadpage() {
    load = layer.msg('加载中', {
        icon: 16
        , shade: 0.01
        , time: 0
    });
}