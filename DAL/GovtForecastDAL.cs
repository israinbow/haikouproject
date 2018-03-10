using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DAL
{
    public class GovtForecastDAL
    {

        public bool InsertGovtForecast(DateTime dt, Common.GovtForecastModel.GovtForecastInfo info, Common.GovtForecastModel.GovtForecastTBInfo TBinfo, string forecaster)
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
                strSQL = "select recid from SF_GOVTFORECAST where ddatetime=to_date('" + dt.ToString("yyyy-MM-dd HH:mm") + "','yyyy-mm-dd hh24:mi')";
                strSQLTB = "select recid from SF_GOVTFORECAST_TB where ddatetime=to_date('" + dt.ToString("yyyy-MM-dd HH:mm") + "','yyyy-mm-dd hh24:mi')";
                OracleHelper oh = new OracleHelper("HAIKOUConnect");
                strID = oh.db_GreateQuery(strSQL);
                strIDTB = oh.db_GreateQuery(strSQLTB);
                if (strID.Length > 0)
                {
                    strSQL = "update SF_GOVTFORECAST set DDATETIME =to_date('" + dt.ToString("yyyy-MM-dd HH:mm") + "','yyyy-mm-dd hh24:mi') "
                             + ",FORECASTER='" + info.Forecaster + "'"
                             + ",EARLY_WEATHER='" + info.Early_weather + "'"
                                + ",HAIKOU_WEATHER='" + info.Haikou_weather + "'"
                                + ",SUGGEST='" + info.SuggestVal + "'"
                                + ",TRAFFICSUGGEST='" + info.TrafficpartVal + "'"
                              + ",FARMSUGGEST='" + info.FarmpartVal + "'"
                                  + ",FILEFLAG=0"
                             + " where RECID=" + strID;
                }
                else
                {
                    strSQL = "insert into SF_GOVTFORECAST(DDATETIME,FORECASTER,EARLY_WEATHER,HAIKOU_WEATHER,SUGGEST,TRAFFICSUGGEST,FARMSUGGEST,RECID) values("
                        + " to_date('" + dt.ToString("yyyy-MM-dd HH:mm") + "','yyyy-mm-dd hh24:mi') "
                        + ",'" + info.Forecaster + "'"
                        + ",'" + info.Early_weather + "'"
                        + ",'" + info.Haikou_weather + "'"
                        + ",'" + info.SuggestVal + "'"
                        + ",'" + info.TrafficpartVal + "'"
                            + ",'" + info.FarmpartVal + "',SEQ_SF_GOVTFORECAST.Nextval)";
                }
                result1 = oh.db_ExecuteNonQuery(strSQL);

                //表格数据
                strSQLTB = "insert all into SF_GOVTFORECAST_TB(DDATETIME,FORECASTTIME,WEATHERPIC,WEATHERDES,TEMPERATURE,WIND) ";
                for (int i = 0; i < TBinfo.Forecasttime.Length; i++)
                {
                    if (i == TBinfo.Forecasttime.Length - 1)
                    {
                        str += "values (to_date('" + dt.ToString("yyyy-MM-dd HH:mm") + "','yyyy-mm-dd hh24:mi') "
                        + ",'" + TBinfo.Forecasttime[i] + "'"
                             + ",'" + TBinfo.Weatherpic[i] + "'"
                             + ",'" + TBinfo.Weatherdes[i] + "'"
                             + ",'" + TBinfo.Temperature[i] + "'"
                                 + ",'" + TBinfo.Wind[i] + "') SELECT * FROM dual";
                    }
                    else
                    {
                        str += "values (to_date('" + dt.ToString("yyyy-MM-dd HH:mm") + "','yyyy-mm-dd hh24:mi') "
                        + ",'" + TBinfo.Forecasttime[i] + "'"
                             + ",'" + TBinfo.Weatherpic[i] + "'"
                             + ",'" + TBinfo.Weatherdes[i] + "'"
                             + ",'" + TBinfo.Temperature[i] + "'"
                                 + ",'" + TBinfo.Wind[i] + "') into SF_GOVTFORECAST_TB(DDATETIME,FORECASTTIME,WEATHERPIC,WEATHERDES,TEMPERATURE,WIND) ";
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

        public Common.GovtForecastModel.GovtForecastInfo GetGovtForecastInfo(DateTime dt)
        {
            Common.GovtForecastModel.GovtForecastInfo info = GetGovtForecastInfoNow(dt);
            return info;
        }

        private Common.GovtForecastModel.GovtForecastInfo GetGovtForecastInfoNow(DateTime dt)
        {
            try
            {
                Common.GovtForecastModel.GovtForecastInfo infoList = null;
                string strSQL = "select * from SF_GOVTFORECAST where  ddatetime = to_date('" + dt.ToString("yyyy-MM-dd HH:mm") + "','yyyy-mm-dd hh24:mi') ";
                OracleHelper oh = new OracleHelper("HAIKOUConnect");
                DataTable dTable = oh.ExecuteDataTable(strSQL);

                if (dTable != null && dTable.Rows.Count > 0)
                {
                    infoList = new Common.GovtForecastModel.GovtForecastInfo();
                    infoList.Ddatetime = dt.ToString("yyyy-MM-dd HH:mm");
                    infoList.Forecaster = dTable.Rows[0]["FORECASTER"].ToString();
                    infoList.Early_weather = dTable.Rows[0]["EARLY_WEATHER"].ToString();
                    infoList.Haikou_weather = dTable.Rows[0]["HAIKOU_WEATHER"].ToString();
                    infoList.SuggestVal = dTable.Rows[0]["SUGGEST"].ToString();
                    infoList.TrafficpartVal = dTable.Rows[0]["TRAFFICSUGGEST"].ToString();
                    infoList.FarmpartVal = dTable.Rows[0]["FARMSUGGEST"].ToString();
                }
                return infoList;
            }
            catch (Exception ex)
            {
                OracleHelper.ErrWriter(ex);
            }
            return null;
        }



        public Common.GovtForecastModel.GovtForecastTBInfo GetGovtForecastTBInfo(DateTime dt)
        {
            Common.GovtForecastModel.GovtForecastTBInfo info = GetGovtForecastTBInfoNow(dt);
            return info;
        }

        private Common.GovtForecastModel.GovtForecastTBInfo GetGovtForecastTBInfoNow(DateTime dt)
        {
            try
            {
                Common.GovtForecastModel.GovtForecastTBInfo infoList = null;
                string strSQL = "select * from SF_GOVTFORECAST_TB where  ddatetime = to_date('" + dt.ToString("yyyy-MM-dd HH:mm") + "','yyyy-mm-dd hh24:mi') ";
                OracleHelper oh = new OracleHelper("HAIKOUConnect");
                DataTable dTable = oh.ExecuteDataTable(strSQL);

                if (dTable != null && dTable.Rows.Count > 0)
                {
                    infoList = new Common.GovtForecastModel.GovtForecastTBInfo();
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
                        Weatherdes[i] = dTable.Rows[i]["WEATHERDES"].ToString();
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
