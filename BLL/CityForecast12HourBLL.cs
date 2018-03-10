using Common;
using DAL;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BLL
{
    public class CityForecast12HourBLL
    {
        CityForecast12HourDAL CityFDAL = new CityForecast12HourDAL();
        public string Get12HourForecastName(DateTime dt)
        {
            return CityFDAL.Get12HourForecaster(dt);
        }
        public List<UserInfo> GetHour12UserInfo()
        {
            return CityFDAL.GetHour12UserInfo();
        }

        public List<WelfareForecastInfo> Get12HourForecastInfo(DateTime dt, string areaName)
        {
            return CityFDAL.Get12HourForecastInfo(dt, areaName);
        }

        public string GetDataMes(DateTime dt, string areaName)
        {
            return CityFDAL.GetDataMes(dt, areaName);
        }

        public List<ScoreInfo> GetHour12InfoList(string Strdt, string Strdt2, int Max, int Min)
        {
            return CityFDAL.GetHour12InfoList(Strdt, Strdt2, Max, Min);
        }

        public int GetHour12InfoListCount(string Strdt, string Strdt2)
        {
            return CityFDAL.GetHour12InfoListCount(Strdt, Strdt2);
        }

        /// <summary>
        /// 保存全市预报
        /// </summary>
        /// <param name="dt"></param>
        /// <param name="hourInfo"></param>
        /// <param name="dayInfo"></param>
        /// <param name="strForecaster"></param>
        /// <param name="isUser"></param>
        /// <param name="isCompany"></param>
        /// <param name="isCorrect"></param>
        /// <returns></returns>
        public bool InsertHour12WeatherInfo(DateTime dt, string strForecaster, int isUser, int isCompany, int isCorrect, List<List<WelfareForecastInfo>> hourInfo)
        {
            return CityFDAL.InsertHour12WeatherInfo(dt, strForecaster, isUser, isCompany, isCorrect, hourInfo);
        }

        /// <summary>
        /// 取全市预报数据
        /// </summary>
        /// <param name="dt">数据时间</param>
        /// <returns></returns>
        public List<List<List<WelfareForecastInfo>>> GetInfoAll(DateTime dt)
        {
            return CityFDAL.GetInfoAll(dt);
        }
        /// <summary>
        /// 上网文件浏览
        /// </summary>
        /// <param name="DDateTime"></param>
        /// <param name="isCorrect"></param>
        /// <returns></returns>
        public string ShowPreviewWeb(DateTime DDateTime, int isCorrect)
        {
            return CityFDAL.ShowPreviewWeb(DDateTime, isCorrect);
        }

        public string ShowPreviewWeb2(string dt, int isCorrect, List<List<WelfareForecastInfo>> hourInfo)
        {
            return CityFDAL.ShowPreviewWeb2(dt, isCorrect, hourInfo);
        }
    }
}
