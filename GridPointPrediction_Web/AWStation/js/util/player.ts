//播放控件
export default class player {
    private currentStep= -1;
    private preStep: HTMLElement;
    private preIndex: number;
    private stepcount: number;
    private slidePlay: boolean;
    private timer: number;
    public playing: boolean;
    private stepElements = new Array<HTMLElement>();
    constructor(public dateTimeList: Array<Date>, public playSpeed = 500, public options: { outStart: number, container: HTMLElement, btnPrev: HTMLElement, btnNext: HTMLElement, btnPlay: HTMLElement, enableSlidePlay: boolean }) {
        this.stepcount = dateTimeList.length;
        $(options.btnPrev).on("click", () => { this.back() });
        $(options.btnPlay).on("click", () => {
            if (this.timer > 0) this.stop("onclick");
            else {
                if (this.slidePlay) this.stop("onclick");
                this.start();
            }
        });
        $(options.btnNext).on("click", () => { this.front() });
        this.setPlayStep(dateTimeList, this.options.outStart);
    }
    private getLeftOffset(e: HTMLElement) {
        var offset = e.offsetLeft;
        if (e.offsetParent != null) offset += this.getLeftOffset(e.offsetParent as HTMLElement);
        return offset;
    }
    private setSlidePlay(chked: boolean) {
        this.slidePlay = chked;
        var index_old: number;
        var playPanelLeftBound = this.getLeftOffset(this.stepElements[0]), playPanelRightBound = this.getLeftOffset(this.stepElements[this.stepElements.length - 1]);
        var playPanelLength = playPanelRightBound - playPanelLeftBound;
        document.onmousemove = (evt: MouseEvent) => {
            if (evt.x < playPanelLeftBound || evt.x > playPanelRightBound)
                return;
            var mousePercent = (evt.x - playPanelLeftBound) / playPanelLength;
            var index_new = Math.floor(this.stepcount * mousePercent);
            if (index_new < 0 || index_new > this.stepElements.length - 1 || index_old == index_new)
                return;
            this.moveStep(index_new, true);
            index_old = index_new;
        }
    }
    setPlayStep(dateTimeList: Array<Date>, outStart = -1) {      
        this.stop("reset");
        this.dateTimeList = dateTimeList;
        this.options.outStart = outStart;
        this.currentStep = -1;
        var container = this.options.container;
        while (container.lastChild)
            container.removeChild(container.lastChild);
        var createSpan = (index: number) => {
            var span = document.createElement("span");
            span.style.cursor = "pointer";
            span.style.display = "inline-block";
            span.style.width = "10px";
            span.style.height = "18px";
            span.style.backgroundColor = "#04679A";
            span.style.margin = "2px";
            span.onclick = ((index) => {
                return (evt: MouseEvent) => {
                    this.stop("onclick");
                    this.moveStep(index, false);
                    this.slidePlay = !this.slidePlay;
                    if (this.options.enableSlidePlay && this.slidePlay)
                        this.setSlidePlay(true);
                }
            })(index);
            return span;
        }
        this.stepElements.length = 0;
        this.stepcount = dateTimeList.length;
        for (var i = 0, span: HTMLElement; i < this.stepcount; i++) {
            span = createSpan(i);
            if (outStart >= 0 && i >= outStart)
                span.style.backgroundColor = "#DD6588";
            this.stepElements.push(span);
            container.appendChild(span);
        }
    }
    private moveStep(index: number, isAuto: boolean, callback?: Function) {
        let currentIsForecast = this.options.outStart >= 0 && index >= this.options.outStart;
        if (this.preStep) {
            let preIsForecast = this.options.outStart >= 0 && this.preIndex >= this.options.outStart;
            this.preStep.style.backgroundColor = preIsForecast ? "#DD6588" : "#04679A";
        }
        this.preStep = this.stepElements[index];
        this.preIndex = index;
        this.preStep.style.backgroundColor = "orange";
        this.currentStep = index;
        this.onPlay(this.dateTimeList[index], callback, { isForecast: currentIsForecast, autoPlay: isAuto, index: index});
    }
    [onEventType: string]: any;
    private events: { [x: string]: Array<{ fuc: Function, context?: any, remove?: Function }> };

    start() {
        if (this.timer > 0) return;
        this.playing = true;
        var _play = () => {
            this.timer = window.setTimeout(() => {
                if (this.timer == 0) return;
                this.currentStep++;
                if (this.currentStep >= this.stepcount)
                    this.currentStep = 0;
                this.moveStep(this.currentStep, true, _play);

            }, this.playSpeed);
        }
        _play();
    }
    stop(reason: string) {
        this.playing = false;
        window.clearTimeout(this.timer);
        this.timer = 0;
        document.onmousemove = function () { }
        this.onStop(reason);
    }
    back() {
        this.stop("back");
        if (--this.currentStep < 0) this.currentStep = this.stepcount - 1;
        this.moveStep(this.currentStep, false);
    }
    front() {
        this.stop("front");
        if (++this.currentStep >= this.stepcount) this.currentStep = 0;
        this.moveStep(this.currentStep, false);
    }
    onStop(reason: string) { }
    onPlay(ptime: Date, callback: Function, options: { isForecast: boolean, index: number, autoPlay: boolean }) { }
    setPlaySpeed(speed: number) {
        this.playSpeed = speed;
    }
    //--start 自定义事件注册器
    on(type: string, callback: Function, context: any) {
        var orginEventName = "on" + type[0].toUpperCase() + type.slice(1, type.length);
        if (!this.events) this.events = {};
        var eventsBox = this.events;
        if (!eventsBox[type]) eventsBox[type] = [];
        if (this[orginEventName] && eventsBox[type].length == 0)  //如果已有处理程序，则放在第一处理位
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
            for (var i = 0, _callback:any; i < eventsBox[type].length; i++) {
                _callback = eventsBox[type][i];
                _callback.fuc.apply(_callback.context || window, arguments);
            }
        }
        return handler;
    }
    off(type: string) {
        if (this.events[type]) {
            this.events[type].length = 0;
            delete this.events[type];
        }
    }
}
declare global {
    namespace modules{
        export interface Player extends player{}
    }
}