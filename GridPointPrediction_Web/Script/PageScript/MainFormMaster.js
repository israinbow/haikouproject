/*!
 * DataJson  Javascript Library
 * xgq - v0.0.3
 * Date: 2017-11-16 14:05
 */
function userAgent() {
    var ua = navigator.userAgent;
    ua = ua.toLowerCase();
    var match = /(webkit)[ \/]([\w.]+)/.exec(ua) || /(opera)(?:.*version)?[ \/]([\w.]+)/.exec(ua) || /(msie) ([\w.]+)/.exec(ua) || !/compatible/.test(ua) && /(mozilla)(?:.*? rv:([\w.]+))?/.exec(ua) || [];
    switch (match[1]) {
        case "msie":      //ie
            if (parseInt(match[2]) < 9) {
                alert("您的浏览器版本太低，请使用Google Chrome、Firefox或IE9+浏览器!");
                window.location.href = "http://windows.microsoft.com/zh-CN/internet-explorer/download-ie/";
            }
            break;
        case "webkit": //safari or chrome
            break;
        case "opera": //opera
            break;
        case "mozilla": //Firefox
            break;
        default:
            break;
    }
}

var TypeName = "";
$(document).ready(function () {
    userAgent();
    var NowPageName = window.location.pathname.substring(1, window.location.pathname.length);
    for (var a = 0; a < FineForcastList.length; a++) {
        if (NowPageName === "Page/" + FineForcastList[a].PageURL) {
            TypeName = "精细化预报";
        }
    }
    var OutMemuHtml = "";
    for (var i = 0; i < MemuList.length; i++) {
        if (NowPageName === "Page/" + MemuList[i].PageURL || TypeName === MemuList[i].PageName) {
            OutMemuHtml += "<span><a class=\"hover\" title=\"" + MemuList[i].PageName + "\">" + MemuList[i].PageName + "</a>";
            TypeName = MemuList[i].PageName;
        } else {
            if (NowPageName === "" && MemuList[i].PageURL === "Default.aspx") {
                OutMemuHtml += "<span><a class=\"hover\" title=\"" + MemuList[i].PageName + "\">" + MemuList[i].PageName + "</a>";
                TypeName = MemuList[i].PageName;
            } else {
                OutMemuHtml += "<span><a title=\"" + MemuList[i].PageName + "\">" + MemuList[i].PageName + "</a>";
            }
        }
        OutMemuHtml += "</span>";
    }
    $(".headermemu").html(OutMemuHtml);
    $(".headermemu span > a").click(function (obj) {
        obj = obj.currentTarget;
        for (var i = 0; i < MemuList.length; i++) {
            if ($(this).attr("title") === MemuList[i].PageName) {
                window.location.href = MemuList[i].PageURL;
                TypeName = MemuList[i].PageName;
            }
        }
    });
    if (TypeName === "精细化预报") {
        loadSecondLevelMenu();
        loadForcastProcessList();
        TypeName = "精细化预报";
    }
    else if (TypeName === "检验评分") {
        TypeName = "检验评分";
    }
    $(".subNav").click(function () {
        $(this).toggleClass("currentDd").siblings(".subNav").removeClass("currentDd");
        $(this).toggleClass("currentDt").siblings(".subNav").removeClass("currentDt");

        // 修改数字控制速度， slideUp(500)控制卷起速度
        $(this).next(".navContent").slideToggle(500).siblings(".navContent").slideUp(500);
    });
    var Request = GetRequest();
    if (Request.flag) {
        for (var id = 0; id < ncarpicturelist.length; id++) {
            var flag = Request.flag;
            if (flag === ncarpicturelist[id].productName) {
                $("#" + ncarpicturelist[id].productName).addClass("hover");
            }
        }
    }

    //预报制作三级菜单点击事件
    $("#bottomSecondMenu ul li").click(function () {
        var NowPageName = window.location.pathname.substring(1, window.location.pathname.length);

        var id = this.id;
        for (var i = 0; i < ncarpicturelist.length; i++) {
            $("#" + ncarpicturelist[i].productName).removeClass("hover");
            if (id === ncarpicturelist[i].productName) {
                //判断当前地址是否为产品展示页面，如果不是则加载并带上当前点击的按钮的id作为标识flag
                if (NowPageName !== "Page/NCAR_WeatherPicture.aspx") {
                    window.location.href = "NCAR_WeatherPicture.aspx?flag=" + id;
                }
                //是当前点击按钮处于选中状态
                $("#" + id).addClass("hover");
                if (this.id.split("_").length > 1) {
                    Type = "NCAR";
                    $("#NCARImg").css("display", "block");
                    $("#HapsImg").css("display", "none");

                    leftType = id.split("_")[0];
                    range = id.split("_")[1];
                    if (id === "humit") {
                        $("#hDiv").css("display", "block");
                        $("#timeDiv").css("width", "490px");
                    }
                    else {
                        $("#timeDiv").css("width", "410px");
                        $("#hDiv").css("display", "none");
                    }
                    if (id === "humit" || id === "temptest" || id === "windforecast" || id === "humitTest") {
                        $(".maxPicture").css("display", "block");
                        $(".minPicture").css("display", "none");
                    }
                    else {
                        $(".minPicture").css("display", "block");
                        $(".maxPicture").css("display", "none");
                    }
                } else {
                    if (id === "Haps") {
                        Type = "Haps";
                        $("#NCARImg").css("display", "none");
                        $("#HapsImg").css("display", "block");
                    } else {
                        //产品对比TODO
                        return;
                    }
                }

                if (NowPageName === "Page/NCAR_WeatherPicture.aspx") {
                    $(".txtdate ul li button").removeClass("active");
                    $("#nowdate").addClass("active");
                    GetNCARTime(range);
                    $("#datestart").val(NewTime.format("yyyy-MM-dd"));
                    dir = NewTime.format("yyyyMMdd");
                    doload();
                }
            }
        }

    });
});
//添加精细化预报二级菜单
function loadSecondLevelMenu() {
    var NowPageName = window.location.pathname.substring(1, window.location.pathname.length);
    var OutMemuHtml = "";
    for (var i = 0; i < SecondMemuList.length; i++) {
        if (NowPageName === "Page/" + SecondMemuList[i].PageURL) {
            OutMemuHtml += "<span><a class=\"hover\" title=\"" + SecondMemuList[i].PageName + "\">" + SecondMemuList[i].PageName + "</a>";
        } else {
            if (NowPageName === "" && SecondMemuList[i].PageURL === "Default.aspx") {
                OutMemuHtml += "<span><a class=\"hover\" title=\"" + SecondMemuList[i].PageName + "\">" + SecondMemuList[i].PageName + "</a>";
            } else {
                OutMemuHtml += "<span><a title=\"" + SecondMemuList[i].PageName + "\">" + SecondMemuList[i].PageName + "</a>";
            }
        }
        OutMemuHtml += "</span>";
    }
    $("#headSecondMenu").html(OutMemuHtml);
    $("#headSecondMenu").css("display", "block");
    $("#headSecondMenu span > a").click(function (obj) {
        obj = obj.currentTarget;
        for (var i = 0; i < SecondMemuList.length; i++) {
            if ($(this).attr("title") === SecondMemuList[i].PageName) {
                window.location.href = SecondMemuList[i].PageURL;
            }
        }
    });
    //弹出二级菜单栏
    layer.open({
        title: ['精细化预报', 'font-size:17px;font-weight:bold;text-align:center;padding-left:55px;font-family:微软雅黑;'],
        type: 1,
        skin: "layui-layer-lan",//样式类名
        area: ['290px', '800px'],//只定义宽度可以area: '290px'（当你宽高都要定义时，你可以area: ['500px', '300px']）
        //scrollbar: false,
        offset: ['175px', '8px'],
        content: $("#SecondLevelMenu"),
        fixed: false,
        shade: 0, //不显示遮罩
        closeBtn: 0,
        success: function (layero, index) {
        }
    });
}

//添加预报制作菜单列表
function loadForcastProcessList() {
    $(".navContent li").click(function (obj) {
        obj = obj.currentTarget;
        for (var i = 0; i < ForcastProcessMenuList.length; i++) {
            if ($(this).attr("title") === ForcastProcessMenuList[i].PageName) {
                window.location.href = ForcastProcessMenuList[i].PageURL;
            }
        }
    });
}

function GetRequest() {
    var url = location.search; //获取url中"?"符后的字串   
    var theRequest = new Object();
    if (url.indexOf("?") !== -1) {
        var str = url.substr(1);
        strs = str.split("&");
        for (var i = 0; i < strs.length; i++) {
            theRequest[strs[i].split("=")[0]] = unescape(strs[i].split("=")[1]);
        }
    }
    return theRequest;
}

