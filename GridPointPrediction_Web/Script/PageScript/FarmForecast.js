
$(function () {
    init();

})

function init() {
    $(".navContent").eq(0).css("display", "none");
    $(".subNav").eq(0).removeClass("currentDt");
    $(".subNav").eq(1).addClass("currentDt");
    $(".navContent").eq(1).css("display", "block");
    $("#farm_Forecast").addClass("hover");

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

//获取数据
function loadDatas() {
    var nowtime = $("#date").val() + " " + selectHour + ":00:00";
    var datanew;
    var TBdatanew;
    var str = "";
    var time;

    $.post("/WebService.asmx/getFarmDatas", {
        dateTime: nowtime
    }, function (msg) {
        if (msg.indexOf("#") > 0) {
            //将得到的两个json数据分离，分别转换格式
            datanew = msg.split("#")[0];
            TBdatanew = msg.split("#")[1];
            datanew = JSON.parse(datanew);
            TBdatanew = JSON.parse(TBdatanew);

            $("#cbUser").val(datanew.Forecaster);
            $("#weather_situation").val(datanew.Early_weather);
            $("#haikou_weather").val(datanew.Haikou_weather);
            $("#lizhiVal").val(datanew.LizhiVal);
            $("#vegetablesVal").val(datanew.VegetablesVal);
            $("#shuidaoVal").val(datanew.ShuidaoVal);
            $("#top ul li button").removeClass("active");
            $("#button" + selectHour + "").addClass("active");

            for (var i = 0; i < TBdatanew.Forecasttime.length; i++) {
                str += "<tr><td><input type='text' value='" + TBdatanew.Forecasttime[i] + "' onblur='input_blur(this)' onfocus='input_focus(this)' /></td><td class='weather'><div style='width:100%;height:100%;'><label><img id='guoqinoneday" + (i + 1) + "-img1' class='Imghover' src='../Images/tq/" + TBdatanew.Weatherpic[i] + "' onclick='choose_img(this)' /></label><input type='text' value='" + TBdatanew.Weatherdes[i] + "' onblur='input_blur(this)' onfocus='input_focus(this)' style='height:25%;'/></div></td><td><input type='text' value='" + TBdatanew.Temperature[i] + "' onblur='input_blur(this)' onfocus='input_focus(this)' /></td><td><input type='text' value='" + TBdatanew.Wind[i] + "' onblur='input_blur(this)' onfocus='input_focus(this)' /></td></tr>";
            }
            $("#haikouWeather_table tbody").html(str);



        } else {
            $("#weather_situation").html("&nbsp;&nbsp;上周（4月3-9日）主要受变暖高压脊和西南低压槽影响，以晴好天气为主，最高气温33.0℃（甲子镇）-36.8℃（西海岸观海台），最低气温16.1℃（旧州镇）-21.5℃（西海岸观海台）；全市雨量0.1毫米-1.6毫米。");
            $("#haikou_weather").html("&nbsp;&nbsp;预计，本周主要受西南低压槽、低层切变线和弱冷空气影响，10日晴间多云，11-13日多云有雷阵雨，14-16日以晴好天气为主，最高气温逐渐回升至33℃-34℃。  \n&nbsp;&nbsp;具体预报如下：");
            $("#lizhiVal").html("&nbsp;&nbsp;本周我市荔枝主要工作是防虫防病：\n&nbsp;&nbsp;1、虫害防治，主要防治蒂蛀虫，兼治卷叶蛾、蝽蟓等害虫。药剂可选择灭百可+素死蜱或功夫+甲维盐阿维菌素；\n&nbsp;&nbsp;2、病害防治，主要防治炭疽病，药剂可选择百泰、阿米妙收或扬彩等；\n&nbsp;&nbsp;3、叶面补充叶面肥。");
            $("#vegetablesVal").html("&nbsp;&nbsp;蔬菜管理应注意: \n&nbsp;&nbsp;①高温时采取降温措施,露天蔬菜要遮荫，大棚蔬菜注意通风降温。\n&nbsp;&nbsp;②雨天时叶菜种植地要排除积水,防止沤根。\n&nbsp;&nbsp;③及时采收。");
            $("#shuidaoVal").html("&nbsp;&nbsp;目前，我市水稻主要处于分蘖-拔节期，未来一周天气形势对水稻生长有利，请继续做好稻田管理工作即可。此外，对于一些杂草较多或虫害较多的田块，建议采取一些措施进行有效处理");
            $("#top ul li button").removeClass("active");
            $("#button08").addClass("active");

            //表格添加默认内容
            str = "<tr><td><input type='text' value='5月22日' onblur='input_blur(this)' onfocus='input_focus(this)' /></td><td class='weather'><div style='width:100%;height:100%;'><label><img id='oneday1-img1' class='Imghover' src='../Images/tq/01.png' onclick='choose_img(this)' /></label><input type='text' value='天气晴朗，阳光强烈' onblur='input_blur(this)' onfocus='input_focus(this)' style='height:25%;'/></div></td><td><input type='text' value='25-33℃' onblur='input_blur(this)' onfocus='input_focus(this)' /></td><td><input type='text' value='东南风3-4级' onblur='input_blur(this)' onfocus='input_focus(this)' /></td></tr>";
            str = str + "<tr><td><input type='text' value='5月23日' onblur='input_blur(this)' onfocus='input_focus(this)' /></td><td class='weather'><div style='width:100%;height:100%;'><label><img id='oneday2-img1' class='Imghover' src='../Images/tq/01.png' onclick='choose_img(this)' /></label><input type='text' value='天气晴朗，阳光强烈' onblur='input_blur(this)' onfocus='input_focus(this)' style='height:25%;'/></div></td><td><input type='text' value='25-33℃' onblur='input_blur(this)' onfocus='input_focus(this)' /></td><td><input type='text' value='东南风3-4级' onblur='input_blur(this)' onfocus='input_focus(this)' /></td></tr>";
            str = str + "<tr><td><input type='text' value='5月24日' onblur='input_blur(this)' onfocus='input_focus(this)' /></td><td class='weather'><div style='width:100%;height:100%;'><label><img id='oneday3-img1' class='Imghover' src='../Images/tq/01.png' onclick='choose_img(this)' /></label><input type='text' value='天气晴朗，阳光强烈' onblur='input_blur(this)' onfocus='input_focus(this)' style='height:25%;'/></div></td><td><input type='text' value='25-33℃' onblur='input_blur(this)' onfocus='input_focus(this)' /></td><td><input type='text' value='东南风3-4级' onblur='input_blur(this)' onfocus='input_focus(this)' /></td></tr>";
            str = str + "<tr><td><input type='text' value='5月25日' onblur='input_blur(this)' onfocus='input_focus(this)' /></td><td class='weather'><div style='width:100%;height:100%;'><label><img id='oneday4-img1' class='Imghover' src='../Images/tq/01.png' onclick='choose_img(this)' /></label><input type='text' value='天气晴朗，阳光强烈' onblur='input_blur(this)' onfocus='input_focus(this)' style='height:25%;'/></div></td><td><input type='text' value='25-33℃' onblur='input_blur(this)' onfocus='input_focus(this)' /></td><td><input type='text' value='东南风3-4级' onblur='input_blur(this)' onfocus='input_focus(this)' /></td></tr>";
            str = str + "<tr><td><input type='text' value='5月26日' onblur='input_blur(this)' onfocus='input_focus(this)' /></td><td class='weather'><div style='width:100%;height:100%;'><label><img id='oneday5-img1' class='Imghover' src='../Images/tq/01.png' onclick='choose_img(this)' /></label><input type='text' value='天气晴朗，阳光强烈' onblur='input_blur(this)' onfocus='input_focus(this)' style='height:25%;'/></div></td><td><input type='text' value='25-33℃' onblur='input_blur(this)' onfocus='input_focus(this)' /></td><td><input type='text' value='东南风3-4级' onblur='input_blur(this)' onfocus='input_focus(this)' /></td></tr>";
            str = str + "<tr><td><input type='text' value='5月27日' onblur='input_blur(this)' onfocus='input_focus(this)' /></td><td class='weather'><div style='width:100%;height:100%;'><label><img id='oneday6-img1' class='Imghover' src='../Images/tq/01.png' onclick='choose_img(this)' /></label><input type='text' value='天气晴朗，阳光强烈' onblur='input_blur(this)' onfocus='input_focus(this)' style='height:25%;'/></div></td><td><input type='text' value='25-33℃' onblur='input_blur(this)' onfocus='input_focus(this)' /></td><td><input type='text' value='东南风3-4级' onblur='input_blur(this)' onfocus='input_focus(this)' /></td></tr>";
            str = str + "<tr><td><input type='text' value='5月28日' onblur='input_blur(this)' onfocus='input_focus(this)' /></td><td class='weather'><div style='width:100%;height:100%;'><label><img id='oneday7-img1' class='Imghover' src='../Images/tq/01.png' onclick='choose_img(this)' /></label><input type='text' value='天气晴朗，阳光强烈' onblur='input_blur(this)' onfocus='input_focus(this)' style='height:25%;'/></div></td><td><input type='text' value='25-33℃' onblur='input_blur(this)' onfocus='input_focus(this)' /></td><td><input type='text' value='东南风3-4级' onblur='input_blur(this)' onfocus='input_focus(this)' /></td></tr>";

            $("#haikouWeather_table tbody").html(str);
        }
    })
}

//发布
function releaseReport() {
    var selectHour = $(".selectHour li button.active")[0].innerHTML;
    var ddatetime = $("#date").val() + " " + selectHour;
    var forecaster = $("#cbUser").val();
    var weather_situation = $("#weather_situation").val();
    var haikou_weather = $("#haikou_weather").val();
    var lizhiVal = $("#lizhiVal").val();
    var vegetablesVal = $("#vegetablesVal").val();
    var shuidaoVal = $("#shuidaoVal").val();
    var trs = $("#haikouWeather_table tbody tr");

    //当前报文信息
    var FarmInfo = new Array();
    FarmInfo[0] = ddatetime;
    FarmInfo[1] = forecaster;
    FarmInfo[2] = weather_situation;
    FarmInfo[3] = haikou_weather;
    FarmInfo[4] = lizhiVal;
    FarmInfo[5] = vegetablesVal;
    FarmInfo[6] = shuidaoVal;

    var forecasttime = new Array();
    var weatherdes = new Array();
    var weatherpic = new Array();
    var temperature = new Array();
    var wind = new Array();
    var FarmTbInfo = new Array();   //表格模型

    for (var i = 0; i < $("#haikouWeather_table tbody tr").length; i++) {
        for (var j = 0; j < $("#haikouWeather_table tbody tr:first td").length; j++) {
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

    //保存农业专报数据到模型，方便其他函数调用-关键
    $.post("/WebService.asmx/SaveFarmForecastData", {
        FarmInfo: JSON.stringify(FarmInfo),
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
        $.post("/WebService.asmx/insertFarmSaveDate", {
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

function backTo_edit() {
    $(".previewPage").css("display", "none");
    $(".editPage").css("display", "block");
}

function realase() {
    addPreviewInfo();
}

function addPreviewInfo() {
    var weather_situation_title = $(".weather_situation div label").text();
    var weather_situation_cont = $("#weather_situation").val();
    var haikou_weather_title = $(".haikou_weather div label").text();
    var haikou_weather_cont = $("#haikou_weather").val();
    var haikouWeather_table = $("#haikouWeather_table tbody").html();
    var lizhiVal = $("#lizhiVal").val();
    var vegetablesVal = $("#vegetablesVal").val();
    var shuidaoVal = $("#shuidaoVal").val();
    var issueId = "1";
    var trs = $("#haikouWeather_table tbody tr");
    var str = "";

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
                    $(".releaseYear").html($("#date").val().split("-")[0]);
                    $(".issueId").html(issueId);
                    $(".release_time").html($("#date").val().split("-")[0] + "年" + $("#date").val().split("-")[1].split("-")[0] + "月" + $("#date").val().split("-")[2] + "日");
                    $(".cont1 .title").html("一、" + weather_situation_title);
                    $(".cont2 .title").html("二、" + haikou_weather_title);
                    $(".cont3 .title").html("三、农事建议");

                    $(".cont1 p").html(weather_situation_cont);

                    haikou_weather_cont = haikou_weather_cont.split(" ");
                    $(".cont2 p").eq(0).html(haikou_weather_cont[0]);
                    $(".cont2 p").eq(1).html(haikou_weather_cont[2]);

                    vegetablesVal = vegetablesVal.split(" ");

                    $(".cont3 b").eq(0).html("（一）荔枝");
                    $(".cont3 p").eq(0).html(lizhiVal);
                    $(".cont3 b").eq(1).html("（二）瓜菜");
                    $(".cont3 p").eq(1).html(vegetablesVal[0]);
                    $(".cont3 p").eq(2).html(vegetablesVal[1].split("。")[0] + "。");
                    $(".cont3 p").eq(3).html(vegetablesVal[1].split("。")[1] + "。");
                    $(".cont3 p").eq(4).html(vegetablesVal[1].split("。")[2] + "。");
                    $(".cont3 b").eq(2).html("（三）水稻");
                    $(".cont3 p").eq(5).html(shuidaoVal);


                    //添加表格数据
                    for (var i = 0; i < $("#haikouWeather_table tbody tr").length; i++) {
                        str += "<tr>";

                        for (var j = 0; j < $("#haikouWeather_table tbody tr:first td").length; j++) {
                            var val = $(trs[i]).children().eq(j).children();
                            if (j == 1) {
                                str += "<td><img style='display:inline-block;text-align:center' src='" + val.children().eq(0).children()[0].src + "' /><span style='width:100%;display:inline-block;text-align:center'>" + val.children().eq(1).val() + "</span></td>";
                            } else {
                                str += "<td>" + val.val() + "</td>";
                            }
                        }
                        str += "</tr>";
                    }
                    $(".haikouWeather_info tbody").html(str);

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

//load方法
function loadpage() {
    load = layer.msg('加载中', {
        icon: 16
        , shade: 0.01
    });
}