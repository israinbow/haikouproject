/*!
 * DataJson  Javascript Library
 * xgq - v0.0.1
 * Date: 2017-11-16 11:43
 */
var MemuList = [
    { PageName: "综合信息", PageURL: "generalDisplay.aspx" },
    { PageName: "精细化预报", PageURL: "HKGridPoint.aspx" },
    { PageName: "强天气", PageURL: "PromptPage.aspx" },
    { PageName: "回溯显示", PageURL: "OperationCatalog.aspx" },
    { PageName: "检验评分", PageURL: "forecastTest.aspx" },
    { PageName: "帮助", PageURL: "Help.aspx" }
];
var SecondMemuList = [
    { PageName: "格点预报", PageURL: "HKGridPoint.aspx" },
    { PageName: "十天预报", PageURL: "tenday_Forecast.aspx" },
    { PageName: "逐12时预报", PageURL: "CityForecast12Hour.aspx" },
    { PageName: "逐6时预报", PageURL: "CityForecast6Hour.aspx" },
    { PageName: "分区预报", PageURL: "ZoneForecast.aspx" },
    { PageName: "上下班预报", PageURL: "CommutingForecast.aspx" }
    //{ PageName: "暴雨评估", PageURL: "RainStormEstimate.aspx" },
    //{ PageName: "风场预估", PageURL: "WindForcast.aspx" },
    //{ PageName: "产品展示", PageURL: "NCAR_WeatherPicture.aspx" },
    //{ PageName: "预报制作", PageURL: "ForcastProcess.aspx" },
];
var ForcastProcessMenuList = [
    { PageName: "决策预报制作", PageURL: "DecisionForecast.aspx" },
    { PageName: "春运专报制作", PageURL: "SpringForecast.aspx" },
    { PageName: "交通专报制作", PageURL: "TrafficForecast.aspx" },
    { PageName: "农业专报制作", PageURL: "FarmForecast.aspx" },
    { PageName: "市政府专报制作", PageURL: "CityForecast.aspx" },
    { PageName: "特定节假日专报制作", PageURL: "HolidayForecast.aspx" },
    { PageName: "旬报制作", PageURL: "tenDayForecast.aspx" },
    { PageName: "月报制作", PageURL: "monthForecast.aspx" },
    { PageName: "台风快讯和风雨实况预报制作", PageURL: "typhoonWindRainReport.aspx" },
    { PageName: "日常服务产品预报制作", PageURL: "dayliyReport.aspx" }
];
var FineForcastList = [
    { PageURL: "HKGridPoint.aspx" },
    { PageURL: "tenday_Forecast.aspx" },
    { PageURL: "CityForecast12Hour.aspx" },
    { PageURL: "CityForecast6Hour.aspx" },
    { PageURL: "ZoneForecast.aspx" },
    { PageURL: "CommutingForecast.aspx" },
    { PageURL: "RainStormEstimate.aspx" },
    { PageURL: "NCAR_WeatherPicture.aspx" },
    { PageURL: "ForecasterPage.aspx" },
    { PageURL: "DecisionForecast.aspx" },
    { PageURL: "SpringForecast.aspx" },
    { PageURL: "TrafficForecast.aspx" },
    { PageURL: "FarmForecast.aspx" },
    { PageURL: "CityForecast.aspx" },
    { PageURL: "HolidayForecast.aspx" },
    { PageURL: "tenDayForecast.aspx" },
    { PageURL: "monthForecast.aspx" },
    { PageURL: "typhoonWindRainReport.aspx" },
    { PageURL: "dayliyReport.aspx" }
    //{ PageURL: "WindForcast.aspx" },
    //{ PageURL: "NCAR_WeatherPicture.aspx" },
    //{ PageURL: "WindForcast.aspx" },
    //{ PageURL: "ForcastProcess.aspx" }
];
var ncarpicturelist = [
    { productName: "twoTemp_2MTemperature" },
    { productName: "sixrain_6HTPRain" },
    { productName: "tenwind_10MiWind" },
    { productName: "humit_200hpaRH" }
    //{ productName: "temptest_TempInspection" },
    //{ productName: "windforecast_WindInspection" },
    //{ productName: "humitTest_RhInspection" },
    //{ productName: "Haps" }
];
var warningSignal_json = [
    { SignalName: "台风白色", stateMask: "1", imgNum: 1, color: "#fff", FaxCode: "A", FaxNum: "1000", priority: 1, enName: "White typhoon warning is in force", IsStorm: false },
    { SignalName: "台风蓝色", stateMask: "2", imgNum: 2, color: "#7f7fff", FaxCode: "A", FaxNum: "2000", priority: 2, enName: "Blue typhoon warning is in force", IsStorm: false },
    { SignalName: "台风黄色", stateMask: "4", imgNum: 3, color: "#ffff7f", FaxCode: "A", FaxNum: "3000", priority: 3, enName: "Yellow typhoon warning is in force", IsStorm: false },
    { SignalName: "台风橙色", stateMask: "8", imgNum: 4, color: "#ffd27f", FaxCode: "A", FaxNum: "4000", priority: 4, enName: "Orange typhoon warning is in force", IsStorm: false },
    { SignalName: "台风红色", stateMask: "16", imgNum: 5, color: "#ff7f7f", FaxCode: "A", FaxNum: "5000", priority: 5, enName: "Red typhoon warning is in force", IsStorm: false },
    { SignalName: "暴雨黄色", stateMask: "32", imgNum: 6, color: "#ffff7f", FaxCode: "B", FaxNum: "3000", priority: 3, enName: "Yellow rainstorm warning is in force", IsStorm: false },
    { SignalName: "暴雨橙色", stateMask: "64", imgNum: 7, color: "#ffd27f", FaxCode: "B", FaxNum: "4000", priority: 4, enName: "Orange rainstorm warning is in force", IsStorm: false },
    { SignalName: "暴雨红色", stateMask: "128", imgNum: 8, color: "#ff7f7f", FaxCode: "B", FaxNum: "5000", priority: 5, enName: "Red rainstorm warning is in force", IsStorm: false },
    { SignalName: "灰霾黄色", stateMask: "256", imgNum: 25, color: "#ffff7f", FaxCode: "F", FaxNum: "3000", priority: 3, enName: "", IsStorm: false },
    { SignalName: "灰霾橙色", stateMask: "512", imgNum: 30, color: "#ffd27f", FaxCode: "F", FaxNum: "4000", priority: 4, enName: "", IsStorm: false },
    { SignalName: "灰霾红色", stateMask: "1024", imgNum: 31, color: "#ff7f7f", FaxCode: "F", FaxNum: "5000", priority: 5, enName: "", IsStorm: false },
    { SignalName: "高温黄色", stateMask: "2048", imgNum: 9, color: "#ffff7f", FaxCode: "C", FaxNum: "3000", priority: 3, enName: "", IsStorm: false },
    { SignalName: "高温橙色", stateMask: "4096", imgNum: 10, color: "#ffd27f", FaxCode: "C", FaxNum: "4000", priority: 4, enName: "", IsStorm: false },
    { SignalName: "高温红色", stateMask: "8192", imgNum: 11, color: "#ff7f7f", FaxCode: "C", FaxNum: "5000", priority: 5, enName: "", IsStorm: false },
    { SignalName: "寒冷黄色", stateMask: "16384", imgNum: 12, color: "#ffff7f", FaxCode: "D", FaxNum: "3000", priority: 3, enName: "", IsStorm: false },
    { SignalName: "寒冷橙色", stateMask: "32768", imgNum: 13, color: "#ffd27f", FaxCode: "D", FaxNum: "4000", priority: 4, enName: "", IsStorm: false },
    { SignalName: "寒冷红色", stateMask: "65536", imgNum: 14, color: "#ff7f7f", FaxCode: "D", FaxNum: "5000", priority: 5 },
    { SignalName: "大风蓝色", stateMask: "524288", imgNum: 15, color: "#7f7fff", FaxCode: "R", FaxNum: "2000", priority: 2, enName: "", IsStorm: true },
    { SignalName: "大风黄色", stateMask: "1048576", imgNum: 16, color: "#ffff7f", FaxCode: "R", FaxNum: "3000", priority: 3, enName: "", IsStorm: true },
    { SignalName: "大风橙色", stateMask: "2097152", imgNum: 17, color: "#ffd27f", FaxCode: "R", FaxNum: "4000", priority: 4, enName: "", IsStorm: true },
    { SignalName: "大风红色", stateMask: "4194304", imgNum: 18, color: "#ff7f7f", FaxCode: "R", FaxNum: "5000", priority: 5, enName: "", IsStorm: true },
    { SignalName: "大雾黄色", stateMask: "8388608", imgNum: 19, color: "#ffff7f", FaxCode: "E", FaxNum: "3000", priority: 3, enName: "", IsStorm: true },
    { SignalName: "大雾橙色", stateMask: "16777216", imgNum: 20, color: "#ffd27f", FaxCode: "E", FaxNum: "4000", priority: 4, enName: "", IsStorm: false },
    { SignalName: "大雾红色", stateMask: "33554432", imgNum: 21, color: "#ff7f7f", FaxCode: "E", FaxNum: "5000", priority: 5, enName: "", IsStorm: false },
    { SignalName: "滑坡黄色", stateMask: "268435456", imgNum: 31, color: "#ffff7f", FaxCode: "H", FaxNum: "3000", priority: 3, enName: "", IsStorm: false },
    { SignalName: "滑坡橙色", stateMask: "536870912", imgNum: 32, color: "#ffd27f", FaxCode: "H", FaxNum: "4000", priority: 4, enName: "", IsStorm: false },
    { SignalName: "滑坡红色", stateMask: "1073741824", imgNum: 33, color: "#ff7f7f", FaxCode: "H", FaxNum: "5000", priority: 5, enName: "", IsStorm: false },
    { SignalName: "冰雹", stateMask: "131072", imgNum: 22, color: "#ffff7f", FaxCode: "I", FaxNum: "3000", priority: 3, enName: "", IsStorm: false },
    { SignalName: "干旱", stateMask: "262144", imgNum: 24, color: "#ffff7f", FaxCode: "Q", FaxNum: "3000", priority: 3, enName: "", IsStorm: false },
    { SignalName: "雷电橙色", stateMask: "67108864", imgNum: 23, color: "#ffff7f", FaxCode: "P", FaxNum: "3000", priority: 3, enName: "", IsStorm: true },
    { SignalName: "火险", stateMask: "134217728", imgNum: 26, color: "#ffff7f", FaxCode: "J", FaxNum: "3000", priority: 3, enName: "", IsStorm: false },
    { SignalName: "雷雨大风黄色", stateMask: "134217708", imgNum: 27, color: "#ffff7f", FaxCode: "K", FaxNum: "3000", priority: 3, enName: "", IsStorm: false }
];