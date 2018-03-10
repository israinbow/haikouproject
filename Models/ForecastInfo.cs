using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Models
{
    public class ForecastInfo
    {
        public ForecastInfo()
        {
        }

        private DateTime forecasttime;
        public DateTime ForecastTime                //发布时间，精确到时
        {
            get { return forecasttime; }
            set { forecasttime = value; }
        }

        private double temp;
        public double Temp                          //类别
        {
            get { return temp; }
            set { temp = value; }
        }

        private double wind;
        public double Wind
        {
            get { return wind; }
            set { wind = value; }
        }

    }
}
