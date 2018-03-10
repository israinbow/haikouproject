using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Common
{
    /// <summary>
    /// 用户信息表
    /// </summary>
    public class UserInfo
    {
        private string userName;
        public string UserName
        {
            get { return userName; }
            set { userName = value; }
        }
        private string uPassword;
        public string UPassword
        {
            get { return uPassword; }
            set { uPassword = value; }
        }
        private string usertype;
        public string UserType
        {
            get { return usertype; }
            set { usertype = value; }
        }
        public UserInfo()
        {
        }

        #region INotifyPropertyChanged Members
        public event PropertyChangedEventHandler PropertyChanged;

        public void OnPropertyChanged(PropertyChangedEventArgs e)
        {
            if (PropertyChanged != null)
                PropertyChanged(this, e);
        }

        #endregion
    }

    /// <summary>
    /// 7天预报信息
    /// </summary>
    public class WelfareForecastInfo
    {

        //最高温度

        private string maxtemp;

        public string MaxTemp
        {
            get { return maxtemp; }
            set { maxtemp = value; }
        }

        //最低温度

        private string nextdaymintemp;
        public string NextdayMinTemp
        {
            get { return nextdaymintemp; }
            set { nextdaymintemp = value; }
        }
        //最高温度

        private string nextdaymaxtemp;
        public string NextdayMaxTemp
        {
            get { return nextdaymaxtemp; }
            set { nextdaymaxtemp = value; }
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
        private DateTime forecastdate;
        public DateTime ForecastDate
        {
            get { return forecastdate; }
            set { forecastdate = value; }
        }
        private string weathericon;
        public string WeatherIcon
        {
            get { return weathericon; }
            set { weathericon = value; }
        }
        private string cityfirelevel;
        public string CityFireLevel
        {
            get { return cityfirelevel; }
            set { cityfirelevel = value; }
        }

        private string forestfirelevel;
        public string ForestFireLevel
        {
            get { return forestfirelevel; }
            set { forestfirelevel = value; }
        }
        private string cityfire;
        public string CityFire
        {
            get { return cityfire; }
            set { cityfire = value; }
        }

        private string forestfire;
        public string ForestFire
        {
            get { return forestfire; }
            set { forestfire = value; }
        }

        private string weathericon2;
        public string WeatherIcon2
        {
            get { return weathericon2; }
            set { weathericon2 = value; }
        }

        private string word;
        public string Word
        {
            get { return word; }
            set { word = value; }
        }
        private string nextdayicon1;
        public string NextdayIcon1
        {
            get { return nextdayicon1; }
            set { nextdayicon1 = value; }
        }
        private string nextdayicon2;
        public string NextdayIcon2
        {
            get { return nextdayicon2; }
            set { nextdayicon2 = value; }
        }
        private string nextdayword;
        public string NextdayWord
        {
            get { return nextdayword; }
            set { nextdayword = value; }
        }

        //风向
        private string winddirectname;
        public string WindDirectName
        {
            get { return winddirectname; }
            set { winddirectname = value; }
        }
        //风向2
        private string winddirectname2;
        public string WindDirectName2
        {
            get { return winddirectname2; }
            set { winddirectname2 = value; }
        }
        //风力
        private string windname;
        public string WindName
        {
            get { return windname; }
            set { windname = value; }
        }
        //阵风
        private string windgust;
        public string WindGust
        {
            get { return windgust; }
            set { windgust = value; }
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

        private string sixHourRainOne;
        public string SixHourRainOne
        {
            get { return sixHourRainOne; }
            set { sixHourRainOne = value; }
        }

        private string sixHourRainTwo;
        public string SixHourRainTwo
        {
            get { return sixHourRainTwo; }
            set { sixHourRainTwo = value; }
        }

        private string sixHourRainThree;
        public string SixHourRainThree
        {
            get { return sixHourRainThree; }
            set { sixHourRainThree = value; }
        }

        private string sixHourRainFour;
        public string SixHourRainFour
        {
            get { return sixHourRainFour; }
            set { sixHourRainFour = value; }
        }

        private string minrain;
        public string MinRain
        {
            get { return minrain; }
            set { minrain = value; }
        }
        private string weather;
        public string Weather
        {
            get { return weather; }
            set { weather = value; }
        }
        private string nextdayweather;
        public string NextdayWeather
        {
            get { return nextdayweather; }
            set { nextdayweather = value; }
        }
        //展望
        private string future;
        public string Future
        {
            get { return future; }
            set { future = value; }
        }
        //回顾
        private string pasttimes;
        public string PastTimes
        {
            get { return pasttimes; }
            set { pasttimes = value; }
        }
        private string citytvicon;
        public string CityTVIcon
        {
            get { return citytvicon; }
            set { citytvicon = value; }
        }
        private string baoantvicon;
        public string BaoanTVIcon
        {
            get { return baoantvicon; }
            set { baoantvicon = value; }
        }
        private string longgangtvicon;
        public string LonggangTVIcon
        {
            get { return longgangtvicon; }
            set { longgangtvicon = value; }
        }

        private string air;
        public string Air
        {
            get { return air; }
            set { air = value; }
        }
        private string airlevel;
        public string AirLevel
        {
            get { return airlevel; }
            set { airlevel = value; }
        }
        private string rays;
        public string Rays
        {
            get { return rays; }
            set { rays = value; }
        }
        private string sunlevel;
        public string SunLevel
        {
            get { return sunlevel; }
            set { sunlevel = value; }
        }

        public string HIGHTEMPLEVEL { get; set; }
        public string HIGHTEMPCONTENT { get; set; }
        public string NOPOISONINGLEVEL { get; set; }
        public string NOPOISONINGCONTENT { get; set; }
        public string WEATHEREN { get; set; }
        public string WEATHER2EN { get; set; }
        public string QPFCORRECTWEATHERPIC { get; set; }
        public WelfareForecastInfo()
        {
        }

        #region INotifyPropertyChanged Members
        public event PropertyChangedEventHandler PropertyChanged;

        public void OnPropertyChanged(PropertyChangedEventArgs e)
        {
            if (PropertyChanged != null)
                PropertyChanged(this, e);
        }

        #endregion
    }




    public class ScoreInfo
    {
        private string scoreName;
        public string ScoreName
        {
            get { return scoreName; }
            set { scoreName = value; }
        }
        private string scorce1;
        public string Score1
        {
            get { return scorce1; }
            set { scorce1 = value; }
        }

        private string scorce2;
        public string Score2
        {
            get { return scorce2; }
            set { scorce2 = value; }
        }
        private string scorce3;
        public string Score3
        {
            get { return scorce3; }
            set { scorce3 = value; }
        }
        private string scorce4;
        public string Score4
        {
            get { return scorce4; }
            set { scorce4 = value; }
        }
        private string scorce5;
        public string Score5
        {
            get { return scorce5; }
            set { scorce5 = value; }
        }
        private string scorce6;
        public string Score6
        {
            get { return scorce6; }
            set { scorce6 = value; }
        }
        private string scorce7;
        public string Score7
        {
            get { return scorce7; }
            set { scorce7 = value; }
        }
        private string scorce8;
        public string Score8
        {
            get { return scorce8; }
            set { scorce8 = value; }
        }
        private string scorce9;
        public string Score9
        {
            get { return scorce9; }
            set { scorce9 = value; }
        }
        private string scorce10;
        public string Score10
        {
            get { return scorce10; }
            set { scorce10 = value; }
        }
        private string scorce11;
        public string Score11
        {
            get { return scorce11; }
            set { scorce11 = value; }
        }
        private string scorce12;
        public string Score12
        {
            get { return scorce12; }
            set { scorce12 = value; }
        }
        private string scorce13;
        public string Score13
        {
            get { return scorce13; }
            set { scorce13 = value; }
        }
        private string scorce14;
        public string Score14
        {
            get { return scorce14; }
            set { scorce14 = value; }
        }
        private string scorce15;
        public string Score15
        {
            get { return scorce15; }
            set { scorce15 = value; }
        }
        private string scorce16;
        public string Score16
        {
            get { return scorce16; }
            set { scorce16 = value; }
        }
        private string scorce17;
        public string Score17
        {
            get { return scorce17; }
            set { scorce17 = value; }
        }
        public DateTime Ddatetime { get; set; }



        #region INotifyPropertyChanged Members
        public event PropertyChangedEventHandler PropertyChanged;

        public void OnPropertyChanged(PropertyChangedEventArgs e)
        {
            if (PropertyChanged != null)
                PropertyChanged(this, e);
        }

        #endregion
    }





    public class OBTRealInfo
    {


        private string id;
        public string ID
        {
            get { return id; }
            set { id = value; }
        }
        private int ybxy;
        public int Ybxy
        {
            get { return ybxy; }
            set { ybxy = value; }
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

        private double mAVGtemp;
        public double MAVGTemp
        {
            get { return mAVGtemp; }
            set { mAVGtemp = value; }
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

        //风向
        private double winddirect;
        public double WindDirect
        {
            get { return winddirect; }
            set { winddirect = value; }
        }
        //风向
        private string winddirectname;
        public string WindDirectName
        {
            get { return winddirectname; }
            set { winddirectname = value; }
        }
        //风级
        private string windname;
        public string WindName
        {
            get { return windname; }
            set { windname = value; }
        }
        //阵风
        private string windgust;
        public string WindGust
        {
            get { return windgust; }
            set { windgust = value; }
        }

        //湿度
        private double humidity;
        public double Humidity
        {
            get { return humidity; }
            set { humidity = value; }
        }
        //湿度
        private double maxhumidity;
        public double MaxHumidity
        {
            get { return maxhumidity; }
            set { maxhumidity = value; }
        }

        //预报员雨
        public string QPFRain { get; set; }

        //预报员天气状况
        public string QPFWeathers { get; set; }

        //预报员天气图标
        public string QPFWeatherPic { get; set; }
        //预报员天气图标
        public string QPFTemp { get; set; }
        //自动订正温度
        public string AutoTemp { get; set; }
        //预报员天气图标

        public string QPFCORRECTWEATHERPIC { get; set; }
        //后台自动订正状态

        public string RAINPCORSTATE { get; set; }
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
        public OBTRealInfo()
        {
        }


        public List<ObtrainstatEntity> Obtrainstat { get; set; }


        #region INotifyPropertyChanged Members
        public event PropertyChangedEventHandler PropertyChanged;

        public void OnPropertyChanged(PropertyChangedEventArgs e)
        {
            if (PropertyChanged != null)
                PropertyChanged(this, e);
        }

        #endregion
    } 



    //hezonghui
    public class ObtrainstatEntity
    {

        private string id;

        public string Id
        {
            get { return id; }
            set { id = value; }
        }

        public string HourTime { get; set; }

        public double More01mm { get; set; }

        public double More3mm { get; set; }

        public double More10mm { get; set; }

        public double More20mm { get; set; }

        public double More30mm { get; set; }

        public double More40mm { get; set; }

        public double More50mm { get; set; }

        public double More100mm { get; set; }


        public DateTime ForecastDate { get; set; }
    }

    //public class ScoreInfo
    //{
    //    private string scoreName;
    //    public string ScoreName
    //    {
    //        get { return scoreName; }
    //        set { scoreName = value; }
    //    }
    //    private string scorce1;
    //    public string Score1
    //    {
    //        get { return scorce1; }
    //        set { scorce1 = value; }
    //    }

    //    private string scorce2;
    //    public string Score2
    //    {
    //        get { return scorce2; }
    //        set { scorce2 = value; }
    //    }
    //    private string scorce3;
    //    public string Score3
    //    {
    //        get { return scorce3; }
    //        set { scorce3 = value; }
    //    }
    //    private string scorce4;
    //    public string Score4
    //    {
    //        get { return scorce4; }
    //        set { scorce4 = value; }
    //    }
    //    private string scorce5;
    //    public string Score5
    //    {
    //        get { return scorce5; }
    //        set { scorce5 = value; }
    //    }
    //    private string scorce6;
    //    public string Score6
    //    {
    //        get { return scorce6; }
    //        set { scorce6 = value; }
    //    }
    //    private string scorce7;
    //    public string Score7
    //    {
    //        get { return scorce7; }
    //        set { scorce7 = value; }
    //    }
    //    private string scorce8;
    //    public string Score8
    //    {
    //        get { return scorce8; }
    //        set { scorce8 = value; }
    //    }
    //    private string scorce9;
    //    public string Score9
    //    {
    //        get { return scorce9; }
    //        set { scorce9 = value; }
    //    }
    //    private string scorce10;
    //    public string Score10
    //    {
    //        get { return scorce10; }
    //        set { scorce10 = value; }
    //    }
    //    private string scorce11;
    //    public string Score11
    //    {
    //        get { return scorce11; }
    //        set { scorce11 = value; }
    //    }
    //    private string scorce12;
    //    public string Score12
    //    {
    //        get { return scorce12; }
    //        set { scorce12 = value; }
    //    }
    //    private string scorce13;
    //    public string Score13
    //    {
    //        get { return scorce13; }
    //        set { scorce13 = value; }
    //    }
    //    private string scorce14;
    //    public string Score14
    //    {
    //        get { return scorce14; }
    //        set { scorce14 = value; }
    //    }
    //    private string scorce15;
    //    public string Score15
    //    {
    //        get { return scorce15; }
    //        set { scorce15 = value; }
    //    }
    //    private string scorce16;
    //    public string Score16
    //    {
    //        get { return scorce16; }
    //        set { scorce16 = value; }
    //    }
    //    private string scorce17;
    //    public string Score17
    //    {
    //        get { return scorce17; }
    //        set { scorce17 = value; }
    //    }
    //}
    public class ScoreTotalInfo
    {
        private string scoreName;

        public string ScoreName
        {
            get { return scoreName; }
            set { scoreName = value; }
        }
        private double scorce1;

        public double Score1
        {
            get { return scorce1; }
            set { scorce1 = value; }
        }

        private double scorce2;

        public double Score2
        {
            get { return scorce2; }
            set { scorce2 = value; }
        }
        private double scorce3;

        public double Score3
        {
            get { return scorce3; }
            set { scorce3 = value; }
        }
        private double scorce4;

        public double Score4
        {
            get { return scorce4; }
            set { scorce4 = value; }
        }
        private double scorce5;

        public double Score5
        {
            get { return scorce5; }
            set { scorce5 = value; }
        }
        private double scorce6;

        public double Score6
        {
            get { return scorce6; }
            set { scorce6 = value; }
        }
        private double scorce7;

        public double Score7
        {
            get { return scorce7; }
            set { scorce7 = value; }
        }
        public ScoreTotalInfo()
        {
        }

        #region Tmac 2015-01-28
        //深圳暴雨

        public string SzRain { get; set; }
        //北京暴雨

        public string BjRain { get; set; }
        //欧洲中心暴雨

        public string OzRain { get; set; }
        //要素评分-暴雨

        public string ScoreRain { get; set; }
        #endregion

        //时次

        public string ScoreHour { get; set; }
        //小雨准确率

        public string SmallRain { get; set; }
        //中雨准确率

        public string MediumRain { get; set; }
        //大雨准确率

        public string LargeRain { get; set; }
        //暴雨准确率

        public string StormRain { get; set; }

    }
    public class Score12HourEntity
    {
        public double SzPc { get; set; }
        public double BjPc { get; set; }
        public double GzPc { get; set; }
        public double SzBjGzPc { get; set; }
        public double SzGzPc { get; set; }
        public double GzBjPc { get; set; }

        public DateTime Dtime { get; set; }
        public double MaxT { get; set; }
        public double MinT { get; set; }
        public double SzAVGMaxT { get; set; }
        public double BjAVGMaxT { get; set; }
        public double GzAVGMaxT { get; set; }
        public double SzAVGMinT { get; set; }
        public double BjAVGMinT { get; set; }
        public double GzAVGMinT { get; set; }

        public double SzBjMaxTempPc { get; set; }
        public double SzGzMaxTempPc { get; set; }
        public double GzBjMaxTempPc { get; set; }
        public double SzBjMinTempPc { get; set; }
        public double SzGzMinTempPc { get; set; }
        public double GzBjMinTempPc { get; set; }
        public string StrDtime { get; set; }
        public string CityName { get; set; }
        public string TypeName { get; set; }


    }

    public class Score12HourStrEntity
    {

        public string SzPc { get; set; }

        public string BjPc { get; set; }

        public string GzPc { get; set; }

        public string SzBjGzPc { get; set; }

        public string SzGzPc { get; set; }

        public string GzBjPc { get; set; }

        public DateTime Dtime { get; set; }

        public double MaxT { get; set; }

        public double MinT { get; set; }

        public double SzAVGMaxT { get; set; }

        public double BjAVGMaxT { get; set; }

        public double GzAVGMaxT { get; set; }

        public double SzAVGMinT { get; set; }

        public double BjAVGMinT { get; set; }

        public double GzAVGMinT { get; set; }

        public double SzBjMaxTempPc { get; set; }
        public double SzGzMaxTempPc { get; set; }
        public double GzBjMaxTempPc { get; set; }
        public double SzBjMinTempPc { get; set; }

        public double SzGzMinTempPc { get; set; }

        public double GzBjMinTempPc { get; set; }

        public string StrDtime { get; set; }

        public string CityName { get; set; }

        public string TypeName { get; set; }

        #region Tmac 2015-01-26
        public string SzBjRain { get; set; }

        public string SzOzRain { get; set; }

        #endregion

    }

    public class weather
    {
        public string date { get; set; }
        public string tianqi { get; set; }
        public string temp { get; set; }
        public string wind { get; set; }
        public string humity { get; set; }
    }
   

}
