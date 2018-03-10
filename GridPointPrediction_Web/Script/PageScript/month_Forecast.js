$(function () {
    init();
    getReportDatas();
})



function init() {
    $(".navContent").eq(0).css("display", "none");
    $(".subNav").eq(0).removeClass("currentDt");
    $(".subNav").eq(1).addClass("currentDt");
    $(".navContent").eq(1).css("display", "block");
    $("#month_Forecast").addClass("hover");


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

//发布
function releaseReport() {
    var selectHour = $(".selectHour li button.active")[0].innerHTML;
    var ddatetime = $("#date").val() + " " + selectHour;
    var forecaster = $("#cbUser").val();
    var month_detail1 = $("#month_detail1").val();
    var month_detail2 = $("#month_detail2").val();
    var month_detail3 = $("#month_detail3").val();
    var month_title1 = $(".title1").val();
    var month_title2 = $(".title2").val();
    var month_title3 = $(".title3").val();
    var strData;

    strData = ddatetime + "#" + forecaster + "#" + month_detail1 + "#" + month_detail2 + "#" + month_detail3 + "#" + month_title1+"#" + month_title2+"#" + month_title3;

    //发布报文
    layer.confirm('确认发布？', {
        btnAlign: 'c',
        btn: ['确定', '取消'] //按钮
    }, function () {
        loadpage();
        $.post("/WebService.asmx/MonthForecastDatas", {
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

//月报预览页面信息
function addPreviewInfo_month() {
    var month_detail1_title1 = $(".month_detail1 label input").val();
    var month_detail1_cont1 = $("#month_detail1").val();
    var month_detail1_title2 = $(".month_detail2 label input").val();
    var month_detail1_cont2 = $("#month_detail2").val();
    var month_detail1_title3 = $(".month_detail3 label input").val();
    var month_detail1_cont3 = $("#month_detail3").val();
    var date = $("#date").val().split("-");
    var month_detail1_cont2 = month_detail1_cont2.split("。");
    var month_detail1_cont3 = month_detail1_cont3.split("。");

    //获取预报员名字
    var user = $("#cbUser").val();
    //获取登录密码
    var upassword = $("#passwad").val();
    //判断密码框是否为空
    if ($("#passwad").val() == "") {
        layer.msg("请输入预报员密码！");
    } else {
        $.post("/WebService.asmx/GetUserInfoname", {}, function (result){
            //得到查询返回结果
            result = JSON.parse(result);
            for (var i = 0; i < result.length; i++) {
                //判断输入的预报员名字和密码
                if (result[i].UserName == user && result[i].UPassword == $("#passwad").val()) {
                    $(".cont1 .title").html("一、" + month_detail1_title1);
                    $(".cont2 .title").html("二、" + month_detail1_title2);
                    $(".cont3 .title").html("三、" + month_detail1_title3);

                    $(".cont1 p").html(month_detail1_cont1);


                    $(".cont2 p").eq(0).html(month_detail1_cont2[0] + "。" + month_detail1_cont2[1] + "。" + month_detail1_cont2[2] + "。");
                    month_detail1_cont2 = month_detail1_cont2[3].split("月");
                    $(".cont2 p").eq(1).html("月" + month_detail1_cont2[1]);
                    $(".cont2 p").eq(2).html("月" + month_detail1_cont2[2]);
                    $(".cont2 p").eq(3).html("月" + month_detail1_cont2[3]);


                    $(".cont3 p").eq(0).html(month_detail1_cont3[0] + "。" + month_detail1_cont3[1] + "。");
                    month_detail1_cont3 = month_detail1_cont3[2].split("旬");
                    $(".cont3 p").eq(1).html("旬" + month_detail1_cont3[1]);
                    $(".cont3 p").eq(2).html("旬" + month_detail1_cont3[2]);
                    $(".cont3 p").eq(3).html("旬" + month_detail1_cont3[3]);

                    $(".release_time").html(date[0] + "年" + date[1] + "月" + date[2] + "日");

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
    addPreviewInfo_month();
}

//load方法
function loadpage() {
    load = layer.msg('加载中', {
        icon: 16
        , shade: 0.01
    });
}