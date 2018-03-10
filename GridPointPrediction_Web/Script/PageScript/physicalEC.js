var physicalVal;

//EC物理量切换模块图片
function changePic(val) {
    $("#" + val).addClass("active").siblings().removeClass("active");
    $("#" + val + " a").css("color", "#fff").parent().siblings().children().css("color", "#155F82");   //设置当前点击的元素样式改变
    
    //console.log(val);

    var str;

    switch (val) {
        case "KIndex":
            str = "EC_HaiNan_KIndex_Max_" + newestDate + "" + newestHour + "00_0.png";
            break;
        case "CAPE":
            str = "EC_ZhuSanJiao_CAPE_Max_" + newestDate + "" + newestHour + "00_0.png";
            break;
        case "PW":
            str = "EC_ZhuSanJiao_PW_Max_" + newestDate + "" + newestHour + "00_0.png";
            break;
        case "RSH":
            str = "EC_ZhuSanJiao_RSH_Max_" + newestDate + "" + newestHour + "00_0.png";
            break;
        case "5001000WINDSHEAR":
            str = "EC_HaiNan_5001000WINDSHEAR_Max_" + newestDate + "" + newestHour + "00_0.png";
            break;
        case "850VaporFlux":
            str = "EC_HaiNan_850VaporFlux_Max_" + newestDate + "" + newestHour + "00_0.png";
            break;
        case "925VaporFlux":
            str = "EC_HaiNan_925VaporFlux_Max_" + newestDate + "" + newestHour + "00_0.png";
            break;
        case "T700_T500":
            str = "EC_HaiNan_T700_T500_Max_" + newestDate + "" + newestHour + "00_0.png";
            break;
        case "T850_T500":
            str = "EC_HaiNan_T850_T500_Max_" + newestDate + "" + newestHour + "00_0.png";
            break;
        default: break;
    }
    //console.log(str);

    nametypevalue = val;

    $("#pic")[0].src = "http://10.155.95.202:8080/data/top/物理量/Product/" + val + "/" + newestDate + "/" + str + "";

    //先停止之前的播放再重新调用
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

    physicalVal = val;
}

//下拉菜单
$(".dropDownMenu li").hover(function () {
    $(this).children().css("color", "#fff");
}, function () {
    $(this).children().css("color", "#155F82");
});

//更新
function refreshDate() {
    $(".btn_divdown").removeClass("active");
    $(".btn_divup").addClass("active");

    var date = $(".hasDatepicker").val();
    date = date.substring(0, 4) + date.substring(5, 7) + date.substring(8, 11);
    var hour = $("#datetimePicker_div select").val();
    newestDate = date;
    newestHour = hour;
    //先停止之前的播放再重新调用
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
}