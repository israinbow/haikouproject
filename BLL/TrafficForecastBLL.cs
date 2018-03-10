#region << 版 本 注 释 >>
/*----------------------------------------------------------------
// Copyright (C) 2017 雅码科技
// 版权所有。 
//
// 文件名：TrafficForecastBLL
// 文件功能描述：
//
// 
// 创建者：名字 (yamatech)
// 时间：2018/1/13 11:09:36
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
    public class TrafficForecastBLL
    {
        TrafficForecastDAL tfDAL = new TrafficForecastDAL();
        public TrafficForecastModel GetTrafficForecast(DateTime dt)
        {
            return tfDAL.GetTrafficForecastInfo(dt);
        }
        public bool InsertTrafficForcast(DateTime dt, List<TrafficForecastModel> infoList, TrafficForecastModel info, string forecaster)
        {
            return tfDAL.InsertTrafficForecast(dt, info, infoList, forecaster);
        }
        public List<TrafficForecastModel> GetSevenforecastinfoten(string dateTime)
        {
            return tfDAL.GetTrafficForecastInfolister(dateTime);
        }
        public List<TrafficForecastModel> GetSevendayforecastinfo(string dateTime)
        {
            return tfDAL.GetTrafficForecastInfolist(dateTime);
        }
    }
}
