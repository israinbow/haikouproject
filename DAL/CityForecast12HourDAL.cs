using Common;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DAL
{
    public class CityForecast12HourDAL
    {
        /// <summary>
        /// 获取当前时段预报员
        /// </summary>
        /// <param name="dt"></param>
        /// <returns></returns>
        public string Get12HourForecaster(DateTime dt)
        {
            string Name = "谢光前";
            try
            {
                string strSQL = "select FORECASTER from lfs_hour12weather where DDATETIME=to_date('" + dt.ToString("dd-MM-yyyy HH:mm:ss") + "', 'dd-mm-yyyy hh24:mi:ss') order by recid desc ";
                OracleHelper oh = new OracleHelper("HAIKOUConnect");
                if (oh.db_GreateQuery(strSQL) != null && oh.db_GreateQuery(strSQL) != "")
                {
                    Name = oh.db_GreateQuery(strSQL);
                }
                //else//获取值班人员信息
                //{
                //    List<UserInfo> UserInfo = GetHour12UserInfo();
                //    for (int i = 0; i < UserInfo.Count; i++)
                //    {
                //        if (UserInfo[i].UserName.Equals(GetWarnWriter("逐12时预报", dt)))
                //        {
                //            Name = GetWarnWriter("逐12时预报", dt);
                //        }
                //    }
                //}
                return Name;
            }
            catch (Exception ex)
            {
                OracleHelper.ErrWriter(ex);
            }
            return null;
        }

        /// <summary>
        /// 获取所有预报员信息
        /// </summary>
        /// <returns></returns>
        public List<UserInfo> GetHour12UserInfo()
        {
            string strSQL = "select * from lfs_hour12bwuser order by userid";
            try
            {
                List<UserInfo> listUser = new List<UserInfo>();
                OracleHelper oh = new OracleHelper("HAIKOUConnect");
                DataTable dtReturn = oh.ExecuteDataTable(strSQL);
                if (dtReturn != null && dtReturn.Rows.Count > 0)
                {
                    UserInfo info;
                    List<UserInfo> userInfo = GetUserInfo();

                    strSQL = "select * from tuser ";
                    oh = new OracleHelper("HAIKOUConnect");
                    DataTable dUser = oh.ExecuteDataTable(strSQL);
                    DataRow[] drUser;
                    for (int i = 0; i < dtReturn.Rows.Count; i++)
                    {
                        info = new UserInfo();
                        info.UserName = dtReturn.Rows[i]["USERNAME"].ToString();
                        info.UPassword = dtReturn.Rows[i]["USERPWD"].ToString();

                        if (dUser != null && dUser.Rows.Count > 0)
                        {
                            drUser = dUser.Select("USERNAME='" + info.UserName + "'");
                            if (drUser != null && drUser.Length > 0)
                            {
                                info.UPassword = drUser[0]["UPASSWORD"].ToString();
                            }
                        }
                        listUser.Add(info);
                    }
                }
                return listUser;
            }
            catch (Exception ex)
            {
                OracleHelper.ErrWriter(ex);
            }
            return null;

        }

        public List<UserInfo> GetUserInfo()
        {
            string strSQL = "select * from tuser where sysprivate = '2'";
            try
            {
                List<UserInfo> listUser = new List<UserInfo>();

                OracleHelper oh = new OracleHelper("HAIKOUConnect");
                DataTable dtReturn = oh.ExecuteDataTable(strSQL);
                if (dtReturn != null && dtReturn.Rows.Count > 0)
                {
                    UserInfo info;
                    for (int i = 0; i < dtReturn.Rows.Count; i++)
                    {
                        info = new UserInfo();
                        info.UserName = dtReturn.Rows[i]["USERNAME"].ToString();
                        info.UPassword = dtReturn.Rows[i]["UPASSWORD"].ToString();
                        info.UserType = dtReturn.Rows[i]["sysprivate"].ToString();
                        listUser.Add(info);
                    }
                }
                return listUser;
            }
            catch (Exception ex)
            {
                OracleHelper.ErrWriter(ex);
            }
            return null;
        }


        public List<WelfareForecastInfo> Get12HourForecastInfo(DateTime dt, string areaName)
        {
            List<WelfareForecastInfo> infoList = new List<WelfareForecastInfo>();
            try
            {
                List<List<WelfareForecastInfo>> infoLists = new List<List<WelfareForecastInfo>>();
                infoLists = Get12HourForecastInfos(dt, areaName);
                if (infoLists[0] != null && infoLists[0].Count > 0)
                {
                    for (int i = 0; i < infoLists[0].Count; i++)
                    {
                        infoList.Add(infoLists[0][i]);
                    }
                }
                if (infoLists[1] != null && infoLists[1].Count > 0)
                {
                    for (int i = 0; i < infoLists[1].Count; i++)
                    {
                        infoList.Add(infoLists[1][i]);
                    }
                }
            }
            catch (Exception ex)
            {
                OracleHelper.ErrWriter(ex);
            }
            return infoList;

        }


        public string GetDataMes(DateTime dt, string areaName)
        {
            string DataMes = "";
            try
            {
                List<WelfareForecastInfo> infoList = Get12HourForecastInfo(dt, areaName);
                DataMes = GetDataVerification(infoList);
            }
            catch (Exception)
            {

                throw;
            }
            return DataMes;
        }
        public string GetDataVerification(List<WelfareForecastInfo> infoList)
        {
            string MES = "";
            bool y = false;
            bool T = false;
            bool R = false;
            try
            {
                if (infoList != null && infoList.Count > 0)
                {
                    for (int i = 0; i < infoList.Count; i++)
                    {
                        double MinT = double.Parse(infoList[i].MinTemp.ToString());
                        double MaxT = double.Parse(infoList[i].MaxTemp.ToString());
                        double Rain = double.Parse(infoList[i].Rain.ToString());
                        string Weather = infoList[i].Weather.ToString();
                        if (MinT > MaxT && !T)
                        {
                            MES += "温度数值有误，";
                            y = true;
                            T = true;
                        }
                        if (Rain > 0 && !Weather.Contains("雨") && !R)
                        {
                            MES += "天气状态有误，";
                            y = true;
                            R = true;
                        }
                    }
                    if (y)
                    {
                        MES += "请检查！";
                    }
                }
            }
            catch (Exception ex)
            {
                OracleHelper.ErrWriter(ex);
            }
            return MES;

        }


        //风力级别
        public string GetWindSpeedClassNew(double rain)
        {

            if (rain >= 5.5 && rain < 8.0) return "3-4";
            if (rain >= 8.0 && rain < 10.8) return "4-5";
            if (rain >= 10.8 && rain < 13.9) return "5-6";
            if (rain >= 13.9 && rain < 17.2) return "6-7";
            if (rain >= 17.2 && rain < 20.8) return "7-8";
            if (rain >= 20.8 && rain < 24.5) return "8-9";
            if (rain >= 24.5 && rain < 28.5) return "9-10";
            if (rain >= 28.5 && rain < 32.6) return "10-11";
            if (rain >= 32.6) return "11-12";
            return "≤3";
        }

        //风向
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
                OracleHelper.ErrWriter(ex);
            }
            return strDir;
        }

        /// <summary>
        /// 获取7天预报数据
        /// </summary>
        /// <param name="dt">数据时间</param>
        /// <param name="areaName">地区</param>
        /// <returns></returns>
        public List<List<WelfareForecastInfo>> Get12HourForecastInfos(DateTime dt, string areaName)
        {
            string NewAreaName = areaName;

            List<List<WelfareForecastInfo>> infoList = new List<List<WelfareForecastInfo>> { new List<WelfareForecastInfo>(), new List<WelfareForecastInfo>() };
            try
            {
                #region 获取10天预报第一天的雨量
                string sqlFirst = @"select ddatetime FORECASTTIME,mintemp MINTEMPERATURE,maxtemp MAXTEMPERATURE,rain RAIN,WINDSPEED,WINDDIRECT,weatherpic WEATHERSTATUS,SIXHOURRAINONE,SIXHOURRAINTWO,SIXHOURRAINTHREE,SIXHOURRAINFOUR 
            from LFS_WELFAREFORECAST t where ddatetime = to_date('" + dt.ToString("yyyy-MM-dd HH:mm:ss") + "','yyyy-mm-dd hh24:mi:ss') ";
                OracleHelper oh = new OracleHelper("HAIKOUConnect");
                DataTable dtFirst = oh.ExecuteDataTable(sqlFirst);
                #endregion
                DataTable dTable = null;
                DateTime dtF = dt;
                WelfareForecastInfo info;

                int rowCount = 6;
                DateTime dtStart = DateTime.Parse(dt.ToString("yyyy-MM-dd 8:00"));
                if (dt.Hour == 16 || dt.Hour == 15)
                {
                    dtStart = DateTime.Parse(dt.ToString("yyyy-MM-dd 20:00"));
                    rowCount = 14;
                }
                string strSQL = "";
                if (dt.Hour == 16)
                {
                    strSQL = "select FORECASTTIME,MINTEMPERATURE,MAXTEMPERATURE,RAIN,WINDSPEED,WINDDIRECT,WEATHERSTATUS from lfs_hour12weatherhour where ddatetime = to_date('" + dt.AddHours(-1).ToString("yyyy-MM-dd HH:mm") + "','yyyy-mm-dd hh24:mi') and AREANAME = '" + areaName + "' order by FORECASTTIME";

                }
                else
                {
                    strSQL = "select FORECASTTIME,MINTEMPERATURE,MAXTEMPERATURE,RAIN,WINDSPEED,WINDDIRECT,WEATHERSTATUS from lfs_hour12weatherhour where ddatetime = to_date('" + dt.ToString("yyyy-MM-dd HH:mm") + "','yyyy-mm-dd hh24:mi') and AREANAME = '" + areaName + "' order by FORECASTTIME";

                }
                #region 原方法
                if (areaName != "琼山区")
                {
                    dTable = oh.ExecuteDataTable(strSQL);
                    if (dTable != null && dTable.Rows.Count > 0)
                    {
                        for (int i = 0; i < dTable.Rows.Count; i++)
                        {

                            if (!DateTime.TryParse(dTable.Rows[i]["FORECASTTIME"].ToString(), out dtF)) continue;
                            info = new WelfareForecastInfo();
                            info.ForecastDate = dtF;
                            info.MinTemp = dTable.Rows[i]["MINTEMPERATURE"].ToString();
                            info.MaxTemp = dTable.Rows[i]["MAXTEMPERATURE"].ToString();

                            double dbdata = Convert.ToDouble(dTable.Rows[i]["RAIN"]);
                            if ((dTable.Rows[i]["RAIN"].ToString()).IndexOf(".") > 0)
                                info.Rain = dbdata.ToString("#0.0");//dbdata.ToString("f1");//fN 保留N位，四舍五入
                            else
                                info.Rain = dTable.Rows[i]["RAIN"].ToString();

                            info.WindName = dTable.Rows[i]["WINDSPEED"].ToString();
                            info.WindDirectName = dTable.Rows[i]["WINDDIRECT"].ToString();
                            info.Weather = dTable.Rows[i]["WEATHERSTATUS"].ToString();
                            info.Word = areaName;
                            if (i < 2)
                            {
                                double rain = 0;
                                if (i == 0 && dtFirst.Rows.Count > 0)
                                {
                                    rain = Convert.ToDouble(dtFirst.Rows[0]["SIXHOURRAINONE"].ToString() == "" ? 0 : dtFirst.Rows[0]["SIXHOURRAINONE"]) + Convert.ToDouble(dtFirst.Rows[0]["SIXHOURRAINTWO"].ToString() == "" ? 0 : dtFirst.Rows[0]["SIXHOURRAINTWO"]);
                                    info.Rain = rain.ToString();
                                }
                                if (i == 1 && dtFirst.Rows.Count > 0)
                                {
                                    rain = Convert.ToDouble(dtFirst.Rows[0]["SIXHOURRAINTHREE"].ToString() == "" ? 0 : dtFirst.Rows[0]["SIXHOURRAINTHREE"]) + Convert.ToDouble(dtFirst.Rows[0]["SIXHOURRAINFOUR"].ToString() == "" ? 0 : dtFirst.Rows[0]["SIXHOURRAINFOUR"]);
                                    info.Rain = rain.ToString();
                                }
                                infoList[0].Add(info);
                            }
                            else
                            {
                                infoList[1].Add(info);
                            }
                        }
                    }
                }

                #endregion

                //逐12时格点数据预报获取
                //h 修改为格点预报参考值

                #region 修改为获取格点数据
                if (areaName == "琼山区")
                {
                    //zhou
                    string sql = "";
                    int strval = 0;
                    int endval = 0;
                    if (dt.Hour == 20 || dt.Hour == 8)
                    {
                        sql = string.Format(@"select* from T_HK_NEW_GRID_FORECAST t
                                        where ddatetime = to_date('{0}', 'yyyy-MM-dd hh24:mi:ss') 
                                        and venueid = 161
                                        and ybsx > 0 
                                        order by ybsx", dt.ToString("yyyy-MM-dd HH:mm:00"));
                        strval = 3;
                        endval = 240;
                    }
                    else
                    {
                        sql = string.Format(@"select* from T_HK_NEW_GRID_FORECAST t
                                        where ddatetime = to_date('{0}', 'yyyy-MM-dd hh24:mi:ss') 
                                        and venueid = 161
                                        and ybsx > 2 and ybsx<=74
                                        order by ybsx", dt.ToString("yyyy-MM-dd HH:mm:00"));
                        strval = 3;
                        endval = 74;
                    }

                    OracleHelper ths = new OracleHelper("HAIKOUConnect");
                    dTable = ths.ExecuteDataTable(sql);
                    if (dTable != null && dTable.Rows.Count > 0)
                    {
                        List<List<string>> dic = new List<List<string>>();
                        int num = 0;
                        //7天预报
                        for (int i = strval; i <= endval; i = i + 12)
                        {
                            List<string> list = new List<string>();
                            int Bybsx = i;
                            int Eybsx = (i + 12);

                            //判断传过来的是那个时间段
                            DataTable Dtn;
                            var rownumber = dTable.AsEnumerable().Where<DataRow>(C => Convert.ToInt32(C["YBSX"]) >= Bybsx && Convert.ToInt32(C["YBSX"]) < Eybsx);
                            Dtn = rownumber.CopyToDataTable<DataRow>();

                            //z最高温
                            int MaT = Convert.ToInt32((from Coloumn in Dtn.AsEnumerable()
                                                       select Coloumn.Field<object>("t2m")).Max());
                            //最低温
                            int MiT = Convert.ToInt32((from Coloumn in Dtn.AsEnumerable()
                                                       select Coloumn.Field<object>("t2m")).Min());
                            //雨量值
                            var rain = (from Coloumn in Dtn.AsEnumerable()
                                        select Coloumn.Field<decimal>("rain")).Sum();
                            //风向
                            var WDIR10M = (from Coloumn in Dtn.AsEnumerable()
                                           select Coloumn.Field<object>("WDIR10M")).Max();
                            //风力
                            var WSPD10M = (from Coloumn in Dtn.AsEnumerable()
                                           select Coloumn.Field<object>("WSPD10M")).Max();
                            string windf = getDirect(Convert.ToDouble(WDIR10M));
                            string windl = GetWindSpeedClassNew(Convert.ToDouble(WSPD10M));

                            string time = Dtn.Rows[0]["forecasttime"].ToString();

                            if (i == 12 * 6 + strval)
                                num = 1;
                            else if (i > (12 * 6 + strval))
                                num += 1;

                            if (num > 0)
                            {
                                if (num % 2 == 0)
                                {
                                    time = Convert.ToDateTime(Dtn.Rows[0]["forecasttime"]).ToString("yyyy-MM-dd 08:00");
                                }
                                else
                                {
                                    time = Convert.ToDateTime(Dtn.Rows[0]["forecasttime"]).AddDays(-1).ToString("yyyy-MM-dd 20:00");
                                }
                            }
                            list.Add(time);
                            list.Add(MaT.ToString());
                            list.Add(MiT.ToString());
                            list.Add(windf);
                            list.Add(windl.ToString());
                            list.Add(rain.ToString());
                            dic.Add(list);
                        }
                        for (int i = 0; i < dic.Count; i++)
                        {
                            infoList[0].Add(new WelfareForecastInfo());

                            infoList[0][i].ForecastDate = Convert.ToDateTime(dic[i][0]);

                            infoList[0][i].MinTemp = dic[i][2].ToString();

                            infoList[0][i].MaxTemp = dic[i][1].ToString();

                            double dbdata = Convert.ToDouble(dic[i][5]);
                            if ((dic[i][5]).IndexOf(".") > 0)
                                infoList[0][i].Rain = dbdata.ToString("#0.0");//dbdata.ToString("f1");//fN 保留N位，四舍五入
                            else
                                infoList[0][i].Rain = dic[i][5];
                            infoList[0][i].WindName = dic[i][4].ToString();//风速
                            infoList[0][i].WindDirectName = dic[i][3].ToString();//风向
                            infoList[0][i].Weather = "晴";
                            if (Convert.ToDouble(dic[i][5]) > 0.05 && Convert.ToDouble(dic[i][5]) <= 1)
                            {
                                infoList[0][i].Weather = "小雨";//多云
                            }
                            else if (Convert.ToDouble(dic[i][5]) > 1 && Convert.ToDouble(dic[i][5]) <= 30)
                            {
                                infoList[0][i].Weather = "阵雨";
                            }
                            else if (Convert.ToDouble(dic[i][5]) > 30)
                            {
                                infoList[0][i].Weather = "雷阵雨";
                            }
                        }
                    }
                    else
                    {
                        int Max = 14;
                        if (dt.Hour == 6)
                            Max = 6;
                        //初始数据
                        for (int i = 0; i < Max; i++)
                        {
                            infoList[0].Add(new WelfareForecastInfo());
                            infoList[0][i].Word = "初始数据";
                            infoList[0][i].ForecastDate = Convert.ToDateTime(dtStart);
                            infoList[0][i].MinTemp = "25";
                            infoList[0][i].MaxTemp = "30";
                            infoList[0][i].Rain = "0";
                            infoList[0][i].WindName = "≤3";//风速
                            infoList[0][i].WindDirectName = "无";//风向
                            infoList[0][i].Weather = "晴";
                            dtStart = dtStart.AddHours(12);
                        }
                    }
                }
                #endregion
                //e---
                if (infoList[0].Count == 0 && infoList[1].Count == 0)
                {

                    dtF = dt;
                    if (dt.Hour == 10 || dt.Hour == 15)
                    {
                        dtF = dt.AddHours(1);
                    }
                    //分区预报数据汇总
                    strSQL = "select max(TEMPERATURE) MaxTemp,min(TEMPERATURE) MinTemp from LFS_AREAWEATHERHOUR where ddatetime = to_date('" + dtF.ToString("yyyy-MM-dd HH:mm") + "','yyyy-mm-dd hh24:mi') and AREANAME = '" + NewAreaName + "' and FORECASTTIME between to_date('" + dtStart.ToString("yyyy-MM-dd HH:mm") + "','yyyy-mm-dd hh24:mi') and to_date('" + dtStart.AddHours(24).ToString("yyyy-MM-dd HH:mm") + "','yyyy-mm-dd hh24:mi')";
                    oh = new OracleHelper("HAIKOUConnect");
                    dTable = oh.ExecuteDataTable(strSQL);
                    string minT = "5";
                    string maxT = "35";
                    if (dTable == null || dTable.Rows.Count == 0 || Convert.IsDBNull(dTable.Rows[0]["MaxTemp"]))
                    {
                        switch (dt.Hour)
                        {
                            case 6:
                                dtF = DateTime.Parse(dt.AddDays(-1).ToString("yyyy-MM-dd 16:00"));
                                break;
                            case 8:
                                dtF = DateTime.Parse(dt.ToString("yyyy-MM-dd 8:00"));//xgq修改
                                break;
                            case 15:
                                dtF = DateTime.Parse(dt.ToString("yyyy-MM-dd 11:00"));
                                break;
                            case 20:
                                dtF = DateTime.Parse(dt.ToString("yyyy-MM-dd 20:00"));//xgq修改
                                break;
                        }
                        strSQL = "select max(TEMPERATURE) MaxTemp,min(TEMPERATURE) MinTemp from LFS_AREAWEATHERHOUR where ddatetime = to_date('" + dtF.ToString("yyyy-MM-dd HH:mm") + "','yyyy-mm-dd hh24:mi') and AREANAME = '" + NewAreaName + "' and FORECASTTIME between to_date('" + dtStart.ToString("yyyy-MM-dd HH:mm") + "','yyyy-mm-dd hh24:mi') and to_date('" + dtStart.AddHours(24).ToString("yyyy-MM-dd HH:mm") + "','yyyy-mm-dd hh24:mi')";
                        oh = new OracleHelper("HAIKOUConnect");
                        dTable = oh.ExecuteDataTable(strSQL);

                    }
                    if (dTable != null && dTable.Rows.Count > 0 && !Convert.IsDBNull(dTable.Rows[0]["MaxTemp"]))
                    {
                        minT = dTable.Rows[0]["MinTemp"].ToString();
                        maxT = dTable.Rows[0]["MaxTemp"].ToString();
                    }
                    strSQL = "select sum(RAIN) Rain from LFS_AREAWEATHERHOUR where ddatetime = to_date('" + dtF.ToString("yyyy-MM-dd HH:mm") + "','yyyy-mm-dd hh24:mi') and AREANAME = '" + NewAreaName + "' and FORECASTTIME between to_date('" + dtStart.ToString("yyyy-MM-dd HH:mm") + "','yyyy-mm-dd hh24:mi') and to_date('" + dtStart.AddHours(12).ToString("yyyy-MM-dd HH:mm") + "','yyyy-mm-dd hh24:mi')";
                    oh = new OracleHelper("HAIKOUConnect");
                    dTable = oh.ExecuteDataTable(strSQL);
                    double maxRain = 0;

                    if (dTable != null && dTable.Rows.Count > 0 && !Convert.IsDBNull(dTable.Rows[0]["Rain"]))
                    {
                        infoList[0].Add(new WelfareForecastInfo());
                        infoList[0][0].ForecastDate = dtStart;
                        infoList[0][0].Rain = dTable.Rows[0]["Rain"].ToString();
                        infoList[0][0].WindName = "≤3";
                        infoList[0][0].WindDirectName = "无";
                        infoList[0][0].Weather = "多云";

                        maxRain = 0;
                        if (double.TryParse(infoList[0][0].Rain, out maxRain))
                        {
                            if (maxRain > 1 && maxRain <= 10)
                            {
                                infoList[0][0].Weather = "小雨";
                            }
                            else if (maxRain > 10 && maxRain <= 30)
                            {
                                infoList[0][0].Weather = "中雨";
                            }
                            else if (maxRain > 30)
                            {
                                infoList[0][0].Weather = "大雨";
                            }
                        }
                        infoList[0][0].MinTemp = minT;
                        infoList[0][0].MaxTemp = maxT;
                        infoList[0][0].Word = areaName;
                    }

                    strSQL = "select sum(RAIN) Rain from LFS_AREAWEATHERHOUR where ddatetime = to_date('" + dtF.ToString("yyyy-MM-dd HH:mm") + "','yyyy-mm-dd hh24:mi') and AREANAME = '" + NewAreaName + "' and FORECASTTIME > to_date('" + dtStart.AddHours(12).ToString("yyyy-MM-dd HH:mm") + "','yyyy-mm-dd hh24:mi')";
                    oh = new OracleHelper("HAIKOUConnect");
                    dTable = oh.ExecuteDataTable(strSQL);

                    if (dTable != null && dTable.Rows.Count > 0 && !Convert.IsDBNull(dTable.Rows[0]["Rain"]))
                    {
                        infoList[0].Add(new WelfareForecastInfo());
                        infoList[0][1].ForecastDate = dtStart.AddHours(12);
                        infoList[0][1].Rain = dTable.Rows[0]["Rain"].ToString();
                        infoList[0][1].WindName = "≤3";
                        infoList[0][1].WindDirectName = "无";
                        infoList[0][1].Weather = "多云";
                        maxRain = 0;
                        if (double.TryParse(infoList[0][1].Rain, out maxRain))
                        {
                            if (maxRain > 1 && maxRain <= 10)
                            {
                                infoList[0][1].Weather = "小雨";
                            }
                            else if (maxRain > 10 && maxRain <= 30)
                            {
                                infoList[0][1].Weather = "中雨";
                            }
                            else if (maxRain > 30)
                            {
                                infoList[0][1].Weather = "大雨";
                            }
                        }
                        infoList[0][1].MinTemp = minT;
                        infoList[0][1].MaxTemp = maxT;
                        infoList[0][1].Word = areaName;
                    }
                    //10天预报
                    dtF = dt;
                    if (dt.Hour == 10 || dt.Hour == 15)
                    {
                        dtF = dt.AddHours(1);
                    }
                    List<WelfareForecastInfo> dayList = GetWelfareForecastDaysInfo(dtF);
                    bool daylistbool = false;
                    if (dayList == null)
                    {
                        switch (dt.Hour)
                        {
                            case 6:
                                dtF = DateTime.Parse(dt.AddDays(-1).ToString("yyyy-MM-dd 16:00"));
                                break;
                            case 8:
                                dtF = DateTime.Parse(dt.ToString("yyyy-MM-dd 8:00"));
                                break;
                            case 15:
                                dtF = DateTime.Parse(dt.ToString("yyyy-MM-dd 11:00"));
                                break;
                            case 20:
                                dtF = DateTime.Parse(dt.ToString("yyyy-MM-dd 20:00"));
                                break;
                        }
                        dayList = GetWelfareForecastDaysInfo(dtF);
                        daylistbool = true;
                    }
                    if (dayList != null)
                    {
                        for (int i = 0; i < dayList.Count && i < (rowCount / 2 - 1); i++)
                        {
                            int k = i;
                            DateTime dtime = dtStart.AddHours(24);
                            if (dtime.Hour == 20) dtime = dtime.AddDays(1);
                            if (dtime.Date != dayList[0].ForecastDate) //对比欧洲中心和逐12时的第一天的时间是否相等
                            {
                                if (daylistbool && (i + 1) < dayList.Count) k = i + 1;
                            }
                            string WindName = dayList[k].WindName;
                            if (!string.IsNullOrEmpty(WindName))
                            {
                                WindName += "-";
                            }
                            WindName += dayList[k].WindGust;
                            if (string.IsNullOrEmpty(WindName)) WindName = "≤3";

                            string WindDirectName = dayList[k].WindDirectName;
                            if (string.IsNullOrEmpty(WindDirectName))
                            {
                                WindDirectName = "无";
                            }

                            for (int j = 0; j < 2; j++)
                            {

                                infoList[1].Add(new WelfareForecastInfo());
                                infoList[1][i * 2 + j].ForecastDate = dtStart.AddHours(((i + 1) * 2 + j) * 12);
                                infoList[1][i * 2 + j].Rain = "0";
                                infoList[1][i * 2 + j].WindName = WindName;
                                infoList[1][i * 2 + j].WindDirectName = WindDirectName;
                                infoList[1][i * 2 + j].Weather = dayList[k].Weather;
                                infoList[1][i * 2 + j].MinTemp = dayList[k].MinTemp;
                                infoList[1][i * 2 + j].MaxTemp = dayList[k].MaxTemp;
                                infoList[1][i * 2 + j].Word = areaName;
                            }
                        }
                    }
                }
                if (infoList[0].Count == 1)
                {
                    dtF = infoList[0].Max(pkg => pkg.ForecastDate);
                    dtF = dtF.AddHours(12);
                    info = new WelfareForecastInfo();
                    info.ForecastDate = dtF;
                    info.Rain = "0";
                    info.WindName = "≤3";
                    info.WindDirectName = "无";
                    info.Weather = infoList[0][0].Weather;
                    info.MinTemp = infoList[0][0].MinTemp;
                    info.MaxTemp = infoList[0][0].MaxTemp;
                    info.Word = areaName;
                    infoList[0].Add(info);
                }

                DateTime dtPre = dt;
                int startI = 1;
                int endI = 14;
                switch (dt.Hour)
                {
                    case 6:
                        startI = 1;
                        endI = 7;
                        dtPre = DateTime.Parse(dt.AddDays(-1).ToString("yyyy-MM-dd 16:00"));
                        break;
                    case 8:
                        startI = 0;
                        endI = 6;
                        dtPre = DateTime.Parse(dt.ToString("yyyy-MM-dd 8:00"));
                        break;
                    case 15:
                        startI = 1;
                        endI = 15;
                        dtPre = DateTime.Parse(dt.ToString("yyyy-MM-dd 10:00"));
                        break;
                    case 20:
                        startI = 1;
                        endI = 15;
                        dtPre = DateTime.Parse(dt.ToString("yyyy-MM-dd 20:00"));
                        break;
                }

                if (infoList[0].Count == 0 && infoList[1].Count == 0)
                {
                    //取逐时预报 
                    strSQL = "select * from lfs_hour12weatherhour where ddatetime = to_date('" + dtPre.ToString("yyyy-MM-dd HH:mm") + "','yyyy-mm-dd hh24:mi') and AREANAME = '" + areaName + "' order by FORECASTTIME";
                    oh = new OracleHelper("HAIKOUConnect");
                    dTable = oh.ExecuteDataTable(strSQL);
                    if (dTable != null && dTable.Rows.Count > 0)
                    {
                        for (int i = startI; i < dTable.Rows.Count && i < endI; i++)
                        {

                            if (!DateTime.TryParse(dTable.Rows[i]["FORECASTTIME"].ToString(), out dtF)) continue;
                            info = new WelfareForecastInfo();
                            info.ForecastDate = dtF;
                            info.MinTemp = dTable.Rows[i]["MINTEMPERATURE"].ToString();
                            info.MaxTemp = dTable.Rows[i]["MAXTEMPERATURE"].ToString();
                            info.Rain = dTable.Rows[i]["RAIN"].ToString();
                            info.WindName = dTable.Rows[i]["WINDSPEED"].ToString();
                            info.WindDirectName = dTable.Rows[i]["WINDDIRECT"].ToString();
                            info.Weather = dTable.Rows[i]["WEATHERSTATUS"].ToString();
                            info.Word = areaName;
                            if (i < startI + 2) infoList[0].Add(info);
                            else infoList[1].Add(info);
                        }
                    }
                    else
                    {
                        infoList = GetNullData(infoList, startI, endI, dtStart, areaName);
                    }
                    if (dt.Hour == 15 || dt.Hour == 16)
                    {
                        List<WelfareForecastInfo> dayList = GetWelfareForecastDaysInfo(dtPre.AddHours(1));

                        if (dayList != null)
                        {
                            string WindName = dayList[0].WindName;
                            if (!string.IsNullOrEmpty(WindName))
                            {
                                WindName += "-";
                            }
                            WindName += dayList[0].WindGust;
                            if (string.IsNullOrEmpty(WindName)) WindName = "≤3";

                            string WindDirectName = dayList[0].WindDirectName;
                            if (string.IsNullOrEmpty(WindDirectName))
                            {
                                WindDirectName = "无";
                            }

                            dtF = infoList[1].Max(pkg => pkg.ForecastDate);
                            dtF = dtF.AddHours(12);
                            info = new WelfareForecastInfo();
                            info.ForecastDate = dtF;
                            info.Rain = "0";
                            info.WindName = WindName;
                            info.WindDirectName = WindDirectName;
                            info.Weather = dayList[0].Weather;
                            info.MinTemp = dayList[0].MinTemp;
                            info.MaxTemp = dayList[0].MaxTemp;
                            info.Word = areaName;
                            infoList[1].Add(info);
                            for (int i = 1; i < dayList.Count && infoList[1].Count < rowCount - 2; i++)
                            {
                                WindName = dayList[i].WindName;
                                if (!string.IsNullOrEmpty(WindName))
                                {
                                    WindName += "-";
                                }
                                WindName += dayList[i].WindGust;
                                if (string.IsNullOrEmpty(WindName)) WindName = "≤3";

                                WindDirectName = dayList[i].WindDirectName;
                                if (string.IsNullOrEmpty(WindDirectName))
                                {
                                    WindDirectName = "无";
                                }
                                for (int j = 0; j < 2; j++)
                                {
                                    dtF = dtF.AddHours(12);
                                    info = new WelfareForecastInfo();
                                    info.ForecastDate = dtF;
                                    info.Rain = "0";
                                    info.WindName = WindName;
                                    info.WindDirectName = WindDirectName;
                                    info.Weather = dayList[i].Weather;
                                    info.MinTemp = dayList[i].MinTemp;
                                    info.MaxTemp = dayList[i].MaxTemp;
                                    info.Word = areaName;
                                    infoList[1].Add(info);
                                }
                            }
                        }
                    }
                }
                if (infoList[1].Count == rowCount - 3)
                {
                    dtF = infoList[1].Max(pkg => pkg.ForecastDate);
                    dtF = dtF.AddHours(12);
                    info = new WelfareForecastInfo();
                    info.ForecastDate = dtF;
                    info.Rain = "0";
                    info.WindName = "≤3";
                    info.WindDirectName = "无";
                    info.Weather = infoList[1][rowCount - 4].Weather;
                    info.MinTemp = infoList[1][rowCount - 4].MinTemp;
                    info.MaxTemp = infoList[1][rowCount - 4].MaxTemp;
                    info.Word = areaName;
                    infoList[1].Add(info);
                }
                if (infoList[1].Count > 0)
                {
                    foreach (WelfareForecastInfo infoNew in infoList[1])
                    {
                        infoNew.Weather = GetHour12Weather(infoNew.Weather);
                    }
                }
                double d0 = 0;
                foreach (var item in infoList)
                {
                    foreach (var item2 in item)
                    {
                        if (item2.WindName.IndexOf("-") != -1)
                        {
                            d0 = 0;
                            string[] wns = item2.WindName.Split(new string[] { "-" }, StringSplitOptions.RemoveEmptyEntries);
                            double.TryParse(wns[1], out d0);
                            if (d0 <= 3)
                            {
                                item2.WindDirectName = "无";
                                item2.WindName = "≤3";
                            }
                        }
                        else
                        {
                            if (item2.WindName.Equals("≤3"))
                            {
                                item2.WindDirectName = "无";
                            }
                            else
                            {
                                if (double.TryParse(item2.WindName, out d0))
                                {
                                    if (d0 <= 3)
                                        item2.WindDirectName = "无";
                                }
                            }
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                OracleHelper.ErrWriter(ex);
            }
            return infoList;
        }
        /// <summary>
        /// 填充暂无数据时数据
        /// </summary>
        /// <param name="infoList"></param>
        /// <param name="startI"></param>
        /// <param name="endI"></param>
        /// <param name="dtStart"></param>
        /// <param name="areaName"></param>
        /// <returns></returns>
        public List<List<WelfareForecastInfo>> GetNullData(List<List<WelfareForecastInfo>> infoList, int startI, int endI, DateTime dtStart, string areaName)
        {
            List<List<WelfareForecastInfo>> infoListS = new List<List<WelfareForecastInfo>> { new List<WelfareForecastInfo>(), new List<WelfareForecastInfo>() };

            try
            {
                if (infoList[0].Count == 0)
                {
                    for (int i = startI; i < endI; i++)
                    {
                        WelfareForecastInfo info = new WelfareForecastInfo();
                        info.ForecastDate = dtStart;
                        info.MinTemp = "25";
                        info.MaxTemp = "30";
                        info.Rain = "0";
                        info.WindName = "≤3";
                        info.WindDirectName = "无";
                        info.Weather = "晴";
                        info.Word = areaName;
                        if (i < startI + 2) { infoListS[0].Add(info); dtStart = dtStart.AddHours(12); } else break;
                    }
                }
                if (infoList[1].Count == 0)
                {
                    for (int i = startI; i < endI; i++)
                    {
                        WelfareForecastInfo info = new WelfareForecastInfo();
                        info.ForecastDate = dtStart;
                        info.MinTemp = "25";
                        info.MaxTemp = "30";
                        info.Rain = "0";
                        info.WindName = "≤3";
                        info.WindDirectName = "无";
                        info.Weather = "晴";
                        info.Word = areaName;

                        if (i < startI + 2) { }
                        else { infoListS[1].Add(info); dtStart = dtStart.AddHours(12); }
                    }
                }
            }
            catch (Exception)
            {
                throw;
            }
            return infoListS;
        }


        /// <summary>
        /// 获取天气
        /// </summary>
        /// <param name="weather"></param>
        /// <returns></returns>
        public string GetHour12Weather(string weather)
        {
            try
            {
                string strSQL = "select ITEMVALUE from LFS_HOUR12CODE where TYPENAME='天气' order by recid desc";
                OracleHelper oh = new OracleHelper("EJETDB247LFSData");
                DataTable dtWeather = oh.ExecuteDataTable(strSQL);
                if (dtWeather != null && dtWeather.Rows.Count > 0)
                {
                    string strKey = "";
                    for (int i = 0; i < dtWeather.Rows.Count; i++)
                    {
                        strKey = dtWeather.Rows[i]["ITEMVALUE"].ToString();
                        if (weather.Contains(strKey))
                        {
                            return strKey;

                        }
                    }
                }
            }
            catch (Exception ex)
            {
                OracleHelper.ErrWriter(ex);
            }
            return "晴";
        }


        /// <summary>
        /// 获取10天预报数据
        /// </summary>
        /// <param name="dt"></param>
        /// <returns></returns>
        public List<WelfareForecastInfo> GetWelfareForecastDaysInfo(DateTime dt)
        {
            try
            {
                List<WelfareForecastInfo> infoList = null;

                DateTime dtF;
                string strSQL = "select * from LFS_WELFAREFORECASTDAYS where  ddatetime = to_date('" + dt.ToString("yyyy-MM-dd HH:mm") + "','yyyy-mm-dd hh24:mi') order by FORECASTDATE";
                OracleHelper oh = new OracleHelper("HAIKOUConnect");
                DataTable ds = oh.ExecuteDataTable(strSQL);
                if (ds != null && ds.Rows.Count > 0)
                {
                    infoList = new List<WelfareForecastInfo>();
                    for (int i = 0; i < ds.Rows.Count; i++)
                    {
                        infoList.Add(new WelfareForecastInfo());
                        infoList[i].DDatetime = dt;
                        dtF = dt;
                        DateTime.TryParse(ds.Rows[i]["FORECASTDATE"].ToString(), out dtF);
                        infoList[i].ForecastDate = dtF;
                        infoList[i].MinTemp = ds.Rows[i]["MINTEMP"].ToString();
                        infoList[i].MaxTemp = ds.Rows[i]["MAXTEMP"].ToString();
                        infoList[i].WeatherIcon = ds.Rows[i]["WEATHERPIC"].ToString();
                        infoList[i].WeatherIcon2 = ds.Rows[i]["WEATHERPIC2"].ToString();
                        infoList[i].Weather = ds.Rows[i]["WEATHER"].ToString();
                        infoList[i].WindName = ds.Rows[i]["MinWind"].ToString();
                        infoList[i].WindGust = ds.Rows[i]["MaxWind"].ToString();
                        infoList[i].WindDirectName = ds.Rows[i]["WINDDIRECT"].ToString();
                        infoList[i].Humidity = ds.Rows[i]["MINHUMIDITY"].ToString();
                        infoList[i].MaxHumidity = ds.Rows[i]["MaxHUMIDITY"].ToString();
                        infoList[i].Rain = ds.Rows[i]["RAIN"].ToString();
                        infoList[i].WEATHEREN = ds.Rows[i]["WEATHEREN"].ToString();

                    }
                    return infoList;
                }
            }
            catch (Exception ex)
            {
                OracleHelper.ErrWriter(ex);
            }
            return null;
        }

        #region  当前值班人员

        /// <summary>
        /// 取值班员
        /// </summary>
        /// <param name="flagIndexs">制作类型</param>
        /// <param name="time">发布时间</param>
        /// <returns>签发人</returns>
        public string GetWarnWriter(string type, DateTime time)
        {
            try
            {
                DateTime dt1 = new DateTime(time.Year, time.Month, time.Day, 9, 0, 0);
                DateTime dt2 = new DateTime();
                string strShouXi = "夜间领班";
                if (type.Equals("10天预报"))
                {
                    dt1 = new DateTime(time.Year, time.Month, time.Day, 8, 30, 0);
                    dt2 = new DateTime(time.Year, time.Month, time.Day, 17, 00, 0);
                    if (time < dt1)
                    {
                        strShouXi = "夜间领班";
                        time = time.AddDays(-1);
                    }
                    if (time >= dt1 && time < dt2)
                    {
                        strShouXi = "白天领班";
                    }
                    return GetWatchUser(time, strShouXi);
                }
                else if (type.Equals("分区预报") || type.Equals("上下班预报") || type.Equals("逐12时预报"))
                {
                    dt1 = new DateTime(time.Year, time.Month, time.Day, 8, 30, 0);
                    dt2 = new DateTime(time.Year, time.Month, time.Day, 17, 00, 0);
                    if (time < dt1)
                    {
                        strShouXi = "夜间领班";
                        time = time.AddDays(-1);
                    }
                    if (time >= dt1 && time < dt2)
                    {
                        strShouXi = "短临";
                    }
                    if (time > dt2)
                    {
                        strShouXi = "夜间领班";
                    }
                    return GetWatchUser(time, strShouXi);
                }

            }
            catch (Exception ex)
            {

                OracleHelper.ErrWriter(ex);
            }
            return "";
        }

        /// <summary>
        /// 得到值班人员的名称
        /// </summary>
        /// <param name="time">时间</param>
        /// <param name="groupName">类型</param>
        /// <returns></returns>
        public string GetWatchUser(DateTime time, string groupName)
        {
            string dtReturn = "";
            try
            {
                string sql = @"select distinct t7.cname 
from (select * from jnyb.schd_schedule t where t.expired = '0' and to_char(t.first_date, 'yyyy-MM') = to_char(sysdate,'yyyy-MM')) t1 
left join jnyb.schd_daily_schedule t2 on t1.id = t2.schedule_id
left join jnyb.schd_schedule_detail t3 on t2.id = t3.daily_schedule_id
left join jnyb.schd_detail_staff t4 on t4.detail_id = t3.id
left join jnyb.schd_shift t5 on t3.shift_id = t5.id
left join jnyb.schd_staff t6 on t4.staff_id = t6.id
left join jnyb.l_users t7 on t6.user_id = t7.luid 
where t2.schedule_date =  to_date('" + time.ToString("yyyy-MM-dd") + @"','yyyy-mm-dd') and
t5.name = '" + groupName + "'";
                OracleHelper oh = new OracleHelper("EJETDB247IDCTY");
                dtReturn = oh.db_GreateQuery(sql);

            }
            catch (Exception ex)
            {
                OracleHelper.ErrWriter(ex);
            }
            return dtReturn;
        }


        #endregion

        #region 历史上网文件查询
        public List<ScoreInfo> GetHour12InfoList(string Strdt, string Strdt2, int Max, int Min)
        {
            DateTime dt = DateTime.Parse(Strdt + " 0:00:00");
            DateTime dt2 = DateTime.Parse(Strdt2 + " 23:59:59");
            List<ScoreInfo> infoList = new List<ScoreInfo>();
            DateTime dtF = DateTime.Parse("2001-1-1");
            try
            {
                string strSQL = "select * from (select a.*, ROWNUM rn from( select * from lfs_hour12weather  where ddatetime between to_date('" + dt.ToString("yyyy-MM-dd HH:mm") + "','yyyy-mm-dd hh24:mi') and  to_date('" + dt2.ToString("yyyy-MM-dd HH:mm") + "','yyyy-mm-dd hh24:mi') order by recid desc) a  WHERE ROWNUM <= " + Max + ") WHERE rn >= " + Min;

                OracleHelper oh = new OracleHelper("HAIKOUConnect");
                DataTable dTable = oh.ExecuteDataTable(strSQL);
                if (dTable != null && dTable.Rows.Count > 0)
                {
                    ScoreInfo info;
                    int isEdit = 0;

                    for (int i = 0; i < dTable.Rows.Count; i++)
                    {
                        info = new ScoreInfo();
                        info.ScoreName = dTable.Rows[i]["ddatetime"].ToString();
                        if (!DateTime.TryParse(info.ScoreName, out dtF)) continue;
                        info.Ddatetime = dtF;
                        isEdit = 0;
                        int.TryParse(dTable.Rows[i]["ISEDIT"].ToString(), out isEdit);
                        if (isEdit == 0)
                        {
                            info.Score1 = "正常预报";
                        }
                        else
                        {
                            info.Score1 = "预报订正";
                        }
                        info.Score3 = dTable.Rows[i]["WRITETIME"].ToString();
                        info.Score7 = dTable.Rows[i]["FORECASTER"].ToString();

                        if (!Convert.IsDBNull(dTable.Rows[i]["PUSHTIME"]))
                        {
                            info.Score4 = dTable.Rows[i]["PUSHTIME"].ToString();

                        }
                        info.Score6 = "False";
                        if (!Convert.IsDBNull(dTable.Rows[i]["FILENAME"]))
                        {
                            info.Score5 = dtF.ToString("yyyyMMdd") + "/" + dTable.Rows[i]["FILENAME"].ToString();
                            info.Score6 = "True";
                        }
                        if (!Convert.IsDBNull(dTable.Rows[i]["PUSHTIME2"]))
                        {
                            info.Score8 = dTable.Rows[i]["PUSHTIME2"].ToString();
                        }
                        info.Score12 = "False";
                        if (!Convert.IsDBNull(dTable.Rows[i]["FILENAME2"]))
                        {
                            info.Score11 = dtF.ToString("yyyyMMdd") + "/" + dTable.Rows[i]["FILENAME2"].ToString();
                            info.Score12 = "True";
                        }
                        if (!Convert.IsDBNull(dTable.Rows[i]["PUSHTIME3"]))
                        {
                            info.Score2 = dTable.Rows[i]["PUSHTIME3"].ToString();
                        }
                        info.Score13 = "False";
                        if (!Convert.IsDBNull(dTable.Rows[i]["FILENAME3"]))
                        {
                            info.Score14 = "Hour12Area/" + dtF.ToString("yyyyMMdd") + "/" + dTable.Rows[i]["FILENAME3"].ToString();
                            info.Score13 = "True";
                        }
                        info.Score15 = "False";
                        if (!Convert.IsDBNull(dTable.Rows[i]["FILENAME4"]))
                        {
                            info.Score16 = "Hour12Area/" + dtF.ToString("yyyyMMdd") + "/" + dTable.Rows[i]["FILENAME4"].ToString();
                            info.Score15 = "True";
                        }
                        if (!Convert.IsDBNull(dTable.Rows[i]["PUSHTIME4"]))
                        {
                            info.Score17 = dTable.Rows[i]["PUSHTIME4"].ToString();
                        }
                        info.Score10 = dTable.Rows[i]["ISUSER"].ToString();
                        info.Score9 = dTable.Rows[i]["ISCOMPANY"].ToString();
                        if (info.Score9 == "1") info.Score9 = "是"; else info.Score9 = "否";
                        if (info.Score10 == "1") info.Score10 = "是"; else info.Score10 = "否";
                        infoList.Add(info);
                    }
                }

                strSQL = "select * from (select a.*, ROWNUM rn from(select PUSH3,PUSH3TIME,PUSH3NAME,ddatetime from T_HK_GRID_FORECASTSTATUS  where ddatetime between to_date('" + dt.ToString("yyyy-MM-dd HH:mm") + "','yyyy-mm-dd hh24:mi') and  to_date('" + dt2.ToString("yyyy-MM-dd HH:mm") + "','yyyy-mm-dd hh24:mi')) a  WHERE ROWNUM <= " + Max + ") WHERE rn >= " + Min;
                oh = new OracleHelper("HAIKOUConnect");
                dTable = oh.ExecuteDataTable(strSQL);
                if (dTable != null && dTable.Rows.Count > 0)
                {
                    foreach (DataRow item in dTable.Rows)
                    {
                        if (!DateTime.TryParse(item["ddatetime"].ToString(), out dtF)) continue;
                        var var_ls = infoList.Where(a => a.Ddatetime == dtF);
                        foreach (var var_ls_item in var_ls)
                        {
                            if (item["PUSH3"].ToString().Equals("1"))
                            {
                                var_ls_item.Score15 = "True";
                                var_ls_item.Score16 = dtF.ToString("yyyyMMdd") + "/" + item["PUSH3NAME"].ToString();
                                var_ls_item.Score17 = item["PUSH3TIME"].ToString();
                            }
                        }
                    }
                }
                return infoList;
            }
            catch (Exception ex)
            {
                OracleHelper.ErrWriter(ex);
            }
            return null;
        }
        /// <summary>
        /// 获取此时间段中的总条数
        /// </summary>
        /// <param name="Strdt"></param>
        /// <param name="Strdt2"></param>
        /// <returns></returns>
        public int GetHour12InfoListCount(string Strdt, string Strdt2)
        {
            int counts = 23;
            DateTime dt = DateTime.Parse(Strdt + " 0:00:00");
            DateTime dt2 = DateTime.Parse(Strdt2 + " 23:59:59");
            try
            {
                string strSQL = "select count(*) from lfs_hour12weather  where ddatetime between to_date('" + dt.ToString("yyyy-MM-dd HH:mm") + "','yyyy-mm-dd hh24:mi') and  to_date('" + dt2.ToString("yyyy-MM-dd HH:mm") + "','yyyy-mm-dd hh24:mi') order by recid desc";
                OracleHelper oh = new OracleHelper("EJETDB247LFSData");
                string strRecID = oh.db_GreateQuery(strSQL);
                int.TryParse(strRecID, out counts);
            }
            catch (Exception ee)
            {
                OracleHelper.ErrWriter(ee);
            }
            return counts;
        }


        #endregion

        #region 保存全市预报（目前只有琼山区）

        /// <summary>
        /// 获取全市信息
        /// </summary>
        /// <param name="dt"></param>
        /// <param name="hourInfo"></param>
        /// <param name="dayInfo"></param>
        public void GetAll12HourForecastInfos(DateTime dt, out List<List<WelfareForecastInfo>> hourInfo, out List<List<WelfareForecastInfo>> dayInfo)
        {
            hourInfo = new List<List<WelfareForecastInfo>>();
            dayInfo = new List<List<WelfareForecastInfo>>();
            string arname = "琼山区";
            List<List<WelfareForecastInfo>> LstAll = Get12HourForecastInfos(dt, arname);
            if (LstAll != null && LstAll.Count > 0)
            {
                hourInfo.Add(LstAll[0]);
                dayInfo.Add(LstAll[1]);
            }
            else
            {
                hourInfo = null;
                dayInfo = null;
            }
        }


        public bool InsertHour12WeatherInfo(DateTime dt, string strForecaster, int isUser, int isCompany, int isCorrect, List<List<WelfareForecastInfo>> hourInfo)
        {
            try
            {
                if (hourInfo != null && hourInfo.Count > 0)
                {
                    return InsertHour12WeatherInfoS(dt, hourInfo, strForecaster, isUser, isCompany, isCorrect);
                }
            }
            catch (Exception ex)
            {
                OracleHelper.ErrWriter(ex);
            }
            return false;
        }


        public List<List<List<WelfareForecastInfo>>> GetInfoAll(DateTime dt)
        {
            List<List<List<WelfareForecastInfo>>> InfoAll = new List<List<List<WelfareForecastInfo>>>();
            try
            {
                List<List<WelfareForecastInfo>> hourInfo = null;
                List<List<WelfareForecastInfo>> dayInfo = null;
                GetAll12HourForecastInfos(dt, out hourInfo, out dayInfo);
                if (hourInfo != null && hourInfo.Count > 0 && dayInfo != null && dayInfo.Count > 0)
                {
                    InfoAll.Add(hourInfo);
                    InfoAll.Add(dayInfo);
                    return InfoAll;
                }
            }
            catch (Exception)
            {
                throw;
            }
            return null;
        }


        public bool InsertHour12WeatherInfoS(DateTime dt, List<List<WelfareForecastInfo>> hourInfo, string strForecaster, int isUser, int isCompany, int isCorrect)
        {
            try
            {
                if (hourInfo.Count < 1 && dt.Hour != 15)
                    return false;
                string strSQL = "";
                string strRecID = "";
                int iResult = 0;
                int isEdit = 0;//是否订正
                int CORRECTREC = 0;//订正记录次数
                strSQL = "select recid,CORRECTREC from lfs_hour12weather where DDATETIME=to_date('" + dt.ToString("dd-MM-yyyy HH:mm:ss") + "', 'dd-mm-yyyy hh24:mi:ss') order by recid desc";
                OracleHelper oh = new OracleHelper("HAIKOUConnect");
                DataTable table_rec = oh.ExecuteDataTable(strSQL);
                if (table_rec != null && table_rec.Rows.Count > 0)
                {
                    isEdit = 1;
                    int.TryParse(table_rec.Rows[0]["CORRECTREC"].ToString(), out CORRECTREC);
                }
                string windCode;
                string directCode;
                string weatherCode;
                WelfareForecastInfo welfareInfo;
                int indexFT = 0;
                for (int i = 0; i < hourInfo.Count; i++)
                {

                    if (hourInfo[i].Count > 0 && hourInfo[i][0].Word == "琼山区")
                    {
                        indexFT = i;
                        break;
                    }
                }
                if (hourInfo[indexFT].Count < 2)
                    return false;
                List<List<WelfareForecastInfo>> dataInfoList = new List<List<WelfareForecastInfo>>();
                if (dt.Hour != 15)
                {
                    List<OBTRealInfo> areaInfoList = GetAreaInfo();
                    if (areaInfoList == null || areaInfoList.Count < 0)
                        return false;
                    int indexArea = 0;
                    for (int i = 0; i < areaInfoList.Count; i++)
                    {
                        string areaName = areaInfoList[i].Name;
                        dataInfoList.Add(new List<WelfareForecastInfo>());
                        indexArea = indexFT;
                        for (int j = 0; j < hourInfo.Count; j++)
                        {
                            if (hourInfo[j].Count > 0 && hourInfo[j][0].Word == areaName)
                            {
                                indexArea = j;
                                break;
                            }
                        }
                        foreach (WelfareForecastInfo dayNew in hourInfo[indexArea])
                        {
                            welfareInfo = new WelfareForecastInfo();
                            welfareInfo.Word = areaName;
                            welfareInfo.Weather = dayNew.Weather;
                            welfareInfo.Rain = dayNew.Rain;
                            welfareInfo.WindName = dayNew.WindName;
                            welfareInfo.WindDirectName = dayNew.WindDirectName;
                            welfareInfo.MinTemp = dayNew.MinTemp;
                            welfareInfo.MaxTemp = dayNew.MaxTemp;
                            welfareInfo.ForecastDate = dayNew.ForecastDate;
                            dataInfoList[i].Add(welfareInfo);
                        }
                    }
                }
                else
                {
                    dataInfoList.Add(new List<WelfareForecastInfo>());
                    foreach (WelfareForecastInfo dayNew in hourInfo[indexFT])
                    {
                        welfareInfo = new WelfareForecastInfo();
                        welfareInfo.Word = "琼山区";
                        welfareInfo.Weather = dayNew.Weather;
                        welfareInfo.Rain = dayNew.Rain;
                        welfareInfo.WindName = dayNew.WindName;
                        welfareInfo.WindDirectName = dayNew.WindDirectName;
                        welfareInfo.MinTemp = dayNew.MinTemp;
                        welfareInfo.MaxTemp = dayNew.MaxTemp;
                        welfareInfo.ForecastDate = dayNew.ForecastDate;
                        dataInfoList[0].Add(welfareInfo);
                    }
                    dataInfoList.Add(new List<WelfareForecastInfo>());
                }
                foreach (List<WelfareForecastInfo> dataList in dataInfoList)
                {
                    foreach (WelfareForecastInfo info in dataList)
                    {
                        strSQL = "select recid from lfs_hour12weatherHOUR where DDATETIME=to_date('" + dt.ToString("dd-MM-yyyy HH:mm:ss") + "', 'dd-mm-yyyy hh24:mi:ss')   and FORECASTTIME=to_date('" + info.ForecastDate.ToString("dd-MM-yyyy HH:mm:ss") + "', 'dd-mm-yyyy hh24:mi:ss') and areaName='" + info.Word + "'";
                        oh = new OracleHelper("HAIKOUConnect");
                        strRecID = oh.db_GreateQuery(strSQL);
                        windCode = GetHour12Code(info.WindName, "风力");
                        directCode = GetHour12Code(info.WindDirectName, "风向");
                        weatherCode = GetHour12Code(info.Weather, "天气");
                        if (!int.TryParse(strRecID, out iResult))
                        {
                            strSQL = "insert into lfs_hour12weatherHOUR (RECID,DDATETIME,WEATHERSTATUS,RAIN,WINDSPEED,WINDDIRECT,MINTEMPERATURE,MAXTEMPERATURE,FORECASTTIME,areaName,WEATHERCODE,WINDCODE,DIRECTCODE) values (SEQ_lfs_hour12weatherHOUR.NEXTVAL"
                                              + ",to_date('" + dt.ToString("dd-MM-yyyy HH:mm:ss") + "', 'dd-mm-yyyy hh24:mi:ss') "
                                              + ",'" + info.Weather.Trim() + "'"
                                              + ", " + info.Rain.Trim() + " "
                                              + ", '" + info.WindName.Trim() + "' "
                                              + ", '" + info.WindDirectName.Trim() + "' "
                                              + ", " + info.MinTemp.Trim() + " "
                                              + ", " + info.MaxTemp.Trim() + " "
                                              + ",to_date('" + info.ForecastDate.AddHours(8).ToString("dd-MM-yyyy HH:mm:ss") + "', 'dd-mm-yyyy hh24:mi:ss') "
                                              + ",'" + info.Word.Trim() + "'"
                                              + ",'" + weatherCode + "'"
                                              + ",'" + windCode + "'"
                                              + ",'" + directCode + "'"
                                              + ")";
                        }
                        else
                        {
                            strSQL = "update lfs_hour12weatherHOUR set  WEATHERSTATUS='" + info.Weather.Trim() + "'"
                                + ",RAIN=" + info.Rain.Trim()
                                + ",WINDSPEED='" + info.WindName.Trim() + "'"
                                + ",WINDDIRECT= '" + info.WindDirectName.Trim() + "' "
                                + ",MINTEMPERATURE=" + info.MinTemp.Trim()
                                + ",MAXTEMPERATURE=" + info.MaxTemp.Trim()
                                + ",WEATHERCODE='" + weatherCode + "'"
                                + ",WINDCODE='" + windCode + "'"
                                + ",DIRECTCODE='" + directCode + "'"
                                + "  where recid=" + strRecID;
                        }
                        oh = new OracleHelper("HAIKOUConnect");
                        iResult = oh.db_ExecuteNonQuery(strSQL);
                        if (iResult <= 0)
                            return false;
                    }
                }
                if (iResult > 0)
                {

                    strSQL = "insert into lfs_hour12weather (RECID,DDATETIME,FORECASTER,WRITETIME,ISEDIT,ISUSER,ISCOMPANY,ISCORRECT,CORRECTREC) values (SEQ_lfs_hour12weather.NEXTVAL"
                                                   + ",to_date('" + dt.ToString("dd-MM-yyyy HH:mm:ss") + "', 'dd-mm-yyyy hh24:mi:ss') "
                                                   + ",'" + strForecaster + "'"
                                                   + ",to_date('" + DateTime.Now.ToString("dd-MM-yyyy HH:mm:ss") + "', 'dd-mm-yyyy hh24:mi:ss') "
                                                   + "," + isEdit + ""
                                                   + "," + isUser + ""
                                                   + "," + isCompany + ""
                                                    + "," + isCorrect + ""
                                                      + "," + (CORRECTREC + 1) + ""
                                                   + ")";
                    oh = new OracleHelper("HAIKOUConnect");
                    iResult = oh.db_ExecuteNonQuery(strSQL);
                    if (iResult > 0)
                        return true;
                }
            }
            catch (Exception ex)
            {
                OracleHelper.ErrWriter(ex);
            }
            return false;
        }


        public List<OBTRealInfo> GetAreaInfo()
        {
            try
            {
                string strSQL = "select * from lfs_areainfo order by recid";
                OracleHelper oh = new DAL.OracleHelper("HAIKOUConnect");
                DataTable dTable = oh.ExecuteDataTable(strSQL);
                if (dTable != null && dTable.Rows.Count > 0)
                {
                    List<OBTRealInfo> infoList = new List<OBTRealInfo>();
                    double d0;
                    for (int i = 0; i < dTable.Rows.Count; i++)
                    {
                        infoList.Add(new OBTRealInfo());

                        infoList[i].ID = dTable.Rows[i]["OBTID"].ToString();
                        infoList[i].Name = dTable.Rows[i]["AREANAME"].ToString();
                        d0 = 0;
                        double.TryParse(dTable.Rows[i]["LONGITUDE"].ToString(), out d0);
                        infoList[i].X = d0;
                        d0 = 0;
                        double.TryParse(dTable.Rows[i]["LATITUDE"].ToString(), out d0);
                        infoList[i].Y = d0;
                        d0 = 0;
                        double.TryParse(dTable.Rows[i]["HEIGHT"].ToString(), out d0);
                        infoList[i].Visi = d0;
                    }
                    return infoList;
                }
            }
            catch (Exception ex)
            {
                OracleHelper.ErrWriter(ex);
            }
            return null;
        }


        public string GetHour12Code(string valueItem, string typeItem)
        {
            try
            {
                string strSQL = "select ITEMCODE from LFS_HOUR12CODE where TYPENAME='" + typeItem + "' and ITEMVALUE='" + valueItem + "' ";
                OracleHelper oh = new DAL.OracleHelper("EJETDB247LFSData");
                string strId = oh.db_GreateQuery(strSQL);
                if (strId.Length > 0) return strId;
            }
            catch (Exception ex)
            {
                OracleHelper.ErrWriter(ex);
            }
            return "0.0";
        }
        #endregion

        #region  上网文件数据
        //上网文件   旧版本
        public string ShowPreviewWeb(DateTime DDateTime, int isCorrect)
        {
            string Mes_Content = "";
            List<List<WelfareForecastInfo>> m_AreaInfoList = null;
            List<List<WelfareForecastInfo>> m_AreaDaysInfoList = null;
            GetAll12HourForecastInfos(DDateTime, out m_AreaInfoList, out m_AreaDaysInfoList);
            if (m_AreaInfoList == null || m_AreaInfoList.Count <= 0 || m_AreaDaysInfoList == null || m_AreaDaysInfoList.Count <= 0)
            {
                return "暂无数据";
            }
            try
            {
                string strTime1 = "";
                string strTime2 = "";
                string strYYYYMMDD = DDateTime.ToString("yyyyMMdd");
                switch (DDateTime.Hour)
                {
                    case 6:
                        strTime1 = DDateTime.AddDays(-1).ToString("dd") + "2245";
                        strTime2 = strYYYYMMDD + "00";
                        break;
                    case 10:
                        strTime1 = DDateTime.ToString("dd") + "0230";
                        strTime2 = strYYYYMMDD + "00";
                        break;
                    case 15:
                        strTime1 = DDateTime.ToString("dd") + "0730";
                        strTime2 = strYYYYMMDD + "12";
                        break;
                    case 16:
                        strTime1 = DDateTime.ToString("dd") + "0830";
                        strTime2 = strYYYYMMDD + "12";
                        break;

                }
                double obtX = 114.00;
                double obtY = 22.53;
                double obtH = 63.0;
                string strOBTID = "59493";

                string strContent = "";
                strContent += "ZCZC" + "\n";

                if (isCorrect == 0)
                {
                    strContent += "FSCI50 BCGZ " + strTime1 + "\n";
                }
                else
                {
                    strContent += "FSCI50 BCGZ " + strTime1 + " CCA\n";
                }

                strContent += strTime2 + "时深圳城镇预报产品" + "\n";
                strContent += "SPCC " + strTime2 + "\n";
                strContent += "2" + "\n"; ;
                strContent += "" + strOBTID + " " + obtX.ToString("F2") + " " + obtY.ToString("F2") + " " + obtH.ToString("F1") + " 14 21" + "\n";
                string codeWeather = "";
                string minTemp = "";
                string maxTemp = "";
                string codeWind = "";
                string codeDirect = "";

                double d0 = 0;
                string strPlace = "       ";
                List<WelfareForecastInfo> infoList = new List<WelfareForecastInfo>();

                infoList.AddRange(m_AreaInfoList[0]);



                infoList.AddRange(m_AreaDaysInfoList[0]);

                for (int i = 0; i < infoList.Count; i++)
                {

                    codeWeather = GetWeatherCode(infoList[i].Weather);
                    codeWind = GetWindCode(infoList[i].WindName);
                    codeDirect = GetDirectCode(infoList[i].WindDirectName);

                    codeWeather = strPlace.Substring(0, 5 - codeWeather.Length) + codeWeather;
                    codeWind = strPlace.Substring(0, 5 - codeWind.Length) + codeWind;
                    codeDirect = strPlace.Substring(0, 5 - codeDirect.Length) + codeDirect;

                    if (i % 2 == 0)
                    {
                        minTemp = "999.9";
                        maxTemp = "999.9";
                    }
                    else
                    {
                        d0 = 0;
                        double.TryParse(infoList[i].MinTemp, out d0);
                        minTemp = d0.ToString("F1");
                        d0 = 0;
                        double.TryParse(infoList[i].MaxTemp, out d0);
                        maxTemp = d0.ToString("F1");

                        minTemp = strPlace.Substring(0, 5 - minTemp.Length) + minTemp;
                        maxTemp = strPlace.Substring(0, 5 - maxTemp.Length) + maxTemp;

                    }
                    strContent += "" + ((i + 1) * 12) + " 999.9 999.9 999.9 999.9 999.9 999.9 999.9 999.9 999.9 999.9 " + maxTemp + " " + minTemp + " 999.9 999.9 999.9 999.9 999.9 999.9 " + codeWeather + " " + codeDirect + " " + codeWind + "\n";
                }
                if (infoList.Count < 14)
                {
                    for (int i = infoList.Count; i < 14; i++)
                    {
                        strContent += "" + ((i + 1) * 12) + " 999.9 999.9 999.9 999.9 999.9 999.9 999.9 999.9 999.9 999.9 999.9 999.9 999.9 999.9 999.9 999.9 999.9 999.9 999.9 999.9 999.9" + "\n";
                    }
                }


                strContent += "45005 114.17  22.30 32.0 14 21\n";
                infoList = new List<WelfareForecastInfo>();
                if (DDateTime.Hour == 15)
                {
                    infoList.AddRange(m_AreaInfoList[1]);
                }
                else
                {
                    infoList.AddRange(m_AreaInfoList[0]);
                }

                foreach (var item in m_AreaDaysInfoList)
                {
                    foreach (var item2 in item)
                    {
                        if (item2.Word.Equals("香港"))
                        {
                            WelfareForecastInfo info = new WelfareForecastInfo();
                            info.Weather = item2.Weather;
                            info.Rain = item2.Rain;
                            info.MinTemp = item2.MinTemp;
                            info.MaxTemp = item2.MaxTemp;
                            info.WindName = item2.WindName;
                            info.WindDirectName = item2.WindDirectName;
                            info.Word = item2.Word;
                            info.ForecastDate = item2.ForecastDate;
                            infoList.Add(info);
                        }
                    }
                }

                for (int i = 0; i < infoList.Count; i++)
                {

                    codeWeather = GetWeatherCode(infoList[i].Weather);
                    codeWind = GetWindCode(infoList[i].WindName);
                    codeDirect = GetDirectCode(infoList[i].WindDirectName);

                    codeWeather = strPlace.Substring(0, 5 - codeWeather.Length) + codeWeather;
                    codeWind = strPlace.Substring(0, 5 - codeWind.Length) + codeWind;
                    codeDirect = strPlace.Substring(0, 5 - codeDirect.Length) + codeDirect;

                    if (i % 2 == 0)
                    {
                        minTemp = "999.9";
                        maxTemp = "999.9";
                    }
                    else
                    {
                        d0 = 0;
                        double.TryParse(infoList[i].MinTemp, out d0);
                        minTemp = d0.ToString("F1");
                        d0 = 0;
                        double.TryParse(infoList[i].MaxTemp, out d0);
                        maxTemp = d0.ToString("F1");

                        minTemp = strPlace.Substring(0, 5 - minTemp.Length) + minTemp;
                        maxTemp = strPlace.Substring(0, 5 - maxTemp.Length) + maxTemp;

                    }
                    strContent += "" + ((i + 1) * 12) + " 999.9 999.9 999.9 999.9 999.9 999.9 999.9 999.9 999.9 999.9 " + maxTemp + " " + minTemp + " 999.9 999.9 999.9 999.9 999.9 999.9 " + codeWeather + " " + codeDirect + " " + codeWind + "\n";
                }
                if (infoList.Count < 14)
                {
                    for (int i = infoList.Count; i < 14; i++)
                    {
                        strContent += "" + ((i + 1) * 12) + " 999.9 999.9 999.9 999.9 999.9 999.9 999.9 999.9 999.9 999.9 999.9 999.9 999.9 999.9 999.9 999.9 999.9 999.9 999.9 999.9 999.9" + "\n";
                    }
                }


                strContent += "NNNN";
                Mes_Content = strContent;

            }
            catch (Exception ex)
            {
                OracleHelper.ErrWriter(ex);
            }
            return Mes_Content;
        }


        //zhou
        //上网文件  新版本
        public string ShowPreviewWeb2(string dt, int isCorrect, List<List<WelfareForecastInfo>> hourInfo)
        {
            string Mes_Content = "";
            List<List<WelfareForecastInfo>> m_AreaInfoList = hourInfo;

            DateTime dttime = Convert.ToDateTime(dt);

            if (m_AreaInfoList == null || m_AreaInfoList.Count <= 0)
            {
                return "暂无数据";
            }
            try
            {
                string strTime1 = "";
                string strTime2 = "";
                string strYYYYMMDD = dttime.ToString("yyyyMMdd");
                switch (dttime.Hour)
                {
                    case 6:
                        strTime1 = dttime.AddDays(-1).ToString("dd") + "2245";
                        strTime2 = strYYYYMMDD + "00";
                        break;
                    case 8:
                        strTime1 = dttime.ToString("dd") + "0230";
                        strTime2 = strYYYYMMDD + "08";
                        break;
                    case 15:
                        strTime1 = dttime.ToString("dd") + "0730";
                        strTime2 = strYYYYMMDD + "12";
                        break;
                    case 20:
                        strTime1 = dttime.ToString("dd") + "0830";
                        strTime2 = strYYYYMMDD + "20";
                        break;

                }
                double obtX = 114.00;
                double obtY = 22.53;
                double obtH = 63.0;
                string strOBTID = "59493";

                string strContent = "";
                strContent += "ZCZC" + "\n";

                if (isCorrect == 0)
                {
                    strContent += "FSCI50 BCGZ " + strTime1 + "\n";
                }
                else
                {
                    strContent += "FSCI50 BCGZ " + strTime1 + " CCA\n";
                }

                strContent += strTime2 + "时海口城镇预报产品" + "\n";
                strContent += "SPCC " + strTime2 + "\n";
                strContent += "2" + "\n"; ;
                strContent += "" + strOBTID + " " + obtX.ToString("F2") + " " + obtY.ToString("F2") + " " + obtH.ToString("F1") + " 14 21" + "\n";
                string codeWeather = "";
                string minTemp = "";
                string maxTemp = "";
                string codeWind = "";
                string codeDirect = "";

                double d0 = 0;
                string strPlace = "       ";
                List<WelfareForecastInfo> infoList = new List<WelfareForecastInfo>();

                infoList.AddRange(m_AreaInfoList[0]);

                for (int i = 0; i < infoList.Count; i++)
                {

                    codeWeather = GetWeatherCode(infoList[i].Weather);
                    codeWind = GetWindCode(infoList[i].WindName);
                    codeDirect = GetDirectCode(infoList[i].WindDirectName);

                    codeWeather = strPlace.Substring(0, 5 - codeWeather.Length) + codeWeather;
                    codeWind = strPlace.Substring(0, 5 - codeWind.Length) + codeWind;
                    codeDirect = strPlace.Substring(0, 5 - codeDirect.Length) + codeDirect;

                    if (i % 2 == 0)
                    {
                        minTemp = "999.9";
                        maxTemp = "999.9";
                    }
                    else
                    {
                        d0 = 0;
                        double.TryParse(infoList[i].MinTemp, out d0);
                        minTemp = d0.ToString("F1");
                        d0 = 0;
                        double.TryParse(infoList[i].MaxTemp, out d0);
                        maxTemp = d0.ToString("F1");

                        minTemp = strPlace.Substring(0, 5 - minTemp.Length) + minTemp;
                        maxTemp = strPlace.Substring(0, 5 - maxTemp.Length) + maxTemp;

                    }
                    strContent += "" + ((i + 1) * 12) + " 999.9 999.9 999.9 999.9 999.9 999.9 999.9 999.9 999.9 999.9 " + maxTemp + " " + minTemp + " 999.9 999.9 999.9 999.9 999.9 999.9 " + codeWeather + " " + codeDirect + " " + codeWind + "\n";
                }
                if (infoList.Count < 14)
                {
                    for (int i = infoList.Count; i < 14; i++)
                    {
                        strContent += "" + ((i + 1) * 12) + " 999.9 999.9 999.9 999.9 999.9 999.9 999.9 999.9 999.9 999.9 999.9 999.9 999.9 999.9 999.9 999.9 999.9 999.9 999.9 999.9 999.9" + "\n";
                    }
                }


                strContent += "45005 114.17  22.30 32.0 14 21\n";

                strContent += "NNNN";
                Mes_Content = strContent;

            }
            catch (Exception ex)
            {
                OracleHelper.ErrWriter(ex);
            }
            return Mes_Content;
        }
        //zhou


        /// <summary>
        /// 天气状态
        /// </summary>
        /// <param name="strName"></param>
        /// <returns></returns>
        private string GetWeatherCode(string strName)
        {
            try
            {
                List<string> itemList = new List<string> { "晴", "多云", "阴", "阵雨", "雷阵雨", "雷阵雨伴冰雹", "小雨", "中雨", "大雨", "暴雨", "大暴雨", "特大暴雨", "雾", "小雨到中雨", "中雨到大雨", "大雨到暴雨", "暴雨到大暴雨", "大暴雨到特大暴雨" };
                List<string> codeList = new List<string> { "0.0", "1.0", "2.0", "3.0", "4.0", "5.0", "7.0", "8.0", "9.0", "10.0", "11.0", "12.0", "18.0", "21.0", "22.0", "23.0", "24.0", "25.0" };

                int indexCode = itemList.IndexOf(strName);
                if (indexCode >= 0)
                {
                    return indexCode.ToString("F1");
                }
            }
            catch (Exception ex)
            {
                OracleHelper.ErrWriter(ex);
            }
            return "0.0";
        }

        /// <summary>
        /// 风速等级
        /// </summary>
        /// <param name="strWindName"></param>
        /// <returns></returns>
        private string GetWindCode(string strWindName)
        {
            try
            {
                List<string> itemList = new List<string> { "≤3", "3-4", "4-5", "5-6", "6-7", "7-8", "8-9", "9-10", "10-11", "11-12" };
                int indexCode = itemList.IndexOf(strWindName);
                if (indexCode >= 0)
                {
                    return indexCode.ToString("F1");
                }
            }
            catch (Exception ex)
            {
                OracleHelper.ErrWriter(ex);
            }
            return "0.0";
        }

        /// <summary>
        /// 风向
        /// </summary>
        /// <param name="strName"></param>
        /// <returns></returns>
        private string GetDirectCode(string strName)
        {
            try
            {
                List<string> itemList = new List<string> { "无", "东北", "东", "东南", "南", "西南", "西", "西北", "北", "旋转" };
                int indexCode = itemList.IndexOf(strName);
                if (indexCode >= 0)
                {
                    return indexCode.ToString("F1");
                }
            }
            catch (Exception ex)
            {
                OracleHelper.ErrWriter(ex);
            }
            return "0.0";
        }
        #endregion
    }
}
