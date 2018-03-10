
$(function () {
    //天气状况选择
    $(".xuanfu div label").click(function () {
        var id = $(this).attr("id");
        if (id == "" || id == "undefined") {
            return;
        }
        var imagesrc = id.split('-')[1];
        var weathertext = $("#" + id).text();
        weathertext=weathertext.split("(")[0];
        var weatherinput=$("#" + imgWeather).parent().siblings("input");
        weatherinput.val(weathertext);
        document.getElementById(imgWeather).src = "../../Images/tq/" + imagesrc + ".png";

        $(".xuanfu").css("display", "none");
    })

    $("input,textarea").focus(function () {
        $(this).css("border-color", "#0094e7");
    });
    $("input,textarea").blur(function () {
        $(this).css("border-color", "#aaa");
    });
})


//获取专报数据
function getReportDatas() {
    var str = $(".navContent li.hover").text();
    var table;
    switch (str) {
        case "决策预报制作":
            table = "SF_DECISIONFORECAST";
            break;
        case "春运专报制作":
            table = "sf_springforecast";
            break;
        case "交通专报制作":
            table = "sf_trafficforecast";
            break;
        case "农业专报制作":
            table = "sf_farmforecast";
            break;
        case "政府专报制作":
            table = "SF_GOVTFORECAST";
            break;
        case "旬报制作":
            table = "SF_PERIODMONTHFORECAST";
            break;
        case "月报制作":
            table = "SF_MONTHFORECAST";
            break;
        case "日常预报制作":
            table = "SF_DAILYFORECAST";
            break;
        default: break;
    }

    $.post('../WebService.asmx/GetSpecialReportDatas', {
        table: table
    }, function (datas, textStatus, xhr) {
        data = datas;
        if (str == "决策预报制作") {
            GetDecisionDatas();
        } else if (str == "春运专报制作") {
            GetSpringDatas();
        } else if (str == "交通专报制作") {
            GetTrafficDatas();
        } else if (str == "农业专报制作") {
            GetFarmDatas();
        } else if (str == "政府专报制作") {
            GetGovtDatas();
        } else if (str == "旬报制作") {
            GetPeriodMonthDatas();
        } else if (str == "月报制作") {
            GetMonthDatas();
        } else if (str == "日常预报制作") {
            GetDailyDatas();
        }

    })
}

//获取决策预报数据
function GetDecisionDatas() {
    var recid;
    var ddatetime;          //时间    
    var issueid;            //期刊
    var forecaster;         //预报员   
    var typhoon;            //台风动态
    var typhoonpic;         //台风动态图
    var weatherlive;        //天气实况
    var weatherlivepic;     //天气实况图
    var weatherforecast;    //天气预报

    if (data === null || data === "undefined" || data === "[]" || data === "") {
        $("#subhead").html("——我市今天仍有强降水，“莎莉嘉”已生成");
        $(".typhoon_topic1").val("1、热带低压");
        $("#typhoonVal1").html("&nbsp;&nbsp;南海热带低压已于今天（14日）凌晨2点前后在越南中部承天到顺化省沿海登陆，05时中心位于北纬16.8度、东经107.2度，也就是越南顺化省境内（见图1）,中心附近最大风力7级（15米/秒）。预计，该热带低压将以每小时15公里左右的速度向偏西方向移动，逐渐减弱消失。");
        $(".typhoon_topic2").val("2、21号台风“莎莉嘉”");
        $("#typhoonVal2").html("&nbsp;&nbsp;今年第21号台风“莎莉嘉”（热带风暴级）已经于昨天晚上在菲律宾以东洋面上生成，预计将于16日进入南海东部海面（见图1），强度继续加强，18日靠近海南岛，我市18日～19日将迎来新一轮强风雨过程。");
        $(".typhoon_topic2").val("2、21号台风“莎莉嘉”");
        $(".weatherlive_topic1").val("1、昨天降水实况");
        $("#weatherliveVal1").html("&nbsp;&nbsp;受热带低压和冷空气共同影响，昨天（13日08时～14日08时），我市南半部普降暴雨，北半部小到中雨、局部大雨，详见图2、表1。");
        $(".weatherlive_topic2").val("2、过程雨量实况");
        $("#weatherliveVal2").html("&nbsp;&nbsp;据统计，12日20时～14日08时，强降水中心在我市南部乡镇，市区出现小到中雨。共有3个乡镇超过100毫米，分别为181.9毫米（大坡镇）、150.6（甲子镇）、149.2毫米（三门坡镇），详见图3、表1。");
        $("#weatherForecastVal").html("&nbsp;&nbsp;今天我市的强降水仍将持续，海上风力仍然较大。\n&nbsp;&nbsp;本市的强降水仍将持续一天，提醒有关部门继续做好防范工作。15日～17日，天气短暂好转。18日～19日，受今年第21号台风影响，我市将迎来新一轮强风雨过程，提醒相关部门密切关注我局最新天气预报，提前做好防台工作。");
        $("#seapartVal").html("&nbsp;&nbsp;14日，琼州海峡风力7级、阵风8～9级,今天中午前后起减弱为6级、阵风7级。");
        $("#landpartVal").html("&nbsp;&nbsp;14日，我市有中到大雨，局地暴雨，风力4～6级；15日，降水强度减弱，有小阵雨，风力3～4级。");

        $("#previewImg").html("<span style='position:relative;margin-left:30px;display:inline-block;width:46%;'><span class='del' title='删除' onclick='del_pic1(this)' style='position:absolute;right:0;z-index:10000;width:15px;height:15px;background:#2eb1e8 url(../../Images/upload/UploadAction/delete_white.png) no-repeat scroll 0 0;'></span><img src='../Images/upload/UploadAction/1507877525.png' onclick='showDetail(this)' style='width:100%;'/><div style='margin-top:20px;'>添加图片描述：<input type='text' value='图1 台风“莎莉嘉”和热带低压预报路径图' style='display:inline-block;width: 70%; height: 25px; border: 1px solid #aaa;font-size:12px;' /></div></span>");

        $("#previewImg2").html("<span style='position:relative;margin-left:30px;display:inline-block;width:46%;'><span class='del' title='删除' onclick='del_pic1(this)' style='position:absolute;right:0;z-index:10000;width:15px;height:15px;background:#2eb1e8 url(../../Images/upload/UploadAction/delete_white.png) no-repeat scroll 0 0;'></span><img src='../Images/upload/UploadAction/1508145946.jpg' onclick='showDetail(this)' style='width:100%'/><div style='margin-top:20px;'>添加图片描述：<input type='text' value='图2 2016年10月13日08时-14日08时过程雨量（单位：毫米）' style='display:inline-block;width: 70%; height: 25px; border: 1px solid #aaa;font-size:12px;'/></div></span><span style='position:relative;margin-left:30px;display:inline-block;width:46%;'><span class='del' title='删除' onclick='del_pic1(this)' style='position:absolute;right:0;z-index:10000;width:15px;height:15px;background:#2eb1e8 url(../../Images/upload/UploadAction/delete_white.png) no-repeat scroll 0 0;'></span><img src='../Images/upload/UploadAction/1508145984.jpg' onclick='showDetail(this)' style='width:100%'/><div style='margin-top:20px;'>添加图片描述：<input type='text' value='图3 2016年10月12日20时-14日08时过程雨量（单位：毫米）' style='display:inline-block;width: 70%; height: 25px; border: 1px solid #aaa;font-size:12px;'/></div></span>");
    } else {
        newdata = JSON.parse(data)[0];

        //取最新的值
        recid = newdata[newdata.length - 1].RECID;
        ddatetime = newdata[newdata.length - 1].DDATETIME;
        issueid = newdata[newdata.length - 1].ISSUEID;
        forecaster = newdata[newdata.length - 1].FORECASTER;
        typhoon = newdata[newdata.length - 1].TYPHOON;
        typhoonpic = newdata[newdata.length - 1].TYPHOONPIC;
        weatherlive = newdata[newdata.length - 1].WEATHERLIVE;
        weatherlivepic = newdata[newdata.length - 1].WEATHERLIVEPIC;
        weatherforecast = newdata[newdata.length - 1].WEATHERFORECAST;

        $("#cbUser").val(forecaster);
        $("#typhoonVal").html(typhoon);
        $("#weatherLiveVal").html(weatherlive);
        $("#weatherForecastVal").html(weatherforecast);
    }
}

//获取春运专报数据
function GetSpringDatas() {
    var recid;
    var ddatetime;          //时间    
    var issueid;            //期刊
    var forecaster;         //预报员   
    var trendpredict;       //趋势预测
    var threedayforecast;    //未来三天预报
    var nextdayforecast;     //未来4到7天预报
    var threedaytime;        //时间
    var weather;             //天空状况
    var weatherpic;          //天空状况图标
    var temperature;         //气温
    var landwind;            //陆地风向风速
    var seawind;             //海面风向风速
    var str;

    if (data === null || data === "undefined" || data === "[]" || data === "") {
        $("#trend_predict").html("&nbsp;&nbsp;预计2017年春运期间（1月13日～2月21日），我市平均气温较常年同期略偏高，降水量以偏少为主；期间可能出现4次主要冷空气过程，大致在：1月中旬中后期、2月上旬前期、2月中旬前期、2月中旬末至2月下旬初。不过冷空气影响总体偏弱，低温阴雨灾害总体偏轻，灾害总体轻于常年同期，但要提防大雾对交通运输的不利影响。");
        $("#weatherpartVal").html("&nbsp;&nbsp;预计，未来3天，冷空气势力逐日增强，气温逐日下降。13-15日，阴天有小雨，近海海面东北风5-6级，阵风7级。具体预报如下：");
        $("#trafficpartVal").html("&nbsp;&nbsp;13日～15日，本岛东线高速公路海口至三亚路段、中线高速公路海口至琼中路段，阴天有小雨，能见度较差，对公路交通运输有一定影响。");
        $("#qiongzhoupartVal").html("&nbsp;&nbsp;13日～15日白天，琼州海峡阴天有阵雨，风力5～6级、阵风7级，通航气象条件一般。");
        $("#nextFourtoSeven").html("&nbsp;&nbsp;16～20日受冷空气的影响，大部分时段阴天有小雨，气温逐日下降，近海海面风力5～7级，阵风8级。");

        //表格添加默认内容
        str = "<tr><td><input type='text' value='1月13日' onblur='input_blur(this)' onfocus='input_focus(this)' /></td><td class='weather'><div style='width:100%;height:100%;'><label><img id='oneday1-img1' class='Imghover' src='../Images/tq/01.png' onclick='choose_img(this)' /></label><div class='pic' id='oneday1-img2'><img src='../../Images/PageImage/cloudy.jpg'/><img src='../../Images/PageImage/smallrain.jpg'/></div><input type='text' value='阴天有小雨' onblur='input_blur(this)' onfocus='input_focus(this)' style='height:25%;'/></div></td><td><input type='text' value='18-21℃' onblur='input_blur(this)' onfocus='input_focus(this)' /></td><td><input type='text' value='东北风3-4级' onblur='input_blur(this)' onfocus='input_focus(this)' /></td><td><input type='text' value='东北风5-6级阵风7级' onblur='input_blur(this)' onfocus='input_focus(this)' /></td></tr>";
        str = str + "<tr><td><input type='text' value='1月14日' onblur='input_blur(this)' onfocus='input_focus(this)' /></td><td class='weather'><div style='width:100%;height:100%;'><label><img id='oneday2-img1' class='Imghover' src='../Images/tq/01.png' onclick='choose_img(this)'  /></label><div class='pic' id='oneday2-img2'><img src='../../Images/PageImage/cloudy.jpg'/><img src='../../Images/PageImage/smallrain.jpg'/></div><input type='text' value='阴天有小到中雨' onblur='input_blur(this)' onfocus='input_focus(this)' style='height:25%;'/></div></td><td><input type='text' value='18-20℃' onblur='input_blur(this)' onfocus='input_focus(this)' /></td><td><input type='text' value='东北风3-4级' onblur='input_blur(this)' onfocus='input_focus(this)' /></td><td><input type='text' value='东北风5-6级阵风7级' onblur='input_blur(this)' onfocus='input_focus(this)' /></td></tr>";
        str = str + "<tr><td><input type='text' value='1月15日' onblur='input_blur(this)' onfocus='input_focus(this)' /></td><td class='weather'><div style='width:100%;height:100%;'><label><img id='oneday3-img1' class='Imghover' src='../Images/tq/01.png'  onclick='choose_img(this)' /></label><div class='pic' id='oneday3-img2'><img src='../../Images/PageImage/cloudy.jpg'/><img src='../../Images/PageImage/smallrain.jpg'/></div><input type='text' value='阴天有小雨' onblur='input_blur(this)' onfocus='input_focus(this)' style='height:25%;'/></div></td><td><input type='text' value='18-20℃' onblur='input_blur(this)' onfocus='input_focus(this)' /></td><td><input type='text' value='东北风3-4级' onblur='input_blur(this)' onfocus='input_focus(this)' /></td><td><input type='text' value='东北风5-6级阵风7级' onblur='input_blur(this)' onfocus='input_focus(this)' /></td></tr>";

        $("#nextThreeday_info tbody").html(str);

    } else {
        newdata = JSON.parse(data)[0];
        //取最新的值
        recid = newdata[newdata.length - 1].RECID;
        ddatetime = newdata[newdata.length - 1].DDATETIME;
        issueid = newdata[newdata.length - 1].ISSUEID;
        forecaster = newdata[newdata.length - 1].FORECASTER;
        trendpredict = newdata[newdata.length - 1].TRENDPREDICT;
        threedayforecast = newdata[newdata.length - 1].THREEDAYFORECAST;
        nextdayforecast = newdata[newdata.length - 1].NEXTDAYFORECAST;
        threedaytime = newdata[newdata.length - 1].THREEDAYTIME;
        weather = newdata[newdata.length - 1].WEATHER;
        weatherpic = newdata[newdata.length - 1].WEATHERPIC;
        temperature = newdata[newdata.length - 1].TEMPERATURE;
        landwind = newdata[newdata.length - 1].LANDWIND;
        seawind = newdata[newdata.length - 1].SEAWIND;

        $("#cbUser").html(forecaster);
        $("#trend_predict").html(trendpredict);
        $("#nextThreeday_forecast").html(threedayforecast);
        $("#nextFourtoSeven").html(nextdayforecast);
    }
}

//获取日常服务专报数据
function GetDailyDatas() {
    var recid;
    var ddatetime;              //时间    
    var forecaster;             //预报员   
    var airpollute;             //空气污染预报
    var airpollutepic;          //空气污染图
    var piccaption;             //图片描述
    var shorttimeForecast;      //短时预报
    var date;
    var str = "";
    var picUrl;

    if (data === null || data === "undefined" || data === "[]" || data === "") {
        date = new Date();
        ddatetime = date.format("yyyy-MM-dd");
       
        $("#airpollute_reportVal").html("&nbsp;&nbsp;预计2017年1月1日08时到2017年1月2日08时，受冷空气影响，低层风力较大，较有利于空气污染物的稀释、扩散和清除。");
        $("#shorttime_reportVal").html("&nbsp;&nbsp;过去三小时，全市多云，气温24.6-27.8℃，东南风3-4级。\n&nbsp;&nbsp;预计，未来三小时，我市市区和乡镇多云，气温25.1-30.2℃，东南风3-4级。具体预报如下：\n&nbsp;&nbsp;北部（含市区），多云，气温25.5-30.2℃，东南风3-4级。\n&nbsp;&nbsp;东部，多云，气温25.6-30.1℃，东南风3-4级。\n&nbsp;&nbsp;中部，多云，气温25.4-30.2℃，东南风3-4级。\n&nbsp;&nbsp;西部，多云，气温25.5-30.0℃，东南风3-4级。\n&nbsp;&nbsp;南部，多云，气温25.1-30.2℃，东南风3-4级。");
        $("#previewImg").html("<span style='position: relative; margin-left: 30px; display: inline-block; width: 46%;' class='picarea'><span class='del' title='删除' onclick='del_pic(this)' style='position: absolute; right: 0; z-index: 10000; width: 15px; height: 15px; background: #2eb1e8 url(../../Images/upload/UploadAction/delete_white.png) no-repeat scroll 0 0;'></span><img src='../Images/upload/UploadAction/air_pollute.jpg' onclick='showDetail(this)' style='width: 100%;' /><div style='margin-top: 20px;'>添加图片描述：<input type='text' value='' style='display: inline-block; width: 70%; height: 25px; border: 1px solid #aaa; font-size: 12px;' /></div></span>");
        $("#date").val(ddatetime);
    } else {
        newdata = JSON.parse(data)[0];
        time = newdata[newdata.length - 1].DDATETIME;
        date = new Date();
        ddatetime = date.format("yyyy-MM-dd");

        if (time.split("T")[0] == ddatetime) {
            //取最新的值
            date = new Date();
            ddatetime = date.format("yyyy-MM-dd");
            selectHour = time.split("T")[1].split(":")[0];
            forecaster = newdata[newdata.length - 1].FORECASTER;
            airpollute = newdata[newdata.length - 1].AIRPOLLUTE;
            shorttimeForecast = newdata[newdata.length - 1].SHORTTIMEFORECAST;
            airpollutepic = newdata[newdata.length - 1].AIRPOLLUTEPIC;
            piccaption = newdata[newdata.length - 1].PICCAPTION;

            $("#date").val(ddatetime);
            $("#top ul li button").removeClass("active");
            $("#button" + selectHour + "").addClass("active");
            $("#cbUser").val(forecaster);
            $("#airpollute_reportVal").val(airpollute);
            $("#shorttime_reportVal").val(shorttimeForecast);

            //避免前台内容显示null
            if (piccaption == null || piccaption == "" || piccaption == undefined) {
                piccaption = "";
            }

            //存在不止一张图片
            if (airpollutepic.indexOf(",") > 0) {
                picUrl = airpollutepic.split(",");
                piccaption = piccaption.split(",");

                for (var i = 0; i < picUrl.length; i++) {
                    str += "<span style='position: relative; margin-left: 30px; display: inline-block; width: 46%;' class='picarea'><span class='del' title='删除' onclick='del_pic(this)' style='position: absolute; right: 0; z-index: 10000; width: 15px; height: 15px; background: #2eb1e8 url(../../Images/upload/UploadAction/delete_white.png) no-repeat scroll 0 0;'></span><img src='../Images/upload/UploadAction/" + picUrl[i] + "' onclick='showDetail(this)' style='width: 100%;' /><div style='margin-top: 20px;'>添加图片描述：<input type='text' value='" + piccaption[i] + "' style='display: inline-block; width: 70%; height: 25px; border: 1px solid #aaa; font-size: 12px;' /></div></span>";
                }
                $("#previewImg").html(str);
            } else if (airpollutepic.indexOf(",") < 0) {
                $("#previewImg").html("<span style='position: relative; margin-left: 30px; display: inline-block; width: 46%;' class='picarea'><span class='del' title='删除' onclick='del_pic(this)' style='position: absolute; right: 0; z-index: 10000; width: 15px; height: 15px; background: #2eb1e8 url(../../Images/upload/UploadAction/delete_white.png) no-repeat scroll 0 0;'></span><img src='../Images/upload/UploadAction/" + airpollutepic + "' onclick='showDetail(this)' style='width: 100%;' /><div style='margin-top: 20px;'>添加图片描述：<input type='text' value='" + piccaption + "' style='display: inline-block; width: 70%; height: 25px; border: 1px solid #aaa; font-size: 12px;' /></div></span>");
            }
        } else {
            date = new Date();
            ddatetime = date.format("yyyy-MM-dd");

            $("#airpollute_reportVal").html("&nbsp;&nbsp;预计2017年1月1日08时到2017年1月2日08时，受冷空气影响，低层风力较大，较有利于空气污染物的稀释、扩散和清除。");
            $("#shorttime_reportVal").html("&nbsp;&nbsp;过去三小时，全市多云，气温24.6-27.8℃，东南风3-4级。\n&nbsp;&nbsp;预计，未来三小时，我市市区和乡镇多云，气温25.1-30.2℃，东南风3-4级。具体预报如下：\n&nbsp;&nbsp;北部（含市区），多云，气温25.5-30.2℃，东南风3-4级。\n&nbsp;&nbsp;东部，多云，气温25.6-30.1℃，东南风3-4级。\n&nbsp;&nbsp;中部，多云，气温25.4-30.2℃，东南风3-4级。\n&nbsp;&nbsp;西部，多云，气温25.5-30.0℃，东南风3-4级。\n&nbsp;&nbsp;南部，多云，气温25.1-30.2℃，东南风3-4级。");
            $("#previewImg").html("<span style='position: relative; margin-left: 30px; display: inline-block; width: 46%;' class='picarea'><span class='del' title='删除' onclick='del_pic(this)' style='position: absolute; right: 0; z-index: 10000; width: 15px; height: 15px; background: #2eb1e8 url(../../Images/upload/UploadAction/delete_white.png) no-repeat scroll 0 0;'></span><img src='../Images/upload/UploadAction/air_pollute.jpg' onclick='showDetail(this)' style='width: 100%;' /><div style='margin-top: 20px;'>添加图片描述：<input type='text' value='' style='display: inline-block; width: 70%; height: 25px; border: 1px solid #aaa; font-size: 12px;' /></div></span>");
            $("#date").val(ddatetime);
            $("#top ul li button").removeClass("active");
            $("#button08").addClass("active");
        }

        
    }
    
}

//获取交通专报数据
function GetTrafficDatas() {
    var recid;
    var ddatetime;          //时间    
    var issueid;            //期刊
    var forecaster;         //预报员   
    var trendpredict;       //趋势预测
    var forecasttime;        //具体预报时间
    var weather;             //天空状况
    var weatherpic;          //天空状况图标
    var temperature;         //气温
    var wind;            //风向风力
    
    if (data === null || data === "undefined" || data === "[]" || data === "") {
        $("#trend_forecast").html("&nbsp;&nbsp;预计，本周多雷阵雨天气，其中，24-25日，受弱切变线影响，我市有雷阵雨，局地伴有短时强降水、雷雨大风等强对流天气。本周最高气温在29-35度之间。");

        //表格添加默认内容
        str = "<tr><td><input type='text' value='5月22日' onblur='input_blur(this)' onfocus='input_focus(this)' /></td><td class='weather'><div style='width:100%;height:100%;'><label><img id='oneday1-img1' class='Imghover' src='../Images/tq/01.png' onclick='choose_img(this)' /></label><div class='pic' id='oneday1-img2'><img src='../../Images/PageImage/thunderRain.jpg'/></div><input type='text' value='多云，午后有雷阵雨' onblur='input_blur(this)' onfocus='input_focus(this)' style='height:25%;'/></div></td><td><input type='text' value='25-33℃' onblur='input_blur(this)' onfocus='input_focus(this)' /></td><td><input type='text' value='东南风3-4级' onblur='input_blur(this)' onfocus='input_focus(this)' /></td></tr>";
        str = str + "<tr><td><input type='text' value='5月23日' onblur='input_blur(this)' onfocus='input_focus(this)' /></td><td class='weather'><div style='width:100%;height:100%;'><label><img id='oneday2-img1' class='Imghover' src='../Images/tq/01.png' onclick='choose_img(this)' /></label><div class='pic' id='oneday2-img2'><img src='../../Images/PageImage/thunderRain.jpg'/></div><input type='text' value='多云，午后有雷阵雨' onblur='input_blur(this)' onfocus='input_focus(this)' style='height:25%;'/></div></td><td><input type='text' value='25-33℃' onblur='input_blur(this)' onfocus='input_focus(this)' /></td><td><input type='text' value='东南风3-4级' onblur='input_blur(this)' onfocus='input_focus(this)' /></td></tr>";
        str = str + "<tr><td><input type='text' value='5月24日' onblur='input_blur(this)' onfocus='input_focus(this)' /></td><td class='weather'><div style='width:100%;height:100%;'><label><img id='oneday3-img1' class='Imghover' src='../Images/tq/01.png' onclick='choose_img(this)' /></label><div class='pic' id='oneday3-img2'><img src='../../Images/PageImage/thunderRain.jpg'/></div><input type='text' value='多云，午后有雷阵雨' onblur='input_blur(this)' onfocus='input_focus(this)' style='height:25%;'/></div></td><td><input type='text' value='25-33℃' onblur='input_blur(this)' onfocus='input_focus(this)' /></td><td><input type='text' value='东南风3-4级' onblur='input_blur(this)' onfocus='input_focus(this)' /></td></tr>";
        str = str + "<tr><td><input type='text' value='5月25日' onblur='input_blur(this)' onfocus='input_focus(this)' /></td><td class='weather'><div style='width:100%;height:100%;'><label><img id='oneday4-img1' class='Imghover' src='../Images/tq/01.png' onclick='choose_img(this)' /></label><div class='pic' id='oneday4-img2'><img src='../../Images/PageImage/thunderRain.jpg'/></div><input type='text' value='多云，午后有雷阵雨' onblur='input_blur(this)' onfocus='input_focus(this)' style='height:25%;'/></div></td><td><input type='text' value='25-33℃' onblur='input_blur(this)' onfocus='input_focus(this)' /></td><td><input type='text' value='东南风3-4级' onblur='input_blur(this)' onfocus='input_focus(this)' /></td></tr>";
        str = str + "<tr><td><input type='text' value='5月26日' onblur='input_blur(this)' onfocus='input_focus(this)' /></td><td class='weather'><div style='width:100%;height:100%;'><label><img id='oneday5-img1' class='Imghover' src='../Images/tq/01.png' onclick='choose_img(this)' /></label><div class='pic' id='oneday5-img2'><img src='../../Images/PageImage/thunderRain.jpg'/></div><input type='text' value='多云，午后有雷阵雨' onblur='input_blur(this)' onfocus='input_focus(this)' style='height:25%;'/></div></td><td><input type='text' value='25-33℃' onblur='input_blur(this)' onfocus='input_focus(this)' /></td><td><input type='text' value='东南风3-4级' onblur='input_blur(this)' onfocus='input_focus(this)' /></td></tr>";
        str = str + "<tr><td><input type='text' value='5月27日' onblur='input_blur(this)' onfocus='input_focus(this)' /></td><td class='weather'><div style='width:100%;height:100%;'><label><img id='oneday6-img1' class='Imghover' src='../Images/tq/01.png' onclick='choose_img(this)' /></label><div class='pic' id='oneday6-img2'><img src='../../Images/PageImage/thunderRain.jpg'/></div><input type='text' value='多云，午后有雷阵雨' onblur='input_blur(this)' onfocus='input_focus(this)' style='height:25%;'/></div></td><td><input type='text' value='25-33℃' onblur='input_blur(this)' onfocus='input_focus(this)' /></td><td><input type='text' value='东南风3-4级' onblur='input_blur(this)' onfocus='input_focus(this)' /></td></tr>";
        str = str + "<tr><td><input type='text' value='5月28日' onblur='input_blur(this)' onfocus='input_focus(this)' /></td><td class='weather'><div style='width:100%;height:100%;'><label><img id='oneday7-img1' class='Imghover' src='../Images/tq/01.png' onclick='choose_img(this)' /></label><div class='pic' id='oneday7-img2'><img src='../../Images/PageImage/thunderRain.jpg'/></div><input type='text' value='多云，午后有雷阵雨' onblur='input_blur(this)' onfocus='input_focus(this)' style='height:25%;'/></div></td><td><input type='text' value='25-33℃' onblur='input_blur(this)' onfocus='input_focus(this)' /></td><td><input type='text' value='东南风3-4级' onblur='input_blur(this)' onfocus='input_focus(this)' /></td></tr>";

        $(".detailInfo_table tbody").html(str);

    } else {
        newdata = JSON.parse(data)[0];
        //取最新的值
        recid = newdata[newdata.length - 1].RECID;
        ddatetime = newdata[newdata.length - 1].DDATETIME;
        issueid = newdata[newdata.length - 1].ISSUEID;
        forecaster = newdata[newdata.length - 1].FORECASTER;
        trendpredict = newdata[newdata.length - 1].TRENDPREDICT;
        forecasttime = newdata[newdata.length - 1].FORECASTTIME;
        weather = newdata[newdata.length - 1].WEATHER;
        weatherpic = newdata[newdata.length - 1].WEATHERPIC;
        temperature = newdata[newdata.length - 1].TEMPERATURE;
        wind = newdata[newdata.length - 1].WIND;

        $("#cbUser").html(forecaster);
        $("#trend_forecast").html(trendpredict);
    }
}

//获取农业专报数据
function GetFarmDatas() {
    var recid;
    var ddatetime;             //时间    
    var issueid;              //期刊
    var forecaster;           //预报员   
    var earlyweather;         //前期天气概况
    var haikouweather;        //海口天气预测
    var forecasttime;         //预报时间
    var weather;              //天空状况
    var weatherpic;           //填空状况图标
    var temperature;          //气温
    var wind;                 //风向风力
    var suggest;              //农事建议

    if (data === null || data === "undefined" || data === "[]" || data === "") {
        $("#weather_situation").html("&nbsp;&nbsp;上周（4月3-9日）主要受变暖高压脊和西南低压槽影响，以晴好天气为主，最高气温33.0℃（甲子镇）-36.8℃（西海岸观海台），最低气温16.1℃（旧州镇）-21.5℃（西海岸观海台）；全市雨量0.1毫米-1.6毫米。");
        $("#haikou_weather").html("&nbsp;&nbsp;预计，本周主要受西南低压槽、低层切变线和弱冷空气影响，10日晴间多云，11-13日多云有雷阵雨，14-16日以晴好天气为主，最高气温逐渐回升至33℃-34℃。  \n&nbsp;&nbsp;  具体预报如下：");
        $("#lizhiVal").html("&nbsp;&nbsp;本周我市荔枝主要工作是防虫防病：\n&nbsp;&nbsp;1、虫害防治，主要防治蒂蛀虫，兼治卷叶蛾、蝽蟓等害虫。药剂可选择灭百可+素死蜱或功夫+甲维盐阿维菌素；\n&nbsp;&nbsp;2、病害防治，主要防治炭疽病，药剂可选择百泰、阿米妙收或扬彩等；\n&nbsp;&nbsp;3、叶面补充叶面肥。");
        $("#vegetablesVal").html("&nbsp;&nbsp;蔬菜管理应注意: \n&nbsp;&nbsp;①高温时采取降温措施,露天蔬菜要遮荫，大棚蔬菜注意通风降温。\n&nbsp;&nbsp;②雨天时叶菜种植地要排除积水,防止沤根。\n&nbsp;&nbsp;③及时采收。");
        $("#shuidaoVal").html("&nbsp;&nbsp;目前，我市水稻主要处于分蘖-拔节期，未来一周天气形势对水稻生长有利，请继续做好稻田管理工作即可。此外，对于一些杂草较多或虫害较多的田块，建议采取一些措施进行有效处理");
        

        //表格添加默认内容
        str = "<tr><td><input type='text' value='5月22日' onblur='input_blur(this)' onfocus='input_focus(this)' /></td><td class='weather'><div style='width:100%;height:100%;'><label><img id='oneday1-img1' class='Imghover' src='../Images/tq/01.png' onclick='choose_img(this)' /></label><div class='pic' id='oneday1-img2'><img src='../../Images/PageImage/thunderRain.jpg'/></div><input type='text' value='多云，午后有雷阵雨' onblur='input_blur(this)' onfocus='input_focus(this)' style='height:25%;'/></div></td><td><input type='text' value='25-33℃' onblur='input_blur(this)' onfocus='input_focus(this)' /></td><td><input type='text' value='东南风3-4级' onblur='input_blur(this)' onfocus='input_focus(this)' /></td></tr>";
        str = str + "<tr><td><input type='text' value='5月23日' onblur='input_blur(this)' onfocus='input_focus(this)' /></td><td class='weather'><div style='width:100%;height:100%;'><label><img id='oneday2-img1' class='Imghover' src='../Images/tq/01.png' onclick='choose_img(this)' /></label><div class='pic' id='oneday2-img2'><img src='../../Images/PageImage/thunderRain.jpg'/></div><input type='text' value='多云，午后有雷阵雨' onblur='input_blur(this)' onfocus='input_focus(this)' style='height:25%;'/></div></td><td><input type='text' value='25-33℃' onblur='input_blur(this)' onfocus='input_focus(this)' /></td><td><input type='text' value='东南风3-4级' onblur='input_blur(this)' onfocus='input_focus(this)' /></td></tr>";
        str = str + "<tr><td><input type='text' value='5月24日' onblur='input_blur(this)' onfocus='input_focus(this)' /></td><td class='weather'><div style='width:100%;height:100%;'><label><img id='oneday3-img1' class='Imghover' src='../Images/tq/01.png' onclick='choose_img(this)' /></label><div class='pic' id='oneday3-img2'><img src='../../Images/PageImage/thunderRain.jpg'/></div><input type='text' value='多云，午后有雷阵雨' onblur='input_blur(this)' onfocus='input_focus(this)' style='height:25%;'/></div></td><td><input type='text' value='25-33℃' onblur='input_blur(this)' onfocus='input_focus(this)' /></td><td><input type='text' value='东南风3-4级' onblur='input_blur(this)' onfocus='input_focus(this)' /></td></tr>";
        str = str + "<tr><td><input type='text' value='5月25日' onblur='input_blur(this)' onfocus='input_focus(this)' /></td><td class='weather'><div style='width:100%;height:100%;'><label><img id='oneday4-img1' class='Imghover' src='../Images/tq/01.png' onclick='choose_img(this)' /></label><div class='pic' id='oneday4-img2'><img src='../../Images/PageImage/thunderRain.jpg'/></div><input type='text' value='多云，午后有雷阵雨' onblur='input_blur(this)' onfocus='input_focus(this)' style='height:25%;'/></div></td><td><input type='text' value='25-33℃' onblur='input_blur(this)' onfocus='input_focus(this)' /></td><td><input type='text' value='东南风3-4级' onblur='input_blur(this)' onfocus='input_focus(this)' /></td></tr>";
        str = str + "<tr><td><input type='text' value='5月26日' onblur='input_blur(this)' onfocus='input_focus(this)' /></td><td class='weather'><div style='width:100%;height:100%;'><label><img id='oneday5-img1' class='Imghover' src='../Images/tq/01.png' onclick='choose_img(this)' /></label><div class='pic' id='oneday5-img2'><img src='../../Images/PageImage/thunderRain.jpg'/></div><input type='text' value='多云，午后有雷阵雨' onblur='input_blur(this)' onfocus='input_focus(this)' style='height:25%;'/></div></td><td><input type='text' value='25-33℃' onblur='input_blur(this)' onfocus='input_focus(this)' /></td><td><input type='text' value='东南风3-4级' onblur='input_blur(this)' onfocus='input_focus(this)' /></td></tr>";
        str = str + "<tr><td><input type='text' value='5月27日' onblur='input_blur(this)' onfocus='input_focus(this)' /></td><td class='weather'><div style='width:100%;height:100%;'><label><img id='oneday6-img1' class='Imghover' src='../Images/tq/01.png' onclick='choose_img(this)' /></label><div class='pic' id='oneday6-img2'><img src='../../Images/PageImage/thunderRain.jpg'/></div><input type='text' value='多云，午后有雷阵雨' onblur='input_blur(this)' onfocus='input_focus(this)' style='height:25%;'/></div></td><td><input type='text' value='25-33℃' onblur='input_blur(this)' onfocus='input_focus(this)' /></td><td><input type='text' value='东南风3-4级' onblur='input_blur(this)' onfocus='input_focus(this)' /></td></tr>";
        str = str + "<tr><td><input type='text' value='5月28日' onblur='input_blur(this)' onfocus='input_focus(this)' /></td><td class='weather'><div style='width:100%;height:100%;'><label><img id='oneday7-img1' class='Imghover' src='../Images/tq/01.png' onclick='choose_img(this)' /></label><div class='pic' id='oneday7-img2'><img src='../../Images/PageImage/thunderRain.jpg'/></div><input type='text' value='多云，午后有雷阵雨' onblur='input_blur(this)' onfocus='input_focus(this)' style='height:25%;'/></div></td><td><input type='text' value='25-33℃' onblur='input_blur(this)' onfocus='input_focus(this)' /></td><td><input type='text' value='东南风3-4级' onblur='input_blur(this)' onfocus='input_focus(this)' /></td></tr>";

        $("#haikouWeather_table tbody").html(str);

    } else {
        newdata = JSON.parse(data)[0];
        //取最新的值
        recid = newdata[newdata.length - 1].RECID;
        ddatetime = newdata[newdata.length - 1].DDATETIME;
        issueid = newdata[newdata.length - 1].ISSUEID;
        forecaster = newdata[newdata.length - 1].FORECASTER;
        earlyweather = newdata[newdata.length - 1].EARLYWEATHER;
        haikouweather = newdata[newdata.length - 1].HAIKOUWEATHER;
        forecasttime = newdata[newdata.length - 1].FORECASTTIME;
        weather = newdata[newdata.length - 1].WEATHER;
        weatherpic = newdata[newdata.length - 1].WEATHERPIC;
        temperature = newdata[newdata.length - 1].TEMPERATURE;
        wind = newdata[newdata.length - 1].WIND;
        suggest = newdata[newdata.length - 1].SUGGEST;

        $("#cbUser").html(forecaster);
        $("#weather_situation").html(earlyweather);
        $("#haikou_weather").html(haikouweather);
        $("#farmSuggest").html(suggest);
    }
}


//获取政府专报数据
function GetGovtDatas() {
    var recid;
    var ddatetime;             //时间    
    var issueid;              //期刊
    var forecaster;           //预报员   
    var earlyweather;         //前期天气概况
    var haikouweather;        //海口天气预测
    var forecasttime;         //预报时间
    var weather;              //天空状况
    var weatherpic;           //填空状况图标
    var temperature;          //气温
    var wind;                 //风向风力
    var suggest;              //防御建议

    if (data === null || data === "undefined" || data === "[]" || data === "") {
        $("#early_weather").html("&nbsp;&nbsp;上周，前期受弱冷空气和西南低压槽影响，以阴天间多云天气为主，后期受南支槽影响，阴天有阵雨，最低气温21-23℃，最高气温27-31℃。");
        $("#haikou_weather").html(" &nbsp;&nbsp;预计未来一周，前期以多云天气为主，后期有冷空气影响。20日-25日白天多云，其中22日-23日多云有阵雨，最高气温29-31℃，最低气温22-23℃；25日夜间-26日受冷空气影响，阴天有小阵雨，气温明显下降。 \n&nbsp;&nbsp;具体预报如下：");
        $("#suggestVal").html("&nbsp;&nbsp;25日夜间到26日，受冷空气影响，气温明显下降，多阴雨天气，局地可能出现雷雨大风等短时强对流天气，市民朋友出门需携带雨具，并注意及时增减衣服，另外，出行注意交通阻塞。");
        $("#trafficpartVal").html("&nbsp;&nbsp;后期多阴雨天气，路天路滑，能见度偏低，注意加强交通疏导。");
        $("#farmpartVal").html("&nbsp;&nbsp;及时晒田，控制无效分蘖。利用晴好天气及时采收成熟冬季瓜菜，避开后期降温和降雨带来的不利影响。");
        
        //表格添加默认内容
        str = "<tr><td></td><td><input type='text' value='3月20日' onblur='input_blur(this)' onfocus='input_focus(this)' /></td><td><input type='text' value='3月21日' onblur='input_blur(this)' onfocus='input_focus(this)' /></td><td><input type='text' value='3月22日' onblur='input_blur(this)' onfocus='input_focus(this)' /></td><td><input type='text' value='3月23日' onblur='input_blur(this)' onfocus='input_focus(this)' /></td><td><input type='text' value='3月24日' onblur='input_blur(this)' onfocus='input_focus(this)' /></td><td><input type='text' value='3月25日' onblur='input_blur(this)' onfocus='input_focus(this)' /></td><td><input type='text' value='3月26日' onblur='input_blur(this)' onfocus='input_focus(this)' /></td></tr>";
        str = str + "<tr><td>天空状况</td><td class='weather'><div style='width:100%;height:100%;'><label><img id='oneday1-img1' class='Imghover' src='../Images/tq/01.png' onclick='choose_img(this)' /></label><div class='pic' id='oneday1-img2'><img src='../../Images/PageImage/cloudy.jpg'/><img src='../../Images/PageImage/smallrain.jpg'/></div><input type='text' value='阴天有小雨' onblur='input_blur(this)' onfocus='input_focus(this)' style='height:25%;'/></div></td><td class='weather'><div style='width:100%;height:100%;'><label><img id='oneday2-img1' class='Imghover' src='../Images/tq/01.png' onclick='choose_img(this)' /></label><div class='pic' id='oneday2-img2'><img src='../../Images/PageImage/cloudy.jpg'/><img src='../../Images/PageImage/smallrain.jpg'/></div><input type='text' value='阴天有小雨' onblur='input_blur(this)' onfocus='input_focus(this)' style='height:25%;'/></div></td><td class='weather'><div style='width:100%;height:100%;'><label><img id='oneday3-img1' class='Imghover' src='../Images/tq/01.png' onclick='choose_img(this)' /></label><div class='pic' id='oneday3-img2'><img src='../../Images/PageImage/cloudy.jpg'/><img src='../../Images/PageImage/smallrain.jpg'/></div><input type='text' value='阴天有小雨' onblur='input_blur(this)' onfocus='input_focus(this)' style='height:25%;'/></div></td><td class='weather'><div style='width:100%;height:100%;'><label><img id='oneday4-img1' class='Imghover' src='../Images/tq/01.png' onclick='choose_img(this)' /></label><div class='pic' id='oneday4-img2'><img src='../../Images/PageImage/cloudy.jpg'/><img src='../../Images/PageImage/smallrain.jpg'/></div><input type='text' value='阴天有小雨' onblur='input_blur(this)' onfocus='input_focus(this)' style='height:25%;'/></div></td><td class='weather'><div style='width:100%;height:100%;'><label><img id='oneday5-img1' class='Imghover' src='../Images/tq/01.png' onclick='choose_img(this)' /></label><div class='pic' id='oneday5-img2'><img src='../../Images/PageImage/cloudy.jpg'/><img src='../../Images/PageImage/smallrain.jpg'/></div><input type='text' value='阴天有小雨' onblur='input_blur(this)' onfocus='input_focus(this)' style='height:25%;'/></div></td><td class='weather'><div style='width:100%;height:100%;'><label><img id='oneday6-img1' class='Imghover' src='../Images/tq/01.png' onclick='choose_img(this)' /></label><div class='pic' id='oneday6-img2'><img src='../../Images/PageImage/cloudy.jpg'/><img src='../../Images/PageImage/smallrain.jpg'/></div><input type='text' value='阴天有小雨' onblur='input_blur(this)' onfocus='input_focus(this)' style='height:25%;'/></div></td><td class='weather'><div style='width:100%;height:100%;'><label><img id='oneday7-img1' class='Imghover' src='../Images/tq/01.png' onclick='choose_img(this)' /></label><div class='pic' id='oneday7-img2'><img src='../../Images/PageImage/cloudy.jpg'/><img src='../../Images/PageImage/smallrain.jpg'/></div><input type='text' value='阴天有小雨' onblur='input_blur(this)' onfocus='input_focus(this)' style='height:25%;'/></div></td></tr>";
        str = str + "<tr><td>气温</td><td><input type='text' value='22-30℃' onblur='input_blur(this)' onfocus='input_focus(this)' /></td><td><input type='text' value='22-30℃' onblur='input_blur(this)' onfocus='input_focus(this)' /></td><td><input type='text' value='22-30℃' onblur='input_blur(this)' onfocus='input_focus(this)' /></td><td><input type='text' value='22-30℃' onblur='input_blur(this)' onfocus='input_focus(this)' /></td><td><input type='text' value='22-30℃' onblur='input_blur(this)' onfocus='input_focus(this)' /></td><td><input type='text' value='22-30℃' onblur='input_blur(this)' onfocus='input_focus(this)' /></td><td><input type='text' value='22-30℃' onblur='input_blur(this)' onfocus='input_focus(this)' /></td></tr>";
        str = str + "<tr><td>风向风力</td><td><input type='text' value='东南风3-4级' onblur='input_blur(this)' onfocus='input_focus(this)' /></td><td><input type='text' value='东南风3-4级' onblur='input_blur(this)' onfocus='input_focus(this)' /></td><td><input type='text' value='东南风3-4级' onblur='input_blur(this)' onfocus='input_focus(this)' /></td><td><input type='text' value='东南风3-4级' onblur='input_blur(this)' onfocus='input_focus(this)' /></td><td><input type='text' value='东南风3-4级' onblur='input_blur(this)' onfocus='input_focus(this)' /></td><td><input type='text' value='东南风3-4级' onblur='input_blur(this)' onfocus='input_focus(this)' /></td><td><input type='text' value='东南风3-4级' onblur='input_blur(this)' onfocus='input_focus(this)' /></td></tr>";

        $(".haikouWeather_table").html(str);

    } else {
        newdata = JSON.parse(data)[0];
        //取最新的值
        recid = newdata[newdata.length - 1].RECID;
        ddatetime = newdata[newdata.length - 1].DDATETIME;
        issueid = newdata[newdata.length - 1].ISSUEID;
        forecaster = newdata[newdata.length - 1].FORECASTER;
        earlyweather = newdata[newdata.length - 1].EARLYWEATHER;
        haikouweather = newdata[newdata.length - 1].HAIKOUWEATHER;
        forecasttime = newdata[newdata.length - 1].FORECASTTIME;
        weather = newdata[newdata.length - 1].WEATHER;
        weatherpic = newdata[newdata.length - 1].WEATHERPIC;
        temperature = newdata[newdata.length - 1].TEMPERATURE;
        wind = newdata[newdata.length - 1].WIND;
        suggest = newdata[newdata.length - 1].SUGGEST;

        $("#cbUser").html(forecaster);
        $("#early_weather").html(earlyweather);
        $("#haikou_weather").html(haikouweather);
        $("#defenSuggest").html(suggest);
    }
}

//获取旬报数据
function GetPeriodMonthDatas(){
    var recid;
    var ddatetime;
    var forecaster;
    var middleMonth_detail;   //中旬
    var endMonth_detail;      //下旬
    var date;
    var time;
    var selectHour;

    if (data === null || data === "undefined" || data === "[]" || data === "") {
        $(".title1").html("2017年5月中旬天气趋势预报");
        $(".title2").html("2017年3月下旬天气趋势预报");
        $("#middleMonth_detail").html("&nbsp;&nbsp;预计，5月11日,我市多云；12日，多云，局地午后有雷阵雨；13-18日多云有雷阵雨；19-20日多云。\n&nbsp;&nbsp;旬    雨    量： 55.0-70.0毫米。\n&nbsp;&nbsp;旬 平 均 气 温： 26.5-28.5℃。\n&nbsp;&nbsp;旬极端最高气温： 35.0-37.0℃。");
        $("#endMonth_detail").html("&nbsp;&nbsp;3月20日～25日白天，受东到东南气流影响，大部分地区多云，其中22～23日,多云有阵雨；25日夜间～29日，受冷空气影响，阴天有小阵雨，气温显著下降；30～31日，受东南气流影响，多云，气温回升。旬降雨量接近常年平均值，旬平均气温接近常年平均值。\n&nbsp;&nbsp;旬    雨    量：15-35毫米。\n&nbsp;&nbsp;旬 平 均 气 温： 22.9-23.9℃。\n&nbsp;&nbsp;旬极端最低气温： 17.3-19.3℃。\n&nbsp;&nbsp;旬极端最高气温： 32.0-33.0℃");

        date = new Date();
        ddatetime = date.format("yyyy-MM-dd");
        $("#date").val(ddatetime);
        $("#top ul li button").removeClass("active");
        $("#button08").addClass("active");
    } else {
        newdata = JSON.parse(data)[0];
        time = newdata[newdata.length - 1].DDATETIME;
        date = new Date();
        ddatetime = date.format("yyyy-MM-dd");

        if (time.split("T")[0] == ddatetime) {
            //取最新的值
            recid = newdata[newdata.length - 1].RECID;
            forecaster = newdata[newdata.length - 1].FORECASTER;
            selectHour = time.split("T")[1].split(":")[0];
            middleMonth_detail = newdata[newdata.length - 1].MIDDLEMONTH;
            endMonth_detail = newdata[newdata.length - 1].LASTMONTH;
            title1 = newdata[newdata.length - 1].TITLE1;
            title2 = newdata[newdata.length - 1].TITLE2;


            $("#date").val(ddatetime);
            $("#top ul li button").removeClass("active");
            $("#button" + selectHour + "").addClass("active");
            $("#cbUser").val(forecaster);

            if (middleMonth_detail === null || middleMonth_detail === "undefined" || middleMonth_detail === "[]" || middleMonth_detail === "") {
                middleMonth_detail = "";
            }
            if (endMonth_detail === null || endMonth_detail == "undefined" || endMonth_detail === "[]" || endMonth_detail === "") {
                endMonth_detail = "";
            }

            $("#middleMonth_detail").val(middleMonth_detail);
            $("#endMonth_detail").val(endMonth_detail);
            $(".title1").val(title1);
            $(".title2").val(title2);
        } else {
            $(".title1").html("2017年5月中旬天气趋势预报");
            $(".title2").html("2017年3月下旬天气趋势预报");
            $("#middleMonth_detail").html("&nbsp;&nbsp;预计，5月11日,我市多云；12日，多云，局地午后有雷阵雨；13-18日多云有雷阵雨；19-20日多云。\n&nbsp;&nbsp;旬    雨    量： 55.0-70.0毫米。\n&nbsp;&nbsp;旬 平 均 气 温： 26.5-28.5℃。\n&nbsp;&nbsp;旬极端最高气温： 35.0-37.0℃。");
            $("#endMonth_detail").html("&nbsp;&nbsp;3月20日～25日白天，受东到东南气流影响，大部分地区多云，其中22～23日,多云有阵雨；25日夜间～29日，受冷空气影响，阴天有小阵雨，气温显著下降；30～31日，受东南气流影响，多云，气温回升。旬降雨量接近常年平均值，旬平均气温接近常年平均值。\n&nbsp;&nbsp;旬    雨    量：15-35毫米。\n&nbsp;&nbsp;旬 平 均 气 温： 22.9-23.9℃。\n&nbsp;&nbsp;旬极端最低气温： 17.3-19.3℃。\n&nbsp;&nbsp;旬极端最高气温： 32.0-33.0℃");

            date = new Date();
            ddatetime = date.format("yyyy-MM-dd");
            $("#date").val(ddatetime);
            $("#top ul li button").removeClass("active");
            $("#button08").addClass("active");
        }
    }
}


//获取月报数据
function GetMonthDatas() {
    var recid;
    var ddatetime;
    var forecaster;
    var decforecast;            //12月天气概况
    var janforecast;           //1月天气预报
    var earlyjanforecast;      //1月上旬天气预报
    var date;
    var time;
    var selectHour;

    if (data === null || data === "undefined" || data === "[]" || data === "") {
        $(".title1").val("2016年12月天气概况");
        $(".title2").val("2017年1月天气趋势预报");
        $(".title3").val("2017年1月上旬天气趋势预报");
        $("#month_detail1").html("&nbsp;&nbsp;据2016年12月1日至30日的气象资料统计，月平均气温20.9℃，比常年同期偏高1.1℃；月雨量17.0毫米，与常年相比偏少56.9%。12月11～13日、16～18日和23～27日受冷空气影响，普降小雨。");
        $("#month_detail2").html("&nbsp;&nbsp;预计2017年1月平均气温偏高，月雨量略偏少。主要冷空气与降水时段：上旬中后期、中旬前期、下旬中期。最低气温主要出现在中旬。\n&nbsp;&nbsp;月 平 均 气 温  18.0～19.0℃\n&nbsp;&nbsp;月极端最低气温  8.8～10.8℃\n&nbsp;&nbsp;月    雨    量  13.0～23.0毫米");
        $("#month_detail3").html("&nbsp;&nbsp;预计，1月上旬,冷空气势力较弱,以多云或阴天天气为主。旬雨量较常年平均值正常略偏少，旬平均气温较常年平均值正常略偏高。\n&nbsp;&nbsp;旬 平 均 气 温   18.0℃～19.0℃\n&nbsp;&nbsp;旬极端最低气温   17.5～19.5℃\n&nbsp;&nbsp;旬     雨    量  5.0～10.0毫米");

        date = new Date();
        ddatetime = date.format("yyyy-MM-dd");
        $("#date").val(ddatetime);
        $("#top ul li button").removeClass("active");
        $("#button08").addClass("active");

    } else {
        newdata = JSON.parse(data)[0];
        time = newdata[newdata.length - 1].DDATETIME;
        date = new Date();
        ddatetime = date.format("yyyy-MM-dd");

        if (time.split("T")[0] == ddatetime) {
            //取最新的值
            recid = newdata[newdata.length - 1].RECID;
            time = newdata[newdata.length - 1].DDATETIME;
            selectHour = time.split("T")[1].split(":")[0];
            forecaster = newdata[newdata.length - 1].FORECASTER;
            decforecast = newdata[newdata.length - 1].DECFORECAST;
            janforecast = newdata[newdata.length - 1].JANFORECAST;
            earlyjanforecast = newdata[newdata.length - 1].EARLYJANFORECAST;
            title1 = newdata[newdata.length - 1].TITLE1;
            title2 = newdata[newdata.length - 1].TITLE2;
            title3 = newdata[newdata.length - 1].TITLE3;

            date = new Date();
            ddatetime = date.format("yyyy-MM-dd");
            $("#date").val(ddatetime);
            $("#top ul li button").removeClass("active");
            $("#button" + selectHour + "").addClass("active");
            $("#cbUser").val(forecaster);
            $("#month_detail1").val(decforecast);
            $("#month_detail2").val(janforecast);
            $("#month_detail3").val(earlyjanforecast);
            $(".title1").val(title1);
            $(".title2").val(title2);
            $(".title3").val(title3);
        } else {
            $(".title1").val("2016年12月天气概况");
            $(".title2").val("2017年1月天气趋势预报");
            $(".title3").val("2017年1月上旬天气趋势预报");
            $("#month_detail1").html("&nbsp;&nbsp;据2016年12月1日至30日的气象资料统计，月平均气温20.9℃，比常年同期偏高1.1℃；月雨量17.0毫米，与常年相比偏少56.9%。12月11～13日、16～18日和23～27日受冷空气影响，普降小雨。");
            $("#month_detail2").html("&nbsp;&nbsp;预计2017年1月平均气温偏高，月雨量略偏少。主要冷空气与降水时段：上旬中后期、中旬前期、下旬中期。最低气温主要出现在中旬。\n&nbsp;&nbsp;月 平 均 气 温  18.0～19.0℃\n&nbsp;&nbsp;月极端最低气温  8.8～10.8℃\n&nbsp;&nbsp;月    雨    量  13.0～23.0毫米");
            $("#month_detail3").html("&nbsp;&nbsp;预计，1月上旬,冷空气势力较弱,以多云或阴天天气为主。旬雨量较常年平均值正常略偏少，旬平均气温较常年平均值正常略偏高。\n&nbsp;&nbsp;旬 平 均 气 温   18.0℃～19.0℃\n&nbsp;&nbsp;旬极端最低气温   17.5～19.5℃\n&nbsp;&nbsp;旬     雨    量  5.0～10.0毫米");

            date = new Date();
            ddatetime = date.format("yyyy-MM-dd");
            $("#date").val(ddatetime);
            $("#top ul li button").removeClass("active");
            $("#button08").addClass("active");
        }

        
    }
}

function input_focus(val) {
    //判断是否天空状况一栏
    if ($(val).parent().parent().hasClass("weather")) {
        $(val).parent().css("border", "1px solid green");
    } else {
        $(val).css("border", "1px solid green");
    }
    
}

function input_blur(val) {
    //判断是否天空状况一栏
    if ($(val).parent().parent().hasClass("weather")) {
        $(val).parent().css("background", "#63b363");
    }
    $(val).parent().css("border", "1px solid #fff");
    $(val).css("border", "1px solid #63b363");
    $(val).css("background", "#63b363");
}

function choose_img(pic) {
    $(".xuanfu").css("display", "block");
    imgWeather = $(pic).attr("id");

    $(".xuanfu div label").click(function () {
        var id = $(this).attr("id");
        if (id == "" || id == "undefined") {
            return;
        }
        var imagesrc = id.split('-')[1];
        var weathertext = $("#" + id).text();
        weathertext = weathertext.split("(")[0];
        var weatherinput = $("#" + imgWeather).parent().siblings("input");
        weatherinput.val(weathertext);
        document.getElementById(imgWeather).src = "../../Images/tq/" + imagesrc + ".png";

        $(".xuanfu").css("display", "none");
    })
}

onblue = function () {
    $(".xuanfu").css("display", "none");
    if (tiao)
        $("#" + onId).css("border", "1px solid #B2CCB2");
    else
        $("#" + footId).css("border", "1px solid #B2CCB2");
}

out = function (id) {
    $("#" + id).css("color", "");
    $("#" + id).css("background", "");
}
over = function (id) {
    $("#" + id).css("color", "red");
    $("#" + id).css("background", "rgb(218, 222, 218)");
}






