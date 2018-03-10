// 对Date的扩展，将 Date 转化为指定格式的String   
// 月(M)、日(d)、小时(h)、分(m)、秒(s)、季度(q) 可以用 1-2 个占位符，   
// 年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字)   
// 例子：   
// (new Date()).format("yyyy-MM-dd hh:mm:ss.S") ==> 2006-07-02 08:09:04.423
// (new Date()).format("yyyy-M-d h:m:s.S")      ==> 2006-7-2 8:9:4.18
//访问服务器的方法
var WebMethod = {
    DefaultPage: "default.aspx",
    _buiPoseJson: function (method, args, url, contentType, dataType) {
        args = args == null ? {} : JSON.stringify(args);
        contentType = contentType == undefined ? "application/json; charset=utf-8" : contentType;
        dataType = dataType == undefined ? "json" : dataType;
        url = url == null ? document.location.href : url;
        var searchIndex = url.indexOf("?");
        if (searchIndex != -1) { url = url.substring(0, searchIndex); }
        if (url.lastIndexOf("/") == url.length - 1) url += WebMethod.DefaultPage;
        url += "/" + method;
        return { type: "POST", url: url, data: args, contentType: contentType, dataType: dataType, error: WebMethod.alertError }
    },
    callBack: function (method, args, handle) {
        var postJson = WebMethod._buiPoseJson(method, args, handle.url);
        if (handle instanceof Function) postJson.success = function (json) { handle(typeof json.d == "undefined" ? json : json.d); };
        else {
            if (handle.success != undefined) {
                if (handle.context == undefined) postJson.success = function (json) { handle.success(typeof json.d == "undefined" ? json : json.d); };
                else postJson.success = function (json) { handle.success.call(handle.context, typeof json.d == "undefined" ? json : json.d); };
            }
            if (handle.error != undefined && handle.context == undefined)
                postJson.error = handle.error;
            postJson.async = handle.async != false;
        } $.ajax(postJson);
    },
    alertError: function (err) {
        var errorMessage = "";
        if (typeof (err.responseJSON) != "undefined") { errorMessage = err.responseJSON.Message; }
        else {
            var temp = /\<title\>(.*)\<\/title\>/.exec(err.responseText);
            if (temp != null) errorMessage = temp[1];
        }
        if (errorMessage == "") errorMessage = err.responseText.replace(/^\s+/g, '');
        if (errorMessage != "") alert(errorMessage);
    }
};
Date.format = function (fmt) { //author: meizz   
    var o = {
        "M+": this.getMonth() + 1,               //月份   
        "d+": this.getDate(),                    //日   
        "h+": this.getHours(),                   //小时   
        "m+": this.getMinutes(),                 //分   
        "s+": this.getSeconds(),                 //秒   
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度   
        "S": this.getMilliseconds()             //毫秒   
    };
    if (/(y+)/.test(fmt))
        fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt))
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
}
Date.addHours = function (h) {
    this.setHours(this.getHours() + h);
};
Date.addMinutes = function (mi) {
    this.setMinutes(this.getMinutes() + mi);
};
Date.addDays = function (d) {
    this.setDate(this.getDate() + d);
};
Date.addWeeks = function (w) {
    this.addDays(w * 7);
};
Date.addMonths = function (m) {
    var d = this.getDate();
    this.setMonth(this.getMonth() + m);

    if (this.getDate() < d)
        this.setDate(0);
};
Date.addYears = function (y) {
    var m = this.getMonth();
    this.setFullYear(this.getFullYear() + y);

    if (m < this.getMonth()) {
        this.setDate(0);
    }
};


var time; var date; var weathertime;
var TVtype = 0;
var Weatherqk = "";
var chuWeather = "";
var weekday = ["Sun", "Mon", "Tues", "Wed", "Thur", "Fri", "Sat"];
var Tvalue = "";  //zhou
$(function () {
    //var curDate = new Date(); 
    //date = new Date(curDate.getTime() - 24 * 60 * 60 * 1000);

    //适配不同分辨率
    //$("body").css("zoom", screen.width / 1600);
    //$("#layui-layer1").css("-ms-zoom", screen.width / 1600);

    date = new Date();
    $("#date").val(date.format("yyyy-MM-dd"));
    selectData("08");
});
selectData = function (value) {
    //$("#button06").removeClass();
    //$("#button06").addClass("button");
    //$("#button11").removeClass();
    //$("#button11").addClass("button");
    //$("#button16").removeClass();
    //$("#button16").addClass("button");
    $("#top ul li button").removeClass("active");

    var luru;
    if (value == 08) {
        luru = "读取昨天08:00录入结果";
        $("#button06").addClass("active");
        $("#button16").removeClass("active");
        $("#dateser01").text("逐6小时雨量（mm）08-14:");
        $("#dateser02").text("14-20:");
        $("#dateser03").text("20-02:");
        $("#dateser04").text("02-08:");
        $("#nameil").text("今天早晨至傍晚（8-20时）天气预测    (数据来源：格点预报，仅供预报员参考)");
        $(".weatherTip0").text("天气状况");
        $(".weatherTip1").text("");
        Tvalue = "08";
    }
    //if (value == 11) {
    //    luru = "读取06:00录入结果";
    //    $("#dateser01").text("逐6小时雨量（mm）08-14:");
    //    $("#dateser02").text("14-20:");
    //    $("#dateser03").text("20-02:");
    //    $("#dateser04").text("02-08:");
    //    $("#nameil").text("今天中午至傍晚（12-20时）天气预测    (数据来源：格点预报，仅供预报员参考)");
    //    $(".weatherTip0").text("天气状况");
    //    $(".weatherTip1").text("");
    //    Tvalue = "11";
    //}
    //if (value == 16) {
    //    luru = "读取11:00录入结果";
    //    $("#dateser01").text("逐6小时雨量（mm）20-02:");
    //    $("#dateser02").text("02-08:");
    //    $("#dateser03").text("08-14:");
    //    $("#dateser04").text("14-20:");
    //    $("#nameil").text("今天夜间到明天白天（今日20时-明日20时）天气预测    (数据来源：格点预报，仅供预报员参考)");
    //    $(".weatherTip0").text("夜间天况");
    //    $(".weatherTip1").text("明天天况");
    //    Tvalue = "16";
    //}
    if (value == 20) {
        luru = "读取20:00录入结果";
        $("#button16").addClass("active");
        $("#button06").removeClass("active");
        $("#dateser01").text("逐6小时雨量（mm）20-02:");
        $("#dateser02").text("02-08:");
        $("#dateser03").text("08-14:");
        $("#dateser04").text("14-20:");
        $("#nameil").text("今天夜间到明天白天（今日20时-明日20时）天气预测    (数据来源：格点预报，仅供预报员参考)");
        $(".weatherTip0").text("夜间天况");
        $(".weatherTip1").text("明天天况");
        Tvalue = "20";
    }
    $("#luruResult").html(luru);


    //$("#button" + value).removeClass("button");
    //$("#button" + value).addClass("buttonof");
    time = $("#date").val() + " " + value + ":00:00";  
    weathertime = time;
    doload();
}
//十天预报上半部分
doload = function () {
    $.post("/WebService.asmx/getTideHigh", {
        dateTime: time
    }, function (msg) {
        if (msg != "" && msg != undefined) {
            msg = JSON.parse(msg);
            $("#weatherValue").val(msg.PastTimes);
            $("#weatherFuture").html(msg.Future);
            $("#mintemp").val(msg.MinTemp);
            $("#maxtemp").val(msg.MaxTemp);
            $("#minHumidity").val(msg.Humidity);
            $("#maxHumidity").val(msg.MaxHumidity);
            $("#windli").val(msg.WindName); //风力
            $("#zhenwind").val(msg.WindGust); //阵风
            $("#english").val(msg.WEATHEREN);
            $("#chinese").val(msg.Weather);
            for (var tq = 1; tq < msg.Weather.split('；').length; tq++) {
                Weatherqk += msg.Weather.split('；')[tq] + "；";
            }
            chuWeather = msg.Weather.split('；')[0];
            //火险
            for (var i = 0; i < document.getElementById("fire").length; i++) {
                if (msg.ForestFireLevel == document.getElementById("fire").options[i].value) {
                    document.getElementById("fire").options[i].selected = true;
                    break;
                }
            }
            //风向
            for (var j = 0; j < document.getElementById("windleft").length; j++) {
                if (msg.WindDirectName.replace(/\s/g, "") == document.getElementById("windleft").options[j].value) {
                    document.getElementById("windleft").options[j].selected = true;
                    break;
                }
            }
            for (var k = 0; k < document.getElementById("windright").length; k++) {
                if (msg.WindDirectName2 == document.getElementById("windright").options[k].value) {
                    document.getElementById("windright").options[k].selected = true;
                    break;
                }
            }
            //中暑
            for (var i = 0; i < document.getElementById("Hightemp").length; i++) {
                if (msg.HIGHTEMPLEVEL == document.getElementById("Hightemp").options[i].value) {
                    document.getElementById("Hightemp").options[i].selected = true;
                    break;
                }
            }
            //一氧化碳中毒  NOPOISONINGLEVEL
            for (var i = 0; i < document.getElementById("CO1").length; i++) {
                if (msg.NOPOISONINGLEVEL == document.getElementById("CO1").options[i].value) {
                    document.getElementById("CO1").options[i].selected = true;
                    break;
                }
            }

            $("#rainoneHour").val(msg.SixHourRainOne);
            $("#raintwoHour").val(msg.SixHourRainTwo);
            $("#rainthreeHour").val(msg.SixHourRainThree);
            $("#rainfourHour").val(msg.SixHourRainFour);
            if (msg.WeatherIcon != "" && msg.WeatherIcon != undefined) {
                document.getElementById("ye").src = "../../Images/tq/" + msg.WeatherIcon;
            }
            else {
                document.getElementById("ye").src = "";
            }
            if (msg.WeatherIcon2 != "" && msg.WeatherIcon2 != undefined) {
                document.getElementById("bai").src = "../../Images/tq/" + msg.WeatherIcon2;
            }
            else {
                document.getElementById("bai").src = "";
            }
            if (msg.CityTVIcon != "" && msg.CityTVIcon != undefined) {
                document.getElementById("cityImg").src = "../../Images/tq/" + msg.CityTVIcon;
                $("#cityId").css("display", "");
                $("#cityImg").css("display", "");
                TVtype = 1;
            }
            else {
                $("#cityId").css("display", "none");
                $("#cityImg").css("display", "none");
                TVtype = 0;
            }
        }
        else {
            layer.msg("数据缺省！");
        }
    });

    //下半部分预报员数据查询
    $.post("/WebService.asmx/GetWelfareForecastDaysInfo", {
        dateTime: time
    }, function (result) {
        if (result != "" && result != undefined) {
            result = JSON.parse(result);
            for (var i = 0; i < result.length; i++) {
                $("#left0" + (i + 1) + "-Temp1").val(result[i].MinTemp);
                $("#right0" + (i + 1) + "-Temp2").val(result[i].MaxTemp);

                //风向
                for (var j = 0; j < document.getElementById("windfx0" + (i + 1)).length; j++) {
                    if (result[i].WindDirectName.replace(/\s/g, "") == document.getElementById("windfx0" + (i + 1)).options[j].value) {
                        document.getElementById("windfx0" + (i + 1)).options[j].selected = true;
                        break;
                    }
                }
                //风力
                $("#left0" + (i + 1) + "-windli1").val(result[i].WindName);
                $("#right0" + (i + 1) + "-windli2").val(result[i].WindGust);
                //相对湿度
                $("#left0" + (i + 1) + "-Humidity").val(result[i].Humidity + "%");
                $("#right0" + (i + 1) + "-maxHumidity").val(result[i].MaxHumidity + "%");
                //雨量
                $("#rainValue0" + (i + 1)).val(result[i].Rain);
                $("#rainValue0" + (i + 1) + "-edit").val(result[i].Rain);
                //图片
                document.getElementById("oneday0" + (i + 1) + "-img1").src = "../../Images/tq/" + result[i].WeatherIcon;
                //中英文
                $("#oneday0" + (i + 1) + "-Ctext").val("CN: " + result[i].Weather);
                $("#oneday0" + (i + 1) + "-text").val("EN: " + result[i].WEATHEREN);

                var strdate = result[i].ForecastDate.replace(/T/g, ' ')
                var d = new Date(strdate.replace(/-/g, "/").substr(0, strdate.length));

                var ar_date = [d.getFullYear(), d.getMonth() + 1, d.getDate()];
                var forecastDate = new Date(ar_date[0] + "/" + ar_date[1] + "/" + ar_date[2]);
                var day = forecastDate.getDay();
                $("#date0" + (i + 1)).html(ar_date[1] + "/" + ar_date[2]);
                $("#week0" + (i + 1)).html(weekday[day]);
            }
        }
        else {
            layer.msg("数据缺省");
        }
    });

    //获取7天格点数据参考
    $.post("/WebService.asmx/GetWelfareForecastDaysECInfo", {
        dateTime: time
    }, function (result) {
        if (result != "" && result != undefined) {
            result = JSON.parse(result);
            for (var i = 0; i < result.length-3; i++) {
                //图片
                document.getElementById("oneday0" + (i + 1) + "-img2").src = "../../Images/tq/" + result[i].WeatherIcon;
                //温度
                $("#Ectemp0" + (i + 1)).html(result[i].MinTemp + "-" + result[i].MaxTemp);
                //风向
                $("#Ecwindfx0" + (i + 1)).html(result[i].WindDirectName);
                //风力
                $("#Ecwindli0" + (i + 1)).html(result[i].WindName + "-" + result[i].WindGust);
            }
        }
        else {
            layer.msg("数据缺省");
        }
    });

    $.post("/WebService.asmx/GetUserInfoname", {}, function (result) {
        if (result != "" && result != undefined) {
            result = JSON.parse(result);
            for (var i = 0; i < result.length; i++) {
                var userHtml;
                userHtml += "<option>" + result[i].UserName + "</option>";
            }
            $("#cbUser").append(userHtml);
        }
        else {
            layer.msg("用户数据缺失");
        }
    });
    $.post("/WebService.asmx/Get10DaysForecaster", {
        dateTime: time
    }, function (result) {
        if (result != "" && result != undefined) {
            result = JSON.parse(result);
            for (var j = 0; j < document.getElementById("cbUser").length; j++) {
                if (result == document.getElementById("cbUser").options[j].value) {
                    document.getElementById("cbUser").options[j].selected = true;
                    break;
                }
            }
        }
        else {
            layer.msg("用户数据缺失");
        }
    });
}
var onId = 0; var xuonId = 0; var footId = 0;
var imgWeather; var tiao = false;
var xianshi = false;
var dianji = 0;
choiseWeath = function (value) {
    if (dianji = 1) {
        $("#" + footId).css("border", "1px solid #B2CCB2");
        $("#" + onId).css("border", "1px solid #B2CCB2");
        $(".xuanfu").css("display", "none");
        dianji = 0;
    }
    $(".xuanfu").css("display", "block");
    dianji = 1;
    onId = value;
    tiao = true;
    $("#" + onId).css("border", "1px solid red");
    $(function () {
        $(".xuanfu div label").click(function () {
            var id = this.id;
            if (id == "" || id == undefined) {
                return;
            }
            var imagesrc = id.split('-')[1];
            if (onId == "ye") {
                $("#Hiddimg1").val(id);
            }
            if (onId == "bai") {
                $("#Hiddimg2").val(id);
            }
            if (tiao) {
                var weather = $("#" + id).text();
                if (onId != "cityImg") {
                    $("#english").val(weather.split('(')[1]);
                    //                            chuWeather = weather.split('(')[0];
                    if ($("#Hiddimg1").val() != "" && $("#Hiddimg2").val() != "")
                        $("#chinese").val($("#" + $("#Hiddimg1").val()).text().split('(')[0] + "转" + $("#" + $("#Hiddimg2").val()).text().split('(')[0] + "；" + Weatherqk);
                    if ($("#Hiddimg1").val() != "" && $("#Hiddimg2").val() == "")
                        $("#chinese").val($("#" + $("#Hiddimg1").val()).text().split('(')[0] + Weatherqk);
                    if ($("#Hiddimg2").val() != "" && $("#Hiddimg1").val() == "") {
                        if (chuWeather != "")
                            $("#chinese").val(chuWeather + "转" + $("#" + $("#Hiddimg2").val()).text().split('(')[0] + Weatherqk);
                        else
                            $("#chinese").val($("#" + $("#Hiddimg2").val()).text().split('(')[0] + Weatherqk);
                    }
                }
                document.getElementById(onId).src = "../../Images/tq/" + imagesrc + ".png";
                $("#" + onId).css("border", "1px solid #B2CCB2");
            }
            else {
                var weathertext = $("#" + id).text();
                $("#" + imgWeather.split('-')[0] + "-text").val("EN: " + weathertext.split('(')[1]);
                $("#" + imgWeather.split('-')[0] + "-Ctext").val("CN: " + weathertext.split('(')[0]);
                document.getElementById(imgWeather).src = "../../Images/tq/" + imagesrc + ".png";
                $("#" + footId).css("border", "1px solid #B2CCB2");
            }
            $(".xuanfu").css("display", "none");
            xianshi = false;
        }); 
    })
}

$(function () {
    $(".foot div label img").click(function () {
        if (dianji = 1) {
            $("#" + footId).css("border", "1px solid #B2CCB2");
            $("#" + onId).css("border", "1px solid #B2CCB2");
            $(".xuanfu").css("display", "none");
            dianji = 0;
        }
        $(".xuanfu").css("display", "block");
        dianji = 1;
        imgWeather = this.id;
        footId = imgWeather;
        tiao = false;
        $("#" + footId).css("border", "1px solid red");
        $(".xuanfu div label").click(function () {
            var id = this.id;
            if (id == undefined || id == "") {
                return;
            }
            var imagesrc = id.split('-')[1];
            if (tiao) {
                var weather = $("#" + id).text();
                $("#english").val(weather.split('(')[1]);
                $("#chinese").val(weather.split('(')[0]);
                document.getElementById(onId).src = "../../Images/tq/" + imagesrc + ".png";
                $("#" + onId).css("border", "1px solid #B2CCB2");
            }
            else {
                var weathertext = $("#" + id).text();
                $("#" + imgWeather.split('-')[0] + "-text").val("EN: " + weathertext.split('(')[1]);
                $("#" + imgWeather.split('-')[0] + "-Ctext").val("CN: " + weathertext.split('(')[0]);
                document.getElementById(imgWeather).src = "../../Images/tq/" + imagesrc + ".png";
                $("#" + footId).css("border", "1px solid #B2CCB2");
            }
            $(".xuanfu").css("display", "none");
            xianshi = false;
        });
    });
})

var array = ["0", "0.1", "0.2", "0.3", "0.4", "0.5", "0.6", "0.7", "0.8", "0.9", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "25", "30", "35", "40", "45", "50", "55", "60", "65", "70", "75", "80", "85", "90", "95", "100"];
$(function () {
    for (var i = 1; i < 10; i++) {
        var html = "";
        for (var rain = 0; rain < array.length; rain++) {
            html += "<option>" + array[rain] + "</option>";
        }
        $("#rainValue0" + i).append(html);
    }
})
dateHandle = function () {
    var Time = $("#date").val();
    $("#date").val(Time.split(' ')[0]);
    selectData("08");
}


realase = function () {
    var user = $("#cbUser").val();
    var upassword = $("#passwad").val();
    if ($("#passwad").val() == "") {
        layer.msg("请输入预报员密码");
    }
    else {
        $.post("/WebService.asmx/GetUserInfoname", {}, function (result) {
            result = JSON.parse(result);
            for (var i = 0; i < result.length; i++) {               
                if (result[i].UserName == user && result[i].UPassword == $("#passwad").val()) {
                    $("#foreaceUser").text($("#cbUser").val());
                    $(".realsePage").css("display", "block");
                    $("#allContent").css("display", "none");

                    $("#yearEdit").text(date.format("yyyyMMdd").substring(2));
                    $("#weathHG").html($("#weatherValue").val());
                    $("#weilai").html($("#weatherFuture").val());
                    $("#row1").html("我市" + $("#chinese").val().split('；')[0]) + "；";
                    $("#row2").html("气温" + $("#mintemp").val() + "℃-" + $("#maxtemp").val() + "℃") + "；";
                    $("#row3").html($("#windleft").val() + "风" + $("#windli").val() + "级") + "；";
                    $("#row4").html("相对湿度" + $("#minHumidity").val() + "%-" + $("#maxHumidity").val()) + "%。";


                    var imageUrl = new Array;
                    var ChEnEdit = new Array;
                    var TempEdit = new Array;
                    var WindEdit = new Array;
                    var HumitEdit = new Array;
                    var dateWeek = new Array;
                    var RainEourpe = new Array;
                    var check = new Array;
                    for (var i = 1; i <= 9; i++) {
                        imageUrl[(i - 1)] = document.getElementById("oneday0" + i + "-img1").src.split('/')[5] + "|" + document.getElementById("oneday0" + i + "-img2").src.split('/')[5];
                        ChEnEdit[(i - 1)] = $("#oneday0" + i + "-Ctext").val() + "|" + $("#oneday0" + i + "-text").val();
                        TempEdit[(i - 1)] = $("#left0" + i + "-Temp1").val() + "|" + $("#right0" + i + "-Temp2").val();
                        WindEdit[(i - 1)] = $("#windfx0" + i).val() + "|" + $("#left0" + i + "-windli1").val() + "|" + $("#right0" + i + "-windli2").val();
                        HumitEdit[(i - 1)] = $("#left0" + i + "-Humidity").val().replace("%", "") + "|" + $("#right0" + i + "-maxHumidity").val().replace("%", "");
                        dateWeek[(i - 1)] = $("#date0" + i).text() + "|" + $("#week0" + i).text();
                        RainEourpe[(i - 1)] = $("#rainValue0" + i + "-edit").val();
                    }
                    //当前预报数据
                    var todayforecast = new Array;
                    todayforecast[0] = $("#weatherValue").val();
                    todayforecast[1] = $("#weatherFuture").val();
                    todayforecast[2] = $("#fire").val();
                    todayforecast[3] = $("#Hightemp").val();
                    todayforecast[4] = $("#CO1").val();
                    todayforecast[5] = $("#mintemp").val() + "-" + $("#maxtemp").val();
                    todayforecast[6] = $("#windli").val();
                    todayforecast[7] = $("#zhenwind").val();
                    todayforecast[8] = $("#windleft").val() + "-" + $("#windright").val();
                    todayforecast[9] = $("#minHumidity").val() + "-" + $("#maxHumidity").val();
                    todayforecast[10] = $("#rainoneHour").val() + "-" + $("#raintwoHour").val() + "-" + $("#rainthreeHour").val() + "-" + $("#rainfourHour").val();
                    todayforecast[11] = $("#english").val();
                    todayforecast[12] = document.getElementById("ye").src.split('/')[5] + "-" + document.getElementById("bai").src.split('/')[5] + "-" + document.getElementById("cityImg").src.split('/')[5];
                    todayforecast[13] = $("#chinese").val();

                    var table = "";
                    $("#biaoge").html("");
                    var table = "<table style=\"border-collapse: collapse;\">"
                    table += "<tr><th style='border: 1px solid #4F4E4E;text-align: center;'>时间</th>";
                    for (var s = 0; s < imageUrl.length; s++) {
                        table += "<th style='border: 1px solid #4F4E4E;text-align: center;'>" + dateWeek[s].split('|')[0].split('/')[0] + "月" + dateWeek[s].split('|')[0].split('/')[1] + "日<br>" + dateWeek[s].split('|')[1] + "</th>";
                    }
                    table += "</tr><tr><th style='border: 1px solid #4F4E4E;text-align: center;'>天气</th>";
                    for (var s = 0; s < imageUrl.length; s++) {
                        table += "<th style='border: 1px solid #4F4E4E;text-align: center;'><img src=../../Images/tq/" + imageUrl[s].split('|')[0] + "><br>" + ChEnEdit[s].split('|')[0].split(':')[1] + "</th>";

                    }
                    table += "</tr><tr><th style='border: 1px solid #4F4E4E;text-align: center;'>温度</th>";
                    for (var s = 0; s < TempEdit.length; s++) {
                        table += "<th style='border: 1px solid #4F4E4E;text-align: center;'>" + TempEdit[s].split('|')[0] + "℃-" + TempEdit[s].split('|')[1] + "℃</th>";

                    }
                    table += "</tr><tr><th style='border: 1px solid #4F4E4E;text-align: center;'>风</th>";
                    for (var s = 0; s < WindEdit.length; s++) {
                        table += "<th style='border: 1px solid #4F4E4E;text-align: center;'>" + WindEdit[s].split('|')[0] + "风<br>" + WindEdit[s].split('|')[1] + "-" + WindEdit[s].split('|')[2] + "级</th>";

                    }
                    table += "</tr><tr><th style='border: 1px solid #4F4E4E;text-align: center;'>相对湿度</th>";
                    for (var s = 0; s < HumitEdit.length; s++) {
                        table += "<th style='border: 1px solid #4F4E4E;text-align: center;'>" + HumitEdit[s].split('|')[0] + "%-" + HumitEdit[s].split('|')[1] + "%</th>";

                    }
                    table += "</tr></table>";
                    $("#biaoge").append(table);

                    if (TVtype == 0) {
                        $("#tvCity").css("display", "none");
                    } else {
                        $("#tvCity").css("display", "block");
                        document.getElementById("dianshi").src = document.getElementById("cityImg").src;
                    }

                    if (document.getElementById("chuanzhen").checked) {
                        check[0] = true;
                    } else {
                        check[0] = false;
                    }
                    if (document.getElementById("weibo").checked) {
                        check[1] = true;
                    } else {
                        check[1] = false;
                    }
                    if (document.getElementById("word").checked) {
                        check[2] = true;
                    } else {
                        check[2] = false;
                    }
                    if (document.getElementById("realsofa").checked) {
                        check[3] = true;
                    } else {
                        check[3] = false;
                    }
                    //保存十天预报数据到模型，方便其他函数调用-关键
                    $.post("/WebService.asmx/SaveDate", {
                        todayData: JSON.stringify(todayforecast),
                        Arain: JSON.stringify(RainEourpe),
                        AimageUrl: JSON.stringify(imageUrl),
                        AChEnEdit: JSON.stringify(ChEnEdit),
                        ATempEdit: JSON.stringify(TempEdit),
                        AWindEdit: JSON.stringify(WindEdit),
                        AHumitEdit: JSON.stringify(HumitEdit),
                        Stat: JSON.stringify(check)
                    }, function (resultVal) {
                        //
                    });
                    break;
                }
                else {
                    if (i === result.length - 1) {
                        layer.msg("请输入正确密码！");
                    }
                    continue;
                }
            }

        });
    }
}
canlle_buuton = function () {
    $(".realsePage").css("display", "none");
    $("#allContent").css("display", "block");
}

realse_button = function () {
    layer.confirm('确认发布？', {
        btnAlign: 'c',
        btn: ['确定', '取消'] //按钮
    }, function () {
        loadpage();
        $.post("/WebService.asmx/insertSaveDate", {
            realseTime: weathertime,
            realseUser: $("#cbUser").val()
        }, function (result) {
            layer.close(load);
            if (result != undefined && result != "") {
                if (result) {
                    doload();
                    layer.msg("发布成功!");
                }
                else {
                    layer.msg("发布失败!");
                }
            }
        });
    }, function () {
    });
}

GetluruResult = function () {  
   var times = $("#date").val() + " " + Tvalue + ":00:00"; //zhou 添加
    var weatherTime = time;
    var newTime = new Date(times.split('-')[0], times.split('-')[1] - 1, times.split('-')[2].split(' ')[0], times.split('-')[2].split(' ')[1].substring(0, 2), "00", "00");
    switch (newTime.getHours()) {
        case 6:
            time = new Date(times.split('-')[0], times.split('-')[1] - 1, times.split('-')[2].split(' ')[0] - 1, times.split('-')[2].split(' ')[1].substring(0, 2), "00", "00").format("yyyy-MM-dd 16:mm:ss");
            break;
        case 11:
            time = newTime.format("yyyy-MM-dd 06:mm:ss");
            break;
        case 16:
            time = newTime.format("yyyy-MM-dd 11:mm:ss");
            break;
    }
    doload();
}

ReadValueForease = function () {
    $.post("/WebService.asmx/GetWelfareForecastCapsInfo", {
        dateTime: weathertime
    }, function (result) {
        if (result != "" && result != undefined) {
            msg = JSON.parse(result);
            try {
                $("#weatherValue").val(msg.PastTimes);
                $("#weatherFuture").html(msg.Future);
                $("#mintemp").val(msg.MinTemp);
                $("#maxtemp").val(msg.MaxTemp);
                $("#minHumidity").val(msg.Humidity);
                $("#maxHumidity").val(msg.MaxHumidity);
                $("#windli").val(msg.WindName); //风力
                $("#zhenwind").val(msg.WindGust); //阵风
                $("#english").val(msg.WEATHEREN);
                $("#chinese").val(msg.Weather);
                //火险
                if (msg.ForestFireLevel != null) {
                    for (var i = 0; i < document.getElementById("fire").length; i++) {
                        if (msg.ForestFireLevel == document.getElementById("fire").options[i].value) {
                            document.getElementById("fire").options[i].selected = true;
                            break;
                        }
                    }
                }
                //风向
                if (msg.WindDirectName != null) {
                    for (var j = 0; j < document.getElementById("windleft").length; j++) {
                        if (msg.WindDirectName.replace(/\s/g, "") == document.getElementById("windleft").options[j].value) {
                            document.getElementById("windleft").options[j].selected = true;
                            break;
                        }
                    }
                }
                if (msg.WindDirectName2 != null) {
                    for (var k = 0; k < document.getElementById("windright").length; k++) {
                        if (msg.WindDirectName2 == document.getElementById("windright").options[k].value) {
                            document.getElementById("windright").options[k].selected = true;
                            break;
                        }
                    }
                }
                //中暑
                if (msg.HIGHTEMPLEVEL != null) {
                    for (var i = 0; i < document.getElementById("Hightemp").length; i++) {
                        if (msg.HIGHTEMPLEVEL == document.getElementById("Hightemp").options[i].value.substring(0, 2)) {
                            document.getElementById("Hightemp").options[i].selected = true;
                            break;
                        }
                    }
                }
                //一氧化碳中毒
                $("#rainoneHour").val(msg.SixHourRainOne);
                $("#raintwoHour").val(msg.SixHourRainTwo);
                $("#rainthreeHour").val(msg.SixHourRainThree);
                $("#rainfourHour").val(msg.SixHourRainFour);
                if (msg.WeatherIcon != "" && msg.WeatherIcon != undefined && msg.WeatherIcon!=null) {
                    document.getElementById("ye").src = "../../Images/tq/" + msg.WeatherIcon;
                }
                else {
                    document.getElementById("ye").src = "";
                }
                if (msg.WeatherIcon2 != "" && msg.WeatherIcon2 != undefined && msg.WeatherIcon2!=null) {
                    document.getElementById("bai").src = "../../Images/tq/" + msg.WeatherIcon2;
                }
                else {
                    document.getElementById("bai").src = "";
                }
            }
            catch (e) {
                layer.mag("数据加载有误，请检查数值数据");
            }
        }
        else {
            layer.msg("数据缺省！");
        }
    });
}
//
out = function (id) {
    $("#" + id).css("color", "");
    $("#" + id).css("background", "");
}
over = function (id) {
    $("#" + id).css("color", "red");
    $("#" + id).css("background", "rgb(218, 222, 218)");
}

onblue = function () {
    $(".xuanfu").css("display", "none");
    if (tiao)
        $("#" + onId).css("border", "1px solid #B2CCB2");
    else
        $("#" + footId).css("border", "1px solid #B2CCB2");
}

/* 滚轮事件 */
var scrollFunc = function (e) {
    e = e || window.event;
    if (e.wheelDelta) { direct += (-e.wheelDelta / 120); } else if (e.detail) { direct += e.detail / 3; }

    if (direct >= 8) { goToFun(index++) }
    if (direct <= -8) { goToFun(index--) }
}
selerainValue = function (value) {
    $("#" + value + "-edit").val($("#" + value).val());
}
//load方法
function loadpage() {
    load = layer.msg('加载中', {
        icon: 16
        , shade: 0.01
        , time: 0
    });
}