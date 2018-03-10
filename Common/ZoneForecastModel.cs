using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Common
{
    public class ZoneForecastInfo
    {
        private string areaName;
        public string AreaName
        {
            get { return areaName; }
            set { areaName = value; }
        }

        //(系统订正)降雨
        private string rain;
        public string Rain
        {
            get { return rain; }
            set { rain = value; }
        }

        //(预报员制作)降雨
        private string rain2;
        public string Rain2
        {
            get { return rain2; }
            set { rain2 = value; }
        }

        //(系统订正)温度
        private string t2m;
        public string T2m
        {
            get { return t2m; }
            set { t2m = value; }
        }
        //(预报员制作)温度
        private string t2m2;
        public string T2m2
        {
            get { return t2m2; }
            set { t2m2 = value; }
        }

        //湿度
        private string rhsfc;
        public string Rhsfc
        {
            get { return rhsfc; }
            set { rhsfc = value; }
        }
        //风速
        private string wspd10m;
        public string Wspd10m
        {
            get { return wspd10m; }
            set { wspd10m = value; }
        }
        //风向
        private string wdir10m;
        public string Wdir10m
        {
            get { return wdir10m; }
            set { wdir10m = value; }
        }


        private string recid;
        public string Recid
        {
            get { return recid; }
            set { recid = value; }
        }
        private string ybsx;
        public string Ybsx
        {
            get { return ybsx; }
            set { ybsx = value; }
        }
        private string ddatetime;
        public string Ddatetime
        {
            get { return ddatetime; }
            set { ddatetime = value; }
        }
        private string forecasttime;
        public string Forecasttime
        {
            get { return forecasttime; }
            set { forecasttime = value; }
        }
        //最高气温
        private string maxtemperature;

        public string Maxtemperature
        {
            get { return maxtemperature; }
            set { maxtemperature = value; }
        }
        //最低气温
        private string mintemperature;

        public string Mintemperature
        {
            get { return mintemperature; }
            set { mintemperature = value; }
        }
    }

    public class WeatherForecastInfo
    {
        #region

        private string areaname;
        public string AreaName
        {
            get { return areaname; }
            set { areaname = value; }
        }

        private string forecastdate;
        public string ForecastDate
        {
            get { return forecastdate; }
            set { forecastdate = value; }
        }

        private string maxtemp;

        public string MaxTemp
        {
            get { return maxtemp; }
            set { maxtemp = value; }
        }

        //最低温度

        private string mintemp;
        public string MinTemp
        {
            get { return mintemp; }
            set { mintemp = value; }
        }
        private DateTime ddatetime;
        public DateTime DDatetime
        {
            get { return ddatetime; }
            set { ddatetime = value; }
        }

        //风向
        private string winddirectname;
        public string WindDirectName
        {
            get { return winddirectname; }
            set { winddirectname = value; }
        }
        //风力
        private string windspeed;
        public string WindSpeed
        {
            get { return windspeed; }
            set { windspeed = value; }
        }

        //湿度
        private string humidity;
        public string Humidity
        {
            get { return humidity; }
            set { humidity = value; }
        }
        //湿度
        private string maxhumidity;
        public string MaxHumidity
        {
            get { return maxhumidity; }
            set { maxhumidity = value; }
        }
        private string rain;
        public string Rain
        {
            get { return rain; }
            set { rain = value; }
        }
        private string minrain;
        public string MinRain
        {
            get { return minrain; }
            set { minrain = value; }
        }
        private string weatherpic;
        public string WeatherPic
        {
            get { return weatherpic; }
            set { weatherpic = value; }
        }
        private string weatherstatus;
        public string WeatherStatus
        {
            get { return weatherstatus; }
            set { weatherstatus = value; }
        }

        private string qpfcorrectweatherpic;
        public string QpfCorrectWeatherpic
        {
            get { return qpfcorrectweatherpic; }
            set { qpfcorrectweatherpic = value; }
        }
        private string week;
        public string Week
        {
            get { return week; }
            set { week = value; }
        }

        #endregion
    }
    public class WelfareForeInfo
    {

        private string weatherback;
        public string WeatherBack
        {
            get { return weatherback; }
            set { weatherback = value; }
        }
        private string future;
        public string Future
        {
            get { return future; }
            set { future = value; }
        }
    }
}
