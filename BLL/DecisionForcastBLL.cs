#region << 版 本 注 释 >>
/*----------------------------------------------------------------
// Copyright (C) 2017 雅码科技
// 版权所有。 
//
// 文件名：DecisionForcastBLL
// 文件功能描述：
//
// 
// 创建者：名字 (yamatech)
// 时间：2017/12/12 18:04:44
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
    public class DecisionForcastBLL
    {
        DecisionForcastDAL dfDAL = new DecisionForcastDAL();
        public bool InsertDecisionForcast(DateTime dt, DecisionForecastInfo info, string forecaster)
        {
            return dfDAL.InsertDecisionForecast(dt,info, forecaster);
        }
        
        public DecisionForecastInfo GetDecisionforecast(DateTime dt)
        {
            return dfDAL.GetDecisionForecastInfo(dt);
        }
    }
}
