#region << 版 本 注 释 >>
/*----------------------------------------------------------------
// Copyright (C) 2017 雅码科技
// 版权所有。 
//
// 文件名：SpringForecastModel
// 文件功能描述：
//
// 
// 创建者：名字 (yamatech)
// 时间：2018/1/4 17:43:33
//
// 修改人：
// 时间：
// 修改说明：
//
// 修改人：
// 时间：
// 修改说明：
//
// 版本：V1.0.0
//----------------------------------------------------------------*/
#endregion
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Common
{
    public class SpringForecastModel
    {
        private DateTime ddatetime;//预报时间

        public DateTime Ddatetime
        {
            get { return ddatetime; }
            set { ddatetime = value; }
        }

        private int numid;//报文期数

        public int Numid
        {
            get { return numid; }
            set { numid = value; }
        }

        private string totalTrendTitle;//春运天气总趋势预测标题
        public string TotalTrendTitle
        {
            get { return totalTrendTitle; }
            set { totalTrendTitle = value; }
        }

        private string totalTrendForecast;//春运天气总趋势预测内容

        public string TotalTrendForecast
        {
            get { return totalTrendForecast; }
            set { totalTrendForecast = value; }
        }

        private string threeDayForecastTitle;//未来3天天气预报 一级标题
        public string ThreeDayForecastTitle
        {
            get { return threeDayForecastTitle; }
            set { threeDayForecastTitle = value; }
        }

        private string threeDayForecast;//未来3天天气预报 第一段 标题

        public string ThreeDayForecast
        {
            get { return threeDayForecast; }
            set { threeDayForecast = value; }
        }


        private string threeDayContent;//未来3天天气预报 第一段 内容

        public string ThreeDayContent
        {
            get { return threeDayContent; }
            set { threeDayContent = value; }
        }


        private string threeDayTrafficForecast;//未来三天交通气象预报 第二段 标题

        public string ThreeDayTrafficForecast
        {
            get { return threeDayTrafficForecast; }
            set { threeDayTrafficForecast = value; }
        }


        private string mainTrafficRoad;// 未来三天交通气象预报 1、主要交通路段 内容

        public string MainTrafficRoad
        {
            get { return mainTrafficRoad; }
            set { mainTrafficRoad = value; }
        }


        private string qiozhouStrait;// 二、未来三天交通气象预报 2、琼州海峡 内容

        public string QiozhouStrait
        {
            get { return qiozhouStrait; }
            set { qiozhouStrait = value; }
        }

        private string provinceForcastTitle;//三、未来4～7天全省天气趋势预报

        public string ProvinceForcastTitle
        {
            get { return provinceForcastTitle; }
            set { provinceForcastTitle = value; }
        }


        private string futureProvinceForcast;//三、未来4～7天全省天气趋势预报 内容

        public string FutureProvinceForcast
        {
            get { return futureProvinceForcast; }
            set { futureProvinceForcast = value; }
        }       


        private string createword;//是否生成word

        public string Createword
        {
            get { return createword; }
            set { createword = value; }
        }       

        //预报员名字
        private string forecastName;

        public string ForecastName
        {
            get { return forecastName; }
            set { forecastName = value; }
        }

        private DateTime forcastTime;//预报时间

        public DateTime ForcastTime
        {
            get { return forcastTime; }
            set { forcastTime = value; }
        }
        //报文发布时间
        private string forecastDate;
        public string ForecastDate
        {
            get { return forecastDate; }
            set { forecastDate = value; }
        }

        //天气状况图标
        private string weathericon;
        public string WeatherIcon
        {
            get { return weathericon; }
            set { weathericon = value; }
        }
        //天气状况图标2
        private string weathericon2;
        public string WeatherIcon2
        {
            get { return weathericon2; }
            set { weathericon2 = value; }
        }
        //天气状况说明文字
        private string weather;
        public string Weather
        {
            get { return weather; }
            set { weather = value; }
        }
        //最高温度
        private string maxTemp;
        public string MaxTemp
        {
            get { return maxTemp; }
            set { maxTemp = value; }
        }
        //最低温度
        private string minTemp;
        public string MinTemp
        {
            get { return minTemp; }
            set { minTemp = value; }
        }

        //陆地最大风速
        private string landMaxWind;
        public string LandMaxWind
        {
            get { return landMaxWind; }
            set { landMaxWind = value; }
        }
        //陆地最小风速
        private string landMinWind;
        public string LandMinWind
        {
            get { return landMinWind; }
            set { landMinWind = value; }
        }
        //陆地风向
        private string landwinddirect;
        public string LandWindDirect
        {
            get { return landwinddirect; }
            set { landwinddirect = value; }
        }
        //近海海面最大风速
        private string seaMaxWind;
        public string SeaMaxWind
        {
            get { return seaMaxWind; }
            set { seaMaxWind = value; }
        }
        //近海海面最小风速
        private string seaMinWind;
        public string SeaMinWind
        {
            get { return seaMinWind; }
            set { seaMinWind = value; }
        }
        //近海海面风向
        private string seawinddirect;
        public string SeaWindDirect
        {
            get { return seawinddirect; }
            set { seawinddirect = value; }
        }
        //近海海面阵风
        private string gustWind;
        public string GustWind
        {
            get { return gustWind; }
            set { gustWind = value; }
        }

        //雨量
        private string rain;
        public string Rain
        {
            get { return rain; }
            set { rain = value; }
        }
    }
    public class springweather
    {
        public string date { get; set; }
        public string tianqi { get; set; }
        public string temp { get; set; }
        public string wind { get; set; }
        public string seawind { get; set; }
        public string gustwind { get; set; }
    }
}
