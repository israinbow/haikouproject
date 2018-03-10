
Date.prototype.format = function (format) {
    var o = {
        "M+": this.getMonth() + 1, // month  
        "d+": this.getDate(), // day  
        "h+": this.getHours(), // hour  
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
Date.prototype.addHours = function (h) {
    this.setHours(this.getHours() + h);
};
Date.prototype.addMinutes = function (mi) {
    this.setMinutes(this.getMinutes() + mi);
};
Date.prototype.addDays = function (d) {

    this.setDate(this.getDate() + d);
};
Date.prototype.addWeeks = function (w) {
    this.addDays(w * 7);
};
Date.prototype.addMonths = function (m) {
    var d = this.getDate();
    this.setMonth(this.getMonth() + m);

    if (this.getDate() < d)
        this.setDate(0);
};
Date.prototype.addYears = function (y) {
    var m = this.getMonth();
    this.setFullYear(this.getFullYear() + y);

    if (m < this.getMonth()) {
        this.setDate(0);
    }
};
String.prototype.toDate = function () {
    style = 'yyyy-MM-dd hh:mm:ss';
    var compare = {
        'y+': 'y',
        'M+': 'M',
        'd+': 'd',
        'h+': 'h',
        'm+': 'm',
        's+': 's'
    };
    var result = {
        'y': '',
        'M': '',
        'd': '',
        'h': '00',
        'm': '00',
        's': '00'
    };
    var tmp = style;
    for (var k in compare) {
        if (new RegExp('(' + k + ')').test(style)) {
            result[compare[k]] = this.substring(tmp.indexOf(RegExp.$1), tmp.indexOf(RegExp.$1) + RegExp.$1.length);
        }
    }
    return new Date(result['y'], result['M'] - 1, result['d'], result['h'], result['m'], result['s']);
}
