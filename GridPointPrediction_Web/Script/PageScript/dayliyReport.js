$(function(){
    init();
    getReportDatas();

    $("#file").change(function () {
        var objUrl = getObjectURL(this.files[0]);
        var obj = $(this).val();
        var objlen;
        var str;
        var len;
        var picDes;
        var flag;

        //获取文件名
        var objlen = obj.split("\\").length - 1;
        obj = obj.split("\\")[objlen];

        if (objUrl) {
            str = "<span class='picarea' style='position:relative;margin-left:30px;display:inline-block;width:46%;'><span class='del' title='删除' onclick='del_pic(this)' style='position:absolute;right:0;z-index:10000;width:15px;height:15px;background:#2eb1e8 url(../../Images/upload/UploadAction/delete_white.png) no-repeat scroll 0 0;'></span>";
            str += "<img src='" + objUrl + "' title='" + obj + "' onclick='showDetail(this)' style='width:100%;'/>";
            str += "<div style='margin-top:20px;'>添加图片描述：<input type='text' style='display:inline-block;width: 70%; height: 25px; border: 1px solid #aaa;font-size:12px;'/></div></span>";
            if ($("#previewImg span")) {
                if ($("#previewImg span").length > 2) {

                } else {
                    $("#previewImg").append(str);

                }
            } else {
                $("#previewImg").html(str);

            }
            //将上传的图片存放到指定文件夹，方便后台报文生产程序使用
            uploadNewImage(this);
        }
    });
    //建立一個可存取到該file的url
    function getObjectURL(file) {
        var url = null;
        if (window.createObjectURL != undefined) { // basic
            url = window.createObjectURL(file);
        }
        else if (window.URL != undefined) {
            // mozilla(firefox)
            url = window.URL.createObjectURL(file);
        }
        else if (window.webkitURL != undefined) {
            // webkit or chrome
            url = window.webkitURL.createObjectURL(file);
        }
        return url;
    }
})

//将上传的图片保存到指定文件夹下
function uploadNewImage(img) {
    var files = img.files;
    var obj = $(img).val();
    //获取文件名
    var objlen = obj.split("\\").length - 1;
    obj = obj.split("\\")[objlen];
    if (files.length == 0) {
        //alert('请选择文件');
        layer.msg("请选择文件！");
        return;
    } else {
        var reader = new FileReader();//新建一个FileReader
        reader.readAsDataURL(files[0]);//读取文件
        reader.onload = function (evt) { //读取完文件之后会回来这里
            var fileString = evt.target.result;

            $.post("/WebService.asmx/SavePicToFile", {
                imgUrl: fileString,
                picName: obj
            }, function (resultVal) {
                //
                layer.msg("返回结果：" + resultVal)
            });
        }
    }
}

//发布
function releaseReport() {
    var selectHour = $(".selectHour li button.active")[0].innerHTML;
    var ddatetime = $("#date").val() + " " + selectHour;
    var forecaster = $("#cbUser").val();
    var airpollute_reportVal = $("#airpollute_reportVal").val();
    var shorttime_reportVal = $("#shorttime_reportVal").val();
    var picarea = $("#previewImg .picarea");
    var count = 1;
    var pic;
    var picDes;
    var picDesArr = new Array();
    var picArr = new Array();
    var strData;
    var picUrl;

    for (var i = 0; i < picarea.length; i++) {
        pic = $(picarea[i]).children("img")[0];
        picUrl = pic.src.substring(pic.src.lastIndexOf("/") + 1, pic.src.length);
        picArr.push(picUrl);
    }
    for (var i = 0; i < picarea.length; i++) {
        picDes = $(picarea[i]).children("div")[0];
        picDesArr.push($(picDes).children("input").val());
    }
    
    strData = ddatetime + "#" + forecaster + "#" + airpollute_reportVal + "#" + shorttime_reportVal + "#" + picDesArr + "#" + picArr +"#"+ count;


    //发布报文
    layer.confirm('确认发布？', {
        btnAlign: 'c',
        btn: ['确定', '取消'] //按钮
    }, function () {
        loadpage();
        $.post("/WebService.asmx/DailyForecastDatas", {
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
    $("#dayliy_Forecast").addClass("hover");

    $("#top ul li button").removeClass("active");
    $("#button08").addClass("active");

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

function del_pic(pic) {
    var flag = window.confirm("确认删除吗？");
    if (flag) {
        $(pic).parent().remove();
    }
}



function changeForecast(month) {
    $("." + month).css("display", "block").siblings().css("display", "none");
    $("button").removeClass("active");
    $("button[name=" + month + "]").addClass("active");
    $("#top ul li button").removeClass("active");
    $("#button08").addClass("active");
}

//空气污染专报预览页面信息
function addPreviewInfo_airpollute() {
    var val = $("#airpollute_reportVal").val();
    var date = $("#date").val().split("-");
    var pics = $("#previewImg .picarea");
    var picUrl = $("#previewImg .picarea img");
    var picDes = $("#previewImg .picarea input");
    var messYear = date[0];
    var str = "";
    var numid = "1";

    for (var i = 0; i < pics.length; i++) {
        str += '<img src="' + picUrl[i].src + '" style="width: 420px;margin:30px 0px 10px 0px;" /><div style="margin:0px 0px 50px 0px;">' + picDes.val() + '</div>';
    }

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
                    $("#messYear").html(messYear);
                    $("#numid").html(numid);
                    $(".airpollute_preview .cont1 p").html(val);
                    $(".airpollute_preview .cont1 div").html(str);
                    $(".airpollute_preview .copyright span").eq(1).html(date[0] + "年" + date[1] + "月" + date[2] + "日发布");

                    $(".airpollute_preview").css("display", "block");
                    $(".shorttime_preview").css("display", "none");
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

//短时预报预览页面信息
function addPreviewInfo_shorttime() {
    var val = $("#shorttime_reportVal").val();
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
                    $(".shorttime_preview .cont1 p").html("<pre>" + val + "</pre>");
                    $(".shorttime_preview .copyright span").eq(1).html(date[0] + "年" + date[1] + "月" + date[2] + "日发布");
                
                    $(".shorttime_preview").css("display", "block");
                    $(".airpollute_preview").css("display", "none");
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

    if (val == "空气污染预报") {
  
        addPreviewInfo_airpollute();
    } else if (val == "短时预报") {
       
        addPreviewInfo_shorttime();
    }
}

//load方法
function loadpage() {
    load = layer.msg('加载中', {
        icon: 16
        , shade: 0.01
    });
}