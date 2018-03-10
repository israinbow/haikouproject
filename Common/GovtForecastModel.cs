using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Common
{
    public class GovtForecastModel
    {
        public class GovtForecastInfo
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

            private string early_weather;

            public string Early_weather
            {
                get { return early_weather; }
                set { early_weather = value; }
            }

            private string haikou_weather;

            public string Haikou_weather
            {
                get { return haikou_weather; }
                set { haikou_weather = value; }
            }

            private string suggestVal;

            public string SuggestVal
            {
                get { return suggestVal; }
                set { suggestVal = value; }
            }

            private string trafficpartVal;

            public string TrafficpartVal
            {
                get { return trafficpartVal; }
                set { trafficpartVal = value; }
            }

            private string farmpartVal;

            public string FarmpartVal
            {
                get { return farmpartVal; }
                set { farmpartVal = value; }
            } 
        }

        public class GovtForecastTBInfo
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
