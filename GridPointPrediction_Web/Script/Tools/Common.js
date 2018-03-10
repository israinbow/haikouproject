//访问服务器端方法
var WebMethod = {
    _buiPoseJson: function (method, args, url, async, contentType, dataType) {
        args = (args == undefined || args == null) ? {} : JSON.stringify(args);
        url = (url == undefined || url == null) ? document.location.href : url;
        async = async == undefined ? true : async;
        contentType = contentType == undefined ? "application/json; charset=utf-8" : contentType;
        dataType = dataType == undefined ? "json" : dataType;
        var searchIndex = url.indexOf("?");
        if (searchIndex != -1) { url = url.substring(0, searchIndex); }
        if (method != null && method != "") {
            if (url.lastIndexOf("/") == url.length - 1)
                url += WebMethod.DefaultPage;
            url += "/" + method;
        }
        return {
            type: "POST", async: async, url: url, data: args,
            contentType: contentType, dataType: dataType,
            error: function (err) { alert(err.responseText); }
        }
    },
    getData: function (method, args, url) {
        var result;
        var postJson = WebMethod._buiPoseJson(method, args, url, false);
        postJson.success = function (json) { result = typeof json.d == "undefined" ? json : json.d; };
        $.ajax(postJson); return result;
    },
    callBack: function (method, args, success, error, url) {
        var postJson = WebMethod._buiPoseJson(method, args, url, true);
        postJson.success = function (json) { success(typeof json.d == "undefined" ? json : json.d) };
        if (error != undefined && error != null)
            postJson.error = error;
        $.ajax(postJson);
    }
}
// $.cookie(’name’, ‘value’);设置cookie的值，把name变量的值设为value
// $.cookie(’name’, ‘value’, {expires: 7, path: ‘/’, domain: ‘jquery.com’, secure: true});新建一个cookie 包括有效期 路径 域名等
// $.cookie(’name’, null);删除一个cookie
//var account= $.cookie('name');取一个cookie(name)值给myvar
$.cookie = function (name, value, options) {
    if (typeof value != 'undefined') {
        options = options || {};
        if (value === null) {
            value = '';
            options.expires = -1;
        }
        var expires = '';
        if (options.expires && (typeof options.expires == 'number' || options.expires.toUTCString)) {
            var date;
            if (typeof options.expires == 'number') {
                date = new Date();
                date.setTime(date.getTime() + (options.expires * 60 * 1000));
            } else {
                date = options.expires;
            }
            expires = '; expires=' + date.toUTCString();
        }
        var path = options.path ? '; path=' + options.path : '';
        var domain = options.domain ? '; domain=' + options.domain : '';
        var secure = options.secure ? '; secure' : '';
        document.cookie = [name, '=', encodeURIComponent(value), expires, path, domain, secure].join('');
    } else {
        var cookieValue = null;
        if (document.cookie && document.cookie != '') {
            var cookies = document.cookie.split(';');
            for (var i = 0; i < cookies.length; i++) {
                var cookie = jQuery.trim(cookies[i]);
                if (cookie.substring(0, name.length + 1) == (name + '=')) {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }
        return cookieValue;
    }
}
//获取查询字符串
function GetQueryString(str) {
    var LocString = String(window.document.location.href);
    var rs = new RegExp("(^|)" + str + "=([^\&]*)(\&|$)", "gi").exec(LocString), tmp;
    if (tmp = rs) return tmp[2];
    return null;
}
//数组ROMVE方法扩展
Array.prototype.remove = function (obj) {
    for (var i = 0; i < this.length; i++) {
        var temp = this[i];
        if (!isNaN(obj)) {
            temp = i;
        }
        if (temp == obj) {
            for (var j = i; j < this.length; j++) {
                this[j] = this[j + 1];
            }
            this.length = this.length - 1;
        }
    }
}
Array.prototype.contain = function (e) {
    for (i = 0; i < this.length && this[i] != e; i++);
    return !(i == this.length);
}
Array.prototype.addIfNoExit = function (e) {
    if (!this.contain(e))
        this.push(e);
}
String.prototype.getDateFromJSON = function () {
    var ddd = typeof this.d == "undefined" ? this : json.d;
    return new Date(parseFloat(/\d+/.exec(ddd)[0]));
}
String.prototype.PadLeft = function (totalWidth, paddingChar) {
    paddingChar = (paddingChar == undefined || paddingChar == null) ? ' ' : paddingChar;
    return this.PadHelper(totalWidth, paddingChar, false);
}
String.prototype.PadRight = function (totalWidth, paddingChar) {
    paddingChar = (paddingChar == undefined || paddingChar == null) ? ' ' : paddingChar;
    return this.PadHelper(totalWidth, paddingChar, true);
}
String.prototype.PadHelper = function (totalWidth, paddingChar, isRightPadded) {
    if (this.length < totalWidth) {
        var paddingString = new String();
        for (i = 1; i <= (totalWidth - this.length) ; i++) {
            paddingString += paddingChar;
        }
        if (isRightPadded)
            return (this + paddingString);
        else
            return (paddingString + this);
    }
    else
        return this;
}

//时间对象的格式化; 
Date.prototype.format = function (format) {
    var o = {
        M: this.getMonth() + 1,
        d: this.getDate(),
        H: this.getHours(),
        m: this.getMinutes(),
        s: this.getSeconds(),
        q: Math.floor((this.getMonth() + 3) / 3),
        S: this.getMilliseconds()
    }
    if (/(y+)/.test(format)) {
        format = format.replace(RegExp.$1, (this.getFullYear() + "").substr(4
                        - RegExp.$1.length));
    }
    for (var k in o) {
        if (new RegExp("(" + k + "+)").test(format)) {
            format = format.replace(RegExp.$1, RegExp.$1.length == 1
                            ? o[k]
                            : ("00" + o[k]).substr(("" + o[k]).length));
        }
    }
    return format;
}
//对象克隆
function Clone(obj) {
    var objClone;
    if (obj.constructor == Object) {
        objClone = new obj.constructor();
    } else {
        objClone = new obj.constructor(obj.valueOf());
    }
    for (var key in obj) {
        if (objClone[key] != obj[key]) {
            if (typeof (obj[key]) == 'object') {
                objClone[key] = clone(obj[key]);
            } else {
                objClone[key] = obj[key];
            }
        }
    }
    objClone.toString = obj.toString;
    objClone.valueOf = obj.valueOf;
    return objClone;
}
//固定表头
function FixedHeaderTable(divId, divWH, tableWH, thStyle) {
    divWH.overflow = "auto";
    $("#" + divId).css(divWH);
    tableWH.borderCollapse = "collapse";
    $("#" + divId + " table").css(tableWH);
    thStyle = thStyle == undefined ? {} : thStyle;
    thStyle.position = "relative";
    $("#" + divId + " th").css(thStyle);
    $("#" + divId).on("scroll", function () {
        var theader = this.getElementsByTagName("TH");
        for (var i = 0; i < theader.length; i++) {
            theader[i].style.top = this.scrollTop + "px";
        }
    });
    //在一些极端的情况下需要以下代码
    this.scrollTop = 0;
    $("#" + divId + " th").each(function (idx, elem) {
        elem.style.top = 0;
    });
}

// 如果线段u和v相交(包括相交在端点处)时，返回true 
function Intersect(u, v) {
    return ((Math.max(u[0].x, u[1].x) >= Math.min(v[0].x, v[1].x)) && //排斥实验 
            (Math.max(v[0].x, v[1].x) >= Math.min(u[0].x, u[1].x)) &&
            (Math.max(u[0].y, u[1].y) >= Math.min(v[0].y, v[1].y)) &&
            (Math.max(v[0].y, v[1].y) >= Math.min(u[0].y, u[1].y)) &&
            (multiply(v[0], u[1], u[0]) * multiply(u[1], v[1], u[0]) >= 0) && //跨立实验 
            (multiply(u[0], v[1], v[0]) * multiply(v[1], u[1], v[0]) >= 0));
}

//r=multiply(sp,ep,op),得到(sp-op)*(ep-op)的叉积 
//r>0:ep在矢量opsp的逆时针方向； 
//r=0：opspep三点共线； 
//r<0:ep在矢量opsp的顺时针方向 
function multiply(sp, ep, op) {
    return ((sp.x - op.x) * (ep.y - op.y) - (ep.x - op.x) * (sp.y - op.y));
}

if (!Array.prototype.findIndex) {
    Array.prototype.findIndex = function (predicate) {
        if (this === null) {
            throw new TypeError('Array.prototype.findIndex called on null or undefined');
        }
        if (typeof predicate !== 'function') {
            throw new TypeError('predicate must be a function');
        }
        var list = Object(this);
        var length = list.length >>> 0;
        var thisArg = arguments[1];
        var value;

        for (var i = 0; i < length; i++) {
            value = list[i];
            if (predicate.call(thisArg, value, i, list)) {
                return i;
            }
        }
        return -1;
    };
}


