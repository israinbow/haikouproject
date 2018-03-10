using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Common
{
    public class DuanwuForecastModel
    {
        //端午专报模型
        public class DuanwuForecastInfo
        {
            private string ddatetime;//预报时间

            public string Ddatetime
            {
                get { return ddatetime; }
                set { ddatetime = value; }
            }

            private string forecaster; //预报员

            public string Forecaster
            {
                get { return forecaster; }
                set { forecaster = value; }
            }


            private string weather_trend;  //天气趋势

            public string Weather_trend
            {
                get { return weather_trend; }
                set { weather_trend = value; }
            }

            private string weather_details;  //具体预报

            public string Weather_details
            {
                get { return weather_details; }
                set { weather_details = value; }
            }

            private string pic;

            public string Pic
            {
                get { return pic; }
                set { pic = value; }
            }

            private string picDes;

            public string PicDes
            {
                get { return picDes; }
                set { picDes = value; }
            }

            private string subhead;

            public string Subhead
            {
                get { return subhead; }
                set { subhead = value; }
            }

        }

        //端午专报表格模型
        public class DuanwuForecastTBInfo
        {
            private string ddatetime;//预报时间

            public string Ddatetime
            {
                get { return ddatetime; }
                set { ddatetime = value; }
            }

            private string[] forecasttime;

            public string[] Forecasttime
            {
                get { return forecasttime; }
                set { forecasttime = value; }
            }

            private string[] weatherpic;

            public string[] Weatherpic
            {
                get { return weatherpic; }
                set { weatherpic = value; }
            }

            private string[] weatherdes;

            public string[] Weatherdes
            {
                get { return weatherdes; }
                set { weatherdes = value; }
            }

            private string[] temperature;

            public string[] Temperature
            {
                get { return temperature; }
                set { temperature = value; }
            }

            private string[] wind;

            public string[] Wind
            {
                get { return wind; }
                set { wind = value; }
            }
        }
    }
}
