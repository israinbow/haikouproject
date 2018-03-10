define(["require", "exports", "util/playerImg", "data/pngLayer"], function (require, exports, playerImg_1, pngLayer) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var playerUI = (function () {
        function playerUI(id, specific, onProduct, offProduct, context) {
            var _this = this;
            this.onProduct = onProduct;
            this.offProduct = offProduct;
            this.context = context;
            this.htmlContainer = document.createElement("div");
            this.titleDiv = this.htmlContainer.appendElement("span");
            this.dateTimeRander = this.htmlContainer.appendElement("span");
            var playerContainer = this.htmlContainer.appendElement("div");
            var inputSlider = playerContainer.appendElement("input");
            inputSlider.setAttribute("value", "0");
            var backButton = playerContainer.appendElement("span");
            backButton.className = "glyphicon glyphicon-backward";
            var playButton = playerContainer.appendElement("span");
            playButton.className = "glyphicon glyphicon-play";
            var frontButton = playerContainer.appendElement("span");
            frontButton.className = "glyphicon glyphicon-forward";
            require(["library/bootstrap-slider-9.1.3/bootstrap-slider.min"], function (slider) {
                _this.productSlider = new slider(inputSlider, { tooltip: "hide" });
                if (id >= 0 && id <= 2) {
                    _this.titleDiv.appendText("雷达");
                    _this.dateSource = pngLayer.radar.instance;
                }
                else if (id >= 2) {
                    _this.titleDiv.appendText("卫星");
                    _this.dateSource = pngLayer.satellite.instance;
                }
                _this.productSlider.on("change", function (sliderValue) {
                    if (_this.myPlayer.isPlaying) {
                        _this.myPlayer.stop();
                        playButton.className = "glyphicon glyphicon-play";
                    }
                    var currentValue = sliderValue.newValue;
                    _this.myPlayer.onMove(currentValue, _this.timeArr[currentValue], id);
                });
                if (specific instanceof Date) {
                    _this.setLastTime(specific, id);
                }
                else
                    _this.dateSource.getLastPngList(function (times) {
                        _this.setPngList(times, id);
                    });
                playButton.onclick = function () {
                    if (_this.myPlayer.isPlaying) {
                        _this.myPlayer.stop();
                        playButton.className = "glyphicon glyphicon-play";
                    }
                    else {
                        _this.myPlayer.play(id);
                        playButton.className = "glyphicon glyphicon-pause";
                    }
                    ;
                };
                backButton.onclick = function () {
                    _this.myPlayer.moveStep(false, id);
                };
                frontButton.onclick = function () {
                    _this.myPlayer.moveStep(true, id);
                };
            });
        }
        playerUI.prototype.setPngList = function (times, typeID) {
            var _this = this;
            this.timeArr = times;
            this.myPlayer = new playerImg_1.default(times, times.length - 1);
            this.myPlayer.onMove = function (index, time, typeID, callback) {
                var url = _this.dateSource.getPngUrl(time, typeID);
                _this.showProduct(time, url, callback);
                _this.productSlider.setValue(index);
                if (callback)
                    callback();
            };
            this.productSlider.setValue(times.length - 1);
            this.myPlayer.onMove(times.length - 1, times[times.length - 1], typeID);
        };
        playerUI.prototype.setLastTime = function (specific, typeID) {
            if (this.myPlayer)
                this.myPlayer.stop();
            var timeList = this.dateSource.getSpecificPngList(specific);
            this.setPngList(timeList, typeID);
            var playing = this.myPlayer.isPlaying;
            if (playing)
                this.myPlayer.play(typeID);
        };
        playerUI.prototype.showProduct = function (time, url, callback) {
            this.dateTimeRander.innerText = time.format("yyyy-MM-dd HH:mm");
            this.onProduct.call(this.context, time, url, callback);
        };
        playerUI.prototype.destroy = function () {
            if (this.myPlayer)
                this.myPlayer.stop();
            if (this.context)
                this.offProduct.call(this.context);
            $(this.htmlContainer).remove();
            this.htmlContainer = null;
        };
        return playerUI;
    }());
    exports.playerUI = playerUI;
});
