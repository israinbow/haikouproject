#region << 版 本 注 释 >>
/*----------------------------------------------------------------
// Copyright (C) 2017 雅码科技
// 版权所有。 
//
// 文件名：SpringForecastBLL
// 文件功能描述：
//
// 
// 创建者：名字 (yamatech)
// 时间：2018/1/5 16:15:03
//
// 修改人：
// 时间：
// 修改说明：
//
// 修改人：
// 时间：
// 修改说明：
//
// 版本：V1.0.0
//----------------------------------------------------------------*/
#endregion
using Common;
using DAL;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BLL
{
    public class SpringForecastBLL
    {
        SpringForecastDAL dfDAL = new SpringForecastDAL();
        public bool InsertSpringForcast(DateTime dt, List<SpringForecastModel> infoList, SpringForecastModel info, string forecaster)
        {
            return dfDAL.InsertSpringForecast(dt, info, infoList, forecaster);
        }
        public SpringForecastModel GetSpringForecast(DateTime dt)
        {
            return dfDAL.GetSpringForecastInfo(dt);
        }
        public List<SpringForecastModel> GetThreedayforecastinfo(string dateTime)
        {
            return dfDAL.GetSpringForecastInfolist(dateTime);
        }
        public List<SpringForecastModel> GetThreeforecastinfoten(string dateTime)
        {
            return dfDAL.GetSpringForecastInfolister(dateTime);
        }
    }
}
