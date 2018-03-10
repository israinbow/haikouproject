export default class {
    isPlaying = false;
    private playInterval = 0;
    currentStep: Date;
    constructor(public timeList: Date[], public currentIndex: number) {
        this.currentStep = timeList[currentIndex];
    }
    //播放
    play() {
        if (this.isPlaying) return;
        let autoPlay = () => {
            if (++this.currentIndex > this.timeList.length - 1) this.currentIndex = 0;
            this.onMove(this.currentIndex, this.timeList[this.currentIndex], () => {
                this.playInterval = setTimeout(() => { if (this.isPlaying) autoPlay() }, 600);
            });
        }
        autoPlay();
        this.onPlay();
        this.isPlaying = true;
    }
    //停止
    stop() {
        this.isPlaying = false;
        clearTimeout(this.playInterval);
        this.onStop();
    }
    //前进后退
    moveStep(isFront: boolean) {
        this.stop();
        if (isFront) {
            if (++this.currentIndex > this.timeList.length - 1) this.currentIndex = 0;
        } else if (--this.currentIndex < 0)
            this.currentIndex = this.timeList.length - 1;
        this.currentStep = this.timeList[this.currentIndex];
        this.onMove(this.currentIndex, this.currentStep);
    }
    onMove(index: number, datetime: Date, callback?: Function) { }
    onPlay() { }
    onStop() { }
}