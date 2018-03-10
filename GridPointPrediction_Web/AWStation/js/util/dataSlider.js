define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var default_1 = (function () {
        function default_1(items, container, options) {
            this.items = items;
            this.container = container;
            this.options = options;
            this.lastChangeLeft = true;
            this.specifiedValue = false;
            this.table = document.createElement("table");
            this.itemCounts = items.length;
            this.table.style.width = "646px";
            this.table.style.overflow = "hidden";
            this.table.style.background = "rgba(255,255,255,0.6)";
            this.table.style.boxShadow = "1px 1px 5px gray";
            this.table.style.borderCollapse = "collapse";
            this.table.onselectstart = function () { return false; };
            this.headTR = this.table.createTHead();
            this.bodyTR = this.table.appendElement("tr");
            this.minValue = options.min == null ? items[0].value : options.min;
            this.maxValue = options.max == null ? items[items.length - 1].value : options.max;
            var sliderTicks = [], tdWidthArray = [], totalWidth = 0;
            for (var i = 0, item, tdWidth; i < items.length; i++) {
                var td = this.headTR.appendElement("td", { border: "1px solid gray", padding: "0" });
                item = items[i];
                sliderTicks.push(item.value);
                td.style.textAlign = "center";
                tdWidth = item.width || options.itemWidth || 40;
                tdWidthArray.push(tdWidth);
                totalWidth += tdWidth;
                td.style.width = tdWidth.toString() + "px";
                td.style.height = "26px";
                if (item.textColor)
                    td.style.color = item.textColor;
                td.appendText(item.text);
                var div = td.appendElement("div");
                div.style.backgroundColor = item.spanColor || "#fff";
                div.style.width = "100%";
                div.style.height = "5px";
                td = this.bodyTR.appendElement("td", { "text-align": "center", border: "1px solid gray", overflow: "hidden" });
            }
            container.appendChild(this.table);
            var sliderTicksPositions = [0];
            for (var i_1 = 0, temp = 0; i_1 < tdWidthArray.length; i_1++) {
                temp += tdWidthArray[i_1];
                sliderTicksPositions.push(temp / totalWidth * 100);
            }
            sliderTicksPositions.push(100);
            sliderTicks.push(sliderTicks[sliderTicks.length - 1] + 1);
            this.initSlider(container, sliderTicks, sliderTicksPositions, options.defaultValue, options.formatter);
        }
        default_1.prototype.initSlider = function (container, sliderTicks, sliderTicksPositions, defaultValue, formatter) {
            var _this = this;
            var sliderContainer = document.createElement("div");
            container.appendChild(sliderContainer);
            sliderContainer.style.position = "absolute";
            sliderContainer.style.width = this.table.offsetWidth + "px";
            var sliderOption = {
                ticks: sliderTicks,
                ticks_positions: sliderTicksPositions,
                ticks_snap_bounds: 30,
                value: defaultValue,
                step: this.options.step || 1,
                range: this.options.range ? true : false
            };
            if (formatter)
                sliderOption.formatter = formatter;
            this.slider = new Slider(sliderContainer, sliderOption);
            this.slider.on("change", function (evt) {
                if (evt.newValue instanceof Array) {
                    _this.minValue = evt.newValue[0];
                    _this.maxValue = evt.newValue[1];
                }
                else
                    _this.minValue = evt.newValue;
                _this.onChange(_this.minValue, _this.maxValue);
            });
            var sliderElem = container.children[1];
            sliderElem.style.position = "absolute";
            sliderElem.style.marginTop = this.options.sliderPositon == "bottom" ? "-11px" : "-35px";
            var slider_track = sliderElem.firstElementChild;
            slider_track.style.background = "rgba(0,0,0,0)";
            sliderElem.children[4].style.display = "none";
            var slider_trackLow = slider_track.firstElementChild;
            var slider_selection = slider_trackLow.nextElementSibling;
            var slider_trackHigh = slider_selection.nextElementSibling;
            if (this.options.range) {
                slider_selection.style.background = this.options.slider_selection || "rgba(0,0,0,0)";
                slider_trackLow.style.background = slider_trackHigh.style.background = "rgba(255,255,255,1)";
            }
            else {
                slider_selection.style.background = "rgba(255,255,255,1)";
                slider_trackHigh.style.background = "rgba(0,0,0,0)";
            }
        };
        default_1.prototype.setItemText = function (text) {
            var length = this.bodyTR.childElementCount;
            for (var i = 0; i < length; i++)
                this.bodyTR.children[i].innerHTML = text[i].toString();
        };
        default_1.prototype.destroy = function () {
            this.slider.destroy();
            while (this.container.lastChild)
                this.container.removeChild(this.container.lastChild);
            this.table = null;
            this.slider = null;
        };
        default_1.prototype.hide = function () {
            this.table.style.display = "none";
        };
        default_1.prototype.show = function () {
            this.table.style.display = "";
        };
        default_1.prototype.updateRange = function (minValue, maxValue) {
            this.minValue = minValue;
            this.maxValue = maxValue;
            if (this.options.range)
                this.slider.setValue([minValue, maxValue]);
            else
                this.slider.setValue(minValue);
        };
        default_1.prototype.onChange = function (minValue, maxValue) {
        };
        return default_1;
    }());
    exports.default = default_1;
    var sliderItemHeader = (function () {
        function sliderItemHeader() {
        }
        return sliderItemHeader;
    }());
});
