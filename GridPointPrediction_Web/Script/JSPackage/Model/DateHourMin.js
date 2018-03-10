var NowDate = new Date();
var hour = [0],      //小时
    min = [0];       //分钟

var OutHtml = function () {
    var hourHtml = "",
        minHtml = "";
    for (var i = 1; i < hour.length; i++) {
        hourHtml += "<option value=\"" + hour[i] + "\">" + hour[i] + "</option>";
    }
    for (var i = 1; i < min.length; i++) {
        minHtml += "<option value=\"" + min[i] + "\">" + min[i] + "</option>";
    }
    var html = "\
        <div style=\"float:left\">\
            <input type=\"text\" id=\"datepicker\" class=\"inputdate\" />\
            <select name=\"number\" id=\"hour\" class=\"hour\">\
                <option selected=\"selected\" value=\""+ hour[0] + "\">" + hour[0] + "</option> " + hourHtml + "\
            </select>\
            <span style=\"font-weight: bold;\">\&nbsp:&nbsp </span>\
            <select name=\"number\" id=\"min\" class=\"min\">\
                <option selected=\"selected\" value=\"" + min[0] + "\">" + min[0] + "</option> " + minHtml + "\
            </select>\
        </div>\
        <div style=\"float:left; width:9px;margin-left:5px;\">\
            <span style=\"width:9px;height:12px; display:inline-block; float:left;\">\
                <input type=\"image\" class=\"up\" src=\"JSPackage/Model/image/iconUp.png\" />\
            </span>\
            <span style=\"width:9px; height:9px; display:inline-block; float:left;\">\
                <input type=\"image\" class=\"down\" src=\"JSPackage/Model/image/iconDown.png\" />\
            </span>\
        </div>\
        <div class=\"link\">\
            <input type=\"image\" class=\"select\" src=\"JSPackage/Model/image/updateSelect.gif\">\
            <input type=\"image\" class=\"new\" src=\"JSPackage/Model/image/new.gif\">\
        </div>\
        ";
    return html;
}  //输出的html


var DateHourMin_init = function () {
    $("#DateHourMin #datepicker").datepicker();
    $("#DateHourMin #datepicker").val(NowDate.format('yyyy-MM-dd'));    //初始化日期

    $("#datepicker").change(function () {                   //改变日期
        var _datevalue = $("#datepicker").val().split('/');
        $("#datepicker").val(_datevalue[2] + '-' + _datevalue[0] + '-' + _datevalue[1])
    });

    $("#DateHourMin .select").on("click", function () {     //点击更新
        this.src = "JSPackage/Model/image/updateSelect.gif";
        $("#DateHourMin .new").attr("src","JSPackage/Model/image/new.gif");
    });
    $("#DateHourMin .new").on("click", function () {        //点击最新
        this.src = "JSPackage/Model/image/newSelect.gif";
        $("#DateHourMin .select").attr("src", "JSPackage/Model/image/update.gif");
    });

    //上下分钟
    $("#DateHourMin .up").on("click", function () {
        var idx = $("#DateHourMin .min").get(0).selectedIndex - 1;
        if (idx < 0) { idx = min.length - 1; }
        $("#DateHourMin .min option").removeAttr("selected");
        $("#DateHourMin .min [value='" + min[idx] + "']").attr("selected", "true");
    })
    $("#DateHourMin .down").on("click", function () {
        var idx = $("#DateHourMin .min").get(0).selectedIndex + 1;
        if (idx > (min.length - 1)) { idx = 0; }
        $("#DateHourMin .min option").removeAttr("selected");
        $("#DateHourMin .min [value='" + min[idx] + "']").attr("selected", "true");
    })
};


var DateHourMin = function (_hour, _min) {
    if (_hour != null && _hour.length > 0) {
        hour = _hour;
    }
    if (_min != null && _min.length > 0) {
        min = _min;
    }
    $("#DateHourMin").html(OutHtml());
    DateHourMin_init();
}



