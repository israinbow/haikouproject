// 对Date的扩展，将 Date 转化为指定格式的String   
// 月(M)、日(d)、小时(h)、分(m)、秒(s)、季度(q) 可以用 1-2 个占位符，   
// 年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字)   
// 例子：   
// (new Date()).Format("yyyy-MM-dd hh:mm:ss.S") ==> 2006-07-02 08:09:04.423
// (new Date()).Format("yyyy-M-d h:m:s.S")      ==> 2006-7-2 8:9:4.18
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
        if (handle instanceof Function) postJson.success = function (json) {
            handle(typeof json.d == "undefined" ? json : json.d);
        };
        else {
            if (handle.success != undefined) {
                if (handle.context == undefined) postJson.success = function (json) {
                    handle.success(typeof json.d == "undefined" ? json : json.d);
                };
                else postJson.success = function (json) { handle.success.call(handle.context, typeof json.d == "undefined" ? json : json.d); };
            }
            if (handle.error != undefined && handle.context == undefined)
                postJson.error = handle.error;
            postJson.async = handle.async != false;
        } $.ajax(postJson);
    },
    alertError: function (err) {
        var errorMessage = "";
        if (typeof (err.responseJSON) != "undefined") {
            errorMessage = err.responseJSON.Message;
        } else {
            var temp = /\<title\>(.*)\<\/title\>/.exec(err.responseText);
            if (temp != null) errorMessage = temp[1];
        }
        if (errorMessage == "")
            errorMessage = err.responseText.replace(/^\s+/g, '');
        if (errorMessage != "")
            alert(errorMessage);
    }
};

var daytype;
var datestart;
var dateend;
//load方法
function loadpage() {
    load = layer.msg('加载中......', {
        icon: 16
        , shade: 0.01
        , time: 0
    });
}
$(function () {
    date = new Date();
    date.addDays(-11);
    $("#dateend").val(date.format("yyyy-MM-dd"));
    datestart = $("#datestart").val();
    date.addDays(-1);

    $("#datestart").val(date.format("yyyy-MM-dd"));
    datestart = $("#datestart").val();
    dateend = $("#dateend").val();
    //加载准确率评分数据
    rightFun("day");
    //检验评分二级菜单点击事件
    $(".menu_list ul li").click(function () {
        var id = this.id;
        $("#yubaoDate").css("display", "none");
        $("#rightDate").css("display", "none");
        $("#jiqiao").css("display", "none");
        $("#yaosu").css("display", "none");
        $("#jiangyu").css("display", "none");
        $("#gedian").css("display", "none");
        $("#Yubaotable").css("display", "none");

        $("#tablePf").html("");
        $("#SDMonth").html("");
        $("#SDtemp").html("");
        $("#DivShow").html("");
        //改变按钮选中效果
        $(".menu_list ul li").removeClass("hover");
        $("#" + id).addClass("hover");

        switch (id) {
            case "btn01":
                $("#Draw1").css("display", "block");
                $("#Draw2").css("display", "none");
                $("#rightDate").css("display", "block");
                $("#tablePf").css("display", "block");
                daytype = "day";
                rightFun(daytype);
                break;
            case "btn02":
                $("#Draw1").css("display", "none");
                $("#Draw2").css("display", "block");
                $("#jiqiao").css("display", "block");
                $("#tablePf").css("display", "block");
                technologeFun();
                break;
            case "btn03":
                $("#Draw1").css("display", "none");
                $("#Draw2").css("display", "block");
                $("#yaosu").css("display", "block");
                $("#tablePf").css("display", "block");
                mainElementFun();
                break;
            case "btn04":
                $("#Draw1").css("display", "none");
                $("#Draw2").css("display", "block");
                $("#jiangyu").css("display", "block");
                $("#tablePf").css("display", "block");
                rainFun();
                break;
            case "btn05":
                $("#Draw1").css("display", "none");
                $("#Draw2").css("display", "block");
                $("#gedian").css("display", "block");
                $("#tablePf").css("display", "block");
                tableFun();
                break;
            case "btn06":
                $("#Draw1").css("display", "block");
                $("#Draw2").css("display", "none");
                $("#yubaoDate").css("display", "block");
                $("#Yubaotable").css("display", "block");
                $("#tablePf").css("display", "none");
                daytype = "day";
                YuBaotable(daytype);
                break;
        }
    });
    //准确率评分，日，月，季，年评分切换按钮点击事件
    $(".precisionRate ul li button").click(function () {
        $(".precisionRate ul li button").removeClass("active");
        $("#" + this.id).addClass("active");
        var value = "day";
        var time = new Date();
        var year = "";
        switch (this.id) {
            case "dayScore":
                value = "day";
                $("#yearDay").css("display", "block");
                $("#yearSeason").css("display", "none");
                $("#yearMonth").css("display", "none");
                $("#yearDiv").css("display", "none");
                break;
            case "monthScore":
                value = "month";
                $("#yearMonthChoise").html("");
                $("#yearDay").css("display", "none");
                $("#yearMonth").css("display", "block");
                $("#yearSeason").css("display", "none");
                $("#yearDiv").css("display", "none");
                for (var i = 0; i < 10; i++) {
                    year += "<option>" + (time.getFullYear() - i) + "</option>";
                }

                $("#yearMonthChoise").append(year);
                break;
            case "seasonScore":
                value = "season";
                $("#yearMonth").css("display", "none");
                $("#yearDay").css("display", "none");
                $("#yearSeason").css("display", "block");
                $("#yearDiv").css("display", "none");
                for (var i = 0; i < 10; i++) {
                    year += "<option>" + (time.getFullYear() - i) + "</option>";
                }
                $("#yearSeasonChoise").append(year);
                break;
            case "yearScore":
                value = "year";
                $("#yearDiv").css("display", "block");
                $("#yearDay").css("display", "none");
                $("#yearSeason").css("display", "none");
                $("#yearMonth").css("display", "none");
                for (var i = 0; i < 10; i++) {
                    year += "<option>" + (time.getFullYear() - i) + "</option>";
                }
                $("#yearil").append(year);
                break;
        }
        dataType = value;
        rightFun(value);
    });
    //预报评分，日，月，季，年评分切换按钮点击事件
    $(".forcastScore ul li button").click(function () {
        $(".forcastScore ul li button").removeClass("active");
        $("#" + this.id).addClass("active");
        var value = "day";
        var time = new Date();
        var year = "";
        switch (this.id) {
            case "dayScore2":
                value = "day";
                $("#yeartime").css("display", "block");
                $("#yearSeason2").css("display", "none");
                $("#yearMonth2").css("display", "none");
                $("#yearDiv2").css("display", "none");
                break;
            case "monthScore2":
                value = "month";
                $("#yearMonthChoise2").html("");
                $("#yeartime").css("display", "none");
                $("#yearMonth2").css("display", "block");
                $("#yearSeason2").css("display", "none");
                $("#yearDiv2").css("display", "none");
                for (var i = 0; i < 10; i++) {
                    year += "<option>" + (time.getFullYear() - i) + "</option>";
                }

                $("#yearMonthChoise2").append(year);
                break;
            case "seasonScore2":
                value = "season";
                $("#yearMonth2").css("display", "none");
                $("#yeartime").css("display", "none");
                $("#yearSeason2").css("display", "block");
                $("#yearDiv2").css("display", "none");
                for (var i = 0; i < 10; i++) {
                    year += "<option>" + (time.getFullYear() - i) + "</option>";
                }
                $("#yearSeasonChoise2").append(year);
                break;
            case "yearScore2":
                value = "year";
                $("#yearDiv2").css("display", "block");
                $("#yeartime").css("display", "none");
                $("#yearSeason2").css("display", "none");
                $("#yearMonth2").css("display", "none");
                for (var i = 0; i < 10; i++) {
                    year += "<option>" + (time.getFullYear() - i) + "</option>";
                }
                $("#yearil2").append(year);
                break;
        }
        dataType = value;
        YuBaotable(value);
    });
})
var rainTime1, rainTime2;
tableSelect = function () {
    rainTime1 = $("#Text5").val();
    rainTime2 = $("#Text6").val();
    raindoload();
}
tableFun = function () {
    var date1 = new Date();
    date1.addDays(-1);
    $("#Text6").val(date1.format("yyyy-MM-dd"));
    date1.addDays(-1);
    $("#Text5").val(date1.format("yyyy-MM-dd"));
    rainTime1 = $("#Text5").val();
    rainTime2 = $("#Text6").val();
    tabledoload();
}
tabledoload = function () {
    var table = "";
    var name = new Array;
    var mintemp = new Array;
    var maxtemp = new Array;
    var rain = new Array;
    var bigrain = new Array;

    $.post('/WebService.asmx/GetScoreRainGrade', {
        dtStart: rainTime1,
        dtEnd: rainTime2
    }, function (data, textStatus, xhr) {
        var msg = JSON.parse(data);
        table += "<table style='border-collapse: collapse;'><th class='tablename'>时次</th><th class='tablename'>小雨准确率%</th><th class='tablename'>中雨准确率%</th><th class='tablename'>大雨准确率%</th><th class='tablename'>暴雨准确率%</th>";
        if (msg != undefined & msg != "") {
            for (var i = 0; i < msg.length; i++) {
                table += "<tr><th class='tablename1'>" + msg[i].ScoreName + "</th><th class='tablename1'>" + msg[i].Score3 + "</th><th class='tablename1'>" + msg[i].Score1 + "</th><th class='tablename1'>" + msg[i].Score2 + "</th><th class='tablename1'>" + msg[i].ScoreRain + "</th></tr>";
                name[i] = msg[i].ScoreName;
                maxtemp[i] = parseFloat(msg[i].Score3);
                mintemp[i] = parseFloat(msg[i].Score1);
                rain[i] = parseFloat(msg[i].Score2);
                bigrain[i] = msg[i].ScoreRain;
            }
            $("#tablePf").html("");
            $("#tablePf").append(table);
            HCP.HCM.MHisData = bigrain;
            HCP.HCM.MNowData = rain;
            HCP.HCM.name1 = name;
            HCP.HCM.mintemp = mintemp;
            HCP.HCM.maxtemp = maxtemp;
        } else {

        }
        $("#tablePf").html("");
        $("#tablePf").append(table);
    });
}

var rainTime1, rainTime2;
rainSelect = function () {
    rainTime1 = $("#Text5").val();
    rainTime2 = $("#Text6").val();
    raindoload();
}
rainFun = function () {
    var date1 = new Date();
    date1.addDays(-1);
    $("#Text6").val(date1.format("yyyy-MM-dd"));
    date1.addDays(-1);
    $("#Text5").val(date1.format("yyyy-MM-dd"));
    rainTime1 = $("#Text5").val();
    rainTime2 = $("#Text6").val();
    raindoload();
}
raindoload = function () {
    var table = "";
    var name = new Array;
    var mintemp = new Array;
    var maxtemp = new Array;
    var rain = new Array;
    var bigrain = new Array;
    $.post('/WebService.asmx/GetScoreRainGrade', {
        dtStart: rainTime1,
        dtEnd: rainTime2
    }, function (data, textStatus, xhr) {
        var msg = JSON.parse(data);
        table += "<table style='border-collapse: collapse;'><th class='tablename'>时次</th><th class='tablename'>小雨准确率%</th><th class='tablename'>中雨准确率%</th><th class='tablename'>大雨准确率%</th><th class='tablename'>暴雨准确率%</th>";
        if (msg != undefined & msg != "") {
            for (var i = 0; i < msg.length; i++) {
                table += "<tr><th class='tablename1'>" + msg[i].ScoreName + "</th><th class='tablename1'>" + msg[i].Score3 + "</th><th class='tablename1'>" + msg[i].Score1 + "</th><th class='tablename1'>" + msg[i].Score2 + "</th><th class='tablename1'>" + msg[i].ScoreRain + "</th></tr>";
                name[i] = msg[i].ScoreName;
                maxtemp[i] = parseFloat(msg[i].Score3);
                mintemp[i] = parseFloat(msg[i].Score1);
                rain[i] = parseFloat(msg[i].Score2);
                bigrain[i] = msg[i].ScoreRain;
            }
            $("#tablePf").html("");
            $("#tablePf").append(table);
            HCP.HCM.MHisData = bigrain;
            HCP.HCM.MNowData = rain;
            HCP.HCM.name1 = name;
            HCP.HCM.mintemp = mintemp;
            HCP.HCM.maxtemp = maxtemp;

        } else {

        }
        $("#tablePf").html("");
        $("#tablePf").append(table);
    });
}

var EleTime1, EleTime2;
ElementSelect = function () {
    EleTime1 = $("#Text3").val();
    EleTime2 = $("#Text4").val();
    eledoload();
}
//加载要素评分
mainElementFun = function () {
    var date1 = new Date();
    date1.addDays(-1);
    $("#Text4").val(date1.format("yyyy-MM-dd"));
    date1.addDays(-1);
    $("#Text3").val(date1.format("yyyy-MM-dd"));
    EleTime1 = $("#Text3").val();
    EleTime2 = $("#Text4").val();
    eledoload();
}
//获取和加载要素评分数据
eledoload = function () {
    var table = "";
    var name = new Array;
    var mintemp = new Array;
    var maxtemp = new Array;
    var rain = new Array;
    var bigrain = new Array;
    $.post('/WebService.asmx/Get6HourScoreTotal', {
        dtStart: EleTime1,
        dtEnd: EleTime2
    }, function (data, textStatus, xhr) {
        var msg = JSON.parse(data);
        table += "<table style='border-collapse: collapse;'><th class='tablename'>名称</th><th class='tablename'>24小时晴雨准确率%</th><th class='tablename'>24小时最高气温绝对误差</th><th class='tablename'>24小时最低气温绝对误差</th><th class='tablename'>24小时暴雨以上降水TS评分</th>";
        if (msg != undefined & msg != "") {
            for (var i = 0; i < msg.length; i++) {
                table += "<tr><th class='tablename1'>" + msg[i].ScoreName + "</th><th class='tablename1'>" + msg[i].Score3 + "</th><th class='tablename1'>" + msg[i].Score1 + "</th><th class='tablename1'>" + msg[i].Score2 + "</th><th class='tablename1'>" + msg[i].ScoreRain + "</th></tr>";
                name[i] = msg[i].ScoreName;
                maxtemp[i] = parseFloat(msg[i].Score3);
                mintemp[i] = parseFloat(msg[i].Score1);
                rain[i] = parseFloat(msg[i].Score2);
                bigrain[i] = msg[i].ScoreRain;
            }
            HCP.HCM.MHisData = bigrain;
            HCP.HCM.MNowData = rain;
            HCP.HCM.name1 = name;
            HCP.HCM.mintemp = mintemp;
            HCP.HCM.maxtemp = maxtemp;

            $("#tablePf").html("");
            $("#tablePf").append(table);
            Elementshow();
        } else {

        }
    });
}
//要素评分-将数据填充到图标
Elementshow = function () {
    $('#DivShow').highcharts({
        chart: {
            type: 'column'
        },
        title: {
            text: '要素评分'
        },
        subtitle: {
            text: ''
        },
        xAxis: {
            categories: HCP.HCM.name1,
            crosshair: true
        },
        yAxis: {
            min: 0,
            max: 100,
            title: {
                text: '要素 (%)'
            }
        },
        tooltip: {
            headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
            pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' + '<td style="padding:0"><b>{point.y:.1f} %</b></td></tr>',
            footerFormat: '</table>',
            shared: true,
            useHTML: true
        },
        plotOptions: {
            column: {
                pointPadding: 0.2,
                borderWidth: 0
            }
        },
        series: [{
            name: '24小时晴雨准确率%',
            data: HCP.HCM.maxtemp
        }, {
            name: '24小时最高气温绝对误差',
            data: HCP.HCM.mintemp
        }, {
            name: '24小时最低气温绝对误差',
            data: HCP.HCM.MNowData
        }, {
            name: '24小时暴雨以上降水TS评分',
            data: HCP.HCM.MHisData
        }]
    });
}


techSelect = function () {
    Jdate1 = $("#Text1").val();
    Jdate2 = $("#Text2").val();
    doload();
}
var Jdate1, Jdate2;
technologeFun = function () {
    var date1 = new Date();
    $("#Text2").val(date1.format("yyyy-MM-dd"));
    date1.addDays(-10);
    $("#Text1").val(date1.format("yyyy-MM-dd"));
    Jdate1 = $("#Text1").val();
    Jdate2 = $("#Text2").val();
    doload();
}
doload = function () {
    var table = "";

    var name = new Array;
    var mintemp = new Array;
    var maxtemp = new Array;
    var rain = new Array;
    var bigrain = new Array;
    $.post('/WebService.asmx/Get12HourgrosSScore', {
        dtStart: Jdate1,
        dtEnd: Jdate2,
        type: 1
    }, function (data, textStatus, xhr) {
        var msg = JSON.parse(data);
        table += "<table style='border-collapse: collapse;'><th class='tablename2'>类型</th><th class='tablename2'>时段</th><th class='tablename2'>晴雨技巧评分</th><th class='tablename2'>最高温技巧评分</th><th class='tablename2'>最低温技巧评分</th><th class='tablename2'>暴雨技巧评分</th>";
        if (msg != undefined & msg != "") {
            for (var i = 0; i < msg.length; i++) {
                table += "<tr><th class='tablename2_1'>" + msg[i].TypeName + "</th><th class='tablename2_1'>" + msg[i].StrDtime + "</th><th class='tablename2_1'>" + msg[i].SzBjGzPc + "</th><th class='tablename2_1'>" + msg[i].SzBjMaxTempPc + "</th><th class='tablename2_1'>" + msg[i].SzBjMinTempPc + "</th><th class='tablename2_1'>" + msg[i].SzBjRain + "</th></tr>";
                name[i] = msg[i].TypeName;
                maxtemp[i] = msg[i].SzBjMaxTempPc;
                mintemp[i] = msg[i].SzBjMinTempPc;
                rain[i] = parseFloat(msg[i].SzBjGzPc);
                bigrain[i] = msg[i].SzBjRain;
            }
            HCP.HCM.MHisData = bigrain;
            HCP.HCM.MNowData = rain;
            HCP.HCM.name1 = name;
            HCP.HCM.mintemp = mintemp;
            HCP.HCM.maxtemp = maxtemp;

            $("#tablePf").html("");
            $("#tablePf").append(table);
            SZoverBJshow();
        } else {

        }
    });

}
SZoverBJshow = function () {
    $('#DivShow').highcharts({
        chart: {
            type: 'column'
        },
        title: {
            text: '技巧评分'
        },
        xAxis: {
            //categories: ['海口市气象台对中央台', '海口市气象台对欧洲中心']//由于暂时缺少中央指导报数据，因此注释
            categories: ['海口市气象台对欧洲中心']
        },
        yAxis: {
            title: {
                text: '技巧'
            }
        },
        credits: {
            enabled: false
        },
        series: [{
            name: '晴雨技巧评分',
            data: HCP.HCM.MNowData
        }, {
            name: '最高温技巧评分',
            data: HCP.HCM.maxtemp
        }, {
            name: '最低温技巧评分',
            data: HCP.HCM.mintemp
        }, {
            name: '暴雨技巧评分',
            data: HCP.HCM.MHisData
        }]
    });
}

select = function () {
    if (document.getElementById("yearDay").style.display == "block") {
        rightFun("day");
    }
    if (document.getElementById("yearMonth").style.display == "block") {
        rightFun("month");
    }
    if (document.getElementById("yearSeason").style.display == "block") {
        rightFun("season");
    }
    if (document.getElementById("yearDiv").style.display == "block") {
        rightFun("year");
    }
}

YuBaoselect = function () {
    if (document.getElementById("yeartime").style.display == "block") {
        YuBaotable("day");
    }
    if (document.getElementById("yearMonth2").style.display == "block") {
        YuBaotable("month");
    }
    if (document.getElementById("yearSeason2").style.display == "block") {
        YuBaotable("season");
    }
    if (document.getElementById("yearDiv2").style.display == "block") {
        YuBaotable("year");
    }

}

YuBaotable = function (dataType) {

    date = new Date();
    date.addDays(-11);
    $("#enddate").val(date.format("yyyy-MM-dd"));

    date.addDays(-1);
    $("#startdate").val(date.format("yyyy-MM-dd"));

    var table = "";
    if (dataType == "day") {
        datestart = $("#startdate").val();
        dateend = $("#enddate").val();
    }
    if (dataType == "month") {
        datestart = $("#yearMonthChoise2").val();
        dateend = $("#MonthChoise2").val();
    }
    if (dataType == "season") {
        datestart = $("#yearSeasonChoise2").val();
        dateend = $("#SeasonChoise2").val();
    }
    if (dataType == "year") {
        datestart = $("#yearil2").val();
        dateend = "";
    }

    var name = new Array;  //名称

    var ScoreRain = new Array;  //晴天
    var LargeRain = new Array;  //大雨

    loadpage();
    table += "<table style='border-collapse: collapse;'><th class='tablename3'>名称</th><th class='tablename3'>晴雨预报准确率%</th><th class='tablename3'>大雨预报准确率%</th>";
    $.post('/WebService.asmx/GetPredictionInfo', {
        dtStart: datestart,
        dtEnd: dateend,
        dateType: dataType
    }, function (data, textStatus, xhr) {
        var msg = JSON.parse(data);
        if (msg != "" && msg != undefined) {
            for (var i = 0; i < msg.length; i++) {
                table += "<tr><th class='tablename3_1'>" + msg[i].ScoreName + "</th><th class='tablename3_1'>" + msg[i].ScoreRain + "</th><th class='tablename3_1'>" + msg[i].LargeRain + "</th></tr>";

                name[i] = msg[i].ScoreName;
                ScoreRain[i] = msg[i].ScoreRain;
                LargeRain[i] = msg[i].LargeRain;
            }
            table += "</table>"
            $("#Yubaotable").html("");
            $("#Yubaotable").append(table);

            layer.close(load);
            HCP.HCM.MNowData = [];
            for (var i = 0; i < ScoreRain.length; i++)
                HCP.HCM.MNowData.push(parseInt(ScoreRain[i]));

            for (var i = 0; i < LargeRain.length; i++)
                HCP.HCM.maxtemp.push(parseInt(LargeRain[i])); //把字符串变成数字

            HCP.HCM.name1 = name;
            ShowDataMonth();
            ShowDataYB();

        } else {
            layer.close(load);
            layer.msg('数据出错，请刷新重试！', {
                icon: 5
            });
        }
    }).error(function (xhr) {
        layer.msg('数据出错，请刷新重试！', {
            icon: 5
        });
    });
}


ShowDataYB = function () {
    $('#SDtemp').highcharts({
        chart: {
            type: 'column'
        },
        credits: {
            enabled: false
        },
        title: {
            text: ''
        },
        subtitle: {
            text: ' '
        },
        xAxis: {
            categories: HCP.HCM.name1, gridLineColor: '#AAAAAB',
            gridLineWidth: 1
        },
        yAxis: {
            min: 0,
            max: 100,
            title: {
                text: "大雨"
            },
            plotLines: [{
                value: 0,
                width: 1,
                color: '#808080'
            }],
            labels:
            {
                format: ''
            },
            gridLineColor: '#AAAAAB',
            gridLineWidth: 1
        },
        tooltip: {
            headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
            pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' + '<td style="padding:0"><b>{point.y} ' + "%" + '</b></td></tr>',
            footerFormat: '</table>',
            shared: true,
            useHTML: true
        },
        plotOptions: {
            column: {
                pointPadding: 0.2,
                borderWidth: 0
            }
        },
        series: [{
            name: "大雨预报准确率",
            color: '#5698F9',
            data: HCP.HCM.maxtemp
        }]
    });
};


rightFun = function (dataType) {
    var table = "";
    switch (dataType) {
        case "day":
            datestart = $("#datestart").val();
            dateend = $("#dateend").val();
            break;
        case "month":
            datestart = $("#yearMonthChoise").val();
            dateend = $("#MonthChoise").val();
            break;
        case "season":
            datestart = $("#yearSeasonChoise").val();
            dateend = $("#SeasonChoise").val();
            break;
        case "year":
            datestart = $("#yearil").val();
            dateend = "";
            break;
    }
    var num = new Array;
    var name = new Array;
    var mintemp = new Array;
    var maxtemp = new Array;

    loadpage();//加载进度条

    table += "<table style='border-collapse: collapse;'><th class='tablename3'>名称</th><th class='tablename3'>晴雨预报准确率%</th><th class='tablename3'>最高气温绝对误差</th><th class='tablename3'>最低气温绝对误差</th>";

    $.post('/WebService.asmx/GetScoreTotalInfo', {
        dtStart: datestart,
        dtEnd: dateend,
        dateType: dataType
    }, function (data, textStatus, xhr) {
        var msg = JSON.parse(data);
        if (msg != "" && msg != undefined) {
            for (var i = 0; i < msg.length; i++) {
                table += "<tr><th class='tablename3_1'>" + msg[i].ScoreName + "</th><th class='tablename3_1'>" + msg[i].Score1 + "</th><th class='tablename3_1'>" + msg[i].Score6 + "</th><th class='tablename3_1'>" + msg[i].Score5 + "</th></tr>";
                num[i] = msg[i].Score1;
                name[i] = msg[i].ScoreName;
                maxtemp[i] = msg[i].Score6;
                mintemp[i] = msg[i].Score5;
            }
            table += "</table>"
            $("#tablePf").html("");
            $("#tablePf").append(table);
            layer.close(load);
            HCP.HCM.MNowData = num;
            HCP.HCM.name1 = name;
            HCP.HCM.mintemp = mintemp;
            HCP.HCM.maxtemp = maxtemp;

            ShowDataMonth();
            ShowDataTemp();

        } else {
            layer.close(load);
            layer.msg('数据出错，请刷新重试！', {
                icon: 5
            });
        }
    }).error(function (xhr) {
        layer.msg('数据出错，请刷新重试！', {
            icon: 5
        });
    });
}
var HCP =
    {
        HCM: { title: "", text: "", unit: "", name1: "", name2: "", MHisData: undefined, MNowData: undefined },
        HCY: { title: "", text: "", unit: "", maxtemp: "", mintemp: "", xData: undefined, YearData: undefined }
    };

ShowDataMonth = function () {
    $('#SDMonth').highcharts({
        chart: {
            type: 'column'
        },
        credits: {
            enabled: false
        },
        title: {
            text: ''
        },
        subtitle: {
            text: ' '
        },
        xAxis: {
            categories: HCP.HCM.name1, gridLineColor: '#AAAAAB',
            gridLineWidth: 1
        },
        yAxis: {
            min: 0,
            max: 100,
            title: {
                text: "晴雨"
            },
            plotLines: [{
                value: 0,
                width: 1,
                color: '#808080'
            }],
            labels:
            {
                format: ''
            },
            gridLineColor: '#AAAAAB',
            gridLineWidth: 1
        },
        tooltip: {
            headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
            pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' + '<td style="padding:0"><b>{point.y} ' + "%" + '</b></td></tr>',
            footerFormat: '</table>',
            shared: true,
            useHTML: true
        },
        plotOptions: {
            column: {
                pointPadding: 0.2,
                borderWidth: 0
            }
        },
        series: [{
            name: "晴雨预报准确率",
            color: '#5698F9',
            data: HCP.HCM.MNowData
        }]
    });
};

ShowDataTemp = function () {
    $('#SDtemp').highcharts({
        chart: {
            type: 'column'
        },
        credits: {
            enabled: false
        },
        title: {
            text: ' '
        },
        subtitle: {
            text: ' '
        },
        xAxis: {
            categories: HCP.HCM.name1, gridLineColor: '#AAAAAB',
            gridLineWidth: 1
        },
        yAxis: {
            min: 0,
            title: {
                text: ""
            },
            title: {
                text: "气温"
            },
            plotLines: [{
                value: 0,
                width: 1,
                color: '#808080'
            }],
            labels:
            {
                format: ''
            },
            gridLineColor: '#5698F9',
            gridLineWidth: 1
        },
        tooltip: {
            headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
            pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' + '<td style="padding:0"><b>{point.y} ' + "" + '</b></td></tr>',
            footerFormat: '</table>',
            shared: true,
            useHTML: true
        },
        plotOptions: {
            column: {
                pointPadding: 0.2,
                borderWidth: 0
            }
        },
        series: [{
            name: "最高温绝对误差",
            color: '#fe5553',
            data: HCP.HCM.maxtemp
        }, {
            name: "最低温绝对误差",
            color: '#55D1D1',
            data: HCP.HCM.mintemp
        }]
    });
};
Expore = function (value) {
    if (value == "right") {

    }
    if (value == "jiqiao") {

    }
    if (value == "yaosu") {

    }
}

Expore = function (value) {
    var exData = new Array;
    for (var i = 0; i < $("#tablePf th").length; i++) {
        exData[i] = $("#tablePf th").eq(i).text()
    }
    if (exData.length != 0) {
        WebMethod.callBack('ExporeData', { data: exData, dType: value }, function (data, textStatus, xhr) {
            if (data != null || data != "error") {
                $("#ContentPlaceHolder1_filename").val(data);
                $("#ContentPlaceHolder1_Button1").click();
            }
        });
    } else {
        layer.msg('数据出错，请刷新重试！', {
            icon: 5
        });
    }
}