
using Common;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DAL
{
    /// <summary>
    /// 物理量监测数据获取类
    /// </summary>
    public class ScwcasDatas
    {
        public static List<string[]> Getprogramme(int levels)
        {
            List<string[]> fws_user = new List<string[]>();
            try
            {
                string connstr = ConfigurationManager.ConnectionStrings["EJETDB247ID"].ConnectionString;
                OracleHelper db = new OracleHelper(connstr);
                string sql = "select AGGREGATE,PRIMARYNAME from flooding_programme where LEVELS=" + levels;

                DataSet ds = db.ExecuteDataSet(sql);

                foreach (DataRow item in ds.Tables[0].Rows)
                {
                    string[] dvalue = new string[2];
                    dvalue[0] = item["AGGREGATE"].ToString();
                    dvalue[1] = item["PRIMARYNAME"].ToString();
                    fws_user.Add(dvalue);
                }
            }
            catch (Exception ee)
            {
                CreateLogTxt.ErrWriter(ee);
            }
            return fws_user;
        }
        /// <summary>
        /// 获取格点数据(新)
        /// </summary>
        /// <param name="IsFirstLoad">判断是否是第一次加载</param>
        /// <param name="model"></param>
        /// <param name="ybsx">预报时效</param>
        /// <returns></returns>
        public static Dictionary<int, DataTable> GetScwcasDatasToDB(string NewTime)
        {
            try
            {
                DateTime foretime = DateTime.Parse(DateTime.Now.ToString());
                DateTime.TryParse(NewTime, out foretime);
                int timelength = 48;//设置时效，数据的时效为0,,6,12...48
                Dictionary<int, DataTable> datas = new Dictionary<int, DataTable>();
                Dictionary<int, DataRow[]> dataRow = new Dictionary<int, DataRow[]>();
                StringBuilder strSql = new StringBuilder();
                OracleHelper oh = null;
                DataTable dt = null;
                strSql = new StringBuilder();
                strSql.Append("select DDATETIME,LEADTIME,KI,CAPE,QFLUX850,QFLUX925,T850_T500,WINDSHEAR,PW,T700_T500,RSH FROM T_SCWCAS_ECMWF_DATA");
                strSql.Append(" where ddatetime = to_date('" + NewTime + "', 'yyyy-mm-dd hh24:mi:ss')");

                oh = new OracleHelper("EJETDB247ID");
                dt = oh.ExecuteDataTable(strSql.ToString());

                if (dt == null || dt.Rows.Count == 0)
                {
                    return null;
                }
                for (int i = 0; i <= timelength; i++)
                {
                    if (i % 6 != 0)//取余得到i的值，此处的i为ybsx预报时效
                    {
                        continue;
                    }
                    DataRow[] drArr = dt.Select("LEADTIME='" + i + "'");
                    DataTable table = new DataTable();
                    table = dt.Clone();
                    foreach (var item in drArr)
                    {
                        table.Rows.Add(item.ItemArray);
                    }
                    if (!datas.ContainsKey(i))
                    {
                        datas.Add(i, table);
                    }
                }
                return datas;
            }
            catch (Exception ee)
            {
                CreateLogTxt.ErrWriter(ee);
            }
            return null;
        }

        //获取回溯显示数据——逐6小时、逐12小时预报（入库表）
        public static Dictionary<int, DataTable> GetOperatCatalogDatasToDB(string tableInfo)
        {
            try
            {
                //DateTime foretime = DateTime.Parse(DateTime.Now.ToString());
                //DateTime.TryParse(NewTime, out foretime);
                Dictionary<int, DataTable> datas = new Dictionary<int, DataTable>();
                Dictionary<int, DataRow[]> dataRow = new Dictionary<int, DataRow[]>();
                StringBuilder strSql = new StringBuilder();
                OracleHelper oh = null;
                DataTable dt = null;
                strSql = new StringBuilder();
                strSql.Append("select FORECASTTIME,WEATHERSTATUS,RAIN,WINDSPEED,WINDDIRECT,WINDCLASS,MAXTEMPERATURE,MINTEMPERATURE,RECID FROM  " + tableInfo + " order by RECID desc");
                oh = new OracleHelper("HAIKOUConnect");
                dt = oh.ExecuteDataTable(strSql.ToString());

                if (dt == null || dt.Rows.Count == 0)
                {
                    return null;
                }

                int i = 0;
                datas.Add(i, dt);
               
                return datas;

            }
            catch (Exception ee)
            {
                CreateLogTxt.ErrWriter(ee);
            }
            return null;
        }


        //获取回溯显示数据——逐6小时、逐12小时预报（入库登记表）
        public static Dictionary<int, DataTable> GetOperatCatalogDatasToDBRecord(string tableInfoRecord)
        {
            try
            {
                Dictionary<int, DataTable> datas = new Dictionary<int, DataTable>();
                Dictionary<int, DataRow[]> dataRow = new Dictionary<int, DataRow[]>();
                StringBuilder strSql = new StringBuilder();
                OracleHelper oh = null;
                DataTable dt = null;
                strSql = new StringBuilder();
                strSql.Append("select RECID,FORECASTER FROM " + tableInfoRecord + " order by RECID desc");
                oh = new OracleHelper("HAIKOUConnect");
                dt = oh.ExecuteDataTable(strSql.ToString());

                if (dt == null || dt.Rows.Count == 0)
                {
                    return null;
                }

                for (int i = 0; i <= dt.Rows.Count; i++)
                {
                    datas.Add(i, dt);
                }
                return datas;

            }
            catch (Exception ee)
            {
                CreateLogTxt.ErrWriter(ee);
            }
            return null;
        }


        //获取回溯显示数据——十天预报
        public static Dictionary<int, DataTable> GettenDayDatasToDB(string tableInfo)
        {
            try
            {
                //DateTime foretime = DateTime.Parse(DateTime.Now.ToString());
                //DateTime.TryParse(NewTime, out foretime);
                Dictionary<int, DataTable> datas = new Dictionary<int, DataTable>();
                Dictionary<int, DataRow[]> dataRow = new Dictionary<int, DataRow[]>();
                StringBuilder strSql = new StringBuilder();
                OracleHelper oh = null;
                DataTable dt = null;
                strSql = new StringBuilder();
                strSql.Append("select DDATETIME,WEATHERTODAY,RAIN,WINDSPEED,WINDDIRECT,HUMIDITY,MAXTEMP,MINTEMP,FORECASTER,RECID FROM  " + tableInfo + " order by recid desc");
                oh = new OracleHelper("HAIKOUConnect");
                dt = oh.ExecuteDataTable(strSql.ToString());

                if (dt == null || dt.Rows.Count == 0)
                {
                    return null;
                }

                int i = 0;
                datas.Add(i, dt);

                return datas;

            }
            catch (Exception ee)
            {
                CreateLogTxt.ErrWriter(ee);
            }
            return null;
        }

        //获取回溯显示数据——分区预报
        public static Dictionary<int, DataTable> GetZoneDatasToDB(string tableInfo)
        {
            try
            {
                //DateTime foretime = DateTime.Parse(DateTime.Now.ToString());
                //DateTime.TryParse(NewTime, out foretime);
                Dictionary<int, DataTable> datas = new Dictionary<int, DataTable>();
                Dictionary<int, DataRow[]> dataRow = new Dictionary<int, DataRow[]>();
                StringBuilder strSql = new StringBuilder();
                OracleHelper oh = null;
                DataTable dt = null;
                strSql = new StringBuilder();
                strSql.Append("select DDATETIME,TRACECOUNT,TRACEFLAG,ISEDIT,TRACEIMAGE,TRACECHART,PUSH1,PUSH2,FORECASTER,RECID FROM  " + tableInfo + " order by recid desc");
                oh = new OracleHelper("HAIKOUConnect");
                dt = oh.ExecuteDataTable(strSql.ToString());

                if (dt == null || dt.Rows.Count == 0)
                {
                    return null;
                }

                int i = 0;
                datas.Add(i, dt);

                return datas;

            }
            catch (Exception ee)
            {
                CreateLogTxt.ErrWriter(ee);
            }
            return null;
        }
    }
}
