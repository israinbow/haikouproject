using Common;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DAL
{
    public class CityForecast6HourDAL
    {
        //取6小时预报当钱预报员
        public string Get6HourForecastName(DateTime dt)
        {
            string name = "谢光前";
            try
            {
                string strSQL = "select FORECASTER from LFS_CITYWEATHER where DDATETIME=to_date('" + dt.ToString("dd-MM-yyyy HH:mm:ss") + "', 'dd-mm-yyyy hh24:mi:ss') order by recid desc ";
                OracleHelper oh = new OracleHelper("HAIKOUConnect");
                if (oh.db_GreateQuery(strSQL) != "")
                {
                    name = oh.db_GreateQuery(strSQL);
                }
                return name;
            }
            catch (Exception ex)
            {
                OracleHelper.ErrWriter(ex);
            }
            return name;
        }


        //获取6小时预报所有预报员信息
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


        public DataTable DtSelectTop(int TopItem, DataTable oDT)
        {
            if (oDT.Rows.Count < TopItem) return oDT;

            DataTable NewTable = oDT.Clone();
            DataRow[] rows = oDT.Select("1=1");
            for (int i = 0; i < TopItem; i++)
            {
                NewTable.ImportRow((DataRow)rows[i]);
            }
            return NewTable;
        }

        /// <summary>
        /// 逐6小时格点数据获取
        /// </summary>
        /// <param name="dt"></param>
        /// <returns></returns>
        public List<List<OBTRealInfo>> GetCityForecastInfoList(DateTime dt, DateTime dtStart)
        {
            List<List<OBTRealInfo>> newList = new List<List<OBTRealInfo>> { new List<OBTRealInfo>(), new List<OBTRealInfo>(), new List<OBTRealInfo>(), new List<OBTRealInfo>(), new List<OBTRealInfo>() };
            try
            {
                string strSQL = string.Empty;
                DataTable dTable = null;
                OracleHelper th = new OracleHelper("HAIKOUConnect");

                if (dtStart.Equals("0001-01-01"))
                {
                    strSQL = string.Format(@"select* from T_HK_NEW_GRID_FORECAST t
                                         where ddatetime = to_date('{0}', 'yyyy-MM-dd hh24:mi:ss') 
                                           and venueid = 161
                                           and ybsx > 0 
                                           and ybsx <=24
                                         order by ybsx
                                        ", dt.ToString("yyyy-MM-dd HH:mm"));
                }
                else
                {
                    DateTime dtEnd = dtStart.AddHours(24);
                    strSQL = string.Format(@"select* from T_HK_NEW_GRID_FORECAST t
                                             where ddatetime = to_date('{0}', 'yyyy-MM-dd hh24:mi:ss') 
                                               and venueid = 161
                                               and forecasttime>=to_date('{1}', 'yyyy-MM-dd hh24:mi:ss')
                                               and forecasttime<=to_date('{2}', 'yyyy-MM-dd hh24:mi:ss')
                                             order by ybsx
                                            ", dt.ToString("yyyy-MM-dd HH:mm"), dtStart.ToString("yyyy-MM-dd HH:mm"), dtEnd.ToString("yyyy-MM-dd HH:mm"));
                }
                dTable = th.ExecuteDataTable(strSQL);
                if (dTable != null && dTable.Rows.Count > 0)
                {
                    List<List<string>> dic = new List<List<string>>();

                    for (int i = 0; i < dTable.Rows.Count; i = i + 2)
                    {
                        List<string> list = new List<string>();
                        DataTable Dtn = dTable.Clone();
                        for (int j = i; j < (i + 2); j++)
                        {
                            Dtn.Rows.Add(dTable.Rows[j].ItemArray);
                        }
                        //最高温
                        int MaT = Convert.ToInt32((from Coloumn in Dtn.AsEnumerable()
                                                   select Coloumn.Field<object>("t2m")).Max());
                        //最低温
                        int MiT = Convert.ToInt32((from Coloumn in Dtn.AsEnumerable()
                                                   select Coloumn.Field<object>("t2m")).Min());
                        //降雨量
                        var rain = (from Coloumn in Dtn.AsEnumerable()
                                    select Coloumn.Field<decimal>("rain")).Sum();
                        //风向
                        var WDIR10M = (from Coloumn in Dtn.AsEnumerable()
                                       select Coloumn.Field<object>("WDIR10M")).Max();
                        //风力
                        var WSPD10M = (from Coloumn in Dtn.AsEnumerable()
                                       select Coloumn.Field<object>("WSPD10M")).Max();
                        //转换风力和风速
                        string windf = getDirect(Convert.ToDouble(WDIR10M));
                        string windl = GetWindSpeedClassNew(Convert.ToDouble(WSPD10M));
                        list.Add(Dtn.Rows[0]["forecasttime"].ToString());
                        list.Add(MaT.ToString());
                        list.Add(MiT.ToString());
                        list.Add(windf);
                        list.Add(windl.ToString());
                        list.Add(rain.ToString());
                        dic.Add(list);
                    }

                    for (int i = 0; i < dic.Count; i++)
                    {
                        newList[3].Add(new OBTRealInfo());
                        newList[3][i].Name = "格点预报";

                        newList[3][i].ForecastDate = Convert.ToDateTime(dic[i][0]);//预报时间

                        newList[3][i].MinTemp = Convert.ToDouble(dic[i][2]);//最低温

                        newList[3][i].MaxTemp = Convert.ToDouble(dic[i][1]);//最高温
                        newList[3][i].Rain = Math.Round(Convert.ToDouble(dic[i][5]), 1);//降雨量

                        newList[3][i].Wind = 0.0;
                        newList[3][i].WindName = dic[i][4].ToString();//风速
                        newList[3][i].WindDirectName = dic[i][3].ToString();//风向
                        newList[3][i].ID = "晴";//天气情况
                        if (Convert.ToDouble(dic[i][5]) > 0.05 && Convert.ToDouble(dic[i][5]) <= 1)
                        {
                            newList[3][i].ID = "小雨";
                        }
                        else if (Convert.ToDouble(dic[i][5]) > 1 && Convert.ToDouble(dic[i][5]) <= 30)
                        {
                            newList[3][i].ID = "阵雨";
                        }
                        else if (Convert.ToDouble(dic[i][5]) > 30)
                        {
                            newList[3][i].ID = "雷阵雨";
                        }
                    }
                }
            }
            catch (Exception e)
            {
                string error = e.Message + e.StackTrace;
            }
            return newList;
        }



        #region  逐6小时展示数据
        //取所有类型预报数据(目前只要自动站数据)

        public List<List<OBTRealInfo>> SGetCityForecastInfoList(DateTime dt)
        {
            List<List<OBTRealInfo>> newList = new List<List<OBTRealInfo>> { new List<OBTRealInfo>(), new List<OBTRealInfo>(), new List<OBTRealInfo>(), new List<OBTRealInfo>(), new List<OBTRealInfo>() };

            try
            {
                double dRain = 0;
                //  string venueID = "76";
                string venueID = "62";
                DataTable dTable = null;
                DateTime dtF = dt;
                double d0 = 0;
                bool hasPreData = false;
                bool hasData = false;
                string strSQL;
                //string strTableName = "v_otherobtmind";
                //string strOBTID = "59493";
                string strTableName = "T_LOCALOSSMOB01";
                string strOBTID = "G3501";

                DateTime dtStart = dt;
                switch (dt.Hour)
                {
                    case 6:
                        dtStart = DateTime.Parse(dt.ToString("yyyy-MM-dd 08:00"));
                        break;
                    case 10:
                        dtStart = DateTime.Parse(dt.ToString("yyyy-MM-dd 08:00"));
                        break;
                    case 16:
                        dtStart = DateTime.Parse(dt.ToString("yyyy-MM-dd 20:00"));
                        break;
                }

                //实况
                strSQL = "select DDATETIME FORECASTTIME, WINDV10MS*0.1 wspd,AUTOPRECIPAMOUNT*0.1 rain,MAXTEMP*0.1 MAXT,MINTEMP*0.1 MinT   from " + strTableName + " where OSSMOID=1 and ddatetime between to_date('" + dtStart.AddHours(-12).ToString("yyyy-MM-dd HH:mm") + "','yyyy-mm-dd hh24:mi') and to_date('" + dtStart.AddHours(24).ToString("yyyy-MM-dd HH:mm") + "','yyyy-mm-dd hh24:mi') order by ddatetime";
                //if (dt.Date < DateTime.Now.Date)
                //{
                //    strSQL = "select DDATETIME FORECASTTIME, WD2DF*0.1 wspd,r06H*0.1 rain,t*0.1 t   from " + strTableName + " where obtid ='" + strOBTID + "' and ddatetime between to_date('" + dtStart.AddHours(-12).ToString("yyyy-MM-dd HH:mm") + "','yyyy-mm-dd hh24:mi') and to_date('" + dtStart.AddHours(24).ToString("yyyy-MM-dd HH:mm") + "','yyyy-mm-dd hh24:mi') order by ddatetime";
                //}
                OracleHelper oh = new OracleHelper("SZQX13ConnectionString");
                dTable = oh.ExecuteDataTable(strSQL);
                if (dTable != null && dTable.Rows.Count > 0)
                {
                    for (int i = 0; i < dTable.Rows.Count; i++)
                    {
                        newList[0].Add(new OBTRealInfo());

                        dtF = dt;
                        DateTime.TryParse(dTable.Rows[i]["FORECASTTIME"].ToString(), out dtF);
                        newList[0][i].ForecastDate = dtF;

                        d0 = 0;
                        double.TryParse(dTable.Rows[i]["MinT"].ToString(), out d0);
                        newList[0][i].MinTemp = d0;
                        d0 = 0;
                        double.TryParse(dTable.Rows[i]["MAXT"].ToString(), out d0);
                        newList[0][i].MaxTemp = d0;
                        d0 = 0;
                        double.TryParse(dTable.Rows[i]["rain"].ToString(), out d0);
                        newList[0][i].Rain = d0;
                        newList[0][i].Name = "实况";
                        d0 = 0;
                        double.TryParse(dTable.Rows[i]["wspd"].ToString(), out d0);
                        newList[0][i].Wind = d0;
                    }
                }

                #region 获取10天预报第一天的雨量
                string sqlFirst = @"select ddatetime FORECASTTIME,mintemp MINTEMPERATURE,maxtemp MAXTEMPERATURE,rain RAIN,WINDSPEED,WINDDIRECT,weatherpic WEATHERSTATUS,SIXHOURRAINONE,SIXHOURRAINTWO,SIXHOURRAINTHREE,SIXHOURRAINFOUR 
            from LFS_WELFAREFORECAST t where ddatetime = to_date('" + dt.ToString("yyyy-MM-dd HH:mm:ss") + "','yyyy-mm-dd hh24:mi:ss') ";
                oh = new OracleHelper("HAIKOUConnect");
                DataTable dtFirst = oh.ExecuteDataTable(sqlFirst);
                #endregion

                //取逐时预报 
                strSQL = "select * from lfs_cityweatherhour where ddatetime = to_date('" + dt.ToString("yyyy-MM-dd HH:mm") + "','yyyy-mm-dd hh24:mi')   order by FORECASTTIME";
                oh = new OracleHelper("HAIKOUConnect");

                ///逐6时天气预报格点数据
                //h修改采用格点数据
                //6  10  16(前一天16  6  11)

                OracleHelper th = new OracleHelper("HAIKOUConnect");
                dTable = oh.ExecuteDataTable(strSQL);
                if (dt.Hour == 6 || dt.Hour == 08)
                {
                    strSQL = string.Format(@"select *  from (select* from T_HK_NEW_GRID_FORECAST  t
                                             where ddatetime = to_date('{0}', 'yyyy-MM-dd hh24:mi:ss') 
                                               and venueid = 161
                                               and ybsx > 0 
                                             order by ybsx
                                             )
                                             where forecasttime>to_date('{1}', 'yyyy-MM-dd hh24:mi:ss')  and forecasttime<=to_date('{2}', 'yyyy-MM-dd hh24:mi:ss')", dt.ToString("yyyy-MM-dd HH:mm"), dt.ToString("yyyy-MM-dd 08:mm"), dt.AddDays(1).ToString("yyyy-MM-dd 08:mm"));
                }
                else
                {
                    strSQL = string.Format(@"select *  from (select* from T_HK_NEW_GRID_FORECAST  t
                                             where ddatetime = to_date('{0}', 'yyyy-MM-dd hh24:mi:ss') 
                                               and venueid = 161
                                               and ybsx > 0 
                                             order by ybsx
                                             )
                                             where forecasttime>to_date('{1}', 'yyyy-MM-dd hh24:mi:ss')  and forecasttime<=to_date('{2}', 'yyyy-MM-dd hh24:mi:ss')", dt.ToString("yyyy-MM-dd HH:mm"), dt.ToString("yyyy-MM-dd 20:mm"), dt.AddDays(1).ToString("yyyy-MM-dd 20:mm"));

                }
                dTable = th.ExecuteDataTable(strSQL);
                if (dTable != null && dTable.Rows.Count > 0)
                {
                    List<List<string>> dic = new List<List<string>>();

                    for (int i = 0; i < dTable.Rows.Count; i++)
                    {
                        List<string> list = new List<string>();
                        DataTable Dtn = dTable.Clone();
                        for (int j = 0; j < 6; j++)
                        {
                            Dtn.Rows.Add(dTable.Rows[i].ItemArray);
                        }
                        //最高温
                        int MaT = Convert.ToInt32((from Coloumn in Dtn.AsEnumerable()
                                                   select Coloumn.Field<object>("t2m")).Max());
                        //最低温
                        int MiT = Convert.ToInt32((from Coloumn in Dtn.AsEnumerable()
                                                   select Coloumn.Field<object>("t2m")).Min());
                        //降雨量
                        var rain = (from Coloumn in Dtn.AsEnumerable()
                                    select Coloumn.Field<decimal>("rain")).Sum();
                        //风向
                        var WDIR10M = (from Coloumn in Dtn.AsEnumerable()
                                       select Coloumn.Field<object>("WDIR10M")).Max();
                        //风力
                        var WSPD10M = (from Coloumn in Dtn.AsEnumerable()
                                       select Coloumn.Field<object>("WSPD10M")).Max();
                        //转换风力和风速
                        string windf = getDirect(Convert.ToDouble(WDIR10M));
                        string windl = GetWindSpeedClassNew(Convert.ToDouble(WSPD10M));
                        list.Add(Dtn.Rows[0]["forecasttime"].ToString());
                        list.Add(MaT.ToString());
                        list.Add(MiT.ToString());
                        list.Add(windf);
                        list.Add(windl.ToString());
                        list.Add(rain.ToString());
                        dic.Add(list);

                        for (int k = 0; k < 6; k++)
                        {
                            dTable.Rows.RemoveAt(0);
                        }

                    }

                    for (int i = 0; i < dic.Count; i++)
                    {
                        newList[3].Add(new OBTRealInfo());
                        newList[3][i].Name = "格点预报";

                        newList[3][i].ForecastDate = Convert.ToDateTime(dic[i][0]);//预报时间


                        newList[3][i].MinTemp = Convert.ToDouble(dic[i][2]);//最低温

                        newList[3][i].MaxTemp = Convert.ToDouble(dic[i][1]);//最高温
                        newList[3][i].Rain = Math.Round(Convert.ToDouble(dic[i][5]), 1);//降雨量

                        newList[3][i].Wind = 0.0;
                        newList[3][i].WindName = dic[i][4].ToString();//风速
                        newList[3][i].WindDirectName = dic[i][3].ToString();//风向
                        newList[3][i].ID = "晴";//天气情况
                        if (Convert.ToDouble(dic[i][5]) > 0.05 && Convert.ToDouble(dic[i][5]) <= 1)
                        {
                            newList[3][i].ID = "小雨";

                        }
                        else if (Convert.ToDouble(dic[i][5]) > 1 && Convert.ToDouble(dic[i][5]) <= 30)
                        {
                            newList[3][i].ID = "阵雨";

                        }
                        else if (Convert.ToDouble(dic[i][5]) > 30)
                        {
                            newList[3][i].ID = "雷阵雨";

                        }
                    }
                }

                //
                #region
                /*
                if (dTable != null && dTable.Rows.Count > 0)
                {
                    hasData = true;
                    for (int i = 0; i < dTable.Rows.Count; i++)
                    {
                        newList[3].Add(new OBTRealInfo());
                        newList[3][i].Name = "制作预报";
                        dtF = dt;
                        DateTime.TryParse(dTable.Rows[i]["FORECASTTIME"].ToString(), out dtF);
                        newList[3][i].ForecastDate = dtF;

                        d0 = 0;
                        double.TryParse(dTable.Rows[i]["MinTEMPERATURE"].ToString(), out d0);
                        newList[3][i].MinTemp = double.Parse(d0.ToString("F0"));
                        d0 = 0;
                        double.TryParse(dTable.Rows[i]["MaxTEMPERATURE"].ToString(), out d0);
                        newList[3][i].MaxTemp = double.Parse(d0.ToString("F0"));
                        d0 = 0;
                        double.TryParse(dTable.Rows[i]["RAIN"].ToString(), out d0);
                        newList[3][i].Rain = d0;
                        d0 = 0;
                        double.TryParse(dTable.Rows[i]["WINDSPEED"].ToString(), out d0);
                        newList[3][i].Wind = d0;
                        newList[3][i].WindName = dTable.Rows[i]["WINDCLASS"].ToString();
                        newList[3][i].WindDirectName = dTable.Rows[i]["WINDDIRECT"].ToString();
                        newList[3][i].ID = dTable.Rows[i]["WEATHERSTATUS"].ToString();


                        //添加十天预报逐六小时雨量
                        if (dtFirst != null && dtFirst.Rows.Count > 0)
                        {

                            double rain = 0;
                            if (i == 0)
                            {
                                rain = Convert.ToDouble(dtFirst.Rows[0]["SIXHOURRAINONE"].ToString() == "" ? 0 : dtFirst.Rows[0]["SIXHOURRAINONE"]);
                                newList[3][i].Rain = rain;
                            }
                            if (i == 1)
                            {
                                rain = Convert.ToDouble(dtFirst.Rows[0]["SIXHOURRAINTWO"].ToString() == "" ? 0 : dtFirst.Rows[0]["SIXHOURRAINTWO"]);
                                newList[3][i].Rain = rain;
                            }
                            if (i == 2)
                            {
                                rain = Convert.ToDouble(dtFirst.Rows[0]["SIXHOURRAINTHREE"].ToString() == "" ? 0 : dtFirst.Rows[0]["SIXHOURRAINTHREE"]);
                                newList[3][i].Rain = rain;
                            }
                            if (i == 3)
                            {
                                rain = Convert.ToDouble(dtFirst.Rows[0]["SIXHOURRAINFOUR"].ToString() == "" ? 0 : dtFirst.Rows[0]["SIXHOURRAINFOUR"]);
                                newList[3][i].Rain = rain;
                            }
                        }
                    }
                }

                */
                #endregion
                //取分区预报数据
                if (hasData && newList[3].Count == 0)
                {
                    dtF = dt;
                    if (dt.Hour == 10) dtF = dt.AddHours(1);
                    List<OBTRealInfo> areaList = GetAreaWeatherHourInfoList(dtF, "琼山区");
                    if (areaList != null && areaList.Count > 20)
                    {
                        OBTRealInfo info;
                        List<OBTRealInfo> tempList = new List<OBTRealInfo>();
                        dtF = dtStart.AddHours(-12);
                        if (newList[0].Count > 0 && dt.Hour == 10)
                        {
                            dtF = newList[0].Max(pkm => pkm.ForecastDate);
                        }

                        for (DateTime dtAA = dtStart; dtAA <= dtStart.AddHours(18); dtAA = dtAA.AddHours(6))
                        {
                            tempList = new List<OBTRealInfo>();
                            if (newList[0].Count > 0 && dt.Hour == 10 && dtF > dtAA)
                            {
                                foreach (OBTRealInfo infoA in newList[0])
                                {
                                    if (infoA.ForecastDate >= dtAA && infoA.ForecastDate < dtAA.AddHours(6))
                                    {
                                        tempList.Add(infoA);
                                    }
                                }
                            }
                            foreach (OBTRealInfo infoA in areaList)
                            {
                                if (infoA.ForecastDate >= dtAA && infoA.ForecastDate < dtAA.AddHours(6))
                                {
                                    tempList.Add(infoA);
                                }
                            }
                            info = new OBTRealInfo();
                            info.Name = "制作预报";
                            info.ForecastDate = dtAA;
                            info.MinTemp = tempList.Min(pkm => pkm.MinTemp);
                            info.MaxTemp = tempList.Max(pkm => pkm.MaxTemp);
                            info.Rain = tempList.Sum(pkm => pkm.Rain);
                            info.Wind = tempList.Max(pkm => pkm.Wind);
                            info.ID = "晴";
                            if (info.Rain > 0.05 && info.Rain <= 1)
                            {
                                info.ID = "多云";

                            }
                            else if (info.Rain > 1 && info.Rain <= 30)
                            {
                                info.ID = "阵雨";

                            }
                            else if (info.Rain > 30)
                            {
                                info.ID = "雷阵雨";

                            }
                            info.WindName = GetWindSpeedClassNew(info.Wind);
                            info.WindDirectName = "无";
                            newList[3].Add(info);
                        }
                    }
                }
                //取上一时次预报数据
                if (!hasData && newList[3].Count <= 0)
                {
                    switch (dt.Hour)
                    {
                        case 6:
                            dtF = DateTime.Parse(dt.AddDays(-1).ToString("yyyy-MM-dd 16:00"));
                            break;
                        case 10:
                            dtF = DateTime.Parse(dt.ToString("yyyy-MM-dd 6:00"));
                            break;
                        case 16:
                            dtF = DateTime.Parse(dt.ToString("yyyy-MM-dd 10:00"));
                            break;
                    }
                    strSQL = "select * from lfs_cityweatherhour where ddatetime = to_date('" + dtF.ToString("yyyy-MM-dd HH:mm") + "','yyyy-mm-dd hh24:mi') and FORECASTTIME>=to_date('" + dtStart.ToString("yyyy-MM-dd HH:mm") + "','yyyy-mm-dd hh24:mi')   order by FORECASTTIME";
                    oh = new OracleHelper("HAIKOUConnect");
                    dTable = oh.ExecuteDataTable(strSQL);
                    if (dTable != null && dTable.Rows.Count > 0)
                    {
                        hasPreData = true;
                        for (int i = 0; i < dTable.Rows.Count; i++)
                        {
                            newList[3].Add(new OBTRealInfo());
                            newList[3][i].Name = "制作预报";
                            dtF = dt;
                            DateTime.TryParse(dTable.Rows[i]["FORECASTTIME"].ToString(), out dtF);
                            newList[3][i].ForecastDate = dtF;

                            d0 = 0;
                            double.TryParse(dTable.Rows[i]["MinTEMPERATURE"].ToString(), out d0);
                            newList[3][i].MinTemp = double.Parse(d0.ToString("F0"));
                            d0 = 0;
                            double.TryParse(dTable.Rows[i]["MaxTEMPERATURE"].ToString(), out d0);
                            newList[3][i].MaxTemp = double.Parse(d0.ToString("F0"));

                            d0 = 0;
                            double.TryParse(dTable.Rows[i]["RAIN"].ToString(), out d0);
                            newList[3][i].Rain = d0;
                            d0 = 0;
                            double.TryParse(dTable.Rows[i]["WINDSPEED"].ToString(), out d0);
                            newList[3][i].Wind = d0;
                            newList[3][i].WindName = dTable.Rows[i]["WINDCLASS"].ToString();
                            newList[3][i].WindDirectName = dTable.Rows[i]["WINDDIRECT"].ToString();
                            newList[3][i].ID = dTable.Rows[i]["WEATHERSTATUS"].ToString();


                            //添加十天预报逐六小时雨量
                            if (dtFirst != null && dtFirst.Rows.Count > 0)
                            {

                                double rain = 0;
                                if (i == 0)
                                {
                                    rain = Convert.ToDouble(dtFirst.Rows[0]["SIXHOURRAINONE"].ToString() == "" ? 0 : dtFirst.Rows[0]["SIXHOURRAINONE"]);
                                    newList[3][i].Rain = rain;
                                }
                                if (i == 1)
                                {
                                    rain = Convert.ToDouble(dtFirst.Rows[0]["SIXHOURRAINTWO"].ToString() == "" ? 0 : dtFirst.Rows[0]["SIXHOURRAINTWO"]);
                                    newList[3][i].Rain = rain;
                                }
                            }
                        }
                    }
                }
                DateTime dtMin = dt.AddHours(1);
                DateTime dtMax = dt.AddHours(24);

                //欧洲中心
                dtF = DateTime.Parse(dtF.AddDays(-1).ToString("yyyy-MM-dd 20:00"));

                strSQL = "select   FORECASTTIME,  WSPD10M wspd, WDIR10M wdir, rain,T2M t   from top_product_venue_ecmwf where VENUEID = " + venueID + "  and FORECASTTIME between to_date('" + dtMin.AddHours(-6).ToString("yyyy-MM-dd HH:mm") + "','yyyy-mm-dd hh24:mi') and to_date('" + dtMax.ToString("yyyy-MM-dd HH:mm") + "','yyyy-mm-dd hh24:mi') and ddatetime = to_date('" + dtF.ToString("yyyy-MM-dd HH:mm") + "','yyyy-mm-dd hh24:mi') order by FORECASTTIME ";
                oh = new OracleHelper("HAIKOUConnect");
                dTable = oh.ExecuteDataTable(strSQL);
                if (dTable == null || dTable.Rows.Count < 1)
                {
                    strSQL = "select FORECASTTIME,WSPD10M wspd,WDIR10M wdir,  rain,T2M t   from top_product_venue_ecmwf where VENUEID = " + venueID + "  and FORECASTTIME between to_date('" + dtMin.AddHours(-6).ToString("yyyy-MM-dd HH:mm") + "','yyyy-mm-dd hh24:mi') and to_date('" + dtMax.ToString("yyyy-MM-dd HH:mm") + "','yyyy-mm-dd hh24:mi') and ddatetime = to_date('" + dtF.AddHours(-12).ToString("yyyy-MM-dd HH:mm") + "','yyyy-mm-dd hh24:mi') order by FORECASTTIME ";
                    oh = new OracleHelper("HAIKOUConnect");
                    dTable = oh.ExecuteDataTable(strSQL);
                }
                if (dTable != null && dTable.Rows.Count > 1)
                {
                    List<OBTRealInfo> ECMWFList = new List<OBTRealInfo>();
                    List<DateTime> dtList = new List<DateTime>();
                    OBTRealInfo infoEC = new OBTRealInfo();
                    for (int i = 0; i < dTable.Rows.Count; i++)
                    {
                        infoEC = new OBTRealInfo();

                        dtF = dt;
                        DateTime.TryParse(dTable.Rows[i]["FORECASTTIME"].ToString(), out dtF);
                        if (dtList.Contains(dtF)) continue;
                        infoEC.ForecastDate = dtF;
                        dtList.Add(dtF);

                        d0 = 0;
                        double.TryParse(dTable.Rows[i]["t"].ToString(), out d0);
                        infoEC.MinTemp = d0;
                        infoEC.Name = "欧洲中心";
                        infoEC.MaxTemp = d0;
                        d0 = 0;
                        double.TryParse(dTable.Rows[i]["rain"].ToString(), out d0);
                        infoEC.Rain = d0;
                        d0 = 0;
                        double.TryParse(dTable.Rows[i]["wspd"].ToString(), out d0);
                        infoEC.Wind = d0;
                        d0 = 0;
                        double.TryParse(dTable.Rows[i]["wdir"].ToString(), out d0);
                        infoEC.WindDirect = d0;

                        dRain = dRain + infoEC.Rain;
                        if (dtF.Hour == 8 || dtF.Hour == 14 || dtF.Hour == 20 || dtF.Hour == 2)
                        {
                            infoEC.Rain = dRain;
                            dRain = 0;
                        }
                        else
                        {
                            infoEC.Rain = -1;
                        }
                        ECMWFList.Add(infoEC);
                    }
                    newList[1] = ECMWFList;
                }
                //Haps
                dtF = DateTime.Now.AddHours(-1);
                if (DateTime.Now >= dt)
                {
                    dtF = dt.AddHours(-2);
                }
                strSQL = "select T2M t,rain,WDIR10M wdir,WSPD10M wspd,forecasttime from TOP_PRODUCT_VENUE_CAPS1 where ddatetime  =to_date('" + dtF.ToString("yyyy-MM-dd HH:00") + "','yyyy-mm-dd hh24:mi')  and VENUEID =" + venueID + "  and FORECASTTIME>to_date('" + dt.ToString("yyyy-MM-dd HH:mm") + "','yyyy-mm-dd hh24:mi') order by FORECASTTIME";
                oh = new OracleHelper("EJETDB247LFSData");
                dTable = oh.ExecuteDataTable(strSQL);


                bool hasHaps = false;
                if (dTable != null && dTable.Rows.Count > 0)
                {
                    hasHaps = true;

                    OBTRealInfo infoHaps;
                    for (int i = 0; i < dTable.Rows.Count; i++)
                    {
                        infoHaps = new OBTRealInfo();
                        dtF = dt;
                        DateTime.TryParse(dTable.Rows[i]["FORECASTTIME"].ToString(), out dtF);
                        infoHaps.ForecastDate = dtF;

                        d0 = 0;
                        double.TryParse(dTable.Rows[i]["t"].ToString(), out d0);
                        infoHaps.MinTemp = d0;

                        infoHaps.MaxTemp = d0;

                        d0 = 0;
                        double.TryParse(dTable.Rows[i]["rain"].ToString(), out d0);
                        infoHaps.Rain = d0;

                        infoHaps.Name = "Haps";
                        d0 = 0;
                        double.TryParse(dTable.Rows[i]["wspd"].ToString(), out d0);
                        infoHaps.Wind = d0;
                        d0 = 0;
                        double.TryParse(dTable.Rows[i]["wdir"].ToString(), out d0);
                        infoHaps.WindDirect = d0;
                        newList[2].Add(infoHaps);
                    }
                }

                //取卡尔曼滤波
                dtF = dt.AddHours(-2);

                strSQL = "select  T2M t,rain,WDIR10M wdir,WSPD10M wspd,forecasttime from lfs_kalmandata where ddatetime  =to_date('" + dtF.ToString("yyyy-MM-dd HH:00") + "','yyyy-mm-dd hh24:mi')  and VENUEID =" + venueID + "    order by FORECASTTIME";
                oh = new OracleHelper("EJETDB247LFSData");
                dTable = oh.ExecuteDataTable(strSQL);
                if (dTable != null && dTable.Rows.Count > 0 && newList[0].Count > 0)
                {
                    OBTRealInfo info;


                    DateTime dtR = newList[0][newList[0].Count - 1].ForecastDate;
                    dtR = DateTime.Parse(dtR.ToString("yyyy-MM-dd HH:00"));
                    for (int i = newList[0].Count - 1; i >= 0; i--)
                    {
                        info = new OBTRealInfo();
                        info.ForecastDate = dtR;
                        info.Name = "卡尔曼滤波";
                        if (newList[0][i].ForecastDate == info.ForecastDate)
                        {
                            info.Rain = newList[0][i].Rain;
                            info.Wind = newList[0][i].Wind;
                            info.MinTemp = newList[0][i].MinTemp;
                            info.MaxTemp = newList[0][i].MaxTemp;
                            newList[4].Add(info);
                            break;
                        }
                    }

                    dRain = 0;
                    for (int i = 0; i < dTable.Rows.Count; i++)
                    {
                        info = new OBTRealInfo();
                        dtF = dt;
                        DateTime.TryParse(dTable.Rows[i]["FORECASTTIME"].ToString(), out dtF);
                        info.ForecastDate = dtF;
                        d0 = 0;
                        double.TryParse(dTable.Rows[i]["t"].ToString(), out d0);
                        info.MinTemp = d0;
                        info.MaxTemp = d0;
                        d0 = 0;
                        double.TryParse(dTable.Rows[i]["rain"].ToString(), out d0);
                        info.Rain = d0;
                        info.Name = "卡尔曼滤波";
                        d0 = 0;
                        double.TryParse(dTable.Rows[i]["wspd"].ToString(), out d0);

                        info.Wind = d0;

                        dRain = dRain + info.Rain;
                        if (dtF.Hour == 8 || dtF.Hour == 14 || dtF.Hour == 20 || dtF.Hour == 2)
                        {
                            info.Rain = dRain;
                            dRain = 0;
                        }
                        else
                        {
                            info.Rain = -1;
                        }
                        if (dtR < dtF)
                        {
                            newList[4].Add(info);
                        }
                    }
                }
                dtF = dtStart.AddHours(-13);
                strSQL = "select   T2M t,rain,WDIR10M wdir,WSPD10M wspd,forecasttime from TOP_PRODUCT_VENUE_CAPS1 where ddatetime  =to_date('" + dtF.ToString("yyyy-MM-dd HH:00") + "','yyyy-mm-dd hh24:mi')  and VENUEID =" + venueID + "  order by FORECASTTIME";
                oh = new OracleHelper("EJETDB247LFSData");
                dTable = oh.ExecuteDataTable(strSQL);
                #region    原始方法注释
                /*
                if (dTable != null && dTable.Rows.Count > 0)
                {

                    OBTRealInfo infoHaps;
                    if (!hasHaps)
                    {
                        for (int i = 0; i < dTable.Rows.Count; i++)
                        {
                            infoHaps = new OBTRealInfo();
                            dtF = dt;
                            DateTime.TryParse(dTable.Rows[i]["FORECASTTIME"].ToString(), out dtF);
                            infoHaps.ForecastDate = dtF;

                            d0 = 0;
                            double.TryParse(dTable.Rows[i]["t"].ToString(), out d0);
                            infoHaps.MinTemp = d0;
                            infoHaps.MaxTemp = d0;
                            d0 = 0;
                            double.TryParse(dTable.Rows[i]["rain"].ToString(), out d0);
                            infoHaps.Rain = d0;
                            infoHaps.Name = "Haps";
                            d0 = 0;
                            double.TryParse(dTable.Rows[i]["wspd"].ToString(), out d0);
                            infoHaps.Wind = d0;

                            newList[2].Add(infoHaps);
                        }
                    }
                    else
                    {
                        for (int i = 0; i < dTable.Rows.Count; i++)
                        {
                            infoHaps = new OBTRealInfo();
                            dtF = dt;
                            DateTime.TryParse(dTable.Rows[i]["FORECASTTIME"].ToString(), out dtF);
                            infoHaps.ForecastDate = dtF;
                            if (dtF > dt)
                            {
                                break;
                            }

                            d0 = 0;
                            double.TryParse(dTable.Rows[i]["t"].ToString(), out d0);
                            infoHaps.MinTemp = d0;
                            infoHaps.MaxTemp = d0;
                            d0 = 0;
                            double.TryParse(dTable.Rows[i]["rain"].ToString(), out d0);
                            infoHaps.Rain = d0;
                            infoHaps.Name = "Haps";
                            d0 = 0;
                            double.TryParse(dTable.Rows[i]["wspd"].ToString(), out d0);
                            infoHaps.Wind = d0;

                            newList[2].Insert(i, infoHaps);
                        }
                    }
                }

                if (!hasData && newList[3].Count < 4)
                {
                    dtF = dtStart;

                    if (newList[3].Count > 0)
                    {
                        dtF = newList[3][newList[3].Count - 1].ForecastDate.AddHours(6);
                    }


                    OBTRealInfo info = new OBTRealInfo();

                    double maxRain = 0;
                    double minTemp = 0;
                    double maxTemp = 0;
                    double direct = 0;
                    double wind = 0;
                    int num = 0;
                    for (DateTime dtAA = dtF; dtAA <= dtStart.AddHours(18); dtAA = dtAA.AddHours(6))
                    {
                        maxRain = 0;
                        minTemp = 0;
                        maxTemp = 0;
                        direct = 0;
                        wind = 0;
                        if (newList[2] != null && newList[2].Count > 0)
                        {
                            for (int i = 0; i < newList[2].Count; i++)
                            {
                                if (newList[2][i].ForecastDate >= dtAA && newList[2][i].ForecastDate < dtAA.AddHours(6))
                                {
                                    if (newList[2][i].Rain > maxRain)
                                    {
                                        maxRain = newList[2][i].Rain;
                                    }
                                    if (minTemp == 0 || minTemp > newList[2][i].MinTemp)
                                    {
                                        minTemp = newList[2][i].MinTemp;
                                    }
                                    if (maxTemp == 0 || maxTemp < newList[2][i].MaxTemp)
                                    {
                                        maxTemp = newList[2][i].MaxTemp;
                                    }
                                    direct = newList[2][i].WindDirect;
                                    if (newList[2][i].Wind > wind)
                                    {
                                        wind = newList[2][i].Wind;
                                    }
                                }
                            }
                        }
                        if (maxTemp == 0)
                        {
                            if (newList[1] != null && newList[1].Count > 0)
                            {
                                for (int i = 0; i < newList[1].Count; i++)
                                {
                                    if (newList[1][i].ForecastDate >= dtAA && newList[1][i].ForecastDate < dtAA.AddHours(6))
                                    {
                                        if (newList[1][i].Rain > maxRain)
                                        {
                                            maxRain = newList[1][i].Rain;
                                        }
                                        if (minTemp == 0 || minTemp > newList[1][i].MinTemp)
                                        {
                                            minTemp = newList[1][i].MinTemp;
                                        }
                                        if (maxTemp == 0 || maxTemp < newList[1][i].MaxTemp)
                                        {
                                            maxTemp = newList[1][i].MaxTemp;
                                        }
                                        direct = newList[1][i].WindDirect;
                                        if (newList[1][i].Wind > wind)
                                        {
                                            wind = newList[1][i].Wind;
                                        }
                                    }
                                }
                            }
                        }
                        info = new OBTRealInfo();
                        info.ID = "晴";
                        if (maxRain > 0.05 && maxRain <= 1)
                        {
                            info.ID = "多云";
                        }
                        else if (maxRain > 1 && maxRain <= 30)
                        {
                            info.ID = "阵雨";

                        }
                        else if (maxRain > 30)
                        {
                            info.ID = "雷阵雨";

                        }
                        double.Parse(d0.ToString("F0"));
                        info.Name = "制作预报";
                        info.ForecastDate = dtAA;

                        info.MinTemp = double.Parse(minTemp.ToString("F0"));
                        info.MaxTemp = double.Parse(maxTemp.ToString("F0"));
                        info.Rain = maxRain;

                        //取10天预报逐六小时雨量
                        if (dtFirst != null && dtFirst.Rows.Count > 0)
                        {

                            if (num == 0)
                            {
                                info.Rain = Convert.ToDouble(dtFirst.Rows[0]["SIXHOURRAINTHREE"].ToString() == "" ? 0 : dtFirst.Rows[0]["SIXHOURRAINTHREE"]);
                            }
                            if (num == 1)
                            {
                                info.Rain = Convert.ToDouble(dtFirst.Rows[0]["SIXHOURRAINFOUR"].ToString() == "" ? 0 : dtFirst.Rows[0]["SIXHOURRAINFOUR"]);
                            }
                        }

                        info.Wind = wind;
                        info.WindName = GetWindSpeedClassNew(wind);
                        if (info.WindName != "≤3")
                        {
                            info.WindDirectName = getDirect(direct);
                        }
                        else
                        {
                            info.WindDirectName = "无";
                        }
                        newList[3].Add(info);
                    }
                }
                 * */
                #endregion
                #region 取降雨预报
                //
                //if (DateTime.Now >= dt)
                //{
                //    dtF = dt.AddHours(-2);
                //}
                //strSQL = "select  rain ,forecasttime from TOP_PRODUCT_VENUE_CAPS6 where ddatetime  =to_date('" + dtF.ToString("yyyy-MM-dd HH:00") + "','yyyy-mm-dd hh24:mi')  and VENUEID =" + venueID + "  and FORECASTTIME>to_date('" + dt.ToString("yyyy-MM-dd HH:mm") + "','yyyy-mm-dd hh24:mi') order by FORECASTTIME";
                //dTable = db_GreateDataTable("EJETDB247LFSData", strSQL);
                //if (dTable != null && dTable.Rows.Count > 0)
                //{
                //    for (int i = 0; i < dTable.Rows.Count; i++)
                //    {
                //        dtF = dt;
                //        DateTime.TryParse(dTable.Rows[i]["FORECASTTIME"].ToString(), out dtF);
                //        d0 = 0;
                //        double.TryParse(dTable.Rows[i]["rain"].ToString(), out d0);
                //        foreach (OBTRealInfo info in newList[2]) {
                //            if (info.ForecastDate == dtF.AddHours(-6) && info.Rain>=0)
                //            {
                //                info.Rain = d0;
                //            }
                //        }
                //        if (!hasData)
                //        { 

                //        }
                //    }
                //}
                #endregion
                dRain = 0;
                foreach (OBTRealInfo info in newList[2])
                {
                    dRain = dRain + info.Rain;
                    if (info.ForecastDate.Hour == 8 || info.ForecastDate.Hour == 14 || info.ForecastDate.Hour == 20 || info.ForecastDate.Hour == 2)
                    {
                        info.Rain = dRain;
                        dRain = 0;
                    }
                    else
                    {
                        info.Rain = -1;
                    }
                }

                #region 原始方法
                /*
                if (!hasData)
                {
                    if (!hasPreData)
                    {
                        foreach (OBTRealInfo info in newList[3])
                        {
                            foreach (OBTRealInfo infoHaps in newList[2])
                            {
                                if (infoHaps.ForecastDate == info.ForecastDate)
                                {
                                    info.Rain = infoHaps.Rain;
                                    break;
                                }
                            }
                        }
                    }
                    else if (dt.Hour == 6 || dt.Hour == 16)
                    {
                        for (int i = 2; i < 4; i++)
                        {
                            foreach (OBTRealInfo infoHaps in newList[2])
                            {
                                if (infoHaps.ForecastDate == newList[3][i].ForecastDate)
                                {
                                    newList[3][i].Rain = infoHaps.Rain;
                                    break;
                                }
                            }
                        }
                    }
                }
                */
                #endregion
            }
            catch (Exception ex)
            {
                OracleHelper.ErrWriter(ex);
            }
            return newList;
        }

        //取分区预报数据
        public List<OBTRealInfo> GetAreaWeatherHourInfoList(DateTime dt, string areaName)
        {
            List<OBTRealInfo> newList = null;
            try
            {
                DataTable zd_dt = GetT_citywf_scmoc(dt);


                DataTable dTable = null;
                DateTime dtF = dt;
                double d0 = 0;
                //取逐时预报 
                // string strSQL = "select * from lfs_areaweatherhour where ddatetime = to_date('" + dt.ToString("yyyy-MM-dd HH:mm") + "','yyyy-mm-dd hh24:mi') and AREANAME = '" + areaName + "' order by FORECASTTIME";
                //  dTable = db_GreateDataTable("EJETDB247LFSData", strSQL);

                if (zd_dt != null)
                {
                    newList = new List<OBTRealInfo>();
                    foreach (DataRow item in zd_dt.Rows)
                    {
                        OBTRealInfo obt = new OBTRealInfo();
                        int ybsx = Convert.ToInt32(item["YBSX"]);
                        DateTime fdate = Convert.ToDateTime(item["DDATETIME"]);
                        obt.ForecastDate = fdate.AddHours(ybsx);
                        obt.DDateTime = Convert.ToDateTime(item["DDATETIME"]);
                        obt.Ybxy = ybsx;
                        double mint = 0;
                        double maxt = 0;
                        double.TryParse(item["MINT"].ToString(), out mint);
                        double.TryParse(item["MAXT"].ToString(), out maxt);
                        double frain = 0;
                        double.TryParse(item["R12H"].ToString(), out frain);
                        double wd = 0;
                        double.TryParse(item["WF"].ToString(), out wd);
                        obt.Wind10M = wd;
                        obt.MaxTemp = maxt;
                        obt.MinTemp = mint;
                        obt.Rain01D = frain;
                        obt.ForecastDate = Convert.ToDateTime(fdate.AddHours(ybsx));
                        obt.ID = "1";
                        newList.Add(obt);

                    }

                    #region
                    /* if (dTable != null && dTable.Rows.Count > 0)
                     {
                   

                             foreach (DataRow dr in dTable.Rows)
                             {
                           
                                     OBTRealInfo obt = new OBTRealInfo();
                                     obt.Name = "制作预报";
                                     dtF = dt;
                                     DateTime.TryParse(dr["FORECASTTIME"].ToString(), out dtF);
                                     obt.ForecastDate = dtF;
                                     d0 = 0;
                                     double.TryParse(dr["HUMIDITY"].ToString(), out d0);
                                     obt.Humidity = double.Parse(d0.ToString("F0"));
                                     d0 = 0;
                                     double.TryParse(dr["TEMPERATURE"].ToString(), out d0);
                                     obt.Temp = double.Parse(d0.ToString("F0"));

                                     d0 = 0;
                                     double.TryParse(dr["RAIN"].ToString(), out d0);
                                     obt.Rain = d0;
                                     d0 = 0;
                                     double.TryParse(dr["WINDSPEED"].ToString(), out d0);
                                     obt.Wind = d0;

                                     obt.WindDirectName = dr["WINDDIRECT"].ToString();
                                     obt.ID = "2";
                                     obt.ObtTableName = "/Images/icon/" + dr["WEATHERPIC"].ToString();
                                     newList.Add(obt);
                            
                             }
                      
                    
                     }*/
                }
                else
                {
                    /* if (dTable != null && dTable.Rows.Count > 0)
                     {
                         newList = new List<OBTRealInfo>();
                         for (int i = 0; i < dTable.Rows.Count; i++)
                         {
                             newList.Add(new OBTRealInfo());
                             newList[i].Name = "制作预报";
                             dtF = dt;
                             DateTime.TryParse(dTable.Rows[i]["FORECASTTIME"].ToString(), out dtF);
                             newList[i].ForecastDate = dtF;
                             d0 = 0;
                             double.TryParse(dTable.Rows[i]["HUMIDITY"].ToString(), out d0);
                             newList[i].Humidity = double.Parse(d0.ToString("F0"));
                             d0 = 0;
                             double.TryParse(dTable.Rows[i]["TEMPERATURE"].ToString(), out d0);
                             newList[i].Temp = double.Parse(d0.ToString("F0"));

                             d0 = 0;
                             double.TryParse(dTable.Rows[i]["RAIN"].ToString(), out d0);
                             newList[i].Rain = d0;
                             d0 = 0;
                             double.TryParse(dTable.Rows[i]["WINDSPEED"].ToString(), out d0);
                             newList[i].Wind = d0;
                             newList[i].ID = "2";
                             newList[i].WindDirectName = dTable.Rows[i]["WINDDIRECT"].ToString();
                             newList[i].ID = dTable.Rows[i]["WEATHERSTATUS"].ToString();
                             newList[i].ObtTableName = "/Images/icon/" + dTable.Rows[i]["WEATHERPIC"].ToString(); ;
                         }
                     }*/
                }
                    #endregion
            }
            catch (Exception ex)
            {
                OracleHelper.ErrWriter(ex);
            }
            return newList;
        }


        //取中心库的指导预报
        public DataTable GetT_citywf_scmoc(DateTime times)
        {
            DataTable dt = null;

            try
            {
                if (times.Hour.Equals(6) || times.Hour.Equals(10))
                {
                    times = Convert.ToDateTime(times.ToString("yyyy-MM-dd") + " 08:00:00");
                }
                else if (times.Hour.Equals(16) || times.Hour.Equals(15))
                {
                    times = Convert.ToDateTime(times.ToString("yyyy-MM-dd") + " 20:00:00");
                }
                string sql = "select T,U,WD,WF,R,R12H,MINT,MAXT,YBSX,DDATETIME from t_citywf_scmoc where cityid=59493 and ddatetime " +
    "= to_date('" + times.ToString("yyyy-MM-dd HH:mm") + "','yyyy-mm-dd hh24:mi') order by YBSX";
                OracleHelper oh = new OracleHelper("SZQX13ConnectionString");
                DataSet ds = oh.ExecuteDataSet(sql);
                if (ds != null)
                {
                    if (ds.Tables[0].Rows.Count > 0)
                    {
                        dt = ds.Tables[0];
                    }
                }
            }
            catch (Exception ex)
            {

                OracleHelper.ErrWriter(ex);
            }
            return dt;
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

        #endregion


        #region 上网文件查询
        /// <summary>
        /// 获取历史上网文件
        /// </summary>
        /// <param name="Strdt">开始时间</param>
        /// <param name="Strdt2">结束时间</param>
        /// <param name="Max">显示最多条数</param>
        /// <param name="Min">重第几条开始显示</param>
        /// <returns></returns>

        public List<ScoreInfo> GetCityUploadInfoList(string Strdt, string Strdt2, int Max, int Min)
        {
            DateTime dt = DateTime.Parse(Strdt + " 0:00:00");
            DateTime dt2 = DateTime.Parse(Strdt2 + " 23:59:59");
            try
            {
                //string strSQL = "select * from lfs_cityweather  where ddatetime between to_date('" + dt.ToString("yyyy-MM-dd HH:mm") + "','yyyy-mm-dd hh24:mi') and  to_date('" + dt2.ToString("yyyy-MM-dd HH:mm") + "','yyyy-mm-dd hh24:mi') order by recid desc";
                string strSQL = "select * from (select a.*, ROWNUM rn from( select *  from lfs_cityweather where ddatetime between to_date('" + dt.ToString("yyyy-MM-dd HH:mm") + "', 'yyyy-mm-dd hh24:mi') and  to_date('" + dt2.ToString("yyyy-MM-dd HH:mm") + "', 'yyyy-mm-dd hh24:mi') order by recid desc) a  WHERE ROWNUM <= " + Max + ") WHERE rn >= " + Min;
                OracleHelper oh = new OracleHelper("HAIKOUConnect");
                DataTable dTable = oh.ExecuteDataTable(strSQL);
                if (dTable != null && dTable.Rows.Count > 0)
                {
                    ScoreInfo info;
                    int isEdit = 0;
                    List<ScoreInfo> infoList = new List<ScoreInfo>();
                    DateTime dtF;
                    for (int i = 0; i < dTable.Rows.Count; i++)
                    {
                        info = new ScoreInfo();
                        info.ScoreName = dTable.Rows[i]["ddatetime"].ToString();
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
                        info.Score2 = "保存";//状态：保存，上传成功
                        info.Score3 = dTable.Rows[i]["WRITETIME"].ToString();
                        info.Score7 = dTable.Rows[i]["FORECASTER"].ToString();
                        info.Score6 = "False";
                        if (!Convert.IsDBNull(dTable.Rows[i]["PUSHTIME"]))
                        {
                            dtF = DateTime.Parse("2001-1-1");
                            DateTime.TryParse(info.ScoreName, out dtF);
                            info.Score4 = dTable.Rows[i]["PUSHTIME"].ToString();
                            info.Score5 = dtF.ToString("yyyyMMdd") + "/" + dTable.Rows[i]["FILENAME"].ToString();
                            info.Score6 = "True";
                            info.Score2 = "上传成功";
                        }
                        infoList.Add(info);
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

        public int GetCityUploadInfoListCount(string Strdt, string Strdt2)
        {
            int counts = 23;
            DateTime dt = DateTime.Parse(Strdt + " 0:00:00");
            DateTime dt2 = DateTime.Parse(Strdt2 + " 23:59:59");
            try
            {
                string strSQL = "select count(*) from lfs_cityweather  where ddatetime between to_date('" + dt.ToString("yyyy-MM-dd HH:mm") + "','yyyy-mm-dd hh24:mi') and  to_date('" + dt2.ToString("yyyy-MM-dd HH:mm") + "','yyyy-mm-dd hh24:mi') order by recid desc";
                OracleHelper oh = new OracleHelper("HAIKOUConnect");
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


        #region 验证提示信息
        public string ShowMes(DateTime DDateTime)
        {
            string StrMes = "";
            try
            {

                List<List<OBTRealInfo>> m_WeatherInfoList = GetCityForecastInfoList(DDateTime, Convert.ToDateTime("0001 - 01 - 01"));

                List<WelfareForecastInfo> obs_12hour = GetHour12weatherhourByTime(DDateTime, "福田区");
                if (DDateTime.Hour != 6)
                {
                    if (obs_12hour == null || obs_12hour.Count == 0)
                    {
                        StrMes = "天气状况与逐12时预报不符！确定继续预览吗？";
                    }
                }


                if (m_WeatherInfoList[3].Count == 4 && obs_12hour.Count >= 2)
                {

                    for (int i = 0; i < 2; i++)
                    {
                        int index = i;
                        if (i == 1)
                        {
                            index = 2;
                        }

                        //double 类型的0.1+0.2 = 0.30000000000000004， 所以用decimal 类型
                        if (Convert.ToDecimal(m_WeatherInfoList[3][index].Rain + m_WeatherInfoList[3][index + 1].Rain) != Convert.ToDecimal(obs_12hour[i].Rain))
                        {
                            StrMes = "天气状况与逐12时预报不符！确定继续预览吗？";
                        }

                        if (obs_12hour[i].Weather == "晴" || obs_12hour[i].Weather == "多云" || obs_12hour[i].Weather == "阴"
                        || obs_12hour[i].Weather == "雾" || obs_12hour[i].Weather == "霾")
                        {

                            if (m_WeatherInfoList[3][index].ID != obs_12hour[i].Weather && m_WeatherInfoList[3][index + 1].ID != obs_12hour[i].Weather)
                            {
                                StrMes = "天气状况与逐12时预报不符！确定继续预览吗？";
                            }
                        }

                        if (obs_12hour[i].Weather.Contains("雨"))
                        {
                            if (!m_WeatherInfoList[3][index].ID.Contains("雨") && !m_WeatherInfoList[3][index + 1].ID.Contains("雨"))
                            {
                                StrMes = "天气状况与逐12时预报不符！确定继续预览吗？";
                            }
                        }
                    }

                }
                if (Get12Hour6HourCheck(DDateTime, m_WeatherInfoList[3], true))
                {
                    StrMes = "";
                }
                else
                {
                    StrMes = "最高、最低温度与逐12时预报不符，请查正！是否继续预览？";
                }
            }
            catch (Exception)
            {

                throw;
            }
            return StrMes;
        }


        public bool Get12Hour6HourCheck(DateTime dt, List<OBTRealInfo> infoList, bool isHour6)
        {
            try
            {
                string strSQL;
                DateTime dtF;
                double d0;
                double d1;

                List<double> dList;
                DataTable dTable;
                if (!isHour6)
                {//取逐6时
                    strSQL = "select * from lfs_cityweatherhour where ddatetime = to_date('" + dt.ToString("yyyy-MM-dd HH:mm") + "','yyyy-mm-dd hh24:mi')   order by FORECASTTIME";
                    OracleHelper oh = new OracleHelper("EJETDB247LFSData");
                    dTable = oh.ExecuteDataTable(strSQL);
                    if (dTable != null && dTable.Rows.Count > 0)
                    {
                        foreach (OBTRealInfo info in infoList)
                        {
                            for (int i = 0; i < dTable.Rows.Count; i++)
                            {
                                dtF = dt;
                                DateTime.TryParse(dTable.Rows[i]["FORECASTTIME"].ToString(), out dtF);
                                if (dtF == info.ForecastDate && i < (dTable.Rows.Count - 3))
                                {
                                    dList = new List<double>();
                                    double.TryParse(dTable.Rows[i]["MinTEMPERATURE"].ToString(), out d0);
                                    dList.Add(d0);
                                    double.TryParse(dTable.Rows[i + 1]["MinTEMPERATURE"].ToString(), out d0);
                                    dList.Add(d0);
                                    double.TryParse(dTable.Rows[i + 2]["MinTEMPERATURE"].ToString(), out d0);
                                    dList.Add(d0);
                                    double.TryParse(dTable.Rows[i + 3]["MinTEMPERATURE"].ToString(), out d0);
                                    dList.Add(d0);
                                    if (info.MinTemp != dList.Min())
                                    {
                                        return false;
                                    }
                                    dList = new List<double>();
                                    double.TryParse(dTable.Rows[i]["MaxTEMPERATURE"].ToString(), out d0);
                                    dList.Add(d0);
                                    double.TryParse(dTable.Rows[i + 1]["MaxTEMPERATURE"].ToString(), out d0);
                                    dList.Add(d0);
                                    double.TryParse(dTable.Rows[i + 2]["MaxTEMPERATURE"].ToString(), out d0);
                                    dList.Add(d0);
                                    double.TryParse(dTable.Rows[i + 3]["MaxTEMPERATURE"].ToString(), out d0);
                                    dList.Add(d0);
                                    if (info.MaxTemp != dList.Max())
                                    {
                                        return false;
                                    }
                                    break;
                                }
                            }
                        }
                    }
                }
                else
                {
                    strSQL = "select * from lfs_hour12weatherhour where ddatetime = to_date('" + dt.ToString("yyyy-MM-dd HH:mm") + "','yyyy-mm-dd hh24:mi') and AREANAME = '福田区' order by FORECASTTIME";
                    OracleHelper oh = new OracleHelper("EJETDB247LFSData");
                    dTable = oh.ExecuteDataTable(strSQL);
                    if (dTable != null && dTable.Rows.Count > 0)
                    {


                        if (!DateTime.TryParse(dTable.Rows[0]["FORECASTTIME"].ToString(), out dtF)) return true;

                        double.TryParse(dTable.Rows[0]["MINTEMPERATURE"].ToString(), out d0);
                        double.TryParse(dTable.Rows[0]["MAXTEMPERATURE"].ToString(), out d1);

                        for (int j = 0; j < infoList.Count; j++)
                        {
                            if (dtF == infoList[j].ForecastDate && j < (infoList.Count - 1))
                            {
                                if (d0 != infoList.Min(pkm => pkm.MinTemp))
                                {
                                    return false;
                                }
                                if (d1 != infoList.Max(pkm => pkm.MaxTemp))
                                {
                                    return false;
                                }
                                break;
                            }
                        }

                    }
                }
            }
            catch (Exception ex)
            {
                OracleHelper.ErrWriter(ex);
            }

            return true;
        }



        //按时次取福田逐12时数据为验证逐6时数据
        public List<WelfareForecastInfo> GetHour12weatherhourByTime(DateTime dt, string strName)
        {
            List<WelfareForecastInfo> ls = null;
            try
            {
                string sql = "select WEATHERSTATUS,RAIN,FORECASTTIME from lfs_hour12weatherhour where DDATETIME=to_date('" + dt.ToString("yyyy-MM-dd HH:mm") + "','yyyy-mm-dd hh24:mi') and AREANAME='" + strName + "' order by FORECASTTIME";
                OracleHelper oh = new OracleHelper("EJETDB247LFSData");
                DataTable dTable = oh.ExecuteDataTable(sql);
                if (dTable != null)
                {
                    ls = new List<WelfareForecastInfo>();
                    foreach (DataRow item in dTable.Rows)
                    {
                        WelfareForecastInfo wf = new WelfareForecastInfo();
                        wf.ForecastDate = Convert.ToDateTime(item["FORECASTTIME"]);
                        wf.Weather = item["WEATHERSTATUS"].ToString();
                        wf.Rain = item["RAIN"].ToString();
                        ls.Add(wf);
                    }
                }

            }
            catch (Exception ex)
            {

                OracleHelper.ErrWriter(ex);
            }
            return ls;
        }


        #endregion

        //保存全市预报
        public bool InsertCityWeatherInfoList(DateTime dt, List<OBTRealInfo> hourInfo, string strForecaster, int ISCORRECT)
        {
            try
            {
                string strSQL = "";
                int isEdit = 0;
                string strRecID = "";
                int iResult = 0;
                if (hourInfo == null || hourInfo.Count <= 0) return false;
                foreach (OBTRealInfo dataInfo in hourInfo)
                {
                    strSQL = "select recid from LFS_CityWEATHERHOUR where DDATETIME=to_date('" + dt.ToString("dd-MM-yyyy HH:mm:ss") + "', 'dd-mm-yyyy hh24:mi:ss')   and FORECASTTIME=to_date('" + dataInfo.ForecastDate.ToString("dd-MM-yyyy HH:mm:ss") + "', 'dd-mm-yyyy hh24:mi:ss') ";
                    //OracleHelper oh = new OracleHelper("EJETDB247LFSData");
                    OracleHelper oh = new OracleHelper("HAIKOUConnect");
                    strRecID = oh.db_GreateQuery(strSQL);
                    if (!int.TryParse(strRecID, out iResult))
                    {
                        strSQL = "insert into LFS_CityWEATHERHOUR (RECID,DDATETIME,WEATHERSTATUS,RAIN,WINDSPEED,WINDCLASS,WINDDIRECT,MINTEMPERATURE,MAXTEMPERATURE,FORECASTTIME) values (SEQ_LFS_CityWEATHERHOUR.NEXTVAL"
                                          + ",to_date('" + dt.ToString("dd-MM-yyyy HH:mm:ss") + "', 'dd-mm-yyyy hh24:mi:ss') "
                                          + ",'" + dataInfo.ID + "'"
                                          + ", " + dataInfo.Rain.ToString("F1") + " "
                                          + ", " + dataInfo.Wind.ToString("F1") + " "
                                           + ", '" + dataInfo.WindName + "' "
                                          + ", '" + dataInfo.WindDirectName + "' "
                                          + ", " + dataInfo.MinTemp.ToString("F1") + " "
                                          + ", " + dataInfo.MaxTemp.ToString("F1") + " "
                                          + ",to_date('" + dataInfo.ForecastDate.AddHours(8).ToString("dd-MM-yyyy HH:mm:ss") + "', 'dd-mm-yyyy hh24:mi:ss') "
                                          + ")";
                    }
                    else
                    {
                        strSQL = "update LFS_CityWEATHERHOUR set  WEATHERSTATUS='" + dataInfo.ID + "'"
                            + ",RAIN=" + dataInfo.Rain.ToString("F1")
                            + ",WINDSPEED=" + dataInfo.Wind.ToString("F1")
                            + ",WINDCLASS= '" + dataInfo.WindName + "' "
                            + ",WINDDIRECT= '" + dataInfo.WindDirectName + "' "
                            + ",MINTEMPERATURE=" + dataInfo.MinTemp.ToString("F1")
                            + ",MAXTEMPERATURE=" + dataInfo.MaxTemp.ToString("F1")
                            + "  where recid=" + strRecID;
                    }
                    //oh = new OracleHelper("EJETDB247LFSData");
                    oh = new OracleHelper("HAIKOUConnect");
                    iResult = oh.db_ExecuteNonQuery(strSQL);
                    if (iResult <= 0)
                        return false;
                }

                if (iResult > 0)
                {
                    strSQL = "select recid from LFS_CityWEATHER where DDATETIME=to_date('" + dt.ToString("dd-MM-yyyy HH:mm:ss") + "', 'dd-mm-yyyy hh24:mi:ss') ";
                    //OracleHelper oh = new OracleHelper("EJETDB247LFSData");
                    OracleHelper oh = new OracleHelper("HAIKOUConnect");
                    strRecID = oh.db_GreateQuery(strSQL);

                    if (strRecID.Length > 0)
                    {
                        isEdit = 1;
                    }
                    strSQL = "insert into LFS_CityWEATHER (RECID,DDATETIME,FORECASTER,WRITETIME,ISEDIT,ISCORRECT) values (SEQ_LFS_CityWEATHER.NEXTVAL"
                                                   + ",to_date('" + dt.ToString("dd-MM-yyyy HH:mm:ss") + "', 'dd-mm-yyyy hh24:mi:ss') "
                                                   + ",'" + strForecaster + "'"
                                                   + ",to_date('" + DateTime.Now.ToString("dd-MM-yyyy HH:mm:ss") + "', 'dd-mm-yyyy hh24:mi:ss') "
                                                   + "," + isEdit + ""
                                                     + "," + ISCORRECT + ""
                                                   + ")";
                    //oh = new OracleHelper("EJETDB247LFSData"); 
                    oh = new OracleHelper("HAIKOUConnect");
                    iResult = oh.db_ExecuteNonQuery(strSQL);
                    if (iResult > 0) return true;
                }
            }
            catch (Exception ex)
            {
                OracleHelper.ErrWriter(ex);
            }
            return false;
        }

        #region 上网文件数据显示处理
        //上网文件数据
        public string ShowPreview(DateTime DDateTime, int isCorrect)
        {
            List<OBTRealInfo> m_WeatherInfoList = GetCityForecastInfoList(DDateTime, Convert.ToDateTime("0001-01-01"))[3];
            string content = "";
            try
            {
                if (m_WeatherInfoList == null || m_WeatherInfoList.Count == 0) return content = "暂无数据";
                string strContent = "";
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
                    case 16:
                        strTime1 = DDateTime.ToString("dd") + "0830";
                        strTime2 = strYYYYMMDD + "12";
                        break;

                }


                strContent += "ZCZC" + "\n";
                if (isCorrect == 0)
                {
                    strContent += "FSCI50 BFSE " + strTime1 + "\n";
                }
                else
                {
                    strContent += "FSCI50 BFSE " + strTime1 + " CCA \n";
                }
                strContent += strTime2 + "时深圳6小时精细化预报产品" + "\n";
                strContent += "SPCC6H  " + strTime2 + "\n";
                strContent += "6" + "\n";
                strContent += "621 622 623 624 625 626" + "\n";
                strContent += "1" + "\n";
                strContent += "59493   114.003611    22.541666    63.9    4" + "\n";

                string codeWeather = "";
                string minTemp = "";
                string maxTemp = "";
                string codeWind = "";
                string codeDirect = "";
                string rain = "";


                List<string> hourList = new List<string> { "006", "012", "018", "024" };

                string str0 = "";
                for (int i = 0; i < m_WeatherInfoList.Count; i++)
                {

                    codeWeather = "00";
                    str0 = GetItemCode("天气现象", m_WeatherInfoList[i].ID);
                    if (str0 != null && str0.Length > 0)
                    {
                        codeWeather = str0;
                    }
                    minTemp = m_WeatherInfoList[i].MinTemp.ToString("F1");
                    maxTemp = m_WeatherInfoList[i].MaxTemp.ToString("F1");
                    codeWind = "0";
                    str0 = GetItemCode("风力", m_WeatherInfoList[i].WindName);
                    if (str0 != null && str0.Length > 0)
                    {
                        codeWind = str0;
                    }
                    codeDirect = "0";
                    str0 = GetItemCode("风向", m_WeatherInfoList[i].WindDirectName);
                    if (str0 != null && str0.Length > 0)
                    {
                        codeDirect = str0;
                    }
                    rain = "9999";

                    if (m_WeatherInfoList[i].Rain > 0)
                    {
                        rain = m_WeatherInfoList[i].Rain.ToString("F1");
                    }
                    strContent += hourList[i] + "       " + codeWeather + "    " + maxTemp + "    " + minTemp + "       " + codeDirect + "       " + codeWind + "     " + rain + "\n";
                }

                strContent += "NNNN";
                content = strContent;
            }
            catch (Exception ex)
            {
                OracleHelper.ErrWriter(ex);
            }
            return content;
        }

        //zhou
        public string ShowPreview2(List<OBTRealInfo> hourInfo, string DDateTime, int isCorrect)
        {
            List<OBTRealInfo> m_WeatherInfoList = hourInfo;
            DateTime dt = Convert.ToDateTime(DDateTime);
            string content = "";
            try
            {
                if (m_WeatherInfoList == null || m_WeatherInfoList.Count == 0)
                    return content = "暂无数据";

                string strContent = "";
                string strTime1 = "";
                string strTime2 = "";
                string strYYYYMMDD = dt.ToString("yyyyMMdd");

                switch (dt.Hour)
                {
                    case 6:
                        strTime1 = dt.AddDays(-1).ToString("dd") + "2245";
                        strTime2 = strYYYYMMDD + "00";
                        break;
                    case 10:
                        strTime1 = dt.ToString("dd") + "0230";
                        strTime2 = strYYYYMMDD + "00";
                        break;
                    case 16:
                        strTime1 = dt.ToString("dd") + "0830";
                        strTime2 = strYYYYMMDD + "12";
                        break;

                }


                strContent += "ZCZC" + "\n";
                if (isCorrect == 0)
                {
                    strContent += "FSCI50 BFSE " + strTime1 + "\n";
                }
                else
                {
                    strContent += "FSCI50 BFSE " + strTime1 + " CCA \n";
                }
                strContent += strTime2 + "时海口6小时精细化预报产品" + "\n";
                strContent += "SPCC6H  " + strTime2 + "\n";
                strContent += "6" + "\n";
                strContent += "621 622 623 624 625 626" + "\n";
                strContent += "1" + "\n";
                strContent += "59493   114.003611    22.541666    63.9    4" + "\n";

                string codeWeather = "";
                string minTemp = "";
                string maxTemp = "";
                string codeWind = "";
                string codeDirect = "";
                string rain = "";


                List<string> hourList = new List<string> { "006", "012", "018", "024" };

                string str0 = "";
                for (int i = 0; i < m_WeatherInfoList.Count; i++)
                {

                    codeWeather = "00";
                    str0 = GetItemCode("天气现象", m_WeatherInfoList[i].ID);
                    if (str0 != null && str0.Length > 0)
                    {
                        codeWeather = str0;
                    }
                    minTemp = m_WeatherInfoList[i].MinTemp.ToString("F1");
                    maxTemp = m_WeatherInfoList[i].MaxTemp.ToString("F1");
                    codeWind = "0";
                    str0 = GetItemCode("风力", m_WeatherInfoList[i].WindName);
                    if (str0 != null && str0.Length > 0)
                    {
                        codeWind = str0;
                    }
                    codeDirect = "0";
                    str0 = GetItemCode("风向", m_WeatherInfoList[i].WindDirectName);
                    if (str0 != null && str0.Length > 0)
                    {
                        codeDirect = str0;
                    }
                    rain = "9999";

                    if (m_WeatherInfoList[i].Rain > 0)
                    {
                        rain = m_WeatherInfoList[i].Rain.ToString("F1");
                    }
                    strContent += hourList[i] + "       " + codeWeather + "    " + maxTemp + "    " + minTemp + "       " + codeDirect + "       " + codeWind + "     " + rain + "\n";
                }

                strContent += "NNNN";
                content = strContent;
            }
            catch (Exception ex)
            {
                OracleHelper.ErrWriter(ex);
            }
            return content;
        }


        //气象等级
        private string GetItemCode(string strType, string strItem)
        {
            string strReturn = "0";
            try
            {
                List<string> itemList = null;
                List<string> codeList = null;
                switch (strType)
                {
                    case "天气现象":
                        strReturn = "00";
                        itemList = new List<string> { "晴", "多云", "阴", "阵雨", "雷阵雨", "雷阵雨并伴有冰雹", "雨夹雪", "阵雪", "雾", "冻雨", "沙尘暴", "浮尘", "扬沙", "强沙尘暴", "雨", "雪" };
                        codeList = new List<string> { "00", "01", "02", "03", "04", "05", "06", "13", "18", "19", "20", "29", "30", "31", "32", "33" };

                        break;
                    case "风向":
                        strReturn = "0";
                        itemList = new List<string> { "东北", "东", "东南", "南", "西南", "西", "西北", "北", "旋转" };
                        codeList = new List<string> { "1", "2", "3", "4", "5", "6", "7", "8", "9" };
                        break;
                    case "风力":
                        strReturn = "0";
                        itemList = new List<string> { "≤3", "3-4", "4-5", "5-6", "6-7", "7-8", "8-9", "9-10", "10-11", "11-12" };
                        codeList = new List<string> { "0", "1", "2", "3", "4", "5", "6", "7", "8", "9" };
                        break;
                }
                if (itemList != null && codeList != null)
                {
                    int indexItem = itemList.IndexOf(strItem);
                    if (indexItem >= 0) strReturn = codeList[indexItem];
                }
            }
            catch (Exception ex)
            {
                OracleHelper.ErrWriter(ex);
            }
            return strReturn;

        }

        #endregion

        #region   实况信息
        /// <summary>
        /// 获取遥测站实况信息
        /// </summary>
        /// <param name="dt"></param>
        /// <returns></returns>
        public List<OBTRealInfo> GetHour6OBTRealInfo(DateTime dt)
        {

            try
            {
                if (dt.Date < DateTime.Now.Date)
                {

                    DateTime dtStart = DateTime.Parse(dt.ToString("yyyy-MM-dd 08:00"));
                    switch (dt.Hour)
                    {
                        case 6:
                            dtStart = DateTime.Parse(dt.ToString("yyyy-MM-dd 08:00"));
                            break;
                        case 10:
                            dtStart = DateTime.Parse(dt.ToString("yyyy-MM-dd 08:00"));
                            break;
                        case 16:
                            dtStart = DateTime.Parse(dt.ToString("yyyy-MM-dd 20:00"));
                            break;
                    }
                    List<OBTRealInfo> infoList = new List<OBTRealInfo>();
                    string strSQL;
                    double d0;
                    OBTRealInfo info;
                    DataTable dtReal;
                    for (int i = 0; i < 24; i = i + 6)
                    {
                        info = new OBTRealInfo();
                        info.ForecastDate = dtStart.AddHours(i);
                        strSQL = "select max(MAXTEMP) MaxTemp ,min(MINTEMP) MinTemp,max(WINDV10MS) Wind from T_LOCALOSSMOB01   where   ddatetime between to_date('" + dtStart.AddHours(i).ToString("dd-MM-yyyy HH:01:ss") + "', 'dd-mm-yyyy hh24:mi:ss') and to_date('" + dtStart.AddHours(i + 6).ToString("dd-MM-yyyy HH:mm:ss") + "', 'dd-mm-yyyy hh24:mi:ss') and OSSMOID=1 ";
                        OracleHelper oh = new OracleHelper("HAIKOUConnect");
                        dtReal = oh.ExecuteDataTable(strSQL);
                        if (dtReal != null && dtReal.Rows.Count > 0)
                        {
                            d0 = -1;
                            double.TryParse(dtReal.Rows[0]["MaxTemp"].ToString(), out d0);
                            info.MaxTemp = Math.Round(d0 * 0.1);
                            d0 = 0;
                            double.TryParse(dtReal.Rows[0]["MinTemp"].ToString(), out d0);
                            info.MinTemp = Math.Round(d0 * 0.1, 2);
                            d0 = 0;
                            double.TryParse(dtReal.Rows[0]["Wind"].ToString(), out d0);
                            info.Wind = Math.Round(d0 * 0.1, 2);
                            info.WindName = GetWindSpeedClassNew(info.Wind);
                        }
                        strSQL = "select R06H as Rain from t_localossmomin   where   ddatetime = to_date('" + dtStart.AddHours(i + 6).ToString("dd-MM-yyyy HH:01:ss") + "', 'dd-mm-yyyy hh24:mi:ss') and OSSMOID=1";
                        dtReal = oh.ExecuteDataTable(strSQL);
                        if (dtReal != null && dtReal.Rows.Count > 0)
                        {
                            double.TryParse(dtReal.Rows[0]["Rain"].ToString(), out d0);
                            info.Rain = Math.Round(d0 * 0.1, 2);
                        }
                        infoList.Add(info);
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
        #endregion



    }
}
