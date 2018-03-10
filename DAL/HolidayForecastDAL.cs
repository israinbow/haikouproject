using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DAL
{
    public class HolidayForecastDAL
    {
        //国庆专报
        public bool InsertNationalForecast(DateTime dt, Common.NationalForecastModel.NationalForecastInfo info, Common.NationalForecastModel.NationalForecastTBInfo TBinfo, string forecaster)
        {
            try
            {
                string strSQL = "";
                string strSQLTB = "";
                string str = "";
                string strID = "";
                string strIDTB = "";
                int result1 = 0;
                int result = 0;
                strSQL = "select recid from SF_NATIONALFORECAST where ddatetime=to_date('" + dt.ToString("yyyy-MM-dd HH:mm") + "','yyyy-mm-dd hh24:mi')";
                strSQLTB = "select recid from SF_NATIONALFORECASTTB where ddatetime=to_date('" + dt.ToString("yyyy-MM-dd HH:mm") + "','yyyy-mm-dd hh24:mi')";
                OracleHelper oh = new OracleHelper("HAIKOUConnect");
                strID = oh.db_GreateQuery(strSQL);
                strIDTB = oh.db_GreateQuery(strSQLTB);
                if (strID.Length > 0)
                {
                    strSQL = "update SF_NATIONALFORECAST set DDATETIME =to_date('" + dt.ToString("yyyy-MM-dd HH:mm") + "','yyyy-mm-dd hh24:mi') "
                             + ",FORECASTER='" + info.Forecaster + "'"
                             + ",SUMMARY='" + info.Summary + "'"
                                + ",WAETHERTREND='" + info.Weather_trend + "'"
                              + ",WEATHERFORECAST='" + info.Weather_details + "'"
                                  + ",FILEFLAG=0"
                             + " where RECID=" + strID;
                }
                else
                {
                    strSQL = "insert into SF_NATIONALFORECAST(DDATETIME,FORECASTER,SUMMARY,WAETHERTREND,WEATHERFORECAST) values("
                        + " to_date('" + dt.ToString("yyyy-MM-dd HH:mm") + "','yyyy-mm-dd hh24:mi') "
                        + ",'" + info.Forecaster + "'"
                        + ",'" + info.Summary + "'"
                        + ",'" + info.Weather_trend + "'"
                            + ",'" + info.Weather_details + "')";
                }
                result1 = oh.db_ExecuteNonQuery(strSQL);

                //表格数据
                strSQLTB = "insert all into SF_NATIONALFORECASTTB(DDATETIME,FORECASTTIME,WEATHERPIC,WEATHER,TEMPERATURE,WIND,recid) ";
                for (int i = 0; i < TBinfo.Forecasttime.Length; i++)
                {
                    if (i == TBinfo.Forecasttime.Length - 1)
                    {
                        str += "values (to_date('" + dt.ToString("yyyy-MM-dd HH:mm") + "','yyyy-mm-dd hh24:mi') "
                        + ",'" + TBinfo.Forecasttime[i] + "'"
                             + ",'" + TBinfo.Weatherpic[i] + "'"
                             + ",'" + TBinfo.Weatherdes[i] + "'"
                             + ",'" + TBinfo.Temperature[i] + "'"
                                 + ",'" + TBinfo.Wind[i] + "',SEQ_SF_NATIONALFORECASTTB.Nextval) SELECT * FROM dual";
                    }
                    else
                    {
                        str += "values (to_date('" + dt.ToString("yyyy-MM-dd HH:mm") + "','yyyy-mm-dd hh24:mi') "
                        + ",'" + TBinfo.Forecasttime[i] + "'"
                             + ",'" + TBinfo.Weatherpic[i] + "'"
                             + ",'" + TBinfo.Weatherdes[i] + "'"
                             + ",'" + TBinfo.Temperature[i] + "'"
                                 + ",'" + TBinfo.Wind[i] + "',SEQ_SF_NATIONALFORECASTTB.Nextval) into SF_NATIONALFORECASTTB(DDATETIME,FORECASTTIME,WEATHERPIC,WEATHER,TEMPERATURE,WIND,recid) ";
                    }
                }
                strSQLTB += str;
                result = oh.db_ExecuteNonQuery(strSQLTB);

                if (result1 <= 0 || result <= 0)
                {
                    return false;
                }
            }
            catch (Exception ex)
            {
                return false;
            }
            return true;
        }

        public Common.NationalForecastModel.NationalForecastInfo GetNationalForecastInfo(DateTime dt)
        {
            Common.NationalForecastModel.NationalForecastInfo info = GetNationalForecastInfoNow(dt);
            return info;
        }

        private Common.NationalForecastModel.NationalForecastInfo GetNationalForecastInfoNow(DateTime dt)
        {
            try
            {
                Common.NationalForecastModel.NationalForecastInfo infoList = null;
                string strSQL = "select * from sf_nationalforecast where  ddatetime = to_date('" + dt.ToString("yyyy-MM-dd HH:mm") + "','yyyy-mm-dd hh24:mi') ";
                OracleHelper oh = new OracleHelper("HAIKOUConnect");
                DataTable dTable = oh.ExecuteDataTable(strSQL);

                if (dTable != null && dTable.Rows.Count > 0)
                {
                    infoList = new Common.NationalForecastModel.NationalForecastInfo();
                    infoList.Ddatetime = dt.ToString("yyyy-MM-dd HH:mm");
                    infoList.Forecaster = dTable.Rows[0]["FORECASTER"].ToString();
                    infoList.Summary = dTable.Rows[0]["SUMMARY"].ToString();
                    infoList.Weather_trend = dTable.Rows[0]["WAETHERTREND"].ToString();
                    infoList.Weather_details = dTable.Rows[0]["WEATHERFORECAST"].ToString();
                }
                return infoList;
            }
            catch (Exception ex)
            {
                OracleHelper.ErrWriter(ex);
            }
            return null;
        }

        public Common.NationalForecastModel.NationalForecastTBInfo GetNationalForecastTBInfo(DateTime dt)
        {
            Common.NationalForecastModel.NationalForecastTBInfo info = GetNationalForecastTBInfoNow(dt);
            return info;
        }

        private Common.NationalForecastModel.NationalForecastTBInfo GetNationalForecastTBInfoNow(DateTime dt)
        {
            try
            {
                Common.NationalForecastModel.NationalForecastTBInfo infoList = null;
                string strSQL = "select * from SF_NATIONALFORECASTTB where  ddatetime = to_date('" + dt.ToString("yyyy-MM-dd HH:mm") + "','yyyy-mm-dd hh24:mi') ";
                OracleHelper oh = new OracleHelper("HAIKOUConnect");
                DataTable dTable = oh.ExecuteDataTable(strSQL);

                if (dTable != null && dTable.Rows.Count > 0)
                {
                    infoList = new Common.NationalForecastModel.NationalForecastTBInfo();
                    string[] Forecasttime = new string[dTable.Rows.Count];
                    string[] Weatherpic = new string[dTable.Rows.Count];
                    string[] Weatherdes = new string[dTable.Rows.Count];
                    string[] Temperature = new string[dTable.Rows.Count];
                    string[] Wind = new string[dTable.Rows.Count];

                    for (int i = 0; i < dTable.Rows.Count; i++)
                    {   
                        infoList.Ddatetime = dt.ToString("yyyy-MM-dd HH:mm");
                        Forecasttime[i] = dTable.Rows[i]["FORECASTTIME"].ToString();
                        Weatherpic[i] = dTable.Rows[i]["WEATHERPIC"].ToString();
                        Weatherdes[i] = dTable.Rows[i]["WEATHER"].ToString();
                        Temperature[i] = dTable.Rows[i]["TEMPERATURE"].ToString();
                        Wind[i] = dTable.Rows[i]["WIND"].ToString();
                    }

                    infoList.Forecasttime = Forecasttime;
                    infoList.Weatherpic = Weatherpic;
                    infoList.Weatherdes = Weatherdes;
                    infoList.Temperature = Temperature;
                    infoList.Wind = Wind;
                }
                return infoList;
            }
            catch (Exception ex)
            {
                OracleHelper.ErrWriter(ex);
            }
            return null;
        }


        //春节专报
        public bool InsertSpringForecast(DateTime dt, Common.SpringFestivalModel.SpringFestivalInfo info, Common.SpringFestivalModel.SpringFestivalTBInfo TBinfo, string forecaster)
        {
            try
            {
                string strSQL = "";
                string strSQLTB = "";
                string str = "";
                string strID = "";
                string strIDTB = "";
                int result1 = 0;
                int result = 0;
                strSQL = "select recid from SF_SPRINGFORECAST where ddatetime=to_date('" + dt.ToString("yyyy-MM-dd HH:mm") + "','yyyy-mm-dd hh24:mi')";
                strSQLTB = "select recid from SF_SPRINGFORECAST_TB where ddatetime=to_date('" + dt.ToString("yyyy-MM-dd HH:mm") + "','yyyy-mm-dd hh24:mi')";
                OracleHelper oh = new OracleHelper("HAIKOUConnect");
                strID = oh.db_GreateQuery(strSQL);
                strIDTB = oh.db_GreateQuery(strSQLTB);
                if (strID.Length > 0)
                {
                    strSQL = "update SF_SPRINGFORECAST set DDATETIME =to_date('" + dt.ToString("yyyy-MM-dd HH:mm") + "','yyyy-mm-dd hh24:mi') "
                             + ",FORECASTER='" + info.Forecaster + "'"
                                + ",WAETHERTREND='" + info.Weather_trend + "'"
                              + ",WEATHERFORECAST='" + info.Weather_details + "'"
                                  + ",FILEFLAG=0"
                             + " where RECID=" + strID;
                }
                else
                {
                    strSQL = "insert into SF_SPRINGFORECAST(DDATETIME,FORECASTER,WAETHERTREND,WEATHERFORECAST,recid) values("
                        + " to_date('" + dt.ToString("yyyy-MM-dd HH:mm") + "','yyyy-mm-dd hh24:mi') "
                        + ",'" + info.Forecaster + "'"
                        + ",'" + info.Weather_trend + "'"
                            + ",'" + info.Weather_details + "',SEQ_SF_SPRINGFORECAST.Nextval)";
                }
                result1 = oh.db_ExecuteNonQuery(strSQL);

                //表格数据
                strSQLTB = "insert all into SF_SPRINGFORECAST_TB(DDATETIME,FORECASTTIME,WEATHERPIC,WEATHER,TEMPERATURE,WIND,recid) ";
                for (int i = 0; i < TBinfo.Forecasttime.Length; i++)
                {
                    if (i == TBinfo.Forecasttime.Length - 1)
                    {
                        str += "values (to_date('" + dt.ToString("yyyy-MM-dd HH:mm") + "','yyyy-mm-dd hh24:mi') "
                        + ",'" + TBinfo.Forecasttime[i] + "'"
                             + ",'" + TBinfo.Weatherpic[i] + "'"
                             + ",'" + TBinfo.Weatherdes[i] + "'"
                             + ",'" + TBinfo.Temperature[i] + "'"
                                 + ",'" + TBinfo.Wind[i] + "',SEQ_SF_SPRINGFORECAST_TB.Nextval) SELECT * FROM dual";
                    }
                    else
                    {
                        str += "values (to_date('" + dt.ToString("yyyy-MM-dd HH:mm") + "','yyyy-mm-dd hh24:mi') "
                        + ",'" + TBinfo.Forecasttime[i] + "'"
                             + ",'" + TBinfo.Weatherpic[i] + "'"
                             + ",'" + TBinfo.Weatherdes[i] + "'"
                             + ",'" + TBinfo.Temperature[i] + "'"
                                 + ",'" + TBinfo.Wind[i] + "',SEQ_SF_SPRINGFORECAST_TB.Nextval) into SF_SPRINGFORECAST_TB(DDATETIME,FORECASTTIME,WEATHERPIC,WEATHER,TEMPERATURE,WIND,recid) ";
                    }
                }
                strSQLTB += str;
                result = oh.db_ExecuteNonQuery(strSQLTB);

                if (result1 <= 0 || result <= 0)
                {
                    return false;
                }
            }
            catch (Exception ex)
            {
                return false;
            }
            return true;
        }

        public Common.SpringFestivalModel.SpringFestivalTBInfo GetSpringForecastTBInfo(DateTime dt)
        {
            Common.SpringFestivalModel.SpringFestivalTBInfo info = GetSpringForecastTBInfoNow(dt);
            return info;
        }

        private Common.SpringFestivalModel.SpringFestivalTBInfo GetSpringForecastTBInfoNow(DateTime dt)
        {
            try
            {
                Common.SpringFestivalModel.SpringFestivalTBInfo infoList = null;
                string strSQL = "select * from SF_SPRINGFORECAST_TB where  ddatetime = to_date('" + dt.ToString("yyyy-MM-dd HH:mm") + "','yyyy-mm-dd hh24:mi') ";
                OracleHelper oh = new OracleHelper("HAIKOUConnect");
                DataTable dTable = oh.ExecuteDataTable(strSQL);

                if (dTable != null && dTable.Rows.Count > 0)
                {
                    infoList = new Common.SpringFestivalModel.SpringFestivalTBInfo();
                    string[] Forecasttime = new string[dTable.Rows.Count];
                    string[] Weatherpic = new string[dTable.Rows.Count];
                    string[] Weatherdes = new string[dTable.Rows.Count];
                    string[] Temperature = new string[dTable.Rows.Count];
                    string[] Wind = new string[dTable.Rows.Count];

                    for (int i = 0; i < dTable.Rows.Count; i++)
                    {
                        infoList.Ddatetime = dt.ToString("yyyy-MM-dd HH:mm");
                        Forecasttime[i] = dTable.Rows[i]["FORECASTTIME"].ToString();
                        Weatherpic[i] = dTable.Rows[i]["WEATHERPIC"].ToString();
                        Weatherdes[i] = dTable.Rows[i]["WEATHER"].ToString();
                        Temperature[i] = dTable.Rows[i]["TEMPERATURE"].ToString();
                        Wind[i] = dTable.Rows[i]["WIND"].ToString();
                    }

                    infoList.Forecasttime = Forecasttime;
                    infoList.Weatherpic = Weatherpic;
                    infoList.Weatherdes = Weatherdes;
                    infoList.Temperature = Temperature;
                    infoList.Wind = Wind;
                }
                return infoList;
            }
            catch (Exception ex)
            {
                OracleHelper.ErrWriter(ex);
            }
            return null;
        }

        public Common.SpringFestivalModel.SpringFestivalInfo GetSpringForecastInfo(DateTime dt)
        {
            Common.SpringFestivalModel.SpringFestivalInfo info = GetSpringForecastInfoNow(dt);
            return info;
        }

        private Common.SpringFestivalModel.SpringFestivalInfo GetSpringForecastInfoNow(DateTime dt)
        {
            try
            {
                Common.SpringFestivalModel.SpringFestivalInfo infoList = null;
                string strSQL = "select * from SF_SPRINGFORECAST where  ddatetime = to_date('" + dt.ToString("yyyy-MM-dd HH:mm") + "','yyyy-mm-dd hh24:mi') ";
                OracleHelper oh = new OracleHelper("HAIKOUConnect");
                DataTable dTable = oh.ExecuteDataTable(strSQL);

                if (dTable != null && dTable.Rows.Count > 0)
                {
                    infoList = new Common.SpringFestivalModel.SpringFestivalInfo();
                    infoList.Ddatetime = dt.ToString("yyyy-MM-dd HH:mm");
                    infoList.Forecaster = dTable.Rows[0]["FORECASTER"].ToString();
                    infoList.Weather_trend = dTable.Rows[0]["WAETHERTREND"].ToString();
                    infoList.Weather_details = dTable.Rows[0]["WEATHERFORECAST"].ToString();
                }
                return infoList;
            }
            catch (Exception ex)
            {
                OracleHelper.ErrWriter(ex);
            }
            return null;
        }



        //端午专报
        public bool InsertDuanwuForecast(DateTime dt, Common.DuanwuForecastModel.DuanwuForecastInfo info, Common.DuanwuForecastModel.DuanwuForecastTBInfo TBinfo, string forecaster)
        {
            try
            {
                string strSQL = "";
                string strSQLTB = "";
                string str = "";
                string strID = "";
                string strIDTB = "";
                int result1 = 0;
                int result = 0;
                strSQL = "select recid from sf_duanwuforecast where ddatetime=to_date('" + dt.ToString("yyyy-MM-dd HH:mm") + "','yyyy-mm-dd hh24:mi')";
                strSQLTB = "select recid from sf_duanwuforecast_tb where ddatetime=to_date('" + dt.ToString("yyyy-MM-dd HH:mm") + "','yyyy-mm-dd hh24:mi')";
                OracleHelper oh = new OracleHelper("HAIKOUConnect");
                strID = oh.db_GreateQuery(strSQL);
                strIDTB = oh.db_GreateQuery(strSQLTB);
                if (strID.Length > 0)
                {
                    strSQL = "update sf_duanwuforecast set DDATETIME =to_date('" + dt.ToString("yyyy-MM-dd HH:mm") + "','yyyy-mm-dd hh24:mi') "
                             + ",FORECASTER='" + info.Forecaster + "'"
                                + ",WAETHERTREND='" + info.Weather_trend + "'"
                              + ",WEATHERFORECAST='" + info.Weather_details + "'"
                              + ",WEATHERPIC='" + info.Pic + "'"
                                + ",WEATHERPICDES='" + info.PicDes + "'"
                              + ",SUBHEAD='" + info.Subhead + "'"
                                  + ",FILEFLAG=0"
                             + " where RECID=" + strID;
                }
                else
                {
                    strSQL = "insert into sf_duanwuforecast(DDATETIME,FORECASTER,WAETHERTREND,WEATHERFORECAST,WEATHERPIC,WEATHERPICDES,SUBHEAD,recid) values("
                        + " to_date('" + dt.ToString("yyyy-MM-dd HH:mm") + "','yyyy-mm-dd hh24:mi') "
                        + ",'" + info.Forecaster + "'"
                        + ",'" + info.Weather_trend + "'"
                         + ",'" + info.Weather_details + "'"
                        + ",'" + info.Pic + "'"
                        + ",'" + info.PicDes + "'"
                            + ",'" + info.Subhead + "',SEQ_sf_duanwuforecast.Nextval)";
                }
                result1 = oh.db_ExecuteNonQuery(strSQL);

                //表格数据
                strSQLTB = "insert all into sf_duanwuforecast_tb(DDATETIME,FORECASTTIME,WEATHERPIC,WEATHER,TEMPERATURE,WIND,recid) ";
                for (int i = 0; i < TBinfo.Forecasttime.Length; i++)
                {
                    if (i == TBinfo.Forecasttime.Length - 1)
                    {
                        str += "values (to_date('" + dt.ToString("yyyy-MM-dd HH:mm") + "','yyyy-mm-dd hh24:mi') "
                        + ",'" + TBinfo.Forecasttime[i] + "'"
                             + ",'" + TBinfo.Weatherpic[i] + "'"
                             + ",'" + TBinfo.Weatherdes[i] + "'"
                             + ",'" + TBinfo.Temperature[i] + "'"
                                 + ",'" + TBinfo.Wind[i] + "',seq_sf_duanwuforecast_tb.Nextval) SELECT * FROM dual";
                    }
                    else
                    {
                        str += "values (to_date('" + dt.ToString("yyyy-MM-dd HH:mm") + "','yyyy-mm-dd hh24:mi') "
                        + ",'" + TBinfo.Forecasttime[i] + "'"
                             + ",'" + TBinfo.Weatherpic[i] + "'"
                             + ",'" + TBinfo.Weatherdes[i] + "'"
                             + ",'" + TBinfo.Temperature[i] + "'"
                                 + ",'" + TBinfo.Wind[i] + "',seq_sf_duanwuforecast_tb.Nextval) into sf_duanwuforecast_tb(DDATETIME,FORECASTTIME,WEATHERPIC,WEATHER,TEMPERATURE,WIND,recid) ";
                    }
                }
                strSQLTB += str;
                result = oh.db_ExecuteNonQuery(strSQLTB);

                if (result1 <= 0 || result <= 0)
                {
                    return false;
                }
            }
            catch (Exception ex)
            {
                return false;
            }
            return true;
        }

        public Common.DuanwuForecastModel.DuanwuForecastInfo GetDuanwuForecastInfo(DateTime dt)
        {
            Common.DuanwuForecastModel.DuanwuForecastInfo info = GetDuanwuForecastTBInfoNow(dt);
            return info;
        }

        private Common.DuanwuForecastModel.DuanwuForecastInfo GetDuanwuForecastTBInfoNow(DateTime dt)
        {
            try
            {
                Common.DuanwuForecastModel.DuanwuForecastInfo infoList = null;
                string strSQL = "select * from sf_duanwuforecast where  ddatetime = to_date('" + dt.ToString("yyyy-MM-dd HH:mm") + "','yyyy-mm-dd hh24:mi') ";
                OracleHelper oh = new OracleHelper("HAIKOUConnect");
                DataTable dTable = oh.ExecuteDataTable(strSQL);

                if (dTable != null && dTable.Rows.Count > 0)
                {
                    infoList = new Common.DuanwuForecastModel.DuanwuForecastInfo();
                    infoList.Ddatetime = dt.ToString("yyyy-MM-dd HH:mm");
                    infoList.Forecaster = dTable.Rows[0]["FORECASTER"].ToString();
                    infoList.Weather_trend = dTable.Rows[0]["WAETHERTREND"].ToString();
                    infoList.Weather_details = dTable.Rows[0]["WEATHERFORECAST"].ToString();
                    infoList.Pic = dTable.Rows[0]["WEATHERPIC"].ToString();
                    infoList.PicDes = dTable.Rows[0]["WEATHERPICDES"].ToString();
                    infoList.Subhead = dTable.Rows[0]["SUBHEAD"].ToString();
                }
                return infoList;
            }
            catch (Exception ex)
            {
                OracleHelper.ErrWriter(ex);
            }
            return null;
        }

        public Common.DuanwuForecastModel.DuanwuForecastTBInfo GetDuanwuForecastTBInfo(DateTime dt)
        {
            Common.DuanwuForecastModel.DuanwuForecastTBInfo info = GetDuanwuForecastInfoNow(dt);
            return info;
        }

        private Common.DuanwuForecastModel.DuanwuForecastTBInfo GetDuanwuForecastInfoNow(DateTime dt)
        {
            try
            {
                Common.DuanwuForecastModel.DuanwuForecastTBInfo infoList = null;
                string strSQL = "select * from sf_duanwuforecast_tb where  ddatetime = to_date('" + dt.ToString("yyyy-MM-dd HH:mm") + "','yyyy-mm-dd hh24:mi') ";
                OracleHelper oh = new OracleHelper("HAIKOUConnect");
                DataTable dTable = oh.ExecuteDataTable(strSQL);

                if (dTable != null && dTable.Rows.Count > 0)
                {
                    infoList = new Common.DuanwuForecastModel.DuanwuForecastTBInfo();
                    string[] Forecasttime = new string[dTable.Rows.Count];
                    string[] Weatherpic = new string[dTable.Rows.Count];
                    string[] Weatherdes = new string[dTable.Rows.Count];
                    string[] Temperature = new string[dTable.Rows.Count];
                    string[] Wind = new string[dTable.Rows.Count];

                    for (int i = 0; i < dTable.Rows.Count; i++)
                    {
                        infoList.Ddatetime = dt.ToString("yyyy-MM-dd HH:mm");
                        Forecasttime[i] = dTable.Rows[i]["FORECASTTIME"].ToString();
                        Weatherpic[i] = dTable.Rows[i]["WEATHERPIC"].ToString();
                        Weatherdes[i] = dTable.Rows[i]["WEATHER"].ToString();
                        Temperature[i] = dTable.Rows[i]["TEMPERATURE"].ToString();
                        Wind[i] = dTable.Rows[i]["WIND"].ToString();
                    }

                    infoList.Forecasttime = Forecasttime;
                    infoList.Weatherpic = Weatherpic;
                    infoList.Weatherdes = Weatherdes;
                    infoList.Temperature = Temperature;
                    infoList.Wind = Wind;
                }
                return infoList;
            }
            catch (Exception ex)
            {
                OracleHelper.ErrWriter(ex);
            }
            return null;
        }



        //高考专报
        public bool InsertGaokaoForecast(DateTime dt, Common.GaokaoForecastModel.GaokaoForecastInfo info, Common.GaokaoForecastModel.GaokaoForecastTBInfo TBinfo, string forecaster)
        {
            try
            {
                string strSQL = "";
                string strSQLTB = "";
                string str = "";
                string strID = "";
                string strIDTB = "";
                int result1 = 0;
                int result = 0;
                strSQL = "select recid from SF_GAOKAOFORECAST where ddatetime=to_date('" + dt.ToString("yyyy-MM-dd HH:mm") + "','yyyy-mm-dd hh24:mi')";
                strSQLTB = "select recid from SF_GAOKAOFORECAST_TB where ddatetime=to_date('" + dt.ToString("yyyy-MM-dd HH:mm") + "','yyyy-mm-dd hh24:mi')";
                OracleHelper oh = new OracleHelper("HAIKOUConnect");
                strID = oh.db_GreateQuery(strSQL);
                strIDTB = oh.db_GreateQuery(strSQLTB);
                if (strID.Length > 0)
                {
                    strSQL = "update SF_GAOKAOFORECAST set DDATETIME =to_date('" + dt.ToString("yyyy-MM-dd HH:mm") + "','yyyy-mm-dd hh24:mi') "
                             + ",FORECASTER='" + info.Forecaster + "'"
                                + ",WAETHERTREND='" + info.Weather_trend + "'"
                              + ",SUGGEST='" + info.Suggest + "'"
                              + ",SUBHEAD='" + info.Subhead + "'"
                                  + ",FILEFLAG=0"
                             + " where RECID=" + strID;
                }
                else
                {
                    strSQL = "insert into SF_GAOKAOFORECAST(DDATETIME,FORECASTER,WAETHERTREND,SUGGEST,SUBHEAD,recid) values("
                        + " to_date('" + dt.ToString("yyyy-MM-dd HH:mm") + "','yyyy-mm-dd hh24:mi') "
                        + ",'" + info.Forecaster + "'"
                        + ",'" + info.Weather_trend + "'"
                         + ",'" + info.Suggest + "'"
                            + ",'" + info.Subhead + "',seq_SF_GAOKAOFORECAST.Nextval)";
                }
                result1 = oh.db_ExecuteNonQuery(strSQL);

                //表格数据
                strSQLTB = "insert all into SF_GAOKAOFORECAST_TB(DDATETIME,FORECASTTIME,WEATHERPIC,WEATHER,TEMPERATURE,WIND,recid) ";
                for (int i = 0; i < TBinfo.Forecasttime.Length; i++)
                {
                    if (i == TBinfo.Forecasttime.Length - 1)
                    {
                        str += "values (to_date('" + dt.ToString("yyyy-MM-dd HH:mm") + "','yyyy-mm-dd hh24:mi') "
                        + ",'" + TBinfo.Forecasttime[i] + "'"
                             + ",'" + TBinfo.Weatherpic[i] + "'"
                             + ",'" + TBinfo.Weatherdes[i] + "'"
                             + ",'" + TBinfo.Temperature[i] + "'"
                                 + ",'" + TBinfo.Wind[i] + "',seq_SF_GAOKAOFORECAST_TB.Nextval) SELECT * FROM dual";
                    }
                    else
                    {
                        str += "values (to_date('" + dt.ToString("yyyy-MM-dd HH:mm") + "','yyyy-mm-dd hh24:mi') "
                        + ",'" + TBinfo.Forecasttime[i] + "'"
                             + ",'" + TBinfo.Weatherpic[i] + "'"
                             + ",'" + TBinfo.Weatherdes[i] + "'"
                             + ",'" + TBinfo.Temperature[i] + "'"
                                 + ",'" + TBinfo.Wind[i] + "',seq_SF_GAOKAOFORECAST_TB.Nextval) into SF_GAOKAOFORECAST_TB(DDATETIME,FORECASTTIME,WEATHERPIC,WEATHER,TEMPERATURE,WIND,recid) ";
                    }
                }
                strSQLTB += str;
                result = oh.db_ExecuteNonQuery(strSQLTB);

                if (result1 <= 0 || result <= 0)
                {
                    return false;
                }
            }
            catch (Exception ex)
            {
                return false;
            }
            return true;
        }

        public Common.GaokaoForecastModel.GaokaoForecastInfo GetGaokaoForecastInfo(DateTime dt)
        {
            Common.GaokaoForecastModel.GaokaoForecastInfo info = GetGaokaoForecastInfoNow(dt);
            return info;
        }

        private Common.GaokaoForecastModel.GaokaoForecastInfo GetGaokaoForecastInfoNow(DateTime dt)
        {
            try
            {
                Common.GaokaoForecastModel.GaokaoForecastInfo infoList = null;
                string strSQL = "select * from SF_GAOKAOFORECAST where  ddatetime = to_date('" + dt.ToString("yyyy-MM-dd HH:mm") + "','yyyy-mm-dd hh24:mi') ";
                OracleHelper oh = new OracleHelper("HAIKOUConnect");
                DataTable dTable = oh.ExecuteDataTable(strSQL);

                if (dTable != null && dTable.Rows.Count > 0)
                {
                    infoList = new Common.GaokaoForecastModel.GaokaoForecastInfo();
                    infoList.Ddatetime = dt.ToString("yyyy-MM-dd HH:mm");
                    infoList.Forecaster = dTable.Rows[0]["FORECASTER"].ToString();
                    infoList.Weather_trend = dTable.Rows[0]["WAETHERTREND"].ToString();
                    infoList.Suggest = dTable.Rows[0]["SUGGEST"].ToString();
                    infoList.Subhead = dTable.Rows[0]["SUBHEAD"].ToString();
                }
                return infoList;
            }
            catch (Exception ex)
            {
                OracleHelper.ErrWriter(ex);
            }
            return null;
        }

        public Common.GaokaoForecastModel.GaokaoForecastTBInfo GetGaokaoForecastTBInfo(DateTime dt)
        {
            Common.GaokaoForecastModel.GaokaoForecastTBInfo info = GetGaokaoForecastTBInfoNow(dt);
            return info;
        }

        private Common.GaokaoForecastModel.GaokaoForecastTBInfo GetGaokaoForecastTBInfoNow(DateTime dt)
        {
            try
            {
                Common.GaokaoForecastModel.GaokaoForecastTBInfo infoList = null;
                string strSQL = "select * from SF_GAOKAOFORECAST_TB where  ddatetime = to_date('" + dt.ToString("yyyy-MM-dd HH:mm") + "','yyyy-mm-dd hh24:mi') ";
                OracleHelper oh = new OracleHelper("HAIKOUConnect");
                DataTable dTable = oh.ExecuteDataTable(strSQL);

                if (dTable != null && dTable.Rows.Count > 0)
                {
                    infoList = new Common.GaokaoForecastModel.GaokaoForecastTBInfo();
                    string[] Forecasttime = new string[dTable.Rows.Count];
                    string[] Weatherpic = new string[dTable.Rows.Count];
                    string[] Weatherdes = new string[dTable.Rows.Count];
                    string[] Temperature = new string[dTable.Rows.Count];
                    string[] Wind = new string[dTable.Rows.Count];

                    for (int i = 0; i < dTable.Rows.Count; i++)
                    {
                        infoList.Ddatetime = dt.ToString("yyyy-MM-dd HH:mm");
                        Forecasttime[i] = dTable.Rows[i]["FORECASTTIME"].ToString();
                        Weatherpic[i] = dTable.Rows[i]["WEATHERPIC"].ToString();
                        Weatherdes[i] = dTable.Rows[i]["WEATHER"].ToString();
                        Temperature[i] = dTable.Rows[i]["TEMPERATURE"].ToString();
                        Wind[i] = dTable.Rows[i]["WIND"].ToString();
                    }

                    infoList.Forecasttime = Forecasttime;
                    infoList.Weatherpic = Weatherpic;
                    infoList.Weatherdes = Weatherdes;
                    infoList.Temperature = Temperature;
                    infoList.Wind = Wind;
                }
                return infoList;
            }
            catch (Exception ex)
            {
                OracleHelper.ErrWriter(ex);
            }
            return null;
        }


        //中考专报
        public bool InsertZhongkaoForecast(DateTime dt, Common.ZhongkaoForecastModel.ZhongkaoForecastInfo info, Common.ZhongkaoForecastModel.ZhongkaoForecastTBInfo TBinfo, string forecaster)
        {
            try
            {
                string strSQL = "";
                string strSQLTB = "";
                string str = "";
                string strID = "";
                string strIDTB = "";
                int result1 = 0;
                int result = 0;
                strSQL = "select recid from SF_ZHONGKAOFORECAST where ddatetime=to_date('" + dt.ToString("yyyy-MM-dd HH:mm") + "','yyyy-mm-dd hh24:mi')";
                strSQLTB = "select recid from SF_ZHONGKAOFORECAST_TB where ddatetime=to_date('" + dt.ToString("yyyy-MM-dd HH:mm") + "','yyyy-mm-dd hh24:mi')";
                OracleHelper oh = new OracleHelper("HAIKOUConnect");
                strID = oh.db_GreateQuery(strSQL);
                strIDTB = oh.db_GreateQuery(strSQLTB);
                if (strID.Length > 0)
                {
                    strSQL = "update SF_ZHONGKAOFORECAST set DDATETIME =to_date('" + dt.ToString("yyyy-MM-dd HH:mm") + "','yyyy-mm-dd hh24:mi') "
                             + ",FORECASTER='" + info.Forecaster + "'"
                                + ",WAETHERTREND='" + info.Weather_trend + "'"
                              + ",SUGGEST='" + info.Suggest + "'"
                                  + ",FILEFLAG=0"
                             + " where RECID=" + strID;
                }
                else
                {
                    strSQL = "insert into SF_ZHONGKAOFORECAST(DDATETIME,FORECASTER,WAETHERTREND,SUGGEST,recid) values("
                        + " to_date('" + dt.ToString("yyyy-MM-dd HH:mm") + "','yyyy-mm-dd hh24:mi') "
                        + ",'" + info.Forecaster + "'"
                        + ",'" + info.Weather_trend + "'"
                            + ",'" + info.Suggest + "',seq_SF_ZHONGKAOFORECAST.Nextval)";
                }
                result1 = oh.db_ExecuteNonQuery(strSQL);

                //表格数据
                strSQLTB = "insert all into SF_ZHONGKAOFORECAST_TB(DDATETIME,FORECASTTIME,WEATHERPIC,WEATHER,TEMPERATURE,WIND,recid) ";
                for (int i = 0; i < TBinfo.Forecasttime.Length; i++)
                {
                    if (i == TBinfo.Forecasttime.Length - 1)
                    {
                        str += "values (to_date('" + dt.ToString("yyyy-MM-dd HH:mm") + "','yyyy-mm-dd hh24:mi') "
                        + ",'" + TBinfo.Forecasttime[i] + "'"
                             + ",'" + TBinfo.Weatherpic[i] + "'"
                             + ",'" + TBinfo.Weatherdes[i] + "'"
                             + ",'" + TBinfo.Temperature[i] + "'"
                                 + ",'" + TBinfo.Wind[i] + "',SEQ_SF_ZHONGKAOFORECAST_TB.Nextval) SELECT * FROM dual";
                    }
                    else
                    {
                        str += "values (to_date('" + dt.ToString("yyyy-MM-dd HH:mm") + "','yyyy-mm-dd hh24:mi') "
                        + ",'" + TBinfo.Forecasttime[i] + "'"
                             + ",'" + TBinfo.Weatherpic[i] + "'"
                             + ",'" + TBinfo.Weatherdes[i] + "'"
                             + ",'" + TBinfo.Temperature[i] + "'"
                                 + ",'" + TBinfo.Wind[i] + "',SEQ_SF_ZHONGKAOFORECAST_TB.Nextval) into SF_ZHONGKAOFORECAST_TB(DDATETIME,FORECASTTIME,WEATHERPIC,WEATHER,TEMPERATURE,WIND,recid) ";
                    }
                }
                strSQLTB += str;
                result = oh.db_ExecuteNonQuery(strSQLTB);

                if (result1 <= 0 || result <= 0)
                {
                    return false;
                }
            }
            catch (Exception ex)
            {
                return false;
            }
            return true;
        }

        public Common.ZhongkaoForecastModel.ZhongkaoForecastInfo GetZhongkaoForecastInfo(DateTime dt)
        {
            Common.ZhongkaoForecastModel.ZhongkaoForecastInfo info = GetZhongkaoForecastInfoNow(dt);
            return info;
        }

        private Common.ZhongkaoForecastModel.ZhongkaoForecastInfo GetZhongkaoForecastInfoNow(DateTime dt)
        {
            try
            {
                Common.ZhongkaoForecastModel.ZhongkaoForecastInfo infoList = null;
                string strSQL = "select * from SF_ZHONGKAOFORECAST where  ddatetime = to_date('" + dt.ToString("yyyy-MM-dd HH:mm") + "','yyyy-mm-dd hh24:mi') ";
                OracleHelper oh = new OracleHelper("HAIKOUConnect");
                DataTable dTable = oh.ExecuteDataTable(strSQL);

                if (dTable != null && dTable.Rows.Count > 0)
                {
                    infoList = new Common.ZhongkaoForecastModel.ZhongkaoForecastInfo();
                    infoList.Ddatetime = dt.ToString("yyyy-MM-dd HH:mm");
                    infoList.Forecaster = dTable.Rows[0]["FORECASTER"].ToString();
                    infoList.Weather_trend = dTable.Rows[0]["WAETHERTREND"].ToString();
                    infoList.Suggest = dTable.Rows[0]["SUGGEST"].ToString();
                }
                return infoList;
            }
            catch (Exception ex)
            {
                OracleHelper.ErrWriter(ex);
            }
            return null;
        }

        public Common.ZhongkaoForecastModel.ZhongkaoForecastTBInfo GetZhongkaoForecastTBInfo(DateTime dt)
        {
            Common.ZhongkaoForecastModel.ZhongkaoForecastTBInfo info = GetZhongkaoForecastTBInfoNow(dt);
            return info;
        }

        private Common.ZhongkaoForecastModel.ZhongkaoForecastTBInfo GetZhongkaoForecastTBInfoNow(DateTime dt)
        {
            try
            {
                Common.ZhongkaoForecastModel.ZhongkaoForecastTBInfo infoList = null;
                string strSQL = "select * from SF_ZHONGKAOFORECAST_TB where  ddatetime = to_date('" + dt.ToString("yyyy-MM-dd HH:mm") + "','yyyy-mm-dd hh24:mi') ";
                OracleHelper oh = new OracleHelper("HAIKOUConnect");
                DataTable dTable = oh.ExecuteDataTable(strSQL);

                if (dTable != null && dTable.Rows.Count > 0)
                {
                    infoList = new Common.ZhongkaoForecastModel.ZhongkaoForecastTBInfo();
                    string[] Forecasttime = new string[dTable.Rows.Count];
                    string[] Weatherpic = new string[dTable.Rows.Count];
                    string[] Weatherdes = new string[dTable.Rows.Count];
                    string[] Temperature = new string[dTable.Rows.Count];
                    string[] Wind = new string[dTable.Rows.Count];

                    for (int i = 0; i < dTable.Rows.Count; i++)
                    {
                        infoList.Ddatetime = dt.ToString("yyyy-MM-dd HH:mm");
                        Forecasttime[i] = dTable.Rows[i]["FORECASTTIME"].ToString();
                        Weatherpic[i] = dTable.Rows[i]["WEATHERPIC"].ToString();
                        Weatherdes[i] = dTable.Rows[i]["WEATHER"].ToString();
                        Temperature[i] = dTable.Rows[i]["TEMPERATURE"].ToString();
                        Wind[i] = dTable.Rows[i]["WIND"].ToString();
                    }

                    infoList.Forecasttime = Forecasttime;
                    infoList.Weatherpic = Weatherpic;
                    infoList.Weatherdes = Weatherdes;
                    infoList.Temperature = Temperature;
                    infoList.Wind = Wind;
                }
                return infoList;
            }
            catch (Exception ex)
            {
                OracleHelper.ErrWriter(ex);
            }
            return null;
        }
    }
}
