#region << 版 本 注 释 >>
/*----------------------------------------------------------------
// Copyright (C) 2017 雅码科技
// 版权所有。 
//
// 文件名：TrafficForecastDAL
// 文件功能描述：
//
// 
// 创建者：名字 (yamatech)
// 时间：2018/1/13 11:55:37
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
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DAL
{
    public class TrafficForecastDAL
    {
        /// <summary>
        /// 获取交通专报报文信息，如果没有则返回默认报文信息
        /// </summary>
        /// <param name="DDateTime">预报时间</param>
        /// <returns></returns>
        public TrafficForecastModel GetTrafficForecastInfo(DateTime DDateTime)
        {
            TrafficForecastModel info = GetWelfareForecastInfoNow(DDateTime);
            if (info == null)
            {
                return GetTrafficForecastFromGrid(DDateTime);
            }
            return info;
        }

        /// <summary>
        /// 获取最新发布的交通专报报文信息
        /// </summary>
        /// <param name="dt">预报时间</param>
        /// <returns></returns>
        private TrafficForecastModel GetWelfareForecastInfoNow(DateTime dt)
        {
            try
            {
                TrafficForecastModel infoList = null;
                // 原始方法
                string strSQL = "select * from LFS_TRAFFICFORECAST where  ddatetime = to_date('" + dt.ToString("yyyy-MM-dd HH:mm") + "','yyyy-mm-dd hh24:mi') ";
                OracleHelper oh = new OracleHelper("HAIKOUConnect");
                DataTable dTable = oh.ExecuteDataTable(strSQL);

                if (dTable != null && dTable.Rows.Count > 0)
                {
                    infoList = new TrafficForecastModel();
                    infoList.Ddatetime = dt;
                    infoList.Numid = Convert.ToInt32(dTable.Rows[0]["NUMID"].ToString());//报文期号
                    infoList.TrafficTrendForecast = dTable.Rows[0]["TRAFFICTRENDFORECAST"].ToString(); //趋势预测内容
                    infoList.ForecastName = dTable.Rows[0]["FORECASTER"].ToString();//预报员姓名
                    infoList.ForecastDate = dTable.Rows[0]["FORECASTDATE"].ToString(); //报文发布时间
                }
                return infoList;
            }
            catch (Exception ex)
            {
                return null;
            }
        }
        /// <summary>
        /// 制作最新交通专报报文信息
        /// </summary>
        /// <param name="dt"></param>
        /// <returns></returns>
        private TrafficForecastModel GetTrafficForecastFromGrid(DateTime dt)
        {
            TrafficForecastModel infoList = null;
            try
            {
                infoList = new TrafficForecastModel();
                string sql = "select max(NUMID) as NOID from LFS_TRAFFICFORECAST t";
                OracleHelper oh = new OracleHelper("HAIKOUConnect");
                string newNum = oh.ExecuteScalar(sql).ToString();//欧洲中心最新数据时间

                string timesql = "select max(ddatetime) as latesttime from LFS_TRAFFICFORECAST t";
                string latestTime = oh.ExecuteScalar(timesql).ToString();//欧洲中心最新数据时间
                if (latestTime != "")
                {
                    DateTime ecdt = DateTime.Parse(latestTime);

                    if (dt.Ticks > ecdt.Ticks)
                    {
                        infoList.Numid = Convert.ToInt32(newNum) + 1; //报文期号
                    }
                    else
                    {
                        infoList.Numid = Convert.ToInt32(newNum);//报文期号
                    }
                }
                else
                {
                    infoList.Numid = 1;
                }
                
                infoList.Ddatetime = dt;
                infoList.TrafficTrendForecast = "预计，本周前期XXX，后期XXX。";
                return infoList;
            }
            catch (Exception ex)
            {
                return null;
            }
        }
        public bool InsertTrafficForecast(DateTime dt, TrafficForecastModel info, List<TrafficForecastModel> daysList, string forecaster)
        {
            try
            {
                string strSQL = "";
                string strID = "";
                int result1 = 0;
                foreach (TrafficForecastModel info1 in daysList)
                {
                    strSQL = "select recid from LFS_TRAFFICFORECASTDAYS where ddatetime=to_date('" + dt.ToString("yyyy-MM-dd HH:mm") + "','yyyy-mm-dd hh24:mi') and FORECASTDATE= to_date('" + info1.Ddatetime.ToString("yyyy-MM-dd HH:mm") + "','yyyy-mm-dd hh24:mi')  ";
                    OracleHelper oh = new OracleHelper("HAIKOUConnect");
                    strID = oh.db_GreateQuery(strSQL);
                    if (strID.Length > 0)
                    {
                        strSQL = "update LFS_TRAFFICFORECASTDAYS set WEATHER1 ='" + info1.Weather1 + "'"
                             + ",WEATHERPIC1='" + info1.WeatherIcon + "'"
                             + ",MINTEMP='" + info1.MinTemp + "'"
                             + ",MAXTEMP='" + info1.MaxTemp + "'"
                             + ",MINWIND='" + info1.MinWind + "'"
                             + ",MAXWIND='" + info1.MaxWind + "'"
                             + ",WINDDIRECT='" + info1.WindDirect + "'"
                             + " ,WRITETIME=to_date('" + DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss") + "', 'yyyy-mm-dd HH24:mi:ss')"
                             + " where RECID=" + strID; ;
                    }
                    else
                    {
                        strSQL = "insert into LFS_TRAFFICFORECASTDAYS(ddatetime,WEATHER1,WEATHERPIC1,MINTEMP,MAXTEMP,MINWIND,MAXWIND,WINDDIRECT,FORECASTTIME,recid) values("
                        + " to_date('" + dt.ToString("yyyy-MM-dd HH:mm") + "','yyyy-mm-dd hh24:mi') "
                        + ",'" + info1.Weather1 + "'"
                        + ",'" + info1.WeatherIcon + "'"
                        + ",'" + info1.MinTemp + "'"
                        + ",'" + info1.MaxTemp + "'"
                        + ",'" + info1.MinWind + "'"
                        + ",'" + info1.MaxWind + "'"
                        + ",'" + info1.WindDirect + "'"
                        + ",to_date('" + info1.ForcastTime.ToString("yyyy-MM-dd HH:mm") + "','yyyy-mm-dd hh24:mi') "
                        + ",seq_LFS_TRAFFICFORECASTDAYS.Nextval)";
                    }
                    result1 = oh.db_ExecuteNonQuery(strSQL);
                    if (result1 <= 0)
                    {
                        return false;
                    }
                }
                if (result1 > 0)
                {
                    strSQL = "select recid from  LFS_TRAFFICFORECAST where ddatetime=to_date('" + dt.ToString("yyyy-MM-dd HH:mm") + "','yyyy-mm-dd hh24:mi') ";
                    OracleHelper oh = new OracleHelper("HAIKOUConnect");
                    strID = oh.db_GreateQuery(strSQL);
                    if (strID.Length > 0)
                    {
                        strSQL = "update LFS_TRAFFICFORECAST set "
                        + ",WRITETIME=to_date('" + DateTime.Now.ToString("yyyy-MM-dd HH:mm") + "','yyyy-mm-dd hh24:mi')  "
                        + ",NUMID='" + info.Numid + "'"
                        + ",FORECASTER='" + forecaster + "'"
                        + ",TRAFFICTRENDFORECAST='" + info.TrafficTrendForecast+ "'"
                        + ",FILEFLAG=0"
                         + ",FORECASTDATE='" + info.ForecastDate + "'"
                        + "  where RECID=" + strID;
                    }
                    else
                    {
                        strSQL = "insert into LFS_TRAFFICFORECAST(RECID"
                            + ",DDATETIME"
                            + ",WRITETIME"
                            + ",NUMID"
                            + ",TRAFFICTRENDFORECAST"
                            + ",CREATEWORD"
                            + ",FORECASTER"
                            + ",FILEFLAG"
                            + ",FORECASTDATE"
                            + ") values(seq_LFS_TRAFFICFORECAST.Nextval"
                            + " ,to_date('" + dt.ToString("yyyy-MM-dd HH:mm") + "','yyyy-mm-dd hh24:mi') "
                            + ",to_date('" + DateTime.Now.ToString("yyyy-MM-dd HH:mm") + "','yyyy-mm-dd hh24:mi')"
                            + ",'" + info.Numid + "'"
                            + ",'" + info.TrafficTrendForecast + "'"
                            + ",'" + 0 + "'"
                            + ",'" + forecaster + "'"
                            + ",'" + 0 + "'"
                            + ",'" + info.ForecastDate + "'"
                            + ")";
                    }
                    result1 = oh.db_ExecuteNonQuery(strSQL);
                    if (result1 <= 0)
                    {
                        return false;
                    }
                }
            }
            catch (Exception ex)
            {
                return false;
            }
            return true;
        }

        public List<TrafficForecastModel> GetTrafficForecastInfolister(string dateTime)
        {
            try
            {
                DateTime dt = DateTime.Parse(dateTime);
                List<TrafficForecastModel> infoList = new List<TrafficForecastModel>();

                DateTime dtF = dt;
                DateTime dtFirst = dt.AddDays(1);
                string strSQL = "select * from LFS_SPRINGFORECASTDAYS where  ddatetime = to_date('" + dt.ToString("yyyy-MM-dd HH:mm") + "','yyyy-mm-dd hh24:mi') order by FORECASTTIME";
                OracleHelper oh = new OracleHelper("HAIKOUConnect");
                DataTable ds = oh.ExecuteDataTable(strSQL);
                if (ds == null || ds.Rows.Count == 0)
                {
                    switch (dt.Hour)
                    {
                        case 8:
                            dtF = DateTime.Parse(dt.ToString("yyyy-MM-dd 8:00"));
                            break;
                        case 20:
                            dtF = DateTime.Parse(dt.ToString("yyyy-MM-dd 20:00"));
                            break;
                    }
                    if (dt.Hour == 20)
                    {
                        dtFirst = dt.AddDays(2);
                    }
                    strSQL = "select * from LFS_TRAFFICFORECASTDAYS where ddatetime = to_date('" + dtF.ToString("yyyy-MM-dd HH:mm") + "','yyyy-mm-dd hh24:mi') and FORECASTTIME >= to_date('" + dtFirst.ToString("yyyy-MM-dd") + "', 'yyyy-MM-dd') order by FORECASTTIME";
                    ds = oh.ExecuteDataTable(strSQL);
                }
                if (ds != null && ds.Rows.Count > 0)
                {
                    for (int i = 0; i < ds.Rows.Count; i++)
                    {
                        infoList.Add(new TrafficForecastModel());
                        infoList[i].Ddatetime = dt;
                        dtF = dt;
                        DateTime.TryParse(ds.Rows[i]["FORECASTTIME"].ToString(), out dtF);
                        infoList[i].ForcastTime = dtF;
                        infoList[i].MinTemp = ds.Rows[i]["MINTEMP"].ToString();
                        infoList[i].MaxTemp = ds.Rows[i]["MAXTEMP"].ToString();
                        infoList[i].Weather1 = ds.Rows[i]["WEATHER1"].ToString();
                        infoList[i].WeatherIcon = ds.Rows[i]["WEATHERPIC1"].ToString();
                        infoList[i].MinWind = ds.Rows[i]["MINWIND"].ToString();
                        infoList[i].MaxWind = ds.Rows[i]["MAXWIND"].ToString();
                        infoList[i].WindDirect = ds.Rows[i]["WINDDIRECT"].ToString();
                    }
                }
                else
                {
                    switch (dt.Hour)
                    {
                        case 20:
                            dtF = dt.Date.AddDays(2);
                            break;
                        default:
                            dtF = dt.Date.AddDays(1);
                            break;
                    }
                    for (int i = 0; i < 7; i++)
                    {
                        infoList.Add(new TrafficForecastModel());
                        infoList[i].Ddatetime = dt;
                        infoList[i].ForcastTime = dtF;
                        infoList[i].MinTemp = "15";
                        infoList[i].MaxTemp = "22";
                        infoList[i].WeatherIcon = "01.png";
                        infoList[i].Weather1 = "晴";
                        infoList[i].MinWind = "2";
                        infoList[i].MaxWind = "3";
                        infoList[i].WindDirect = "东";
                        dtF = dtF.Date.AddDays(1);
                    }
                }
                return infoList;
            }
            catch (Exception ex)
            {
                //ErrWriter(ex);
            }
            return null;
        }
        /// <summary>
        /// 七天预报下半部分格点数据获取与处理
        /// </summary>
        /// <param name="dateTime"></param>
        /// <returns></returns>
        public List<TrafficForecastModel> GetTrafficForecastInfolist(string dateTime)
        {
            try
            {
                int start_ybsx = 24;//预报时次开始位置
                int end_ybsx = 192;//预报时次结束位置
                string timesql = "select max(ddatetime) as latesttime from t_hk_ecmwf_grid_forecast t";
                OracleHelper oh = new OracleHelper("HAIKOUConnect");
                string latestTime = oh.ExecuteScalar(timesql).ToString();//欧洲中心最新数据时间
                DateTime ecdt = DateTime.Parse(latestTime);
                DateTime dt = DateTime.Parse(dateTime);//系统最新时间
                string dtstr = dt.Hour.ToString();//得到时间的小时，08或20
                string ecdtstr = ecdt.Hour.ToString();//得到时间的小时，08或20
                //如果没有当前最新时间的欧洲中心数据还没入库，则取前一天的08或20时的与当前时间匹配预报数据，因此相应的预报时次需要调整
                if (dt.Ticks > ecdt.Ticks)
                {
                    //如果系统时间大于欧洲中心最新数据的时间，则取前一天的预报时间数据
                    if (dtstr == "8")
                    {
                        if (ecdtstr == "20")
                        {
                            start_ybsx = 36;
                            end_ybsx = 204;
                        }

                        if (ecdtstr == "8")
                        {
                            start_ybsx = 48;
                            end_ybsx = 216;
                        }
                    }
                    else
                    {
                        if (ecdtstr == "20")
                        {
                            start_ybsx = 48;
                            end_ybsx = 216;
                        }

                        if (ecdtstr == "8")
                        {
                            start_ybsx = 60;
                            end_ybsx = 228;
                        }
                    }
                }
                else
                {
                    latestTime = dt.ToString();
                    if (dtstr == "20")
                    {
                        start_ybsx = 36;
                        end_ybsx = 204;
                    }
                }
                List<TrafficForecastModel> infoList = null;
                //格点数据获取
                infoList = new List<TrafficForecastModel>();
                for (int i = 0; i < 7; i++)
                {
                    infoList.Add(new TrafficForecastModel());
                }

                string strSql = string.Format(@"select ybsx,t2m,rhsfc,WDIR10M,WSPD10M,CLCT,visi,RAIN,t2m,forecasttime from T_HK_ECMWF_GRID_FORECAST t where ddatetime =to_date('{0}','yyyy-MM-dd hh24:mi:ss') and venueid = 106  and ybsx >0 order by ybsx ", latestTime);
                OracleHelper sh = new OracleHelper("HAIKOUConnect");
                DataTable dTable = sh.ExecuteDataTable(strSql);
                List<string[]> mintemp = new List<string[]>();
                List<string[]> humit = new List<string[]>();
                int flag = 0;
                for (int i = start_ybsx; i < end_ybsx; i = i + 24)
                {
                    string[] temp = new string[2];//存储最低最高温度 
                    string[] hum = new string[2];//存储最低最高相对湿度
                    temp[0] = dTable.Select("ybsx >= " + i + " and ybsx<=" + (i + 24) + " and t2m<>0", "T2M asc")[0].ItemArray[1].ToString();
                    temp[1] = dTable.Select("ybsx >= " + i + " and ybsx<= " + (i + 24) + " and t2m<>0", "T2M desc")[0].ItemArray[1].ToString();

                    hum[0] = dTable.Select("ybsx >= " + i + " and ybsx<=" + (i + 24) + " and rhsfc<>0", "rhsfc asc")[0].ItemArray[2].ToString();
                    hum[1] = dTable.Select("ybsx >= " + i + " and ybsx<= " + (i + 24) + " and rhsfc<>0", "rhsfc desc")[0].ItemArray[2].ToString();

                    DataTable newdt = dTable.Clone();
                    DataRow[] rows = dTable.Select("ybsx >= " + i + " and ybsx<=" + (i + 24));
                    foreach (DataRow row in rows)
                    {
                        newdt.Rows.Add(row.ItemArray);
                    }
                    infoList[flag].WindDirect = getDirect(Convert.ToDouble(newdt.Rows.Cast<DataRow>().Average(r => r.Field<decimal>("WDIR10M")))).ToString();//风向

                    DataTable newdt1 = dTable.Clone();
                    DataRow[] rows1 = dTable.Select("ybsx >= " + i + " and ybsx<=" + (i + 24));
                    foreach (DataRow row in rows1)
                    {
                        newdt1.Rows.Add(row.ItemArray);
                    }
                    infoList[flag].MinWind = GetWindSpeedClass(Convert.ToDouble(newdt1.Rows.Cast<DataRow>().Min(r => r.Field<decimal>("WSPD10M")))).ToString();//最小风速转换为最小风力级别
                    infoList[flag].MaxWind = GetWindSpeedClass(Convert.ToDouble(newdt1.Rows.Cast<DataRow>().Max(r => r.Field<decimal>("WSPD10M")))).ToString();//最大风速转换为最大风力级别

                    #region 天气图片
                    int CLCT = Convert.ToInt32(dTable.Compute("max(CLCT)", "ybsx >= " + i + " and ybsx<=" + (i + 24)));//云量
                    double rain = Convert.ToDouble(dTable.Compute("sum(RAIN)", "ybsx >= " + i + " and ybsx< " + (i + 24)));

                    int MaxT = Convert.ToInt32(dTable.Compute("max(T2M)", "t2m<>0 and ybsx >= " + i + " and ybsx<=" + (i + 24)));//温度
                    int dictyure = Convert.ToInt32(dTable.Compute("max(RHSFC)", "RHSFC<>0 and ybsx >= " + i + " and ybsx<=" + (i + 24)));// 相对湿度
                    double visi = 0.0;
                    int hourSc = dt.Hour;
                    double rain6 = 0.0;
                    double rain11 = 0.0;
                    //获取天气图片 
                    infoList[flag].WeatherIcon = GetSevendaysWeatherIcon(CLCT, rain, MaxT, dictyure, visi, hourSc, rain6, rain11);
                    #endregion

                    mintemp.Add(temp);
                    humit.Add(hum);
                    flag++;
                }
                for (int i = 0; i < mintemp.Count; i++)
                {
                    infoList[i].MinTemp = Math.Round(Convert.ToDouble(mintemp[i][0]), 0).ToString();
                    infoList[i].MaxTemp = Math.Round(Convert.ToDouble(mintemp[i][1]), 0).ToString();
                }

                return infoList;
            }
            catch (Exception ex)
            {

            }
            return null;
        }
        private string getDirect(double angle)
        {
            string strDir = "北";
            try
            {
                double dTemp = angle / 22.5;
                if (dTemp >= 1 && dTemp < 3)
                {
                    strDir = "东北";
                }
                else if (dTemp >= 3 && dTemp < 5)
                {
                    strDir = "东";
                }
                else if (dTemp >= 5 && dTemp < 7)
                {
                    strDir = "东南";
                }
                else if (dTemp >= 7 && dTemp < 9)
                {
                    strDir = "南";
                }
                else if (dTemp >= 9 && dTemp < 11)
                {
                    strDir = "西南";
                }
                else if (dTemp >= 11 && dTemp < 13)
                {
                    strDir = "西";
                }
                else if (dTemp >= 13 && dTemp < 15)
                {
                    strDir = "西北";
                }
            }
            catch (Exception ex)
            {
                //ErrWriter(ex);
            }
            return strDir;
        }
        //风力级别
        public int GetWindSpeedClass(double rain)
        {
            if (rain > 0.0 && rain < 0.2) return 0;
            if (rain >= 0.3 && rain < 1.6) return 1;
            if (rain >= 1.6 && rain < 3.4) return 2;
            if (rain >= 3.4 && rain < 5.5) return 3;
            if (rain >= 5.5 && rain < 8.0) return 4;
            if (rain >= 8.0 && rain < 10.8) return 5;
            if (rain >= 10.8 && rain < 13.9) return 6;
            if (rain >= 13.9 && rain < 17.2) return 7;
            if (rain >= 17.2 && rain < 20.8) return 8;
            if (rain >= 20.8 && rain < 24.5) return 9;
            if (rain >= 24.5 && rain < 28.5) return 10;
            if (rain >= 28.5 && rain < 32.6) return 11;
            if (rain >= 32.6) return 12;
            return 0;
        }

        /// <summary>
        /// 七天天气预报 处理天气图标
        /// </summary>
        /// <param name="CLCT">云量</param>
        /// <param name="rain">降雨</param>
        /// <param name="MaxT">最大温度</param>
        /// <param name="dictyure">相对湿度</param>
        /// <param name="visi">能见度</param>
        /// <param name="hourSc">预报时次</param>
        /// <param name="rain6"></param>
        /// <param name="rain11"></param>
        /// <returns></returns>
        public string GetSevendaysWeatherIcon(int CLCT, double rain, int MaxT, int dictyure, double visi, int hourSc, double rain6, double rain11)
        {
            string resuIcon = string.Empty;
            int temp = MaxT;//温度
            int hour = DateTime.Now.Hour;//当前小时

            //与word文档一一对应
            string[] weIcon = new string[] { "01.png", "11.png", "02.png", "12.png", "02_2.png", "12_2.png", "04.png", "13.png", "03.png", "05.png", "07.png", "08.png", "09.png", "05.png", "10.png", "16.png", "17.png", "15.png", "14.png" };
            //12-20时，在时段中所有的小时图标里，按照“气温>能见度>云量”的优先级
            //未降水
            if (rain == 0.0)
            {
                if (temp >= 35)
                {
                    resuIcon = weIcon[15];
                }
                else if (temp <= 10)
                {
                    resuIcon = weIcon[16];
                }
                else if (visi < 1 && dictyure >= 90)
                {
                    resuIcon = weIcon[17];
                }
                else if (visi < 3 && dictyure <= 80)
                {
                    resuIcon = weIcon[18];
                }
                else if (CLCT < 2 && CLCT > 0)
                {
                    resuIcon = weIcon[0];
                }

                else if (CLCT < 5 && CLCT > 3)
                {
                    resuIcon = weIcon[2];
                }
                else if (CLCT < 8 && CLCT > 6)
                {
                    resuIcon = weIcon[4];
                }
                else if (CLCT > 9)
                {
                    resuIcon = weIcon[8];
                }
                else if (temp > 10 && temp < 35 && visi > 3)
                {
                    resuIcon = weIcon[18];
                }
                else if (temp > 10 && temp < 35 && visi > 1 && visi < 3)
                {
                    resuIcon = weIcon[17];
                }
                else if (CLCT >= 2 && CLCT <= 3)
                {
                    resuIcon = weIcon[2];
                }
                else if (CLCT >= 5 && CLCT <= 6)
                {
                    resuIcon = weIcon[4];
                }
                else if (CLCT >= 8 && CLCT <= 9)
                {
                    resuIcon = weIcon[8];
                }

            }
            //出现降雨
            else if (rain > 0.0)
            {
                if (rain > 0.01 && rain <= 1)
                {
                    resuIcon = weIcon[6];
                }

                if (rain > 1 && rain <= 9.9)
                {
                    resuIcon = weIcon[10];
                }
                if (rain >= 10 && rain <= 24.9)
                {
                    resuIcon = weIcon[11];
                }
                if (rain >= 25 && rain <= 49.9)
                {
                    resuIcon = weIcon[12];
                }
                if (rain >= 50)
                {
                    resuIcon = weIcon[14];
                }
            }
            if (!string.IsNullOrEmpty(resuIcon))
            {
                return resuIcon;
            }
            else
                return "";
        }
    }
}
