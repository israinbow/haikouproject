using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DAL
{
    public class FarmForecastDAL
    {

        public bool InsertFarmForecast(DateTime dt, Common.FarmForecastModel.FarmForecastInfo info, Common.FarmForecastModel.FarmForecastTBInfo TBinfo, string forecaster)
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
                strSQL = "select recid from SF_FARMFORECAST where ddatetime=to_date('" + dt.ToString("yyyy-MM-dd HH:mm") + "','yyyy-mm-dd hh24:mi')";
                strSQLTB = "select recid from SF_FARMFORECAST_TB where ddatetime=to_date('" + dt.ToString("yyyy-MM-dd HH:mm") + "','yyyy-mm-dd hh24:mi')";
                OracleHelper oh = new OracleHelper("HAIKOUConnect");
                strID = oh.db_GreateQuery(strSQL);
                strIDTB = oh.db_GreateQuery(strSQLTB);
                if (strID.Length > 0)
                {
                    strSQL = "update SF_FARMFORECAST set DDATETIME =to_date('" + dt.ToString("yyyy-MM-dd HH:mm") + "','yyyy-mm-dd hh24:mi') "
                             + ",FORECASTER='" + info.Forecaster + "'"
                             + ",EARLYWEATHER='" + info.Early_weather + "'"
                                + ",HAIKOUWEATHER='" + info.Haikou_weather + "'"
                                + ",LIZHISUGGEST='" + info.LizhiVal + "'"
                                + ",VEGETABLESUGGEST='" + info.VegetablesVal + "'"
                              + ",SHUIDAOSUGGEST='" + info.ShuidaoVal + "'"
                                  + ",FILEFLAG=0"
                             + " where RECID=" + strID;
                }
                else
                {
                    strSQL = "insert into SF_FARMFORECAST(DDATETIME,FORECASTER,EARLYWEATHER,HAIKOUWEATHER,LIZHISUGGEST,VEGETABLESUGGEST,SHUIDAOSUGGEST,RECID) values("
                        + " to_date('" + dt.ToString("yyyy-MM-dd HH:mm") + "','yyyy-mm-dd hh24:mi') "
                        + ",'" + info.Forecaster + "'"
                        + ",'" + info.Early_weather + "'"
                        + ",'" + info.Haikou_weather + "'"
                        + ",'" + info.LizhiVal + "'"
                        + ",'" + info.VegetablesVal + "'"
                            + ",'" + info.ShuidaoVal + "',SEQ_SF_FARMFORECAST.Nextval)";
                }
                result1 = oh.db_ExecuteNonQuery(strSQL);

                //表格数据
                strSQLTB = "insert all into SF_FARMFORECAST_TB(DDATETIME,FORECASTTIME,WEATHERPIC,WEATHERDES,TEMPERATURE,WIND) ";
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
                                 + ",'" + TBinfo.Wind[i] + "') into SF_FARMFORECAST_TB(DDATETIME,FORECASTTIME,WEATHERPIC,WEATHERDES,TEMPERATURE,WIND) ";
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

        public Common.FarmForecastModel.FarmForecastInfo GetFarmForecastInfo(DateTime dt)
        {
            Common.FarmForecastModel.FarmForecastInfo info = GetFarmForecastInfoNow(dt);
            return info;
        }

        private Common.FarmForecastModel.FarmForecastInfo GetFarmForecastInfoNow(DateTime dt)
        {
            try
            {
                Common.FarmForecastModel.FarmForecastInfo infoList = null;
                string strSQL = "select * from SF_FARMFORECAST where  ddatetime = to_date('" + dt.ToString("yyyy-MM-dd HH:mm") + "','yyyy-mm-dd hh24:mi') ";
                OracleHelper oh = new OracleHelper("HAIKOUConnect");
                DataTable dTable = oh.ExecuteDataTable(strSQL);

                if (dTable != null && dTable.Rows.Count > 0)
                {
                    infoList = new Common.FarmForecastModel.FarmForecastInfo();
                    infoList.Ddatetime = dt.ToString("yyyy-MM-dd HH:mm");
                    infoList.Forecaster = dTable.Rows[0]["FORECASTER"].ToString();
                    infoList.Early_weather = dTable.Rows[0]["EARLYWEATHER"].ToString();
                    infoList.Haikou_weather = dTable.Rows[0]["HAIKOUWEATHER"].ToString();
                    infoList.LizhiVal = dTable.Rows[0]["LIZHISUGGEST"].ToString();
                    infoList.VegetablesVal = dTable.Rows[0]["VEGETABLESUGGEST"].ToString();
                    infoList.ShuidaoVal = dTable.Rows[0]["SHUIDAOSUGGEST"].ToString();
                }
                return infoList;
            }
            catch (Exception ex)
            {
                OracleHelper.ErrWriter(ex);
            }
            return null;
        }

        public Common.FarmForecastModel.FarmForecastTBInfo GetFarmForecastTBInfo(DateTime dt)
        {
            Common.FarmForecastModel.FarmForecastTBInfo info = GetFarmForecastTBInfoNow(dt);
            return info;
        }

        private Common.FarmForecastModel.FarmForecastTBInfo GetFarmForecastTBInfoNow(DateTime dt)
        {
            try
            {
                Common.FarmForecastModel.FarmForecastTBInfo infoList = null;
                string strSQL = "select * from SF_FARMFORECAST_TB where  ddatetime = to_date('" + dt.ToString("yyyy-MM-dd HH:mm") + "','yyyy-mm-dd hh24:mi') ";
                OracleHelper oh = new OracleHelper("HAIKOUConnect");
                DataTable dTable = oh.ExecuteDataTable(strSQL);

                if (dTable != null && dTable.Rows.Count > 0)
                {
                    infoList = new Common.FarmForecastModel.FarmForecastTBInfo();
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
