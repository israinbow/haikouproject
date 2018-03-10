using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using DAL;
using Common;

namespace BLL
{
    public class TendayForecastBLL
    {
        tendayforecastDAL Tenday = new tendayforecastDAL();
        public WelfareForecastInfo GetTendayforecast(DateTime dt)
        {
            return Tenday.GetWelfareForecastInfo(dt);
        }
        public List<WelfareForecastInfo> GetTendayforecastinfo(string dateTime)
        {
            return Tenday.GetWelfareForecastInfolist(dateTime);
        }
        public List<WelfareForecastInfo> GetTendayforecastinfoten(string dateTime)
        {
            return Tenday.GetWelfareForecastInfolister(dateTime);
        }

        public string GetTendayforecasttime(string dateTime)
        {
            return Tenday.GetWelfareForecasttime(dateTime);
        }
        public List<UserInfo> GetTendayforecastUser()
       {
           return Tenday.GetTendayUser();
       }
        public WelfareForecastInfo GetWelfareForecastDaysInfo(string dateTime)
        {
            return Tenday.GetForecastDaysInfo(dateTime);
        }
        public bool InsertWelfareForecastDays(DateTime dt, WelfareForecastInfo info, List<WelfareForecastInfo> daysList, string forecaster)
        {
           return Tenday.InsertWelfareForecast( dt,  info, daysList,  forecaster);
        }
        

        public List<ScoreTotalInfo> GetPredictionInfotest(string dtStart, string dtEnd, string dateType)
        {
            //return null;
            return Tenday.GetPredictionInfotestDAL(dtStart, dtEnd, dateType);

        }

        public List<ScoreTotalInfo> GetScoreTotalInfotest(string dtStart, string dtEnd, string dateType)
        {
            return Tenday.GetScoreTotalInfotestDAL(dtStart, dtEnd, dateType);

        }
        public List<Score12HourStrEntity> Get12HourgrostestSScore(string dtStart, string dtEnd)
        {
            return Tenday.Get12HourgrostestSScoreDAL(dtStart, dtEnd);

        }
        public List<ScoreTotalInfo> Get6HourScoreTotaltest(string dtStart, string dtEnd)
        {
            return Tenday.Get6HourScoreTotaltestDAL(dtStart, dtEnd);
        }

        public List<ScoreTotalInfo> GetScoreRainGradetext(string dtStart, string dtEnd)
        {
            return Tenday.GetScoreRainGradetextDAL(dtStart, dtEnd);
        }
    }
}

