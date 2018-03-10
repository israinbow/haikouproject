using Common;
using DAL;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BLL
{
    public class LiveForecastBLL
    {
        LiveForecastDAL lfDAL = new LiveForecastDAL();
        public bool InsertLiveForcast(DateTime dt, Common.LiveForecastModel.LiveForecastInfo info,Common.LiveForecastModel.LiveForecastTBInfo TBinfo, string forecaster)
        {
            return lfDAL.InsertLiveForecast(dt, info,TBinfo,forecaster);
        }

        public Common.LiveForecastModel.LiveForecastInfo GetLiveforecast(DateTime dt)
        {
            return lfDAL.GetLiveForecastInfo(dt);
        }

        public Common.LiveForecastModel.LiveForecastTBInfo GetLiveTBforecast(DateTime dt)
        {
            return lfDAL.GetLiveForecastTBInfo(dt);
        }
    }
}
