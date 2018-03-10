var AreaName = "琼山区";
var ForecastId = "Forecast10";
var isCorrect = 0;//判断正常预报或者更正报
var openpage = null;
var isCompany = 0;//判断是否上网
var isUser = 0;//判断是否个人比武
var DtPage;
var QYidName = "ft";
var hourInfo;
var dayInfo;
var m_AreaInfoList;//小时数据
var m_AreaDaysInfoList;//天数据
//存储修改之后的数据
var Sm_AreaInfoList;
var Sm_AreaDaysInfoList;
var FlipMax = 10;
var FlipMin = 1;
var FlipSum = 23;
var nums = 10; //每页出现的数据量

var m_WeatherInfoList;
var G_WeatherInfoList; //存放上面图形返回的结果集
var time = "1";

//初始化逐12小时页面
$(function () {
    require.config({
        paths: {
            echarts: '../../Script/Charts/build/dist'
        }
    });

    GetMaxTime();
    BtnDisabledTrue();
    //页面当前最新时间
    DtPage = $("#ForecastTime").val();
    //获取所有的预报员
    GetUserInfo();
    //获取当前值班预报员
    GetCurrentForecast(ForecastId, DtPage);
    Day7ForecastData(AreaName, ForecastId, DtPage);
    //获取数据填充图表
    GetEchartsData(AreaName, ForecastId, DtPage);
    GetHour12InfoListCount($("#HisStartTime").val(), $("#HisEndTime").val());
    //获取全市所有预报数据
    GetInsertInfo(ForecastId, DtPage);

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

    $("#c_head ul li button").click(function () {
        if (this.id != "copydata") {
            QYidName = this.id;
            $("#" + QYidName).attr("name", "DQY")
            BtnDQYStyle();

            AreaName = "琼山区";
            DtPage = $("#ForecastTime").val();
            BtnDisabledfalse();
            Day7ForecastData(AreaName, ForecastId, time);
            GetEchartsData(AreaName, ForecastId, time);
        }
    });

    $("#preview ul li button").click(function () {

        var UserName = $("#member").val();
        var UserPwd = $("#pwd").val();
        JudgeUserOrPwd(UserName, UserPwd, ForecastId, DtPage, this.id);
    });

    $("#btnCancel").click(function () {
        $(".viewpro").css("display", "none");//让预览弹出框隐藏
        layer.close(openpage);
    });
    
    $("#btnIssue").click(function () {

        if ($('#rdSW').attr("value") == "上网") {
            isCompany = 1;
        } else {
            isCompany = 0;
        }
        InsertHour12WeatherInfo(ForecastId, DtPage, $("#member").val(), isUser, isCompany, isCorrect, m_AreaInfoList);
    });

    $("#ForecastPeriod ul li button").click(function () {

        ForecastId = this.id;
        $(".txtdate ul li button").removeClass("active");
        $("#" + ForecastId).addClass("active");
        BtnQYStyle();
        $("#" + QYidName).attr("name", "DQY");
        DtPage = $("#ForecastTime").val();
        BtnDisabledTrue();
        BtnDisplayNone();
        //重新给数据赋值
        GetInsertInfo(ForecastId, DtPage);

        GetCurrentForecast(ForecastId, DtPage);
        Day7ForecastData(AreaName, ForecastId, DtPage);
        GetEchartsData(AreaName, ForecastId, DtPage);
    });
    $("#btnSelect").click(function () {
        GetHour12InfoListCount($("#HisStartTime").val(), $("#HisEndTime").val());
    });

    $("#NewData").click(function () {
        $(this).addClass("active");
        GetMaxTime();
        DtPage = $("#ForecastTime").val();
        Day7ForecastData(AreaName, ForecastId, DtPage);
        GetEchartsData(AreaName, ForecastId, DtPage);
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
    });
}

function removeAllLisQY() {
    var obj = document.getElementById('LisQY');
    obj.options.length = 0;
}

function SelectLisQY() {
    var YN = false;
    var objSelect = document.getElementById("LisQY");
    if (objSelect.options.length != 0) {
        for (var i = 0; i < objSelect.options.length; i++) {
            if (objSelect.options[i].value == QYidName) {
                YN = true;
                return;
            }
        }
        if (!YN) {
            objSelect.options.add(new Option(AreaName, QYidName)); //这个兼容IE与firefox
        }
    } else {
        objSelect.options.add(new Option(AreaName, QYidName)); //这个兼容IE与firefox
    }
}

function DateSelect() {
    $("#NewData").removeClass("active");
    DtPage = $("#ForecastTime").val();
    var data1 = m_AreaInfoList;
    var data2 = Sm_AreaInfoList;
    Day7ForecastData(AreaName, ForecastId, DtPage);
    GetEchartsData(AreaName, ForecastId, DtPage);
}


function GetInsertInfo(ForecastId, DtPage) {
    common.prototype.webService("GetInfoAll", {
        ForecastId: ForecastId,
        DtPage: DtPage
    }, function (res) {
        if (res != null) {
            m_AreaInfoList = hourInfo = res[0];
        }
    });

    var ArName = "琼山区";
    common.prototype.webService("Get12HourForecastInfo", {
        AreaName: ArName,
        ForecastId: ForecastId,
        DtPage: DtPage
    }, function (res) {
        Sm_AreaInfoList = res;
    });
}
function GetQYId(Area) {
    var id = 0;
    switch (Area) {
        case "ft":
        case "琼山区":
            id = 1;
            break;
    }
    return id;
}

//实体序列化json  入库操作 ForecastId时段  DtPage日期  strForecaster 预报员 isUser 判断是否个人比武 isCompany 判断是否上网  isCorrect 判断正常预报或者更正报
function InsertHour12WeatherInfo(ForecastId, DtPage, strForecaster, isUser, isCompany, isCorrect, m_AreaInfoList) {
    //var aa=JSON.stringify(m_AreaDaysInfoList); 
    //var dt1 = m_AreaInfoList[0].ForecastDate.toDate();
    //var dt2 = m_AreaInfoList[1].ForecastDate.toDate();
    //var dt3 = Sm_AreaInfoList[0].ForecastDate.toDate();
    //var dt4 = Sm_AreaInfoList[1].ForecastDate.toDate();
    layer.confirm('确定发布？', {
        btnAlign: 'c',
        btn: ['确定', '取消'] //按钮
    }, function () {
        loadpage();//加载进度条
        common.prototype.webService("InsertHour12WeatherInfo", {
            ForecastId: ForecastId,
            DtPage: DtPage,
            strForecaster: strForecaster,
            isUser: isUser,
            isCompany: isCompany,
            isCorrect: isCorrect,
            hourInfo: JSON.stringify(Sm_AreaInfoList),
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
    }, function () {
    });    
}

//显示弹窗曾
function ShowMes_Max() {
    $(".viewpro").css("display", "block");
    $('#Mes_Max').removeAttr('class')
    openpage = layer.open({
        type: 1,
        title: ['文件浏览', 'font-size:15px;font-weight:bold;font-family:微软雅黑;color:white'],
        skin: 'layui-layer-rim', //加上边框
        area: ['878px', '550px'], //宽高
        content: $("#Mes_Max")
    });

    $(".viewpro span").click(function(){
        $(".viewpro").css("display", "none");//让预览弹出框隐藏
        layer.close(openpage);
    })
    
}
//获取上网文件
function ShowPreviewWeb(ForecastId, DtPage) {
    common.prototype.webService("ShowPreviewWeb", {
        ForecastId: ForecastId,
        DtPage: DtPage,
        isCorrect: isCorrect
    }, function (res) {
        $("#Mes_text").text(res);
    });
}

//获取上网文件
function ShowPreviewWeb2(ForecastId, DtPage, isCorrect, Sm_AreaInfoList) {
    var time = $("#ForecastTime").val() + " " + $(".txtdate ul li button.active").attr("data-hour") + ":00:00";
    common.prototype.webService("ShowPreviewWeb2", {
        ForecastId: ForecastId,
        DtPage: time,
        isCorrect: isCorrect,
        hourInfo: JSON.stringify(Sm_AreaInfoList)
    }, function (res) {
        $("#Mes_text").text(res);
    });
}
//zhou

//不可点击
function BtnDisabledTrue() {
    $("#btnSaveli").attr("class", "disabled");
    $("#btnIsCorrectli").attr("class", "disabled");
}
//可点击
function BtnDisabledfalse() {
    $("#btnSaveli").removeAttr("class");
    $("#btnIsCorrectli").removeAttr("class");
}

function BtnDQYStyle() {
    var obj = document.getElementsByName("DQY");
    $(obj).each(function () {
        //$(this).attr("style", "background-color: #0C8903;color: white;");
    });
}

function BtnQYStyle() {
    var obj = $(".DQY");
    $(obj).each(function () {
        $(this).attr("name", "QY")
    })
}



//获取最新时间
function GetMaxTime() {
    var date = new Date();
    $("#ForecastTime").val(date.format("yyyy-MM-dd"));
    var date1 = new Date(date.valueOf() - 60 * 60 * 1000 * 24 * 7);
    $("#HisStartTime").val(date1.format("yyyy-MM-dd"));
    $("#HisEndTime").val(date.format("yyyy-MM-dd"));
    intHours = date.getHours();
    if (intHours > 8 && intHours < 18)
        ForecastId = "Forecast10";
        //else if (intHours == 14)
        //    ForecastId = "Forecast15";
    else if (intHours > 18)
        ForecastId = "Forecast16";
    $(".txtdate ul li button").removeClass("active");
    $("#NewData").addClass("active");
    $("#" + ForecastId).addClass("active");
}

//获取当前值班预报员
function GetCurrentForecast(ForecastId, DtPage) {
    common.prototype.webService("Get12HourForecaster", {
        ForecastId: ForecastId,
        DtPage: DtPage
    }, function (res) {
        document.getElementById("member").value = res;
    })
}

//获取所有的预报员
function GetUserInfo() {
    common.prototype.webService("GetAllUserName", {}, function (res) {
        var option = "";
        for (var i = 0; i < res.length; i++) {
            option += "<option value=\"" + res[i] + "\">" + res[i] + "</option>";
        }
        $("#member").html(option); preview
    })
}

//判断用户名和密码是否匹配
function JudgeUserOrPwd(UserName, UserPwd, ForecastId, DtPage, ClickID) {
    common.prototype.webService("JudgeUserOrPwd", {
        UserName: UserName,
        UserPwd: UserPwd
    }, function (res) {
        IsUser_Pwd(res, ForecastId, DtPage, ClickID);
    })
}

function IsUser_Pwd(User_Pwd, ForecastId, DtPage, ClickID) {
    if (User_Pwd) {
        GetDataMes(AreaName, ForecastId, DtPage);//获取数据验证提醒
        if (ClickID == "btnSave") {
            isCorrect = 0;
            if ($('#rdSW').attr("value") == "上网") {
                ShowPreviewWeb2(ForecastId, DtPage, isCorrect, Sm_AreaInfoList);
            } else {
                $("#Mes_text").val("");
            }
            ShowMes_Max();
        } else {
            isCorrect = 1;
            if ($('#rdSW').attr("value") == "不上网") {
                //提示层
                layer.msg('没有选择上网文件,请确认！');
            } else {
                ShowPreviewWeb2(ForecastId, DtPage);
                ShowMes_Max();
            }
        }
        $("#preview ul li button").addClass("active");
        $("#" + this.id).attr("style", "background-color: #306DA8;color: white;");
    } else {
        //提示层
        layer.msg('请输入正确的预报员密码！');
    }
}

function Day7ForecastData(AreaName, ForecastId, time) {
    //如果点击的是琼山的按钮数据不刷新
    if (time == "1" && AreaName == "琼山区") {
        var dt1 = Sm_AreaInfoList[0].ForecastDate.toDate();
        var dt2 = Sm_AreaInfoList[1].ForecastDate.toDate();
        res = Sm_AreaInfoList;
        Get12Hour(res);
    }
    if (time != "1") {
        common.prototype.webService("Get12HourForecastInfo", {
            AreaName: AreaName,
            ForecastId: ForecastId,
            DtPage: DtPage
        }, function (valtex) {
            var dt1 = valtex[0].ForecastDate.toDate();
            var dt2 = valtex[1].ForecastDate.toDate();
            m_AreaInfoList = valtex;
            Sm_AreaInfoList = valtex;
            Get12Hour(valtex);
        })
    }
}

//获取七天预报数据
var res;
function Get12Hour(res) {
    var tdStyle = "background:#E9F1F4;width: 100%;height: 100%;float: left;text-align: center;border: 1px solid #fff;";//设置表格行的背景样式
    var tdStyle2 = "width: 100%;height: 100%;float: left;text-align: center;border: 1px solid #fff;";//设置表格行的背景样式
    if (res.length > 0) {
        var StrTable = "<table id=\"Day7TableInfo\"><tr><th style='width:100px;'>时间</th><th>天气状况</th><th>降雨量</th><th>最低温度℃</th><th>最高温度℃</th><th>风向</th><th>风速</th></tr>";
        //console.table(res);
        for (var i = 0; i < Math.floor(res.length / 2) ; i++) {
            var dt1 = res[i * 2].ForecastDate.toDate();
            var Hours1 = dt1.getHours();
            var days1 = dt1.getDate();
            var dt2 = res[i * 2 + 1].ForecastDate.toDate();
            var Hours2 = dt2.getHours();
            var days2 = dt2.getDate();

            var dt3 = new Date(dt2.valueOf() + 60 * 60 * 1000 * 12);
            var Hours3 = dt3.getHours();
            var days3 = dt3.getDate();

            if (Hours1 == "23") {
                Hours1 = "20";
            } if (Hours1 == "11") {
                Hours1 = "8";
            }
            if (Hours2 == "23") {
                Hours2 = "20";
            } if (Hours2 == "11") {
                Hours2 = "8";
            }
            if (Hours3 == "23") {
                Hours3 = "20";
            } if (Hours3 == "11") {
                Hours3 = "8";
            }

            var StrDt1 = days1 + "日" + Hours1 + "时"
            var StrDt2 = days2 + "日" + Hours2 + "时"
            var StrDt3 = days3 + "日" + Hours3 + "时"

            if (i % 2 == 0) {
                StrTable += "<tr style='background-color:#E9F1F4'>" +
                                "<td style='width:160px;'>" + StrDt1 + "-" + StrDt2 + "</td>" +
                                "<td><input id=wea0-" + (i * 2) + " onblur=\"input_blur('wea0-" + (i * 2) + "')\" onfocus=\"input_click('wea0-" + (i * 2) + "')\" value= " + res[i * 2].Weather + " style='" + tdStyle + "'></td>" +
                                "<td><input id=rain0-" + (i * 2) + " onblur=\"input_blur('rain0-" + (i * 2) + "')\" onfocus=\"input_click('rain0-" + (i * 2) + "')\" value= " + res[i * 2].Rain + " style='" + tdStyle + "'></td>" +
                                "<td><input id=mintemp0-" + (i * 2) + " onblur=\"input_blur('mintemp0-" + (i * 2) + "')\" onfocus=\"input_click('mintemp0-" + (i * 2) + "')\" value= " + res[i * 2].MinTemp + " style='" + tdStyle + "'></td>" +
                                "<td><input id=maxtemp0-" + (i * 2) + " onblur=\"input_blur('maxtemp0-" + (i * 2) + "')\" onfocus=\"input_click('maxtemp0-" + (i * 2) + "')\" value= " + res[i * 2].MaxTemp + " style='" + tdStyle + "'></td>" +
                                "<td><input id=wind0-" + (i * 2) + " onblur=\"input_blur('wind0-" + (i * 2) + "')\" onfocus=\"input_click('wind0-" + (i * 2) + "')\" value= " + res[i * 2].WindDirectName + " style='" + tdStyle + "'></td>" +
                                "<td><input id=windspeend0-" + (i * 2) + " onblur=\"input_blur('windspeend0-" + (i * 2) + "')\" onfocus=\"input_click('windspeend0-" + (i * 2) + "')\" value= " + res[i * 2].WindName + " style='" + tdStyle + "'></td>" +
                            "</tr>";
                StrTable += "<tr style='background-color:#E9F1F4'>" +
                                "<td style='width:160px;'>" + StrDt2 + "-" + StrDt3 + "</td>" +
                                "<td><input id=wea0-" + (i * 2 + 1) + " onblur=\"input_blur('wea0-" + (i * 2 + 1) + "')\" onfocus=\"input_click('wea0-" + (i * 2 + 1) + "')\" value= " + res[i * 2 + 1].Weather + " style='" + tdStyle + "'></td>" +
                                "<td><input id=rain0-" + (i * 2 + 1) + " onblur=\"input_blur('rain0-" + (i * 2 + 1) + "')\" onfocus=\"input_click('rain0-" + (i * 2 + 1) + "')\" value= " + res[i * 2 + 1].Rain + " style='" + tdStyle + "'></td>" +
                                "<td><input id=mintemp0-" + (i * 2 + 1) + " onblur=\"input_blur('mintemp0-" + (i * 2 + 1) + "')\" onfocus=\"input_click('mintemp0-" + (i * 2 + 1) + "')\" value= " + res[i * 2 + 1].MinTemp + " style='" + tdStyle + "'></td>" +
                                "<td><input id=maxtemp0-" + (i * 2 + 1) + " onblur=\"input_blur('maxtemp0-" + (i * 2 + 1) + "')\" onfocus=\"input_click('maxtemp0-" + (i * 2 + 1) + "')\" value= " + res[i * 2 + 1].MaxTemp + " style='" + tdStyle + "'></td>" +
                                "<td><input id=wind0-" + (i * 2 + 1) + " onblur=\"input_blur('wind0-" + (i * 2 + 1) + "')\" onfocus=\"input_click('wind0-" + (i * 2 + 1) + "')\" value= " + res[i * 2 + 1].WindDirectName + " style='" + tdStyle + "'></td>" +
                                "<td><input id=windspeend0-" + (i * 2 + 1) + " onblur=\"input_blur('windspeend0-" + (i * 2 + 1) + "')\" onfocus=\"input_click('windspeend0-" + (i * 2 + 1) + "')\" value= " + res[i * 2 + 1].WindName + " style='" + tdStyle + "'></td>" +
                            "</tr>";

            } else {
                StrTable += "<tr style='background-color:#FFFFFF'>" +
                                "<td style='width:160px;'>" + StrDt1 + "-" + StrDt2 + "</td>" +
                                "<td><input id=wea0-" + (i * 2) + " onblur=\"input_blur('wea0-" + (i * 2) + "')\" onfocus=\"input_click('wea0-" + (i * 2) + "')\" value= " + res[i * 2].Weather + " style='" + tdStyle2 + "'></td>" +
                                "<td><input id=rain0-" + (i * 2) + " onblur=\"input_blur('rain0-" + (i * 2) + "')\" onfocus=\"input_click('rain0-" + (i * 2) + "')\" value= " + res[i * 2].Rain + " style='" + tdStyle2 + "'></td>" +
                                "<td><input id=mintemp0-" + (i * 2) + " onblur=\"input_blur('mintemp0-" + (i * 2) + "')\" onfocus=\"input_click('mintemp0-" + (i * 2) + "')\" value= " + res[i * 2].MinTemp + " style='" + tdStyle2 + "'></td>" +
                                "<td><input id=maxtemp0-" + (i * 2) + " onblur=\"input_blur('maxtemp0-" + (i * 2) + "')\" onfocus=\"input_click('maxtemp0-" + (i * 2) + "')\" value= " + res[i * 2].MaxTemp + " style='" + tdStyle2 + "'></td>" +
                                "<td><input id=wind0-" + (i * 2) + " onblur=\"input_blur('wind0-" + (i * 2) + "')\" onfocus=\"input_click('wind0-" + (i * 2) + "')\" value= " + res[i * 2].WindDirectName + " style='" + tdStyle2 + "'></td>" +
                                "<td><input id=windspeend0-" + (i * 2) + " onblur=\"input_blur('windspeend0-" + (i * 2) + "')\" onfocus=\"input_click('windspeend0-" + (i * 2) + "')\" value= " + res[i * 2].WindName + " style='" + tdStyle2 + "'></td>" +
                            "</tr>";
                StrTable += "<tr style='background-color:#FFFFFF'>" +
                                "<td style='width:160px;'>" + StrDt2 + "-" + StrDt3 + "</td>" +
                                "<td><input id=wea0-" + (i * 2 + 1) + " onblur=\"input_blur('wea0-" + (i * 2 + 1) + "')\" onfocus=\"input_click('wea0-" + (i * 2 + 1) + "')\" value= " + res[i * 2 + 1].Weather + " style='" + tdStyle2 + "'></td>" +
                                "<td><input id=rain0-" + (i * 2 + 1) + " onblur=\"input_blur('rain0-" + (i * 2 + 1) + "')\" onfocus=\"input_click('rain0-" + (i * 2 + 1) + "')\" value= " + res[i * 2 + 1].Rain + " style='" + tdStyle2 + "'></td>" +
                                "<td><input id=mintemp0-" + (i * 2 + 1) + " onblur=\"input_blur('mintemp0-" + (i * 2 + 1) + "')\" onfocus=\"input_click('mintemp0-" + (i * 2 + 1) + "')\" value= " + res[i * 2 + 1].MinTemp + " style='" + tdStyle2 + "'></td>" +
                                "<td><input id=maxtemp0-" + (i * 2 + 1) + " onblur=\"input_blur('maxtemp0-" + (i * 2 + 1) + "')\" onfocus=\"input_click('maxtemp0-" + (i * 2 + 1) + "')\" value= " + res[i * 2 + 1].MaxTemp + " style='" + tdStyle2 + "'></td>" +
                                "<td><input id=wind0-" + (i * 2 + 1) + " onblur=\"input_blur('wind0-" + (i * 2 + 1) + "')\" onfocus=\"input_click('wind0-" + (i * 2 + 1) + "')\" value= " + res[i * 2 + 1].WindDirectName + " style='" + tdStyle2 + "'></td>" +
                                "<td><input id=windspeend0-" + (i * 2 + 1) + " onblur=\"input_blur('windspeend0-" + (i * 2 + 1) + "')\" onfocus=\"input_click('windspeend0-" + (i * 2 + 1) + "')\" value= " + res[i * 2 + 1].WindName + " style='" + tdStyle2 + "'></td>" +
                            "</tr>";
            }
        }
        StrTable += "</table>";
        $("#Day7Forecast").html(StrTable);
        $("#Day7Forecast").show();
    } else {
        $("#Day7Forecast").hide();
    }
}

//input改为可编辑状态 Sm_AreaDaysInfoList琼山区
function input_click(value) {
    $("#" + value).css("border", "1px solid green");
}

//zhou
function input_blur(value) {
    var count = 0; //用来判断是否有修改
    $("#" + value).css("background", "#63b363");
    $("#" + value).css("border", "1px solid #fff");
    var indexName = value.split('-')[0];
    var index = value.split('-')[1];
    if (AreaName == "琼山区") {
        switch (indexName) {
            case "wea0":
                Sm_AreaInfoList[index].Weather = $("#" + value).val();
                break;
            case "rain0":
                if (Sm_AreaInfoList[index].Rain != $("#" + value).val())
                    count++;
                Sm_AreaInfoList[index].Rain = $("#" + value).val();
                break;
            case "mintemp0":
                if (Sm_AreaInfoList[index].MinTemp != $("#" + value).val())
                    count++;
                Sm_AreaInfoList[index].MinTemp = $("#" + value).val();
                break;
            case "maxtemp0":
                if (Sm_AreaInfoList[index].MaxTemp != $("#" + value).val())
                    count++;
                Sm_AreaInfoList[index].MaxTemp = $("#" + value).val();
                break;
            case "wind0":
                Sm_AreaInfoList[index].WindDirectName = $("#" + value).val();
                break;
            case "windspeed":
                Sm_AreaInfoList[index].WindName = $("#" + value).val();
                break;
        }
    } else {
        switch (indexName) {
            case "wea0":
                Sm_AreaDaysInfoList[index].Weather = $("#" + value).val();
                break;
            case "rain0":
                if (Sm_AreaInfoList[index].Rain != $("#" + value).val())
                    count++;
                Sm_AreaDaysInfoList[index].Rain = $("#" + value).val();
                break;
            case "mintemp0":
                if (Sm_AreaInfoList[index].MinTemp != $("#" + value).val())
                    count++;
                Sm_AreaDaysInfoList[index].MinTemp = $("#" + value).val();
                break;
            case "maxtemp0":
                if (Sm_AreaInfoList[index].MaxTemp != $("#" + value).val())
                    count++;
                Sm_AreaDaysInfoList[index].MaxTemp = $("#" + value).val();
                break;
            case "wind0":
                Sm_AreaDaysInfoList[index].WindDirectName = $("#" + value).val();
                break;
            case "windspeed":
                Sm_AreaDaysInfoList[index].WindName = $("#" + value).val();
                break;
        }
    }
    //判断是否有修改的值，如果有就刷新
    if (count > 0) {
        //zhou调用数据改变图形改变
        GetEchartsData(AreaName, ForecastId, time);
    }
}

//上网文件历史查询
function GatHistoryData(StartDt, EndDt) {
    common.prototype.webService("GetHour12InfoListS", {
        StartDt: StartDt,
        EndDt: EndDt,
        Max: FlipMax,
        Min: FlipMin
    }, function (res) {
        var StrTable = "<table id=\"HisTableInfo\"><tr><th style='width:100px;'>预报时次</th><th>类别</th><th>是否上网</th><th>是否比武</th><th>预报员</th><th>保存时间</th><th>上网文件上传时间</th><th>上网文件下载</th></tr>";
        var index = 0;
        if (res.length > 0) {
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
                                    "<td>" + res[i].Score9 + "</td>" +
                                    "<td>" + res[i].Score10 + "</td>" +
                                    "<td>" + res[i].Score7 + "</td>" +
                                    "<td>" + res[i].Score3 + "</td>" +
                                    "<td>" + res[i].Score4 + "</td>" +
                                    "<td>" + StrUrl + "</td>" +
                               "</tr>";
                } else {
                    StrTable += "<tr style='background-color:#FFFFFF'>" +
                                    "<td style='width:160px;'>" + res[i].ScoreName + "</td>" +
                                    "<td>" + res[i].Score1 + "</td>" +
                                    "<td>" + res[i].Score9 + "</td>" +
                                    "<td>" + res[i].Score10 + "</td>" +
                                    "<td>" + res[i].Score7 + "</td>" +
                                    "<td>" + res[i].Score3 + "</td>" +
                                    "<td>" + res[i].Score4 + "</td>" +
                                    "<td>" + StrUrl + "</td>" +
                                "</tr>";
                }
            }
            StrTable += "</table>";
            $("#HistoryData").html(StrTable);
        }
    })
}

function GetHour12InfoListCount(StartDt, EndDt) {
    common.prototype.webService("GetHour12InfoListCountS", {
        StartDt: StartDt,
        EndDt: EndDt
    }, function (res) {
        if (res > 0) {
            FlipSum = res;
        }
        laypage();
    });
}


//七天预报数据（逐12小时）
function GetEchartsData(AreaName, ForecastId, time) {
    //如果点击的是琼山的按钮数据不刷新
    if (time == "1" && AreaName == "琼山区") {
        resDate = Sm_AreaInfoList;
        GetEcharts(resDate);
    }

    if (time != "1") {
        common.prototype.webService("Get12HourForecastInfo", {
            AreaName: AreaName,
            ForecastId: ForecastId,
            DtPage: DtPage
        }, function (valtex) {
            GetEcharts(valtex);
        })
    }
}

var resDate;
function GetEcharts(resDate) {
    G_WeatherInfoList = res //zhou 目的是输入数据改变图形跟着改变
    var RainData = [];
    var TempMax = [];
    var TempMin = [];
    var DtChange = DtPage + " 00:00:00";
    DtChange = DtChange.toDate();
    var dt = new Date()
    // 获取日期部分 toLocaleDateString();
    if (resDate.length > 0) {
        for (var i = 0; i < resDate.length ; i++) {
            RainData.push(resDate[i].Rain)
            TempMax.push(resDate[i].MaxTemp);
            TempMin.push(resDate[i].MinTemp);
        }
        var dt = resDate[0].ForecastDate.toDate().format("yyyy-MM-dd HH:mm:ss");
        DataBindRainEch(dt, RainData, TempMax, TempMin);
        $("#ChartT").show();
    } else {
        $("#ChartT").hide();
    }
}

function GetDataMes(AreaName, ForecastId, DtPage) {
    common.prototype.webService("GetDataMes", {
        AreaName: AreaName,
        ForecastId: ForecastId,
        DtPage: DtPage
    }, function (res) {
        if (res != "") {
            layer.msg(res);
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
//用Echarts控件加载（10天预报）的雨量和风速信息
function DataBindRainEch(dt, dataRain, dataMaxTemp, dataMinTemp) {
    // 使用
    require(
    [
        'echarts',
        'echarts/chart/line', // 使用线状图就加载line模块，按需加载
        'echarts/chart/bar' // 使用柱状图就加载bar模块，按需加载
    ],
    function (ec) {
        // 基于准备好的dom，初始化echarts图表
        var myChart = ec.init(document.getElementById('ChartT'));
        var option = {
            title: {
                text: '格点预报  起报时间：' + dt,
                x: 'center'
                //subtext: '雨量单位:(毫米),风速单位:(米/秒)'
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
                data: ['降雨', '24小时最高温度', '24小时最低温度']
            },
            calculable: true,
            dataZoom: {
                show: true,
                realtime: true,
                start: 0,
                end: 100
            },
            xAxis: [
                        {
                            type: 'category',
                            boundaryGap: true,
                            data: ['12', '24', '36', '48', '60', '72', '84', '96', '108', '120',
                             '132', '144', '156', '168', '180', '192', '204', '216', '228', '240']
                            //data: xData
                        }
            ],
            yAxis: [
                    {
                        type: 'value',
                        name: '温度（℃）',
                        splitNumber: 4,
                        axisLabel: {
                            formatter: '{value}'
                        }
                    }, {
                        type: 'value',
                        name: '降雨（mm）',
                        splitNumber: 4,
                        axisLabel: {
                            formatter: '{value}'
                        }
                    }
            ],
            series: [
                    {
                        name: '降雨',
                        type: 'bar',
                        color: 'red',
                        smooth: true,
                        yAxisIndex: 1,
                        //设置是否显示面
                        //itemStyle: { normal: { areaStyle: { type: 'default'}} },
                        //绑定数据
                        data: dataRain
                        //data: [1.2, 3.5, 6.7, 1.5, 3.1, 10, 9.40, 11.2, 6.1, 2.4,
                        //                         1.2, 9.0, 2.0, 11.3, 6.1, 2.4, 1.0, 9.0, 2.0, 6.5,
                        //                         1.2, 3.5, 6.7, 1.5, 3.1, 10, 9.40, 11.2, 6.1, 2.4],
                    }, {
                        name: '24小时最高温度',
                        type: 'line',
                        color: 'yellow',
                        smooth: true,
                        itemStyle: {
                            normal: {
                                label: {
                                    show: true, textStyle: {
                                        fontWeight: "bolder",
                                        color: "red"
                                    }
                                }
                            }
                        },
                        //设置是否显示面
                        //itemStyle: { normal: { areaStyle: { type: 'default'}} },
                        //绑定数据
                        data: dataMaxTemp
                        //data: [29, 30, 31, 52, 51, 50, 49, 11.2, 6.1, 2.4,
                        // 1.2, 9.0, 2.0, 11.3, 6.1, 2.4, 1.0, 9.0, 2.0, 6.5, 1.2, 9.0, 2.0, 11.3, 6.1, 2.4, 1.0, 9.0, 2.0, 6.5, 1.2, 9.0, 2.0, 11.3, 6.1, 2.4, 1.0, 9.0, 2.0, 6.5, 1.2, 9.0, 2.0, 11.3, 6.1, 2.4, 1.0, 9.0, 2.0, 6.5, 1.2, 9.0, 2.0, 11.3, 6.1, 2.4, 1.0, 9.0, 2.0, 6.5,
                        //]
                        //data: dataRain
                    }, {
                        name: '24小时最低温度',
                        type: 'line',
                        color: 'blue',
                        smooth: true,
                        itemStyle: {
                            normal: {
                                label: {
                                    show: true, textStyle: {
                                        fontWeight: 'bolder',
                                        fontSize: '12',
                                    }, position: 'bottom'
                                }
                            }
                        },
                        //设置是否显示面
                        //itemStyle: { normal: { areaStyle: { type: 'default'}} },
                        //绑定数据
                        data: dataMinTemp
                        //data: [0.1, 30, 31, -10, 2, -2, -15, 11.2, 6.1, 2.4,
                        // 1.2, 9.0, 2.0, 11.3, 6.1, 2.4, 1.0, 9.0, 2.0, 6.5, 1.2, 9.0, 2.0, 11.3, 6.1, 2.4, 1.0, 9.0, 2.0, 6.5, 1.2, 9.0, 2.0, 11.3, 6.1, 2.4, 1.0, 9.0, 2.0, 6.5, 1.2, 9.0, 2.0, 11.3, 6.1, 2.4, 1.0, 9.0, 2.0, 6.5, 1.2, 9.0, 2.0, 11.3, 6.1, 2.4, 1.0, 9.0, 2.0, 6.5,
                        //]
                    }
            ]
        };
        // 为echarts对象加载数据 
        myChart.setOption(option);
    }
);
}



