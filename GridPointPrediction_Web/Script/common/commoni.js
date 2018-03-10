/// <reference path="../library/linq.js/linq.js" />
//扩展方法================================================
(function () {
    //数组扩展方法
    Array.prototype.contain = function (e) { for (i = 0; i < this.length && this[i] != e; i++); return !(i == this.length); }
    Array.prototype.indexOf = function (e) { for (i = 0; i < this.length; i++) { if (this[i] == e) return i; } return -1; }
    Array.prototype.remove = function (obj) { for (var i = 0; i < this.length; i++) { if (this[i] == obj) this.splice(i, 1); } }
    Array.prototype.replace = function (oldmember, newmember) {
        for (var i = 0; i < this.length; i++) 
            if (this[i] == oldmember) { this.splice(i, 1, newmember); return true; }
        return false;
    }
    //HTML元素扩素方法
    Element.prototype.appendText = function (text) {
        var tNode = document.createTextNode(text);
        this.appendChild(tNode);
        return tNode;
    }
    Element.prototype.appendInput = function (type, value, style) {
        var input = document.createElement("input");
        input.type = type;
        input.value = value;
        for (var t in style)
            input.style[t] = style[t];
        this.appendChild(input);
        return input;
    }
    Element.prototype.appendButton = function (value, style) {
        return this.appendInput("button", value, style);
    }
    Element.prototype.appendElement = function (tagName, style) {
        var element = document.createElement(tagName);
        for (var t in style)
            element.style[t] = style[t];
        this.appendChild(element);
        return element;
    }
    //字符串扩展方法
    String.prototype.pickNumber = function () { var number = /-{0,1}\d+/.exec(this); if (number != null) return parseFloat(number[0]); return null; }
    String.prototype.toDate = function () {
        if (this.lastIndexOf("Z") == this.length - 1) return new Date(this);
        var number = this.pickNumber();
        if (number != null) return new Date(number); return null;
    }
    //时间扩展方法
    Date.prototype._toString = Date.prototype.toString;
    Date.prototype.toString = function (format) {
        if (format != undefined) {
            var o = {
                M: this.getMonth() + 1, d: this.getDate(), H: this.getHours(), m: this.getMinutes(),
                s: this.getSeconds(), q: Math.floor((this.getMonth() + 3) / 3), S: this.getMilliseconds()
            }
            if (/(y+)/.test(format))
                format = format.replace(RegExp.$1, (this.getFullYear().toString()).substr(4 - RegExp.$1.length));
            for (var k in o) {
                if (new RegExp("(" + k + "+)").test(format)) {
                    format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(o[k].toString().length));
                }
            }
            return format;
        }
        else return this._toString();
    }
    Date.prototype.add = function (tyle, value) {
        var newDate = new Date(this);
        if (tyle == "m") newDate.setMonth(this.getMonth() + value);
        else if (tyle == "mi") newDate.setMinutes(this.getMinutes() + value);
        else if (tyle == "h") newDate.setHours(this.getHours() + value);
        else if (tyle == "d") newDate.setDate(this.getDate() + value);
        return newDate;
    }
    //取小数位
    Math.eRound = function (v, e) { var t = Math.pow(10, e); return Math.round(v * t) / t; }
})();
//常用功能================================================
var common = {
    //访问服务器端方法
    webService: function (methodUrl, args, handle, ajaxOptions) {
        handle = handle || {};
        var _buiPoseJson = function (_methodUrl, _args, _ajaxOptions) {
            if (typeof JSON == "undefined") $.ajax({ url: "js/json2.js", dataType: "script", async: false });
            _args = JSON.stringify(_args || {});
            if (_methodUrl.indexOf("./") == 0) _methodUrl = _methodUrl.replace(/^\./, document.location.pathname);
            else if (_methodUrl.indexOf(".aspx") == -1) _methodUrl = "/service.asmx/" + _methodUrl;
            _ajaxOptions = _ajaxOptions || {};
            _ajaxOptions.type = "POST";
            _ajaxOptions.url = _methodUrl;
            _ajaxOptions.data = _args;
            _ajaxOptions.contentType = "application/json; charset=utf-8";
            _ajaxOptions.dataType = "json";
            _ajaxOptions.error = common.alertError;
            return _ajaxOptions;
        };
        ajaxOptions = _buiPoseJson(methodUrl, args, ajaxOptions);
        if (handle instanceof Function) ajaxOptions.success = function (json) { handle(typeof json.d == "undefined" ? json : json.d); };
        else {
            if (handle.success) {
                if (handle.context == undefined) ajaxOptions.success = function (json) { handle.success(typeof json.d == "undefined" ? json : json.d); };
                else ajaxOptions.success = function (json) { handle.success.call(handle.context, typeof json.d == "undefined" ? json : json.d); };
            }
            if (handle.error)
                ajaxOptions.error = handle.error;
            ajaxOptions.async = handle.async != false;
        } $.ajax(ajaxOptions);
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
    },
    checkIE: function () {
        if (navigator.appName == "Microsoft Internet Explorer") {
            var version = navigator.appVersion.split(";");
            var trim_Version = version[1].replace(/[ ]/g, "");
            if (trim_Version == "MSIE10.0") return 9;
            if (trim_Version == "MSIE9.0") return 9;
            if (trim_Version == "MSIE8.0") return 8;
            if (trim_Version == "MSIE7.0") return 7;
            if (trim_Version == "MSIE6.0") return 6;
        }
    }
}