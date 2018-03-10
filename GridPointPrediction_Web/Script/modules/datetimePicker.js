//时间面板,需引用JQUERY UI样式及JS
define("modules/datePicker", function () {
    return function (input) {
        var jqInput = $(typeof input == "string" ? ('#' + input) : input);
        var _this = this;
        jqInput.datepicker({
            dateFormat: "yy-mm-dd", showMonthAfterYear: true,
            changeMonth: true, changeYear: true, firstDay: 0,
            monthNamesShort: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'],
            dayNamesMin: ['日', '一', '二', '三', '四', '五', '六'],
            onSelect: function (e) {_this.onSelect(e);}
        });
        this.setDate = function (date) {
            jqInput.datepicker("setDate", date);
            return this;
        }
        this.getDate = function () {
            return jqInput.datepicker("getDate");
        }
        this.onSelect = function () { }
    }
});
define("modules/datetimePicker", ["./datePicker"], function (datePicker) {
    return dojo.declare("dateTimePanel", [], {
        constructor: function (container, autoUpdateEvent) {
            var time_input = document.createElement("input");
            time_input.type = "text";
            time_input.readonly = true;
            time_input.style.zIndex = 1000;
            time_input.style.width = "80px";
            time_input.style.position = "relative";
            var hours_select = document.createElement("select");
            hours_select.style.width = "40px";
            hours_select.style.margin = "0 10px";
            var minutes_select = document.createElement("select");
            time_input.style.height=
            hours_select.style.height=
            minutes_select.style.height = "23px";
            minutes_select.style.width = "50px";
            var date_up = document.createElement("img");
            date_up.id = "date_up";
            date_up.src = "../../Images/PageImage/images/iconUp.png";
            date_up.style.position = "relative";
            date_up.style.top = "-7px";
            date_up.style.left = "9px";
            var date_down = document.createElement("img");
            date_down.id = "date_down";
            date_down.src = "../../Images/PageImage/images/iconDown.png";
            date_down.style.position = "relative";
            date_down.style.top = "7px";
            var hour_up = document.createElement("img");
            hour_up.id = "hour_up";
            hour_up.src = "../../Images/PageImage/images/iconUp.png";
            hour_up.style.position = "relative";
            hour_up.style.top = "-7px";
            var hour_down = document.createElement("img");
            hour_down.id = "hour_down";
            hour_down.src = "../../Images/PageImage/images/iconDown.png";
            hour_down.style.position = "relative";
            hour_down.style.top = "7px";
            hour_down.style.left = "-9px";

            container.style.cursor = "pointer";
            container.appendChild(time_input);
            container.appendChild(date_up);
            container.appendChild(date_down);
            container.appendChild(hours_select);
            container.appendChild(hour_up);
            container.appendChild(hour_down);
            container.appendChild(minutes_select);

            var time_span = new datePicker(time_input), _this = this;
            hours_select.options.length = 0;
            hours_select.options.add(new Option("08".toString(), "08"));
            hours_select.options.add(new Option("20".toString(), "20"));

            this.setValue = function (dnow) {
                time_span.setDate(dnow);
                hours_select.value = dnow.getHours();

                this.onUpdate(dnow);
                return this;
            }
            this.getValue = function () {
                var currentDate = time_span.getDate();
                currentDate.setHours(hours_select.value, minutes_select.value);
                return currentDate;
            }
            this.onUpdate = function () { }
            if (autoUpdateEvent)
                time_span.onSelect = hours_select.onchange = minutes_select.onchange = function () {
                    _this.onUpdate(_this.getValue());
                }
        }
    });
});
