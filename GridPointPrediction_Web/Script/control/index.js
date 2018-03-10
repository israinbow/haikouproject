/// <reference path="../library/linq.js/linq-vsdoc.js" />
/// <reference path="../library/linq.js/linq.js" />
var dateTimeWidget, playWidget, thunderSynal, productLayer;
var newestDate, newestHour;
window.onload = function () {

    //获取到最新时间
    WebMethod.callBack("../../Page/PromptPage.aspx/SetUIDate", null, function (msg) {
        if (msg == null) {
            alert("系统加载出现异常，请联系技术人员处理！");
            return;
        } else {
            var newtime = msg;
        }
        var str = msg.split(" ");     //处理数据 把日期和时间分别取出赋值
        nowDate = str[0];
        nowHour = str[1].split(":")[0];
        newestDate = nowDate.substring(0, 4) + nowDate.substring(5, 7) + nowDate.substring(8, 11);
        var newestDateStr = nowDate.substring(0, 4) + "-" + nowDate.substring(5, 7) + "-" + nowDate.substring(8, 11);
        newestHour = nowHour;
        //先清空时间，再赋值
        $(".hasDatepicker").val("");
        $(".hasDatepicker").val(newestDateStr);
        $("#datetimePicker_div select").val("");
        $("#datetimePicker_div select").val(newestHour);
        initIndexPicShow();
        //console.log(newestDate);

        var pic = $('<img src="http://10.155.95.202:8080/data/top/%E7%89%A9%E7%90%86%E9%87%8F/Product/KIndex/' + newestDate + '/EC_HaiNan_KIndex_Max_' + newestDate + newestHour + '00_0.png"  id="pic"  />').appendTo($(".container"));
    })

    setTimeout(function () {
        playWidget = null;
        var dateList = [];
        var data = new Date();
        var vnow = new Date();
        for (var i = 0, vnow; i < 15; i++) {
            vnow.setMinutes(data.getMinutes() + 30 * i);
            dateList.push(vnow);
        }
        //dateList = BindNewDataTimesLine(vnow.toString("yyyyMMddHHmm"));
        dateList.push(vnow);
        initPlayWidget(dateList);
        playWidget.start();
        SetUIDate();
        initDateShow();
    }, 50);
    //initDateTimePicker();
    //bindControlEvent();
    // var hhi = window.screen.availHeigh - document.getElementById('header').offsetHeight - document.getElementById('body_left').offsetHeight;
    // var wwi = document.getElementById('header').offsetWidth;
    // var playwidth = wwi / 2 - 46 - 27;
    //// $("#map_div").css("height", hhi + "px");
    //// $("#map_div").css("width", wwi + "px");
    // $("#playerContainer_td").css("width", playwidth + "px");

}
window.onresize = function () {
    //  setMapSize();
}

//加载页面时的预报时次时间
function initDateShow() {
    if (newestHour == "20") {
        var newestDateStr = newestDate.substring(0, 4) + "-" + newestDate.substring(4, 6) + "-" + newestDate.substring(6, 8);
        $("#startDay").text(newestDate.substring(4, 6) + "-" + newestDate.substring(6, 8));
        $("#startDay").css("width", "46px");

        date = newestDateStr.split(" ");
        d = new Date(date);
        d = +d + 1000 * 60 * 60 * 24;
        d = new Date(d);

        var strYear = d.getFullYear();
        var strDay = d.getDate();
        var strMonth = d.getMonth() + 1;

        if (strMonth < 10) {
            strMonth = "0" + strMonth;
        }
        if (strDay < 10) {
            strDay = "0" + strDay;
        }
        var date = strMonth + "/" + strDay + "/" + strYear;    //此处也可以写成 17/07/2014 一样识别    也可以写成 07-17-2014  但需要正则转换   
        var day = new Date(Date.parse(date));   //需要正则转换的则 此处为 ： var day = new Date(Date.parse(date.replace(/-/g, '/')));  
        var today = new Array('星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六');
        var week = today[day.getDay()];

        newestDateStr2 = strYear + "-" + strMonth + "-" + strDay + "(" + week +")";
        $("#startDay2").text(newestDateStr2);
        $("#startDay2").css("width", "189px");

        date = newestDateStr2.split(" ");
        d = new Date(date);
        d = +d + 1000 * 60 * 60 * 24;
        d = new Date(d);

        var strYear = d.getFullYear();
        var strDay = d.getDate();
        var strMonth = d.getMonth() + 1;

        if (strMonth < 10) {
            strMonth = "0" + strMonth;
        }
        if (strDay < 10) {
            strDay = "0" + strDay;
        }
        var date = strMonth + "/" + strDay + "/" + strYear;    //此处也可以写成 17/07/2014 一样识别    也可以写成 07-17-2014  但需要正则转换   
        var day = new Date(Date.parse(date));   //需要正则转换的则 此处为 ： var day = new Date(Date.parse(date.replace(/-/g, '/')));  
        var today = new Array('星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六');
        var week = today[day.getDay()];

        newestDateStr3 = strYear + "-" + strMonth + "-" + strDay + "(" + week + ")";
        $("#startDay3").text(newestDateStr3);
        $("#startDay3").css("width", "142px");
    } else {
        var strYear = newestDate.substring(0, 4);
        var strMonth = newestDate.substring(4, 6);
        var strDay = newestDate.substring(6, 8);
        var newestDateStr = strYear + "/" + strMonth + "/" + strDay;
        var date = strMonth + "/" + strDay + "/" + strYear;    //此处也可以写成 17/07/2014 一样识别    也可以写成 07-17-2014  但需要正则转换   
        var day = new Date(Date.parse(date));   //需要正则转换的则 此处为 ： var day = new Date(Date.parse(date.replace(/-/g, '/')));  
        var today = new Array('星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六');
        var week = today[day.getDay()];

        newestDateStr = strYear + "-" + strMonth + "-" + strDay + "(" + week + ")";
        $("#startDay").text(newestDateStr);
        $("#startDay").css("width", "142px");

        date = newestDateStr.split(" ");
        d = new Date(date);
        d = +d + 1000 * 60 * 60 * 24;
        d = new Date(d);

        var strYear = d.getFullYear();
        var strDay = d.getDate();
        var strMonth = d.getMonth() + 1;

        if (strMonth < 10) {
            strMonth = "0" + strMonth;
        }
        if (strDay < 10) {
            strDay = "0" + strDay;
        }
        var date = strMonth + "/" + strDay + "/" + strYear;    //此处也可以写成 17/07/2014 一样识别    也可以写成 07-17-2014  但需要正则转换   
        var day = new Date(Date.parse(date));   //需要正则转换的则 此处为 ： var day = new Date(Date.parse(date.replace(/-/g, '/')));  
        var today = new Array('星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六');
        var week = today[day.getDay()];

        newestDateStr2 = strYear + "-" + strMonth + "-" + strDay + "(" + week + ")";
        $("#startDay2").text(newestDateStr2);
        $("#startDay2").css("width", "189px");

        date = newestDateStr2.split(" ");
        d = new Date(date);
        d = +d + 1000 * 60 * 60 * 24;
        d = new Date(d);

        var strYear = d.getFullYear();
        var strDay = d.getDate();
        var strMonth = d.getMonth() + 1;

        if (strMonth < 10) {
            strMonth = "0" + strMonth;
        }
        if (strDay < 10) {
            strDay = "0" + strDay;
        }
        newestDateStr3 = strMonth + "-" + strDay;
        $("#startDay3").text(newestDateStr3);
        $("#startDay3").css("width", "46px");
    }
}

//地图大小适应
function setMapSize() {
    var mapHeight = $(window).height();
    var mapWidth = $(window).width();
    var topheight = $('#top_div').height();
    document.getElementById("map_div").style.height = (mapHeight - topheight) + "px";
    //    document.getElementById("map_div").style.width = (mapWidth) + "px";
    document.getElementById("wapper").style.width = (mapWidth) + "px";
    document.getElementById("top_div").style.width = (mapWidth) + "px";
}


//时间控件
function initDateTimePicker() {
    mydojo.module(["datetimePicker", "datePicker"], function (datetimePicker, datePicker) {
        dateTimeWidget = new datetimePicker(document.getElementById("datetimePicker_div"));
        dateTimeWidget.onUpdate = function (data) {
            //更新时间
            //   dnow = dateTimeWidget.getValue();
            var dateList = [];
            //for (var i = 0, vnow; i < 15; i++) {

            var vnow = new Date(data);
            //    vnow.setMinutes(data.getMinutes() + 30 * i);
            //    dateList.push(vnow);
            //}
            dateList = BindNewDataTimesLine(vnow.toString("yyyyMMddHHmm"));


            if (playWidget)
                playWidget.setScaleElements(dateList);
            else
                initPlayWidget(dateList);
            playWidget.start();
            //  initPlayWidget(dateList);
        }
        //  var dnow = dateTimeWidget.getValue()
        var dnow = new Date();
        dnow.setMinutes(dnow.getMinutes() - dnow.getMinutes() % 30);
        dateTimeWidget.setValue(dnow);
    });
}
//初始化动画
function initPlayWidget(dateTimeList) {
    var button_play = document.getElementById("play_img"), button_prev = document.getElementById("play_back_img"), button_next = document.getElementById("play_front_img");
    mydojo.module(["player"], function (player) {
        if (playWidget == null) {
            playWidget = new player({ enableSlidePlay: true, container: "playerContainer_td", dateTimeList: dateTimeList, speed: 1300, btnPlay: button_play, btnPrev: button_prev, btnNext: button_next });
            playWidget.onPlay = function (dt, index, isAuto) {
              
                if (!physicalVal) {
                    $("#pic")[0].src = "http://10.155.95.202:8080/data/top/%E7%89%A9%E7%90%86%E9%87%8F/Product/KIndex/" + newestDate + "/EC_HaiNan_KIndex_Max_" + newestDate + "" + newestHour + "00_" + index * 3 + ".png";
                } else {
                    $("#pic")[0].src = "";

                    if (physicalVal == "CAPE" || physicalVal == "RSH" || physicalVal == "PW") {
                        $("#pic")[0].src = "http://10.155.95.202:8080/data/top/%E7%89%A9%E7%90%86%E9%87%8F/Product/" + physicalVal + "/" + newestDate + "/EC_ZhuSanJiao_" + physicalVal + "_Max_" + newestDate + "" + newestHour + "00_" + index * 3 + ".png";
                    } else {
                        $("#pic")[0].src = "http://10.155.95.202:8080/data/top/%E7%89%A9%E7%90%86%E9%87%8F/Product/" + physicalVal + "/" + newestDate + "/EC_HaiNan_" + physicalVal + "_Max_" + newestDate + "" + newestHour + "00_" + index * 3 + ".png";
                    }

                }

                if (isAuto) {
                    button_prev.src = "../../Images/PageImage/images/button/left.png";
                    button_next.src = "../../Images/PageImage/images/button/right.png";
                    button_play.src = "../../Images/PageImage/images/button/play.png";
                }
                    
                //$('#map_time').text(dt.toString('yyyy年MM月dd日 HH:mm'));
            }
            playWidget.onStop = function () {
                button_play.src = "../../Images/PageImage/images/button/stop.png";
            }
            playWidget.start();
        }
    });
}
BindNewDataTimesLine = function (times) {
    if (!times) {
        times = new Date().toString("yyyyMMddHHmm");
    }
    var ServerdateList = [];

    //WebMethod.getData("HelloW", {}, "HSPlayService.asmx");

    //    var msg = WebMethod.getData("GetTimesInfo", { Rtype: 0, Rdatime: times }, "HSPlayService.asmx");
    //    if (msg != null || msg != "") {
    //        msg = msg.d.split("|");
    //        for (var i = 0; i < msg.length; i++) {
    //            if (msg[i].length > 0) {
    //                vnow = new Date(Date.parse(msg[i].replace(/-/g, "/")));
    //                ServerdateList.push(vnow);
    //            }
    //        }
    //    }

    FunAjax("Ajax/AjaxGetTimesInfo.aspx?type=0" + "&datime=" + times, function (msg) {
        msg = msg.split("|");

        for (var i = msg.length - 1; i >= 0; i--) {
            if (msg[i].length > 0) {
                vnow = new Date(Date.parse(msg[i].replace(/-/g, "/")));
                ServerdateList.push(vnow);
            }
        }

    });
    return ServerdateList;
};
FunAjax = function (url, fun) {
    $.ajax({
        type: "post", async: false, url: url, success: fun,
        error: function (mm) {
            var sss = mm;
        }
    });
};
function bindControlEvent() {
    $("#rangeinput").buttonset();
    $("#update_button").on("click", function () {
        dateTimeWidget.onUpdate(dateTimeWidget.getValue());
        $(this).css('background-color', '#ff6c07')
        $("#new_button").css('background-color', '#2384D8')
    });
    $("#new_button").on("click", function () {
        window.location.reload();
    });
    $("#water").on("click", function () {
        TypeSwitch(1);
    });
    $("#u11data").on("click", function () {
        TypeSwitch(2);
    });
    $("#u12data").on("click", function () {
        TypeSwitch(3);
    });
    $("#Cloudclassification").on("click", function () {
        TypeSwitch(4);
    });
    $("#Cloudstate").on("click", function () {
        TypeSwitch(5);
    });
}
var selectTypes;
TypeSwitch = function (seledata) {
    if (!selectTypes) {
        selectTypes = [];
        selectTypes.push("#water");
        selectTypes.push("#u11data");
        selectTypes.push("#u12data");
        selectTypes.push("#Cloudclassification");
        selectTypes.push("#Cloudstate");
    }
    switch (seledata) {
        case 1:
            //水汽图
            nametypevalue = "_B08_T6.2.png";
            break;
        case 2:
            //11微米
            nametypevalue = "_B14_T11.2.png";
            break;
        case 3:
            //12微米
            nametypevalue = "_B15_T12.3.png";
            break;
        case 4:
            //云分类
            nametypevalue = "_NIR2.3_Day_Micro_R0.6_R2.3_T11.2_rgb.png";
            break;
        case 5:
            //云相态
            nametypevalue = "_Solar_Micro_R1.6_R2.3_R0.4_rgb.png";
            break;
    }
    for (var i = 0; i < selectTypes.length; i++) {
        if (seledata == i + 1) {
            $(selectTypes[i]).css("background-color", "#FF6C07");
        } else {
            $(selectTypes[i]).css("background-color", "#2384D8");
        }
    }

}


