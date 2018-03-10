using Common;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DAL
{
    public class LiveForecastDAL
    {
        public bool InsertLiveForecast(DateTime dt, Common.LiveForecastModel.LiveForecastInfo info, Common.LiveForecastModel.LiveForecastTBInfo TBinfo, string forecaster)
        {
            try
            {
                string strSQL = "";
                string strSQLTB = "";
                string strID = "";
                string strIDTB = "";
                int result1 = 0;
                int result=0;
                strSQL = "select recid from SF_LIVEFORECAST where ddatetime=to_date('" + dt.ToString("yyyy-MM-dd HH:mm") + "','yyyy-mm-dd hh24:mi')";
                strSQLTB = "select recid from SF_TROPICALSTORM_TB where ddatetime=to_date('" + dt.ToString("yyyy-MM-dd HH:mm") + "','yyyy-mm-dd hh24:mi')";
                OracleHelper oh = new OracleHelper("HAIKOUConnect");
                strID = oh.db_GreateQuery(strSQL);
                strIDTB = oh.db_GreateQuery(strSQLTB);
                DateTime updateTime = dt.AddHours(12);  //预报一下次更新时间
                if (strID.Length > 0)
                {
                    strSQL = "update SF_LIVEFORECAST set DDATETIME =to_date('" + dt.ToString("yyyy-MM-dd HH:mm") + "','yyyy-mm-dd hh24:mi') "
                             + ",FORECASTER='" + info.Forecaster + "'"
                             + ",SUMMARY='" + info.Summary + "'"
                             + ",RAINVAL='" + info.Rainval + "'"
                             + ",WINDVAL='" + info.Windval + "'"
                             + ",THREEHOUR_REPORTVAL='" + info.Threehour_reportval + "'"
                              + ",THREEDAY_REPORTVAL='" + info.Threeday_reportval + "'"
                               + ",WINDPIC='" + info.Windpic + "'"
                                + ",WINDPICDES='" + info.Windpicdes + "'"
                              + ",RAINPIC='" + info.Raindpic + "'"
                               + ",RAINPICDES='" + info.Rainpicdes + "'"
                               + ",DDATETIME =to_date('" + updateTime.ToString("yyyy-MM-dd HH:mm") + "','yyyy-mm-dd hh24:mi') "
                                  + ",FILEFLAG=0"
                             + " where RECID=" + strID;
                }
                else
                {
                    strSQL = "insert into SF_LIVEFORECAST(DDATETIME,FORECASTER,SUMMARY,RAINVAL,WINDVAL,THREEHOUR_REPORTVAL,THREEDAY_REPORTVAL,WINDPIC,WINDPICDES,RAINPIC,UPDATETIME,RAINPICDES) values("
                        + " to_date('" + dt.ToString("yyyy-MM-dd HH:mm") + "','yyyy-mm-dd hh24:mi') "
                        + ",'" + info.Forecaster + "'"
                        + ",'" + info.Summary + "'"
                        + ",'" + info.Rainval + "'"
                        + ",'" + info.Windval + "'"
                        + ",'" + info.Threehour_reportval + "'"
                        + ",'" + info.Threeday_reportval + "'"
                        + ",'" + info.Windpic + "'"
                         + ",'" + info.Windpicdes + "'"
                          + ",'" + info.Raindpic + "'"
                          + " ,to_date('" + updateTime.ToString("yyyy-MM-dd HH:mm") + "','yyyy-mm-dd hh24:mi') "
                            + ",'" + info.Rainpicdes + "')";
                }
                result1 = oh.db_ExecuteNonQuery(strSQL);

                //表格数据
                if (strIDTB.Length > 0)
                {
                    strSQLTB = "update SF_TROPICALSTORM_TB set DDATETIME =to_date('" + dt.ToString("yyyy-MM-dd HH:mm") + "','yyyy-mm-dd hh24:mi') "
                             + ",FORECASTTIME='" + TBinfo.Reporttime + "'"
                             + ",NAME='" + TBinfo.Name + "'"
                             + ",MIDDLEPOSITION='" + TBinfo.Middleposition + "'"
                             + ",STRENGTH='" + TBinfo.Strength + "'"
                             + ",WINDSPEED='" + TBinfo.Windspeed + "'"
                              + ",MIDDLEPRESSURE='" + TBinfo.Middlepressure + "'"
                               + ",REFERPOSITION='" + TBinfo.Referposition + "'"
                                + ",REPORT='" + TBinfo.Report + "'"
                             + " where RECID=" + strIDTB;
                }
                else
                {
                    strSQLTB = "insert into SF_TROPICALSTORM_TB(DDATETIME,FORECASTTIME,NAME,MIDDLEPOSITION,STRENGTH,WINDSPEED,MIDDLEPRESSURE,REFERPOSITION,REPORT) values("
                        + " to_date('" + dt.ToString("yyyy-MM-dd HH:mm") + "','yyyy-mm-dd hh24:mi') "
                        + ",'" + TBinfo.Reporttime + "'"
                        + ",'" + TBinfo.Name + "'"
                        + ",'" + TBinfo.Middleposition + "'"
                        + ",'" + TBinfo.Strength + "'"
                        + ",'" + TBinfo.Windspeed + "'"
                        + ",'" + TBinfo.Middlepressure + "'"
                         + ",'" + TBinfo.Referposition + "'"
                            + ",'" + TBinfo.Report + "')";
                }
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

        public Common.LiveForecastModel.LiveForecastInfo GetLiveForecastInfo(DateTime DDateTime)
        {
            Common.LiveForecastModel.LiveForecastInfo info = GetLiveForecastInfoNow(DDateTime);
            return info;
        }

        private LiveForecastModel.LiveForecastInfo GetLiveForecastInfoNow(DateTime DDateTime)
        {
            try
            {
                Common.LiveForecastModel.LiveForecastInfo infoList = null;
                string strSQL = "select * from sf_liveforecast where  ddatetime = to_date('" + DDateTime.ToString("yyyy-MM-dd HH:mm") + "','yyyy-mm-dd hh24:mi') ";
                OracleHelper oh = new OracleHelper("HAIKOUConnect");
                DataTable dTable = oh.ExecuteDataTable(strSQL);

                if (dTable != null && dTable.Rows.Count > 0)
                {
                    infoList = new Common.LiveForecastModel.LiveForecastInfo();
                    infoList.Ddatetime = DDateTime.ToString("yyyy-MM-dd HH:mm");
                    infoList.Forecaster = dTable.Rows[0]["FORECASTER"].ToString();
                    infoList.Summary = dTable.Rows[0]["SUMMARY"].ToString();
                    infoList.Rainval = dTable.Rows[0]["RAINVAL"].ToString();
                    infoList.Raindpic = dTable.Rows[0]["RAINPIC"].ToString();
                    infoList.Rainpicdes = dTable.Rows[0]["RAINPICDES"].ToString();
                    infoList.Windval = dTable.Rows[0]["WINDVAL"].ToString();
                    infoList.Windpic = dTable.Rows[0]["WINDPIC"].ToString();
                    infoList.Windpicdes = dTable.Rows[0]["WINDPICDES"].ToString();
                    infoList.Threehour_reportval = dTable.Rows[0]["THREEHOUR_REPORTVAL"].ToString();
                    infoList.Threeday_reportval = dTable.Rows[0]["THREEDAY_REPORTVAL"].ToString();
                }
                return infoList;
            }
            catch (Exception ex)
            {
                OracleHelper.ErrWriter(ex);
            }
            return null;
        }

        public Common.LiveForecastModel.LiveForecastTBInfo GetLiveForecastTBInfo(DateTime DDateTime)
        {
            Common.LiveForecastModel.LiveForecastTBInfo info = GetLiveForecastTBInfoNow(DDateTime);
            return info;
        }

        private LiveForecastModel.LiveForecastTBInfo GetLiveForecastTBInfoNow(DateTime DDateTime)
        {
            try
            {
                Common.LiveForecastModel.LiveForecastTBInfo infoList = null;
                string strSQL = "select * from SF_TROPICALSTORM_TB where  ddatetime = to_date('" + DDateTime.ToString("yyyy-MM-dd HH:mm") + "','yyyy-mm-dd hh24:mi') ";
                OracleHelper oh = new OracleHelper("HAIKOUConnect");
                DataTable dTable = oh.ExecuteDataTable(strSQL);

                if (dTable != null && dTable.Rows.Count > 0)
                {
                    infoList = new Common.LiveForecastModel.LiveForecastTBInfo();
                    infoList.Ddatetime = DDateTime.ToString("yyyy-MM-dd HH:mm");
                    infoList.Reporttime = dTable.Rows[0]["FORECASTTIME"].ToString();
                    infoList.Name = dTable.Rows[0]["NAME"].ToString();
                    infoList.Middleposition = dTable.Rows[0]["MIDDLEPOSITION"].ToString();
                    infoList.Strength = dTable.Rows[0]["STRENGTH"].ToString();
                    infoList.Windspeed = dTable.Rows[0]["WINDSPEED"].ToString();
                    infoList.Middlepressure = dTable.Rows[0]["MIDDLEPRESSURE"].ToString();
                    infoList.Referposition = dTable.Rows[0]["REFERPOSITION"].ToString();
                    infoList.Report = dTable.Rows[0]["REPORT"].ToString();
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
