$(function () {
    init();

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

    //天气状况选择
    $(".xuanfu div label").click(function () {
        var id = $(this).attr("id");
        if (id == "" || id == undefined) {
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

function init() {
    $(".navContent").eq(0).css("display", "none");
    $(".subNav").eq(0).removeClass("currentDt");
    $(".subNav").eq(1).addClass("currentDt");
    $(".navContent").eq(1).css("display", "block");
    $("#typhoon_windRain").addClass("hover");

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

    loadDatas();
}

function loadDatas() {
    var selectHour = $(".selectHour li button.active")[0].innerHTML;
    var date = new Date();
    var nowtime = date.format("yyyy-MM-dd");
    var time = nowtime + " " + selectHour;
    var datanew;
    var TBdatanew;

    $.post("/WebService.asmx/getLiveDatas", {
        dateTime: time
    }, function (msg) {
        if (msg.indexOf("+")>0) {
            //将得到的两个json数据分离，分别转换格式
            datanew = msg.split("+")[0];
            TBdatanew = msg.split("+")[1];
            datanew = JSON.parse(datanew);
            TBdatanew = JSON.parse(TBdatanew);

            var date = datanew.Ddatetime;
            $("#date").val(date.split(" ")[0]);
            $("#cbUser").val(datanew.Forecaster);
            $("#summaryVal").val(datanew.Summary);
            $("#rainVal").val(datanew.Rainval);
            $("#windVal").val(datanew.Windval);
            $("#threeHour_reportVal").val(datanew.Threehour_reportval);
            $("#threeDay_reportVal").val(datanew.Threeday_reportval);
            $("#previewImg").html("<span class='picarea' style='position: relative; margin-left: 30px; display: inline-block; width: 46%;'><span class='del' title='删除' onclick='del_pic(this)' style='position: absolute; right: 0; z-index: 10000; width: 15px; height: 15px; background: #2eb1e8 url(../../Images/upload/UploadAction/delete_white.png) no-repeat scroll 0 0;'></span><img src='../Images/upload/UploadAction/" + datanew.Raindpic + "' onclick='showDetail(this)' style='width: 100%;' /><div style='margin-top: 20px;'>添加图片描述：<input type='text' value='" + datanew.Rainpicdes + "' style='display: inline-block; width: 70%; height: 25px; border: 1px solid #aaa; font-size: 12px;' /></div></span><span class='picarea' style='position: relative; margin-left: 30px; display: inline-block; width: 46%;'><span class='del' title='删除' onclick='del_pic(this)' style='position: absolute; right: 0; z-index: 10000; width: 15px; height: 15px; background: #2eb1e8 url(../../Images/upload/UploadAction/delete_white.png) no-repeat scroll 0 0;'></span><img src='../Images/upload/UploadAction/" + datanew.Windpic + "' onclick='showDetail(this)' style='width: 100%;' /><div style='margin-top: 20px;'>添加图片描述：<input type='text' value='" + datanew.Windpicdes + "' style='display: inline-block; width: 70%; height: 25px; border: 1px solid #aaa; font-size: 12px;' /></div></span>");

            //填充数据到表格中
            $(".reportTime").val(TBdatanew.Reporttime);
            $(".name").val(TBdatanew.Name);
            $(".middlePosition").val(TBdatanew.Middleposition);
            $(".strength").val(TBdatanew.Strength);
            $(".windspeed").val(TBdatanew.Windspeed);
            $(".middlePressure").val(TBdatanew.Middlepressure);
            $(".referPosition").val(TBdatanew.Referposition);
            $(".report").val(TBdatanew.Report);
        } else {
            $("#date").val(nowtime);
            $("#summaryVal").html("&nbsp;&nbsp;今年第4号台风“塔拉斯”（热带风暴级），16日08时中心位于距离海南省三亚市偏南方向70公里的南海海面上，中心附近最大风力9级（23米/秒），即将从南部近海擦过。未来三小时，我市多云有阵雨，乡镇雨量5-10毫米，市区雨量3-5毫米，气温25.5℃-29.0℃，风力4级，阵风5-7级。");
            $("#rainVal").html("&nbsp;&nbsp;7月15日07时-16日07时，我市普降中雨，中部南部乡镇有大到暴雨，雨量前三为云龙镇46.3毫米、红旗镇43.7毫米、大坡镇43毫米。");
            $("#windVal").html("&nbsp;&nbsp;7月15日07时-16日07时我市沿海地区出现8级大风，云龙镇8级17.5米/秒；其次是红旗镇7级16.9米/秒、大坡镇7级16.3米/秒。");
            $("#threeHour_reportVal").html("&nbsp;&nbsp;未来三小时，我市多云有阵雨，乡镇雨量5-10毫米，市区雨量3-5毫米，气温25.5℃-29.0℃，风力4级，阵风5-7级。");
            $("#threeDay_reportVal").html("&nbsp;&nbsp;16日上午，阴天有中到大雨，偏东风6-7级；\n&nbsp;&nbsp;16日下午，阴天有中雨，偏东风5-7级；\n&nbsp;&nbsp;16日夜间，多云有阵雨，东北风4-5级；\n&nbsp;&nbsp;17日，多云有阵雨，东南风4级\n&nbsp;&nbsp;18日，多云有阵雨，偏东风4级。");

            $("#previewImg").html("<span class='picarea' style='position: relative; margin-left: 30px; display: inline-block; width: 46%;'><span class='del' title='删除' onclick='del_pic(this)' style='position: absolute; right: 0; z-index: 10000; width: 15px; height: 15px; background: #2eb1e8 url(../../Images/upload/UploadAction/delete_white.png) no-repeat scroll 0 0;'></span><img src='../Images/upload/UploadAction/rain.jpg' onclick='showDetail(this)' style='width: 100%;' /><div style='margin-top: 20px;'>添加图片描述：<input type='text' value='' style='display: inline-block; width: 70%; height: 25px; border: 1px solid #aaa; font-size: 12px;' /></div></span><span class='picarea' style='position: relative; margin-left: 30px; display: inline-block; width: 46%;'><span class='del' title='删除' onclick='del_pic(this)' style='position: absolute; right: 0; z-index: 10000; width: 15px; height: 15px; background: #2eb1e8 url(../../Images/upload/UploadAction/delete_white.png) no-repeat scroll 0 0;'></span><img src='../Images/upload/UploadAction/wind.jpg' onclick='showDetail(this)' style='width: 100%;' /><div style='margin-top: 20px;'>添加图片描述：<input type='text' value='' style='display: inline-block; width: 70%; height: 25px; border: 1px solid #aaa; font-size: 12px;' /></div></span>");
        }
    })
}

//发布
function releaseReport() {
    var selectHour = $(".selectHour li button.active")[0].innerHTML;
    var ddatetime = $("#date").val() +" "+ selectHour;
    var forecaster = $("#cbUser").val();
    var summaryVal = $("#summaryVal").val();
    var rainVal = $("#rainVal").val();
    var windVal = $("#windVal").val();
    var threeHour_reportVal = $("#threeHour_reportVal").val();
    var threeDay_reportVal = $("#threeDay_reportVal").val();
    var picarea = $("#previewImg .picarea");
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

    //当前报文信息
    var LiveInfo = new Array();
    //时间
    LiveInfo[0] = ddatetime;
    //预报员
    LiveInfo[1] = forecaster;
    //摘要
    LiveInfo[2] = summaryVal;
    //降雨实况
    LiveInfo[3] = rainVal;
    //降雨实况图
    LiveInfo[4] = picArr[0];
    //降雨实况图描述
    LiveInfo[5] = picDesArr[0];
    //风力实况
    LiveInfo[6] = windVal;
    //风力实况图
    LiveInfo[7] = picArr[1];
    //风力实况图描述
    LiveInfo[8] = picDesArr[1];
    //未来三小时预报
    LiveInfo[9] = threeHour_reportVal;
    //未来三天预报
    LiveInfo[10] = threeDay_reportVal;

    var LiveTbInfo = new Array();
    //获取表格数据
    for (var i = 0; i < $(".hot_stormTable tr").length; i++) {
        var td = $($(".hot_stormTable tr")[i]).children("td")[1];
        LiveTbInfo[i]=$(td).children("input")[0].value;
    }
    LiveTbInfo.push(ddatetime);

    //保存实况报文数据到模型，方便其他函数调用-关键
    $.post("/WebService.asmx/SaveLiveForecastData", {
        LiveData: JSON.stringify(LiveInfo),
        LiveTbData: JSON.stringify(LiveTbInfo)
    }, function (resultVal) {
        
    });

    //发布报文
    layer.confirm('确认发布？', {
        btnAlign: 'c',
        btn: ['确定', '取消'] //按钮
    }, function () {
        loadpage();
        $.post("/WebService.asmx/insertLiveSaveDate", {
            realseTime: ddatetime,
            realseUser: $("#cbUser").val()
        }, function (result) {
            layer.close(load);
            result = result.childNodes[0].innerHTML;
            if (result != undefined && result != "") {
                if (result) {
                    layer.msg("发布成功!");
                }
                else {
                    layer.msg("发布失败!");
                }
            }
        });
    }, function () {
    });

}

function del_pic(pic) {
    var flag = window.confirm("确认删除吗？");
    if (flag) {
        $(pic).parent().remove();
    }
}

function addPreviewInfo() {
    var date = $("#date").val().split("-");
    var summary_title = $(".summary div label").text();
    var summary_cont = $("#summaryVal").val();
    var hot_storm_title = $(".hot_storm div label").text();
    var hot_storm_cont = $(".hot_stormTable").val();
    var threeHour_report_title = $(".threeHour_report div label").text();
    var threeHour_report_cont = $("#threeHour_reportVal").val();
    var threeDay_report_title = $(".threeDay_report div label").text();
    var threeDay_report_cont = $("#threeDay_reportVal").val();
    var rainVal = $("#rainVal").val();
    var windVal = $("#windVal").val();
    var pics = $("#previewImg .picarea");
    var picUrl = $("#previewImg .picarea img");
    var picDes = $("#previewImg .picarea input");
    var tablelistArr = new Array();
    var tablelistArr2 = new Array();
    var str = "";
    var picarr = new Array();
    
    //获取表格数据
    for (var i = 0; i < $(".hot_stormTable tr").length; i++) {
        var td = $($(".hot_stormTable tr")[i]).children("td")[1];
        tablelistArr.push( $(td).children("input")[0].value );
    }
    for (var i = 0; i < $(".hot_stormTable tr").length; i++) {
        var td = $($(".hot_stormTable tr")[i]).children("td")[0];
        tablelistArr2.push(td.innerHTML);
    }

    for (var i = 0; i < pics.length; i++) {
        picarr.push('<img src="' + picUrl[i].src + '" style="width: 420px;margin:30px 0px 10px 0px;" /><div style="margin:0px 0px 50px 0px;">' + picDes.val() + '</div>');
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
                    $("p.summary_cont").html("【" + summary_title + "】" + summary_cont);

                    //添加表格数据
                    for (var i = 0; i < tablelistArr2.length; i++) {
                        for (var j = 0; j < tablelistArr.length; j++) {
                            if (i == j) {
                                str += "<tr><td>" + tablelistArr2[i] + "</td><td>" + tablelistArr[j] + "</td></tr>";
                            }
                        }
                    }
                    $(".hot_stormInfo").html(str);


                    $(".cont1 .title").html("一、" + hot_storm_title);
                    $(".cont2 .title").html("二、风雨实况");
                    $(".cont3 .title").html("三、" + threeHour_report_title);
                    $(".cont4 .title").html("四、" + threeDay_report_title);


                    $(".cont2 p").eq(0).html("【降雨实况】" + rainVal);
                    $(".cont2 p").eq(1).html("【风力实况】" + windVal);

                    $(".pic1").html(picarr[0]);
                    $(".pic2").html(picarr[1]);

                    $(".cont3 p").html(threeHour_report_cont);
                    $(".cont4 p").html(threeDay_report_cont);
                    $(".release_time").html(date[0] + "年" + date[1] + "月" + date[2] + "日发布");

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

function backTo_edit() {
    $(".previewPage").css("display", "none");
    $(".editPage").css("display", "block");
}


function realase() {
    
    addPreviewInfo();
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