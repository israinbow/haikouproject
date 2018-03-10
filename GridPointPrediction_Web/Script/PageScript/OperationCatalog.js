$(function () {
    init();

    var table;         //入库表
    var tableRecord;   //入库登记表

    $(".menu_list li").click(function () {
        $(this).addClass("active").siblings().removeClass("active");
        val = $(this).text();
        var title = $(".forecastList_title");
        title.html(val);

        //先清除之前的内容再加载
        $("#forecastList_table tbody").html("");
        loadData();
    });
});

//初始化加载逐6小时预报数据
function init() {
    $('#datetimeStart').datetimepicker({ minView: 'month', format: 'yyyy-mm-dd', language: 'zh-CN', todayBtn: 1, autoclose: 1, });
    $('#datetimeEnd').datetimepicker({ minView: 'month', format: 'yyyy-mm-dd', language: 'zh-CN', todayBtn: 1, autoclose: 1, });

    val = "逐6时预报";
    loadData();
}


function loadData() {
    var temp;
    var str;

    switch (val) {
        case "逐6时预报":
            str = "<tr><th>时间</th><th>天气状况</th><th>降雨量（mm）</th><th>风速</th><th>风向</th><th>风力级别</th><th>最高温度</th><th>最低温度</th><th>制作</th><th>分发</th><th>详情</th></tr>";
            table = "LFS_CityWEATHERHOUR";
            tableRecord = "LFS_CityWEATHER";
            break;
        case "逐12时预报":
            str = "<tr><th>时间</th><th>天气状况</th><th>降雨量（mm）</th><th>风速</th><th>风向</th><th>风力级别</th><th>最高温度</th><th>最低温度</th><th>制作</th><th>分发</th><th>详情</th></tr>";
            table = "lfs_hour12weatherhour";
            tableRecord = "lfs_hour12weather";
            break;
        case "十天预报":
            str = "<tr><th>时间</th><th>白天预报</th><th>降雨量（mm）</th><th>风速</th><th>风向</th><th>湿度</th><th>最高温度</th><th>最低温度</th><th>制作</th><th>分发</th><th>详情</th></tr>";
            table = "LFS_WELFAREFORECAST";
            break;
        case "分区预报":
            str = "<tr style='height:40px'><th>时间</th><th>是否发布</th><th>制作标记</th><th>是否订正</th><th style='font-size:12px;'>是否生成图片</th><th style='font-size:12px;'>是否生成Chart</th><th style='font-size:12px;line-height:16px;padding:0 16px;'>是否保存至本地服务器</th><th style='font-size:12px;line-height:16px;padding:0 16px;'>是否保存至专用服务器</th><th>制作</th><th>分发</th><th>详情</th></tr>";
            table = "lfs_welfareproduce";
            break;
        case "决策预报":
            str = "<tr style='height:40px'><th>预报时间</th><th>报文发布时间</th><th>是否生成word</th><th>文件生成标志</th><th>制作</th><th>分发</th><th>详情</th></tr>";
            table = "LFS_DECISIONFORCAST";
            break;
        case "旬报":
            str = "<tr style='height:40px'><th style='width:7.8%'>时间</th><th>文件生成标志</th><th>制作</th><th>分发</th><th>详情</th></tr>";
            table = "sf_periodmonthforecast";
            break;
        case "月报":
            str = "<tr style='height:40px'><th style='width:7.8%'>时间</th><th>文件生成标志</th><th>制作</th><th>分发</th><th>详情</th></tr>";
            table = "SF_MONTHFORECAST";
            break;
        case "实况预报":
            str = "<tr style='height:40px'><th style='width:7.8%'>时间</th><th>文件生成标志</th><th>制作</th><th>分发</th><th>详情</th></tr>";
            table = "SF_LIVEFORECAST";
            break;
        case "日常预报":
            str = "<tr style='height:40px'><th style='width:7.8%'>时间</th><th>文件生成标志</th><th>制作</th><th>分发</th><th>详情</th></tr>";
            table = "SF_DAILYFORECAST";
            break;
        case "格点预报":
            str = "<tr style='height:40px'><th style='width:8.8%'>预报时次</th><th style='width:8.8%'>预报时间</th><th style='width:7.8%'>相对湿度</th><th style='width:6.6%'>累计降雨</th><th style='width:7%'>能见度</th><th style='width:7.7%'>最高气温</th><th style='width:7.7%'>最低气温</th><th>详情</th></tr>";
            table = "T_HK_NEW_GRID_FORECAST";
            break;
        case "假日专报":
            str = "<tr style='height:40px'><th style='width:7.8%'>时间</th><th>文件生成标志</th><th>制作</th><th>分发</th><th>详情</th></tr>";
            break;
        case "政府专报":
            str = "<tr style='height:40px'><th style='width:7.8%'>时间</th><th>文件生成标志</th><th>制作</th><th>分发</th><th>详情</th></tr>";
            table = "SF_GOVTFORECAST";
            break;
        case "农业专报":
            str = "<tr style='height:40px'><th style='width:7.8%'>时间</th><th>文件生成标志</th><th>制作</th><th>分发</th><th>详情</th></tr>";
            table = "SF_FARMFORECAST";
            break;
        case "春运专报":
            str = "<tr style='height:40px'><th style='width:7.8%'>时间</th><th>文件生成标志</th><th>制作</th><th>分发</th><th>详情</th></tr>";
            table = "LFS_SPRINGFORECAST";
            break;
        case "交通专报":
            str = "<tr style='height:40px'><th style='width:7.8%'>时间</th><th>文件生成标志</th><th>制作</th><th>分发</th><th>详情</th></tr>";
            table = "LFS_TRAFFICFORECAST";
            break;
        default:
            break;
    }
    //回溯列表标题
    $("#forecastList_table thead").html(str);
    getDatas();

}

//获取回溯列表数据
function getDatas() {
    if (val == "逐6时预报" || val == "逐12时预报") {
        loadpage();
        $.post('../WebService.asmx/GetOperatCatalogDatas', {
            tableInfo: table,
            tableInfoRecord: tableRecord
        }, function (data, textStatus, xhr) {
            if (data === null || data === undefined || data === "[]" || data === "") {
                griddata = null;
                return;
            }
            if (load) {
                layer.close(load);
            }

            //将得到的两个json数据分离，分别转换格式
            griddatanew = data.split("+");
            griddatanew1 = griddatanew[0];
            griddatanew2 = griddatanew[1];
            griddatanew1 = JSON.parse(griddatanew1)[0];
            griddatanew2 = JSON.parse(griddatanew2)[1];

            var forecasttime;     //预报时间
            var weatherstatus;    //天气状况
            var rain;             //降雨量
            var windspeed;        //风速
            var winddirect;       //风向
            var windclass;        //风力级别
            var maxtemp;          //最高温度
            var mintemp;          //最低温度
            var recid;            //id
            var forecaster;       //预报员
            var maker;            //制作
            var flag;             //判断入库表与入库登记表中是否存在对应的数据
            var temp;

            for (var i = 0; i < griddatanew1.length; i++) {
                forecasttime = griddatanew1[i].FORECASTTIME;
                weatherstatus = griddatanew1[i].WEATHERSTATUS;
                rain = griddatanew1[i].RAIN;
                windspeed = griddatanew1[i].WINDSPEED;
                winddirect = griddatanew1[i].WINDDIRECT;
                windclass = griddatanew1[i].WINDCLASS;
                maxtemp = griddatanew1[i].MAXTEMPERATURE;
                mintemp = griddatanew1[i].MINTEMPERATURE;

                if (weatherstatus == null || weatherstatus == "") {
                    weatherstatus = 0;
                }
                if (rain == null || rain == "") {
                    rain = 0;
                }
                if (windspeed == null || windspeed == "") {
                    windspeed = 0;
                }
                if (winddirect == null || winddirect == "") {
                    winddirect = 0;
                }
                if (windclass == null || windclass == "") {
                    windclass = 0;
                }
                if (maxtemp == null || maxtemp == "") {
                    maxtemp = 0;
                }
                if (mintemp == null || mintemp == "") {
                    mintemp = 0;
                }

                //时间格式化
                forecasttime = forecasttime.split("T");
                forecasttime = forecasttime[0] + " " + forecasttime[1];

                temp = "";
                temp = "<td>";
                temp += forecasttime;
                temp += "</td>";
                temp += "<td>";
                temp += weatherstatus;
                temp += "</td>";
                temp += "<td>";
                temp += rain;
                temp += "</td>";
                temp += "<td>";
                temp += windspeed;
                temp += "</td>";
                temp += "<td>";
                temp += winddirect;
                temp += "</td>";
                temp += "<td>";
                temp += windclass;
                temp += "</td>";
                temp += "<td>";
                temp += maxtemp;
                temp += "</td>";
                temp += "<td>";
                temp += mintemp;
                temp += "</td>";

                for (var j in griddatanew2) {
                    forecaster = griddatanew2[j].FORECASTER;
                    maker = forecaster;

                    var recid2 = griddatanew2[j].RECID;
                    var recid1 = griddatanew1[i].RECID;

                    if (recid1 == recid2) {
                        flag = 1;     //入库登记表中存在与入库表中对应的数据，添加制作、分发
                        temp += "<td>";
                        temp += forecaster;
                        temp += "</td>";
                        temp += "<td>";
                        temp += maker;
                        temp += "</td>";
                    }
                }

                if (flag == 1) {
                    flag = "";    //将flag置空
                } else {
                    //入库登记表中不存在与入库表中对应的数据
                    temp += "<td>";
                    temp += "-";
                    temp += "</td>";
                    temp += "<td>";
                    temp += "-";
                    temp += "</td>";
                }

                temp += "<td onclick='showDetails(this)'>";
                temp += "显示详情";
                temp += "</td>";

                $("#forecastList_table tbody").append("<tr>" + temp + "</tr>");
            }
        })
    } else if (val == "十天预报") {
        tenDayDatas();
    } else if (val == "分区预报") {
        zoneDatas();
    } else if (val == "决策预报" || val == "旬报" || val == "月报" || val == "实况预报" || val == "日常预报" || val == "格点预报" || val == "政府专报" || val == "农业专报" || val == "春运专报" || val == "交通专报") {
        ForecastDatas();
    } else if (val == "假日专报") {
        HolidayDatas();
    }
}


//十天预报数据
function tenDayDatas() {
    loadpage();
    $.post('../WebService.asmx/GettenDayDatas', {
        tableInfo: table
    }, function (data, textStatus, xhr) {
        if (data === null || data === undefined || data === "[]" || data === "") {
            griddata = null;
            return;
        }
        if (load) {
            layer.close(load);
        }
        griddatanew = JSON.parse(data)[0];

        var forecasttime;     //预报时间
        var weathertoday;    //白天预报
        var rain;             //降雨量
        var windspeed;        //风速
        var winddirect;       //风向
        var humidity;        //湿度
        var maxtemp;          //最高温度
        var mintemp;          //最低温度
        var recid;            //id
        var forecaster;       //预报员
        var maker;            //制作
        var temp;

        for (var i = 0; i < griddatanew.length; i++) {
            forecasttime = griddatanew[i].DDATETIME;
            weathertoday = griddatanew[i].WEATHERTODAY.split("；")[0].split("，")[0];
            rain = griddatanew[i].RAIN;
            windspeed = griddatanew[i].WINDSPEED;
            winddirect = griddatanew[i].WINDDIRECT;
            humidity = griddatanew[i].HUMIDITY;
            maxtemp = griddatanew[i].MAXTEMP;
            mintemp = griddatanew[i].MINTEMP;
            forecaster = griddatanew[i].FORECASTER;

            if (weathertoday == null || weathertoday == "") {
                weatherstatus = 0;
            }
            if (rain == null || rain == "") {
                rain = 0;
            }
            if (windspeed == null || windspeed == "") {
                windspeed = 0;
            }
            if (winddirect == null || winddirect == "") {
                winddirect = 0;
            }
            if (humidity == null || humidity == "") {
                windclass = 0;
            }
            if (maxtemp == null || maxtemp == "") {
                maxtemp = 0;
            }
            if (mintemp == null || mintemp == "") {
                mintemp = 0;
            }
            if (forecaster == null || forecaster == "") {
                forecaster = "-";
            }

            maker = forecaster;

            //时间格式化
            forecasttime = forecasttime.split("T");
            forecasttime = forecasttime[0] + " " + forecasttime[1];

            temp = "";
            temp = "<td>";
            temp += forecasttime;
            temp += "</td>";
            temp += "<td>";
            temp += weathertoday;
            temp += "</td>";
            temp += "<td>";
            temp += rain;
            temp += "</td>";
            temp += "<td>";
            temp += windspeed;
            temp += "</td>";
            temp += "<td>";
            temp += winddirect;
            temp += "</td>";
            temp += "<td>";
            temp += humidity;
            temp += "</td>";
            temp += "<td>";
            temp += maxtemp;
            temp += "</td>";
            temp += "<td>";
            temp += mintemp;
            temp += "</td>";
            temp += "<td>";
            temp += maker;
            temp += "</td>";
            temp += "<td>";
            temp += forecaster;
            temp += "</td>";

            temp += "<td onclick='showDetails(this)'>";
            temp += "显示详情";
            temp += "</td>";

            $("#forecastList_table tbody").append("<tr>" + temp + "</tr>");
        }
    })
}


//分区预报数据
function zoneDatas() {
    loadpage();
    $.post('../WebService.asmx/GetZoneDatas', {
        tableInfo: table
    }, function (data, textStatus, xhr) {
        if (data === null || data === undefined || data === "[]" || data === "") {
            griddata = null;
            return;
        }
        if (load) {
            layer.close(load);
        }

        griddatanew = JSON.parse(data)[0];

        var forecasttime;     //制作日期
        var tracecount;      //是否发布
        var traceflag;       //制作标记
        var isedit;          //是否订正
        var traceimag;       //是否生成图片
        var tracechart;      //是否生成Chart
        var push1;           //是否保存至本地服务器
        var push2;           //是否保存至专用服务器
        var recid;           //id
        var forecaster;      //预报员
        var maker;           //制作
        var temp;

        for (var i = 0; i < griddatanew.length; i++) {
            forecasttime = griddatanew[i].DDATETIME;
            tracecount = griddatanew[i].TRACECOUNT;
            traceflag = griddatanew[i].TRACEFLAG;
            isedit = griddatanew[i].ISEDIT;
            traceimag = griddatanew[i].TRACEIMAGE;
            tracechart = griddatanew[i].TRACECHART;
            push1 = griddatanew[i].PUSH1;
            push2 = griddatanew[i].PUSH2;
            forecaster = griddatanew[i].FORECASTER;

            //后台数据格式  0：未完成   1：已完成
            if (tracecount == 0) {
                tracecount = "否";
            } else if (tracecount == 1) {
                tracecount = "是";
            } else if (tracecount == null || tracecount == "") {
                tracecount = "-";
            }
            if (traceflag == 0) {
                traceflag = "否";
            } else if (traceflag == 1) {
                traceflag = "是";
            } else if (traceflag == null || traceflag == "") {
                traceflag = "-";
            }
            if (isedit == 0) {
                isedit = "否";
            } else if (isedit == 1) {
                isedit = "是";
            } else if (isedit == null || isedit == "") {
                isedit = "-";
            }
            if (traceimag == 0) {
                traceimag = "否";
            } else if (traceimag == 1) {
                traceimag = "是";
            } else if (traceimag == null || traceimag == "") {
                traceimag = "-";
            }
            if (tracechart == 0) {
                tracechart = "否";
            } else if (tracechart == 1) {
                tracechart = "是";
            } else if (tracechart == null || tracechart == "") {
                tracechart = "-";
            }
            if (push1 == 0) {
                push1 = "否";
            } else if (push1 == 1) {
                push1 = "是";
            } else if (push1 == null || push1 == "") {
                push1 = "-";
            }
            if (push2 == 0) {
                push2 = "否";
            } else if (push2 == 1) {
                push2 = "是";
            } else if (push2 == null || push2 == "") {
                push2 = "-";
            }
            if (forecaster === null || forecaster === undefined || forecaster === "[]" || forecaster === "") {
                forecaster = "-";
            }

            maker = forecaster;

            //时间格式化
            forecasttime = forecasttime.split("T");
            forecasttime = forecasttime[0] + " " + forecasttime[1];

            temp = "";
            temp = "<td>";
            temp += forecasttime;
            temp += "</td>";
            temp += "<td>";
            temp += tracecount;
            temp += "</td>";
            temp += "<td>";
            temp += traceflag;
            temp += "</td>";
            temp += "<td>";
            temp += isedit;
            temp += "</td>";
            temp += "<td>";
            temp += traceimag;
            temp += "</td>";
            temp += "<td>";
            temp += tracechart;
            temp += "</td>";
            temp += "<td>";
            temp += push1;
            temp += "</td>";
            temp += "<td>";
            temp += push2;
            temp += "</td>";
            temp += "<td>";
            temp += maker;
            temp += "</td>";
            temp += "<td>";
            temp += forecaster;
            temp += "</td>";

            temp += "<td onclick='showDetails(this)'>";
            temp += "显示详情";
            temp += "</td>";

            $("#forecastList_table tbody").append("<tr>" + temp + "</tr>");
        }
    })
}


//专报数据（决策预报、格点预报、旬报、月报、实况、日常、政府、农业、春运、交通专报）
function ForecastDatas() {
    loadpage();
    $.post('../WebService.asmx/GetSpecialReportDatas', {
        table: table
    }, function (data, textStatus, xhr) {
        if (data === null || data === undefined || data === "[]" || data === "") {
            griddata = null;
            return;
        }
        if (load) {
            layer.close(load);
        }

        griddatanew = JSON.parse(data)[0];

        if (val == "决策预报") {
            var ddatetime;       //预报时间
            var forecastdate;    //报文发布时间
            var createword;      //是否生成word
            var fileflag;        //文件生成标志
            var maker;           //制作
            var forecaster;      //分发
            var temp;

            for (var i = 0; i < griddatanew.length; i++) {
                ddatetime = griddatanew[i].DDATETIME;
                forecastdate = griddatanew[i].FORECASTDATE;
                createword = griddatanew[i].CREATEWORD;
                fileflag = griddatanew[i].FILEFLAG;
                forecaster = griddatanew[i].FORECASTER;


                if (createword == null || createword == "" || createword == 0) {
                    createword = "否";
                }
                if (fileflag == null || fileflag == "") {
                    fileflag = "-";
                }
                maker = forecaster;

                //时间格式化
                ddatetime = ddatetime.split("T");
                ddatetime = ddatetime[0] + " " + ddatetime[1];
                forecastdate = dateconvert(forecastdate);

                temp = "";
                temp = "<td>";
                temp += ddatetime;
                temp += "</td>";
                temp += "<td>";
                temp += forecastdate;
                temp += "</td>";
                temp += "<td>";
                temp += createword;
                temp += "</td>";
                temp += "<td>";
                temp += fileflag;
                temp += "</td>";
                temp += "<td>";
                temp += maker;
                temp += "</td>";
                temp += "<td>";
                temp += forecaster;
                temp += "</td>";

                temp += "<td onclick='showDetails(this)'>";
                temp += "显示详情";
                temp += "</td>";

                $("#forecastList_table tbody").append("<tr>" + temp + "</tr>");
            }

        } else if (val == "旬报" || val == "月报" || val == "实况预报" || val == "日常预报" || val == "政府专报" || val == "农业专报" || val == "春运专报" || val == "交通专报") {
            var ddatetime;       //预报时间
            var fileflag;        //文件生成标志
            var maker;           //制作
            var forecaster;      //分发
            var temp;

            for (var i = 0; i < griddatanew.length; i++) {
                ddatetime = griddatanew[i].DDATETIME;
                fileflag = griddatanew[i].FILEFLAG;
                forecaster = griddatanew[i].FORECASTER;


                if (fileflag == null || fileflag == "") {
                    fileflag = "-";
                }
                maker = forecaster;

                //时间格式化
                ddatetime = ddatetime.split("T");
                ddatetime = ddatetime[0] + " " + ddatetime[1];

                temp = "";
                temp = "<td style='width:1%'>";
                temp += ddatetime;
                temp += "</td>";
                temp += "<td style='width:1%'>";
                temp += fileflag;
                temp += "</td>";
                temp += "<td style='width:1%'>";
                temp += maker;
                temp += "</td>";
                temp += "<td style='width:1%'>";
                temp += forecaster;
                temp += "</td>";

                temp += "<td  style='width:1%' onclick='showDetails(this)'>";
                temp += "显示详情";
                temp += "</td>";

                $("#forecastList_table tbody").append("<tr>" + temp + "</tr>");
            }
        } else if (val == "格点预报") {
            var ddatetime;       //预报时次
            var forecastdate;    //预报时间
            var maker;           //制作
            var forecaster;      //分发
            var rhsfc;           //相对湿度
            var rain;            //累计降雨
            var visi;            //能见度
            var maxtemp;          //最高气温
            var mintemp;          //最低气温
            var temp;

            for (var i = 0; i < griddatanew.length; i++) {
                ddatetime = griddatanew[i].DDATETIME;
                forecastdate = griddatanew[i].FORECASTTIME;
                rhsfc = griddatanew[i].RHSFC;
                rain = griddatanew[i].RAIN;
                visi = griddatanew[i].VISI;
                maxtemp = griddatanew[i].MAXTEMP;
                mintemp = griddatanew[i].MINTEMP;

                //判断数据 页面数据显示不为空
                if (fileflag == null || fileflag == "") {
                    fileflag = "-";
                }
                if (visi == null || visi=="") {
                    visi = "-";
                }
                maker = forecaster;

                //时间格式化
                ddatetime = ddatetime.split("T");
                ddatetime = ddatetime[0] + " " + ddatetime[1];
                forecastdate = forecastdate.split("T");
                forecastdate = forecastdate[0] + " " + forecastdate[1];

                temp = "";
                temp = "<td style='width:1%'>";
                temp += ddatetime;
                temp += "</td>";
                temp += "<td style='width:1%'>";
                temp += forecastdate;
                temp += "</td>";
                temp += "<td style='width:1%'>";
                temp += rhsfc;
                temp += "</td>";
                temp += "<td style='width:1%'>";
                temp += rain;
                temp += "</td>";
                temp += "<td style='width:1%'>";
                temp += visi;
                temp += "</td>";
                temp += "<td style='width:1%'>";
                temp += maxtemp;
                temp += "</td>";
                temp += "<td style='width:1%'>";
                temp += mintemp;
                temp += "</td>";

                temp += "<td  style='width:1%' onclick='showDetails(this)'>";
                temp += "显示详情";
                temp += "</td>";

                $("#forecastList_table tbody").append("<tr>" + temp + "</tr>");
            }
        }
    })
}

//假日专报
function HolidayDatas() {
    loadpage();
    $.post('../WebService.asmx/GetHolidays', {
        NationalTB: "sf_nationalforecast",
        GaokaoTB: "sf_gaokaoforecast",
        ZhongkaoTB: "sf_zhongkaoforecast",
        SpringTB: "sf_springforecast",
        DuanwuTB: "sf_duanwuforecast"
    }, function (data, textStatus, xhr) {
        if (data === null || data === undefined || data === "[]" || data === "") {
            griddata = null;
            return;
        }
        if (load) {
            layer.close(load);
        }

        griddatanew = JSON.parse(data)[0];

        var ddatetime;       //预报时间
        var fileflag;        //文件生成标志
        var maker;           //制作
        var forecaster;      //分发
        var temp;           

        for (var i = 0; i < griddatanew.length; i++) {
            ddatetime = griddatanew[i].DDATETIME;
            fileflag = griddatanew[i].FILEFLAG;
            forecaster = griddatanew[i].FORECASTER;

            if (fileflag == null || fileflag == "") {
                fileflag = "-";
            }
            maker = forecaster;

            //时间格式化
            ddatetime = ddatetime.split("T");
            ddatetime = ddatetime[0] + " " + ddatetime[1];

            temp = "";
            temp = "<td style='width:1%'>";
            temp += ddatetime;
            temp += "</td>";
            temp += "<td style='width:1%'>";
            temp += fileflag;
            temp += "</td>";
            temp += "<td style='width:1%'>";
            temp += maker;
            temp += "</td>";
            temp += "<td style='width:1%'>";
            temp += forecaster;
            temp += "</td>";

            temp += "<td  style='width:1%' onclick='showDetails(this)'>";
            temp += "显示详情";
            temp += "</td>";

            $("#forecastList_table tbody").append("<tr>" + temp + "</tr>");
        }
    })
}

function showDetails(val) {
    var str = "";
    var nowtitle = $(val).parent().parent().siblings()[0];
    var nowCont = $(val).parent().children();
    nowtitle = nowtitle.childNodes[0].childNodes;

    //表格头部字段以及对应的信息
    for (var i = 0; i < nowtitle.length - 1; i++) {
        str += "<li>" + nowtitle[i].innerText + "：<b>" + nowCont.eq(i).text() + "</b></li>";
    }

    $(".showDt ul").html(str);
    $(".showbg").fadeIn().show();
    $(".showDt").fadeIn().show();
    $(".showbg").css("height", $(document).height());
}

function close_pic() {
    $(".showbg").fadeOut().hide();
    $(".showDt").fadeOut().hide();
}

//load方法
function loadpage() {
    load = layer.msg('加载中', {
        icon: 16
        , shade: 0.01
    });
}

//中文日期格式转换为数字日期格式
function dateconvert(dateStr) {
    var dict = {
        "O": "0",
        "一": "1",
        "二": "2",
        "三": "3",
        "四": "4",
        "五": "5",
        "六": "6",
        "七": "7",
        "八": "8",
        "九": "9",
        "十": "10",
        "十一": "11",
        "十二": "12",
        "十三": "13",
        "十四": "14",
        "十五": "15",
        "十六": "16",
        "十七": "17",
        "十八": "18",
        "十九": "19",
        "二十": "20",
        "二十一": "21",
        "二十二": "22",
        "二十": "23",
        "二十四": "24",
        "二十五": "25",
        "二十六": "26",
        "二十七": "27",
        "二十八": "28",
        "二十九": "29",
        "三十": "30",
        "三十一": "31"
    };

    var date = dateStr.split('年'),
        yy = date[0],
        mm = date[1].split('月')[0],
        dd = date[1].split('月')[1].split('日')[0];

    var hourdate = dateStr.split('日')[1],
        hh = hourdate.split('时')[0];


    var yearStr = dict[yy[0]] + dict[yy[1]] + dict[yy[2]] + dict[yy[3]] + '-',
        monthStr = dict[mm] + '-',
        dayStr = dict[dd] + ' ',
        hourStr = dict[hh] + ':00:00';
    var newtime = yearStr + monthStr + dayStr + hourStr;
    return newtime;
}
