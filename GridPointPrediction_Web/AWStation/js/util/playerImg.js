define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var default_1 = (function () {
        function default_1(timeList, currentIndex) {
            this.timeList = timeList;
            this.currentIndex = currentIndex;
            this.isPlaying = false;
            this.playInterval = 0;
            this.currentStep = timeList[currentIndex];
        }
        default_1.prototype.play = function (typeId) {
            var _this = this;
            if (this.isPlaying)
                return;
            var autoPlay = function () {
                if (++_this.currentIndex > _this.timeList.length - 1)
                    _this.currentIndex = 0;
                _this.onMove(_this.currentIndex, _this.timeList[_this.currentIndex], typeId, function () {
                    _this.playInterval = setTimeout(function () {
                        if (_this.isPlaying)
                            autoPlay();
                    }, 800);
                });
            };
            autoPlay();
            this.onPlay();
            this.isPlaying = true;
        };
        default_1.prototype.stop = function () {
            this.isPlaying = false;
            clearTimeout(this.playInterval);
            this.onStop();
        };
        default_1.prototype.moveStep = function (isFront, typeId) {
            this.stop();
            if (isFront) {
                if (++this.currentIndex > this.timeList.length - 1)
                    this.currentIndex = 0;
            }
            else if (--this.currentIndex < 0)
                this.currentIndex = this.timeList.length - 1;
            this.currentStep = this.timeList[this.currentIndex];
            this.onMove(this.currentIndex, this.currentStep, typeId);
        };
        default_1.prototype.onMove = function (index, datetime, typeId, callback) { };
        default_1.prototype.onPlay = function () { };
        default_1.prototype.onStop = function () { };
        return default_1;
    }());
    exports.default = default_1;
});
