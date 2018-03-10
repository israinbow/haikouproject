using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Common;
using DAL;

namespace BLL
{
    public class ZoneForecastBLL
    {
        ZoneForecastDAL zoneDal = new ZoneForecastDAL();

        public List<List<ZoneForecastInfo>> GetAllForInfo(DateTime dt, string zone, DateTime dtStart)
        {
            return zoneDal.GetAllForInfo(dt, zone.Trim(), dtStart);
        }

        public List<WeatherForecastInfo> GetAllWearthInfo(DateTime dt)
        {
            return zoneDal.GetAllWearthInfo(dt);
        }

        public List<string> GetAllWelfareForeInfo(DateTime dt)
        {
            return zoneDal.GetAllWelfareForeInfo(dt);
        }

        public List<WeatherForecastInfo> GetWeatherHis(DateTime dt)
        {
            return zoneDal.GetWeatherHis(dt);
        }

        public bool SaveForInfoList(List<ZoneForecastInfo> InfoList, string name, DateTime dt)
        {
            return zoneDal.SaveForInfoList(InfoList, name, dt);
        }
    }
}
