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
var messType = "typhoon";//三种类型：台风 - typhoon 、强对流 - convection 、 冷空气 - coldair
var typeValue = "08"//预报时间：08和20
var messPeriod = "1";//报文期数
var weathertime;
$(function () {
    //加载最新时间到时间控件
    date = new Date();
    //设置时间控件为当前最新时间
    $("#date").val(date.format("yyyy-MM-dd"));
    //初始化专报预报时间
    //selectData("08");
    $("#top ul li button").removeClass("active");
    $("#button08").addClass("active");
    time = $("#date").val() + " " + typeValue + ":00:00";
    weathertime = time;
    //默认选中台风类型
    selectType("typhoon");   

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

    //发布决策报文
    $(".releaseReport").click(function () {
        layer.confirm('确认发布？', {
            btnAlign: 'c',
            btn: ['确定', '取消'] //按钮
        }, function () {
            loadpage();
            $.post("/WebService.asmx/insertDecisionSaveDate", {
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
    })

    $("#file").change(function () {
        var objUrl = getObjectURL(this.files[0]);
        var obj = $(this).val();
        var objlen;
        var str;
        var len;
        var picDes;
        var flag;
        var imgPath;
        //获取文件名
        var objlen = obj.split("\\").length - 1;
        obj = obj.split("\\")[objlen];
        if (objUrl) {
            str = "<span style='position:relative;margin-left:36px;display:inline-block;width:44%;'><span class='del' title='删除' onclick='del_pic1(this)' style='position:absolute;right:0;z-index:10000;width:15px;height:15px;background:#2eb1e8 url(../../Images/upload/UploadAction/delete_white.png) no-repeat scroll 0 0;'></span>";
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
            uploadNewImage(this)
            
        }
    });
    $("#file2").change(function () {
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
            str = "<span style='position:relative;margin-left:46px;display:inline-block;width:44%;'><span class='del' title='删除' onclick='del_pic2(this)' style='position:absolute;right:0;z-index:10000;width:15px;height:15px;background:#2eb1e8 url(../../Images/upload/UploadAction/delete_white.png) no-repeat scroll 0 0;'></span>";
            str += "<img src='" + objUrl + "' title='" + obj + "' onclick='showDetail(this)' style='width:100%'/>";
            str += "<div style='margin-top:20px;'>添加图片描述：<input type='text' style='display:inline-block;width: 70%; height: 25px; border: 1px solid #aaa;font-size:12px;'/></div></span>";
            if ($("#previewImg2 span")) {
                if ($("#previewImg2 span").length > 2) {
                    //alert("对不起，最多只能添加两张图片");
                    layer.msg("最多只能添加两张图片！！！");
                } else {
                    $("#previewImg2").append(str);
                    
                }
            } else {
                $("#previewImg2").html(str);
            }
            //将上传的图片存放到指定文件夹，方便后台报文生产程序使用
            uploadNewImage(this)
        }
    });  
});
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
                layer.msg("返回结果："+resultVal)
            });
        }
    }
}

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

function init() {
    //取决策报文数据，并填充到页面
    $.post("/WebService.asmx/getDecisionTideHigh", {
        dateTime: time
    }, function (msg) {
        if (msg != "" && msg != undefined) {
            msg = JSON.parse(msg);
            //报文期数
            messPeriod = msg.Numid;
            $("#remark").val(msg.Abstractcontent);
            $("#subhead").val(msg.Subhead);
            $(".typhoon_topic1").val(msg.Typhoontitle1);
            $("#typhoonVal1").val(msg.Typhooncontent1);
            $(".typhoon_topic2").val(msg.Typhoontitle2);
            $("#typhoonVal2").val(msg.Typhooncontent2);
            $("#previewImg").html("<span style='position:relative;margin-left:30px;display:inline-block;width:46%;'><span class='del' title='删除' onclick='del_pic1(this)' style='position:absolute;right:0;z-index:10000;width:15px;height:15px;background:#2eb1e8 url(../../Images/upload/UploadAction/delete_white.png) no-repeat scroll 0 0;'></span><img src='../Images/upload/UploadAction/" + msg.Pictyphoontrack + "' onclick='showDetail(this)' style='width:100%;'/><div style='margin-top:20px;'>添加图片描述：<input type='text' value='" + msg.Pictyphoonexplain + "' style='display:inline-block;width: 70%; height: 25px; border: 1px solid #aaa;font-size:12px;' /></div></span>");
            $(".weatherlive_topic1").val(msg.Weathertitle1);
            $("#weatherliveVal1").val(msg.Weathercontent1);
            $(".weatherlive_topic2").val(msg.Weathertitle2);
            $("#weatherliveVal2").val(msg.Weathercontent2);
            $("#previewImg2").html("<span style='position:relative;margin-left:30px;display:inline-block;width:46%;'><span class='del' title='删除' onclick='del_pic1(this)' style='position:absolute;right:0;z-index:10000;width:15px;height:15px;background:#2eb1e8 url(../../Images/upload/UploadAction/delete_white.png) no-repeat scroll 0 0;'></span><img src='../Images/upload/UploadAction/" + msg.Weaherpic1 +"' onclick='showDetail(this)' style='width:100%'/><div style='margin-top:20px;'>添加图片描述：<input type='text' value='" + msg.Weatherpicexplain1 + "' style='display:inline-block;width: 70%; height: 25px; border: 1px solid #aaa;font-size:12px;'/></div></span><span style='position:relative;margin-left:30px;display:inline-block;width:46%;'><span class='del' title='删除' onclick='del_pic1(this)' style='position:absolute;right:0;z-index:10000;width:15px;height:15px;background:#2eb1e8 url(../../Images/upload/UploadAction/delete_white.png) no-repeat scroll 0 0;'></span><img src='../Images/upload/UploadAction/" + msg.Weaherpic2 + "' onclick='showDetail(this)' style='width:100%'/><div style='margin-top:20px;'>添加图片描述：<input type='text' value='" + msg.Weatherpicexplain2 + "' style='display:inline-block;width: 70%; height: 25px; border: 1px solid #aaa;font-size:12px;'/></div></span>");
            $("#weatherForecastVal").val(msg.Weatherforcast);
            $("#seapartVal").val(msg.Oceanforecast);
            $("#landpartVal").val(msg.Landforecast);
            $("#defense_proposal").val(msg.Defenceadvice);
        } else {
            layer.msg("决策报文数据缺省！");
        }
    });   
    
    $(".navContent").eq(0).css("display", "none");
    $(".subNav").eq(0).removeClass("currentDt");
    $(".subNav").eq(1).addClass("currentDt");
    $(".navContent").eq(1).css("display", "block");
    $("#decision_Forecast").addClass("hover");
}
//决策专报的报文类型选择
selectType = function (value) {
    $("#preview ul li button").removeClass("active");
    //台风
    if (value == "typhoon") {
        $("#typhooninfo").addClass("active");
        $("#convectioninfo").removeClass("active");
        $("#coldairinfo").removeClass("active");
        messType = "typhoon";
    }
    //强对流
    if (value == "convection") {
        $("#convectioninfo").addClass("active");
        $("#typhooninfo").removeClass("active");
        $("#coldairinfo").removeClass("active");
        messType = "convection";
    }
    //冷空气
    if (value == "coldair") {
        $("#coldairinfo").addClass("active");
        $("#convectioninfo").removeClass("active");
        $("#typhooninfo").removeClass("active");
        messType = "coldair";
    }
    //初始化加载页面数据
    init();
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
dateHandle = function () {
    var Time = $("#date").val();
    $("#date").val(Time.split(' ')[0]);
    selectData("08");
}
function del_pic1(pic) {       
    var flag=window.confirm("确认删除吗？");
    if (flag) {
        $(pic).parent().remove();
    }
}

function del_pic2(pic) {  
    var flag = window.confirm("确认删除吗？");
    if (flag) {
        $(pic).parent().remove();
    }
}


//点击添加的预览图显示细节图
function showDetail(pic) {
    var str;
    var val = pic.src;

    str += "<span class='file_del' id='close_pic' title='关闭' onclick=close_pic() style='position:absolute;top:0;left:660px;z-index:10000;width:15px;height:15px;background:#2eb1e8 url(../../Images/upload/UploadAction/delete_white.png) no-repeat scroll 0 0;'></span>";
    str += "<img src='" + val + "'  style='width:696px;height:546px;z-index:1000;position:absolute;top:0px;left:-20px;'/>";
    $("#previewShow").html(str);
}


function backTo_edit() {
    $(".previewPage").css("display", "none");
    $(".editPage").css("display", "block");

    //必须删除图片 否则会重复添加
    $(".previewContainer img").remove();
}

function realase() {
    $(".previewPage").css("display", "block");
    $(".editPage").css("display", "none");

    addPreviewInfo();
}

//预览发布信息添加
function addPreviewInfo() {
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
                    //报文期数前的年份
                    var dyear = time.substring(0, 4);
                    var nowdate = new Date();
                    //发布时间，以中文数字表示年月日小时
                    var releasDate = dateconvert(nowdate.format("yyyy-MM-dd hh"));
                    //报文期数
                    var decisionPeriod = messPeriod;
                    //预报员名字
                    var forecaster = $("#cbUser").val();
                    //摘要
                    var remark = $("#remark").val();
                    //二级标题
                    var subhead = $("#subhead").val();
                    //一、台风动态 第一段 标题
                    var typhoon_topic1 = $(".typhoon_topic1").val();
                    //一、台风动态 第一段 内容
                    var typhoonVal1 = $("#typhoonVal1").val();
                    //一、台风动态 第二段 标题
                    var typhoon_topic2 = $(".typhoon_topic2").val();
                    //一、台风动态 第二段 内容
                    var typhoonVal2 = $("#typhoonVal2").val();
                    //二、天气实况 第一段 标题
                    var weatherlive_topic1 = $(".weatherlive_topic1").val();
                    //二、天气实况 第一段 内容
                    var weatherliveVal1 = $("#weatherliveVal1").val();
                    //二、天气实况 第二段 标题
                    var weatherlive_topic2 = $(".weatherlive_topic2").val();
                    //二、天气实况 第二段 内容
                    var weatherliveVal2 = $("#weatherliveVal2").val();
                    //三、天气预报
                    var weatherForecastVal = $("#weatherForecastVal").val();
                    //三、天气预报 - 海洋预报
                    var seapartVal = $("#seapartVal").val();
                    //三、天气预报 - 陆地预报
                    var landpartVal = $("#landpartVal").val();
                    //四、防御建议
                    var defense_proposal = $("#defense_proposal").val();
                    //获取过程雨量产品图片
                    var weatherlivepic = $("#previewImg2 img");
                    //获取过程雨量产品图片说明
                    var weatherPicExplain = $("#previewImg2 input");
                    //获取台风路径图片
                    var typhoonpic = $("#previewImg img");
                    var typhoonpicExplain = $("#previewImg input");
                    //得到台风路径图片名称
                    var typhoonpicture = "";
                    //得到台风路径图片说明
                    var typhoonExplian = "";
                    if (typhoonpic.length > 0) {
                        typhoonpicture = typhoonpic[0].src.substring(typhoonpic[0].src.lastIndexOf("/") + 1);
                    }
                    if (typhoonpicExplain.length > 0) {
                        typhoonExplian = typhoonpicExplain[0].value;
                    }
                    //得到过程雨量图片
                    var rainprocess1 = "";
                    var rainprocess2 = "";
                    //得到过程雨量图片说明
                    var rainprocessExplain1 = "";
                    var rainprocessExplain2 = "";
                    //获取页面的过程雨量图片名称
                    if (weatherlivepic.length === 1) {
                        rainprocess1 = weatherlivepic[0].src.substring(weatherlivepic[0].src.lastIndexOf("/") + 1);
                    } else if (weatherlivepic.length > 1) {
                        rainprocess1 = weatherlivepic[0].src.substring(weatherlivepic[0].src.lastIndexOf("/") + 1);
                        rainprocess2 = weatherlivepic[1].src.substring(weatherlivepic[1].src.lastIndexOf("/") + 1);
                    }
                    //获取页面的过程雨量图片说明
                    if (weatherPicExplain.length === 1) {
                        rainprocessExplain1 = weatherPicExplain[0].value;
                    } else if (weatherPicExplain.length > 1) {
                        rainprocessExplain1 = weatherPicExplain[0].value;
                        rainprocessExplain2 = weatherPicExplain[1].value;
                    }
                    var str;  
                    //添加台风路径图片
                    for (var i = 0; i < typhoonpic.length; i++) {
                        str = "<img src='" + typhoonpic[i].src + "' style='width:580px;margin-bottom:10px;'/>";                       
                        $(".previewContainer .cont1 .typic").append(str);
                        $(".previewContainer .cont1 p").html(typhoonExplian);
                    }
                    //添加过程雨量产品图片
                    for (var i = 0; i < weatherlivepic.length; i++) {                        
                        if (i === 0) {
                            str = "<img src='" + weatherlivepic[i].src + "' style='width:580px;margin:10px auto;'/>";
                            //添加过程雨量图片
                            $(".previewContainer .cont2 .rainpic1").append(str);
                            //添加图片说明
                            $(".previewContainer .cont2 .rainp1").html(rainprocessExplain1);
                        } else {
                            str = "<img src='" + weatherlivepic[i].src + "' style='width:580px;margin:10px auto;'/>";
                            $(".previewContainer .cont2 .rainpic2").append(str);
                            $(".previewContainer .cont2 .rainp2").html(rainprocessExplain2);
                        }
                    }
                    //添加摘要标题和内容到预览界面
                    if ($.trim($("#remark").val()) != "") {
                        $(".remarkTitle").html("摘要：");
                        $(".remarkCont").html(remark);
                    }
                    //添加防御建议标题和内容到预览界面
                    if ($.trim($("#defense_proposal").val()) != "") {
                        $(".cont4 .title").html("四、防御建议");
                        $(".cont4 .cont").html(defense_proposal);
                    }
                    //报文期数
                    $("#MessYear").html(dyear);
                    $("#numid").html(decisionPeriod);
                    //添加二级标题到预览界面
                    $(".subheadVal").html(subhead);
                    //添加预报员名字到预览界面
                    $("#forecaster").html(forecaster);
                    //添加文本一级标题到预览界面
                    $(".cont1 .title").html("一、台风动态");
                    $(".cont2 .title").html("二、天气实况");
                    $(".cont3 .title").html("三、天气预报");
                    //添加台风动态 第一段 标题到预览界面
                    $(".cont1 .cont span").eq(0).html(typhoon_topic1);
                    //添加台风动态 第一段 内容到预览界面
                    $(".cont1 .cont p").eq(0).html(typhoonVal1);
                    //添加台风动态 第二段 标题到预览界面
                    $(".cont1 .cont span").eq(1).html(typhoon_topic2);
                    //添加台风动态 第二段 内容到预览界面
                    $(".cont1 .cont p").eq(1).html(typhoonVal2);
                    //添加天气实况 第一段 标题到预览界面
                    $(".cont2 .cont span").eq(0).html(weatherlive_topic1);
                    //添加天气实况 第一段 内容到预览界面
                    $(".cont2 .cont p").eq(0).html(weatherliveVal1);
                    //添加天气实况 第二段 内容到预览界面
                    $(".cont2 .cont span").eq(1).html(weatherlive_topic2);
                    //添加天气实况 第二段 内容到预览界面
                    $(".cont2 .cont p").eq(1).html(weatherliveVal2);
                    //添加天气预报内容到预览界面
                    $(".cont3 .cont p").eq(0).html(weatherForecastVal);
                    //添加天气预报 海洋预报内容到预览界面
                    $(".cont3 .cont p").eq(1).html("<b>海洋方面：</b>" + seapartVal);
                    //添加天气预报 陆地预报内容到预览界面
                    $(".cont3 .cont p").eq(2).html("<b>陆地方面：</b>" + landpartVal);
                    //添加最新发布时间
                    $(".release_time").html(releasDate);

                    //当前报文信息
                    var decisioninfo = new Array;
                    //预报员名字
                    decisioninfo[0] = $("#cbUser").val();
                    //报文期号
                    decisioninfo[1] = decisionPeriod;
                    //摘要
                    decisioninfo[2] = $("#remark").val();
                    //二级标题
                    decisioninfo[3] = $("#subhead").val();
                    //一、台风动态 第一段 标题
                    decisioninfo[4] = $(".typhoon_topic1").val();
                    //一、台风动态 第一段 内容
                    decisioninfo[5] = $("#typhoonVal1").val();
                    //一、台风动态 第二段 标题
                    decisioninfo[6] = $(".typhoon_topic2").val();
                    //一、台风动态 第二段 内容
                    decisioninfo[7] = $("#typhoonVal2").val();
                    //二、天气实况 第一段 标题
                    decisioninfo[8] = $(".weatherlive_topic1").val();
                    //二、天气实况 第一段 内容
                    decisioninfo[9] = $("#weatherliveVal1").val();
                    //二、天气实况 第二段 标题
                    decisioninfo[10] = $(".weatherlive_topic2").val();
                    //二、天气实况 第二段 内容
                    decisioninfo[11] = $("#weatherliveVal2").val();
                    //三、天气预报
                    decisioninfo[12] = $("#weatherForecastVal").val();
                    //三、天气预报 - 海洋预报
                    decisioninfo[13] = $("#seapartVal").val();
                    //三、天气预报 - 陆地预报
                    decisioninfo[14] = $("#landpartVal").val();
                    //防御建议
                    decisioninfo[15] = $("#defense_proposal").val();
                    //台风路径图片名称
                    decisioninfo[16] = typhoonpicture;
                    //过程雨量图1名称
                    decisioninfo[17] = rainprocess1;
                    //过程雨量图2名称
                    decisioninfo[18] = rainprocess2;
                    //台风路径图片说明
                    decisioninfo[19] = typhoonExplian;
                    //过程雨量图1说明
                    decisioninfo[20] = rainprocessExplain1;
                    //过程雨量图2说明
                    decisioninfo[21] = rainprocessExplain2;
                    //报文发布时间
                    decisioninfo[22] = releasDate;
                    //保存决策报文数据到模型，方便其他函数调用-关键
                    $.post("/WebService.asmx/SaveDecisionDate", {
                        decisionData: JSON.stringify(decisioninfo),                       
                    }, function (resultVal) {
                        //
                    });
                    
                    break;
                } else {
                    if (i === result.length - 1) {
                        layer.msg("请输入正确密码！");
                    }
                    continue;
                }
            }
        });
    }   
}
//load方法
function loadpage() {
    load = layer.msg('加载中', {
        icon: 16
        , shade: 0.01
    });
}
//数字日期格式转换为中文数字日期格式
function dateconvert(dateStr) {

    var dict = {
        "0": "O",
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
        dd = date[2].split(' ')[0];

    var hourdate = dateStr.split(' '),
        hh = hourdate[1];


    var yearStr = dict[yy[0]] + dict[yy[1]] + dict[yy[2]] + dict[yy[3]] + '年',
        monthStr = dict['' + Number(mm)] + '月',
        dayStr = dict[dd] + '日',
        hourStr = dict[hh] + '时';
    var newtime = yearStr + monthStr + dayStr + hourStr;
    return newtime;
}





