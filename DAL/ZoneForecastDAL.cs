using Common;
using System;
using System.Collections;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;


namespace DAL
{
    public class ZoneForecastDAL
    {
        private List<ZoneForecastInfo> GetForecastInfo(DateTime dt, string area, DateTime dtStart)
        {
            List<ZoneForecastInfo> listInfo = null;
            DataTable dtTable = null;
            DataTable dtTable2 = null;
            try
            {
                string strSQL = "SELECT distinct RECID,DDATETIME,YBSX,RAIN,T2M,RHSFC,WSPD10M,WDIR10M,FORECASTTIME";
                string strSQL1 = "SELECT max(T2M) as MAXTEMPERATURE,MIN(T2M) AS MINTEMPERATURE";
                strSQL += string.Format(" FROM T_HK_NEW_GRID_FORECAST T WHERE DDATETIME = TO_DATE('{0}','YYYY-MM-DD HH24:MI:SS') AND VENUEID = {1} AND  FORECASTTIME>TO_DATE('{2}','YYYY-MM-DD HH24:MI:SS') AND ROWNUM<=24  ORDER BY YBSX,FORECASTTIME", dt, GetZoneNum(area).Split(';')[0], dtStart);
                strSQL1 += string.Format(" FROM T_HK_NEW_GRID_FORECAST T WHERE DDATETIME = TO_DATE('{0}','YYYY-MM-DD HH24:MI:SS') AND VENUEID = {1} AND  FORECASTTIME>TO_DATE('{2}','YYYY-MM-DD HH24:MI:SS') AND ROWNUM<=24  ORDER BY YBSX,FORECASTTIME", dt, GetZoneNum(area).Split(';')[0], dtStart);
                try
                {
                    OracleHelper th = new OracleHelper("HAIKOUConnect");
                    dtTable = th.ExecuteDataTable(strSQL);
                    dtTable2 = th.ExecuteDataTable(strSQL1);
                    if (dtTable != null && dtTable.Rows.Count > 0 && dtTable2 != null && dtTable2.Rows.Count > 0)
                    {
                        listInfo = new List<ZoneForecastInfo>();
                        string name = GetZoneNum(area).Split(';')[1].Trim();
                        for (int i = 0; i < dtTable.Rows.Count; i++)
                        {
                            ZoneForecastInfo info = new ZoneForecastInfo();
                            info.AreaName = name;
                            info.Recid = dtTable.Rows[i]["RECID"].ToString();
                            info.Ddatetime = dtTable.Rows[i]["DDATETIME"].ToString();
                            info.Ybsx = dtTable.Rows[i]["YBSX"].ToString();
                            info.Rain = Convert.ToDouble(dtTable.Rows[i]["RAIN"]).ToString("####0.#");
                            info.T2m = Convert.ToDouble(dtTable.Rows[i]["T2M"]).ToString("####0.#");
                            info.Rhsfc = Convert.ToDouble(dtTable.Rows[i]["RHSFC"]).ToString("####0.#");
                            info.Wspd10m = Convert.ToDouble(dtTable.Rows[i]["WSPD10M"]).ToString("####0.#");
                            info.Wdir10m = Convert.ToDouble(dtTable.Rows[i]["WDIR10M"]).ToString("####0.#");
                            info.Forecasttime = dtTable.Rows[i]["FORECASTTIME"].ToString();
                            info.Rain2 = info.Rain;
                            info.T2m2 = info.T2m;
                            info.Maxtemperature = Convert.ToDouble(dtTable2.Rows[0]["MAXTEMPERATURE"]).ToString("####0.#");
                            info.Mintemperature = Convert.ToDouble(dtTable2.Rows[0]["MINTEMPERATURE"]).ToString("####0.#");
                            listInfo.Add(info);
                        }
                    }
                }
                catch (Exception ex)
                {
                    CreateLogTxt.ErrWriter(ex);
                }
            }
            catch (Exception ex)
            {
                CreateLogTxt.WriteLog(ex.ToString());
            }
            return listInfo;
        }

        public List<List<ZoneForecastInfo>> GetAllForInfo(DateTime dt, string areaList, DateTime dtStart)
        {
            List<List<ZoneForecastInfo>> listAll = new List<List<ZoneForecastInfo>>();
            try
            {
                if (areaList.Length > 0)
                {
                    foreach (string area in areaList.Split(';'))
                    {
                        if (area.Split('-')[0] != "")
                            listAll.Add(GetForecastInfo(dt, area.Split('-')[0], dtStart));
                    }
                }
            }
            catch (Exception ex)
            {
                CreateLogTxt.ErrWriter(ex);
            }
            return listAll;
        }

        public List<WeatherForecastInfo> GetAllWearthInfo(DateTime dt)
        {
            List<WeatherForecastInfo> list = null;
            string strSQL = "SELECT distinct DDATETIME,AREANAME,MINRAIN,RAIN,MINTEMPERATURE,MAXTEMPERATURE,HUMIDITY,MAXHUMIDITY,WINDSPEED,WINDDIRECT,WEATHERPIC,WEATHERSTATUS,QPFCORRECTWEATHERPIC FROM LFS_AREAWEATHER WHERE DDATETIME = TO_DATE('" + dt.ToString("yyyy-MM-dd HH:mm") + "','yyyy-mm-dd hh24:mi') and maxtemperature!=0 ";
            try
            {
                OracleHelper th = new OracleHelper("HAIKOUConnect");
                DataTable dTable = th.ExecuteDataTable(strSQL);
                if (dTable != null && dTable.Rows.Count > 0)
                {
                    list = new List<WeatherForecastInfo>();
                    for (int i = 0; i < dTable.Rows.Count; i++)
                    {
                        WeatherForecastInfo info = new WeatherForecastInfo();
                        info.DDatetime = Convert.ToDateTime(dTable.Rows[i]["DDATETIME"]);
                        info.AreaName = dTable.Rows[i]["AREANAME"].ToString();
                        info.MinRain = dTable.Rows[i]["MINRAIN"].ToString();
                        info.Rain = dTable.Rows[i]["RAIN"].ToString();
                        info.MinTemp = dTable.Rows[i]["MINTEMPERATURE"].ToString();
                        info.MaxTemp = dTable.Rows[i]["MAXTEMPERATURE"].ToString();
                        info.Humidity = dTable.Rows[i]["HUMIDITY"].ToString();
                        info.MaxHumidity = dTable.Rows[i]["MAXHUMIDITY"].ToString();
                        info.WindSpeed = dTable.Rows[i]["WINDSPEED"].ToString();
                        info.WindDirectName = dTable.Rows[i]["WINDDIRECT"].ToString();
                        info.WeatherPic = dTable.Rows[i]["WEATHERPIC"].ToString();
                        info.WeatherStatus = dTable.Rows[i]["WEATHERSTATUS"].ToString();
                        info.QpfCorrectWeatherpic = dTable.Rows[i]["QPFCORRECTWEATHERPIC"].ToString();
                        list.Add(info);
                    }
                }
            }
            catch (Exception ex)
            {
                CreateLogTxt.ErrWriter(ex);
            }
            return list;
        }

        public List<string> GetAllWelfareForeInfo(DateTime dt)
        {
            List<string> info = null;
            string strSQL = "SELECT distinct WeatherBack,Future FROM LFS_WELFAREFORECAST WHERE DDATETIME = TO_DATE('" + dt.ToString("yyyy-MM-dd HH:mm") + "','yyyy-mm-dd hh24:mi')  ";
            try
            {
                OracleHelper th = new OracleHelper("HAIKOUConnect");
                DataTable dTable = th.ExecuteDataTable(strSQL);
                if (dTable != null && dTable.Rows.Count > 0)
                {
                    for (int i = 0; i < dTable.Rows.Count; i++)
                    {
                        info = new List<string>();
                        info.Add(dTable.Rows[i]["WeatherBack"].ToString());
                        info.Add(dTable.Rows[i]["Future"].ToString());
                    }
                }
            }
            catch (Exception ex)
            {
                CreateLogTxt.ErrWriter(ex);
            }
            return info;
        }

        public List<WeatherForecastInfo> GetWeatherHis(DateTime dt)
        {
            List<WeatherForecastInfo> list = null;
            string strSQL = "SELECT forecastdate,to_char(forecastdate, 'DY') as week,weatherpic,weather, mintemp,maxtemp from LFS_WELFAREFORECASTDAYS WHERE DDATETIME = TO_DATE('" + dt.ToString("yyyy-MM-dd HH:mm") + "','yyyy-mm-dd hh24:mi')  ";
            try
            {
                OracleHelper th = new OracleHelper("HAIKOUConnect");
                DataTable dTable = th.ExecuteDataTable(strSQL);
                if (dTable != null && dTable.Rows.Count > 0)
                {
                    list = new List<WeatherForecastInfo>();
                    for (int i = 0; i < dTable.Rows.Count; i++)
                    {
                        WeatherForecastInfo info = new WeatherForecastInfo();
                        info.ForecastDate = dTable.Rows[i]["forecastdate"].ToString();
                        info.Week = dTable.Rows[i]["week"].ToString();
                        info.WeatherPic = dTable.Rows[i]["weatherpic"].ToString();
                        info.WeatherStatus = dTable.Rows[i]["weather"].ToString();
                        info.MinTemp = dTable.Rows[i]["mintemp"].ToString();
                        info.MaxTemp = dTable.Rows[i]["maxtemp"].ToString();
                        list.Add(info);
                    }
                }
            }
            catch (Exception ex)
            {
                CreateLogTxt.ErrWriter(ex);
            }
            return list;
        }
        #region
        //public List<List<List<string>>> GetAllForInfoShow(DateTime dt, string areaList, DateTime dtStart)
        //{
        //    List<List<ZoneForecastInfo>> listAll = new List<List<ZoneForecastInfo>>();
        //    if (areaList.Length > 0)
        //    {
        //        foreach (string area in areaList.Split(';'))
        //        {
        //            if (area.Split('-')[0] != "")
        //                listAll.Add(GetForecastInfo(dt, area.Split('-')[0], dtStart));
        //        }
        //    }

        //    行列置换
        //    List<List<List<string>>> NewListAll = new List<List<List<string>>>();
        //    for (int i = 0; i < listAll.Count; i++)
        //    {
        //        List<ZoneForecastInfo> list = listAll[i];
        //        List<List<string>> listNew = new List<List<string>>();

        //        for (int j = 0; j < list.Count; j++)
        //        {
        //            ArrayList al = new ArrayList() { list[j] };
        //            List<string> infoStr = new List<string>();
        //            for (int k = 0; k < list.Count; k++)
        //            {
        //                infoStr[k] = al[k].ToString();
        //            }
        //            listNew.Add(infoStr);
        //        }
        //        NewListAll.Add(listNew);
        //    }
        //    return NewListAll;
        //}
        #endregion

        private string GetZoneNum(string area)
        {
            string numAndName = "";
            if (area == "FTArea")
                numAndName = "161;美兰区";
            else if (area == "LuoHArea")
                numAndName = "144;秀英区";
            else if (area == "NSArea")
                numAndName = "159;龙华区";
            else if (area == "YTArea")
                numAndName = "146;琼山区";
            return numAndName;
        }

        public bool SaveForInfoList(List<ZoneForecastInfo> InfoList, string name, DateTime dt)
        {
            string strSQL = "";
            string strRecID = "";
            int iResult = 0;

            if (InfoList == null || InfoList.Count <= 0)
                return false;
            try
            {
                OracleHelper th = new OracleHelper("HAIKOUConnect");
                #region

                ZoneForecastInfo dataInfo1 = InfoList[0];
                strSQL = "select RECID from LFS_AREAWEATHER where DDATETIME=to_date('" + dataInfo1.Ddatetime + "' ,'YYYY-MM-DD HH24:MI:SS') and AREANAME= '" + dataInfo1.AreaName + "' and  isNextDay=0";
                strRecID = th.db_GreateQuery(strSQL);

                if (!string.IsNullOrEmpty(strRecID) && int.TryParse(strRecID, out iResult))
                {
                    strSQL = "update LFS_AREAWEATHER set "
                      + " RAIN=" + dataInfo1.Rain.ToString()
                      + ",WINDSPEED=" + dataInfo1.Wspd10m
                      + ",WINDDIRECT='" + dataInfo1.Wdir10m + "'"
                      + ",HUMIDITY=" + dataInfo1.Rhsfc
                      + ",HUMIDITY=" + dataInfo1.Maxtemperature
                      + ",HUMIDITY=" + dataInfo1.Mintemperature
                      + ",WRITETIME=sysdate"
                      + " where recid=" + strRecID + " and AREANAME= '" + dataInfo1.AreaName + "' ";
                    iResult = th.db_ExecuteNonQuery(strSQL);
                }
                else
                {
                    strSQL = "insert into LFS_AREAWEATHER(recid,AREANAME,ddatetime,RAIN,WINDSPEED,WINDDIRECT,HUMIDITY,MAXTEMPERATURE,MINTEMPERATURE,WRITETIME) values(SEQ_LFS_AREAWEATHER.NEXTVAL,'" + dataInfo1.AreaName + "',to_date('" + dataInfo1.Ddatetime + "' ,'YYYY-MM-DD HH24:MI:SS'),'" + dataInfo1.Rain.ToString() + "','" + dataInfo1.Wspd10m + "','" + dataInfo1.Wdir10m + "','" + dataInfo1.Rhsfc + "','" + dataInfo1.Maxtemperature + "','" + dataInfo1.Mintemperature + "'," + "sysdate)";
                    iResult = th.db_ExecuteNonQuery(strSQL);
                }
                #endregion
                foreach (ZoneForecastInfo dataInfo in InfoList)
                {
                    strSQL = "select recid from LFS_AREAWEATHERHOUR where DDATETIME=to_date('" + dataInfo.Ddatetime + "', 'YYYY-MM-DD HH24:MI:SS') and AREANAME= '" + dataInfo.AreaName + "' and FORECASTTIME=to_date('" + dataInfo.Forecasttime + "', 'YYYY-MM-DD HH24:MI:SS') ";
                    strRecID = th.db_GreateQuery(strSQL);

                    if (!string.IsNullOrEmpty(strRecID) && int.TryParse(strRecID, out iResult))
                    {
                        strSQL = "update LFS_AREAWEATHERHOUR set "
                             + "WRITETIME=sysdate"
                            + ",RAIN=" + dataInfo.Rain
                            + ",WINDSPEED=" + dataInfo.Wspd10m
                            + ",WINDDIRECT= '" + dataInfo.Wdir10m + "' "
                            + ",TEMPERATURE=" + dataInfo.T2m
                            + ",HUMIDITY=" + dataInfo.Rhsfc
                                 + ",RAINPCORSTATE=4"
                            + "  where recid=" + strRecID + "and AREANAME= '" + dataInfo.AreaName + "'";
                        iResult = th.db_ExecuteNonQuery(strSQL);
                    }
                    else
                    {
                        strSQL = "insert into LFS_AREAWEATHERHOUR(recid,AREANAME,DDATETIME,WRITETIME,RAIN,WINDSPEED,WINDDIRECT,TEMPERATURE,HUMIDITY,RAINPCORSTATE,FORECASTTIME) values(SEQ_LFS_AREAWEATHERHOUR.NEXTVAL,'" + dataInfo.AreaName + "',to_date('" + dataInfo.Ddatetime + "', 'YYYY-MM-DD HH24:MI:SS'),sysdate"
                           + "," + dataInfo.Rain
                           + "," + dataInfo.Wspd10m
                           + ", '" + dataInfo.Wdir10m + "' "
                           + "," + dataInfo.T2m
                           + "," + dataInfo.Rhsfc
                           + ",4,to_date('" + dataInfo.Forecasttime + "', 'YYYY-MM-DD HH24:MI:SS'))";

                        iResult = th.db_ExecuteNonQuery(strSQL);
                    }
                }

                if (iResult > 0)
                {
                    strSQL = "insert into lfs_welfareproduce (RECID,DDATETIME,PRIMARYFORECASTER,FORECASTER,ISEDIT,TRACECOUNT) values ("
                        + "SEQ_LFS_WELFAREPRODUCE.NEXTVAL"
                       + ",to_date('" + dt.ToString("yyyy-MM-dd HH:mm:ss") + "', 'YYYY-MM-DD HH24:MI:SS') "
                       + ",''"
                       + ",'" + name + "'"
                       + "," + 0 + ""
                       + "," + 0 + ""
                       + ")";
                    iResult = th.db_ExecuteNonQuery(strSQL);
                    if (iResult > 0)
                        return true;
                }
            }
            catch (Exception ex)
            {
                CreateLogTxt.ErrWriter(ex);
                return false;
            }
            return false;
        }
    }
}
