// 对Date的扩展，将 Date 转化为指定格式的String   
        // 月(M)、日(d)、小时(h)、分(m)、秒(s)、季度(q) 可以用 1-2 个占位符，   
        // 年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字)   
        // 例子：   
        // (new Date()).Format("yyyy-MM-dd hh:mm:ss.S") ==> 2006-07-02 08:09:04.423
        // (new Date()).Format("yyyy-M-d h:m:s.S")      ==> 2006-7-2 8:9:4.18
        //访问服务器的方法
        var WebMethod = { DefaultPage: "default.aspx",
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
//        Date.prototype.Format = function (fmt) { //author: meizz   
//            var o = {
//                "M+": this.getMonth() + 1,               //月份   
//                "d+": this.getDate(),                    //日   
//                "h+": this.getHours(),                   //小时   
//                "m+": this.getMinutes(),                 //分   
//                "s+": this.getSeconds(),                 //秒   
//                "q+": Math.floor((this.getMonth() + 3) / 3), //季度   
//                "S": this.getMilliseconds()             //毫秒   
//            };
//            if (/(y+)/.test(fmt))
//                fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
//            for (var k in o)
//                if (new RegExp("(" + k + ")").test(fmt))
//                    fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
//            return fmt;
//        }
//        Date.prototype.addHours = function (h) {
//            this.setHours(this.getHours() + h);
//        };
//        Date.prototype.addMinutes = function (mi) {
//            this.setMinutes(this.getMinutes() + mi);
//        };
//        Date.prototype.addDays = function (d) {
//            this.setDate(this.getDate() + d);
//        };
//        Date.prototype.addWeeks = function (w) {
//            this.addDays(w * 7);
//        };
//        Date.prototype.addMonths = function (m) {
//            var d = this.getDate();
//            this.setMonth(this.getMonth() + m);

//            if (this.getDate() < d)
//                this.setDate(0);
//        };
//        Date.prototype.addYears = function (y) {
//            var m = this.getMonth();
//            this.setFullYear(this.getFullYear() + y);

//            if (m < this.getMonth()) {
        //                this.setDate(0);

//            }
//        };

        var daytype;
        var datestart;
        var dateend;
        $(function () {
            date = new Date();
            date.addDays(-11);
            $("#dateend").val(date.format("yyyy-MM-dd"));
            datestart = $("#datestart").val();
            date.addDays(-1);

            $("#datestart").val(date.format("yyyy-MM-dd"));
            datestart = $("#datestart").val();
            dateend = $("#dateend").val();
            rightFun("day");

           
            $("#mean label").click(function () {
                var id = this.id;
                $("#yubaoDate").css("display","none");
                $("#rightDate").css("display", "none");
                $("#jiqiao").css("display", "none");
                $("#yaosu").css("display", "none");
                $("#jiangyu").css("display", "none");
                $("#gedian").css("display", "none");

                $("#Yubaotable").css("display", "none");  //
                $("#tablePf").html("");
                $("#SDMonth").html("");
                $("#SDtemp").html("");
                $("#DivShow").html("");
                switch (id) {
                    case "btn01":
                        $("#Draw1").css("display", "block");
                        $("#Draw2").css("display", "none");
                        $("#rightDate").css("display", "block");
                        $("#btn01").css("background", "#fff");
                        $("#tablePf").css("display", "block"); //zhou
                        daytype = "day";
                        rightFun(daytype);
                        break;
                    case "btn02":
                        $("#Draw1").css("display", "none");
                        $("#Draw2").css("display", "block");
                        $("#jiqiao").css("display", "block");
                        $("#btn02").css("background", "#fff");
                        $("#tablePf").css("display", "block"); //zhou
                        technologeFun();
                        break;
                    case "btn03":
                        $("#Draw1").css("display", "none");
                        $("#Draw2").css("display", "block");
                        $("#yaosu").css("display", "block");
                        $("#btn03").css("background", "#fff");
                        $("#tablePf").css("display", "block"); //zhou
                        mainElementFun();
                        break;
                    case "btn04":
                        $("#Draw1").css("display", "none");
                        $("#Draw2").css("display", "block");
                        $("#jiangyu").css("display", "block");
                        $("#btn04").css("background", "#fff");
                        $("#tablePf").css("display", "block"); //zhou
                        rainFun();
                        break;
                    case "btn05":
                        $("#Draw1").css("display", "none");
                        $("#Draw2").css("display", "block");
                        $("#gedian").css("display", "block");
                        $("#btn05").css("background", "#fff");
                        $("#tablePf").css("display", "block"); //zhou
                        tableFun();
                        break;                    
                      //zhou
                    case "btn06":
                        $("#Draw1").css("display", "block");
                        $("#Draw2").css("display", "none");
                        $("#yubaoDate").css("display", "block");

                        $("#Yubaotable").css("display", "block");
                        $("#tablePf").css("display", "none");
                        $("#btn06").css("background", "#fff");
                        daytype = "day";
                        YuBaotable(daytype);                        
                       
                        break;
                    //zhou
                }
                for (var i = 1; i <= 6; i++) {
                    if (id.substring(4, 5) == i) {
                        continue;
                    }
                    else {
                        $("#btn0" + i).css("background", "");
                    }
                }
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
            //common.webService("GetScoreRainGrade", { dtStart: rainTime1, dtEnd: rainTime2 }, function (msg) {
            $.post('/WebService.asmx/GetScoreRainGrade', { dtStart: rainTime1, dtEnd: rainTime2 }, function (data, textStatus, xhr) {
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
                    //                    Elementshow();
                    HCP.HCM.MHisData = bigrain;
                    HCP.HCM.MNowData = rain;
                    HCP.HCM.name1 = name;
                    HCP.HCM.mintemp = mintemp;
                    HCP.HCM.maxtemp = maxtemp;

                }
                else {
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
            // common.webService("GetScoreRainGrade", { dtStart: rainTime1, dtEnd: rainTime2 }, function (msg) {
            $.post('/WebService.asmx/GetScoreRainGrade', { dtStart: rainTime1, dtEnd: rainTime2 }, function (data, textStatus, xhr) {
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
//                    Elementshow();
                    HCP.HCM.MHisData = bigrain;
                    HCP.HCM.MNowData = rain;
                    HCP.HCM.name1 = name;
                    HCP.HCM.mintemp = mintemp;
                    HCP.HCM.maxtemp = maxtemp;
                   
                }
                else {
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
        eledoload = function () {
            var table = "";
            var name = new Array;
            var mintemp = new Array;
            var maxtemp = new Array;
            var rain = new Array;
            var bigrain = new Array;
            // common.webService("Get6HourScoreTotal", { dtStart: EleTime1, dtEnd: EleTime2 }, function (msg) {
            $.post('/WebService.asmx/Get6HourScoreTotal', { dtStart: EleTime1, dtEnd: EleTime2 }, function (data, textStatus, xhr) {
                var msg = JSON.parse(data);
                    table += "<table style='border-collapse: collapse;'><th class='tablename'>名称</th><th class='tablename'>24小时晴雨准确率%</th><th class='tablename'>24小时最高气温绝对误差</th><th class='tablename'>24小时最低气温绝对误差</th><th class='tablename'>24小时暴雨以上降水TS评分</th>";
                    if (msg != undefined & msg != "") {
                        for (var i = 0; i < msg.length; i++) {
                            table += "<tr><th class='tablename1'>" + msg[i].ScoreName + "</th><th class='tablename1'>" + msg[i].Score3 + "</th><th class='tablename1'>" + msg[i].Score1 + "</th><th class='tablename1'>" + msg[i].Score2 + "</th><th class='tablename1'>" + msg[i].ScoreRain + "</th></tr>";
                            name[i] = msg[i].ScoreName;
                            maxtemp[i] = parseFloat(msg[i].Score3);
                            mintemp[i] =parseFloat( msg[i].Score1);
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
                    }
                    else {
                    }
                });
            }

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
                    max:100,
                    title: {
                        text: '要素 (%)'
                    }
                },
                tooltip: {
                    headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
                    pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
            '<td style="padding:0"><b>{point.y:.1f} %</b></td></tr>',
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
                    data:HCP.HCM.MHisData
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
            // common.webService("Get12HourgrosSScore", { dtStart: Jdate1, dtEnd: Jdate2, type: 1 }, function (msg) {
            $.post('/WebService.asmx/Get12HourgrosSScore', { dtStart: Jdate1, dtEnd: Jdate2, type: 1 }, function (data, textStatus, xhr) {
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
                }
                else {
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
                    categories: ['深圳台对中央台', '深圳台对欧洲中心']
                },
                yAxis: {
                    title: {
                    text:'技巧'
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

//zhou
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

            $(".ifr_div").css("display", "block");
            $("#loading").css("display", "block");
            table += "<table style='border-collapse: collapse;'><th class='tablename3'>名称</th><th class='tablename3'>晴雨预报准确率%</th><th class='tablename3'>大雨预报准确率%</th>";
            //common.webService("GetScoreTotalInfo", { dtStart: datestart, dtEnd: dateend, dateType: dataType }, function (msg) {
            $.post('/WebService.asmx/GetPredictionInfo', { dtStart: datestart, dtEnd: dateend, dateType: dataType }, function (data, textStatus, xhr) {
                var msg = JSON.parse(data);
                if (msg != "" && msg != undefined) {
                    for (var i = 0; i < msg.length; i++) {
                       
                        table += "<tr><th class='tablename3_1'>" + msg[i].ScoreName + "</th><th class='tablename3_1'>" + msg[i].ScoreRain + "</th><th class='tablename3_1'>" + msg[i].LargeRain + "</th></tr>";

                        //num[i] = msg[i].Score1;
                        name[i] = msg[i].ScoreName;
                        ScoreRain[i] = msg[i].ScoreRain;
                        LargeRain[i] = msg[i].LargeRain;
                    }
                    table += "</table>"
                    $("#Yubaotable").html("");
                    $("#Yubaotable").append(table);

                    $("#loading").css("display", "none");
                    $(".ifr_div").css("display", "none");
                    HCP.HCM.MNowData = [];
                    for (var i = 0; i < ScoreRain.length; i++)
                        HCP.HCM.MNowData.push(parseInt(ScoreRain[i]));

                    for (var i = 0; i < LargeRain.length; i++)
                        HCP.HCM.maxtemp.push(parseInt(LargeRain[i]));  //把字符串变成数字

                    //HCP.HCM.MNowData = ScoreRain;
                    HCP.HCM.name1 = name;
                   // HCP.HCM.maxtemp = LargeRain;
                     
                     ShowDataMonth();
                     ShowDataYB();

                }
                else {
                    $("#loading").css("display", "none");
                    $(".ifr_div").css("display", "none");
                    alert("数据错误");
                }
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
                    //                     labels: {
                    //                    {
                    //                title:{text:"晴雨"}
                    //                }},
                    gridLineColor: '#AAAAAB',
                    gridLineWidth: 1
                },
                tooltip: {
                    headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
                    pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
                '<td style="padding:0"><b>{point.y} ' + "%" + '</b></td></tr>',
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
                //                 legend: {
                //                    layout: 'vertical',
                //                    align: 'center',
                //                    x: -200,
                //                    y: -30,
                //                    verticalAlign: 'top',
                //                    floating: true,
                //                    backgroundColor: '#FFFFFF'
                //                },
                series: [{
                    name: "大雨预报准确率",
                    color: '#5698F9',
                    //data: [83.6, 78.8, 98.5, 93.4, 106.0, 84.5, 105.0, 104.3, 91.2, 83.5, 106.6, 92.3]
                    data: HCP.HCM.maxtemp
                }]
            });
        };

//zhou-----------------------------

        rightFun = function (dataType) {
            var table = "";
            if (dataType == "day") {
                datestart = $("#datestart").val();
                dateend = $("#dateend").val();
            }
            if (dataType == "month") {
                datestart = $("#yearMonthChoise").val();
                dateend = $("#MonthChoise").val();
            }
            if (dataType == "season") {
                datestart = $("#yearSeasonChoise").val();
                dateend = $("#SeasonChoise").val();
            }
            if (dataType == "year") {
                datestart = $("#yearil").val();
                dateend = "";
            }
            var num = new Array;
            var name = new Array;
            var mintemp = new Array;
            var maxtemp = new Array;
            $(".ifr_div").css("display", "block");
            $("#loading").css("display", "block");
            table += "<table style='border-collapse: collapse;'><th class='tablename3'>名称</th><th class='tablename3'>晴雨预报准确率%</th><th class='tablename3'>最高气温绝对误差</th><th class='tablename3'>最低气温绝对误差</th>";
            //common.webService("GetScoreTotalInfo", { dtStart: datestart, dtEnd: dateend, dateType: dataType }, function (msg) {
            $.post('/WebService.asmx/GetScoreTotalInfo', { dtStart: datestart, dtEnd: dateend, dateType: dataType }, function (data, textStatus, xhr) {
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
                    $("#loading").css("display", "none");
                    $(".ifr_div").css("display", "none");
                    HCP.HCM.MNowData = num;
                    HCP.HCM.name1 = name;
                    HCP.HCM.mintemp = mintemp;
                    HCP.HCM.maxtemp = maxtemp;

                    ShowDataMonth();
                    ShowDataTemp();

                }
                else {
                    $("#loading").css("display", "none");
                    $(".ifr_div").css("display", "none");
                    alert("数据错误");
                }
            });
        }
        var HCP =
            {
                HCM: { title: "", text: "", unit: "", name1: "", name2: "", MHisData: undefined, MNowData: undefined },
                HCY: { title: "", text: "", unit: "", maxtemp:"",mintemp: "", xData: undefined, YearData: undefined }
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
                    max:100,
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
//                     labels: {
//                    {
//                title:{text:"晴雨"}
//                }},
                    gridLineColor: '#AAAAAB',
                    gridLineWidth: 1
                },
                tooltip: {
                    headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
                    pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
                '<td style="padding:0"><b>{point.y} ' + "%" + '</b></td></tr>',
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
//                 legend: {
//                    layout: 'vertical',
//                    align: 'center',
//                    x: -200,
//                    y: -30,
//                    verticalAlign: 'top',
//                    floating: true,
//                    backgroundColor: '#FFFFFF'
//                },
                series: [{
                    name: "晴雨预报准确率",
                    color: '#5698F9',
                    //data: [83.6, 78.8, 98.5, 93.4, 106.0, 84.5, 105.0, 104.3, 91.2, 83.5, 106.6, 92.3]
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
                    pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
                '<td style="padding:0"><b>{point.y} ' + "" + '</b></td></tr>',
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
//                legend: {
//                    layout: 'horizontal',
//                    align: 'center',
//                    x: -150,
//                    y: 0,
//                    verticalAlign: 'top',
//                    floating: true,
//                    backgroundColor: '#FFFFFF'
//                },
                series: [{
                    name: "最高温绝对误差",
                    color: '#fe5553',
                    //data: [83.6, 78.8, 98.5, 93.4, 106.0, 84.5, 105.0, 104.3, 91.2, 83.5, 106.6, 92.3]
                    data: HCP.HCM.maxtemp
                }, {
                    name: "最低温绝对误差",
                    color: '#55D1D1',
                    //data: [83.6, 78.8, 98.5, 93.4, 106.0, 84.5, 105.0, 104.3, 91.2, 83.5, 106.6, 92.3]
                    data: HCP.HCM.mintemp
                }]
            });
        };

        MonthScore = function (value) {
            var time = new Date();
            var year = "";
            $("#yearMonthChoise").html("");
            $("#yearDay").css("display", "none");
            $("#yearMonth").css("display", "block");
            $("#yearSeason").css("display", "none");
            $("#yearDiv").css("display", "none");
            $("#dayScore").css("background", "#5dbcfe")
            $("#monthScore").css("background", "#0976c2");
            $("#seasonScore").css("background", "#5dbcfe");
            $("#yearScore").css("background", "#5dbcfe");
            for (var i = 0; i < 10; i++) {
                year += "<option>" + (time.getFullYear() - i) + "</option>";
            }

            $("#yearMonthChoise").append(year);
            dataType = value;
            rightFun(value);

        }
        SeasonScore = function (value) {
            var time = new Date();
            var year = "";
            $("#yearMonth").css("display", "none");
            $("#yearDay").css("display", "none");
            $("#yearSeason").css("display", "block");
            $("#yearDiv").css("display", "none");
            $("#dayScore").css("background", "#5dbcfe")
            $("#monthScore").css("background", "#5dbcfe");
            $("#seasonScore").css("background", "#0976c2");
            $("#yearScore").css("background", "#5dbcfe");
            
            for (var i = 0; i < 10; i++) {
                year += "<option>" + (time.getFullYear() - i) + "</option>";
            }
            $("#yearSeasonChoise").append(year);
            dataType = value;
            rightFun(value);
        }
        YearScore = function (value) {
            var time = new Date();
            var year = "";
            $("#yearDiv").css("display", "block");
            $("#yearDay").css("display", "none");
            $("#yearSeason").css("display", "none");
            $("#yearMonth").css("display", "none");
            $("#dayScore").css("background", "#5dbcfe")
            $("#monthScore").css("background", "#5dbcfe");
            $("#seasonScore").css("background", "#5dbcfe");
            $("#yearScore").css("background", "#0976c2");
            for (var i = 0; i < 10; i++) {
                year += "<option>" + (time.getFullYear() - i) + "</option>";
            }
            $("#yearil").append(year);
            dataType = value;
            rightFun(value);
        }
        DayScore = function (value) {
            $("#dayScore").css("background", "#0976c2")
            $("#monthScore").css("background", "#5dbcfe");
            $("#seasonScore").css("background", "#5dbcfe");
            $("#yearScore").css("background", "#5dbcfe");
            $("#yearDay").css("display", "block");
            $("#yearSeason").css("display", "none");
            $("#yearMonth").css("display", "none");
            $("#yearDiv").css("display", "none");
            dataType = value;
            rightFun(value);
        }


     //zhou
        MonthScore2 = function (value) {
            var time = new Date();
            var year = "";
            $("#yearMonthChoise2").html("");
            $("#yeartime").css("display", "none");
            $("#yearMonth2").css("display", "block");
            $("#yearSeason2").css("display", "none");
            $("#yearDiv2").css("display", "none");
            $("#dayScore2").css("background", "#5dbcfe")
            $("#monthScore2").css("background", "#0976c2");
            $("#seasonScore2").css("background", "#5dbcfe");
            $("#yearScore2").css("background", "#5dbcfe");
            for (var i = 0; i < 10; i++) {
                year += "<option>" + (time.getFullYear() - i) + "</option>";
            }

            $("#yearMonthChoise2").append(year);
            dataType = value;
            YuBaotable(value);

        }
        SeasonScore2 = function (value) {
            var time = new Date();
            var year = "";
            $("#yearMonth2").css("display", "none");
            $("#yeartime").css("display", "none");
            $("#yearSeason2").css("display", "block");
            $("#yearDiv2").css("display", "none");
            $("#dayScore2").css("background", "#5dbcfe")
            $("#monthScore2").css("background", "#5dbcfe");
            $("#seasonScore2").css("background", "#0976c2");
            $("#yearScore2").css("background", "#5dbcfe");

            for (var i = 0; i < 10; i++) {
                year += "<option>" + (time.getFullYear() - i) + "</option>";
            }
            $("#yearSeasonChoise2").append(year);
            dataType = value;
            YuBaotable(value);
        }
        YearScore2 = function (value) {
            var time = new Date();
            var year = "";
            $("#yearDiv2").css("display", "block");
            $("#yeartime").css("display", "none");
            $("#yearSeason2").css("display", "none");
            $("#yearMonth2").css("display", "none");
            $("#dayScore2").css("background", "#5dbcfe")
            $("#monthScore2").css("background", "#5dbcfe");
            $("#seasonScore2").css("background", "#5dbcfe");
            $("#yearScore2").css("background", "#0976c2");
            for (var i = 0; i < 10; i++) {
                year += "<option>" + (time.getFullYear() - i) + "</option>";
            }
            $("#yearil2").append(year);
            dataType = value;
            YuBaotable(value);
        }
        DayScore2 = function (value) {
            $("#dayScore2").css("background", "#0976c2")
            $("#monthScore2").css("background", "#5dbcfe");
            $("#seasonScore2").css("background", "#5dbcfe");
            $("#yearScore2").css("background", "#5dbcfe");
            $("#yeartime").css("display", "block");
            $("#yearSeason2").css("display", "none");
            $("#yearMonth2").css("display", "none");
            $("#yearDiv2").css("display", "none");
            dataType = value;
            YuBaotable(value);
        }

          //zhou

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
                 
                // common.webService("ExporeData", { data: exData, dType: value }, function (msg) 
                //$.post('/WebService.asmx/ExporeData', { data: JSON.stringify(exData), dType: value }, function (data, textStatus, xhr) {
                WebMethod.callBack('ExporeData', { data: exData, dType: value }, function (data, textStatus, xhr) {
                    if (data != null || data != "error") {
                        //var msg = JSON.parse(data);
                        $("#ContentPlaceHolder1_filename").val(data);
                        $("#ContentPlaceHolder1_Button1").click();
                    }
                });
            }
            else {
                alert("无数据可导出");
            }
        }