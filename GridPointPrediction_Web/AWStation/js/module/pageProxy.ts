import Leaflet from "module/leaflet";
import googleMap from "module/googleMap";
export namespace pageProxy {
    export var leaflet: any;
    export var dateTimePicker2: any;
    export var playIndex = 0, colorSpotEnable = true;
    export var modalLg: HTMLElement, speedControl: any;
    export var playWidget: any, playtime_div: any;
    export var locateMarker: any;
    export var cityBoundaryLayer: any;
    export var maxValueMarker: any;
    let fullViewDataSort = true;
    var appBackDataPort: DataProxy;
    (<any>window).pageProxy = pageProxy;

    function setMapContainerSize() {
        $("#leaflet_map").css("height", $(window).height() - $("#header_div").height() - 10);
    }
    //初始化
    export function setBackDataPort(backDataPort: DataProxy) {
        appBackDataPort = backDataPort;
    }
    export function initMap(options: any): L.Map {
        setMapContainerSize();
        leaflet = new Leaflet("leaflet_map", options);
        window.onresize = setMapContainerSize;
        playtime_div = $("#playtime_div");
        return leaflet.map;
    }
    export function onShowComplete(data: any, options: any, reason: any) {
        if (options.title && options.ddtime) playtime_div.text(options.ddtime.format("yyyy/MM/dd HH:mm ") + options.title);
        if (reason !== 1) {
            showAWSList(fullViewDataSort);
        }
    }
    //设置左侧列表显示是窗口数据，还是全景数据
    export function showAWSList(isFull: boolean) {
        fullViewDataSort = isFull;
        if (isFull)
            appBackDataPort.getFullViewDataSort(50, function (respone) {
                pageProxy.loadList(respone, appBackDataPort.unit, appBackDataPort.lastAwsInfo);
            });
        else {
            let list: any[];
            for (var i = 0, order; i < appBackDataPort.lastAwsData.length; i++) {
                if (list) list = list.concat(appBackDataPort.lastAwsData[i].items);
                else list = appBackDataPort.lastAwsData[i].items;
            }
            list = Enumerable.From(list).OrderByDescending(function (t) { return t.V0; }).ToArray();
            pageProxy.loadList(list, appBackDataPort.unit, appBackDataPort.lastAwsInfo);
        }
    }
    //初始化日期控件
    export function initDateTimePicker(ddatetime?: any) {
        let cookieTime = +window.common.myCookie("dtimePickerValue");
        if (cookieTime > 0)
            ddatetime = new Date(cookieTime);
        focusComfirmInput(false);
        let pageOnload = true;
        require(["util/dtimePicker"], function (dtimePicker: any) {
            dateTimePicker2 = new dtimePicker.datetimePicker(document.getElementById("dateTimePicker2"), 5, { autoEvent: false });
            dateTimePicker2.onUpdate = function (ddtime: Date) {
                resetPlayer(ddtime);
                if (!pageOnload)
                    fireEvent("updateTime", ddtime, 0);
                pageOnload = false;
            }
            if (!ddatetime) {
                ddatetime = new Date();
                var minute = ddatetime.getMinutes();
                minute -= minute % 5;
                minute -= 10;
                ddatetime.setMinutes(minute, 0, 0);
            }
            dateTimePicker2.setValue(ddatetime);
        });
    }
    export function getLastData() {
        appBackDataPort.getServiceData(changeReason.getLastData, appBackDataPort.lastdate, (res: DrawDataUnit[]) => {
            let lastTime = res[0].items[0].TM; 
            initDateTimePicker(lastTime);
        });
    }

    export function comfirmTime() {
        let comfirm = dateTimePicker2.getValue();
        dateTimePicker2.setValue(comfirm);
        window.common.myCookie("dtimePickerValue", comfirm.getTime().toString(), { path: "/", maxAge: -1 });
        focusComfirmInput(true);
    }
    function focusComfirmInput(checked: boolean) {
        if (checked) {
            $("#comfirm_input").attr("lang", "chked");
            $("#lastTime_input").attr("lang", "uchked");
        } else {
            $("#comfirm_input").attr("lang", "uchked");
            $("#lastTime_input").attr("lang", "chked");
        }
    }
    var iframe: HTMLIFrameElement;
    export function getOBTHistory(obtId: string) {
        function setHisDialogUrl(url: string) {
            iframe.src = url;
            iframe.onload = () => {
                $(modalLg).modal();
                //使模态框垂直居中显示
                var $dialog = $(modalLg).find("div.modal-dialog"), top = (document.documentElement.clientHeight - $dialog.height()) / 2;
                $dialog.css({ "margin": +top + "px auto" });
            }
        }
        if (modalLg == null) {
            modalLg = document.body.appendElement("div");
            modalLg.setAttribute("draggable", "true")
            modalLg.setAttribute("tabindex", "-1");
            modalLg.setAttribute("role", "dialog");
            modalLg.setAttribute("aria-labelledby", "myLargeModalLabel");
            modalLg.setAttribute("aria-hidden", "true");
            modalLg.className = "modal bs-example-modal-lg";
            modalLg.style.zIndex = "1071";

            var c = modalLg.appendElement("div");
            c.className = "modal-dialog modal-lg";
            var content = c.appendElement("div");
            content.className = "modal-content";

            var header = content.appendElement("div");
            header.className = "modal-header";
            header.style.backgroundColor = "#337AB7";
            header.style.color = "#fff";
            header.style.padding = "3px";
            header.style.borderRadius = "5px 5px 0 0";
            $(header).html('<button type="button" style="margin:0 0 0 0;" class="close" data-dismiss="modal"><span aria-hidden="true" style="font-size:25px;margin:0 10px 0 0;line-height:20px;">&times;</span><span class="sr-only">Close</span></button>');
            var div = header.appendElement("div");
            div.style.paddingLeft = "10px";
            div.className = "modal-title";
            div.id = "dialogHeader_h4";
            iframe = content.appendElement("iframe") as HTMLIFrameElement;
            iframe.style.border = "none";
            iframe.width = "100%";
            iframe.height = "450";
        }
        $("#dialogHeader_h4").html(window.obtNames[obtId][3] + "(" + obtId + ")");
        setHisDialogUrl("inc/dialog.html?ver=10.0&obtId=" + obtId + "&subject=" + appBackDataPort.name + "&current=" + (appBackDataPort.lastdate ? appBackDataPort.lastdate.getTime() : 0) + "&timeMode=" + appBackDataPort.timeMode + "&field=" + appBackDataPort.dataField);
    }
    //重置播放器
    export function resetPlayer(lastTime: any) {
        var datetimes = getPlayTimeScale(lastTime || dateTimePicker2.getValue());
        setPlayWidget(datetimes);
    }
    //初始化动画
    function setPlayWidget(dateTimeList: any) {
        var button_play = <HTMLImageElement>document.getElementById("play_img");
        require(["util/player"], function (player: any) {
            if (playWidget)
                playWidget.setPlayStep(dateTimeList);
            else {
                let userStoped = true;
                playWidget = new player.default(dateTimeList, 500, { enableSlidePlay: true, container: document.getElementById("animation_span"), btnPlay: button_play, btnPrev: document.getElementById("play_back_img"), btnNext: document.getElementById("play_front_img") });
                playWidget.onPlay = function (ddtime: any, callback: any, options: any) {
                    userStoped = false;
                    fireEvent("updateTime", ddtime, options.autoPlay ? 1 : 0, function () { if (!userStoped && callback) callback(); });
                    if (options.autoPlay)
                        button_play.src = "/AWStation/images/stop.png";
                }
                playWidget.onStop = function (reason: any) {
                    userStoped = true;
                    button_play.src = "/AWStation/images/play1.png";
                    if (reason == "onclick" && appBackDataPort.lastAwsInfo) { //会重新注册图案坐标，并加载排名
                        appBackDataPort.getServiceData(changeReason.other, appBackDataPort.lastdate);
                    }
                }
            }
            if (!speedControl)
                speedControl = new Slider('#horizontalSlider_speed', { tooltip: "hide", value: 5 }).on('change', function (val: any) {
                    playWidget.setPlaySpeed((10 - val.newValue || 1) * 100);
                });
        });
    }
    //设置动画时间列表
    function getPlayTimeScale(lastDatetime: any) {
        var datetimes = [], playstep = +(<HTMLSelectElement>document.getElementById("playstep_select")).value;
        for (var i = 19; i >= 0; i--) {
            var time = new Date(lastDatetime);
            time.setMinutes(time.getMinutes() - i * playstep);
            datetimes.push(time);
        }
        return datetimes;
    }
    //最新时间
    export function getLastOBT() {
        appBackDataPort.lastdate = null;
        window.common.myCookie("dtimePickerValue", null, { path: "/" });
        appBackDataPort.getServiceData(changeReason.getLastData, null, function (res: DrawDataUnit[]) {
            let lastTime = res[0].items[0].TM;
            dateTimePicker2.setValue(lastTime, false);
            resetPlayer(lastTime);
        });
    }
    //上一时间，下一时间
    export function prevOrNextTime(next: any) {
        var tt = dateTimePicker2.getValue();
        tt.setMinutes(tt.getMinutes() + (next ? 5 : -5));
        dateTimePicker2.setValue(tt);
        focusComfirmInput(true);
    }
    //指定站点
    export function locate(lat: any, lng: any, obtId: any) {
        leaflet.map.closePopup();
        if (locateMarker != null) leaflet.map.removeLayer(locateMarker);
        locateMarker = L.marker([lat, lng]).addTo(leaflet.map);79
        leaflet.map.setView([lat, lng], 11);
        window.setTimeout(function () {
            leaflet.map.removeLayer(locateMarker);
            window.setTimeout(function () {
                leaflet.map.addLayer(locateMarker);
                window.setTimeout(function () {
                    leaflet.map.removeLayer(locateMarker);
                }, 1500);
            }, 500);
        }, 1000);
    }
    //搜索自动站
    export function searchAws() {
        var keyWord = (<HTMLInputElement>document.getElementById("searchAws_input")).value;
        if (keyWord == "")
            alert("请输入自动站编号或名称关键字");
        else if (window.obtNames) {
            var obtId = /[0-9]+$/.test(keyWord), result: any;
            if (obtId) {
                keyWord = keyWord.toUpperCase();
                result = Enumerable.From(window.obtNames).FirstOrDefault(null, function (d: any) {
                    return d.Key == keyWord;
                });
            } else result = Enumerable.From(window.obtNames).FirstOrDefault(null, function (d: any) {
                return d.Value[3].indexOf(keyWord) != -1;
            });
            if (result)
                locate(result.Value[0], result.Value[1], result.Key);
            else
                alert("没找到指定的自动站");
        }
    }
    //国家站，区域站
    export function changeAwsType(awsType: any, checked: any) {
        appBackDataPort.setAwsType(awsType, checked);
    }
    //色斑图
    export function checkColorSpot(obj: any) {
        if (obj.checked != false) {
            obj.checked = false;
            obj.className = "btn btn-default btn-xs"
        }
        else {
            obj.checked = true;
            obj.className = "btn btn-primary btn-xs"
        }
        fireEvent("checkColorSpot", checkColorSpot);
    }
    ///事件注册器
    let eventRegister: { [type: string]: Function[] } = {};
    function fireEvent(this: any, type: string, ...arges: any[]) {
        let handler = eventRegister[type];
        if (handler)
            for (let fuc of handler)
                fuc.apply(this, arges);
    }
    export function on(type: string, callback: Function) {
        let handler = eventRegister[type];
        if (handler)
            handler.push(callback);
        else
            eventRegister[type] = [callback];
    }
    export function changeAwsField(catalog: string, timeMode: number, dataName: string, mapView?: number[]) {
        let order_asc_input = <HTMLInputElement>document.getElementById("order_asc_input");
        let order_desc_input = <HTMLInputElement>document.getElementById("order_desc_input");
        if (catalog.indexOf("MIN") > -1) {
            order_asc_input.checked = true;
            order_asc_input.parentElement.className = "btn btn-default active";
            order_desc_input.parentElement.className = "btn btn-default";
        }
        else {
            order_desc_input.checked = true;
            order_desc_input.parentElement.className = "btn btn-default active";
            order_asc_input.parentElement.className = "btn btn-default";
        }
        fireEvent("changeAwsField", catalog, timeMode, dataName, mapView);
    }
    export function changeArea(area: any, onlyNavi: any) {
        if (onlyNavi) return;
        if (cityBoundaryLayer != null) leaflet.map.removeLayer(cityBoundaryLayer);
        if (locateMarker != null) leaflet.map.removeLayer(locateMarker);
        if (area == "LOCAL") { leaflet.map.setView([19.188916, 109.724855], 7); }
        appBackDataPort.setArea(area);

    }
    export function changeCity(obj: any, name: any, center: any, zoom: any, citys: any) {
        $(obj).addClass("active_btn");
        leaflet.map.closePopup();
        leaflet.map.once("moveend", function () {
            if (cityBoundaryLayer != null) leaflet.map.removeLayer(cityBoundaryLayer);
            if (name != "海南省") {
                let url = "data/boundary_city/haikou.txt";               
                $.getJSON(url, (boundary) => {
                    L.polyline(boundary, { weight: 2, color: "#FF6600" }).addTo(pageProxy.leaflet.map);
                });
            }
        });      
        appBackDataPort.setCity(citys, name);
        leaflet.map.setView(center, zoom);
    }
    //左侧加载自动站列表
    export function loadList(data: any, unit: any, options: any, drawOffset?: any) {
        $("#dataList_panel").text(options.title + options.ddtime.format("（yyyy-MM-dd HH:mm）"));
        $("#unit_th").text(unit);
        var innertr = "", obt, name;
        Enumerable.From(data).ForEach(function (d: any) {
            obt = window.obtNames[d.ID];
            if (obt) {
                name = obt[3];
                innertr += "<tr><td style='text-align:center'>" + d.ID + "</td>";
                if (0 && options.area == "haikou") {
                    innertr += "<td style='text-align:center;'>" + pageProxy.getAreaName(obt[2]) + "</td>";
                    innertr += "<td style='text-align:center;'>" + obt[5] + "</td>";
                }
                innertr += "<td style='padding-left:3px;'><a href='javascript:pageProxy.locate(" + obt[0] + "," + obt[1] + ",\"" + d.ID + "\")'>" + name + "</a></td><td style='text-align:center'>" + d.TM.format('HH:mm') + "</td><td style='text-align:center'>" + d.V0 + "</td></tr>";
            }
        });      
        $("#obtList_table").html(innertr);
    }
    //左侧加载自动站列表(风速专用)
    export function loadList2(data: any[], unit: any, options: any, drawOffset: any) {
        var innertr = "";
        if (data.length == 0) {
            innertr = "<tr><td colspan='4' style='text-align:center;height:30px; color:red'>没有数据</td></tr>"
        } else {
            var index = 0, obt, name, color, maxWindObt: any = { V0: 0 };
            Enumerable.From(data).ForEach(function (d: any) {
                obt = window.obtNames[d.ID];
                if (obt) {
                    name = obt[3];
                    if ((obt[6] === 0 || obt[6] === 1) && d.V0 > maxWindObt.V0) {
                        maxWindObt = d;
                        maxWindObt.INFO = obt;
                    }
                    color = "";
                    if (d.V0 >= 32.7) { color = "#FF00FF"; }
                    else if (d.V0 >= 28.5) { color = "#FF9900"; }//11级
                    else if (d.V0 >= 24.5) { color = "#FF9900"; }//10级
                    else if (d.V0 >= 20.8) { color = "#FF0000"; }//9级
                    else if (d.V0 >= 17.2) { color = "#FF0000"; }//8级
                    else if (d.V0 >= 13.9) { color = "#FF0000"; }//7级
                    else if (d.V0 >= 10.8) { color = "#FF0000"; }//6级
                    else if (d.V0 >= 8.0) { color = "#41353E"; }//5级
                    if (++index > 100 && options.area == "OTHER")
                        return false;
                    innertr += "<tr><td style='text-align:center'>" + d.ID + "</td>";
                    if (0 && options.area == "haikou") {
                        innertr += "<td style='text-align:center;'>" + pageProxy.getAreaName(obt[2]) + "</td>";
                        innertr += "<td style='text-align:center;'>" + obt[5] + "</td>";
                    }
                    d.LEVEL = d.LEVEL || appBackDataPort.getLevel(d.V0);
                    innertr += "<td><a href='javascript:pageProxy.locate(" + obt[0] + "," + obt[1] + ",\"" + d.ID + "\")'>" + name + "</a></td><td style='text-align:center'>" + d.TM.format('HH:mm') + "</td><td  style='padding-left:5px;color:" + color + "'>" + d.V0 + "<div style='float:right;color:#000;width:18px;text-align:center; border-left:1px solid gray'>" + d.LEVEL + "</div></td></tr>";
                }
            });
        }
        $("#obtList_table").html(innertr);
        $("#dataList_panel").html(options.title + options.ddtime.format("（yyyy-MM-dd HH:mm）"));
        $("#unit_th").html(unit + "<span style='float:right'>级</span>");
        if (maxWindObt && maxWindObt.INFO) {
            let content = "<div id='playtime_egleValue' style='text-align:right;font-size:small;'><span class='glyphicon glyphicon-arrow-up' style='color:red;'></span>&nbsp;陆地最大风速：" + maxWindObt.INFO[3] + " （" + maxWindObt.V0 + "m/s）</div>";
            if (document.getElementById("playtime_egleValue"))
                $("#playtime_egleValue").replaceWith(content);
            else
                $("#playtime_div").append(content);
            if (maxValueMarker)
                leaflet.map.removeLayer(maxValueMarker);
            maxValueMarker = L.marker([maxWindObt.INFO[0], maxWindObt.INFO[1]], { icon: L.divIcon({ html: "<span class='glyphicon glyphicon-arrow-up recSymbol' style='color:red;font-size:18px;text-shadow:3px 0px 10px #000;'></span>", className: "", iconAnchor: [20, 20] }) }).addTo(leaflet.map);
        }
    }
    //更改排序方式
    export function changeListOrder(descending: boolean) {
        appBackDataPort.changeOrderBy(descending);
    }
    //按街道排序
    export function sortByStreet() {
        var obtList_table: any = document.getElementById("obtList_table");
        var street: any, index: any;
        var trs = Enumerable.From(obtList_table.childNodes).ToArray();
        while (obtList_table.lastChild)
            obtList_table.removeChild(obtList_table.lastChild);
        if (!obtList_table.sortYes) {
            obtList_table.sortYes = true;
            Enumerable.From(trs).GroupBy(function (d: any) { return d.childNodes[1].innerText }).ForEach(function (area) {
                Enumerable.From(area).GroupBy(function (a: any) { return a.childNodes[2].innerText }).ForEach(function (street) {
                    var streetSort;
                    if (appBackDataPort.orderByDescending)
                        streetSort = Enumerable.From(street).OrderByDescending(function (d: any) { return +d.childNodes[4].innerText; });
                    else
                        streetSort = Enumerable.From(street).OrderBy(function (d: any) { return +d.childNodes[4].innerText; });
                    index = 0;
                    streetSort.ForEach(function (tr: any) {
                        if (index == 0) {
                            index = 1;
                            tr.childNodes[2].rowSpan = street.Count();
                        } else {
                            tr.childNodes[2].style.display = "none";
                        }
                        obtList_table.appendChild(tr);
                    });
                });
            });
            var lastAreaId: any, areaHead: any;
            Enumerable.From(obtList_table.children).ForEach(function (tr: any) {
                var areaId = tr.childNodes[1].innerText;
                if (lastAreaId != areaId) {
                    areaHead = tr.childNodes[1];
                    areaHead.rowSpan = 1;
                    areaHead.style.borderBottomWidth = "5px";
                    lastAreaId = areaId;
                } else if (areaId == lastAreaId) {
                    areaHead.rowSpan++;
                    tr.childNodes[1].style.display = "none";
                }
            });
        }
        else {
            obtList_table.sortYes = false;
            if (appBackDataPort.orderByDescending)
                street = Enumerable.From(trs).OrderByDescending(function (d: any) { return +d.childNodes[4].innerText; });
            else
                street = Enumerable.From(trs).OrderBy(function (d: any) { return +d.childNodes[4].innerText; });
            street.ForEach(function (d: any) {
                d.childNodes[1].rowSpan = 1;
                d.childNodes[1].style.display = "";
                d.childNodes[1].style.borderBottomWidth = "1px";
                d.childNodes[2].rowSpan = 1;
                d.childNodes[2].style.display = "";
                d.childNodes[2].style.borderBottomWidth = "1px";
                obtList_table.appendChild(d);
            });
        }
    }
    export function getAreaName(id: any) {
        return "-";
    }

    let pngRadarLayer: L.ImageOverlay;
    let pngSettleLayer: L.ImageOverlay;
    let radarControl: any;
    let settleControl: any;
    function getLastTime(url: string, callback: (date: Date) => void) {
        $.get("../getInternet.ashx?url=" + url, (data: string) => {
            let date: Date;
            date = data.indexOf("-") >= 0 ?
                new Date(data) : new Date(data.substr(0, 4) + "/" + data.substr(4, 2) + "/" + data.substr(6, 2) + " " + data.substr(8, 2) + ":" + data.substr(10, 2));
            date.setMilliseconds(6);
            callback(date);
        });
    }
    export function picShow(id: number, isChecked: boolean, obj: any) {
        require(["module/playerUI"], function (export0: any) {
            let timeUrl = "";
            switch (id) {
                case 0: timeUrl = "http://10.155.95.202:8080/data/newCAPPI/CappiTimeCount.count"; break;
                case 1: timeUrl = "http://10.155.95.202:8080/data/newdb_files/qpf60.over"; break;
                case 2: timeUrl = "http://10.155.95.202:8080/data/Thunder/VIL.time"; break;
                default: timeUrl = "http://10.155.95.202:8080/data/mobile/settle/time.txt";
            }
            getLastTime(timeUrl, (lastProTime) => {
                let containerDiv = document.getElementById("playerContainer") as HTMLDivElement;
                if (id >= 0 && id <= 2) {
                    if (isChecked) {
                        leaflet.map.setZoom = 8;
                        let onRadar = function (time: Date, url: string, callback?: (time: Date) => void) {
                            if (!pngRadarLayer) pngRadarLayer = L.imageOverlay(url, [[20.84, 108.17], [17.77, 111.68]]).addTo(leaflet.map).bringToBack();
                            else pngRadarLayer.setUrl(url);
                        }
                        if (radarControl) radarControl.destroy();
                        radarControl = new export0.playerUI(id, lastProTime, onRadar);
                        $("#playerContainer").show().append(radarControl.htmlContainer);
                    }
                    else {
                        if (radarControl) radarControl.destroy();
                        if (!settleControl || settleControl.htmlContainer==null) $("#playerContainer").hide();
                        $(obj).removeClass("active_btn");
                        pngRadarLayer.setUrl("");
                    }
                }
                else {
                    if (isChecked) {
                        leaflet.map.addLayer(leaflet.currentTileLayer);
                        let onSetttle = function (time: Date, url: string, calback?: (time: Date) => void) {
                            if (!pngSettleLayer) pngSettleLayer = L.imageOverlay(url, [[-4.25, 59.98], [44.2499999999999, 158.2145454545453]]).addTo(leaflet.map).bringToBack().setOpacity(.6);
                            else pngSettleLayer.setUrl(url);
                        }
                        if (settleControl) settleControl.destroy();
                        settleControl = new export0.playerUI(id, lastProTime, onSetttle);
                        $("#playerContainer").show().append(settleControl.htmlContainer);
                        leaflet.map.setZoom = 4;
                    }
                    else {
                        if (settleControl)  settleControl.destroy();
                        if (!radarControl) $("#playerContainer" || radarControl.htmlContainer == null).hide();
                        $(obj).removeClass("active_btn");
                        pngSettleLayer.setUrl("");
                    }
                }
            });
        })
    }

}
