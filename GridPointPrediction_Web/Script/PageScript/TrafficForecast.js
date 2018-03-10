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

var time;//最新时间
var typeValue = "08"//预报时间：08和20
var messPeriod = "1";//报文期数
var weathertime;
var onId = 0;
var footId = 0;
var imgWeather;
var tiao = false;
var xianshi = false;
var dianji = 0;
//初始化页面
$(function () {
    //加载最新时间到时间控件
    date = new Date();
    //设置时间控件为当前最新时间
    $("#date").val(date.format("yyyy-MM-dd"));
    //初始化专报预报时间
    selectData("08");
    //取预报员数据
    $.post("/WebService.asmx/GetUserInfoname", {}, function (result) {
        if (result != "" && result != undefined) {
            result = JSON.parse(result);
            for (var i = 0; i < result.length; i++) {
                var userHtml;
                userHtml += "<option>" + result[i].UserName + "</option>";
            }
            $("#cbUser").append(userHtml);
        } else {
            layer.msg("用户数据缺失");
        }
    });
    //发布
    $(".releaseReport").click(function () {
        layer.confirm('确认发布？', {
            btnAlign: 'c',
            btn: ['确定', '取消'] //按钮
        }, function () {
            loadpage();
            $.post("/WebService.asmx/insertTrafficSaveData", {
                realseTime: weathertime,
                realseUser: $("#cbUser").val()
            }, function (result) {
                layer.close(load);
                if (result != undefined && result != "") {
                    if (result) {
                        //doload();
                        layer.msg("发布成功!");
                    }
                    else {
                        layer.msg("发布失败!");
                    }
                }
            });
        }, function () {
        });
    });

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
                //$("#english").val(weather.split('(')[1]);
                $("#chinese").val(weather.split('(')[0]);
                document.getElementById(onId).src = "../../Images/tq/" + imagesrc + ".png";
                $("#" + onId).css("border", "1px solid #B2CCB2");
            }
            else {
                var weathertext = $("#" + id).text();
                //$("#" + imgWeather.split('-')[0] + "-text").val("EN: " + weathertext.split('(')[1]);
                $("#" + imgWeather.split('-')[0] + "-Ctext").val("CN: " + weathertext.split('(')[0]);
                document.getElementById(imgWeather).src = "../../Images/tq/" + imagesrc + ".png";
                $("#" + footId).css("border", "1px solid #B2CCB2");
            }
            $(".xuanfu").css("display", "none");
            xianshi = false;
        });
    });
})

dateHandle = function () {
    var Time = $("#date").val();
    $("#date").val(Time.split(' ')[0]);
    selectData("08");
}
//预报时间选择
selectData = function (value) {
    $("#top ul li button").removeClass("active");
    if (value == 08) {
        $("#button08").addClass("active");
        $("#button20").removeClass("active");
        typeValue = "08"
    }
    if (value == 20) {
        $("#button20").addClass("active");
        $("#button08").removeClass("active");
        typeValue = "20"
    }
    time = $("#date").val() + " " + value + ":00:00";
    weathertime = time;
    //初始化加载页面数据
    init();
}

function init() {
    //取春运专报数据，并填充到页面
    $.post("/WebService.asmx/getTrafficTideHigh", {
        dateTime: time
    }, function (msg) {
        if (msg != "" && msg != undefined) {
            msg = JSON.parse(msg);
            //春运专报——报文期数
            messPeriod = msg.Numid;
            //趋势预测
            $("#trend_forecast").val(msg.TotalTrendForecast);
        } else {
            layer.msg("春运专报数据缺省！");
        }
    });
    //下半部分预报员数据查询
    $.post("/WebService.asmx/GetTrafficForecastDaysInfo", {
        dateTime: time
    }, function (result) {
        if (result != "" && result != undefined) {
            result = JSON.parse(result);
            for (var i = 0; i < result.length; i++) {
                $("#left0" + (i + 1) + "-Temp1").val(result[i].MinTemp);
                $("#right0" + (i + 1) + "-Temp2").val(result[i].MaxTemp);
                //风向
                for (var j = 0; j < document.getElementById("windfx0" + (i + 1)).length; j++) {
                    if (result[i].WindDirect.replace(/\s/g, "") == document.getElementById("windfx0" + (i + 1)).options[j].value) {
                        document.getElementById("windfx0" + (i + 1)).options[j].selected = true;
                        break;
                    }
                }
                //风力
                $("#left0" + (i + 1) + "-windli1").val(result[i].MinWind);
                $("#right0" + (i + 1) + "-windli2").val(result[i].MaxWind);

                //图片
                document.getElementById("oneday0" + (i + 1) + "-img1").src = "../../Images/tq/" + result[i].WeatherIcon;
                //中英文
                $("#oneday0" + (i + 1) + "-Ctext").val("CN: " + result[i].Weather1);

                var strdate = result[i].ForcastTime.replace(/T/g, ' ')
                var d = new Date(strdate.replace(/-/g, "/").substr(0, strdate.length));

                var ar_date = [d.getFullYear(), d.getMonth() + 1, d.getDate()];
                var forecastDate = new Date(ar_date[0] + "/" + ar_date[1] + "/" + ar_date[2]);
                var day = forecastDate.getDay();
                $("#date0" + (i + 1)).html(ar_date[1] + "月" + ar_date[2] + "日");
            }
        }
        else {
            layer.msg("数据缺省");
        }
    });
    //获取七天格点数据参考
    $.post("/WebService.asmx/GetTrafficForecastDaysECInfo", {
        dateTime: time
    }, function (result) {
        if (result != "" && result != undefined) {
            result = JSON.parse(result);
            for (var i = 0; i < result.length; i++) {
                //图片
                document.getElementById("oneday0" + (i + 1) + "-img2").src = "../../Images/tq/" + result[i].WeatherIcon;
                //温度
                $("#Ectemp0" + (i + 1)).html(result[i].MinTemp + "-" + result[i].MaxTemp);
                //风向
                $("#Ecwindfx0" + (i + 1)).html(result[i].WindDirect);
                //风力
                $("#Ecwindli0" + (i + 1)).html(result[i].MinWind + "-" + result[i].MaxWind);
            }
        }
        else {
            layer.msg("数据缺省");
        }
    });

    $(".navContent").eq(0).css("display", "none");
    $(".subNav").eq(0).removeClass("currentDt");
    $(".subNav").eq(1).addClass("currentDt");
    $(".navContent").eq(1).css("display", "block");
    $("#traffic_Forecast").addClass("hover");
}

function realase() {
    //显示预览界面
    $(".previewPage").css("display", "block");
    //隐藏编辑界面
    $(".editPage").css("display", "none");
    addPreviewInfo();
}
//交通专报预览
function addPreviewInfo() {
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
                    //报文期数前的年份
                    var dyear = time.substring(0, 4);
                    var nowdate = new Date();
                    //发布时间，以中文数字表示年月日小时
                    var releasDate = dateconvert(nowdate.format("yyyy-MM-dd"));
                    //报文期数
                    var decisionPeriod = messPeriod;
                    //交通专报趋势预测标题
                    var trend_forecast_title = $("#trend_predict_title").text();
                    //交通专报趋势预测内容
                    var trend_forecast_cont = $("#trend_forecast_content").val();
                    //具体预报 标题
                    var detail_forecast_title = $("#detail_forecast_title").text();
                    $(".trafficTrendTitle").html("一、" + trend_forecast_title);
                    $(".trafficTrendContent").html(trend_forecast_cont);
                    $(".detailForecastTitle").html("二、" + detail_forecast_title);
                    $(".release_time").html("海口市气象台" + releasDate);
                    
                    //天气状态图片数组
                    var imageUrl = new Array;
                    //天气状态文字说明数组
                    var ChEnEdit = new Array;
                    //温度数组
                    var TempEdit = new Array;
                    //风向风力数组
                    var WindEdit = new Array;
                    //预报时间数组
                    var dateWeek = new Array;
                    //循环将七天预报信息存入上面定义的数值
                    for (var i = 1; i <= 7; i++) {
                        //存入天气状态图片数组
                        imageUrl[(i - 1)] = document.getElementById("oneday0" + i + "-img1").src.split('/')[5] + "|" + document.getElementById("oneday0" + i + "-img2").src.split('/')[5];
                        //存入天气状态文字说明数组
                        ChEnEdit[(i - 1)] = $("#oneday0" + i + "-Ctext").val();
                        //存入最高最低温度数组
                        TempEdit[(i - 1)] = $("#left0" + i + "-Temp1").val() + "|" + $("#right0" + i + "-Temp2").val();
                        //存入陆地风向风力数组
                        WindEdit[(i - 1)] = $("#windfx0" + i).val() + "|" + $("#left0" + i + "-windli1").val() + "|" + $("#right0" + i + "-windli2").val();
                        //存入预报时间数组
                        dateWeek[(i - 1)] = $("#date0" + i).text();
                    }
                    //当前交通专报报文信息
                    var trafficinfo = new Array;
                    trafficinfo[0] = $("#cbUser").val();//预报员名字
                    trafficinfo[1] = decisionPeriod;//报文期数
                    trafficinfo[2] = trend_forecast_cont;//趋势预测内容
                    trafficinfo[3] = releasDate;//发布时间，以中文数字表示年月日小时
                    var table = "";
                    $("#biaoge").html("");
                    var table = "<table style=\"border-collapse: collapse;margin-left: 16px;\">"
                    table += "<tr style=\"height: 50px;background-color: #00FFFF;\"><th style='border: 1px solid #4F4E4E;text-align: center;width:160px;'>时 间</th><th style='border: 1px solid #4F4E4E;text-align: center;width:160px;'>天气状况</th><th style='border: 1px solid #4F4E4E;text-align: center;width:160px;'>温度</th><th style='border: 1px solid #4F4E4E;text-align: center;width:160px;'>风向、风力</th></tr>";
                    for (var s = 0; s < 7; s++) {
                        table += "<tr><th style='border: 1px solid #4F4E4E;text-align: center;'>" + dateWeek[s] + "</th>" +
                            "<th style='border: 1px solid #4F4E4E;text-align: center;'><img src=../../Images/tq/" + imageUrl[s].split('|')[0] + "><br>" + ChEnEdit[s].split(':')[1] + "</th>" +
                            "<th style='border: 1px solid #4F4E4E;text-align: center;'>" + TempEdit[s].split('|')[0] + "-" + TempEdit[s].split('|')[1] + "℃</th>" +
                            "<th style='border: 1px solid #4F4E4E;text-align: center;'>" + WindEdit[s].split('|')[0] + "风 " + WindEdit[s].split('|')[1] + "-" + WindEdit[s].split('|')[2] + "级</th>"                          
                    }
                    table += "</table>";
                    $("#biaoge").append(table);
                    //保存七天预报数据到模型，方便其他函数调用-关键
                    $.post("/WebService.asmx/SaveTrafficData", {
                        trafficData: JSON.stringify(trafficinfo),
                        AimageUrl: JSON.stringify(imageUrl),
                        AChEnEdit: JSON.stringify(ChEnEdit),
                        ATempEdit: JSON.stringify(TempEdit),
                        AWindEdit: JSON.stringify(WindEdit)
                    }, function (resultVal) {
                        //
                    });
                    break;
                }
            }
        });
    }
}

function backTo_edit() {
    $(".previewPage").css("display", "none");
    $(".editPage").css("display", "block");
}

//load方法
function loadpage() {
    load = layer.msg('加载中', {
        icon: 16
        , shade: 0.01
        , time: 0
    });
}

//数字日期格式转换为中文数字日期格式
function dateconvert(dateStr) {

    var dict = {
        "0": "○",
        "1": "一",
        "2": "二",
        "3": "三",
        "4": "四",
        "5": "五",
        "6": "六",
        "7": "七",
        "8": "八",
        "9": "九",
        "10": "十",
        "11": "十一",
        "12": "十二",
        "13": "十三",
        "14": "十四",
        "15": "十五",
        "16": "十六",
        "17": "十七",
        "18": "十八",
        "19": "十九",
        "20": "二十",
        "21": "二十一",
        "22": "二十二",
        "23": "二十三",
        "24": "二十四",
        "25": "二十五",
        "26": "二十六",
        "27": "二十七",
        "28": "二十八",
        "29": "二十九",
        "30": "三十",
        "31": "三十一"
    };

    var date = dateStr.split('-'),
        yy = date[0],
        mm = date[1],
        dd = date[2];

    var yearStr = dict[yy[0]] + dict[yy[1]] + dict[yy[2]] + dict[yy[3]] + '年',
        monthStr = dict['' + Number(mm)] + '月',
        dayStr = dict[dd] + '日';

    var newtime = yearStr + monthStr + dayStr;
    return newtime;
}

