//代替数据滑动条
export default class {
    private bodyTR: HTMLElement;
    private table: HTMLTableElement;
    private headTR: HTMLElement;
    private itemCounts: number;
    private lastChangeLeft = true;
    private slider: Slider;
    minValue: number;
    maxValue: number;
    specifiedValue = false;

    constructor(public items: sliderItemHeader[], public container: HTMLDivElement, public options: { defaultValue: number, slider_selection?: string, sliderPositon?: string, itemWidth?: number, min?: number, max?: number, range?: boolean, step?: number, formatter?: (value: number | number[]) => string }) {
        this.table = document.createElement("table");
        this.itemCounts = items.length;
        this.table.style.width = "646px";
        this.table.style.overflow = "hidden";
        this.table.style.background = "rgba(255,255,255,0.6)";
        this.table.style.boxShadow = "1px 1px 5px gray";
        this.table.style.borderCollapse = "collapse";
        this.table.onselectstart = function () { return false; }
        this.headTR = this.table.createTHead();
        this.bodyTR = this.table.appendElement("tr");
        this.minValue = options.min == null ? items[0].value : options.min;
        this.maxValue = options.max == null ? items[items.length - 1].value : options.max;
        let sliderTicks: number[] = [], tdWidthArray: number[] = [], totalWidth = 0;
        for (var i = 0, item: sliderItemHeader, tdWidth: number; i < items.length; i++) {
            let td = this.headTR.appendElement("td", { border: "1px solid gray", padding: "0" });
            item = items[i];
            sliderTicks.push(item.value);
            td.style.textAlign = "center";
            tdWidth = item.width || options.itemWidth || 40;
            tdWidthArray.push(tdWidth);
            totalWidth += tdWidth;
            td.style.width = tdWidth.toString() + "px";
            td.style.height = "26px";
            if (item.textColor) td.style.color = item.textColor;
            td.appendText(item.text);
            let div = td.appendElement("div");
            div.style.backgroundColor = item.spanColor || "#fff";
            div.style.width = "100%";
            div.style.height = "5px";
            td = this.bodyTR.appendElement("td", { "text-align": "center", border: "1px solid gray", overflow: "hidden" });
        }
        container.appendChild(this.table);
        let sliderTicksPositions: number[] = [0];
        for (let i = 0, temp = 0; i < tdWidthArray.length; i++) {
            temp += tdWidthArray[i];
            sliderTicksPositions.push(temp / totalWidth * 100);
        }
        sliderTicksPositions.push(100);
        sliderTicks.push(sliderTicks[sliderTicks.length - 1] + 1);
        this.initSlider(container, sliderTicks, sliderTicksPositions, options.defaultValue, options.formatter);
    }
    private initSlider(container: HTMLElement, sliderTicks: number[], sliderTicksPositions: number[], defaultValue: number, formatter?: (value: number | number[]) => string) {
        let sliderContainer = document.createElement("div");
        container.appendChild(sliderContainer);
        sliderContainer.style.position = "absolute";
        sliderContainer.style.width = this.table.offsetWidth + "px";
        let sliderOption: SliderOptions = {
            ticks: sliderTicks,
            ticks_positions: sliderTicksPositions,
            ticks_snap_bounds: 30,
            value: defaultValue,
            step: this.options.step || 1,
            range: this.options.range ? true : false
        };
        if (formatter) sliderOption.formatter = formatter;
        this.slider = new Slider(sliderContainer, sliderOption);
        this.slider.on("change", (evt: any) => {
            if (evt.newValue instanceof Array) {
                this.minValue = evt.newValue[0];
                this.maxValue = evt.newValue[1];
            } else
                this.minValue = evt.newValue;
            this.onChange(this.minValue, this.maxValue);
        });
        let sliderElem = <HTMLElement>container.children[1];
        (<HTMLElement>sliderElem).style.position = "absolute";
        (<HTMLElement>sliderElem).style.marginTop = this.options.sliderPositon == "bottom" ? "-11px" : "-35px";
        let slider_track = <HTMLElement>sliderElem.firstElementChild;
        slider_track.style.background = "rgba(0,0,0,0)";
        (<HTMLElement>sliderElem.children[4]).style.display = "none";
        let slider_trackLow = <HTMLElement>slider_track.firstElementChild;
        let slider_selection = <HTMLElement>slider_trackLow.nextElementSibling;
        let slider_trackHigh = <HTMLElement>slider_selection.nextElementSibling;
        if (this.options.range) {
            slider_selection.style.background = this.options.slider_selection || "rgba(0,0,0,0)";
            slider_trackLow.style.background = slider_trackHigh.style.background = "rgba(255,255,255,1)";
        } else {
            slider_selection.style.background = "rgba(255,255,255,1)";
            slider_trackHigh.style.background = "rgba(0,0,0,0)";
        }
    }
    setItemText(text: (string | number)[]) {
        let length = this.bodyTR.childElementCount;
        for (let i = 0; i < length; i++)
            this.bodyTR.children[i].innerHTML = text[i].toString();
    }
    destroy() {
        this.slider.destroy();
        while (this.container.lastChild)
            this.container.removeChild(this.container.lastChild);
        this.table = null; this.slider = null;
    }
    hide() {
        this.table.style.display = "none";
    }
    show() {
        this.table.style.display = "";
    }
    updateRange(minValue: number, maxValue: number) {
        this.minValue = minValue;
        this.maxValue = maxValue;
        if (this.options.range)
            this.slider.setValue([minValue, maxValue]);
        else
            this.slider.setValue(minValue);
    }
    onChange(minValue: number, maxValue: number) {
    }
}
class sliderItemHeader {
    text: string;
    value: number;
    width?: number;
    spanColor?: string;
    textColor?: string;
}