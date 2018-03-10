using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Common
{
    public class GaokaoForecastModel
    {
        //高考专报模型
        public class GaokaoForecastInfo
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

            private string subhead;  //副标题

            public string Subhead
            {
                get { return subhead; }
                set { subhead = value; }
            }


            private string weather_trend;  //天气趋势

            public string Weather_trend
            {
                get { return weather_trend; }
                set { weather_trend = value; }
            }

            private string suggest;  //建议

            public string Suggest
            {
                get { return suggest; }
                set { suggest = value; }
            }


        }

        //高考专报表格模型
        public class GaokaoForecastTBInfo
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
