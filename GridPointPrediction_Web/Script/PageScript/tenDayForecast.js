$(function () {
    init();
    getReportDatas();
})

//发布
function releaseReport() {
    var selectHour = $(".selectHour li button.active")[0].innerHTML;
    var ddatetime = $("#date").val() + " " + selectHour;
    var forecaster = $("#cbUser").val();
    var middleMonth_detail=$("#middleMonth_detail").val();
    var endMonth_detail = $("#endMonth_detail").val();
    var month_title1 = $(".title1").val();
    var month_title2 = $(".title2").val();
    var strData;

    strData = ddatetime + "#" + forecaster + "#" + middleMonth_detail + "#" + endMonth_detail + "#" + month_title1 + "#" + month_title2;

    //发布报文
    layer.confirm('确认发布？', {
        btnAlign: 'c',
        btn: ['确定', '取消'] //按钮
    }, function () {
        loadpage();
        $.post("/WebService.asmx/periodMonthForecastDatas", {
            strData: strData
        }, function (res) {
            layer.close(load);
            data = res.childNodes[0].innerHTML;    //此处res值为xml

            if (data.indexOf("true") > -1) {
                layer.msg("发布成功!");
            } else {
                layer.msg("发布失败!");
            }
        });
    }, function () {
    });
}

function init() {
    $(".navContent").eq(0).css("display", "none");
    $(".subNav").eq(0).removeClass("currentDt");
    $(".subNav").eq(1).addClass("currentDt");
    $(".navContent").eq(1).css("display", "block");
    $("#tenday_Forecast").addClass("hover");

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

}


function changeForecast(month) {
    $("." + month).css("display", "block").siblings().css("display", "none");
    $("button").removeClass("active");
    $("button[name=" + month + "]").addClass("active");
    $("#button08").addClass("active");
}

//中旬专报预览页面信息
function addPreviewInfo_middle() {
    var middleMonth_detail = $("#middleMonth_detail").val().split("。");
    var date = $("#date").val().split("-");

    //获取预报员名字
    var user = $("#cbUser").val();
    //获取登录密码
    var upassword = $("#passwad").val();
    //判断密码框是否为空
    if ($("#passwad").val() == "") {
        layer.msg("请输入预报员密码！");
    } else {
        $.post("/WebService.asmx/GetUserInfoname", {}, function (result) {
            //得到查询返回结果
            result = JSON.parse(result);
            for (var i = 0; i < result.length; i++) {
                //判断输入的预报员名字和密码
                if (result[i].UserName == user && result[i].UPassword == $("#passwad").val()) {
                    $(".middle_preview .cont1 p").eq(0).html(middleMonth_detail[0] + "。");
                    $(".middle_preview .cont1 p").eq(1).html(middleMonth_detail[1] + "。");
                    $(".middle_preview .cont1 p").eq(2).html(middleMonth_detail[2] + "。");
                    $(".middle_preview .cont1 p").eq(3).html(middleMonth_detail[3] + "。");
                    $(".middle_preview h3").html($(".middleMonth_detail label input").val());
                    $(".middle_preview .release_time").html(date[0] + "年" + date[1] + "月" + date[2] + "日");

                    $(".middle_preview").css("display", "block");
                    $(".end_preview").css("display", "none");
                    $(".previewPage").css("display", "block");
                    $(".editPage").css("display", "none");
                    break;
                } else {
                    if (i === result.length - 1) {
                        layer.msg("请输入正确密码！");
                    }
                    continue;
                }
            }
        })
    }
}

//下旬专报预览页面信息
function addPreviewInfo_end() {
    var endMonth_detail = $("#endMonth_detail").val().split("。");
    var date = $("#date").val().split("-");

    //获取预报员名字
    var user = $("#cbUser").val();
    //获取登录密码
    var upassword = $("#passwad").val();
    //判断密码框是否为空
    if ($("#passwad").val() == "") {
        layer.msg("请输入预报员密码！");
    } else {
        $.post("/WebService.asmx/GetUserInfoname", {}, function (result) {
            //得到查询返回结果
            result = JSON.parse(result);
            for (var i = 0; i < result.length; i++) {
                //判断输入的预报员名字和密码
                if (result[i].UserName == user && result[i].UPassword == $("#passwad").val()) {
                    $(".end_preview .cont1 p").eq(0).html(endMonth_detail[0] + "。" + endMonth_detail[1] + "。");
                    $(".end_preview .cont1 p").eq(1).html(endMonth_detail[2] + "。");
                    $(".end_preview .cont1 p").eq(2).html(endMonth_detail[3] + "。");
                    $(".end_preview .cont1 p").eq(3).html(endMonth_detail[4] + "。");
                    $(".end_preview h3").html($(".endMonth_detail label input").val());
                    $(".end_preview .release_time").html(date[0] + "年" + date[1] + "月" + date[2] + "日");

                    $(".end_preview").css("display", "block");
                    $(".middle_preview").css("display", "none");
                    $(".previewPage").css("display", "block");
                    $(".editPage").css("display", "none");
                    break;
                } else {
                    if (i === result.length - 1) {
                        layer.msg("请输入正确密码！");
                    }
                    continue;
                }
            }
        })
    } 
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
}
dateHandle = function () {
    var Time = $("#date").val();
    $("#date").val(Time.split(' ')[0]);
    selectData("08");
}

function backTo_edit() {
    $(".previewPage").css("display", "none");
    $(".editPage").css("display", "block");
}

function realase() {
    var list = $("#ForecastZone ul li");
    var val = list.children("button.active").text();

    if (val == "中旬") {
        addPreviewInfo_middle();
    } else if (val == "下旬") {
        addPreviewInfo_end();
    }
}

//load方法
function loadpage() {
    load = layer.msg('加载中', {
        icon: 16
        , shade: 0.01
    });
}