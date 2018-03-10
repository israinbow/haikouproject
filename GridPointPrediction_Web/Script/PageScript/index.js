
//初始化显示物理量监测指标值
function initIndexPicShow() {
    var Date = newestDate.substring(0, 4) + "年" + newestDate.substring(4, 6) + "月" + newestDate.substring(6, 8) + "日";
    var Hour = newestHour + "时";
    $(".weatherMap span").html(Date + Hour);  //填充到缩略图中的时间显示

    var mydate = newestDate.substring(0, 4) + "-" + newestDate.substring(4, 6) + "-" + newestDate.substring(6, 8) + " " + newestHour + ":00";
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
   
    $(".weathermapInfo .weatherMap_row:first-child .MapContainer:first-child .weatherMap")
        .css("background",
        "url(http://10.155.95.202:8080/data/top/%E7%89%A9%E7%90%86%E9%87%8F/Product/KIndex/" + newestDate + "/EC_HaiNan_KIndex_Max_" + newestDate + newestHour + "00_0.png) no-repeat center");
    $(".weathermapInfo .weatherMap_row:first-child .MapContainer:nth-child(2) .weatherMap")
        .css("background",
        "url(http://10.155.95.202:8080/data/top/%E7%89%A9%E7%90%86%E9%87%8F/Product/CAPE/" + newestDate + "/EC_CH_CAPE_Max_" + newestDate + newestHour + "00_0.png) no-repeat center");
    $(".weathermapInfo .weatherMap_row:first-child .MapContainer:nth-child(3) .weatherMap")
        .css("background",
        "url(http://10.155.95.202:8080/data/top/%E7%89%A9%E7%90%86%E9%87%8F/Product/PW/" + newestDate + "/EC_CH_PW_Max_" + newestDate + newestHour + "00_0.png) no-repeat center");
    $(".weathermapInfo .weatherMap_row:nth-child(2) .MapContainer:first-child .weatherMap")
        .css("background",
        "url(http://10.155.95.202:8080/data/top/%E7%89%A9%E7%90%86%E9%87%8F/Product/RSH/" + newestDate + "/EC_CH_RSH_Max_" + newestDate + newestHour + "00_0.png) no-repeat center");
    $(".weathermapInfo .weatherMap_row:nth-child(2) .MapContainer:nth-child(2) .weatherMap")
        .css("background",
        "url(http://10.155.95.202:8080/data/top/%E7%89%A9%E7%90%86%E9%87%8F/Product/5001000WINDSHEAR/" + newestDate + "/EC_HaiNan_5001000WINDSHEAR_Max_" + newestDate + newestHour + "00_0.png) no-repeat center");
    $(".weathermapInfo .weatherMap_row:nth-child(2) .MapContainer:nth-child(3) .weatherMap")
        .css("background",
        "url(http://10.155.95.202:8080/data/top/%E7%89%A9%E7%90%86%E9%87%8F/Product/850VaporFlux/" + newestDate + "/EC_HaiNan_850VaporFlux_Max_" + newestDate + newestHour + "00_0.png) no-repeat center");
    $(".weathermapInfo .weatherMap_row:nth-child(3) .MapContainer:first-child .weatherMap")
        .css("background",
        "url(http://10.155.95.202:8080/data/top/%E7%89%A9%E7%90%86%E9%87%8F/Product/925VaporFlux/" + newestDate + "/EC_HaiNan_925VaporFlux_Max_" + newestDate + newestHour + "00_0.png) no-repeat center");
    $(".weathermapInfo .weatherMap_row:nth-child(3) .MapContainer:nth-child(2) .weatherMap")
        .css("background",
        "url(http://10.155.95.202:8080/data/top/%E7%89%A9%E7%90%86%E9%87%8F/Product/T700_T500/" + newestDate + "/EC_HaiNan_T700_T500_Max_" + newestDate + newestHour + "00_0.png) no-repeat center");
    $(".weathermapInfo .weatherMap_row:nth-child(3) .MapContainer:nth-child(3) .weatherMap")
        .css("background",
        "url(http://10.155.95.202:8080/data/top/%E7%89%A9%E7%90%86%E9%87%8F/Product/T850_T500/" + newestDate + "/EC_HaiNan_T850_T500_Max_" + newestDate + newestHour + "00_0.png) no-repeat center");

    $(".weatherMap").css("background-size", "370px 150px");
}

//点击更新按钮 更新数据
function getPicShow() {
    var hasDate = $(".hasDatepicker").val();
    var hour = $("#datetimePicker_div select").val();
    var date = hasDate.substring(0, 4) + hasDate.substring(5, 7) + hasDate.substring(8, 10);

    var hourStr = $("#datetimePicker_div select").val() + "时";
    var dateStr = hasDate.substring(0, 4) + "年" + hasDate.substring(5, 7) + "月" + hasDate.substring(8, 10) + "日";
    $(".weatherMap span").html(dateStr + hourStr);

    hasDate = hasDate.substring(0, 4) + hasDate.substring(5, 7) + hasDate.substring(8, 10);

    $(".weathermapInfo .weatherMap_row:first-child .MapContainer:first-child .weatherMap")
        .css("background",
        "url(http://10.155.95.202:8080/data/top/%E7%89%A9%E7%90%86%E9%87%8F/Product/KIndex/" + hasDate + "/EC_HaiNan_KIndex_Max_" + hasDate + hour + "00_0.png) no-repeat center");
    $(".weathermapInfo .weatherMap_row:first-child .MapContainer:nth-child(2) .weatherMap")
        .css("background",
        "url(http://10.155.95.202:8080/data/top/%E7%89%A9%E7%90%86%E9%87%8F/Product/CAPE/" + hasDate + "/EC_CH_CAPE_Max_" + hasDate + hour + "00_0.png) no-repeat center");
    $(".weathermapInfo .weatherMap_row:first-child .MapContainer:nth-child(3) .weatherMap")
        .css("background",
        "url(http://10.155.95.202:8080/data/top/%E7%89%A9%E7%90%86%E9%87%8F/Product/PW/" + hasDate + "/EC_CH_PW_Max_" + hasDate + hour + "00_0.png) no-repeat center");
    $(".weathermapInfo .weatherMap_row:nth-child(2) .MapContainer:first-child .weatherMap")
        .css("background",
        "url(http://10.155.95.202:8080/data/top/%E7%89%A9%E7%90%86%E9%87%8F/Product/RSH/" + hasDate + "/EC_CH_RSH_Max_" + hasDate + hour + "00_0.png) no-repeat center");
    $(".weathermapInfo .weatherMap_row:nth-child(2) .MapContainer:nth-child(2) .weatherMap")
        .css("background",
        "url(http://10.155.95.202:8080/data/top/%E7%89%A9%E7%90%86%E9%87%8F/Product/5001000WINDSHEAR/" + hasDate + "/EC_HaiNan_5001000WINDSHEAR_Max_" + hasDate + hour + "00_0.png) no-repeat center");
    $(".weathermapInfo .weatherMap_row:nth-child(2) .MapContainer:nth-child(3) .weatherMap")
        .css("background",
        "url(http://10.155.95.202:8080/data/top/%E7%89%A9%E7%90%86%E9%87%8F/Product/850VaporFlux/" + hasDate + "/EC_HaiNan_850VaporFlux_Max_" + hasDate + hour + "00_0.png) no-repeat center");
    $(".weathermapInfo .weatherMap_row:nth-child(3) .MapContainer:first-child .weatherMap")
        .css("background",
        "url(http://10.155.95.202:8080/data/top/%E7%89%A9%E7%90%86%E9%87%8F/Product/925VaporFlux/" + hasDate + "/EC_HaiNan_925VaporFlux_Max_" + hasDate + hour + "00_0.png) no-repeat center");
    $(".weathermapInfo .weatherMap_row:nth-child(3) .MapContainer:nth-child(2) .weatherMap")
        .css("background",
        "url(http://10.155.95.202:8080/data/top/%E7%89%A9%E7%90%86%E9%87%8F/Product/T700_T500/" + hasDate + "/EC_HaiNan_T700_T500_Max_" + hasDate + hour + "00_0.png) no-repeat center");
    $(".weathermapInfo .weatherMap_row:nth-child(3) .MapContainer:nth-child(3) .weatherMap")
        .css("background",
        "url(http://10.155.95.202:8080/data/top/%E7%89%A9%E7%90%86%E9%87%8F/Product/T850_T500/" + hasDate + "/EC_HaiNan_T850_T500_Max_" + hasDate + hour + "00_0.png) no-repeat center");

    $(".weatherMap").css("background-size", "370px 150px");
}

//点击缩略图跳转至EC物理量页面
function targetDetails(val) {
    window.location.href = "physicalEC.aspx";
}



