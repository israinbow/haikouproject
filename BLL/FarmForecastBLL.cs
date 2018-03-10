using DAL;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BLL
{
    public class FarmForecastBLL
    {
        FarmForecastDAL farmDAL =new FarmForecastDAL();
        public bool InsertFarmForcast(DateTime dt, Common.FarmForecastModel.FarmForecastInfo info, Common.FarmForecastModel.FarmForecastTBInfo TBinfo, string forecaster)
        {
            return farmDAL.InsertFarmForecast(dt, info, TBinfo, forecaster);
        }

        public Common.FarmForecastModel.FarmForecastInfo GetFarmforecast(DateTime dt)
        {
            return farmDAL.GetFarmForecastInfo(dt);
        }

        public Common.FarmForecastModel.FarmForecastTBInfo GetFarmTBforecast(DateTime dt)
        {
            return farmDAL.GetFarmForecastTBInfo(dt);
        }
    }
}
