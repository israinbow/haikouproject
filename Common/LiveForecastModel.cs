using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Common
{
    public class LiveForecastModel
    {
        //风雨实况预报数据模型
        public class LiveForecastInfo
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

            private string summary;  //摘要

            public string Summary
            {
                get { return summary; }
                set { summary = value; }
            }

            private string rainval; //降雨实况

            public string Rainval
            {
                get { return rainval; }
                set { rainval = value; }
            }

            private string windval;  //风力实况

            public string Windval
            {
                get { return windval; }
                set { windval = value; }
            }

            private string threehour_reportval; //未来三小时预报

            public string Threehour_reportval
            {
                get { return threehour_reportval; }
                set { threehour_reportval = value; }
            }

            private string threeday_reportval; //未来三天预报

            public string Threeday_reportval
            {
                get { return threeday_reportval; }
                set { threeday_reportval = value; }
            }

            private string windpic; //风力实况图

            public string Windpic
            {
                get { return windpic; }
                set { windpic = value; }
            }

            private string windpicdes; //风力实况图描述

            public string Windpicdes
            {
                get { return windpicdes; }
                set { windpicdes = value; }
            }

            private string raindpic; //降雨实况图

            public string Raindpic
            {
                get { return raindpic; }
                set { raindpic = value; }
            }

            private string rainpicdes; //降雨实况图描述

            public string Rainpicdes
            {
                get { return rainpicdes; }
                set { rainpicdes = value; }
            }
        }

        //风雨实况预报表格数据模型
        public class LiveForecastTBInfo
        {
            private string ddatetime;//时间

            public string Ddatetime
            {
                get { return ddatetime; }
                set { ddatetime = value; }
            }

            private string reporttime;//预报时间

            public string Reporttime
            {
                get { return reporttime; }
                set { reporttime = value; }
            }

            private string name; //命名

            public string Name
            {
                get { return name; }
                set { name = value; }
            }

            private string middleposition; //中心位置

            public string Middleposition
            {
                get { return middleposition; }
                set { middleposition = value; }
            }

            private string strength; //强度等级

            public string Strength
            {
                get { return strength; }
                set { strength = value; }
            }

            private string windspeed; //最大风力

            public string Windspeed
            {
                get { return windspeed; }
                set { windspeed = value; }
            }

            private string middlepressure; //中心气压

            public string Middlepressure
            {
                get { return middlepressure; }
                set { middlepressure = value; }
            }

            private string referposition; //参考位置

            public string Referposition
            {
                get { return referposition; }
                set { referposition = value; }
            }

            private string report; //预报结论

            public string Report
            {
                get { return report; }
                set { report = value; }
            }
        }
    }
}
