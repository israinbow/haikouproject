//图片产品播放控制
import playerImg from "util/playerImg";
import * as pngLayer from "data/pngLayer";

export class playerUI {
    dateTimeRander: HTMLElement;
    titleDiv: HTMLElement;
    htmlContainer: HTMLDivElement;
    productSlider: Slider;
    myPlayer: playerImg;
    timeArr: Date[];
    dateSource: pngLayer.satellite;
    constructor(id: number, specific: Date, public onProduct: (dtime: Date, url: string, callback: Function) => void, public offProduct?: Function, public context?: any) {
        this.htmlContainer = document.createElement("div");
        this.titleDiv = this.htmlContainer.appendElement("span");
        this.dateTimeRander = this.htmlContainer.appendElement("span");
        let playerContainer = this.htmlContainer.appendElement("div");
        let inputSlider = playerContainer.appendElement("input");
        inputSlider.setAttribute("value", "0");
        let backButton = playerContainer.appendElement("span");
        backButton.className = "glyphicon glyphicon-backward";
        let playButton = playerContainer.appendElement("span") as any;
        playButton.className = "glyphicon glyphicon-play";
        let frontButton = playerContainer.appendElement("span");
        frontButton.className = "glyphicon glyphicon-forward";
        require(["library/bootstrap-slider-9.1.3/bootstrap-slider.min"], (slider: any) => {
            this.productSlider = new slider(inputSlider, { tooltip: "hide" });
            if (id >= 0 && id <= 2) {
                this.titleDiv.appendText("雷达");
                this.dateSource = pngLayer.radar.instance;
            } else if (id >= 2) {
                this.titleDiv.appendText("卫星");
                this.dateSource = pngLayer.satellite.instance;
            }
            //给播放条添加点击事件
            this.productSlider.on("change", (sliderValue: any) => {
                if (this.myPlayer.isPlaying) {
                    this.myPlayer.stop();
                    playButton.className = "glyphicon glyphicon-play";
                }
                var currentValue = sliderValue.newValue;
                this.myPlayer.onMove(currentValue, this.timeArr[currentValue], id);
            });
            if (specific instanceof Date) {
                this.setLastTime(specific, id);
            } else
                this.dateSource.getLastPngList((times: Date[]) => {
                    this.setPngList(times, id);
                });
            //播放控制
            playButton.onclick = () => {
                if (this.myPlayer.isPlaying) {
                    this.myPlayer.stop();
                    playButton.className = "glyphicon glyphicon-play";
                }
                else {
                    this.myPlayer.play(id);
                    playButton.className = "glyphicon glyphicon-pause";
                };
            }
            backButton.onclick = () => {
                this.myPlayer.moveStep(false, id);
            }
            frontButton.onclick = () => {
                this.myPlayer.moveStep(true, id);
            }
        });
    }
    setPngList(times: Date[], typeID: number) {
        this.timeArr = times;
        this.myPlayer = new playerImg(times, times.length - 1);
        //播放事件
        this.myPlayer.onMove = (index, time, typeID, callback) => {
            let url = this.dateSource.getPngUrl(time, typeID);
            this.showProduct(time, url, callback);
            this.productSlider.setValue(index);
            if (callback) callback();
        }
        this.productSlider.setValue(times.length - 1);
        this.myPlayer.onMove(times.length - 1, times[times.length - 1], typeID);
    }
    setLastTime(specific: Date, typeID: number) {
        if (this.myPlayer)
            this.myPlayer.stop();
        let timeList = this.dateSource.getSpecificPngList(specific);
        this.setPngList(timeList, typeID);
        let playing = this.myPlayer.isPlaying;
        if (playing)
            this.myPlayer.play(typeID);
    }
    showProduct(time: Date, url: string, callback: Function) {
        this.dateTimeRander.innerText = time.format("yyyy-MM-dd HH:mm");
        this.onProduct.call(this.context, time, url, callback);
    }
    destroy() {
        if (this.myPlayer)
            this.myPlayer.stop();
        if (this.context)
            this.offProduct.call(this.context);
        $(this.htmlContainer).remove();
        this.htmlContainer = null;
    }
}