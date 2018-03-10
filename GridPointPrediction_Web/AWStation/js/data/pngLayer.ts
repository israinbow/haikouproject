//卫星云图
declare let rainEvalDate: string;
export class satellite {
    _basePath = "http://10.155.95.202:8080/data/";
    intervalMinu = 30;
    //单例模式
    protected constructor() { }
    static instance = new satellite();

    protected getBasePath(date: Date) {
        let _date = new Date(); _date.setDate(_date.getDate() - 7);
        if (date < _date)
            return this._basePath + "history/" + date.getFullYear() + "/" + date.format("yyyyMMdd") + "/";
        else return this._basePath;
    }
    //获取最新时间
    getLastDateTime(callback: (date: Date) => void) {
        $.getScript(this._basePath + "settle/time.js", function () {
            callback(new Date(rainEvalDate));
        });
    }
    //获取产品地址
    getPngUrl(time: Date, type: number): string {
        time = new Date(time);
        let path = "";
        if (type == 3) path = this._basePath + "mobile/settle/" + time.format("yyyyMMdd") + "/Transparent_HuaNan_IR1_" + time.format("yyyyMMddHHmm") + ".png";
       else if (type == 4)
            path = this._basePath + "mobile/settle/" + time.format("yyyyMMdd") + "/Transparent_HuaNan_IR3_" + time.format("yyyyMMddHHmm") + ".png";
        else if (type == 5)
            path = this._basePath + "mobile/settle/" + time.format("yyyyMMdd") + "/Transparent_HuaNan_VIS_" + time.format("yyyyMMddHHmm") + ".png";
        return path;     
    }
    //获取最近十个时间
    getLastPngList(callback: (res: Array<Date>) => void) {
        this.getLastDateTime((date: Date) => {
            let res=this.getSpecificPngList(date);
            callback(res);
        });
    }
    getSpecificPngList(date: Date) {
        let res: Array<Date> = [];
        let lastTime = date.getTime();
        for (var i = 9; i >= 0; i--)
            res.push(new Date(lastTime - i * this.intervalMinu * 60000));
        return res;
    }
}
//雷达图
declare let radarTimestamp: string;
export class radar extends satellite {
    intervalMinu = 6;
    static instance = new radar(); 
    getPngUrl(time: Date, typeID: number): string {
        time = new Date(time);
        let path = "";
        if (typeID == 0) path = this._basePath + "newCAPPI/" + time.format("yyyyMMdd") + "/CAPPI_Meta_" + time.format("yyyyMMddHHmm") + "_2500m.png";
        else if (typeID == 1)
            path = this._basePath + "newdb_files/" + time.format("yyyyMMdd") + "/META_QPFQPF" + time.format("yyyy") + "YY" + time.format("MM") + "MM" + time.format("dd") + "DD" +
                time.format("HH") + "HH" + time.format("mm") + "mm" + time.format("ss") + "ss" + "_" + time.getMilliseconds() + "_60_2500.png";
        else if (typeID == 2)
            path = this._basePath + "Thunder/" + time.format("yyyyMMdd") + "/dbzh_meta_" + time.format("yyyyMMddHHmm") + ".png";
        return path;   
    }
}
