#region << 版 本 注 释 >>
/*----------------------------------------------------------------
// Copyright (C) 2017 雅码科技
// 版权所有。 
//
// 文件名：SpringForecastDAL
// 文件功能描述：
//
// 
// 创建者：名字 (yamatech)
// 时间：2018/1/5 14:13:00
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
    public class SpringForecastDAL
    {   
        /// <summary>
        /// 获取春运报文信息，如果没有则返回默认报文信息
        /// </summary>
        /// <param name="DDateTime">预报时间</param>
        /// <returns></returns>
        public SpringForecastModel GetSpringForecastInfo(DateTime DDateTime)
        {
            SpringForecastModel info = GetWelfareForecastInfoNow(DDateTime);
            if (info == null)
            {
                return GetSpringForecastFromGrid(DDateTime);
            }
            return info;
        }
        /// <summary>
        /// 获取最新发布的春运报文信息
        /// </summary>
        /// <param name="dt">预报时间</param>
        /// <returns></returns>
        private SpringForecastModel GetWelfareForecastInfoNow(DateTime dt)
        {
            try
            {
                SpringForecastModel infoList = null;
                // 原始方法
                string strSQL = "select * from LFS_SPRINGFORECAST where  ddatetime = to_date('" + dt.ToString("yyyy-MM-dd HH:mm") + "','yyyy-mm-dd hh24:mi') ";
                OracleHelper oh = new OracleHelper("HAIKOUConnect");
                DataTable dTable = oh.ExecuteDataTable(strSQL);

                if (dTable != null && dTable.Rows.Count > 0)
                {
                    infoList = new SpringForecastModel();
                    infoList.Ddatetime = dt;
                    infoList.Numid = Convert.ToInt32(dTable.Rows[0]["NUMID"].ToString());//报文期号
                    infoList.TotalTrendTitle = dTable.Rows[0]["TOTALTRENDTITLE"].ToString(); //春运天气总趋势预测标题
                    infoList.TotalTrendForecast = dTable.Rows[0]["TOTALTRENDFORECAST"].ToString(); //春运天气总趋势预测内容
                    infoList.ThreeDayForecastTitle= dTable.Rows[0]["THREEDAYFORECASTTITLE"].ToString(); //未来3天天气预报 一级标题
                    infoList.ThreeDayForecast = dTable.Rows[0]["THREEDAYFORECAST"].ToString(); //未来3天天气预报  标题
                    infoList.ThreeDayContent = dTable.Rows[0]["THREEDAYCONTENT"].ToString(); //未来3天天气预报  内容
                    infoList.ThreeDayTrafficForecast = dTable.Rows[0]["THREEDAYTRAFFICFORECAST"].ToString(); //未来三天交通气象预报  标题
                    infoList.MainTrafficRoad = dTable.Rows[0]["MAINTRAFFICROAD"].ToString(); //未来三天交通气象预报 1、主要交通路段 内容
                    infoList.QiozhouStrait = dTable.Rows[0]["QIOZHOUSTRAIT"].ToString(); //未来三天交通气象预报 2、琼州海峡 内容
                    infoList.ProvinceForcastTitle = dTable.Rows[0]["PROVINCEFORECASTTITLE"].ToString(); //三、未来4～7天全省天气趋势预报标题
                    infoList.FutureProvinceForcast= dTable.Rows[0]["FUTUREPROVINCEFORECAST"].ToString(); //三、未来4～7天全省天气趋势预报 内容
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
        /// 制作最新春运报文信息
        /// </summary>
        /// <param name="dt"></param>
        /// <returns></returns>
        private SpringForecastModel GetSpringForecastFromGrid(DateTime dt)
        {
            SpringForecastModel infoList = null;
            try
            {
                infoList = new SpringForecastModel();
                string sql = "select max(NUMID) as NOID from LFS_SPRINGFORECAST t";
                OracleHelper oh = new OracleHelper("HAIKOUConnect");
                string newNum = oh.ExecuteScalar(sql).ToString();//欧洲中心最新数据时间

                string timesql = "select max(ddatetime) as latesttime from LFS_SPRINGFORECAST t";
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
                string proSql = string.Format(@"select * from wechat_prodocut_hn t where PRO_ID =5");//取入库的三天预报报文数据
                DataTable protable = oh.ExecuteDataTable(proSql);
                string pro_content = protable.Rows[0]["PRO_CONTEXT"].ToString();
                string pastpro = "";//天气回顾
                string futurepro = "";//天气展望
                if (pro_content.Split('；').Length >= 3)
                {
                    pastpro = pro_content.Split('；')[0].Split('：')[1];
                    futurepro = pro_content.Split('；')[1] + "；" + pro_content.Split('；')[2];
                }
                else if (pro_content.Split('；').Length == 2)
                {
                    pastpro = pro_content.Split('；')[0].Split('：')[1];
                    futurepro = pro_content.Split('；')[1];
                }
                else if (pro_content.Split('。').Length >= 3)
                {
                    pastpro = pro_content.Split('。')[0].Split('：')[1] + "。";
                    futurepro = pro_content.Split('。')[1] + "。" + pro_content.Split('。')[2] + "。";
                }
                else if (pro_content.Split('；').Length == 2)
                {
                    pastpro = pro_content.Split('。')[0].Split('：')[1];
                    futurepro = pro_content.Split('。')[1];
                }
                infoList.Ddatetime = dt;
                infoList.TotalTrendTitle = DateTime.Now.ToString("yyyy")+ "年春运天气总趋势预测";
                infoList.TotalTrendForecast = "预计"+ DateTime.Now.ToString("yyyy") + "年春运期间（2月1日～3月12日），我市XXX";
                infoList.ThreeDayForecastTitle = "未来三天春运天气预报";//未来3天天气预报 一级标题
                infoList.ThreeDayForecast = "未来3天天气预报";//未来3天天气预报 第一段 标题
                infoList.ThreeDayContent = pastpro;//未来3天天气预报 第一段 内容
                infoList.ThreeDayTrafficForecast = "未来三天交通气象预报";//未来三天交通气象预报 第二段 标题
                infoList.MainTrafficRoad = "X日～X日，本岛东线高速公路海口至三亚路段、中线高速公路海口至琼中路段，阴天有小雨，能见度较差，对公路交通运输有一定影响。"; //未来三天交通气象预报 1、主要交通路段 内容
                infoList.QiozhouStrait = "X日～X日白天，琼州海峡XXX，风力X～X级、阵风X级，通航气象条件一般。";// 二、未来三天交通气象预报 2、琼州海峡 内容
                infoList.ProvinceForcastTitle = "未来4～7天全省天气趋势预报";//三、未来4～7天全省天气趋势预报
                infoList.FutureProvinceForcast = "X～X日XXX，大部分时段X，气温X，近海海面风力X～X级，阵风X级。";//三、未来4～7天全省天气趋势预报 内容
                return infoList;
            }
            catch (Exception ex)
            {
                return null;
            }
        }        

        /// <summary>
        /// 十天预报下半部分格点数据获取与处理
        /// </summary>
        /// <param name="dateTime"></param>
        /// <returns></returns>
        public List<SpringForecastModel> GetSpringForecastInfolist(string dateTime)
        {
            try
            {
                int start_ybsx = 24;//预报时次开始位置
                int end_ybsx = 96;//预报时次结束位置
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
                            end_ybsx = 108;
                        }

                        if (ecdtstr == "8")
                        {
                            start_ybsx = 48;
                            end_ybsx = 120;
                        }
                    }
                    else
                    {
                        if (ecdtstr == "20")
                        {
                            start_ybsx = 48;
                            end_ybsx = 120;
                        }

                        if (ecdtstr == "8")
                        {
                            start_ybsx = 60;
                            end_ybsx = 132;
                        }
                    }
                }
                else
                {
                    latestTime = dt.ToString();
                    if (dtstr == "20")
                    {
                        start_ybsx = 36;
                        end_ybsx = 108;
                    }
                }
                List<SpringForecastModel> infoList = null;
                //格点数据获取
                infoList = new List<SpringForecastModel>();
                for (int i = 0; i < 3; i++)
                {
                    infoList.Add(new SpringForecastModel());
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
                    infoList[flag].LandWindDirect = getDirect(Convert.ToDouble(newdt.Rows.Cast<DataRow>().Average(r => r.Field<decimal>("WDIR10M")))).ToString();//风向

                    DataTable newdt1 = dTable.Clone();
                    DataRow[] rows1 = dTable.Select("ybsx >= " + i + " and ybsx<=" + (i + 24));
                    foreach (DataRow row in rows1)
                    {
                        newdt1.Rows.Add(row.ItemArray);
                    }
                    infoList[flag].LandMinWind = GetWindSpeedClass(Convert.ToDouble(newdt1.Rows.Cast<DataRow>().Min(r => r.Field<decimal>("WSPD10M")))).ToString();//最小风速转换为最小风力级别
                    infoList[flag].LandMaxWind = GetWindSpeedClass(Convert.ToDouble(newdt1.Rows.Cast<DataRow>().Max(r => r.Field<decimal>("WSPD10M")))).ToString();//最大风速转换为最大风力级别

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
                    infoList[flag].WeatherIcon = GetThreedaysWeatherIcon(CLCT, rain, MaxT, dictyure, visi, hourSc, rain6, rain11); 
                    #endregion  天气图片

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
        public bool InsertSpringForecast(DateTime dt, SpringForecastModel info, List<SpringForecastModel> daysList, string forecaster)
        {
            try
            {
                string strSQL = "";
                string strID = "";
                int result1 = 0;                
                foreach (SpringForecastModel info1 in daysList)
                {                   
                    strSQL = "select recid from LFS_SPRINGFORECASTDAYS where ddatetime=to_date('" + dt.ToString("yyyy-MM-dd HH:mm") + "','yyyy-mm-dd hh24:mi') and FORECASTDATE= to_date('" + info1.Ddatetime.ToString("yyyy-MM-dd HH:mm") + "','yyyy-mm-dd hh24:mi')  ";
                    OracleHelper oh = new OracleHelper("HAIKOUConnect"); 
                    strID = oh.db_GreateQuery(strSQL);
                    if (strID.Length > 0)
                    {
                        strSQL = "update LFS_SPRINGFORECASTDAYS set WEATHER1 ='" + info1.Weather + "'"
                             + ",WEATHERPIC1='" + info1.WeatherIcon + "'"
                             + ",MINTEMP='" + info1.MinTemp + "'"
                             + ",MAXTEMP='" + info1.MaxTemp + "'"
                             + ",LANDMINWIND='" + info1.LandMinWind + "'"
                             + ",LANDMAXWIND='" + info1.LandMaxWind + "'"
                             + ",LANDWINDDIRECT='" + info1.LandWindDirect + "'"
                             + ",SEAMINWIND='" + info1.SeaMinWind + "'"
                             + ",SEAMAXWIND='" + info1.SeaMaxWind + "'"
                             + ",SEAWINDDIRECT='" + info1.SeaWindDirect + "'"
                             + ",GUSTWIND='" + info1.GustWind + "'"
                             + " ,WRITETIME=to_date('" + DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss") + "', 'yyyy-mm-dd HH24:mi:ss')"
                             + " where RECID=" + strID; ;
                    }
                    else
                    {
                        strSQL = "insert into LFS_SPRINGFORECASTDAYS(ddatetime,WEATHER1,WEATHERPIC1,MINTEMP,MAXTEMP,LANDMINWIND,LANDMAXWIND,LANDWINDDIRECT,SEAMINWIND,SEAMAXWIND,SEAWINDDIRECT,GUSTWIND,FORECASTTIME,recid) values("
                        + " to_date('" + dt.ToString("yyyy-MM-dd HH:mm") + "','yyyy-mm-dd hh24:mi') "
                        + ",'" + info1.Weather + "'"
                        + ",'" + info1.WeatherIcon + "'"
                        + ",'" + info1.MinTemp + "'"
                        + ",'" + info1.MaxTemp + "'"
                        + ",'" + info1.LandMinWind + "'"
                        + ",'" + info1.LandMaxWind + "'"
                        + ",'" + info1.LandWindDirect + "'"
                        + ",'" + info1.SeaMinWind + "'"
                        + ",'" + info1.SeaMaxWind + "'"
                        + ",'" + info1.SeaWindDirect + "'"
                        + ",'" + info1.GustWind + "'"
                        + ",to_date('" + info1.ForcastTime.ToString("yyyy-MM-dd HH:mm") + "','yyyy-mm-dd hh24:mi') "
                        + ",seq_LFS_SPRINGFORECASTDAYS.Nextval)";
                    }
                    result1 = oh.db_ExecuteNonQuery(strSQL);
                    if (result1 <= 0)
                    {
                        return false;
                    }
                }
                if (result1 > 0)
                {
                    strSQL = "select recid from  LFS_SPRINGFORECAST where ddatetime=to_date('" + dt.ToString("yyyy-MM-dd HH:mm") + "','yyyy-mm-dd hh24:mi') ";
                    OracleHelper oh = new OracleHelper("HAIKOUConnect");
                    strID = oh.db_GreateQuery(strSQL);
                    if (strID.Length > 0)
                    {
                        strSQL = "update LFS_SPRINGFORECAST set WEATHERTODAY='" + info.Weather + "'"
                        + ",WRITETIME=to_date('" + DateTime.Now.ToString("yyyy-MM-dd HH:mm") + "','yyyy-mm-dd hh24:mi')  "
                        + ",NUMID='" + info.Numid + "'"
                        + ",FORECASTER='" + forecaster + "'"
                        + ",TOTALTRENDTITLE='" + info.TotalTrendTitle + "'"
                        + ",TOTALTRENDFORECAST='" + info.TotalTrendForecast + "'"
                        + ",THREEDAYFORECASTTITLE='" + info.ThreeDayForecastTitle + "'"
                        + ",THREEDAYFORECAST='" + info.ThreeDayForecast + "'"
                        + ",THREEDAYCONTENT='" + info.ThreeDayContent + "'"
                        + ",THREEDAYTRAFFICFORECAST='" + info.ThreeDayTrafficForecast + "'"
                        + ",MAINTRAFFICROAD='" + info.MainTrafficRoad + "'"
                        + ",QIOZHOUSTRAIT='" + info.QiozhouStrait + "'"
                        + ",PROVINCEFORECASTTITLE='" + info.ProvinceForcastTitle + "'"
                        + ",FUTUREPROVINCEFORECAST='" + info.FutureProvinceForcast + "'"                        
                        + ",FILEFLAG=0"
                         + ",FORECASTDATE='" + info.ForecastDate + "'"
                        + "  where RECID=" + strID;
                    }
                    else
                    {
                        strSQL = "insert into LFS_SPRINGFORECAST(RECID"
                            + ",DDATETIME"
                            + ",WRITETIME"
                            + ",NUMID"
                            + ",TOTALTRENDTITLE"
                            + ",TOTALTRENDFORECAST"
                            + ",THREEDAYFORECASTTITLE"
                            + ",THREEDAYFORECAST"
                            + ",THREEDAYCONTENT"
                            + ",THREEDAYTRAFFICFORECAST"
                            + ",MAINTRAFFICROAD"
                            + ",QIOZHOUSTRAIT"
                            + ",PROVINCEFORECASTTITLE"
                            + ",FUTUREPROVINCEFORECAST"
                            + ",CREATEWORD"
                            + ",FORECASTER"
                            + ",FILEFLAG"
                            + ",FORECASTDATE"
                            + ") values(seq_LFS_SPRINGFORECAST.Nextval"
                            + " ,to_date('" + dt.ToString("yyyy-MM-dd HH:mm") + "','yyyy-mm-dd hh24:mi') "
                            + ",to_date('" + DateTime.Now.ToString("yyyy-MM-dd HH:mm") + "','yyyy-mm-dd hh24:mi')"
                            + ",'" + info.Numid + "'"
                            + ",'" + info.TotalTrendTitle + "'"
                            + ",'" + info.TotalTrendForecast + "'"
                            + ",'" + info.ThreeDayForecastTitle + "'"
                            + ",'" + info.ThreeDayForecast + "'"
                            + ",'" + info.ThreeDayContent + "'"
                            + ",'" + info.ThreeDayTrafficForecast + "'"
                            + ",'" + info.MainTrafficRoad + "'"
                            + ",'" + info.QiozhouStrait + "'"
                            + ",'" + info.ProvinceForcastTitle + "'"
                            + ",'" + info.FutureProvinceForcast + "'"
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
        public List<SpringForecastModel> GetSpringForecastInfolister(string dateTime)
        {
            try
            {
                DateTime dt = DateTime.Parse(dateTime);
                List<SpringForecastModel> infoList = new List<SpringForecastModel>();

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
                    strSQL = "select * from LFS_SPRINGFORECASTDAYS where ddatetime = to_date('" + dtF.ToString("yyyy-MM-dd HH:mm") + "','yyyy-mm-dd hh24:mi') and FORECASTTIME >= to_date('" + dtFirst.ToString("yyyy-MM-dd") + "', 'yyyy-MM-dd') order by FORECASTTIME";
                    ds = oh.ExecuteDataTable(strSQL);
                }
                if (ds != null && ds.Rows.Count > 0)
                {
                    for (int i = 0; i < ds.Rows.Count; i++)
                    {
                        infoList.Add(new SpringForecastModel());
                        infoList[i].Ddatetime = dt;
                        dtF = dt;
                        DateTime.TryParse(ds.Rows[i]["FORECASTTIME"].ToString(), out dtF);
                        infoList[i].ForcastTime = dtF;
                        infoList[i].MinTemp = ds.Rows[i]["MINTEMP"].ToString();
                        infoList[i].MaxTemp = ds.Rows[i]["MAXTEMP"].ToString();
                        infoList[i].Weather = ds.Rows[i]["WEATHER1"].ToString();
                        infoList[i].WeatherIcon = ds.Rows[i]["WEATHERPIC1"].ToString();
                        infoList[i].LandMinWind = ds.Rows[i]["LANDMINWIND"].ToString();
                        infoList[i].LandMaxWind = ds.Rows[i]["LANDMAXWIND"].ToString();
                        infoList[i].LandWindDirect = ds.Rows[i]["LANDWINDDIRECT"].ToString();
                        infoList[i].SeaMinWind = ds.Rows[i]["SEAMINWIND"].ToString();
                        infoList[i].SeaMaxWind = ds.Rows[i]["SEAMAXWIND"].ToString();
                        infoList[i].SeaWindDirect = ds.Rows[i]["SEAWINDDIRECT"].ToString();
                        infoList[i].GustWind = ds.Rows[i]["GUSTWIND"].ToString();
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
                    for (int i = 0; i < 3; i++)
                    {
                        infoList.Add(new SpringForecastModel());
                        infoList[i].Ddatetime = dt;
                        infoList[i].ForcastTime = dtF;
                        infoList[i].MinTemp = "15";
                        infoList[i].MaxTemp = "22";
                        infoList[i].WeatherIcon = "01.png";
                        infoList[i].Weather = "晴";
                        infoList[i].LandMinWind = "2";
                        infoList[i].LandMaxWind= "3";
                        infoList[i].LandWindDirect= "东";
                        infoList[i].SeaMinWind = "4";
                        infoList[i].SeaMaxWind = "5";
                        infoList[i].SeaWindDirect= "西南";
                        infoList[i].GustWind = "7";
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
        /// 三天天气预报 处理天气图标
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
        public string GetThreedaysWeatherIcon(int CLCT, double rain, int MaxT, int dictyure, double visi, int hourSc, double rain6, double rain11)
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
