//播放控件 实例参数options:btnPrev,btnPlay,btnNext,startTime,tickValue,speed    ——by YI
define(function () {
    return function (options) {
        var thunderPlayEnabled = false, currentStep = 0, preStep, stepElements = [];
        var stepcount = 0, slidePlay = false;
        var _this = this, timer;
        this.playSpeed = options.speed || 500;
        dojo.connect(options.btnPrev, "onclick", this, function () {
            options.btnPrev.src = "../../Images/PageImage/images/button/left_active.png";
            options.btnNext.src = "../../Images/PageImage/images/button/right.png";
            this.back();
        });
        dojo.connect(options.btnPlay, "onclick", this, function () {
            if (thunderPlayEnabled) this.stop();
            else {
                if (slidePlay) this.stop();
                this.start();
            }
        });
        dojo.connect(options.btnNext, "onclick", this, function () {
            options.btnNext.src = "../../Images/PageImage/images/button/right_active.png";
            options.btnPrev.src = "../../Images/PageImage/images/button/left.png";
            this.front();
        });
        this.moveStep = function (index, isFront, isAuto) {
            if (preStep) {
                preStep.style.backgroundColor = "#C2E8FA";
                preStep.style.color = "#296E9B";
            }

            preStep = stepElements[index];

            preStep.style.backgroundColor = "#2C81FE";
            preStep.style.color = "#fff";
            currentStep = index;
            this.playIndex = preStep.index;
            this.dateTimeNow = new Date(preStep.datetime);
            this.onPlay(this.dateTimeNow, preStep.index, isAuto);
        }
        this.setSlidePlay = function (chked) {
            slidePlay = chked;
            var mousexp = null, zf, newStep;
            if (this.slidePlayHandler) this.slidePlayHandler.remove();
            this.slidePlayHandler = dojo.connect(document, "mousemove", function (e) {
                if (mousexp == null) mousexp = e.x;
                else {
                    zf = e.x > mousexp ? 1 : -1;
                    newStep = currentStep + zf;
                    if (Math.abs(e.x - mousexp) > 11) {
                        if (newStep >= 0 && newStep < stepcount)
                            _this.moveStep(currentStep + zf);
                            mousexp = e.x;
                    }
                }
            });
        }
        this.setScaleElements = function (dateTimeList) {
            this.stop();
            var container = options.container;
            if (typeof container == "string")
                container = document.getElementById(container);
            while (container.lastChild)
                container.removeChild(container.lastChild);
            var createSpan = function (index) {
                var span = document.createElement("span");
                var str;

                if (newestHour == "08") {
                    switch (index) {
                        case 6:
                            str = 2;
                            break;
                        case 7:
                            str = 5;
                            break;
                        case 8:
                            str = 8;
                            break;
                        case 9:
                            str = 11;
                            break;
                        case 10:
                            str = 14;
                            break;
                        case 11:
                            str = 17;
                            break;
                        case 12:
                            str = 20;
                            break;
                        case 13:
                            str = 23;
                            break;
                        case 14:
                            str = 2;
                            break;
                        case 15:
                            str = 5;
                            break;
                        default:
                            str = index * 3 + 8;
                            break;
                    }
                }else{
                    switch (index) {
                        case 0:
                            str = 20;
                            break;
                        case 1:
                            str = 23;
                            break;
                        case 2:
                        case 10:
                            str = 2;
                            break;
                        case 3:
                        case 11:
                            str = 5;
                            break;
                        case 4:
                        case 12:
                            str = 8;
                            break;
                        case 5:
                        case 13:
                            str = 11;
                            break;
                        case 6:
                        case 14:
                            str = 14;
                            break;
                        case 7:
                        case 15:
                            str = 17;
                            break;
                        case 8:
                        case 16:
                            str = 20;
                            break;
                        case 9:
                            str = 23;
                            break;
                    }
                }

                span.index = index;
                span.innerHTML = str;
                span.style.cursor = "pointer";
                span.style.display = "inline-block";
                span.style.width = "22px";
                span.style.height = "22px";
                span.style.lineHeight = "22px";
                span.style.fontSize = "12px";
                span.style.textAlign = "center";
                span.style.backgroundColor = "#C2E8FA";
                span.style.color = "#296E9B";
                span.style.margin = "1px";
                span.onclick = function () {
                    _this.stop();
                    _this.moveStep(this.index);
                    if (options.enableSlidePlay)
                        _this.setSlidePlay(true);
                }
                return span;
            }
            
            stepElements.length = 0;
            stepcount = dateTimeList.length;
            for (var i = 0, span; i < stepcount; i++) {
                span = createSpan(i, 1);
                span.datetime = dateTimeList[i];
                stepElements.push(span);
                container.appendChild(span);
            }
        }
        this.onStop = function () { }
        this.onPlay = function () { }
        this.start = function () {
            if (thunderPlayEnabled) return;
            thunderPlayEnabled = true;
            var _play = function () {
                timer = window.setTimeout(function () {
                    if (thunderPlayEnabled) {
                        currentStep++;
                        if (currentStep >= stepcount) currentStep = 0;
                        _this.moveStep(currentStep, 1, true);
                        _play();
                    }
                }, _this.playSpeed);
            }
            _play();
            return this;
        }
        this.stopAutoPlay = function () {
            window.clearTimeout(timer);
            if (this.slidePlayHandler)
                this.slidePlayHandler.remove();
            thunderPlayEnabled = false;
            this.onStop();
        }
        this.stop = function () {
            this.stopAutoPlay();
            //currentStep = 0;   //从暂停的地方开始，不需要重新开始
        }
        this.back = function () {
            this.stopAutoPlay();
            if (--currentStep < 0) currentStep = stepcount - 1;
            this.moveStep.call(_this, currentStep, 0, false);
        }
        this.front = function () {
            this.stopAutoPlay();
            if (++currentStep >= stepcount) currentStep = 0;
            this.moveStep.call(_this, currentStep, 1, false);
        }
        this.setScaleElements(options.dateTimeList);
    };
})
