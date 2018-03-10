var locationInfo = [19.99309106118404, 110.5027587890625],
    zm = 10,
    /**
     * [extent 地图坐标范围]
     * @type {Array}
     *///
    extent = [
        [17.3125, 107.5],
        [21.6875, 112.5]
    ],
    map_aws = null, map_road = null, AWSDatas = null, RoadAWSDatas = null, loadvariable = null, ISFirstTime = true, Popuppage = null;

$(function () {
    //适配不同分辨率
    //$("body").css("zoom", screen.width / 1600);
    //$("#layui-layer1").css("-ms-zoom", screen.width / 1600);

    ChangeForeHour();
    FileTime();
    mapInit("map_road", map_road);
    mapInit("map_aws", map_aws);
    GetForecaster();
    $("#txtdate ul li button").click(function () {
        $("#txtdate ul li button").removeClass("active");
        $(this).addClass("active");
        GetSZForecastTXT();
    })
    $("#awselement ul li button").click(function () {
        $("#awselement ul li button").removeClass("active");
        $(this).addClass("active");
        if ($(this).attr("data-valuename") == "RAIN") {
            $(".awswhenlong").show();
        }
        else {
            $(".awswhenlong").hide();
        }
        var title = "雨量";
        if (this.innerHTML != "降雨") {
            title = this.innerHTML;
        }
        $(".FS_awsmaptitle").html("海口市" + title + "分布图");
        ChangeAWSmaptitle();
        GetAwsDatas();
        var colourcodepath = "rain";
        switch (this.innerHTML) {
            case "降雨":
                colourcodepath = "rain";
                break;
            case "能见度":
                colourcodepath = "V";
                break
            case "温度":
                colourcodepath = "T";
                break;
            case "风力":
                colourcodepath = "wind";
                break;
            //case "湿度":
            //    colourcodepath = "U";
            //    break;
        }
        $(".colourcode").attr("src", "../Images/" + colourcodepath + ".png");//加载图例
    })
    $(".awswhenlong ul li button").click(function () {
        $(".awswhenlong ul li button").removeClass("active");
        $(this).addClass("active");
        GetAwsDatas();
    })
    $("#FS_ForeTime,#FS_AWSTime").val(new Date().format("yyyy-MM-dd"));
    $("#time_hour").val(new Date().format("hh"));
    $("#time_min").val((parseInt((+new Date().format("mm")) / 5) * 5 ).toString().length == 1 ? "0" + (parseInt((+new Date().format("mm")) / 5) * 5 ).toString() : (parseInt((+new Date().format("mm")) / 5) * 5 ).toString());
    var datemin = $("#time_min").val();
    if (datemin < 10) {
        $("#time_hour").val((parseInt(+new Date().format("hh")) - 1).toString().length == 1 ? "0" + (parseInt(+new Date().format("hh")) - 1).toString() : (parseInt(+new Date().format("hh")) - 1).toString());
        $("#time_min").val("00");
    }
    else {
        $("#time_min").val((parseInt(datemin) - 10).toString().length==1?"0"+(parseInt(datemin) - 10).toString():(parseInt(datemin) - 10).toString());
    }
    GetAwsDatas();
    $("#FS_ForeTime,#FS_AWSTime").on('focus', function () {
        var id = this.id;
        WdatePicker({
            skin: 'whyGreen',
            dateFmt: "yyyy-MM-dd",
            minDate: "1980-01-01",
            maxDate: new Date(),
            startDate: '%y-%M-%d',
            isShowClear: false,
            onpicked: function (dp) {
                if (id == "FS_ForeTime") {
                    GetSZForecastTXT();
                }
                else {
                    // GetAwsDatas();
                }
            }
        });
    });

    $("#FS_Toupdate,#FS_ToNewest").click(function () {
        $(".timeOperation ul li button").removeClass("active");
        var id = this.id;
        switch (id) {
            case "FS_ToNewest":                
                $("#FS_ToNewest").addClass("active");
                $("#FS_AWSTime").val(new Date().format("yyyy-MM-dd"));
                $("#time_hour").val(new Date().format("hh"));
                $("#time_min").val((parseInt((+new Date().format("mm")) / 5) * 5 - 10).toString().length == 1 ? "0" + (parseInt((+new Date().format("mm")) / 5) * 5 - 10).toString() : (parseInt((+new Date().format("mm")) / 5) * 5 - 10).toString());
                break;
            case "":
                break;
            default:
                $("#FS_Toupdate").addClass("active");
                break;
        }
        GetAwsDatas();
    })
    $(".btn_preview").click(function () {
        var h = document.documentElement.clientHeight;
        if (h > 780) {
            h = 780;
        }
        Popuppage = layer.open({
            title: ['发布预览', 'font-size:16px;font-weight:bold;font-family:微软雅黑;color:white'],
            type: 1,
            //skin: 'layui-layer-rim', //加上边框
            area: ['720px', '' + h + 'px'], //宽高
            content: $(".MessagePreview"),
            btnAlign: 'c',
            btn: ['发布', '编辑'],
            yes: function (index, layero) {
                //按钮【按钮一】的回调
                //询问框
                layer.confirm('确定提交数据？', {
                    //title: "", 
                    btnAlign: 'c',
                    btn: ['确定', '取消'] //按钮
                }, function () {
                    layer.msg('保存成功！', { icon: 1, time: 1000 });
                }, function () {
                    //layer.msg('也可以这样', {
                    //    time: 20000, //20s后自动关闭
                    //    btn: ['明白了', '知道了']
                    //});
                });
            }
           , btn2: function (index, layero) {
               //按钮【按钮二】的回调
               //alert(2);
               //return false 开启该代码可禁止点击该按钮关闭
           }
        });
        var Onandoffdutytitle = "上班重点时段分区天气预报";
        var ddatetime = ($("#FS_ForeTime").val() + " " + $("#txtdate ul li button.active").attr("data-hour") + ":00:00").toDate();
        $(".mp_number").html(ddatetime.format("yyyyMMdd0") + $("#txtdate ul li button.active").attr("data-index"));
        if (ddatetime.getHours() > 12) {
            Onandoffdutytitle = "下班重点时段分区天气预报";
        }
        $(".mp_Forecaster").html($("#SF_Forecaster").val());
        $(".FS_Onandoffduty").html(Onandoffdutytitle);
        $(".MessagePreview .FS_Hg").html($(".FS_Weatherreview .FS_Forecastcontent").val());
        $(".MessagePreview .FS_Fore").html($(".FS_WeatherCommute .FS_Forecastcontent").val());

        //var sntime = $("#txtdate ul li button.active").next("button").attr("data-hour");
        var sntime = $("#txtdate ul li button.active").parent().next().attr("data-hour");

        //$(".mp_ReleaseTime").html($("#txtdate ul li button.active").next("button").attr("data-hour") + ":00");
        $(".mp_ReleaseTime").html($("#txtdate ul li button.active").parent().next().attr("data-hour") + ":00");
    })
})
//加载层
function loaddata() {
    //加载层-风格4
    loadvariable = layer.msg('加载中', {
        icon: 16
      , shade: 0.01
    });
}
function ChangeAWSmaptitle() {
    var map_aws_title = "";
    switch ($("#awselement ul li button.active").html()) {
        case "降雨":
            var starttime = GetUITime().toDate();
            starttime.addMinutes(-(+$(".awswhenlong ul li button.active").attr("data-min")));
            map_aws_title = starttime.format("yyyy-MM-dd hh:mm") + "到";
            map_aws_title += GetUITime().toDate().format("yyyy-MM-dd hh:mm") + $(".awswhenlong ul li button.active").attr("title") + "累计雨量";
            break;
        case "能见度":
            map_aws_title = GetUITime().toDate().format("yyyy-MM-dd hh:mm") + "能见度实况";
            break;
        case "温度":
            map_aws_title = GetUITime().toDate().format("yyyy-MM-dd hh:mm") + "温度实况";
            break;
        case "风力":
            map_aws_title = GetUITime().toDate().format("yyyy-MM-dd hh:mm") + "风力实况";
            break;
        case "湿度"://XGQ添加
            map_aws_title = GetUITime().toDate().format("yyyy-MM-dd hh:mm") + "湿度实况";
            break;
        default:
            break;
    }
    $(".map_aws_title").html(map_aws_title);
}
function ChangeForeHour() {
    var nowtimehour = (+new Date().format("hh"));
    var fortimehour = 6;
    if (nowtimehour < 7) {
        fortimehour = 7;
    }
    if (nowtimehour > 7) {
        fortimehour = 8;
    }
    if (nowtimehour > 8) {
        fortimehour = 17;
    }
    if (nowtimehour > 17) {
        fortimehour = 18;
    }
    if (nowtimehour > 18) {
        fortimehour = 19;
    }
    if (nowtimehour > 19) {
        fortimehour = 19;
    }
    var SF_forehourminlist = $("#txtdate ul li").find("button");
    for (var i = 0; i < SF_forehourminlist.length; i++) {
        if ($(SF_forehourminlist[i]).attr("data-hour") == fortimehour) {
            $(SF_forehourminlist[i]).addClass("active");
        }
        else {
            $(SF_forehourminlist[i]).removeClass("active");
        }
    }
}
//填充小时分钟数据
function FileTime() {
    var strhtml = "";
    for (var i = 0; i < 24; i++) {
        strhtml += "<option>" + (i.toString().length == 1 ? "0" + i.toString() : i.toString()) + "</option>";
    }
    $("#time_hour").html(strhtml);
    strhtml = "";
    for (var i = 0; i < 60; i++) {
        if (i % 5 == 0) {
            strhtml += "<option>" + (i.toString().length == 1 ? "0" + i.toString() : i.toString()) + "</option>";
        }
    }
    $("#time_min").html(strhtml);
}
//加载地图方法
function mapInit(mapName) {
    var GoogleLayer1 = L.tileLayer('http://{s}.google.cn/vt/lyrs=m&hl=zh-CN&gl=cn&x={x}&y={y}&z={z}&apistyle=s.t%3A18%7Cs.e%3Ag.s%7Cp.c%3Affffff%2Cs.t%3A0%7Cp.v%3Aoff%2Cs.t%3A5%7Cp.v%3Aon%2Cs.t%3A18%7Cp.v%3Aon%2Cs.t%3A0%7Cs.e%3Ag.f%7Cp.c%3Affffffff%2Cs.t%3A6%7Cs.e%3Ag.f%7Cp.c%3AffB2D1FF%7Cp.v%3Aon', {
        subdomains: ["mt0", "mt1", "mt2", "mt3"]
    });
    var GoogleLayer2 = L.tileLayer('http://{s}.google.cn/vt/lyrs=y&hl=zh-CN&gl=cn&x={x}&y={y}&z={z}', {
        subdomains: ["mt0", "mt1", "mt2", "mt3"]
    });
    var GoogleLayer3 = L.tileLayer('http://{s}.google.cn/vt/lyrs=m&hl=zh-CN&gl=cn&x={x}&y={y}&z={z}', {
        subdomains: ["mt0", "mt1", "mt2", "mt3"]
    });
    var map = L.map(mapName, {
        zoomControl: false,
        attributionControl: false,
        center: locationInfo,
        zoom: zm,
        //maxZoom: maxZm,
        //minZoom: minZm,
        layers: [GoogleLayer1]
    })
        .on('click', function (e) {
            console.info(e);
        });

    var zoomControl = L.control.zoom({
        position: 'bottomright',
        zoomInTitle: '放大地图',
        zoomOutTitle: '缩小地图',

    });
    map.addControl(zoomControl);
    /**
     * [baseLayers 地图层级按钮组]
     * @type {Object}
     */
    var baseLayers = {
        "地形图": GoogleLayer1,
        "卫星图": GoogleLayer2,
        "路线图": GoogleLayer3
    };
    polygon.addTo(map);//加载海口市边界
    //L.control.layers(baseLayers).addTo(map);
    //L.control.scale().addTo(map);
    if (mapName == "map_road") {
        map_road = map;
    } else {
        map_aws = map;
    }
}
//加载预报员数据
function GetForecaster() {
    $.post('/WebService.asmx/GetUserInfo', function (data, textStatus, xhr) {
        if (data === null || data === undefined || data === "[]") {
            return;
        }
        var userdatas = JSON.parse(data);
        var i = 0;
        var strhtml = "";
        $(userdatas).each(function () {
            if (i === 0) {
                strhtml = "<option value=\"" + this.USERNAME + "\" selected=\"selected\">" + this.USERNAME + "</option>";
            } else{
                strhtml += "<option value=\"" + this.USERNAME + "\">" + this.USERNAME + "</option>";
            }
            i++;
        })
        $("#SF_Forecaster").html(strhtml);
        GetSZForecastTXT();
    }).error(function (xhr) {
        layer.msg('数据出错，请刷新重试。', {
            icon: 5
        });
    });
}
//获取天气回顾、上下班时段分区预报数据
function GetSZForecastTXT() {
    var dayHour = $("#txtdate ul li button.active").attr("data-hour");
    $.post('/WebService.asmx/GetSZForecastTXT', {
        strdt: $("#FS_ForeTime").val(),
        dayHour: dayHour
    }, function (data, textStatus, xhr) {
        if (data === null || data === undefined || data === "[]") {
            return;
        }
        var foredatas = JSON.parse(data);
        $(".FS_Weatherreview .FS_Forecastcontent").val(foredatas[0][1]);
        var ss = foredatas[4][1];
        $("#SF_Forecaster").val(foredatas[4][1])
        var strForecast = foredatas[3][1];
        var index1 = strForecast.indexOf("，");
        if (index1 > 0) {
            if (dayHour > 12) {
                strForecast = "预计" + dayHour + "-20时" + strForecast.substring(index1);
            }
            else {
                strForecast = "预计早晨" + dayHour + "-9时" + strForecast.substring(index1);
            }
        }
        else {
            if (strForecast.indexOf("#") != -1) {
                strForecast = strForecast.split('#');
                strForecast = strForecast[2];
            }
        }
        $(".FS_WeatherCommute .FS_Forecastcontent").val(strForecast);
        var microblog = document.getElementById("microblog");
        var email = document.getElementById("email");

        if (foredatas[5][1] != "") {
            if (foredatas[5][1].indexOf("1") != -1) {
                microblog.checked = true;
            }
            else {
                microblog.checked = false;
            }
        }
        else {
            microblog.checked = false;
        }
        if (foredatas[6][1] != "") {
            if (foredatas[6][1].indexOf("1") != -1) {
                email.checked = true;
            }
            else {
                email.checked = true;
            }
        }
        else {
            email.checked = false;
        }
    }).error(function (xhr) {
        layer.msg('数据出错，请刷新重试。', {
            icon: 5
        });
    });
}
function GetUITime() {
    return $("#FS_AWSTime").val() + " " + $("#time_hour").val() + ":" + $("#time_min").val() + ":00";
}
//获取自动站数据
function GetAwsDatas() {
    loaddata();
    ChangeAWSmaptitle();
    var valuesname = $("#awselement ul li button.active").attr("data-valuename");
    switch (valuesname) {
        case "RAIN":
            valuesname = $(".awswhenlong ul li button.active").attr("data-type");
            break
        case "V":
            break
        case "T":
            break
        case "WD2DF":
            break
        default:
            break;
    }
    $.post('/WebService.asmx/GetAwsDatas', {
        strdt: GetUITime(),
        valuesname: valuesname
    }, function (data, textStatus, xhr) {
        if (data === null || data === undefined || data === "[]") {
            return;
        }
        AWSDatas = JSON.parse(data);
        addAWSToMap();
    }).error(function (xhr) {
        layer.msg('数据出错，请刷新重试。', {
            icon: 5
        });
    });
    $.post('/WebService.asmx/GetRainGridWeatherInfoList', {
        strdt: GetUITime(),
        valuesname: valuesname
    }, function (data, textStatus, xhr) {
        if (data === null || data === undefined || data === "[]") {
            return;
        }
        RoadAWSDatas = JSON.parse(data);
        DrawRoad();
        layer.close(loadvariable);
    }).error(function (xhr) {
        layer.msg('数据出错，请刷新重试。', {
            icon: 5
        });
    });
}
function DrawRoad() {
    var unit = "mm", title = "降雨量";
    switch ($("#awselement ul li button.active").html()) {
        case "降雨":
            unit = "mm";
            title = "降雨量";
            break;
        case "能见度":
            unit = "km";
            title = "能见度";
            break;
        case "温度":
            unit = "℃";
            title = "温度";
            break;
        case "风力":
            title = "风速";
            unit = "m/s";
            break;
    }
    $(".roadline").remove();
    if (ISFirstTime) {
        $.each(RoadAWSDatas, function (i) {
            var polygon1 = L.polyline([[this.Y2, this.X2], [this.Y1, this.X1]], { className: "", weight: 5, opacity: 1, color: "#808080" }).addTo(map_road);
        })
        ISFirstTime = false;
    }
    $.each(RoadAWSDatas, function (i) {
        var polygon = L.polyline([[this.Y2, this.X2], [this.Y1, this.X1]], { className: "roadline", weight: 3, opacity: 1, color: GetRoadColor(this.Z) }).addTo(map_road);
        var strHtml = "<div><p>道路名：" + this.RoadName + "</p><p>" + title + "：<span style='color:red'>" + this.Z.toFixed(1) + "</span>" + unit + "</p></div>";
        var popup = L.popup({ minWidth: 150 });
        popup.setContent(strHtml)
        polygon.bindPopup(popup);
        polygon.on('mouseover', function (e) {
            popup.setLatLng(e.latlng)
            map_road.openPopup(popup);
        })
    })
}
function GetRoadColor(num) {
    switch ($("#awselement ul li button.active").html()) {
        case "降雨":
            if (num > 0.1 && num < 2) return "rgba(0, 233,233,1)";//小雨
            if (num >= 2 && num < 8) return "rgba(0,151,244,1)";//中雨
            if (num >= 8 && num < 20) return "rgba(0,194,0,1)";//大雨
            if (num >= 20 && num < 35) return "rgba(255,255,0,1)";//暴雨
            if (num >= 35 && num < 70) return "rgba(255,134,0,1)";//大暴雨
            if (num >= 70) return "rgba(255,0,0,1)";//特大暴雨
            break;
        case "能见度":
            num = num * 1000;
            if (num <= 50 && num >= 0) {
                return "rgba(255, 0, 255,1)";
            }
            if (num > 50 && num <= 100) {
                return "rgba(192, 0, 0,1)";
            }
            if (num > 100 && num <= 200) {
                return "rgba(213, 0, 0,1)";
            }
            if (num > 200 && num <= 500) {
                return "rgba(255, 0, 0,1)";
            }
            if (num > 500 && num <= 1000) {
                return "rgba(255, 144, 0,1)";
            }
            if (num > 1000 && num <= 2000) {
                return "rgba(231, 192, 0,1)";
            }
            if (num > 2000 && num <= 5000) {
                return "rgba(255, 255, 0,1)";
            }
            if (num > 5000 && num <= 10000) {
                return "rgba(0, 144, 0,1)";
            }
            if (num > 10000 && num <= 15000) {
                return "rgba(0, 200, 0,1)";
            }
            if (num > 15000 && num <= 25000) {
                return "rgba(0, 255, 0,1)";
            }
            if (num > 25000 && num <= 50000) {
                return "rgba(0, 0, 246,1)";
            }
            if (num > 50000 && num <= 100000) {
                return "rgba(0, 160, 245,1)";
            }
            if (num > 150000 && num <= 200000) {
                return "rgba(0, 235, 235,1)";
            }
            if (num > 200000) {
                return "green";
            }
            break;
        case "温度":
            var Month = +new Date().format("MM");
            if (Month > 10 || Month < 4) {
                if (num < 0) return "rgba(255, 0, 0, 255,1)";
                if (num >= 0 && num < 1) return "rgba(0, 88, 255,1)";
                if (num >= 1 && num < 2) return "rgba(0, 139, 255,1)";
                if (num >= 2 && num < 3) return "rgba(0, 190, 255,1)";
                if (num >= 3 && num < 4) return "rgba(0, 255, 255,1)";
                if (num >= 4 && num < 6) return "rgba(0, 230, 204,1)";
                if (num >= 6 && num < 8) return "rgba(0, 204, 126,1)";
                if (num >= 8 && num < 10) return "rgba(0, 179, 0,1)";
                if (num >= 10 && num < 12) return "rgba(126, 204, 0,1)";
                if (num >= 12 && num < 14) return "rgba(204, 230, 0,1)";
                if (num >= 14 && num < 16) return "rgba(255, 255, 0,1)";
                if (num >= 16 && num < 18) return "rgba(255, 204, 0,1)";
                if (num >= 18 && num < 20) return "rgba(255, 153, 0,1)";
                if (num >= 20 && num < 25) return "rgba(255, 102, 0,1)";
                if (num >= 25) return "rgba(255, 0, 0,1)";
            }
            else {
                if (num < 10) return "rgba(0, 0, 255,1)";
                if (num >= 10 && num < 11) return "rgba(0, 88, 255,1)";
                if (num >= 11 && num < 12) return "rgba(0, 139, 255,1)";
                if (num >= 12 && num < 14) return "rgba(0, 190, 255,1)";
                if (num >= 14 && num < 20) return "rgba(0, 255, 255,1)";
                if (num >= 20 && num < 22) return "rgba(0, 230, 204,1)";
                if (num >= 22 && num < 24) return "rgba(0, 204, 126,1)";
                if (num >= 24 && num < 26) return "rgba(0, 179, 0,1)";
                if (num >= 26 && num < 28) return "rgba(126, 204, 0,1)";
                if (num >= 28 && num < 30) return "rgba(204, 230, 0,1)";
                if (num >= 30 && num < 32) return "rgba(255, 255, 0,1)";
                if (num >= 32 && num < 33) return "rgba(255, 204, 0,1)";
                if (num >= 33 && num < 34) return "rgba(255, 153, 0,1)";
                if (num >= 34 && num < 35) return "rgba(255, 102, 0,1)";
                if (num >= 35) return "rgba(255, 0, 0,1)";
            }
            break;
        case "风力":
            if (num >= 8.0 && num < 10.8) return "rgba(0, 179, 0,1)";
            if (num >= 10.8 && num < 13.9) return "rgba(126, 204, 0,1)";
            if (num >= 13.9 && num < 17.2) return "rgba(204, 230, 0,1)";
            if (num >= 17.2 && num < 20.8) return "rgba(255, 255, 0,1)";
            if (num >= 20.8 && num < 24.5) return "rgba(255, 204, 0,1)";
            if (num >= 24.5 && num < 28.5) return "rgba(255, 153, 0,1)";
            if (num >= 28.5 && num < 32.6) return "rgba(255, 102, 0,1)";
            if (num >= 32.6) return "rgba(255, 0, 0,1)";
            break;
    }
    return "#D3D3D3";
}
/**
 * [addAWSToMap 添加自动站站点数值显示]
 * @param {[type]} value [description]
 */
function addAWSToMap() {
    $(".showawstext").remove();
    $(AWSDatas).each(function (i) {
        var winddirect = "";
        var number = "";
        var value = $("#awselement ul li button.active").attr("data-valuename");
        switch (value) {
            case "RAIN":
                switch ($(".awswhenlong ul li button.active").attr("data-type")) {
                    case "R30M":
                        number = (+this.R30M);
                        break;
                    case "R01H":
                        number = (+this.R01H);
                        break;
                    case "R02H":
                        number = (+this.R02H);
                        break;
                    case "R03H":
                        number = (+this.R03H);
                        break;
                    default:
                        break;
                }
                break;
            case "V":
                number = (+this.V);
                break;
            case "T":
                number = (+this.T);
                break;
            case "WD2DF":
                number = (+this.WD2DF);
                winddirect = this.WD2DD;
                break;
            case "U":
                number = (+this.U);
                //case "u":
                //    number = this.U;
                //    break;
                //case "v":
                //    number = this.V;
                //    break;
                //case "R01H":
                //    number = this.R01H;
                //    break;
                //case "R03H":
                //    number = this.R03H;
                //    break;
                //case "R06H":
                //    number = this.R06H;
                //    break;
                //case "R24H":
                //    number = this.R24H;
                //    break;
                //default:
        }
        if (number != null) {

            if (winddirect != "") {
                var canvas = document.createElement("canvas");
                canvas.width = 64;
                canvas.height = 64;
                var ctx = canvas.getContext('2d');
                ctx.lineWidth = 1;
                ctx.strokeStyle = "#adf71e"; //轮廓颜色
                drawBar(ctx, [canvas.width / 2, canvas.height / 2], number, winddirect);
                var myIcon = L.icon({
                    className: 'showawstext awswind awswind',
                    iconUrl: canvas.toDataURL(),
                    iconSize: [64, 64]
                });
                L.marker([this.LATITUDE, this.LONGITUDE], { icon: myIcon }).addTo(map_aws).bindPopup(this.OBTNAME);
                $(".awswind").parent("div").attr("style", "z-index:200");
            }
            var color = "black";
            if (value == "RAIN") {
                if (number == 0) {
                    color = "#808080";
                }
            }
            L.circleMarker([this.LATITUDE, this.LONGITUDE], {
                radius: 0.5,
                color: 'green',
                fillColor: 'green',
                fillOpacity: 0.8,
                className: 'showawstext'
            }).addTo(map_aws).bindPopup(this.OBTNAME);
            number = number.toFixed(1);
            if (value == "V") {
                number = (number / 1000).toFixed(1) + "KM";
            }
            var opaqueIcon = new L.DivIcon({ className: 'showawstext awstext', html: "<span style='color: " + color + ";'>" + number + "<span>" });
            var marker = new L.Marker([this.LATITUDE, this.LONGITUDE], { icon: opaqueIcon }).addTo(map_aws);

        }
    })
}


//绘制风向
/***************************************************************************/
(function () {
    Array.prototype.getPoint = function (_0x11D04, _0x11CD4, _0x11CA4) {
        _0x11CA4 = _0x11CA4 * Math.PI / 180;
        return [_0x11D04[0] + _0x11CD4 * Math.cos(_0x11CA4), _0x11D04[1] + _0x11CD4 * Math.sin(_0x11CA4)]
    };
    Array.prototype.line = function (_0x11CA4, _0x11D64, _0x11D34) {
        var _0x11D94 = this.getPoint(this, _0x11D64, this.direct + _0x11CA4);
        this.context.lineTo(_0x11D94[0], _0x11D94[1]);
        if (_0x11D34) { this.context.fill() };
        return _0x11D94
    };
    Array.prototype.flag = function (_0x11D64) {
        return this.line(180, _0x11D64).line(-23, _0x11D64 + 1, true)
    };
    Array.prototype.circle = function (_0x11DC4) {
        var _0x11DF4 = (this.direct + 90) * Math.PI / 180;
        this.context.arc(this[0], this[1], _0x11DC4, _0x11DF4, _0x11DF4 + Math.PI * 2, false);
        this.context.fill();
        return this
    };
    Array.prototype.move = function (_0x11CA4, _0x11D64) {
        var _0x11D94 = this.getPoint(this, _0x11D64, this.direct + _0x11CA4 + 90);
        this.context.moveTo(_0x11D94[0], _0x11D94[1]);
        return _0x11D94
    };
    Array.prototype.top = function (_0x11D64) {
        return this.move(180, _0x11D64)
    };
    Array.prototype.wind = function (_0x11D64) {
        return this.line(155, _0x11D64)
    }
})();
function drawBar(context, center, windspeed, winddirect) {
    winddirect -= 180; if (winddirect < 0) winddirect += 360;
    Array.prototype.direct = winddirect;
    Array.prototype.context = context;
    if (windspeed >= 46) windspeed = 46;
    else if (windspeed >= 12) windspeed -= windspeed % 2;
    else if (windspeed >= 11) windspeed = 11;
    else if (windspeed >= 2.5) windspeed -= windspeed % 2;
    else windspeed = 0;
    context.strokeStyle = windspeed >= 11 ? "#F00" : "#000";
    context.fillStyle = context.strokeStyle;
    context.beginPath();
    var bamb = function () { return center.circle(1).line(90, 23); }, bt;
    if (windspeed == 0) { bamb(); }
    else if (windspeed <= 2.5) { bamb().top(4).wind(5); }
    else if (windspeed == 4) { bamb().wind(8); }
    else if (windspeed == 6) { bt = bamb(); bt.wind(8); bt.top(4).wind(5); }
    else if (windspeed == 8) { bt = bamb(); bt.wind(8); bt.top(4).wind(8); }
    else if (windspeed <= 11) { bt = bamb(); bt.wind(8); bt.top(4).wind(8); bt.top(7).wind(5); }
    else if (windspeed == 12) { bt = bamb(); bt.wind(8); bt.top(4).wind(8); bt.top(7).wind(8); }
    else if (windspeed == 14) { bt = bamb(); bt.wind(8); bt.top(4).wind(8); bt.top(7).wind(8); bt.top(10).wind(5); }
    else if (windspeed == 16) { bt = bamb(); bt.wind(8); bt.top(4).wind(8); bt.top(7).wind(8); bt.top(10).wind(8); }
    else if (windspeed == 18) { bt = bamb(); bt.wind(8); bt.top(4).wind(8); bt.top(7).wind(8); bt.top(10).wind(8); bt.top(24).wind(5); }
    else if (windspeed == 20) { bt = bamb().flag(8) }
    else if (windspeed == 22) { bt = bamb().flag(8).top(3).wind(5); }
    else if (windspeed == 24) { bt = bamb().flag(8).top(6).wind(8); }
    else if (windspeed == 26) { bt = bamb().flag(8).top(4); bt.wind(8); bt.top(4).wind(5); }
    else if (windspeed == 28) { bt = bamb().flag(8).top(4); bt.wind(8); bt.top(4).wind(8); }
    else if (windspeed == 30) { bt = bamb().flag(8).top(4); bt.wind(8); bt.top(4).wind(8); bt.top(7).wind(6); }
    else if (windspeed == 32) { bt = bamb().flag(8).top(4); bt.wind(8); bt.top(4).wind(8); bt.top(7).wind(8); }
    else if (windspeed == 36) { bt = bamb().flag(8).top(4); bt.wind(8); bt.top(4).wind(8); bt.top(7).wind(8); bt.top(10).wind(8); }
    else if (windspeed == 38) { bt = bamb().flag(8).top(4); bt.wind(8); bt.top(4).wind(8); bt.top(7).wind(8); bt.top(10).wind(8); bt.top(14).wind(5); }
    else if (windspeed == 40) { bt = bamb().flag(8).top(1).flag(4); }
    else if (windspeed == 42) { bt = bamb().flag(8).top(1).flag(4).top(4).wind(5); }
    else if (windspeed == 44) { bt = bamb().flag(8).top(1).flag(4).top(4).wind(5); }
    else if (windspeed == 46) { bt = bamb().flag(8).top(1).flag(4).top(4); bt.wind(8); bt.top(4).wind(5); }
    context.stroke();
}
//添加海口市边界-根据坐标
var haikou_border = [[20.0892, 110.0693], [20.1022, 110.1956], [20.1276, 110.3535],
[20.1798, 110.4634], [20.1022, 110.5444], [20.0755, 110.5472],
[20.0164, 110.576], [20.0006, 110.5966], [19.98, 110.5994],
[19.9663, 110.6337], [19.9587, 110.6323], [19.9505, 110.6433],
[19.9443, 110.6461], [19.9285, 110.6433], [19.9292, 110.6516],
[19.9141, 110.668], [19.9127, 110.6804], [19.9072, 110.679],
[19.901, 110.6708], [19.8914, 110.679], [19.8825, 110.6804],
[19.8729, 110.668], [19.8598, 110.6763], [19.864, 110.69, ],
[19.853, 110.7065], [19.8434, 110.7092], [19.8331, 110.6982],
[19.8104, 110.7051], [19.8022, 110.701], [19.8001, 110.6831],
[19.8042, 110.6749], [19.8118, 110.6708], [19.7994, 110.6488],
[19.7905, 110.6474], [19.7871, 110.6323], [19.7823, 110.6502],
[19.7781, 110.6461], [19.7692, 110.6488], [19.75, 110.6364],
[19.7417, 110.6268], [19.7328, 110.6255], [19.7266, 110.631],
[19.7198, 110.6474], [19.7095, 110.6502], [19.706, 110.6447],
[19.706, 110.6282], [19.6971, 110.6117], [19.693, 110.6255],
[19.682, 110.6213], [19.6642, 110.6241], [19.6587, 110.6282],
[19.6518, 110.6351], [19.6518, 110.6543], [19.6442, 110.668],
[19.6381, 110.6557], [19.6181, 110.6543], [19.5927, 110.6351],
[19.5728, 110.6337], [19.5632, 110.6392], [19.5488, 110.6419],
[19.5406, 110.6378], [19.533, 110.6296], [19.5323, 110.6145],
[19.5261, 110.6104], [19.5296, 110.5966], [19.5241, 110.5678],
[19.5275, 110.5582], [19.5358, 110.5527], [19.5358, 110.5403],
[19.5632, 110.5486], [19.5632, 110.528], [19.5557, 110.5252],
[19.5632, 110.5197], [19.5721, 110.5074], [19.5831, 110.5046],
[19.5921, 110.4922], [19.5921, 110.484], [19.5838, 110.4771],
[19.5866, 110.4593], [19.5749, 110.4552], [19.5742, 110.451],
[19.5859, 110.4236], [19.5941, 110.4195], [19.6078, 110.4236],
[19.6099, 110.3947], [19.6257, 110.3906], [19.6305, 110.3838],
[19.6477, 110.3796], [19.6463, 110.3714], [19.6552, 110.3673],
[19.6628, 110.3741], [19.6882, 110.381], [19.7019, 110.3989],
[19.7115, 110.3879], [19.728, 110.381], [19.715, 110.3728],
[19.715, 110.3522], [19.7198, 110.3371], [19.7074, 110.3192],
[19.6957, 110.311], [19.7012, 110.2945], [19.6992, 110.2808],
[19.6937, 110.2629], [19.6875, 110.2615], [19.6916, 110.2505],
[19.6799, 110.2258], [19.682, 110.2217], [19.6944, 110.2286],
[19.7067, 110.2258], [19.7115, 110.2217], [19.7143, 110.2107],
[19.726, 110.208], [19.7424, 110.2148], [19.7514, 110.2272],
[19.7575, 110.2245], [19.7685, 110.2272], [19.7795, 110.2121],
[19.796, 110.2039], [19.809, 110.2025], [19.8331, 110.2052],
[19.8441, 110.1929], [19.8454, 110.1819], [19.8509, 110.1805],
[19.8544, 110.1874], [19.8578, 110.1846], [19.8626, 110.1627],
[19.8564, 110.1462], [19.8578, 110.1407], [19.8619, 110.1434],
[19.8653, 110.1544], [19.8853, 110.1517], [19.8921, 110.1434],
[19.9052, 110.1544], [19.9148, 110.1393], [19.923, 110.1379],
[19.9271, 110.1407], [19.9278, 110.1517], [19.9306, 110.1517],
[19.9216, 110.1613], [19.9306, 110.1572], [19.9306, 110.1654],
[19.934, 110.153], [19.9388, 110.1517], [19.9615, 110.1627],
[19.978, 110.1613], [19.9814, 110.1558], [19.978, 110.1448],
[19.9841, 110.1379], [19.9979, 110.1558], [20.0123, 110.1379],
[20.0892, 110.0693]];

var polygon = L.polyline(haikou_border, {
    weight: 1,
    opacity: 0.8,
    color: '#058dde'
}) //添加边界