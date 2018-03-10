using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Models
{
    //自动站实况信息
    public class OBTRealInfo
    {

        private string id;
        
        public string ID
        {
            get { return id; }
            set { id = value; }
        }

        private string name;
        
        public string Name
        {
            get { return name; }
            set { name = value; }
        }
        private string streetname;
        
        public string StreetName
        {
            get { return streetname; }
            set { streetname = value; }
        }

        private string areaname;
        
        public string AreaName
        {
            get { return areaname; }
            set { areaname = value; }
        }

        private double x;
        
        public double X
        {
            get { return x; }
            set { x = value; }
        }

        private double y;
        
        public double Y
        {
            get { return y; }
            set { y = value; }
        }

        private double maxtemp;
        
        public double MaxTemp
        {
            get { return maxtemp; }
            set { maxtemp = value; }
        }
        private double mintemp;
        
        public double MinTemp
        {
            get { return mintemp; }
            set { mintemp = value; }
        }
        private double temp;
        
        public double Temp
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

        private double wind1s;
        
        public double Wind1S
        {
            get { return wind1s; }
            set { wind1s = value; }
        }

        //风向
        private double wind1sdirect;
        
        public double Wind1SDirect
        {
            get { return wind1sdirect; }
            set { wind1sdirect = value; }
        }

        private double wind10m;
        
        public double Wind10M
        {
            get { return wind10m; }
            set { wind10m = value; }
        }

        //风向
        private double wind10mdirect;
        
        public double Wind10MDirect
        {
            get { return wind10mdirect; }
            set { wind10mdirect = value; }
        }

        private double wind1smax;
        
        public double Wind1SMax
        {
            get { return wind1smax; }
            set { wind1smax = value; }
        }

        //风向
        private double wind1smaxdirect;
        
        public double Wind1SMaxDirect
        {
            get { return wind1smaxdirect; }
            set { wind1smaxdirect = value; }
        }


        private double maxwinddirect;
        
        public double MaxWindDirect
        {
            get { return maxwinddirect; }
            set { maxwinddirect = value; }
        }

        private double maxwind;
        
        public double MaxWind
        {
            get { return maxwind; }
            set { maxwind = value; }
        }

        private double visi;
        
        public double Visi
        {
            get { return visi; }
            set { visi = value; }
        }
        //private double pascal;
        //
        //public double Pascal
        //{
        //    get { return pascal; }
        //    set { pascal = value; }
        //}
        private double rain;
        
        public double Rain
        {
            get { return rain; }
            set { rain = value; }
        }
        private double rain06M;
        
        public double Rain06M
        {
            get { return rain06M; }
            set { rain06M = value; }
        }
        private double rain12m;
        
        public double Rain12M
        {
            get { return rain12m; }
            set { rain12m = value; }
        }
        private double rain30m;
        
        public double Rain30M
        {
            get { return rain30m; }
            set { rain30m = value; }
        }
        private double rain02h;
        
        public double Rain02H
        {
            get { return rain02h; }
            set { rain02h = value; }
        }
        private double rain03h;
        
        public double Rain03H
        {
            get { return rain03h; }
            set { rain03h = value; }
        }
        private double rain06h;
        
        public double Rain06H
        {
            get { return rain06h; }
            set { rain06h = value; }
        }
        private double rain12h;
        
        public double Rain12H
        {
            get { return rain12h; }
            set { rain12h = value; }
        }
        private double rain01d;
        
        public double Rain01D
        {
            get { return rain01d; }
            set { rain01d = value; }
        }

        private double rain24h;
        
        public double Rain24H
        {
            get { return rain24h; }
            set { rain24h = value; }
        }
        private double rain48h;
        
        public double Rain48H
        {
            get { return rain48h; }
            set { rain48h = value; }
        }
        private double rain72h;
        
        public double Rain72H
        {
            get { return rain72h; }
            set { rain72h = value; }
        }
        
        public double FRain01H
        {
            set;
            get;
        }
        
        public double FRain02H
        {
            set;
            get;
        }
        
        public double FRain03H
        {
            set;
            get;
        }
        //风向
        private double winddirect;
        
        public double WindDirect
        {
            get { return winddirect; }
            set { winddirect = value; }
        }
        ////湿度
        //private double humid;
        //
        //public double Humid
        //{
        //    get { return humid; }
        //    set { humid = value; }
        //}
        private int type;
        
        public int Type
        {
            get { return type; }
            set { type = value; }
        }
        private DateTime ddatetime;
        
        public DateTime DDateTime
        {
            get { return ddatetime; }
            set { ddatetime = value; }
        }
        public string DDateTimestr { get; set; }
        //private string forecasttype;
        //
        //public string ForecastType
        //{
        //    get { return forecasttype; }
        //    set { forecasttype = value; }
        //}
        //private int intervaltime;
        //
        //public int IntervalTime
        //{
        //    get { return intervaltime; }
        //    set { intervaltime = value; }
        //}

        private DateTime forecastdate;
        
        public DateTime ForecastDate
        {
            get { return forecastdate; }
            set { forecastdate = value; }
        }
        private string obttablename;
        
        public string ObtTableName
        {
            get { return obttablename; }
            set { obttablename = value; }
        }
        //private int isroad;
        //
        //public int IsRoad
        //{
        //    get { return isroad; }
        //    set { isroad = value; }
        //}
    }
}
