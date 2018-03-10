using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DAL
{
    public class insertDatas
    {
        //决策预报
        public static bool DecisionData(string strData)
        {
            try
            {
                string[] strs = strData.Split('#');
                string forecaster=strs[0];
                string typhoon=strs[1];
                string weatherlive = strs[2];
                string weatherforecast = strs[3];
                string weatherlivepic = strs[4];
                string typhoonpic = strs[5];
                string suggest = strs[6];
                string strSql;
                int result = 0;

                OracleHelper oh = new OracleHelper("HAIKOUConnect");  
                strSql="insert into SF_DECISIONFORECAST(FORECASTER,TYPHOON,TYPHOONPIC,WEATHERLIVE,WEATHERLIVEPIC,WEATHERFORECAST,SUGGEST) values('" 
                        + forecaster + "'"
                        + ",'" + typhoon + "'"
                        + ",'" + typhoonpic + "'"
                        + ",'" + weatherlive + "'"
                        + ",'" + weatherlivepic + "'"
                        + ",'" + weatherforecast + "'"
                        + ",'" + suggest + "')";

                result = oh.db_ExecuteNonQuery(strSql);

                if (result <= 0)
                {
                    return false;
                }
                return true;
            }
            catch (Exception)
            {

            }
            return false;
        }

        //日常预报
        public static bool DailyForecastData(string strData)
        {
            try
            {
                string[] strs = strData.Split('#');
                DateTime ddatetime = DateTime.Parse(strs[0]);
                string forecaster = strs[1];
                string airpollute_reportVal = strs[2];
                string shorttime_reportVal = strs[3];
                string picDesArr = strs[4];
                string picArr = strs[5];
                string issueid = strs[6];
                string strID = "";
                string strSql;
                int result = 0;

                OracleHelper oh = new OracleHelper("HAIKOUConnect");
                strSql = "select recid from SF_DAILYFORECAST where ddatetime=to_date('" + ddatetime.ToString("yyyy-MM-dd HH:mm") + "','yyyy-mm-dd hh24:mi')";
                strID = oh.db_GreateQuery(strSql);

                if (strID.Length > 0)
                {
                    strSql = "update SF_DAILYFORECAST set FORECASTER='" + forecaster + "'"
                        + ",AIRPOLLUTE='" + airpollute_reportVal + "'"
                        + ",AIRPOLLUTEPIC='" + picArr + "'"
                        + ",PICCAPTION='" + picDesArr + "'"
                        + ",ISSUEID='" + issueid + "'"
                        + ",SHORTTIMEFORECAST='" + shorttime_reportVal + "'"
                        + " ,DDATETIME=to_date('" + ddatetime.ToString("yyyy-MM-dd HH:mm") + "', 'yyyy-mm-dd HH24:mi')"
                        + " where RECID=" + strID; 
                }
                else
                {
                    strSql = "insert into SF_DAILYFORECAST(DDATETIME,FORECASTER,AIRPOLLUTE,AIRPOLLUTEPIC,PICCAPTION,ISSUEID,SHORTTIMEFORECAST) values("
                        + " to_date('" + ddatetime.ToString("yyyy-MM-dd HH:mm") + "','yyyy-mm-dd hh24:mi') "
                        + ",'" + forecaster + "'"
                        + ",'" + airpollute_reportVal + "'"
                        + ",'" + picArr + "'"
                        + ",'" + picDesArr + "'"
                        + ",'" + issueid + "'"
                        + ",'" + shorttime_reportVal + "')";
                }
                result = oh.db_ExecuteNonQuery(strSql);

                if (result <= 0)
                {
                    return false;
                }
                return true;
            }
            catch (Exception)
            {

            }
            return false;
        }

        //月报
        public static bool MonthForecastData(string strData)
        {
            try
            {
                string[] strs = strData.Split('#');
                DateTime ddatetime = DateTime.Parse(strs[0]);
                string forecaster = strs[1];
                string decforecast = strs[2];
                string janforecast = strs[3];
                string earlyjanforecast = strs[4];
                string title1 = strs[5];
                string title2 = strs[6];
                string title3 = strs[7];
                string strSql;
                string strID = "";
                int result = 0;

                OracleHelper oh = new OracleHelper("HAIKOUConnect");
                strSql = "select recid from SF_MONTHFORECAST where ddatetime=to_date('" + ddatetime.ToString("yyyy-MM-dd HH:mm") + "','yyyy-mm-dd hh24:mi')";
                strID = oh.db_GreateQuery(strSql);

                if (strID.Length > 0)
                {
                    strSql = "update SF_MONTHFORECAST set FORECASTER='" + forecaster + "'"
                        + ",DECFORECAST='" + decforecast + "'"
                        + ",JANFORECAST='" + janforecast + "'"
                        + ",EARLYJANFORECAST='" + earlyjanforecast + "'"
                        + ",TITLE1='" + title1 + "'"
                        + ",TITLE2='" + title2 + "'"
                        + ",TITLE3='" + title3 + "'"
                        + " ,DDATETIME=to_date('" + ddatetime.ToString("yyyy-MM-dd HH:mm") + "', 'yyyy-mm-dd HH24:mi')"
                        + " where RECID=" + strID; 
                }
                else
                {
                    strSql = "insert into SF_MONTHFORECAST(DDATETIME,FORECASTER,DECFORECAST,JANFORECAST,TITLE1,TITLE2,TITLE3,EARLYJANFORECAST) values("
                        + " to_date('" + ddatetime.ToString("yyyy-MM-dd HH:mm") + "','yyyy-mm-dd hh24:mi') "
                        + ",'" + forecaster + "'"
                        + ",'" + decforecast + "'"
                        + ",'" + janforecast + "'"
                        + ",'" + title1 + "'"
                        + ",'" + title2 + "'"
                        + ",'" + title3 + "'"
                        + ",'" + earlyjanforecast + "')";
                }

                result = oh.db_ExecuteNonQuery(strSql);

                if (result <= 0)
                {
                    return false;
                }
                return true;
            }
            catch (Exception)
            {

            }
            return false;
        }


        //旬报
        public static bool periodMonthForecastData(string strData)
        {
            try
            {
                string[] strs = strData.Split('#');
                DateTime ddatetime = DateTime.Parse(strs[0]);
                string forecaster = strs[1];
                string middleMonth_detail = strs[2];
                string endMonth_detail = strs[3];
                string strSql;
                string strID = "";
                int result = 0;

                OracleHelper oh = new OracleHelper("HAIKOUConnect");
                strSql = "select recid from SF_PERIODMONTHFORECAST where ddatetime=to_date('" + ddatetime.ToString("yyyy-MM-dd HH:mm") + "','yyyy-mm-dd hh24:mi')";
                strID = oh.db_GreateQuery(strSql);

                if (strID.Length > 0)
                {
                    strSql = "update SF_PERIODMONTHFORECAST set FORECASTER='" + forecaster + "'"
                        + ",MIDDLEMONTH='" + middleMonth_detail + "'"
                        + ",LASTMONTH='" + endMonth_detail + "'"
                        + " ,DDATETIME=to_date('" + ddatetime.ToString("yyyy-MM-dd HH:mm") + "', 'yyyy-mm-dd HH24:mi')"
                        + " where RECID=" + strID; 
                }
                else
                {
                    strSql = "insert into SF_PERIODMONTHFORECAST(DDATETIME,FORECASTER,MIDDLEMONTH,LASTMONTH) values("
                        + " to_date('" + ddatetime.ToString("yyyy-MM-dd HH:mm") + "','yyyy-mm-dd hh24:mi') "
                        + ",'" + forecaster + "'"
                        + ",'" + middleMonth_detail + "'"
                        + ",'" + endMonth_detail + "')";
                }

                result = oh.db_ExecuteNonQuery(strSql);
                

                if (result <= 0)
                {
                    return false;
                }
                return true;
            }
            catch (Exception)
            {

            }
            return false;
        }
    }
}
