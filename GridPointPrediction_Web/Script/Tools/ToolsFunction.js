$(function () {
    Date.prototype.format = function (format) {
        var o = {
            "M+": this.getMonth() + 1,                      // month  
            "d+": this.getDate(),                           // day  
            "H+": this.getHours(),                          // hour  
            "m+": this.getMinutes(),                        // minute  
            "s+": this.getSeconds(),                        // second  
            "q+": Math.floor((this.getMonth() + 3) / 3),    // quarter  
            "S": this.getMilliseconds()
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
    };
    String.prototype.toDateArr = function () {
        var msg = this.split(" ");
        var y = msg[0].split("-")[0];
        var M = parseInt(msg[0].split("-")[1]) >= 10 ? msg[0].split("-")[1] : ("0" + parseInt(msg[0].split("-")[1]));
        var d = parseInt(msg[0].split("-")[2]) >= 10 ? msg[0].split("-")[2] : ("0" + parseInt(msg[0].split("-")[2]));
        var h = parseInt(msg[1].split(":")[0]) >= 10 ? msg[1].split(":")[0] : ("0" + parseInt(msg[1].split(":")[0]));
        var mi = parseInt(msg[1].split(":")[1]) >= 10 ? msg[1].split(":")[1] : ("0" + parseInt(msg[1].split(":")[1]));
        var s = parseInt(msg[1].split(":")[2]) >= 10 ? msg[1].split(":")[2] : ("0" + parseInt(msg[1].split(":")[2]));
        var LongTime = y + "-" + M + "-" + d + " " + h + ":" + mi + ":" + s;
        var Week = (LongTime.toDate()).GetWeek();
        var WJ = y + M + d;
        return { Year: y, Month: M, Day: d, Hour: h, Minute: mi, Second: s, LongDate: LongTime, ShortDate: y + "-" + M + "-" + d, Week: Week, WJ: WJ };
    };
    Date.prototype.GetWeek = function () {
        switch (this.getDay()) {
            case 0:
                return "星期日";
            case 1:
                return "星期一";
            case 2:
                return "星期二";
            case 3:
                return "星期三";
            case 4:
                return "星期四";
            case 5:
                return "星期五";
            case 6:
                return "星期六";
        }
    };
    $(".NextAndUp label").click(function () {
        var UIDate = GetUIDate().toDate();
        if (this.id == "btn_prev") {
            UIDate.addHours(-3);
        } else if (this.id == "btn_next") {
            UIDate.addHours(3);
        } else if (this.id == "btn_prevD") {
            UIDate.addDays(-1);
        } else if (this.id == "btn_nextD") {
            UIDate.addDays(1);
        } else if (this.id == "btn_prevS") {
            UIDate.addHours(-12);
        } else if (this.id == "btn_nextS") {
            UIDate.addHours(12);
        }
        var date = UIDate.format("yyyy-MM-dd hh:mm:ss").toDateArr();
        $("#date").val(date.ShortDate);
        $("#Dhour").val(date.Hour);
        $("#HourNumber").html(date.Hour);
    });
    //封装ajax方法   (use: FunAjax("", function(msg){ ... }))
    FunAjax = function (url, fun) {
        $.ajax({ type: "post", async: false, url: url, success: fun,
            error: function (mm) {
                var sss = mm;
            }
        });
    };
    DhourChange = function (obj) {
        $("#HourNumber").html(obj.value);
    };
    GetUIDate = function () {
        var Sdate = $("#date").val();
       
        return Sdate + " 00:00:00";
    };

});
