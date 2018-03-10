#region << 版 本 注 释 >>
/*----------------------------------------------------------------
// Copyright (C) 2017 雅码科技
// 版权所有。 
//
// 文件名：TrafficForecastModel
// 文件功能描述：
//
// 
// 创建者：名字 (yamatech)
// 时间：2018/1/13 11:53:57
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
    public class TrafficForecastModel
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

        private string trafficTrendForecast;//趋势预测
        public string TrafficTrendForecast
        {
            get { return trafficTrendForecast; }
            set { trafficTrendForecast = value; }
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
        //天气状况说明文字1
        private string weather1;
        public string Weather1
        {
            get { return weather1; }
            set { weather1 = value; }
        }
        //天气状况说明文字2
        private string weather2;
        public string Weather2
        {
            get { return weather2; }
            set { weather2 = value; }
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

        //最大风速
        private string maxWind;
        public string MaxWind
        {
            get { return maxWind; }
            set { maxWind = value; }
        }
        //最小风速
        private string minWind;
        public string MinWind
        {
            get { return minWind; }
            set { minWind = value; }
        }
        //风向
        private string winddirect;
        public string WindDirect
        {
            get { return winddirect; }
            set { winddirect = value; }
        }
    }
    public class trafficweather
    {
        public string date { get; set; }
        public string tianqi { get; set; }
        public string temp { get; set; }
        public string wind { get; set; }
    }
}
