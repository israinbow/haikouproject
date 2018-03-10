//Bootstrap日期拾取器
define("module/datePicker", function () {
    return function (input) {
        var jqInput = $(typeof input == "string" ? ('#' + input) : input), _this = this;
        !function (a) { a.fn.datepicker.dates["zh-CN"] = { days: ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"], daysShort: ["周日", "周一", "周二", "周三", "周四", "周五", "周六"], daysMin: ["日", "一", "二", "三", "四", "五", "六"], months: ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"], monthsShort: ["1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月"], today: "今日", clear: "清除", format: "yyyy年mm月dd日", titleFormat: "yyyy年mm月", weekStart: 1 } }(jQuery);
        jqInput.datepicker({ format: "yyyy/mm/dd", language: "zh-CN", autoclose: true, todayHighlight: true }).on("changeDate", function (evt) {
            _this.onSelect(evt);
        });
        this.setDate = function (date) {
            jqInput.datepicker("setDate", date);
            return this;
        }
        this.getDate = function () {
            return jqInput.datepicker("getDate");
        }
        this.onSelect = function () { };
    }
});
//时间拾取器
define("module/datetimePicker", ["./datePicker"], function (datePicker) {
    return dojo.declare("dateTimePanel", [], {
        constructor: function (container, miniteScale, options) {
            options = options || {};
            var time_input = document.createElement("input");
            time_input.type = "text";
            time_input.readonly = true;
            time_input.style.width = "85px";
            container.style.position = "relative";
            container.style.zIndex = 510;
            var hours_select = document.createElement("select");
            hours_select.style.margin = "0 3px";
            var minutes_select = document.createElement("select");
            time_input.style.height =
                hours_select.style.height =
                minutes_select.style.height = "23px";
            hours_select.style.width =
                minutes_select.style.width = "43px";

            container.appendChild(time_input);
            container.appendChild(hours_select);
            container.appendChild(minutes_select);

            var bootstrapDatepicker = new datePicker(time_input), _this = this;
            if (options.autoEvent)
                bootstrapDatepicker.onSelect = hours_select.onchange = minutes_select.onchange = function (evt) {
                    _this.onUpdate(_this.getValue());
                }
            hours_select.options.length = 0;
            for (var i = 0; i <= 23; i++)
                hours_select.options.add(new Option(i.toString(), i));
            minutes_select.options.length = 0;
            for (var i = 0; i < 60; i += miniteScale)
                minutes_select.options.add(new Option(i.toString(), i));
            this.setValue = function (dnow, fireEvent) {
                dnow.setSeconds(0, 0);
                hours_select.value = dnow.getHours();
                minutes_select.value = dnow.getMinutes();
                bootstrapDatepicker.setDate(dnow);
                if (fireEvent != false)
                    this.onUpdate(dnow);
                return this;
            }
            this.getValue = function () {
                var currentDate = bootstrapDatepicker.getDate();
                currentDate.setHours(hours_select.value, minutes_select.value, 0, 0);
                return currentDate;
            }
            this.onUpdate = function () { }
        }
    });
});
//输出以上模块
define(["exports", "module/datePicker", "module/datetimePicker"], function (exports, datePicker, datetimePicker) {
    exports.datePicker = datePicker;
    exports.datetimePicker = datetimePicker;
});
