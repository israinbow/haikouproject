//扩展方法================================================
!(function () {
    //数组扩展方法
    Array.prototype.indexOf = function (e) { for (var i = 0; i < this.length; i++) {
        if (this[i] == e)
            return i;
    } return -1; };
    //字符串扩展方法
    String.prototype.toDate = function () {
        if (this.lastIndexOf("Z") == this.length - 1)
            return new Date(this);
        var _number = /-{0,1}\d+/.exec(this);
        if (_number)
            return new Date(parseFloat(_number[0]));
    };
    //时间扩展方法
    Date.prototype.format = function (formater) {
        var o = {
            M: this.getMonth() + 1, d: this.getDate(), H: this.getHours(), m: this.getMinutes(),
            s: this.getSeconds(), q: Math.floor((this.getMonth() + 3) / 3), S: this.getMilliseconds()
        };
        if (/(y+)/.test(formater))
            formater = formater.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
        for (var k in o) {
            if (new RegExp("(" + k + "+)").test(formater)) {
                formater = formater.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));
            }
        }
        return formater;
    };
    //HTML元素扩素方法
    Element.prototype.appendText = function (text) {
        var tNode = document.createTextNode(text);
        this.appendChild(tNode);
        return tNode;
    };
    Element.prototype.appendInput = function (type, value, style) {
        var input = document.createElement("input");
        input.type = type;
        input.value = value;
        for (var t in style)
            input.style.setProperty(t, style[t]);
        this.appendChild(input);
        return input;
    };
    Element.prototype.appendButton = function (value, style) {
        return this.appendInput("button", value, style);
    };
    Element.prototype.appendElement = function (tagName, style) {
        var element = document.createElement(tagName);
        for (var t in style)
            element.style.setProperty(t, style[t]);
        this.appendChild(element);
        return element;
    };
    //取小数位
    Math.roundec = function (v, e) {
        if (v == 0)
            return 0;
        var t = 1;
        for (; e > 0; t *= 10, e--)
            ;
        return Math.round(v * t) / t;
    };
})();
var common = (function () {
    function common() {
    }
    common.prototype.webService = function (methodUrl, args, callbackOrAjaxOption) {
        
        var defaultService = "/WebService.asmx";
        var showError = function (err) {
            var errorMessage = "";
            if (typeof (err.responseJSON) != "undefined") {
                errorMessage = err.responseJSON.Message;
            }
            else {
                var temp = /\<title\>(.*)\<\/title\>/.exec(err.responseText);
                if (temp != null)
                    errorMessage = temp[1];
            }
            if (errorMessage == "" && err.responseText)
                errorMessage = err.responseText.replace(/^\s+/g, '');
            if (errorMessage != "")
                alert(errorMessage);
        };
        var _buiPoseJson = function (_methodUrl, _args, _ajaxOptions) {
            if (typeof JSON == "undefined")
                $.ajax({ url: "js/json2.js", dataType: "script", async: false });
            if (_methodUrl.indexOf(".aspx") == -1 && _methodUrl.indexOf(".asmx") == -1) {
                if (_methodUrl.indexOf("./") == 0)
                    _methodUrl = document.location + "/" + _methodUrl;
                else
                    _methodUrl = defaultService + "/" + _methodUrl;
            }
            _args = _args || {};
            if (_ajaxOptions.dataType && _ajaxOptions.dataType.toLowerCase() == "jsonp") {
                _ajaxOptions.type = "get";
                _ajaxOptions.data = _args;
            }
            else if (_ajaxOptions.type != "get" && _ajaxOptions.type != "GET") {
                _ajaxOptions.dataType = "json";
                _ajaxOptions.type = "post";
                _ajaxOptions.data = JSON.stringify(_args);
                _ajaxOptions.contentType = "application/json; charset=utf-8";
            }
            _ajaxOptions.url = _methodUrl;
        };
        var ajaxOptions;
        if (callbackOrAjaxOption instanceof Function) {
            ajaxOptions = {};
            _buiPoseJson(methodUrl, args, ajaxOptions);
            ajaxOptions.success = function (res) { callbackOrAjaxOption(typeof res.d == "undefined" ? res : res.d); };
        }
        else {
            ajaxOptions = callbackOrAjaxOption;
            _buiPoseJson(methodUrl, args, ajaxOptions);
            if (ajaxOptions.success)
                ajaxOptions.success = (function (callsuccess) {
                    return function (res) {
                        callsuccess.call(ajaxOptions.context, typeof res.d == "undefined" ? res : res.d);
                    };
                })(ajaxOptions.success);
            ajaxOptions.async = ajaxOptions.async != false;
            ajaxOptions.error = ajaxOptions.error || showError;
        }
        $.ajax(ajaxOptions);
    };
    common.prototype.getQueryString = function (str) {
        var LocString = window.document.location.href;
        var rs = new RegExp("(^|)" + str + "=([^\&]*)(\&|$)", "gi").exec(LocString);
        if (rs && rs.length > 1)
            return rs[2];
        return null;
    };
    common.prototype.checkIE = function () {
        if (navigator.appName == "Microsoft Internet Explorer") {
            var version = navigator.appVersion.split(";");
            var trim_Version = version[1].replace(/[ ]/g, "");
            if (trim_Version == "MSIE10.0")
                return 10;
            if (trim_Version == "MSIE9.0")
                return 9;
            if (trim_Version == "MSIE8.0")
                return 8;
            if (trim_Version == "MSIE7.0")
                return 7;
            if (trim_Version == "MSIE6.0")
                return 6;
        }
    };
    return common;
}());
if (typeof define != "undefined" && define.amd) {
    define(function () { return new common(); });
}
else
    window.common = new common();
