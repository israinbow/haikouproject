//访问服务器端方法
var WebMethod = {
    _buiPoseJson: function (method, args, url, async, contentType, dataType) {
        args = (args == undefined || args == null) ? {} :  JSON.stringify(args);
        url = (url == undefined || url == null) ? document.location.href : url;
        async = async == undefined ? true : async;
        contentType = contentType == undefined ? "application/json; charset=utf-8" : contentType;
        dataType = dataType == undefined ? "json":dataType;
        var searchIndex = url.indexOf("?");
        if (searchIndex != -1) { url = url.substring(0, searchIndex); }
        if (method != null && method!="")
           url += "/" + method;
        return {
            type: "POST", async: async, url: url, data: args,
            contentType: contentType, dataType: dataType,
            error: function (err) { alert(err.responseText) }
        }
    },
    getData: function (method, args, url) {
        var result;
        var postJson = WebMethod._buiPoseJson(method, args, url, false);
        postJson.success = function (json) { result = json; };
        $.ajax(postJson); return result;
    },
    callBack: function (method, args, _callBack, url) {
        var postJson = WebMethod._buiPoseJson(method, args, url, true);
        postJson.success = function (json) { _callBack(json) };
        $.ajax(postJson);
    }
}
// $.cookie(’name’, ‘value’);设置cookie的值，把name变量的值设为value
// $.cookie(’name’, ‘value’, {expires: 7, path: ‘/’, domain: ‘jquery.com’, secure: true});新建一个cookie 包括有效期 路径 域名等
// $.cookie(’name’, null);删除一个cookie
//var account= $.cookie('name');取一个cookie(name)值给myvar
$.cookie = function (name, value, options) {
    if (typeof value != 'undefined') { // name and value given, set cookie
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
            expires = '; expires=' + date.toUTCString(); // use expires attribute, max-age is not supported by IE
        }
        var path = options.path ? '; path=' + options.path : '';
        var domain = options.domain ? '; domain=' + options.domain : '';
        var secure = options.secure ? '; secure' : '';
        document.cookie = [name, '=', encodeURIComponent(value), expires, path, domain, secure].join('');
    } else { // only name given, get cookie
        var cookieValue = null;
        if (document.cookie && document.cookie != '') {
            var cookies = document.cookie.split(';');
            for (var i = 0; i < cookies.length; i++) {
                var cookie = jQuery.trim(cookies[i]);
                // Does this cookie string begin with the name we want?
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
    return "china";
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
String.prototype.getDateFromJSON = function () {
    return new Date(parseFloat(/\d+/.exec(this)[0]));
}

//时间对象的格式化; 
Date.prototype.format = function (format) {
    var o = {
        "M+": this.getMonth() + 1, // month  
        "d+": this.getDate(), // day  
        "H+": this.getHours(), // hour  
        "m+": this.getMinutes(), // minute  
        "s+": this.getSeconds(), // second  
        "q+": Math.floor((this.getMonth() + 3) / 3), // quarter  
        "S": this.getMilliseconds()
        // millisecond  
    }
    if (/(y+)/.test(format)) {
        format = format.replace(RegExp.$1, (this.getFullYear() + "").substr(4
                        - RegExp.$1.length));
    }
    for (var k in o) {
        if (new RegExp("(" + k + ")").test(format)) {
            format = format.replace(RegExp.$1, RegExp.$1.length == 1
                            ? o[k]
                            : ("00" + o[k]).substr(("" + o[k]).length));
        }
    }
    return format;
}
function getJsonObjLength(jsonObj) {
    var Length = 0;
    for (var item in jsonObj) {
        Length++;
    }
    return Length;
}
