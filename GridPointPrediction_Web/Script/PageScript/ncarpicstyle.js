var area = "hainan";
var leftType = "twoTemp";
var URL = "http://10.155.95.202:8080/Data/FOG/ECMWF/";
var areaPic = "wind3"; //图片显示的区域 d04为海口市 wind3为海南省
var hourPic = "0800"; //0800为检验的图片
var range = "2MTemperature"; //天气要素
var typeRH = ""; //湿度类型
var picTest = 1;  //1为大图
var picNum = 0;
var dir = "";//时间
var Type = "NCAR";//产品类型
var NewTime = new Date();
$(function () {
    //var date = new Date();
    //date.addDays(-2);       
    var Request = GetRequest();
    if (Request.flag) {
        $("#NCARImg").css("display", "block");
        $("#HapsImg").css("display", "none");
        var flag = Request.flag;
        leftType = flag.split("_")[0];
        range = flag.split("_")[1];
        loadpage();
        //取存放NCAR产品对应文件夹下的时间标签
        $.post('/WebService.asmx/GetNCARNewTime', {
            ncarType: range
        }, function (data, textStatus, xhr) {
            if (data === null || data === undefined || data === "[]") {
                return;
            }
            NewTime = data.toDate();
            $("#datestart").val(NewTime.format("yyyy-MM-dd"));
            dir = NewTime.format("yyyyMMdd");
            var selecthour = NewTime.format("HH");
            $(".select_hour").find("option[text='" + selecthour + "']").attr("selected", true);
            doload();
            layer.close(load);
        }).error(function (xhr) {
            layer.close(load);
            layer.msg('加载最新时次产品出错，请重试！', {
                icon: 5
            });
        });
    } else {
        layer.msg('加载最新时次产品出错，请重试！', {
            icon: 5
        });
        //$("#datestart").val(NewTime.format("yyyy-MM-dd"));
        //dir = NewTime.format("yyyyMMdd");
        //var selecthour = NewTime.format("HH");
        //$(".select_hour").find("option[text='" + selecthour + "']").attr("selected", true);
        //doload();
    }
});

updatepicture = function (value) {
    $(".txtdate ul li button").removeClass("active");
    if (value == "update") {
        $("#update").addClass("active");
        dir = $("#datestart").val().replace(/-/g, "");
    }
    if (value == "now") {
        //var date = new Date();
        //date.addDays(-1);
        $("#nowdate").addClass("active");
        //获取时间标签，并加载对应目录下的最新产品
        $.post('/WebService.asmx/GetNCARNewTime', {
            ncarType: range
        }, function (data, textStatus, xhr) {
            if (data === null || data === undefined || data === "[]") {
                return;
            }
            NewTime = data.toDate();
            $("#datestart").val(NewTime.format("yyyy-MM-dd"));
            dir = NewTime.format("yyyyMMdd");
            doload();
        }).error(function (xhr) {
            layer.msg('加载最新时次产品出错，请重试！', {
                icon: 5
            });
        });
    }
}
$(function () {
    $(".Area ul li button").click(function () {
        area = this.id;
        $(".Area ul li button").removeClass("active");
        $("#" + area).addClass("active");
        if (area == "haikou") {
            areaPic = "wind4";
            $("#hainan").addClass("active");
            layer.msg('海口市范围暂无产品展示数据！', {
                icon: 5
            });
        }
        else if (area == "hainan") {
            areaPic = "wind3";
            doload();
        }
    })
})
function doload() {
    switch (Type) {
        case "NCAR":
            var contidion = false;
            var url = URL + range + "/" + dir + "/";
            typeRH = "";
            switch (leftType) {
                case "humit":
                    contidion = true;
                    picTest = 1;
                    typeRH = "200hpa_";
                    break;
                case "temptest":
                    contidion = true;
                    picTest = 1;
                    break;
                case "windforecast":
                    contidion = true;
                    picTest = 1;
                    break;
                case "humitTest":
                    contidion = true;
                    picTest = 1;
                    break;
                default:
                    picTest = 0;
            }
            //2MTemperature_wind3_201710120800_
            var fileNmae = range + "_" + areaPic + "_" + dir + hourPic + "_";//fileNmae = "T2_0_d02_2017101020_"

            if (contidion) {
                $(".maxPicture").css("display", "block");
                $(".minPicture").css("display", "none");
                for (var i = 0; i <= 72; i = i + 3) {
                    var urlStr = url + fileNmae + i + ".png"//http://10.155.95.202:8080/Data/FOG/ECMWF/2MTemperature/20171012/2MTemperature_wind3_201710120800_102.png
                    var flag;
                    if (i < 10) { flag = "0" + i; }
                    else { flag = i; }
                    document.getElementById("Pic" + flag).src = urlStr;
                }
                //for (var i = 78; i <= 240; i = i + 6) {
                //    var urlStr = url + fileNmae + i + ".png"
                //    var flag;
                //    if (i < 10) { flag = "0" + i; }
                //    else { flag = i; }
                //    document.getElementById("Pic" + flag).src = urlStr;
                //}
            }
            else {
                $(".maxPicture").css("display", "none");
                $(".minPicture").css("display", "block");
                for (var i = 0; i <= 72; i = i + 3) {
                    var urlStr = url + fileNmae + i + ".png"
                    var flag;
                    if (i < 10) { flag = "0" + i; }
                    else { flag = i; }
                    document.getElementById("Image" + flag).src = urlStr;
                }
                for (var i = 78; i <= 240; i = i + 6) {
                    var urlStr = url + fileNmae + i + ".png"
                    var flag;
                    if (i < 10) { flag = "0" + i; }
                    else { flag = i; }
                    document.getElementById("Image" + flag).src = urlStr;
                }
            }
            break;
        case "Haps":
            var url;
            if (area == "hainan")
                url = "http://10.153.97.33:3232/Data/HapsDraw/IMAGES/GuangDong/";
            else
                url = "http://10.153.97.33:3232/Data/HapsDraw/IMAGES/ShenZhen/";
            var id = new Array("img1", "img2", "img3", "img4", "img5", "img6", "img7", "img8");
            var n = 3;
            for (var i = 0; i < 8; i++) {
                var num = (n < 10) ? "0" + n : n;
                var srcStr = url + dir + "/0800/acc03_" + dir + "08_" + num + "h_2.png";
                $("#" + id[i]).attr("src", srcStr);
                n += 3;
            }
            break;
    }
}
//得到URL中“？”后的字符串
function GetRequest() {
    var url = location.search; //获取url中"?"符后的字串   
    var theRequest = new Object();
    if (url.indexOf("?") != -1) {
        var str = url.substr(1);
        strs = str.split("&");
        for (var i = 0; i < strs.length; i++) {
            theRequest[strs[i].split("=")[0]] = unescape(strs[i].split("=")[1]);
        }
    }
    return theRequest;
}
function GetNCARTime(ncarName) {
    $.post('/WebService.asmx/GetNCARNewTime', {
        ncarType: ncarName
    }, function (data, textStatus, xhr) {
        if (data === null || data === undefined || data === "[]") {
            return;
        }
        NewTime = data.toDate();
    });
}
//进度条
function loadpage() {
    load = layer.msg('加载中', {
        icon: 16
        , shade: 0.01
        , time: 0
    });
}