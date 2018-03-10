using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Data.OracleClient;
using System.Data;
using Maticsoft.DBUtility;
using Models;
using System.Net;
using System.IO;

namespace DAL
{
    public class DefaultService
    {

        #region GetGDWarningInfo():广东省内预警信号

        public List<List<WarningInfo>> GetGDWarningInfo()
        {
            List<List<WarningInfo>> newList = new List<List<WarningInfo>>();
            try
            {
                string strSQL = "select * from T_GDALARM "
                    + " where  sysdate-ddatetime<530 and signcolor<>'0' and keyid not in ("
                    + " select a.keyid from (select ddatetime,citycode,signname,signcolor,keyid from T_GDALARM "
                    + " where sysdate-ddatetime<530 and signcolor<>'0')a,(select ddatetime,citycode,signname,signcolor,keyid from T_GDALARM "
                    + " where sysdate-ddatetime<530 and signcolor='0') b"
                    + " where a.ddatetime<b.ddatetime and a.citycode =b.citycode and a.signname=b.signname"
                    + " ) "
                    + " order by  citycode,ddatetime ";
                var ds = DbHelperOra.Query(strSQL, CommonClass.GetconnectionStringsValue("SZQX13ConnectionString"));
                if (ds == null) return null;
                DataTable dbWarning = ds.Tables[0];
                strSQL = " select * from T_AREACODE ";

                DataTable dbArea = DbHelperOra.Query(strSQL, CommonClass.GetconnectionStringsValue("OraConString")).Tables[0];
                for (int i = 0; i < dbWarning.Rows.Count; i++)
                {
                    bool isExist = false;
                    WarningInfo newInfo = new WarningInfo();
                    newInfo.IssueContent = dbWarning.Rows[i]["citycode"].ToString();
                    // newInfo.IssueState = dbWarning.Rows[i]["areaname"].ToString();
                    newInfo.IssueTime = DateTime.Parse(dbWarning.Rows[i]["ddatetime"].ToString());
                    newInfo.SignalType = dbWarning.Rows[i]["signname"].ToString();
                    newInfo.SignalLevel = dbWarning.Rows[i]["signcolor"].ToString();

                    foreach (List<WarningInfo> listW in newList)
                    {
                        if (listW.Count > 0)
                        {
                            if (listW[0].IssueContent.Equals(newInfo.IssueContent))
                            {
                                listW.Add(newInfo);
                                isExist = true;

                            }
                        }
                        if (isExist) break;
                    }
                    if (!isExist)
                    {
                        List<WarningInfo> infoW = new List<WarningInfo>();
                        infoW.Add(newInfo);
                        newList.Add(infoW);
                    }

                }

                foreach (List<WarningInfo> listW in newList)
                {

                    if (listW.Count > 0)
                    {
                        bool isExist = false;
                        for (int i = 0; i < dbArea.Rows.Count; i++)
                        {
                            if (listW[0].IssueContent.Equals(dbArea.Rows[i]["citycode"].ToString()))
                            {
                                foreach (WarningInfo info in listW)
                                {
                                    info.IssueState = dbArea.Rows[i]["areaname"].ToString();
                                    info.Diff = dbArea.Rows[i]["LONGITUDE"].ToString();
                                    info.District = dbArea.Rows[i]["LATITUDE"].ToString();
                                }
                                isExist = true;
                                break;
                            }
                        }
                        if (!isExist)
                        {
                            string Error = listW[0].IssueContent;
                        }
                    }
                }
            }
            catch (Exception e)
            {
                string LastErrorMsg = e.Message;
            }
            return newList;

        }

        #endregion

        #region GetRecentTrips(): 取预警信息 ,取数据

        public List<LWSTripsInfo> GetRecentTrips(int TRIPTYPE, DateTime dt)  // 前推两小时
        {
            List<LWSTripsInfo> newList = null;
            try
            {
                DateTime dtStar = dt.AddMinutes(-105);
                DateTime dtEnd = dt.AddMinutes(138);

                String dtStart = dtStar.ToString("yyyy/M/dd HH:mm:ss");
                String dtend = dtEnd.ToString("yyyy/M/dd HH:mm:ss");                                                     //数据库的时间格式
                string SQL = "select DDATETIME,CITY,W_TYPE,W_LEVEL from t_hk_warning t where DDATETIME between to_date('" + dtStart + "','yyyy-mm-dd hh24:mi:ss') and to_date('" + dtend + "','yyyy-mm-dd hh24:mi:ss')";
                DataTable dbResult = DbHelperOra.Query(SQL, CommonClass.GetconnectionStringsValue("ConnectionEJETDB247Idcty")).Tables[0];
                LWSTripsInfo info;
                if (dbResult != null && dbResult.Rows.Count > 0)
                {
                    newList = new List<LWSTripsInfo>();
                    DateTime dt2 = DateTime.Parse("2000-1-1");
                    //int d0 = 0;
                    for (int i = 0; i < dbResult.Rows.Count; i++)
                    {
                        info = new LWSTripsInfo();
                        dt2 = DateTime.Parse("2000-1-1");
                        if (!DateTime.TryParse(dbResult.Rows[i]["DDATETIME"].ToString(), out dt2)) continue;
                        info.DDATETIME = dt2;
                        //d0 = 0;

                        info.W_TYPE = dbResult.Rows[i]["W_TYPE"].ToString();
                        info.CITY = dbResult.Rows[i]["CITY"].ToString();
                        info.W_LEVEL = dbResult.Rows[i]["W_LEVEL"].ToString();

                        //d0 = 0;
                        //int.TryParse(dbResult.Rows[i]["triptype"].ToString(), out d0);
                        //info.TripType = d0;

                        //d0 = 0;
                        //int.TryParse(dbResult.Rows[i]["usetype"].ToString(), out d0);
                        //info.UseType = d0;
                        //info.DDateTimestr = info.DDateTime.ToString("yyyy-MM-dd HH:mm:ss");
                        //int.TryParse(dbResult.Rows[i]["RECID"].ToString(), out d0);
                        //info.RECID = d0;
                        newList.Add(info);
                    }
                }

                //冰雹
                //dtend = DateTime.Parse(dtEnd.ToString("yyyy-MM-dd HH:") + ((dtEnd.Minute / 6) * 6));
                //dtStar = DateTime.Parse(dtStar.ToString("yyyy-MM-dd HH:") + ((dtStar.Minute / 6) * 6));
                //SQL = "select RECID,ddatetime,flagindex,region,tripcontent,usetype from lws_hailtrips where LEADTIME=0 and ddatetime between " + GetOraceDateTimeFormatString(dtStar) + " and  " + GetOraceDateTimeFormatString(dtend) + " order by ddatetime,flagindex";
                //dbResult = DbHelperOra.Query(SQL, CommonClass.GetconnectionStringsValue("ConnectionNowGis2010")).Tables[0];
                //if (dbResult != null && dbResult.Rows.Count > 0)
                //{
                //    newList = new List<LWSTripsInfo>();
                //    DateTime dt2 = DateTime.Parse("2000-1-1");
                //    int d0 = 0;
                //    for (int i = 0; i < dbResult.Rows.Count; i++)
                //    {
                //        info = new LWSTripsInfo();
                //        dt2 = DateTime.Parse("2000-1-1");
                //if (!DateTime.TryParse(dbResult.Rows[i]["ddatetime"].ToString(), out dt2)) continue;
                //info.DDateTime = DateTime.Parse(dt2.ToString("yyyy-MM-dd HH:") + ((dt2.Minute / 5) * 5));
                //d0 = 0;
                //int.TryParse(dbResult.Rows[i]["flagindex"].ToString(), out d0);
                //info.FlagIndex = d0;

                //info.Region = dbResult.Rows[i]["region"].ToString();
                //info.TripContent = dbResult.Rows[i]["tripcontent"].ToString();

                //d0 = 0;
                //int.TryParse(dbResult.Rows[i]["usetype"].ToString(), out d0);
                //info.UseType = d0;
                //int.TryParse(dbResult.Rows[i]["RECID"].ToString(), out d0);
                //info.RECID = d0;

                //newList.Add(info);
                //}
                //}
            }
            catch (Exception ex)
            {
                CommonClass.ErrWriter(ex.ToString());
                newList = null;
            }
            return newList;
        }


        #endregion

        #region GetForecastTrips(): 取预报信息

        public List<LWSTripsInfo> GetForecastTrips(DateTime dt)     //后推两小时
        {
            List<LWSTripsInfo> newList = null;
            try
            {
                dt = DateTime.Parse(dt.ToString("yyyy-MM-dd HH:") + ((dt.Minute / 6) * 6));
                DateTime dtStar = dt.AddMinutes(-105);
                DateTime dtEnd = dt.AddMinutes(138);

                String dtStart = dtStar.ToString("yyyy/M/dd HH:mm:ss");
                String dtend = dtEnd.ToString("yyyy/M/dd HH:mm:ss");
                string SQL = "select DDATETIME,CITY,W_TYPE,W_LEVEL from t_hk_warning t where DDATETIME between to_date('" + dtStart + "','yyyy-mm-dd hh24:mi:ss') and to_date('" + dtend + "','yyyy-mm-dd hh24:mi:ss')";
                DataTable dbResult = DbHelperOra.Query(SQL, CommonClass.GetconnectionStringsValue("ConnectionEJETDB247Idcty")).Tables[0];
                LWSTripsInfo info;
                if (dbResult != null && dbResult.Rows.Count > 0)
                {
                    newList = new List<LWSTripsInfo>();
                    DateTime dt2 = DateTime.Parse("2000-1-1");
                    //int d0 = 0;
                    for (int i = 0; i < dbResult.Rows.Count; i++)
                    {
                        info = new LWSTripsInfo();
                        dt2 = DateTime.Parse("2000-1-1");
                        if (!DateTime.TryParse(dbResult.Rows[i]["DDATETIME"].ToString(), out dt2))

                            continue;
                        info.DDATETIME = dt2;
                        //d0 = 0;

                        info.W_TYPE = dbResult.Rows[i]["W_TYPE"].ToString();
                        info.CITY = dbResult.Rows[i]["CITY"].ToString();
                        info.W_LEVEL = dbResult.Rows[i]["W_LEVEL"].ToString();
                        //int.TryParse(dbResult.Rows[i]["flagindex"].ToString(), out d0);
                        //info.FlagIndex = d0;
                        //dt2 = DateTime.Parse("2000-1-1");
                        //if (!DateTime.TryParse(dbResult.Rows[i]["FORECASTTIME"].ToString(), out dt2)) continue;
                        //info.DDateTime = dt2;
                        //info.DDateTimestr = dt2.ToString("yyyy-MM-dd HH:mm:ss");
                        ////if (info.DDateTime > Convert.ToDateTime("2015-06-10 00:00:00"))
                        ////{
                        ////    if (info.FlagIndex == 6 || info.FlagIndex == 7 || info.FlagIndex == 8)
                        ////    {
                        ////        int.TryParse(dbResult.Rows[i]["PRODUCTTYPE"].ToString(), out d0);
                        ////        if (d0 == 0) continue;
                        ////    }
                        ////}


                        //d0 = 0;


                        //info.Region = dbResult.Rows[i]["region"].ToString();
                        //info.TripContent = dbResult.Rows[i]["tripcontent"].ToString();

                        //d0 = 0;
                        //int.TryParse(dbResult.Rows[i]["triptype"].ToString(), out d0);
                        //info.TripType = d0;

                        //d0 = 0;
                        //int.TryParse(dbResult.Rows[i]["usetype"].ToString(), out d0);
                        //info.UseType = d0;
                        //int.TryParse(dbResult.Rows[i]["RECID"].ToString(), out d0);
                        //info.RECID = d0;

                        newList.Add(info);
                    }
                }

                string dd = dt.ToString("yyyy/M/dd HH:mm:ss");
                SQL = "select DDATETIME,CITY,W_TYPE,W_LEVEL from t_hk_warning t where DDATETIME = to_date('" + dd + "','yyyy-mm-dd hh24:mi:ss')";
                dbResult = DbHelperOra.Query(SQL, CommonClass.GetconnectionStringsValue("ConnectionEJETDB247Idcty")).Tables[0];

                if (dbResult != null && dbResult.Rows.Count > 0)
                {
                    newList = new List<LWSTripsInfo>();
                    DateTime dt2 = DateTime.Parse("2000-1-1");
                    //int d0 = 0;
                    for (int i = 0; i < dbResult.Rows.Count; i++)
                    {
                        info = new LWSTripsInfo();
                        dt2 = DateTime.Parse("2000-1-1");

                        //if (!DateTime.TryParse(dbResult.Rows[i]["DDATETIME"].ToString(), out dt2)) continue;
                        //d0 = 0;
                        //int.TryParse(dbResult.Rows[i]["LEADTIME"].ToString(), out d0);
                        //info.DDateTime = dt2.AddMinutes(d0);
                        //info.DDateTimestr = dt2.ToString("yyyy-MM-dd HH:mm:ss");
                        //d0 = 0;
                        //int.TryParse(dbResult.Rows[i]["flagindex"].ToString(), out d0);
                        //info.FlagIndex = d0;

                        //info.Region = dbResult.Rows[i]["region"].ToString();
                        //info.TripContent = dbResult.Rows[i]["tripcontent"].ToString();

                        //d0 = 0;
                        //int.TryParse(dbResult.Rows[i]["usetype"].ToString(), out d0);
                        //info.UseType = d0;
                        //int.TryParse(dbResult.Rows[i]["RECID"].ToString(), out d0);
                        //info.RECID = d0;

                        newList.Add(info);
                    }
                }
            }
            catch (Exception ex)
            {
                CommonClass.ErrWriter(ex.ToString());
                newList = null;
            }
            return newList;
        }

        #endregion

        #region GetLWSPreWord(): 取台风预发布信息
        public string GetLWSPreWord()
        {
            try
            {
                //string sql = "SELECT * from LWS_WARNPRE where ddatetime >= to_date('" + DateTime.Now.AddHours(-3).ToString("yyyy-MM-dd HH:mm:ss") + "', 'yyyy-mm-dd hh24:mi:ss') order by DDATETIME desc";
                string sql = "SELECT * from LWS_WARNPRE order by DDATETIME desc";

                DataTable ds = DbHelperOra.Query(sql, CommonClass.GetconnectionStringsValue("ConnectionNowGis2010")).Tables[0];

                if (ds != null && ds.Rows.Count > 0)
                {
                    string strSignalType = ds.Rows[0]["SIGNTYPE"].ToString();
                    string strSignalLevel = ds.Rows[0]["SIGNLEVEL"].ToString();
                    string strIssueContent = ds.Rows[0]["SMSMESSAGE"].ToString();
                    string strCurrentLWS = GetWarningData();
                    int indexSMS = strCurrentLWS.IndexOf(";.");
                    if (indexSMS > 0)
                    {
                        strCurrentLWS = strCurrentLWS.Substring(0, indexSMS);
                        indexSMS = strCurrentLWS.IndexOf("台风,");
                        if (indexSMS > 0)
                        {
                            strCurrentLWS = strCurrentLWS.Substring(indexSMS + 3, 2);
                            List<string> levelList = new List<string> { "白色", "蓝色", "黄色", "橙色", "红色" };//级别
                            int indexPre = levelList.IndexOf(strSignalLevel);
                            int indexLWS = levelList.IndexOf(strCurrentLWS);
                            if (indexPre >= 0 && indexLWS >= 0 && indexPre > indexLWS)
                            {
                                return "【深圳市台风" + strSignalLevel + "预警预发布信息】" + strIssueContent;
                            }
                        }
                    }
                    //return strIssueContent;
                }
            }
            catch (Exception ex)
            {
                CommonClass.ErrWriter(ex.ToString());
            }
            return "";
        }

        #endregion

        #region GetWarningData(): 取当天生效预警信号

        public string GetWarningData()
        {
            string strWarning = "";
            try
            {
                string sql = "select W_CONTENT from(select W_CONTENT,CITY,W_TYPE,W_LEVEL,DDATETIME from t_hk_warning t ORDER BY DDATETIME DESC) where rownum<2";
                string sql4 = "select W_LEVEL from(select W_CONTENT,CITY,W_TYPE,W_LEVEL,DDATETIME from t_hk_warning t ORDER BY DDATETIME DESC) where rownum<2";
                string sql2 = "select W_TYPE from(select W_CONTENT,CITY,W_TYPE,W_LEVEL,DDATETIME from t_hk_warning t ORDER BY DDATETIME DESC) where rownum<2";
                var resobj = DbHelperOra.GetSingle(sql, CommonClass.GetconnectionStringsValue("ConnectionEJETDB247Idcty"));
                var resobj4 = DbHelperOra.GetSingle(sql4, CommonClass.GetconnectionStringsValue("ConnectionEJETDB247Idcty"));
                var resobj2 = DbHelperOra.GetSingle(sql2, CommonClass.GetconnectionStringsValue("ConnectionEJETDB247Idcty"));

                if (resobj != null)
                {
                    strWarning = resobj.ToString() + "!" + resobj4.ToString() + "#" + resobj2.ToString();
                }

            }
            catch (Exception ex)
            {
                CommonClass.ErrWriter(ex.ToString());
            }
            return strWarning;
        }

        private void alert()
        {
            throw new NotImplementedException();
        }

        //截取预警信息
        public List<WarningEntity> GetwarningInfo(out string strinfo, string signalstrs)
        {
            List<WarningEntity> ls = new List<WarningEntity>();
            strinfo = "";
            try
            {

                string signalstr = signalstrs;
                WarningEntity info = new WarningEntity();
                string[] signaltxt = null;
                string[] strtext = null;

                if (signalstr.IndexOf("!") != -1)
                {

                    //将短信与信号图标分离
                    signaltxt = signalstr.Split(new string[1] { "!" }, StringSplitOptions.RemoveEmptyEntries);
                    info = new WarningEntity();
                    strtext = signaltxt[1].Split(new string[1] { "!" }, StringSplitOptions.RemoveEmptyEntries);
                    info.W_LEVEL = strtext[0];
                    //    //if (signaltxt[1].IndexOf(",") != -1)
                    //    //{
                    //    //    strtext = signaltxt[1].Split(new string[1] { "," }, StringSplitOptions.RemoveEmptyEntries);
                    //    //    if (strtext != null && strtext.Length > 0)
                    //    //    {
                    //    //        foreach (string strT in strtext)
                    //    //        {

                    //    //            strType = strtext;
                    //    //            if (strType != null && strType.Length > 3)
                    //    //            {
                    //    //                info = new WarningEntity();
                    //    //                info.CITY = strType[0];
                    //    //                info.W_TYPE = strType[1];
                    //    //                info.W_LEVEL = strType[2];
                    //    //                info.DDATETIME = DateTime.Parse(strType[3]);
                    //    //                info.W_ICONNAME = strType[4];
                    //    //            }
                    //    //        }
                    //    //        info.W_CONTENT = signaltxt[0];
                    //    //        ls.Add(info);
                    //    //    }
                    //    //}
                    //    //else
                    //    //{
                    //    //    strType = signaltxt[0].Split(',');
                    //    //    if (strType != null && strType.Length > 3)
                    //    //    {
                    //    //        info.CITY = strType[0];
                    //    //        info.W_TYPE = strType[1];
                    //    //        info.W_LEVEL = strType[2];
                    //    //        info.DDATETIME = DateTime.Parse(strType[3]);
                    //    //        info.W_ICONNAME = strType[4];
                    //    //    }
                    //    //}
                    info.W_CONTENT = signaltxt[0];
                    ls.Add(info);
                }
                else
                {
                    signaltxt = new string[1];
                    signaltxt[0] = signalstr;
                }


                //if (signaltxt.Length > 1)
                //{

                //    strinfo = signaltxt[signaltxt.Length - 1].ToString();
                //}
                //else
                //{

                //    strinfo = signaltxt[signaltxt.Length - 1].ToString();
                //}



            }
            catch (Exception e)
            {

                string em = e.Message;
            }
            finally
            {

            }
            return ls;

        }

        #endregion

        #region GetPondsTime():临近预报最新时间

        public DateTime GetPondsTime()
        {
            DateTime newtime = DateTime.Now;
            try
            {
                string strTimeFileName = "http://10.155.95.202:8080/Data/newCAPPI/CappiTimeCount.count";
                WebClient MyWebClient = new WebClient();
                MyWebClient.Credentials = CredentialCache.DefaultCredentials;     //获取或设置用于向Internet资源的请求进行身份验证的网络凭据
                Byte[] pageData = MyWebClient.DownloadData(strTimeFileName);           //从指定网站下载数据
                string pageHtml = Encoding.Default.GetString(pageData);
                newtime = new DateTime(int.Parse(pageHtml.Substring(0, 4)), int.Parse(pageHtml.Substring(4, 2)), int.Parse(pageHtml.Substring(6, 2)), int.Parse(pageHtml.Substring(8, 2)), int.Parse(pageHtml.Substring(10, 2)), 0);
                return newtime;

            }
            catch (Exception ex)
            {
                CommonClass.ErrWriter(ex.ToString());
            }
            return newtime;
        }
        #endregion

        #region GetEcmwfTime():欧洲中心时间

        public DateTime GetEcmwfTime()
        {
            DateTime newtime = DateTime.Now;
            try
            {
                string strTimeFileName = "http://10.155.95.202:8080/data/MicapsProducts/10MiWind/time.txt";
                WebClient MyWebClient = new WebClient();
                MyWebClient.Credentials = CredentialCache.DefaultCredentials;     //获取或设置用于向Internet资源的请求进行身份验证的网络凭据
                Byte[] pageData = MyWebClient.DownloadData(strTimeFileName);           //从指定网站下载数据
                string pageHtml = Encoding.Default.GetString(pageData);
                newtime = DateTime.Parse(pageHtml);
                return newtime;
            }
            catch (Exception ex)
            {
                CommonClass.ErrWriter(ex.ToString());
            }

            return DateTime.Parse(DateTime.Now.AddDays(-1).ToString("yyyy-MM-dd ") + "20:00");
            //return newtime;
        }
        #endregion

        #region GetEcmwfData(): 取欧洲中心预报信息

        public List<ForecastInfo> GetEcmwfData(DateTime dt)
        {
            List<ForecastInfo> listinfo = new List<ForecastInfo>();
            try
            {
                string sql = "select T2m,WSPD10M,FORECASTTIME  from T_HK_NEW_GRID_FORECAST where venueid=55 and "
                + " ddatetime=to_date('" + dt.ToString("yyyy-MM-dd HH:mm:ss") + "','yyyy-mm-dd hh24:mi:ss') order by FORECASTTIME";
                DataTable dbResult = DbHelperOra.Query(sql, CommonClass.GetconnectionStringsValue("ConnectionEJETDB247Idcty")).Tables[0];
                if (dbResult != null && dbResult.Rows.Count > 0)
                {
                    ForecastInfo info;
                    DateTime dt2; double d0;
                    for (int i = 0; i < dbResult.Rows.Count; i++)
                    {
                        info = new ForecastInfo();
                        dt2 = DateTime.Parse("2000-1-1");
                        if (!DateTime.TryParse(dbResult.Rows[i]["FORECASTTIME"].ToString(), out dt2)) continue;
                        info.ForecastTime = dt2;
                        d0 = 0;
                        double.TryParse(dbResult.Rows[i]["T2m"].ToString(), out d0);
                        info.Temp = d0;
                        d0 = 0;
                        double.TryParse(dbResult.Rows[i]["WSPD10M"].ToString(), out d0);
                        info.Wind = d0;
                        listinfo.Add(info);
                    }
                }
            }
            catch (Exception ex)
            {
                CommonClass.ErrWriter(ex.ToString());
                listinfo = null;
            }
            return listinfo;
        }

        #endregion

        //数据库日期格式
        private string GetOraceDateTimeFormatString(DateTime dt)
        {
            return "TO_DATE('" + dt.ToString("yyyy-MM-dd HH:mm") + "', 'yyyy-mm-dd hh24:mi')";
        }


    }
}
