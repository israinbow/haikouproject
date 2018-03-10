//自动站基本数据key=编号 0=latitude, 1=longitude, 2=areaid, 3=obtname,4=缩放级别,5=二级地区名
(function (version: number, filePath?: string) {
    if (window.localStorage) {
        if (window.localStorage["obtNames_version"] == version.toString()) {
            let _obtNameCache = window.localStorage["obtNames"];
            if (_obtNameCache)
                window.obtNames = JSON.parse(_obtNameCache);
        }
    }
    if (!window.obtNames) {
        $.ajax({
            url: filePath || "data/obtNames.txt", async: false, dataType: "json", success: (result: any) => {
                window.localStorage["obtNames_version"] = version.toString();
                window.localStorage["obtNames"] = JSON.stringify(result);
                window.obtNames = result;
            }
        });
    }
})(5.6);
interface OBTNames { [obtId: string]: [number, number, string, string] }