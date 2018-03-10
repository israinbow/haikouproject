using DAL;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BLL
{
    public class HolidayForecastBLL
    {
        HolidayForecastDAL hfDAL = new HolidayForecastDAL();
        //国庆专报部分
        public bool InsertNationalForcast(DateTime dt, Common.NationalForecastModel.NationalForecastInfo info, Common.NationalForecastModel.NationalForecastTBInfo TBinfo, string forecaster)
        {
            return hfDAL.InsertNationalForecast(dt, info, TBinfo, forecaster);
        }

        public Common.NationalForecastModel.NationalForecastInfo GetNationalforecast(DateTime dt)
        {
            return hfDAL.GetNationalForecastInfo(dt);
        }

        public Common.NationalForecastModel.NationalForecastTBInfo GetNationalTBforecast(DateTime dt)
        {
            return hfDAL.GetNationalForecastTBInfo(dt);
        }

        //春节专报
        public bool InsertSpringForcast(DateTime dt, Common.SpringFestivalModel.SpringFestivalInfo info, Common.SpringFestivalModel.SpringFestivalTBInfo TBinfo, string forecaster)
        {
            return hfDAL.InsertSpringForecast(dt, info, TBinfo, forecaster);
        }

        public Common.SpringFestivalModel.SpringFestivalInfo GetSpringforecast(DateTime dt)
        {
            return hfDAL.GetSpringForecastInfo(dt);
        }

        public Common.SpringFestivalModel.SpringFestivalTBInfo GetSpringTBforecast(DateTime dt)
        {
            return hfDAL.GetSpringForecastTBInfo(dt);
        }

        //端午专报
        public bool InsertDuanwuForcast(DateTime dt, Common.DuanwuForecastModel.DuanwuForecastInfo info, Common.DuanwuForecastModel.DuanwuForecastTBInfo TBinfo, string forecaster)
        {
            return hfDAL.InsertDuanwuForecast(dt, info, TBinfo, forecaster);
        }

        public Common.DuanwuForecastModel.DuanwuForecastInfo GetDuanwuforecast(DateTime dt)
        {
            return hfDAL.GetDuanwuForecastInfo(dt);
        }

        public Common.DuanwuForecastModel.DuanwuForecastTBInfo GetDuanwuTBforecast(DateTime dt)
        {
            return hfDAL.GetDuanwuForecastTBInfo(dt);
        }

        //高考专报
        public bool InsertGaokaoForcast(DateTime dt, Common.GaokaoForecastModel.GaokaoForecastInfo info, Common.GaokaoForecastModel.GaokaoForecastTBInfo TBinfo, string forecaster)
        {
            return hfDAL.InsertGaokaoForecast(dt, info, TBinfo, forecaster);
        }

        public Common.GaokaoForecastModel.GaokaoForecastInfo GetGaokaoforecast(DateTime dt)
        {
            return hfDAL.GetGaokaoForecastInfo(dt);
        }

        public Common.GaokaoForecastModel.GaokaoForecastTBInfo GetGaokaoTBforecast(DateTime dt)
        {
            return hfDAL.GetGaokaoForecastTBInfo(dt);
        }

        //中考专报
        public bool InsertZhongkaoForcast(DateTime dt, Common.ZhongkaoForecastModel.ZhongkaoForecastInfo info, Common.ZhongkaoForecastModel.ZhongkaoForecastTBInfo TBinfo, string forecaster)
        {
            return hfDAL.InsertZhongkaoForecast(dt, info, TBinfo, forecaster);
        }

        public Common.ZhongkaoForecastModel.ZhongkaoForecastInfo GetZhongkaoforecast(DateTime dt)
        {
            return hfDAL.GetZhongkaoForecastInfo(dt);
        }

        public Common.ZhongkaoForecastModel.ZhongkaoForecastTBInfo GetZhongkaoTBforecast(DateTime dt)
        {
            return hfDAL.GetZhongkaoForecastTBInfo(dt);
        }
    }
}
