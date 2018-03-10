using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Models;
using DAL;

namespace BLL
{
    public class DefaultManager
    {
        DefaultService dfservice = new DefaultService();

        public List<List<WarningInfo>> GetWarningInfo()
        {
            return dfservice.GetGDWarningInfo();
        }

        //预报，前推两小时
        public List<LWSTripsInfo> showLWS(DateTime dt)
        {
            //List<LWSTripsInfo> m_ListLWSTripsInfo = new List<LWSTripsInfo>();
            var RecentTrips = dfservice.GetRecentTrips(1, dt);
            //for (int i = 0; i < RecentTrips.Count; i++)
            //{
            //    try
            //    {

            //        subi = dtAWS.IndexOf(eventArgs.Result[i].DDateTime);
            //        if (subi < 0) continue;

            //        showLWSBtn(subi, eventArgs.Result[i]);
            //        if (eventArgs.Result[i].DDateTime == dtAWS[dtAWS.Count - 1])
            //        {
            //            m_ListLWSTripsInfo.Add(eventArgs.Result[i]);
            //        }
            //    }
            //    catch (Exception ex)
            //    {
            //    }
            //}

            return RecentTrips;
        }

        //预报，后推两小时
        public List<LWSTripsInfo> showForecastTrips(DateTime dt)
        {
            return dfservice.GetForecastTrips(dt);
        }
        //当前预警信号
        public WarningDate GetNewWarning()
        {
            string sinfo = "";
            string strWarning = dfservice.GetWarningData();
            List<WarningEntity> wenlist = dfservice.GetwarningInfo(out sinfo, strWarning);
            return new WarningDate { strinfo = sinfo, warnentList = wenlist };
        }

        public string GetLWSPreWord()
        {
            return dfservice.GetLWSPreWord();
        }

        //获取临近预报最新时间
        public DateTime GetPondsTime()
        {
            return dfservice.GetPondsTime();
        }

        //获取欧洲中心时间
        public DateTime GetEcmwfTime()
        {
            return dfservice.GetEcmwfTime();
        }

        //欧洲中心
        public List<ForecastInfo> showEcmwf(DateTime dt)
        {
            return dfservice.GetEcmwfData(dt);
        }
    }

}
