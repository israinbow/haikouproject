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

var model = "GIFT"; //数值模式
var ybsx = 1; //预报时效

var dayYbsx = 1; //界面日期选项
var timeYbsx = 1; //界面预报时次选项
var hourYbsx = 1; //界面预报小时选项

var foredataofhour = null;
var foredataofday = null;
//画格点
var windImage = null;
var windImageOld;
var const_x = 113.675;
var const_y = 22.275;
var gridsize = 0.05;
var gridwidth = 19;
var gridheight = 11;
//var gridelement = "T2M";//格点数据要素
var mapcircle = null;
var radius = 10000;
var xy = [];
var operationGridLaterGroup = null;
var GridLaterGroup = null;
var ObtcodeDatas = null;//自动站站点数据
var GridimageOverlay = null;
/**
 * [drawingGrid 绘制格点块]
 * @param  {[type]} e     [地图坐标]
 * @param  {[type]} event [事件：click，hover]
 * @return {[type]}       [网格]
 */
var oldindexgrid = -1;
var popuphchar = L.popup({ minWidth: 800 });
var LaterGroup1;
//load方法
function loadpage() {
    load = layer.msg('加载中', {
        icon: 16
        , shade: 0.01
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
    var start = 24 * (+($(".Prescription ul li.active button").attr("data-day"))) + 1;

    if (startHour == 20 && start == 1) {
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
                    if (i > 24) {
                        if ((+(i % 3).toFixed(0)) != 0) {
                            strhtml += '<li class="disabled"><button data-ybsx="' + i + '" type="button" class="btn btn-primary btn-sm">' + hour + '</button></li>';
                        } else {
                            strhtml += '<li><button data-ybsx="' + i + '" type="button" class="btn btn-primary btn-sm">' + hour + '</button></li>';
                        }
                    }
                    else {
                        strhtml += '<li><button data-ybsx="' + i + '" type="button" class="btn btn-primary btn-sm">' + hour + '</button></li>';
                    }
                } else {
                    if (savetype != "forecaster") strhtml += '<li><button data-ybsx="' + i + '" type="button" class="btn btn-primary btn-sm">' + hour + '</button></li>';
                    else strhtml += '<li class="disabled"><button data-ybsx="' + i + '" type="button" class="btn btn-primary btn-sm">' + hour + '</button></li>';

                }
            }
        }
        if (gridelement == "RAIN") {
            if (i <= 24) {
                if ((+(i % 6).toFixed(0)) == 0) {
                    var starthour = (hour - 6);
                    if (starthour <= 0) starthour += 24;
                    strhtml += '<li><button type="button" data-ybsx="' + i + '" class="btn btn-primary btn-sm sumrain" style="background:#f59321;color:white;;width: 43px;">' + starthour + '-' + hour + '</button></li>';
                }
            }
        }
    }
    $(".ybsx ul").html(strhtml);
    $(".ybsx ul li:not(.disabled):first").addClass("active");
    ybsx = +$(".ybsx ul li:not(.disabled):first button").attr("data-ybsx");
    //DrawLat_FC_map();
    $(".ybsx ul li:not(.disabled) button").click(function () {
        if ($(this).hasClass("sumrain")) {
            gridelement = "R6H"
        } else {
            gridelement = $(".map_toolbar .map_toolbarcon .map_toolbar_item img.active").attr("data-valuesname");
        }
        //$(".ybsx ul li button").removeClass("active");
        $(".ybsx ul li").removeClass("active");
        //$(this).addClass("active");
        $(this).parent("li").addClass("active");
        ybsx = +$(this).attr("data-ybsx");
        DrawLat_FC_map();
        //DrawGridsImg();
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
        //DrawGridsImg();
        DrawLat_FC_map();
    })
}
//绘制色斑图，并叠加色斑图
function DrawGridsImg() {
    if ($("#LayerTools ul li.active").attr("data-type") != "colourspot") {
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
                //griddatanew[nextybsx][i].T2M = this.T2M;
                break;
            case "MAXTEMP":
                strdatas += '"Z":' + this.MAXTEMP + "";
                //griddatanew[nextybsx][i].MAXTEMP = this.MAXTEMP;
                break;
            case "MINTEMP":
                strdatas += '"Z":' + this.MINTEMP + "";
                //griddatanew[nextybsx][i].MINTEMP = this.MINTEMP;
                break;
            case "RAIN":
                strdatas += '"Z":' + this.RAIN + "";
                //griddatanew[nextybsx][i].RAIN = this.RAIN;
                break;
            case "R24H":
                strdatas += '"Z":' + this.R24H + "";
                //griddatanew[nextybsx][i].R24H = this.R24H;
                break;
            case "WSPD10M":
                strdatas += '"Z":' + this.WSPD10M + "";
                //griddatanew[nextybsx][i].WSPD10M = this.WSPD10M;
                break;
            case "RHSFC":
                strdatas += '"Z":' + this.RHSFC + "";
                //griddatanew[nextybsx][i].RHSFC = this.RHSFC;
                break;
            case "CLCT":
                strdatas += '"Z":' + this.CLCT + "";
                //griddatanew[nextybsx][i].CLCT = this.CLCT;
                break;
            case "VISI":
                strdatas += '"Z":' + this.VISI + "";
                //griddatanew[nextybsx][i].VISI = this.VISI;
                break;
            case "R6H":
                strdatas += '"Z":' + this.R6H + "";
                break;
        }
        strdatas += "},";
    })
    strdatas += "]";

    $.post('/WebService.asmx/DrawGridsImg', {//string vluesname, DataTable dt, DateTime time
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
}
function GetUITime() {
    try {
        return ($("#HisStartTime").val() + " " + $(".tc_forestTime ul li button.active").html() + ":00").toDate();
    } catch (e) {

    }
}
$(function () {
    ChangeSize();
    //填充当前时间
    $("#HisStartTime").val(new Date().format("yyyy-MM-dd"));

    //加载预报天
    FileDay();
    //加载预报时效
    Fileybsx();
    //地图叠加层工具栏
    layer.open({
        title: "工具栏",
        type: 1,
        skin: "layui-layer-lan"
        , offset: 'rb' //具体配置参考：offset参数项
        , content: $("#LayerTools")
        //, btn: '关闭全部'      
        , shade: 0, //不显示遮罩
        // , area: ['100px', '240px'], //宽高
        closeBtn: 0,
        success: function (layero, index) {
            $("#LayerTools ul li").click(function () {
                if ($(this).hasClass("active")) {
                    $(this).removeClass("active");
                    $(".showobtcode").remove();
                    GridimageOverlay.setUrl("").setOpacity(0);
                    return;
                }
                loadpage();
                $(".showobtcode").remove();
                GridimageOverlay.setUrl("").setOpacity(0);
                $("#LayerTools ul li").removeClass("active");
                $(this).addClass("active");
                var type = $(this).attr("data-type");
                if (type == "aws" || type == "gridaws") {
                    GetobtcodeDatas(type);
                } else {
                    DrawGridsImg();
                }
            })
        }
    });
    //弹出时效选择工具栏
    layer.open({
        title: "工具栏",
        type: 1,
        skin: "layui-layer-lan",
        offset: ['100px', '10px']
        , content: $("#TimeChoice")
        //, btn: '关闭全部'      
        , shade: 0, //不显示遮罩
        // , area: ['100px', '240px'], //宽高
        closeBtn: 0,
        success: function (layero, index) {
            $(".tc_forestTime ul li button").click(function () {
                $(".tc_forestTime ul li button").removeClass("active");
                $(this).addClass("active");
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
        $("#Revoke").removeAttr("disabled");
        DrawLat_FC_map();
    })
    //鼠标滚轮时间
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
        mapcircle = L.circle(xy, { radius: radius, fillOpacity: 0, color: "red" }).addTo(operationGridLaterGroup);
    });
    //初始化地图方法
    mapInit("mapid");
    //设定中心经纬度、显示的图层级别
    map.setView([22.6, 114.2], 10);
    //获取格点预报数据
    getgriddata();
    for (var i = 0; i < szlatlngs.length; i++) {
        L.polyline(szlatlngs[i], { color: 'red', weight: 1 }).addTo(map);
    }
    //地图移动后的事件
    map.on("zoomend moveend", function () {
        //DrawLat_FC_map();
    });
    map.on("click", function (e) {
        console.info(e);
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
        //return;
        //if ($(".map_gridoperation img.active").attr("data-src") == "icon_circle") {
        //    return;
        //}
        //return;
        var classname = e.layer.options.attributes.id;
        switch (e.type) {
            case "click":
                if ($(".map_gridoperation img.active").attr("data-type") == "SelectArea") {

                    ReviseGridDatas(e, e.type);
                } else {
                    $(".grid").removeClass("valuestxtSelected");
                    $(".valuesrect").attr("style", "stroke: #007fff; stroke-width: 0.5px;fill:#007fff;fill-opacity:0");
                    $("." + classname + "").addClass("valuestxtSelected");
                    $(".valuesrect." + classname + "").attr("style", "stroke: rgb(247, 7, 7); stroke-width: 2px;fill:red;fill-opacity:0.8");
                    if (savetype == "forecaster") {
                        var gridxy = e.layer.options.attributes.gridxy;
                        var bounds = e.layer.options.attributes.bounds;
                        var gridclass = e.layer.options.attributes.id;
                        var strHtml = '<table class="_pf_table" style="border-collapse: collapse; border: 1px solid black; width: 450px; text-align: center"><thead><tr><td rowspan="3">基本信息</td>            <td colspan="4">起报时间：<label class="foretime">加载中……</label></td></tr><tr><td colspan="4">预报时次：<label class="foreybsx">加载中……</label></td></tr>                <td colspan="4">预报数值：<label class="forevalue">加载中……</label></td></tr><tr><td>站号</td><td>站名</td><td>实况值mm</td><td>晴雨准确率</td><td>大雨准确率</td></tr> </thead><tbody><tr><td colspan="5">加载中……</td></tr></tbody><tfoot><tr><td colspan="3">网格评分</td><td class="qypf"></td><td class="dypf"></td></tr></tfoot></table>';
                        PFpopup.setContent(strHtml);
                        PFpopup.setLatLng(gridxy);
                        map.openPopup(PFpopup);

                        $(".foretime").html(GetUITime().format("yyyy-MM-dd hh:mm:ss"));
                        if (gridelement == "R24H") $(".foreybsx").html((ybsx - 24) + "-" + ybsx + "H");
                        else $(".foreybsx").html((ybsx - 6) + "-" + ybsx + "H");
                        $(".forevalue").html($(".valuestxt." + gridclass).html() + "mm");

                        $.post('/WebService.asmx/GetGridContainObtid', { bounds: JSON.stringify(bounds), ybsx: ybsx, foretime: GetUITime().format("yyyy-MM-dd hh:mm:ss"), gridelement: gridelement }, function (data, textStatus, xhr) {
                            if (data === null || data === undefined || data === "[]" || data == "") {
                                //layer.msg('没有检索到附加的自动站点', {
                                //    icon: 5
                                //});
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
                                let qy = "=", dy = "=";
                                if (this.RAINSUN == "1") qy = "<span style='color: red;'>命中<span>";
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
                            if ((NA1 + NB1 + NC1 + ND1) == 0) $(".qypf").html("=");
                            else $(".qypf").html(((NA1 + ND1) / (NA1 + NB1 + NC1 + ND1) * 100).toFixed(1));
                            if ((NA2 + NB2 + NC2) == 0) $(".dypf").html("=");
                            else $(".dypf").html(((NA2) / (NA2 + NB2 + NC2) * 100).toFixed(1));
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
                    $(".valuesrect").css({ "stroke": "#007fff", "stroke-width": "0.5px" });
                    $(".valuesrect." + classname + "").css({ "stroke": "rgb(247, 7, 7)", "stroke-width": "2px", "fill": "red" });
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
                $(imgs[i]).attr("src", "../Images/PageImage/" + $(imgs[i]).attr("data-src") + ".png");
                $(imgs[i]).removeClass("active");
            }
            $(".map_gridoperation_hand").addClass("active");
            $(".map_gridoperation_hand").attr("src", "../Images/PageImage/" + $(".map_gridoperation_hand").attr("data-src") + "_s.png");
            $(".windtool").addClass("hide");
            if (operationGridLaterGroup != null) {
                operationGridLaterGroup.clearLayers();
            }
        }
        //DrawGridsImg();
    })
    //修改格点数据工具栏事件
    $(".map_gridoperation img").click(function () {
        if (operationGridLaterGroup != null) {
            operationGridLaterGroup.clearLayers();
        }
        var imgs = $(".map_gridoperation img");
        for (var i = 0; i < imgs.length; i++) {
            $(imgs[i]).attr("src", "../Images/PageImage/" + $(imgs[i]).attr("data-src") + ".png");
            $(imgs[i]).removeClass("active");
        }
        $(this).addClass("active");
        if (!$("." + this.className + "").hasClass("map_gridoperation_hand")) {
            $(".leaflet-overlay-pane").css("z-index", "600");
        }
        $(this).attr("src", "../Images/PageImage/" + $(this).attr("data-src") + "_s.png");
        if (this.className.indexOf("map_gridoperation_windf") != -1 || this.className.indexOf("map_gridoperation_windd") != -1) {
            if (this.className.indexOf("map_gridoperation_windf") != -1) $(".windtool").removeClass("hide");
            else $(".windtool").addClass("hide");
            console.info($(".WSPD10M"));
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
                        $(".grid" + this.VENUEID + "").html(this.WSPD10M.toFixed(1));
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
        $("#Revoke").removeAttr("disabled");
    })
    //撤销功能
    $("#Revoke").click(function () {
        if (griddata.length > 1) {

            griddata = griddata.remove();
            var datas = JSON.stringify(griddata[griddata.length - 1]);
            griddatanew = JSON.parse(datas);
            if (griddata.length - 1 == 0) { $("#modifynum").html(""); $("#Revoke").attr("disabled", "disabled"); }
            else $("#modifynum").html("(" + (griddata.length - 1) + ")");
        }
        DrawLat_FC_map();
    })
    //保存按钮功能
    $("#btnsave").click(function () {
        //layer.msg('确定提交数据？', {
        //    time: 0, //20s后自动关闭
        //    btn: ['确定', '取消']
        //});
        //return;
        var forecasterName = "test";
        //询问框(如果没登录又是预报员界面，需要给出提示)
        if (sessionStorage.loginstate != "1" && savetype == "forecaster") {

            layer.msg('请先登录！', {
                icon: 5
            });
            return;

        }
        else {
            if (savetype == "forecaster") {
                forecasterName = sessionStorage.name;
            }

        }

        layer.confirm('确定提交数据？', {
            //title: "", 
            btnAlign: 'c',
            btn: ['确定', '取消'] //按钮
        }, function () {
            loadpage();
            $.post('/WebService.asmx/Savegriddata', { type: savetype, griddata: JSON.stringify(griddatanew), username: forecasterName }, function (data, textStatus, xhr) {
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
        //if (griddata.length > 1) {

        //    griddata = griddata.remove();
        //    var datas = JSON.stringify(griddata[griddata.length - 1]);
        //    griddatanew = JSON.parse(datas);
        //    if (griddata.length - 1 == 0) { $("#modifynum").html(""); $("#Revoke").attr("disabled", "disabled"); }
        //    else $("#modifynum").html("(" + (griddata.length - 1) + ")");
        //}
        //DrawLat_FC_map();
    })
})
//显示全部格点评分
function showpf(obj) {
     
    //弹出时效选择工具栏
    layer.open({
        title: "评分统计",
        type: 1,
        skin: "layui-layer-lan"
        //offset: ['100px', '10px']
        , content: $("._pf_table_All")
        //, btn: '关闭全部'      
        , shade: 0, //不显示遮罩
        area: ['600px', '250px'], //宽高
        //closeBtn: 0,
        //success: function (layero, index) {
        //    $(".tc_forestTime ul li button").click(function () {
        //        $(".tc_forestTime ul li button").removeClass("active");
        //        $(this).addClass("active");
        //        FileDay();
        //        Fileybsx();
        //        getgriddata();
        //    })
        //}
    });
    $("._pf_table_All .foretime_all").html(GetUITime().format("yyyy-MM-dd hh:mm:ss"));
    $.post('/WebService.asmx/GetALLGridContainPF', { foretime: GetUITime().format("yyyy-MM-dd hh:mm:ss") }, function (data, textStatus, xhr) {
         
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
        $("._pf_table_All tfoot").html('<tr><td colspan="2">总评分：</td><td class="qypf">' + newdata[newdata.length - 1].split(",")[0] + '</td><td colspan="2"></td><td class="qypf">' + newdata[newdata.length - 1].split(",")[1] + '</td></tr>');
        //var pfdata = JSON.parse(data);

    }).error(function (xhr) {
        layer.msg('数据出错，请刷新重试。', {
            icon: 5
        });
    });
}
//要素切换事件
function Changetoolbar(obj) {
    var imgs = $(".map_toolbar .map_toolbarcon .map_toolbar_item img");
    for (var i = 0; i < imgs.length; i++) {
        $(imgs[i]).attr("src", "../Images/PageImage/" + $(imgs[i]).attr("data-src") + ".png");
        $(imgs[i]).removeClass("active");
    }
    $(obj).addClass("active");
    $(obj).attr("src", "../Images/PageImage/" + $(obj).attr("data-src") + "_s.png");
    gridelement = $(obj).attr("data-valuesname");
}
//格点数据修改保存方法
function ReviseGridDatas(e, type) {
    switch (type) {
        case "click":
            $(".mapcircle").remove();
            var circle = L.circle(e.latlng, { radius: radius, fillOpacity: 0.4, fillColor: "red", className: "mapcircle" }).addTo(operationGridLaterGroup);
            map.doubleClickZoom.disable();
            map.scrollWheelZoom.disable();
            $("body").attr("style", "overflow:hidden");
            var _radius = Math.abs(map.latLngToContainerPoint(circle.getBounds()._northEast).x - map.latLngToContainerPoint(circle.getBounds()._southWest).x) / 2;
            //var newgriddata = griddata[griddata.length - 1];
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
                            $(".grid" + this.VENUEID + "").html((+$("#numvalue").val()).toFixed(1));
                        }
                    } else {
                        $(".grid" + this.VENUEID + "").html((+$("#numvalue").val()).toFixed(1));
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
                            //如果是前24小时 ： R6H=RAIN1+RAIN2+...+RAIH6
                            //在这里写个循环 R24H=RAIN1+RAIN2+...+RAIH24
                            //
                            break;

                        case "R24H":
                            this.R24H = +$("#numvalue").val();
                            //
                            break;
                            //case "WSPD10M":
                            //    this.WSPD10M = +$("#numvalue").val();
                            //    //this.WDIR10M
                            //    break;
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
            $("#Revoke").removeAttr("disabled");
            break;
        case "mousemove":
            if (mapcircle != null) {
                map.removeLayer(mapcircle);
            }
            mapcircle = L.circle(e.latlng, { radius: radius, fillOpacity: 0, color: "red" }).addTo(operationGridLaterGroup);
            xy = e.latlng;
            //mapcircle.on("click", function () {
            //    alert("sd");
            //})
            break;
        default:
    }
}
//绘制格点
function DrawLat_FC_map() {
    //if (operationGridLaterGroup != null) {
    //    operationGridLaterGroup.clearLayers();
    //}

    //return;
    if (griddatanew.length == 0 || griddatanew[1].length == 0) {
        $(".valuestxt").html("");
        GridimageOverlay.setUrl("").setOpacity(0);
        return;
    }
    //var newgriddata = griddata[griddata.length - 1][ybsx];
    $(".gridwind").remove();
    $(griddatanew[ybsx]).each(function () {
        //获取预报时效对应的数据
        //if (this.YBSX == ybsx) {
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
                //this.WDIR10M
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
            var bounds = [[this.Y - 0.025, this.X - 0.025], [this.Y + 0.025, this.X + 0.025]];
            L.marker([this.Y, this.X], { attributes: { id: "grid" + this.VENUEID, gridxy: [this.Y, this.X], bounds: bounds }, icon: new L.DivIcon({ className: 'valuestxt grid grid' + this.VENUEID + '', iconSize: new L.Point(20, 18), html: (+da).toFixed(1) }) }).addTo(GridLaterGroup);
            if (gridelement == "WSPD10M") {
                DrawWind(this.Y, this.X, this.WSPD10M, this.WDIR10M);
            }

            L.rectangle(bounds, { color: "#007fff", weight: 0.5, fillOpacity: 0, className: 'valuesrect grid grid' + this.VENUEID + '', attributes: { id: "grid" + this.VENUEID, gridxy: [this.Y, this.X], bounds: bounds } }).addTo(GridLaterGroup);
        }
        else {
            $(".grid" + this.VENUEID + "").html(da.toFixed(1));
            if (gridelement == "WSPD10M") {
                DrawWind(this.Y, this.X, this.VENUEID, this.WSPD10M, this.WDIR10M);
            }
            else {
                $(".gridwind").remove();
            }
        }
        //}
        //else {
        //    DrawWind(this.Y, this.X, 0, 0);
        //}

    })
    DrawGridsImg();
    if (griddatanew[1].length != 0) {

        FirstLoading = false;
        //$(".valuestxt,.valuesrect").click(function () {
        //    
        //    $(".valuestxt").removeClass("valuestxtactive");
        //    $("." + this.className.Split(' ').Split('_')[1] + "").addClass("valuestxtactive");
        //})
        //$(".valuestxt").mousemove(function () {

        //})
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
            L.rectangle(bounds, { color: "#007fff", weight: 0.5, fillOpacity: 0, className: 'valuesrect grid grid' + ((y * 25) + x) + '', attributes: { id: "grid" + ((y * 25) + x), x: startx, y: starty } }).addTo(GridLaterGroup);
        }
    }
    var lonlat = new Array();
    GridLaterGroup.on("click", function (e) {
        var classname = e.layer.options.attributes.id;
        $(".valuesrect." + classname + "").attr("style", "stroke: red; stroke-width: 0.5px;fill:red;fill-opacity:0.5");
        var item = new Array();
        item[0] = e.layer.options.attributes.x;
        item[1] = e.layer.options.attributes.y;
        lonlat[lonlat.length] = item;
        console.info(lonlat.length);
        console.info(JSON.stringify(lonlat));
        //$(this).attr("style", "stroke: red; stroke-width: 0.5px;fill:red;fill-opacity:0.5");
    })
    //$(".valuesrect").click(function () {
    //     
    //    $(this).attr("style", "stroke: red; stroke-width: 0.5px;fill:red;fill-opacity:0.5");

    //})

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
    L.marker([LATITUDE, LONGITUDE], { icon: myIcon, attributes: { id: "grid" + VENUEID } }).addTo(GridLaterGroup);//.bindPopup(this.OBTNAME + "-" + this.OBTID);
}

//var mapcircle11 = null;
//var windImageOld1 = null, windImage1 = null;
//加载地图
function mapInit(mapName) {
    var locationInfo = [22.3, 113.7], zm = 10;
    map = null;
    map = L.map("mapid", { center: [20, 114], zoom: 10, zoomControl: false });
    L.tileLayer("http://{s}.google.cn/vt/hl=zh-CN&lyrs=p&apistyle=%2Cs.t%3A3%7Cp.v%3Aoff%2Cs.t%3A4%7Cp.v%3Aoff&gl=cn&x={x}&y={y}&z={z}", {
        subdomains: ["mt0", "mt1", "mt2", "mt3"]
    }).addTo(map);
    var gdCityborder = L.esri.dynamicMapLayer({ opacity: 0.5, url: '//10.153.96.174/ArcGIS/rest/services/LFSSZArea/MapServer', format: "png8", f: "image", useCors: false, sr: 102113, layers: [0] });
    gdCityborder.addTo(map);
    gdCityborder.bringToBack();
    operationGridLaterGroup = L.featureGroup().addTo(map).bringToFront();
    GridLaterGroup = L.featureGroup().addTo(map);
    var cloudPic_extent = [
        [22.275, 113.675],
        [22.875, 114.675]
    ];
    var zoomControl = L.control.zoom({
        position: 'bottomleft',
        zoomInTitle: '放大地图',
        zoomOutTitle: '缩小地图',

    });
    map.addControl(zoomControl);
    GridimageOverlay = L.imageOverlay("", cloudPic_extent).setOpacity(0).addTo(map); //云图预报按钮组

    //画格点和显示预报数据
    DrawLat_FC_map();
}

//格点的鼠标事件
function drawingGrid(e, event) {
    map.doubleClickZoom.enable();
    map.scrollWheelZoom.enable();
    $("body").attr("style", "overflow:none");
    // var const_x = 113.0;
    // var const_y = 21.7;
    // var gridsize = 0.05;
    // var gridwidth = 30;
    // var gridheight = 18;
    //var parseGrid = parseInt((e.latlng.lat - const_y) / gridsize);
    //parseGrid = (e.latlng.lng - const_x) % gridsize;


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
                color: "red",
                attributes: {
                    id: "d"
                },
                fillOpacity: 0.7
            });
            polygonClick.addTo(operationGridLaterGroup);
            popuphchar.setContent("<div id='hchars'></div><p>");
            polygonClick.bindPopup(popuphchar).openPopup();
            //GetGridHchartsDatas(indexGrid);
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
                color: "red",
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
function getgriddata(IsFirstLoad) {
    loadpage();
    $.post('/WebService.asmx/GetGridDatas', {
        NewTime: GetUITime().format("yyyy-MM-dd hh:mm:ss"),
        model: model,
        ybsx: ybsx,
        savetype: savetype
    }, function (data, textStatus, xhr) {
        layer.close(load);
        $("#btnsave").attr("disabled", "disabled");
        if (data === null || data === undefined || data === "[]") {
            griddata = null;
            DrawLat_FC_map();
            layer.msg('未获取到数据', {
                icon: 5
            });
            return;
        }
        griddatanew = JSON.parse(data);
        if (griddatanew[1].length == 0) {
            griddatanew = new Array();
            return;
        }
        $("#btnsave").removeAttr("disabled");
        griddata[griddata.length] = JSON.parse(data);
        //griddatanew[griddatanew.length] = JSON.parse(data);
        //console.table(griddata);
        DrawLat_FC_map();
        if (IsFirstLoad == "new") {
            //$(".timegrid_day").val(griddata[0].DDATETIME.toDate().format("yyyy-MM-dd"));
            //$("#QB_hour").val(griddata[0].DDATETIME.toDate().format("hh"));
            //ForecastAging();
            //$(".foretimeleft").click(function () {
            //    var selectlists = $("#FC_hour").find("option");
            //    for (var i = 0; i < selectlists.length; i++) {
            //        if (selectlists[i].value == ybsx) {
            //            if (i === 0) {
            //                return;
            //            }
            //            ybsx = selectlists[i - 1].value;
            //            $("#FC_hour").val(selectlists[i - 1].value);
            //            getgriddata(GetGridUIDateTime().format("yyyy-MM-dd hh:mm:ss"));
            //            return;
            //        }
            //    }
            //})
            //$(".foretimeright").click(function () {
            //    var selectlists = $("#FC_hour").find("option");
            //    for (var i = 0; i < selectlists.length; i++) {
            //        if (selectlists[i].value == ybsx) {
            //            if (i === selectlists.length - 1) {
            //                return;
            //            }
            //            ybsx = selectlists[i + 1].value;
            //            $("#FC_hour").val(selectlists[i + 1].value);
            //            getgriddata(GetGridUIDateTime().format("yyyy-MM-dd hh:mm:ss"));
            //            return;
            //        }
            //    }
            //})
        }
    }).error(function (xhr) {
        /* Act on the event */

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

//$('.btn-primary-hour.active').contextify(options);

//获取自动站站点数据（原始自动站站点数据、格点对应的自动站站点数据）
function GetobtcodeDatas(type) {
    //if (ObtcodeDatas == null) {
    $.post('/WebService.asmx/GetobtcodeDatas', { type: type }, function (data, textStatus, xhr) {
        if (data === null || data === undefined || data === "[]") {
            return;
        }
        layer.close(load);
        //ObtcodeDatas = ;
        DrawObt(JSON.parse(data));
    }).error(function (xhr) {
        layer.msg('数据出错，请刷新重试。', {
            icon: 5
        });
    });
    //} else {
    // DrawObt();
    //}
    function DrawObt(ObtcodeDatas) {
        $(ObtcodeDatas).each(function (i) {
            var circleMarker = L.circleMarker([this.Y, this.X], {
                radius: 6,
                color: 'green',
                fillColor: 'green',
                fillOpacity: 0.8,
                className: 'showobtcode',
                attributes: { id: this.OBTID, x: this.X, y: this.Y }
            }).addTo(map).bindPopup(this.OBTNAME);
            if (savetype == "forecaster") {
                var strHtml = "<div><p>数据加载中……</p></div>";
                var popup = L.popup({ minWidth: 150, offset: new L.point(0, -5) });
                popup.setContent(strHtml)
                // polygon.bindPopup(popup);
                circleMarker.on('mouseover', function (e) {
                    popup.setLatLng(e.latlng)
                    map.openPopup(popup);
                    var obtid = e.target.options.attributes.id;
                    var x = e.target.options.attributes.x;
                    var y = e.target.options.attributes.y;
                    if (obtid != null && obtid != undefined) {
                        //$.post('/WebService.asmx/Savegriddata', { type: savetype, griddata: JSON.stringify(griddatanew), username: forecasterName }, function (data, textStatus, xhr) {
                        //    if (data === null || data === undefined || data === "[]") {
                        //        return;
                        //    }
                        //    layer.close(load);
                        //    layer.msg('保存成功！', { icon: 1, time: 1000 });
                        //}).error(function (xhr) {
                        //    layer.msg('数据出错，请刷新重试。', {
                        //        icon: 5
                        //    });
                        //});
                    }
                })
                circleMarker.on('mouseout', function () {
                    map.closePopup(popup);
                })
            }
            //number = number.toFixed(1);
            //if (value == "V") {
            //    number = (number / 1000).toFixed(1) + "KM";
            //}
            //var opaqueIcon = new L.DivIcon({ className: 'showawstext awstext', html: "<span style='color: " + color + ";'>" + number + "<span>" });
            //var marker = new L.Marker([this.LATITUDE, this.LONGITUDE], { icon: opaqueIcon }).addTo(map_aws);
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
