using DAL;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BLL
{
    public class GovtForecastBLL
    {
        GovtForecastDAL gfDAL = new GovtForecastDAL();
        public bool InsertGovtForcast(DateTime dt, Common.GovtForecastModel.GovtForecastInfo info, Common.GovtForecastModel.GovtForecastTBInfo TBinfo, string forecaster)
        {
            return gfDAL.InsertGovtForecast(dt, info, TBinfo, forecaster);
        }

        public Common.GovtForecastModel.GovtForecastInfo GetGovtforecast(DateTime dt)
        {
            return gfDAL.GetGovtForecastInfo(dt);
        }

        public Common.GovtForecastModel.GovtForecastTBInfo GetGovtTBforecast(DateTime dt)
        {
            return gfDAL.GetGovtForecastTBInfo(dt);
        }
    }
}
