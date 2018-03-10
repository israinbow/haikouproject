
$(function () {
    initDateTimePicker();

    //日期减少一天
    $("#date_up").click(function () {
        var date = $(".hasDatepicker").val();
        date = date.split(" ");
        GetDayUp(date[0].substring(0, 4), date[0].substring(5, 7), date[0].substring(8, 11));
    });
    //日期增加一天
    $("#date_down").click(function () {
        var date = $(".hasDatepicker").val();
        date = date.split(" ");
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

        $(".hasDatepicker").val(strYear + "-" + strMonth + "-" + strDay);
    });

    //时间增加
    $("#hour_up").click(function () {
        var hour = $("#datetimePicker_div select option:selected").text();
        if (hour == "20") {
            $("#datetimePicker_div select").val(08);
        }
    });
    //时间减少
    $("#hour_down").click(function () {
        var hour = $("#datetimePicker_div select option:selected").text();
        if (hour == "08") {
            $("#datetimePicker_div select").val(20);
        }
    });
})


//获取最新时间
function SetUIDate() {
    $(".btn_divdown").addClass("active");
    $(".btn_divup").removeClass("active");
    myDate = new Date();

    WebMethod.callBack("../../Page/PromptPage.aspx/SetUIDate", null, function (msg) {
        if (msg == null) {
            alert("系统加载出现异常，请联系技术人员处理！");
            return;
        } else {
            var newtime = msg;
        }
        var str = msg.split(" ");     //处理数据 把日期和时间分别取出赋值
        //console.log(str);
        var nowDate = str[0];
        var nowHour = str[1].split(":")[0];
        var nowMinute = str[1].split(":")[1] % 60 * 60;  //处理分钟为0的情况 00 -> 0
        //console.log(nowDate + nowHour + nowMinute);

        //先清空时间，再赋值
        $(".hasDatepicker").val("");
        $(".hasDatepicker").val(nowDate);
        $("#datetimePicker_div select").val("");
        $("#datetimePicker_div select").val(nowHour);

        nowDate = nowDate.substring(0, 4) + nowDate.substring(5, 7) + nowDate.substring(8, 11);
        newestDate = nowDate;
        newestHour = nowHour;

        initIndexPicShow();
    })
    setTimeout(function () {
        //先停止之前播放的动画再重新调用
        playWidget.stop();

        playWidget = null;
        var dateList = [];
        var data = new Date();
        var vnow = new Date();
        for (var i = 0, vnow; i < 15; i++) {
            vnow.setMinutes(data.getMinutes() + 30 * i);
            dateList.push(vnow);
        }
        
        dateList.push(vnow);
        initPlayWidget(dateList);
        playWidget.start();
        initDateShow();
    }, 50);
}


//获取最新时间
function SetNewDate() {
    $(".btn_divdown").addClass("active");
    $(".btn_divup").removeClass("active");

    myDate = new Date();

    WebMethod.callBack("../mesoscaleAnalysis.aspx/SetNewDate", null, function (msg) {
        if (msg == null) {
            alert("系统加载出现异常，请联系技术人员处理！");
            return;
        } else {
            var newtime = msg;
        }
        var str = msg.split(" ");     //处理数据 把日期和时间分别取出赋值
        //console.log(str);
        var nowDate = str[0];
        var nowHour = str[1].split(":")[0];
        var nowMinute = str[1].split(":")[1] % 60 * 60;  //处理分钟为0的情况 00 -> 0
        //console.log(nowDate + nowHour + nowMinute);

        //先清空时间，再赋值
        $(".hasDatepicker").val("");
        $(".hasDatepicker").val(nowDate);
        $("#datetimePicker_div select").val("");
        $("#datetimePicker_div select").val(nowHour);

        nowDate = nowDate.substring(0, 4) + nowDate.substring(5, 7) + nowDate.substring(8, 11);
        newestDate = nowDate;
        newestHour = nowHour;
    })


    setTimeout(function () {
        //先停止之前的播放再重新调用
        playWidget.stop();
        playWidget = null;
        var dateList = [];
        var data = new Date();
        var vnow = new Date();
        for (var i = 0, vnow; i < 8; i++) {
            vnow.setMinutes(data.getMinutes() + 30 * i);
            dateList.push(vnow);
        }
        //dateList = BindNewDataTimesLine(vnow.toString("yyyyMMddHHmm"));
        dateList.push(vnow);
        initPlayWidget(dateList);
        playWidget.start();
        initDateShow();
    }, 50);
}




function GetDayUp(year, month, day) {
    var today = new Date(year, month - 1, day);
    var yesterday_milliseconds = today.getTime() - 1000 * 60 * 60 * 24;

    var yesterday = new Date();
    yesterday.setTime(yesterday_milliseconds);

    var strYear = yesterday.getFullYear();
    var strDay = yesterday.getDate();
    var strMonth = yesterday.getMonth() + 1;
    if (strMonth < 10) {
        strMonth = "0" + strMonth;
    }
    if (strDay < 10) {
        strDay = "0" + strDay;
    }
    var strYesterday = strYear + "-" + strMonth + "-" + strDay;
    $(".hasDatepicker").val(strYesterday);
}


//时间控件
function initDateTimePicker() {
    mydojo.module(["datetimePicker", "datePicker"], function (datetimePicker, datePicker) {
        dateTimeWidget = new datetimePicker(document.getElementById("datetimePicker_div"));

        $("#datetimePicker_div input").css("outline", "none");
        $("#datetimePicker_div select").css("outline", "none");
        $("#datetimePicker_div select:last-child").css("display", "none");

        dateTimeWidget.onUpdate = function (data) {
            var dateList = [];
            var vnow = new Date(data);
        }
        var dnow = new Date();
        dnow.setMinutes(dnow.getMinutes() - dnow.getMinutes() % 30);
        dateTimeWidget.setValue(dnow);
    });
}


//获取格点预报数据
function getgriddata() {
    $(".btn_divdown").removeClass("active");
    $(".btn_divup").addClass("active");


    getPicShow();
    
    griddatanew = [];
    griddata = [];
    var hasDate = $(".hasDatepicker").val().split('-');
    var ymd = $(".hasDatepicker").val();
    var hour = $("#datetimePicker_div select").val();
    var min = "00";   
    //var uitime = ($(".hasDatepicker").val() + " " + $("#datetimePicker_div select").val() + ":" + $("#datetimePicker_div select:last-child").val() + ":00").toDate();
    
    var hm = hour + ":" + min;
    var mydate = ymd + " " + hm + ":00";
    var uitime = mydate.toDate();
  
    $.post('../WebService.asmx/GetScwcasDatas', {
        NewTime: uitime.format("yyyy-MM-dd hh:mm:ss")
    }, function (data, textStatus, xhr) {
        if (data === null || data === undefined || data === "[]" || data === "") {
            griddata = null;
            return;
        }
        griddatanew = JSON.parse(data)[0][0];

        //处理数据赋值
        $("#kIndex").text(griddatanew.KI);
        $("#cape").text(griddatanew.CAPE);
        $("#hPa").text(griddatanew.QFLUX850);
        $("#t850").text(griddatanew.T850_T500);
        $("#windShear").text(griddatanew.WINDSHEAR);
        $("#pw").text(griddatanew.PW);

    }).error(function (xhr) {
        layer.msg('数据出错，请刷新重试。', {
            icon: 5
        });
    });
}

//下拉菜单
$(".control_arrow").click(function () {
    var dropDownMenu = $(".dropDownMenu");
    dropDownMenu.slideToggle("slow");

    var arrow = $(".control_arrow")[0];
    if ( arrow.src.indexOf("open")>-1 ) {
        arrow.src = "../../Images/PageImage/images/close.png";
    } else {
        arrow.src = "../../Images/PageImage/images/open.png";
    }
})





