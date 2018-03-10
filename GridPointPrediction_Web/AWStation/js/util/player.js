define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var player = (function () {
        function player(dateTimeList, playSpeed, options) {
            if (playSpeed === void 0) { playSpeed = 500; }
            var _this = this;
            this.dateTimeList = dateTimeList;
            this.playSpeed = playSpeed;
            this.options = options;
            this.currentStep = -1;
            this.stepElements = new Array();
            this.stepcount = dateTimeList.length;
            $(options.btnPrev).on("click", function () { _this.back(); });
            $(options.btnPlay).on("click", function () {
                if (_this.timer > 0)
                    _this.stop("onclick");
                else {
                    if (_this.slidePlay)
                        _this.stop("onclick");
                    _this.start();
                }
            });
            $(options.btnNext).on("click", function () { _this.front(); });
            this.setPlayStep(dateTimeList, this.options.outStart);
        }
        player.prototype.getLeftOffset = function (e) {
            var offset = e.offsetLeft;
            if (e.offsetParent != null)
                offset += this.getLeftOffset(e.offsetParent);
            return offset;
        };
        player.prototype.setSlidePlay = function (chked) {
            var _this = this;
            this.slidePlay = chked;
            var index_old;
            var playPanelLeftBound = this.getLeftOffset(this.stepElements[0]), playPanelRightBound = this.getLeftOffset(this.stepElements[this.stepElements.length - 1]);
            var playPanelLength = playPanelRightBound - playPanelLeftBound;
            document.onmousemove = function (evt) {
                if (evt.x < playPanelLeftBound || evt.x > playPanelRightBound)
                    return;
                var mousePercent = (evt.x - playPanelLeftBound) / playPanelLength;
                var index_new = Math.floor(_this.stepcount * mousePercent);
                if (index_new < 0 || index_new > _this.stepElements.length - 1 || index_old == index_new)
                    return;
                _this.moveStep(index_new, true);
                index_old = index_new;
            };
        };
        player.prototype.setPlayStep = function (dateTimeList, outStart) {
            var _this = this;
            if (outStart === void 0) { outStart = -1; }
            this.stop("reset");
            this.dateTimeList = dateTimeList;
            this.options.outStart = outStart;
            this.currentStep = -1;
            var container = this.options.container;
            while (container.lastChild)
                container.removeChild(container.lastChild);
            var createSpan = function (index) {
                var span = document.createElement("span");
                span.style.cursor = "pointer";
                span.style.display = "inline-block";
                span.style.width = "10px";
                span.style.height = "18px";
                span.style.backgroundColor = "#04679A";
                span.style.margin = "2px";
                span.onclick = (function (index) {
                    return function (evt) {
                        _this.stop("onclick");
                        _this.moveStep(index, false);
                        _this.slidePlay = !_this.slidePlay;
                        if (_this.options.enableSlidePlay && _this.slidePlay)
                            _this.setSlidePlay(true);
                    };
                })(index);
                return span;
            };
            this.stepElements.length = 0;
            this.stepcount = dateTimeList.length;
            for (var i = 0, span; i < this.stepcount; i++) {
                span = createSpan(i);
                if (outStart >= 0 && i >= outStart)
                    span.style.backgroundColor = "#DD6588";
                this.stepElements.push(span);
                container.appendChild(span);
            }
        };
        player.prototype.moveStep = function (index, isAuto, callback) {
            var currentIsForecast = this.options.outStart >= 0 && index >= this.options.outStart;
            if (this.preStep) {
                var preIsForecast = this.options.outStart >= 0 && this.preIndex >= this.options.outStart;
                this.preStep.style.backgroundColor = preIsForecast ? "#DD6588" : "#04679A";
            }
            this.preStep = this.stepElements[index];
            this.preIndex = index;
            this.preStep.style.backgroundColor = "orange";
            this.currentStep = index;
            this.onPlay(this.dateTimeList[index], callback, { isForecast: currentIsForecast, autoPlay: isAuto, index: index });
        };
        player.prototype.start = function () {
            var _this = this;
            if (this.timer > 0)
                return;
            this.playing = true;
            var _play = function () {
                _this.timer = window.setTimeout(function () {
                    if (_this.timer == 0)
                        return;
                    _this.currentStep++;
                    if (_this.currentStep >= _this.stepcount)
                        _this.currentStep = 0;
                    _this.moveStep(_this.currentStep, true, _play);
                }, _this.playSpeed);
            };
            _play();
        };
        player.prototype.stop = function (reason) {
            this.playing = false;
            window.clearTimeout(this.timer);
            this.timer = 0;
            document.onmousemove = function () { };
            this.onStop(reason);
        };
        player.prototype.back = function () {
            this.stop("back");
            if (--this.currentStep < 0)
                this.currentStep = this.stepcount - 1;
            this.moveStep(this.currentStep, false);
        };
        player.prototype.front = function () {
            this.stop("front");
            if (++this.currentStep >= this.stepcount)
                this.currentStep = 0;
            this.moveStep(this.currentStep, false);
        };
        player.prototype.onStop = function (reason) { };
        player.prototype.onPlay = function (ptime, callback, options) { };
        player.prototype.setPlaySpeed = function (speed) {
            this.playSpeed = speed;
        };
        player.prototype.on = function (type, callback, context) {
            var orginEventName = "on" + type[0].toUpperCase() + type.slice(1, type.length);
            if (!this.events)
                this.events = {};
            var eventsBox = this.events;
            if (!eventsBox[type])
                eventsBox[type] = [];
            if (this[orginEventName] && eventsBox[type].length == 0)
                eventsBox[type].push({ fuc: this[orginEventName] });
            var handler = {
                fuc: callback, context: context,
                remove: function () {
                    for (var i = 0; i < eventsBox[type].length; i++)
                        if (eventsBox[type][i] == handler)
                            eventsBox[type].splice(i, 1);
                }
            };
            eventsBox[type].push(handler);
            this[orginEventName] = function () {
                for (var i = 0, _callback; i < eventsBox[type].length; i++) {
                    _callback = eventsBox[type][i];
                    _callback.fuc.apply(_callback.context || window, arguments);
                }
            };
            return handler;
        };
        player.prototype.off = function (type) {
            if (this.events[type]) {
                this.events[type].length = 0;
                delete this.events[type];
            }
        };
        return player;
    }());
    exports.default = player;
});
