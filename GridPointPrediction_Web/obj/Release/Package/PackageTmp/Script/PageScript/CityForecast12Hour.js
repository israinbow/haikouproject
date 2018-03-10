/// <reference path="../jquery-1.11.3/jquery.min.js" />

var AreaName = "福田区";
var ForecastId = "Forecast10";
var isCorrect = 0;//判断正常预报或者更正报
var openpage = null;
var isCompany = 0;//判断是否上网
var isUser = 0;//判断是否个人比武
var DtPage;
var QYidName = "ft";
var hourInfo;
var dayInfo;
var m_AreaInfoList;
var m_AreaDaysInfoList;
//存储修改之后的数据
var Sm_AreaInfoList;
var Sm_AreaDaysInfoList;
var FlipMax = 10;
var FlipMin = 1;
var FlipSum = 23;
var nums = 10; //每页出现的数据量

//zhou
var m_WeatherInfoList;
var G_WeatherInfoList; //存放上面图形返回的结果集
var Fz_count = "";
//zhou
$(function () {

    require.config({
        paths: {
            echarts: '../../Script/Charts/build/dist'
        }
    });

    GetMaxTime();
    BtnDisabledTrue();
    BtnDisplayNone();
    DtPage = $("#ForecastTime").val();
    GetUserInfo();
    GetCurrentForecast(ForecastId, DtPage);
    Day7ForecastData(AreaName, ForecastId, DtPage);
    GetEchartsData(AreaName, ForecastId, DtPage);
    GetHour12InfoListCount($("#HisStartTime").val(), $("#HisEndTime").val());
    //$("#" + QYidName).attr("style", "background-color: red;color: white;");
    //$("#" + QYidName).attr("name", "DQY");
    //获取全市所有预报数据
    GetInsertInfo(ForecastId, DtPage);

    $("#copydata").click(function () {

        //赋值区域
        var LisArea = GetQYId($("#LisQY").val());
        //被赋值区域
        var areaIndex = GetQYId(QYidName);

      
        //LisArea是下拉框选中的区域
        //areaIndex当前选中的区域

        //开始
        //if (hourInfo[LisArea].length > 0 && hourInfo[LisArea] != null) {
        //    for (var i = 0; i < hourInfo[LisArea].length; i++) {

        //        m_AreaInfoList[areaIndex][i].Weather = hourInfo[LisArea][i].Weather;
        //        m_AreaInfoList[areaIndex][i].Rain = hourInfo[LisArea][i].Rain;
        //        m_AreaInfoList[areaIndex][i].MinTemp = hourInfo[LisArea][i].MinTemp;
        //        m_AreaInfoList[areaIndex][i].MaxTemp = hourInfo[LisArea][i].MaxTemp;
        //        m_AreaInfoList[areaIndex][i].WindName = hourInfo[LisArea][i].WindName;
        //        m_AreaInfoList[areaIndex][i].WindDirectName = hourInfo[LisArea][i].WindDirectName;
        //    }
        //}
        //if (dayInfo[LisArea].length > 0 && dayInfo[LisArea] != null) {
        //    for (var i = 0; i < dayInfo[LisArea].length; i++) {
        //        m_AreaDaysInfoList[areaIndex[i]].Rain = dayInfo[LisArea][i].Weather;
        //        m_AreaDaysInfoList[areaIndex][i].Rain = dayInfo[LisArea][i].Rain;
        //        m_AreaDaysInfoList[areaIndex][i].MinTemp = dayInfo[LisArea][i].MinTemp;
        //        m_AreaDaysInfoList[areaIndex][i].MaxTemp = dayInfo[LisArea][i].MaxTemp;
        //        m_AreaDaysInfoList[areaIndex][i].WindName = dayInfo[LisArea][i].WindName;
        //        m_AreaDaysInfoList[areaIndex][i].WindDirectName = dayInfo[LisArea][i].WindDirectName;
        //    }
        //}
         
        //$("#" + QYidName).attr("style", "background-color: red;color: white;");
        //$("#" + QYidName).attr("name", "DQY");
        //结束

        //LisArea下拉框的值  Sm_AreaInfoList福田数组
        if (Fz_count == "") {
            if (LisArea == 0 && areaIndex == 1) {
                Day7ForecastData("福田区", ForecastId, DtPage);
                GetEchartsData("福田区", ForecastId, DtPage);
                Fz_count = "福田区";

                if (m_WeatherInfoList.length > 0) {
                    for (var i = 0; i < Sm_AreaDaysInfoList.length; i++) {

                        Sm_AreaDaysInfoList[i].Weather = Sm_AreaInfoList[i].Weather;
                        Sm_AreaDaysInfoList[i].Rain = Sm_AreaInfoList[i].Rain;
                        Sm_AreaDaysInfoList[i].MinTemp = Sm_AreaInfoList[i].MinTemp;
                        Sm_AreaDaysInfoList[i].MaxTemp = Sm_AreaInfoList[i].MaxTemp;
                        Sm_AreaDaysInfoList[i].WindName = Sm_AreaInfoList[i].WindName;
                        Sm_AreaDaysInfoList[i].WindDirectName = Sm_AreaInfoList[i].WindDirectName;
                      
                    }
                }

            }
            if (LisArea == 1&& areaIndex == 0) {

                Day7ForecastData("香港", ForecastId, DtPage);
                GetEchartsData("香港", ForecastId, DtPage);
                Fz_count = "香港"; //表示已经复制过了，只有当页面刷新是才能重新复制

                if (m_WeatherInfoList.length > 0) {
                    for (var i = 0; i < Sm_AreaInfoList.length; i++) {

                        Sm_AreaInfoList[i].Weather = Sm_AreaDaysInfoList[i].Weather;
                        Sm_AreaInfoList.Rain = Sm_AreaDaysInfoList[i].Rain;
                        Sm_AreaInfoList.MinTemp = Sm_AreaDaysInfoList[i].MinTemp;
                        Sm_AreaInfoList.MaxTemp = Sm_AreaDaysInfoList[i].MaxTemp;
                        Sm_AreaInfoList.WindName = Sm_AreaDaysInfoList[i].WindName;
                        Sm_AreaInfoList.WindDirectName = Sm_AreaDaysInfoList[i].WindDirectName;
                    }
                }
            }
        }
        //zhou复制功能

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

    $("#c_head ul li button").click(function () {
        if (this.id != "copydata") {

            SelectLisQY();
            QYidName = this.id;
            //$("#c_head ul li button").attr("style", "background-color: #E6F0F9;color: #306DA8;");
            //$("#ft").attr("style", "background-color: #0C8903;color: white;");

            $("#" + QYidName).attr("name", "DQY")
            BtnDQYStyle();
            $("#" + QYidName).attr("style", "background-color: red;color: white;");
            if (QYidName == "xg") {
                AreaName = "香港";
            }
                //else if (QYidName == "xg1") {
                //    AreaName = "香港1";
                //} else if (QYidName == "xg2") {
                //    AreaName = "香港2";
                //} else if (QYidName == "xg3") {
                //    AreaName = "香港3";
                //}
            else {
                AreaName = "福田区";
            }

            DtPage = $("#ForecastTime").val();
            //hzh chong xin fu  zhi
            GetInsertInfo(ForecastId, DtPage);

            BtnDisabledfalse();
            BtnDisplayBlock();

            //zhou修改
            if (Fz_count != "" && Fz_count != null) {

                //Day7ForecastData(Fz_count, ForecastId, DtPage);  //传复制的区域查询
                //GetEchartsData(Fz_count, ForecastId, DtPage);

            }
            else {
                Day7ForecastData(AreaName, ForecastId, DtPage);
                GetEchartsData(AreaName, ForecastId, DtPage);
            }
            //zhou修改

        }
    });



    $("#preview ul li button").click(function () {

        var UserName = $("#member").val();
        var UserPwd = $("#pwd").val();
        JudgeUserOrPwd(UserName, UserPwd, ForecastId, DtPage, this.id);
    });

    $("#btnCancel").click(function () {
        layer.close(openpage);
    });

    $("#btnIssue").click(function () {

        if ($('#rdSW').attr("value") == "上网") {
            isCompany = 1;
        } else {
            isCompany = 0;
        }
        InsertHour12WeatherInfo(ForecastId, DtPage, $("#member").val(), isUser, isCompany, isCorrect, m_AreaInfoList, m_AreaDaysInfoList);
    });

    $("#ForecastPeriod ul li button").click(function () {

        //zhou
        Fz_count = ""; //把复制表示清空
        //zhou

        ForecastId = this.id;
        $(".txtdate ul li button").attr("style", "color: #fff;background-color: #428bca;border-color: #357ebd;")
        $("#" + ForecastId).attr("style", "background-color: red; border: 1px solid red;")
        BtnQYStyle();
        $("#" + QYidName).attr("style", "background-color: red;color: white;");
        $("#" + QYidName).attr("name", "DQY");
        DtPage = $("#ForecastTime").val();
        BtnDisabledTrue();
        BtnDisplayNone();
        removeAllLisQY();
        //hzh 重新给数据赋值
        GetInsertInfo(ForecastId, DtPage);

        GetCurrentForecast(ForecastId, DtPage);
        Day7ForecastData(AreaName, ForecastId, DtPage);
        GetEchartsData(AreaName, ForecastId, DtPage);
    });
    $("#btnSelect").click(function () {
        GetHour12InfoListCount($("#HisStartTime").val(), $("#HisEndTime").val());
    });

    $("#NewData").click(function () {
        $(this).attr("style", "background-color: red; border: 1px solid red;height: 26px;line-height: 14px;margin-right: 10px;")
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
              //document.getElementById('HistoryData').innerHTML = StrTable;
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
    //var objOption = new Option(AreaName, QYidName);
    //objSelect.add(objOption);
    //var obj = document.getElementsByTagName("option")
    ////遍历option
    //for (var i = 0; i < obj.length; i++) {
    //    if (obj[i].value == '<%=swjg_dmSelect%>') {
    //        obj[i].selected = true;  //相等则选中
    //    }
    //}
}

//AreaName, ForecastId, DtPage


function DateSelect() {
    $("#NewData").attr("style", "background-color: #428bca; border-color: #357ebd;height: 26px;line-height: 14px;margin-right: 10px;")
    DtPage = $("#ForecastTime").val();
    Day7ForecastData(AreaName, ForecastId, DtPage);
    GetEchartsData(AreaName, ForecastId, DtPage);
}


function GetInsertInfo(ForecastId, DtPage) {
    common.prototype.webService("GetInfoAll", { ForecastId: ForecastId, DtPage: DtPage }, function (res) {
        if (res != null) {
            m_AreaInfoList = hourInfo = res[0];
            m_AreaDaysInfoList = dayInfo = res[1];
            //赋值给新数组进行修改hzh简单深拷贝

            //zhou注释
            //Sm_AreaInfoList = JSON.parse(JSON.stringify(res[0]));
            //Sm_AreaDaysInfoList = JSON.parse(JSON.stringify(res[1]));

        }
    });
    //zhou
    var ArName = new Array("福田区", "香港");
    var con = 0;
     for (var i = 0; i < 2; i++) {
         common.prototype.webService("Get12HourForecastInfo", { AreaName: ArName[i], ForecastId: ForecastId, DtPage: DtPage }, function (res) {
           
             if (con==0) {
                 Sm_AreaInfoList = res;
                 con++;
             }
             else {
                 Sm_AreaDaysInfoList = res;
             }

         });
     }
  
}
function GetQYId(Area) {
    var id = 0;
    switch (Area) {
        case "ft":
        case "福田区":
            id = 0;
            break;
        case "xg":
        case "香港":
            id = 1;
            break;
    }
    return id;
}

//实体序列化json  入库操作 ForecastId时段  DtPage日期  strForecaster 预报员 isUser 判断是否个人比武 isCompany 判断是否上网  isCorrect 判断正常预报或者更正报
function InsertHour12WeatherInfo(ForecastId, DtPage, strForecaster, isUser, isCompany, isCorrect, m_AreaInfoList, m_AreaDaysInfoList) {
     
    //var aa=JSON.stringify(m_AreaDaysInfoList);
     
    common.prototype.webService("InsertHour12WeatherInfo", { ForecastId: ForecastId, DtPage: DtPage, strForecaster: strForecaster, isUser: isUser, isCompany: isCompany, isCorrect: isCorrect, hourInfo: JSON.stringify(Sm_AreaInfoList), dayInfo: JSON.stringify(Sm_AreaDaysInfoList) }, function (res) {
        if (res) {
            //提示层
            layer.msg('入库成功！');
        } else {
            //提示层
            layer.msg('保存失败！请稍后重试，或联系管理员！！');
        }

    });
}

//显示弹窗曾
function ShowMes_Max() {
    $('#Mes_Max').removeAttr('class')
    openpage = layer.open({
        type: 1,
        title: '文件浏览',
        skin: 'layui-layer-rim', //加上边框
        area: ['900px', '550px'], //宽高
        content: $("#Mes_Max")
    });
}
//获取上网文件
function ShowPreviewWeb(ForecastId, DtPage) {
    common.prototype.webService("ShowPreviewWeb", { ForecastId: ForecastId, DtPage: DtPage, isCorrect: isCorrect }, function (res) {
        $("#Mes_text").text(res);
    });
}

//不可点击
function BtnDisabledTrue() {
    obj = document.getElementsByName("ll");
    for (i = 0; i < obj.length; i++) {
        document.getElementById(obj[i].id).disabled = true;
    }
}
//可点击
function BtnDisabledfalse() {
    obj = document.getElementsByName("ll");
    for (i = 0; i < obj.length; i++) {
        document.getElementById(obj[i].id).disabled = false;
    }
}
//可见
function BtnDisplayBlock() {
    obj = document.getElementsByName("KK");
    $(obj).each(function () {
        $(this).attr("style", "visibility:visible;");
    });
    $("#copydata").attr("style", "width: 130px;background-color: #306DA8;color: white;");
}
//不可见 
function BtnDisplayNone() {
    obj = document.getElementsByName("KK");
    $(obj).each(function () {
        $(this).attr("style", "visibility:hidden");
    });
}



function BtnDQYStyle() {
    var obj = document.getElementsByName("DQY");
    $(obj).each(function () {
        $(this).attr("style", "background-color: #0C8903;color: white;");
    });
}

function BtnQYStyle() {
    var obj = $(".DQY");
    $(obj).each(function () {
        $(this).attr("style", "background-color: #E6F0F9; color: #306DA8;");
        $(this).attr("name", "QY")
    })
    //for (i = 0; i < obj.length; i++) {
    //    $("#" + obj[i].id).attr("style", "background-color: #E6F0F9; color: #306DA8;");
    //    $("#" + obj[i].id).attr("name", "QY")
    //}
}



//获取最新时间
function GetMaxTime() {
    var date = new Date();
    $("#ForecastTime").val(date.format("yyyy-MM-dd"));
    var date1 = new Date(date.valueOf() - 60 * 60 * 1000 * 24 * 7);
    $("#HisStartTime").val(date1.format("yyyy-MM-dd"));
    $("#HisEndTime").val(date.format("yyyy-MM-dd"));
    intHours = date.getHours();
    if (intHours > 8 && intHours < 14) ForecastId = "Forecast10";
    else if (intHours == 14) ForecastId = "Forecast15";
    else if (intHours > 14) ForecastId = "Forecast16";
    $(".txtdate ul li button").attr("style", "color: #fff;background-color: #428bca;border-color: #357ebd;")
    $("#" + ForecastId).attr("style", "background-color: red; border: 1px solid red;")
}

//获取当前值班预报员
function GetCurrentForecast(ForecastId, DtPage) {
    common.prototype.webService("Get12HourForecaster", { ForecastId: ForecastId, DtPage: DtPage }, function (res) {
        document.getElementById("member").value = res;
        //$("#member").val(res);
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
    common.prototype.webService("JudgeUserOrPwd", { UserName: UserName, UserPwd: UserPwd }, function (res) {
        IsUser_Pwd(res, ForecastId, DtPage, ClickID);
    })
}


function IsUser_Pwd(User_Pwd, ForecastId, DtPage, ClickID) {
    if (User_Pwd) {
        GetDataMes(AreaName, ForecastId, DtPage);
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
        $("#preview ul li button").attr("style", "background-color: #E6F0F9;color: #306DA8;");
        $("#" + this.id).attr("style", "background-color: #306DA8;color: white;");
    } else {
        //提示层
        layer.msg('请输入正确的预报员密码！');
    }
}

//获取七天预报数据
function Day7ForecastData(AreaName, ForecastId, DtPage) {
    common.prototype.webService("Get12HourForecastInfo", { AreaName: AreaName, ForecastId: ForecastId, DtPage: DtPage }, function (res) {
        m_WeatherInfoList = res;
        if (res.length > 0) {

            var StrTable = "<table id=\"Day7TableInfo\"><tr><th style='width:100px;'>时间</th><th>天气状况</th><th>降雨量</th><th>最低温度℃</th><th>最高温度℃</th><th>风向</th><th>风速</th></tr>";
            //console.table(res);
            for (var i = 0; i < Math.floor(res.length / 2) ; i++) {//ceil
                var dt1 = res[i * 2].ForecastDate.toDate();
                var Hours1 = dt1.getHours();
                var days1 = dt1.getDate();


                var dt2 = res[i * 2 + 1].ForecastDate.toDate();
                var Hours2 = dt2.getHours();
                var days2 = dt2.getDate();

                var dt3 = new Date(dt2.valueOf() + 60 * 60 * 1000 * 12);
                var Hours3 = dt3.getHours();
                var days3 = dt3.getDate();


                if (Hours1 == "21") {
                    Hours1 = "20";
                } if (Hours1 == "09") {
                    Hours1 = "08";
                }
                if (Hours2 == "21") {
                    Hours2 = "20";
                } if (Hours2 == "09") {
                    Hours2 = "08";
                }
                if (Hours3 == "21") {
                    Hours3 = "20";
                } if (Hours3 == "09") {
                    Hours3 = "08";
                }


                var StrDt1 = days1 + "日" + Hours1 + "时"
                var StrDt2 = days2 + "日" + Hours2 + "时"
                var StrDt3 = days3 + "日" + Hours3 + "时"


                if (i % 2 == 0) {
                    //StrTable += "<tr style='background-color:#E9F1F4'><td style='width:160px;'>" + StrDt1 + "-" + StrDt2 + "</td><td>" + res[i * 2].Weather + "</td><td>" + res[i * 2].Rain + "</td><td>" + res[i * 2].MinTemp + "</td><td>" + res[i * 2].MaxTemp + "</td><td>" + res[i * 2].WindDirectName + "</td><td>" + res[i * 2].WindName + "</td></tr>";
                    //StrTable += "<tr style='background-color:#E9F1F4'><td style='width:160px;'>" + StrDt2 + "-" + StrDt3 + "</td><td>" + res[i * 2 + 1].Weather + "</td><td>" + res[i * 2 + 1].Rain + "</td><td>" + res[i * 2 + 1].MinTemp + "</td><td>" + res[i * 2 + 1].MaxTemp + "</td><td>" + res[i * 2 + 1].WindDirectName + "</td><td>" + res[i * 2 + 1].WindName + "</td></tr>";
                    StrTable += "<tr style='background-color:#E9F1F4'><td style='width:160px;'>" + StrDt1 + "-" + StrDt2+ "</td><td><input id=wea0-" + (i * 2) + " onblur=\"input_blur('wea0-" + (i * 2) + "')\" onfocus=\"input_click('wea0-" + (i * 2) + "')\" value= " + res[i * 2].Weather + " style='background:#E9F1F4;width: 100%;height: 100%;float: left;text-align: center;border: 1px solid #fff;'></td><td><input id=rain0-" + (i * 2) + " onblur=\"input_blur('rain0-" + (i * 2) + "')\" onfocus=\"input_click('rain0-" + (i * 2) + "')\" value= " + res[i * 2].Rain + " style='background:#E9F1F4;width: 100%;height: 100%;float: left;text-align: center;border: 1px solid #fff;'></td><td><input id=mintemp0-" + (i * 2) + " onblur=\"input_blur('mintemp0-" + (i * 2) + "')\" onfocus=\"input_click('mintemp0-" + (i * 2) + "')\" value= " + res[i * 2].MinTemp + " style='background:#E9F1F4;width: 100%;height: 100%;float: left;text-align: center;border: 1px solid #fff;'></td><td><input id=maxtemp0-" + (i * 2) + " onblur=\"input_blur('maxtemp0-" + (i * 2) + "')\" onfocus=\"input_click('maxtemp0-" + (i * 2) + "')\" value= " + res[i * 2].MaxTemp + " style='background:#E9F1F4;width: 100%;height: 100%;float: left;text-align: center;border: 1px solid #fff;'></td><td><input id=wind0-" + (i * 2) + " onblur=\"input_blur('wind0-" + (i * 2) + "')\" onfocus=\"input_click('wind0-" + (i * 2) + "')\" value= " + res[i * 2].WindDirectName + " style='background:#E9F1F4;width: 100%;height: 100%;float: left;text-align: center;border: 1px solid #fff;'></td><td><input id=windspeend0-" + (i * 2) + " onblur=\"input_blur('windspeend0-" + (i * 2) + "')\" onfocus=\"input_click('windspeend0-" + (i * 2) + "')\" value= " + res[i * 2].WindName + " style='background:#E9F1F4;width: 100%;height: 100%;float: left;text-align: center;border: 1px solid #fff;'></td></tr>";
                    StrTable += "<tr style='background-color:#E9F1F4'><td style='width:160px;'>" + StrDt2 + "-" + StrDt3 + "</td><td><input id=wea0-" + (i * 2 + 1) + " onblur=\"input_blur('wea0-" + (i * 2 + 1) + "')\" onfocus=\"input_click('wea0-" + (i * 2 + 1) + "')\" value= " + res[i * 2 + 1].Weather + " style='background:#E9F1F4;width: 100%;height: 100%;float: left;text-align: center;border: 1px solid #fff;'></td><td><input id=rain0-" + (i * 2 + 1) + " onblur=\"input_blur('rain0-" + (i * 2 + 1) + "')\" onfocus=\"input_click('rain0-" + (i * 2 + 1) + "')\" value= " + res[i * 2 + 1].Rain + " style='background:#E9F1F4;width: 100%;height: 100%;float: left;text-align: center;border: 1px solid #fff;'></td><td><input id=mintemp0-" + (i * 2 + 1) + " onblur=\"input_blur('mintemp0-" + (i * 2 + 1) + "')\" onfocus=\"input_click('mintemp0-" + (i * 2 + 1) + "')\" value= " + res[i * 2 + 1].MinTemp + " style='background:#E9F1F4;width: 100%;height: 100%;float: left;text-align: center;border: 1px solid #fff;'></td><td><input id=maxtemp0-" + (i * 2 + 1) + " onblur=\"input_blur('maxtemp0-" + (i * 2 + 1) + "')\" onfocus=\"input_click('maxtemp0-" + (i * 2 + 1) + "')\" value= " + res[i * 2 + 1].MaxTemp + " style='background:#E9F1F4;width: 100%;height: 100%;float: left;text-align: center;border: 1px solid #fff;'></td><td><input id=wind0-" + (i * 2 + 1) + " onblur=\"input_blur('wind0-" + (i * 2 + 1) + "')\" onfocus=\"input_click('wind0-" + (i * 2 + 1) + "')\" value= " + res[i * 2 + 1].WindDirectName + " style='background:#E9F1F4;width: 100%;height: 100%;float: left;text-align: center;border: 1px solid #fff;'></td><td><input id=windspeend0-" + (i * 2 + 1) + " onblur=\"input_blur('windspeend0-" + (i * 2 + 1) + "')\" onfocus=\"input_click('windspeend0-" + (i * 2 + 1) + "')\" value= " + res[i * 2 + 1].WindName + " style='background:#E9F1F4;width: 100%;height: 100%;float: left;text-align: center;border: 1px solid #fff;'></td></tr>";

                } else {
                    //StrTable += "<tr style='background-color:#FFFFFF'><td style='width:160px;'>" + StrDt1 + "-" + StrDt2 + "</td><td>" + res[i * 2].Weather + "</td><td>" + res[i * 2].Rain + "</td><td>" + res[i * 2].MinTemp + "</td><td>" + res[i * 2].MaxTemp + "</td><td>" + res[i * 2].WindDirectName + "</td><td>" + res[i * 2].WindName + "</td></tr>";
                    //StrTable += "<tr style='background-color:#FFFFFF'><td style='width:160px;'>" + StrDt2 + "-" + StrDt3 + "</td><td>" + res[i * 2 + 1].Weather + "</td><td>" + res[i * 2 + 1].Rain + "</td><td>" + res[i * 2 + 1].MinTemp + "</td><td>" + res[i * 2 + 1].MaxTemp + "</td><td>" + res[i * 2 + 1].WindDirectName + "</td><td>" + res[i * 2 + 1].WindName + "</td></tr>";

                    StrTable += "<tr style='background-color:#FFFFFF'><td style='width:160px;'>" + StrDt1 + "-" + StrDt2 + "</td><td><input id=wea0-" + (i * 2) + " onblur=\"input_blur('wea0-" + (i * 2) + "')\" onfocus=\"input_click('wea0-" + (i * 2) + "')\" value= " + res[i * 2].Weather + " style='width: 100%;height: 100%;float: left;text-align: center;border: 1px solid #fff;'></td><td><input id=rain0-" + (i * 2) + " onblur=\"input_blur('rain0-" + (i * 2) + "')\" onfocus=\"input_click('rain0-" + (i * 2) + "')\" value= " + res[i * 2].Rain + " style='width: 100%;height: 100%;float: left;text-align: center;border: 1px solid #fff;'></td><td><input id=mintemp0-" + (i * 2) + " onblur=\"input_blur('mintemp0-" + (i * 2) + "')\" onfocus=\"input_click('mintemp0-" + (i * 2) + "')\" value= " + res[i * 2].MinTemp + " style='width: 100%;height: 100%;float: left;text-align: center;border: 1px solid #fff;'></td><td><input id=maxtemp0-" + (i * 2) + " onblur=\"input_blur('maxtemp0-" + (i * 2) + "')\" onfocus=\"input_click('maxtemp0-" + (i * 2) + "')\" value= " + res[i * 2].MaxTemp + " style='width: 100%;height: 100%;float: left;text-align: center;border: 1px solid #fff;'></td><td><input id=wind0-" + (i * 2) + " onblur=\"input_blur('wind0-" + (i * 2) + "')\" onfocus=\"input_click('wind0-" + (i * 2) + "')\" value= " + res[i * 2].WindDirectName + " style='width: 100%;height: 100%;float: left;text-align: center;border: 1px solid #fff;'></td><td><input id=windspeend0-" + (i * 2) + " onblur=\"input_blur('windspeend0-" + (i * 2) + "')\" onfocus=\"input_click('windspeend0-" + (i * 2) + "')\" value= " + res[i * 2].WindName + " style='width: 100%;height: 100%;float: left;text-align: center;border: 1px solid #fff;'></td></tr>";
                    StrTable += "<tr style='background-color:#FFFFFF'><td style='width:160px;'>" + StrDt2 + "-" + StrDt3 + "</td><td><input id=wea0-" + (i * 2 + 1) + " onblur=\"input_blur('wea0-" + (i * 2 + 1) + "')\" onfocus=\"input_click('wea0-" + (i * 2 + 1) + "')\" value= " + res[i * 2 + 1].Weather + " style='width: 100%;height: 100%;float: left;text-align: center;border: 1px solid #fff;'></td><td><input id=rain0-" + (i * 2 + 1) + " onblur=\"input_blur('rain0-" + (i * 2 + 1) + "')\" onfocus=\"input_click('rain0-" + (i * 2 + 1) + "')\" value= " + res[i * 2 + 1].Rain + " style='width: 100%;height: 100%;float: left;text-align: center;border: 1px solid #fff;'></td><td><input id=mintemp0-" + (i * 2 + 1) + " onblur=\"input_blur('mintemp0-" + (i * 2 + 1) + "')\" onfocus=\"input_click('mintemp0-" + (i * 2 + 1) + "')\" value= " + res[i * 2 + 1].MinTemp + " style='width: 100%;height: 100%;float: left;text-align: center;border: 1px solid #fff;'></td><td><input id=maxtemp0-" + (i * 2 + 1) + " onblur=\"input_blur('maxtemp0-" + (i * 2 + 1) + "')\" onfocus=\"input_click('maxtemp0-" + (i * 2 + 1) + "')\" value= " + res[i * 2 + 1].MaxTemp + " style='width: 100%;height: 100%;float: left;text-align: center;border: 1px solid #fff;'></td><td><input id=wind0-" + (i * 2 + 1) + " onblur=\"input_blur('wind0-" + (i * 2 + 1) + "')\" onfocus=\"input_click('wind0-" + (i * 2 + 1) + "')\" value= " + res[i * 2 + 1].WindDirectName + " style='width: 100%;height: 100%;float: left;text-align: center;border: 1px solid #fff;'></td><td><input id=windspeend0-" + (i * 2 + 1) + " onblur=\"input_blur('windspeend0-" + (i * 2 + 1) + "')\" onfocus=\"input_click('windspeend0-" + (i * 2 + 1) + "')\" value= " + res[i * 2 + 1].WindName + " style='width: 100%;height: 100%;float: left;text-align: center;border: 1px solid #fff;'></td></tr>";

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

//input改为可编辑状态 Sm_AreaInfoList, Sm_AreaDaysInfoList香港、福田区
function input_click(value) {
    $("#" + value).css("border", "1px solid green");
}
//更新页面数据
//何的方法
//function input_blur2(value) {

//    $("#" + value).css("background", "#63b363");
//    $("#" + value).css("border", "1px solid #fff");
//    var indexName = value.split('-')[0];
//    var index = value.split('-')[1];
//    if (index == 0 || index == 1) {
//        switch (indexName) {
//            case "wea0":
//                if (AreaName == "福田区")
//                    Sm_AreaInfoList[0][index].Weather = $("#" + value).val();
//                else
//                    Sm_AreaInfoList[1][index].Weather = $("#" + value).val();                  
//                break;
//            case "rain0":
//                if (AreaName == "福田区") {
//                    Sm_AreaInfoList[0][index].Rain = $("#" + value).val();

//                }
//                else
//                    Sm_AreaInfoList[1][index].Rain = $("#" + value).val();
//                break;
//            case "mintemp0":
//                if (AreaName == "福田区") {
//                    Sm_AreaInfoList[0][index].MinTemp = $("#" + value).val();

//                }
//                else
//                    Sm_AreaInfoList[1][index].MinTemp = $("#" + value).val();
//                break;
//            case "maxtemp":
//                if (AreaName == "福田区") {
//                    Sm_AreaInfoList[0][index].MaxTemp = $("#" + value).val();

//                }
//                else
//                    Sm_AreaInfoList[1][index].MaxTemp = $("#" + value).val();
//                break;
//            case "wind0":
//                if (AreaName == "福田区")
//                    Sm_AreaInfoList[0][index].WindDirectName = $("#" + value).val();
//                else
//                    Sm_AreaInfoList[1][index].WindDirectName = $("#" + value).val();
//                break;
//            case "windspeed":
//                if (AreaName == "福田区")
//                    Sm_AreaInfoList[0][index].WindName = $("#" + value).val();
//                else
//                    Sm_AreaInfoList[1][index].WindName = $("#" + value).val();
//                break
//        }
//    }
//    else {
//        switch (indexName) {
//            case "wea0":
//                if (AreaName == "福田区")
//                    Sm_AreaDaysInfoList[0][index].Weather = $("#" + value).val();
//                else
//                    Sm_AreaDaysInfoList[1][index].Weather = $("#" + value).val();
//                break;
//            case "rain0":
//                if (AreaName == "福田区") {
//                    Sm_AreaDaysInfoList[0][index].Rain = $("#" + value).val();

//                }
//                else
//                    Sm_AreaDaysInfoList[1][index].Weather = $("#" + value).val();
//                break;
//            case "mintemp0":
//                if (AreaName == "福田区"){
//                    Sm_AreaDaysInfoList[0][index].MinTemp = $("#" + value).val();

//                }
//                else
//                    Sm_AreaDaysInfoList[1][index].Weather = $("#" + value).val();
//                break;
//            case "maxtemp":
//                if (AreaName == "福田区") {
//                    Sm_AreaDaysInfoList[0][index].MaxTemp = $("#" + value).val();

//                }
//                else
//                    Sm_AreaDaysInfoList[1][index].Weather = $("#" + value).val();
//                break;
//            case "wind0":
//                if (AreaName == "福田区")
//                    Sm_AreaDaysInfoList[0][index].WindDirectName = $("#" + value).val();
//                else
//                    Sm_AreaDaysInfoList[1][index].Weather = $("#" + value).val();
//                break;
//            case "windspeed":
//                if (AreaName == "福田区")
//                    Sm_AreaDaysInfoList[0][index].WindName = $("#" + value).val();
//                else
//                    Sm_AreaDaysInfoList[1][index].Weather = $("#" + value).val();
//                break
//        }
//    }

   
//}

//zhou
function input_blur(value) {
    var count=0; //用来判断是否有修改
    $("#" + value).css("background", "#63b363");
    $("#" + value).css("border", "1px solid #fff");
    var indexName = value.split('-')[0];
    var index = value.split('-')[1];
    if (index == 0 || index == 1) {
        if (AreaName == "福田区") {
            switch (indexName) {
                case "wea0":
                    Sm_AreaInfoList[index].Weather = $("#" + value).val();
                    break;

                case "rain0":
                    Sm_AreaInfoList[index].Rain = $("#" + value).val();

                    if (G_WeatherInfoList[index].Rain != $("#" + value).val())
                        count++;
                    G_WeatherInfoList[index].Rain = $("#" + value).val();
                    break;
                case "mintemp0":
                    Sm_AreaInfoList[index].MinTemp = $("#" + value).val();
                    if (G_WeatherInfoList[index].MinTemp != $("#" + value).val())
                        count++;
                    G_WeatherInfoList[index].MinTemp = $("#" + value).val();
                    break;

                case "maxtemp0":
                    Sm_AreaInfoList[index].MaxTemp = $("#" + value).val();
                    if (G_WeatherInfoList[index].MaxTemp != $("#" + value).val())
                        count++;
                    G_WeatherInfoList[index].MaxTemp = $("#" + value).val();
                    break;

                case "wind0":
                    Sm_AreaInfoList[index].WindDirectName = $("#" + value).val();
                    break;
                case "windspeed":
                    Sm_AreaInfoList[index].WindName = $("#" + value).val();
                    break;
            }
        }

        else {
            switch (indexName) {
                case "wea0":
                    Sm_AreaDaysInfoList[index].Weather = $("#" + value).val();
                    break;

                case "rain0":
                    Sm_AreaDaysInfoList[index].Rain = $("#" + value).val();
                    if (G_WeatherInfoList[index].Rain != $("#" + value).val())
                        count++;
                    G_WeatherInfoList[index].Rain = $("#" + value).val();
                    break;
                case "mintemp0":
                    Sm_AreaDaysInfoList[index].MinTemp = $("#" + value).val();
                    if (G_WeatherInfoList[index].MinTemp != $("#" + value).val())
                        count++;
                    G_WeatherInfoList[index].MinTemp = $("#" + value).val();
                    break;

                case "maxtemp0":
                    Sm_AreaDaysInfoList[index].MaxTemp = $("#" + value).val();
                    if (G_WeatherInfoList[index].MaxTemp != $("#" + value).val())
                        count++;
                    G_WeatherInfoList[index].MaxTemp = $("#" + value).val();
                    break;

                case "wind0":
                    Sm_AreaDaysInfoList[index].WindDirectName = $("#" + value).val();
                    break;
                case "windspeed":
                    Sm_AreaDaysInfoList[index].WindName = $("#" + value).val();
                    break;

            }

        }
    
    }

    //判断是否有修改的值，如果有就刷新
    if (count > 0) {
        GetNewEchartsData(G_WeatherInfoList)  //zhou调用数据改变图形改变
    }
}



//上网文件历史查询
function GatHistoryData(StartDt, EndDt) {
    common.prototype.webService("GetHour12InfoListS", { StartDt: StartDt, EndDt: EndDt, Max: FlipMax, Min: FlipMin }, function (res) {
        var StrTable = "<table id=\"HisTableInfo\"><tr><th style='width:100px;'>预报时次</th><th>类别</th><th>是否上网</th><th>是否比武</th><th>预报员</th><th>保存时间</th><th>上网文件上传时间</th><th>上网文件下载</th></tr>";
        var index = 0;
        if (res.length > 0) {

            for (var i = 0; i < res.length; i++) {
                if (i % 2 == 0) {
                    StrTable += "<tr style='background-color:#E9F1F4'><td style='width:160px;'>" + res[i].ScoreName + "</td><td>" + res[i].Score1 + "</td><td>" + res[i].Score9 + "</td><td>" + res[i].Score10 + "</td><td>" + res[i].Score7 + "</td><td>" + res[i].Score3 + "</td><td>" + res[i].Score4 + "</td><td><a  href=\"http://10.153.96.140:8012/LFSProducts/" + res[i].Score5 + "\" >下载</a></td></tr>";
                } else {
                    StrTable += "<tr style='background-color:#FFFFFF'><td style='width:160px;'>" + res[i].ScoreName + "</td><td>" + res[i].Score1 + "</td><td>" + res[i].Score9 + "</td><td>" + res[i].Score10 + "</td><td>" + res[i].Score7 + "</td><td>" + res[i].Score3 + "</td><td>" + res[i].Score4 + "</td><td><a href=\"http://10.153.96.140:8012/LFSProducts/" + res[i].Score5 + "\">下载</a></td></tr>";
                }
            }
            StrTable += "</table>";
            $("#HistoryData").html(StrTable);
        }
    })
}

function GetHour12InfoListCount(StartDt, EndDt) {
    common.prototype.webService("GetHour12InfoListCountS", { StartDt: StartDt, EndDt: EndDt }, function (res) {
        if (res > 0) {
            FlipSum = res;
        }
        laypage();
    });
}


//七天预报数据（逐12小时）
function GetEchartsData(AreaName, ForecastId, DtPage) {
    common.prototype.webService("Get12HourForecastInfo", { AreaName: AreaName, ForecastId: ForecastId, DtPage: DtPage }, function (res) {
        G_WeatherInfoList=res //zhou 目的是输入数据改变图形跟着改变

        var RainData = [];
        var TempMax = [];
        var TempMin = [];  
        var DtChange = DtPage + " 00:00:00";
        DtChange = DtChange.toDate();
        var dt = new Date()
        // 获取日期部分 toLocaleDateString();
        if (res.length > 0) {
            for (var i = 0; i < res.length ; i++) {
                RainData.push(res[i].Rain)
                TempMax.push(res[i].MaxTemp);
                TempMin.push(res[i].MinTemp);
            }


            var dt = res[0].ForecastDate.toDate().format("yyyy-MM-dd HH:mm:ss");

            DataBindRainEch(dt, RainData, TempMax, TempMin);
            $("#ChartT").show();
        } else {

            $("#ChartT").hide();
        }


    });
}

//zhou   输入数据改变图形跟着改变
function GetNewEchartsData(G_WeatherInfoList) {
    var RainData = [];
    var TempMax = [];
    var TempMin = [];
    var DtChange = DtPage + " 00:00:00";
    DtChange = DtChange.toDate();
    var dt = new Date()
    // 获取日期部分 toLocaleDateString();
    if (G_WeatherInfoList.length > 0) {
        for (var i = 0; i < G_WeatherInfoList.length ; i++) {
            RainData.push(G_WeatherInfoList[i].Rain)
            TempMax.push(G_WeatherInfoList[i].MaxTemp);
            TempMin.push(G_WeatherInfoList[i].MinTemp);
        }


        var dt = G_WeatherInfoList[0].ForecastDate.toDate().format("yyyy-MM-dd HH:mm:ss");

        DataBindRainEch(dt, RainData, TempMax, TempMin);
        $("#ChartT").show();
    } else {

        $("#ChartT").hide();
    }

}

//zhou



function GetDataMes(AreaName, ForecastId, DtPage) {
    common.prototype.webService("GetDataMes", { AreaName: AreaName, ForecastId: ForecastId, DtPage: DtPage }, function (res) {
        if (res != "") {
            layer.msg(res);
        }
    });
}


//用Echarts控件加载（10天预报）的雨量和风速信息
function DataBindRainEch(dt, dataRain, dataMaxTemp, dataMinTemp) {
    //function DataBindRainEch() {

    // 使用
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
                //subtext: '雨量单位:(毫米),风速单位:(米/秒)'
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
                             '132', '144', '156', '168']
                            //data: xData

                        }
            ],
            yAxis: [

                    {
                        type: 'value',
                        name: '温度（℃）',
                        //min: 0,
                        //max: GetMaxData(dataRain),
                        splitNumber: 4,
                        axisLabel: {
                            formatter: '{value}'
                            //                                formatter: function (value) {
                            //                                    //return value.toFixed(1);
                            //                                    return parseFloat(value).toFixed(1) + 'mm'
                            //                                }
                        }
                    }, {
                        type: 'value',
                        name: '降雨（mm）',
                        //                            min: 0,
                        //                            max: 40,
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
                        itemStyle: { normal: { label: { show: true, textStyle: {  
                            fontWeight:'bolder',  
                            fontSize : '12',  
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



