$(function () {
    init();
})

function init() {
    $(".navContent").eq(0).css("display", "none");
    $(".subNav").eq(0).removeClass("currentDt");
    $(".subNav").eq(1).addClass("currentDt");
    $(".navContent").eq(1).css("display", "block");
    $("#city_Forecast").addClass("hover");
    var date = new Date();
    var nowtime = date.format("yyyy-MM-dd");
    $("#date").val(nowtime);

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
    var date = new Date();
    var nowtime = date.format("yyyy-MM-dd");
    var datanew;
    var TBdatanew;
    var str = "";

    $.post("/WebService.asmx/getGovtDatas", {
        dateTime: nowtime
    }, function (msg) {
        if (msg.indexOf("+") > 0) {
            //将得到的两个json数据分离，分别转换格式
            datanew = msg.split("+")[0];
            TBdatanew = msg.split("+")[1];
            datanew = JSON.parse(datanew);
            TBdatanew = JSON.parse(TBdatanew);

            $("#date").val(nowtime);
            $("#cbUser").val(datanew.Forecaster);
            $("#early_weather").val(datanew.Early_weather);
            $("#haikou_weather").val(datanew.Haikou_weather);
            $("#suggestVal").val(datanew.SuggestVal);
            $("#farmpartVal").val(datanew.FarmpartVal);
            $("#trafficpartVal").val(datanew.FarmpartVal);

            for (var j = 0; j < 4; j++) {
                if (j == 0) {
                    str += "<tr><td></td>";
                } else if (j == 1) {
                    str += "<tr><td>天气状况</td>";
                } else if (j == 2) {
                    str += "<tr><td>气温</td>";
                } else if (j == 3) {
                    str += "<tr><td>风向风力</td>";
                }

                for (var i = 0; i < TBdatanew.Forecasttime.length; i++) {
                    if (j == 1) {
                        str += "<td class='weather'><div style='width:100%;height:100%;'><label><img id='oneday"+(i+1)+"-img1' class='Imghover' src='../Images/tq/" + TBdatanew.Weatherpic[i] + "' onclick='choose_img(this)' /></label><input type='text' value='" + TBdatanew.Weatherdes[i] + "' onblur='input_blur(this)' onfocus='input_focus(this)' style='height:25%;'/></div></td>";
                    } else if(j==0) {
                        str += "<td><input type='text' value='" + TBdatanew.Forecasttime[i] + "' onblur='input_blur(this)' onfocus='input_focus(this)' /></td>";
                    } else if (j == 2) {
                        str += "<td><input type='text' value='" + TBdatanew.Temperature[i] + "' onblur='input_blur(this)' onfocus='input_focus(this)' /></td>";
                    } else if (j == 3) {
                        str += "<td><input type='text' value='" + TBdatanew.Wind[i] + "' onblur='input_blur(this)' onfocus='input_focus(this)' /></td>";
                    }
                }
                str += "</tr>";
            }

            $(".haikouWeather_table").html(str);

        } else {
            $("#early_weather").html("&nbsp;&nbsp;上周，前期受弱冷空气和西南低压槽影响，以阴天间多云天气为主，后期受南支槽影响，阴天有阵雨，最低气温21-23℃，最高气温27-31℃。");
            $("#haikou_weather").html(" &nbsp;&nbsp;预计未来一周，前期以多云天气为主，后期有冷空气影响。20日-25日白天多云，其中22日-23日多云有阵雨，最高气温29-31℃，最低气温22-23℃；25日夜间-26日受冷空气影响，阴天有小阵雨，气温明显下降。 \n&nbsp;&nbsp;具体预报如下：");
            $("#suggestVal").html("&nbsp;&nbsp;25日夜间到26日，受冷空气影响，气温明显下降，多阴雨天气，局地可能出现雷雨大风等短时强对流天气，市民朋友出门需携带雨具，并注意及时增减衣服，另外，出行注意交通阻塞。");
            $("#trafficpartVal").html("&nbsp;&nbsp;后期多阴雨天气，路天路滑，能见度偏低，注意加强交通疏导。");
            $("#farmpartVal").html("&nbsp;&nbsp;及时晒田，控制无效分蘖。利用晴好天气及时采收成熟冬季瓜菜，避开后期降温和降雨带来的不利影响。");

            //表格添加默认内容
            str = "<tr><td></td><td><input type='text' value='3月20日' onblur='input_blur(this)' onfocus='input_focus(this)' /></td><td><input type='text' value='3月21日' onblur='input_blur(this)' onfocus='input_focus(this)' /></td><td><input type='text' value='3月22日' onblur='input_blur(this)' onfocus='input_focus(this)' /></td><td><input type='text' value='3月23日' onblur='input_blur(this)' onfocus='input_focus(this)' /></td><td><input type='text' value='3月24日' onblur='input_blur(this)' onfocus='input_focus(this)' /></td><td><input type='text' value='3月25日' onblur='input_blur(this)' onfocus='input_focus(this)' /></td><td><input type='text' value='3月26日' onblur='input_blur(this)' onfocus='input_focus(this)' /></td></tr>";
            str = str + "<tr><td>天空状况</td><td class='weather'><div style='width:100%;height:100%;'><label><img id='oneday1-img1' class='Imghover' src='../Images/tq/01.png' onclick='choose_img(this)' /></label><div class='pic' id='oneday1-img2'></div><input type='text' value='天气晴朗，阳光强烈' onblur='input_blur(this)' onfocus='input_focus(this)' style='height:25%;'/></div></td><td class='weather'><div style='width:100%;height:100%;'><label><img id='oneday2-img1' class='Imghover' src='../Images/tq/01.png' onclick='choose_img(this)' /></label><div class='pic' id='oneday2-img2'></div><input type='text' value='天气晴朗，阳光强烈' onblur='input_blur(this)' onfocus='input_focus(this)' style='height:25%;'/></div></td><td class='weather'><div style='width:100%;height:100%;'><label><img id='oneday3-img1' class='Imghover' src='../Images/tq/01.png' onclick='choose_img(this)' /></label><div class='pic' id='oneday3-img2'></div><input type='text' value='天气晴朗，阳光强烈' onblur='input_blur(this)' onfocus='input_focus(this)' style='height:25%;'/></div></td><td class='weather'><div style='width:100%;height:100%;'><label><img id='oneday4-img1' class='Imghover' src='../Images/tq/01.png' onclick='choose_img(this)' /></label><div class='pic' id='oneday4-img2'></div><input type='text' value='天气晴朗，阳光强烈' onblur='input_blur(this)' onfocus='input_focus(this)' style='height:25%;'/></div></td><td class='weather'><div style='width:100%;height:100%;'><label><img id='oneday5-img1' class='Imghover' src='../Images/tq/01.png' onclick='choose_img(this)' /></label><div class='pic' id='oneday5-img2'></div><input type='text' value='天气晴朗，阳光强烈' onblur='input_blur(this)' onfocus='input_focus(this)' style='height:25%;'/></div></td><td class='weather'><div style='width:100%;height:100%;'><label><img id='oneday6-img1' class='Imghover' src='../Images/tq/01.png' onclick='choose_img(this)' /></label><div class='pic' id='oneday6-img2'></div><input type='text' value='天气晴朗，阳光强烈' onblur='input_blur(this)' onfocus='input_focus(this)' style='height:25%;'/></div></td><td class='weather'><div style='width:100%;height:100%;'><label><img id='oneday7-img1' class='Imghover' src='../Images/tq/01.png' onclick='choose_img(this)' /></label><div class='pic' id='oneday7-img2'></div><input type='text' value='天气晴朗，阳光强烈' onblur='input_blur(this)' onfocus='input_focus(this)' style='height:25%;'/></div></td></tr>";
            str = str + "<tr><td>气温</td><td><input type='text' value='22-30℃' onblur='input_blur(this)' onfocus='input_focus(this)' /></td><td><input type='text' value='22-30℃' onblur='input_blur(this)' onfocus='input_focus(this)' /></td><td><input type='text' value='22-30℃' onblur='input_blur(this)' onfocus='input_focus(this)' /></td><td><input type='text' value='22-30℃' onblur='input_blur(this)' onfocus='input_focus(this)' /></td><td><input type='text' value='22-30℃' onblur='input_blur(this)' onfocus='input_focus(this)' /></td><td><input type='text' value='22-30℃' onblur='input_blur(this)' onfocus='input_focus(this)' /></td><td><input type='text' value='22-30℃' onblur='input_blur(this)' onfocus='input_focus(this)' /></td></tr>";
            str = str + "<tr><td>风向风力</td><td><input type='text' value='东南风3-4级' onblur='input_blur(this)' onfocus='input_focus(this)' /></td><td><input type='text' value='东南风3-4级' onblur='input_blur(this)' onfocus='input_focus(this)' /></td><td><input type='text' value='东南风3-4级' onblur='input_blur(this)' onfocus='input_focus(this)' /></td><td><input type='text' value='东南风3-4级' onblur='input_blur(this)' onfocus='input_focus(this)' /></td><td><input type='text' value='东南风3-4级' onblur='input_blur(this)' onfocus='input_focus(this)' /></td><td><input type='text' value='东南风3-4级' onblur='input_blur(this)' onfocus='input_focus(this)' /></td><td><input type='text' value='东南风3-4级' onblur='input_blur(this)' onfocus='input_focus(this)' /></td></tr>";

            $(".haikouWeather_table").html(str);
        }
    })
}

//发布
function releaseReport() {
    var ddatetime = $("#date").val();
    var forecaster = $("#cbUser").val();
    var early_weather = $("#early_weather").val();
    var haikou_weather = $("#haikou_weather").val();
    var suggestVal = $("#suggestVal").val();
    var farmpartVal = $("#farmpartVal").val();
    var trafficpartVal = $("#trafficpartVal").val();
    var trs = $(".haikouWeather_table tbody tr");
    var issueid = "1";

    //当前报文信息
    var GovtInfo = new Array();
    GovtInfo[0] = ddatetime;
    GovtInfo[1] = forecaster;
    GovtInfo[2] = early_weather;
    GovtInfo[3] = haikou_weather;
    GovtInfo[4] = suggestVal;
    GovtInfo[5] = trafficpartVal;
    GovtInfo[6] = farmpartVal;

    var forecasttime = new Array();
    var weatherdes = new Array();
    var weatherpic = new Array();
    var temperature = new Array();
    var wind = new Array();
    var GovtTBInfo = new Array();   //表格模型

    for (var i = 0; i < trs.length; i++) {
        for (var j = 1; j < $(".haikouWeather_table tbody tr:last-child td").length; j++) {
            var val = $(trs[i]).children().eq(j).children();

            switch (i) {
                case 0:
                    forecasttime.push( val.val() );
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

    //保存政府专报数据到模型，方便其他函数调用-关键
    $.post("/WebService.asmx/SaveGovtForecastData", {
        GovtInfo: JSON.stringify(GovtInfo),
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
        $.post("/WebService.asmx/insertGovtSaveDate", {
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

function addPreviewInfo() {
    var early_weather_title = $(".early_weather div label").text();
    var early_weather_cont = $("#early_weather").val();
    var haikou_weather_title = $(".haikou_weather div label").text();
    var haikou_weather_cont = $("#haikou_weather").val();
    var haikouWeather_table = $(".haikouWeather_table tbody").html();
    var suggestVal = $("#suggestVal").val();
    var trafficpartVal = $("#trafficpartVal").val();
    var farmpartVal = $("#farmpartVal").val();
    var issueid = "1";
    var str = "";
    var trs = $(".haikouWeather_table tbody tr");

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

                    $(".cont1 .title").html("一、" + early_weather_title);
                    $(".cont2 .title").html("二、" + haikou_weather_title);
                    $(".cont3 .title").html("三、防御建议");

                    $(".cont1 p").html(early_weather_cont);

                    haikou_weather_cont = haikou_weather_cont.split(" ");
                    $(".cont2 p").eq(0).html(haikou_weather_cont[1]);
                    $(".cont2 span").eq(1).html(haikou_weather_cont[2]);

                    $(".cont3 p").eq(0).html(suggestVal);
                    $(".cont3 p").eq(1).html("<b>交通方面：</b>" + trafficpartVal);
                    $(".cont3 p").eq(2).html("<b>农业方面：</b>" + farmpartVal);

                    $(".release_time").html(dateconvert($("#date").val()));
                    $(".releaseYear").html($("#date").val().split("-")[0]);
                    $(".issueid").html(issueid);

                    //添加表格数据
                    for (var i = 0; i < $(".haikouWeather_table tbody tr").length; i++) {
                        if (i == 0) {
                            str += "<tr><td></td>";
                        } else if (i == 1) {
                            str += "<tr><td>天气状况</td>";
                        } else if (i == 2) {
                            str += "<tr><td>气温</td>";
                        } else if (i == 3) {
                            str += "<tr><td>风向风力</td>";
                        }

                        for (var j = 1; j < $(".haikouWeather_table tbody tr:last-child td").length; j++) {
                            var val = $(trs[i]).children().eq(j).children();
                            if (i == 1) {
                                str += "<td><img style='display:inline-block;' src='" + val.children().eq(0).children()[0].src + "' /><span style='text-indent:0;margin:0;font-size:12px;'>" + val.children().eq(1).val() + "</span></td>";
                            } else {
                                str += "<td>" + val.val() + "</td>";
                            }
                        }
                        str += "</tr>";
                    }
                    $(".table_info").html(str);

                    $(".time").html($(trs[0]).children().eq(1).children().val() + "~" + $(trs[0]).children().eq(7).children().val());

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