/*!
 * DataJson  Javascript Library
 * xgq - v0.0.1
 * Date: 2017-11-16 14:27
 */
/// <reference path="../jquery-1.11.3/jquery.min.js" />

//109.400002 118.000000  20.000000   25.700001   GIFT   
var FirstLoading = true;
var map;
/**
 * [polygonClick 网格鼠标click图层]
 * @type {[type]}
 */
var polygonClick = null,
    /**
     * [polygonHover 网格鼠标hover图层]
     * @type {[type]}
     */
    polygonHover = null;
//初始化参数
var griddata = new Array(); //格点数据
var griddatanew = new Array(); //格点数据
var gridinfo = new Array();//格点详情
var model = "GIFT"; //数值模式
var ybsx = 0; //预报时效

var dayYbsx = 1; //界面日期选项
var timeYbsx = 1; //界面预报时次选项
var hourYbsx = 1; //界面预报小时选项

var foredataofhour = null;
var foredataofday = null;
//画格点
var windImage = null;
var windImageOld;
//海口市范围坐标
//110.08  20.16
//110.76  19.47 
var const_x = 110.08;
var const_y = 19.47;
var gridsize = 0.05;
var gridwidth = 14;
var gridheight = 14;
//var gridelement = "T2M";//格点数据要素
var mapcircle = null;
var radius = 10000;
var xy = [];
var operationGridLaterGroup = null;
var GridLaterGroup = null;
var ObtcodeDatas = null;//自动站站点数据
var GridimageOverlay = null;
var forecasterName = null;//预报员
var Record = null;
var flag = false;
/**
 * [drawingGrid 绘制格点块]
 * @param  {[type]} e     [地图坐标]
 * @param  {[type]} event [事件：click，hover]
 * @return {[type]}       [网格]
 */
var oldindexgrid = -1;
var popuphchar = L.popup({ minWidth: 800 });
var LaterGroup1;
var NewTime = new Date();
//load方法
function loadpage() {
    load = layer.msg('加载中', {
        icon: 16
        , shade: 0.01
        , time: 0
    });
}
window.onresize = function () {
    ChangeSize();
}
function ChangeSize() {
    $("#mapid").css("height", (document.documentElement.clientHeight - $("#nav").height()) + "px");
}
//加载时效
function Fileybsx() {
    var strhtml = "";
    var startHour = +$(".tc_forestTime ul li button.active").attr("data-foresthour");
    var start = 24 * (+($(".Prescription ul li.active button").attr("data-day"))) + 3;
    if (savetype == "forecaster") {
        if (start == 3) {
            strhtml += "<fieldset><legend>逐6小时降水</legend>";
            for (var i = 1; i <= 24; i++) {
                var hour = (startHour + i);
                if (hour >= 24) {
                    hour = hour % 24;
                }
                if ((+(i % 6).toFixed(0)) == 0) {
                    var starthour = (hour - 6);
                    if (starthour <= 0) starthour += 24;
                    strhtml += '<li><button type="button" data-ybsx="' + i + '" class="btn btn-primary btn-sm sumrain6" style="background:#f59321;color:white;;width: 43px;">' + starthour + '-' + hour + '</button></li>';
                }
            } strhtml += "</fieldset>";
            strhtml += "<fieldset><legend>逐24小时降水</legend>";
            strhtml += '<li><button type="button" data-ybsx="' + 24 + '" class="btn btn-primary btn-sm sumrain24" style="background:#f59321;color:white;;width: 43px;">20-20</button></li>';
            strhtml += "</fieldset>";
        }
        else {
            strhtml += "<fieldset><legend>逐24小时降水</legend>";
            strhtml += '<li><button type="button" data-ybsx="' + (24 * (+(start / 24).toFixed(0) + 1)) + '" class="btn btn-primary btn-sm sumrain24" style="background:#f59321;color:white;;width: 43px;">20-20</button></li>';
            strhtml += "</fieldset>";
        }

    } else {
        if (startHour == 20 && start == 3) {
            for (var i = -3; i < 4; i++) {
                if (i < 1) {
                    if (gridelement == "MAXTEMP" || gridelement == "MINTEMP" || gridelement == "R24H") {
                        strhtml += '<li class="noStatistics disabled"><button data-ybsx="' + i + '" type="button" class="btn btn-primary btn-sm">' + (startHour + i) + '</button></li>';
                    } else {
                        strhtml += '<li class="noStatistics disabled"><button data-ybsx="' + i + '" type="button" class="btn btn-primary btn-sm">' + (startHour + i) + '</button></li>';
                    }
                }
                else strhtml += '<li class="disabled"></li>';
            }
        }
        for (var i = start; i < 24 + start; i++) {
            var hour = (startHour + i);
            if (hour >= 24) {
                hour = hour % 24;
            }
            if (gridelement == "MAXTEMP" || gridelement == "MINTEMP" || gridelement == "R24H") {
                if ((+(i % 24).toFixed(0)) != 0) {
                    strhtml += '<li class="disabled"><button data-ybsx="' + i + '" type="button" class="btn btn-primary btn-sm">' + hour + '</button></li>';
                }
                else {
                    strhtml += '<li><button data-ybsx="' + i + '" type="button" class="btn btn-primary btn-sm">' + hour + '</button></li>';
                }
            } else {
                if (i > 72) {
                    if ((+(i % 6).toFixed(0)) != 0) {
                        strhtml += '<li class="disabled"><button data-ybsx="' + i + '" type="button" class="btn btn-primary btn-sm">' + hour + '</button></li>';
                    }
                    else {
                        strhtml += '<li><button data-ybsx="' + i + '" type="button" class="btn btn-primary btn-sm">' + hour + '</button></li>';
                    }
                } else {
                    if (gridelement == "RHSFC" || gridelement == "CLCT" || gridelement == "VISI") {//RHSFC  CLCT  VISI
                        //if (i > 24) {

                        //}
                        //else {
                        //    strhtml += '<li><button data-ybsx="' + i + '" type="button" class="btn btn-primary btn-sm">' + hour + '</button></li>';
                        //}
                        if ((+(i % 3).toFixed(0)) != 0) {
                            strhtml += '<li class="disabled"><button data-ybsx="' + i + '" type="button" class="btn btn-primary btn-sm">' + hour + '</button></li>';
                        } else {
                            strhtml += '<li><button data-ybsx="' + i + '" type="button" class="btn btn-primary btn-sm">' + hour + '</button></li>';
                        }
                    } else {
                        if (savetype != "forecaster") {
                            //strhtml += '<li><button data-ybsx="' + i + '" type="button" class="btn btn-primary btn-sm">' + hour + '</button></li>';
                            if ((+(i % 3).toFixed(0)) != 0) {
                                strhtml += '<li class="disabled"><button data-ybsx="' + i + '" type="button" class="btn btn-primary btn-sm">' + hour + '</button></li>';
                            } else {
                                strhtml += '<li><button data-ybsx="' + i + '" type="button" class="btn btn-primary btn-sm">' + hour + '</button></li>';
                            }
                        }
                        else {
                            strhtml += '<li class="disabled"><button data-ybsx="' + i + '" type="button" class="btn btn-primary btn-sm">' + hour + '</button></li>';
                        }
                    }
                }
            }
            if (gridelement == "RAIN" || gridelement == "R6H") {
                if (i <= 24) {
                    if ((+(i % 6).toFixed(0)) == 0 && i != 0) {
                        var starthour = (hour - 6);
                        if (starthour <= 0) starthour += 24;
                        strhtml += '<li><button type="button" data-ybsx="' + i + '" class="btn btn-primary btn-sm sumrain6" >' + starthour + '-' + hour + '</button></li>';
                    }
                }
            }
        }
    }
    $(".ybsx ul").html(strhtml);

    $(".ybsx ul li:not(.disabled):first").addClass("active");
    ybsx = +$(".ybsx ul li:not(.disabled):first button").attr("data-ybsx");//获取界面设定的时效,关键
    if (savetype == "forecaster") {
        if (ybsx > 24)
            gridelement = "R24H";
        if (ybsx < 24)
            gridelement = "R6H";
    }

    $(".ybsx ul li:not(.disabled) button").click(function () {
        if ($(this).hasClass("sumrain6")) {
            gridelement = "R6H";
        } else if ($(this).hasClass("sumrain24")) {
            gridelement = "R24H";
        } else {
            gridelement = $(".map_toolbar .map_toolbarcon .map_toolbar_item img.active").attr("data-valuesname");
        }
        $(".ybsx ul li").removeClass("active");
        $(this).parent("li").addClass("active");
        ybsx = +$(this).attr("data-ybsx");
        DrawLat_FC_map();
    })
}
//加载预报日期
function FileDay() {
    var strhtml = "";
    for (var i = 0; i < foreday; i++) {
        var time = ($("#HisStartTime").val() + " 00:00:00").toDate();
        time.addDays(i);
        strhtml += '<li><button title=' + time.format("yyyy年MM月dd日") + ' data-day="' + i + '" type="button" class="btn btn-primary btn-sm">' + time.format("dd日") + '</button></li>';
    }
    $(".Prescription ul").html(strhtml);
    $(".Prescription ul li:first").addClass("active");
    $(".Prescription ul li button").click(function () {
        $(".Prescription ul li").removeClass("active");
        $(this).parent("li").addClass("active");
        Fileybsx();
        DrawLat_FC_map();
    })
}
//绘制色斑图，并叠加色斑图
function DrawGridsImg() {
    if ($("#LayerTools ul li button.active").attr("data-type") != "colourspot") {
        return;
    }
    GridimageOverlay.setUrl("").setOpacity(0);
    loadpage();
    var time = ($("#HisStartTime").val() + " " + $(".tc_forestTime ul li button.active").html() + ":00").toDate();
    time.addHours(ybsx);
    var strdatas = "[";
    $(griddatanew[ybsx]).each(function (i) {
        strdatas += "{";
        strdatas += '"X":' + this.X + ",";
        strdatas += '"Y":' + this.Y + ",";
        switch (gridelement) {
            case "T2M":
                strdatas += '"Z":' + this.T2M + "";
                break;
            case "MAXTEMP":
                strdatas += '"Z":' + this.MAXTEMP + "";
                break;
            case "MINTEMP":
                strdatas += '"Z":' + this.MINTEMP + "";
                break;
            case "RAIN":
                strdatas += '"Z":' + this.RAIN + "";
                break;
            case "R24H":
                strdatas += '"Z":' + this.R24H + "";
                break;
            case "WSPD10M":
                strdatas += '"Z":' + this.WSPD10M + "";
                break;
            case "RHSFC":
                strdatas += '"Z":' + this.RHSFC + "";
                break;
            case "CLCT":
                strdatas += '"Z":' + this.CLCT + "";
                break;
            case "VISI":
                strdatas += '"Z":' + this.VISI + "";
                break;
            case "R6H":
                strdatas += '"Z":' + this.R6H + "";
                break;
        }
        strdatas += "},";
    })
    strdatas += "]";

    $.post('/WebService.asmx/DrawGridsImg', {
        vluesname: gridelement,
        strdt: strdatas,
        strtime: time.format("yyyy-MM-dd hh:mm:ss")
    }, function (data, textStatus, xhr) {
        layer.close(load);
        GridimageOverlay.setUrl("../Images/colourspot/" + data + "?ver=" + (new Date()).format("yyyyMMddhhmmss") + "").setOpacity(0.8);
    })
}

function SetForetime() {
    FileDay();
    Fileybsx();
    getgriddata();
    if (savetype == "forecaster") {
        showpf("");
    }
    var imgs = $(".map_gridoperation img");
    for (var i = 0; i < imgs.length; i++) {
        $(imgs[i]).attr("src", "../Images/NewPageImage/" + $(imgs[i]).attr("data-src") + ".png");
        $(imgs[i]).removeClass("active");
    }
    $(".map_gridoperation_hand").addClass("active");
    $(".map_gridoperation_hand").attr("src", "../Images/NewPageImage/" + $(".map_gridoperation_hand").attr("data-src") + "_s.png");
    if (operationGridLaterGroup != null) {
        operationGridLaterGroup.clearLayers();
    }
}
//获取页面时间
function GetUITime() {
    try {
        var uitime = $("#HisStartTime").val();
        var btntime = $(".tc_forestTime ul li button.active").html();
        return ($("#HisStartTime").val() + " " + $(".tc_forestTime ul li button.active").html() + ":00").toDate();
    } catch (e) {

    }
}
$(function () {
    //获取最新时间
    GetNewTime(callback);
    function callback() {
        if (savetype == "forecaster") {
            IsLogin(onload);
        } else {
            onload();
        }
    }
})
setTimeout(GetNewTime(null), 1000 * 60)
function GetNewTime(callback) {
    $.post('/WebService.asmx/GetNewTime', function (data, textStatus, xhr) {
        if (data === null || data === undefined || data === "[]") {

        }
        NewTime = data.toDate();
        if (callback != null) {
            callback();
        }
    }).error(function (xhr) {
        layer.msg('数据出错，请刷新重试。', {
            icon: 5
        });
    });
}

function onload() {

    ChangeSize();//屏幕长宽自适应
    //填充当前时间

    //var curDate = new Date();

    //var preDate = new Date(curDate.getTime() - 24 * 60 * 60 * 1000); //前一天
    //var preDate = new Date();
    $("#HisStartTime").val(NewTime.format("yyyy-MM-dd"));

    //$("#HisStartTime").val(new Date().format("yyyy-MM-dd"));

    //加载预报天
    FileDay();
    //加载预报时效
    Fileybsx();
    if (savetype == "forecaster") {
        showpf("");
        showCalc();
    }
    //地图叠加层工具栏
    layer.open({
        title: ['工具栏', 'font-size:15px;font-weight:bold;font-family:微软雅黑;'],
        type: 1,//1（页面层）
        skin: "layui-layer-lan",//样式类名
        area: ['400px', '95px'],
        offset: ['89.5%', $(window).width()-403], //具体配置参考：offset参数项
        content: $("#LayerTools"),//传入内容 这里content是一个DOM
        //, btn: '关闭全部'      
        shade: 0, //不显示遮罩
        // , area: ['100px', '240px'], //宽高
        closeBtn: 0,//不显示关闭按钮
        success: function (layero, index) {
            $("#LayerTools ul li button").click(function () {
                var SS = $(this).hasClass("active");
                //if ($(this).hasClass("active")) {
                //    $(this).removeClass("active");
                //    $(".showobtcode").remove();
                //    GridimageOverlay.setUrl("").setOpacity(0);
                //    return;
                //}
                loadpage();
                $(".showobtcode").remove();
                GridimageOverlay.setUrl("").setOpacity(0);
                //$("#LayerTools ul li").removeClass("active");
                //$(this).addClass("active");
                var type = $(this).attr("data-type");
                if (type == "aws" || type == "gridaws") {
                    if ($("#btnaws").hasClass("active")) {
                        $("#btnaws").removeClass("active");
                        $(".showobtcode").remove();
                        GridimageOverlay.setUrl("").setOpacity(0);
                        layer.close(load);
                        return;
                    }
                    else {
                        $("#btnaws").addClass("active");
                        GetobtcodeDatas(type);                       
                    }                   
                } else {
                    if ($("#btncolourspot").hasClass("active")) {
                        $("#btncolourspot").removeClass("active");
                        $(".showobtcode").remove();
                        GridimageOverlay.setUrl("").setOpacity(0);
                        layer.close(load);
                        return;
                    }
                    else {
                        $("#btncolourspot").addClass("active");
                        DrawGridsImg();                       
                    }
                }
            })
        }
    });

    //弹出时效选择工具栏
    layer.open({
        title: ['工具栏', 'font-size:15px;font-weight:bold;font-family:微软雅黑;'],
        type: 1,
        skin: "layui-layer-lan",//样式类名
        area: ['400px', '440px'],
        offset: ['240px', $(window).width()-403],//定义top、left坐标
        content: $("#TimeChoice"),
        shade: 0, //不显示遮罩
        closeBtn: 0,
        zIndex: 99999,
        success: function (layero, index) {
            $(".tc_forestTime ul li button").click(function () {
                $(".tc_forestTime ul li button").removeClass("active");
                $(".tc_forestTime ul li button").attr("background", "../Images/NewPageImage/bg_btnhour.png");
                $(this).addClass("active");
                $(this).attr("background", "../Images/NewPageImage/bg_btnhour_s.png");
                $(this).attr("border", "0px #1ea1fb solid");
                FileDay();
                Fileybsx();
                getgriddata();
            })
        }
    });



    //复制数据到下一天、复制数据到当前时次点击事件
    $("#BtncopyNextDay,#BtncopyNextHour").click(function () {
        var id = this.id;
        switch (id) {
            case "BtncopyNextDay":
                var startybsx = +$(".ybsx ul li:not(.noStatistics) button:first").attr("data-ybsx");
                for (var sx = startybsx; sx < (startybsx + 24) ; sx++) {
                    var nextybsx = (sx + 24);
                    if (sx > 72 && (+(sx % 6).toFixed(0)) != 0) continue;
                    if (nextybsx > 72 && (+(nextybsx % 6).toFixed(0)) != 0) continue;
                    $(griddatanew[sx]).each(function (i) {
                        switch (gridelement) {
                            case "T2M":
                                griddatanew[nextybsx][i].T2M = this.T2M;
                                break;
                            case "MAXTEMP":
                                griddatanew[nextybsx][i].MAXTEMP = this.MAXTEMP;
                                break;
                            case "MINTEMP":
                                griddatanew[nextybsx][i].MINTEMP = this.MINTEMP;
                                break;
                            case "RAIN":
                                griddatanew[nextybsx][i].RAIN = this.RAIN;
                                break;
                            case "R24H":
                                griddatanew[nextybsx][i].R24H = this.R24H;
                                break;
                            case "WSPD10M":
                                griddatanew[nextybsx][i].WSPD10M = this.WSPD10M;
                                break;
                            case "RHSFC":
                                griddatanew[nextybsx][i].RHSFC = this.RHSFC;
                                break;
                            case "CLCT":
                                griddatanew[nextybsx][i].CLCT = this.CLCT;
                                break;
                            case "VISI":
                                griddatanew[nextybsx][i].VISI = this.VISI;
                                break;
                            case "R6H":
                                griddatanew[nextybsx][i].R6H = this.R6H;
                                break;
                        }
                    })
                }
                var Prescription = $(".Prescription ul li.active").next("li");
                if ($(".Prescription ul li.active").nextAll().length == 0) {
                    return;
                }
                $(".Prescription ul li").removeClass("active");
                Prescription.addClass("active");
                Fileybsx();
                break;
            case "BtncopyNextHour":
                var startybsx = ybsx;
                var ybsxlist = $(".ybsx ul li.active").nextAll();
                if (ybsxlist.length == 0) {

                    var Prescription = $(".Prescription ul li.active").next("li");
                    if ($(".Prescription ul li.active").nextAll().length == 0) {
                        return;
                    }
                    $(".Prescription ul li").removeClass("active");
                    Prescription.addClass("active");
                    Fileybsx();
                    ybsxlist = $(".ybsx ul li");
                }
                var ybsxitem = null;
                for (var i = 0; i < ybsxlist.length; i++) {
                    if (ybsxlist[i].className.indexOf("disabled") == -1) {
                        ybsxitem = $(ybsxlist[i]);
                        i = ybsxlist.length;
                    }
                }
                $(".ybsx ul li.active").removeClass("active");
                ybsxitem.addClass("active");
                ybsx = $(".ybsx ul li.active button").attr("data-ybsx");
                $(griddatanew[startybsx]).each(function (i) {
                    switch (gridelement) {
                        case "T2M":
                            griddatanew[ybsx][i].T2M = this.T2M;
                            break;
                        case "MAXTEMP":
                            griddatanew[ybsx][i].MAXTEMP = this.MAXTEMP;
                            break;
                        case "MINTEMP":
                            griddatanew[ybsx][i].MINTEMP = this.MINTEMP;
                            break;
                        case "RAIN":
                            griddatanew[ybsx][i].RAIN = this.RAIN;
                            break;
                        case "R24H":
                            griddatanew[ybsx][i].R24H = this.R24H;
                            break;
                        case "WSPD10M":
                            griddatanew[ybsx][i].WSPD10M = this.WSPD10M;
                            break;
                        case "RHSFC":
                            griddatanew[ybsx][i].RHSFC = this.RHSFC;
                            break;
                        case "CLCT":
                            griddatanew[ybsx][i].CLCT = this.CLCT;
                            break;
                        case "VISI":
                            griddatanew[ybsx][i].VISI = this.VISI;
                            break;
                        case "R6H":
                            griddatanew[ybsx][i].R6H = this.R6H;
                            break;
                    }
                })
                //DrawGridsImg();
                break;
        }
        var datas = JSON.stringify(griddatanew);
        griddata[griddata.length] = JSON.parse(datas);
        $("#modifynum").html("(" + (griddata.length - 1) + ")");
        $("#Revokeli").removeAttr("class");
        DrawLat_FC_map();
    })
    //鼠标滚轮事件
    $('#mapid').mousewheel(function (event, delta, deltaX, deltaY) {
        if ($(".map_gridoperation img.active").attr("data-type") != "SelectArea") {
            return;
        }
        //L.circle([50.5, 30.5], { radius: 200 }).addTo(map);
        if (delta > 0) {
            radius += 400;
        }
        else if (delta < 0) {
            radius -= 400;
        }
        if (mapcircle != null) {
            map.removeLayer(mapcircle);
        }
        mapcircle = L.circle(xy, { radius: radius, fillOpacity: 0, color: "#ff7002" }).addTo(operationGridLaterGroup);
    });
    //初始化地图方法
    mapInit("mapid");
    //设定中心经纬度、显示的图层级别
    map.setView([19.70, 110.58], 10);
    //获取格点预报数据
    $.get('../Data/t_hk_grid_point_5k.txt').success(function (content) {
        gridinfo = JSON.parse(content);
        for (var i = 0; i < 240; i++) {
            var _this = gridinfo[i];
            if (_this == undefined) continue;
            var bounds = [[_this.Y - 0.025, _this.X - 0.025], [_this.Y + 0.025, _this.X + 0.025]];
            L.rectangle(bounds, { color: "#058dde", weight: 0.5, fillOpacity: 0, className: 'valuesrect grid grid' + i + '', attributes: { id: "grid" + i, gridxy: [_this.Y, _this.X], bounds: bounds } }).addTo(GridLaterGroup);
        }
        getgriddata();
    });
    //深圳海洋边界数组
    //for (var i = 0; i < szlatlngs.length; i++) {
    //    L.polyline(szlatlngs[i], { color: '#ff7002', weight: 1 }).addTo(map);
    //}
    //地图移动后的事件
    map.on("zoomend moveend", function () {
        //DrawLat_FC_map();
    });
    map.on("click", function (e) {
        //console.info(e);
    });
    ////鼠标移动事件
    //map.on("mousemove", function (e) {
    //    switch ($(".map_gridoperation img.active").attr("data-src")) {
    //        case "icon_circle":
    //            ReviseGridDatas(e, "mousemove");
    //            break;
    //    }
    //});
    //地图网格点击事件
    map.on("click mousemove", function (e) {
        switch ($(".map_gridoperation img.active").attr("data-type")) {
            case "SelectArea":
                ReviseGridDatas(e, e.type);
                break;
        }
        if ($(".map_gridoperation img.active").attr("data-type") != "SelectArea") {
            map.doubleClickZoom.enable();
            map.scrollWheelZoom.enable();
            $("body").attr("style", "overflow:auto");
        }
    });
    var PFpopup = L.popup({ minWidth: 460, offset: new L.point(0, -5) });//评分窗口
    //格点层的点击、鼠标移动时间
    GridLaterGroup.on("click mousemove", function (e) {
        var classname = e.layer.options.attributes.id;
        switch (e.type) {
            case "click":

                if ($(".map_gridoperation img.active").attr("data-type") == "SelectArea") {
                    ReviseGridDatas(e, e.type);
                } else {
                    $(".grid").removeClass("valuestxtSelected");
                    //$(".valuesrect").attr("style", "stroke:#058dde; stroke-width: 0.5px; fill:#ff7002; fill-opacity:0");
                    //$("." + classname + "").addClass("valuestxtSelected");
                    //$(".valuesrect." + classname + "").attr("style", "stroke: rgb(255,112,2); stroke-width: 2px;fill: #ff7002;fill-opacity: 0.15");
                    //为选中的格点框添加样式，包括边框的颜色各宽度，以及填充色
                    $(".valuesrect").css({ "stroke": "#058dde", "stroke-width": "0.5px", "fill": "#ff7002", "fill-opacity": "0" });
                    $("." + classname + "").addClass("valuestxtSelected");
                    $(".valuesrect." + classname + "").css({ "stroke": "#ff7002", "stroke-width": "2px", "fill": "#ff7002", "fill-opacity": "0.25" });
                    if (savetype == "forecaster") {
                        if ($(".valuestxt." + gridclass).html() == undefined) return;
                        var gridxy = e.layer.options.attributes.gridxy;
                        var bounds = e.layer.options.attributes.bounds;
                        var gridclass = e.layer.options.attributes.id;
                        var strHtml = '<table class="_pf_table" style="border-collapse: collapse; border: 1px solid black; width: 450px; text-align: center"><thead><tr><td rowspan="3">基本信息</td>            <td colspan="4">起报时间：<label class="foretime">加载中……</label></td></tr><tr><td colspan="4">预报时次：<label class="foreybsx">加载中……</label></td></tr>                <td colspan="4">预报数值：<label class="forevalue">加载中……</label></td></tr><tr><td>站号</td><td>站名</td><td>实况值mm</td><td>晴雨准确率</td><td>大雨准确率</td></tr> </thead><tbody><tr><td colspan="5">加载中……</td></tr></tbody><tfoot><tr><td colspan="3">网格评分</td><td class="qypf"></td><td class="dypf"></td></tr></tfoot></table>';
                        PFpopup.setContent(strHtml);
                        PFpopup.setLatLng(gridxy);
                        map.openPopup(PFpopup);

                        $("._pf_table .foretime").html(GetUITime().format("yyyy-MM-dd hh:mm:ss"));
                        if (gridelement == "R24H") $(".foreybsx").html((ybsx - 24) + "-" + ybsx + "H");
                        else $("._pf_table .foreybsx").html((ybsx - 6) + "-" + ybsx + "H");
                        $("._pf_table .forevalue").html($(".valuestxt." + gridclass).html() + "mm");

                        $.post('/WebService.asmx/GetGridContainObtid', { bounds: JSON.stringify(bounds), ybsx: ybsx, foretime: GetUITime().format("yyyy-MM-dd hh:mm:ss"), gridelement: gridelement }, function (data, textStatus, xhr) {
                            if (data === null || data === undefined || data === "[]" || data == "") {
                                $("._pf_table tbody").html("<tr><td colspan='5' style='color:red'>没有检索到附加的自动站点</td></tr>");
                                return;
                            }
                            var pfdata = JSON.parse(data);
                            var _strhtml = "";
                            var NA1 = 0, NB1 = 0, NC1 = 0, ND1 = 0, NA2 = 0, NB2 = 0, NC2 = 0;
                            $(pfdata).each(function () {
                                NA1 += +this.RAINSUN;
                                NB1 += +this.RAINNULL;
                                NC1 += +this.RAINLOST;
                                ND1 += +this.RAINNO;
                                NA2 += +this.RAINCORRECT10;
                                NB2 += +this.RAINNULL10;
                                NC2 += +this.RAINLOST10;
                                _strhtml += "<tr>";
                                _strhtml += "<td>";
                                _strhtml += this.Obtid;
                                _strhtml += "</td>";
                                _strhtml += "<td>";
                                _strhtml += this.Obtname;
                                _strhtml += "</td>";
                                _strhtml += "<td>";
                                _strhtml += this.Rain;
                                _strhtml += "</td>";
                                var qy = "=", dy = "=";
                                if (this.RAINSUN == "1") qy = "<span style='color: green;'>命中<span>";
                                else if (this.RAINNULL == "1") qy = "<span style='color:gray'>空报<span>";
                                else if (this.RAINLOST == "1") qy = "<span style='color:orange'>漏报<span>";
                                else if (this.RAINNO == "1") qy = "<span style='color:blue'>反中<span>";
                                _strhtml += "<td>";
                                _strhtml += qy;
                                _strhtml += "</td>";
                                if (this.RAINNULL10 == "1") dy = "<span style='color:gray'>空报<span>";
                                else if (this.RAINLOST10 == "1") dy = "<span style='color:orange'>漏报<span";
                                else if (this.RAINCORRECT10 == "1") dy = "<span style='color:green'>命中<span";
                                _strhtml += "<td>";
                                _strhtml += dy;
                                _strhtml += "</td>";
                                _strhtml += "</tr>";
                            })
                            if ((NA1 + NB1 + NC1 + ND1) == 0) $("._pf_table .qypf").html("=");
                            else $("._pf_table .qypf").html(((NA1 + ND1) / (NA1 + NB1 + NC1 + ND1) * 100).toFixed(1));
                            if ((NA2 + NB2 + NC2) == 0) $(".dypf").html("=");
                            else $("._pf_table .dypf").html(((NA2) / (NA2 + NB2 + NC2) * 100).toFixed(1));
                            $("._pf_table tbody").html(_strhtml);
                            //PFpopup.setContent(strHtml);
                        }).error(function (xhr) {
                            layer.msg('数据出错，请刷新重试。', {
                                icon: 5
                            });
                        });
                    }
                }
                break;
            case "mousemove":
                if ($(".map_gridoperation img.active").attr("data-type") == "SelectArea") {
                    ReviseGridDatas(e, e.type);
                } else {
                    //$(".valuesrect").attr("style", "stroke: #007fff; stroke-width: 0.5px;fill:#007fff;fill-opacity:0");
                    //$(".valuesrect." + classname + "").attr("style", "stroke: rgb(247, 7, 7); stroke-width: 2px;fill:red;");
                    //为选中的格点框添加样式，包括边框的颜色各宽度，以及填充色
                    $(".valuesrect").css({ "stroke": "#058dde", "stroke-width": "0.5px" });
                    $(".valuesrect." + classname + "").css({ "stroke": "rgb(255,112,2)", "stroke-width": "2px", "fill": "#ff7002" });
                }
                break;
        }
    });
    //operationGridLaterGroup.on("click mousemove", function (e) {
    //    
    //    ReviseGridDatas(e, e.type);
    //});

    $(".map_toolbar .map_toolbarcon .map_toolbar_item img").click(function () {
        Changetoolbar(this);
        Fileybsx();
        DrawLat_FC_map();
        if (gridelement != "WSPD10M") {
            var imgs = $(".map_gridoperation img");
            for (var i = 0; i < imgs.length; i++) {
                $(imgs[i]).attr("src", "../Images/NewPageImage/" + $(imgs[i]).attr("data-src") + ".png");
                $(imgs[i]).removeClass("active");
            }
            $(".map_gridoperation_hand").addClass("active");
            $(".map_gridoperation_hand").attr("src", "../Images/NewPageImage/" + $(".map_gridoperation_hand").attr("data-src") + "_s.png");
            $(".windtool").addClass("hide");
            if (operationGridLaterGroup != null) {
                operationGridLaterGroup.clearLayers();
            }
        }
        //DrawGridsImg();
    })
    $(".map_toolbar .map_toolbarcon .map_toolbar_item img").mouseover(function () {
        $(this).attr("src", "../Images/NewPageImage/" + $(this).attr("data-src") + "_s.png");
    });
    $(".map_toolbar .map_toolbarcon .map_toolbar_item img").mouseout(function () {
        $(this).attr("src", "../Images/NewPageImage/" + $(this).attr("data-src") + ".png");
        if ($(this).hasClass("active")) {
            $(this).attr("src", "../Images/NewPageImage/" + $(this).attr("data-src") + "_s.png");
        }
    });
    //修改格点数据工具栏事件
    $(".map_gridoperation img").click(function () {
        if ($(this).hasClass("disabled")) return;
        if (operationGridLaterGroup != null) {
            operationGridLaterGroup.clearLayers();
        }
        var imgs = $(".map_gridoperation img");
        for (var i = 0; i < imgs.length; i++) {
            $(imgs[i]).attr("src", "../Images/NewPageImage/" + $(imgs[i]).attr("data-src") + ".png");
            $(imgs[i]).removeClass("active");
        }
        $(this).addClass("active");
        if (!$("." + this.className + "").hasClass("map_gridoperation_hand")) {
            $(".leaflet-overlay-pane").css("z-index", "600");
            //map.setView([22.6, 114.2], 10);
            map.doubleClickZoom.disable();
            map.scrollWheelZoom.disable();
        }
        $(this).attr("src", "../Images/NewPageImage/" + $(this).attr("data-src") + "_s.png");
        if (this.className.indexOf("map_gridoperation_windf") != -1 || this.className.indexOf("map_gridoperation_windd") != -1) {
            if (this.className.indexOf("map_gridoperation_windf") != -1) $(".windtool").removeClass("hide");
            else $(".windtool").addClass("hide");
            //console.info($(".WSPD10M"));
            if (!$(".WSPD10M").hasClass("active")) {
                Changetoolbar(".WSPD10M");
                DrawLat_FC_map();
            }
        }
        else {
            $(".windtool").addClass("hide");
        }
    })
    //风场规则操作事件
    $(".btnconfirm").click(function () {
        //var newgriddata = griddata[griddata.length - 1];
        $(griddatanew[ybsx]).each(function () {
            var IsTrue = true;
            if (document.getElementById("fwz").checked) {
                if (+$(".grid" + this.VENUEID + "").html() > +$("#windmax").val() || +$(".grid" + this.VENUEID + "").html() < +$("#windmin").val()) {
                    IsTrue = false;
                }
            } if (IsTrue) {
                $(".gridwind" + this.VENUEID + "").remove();
                if (document.getElementById("winddtool").checked) {
                    var value = 0.0;
                    if (document.getElementById("gdz").checked) {
                        value = +$("#windvalues").val();
                    }
                    else if (document.getElementById("dz").checked) {
                        value = (+this.WDIR10M) + (+$("#windvalues").val());
                    }
                    else {
                        value = (+this.WDIR10M) - (+$("#windvalues").val());
                    }
                    if (value >= 0) this.WDIR10M = value;
                } else {
                    var value = 0.0;
                    if (document.getElementById("gdz").checked) {
                        value = +$("#windvalues").val();
                    }
                    else if (document.getElementById("dz").checked) {
                        value = (+this.WSPD10M) + (+$("#windvalues").val());
                    }
                    else {
                        value = (+this.WSPD10M) - (+$("#windvalues").val());
                    } if (value >= 0) {
                        this.WSPD10M = value;
                        $(".grid" + this.VENUEID + "").html(this.WSPD10M.toFixed(2));
                    }
                }
                if (this.WSPD10M >= 0 && this.WDIR10M >= 0) {
                    DrawWind(this.Y, this.X, this.VENUEID, (+this.WSPD10M), this.WDIR10M);
                }
            }
        })
        var datas = JSON.stringify(griddatanew);
        griddata[griddata.length] = JSON.parse(datas);
        $("#modifynum").html("(" + (griddata.length - 1) + ")");
        $("#Revokeli").removeAttr("class");
    })
    //撤销功能
    $("#Revoke").click(function () {
        if (griddata.length > 1) {

            griddata = griddata.remove();
            var datas = JSON.stringify(griddata[griddata.length - 1]);
            griddatanew = JSON.parse(datas);
            if (griddata.length - 1 == 0) { $("#modifynum").html(""); $("#Revokeli").attr("class", "disabled"); }
            else $("#modifynum").html("(" + (griddata.length - 1) + ")");
        }
        DrawLat_FC_map();
    })

    //保存按钮功能
    $("#btnsave").click(function () {
        IsLogin(subm);
        function subm(forecasterName) {
            var updatedata = [];
            var _hours = foreday * 24;
            for (var _ybsx = 1; _ybsx <= _hours.length; _ybsx++) {
                $(griddata[0][_ybsx]).each(function (i) {
                    //for (var k = 0; k < this.length; k++) {
                    //    console.info(this[i + 1][k]);
                    //}
                })
            }
            layer.confirm('确定提交数据？', {
                btnAlign: 'c',
                btn: ['确定', '取消'] //按钮
            }, function () {
                loadpage();
                $.post('/WebService.asmx/Savegriddata', {
                    type: savetype,
                    griddata: JSON.stringify(griddatanew),
                    username: forecasterName
                }, function (data, textStatus, xhr) {
                    if (data === null || data === undefined || data === "[]") {
                        return;
                    }
                    layer.close(load);
                    layer.msg('保存成功！', { icon: 1, time: 1000 });
                }).error(function (xhr) {
                    layer.msg('数据出错，请刷新重试。', {
                        icon: 5
                    });
                });
            }, function () {
                //layer.msg('也可以这样', {
                //    time: 20000, //20s后自动关闭
                //    btn: ['明白了', '知道了']
                //});
            });
        }
    })
}
//显示全部格点评分
function showpf(obj) {
    //弹出时效选择工具栏
    layer.open({
        title: ['评分统计', 'font-size:15px;font-weight:bold;font-family:微软雅黑;'],
        type: 1,
        skin: "layui-layer-lan",
        content: $("#pf_alltable"),
        shade: 0, //不显示遮罩
        zIndex: 9999,
        area: '400px',  //宽高
        offset: ['717px', '1498px'],//定义top、left坐标
        //offset: 'r',
    });
    $("._pf_table_All .foretime_all").html(GetUITime().format("yyyy-MM-dd hh:mm:ss"));

    $.post('/WebService.asmx/GetALLGridContainPF', {
        foretime: GetUITime().format("yyyy-MM-dd hh:mm:ss"),
        forecaster: forecasterName
    }, function (data, textStatus, xhr) {

        if (data === null || data === undefined || data === "[]" || data == "") {
            return;
        }

        var newdata = data.split("|");
        var strhtml = "";
        $(newdata).each(function (i) {
            if (i < newdata.length - 1) {
                var lines = this.split(",");
                strhtml += "<tr>"
                for (var k = 0; k < 6; k++) {
                    if (k >= lines.length) {
                        strhtml += "<td></td>";
                    } else
                        strhtml += "<td>" + lines[k] + "</td>";
                }
                strhtml += "<tr>"
            }
        })
        $("._pf_table_All tbody").html(strhtml);
        if (newdata.length == 7) {
            $("._pf_table_All tfoot").html('<tr><td colspan="2">总评分：</td><td class="qypf">' + newdata[newdata.length - 1].split(",")[0] + '</td><td colspan="2"></td><td class="qypf">' + newdata[newdata.length - 1].split(",")[1] + '</td></tr>');
        } else {
            $("._pf_table_All tfoot").html('<tr><td colspan="2">总评分：</td><td class="qypf"></td><td colspan="2"></td><td class="qypf"></td></tr>');

        }
    }).error(function (xhr) {
        layer.msg('数据出错，请刷新重试。', {
            icon: 5
        });
    });
}

function showCalc() {
    //显示本月预报统计次数
    $.post('/WebService.asmx/GetCountByName', { userName: forecasterName }, function (data, textStatus, xhr) {
        if (data === null || data === undefined || data === "[]" || data == "") {
            return;
        }
        var Details = data == "0" ? "还未制作预报数据！" : "已完成预报制作" + data + "次!&nbsp【<a id='Record' style='cursor:pointer;' onclick='ShowDetail(" + data + ")'>查看详情</a>】";
        layer.open({
            title: "预报制作统计",
            type: 1,
            skin: "layui-layer-lan"
            , content: "<span style='padding-left:10px;'>" + forecasterName + " - 您本月" + Details + "</span>"
            , shade: 0, //不显示遮罩
            area: ['340px', '71px'], //宽高
            offset: 'lb',//['700px', '50px'],
            cancel: false,
            maxmin: true,
            success: function (layero, index) {
                if (data != null && data != "0") {
                    $.post('/WebService.asmx/GetForecastRecord', { Name: forecasterName }, function (data, textStatus, xhr) {
                        var data2 = JSON.parse(data);
                        if (data2 === null || data2 === undefined || data2 === "[]" || data2 == "") {
                            Record = null;
                            return;
                        }
                        Record = "<table class=\"_pf_table\" style=\"border-collapse: collapse; border: 1px solid darkgray; width: 480px; text-align: center\"><tr style='height:30px'><td>编号</td><td>预报时间</td><td>制作时间</td></tr>";
                        for (var i = 0; i < data2.length; i++) {
                            Record += "<tr style='height:30px'><td>" + data2[i]["ROWNUM"] + "</td><td><a style='cursor:pointer' id='Date" + i + "' onclick='SetDate(" + i + ")'>" + data2[i]["D"] + "</a></td><td>" + data2[i]["C"] + "</td></tr>";
                        }
                        Record += "</table>";
                    });
                }
            }
        });
    });
}

function ShowDetail(count) {
    if (flag == true) return;//避免多次点击打开N个窗口
    flag = true;
    layer.open({
        title: "预报制作记录 - " + forecasterName,
        type: 1,
        skin: "layui-layer-lan"
            , content: Record
            , shade: 0,
        area: ['480px', (count * 30 + 100) + 'px'], //宽高
        offset: ['260px', '500px'],
        cancel: function () {
            flag = false;
        }
    });
}

function SetDate(i) {
    var time = $("#Date" + i).html();
    $("#HisStartTime").val(new Date(time).format("yyyy-MM-dd"));
    $("#HisStartTime").trigger("onchange");
}

//要素切换事件
function Changetoolbar(obj) {
    var imgs = $(".map_toolbar .map_toolbarcon .map_toolbar_item img");
    for (var i = 0; i < imgs.length; i++) {
        $(imgs[i]).attr("src", "../Images/NewPageImage/" + $(imgs[i]).attr("data-src") + ".png");
        $(imgs[i]).removeClass("active");
    }
    $(obj).addClass("active");
    $(obj).attr("src", "../Images/NewPageImage/" + $(obj).attr("data-src") + "_s.png");
    gridelement = $(obj).attr("data-valuesname");
}

//格点数据修改保存方法
function ReviseGridDatas(e, type) {
    switch (type) {
        case "click":
            $(".mapcircle").remove();
            var circle = L.circle(e.latlng, { radius: radius, fillOpacity: 0.4, fillColor: "#ff7002", className: "mapcircle", color: "#ff7002" }).addTo(operationGridLaterGroup);
            $("body").attr("style", "overflow:hidden");
            var _radius = Math.abs(map.latLngToContainerPoint(circle.getBounds()._northEast).x - map.latLngToContainerPoint(circle.getBounds()._southWest).x) / 2;
            var Ismodify = false;//是否修改
            $(griddatanew[ybsx]).each(function (i) {
                var x1 = map.latLngToContainerPoint(e.latlng).x;
                var y1 = map.latLngToContainerPoint(e.latlng).y;
                var x2 = map.latLngToContainerPoint([this.Y, this.X]).x;
                var y2 = map.latLngToContainerPoint([this.Y, this.X]).y;
                if (Math.sqrt(((x1 - x2) * (x1 - x2)) + ((y1 - y2) * (y1 - y2))) < _radius) {
                    Ismodify = true;
                    if (gridelement == "WSPD10M") {
                        $(".gridwind" + this.VENUEID + "").remove();
                        if ($(".map_gridoperation_windd").hasClass("active")) {
                            this.WDIR10M = +$("#numvalue").val();
                            DrawWind(this.Y, this.X, this.VENUEID, +$(".grid" + this.VENUEID + "").html(), +$("#numvalue").val());
                        }
                        else {
                            this.WSPD10M = +$("#numvalue").val();
                            DrawWind(this.Y, this.X, this.VENUEID, this.WSPD10M, this.WDIR10M);
                            $(".grid" + this.VENUEID + "").html((+$("#numvalue").val()).toFixed(2));
                        }
                    } else {
                        $(".grid" + this.VENUEID + "").html((+$("#numvalue").val()).toFixed(2));
                    }
                    switch (gridelement) {
                        case "T2M":
                            this.T2M = +$("#numvalue").val();
                            break;
                        case "MAXTEMP":
                            this.MAXTEMP = +$("#numvalue").val();
                            break;
                        case "MINTEMP":
                            this.MINTEMP = +$("#numvalue").val();
                            break;
                        case "RAIN":
                            if (ybsx <= 24) {
                                griddatanew[(+(ybsx / 6).toFixed(0)) * 6 + 6][i].R6H += ((+$("#numvalue").val()) - (+this.RAIN));
                            }
                            griddatanew[(+(ybsx / 24).toFixed(0)) * 24 + 24][i].R24H += ((+$("#numvalue").val()) - (+this.RAIN));
                            this.RAIN = +$("#numvalue").val();
                            break;

                        case "R24H":
                            this.R24H = +$("#numvalue").val();
                            break;
                        case "RHSFC":
                            this.RHSFC = +$("#numvalue").val();
                            break;
                        case "CLCT":
                            this.CLCT = +$("#numvalue").val();
                            break;
                        case "VISI":
                            this.VISI = +$("#numvalue").val();
                            break;
                        case "R6H":
                            this.R6H = +$("#numvalue").val();
                            griddatanew[24][i].R24H = griddatanew[6][i].R6H + griddatanew[12][i].R6H + griddatanew[18][i].R6H + griddatanew[24][i].R6H;
                            break;
                        default:
                    }
                }
            })
            if (!Ismodify) {
                return;
            }
            var datas = JSON.stringify(griddatanew);
            griddata[griddata.length] = JSON.parse(datas);
            $("#modifynum").html("(" + (griddata.length - 1) + ")");
            $("#Revokeli").removeAttr("class");
            break;
        case "mousemove":
            if (mapcircle != null) {
                map.removeLayer(mapcircle);
            }
            mapcircle = L.circle(e.latlng, { radius: radius, fillOpacity: 0, color: "#ff7002" }).addTo(operationGridLaterGroup);
            xy = e.latlng;
            break;
        default:
    }
}
function FileGridTitle() {
    var foretime = GetUITime();
    if (foretime.getHours() == 16)
        foretime.addHours(ybsx + 4)
    else
        foretime.addHours(ybsx)
    var strtit = "";
    var strtime = foretime.format("yyyy年MM月dd日hh时");
    switch (gridelement) {
        case "T2M":
            strtit = "温度";
            break;
        case "MAXTEMP":
            strtit = "24小时最高温度";
            foretime.addHours(-24);
            //strtit = "逐6小时最高温度";           
            //foretime.addHours(-6);
            strtime = foretime.format("yyyy年MM月dd日hh时") + "—" + strtime;
            break;
        case "MINTEMP":
            strtit = "24小时最低温度";
            foretime.addHours(-24);
            //strtit = "逐6小时最低温度";            
            //foretime.addHours(-6);
            strtime = foretime.format("yyyy年MM月dd日hh时") + "—" + strtime;
            break;
        case "RAIN":
            strtit = "降水";
            break;
        case "R24H":
            strtit = "24小时累计降水";
            foretime.addHours(-24);
            strtime = foretime.format("yyyy年MM月dd日hh时") + "—" + strtime;
            break;
        case "WSPD10M":
            strtit = "10米风";
            break;
        case "RHSFC":
            strtit = "湿度";
            break;
        case "CLCT":
            strtit = "云量";
            break;
        case "VISI":
            strtit = "能见度";
            break;
        case "R6H":
            strtit = "6小时累计降水";
            foretime.addHours(-6);
            strtime = foretime.format("yyyy年MM月dd日hh时") + "—" + strtime;
            break;
        default:
    }
    var msginfo = '<div class="forcastinfo">当前预报要素：' + strtit + '</br>预报时间：' + strtime + '</div>';
    if (savetype == "forecaster")
        //'当前预报要素：' + strtit + '</br>预报时间：' + strtime + ''
        layer.msg(msginfo, { time: 0, offset: ['560px', '1515px'], anim: -1, area: ['382px', '110px'] });
    else
        layer.msg(msginfo, { time: 0, offset: ['680px', '1515px'], anim: -1, area: ['382px', '110px'] });
}
//绘制格点
function DrawLat_FC_map() {
    FileGridTitle();
    var datauitime = GetUITime().format("yyyyMMdd");
    if (savetype == "forecaster" && (gridelement == "R24H" && ybsx == 24) || (datauitime != NewTime.format("yyyyMMdd"))) { //
        $(".changegrid").addClass("disabled");
        var imgs = $(".map_gridoperation img");
        for (var i = 0; i < imgs.length; i++) {
            $(imgs[i]).attr("src", "../Images/NewPageImage/" + $(imgs[i]).attr("data-src") + ".png");
            $(imgs[i]).removeClass("active");
        }
        $(".map_gridoperation_hand").addClass("active");
        $(".map_gridoperation_hand").attr("src", "../Images/NewPageImage/icon_hand_s.png");
        if (operationGridLaterGroup != null) {
            operationGridLaterGroup.clearLayers();
        }
    } else {
        $(".changegrid").removeClass("disabled");
    }
    if (griddatanew.length == 0 || griddatanew[6].length == 0) {
        $(".valuestxt").html("");
        GridimageOverlay.setUrl("").setOpacity(0);
        return;
    }
    $(".gridwind").remove();
    $(griddatanew[ybsx]).each(function () {
        //获取预报时效对应的数据       
        var da = this.RAIN;
        switch (gridelement) {
            case "T2M":
                da = this.T2M;
                break;
            case "MAXTEMP":
                da = this.MAXTEMP;
                break;
            case "MINTEMP":
                da = this.MINTEMP;
                break;
            case "RAIN":
                da = this.RAIN;
                break;
            case "R24H":
                da = this.R24H;
                break;
            case "WSPD10M":
                da = this.WSPD10M;
                break;
            case "RHSFC":
                da = this.RHSFC;
                break;
            case "CLCT":
                da = this.CLCT;
                break;
            case "VISI":
                da = this.VISI;
                break;
            case "R6H":
                da = this.R6H;
                break;
            default:
        }
        if (FirstLoading) {//初次加载绘制格点
            var bounds = [[gridinfo[this.VENUEID].Y - 0.025, gridinfo[this.VENUEID].X - 0.025], [gridinfo[this.VENUEID].Y + 0.025, gridinfo[this.VENUEID].X + 0.025]];
            L.marker([gridinfo[this.VENUEID].Y, gridinfo[this.VENUEID].X], { attributes: { id: "grid" + this.VENUEID, gridxy: [gridinfo[this.VENUEID].Y, gridinfo[this.VENUEID].X], bounds: bounds }, icon: new L.DivIcon({ className: 'valuestxt grid grid' + this.VENUEID + '', iconSize: new L.Point(20, 18), html: (+da).toFixed(2) }) }).addTo(GridLaterGroup);
            if (gridelement == "WSPD10M") {
                DrawWind(gridinfo[this.VENUEID].Y, gridinfo[this.VENUEID].X, this.WSPD10M, this.WDIR10M);
            }
        }
        else {
            $(".grid" + this.VENUEID + "").html(da.toFixed(2));
            if (gridelement == "WSPD10M") {
                DrawWind(gridinfo[this.VENUEID].Y, gridinfo[this.VENUEID].X, this.VENUEID, this.WSPD10M, this.WDIR10M);
            }
            else {
                $(".gridwind").remove();
            }
        }
    })
    DrawGridsImg();
    if (griddatanew[6].length != 0) {
        FirstLoading = false;
    }
    return;
    var startx = 113.7; var starty = 22.3;
    for (var y = 0; y < 14; y++) {
        starty = 22.3 + (0.05 * y);
        startx = 113.7;
        for (var x = 0; x < 25; x++) {
            startx = 113.7 + (0.05 * x);
            L.marker([starty, startx], { attributes: { id: "grid" + ((y * 25) + x), x: startx, y: starty }, icon: new L.DivIcon({ className: 'valuestxt grid grid' + ((y * 25) + x) + '', iconSize: new L.Point(20, 18), html: ((y * 25) + x) }) }).addTo(GridLaterGroup);
            var bounds = [[starty - 0.025, startx - 0.025], [starty + 0.025, startx + 0.025]];
            L.rectangle(bounds, { color: "#ff7002", weight: 0.5, fillOpacity: 0, className: 'valuesrect grid grid' + ((y * 25) + x) + '', attributes: { id: "grid" + ((y * 25) + x), x: startx, y: starty } }).addTo(GridLaterGroup);
        }
    }
    var lonlat = new Array();
    GridLaterGroup.on("click", function (e) {
        var classname = e.layer.options.attributes.id;
        $(".valuesrect." + classname + "").attr("style", "stroke: #ff7002; stroke-width: 0.5px; fill: #ff7002; fill-opacity: 0.5");
        var item = new Array();
        item[0] = e.layer.options.attributes.x;
        item[1] = e.layer.options.attributes.y;
        lonlat[lonlat.length] = item;
    })
}
//绘制风向杆方法
function DrawWind(LATITUDE, LONGITUDE, VENUEID, number, winddirect) {
    var canvas = document.createElement("canvas");
    canvas.width = 64;
    canvas.height = 64;
    var ctx = canvas.getContext('2d');
    ctx.lineWidth = 1;
    ctx.strokeStyle = "black"; //轮廓颜色
    drawBar(ctx, [canvas.width / 2, canvas.height / 2], number, winddirect);
    var myIcon = L.icon({
        className: 'grid gridwind gridwind' + VENUEID + '',
        iconUrl: canvas.toDataURL(),
        iconSize: [64, 64]
    });
    L.marker([LATITUDE, LONGITUDE], { icon: myIcon, attributes: { id: "grid" + VENUEID } }).addTo(GridLaterGroup);
}
//加载地图
function mapInit(mapName) {
    var locationInfo = [20, 110], zm = 10;
    map = null;
    map = L.map("mapid", { center: [20, 110], zoom: 10, zoomControl: false });
    L.tileLayer("http://{s}.google.cn/vt/hl=zh-CN&lyrs=p&apistyle=%2Cs.t%3A3%7Cp.v%3Aoff%2Cs.t%3A4%7Cp.v%3Aoff&gl=cn&x={x}&y={y}&z={z}", {
        subdomains: ["mt0", "mt1", "mt2", "mt3"]
    }).addTo(map);
    //区域边界图层,加载的是Arcgis发布的图层
    //var gdCityborder = L.esri.dynamicMapLayer({ opacity: 0.5, url: '//10.153.96.174/ArcGIS/rest/services/LFSSZArea/MapServer', format: "png8", f: "image", useCors: false, sr: 102113, layers: [0] });
    //gdCityborder.addTo(map);
    //gdCityborder.bringToBack();
    operationGridLaterGroup = L.featureGroup().addTo(map).bringToFront();
    GridLaterGroup = L.featureGroup().addTo(map);
    //海口市范围坐标
    //110.08  20.16
    //110.76  19.47 
    var cloudPic_extent = [
        [19.47, 110.08],
        [20.16, 110.76]
    ];
    var zoomControl = L.control.zoom({
        position: 'bottomleft',
        zoomInTitle: '放大地图',
        zoomOutTitle: '缩小地图',

    });
    map.addControl(zoomControl);
    GridimageOverlay = L.imageOverlay("", cloudPic_extent).setOpacity(0).addTo(map); //云图预报按钮组
    polygon.addTo(map);//加载海口市边界
}

//格点的鼠标事件
function drawingGrid(e, event) {
    map.doubleClickZoom.enable();
    map.scrollWheelZoom.enable();
    $("body").attr("style", "overflow:none");
    var _y = parseInt((e.latlng.lat - const_y) / gridsize) * gridsize + const_y;
    var _x = parseInt((e.latlng.lng - const_x) / gridsize) * gridsize + const_x;
    if (_x < const_x || _x + gridsize > const_x + (gridsize * gridwidth) || _y < const_y || _y + gridsize > const_y + (gridsize * gridheight) + (gridsize / 2)) {
        return;
    }
    var indexGrid = (parseInt((e.latlng.lat - const_y) / gridsize) * gridwidth + parseInt((e.latlng.lng - const_x) / gridsize) + 1);
    /**
     * [switch 根据不同的事件绘制格点]
     * @param  {[type]} event [事件]
     * @return {[type]}       [description]
     */
    switch (event) {
        case "click":
            if (polygonClick !== null) {
                map.removeLayer(polygonClick);
            }
            polygonClick = L.polygon([
                [_y, _x],
                [_y + gridsize, _x],
                [_y + gridsize, _x + gridsize],
                [_y, _x + gridsize],
            ], {
                opacity: 1,
                weight: 1,
                color: "#ff7002",
                attributes: {
                    id: "d"
                },
                fillOpacity: 0.7
            });
            polygonClick.addTo(operationGridLaterGroup);
            popuphchar.setContent("<div id='hchars'></div><p>");
            polygonClick.bindPopup(popuphchar).openPopup();
            break;
        case "hover":
            if (popuphchar.isOpen() == true) {
                map.removeLayer(polygonHover);
                return;
            }
            if (polygonHover !== null) {
                map.removeLayer(polygonHover);
            }
            polygonHover = L.polygon([
                [_y, _x],
                [_y + gridsize, _x],
                [_y + gridsize, _x + gridsize],
                [_y, _x + gridsize],
            ], {
                opacity: 1,
                weight: 1,
                color: "#ff7002",
                attributes: {
                    id: "d"
                },
                className: 'polygonHover',
                fillOpacity: 0.7
            });
            polygonHover.addTo(operationGridLaterGroup);
            break;
    }
}

//获取格点预报数据
function getgriddata() {
    griddatanew = [];
    griddata = [];
    $("#modifynum").html("");
    loadpage();
    $.post('/WebService.asmx/GetGridDatas', {
        NewTime: GetUITime().format("yyyy-MM-dd hh:mm:ss"),
        model: model,
        ybsx: ybsx,
        savetype: savetype,
        username: forecasterName
    }, function (data, textStatus, xhr) {
        layer.close(load);
        $("#btnsaveli").attr("class", "disabled");
        if (data === null || data === undefined || data === "[]" || data === "") {
            griddata = null;
            //绘制格点
            DrawLat_FC_map();
            layer.msg('未获取到数据', {
                icon: 5
            });
            return;
        }
        griddatanew = JSON.parse(data);
        if (griddatanew[6].length == 0) {
            griddatanew = new Array();
            return;
        }
        $("#btnsaveli").removeAttr("class");
        griddata[griddata.length] = JSON.parse(data);
        //绘制格点
        DrawLat_FC_map();
    }).error(function (xhr) {
        layer.msg('数据出错，请刷新重试。', {
            icon: 5
        });
    });
}

//填充色斑
function GetColor(rain) {
    var opacity = "0.6";
    if (gridelement == "T") {
        if (rain < 10) return "rgba(0, 0, 255,0.6)";
        if (rain >= 10 && rain < 11) return "rgba(0, 77, 255," + opacity + ")";
        if (rain >= 11 && rain < 12) return "rgba(0, 130, 255," + opacity + ")";
        if (rain >= 12 && rain < 14) return "rgba(0, 182, 255," + opacity + ")";
        if (rain >= 14 && rain < 16) return "rgba(0, 255, 255," + opacity + ")";
        if (rain >= 16 && rain < 18) return "rgba(0, 227, 198," + opacity + ")";
        if (rain >= 18 && rain < 20) return "rgba(0, 199, 115," + opacity + ")";
        if (rain >= 20 && rain < 22) return "rgba(0, 170, 0," + opacity + ")";
        if (rain >= 22 && rain < 24) return "rgba(155, 199, 0," + opacity + ")";
        if (rain >= 24 && rain < 26) return "rgba(198, 227, 0," + opacity + ")";
        if (rain >= 26 && rain < 28) return "rgba(255, 255, 0," + opacity + ")";
        if (rain >= 28 && rain < 30) return "rgba(255, 199, 0," + opacity + ")";
        if (rain >= 30 && rain < 32) return "rgba(255, 146, 0," + opacity + ")";
        if (rain >= 32 && rain < 34) return "rgba(255, 89, 0," + opacity + ")";
        if (rain >= 34 && rain < 35) return "rgba(255, 0, 0," + opacity + ")";
        if (rain >= 35 && rain < 36) return "rgba(198, 0, 0," + opacity + ")";
        if (rain >= 36 && rain < 38) return "rgba(148, 0, 0," + opacity + ")";
        if (rain >= 38 && rain < 40) return "rgba(107, 0, 0," + opacity + ")";
        if (rain <= 40) return "rgba(16, 0, 0," + opacity + ")";
    } else if (gridelement == "Rain") {
        //if (rain < 1) return Color.Transparent;
        if (rain > 0.0 && rain < 1.5) return "rgba(0, 235, 235, " + opacity + ")";
        if (rain >= 0.5 && rain < 1) return "rgba(0, 160, 245, " + opacity + ")";
        if (rain >= 1 && rain < 2) return "rgba(0, 0, 246, " + opacity + ")";
        if (rain >= 2 && rain < 5) return "rgba(0, 255, 0, " + opacity + ")";
        if (rain >= 5 && rain < 10) return "rgba(0, 200, 0, " + opacity + ")";
        if (rain >= 10 && rain < 15) return "rgba(0, 144, 0, " + opacity + ")";
        if (rain >= 15 && rain < 20) return "rgba(255, 255, 0, " + opacity + ")";
        if (rain >= 20 && rain < 30) return "rgba(231, 192, 0, " + opacity + ")";
        if (rain >= 30 && rain < 40) return "rgba(255, 144, 0, " + opacity + ")";
        if (rain >= 40 && rain < 50) return "rgba(255, 71, 71, " + opacity + ")";
        if (rain >= 50 && rain < 60) return "rgba(255, 0, 0, " + opacity + ")";
        if (rain >= 60 && rain < 80) return "rgba(192, 0, 0, " + opacity + ")";
        if (rain >= 80) return "rgba(255, 0, 255)";
    } else if (gridelement == "Wind") {
        rain = rain * 3.6;//m/s换算成km/h
        //if (wind > 0.0 && wind < 0.2) return Color.Transparent;
        if (rain >= 29 && rain < 39) return "rgba(0, 179, 0, " + opacity + ")";
        if (rain >= 39 && rain < 50) return "rgba(126, 204, 0, " + opacity + ")";
        if (rain >= 50 && rain < 62) return "rgba(204, 230, 0, " + opacity + ")";
        if (rain >= 62 && rain < 75) return "rgba(255, 255, 0, " + opacity + ")";
        if (rain >= 75 && rain < 88) return "rgba(255, 204, 0, " + opacity + ")";
        if (rain >= 88 && rain < 103) return "rgba(255, 153, 0, " + opacity + ")";
        if (rain >= 103 && rain < 118) return "rgba(255, 102, 0, " + opacity + ")";
        if (rain >= 118) return "rgba(255, 255, 0, " + opacity + ")";
    } else if (gridelement == "U") {
        if (rain > 0 && rain < 10) return "rgba(167, 15, 20, " + opacity + ")";
        if (rain >= 10 && rain < 20) return "rgba(200, 77, 0, " + opacity + ")";
        if (rain >= 20 && rain < 30) return "rgba(236, 112, 17, " + opacity + ")";
        if (rain >= 30 && rain < 40) return "rgba(253, 154, 39, " + opacity + ")";
        if (rain >= 40 && rain < 50) return "rgba(255, 232, 157, " + opacity + ")";
        if (rain >= 50 && rain < 60) return "rgba(232, 246, 255, " + opacity + ")";
        if (rain >= 60 && rain < 70) return "rgba(210, 228, 239, " + opacity + ")";
        if (rain >= 70 && rain < 80) return "rgba(169, 214, 235, " + opacity + ")";
        if (rain >= 80 && rain < 90) return "rgba(67, 147, 199, " + opacity + ")";
        if (rain >= 90 && rain < 100) return "rgba(36, 5, 202, " + opacity + ")";
    }
    return "rgba(0, 0, 0,0)";
}
//页面上的方法
$(".everyOneHour").click(function () {
    $(".everyOneHour").removeAttr("style");
    $(this).attr("style", " background:url('../Images/PageImage/WhiteBgimg.png')");
})

//7天按钮点击事件
$(".btn-primary-day").click(function () {
    $(".btn-primary-day").removeAttr("style");
    $(this).attr("style", " background-color:red;border-color: red;");
    dayYbsx = $(this).text().trim().split('日', 1);
    ybsx = parseInt((dayYbsx - 1) * 24) + parseInt(hourYbsx);// 拼接预报时效
    DrawLat_FC_map();//加载数据
})

//预报时次按钮点击事件
$(".btn-primary-Time").click(function () {
    $(".btn-primary-Time").removeAttr("style");
    $(this).attr("style", "background-color:red;border-color: red;");
    timeYbsx = $(this).text().trim().split(':00', 1);
})

//小时按钮点击事件
$(".btn-primary-hour").click(function () {
    $(".btn-primary-hour").removeAttr("style");
    $(this).attr("style", " background-color: #3C7EDC;border-color: #3C7EDC;color:white");
    hourYbsx = $(this).text().trim().split('H', 1);
    ybsx = parseInt((dayYbsx - 1) * 24) + parseInt(hourYbsx);// 拼接预报时效
    DrawLat_FC_map(); //加载数据
    $(".btn-primary-hour").removeClass("active");
    $(this).addClass("active");
})

//获取自动站站点数据（原始自动站站点数据、格点对应的自动站站点数据）
function GetobtcodeDatas(type) {
    $.post('/WebService.asmx/GetobtcodeDatas', { type: type }, function (data, textStatus, xhr) {
        if (data === null || data === undefined || data === "[]") {
            return;
        }
        layer.close(load);
        DrawObt(JSON.parse(data));
    }).error(function (xhr) {
        layer.msg('数据出错，请刷新重试。', {
            icon: 5
        });
    });
    function DrawObt(ObtcodeDatas) {
        $(ObtcodeDatas).each(function (i) {
            var th = this;
            //标注不同颜色
            var opc = 0.8;
            if (this.OBTCOLOR == "#3F91E3") opc = 0.0
            var circleMarker = L.circleMarker([th.Y, th.X], {
                radius: 6,
                color: 'green',
                fillColor: 'green',
                fillOpacity: 0.8,
                className: 'showobtcode',
                attributes: { id: this.OBTID, x: this.X, y: this.Y, obtname: this.STNAME }
            }).addTo(map);
            var str = th.OBTID + "-" + th.STNAME;

            if (savetype == "forecaster" && $("#LayerTools ul li button.active").attr("data-type") == "gridaws") {

                if (this.OBTCOLOR == "#00D300") {
                    str += "<br/>预报雨量:" + th.FRain;
                    str += "<br/>实况雨量:" + th.ERain;
                }
            }
            circleMarker.bindPopup(str);
            return;
        })
    }
}
//绘制风向
/***************************************************************************/
$(function () {
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
});
//绘制风向
function drawBar(context, center, windspeed, winddirect) {
    winddirect -= 180;
    if (winddirect < 0) winddirect += 360;
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
    var bamb = function () {
        return center.circle(1).line(90, 23);
        //return center.circle(1).line(90, 23);
    },
        bt;
    if (windspeed == 0) { bamb(); } else if (windspeed <= 2.5) { bamb().top(4).wind(5); } else if (windspeed == 4) { bamb().wind(8); } else if (windspeed == 6) {
        bt = bamb();
        bt.wind(8);
        bt.top(4).wind(5);
    } else if (windspeed == 8) {
        bt = bamb();
        bt.wind(8);
        bt.top(4).wind(8);
    } else if (windspeed <= 11) {
        bt = bamb();
        bt.wind(8);
        bt.top(4).wind(8);
        bt.top(7).wind(5);
    } else if (windspeed == 12) {
        bt = bamb();
        bt.wind(8);
        bt.top(4).wind(8);
        bt.top(7).wind(8);
    } else if (windspeed == 14) {
        bt = bamb();
        bt.wind(8);
        bt.top(4).wind(8);
        bt.top(7).wind(8);
        bt.top(10).wind(5);
    } else if (windspeed == 16) {
        bt = bamb();
        bt.wind(8);
        bt.top(4).wind(8);
        bt.top(7).wind(8);
        bt.top(10).wind(8);
    } else if (windspeed == 18) {
        bt = bamb();
        bt.wind(8);
        bt.top(4).wind(8);
        bt.top(7).wind(8);
        bt.top(10).wind(8);
        bt.top(24).wind(5);
    } else if (windspeed == 20) { bt = bamb().flag(8) } else if (windspeed == 22) { bt = bamb().flag(8).top(3).wind(5); } else if (windspeed == 24) { bt = bamb().flag(8).top(6).wind(8); } else if (windspeed == 26) {
        bt = bamb().flag(8).top(4);
        bt.wind(8);
        bt.top(4).wind(5);
    } else if (windspeed == 28) {
        bt = bamb().flag(8).top(4);
        bt.wind(8);
        bt.top(4).wind(8);
    } else if (windspeed == 30) {
        bt = bamb().flag(8).top(4);
        bt.wind(8);
        bt.top(4).wind(8);
        bt.top(7).wind(6);
    } else if (windspeed == 32) {
        bt = bamb().flag(8).top(4);
        bt.wind(8);
        bt.top(4).wind(8);
        bt.top(7).wind(8);
    } else if (windspeed == 36) {
        bt = bamb().flag(8).top(4);
        bt.wind(8);
        bt.top(4).wind(8);
        bt.top(7).wind(8);
        bt.top(10).wind(8);
    } else if (windspeed == 38) {
        bt = bamb().flag(8).top(4);
        bt.wind(8);
        bt.top(4).wind(8);
        bt.top(7).wind(8);
        bt.top(10).wind(8);
        bt.top(14).wind(5);
    } else if (windspeed == 40) { bt = bamb().flag(8).top(1).flag(4); } else if (windspeed == 42) { bt = bamb().flag(8).top(1).flag(4).top(4).wind(5); } else if (windspeed == 44) { bt = bamb().flag(8).top(1).flag(4).top(4).wind(5); } else if (windspeed == 46) {
        bt = bamb().flag(8).top(1).flag(4).top(4);
        bt.wind(8);
        bt.top(4).wind(5);
    }
    context.stroke();
}
Array.prototype.remove = function () {

    var newgriddata = new Array();
    var length = this.length - 1;
    $(this).each(function (i) {
        if (i != length) {
            newgriddata[newgriddata.length] = this;
        }
    })
    return newgriddata;
}
var options = {
    items: [
        //{ header: '功能' },
        //{ divider: true },
        //{ text: '', href: '' },
        { text: '复制该时次数据至未来下一时次', onclick: function () { alert("你点击了第2个链接") } },
        //{ text: '第三个链接', onclick: function () { alert("你点击了第3个链接") } },
        //{ text: '第四个链接', onclick: function () { alert("你点击了第4个链接") } }
    ]
}
//深圳海洋边界数组
var szlatlngs = new Array();
szlatlngs[0] = [[22.739167, 113.754167],
[22.735556, 113.733333],
[22.242778, 113.827222],

[22.234389, 113.826389],
[22.267722, 113.839],
[22.273111, 113.847389],
[22.333333, 113.869111],
[22.428806, 113.869111],
[22.472358, 113.947806],
[22.507286, 113.995056],
];
szlatlngs[1] = [[22.668889, 114.508889],
[22.661667, 114.583333],
[22.656944, 114.591944],
[22.654444, 114.594722],
[22.5, 114.638333],
[22.545833, 114.883333],
[22.148472, 114.883333],
];
szlatlngs[2] = [[22.543667, 114.226347],
[22.543667, 114.233639],
[22.550722, 114.237056],
[22.555722, 114.248667],
[22.5655, 114.276028],
[22.566667, 114.309083],
[22.568333, 114.332972],
[22.562, 114.433972],
[22.544972, 114.455139],
[22.468722, 114.454889],
[22.365139, 114.502444],
[22.148472, 114.502444],
];

//var szlatlngs = [
//    [22.739167, 113.754167],
//    [22.735556, 113.733333],
//    [22.242778, 113.827222],
//    [22.507286, 113.995056],
//    [22.472358, 113.947806],
//    [22.428806, 113.869111],
//    [22.333333, 113.869111],
//    [22.273111, 113.847389],
//    [22.267722, 113.839],
//    [22.234389, 113.826389],

//    [22.668889, 114.508889],
//    [22.661667, 114.583333],
//    [22.656944, 114.591944],
//    [22.654444, 114.594722],
//    [22.5, 114.638333],
//    [22.545833, 114.883333],


//    [22.543667, 114.226347],
//    [22.543667, 114.233639],
//    [22.550722, 114.237056],
//    [22.555722, 114.248667],
//    [22.5655, 114.276028],
//    [22.566667, 114.309083]
//    [22.568333, 114.332972],
//    [22.562, 114.433972],
//    [22.544972, 114.455139],
//    [22.468722, 114.454889],
//    [22.365139, 114.502444],
//    [22.148472, 114.502444]
//]

//登录按钮事件
function showlogin(obj) {
    if ($("#btnlogin span").html() !== '登录' && savetype == "forecaster") {
        layer.confirm('确定退出登录？', {
            btnAlign: 'c',
            btn: ['确定', '取消'] //按钮
        }, function () {
            $.post('/WebService.asmx/sysUserLogOut', function (data, textStatus, xhr) {
                layer.msg('成功退出！', { icon: 1, time: 1000 });
                RefreshPage("");
                sx();
            }).error(function (xhr) {
                layer.msg('数据出错，请刷新重试。', {
                    icon: 5, anim: 6
                });
            });

        }, function () {
        });
    } else {
        layer.open({
            type: 2,
            title: '登录',
            shadeClose: false,
            shade: 0.5,
            closeBtn: 1,
            area: ['410px', '250px'],
            content: '../Page/Login.html' //iframe的url
            , cancel: function () {
                window.location.href = "../Page/HKGridPoint.aspx";
            }
        });
    }
}

function IsLogin(callback) {
    $.post('/WebService.asmx/isLogin', function (data, textStatus, xhr) {
        if (data != "" && data != null) {
            RefreshPage(data);
            forecasterName = data;
            callback(data);
        } else {
            showlogin("");
        }
    }).error(function (xhr) {
        layer.msg('数据出错，请刷新重试。', {
            icon: 5, anim: 6
        });
    });
}
sx = function () {
    location.reload();
}
//登录状态显示
function RefreshPage(username) {
    if (username != "" && username != null) {
        $("#btnlogin").html("<span title='点击退出'>" + username + "</span>");
    }
    else {
        $("#btnlogin").html("<span title='点击登录'>登录</span>");
    }
}
//添加海口市边界-根据坐标
var haikou_border = [[20.0892, 110.0693], [20.1022, 110.1956], [20.1276, 110.3535],
[20.1798, 110.4634], [20.1022, 110.5444], [20.0755, 110.5472],
[20.0164, 110.576], [20.0006, 110.5966], [19.98, 110.5994],
[19.9663, 110.6337], [19.9587, 110.6323], [19.9505, 110.6433],
[19.9443, 110.6461], [19.9285, 110.6433], [19.9292, 110.6516],
[19.9141, 110.668], [19.9127, 110.6804], [19.9072, 110.679],
[19.901, 110.6708], [19.8914, 110.679], [19.8825, 110.6804],
[19.8729, 110.668], [19.8598, 110.6763], [19.864, 110.69],
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
    opacity: 1,
    color: 'red'
}) //添加边界