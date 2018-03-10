$(function () {
    init();

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
            str = "<span style='position:relative;margin-left:30px;display:inline-block;width:46%;'><span class='del' title='删除' onclick='del_pic(this)' style='position:absolute;right:0;z-index:10000;width:15px;height:15px;background:#2eb1e8 url(../../Images/upload/UploadAction/delete_white.png) no-repeat scroll 0 0;'></span>";
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


function del_pic(pic) {

    var flag = window.confirm("确认删除吗？");
    if (flag) {
        $(pic).parent().remove();
    }
}


//点击添加的预览图显示细节图
function showDetail(pic) {
    var str;
    var val = pic.src;

    str += "<span class='file_del' id='close_pic' title='关闭' onclick=close_pic() style='position:absolute;top:0;right:505px;z-index:10000;width:15px;height:15px;background:#2eb1e8 url(../../Images/upload/UploadAction/delete_white.png) no-repeat scroll 0 0;'></span>";
    str += "<img src='" + val + "'  style='width:696px;height:546px;z-index:1000;position:absolute;top:0px;left:-20px;'/>";
    $("#previewShow").html(str);
}


function init() {
    $(".navContent").eq(0).css("display", "none");
    $(".subNav").eq(0).removeClass("currentDt");
    $(".subNav").eq(1).addClass("currentDt");
    $(".navContent").eq(1).css("display", "block");
    $("#holidays_Forecast").addClass("hover");

    var date = new Date();
    var nowtime = date.format("yyyy-MM-dd");
    $("#date").val(nowtime);
    selectHour = "08";

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

//获取数据 国庆专报
function loadDatas() {
    var date = new Date();
    var nowtime = date.format("yyyy-MM-dd") + " " + selectHour + ":00:00";
    var datanew;
    var TBdatanew;
    var str = "";

    $.post("/WebService.asmx/getNationalDatas", {
        dateTime: nowtime
    }, function (msg) {
        if (msg.indexOf("+") > 0) {
            //将得到的两个json数据分离，分别转换格式
            datanew = msg.split("+")[0];
            TBdatanew = msg.split("+")[1];
            datanew = JSON.parse(datanew);
            TBdatanew = JSON.parse(TBdatanew);

            $("#cbUser").val(datanew.Forecaster);
            $("#summary").val(datanew.Summary);
            $("#national_weather_trend").val(datanew.Weather_trend);
            $("#national_weather_details").val(datanew.Weather_details);
            $("#top ul li button").removeClass("active");
            $("#button" + selectHour + "").addClass("active");

            for (var i = 0; i < TBdatanew.Forecasttime.length;i++){
                str += "<tr><td><input type='text' value='" + TBdatanew.Forecasttime[i] + "' onblur='input_blur(this)' onfocus='input_focus(this)' /></td><td class='weather'><div style='width:100%;height:100%;'><label><img id='guoqinoneday"+(i+1)+"-img1' class='Imghover' src='../Images/tq/" + TBdatanew.Weatherpic[i] + "' onclick='choose_img(this)' /></label><input type='text' value='" + TBdatanew.Weatherdes[i] + "' onblur='input_blur(this)' onfocus='input_focus(this)' style='height:25%;'/></div></td><td><input type='text' value='" + TBdatanew.Temperature[i] + "' onblur='input_blur(this)' onfocus='input_focus(this)' /></td><td><input type='text' value='" + TBdatanew.Wind[i] + "' onblur='input_blur(this)' onfocus='input_focus(this)' /></td></tr>";
            }
            $("#national_table tbody").html(str);

        } else {
            $("#summary").html("&nbsp;&nbsp;国庆节假日期间，我市气温适宜，总体天气较好，有利于出行和进行各种户外活动。");
            $("#national_weather_trend").html("&nbsp;&nbsp;国庆假日前期（10月1日～4日），受东北气流影响，我市以多云天气为主，最高气温30～32℃，最低气温24～26℃。后期（5日～7日），转受偏东气流影响，我市多云有小到中雨，局部大雨；最高气温28～31℃，最低气温23～25℃。 \n&nbsp;&nbsp;海洋方面：10月1日～7日，我市近海海面风力5级、阵风6～7级。");
            $("#national_weather_details").html("&nbsp;&nbsp;国庆假日后期，我市有降水，恰逢返程高峰，请大家密切关注天气预报，合理安排返程时间。最后祝大家节日快乐!");
            $("#top ul li button").removeClass("active");
            $("#button08").addClass("active");

            //国庆表格添加默认内容
            str = "<tr><td><input type='text' value='10月1日' onblur='input_blur(this)' onfocus='input_focus(this)' /></td><td class='weather'><div style='width:100%;height:100%;'><label><img id='guoqinoneday1-img1' class='Imghover' src='../Images/tq/01.png' onclick='choose_img(this)' /></label><input type='text' value='天气晴朗，阳光强烈' onblur='input_blur(this)' onfocus='input_focus(this)' style='height:25%;'/></div></td><td><input type='text' value='25-33℃' onblur='input_blur(this)' onfocus='input_focus(this)' /></td><td><input type='text' value='东南风3-4级' onblur='input_blur(this)' onfocus='input_focus(this)' /></td></tr>";
            str = str + "<tr><td><input type='text' value='10月2日' onblur='input_blur(this)' onfocus='input_focus(this)' /></td><td class='weather'><div style='width:100%;height:100%;'><label><img id='guoqinoneday2-img1' class='Imghover' src='../Images/tq/01.png' onclick='choose_img(this)' /></label><input type='text' value='天气晴朗，阳光强烈' onblur='input_blur(this)' onfocus='input_focus(this)' style='height:25%;'/></div></td><td><input type='text' value='25-33℃' onblur='input_blur(this)' onfocus='input_focus(this)' /></td><td><input type='text' value='东南风3-4级' onblur='input_blur(this)' onfocus='input_focus(this)' /></td></tr>";
            str = str + "<tr><td><input type='text' value='10月3日' onblur='input_blur(this)' onfocus='input_focus(this)' /></td><td class='weather'><div style='width:100%;height:100%;'><label><img id='guoqinoneday3-img1' class='Imghover' src='../Images/tq/01.png' onclick='choose_img(this)' /></label><input type='text' value='天气晴朗，阳光强烈' onblur='input_blur(this)' onfocus='input_focus(this)' style='height:25%;'/></div></td><td><input type='text' value='25-33℃' onblur='input_blur(this)' onfocus='input_focus(this)' /></td><td><input type='text' value='东南风3-4级' onblur='input_blur(this)' onfocus='input_focus(this)' /></td></tr>";
            str = str + "<tr><td><input type='text' value='10月4日' onblur='input_blur(this)' onfocus='input_focus(this)' /></td><td class='weather'><div style='width:100%;height:100%;'><label><img id='guoqinoneday4-img1' class='Imghover' src='../Images/tq/01.png' onclick='choose_img(this)' /></label><input type='text' value='天气晴朗，阳光强烈' onblur='input_blur(this)' onfocus='input_focus(this)' style='height:25%;'/></div></td><td><input type='text' value='25-33℃' onblur='input_blur(this)' onfocus='input_focus(this)' /></td><td><input type='text' value='东南风3-4级' onblur='input_blur(this)' onfocus='input_focus(this)' /></td></tr>";
            str = str + "<tr><td><input type='text' value='10月5日' onblur='input_blur(this)' onfocus='input_focus(this)' /></td><td class='weather'><div style='width:100%;height:100%;'><label><img id='guoqinoneday5-img1' class='Imghover' src='../Images/tq/01.png' onclick='choose_img(this)' /></label><input type='text' value='天气晴朗，阳光强烈' onblur='input_blur(this)' onfocus='input_focus(this)' style='height:25%;'/></div></td><td><input type='text' value='25-33℃' onblur='input_blur(this)' onfocus='input_focus(this)' /></td><td><input type='text' value='东南风3-4级' onblur='input_blur(this)' onfocus='input_focus(this)' /></td></tr>";
            str = str + "<tr><td><input type='text' value='10月6日' onblur='input_blur(this)' onfocus='input_focus(this)' /></td><td class='weather'><div style='width:100%;height:100%;'><label><img id='guoqinoneday6-img1' class='Imghover' src='../Images/tq/01.png' onclick='choose_img(this)' /></label><input type='text' value='天气晴朗，阳光强烈' onblur='input_blur(this)' onfocus='input_focus(this)' style='height:25%;'/></div></td><td><input type='text' value='25-33℃' onblur='input_blur(this)' onfocus='input_focus(this)' /></td><td><input type='text' value='东南风3-4级' onblur='input_blur(this)' onfocus='input_focus(this)' /></td></tr>";
            str = str + "<tr><td><input type='text' value='10月7日' onblur='input_blur(this)' onfocus='input_focus(this)' /></td><td class='weather'><div style='width:100%;height:100%;'><label><img id='guoqinoneday7-img1' class='Imghover' src='../Images/tq/01.png' onclick='choose_img(this)' /></label><input type='text' value='天气晴朗，阳光强烈' onblur='input_blur(this)' onfocus='input_focus(this)' style='height:25%;'/></div></td><td><input type='text' value='25-33℃' onblur='input_blur(this)' onfocus='input_focus(this)' /></td><td><input type='text' value='东南风3-4级' onblur='input_blur(this)' onfocus='input_focus(this)' /></td></tr>";

            $("#national_table tbody").html(str);
        }
    })
}


//高考专报获取数据
function loadGaokaoDatas() {
    var date = new Date();
    var nowtime = date.format("yyyy-MM-dd") + " " + selectHour + ":00:00";
    var datanew;
    var TBdatanew;
    var str = "";

    $.post("/WebService.asmx/getGaokaoDatas", {
        dateTime: nowtime
    }, function (msg) {
        if (msg.indexOf("+") > 0) {
            //将得到的两个json数据分离，分别转换格式
            datanew = msg.split("+")[0];
            TBdatanew = msg.split("+")[1];
            datanew = JSON.parse(datanew);
            TBdatanew = JSON.parse(TBdatanew);

            $("#cbUser").val(datanew.Forecaster);
            $("#gaokao_subhead").val(datanew.Subhead);
            $("#gaokao_weather_trend").val(datanew.Weather_trend);
            $("#gaokao_suggest").val(datanew.Suggest);
            $("#top ul li button").removeClass("active");
            $("#button" + selectHour + "").addClass("active");

            str = "<tr><td rowspan='2'>6月9日</td><td>上午</td><td class='weather'><div style='width:100%;height:100%;'><label><img id='gaokaooneday1-img1' class='Imghover' src='../Images/tq/" + TBdatanew.Weatherpic[0] + "' onclick='choose_img(this)' /></label><input type='text' value='" + TBdatanew.Weatherdes[0] + "' onblur='input_blur(this)' onfocus='input_focus(this)' style='height:25%;'/></div></td><td><input type='text' value='" + TBdatanew.Temperature[0] + "' onblur='input_blur(this)' onfocus='input_focus(this)' /></td><td rowspan='2'><input type='text' value='" + TBdatanew.Wind[0] + "' onblur='input_blur(this)' onfocus='input_focus(this)' /></td></tr>";
            str = str + "<tr><td>下午</td><td class='weather'><div style='width:100%;height:100%;'><label><img id='gaokaooneday2-img1' class='Imghover' src='../Images/tq/" + TBdatanew.Weatherpic[1] + "' onclick='choose_img(this)' /></label><input type='text' value='" + TBdatanew.Weatherdes[1] + "' onblur='input_blur(this)' onfocus='input_focus(this)' style='height:25%;'/></div></td><td><input type='text' value='" + TBdatanew.Temperature[1] + "' onblur='input_blur(this)' onfocus='input_focus(this)' /></td></tr>";
            str = str + "<tr><td rowspan='2'>6月10日</td><td>上午</td><td class='weather'><div style='width:100%;height:100%;'><label><img id='gaokaooneday3-img1' class='Imghover' src='../Images/tq/" + TBdatanew.Weatherpic[2] + "' onclick='choose_img(this)' /></label><input type='text' value='" + TBdatanew.Weatherdes[2] + "' onblur='input_blur(this)' onfocus='input_focus(this)' style='height:25%;'/></div></td><td><input type='text' value='" + TBdatanew.Temperature[2] + "' onblur='input_blur(this)' onfocus='input_focus(this)' /></td><td rowspan='2'><input type='text' value='" + TBdatanew.Wind[2] + "' onblur='input_blur(this)' onfocus='input_focus(this)' /></td></tr>";
            str = str + "<tr><td>下午</td><td class='weather'><div style='width:100%;height:100%;'><label><img id='gaokaooneday4-img1' class='Imghover' src='../Images/tq/" + TBdatanew.Weatherpic[3] + "' onclick='choose_img(this)' /></label><input type='text' value='" + TBdatanew.Weatherdes[3] + "' onblur='input_blur(this)' onfocus='input_focus(this)' style='height:25%;'/></div></td><td><input type='text' value='" + TBdatanew.Temperature[3] + "' onblur='input_blur(this)' onfocus='input_focus(this)' /></td></tr>";

            $("#gaokao_table tbody").html(str);
        } else {
            $("#top ul li button").removeClass("active");
            $("#button08").addClass("active");
            $("#gaokao_subhead").html("&nbsp;&nbsp;多阵雨天气");
            $("#gaokao_weather_trend").html("&nbsp;&nbsp;预计，高考期间（6月9日～10日），受南到东南气流影响，以多云有阵雨天气为主，最高气温32℃-34℃，最低气温25-27℃。其中，9日多云有阵雨；10日多云间晴，局地有雷阵雨，最高气温略有上升。");
            $("#gaokao_suggest").html("&nbsp;&nbsp;9日以阵雨为主，雨强偏弱，出现雷电的概率较低，天气对高考影响不大，需注意降雨期间的道路交通疏导工作。\n&nbsp;&nbsp;考生出门要带好雨具，合理安排赶考时间，并避开易拥堵路段；合理安排作息时间,保持良好状态，争取考出最好成绩。");
            str = "<tr><td rowspan='2'>6月9日</td><td>上午</td><td class='weather'><div style='width:100%;height:100%;'><label><img id='gaokaooneday1-img1' class='Imghover' src='../Images/tq/01.png' onclick='choose_img(this)' /></label><input type='text' value='天气晴朗，阳光强烈' onblur='input_blur(this)' onfocus='input_focus(this)' style='height:25%;'/></div></td><td><input type='text' value='27-31℃' onblur='input_blur(this)' onfocus='input_focus(this)' /></td><td rowspan='2'><input type='text' value='偏南风3-4级' onblur='input_blur(this)' onfocus='input_focus(this)' /></td></tr>";
            str = str + "<tr><td>下午</td><td class='weather'><div style='width:100%;height:100%;'><label><img id='gaokaooneday2-img1' class='Imghover' src='../Images/tq/01.png' onclick='choose_img(this)' /></label><input type='text' value='天气晴朗，阳光强烈' onblur='input_blur(this)' onfocus='input_focus(this)' style='height:25%;'/></div></td><td><input type='text' value='27-31℃' onblur='input_blur(this)' onfocus='input_focus(this)' /></td></tr>";
            str = str + "<tr><td rowspan='2'>6月10日</td><td>上午</td><td class='weather'><div style='width:100%;height:100%;'><label><img id='gaokaooneday3-img1' class='Imghover' src='../Images/tq/01.png' onclick='choose_img(this)' /></label><input type='text' value='天气晴朗，阳光强烈' onblur='input_blur(this)' onfocus='input_focus(this)' style='height:25%;'/></div></td><td><input type='text' value='27-31℃' onblur='input_blur(this)' onfocus='input_focus(this)' /></td><td rowspan='2'><input type='text' value='偏南风3-4级' onblur='input_blur(this)' onfocus='input_focus(this)' /></td></tr>";
            str = str + "<tr><td>下午</td><td class='weather'><div style='width:100%;height:100%;'><label><img id='gaokaooneday4-img1' class='Imghover' src='../Images/tq/01.png' onclick='choose_img(this)' /></label><input type='text' value='天气晴朗，阳光强烈' onblur='input_blur(this)' onfocus='input_focus(this)' style='height:25%;'/></div></td><td><input type='text' value='27-31℃' onblur='input_blur(this)' onfocus='input_focus(this)' /></td></tr>";

            $("#gaokao_table tbody").html(str);
        }
    })
}


//中考专报获取数据
function loadZhongkaoDatas() {
    var date = new Date();
    var nowtime = date.format("yyyy-MM-dd") + " " + selectHour + ":00:00";
    var datanew;
    var TBdatanew;
    var str = "";

    $.post("/WebService.asmx/getZhongkaoDatas", {
        dateTime: nowtime
    }, function (msg) {
        if (msg.indexOf("+") > 0) {
            //将得到的两个json数据分离，分别转换格式
            datanew = msg.split("+")[0];
            TBdatanew = msg.split("+")[1];
            datanew = JSON.parse(datanew);
            TBdatanew = JSON.parse(TBdatanew);

            $("#cbUser").val(datanew.Forecaster);
            $("#zhongkao_weather_trend").val(datanew.Weather_trend);
            $("#zhongkao_suggest").val(datanew.Suggest);
            $("#top ul li button").removeClass("active");
            $("#button" + selectHour + "").addClass("active");

            str = "<tr><td rowspan='2'>6月25日</td><td>上午</td><td class='weather'><div style='width:100%;height:100%;'><label><img id='zhongkaooneday1-img1' class='Imghover' src='../Images/tq/" + TBdatanew.Weatherpic[0] + "' onclick='choose_img(this)' /></label><input type='text' value='" + TBdatanew.Weatherdes[0] + "' onblur='input_blur(this)' onfocus='input_focus(this)' style='height:25%;'/></div></td><td><input type='text' value='" + TBdatanew.Temperature[0] + "' onblur='input_blur(this)' onfocus='input_focus(this)' /></td><td rowspan='2'><input type='text' value='" + TBdatanew.Wind[0] + "' onblur='input_blur(this)' onfocus='input_focus(this)' /></td></tr>";
            str = str + "<tr><td>下午</td><td class='weather'><div style='width:100%;height:100%;'><label><img id='zhongkaooneday2-img1' class='Imghover' src='../Images/tq/" + TBdatanew.Weatherpic[1] + "' onclick='choose_img(this)' /></label><input type='text' value='" + TBdatanew.Weatherdes[1] + "' onblur='input_blur(this)' onfocus='input_focus(this)' style='height:25%;'/></div></td><td><input type='text' value='" + TBdatanew.Temperature[1] + "' onblur='input_blur(this)' onfocus='input_focus(this)' /></td></tr>";
            str = str + "<tr><td rowspan='2'>6月26日</td><td>上午</td><td class='weather'><div style='width:100%;height:100%;'><label><img id='zhongkaooneday3-img1' class='Imghover' src='../Images/tq/" + TBdatanew.Weatherpic[2] + "' onclick='choose_img(this)' /></label><input type='text' value='" + TBdatanew.Weatherdes[2] + "' onblur='input_blur(this)' onfocus='input_focus(this)' style='height:25%;'/></div></td><td><input type='text' value='" + TBdatanew.Temperature[2] + "' onblur='input_blur(this)' onfocus='input_focus(this)' /></td><td rowspan='2'><input type='text' value='" + TBdatanew.Wind[2] + "' onblur='input_blur(this)' onfocus='input_focus(this)' /></td></tr>";
            str = str + "<tr><td>下午</td><td class='weather'><div style='width:100%;height:100%;'><label><img id='zhongkaooneday4-img1' class='Imghover' src='../Images/tq/" + TBdatanew.Weatherpic[3] + "' onclick='choose_img(this)' /></label><input type='text' value='" + TBdatanew.Weatherdes[3] + "' onblur='input_blur(this)' onfocus='input_focus(this)' style='height:25%;'/></div></td><td><input type='text' value='" + TBdatanew.Temperature[3] + "' onblur='input_blur(this)' onfocus='input_focus(this)' /></td></tr>";
            str = str + "<tr><td rowspan='2'>6月27日</td><td>上午</td><td class='weather'><div style='width:100%;height:100%;'><label><img id='zhongkaooneday5-img1' class='Imghover' src='../Images/tq/" + TBdatanew.Weatherpic[4] + "' onclick='choose_img(this)' /></label><input type='text' value='" + TBdatanew.Weatherdes[4] + "' onblur='input_blur(this)' onfocus='input_focus(this)' style='height:25%;'/></div></td><td><input type='text' value='" + TBdatanew.Temperature[4] + "' onblur='input_blur(this)' onfocus='input_focus(this)' /></td><td rowspan='2'><input type='text' value='" + TBdatanew.Wind[4] + "' onblur='input_blur(this)' onfocus='input_focus(this)' /></td></tr>";
            str = str + "<tr><td>下午</td><td class='weather'><div style='width:100%;height:100%;'><label><img id='zhongkaooneday6-img1' class='Imghover' src='../Images/tq/" + TBdatanew.Weatherpic[5] + "' onclick='choose_img(this)' /></label><input type='text' value='" + TBdatanew.Weatherdes[5] + "' onblur='input_blur(this)' onfocus='input_focus(this)' style='height:25%;'/></div></td><td><input type='text' value='" + TBdatanew.Temperature[5] + "' onblur='input_blur(this)' onfocus='input_focus(this)' /></td></tr>";

            $("#zhongkao_table tbody").html(str);

        } else {
            $("#top ul li button").removeClass("active");
            $("#button08").addClass("active");
            $("#zhongkao_weather_trend").html("&nbsp;&nbsp;预计，中考期间（6月25日～27日），受偏南气流影响，最高气温34～36℃，25日，我市多云有午后雷阵雨，26～27日，多云，局地有午后雷阵雨。");
            $("#zhongkao_suggest").html("&nbsp;&nbsp;1、中考期间，我市上午以晴间多云天气为主，对英语听力影响不大，25日下午将出现雷阵雨天气，26-27日局地雷阵雨，可能造成部分路段交通不畅，请有关部门加强交通疏导和注意及时排水。 \n&nbsp;&nbsp;2、注意防御雷电，雷雨期间在车内或在装有避雷设施的建筑物内躲雨。 \n&nbsp;&nbsp;3、天气较热，紫外线强度偏高，注意防晒及多补充水分，以防中暑。");
            
            str = "<tr><td rowspan='2'>6月25日</td><td>上午</td><td class='weather'><div style='width:100%;height:100%;'><label><img id='zhongkaooneday1-img1' class='Imghover' src='../Images/tq/01.png' onclick='choose_img(this)' /></label><input type='text' value='天气晴朗，阳光强烈' onblur='input_blur(this)' onfocus='input_focus(this)' style='height:25%;'/></div></td><td><input type='text' value='27-31℃' onblur='input_blur(this)' onfocus='input_focus(this)' /></td><td rowspan='2'><input type='text' value='偏南风3-4级' onblur='input_blur(this)' onfocus='input_focus(this)' /></td></tr>";
            str = str + "<tr><td>下午</td><td class='weather'><div style='width:100%;height:100%;'><label><img id='zhongkaooneday2-img1' class='Imghover' src='../Images/tq/01.png' onclick='choose_img(this)' /></label><input type='text' value='天气晴朗，阳光强烈' onblur='input_blur(this)' onfocus='input_focus(this)' style='height:25%;'/></div></td><td><input type='text' value='27-31℃' onblur='input_blur(this)' onfocus='input_focus(this)' /></td></tr>";
            str = str + "<tr><td rowspan='2'>6月26日</td><td>上午</td><td class='weather'><div style='width:100%;height:100%;'><label><img id='zhongkaooneday3-img1' class='Imghover' src='../Images/tq/01.png' onclick='choose_img(this)' /></label><input type='text' value='天气晴朗，阳光强烈' onblur='input_blur(this)' onfocus='input_focus(this)' style='height:25%;'/></div></td><td><input type='text' value='27-31℃' onblur='input_blur(this)' onfocus='input_focus(this)' /></td><td rowspan='2'><input type='text' value='偏南风3-4级' onblur='input_blur(this)' onfocus='input_focus(this)' /></td></tr>";
            str = str + "<tr><td>下午</td><td class='weather'><div style='width:100%;height:100%;'><label><img id='zhongkaooneday4-img1' class='Imghover' src='../Images/tq/01.png' onclick='choose_img(this)' /></label><input type='text' value='天气晴朗，阳光强烈' onblur='input_blur(this)' onfocus='input_focus(this)' style='height:25%;'/></div></td><td><input type='text' value='27-31℃' onblur='input_blur(this)' onfocus='input_focus(this)' /></td></tr>";
            str = str + "<tr><td rowspan='2'>6月27日</td><td>上午</td><td class='weather'><div style='width:100%;height:100%;'><label><img id='zhongkaooneday5-img1' class='Imghover' src='../Images/tq/01.png' onclick='choose_img(this)' /></label><input type='text' value='天气晴朗，阳光强烈' onblur='input_blur(this)' onfocus='input_focus(this)' style='height:25%;'/></div></td><td><input type='text' value='27-31℃' onblur='input_blur(this)' onfocus='input_focus(this)' /></td><td rowspan='2'><input type='text' value='偏南风3-4级' onblur='input_blur(this)' onfocus='input_focus(this)' /></td></tr>";
            str = str + "<tr><td>下午</td><td class='weather'><div style='width:100%;height:100%;'><label><img id='zhongkaooneday6-img1' class='Imghover' src='../Images/tq/01.png' onclick='choose_img(this)' /></label><input type='text' value='天气晴朗，阳光强烈' onblur='input_blur(this)' onfocus='input_focus(this)' style='height:25%;'/></div></td><td><input type='text' value='27-31℃' onblur='input_blur(this)' onfocus='input_focus(this)' /></td></tr>";

            $("#zhongkao_table tbody").html(str);
        }
    })
}

//春节专报获取数据
function loadSpringDatas() {
    var date = new Date();
    var nowtime = date.format("yyyy-MM-dd") + " " + selectHour + ":00:00";
    var datanew;
    var TBdatanew;
    var str = "";

    $.post("/WebService.asmx/getSpringFSTDatas", {
        dateTime: nowtime
    }, function (msg) {
        if (msg.indexOf("+") > 0) {
            //将得到的两个json数据分离，分别转换格式
            datanew = msg.split("+")[0];
            TBdatanew = msg.split("+")[1];
            datanew = JSON.parse(datanew);
            TBdatanew = JSON.parse(TBdatanew);

            $("#cbUser").val(datanew.Forecaster);
            $("#spring_weather_trend").val(datanew.Weather_trend);
            $("#spring_weather_details").val(datanew.Weather_details);
            $("#top ul li button").removeClass("active");
            $("#button" + selectHour + "").addClass("active");

            for (var i = 0; i < TBdatanew.Forecasttime.length;i++){
                str += "<tr><td><input type='text' value='" + TBdatanew.Forecasttime[i] + "' onblur='input_blur(this)' onfocus='input_focus(this)' /></td><td class='weather'><div style='width:100%;height:100%;'><label><img id='springoneday1" + (i + 1) + "-img1' class='Imghover' src='../Images/tq/" + TBdatanew.Weatherpic[i] + "' onclick='choose_img(this)' /></label><input type='text' value='" + TBdatanew.Weatherdes[i] + "' onblur='input_blur(this)' onfocus='input_focus(this)' style='height:25%;'/></div></td><td><input type='text' value='" + TBdatanew.Temperature[i] + "' onblur='input_blur(this)' onfocus='input_focus(this)' /></td><td><input type='text' value='" + TBdatanew.Wind[i] + "' onblur='input_blur(this)' onfocus='input_focus(this)' /></td></tr>";
            }
            $("#spring_table tbody").html(str);

        } else {
            $("#spring_weather_trend").html("&nbsp;&nbsp;1月27日～2月2日（农历除夕～正月初六）春节假日期间，我市天气较好，气温适宜，大部分时间阳光灿烂，温暖干爽，适宜节庆以及其他户外活动。另外，琼州海峡大部分时段通航气象条件良好。");
            $("#spring_weather_details").html("&nbsp;&nbsp受东到东南气流控制，27日～30日白天，全市晴间多云，气温逐日回升，昼夜温差大；30日夜间～31日，阴天间多云，最高气温略有下降；其中，29日～30日，早晚有雾。2月1日～2日，冷空气影响减弱，多云间晴，气温有所上升。具体预报如下： \n&nbsp;&nbsp总体而言，春节期间我市天气晴好，气温适宜，有利于户外活动。1月29日～30日，我市陆地和琼州海峡早晚有雾，能见度低时公路交通运输和通航气象条件较差，请注意出行安全。");
            $("#top ul li button").removeClass("active");
            $("#button08").addClass("active");

            //春节表格添加默认内容
            str = "<tr><td><input type='text' value='1月27日（除夕）' onblur='input_blur(this)' onfocus='input_focus(this)' /></td><td class='weather'><div style='width:100%;height:100%;'><label><img id='springoneday1-img1' class='Imghover' src='../Images/tq/01.png' onclick='choose_img(this)' /></label><div class='pic' id='springoneday1-img2'></div><input type='text' value='天气晴朗，阳光强烈' onblur='input_blur(this)' onfocus='input_focus(this)' style='height:25%;'/></div></td><td><input type='text' value='25-33℃' onblur='input_blur(this)' onfocus='input_focus(this)' /></td><td><input type='text' value='东南风3-4级' onblur='input_blur(this)' onfocus='input_focus(this)' /></td></tr>";
            str = str + "<tr><td><input type='text' value='1月28日（正月初一）' onblur='input_blur(this)' onfocus='input_focus(this)' /></td><td class='weather'><div style='width:100%;height:100%;'><label><img id='springoneday2-img1' class='Imghover' src='../Images/tq/01.png' onclick='choose_img(this)' /></label><div class='pic' id='springoneday2-img2'></div><input type='text' value='天气晴朗，阳光强烈' onblur='input_blur(this)' onfocus='input_focus(this)' style='height:25%;'/></div></td><td><input type='text' value='25-33℃' onblur='input_blur(this)' onfocus='input_focus(this)' /></td><td><input type='text' value='东南风3-4级' onblur='input_blur(this)' onfocus='input_focus(this)' /></td></tr>";
            str = str + "<tr><td><input type='text' value='1月29日（正月初二）' onblur='input_blur(this)' onfocus='input_focus(this)' /></td><td class='weather'><div style='width:100%;height:100%;'><label><img id='springoneday3-img1' class='Imghover' src='../Images/tq/01.png' onclick='choose_img(this)' /></label><div class='pic' id='springoneday3-img2'></div><input type='text' value='天气晴朗，阳光强烈' onblur='input_blur(this)' onfocus='input_focus(this)' style='height:25%;'/></div></td><td><input type='text' value='25-33℃' onblur='input_blur(this)' onfocus='input_focus(this)' /></td><td><input type='text' value='东南风3-4级' onblur='input_blur(this)' onfocus='input_focus(this)' /></td></tr>";
            str = str + "<tr><td><input type='text' value='1月30日（正月初三）' onblur='input_blur(this)' onfocus='input_focus(this)' /></td><td class='weather'><div style='width:100%;height:100%;'><label><img id='springoneday4-img1' class='Imghover' src='../Images/tq/01.png' onclick='choose_img(this)' /></label><div class='pic' id='springoneday4-img2'></div><input type='text' value='天气晴朗，阳光强烈' onblur='input_blur(this)' onfocus='input_focus(this)' style='height:25%;'/></div></td><td><input type='text' value='25-33℃' onblur='input_blur(this)' onfocus='input_focus(this)' /></td><td><input type='text' value='东南风3-4级' onblur='input_blur(this)' onfocus='input_focus(this)' /></td></tr>";
            str = str + "<tr><td><input type='text' value='1月31日（正月初四）' onblur='input_blur(this)' onfocus='input_focus(this)' /></td><td class='weather'><div style='width:100%;height:100%;'><label><img id='springoneday5-img1' class='Imghover' src='../Images/tq/01.png' onclick='choose_img(this)' /></label><div class='pic' id='springoneday5-img2'></div><input type='text' value='天气晴朗，阳光强烈' onblur='input_blur(this)' onfocus='input_focus(this)' style='height:25%;'/></div></td><td><input type='text' value='25-33℃' onblur='input_blur(this)' onfocus='input_focus(this)' /></td><td><input type='text' value='东南风3-4级' onblur='input_blur(this)' onfocus='input_focus(this)' /></td></tr>";
            str = str + "<tr><td><input type='text' value='2月1日（正月初五）' onblur='input_blur(this)' onfocus='input_focus(this)' /></td><td class='weather'><div style='width:100%;height:100%;'><label><img id='springoneday6-img1' class='Imghover' src='../Images/tq/01.png' onclick='choose_img(this)' /></label><div class='pic' id='springoneday6-img2'></div><input type='text' value='天气晴朗，阳光强烈' onblur='input_blur(this)' onfocus='input_focus(this)' style='height:25%;'/></div></td><td><input type='text' value='25-33℃' onblur='input_blur(this)' onfocus='input_focus(this)' /></td><td><input type='text' value='东南风3-4级' onblur='input_blur(this)' onfocus='input_focus(this)' /></td></tr>";
            str = str + "<tr><td><input type='text' value='2月2日（正月初六）' onblur='input_blur(this)' onfocus='input_focus(this)' /></td><td class='weather'><div style='width:100%;height:100%;'><label><img id='springoneday7-img1' class='Imghover' src='../Images/tq/01.png' onclick='choose_img(this)' /></label><div class='pic' id='springoneday7-img2'></div><input type='text' value='天气晴朗，阳光强烈' onblur='input_blur(this)' onfocus='input_focus(this)' style='height:25%;'/></div></td><td><input type='text' value='25-33℃' onblur='input_blur(this)' onfocus='input_focus(this)' /></td><td><input type='text' value='东南风3-4级' onblur='input_blur(this)' onfocus='input_focus(this)' /></td></tr>";

            $("#spring_table tbody").html(str);
        }
    })
}


//获取端午节数据
function loadDuanwuDatas() {
    var date = new Date();
    var nowtime = date.format("yyyy-MM-dd") + " " + selectHour + ":00:00";
    var datanew;
    var TBdatanew;
    var str = "";

    $.post("/WebService.asmx/getDuanwuDatas", {
        dateTime: nowtime
    }, function (msg) {
        if (msg.indexOf("+") > 0) {
            //将得到的两个json数据分离，分别转换格式
            datanew = msg.split("+")[0];
            TBdatanew = msg.split("+")[1];
            datanew = JSON.parse(datanew);
            TBdatanew = JSON.parse(TBdatanew);

            $("#cbUser").val(datanew.Forecaster);
            $("#duanwu_weather_trend").val(datanew.Weather_trend);
            $("#duanwu_weather_details").val(datanew.Weather_details);
            $("#subhead").val(datanew.Subhead);
            $("#top ul li button").removeClass("active");
            $("#button" + selectHour + "").addClass("active");


            $("#previewImg").html("<span style='position:relative;margin-left:30px;display:inline-block;width:46%;'><span class='del' title='删除' onclick='del_pic(this)' style='position:absolute;right:0;z-index:10000;width:15px;height:15px;background:#2eb1e8 url(../../Images/upload/UploadAction/delete_white.png) no-repeat scroll 0 0;'></span><img src='../Images/upload/UploadAction/" + datanew.Pic + "' onclick='showDetail(this)' style='width:100%;'/><div style='margin-top:20px;'>添加图片描述：<input type='text' value='" + datanew.PicDes + "' style='display:inline-block;width: 70%; height: 25px; border: 1px solid #aaa;font-size:12px;' /></div></span>");

            for (var i = 0; i < TBdatanew.Forecasttime.length;i++){
                str += "<tr><td><input type='text' value='" + TBdatanew.Forecasttime[i] + "' onblur='input_blur(this)' onfocus='input_focus(this)' /></td><td class='weather'><div style='width:100%;height:100%;'><label><img id='springoneday1" + (i + 1) + "-img1' class='Imghover' src='../Images/tq/" + TBdatanew.Weatherpic[i] + "' onclick='choose_img(this)' /></label><input type='text' value='" + TBdatanew.Weatherdes[i] + "' onblur='input_blur(this)' onfocus='input_focus(this)' style='height:25%;'/></div></td><td><input type='text' value='" + TBdatanew.Temperature[i] + "' onblur='input_blur(this)' onfocus='input_focus(this)' /></td><td><input type='text' value='" + TBdatanew.Wind[i] + "' onblur='input_blur(this)' onfocus='input_focus(this)' /></td></tr>";
            }
            $("#duanwu_table tbody").html(str);

        } else {
            $("#top ul li button").removeClass("active");
            $("#button08").addClass("active");
            $("#duanwu_weather_trend").html("&nbsp;&nbsp;目前，在本岛南部距离三亚大约150公里的海面上有热带云团发展（图1），预计：未来两天内可能加强成为热带低压，并于26日～30日给我市带来一次降水天气过程；琼州海峡风力5-6级，阵风7级。");
            $("#subhead").html("&nbsp;&nbsp;未来两天内热带云团可能加强成为热带低压");
            $("#duanwu_weather_details").html("&nbsp;&nbsp;预计：5月28-30日，受南海辐合带和低压环流影响，我市将有一次明显的降水过程；其中28-29日，我市大部地区小雨，局地中到大雨，30日小到中雨，局地大雨。 \n&nbsp;&nbsp;具体预报如下： \n&nbsp;&nbsp;端午节假期期间，本市多降水，特别是29-30日雨量较大，对户外活动有一定影响。 \n&nbsp;&nbsp;由于该热带云团在未来两天内可能加强成为热带低压，26-30日多降水天气过程，请相关部门做好水库安全、城市积涝和中小河流域洪水的防范。另外，该热带云团距离我省陆地较近，一旦加强成热带低压将迅速靠近我省陆地，严重威胁近海作业船只安全，提醒相关部门迅速采取措施，加强出海船只的管理。");
            $("#previewImg").html("<span style='position:relative;margin-left:30px;display:inline-block;width:46%;'><span class='del' title='删除' onclick='del_pic(this)' style='position:absolute;right:0;z-index:10000;width:15px;height:15px;background:#2eb1e8 url(../../Images/upload/UploadAction/delete_white.png) no-repeat scroll 0 0;'></span><img src='../Images/upload/UploadAction/duanwu.png' onclick='showDetail(this)' style='width:100%;'/><div style='margin-top:20px;'>添加图片描述：<input type='text' value='图1 南海热带云团监测云图（5月26日09时）' style='display:inline-block;width: 70%; height: 25px; border: 1px solid #aaa;font-size:12px;' /></div></span>");

            //端午表格添加默认内容
            str = "<tr><td><input type='text' value='1月13日' onblur='input_blur(this)' onfocus='input_focus(this)' /></td><td class='weather'><div style='width:100%;height:100%;'><label><img id='dwoneday1-img1' class='Imghover' src='../Images/tq/01.png' onclick='choose_img(this)' /></label><input type='text' value='天气晴朗，阳光强烈' onblur='input_blur(this)' onfocus='input_focus(this)' style='height:25%;'/></div></td><td><input type='text' value='18-21℃' onblur='input_blur(this)' onfocus='input_focus(this)' /></td><td><input type='text' value='东北风3-4级' onblur='input_blur(this)' onfocus='input_focus(this)' /></td></tr>";
            str = str + "<tr><td><input type='text' value='1月14日' onblur='input_blur(this)' onfocus='input_focus(this)' /></td><td class='weather'><div style='width:100%;height:100%;'><label><img id='dwoneday2-img1' class='Imghover' src='../Images/tq/01.png' onclick='choose_img(this)'  /></label><input type='text' value='天气晴朗，阳光强烈' onblur='input_blur(this)' onfocus='input_focus(this)' style='height:25%;'/></div></td><td><input type='text' value='18-20℃' onblur='input_blur(this)' onfocus='input_focus(this)' /></td><td><input type='text' value='东北风3-4级' onblur='input_blur(this)' onfocus='input_focus(this)' /></td></tr>";
            str = str + "<tr><td><input type='text' value='1月15日' onblur='input_blur(this)' onfocus='input_focus(this)' /></td><td class='weather'><div style='width:100%;height:100%;'><label><img id='dwoneday3-img1' class='Imghover' src='../Images/tq/01.png'  onclick='choose_img(this)' /></label><input type='text' value='天气晴朗，阳光强烈' onblur='input_blur(this)' onfocus='input_focus(this)' style='height:25%;'/></div></td><td><input type='text' value='18-20℃' onblur='input_blur(this)' onfocus='input_focus(this)' /></td><td><input type='text' value='东北风3-4级' onblur='input_blur(this)' onfocus='input_focus(this)' /></td></tr>";

            $("#duanwu_table tbody").html(str);
        }
    })
}

function changeForecast(holiday) {
    $("." + holiday).css("display", "block").siblings().css("display", "none");
    $("button").removeClass("active");
    $("button[name=" + holiday + "]").addClass("active");
    $("#button08").addClass("active");

    switch (holiday) {
        case "national_forecast":
            loadDatas();            //国庆专报
            break;
        case "gaokao_forecast":
            loadGaokaoDatas();     //高考专报
            break;
        case "zhongkao_forecast":
            loadZhongkaoDatas();   //中考专报
            break;
        case "spring_forecast":
            loadSpringDatas();     //春节专报
            break;
        case "duanwu_forecast":
            loadDuanwuDatas();     //端午专报
            break;
        default:
            break;
    }
}


//端午专报 天气预报添加默认的图片
function addDefaultImg() {
    var html;
    var previewBox = $("#preview");
    var delHtml = '<span class="file_del" title="删除" onclick="delDefaultImg()"></span>';

    html += '<div id="uploadList_default" class="upload_append_list">';
    html += '	<div class="file_bar">';
    html += '		<div>';
    html += '			<p class="file_name">图1 南海热带云团监测云图（5月26日09时）</p>';
    html += delHtml;   // 删除按钮的html
    html += '		</div>';
    html += '	</div>';
    html += '	<span style="width:120px;" href="#" >';
    html += '		<div class="uploadImg">';
    html += '			<img id="uploadImage_default" class="upload_image" src="../../Images/upload/UploadAction/1508831113.png" style="width:120px;height:68px!important;border:1px solid #000;overflow:hidden;margin-top:13px;" />';
    html += '		</div>';
    html += '	</span>';
    html += '</div>';

    previewBox.html(html);
}

//删除端午天气预报默认图
function delDefaultImg() {
    var del_file = $(".upload_image");
    del_file.remove();
}

//端午天气预报点击添加的预览图显示细节图
function showDetails(pic) {
    var val = pic.src;
    var str;

    str += "<span class='file_del' id='close_pic' title='关闭' onclick=close_pic() style='position:absolute;top:0;right:505px;z-index:10000;width:15px;height:15px;background:#2eb1e8 url(../../Script/imgUpLoad/control/images/delete_white.png) no-repeat scroll 0 0;'></span>";
    str += "<img src='" + val + "'  style='width:696px;height:546px;z-index:1000;position:absolute;top:0px;left:-20px;'/>";
    $("#previewShow").html(str);
}

function close_pic() {
    $("#previewShow").html("");
}


//国庆专报发布
function releaseNational() {
    var selectHour = $(".selectHour li button.active")[0].innerHTML;
    var ddatetime = $("#date").val() + " " + selectHour;
    var forecaster = $("#cbUser").val();
    var summary = $("#summary").val();
    var national_weather_trend = $("#national_weather_trend").val();
    var national_weather_details = $("#national_weather_details").val();
    var trs = $("#national_table tbody tr");
    
    //当前报文信息
    var NationalInfo = new Array();
    NationalInfo[0] = ddatetime;
    NationalInfo[1] = forecaster;
    NationalInfo[2] = summary;
    NationalInfo[3] = national_weather_trend;
    NationalInfo[4] = national_weather_details;


    var forecasttime = new Array();
    var weatherdes = new Array();
    var weatherpic = new Array();
    var temperature = new Array();
    var wind = new Array();
    var NationTbInfo = new Array();   

    for (var i = 0; i < $("#national_table tbody tr").length; i++) {
        for (var j = 0; j < $("#national_table tbody tr:first td").length; j++) {
            var val = $(trs[i]).children().eq(j).children();

            switch (j) {
                case 0:
                    forecasttime.push(val.val());
                    break;
                case 1:
                    var src=val.children().eq(0).children()[0].src;
                    weatherpic.push(src.substring(src.lastIndexOf("/") + 1, src.length));
                    weatherdes.push(val.children().eq(1).val());
                    break;
                case 2:
                    temperature.push(val.val());
                    break;
                case 3:
                    wind.push(val.val());
                    break;
                default:
                    break;
            }
        }   
    }

    //保存国庆专报数据到模型，方便其他函数调用-关键
    $.post("/WebService.asmx/SaveNationalForecastData", {
        NationalInfo: JSON.stringify(NationalInfo),
        forecasttime: JSON.stringify(forecasttime),
        weatherdes: JSON.stringify(weatherdes),
        weatherpic: JSON.stringify(weatherpic),
        temperature: JSON.stringify(temperature),
        wind: JSON.stringify(wind)
    }, function (resultVal) {

    });

    //发布报文
    layer.confirm('确认发布？', {
        btnAlign: 'c',
        btn: ['确定', '取消'] //按钮
    }, function () {
        loadpage();
        $.post("/WebService.asmx/insertNationalSaveDate", {
            realseTime: ddatetime,
            realseUser: $("#cbUser").val()
        }, function (result) {
            layer.close(load);
            result = result.childNodes[0].innerHTML;
            if (result != undefined && result != "") {
                if (result.indexOf("false")<0) {
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


//春节专报发布
function releaseSpring() {
    var selectHour = $(".selectHour li button.active")[0].innerHTML;
    var ddatetime = $("#date").val() + " " + selectHour;
    var forecaster = $("#cbUser").val();
    var spring_weather_trend = $("#spring_weather_trend").val();
    var spring_weather_details = $("#spring_weather_details").val();
    var trs = $("#spring_table tbody tr");

    //当前报文信息
    var SpringInfo = new Array();
    SpringInfo[0] = ddatetime;
    SpringInfo[1] = forecaster;
    SpringInfo[2] = spring_weather_trend;
    SpringInfo[3] = spring_weather_details;

    var forecasttime = new Array();
    var weatherdes = new Array();
    var weatherpic = new Array();
    var temperature = new Array();
    var wind = new Array();
    var SpringTbInfo = new Array();   

    for (var i = 0; i < $("#spring_table tbody tr").length; i++) {
        for (var j = 0; j < $("#spring_table tbody tr:first td").length; j++) {
            var val = $(trs[i]).children().eq(j).children();

            switch (j) {
                case 0:
                    forecasttime.push(val.val());
                    break;
                case 1:
                    var src = val.children().eq(0).children()[0].src;
                    weatherpic.push(src.substring(src.lastIndexOf("/") + 1, src.length));
                    weatherdes.push(val.children().eq(2).val());
                    break;
                case 2:
                    temperature.push(val.val());
                    break;
                case 3:
                    wind.push(val.val());
                    break;
                default:
                    break;
            }
        }
    }

    //保存春节专报数据到模型，方便其他函数调用-关键
    $.post("/WebService.asmx/SaveSpringForecastData", {
        SpringInfo: JSON.stringify(SpringInfo),
        forecasttime: JSON.stringify(forecasttime),
        weatherdes: JSON.stringify(weatherdes),
        weatherpic: JSON.stringify(weatherpic),
        temperature: JSON.stringify(temperature),
        wind: JSON.stringify(wind)
    }, function (resultVal) {

    });

    //发布报文
    layer.confirm('确认发布？', {
        btnAlign: 'c',
        btn: ['确定', '取消'] //按钮
    }, function () {
        loadpage();
        $.post("/WebService.asmx/insertSpringSTFSaveDate", {
            realseTime: ddatetime,
            realseUser: $("#cbUser").val()
        }, function (result) {
            layer.close(load);
            result = result.childNodes[0].innerHTML;
            if (result != undefined && result != "") {
                if (result.indexOf("false") < 0) {
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


//高考专报发布
function releaseGaokao() {
    var gaokao_weather_cont = $("#gaokao_weather_trend").val();
    var gaokao_suggest = $("#gaokao_suggest").val();
    var gaokao_subhead = $("#gaokao_subhead").val();
    var selectHour = $(".selectHour li button.active")[0].innerHTML;
    var ddatetime = $("#date").val() + " " + selectHour;
    var forecaster = $("#cbUser").val();
    var issueId = "1";
    var trs = $(".gaokaoInfo tbody tr");

    //当前报文信息
    var GaokaoInfo = new Array();
    GaokaoInfo[0] = ddatetime;
    GaokaoInfo[1] = forecaster;
    GaokaoInfo[2] = gaokao_weather_cont;
    GaokaoInfo[3] = gaokao_suggest;
    GaokaoInfo[4] = gaokao_subhead;

    var forecasttime = new Array();
    var weatherdes = new Array();
    var weatherpic = new Array();
    var temperature = new Array();
    var wind = new Array(); 

    for (var i = 0; i < $(".gaokaoInfo tbody tr").length; i++) {
        for (var j = 0; j < $(".gaokaoInfo tbody tr:first td").length; j++) {
            var val;

            switch (j) {
                case 0:
                    if (i == 0 || i == 2) {
                        forecasttime.push($(trs[i]).children().eq(0).text() + " " + $(trs[i]).children().eq(1).text());
                    } else {
                        forecasttime.push($(trs[i - 1]).children().eq(0).text() + " " + $(trs[i]).children().eq(0).text());
                    }
                    break;
                case 2:
                    if (i == 0 || i == 2) {
                        val = $(trs[i]).children().eq(j);
                    } else if (i == 1 || i == 3) {
                        val = $(trs[i]).children().eq(j - 1);
                    }
                    var src = val.find("img")[0].src;
                    weatherpic.push(src.substring(src.lastIndexOf("/") + 1, src.length));
                    weatherdes.push(val.text());
                    break;
                case 3:
                    if (i == 0 || i == 2) {
                        temperature.push($(trs[i]).children().eq(3).text());
                    } else {
                        temperature.push($(trs[i]).children().eq(2).text());
                    }
                    break;
                case 4:
                    if (i == 0 || i == 2) {
                        val = $(trs[i]).children().eq(j);
                    } else if (i == 1 || i == 3) {
                        val = $(trs[i-1]).children().eq(j);
                    }
                    wind.push(val.text());
                    break;
                default:
                    break;
            }
            
        }
    }

    //保存高考专报数据到模型，方便其他函数调用-关键
    $.post("/WebService.asmx/SaveGaokaoForecastData", {
        GaokaoInfo: JSON.stringify(GaokaoInfo),
        forecasttime: JSON.stringify(forecasttime),
        weatherdes: JSON.stringify(weatherdes),
        weatherpic: JSON.stringify(weatherpic),
        temperature: JSON.stringify(temperature),
        wind: JSON.stringify(wind)
    }, function (resultVal) {

    });

    //发布报文
    layer.confirm('确认发布？', {
        btnAlign: 'c',
        btn: ['确定', '取消'] //按钮
    }, function () {
        loadpage();
        $.post("/WebService.asmx/insertGaokaoSaveDate", {
            realseTime: ddatetime,
            realseUser: $("#cbUser").val()
        }, function (result) {
            layer.close(load);
            result = result.childNodes[0].innerHTML;
            if (result != undefined && result != "") {
                if (result.indexOf("false") < 0) {
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


//中考专报发布
function releaseZhongkao() {
    var zhongkao_weather_cont = $("#zhongkao_weather_trend").val();
    var zhongkao_suggest = $("#zhongkao_suggest").val();
    var issueId = "1";
    var selectHour = $(".selectHour li button.active")[0].innerHTML;
    var ddatetime = $("#date").val() + " " + selectHour;
    var forecaster = $("#cbUser").val();
    var trs = $(".zhongkaoInfo tbody tr");

    //当前报文信息
    var ZhongkaoInfo = new Array();
    ZhongkaoInfo[0] = ddatetime;
    ZhongkaoInfo[1] = forecaster;
    ZhongkaoInfo[2] = zhongkao_weather_cont;
    ZhongkaoInfo[3] = zhongkao_suggest;
   
    var forecasttime = new Array();
    var weatherdes = new Array();
    var weatherpic = new Array();
    var temperature = new Array();
    var wind = new Array();

    //添加表格数据至模型
    for (var i = 0; i < $(".zhongkaoInfo tbody tr").length; i++) {
        for (var j = 0; j < $(".zhongkaoInfo tbody tr:first td").length; j++) {
            var val;

            switch (j) {
                case 0:
                    if (i == 0 || i == 2 || i==4) {
                        forecasttime.push($(trs[i]).children().eq(0).text() + " " + $(trs[i]).children().eq(1).text());
                    } else {
                        forecasttime.push($(trs[i - 1]).children().eq(0).text() + " " + $(trs[i]).children().eq(0).text());
                    }
                    break;
                case 3:
                    if (i == 0 || i == 2 || i==4) {
                        temperature.push($(trs[i]).children().eq(3).text());
                    } else {
                        temperature.push($(trs[i]).children().eq(2).text());
                    }
                    break;
                case 2:
                    if (i == 0 || i == 2 || i==4) {
                        val = $(trs[i]).children().eq(j);
                    } else if (i == 1 || i == 3 || i==5) {
                        val = $(trs[i]).children().eq(j - 1);
                    }
                    var src = val.find("img")[0].src;
                    weatherpic.push(src.substring(src.lastIndexOf("/") + 1, src.length));
                    weatherdes.push(val.text());
                    break;
                case 4:
                    if (i == 0 || i == 2 || i == 4) {
                        val = $(trs[i]).children().eq(j);
                    } else if (i == 1 || i == 3 || i == 5) {
                        val = $(trs[i-1]).children().eq(j);
                    }
                    wind.push(val.text());
                    break;
                default:
                    break;
            }
        }
    }

    //保存中考专报数据到模型，方便其他函数调用-关键
    $.post("/WebService.asmx/SaveZhongkaoForecastData", {
        ZhongkaoInfo: JSON.stringify(ZhongkaoInfo),
        forecasttime: JSON.stringify(forecasttime),
        weatherdes: JSON.stringify(weatherdes),
        weatherpic: JSON.stringify(weatherpic),
        temperature: JSON.stringify(temperature),
        wind: JSON.stringify(wind)
    }, function (resultVal) {

    });

    //发布报文
    layer.confirm('确认发布？', {
        btnAlign: 'c',
        btn: ['确定', '取消'] //按钮
    }, function () {
        loadpage();
        $.post("/WebService.asmx/insertZhongkaoSaveDate", {
            realseTime: ddatetime,
            realseUser: $("#cbUser").val()
        }, function (result) {
            layer.close(load);
            result = result.childNodes[0].innerHTML;
            if (result != undefined && result != "") {
                if (result.indexOf("false") < 0) {
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

//端午专报发布
function releaseDuanwu() {
    var selectHour = $(".selectHour li button.active")[0].innerHTML;
    var ddatetime = $("#date").val() + " " + selectHour;
    var forecaster = $("#cbUser").val();
    var duanwu_weather_trend = $("#duanwu_weather_trend").val();
    var duanwu_weather_details = $("#duanwu_weather_details").val();
    var subhead = $("#subhead").val();
    var trs = $("#duanwu_table tbody tr");
    var pic = $("#previewImg img")[0];
    pic=pic.src.substring(pic.src.lastIndexOf("/") + 1, pic.src.length);
    var picDes = $("#previewImg input").val();

    //当前报文信息
    var DuanwuInfo = new Array();
    DuanwuInfo[0] = ddatetime;
    DuanwuInfo[1] = forecaster;
    DuanwuInfo[2] = duanwu_weather_trend;
    DuanwuInfo[3] = duanwu_weather_details;
    DuanwuInfo[4] = pic;
    DuanwuInfo[5] = picDes;
    DuanwuInfo[6] = subhead;

    var forecasttime = new Array();
    var weatherdes = new Array();
    var weatherpic = new Array();
    var temperature = new Array();
    var wind = new Array();
    var DuanwuTbInfo = new Array();   

    for (var i = 0; i < $("#duanwu_table tbody tr").length; i++) {
        for (var j = 0; j < $("#duanwu_table tbody tr:first td").length; j++) {
            var val = $(trs[i]).children().eq(j).children();

            switch (j) {
                case 0:
                    forecasttime.push(val.val());
                    break;
                case 1:
                    var src = val.children().eq(0).children()[0].src;
                    weatherpic.push(src.substring(src.lastIndexOf("/") + 1, src.length));
                    weatherdes.push(val.children().eq(1).val());
                    break;
                case 2:
                    temperature.push(val.val());
                    break;
                case 3:
                    wind.push(val.val());
                    break;
                default:
                    break;
            }
        }
    }

    //保存端午专报数据到模型，方便其他函数调用-关键
    $.post("/WebService.asmx/SaveDuanwuForecastData", {
        DuanwuInfo: JSON.stringify(DuanwuInfo),
        forecasttime: JSON.stringify(forecasttime),
        weatherdes: JSON.stringify(weatherdes),
        weatherpic: JSON.stringify(weatherpic),
        temperature: JSON.stringify(temperature),
        wind: JSON.stringify(wind)
    }, function (resultVal) {

    });

    //发布报文
    layer.confirm('确认发布？', {
        btnAlign: 'c',
        btn: ['确定', '取消'] //按钮
    }, function () {
        loadpage();
        $.post("/WebService.asmx/insertDuanwuSaveDate", {
            realseTime: ddatetime,
            realseUser: $("#cbUser").val()
        }, function (result) {
            layer.close(load);
            result = result.childNodes[0].innerHTML;
            if (result != undefined && result != "") {
                if (result.indexOf("false") < 0) {
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

//添加国庆专报预览页面信息
function addPreviewInfo_guoqing() {
    var national_weather_title = $(".national_weather_trend div label").text();
    var national_weather_cont = $("#national_weather_trend").val();
    var national_detail_title = $(".national_weather_details div label").text();
    var national_detail_cont = $("#national_weather_details").val();
    var national_table = $("#national_table tbody").html();
    var trs = $("#national_table tbody tr");
    var tablelistArr = new Array();
    var ddatetime = $("#date").val();
    var str = "";
    ddatetime = dateconvert(ddatetime);

    //添加表格数据
    for (var i = 0; i < $("#national_table tbody tr").length; i++) {
        str += "<tr>";

        for (var j = 0; j < $("#national_table tbody tr:first td").length; j++) {
            var val = $(trs[i]).children().eq(j).children();
            if (j == 1) {
                str += "<td><img style='display:inline-block;text-align:center' src='" + val.children().eq(0).children()[0].src + "' /><span style='width:100%;display:inline-block;text-align:center'>" + val.children().eq(1).val() + "</span></td>";
            } else {
                str += "<td>" + val.val() + "</td>";
            }
        }
        str += "</tr>";
    }
    $(".nationalInfo tbody").html(str);


    $(".national_preview .cont1 .title").html("一、" + national_weather_title);
    $(".national_preview .cont2 .title").html("二、" + national_detail_title);
    $(".summarycont").html($("#summary").val());
    $(".release_time").html(ddatetime);

    var national_weather_cont = national_weather_cont.split(" ");
    $(".national_preview .cont1 p").eq(0).html(national_weather_cont[0]);
    $(".national_preview .cont1 p").eq(1).html(national_weather_cont[1]);

    $(".national_preview .cont2 p").html(national_detail_cont);
}

//添加高考专报预览页面信息
function addPreviewInfo_gaokao() {
    var gaokao_weather_title = $(".gaokao_weather_trend div label").text();
    var gaokao_weather_cont = $("#gaokao_weather_trend").val();
    var gaokao_detail_title = $(".gaokao_weather_details div label").text();
    var gaokao_table = $("#gaokao_table tbody").html();
    var gaokao_suggest_title = $(".gaokao_suggest div label").text();
    var gaokao_suggest = $("#gaokao_suggest").val();
    var gaokao_subhead = $("#gaokao_subhead").val();
    var ddatetime = $("#date").val();
    var issueId = "1";
    var trs = $("#gaokao_table tbody tr");
    var str;

    $(".gaokao_preview .cont1 .title").html("一、" + gaokao_weather_title);
    $(".gaokao_preview .cont2 .title").html("二、" + gaokao_detail_title);
    $(".gaokao_preview .cont3 .title").html("三、" + gaokao_suggest_title);

    $(".gaokao_preview .cont1 p").html(gaokao_weather_cont);

    var gaokao_suggest = gaokao_suggest.split(" ");
    $(".gaokao_preview .cont3 p").eq(0).html(gaokao_suggest[0]);
    $(".gaokao_preview .cont3 p").eq(1).html(gaokao_suggest[1]);

    $(".gaokao_issueId").html(issueId);
    $(".gaokao_subheadVal").html(gaokao_subhead);
    $(".release_time").html(ddatetime.split("-")[0] + "年" + ddatetime.split("-")[1] + "月" + ddatetime.split("-")[2] + "日发布");

    //添加表格数据
    str = "<tr><td rowspan='2'>6月9日</td><td>上午</td><td class='weather'><div style='width:100%;height:100%;'><label style='width:100%;'><img src='" + $(trs[0]).children().eq(2).children().children().eq(0).children()[0].src + "' /></label>" + $(trs[0]).children().eq(2).children().children().eq(1).val() + "</td><td>" + $(trs[0]).children().eq(3).children().val() + "</td><td rowspan='2'>" + $(trs[0]).children().eq(4).children().val() + "</td></tr>";
    str += "<tr><td>下午</td><td class='weather'><div style='width:100%;height:100%;'><label style='width:100%;'><img src='" + $(trs[1]).children().eq(1).children().children().eq(0).children()[0].src + "' /></label>" + $(trs[1]).children().eq(1).children().children().eq(1).val() + "</td><td>" + $(trs[1]).children().eq(2).children().val() + "</td></tr>";
    str += "<tr><td rowspan='2'>6月10日</td><td>上午</td><td class='weather'><div style='width:100%;height:100%;'><label style='width:100%;'><img src='" + $(trs[2]).children().eq(2).children().children().eq(0).children()[0].src + "' /></label>" + $(trs[2]).children().eq(2).children().children().eq(1).val() + "</td><td>" + $(trs[2]).children().eq(3).children().val() + "</td><td rowspan='2'>" + $(trs[2]).children().eq(4).children().val() + "</td></tr>";
    str += "<tr><td>下午</td><td class='weather'><div style='width:100%;height:100%;'><label style='width:100%;'><img src='" + $(trs[3]).children().eq(1).children().children().eq(0).children()[0].src + "' /></label>" + $(trs[3]).children().eq(1).children().children().eq(1).val() + "</td><td>" + $(trs[3]).children().eq(2).children().val() + "</td></tr>";

    $(".gaokaoInfo tbody").html(str);
}

//添加中考专报预览页面信息
function addPreviewInfo_zhongkao() {
    var zhongkao_weather_title = $(".zhongkao_weather_trend div label").text();
    var zhongkao_weather_cont = $("#zhongkao_weather_trend").val();
    var zhongkao_detail_title = $(".zhongkao_weather_details div label").text();
    var zhongkao_suggest_title = $(".zhongkao_suggest div label").text();
    var zhongkao_suggest = $("#zhongkao_suggest").val();
    var issueId = "1";
    var ddatetime = $("#date").val();
    var trs = $("#zhongkao_table tbody tr");
    var str;

    $(".zhongkao_preview .cont1 .title").html("一、" + zhongkao_weather_title);
    $(".zhongkao_preview .cont2 .title").html("二、" + zhongkao_detail_title);
    $(".zhongkao_preview .cont3 .title").html("三、" + zhongkao_suggest_title);

    $(".zhongkao_preview .cont1 p").html(zhongkao_weather_cont);

    var zhongkao_suggest = zhongkao_suggest.split(" ");
    $(".zhongkao_preview .cont3 p").eq(0).html(zhongkao_suggest[0]);
    $(".zhongkao_preview .cont3 p").eq(1).html(zhongkao_suggest[1]);
    $(".zhongkao_preview .cont3 p").eq(2).html(zhongkao_suggest[2]);

    $(".zhongkao_issueId").html(issueId);
    $(".release_time").html(ddatetime.split("-")[0] + "年" + ddatetime.split("-")[1] + "月" + ddatetime.split("-")[2] + "日发布");


    //添加表格数据
    str = "<tr><td rowspan='2'>6月25日</td><td>上午</td><td class='weather'><div style='width:100%;height:100%;'><label style='width:100%;'><img src='" + $(trs[0]).children().eq(2).children().children().eq(0).children()[0].src + "' /></label>" + $(trs[0]).children().eq(2).children().children().eq(1).val() + "</td><td>" + $(trs[0]).children().eq(3).children().val() + "</td><td rowspan='2'>" + $(trs[0]).children().eq(4).children().val() + "</td></tr>";
    str += "<tr><td>下午</td><td class='weather'><div style='width:100%;height:100%;'><label style='width:100%;'><img src='" + $(trs[1]).children().eq(1).children().children().eq(0).children()[0].src + "' /></label>" + $(trs[1]).children().eq(1).children().children().eq(1).val() + "</td><td>" + $(trs[1]).children().eq(2).children().val() + "</td></tr>";
    str += "<tr><td rowspan='2'>6月26日</td><td>上午</td><td class='weather'><div style='width:100%;height:100%;'><label style='width:100%;'><img src='" + $(trs[2]).children().eq(2).children().children().eq(0).children()[0].src + "' /></label>" + $(trs[2]).children().eq(2).children().children().eq(1).val() + "</td><td>" + $(trs[2]).children().eq(3).children().val() + "</td><td rowspan='2'>" + $(trs[2]).children().eq(4).children().val() + "</td></tr>";
    str += "<tr><td>下午</td><td class='weather'><div style='width:100%;height:100%;'><label style='width:100%;'><img src='" + $(trs[3]).children().eq(1).children().children().eq(0).children()[0].src + "' /></label>" + $(trs[3]).children().eq(1).children().children().eq(1).val() + "</td><td>" + $(trs[3]).children().eq(2).children().val() + "</td></tr>";
    str += "<tr><td rowspan='2'>6月27日</td><td>上午</td><td class='weather'><div style='width:100%;height:100%;'><label style='width:100%;'><img src='" + $(trs[4]).children().eq(2).children().children().eq(0).children()[0].src + "' /></label>" + $(trs[4]).children().eq(2).children().children().eq(1).val() + "</td><td>" + $(trs[4]).children().eq(3).children().val() + "</td><td rowspan='2'>" + $(trs[4]).children().eq(4).children().val() + "</td></tr>";
    str += "<tr><td>下午</td><td class='weather'><div style='width:100%;height:100%;'><label style='width:100%;'><img src='" + $(trs[5]).children().eq(1).children().children().eq(0).children()[0].src + "' /></label>" + $(trs[5]).children().eq(1).children().children().eq(1).val() + "</td><td>" + $(trs[5]).children().eq(2).children().val() + "</td></tr>";

    $(".zhongkaoInfo tbody").html(str);
}

//添加春节专报预览页面信息
function addPreviewInfo_spring() {
    var spring_weather_title = $(".spring_weather_trend div label").text();
    var spring_weather_cont = $("#spring_weather_trend").val();
    var spring_detail_title = $(".spring_weather_details div label").text();
    var spring_detail_cont = $("#spring_weather_details").val();
    var spring_table = $("#spring_table tbody").html();
    var trs = $("#spring_table tbody tr");
    var ddatetime = $("#date").val();
    var issueId = "1";
    var str = "";
    
    $(".spring_preview .cont1 .title").html("一、" + spring_weather_title);
    $(".spring_preview .cont2 .title").html("二、" + spring_detail_title);

    $(".spring_preview .cont1 p").html(spring_weather_cont);

    var spring_detail_cont = spring_detail_cont.split(" ");
    $(".spring_preview .cont2 p").eq(0).html(spring_detail_cont[0]);
    $(".spring_preview .cont2 p").eq(1).html(spring_detail_cont[1]);

    $(".releaseYear").html(ddatetime.split("-")[0]);
    $(".issueId").html(issueId);
    $(".release_time").html(ddatetime.split("-")[0] + "年" + ddatetime.split("-")[1] + "月" + ddatetime.split("-")[2]+"日发布");

    //添加表格数据
    for (var i = 0; i < $("#spring_table tbody tr").length; i++) {
        str += "<tr>";

        for (var j = 0; j < $("#spring_table tbody tr:first td").length; j++) {
            var val = $(trs[i]).children().eq(j).children();
            if (j == 1) {
                str += "<td><img style='display:inline-block;text-align:center' src='" + val.children().eq(0).children()[0].src + "' /><span style='width:100%;display:inline-block;text-align:center'>" + val.children().eq(2).val() + "</span></td>";
            } else {
                str += "<td>" + val.val() + "</td>";
            }
        }
        str += "</tr>";
    }
    $(".springInfo tbody").html(str);
}

//添加端午专报预览页面信息
function addPreviewInfo_duanwu() {
    var duanwu_weather_title = $(".duanwu_weather_trend div label").text();
    var duanwu_weather_cont = $("#duanwu_weather_trend").val();
    var duanwu_detail_title = $(".duanwu_weather_details div label").text();
    var duanwu_detail_cont = $("#duanwu_weather_details").val();
    var duanwu_table = $("#duanwu_table tbody").html();
    var ddatetime = $("#date").val();
    var trs = $("#duanwu_table tbody tr");
    var pic = $("#previewImg img")[0].src;
    var picDes = $("#previewImg input").val();
    var str = "";

    $(".duanwu_preview .cont1 .title").html("一、" + duanwu_weather_title);
    $(".duanwu_preview .cont2 .title").html("二、" + duanwu_detail_title);

    $(".duanwu_preview .cont1 p").html(duanwu_weather_cont);

    var duanwu_detail_cont = duanwu_detail_cont.split(" ");
    $(".duanwu_preview .cont2 p").eq(0).html(duanwu_detail_cont[0]);
    $(".duanwu_preview .cont2 p").eq(1).html(duanwu_detail_cont[1]);
    $(".duanwu_preview .cont2 p").eq(2).html(duanwu_detail_cont[2]);
    $(".duanwu_preview .cont2 p").eq(3).html(duanwu_detail_cont[3]);

    $(".subheading").html( "————"+$("#subhead").val() );
    $(".release_time").html(ddatetime.split("-")[0] + "年" + ddatetime.split("-")[1] + "月" + ddatetime.split("-")[2] + "日发布");


    //添加表格数据
    for (var i = 0; i < $("#duanwu_table tbody tr").length; i++) {
        str += "<tr>";
        for (var j = 0; j < $("#duanwu_table tbody tr:first td").length; j++) {
            var val = $(trs[i]).children().eq(j).children();
            if (j == 1) {
                str += "<td><img style='display:inline-block;text-align:center' src='" + val.children().eq(0).children()[0].src + "' /><span style='width:100%;display:inline-block;text-align:center'>" + val.children().eq(1).val() + "</span></td>";
            } else {
                str += "<td>" + val.val() + "</td>";
            }
        }
        str += "</tr>";
    }
    $(".duanwuInfo tbody").html(str);

    str = '<img src="' + pic + '" style="width:580px;margin-bottom:10px;"/><b>' + picDes + '</b>';
    $(".picDetails").html(str);
}



function backTo_edit() {
    $(".previewPage").css("display", "none");
    $(".editPage").css("display", "block");
}

//预览发布按钮验证预报员
function realase() {
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
                    var list = $("#ForecastZone ul li");
                    var val = list.children("button.active").text();

                    $(".forecaster").html($("#cbUser").val());

                    switch (val) {
                        case "国庆专报":
                            $(".national_preview").css("display", "block");
                            $(".national_preview").siblings().css("display", "none");
                            $(".back").css("display", "block");
                            addPreviewInfo_guoqing();
                            break;
                        case "高考专报":
                            $(".gaokao_preview").css("display", "block");
                            $(".gaokao_preview").siblings().css("display", "none");
                            $(".back").css("display", "block");
                            addPreviewInfo_gaokao();
                            break;
                        case "中考专报":
                            $(".zhongkao_preview").css("display", "block");
                            $(".zhongkao_preview").siblings().css("display", "none");
                            $(".back").css("display", "block");
                            addPreviewInfo_zhongkao();
                            break;
                        case "春节专报":
                            $(".spring_preview").css("display", "block");
                            $(".spring_preview").siblings().css("display", "none");
                            $(".back").css("display", "block");
                            addPreviewInfo_spring();
                            break;
                        case "端午专报":
                            $(".duanwu_preview").css("display", "block");
                            $(".duanwu_preview").siblings().css("display", "none");
                            $(".back").css("display", "block");
                            addPreviewInfo_duanwu();
                            break;
                        default:
                            break;
                    }

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


//可编辑表格聚焦
function input_focus(val) {
    //判断是否天空状况一栏
    if ($(val).parent().parent().hasClass("weather")) {
        $(val).parent().css("border", "1px solid green");
    } else {
        $(val).css("border", "1px solid green");
    }

}

//可编辑表格失焦
function input_blur(val) {
    //判断是否天空状况一栏
    if ($(val).parent().parent().hasClass("weather")) {
        $(val).parent().css("background", "#63b363");
    }
    $(val).parent().css("border", "1px solid #fff");
    $(val).css("border", "1px solid #63b363");
    $(val).css("background", "#63b363");
}


//表格 选择天气状况图标
function choose_img(pic) {
    $(".xuanfu").css("display", "block");
    imgWeather = $(pic).attr("id");

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

    if (dd[0] == 0) {
        dd = dd[1];
    }

    var yearStr = dict[yy[0]] + dict[yy[1]] + dict[yy[2]] + dict[yy[3]] + '年',
        monthStr = dict['' + Number(mm)] + '月',
        dayStr = dict[dd] + '日';
    var newtime = yearStr + monthStr + dayStr;
    return newtime;
}

//load方法
function loadpage() {
    load = layer.msg('加载中', {
        icon: 16
        , shade: 0.01
    });
}

