using Common;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using DAL;

namespace BLL
{

    public class CityForecast6HourBLL
    {
        CityForecast6HourDAL City6Hour = new CityForecast6HourDAL();
        public List<WelfareForecastInfo> GetHour12weatherhourByTime(DateTime dt, string strName)
        {
            return City6Hour.GetHour12weatherhourByTime(dt, strName);
        }


        public string Get6HourForecastName(DateTime dt)
        {
            return City6Hour.Get6HourForecastName(dt);
        }

        public List<UserInfo> GetUserInfo()
        {
            return City6Hour.GetUserInfo();
        }

        public List<OBTRealInfo> GetCityForecastInfoList(DateTime dt,DateTime dtStart)
        {
            return City6Hour.GetCityForecastInfoList(dt,dtStart)[3];           
        }
        public string ShowPreview(DateTime DDateTime, int isCorrect)
        {
            return City6Hour.ShowPreview(DDateTime, isCorrect);
        }
        //zhou
        public string ShowPreview2(List<OBTRealInfo> hourInfo,string DDateTime, int isCorrect)
        {
            return City6Hour.ShowPreview2(hourInfo,DDateTime, isCorrect);
        }

        public List<ScoreInfo> GetCityUploadInfoList(string Strdt, string Strdt2, int Max, int Min)
        {
            return City6Hour.GetCityUploadInfoList(Strdt, Strdt2, Max, Min);
        }

        public int GetCityUploadInfoListCount(string Strdt, string Strdt2)
        {
            return City6Hour.GetCityUploadInfoListCount(Strdt, Strdt2);
        }

        public string ShowMes(DateTime DDateTime)
        {
            return City6Hour.ShowMes(DDateTime);
        }
        public bool InsertCityWeatherInfoList(DateTime dt, List<OBTRealInfo> hourInfo, string strForecaster, int ISCORRECT)
        {
            return City6Hour.InsertCityWeatherInfoList(dt, hourInfo, strForecaster, ISCORRECT);
        }


        public List<OBTRealInfo> GetHour6OBTRealInfo(DateTime dt)
        {
            return City6Hour.GetHour6OBTRealInfo(dt);
        }

    }
}
