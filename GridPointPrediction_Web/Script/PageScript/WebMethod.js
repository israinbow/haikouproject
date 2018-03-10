var WebMethod = {
    DefaultPage: "",
    _buiPoseJson: function (method, args, url, contentType, dataType) {
        args = args == null ? {} : JSON.stringify(args);
        contentType = contentType == undefined ? "application/json; charset=utf-8" : contentType;
        dataType = dataType == undefined ? "json" : dataType;
        url = url == null ? document.location.href : url;
        var searchIndex = url.indexOf("?");
        if (searchIndex != -1) { url = url.substring(0, searchIndex); }
        if (url.lastIndexOf("/") == url.length - 1) url += WebMethod.DefaultPage;
        url += "/" + method;
        return { type: "post", url: url, data: args, contentType: contentType, dataType: dataType, error: WebMethod.alertError }
    },
    callBack: function (method, args, handle) {
        var postJson = WebMethod._buiPoseJson(method, args, handle.url);
        if (handle instanceof Function) postJson.success = function (json) { handle(typeof json.d == "undefined" ? json : json.d); };
        else {
            if (handle.success != undefined) {
                if (handle.context == undefined) postJson.success = function (json) { handle.success(typeof json.d == "undefined" ? json : json.d); };
                else postJson.success = function (json) { handle.success.call(handle.context, typeof json.d == "undefined" ? json : json.d); };
            }
            if (handle.error != undefined && handle.context == undefined)
                postJson.error = handle.error;
            postJson.async = handle.async != false;
        } $.ajax(postJson);
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
    }
};




